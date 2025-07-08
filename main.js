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

// Vulnerability Scanner
document.getElementById('vulnForm').addEventListener('submit', e => {
  e.preventDefault();
  const url = document.getElementById('vulnUrl').value.trim();
  if (!url) return;
  const results = {
    openPorts: [22, 80, 443, 3306],
    server: 'Apache/2.4.46 (Unix)',
    outdatedCMS: url.toLowerCase().includes('wp') ? 'WordPress 4.9 (outdated)' : 'None',
    ssl: url.toLowerCase().startsWith('https') ? 'Valid SSL Certificate' : 'No SSL Certificate',
    vulnerabilities: ['Cross-site scripting (XSS)', 'SQL Injection', 'Directory Traversal']
  };
  document.getElementById('vulnResults').innerHTML = `
    <h3>Scan Results for <code>${url}</code></h3>
    <ul>
      <li>Open ports: ${results.openPorts.join(', ')}</li>
      <li>Server: ${results.server}</li>
      <li>Outdated CMS: ${results.outdatedCMS}</li>
      <li>SSL Status: ${results.ssl}</li>
      <li>Potential Vulnerabilities:</li>
      <ul>${results.vulnerabilities.map(v => `<li>${v}</li>`).join('')}</ul>
    </ul>`;
});

// Cryptography Playground logic
const input = document.getElementById('input');
const output = document.getElementById('output');
const cipher = document.getElementById('cipher');
const key = document.getElementById('key');

function caesar(str, shift, decrypt = false) {
  return str.replace(/[A-Za-z]/g, c => {
    const base = c <= 'Z' ? 65 : 97;
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
      const base = c <= 'Z' ? 65 : 97;
      const p = pw[j % pw.length].toLowerCase().charCodeAt(0) - 97;
      const offset = c.charCodeAt(0) - base;
      const shiftVal = decrypt ? (offset - p + 26) % 26 : (offset + p) % 26;
      out += String.fromCharCode(shiftVal + base);
      j++;
    } else out += c;
  }
  return out;
}

function base64Encode(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return 'Invalid input';
  }
}

function base64Decode(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return 'Invalid input';
  }
}

function xorCipher(str, keyStr) {
  if (!keyStr) return 'Enter a key for XOR cipher.';
  let out = '';
  for (let i = 0; i < str.length; i++) {
    out += String.fromCharCode(str.charCodeAt(i) ^ keyStr.charCodeAt(i % keyStr.length));
  }
  return out;
}

cipher.addEventListener('change', () => {
  if (cipher.value === 'caesar') {
    key.placeholder = 'Shift (1-26)';
    key.type = 'number';
    key.min = 1;
    key.max = 26;
  } else if (cipher.value === 'vigenere') {
    key.placeholder = 'Key (letters only)';
    key.type = 'text';
    key.removeAttribute('min');
    key.removeAttribute('max');
  } else if (cipher.value === 'base64') {
    key.placeholder = 'No key needed';
    key.value = '';
    key.type = 'text';
    key.setAttribute('readonly', true);
  } else if (cipher.value === 'xor') {
    key.placeholder = 'Key (any text)';
    key.type = 'text';
    key.removeAttribute('readonly');
  }
  output.textContent = '';
});

document.getElementById('encrypt').onclick = () => {
  const text = input.value;
  const k = key.value;
  if (cipher.value === 'base64') {
    output.textContent = base64Encode(text);
    return;
  }
  if (cipher.value === 'caesar') {
    const shift = parseInt(k);
    if (isNaN(shift) || shift < 1 || shift > 26) {
      output.textContent = 'Please enter a valid shift between 1 and 26.';
      return;
    }
    output.textContent = caesar(text, shift, false);
    return;
  }
  if (cipher.value === 'vigenere') {
    if (!k.match(/^[a-zA-Z]+$/)) {
      output.textContent = 'Key must contain letters only.';
      return;
    }
    output.textContent = vigenere(text, k, false);
    return;
  }
  if (cipher.value === 'xor') {
    if (!k) {
      output.textContent = 'Please enter a key for XOR cipher.';
      return;
    }
    output.textContent = xorCipher(text, k);
    return;
  }
};

document.getElementById('decrypt').onclick = () => {
  const text = input.value;
  const k = key.value;
  if (cipher.value === 'base64') {
    output.textContent = base64Decode(text);
    return;
  }
  if (cipher.value === 'caesar') {
    const shift = parseInt(k);
    if (isNaN(shift) || shift < 1 || shift > 26) {
      output.textContent = 'Please enter a valid shift between 1 and 26.';
      return;
    }
    output.textContent = caesar(text, shift, true);
    return;
  }
  if (cipher.value === 'vigenere') {
    if (!k.match(/^[a-zA-Z]+$/)) {
      output.textContent = 'Key must contain letters only.';
      return;
    }
    output.textContent = vigenere(text, k, true);
    return;
  }
  if (cipher.value === 'xor') {
    if (!k) {
      output.textContent = 'Please enter a key for XOR cipher.';
      return;
    }
    output.textContent = xorCipher(text, k);
    return;
  }
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
