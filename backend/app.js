
// Inject the environment variables from .env to the process when it runs
import dotenv from "dotenv/config";

import express from "express";
const app = express();

const PORT = process.env.PORT || 8887;

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});