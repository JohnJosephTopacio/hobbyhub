import { instance } from '@/utils/axiosInstance';

interface RegisterResponse {
  message: string;
}

interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export async function register(input: RegisterRequest) {
  const response = await instance.post<RegisterResponse>('auth/register', input);
  return response.data;
}

interface LoginResponse {
  message: string;
  accessToken: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export async function login(input: LoginRequest) {
  const response = await instance.post<LoginResponse>('auth/login', input);
  return response.data;
}
