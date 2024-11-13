import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { msToMins } from '../Utils'

export default function List({ contentType, content=[] }) {    
    return (
        <div className="tracklist">
            {content.map((item, i) => (
                contentType === 'album' ? 
                    (<>
                        <Link to={'/track/' + item.id} className="track">
                        <p>{item.track_number}</p>
                        <p>{item.name}</p>
                        <p style={{flex: 1, textAlign: 'right'}}>{msToMins(item.duration_ms)}</p>
                        </Link>
                    </>)
                : contentType === 'playlist' ?
                    (<>
                        <Link to={'/track/' + item.track.id} className="track">
                        <p>{i + 1}</p>
                        <img src={item.track?.album?.images?.[0]?.url} className='track-image'/>
                        <p>{item.track.name}</p>
                        <p style={{flex: 1, textAlign: 'right'}}>{msToMins(item.track.duration_ms)}</p>
                        </Link>
                    </>)
                : <>neither</>
            ))}
        </div>
    );
}