import AgoraRTC from 'agora-rtc-sdk-ng';
import React, { useEffect, useState } from 'react';
import VideoComponent from './VideoComponent';
import ToggleButton from './ToggleButton';
import BlanKVideo from './BlankVideo';
import { APP_ID, FetchToken } from './agora';

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

    const [selectedStream, setSelectedStream] = useState({
        id: 4,
    })
    const [selectedTerminal, setSelectedTerminal] = useState(4)

    const [options, setOptions] = useState({
        channel: "first-channel",
        uid: 12,
        ExpireTime: 3600,
        token: null,
    })

    const [videoStates, setVideoStates] = useState([
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
        FetchToken(options?.uid, options?.channel).then((token) => {
            setOptions({ ...options, token })
        });
        agoraEngine.on("token-privilege-will-expire", async function () {
            const token = await FetchToken(options?.uid, options?.channel);
            setOptions({ ...options, token })
            await agoraEngine.renewToken(options.token);
        });
    }, [])

    useEffect(() => {
        // if (options.token) {
        //     console.log({ token: options.token });
        // }
        agoraEngine.join(APP_ID, options.channel, options.token, options.uid).then((data) => {
            console.log({ data });
        });
    }, [options.token])

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
                console.log({
                    audio: user?.audioTrack?._originMediaStreamTrack
                });
                setVideo(prev => [...prev, {
                    id: user?.uid,
                    stream: new MediaStream([
                        user.videoTrack?.getMediaStreamTrack(),
                    ]),
                    audio: user?.audioTrack?._originMediaStreamTrack
                }])
                if (user.uid === 4) {
                    setSelectedStream({
                        id: 4,
                        stream: new MediaStream([
                            user.videoTrack?.getMediaStreamTrack(),
                        ]),
                        audio: user?.audioTrack?._originMediaStreamTrack
                    })
                }
            }
        });
    }, [])

    const handleTerminalChange = (event) => {
        const findStream = video?.find((v) => v?.id === +event.target.value)
        setSelectedTerminal(event.target.value)
        setSelectedStream(findStream)
    }

    const getSelectedTerminalToggleVisibility = (id) => {
        const findStream = video?.find((v) => v?.id === +id)
        return findStream ? true : false
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
                setSelectedStream({
                    id: index,
                    stream: null
                })
            }
        } else {
            const updatedVideoStates = videoStates.map((video) => {
                if (video.id === index) {
                    return {
                        ...video,
                        visible: event.target.checked
                    };
                }
                return video;
            });

            setVideoStates(updatedVideoStates);
        }
    }

    return (
        <div className='bg-gray-100'>
            <label for="terminal" class="block mb-2 text-lg text-center font-medium text-gray-900 dark:text-white">Video DashBoard</label>
            <div className="grid grid-col-1 lg:grid-cols-3 gap-4 p-8">
                {videoStates.map((video, index) => (
                    <div key={index} className="relative">
                        {video.visible ? (
                            <VideoComponent isStreamAvailable={getStream(index) && video.visible} mediaStream={getStream(index)?.stream} audioStream={getStream(index)?.audio} />
                        ) : <BlanKVideo />}
                        <div className='flex justify-center mt-3'>
                            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2">Terminal {index + 1}</span>
                            {getStream(index)?.stream && <ToggleButton isStreamAvailable={getStream(index) && video.visible} handleToggle={(event) => handleToggle(video.id, event)} />}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col justify-center lg:w-1/3 w-full m-auto p-8">
                <div className='mb-4'>
                    <select onChange={handleTerminalChange} id="terminal" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        {terminals?.map((terminal, index) => <option key={index} value={terminal.id}>{terminal?.name}</option>)}
                    </select>
                </div>
                <div className="relative">
                    <VideoComponent mediaStream={selectedStream?.stream} audioStream={selectedStream?.audio} isStreamAvailable={selectedStream?.stream && (selectedStream.id === +selectedTerminal)} />
                    <div className='flex justify-center mt-3'>
                        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2">Terminal {selectedTerminal}</span>
                        {getSelectedTerminalToggleVisibility(selectedStream?.id) && <ToggleButton handleToggle={(event) => handleToggle(+selectedTerminal, event, 'drop-down')} isStreamAvailable={selectedStream?.stream && (selectedStream.id === +selectedTerminal)} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoardPage;

