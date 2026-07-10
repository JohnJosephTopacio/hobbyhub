import axios from 'axios'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

export { isAxiosError } from 'axios'; 
