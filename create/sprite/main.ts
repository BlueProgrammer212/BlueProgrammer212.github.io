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

let psize = 16;

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

document.getElementById("scaleSliderRange").addEventListener("input", () => {
    psize = psize * (document.getElementById("scaleSliderRange")["value"] * 0.1);
})
let sprite = new SpriteManager("sprite_box");
sprite.add("sprite_frame_fragment_container").then(c => {
    c.children[1].getContext("2d").drawImage(document.getElementById("main_canvas"), 
    0, 0, c.children[1].width, c.children[1].height)
    document.getElementsByClassName("spriteBoxContainer")[0].className += " selected"
})
let selected_sprite_frame_index : number = 0;
document.getElementById("addFrameButton").addEventListener("click", e => {

    sprite.add("sprite_frame_fragment_container").then((c) => {selected_sprite_frame_index += 1;});
    context.clearRect(0, 0, canvas.width, canvas.height)

    for (let k = 0; k < document.getElementsByClassName("spriteBoxContainer").length; ++k) {

        document.getElementsByClassName("spriteBoxContainer")[k]["onclick"] = () => {
            selected_sprite_frame_index = k;
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            let old_frame = [...document.getElementsByClassName("spriteBoxContainer")]
            .filter(a => { return a.className.includes("selected")});
            
            old_frame.forEach(elem => elem.className = "spriteBoxContainer");
            document.getElementsByClassName("spriteBoxContainer")[k].className += " selected";
            
            let sprite_canvas : any = document.getElementsByClassName("spriteBoxContainer")[selected_sprite_frame_index].children[1];
            context.imageSmoothingEnabled = false;
            context.drawImage(sprite_canvas, 0, 0, canvas.width, canvas.height);
        };

    }
})

if (document.getElementById("LayerTitle").getAttribute("data-diatype")!=='category') 
    document.getElementById("LayerTitle").remove();

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
    
    let canvas_download = document.createElement("canvas"),
        context_canvas_download = canvas_download.getContext("2d"),
        spriteCollection : HTMLCollection = document.getElementsByClassName("spriteBoxContainer");

    canvas_download.width = canvas.width * spriteCollection.length;
    canvas_download.height = canvas.height * spriteCollection.length;

    for (let i = 0; i < spriteCollection.length; ++i) {
        const bitmap : HTMLCanvasElement = spriteCollection[i].children[1] as HTMLCanvasElement;
        context_canvas_download.imageSmoothingEnabled = false;
        context_canvas_download.drawImage(bitmap, canvas.width * (i % 4), canvas.height * Math.round(i / 3), canvas.width, canvas.height);
    }
  
    canvas_download.toBlob(function(blob){
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

function clearPixel(context, x : number, y : number, pixel_size = 16): void {
    let mouseVector = getMousePos(canvas, x, y)
    let deltaX : number = Math.floor(mouseVector.x / (pixel_size * scalar));
    let deltaY : number = Math.floor(mouseVector.y / (pixel_size * scalar));
    context.clearRect(deltaX * pixel_size, deltaY * pixel_size, pixel_size, pixel_size)
}

const ToolName : string[] = ["Pencil", "Eraser", "Rectangle", "EyeDropper", "Bucket", "Ruler"];
if (typeof localStorage.getItem("toolSelected") !== "string") {
    localStorage.setItem("toolSelected", ToolName[0]);
}
document.getElementById(`${localStorage.getItem("toolSelected")}Tool`).className="toolslot selected";
let currentTool = localStorage.getItem("toolSelected");

for (let k = 0; k < ToolName.length; ++k) {
    document.getElementById(`${ToolName[k]}Tool`).addEventListener("click", (e) => {
        document.getElementById(`${ToolName[k]}Tool`).className="toolslot selected";
        if ("localStorage" in window) localStorage.setItem("toolSelected", ToolName[k])
        currentTool = ToolName[k];
        let ax = ToolName.filter(b => {return b !== ToolName[k]});
        ax.forEach(e => document.getElementById(`${e}Tool`).className = "toolslot")
    })
}

function updateFrame() {
    let sprite_canvas = document.getElementsByClassName("spriteBoxContainer")[selected_sprite_frame_index].children[1];
    sprite_canvas["getContext"]("2d").imageSmoothingEnabled = false;
    sprite_canvas["getContext"]("2d").clearRect(0, 0, sprite_canvas["width"], sprite_canvas["height"]) 
    sprite_canvas["getContext"]("2d").drawImage(document.getElementById("main_canvas"),
     0, 0, sprite_canvas["width"], sprite_canvas["height"]) 
}

function onSpriteSwitch() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    let old_frame = [...document.getElementsByClassName("spriteBoxContainer")]
    .filter(a => { return a.className.includes("selected")});
    old_frame.forEach(elem => elem.className = "spriteBoxContainer");
    document.getElementsByClassName("spriteBoxContainer")[selected_sprite_frame_index].className += " selected";
    let sprite_canvas : any = document.getElementsByClassName("spriteBoxContainer")[selected_sprite_frame_index].children[1];
    context.imageSmoothingEnabled = false;
    context.drawImage(sprite_canvas, 0, 0, canvas.width, canvas.height);
}

document.addEventListener("keydown", (e) => {
    if (e.key == "ArrowUp") {
        selected_sprite_frame_index = --selected_sprite_frame_index % -1;
        onSpriteSwitch();
    } else if (e.key == "ArrowDown") {
        selected_sprite_frame_index = ++selected_sprite_frame_index % document.getElementsByClassName("spriteBoxContainer").length;
        onSpriteSwitch();
    }
})

let stVector = new Vec2(0, 0)

document.getElementById("clearCanvasButton").addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    updateFrame();
})

document.getElementById("editLayers").addEventListener("click", (e) => {
    document.getElementsByClassName("manage_layer_ui")[0].className = "manage_layer_ui";
    document.getElementById("dialog_window_parent").className = "";
})
document.getElementsByClassName("manage_layer_ui")[0].addEventListener("click", e => e["stopPropagation"]())
document.getElementById("dialog_window_parent").addEventListener("click", () => {
    document.getElementById("dialog_window_parent").className = "invisible"
})

let touch_pos = new Vec2(0, 0)
function ontouchmoveHandler(e) {
    for (let i = 0; i < e.changedTouches.length; ++i) {
        touch_pos.set(e.changedTouches[i].pageX, e.changedTouches[i].pageY);
    }
    let {x, y} = touch_pos;
    if (isDragging && currentTool == "Pencil") {
        drawPixel(context, x, y, psize)
        let dx = x - lastVector.x, dy = y - lastVector.y;
        let d = lastVector.dist(lastVector.x, lastVector.y, x, y);
        for (var i = 1; i < d; i += psize) {
            drawPixel(context, lastVector.x + dx / d * i, lastVector.y + dy / d * i, psize)
        }
        lastVector.set(x, y);
        updateFrame();
    } else if (isDragging && currentTool == "Eraser") {
        clearPixel(context, x, y, psize)
        let dx = x - lastVector.x, dy = y - lastVector.y;
        let d = lastVector.dist(lastVector.x, lastVector.y, x, y);
        for (var i = 1; i < d; i += psize) {
            clearPixel(context, lastVector.x + dx / d * i, lastVector.y + dy / d * i, psize)
        }
        lastVector.set(x, y);
        updateFrame()
    } else if (isDragging && currentTool == "Rectangle") {
        let minVector = new Vec2(Math.min(stVector.x, x), Math.min(stVector.y, y));
        let maxVector = new Vec2(Math.max(stVector.x, y), Math.max(stVector.y, y)); 
        for (let xS = minVector.x; xS < maxVector.x; xS += psize) {
            for (let yS = minVector.y; yS < maxVector.y; yS += psize) {
                drawPixel(context, xS, yS, psize);
            }
        }
    }
}

function onmousemoveHandler(e) {
    if (isDragging && currentTool == "Pencil") {
        drawPixel(context, e.clientX, e.clientY, psize)
        let dx = e.clientX - lastVector.x, dy = e.clientY - lastVector.y;
        let d = lastVector.dist(lastVector.x, lastVector.y, e.clientX, e.clientY);
        for (var i = 1; i < d; i += psize) {
            drawPixel(context, lastVector.x + dx / d * i, lastVector.y + dy / d * i, psize)
        }
        lastVector.set(e.clientX, e.clientY);
        updateFrame();
    } else if (isDragging && currentTool == "Eraser") {
        clearPixel(context, e.clientX, e.clientY, psize)
        let dx = e.clientX - lastVector.x, dy = e.clientY - lastVector.y;
        let d = lastVector.dist(lastVector.x, lastVector.y, e.clientX, e.clientY);
        for (var i = 1; i < d; i += psize) {
            clearPixel(context, lastVector.x + dx / d * i, lastVector.y + dy / d * i, psize)
        }
        lastVector.set(e.clientX, e.clientY);
        updateFrame()
    } else if (isDragging && currentTool == "Rectangle") {
        let minVector = new Vec2(Math.min(stVector.x, e.clientX), Math.min(stVector.y, e.clientY));
        let maxVector = new Vec2(Math.max(stVector.x, e.clientX), Math.max(stVector.y, e.clientY)); 
        for (let xS = minVector.x; xS < maxVector.x; xS += psize) {
            for (let yS = minVector.y; yS < maxVector.y; yS += psize) {
                drawPixel(context, xS, yS, psize);
            }
        }
    }
}

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
    canvas_preview.getContext("2d").clearRect(0, 0, canvas_preview.width, canvas_preview.height)
    canvas_preview.getContext("2d").drawImage(buffer, 0, 0, canvas_preview.width, canvas_preview.height);
}

setInterval(animate, 200)

let scale = 1;

//canvas.onwheel = zoom;

canvas.addEventListener("mousedown", (e) => {
    lastVector.set(e.x, e.y);
    if (currentTool == "Rectangle") stVector.set(e.x, e.y);
    if (currentTool == "EyeDropper") {
        let mouseVector = getMousePos(canvas, e.x, e.y)
        let deltaX : number = Math.floor(mouseVector.x / (psize * scalar));
        let deltaY : number = Math.floor(mouseVector.y / (psize * scalar));
        let pixel =  context.getImageData(deltaX * psize, deltaY * psize, psize, psize);
        let data = pixel.data;
        const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        colorPicker.clone(document.getElementById("bg-color-pallete"), rgba);
        CURRENT_COLOR = rgba;
    }
    isDragging = true;
    onmousemoveHandler(e)
    e.preventDefault();
})

canvas.addEventListener("touchmove", ontouchmoveHandler);
canvas.addEventListener("touchstart", (e) => {
    for (let i = 0; i < e.changedTouches.length; ++i) {
        touch_pos.set(e.changedTouches[i].pageX, e.changedTouches[i].pageY);
    }
    let {x, y} = touch_pos;
    lastVector.set(x, y);
    if (currentTool == "Rectangle") stVector.set(x, y);
    if (currentTool == "EyeDropper") {
        let mouseVector = getMousePos(canvas, x, y)
        let deltaX : number = Math.floor(mouseVector.x / (psize * scalar));
        let deltaY : number = Math.floor(mouseVector.y / (psize * scalar));
        let pixel =  context.getImageData(deltaX * psize, deltaY * psize, psize, psize);
        let data = pixel.data;
        const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        colorPicker.clone(document.getElementById("bg-color-pallete"), rgba);
        CURRENT_COLOR = rgba;
    }
    isDragging = true;
    ontouchmoveHandler(e);
    e.preventDefault();
})

canvas.addEventListener("pointerout", (e) => {
    e.preventDefault();
    isDragging = false;
})

canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    isDragging = false;
})

canvas.addEventListener("mouseup", (e) => {
    e.preventDefault();
    isDragging = false;
})

canvas.addEventListener("mousemove", onmousemoveHandler)