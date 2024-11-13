import './App.css';
import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { login, logout, isClientTokenAvailable, isAuthTokenAvailable, isRefreshTokenAvailable, fetchClientToken, refreshAuthToken } from './API';
import Home from './pages/Home';
import Search from './pages/Search';
import Artist from './pages/Artist';
import Album from './pages/Album';
import Playlist from './pages/Playlist';
import Track from './pages/Track';
import Settings from './pages/Settings';
import Callback from './pages/Callback';

const SIDEBAR_WIDTH = 200;

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const [sidebarLeft, setSidebarLeft] = useState(0);
  const toggleSidebar = () => {
    setSidebarLeft(sidebarLeft === 0 ? -(SIDEBAR_WIDTH + 8) : 0);
  }

  useEffect(() => {
    if (!isAuthTokenAvailable()) {
      if (!isRefreshTokenAvailable()) {
        if (!isClientTokenAvailable()) { fetchClientToken(); }
      } else { refreshAuthToken(); }
    } else { setLoggedIn(true); }
  }, []);

  return (
    <div className='App'>
      <div className='header'>
        <div className='logo'>
          <a href={window.location.origin + '#'}>Spotify</a>
        </div>
        <div className='search'>
          <input type='text' placeholder='Search...' 
            onKeyDown={event => {
              if (event.key == 'Enter') { 
                window.location.href = window.location.origin + ('/#/search/' + event.target.value); 
          }}}/>
        </div>
        <div className='account'>
          {loggedIn ? 
            <button onClick={logout} style={{color: 'black'}}>Log out</button>
          : 
            <button onClick={login} style={{color: 'black'}}>Log in</button>
          }
        </div>
      </div>
      <div className='content'>
        <div className="sidebar" style={{marginLeft: sidebarLeft}}>
          <a href="javascript:void(0)" onClick={toggleSidebar}>&times;</a>
          <a href="#">Home</a>
          <a href="#/library">Library</a>
          <a href="#/account">Account</a>
          <a href="#/settings">Settings</a>
        </div>
        <main>
          <HashRouter>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/%2Fcallback' element={<Callback/>}/>
              <Route path='/search/:term' element={<Search/>}/>
              <Route path='/artist/:id' element={<Artist/>}/>
              <Route path='/album/:id' element={<Album/>}/>
              <Route path='/playlist/:id' element={<Playlist/>}/>
              <Route path='/track/:id' element={<Track/>}/>
              <Route path='/settings' element={<Settings/>}/>
            </Routes>
          </HashRouter>
        </main>
      </div>
      <div className="playbar">
        <p>PLAY BAR</p>
      </div>
    </div>
  );
}