document.addEventListener('DOMContentLoaded', () => {
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'));

  // Matrix background
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

  // Expandable cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const btn = card.querySelector('.expand-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const content = card.querySelector('.expandable-content');
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        btn.textContent = 'Launch Tool';
      } else {
        // Collapse other expanded cards
        document.querySelectorAll('.expandable-content').forEach(c => {
          if (c !== content) {
            c.style.maxHeight = null;
            const siblingBtn = c.parentElement.querySelector('.expand-btn');
            if (siblingBtn) siblingBtn.textContent = 'Launch Tool';
          }
        });

        if (card.querySelector('h3').textContent.includes('Cryptography Playground')) {
          loadCryptoPlayground(content);
        } else if (card.querySelector('h3').textContent.includes('Network Packet Visualizer')) {
          loadNetworkVisualizer(content);
        }

        content.style.maxHeight = content.scrollHeight + 'px';
        btn.textContent = 'Close Tool';
      }
    });
  });

  function loadCryptoPlayground(container) {
    container.innerHTML = `
      <div class="crypto-container">
        <label for="cipher-select">Cipher:</label>
        <select id="cipher-select">
          <option value="caesar">Caesar Cipher</option>
          <option value="vigenere">Vigenère Cipher</option>
          <option value="base64">Base64</option>
          <option value="xor">XOR Cipher</option>
        </select>
        <label for="crypto-input">Input Text:</label>
        <textarea id="crypto-input" rows="3"></textarea>
        <label for="key-input" id="key-label">Shift (1-26)</label>
        <input type="text" id="key-input" placeholder="Shift (1-26)" />
        <div class="crypto-buttons">
          <button id="encrypt-btn">Encrypt</button>
          <button id="decrypt-btn">Decrypt</button>
        </div>
        <label for="crypto-output">Output:</label>
        <textarea id="crypto-output" rows="3" readonly></textarea>
      </div>
    `;

    const cipherSelect = container.querySelector('#cipher-select');
    const inputText = container.querySelector('#crypto-input');
    const keyInput = container.querySelector('#key-input');
    const keyLabel = container.querySelector('#key-label');
    const output = container.querySelector('#crypto-output');
    const encryptBtn = container.querySelector('#encrypt-btn');
    const decryptBtn = container.querySelector('#decrypt-btn');

    function updateKeyInput() {
      if (cipherSelect.value === 'caesar') {
        keyInput.placeholder = 'Shift (1-26)';
        keyInput.type = 'number';
        keyInput.min = 1;
        keyInput.max = 26;
        keyInput.value = '';
        keyInput.removeAttribute('readonly');
        keyLabel.textContent = 'Shift (1-26)';
      } else if (cipherSelect.value === 'vigenere') {
        keyInput.placeholder = 'Key (letters only)';
        keyInput.type = 'text';
        keyInput.value = '';
        keyInput.removeAttribute('readonly');
        keyLabel.textContent = 'Key (letters only)';
      } else if (cipherSelect.value === 'base64') {
        keyInput.placeholder = 'No key needed';
        keyInput.type = 'text';
        keyInput.value = '';
        keyInput.setAttribute('readonly', 'readonly');
        keyLabel.textContent = 'No key needed';
      } else if (cipherSelect.value === 'xor') {
        keyInput.placeholder = 'Key (any text)';
        keyInput.type = 'text';
        keyInput.value = '';
        keyInput.removeAttribute('readonly');
        keyLabel.textContent = 'Key (any text)';
      }
      output.value = '';
    }
    updateKeyInput();
    cipherSelect.addEventListener('change', updateKeyInput);

    function caesar(str, shift, decrypt = false) {
      if (decrypt) shift = 26 - shift;
      let out = '';
      for (let c of str) {
        let code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          out += String.fromCharCode((code - 65 + shift) % 26 + 65);
        } else if (code >= 97 && code <= 122) {
          out += String.fromCharCode((code - 97 + shift) % 26 + 97);
        } else out += c;
      }
      return out;
    }

    function vigenere(str, key, decrypt = false) {
      key = key.toLowerCase();
      let out = '';
      for (let i = 0, j = 0; i < str.length; i++) {
        let c = str[i];
        let code = c.charCodeAt(0);
        if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
          let base = code >= 97 ? 97 : 65;
          let keyVal = key.charCodeAt(j % key.length) - 97;
          if (decrypt) keyVal = 26 - keyVal;
          out += String.fromCharCode((code - base + keyVal) % 26 + base);
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

    encryptBtn.onclick = () => {
      const text = inputText.value;
      const k = keyInput.value;
      if (cipherSelect.value === 'base64') {
        output.value = base64Encode(text);
        return;
      }
      if (cipherSelect.value === 'caesar') {
        const shift = parseInt(k);
        if (isNaN(shift) || shift < 1 || shift > 26) {
          output.value = 'Please enter a valid shift between 1 and 26.';
          return;
        }
        output.value = caesar(text, shift, false);
        return;
      }
      if (cipherSelect.value === 'vigenere') {
        if (!k.match(/^[a-zA-Z]+$/)) {
          output.value = 'Key must contain letters only.';
          return;
        }
        output.value = vigenere(text, k, false);
        return;
      }
      if (cipherSelect.value === 'xor') {
        if (!k) {
          output.value = 'Please enter a key for XOR cipher.';
          return;
        }
        output.value = xorCipher(text, k);
        return;
      }
    };

    decryptBtn.onclick = () => {
      const text = inputText.value;
      const k = keyInput.value;
      if (cipherSelect.value === 'base64') {
        output.value = base64Decode(text);
        return;
      }
      if (cipherSelect.value === 'caesar') {
        const shift = parseInt(k);
        if (isNaN(shift) || shift < 1 || shift > 26) {
          output.value = 'Please enter a valid shift between 1 and 26.';
          return;
        }
        output.value = caesar(text, shift, true);
        return;
      }
      if (cipherSelect.value === 'vigenere') {
        if (!k.match(/^[a-zA-Z]+$/)) {
          output.value = 'Key must contain letters only.';
          return;
        }
        output.value = vigenere(text, k, true);
        return;
      }
      if (cipherSelect.value === 'xor') {
        if (!k) {
          output.value = 'Please enter a key for XOR cipher.';
          return;
        }
        output.value = xorCipher(text, k);
        return;
      }
    };
  }

  function loadNetworkVisualizer(container) {
    container.innerHTML = `
      <div class="network-visualizer">
        <div class="packet" style="--delay: 0s; --x: 10%; --y: 20%;"></div>
        <div class="packet" style="--delay: 1s; --x: 30%; --y: 40%;"></div>
        <div class="packet" style="--delay: 2s; --x: 50%; --y: 60%;"></div>
        <div class="packet" style="--delay: 3s; --x: 70%; --y: 30%;"></div>
        <div class="packet" style="--delay: 4s; --x: 90%; --y: 50%;"></div>
      </div>
    `;
  }
});
