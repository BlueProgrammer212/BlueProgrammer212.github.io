const canvas = document.getElementsByTagName('canvas')[0],
      context = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

interface pixel {
    pos: object;
    scale: object;
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


let CURRENT_COLOR : string = "red"; 
let pixels : pixel[] = [];

let lastVector = new Vec2(0, 0), 
    isDragging : boolean = false;

function drawPixel(context, x : number, y : number, pixel_size = 16): void {
    context.fillStyle = CURRENT_COLOR;
    let offsetX : number = x - context.canvas.getBoundingClientRect().left;
    let offsetY : number = y - context.canvas.getBoundingClientRect().top;
    let deltaX : number = Math.floor(offsetX / pixel_size);
    let deltaY : number = Math.floor(offsetY / pixel_size);
    context.fillRect(deltaX * pixel_size, deltaY * pixel_size, pixel_size, pixel_size)
    pixels = [...pixels, {pos: {x: deltaX * pixel_size, y: deltaY * pixel_size}, scale: {x: pixel_size, y: pixel_size}}]
}

canvas.addEventListener("mousedown", (e) => {
    lastVector.set(e.x, e.y);
    isDragging = true;
    e.preventDefault();
})

canvas.addEventListener("mouseup", (e) => {
    e.preventDefault();
    isDragging = false;
})

canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
        drawPixel(context, e.x, e.y, 16)
        let dx = e.x - lastVector.x, dy = e.y - lastVector.y;
        let d = lastVector.dist(lastVector.x, lastVector.y, e.x, e.y);
        for (var i = 1; i < d; i += 2) {
            drawPixel(context, lastVector.x + dx / d * i, lastVector.y + dy / d * i, 16)
        }
        lastVector.set(e.x, e.y);
    }
})