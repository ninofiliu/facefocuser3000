import fragmentShaderSource from "./fragment.glsl?raw";
import { x } from "./shorts";
import vertexShaderSource from "./vertex.glsl?raw";

const createShader = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) => {
  const shader = x(gl.createShader(type));
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw new Error(`${gl.getShaderInfoLog(shader)}`);
  return shader;
};

const createProgram = (
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => {
  const program = x(gl.createProgram());
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error(`${gl.getProgramInfoLog(program)}`);
  return program;
};

export const canvas = document.createElement("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
const gl = x(canvas.getContext("webgl2"));

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
);
const program = createProgram(gl, vertexShader, fragmentShader);
const locations = {
  a_position: gl.getAttribLocation(program, "a_position"),
  a_texcoord: gl.getAttribLocation(program, "a_texcoord"),
};
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([-1, 1, -1, -1, 1, 1, -1, -1, 1, -1, 1, 1]),
  gl.STATIC_DRAW
);
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
gl.enableVertexAttribArray(locations.a_position);
gl.vertexAttribPointer(locations.a_position, 2, gl.FLOAT, false, 0, 0);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
gl.bindVertexArray(vao);

gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0]),
  gl.STATIC_DRAW
);
gl.enableVertexAttribArray(locations.a_texcoord);
gl.vertexAttribPointer(locations.a_texcoord, 2, gl.FLOAT, true, 0, 0);

const texture = gl.createTexture();

export const setTexture = (source: TexImageSource) => {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  gl.generateMipmap(gl.TEXTURE_2D);
};

export const draw = () => {
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};
