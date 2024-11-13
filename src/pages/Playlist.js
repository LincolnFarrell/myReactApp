import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getContentFromId } from '../API';
import List from '../components/List';
import { msToMins, capitalize } from '../Utils';

export default function Playlist() {
    const playlistId = useParams().id;
    const [playlist, setPlaylist] = useState();
    const [tracks, setTracks] = useState([]);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        async function getResults() {
            const data = await getContentFromId(playlistId, 'playlist');
            setPlaylist(data);
            setTracks(data.tracks.items);
            let dur = 0;
            data.tracks.items.map(item => dur += item.track.duration_ms);
            setDuration(dur);
        } getResults();
    }, [playlistId]);

    return (
        <>
            <div className='header-card'>
                <img src={playlist?.images[1].url}/>
                <div>
                    <p>{capitalize(playlist?.type || '')}</p>
                    <h1 style={{fontSize: '50px'}}>{playlist?.name}</h1>
                    <p>
                        {playlist ? (
                            playlist.owner.display_name + ' • ' + 
                            (playlist?.followers?.total || '0') + ' followers • ' + 
                            playlist?.tracks?.total + ' songs, ' + msToMins(duration)
                        ) : ''}
                    </p>
                </div>
            </div>
            <List contentType='playlist' content={tracks}/> 
        </>
    );
}