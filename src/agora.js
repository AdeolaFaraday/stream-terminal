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
export const KNOW_FORTH_API = "http://knowforth.online:3050/fillTerminal"

export const APP_DEFAULT_TOKEN = "007eJxTYGB9uf/eaek/24RPbVrT5lOgdKT56DVXx/MhYnEV2zj1QzQUGFItk4wtkhMTE5PMzU2MLdISzUyMDc1SElOMk5JSEi0Mg098SUm+9iVlYlQYMyMDIwMLEIMAE5hkBpMsYJKXIS2zqLhENzkjMS8vNYeJwcgIAIpiJVY="
