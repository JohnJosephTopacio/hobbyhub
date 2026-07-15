let accessToken: string | null = null;

function setAccessToken(token: string) {
  return accessToken = token;
}

function getAccessToken() {
  return accessToken;
}