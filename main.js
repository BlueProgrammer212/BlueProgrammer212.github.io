<<<<<<< HEAD
import ConnectionManager from "./js/ConnectionManager.js"

let connection = new ConnectionManager(`wss://${window.location.host}${window.location.pathname}/ws`);
connection.connect();
=======
import ConnectionManager from "./js/ConnectionManager.js"

let connection = new ConnectionManager("ws://192.168.18.10:6969/");
connection.connect();
>>>>>>> b8660830268428f671dc9077d40597616419f13c
