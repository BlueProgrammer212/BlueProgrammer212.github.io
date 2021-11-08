const token_id : string = '730868686856-lkanp3tois4cj938t2g794cebadtqkoo.apps.googleusercontent.com';

async function loadJSON(path : string): Promise<JSON> {
    return fetch(path).then(a => a.json());
}

async function loadImage(path : string): Promise<ImageBitmap> {
    const image = new Image();
    return new Promise((resolve) => {
        image.src = path;
        image.addEventListener("load", () => {
            setTimeout(resolve, 5000, image);
        })
    })
}

namespace WebGL {  

    export class Engine {
        
        canvas: any;
        gl: WebGL2RenderingContext;

        public constructor(cid : string) {
            if (cid === void 0) return;
            
            this.canvas = document.getElementById(cid);
            this.gl = this.canvas.getContext("webgl");

            if (this.gl === null) {
                console.error(new Error("Unfortunately your browser does not support WebGL"));      
                return;
            }
            
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        }

        public init(): void {

        }
    }

}

namespace Coordinates {

    export interface Pos2 {
        x : number, 
        y : number;
    }

    export class Vector2 implements Pos2 {

        x : number;
        y : number;
        s: number;

        public constructor(x = 0, y = 0) {
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

}

window.onload = function() {
    let main = new WebGL.Engine("main_canvas");
    main.init(); 
}
