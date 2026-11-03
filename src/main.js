import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createCar } from './entities/CarPlaceholder.js';
import { createCharacter } from './entities/CharacterPlaceholder.js';
import { createGarage } from './entities/GarageEnvironment.js';
import { createPressureWasher } from './entities/PressureWasher.js';

// --- Scene & Environment Setup ---
const container = document.getElementById('app');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x131a24);
scene.fog = new THREE.Fog(0x131a24, 18, 42);

// --- Camera Setup ---
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

// --- Renderer Setup (Integrated GPU Friendly) ---
const renderer = new THREE.WebGLRenderer({
  powerPreference: 'default',
  antialias: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

// --- Free Orbit Controls (Used for free inspection mode) ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.04;
controls.minDistance = 1.2;
controls.maxDistance = 24;

// --- Lighting System (Warm Wash Bay Lighting) ---
const ambientLight = new THREE.AmbientLight(0xfff8ee, 0.72);
scene.add(ambientLight);

// Key Directional Bay Sun Light
const sunLight = new THREE.DirectionalLight(0xfffdf5, 1.25);
sunLight.position.set(5.5, 7.5, 4.2);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 25;
sunLight.shadow.camera.left = -7.5;
sunLight.shadow.camera.right = 7.5;
sunLight.shadow.camera.top = 7.5;
sunLight.shadow.camera.bottom = -7.5;
sunLight.shadow.bias = -0.0004;
scene.add(sunLight);

// Cool Skylight Fill Light from opposite bay side
const fillLight = new THREE.DirectionalLight(0x759ac0, 0.45);
fillLight.position.set(-6, 4.5, -4.5);
scene.add(fillLight);

// Overhead wash bay point lights directly beneath ceiling fixtures
const bayLight1 = new THREE.PointLight(0xfffaed, 0.85, 9);
bayLight1.position.set(0, 4.3, 1.2);
const bayLight2 = new THREE.PointLight(0xfffaed, 0.75, 9);
bayLight2.position.set(0, 4.3, -1.8);
scene.add(bayLight1, bayLight2);

// --- Entities Instantiation ---
// 1. Clean Auto Wash Garage
const garage = createGarage();
scene.add(garage);

// 2. Stylized Four-Door Sedan (Placed cleanly in bay center)
const car = createCar();
car.position.set(0, 0, 0);
scene.add(car);

// 3. Wash Crew Character (Well separated from car, standing by bay perimeter)
const character = createCharacter();
const charPos = new THREE.Vector3(-2.4, 0, 0.7);
character.position.copy(charPos);
character.rotation.y = Math.PI / 3.4; // Facing car driver-side door
scene.add(character);

// 4. Mobile Pressure Washer Unit & Handheld Spray Gun
const pressureWasher = createPressureWasher();
const cartPos = new THREE.Vector3(-3.85, 0, -1.6);
pressureWasher.userData.cart.position.copy(cartPos);
pressureWasher.userData.cart.rotation.y = Math.PI / 4.5;

// Handheld spray gun positioned in character's right hand
const gun = pressureWasher.userData.gun;
const gunWorldPos = new THREE.Vector3(-1.85, 1.05, 1.05);
gun.position.copy(gunWorldPos);
gun.rotation.set(0.08, Math.PI / 3.6, 0.04);
scene.add(pressureWasher);

// Connect the flexible high-pressure black hose
pressureWasher.userData.updateHose(cartPos, gunWorldPos);

// --- First-Person Viewmodel Gun ---
// In first-person view, this gun model sits in the lower-right foreground of the screen
const fpGunGroup = new THREE.Group();
const fpGun = gun.clone(true);
fpGun.position.set(0.26, -0.25, -0.56);
fpGun.rotation.set(0.04, -0.1, 0.02);
fpGunGroup.add(fpGun);
camera.add(fpGunGroup);
scene.add(camera);
fpGunGroup.visible = false;

// --- Camera Controller & Modes ---
// Mode options: 'third', 'first', 'inspect'
let currentCameraMode = 'third';

const thirdPersonCamPos = new THREE.Vector3(-3.65, 2.1, 2.2);
const thirdPersonLookTarget = new THREE.Vector3(-0.35, 0.95, 0.45);

const firstPersonCamPos = new THREE.Vector3(-2.4, 1.62, 0.7);
const firstPersonLookTarget = new THREE.Vector3(0.0, 1.05, 0.45);

const inspectCamPos = new THREE.Vector3(4.9, 3.4, 5.1);
const inspectLookTarget = new THREE.Vector3(0, 0.9, 0);

// UI DOM Elements
const currentViewText = document.getElementById('current-view-text');
const toggleCamBtn = document.getElementById('toggle-cam-btn');
const orbitInspectBtn = document.getElementById('orbit-inspect-btn');

function applyCameraMode(mode) {
  currentCameraMode = mode;

  if (mode === 'third') {
    camera.position.copy(thirdPersonCamPos);
    camera.lookAt(thirdPersonLookTarget);
    controls.enabled = false;

    character.visible = true;
    gun.visible = true;
    fpGunGroup.visible = false;

    currentViewText.innerText = 'Third-Person (Over-the-Shoulder)';
    currentViewText.style.color = '#38bdf8';
    toggleCamBtn.innerText = 'Switch to: First-Person View';
    orbitInspectBtn.innerText = 'Free Inspect Camera (Orbit)';
  } else if (mode === 'first') {
    camera.position.copy(firstPersonCamPos);
    camera.lookAt(firstPersonLookTarget);
    controls.enabled = false;

    // Hide external third-person mesh to avoid camera clipping
    character.visible = false;
    gun.visible = false;
    fpGunGroup.visible = true;

    currentViewText.innerText = 'First-Person (Eyeline View)';
    currentViewText.style.color = '#4ade80';
    toggleCamBtn.innerText = 'Switch to: Third-Person View';
    orbitInspectBtn.innerText = 'Free Inspect Camera (Orbit)';
  } else if (mode === 'inspect') {
    camera.position.copy(inspectCamPos);
    controls.target.copy(inspectLookTarget);
    controls.enabled = true;

    character.visible = true;
    gun.visible = true;
    fpGunGroup.visible = false;

    currentViewText.innerText = 'Free Inspect (Orbit Camera)';
    currentViewText.style.color = '#f59e0b';
    toggleCamBtn.innerText = 'Switch to: First-Person View';
    orbitInspectBtn.innerText = 'Reset to: Third-Person View';
  }
}

// Button Listeners
toggleCamBtn.addEventListener('click', () => {
  if (currentCameraMode === 'third') {
    applyCameraMode('first');
  } else {
    applyCameraMode('third');
  }
});

orbitInspectBtn.addEventListener('click', () => {
  if (currentCameraMode !== 'inspect') {
    applyCameraMode('inspect');
  } else {
    applyCameraMode('third');
  }
});

// Default to true Third-Person Player View
applyCameraMode('third');

// --- Responsive Window Resizing ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // 1. Procedural character breathing & wand stabilization
  if (character.visible && character.userData.updateAnimation) {
    character.userData.updateAnimation(elapsedTime, 'idle_wash');
  }

  // 2. First-person viewmodel gentle idle breathing
  if (currentCameraMode === 'first' && fpGunGroup.visible) {
    fpGun.position.y = -0.25 + Math.sin(elapsedTime * 2.2) * 0.005;
    fpGun.position.x = 0.26 + Math.cos(elapsedTime * 1.6) * 0.003;
  }

  // 3. Orbit controls damping in inspect mode
  if (controls.enabled) {
    controls.update();
  }

  renderer.render(scene, camera);
}

animate();
