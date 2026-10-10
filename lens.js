'use strict';
(() => {
  const canvas = document.querySelector('.prism-lens');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;

  const hero = canvas.closest('.hero');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const printMedia = matchMedia('print');
  const colors = ['239, 76, 104', '34, 179, 133', '73, 112, 239'];
  const size = 240;
  const rings = 11;
  const segments = 96;
  const tau = Math.PI * 2;
  let frame = null;
  let visible = true;
  let lastTime = null;
  let elapsed = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;

  function draw() {
    const time = reducedMotion.matches ? 0 : elapsed;
    context.clearRect(0, 0, size, size);
    context.save();
    context.translate(size / 2 + pointerX * 7, size / 2 + pointerY * 5);
    context.rotate(-.38 + Math.sin(time * .24) * .16 + pointerX * .04);

    for (let ring = 0; ring < rings; ring++) {
      const depth = ring / (rings - 1);
      const radius = 23 + depth * 70;
      const separation = 2.1 + depth * 1.1 + Math.sin(time * .55) * .4;
      colors.forEach((color, channel) => {
        const shift = channel - 1;
        context.beginPath();
        for (let step = 0; step <= segments; step++) {
          const angle = step / segments * tau;
          const wave = Math.sin(angle * 2 + time * .46 - depth * 2.4);
          const ripple = Math.cos(angle * 3 - time * .28 + depth * 3);
          const warp = 1 + wave * (.07 + depth * .045) + ripple * .025;
          const x = Math.cos(angle) * radius * warp
            + (1 - depth) * (14 + Math.sin(time * .33) * 7 + pointerX * 5)
            + shift * separation;
          const y = Math.sin(angle) * radius * warp * (.78 + Math.sin(time * .31) * .055)
            + Math.cos(angle * 2 + time * .38) * depth * 4
            + (1 - depth) * (Math.cos(time * .27) * 8 + pointerY * 4)
            + shift * Math.cos(angle + time * .25) * separation * .65;
          if (step === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        context.strokeStyle = `rgba(${color}, ${.36 + Math.sin(depth * Math.PI) * .24})`;
        context.lineWidth = .85 + depth * .25;
        context.stroke();
      });
    }
    context.restore();
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const pixels = Math.round(canvas.getBoundingClientRect().width * ratio);
    if (pixels > 0 && canvas.width !== pixels) {
      canvas.width = canvas.height = pixels;
      context.setTransform(pixels / size, 0, 0, pixels / size, 0, 0);
    }
    draw();
  }

  function animate(now) {
    frame = null;
    if (lastTime === null) lastTime = now;
    const delta = now - lastTime;
    if (delta >= 1000 / 30) {
      const seconds = Math.min(delta / 1000, .1);
      elapsed += seconds;
      const easing = 1 - Math.exp(-seconds * 5);
      pointerX += (targetX - pointerX) * easing;
      pointerY += (targetY - pointerY) * easing;
      draw();
      lastTime = now;
    }
    frame = requestAnimationFrame(animate);
  }

  function syncMotion() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastTime = null;
    if (reducedMotion.matches) pointerX = pointerY = targetX = targetY = 0;
    draw();
    if (visible && !document.hidden && !reducedMotion.matches && !printMedia.matches) {
      frame = requestAnimationFrame(animate);
    }
  }

  hero.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
    const bounds = hero.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
  });
  hero.addEventListener('pointerleave', () => { targetX = targetY = 0; });
  finePointer.addEventListener('change', () => { targetX = targetY = 0; });
  reducedMotion.addEventListener('change', syncMotion);
  printMedia.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncMotion();
    });
    observer.observe(hero);
  }
  resize();
  syncMotion();
})();
