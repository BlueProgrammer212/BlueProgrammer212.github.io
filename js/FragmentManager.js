export default class FragmentManager {
    constructor(template) {
        this.template = template;
        this.map = new Map;
        this.userName = null;
        this.array = [];
        this.started = false;
        this.peerConn = new RTCPeerConnection();
        this.users = [];
    }
    init(element) {
        this.peerConn.onaddstream = function (evt) {
            element.srcObject = evt.stream;
        };
    }
    add(userName) {
        this.element = document.importNode(this.template.content, true).children[0];
        this.start(this.element.children[0])
        this.userName = userName;
        document.getElementById("booth").appendChild(this.element);
        this.array.push(this)
        return this.element;
    }
    querySize() {
        return this.map.size;
    }
    remove(userName) {
        this.userName = userName;
        document.getElementById("booth").removeChild(this.element);
        this.map.delete(userName)
        return this.element;
    }
    captureStream(fps = 10) {
        return this.element.children[0].captureStream(fps)
    }
    start(element) {
        this.init(element);
        this.users.push(element)
        let peerConn = this.peerConn;
        if (navigator.mediaDevices) {
            navigator.getUserMedia({audio: (this.users.indexOf(element) == 0 ? false : true), video: true},
                function(stream) {
                    element.srcObject = stream
                    
                },
                function(err) {
                  console.log("The following error occurred: " + err.name);
                }
              );
        }
    }
}