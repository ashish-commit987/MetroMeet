import { apiClient } from '@/config/axios.config';

export const doRegister = (userData: unknown) => {
    return apiClient.post('/api/v1/user/register', userData);
}

export const doLogin = (userData: unknown) => {
    return apiClient.post('/api/v1/user/login', userData);
}
