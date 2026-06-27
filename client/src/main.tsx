import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' 
import { RouterProvider } from 'react-router'
import { router } from '@/router'
import './index.css'

if (!import.meta.env.VITE_BACKEND_SERVER_URL) {
  throw new Error("Backend Server URL not configured.");
}

const root = document.getElementById('root');
if (root === null) {
  throw new Error('Root element does not exits');
}

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
