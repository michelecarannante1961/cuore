from pathlib import Path
root=Path(__file__).parent/'dist'
p=root/'experience.js'
s=p.read_text(encoding='utf-8')
s=s.replace("const reduced=", "let audio=null,musicOn=false,timer=null,master=null,voices=[];\nlet heartbeatEpoch=0,nextBeat=0,heartbeatActive=false;\nconst reduced=",1)
s=s.replace("// Musica originale generativa: nessun file esterno, avvio solo su richiesta.\nlet audio=null,musicOn=false,timer=null,master=null,voices=[];", "// Musica e battito originali generativi, avvio solo su richiesta.")
insert='''
const backdrop=document.createElement('div');backdrop.className='backdrop';backdrop.setAttribute('aria-hidden','true');document.body.prepend(backdrop);
const backgroundFiles={3:'wheat',4:'foundry',5:'soil',9:'faith'};
const backgroundLayers={};
for(const [scene,name] of Object.entries(backgroundFiles)){const layer=document.createElement('div');layer.className='backdrop-layer';layer.style.backgroundImage=`url("assets/${name}.png")`;backdrop.append(layer);backgroundLayers[scene]=layer;}
function setSceneBackground(){for(const [scene,layer] of Object.entries(backgroundLayers))layer.classList.toggle('visible',Number(scene)===active);document.body.classList.toggle('final-heart',active===10);}
function pulseAmount(){if(active!==10||reduced)return 0;const clock=musicOn&&audio?audio.currentTime:performance.now()/1000;const phase=((clock-heartbeatEpoch)%1+1)%1;return Math.exp(-Math.pow((phase-.075)/.047,2))+.58*Math.exp(-Math.pow((phase-.245)/.065,2));}
'''
s=s.replace("function resize(){",insert+"\nfunction resize(){",1)
s=s.replace("active=next;blend=0;", "active=next;blend=0;setSceneBackground();")
s=s.replace("ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);", "ctx.save();ctx.globalAlpha=backgroundFiles[active]?.26:1;ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);ctx.restore();const pulse=pulseAmount();document.documentElement.style.setProperty('--heart-pulse',String(pulse));")
s=s.replace("x=rx+Math.sin", "x=rx+Math.sin")
s=s.replace("const scale=3.5/(3.5-z*.32);", "const scale=3.5/(3.5-z*.32)*(1+pulse*.075);")
s=s.replace("update();draw(0);", "setSceneBackground();update();draw(0);")
s+='''
function heartbeat(at){for(const [delay,frequency,volume] of [[0,66,.48],[.18,49,.32]]){const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.setValueAtTime(frequency,at+delay);osc.frequency.exponentialRampToValueAtTime(29,at+delay+.16);gain.gain.setValueAtTime(.0001,at+delay);gain.gain.exponentialRampToValueAtTime(volume,at+delay+.018);gain.gain.exponentialRampToValueAtTime(.0001,at+delay+.22);osc.connect(gain);gain.connect(master);osc.start(at+delay);osc.stop(at+delay+.24);voices.push(osc);osc.onended=()=>{voices=voices.filter(v=>v!==osc);osc.disconnect();gain.disconnect()}}}
setInterval(()=>{const wanted=musicOn&&audio&&active===10&&!document.hidden;if(!wanted){if(heartbeatActive){voices.filter(v=>v._heartbeat).forEach(v=>{try{v.stop()}catch{}})}heartbeatActive=false;return}if(!heartbeatActive){heartbeatActive=true;heartbeatEpoch=audio.currentTime+.09;nextBeat=heartbeatEpoch}while(nextBeat<audio.currentTime+.16){heartbeat(nextBeat);nextBeat+=1}},60);
'''
# Track heartbeat oscillators separately for prompt stop when leaving the finale.
s=s.replace("osc.start(at+delay);osc.stop(at+delay+.24);voices.push(osc)","osc.start(at+delay);osc.stop(at+delay+.24);osc._heartbeat=true;voices.push(osc)")
p.write_text(s,encoding='utf-8')
p=root/'index.html'
s=p.read_text(encoding='utf-8')
s=s.replace('♫ ATTIVA LA MUSICA','♫ ATTIVA L’AUDIO')
s=s.replace('</style>', '''
.backdrop{position:fixed;inset:0;z-index:-2;background:#130b0c;pointer-events:none}.backdrop-layer{position:absolute;inset:0;background-position:center;background-size:cover;opacity:0;transition:opacity 1.8s ease}.backdrop-layer.visible{opacity:1}.backdrop:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#130b0cd9 0%,#130b0c66 50%,#130b0c99),linear-gradient(0deg,#130b0cbb,transparent 35%,#130b0c66)}body:after{background:radial-gradient(ellipse at center,transparent 30%,#10090b66)}.chapter{background:#130b0c8c;border-radius:4px;padding:26px}.final-heart .closing{transform:scale(calc(1 + var(--heart-pulse,0)*.025));text-shadow:0 0 calc(8px + var(--heart-pulse,0)*25px) #ee686855;color:rgb(calc(245 + var(--heart-pulse,0)*10),233,218)}.final-heart .last>p{opacity:calc(.86 + var(--heart-pulse,0)*.14)}@media(min-width:701px){.final-heart .last{align-items:flex-start;text-align:left;padding-left:7vw}.final-heart .last .closing{font-size:clamp(36px,4.3vw,66px);max-width:53vw}.final-heart .last>p{max-width:48vw}}@media(max-width:700px){.backdrop:after{background:linear-gradient(0deg,#130b0cf0,transparent 80%)}.chapter{background:#130b0cda}}@media(prefers-reduced-motion:reduce){.backdrop-layer{transition:none}.final-heart .closing{transform:none}}
</style>''')
p.write_text(s,encoding='utf-8')
print('Sfondi contestuali e battito sincronizzato integrati.')
