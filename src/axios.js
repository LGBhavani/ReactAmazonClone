import axios from "axios";

const instance = axios.create({
    baseURL: '...' // THE API (cloud func) URL
});

export default instance;