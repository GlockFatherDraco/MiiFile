// ┌─────────────┐
// │ Theme      │
// └─────────────┘
const k='theme',d=document,de=d.documentElement,b=d.getElementById('tgl');
const setT=t=>{de.setAttribute('data-theme',t);localStorage.setItem(k,t)};
setT(localStorage.getItem(k)||'light');
b.onclick=()=>setT(de.getAttribute('data-theme')==='dark'?'light':'dark');
// ┌─────────────┐
// │ BGM Audio  │
// └─────────────┘
const a=document.querySelector('audio');
window.addEventListener('click',()=>{a&&a.play()},{once:1});
// ┌─────────────┐
// │ Music UI   │
// └─────────────┘
const m=document.getElementById('msc'),c=document.querySelector('.msc-capsule'),f=document.querySelector('.msc-capsule-fill');
let o=0,g=0,v=0.5;
const setI=()=>m.classList.toggle('muted',a.volume<.01);
const setV=x=>{v=Math.max(0,Math.min(1,x));a.volume=v;setF(v);setI();c.setAttribute('aria-valuenow',Math.round(v*100));};
const setF=x=>{const h=c.offsetHeight||144;f.style.height=Math.round(h*x)+"px";f.style.background=x<.1?'linear-gradient(to top,#222,#444)':'linear-gradient(to top,var(--tx) 0%,var(--tx2) 100%)';};
const getV=y=>{const r=c.getBoundingClientRect();return Math.max(0,Math.min(1,1-(y-r.top)/r.height));};
setTimeout(()=>setV(.5),0);
c.onmousedown=e=>{g=1;setV(getV(e.clientY));};
d.onmousemove=e=>{g&&setV(getV(e.clientY));};
d.onmouseup=()=>{g=0;};
c.ontouchstart=e=>{g=1;setV(getV(e.touches[0].clientY));e.preventDefault();};
d.ontouchmove=e=>{g&&setV(getV(e.touches[0].clientY));};
d.ontouchend=()=>{g=0;};
c.onclick=e=>setV(getV(e.clientY));
c.onkeydown=e=>{
  if(e.key==='ArrowUp')setV(v+.05);
  if(e.key==='ArrowDown')setV(v-.05);
  if(e.key==='Home')setV(1);
  if(e.key==='End')setV(0);
  if(e.key===' '||e.key==='Enter')setV(v<.5?1:0);
};
m.onclick=()=>{o^=1;c.classList.toggle('open',!!o);o&&c.focus();};
m.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')m.click();};
d.addEventListener('click',e=>{if(o&&!m.contains(e.target)&&!c.contains(e.target)){c.classList.remove('open');o=0;}});
a.addEventListener('volumechange',()=>{setI();setF(a.volume);}); 