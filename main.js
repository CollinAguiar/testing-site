document.querySelectorAll('.expand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.card');
    card.classList.toggle('active');
  });
});

let lastScroll = 0;
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  const current = window.pageYOffset;
  if (current > lastScroll) {
    navbar.classList.add('hidden');
  } else {
    navbar.classList.remove('hidden');
  }
  lastScroll = current;
});

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
});
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
  max: 8,
  glare: true,
  "max-glare": 0.3,
});

document.getElementById('vulnForm').addEventListener('submit', e => {
  e.preventDefault();
  const url = document.getElementById('vulnUrl').value.trim();
  if (!url) return;
  const results = {
    openPorts: [80, 443],
    server: 'nginx/1.18.0',
    outdatedCMS: url.includes('wp') ? 'WordPress 4.9 (outdated)' : 'None'
  };
  document.getElementById('vulnResults').innerHTML = `
    <h3>Scan Results for ${url}</h3>
    <ul>
      <li>Open ports: ${results.openPorts.join(', ')}</li>
      <li>Server: ${results.server}</li>
      <li>Outdated CMS: ${results.outdatedCMS}</li>
    </ul>`;
});

const input = document.getElementById('input');
const output = document.getElementById('output');
const cipher = document.getElementById('cipher');
const key = document.getElementById('key');

function caesar(str, shift, decrypt = false) {
  return str.replace(/[A-Za-z]/g, c => {
    const base = c <= 'Z' ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
    const offset = c.charCodeAt(0) - base;
    const shiftVal = decrypt ? (offset - shift + 26) % 26 : (offset + shift) % 26;
    return String.fromCharCode(shiftVal + base);
  });
}

function vigenere(str, pw, decrypt = false) {
  let out = '', j = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (/[A-Za-z]/.test(c)) {
      const base = c <= 'Z' ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
      const p = pw[j % pw.length].toLowerCase().charCodeAt(0) - 97;
      const offset = c.charCodeAt(0) - base;
      const shiftVal = decrypt ? (offset - p + 26) % 26 : (offset + p) % 26;
      out += String.fromCharCode(shiftVal + base);
      j++;
    } else out += c;
  }
  return out;
}

document.getElementById('encrypt').onclick = () => {
  const text = input.value;
  const k = key.value;
  output.textContent = cipher.value === 'caesar'
    ? caesar(text, parseInt(k) || 0, false)
    : vigenere(text, k, false);
};

document.getElementById('decrypt').onclick = () => {
  const text = input.value;
  const k = key.value;
  output.textContent = cipher.value === 'caesar'
    ? caesar(text, parseInt(k) || 0, true)
    : vigenere(text, k, true);
};

// Matrix Background
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
