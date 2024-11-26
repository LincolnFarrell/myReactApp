import './App.css';
import { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { login, logout, isClientTokenAvailable, isAuthTokenAvailable, isRefreshTokenAvailable, fetchClientToken, refreshAuthToken, getCurrentUser, getPlaybackState } from './API';
import { msToMins } from './Utils';
import Home from './pages/Home';
import Library from './pages/Library';
import Search from './pages/Search';
import Artist from './pages/Artist';
import Album from './pages/Album';
import Playlist from './pages/Playlist';
import Track from './pages/Track';
import Login from './pages/Login';
import User from './pages/User';
import Settings from './pages/Settings';
import Account from './pages/Account';
import Callback from './pages/Callback';

const SIDEBAR_WIDTH = 200;

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [playbackState, setPlaybackState] = useState();

  const [sidebarLeft, setSidebarLeft] = useState(0);
  const toggleSidebar = () => {
    setSidebarLeft(sidebarLeft === 0 ? -(SIDEBAR_WIDTH + 8) : 0);
  }

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const dropDownRef = useRef(null);
  const handleDropDownClick = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };
  const handleClickOutside = (event) => {
    if (isDropDownOpen && dropDownRef.current && !dropDownRef.current.contains(event.target)) {
      window.removeEventListener('mousedown', handleClickOutside);
      if (event.target.className != 'avatar') setIsDropDownOpen(false);
    }
  };
  useEffect(() => {
    if (isDropDownOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
  }, [isDropDownOpen]);

  useEffect(() => {
    if (!isAuthTokenAvailable()) {
      if (!isRefreshTokenAvailable()) {
        if (!isClientTokenAvailable()) { fetchClientToken(); }
      } else { refreshAuthToken(); }
    } else { setLoggedIn(true); }

    async function getResults() {
      setPlaybackState(await getPlaybackState());
    } if (isAuthTokenAvailable()) getResults();
  }, [location.pathname]);

  useEffect(() => {
    async function getResults() {
      setUser(await getCurrentUser());
    } if (isAuthTokenAvailable()) getResults();
  }, []);

  return (
    <div className='App'>
      <div className='header'>
        <div className='spotify'>
          <Link to='/'><img src='/logo.png' className='logo'/></Link>
          <img className='sidebar-button' src='/sidebar.png' onClick={toggleSidebar}/>
        </div>
        <div className='search'>
          <input type='text' placeholder='Search...' 
            onKeyDown={event => {
              if (event.key == 'Enter') { 
                navigate('/search/' + event.target.value); 
          }}}/>
        </div>
        <div className='account'>
          <img src={(!loggedIn || !user || user?.images.length === 0) ? '/avatar.jpg' : user?.images[1].url} onClick={handleDropDownClick} className='avatar'/>
          {isDropDownOpen && 
            <div className='drop-down' ref={dropDownRef}>
              <h3>{loggedIn ? user?.display_name : 'Guest'}</h3>
              <hr/>
              <div>
                {loggedIn ? 
                  <>
                    <Link to='/account'><div>Account</div></Link>
                    <Link to={user && `/user/${user?.id}`}><div>Profile</div></Link>
                    <Link to="/settings"><div>Settings</div></Link>
                    <hr/>
                    <div onClick={logout}>Log out</div>
                  </>
                :
                <>
                  <Link to="/settings"><div>Settings</div></Link>
                  <hr/>
                  <div onClick={login}>Log in</div>
                </>
                }
              </div>
            </div>
          }
        </div>
      </div>
      <div className='content'>
        <div className="sidebar" style={{marginLeft: sidebarLeft}}>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <Link to="/">Home</Link>
            <a href="javascript:void(0)" onClick={toggleSidebar} style={{flex: 1, justifyContent: 'right'}}>&times;</a>
          </div>
          <hr/>
          <Link to="/library">Library</Link>
          <Link to="/account">Account</Link>
          <Link to="/settings">Settings</Link>
        </div>
        <main>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/callback' element={<Callback/>}/>
            <Route path='/library' element={loggedIn ? <Library/> : <Login/>}/>
            <Route path='/search/:term' element={<Search/>}/>
            <Route path='/artist/:id' element={<Artist/>}/>
            <Route path='/album/:id' element={<Album/>}/>
            <Route path='/playlist/:id' element={<Playlist/>}/>
            <Route path='/track/:id' element={<Track/>}/>
            <Route path='/user/:id' element={<User/>}/>
            <Route path='/settings' element={<Settings/>}/>
            <Route path='/account' element={<Account/>}/>
          </Routes>
        </main>
      </div>
      <div className="playback">
        <div className='playback-info'>
          {playbackState?.item && 
            <>
              <img src={playbackState?.item?.album?.images?.[0]?.url}/>
              <div>
                <Link className='title' Link to={'/track/' + playbackState?.item?.id}>{playbackState?.item?.name}</Link>
                <div className='artists'>{playbackState?.item?.artists.map((artist, i) => <>{i > 0 && <p>, </p>}<Link to={'/artist/' + artist.id}>{artist.name}</Link></>)}</div>
              </div>
            </>
          }
        </div>
        <div className='playback-controls'>
          <div className='buttons'>
            <img className="shuffle" src={!playbackState?.shuffle_state ? '/shuffle.png' : '/shuffle-on.png'}/>
            <span className='pause'><img src={playbackState?.is_playing ? '/pause.png' : '/play.png'}/></span>
            <img className="repeat" src={playbackState?.repeat_state === 'track' ? '/repeat-one.png' : playbackState?.repeat_state === 'context' ? '/repeat-on.png' : '/repeat.png'}/>
          </div>
          <div className='timeline'>
            <p>{playbackState ? msToMins(playbackState?.progress_ms) : '0:00'}</p>
            <div className='bar' style={{width: '32vw', height: '4px'}}>
              {playbackState && 
                <div className='progress'
                  style={{
                    width: `${(Math.round((100 / playbackState?.item?.duration_ms) * playbackState?.progress_ms))}%`,
                    backgroundColor: 'white',
                    height: '100%'
                  }}
                />
              }
            </div>
            <p>{playbackState?.item ? msToMins(playbackState?.item?.duration_ms) : '0:00'}</p>
          </div>
        </div>
        <div/>
      </div>
    </div>
  );
}