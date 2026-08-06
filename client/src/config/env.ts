export const env = {
  BACKEND_SERVER_URL: import.meta.env.VITE_BACKEND_SERVER_URL,
};

if (!env.BACKEND_SERVER_URL) {
  throw new Error('Backend Server URL not configured.');
}
