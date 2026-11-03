import * as THREE from 'three';

/**
 * Creates a stylized sedan placeholder using lightweight procedural geometry.
 * Well-proportioned dimensions: ~4.4m length, 1.85m width, 1.45m height.
 */
export function createCar() {
  const car = new THREE.Group();

  // Shared stylized materials
  const bodyPaintMat = new THREE.MeshStandardMaterial({
    color: 0x1976d2, // Vibrant stylized blue
    metalness: 0.25,
    roughness: 0.35
  });

  const bodyTrimMat = new THREE.MeshStandardMaterial({
    color: 0x151c24, // Dark bumper / undercarriage trim
    roughness: 0.8
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x212b36,
    metalness: 0.7,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.9
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xd0d5dd,
    metalness: 0.8,
    roughness: 0.2
  });

  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xfff8e1,
    emissive: 0xffecb3,
    emissiveIntensity: 0.8,
    roughness: 0.2
  });

  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0xd32f2f,
    emissive: 0xc62828,
    emissiveIntensity: 0.7,
    roughness: 0.2
  });

  // 1. Lower Chassis & Bumpers
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.45, 4.35), bodyPaintMat);
  chassis.position.y = 0.48;
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  car.add(chassis);

  // Front bumper trim
  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.22, 0.2), bodyTrimMat);
  frontBumper.position.set(0, 0.35, 2.15);
  frontBumper.castShadow = true;
  car.add(frontBumper);

  // Rear bumper trim
  const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.22, 0.2), bodyTrimMat);
  rearBumper.position.set(0, 0.35, -2.15);
  rearBumper.castShadow = true;
  car.add(rearBumper);

  // 2. Bonnet (Hood)
  const bonnet = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.18, 1.25), bodyPaintMat);
  bonnet.position.set(0, 0.76, 1.45);
  bonnet.rotation.x = 0.05; // slight forward slope
  bonnet.castShadow = true;
  car.add(bonnet);

  // 3. Cabin & Roof (Stylized greenhouse)
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.58, 2.05), glassMat);
  cabin.position.set(0, 1.05, -0.15);
  cabin.castShadow = true;
  car.add(cabin);

  // Roof panel
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.08, 1.65), bodyPaintMat);
  roof.position.set(0, 1.36, -0.22);
  roof.castShadow = true;
  car.add(roof);

  // Windshield pillars (A-pillars)
  const aPillarL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.08), bodyPaintMat);
  aPillarL.position.set(-0.78, 1.02, 0.72);
  aPillarL.rotation.x = -0.45;
  car.add(aPillarL);

  const aPillarR = aPillarL.clone();
  aPillarR.position.x = 0.78;
  car.add(aPillarR);

  // Rear pillars (C-pillars)
  const cPillarL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.16), bodyPaintMat);
  cPillarL.position.set(-0.78, 1.05, -1.05);
  cPillarL.rotation.x = 0.38;
  car.add(cPillarL);

  const cPillarR = cPillarL.clone();
  cPillarR.position.x = 0.78;
  car.add(cPillarR);

  // 4. Trunk (Boot)
  const trunk = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.22, 0.95), bodyPaintMat);
  trunk.position.set(0, 0.74, -1.65);
  trunk.castShadow = true;
  car.add(trunk);

  // 5. Doors & Side Windows Indentation (Visual Door Trim)
  const doorLineMat = new THREE.MeshBasicMaterial({ color: 0x0d47a1 });
  // Left door seam
  const doorSeamL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.52, 0.02), doorLineMat);
  doorSeamL.position.set(-0.92, 0.52, -0.15);
  car.add(doorSeamL);

  // Right door seam
  const doorSeamR = doorSeamL.clone();
  doorSeamR.position.x = 0.92;
  car.add(doorSeamR);

  // Door handles
  const handleGeo = new THREE.BoxGeometry(0.04, 0.03, 0.14);
  const handleMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
  const handleFL = new THREE.Mesh(handleGeo, handleMat);
  handleFL.position.set(-0.925, 0.65, 0.35);
  const handleRL = new THREE.Mesh(handleGeo, handleMat);
  handleRL.position.set(-0.925, 0.65, -0.65);
  const handleFR = new THREE.Mesh(handleGeo, handleMat);
  handleFR.position.set(0.925, 0.65, 0.35);
  const handleRR = new THREE.Mesh(handleGeo, handleMat);
  handleRR.position.set(0.925, 0.65, -0.65);
  car.add(handleFL, handleRL, handleFR, handleRR);

  // Side mirrors
  const mirrorGeo = new THREE.BoxGeometry(0.16, 0.1, 0.08);
  const mirrorL = new THREE.Mesh(mirrorGeo, bodyPaintMat);
  mirrorL.position.set(-0.92, 0.88, 0.72);
  const mirrorR = new THREE.Mesh(mirrorGeo, bodyPaintMat);
  mirrorR.position.set(0.92, 0.88, 0.72);
  car.add(mirrorL, mirrorR);

  // 6. Lights
  // Headlights
  const headlightGeo = new THREE.BoxGeometry(0.32, 0.12, 0.06);
  const headL = new THREE.Mesh(headlightGeo, headlightMat);
  headL.position.set(-0.64, 0.55, 2.18);
  const headR = new THREE.Mesh(headlightGeo, headlightMat);
  headR.position.set(0.64, 0.55, 2.18);
  car.add(headL, headR);

  // Grille
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.14, 0.04), bodyTrimMat);
  grille.position.set(0, 0.53, 2.19);
  car.add(grille);

  // Taillights
  const taillightGeo = new THREE.BoxGeometry(0.34, 0.12, 0.06);
  const tailL = new THREE.Mesh(taillightGeo, taillightMat);
  tailL.position.set(-0.64, 0.58, -2.18);
  const tailR = new THREE.Mesh(taillightGeo, taillightMat);
  tailR.position.set(0.64, 0.58, -2.18);
  car.add(tailL, tailR);

  // License plates
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const plateGeo = new THREE.BoxGeometry(0.36, 0.12, 0.02);
  const plateF = new THREE.Mesh(plateGeo, plateMat);
  plateF.position.set(0, 0.35, 2.25);
  const plateR = new THREE.Mesh(plateGeo, plateMat);
  plateR.position.set(0, 0.42, -2.25);
  car.add(plateF, plateR);

  // 7. Wheels & Rims
  const wheelPositions = [
    [-0.92, 0.32, 1.32],
    [0.92, 0.32, 1.32],
    [-0.92, 0.32, -1.35],
    [0.92, 0.32, -1.35]
  ];

  const tireGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 20);
  const rimGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.23, 14);

  wheelPositions.forEach(([x, y, z]) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(x, y, z);

    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);

    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // Hubcap center nut
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.24, 8), bodyTrimMat);
    hub.rotation.z = Math.PI / 2;
    wheelGroup.add(hub);

    car.add(wheelGroup);
  });

  return car;
}
