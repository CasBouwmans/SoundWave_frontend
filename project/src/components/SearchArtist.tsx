import axios from "axios";
import { SpotifyArtist, SpotifyAlbum, SpotifyTrack } from '@/interfaces/SpotifyInterfaces'

interface SearchArtistProps {
    token: string
    searchKey: string;
    setSearchKey: (key: string) => void;
    setAlbums: (albums: SpotifyAlbum[]) => void;
    setArtists: (artists: SpotifyArtist[]) => void;
    setTracks: (tracks: SpotifyTrack[]) => void;
    setSelectedArtist: (artists: SpotifyArtist | null) => void;
    setSelectedAlbum: (albums: SpotifyAlbum | null) => void;
}

export default function SearchArtist(
    {token, searchKey, setSearchKey, setAlbums, setArtists, setTracks, setSelectedArtist, setSelectedAlbum}: SearchArtistProps
) {
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
        setAlbums([]);                  
        setTracks([]);                  
        setSelectedArtist(null);     
        setSelectedAlbum(null);  
    }
    return (<div>
  {token && (
    <form onSubmit={fetchArtists}>
        <input type="text" onChange={e => setSearchKey(e.target.value)} className="text-white bg-gray-900 rounded-l-full hover:bg-gray-800 p-2 w-96 outline-none focus:ring-2 focus:ring-gray-500" placeholder=" Enter artist name"  />
        <button type={"submit"} className="bg-blue-500 border-4 border-blue-600 bg-opacity-80 border-opacity-60 rounded-r-full p-1">Search</button>
    </form>   
)}  
</div>)
}
