import axios from "axios";

const instance = axios.create({
    baseURL: "https://localhost:7057/api/",
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    },
});

export default instance;