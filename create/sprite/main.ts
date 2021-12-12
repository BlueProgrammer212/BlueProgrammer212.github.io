const canvas = document.getElementsByTagName('canvas')[0],
context = canvas.getContext("2d");

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

class SpriteManager {
    template: any;
    clone: any;
    constructor(id: string) {
        this.template = document.getElementById(id);
    }
    add(id : string): Promise<any> {
        this.clone = document.importNode(this.template.content, true).children[0];
        if (this.clone.children[0].className==="numTag") { 
             this.clone.children[0].innerHTML = document.getElementsByClassName("spriteBoxContainer").length + 1;
        }
        let scrollByVector = new Vec2(0, 9999999999999999);
        document.getElementById(id).appendChild(this.clone);
        document.getElementById(id).scrollBy(scrollByVector.x, scrollByVector.y);
        scrollByVector = null;
        return new Promise(res => setTimeout(res, 100, this.clone));
    } 
    remove(id : string, ind : number) { 
        context.clearRect(0, 0, canvas.height, canvas.width);
        if (selected_sprite_frame_index - 1 > 0) {
            document.getElementById(id).removeChild(document.getElementsByClassName("spriteBoxContainer")[ind])
            selected_sprite_frame_index -= 1;
        } else if (document.getElementsByClassName("spriteBoxContainer")[selected_sprite_frame_index + 1]) {
            document.getElementById(id).removeChild(document.getElementsByClassName("spriteBoxContainer")[ind])
            selected_sprite_frame_index += 1;
        } else if (document.getElementsByClassName("spriteBoxContainer").length == 1) {
            context.clearRect(0, 0, canvas.height, canvas.width);
        }
    }
} 

let sprite = new SpriteManager("sprite_box");
sprite.add("sprite_frame_fragment_container").then(c => c.children[1].getContext("2d")
.drawImage(document.getElementById("main_canvas"), 0, 0, c.children[1].width, c.children[1].height))
let selected_sprite_frame_index : number = 0;
document.getElementById("addFrameButton").addEventListener("click", e => {

    sprite.add("sprite_frame_fragment_container").then((c) => {selected_sprite_frame_index += 1;});
    context.clearRect(0, 0, canvas.width, canvas.height)

    for (let k = 0; k < document.getElementsByClassName("spriteBoxContainer").length; ++k) {

        document.getElementsByClassName("spriteBoxContainer")[k]["onclick"] = () => {
            selected_sprite_frame_index = k;
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            let sprite_canvas : any = document.getElementsByClassName("spriteBoxContainer")[selected_sprite_frame_index].children[1];
            context.imageSmoothingEnabled = false;
            context.drawImage(sprite_canvas, 0, 0, canvas.width, canvas.height);
        };

    }
})

let colorPicker = new ColorManager("colorBox_temp");
for (let i = 0; i < colors.length; ++i) {
    colorPicker.clone(document.getElementById("bg-color-pallete"), colors[i]);
}


let lastVector = new Vec2(0, 0), 
    isDragging : boolean = false;

let scalar = 1;
document.getElementById("SaveTool").addEventListener("click", () => {
    let l = document.createElement("a");
    l.download = "image.png";
  
    canvas.toBlob(function(blob){
      l.href = URL.createObjectURL(blob);
      console.log(blob);
      console.log(`Pending blob download request, ${l.href}`);
      l.click();
    },'image/png');
})

function printCanvas(url_blob)  
{  
    var windowContent : string = `<!DOCTYPE html><html><head><title>Pixcel: Print</title></head><body><img src="${url_blob}" width="800" height="800"></body></html>`
    var printWin = window.open('','','width=800,height=800');
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
}

document.getElementById("Print").addEventListener("click", () => {
    canvas.toBlob(function(blob){
      printCanvas(URL.createObjectURL(blob));
      console.log(blob);
      console.log(`Pending blob printing request, ${URL.createObjectURL(blob)}`);
    },'image/png');
});

canvas.oncontextmenu = function() {return false};

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
        let sprite_canvas = document.getElementsByClassName("spriteBoxContainer")[selected_sprite_frame_index].children[1];
        sprite_canvas["getContext"]("2d").imageSmoothingEnabled = false;
        sprite_canvas["getContext"]("2d").drawImage(document.getElementById("main_canvas"),
         0, 0, sprite_canvas["width"], sprite_canvas["height"]) 
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

let cf : number = 0;

function animate() {
    let canvas_preview : any = document.getElementById("preview_canvas_sprite_animation");
    if (document.getElementsByClassName("spriteBoxContainer")[cf + 1]) {cf += 1;} else {cf = 0;}
    const buffer = document.getElementsByClassName("spriteBoxContainer")[cf].children[1];
    if (document.getElementsByClassName("spriteBoxContainer").length !== 1) {
         canvas_preview.getContext("2d").clearRect(0, 0, canvas_preview.width, canvas_preview.height)}
    canvas_preview.getContext("2d").imageSmoothingEnabled = false;
    canvas_preview.getContext("2d").drawImage(buffer, 0, 0, canvas_preview.width, canvas_preview.height);
}

setInterval(animate, 500)

let scale = 1;

//canvas.onwheel = zoom;

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