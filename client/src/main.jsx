import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' 
import { RouterProvider } from 'react-router'
import { router } from '@/router'
import '@/index.css'

if (!import.meta.env.VITE_BACKEND_SERVER_URL) {
  throw new Error("Backend Server URL not configured.");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
