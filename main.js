const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('is-visible')
  })
})
document.querySelectorAll('.fade-up').forEach(el => io.observe(el))
VanillaTilt.init(document.querySelectorAll('[data-tilt]'))

const c = document.getElementById('matrix')
const ctx = c.getContext('2d')
let w, h, font = 14, columns, drops
function resize() {
  w = c.width = window.innerWidth
  h = c.height = window.innerHeight
  columns = Math.floor(w / font)
  drops = Array(columns).fill(1)
}
resize()
window.addEventListener('resize', resize)

const chars = '01'
function draw() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#ff003c'
  ctx.font = font + 'px monospace'
  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)]
    ctx.fillText(text, i * font, drops[i] * font)
    if (drops[i] * font > h && Math.random() > 0.975) drops[i] = 0
    drops[i]++
  }
  requestAnimationFrame(draw)
}
draw()

let lastScroll = 0
const nav = document.getElementById('topNav')
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset
  if (currentScroll > lastScroll && currentScroll > 100) {
    nav.classList.add('hide')
  } else {
    nav.classList.remove('hide')
  }
  lastScroll = currentScroll
})

function toggleDemo(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (el.classList.contains('hidden')) {
    document.querySelectorAll('.demo-container').forEach(d => d.classList.add('hidden'))
    el.classList.remove('hidden')
  } else {
    el.classList.add('hidden')
  }
}

function checkPassword() {
  const pw = document.getElementById('pwInput').value
  const output = document.getElementById('pwOutput')
  let score = 0
  if (pw.length >= 8) score += 2
  if (/[A-Z]/.test(pw)) score += 2
  if (/[a-z]/.test(pw)) score += 2
  if (/\d/.test(pw)) score += 2
  if (/[\W_]/.test(pw)) score += 2
  let strength = 'Weak'
  if (score >= 8) strength = 'Strong'
  else if (score >= 5) strength = 'Moderate'
  output.textContent = `Password Strength: ${strength}`
}
