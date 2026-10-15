/**
 * Floating Canvas Sprinkles Background
 * Creates soft, floating, interactive pastel sprinkles and sugar confetti
 * with gentle floating physics and mouse interaction.
 */

(function () {
  const canvas = document.getElementById('sprinkles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const colors = [
    '#FF85A1', // Strawberry
    '#70E4D5', // Mint
    '#A29BFE', // Blueberry
    '#FFEAA7', // Vanilla
    '#FF7675', // Coral
    '#55EFC4', // Aqua
    '#F8A5C2'  // Soft pink
  ];

  const sprinkles = [];
  const count = Math.min(Math.floor(width / 24), 55);

  let mouse = { x: -1000, y: -1000, radius: 120 };

  class Sprinkle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.length = Math.random() * 12 + 8;
      this.width = Math.random() * 3 + 2.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.angle = Math.random() * Math.PI * 2;
      this.spinSpeed = (Math.random() - 0.5) * 0.02;
      this.vy = -(Math.random() * 0.6 + 0.3); // drift upwards gently
      this.vx = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.35;
      this.type = Math.random() > 0.3 ? 'capsule' : 'dot';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.spinSpeed;

      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (1 - dist / mouse.radius) * 3;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
        this.angle += 0.05;
      }

      // Wrap around bounds
      if (this.y < -30) this.reset(false);
      if (this.x < -30) this.x = width + 30;
      if (this.x > width + 30) this.x = -30;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      if (this.type === 'capsule') {
        const r = this.width / 2;
        const h = this.length;
        ctx.beginPath();
        ctx.arc(0, -h / 2 + r, r, Math.PI, 0, false);
        ctx.lineTo(r, h / 2 - r);
        ctx.arc(0, h / 2 - r, r, 0, Math.PI, false);
        ctx.closePath();
        ctx.fill();
      } else {
        // Sugar dot
        ctx.beginPath();
        ctx.arc(0, 0, this.width * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Populate sprinkles
  for (let i = 0; i < count; i++) {
    sprinkles.push(new Sprinkle());
  }

  // Track mouse
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Render Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < sprinkles.length; i++) {
      sprinkles[i].update();
      sprinkles[i].draw();
    }

    requestAnimationFrame(animate);
  }

  animate();

  // Celebration Shower
  window.triggerSprinkleShower = function () {
    if (window.confetti) {
      window.confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF85A1', '#70E4D5', '#A29BFE', '#FFEAA7', '#E58E26']
      });
    }
  };
})();
