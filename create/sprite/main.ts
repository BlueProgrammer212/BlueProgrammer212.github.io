const token_id : string = '730868686856-lkanp3tois4cj938t2g794cebadtqkoo.apps.googleusercontent.com';

declare let mat4: any;

console.log("[System] Initializing shaders, buffers and running fragment and vertex shader programs.")

const vsSource : string = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
`;

const fsSource : string = `
    varying lowp vec4 vColor;

    void main(void) {
       gl_FragColor = vColor;
    }
`;

async function loadJSON(path : string): Promise<JSON> {
    return fetch(path).then(a => a.json());
}

async function loadImage(path : string): Promise<ImageBitmap> {
    const image = new Image();
    return new Promise((resolve) => {
        image.src = path;
        image.addEventListener("load", () => {
            setTimeout(resolve, 5000, image);
        })
    })
}

namespace WebGL {  

    export class Engine {
        
        canvas: any;
        gl: WebGL2RenderingContext;
        shaderProgram: any;
        programInfo: any;
        buffer: any;

        protected loadShader(type, source): any {
            const shader = this.gl.createShader(type);
          
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
          
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
              alert('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
              this.gl.deleteShader(shader);
              return null;
            }
          
            return shader;
          }

        protected initProgram(vsSource : string, fsSource : string): any {
            const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
            const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);
          
            const shaderProgram = this.gl.createProgram();
            this.gl.attachShader(shaderProgram, vertexShader);
            this.gl.attachShader(shaderProgram, fragmentShader);
            this.gl.linkProgram(shaderProgram);
          
            if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
              alert('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
              return null;
            }
          
            return shaderProgram;
        }

        protected initBuffer() {

            const positionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

            const positions : number[] = [ //Real number position matrix  
                -1.0,  1.0,
                1.0,  1.0,
                -1.0, -1.0,
                1.0, -1.0,
            ];

            /*[
                //Correct Format 
                r, g, b, a, 
                r2, g2, b2, a2,
                r3, g3, b3, a3,
                r4, g4, b4, a4
            ]*/

            const colors: number[] = [
                1.0,  0.0,  0.0,  1.0,
                1.0,  0.0,  0.0,  1.0,
                1.0,  0.0,  0.0,  1.0,
                1.0,  0.0,  0.0,  1.0  
            ]

            this.gl.bufferData(this.gl.ARRAY_BUFFER,
                            new Float32Array(positions),
                            this.gl.STATIC_DRAW);

            const colorBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
            
            return {
                position: positionBuffer,
                color: colorBuffer,
            };
        }

        public constructor(cid : string) {
            if (cid === void 0) return;

            this.canvas = document.getElementById(cid);
            this.gl = this.canvas.getContext("webgl");
            this.shaderProgram = this.initProgram(vsSource, fsSource);
            this.buffer = this.initBuffer();

            if (this.gl === null) {
                console.error(new Error("Unfortunately, your browser does not support WebGL. Please refresh the page if you think this is a glitch"));      
                return;
            }

            this.programInfo = {
                program: this.shaderProgram,
                attribLocations: {
                  vertexPosition: this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
                  vertexColor: this.gl.getAttribLocation(this.shaderProgram, 'aVertexColor'),
                },
                uniformLocations: {
                  projectionMatrix: this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
                  modelViewMatrix: this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
                },
            };
            
            this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        }

        public drawScene(programInfo, buffers) {
            this.gl.clearColor(1.0, 1.0, 1.0, 1.0);  
            this.gl.clearDepth(1.0);                 
            this.gl.enable(this.gl.DEPTH_TEST);           
            this.gl.depthFunc(this.gl.LEQUAL);            
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            
            const fieldOfView = 45 * Math.PI / 180; 
            const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
            const zNear = 0.1;
            const zFar = 100.0;
            const projectionMatrix = mat4.create();
            
            mat4.perspective(projectionMatrix,
                                fieldOfView,
                                aspect,
                                zNear,
                                zFar);
            
            const modelViewMatrix = mat4.create();
            
            mat4.translate(modelViewMatrix,     
                            modelViewMatrix,     
                            [-0.0, 0.0, -6.0]);  
            
            {
                const numComponents = 2; 
                const type = this.gl.FLOAT;    
                const normalize = false;  
                const stride = 0;      
                const offset = 0;    
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
                this.gl.vertexAttribPointer(
                    programInfo.attribLocations.vertexPosition,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
                this.gl.enableVertexAttribArray(
                    programInfo.attribLocations.vertexPosition);
            }

            {
                const numComponents = 4;
                const type = this.gl.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
                this.gl.vertexAttribPointer(
                    programInfo.attribLocations.vertexColor,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
                this.gl.enableVertexAttribArray(
                    programInfo.attribLocations.vertexColor);
            }
            
            
            this.gl.useProgram(programInfo.program);
            
            // Set the shader uniforms
            
            this.gl.uniformMatrix4fv(
                programInfo.uniformLocations.projectionMatrix,
                false,
                projectionMatrix);
            this.gl.uniformMatrix4fv(
                programInfo.uniformLocations.modelViewMatrix,
                false,
                modelViewMatrix);
            
            {
                const offset = 0;
                const vertexCount = 4;
                this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
            }
        }

        public init(): void {
            this.drawScene(this.programInfo, this.buffer)
        }
    }

}

namespace Coordinates {

    export interface Pos2 {
        x : number, 
        y : number;
    }

    export class Vector2 implements Pos2 {

        x : number;
        y : number;
        s: number;

        public constructor(x = 0, y = 0) {
            for (let i = 0; i < arguments.length; ++i) {
                if (arguments[i] === void 0) {
                    this.setPosition();
                    return;
                }
            }
            this.setPosition(x, y);
            this.setScalar(0)
        }

        setPosition(x = 0, y = 0): Pos2 {
            this.x = x;
            this.y = y;
            return this;
        }

        setScalar(a : number): Pos2 {
            this.x = this.x + a;
            this.y = this.y + a;
            this.s = a;
            return this;
        }

        multiplyByScalar(a : number): Pos2 {
            this.x = this.x * a;
            this.y = this.y * a;
            return this;
        }

        get euclideanNorm(): number {
            return this.mag;
        }

        zero(): Pos2 {
            this.x = 0;
            this.y = 0;
            this.s = 0;
            return this;
        }

        negate(): Pos2 {
        this.x = -Math.abs(this.x);
        this.y = -Math.abs(this.y);
        return this;
        }

        addVector(b : Pos2): Pos2 {
            this.x = this.x + b.x;
            this.y = this.y + b.y;
            return this;
        }

        subVector(b : Pos2): Pos2 {
            this.x = this.x - b.x;
            this.y = this.y - b.y;
            return this;
        }

        add(a : number, b : number): Pos2 {
            this.x = this.x + a;
            this.y = this.y + b;
            return this;
        }

        sub(a : number, b : number): Pos2 {
            this.x = this.x - a;
            this.y = this.y - b;
            return this;
        }

        clamp(b : number, c : number): Pos2 {
            this.x = Math.min(Math.max(this.x, b), c);
            this.y = Math.min(Math.max(this.y, b), c);
            return this; 
        }

        clampVector(b : Pos2, c : Pos2): Pos2 {
            this.x = Math.min(Math.max(this.x, b.x), b.y);
            this.y = Math.min(Math.max(this.y, c.x), c.y);
            return this;
        }
        
        get mag(): number {
            return Math.hypot(this.x, this.y);
        }

        get scalar(): number {
            return this.s;
        }

    }

}

window.onload = function() {
    let main = new WebGL.Engine("main_canvas");
    main.init(); 
}
