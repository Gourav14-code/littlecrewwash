import * as THREE from 'three';

/**
 * Creates an anatomical stylized wash crew character placeholder.
 * Built with full hierarchical joint pivots (pelvis, spine, neck, shoulders, elbows, hips, knees)
 * so it can easily play procedural idle / walk animations or be swapped for a rigged GLB character.
 *
 * Height: ~1.74m
 */
export function createCharacter() {
  const root = new THREE.Group();
  root.name = 'WashCrewCharacter';

  // --- Materials ---
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xf3c59a,
    roughness: 0.65
  });

  const suitMat = new THREE.MeshStandardMaterial({
    color: 0xff6f28, // High-visibility wash crew orange jumpsuit
    roughness: 0.6
  });

  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x223344, // Navy blue utility work trousers
    roughness: 0.75
  });

  const bootsMat = new THREE.MeshStandardMaterial({
    color: 0x181e22, // Heavy-duty waterproof work boots
    roughness: 0.8
  });

  const gloveMat = new THREE.MeshStandardMaterial({
    color: 0xf4bc20, // Yellow waterproof rubber washing gloves
    roughness: 0.45
  });

  const capMat = new THREE.MeshStandardMaterial({
    color: 0x09528d, // Deep blue crew cap
    roughness: 0.6
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x3e2723,
    roughness: 0.9
  });

  // --- 1. Root Pelvis / Hips (Main anatomical root) ---
  const pelvis = new THREE.Group();
  pelvis.position.y = 0.92;
  root.add(pelvis);

  const hipsMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.24), pantsMat);
  hipsMesh.castShadow = true;
  pelvis.add(hipsMesh);

  // --- 2. Spine / Chest (Upper Torso) ---
  const spine = new THREE.Group();
  spine.position.y = 0.16;
  pelvis.add(spine);

  const chestMesh = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.42, 0.26), suitMat);
  chestMesh.position.y = 0.21;
  chestMesh.castShadow = true;
  spine.add(chestMesh);

  // Hi-vis safety reflective vest cross-stripe
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.08, 0.27),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
  );
  stripe.position.y = 0.26;
  spine.add(stripe);

  // --- 3. Neck & Head ---
  const neck = new THREE.Group();
  neck.position.y = 0.43;
  spine.add(neck);

  const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.24), skinMat);
  headMesh.position.y = 0.15;
  headMesh.castShadow = true;
  neck.add(headMesh);

  // Crew baseball cap
  const capCrown = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.26), capMat);
  capCrown.position.y = 0.26;
  neck.add(capCrown);

  const capVisor = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.025, 0.12), capMat);
  capVisor.position.set(0, 0.23, 0.16);
  neck.add(capVisor);

  // Stylized hair back & sides
  const hair = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.14, 0.06), hairMat);
  hair.position.set(0, 0.14, -0.11);
  neck.add(hair);

  // Stylized face goggles / safety glasses
  const goggleMat = new THREE.MeshStandardMaterial({ color: 0x4fc3f7, roughness: 0.1, metalness: 0.8 });
  const goggles = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.04), goggleMat);
  goggles.position.set(0, 0.17, 0.13);
  neck.add(goggles);

  // --- 4. Left Arm (Relaxed / Balance arm) ---
  const leftShoulder = new THREE.Group();
  leftShoulder.position.set(-0.28, 0.36, 0);
  spine.add(leftShoulder);

  const leftUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 0.14), suitMat);
  leftUpperArm.position.y = -0.12;
  leftUpperArm.castShadow = true;
  leftShoulder.add(leftUpperArm);

  const leftElbow = new THREE.Group();
  leftElbow.position.y = -0.24;
  leftShoulder.add(leftElbow);

  const leftForearm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.22, 0.13), suitMat);
  leftForearm.position.y = -0.11;
  leftForearm.castShadow = true;
  leftElbow.add(leftForearm);

  // Left rubber gloved hand (fingers + thumb)
  const leftHand = new THREE.Group();
  leftHand.position.y = -0.22;
  leftElbow.add(leftHand);

  const leftPalm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.08), gloveMat);
  leftPalm.position.y = -0.06;
  leftHand.add(leftPalm);

  // --- 5. Right Arm (Active washer-holding pose) ---
  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(0.28, 0.36, 0);
  // Reached forward and slightly inward aimed at car
  rightShoulder.rotation.set(-0.7, -0.25, 0.1);
  spine.add(rightShoulder);

  const rightUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 0.14), suitMat);
  rightUpperArm.position.y = -0.12;
  rightUpperArm.castShadow = true;
  rightShoulder.add(rightUpperArm);

  const rightElbow = new THREE.Group();
  rightElbow.position.y = -0.24;
  rightElbow.rotation.x = -0.45; // Forearm angled forward
  rightShoulder.add(rightElbow);

  const rightForearm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.22, 0.13), suitMat);
  rightForearm.position.y = -0.11;
  rightForearm.castShadow = true;
  rightElbow.add(rightForearm);

  // Right Hand (Molded gripping fingers & thumb for the spray gun handle)
  const rightHand = new THREE.Group();
  rightHand.position.y = -0.22;
  rightElbow.add(rightHand);

  const rightPalm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.11, 0.08), gloveMat);
  rightPalm.position.y = -0.055;
  rightHand.add(rightPalm);

  // Gripping fingers wrapped forward
  const rightFingers = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 0.06), gloveMat);
  rightFingers.position.set(0, -0.06, 0.06);
  rightHand.add(rightFingers);

  // Thumb gripping side
  const rightThumb = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.04), gloveMat);
  rightThumb.position.set(-0.06, -0.04, 0.03);
  rightHand.add(rightThumb);

  // --- 6. Left Leg (Hip -> Knee -> Ankle -> Boot) ---
  const leftHip = new THREE.Group();
  leftHip.position.set(-0.13, -0.1, 0);
  pelvis.add(leftHip);

  const leftThigh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.38, 0.18), pantsMat);
  leftThigh.position.y = -0.19;
  leftThigh.castShadow = true;
  leftHip.add(leftThigh);

  const leftKnee = new THREE.Group();
  leftKnee.position.y = -0.38;
  leftHip.add(leftKnee);

  const leftCalf = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.34, 0.16), pantsMat);
  leftCalf.position.y = -0.17;
  leftCalf.castShadow = true;
  leftKnee.add(leftCalf);

  const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.18, 0.26), bootsMat);
  leftBoot.position.set(0, -0.34, 0.04);
  leftBoot.castShadow = true;
  leftKnee.add(leftBoot);

  // --- 7. Right Leg (Slightly back in a stable washing stance) ---
  const rightHip = new THREE.Group();
  rightHip.position.set(0.13, -0.1, 0);
  rightHip.rotation.x = -0.08;
  pelvis.add(rightHip);

  const rightThigh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.38, 0.18), pantsMat);
  rightThigh.position.y = -0.19;
  rightThigh.castShadow = true;
  rightHip.add(rightThigh);

  const rightKnee = new THREE.Group();
  rightKnee.position.y = -0.38;
  rightHip.add(rightKnee);

  const rightCalf = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.34, 0.16), pantsMat);
  rightCalf.position.y = -0.17;
  rightCalf.castShadow = true;
  rightKnee.add(rightCalf);

  const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.18, 0.26), bootsMat);
  rightBoot.position.set(0, -0.34, 0.04);
  rightBoot.castShadow = true;
  rightKnee.add(rightBoot);

  // --- Animation Handles & Procedural Controller ---
  function updateAnimation(time, isMoving = false, isEquipped = true) {
    if (isMoving) {
      const walkCycle = time * 8.0;
      // Stride leg swing
      leftHip.rotation.x = Math.sin(walkCycle) * 0.55;
      rightHip.rotation.x = -Math.sin(walkCycle) * 0.55;

      // Knee bend on backward stride
      leftKnee.rotation.x = Math.max(0, -Math.sin(walkCycle) * 0.45);
      rightKnee.rotation.x = Math.max(0, Math.sin(walkCycle) * 0.45);

      // Pelvis vertical bounce
      pelvis.position.y = 0.92 + Math.abs(Math.sin(walkCycle)) * 0.04;

      // Arm swing
      leftShoulder.rotation.x = -Math.sin(walkCycle) * 0.4;
      if (isEquipped) {
        // Holding wand steadily with slight bounce
        rightShoulder.rotation.x = -0.7 + Math.sin(walkCycle) * 0.06;
      } else {
        rightShoulder.rotation.x = Math.sin(walkCycle) * 0.4;
      }
    } else {
      // Idle pose
      leftHip.rotation.x = THREE.MathUtils.lerp(leftHip.rotation.x, 0, 0.1);
      rightHip.rotation.x = THREE.MathUtils.lerp(rightHip.rotation.x, -0.08, 0.1);
      leftKnee.rotation.x = THREE.MathUtils.lerp(leftKnee.rotation.x, 0, 0.1);
      rightKnee.rotation.x = THREE.MathUtils.lerp(rightKnee.rotation.x, 0, 0.1);
      pelvis.position.y = THREE.MathUtils.lerp(pelvis.position.y, 0.92, 0.1);

      // Gentle breathing on spine
      spine.position.y = 0.16 + Math.sin(time * 2.0) * 0.005;
      spine.rotation.x = Math.sin(time * 2.0) * 0.015;

      // Subtle wand stabilization sway in right arm
      if (isEquipped) {
        rightShoulder.rotation.x = -0.7 + Math.sin(time * 1.5) * 0.02;
        rightShoulder.rotation.z = 0.1 + Math.cos(time * 1.5) * 0.015;
      } else {
        rightShoulder.rotation.x = THREE.MathUtils.lerp(rightShoulder.rotation.x, 0, 0.1);
        rightShoulder.rotation.z = THREE.MathUtils.lerp(rightShoulder.rotation.z, 0, 0.1);
      }

      // Relaxed left arm subtle swing
      leftShoulder.rotation.x = Math.cos(time * 1.8) * 0.03;
    }
  }

  root.userData = {
    pelvis,
    spine,
    neck,
    leftShoulder,
    rightShoulder,
    rightHand,
    leftHip,
    rightHip,
    leftKnee,
    rightKnee,
    eyeHeight: 1.62,
    updateAnimation
  };

  return root;
}
