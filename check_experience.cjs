const fs=require('fs'),vm=require('vm'),assert=require('assert');
let selected=0,frame,scheduled=[],callbacks={},created=0,clock=10000,navigated=[],mounted=[];
const classes=()=>({toggle(){},add(){},remove(){},contains(name){return name==='right'&&selected%2===0}});
const gradient={addColorStop(){}};
const context=new Proxy({createRadialGradient:()=>gradient,getImageData:()=>({data:new Uint8ClampedArray(400*400*4).fill(255)})},{get:(o,k)=>k in o?o[k]:(...args)=>{for(const a of args)if(typeof a==='number')assert(Number.isFinite(a),`Non-finite canvas coordinate: ${k}`)}});
const element=()=>({hidden:true,style:{setProperty(){}},classList:classes(),setAttribute(){},append(el){mounted.push(el)},addEventListener(event,fn){this[event]=fn},getContext:()=>context,getBoundingClientRect:()=>({top:300,height:120}),contentWindow:{postMessage(){}}});
const sections=Array.from({length:12},(_,i)=>({...element(),id:i===10?'rinascita':'s-'+i,getBoundingClientRect:()=>({top:(i-selected)*1000,height:1000})}));
const elements=Object.fromEntries(['#world','#scene-name','#percent','#music','#connect-seed','#interaction-status','#image-note','#narration','#rinascita','#claude-fm-panel','#claude-fm-mount','#claude-fm-min'].map(s=>[s,element()]));
const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},cancelScheduledValues(){},setTargetAtTime(){}});
class Audio{constructor(){this.currentTime=10;this.destination={}}async resume(){}createGain(){return{gain:param(),connect(){},disconnect(){}}}createOscillator(){created++;return{frequency:param(),connect(){},disconnect(){},start(){},stop(){}}}}
const sandbox={console,location:{protocol:'https:',assign:url=>navigated.push(url)},document:{querySelector:s=>elements[s]||null,querySelectorAll:()=>sections,createElement:element,body:{prepend(){},classList:classes()},documentElement:{scrollHeight:12000,style:{setProperty(){}}}},window:{AudioContext:Audio},performance:{now:()=>clock},innerWidth:1440,innerHeight:1000,devicePixelRatio:1,scrollY:0,matchMedia:()=>({matches:false}),addEventListener:(e,f)=>callbacks[e]=f,requestAnimationFrame:f=>frame=f,setInterval:(f,ms)=>{scheduled.push({f,ms});return scheduled.length},clearInterval(){}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/experience.js','utf8'),sandbox);
(async()=>{for(selected=0;selected<12;selected++){callbacks.scroll();for(let t=0;t<40;t++)frame(10000+selected*2000+t*50)}
selected=10;callbacks.scroll();assert.equal(elements['#scene-name'].textContent,'Il germoglio');
selected=11;callbacks.scroll();await elements['#music'].click();scheduled.find(t=>t.ms===60).f();
assert(created>=2,'Heartbeat oscillators expected on final heart');
assert(mounted.some(el=>String(el.src||'').includes('tRsQsTMvPNg')),'Claude FM live embed expected');
assert.equal(elements['#scene-name'].textContent,'Un solo cuore');
elements['#connect-seed'].click();assert(vm.runInContext('connections.length',sandbox)>=5);clock+=700;frame(33000);assert.equal(vm.runInContext('typeof playBirth',sandbox),'undefined');
selected=9;callbacks.scroll();for(let t=0;t<40;t++)frame(35000+t*50);const points=vm.runInContext('projectedPoints',sandbox);for(const point of points){const event={clientX:point.x,clientY:point.y,target:{closest:()=>null}};callbacks.pointerdown(event);callbacks.pointerup(event)}assert.equal(navigated.length,640,'Every cross seed must open the final Gospel scenes');assert(navigated.every(url=>url==='gesu.html#deposizione'));elements['#connect-seed'].click();assert.equal(navigated.length,641,'Accessible alternative also opens story');
await elements['#music'].click();assert(elements['#music'].textContent.includes('ATTIVA'));console.log('PASS: 12 scene base incluso Il germoglio + conclusione, Claude FM + battito finale, 640 chicchi della croce aprono gli ultimi passi.');})().catch(e=>{console.error(e);process.exitCode=1});
