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
  return instance.post<RegisterResponse>('auth/register', input);
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
  return await instance.post<LoginResponse>('auth/login', input);
}
