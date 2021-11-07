import { Vector2 } from "./js/Vector2.js";

if (window.location.host !== "blueprogrammer212.github.io") {
    window.location.href = "https://blueprogrammer212.github.io/home"
}

for (let i = 0; i < document.images.length; ++i) {
    document.images[i].oncontextmenu = function() {
        return false;
    }
}
let color_set = "black";
document.getElementById("exitColorPickerDialog").addEventListener("click", () => {
  document.getElementById("exitColorPickerDialog")
  .parentElement["parentElement"].className += "invisible"
});

let is_eraser_selected = false;

class FragmentManager {
  constructor(template) {
      this.template = template;
  }
  appendTo(element, colors) {
      is_eraser_selected = true;
      this.emoji = document.importNode(this.template.content, true).children[0];
      this.emoji.setAttribute("style", `background-color: ${colors}`)
      this.emoji.addEventListener("click", () => {
        color_set = colors;
      })
      element.insertBefore(this.emoji, document.getElementsByClassName("add")[0])
  }
}
if (iro === void 0) window.location.reload();
var colorPicker = new iro.ColorPicker(".colorPicker", {
  width: 280,
  color: "rgb(255, 0, 0)",
  borderWidth: 1,
  borderColor: "#fff",
});

var values = document.getElementsByClassName("values"),
    colorBox = document.getElementsByClassName("colorHex"),
    addColor = document.getElementsByClassName("addButton")[0];
  
let hex = "#000"

colorPicker.on(["color:init", "color:change"], function(color) {
  values.innerHTML = [
    "hex: " + color.hexString,
    "rgb: " + color.rgbString,
    "hsl: " + color.hslString,
  ].join("<br>");
  hex = color.hexString;
  colorBox[0].style.backgroundColor = color.hexString;
});

let fragment = new FragmentManager(document.getElementById("colorBox_temp"));
window.fragment = fragment
let colors = ["red", "blue", "yellow", "orange", "violet", "magenta", "pink", "green", "lime", "white", "black", "lightblue"]

colors.forEach((color) => {
  fragment.appendTo(document.getElementById("bg-color-pallete"), color)
})

let div_dialog = document.getElementsByClassName("colorDialog_bg");
addColor.addEventListener("click", () => {
  div_dialog[0].className += " invisible"
  fragment.appendTo(document.getElementById("bg-color-pallete"), hex)
})

String.prototype.removeClass = function(className) {
    return this.replace(className, '');
}

document.getElementById("addButton").addEventListener("click", () => {
    div_dialog[0].className = div_dialog[0].className.removeClass("invisible")
});

let scale = new Vector2(20, 20);
let canvas_scale = new Vector2(0.5, 0.5);

let enableGrid = true;

const canvas = document.getElementById("main_canvas");
canvas.offScreenCanvas = document.createElement('canvas');
canvas.offScreenCanvas.width = canvas.width;
canvas.offScreenCanvas.height = canvas.height;
canvas.getContext("2d").scale(canvas_scale.x, canvas_scale.y)

canvas.getContext('2d').drawImage(canvas.offScreenCanvas, 0, 0);

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
   canvas.getContext("2d").lineWidth = 0.1
   canvas.getContext("2d").moveTo(0, row * scale.y)
   canvas.getContext("2d").lineTo(canvas.width, row * scale.y)
   canvas.getContext("2d").stroke();
 }
}

function drawPixel(cx, x, y) {
   cx.fillStyle = color_set;
   cx.fillRect(x * scale.x, y * scale.y, scale.x, scale.y);
}

function pointerPosition(pos, domNode) {
  let rect = domNode.getBoundingClientRect();
  return {x: Math.floor((pos.clientX - rect.left) / scale.x / canvas_scale.x),
          y: Math.floor((pos.clientY - rect.top) / scale.y / canvas_scale.x)};
}

function eventHandler(e) {
    let d = pointerPosition(e, canvas);
    drawPixel(canvas.getContext("2d"), d.x, d.y)
}

canvas.addEventListener("mousedown", (e) => {
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

canvas.addEventListener("touchmove", (e) => {
  if (e.cancelable) e.preventDefault()
  e.stopPropagation();
  let d = pointerPosition(e.changedTouches[0], canvas);
  drawPixel(canvas.getContext("2d"), d.x, d.y)
})