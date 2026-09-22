import { Outlet } from 'react-router';
import Nav from '@/shared/components/Navbar';

export function RootLayout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}
