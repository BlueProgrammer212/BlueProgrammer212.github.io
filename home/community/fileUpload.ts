const slug : string = "post_pixcel_as";

interface PostsInterface {
    msg(message : string): void;
}

class Posts implements PostsInterface {
    constructor(msg : string) {
        console.log("Typescript initialized.")
    }
    msg(message : string) {
        return "lol";
    }
}

let posts : PostsInterface = new Posts("lol");
alert(posts.msg("lol"));