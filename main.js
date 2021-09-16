import ConnectionManager from "./js/ConnectionManager.js"


var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
var address = protocol + window.location.host + window.location.pathname + '/ws';

let connection = new ConnectionManager(address);
connection.connect();
