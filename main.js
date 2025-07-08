const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('is-visible');
  });
});

document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
  max: 8,
  speed: 400,
  glare: true,
  'max-glare': 0.3,
});

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

// Hide navbar on scroll down, show on scroll up
let lastScrollTop = 0;
const nav = document.querySelector('nav');
const footer = document.querySelector('footer');
footer.style.display = 'block';

window.addEventListener('scroll', () => {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  if (st > lastScrollTop && st > 100) {
    nav.classList.add('hide');
  } else {
    nav.classList.remove('hide');
  }
  lastScrollTop = st <= 0 ? 0 : st;
});

// XSS Demo Lab functionality
const xssInput = document.getElementById('xss-input');
const xssOutput = document.getElementById('xss-output');
const xssRunBtn = document.getElementById('xss-run');
const xssClearBtn = document.getElementById('xss-clear');
const xssEnableScripts = document.getElementById('xss-enable-scripts');

function runXSSDemo() {
  const allowScripts = xssEnableScripts.checked;
  const userInput = xssInput.value;

  let iframeDoc = xssOutput.contentDocument || xssOutput.contentWindow.document;
  iframeDoc.open();
  if (allowScripts) {
    iframeDoc.write(userInput);
  } else {
    // Escape script tags to prevent execution
    let escaped = userInput
      .replace(/<script/gi, '&lt;script')
      .replace(/<\/script>/gi, '&lt;/script&gt;');
    iframeDoc.write(escaped);
  }
  iframeDoc.close();
}

xssRunBtn.addEventListener('click', runXSSDemo);

xssClearBtn.addEventListener('click', () => {
  xssInput.value = '';
  let iframeDoc = xssOutput.contentDocument || xssOutput.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write('');
  iframeDoc.close();
});
