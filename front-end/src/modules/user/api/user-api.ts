import axios from 'axios';
const API_BASE_URL=import.meta.env.VITE_API_URL;
axios.defaults.baseURL=API_BASE_URL;

export const doRegister=(userData:unknown)=>{
    return axios.post('register',userData);
}

export const doLogin=(userData:unknown)=>{
    return axios.post('login',userData);
}
