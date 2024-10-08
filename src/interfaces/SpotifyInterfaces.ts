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