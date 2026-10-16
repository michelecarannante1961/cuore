from pathlib import Path
root=Path(__file__).parent/'dist'
p=root/'experience.js';s=p.read_text(encoding='utf-8')
s=s.replace("const backgroundFiles={3:'wheat',4:'foundry',5:'soil',9:'faith'};", "const backgroundFiles={3:'wheat',4:'foundry',5:'soil',6:'sea',7:'gaza',8:'gaza',9:'faith'};")
s=s.replace("ctx.lineWidth=.65;ctx.strokeStyle=`rgba(255,221,186,${fade*.26})`", "ctx.lineWidth=2.1;ctx.shadowBlur=5;ctx.shadowColor='rgba(255,218,174,.4)';ctx.strokeStyle=`rgba(255,221,186,${fade*.78})`")
s=s.replace("${fade*.45}","${fade*.90}")
s=s.replace("if(active===5||active===9)", "if(active===6){ctx.strokeStyle='#c9e7e8';ctx.lineWidth=1.3;for(let j=0;j<9;j++){ctx.globalAlpha=.12;ctx.beginPath();for(let x=0;x<=w;x+=12){const y=h*(.58+j*.048)+Math.sin(x*.008+t*.45+j*.9)*(4+j*.65);x?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}}\n if(active===5||active===9)")
s=s.replace("if(birthSound){birthSound.pause();birthSound.currentTime=0}", "if(birthSound){birthSound.pause();birthSound.currentTime=0}if('speechSynthesis' in window)window.speechSynthesis.cancel();")
s=s.replace("async function playBirth(){", "async function playBirth(){if('speechSynthesis' in window)window.speechSynthesis.cancel();")
p.write_text(s,encoding='utf-8')
p=root/'index.html';s=p.read_text(encoding='utf-8')
s=s.replace('<button id="connect-seed"', '<button id="narration" type="button" aria-pressed="true">VOCE · ATTIVA</button><button id="connect-seed"',1)
s=s.replace('I più piccoli custodiscono una nascita.', 'I più piccoli custodiscono una nascita.<br>Passa sulle parole per ascoltarle.')
s=s.replace('<script src="experience.js" defer></script>', '<script src="experience.js" defer></script><script src="narration.js" defer></script>')
s=s.replace('<div class="scene-label"', '<div class="image-note" id="image-note" aria-live="polite"></div><div class="scene-label"',1)
s=s.replace('</style>', '''
.chapter{width:min(530px,44vw);padding:28px 30px}.chapter p{font-size:23px;line-height:1.72}.chapter h2{font-size:clamp(49px,5.5vw,82px)}.hero .intro{font-size:19px;max-width:340px}.final-heart .last .closing{font-size:clamp(48px,5.2vw,82px);max-width:49vw}.final-heart .last>p,.last>p{font-size:24px;line-height:1.7;max-width:49vw}.number{font-size:12px}.scene-label{font-size:12px}footer{font-size:13px}.back{font-size:13px}.interaction-hint{max-width:380px;font-size:11px}.chapter p,.chapter h2,.last>.closing,.last>p,.hero .intro{cursor:help}.speaking{color:#fff3d4!important;text-shadow:0 0 22px #efb56e88;outline:1px solid #d9b38c70;outline-offset:7px;border-radius:2px}.chapter p:focus-visible,.chapter h2:focus-visible,.last>.closing:focus-visible,.last>p:focus-visible{outline:2px solid #e7bca4;outline-offset:6px}.image-note{position:fixed;right:26px;top:24px;max-width:280px;font-size:10px;line-height:1.5;letter-spacing:.4px;color:#e2c6b5;background:#130b0cbf;padding:8px 12px;border-radius:3px;z-index:4;pointer-events:none}.image-note:empty{display:none}@media(max-width:700px){.chapter{width:100%;padding:24px 25px 38px}.chapter p{font-size:20px;line-height:1.7}.chapter h2{font-size:44px}.final-heart .last .closing{font-size:43px;max-width:100%}.final-heart .last>p,.last>p{font-size:22px;max-width:100%}.hero .intro{font-size:17px;max-width:280px}.interaction-hint{font-size:10px;max-width:285px}.scene-label{font-size:10px}.image-note{top:105px;right:18px;max-width:220px;font-size:9px}main .chapter p{transform:translateY(calc((1 - var(--approach,1))*16px)) scale(calc(.96 + var(--approach,1)*.07))}}
</style>''')
p.write_text(s,encoding='utf-8')
p=root/'experience.js';s=p.read_text(encoding='utf-8')
s=s.replace("document.body.classList.toggle('final-heart',active===10);", "document.body.classList.toggle('final-heart',active===10);document.querySelector('#image-note').textContent=(active===7||active===8)?'Gaza — immagine illustrativa generata, non una fotografia documentaria.':'';")
p.write_text(s,encoding='utf-8')
print('Mare, Gaza illustrativa, fili più visibili, testi grandi e lettura al passaggio integrati.')
