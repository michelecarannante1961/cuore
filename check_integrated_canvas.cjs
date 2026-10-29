const fs=require('fs'),vm=require('vm'),assert=require('assert');
const storyBox={window:{}};vm.createContext(storyBox);vm.runInContext(fs.readFileSync('dist/jesus-scenes.js','utf8'),storyBox);
const {scenes,sceneDrawing}=storyBox.window.JesusStory;
assert.equal(scenes.length,5,'Expected only the 5 final scenes of Jesus');
const journey={gospelStart:10,gospelEnd:15,titles:scenes.map(s=>s.title),gospelTargets:scenes.map(s=>{const pts=sceneDrawing(s.id);return Array.from({length:1500},(_,i)=>{const p=pts[Math.min(pts.length-1,Math.floor((i+.5)*pts.length/1500))];return{x:(p.x-500)/400,y:(p.y-350)/400,z:0}})})};
let boot=fs.readFileSync('check_experience.cjs','utf8').split('(async()=>')[0];
boot=boot.replace('length:12','length:17').replace('window:{AudioContext:Audio}','window:{AudioContext:Audio,Journey:journey}');
const checks=`for(selected=0;selected<17;selected++){callbacks.scroll();vm.runInContext('blend=1',sandbox);frame(10000+selected*500);assert.equal(vm.runInContext('active',sandbox),selected);const count=vm.runInContext('projectedPoints.length',sandbox);assert.equal(count,selected>=10&&selected<15?1500:640)}assert.equal(vm.runInContext('sproutScene',sandbox),15);assert.equal(vm.runInContext('finalScene',sandbox),16);assert.equal(vm.runInContext('targets.length',sandbox),17);assert.equal(vm.runInContext('names.length',sandbox),17);assert.equal(vm.runInContext('names[15]',sandbox),'Il germoglio');assert.equal(vm.runInContext('names[16]',sandbox),'Un solo cuore');console.log('PASS: 17 scene integrate (10 capitoli + 5 scene evangeliche finali da 1500 chicchi + Il germoglio + Un solo cuore).');`;
new Function('require','journey',boot+checks)(require,journey);
