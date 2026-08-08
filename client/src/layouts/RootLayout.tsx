import { Outlet } from 'react-router';
import Nav from '@/shared/components/Navbar/Navbar';

export function RootLayout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}
