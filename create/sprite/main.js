import { Vector2 } from "./js/Vector2.js";
/*
if (window.location.host !== "blueprogrammer212.github.io") {
    window.location.href = "https://blueprogrammer212.github.io/home"
}
*/

for (let i = 0; i < document.images.length; ++i) {
    document.images[i].oncontextmenu = function() {
        return false;
    }
}

class FragmentManager {
    constructor(template) {
        this.template = template;
    }
    appendTo(element) {
        this.emoji = document.importNode(this.template.content, true).children[0];
        element.appendChild(this.emoji)
    }
}

let scale = new Vector2(20, 20);

let enableGrid = true;

const canvas = document.getElementById("main_canvas");

let rows = canvas.height / scale.y;
let columns = canvas.width / scale.x;

function makeGrid() {
  for (let cols = 0; cols < columns; ++cols) {
    canvas.getContext("2d").strokeStyle = "gray";
    canvas.getContext("2d").lineWidth = 1
    canvas.getContext("2d").moveTo(cols * scale.x, 0)
    canvas.getContext("2d").lineTo(cols * scale.x, canvas.height)
    canvas.getContext("2d").stroke();
 }
 
 for (let row = 0; row < rows; ++row) {
   canvas.getContext("2d").strokeStyle = "gray";
   canvas.getContext("2d").lineWidth = 1
   canvas.getContext("2d").moveTo(0, row * scale.y)
   canvas.getContext("2d").lineTo(canvas.width, row * scale.y)
   canvas.getContext("2d").stroke();
 }
}

makeGrid();

function drawPixel(cx, x, y) {
   cx.fillStyle = "black";
   cx.fillRect(x * scale.x, y * scale.y, scale.x, scale.y);
}

function pointerPosition(pos, domNode) {
  let rect = domNode.getBoundingClientRect();
  return {x: Math.floor((pos.clientX - rect.left) / scale.x),
          y: Math.floor((pos.clientY - rect.top) / scale.y)};
}

function eventHandler(e) {
    let d = pointerPosition(e, canvas);
    drawPixel(canvas.getContext("2d"), d.x, d.y);
    if (document.getElementById("coords").innerHTML !==`x: ${d.x}, y: ${d.y}`)
        document.getElementById("coords").innerHTML = `x: ${d.x}, y: ${d.y}`
}

document.body.addEventListener("mousedown", (e) => {
  eventHandler(e)
  canvas.addEventListener("mousemove", eventHandler)
  canvas.addEventListener("pointermove", eventHandler)
});
document.body.addEventListener("mouseup", () => {
  canvas.removeEventListener("mousemove", eventHandler)
  canvas.removeEventListener("pointermove", eventHandler)
})
canvas.addEventListener("pointerout", () => {
  canvas.removeEventListener("mousemove", eventHandler)
  canvas.removeEventListener("pointermove", eventHandler)
})