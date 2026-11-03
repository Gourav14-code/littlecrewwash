import * as THREE from 'three';

/**
 * Creates a stylized human wash crew character placeholder.
 * Structured with hierarchical bones/limbs (head, torso, arms, legs) so it can
 * easily be swapped for a rigged GLB character later.
 */
export function createCharacter() {
  const character = new THREE.Group();
  character.name = 'PlayerCharacter';

  // Materials
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xf5cda7,
    roughness: 0.6
  });

  const crewSuitMat = new THREE.MeshStandardMaterial({
    color: 0xff6b35, // High-visibility wash crew orange
    roughness: 0.65
  });

  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x2b3a4a, // Navy work trousers
    roughness: 0.8
  });

  const bootsMat = new THREE.MeshStandardMaterial({
    color: 0x1f2421, // Black waterproof rubber work boots
    roughness: 0.7
  });

  const glovesMat = new THREE.MeshStandardMaterial({
    color: 0xffd166, // Yellow rubber washing gloves
    roughness: 0.5
  });

  const capMat = new THREE.MeshStandardMaterial({
    color: 0x004e89, // Deep blue crew baseball cap
    roughness: 0.7
  });

  // 1. Torso (Jacket / Chest)
  const torsoGroup = new THREE.Group();
  torsoGroup.position.y = 1.05;

  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.52, 0.28), crewSuitMat);
  chest.castShadow = true;
  torsoGroup.add(chest);

  // Crew vest badge/stripe
  const vestStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.49, 0.08, 0.29),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
  );
  vestStripe.position.y = 0.08;
  torsoGroup.add(vestStripe);

  character.add(torsoGroup);

  // 2. Head & Cap
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.55, 0);

  // Head mesh
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.28, 0.26), skinMat);
  head.castShadow = true;
  headGroup.add(head);

  // Cap crown
  const cap = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.29), capMat);
  cap.position.y = 0.12;
  headGroup.add(cap);

  // Cap visor (brim)
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 0.14), capMat);
  visor.position.set(0, 0.08, 0.18);
  headGroup.add(visor);

  // Stylized hair/sideburns
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x3d2314 });
  const hairBack = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.12, 0.05), hairMat);
  hairBack.position.set(0, 0.02, -0.12);
  headGroup.add(hairBack);

  character.add(headGroup);

  // 3. Arms & Hands
  // Left Arm (Relaxed at side)
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.34, 1.25, 0);

  const leftUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 0.16), crewSuitMat);
  leftUpperArm.position.y = -0.14;
  leftUpperArm.castShadow = true;
  leftArmGroup.add(leftUpperArm);

  const leftGlove = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.22, 0.15), glovesMat);
  leftGlove.position.y = -0.36;
  leftGlove.castShadow = true;
  leftArmGroup.add(leftGlove);

  character.add(leftArmGroup);

  // Right Arm (Forward angled, gripping the pressure wand)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.34, 1.25, 0);
  rightArmGroup.rotation.x = -Math.PI / 4; // Reaching forward
  rightArmGroup.rotation.y = -Math.PI / 10;

  const rightUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 0.16), crewSuitMat);
  rightUpperArm.position.y = -0.14;
  rightUpperArm.castShadow = true;
  rightArmGroup.add(rightUpperArm);

  const rightGlove = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.22, 0.15), glovesMat);
  rightGlove.position.y = -0.36;
  rightGlove.castShadow = true;
  rightArmGroup.add(rightGlove);

  character.add(rightArmGroup);

  // 4. Legs & Boots
  // Left Leg
  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-0.15, 0.78, 0);

  const leftPants = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.52, 0.22), pantsMat);
  leftPants.position.y = -0.26;
  leftPants.castShadow = true;
  leftLegGroup.add(leftPants);

  const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.2, 0.28), bootsMat);
  leftBoot.position.set(0, -0.62, 0.03);
  leftBoot.castShadow = true;
  leftLegGroup.add(leftBoot);

  character.add(leftLegGroup);

  // Right Leg
  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(0.15, 0.78, 0);

  const rightPants = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.52, 0.22), pantsMat);
  rightPants.position.y = -0.26;
  rightPants.castShadow = true;
  rightLegGroup.add(rightPants);

  const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.2, 0.28), bootsMat);
  rightBoot.position.set(0, -0.62, 0.03);
  rightBoot.castShadow = true;
  rightLegGroup.add(rightBoot);

  character.add(rightLegGroup);

  // Provide quick handles to character parts for animation/camera
  character.userData = {
    headGroup,
    rightArmGroup,
    torsoGroup,
    eyeHeight: 1.62
  };

  return character;
}
