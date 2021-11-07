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
    s: number;

    constructor(x = 0, y = 0) {
        for (let i = 0; i < arguments.length; ++i) {
            if (arguments[i] === void 0) {
                this.setPosition();
                return;
            }
        }
        this.setPosition(x, y);
        this.setScalar(0)
    }

    setPosition(x = 0, y = 0): Pos2 {
        this.x = x;
        this.y = y;
        return this;
    }

    setScalar(a : number): Pos2 {
        this.x = this.x + a;
        this.y = this.y + a;
        this.s = a;
        return this;
    }

    multiplyByScalar(a : number): Pos2 {
        this.x = this.x * a;
        this.y = this.y * a;
        return this;
    }

    get euclideanNorm(): number {
        return this.mag;
    }

    zero(): Pos2 {
        this.x = 0;
        this.y = 0;
        this.s = 0;
        return this;
    }

    negate(): Pos2 {
       this.x = -Math.abs(this.x);
       this.y = -Math.abs(this.y);
       return this;
    }

    addVector(b : Pos2): Pos2 {
        this.x = this.x + b.x;
        this.y = this.y + b.y;
        return this;
    }

    subVector(b : Pos2): Pos2 {
        this.x = this.x - b.x;
        this.y = this.y - b.y;
        return this;
    }

    add(a : number, b : number): Pos2 {
        this.x = this.x + a;
        this.y = this.y + b;
        return this;
    }

    sub(a : number, b : number): Pos2 {
        this.x = this.x - a;
        this.y = this.y - b;
        return this;
    }

    clamp(b : number, c : number): Pos2 {
        this.x = Math.min(Math.max(this.x, b), c);
        this.y = Math.min(Math.max(this.y, b), c);
        return this; 
    }

    clampVector(b : Pos2, c : Pos2): Pos2 {
        this.x = Math.min(Math.max(this.x, b.x), b.y);
        this.y = Math.min(Math.max(this.y, c.x), c.y);
        return this;
    }
    
    get mag(): number {
        return Math.hypot(this.x, this.y);
    }

    get scalar(): number {
        return this.s;
    }

}

