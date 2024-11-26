import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function Carousel({ title, contentType, content=[], wrapped=false }) {
    const [cardSize, setCardSize] = useState(0);
    const [scrollPos, setScrollPos] = useState(0);
    const carouselRef = useRef();

    const handleScroll = (forwards) => {
        let val = scrollPos + (forwards ? carouselRef.current.clientWidth : -carouselRef.current.clientWidth);
        if (val < 0) val = 0;
        if (val > carouselRef.current.scrollWidth - carouselRef.current.clientWidth) val = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

        setScrollPos(val);
        carouselRef.current.scrollLeft = val;
    }

    useEffect (() => {
        setCardSize(carouselRef.current.clientWidth * (1 / 8));
    }, []);

    return (
        <div className="shelf">
            <h2>{title}</h2>
            <div>
                <button onClick={() => handleScroll(false)}>{'<'}</button>
                <div className="carousel" ref={carouselRef}>
                    <div>
                        {content.map((item) => (
                            item = contentType === 'track' && wrapped ? item.track : item,
                            item && (
                                <Link to={'/' + contentType + '/' + item.id} className="card" style={{width: cardSize, height: cardSize * 1.3}}>
                                    <img src={(contentType === 'track' ? item?.album : item)?.images?.[1]?.url || (contentType === 'track' ? item?.album : item)?.images?.[0]?.url || (contentType === 'artist' ? '/avatar.jpg' : '#')} style={contentType === 'artist' ? {borderRadius: '50%'} : {borderRadius: '8px'}}/>
                                    <p>{item.name}</p>
                                </Link>
                        )))}
                    </div> 
                </div>
                <button onClick={() => handleScroll(true)}>{'>'}</button>
            </div>
        </div>
    );
}