import { useEffect, useRef, useState } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import './App.css';
import { FetchToken } from './agora';
import { Link } from 'react-router-dom';

const App = () => {
  const videoRef = useRef(null);
  const [terminals] = useState([
    {
      id: 1,
      "name": "Terminal-1"
    },
    {
      id: 2,
      "name": "Terminal-2"
    },
    {
      id: 3,
      "name": "Terminal-3"
    },
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
  const [options, setOptions] = useState({
    // Pass your App ID here.
    appId: "e9b38caaab77438fa64316dad3bbda81",
    // Set the channel name.
    channel: "first-channel",
    // Pass your temp token here.
    token:
      "007eJxTYKiUdjsfoz774/6bDGYmRySMdLu//jMPfHlwUkjSAXM2dx0FhlTLJGOL5MTExCRzcxNji7REMxNjQ7OUxBTjpKSURAvDQ1M+pFxa9CFFW6KegREIWYAYBJjAJDOYZAGTvAxpmUXFJbrJGYl5eak5jAwGALzOI8c=",
    // Set the user ID.
    uid: 1,
    ExpireTime: 3600,
    // The base URL to your token server. For example, https://agora-token-service-production-92ff.up.railway.app".
    serverUrl: "https://agora-token-service-production-ee00.up.railway.app",
  })

  const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  useEffect(() => {
    FetchToken(options?.uid, options?.channel).then((token) => {
      setOptions({ ...options, token })
    });
    agoraEngine.on("token-privilege-will-expire", async function () {
      const token = await FetchToken();
      setOptions({ ...options, token })
      await agoraEngine.renewToken(options.token);
    });

    // const video = document.getElementById('video-player');
    // if (
    //   /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    //   !window.MSStream
    // ) {
    //   video.muted = true;
    //   video.play();
    //   video.onplaying = function () {
    //     video.muted = false;
    //   };
    // }
  }, [options?.uid]);

  const startWebcamStream = async () => {
    try {
      // const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      // const stream = await navigator.mediaDevices.getUserMedia({ video: true })

      if (videoRef.current) {
        // videoRef.current.srcObject = stream
        // new MediaStream([
        //   localVideoTrack?._originMediaStreamTrack
        // ]);
        startStream()
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }

  // http://knowforth.online:3050/fillTerminal

  const startStream = async () => {
    // Create a local audio track from the audio sampled by a microphone.
    const data = await agoraEngine.join(options.appId, options.channel, options.token, options.uid)
    console.log({ data });
    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Create a local video track from the video captured by a camera.
    const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    if (videoRef.current) {
      videoRef.current.srcObject = new MediaStream([
        localVideoTrack?._originMediaStreamTrack
      ]);
    }
    await agoraEngine.publish([localAudioTrack, localVideoTrack]);
    console.log("publish success!");
  }

  const handleTerminalChange = (event) => {
    setOptions({ ...options, uid: +event.target.value })
  }
  return (
    <div className='h-screen'>
      <div className="lg:w-1/4 w-4/5 flex flex-col justify-center item-center m-auto h-full">
        {/* <div className='flex justify-center'>
          <Link className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" to="/dashboard">
            Go to dashboard
          </Link>
        </div> */}
        <div>
          <label for="terminal" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a terminal</label>
          <select onChange={handleTerminalChange} id="terminal" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>Choose a terminal</option>
            {terminals?.map((terminal) => <option value={terminal.id}>{terminal?.name}</option>)}
          </select>
        </div>
        <div className='mt-4'>
          <video id="video-player" ref={videoRef} playsInline autoPlay={true} muted className='h-full bg-neutral-950 w-full rounded'></video>
        </div>
        <div className='flex justify-center'>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              startWebcamStream()
              // if (videoRef.current) {
              //   videoRef.current.srcObject = null;
              // }
            }}
          >
            Turn on camera
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

// https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=web
