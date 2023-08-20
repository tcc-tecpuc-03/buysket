import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
const canvasWidth = window.innerWidth / 2;
const canvasHeight = window.innerHeight / 2;
const ASPECT_RATIO = canvasWidth / canvasHeight;
const MODEL_PATH = "./models/basket/scene.gltf";
const MODEL_SCALE = 0.5;
const CAMERA_DISTANCE = 1.2;
const MODEL_ROTATION_SPEED = 0.002;
const CAMERA_MOVE = 0.0000000045;

const scene = new THREE.Scene({
  antialias: true,
  alpha: true,
});

const camera = new THREE.PerspectiveCamera(5, ASPECT_RATIO, 0.1, 1000);
camera.position.z = CAMERA_DISTANCE;

let object;
const loader = new GLTFLoader();
loader.load(
  MODEL_PATH,
  (gltf) => {
    object = gltf.scene;
    object.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);

    scene.add(object);
  },
  (xhr) => {
    console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
  },
  (error) => {
    console.error(error);
  }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(canvasWidth, canvasHeight);
document.getElementById("Model3D").appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

var pointLight1 = new THREE.PointLight(0xf9eac8, 1, 100);
pointLight1.position.set(5, 10, 0);
pointLight1.castShadow = true;
pointLight1.shadow.camera.top = 20;
scene.add(pointLight1);

const purpleLight = new THREE.PointLight(0x6a00ff, 1, 100);
purpleLight.position.set(0, 1, 1);
scene.add(purpleLight);

const greenLight = new THREE.PointLight(0x00ff00, 2, 100);
greenLight.position.set(1, 0, 0);
scene.add(greenLight);

const shadowGeometry = new THREE.PlaneGeometry(2, 2);
const shadowMaterial = new THREE.ShadowMaterial();
shadowMaterial.opacity = 2;
const shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial);
shadowMesh.position.y = -0.5;
shadowMesh.rotation.x = -Math.PI / 2;
scene.add(shadowMesh);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  if (object) {
    object.position.y += Math.sin(Date.now() * 0.005) * 0.00001;
    object.rotation.y += MODEL_ROTATION_SPEED;
  }
  //

  camera.position.x = Math.sin(Date.now() * 0.0005) * 0.5;
  camera.position.y = Math.sin(Date.now() * 0.0005) * 0.5;
  camera.position.z += CAMERA_MOVE;
  camera.lookAt(scene.position);
}

window.addEventListener("resize", () => {
  renderer.setSize(canvasWidth, canvasHeight);
  camera.aspect = ASPECT_RATIO;
  camera.updateProjectionMatrix();
});

animate();
