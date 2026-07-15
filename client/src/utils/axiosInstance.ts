import axios from 'axios'
import { getAccessToken } from './accessToken';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

instance.interceptors.request.use(
  (config) => {
    config.headers.Authorization =  `Bearer ${getAccessToken()}`;
    return config;
  }
)

export { isAxiosError } from 'axios'; 
