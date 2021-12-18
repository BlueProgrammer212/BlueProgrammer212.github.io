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
    dist(lx: number, ly: number, cx: number, cy: number): number {
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
    clone(element: HTMLElement, color: string): void {
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
        let scrollByVector = new Vec2(0, 999999);
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

interface Layer {
    readonly id: string;
    readonly pid: string;
}

class LayerManager implements Layer {
    public readonly id: string;
    public currentLayer : number;
    public readonly pid: string;
    public template: Element | HTMLTemplateElement;
    public parent: Element;
    public options?: object;
    constructor({ tid, pid, options }: { tid: string; pid: string; options?: object; }) { 
        this.id = tid;
        this.pid = pid;
        this.currentLayer = -1;
        this.template = document.getElementById(this.id) as HTMLTemplateElement;
        this.parent = document.getElementById(this.pid) as any;
        this.options = options;
    } 
    
    public set setSelectedLayerByIndex(i : number) {
        this.currentLayer = i;
    }
    
    public clone(): void { 
        const cloned_layer_box = document.importNode(this.template["content"], true).children[0];
        const events : string[] = ["click", "contextmenu"];
        for (let i = 0; i < events.length; ++i) {
            cloned_layer_box.addEventListener(events[i % events.length + 2], (e: { preventDefault: () => any; }) => e.preventDefault());
            if (events[i] === "contextmenu") cloned_layer_box.onclick = (e: any) => {return false};
        }
        const elements_for_layer : HTMLCollectionOf<Element> = 
              document.getElementsByClassName("LayerBoxContainer") as HTMLCollectionOf<any>;
        let setCurrentLayer : any = this.setSelectedLayerByIndex;
        [...elements_for_layer].forEach(elem => elem.addEventListener("click", (e) => {
            setCurrentLayer([...elements_for_layer].indexOf(elem));
        }, {passive: true}))
    }

    public remove(index): void {
        const elements_for_layer : HTMLCollectionOf<Element> = 
              document.getElementsByClassName("LayerBoxContainer") as HTMLCollectionOf<any>;
        [...elements_for_layer].forEach(e => {
            if ([...elements_for_layer].indexOf(e) === index) {
                if ("remove" in e) {
                    e.remove();
                } else {
                    e.parentElement.removeChild(e);
                }
            }
        })
    }
}

let layer = new LayerManager({tid: "layer_box_template", pid: "layerMainContainer"}),
    sprite = new SpriteManager("sprite_box");
layer.clone();
sprite.add("sprite_frame_fragment_container").then(c => {
    c.children[1].getContext("2d").drawImage(document.getElementById("main_canvas"), 
    0, 0, c.children[1].width, c.children[1].height)
    document.getElementsByClassName("spriteBoxContainer")[0].className += " selected"
})
let selected_sprite_frame_index : number = 0;
document.getElementById("addFrameButton").addEventListener("click", async e => {

    await sprite.add("sprite_frame_fragment_container").then((c) => {
        selected_sprite_frame_index += 1;
        let sel_frames = [...document.getElementsByClassName("spriteBoxContainer")]
        .filter(a => { return a.className.includes("selected")});
        
        sel_frames.forEach(elem => elem.className = "spriteBoxContainer");
        document.getElementsByClassName("spriteBoxContainer")[selected_sprite_frame_index].className += " selected";
    });
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
    canvas_download.height = canvas.height;

    for (let i = 0; i < spriteCollection.length; ++i) {
        const bitmap : HTMLCanvasElement = spriteCollection[i].children[1] as HTMLCanvasElement;
        context_canvas_download.imageSmoothingEnabled = false;
        context_canvas_download.drawImage(bitmap, canvas.width * i, 0, canvas.width, canvas.height);
    }
  
    canvas_download.toBlob(function(blob){
      l.href = URL.createObjectURL(blob);
      console.log(blob);
      console.log(`Pending blob download request, ${l.href}`);
      l.click();
    },'image/png');

})

function printCanvas(url_blob: string)  
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

function getMousePos(canvas: HTMLCanvasElement, x: number, y: number) {
    var rect = canvas.getBoundingClientRect();
    return new Vec2((x - rect.left) / (rect.right - rect.left) * canvas.width, 
    (y - rect.top) / (rect.bottom - rect.top) * canvas.height);
}

function drawPixel(context: CanvasRenderingContext2D, x : number, y : number, pixel_size = 16): void {
    context.fillStyle = CURRENT_COLOR;
    let mouseVector = getMousePos(canvas, x, y)
    let deltaX : number = Math.floor(mouseVector.x / (pixel_size * scalar));
    let deltaY : number = Math.floor(mouseVector.y / (pixel_size * scalar));
    context.fillRect(deltaX * pixel_size, deltaY * pixel_size, pixel_size, pixel_size)
}

function clearPixel(context: CanvasRenderingContext2D, x : number, y : number, pixel_size = 16): void {
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

const adjacent : Vec2[] = [
    new Vec2(-16, 0), //A1
    new Vec2(16, 0), //A2
    new Vec2(0, -16), //A3
    new Vec2(0, 16), //A4
] as Vec2[];

class CanvasManager {
    protected canvas: HTMLCanvasElement | any;
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }
    public static fill({ x, y }: { x: number; y: number; }): void {/*
        let p : object[] | any = [{x, y}];
        if (x === void 0 || y === void 0) return;
        for (let i = 0; i < p.length; ++i) {
            for ({x, y} of adjacent) {
                let dx = p[i].x + (x * psize),
                    dy = p[i].y + (y * psize);
                if (dx >= 0 && dx <= canvas.width + canvas.getBoundingClientRect().width &&
                    dy >= 0 && dy <= canvas.height + canvas.getBoundingClientRect().height &&
                    !p.some((a: any) => p.x == dx && p.y == dy)) {
                    p = [...p, {x: dx, y: dy}];
                    drawPixel(context, p[i].x, p[i].y, psize);
                }
            }
        }
    */}
}

let canvasManager = new CanvasManager(canvas);

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

function onSwitchTool(tool : string): void {
    document.getElementById(`${tool}Tool`).className="toolslot selected";
    if ("localStorage" in window) localStorage.setItem("toolSelected", tool)
    currentTool = tool;
    let ax = ToolName.filter(b => {return b !== tool});
    ax.forEach(e => document.getElementById(`${e}Tool`).className = "toolslot")
}

const toolKeys : object[] = [
    {key: "p", tool: "Pencil"},
    {key: "b", tool: "Bucket"}
];

let FLAG_EVENT_FIRED : boolean = false,
    FLAG_EVENT_STARTED_RIGHT_BUTTON_MOUSE : boolean = false;

document.addEventListener("keydown", (e): void => {
    if (e.key == "e" && e.ctrlKey) {
        e.preventDefault();
        onSwitchTool("EyeDropper");
    } else if (e.key == "e") {
        e.preventDefault();
        onSwitchTool("Eraser");
    }

    if (e.key == "r" && !e.ctrlKey) onSwitchTool("Ruler")

    if (e.key == "ArrowUp") {
        if (--selected_sprite_frame_index < 0) {
            selected_sprite_frame_index = document.getElementsByClassName("spriteBoxContainer").length - 1;
        } else {
            selected_sprite_frame_index = --selected_sprite_frame_index % -1;
        }
        onSpriteSwitch();
    } else if (e.key == "ArrowDown") {
        selected_sprite_frame_index = ++selected_sprite_frame_index % document.getElementsByClassName("spriteBoxContainer").length;
        onSpriteSwitch();
    } else if (e.key == "n" && !FLAG_EVENT_FIRED) {
        FLAG_EVENT_FIRED = true;
        document.getElementById("addFrameButton").click();
    }
    for (let i = 0; i < toolKeys.length; ++i) {
        if (e.key === toolKeys[i]["key"]) {
            onSwitchTool(toolKeys[i]["tool"])
        }
    }
})

document.addEventListener("keyup", (e) => {
    FLAG_EVENT_FIRED = false;
});

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
function ontouchmoveHandler(e: TouchEvent) {
    if (e.cancelable) e.preventDefault();
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
        updateFrame()
    }
}

function onmousemoveHandler(e: MouseEvent) {
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
        updateFrame()
    }
}

function zoom(event: { preventDefault: () => void; deltaY: number; }) {
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

setInterval(animate, 100)

let scale = 1;

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
        onSwitchTool("Pencil")
    }
    if (currentTool == "Bucket") {
        let modifiedVector = getMousePos(canvas, e.x, e.y);
        CanvasManager.fill({ x: modifiedVector.x, y: modifiedVector.y });
        updateFrame()
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
        onSwitchTool("Pencil")
    } 
    if (currentTool == "Bucket") {
        let modifiedVector = getMousePos(canvas, x, y);
        CanvasManager.fill({ x: modifiedVector.x, y: modifiedVector.y });
        updateFrame()
    }
    isDragging = true;
    ontouchmoveHandler(e);
    if (e.cancelable) e.preventDefault();
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