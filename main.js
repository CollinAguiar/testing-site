// Matrix rain effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
let width, height;
let columns;
let drops = [];
const fontSize = 16;
const chars = '01';

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  columns = Math.floor(width / fontSize);
  drops = Array(columns).fill(1);
}
window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.fillStyle = 'rgba(10,10,10,0.07)';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#ff003c';
  ctx.font = fontSize + 'px monospace';
  for (let i = 0; i < drops.length; i++) {
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
  requestAnimationFrame(draw);
}
draw();

// Vanilla Tilt initialization
VanillaTilt.init(document.querySelectorAll('.card[data-tilt]'), {
  max: 12,
  speed: 600,
  glare: true,
  'max-glare': 0.6,
  scale: 1.03,
  easing: 'cubic-bezier(.03,.98,.52,.99)',
});

// Scroll-based fade up animation
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
});
document.querySelectorAll('.fade-up').forEach((el) => io.observe(el));

// Hide nav bar on scroll down, show on scroll up
let lastScrollY = window.scrollY;
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY && window.scrollY > 100) {
    nav.classList.add('hidden');
  } else {
    nav.classList.remove('hidden');
  }
  lastScrollY = window.scrollY;
});

// Card expand/collapse logic
document.querySelectorAll('.preview-card').forEach((card) => {
  const btn = card.querySelector('.expand-btn');
  const content = card.querySelector('.card-expanded-content');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (card.classList.contains('expanded')) {
      card.classList.remove('expanded');
      content.style.display = 'none';
      btn.textContent = 'READ MORE';
    } else {
      // Close other expanded cards
      document.querySelectorAll('.preview-card.expanded').forEach((other) => {
        other.classList.remove('expanded');
        other.querySelector('.card-expanded-content').style.display = 'none';
        other.querySelector('.expand-btn').textContent = 'READ MORE';
      });

      card.classList.add('expanded');
      content.style.display = 'block';
      btn.textContent = 'COLLAPSE';
      // If the card has interactive playgrounds, initialize them
      if (card.id === 'crypto-card') initCryptoPlayground();
    }
  });
});

// Cryptography playground
function initCryptoPlayground() {
  const container = document.getElementById('crypto-playground');
  if (container.dataset.inited) return;
  container.dataset.inited = 'true';

  container.innerHTML = `
    <div class="crypto-controls">
      <label for="cipher-select">Cipher:</label>
      <select id="cipher-select">
        <option value="caesar">Caesar Cipher</option>
        <option value="xor">XOR Cipher</option>
        <option value="base64">Base64 Encode/Decode</option>
      </select>
    </div>
    <div class="crypto-controls">
      <label for="key-input" id="key-label">Shift (1-26):</label>
      <input id="key-input" type="text" placeholder="Shift (1-26)" maxlength="2" />
    </div>
    <div class="crypto-controls">
      <label for="input-text">Input Text:</label>
      <textarea id="input-text" rows="5" placeholder="Enter text here..."></textarea>
    </div>
    <div class="crypto-controls">
      <label for="output-text">Output Text:</label>
      <textarea id="output-text" rows="5" readonly></textarea>
    </div>
    <div class="crypto-controls buttons-row">
      <button id="encrypt-btn">Encrypt</button>
      <button id="decrypt-btn">Decrypt</button>
      <button id="copy-btn">Copy Output</button>
    </div>
  `;

  const cipherSelect = document.getElementById('cipher-select');
  const keyInput = document.getElementById('key-input');
  const keyLabel = document.getElementById('key-label');
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const encryptBtn = document.getElementById('encrypt-btn');
  const decryptBtn = document.getElementById('decrypt-btn');
  const copyBtn = document.getElementById('copy-btn');

  cipherSelect.addEventListener('change', () => {
    if (cipherSelect.value === 'caesar') {
      keyLabel.textContent = 'Shift (1-26):';
      keyInput.placeholder = 'Shift (1-26)';
      keyInput.type = 'number';
      keyInput.min = 1;
      keyInput.max = 26;
    } else if (cipherSelect.value === 'xor') {
      keyLabel.textContent = 'Key (text):';
      keyInput.placeholder = 'Key';
      keyInput.type = 'text';
      keyInput.removeAttribute('min');
      keyInput.removeAttribute('max');
    } else {
      keyLabel.textContent = 'N/A';
      keyInput.placeholder = '';
      keyInput.type = 'text';
      keyInput.value = '';
      keyInput.disabled = true;
    }
  });
  cipherSelect.dispatchEvent(new Event('change'));

  function caesarShift(str, shift, decrypt = false) {
    if (decrypt) shift = (26 - shift) % 26;
    return str.replace(/[a-z]/gi, (c) => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
    });
  }

  function xorCipher(text, key, decrypt = false) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  }

  function base64Encode(str) {
    return btoa(str);
  }
  function base64Decode(str) {
    try {
      return atob(str);
    } catch {
      return 'Invalid Base64 input!';
    }
  }

  encryptBtn.addEventListener('click', () => {
    const cipher = cipherSelect.value;
    let input = inputText.value;
    if (!input) return;
    if (cipher === 'caesar') {
      let shift = parseInt(keyInput.value);
      if (isNaN(shift) || shift < 1 || shift > 26) {
        alert('Shift must be between 1 and 26');
        return;
      }
      outputText.value = caesarShift(input, shift);
    } else if (cipher === 'xor') {
      if (!keyInput.value) {
        alert('Key required for XOR');
        return;
      }
      outputText.value = xorCipher(input, keyInput.value);
    } else if (cipher === 'base64') {
      outputText.value = base64Encode(input);
    }
  });

  decryptBtn.addEventListener('click', () => {
    const cipher = cipherSelect.value;
    let input = inputText.value;
    if (!input) return;
    if (cipher === 'caesar') {
      let shift = parseInt(keyInput.value);
      if (isNaN(shift) || shift < 1 || shift > 26) {
        alert('Shift must be between 1 and 26');
        return;
      }
      outputText.value = caesarShift(input, shift, true);
    } else if (cipher === 'xor') {
      if (!keyInput.value) {
        alert('Key required for XOR');
        return;
      }
      outputText.value = xorCipher(input, keyInput.value);
    } else if (cipher === 'base64') {
      outputText.value = base64Decode(input);
    }
  });

  copyBtn.addEventListener('click', () => {
    outputText.select();
    document.execCommand('copy');
  });
}