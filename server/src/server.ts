import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT || 8887;

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
