const canvas : HTMLCanvasElement = document.getElementById("main_canvas") as HTMLCanvasElement,
      context = canvas.getContext("2d");

const urlSearchParams : URLSearchParams = new URLSearchParams(window.location.search),
      params = Object.fromEntries(urlSearchParams.entries());

if ("uuid" in params) {
    console.log(`[System] Loading the project... <${params.uuid}>`)
} else {
    console.log(`[System] Creating new project... <>`)
}

let PIXEL_SIZE : number = 32;

namespace Position {
    export interface Render2D {
         x: number;
         y: number;
    }
}

namespace Pixcel { 
    export interface MouseState {
        down: boolean;
    }
    export class Vector2i implements Position.Render2D {
        public x: number;
        public y: number;
        
        public constructor(x : number, y : number) {
            this.set(x, y);
        }

        public set(x, y): void {
            this.x = x;
            this.y = y;
        }

    }
    export class Main {
        public context : CanvasRenderingContext2D;
        public state: Pixcel.MouseState;
        static readonly canvas = context.canvas;
        static readonly DEFAULT_COLOR = "#ff0000";
        
        public constructor() {
            this.context = null;
            this.state = {down: false};
        }
        public static clear(context): void {
            let origin : Position.Render2D = new Pixcel.Vector2i(0, 0);
            context.clearRect(origin.x, origin.y, context.canvas.width, context.canvas.height);
        }
        public init(context : CanvasRenderingContext2D): void {
            this.context = context;

            this.context.canvas.addEventListener("mousedown", (e) => {
                this.state.down = true;
            });

            this.context.canvas.addEventListener("mosueup", (e) => {
                this.state.down = false;
            })
            
            this.context.canvas.addEventListener("pointerout", (e) => {
                this.state.down = false;
            })

            this.context.canvas.addEventListener("mousemove", (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (this.state.down) {
                    let {x, y} = e;
                    let dx = x - this.context.canvas.getBoundingClientRect().x,
                        dy = y - this.context.canvas.getBoundingClientRect().y;
                    let px = Math.floor(dx / PIXEL_SIZE),
                        py = Math.floor(dy / PIXEL_SIZE);
                    this.drawPixel(new Vector2i(px, py), PIXEL_SIZE, Pixcel.Main.DEFAULT_COLOR)
                }
            })
            
        }
        public drawPixel(pos : Position.Render2D, scale, color : string): void {
            this.context.fillStyle = color;
            this.context.fillRect(pos.x * scale, pos.y * scale, scale, scale);
        }
    }
}

let canvas_size : Position.Render2D = new Pixcel.Vector2i(
    context.canvas.width,
    context.canvas.height
);

 
function drawGrid(context) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#333333"
    context.lineWidth = 0.5;
    for (let i = 0; i < context.canvas.width; i += PIXEL_SIZE) {
        context.moveTo(i, 0);
        context.lineTo(i, context.canvas.height);
        context.stroke();

        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
    }
}

window.addEventListener("resize", () => {
    drawGrid(context);
})

let drawingProgram = new Pixcel.Main();
drawingProgram.init(context);

drawGrid(context);

function drawPixel() {
    
}