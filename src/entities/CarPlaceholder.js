import * as THREE from 'three';

/**
 * Creates an unmistakable stylized four-door sedan using clean low-poly geometry.
 * Follows the classic "three-box" automotive silhouette:
 * 1. Low elongated bonnet (engine bay)
 * 2. Sloped passenger cabin (windshield, roof, rear window)
 * 3. Stepped horizontal rear trunk (boot)
 *
 * Dimensions: 4.45m length, 1.80m width, 1.40m height, ground clearance ~0.2m.
 */
export function createCar() {
  const car = new THREE.Group();
  car.name = 'SedanCar';

  // --- Stylized Materials ---
  const bodyPaintMat = new THREE.MeshStandardMaterial({
    color: 0x1d63b8, // Crisp classic automotive blue
    metalness: 0.35,
    roughness: 0.3
  });

  const bodyUndertrimMat = new THREE.MeshStandardMaterial({
    color: 0x161c24, // Dark grey rocker panels and lower lip
    roughness: 0.8
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x1a2530, // Deep tinted automotive glass
    metalness: 0.65,
    roughness: 0.15,
    transparent: true,
    opacity: 0.88
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x1e1e1e, // Matte rubber tire
    roughness: 0.95
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xdde2ea, // Silver five-spoke alloy rim
    metalness: 0.75,
    roughness: 0.25
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.9,
    roughness: 0.1
  });

  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xfffaed,
    emissive: 0xfff3d6,
    emissiveIntensity: 0.9,
    roughness: 0.2
  });

  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0xe53935,
    emissive: 0xd32f2f,
    emissiveIntensity: 0.8,
    roughness: 0.2
  });

  const mirrorMat = new THREE.MeshStandardMaterial({
    color: 0x134882,
    roughness: 0.4
  });

  // --- 1. Lower Chassis & Floorpan (Sits low to ground like a real sedan) ---
  const chassisBase = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.32, 4.35), bodyPaintMat);
  chassisBase.position.y = 0.44;
  chassisBase.castShadow = true;
  chassisBase.receiveShadow = true;
  car.add(chassisBase);

  // Dark lower rocker sill trim
  const rockerTrim = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.14, 4.36), bodyUndertrimMat);
  rockerTrim.position.y = 0.26;
  rockerTrim.castShadow = true;
  car.add(rockerTrim);

  // --- 2. Box 1: Low Elongated Front Bonnet (Engine Bay) ---
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.18, 1.42), bodyPaintMat);
  hood.position.set(0, 0.68, 1.44);
  hood.rotation.x = 0.045; // Gentle aerodynamic slope
  hood.castShadow = true;
  car.add(hood);

  // Front bumper & grille assembly
  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.26, 0.2), bodyPaintMat);
  frontBumper.position.set(0, 0.42, 2.18);
  frontBumper.castShadow = true;
  car.add(frontBumper);

  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.14, 0.05), bodyUndertrimMat);
  grille.position.set(0, 0.46, 2.29);
  car.add(grille);

  // Chrome grille badge
  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.06), chromeMat);
  badge.position.set(0, 0.46, 2.31);
  car.add(badge);

  // Front air intake lower slot
  const lowerGrille = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 0.05), bodyUndertrimMat);
  lowerGrille.position.set(0, 0.32, 2.29);
  car.add(lowerGrille);

  // --- 3. Box 2: Passenger Cabin (Greenhouse with clear sedan proportions) ---
  // Windshield (raked back from hood)
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.48, 0.62), glassMat);
  windshield.position.set(0, 0.94, 0.62);
  windshield.rotation.x = -0.68; // ~39 degree rake angle
  windshield.castShadow = true;
  car.add(windshield);

  // Cabin side windows & main greenhouse
  const cabinCore = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.52, 1.65), glassMat);
  cabinCore.position.set(0, 0.98, -0.22);
  cabinCore.castShadow = true;
  car.add(cabinCore);

  // Sedan Roof Panel
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.06, 1.48), bodyPaintMat);
  roof.position.set(0, 1.25, -0.24);
  roof.castShadow = true;
  car.add(roof);

  // Rear Window (slopes down toward trunk)
  const rearWindow = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.44, 0.58), glassMat);
  rearWindow.position.set(0, 0.95, -1.08);
  rearWindow.rotation.x = 0.65; // ~37 degree rake angle
  rearWindow.castShadow = true;
  car.add(rearWindow);

  // B-Pillars (Center door dividers between front and rear passenger doors)
  const bPillarL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.1), bodyUndertrimMat);
  bPillarL.position.set(-0.82, 0.98, -0.22);
  car.add(bPillarL);

  const bPillarR = bPillarL.clone();
  bPillarR.position.x = 0.82;
  car.add(bPillarR);

  // --- 4. Box 3: Distinct Stepped Rear Trunk (Boot) ---
  // Notice the distinct horizontal step-down from rear glass to the trunk deck lid!
  const trunkLid = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.16, 0.98), bodyPaintMat);
  trunkLid.position.set(0, 0.72, -1.68);
  trunkLid.rotation.x = -0.02; // Flat horizontal sedan trunk deck
  trunkLid.castShadow = true;
  car.add(trunkLid);

  // Rear bumper
  const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.28, 0.22), bodyPaintMat);
  rearBumper.position.set(0, 0.43, -2.18);
  rearBumper.castShadow = true;
  car.add(rearBumper);

  // --- 5. Four Doors (Front & Rear Door Shutlines and Handles) ---
  const handleGeo = new THREE.BoxGeometry(0.04, 0.035, 0.12);
  const handleMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });

  // Left Front Door Handle
  const handleFL = new THREE.Mesh(handleGeo, handleMat);
  handleFL.position.set(-0.89, 0.65, 0.28);
  // Left Rear Door Handle
  const handleRL = new THREE.Mesh(handleGeo, handleMat);
  handleRL.position.set(-0.89, 0.65, -0.68);
  // Right Front Door Handle
  const handleFR = new THREE.Mesh(handleGeo, handleMat);
  handleFR.position.set(0.89, 0.65, 0.28);
  // Right Rear Door Handle
  const handleRR = new THREE.Mesh(handleGeo, handleMat);
  handleRR.position.set(0.89, 0.65, -0.68);
  car.add(handleFL, handleRL, handleFR, handleRR);

  // Door vertical shutlines (cut seams)
  const lineMat = new THREE.MeshBasicMaterial({ color: 0x0f366b });
  // Front door cut
  const cutFL = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.46, 0.015), lineMat);
  cutFL.position.set(-0.885, 0.47, 0.68);
  // Center B-pillar cut
  const cutML = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.46, 0.015), lineMat);
  cutML.position.set(-0.885, 0.47, -0.22);
  // Rear door cut
  const cutRL = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.46, 0.015), lineMat);
  cutRL.position.set(-0.885, 0.47, -1.14);

  const cutFR = cutFL.clone(); cutFR.position.x = 0.885;
  const cutMR = cutML.clone(); cutMR.position.x = 0.885;
  const cutRR = cutRL.clone(); cutRR.position.x = 0.885;
  car.add(cutFL, cutML, cutRL, cutFR, cutMR, cutRR);

  // Aerodynamic side mirrors
  const mirrorL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.07), mirrorMat);
  mirrorL.position.set(-0.92, 0.82, 0.62);
  const mirrorR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.07), mirrorMat);
  mirrorR.position.set(0.92, 0.82, 0.62);
  car.add(mirrorL, mirrorR);

  // --- 6. Lights & Plates ---
  // Headlights (sleek trapezoidal shape)
  const headGeo = new THREE.BoxGeometry(0.32, 0.11, 0.06);
  const headL = new THREE.Mesh(headGeo, headlightMat);
  headL.position.set(-0.62, 0.54, 2.22);
  const headR = new THREE.Mesh(headGeo, headlightMat);
  headR.position.set(0.62, 0.54, 2.22);
  car.add(headL, headR);

  // Taillights (horizontal sedan bar)
  const tailGeo = new THREE.BoxGeometry(0.42, 0.1, 0.06);
  const tailL = new THREE.Mesh(tailGeo, taillightMat);
  tailL.position.set(-0.58, 0.62, -2.2);
  const tailR = new THREE.Mesh(tailGeo, taillightMat);
  tailR.position.set(0.58, 0.62, -2.2);
  car.add(tailL, tailR);

  // License plates
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.5 });
  const plateGeo = new THREE.BoxGeometry(0.38, 0.12, 0.02);
  const plateF = new THREE.Mesh(plateGeo, plateMat);
  plateF.position.set(0, 0.36, 2.29);
  const plateR = new THREE.Mesh(plateGeo, plateMat);
  plateR.position.set(0, 0.44, -2.3);
  car.add(plateF, plateR);

  // Exhaust pipe
  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 12), chromeMat);
  exhaust.rotation.x = Math.PI / 2;
  exhaust.position.set(0.62, 0.22, -2.22);
  car.add(exhaust);

  // --- 7. Sedan Wheels (Lower profile sports sedan wheels) ---
  const wheelPositions = [
    [-0.88, 0.28, 1.34],
    [0.88, 0.28, 1.34],
    [-0.88, 0.28, -1.36],
    [0.88, 0.28, -1.36]
  ];

  const tireGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.2, 22);
  const rimGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.21, 16);
  const spokeGeo = new THREE.BoxGeometry(0.34, 0.04, 0.22);

  wheelPositions.forEach(([x, y, z]) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(x, y, z);

    // Tire
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Rim
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // 5-Spoke stylized detail
    const spoke1 = new THREE.Mesh(spokeGeo, chromeMat);
    spoke1.rotation.y = Math.PI / 2;
    const spoke2 = spoke1.clone();
    spoke2.rotation.x = Math.PI / 3;
    wheelGroup.add(spoke1, spoke2);

    car.add(wheelGroup);
  });

  return car;
}
