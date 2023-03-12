varying float vOpacity;
void main()
{
    vec3 color = vec3(1.0);
    gl_FragColor = vec4(color, vOpacity);
}