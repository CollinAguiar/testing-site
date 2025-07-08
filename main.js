const nav = document.getElementById('topNav')
let lastScroll = 0
window.addEventListener('scroll',()=>{
  const sc = window.pageYOffset
  nav.classList.toggle('hide', sc>lastScroll && sc>100)
  lastScroll = sc
})
const io = new IntersectionObserver(e=>e.forEach(o=>o.isIntersecting&&o.target.classList.add('is-visible')))
document.querySelectorAll('.fade-up').forEach(el=>io.observe(el))
VanillaTilt.init(document.querySelectorAll('[data-tilt]'))
const canvas = document.getElementById('matrix'),ctx=canvas.getContext('2d')
let w,h,fontSize=14,cols,drops
function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight;cols=Math.floor(w/fontSize);drops=Array(cols).fill(1)}
resize();window.addEventListener('resize',resize)
function draw(){ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,w,h);ctx.fillStyle='#ff003c';ctx.font=fontSize+'px monospace';drops.forEach((y,i)=>{const txt=Math.random()<0.5?'0':'1';ctx.fillText(txt,i*fontSize,y*fontSize);drops[i]=y*fontSize>h&&Math.random()>0.975?0:y+1});requestAnimationFrame(draw)}
draw()
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('click',()=>{
    card.querySelector('.full').classList.toggle('hidden')
  })
})
function checkPassword(){
  const pw=document.getElementById('pwInput').value, out=document.getElementById('pwOutput')
  let s=0
  if(pw.length>=8) s+=2
  if(/[A-Z]/.test(pw)) s+=2
  if(/[a-z]/.test(pw)) s+=2
  if(/\d/.test(pw)) s+=2
  if(/[\W_]/.test(pw)) s+=2
  out.textContent = 'Password Strength: '+(s>=8?'Strong':s>=5?'Moderate':'Weak')
}
