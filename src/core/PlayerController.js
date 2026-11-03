import * as THREE from 'three';

/**
 * Handles third-person and first-person player movement, collision detection,
 * mouse-look camera positioning, weapon equipping, and interaction logic.
 */
export class PlayerController {
  constructor({
    camera,
    characterMesh,
    washerSystem,
    waterSpray,
    domElement
  }) {
    this.camera = camera;
    this.character = characterMesh;
    this.washer = washerSystem;
    this.spray = waterSpray;
    this.domElement = domElement;

    // Player physical state
    this.position = new THREE.Vector3(-2.4, 0, 0.8);
    this.moveSpeed = 3.8; // m/s
    this.playerRadius = 0.35;

    // Camera angles (in radians)
    this.yaw = Math.PI * 0.75; // Starting look angle facing car
    this.pitch = 0.05; // Slightly downward look
    this.mouseSensitivity = 0.0022;

    // View mode: 'third' or 'first'
    this.cameraMode = 'third';

    // State
    this.isEquipped = true; // Starts equipped with washer gun
    this.isMoving = false;
    this.canInteract = false;

    // Machine cart position
    this.cartPosition = new THREE.Vector3(-3.85, 0, -1.6);

    // Collision boundaries
    this.carMin = new THREE.Vector3(-1.25, 0, -2.55);
    this.carMax = new THREE.Vector3(1.25, 2.0, 2.55);

    this.garageMin = new THREE.Vector3(-7.2, 0, -7.2);
    this.garageMax = new THREE.Vector3(7.2, 5.0, 7.2);

    // Viewmodel gun for first-person
    this._setupFirstPersonViewmodel();
  }

  _setupFirstPersonViewmodel() {
    this.fpGunGroup = new THREE.Group();
    this.fpGunGroup.name = 'FirstPersonViewmodel';

    // Clone the spray gun for first-person viewport display
    const gunClone = this.washer.userData.gun.clone(true);
    gunClone.position.set(0.28, -0.26, -0.56);
    gunClone.rotation.set(0.06, -0.1, 0.02);
    this.fpGunGroup.add(gunClone);

    this.camera.add(this.fpGunGroup);
    this.fpGunGroup.visible = false;
    this.fpGun = gunClone;
  }

  setCameraMode(mode) {
    if (mode === this.cameraMode) return;
    this.cameraMode = mode;

    if (this.cameraMode === 'first') {
      this.character.visible = false;
      this.washer.userData.gun.visible = false;
      this.fpGunGroup.visible = this.isEquipped;
    } else {
      this.character.visible = true;
      this.washer.userData.gun.visible = this.isEquipped;
      this.fpGunGroup.visible = false;
    }
  }

  toggleCameraMode() {
    this.setCameraMode(this.cameraMode === 'third' ? 'first' : 'third');
  }

  update(delta, time, input) {
    // 1. Handle Camera Rotation from Mouse Delta
    const mouseDelta = input.getAndResetMouseDelta();
    this.yaw -= mouseDelta.x * this.mouseSensitivity;
    this.pitch -= mouseDelta.y * this.mouseSensitivity;

    // Clamp vertical pitch (-75 deg to +75 deg)
    const maxPitch = Math.PI * 0.42;
    this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

    // 2. Handle WASD Movement Direction (Relative to Camera Yaw)
    const forward = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    const moveDir = new THREE.Vector3(0, 0, 0);
    if (input.keys.forward) moveDir.add(forward);
    if (input.keys.backward) moveDir.sub(forward);
    if (input.keys.right) moveDir.sub(right);
    if (input.keys.left) moveDir.add(right);

    this.isMoving = moveDir.lengthSq() > 0.001;

    if (this.isMoving) {
      moveDir.normalize();
      const nextPos = this.position.clone().addScaledVector(moveDir, this.moveSpeed * delta);

      // 3. Resolve Collisions (Car Box & Garage Walls)
      this._resolveCollisions(nextPos);

      // Character mesh rotates smoothly towards movement direction in third-person
      if (this.cameraMode === 'third') {
        const targetRot = Math.atan2(moveDir.x, moveDir.z);
        // Smooth angular interpolation
        let diff = targetRot - this.character.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.character.rotation.y += diff * Math.min(1.0, delta * 12.0);
      }
    } else if (this.cameraMode === 'third') {
      // In third-person when stationary, orient character forward along view
      const viewRot = this.yaw + Math.PI;
      let diff = viewRot - this.character.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.character.rotation.y += diff * Math.min(1.0, delta * 5.0);
    }

    // Sync character model position
    this.character.position.copy(this.position);

    // 4. Update Character Joint Animation (Walk stride vs. Idle breathing)
    if (this.character.userData.updateAnimation) {
      this.character.userData.updateAnimation(time, this.isMoving, this.isEquipped);
    }

    // 5. Handle E Interaction (Equip / Stow Pressure Washer Gun)
    const distToWasherCart = this.position.distanceTo(this.cartPosition);
    this.canInteract = distToWasherCart <= 2.4;

    if (this.canInteract && input.consumeInteractKey()) {
      this.isEquipped = !this.isEquipped;
      if (this.cameraMode === 'first') {
        this.fpGunGroup.visible = this.isEquipped;
      } else {
        this.washer.userData.gun.visible = this.isEquipped;
      }
    }

    // 6. Position Handheld Gun & Update Flexible Hose
    this._updateGunAndHose();

    // 7. Handle Camera Positioning (Preserving player coordinates)
    this._updateCamera(delta);

    // 8. Handle Spraying (Left Mouse Button Hold)
    this._updateWaterSpray(delta, input.isMouseDown);
  }

  _resolveCollisions(nextPos) {
    // A. Garage Wall Clamping
    nextPos.x = Math.max(this.garageMin.x + this.playerRadius, Math.min(this.garageMax.x - this.playerRadius, nextPos.x));
    nextPos.z = Math.max(this.garageMin.z + this.playerRadius, Math.min(this.garageMax.z - this.playerRadius, nextPos.z));

    // B. Sedan Obstacle AABB Collision & Sliding
    // Test X-axis movement
    const testX = new THREE.Vector3(nextPos.x, nextPos.y, this.position.z);
    if (!this._isInsideCar(testX)) {
      this.position.x = nextPos.x;
    }

    // Test Z-axis movement
    const testZ = new THREE.Vector3(this.position.x, nextPos.y, nextPos.z);
    if (!this._isInsideCar(testZ)) {
      this.position.z = nextPos.z;
    }

    // C. Washer Cart Obstacle Collision
    const toCart = new THREE.Vector2(this.position.x - this.cartPosition.x, this.position.z - this.cartPosition.z);
    const cartMinDist = 0.65;
    if (toCart.length() < cartMinDist) {
      toCart.normalize().multiplyScalar(cartMinDist);
      this.position.x = this.cartPosition.x + toCart.x;
      this.position.z = this.cartPosition.z + toCart.y;
    }
  }

  _isInsideCar(pos) {
    return (
      pos.x >= this.carMin.x - this.playerRadius &&
      pos.x <= this.carMax.x + this.playerRadius &&
      pos.z >= this.carMin.z - this.playerRadius &&
      pos.z <= this.carMax.z + this.playerRadius
    );
  }

  _updateGunAndHose() {
    const gun = this.washer.userData.gun;

    if (this.isEquipped) {
      if (this.cameraMode === 'third') {
        // Position gun at character's right hand position
        const rightOffset = new THREE.Vector3(0.32, 1.05, 0.45);
        rightOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.character.rotation.y);
        gun.position.copy(this.position).add(rightOffset);
        gun.rotation.y = this.character.rotation.y - Math.PI / 2;

        this.washer.userData.updateHose(this.cartPosition, gun.position);
      } else {
        // In first person, hose links to first-person viewmodel position in world
        const fpGunWorldPos = new THREE.Vector3();
        this.fpGun.getWorldPosition(fpGunWorldPos);
        this.washer.userData.updateHose(this.cartPosition, fpGunWorldPos);
      }
    } else {
      // Gun docked on cart holster
      gun.position.set(this.cartPosition.x + 0.28, 0.75, this.cartPosition.z);
      gun.rotation.set(0, 0, Math.PI);
      gun.visible = true;
      this.washer.userData.updateHose(this.cartPosition, gun.position);
    }
  }

  _updateCamera(delta) {
    if (this.cameraMode === 'first') {
      // First-person eye level
      this.camera.position.set(this.position.x, this.position.y + 1.62, this.position.z);
      this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
    } else {
      // Third-person smooth follow camera
      const targetLook = new THREE.Vector3(this.position.x, this.position.y + 1.35, this.position.z);
      const camDistance = 3.2;

      // Orbit vector behind character based on yaw and pitch
      const camOffset = new THREE.Vector3(
        -Math.sin(this.yaw) * Math.cos(this.pitch) * camDistance,
        Math.sin(this.pitch) * camDistance + 0.35,
        -Math.cos(this.yaw) * Math.cos(this.pitch) * camDistance
      );

      const desiredCamPos = targetLook.clone().add(camOffset);

      // Clamp camera from clipping through back and side walls
      desiredCamPos.x = Math.max(-7.0, Math.min(7.0, desiredCamPos.x));
      desiredCamPos.z = Math.max(-7.0, Math.min(7.0, desiredCamPos.z));
      desiredCamPos.y = Math.max(0.4, desiredCamPos.y);

      // Smooth camera interpolation
      this.camera.position.lerp(desiredCamPos, Math.min(1.0, delta * 15.0));
      this.camera.lookAt(targetLook);
    }
  }

  _updateWaterSpray(delta, isMouseDown) {
    if (isMouseDown && this.isEquipped) {
      this.spray.startSpray();

      const nozzlePos = new THREE.Vector3();
      const nozzleDir = new THREE.Vector3();

      if (this.cameraMode === 'first') {
        // In first person, shoot directly forward from camera crosshair
        this.camera.getWorldPosition(nozzlePos);
        this.camera.getWorldDirection(nozzleDir);
        // Slightly offset to gun tip
        nozzlePos.addScaledVector(nozzleDir, 0.45);
        nozzlePos.y -= 0.12;
      } else {
        // In third person, shoot forward from handheld gun nozzle
        this.washer.userData.gun.getWorldPosition(nozzlePos);
        this.camera.getWorldDirection(nozzleDir);
        nozzlePos.y += 0.05;
      }

      this.spray.update(delta, nozzlePos, nozzleDir);
    } else {
      this.spray.stopSpray();
    }
  }

  getInteractionPrompt() {
    if (!this.canInteract) return null;
    return this.isEquipped ? '[E] Dock Pressure Washer Gun' : '[E] Pick Up Pressure Washer Gun';
  }
}
