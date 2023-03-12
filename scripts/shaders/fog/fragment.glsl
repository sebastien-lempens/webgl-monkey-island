uniform float uTime;
uniform vec3 uColor;
varying vec3 vPosition;
#include <clipping_planes_pars_fragment>
#pragma glslify:snoise3=require(../packages/glsl-noise/simplex-3d)
void main(){
    #include <clipping_planes_fragment>
    float gradient = 1.0 + (vPosition.z / -0.15);
    float noise = snoise3(-vPosition.xzz * 15.0 + uTime/20.);
     noise += snoise3(-vPosition.xzz * 10.0 + uTime/15.);
    noise += snoise3(-vPosition.xzz * 5.0 + uTime/10.);
    noise = smoothstep(-0.5, 0.7, noise + sin(uTime) * 0.1) - smoothstep(0.701, 4.0, noise + sin(uTime) * 0.1);
    vec3 color = uColor;
    color = mix(uColor + 0.3, uColor, noise);
    color.g += 0.025;
    gl_FragColor=vec4(color, noise - 0.6);
}