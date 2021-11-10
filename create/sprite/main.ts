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

let PIXEL_SIZE : number = 32;
 
function drawGrid(context) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#333333"
    for (let i = 0; i < context.canvas.width; i += PIXEL_SIZE) {
        context.moveTo(i, 0);
        context.lineTo(i, context.canvas.height);
        context.stroke();

        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
    }
}

drawGrid(context);

function drawPixel() {
    
}