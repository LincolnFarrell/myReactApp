import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getContentFromId, getContentFromCollectionId, getRelatedArtists, getTopTracksFromArtist, isAuthTokenAvailable, unfollowUserOrArtist, followUserOrArtist, doesUserFollowUserOrArtist } from '../API';
import { capitalize } from '../Utils'
import Carousel from '../components/Carousel';
import List from '../components/List';

export default function Artist() {
    const artistId = useParams().id;
    const [artist, setArtist] = useState();
    const [albums, setAlbums] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const [relatedArtists, setRelatedArtists] = useState([]);
    const [isFollowed, setIsFollowed] = useState(false);

    const follow = () => {
        async function getResults() {
            if (isFollowed) {
                await unfollowUserOrArtist('artist', artistId);
                setIsFollowed(false);
            } else {
                await followUserOrArtist('artist', artistId);
                setIsFollowed(true);
            }
        } getResults();
    }


    useEffect(() => {
        setArtist();
        setTopTracks([]);
        setAlbums([]);
        setRelatedArtists([]);
        setIsFollowed(false);
        
        async function getResults() {
            if (isAuthTokenAvailable()) setIsFollowed((await doesUserFollowUserOrArtist('artist', artistId))[0]);
            setArtist(await getContentFromId(artistId, 'artist'));
            setTopTracks((await getTopTracksFromArtist(artistId)).tracks);
            setAlbums((await getContentFromCollectionId(artistId, 'artist', 'album')).items);
            setRelatedArtists((await getRelatedArtists(artistId)).artists);
        } getResults();
    }, [artistId]);

    return (
        <>
            <div className='header-card'>
                <img src={artist?.images?.[1]?.url || artist?.images?.[0]?.url} style={{borderRadius: '50%'}}/>
                <div>
                    <p>{capitalize(artist?.type || '')}</p>
                    <h1 style={{fontSize: '50px'}}>{artist?.name}</h1>
                    <p>
                        {artist && (
                            (artist?.followers?.total || '0') + ' followers'
                        )}
                    </p>
                    {isAuthTokenAvailable() && 
                        <div className='content-control'>
                            <button onClick={follow}>{isFollowed ? 'Unfollow' : 'Follow'}</button>
                        </div>
                    }
                </div>
            </div>
            <List title='Top Tracks' contentType='track' content={topTracks}/> 
            <Carousel title='Discography' contentType='album' content={albums}/> 
            <Carousel title='Related Artists' contentType='artist' content={relatedArtists}/> 
        </>
    );
}