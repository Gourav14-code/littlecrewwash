import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createCar } from './entities/CarPlaceholder.js';
import { createCharacter } from './entities/CharacterPlaceholder.js';
import { createGarage } from './entities/GarageEnvironment.js';
import { createPressureWasher } from './entities/PressureWasher.js';

// --- Scene & Environment Setup ---
const container = document.getElementById('app');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a222d);
scene.fog = new THREE.Fog(0x1a222d, 16, 38);

// --- Camera Setup ---
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

// --- Renderer Setup (Integrated GPU Optimized) ---
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

// --- Orbit Controls (Used for free inspection mode) ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.04;
controls.minDistance = 1.2;
controls.maxDistance = 22;

// --- Lighting System (Warm & Stylized without heavy compute) ---
const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.75);
scene.add(ambientLight);

// Key Directional Bay Light
const sunLight = new THREE.DirectionalLight(0xfffaf0, 1.2);
sunLight.position.set(5, 7.5, 4);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 25;
sunLight.shadow.camera.left = -7;
sunLight.shadow.camera.right = 7;
sunLight.shadow.camera.top = 7;
sunLight.shadow.camera.bottom = -7;
sunLight.shadow.bias = -0.0005;
scene.add(sunLight);

// Cool Skylight Fill from opposite bay corner
const fillLight = new THREE.DirectionalLight(0x7090b0, 0.45);
fillLight.position.set(-6, 4, -4);
scene.add(fillLight);

// Subtle warm point lights under overhead fluorescent fixtures
const overheadLight1 = new THREE.PointLight(0xfff5e6, 0.8, 8);
overheadLight1.position.set(0, 4.2, 0);
const overheadLight2 = new THREE.PointLight(0xfff5e6, 0.6, 8);
overheadLight2.position.set(0, 4.2, -3);
scene.add(overheadLight1, overheadLight2);

// --- Add Entities to Scene ---
// 1. Garage Architecture & Workshop Props
const garage = createGarage();
scene.add(garage);

// 2. Stylized Sedan
const car = createCar();
car.position.set(0, 0, 0);
scene.add(car);

// 3. Wash Crew Character
const character = createCharacter();
const charInitialPos = new THREE.Vector3(-2.2, 0, 0.9);
character.position.copy(charInitialPos);
character.rotation.y = Math.PI / 3.2; // Angled toward car side door
scene.add(character);

// 4. Mobile Pressure Washer Unit & Wand
const pressureWasher = createPressureWasher();
const machinePos = new THREE.Vector3(-3.8, 0, -1.8);
pressureWasher.userData.cartGroup.position.copy(machinePos);
pressureWasher.userData.cartGroup.rotation.y = Math.PI / 5;

// Attach wand in front of character's right hand in 3rd person
const wand = pressureWasher.userData.wand;
const wandWorldPos = new THREE.Vector3(-1.75, 1.05, 1.15);
wand.position.copy(wandWorldPos);
wand.rotation.set(0.1, Math.PI / 3.5, 0.05);

scene.add(pressureWasher);

// Create the connecting hose
pressureWasher.userData.updateHose(machinePos, wandWorldPos);

// --- First-Person Foreground Wand (Viewmodel) ---
// When in first-person mode, this wand sits in the bottom-right of the viewport
const fpWandGroup = new THREE.Group();
const fpWand = wand.clone(true);
fpWand.position.set(0.28, -0.26, -0.58); // Bottom-right corner of screen
fpWand.rotation.set(0.05, -0.12, 0.02);
fpWandGroup.add(fpWand);
camera.add(fpWandGroup);
scene.add(camera);
fpWandGroup.visible = false; // Hidden in 3rd person

// --- Camera View Controller ---
// Modes: 'third' (Over the shoulder), 'first' (Eyes view), 'inspect' (Free orbit)
let currentCameraMode = 'third';

// Camera position presets
const thirdPersonCamPos = new THREE.Vector3(-3.45, 2.05, 2.25);
const thirdPersonLookTarget = new THREE.Vector3(-0.4, 0.95, 0.55);

const firstPersonCamPos = new THREE.Vector3(-2.2, 1.62, 0.9);
const firstPersonLookTarget = new THREE.Vector3(0.0, 1.05, 0.5);

const inspectCamPos = new THREE.Vector3(4.8, 3.5, 5.2);
const inspectLookTarget = new THREE.Vector3(0, 1.0, 0);

const currentViewText = document.getElementById('current-view-text');
const toggleBtn = document.getElementById('toggle-cam-btn');
const orbitInspectBtn = document.getElementById('orbit-inspect-btn');

function applyCameraMode(mode) {
  currentCameraMode = mode;

  if (mode === 'third') {
    // Over-the-shoulder player view
    camera.position.copy(thirdPersonCamPos);
    camera.lookAt(thirdPersonLookTarget);
    controls.enabled = false; // Keep camera fixed in true over-the-shoulder perspective

    character.visible = true;
    wand.visible = true;
    fpWandGroup.visible = false;

    currentViewText.innerText = 'Third-Person (Over-the-Shoulder)';
    currentViewText.style.color = '#38bdf8';
    toggleBtn.innerText = 'Switch to: First-Person View';
  } else if (mode === 'first') {
    // Eye level view from character
    camera.position.copy(firstPersonCamPos);
    camera.lookAt(firstPersonLookTarget);
    controls.enabled = false;

    // In first person, hide the external character model to prevent internal camera clipping
    character.visible = false;
    wand.visible = false;
    fpWandGroup.visible = true; // Show first-person tool in hand

    currentViewText.innerText = 'First-Person (Eyeline View)';
    currentViewText.style.color = '#4ade80';
    toggleBtn.innerText = 'Switch to: Third-Person View';
  } else if (mode === 'inspect') {
    // Free orbit camera for inspecting the full scene
    camera.position.copy(inspectCamPos);
    controls.target.copy(inspectLookTarget);
    controls.enabled = true;

    character.visible = true;
    wand.visible = true;
    fpWandGroup.visible = false;

    currentViewText.innerText = 'Free Inspect (Orbit Camera)';
    currentViewText.style.color = '#f59e0b';
    toggleBtn.innerText = 'Switch to: First-Person View';
  }
}

// Button Events
toggleBtn.addEventListener('click', () => {
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

// Initialize in true Third-Person mode
applyCameraMode('third');

// --- Responsive Resizing ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
});

// --- Gentle Subtle Animation Loop ---
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // Subtle breathing / idle sway for first-person wand tool
  if (currentCameraMode === 'first' && fpWandGroup.visible) {
    fpWand.position.y = -0.26 + Math.sin(elapsedTime * 2.2) * 0.006;
    fpWand.position.x = 0.28 + Math.cos(elapsedTime * 1.5) * 0.004;
  }

  // If in inspect mode, update orbit controls damping
  if (controls.enabled) {
    controls.update();
  }

  renderer.render(scene, camera);
}

animate();
