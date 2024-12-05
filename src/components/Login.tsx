import Image from "next/image";
import Logo from '@/app/Images/Logo.png';
import { getSpotifyLoginUrl } from "@/app/apiClient"; // Importeer de functie

interface LoginProps {
  token: string;
}

export default function Login({ token }: LoginProps) {


  return (
    <div>
      {!token || token === "" ? (
        <div className="flex flex-col items-center justify-center">        
          <Image src={Logo} alt="Logo" className="inline-block animate-pulse mt-2"/>     
          <h1 className="font-bold text-4xl mt-2">Welcome to the streaming service SoundWave</h1>     
          <h2 className="font-bold text-2xl m-4">Discover and review new music</h2>      
          <a className="bg-blue-500 p-4 border-4 border-blue-600 bg-opacity-80 border-opacity-60 rounded-md" href={getSpotifyLoginUrl()}>Login with Spotify</a>    
        </div>
      ) : null}
    </div>
  );


}
