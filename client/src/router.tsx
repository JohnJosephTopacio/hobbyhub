import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/layouts/RootLayout';
import Register from '@/auth/pages/register/RegisterForm';
import Login from '@/auth/pages/login/LoginForm';
import Home from '@/pages/Home/Home';
import { AuthLayout } from './layouts/AuthLayout';
export const router = createBrowserRouter([
  {
    Component: AuthLayout,
    children: [
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
    ],
  },
  {
    Component: RootLayout,
    children: [{ path: 'home', Component: Home }],
  },
]);
