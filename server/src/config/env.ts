function validateEnv() {
  const required = [
    'NODE_ENV',
    'PORT',
    'DB',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_PORT',
    'JWT_SECRET',
    'FRONTEND_SERVER_URL'
  ]

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')} `);
  }

  
    const NODE_ENV: string = process.env.NODE_ENV!
    const PORT: string = process.env.PORT!
    const DB: string = process.env.DB!
    const DB_HOST: string = process.env.DB_HOST! 
    const DB_USER: string = process.env.DB_USER!
    const DB_PASSWORD: string = process.env.DB_PASSWORD! 
    const DB_PORT: string = process.env.DB_PORT!
    const JWT_SECRET: string = process.env.JWT_SECRET! 
    const FRONTEND_SERVER_URL: string = process.env.FRONTEND_SERVER_URL!

    return {
      NODE_ENV,
      PORT,
      DB,
      DB_HOST,
      DB_USER,
      DB_PASSWORD,
      DB_PORT,
      JWT_SECRET,
      FRONTEND_SERVER_URL
    }
  
}

export const env = validateEnv();