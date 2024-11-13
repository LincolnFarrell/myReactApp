import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getContentFromId, getContentFromCollectionId } from '../API';
import Carousel from '../components/Carousel';

export default function Artist() {
    const artistId = useParams().id;
    const [artist, setArtist] = useState();
    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        async function getResults() {
            setArtist(await getContentFromId(artistId, 'artist'));
            setAlbums((await getContentFromCollectionId(artistId, 'artist', 'album')).items);
        } getResults();
    }, [artistId]);

    return (
        <>
            <h2>{artist?.name}</h2>
            <Carousel title='Album Discography' contentType='album' content={albums}/> 
        </>
    );
}