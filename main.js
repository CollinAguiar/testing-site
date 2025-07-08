// Intersection Observer fade-up on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('is-visible')
  })
});
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

// Vanilla Tilt initialization
VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
  max: 12,
  speed: 600,
  glare: true,
  "max-glare": 0.35,
});

// Matrix rain
const c = document.getElementById('matrix');
const ctx = c.getContext('2d');
let w, h, fontSize = 14, columns, drops;

function resize() {
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  columns = Math.floor(w / fontSize);
  drops = Array(columns).fill(1);
}
resize();
window.addEventListener('resize', resize);

const chars = '01';

function draw() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ff003c';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > h && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
  requestAnimationFrame(draw);
}
draw();

// Hide nav on scroll down, show on scroll up
let lastScrollY = window.pageYOffset;
const nav = document.querySelector('nav');
const footer = document.querySelector('footer');
window.addEventListener('scroll', () => {
  let currentScrollY = window.pageYOffset;
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    nav.classList.add('hidden');
  } else {
    nav.classList.remove('hidden');
  }
  lastScrollY = currentScrollY;

  // Show footer if scrolled down, hide if top
  if (currentScrollY > 50) {
    footer.style.display = 'block';
  } else {
    footer.style.display = 'none';
  }
});
footer.style.display = 'none';

// Expand cards and bubbles on button click
document.querySelectorAll('.expand-btn').forEach(button => {
  button.addEventListener('click', e => {
    const card = e.target.closest('.card') || e.target.closest('.bubble');
    if (!card) return;
    card.classList.toggle('expanded');
    if (card.classList.contains('expanded')) {
      button.textContent = 'Show Less';
    } else {
      button.textContent = 'Read More';
    }
  });
});

// Resume preview toggle
const previewBtn = document.getElementById('preview-resume-btn');
const resumePreview = document.getElementById('resume-preview');
const closeResumeBtn = document.getElementById('close-resume-btn');

previewBtn.addEventListener('click', () => {
  resumePreview.style.display = 'block';
  previewBtn.style.display = 'none';
});

closeResumeBtn.addEventListener('click', () => {
  resumePreview.style.display = 'none';
  previewBtn.style.display = 'inline-flex';
});
