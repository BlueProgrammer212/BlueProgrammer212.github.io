import ConnectionManager from "./js/ConnectionManager.js"

let connection = new ConnectionManager(`wss://${window.location.host}${window.location.pathname}/ws`);
connection.connect();
