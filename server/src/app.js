
// Auto-Injects the environment variables from .env to the process when it runs
import dotenv from 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './db/db.js';

const app = express(); 

const corsOptions = {
  origin: 'http://localhost:5173',
};

// The browser can read the response as long as it's from the front-end vite server
app.use(cors(corsOptions))

// Middleware
app.use(express.json());

import authRouter from './routes/auth.js';

app.use('/auth', authRouter);

const PORT = process.env.PORT || 8887;

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});