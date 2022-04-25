import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    PlaneGeometry,
    ShaderMaterial,
    Mesh,
    Vector3,
    Fog,
    Color,
} from "three";
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';

// @ts-ignore
import vertexShader from "./shader/material.vert";
// @ts-ignore
import fragmentShader from "./shader/material.frag";

const TILE_SIZE = 50;
const TILE_SEGMENTS = 255;

interface Tile {
    mesh: Mesh<PlaneGeometry, ShaderMaterial>;
    x: number;
    y: number;
}
    
class World {
    tiles: Tile[];
    scene: Scene;
    centerX: number;
    centerY: number;
    radius: number;
    diameter: number;

    constructor(scene: Scene, radius: number) {
        this.scene = scene;
        this.radius = radius;
        this.diameter = radius * 2 + 1;
        this.centerX = 0;
        this.centerY = 0;
        this.tiles = [];

        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                this.addTile(x, y);
            }
        }
    }

    updateTilePosition(tile: Tile) {
        tile.mesh.position.x = tile.x * TILE_SIZE;
        tile.mesh.position.y = tile.y * TILE_SIZE;
        tile.mesh.material.needsUpdate = true;
    }

    addTile(x: number, y: number) {
        const geometry = new PlaneGeometry(TILE_SIZE, TILE_SIZE, TILE_SEGMENTS, TILE_SEGMENTS);
        const material = new ShaderMaterial({
            uniforms: {
                fogNear: { value: 2000 },
                fogFar: { value: 20000 },
                fogColor: { value: new Color( 0xffffff ) }
            },
            vertexShader,
            fragmentShader,
            fog: true
        });
        const mesh = new Mesh(geometry, material);

        this.scene.add(mesh);

        let tile: Tile = { mesh, x, y };
        this.updateTilePosition(tile);
        this.tiles.push(tile);
    }

    updateCenter(x: number, y: number) {
        if (x === this.centerX && y === this.centerY) return;

        for (const tile of this.tiles) {
            if (tile.x < x - this.radius) {
                tile.x += this.diameter;
                this.updateTilePosition(tile);
            } else if (tile.x > x + this.radius) {
                tile.x -= this.diameter;
                this.updateTilePosition(tile);
            }

            if (tile.y < y - this.radius) {
                tile.y += this.diameter;
                this.updateTilePosition(tile);
            } else if (tile.y > y + this.radius) {
                tile.y -= this.diameter;
                this.updateTilePosition(tile);
            }
        }
    }
}

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, world: World;

function init() {
    const aspect = window.innerWidth / window.innerHeight;
    camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.up = new Vector3(0, 0, 1);
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
    
    scene = new Scene();
    scene.fog = new Fog(0xe0e0e0, 50, 100);
    scene.background = new Color(0xe0e0e0);

    renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    new MapControls(camera, renderer.domElement);

    world = new World(scene, 2);
}

function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", resize);

function animate() {
    window.requestAnimationFrame(animate);
    const tileX = Math.trunc(camera.position.x / TILE_SIZE);
    const tileY = Math.trunc(camera.position.y / TILE_SIZE);
    world.updateCenter(tileX, tileY);
    renderer.render(world.scene, camera);
}

window.onload = () => {
    init();
    animate();
}
