/**
 * Three.js 3D Ice Cream Cone Scene
 * Interactive, floating, draggable 3D ice cream with waffle cone,
 * organic scoops, glossy cherry, sprinkles, and studio lighting.
 */

(function () {
  const container = document.getElementById('three-canvas-container');
  if (!container) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  
  const width = container.clientWidth || 450;
  const height = container.clientHeight || 500;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0.8, 6.2);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Group for the entire ice cream model
  const iceCreamGroup = new THREE.Group();
  scene.add(iceCreamGroup);

  // -------------------------------------------------------------
  // Lighting Setup (Studio Pastel Aesthetic)
  // -------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xfffdf9, 0.85);
  scene.add(ambientLight);

  // Key Light
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(4, 8, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  scene.add(keyLight);

  // Rim Light - Strawberry Pink
  const rimLightPink = new THREE.DirectionalLight(0xff85a1, 0.7);
  rimLightPink.position.set(-5, -2, -3);
  scene.add(rimLightPink);

  // Rim Light - Mint Green
  const rimLightMint = new THREE.DirectionalLight(0x70e4d5, 0.65);
  rimLightMint.position.set(5, -3, -2);
  scene.add(rimLightMint);

  // Soft Front Fill
  const fillLight = new THREE.PointLight(0xfff5e6, 0.5, 10);
  fillLight.position.set(0, 2, 4);
  scene.add(fillLight);

  // -------------------------------------------------------------
  // Procedural Waffle Cone Texture
  // -------------------------------------------------------------
  function createWaffleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base warm waffle gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#f5b041');
    grad.addColorStop(0.5, '#e58e26');
    grad.addColorStop(1, '#d35400');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Waffle cross-hatch diamond grid
    ctx.strokeStyle = '#ba4a00';
    ctx.lineWidth = 6;
    const spacing = 32;

    for (let x = -512; x < 1024; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 512, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + 512, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }

    // Subtle waffle cell highlights
    ctx.strokeStyle = 'rgba(255, 235, 180, 0.35)';
    ctx.lineWidth = 2;
    for (let x = -512; x < 1024; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x + 3, 0);
      ctx.lineTo(x + 515, 512);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 3);
    return texture;
  }

  const waffleTexture = createWaffleTexture();

  // -------------------------------------------------------------
  // 1. Waffle Cone Mesh
  // -------------------------------------------------------------
  const coneRadius = 1.15;
  const coneHeight = 2.6;
  const coneGeom = new THREE.ConeGeometry(coneRadius, coneHeight, 32, 16, true);
  // Flip cone so apex points down
  coneGeom.rotateX(Math.PI);

  const coneMat = new THREE.MeshStandardMaterial({
    map: waffleTexture,
    roughness: 0.75,
    metalness: 0.05,
    bumpMap: waffleTexture,
    bumpScale: 0.06
  });

  const coneMesh = new THREE.Mesh(coneGeom, coneMat);
  coneMesh.position.y = -0.9;
  coneMesh.castShadow = true;
  coneMesh.receiveShadow = true;
  iceCreamGroup.add(coneMesh);

  // Waffle Collar / Rim (Rolled waffle wafer rim)
  const collarGeom = new THREE.TorusGeometry(coneRadius * 0.98, 0.12, 16, 32);
  collarGeom.rotateX(Math.PI / 2);
  const collarMesh = new THREE.Mesh(collarGeom, coneMat);
  collarMesh.position.y = coneHeight / 2 - 0.9;
  iceCreamGroup.add(collarMesh);

  // -------------------------------------------------------------
  // 2. Melting Droplets on Cone
  // -------------------------------------------------------------
  const dripMat = new THREE.MeshStandardMaterial({
    color: 0xff85a1,
    roughness: 0.25,
    metalness: 0.1
  });

  // Drip 1 - hanging down side
  const dripGeom1 = new THREE.SphereGeometry(0.16, 16, 16);
  dripGeom1.scale(0.8, 1.8, 0.7);
  const dripMesh1 = new THREE.Mesh(dripGeom1, dripMat);
  dripMesh1.position.set(0.72, 0.1, 0.55);
  dripMesh1.rotation.z = -0.25;
  iceCreamGroup.add(dripMesh1);

  // Drip 2 - smaller droplet lower down
  const dripGeom2 = new THREE.SphereGeometry(0.09, 12, 12);
  const dripMesh2 = new THREE.Mesh(dripGeom2, dripMat);
  dripMesh2.position.set(0.64, -0.35, 0.48);
  iceCreamGroup.add(dripMesh2);

  // -------------------------------------------------------------
  // 3. Ice Cream Scoops
  // -------------------------------------------------------------
  // Helper to add organic bumps to a sphere
  function createBumpySphere(radius, segments, bumpFactor) {
    const geom = new THREE.SphereGeometry(radius, segments, segments);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = i / pos.count;
      const noise = Math.sin(pos.getX(i) * 5) * Math.cos(pos.getY(i) * 6) * Math.sin(pos.getZ(i) * 5);
      const factor = 1 + noise * bumpFactor;
      pos.setXYZ(i, pos.getX(i) * factor, pos.getY(i) * factor, pos.getZ(i) * factor);
    }
    geom.computeVertexNormals();
    return geom;
  }

  // Lower Scoop (Mint Chip / Base flavor)
  const lowerScoopGeom = createBumpySphere(1.15, 32, 0.05);
  const lowerScoopMat = new THREE.MeshStandardMaterial({
    color: 0x70e4d5,
    roughness: 0.35,
    metalness: 0.05
  });
  const lowerScoop = new THREE.Mesh(lowerScoopGeom, lowerScoopMat);
  lowerScoop.position.set(0.05, 0.75, 0);
  lowerScoop.castShadow = true;
  iceCreamGroup.add(lowerScoop);

  // Lower Scoop Ruffle Skirt
  const lowerRuffleGeom = new THREE.TorusGeometry(1.1, 0.16, 16, 32);
  lowerRuffleGeom.rotateX(Math.PI / 2);
  const lowerRuffle = new THREE.Mesh(lowerRuffleGeom, lowerScoopMat);
  lowerRuffle.position.set(0.05, 0.45, 0);
  iceCreamGroup.add(lowerRuffle);

  // Upper Scoop (Strawberry Pink / Hero flavor)
  const upperScoopGeom = createBumpySphere(1.0, 32, 0.06);
  const upperScoopMat = new THREE.MeshStandardMaterial({
    color: 0xff85a1,
    roughness: 0.3,
    metalness: 0.08
  });
  const upperScoop = new THREE.Mesh(upperScoopGeom, upperScoopMat);
  upperScoop.position.set(-0.06, 1.8, 0.05);
  upperScoop.castShadow = true;
  iceCreamGroup.add(upperScoop);

  // Upper Scoop Ruffle Skirt
  const upperRuffleGeom = new THREE.TorusGeometry(0.96, 0.15, 16, 32);
  upperRuffleGeom.rotateX(Math.PI / 2);
  const upperRuffle = new THREE.Mesh(upperRuffleGeom, upperScoopMat);
  upperRuffle.position.set(-0.06, 1.45, 0.05);
  iceCreamGroup.add(upperRuffle);

  // -------------------------------------------------------------
  // 4. Sprinkles (Colorful 3D Cylinders on Upper Scoop)
  // -------------------------------------------------------------
  const sprinkleColors = [0x70e4d5, 0xff85a1, 0xffeaa7, 0xa29bfe, 0xffffff, 0xe58e26];
  const sprinkleGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.18, 8);
  const sprinklesGroup = new THREE.Group();

  for (let i = 0; i < 42; i++) {
    const col = sprinkleColors[i % sprinkleColors.length];
    const sMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.4 });
    const sMesh = new THREE.Mesh(sprinkleGeom, sMat);

    // Random spherical coordinates on top scoop hemisphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * (Math.PI / 2.2); // upper hemisphere
    const r = 0.98;

    sMesh.position.x = -0.06 + r * Math.sin(phi) * Math.cos(theta);
    sMesh.position.y = 1.8 + r * Math.cos(phi);
    sMesh.position.z = 0.05 + r * Math.sin(phi) * Math.sin(theta);

    sMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    sprinklesGroup.add(sMesh);
  }
  iceCreamGroup.add(sprinklesGroup);

  // -------------------------------------------------------------
  // 5. Glossy Red Cherry on Top
  // -------------------------------------------------------------
  const cherryGroup = new THREE.Group();
  cherryGroup.position.set(-0.06, 2.85, 0.05);

  const cherryGeom = new THREE.SphereGeometry(0.38, 24, 24);
  const cherryMat = new THREE.MeshStandardMaterial({
    color: 0xd63031,
    roughness: 0.15,
    metalness: 0.25
  });
  const cherryMesh = new THREE.Mesh(cherryGeom, cherryMat);
  cherryMesh.castShadow = true;
  cherryGroup.add(cherryMesh);

  // Cherry Stem (Curved spline)
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.35, 0),
    new THREE.Vector3(0.15, 0.8, 0.1),
    new THREE.Vector3(0.45, 1.15, 0.05)
  ]);
  const stemGeom = new THREE.TubeGeometry(stemCurve, 16, 0.035, 8, false);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x553c16, roughness: 0.8 });
  const stemMesh = new THREE.Mesh(stemGeom, stemMat);
  cherryGroup.add(stemMesh);

  iceCreamGroup.add(cherryGroup);

  // Center the whole group slightly
  iceCreamGroup.position.y = -0.2;
  iceCreamGroup.rotation.y = 0.4;

  // -------------------------------------------------------------
  // Particle Sprinkle Burst System (on click)
  // -------------------------------------------------------------
  const particles = [];
  function triggerSprinkleBurst() {
    const burstGroup = new THREE.Group();
    scene.add(burstGroup);

    for (let i = 0; i < 28; i++) {
      const col = sprinkleColors[i % sprinkleColors.length];
      const pGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 6);
      const pMat = new THREE.MeshBasicMaterial({ color: col });
      const p = new THREE.Mesh(pGeom, pMat);

      p.position.set(-0.06, 2.0, 0.05);
      p.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.18,
        Math.random() * 0.15 + 0.08,
        (Math.random() - 0.5) * 0.18
      );
      p.rotSpeed = new THREE.Vector3(
        Math.random() * 0.2,
        Math.random() * 0.2,
        Math.random() * 0.2
      );
      burstGroup.add(p);
      particles.push({ mesh: p, group: burstGroup, life: 1.0 });
    }
  }

  // -------------------------------------------------------------
  // Interactivity: Drag & Mouse Tilt
  // -------------------------------------------------------------
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0.05, y: 0.4 };
  let targetTilt = { x: 0, y: 0 };
  let bounceScale = 1.0;
  let isBouncing = false;

  // Mouse Move Parallax
  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -(e.clientY / window.innerHeight) * 2 + 1;
    targetTilt.x = ny * 0.18;
    targetTilt.y = nx * 0.25;
  });

  // Drag on Canvas
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    targetRotation.y += deltaX * 0.012;
    targetRotation.x += deltaY * 0.008;

    // Constrain vertical rotation so cone doesn't flip completely
    targetRotation.x = Math.max(-0.4, Math.min(0.5, targetRotation.x));

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Touch Support for Mobile
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    targetRotation.y += deltaX * 0.015;
    targetRotation.x += deltaY * 0.01;
    targetRotation.x = Math.max(-0.4, Math.min(0.5, targetRotation.x));

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  // Click / Tap Bounce on Ice Cream
  function triggerBounce() {
    if (isBouncing) return;
    isBouncing = true;

    // Sound effect trigger if available
    if (window.playScoopSound) window.playScoopSound();

    triggerSprinkleBurst();

    if (window.gsap) {
      gsap.to(iceCreamGroup.scale, {
        x: 1.15,
        y: 0.88,
        z: 1.15,
        duration: 0.18,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(iceCreamGroup.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.35,
            ease: 'elastic.out(1.2, 0.4)',
            onComplete: () => { isBouncing = false; }
          });
        }
      });
    } else {
      isBouncing = false;
    }
  }

  container.addEventListener('click', (e) => {
    // Only bounce if not dragging significantly
    triggerBounce();
  });

  // Expose color transition function for flavor switcher
  window.updateConeFlavors = function (flavorKey) {
    if (!window.gsap) return;

    let targetUpper = 0xff85a1; // Strawberry
    let targetLower = 0x70e4d5; // Mint

    if (flavorKey === 'mint') {
      targetUpper = 0x70e4d5;
      targetLower = 0xff85a1;
    } else if (flavorKey === 'blueberry') {
      targetUpper = 0xa29bfe;
      targetLower = 0xffeaa7;
    } else if (flavorKey === 'vanilla') {
      targetUpper = 0xffeaa7;
      targetLower = 0xff85a1;
    }

    const colUpper = new THREE.Color(targetUpper);
    const colLower = new THREE.Color(targetLower);

    gsap.to(upperScoopMat.color, { r: colUpper.r, g: colUpper.g, b: colUpper.b, duration: 0.8 });
    gsap.to(upperRuffle.material.color, { r: colUpper.r, g: colUpper.g, b: colUpper.b, duration: 0.8 });
    gsap.to(dripMat.color, { r: colUpper.r, g: colUpper.g, b: colUpper.b, duration: 0.8 });

    gsap.to(lowerScoopMat.color, { r: colLower.r, g: colLower.g, b: colLower.b, duration: 0.8 });
    gsap.to(lowerRuffle.material.color, { r: colLower.r, g: colLower.g, b: colLower.b, duration: 0.8 });

    triggerBounce();
  };

  // -------------------------------------------------------------
  // Render / Animation Loop
  // -------------------------------------------------------------
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Gentle floating bob
    iceCreamGroup.position.y = -0.2 + Math.sin(elapsedTime * 2.2) * 0.09;

    // Smooth rotation towards target + gentle idle spin if not dragging
    if (!isDragging) {
      targetRotation.y += 0.003;
    }

    iceCreamGroup.rotation.y += (targetRotation.y + targetTilt.y - iceCreamGroup.rotation.y) * 0.08;
    iceCreamGroup.rotation.x += (targetRotation.x + targetTilt.x - iceCreamGroup.rotation.x) * 0.08;

    // Gentle cherry wobble
    cherryGroup.rotation.z = Math.sin(elapsedTime * 3) * 0.08;

    // Animate active particle bursts
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.mesh.position.add(p.velocity);
      p.velocity.y -= 0.006; // gravity
      p.mesh.rotation.x += p.rotSpeed.x;
      p.mesh.rotation.y += p.rotSpeed.y;
      p.life -= 0.02;

      if (p.life <= 0) {
        p.group.remove(p.mesh);
        particles.splice(i, 1);
        if (p.group.children.length === 0) {
          scene.remove(p.group);
        }
      }
    }

    renderer.render(scene, camera);
  }

  animate();

  // Responsive Resize
  window.addEventListener('resize', () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
