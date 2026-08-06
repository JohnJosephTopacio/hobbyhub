import { setAccessToken } from './accessToken';
import { instance } from '../utils/axiosInstance';

export async function refreshToken(): Promise<string> {
  const response = await instance.get('/auth/refresh');
  setAccessToken(response.data.accessToken);
  return response.data.accessToken;
}
