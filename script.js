// Animated red network map: moving endpoints, linked nodes, and traveling signal pulses.
const canvas = document.querySelector(".cyber-canvas");
const ctx = canvas.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let width = 0;
let height = 0;
let nodes = [];
let frameId;
let lastFrame = 0;

function resizeNetwork() {
  cancelAnimationFrame(frameId);
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.min(100, Math.max(34, Math.round(width * height / 19000)));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - .5) * .28,
    vy: (Math.random() - .5) * .28,
    phase: Math.random() * Math.PI * 2
  }));
  drawNetwork(performance.now());
  if (!reducedMotion.matches && !document.hidden) frameId = requestAnimationFrame(animateNetwork);
}

function drawNetwork(time) {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;
  const reach = Math.min(190, Math.max(125, width * .14));
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy);
      if (distance > reach) continue;
      const strength = 1 - distance / reach;
      ctx.strokeStyle = `rgba(255, 58, 78, ${.10 + strength * .34})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      // A bright packet travels along selected links, like traffic across a network.
      if ((i * 13 + j * 7) % 31 === 0) {
        const progress = ((time / (2600 + (i % 4) * 500) + a.phase) % 1);
        const px = a.x + dx * progress;
        const py = a.y + dy * progress;
        ctx.fillStyle = `rgba(255, 190, 195, ${.45 + strength * .5})`;
        ctx.shadowColor = "#ff344d";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }
  for (const node of nodes) {
    const pulse = .7 + Math.sin(time / 650 + node.phase) * .3;
    ctx.fillStyle = `rgba(255, 86, 103, ${.55 + pulse * .4})`;
    ctx.shadowColor = "#ff243e";
    ctx.shadowBlur = 8 + pulse * 7;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 1.6 + pulse * 1.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

function animateNetwork(time) {
  if (document.hidden || reducedMotion.matches) return;
  const delta = Math.min(time - (lastFrame || time), 32);
  lastFrame = time;
  for (const node of nodes) {
    node.x += node.vx * delta;
    node.y += node.vy * delta;
    if (node.x < -12 || node.x > width + 12) node.vx *= -1;
    if (node.y < -12 || node.y > height + 12) node.vy *= -1;
  }
  drawNetwork(time);
  frameId = requestAnimationFrame(animateNetwork);
}

window.addEventListener("resize", resizeNetwork, { passive: true });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) cancelAnimationFrame(frameId);
  else if (!reducedMotion.matches) {
    lastFrame = 0;
    frameId = requestAnimationFrame(animateNetwork);
  }
});
reducedMotion.addEventListener?.("change", () => {
  cancelAnimationFrame(frameId);
  drawNetwork(performance.now());
  if (!reducedMotion.matches && !document.hidden) frameId = requestAnimationFrame(animateNetwork);
});
resizeNetwork();

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(s => io.observe(s));

// Mobile menu
const btn = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
btn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  menu.classList.remove("open");
  btn.setAttribute("aria-expanded", "false");
}));

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && menu.classList.contains("open")) {
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    btn.focus();
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
