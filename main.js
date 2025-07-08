// matrix effect
const c=document.getElementById('matrix'),
      ctx=c.getContext('2d');
c.width=innerWidth; c.height=innerHeight;
const fontSize=18,
      columns=Math.floor(c.width/fontSize),
      drops=Array(columns).fill(0),
      charset='01';
function draw(){
  ctx.fillStyle='rgba(0,0,0,0.05)';
  ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle='#ff003c';
  ctx.font=fontSize+'px monospace';
  for(let i=0;i<columns;i++){
    const text=charset[Math.floor(Math.random()*charset.length)];
    ctx.fillText(text,i*fontSize,drops[i]*fontSize);
    drops[i] = drops[i]*fontSize>c.height && Math.random()>0.98 ? 0 : drops[i]+1;
  }
}
setInterval(draw,50);
window.onresize = ()=>{c.width=innerWidth; c.height=innerHeight;};

// nav hide on scroll
let lastY=0;
const nav=document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  nav.style.top = y>lastY&&y>100 ? '-80px' : '0';
  lastY=y;
});

// expand buttons
document.querySelectorAll('.expand-btn').forEach(btn=>{
  btn.onclick=e=>{
    const b=e.target.closest('.bubble');
    b.classList.toggle('expanded');
    e.target.textContent = b.classList.contains('expanded') ? 'Show Less' : 'Read More';
    if(b.classList.contains('expanded')) setTimeout(()=>b.scrollIntoView({behavior:'smooth',block:'start'}),300);
  };
});

// crypto functionality
const methodEl=document.getElementById('crypto-method'),
      labelEl=document.getElementById('crypto-label'),
      keyEl=document.getElementById('crypto-key'),
      inputEl=document.getElementById('crypto-input'),
      outputEl=document.getElementById('crypto-output');
methodEl?.addEventListener('change',()=>{
  labelEl.textContent = methodEl.value==='caesar' ? 'Shift (1–26)' : 'Key/Password';
});
function caesar(str,shift,dec=false){
  shift = parseInt(shift);
  if(dec) shift = (26-shift)%26;
  return str.replace(/[a-z]/gi,c=>{
    const base = c<='Z'?65:97;
    return String.fromCharCode((c.charCodeAt(0)-base+shift)%26+base);
  });
}
window.encrypt = ()=>{
  let m=methodEl.value, k=keyEl.value, txt=inputEl.value;
  if(m==='caesar') outputEl.value = caesar(txt,k);
  else if(m==='xor') {
    let res='';
    for(let i=0;i<txt.length;i++) res += String.fromCharCode(txt.charCodeAt(i)^k.charCodeAt(i%k.length));
    outputEl.value = res;
  } else {
    outputEl.value = btoa(txt);
  }
};
window.decrypt = ()=>{
  let m=methodEl.value, k=keyEl.value, txt=inputEl.value;
  if(m==='caesar') outputEl.value = caesar(txt,k,true);
  else if(m==='xor') window.encrypt(); // symmetric
  else {
    try { outputEl.value = atob(txt); }
    catch { outputEl.value = 'Invalid Base64'; }
  }
};
window.copyOutput = ()=>{
  outputEl.select();
  document.execCommand('copy');
};
