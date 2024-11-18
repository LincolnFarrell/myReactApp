import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { login, logout, isClientTokenAvailable, isAuthTokenAvailable, isRefreshTokenAvailable, fetchClientToken, refreshAuthToken } from './API';
import Home from './pages/Home';
import Library from './pages/Library';
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
          <a href={window.location.origin}>Spotify</a>
        </div>
        <div className='search'>
          <input type='text' placeholder='Search...' 
            onKeyDown={event => {
              if (event.key == 'Enter') { 
                window.location.pathname = ('/search/' + event.target.value); 
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
          <a href={window.location.origin}>Home</a>
          <a href={window.location.origin + '/library'}>Library</a>
          <a href={window.location.origin + '/account'}>Account</a>
          <a href={window.location.origin + '/settings'}>Settings</a>
        </div>
        <main>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/callback' element={<Callback/>}/>
              <Route path='/library' element={<Library/>}/>
              <Route path='/search/:term' element={<Search/>}/>
              <Route path='/artist/:id' element={<Artist/>}/>
              <Route path='/album/:id' element={<Album/>}/>
              <Route path='/playlist/:id' element={<Playlist/>}/>
              <Route path='/track/:id' element={<Track/>}/>
              <Route path='/settings' element={<Settings/>}/>
            </Routes>
          </BrowserRouter>
        </main>
      </div>
      <div className="playbar">
        <p>PLAY BAR</p>
      </div>
    </div>
  );
}