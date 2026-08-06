import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from '@/router';
import { AuthProvider } from './contexts/AuthContext';
import { env } from '@/config/env';
import './index.css';

const root = document.getElementById('root');
if (root === null) {
  throw new Error('Root element does not exist');
}

createRoot(root).render(
  <AuthProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </AuthProvider>,
);
