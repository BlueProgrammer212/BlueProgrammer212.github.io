declare let firebase : any;

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

class PostsManager extends Posts {
    id : string;
    public firestore : any;
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
    constructor(id : string, btn_id : string) {
        super(id);
        this.init(btn_id);
        this.firestore = firebase.firestore();
    }
}