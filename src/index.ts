import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    PlaneGeometry,
    ShaderMaterial,
    Mesh,
    Vector3,
} from "three";
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';

// @ts-ignore
import materialVertSource from "./shader/material.vert";
// @ts-ignore
import materialFragSource from "./shader/material.frag";
let scene: Scene, renderer: WebGLRenderer, camera: PerspectiveCamera;

function init() {
    scene = new Scene();
    const aspect = window.innerWidth / window.innerHeight;
    camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.up = new Vector3(0, 0, 1);
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
    
    renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    new MapControls(camera, renderer.domElement);
    
    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", resize);
    
    const geometry = new PlaneGeometry(20, 20, 255, 255);
    
    const material = new ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: materialVertSource,
        fragmentShader: materialFragSource
    });
    const plane = new Mesh(geometry, material);
    scene.add(plane);

}

function animate() {
    window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
animate();
