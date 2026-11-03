import * as THREE from 'three';

/**
 * Creates an unmistakable stylized mobile pressure washer system:
 * 1. Mobile electric pump cart with tall transport handle, rugged wheels, power cord wrap, and detergent bottle.
 * 2. Handheld spray gun with ergonomic pistol grip, distinct trigger & guard, metal lance tube, and fan spray nozzle.
 * 3. Smooth high-pressure flexible black rubber hose linking machine outlet to spray gun inlet.
 */
export function createPressureWasher() {
  const system = new THREE.Group();
  system.name = 'PressureWasherSystem';

  // --- Materials ---
  const housingMat = new THREE.MeshStandardMaterial({
    color: 0x009688, // Professional industrial teal-green
    roughness: 0.35,
    metalness: 0.15
  });

  const housingAccentMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // High-contrast safety yellow accents/dials
    roughness: 0.4
  });

  const blackRubberMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.85
  });

  const triggerMat = new THREE.MeshStandardMaterial({
    color: 0xef4444, // Bright red safety trigger
    roughness: 0.3
  });

  const metalLanceMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8, // Stainless steel extension lance
    metalness: 0.85,
    roughness: 0.2
  });

  const brassCouplerMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Brass quick-connect fittings
    metalness: 0.9,
    roughness: 0.25
  });

  const soapBottleMat = new THREE.MeshStandardMaterial({
    color: 0xe0f2fe, // Translucent detergent tank
    transparent: true,
    opacity: 0.85,
    roughness: 0.2
  });

  // --- 1. Machine Cart Base ---
  const cart = new THREE.Group();
  cart.name = 'WasherCart';

  // Main vertical motor chassis
  const motorBody = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.68, 0.38), housingMat);
  motorBody.position.y = 0.52;
  motorBody.castShadow = true;
  cart.add(motorBody);

  // Louvered air vents on front
  const ventMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
  for (let vy = 0.42; vy <= 0.66; vy += 0.08) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.03, 0.02), ventMat);
    vent.position.set(0, vy, 0.195);
    cart.add(vent);
  }

  // Pressure adjustment rotary dial
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16), housingAccentMat);
  dial.rotation.x = Math.PI / 2;
  dial.position.set(0, 0.74, 0.195);
  cart.add(dial);

  // Detergent wash tank bottle mounted on back
  const soapTank = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.35, 14), soapBottleMat);
  soapTank.position.set(0, 0.45, -0.22);
  soapTank.castShadow = true;
  cart.add(soapTank);

  // Tall tubular transport pull-handle
  const handleTop = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.04, 0.04), blackRubberMat);
  handleTop.position.set(0, 1.18, -0.16);
  cart.add(handleTop);

  const handlePostL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.52, 0.035), blackRubberMat);
  handlePostL.position.set(-0.2, 0.92, -0.16);
  const handlePostR = handlePostL.clone();
  handlePostR.position.x = 0.2;
  cart.add(handlePostL, handlePostR);

  // Rugged transport wheels
  const wheelGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.07, 18);
  const wheelL = new THREE.Mesh(wheelGeo, blackRubberMat);
  wheelL.rotation.z = Math.PI / 2;
  wheelL.position.set(-0.28, 0.15, -0.1);
  wheelL.castShadow = true;

  const wheelR = wheelL.clone();
  wheelR.position.x = 0.28;
  cart.add(wheelL, wheelR);

  // Wheel center hubcaps
  const hubL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 12), housingAccentMat);
  hubL.rotation.z = Math.PI / 2;
  hubL.position.set(-0.28, 0.15, -0.1);
  const hubR = hubL.clone();
  hubR.position.x = 0.28;
  cart.add(hubL, hubR);

  // Front rubber stabilizer pad
  const standFoot = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.08), blackRubberMat);
  standFoot.position.set(0, 0.04, 0.14);
  cart.add(standFoot);

  // Lower Brass High-Pressure Water Outlet
  const waterOutlet = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 10), brassCouplerMat);
  waterOutlet.rotation.x = Math.PI / 2;
  waterOutlet.position.set(0, 0.26, 0.21);
  cart.add(waterOutlet);

  system.add(cart);

  // --- 2. Handheld Pressure Spray Gun ---
  const gun = new THREE.Group();
  gun.name = 'SprayGun';

  // Ergonomic Pistol Grip
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.065), blackRubberMat);
  grip.position.set(0, -0.06, 0);
  grip.rotation.x = 0.15; // Natural angled grip
  grip.castShadow = true;
  gun.add(grip);

  // Trigger Guard (Protective loop around trigger)
  const guard = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.02), blackRubberMat);
  guard.position.set(0, -0.04, 0.07);
  gun.add(guard);

  // Bright Red Trigger Lever (Visible inside guard)
  const trigger = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.07, 0.025), triggerMat);
  trigger.position.set(0, -0.03, 0.045);
  gun.add(trigger);

  // Gun Body & Chamber
  const chamber = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.07, 0.22), blackRubberMat);
  chamber.position.set(0, 0.05, 0.06);
  chamber.castShadow = true;
  gun.add(chamber);

  // Stainless Steel Extension Lance (Barrel)
  const lance = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.72, 12), metalLanceMat);
  lance.rotation.x = Math.PI / 2;
  lance.position.set(0, 0.05, 0.52);
  lance.castShadow = true;
  gun.add(lance);

  // Brass Quick-Connect Coupler at nozzle base
  const nozzleCoupler = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.06, 12), brassCouplerMat);
  nozzleCoupler.rotation.x = Math.PI / 2;
  nozzleCoupler.position.set(0, 0.05, 0.88);
  gun.add(nozzleCoupler);

  // Fan Spray Nozzle Tip (With colored high-pressure protective cap)
  const nozzleTip = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.07, 8), housingAccentMat);
  nozzleTip.rotation.x = -Math.PI / 2;
  nozzleTip.position.set(0, 0.05, 0.94);
  gun.add(nozzleTip);

  // Hose Inlet Coupler at bottom of grip
  const hoseInlet = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.05, 10), brassCouplerMat);
  hoseInlet.position.set(0, -0.17, -0.01);
  gun.add(hoseInlet);

  system.add(gun);

  // --- 3. Dynamic Flexible Rubber Hose ---
  const hoseMaterial = new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.8,
    metalness: 0.1
  });

  function updateHose(machineWorldPos, gunWorldPos) {
    if (system.getObjectByName('WasherHose')) {
      const existing = system.getObjectByName('WasherHose');
      system.remove(existing);
      existing.geometry.dispose();
    }

    const pStart = new THREE.Vector3(
      machineWorldPos.x,
      machineWorldPos.y + 0.26,
      machineWorldPos.z + 0.21
    );

    const pEnd = new THREE.Vector3(
      gunWorldPos.x,
      gunWorldPos.y - 0.17,
      gunWorldPos.z - 0.01
    );

    // Realistic floor drape: hose dips down smoothly to the ground
    const pDrape1 = new THREE.Vector3(
      pStart.x + (pEnd.x - pStart.x) * 0.25,
      0.03, // Resting on wash bay floor
      pStart.z + (pEnd.z - pStart.z) * 0.15
    );

    const pDrape2 = new THREE.Vector3(
      pStart.x + (pEnd.x - pStart.x) * 0.75,
      0.03, // Along floor
      pStart.z + (pEnd.z - pStart.z) * 0.7
    );

    const curve = new THREE.CatmullRomCurve3([pStart, pDrape1, pDrape2, pEnd]);
    const hoseGeo = new THREE.TubeGeometry(curve, 28, 0.016, 8, false);
    const hoseMesh = new THREE.Mesh(hoseGeo, hoseMaterial);
    hoseMesh.name = 'WasherHose';
    hoseMesh.castShadow = true;
    system.add(hoseMesh);
  }

  system.userData = {
    cart,
    gun,
    updateHose
  };

  return system;
}
