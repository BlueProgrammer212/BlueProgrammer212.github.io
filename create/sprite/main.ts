const canvas = document.getElementsByTagName('canvas')[0],
      context = canvas.getContext("2d");

interface pixel {
    pos: object;
    scale: object;
}

let CURRENT_COLOR : string = "red", 
    pixels : pixel[] = [],
    colors : string[] = ["red", "blue", "yellow", "green", "orange", "purple", "pink", "magenta", "cyan", "brown"];

class ColorManager {
    template: any;
    constructor(id : string) {
        this.template = document.getElementById(id);
    }
    clone(element, color): void {
        let clone = document.importNode(this.template.content, true).children[0];
        clone.id = color;
        clone.setAttribute("style", `background-color: ${color};`)
        clone.addEventListener("click", () => {
            CURRENT_COLOR = color;
        })
        element.appendChild(clone)
    }
}

let colorPicker = new ColorManager("colorBox_temp");
for (let i = 0; i < colors.length; ++i) {
    colorPicker.clone(document.getElementById("bg-color-pallete"), colors[i]);
}

class Vec2 {
    x: number;
    y: number;
    constructor(x = 0, y = 0) {
        this.set(x, y);
    } 
    set(x = 0, y = 0): void {
        this.x = x;
        this.y = y;
    }
    dist(lx, ly, cx, cy): number {
        let dx = lx - cx,
            dy = ly - cy;
       return Math.hypot(dx, dy);
    }
}



let lastVector = new Vec2(0, 0), 
    isDragging : boolean = false;

let scalar = 1;
function getMousePos(canvas, x, y) {
    var rect = canvas.getBoundingClientRect();
    return new Vec2((x - rect.left) / (rect.right - rect.left) * canvas.width, 
    (y - rect.top) / (rect.bottom - rect.top) * canvas.height);
}

function drawPixel(context, x : number, y : number, pixel_size = 16): void {
    context.fillStyle = CURRENT_COLOR;
    let mouseVector = getMousePos(canvas, x, y)
    let deltaX : number = Math.floor(mouseVector.x / (pixel_size * scalar));
    let deltaY : number = Math.floor(mouseVector.y / (pixel_size * scalar));
    context.fillRect(deltaX * pixel_size, deltaY * pixel_size, pixel_size, pixel_size)
}

function onmousemoveHandler(e) {
    if (isDragging) {
        drawPixel(context, e.clientX, e.clientY, 16)
        let dx = e.clientX - lastVector.x, dy = e.clientY - lastVector.y;
        let d = lastVector.dist(lastVector.x, lastVector.y, e.clientX, e.clientY);
        for (var i = 1; i < d; i += 16) {
            drawPixel(context, lastVector.x + dx / d * i, lastVector.y + dy / d * i, 16)
        }
        lastVector.set(e.clientX, e.clientY);
    }
}
let currentTool = "Pencil";
document.getElementById("EraserTool").addEventListener("click", (e) => {
    currentTool = "Eraser";
})

function zoom(event) {
    event.preventDefault();
    scale += event.deltaY * -0.001;
    scale = Math.min(Math.max(.125, scale), 4);
    canvas.style["zoom"] = scale.toString();
}

let scale = 1;
canvas.onwheel = zoom;

canvas.addEventListener("mousedown", (e) => {
    lastVector.set(e.x, e.y);
    isDragging = true;
    onmousemoveHandler(e)
    e.preventDefault();
})

canvas.addEventListener("pointerout", (e) => {
    e.preventDefault();
    isDragging = false;
})

canvas.addEventListener("mouseup", (e) => {
    e.preventDefault();
    isDragging = false;
})

canvas.addEventListener("mousemove", onmousemoveHandler)