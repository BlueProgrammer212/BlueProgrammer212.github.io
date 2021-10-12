export default class Timer {
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