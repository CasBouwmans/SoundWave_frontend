import axios from "axios";
import { SpotifyPlaylist, SpotifyTrack } from '@/interfaces/SpotifyInterfaces';  // Zorg ervoor dat je de juiste interface importeert


// Maak een axios instantie aan
const apiClient = axios.create({
  baseURL: "https://api.spotify.com/v1", // Basis URL voor Spotify API
  headers: {
    "Content-Type": "application/json",
  },
});


// apiClient.ts
export const getSpotifyLoginUrl = (): string => {
    const CLIENT_ID = "a09667c15c22466f8ea2f0363cf98617";
    const REDIRECT_URI = "http://localhost:3000";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const SCOPES = 'user-read-private,user-read-email,playlist-read-private,playlist-read-collaborative';
    
    return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
  };

  
// Functie voor het ophalen van zoekresultaten
export const searchSpotify = async (
  token: string,
  searchKey: string,
  searchChoice: "album" | "track" | "artist"
) => {
  try {
    const { data } = await apiClient.get("/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: searchChoice,
      },
    });

    return data; // retourneer de data zodat de component ermee kan werken
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Hergooi de error zodat deze in de component afgehandeld kan worden
  }
};

export const fetchPlaylists = async (token: string) => {
    try {
      const { data } = await apiClient.get('/me/playlists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 50,
          offset: 0,
        },
      });
      return data.items;  // Return the playlists data directly
    } catch (error) {
      console.error("Error fetching playlists: ", error);
      throw error;  // Rethrow the error to handle it elsewhere
    }
  };

  export const fetchPlaylistTracks = async (token: string, playlistId: string) => {
    try {
      const { data } = await apiClient.get(`/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 50,
          offset: 0,
        },
      });
      const trackDetails = await Promise.all(
        data.items.map(async (item: { track: SpotifyTrack }) => {
          const track = item.track;
          const trackData = await apiClient.get(`/tracks/${track.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return trackData.data; // Return full track details
        })
      );
      return trackDetails;  // Return the tracks
    } catch (error) {
      console.error("Error fetching playlist tracks: ", error);
      throw error;  // Rethrow the error to handle it elsewhere
    }
  };

export default apiClient;
