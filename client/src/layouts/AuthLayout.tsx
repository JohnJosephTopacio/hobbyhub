import { Outlet } from 'react-router';
import art from '@/assets/hobbyhub_art.svg';

export function AuthLayout() {
  return (
    <div className="bg-main min-h-screen flex flex-col text-text-main">
      <div className="font-bebas pl-8 pt-4 text-xl">About</div>
      <div className="flex flex-1">
        <div className="w-1/2 flex flex-col justify-end items-center">
          <h1 className="text-8xl font-bebas pr-22">HobbyHub</h1>
          <h2 className="text-lg font-bold pb-10 pr-22">Your hobby has a home here.</h2>
          <img className="max-w-lg" src={art} alt="Hobbyhub Auth Page Art" />
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <div className="bg-surface max-w-lg w-full h-[470px] shadow-[8px_8px_0px_0px_#d8ca9d] p-12">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
