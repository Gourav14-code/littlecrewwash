import * as THREE from 'three';

/**
 * Creates a clean, stylized auto wash garage environment with rich architectural depth:
 * - Polished epoxy concrete floor with specular sheen.
 * - Precision wash bay perimeter safety lines (high-vis yellow).
 * - Full-length sunken center drainage trench with dark cast-iron slotted grates.
 * - Clean architectural wall panels with two-tone industrial paint and horizontal seams.
 * - Wall signage ("BAY 01 - AUTO DETAILING").
 * - Overhead structural ceiling beams with dual LED wash batten lights.
 * - Removed all unnecessary random clutter props to maintain a professional, focused scene.
 */
export function createGarage() {
  const garage = new THREE.Group();
  garage.name = 'AutoWashGarage';

  // --- Materials ---
  const mainFloorMat = new THREE.MeshStandardMaterial({
    color: 0x3e4756, // Polished dark industrial epoxy floor
    roughness: 0.38,
    metalness: 0.18
  });

  const washBayPadMat = new THREE.MeshStandardMaterial({
    color: 0x242d38, // Dark non-slip wash zone concrete
    roughness: 0.32,
    metalness: 0.22
  });

  const safetyYellowMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Vibrant safety yellow marking enamel
    roughness: 0.3
  });

  const drainChannelMat = new THREE.MeshStandardMaterial({
    color: 0x11161d,
    roughness: 0.9,
    metalness: 0.3
  });

  const lowerWallMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Deep navy blue lower industrial wainscoting
    roughness: 0.65
  });

  const upperWallMat = new THREE.MeshStandardMaterial({
    color: 0xdde3ea, // Clean off-white workshop upper paneling
    roughness: 0.85
  });

  const orangeStripeMat = new THREE.MeshStandardMaterial({
    color: 0xe65100, // Architectural separator stripe
    roughness: 0.4
  });

  const girderMat = new THREE.MeshStandardMaterial({
    color: 0x1a212d,
    roughness: 0.7,
    metalness: 0.4
  });

  const fixtureMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.6
  });

  const glowTubeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xf8fafc,
    emissiveIntensity: 1.4,
    roughness: 0.1
  });

  // --- 1. Floor & Wash Bay Markings ---
  // Large workshop foundation floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), mainFloorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  garage.add(floor);

  // Dedicated Wash Bay Center Pad
  const bayW = 3.6;
  const bayL = 6.4;
  const washPad = new THREE.Mesh(new THREE.PlaneGeometry(bayW, bayL), washBayPadMat);
  washPad.rotation.x = -Math.PI / 2;
  washPad.position.set(0, 0.004, 0);
  washPad.receiveShadow = true;
  garage.add(washPad);

  // High-Vis Safety Perimeter Lines (Crisp boundary edges)
  const lineW = 0.14;
  // Left border stripe
  const lineL = new THREE.Mesh(new THREE.PlaneGeometry(lineW, bayL), safetyYellowMat);
  lineL.rotation.x = -Math.PI / 2;
  lineL.position.set(-bayW / 2, 0.007, 0);
  garage.add(lineL);

  // Right border stripe
  const lineR = lineL.clone();
  lineR.position.x = bayW / 2;
  garage.add(lineR);

  // Front border stripe
  const lineF = new THREE.Mesh(new THREE.PlaneGeometry(bayW + lineW, lineW), safetyYellowMat);
  lineF.rotation.x = -Math.PI / 2;
  lineF.position.set(0, 0.007, bayL / 2);
  garage.add(lineF);

  // Rear border stripe
  const lineB = lineF.clone();
  lineB.position.z = -bayL / 2;
  garage.add(lineB);

  // Corner hazard notch accents (automotive bay styling)
  const notchGeo = new THREE.PlaneGeometry(0.3, 0.3);
  const notchBL = new THREE.Mesh(notchGeo, safetyYellowMat);
  notchBL.rotation.x = -Math.PI / 2;
  notchBL.position.set(-bayW / 2 - 0.25, 0.007, -bayL / 2 - 0.25);
  const notchBR = notchBL.clone(); notchBR.position.x = bayW / 2 + 0.25;
  const notchFL = notchBL.clone(); notchFL.position.z = bayL / 2 + 0.25;
  const notchFR = notchBL.clone(); notchFR.position.set(bayW / 2 + 0.25, 0.007, bayL / 2 + 0.25);
  garage.add(notchBL, notchBR, notchFL, notchFR);

  // --- 2. Central Water Drainage Trench ---
  // Deep drainage trench channel directly below car center
  const trenchW = 0.95;
  const trenchL = 5.2;
  const trench = new THREE.Mesh(new THREE.PlaneGeometry(trenchW, trenchL), drainChannelMat);
  trench.rotation.x = -Math.PI / 2;
  trench.position.set(0, 0.008, 0);
  trench.receiveShadow = true;
  garage.add(trench);

  // Cast iron slotted grate bars across trench
  const barMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.6, roughness: 0.6 });
  for (let z = -trenchL / 2 + 0.2; z <= trenchL / 2 - 0.2; z += 0.3) {
    const grateBar = new THREE.Mesh(new THREE.BoxGeometry(trenchW - 0.04, 0.016, 0.06), barMat);
    grateBar.position.set(0, 0.012, z);
    garage.add(grateBar);
  }

  // --- 3. Clean Workshop Architectural Walls ---
  const wallHeight = 4.8;
  const wainscotHeight = 1.6;

  // Back Wall Assembly
  const backLower = new THREE.Mesh(new THREE.BoxGeometry(16, wainscotHeight, 0.25), lowerWallMat);
  backLower.position.set(0, wainscotHeight / 2, -8);
  backLower.receiveShadow = true;
  garage.add(backLower);

  const backStripe = new THREE.Mesh(new THREE.BoxGeometry(16, 0.08, 0.27), orangeStripeMat);
  backStripe.position.set(0, wainscotHeight + 0.04, -8);
  garage.add(backStripe);

  const backUpper = new THREE.Mesh(new THREE.BoxGeometry(16, wallHeight - wainscotHeight - 0.08, 0.25), upperWallMat);
  backUpper.position.set(0, wainscotHeight + 0.08 + (wallHeight - wainscotHeight - 0.08) / 2, -8);
  backUpper.receiveShadow = true;
  garage.add(backUpper);

  // Architectural vertical panel seams on back wall
  const seamMat = new THREE.MeshStandardMaterial({ color: 0xc8d1dc, roughness: 0.9 });
  for (let sx = -6; sx <= 6; sx += 4) {
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.04, wallHeight - wainscotHeight - 0.08, 0.27), seamMat);
    seam.position.set(sx, wainscotHeight + 0.08 + (wallHeight - wainscotHeight - 0.08) / 2, -8);
    garage.add(seam);
  }

  // Left Wall Assembly
  const leftLower = new THREE.Mesh(new THREE.BoxGeometry(0.25, wainscotHeight, 16), lowerWallMat);
  leftLower.position.set(-8, wainscotHeight / 2, 0);
  leftLower.receiveShadow = true;
  garage.add(leftLower);

  const leftStripe = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.08, 16), orangeStripeMat);
  leftStripe.position.set(-8, wainscotHeight + 0.04, 0);
  garage.add(leftStripe);

  const leftUpper = new THREE.Mesh(new THREE.BoxGeometry(0.25, wallHeight - wainscotHeight - 0.08, 16), upperWallMat);
  leftUpper.position.set(-8, wainscotHeight + 0.08 + (wallHeight - wainscotHeight - 0.08) / 2, 0);
  leftUpper.receiveShadow = true;
  garage.add(leftUpper);

  // Architectural Signboard on Back Wall ("BAY 01 - AUTO WASH")
  const signBacking = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.7, 0.05), lowerWallMat);
  signBacking.position.set(0, 3.2, -7.85);
  garage.add(signBacking);

  const signBorder = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.78, 0.03), orangeStripeMat);
  signBorder.position.set(0, 3.2, -7.86);
  garage.add(signBorder);

  // Left wall high-pressure water spigot & utility box
  const utilityBox = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.35), girderMat);
  utilityBox.position.set(-7.88, 1.4, -2.5);
  garage.add(utilityBox);

  // --- 4. Structural Roof Girders & Overhead Lighting ---
  for (let gz = -5.5; gz <= 5.5; gz += 3.8) {
    const girder = new THREE.Mesh(new THREE.BoxGeometry(16, 0.22, 0.2), girderMat);
    girder.position.set(0, wallHeight - 0.12, gz);
    garage.add(girder);
  }

  // Dual Longitudinal LED Wash Luminaires (Directly overhead parallel to car)
  const lampPositions = [-1.4, 1.4];
  lampPositions.forEach((lx) => {
    const fixture = new THREE.Group();
    fixture.position.set(lx, wallHeight - 0.3, 0);

    const housing = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.1, 5.6), fixtureMat);
    fixture.add(housing);

    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 5.4), glowTubeMat);
    diffuser.position.y = -0.05;
    fixture.add(diffuser);

    garage.add(fixture);
  });

  return garage;
}
