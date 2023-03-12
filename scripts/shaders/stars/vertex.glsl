attribute float opacity;
uniform float uSize;
varying float vOpacity;
void main()
{
    #include <begin_vertex>
    /** 
     * Position
     */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);  
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    /**
     * Size
     */
     gl_PointSize = uSize;

    /**
    * Opacity
    */
    vOpacity = opacity;

}