const WebsocketServer = new require('ws').Server;
const wss = new WebsocketServer({port: 6969});


let room = new Set();


function generateId(len = 6, chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890") {
    let id = "";
    while(--len > 0) {
        id += chars[Math.round(Math.random() * chars.length - 1)];
    } 
    if (id === void 0)
        return;

    return id.toLowerCase();
}

class Client {
    constructor() {
        this.token = generateId();
        this.map = new Map()
        this.set = new Set();
    }
    connect(conn) {
        this.map.set(this.token, conn)
        this.set.add(conn)
        console.log(`Client connection added new user: ${this.token}`)
    }
    disconnect(conn) {
        this.map.delete(this.token);
        this.set.delete(conn)
        return `Peer disconnect in room, ${this.token}`
    }
}

class User {
    constructor(userName, video) {
        this.userName = userName;
        this.video = video;
    }
}

class Server {
    constructor(conn) {
        this.conn = conn;
    }
    receive(msg) {
        console.log(JSON.stringify(JSON.parse(msg)));
        if (typeof msg !== "object") return;
        const desterialized = JSON.parse(msg)
        return desterialized;
    }
    sendToEveryone(msg, client) {
        for (connection in client.set) {
            connection.send(JSON.stringify(msg))
        }
    }
    send(msg) {
        if (typeof msg !== "object") return;
        const sterialized = JSON.stringify(msg);
        this.conn.send(sterialized);
        return sterialized;
    }
}
let client = new Client();

function join(room, conn, server) {
    room.add({
        id: generateId,
        conn: conn,
        peers_size: room.size,
        peers: Array.from(room)
    })
    for (connections in room) {
        server.send(connections)
    }
}

let connections = new Set();
wss.on('connection', (conn) => {
    this.server = new Server(conn);
    client.connect(conn)
    connections.add(conn)
    join(room, conn, this.server)
    conn.on("message", (msg) => {
        /*for (conns of connections) {
            conns.send(JSON.stringify(JSON.parse(msg)))
        }*/
       let data = this.server.receive(msg);
        if (data.type == "videoJoin") {
            for (conns of connections) {
                conns.send(JSON.stringify({
                    type: "join-user",
                    user: new User(data.userName, data.fragment),
                }))    
            }
        }
    })
    conn.on("close", () => {
        this.disconnect = client.disconnect(conn);
        connections.delete(conn)
        for (conns of connections) {
            conns.send(JSON.stringify({
                type: "disconnect-user"
            }))    
        }
        console.log(this.disconnect)
    })
})