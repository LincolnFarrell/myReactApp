import qs from 'qs';

const scopeList = [
    'streaming',
    'user-read-private',
    'user-read-email',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-library-modify',
    'user-follow-modify',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-top-read'
].join(' ');
const scopes = scopeList.replace(' ', '%20');

const CLIENT_ID = '65e1d8434d1c47e680ceccd9b0d80b58';
const CLIENT_SECRET = 'c61c4d5ee0d044eaacbe7cdca0678ae7';
const REDIRECT_URI = 'http://localhost:3000/#/callback';
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scopes}`;

const headers = {
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${localStorage.getItem('spotify_client_token')}`
}

export async function fetchAuthToken({ code }) {
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
    window.location.href = window.location.origin;
    window.location.hash = '';
    window.location.reload();
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
    window.location.hash = '';
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
    window.location.hash = '';
    window.location.reload();
}

export function isClientTokenAvailable() {
    const localToken = localStorage.getItem('spotify_client_token');
    if (localToken) {
        const tokenExpiry = localStorage.getItem('spotify_client_token_expiry');
        if (Date.now() - tokenExpiry > 3600000) return false;
        else return true;
    } else return false;
}

export function isAuthTokenAvailable() {
    const authToken = localStorage.getItem('spotify_auth_token');
    if (authToken) {
        const tokenExpiry = localStorage.getItem('spotify_auth_token_expiry');
        if (Date.now() - tokenExpiry > 3600000) return false;
        else return true;
    } else return false;
}

export function isRefreshTokenAvailable() {
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    if (refreshToken) return true;
    else return false;
}

export function login() {
    window.location.href = AUTH_URL;
}

export function logout() {
    localStorage.removeItem('spotify_auth_token_expiry');
    localStorage.removeItem('spotify_auth_token');
    localStorage.removeItem('spotify_refresh_token');
    window.location.hash = '';
    window.location.reload();
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
    return await response.json();
} 

export async function getContentFromId(contentId, type) {
    const response = await fetch('https://api.spotify.com/v1/' + type + 's/' + contentId 
        + qs.stringify({
            //empty
        }), {
            method: 'GET',
            headers
    });
    return await response.json();
}

export async function getContentFromCollectionId(collectionId, collectionType, itemType) {
    const response = await fetch('https://api.spotify.com/v1/' + collectionType + 's/' + collectionId + '/' + itemType + 's'
        + qs.stringify({
            //empty
        }), {
            method: 'GET',
            headers
    });
    return await response.json();
}