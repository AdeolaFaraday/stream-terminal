import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";

export const agoraEngineGlobal = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export const FetchToken = async (uid, channelName) => {
    return new Promise(function (resolve) {
        axios
            .get(
                `https://agora-token-server-c7kv.onrender.com/generateToken?channelName=${channelName}&uid=${uid}`
            )
            .then((response) => {
                resolve(response.data.tokenA);
            })
            .catch((error) => {
                console.log(error);
            });
    });
};



export const APP_ID = "e9b38caaab77438fa64316dad3bbda81"

export const APP_DEFAULT_TOKEN = "007eJxTYKiUdjsfoz774/6bDGYmRySMdLu//jMPfHlwUkjSAXM2dx0FhlTLJGOL5MTExCRzcxNji7REMxNjQ7OUxBTjpKSURAvDQ1M+pFxa9CFFW6KegREIWYAYBJjAJDOYZAGTvAxpmUXFJbrJGYl5eak5jAwGALzOI8c="
