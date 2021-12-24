declare let iro: any;

const canvas = document.getElementsByTagName('canvas')[0],
context = canvas.getContext("2d");

interface Entity {
    map: Map<any, any>;
}  

class Vec3 {
    public x: number;
    public y: number;
    public z: number;
    constructor(x?: number, y?: number, z?: number) {
        for (let i = 0; i < arguments.length; ++i) {
            if (arguments[i] === void 0) arguments[i] = 0;
        }
        this.set(x, y, z);
    }
    public set(x?: number, y?: number, z?: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Vec2 {
    public x?: number;
    public y?: number;

    constructor(x?: number, y?: number) {
        for (let i = 0; i < arguments.length; ++i) {
            if (arguments[i] === void 0) arguments[i] = 0;
        }
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

    public getFixedPosition(scale : number): object {
        return {x: Math.floor(this.x / scale), y: Math.floor(this.y / scale)};
    }
}

function isDesktop(): boolean {
    const mobile : RegExp[] = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return !mobile.some(element => navigator.userAgent.match(element));
};

let psize : number = 16;

class EntityManager implements Entity {
    public map: Map<any, any>;
    constructor() {
        this.map = new Map();
    }
    *[Symbol.iterator] () {
        yield isDesktop();
        yield this;
    }
    addEntity(isDebug?: boolean, name?: string, canvas?: any, size?: Vec2): void {
        if (size === void 0) size = new Vec2(0, 0);

        const entityData : object = {};
        const scale = new Vec2(size.x, size.y);

        this.map.set(name, {
            context: canvas.getContext("2d"), 
            pos: new Vec2(0, 0),
            isDebug: isDebug
        });
    }
    addEvent(e : string, name : string) {
        let context_buffer = this.map.get(name)["context"];
        context_buffer.canvas.addEventListener(e, (ev) => {
            this.map.get(name)["pos"].set(ev.x, ev.y)
            if (this.map.get(name).isDebug === true) {
                const {x, y} = this.map.get(name)["pos"].getFixedPosition(psize);
                context_buffer.strokeStyle = "#ff0000";
                context_buffer.lineWidth = "8px"
                context_buffer.strokeRect(x * psize, y * psize, psize, psize);
            }
        });
    }
}

let entityManager = new EntityManager()
if ([...new EntityManager][0]) {
    entityManager.addEntity(false, "cursor", canvas, new Vec2(psize, psize));
};

interface pixel {
    pos: object;
    scale: object;
}

let CURRENT_COLOR : string = "red", 
    pixels : Array<any> = [],
    colors : string[] = ["red", "blue", "yellow", "green", "orange", "purple", "pink", "magenta", "cyan",
                         "brown", "chartreuse", "lime", "violet", "magenta", "lavender"] as string[];

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
        if (selected_sprite_frame_index - 1 >= 0) {
            document.getElementById(id).removeChild(document.getElementsByClassName("spriteBoxContainer")[ind])
            if (selected_sprite_frame_index !== 0) selected_sprite_frame_index -= 1;
            onSpriteSwitch();
        } else if (document.getElementsByClassName("spriteBoxContainer")[selected_sprite_frame_index + 1]) {
            document.getElementById(id).removeChild(document.getElementsByClassName("spriteBoxContainer")[ind])
            selected_sprite_frame_index += 1;
            onSpriteSwitch();
        } else if (document.getElementsByClassName("spriteBoxContainer").length == 1) {
            context.clearRect(0, 0, canvas.height, canvas.width);
        }
    }
} 

document.getElementById("scaleSliderRange").addEventListener("input", () => {
    psize = 16 * Number(document.getElementById("scaleSliderRange")["value"]);
})

interface Layer {
    readonly id: string;
    readonly pid: string;
}

function im(u?: string, b?: any, s?: number): Promise<any> {
    if ("setAttribute" in Element.prototype) {
        b.setAttribute("src", u);
    } else {
        b.src = u;
    }

    return new Promise(r => b.addEventListener("load", () => setTimeout(r, s * 1000, b)));
}

let currentLayerSelected = -1,
    intervals : any = [];

class LayerManager implements Layer {
    public readonly id: string;
    public readonly pid: string;
    public template: Element | HTMLTemplateElement;
    public parent: Element;
    public options?: object;
    constructor({ tid, pid, options }: { tid: string; pid: string; options?: object; }) { 
        this.id = tid;
        this.pid = pid;
        this.template = document.getElementById(this.id) as HTMLTemplateElement;
        this.parent = document.getElementById(this.pid) as any;
        this.options = options;
    } 

    public updateLayer(canvas): void {
        const layer_buffer_canvas : any = document.getElementsByClassName("LayerBoxCanvasPreview")[currentLayerSelected];
        const layer_buffer : CanvasRenderingContext2D = layer_buffer_canvas.getContext("2d");
        layer_buffer.drawImage(canvas, 0, 0, layer_buffer_canvas.width, layer_buffer_canvas.height)
    }
    
    public clone(canvas?: HTMLElement | any): void { 
        const cloned_layer_box = document.importNode(this.template["content"], true).children[0];
        const events : string[] = ["click", "contextmenu"];

        for (let i = 0; i < events.length; ++i) {
            cloned_layer_box.addEventListener(events[i % events.length + 2], (e: { preventDefault: () => any; }) => e.preventDefault());
            if (events[i] === "contextmenu") cloned_layer_box.onclick = (e: any) => {return false};
        }

        const elements_for_layer : HTMLCollectionOf<Element> = 
              document.getElementsByClassName("LayerBoxContainer") as HTMLCollectionOf<any>;
        currentLayerSelected += 1;
        if (canvas !== void 0) {
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            intervals.push(setInterval(this.updateLayer, 10, canvas));            
        }

        for (let i = 0; i < elements_for_layer.length; ++i) {
            elements_for_layer[i]["onclick"] = () => {
               currentLayerSelected = i;
            }
        }

        this.parent.appendChild(cloned_layer_box);
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
function initLayers(): void {
  //Initialize first layer of the selected sprite frame.
    layer.clone(canvas)
}
initLayers();

document.getElementById("addLayer").addEventListener("click", () => {
    layer.clone(canvas);
    document.getElementById("layerMainContainer").scroll(0, 99999)
})
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
var colorPicker_ = new iro.ColorPicker(".colorPicker", {
    width: 280,
    color: "rgb(255, 0, 0)",
    borderWidth: 1,
    borderColor: "#fff",
});

let co_sc : string;
const s_prop = "style"

let exitDialogColorPicker : Element | any = document.getElementById("exitColorPickerDialog");

document.getElementsByClassName("add")[0].addEventListener("click", () => {
    document.getElementsByClassName("colorDialog_bg")[0].className = "colorDialog_bg" 
})

exitDialogColorPicker.addEventListener("click", () => {
    document.getElementsByClassName("colorDialog_bg")[0].className += " invisible" 
})

const events : string[] = ["color:init", "color:change"];

colorPicker_.on(events, function(color){   
    co_sc = color.hexString;
    document.getElementsByClassName("colorHex")[0][s_prop].backgroundColor = co_sc;
});

document.getElementsByClassName("addButton")[0].addEventListener("click", () => {
    document.getElementsByClassName("colorDialog_bg")[0].className += " invisible"
    colorPicker.clone(document.getElementById("bg-color-pallete"), co_sc);
})

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

let undoPixel : object[] = [];

function drawPixel(context: CanvasRenderingContext2D, x : number, y : number, pixel_size = 16): void {
    context.fillStyle = CURRENT_COLOR;
    let mouseVector = getMousePos(canvas, x, y)
    let deltaX : number = Math.floor(mouseVector.x / (pixel_size * scalar));
    let deltaY : number = Math.floor(mouseVector.y / (pixel_size * scalar));
    context.fillRect(deltaX * pixel_size, deltaY * pixel_size, pixel_size, pixel_size)
    let data : object = {x: deltaX * pixel_size, y: deltaY * pixel_size, scale: pixel_size, color: CURRENT_COLOR};
    if (!undoPixel.some(a => a === data)) undoPixel = [...undoPixel, data];
}

interface PixelInterface {
     x: number,
     y: number,
     scale: number,
     color: string;
}

function redraw_canvas() {
    for (let j = 0; j < pixels.length; ++j) {
        for (let k = 0; k < pixels[j].length; ++k) {
            let {x, y, scale, color} = pixels[j][k] as PixelInterface;
            context.fillStyle = color;
            context.fillRect(x, y, scale, scale); 
        }
    }
}

function clearPixel(context: CanvasRenderingContext2D, x : number, y : number, pixel_size = 16): void {
    let mouseVector = getMousePos(canvas, x, y)
    let deltaX : number = Math.floor(mouseVector.x / (pixel_size * scalar));
    let deltaY : number = Math.floor(mouseVector.y / (pixel_size * scalar));
    context.clearRect(deltaX * pixel_size, deltaY * pixel_size, pixel_size, pixel_size); 
    let data : object = {x: deltaX * pixel_size, y: deltaY * pixel_size, scale: pixel_size, color: "rgba(0, 0, 0, 0)"};
    if (!undoPixel.some(a => a === data)) undoPixel = [...undoPixel, data];
}

const ToolName : string[] = ["Pencil", "Eraser", "Rectangle", "EyeDropper", "Bucket", "Ruler", "Select", "Move", "Symmetry"];
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

interface Adjacent {
    x: number,
    y: number
}

const adjacent : Adjacent[] = [//
    {x: -1, y: 0}, //A1
    {x: 1, y: 0}, //A2
    {x: 0, y: -1}, //A3
    {x: 0, y: 1}, //A4
] as Adjacent[];

interface CanvasInterface {
    canvas: HTMLCanvasElement | any;
}

if (window.location.hash == "#comments") {
    window.location.href = "https://www.pixcel.ml/home/comments"
}   

window.addEventListener("hashchange", () => {
    if (window.location.hash == "#comments") {
        window.location.href = "https://www.pixcel.ml/home/comments"
    }
})

class CanvasManager implements CanvasInterface {

    canvas: HTMLCanvasElement | any;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    *[Symbol.iterator] () {
        let cwidth : number = canvas.width + canvas.getBoundingClientRect().width,
            cheight : number = canvas.height + canvas.getBoundingClientRect().height,
            cctx : CanvasRenderingContext2D = canvas.getContext("2d");
        yield ["aspectRatio", 0, 0, cwidth, cheight, cctx];
    }

    public static fill({ dx, dy }: { dx: number; dy: number; }): void {
        let pstack = [];
        for (let mx = 0; mx < 5; ++mx) {
            for (let my = 0; my < 5; ++my) {
                pstack.push({x: mx, y: my})
            }
        }

    }
    
}

let canvasManager = new CanvasManager(canvas);
let selected_layer_frame_indx : number  = 0; 
const layer_limited : number = 40;

function updateFrame<Type>(): void {
    if (CanvasRenderingContext2D.prototype.hasOwnProperty("drawImage")) {
        let sprite_canvas = document.getElementsByClassName("spriteBoxContainer")[selected_sprite_frame_index].children[1];
        sprite_canvas["getContext"]("2d").imageSmoothingEnabled = false;
        sprite_canvas["getContext"]("2d").clearRect(0, 0, sprite_canvas["width"], sprite_canvas["height"]) 
        sprite_canvas["getContext"]("2d").drawImage(document.getElementById("main_canvas"),
        0, 0, sprite_canvas["width"], sprite_canvas["height"]) 
    }
}

function onSpriteSwitch() {
    selected_layer_frame_indx = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas_overlay_context.clearRect(0, 0, canvas_overlay_context.canvas.width, canvas_overlay_context.canvas["height"]);
    let old_frame = [...document.getElementsByClassName("spriteBoxContainer")]
    .filter(a => { return a.className.includes("selected")});
    old_frame.forEach(elem => elem.className = "spriteBoxContainer");
    document.getElementsByClassName("spriteBoxContainer")[selected_sprite_frame_index].className += " selected";
    let sprite_canvas : any = document.getElementsByClassName("spriteBoxContainer")[selected_sprite_frame_index].children[1];
    context.imageSmoothingEnabled = false;
    context.drawImage(sprite_canvas, 0, 0, canvas.width, canvas.height);
}

console.log("[System] Enabled pixel selection canvas overlay.");

function onSwitchTool(tool : string): void {
    document.getElementById(`${tool}Tool`).className="toolslot selected";
    canvas_overlay_context.clearRect(0, 0, canvas_overlay_context.canvas.width, canvas_overlay_context.canvas["height"]);
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
    FLAG_EVENT_STARTED_RIGHT_BUTTON_MOUSE : boolean = false,
    FLAG_IS_COLOR_PALLETE_OPEN : boolean = false;

document.addEventListener("keydown", (e): void => {
    if (e.key == "e" && e.ctrlKey) {
        e.preventDefault();
        onSwitchTool("EyeDropper");
    } else if (e.key == "e") {
        e.preventDefault();
        onSwitchTool("Eraser");
    }

    if (e.key == "Delete" && currentTool == "Select") {
        let av = getMousePos(canvas, stVector.x, stVector.y),
            ev = getMousePos(canvas, endVector.x, endVector.y);
        canvas_overlay_context.clearRect(0, 0, canvas_overlay_context.canvas.width, canvas_overlay_context.canvas.height);
        if (ev.x >= av.x && ev.y >= av.y) {
            context.clearRect(av.x, av.y, ev.x, ev.y);
        }
        if (ev.x < av.x && ev.y < av.y) {
            context.clearRect(ev.x, ev.y, av.x, av.y);
        }
        updateFrame<void>();
    }

    if (e.ctrlKey && e.key == "r") {
        e.preventDefault(); 
        if (selected_sprite_frame_index !== 0) {
            sprite.remove("sprite_frame_fragment_container", selected_sprite_frame_index)
        }
    }

    if (e.ctrlKey && e.key == "c") {
        document.getElementsByClassName("colorDialog_bg")[0].className = "colorDialog_bg" 
        if (FLAG_IS_COLOR_PALLETE_OPEN) {
            document.getElementsByClassName("colorDialog_bg")[0].className += " invisible";
            FLAG_IS_COLOR_PALLETE_OPEN = false;
        } else {
            FLAG_IS_COLOR_PALLETE_OPEN = true;
        }
    }

    if (((e.ctrlKey && e.key == "z") || e.key == "Backspace") && pixels.length > 0) {
        pixels.pop();
        context.clearRect(0, 0, canvas.width, canvas.height)
        redraw_canvas();
        updateFrame();
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
    pixels = [];
    undoPixel = [];
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
let p_r : object[] = [];

function restPixelArrayDispatch(c : CanvasRenderingContext2D, a: object[], p?: number): void {
    for (let i = 0; i < a.length; ++i) { 
        let {x, y} = a[i] as any;
        drawPixel(c, x, y, p); //Dispatch pixels
    }
}

let endVector = new Vec2(0, 0);
let lastMovementVector = new Vec2(0, 0);
let swipeVector = new Vec2(0, 0);
document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);
function getTouches(evt) {
  return evt.touches || evt.originalEvent.touches; 
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    swipeVector.set(firstTouch.x, firstTouch.y)
};                                     
let side_r : any = document.getElementsByClassName("sidebar")[0]; 

function handleTouchMove(evt) {
    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;
    var dx = swipeVector.x - xUp;
    var dy = swipeVector.y - yUp;
    if ( Math.abs(dx) > Math.abs(dy)) {
        if ( dx < 0 && evt.target !== canvas && evt.target !== canvas_overlay_context.canvas) {
            side_r.style.transform = (side_r.style.transform===
            "translateX(-500px)" ? "translateX(0px)" : "translateX(-500px)")
            side_r.style.opacity = (side_r.style.opacity==0 ? 1 : 0) 
        }
    }
    swipeVector.set(0, 0)
};

const canvas_overlay_context : CanvasRenderingContext2D = (document.getElementById("selected-canvas") as any).getContext("2d");
function onmousemoveHandler(e: MouseEvent): void {
    if (isDragging && currentTool == "Select") {
        canvas_overlay_context.fillStyle = "rgba(135,206,235,0.6)";
        let minVector = new Vec2(Math.min(stVector.x, e.clientX), Math.min(stVector.y, e.clientY));
        let maxVector = new Vec2(Math.max(stVector.x, e.clientX), Math.max(stVector.y, e.clientY));
        canvas_overlay_context.clearRect(0, 0, canvas_overlay_context.canvas.width, canvas_overlay_context.canvas.height) 
        for (let xS = minVector.x; xS < maxVector.x; xS += 16) {
            for (let yS = minVector.y; yS < maxVector.y; yS += 16) {
                let mv = getMousePos(canvas, xS, yS)
                let dx : number = Math.floor(mv.x / (16));
                let dy : number = Math.floor(mv.y / (16));
                canvas_overlay_context.fillRect(dx * 16, dy * 16, 16, 16)
            }
        }
    }
    if (isDragging && currentTool == "Move") {
        let mv_m = getMousePos(canvas, e.x, e.y);
        let deltaX : number = Math.floor(mv_m.x / 16);
        let deltaY : number = Math.floor(mv_m.y / 16);
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.translate(deltaX * 16, deltaY * 16); 
        redraw_canvas();
        context.restore();
        updateFrame<void>();
    }
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
        canvas_overlay_context.clearRect(0, 0, canvas_overlay_context.canvas.width, canvas_overlay_context.canvas.height) 
        p_r = [];
        for (let xS = minVector.x; xS < maxVector.x; xS += 16) {
            for (let yS = minVector.y; yS < maxVector.y; yS += 16) {
                let mouseV = getMousePos(canvas, xS, yS);
                let dx_r : number = Math.floor(mouseV.x / (16));
                let dy_r : number = Math.floor(mouseV.y / (16));
                canvas_overlay_context.fillStyle = CURRENT_COLOR;
                canvas_overlay_context.fillRect(dx_r * 16, dy_r * 16, 16, 16)
                p_r.push({x: xS, y: yS})
            }
        }
    }
}

canvas_overlay_context.canvas.addEventListener("mousewheel", (event : any) => {}, false)

let cf : number = 0;

let exit_button_layer_dialog = document.getElementById("exitImg") as HTMLButtonElement;

exit_button_layer_dialog.addEventListener("click", e => {
    document.getElementById("dialog_window_parent").className = "invisible"
})

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

function intToBool(n : number) {
    return n != 0;
} 

canvas_overlay_context.canvas.addEventListener("mousedown", (e) => {
    lastVector.set(e.x, e.y);
    isDragging = true;
    if (e.button == 0) {
        if (currentTool == "Rectangle" || currentTool == "Select") stVector.set(e.x, e.y);
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
            CanvasManager.fill({ dx: e.x, dy: e.y });
            updateFrame()
        }
    } else if (e.button == 2) {
        onSwitchTool("Eraser")
    }
    e.preventDefault();
    onmousemoveHandler(e)
})

canvas_overlay_context.canvas.addEventListener("touchmove", ontouchmoveHandler);
canvas_overlay_context.canvas.addEventListener("touchstart", (e) => {
    for (let i = 0; i < e.changedTouches.length; ++i) {
        touch_pos.set(e.changedTouches[i].pageX, e.changedTouches[i].pageY);
    }
    let {x, y} = touch_pos;
    lastVector.set(x, y);
    if (currentTool == "Rectangle" || currentTool == "Select") stVector.set(x, y);
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
        CanvasManager.fill({ dx: modifiedVector.x, dy: modifiedVector.y });
        updateFrame()
    }
    isDragging = true;
    ontouchmoveHandler(e);
    if (e.cancelable) e.preventDefault();
})

canvas_overlay_context.canvas.addEventListener("pointerout", (e) => {
    e.preventDefault();
    if (currentTool == "Rectangle") {
        restPixelArrayDispatch(context, p_r, 16);
        updateFrame<void>()
    }
    if (!pixels.some(a => a == undoPixel)) pixels = [...pixels, undoPixel]
    undoPixel = [];
    isDragging = false;
})

canvas_overlay_context.canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    //Make undoPixel, a subset of pixels.
    if (!pixels.some(a => a == undoPixel)) pixels = [...pixels, undoPixel];
    undoPixel = [];
    isDragging = false;
})

function updateCursorEntity(e : MouseEvent): void {
    if (currentTool !== "Select") {
        canvas_overlay_context.clearRect(0, 0, canvas.width, canvas.height); 
        canvas_overlay_context.fillStyle = 'rgba(255, 255, 255, 0.6)';
        let mouseVector = getMousePos(canvas, e.clientX, e.clientY)
        let deltaX : number = Math.floor(mouseVector.x / (psize * scalar));
        let deltaY : number = Math.floor(mouseVector.y / (psize * scalar));
        canvas_overlay_context.fillRect(deltaX * psize, deltaY * psize, psize, psize)
    }
}

canvas_overlay_context.canvas.oncontextmenu = function() {return false;}

canvas_overlay_context.canvas.addEventListener("mousemove", updateCursorEntity)

canvas_overlay_context.canvas.addEventListener("mouseup", (e) => {
    e.preventDefault();
    if (currentTool == "Rectangle") {
        restPixelArrayDispatch(context, p_r, 16);
        updateFrame<void>()
    }
    if (currentTool == "Select") {
        endVector.set(e.x, e.y)
    }
    if (!pixels.some(a => a == undoPixel)) pixels = [...pixels, undoPixel]
    undoPixel = [];
    isDragging = false;
    if  (e.button == 2) onSwitchTool("Pencil")
})

canvas_overlay_context.canvas.addEventListener("mousemove", onmousemoveHandler)