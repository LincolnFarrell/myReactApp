import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getContentFromId } from '../API';
import List from '../components/List';
import { msToMins, capitalize } from '../Utils';

export default function Album() {
    const albumId = useParams().id;
    const [album, setAlbum] = useState();
    const [artists, setArtists] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        async function getResults() {
            const data = await getContentFromId(albumId, 'album');
            setAlbum(data);
            setArtists(data.artists);
            setTracks(data.tracks.items);
            let dur = 0;
            data.tracks.items.map(track => dur += track.duration_ms);
            setDuration(dur);
        } getResults();
    }, [albumId]);

    return (
        <>
            <div className='header-card'>
                <img src={album?.images[1].url}/>
                <div>
                    <p>{capitalize(album?.type || '')}</p>
                    <h1 style={{fontSize: '50px'}}>{album?.name}</h1>
                    <p>
                        {artists.map((artist, i) => <>{i > 0 && ', '}<a href={window.location.origin + '/#/artist/' + artist.id}>{artist.name}</a></>)} 
                        {album ? (
                            ' • ' + album?.release_date + ' • ' + 
                            album?.total_tracks + ' songs, ' + msToMins(duration)
                        ) : ''}
                    </p>
                </div>
            </div>
            <List contentType='album' content={tracks}/> 
        </>
    );
}