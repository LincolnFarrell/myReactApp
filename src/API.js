import qs from 'qs';

const scopeList = [
    'user-library-read', 
    'user-library-modify',
    'user-follow-read', 
    'user-follow-modify', 
    'playlist-read-private',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-read-recently-played', 
    'user-top-read', 
    'user-read-playback-state', 
    'ugc-image-upload'
].join(' ');
const scopes = scopeList.replace(' ', '%20');

const CLIENT_ID = '65e1d8434d1c47e680ceccd9b0d80b58';
const CLIENT_SECRET = 'c61c4d5ee0d044eaacbe7cdca0678ae7';
const REDIRECT_URI = 'http://localhost:3000/callback';
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scopes}`;

const headers = {
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${isAuthTokenAvailable() ? localStorage.getItem('spotify_auth_token') : localStorage.getItem('spotify_client_token')}`
}

export async function fetchAuthToken(code) {
    const authHeader = btoa(CLIENT_ID + ':' + CLIENT_SECRET);
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        }, body: qs.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
        }),
    }).catch(err => {
        console.error('Error exchanging code for token:', err.response);
        alert('Authentication failed');
    });
    const data = await response.json();
    localStorage.setItem('spotify_auth_token_expiry', Date.now());
    localStorage.setItem('spotify_auth_token', data.access_token);
    localStorage.setItem('spotify_refresh_token', data.refresh_token);
    window.location.replace('/');
}

export async function refreshAuthToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }, body: qs.stringify({
            grant_type: 'refresh_token', 
            refresh_token: localStorage.getItem('spotify_refresh_token'),
            client_id: CLIENT_ID
    })});
    const data = await response.json();
    localStorage.setItem('spotify_auth_token_expiry', Date.now());
    localStorage.setItem('spotify_auth_token', data.access_token);
    localStorage.setItem('spotify_refresh_token', data.refresh_token);
    window.location.reload();
}

export async function fetchClientToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', 
        }, body: qs.stringify({
            grant_type: 'client_credentials', 
            client_id: CLIENT_ID, 
            client_secret: CLIENT_SECRET
    })});
    const data = await response.json();
    localStorage.setItem('spotify_client_token_expiry', Date.now());
    localStorage.setItem('spotify_client_token', data.access_token);
    window.location.reload();
}

export function isClientTokenAvailable() {
    const localToken = localStorage.getItem('spotify_client_token');
    if (localToken) {
        const tokenExpiry = localStorage.getItem('spotify_client_token_expiry');
        if (Date.now() - tokenExpiry > 600000) return false;
        else return true;
    } else return false;
}

export function isAuthTokenAvailable() {
    const authToken = localStorage.getItem('spotify_auth_token');
    if (authToken && authToken != 'undefined') {
        const tokenExpiry = localStorage.getItem('spotify_auth_token_expiry');
        if (Date.now() - tokenExpiry > 600000) return false;
        else return true;
    } else return false;
}

export function isRefreshTokenAvailable() {
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    if (refreshToken && refreshToken != 'undefined') return true;
    else return false;
}

export function login() {
    window.location.href = AUTH_URL;
}

export function logout() {
    localStorage.removeItem('spotify_auth_token_expiry');
    localStorage.removeItem('spotify_auth_token');
    localStorage.removeItem('spotify_refresh_token');
    window.location.reload();
}

function hasError(data) {
    if (data?.error) {
        if (data.error?.message === "Invalid access token" && isRefreshTokenAvailable()) console.log(isRefreshTokenAvailable());
    } else return false;
}

export async function getContentFromSearch(query, type) {
    const response = await fetch('https://api.spotify.com/v1/search?' 
        + qs.stringify({
            q: query, 
            type: type
        }), {
            method: 'GET',
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
} 

export async function getContentFromId(contentId, type) {
    const response = await fetch(`https://api.spotify.com/v1/${type}s/${contentId}` 
        + qs.stringify({
            //empty
        }), {
            method: 'GET',
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

export async function getContentFromCollectionId(collectionId, collectionType, itemType) {
    const response = await fetch(`https://api.spotify.com/v1/${collectionType}s/${collectionId}/${itemType}s`
        + qs.stringify({
            //empty
        }), {
            method: 'GET',
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

export async function getContentFromFollowed(type) {
    const response = await fetch('https://api.spotify.com/v1/me/following?' 
        + qs.stringify({
            type: type //only 'artist' works
        }), {
            method: 'GET', 
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

export async function getContentFromLibrary(type) {
    const response = await fetch(`https://api.spotify.com/v1/me/${type}s/`
        + qs.stringify({
            //empty
        }), {
            method: 'GET', 
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

export async function getTopContent(type, time_range, limit = 50) {
    const response = await fetch(`https://api.spotify.com/v1/me/top/${type}s?`
        + qs.stringify({
            time_range: time_range, // (short/medium/long)_term
            limit: limit
        }), {
            method: 'GET', 
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

export async function getRecentlyPlayed() {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played'
        + qs.stringify({
            //empty
        }), {
            method: 'GET', 
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

export async function getTopTracksFromArtist(id) {
    const response = await fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks`
        + qs.stringify({
            //empty
        }), {
            method: 'GET', 
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

///
// DEPRECATED AS OF 24-11-27
///
export async function getRelatedArtists(id) {
  const response = await fetch(`https://api.spotify.com/v1/artists/${id}/related-artists`
        + qs.stringify({
            //empty
        }), {
            method: 'GET',
            headers
  });
  const data = await response.json();
  if (!hasError(data)) return data;
}

///
// DEPRECATED AS OF 24-11-27
///
export async function getFeaturedPlaylists() {
    const response = await fetch('https://api.spotify.com/v1/browse/featured-playlists'
        + qs.stringify({
            //empty
        }), {
            method: 'GET',
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

export async function getNewReleases() {
    const response = await fetch('https://api.spotify.com/v1/browse/new-releases'
        + qs.stringify({
            //empty
        }), {
            method: 'GET',
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

///
// DEPRECATED AS OF 24-11-27
///
export async function getRecommendedBySeed(seed_tracks, seed_artists) {
    const params = {};
    if (seed_tracks) params.seed_tracks = seed_tracks;
    if (seed_artists) params.seed_artists = seed_artists;

    const response = await fetch('https://api.spotify.com/v1/recommendations?'
        + qs.stringify(
            params
        ), {
            method: 'GET',
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

export async function getUserById(id) {
    const response = await fetch(`https://api.spotify.com/v1/users/${id}`
        + qs.stringify({
            //empty
        }), {
            method: 'GET',
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

export async function getCurrentUser() {
    const response = await fetch('https://api.spotify.com/v1/me'
        + qs.stringify({
            //empty
        }), {
            method: 'GET',
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

export async function getPublicPlaylistsFromUser(id) {
    const response = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`
        + qs.stringify({
            //empty
        }), {
            method: 'GET',
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

export async function createPlaylist(userId) {
    await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`
        + qs.stringify({
            //empty
        }), {
            method: 'POST',
            headers, 
            body: JSON.stringify({
                name: 'New Playlist'
            })
    });
}

export async function doesUserFollowPlaylist(id) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/followers/contains`
        + qs.stringify({
            //empty
        }), {
            method: 'GET',
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

export async function followPlaylist(playlistId) {
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`
        + qs.stringify({
            //empty
        }), {
            method: 'PUT',
            headers
    });
}

export async function unfollowPlaylist(playlistId) {
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`
        + qs.stringify({
            //empty
        }), {
            method: 'DELETE',
            headers
    });
}

export async function addTrackToPlaylist(playlistId) {
    //post
}

export async function removeTrackFromPlaylist(playlistId) {
    //delete
}

export async function renamePlaylist(playlistId, name) {
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`
        + qs.stringify({
            //empty
        }), {
            method: 'PUT',
            headers, 
            body: JSON.stringify({
                name: name
            })
    });
}

export async function changePlaylistImage(playlistId, image) {
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`
        + qs.stringify({
            //empty
        }), {
            method: 'PUT',
            headers, 
            body: image
    });
}

export async function doesUserFollowTrack(id) {
    const response = await fetch('https://api.spotify.com/v1/me/tracks/contains?'
        + qs.stringify({
            ids: id
        }), {
            method: 'GET',
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

export async function followTrack(trackId) {
    await fetch('https://api.spotify.com/v1/me/tracks?'
        + qs.stringify({
            ids: trackId
        }), {
            method: 'PUT',
            headers
    });
}

export async function unfollowTrack(trackId) {
    await fetch('https://api.spotify.com/v1/me/tracks?'
        + qs.stringify({
            ids: trackId
        }), {
            method: 'DELETE',
            headers
    });
}

export async function doesUserFollowUserOrArtist(type, id) {
    const response = await fetch('https://api.spotify.com/v1/me/following/contains?'
        + qs.stringify({
            type: type,
            ids: id
        }), {
            method: 'GET',
            headers
    });
    const data = await response.json();
    if (!hasError(data)) return data;
}

export async function followUserOrArtist(type, id) {
    await fetch('https://api.spotify.com/v1/me/following?'
        + qs.stringify({
            type: type,
            ids: id
        }), {
            method: 'PUT',
            headers
    });
}

export async function unfollowUserOrArtist(type, id) {
    await fetch('https://api.spotify.com/v1/me/following?'
        + qs.stringify({
            type: type,
            ids: id
        }), {
            method: 'DELETE',
            headers
    });
}

export async function getPlaybackState() {
    const response = await fetch(`https://api.spotify.com/v1/me/player`
        + qs.stringify({
            //empty
        }), {
            method: 'GET',
            headers
    });
    if (response.status != 204) {
        const data = await response.json();
        if (!hasError(data)) return data;
    } else return null;
}