import { useEffect, useState } from "react";
import Carousel from '../components/Carousel'
import { getRecommendedBySeed, getRecentlyPlayed, getTopContent, getFeaturedPlaylists, getNewReleases, isAuthTokenAvailable } from "../API";
import { cutoff } from "../Utils";

export default function Home() {
    const [seedTrack, setSeedTrack] = useState('');
    const [seedArtist, setSeedArtist] = useState('');
    const [recommendedByTrack, setRecommendedByTrack] = useState([]);
    const [recommendedByArtist, setRecommendedByArtist] = useState([]);
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    useEffect(() => {
        setRecommendedByTrack([]);
        setRecentlyPlayed([]);
        setTopArtists([]);
        setTopTracks([]);
        setFeaturedPlaylists([]);
        setNewReleases([]);
        
        async function getResults() {
            if (isAuthTokenAvailable()) {
                const recently_played = (await getRecentlyPlayed()).items; setRecentlyPlayed(recently_played);
                if (recently_played.length > 0) {
                    // setSeedTrack(recently_played?.[0]?.track?.name);
                    // setRecommendedByTrack((await getRecommendedBySeed(recently_played?.[0]?.track?.id, null)).tracks);
                }
                const top_artists = (await getTopContent('artist', 'short_term')).items; setTopArtists(top_artists);
                if (top_artists.length > 0) {
                    // setSeedArtist(top_artists?.[0]?.name);
                    // setRecommendedByArtist((await getRecommendedBySeed(null, top_artists?.[0]?.id)).tracks);
                }
                setTopTracks((await getTopContent('track', 'short_term')).items);
            }
            setFeaturedPlaylists((await getFeaturedPlaylists()).playlists.items);
            setNewReleases((await getNewReleases()).albums.items);
        } getResults();
    }, []);


    return (
        <>
            {recentlyPlayed.length > 0 && <Carousel title='Recently Played' contentType='track' wrapped={true} content={recentlyPlayed}/>}
            {recommendedByTrack.length > 0 && <Carousel title={`Because you liked ${cutoff(seedTrack, 70)}`} contentType='track' content={recommendedByTrack}/>}
            {topArtists.length > 0 && <Carousel title='Your Top Artists' contentType='artist' content={topArtists}/>}
            {recommendedByArtist.length > 0 && <Carousel title={`Because you\'ve been liking ${cutoff(seedArtist, 70)}`} contentType='track' content={recommendedByArtist}/>}
            {topTracks.length > 0 && <Carousel title='Your Top Tracks' contentType='track' content={topTracks}/>}
            {featuredPlaylists.length > 0 && <Carousel title='Featured Playlists' contentType='playlist' content={featuredPlaylists}/>}
            {newReleases.length > 0 && <Carousel title='New Releases' contentType='album' content={newReleases}/>}
        </>
    );
}