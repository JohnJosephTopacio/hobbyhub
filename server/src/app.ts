// Auto-Injects the environment variables from .env to the process when it runs
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { errorHandler } from './middleware/error.js';

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import hobbiesRouter from './routes/hobbies.js';
import profileRouter from './routes/profile.js';

const app = express();

// Credentials field must be set to true for Access-Control-Allow-Credentials to be attached to header
const corsOptions = {
  origin: env.FRONTEND_SERVER_URL,
  credentials: true,
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
app.use('/users', usersRouter);
app.use('/hobbies', hobbiesRouter);
app.use('/profile', profileRouter);

// Handle all errors that bubble up
app.use(errorHandler);

export default app;
