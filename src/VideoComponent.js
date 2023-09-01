import React, { useRef, useEffect } from 'react';

const VideoComponent = ({ mediaStream }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && mediaStream) {
            videoRef.current.srcObject = mediaStream;
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, [mediaStream]);

    return <video
        ref={videoRef}
        playsInline
        autoPlay={true}
        muted
        style={{
            transform: 'rotateY(180deg)'
        }}
        className="w-full h-72 rounded bg-neutral-950"
    />;
}

export default VideoComponent;
