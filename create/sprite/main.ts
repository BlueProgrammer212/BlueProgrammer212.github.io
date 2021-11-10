const canvas : HTMLCanvasElement = document.getElementById("main_canvas") as HTMLCanvasElement,
      context = canvas.getContext("2d");

namespace Position {
    export interface Render2D {
         x: number;
         y: number;
    }
}

namespace Pixcel { 
    export class Vector2 implements Position.Render2D {
        public x: number;
        public y: number;
        constructor(x : number, y : number) {
            this.set(x, y);
        }        
        public set(x, y): void {
            this.x = x;
            this.y = y;
        }
    } 
}

const PIXEL_SIZE : number = 16;
 
function drawGrid(context) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#333333"
    for (let x = 0; x < context.canvas.width / PIXEL_SIZE; x += PIXEL_SIZE) {
        context.moveTo(x, 0);
        context.lineTo(x, context.canvas.height);
        context.stroke();
    }
}

drawGrid(context);

function drawPixel() {
    
}