from pathlib import Path
import re
root=Path(__file__).parent/'dist'
p=root/'experience.js';s=p.read_text(encoding='utf-8')
s=s.replace('if(birthSound){birthSound.pause();birthSound.currentTime=0}','')
s=re.sub(r"^const birthSound=.*\n",'',s,flags=re.M)
s=re.sub(r"^let lastBirth=.*\n",'',s,flags=re.M)
s=re.sub(r"^async function playBirth\(\).*\n",'',s,flags=re.M)
s=re.sub(r"^document.querySelector\('#birth-seed'\).*\n",'',s,flags=re.M)
s=s.replace("if(point){connectSeed(point);if(point.p.age===0)playBirth()}","if(point){if(active===9){location.assign('gesu.html#nativita');return}connectSeed(point)}")
s=s.replace("document.querySelector('#connect-seed').addEventListener('click',()=>{const pool=", "document.querySelector('#connect-seed').addEventListener('click',()=>{if(active===9){location.assign('gesu.html#nativita');return}const pool=")
s=s.replace("document.body.classList.toggle('final-heart',active===10);", "document.body.classList.toggle('final-heart',active===10);document.querySelector('#connect-seed').textContent=active===9?'Entra nella storia di Gesù':'Collega un chicco';")
p.write_text(s,encoding='utf-8')
p=root/'narration.js';s=p.read_text(encoding='utf-8');s=re.sub(r"^document.querySelector\('#birth-seed'\).*\n",'',s,flags=re.M);p.write_text(s,encoding='utf-8')
p=root/'index.html';s=p.read_text(encoding='utf-8')
s=re.sub(r'<button id="birth-seed"[^>]*>.*?</button>','',s)
s=s.replace('I più piccoli custodiscono una nascita.<br>','Sulla croce, ogni chicco apre la storia di Gesù.<br>')
s=s.replace('<section><article class="chapter"><span class="number">09 /','<section id="fede"><article class="chapter"><span class="number">09 /')
marker='<section id="fede">';start=s.index(marker);end=s.index('</article>',start)
s=s[:end]+'<a class="back" href="gesu.html#nativita">ENTRA NELLA STORIA DI GESÙ ↗</a><p class="cross-invitation">Tocca un qualsiasi chicco della croce: si apre un racconto in 39 scene, con figure tracciate da piccoli chicchi.</p>'+s[end:]
s=s.replace('</style>', '.cross-invitation{font-family:Arial,sans-serif!important;font-size:15px!important;line-height:1.7!important;color:#ecc6b1}.back[href^="gesu"]{line-height:1.6;display:block;text-align:center;border-color:#d4a37d;background:#452129}html{scroll-padding-top:35px}</style>')
p.write_text(s,encoding='utf-8')
print('Vagito rimosso dai file attivi. Portale dalla croce collegato a 39 scene.')
