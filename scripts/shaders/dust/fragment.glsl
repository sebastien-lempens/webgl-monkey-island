varying vec3 vColor;
varying float vOpacity;
uniform float uTime;
#include <clipping_planes_pars_fragment>
#pragma glslify:snoise2=require(../packages/glsl-noise/simplex-2d)
void main()
{
    #include <clipping_planes_fragment>
    float dustIntensity = max(sin(vOpacity * uTime * 2.0), 0.1);
    // Light point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength =( 1.0 - strength);
    strength = pow(strength, 12.0);


    // Final color
    vec3 color = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(color, dustIntensity);
}