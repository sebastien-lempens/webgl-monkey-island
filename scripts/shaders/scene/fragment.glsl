uniform float uProgress;
uniform sampler2D tDiffuse;
uniform vec3 uColor;
varying vec2 vUv;
void main(){
    vec4 texel=texture2D(tDiffuse,vUv);
    vec2 uv=vUv;
    uv=uv-.5;
    float circle=length(dot(uv,uv));
    circle=smoothstep(uProgress,uProgress-.4,circle);
    vec3 color=mix(uColor,texel.xyz,circle);
    gl_FragColor=vec4(color,circle);
}