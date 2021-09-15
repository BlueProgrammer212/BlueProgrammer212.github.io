import ConnectionManager from "./js/ConnectionManager.js"

let connection = new ConnectionManager("ws://192.168.18.10:6969/");
connection.connect();
