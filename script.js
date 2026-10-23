document.addEventListener("DOMContentLoaded",()=>{
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const yearEl=document.getElementById("year");if(yearEl)yearEl.textContent=new Date().getFullYear();

const toggle=document.querySelector(".nav-toggle"),menu=document.getElementById("nav-menu");
function setMenu(o){menu.classList.toggle("open",o);toggle.setAttribute("aria-expanded",String(o));toggle.setAttribute("aria-label",o?"Close menu":"Open menu")}
toggle.addEventListener("click",()=>setMenu(toggle.getAttribute("aria-expanded")!=="true"));
menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));
document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});
window.matchMedia("(min-width: 901px)").addEventListener("change",e=>{if(e.matches)setMenu(false)});

const navLinks=document.querySelectorAll(".nav-links a");
const io=new IntersectionObserver(es=>{es.forEach(en=>{if(!en.isIntersecting)return;navLinks.forEach(l=>l.classList.toggle("active",l.getAttribute("href")==="#"+en.target.id))})},{rootMargin:"-30% 0px -60% 0px",threshold:0});
document.querySelectorAll("main section, main header").forEach(s=>io.observe(s));

if(window.matchMedia("(hover: hover) and (pointer: fine)").matches&&!reduceMotion){
document.querySelectorAll(".skill-card").forEach(c=>{
c.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;c.style.transform=`perspective(1000px) rotateX(${y/(r.height/2)*-6}deg) rotateY(${x/(r.width/2)*6}deg) scale(1.02)`});
c.addEventListener("mouseleave",()=>{c.style.transform=""})})}

const canvas=document.getElementById("animation-canvas"),ctx=canvas.getContext("2d");
const palette=["255,0,127","0,240,255","168,85,247"],alphas=[.16,.14,.12];
let w=0,h=0,ps=[],raf=null;
function draw(){ctx.clearRect(0,0,w,h);for(const p of ps){const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,`rgba(${p.rgb},${p.a})`);g.addColorStop(1,`rgba(${p.rgb},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}}
function resize(){const d=Math.min(window.devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);draw()}
function make(){const n=w<600?10:w<1100?16:22;ps=Array.from({length:n},()=>{const c=Math.floor(Math.random()*3);return{x:Math.random()*w,y:Math.random()*h,r:Math.random()*120+80,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,rgb:palette[c],a:alphas[c]}})}
function step(){for(const p of ps){p.x+=p.vx;p.y+=p.vy;if(p.x-p.r>w)p.x=-p.r;if(p.x+p.r<0)p.x=w+p.r;if(p.y-p.r>h)p.y=-p.r;if(p.y+p.r<0)p.y=h+p.r}draw();raf=requestAnimationFrame(step)}
function start(){if(!raf&&!reduceMotion)raf=requestAnimationFrame(step)}
function stop(){if(raf){cancelAnimationFrame(raf);raf=null}}
let t;addEventListener("resize",()=>{clearTimeout(t);t=setTimeout(()=>{resize();make();draw()},150)});
document.addEventListener("visibilitychange",()=>document.hidden?stop():start());
resize();make();draw();start();
});
