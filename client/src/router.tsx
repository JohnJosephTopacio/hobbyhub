import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/layouts/RootLayout';
import SignUp from '@/auth/pages/register/registerForm';
import Login from '@/auth/pages/login/LoginForm';
import Home from '@/pages/Home/Home';
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        path: 'signup',
        Component: SignUp,
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
