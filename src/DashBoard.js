import AgoraRTC from 'agora-rtc-sdk-ng';
import React, { useEffect, useState } from 'react';
import VideoComponent from './VideoComponent';
import ToggleButton from './ToggleButton';
import BlanKVideo from './BlankVideo';

const DashBoardPage = () => {
    const [video, setVideo] = useState([])

    const [terminals] = useState([
        {
            id: 4,
            name: "Terminal-4"
        },
        {
            id: 5,
            name: "Terminal-5"
        },
        {
            id: 6,
            name: "Terminal-6"
        },
        {
            id: 7,
            name: "Terminal-7"
        },
        {
            id: 8,
            name: "Terminal-8"
        },
        {
            id: 9,
            name: "Terminal-9"
        },
        {
            id: 10,
            name: "Terminal-10"
        }
    ])

    const [selectedStream, setSelectedStream] = useState(null)
    const [selectedTerminal, setSelectedTerminal] = useState(4)
    const [videoPauseIds, setVideoPausedIds] = useState([])

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
        {
            id: 1,
            visible: true
        },
        {
            id: 2,
            visible: true
        },
        {
            id: 3,
            visible: true
        },
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

            if (mediaType === "video") {
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

    const handleTerminalChange = (event) => {
        const findStream = video?.find((v) => v?.id === +event.target.value)
        setSelectedTerminal(event.target.value)
        setSelectedStream(findStream)
    }

    const getStream = (index) => {
        const stream = video?.find(v => v.id === index + 1)
        return stream ? stream : false
    }

    const handleToggle = (index, event, type) => {
        if (type === 'drop-down') {
            if (event.target.checked) {
                const findStream = video?.find((v) => v?.id === index)
                setSelectedTerminal(index)
                setSelectedStream(findStream)
            } else {
                setSelectedStream(null)
            }
        } else {
            if (event.target.checked) {
                const findStream = video?.find((v) => v?.id === index)
                setSelectedTerminal(index)
                setSelectedStream(findStream)
            } else {
                setSelectedStream(null)
            }
        }
    }

    const getStreamPaused = (index) => {
        return videoPauseIds.includes(index)
    }

    return (
        <div>
            <label for="terminal" class="block mb-2 text-lg text-center font-medium text-gray-900 dark:text-white">Video DashBoard</label>
            <div className="grid grid-col-1 lg:grid-cols-3 gap-4 p-8 bg-gray-100">
                {videoStates.map((video, index) => (
                    <div key={index} className="relative">
                        {video.visible ? (
                            <VideoComponent mediaStream={getStream(index)?.stream} isStreamPaused={getStreamPaused(index)} />
                        ) : <BlanKVideo />}
                        <div className='flex justify-center mt-3'>
                            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2">Terminal {index + 1}</span>
                            <ToggleButton isStreamAvailable={getStream(index)} handleToggle={(event) => handleToggle(index, event)} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col justify-center w-1/3 m-auto p-8 bg-gray-100">
                <div className='mb-4'>
                    <select onChange={handleTerminalChange} id="terminal" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        {terminals?.map((terminal, index) => <option key={index} value={terminal.id}>{terminal?.name}</option>)}
                    </select>
                </div>
                <div className="relative">
                    <VideoComponent mediaStream={selectedStream?.stream} isStreamPaused={getStreamPaused(+selectedStream)} />
                    <div className='flex justify-center mt-3'>
                        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2">Terminal {selectedTerminal}</span>
                        <ToggleButton handleToggle={(event) => handleToggle(+selectedTerminal, event, 'drop-down')} isStreamAvailable={selectedStream?.stream && (selectedStream.id === +selectedTerminal)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoardPage;

