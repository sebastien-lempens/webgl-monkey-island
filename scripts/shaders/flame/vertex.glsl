varying vec2 vUv;
varying vec3 vPosition;
#include <clipping_planes_pars_vertex>
void main(){
    #include <begin_vertex>
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
    vUv=uv;
    vPosition=position;
    #include <project_vertex>
    #include <clipping_planes_vertex>
}