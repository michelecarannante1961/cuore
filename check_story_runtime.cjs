const fs=require('fs'),vm=require('vm'),assert=require('assert');
let selected=0,callbacks={},scheduled=[],scrolled=[];
const gradient={addColorStop(){}};
const canvasContext=new Proxy({},{get:(o,k)=>k in o?o[k]:(...args)=>{for(const a of args)if(typeof a==='number')assert(Number.isFinite(a),'Invalid '+k)}});
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.style={setProperty(){}};this.classList={add(){},remove(){}};this.events={};this.textContent=''}
 append(...items){for(const item of items){this.children.push(item);item.parent=this}}
 setAttribute(){}
 addEventListener(name,fn){(this.events[name]??=[]).push(fn)}
 querySelectorAll(selector){const all=this.children.flatMap(c=>[c,...c.querySelectorAll(selector)]);return all.filter(c=>selector==='.episode'?c.className==='episode':selector==='p'?c.tag==='p':false)}
 querySelector(s){return this.querySelectorAll(s)[0]||null}
 getBoundingClientRect(){let section=this;while(section.parent&&section.className!=='episode')section=section.parent;const index=main.children.filter(c=>c.className==='episode').indexOf(section);return{top:(index-selected)*1250,height:1250,bottom:(index-selected)*1250+1250}}
 getContext(){return canvasContext}
 scrollIntoView(){selected=main.children.indexOf(this);scrolled.push(this.id)}
}
const ids=Object.fromEntries(['story-canvas','story','episode','story-count','previous','next','story-progress-bar','music','interaction-status'].map(id=>[id,new Element()]));const main=ids.story;
const sandbox={console,window:{},document:{querySelector:s=>ids[s.slice(1)],createElement:t=>new Element(t),documentElement:{style:{setProperty(){}}}},innerWidth:1440,innerHeight:900,devicePixelRatio:1,matchMedia:()=>({matches:false}),addEventListener:(name,fn)=>(callbacks[name]??=[]).push(fn),requestAnimationFrame:fn=>{scheduled.push(fn);return scheduled.length},performance:{now:()=>10000},location:{hash:'#nativita'},history:{replaceState(){}},setInterval(){},clearInterval(){}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/jesus-scenes.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/jesus-story.js','utf8'),sandbox);assert.equal(main.children.length,39);assert.equal(ids.episode.children.length,39);assert.equal(scrolled[0],'nativita');
for(let i=0;i<39;i++){selected=i;vm.runInContext('updateStory();storyBlend=1;drawStory(10000+'+i+'*100)',sandbox);assert.equal(ids.episode.value,String(i));assert.equal(vm.runInContext('storyProjected.length',sandbox),1500)}assert.equal(ids.next.disabled,true);ids.previous.events.click[0]();assert.equal(scrolled.at(-1),'lago');
sandbox.innerWidth=390;sandbox.innerHeight=844;selected=2;vm.runInContext('resizeStory();updateStory();drawStory(16000)',sandbox);assert.equal(vm.runInContext('storyProjected.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))',sandbox),true);console.log('PASS: 39 episodi creati, ingresso alla Natività, navigazione, 1500 chicchi per scena, desktop e telefono senza errori runtime.');
