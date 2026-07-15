let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  return accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}