import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { changePlaylistImage, doesUserFollowPlaylist, followPlaylist, getContentFromId, getCurrentUser, getPlaybackState, isAuthTokenAvailable, renamePlaylist, unfollowPlaylist } from '../API';
import List from '../components/List';
import { msToMins, capitalize, fileToBase64 } from '../Utils';

export default function Playlist() {
    const navigate = useNavigate();

    const playlistId = useParams().id;
    const [playlist, setPlaylist] = useState();
    const [tracks, setTracks] = useState([]);
    const [duration, setDuration] = useState(0);
    const [isFollowed, setIsFollowed] = useState(false);
    const [isUserOwned, setIsUserOwned] = useState(null);
    const [renameMessage, setRenameMessage] = useState();
    const [imageMessage, setImageMessage] = useState();

    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const renameRef = useRef(null);
    const handleRenameClick = () => {
        setIsRenameOpen(!isRenameOpen);
    };
    const handleClickOutsideRename = (event) => {
        if (isRenameOpen && renameRef.current && !renameRef.current.contains(event.target)) {
            window.removeEventListener('mousedown', handleClickOutsideRename);
            if (event.target.className != 'rename-button') setIsRenameOpen(false);
        }
    };
    useEffect(() => {
        setRenameMessage();
        if (isRenameOpen) {
            window.addEventListener('mousedown', handleClickOutsideRename);
        }
    }, [isRenameOpen]);

    const [isImageOpen, setIsImageOpen] = useState(false);
    const imageRef = useRef(null);
    const handleImageClick = () => {
        setIsImageOpen(!isImageOpen);
    };
    const handleClickOutsideImage = (event) => {
        if (isImageOpen && imageRef.current && !imageRef.current.contains(event.target)) {
            window.removeEventListener('mousedown', handleClickOutsideImage);
            if (event.target.className != 'image-button') setIsImageOpen(false);
        }
    };
    useEffect(() => {
        setImageMessage();
        if (isImageOpen) {
            window.addEventListener('mousedown', handleClickOutsideImage);
        }
    }, [isImageOpen]);

    const handleFileChange = (event) => {
        const file = event?.target?.files?.[0];
        if (file) {
            if (file.size > 256000) setImageMessage('File too big! Max: 256kb');
            else {
                if (file.type != 'image/jpg' || file.type != 'image/jpeg') {
                    async function getResults() {
                        await changePlaylistImage(playlistId, (await fileToBase64(file)));
                        setImageMessage('Success! Image will appear momentarily.');
                        setPlaylist(await getContentFromId(playlistId, 'playlist'));
                    } getResults();
                } else setImageMessage('File must be .jpg!');
            }
        }
    };

    const follow = () => {
        async function getResults() {
            if (isFollowed) {
                await unfollowPlaylist(playlistId);
                if (isUserOwned) navigate(-1);
                else setIsFollowed(false);
            } else {
                await followPlaylist(playlistId);
                setIsFollowed(true);
            }
        } getResults();
    }

    const rename = (name) => {
        async function getResults() {
            if (name.length > 0) { 
                await renamePlaylist(playlistId, name);
                setRenameMessage('Success! Rename will appear momentarily.');
                setPlaylist(await getContentFromId(playlistId, 'playlist'));
            } else setRenameMessage('Invalid name!');
        } getResults();
    }

    useEffect(() => {
        setPlaylist();
        setTracks([]);
        setDuration(0);
        setIsFollowed(false);
        setIsUserOwned(null);
        setRenameMessage();

        async function getResults() {
            const data = await getContentFromId(playlistId, 'playlist');
            setPlaylist(data);
            if (isAuthTokenAvailable()) {
                setIsFollowed((await doesUserFollowPlaylist(playlistId))[0]);
                const currentUser = (await getCurrentUser());
                if (currentUser.id === data.owner.id) setIsUserOwned(true);
                else setIsUserOwned(false);
            }
            setTracks(data.tracks.items);
            let dur = 0;
            data.tracks.items.map(item => dur += item.track.duration_ms);
            setDuration(dur);
        } getResults();
    }, [playlistId]);

    return (
        <>
            <div className='header-card'>
                <img src={playlist?.images?.[1]?.url || playlist?.images?.[0]?.url}/>
                <div>
                    <p>{capitalize(playlist?.type || '')}</p>
                    <h1 style={{fontSize: '50px'}}>{playlist?.name}</h1>
                    <p>
                        {playlist ? (
                            <>
                                <Link to={`/user/${playlist?.owner?.id}`}>{playlist?.owner?.display_name}</Link>{' • ' + 
                                (playlist?.followers?.total || '0') + ' followers • ' + 
                                playlist?.tracks?.total + ' songs, ' + msToMins(duration)}
                            </>
                        ) : ''}
                    </p>
                    {isAuthTokenAvailable() && 
                        <div className='content-control'>
                            {isUserOwned != null && (
                                isUserOwned ? <>
                                <button onClick={follow}>Delete Playlist</button>
                                <div style={{position: 'relative'}}>
                                    <button onClick={handleRenameClick} className='rename-button'>Rename</button>
                                    {isRenameOpen && 
                                        <div className='info-drop-down' ref={renameRef}>
                                            <div>
                                                <input type='text' placeholder='New name...' 
                                                    onKeyDown={event => {
                                                    if (event.key == 'Enter') { 
                                                        rename(event.target.value); 
                                                }}}/>
                                                {renameMessage && <p style={{marginTop: '8px'}}>{renameMessage}</p>}
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div style={{position: 'relative'}}>
                                    <button onClick={handleImageClick} className='image-button'>Change Image</button>
                                    {isImageOpen && 
                                        <div className='info-drop-down' ref={imageRef}>
                                            <div>
                                                <input type="file" onChange={handleFileChange} />
                                                {imageMessage && <p style={{marginTop: '8px'}}>{imageMessage}</p>}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </> : <>
                                <button onClick={follow}>{isFollowed ? 'Unsave' : 'Save'}</button>
                            </>)}
                        </div>
                    }
                </div>
            </div>
            <List contentType='playlist' content={tracks}/> 
        </>
    );
}