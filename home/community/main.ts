declare let firebase : any;
declare let image_url_: any;

const customFileUploadBtn = document.getElementById("customUploadImage"),
      uploadImage = document.getElementById("uploadImage");

customFileUploadBtn.addEventListener("click", uploadImage.click)

class Cookie {
    getCookie(
        cname: String
    ): any {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }
    async setCookie(
        cname: String, 
        cvalue: any,
        exdays: number
    ): Promise<void> { 
        return new Promise(() => {
            const d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        });
    }
}

class Posts {
    id: string;
    profile_link: string;
    name: string;
    cookie: Cookie;
    constructor(id: string) {
        this.id = id;
        this.cookie = new Cookie();
        this.profile_link = this.cookie.getCookie("pfp_url");
        this.name = this.cookie.getCookie("pf_name");
    }
}

class Timer {
    public readonly timeout: number;
    constructor(timeout : number) {
        this.timeout = timeout;
    }   
    public async start(): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, this.timeout, undefined);
        })
    }
}

function loadJSON(filepath : string): any {
    return fetch(filepath)
           .then(data => data.json())
           .then(info => console.log(`[Loaded] ${filepath} is loaded under 5s, ${info}`));
}

class PostsManager extends Posts {
    id : string;
    protected firestore : any;
    public readonly btn_id : String;
    public readonly template : any;
    public readonly message : String;
    protected add(data : Object): any {
        return new Promise((resolve, reject) => {
            this.firestore.collection("posts").add(data).then(b => resolve(b)).catch(error => {
                reject(new Error(error));
            });
        })
    }
    protected remove(name : String, slug : String): any {
        return new Promise((res, rej) => {
            setTimeout(res, 2000, {res, rej});
        })
    }
    protected async init(btn_id : string): Promise<void> {
        document.getElementById(btn_id).addEventListener("click", async () => {
            await this.add({
                message: document.getElementById("post_content")["value"], region: "AS",
                pfp_link: image_url_
            }).then((info) => {
                window.location.href = ".";
            })
        });
    }
    constructor(id : string, btn_id : string, firestore : any) {
        super(id);
        this.init(btn_id);
        this.firestore = firestore;
    }
}

let firestore;
let load = new Timer(1000);

window.addEventListener("load", () => {
    load.start().then((a) => {
        firestore = firebase.firestore();
        let INITIALIZE_POSTS_MANAGER : PostsManager 
            = new PostsManager("353463462233", "posts", firestore);
    });
});