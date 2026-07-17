import axios, { AxiosError, isAxiosError } from 'axios'
import { getAccessToken } from './accessToken';
import { handleAxiosError } from './axiosErrorHandler';
import { refreshToken } from './refreshToken';

interface ErrorResponse{
  message: string;
  statusCode: number;
  code: string;
}

let refreshPromise: Promise<string> | null = null;

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

instance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization =  `Bearer ${token}`;
    }
    return config;
  }
);

instance.interceptors.response.use(
  // called only if response status is 2xx
  (response) => {
    return response;
  },
  // if status is not 2xx - note: this catches everything in the promise chain
  async (error: AxiosError) => {    
    if (!isAxiosError<ErrorResponse>(error) || !error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // if the request that errored was a refresh, throw an error
    if (originalRequest.url === '/auth/refresh') {
      return Promise.reject(error);
    } 

    if (!error.response) {
      return Promise.reject(error);
    }

    // if invalid token or no token, as well as hasn't been retried yet, run a silent refresh
    if (
      error.response.data.statusCode === 401 && 
      (error.response.data.code === 'noTokenProvided' || 
      error.response.data.code === 'invalidToken') && 
      !originalRequest._retry
    ) {
      // mark the current retry
      originalRequest._retry = true;
       
      try {
        // refresh token only if the refresh hasn't started yet 
     
        if (!refreshPromise) {
          refreshPromise = refreshToken().finally(
            () => {
               refreshPromise = null;
              });
        }

        // otherwise just wait for the ongoing promise to finish
        await refreshPromise;
      } catch(error) {
        console.error(handleAxiosError(error));
        return Promise.reject(error);
      } 
      
      // if successful, retry original request
      return instance(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export { isAxiosError } from 'axios'; 
