const regExpression = /|([^|]*)|/g
/*
if (window.location.host !== "blueprogrammer212.github.io") {
    window.location.href = "https://blueprogrammer212.github.io/home"
}
*/

if ("getElementsByTagName" in document) {
    let images = document.getElementsByTagName("img");
    for (let i = 0; i < images.length; ++i) {
        images[i].addEventListener("contextmenu", () => {
            return false;
        });
        images[i].setAttribute("draggable", "false");
        //Emoji size
        if (images[i].classList.contains("emoji")) {
            images[i].width = "20"
            images[i].height = "20"
        }
    }
}

for (let i = 0; i < document.images.length; ++i) {
    document.images[i].oncontextmenu = function() {
        return false;
    }
}

document.body.oncontextmenu = function() {
    return false;
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

let template = document.getElementById("emoji_heart");
let fragment = new FragmentManager(template);
/*
for (let i = 0; i < 3; ++i) {
    fragment.appendTo(document.getElementById("p-id-1"))
}
*/

console.log("Wanna be a developer?")
function elt(type, props, ...children) {
    let dom = document.createElement(type);
    if (type == "canvas") dom.id = "main_canvas"
    if (props) Object.assign(dom, props);
    for (let child of children) {
        if (typeof child != "string") dom.appendChild(child);
        else dom.appendChild(document.createTextNode(child));
    }
    return dom;
}
class Picture {
constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
}
static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
}
pixel(x, y) {
    return this.pixels[x + y * this.width];
}
draw(pixels) {
    let copy = this.pixels.slice();
    for (let {x, y, color} of pixels) {
    copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
}
}
function updateState(state, action) {
    return Object.assign({}, state, action);
}
const scale = 10;
function drawPicture(picture, canvas, scale) {
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;
    let cx = canvas.getContext("2d");
  
    for (let y = 0; y < picture.height; y++) {
      for (let x = 0; x < picture.width; x++) {
        cx.fillStyle = picture.pixel(x, y);
        cx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
}
class PictureCanvas {
  constructor(picture, pointerDown) {
    this.dom = elt("canvas", {
      onmousedown: event => this.mouse(event, pointerDown),
      ontouchstart: event => this.touch(event, pointerDown)
    });
    this.syncState(picture);
  }
  syncState(picture) {
    if (this.picture == picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  }
}
PictureCanvas.prototype.mouse = function(downEvent, onDown) {
    if (downEvent.button != 0) return;
    let pos = pointerPosition(downEvent, this.dom);
    let onMove = onDown(pos);
    if (!onMove) return;
    let move = moveEvent => {
      if (moveEvent.buttons == 0) {
        this.dom.removeEventListener("mousemove", move);
      } else {
        let newPos = pointerPosition(moveEvent, this.dom);
        if (newPos.x == pos.x && newPos.y == pos.y) return;
        pos = newPos;
        onMove(newPos);
      }
    };
    this.dom.addEventListener("mousemove", move);
  };
  
  function pointerPosition(pos, domNode) {
    let rect = domNode.getBoundingClientRect();
    return {x: Math.floor((pos.clientX - rect.left) / scale),
            y: Math.floor((pos.clientY - rect.top) / scale)};
  }
  PictureCanvas.prototype.touch = function(startEvent,
    onDown) {
let pos = pointerPosition(startEvent.touches[0], this.dom);
let onMove = onDown(pos);
startEvent.preventDefault();
if (!onMove) return;
let move = moveEvent => {
let newPos = pointerPosition(moveEvent.touches[0],
this.dom);
if (newPos.x == pos.x && newPos.y == pos.y) return;
pos = newPos;
onMove(newPos);
};
let end = () => {
this.dom.removeEventListener("touchmove", move);
this.dom.removeEventListener("touchend", end);
};
this.dom.addEventListener("touchmove", move);
this.dom.addEventListener("touchend", end);
};
class PixelEditor {
    constructor(state, config) {
      let {tools, controls, dispatch} = config;
      this.state = state;
  
      this.canvas = new PictureCanvas(state.picture, pos => {
        let tool = tools[this.state.tool];
        let onMove = tool(pos, this.state, dispatch);
        if (onMove) return pos => onMove(pos, this.state);
      });
      this.controls = controls.map(
        Control => new Control(state, config));
      this.dom = elt("div", {}, this.canvas.dom, elt("br"),
                     ...this.controls.reduce(
                       (a, c) => a.concat(" ", c.dom), []));
    }
    syncState(state) {
      this.state = state;
      this.canvas.syncState(state.picture);
      for (let ctrl of this.controls) ctrl.syncState(state);
    }
  }
  class ToolSelect {
    constructor(state, {tools, dispatch}) {
      this.select = elt("select", {
        onchange: () => dispatch({tool: this.select.value})
      }, ...Object.keys(tools).map(name => elt("option", {
        selected: name == state.tool
      }, name)));
      this.dom = elt("label", null, "🖌 Tool: ", this.select);
    }
    syncState(state) { this.select.value = state.tool; }
  }
  class ColorSelect {
    constructor(state, {dispatch}) {
      this.input = elt("input", {
        type: "color",
        value: state.color,
        onchange: () => dispatch({color: this.input.value})
      });
      this.dom = elt("label", null, "🎨 Color: ", this.input);
    }
    syncState(state) { this.input.value = state.color; }
  }
  function draw(pos, state, dispatch) {
    function drawPixel({x, y}, state) {
      let drawn = {x, y, color: state.color};
      dispatch({picture: state.picture.draw([drawn])});
    }
    drawPixel(pos, state);
    return drawPixel;
  }
  function rectangle(start, state, dispatch) {
    function drawRectangle(pos) {
      let xStart = Math.min(start.x, pos.x);
      let yStart = Math.min(start.y, pos.y);
      let xEnd = Math.max(start.x, pos.x);
      let yEnd = Math.max(start.y, pos.y);
      let drawn = [];
      for (let y = yStart; y <= yEnd; y++) {
        for (let x = xStart; x <= xEnd; x++) {
          drawn.push({x, y, color: state.color});
        }
      }
      dispatch({picture: state.picture.draw(drawn)});
    }
    drawRectangle(start);
    return drawRectangle;
  }

  const around = [{dx: -1, dy: 0}, {dx: 1, dy: 0},
    {dx: 0, dy: -1}, {dx: 0, dy: 1}];

function fill({x, y}, state, dispatch) {
    let targetColor = state.picture.pixel(x, y);
    let drawn = [{x, y, color: state.color}];
    for (let done = 0; done < drawn.length; done++) {
        for (let {dx, dy} of around) {
            let x = drawn[done].x + dx, y = drawn[done].y + dy;
            if (x >= 0 && x < state.picture.width && y >= 0 && y < state.picture.height && state.picture.pixel(x, y) == targetColor &&
            !drawn.some(p => p.x == x && p.y == y)) {
                drawn.push({x, y, color: state.color});
            }
      }
}
dispatch({picture: state.picture.draw(drawn)});
}
function pick(pos, state, dispatch) {
    dispatch({color: state.picture.pixel(pos.x, pos.y)});
  }
  let state = {
    tool: "draw",
    color: "#000000",
    picture: Picture.empty(80, 60, "#f0f0f0")
  };
  let app = new PixelEditor(state, {
    tools: {draw, fill, rectangle, pick},
    controls: [ToolSelect, ColorSelect],
    dispatch(action) {
      state = updateState(state, action);
      app.syncState(state);
    }
  });

  var link = document.createElement("a");
  link.download = "image.png";
  document.body.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (e.ctrlKey && e.code == "KeyS") {
        app.canvas.dom.toBlob(function(blob){
            link.href = URL.createObjectURL(blob);
            console.log(blob);
            console.log(link.href);
            link.click();
          },'image/png');
    }
  })

  document.getElementById("main_content").appendChild(app.dom);