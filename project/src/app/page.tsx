"use client";

import React from "react";
import { useState, useEffect } from "react";   
import axios from "axios";
import Logo from './Images/Logo.png';
import Play from './Images/Play.png'
import Pause from './Images/Pause.png'
import Image from "next/image";
import Login from "@/components/Login";
import Logout from "@/components/Logout";
import { SpotifyArtist, SpotifyAlbum, SpotifyTrack } from '@/interfaces/SpotifyInterfaces'
import SearchArtist from "@/components/SearchArtist";
import ArtistList from "@/components/ArtistList";


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
                data.items.map(async (track: any) => {
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
        fetchAlbums(artist.id);
        setArtists([]);              
        setTracks([]);                 
        setSelectedAlbum(null);   
    };
    const AlbumClick = (album: SpotifyAlbum) => {
        setSelectedAlbum(album);  // Zet het geselecteerde album
        fetchAlbumTracks(album.id);  // Haal de tracks van het album op
        setAlbums([]);  
    };
    const playTrack = (track: SpotifyTrack) => {
        // Als het huidige track hetzelfde is als de nieuwe track
        if (currentTrack && currentTrack.id === track.id) {
            togglePlayPause();
            return; // Stop de functie om verder afspelen te voorkomen
        }
    
        // Stop de huidige track als er een andere track wordt afgespeeld
        if (audio) {
            audio.pause(); // Pauzeer de huidige audio
            audio.currentTime = 0; // Zet de tijd terug naar het begin
        }
    
        // Speel de nieuwe track af
        if (track.preview_url) {
            const newAudio = new Audio(track.preview_url);
            newAudio.play();
            setCurrentTrack(track);
            setAudio(newAudio); // Stel de nieuwe audio in
            setIsPlaying(true); // Zet isPlaying op true
            setTrackIsClicked(true);
    
            // Stop de audio en zet isPlaying op false als de audio is afgelopen
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
    
    
    
    

    const renderArtists = () => {
        return artists.map((artist: SpotifyArtist) => (
            <ArtistList key={artist.id} artist={artist} onClick={ArtistClick} />
        ));
    }
    const renderAlbums = () => {
        return albums.map((album: SpotifyAlbum) => (
            <div key={album.id} className="mb-4 hover:bg-gray-800 p-2 rounded-md m-2 cursor-pointer" onClick={() => AlbumClick(album)}>
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
    const renderTracks = () => {
        if (!selectedAlbum) return null; // Controleer of er een album geselecteerd is
        const formatDuration = (durationMs: number) => {
            const minutes = Math.floor(durationMs / 60000);
            const seconds = ((durationMs % 60000) / 1000).toFixed(0);
            return `${minutes}:${seconds.padStart(2, '0')}`;  // Zorgt ervoor dat de seconden altijd twee cijfers zijn
        };

        return (
            <div className="flex flex-col">
                {/* Toon de albumnaam boven de tracks */}
                <h2 className="text-2xl font-semibold m-4 text-center">{selectedAlbum.name}</h2>
                <p className="text-md text-gray-500 text-center underline">Song Previews</p>
                {/* Hier begin je met het weergeven van de tracks */}
                {tracks.map((track: SpotifyTrack, index: number) => (
                    <div key={track.id} className="hover:bg-gray-800 rounded-md m-2 flex items-center p-2 cursor-pointer" onClick={() => playTrack(track)}>
                        <p className="text-lg m-2 mr-4 ml-4">{index + 1}</p>
                        <div className="mr-4">
                            <h3>{track.name}</h3>
                            <p className="text-sm text-gray-500">{track.artists.map((artist: any) => artist.name).join(", ")}</p>
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
            <div className="flex justify-center items-center">                 
                <div className="flex flex-col items-center justify-center">
                    <Login token={token}/>
                    {token && (
                        <div className="flex flex-wrap justify-center bg-gray-900 rounded-lg m-5 overflow-y-auto scrollbar-hide" style={{ width: 600, maxHeight: 530 }}>
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
            </div>
            {token && trackIsClicked && (
                <div className="bg-gray-900 w-full h-24 fixed bottom-0 left-0 flex items-center justify-center">
                    <div className="rounded-full border-4 border-white bg-white cursor-pointer">
                        <Image src={isPlaying ? Pause : Play} alt="VideoPlayer" className="w-8 h-8 flex items-center justify-center" onClick={isPlaying ? togglePlayPause : () => playTrack(currentTrack!)}/> 
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
