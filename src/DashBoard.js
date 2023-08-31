import AgoraRTC from 'agora-rtc-sdk-ng';
import React, { useEffect, useRef, useState } from 'react';
import VideoComponent from './VideoComponent';

const DashBoardPage = () => {
    const [video, setVideo] = useState([])

    const [options] = useState({
        // Pass your App ID here.
        appId: "e9b38caaab77438fa64316dad3bbda81",
        // Set the channel name.
        channel: "first-channel",
        // Pass your temp token here.
        token: "007eJxTYKiUdjsfoz774/6bDGYmRySMdLu//jMPfHlwUkjSAXM2dx0FhlTLJGOL5MTExCRzcxNji7REMxNjQ7OUxBTjpKSURAvDQ1M+pFxa9CFFW6KegREIWYAYBJjAJDOYZAGTvAxpmUXFJbrJGYl5eak5jAwGALzOI8c=",
        // Set the user ID.
        uid: 11,
        ExpireTime: 3600,
        // The base URL to your token server. For example, https://agora-token-service-production-92ff.up.railway.app".
        serverUrl: "https://agora-token-service-production-ee00.up.railway.app",
    })

    const [videoStates] = useState([
        true, true, true,
        true, true
    ]);

    const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    useEffect(() => {
        agoraEngine.join(options.appId, options.channel, options.token, options.uid).then((data) => {
            console.log({ data });
        });
    }, [])

    useEffect(() => {
        agoraEngine.on("user-published", async (user, mediaType) => {
            // Subscribe to the remote user when the SDK triggers the "user-published" event.
            await agoraEngine.subscribe(user, mediaType);

            console.log("got hereeeeeee", { user: user?.uid, uid: user?._videoTrack?.store?.uid });

            if (mediaType == "video") {
                // Retrieve the remote video track.
                // videoRef.current.srcObject = new MediaStream([
                //     user.videoTrack?.getMediaStreamTrack(),
                // ]);
                setVideo(prev => [...prev, {
                    id: user?.uid,
                    stream: new MediaStream([
                        user.videoTrack?.getMediaStreamTrack(),
                    ])
                }])
            }
        });
    }, [])

    return (
        <div>
            <label for="terminal" class="block mb-2 text-lg text-center font-medium text-gray-900 dark:text-white">Video DashBoard</label>
            <div className="grid grid-col-1 lg:grid-cols-3 gap-4 p-8 bg-gray-100">
                {videoStates.map((isVideoVisible, index) => (
                    <div key={index} className="relative">
                        {isVideoVisible && (
                            <VideoComponent mediaStream={video?.find(v => v.id === index + 1)?.stream} />
                        )}
                        <div className='flex justify-center mt-3'>
                            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2">Terminal {index + 1}</span>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" class="sr-only peer" />
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashBoardPage;

