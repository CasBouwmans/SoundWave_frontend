"use client"

import React from "react";
import { useState, useEffect } from "react";   
import axios from "axios";

import Logo from './Images/Logo.png';
import Image from "next/image";

const App = () => {
    const CLIENT_ID = "a09667c15c22466f8ea2f0363cf98617"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])

    interface SpotifyArtist {
        external_urls: {
          spotify: string; // URL naar de Spotify-pagina van de artiest
        };
        followers: {
          href: string | null; // Kan null zijn of een string
          total: number; // Totaal aantal volgers
        };
        genres: string[]; // Array van genre-strings
        href: string; // URL naar de API-informatie van de artiest
        id: string; // Unieke ID van de artiest
        images: Array<{
          height: number; // Hoogte van de afbeelding
          url: string; // URL van de afbeelding
          width: number; // Breedte van de afbeelding
        }>; // Array van afbeeldingen
        name: string; // Naam van de artiest
        popularity: number; // Populariteitsscore
        type: "artist"; // Type van het object (altijd "artist" in dit geval)
        uri: string; // Spotify URI van de artiest
      }

    useEffect( () => {
      
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            const tokenFragment = hash
                .substring(1)
                .split("&")
                .find((elem) => elem.startsWith("access_token"));
            
            // Controleer of tokenFragment bestaat en split het pas dan
            if (tokenFragment) {
                token = tokenFragment.split("=")[1];

                // Sla het token op en reset de hash
                window.location.hash = "";
                window.localStorage.setItem("token", token);
                setToken(token);
            }
        
    }

    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    
      

    const searchArtists = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist"
            }
        })

        console.log(data);
        setArtists(data.artists.items)
    }

    
    const renderArtists = () => {
        return artists.map((artist: SpotifyArtist, index) => (
            <div key={artist.id} className="mb-4 hover:bg-gray-800 p-2 rounded-md m-2">
                
                {artist.images.length > 0 && (
                    <img
                        src={artist.images[0].url}
                        alt={artist.name}
                        width={100}
                        height={100}
                        className="rounded-full w-40 h-40 object-cover"
                        
                    />
                )}
                <h2 style={{width: 165}}>
                    {artist.name}
                </h2>
                <p className="text-sm text-gray-500">
                    {artist.type}
                </p>
            </div>
        ));
    }
    // const renderArtistsAlbums = () => {
    //     return artists.map((artist))
    // }

    return (
        <div className="flex flex-col h-screen">
            {token && (
            <div className="flex justify-start p-4">
            <Image src={Logo} alt="Logo" className="w-12 h-12" />      
            </div>
            )}
        <div className="flex justify-end p-4 absolute top-0 right-0 z-50">
            {/* Voeg hier andere items toe die je ook bovenaan wilt, als dat nodig is */}
            {token && (
                <button onClick={logout} className="bg-blue-500 p-2 border-4 border-blue-600 rounded-md">
                    Logout
                </button>
            )}
        </div>
        <div className="absolute top-0 right-0 left-0 flex justify-center p-5">
            {token ?
                    <form onSubmit={searchArtists}>
                        <input type="text" onChange={e => setSearchKey(e.target.value)} className="text-white bg-gray-900 rounded-l-full hover:bg-gray-800 p-2 w-96"></input>
                        <button type={"submit"} className="bg-blue-500 border-4 border-blue-600 rounded-r-full p-1">Search</button>
                    </form>   
                : []}
        </div>

        <div className="flex justify-center items-center">                 
            <div className="flex flex-col items-center justify-center">

                {!token ?
                <div className="flex flex-col items-center justify-center">
                <h1 className="font-serif text-4xl mt-4">Welcome to SoundWave</h1>
                <Image src={Logo} alt="Logo" className="" />                
                <a className="bg-blue-500 p-4 border-4 border-blue-600 rounded-md" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login with Spotify</a>
                </div>
                : []}
            
            {token && (
            <div className="flex flex-wrap justify-center bg-gray-900 rounded-lg m-5" style={{width: 600}}>
                {renderArtists()}
            </div>
        )}
            </div>
            </div>
        </div>
    );
}

export default App;