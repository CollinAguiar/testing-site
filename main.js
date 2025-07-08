const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
});
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
  max: 8,
  speed: 400,
  glare: true,
  "max-glare": 0.3,
  scale: 1.05,
});

const c = document.getElementById('matrix');
const ctx = c.getContext('2d');
let w, h, font = 14, columns, drops;

function resize() {
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  columns = Math.floor(w / font);
  drops = Array(columns).fill(1);
}
resize();
window.addEventListener('resize', resize);

const chars = '01';

function draw() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ff003c';
  ctx.font = font + 'px monospace';
  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * font, drops[i] * font);
    if (drops[i] * font > h && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
  requestAnimationFrame(draw);
}
draw();
