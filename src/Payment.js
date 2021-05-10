import React, { useState, useEffect } from 'react';
import CheckoutProduct from './CheckoutProduct';
import './Payment.css';
import { useStateValue } from './StateProvider';
import { Link, useHistory } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import axios from './axios';


const Payment = () => {
    const [{ basket, user }, dispatch] = useStateValue();
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [clientSecret, setClientSecret] = useState(true);
    const history = useHistory();
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        // generate the special stripe secret which allows us to charge a customer
        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                // Stripe expects a total in a currencies subunits
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });
            setClientSecret(response.data.clientSecret);
        }

        getClientSecret();
    }, [basket])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => { //destructured response
            // paymentIntent = payment confirmation

            setSucceeded(true);
            setError(null);
            setProcessing(false);

            history.replace('/orders'); //this is so that the user does not come back to the payment page even if he/she presses the back button,so here basically swapping the page

        })
    }

    const handleChange = e => {
        setDisabled(e.empty);
        setError(e.error ? e.error.message : "");
    }

    return (
        <div className='payment'>
            <div className='payment__container'>
                <h1>
                    Checkout(
                        <Link to="/checkout">{basket?.length} items</Link>
                    )
                </h1>
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Delivery Address</h3>
                    </div>
                    <div className='payment__address'>
                        <p>{user?.email}</p>
                        <p>123 React Lane</p>
                        <p>Los Angeles, CA</p>
                    </div>
                </div>
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className='payment__items'>
                        {basket.map(item =>
                            <CheckoutProduct
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />)}
                    </div>
                </div>

                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Payment method</h3>
                    </div>
                    <div className='payment__details'>
                        {/* Stripe */}
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange} />

                            <div className='payment__priceContainer'>
                                <CurrencyFormat
                                    renderText={(value) => (
                                        <h3>Order Total: {value}</h3>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                                </button>
                            </div>
                            {error && <div>{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment;