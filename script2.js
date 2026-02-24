(function () {
  const canvas = document.getElementById('sand');
  const ctx = canvas.getContext('2d');
  let width, height;
  let mouse = { x: -500, y: -500 };
  let lastMouse = { x: -500, y: -500 };
  let swipeAngle = 0;
  const particles = [];
  const particleCount = 52000;
  const mouseStrength = 1.1;
  const footprintScale = 1.15;
  const footprintParts = [
    { x: -48, y: 0, rx: 40, ry: 30 },
    { x: 0, y: 0, rx: 28, ry: 22 },
    { x: 38, y: -2, rx: 22, ry: 18 },
    { x: 50, y: 6, rx: 14, ry: 11 },
    { x: 54, y: 14, rx: 11, ry: 9 },
    { x: 55, y: 22, rx: 10, ry: 8 },
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      const hue = 32 + Math.random() * 15;
      const sat = 28 + Math.random() * 14;
      const light = 55 + Math.random() * 14;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        size: 2.2 + Math.random() * 2.4,
        hue, sat, light,
        fill: `hsl(${hue},${sat}%,${light}%)`,
      });
    }
  }

  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener('mousedown', function (e) {
    lastMouse.x = e.clientX;
    lastMouse.y = e.clientY;
  });

  document.addEventListener('touchmove', function (e) {
    e.preventDefault();
    if (e.touches.length) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: false });

  document.addEventListener('mouseleave', function () {
    mouse.x = -500;
    mouse.y = -500;
  });

  const footprintRadiusSq = 100 * 100;

  function toFootprintLocal(px, py, cx, cy, cosA, sinA) {
    const dx = (px - cx) / footprintScale;
    const dy = (py - cy) / footprintScale;
    return {
      x: dx * cosA + dy * sinA,
      y: -dx * sinA + dy * cosA,
    };
  }

  function inFootprintFromLocal(local) {
    for (let i = 0; i < footprintParts.length; i++) {
      const part = footprintParts[i];
      const lx = (local.x - part.x) / part.rx;
      const ly = (local.y - part.y) / part.ry;
      if (lx * lx + ly * ly <= 1) return true;
    }
    return false;
  }

  function footprintDistFromLocal(local) {
    let minD = 2;
    for (let i = 0; i < footprintParts.length; i++) {
      const part = footprintParts[i];
      const lx = (local.x - part.x) / part.rx;
      const ly = (local.y - part.y) / part.ry;
      const d = Math.sqrt(lx * lx + ly * ly);
      if (d < minD) minD = d;
    }
    return Math.min(1, minD);
  }

  function loop() {
    const dx = mouse.x - lastMouse.x;
    const dy = mouse.y - lastMouse.y;
    const move = dx * dx + dy * dy;
    if (move > 4) {
      swipeAngle = Math.atan2(dy, dx);
    }
    if (mouse.x >= 0 && mouse.y >= 0) {
      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;
    }

    const cosA = Math.cos(swipeAngle);
    const sinA = Math.sin(swipeAngle);

    ctx.clearRect(0, 0, width, height);

    const isMoving = move > 4;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const pdx = p.x - mouse.x;
      const pdy = p.y - mouse.y;

      if (isMoving && pdx * pdx + pdy * pdy < footprintRadiusSq) {
        const local = toFootprintLocal(p.x, p.y, mouse.x, mouse.y, cosA, sinA);
        if (inFootprintFromLocal(local)) {
          const d = footprintDistFromLocal(local);
          const force = (1 - d) * mouseStrength * 25;
          const angle = Math.atan2(pdy, pdx);
          p.x += Math.cos(angle) * force * (1 - d);
          p.y += Math.sin(angle) * force * (1 - d);
        }
      }

      p.x = (p.x + width) % width;
      p.y = (p.y + height) % height;
      p.baseX = (p.baseX + width) % width;
      p.baseY = (p.baseY + height) % height;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.fill;
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();
})();
