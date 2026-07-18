import { JwtPayload } from 'jsonwebtoken';

export interface RefreshPayload extends JwtPayload {
  jti: string;
}

export interface AccessPayload extends JwtPayload {
  sub: string;
  jti: string;
}

export function isRefreshPayload(
  payload: JwtPayload | string | RefreshPayload,
): payload is RefreshPayload {
  return (payload as RefreshPayload).jti !== undefined;
}
