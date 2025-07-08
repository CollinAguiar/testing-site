// MATRIX RAIN ANIMATION
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
let width, height;
let fontSize = 14;
let columns;
let drops;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  columns = Math.floor(width / fontSize);
  drops = Array(columns).fill(1);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const matrixChars = '01';

function drawMatrix() {
  ctx.fillStyle = 'rgba(10,10,10,0.05)';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#ff003c';
  ctx.font = fontSize + 'px monospace';
  for (let i = 0; i < drops.length; i++) {
    const char = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
    ctx.fillText(char, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
  requestAnimationFrame(drawMatrix);
}
drawMatrix();

// NAVBAR HIDE ON SCROLL
let lastScrollY = window.scrollY;
const navBar = document.getElementById('navBar');
const footer = document.querySelector('footer');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    navBar.classList.add('hidden');
    footer.style.display = 'block';
  } else {
    navBar.classList.remove('hidden');
    footer.style.display = 'none';
  }
  lastScrollY = currentScrollY;
});

// EXPAND / COLLAPSE CARDS LOGIC
const cards = document.querySelectorAll('.preview-card');
cards.forEach(card => {
  const btn = card.querySelector('.expand-btn');
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isExpanded = card.classList.contains('expanded');
    if (isExpanded) {
      card.classList.remove('expanded');
      btn.textContent = 'READ MORE';
      card.style.maxHeight = '8.2rem';
      card.style.overflowY = 'hidden';
    } else {
      // Collapse any other expanded cards
      cards.forEach(c => {
        if (c !== card) {
          c.classList.remove('expanded');
          const otherBtn = c.querySelector('.expand-btn');
          if(otherBtn) otherBtn.textContent = 'READ MORE';
          c.style.maxHeight = '8.2rem';
          c.style.overflowY = 'hidden';
        }
      });
      card.classList.add('expanded');
      btn.textContent = 'SHOW LESS';
      card.style.maxHeight = '800px';
      card.style.overflowY = 'auto';
    }
  });
});

// CRYPTOGRAPHY PLAYGROUND UI SETUP
const cryptoCard = document.getElementById('crypto-playground-card');
const playgroundContainer = document.getElementById('crypto-playground');

function createCryptoPlayground() {
  // Clear previous
  playgroundContainer.innerHTML = '';

  const controlsDiv = document.createElement('div');
  controlsDiv.style.display = 'flex';
  controlsDiv.style.flexDirection = 'column';
  controlsDiv.style.gap = '1rem';
  controlsDiv.style.marginTop = '1rem';
  controlsDiv.style.userSelect = 'none';

  // Dropdown: Method
  const methodLabel = document.createElement('label');
  methodLabel.textContent = 'Encryption Method:';
  methodLabel.style.color = '#ff003c';
  methodLabel.style.fontWeight = '700';

  const methodSelect = document.createElement('select');
  methodSelect.style.padding = '0.4rem';
  methodSelect.style.borderRadius = '6px';
  methodSelect.style.border = '1px solid #ff003c';
  methodSelect.style.background = '#110000';
  methodSelect.style.color = '#eee';
  methodSelect.style.fontFamily = 'Share Tech Mono, monospace';
  methodSelect.style.fontWeight = '700';
  methodSelect.innerHTML = `
    <option value="caesar">Caesar Cipher</option>
    <option value="vigenere">Vigenère Cipher</option>
    <option value="aes">AES (Advanced Encryption Standard)</option>
  `;

  // Input for key/shift/password
  const keyLabel = document.createElement('label');
  keyLabel.textContent = 'Key/Password:';
  keyLabel.style.color = '#ff003c';
  keyLabel.style.fontWeight = '700';

  const keyInput = document.createElement('input');
  keyInput.type = 'text';
  keyInput.style.padding = '0.5rem';
  keyInput.style.borderRadius = '6px';
  keyInput.style.border = '1px solid #ff003c';
  keyInput.style.background = '#110000';
  keyInput.style.color = '#eee';
  keyInput.style.fontFamily = 'Share Tech Mono, monospace';
  keyInput.style.fontWeight = '700';

  // Textarea input/output
  const textInputLabel = document.createElement('label');
  textInputLabel.textContent = 'Input Text:';
  textInputLabel.style.color = '#ff003c';
  textInputLabel.style.fontWeight = '700';

  const textInput = document.createElement('textarea');
  textInput.rows = 5;
  textInput.style.padding = '0.5rem';
  textInput.style.borderRadius = '6px';
  textInput.style.border = '1px solid #ff003c';
  textInput.style.background = '#110000';
  textInput.style.color = '#eee';
  textInput.style.fontFamily = 'Share Tech Mono, monospace';
  textInput.style.fontWeight = '700';
  textInput.style.resize = 'vertical';

  const outputLabel = document.createElement('label');
  outputLabel.textContent = 'Output Text:';
  outputLabel.style.color = '#ff003c';
  outputLabel.style.fontWeight = '700';

  const outputArea = document.createElement('textarea');
  outputArea.rows = 5;
  outputArea.style.padding = '0.5rem';
  outputArea.style.borderRadius = '6px';
  outputArea.style.border = '1px solid #ff003c';
  outputArea.style.background = '#110000';
  outputArea.style.color = '#eee';
  outputArea.style.fontFamily = 'Share Tech Mono, monospace';
  outputArea.style.fontWeight = '700';
  outputArea.style.resize = 'vertical';
  outputArea.readOnly = true;

  // Buttons Encrypt / Decrypt
  const buttonsDiv = document.createElement('div');
  buttonsDiv.style.display = 'flex';
  buttonsDiv.style.gap = '1rem';
  buttonsDiv.style.marginTop = '1rem';

  const encryptBtn = document.createElement('button');
  encryptBtn.textContent = 'Encrypt';
  encryptBtn.className = 'btn btn-glow';
  encryptBtn.style.flex = '1';

  const decryptBtn = document.createElement('button');
  decryptBtn.textContent = 'Decrypt';
  decryptBtn.className = 'btn btn-glow';
  decryptBtn.style.flex = '1';

  buttonsDiv.appendChild(encryptBtn);
  buttonsDiv.appendChild(decryptBtn);

  controlsDiv.appendChild(methodLabel);
  controlsDiv.appendChild(methodSelect);
  controlsDiv.appendChild(keyLabel);
  controlsDiv.appendChild(keyInput);
  controlsDiv.appendChild(textInputLabel);
  controlsDiv.appendChild(textInput);
  controlsDiv.appendChild(outputLabel);
  controlsDiv.appendChild(outputArea);
  controlsDiv.appendChild(buttonsDiv);

  playgroundContainer.appendChild(controlsDiv);

  // Update key label placeholder based on method
  function updateKeyPlaceholder() {
    const method = methodSelect.value;
    if (method === 'caesar') {
      keyLabel.textContent = 'Shift (1-26):';
      keyInput.placeholder = '3';
      keyInput.type = 'number';
      keyInput.min = 1;
      keyInput.max = 26;
    } else if (method === 'vigenere') {
      keyLabel.textContent = 'Key (letters only):';
      keyInput.placeholder = 'SECRET';
      keyInput.type = 'text';
      keyInput.removeAttribute('min');
      keyInput.removeAttribute('max');
    } else if (method === 'aes') {
      keyLabel.textContent = 'Password:';
      keyInput.placeholder = 'Enter password';
      keyInput.type = 'password';
      keyInput.removeAttribute('min');
      keyInput.removeAttribute('max');
    }
  }
  updateKeyPlaceholder();
  methodSelect.addEventListener('change', () => {
    updateKeyPlaceholder();
    outputArea.value = '';
  });

  // Caesar Cipher functions
  function caesarEncrypt(text, shift) {
    shift = parseInt(shift);
    if (isNaN(shift) || shift < 1 || shift > 26) return 'Shift must be 1-26';
    return text.replace(/[a-z]/gi, c => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
    });
  }
  function caesarDecrypt(text, shift) {
    shift = parseInt(shift);
    if (isNaN(shift) || shift < 1 || shift > 26) return 'Shift must be 1-26';
    return text.replace(/[a-z]/gi, c => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base - shift + 26) % 26) + base);
    });
  }

  // Vigenere Cipher functions
  function vigenereEncrypt(text, key) {
    if (!/^[a-zA-Z]+$/.test(key)) return 'Key must be letters only';
    key = key.toUpperCase();
    let j = 0;
    return text.replace(/[a-z]/gi, c => {
      const base = c <= 'Z' ? 65 : 97;
      const k = key.charCodeAt(j % key.length) - 65;
      j++;
      return String.fromCharCode(((c.charCodeAt(0) - base + k) % 26) + base);
    });
  }
  function vigenereDecrypt(text, key) {
    if (!/^[a-zA-Z]+$/.test(key)) return 'Key must be letters only';
    key = key.toUpperCase();
    let j = 0;
    return text.replace(/[a-z]/gi, c => {
      const base = c <= 'Z' ? 65 : 97;
      const k = key.charCodeAt(j % key.length) - 65;
      j++;
      return String.fromCharCode(((c.charCodeAt(0) - base - k + 26) % 26) + base);
    });
  }

  // AES Encryption/Decryption using Web Crypto API
  async function aesEncrypt(text, password) {
    if (!password) return 'Password required';
    const pwUtf8 = new TextEncoder().encode(password);
    const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const alg = { name: 'AES-GCM', iv: iv };
    const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['encrypt']);
    const encoded = new TextEncoder().encode(text);
    const encrypted = await crypto.subtle.encrypt(alg, key, encoded);
    const buffer = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + buffer.length);
    combined.set(iv);
    combined.set(buffer, iv.length);
    return btoa(String.fromCharCode(...combined));
  }

  async function aesDecrypt(data, password) {
    if (!password) return 'Password required';
    try {
      const raw = atob(data);
      const combined = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) combined[i] = raw.charCodeAt(i);
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      const pwUtf8 = new TextEncoder().encode(password);
      const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);
      const alg = { name: 'AES-GCM', iv: iv };
      const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt']);
      const decrypted = await crypto.subtle.decrypt(alg, key, encrypted);
      return new TextDecoder().decode(decrypted);
    } catch {
      return 'Decryption failed or invalid input';
    }
  }

  encryptBtn.addEventListener('click', async () => {
    const method = methodSelect.value;
    const key = keyInput.value.trim();
    const text = textInput.value;
    if (!text) {
      outputArea.value = 'Enter input text';
      return;
    }
    if (method === 'caesar') {
      outputArea.value = caesarEncrypt(text, key);
    } else if (method === 'vigenere') {
      outputArea.value = vigenereEncrypt(text, key);
    } else if (method === 'aes') {
      outputArea.value = 'Encrypting...';
      const result = await aesEncrypt(text, key);
      outputArea.value = result;
    }
  });

  decryptBtn.addEventListener('click', async () => {
    const method = methodSelect.value;
    const key = keyInput.value.trim();
    const text = textInput.value;
    if (!text) {
      outputArea.value = 'Enter input text';
      return;
    }
    if (method === 'caesar') {
      outputArea.value = caesarDecrypt(text, key);
    } else if (method === 'vigenere') {
      outputArea.value = vigenereDecrypt(text, key);
    } else if (method === 'aes') {
      outputArea.value = 'Decrypting...';
      const result = await aesDecrypt(text, key);
      outputArea.value = result;
    }
  });
}

createCryptoPlayground();
