varying vec2 vUv; 
varying float vPattern;  
uniform float uTime;
uniform float uAudioFreq;
#define PI 3.14159265358979
vec2 m = vec2(0.7, 0.8); 

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1); 
}
