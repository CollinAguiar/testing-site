// Matrix background effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

let w, h, fontSize = 16, columns, drops;
function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  columns = Math.floor(w / fontSize);
  drops = Array(columns).fill(1);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = '01';
function drawMatrix() {
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
  requestAnimationFrame(drawMatrix);
}
drawMatrix();

// Glitch effect
const glitchText = document.querySelector('.glitch');
setInterval(() => {
  glitchText.classList.toggle('active-glitch');
}, 250);

// Scroll hide navbar
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  const st = window.pageYOffset || document.documentElement.scrollTop;
  if (st > lastScrollTop) {
    navbar.style.top = '-80px';
  } else {
    navbar.style.top = '0';
  }
  lastScrollTop = st <= 0 ? 0 : st;
});

// Expandable cards
document.querySelectorAll('.preview-card').forEach(card => {
  card.addEventListener('click', () => {
    if (card.classList.contains('expanded')) {
      card.classList.remove('expanded');
    } else {
      document.querySelectorAll('.preview-card.expanded').forEach(c => c.classList.remove('expanded'));
      card.classList.add('expanded');
    }
  });
});

// Cryptography playground
function encrypt() {
  const algo = document.getElementById('crypto-select').value;
  const key = document.getElementById('crypto-key').value;
  const input = document.getElementById('crypto-input').value;
  const output = document.getElementById('crypto-output');

  if (algo === 'caesar') {
    const shift = parseInt(key) || 0;
    output.value = input.split('').map(char => {
      if (/[a-z]/i.test(char)) {
        const base = char === char.toLowerCase() ? 97 : 65;
        return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
      }
      return char;
    }).join('');
  } else if (algo === 'vigenere') {
    let k = key.toLowerCase();
    let j = 0;
    output.value = input.split('').map(c => {
      if (/[a-z]/i.test(c)) {
        const code = c.charCodeAt(0);
        const base = c === c.toLowerCase() ? 97 : 65;
        const keyCode = k[j % k.length].charCodeAt(0) - 97;
        j++;
        return String.fromCharCode(((code - base + keyCode) % 26) + base);
      }
      return c;
    }).join('');
  } else if (algo === 'sha256') {
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)).then(buffer => {
      output.value = [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
    });
  }
}

document.getElementById('crypto-select').addEventListener('change', e => {
  const keyLabel = document.getElementById('crypto-key-label');
  const algo = e.target.value;
  if (algo === 'caesar') {
    keyLabel.innerText = 'Shift (1-26):';
    document.getElementById('crypto-key').placeholder = '3';
  } else if (algo === 'vigenere') {
    keyLabel.innerText = 'Keyword:';
    document.getElementById('crypto-key').placeholder = 'key';
  } else {
    keyLabel.innerText = 'Key/Password (not used)';
    document.getElementById('crypto-key').placeholder = '';
  }
});

// Network visualizer
function simulatePacket() {
  const packet = document.querySelector('.packet');
  packet.classList.remove('active');
  void packet.offsetWidth;
  packet.classList.add('active');
}
