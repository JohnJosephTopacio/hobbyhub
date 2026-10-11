import { UAParser } from 'ua-parser-js';
import { ClientMetadata } from '../types/auth.js';

export function parseClientMetadata(
  userAgent: string | undefined,
  ipAddress: string | undefined,
): ClientMetadata {
  const parsedUserAgent = userAgent ? new UAParser(userAgent).getResult() : undefined;

  return {
    userAgent: parsedUserAgent?.ua,
    clientName: parsedUserAgent?.browser.name,
    operatingSystem: parsedUserAgent?.os.name,
    deviceType: parsedUserAgent?.device.type,
    ipAddress: ipAddress,
  };
}
