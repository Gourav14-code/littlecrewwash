# Project Handover Document: Little Wash Crew

- **Project Name:** Little Wash Crew
- **Project Location:** `C:\wm`
- **GitHub Repository:** `https://github.com/Gourav14-code/littlecrewwash.git`
- **Last Updated:** 2026-11-03
- **Document Version:** 1.1.0

---

## A. Project Overview

- **Concept:** Little Wash Crew is a stylized 3D pressure-washing and cleaning simulator game.
- **Target Platform:** Browser-first prototype (WebGL via Three.js), with planned packaging for Android in later phases.
- **Technology Stack:** Three.js + Vanilla JavaScript + Vite.
- **Budget:** Strict ₹0 budget. Zero paid software, zero paid 3D models/textures, zero subscriptions, zero paid APIs.

---

## B. Confirmed Game Concept

- **Starting Setting:** The player begins inside an auto wash garage bay.
- **Movement & Perspectives:**
  - **Third-Person Mode:** Real-time WASD movement; character rotates towards walking direction with animated leg strides and arm swings; camera follows the character smoothly from behind; mouse look rotates camera around character.
  - **First-Person Mode:** Eye-level camera with viewmodel hands/spray gun in the foreground; WASD movement and full mouse-look aiming with a center-screen crosshair.
  - **Seamless Switching:** Pressing `V` or clicking the HUD button toggles camera modes while strictly **preserving player position and momentum** (no resetting or teleporting).
- **Interactions & Controls:**
  - **E Key:** Walk near the mobile washer cart to equip or dock the pressure washer gun.
  - **Left Mouse Button (Hold):** Emits a continuous high-pressure water stream with particle spray and a dynamic surface impact splash ring.
  - **Left Mouse Button (Release):** Stops water spray immediately.
- **Cleaning Mechanic (Core Loop):**
  - The water spray raycasts against surfaces to detect collision point and surface normal.
  - Dynamic multi-layer dirt removal will be mapped to this collision hit point in the next phase.
- **Audio Experience:** Relaxing ASMR sound design is planned (water hiss, surface impact spray, pump hum, and clean surface squeaks).
- **First Level Scope:** A single dirty stylized compact sedan inside a dedicated garage wash bay.
- **Future Expansion:** Additional washable objects planned for later levels (motorcycles, SUVs, pickup trucks, outdoor patio furniture, etc.).

---

## C. Technical Constraints & Hardware Profile

- **Operating System:** Windows 10 (with Node.js and VS Code installed).
- **Target Laptop Hardware:**
  - Memory: 8 GB RAM.
  - Storage: 256 GB SSD + 1 TB HDD.
  - GPU: Weak integrated graphics (Intel HD / UHD).
- **Hard Tooling Restrictions:**
  - **No Blender:** Blender does not run on the user's laptop. All external assets must be ready-to-use `.glb` files requiring zero 3D software conversion or re-rigging.
  - **No Heavy Physics Engines:** Collision detection is handled with lightweight, custom AABB and circle clamping (zero CPU/memory overhead from Ammo or Cannon).
  - **No Heavy Game Engines:** Do not introduce Unity, Unreal Engine, or Godot.
  - **No Paid Software or APIs:** Strictly zero spending.
- **Optimization Strategy:**
  - Pixel ratio capped at `1.5` to safeguard integrated GPU fill rate on high-DPI displays.
  - Minimal draw calls with low polygon counts, InstancedMesh for water particles, and shared materials.
  - Low-overhead shadow mapping (single key light, `1024x1024` PCF map).

---

## D. Asset Decisions & Licensing Rules

- **Approach:** Free, ready-made, commercially permissive 3D assets only (or custom procedural code).
- **Kenney Car Kit Sedan:**
  - Approved as candidate model, subject to final file verification (`sedan.glb`).
  - License: CC0 1.0 Universal (Public Domain) — free for commercial use.
- **Character (Wash Crew Member):**
  - Quaternius character pack is pending final verification for exact rigging and animation clips.
- **Garage Props:**
  - Generic furniture packs rejected; targeted garage items (safety cones, tire stacks, toolboxes, oil drums) pending final verification.
- **Pressure Washer & Spray Gun:**
  - Approved to use our custom, lightweight Three.js procedural model (0 KB external download, 100% license-safe, zero polygon overhead).
- **Strict Asset Rules:**
  - Never copy assets from commercial reference games.
  - Always verify format (`.glb` preferred), polycount, and commercial-use license before downloading.
  - Never download external assets without showing the user and receiving explicit approval.

---

## E. Work Completed So Far (Verified State)

- [x] Workspace initialized from an empty folder at `C:\wm`.
- [x] Core configuration created: `package.json`, `vite.config.js`, `index.html`, `src/style.css`, and `src/main.js`.
- [x] Dependencies installed: Three.js (`^0.170.0`) and Vite (`^5.4.14`).
- [x] Production build tested and verified (`npm run build` compiles cleanly).
- [x] Local development server running and tested at `http://localhost:3000/`.
- [x] Git repository initialized, `.gitignore` created, remote origin configured to `https://github.com/Gourav14-code/littlecrewwash.git`.
- [x] Stylized 3D models created:
  - `src/entities/CarPlaceholder.js`: Three-box four-door sedan silhouette (hood, cabin, trunk, 4 doors with handles, headlights, taillights, wheels).
  - `src/entities/CharacterPlaceholder.js`: Jointed wash crew character with hierarchical limb pivots.
  - `src/entities/PressureWasher.js`: Mobile cart with wheels, handle, dials, detergent bottle, brass outlet, red trigger spray gun, and flexible rubber hose curve.
  - `src/entities/GarageEnvironment.js`: Polished epoxy floor, yellow hazard perimeter lines, center drainage trench with cast-iron grates, two-tone walls, overhead beams, and wash luminaires.
- [x] **Gameplay Player Controller Implemented (`src/core/PlayerController.js` & `src/core/InputManager.js`):**
  - **Third-Person Gameplay:** WASD movement in all 4 directions, character mesh rotates towards movement direction, procedural walking animation (hip/knee swing and pelvis bounce), camera follows smoothly from behind, mouse-look rotates around player.
  - **First-Person Gameplay:** Eyeline camera (1.62m), full mouse aiming with center crosshair, viewmodel spray gun with subtle idle sway, WASD movement.
  - **Camera Switching:** Pressing `V` or clicking HUD button switches camera without resetting or teleporting player position.
  - **Collision System:** Player cannot walk through the car (clamped to car AABB obstacle boundary) or garage perimeter walls.
  - **E Key Interaction:** Detects proximity to washer cart (<2.4m) and prompts "[E] Dock / Pick Up Spray Gun".
  - **Continuous Water Spray (`src/mechanics/WaterSpray.js`):** Holding LMB shoots high-velocity water droplet stream with raycast collision impact and surface splash ring; releasing LMB stops water immediately.
- [x] External asset files have **not** been downloaded or integrated yet.

---

## F. Current Visual & Gameplay Observations

1. **Player Controls:** Active and responsive. WASD controls player position in both 3rd and 1st person.
2. **Camera:** Free orbit mode has been superseded by a true player-attached camera (3rd person follow and 1st person eyeline).
3. **Collision:** Sliding collision keeps character outside the sedan bounding box and within garage boundary walls.
4. **Water Stream:** Continuous particles emit when LMB is held and stop on release, with dynamic splash ring positioning on car and floor surfaces.
5. **HUD:** Large, readable card with live camera mode badge, key controls guide, and dynamic `[E]` interaction banner.

---

## G. Pending Work / Next Steps Checklist

- [ ] **Step 1:** User testing of the player movement, camera follow, and water spray stream.
- [ ] **Step 2:** Finalize approval on candidate 3D assets (Kenney sedan, Quaternius animated character).
- [ ] **Step 3:** Integrate verified `.glb` models into `public/assets/models/` upon user approval.
- [ ] **Step 4:** Build the core dynamic washing mechanics:
  - Multi-layer dirt texture/canvas mask mapped to car body.
  - Connecting water spray impact raycast to remove dirt progressively.
- [ ] **Step 5:** Implement wash progress tracking UI (e.g., "Car Cleanliness: 0% → 100%").
- [ ] **Step 6:** Add procedural or CC0 ASMR sound effects (spray loop, surface hit, squeaky clean chime).
- [ ] **Step 7:** Optimize performance and test on integrated graphics.

---

## H. How to Continue Working at Home

When you open this project on your home personal laptop:

### 1. Prerequisites
- Install **Node.js** (LTS version, v18+ or v20+) from [nodejs.org](https://nodejs.org/).
- Install **Visual Studio Code** (or Antigravity / Gemini Agent environment).
- Install **Git** from [git-scm.com](https://git-scm.com/).

### 2. Getting the Project Code
Either:
- Clone your GitHub repository:
  ```bash
  git clone https://github.com/Gourav14-code/littlecrewwash.git
  cd littlecrewwash
  ```
- Or copy the `C:\wm` project folder directly from your office PC (excluding `node_modules`).

### 3. Running the Project
Open a terminal in the project folder and run:
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

### 4. Viewing the Game
- Open your browser to: `http://localhost:3000/`
- **Important Note on Localhost:** `http://localhost:3000/` refers to the computer running the server. The office computer's server will **not** be accessible from your home laptop; you must start `npm run dev` on your home laptop to view it there.

### 5. Verifying the Build
To test that the project builds cleanly for production:
```bash
npm run build
```

---

## I. Handover Instructions for Future Gemini Agents

When a new Gemini Agent session opens this project:

1. **Read `PROJECT_HANDOFF.md` First:** Understand all confirmed decisions, constraints, and progress before proposing or writing code.
2. **Review `README.md`:** Check repository links and general project instructions.
3. **Inspect the Codebase First:** Check `package.json`, `src/main.js`, `src/core/`, and `src/entities/` to see what is already implemented.
4. **Do Not Recreate or Overwrite:** Do not recreate the project from scratch or discard working modular files.
5. **No Blender / No Paid Tools:** Never assume Blender is available. All 3D assets must be pre-exported `.glb` files.
6. **Ask Before Downloading Assets:** Do not download external assets or asset packs without presenting the candidate, license, file size, and obtaining explicit user approval.
7. **Always Update `PROJECT_HANDOFF.md`:** Whenever any feature, milestone, or architectural decision changes, update this document immediately.

---

## J. Next Session Starting Point

When resuming at home:
1. Open the project folder in VS Code / Antigravity.
2. Run `npm install` and `npm run dev`.
3. Open `http://localhost:3000/` to test:
   - Third-person walk & follow camera.
   - First-person eyeline & aiming.
   - E key interaction with washer cart.
   - Left-click continuous water spray and surface splash.
4. Proceed to Phase 2: Connecting the water impact raycast to dynamic progressive dirt removal.
