import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getContentFromFollowed } from '../API';
import Carousel from '../components/Carousel';

export default function Library() {
    const query = useParams().term;
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        async function getResults() {
            console.log((await getContentFromFollowed('artist')));
            setAlbums((await getContentFromFollowed('album')));
            setPlaylists((await getContentFromFollowed('playlist')));
        } getResults();
    }, [query]);

    return (
        <>

        </>
    );
}