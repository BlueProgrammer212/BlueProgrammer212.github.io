const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

const compileProgram = ({ vertexShader, fragmentShader }): any => {
  // Compile vertex shader
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vertexShader);
  gl.compileShader(vs);

  // Compile fragment shader
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fragmentShader);
  gl.compileShader(fs);

  // Create and launch the WebGL program
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
  return program;
};
const gridProgram = compileProgram({
  vertexShader: `
attribute vec4 position;
void main() {
  gl_Position = position;
}
`,

  fragmentShader: `
precision mediump float;
uniform float size;

void main() {
  if(
   mod(gl_FragCoord.x,size)<1.0 ||
   mod(gl_FragCoord.y,size)<1.0
  ){
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.8);
  }else {discard;}                      
}
`
});

const drawingProgram = compileProgram({
  vertexShader: `
                attribute vec4 position;
                attribute vec4 color;
                varying vec4 v_color;
                uniform float size;
                void main() {
                    gl_Position = position;
                    v_color = color;
                    gl_PointSize = size;
                }`,
  fragmentShader: `
                precision mediump float;
                varying vec4 v_color;
                void main() {
                    gl_FragColor = v_color;
                }`
});

const pixels = [
  [0, 0, "#ff0000"],
  [1, 1, "#ffaa00"],
  [2, 2, "#ffff00"],
  [3, 3, "#00ff00"],
  [4, 4, "#00ffaa"],
  [5, 5, "#00ffff"],
  [6, 6, "#0000ff"],
  [7, 7, "#ff00aa"],
  [8, 8, "#ff00ff"]
];

const hex2rgb = (hex) => {
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 8), 16) / 255
  ];
};

const normalize = (cx, cy) => {
  const mid = 8 / 2;
  const x = (cx - mid) / mid + 1 / 8;
  const y = (mid - cy) / mid - 1 / 8;
  return [x, y, 0];
};

const pointsColors = new Float32Array([
  ...pixels.map(([x, y, hex]) => [...normalize(x, y), ...hex2rgb(hex)]).flat()
]);

{
  gl.useProgram(drawingProgram);
  const FSIZE = pointsColors.BYTES_PER_ELEMENT;
  // Create a buffer object
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, pointsColors, gl.STATIC_DRAW);

  // Bind the attribute position to the 1st, 2nd and 3rd floats in every chunk of 6 floats in the buffer
  const position = gl.getAttribLocation(drawingProgram, "position");
  gl.vertexAttribPointer(
    position, // target
    3, // interleaved data size
    gl.FLOAT, // type
    false, // normalize
    FSIZE * 6, // stride (chunk size)
    0 // offset (position of interleaved data in chunk)
  );
  gl.enableVertexAttribArray(position);

  // Bind the attribute color to the 3rd, 4th and 5th float in every chunk
  const color = gl.getAttribLocation(drawingProgram, "color");
  gl.vertexAttribPointer(
    color, // target
    3, // interleaved chunk size
    gl.FLOAT, // type
    false, // normalize
    FSIZE * 6, // stride
    FSIZE * 3 // offset
  );
  gl.enableVertexAttribArray(color);
  const size = gl.getUniformLocation(drawingProgram, "size");
  gl.uniform1f(size, 32);

  gl.drawArrays(gl.POINTS, 0, pixels.length);
}
{
  // Activate grid shaders
  gl.useProgram(gridProgram);

  // Set size value
  const size = gl.getUniformLocation(gridProgram, "size");
  gl.uniform1f(size, 32); // Cell Size

  // Four vertices represent corners of the canvas
  // Each row is x,y,z coordinate
  // -1,-1 is left bottom, z is always zero, since we draw in 2d
  const vertices = new Float32Array([
    1.0, 1.0,
    0.0, -1.0,
    1.0, 0.0,
    1.0, -1.0,
    0.0, -1.0,
    -1.0, 0.0
  ]);

  // Attach vertices to a buffer
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Set position to point to buffer
  const position = gl.getAttribLocation(gridProgram, "position");

  gl.vertexAttribPointer(
    position, // target
    3, // x,y,z
    gl.FLOAT, // type
    false, // normalize
    0, // buffer offset
    0 // buffer offset
  );

  gl.enableVertexAttribArray(gridProgram);

  // Finally draw our 4 vertices
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}