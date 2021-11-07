const token_id : string = '730868686856-lkanp3tois4cj938t2g794cebadtqkoo.apps.googleusercontent.com';

async function loadJSON(path : string): Promise<JSON> {
    return fetch(path).then(a => a.json());
}

interface Pos2 {
    x : number, 
    y : number;
}

class Vector2 implements Pos2 {
    x : number;
    y : number;
    constructor(x = 0, y = 0) {
        for (let i = 0; i < arguments.length; ++i) {
            if (arguments[i] === void 0) {
                this.setPosition();
                return;
            }
        }
        this.setPosition(x, y);
    }
    setPosition(x = 0, y = 0): Pos2 {
        this.x = x;
        this.y = y;
        return this;
    }
}


