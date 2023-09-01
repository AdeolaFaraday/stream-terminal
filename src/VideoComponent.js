import React, { useRef, useEffect, useState } from 'react';

const VideoComponent = ({ mediaStream, audioStream, isStreamAvailable }) => {
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);


    useEffect(() => {
        if (videoRef.current && mediaStream) {
            videoRef.current.srcObject = mediaStream;
        }

        if (audioStream && audioRef.current && playing) {
            const audioTrack = new MediaStream([audioStream]); // Create a MediaStream with the audio track
            audioRef.current.srcObject = audioTrack;
            audioRef.current.play();
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, [mediaStream, audioStream, playing]);

    const handlePlayButtonClick = () => {
        setPlaying(true);
    };

    return <>
        <video
            ref={videoRef}
            playsInline
            autoPlay={true}
            muted
            style={{
                transform: 'rotateY(180deg)'
            }}
            className="w-full h-72 rounded bg-neutral-950"
        />
        <audio ref={audioRef} autoPlay />
        {isStreamAvailable && <button
            onClick={handlePlayButtonClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 p-1 rounded transition duration-300 ease-in-out"
        >
            Play audio
        </button>}
    </>

}

export default VideoComponent;
