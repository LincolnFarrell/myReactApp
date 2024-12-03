import { useEffect } from "react";

export default function Account() {
    useEffect(() => {
        window.location.href = 'https://www.spotify.com/ca-en/account/overview/';
    }, [])

    return (
        <div>
            <h2>Account</h2>
        </div>
    );
};