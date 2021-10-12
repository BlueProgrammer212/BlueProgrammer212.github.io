export default class Cookie {
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