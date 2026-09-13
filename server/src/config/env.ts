function validateEnv() {
  const required = [
    'NODE_ENV',
    'PORT',
    'DB',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_PORT',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'FRONTEND_SERVER_URL',
    'BCRYPT_COST_FACTOR',
  ];

  // check for missing environment variable values
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')} `);
  }

  const NODE_ENV: string = process.env.NODE_ENV!;
  // isNan is a valid value for a number type
  const PORT: number = Number(process.env.PORT!);
  const DB: string = process.env.DB!;
  const DB_HOST: string = process.env.DB_HOST!;
  const DB_USER: string = process.env.DB_USER!;
  const DB_PASSWORD: string = process.env.DB_PASSWORD!;
  const DB_PORT: number = Number(process.env.DB_PORT!);
  const JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET!;
  const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET!;
  const FRONTEND_SERVER_URL: string = process.env.FRONTEND_SERVER_URL!;
  const BCRYPT_COST_FACTOR: number = Number(process.env.BCRYPT_COST_FACTOR);

  if (isNaN(PORT)) {
    throw new Error('The environment variable PORT should be a number');
  }
  if (isNaN(DB_PORT)) {
    throw new Error('The environment variable DB_PORT should be a number');
  }

  return {
    NODE_ENV,
    PORT,
    DB,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_PORT,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    FRONTEND_SERVER_URL,
    BCRYPT_COST_FACTOR,
  };
}

export const env = validateEnv();
