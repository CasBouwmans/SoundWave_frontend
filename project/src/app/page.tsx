"use client";

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
    const [artists, setArtists] = useState<SpotifyArtist[]>([])
    const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(null);
    const [albums, setAlbums] = useState([]); // Hier kun je ook een type voor albums toevoegen

    interface SpotifyArtist {
        external_urls: {
          spotify: string;
        };
        followers: {
          href: string | null;
          total: number;
        };
        genres: string[];
        href: string;
        id: string;
        images: Array<{
          height: number;
          url: string;
          width: number;
        }>;
        name: string;
        popularity: number;
        type: "artist";
        uri: string;
    }
    interface SpotifyAlbum {
        id: string;
        name: string;
        images: Array<{ url: string; height: number; width: number }>;
        release_date: string;
    }

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            const tokenFragment = hash
                .substring(1)
                .split("&")
                .find((elem) => elem.startsWith("access_token"));

            if (tokenFragment) {
                token = tokenFragment.split("=")[1];
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

    const fetchArtists = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setAlbums([]);

        const { data } = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist"
            }
        });

        console.log(data);
        setArtists(data.artists.items);
    }

    const fetchAlbums = async (artistId: string) => {
        const { data } = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                include_groups: "album,single",
                market: "ES",
            },
        });
        console.log(data)
        setAlbums(data.items);
    };

    const ArtistClick = (artist: SpotifyArtist) => {
        setSelectedArtist(artist);
        fetchAlbums(artist.id);
    };

    const renderArtists = () => {
        return artists.map((artist: SpotifyArtist) => (
            <div key={artist.id} className="mb-4 hover:bg-gray-800 p-2 rounded-md m-2" onClick={() => ArtistClick(artist)}>
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
    const renderAlbums = () => {
        return albums.map((album: SpotifyAlbum) => (
            <div key={album.id} className="mb-4 hover:bg-gray-800 p-2 rounded-md m-2">
                {album.images.length > 0 && (
                    <img
                        src={album.images[0].url}
                        alt={album.name}
                        width={100}
                        height={100}
                        className="rounded-md w-40 h-40 object-cover"
                    />
                )}
                <h2 style={{width: 165}}>
                    {album.name}
                </h2>
                <p className="text-sm text-gray-500">
                    Released on: {album.release_date}
                </p>
            </div>
        ));
    }

    return (
        <div className="flex flex-col h-screen">
            {token && (
                <div className="flex justify-start p-4">
                    <Image src={Logo} alt="Logo" className="w-12 h-12" />   
                    <h1 className="font-serif text-2xl mt-2 ml-2">SoundWave</h1>   
                </div>
            )}
            <div className="flex justify-end p-4 absolute top-0 right-0 z-50">
                {token && (
                    <button onClick={logout} className="bg-blue-500 p-2 border-4 border-blue-600 rounded-md">
                        Logout
                    </button>
                )}
            </div>
            <div className="absolute top-0 right-0 left-0 flex justify-center p-5">
                {token ? (
                    <form onSubmit={fetchArtists}>
                        <input type="text" onChange={e => setSearchKey(e.target.value)} className="text-white bg-gray-900 rounded-l-full hover:bg-gray-800 p-2 w-96" />
                        <button type={"submit"} className="bg-blue-500 border-4 border-blue-600 rounded-r-full p-1">Search</button>
                    </form>   
                ) : null}
            </div>
            <div className="flex justify-center items-center">                 
                <div className="flex flex-col items-center justify-center">
                    {!token ? (
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="font-serif text-4xl mt-4">Welcome to SoundWave</h1>
                            <Image src={Logo} alt="Logo" className="" />                
                            <a className="bg-blue-500 p-4 border-4 border-blue-600 rounded-md" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login with Spotify</a>
                        </div>
                    ) : null}
                    {token && (
                        <div className="flex flex-wrap justify-center bg-gray-900 rounded-lg m-5" style={{width: 600}}>
                            {albums.length === 0 ? (
                                renderArtists()  // Laat artiesten zien als er geen albums zijn
                            ) : (
                                renderAlbums()   // Laat albums zien als er albums zijn
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
