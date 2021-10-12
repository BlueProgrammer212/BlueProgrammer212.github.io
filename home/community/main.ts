declare let firebase : any;

class Cookie {
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
    constructor() {
        
    }
}

class Posts {
    id: string;
    public generateKey(len : number, chars : String | Number): String {
        let string : String;
        for (let i : number = 0; i < len; ++i)
            string += chars[Math.round(Math.random() * len)];
        if (string.startsWith("undefined")) {
            for (let k : number = 0; k < "undefined".length; ++k) { 
                string = chars[Math.round(Math.random() * len)]; 
            }   
        }
        return string;
    }
    constructor(id: string) {
        this.id = id;
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
class PostsManager extends Posts {
    id : string;
    protected firestore : any;
    public readonly btn_id : String;
    public readonly template : any;
    public readonly message : String;
    protected add(data : Object): any {
        return new Promise((res, rej) => {
            setTimeout(res, 2000, data);
        })
    }
    protected async init(btn_id : string): Promise<void> {
        document.getElementById(btn_id).addEventListener("click", async () => {
            await this.add({message: "Test message"}).then((info) => {
                console.log(`Processed raw data to ${info} in 2s`);
            });
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