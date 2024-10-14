export interface SpotifyArtist {
    external_urls?: {
        spotify: string;
    };
    followers?: {
        href: string | null;
        total: number;
    };
    genres?: string[];
    href?: string;
    id?: string;
    images?: Array<{
        height: number;
        url: string;
        width: number;
    }>;
    name: string;
    popularity?: number;
    type?: "artist";
    uri?: string;
}

export interface SpotifyAlbum {
    id: string;
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
    release_date: string;
}

export interface SpotifyTrack {
    id: string;
    name: string;
    popularity: number;
    artists: Array<{ name: string }>;
    duration_ms: number;
    preview_url?: string; // Voeg hier de preview_url toe
}

export interface SpotifyPlaylist {
    id: string; // Unieke ID van de playlist
    name: string; // Naam van de playlist
    description: string; // Beschrijving van de playlist
    images: Array<{
      url: string; // URL van de playlist afbeelding
      width?: number; // Breedte van de afbeelding
      height?: number; // Hoogte van de afbeelding
    }>;
    tracks: {
      href: string; // URL om de tracks van de playlist op te halen
      total: number; // Totaal aantal tracks in de playlist
      items: Array<{
        track: {
          id: string; // Unieke ID van het nummer
          name: string; // Naam van het nummer
          duration_ms: number; // Duur van het nummer in milliseconden
          preview_url: string; // URL voor het afspelen van een preview van het nummer
          artists: Array<{
            id: string; // Unieke ID van de artiest
            name: string; // Naam van de artiest
          }>;
          album: {
            id: string; // Unieke ID van het album
            name: string; // Naam van het album
            images: Array<{
              url: string; // URL van de albumafbeelding
              width?: number; // Breedte van de afbeelding
              height?: number; // Hoogte van de afbeelding
            }>;
          };
        };
      }>;
    };
    owner: {
      display_name: string; // Naam van de eigenaar van de playlist
      id: string; // Unieke ID van de eigenaar
    };
    public: boolean; // Of de playlist openbaar is of niet
    followers: {
      total: number; // Aantal volgers van de playlist
    };
  }
  