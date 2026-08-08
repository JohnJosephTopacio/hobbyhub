import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/layouts/RootLayout';
import Register from '@/auth/pages/register/RegisterForm';
import Login from '@/auth/pages/login/LoginForm';
import Home from '@/pages/Home/Home';
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        path: 'signup',
        Component: Register,
      },
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'home',
        Component: Home,
      },
    ],
  },
]);
