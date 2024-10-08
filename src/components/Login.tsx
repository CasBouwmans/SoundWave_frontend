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
    return (<div>
        {!token || token === "" ? (
    <div className="flex flex-col items-center justify-center">
        <h1 className="font-serif text-4xl mt-4">Welcome to SoundWave</h1>
        <Image src={Logo} alt="Logo" className="" />                
        <a className="bg-blue-500 p-4 border-4 border-blue-600 bg-opacity-80 border-opacity-60 rounded-md" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login with Spotify</a>
    </div>
) : null}
    </div>)
}


