from pathlib import Path
import re
root=Path(__file__).parent/'dist'
p=root/'index.html'
s=p.read_text(encoding='utf-8')
s=re.sub(r'<script>[\s\S]*?</script>', '<script src="experience.js" defer></script>',s)
s=s.replace('</style>', '''
.sound{position:fixed;bottom:22px;left:25px;z-index:5;background:#211013ed;color:#f5e9da;border:1px solid #8a5b51;border-radius:30px;padding:14px 19px;font-size:10px;letter-spacing:2px;cursor:pointer}.sound:hover{background:#542830}.sound:focus-visible,a:focus-visible{outline:2px solid #f2bdae;outline-offset:5px}.scene-label{position:fixed;bottom:28px;right:28px;font-size:10px;letter-spacing:3px;color:#d3a597;z-index:3;text-transform:uppercase}footer{padding-bottom:95px}.last{background:none}.last .closing,.last>p,.last>.number{position:relative;background:#130b0cc9;padding:10px 20px}main section:not(.hero):not(.last){min-height:130vh}@media(max-width:700px){main section:not(.hero):not(.last){align-items:flex-end;min-height:140vh;padding-top:65vh;padding-bottom:10vh}.chapter{width:100%;padding:22px;background:#130b0ce8}.scene-label{bottom:82px;right:20px;font-size:9px}.sound{left:18px;bottom:20px}.last{padding-top:65vh}.hero h1{font-size:16vw}.hero{padding-top:14vh}.hero .intro{margin-top:35vh}.scroll{bottom:23px}nav a{font-size:9px;letter-spacing:1px}.last .closing{font-size:36px}}
</style>''')
s=s.replace('<main>', '<button id="music" class="sound" type="button" aria-pressed="false">♫ ATTIVA LA MUSICA</button><div class="scene-label" id="scene-name" aria-live="polite">Il melograno</div><main>')
start=s.index('<section id="scorza">')
end=s.index('<section class="last">')
chapters=[
('LA DIMORA','Ogni chicco.<br><em>Una vita.</em>', 'La sua scorza, ruvida e resistente, custodisce un piccolo universo: centinaia di chicchi stretti l’uno accanto all’altro, diversi eppure inseparabili. Ognuno ha la propria forma, la propria luce, la propria goccia di dolcezza. E tutti insieme danno vita a un solo frutto.', 'Così è l’umanità. Ci sono chicchi piccoli come i bambini, accesi come gli adulti, più tenui come gli anziani. Qualcuno si fa scuro, qualcuno dorato, qualcuno chiaro: evocano i colori della nostra pelle. Nessuno perde il proprio valore.'),
('LA SOLIDARIETÀ','Insieme diventiamo<br><em>cuore.</em>', 'Siamo semi raccolti nella stessa dimora, vicini senza essere uguali. Portiamo dentro di noi storie, lingue, paure e desideri differenti, ma apparteniamo alla medesima fragile terra. Nessun chicco basta a se stesso: la bellezza nasce dalla moltitudine, dall’incontro, dalla presenza dell’altro.', 'Quando una vita si avvicina a un’altra per sostenerla, i chicchi si raccolgono in un cuore. La solidarietà è questa scelta: non lasciare nessuno da solo.'),
('IL LAVORO · LA FALCE','Raccogliere.<br><em>Condividere.</em>', 'Le stesse vite diventano falce: mani che raccolgono il grano, fatica che si trasforma in pane. Il raccolto acquista senso quando arriva anche alla tavola dell’altro.', 'Ogni chicco rimane autonomo. È l’incontro con gli altri a dare forma al lavoro comune.'),
('IL LAVORO · IL MARTELLO','Costruire ciò<br>che <em>ci accoglie.</em>', 'I chicchi si fanno martello. Un colpo dopo l’altro, le mani costruiscono ripari, case, luoghi dove riconoscersi. Ogni mestiere porta una parte di mondo sulle proprie spalle.', 'Non una sola forza, ma tante capacità che imparano a lavorare insieme.'),
('IL LAVORO · LA ZAPPA','Prendersi cura<br>della <em>terra.</em>', 'Poi diventano zappa. Smuovono la terra, preparano un solco, attendono una stagione. Il lavoro conosce la pazienza: custodisce oggi quello che nutrirà qualcuno domani.', 'Una sola scorza ci avvolge: il mondo.'),
('IL LAVORO · IL REMO','Attraversare.<br><em>Insieme.</em>', 'E diventano remo. Nessuno attraversa il mare con la sola forza di un dito. Le mani si accordano, trovano un ritmo, portano avanti la stessa barca.', 'La nostra forza non nasce dall’essere identici, ma dal restare uniti nelle differenze.'),
('LA SCELTA · LA BOMBA','Le stesse mani<br>possono <em>ferire.</em>', 'Il rosso del melograno ricorda il sangue, quello che scorre identico sotto ogni pelle. È il colore della vita, ma anche delle ferite che gli uomini si infliggono.', 'L’uomo può radunare le proprie capacità per costruire una bomba. I chicchi sono gli stessi. È cambiata la scelta che li tiene insieme.'),
('LA DEFLAGRAZIONE','Quando si spezza<br>il <em>legame.</em>', 'Poi l’uomo la fa deflagrare. Ciò che era vicino viene disperso. Ogni chicco porta con sé una vita, una storia, qualcuno che lo aspetta.', 'Per raggiungere i suoi semi bisogna spezzare la scorza, e forse anche l’umanità rivela ciò che possiede di più prezioso proprio quando viene ferita: nella sofferenza emergono la solidarietà, la cura, il bisogno di stringersi gli uni agli altri.'),
('LA FEDE · LA CROCE','Ritrovarsi<br>nella <em>speranza.</em>', 'Dispersi, i chicchi tornano ad avvicinarsi. Accomunati dalla fede, prendono la forma di una croce: una ferita attraversata dalla speranza, braccia aperte che invitano a riconoscersi fratelli.', 'Ogni chicco sembra una piccola gemma trasparente, una luce custodita nella carne del frutto. Così ogni essere umano porta dentro di sé qualcosa di unico, una scintilla che nessun altro può sostituire.')]
html=[]
for i,(label,title,p1,p2) in enumerate(chapters):
    attrs=' id="scorza"' if i==0 else (' class="right"' if i%2 else '')
    html.append(f'<section{attrs}><article class="chapter"><span class="number">{i+1:02d} / {label}</span><h2>{title}</h2><p>{p1}</p><p>{p2}</p></article></section>')
s=s[:start]+'\n'.join(html)+'\n'+s[end:]
s=s.replace('06 / LA PROMESSA','10 / LA PROMESSA')
s=s.replace('<p>Forse l’umanità è proprio questo:</p>', '<p>Il melograno ci ricorda allora che essere umani significa essere molti e uno nello stesso tempo.</p><p>E quando il frutto maturo si apre e lascia cadere i suoi semi sulla terra, sembra affidare al futuro una promessa silenziosa: da ogni piccola vita può nascerne un’altra, da ogni ferita può germogliare speranza.</p><p>Forse l’umanità è proprio questo:</p>')
p.write_text(s,encoding='utf-8')
print('Sito aggiornato: 11 scene, musica generativa, chicchi individuali.')
