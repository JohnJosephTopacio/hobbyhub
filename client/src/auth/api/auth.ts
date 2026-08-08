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
  return await instance.post<RegisterResponse>('auth/register', input);
}
