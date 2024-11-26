import { Link } from 'react-router-dom';
import { msToMins } from '../Utils'

export default function List({ title=null, contentType, content=[] }) {    
    return (
        <div className="tracklist">
            {title && <h2>{title}</h2>}
            <hr/>
            {content.map((item, i) => (
                contentType === 'album' ? 
                    (<>
                        <div className="track">
                            <p>{item.track_number}</p>
                            <Link to={'/track/' + item.id} className='track-title'>{item.name}</Link>
                            <p style={{flex: 1, textAlign: 'right'}}>{msToMins(item.duration_ms)}</p>
                        </div>
                    </>)
                : contentType === 'playlist' ?
                    (<>
                        <div className="track">
                            <p>{i + 1}</p>
                            <img src={item.track?.album?.images?.[2]?.url || item.track?.album?.images?.[1]?.url || item.track?.album?.images?.[0]?.url} className='track-image'/>
                            <Link to={'/track/' + item.track.id} className='track-title'>{item.track.name}</Link>
                            <p style={{flex: 1, textAlign: 'right'}}>{msToMins(item.track.duration_ms)}</p>
                        </div>
                    </>)
                : contentType === 'track' ?
                (<>
                    <div className="track">
                        <p>{i + 1}</p>
                        <img src={item?.album?.images?.[2]?.url || item?.album?.images?.[1]?.url || item?.album?.images?.[0]?.url} className='track-image'/>
                        <Link to={'/track/' + item.id} className='track-title'>{item.name}</Link>
                        <p style={{flex: 1, textAlign: 'right'}}>{msToMins(item.duration_ms)}</p>
                    </div>
                </>)
                : contentType === 'artist' ?
                (<>
                    <div className="track">
                        <p>{i + 1}</p>
                        <img src={item?.images?.[2]?.url || item?.images?.[1]?.url || item?.images?.[0]?.url} className='track-image'/>
                        <Link to={'/artist/' + item.id} className='track-title'>{item.name}</Link>
                    </div>
                </>)
                : <>neither</>
            ))}
        </div>
    );
}