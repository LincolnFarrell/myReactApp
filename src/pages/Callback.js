
import { useEffect } from 'react';
import { fetchAuthToken } from '../API';

export default function Callback() {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
    
        if (code) { fetchAuthToken(code); } 
        else {
            console.error('No code found in URL');
            alert('Authentication failed');
        }
    }, [/*navigate*/]);
  
    return (
        <div>
            <h2>Redirecting...</h2>
            <p>Processing your login...</p>
        </div>
    );
  };