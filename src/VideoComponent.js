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
        autoPlay
        muted
        className="w-full h-auto rounded bg-neutral-950"
    />;
}

export default VideoComponent;
