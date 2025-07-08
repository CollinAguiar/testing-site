// Matrix background animation
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
let width, height;
const fontSize = 14;
let columns;
let drops;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  columns = Math.floor(width / fontSize);
  drops = new Array(columns).fill(1);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = '01';

function drawMatrix() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#ff003c';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
  requestAnimationFrame(drawMatrix);
}
drawMatrix();

// Navbar hide on scroll down, show on scroll up
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll <= 0) {
    navbar.style.top = '0';
    return;
  }
  if (currentScroll > lastScroll) {
    navbar.style.top = '-80px'; // hide
  } else {
    navbar.style.top = '0'; // show
  }
  lastScroll = currentScroll;
});

// IntersectionObserver for fade-in animations
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('is-visible');
  });
});
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

// Initialize VanillaTilt for cards and bubbles
VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
  max: 15,
  speed: 400,
  glare: true,
  'max-glare': 0.3,
  scale: 1.05
});

// Bubble expand/collapse functionality
document.querySelectorAll('.bubble').forEach(bubble => {
  bubble.addEventListener('click', () => {
    const expanded = bubble.classList.contains('expanded');
    document.querySelectorAll('.bubble.expanded').forEach(b => {
      if (b !== bubble) b.classList.remove('expanded');
    });
    if (!expanded) {
      bubble.classList.add('expanded');
      bubble.scrollIntoView({behavior: 'smooth', block: 'center'});
    } else {
      bubble.classList.remove('expanded');
    }
  });
});

// Resume Modal preview
const resumeModal = document.getElementById('resumeModal');
const resumePreviewBtn = document.getElementById('resumePreviewBtn');
const closeModalBtn = document.querySelector('.modal .close');

resumePreviewBtn.addEventListener('click', () => {
  resumeModal.classList.add('show');
});
closeModalBtn.addEventListener('click', () => {
  resumeModal.classList.remove('show');
});
window.addEventListener('click', e => {
  if (e.target === resumeModal) {
    resumeModal.classList.remove('show');
  }
});

// Cryptography Playground logic
const cryptoMethod = document.getElementById('cryptoMethod');
const cryptoInput = document.getElementById('cryptoInput');
const cryptoKey = document.getElementById('cryptoKey');
const cryptoResult = document.getElementById('cryptoResult');
const cryptoRunBtn = document.getElementById('cryptoRun');

function updateCryptoKeyPlaceholder() {
  const val = cryptoMethod.value;
  if (val === 'caesar') {
    cryptoKey.placeholder = 'Shift (1-26)';
    cryptoKey.type = 'number';
    cryptoKey.min = 1;
    cryptoKey.max = 26;
  } else if (val === 'vigenere') {
    cryptoKey.placeholder = 'Key (letters)';
    cryptoKey.type = 'text';
    cryptoKey.min = '';
    cryptoKey.max = '';
  } else {
    cryptoKey.placeholder = 'Key/Password';
    cryptoKey.type = 'text';
    cryptoKey.min = '';
    cryptoKey.max = '';
  }
}
cryptoMethod.addEventListener('change', () => {
  updateCryptoKeyPlaceholder();
  cryptoResult.value = '';
  cryptoInput.value = '';
  cryptoKey.value = '';
});
updateCryptoKeyPlaceholder();

function caesarEncrypt(text, shift) {
  shift = parseInt(shift);
  if (isNaN(shift) || shift < 1 || shift > 26) return 'Invalid shift key.';
  return text.replace(/[a-z]/gi, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode((c.charCodeAt(0) - base + shift) % 26 + base);
  });
}

function caesarDecrypt(text, shift) {
  return caesarEncrypt(text, 26 - shift);
}

function vigenereEncrypt(text, key) {
  if (!key) return 'Key required.';
  key = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!key.length) return 'Invalid key.';
  let result = '';
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const base = c >= 'a' && c <= 'z' ? 97 : c >= 'A' && c <= 'Z' ? 65 : null;
    if (base === null) {
      result += c;
      continue;
    }
    const keyChar = key[j % key.length].charCodeAt(0) - 65;
    const cCode = c.charCodeAt(0) - base;
    result += String.fromCharCode((cCode + keyChar) % 26 + base);
    j++;
  }
  return result;
}

function vigenereDecrypt(text, key) {
  if (!key) return 'Key required.';
  key = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!key.length) return 'Invalid key.';
  let result = '';
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const base = c >= 'a' && c <= 'z' ? 97 : c >= 'A' && c <= 'Z' ? 65 : null;
    if (base === null) {
      result += c;
      continue;
    }
    const keyChar = key[j % key.length].charCodeAt(0) - 65;
    const cCode = c.charCodeAt(0) - base;
    result += String.fromCharCode((cCode - keyChar + 26) % 26 + base);
    j++;
  }
  return result;
}

function base64Encode(text) {
  try {
    return btoa(text);
  } catch {
    return 'Invalid input for Base64 encode.';
  }
}

function base64Decode(text) {
  try {
    return atob(text);
  } catch {
    return 'Invalid input for Base64 decode.';
  }
}

cryptoRunBtn.addEventListener('click', () => {
  const method = cryptoMethod.value;
  const input = cryptoInput.value;
  const key = cryptoKey.value;
  if (!input) {
    cryptoResult.value = 'Enter some text.';
    return;
  }

  let output = '';
  switch (method) {
    case 'caesar':
      output = caesarEncrypt(input, key);
      break;
    case 'caesar-dec':
      output = caesarDecrypt(input, key);
      break;
    case 'vigenere':
      output = vigenereEncrypt(input, key);
      break;
    case 'vigenere-dec':
      output = vigenereDecrypt(input, key);
      break;
    case 'base64-enc':
      output = base64Encode(input);
      break;
    case 'base64-dec':
      output = base64Decode(input);
      break;
    default:
      output = 'Unsupported method.';
  }
  cryptoResult.value = output;
});

// Network Packet Visualizer
const packetContainer = document.getElementById('packetContainer');

function createPacket() {
  const packet = document.createElement('div');
  packet.classList.add('packet');
  packet.style.left = Math.random() * 90 + 'vw';
  packet.style.animationDuration = 3 + Math.random() * 3 + 's';
  packet.style.backgroundColor = '#ff003c';
  packetContainer.appendChild(packet);
  setTimeout(() => {
    packet.remove();
  }, 6000);
}

setInterval(createPacket, 350);

// Hardware Setup Bubble Image Toggle
document.querySelectorAll('.hardware-img-thumb').forEach(thumb => {
  thumb.addEventListener('click', e => {
    const container = thumb.closest('.expanded-content');
    const mainImg = container.querySelector('.hardware-main-img');
    mainImg.src = thumb.src;
  });
});

// Prevent scrolling behind modal
resumeModal.addEventListener('wheel', e => e.stopPropagation());

// Close expanded bubble when clicking outside content
document.body.addEventListener('click', e => {
  if (!e.target.closest('.bubble') && !e.target.closest('.modal') && !e.target.closest('#resumePreviewBtn')) {
    document.querySelectorAll('.bubble.expanded').forEach(b => b.classList.remove('expanded'));
    resumeModal.classList.remove('show');
  }
});

// Fix text selection on bubbles
document.querySelectorAll('.bubble').forEach(bubble => {
  bubble.addEventListener('mousedown', e => {
    if (e.target.tagName === 'P' || e.target.tagName === 'H2' || e.target.tagName === 'H3') {
      e.stopPropagation();
    }
  });
});
