export interface Pos2 {
    x : number, 
    y : number;
}

export class Vector2 implements Pos2 {
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