import * as THREE from 'three';

/**
 * Creates a stylized mobile pressure washer unit with a hose and ergonomic spray wand.
 */
export function createPressureWasher() {
  const washerGroup = new THREE.Group();
  washerGroup.name = 'PressureWasherSystem';

  // Materials
  const washerBodyMat = new THREE.MeshStandardMaterial({
    color: 0x00a896, // Industrial teal/cyan wash housing
    metalness: 0.1,
    roughness: 0.35
  });

  const washerAccentMat = new THREE.MeshStandardMaterial({
    color: 0xffd166, // Bright yellow cap/controls
    roughness: 0.4
  });

  const darkPlasticMat = new THREE.MeshStandardMaterial({
    color: 0x1d2d44,
    roughness: 0.8
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xcca43b,
    metalness: 0.85,
    roughness: 0.25
  });

  const hoseMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.7
  });

  // 1. Machine Base Cart
  const cartGroup = new THREE.Group();

  // Main vertical motor housing
  const motorHousing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.72, 0.42), washerBodyMat);
  motorHousing.position.y = 0.52;
  motorHousing.castShadow = true;
  cartGroup.add(motorHousing);

  // Top handle / roll bar
  const handleTop = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), darkPlasticMat);
  handleTop.position.set(0, 1.15, -0.15);
  cartGroup.add(handleTop);

  const handlePostL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.04), darkPlasticMat);
  handlePostL.position.set(-0.23, 0.95, -0.15);
  const handlePostR = handlePostL.clone();
  handlePostR.position.x = 0.23;
  cartGroup.add(handlePostL, handlePostR);

  // Pressure gauge & detergent dial
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 12), washerAccentMat);
  dial.rotation.x = Math.PI / 2;
  dial.position.set(0, 0.65, 0.22);
  cartGroup.add(dial);

  // Heavy duty transport wheels
  const wheelGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.08, 16);
  const wheelL = new THREE.Mesh(wheelGeo, darkPlasticMat);
  wheelL.rotation.z = Math.PI / 2;
  wheelL.position.set(-0.31, 0.16, -0.12);
  wheelL.castShadow = true;

  const wheelR = wheelL.clone();
  wheelR.position.x = 0.31;
  cartGroup.add(wheelL, wheelR);

  // Front stabilizer rubber feet
  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.08), darkPlasticMat);
  foot.position.set(-0.18, 0.06, 0.16);
  const footR = foot.clone();
  footR.position.x = 0.18;
  cartGroup.add(foot, footR);

  // Water hose outlet connector
  const outlet = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.08, 8), brassMat);
  outlet.rotation.x = Math.PI / 2;
  outlet.position.set(0, 0.32, 0.23);
  cartGroup.add(outlet);

  washerGroup.add(cartGroup);

  // 2. High-Pressure Spray Wand (Held in character's hand or positioned for wash)
  const wand = new THREE.Group();
  wand.name = 'SprayWand';

  // Handle & Trigger guard
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.18, 0.06), darkPlasticMat);
  grip.position.set(0, -0.05, 0);
  grip.castShadow = true;
  wand.add(grip);

  const trigger = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 0.03), washerAccentMat);
  trigger.position.set(0, -0.04, 0.05);
  wand.add(trigger);

  // Metal lance barrel
  const lance = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.65, 10), brassMat);
  lance.rotation.x = Math.PI / 2;
  lance.position.set(0, 0.04, 0.35);
  lance.castShadow = true;
  wand.add(lance);

  // Spray fan nozzle tip
  const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.06, 8), washerAccentMat);
  nozzle.rotation.x = -Math.PI / 2;
  nozzle.position.set(0, 0.04, 0.7);
  wand.add(nozzle);

  // Wand hose coupling
  const wandCoupler = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.06, 8), brassMat);
  wandCoupler.position.set(0, -0.16, 0);
  wand.add(wandCoupler);

  washerGroup.add(wand);

  // 3. Realistic Flexible High-Pressure Hose
  // Uses a 3D CatmullRomCurve3 connecting machine outlet to wand base
  function updateHose(machinePos, wandPos) {
    if (washerGroup.getObjectByName('FlexibleHose')) {
      const oldHose = washerGroup.getObjectByName('FlexibleHose');
      washerGroup.remove(oldHose);
      oldHose.geometry.dispose();
    }

    const start = new THREE.Vector3(machinePos.x, machinePos.y + 0.32, machinePos.z + 0.23);
    const end = new THREE.Vector3(wandPos.x, wandPos.y - 0.16, wandPos.z);
    const mid1 = new THREE.Vector3(
      start.x + (end.x - start.x) * 0.2,
      0.04, // drape to floor
      start.z + (end.z - start.z) * 0.2
    );
    const mid2 = new THREE.Vector3(
      start.x + (end.x - start.x) * 0.7,
      0.04, // along floor
      start.z + (end.z - start.z) * 0.7
    );

    const curve = new THREE.CatmullRomCurve3([start, mid1, mid2, end]);
    const hoseGeo = new THREE.TubeGeometry(curve, 24, 0.018, 6, false);
    const hoseMesh = new THREE.Mesh(hoseGeo, hoseMat);
    hoseMesh.name = 'FlexibleHose';
    hoseMesh.castShadow = true;
    washerGroup.add(hoseMesh);
  }

  washerGroup.userData = {
    cartGroup,
    wand,
    updateHose
  };

  return washerGroup;
}
