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
function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ff003c';
  ctx.font = font + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * font, drops[i] * font);
    if (drops[i] * font > h && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }

  requestAnimationFrame(drawMatrix);
}
drawMatrix();

let prevScroll = window.scrollY;
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  nav.style.top = current > prevScroll ? '-80px' : '0';
  prevScroll = current;
});

document.querySelectorAll('[data-expand]').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('expanded');
  });
});

document.querySelectorAll('.preview-card').forEach(section => {
  section.addEventListener('click', () => {
    section.classList.toggle('expanded');
  });
});

const cryptoMethod = document.getElementById('cryptoMethod');
const cryptoKey = document.getElementById('cryptoKey');
const cryptoKeyLabel = document.getElementById('cryptoKeyLabel');
const cryptoInput = document.getElementById('cryptoInput');
const cryptoOutput = document.getElementById('cryptoOutput');

function updateLabel() {
  cryptoKeyLabel.textContent = cryptoMethod.value === 'caesar' ? 'Shift (1-26):' : 'Key/Password:';
  cryptoKeyLabel.appendChild(cryptoKey);
}

cryptoMethod.addEventListener('change', updateLabel);
updateLabel();

document.getElementById('cryptoEncrypt').addEventListener('click', () => {
  const text = cryptoInput.value;
  const key = parseInt(cryptoKey.value);
  if (cryptoMethod.value === 'caesar') {
    cryptoOutput.value = caesarEncrypt(text, key);
  } else {
    cryptoOutput.value = btoa(text);
  }
});

document.getElementById('cryptoDecrypt').addEventListener('click', () => {
  const text = cryptoInput.value;
  const key = parseInt(cryptoKey.value);
  if (cryptoMethod.value === 'caesar') {
    cryptoOutput.value = caesarEncrypt(text, 26 - key);
  } else {
    try {
      cryptoOutput.value = atob(text);
    } catch {
      cryptoOutput.value = 'Invalid input';
    }
  }
});

function caesarEncrypt(text, shift) {
  return text.replace(/[a-z]/gi, char => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode((char.charCodeAt(0) - base + shift) % 26 + base);
  });
}
