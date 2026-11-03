/**
 * Manages keyboard and mouse inputs, including Pointer Lock for seamless FPS/TPS camera control.
 */
export class InputManager {
  constructor(domElement) {
    this.domElement = domElement;

    // Movement state
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };

    // Actions
    this.isMouseDown = false;
    this.justPressedE = false;
    this.justPressedV = false;

    // Mouse movement deltas
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;

    // Pointer lock state
    this.isPointerLocked = false;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this._setupListeners();
  }

  _setupListeners() {
    // Keyboard down
    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.keys.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.keys.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.keys.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.keys.right = true;
          break;
        case 'KeyE':
          this.justPressedE = true;
          break;
        case 'KeyV':
        case 'KeyC':
          this.justPressedV = true;
          break;
      }
    });

    // Keyboard up
    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.keys.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.keys.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.keys.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.keys.right = false;
          break;
      }
    });

    // Mouse down on canvas
    this.domElement.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.isMouseDown = true;
      }
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      // Request pointer lock on click if not already locked
      if (!this.isPointerLocked && document.pointerLockElement !== this.domElement) {
        this.domElement.requestPointerLock?.();
      }
    });

    // Mouse up
    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isMouseDown = false;
      }
      this.isDragging = false;
    });

    // Mouse move
    window.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked) {
        this.mouseDeltaX += e.movementX || 0;
        this.mouseDeltaY += e.movementY || 0;
      } else if (this.isDragging) {
        this.mouseDeltaX += e.clientX - this.lastMouseX;
        this.mouseDeltaY += e.clientY - this.lastMouseY;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
    });

    // Pointer lock change listeners
    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.domElement;
    });
  }

  getAndResetMouseDelta() {
    const delta = {
      x: this.mouseDeltaX,
      y: this.mouseDeltaY
    };
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    return delta;
  }

  consumeInteractKey() {
    const val = this.justPressedE;
    this.justPressedE = false;
    return val;
  }

  consumeToggleCamKey() {
    const val = this.justPressedV;
    this.justPressedV = false;
    return val;
  }
}
