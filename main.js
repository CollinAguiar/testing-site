// MATRIX EFFECT
const canvas = document.getElementById('matrix')
const ctx = canvas.getContext('2d')

let width = window.innerWidth
let height = window.innerHeight
canvas.width = width
canvas.height = height

const letters = ['0', '1']
const fontSize = 14
const columns = Math.floor(width / fontSize)
const drops = new Array(columns).fill(1)

function drawMatrix() {
  ctx.fillStyle = 'rgba(0,0,0,0.08)'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#ff003c'
  ctx.font = `${fontSize}px monospace`
  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)]
    ctx.fillText(text, i * fontSize, drops[i] * fontSize)
    if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0
    drops[i]++
  }
}
setInterval(drawMatrix, 50)
window.addEventListener('resize', () => {
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = width
  canvas.height = height
})

// NAVBAR HIDE ON SCROLL
const nav = document.querySelector('nav')
let lastScroll = 0
window.addEventListener('scroll', () => {
  let currentScroll = window.pageYOffset
  if (currentScroll <= 0) nav.classList.remove('hide')
  else if (currentScroll > lastScroll) nav.classList.add('hide')
  else nav.classList.remove('hide')
  lastScroll = currentScroll
})

// CARD AND BUBBLE EXPAND/COLLAPSE
function setupExpandable(selector) {
  const containers = document.querySelectorAll(selector)
  containers.forEach(container => {
    const readMoreBtn = container.querySelector('.read-more')
    const fullContent = container.querySelector('.full-content')
    if (!readMoreBtn || !fullContent) return
    readMoreBtn.addEventListener('click', e => {
      e.stopPropagation()
      const expanded = fullContent.style.display === 'block'
      fullContent.style.display = expanded ? 'none' : 'block'
      readMoreBtn.textContent = expanded ? 'Read More' : 'Read Less'
      if (selector === '.bubble') {
        container.style.zIndex = expanded ? '' : '20'
      }
    })
    // Also toggle on whole container click except on readMore button
    container.addEventListener('click', e => {
      if (e.target === readMoreBtn) return
      readMoreBtn.click()
    })
  })
}
setupExpandable('.card')
setupExpandable('.bubble')

// VANILLATILT INIT
VanillaTilt.init(document.querySelectorAll('.card[data-tilt]'), {
  max: 15,
  speed: 500,
  glare: true,
  'max-glare': 0.3,
})

// RESUME PREVIEW TOGGLE
const previewBtn = document.getElementById('resumePreviewBtn')
const resumeEmbed = document.getElementById('resumePreview')
const downloadBtn = document.getElementById('resumeDownloadBtn')

if (previewBtn && resumeEmbed && downloadBtn) {
  previewBtn.addEventListener('click', () => {
    const isVisible = resumeEmbed.style.display === 'block'
    resumeEmbed.style.display = isVisible ? 'none' : 'block'
    previewBtn.textContent = isVisible ? 'Preview Resume' : 'Hide Resume'
    downloadBtn.style.display = isVisible ? 'none' : 'inline-block'
    if (!isVisible) resumeEmbed.scrollIntoView({behavior: 'smooth'})
  })
  downloadBtn.style.display = 'none'
}

// CRYPTO PLAYGROUND ADAPTIVE INPUT LABEL
const cryptoSelect = document.getElementById('cryptoMethod')
const keyLabel = document.getElementById('cryptoKeyLabel')
const cryptoInput = document.getElementById('cryptoKeyInput')

if (cryptoSelect && keyLabel && cryptoInput) {
  function updateKeyLabel() {
    const val = cryptoSelect.value
    if (val === 'caesar') keyLabel.textContent = 'Shift (1-26)'
    else if (val === 'vigenere') keyLabel.textContent = 'Key (A-Z)'
    else if (val === 'xor') keyLabel.textContent = 'Key (string)'
    else keyLabel.textContent = 'Key/Password'
  }
  cryptoSelect.addEventListener('change', updateKeyLabel)
  updateKeyLabel()
}

// CRYPTO PLAYGROUND FUNCTIONALITY
const cryptoInputText = document.getElementById('cryptoInput')
const cryptoOutputText = document.getElementById('cryptoOutput')
const cryptoEncryptBtn = document.getElementById('cryptoEncrypt')
const cryptoDecryptBtn = document.getElementById('cryptoDecrypt')

function caesarShift(str, amount) {
  if (amount < 0) return caesarShift(str, amount + 26)
  return str.replace(/[a-z]/gi, c => {
    const code = c.charCodeAt()
    let base = code >= 65 && code <= 90 ? 65 : 97
    return String.fromCharCode(((code - base + amount) % 26) + base)
  })
}

function vigenereCipher(str, key, encrypt = true) {
  key = key.toUpperCase().replace(/[^A-Z]/g, '')
  if (!key) return str
  let result = ''
  let ki = 0
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    const isUpper = c >= 65 && c <= 90
    const isLower = c >= 97 && c <= 122
    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97
      const keyChar = key.charCodeAt(ki % key.length) - 65
      const shift = encrypt ? keyChar : 26 - keyChar
      const ch = String.fromCharCode(((c - base + shift) % 26) + base)
      result += ch
      ki++
    } else result += str.charAt(i)
  }
  return result
}

function xorCipher(str, key) {
  if (!key) return str
  let output = ''
  for (let i = 0; i < str.length; i++) {
    output += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return output
}

cryptoEncryptBtn.addEventListener('click', () => {
  const method = cryptoSelect.value
  const input = cryptoInputText.value
  const key = cryptoInput.value
  let output = ''
  if (!input) {
    cryptoOutputText.value = ''
    return
  }
  switch(method) {
    case 'caesar':
      const shift = parseInt(key)
      if (isNaN(shift) || shift < 1 || shift > 26) {
        alert('Shift must be a number between 1 and 26')
        return
      }
      output = caesarShift(input, shift)
      break
    case 'vigenere':
      output = vigenereCipher(input, key, true)
      break
    case 'xor':
      output = xorCipher(input, key)
      break
    default:
      output = input
  }
  cryptoOutputText.value = output
})

cryptoDecryptBtn.addEventListener('click', () => {
  const method = cryptoSelect.value
  const input = cryptoInputText.value
  const key = cryptoInput.value
  let output = ''
  if (!input) {
    cryptoOutputText.value = ''
    return
  }
  switch(method) {
    case 'caesar':
      const shift = parseInt(key)
      if (isNaN(shift) || shift < 1 || shift > 26) {
        alert('Shift must be a number between 1 and 26')
        return
      }
      output = caesarShift(input, 26 - shift)
      break
    case 'vigenere':
      output = vigenereCipher(input, key, false)
      break
    case 'xor':
      output = xorCipher(input, key)
      break
    default:
      output = input
  }
  cryptoOutputText.value = output
})

// NETWORK PACKET VISUALIZER ANIMATION
const networkContainer = document.getElementById('networkVisualizer')
if (networkContainer) {
  const colors = ['#ff003c', '#ff6699', '#cc0033']
  function createPacket() {
    const packet = document.createElement('div')
    packet.classList.add('packet')
    packet.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)]
    packet.style.left = '0'
    packet.style.top = (Math.random() * 100) + '%'
    networkContainer.appendChild(packet)
    packet.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(100vw)' }
    ], {
      duration: 3500 + Math.random() * 1500,
      easing: 'ease-in-out'
    })
    setTimeout(() => {
      networkContainer.removeChild(packet)
    }, 5000)
  }
  setInterval(createPacket, 700)
}

// HARDWARE IMAGES MODAL
const hardwareModal = document.getElementById('hardwareModal')
const hardwareOpenBtn = document.getElementById('hardwareReadMore')
const hardwareCloseBtn = document.getElementById('hardwareModalClose')

if (hardwareOpenBtn && hardwareModal && hardwareCloseBtn) {
  hardwareOpenBtn.addEventListener('click', e => {
    e.stopPropagation()
    hardwareModal.style.display = 'flex'
    document.body.style.overflow = 'hidden'
  })
  hardwareCloseBtn.addEventListener('click', () => {
    hardwareModal.style.display = 'none'
    document.body.style.overflow = ''
  })
  hardwareModal.addEventListener('click', e => {
    if (e.target === hardwareModal) {
      hardwareModal.style.display = 'none'
      document.body.style.overflow = ''
    }
  })
}

// RESUME PREVIEW TOGGLE
const resumePreviewBtn = document.getElementById('resumePreviewBtn')
const resumePreviewFrame = document.getElementById('resumePreview')
const resumeDownloadBtn = document.getElementById('resumeDownloadBtn')

if (resumePreviewBtn && resumePreviewFrame && resumeDownloadBtn) {
  resumePreviewBtn.addEventListener('click', () => {
    const isVisible = resumePreviewFrame.style.display === 'block'
    resumePreviewFrame.style.display = isVisible ? 'none' : 'block'
    resumePreviewBtn.textContent = isVisible ? 'Preview Resume' : 'Hide Resume'
    resumeDownloadBtn.style.display = isVisible ? 'none' : 'inline-block'
    if (!isVisible) resumePreviewFrame.scrollIntoView({behavior: 'smooth'})
  })
  resumeDownloadBtn.style.display = 'none'
}
