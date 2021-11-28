var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = 800;
canvas.height = 600;

let factor : number = 1, pt;

interface CanvasRenderingContext2D {
    transformedPoint: Function;
    translate: Function;
}

var gkhead = new Image;

window.onload = function(){		

var ctx : CanvasRenderingContext2D = canvas.getContext('2d');

let pixels = [];
        
function redraw(){
    for (let i = 0; i < pixels.length; ++i) {
        ctx.fillStyle = pixels[i].color;
        if (pixels[i] === void 0) break;
        ctx.fillRect(pixels[i].pos.x, pixels[i].pos.y, pixels[i].scale.x, pixels[i].scale.y);
    }
}
    redraw();

    var lastX=canvas.width/2, lastY=canvas.height/2;

    var dragStart,dragged;

    class Tools {
      item: any;
      constructor(name) {
          this.item = {};
          this.item.selected = name;
      }
      public setTool(name : string): string {
         this.item.selected = name;
         return this.item.selected;
      }
    }

    let Tool = new Tools("pencil");
    let onMouseDownPencilMode : boolean = false;
    let DEFAULT_COLOR = "#ff0000"

    function drawPixel(context, x : number, y : number, pixel_size = 16): void {
        //Default color: Red
        context.fillStyle = DEFAULT_COLOR;
        let offsetX : number = x - context.canvas.getBoundingClientRect().left;
        let offsetY : number = y - context.canvas.getBoundingClientRect().top;
        let deltaX : number = Math.floor(offsetX / pixel_size);
        let deltaY : number = Math.floor(offsetY / pixel_size);
        context.fillRect(deltaX * pixel_size, deltaY * pixel_size, pixel_size, pixel_size)
        pixels = [...pixels, {pos: {x: deltaX * pixel_size, y: deltaY * pixel_size}, scale: {x: pixel_size, y: pixel_size}}]
    }

    canvas.addEventListener('mousedown',function(evt){
          if (Tool.item.selected == "move") {
                dragged = false;
          } else if (Tool.item.selected === "pencil") {
                onMouseDownPencilMode = true;
          } 
    },false);
   
    document.addEventListener("keydown", (e) => {
        this.e = e;
        this.e.preventDefault();
        this.e.stopPropagation();
        if (this.e.key == "Control") {
            Tool.setTool("move");
        }
    })

    document.addEventListener("keyup", (e) => { 
        this.e = e;
        this.e.preventDefault();
        this.e.stopPropagation();
        if (this.e.key == "Control") {
            Tool.setTool("pencil");
        }
    })

    canvas.addEventListener('mousemove',function(evt){
       if (Tool.item.selected === "pencil" && onMouseDownPencilMode) {
            drawPixel(ctx, evt.clientX, evt.clientY, 16 * factor);
        }
    },false);

    canvas.addEventListener('mouseup',function(evt){
        onMouseDownPencilMode = false;
    },false);

};

