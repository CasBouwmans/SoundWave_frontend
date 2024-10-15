import Image from "next/image";
import Logo from '@/app/Images/Logo.png';

interface LoginProps {
    token: string

}

export default function Login(
    {token}:LoginProps
){
    const CLIENT_ID = "a09667c15c22466f8ea2f0363cf98617"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPES = 'user-read-private,user-read-email,playlist-read-private,playlist-read-collaborative';
    
    return (<div>
        {!token || token === "" ? (
    <div className="flex flex-col items-center justify-center">        
        <Image src={Logo} alt="Logo" className="" />     
        <h1 className="font-bold text-4xl mt-2">Welcome to the streaming service SoundWave</h1>     
        <h2 className="font-bold text-2xl m-4">Discover and enjoy new music</h2>      
        <a className="bg-blue-500 p-4 border-4 border-blue-600 bg-opacity-80 border-opacity-60 rounded-md" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}>Login with Spotify</a>    </div>
) : null}
    </div>)
}


