export default class Posts {
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