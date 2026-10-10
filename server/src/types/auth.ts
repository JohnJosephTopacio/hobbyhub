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

export interface ClientMetadata {
  userAgent: string | undefined;
  clientName: string | undefined;
  operatingSystem: string | undefined;
  deviceType: string | undefined;
  initialIp: string | undefined;
}
