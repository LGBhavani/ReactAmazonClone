// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAwGXkCO3F9XN4PgnVQ61tzVDHgX3wHl5E",
    authDomain: "clone-bf59b.firebaseapp.com",
    projectId: "clone-bf59b",
    storageBucket: "clone-bf59b.appspot.com",
    messagingSenderId: "130201024077",
    appId: "1:130201024077:web:9173a6612e01b2244c8e04",
    measurementId: "G-YFYBV856FX"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

export { db, auth };