import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getContentFromSearch } from '../API';
import Carousel from '../components/Carousel';

export default function Search() {
    const query = useParams().term;
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        async function getResults() {
            setArtists((await getContentFromSearch(query, 'artist')).artists.items);
            setAlbums((await getContentFromSearch(query, 'album')).albums.items);
            setPlaylists((await getContentFromSearch(query, 'playlist')).playlists.items);
        } getResults();
    }, [query]);

    return (
        <>
            <Carousel title='Artists' contentType='artist' content={artists}/>
            <Carousel title='Albums' contentType='album' content={albums}/>
            <Carousel title='Playlists' contentType='playlist' content={playlists}/>
        </>
    );
}