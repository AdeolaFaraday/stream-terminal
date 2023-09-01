import React from 'react';

const BlanKVideo = () => {
    return <video
        playsInline
        autoPlay={true}
        muted
        style={{
            transform: 'rotateY(180deg)'
        }}
        className="w-full h-72 rounded bg-neutral-950"
    />;
}

export default BlanKVideo;
