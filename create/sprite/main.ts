
var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = 800;
canvas.height = 600;

var gkhead = new Image;

window.onload = function(){		

        var ctx = canvas.getContext('2d');
        trackTransforms(ctx);
        
function redraw(){

        // Clear the entire canvas
        var p1 = ctx.transformedPoint(0,0);
        var p2 = ctx.transformedPoint(canvas.width,canvas.height);
        ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.restore();

        ctx.drawImage(gkhead,0,0);

    }
    redraw();

    var lastX=canvas.width/2, lastY=canvas.height/2;

    var dragStart,dragged;

    canvas.addEventListener('mousedown',function(evt){
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = ctx.transformedPoint(lastX,lastY);
        dragged = false;
    },false);

    canvas.addEventListener('mousemove',function(evt){
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;
        if (dragStart){
        var pt = ctx.transformedPoint(lastX,lastY);
        ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
        redraw();
            }
    },false);

    canvas.addEventListener('mouseup',function(evt){
        dragStart = null;
        if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
    },false);

    var scaleFactor = 1.1;

    var zoom = function(clicks){
        var pt = ctx.transformedPoint(lastX,lastY);
        ctx.translate(pt.x,pt.y);
        var factor = Math.pow(scaleFactor,clicks);
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

gkhead.src = 'data:image/jpeg;base64,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';

// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
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