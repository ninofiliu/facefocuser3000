#version 300 es
precision highp float;
uniform sampler2D u_texture;
in vec2 v_texcoord;
out vec4 outColor;

void main() { outColor = texture(u_texture, v_texcoord); }
