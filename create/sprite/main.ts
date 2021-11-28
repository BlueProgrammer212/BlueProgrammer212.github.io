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
trackTransforms(ctx);

let pixels = [];
        
function redraw(){

    var p1 = ctx.transformedPoint(0,0);
    var p2 = ctx.transformedPoint(canvas.width,canvas.height);
    ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.restore();
    for (let i = 0; i < pixels.length; ++i) {
        ctx.fillStyle = pixels[i].color;
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
                lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                dragStart = ctx.transformedPoint(lastX,lastY);
                dragged = false;
          } else if (Tool.item.selected === "pencil") {
            lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
            lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
            dragStart = ctx.transformedPoint(lastX,lastY);
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
        if (Tool.item.selected == "move" && onMouseDownPencilMode) {
            lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
            lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
            dragged = true;
            if (dragStart){
                var pt = ctx.transformedPoint(lastX,lastY);
                ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
                redraw();
            }
        } else if (Tool.item.selected === "pencil" && onMouseDownPencilMode) {
            drawPixel(ctx, evt.clientX * factor, evt.clientY * factor, 16);
            lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
            lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
            dragStart = ctx.transformedPoint(lastX,lastY);
        }
    },false);

    canvas.addEventListener('mouseup',function(evt){
        onMouseDownPencilMode = false;
    },false);

    var scaleFactor = 1.1;

    var zoom = function(clicks){
        pt = ctx.transformedPoint(lastX,lastY);
        ctx.translate(pt.x,pt.y);
        factor = Math.pow(scaleFactor,clicks);
        ctx.scale(factor,factor);
        ctx.translate(-pt.x,-pt.y);
        redraw();
    }

    var handleScroll = function(evt){
        var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
        if (delta) zoom(delta);
        return evt.preventDefault() && false;
    };

    canvas.addEventListener('DOMMouseScroll',handleScroll,false);
    canvas.addEventListener('mousewheel',handleScroll,false);
};

function trackTransforms(ctx){
    var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function(){ return xform; };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function(){
        savedTransforms.push(xform.translate(0,0));
        return save.call(ctx);
    };

    var restore = ctx.restore;
    ctx.restore = function(){
    xform = savedTransforms.pop();
    return restore.call(ctx);
            };

    var scale = ctx.scale;
    ctx.scale = function(sx,sy){
    xform = xform.scaleNonUniform(sx,sy);
    return scale.call(ctx,sx,sy);
            };

    var rotate = ctx.rotate;
    ctx.rotate = function(radians){
        xform = xform.rotate(radians*180/Math.PI);
        return rotate.call(ctx,radians);
    };

    var translate = ctx.translate;
    ctx.translate = function(dx,dy){
        xform = xform.translate(dx,dy);
        return translate.call(ctx,dx,dy);
    };

    var transform = ctx.transform;
    ctx.transform = function(a,b,c,d,e,f){
        var m2 = svg.createSVGMatrix();
        m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
        xform = xform.multiply(m2);
        return transform.call(ctx,a,b,c,d,e,f);
    };

    var setTransform = ctx.setTransform;
    ctx.setTransform = function(a,b,c,d,e,f){
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx,a,b,c,d,e,f);
    };

    var pt  = svg.createSVGPoint();
    ctx.transformedPoint = function(x,y){
        pt.x=x; pt.y=y;
        return pt.matrixTransform(xform.inverse());
    }
}