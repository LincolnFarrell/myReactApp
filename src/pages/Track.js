import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getContentFromId } from '../API';
import { msToMins, capitalize } from '../Utils';

export default function Album() {
    const trackId = useParams().id;
    const [track, setTrack] = useState();
    const [album, setAlbum] = useState();
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        async function getResults() {
            const data = await getContentFromId(trackId, 'track');
            setTrack(data);
            setAlbum(data?.album);
            setArtists(data.artists);
        } getResults();
    }, [trackId]);

    return (
        <>
            <div className='header-card'>
                <img src={track?.album?.images[1].url}/>
                <div>
                    <p>{capitalize(track?.type || '')}</p>
                    <h1 style={{fontSize: '50px'}}>{track?.name}</h1>
                    <p>
                        {artists.map((artist, i) => <>{i > 0 && ', '}<a href={window.location.origin + '/artist/' + artist.id}>{artist.name}</a></>)}
                        {track && ' • '} <a href={window.location.origin + '/album/' + album?.id}>{album?.name}</a> 
                        {track && (' • ' + album?.release_date + ' • ' + msToMins(track.duration_ms))} </p>
                </div>
            </div>
        </>
    );
}