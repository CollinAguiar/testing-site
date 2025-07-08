// Matrix rain animation setup
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
let width, height;
const fontSize = 14;
let columns;
let drops;

function setupCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  columns = Math.floor(width / fontSize);
  drops = Array(columns).fill(1);
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#ff003c'; // red color
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = Math.random() > 0.5 ? '0' : '1';
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }

  requestAnimationFrame(drawMatrix);
}

// Initialize matrix on window resize
window.addEventListener('resize', () => {
  setupCanvas();
});
setupCanvas();
drawMatrix();

// Vanilla Tilt initialization
VanillaTilt.init(document.querySelectorAll('.card'), {
  max: 15,
  speed: 400,
  glare: true,
  'max-glare': 0.35,
});

// Bubble read more toggle logic
document.querySelectorAll('.bubble .read-more').forEach(button => {
  button.addEventListener('click', () => {
    const bubble = button.closest('.bubble');
    const fullContent = bubble.querySelector('.full-content');
    const preview = bubble.querySelector('.preview-text');

    if (fullContent.classList.contains('hidden')) {
      fullContent.classList.remove('hidden');
      preview.style.display = 'none';
      button.textContent = 'Show Less';
    } else {
      fullContent.classList.add('hidden');
      preview.style.display = '';
      button.textContent = 'Read More';
    }
  });
});

// Cryptography Playground logic
const cryptoMethod = document.getElementById('crypto-method');
const cryptoKey = document.getElementById('crypto-key');
const keyLabel = document.getElementById('key-label');
const cryptoInput = document.getElementById('crypto-input');
const cryptoOutput = document.getElementById('crypto-output');
const btnEncrypt = document.getElementById('btn-encrypt');
const btnDecrypt = document.getElementById('btn-decrypt');
const btnClear = document.getElementById('btn-clear');

function updateKeyLabel() {
  switch (cryptoMethod.value) {
    case 'caesar':
      keyLabel.textContent = 'Shift (1-26):';
      cryptoKey.placeholder = 'Shift (1-26)';
      cryptoKey.type = 'number';
      cryptoKey.min = 1;
      cryptoKey.max = 26;
      break;
    case 'aes':
      keyLabel.textContent = 'Password:';
      cryptoKey.placeholder = 'Password';
      cryptoKey.type = 'text';
      cryptoKey.removeAttribute('min');
      cryptoKey.removeAttribute('max');
      break;
    case 'base64':
      keyLabel.textContent = 'N/A';
      cryptoKey.placeholder = 'No key needed';
      cryptoKey.value = '';
      cryptoKey.type = 'text';
      cryptoKey.setAttribute('disabled', 'disabled');
      break;
    default:
      keyLabel.textContent = 'Key/Password:';
      cryptoKey.placeholder = 'Key/Password';
      cryptoKey.type = 'text';
      cryptoKey.removeAttribute('disabled');
      break;
  }
}

cryptoMethod.addEventListener('change', () => {
  updateKeyLabel();
  cryptoOutput.value = '';
  cryptoInput.value = '';
  cryptoKey.value = '';
  if (cryptoKey.hasAttribute('disabled')) {
    cryptoKey.value = '';
  }
});
updateKeyLabel();

function caesarShift(str, amount) {
  if (amount < 0) return caesarShift(str, amount + 26);
  let output = '';
  for (let i = 0; i < str.length; i++) {
    let c = str[i];
    if (c.match(/[a-z]/i)) {
      let code = str.charCodeAt(i);
      let base = code >= 65 && code <= 90 ? 65 : 97;
      c = String.fromCharCode(((code - base + amount) % 26) + base);
    }
    output += c;
  }
  return output;
}

btnEncrypt.addEventListener('click', () => {
  let input = cryptoInput.value;
  if (!input) return alert('Please enter input text');
  switch (cryptoMethod.value) {
    case 'caesar':
      const shift = parseInt(cryptoKey.value);
      if (isNaN(shift) || shift < 1 || shift > 26) {
        alert('Shift must be a number between 1 and 26');
        return;
      }
      cryptoOutput.value = caesarShift(input, shift);
      break;
    case 'aes':
      if (!cryptoKey.value) {
        alert('Please enter a password');
        return;
      }
      try {
        const encrypted = CryptoJS.AES.encrypt(input, cryptoKey.value).toString();
        cryptoOutput.value = encrypted;
      } catch (e) {
        alert('Encryption error');
      }
      break;
    case 'base64':
      try {
        cryptoOutput.value = btoa(input);
      } catch (e) {
        alert('Invalid input for Base64 encoding');
      }
      break;
  }
});

btnDecrypt.addEventListener('click', () => {
  let input = cryptoInput.value;
  if (!input) return alert('Please enter input text');
  switch (cryptoMethod.value) {
    case 'caesar':
      const shift = parseInt(cryptoKey.value);
      if (isNaN(shift) || shift < 1 || shift > 26) {
        alert('Shift must be a number between 1 and 26');
        return;
      }
      cryptoOutput.value = caesarShift(input, 26 - shift);
      break;
    case 'aes':
      if (!cryptoKey.value) {
        alert('Please enter a password');
        return;
      }
      try {
        const decrypted = CryptoJS.AES.decrypt(input, cryptoKey.value);
        cryptoOutput.value = decrypted.toString(CryptoJS.enc.Utf8) || 'Decryption failed';
      } catch (e) {
        alert('Decryption error');
      }
      break;
    case 'base64':
      try {
        cryptoOutput.value = atob(input);
      } catch (e) {
        alert('Invalid Base64 input');
      }
      break;
  }
});

btnClear.addEventListener('click', () => {
  cryptoInput.value = '';
  cryptoOutput.value = '';
  cryptoKey.value = '';
});

// Resume preview toggle
const resumePreviewBtn = document.getElementById('resumePreviewBtn');
const resumePreview = document.getElementById('resumePreview');

resumePreviewBtn.addEventListener('click', () => {
  if (resumePreview.classList.contains('hidden')) {
    resumePreview.classList.remove('hidden');
    resumePreviewBtn.textContent = 'Hide Resume';
  } else {
    resumePreview.classList.add('hidden');
    resumePreviewBtn.textContent = 'Preview Resume';
  }
});
