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

document.getElementById('vulnForm').addEventListener('submit', e => {
  e.preventDefault();
  const url = document.getElementById('vulnUrl').value;
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

function caesar(str, shift, decrypt=false) {
  return str.replace(/[A-Za-z]/g, c => {
    const base = c<='Z'?'A':'a';
    const offset = c.charCodeAt(0) - base.charCodeAt(0);
    const shiftVal = decrypt ? (offset - shift + 26)%26 : (offset + shift)%26;
    return String.fromCharCode(shiftVal + base.charCodeAt(0));
  });
}

function vigenere(str, pw, decrypt=false) {
  let out='', j=0;
  for (let i=0;i<str.length;i++){
    const c=str[i];
    if (/[A-Za-z]/.test(c)){
      const base = c<='Z'?'A':'a';
      const p = pw[j%pw.length].toLowerCase().charCodeAt(0)-97;
      const offset = c.charCodeAt(0)-base.charCodeAt(0);
      const shiftVal = decrypt ? (offset - p +26)%26 : (offset + p)%26;
      out += String.fromCharCode(shiftVal+base.charCodeAt(0));
      j++;
    } else out+=c;
  }
  return out;
}

document.getElementById('encrypt').onclick = () => {
  const text = input.value;
  const k = key.value;
  output.textContent = cipher.value === 'caesar'
    ? caesar(text, parseInt(k)||0, false)
    : vigenere(text, k, false);
};

document.getElementById('decrypt').onclick = () => {
  const text = input.value;
  const k = key.value;
  output.textContent = cipher.value === 'caesar'
    ? caesar(text, parseInt(k)||0, true)
    : vigenere(text, k, true);
};
