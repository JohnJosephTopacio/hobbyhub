import { Outlet } from 'react-router';
import Nav from '@/shared/components/Navbar/Navbar';

export function AuthLayout() {
  return (
    <div className="bg-main min-h-screen flex flex-col">
      <div className="font-bold">About</div>
      <div className="flex flex-1">
        <div className="w-1/2">Art</div>
        <div className="w-1/2 flex justify-center items-center">
          <div className="bg-surface max-w-lg w-full h-[450px] shadow-[8px_8px_0px_0px_#d8ca9d]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
