interface Position {
    x: number,
    y: number
}

interface Render {
    gl: WebGLRenderingContext,
    canvas: HTMLCanvasElement
}

class Vector2 implements Position {
    public x : number;
    public y : number;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    set(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class Box2 extends Vector2 {
    public w: number;
    public h: number;
    constructor(x = 0, y = 0, w = 100, h = 100) {
        super(x, y);
        this.h = h;
        this.w = w;
    }
    setPosition(x = 0, y = 0) {
        this.set(x, y);
    }
}

class Body2d extends Vector2 {
    constructor(x = 0, y = 0) {
        super(x, y);
    }
    box(w, h, gl: WebGLRenderingContext): void {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}

class Renderer extends Body2d implements Render {
    public gl: WebGLRenderingContext;
    public canvas: HTMLCanvasElement;
    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl");       
    }
    renderBox(x = 0, y = 0, w = 100, h = 100): void {
        this.set(x, y);
        this.box(w, h, this.gl);
    }
}


function main() {
    
}

window.addEventListener("load", main);