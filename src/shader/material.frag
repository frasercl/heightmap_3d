#include <fog_pars_fragment>

varying float elevation;

const vec3 colors[7] = vec3[7](
    vec3(0.345, 0.075, 0.988),
    vec3(0.345, 0.075, 0.988),
    vec3(0.11, 0.761, 0.992),
    vec3(0.49, 0.992, 0.58),
    vec3(0.961, 0.788, 0.149),
    vec3(1.0, 0.169, 0.094),
    vec3(1.0, 0.169, 0.094)
);

void main() {
    if (mod(elevation, 0.8) > 0.77) {
        gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
    } else {
        int index = clamp(int(floor(elevation)) + 3, 0, 6);
        float between = mod(elevation, 1.0);
        vec3 color = mix(colors[index], colors[index + 1], between);
        gl_FragColor = vec4(color, 1.0);
    }
    #include <fog_fragment>
}
