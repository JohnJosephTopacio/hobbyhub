import { setAccessToken } from './accessToken';
import { authInstance } from '../utils/axiosInstance';

export async function refreshToken(): Promise<string> {
  const response = await authInstance.get('/auth/refresh');
  setAccessToken(response.data.accessToken);
  return response.data.accessToken;
}
