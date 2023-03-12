attribute float opacity;
uniform float uTime;
uniform float uSize;
varying vec3 vColor;
varying float vOpacity;
#include <clipping_planes_pars_vertex>
#pragma glslify:snoise3=require(../packages/glsl-noise/simplex-3d)
void main()
{
    #include <begin_vertex>  
    #include <project_vertex>
    #include <clipping_planes_vertex>     
    /** 
     * Position
     */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);  
    modelPosition.x  += .02 *  snoise3(modelPosition.xyz * 40.0 + uTime * 0.01);
    modelPosition.y  += .02 * snoise3(modelPosition.xyz * 10.0 + uTime * 0.01);
    modelPosition.z  += .02 * snoise3(modelPosition.xyz * 80.0 + uTime * 0.01);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    /**
     * Size
     */
     gl_PointSize = uSize;
     gl_PointSize *= (1.0 / - viewPosition.z);

    /**
     * Color
     */
    vColor = color;
    /**
    * Opacity
    */
    vOpacity = opacity;

}