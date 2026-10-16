const fs=require('fs');
const data=JSON.parse(fs.readFileSync('scene-outlines.json','utf8'));
const journey={gospelStart:10,titles:data.map(s=>s.title),gospelTargets:data.map(s=>Array.from({length:1500},(_,i)=>{const p=s.points[Math.floor((i+.5)*s.points.length/1500)];return{x:(p.x-500)/400,y:(p.y-350)/400,z:0}}))};
let boot=fs.readFileSync('check_experience.cjs','utf8').split('(async()=>')[0];
boot=boot.replace('length:11','length:50').replace('window:{AudioContext:Audio}','window:{AudioContext:Audio,Journey:journey}');
const checks=`for(selected=0;selected<50;selected++){callbacks.scroll();vm.runInContext('blend=1',sandbox);frame(10000+selected*500);assert.equal(vm.runInContext('active',sandbox),selected);const count=vm.runInContext('projectedPoints.length',sandbox);assert.equal(count,selected>=10&&selected<49?1500:640)}assert.equal(vm.runInContext('finalScene',sandbox),49);assert.equal(vm.runInContext('targets.length',sandbox),50);assert.equal(vm.runInContext('names.length',sandbox),50);console.log('PASS: disegni integrati per 50 scene; 1500 chicchi negli episodi; cuore e battito riconoscono il nuovo finale.');`;
new Function('require','journey',boot+checks)(require,journey);
