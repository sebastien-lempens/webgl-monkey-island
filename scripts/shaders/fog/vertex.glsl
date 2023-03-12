varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying vec2 vScreenSpace;
#include <clipping_planes_pars_vertex>
void main(){
    #include <begin_vertex>    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
    vUv=uv;
    vec4 vViewPosition4=modelViewMatrix*vec4(position,1.);
    vViewPosition=vViewPosition4.xyz;
    vPosition=position;
    vScreenSpace=gl_Position.xy/gl_Position.w;
    #include <project_vertex>
    #include <clipping_planes_vertex>    
}