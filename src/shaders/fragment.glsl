varying vec2 vUv;   
varying float vPattern;  
uniform float uTime;
uniform float uAudioFreq;
uniform vec3 iResolution;
#define PI 3.14159265358979
vec2 m = vec2(.7,.8);

/*
struct ColorStop {
    vec3 color;
    float position;
};

vec3 ColorRamp3(vec3 colors, float factor) {     
    int index = 0; 
    for(int i=0; i < 2; i++) { 
        ColorStop currentColor = colors[i]; 
        bool isInBetween = currentColor.position <= factor; 
        index = isInBetween ? i : index; 
    } 
    ColorStop currentColor = colors[index]; 
    ColorStop nextColor = colors[index + 1]; 
    float range = nextColor.position - currentColor.position; 
    float lerpFactor = (factor - currentColor.position) / range; 
    return mix(currentColor.color, nextColor.color, lerpFactor); 
}*/

vec3 palette(float pos, float period) {
    vec3 a = vec3(0.8784, 0.898, 0.4784);
    vec3 b = vec3(0.3882, 0.6667, 0.9882);
    vec3 c = vec3(0.9922, 0.4314, 0.6549);
    vec3 phase = vec3(0.168, 0.808, 2.538);
    /*return
        a*cos(period*pos + 6.28*phase[0])+
        b*cos(period*pos + 6.20*phase[1])+
        c*cos(period*pos + 6.13*phase[2]);*/

    return a + b*cos(period * (c*pos + phase)); 
}

void main() {   
    vec2 vUv2 = mat2(cos(uTime*0.4), -sin(uTime*0.4),sin(uTime*0.4), cos(uTime*0.4)) * vUv;
    vec3 col = vec3(0.,0.,0.); 
    float d2 = length(vUv2 - vec2(0.5, 0.5));

    for(float i = 1.; i < 3.; i++) {
        vec2 uv = fract(vUv2*(pow(2., i)));
        float d = length(uv - vec2(0.5, 0.5)) * fract(-2. * length(d2) * length(vUv2) + 1.5*uTime) ;
        
        d = sin(d*8. + uTime)/8.;
        d = 0.01 / abs(d);
        col += palette(uTime *1.5, 5.5) * pow(0.2, i-1.);
    }

    gl_FragColor = vec4(col*(0.5+d2), 1.);
}