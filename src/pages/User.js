import { useState, useEffect } from 'react';
import { doesUserFollowUserOrArtist, followUserOrArtist, getCurrentUser, getPublicPlaylistsFromUser, getTopContent, getUserById, isAuthTokenAvailable, logout, unfollowUserOrArtist } from '../API';
import { useParams, Link } from 'react-router-dom';
import { capitalize } from '../Utils';
import List from '../components/List';
import Carousel from '../components/Carousel';

export default function Library() {
    const userId = useParams().id;

    const [user, setUser] = useState();
    const [topArtists, setTopArtists] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const [publicPlaylists, setPublicPlaylists] = useState([]);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);

    const follow = () => {
        async function getResults() {
            if (isFollowed) {
                await unfollowUserOrArtist('user', userId);
                setIsFollowed(false);
            } else {
                await followUserOrArtist('user', userId);
                setIsFollowed(true);
            }
        } getResults();
    }

    useEffect(() => {
        setUser();
        setTopArtists([]);
        setTopTracks([]);
        setPublicPlaylists([]);
        setIsCurrentUser(false);
        setIsFollowed(false);

        async function getResults() {
            const _user = (await getUserById(userId)); setUser(_user);
            if (isAuthTokenAvailable()) {
                const currentUser = (await getCurrentUser());
                if (currentUser.id === _user.id) {
                    setIsCurrentUser(true);
                    setTopArtists((await getTopContent('artist', 'long_Term', 5)).items);
                    setTopTracks((await getTopContent('track', 'long_Term', 5)).items);
                } else {
                    setIsFollowed((await doesUserFollowUserOrArtist('user', userId))[0]);
                }
            }
            setPublicPlaylists((await getPublicPlaylistsFromUser(userId)).items);
        } getResults();
    }, [userId]);

    useEffect(() => {
        async function getResults() {
            setUser(await getUserById(userId));
        } getResults();
    }, [isFollowed]);

    return (
        <>
            <div className='header-card'>
                <img src={user?.images?.[0]?.url || '/avatar.jpg'}/>
                <div>
                    <p>{capitalize(user?.type || '')}</p>
                    <h1 style={{fontSize: '50px'}}>{user?.display_name}</h1>
                    <p>
                        {user ? (
                            <>
                                {(user?.followers?.total || '0') + ' followers'}
                                {isCurrentUser && <>
                                    {' • '}<Link to='/account'>Account</Link>
                                    {' • '}<a href='javascript:void(0)' onClick={logout}>Log out</a>
                                </>}
                            </>
                        ) : ''}
                    </p>
                    {isAuthTokenAvailable() && 
                        <div className='content-control'>
                            <button onClick={follow}>{isFollowed ? 'Unfollow' : 'Follow'}</button>
                        </div>
                    }
                </div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={{flex: 1}}>
                    {topArtists.length > 0 && <List title='All-time Artists' contentType='artist' content={topArtists}/>}
                </div>
                <div style={{flex: 1}}>
                    {topTracks.length > 0 && <List title='All-time Tracks' contentType='track' content={topTracks}/>}
                </div>
            </div>
            {publicPlaylists.length > 0 && <Carousel title='Public Playlists' contentType='playlist' content={publicPlaylists}/>}
        </>
    );
}