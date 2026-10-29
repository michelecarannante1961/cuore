// Solo le ultime scene evangeliche, dalla deposizione alla promessa, prima della conclusione.
(() => {
 const story=window.JesusStory;if(!story)return;
 const main=document.querySelector('main'),anchor=main.querySelector('#rinascita')||main.querySelector('.last');
 main.querySelector('.last').id='finale';
 const gospelTargets=[];
 for(const [index,scene] of story.scenes.entries()){
  const section=document.createElement('section');section.className='gospel-episode'+(index%2===1?' right':'');section.id='gesu-'+scene.id;
  const article=document.createElement('article');article.className='chapter';
  const number=document.createElement('span');number.className='number';number.textContent=`OLTRE LA CROCE · ${String(index+1).padStart(2,'0')} / ${String(story.scenes.length).padStart(2,'0')}`;
  const title=document.createElement('h2');title.textContent=scene.title;
  const text=document.createElement('p');text.textContent=scene.text;
  const source=document.createElement('a');source.className='gospel-source';source.href=scene.url;source.target='_blank';source.rel='noopener noreferrer';source.textContent=scene.verse+' ↗';
  article.append(number,title,text,source);section.append(article);main.insertBefore(section,anchor);
  const outline=story.sceneDrawing(scene.id);
  gospelTargets.push(Array.from({length:1500},(_,i)=>{const p=outline[Math.min(outline.length-1,Math.floor((i+.5)*outline.length/1500))];return{x:(p.x-500)/400,y:(p.y-350)/400,z:0}}));
 }
 window.Journey={gospelStart:10,gospelEnd:10+story.scenes.length,gospelTargets,titles:story.scenes.map(s=>s.title)};
})();
