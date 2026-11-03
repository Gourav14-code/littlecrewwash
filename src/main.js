import * as THREE from 'three';
import { createCar } from './entities/CarPlaceholder.js';
import { createCharacter } from './entities/CharacterPlaceholder.js';
import { createGarage } from './entities/GarageEnvironment.js';
import { createPressureWasher } from './entities/PressureWasher.js';
import { createWaterSpray } from './mechanics/WaterSpray.js';
import { InputManager } from './core/InputManager.js';
import { PlayerController } from './core/PlayerController.js';

// --- Scene Setup ---
const container = document.getElementById('app');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x131a24);
scene.fog = new THREE.Fog(0x131a24, 18, 42);

// --- Camera Setup ---
const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
scene.add(camera);

// --- WebGL Renderer (Optimized for integrated graphics) ---
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

// --- Lighting System ---
const ambientLight = new THREE.AmbientLight(0xfff8ee, 0.72);
scene.add(ambientLight);

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

const fillLight = new THREE.DirectionalLight(0x759ac0, 0.45);
fillLight.position.set(-6, 4.5, -4.5);
scene.add(fillLight);

const bayLight1 = new THREE.PointLight(0xfffaed, 0.85, 9);
bayLight1.position.set(0, 4.3, 1.2);
const bayLight2 = new THREE.PointLight(0xfffaed, 0.75, 9);
bayLight2.position.set(0, 4.3, -1.8);
scene.add(bayLight1, bayLight2);

// --- Instantiate Entities ---
// 1. Garage
const garage = createGarage();
scene.add(garage);

// 2. Sedan
const car = createCar();
car.position.set(0, 0, 0);
scene.add(car);

// 3. Wash Crew Character
const character = createCharacter();
scene.add(character);

// 4. Mobile Pressure Washer Unit & Handheld Spray Gun
const pressureWasher = createPressureWasher();
const cartPos = new THREE.Vector3(-3.85, 0, -1.6);
pressureWasher.userData.cart.position.copy(cartPos);
pressureWasher.userData.cart.rotation.y = Math.PI / 4.5;
scene.add(pressureWasher);

// 5. Water Spray System (Collides against car and garage floor)
const waterSpray = createWaterSpray(scene, [car, garage]);

// 6. Input Manager & Player Controller
const inputManager = new InputManager(renderer.domElement);

const playerController = new PlayerController({
  camera,
  characterMesh: character,
  washerSystem: pressureWasher,
  waterSpray,
  domElement: renderer.domElement
});

// Default to Third-Person
playerController.setCameraMode('third');

// --- UI Elements ---
const currentViewText = document.getElementById('current-view-text');
const toggleCamBtn = document.getElementById('toggle-cam-btn');
const pointerLockBtn = document.getElementById('pointer-lock-btn');
const interactionBanner = document.getElementById('interaction-banner');
const interactionText = document.getElementById('interaction-text');
const crosshair = document.getElementById('crosshair');

function updateUI() {
  if (playerController.cameraMode === 'first') {
    currentViewText.innerText = 'First-Person Player View';
    currentViewText.style.color = '#4ade80';
    toggleCamBtn.innerText = 'Switch to: Third-Person View [V]';
    crosshair.classList.add('visible');
  } else {
    currentViewText.innerText = 'Third-Person Player View';
    currentViewText.style.color = '#38bdf8';
    toggleCamBtn.innerText = 'Switch to: First-Person View [V]';
    crosshair.classList.remove('visible');
  }

  // Pointer lock button state
  if (inputManager.isPointerLocked) {
    pointerLockBtn.innerText = 'Mouse Aim Locked (Esc to unlock)';
    pointerLockBtn.style.background = 'rgba(16, 185, 129, 0.4)';
  } else {
    pointerLockBtn.innerText = 'Click to Lock Mouse Aim';
    pointerLockBtn.style.background = 'rgba(51, 65, 85, 0.75)';
  }

  // Interaction banner
  const prompt = playerController.getInteractionPrompt();
  if (prompt) {
    interactionText.innerText = prompt;
    interactionBanner.classList.remove('hidden');
  } else {
    interactionBanner.classList.add('hidden');
  }
}

// Button Events
toggleCamBtn.addEventListener('click', () => {
  playerController.toggleCameraMode();
  updateUI();
});

pointerLockBtn.addEventListener('click', () => {
  renderer.domElement.requestPointerLock?.();
});

// Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
});

// --- Main Game Loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.1);
  const time = clock.getElapsedTime();

  // Keyboard shortcut V to toggle camera
  if (inputManager.consumeToggleCamKey()) {
    playerController.toggleCameraMode();
  }

  // Update player movement, camera, collision, and water spray
  playerController.update(delta, time, inputManager);

  // Update HUD
  updateUI();

  renderer.render(scene, camera);
}

animate();
