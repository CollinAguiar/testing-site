"use strict";

const matrixCanvas = document.getElementById("matrix");
const ctx = matrixCanvas.getContext("2d");
let width, height, fontSize, columns, drops;

function resizeCanvas() {
  width = matrixCanvas.width = window.innerWidth;
  height = matrixCanvas.height = window.innerHeight;
  fontSize = 16;
  columns = Math.floor(width / fontSize);
  drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * height / fontSize);
  }
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const matrixChars = "01";

function drawMatrix() {
  ctx.fillStyle = "rgba(10, 10, 10, 0.1)";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#ff003c";
  ctx.font = fontSize + "px 'Share Tech Mono', monospace";
  for (let i = 0; i < drops.length; i++) {
    let text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
  requestAnimationFrame(drawMatrix);
}
drawMatrix();

const navBar = document.getElementById("navBar");
let lastScrollTop = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  if (currentScroll > lastScrollTop && currentScroll > 150) {
    navBar.classList.add("hidden");
  } else {
    navBar.classList.remove("hidden");
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

document.querySelectorAll(".expand-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".card, .goal-bubble");
    if (!card) return;

    const isExpanded = card.getAttribute("data-expanded") === "true";

    // Collapse all other expanded cards
    document.querySelectorAll(".card[data-expanded='true'], .goal-bubble[data-expanded='true']").forEach((c) => {
      if (c !== card) {
        c.setAttribute("data-expanded", "false");
      }
    });

    if (isExpanded) {
      card.setAttribute("data-expanded", "false");
      e.target.textContent = "READ MORE";
    } else {
      card.setAttribute("data-expanded", "true");
      e.target.textContent = "READ LESS";
      card.scrollIntoView({behavior: "smooth", block: "center"});
    }
  });
});
