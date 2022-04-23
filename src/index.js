import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    PlaneGeometry,
    ShaderMaterial,
    Mesh,
} from "three";
import materialVertSource from "./shader/material.vert";
import materialFragSource from "./shader/material.frag";

const scene = new Scene();
const aspect = window.innerWidth / window.innerHeight;
const camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.z = 5;
camera.position.y = -5;
camera.lookAt(0, 0, 0);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", resize);

const geometry = new PlaneGeometry(6, 6, 255, 255);
let position = geometry.attributes.position.array;
const len = 256 * 256 * 3;
for (let i = 2; i < len; i += 3) {
    position[i] = (Math.random() - 0.5) * 6;
}
geometry.attributes.position.needsUpdate = true;
geometry.computeVertexNormals();

const material = new ShaderMaterial({
    uniforms: {},
    vertexShader: materialVertSource,
    fragmentShader: materialFragSource
});
console.log(material);
const plane = new Mesh(geometry, material);
scene.add(plane);

function animate() {
    window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
    plane.rotation.z += 0.01;
}
animate();
