
import React from "react";
import { SpotifyArtist } from "@/interfaces/SpotifyInterfaces";
import Image from "next/image";
import Anonymous from '@/app/Images/Anonymous.png';


interface ArtistListProps {
    artist: SpotifyArtist;
    onClick: (artist: SpotifyArtist) => void;
}

const ArtistList: React.FC<ArtistListProps> = ({ artist, onClick }) => {
    return (
        <div className="flex flex-col items-center mb-4 hover:bg-gray-800 p-2 rounded-md m-2 cursor-pointer" onClick={() => onClick(artist)}>
            {artist.images && artist.images.length > 0 ? (
                <Image
                    src={artist.images[0].url}
                    alt={artist.name}
                    width={100}
                    height={100}
                    className="rounded-full w-40 h-40 object-cover"
                />
            ) : (
                <Image
                    src={Anonymous} 
                    alt="Anonymous"
                    width={100}
                    height={100}
                    className="p-2 w-40 h-40 object-cover"
                />
            )}
            <h2 className="text-center" style={{ width: 165 }}>{artist.name}</h2>
            <p className="text-sm text-gray-500">{artist.type}</p>
        </div>
    );
};

export default ArtistList;
