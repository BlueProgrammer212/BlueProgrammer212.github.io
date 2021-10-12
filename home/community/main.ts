declare let firebase : any;
import PostsManager from "./ts/PostsManager";
import Timer from "./ts/Timer";

let firestore;
let load = new Timer(1000);

window.addEventListener("load", () => {
    load.start().then((a) => {
        firestore = firebase.firestore();
        let INITIALIZE_POSTS_MANAGER : PostsManager 
            = new PostsManager("353463462233", "posts", firestore);
    });
});