import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doesUserFollowTrack, followTrack, getContentFromId, isAuthTokenAvailable, recommendedByTrack, unfollowTrack } from '../API';
import { msToMins, capitalize } from '../Utils';
import Carousel from '../components/Carousel';

export default function Album() {
    const trackId = useParams().id;
    const [track, setTrack] = useState();
    const [album, setAlbum] = useState();
    const [artists, setArtists] = useState([]);
    const [isFollowed, setIsFollowed] = useState(false);
    const [recommendedByTrack, setRecommendedByTrack] = useState([]);

    const follow = () => {
        async function getResults() {
            if (isFollowed) {
                await unfollowTrack(trackId);
                setIsFollowed(false);
            } else {
                await followTrack(trackId);
                setIsFollowed(true);
            }
        } getResults();
    }

    useEffect(() => {
        setTrack();
        setAlbum();
        setArtists([]);
        setIsFollowed(false);
        setRecommendedByTrack([]);

        async function getResults() {
            const data = await getContentFromId(trackId, 'track');
            setTrack(data);
            setIsFollowed((await doesUserFollowTrack(trackId))[0]);
            setAlbum(data?.album);
            setArtists(data.artists);
            //DEPRECATED: setRecommendedByTrack((await getRecommendedBySeed(data?.id, null)).tracks);
        } getResults();
    }, [trackId]);

    return (
        <>
            <div className='header-card'>
                <img src={track?.album?.images[1].url || track?.album?.images[0].url}/>
                <div>
                    <p>{capitalize(track?.type || '')}</p>
                    <h1 style={{fontSize: '50px'}}>{track?.name}</h1>
                    <p>
                        {artists.map((artist, i) => <>{i > 0 && ', '}<Link to={'/artist/' + artist.id}>{artist.name}</Link></>)}
                        {track && ' • '} <Link to={'/album/' + album?.id}>{album?.name}</Link> 
                        {track && (' • ' + album?.release_date + ' • ' + msToMins(track.duration_ms))} </p>
                        {isAuthTokenAvailable() && 
                            <div className='content-control'>
                                <button onClick={follow}>{isFollowed ? 'Unfavourite' : 'Favourite'}</button>
                                <button>Add to Playlist</button>
                                <button>Remove from Playlist</button>
                            </div>
                        }
                </div>
            </div>
            {recommendedByTrack.length > 0 && <Carousel title='Recommended Tracks' contentType='track' content={recommendedByTrack}/>}
        </>
    );
}