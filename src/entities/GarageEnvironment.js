import * as THREE from 'three';

/**
 * Creates a stylized, recognizable auto wash bay and workshop garage environment.
 * All built with clean, low-draw-call procedural meshes.
 */
export function createGarage() {
  const garage = new THREE.Group();
  garage.name = 'GarageEnvironment';

  // --- Materials ---
  const floorConcreteMat = new THREE.MeshStandardMaterial({
    color: 0x4a5568, // Clean industrial grey concrete floor
    roughness: 0.5,
    metalness: 0.1
  });

  const bayTileMat = new THREE.MeshStandardMaterial({
    color: 0x2d3748, // Dark non-slip wash zone tile
    roughness: 0.4,
    metalness: 0.2
  });

  const hazardYellowMat = new THREE.MeshStandardMaterial({
    color: 0xf6ad55, // Safety yellow bay boundary lines
    roughness: 0.4
  });

  const drainGrateMat = new THREE.MeshStandardMaterial({
    color: 0x1a202c,
    roughness: 0.9,
    metalness: 0.4
  });

  const lowerWallMat = new THREE.MeshStandardMaterial({
    color: 0x2b4259, // Navy blue industrial lower wainscoting
    roughness: 0.7
  });

  const upperWallMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0, // Light off-white workshop upper wall
    roughness: 0.9
  });

  const trimStripeMat = new THREE.MeshStandardMaterial({
    color: 0xed8936, // Orange divider stripe
    roughness: 0.5
  });

  const steelGirderMat = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.6,
    metalness: 0.3
  });

  const lightHousingMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.8
  });

  const lightGlowMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfffaed,
    emissiveIntensity: 1.2,
    roughness: 0.1
  });

  // --- 1. Floor & Wash Bay Boundaries ---
  // Main floor
  const mainFloor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), floorConcreteMat);
  mainFloor.rotation.x = -Math.PI / 2;
  mainFloor.receiveShadow = true;
  garage.add(mainFloor);

  // Dedicated Wash Bay Platform (Non-slip inner zone)
  const washZone = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 6.2), bayTileMat);
  washZone.rotation.x = -Math.PI / 2;
  washZone.position.set(0, 0.005, 0);
  washZone.receiveShadow = true;
  garage.add(washZone);

  // Safety Yellow Bay Perimeter Lines (Clean stylized border, no raw grid)
  const lineThickness = 0.12;
  const bayW = 3.8;
  const bayL = 6.4;

  // Left stripe
  const stripeL = new THREE.Mesh(new THREE.PlaneGeometry(lineThickness, bayL), hazardYellowMat);
  stripeL.rotation.x = -Math.PI / 2;
  stripeL.position.set(-bayW / 2, 0.008, 0);
  garage.add(stripeL);

  // Right stripe
  const stripeR = stripeL.clone();
  stripeR.position.x = bayW / 2;
  garage.add(stripeR);

  // Front stripe
  const stripeF = new THREE.Mesh(new THREE.PlaneGeometry(bayW + lineThickness, lineThickness), hazardYellowMat);
  stripeF.rotation.x = -Math.PI / 2;
  stripeF.position.set(0, 0.008, bayL / 2);
  garage.add(stripeF);

  // Back stripe
  const stripeB = stripeF.clone();
  stripeB.position.z = -bayL / 2;
  garage.add(stripeB);

  // Center Slotted Drainage Trench (Under car center)
  const drainTrench = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 4.6), drainGrateMat);
  drainTrench.rotation.x = -Math.PI / 2;
  drainTrench.position.set(0, 0.009, 0);
  drainTrench.receiveShadow = true;
  garage.add(drainTrench);

  // Slotted grate bars
  const grateBarMat = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.5 });
  for (let z = -2.1; z <= 2.1; z += 0.35) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.015, 0.06), grateBarMat);
    bar.position.set(0, 0.012, z);
    garage.add(bar);
  }

  // --- 2. Walls (Back and Left) ---
  const wallH = 4.8;
  const wainscotH = 1.6;

  // Back Wall - Lower wainscot
  const backLower = new THREE.Mesh(new THREE.BoxGeometry(16, wainscotH, 0.3), lowerWallMat);
  backLower.position.set(0, wainscotH / 2, -8);
  backLower.receiveShadow = true;
  garage.add(backLower);

  // Back Wall - Accent orange stripe
  const backStripe = new THREE.Mesh(new THREE.BoxGeometry(16, 0.1, 0.32), trimStripeMat);
  backStripe.position.set(0, wainscotH + 0.05, -8);
  garage.add(backStripe);

  // Back Wall - Upper section
  const backUpper = new THREE.Mesh(new THREE.BoxGeometry(16, wallH - wainscotH - 0.1, 0.3), upperWallMat);
  backUpper.position.set(0, wainscotH + 0.1 + (wallH - wainscotH - 0.1) / 2, -8);
  backUpper.receiveShadow = true;
  garage.add(backUpper);

  // Left Wall - Lower wainscot
  const leftLower = new THREE.Mesh(new THREE.BoxGeometry(0.3, wainscotH, 16), lowerWallMat);
  leftLower.position.set(-8, wainscotH / 2, 0);
  leftLower.receiveShadow = true;
  garage.add(leftLower);

  // Left Wall - Accent stripe
  const leftStripe = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.1, 16), trimStripeMat);
  leftStripe.position.set(-8, wainscotH + 0.05, 0);
  garage.add(leftStripe);

  // Left Wall - Upper section
  const leftUpper = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallH - wainscotH - 0.1, 16), upperWallMat);
  leftUpper.position.set(-8, wainscotH + 0.1 + (wallH - wainscotH - 0.1) / 2, 0);
  leftUpper.receiveShadow = true;
  garage.add(leftUpper);

  // --- 3. Roof Steel Trusses & Girders ---
  for (let z = -6; z <= 6; z += 4) {
    // Cross beam
    const girder = new THREE.Mesh(new THREE.BoxGeometry(16, 0.22, 0.22), steelGirderMat);
    girder.position.set(0, wallH - 0.15, z);
    garage.add(girder);

    // Diagonal support brackets
    const bracketL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.08), steelGirderMat);
    bracketL.rotation.z = Math.PI / 4;
    bracketL.position.set(-7.5, wallH - 0.5, z);
    garage.add(bracketL);
  }

  // --- 4. Overhead Wash Lights (Fluorescent ceiling bars) ---
  const lightZPositions = [-3.0, 0, 3.0];
  lightZPositions.forEach((z) => {
    const fixtureGroup = new THREE.Group();
    fixtureGroup.position.set(0, wallH - 0.35, z);

    // Housing box
    const housing = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 0.35), lightHousingMat);
    fixtureGroup.add(housing);

    // Diffuser glow panel
    const glowTube = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.05, 0.25), lightGlowMat);
    glowTube.position.y = -0.06;
    fixtureGroup.add(glowTube);

    garage.add(fixtureGroup);
  });

  // --- 5. Workshop Props (Simple, recognizable procedural objects) ---
  // A. Red Mechanics Rolling Tool Cabinet
  const toolCabinet = new THREE.Group();
  const cabBodyMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.4 });
  const cabTrimMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 });

  const cabBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.55), cabBodyMat);
  cabBody.position.set(-6.5, 0.65, -6.8);
  cabBody.castShadow = true;
  toolCabinet.add(cabBody);

  // Drawer lines
  for (let dy = 0.3; dy <= 0.9; dy += 0.2) {
    const drawerLine = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.02, 0.02), cabTrimMat);
    drawerLine.position.set(-6.5, dy, -6.52);
    toolCabinet.add(drawerLine);
  }
  // Side handle
  const cabHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.25, 0.08), cabTrimMat);
  cabHandle.position.set(-6.02, 0.85, -6.8);
  toolCabinet.add(cabHandle);

  garage.add(toolCabinet);

  // B. Stacked Tires in Garage Corner
  const tireGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.24, 16);
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x1f2421, roughness: 0.9 });

  const tire1 = new THREE.Mesh(tireGeo, tireMat);
  tire1.position.set(-6.8, 0.12, -4.5);
  tire1.castShadow = true;
  const tire2 = new THREE.Mesh(tireGeo, tireMat);
  tire2.position.set(-6.8, 0.36, -4.5);
  tire2.castShadow = true;
  const tire3 = new THREE.Mesh(tireGeo, tireMat);
  tire3.position.set(-6.78, 0.6, -4.52);
  tire3.rotation.y = 0.3;
  tire3.castShadow = true;
  garage.add(tire1, tire2, tire3);

  // C. Industrial 55-Gallon Wash Soap Drum / Barrel
  const barrelMat = new THREE.MeshStandardMaterial({
    color: 0x1e88e5, // Blue chemical/soap drum
    roughness: 0.5,
    metalness: 0.2
  });
  const barrelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.95, 18);
  const soapBarrel = new THREE.Mesh(barrelGeo, barrelMat);
  soapBarrel.position.set(-6.8, 0.48, -2.5);
  soapBarrel.castShadow = true;
  garage.add(soapBarrel);

  // Barrel rim rings
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x0d47a1, roughness: 0.6 });
  const ringGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.03, 18);
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.position.set(-6.8, 0.72, -2.5);
  const ring2 = new THREE.Mesh(ringGeo, ringMat);
  ring2.position.set(-6.8, 0.24, -2.5);
  garage.add(ring1, ring2);

  // D. Garage Wall Hose Reel Bracket
  const reelMat = new THREE.MeshStandardMaterial({ color: 0xe53935 });
  const reelDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.25, 14), reelMat);
  reelDrum.rotation.z = Math.PI / 2;
  reelDrum.position.set(-7.72, 2.2, -1.0);
  garage.add(reelDrum);

  return garage;
}
