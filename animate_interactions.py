from pathlib import Path
import math, random, struct, wave
root=Path(__file__).parent/'dist'
# Un breve vagito sintetizzato, senza registrazioni di persone o dipendenze esterne.
rate=24000
rng=random.Random(31)
frames=bytearray()
phase=0.0
for i in range(int(rate*2.5)):
    t=i/rate
    value=0.0
    for start,duration,strength in [(0.10,.73,.78),(1.10,1.02,1.0)]:
        u=(t-start)/duration
        if 0<u<1:
            envelope=min(1,u/.09)*min(1,(1-u)/.16)*strength
            frequency=465+155*math.sin(math.pi*u)**.7-70*u+12*math.sin(2*math.pi*8*t)
            phase+=2*math.pi*frequency/rate
            voiced=0.0
            for harmonic in range(1,13):
                f=frequency*harmonic
                formants=.35+1.8*math.exp(-((f-1050)/380)**2)+1.2*math.exp(-((f-2850)/650)**2)
                voiced+=math.sin(phase*harmonic)*formants/(harmonic**1.45)
            value=envelope*(voiced*.22+(rng.random()-.5)*.055)
    frames.extend(struct.pack('<h',int(max(-.85,min(.85,value))*32767)))
with wave.open(str(root/'assets'/'nascita.wav'),'wb') as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(rate);wav.writeframes(frames)
p=root/'index.html'
s=p.read_text(encoding='utf-8')
s=s.replace('</style>', '''
.backdrop-layer{transform:scale(1.08);will-change:transform;animation:living-landscape 24s ease-in-out infinite alternate;animation-play-state:paused}.backdrop-layer.visible{animation-play-state:running}@keyframes living-landscape{0%{transform:scale(1.08) translate(-1.2%,.4%)}100%{transform:scale(1.17) translate(1.4%,-1%)}}
main .chapter p,main .last>p,main .hero .intro{transform:translateY(calc((1 - var(--approach,1))*24px)) scale(calc(.91 + var(--approach,1)*.16));transform-origin:left center;opacity:calc(.65 + var(--approach,1)*.35);will-change:transform}.final-heart .last>p{opacity:calc((.86 + var(--heart-pulse,0)*.14)*(.65 + var(--approach,1)*.35))}.chapter p{font-size:19px;line-height:1.8}.interaction-hint{position:fixed;bottom:85px;left:26px;max-width:330px;z-index:4;font-size:10px;line-height:1.6;letter-spacing:1px;color:#e4c8b5;background:#130b0cbf;padding:9px 12px;border-radius:4px}.interaction-hint span{display:block}.interaction-hint button{font:inherit;color:#f0c6b6;background:none;border:0;border-bottom:1px solid #77554a;padding:3px 0;margin:4px 12px 0 0;cursor:pointer}#interaction-status{color:#ffe7d1;min-height:16px;letter-spacing:.4px}.connected-cursor{cursor:crosshair}@media(max-width:700px){.interaction-hint{left:18px;bottom:73px;max-width:270px;font-size:9px;padding:7px 10px}.scene-label{top:78px;bottom:auto;right:18px}.chapter p{font-size:17px}.chapter p,main .last>p{transform-origin:center;transform:translateY(calc((1 - var(--approach,1))*16px)) scale(calc(.96 + var(--approach,1)*.07))}.chapter{padding-bottom:34px}}@media(prefers-reduced-motion:reduce){.backdrop-layer{animation:none;transform:none}main .chapter p,main .last>p,main .hero .intro{transform:none;opacity:1;will-change:auto}}
</style>''')
s=s.replace('<main>', '''<aside class="interaction-hint" aria-label="Interagisci con i chicchi"><span>Tocca un chicco: una vita incontra un’altra.<br>I più piccoli custodiscono una nascita.</span><button id="connect-seed" type="button">Collega un chicco</button><button id="birth-seed" type="button">Ascolta una nascita</button><span id="interaction-status" role="status" aria-live="polite"></span></aside><main>''',1)
p.write_text(s,encoding='utf-8')
p=root/'experience.js'
s=p.read_text(encoding='utf-8')
s=s.replace("const N=640,", "let projectedPoints=[],connections=[],pointerStart=null;\nconst readingParagraphs=[...document.querySelectorAll('main .chapter p, main .last>p, main .hero .intro')];\nconst N=640,",1)
s=s.replace("return{...p,from:{...p}","return{...p,id:i,from:{...p}",1)
s=s.replace("function update(){let next=0", "function update(){updateReading();let next=0",1)
s=s.replace("const pulse=pulseAmount();", "drawAtmosphere(time);const pulse=pulseAmount();",1)
s=s.replace("for(const {p,x,y,z,scale} of points)", "projectedPoints=points;drawConnections(time);\n for(const {p,x,y,z,scale} of points)",1)
s=s.replace("setSceneBackground();update();draw(0);", "setSceneBackground();update();draw(0);",1)
s=s.replace("else{clearInterval(timer);voices.forEach", "else{clearInterval(timer);if(birthSound){birthSound.pause();birthSound.currentTime=0}voices.forEach",1)
# Defined before initial draw/update, so initialization also works on a deep link.
insertion='''
function updateReading(){for(const paragraph of readingParagraphs){const r=paragraph.getBoundingClientRect();const approach=Math.max(0,Math.min(1,(h*.94-r.top)/(h*.64)));paragraph.style.setProperty('--approach',String(reduced?1:approach));}}
function drawAtmosphere(time){if(reduced||!backgroundFiles[active])return;const t=time*.001;ctx.save();
 if(active===3){ctx.strokeStyle='#cda35f';ctx.lineWidth=1;for(let i=0;i<45;i++){const x=(i/44)*w,y=h*(.84+(i%7)*.021),length=35+(i%6)*9,sway=Math.sin(t*.55+i*.7)*8;ctx.globalAlpha=.11;ctx.beginPath();ctx.moveTo(x,h+20);ctx.quadraticCurveTo(x+sway,y,x+sway*1.7,y-length);ctx.stroke();for(let j=0;j<4;j++){ctx.beginPath();ctx.ellipse(x+sway*1.7+(j%2?3:-3),y-length+j*5,2,5,j%2?.5:-.5,0,7);ctx.fillStyle='#d5ad6d';ctx.fill()}}}
 if(active===4){for(let i=0;i<34;i++){const life=((t*.10+i*.137)%1),x=w*(.65+Math.sin(i*19.1)*.27)+Math.sin(t+i)*15,y=h*(1-life);ctx.globalAlpha=Math.sin(life*Math.PI)*.38;ctx.fillStyle=i%3?'#e78a42':'#ffd9a0';ctx.beginPath();ctx.ellipse(x,y,1,2.5,Math.sin(i),0,7);ctx.fill()}}
 if(active===5||active===9){for(let i=0;i<25;i++){const x=((i*.173+t*.003)%1)*w,y=((i*.237-t*.006)%1+1)%1*h;ctx.globalAlpha=.08+.07*Math.sin(t*.6+i);ctx.fillStyle=active===9?'#ffdda4':'#c39a73';ctx.beginPath();ctx.arc(x,y,active===9?2+(i%3):1+(i%2),0,7);ctx.fill()}}
 ctx.restore();}
function drawConnections(time){const now=performance.now();connections=connections.filter(c=>now-c.created<15000);const byId=new Map(projectedPoints.map(p=>[p.p.id,p]));ctx.save();for(const c of connections){const from=byId.get(c.a),to=byId.get(c.b);if(!from||!to)continue;const age=(now-c.created)/15000,fade=Math.min(1,(now-c.created)/650)*Math.min(1,(1-age)*4);ctx.lineWidth=.65;ctx.strokeStyle=`rgba(255,221,186,${fade*.26})`;ctx.beginPath();ctx.moveTo(from.x,from.y);const bend=reduced?0:Math.sin(time*.0007+c.a)*8;ctx.quadraticCurveTo((from.x+to.x)/2,(from.y+to.y)/2+bend,to.x,to.y);ctx.stroke();ctx.strokeStyle=`rgba(255,231,205,${fade*.45})`;ctx.beginPath();ctx.arc(from.x,from.y,from.p.size*from.scale+4,0,7);ctx.stroke()}ctx.restore();}
'''
s=s.replace("function resize(){",insertion+"\nfunction resize(){",1)
s+='''
const interactionStatus=document.querySelector('#interaction-status');
const birthSound=document.createElement('audio');birthSound.src='assets/nascita.wav';birthSound.preload='auto';birthSound.volume=.42;
let lastBirth=-3000;
function status(message){interactionStatus.textContent=message;}
function connectSeed(point){if(!point)return;const nearest=projectedPoints.filter(q=>q.p.id!==point.p.id).sort((a,b)=>Math.hypot(a.x-point.x,a.y-point.y)-Math.hypot(b.x-point.x,b.y-point.y)).slice(0,5);const now=performance.now();for(const q of nearest){if(!connections.some(c=>(c.a===point.p.id&&c.b===q.p.id)||(c.b===point.p.id&&c.a===q.p.id)))connections.push({a:point.p.id,b:q.p.id,created:now})}if(connections.length>100)connections=connections.slice(-100);status(point.p.age===0?'Una piccola vita. Cinque nuovi legami.':'Ogni incontro lascia un filo.');if(reduced)draw(0);}
function playBirth(){if(!musicOn){status('Attiva l’audio, poi tocca un chicco piccolo.');return}const now=performance.now();if(now-lastBirth<2700)return;lastBirth=now;birthSound.currentTime=0;const promise=birthSound.play();if(promise)promise.then(()=>status('Una nascita. Una nuova possibilità.')).catch(()=>status('Premi “Attiva l’audio” per ascoltare.'));}
function seedAt(x,y){let best=null,score=Infinity;for(const point of projectedPoints){const distance=Math.hypot(point.x-x,point.y-y),radius=Math.max(w<700?11:8,point.p.size*point.scale*1.25);if(distance<=radius&&distance-point.z*1.3<score){score=distance-point.z*1.3;best=point}}return best;}
addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY}});
addEventListener('pointerup',e=>{if(!pointerStart||Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>9)return;pointerStart=null;if(e.target.closest('a,button,.chapter,.last p,.closing,header,.interaction-hint'))return;const point=seedAt(e.clientX,e.clientY);if(point){connectSeed(point);if(point.p.age===0)playBirth()}});
addEventListener('pointercancel',()=>{pointerStart=null});
document.querySelector('#connect-seed').addEventListener('click',()=>{const pool=projectedPoints.filter(p=>p.z>0);connectSeed(pool[Math.floor(Math.random()*pool.length)])});
document.querySelector('#birth-seed').addEventListener('click',()=>{const point=projectedPoints.find(p=>p.p.age===0&&p.z>0);connectSeed(point);playBirth()});
'''
# birthSound is only read in an event handler, after script initialization.
p.write_text(s,encoding='utf-8')
print('Sfondi animati, testi in avvicinamento, fili interattivi e vagito sintetico aggiunti.')
