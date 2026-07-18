
// Auto-Injects the environment variables from .env to the process when it runs
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

import { env } from './config/env.js'
import { errorHandler } from './middleware/error.js';
import authRouter from './routes/auth.js';

const app = express(); 

// Credentials field must be set to true for Access-Control-Allow-Credentials to be attached to header
const corsOptions = {
  origin: env.FRONTEND_SERVER_URL,
  credentials: true
};

/* Middlewares */

// The browser can read the response as long as it's from the front-end vite server
app.use(cors(corsOptions));

// Parse incoming requests to JSON
app.use(express.json());

// Parse the cookies in the incoming request
app.use(cookieParser());

// Routers
app.use('/auth', authRouter);

// Handle all errors that bubble up
app.use(errorHandler);

const PORT = env.PORT || 8887;

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});