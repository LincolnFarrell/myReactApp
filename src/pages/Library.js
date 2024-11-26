import { useState, useEffect } from 'react';
import { createPlaylist, getContentFromFollowed, getContentFromLibrary, getCurrentUser, getRecentlyPlayed } from '../API';
import Carousel from '../components/Carousel';

export default function Library() {
    const [artists, setArtists] = useState([]);
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [playlists, setPlaylists] = useState([]); //filter by owner later on
    const [tracks, setTracks] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);

    const _createPlaylist = () => {
        async function getResults() {
            await createPlaylist(currentUser.id);
            setPlaylists((await getContentFromLibrary('playlist')).items)
        } getResults();
    }

    useEffect(() => {
        async function getResults() {
            setCurrentUser(await getCurrentUser());
            setRecentlyPlayed((await getRecentlyPlayed()).items);
            setArtists((await getContentFromFollowed('artist')).artists.items);
            setPlaylists((await getContentFromLibrary('playlist')).items)
            setTracks((await getContentFromLibrary('track')).items)
        } getResults();
    }, []);

    return (
        <>
            <div className='content-control'>
                <button onClick={_createPlaylist} style={{marginBottom: '16px'}}>Create Playlist</button>
            </div>
            {recentlyPlayed.length > 0 && <Carousel title='Recently Played' contentType='track' wrapped={true} content={recentlyPlayed}/>}
            {artists.length > 0 && <Carousel title='Followed Artists' contentType='artist' content={artists}/>}
            {playlists.length > 0 && <Carousel title='Saved Playlists' contentType='playlist' content={playlists}/>}
            {tracks.length > 0 && <Carousel title='Favorite Tracks' contentType='track' wrapped={true} content={tracks}/>}
        </>
    );
}