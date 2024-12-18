import axios from "axios";

const baseUrlDelete = axios.create({
    baseURL: 'https://restaurantmanagement.azurewebsites.net/api/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        'x-api-key': '30B34DCD-1CC0-4AAF-B622-7982847F221F'

    }
});

export default baseUrlDelete;