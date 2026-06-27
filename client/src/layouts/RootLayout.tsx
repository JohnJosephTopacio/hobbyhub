import { Outlet } from 'react-router';
import Nav from '@/components/Navbar/Navbar'

export function RootLayout () {
  return (
    <>
      <Nav/>
      <Outlet/>
    </>
  );
}