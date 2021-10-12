import Posts from "./Posts";

export default class PostsManager extends Posts {
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