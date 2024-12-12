"use client";

import React from "react";
import { useState, useEffect } from "react";   
import Logo from './Images/Logo.png';
import Play from './Images/Play.png'
import Pause from './Images/Pause.png'
import Previous from './Images/Previous.png'
import Next from './Images/Next.png'
import Anonymous from './Images/Anonymous.png'
import Image from "next/image";
import Login from "@/components/Login";
import Logout from "@/components/Logout";
import { SpotifyArtist, SpotifyAlbum, SpotifyTrack, SpotifyPlaylist } from '@/interfaces/SpotifyInterfaces'
import SearchArtistAlbumTrack from "@/components/SearchArtistAlbumTrack";
import ArtistList from "@/components/ArtistList";
import styles from "@/components/ScrollBar.module.css";

import { fetchPlaylists, fetchPlaylistTracks, fetchAlbums, fetchAlbumTracks, fetchTokens, fetchUserInfo } from './apiClient';


const App = () => {
    

    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [searchChoice, setSearchChoice] = useState<"artist" | "album" | "track">("artist");
    const [artists, setArtists] = useState<SpotifyArtist[]>([])
    const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(null);
    const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<SpotifyAlbum | null>(null);
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
    const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
    // const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false); // Voeg deze regel toe
    const [trackIsClicked, setTrackIsClicked] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1); // -1 betekent dat er nog geen track is geselecteerd
    
    const [maxHeight, setMaxHeight] = useState(610);
    const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylist | null>(null);
    const [searchActive, setSearchActive] = useState(false);

    

    

    
    const formatDuration = (durationMs: number) => {
        const minutes = Math.floor(durationMs / 60000); // Omrekeningen van milliseconden naar minuten
        const seconds = Math.floor((durationMs % 60000) / 1000); // De resterende seconden
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Zorgt ervoor dat seconden altijd twee cijfers zijn
    };    

   

    const handlePlaylistClick = (playlistId: string) => {
        if (token) {
          fetchPlaylistTracks(token, playlistId)
            .then((trackData) => {
              setTracks(trackData); // Sla de tracks op in de state
            })
            .catch((error) => {
              console.error("Error fetching playlist tracks: ", error);
            });
        }
      };
    
    
      useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search); // Haal de query parameters uit de URL
        const code = urlParams.get('code');  // Haal de waarde van de 'code' parameter op
    
        if (code) {
            fetchTokens(code)
                .then(async (data) => {  // Merk op dat we hier de functie asynchroon maken
                    if (data) {
                        const { access_token, refresh_token } = data;
                        const expiryTime = new Date().getTime() + 3600 * 1000; // 1 uur voor access token
                        window.localStorage.setItem("token", access_token);
                        window.localStorage.setItem("refresh_token", refresh_token);
                        window.localStorage.setItem("tokenExpiry", expiryTime.toString());
                        setToken(access_token); // Stel token in na inloggen
    
                        // Haal gebruikersinformatie op
                        const userId = await fetchUserInfo(access_token);
                        // Sla de userId op in localStorage of state
                        window.localStorage.setItem('spotifyUserId', userId);
                        console.log("Gebruiker ingelogd met ID:", userId);
                    }
                })
                .catch((error) => {
                    console.error("Fout bij het ophalen van de tokens:", error);
                });
        }
    }, []);
    
    
    
    
    useEffect(() => {
        if (token) {
            const getPlaylists = async () => {
                try {
                    const data = await fetchPlaylists(token);
                    setPlaylists(data); // Sla de playlists op in de state
                } catch (error) {
                    console.error('Error fetching playlists:', error);
                }
            };
            getPlaylists();
            
        }
    }, [token]);
    
    
    
    // Renderfunctie voor playlists
    const renderPlaylists = () => {
        return playlists.map((playlist: SpotifyPlaylist) => (
            <div
                key={playlist?.id}
                className="mb-4 hover:bg-gray-800 p-2 rounded-md m-2 cursor-pointer"
                onClick={() => {
                    setSelectedPlaylist(playlist); // Stel de geselecteerde playlist in
                    handlePlaylistClick(playlist.id); // Haal de tracks op van de geselecteerde playlist
                    setTracks([]); // Leeg de huidige tracks
                    setSelectedArtist(null); // Reset de geselecteerde artiest
                    setSelectedAlbum(null); // Reset de geselecteerde album
                    setSearchActive(false); // Reset de geselecteer

                }}
            >   
                {playlist && playlist.images && playlist.images.length > 0 && (
                    <Image
                        src={playlist.images[0].url} 
                        alt={playlist.name}
                        width={100}
                        height={100}
                        className="rounded-md w-28 h-28 object-cover"
                    />
                )}
                <h2 style={{ width: 165 }}>{playlist?.name || "Unknown Playlist"}</h2>
                <p className="text-sm text-gray-500">{playlist?.owner?.display_name || "Unknown Owner"}</p>
            </div>
        ));
    };
    
    const renderPlaylistTracks = () => {
        if (!selectedPlaylist) return null; // Controleer of er een playlist geselecteerd is
    
        return (
            <div className="flex flex-col w-full">
            <div className="flex items-center m-3"> {/* Flex-container voor afbeelding en naam */}
                {selectedPlaylist.images.length > 0 && (
                    <Image
                        src={selectedPlaylist.images[0].url} // Gebruik de afbeelding van de geselecteerde playlist
                        alt={selectedPlaylist.name}
                        width={100} // Pas aan op basis van jouw wensen
                        height={100} // Pas aan op basis van jouw wensen
                        className="rounded-md mr-4 w-30 h-30" // Voeg wat marge rechts toe
                    />
                )}
                <h2 className="text-2xl font-semibold">{selectedPlaylist.name}</h2>
            </div>
                {tracks.map((track: SpotifyTrack, index: number) => (
                    <div
                        key={track.id}
                        className={`rounded-md m-2 flex items-center p-2 cursor-pointer 
                        ${currentTrack && currentTrack.id === track.id ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                        onClick={() => playTrack(track, index)}
                    >
                        <p className="text-lg m-2 mr-4 ml-4 text-gray-500">{index + 1}</p>
                        {track.album.images.length > 0 && (
                            <Image src={track.album.images[0].url} alt={`${track.name} album cover`} width={100} height={100}className="w-12 h-12 rounded mr-4" />
                        )}
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
    
    const renderCurrentTrack = () => {
        if (!currentTrack) return null; // Controleer of er een huidige track is
    
        return (
            <div className="flex items-center m-4">
                {currentTrack.album.images.length > 0 && (
                    <Image
                        src={currentTrack.album.images[0].url} // Afbeelding van het album
                        alt={`${currentTrack.name} album cover`} 
                        width={100} // Pas aan naar wens
                        height={100} // Pas aan naar wens
                        className="rounded-md w-16 h-16 object-cover mr-4"
                    />
                )}
                <div>
                    <h3 className="text-md font-semibold">{currentTrack.name}</h3> {/* Naam van de track */}
                    <p className="text-sm text-gray-500">
                        {currentTrack.artists.map((artist) => artist.name).join(", ")} {/* Artiest(en) */}
                    </p>
                </div>
            </div>
        );
    };
    
  

    
    const ArtistClick = async (artist: SpotifyArtist) => {
        setSelectedArtist(artist);
        setArtists([]);              
        setTracks([]);                 
        setSelectedAlbum(null);   
    
        if (token) {
            const albums = await fetchAlbums(artist.id || "0", token); // Wacht op de albums
            setAlbums(albums); // Sla de opgehaalde albums op in de state
        } else {
            console.log("No valid token found");
        }
    };
    const AlbumClick = async (album: SpotifyAlbum) => {
        setSelectedAlbum(album); // Zet het geselecteerde album
        setAlbums([]); // Maak de albums leeg
    
        if (token) { // Controleer of er een geldig token is
            const tracks = await fetchAlbumTracks(album.id, token); // Haal tracks op via de apiClient functie
            setTracks(tracks); // Update de state met de opgehaalde tracks
        } else {
            console.log("No valid token found");
        }
    };
    

    const playTrack = (track: SpotifyTrack, index: number) => {
        if (currentTrack && currentTrack.id === track.id) {
            togglePlayPause();
            return;
        }
    
        // Alleen de metadata bijwerken en de rest behouden
        setCurrentTrack(track);
        setCurrentTrackIndex(index); // Stel de huidige track index in
        setIsPlaying(false); // Zorg dat het standaard niet speelt
        setTrackIsClicked(true);
        setMaxHeight(520);
    
        setTimeout(() => {
            if (!track.preview_url) {
                console.log(track);
                alert("No preview available for this track.");
            }
        }, 0);
    };
    
    // Functie om afspelen/pauzeren om te schakelen (niet meer gebruikt)
    const togglePlayPause = () => {
        // Geen functionaliteit meer nodig omdat audio niet wordt afgespeeld
        console.log("Play/pause toggled, but no audio functionality remains.");
    };
    
    const playPreviousTrack = () => {
        if (currentTrackIndex !== null && currentTrackIndex > 0) {
            const previousTrack = tracks[currentTrackIndex - 1];
            playTrack(previousTrack, currentTrackIndex - 1); // Ga naar de vorige track
        }
    };
    
    const playNextTrack = () => {
        if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1) {
            const nextTrack = tracks[currentTrackIndex + 1];
            playTrack(nextTrack, currentTrackIndex + 1); // Ga naar de volgende track
        }
    };
    
    
    
    

    const renderSearchedArtists = () => {
        return artists.map((artist: SpotifyArtist) => (
            <ArtistList key={artist.id} artist={artist} onClick={ArtistClick} />
        ));
    }
    const renderSearchedAlbums = () => {
        return albums.map((album: SpotifyAlbum) => (
            <div
                key={album.id}
                className="mb-4 hover:bg-gray-800 p-2 rounded-md m-2 cursor-pointer"
                onClick={() => AlbumClick(album)}
            >
                {album.images && album.images.length > 0 ? (
                    <Image
                    src={album.images[0].url}
                    alt={album.name}
                    width={100}
                    height={100}
                    className="rounded-md w-40 h-40 object-cover"
                />
            ) : (
                <Image
                    src={Anonymous} 
                    alt="No album image"
                    width={100}
                    height={100}
                    className="p-2 w-40 h-40 object-cover"
                />
                )}
                <h2 style={{ width: 165 }}>
                    {album.name}
                </h2>
                <p className="text-sm text-gray-500">
                    Released on: {album.release_date}
                </p>
            </div>
        ));
    };

    const renderSearchedTracks = () => {
    
        return (
            <div className="flex flex-col w-full">
                {tracks.map((track: SpotifyTrack, index: number) => (
                    <div
                        key={track.id}
                        className={`rounded-md m-2 flex items-center p-2 cursor-pointer 
                            ${currentTrack && currentTrack.id === track.id ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                        onClick={() => playTrack(track, index)}
                    >
                        <p className="text-lg m-2 mr-4 ml-4 text-gray-500">{index + 1}</p>
                        {track.album.images.length > 0 && (
                            <Image
                                src={track.album.images[0].url}
                                alt={`${track.name} album cover`}
                                width={100}
                                height={100}
                                className="w-12 h-12 rounded mr-4"
                            />
                        )}
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
    const renderAlbumTracks = () => {
        if (!selectedAlbum) return null; // Controleer of er een album geselecteerd is

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
                        <p className="text-lg m-2 mr-4 ml-4 text-gray-500">{index + 1}</p>
                        {track.album.images.length > 0 && (
                            <Image src={track.album.images[0].url} alt={`${track.name} album cover`} width={100} height={100} className="w-12 h-12 rounded mr-4" />
                        )}
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
                <SearchArtistAlbumTrack token={token} searchKey={searchKey} setSearchKey={setSearchKey} setAlbums={setAlbums} setArtists={setArtists} setTracks={setTracks} setSelectedArtist={setSelectedArtist} setSelectedAlbum={setSelectedAlbum} setSearchChoice={setSearchChoice} searchChoice={searchChoice} setSearchActive={setSearchActive}/>
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
                        <h2 className="text-center text-white text-2xl font-semibold m-3">Playlists</h2>
                        {renderPlaylists()}
                    </div>
                )}

                <div className="flex flex-col items-center justify-start ">
                    {token && (
                        <div
                            className={`flex flex-wrap justify-center bg-gray-900 rounded-lg overflow-y-auto ${styles.scrollContainer}`}
                            style={{ maxHeight: maxHeight }}
                        >
                            {/* Toon tracks als er een album geselecteerd is */}
                            {selectedPlaylist && !searchActive ? (
                                renderPlaylistTracks() 
                            ) : selectedAlbum ? (
                                renderAlbumTracks()
                            ) : selectedArtist ? (
                                /* Toon albums als er een artiest geselecteerd is */
                                renderAlbums()
                            ) : searchChoice === "artist" ? (
                                /* Toon artiesten als er geen artiest en geen album geselecteerd is */
                                renderSearchedArtists()
                            ) : searchChoice === "album" ? (
                                renderSearchedAlbums()
                            ) : searchChoice === "track" ? (
                                renderSearchedTracks()
                            ) : (
                                // Als er geen specifieke keuze is, toon iets anders of een fallback
                                <div>No results found</div>
                              )}
                        </div>
                    )}
                </div>
                {token && trackIsClicked && (
                    <div
                    className={`flex flex-col bg-gray-900 rounded-lg overflow-y-auto ${styles.scrollContainer}`}
                    style={{ width: 440, minHeight: maxHeight, maxHeight: maxHeight }}
                >
                    <h2 className="text-center text-white text-2xl font-semibold m-3">Song Reviews</h2>
                    
                    
                        <div className="flex-grow">
                           <h2>Hier komen reviews</h2>
                        </div>
                    
                   
                    
                    {/* Het formulier wordt altijd onderaan geplaatst */}
                    <div className="mt-auto">
                        <form className="flex justify-center m-3">
                            <input
                                type="text"
                                className="text-white bg-gray-800 rounded-l-full hover:bg-gray-700 p-2 w-96 outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="Enter your review"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 border-4 border-blue-600 bg-opacity-80 border-opacity-60 rounded-r-full p-1"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
                
                )}
            </div>

    
       

            {token && trackIsClicked && (
    <div className="bg-gray-900 w-full h-24 fixed bottom-0 left-0 flex items-center justify-between p-4">
        {renderCurrentTrack()} {/* Roep de renderfunctie aan hier */}

        {/* Control panel - absolute centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
            <div className="rounded-full bg-white cursor-pointer p-2 hover:scale-105" onClick={playPreviousTrack}>
                <Image 
                    src={Previous} 
                    alt="Previous" 
                    width={32} 
                    height={32} 
                    className="w-5 h-5" 
                />
            </div>
            <div className="rounded-full bg-white cursor-pointer p-2 hover:scale-105" onClick={isPlaying ? togglePlayPause : () => playTrack(currentTrack!, currentTrackIndex!)}>
                <Image 
                    src={isPlaying ? Pause : Play} 
                    alt="Play/Pause" 
                    width={32} 
                    height={32} 
                    className="w-5 h-5" 
                />
            </div>
            <div className="rounded-full bg-white cursor-pointer p-2 hover:scale-105" onClick={playNextTrack}>
                <Image 
                    src={Next} 
                    alt="Next" 
                    width={32} 
                    height={32} 
                    className="w-5 h-5" 
                />
            </div>
        </div>
    </div>
)}

        </div>
    );
}

export default App;
