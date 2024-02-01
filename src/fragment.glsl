#version 300 es
precision highp float;
uniform sampler2D u_texture;
in vec2 v_texcoord;
out vec4 outColor;

vec3 dark = vec3(0., 0., 0.);
vec3 tint = vec3(1., 0., 0.);
vec3 light = vec3(1., 1., 1.);
float l_min = 0.3;
float l_max = 0.9;

void main() {
    vec4 tex_color = texture(u_texture, v_texcoord);
    float l = (tex_color.r + tex_color.g + tex_color.b) / 3.;
    l = (l - l_min) / (l_max - l_min);
    vec3 mapped = l < 0.5 ? mix(dark, tint, 2. * (l - 0.5 * 0.))
                           : mix(tint, light, 2. * (l - 0.5 * 1.));
    outColor.rgb = mapped;
}
