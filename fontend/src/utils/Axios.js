import axios from 'axios'

export const axiosInsatnce = axios.create({
    baseURL : 'http://localhost:3000/api',
    withCredentials : true
})