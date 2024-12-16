import { SpotifyArtist, SpotifyAlbum, SpotifyTrack } from "@/interfaces/SpotifyInterfaces";
import { searchSpotify } from "@/app/apiClient"; // Importeer de zoekfunctie uit je apiClient
import React from 'react';

interface SearchArtistAlbumTrackProps {
  token: string;
  searchKey: string;
  searchChoice: "album" | "track" | "artist";
  setSearchKey: (key: string) => void;
  setAlbums: (albums: SpotifyAlbum[]) => void;
  setArtists: (artists: SpotifyArtist[]) => void;
  setTracks: (tracks: SpotifyTrack[]) => void;
  setSelectedArtist: (artist: SpotifyArtist | null) => void;
  setSelectedAlbum: (album: SpotifyAlbum | null) => void;
  setSearchChoice: (search: "album" | "track" | "artist") => void;
  setSearchActive: (searchActive: boolean) => void;
}

const SearchArtistAlbumTrack = ({
  token,
  searchKey,
  searchChoice,
  setSearchKey,
  setAlbums,
  setArtists,
  setTracks,
  setSelectedArtist,
  setSelectedAlbum,
  setSearchChoice,
  
  setSearchActive,
}: SearchArtistAlbumTrackProps) => {

  const fetchResults = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Leeg de state om oude resultaten te verwijderen
    setAlbums([]);
    setArtists([]);
    setTracks([]);
    setSelectedArtist(null);
    setSelectedAlbum(null);
    setSearchActive(true);

    try {
      const data = await searchSpotify(token, searchKey, searchChoice); // Roep de functie uit apiClient aan

      // Update de state op basis van de keuze
      if (searchChoice === "artist") {
        setArtists(data.artists.items);
      } else if (searchChoice === "album") {
        setAlbums(data.albums.items);
      } else if (searchChoice === "track") {
        setTracks(data.tracks.items);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      {token && (
        <form onSubmit={fetchResults}>
          <input
            type="text"
            onChange={(e) => setSearchKey(e.target.value)}
            className="text-white bg-gray-900 rounded-l-full hover:bg-gray-800 p-2 w-96 outline-none focus:ring-2 focus:ring-gray-500"
            placeholder={`Enter ${searchChoice} name`}
          />
          <button
            type="submit"
            className="bg-blue-500 border-4 border-blue-600 bg-opacity-80 border-opacity-60 rounded-r-full p-1"
          >
            Search
          </button>
          <select
            id="searchChoice"
            name="searchChoice"
            className="ml-2 bg-blue-500 border-4 border-blue-600 bg-opacity-80 border-opacity-60 rounded-full p-1 h-10"
            value={searchChoice} // Koppel de waarde aan de state
            onChange={(e) => setSearchChoice(e.target.value as "album" | "track" | "artist")} // Update de state bij verandering
          >
            <option value="artist">Artists</option>
            <option value="album">Albums</option>
            <option value="track">Tracks</option>
          </select>
        </form>
      )}
    </div>
  );
};

export default SearchArtistAlbumTrack;
