
import React from "react";
import { SpotifyArtist } from "@/interfaces/SpotifyInterfaces";
import Image from "next/image";


interface ArtistListProps {
    artist: SpotifyArtist;
    onClick: (artist: SpotifyArtist) => void;
}

const ArtistList: React.FC<ArtistListProps> = ({ artist, onClick }) => {
    return (
        <div className="mb-4 hover:bg-gray-800 p-2 rounded-md m-2 cursor-pointer" onClick={() => onClick(artist)}>
            {artist.images && artist.images.length > 0 && (
                 <Image
                 src={artist.images[0].url}
                 alt={artist.name}
                 width={100}
                 height={100}
                 className="rounded-md w-40 h-40 object-cover"
             />
            )}
            <h2 style={{ width: 165 }}>{artist.name}</h2>
            <p className="text-sm text-gray-500">{artist.type}</p>
        </div>
    );
};

export default ArtistList;
