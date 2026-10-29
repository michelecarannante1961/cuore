const fs=require('fs'),vm=require('vm'),assert=require('assert');
let selected=0,callbacks={},scheduled=[],scrolled=[];
const canvasContext=new Proxy({},{get:(o,k)=>k in o?o[k]:(...args)=>{for(const a of args)if(typeof a==='number')assert(Number.isFinite(a),'Invalid '+k)}});
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.style={setProperty(){}};this.classList={add(){},remove(){},toggle(){}};this.events={};this.textContent='';this.hidden=true;this.contentWindow={postMessage(){}}}
 append(...items){for(const item of items){this.children.push(item);item.parent=this}}
 setAttribute(){}
 addEventListener(name,fn){(this.events[name]??=[]).push(fn)}
 querySelectorAll(selector){const all=this.children.flatMap(c=>[c,...c.querySelectorAll(selector)]);return all.filter(c=>selector==='.episode'?c.className==='episode':selector==='p'?c.tag==='p':false)}
 querySelector(s){return this.querySelectorAll(s)[0]||null}
 getBoundingClientRect(){let section=this;while(section.parent&&section.className!=='episode')section=section.parent;const index=main.children.filter(c=>c.className==='episode').indexOf(section);return{top:(index-selected)*1250,height:1250,bottom:(index-selected)*1250+1250}}
 getContext(){return canvasContext}
 scrollIntoView(){selected=main.children.indexOf(this);scrolled.push(this.id)}
}
const ids=Object.fromEntries(['story-canvas','story','episode','story-count','previous','next','story-progress-bar','music','interaction-status','claude-fm-panel','claude-fm-mount','claude-fm-min'].map(id=>[id,new Element()]));const main=ids.story;
const sandbox={console,window:{},document:{querySelector:s=>ids[s.slice(1)]||null,createElement:t=>new Element(t),documentElement:{style:{setProperty(){}}}},innerWidth:1440,innerHeight:900,devicePixelRatio:1,matchMedia:()=>({matches:false}),addEventListener:(name,fn)=>(callbacks[name]??=[]).push(fn),requestAnimationFrame:fn=>{scheduled.push(fn);return scheduled.length},performance:{now:()=>10000},location:{protocol:'https:',hash:'#deposizione'},history:{replaceState(){}},setInterval(){},clearInterval(){}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/jesus-scenes.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/jesus-story.js','utf8'),sandbox);assert.equal(main.children.length,5);assert.equal(ids.episode.children.length,5);assert.equal(scrolled[0],'deposizione');
for(let i=0;i<5;i++){selected=i;vm.runInContext('updateStory();storyBlend=1;drawStory(10000+'+i+'*100)',sandbox);assert.equal(ids.episode.value,String(i));assert.equal(vm.runInContext('storyProjected.length',sandbox),1500)}assert.equal(ids.next.disabled,true);ids.previous.events.click[0]();assert.equal(scrolled.at(-1),'emmaus');
ids.music.events.click[0]();assert.equal(ids['claude-fm-panel'].hidden,false);assert(String(ids['claude-fm-mount'].children[0]?.src||'').includes('tRsQsTMvPNg'));
sandbox.innerWidth=390;sandbox.innerHeight=844;selected=2;vm.runInContext('resizeStory();updateStory();drawStory(16000)',sandbox);assert.equal(vm.runInContext('storyProjected.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))',sandbox),true);console.log('PASS: 5 episodi finali creati, ingresso a Deposizione, navigazione, Claude FM attiva, 1500 chicchi per scena.');
