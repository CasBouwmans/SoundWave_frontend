import axios from "axios";
import { SpotifyTrack } from '@/interfaces/SpotifyInterfaces';  // Zorg ervoor dat je de juiste interface importeert


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
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const REDIRECT_URI = "http://localhost:3000";  // Het huidige URL
    const RESPONSE_TYPE = "code";
    const SCOPES = 'user-read-private,user-read-email,playlist-read-private,playlist-read-collaborative';

    console.log("De inlog URL wordt gegenereerd");

    return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
  };

  export const fetchTokens = async (code: string) => {
    const CLIENT_ID = "a09667c15c22466f8ea2f0363cf98617";
    const CLIENT_SECRET = "b4ec5d61425a421c9d6a7f886b5457c0";
    const REDIRECT_URI = "http://localhost:3000";
    const tokenEndpoint = "https://accounts.spotify.com/api/token";

    console.log(tokenEndpoint);

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);

    const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    });

    const data = await response.json();
    
    if (response.ok) {
        return data;  // Dit bevat access_token en refresh_token
    } else {
        throw new Error(data.error_description || 'Er is een fout opgetreden');
    }
};

export const fetchUserInfo = async (token: string) => {
  try {
    const { data } = await apiClient.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.id;  // Dit is de Spotify User ID
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
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

  export const fetchAlbums = async (artistId: string, token: string) => {
    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                include_groups: "album,single", // kan ook andere groepen zijn zoals "appears_on"
                market: "ES", // dit kan je dynamisch maken als je wilt
            },
        });

        console.log(data);  // Debug: zie wat je terugkrijgt van de API
        return data.items;  // Hier geef je de albums terug zodat je ze later kunt gebruiken
    } catch (error) {
        console.error('Error fetching albums:', error);
        // Hier kun je ook foutmelding tonen aan de gebruiker
        return [];
    }
};

export const fetchAlbumTracks = async (albumId: string, token: string) => {
    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Haal meer details op voor elk nummer
        const trackDetails = await Promise.all(
            data.items.map(async (track: SpotifyTrack) => {
                const trackData = await axios.get(`https://api.spotify.com/v1/tracks/${track.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                return trackData.data; // Volledige trackgegevens
            })
        );

        console.log("Fetched tracks:", trackDetails); // Debug
        return trackDetails; // Retourneer de volledige trackdetails
    } catch (error) {
        console.error("Error fetching tracks:", error);
        return []; // Retourneer een lege array bij een fout
    }

};

export const fetchReviewsFromTrack = async (trackId: string, token: string) => {
  try {
      const response = await axios.get(`http://localhost:8080/api/reviews/${trackId}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data; // Retourneer de reviews
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) {
          // Als er geen reviews zijn, retourneer een lege array
          return [];
      }
  }
  console.error("Error fetching reviews:", error);
  throw error;
}
};

export const deleteReview = async (trackId: string, reviewId: string, token: string): Promise<void> => {
  try {
      await axios.delete(`http://localhost:8080/api/reviews/${trackId}/${reviewId}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
  } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
  }
};
  
export default apiClient;
