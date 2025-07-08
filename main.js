let lastScroll = 0;
const nav = document.querySelector('nav');
const footer = document.querySelector('footer');
const scrollTopBtn = document.getElementById('scrollTopBtn');

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    nav.style.top = '0';
    footer.style.opacity = '0';
    footer.style.pointerEvents = 'none';
    scrollTopBtn.style.display = 'none';
    lastScroll = 0;
    return;
  }

  if (currentScroll > lastScroll) {
    nav.style.top = '-80px';
  } else {
    nav.style.top = '0';
  }

  if (currentScroll > window.innerHeight * 0.8) {
    footer.style.opacity = '1';
    footer.style.pointerEvents = 'auto';
    scrollTopBtn.style.display = 'block';
  } else {
    footer.style.opacity = '0';
    footer.style.pointerEvents = 'none';
    scrollTopBtn.style.display = 'none';
  }

  lastScroll = currentScroll;
});

document.querySelectorAll('nav .nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
  max: 8,
  glare: true,
  "max-glare": 0.25,
  speed: 400,
  scale: 1.05,
});

const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
let w, h, fontSize = 14, columns, drops;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
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
