import Image from "next/image";
import Logo from '@/app/Images/Logo.png';
import { getSpotifyLoginUrl } from "@/app/apiClient"; // Importeer de functie
import React from 'react';

interface LoginProps {
  token: string;
}

export default function Login({ token }: LoginProps) {


  return (
    <div>
      {!token || token === "" ? (
        <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8">
          <Image
            src={Logo}
            alt="Logo"
            className="inline-block animate-pulse mt-4 sm:mt-6"
          />
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl mt-4 sm:mt-6">
            Welcome to the streaming service SoundWave
          </h1>
          <h2 className="font-bold text-lg sm:text-xl md:text-2xl m-4">
            Discover and review new music
          </h2>
          <a
            className="bg-blue-500 p-3 sm:p-4 border-2 sm:border-4 border-blue-600 bg-opacity-80 border-opacity-60 rounded-md mt-4 hover:bg-blue-600 transition duration-300"
            href={getSpotifyLoginUrl()}
          >
            Login with Spotify
          </a>
        </div>
      ) : null}
    </div>

  );


}
