"use client";

import React from "react";
import { useState, useEffect } from "react";   
import axios from "axios";
import Logo from './Images/Logo.png';
import Play from './Images/Play.png'
import Pause from './Images/Pause.png'
import Previous from './Images/Previous.png'
import Next from './Images/Next.png'
import Image from "next/image";
import Login from "@/components/Login";
import Logout from "@/components/Logout";
import { SpotifyArtist, SpotifyAlbum, SpotifyTrack, SpotifyPlaylist } from '@/interfaces/SpotifyInterfaces'
import SearchArtist from "@/components/SearchArtist";
import ArtistList from "@/components/ArtistList";
import styles from "@/components/ScrollBar.module.css";


const App = () => {
    

    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState<SpotifyArtist[]>([])
    const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(null);
    const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<SpotifyAlbum | null>(null);
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
    const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false); // Voeg deze regel toe
    const [trackIsClicked, setTrackIsClicked] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1); // -1 betekent dat er nog geen track is geselecteerd
    
    const [maxHeight, setMaxHeight] = useState(610);
    const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);


    
    const fetchPlaylists = async () => {
        try {
            const { data } = await axios.get('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    limit: 50,
                    offset: 0,
                },
            });
            setPlaylists(data.items);  // Sla de playlists op in de state
            console.log(data);
        } catch (error) {
            console.error("Error fetching playlists: ", error);
        }
    };
    
    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");
        const tokenExpiry = window.localStorage.getItem("tokenExpiry");
    
        // Check of de token is verlopen
        if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("tokenExpiry");
            token = null; // Reset token als het verlopen is
        }
    
        if (!token && hash) {
            const tokenFragment = hash
                .substring(1)
                .split("&")
                .find((elem) => elem.startsWith("access_token"));
    
            if (tokenFragment) {
                token = tokenFragment.split("=")[1];
                const expiryTime = new Date().getTime() + 3600 * 1000; // 1 uur
                window.localStorage.setItem("token", token);
                window.localStorage.setItem("tokenExpiry", expiryTime.toString());
                window.location.hash = "";
                setToken(token);  // Stel token in na inloggen
            }
        } else if (token) {
            setToken(token);  // Stel token in als deze aanwezig is
        }
    }, []);
    
    useEffect(() => {
        if (token) {
            fetchPlaylists();  // Haal playlists op als de token beschikbaar is
        }
    }, [token]);
    
    
    // Renderfunctie voor playlists
    const renderPlaylists = () => {
        return playlists.map((playlist: SpotifyPlaylist) => (
            <div key={playlist.id} className="mb-4 hover:bg-gray-800 p-2 rounded-md m-2 cursor-pointer">
                {playlist.images.length > 0 && (
                    <Image
                        src={playlist.images[0].url}
                        alt={playlist.name}
                        width={100}
                        height={100}
                        className="rounded-md w-40 h-40 object-cover"
                    />
                )}
                <h2 style={{ width: 165 }}>
                    {playlist.name}
                </h2>
                <p className="text-sm text-gray-500">
                    {playlist.owner.display_name}
                </p>
            </div>
        ));
    };
    

  

    
    

    
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
    const fetchAlbumTracks = async (albumId: string) => {
        try {
            const { data } = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const trackDetails = await Promise.all(
                data.items.map(async (track: SpotifyTrack) => {
                    const trackData = await axios.get(`https://api.spotify.com/v1/tracks/${track.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    return trackData.data;  // De volledige trackgegevens met populariteit
                })
            );
            setTracks(trackDetails);  // Sla de volledige trackdetails op in de state
            console.log(trackDetails);
        } catch (error) {
            console.error("Error fetching tracks: ", error);
        }
    };

    const ArtistClick = (artist: SpotifyArtist) => {
        setSelectedArtist(artist);
        fetchAlbums(artist.id || "0")
        setArtists([]);              
        setTracks([]);                 
        setSelectedAlbum(null);   
    };
    const AlbumClick = (album: SpotifyAlbum) => {
        setSelectedAlbum(album);  // Zet het geselecteerde album
        fetchAlbumTracks(album.id);  // Haal de tracks van het album op
        setAlbums([]);  
    };

    const playTrack = (track: SpotifyTrack, index: number) => {
    if (currentTrack && currentTrack.id === track.id) {
        togglePlayPause();
        
        return;
    }

    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    if (track.preview_url) {
        const newAudio = new Audio(track.preview_url);
        newAudio.play();
        setCurrentTrack(track);
        setCurrentTrackIndex(index); // Stel de huidige track index in
        setAudio(newAudio);
        setIsPlaying(true);
        setTrackIsClicked(true);
        setMaxHeight(520);

        newAudio.addEventListener('ended', () => {
            setIsPlaying(false);
        });
    } else {
        alert("No preview available for this track.");
    }
};

    
    // Functie om afspelen/pauzeren om te schakelen
    const togglePlayPause = () => {
        if (audio) {
            if (isPlaying) {
                audio.pause(); // Pauzeer de huidige audio
                setIsPlaying(false); // Zet isPlaying op false
            } else {
                audio.play(); // Speel de huidige audio af
                setIsPlaying(true); // Zet isPlaying op true
            }
        }
    };
    const playPreviousTrack = () => {
        if (currentTrackIndex !== null && currentTrackIndex > 0) {
            const previousTrack = tracks[currentTrackIndex - 1];
            playTrack(previousTrack, currentTrackIndex - 1); // Speel de vorige track af
        }
    };
    
    // Functie om de volgende track af te spelen
    const playNextTrack = () => {
        if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1) {
            const nextTrack = tracks[currentTrackIndex + 1];
            playTrack(nextTrack, currentTrackIndex + 1); // Speel de volgende track af
        }
    };
    
    
    
    

    const renderArtists = () => {
        return artists.map((artist: SpotifyArtist) => (
            <ArtistList key={artist.id} artist={artist} onClick={ArtistClick} />
        ));
    }
    const renderAlbums = () => {
        return albums.map((album: SpotifyAlbum) => (
            <div key={album.id} className="mb-4 hover:bg-gray-800 p-2 rounded-md m-2 cursor-pointer" onClick={() => AlbumClick(album)}>
                {album.images.length > 0 && (
                    <Image
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
    const renderTracks = () => {
        if (!selectedAlbum) return null; // Controleer of er een album geselecteerd is
        const formatDuration = (durationMs: number) => {
            const minutes = Math.floor(durationMs / 60000);
            const seconds = ((durationMs % 60000) / 1000).toFixed(0);
            return `${minutes}:${seconds.padStart(2, '0')}`;  // Zorgt ervoor dat de seconden altijd twee cijfers zijn
        };

        return (
            <div className="flex flex-col w-full">
                {/* Flexbox container voor albumafbeelding en albumnaam */}
                <div className="flex items-center m-4">
                    {selectedAlbum.images.length > 0 && (
                        <Image
                            src={selectedAlbum.images[0].url}
                            alt={selectedAlbum.name}
                            width={100} // Pas aan op basis van jouw wensen
                            height={100} // Pas aan op basis van jouw wensen
                            className="rounded-md w-40 h-40 object-cover mr-4" // Voeg ruimte toe aan de rechterkant
                        />
                    )}
                    <div>
                        {/* Toon de albumnaam */}
                        <h2 className="text-5xl font-semibold">{selectedAlbum.name}</h2>
                        <p className="text-md text-gray-500 underline">Song Previews</p>
                    </div>
                </div>
                {/* Hier begin je met het weergeven van de tracks */}
                {tracks.map((track: SpotifyTrack, index: number) => (
                    <div key={track.id} className={`rounded-md m-2 flex items-center p-2 cursor-pointer 
                        ${currentTrack && currentTrack.id === track.id ? 'bg-gray-800' : 'hover:bg-gray-800'}`} onClick={() => playTrack(track, index)}>
                        <p className="text-lg m-2 mr-4 ml-4">{index + 1}</p>
                        <div className="mr-4">
                            <h3>{track.name}</h3>
                            <p className="text-sm text-gray-500">{track.artists.map((artist: SpotifyArtist) => artist.name).join(", ")}</p>
                        </div>
                        <div className="ml-auto">
                            <p className="text-sm text-gray-500">{formatDuration(track.duration_ms)}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    

    return (
        <div className="flex flex-col h-screen">
            {token && (
                <div className="flex justify-start p-4">
                    <Image src={Logo} alt="Logo" className="w-12 h-12" />   
                    <h1 className="font-serif text-2xl mt-2 ml-2">SoundWave</h1>   
                </div>
            )}
            <div className="flex justify-end p-4 absolute top-0 right-0 z-50">
                <Logout token={token} setToken={setToken}/>
            </div>
            <div className="absolute top-0 right-0 left-0 flex justify-center p-5">
                <SearchArtist token={token} searchKey={searchKey} setSearchKey={setSearchKey} setAlbums={setAlbums} setArtists={setArtists} setTracks={setTracks} setSelectedArtist={setSelectedArtist} setSelectedAlbum={setSelectedAlbum}/>
            </div>
            {!token && (
                <div className="flex flex-col items-center justify-start mx-4">
                    <Login token={token} />
                </div>
            )}
            
            <div className={`flex items-start ${trackIsClicked ? 'justify-center' : ''}`}>
                {token && (
                    <div
                        className={`flex flex-col bg-gray-900 rounded-lg overflow-y-auto ${styles.scrollContainer}`}
                        style={{ width: 440, minHeight: maxHeight, maxHeight: maxHeight }}
                    >
                        <h2 className="text-center text-white">Playlists</h2>
                        {renderPlaylists()}
                    </div>
                )}

                <div className="flex flex-col items-center justify-start ">
                    {token && (
                        <div
                            className={`flex flex-wrap justify-center bg-gray-900 rounded-lg overflow-y-auto ${styles.scrollContainer}`}
                            style={{ width: 600, minHeight: maxHeight, maxHeight: maxHeight }}
                        >
                            {/* Toon tracks als er een album geselecteerd is */}
                            {selectedAlbum ? (
                                renderTracks()
                            ) : selectedArtist ? (
                                /* Toon albums als er een artiest geselecteerd is */
                                renderAlbums()
                            ) : (
                                /* Toon artiesten als er geen artiest en geen album geselecteerd is */
                                renderArtists()
                            )}
                        </div>
                    )}
                </div>
                {token && trackIsClicked && (
                    <div
                        className={`flex flex-col bg-gray-900 rounded-lg overflow-y-auto ${styles.scrollContainer}`}
                        style={{ width: 440, minHeight: maxHeight, maxHeight: maxHeight }}
                    >
                        <h2 className="text-center text-white">Song Information</h2>

                    </div>
                )}
            </div>

    
       

            {token && trackIsClicked && (
                <div className="bg-gray-900 w-full h-24 fixed bottom-0 left-0 flex items-center justify-center">
                    <div className="relative w-full max-w-[200px] flex items-center justify-center">
                        <div className="absolute left-0 rounded-full bg-white cursor-pointer p-2 hover:scale-105" onClick={playPreviousTrack}>
                            <Image 
                            src={Previous} 
                            alt="Previous" 
                            width={32} 
                            height={32} 
                            className="w-5 h-5 flex items-center justify-center"
                            />
                        </div>
                        <div className="rounded-full bg-white cursor-pointer p-2 hover:scale-105"  onClick={isPlaying ? togglePlayPause : () => playTrack(currentTrack!, currentTrackIndex!)}>
                            <Image 
                            src={isPlaying ? Pause : Play} 
                            alt="VideoPlayer" 
                            width={32} 
                            height={32} 
                            className="w-5 h-5 flex items-center justify-center"                           
                            />
                        </div>
                        <div className="absolute right-0 rounded-full bg-white cursor-pointer p-2 hover:scale-105" onClick={playNextTrack}>
                            <Image 
                            src={Next} 
                            alt="Next" 
                            width={32} 
                            height={32} 
                            className="w-5 h-5 flex items-center justify-center"                        
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
