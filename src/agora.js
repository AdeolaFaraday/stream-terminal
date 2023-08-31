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
