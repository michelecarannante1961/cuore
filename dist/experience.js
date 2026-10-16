const canvas=document.querySelector('#world'),ctx=canvas.getContext('2d');
let audio=null,musicOn=false,timer=null,master=null,voices=[];
let heartbeatEpoch=0,nextBeat=0,heartbeatActive=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let w=0,h=0,active=0,blend=1,lastTime=0,mx=0,my=0,seed=28;
const random=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646};
const names=['Il melograno','Ogni vita è unica','La solidarietà','La falce','Il martello','La zappa','Il remo','La bomba','La deflagrazione','La croce','Un solo cuore'];
const sections=[...document.querySelectorAll('main section')];
const finalScene=sections.length-1,gospelStart=10;
const isGospelScene=()=>Boolean(window.Journey)&&active>=gospelStart&&active<finalScene;
let projectedPoints=[],connections=[],pointerStart=null;
const readingParagraphs=[...document.querySelectorAll('main .chapter p, main .last>p, main .hero .intro')];
const N=640,mask=document.createElement('canvas');mask.width=mask.height=400;const m=mask.getContext('2d',{willReadFrequently:true});
function shape(type){m.clearRect(0,0,400,400);m.fillStyle='#fff';m.strokeStyle='#fff';m.lineWidth=22;m.lineCap='round';m.lineJoin='round';m.save();m.translate(200,200);m.scale(140,140);
 const line=(points,width=.14)=>{m.lineWidth=width;m.beginPath();points.forEach(([x,y],i)=>i?m.lineTo(x,y):m.moveTo(x,y));m.stroke()};
 if(type==='heart'){m.beginPath();m.moveTo(0,.9);m.bezierCurveTo(-1.6,-.05,-.9,-1.15,0,-.55);m.bezierCurveTo(.9,-1.15,1.6,-.05,0,.9);m.fill()}
 if(type==='cross'){m.fillRect(-.16,-1,.32,2);m.fillRect(-.7,-.43,1.4,.3)}
 if(type==='hammer'){line([[-.38,.95],[.32,-.4]],.18);m.save();m.rotate(.45);m.fillRect(-.65,-.7,1.25,.4);m.restore()}
 if(type==='hoe'){line([[-.65,.95],[.35,-.7]],.12);m.beginPath();m.moveTo(.25,-.75);m.lineTo(.95,-.65);m.lineTo(.84,-.25);m.lineTo(.2,-.54);m.closePath();m.fill()}
 if(type==='oar'){line([[-.65,-.95],[.25,.35]],.12);m.save();m.translate(.42,.56);m.rotate(-.6);m.beginPath();m.ellipse(0,0,.23,.55,0,0,7);m.fill();m.restore()}
 if(type==='sickle'){line([[-.64,.96],[.2,.18]],.16);m.beginPath();m.moveTo(.03,.27);m.bezierCurveTo(1.35,-.18,.8,-1.18,-.35,-.94);m.bezierCurveTo(.55,-.74,.62,-.23,.03,.27);m.fill()}
 if(type==='bomb'){m.beginPath();m.arc(0,.2,.69,0,7);m.fill();m.save();m.rotate(.45);m.fillRect(-.17,-.73,.34,.42);m.restore();line([[.3,-.57],[.5,-.85],[.76,-.8],[.86,-1]],.065)}
 m.restore();const data=m.getImageData(0,0,400,400).data,points=[];for(let y=15;y<385;y+=3)for(let x=15;x<385;x+=3)if(data[(y*400+x)*4+3]>100)points.push({x:(x-200)/140,y:(y-200)/140,z:(random()-.5)*.18});
 return Array.from({length:N},()=>({...points[Math.floor(random()*points.length)]}));}
const globe=Array.from({length:N},(_,i)=>{const y=1-2*(i+.5)/N,r=Math.sqrt(1-y*y),a=i*2.399963;return{x:Math.cos(a)*r,y,z:Math.sin(a)*r}});
const open=globe.map(p=>({x:p.x+Math.sign(p.x)*.22,y:p.y,z:p.z}));
const burst=globe.map(p=>({x:p.x*(2+random()*2),y:p.y*(2+random()*2),z:p.z*2}));
const targets=[globe,open,shape('heart'),shape('sickle'),shape('hammer'),shape('hoe'),shape('oar'),shape('bomb'),burst,shape('cross'),shape('heart')];
if(window.Journey){targets.splice(10,0,...window.Journey.gospelTargets);names.splice(10,0,...window.Journey.titles)}
const kernels=globe.map((p,i)=>{const age=i%3;return{...p,id:i,from:{...p},size:age===0?3.2+random()*2.2:6+random()*3,age,tone:i%9,angle:random()*6.28,stretch:.7+random()*.8,phase:random()*6.28,edges:Array.from({length:8},()=>.8+random()*.3)}});

const gospelKernels=Array.from({length:1500},(_,i)=>({...kernels[i%kernels.length],id:i,size:1.4+(i%5)*.17,from:{...targets[9][i%640]},...targets[9][i%640]}));
const backdrop=document.createElement('div');backdrop.className='backdrop';backdrop.setAttribute('aria-hidden','true');document.body.prepend(backdrop);
const backgroundFiles={3:'wheat',4:'foundry',5:'soil',6:'sea',7:'gaza',8:'gaza',9:'faith'};
const backgroundLayers={};
for(const [scene,name] of Object.entries(backgroundFiles)){const layer=document.createElement('div');layer.className='backdrop-layer';layer.style.backgroundImage=`url("assets/${name}.png")`;backdrop.append(layer);backgroundLayers[scene]=layer;}
function setSceneBackground(){for(const [scene,layer] of Object.entries(backgroundLayers))layer.classList.toggle('visible',Number(scene)===active);document.body.classList.toggle('final-heart',active===finalScene);document.querySelector('#connect-seed').textContent=active===9?'Entra nella storia di Gesù':'Collega un chicco';document.querySelector('#image-note').textContent=(active===7||active===8)?'Gaza — immagine illustrativa generata, non una fotografia documentaria.':'';}
function pulseAmount(){if(active!==finalScene||reduced)return 0;const clock=musicOn&&audio?audio.currentTime:performance.now()/1000;const phase=((clock-heartbeatEpoch)%1+1)%1;return Math.exp(-Math.pow((phase-.075)/.047,2))+.58*Math.exp(-Math.pow((phase-.245)/.065,2));}


function updateReading(){for(const paragraph of readingParagraphs){const r=paragraph.getBoundingClientRect();const approach=Math.max(0,Math.min(1,(h*.94-r.top)/(h*.64)));paragraph.style.setProperty('--approach',String(reduced?1:approach));}}
function drawAtmosphere(time){if(reduced||!backgroundFiles[active])return;const t=time*.001;ctx.save();
 if(active===3){ctx.strokeStyle='#cda35f';ctx.lineWidth=1;for(let i=0;i<45;i++){const x=(i/44)*w,y=h*(.84+(i%7)*.021),length=35+(i%6)*9,sway=Math.sin(t*.55+i*.7)*8;ctx.globalAlpha=.11;ctx.beginPath();ctx.moveTo(x,h+20);ctx.quadraticCurveTo(x+sway,y,x+sway*1.7,y-length);ctx.stroke();for(let j=0;j<4;j++){ctx.beginPath();ctx.ellipse(x+sway*1.7+(j%2?3:-3),y-length+j*5,2,5,j%2?.5:-.5,0,7);ctx.fillStyle='#d5ad6d';ctx.fill()}}}
 if(active===4){for(let i=0;i<34;i++){const life=((t*.10+i*.137)%1),x=w*(.65+Math.sin(i*19.1)*.27)+Math.sin(t+i)*15,y=h*(1-life);ctx.globalAlpha=Math.sin(life*Math.PI)*.38;ctx.fillStyle=i%3?'#e78a42':'#ffd9a0';ctx.beginPath();ctx.ellipse(x,y,1,2.5,Math.sin(i),0,7);ctx.fill()}}
 if(active===6){ctx.strokeStyle='#c9e7e8';ctx.lineWidth=1.3;for(let j=0;j<9;j++){ctx.globalAlpha=.12;ctx.beginPath();for(let x=0;x<=w;x+=12){const y=h*(.58+j*.048)+Math.sin(x*.008+t*.45+j*.9)*(4+j*.65);x?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}}
 if(active===5||active===9){for(let i=0;i<25;i++){const x=((i*.173+t*.003)%1)*w,y=((i*.237-t*.006)%1+1)%1*h;ctx.globalAlpha=.08+.07*Math.sin(t*.6+i);ctx.fillStyle=active===9?'#ffdda4':'#c39a73';ctx.beginPath();ctx.arc(x,y,active===9?2+(i%3):1+(i%2),0,7);ctx.fill()}}
 ctx.restore();}
function drawConnections(time){const now=performance.now();connections=connections.filter(c=>now-c.created<15000);const byId=new Map(projectedPoints.map(p=>[p.p.id,p]));ctx.save();for(const c of connections){const from=byId.get(c.a),to=byId.get(c.b);if(!from||!to)continue;const age=(now-c.created)/15000,fade=Math.min(1,(now-c.created)/650)*Math.min(1,(1-age)*4);ctx.lineWidth=2.1;ctx.shadowBlur=5;ctx.shadowColor='rgba(255,218,174,.4)';ctx.strokeStyle=`rgba(255,221,186,${fade*.78})`;ctx.beginPath();ctx.moveTo(from.x,from.y);const bend=reduced?0:Math.sin(time*.0007+c.a)*8;ctx.quadraticCurveTo((from.x+to.x)/2,(from.y+to.y)/2+bend,to.x,to.y);ctx.stroke();ctx.strokeStyle=`rgba(255,231,205,${fade*.90})`;ctx.beginPath();ctx.arc(from.x,from.y,from.p.size*from.scale+4,0,7);ctx.stroke()}ctx.restore();}

function resize(){w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0)}
addEventListener('resize',resize);resize();
addEventListener('pointermove',e=>{mx=(e.clientX/w-.5)*.12;my=(e.clientY/h-.5)*.1});
function update(){updateReading();let next=0,best=Infinity;sections.forEach((s,i)=>{const r=s.getBoundingClientRect(),distance=Math.abs(r.top+r.height*.5-h*.5);if(distance<best){best=distance;next=i}});if(next!==active){if(isGospelScene()&&next===finalScene){kernels.forEach((p,i)=>{const q=gospelKernels[i];p.x=q.x;p.y=q.y;p.z=q.z})}for(const pool of [kernels,gospelKernels])pool.forEach(p=>p.from={x:p.x,y:p.y,z:p.z});active=next;blend=0;setSceneBackground();document.querySelector('#scene-name').textContent=names[active];if(reduced){blend=1;draw(0)}}const percent=Math.round(scrollY/Math.max(1,document.documentElement.scrollHeight-h)*100);document.querySelector('#percent').textContent=String(percent).padStart(2,'0')}
addEventListener('scroll',update,{passive:true});
function draw(time){const dt=Math.min(50,time-lastTime||16);lastTime=time;blend=Math.min(1,blend+dt/1600);const ease=blend*blend*(3-2*blend);ctx.clearRect(0,0,w,h);const current=sections[active].classList.contains('right');const mobile=w<700;const cx=w*(mobile?.5:current?.28:.73),cy=h*(mobile?.29:.52),R=Math.min(w*(mobile?(isGospelScene()?.43:.31):.23),h*(mobile?(isGospelScene()?.26:.21):.33));const glow=ctx.createRadialGradient(cx,cy,1,cx,cy,Math.max(w,h)*.7);glow.addColorStop(0,active===8?'#431c19':'#49201f');glow.addColorStop(1,'#130b0c');ctx.save();ctx.globalAlpha=backgroundFiles[active]?.26:1;ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);ctx.restore();drawAtmosphere(time);const pulse=pulseAmount();document.documentElement.style.setProperty('--heart-pulse',String(pulse));
 const points=(isGospelScene()?gospelKernels:kernels).map((p,i)=>{const target=targets[active][i];for(const key of ['x','y','z'])p[key]=p.from[key]+(target[key]-p.from[key])*ease;let x=p.x,y=p.y,z=p.z;const t=reduced?0:time*.001;const angle=active<2?t*.10:Math.sin(t*.24)*.055;const rx=x*Math.cos(angle)+z*Math.sin(angle);z=-x*Math.sin(angle)+z*Math.cos(angle);x=rx+Math.sin(t*.65+p.phase)*.009;y+=Math.cos(t*.52+p.phase)*.01;const scale=3.5/(3.5-z*.32)*(1+pulse*.075);return{p,x:cx+(x+mx*z)*R*scale,y:cy+(y+my*z)*R*scale,z,scale}}).sort((a,b)=>a.z-b.z);
 projectedPoints=points;drawConnections(time);
 for(const {p,x,y,z,scale} of points){const radius=p.size*R/180*scale;let hue=350,sat=p.age===2?27:80,light=p.age===2?56:p.age===0?55:45;let dark='#420c1c',highlight='#ffd6c4';if(active>=1&&p.tone<3){if(p.tone===0){hue=25;sat=24;light=21;dark='#120d0d';highlight='#b49175'}if(p.tone===1){hue=39;sat=66;light=62;dark='#684222';highlight='#fff1be'}if(p.tone===2){hue=30;sat=32;light=83;dark='#9c7970';highlight='#fffaf1'}}ctx.save();ctx.translate(x,y);ctx.rotate(p.angle+(reduced?0:Math.sin(time*.0003+p.phase)*.08));ctx.scale(.8,p.stretch);const g=ctx.createRadialGradient(-radius*.32,-radius*.4,.1,0,0,radius*1.4);g.addColorStop(0,highlight);g.addColorStop(.3,`hsl(${hue},${sat}%,${light}%)`);g.addColorStop(1,dark);ctx.fillStyle=g;ctx.globalAlpha=.65+(z+1)*.12;ctx.beginPath();p.edges.forEach((edge,j)=>{const a=j/8*Math.PI*2,r=radius*edge;j?ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r):ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r)});ctx.closePath();ctx.fill();ctx.restore()}
 if(!reduced)requestAnimationFrame(draw)}
setSceneBackground();update();draw(0);
// Musica e battito originali generativi, avvio solo su richiesta.
const musicButton=document.querySelector('#music');
function note(freq,start,duration,volume){const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(volume,start+1.4);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(gain);gain.connect(master);osc.start(start);osc.stop(start+duration+.1);voices.push(osc);osc.onended=()=>{voices=voices.filter(v=>v!==osc);osc.disconnect();gain.disconnect()}}
let chordIndex=0;const chords=[[130.81,196,261.63,329.63],[110,164.81,220,261.63],[87.31,130.81,174.61,220],[98,146.83,196,293.66]];
function phrase(){if(!musicOn)return;const start=audio.currentTime+.1,chord=chords[chordIndex++%chords.length];chord.forEach((f,i)=>note(f,start+i*.14,10,.042));[0,2,1,3].forEach((n,i)=>note(chord[n]*2,start+1+i*1.6,3,.025))}
async function toggleAudio(){try{if(!audio){audio=new(window.AudioContext||window.webkitAudioContext)();master=audio.createGain();master.gain.value=0;master.connect(audio.destination)}await audio.resume();musicOn=!musicOn;master.gain.cancelScheduledValues(audio.currentTime);master.gain.setTargetAtTime(musicOn?.65:0,audio.currentTime,.35);if(musicOn){phrase();timer=setInterval(phrase,8000)}else{clearInterval(timer);voices.forEach(v=>{try{v.stop(audio.currentTime+.8)}catch{}})}musicButton.textContent=musicOn?'♫ MUSICA · PAUSA':'♫ ATTIVA LA MUSICA';musicButton.setAttribute('aria-pressed',String(musicOn))}catch{musicButton.textContent='Audio non disponibile'}}
musicButton.addEventListener('click',toggleAudio);

function heartbeat(at){for(const [delay,frequency,volume] of [[0,66,.48],[.18,49,.32]]){const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.setValueAtTime(frequency,at+delay);osc.frequency.exponentialRampToValueAtTime(29,at+delay+.16);gain.gain.setValueAtTime(.0001,at+delay);gain.gain.exponentialRampToValueAtTime(volume,at+delay+.018);gain.gain.exponentialRampToValueAtTime(.0001,at+delay+.22);osc.connect(gain);gain.connect(master);osc.start(at+delay);osc.stop(at+delay+.24);osc._heartbeat=true;voices.push(osc);osc.onended=()=>{voices=voices.filter(v=>v!==osc);osc.disconnect();gain.disconnect()}}}
setInterval(()=>{const wanted=musicOn&&audio&&active===finalScene&&!document.hidden;if(!wanted){if(heartbeatActive){voices.filter(v=>v._heartbeat).forEach(v=>{try{v.stop()}catch{}})}heartbeatActive=false;return}if(!heartbeatActive){heartbeatActive=true;heartbeatEpoch=audio.currentTime+.09;nextBeat=heartbeatEpoch}while(nextBeat<audio.currentTime+.16){heartbeat(nextBeat);nextBeat+=1}},60);

const interactionStatus=document.querySelector('#interaction-status');
function status(message){interactionStatus.textContent=message;}
function connectSeed(point){if(!point)return;const nearest=projectedPoints.filter(q=>q.p.id!==point.p.id).sort((a,b)=>Math.hypot(a.x-point.x,a.y-point.y)-Math.hypot(b.x-point.x,b.y-point.y)).slice(0,5);const now=performance.now();for(const q of nearest){if(!connections.some(c=>(c.a===point.p.id&&c.b===q.p.id)||(c.b===point.p.id&&c.a===q.p.id)))connections.push({a:point.p.id,b:q.p.id,created:now})}if(connections.length>100)connections=connections.slice(-100);status(point.p.age===0?'Una piccola vita. Cinque nuovi legami.':'Ogni incontro lascia un filo.');if(reduced)draw(0);}
function seedAt(x,y){let best=null,score=Infinity;for(const point of projectedPoints){const distance=Math.hypot(point.x-x,point.y-y),radius=Math.max(w<700?11:8,point.p.size*point.scale*1.25);if(distance<=radius&&distance-point.z*1.3<score){score=distance-point.z*1.3;best=point}}return best;}
addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY}});
addEventListener('pointerup',e=>{if(!pointerStart||Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>9)return;pointerStart=null;if(e.target.closest('a,button,.chapter,.last p,.closing,header,.interaction-hint'))return;const point=seedAt(e.clientX,e.clientY);if(point){if(active===9){enterJesusStory();return}connectSeed(point)}});
addEventListener('pointercancel',()=>{pointerStart=null});
document.querySelector('#connect-seed').addEventListener('click',()=>{if(active===9){enterJesusStory();return}const pool=projectedPoints.filter(p=>p.z>0);connectSeed(pool[Math.floor(Math.random()*pool.length)])});

function enterJesusStory(){if(window.journeyPlayer){window.journeyPlayer.goTo(10);return}const first=document.querySelector('#gesu-annunciazione');if(first)first.scrollIntoView({behavior:'smooth',block:'center'});else location.assign('gesu.html#nativita')}
