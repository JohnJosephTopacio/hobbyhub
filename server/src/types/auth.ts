import { JwtPayload } from 'jsonwebtoken';

export interface RefreshPayload extends JwtPayload {
  sub: string;
  jti: string;
}

export interface AccessPayload extends JwtPayload {
  sub: string;
  jti: string;
}

export function isRefreshPayload(
  payload: JwtPayload | string | RefreshPayload,
): payload is RefreshPayload {
  return typeof payload !== 'string' && 'jti' in payload && 'sub' in payload;
}
