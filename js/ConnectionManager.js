<<<<<<< HEAD

import FragmentManager from "./FragmentManager.js";

let template = document.getElementById("users");
let VideoManager = new FragmentManager(template);
window.VideoManager = VideoManager;

function generateId(len = 30, chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890") {
    let id = "";
    while(--len > 0) {
        id += chars[Math.round(Math.random() * chars.length)];
    } 
    if (id === void 0)
        return;

    return id.toLowerCase();
}

window.generateId = generateId;

window.location.hash = window.generateId()


var stop = function () {
    var stream = video.srcObject;
    var tracks = stream.getTracks();
    for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        track.stop();
    }
    video.srcObject = null;
}

export default class ConnectionManager {
    constructor(url) {
        this.ws = null;
        this.url = url;
    }
    recieve(msg) {
        console.log(msg.data)
        if (msg.data == void 0) return;
        this.data = JSON.parse(msg.data);
        return this.data;
    }
    send(msg) {
        if (typeof msg !== "object") return;
        let sterialized = JSON.stringify(msg);
        console.log(`Sending, ${sterialized}`);
        this.ws.send(sterialized);
        return sterialized;
    }

    connect() {
        this.ws = new WebSocket(this.url)
        this.ws.addEventListener("open", () => {
            this.token = generateId();
            this.send({type: "videoJoin", fragment: VideoManager, userName: this.token})
            console.log("Connection Established")
            this.ws.addEventListener("message", (msg) => {
                const data = this.recieve(msg);
                if (data.type == "join-user") {
                    VideoManager.add(this.token)
                    console.log(VideoManager.captureStream(60))
                    this.send({type: "video-update"});
                } else if (data.type == "disconnect-user") {
                    VideoManager.remove(this.token)
                }
            });
        });
    }
=======

import FragmentManager from "./FragmentManager.js";

let template = document.getElementById("users");
let VideoManager = new FragmentManager(template);
window.VideoManager = VideoManager;

function generateId(len = 30, chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890") {
    let id = "";
    while(--len > 0) {
        id += chars[Math.round(Math.random() * chars.length)];
    } 
    if (id === void 0)
        return;

    return id.toLowerCase();
}

window.generateId = generateId;

window.location.hash = window.generateId()


var stop = function () {
    var stream = video.srcObject;
    var tracks = stream.getTracks();
    for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        track.stop();
    }
    video.srcObject = null;
}

export default class ConnectionManager {
    constructor(url) {
        this.ws = null;
        this.url = url;
    }
    recieve(msg) {
        console.log(msg.data)
        if (msg.data == void 0) return;
        this.data = JSON.parse(msg.data);
        return this.data;
    }
    send(msg) {
        if (typeof msg !== "object") return;
        let sterialized = JSON.stringify(msg);
        console.log(`Sending, ${sterialized}`);
        this.ws.send(sterialized);
        return sterialized;
    }

    connect() {
        this.ws = new WebSocket(this.url)
        this.ws.addEventListener("open", () => {
            this.token = generateId();
            this.send({type: "videoJoin", fragment: VideoManager, userName: this.token})
            console.log("Connection Established")
            this.ws.addEventListener("message", (msg) => {
                const data = this.recieve(msg);
                if (data.type == "join-user") {
                    VideoManager.add(this.token)
                    console.log(VideoManager.captureStream(60))
                    this.send({type: "video-update"});
                } else if (data.type == "disconnect-user") {
                    VideoManager.remove(this.token)
                }
            });
        });
    }
>>>>>>> b8660830268428f671dc9077d40597616419f13c
}