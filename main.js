VanillaTilt.init(document.querySelectorAll(".card"), {
  max: 10,
  speed: 400,
  glare: true,
  "max-glare": 0.2
})

const nav = document.getElementById("navbar")
let lastScrollY = window.scrollY

window.addEventListener("scroll", () => {
  if (window.scrollY > lastScrollY) {
    nav.style.top = "-80px"
  } else {
    nav.style.top = "0"
  }
  lastScrollY = window.scrollY
})

function expandCard(card) {
  const isExpanded = card.classList.contains("expanded")
  document.querySelectorAll(".card").forEach(c => c.classList.remove("expanded"))
  if (!isExpanded) card.classList.add("expanded")
}

function simulateScan() {
  const target = document.getElementById("vulnTarget").value
  const out = document.getElementById("vulnOutput")
  out.textContent = `Scanning ${target}...
Open Ports:
 - 22 (SSH)
 - 80 (HTTP)
 - 443 (HTTPS)

Detected Issues:
 - Directory listing on /admin
 - Outdated SSL certificate
 - Weak SSH password policy
`
}

function updateCryptoInputs() {
  const method = document.getElementById("cryptoMethod").value
  const keyInput = document.getElementById("cryptoKey")
  keyInput.placeholder = method === "caesar" ? "Shift (1-26)" : "Keyword"
}

function encryptMessage() {
  const method = document.getElementById("cryptoMethod").value
  const key = document.getElementById("cryptoKey").value
  const msg = document.getElementById("cryptoMessage").value
  let out = ""

  if (method === "caesar") {
    const shift = parseInt(key) || 0
    out = msg.replace(/[a-z]/gi, c => {
      const base = c >= "a" ? 97 : 65
      return String.fromCharCode((c.charCodeAt(0) - base + shift) % 26 + base)
    })
  } else if (method === "vigenere") {
    let i = 0
    out = msg.replace(/[a-z]/gi, c => {
      const base = c >= "a" ? 97 : 65
      const k = key[i++ % key.length].toLowerCase().charCodeAt(0) - 97
      return String.fromCharCode((c.charCodeAt(0) - base + k) % 26 + base)
    })
  }

  document.getElementById("cryptoResult").textContent = out
}

function startPacketAnimation() {
  const packet = document.getElementById("packet1")
  packet.style.transition = "left 3s ease-in-out"
  packet.style.left = "90%"
  setTimeout(() => {
    packet.style.transition = "none"
    packet.style.left = "0"
  }, 4000)
}

const canvas = document.getElementById("matrix")
const ctx = canvas.getContext("2d")
let width, height, columns, drops

function resizeCanvas() {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
  columns = Math.floor(width / 14)
  drops = Array(columns).fill(1)
}
resizeCanvas()
window.addEventListener("resize", resizeCanvas)

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = "#ff003c"
  ctx.font = "14px monospace"
  for (let i = 0; i < drops.length; i++) {
    const text = "01"[Math.floor(Math.random() * 2)]
    ctx.fillText(text, i * 14, drops[i] * 14)
    if (drops[i] * 14 > height && Math.random() > 0.975) drops[i] = 0
    drops[i]++
  }
  requestAnimationFrame(drawMatrix)
}
drawMatrix()