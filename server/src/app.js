
// Auto-Injects the environment variables from .env to the process when it runs
import dotenv from 'dotenv/config';

import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth.js';
import { errorHandler } from './middleware/error.js';

const app = express(); 

const corsOptions = {
  origin: 'http://localhost:5173',
};

// Middlewares

// The browser can read the response as long as it's from the front-end vite server
app.use(cors(corsOptions));

// Parse incoming requests to JSON
app.use(express.json());

// Routers
app.use('/auth', authRouter);

// Handle all errors that bubble up
app.use(errorHandler);

const PORT = process.env.PORT || 8887;

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});