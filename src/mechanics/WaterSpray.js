import * as THREE from 'three';

/**
 * High-pressure water spray jet with particle stream and surface collision detection.
 * Optimized for integrated graphics using a single lightweight InstancedMesh.
 */
export function createWaterSpray(scene, collidableObjects = []) {
  const PARTICLE_COUNT = 140;
  const sprayGroup = new THREE.Group();
  sprayGroup.name = 'WaterSpraySystem';

  let isSpraying = false;

  // Single droplet geometry & material
  const dropGeo = new THREE.CylinderGeometry(0.008, 0.016, 0.08, 6);
  dropGeo.rotateX(Math.PI / 2); // Orient forward

  const dropMat = new THREE.MeshBasicMaterial({
    color: 0x93c5fd, // Stylized water blue-white
    transparent: true,
    opacity: 0.8
  });

  const particleMesh = new THREE.InstancedMesh(dropGeo, dropMat, PARTICLE_COUNT);
  particleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  particleMesh.frustumCulled = false;
  sprayGroup.add(particleMesh);

  // Splash ring on surface hit
  const splashRingGeo = new THREE.RingGeometry(0.03, 0.14, 16);
  const splashRingMat = new THREE.MeshBasicMaterial({
    color: 0xdbeafe,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
  });
  const splashRing = new THREE.Mesh(splashRingGeo, splashRingMat);
  splashRing.visible = false;
  sprayGroup.add(splashRing);

  // Particle simulation pool
  const particles = [];
  const dummy = new THREE.Object3D();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      position: new THREE.Vector3(0, -999, 0),
      velocity: new THREE.Vector3(),
      life: 0,
      maxLife: 0.28 + Math.random() * 0.12,
      active: false
    });
  }

  // Raycaster for surface impact
  const raycaster = new THREE.Raycaster();
  let latestHit = null;

  function startSpray() {
    isSpraying = true;
  }

  function stopSpray() {
    isSpraying = false;
    splashRing.visible = false;
    latestHit = null;
    // Hide all particles immediately
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles[i].active = false;
      dummy.position.set(0, -999, 0);
      dummy.scale.set(0, 0, 0);
      dummy.updateMatrix();
      particleMesh.setMatrixAt(i, dummy.matrix);
    }
    particleMesh.instanceMatrix.needsUpdate = true;
  }

  let spawnTimer = 0;

  function update(delta, nozzleOrigin, nozzleDirection) {
    if (!nozzleOrigin || !nozzleDirection) return;

    // 1. Raycast forward to find exact water impact point
    raycaster.set(nozzleOrigin, nozzleDirection);
    raycaster.far = 8.0;
    const intersects = raycaster.intersectObjects(collidableObjects, true);

    let maxDistance = 7.5;
    if (intersects.length > 0) {
      latestHit = intersects[0];
      maxDistance = intersects[0].distance;

      // Position splash ring at impact
      if (isSpraying) {
        splashRing.visible = true;
        splashRing.position.copy(intersects[0].point).addScaledVector(intersects[0].face.normal, 0.01);
        splashRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), intersects[0].face.normal);
        const pulse = 1.0 + Math.sin(performance.now() * 0.03) * 0.2;
        splashRing.scale.set(pulse, pulse, pulse);
      } else {
        splashRing.visible = false;
      }
    } else {
      latestHit = null;
      splashRing.visible = false;
    }

    // 2. Spawn new water droplets
    if (isSpraying) {
      spawnTimer += delta;
      const spawnInterval = 0.005; // 200 drops/sec
      while (spawnTimer >= spawnInterval) {
        spawnTimer -= spawnInterval;

        // Find inactive droplet
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const p = particles[i];
          if (!p.active) {
            p.active = true;
            p.life = 0;
            p.position.copy(nozzleOrigin);

            // Subtle cone spread
            const spreadAngle = 0.04;
            const spreadX = (Math.random() - 0.5) * spreadAngle;
            const spreadY = (Math.random() - 0.5) * spreadAngle;

            p.velocity.copy(nozzleDirection);
            p.velocity.x += spreadX;
            p.velocity.y += spreadY;
            p.velocity.normalize().multiplyScalar(24.0 + Math.random() * 4.0); // High-pressure speed (24 m/s)
            break;
          }
        }
      }
    }

    // 3. Update existing droplets
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      if (p.active) {
        p.life += delta;
        p.position.addScaledVector(p.velocity, delta);

        // Check if particle reached max life or hit obstacle
        const distFromOrigin = p.position.distanceTo(nozzleOrigin);
        if (p.life >= p.maxLife || distFromOrigin >= maxDistance) {
          p.active = false;
          dummy.position.set(0, -999, 0);
          dummy.scale.set(0, 0, 0);
        } else {
          dummy.position.copy(p.position);
          dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), p.velocity.clone().normalize());
          // Taper droplet size over distance
          const scale = Math.max(0.4, 1.0 - (distFromOrigin / maxDistance) * 0.5);
          dummy.scale.set(scale, scale, 1.2 * scale);
        }
      } else {
        dummy.position.set(0, -999, 0);
        dummy.scale.set(0, 0, 0);
      }
      dummy.updateMatrix();
      particleMesh.setMatrixAt(i, dummy.matrix);
    }

    particleMesh.instanceMatrix.needsUpdate = true;
  }

  scene.add(sprayGroup);

  return {
    sprayGroup,
    startSpray,
    stopSpray,
    update,
    isSpraying: () => isSpraying,
    getHitInfo: () => latestHit
  };
}
