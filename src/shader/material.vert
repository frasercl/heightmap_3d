varying float elevation;

const float one = 1.0 / 255.0;

vec2 rand(vec2 st){
    st = vec2(dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)));
    return (fract(sin(st)*43758.5453123) - 0.5) * 2.0;
}

float interpolate(float a0, float a1, float w) {
    return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0;
}

float sigmoid(float x) {
    return 2.0 / (1.0 + pow(2.0, -15.0 * x)) - 1.0;
}

float getOctave(float scale) {
    vec2 octPos = floor(position.xy / scale);
    vec2 tl = rand(octPos);
    vec2 tr = rand(octPos + vec2(1., 0.));
    vec2 bl = rand(octPos + vec2(0., 1.));
    vec2 br = rand(octPos + vec2(1., 1.));

    vec2 offLow = (position.xy / scale) - octPos;
    vec2 offHigh = 1.0 - offLow;

    float n0, n1, i0, i1;
    n0 = dot(tl, offLow);
    n1 = dot(tr, vec2(offHigh.x, offLow.y));
    i0 = interpolate(n0, n1, offLow.x);

    n0 = dot(bl, vec2(offLow.x, offHigh.y));
    n1 = dot(br, offHigh);
    i1 = interpolate(n0, n1, offLow.x);

    return interpolate(i0, i1, offLow.y);
}

void main() {
    float scale = .5;
    float el = (sigmoid(getOctave(scale * 8.0))) * 2.0;
    float el2 = (getOctave(scale * 3.0)) * 0.75;
    float el3 = (getOctave(scale * 0.8)) * 0.2;
    elevation = el + el2 + el3;
    gl_Position = projectionMatrix 
                * modelViewMatrix
                * vec4(position.xy, elevation, 1.0);
}
