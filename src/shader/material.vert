varying float elevation;

void main() {
    elevation = position.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
