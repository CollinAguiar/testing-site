// Navbar hide/show on scroll
let lastScroll = 0;
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll <= 0) {
    navbar.classList.remove('hide');
    return;
  }
  if (currentScroll > lastScroll) {
    navbar.classList.add('hide');
  } else {
    navbar.classList.remove('hide');
  }
  lastScroll = currentScroll;
});

// Fade-up animation on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('is-visible');
  });
});
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

// Initialize Vanilla Tilt for bubbles
VanillaTilt.init(document.querySelectorAll('.bubble'), {
  max: 10,
  speed: 400,
  glare: true,
  'max-glare': 0.3,
  scale: 1.05
});

// Matrix background
const matrix = document.getElementById('matrix');
const ctx = matrix.getContext('2d');
let w, h;
const fontSize = 14;
let columns;
let drops;

function resizeMatrix() {
  w = matrix.width = window.innerWidth;
  h = matrix.height = window.innerHeight;
  columns = Math.floor(w / fontSize);
  drops = Array(columns).fill(1);
}
resizeMatrix();
window.addEventListener('resize', resizeMatrix);

const matrixChars = '01';

function drawMatrix() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ff003c';
  ctx.font = fontSize + 'px monospace';
  for (let i = 0; i < drops.length; i++) {
    const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > h && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
  requestAnimationFrame(drawMatrix);
}
drawMatrix();

// Bubble expand/collapse logic
const bubbles = document.querySelectorAll('.bubble');

function closeBubble(bubble) {
  bubble.classList.remove('expanded');
  document.body.style.overflow = '';
}

function openBubble(bubble) {
  bubbles.forEach(b => closeBubble(b));
  bubble.classList.add('expanded');
  bubble.focus();
  document.body.style.overflow = 'hidden';
}

bubbles.forEach(bubble => {
  bubble.addEventListener('click', e => {
    if (!bubble.classList.contains('expanded') && !e.target.classList.contains('close-btn')) {
      openBubble(bubble);
    }
  });
  bubble.querySelector('.close-btn').addEventListener('click', e => {
    e.stopPropagation();
    closeBubble(bubble);
  });
  bubble.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!bubble.classList.contains('expanded')) {
        openBubble(bubble);
      }
    } else if (e.key === 'Escape') {
      if (bubble.classList.contains('expanded')) {
        closeBubble(bubble);
      }
    }
  });
});

// Cryptography Playground logic
const cryptoMethod = document.getElementById('crypto-method');
const cryptoKey = document.getElementById('crypto-key');
const keyLabel = document.getElementById('key-label');
const cryptoInput = document.getElementById('crypto-input');
const cryptoOutput = document.getElementById('crypto-output');
const encryptBtn = document.getElementById('encrypt-btn');
const decryptBtn = document.getElementById('decrypt-btn');

function updateKeyLabel() {
  if (!cryptoMethod || !cryptoKey || !keyLabel) return;
  switch (cryptoMethod.value) {
    case 'caesar':
      keyLabel.textContent = 'Shift (1-26)';
      cryptoKey.placeholder = 'Shift (1-26)';
      break;
    case 'aes':
      keyLabel.textContent = 'Password';
      cryptoKey.placeholder = 'Enter password';
      break;
    case 'base64':
      keyLabel.textContent = 'No key needed';
      cryptoKey.placeholder = '';
      cryptoKey.value = '';
      break;
  }
}
cryptoMethod.addEventListener('change', updateKeyLabel);
updateKeyLabel();

function caesarShift(str, amount) {
  if (amount < 0) amount = 26 + (amount % 26);
  let output = '';
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c >= 65 && c <= 90) {
      output += String.fromCharCode(((c - 65 + amount) % 26) + 65);
    } else if (c >= 97 && c <= 122) {
      output += String.fromCharCode(((c - 97 + amount) % 26) + 97);
    } else {
      output += str.charAt(i);
    }
  }
  return output;
}

function aesEncryptDecrypt(input, password, encrypt = true) {
  if (!password) return '';
  try {
    if (encrypt) {
      return CryptoJS.AES.encrypt(input, password).toString();
    } else {
      const bytes = CryptoJS.AES.decrypt(input, password);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
  } catch {
    return '';
  }
}

encryptBtn.addEventListener('click', () => {
  let input = cryptoInput.value;
  let key = cryptoKey.value;
  if (!input) return;
  switch (cryptoMethod.value) {
    case 'caesar':
      let shift = parseInt(key);
      if (isNaN(shift) || shift < 1 || shift > 26) {
        cryptoOutput.value = 'Invalid shift value';
        return;
      }
      cryptoOutput.value = caesarShift(input, shift);
      break;
    case 'aes':
      if (!key) {
        cryptoOutput.value = 'Password required';
        return;
      }
      cryptoOutput.value = aesEncryptDecrypt(input, key, true);
      break;
    case 'base64':
      cryptoOutput.value = btoa(input);
      break;
  }
});

decryptBtn.addEventListener('click', () => {
  let input = cryptoInput.value;
  let key = cryptoKey.value;
  if (!input) return;
  switch (cryptoMethod.value) {
    case 'caesar':
      let shift = parseInt(key);
      if (isNaN(shift) || shift < 1 || shift > 26) {
        cryptoOutput.value = 'Invalid shift value';
        return;
      }
      cryptoOutput.value = caesarShift(input, 26 - shift);
      break;
    case 'aes':
      if (!key) {
        cryptoOutput.value = 'Password required';
        return;
      }
      cryptoOutput.value = aesEncryptDecrypt(input, key, false);
      break;
    case 'base64':
      try {
        cryptoOutput.value = atob(input);
      } catch {
        cryptoOutput.value = 'Invalid Base64 string';
      }
      break;
  }
});

// Load CryptoJS from CDN for AES (insert script dynamically)
const cryptoScript = document.createElement('script');
cryptoScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
cryptoScript.onload = () => {
  // Now AES encrypt/decrypt works
};
document.head.appendChild(cryptoScript);

// Network Visualizer animation
const visualizerContainer = document.getElementById('network-visualizer');

function createPacket() {
  const packet = document.createElement('div');
  packet.className = 'packet';
  packet.style.left = Math.random() * 100 + '%';
  packet.style.animationDuration = (3 + Math.random() * 2) + 's';
  visualizerContainer.appendChild(packet);
  setTimeout(() => {
    packet.remove();
  }, 5000);
}

function startVisualizer() {
  if (!visualizerContainer) return;
  setInterval(createPacket, 400);
}

startVisualizer();
