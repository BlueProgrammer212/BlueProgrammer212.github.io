interface Position {
    x: number,
    y: number
}

interface Render {
    gl: WebGLRenderingContext,
    canvas: any
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
console.log("[System] Initializing WebGL... 100%")

class Renderer extends Body2d implements Render {
    public gl: WebGLRenderingContext;
    public canvas : any;
    constructor(canvas: any) {
        super();
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl");       
    }
    renderBackground(x = 0, y = 0, w = 100, h = 100): void {
        if (!this.gl) {
            console.log("Your browser does not support WebGL");
            return;
        }
        this.set(x, y);
        this.box(w, h, this.gl);
    }
}


function main() {
    const canvas : any = document.getElementById("main_canvas");
    let renderer = new Renderer(canvas);
    renderer.renderBackground(0, 0, 100, 100);
}

window.addEventListener("load", main);