from pathlib import Path
import re
root=Path(__file__).parent
dist=root/'dist'
for name in ['index.html','gesu.html']:
 p=dist/name;s=p.read_text(encoding='utf-8')
 s=re.sub(r'<button id="narration"[^>]*>.*?</button>','',s)
 s=s.replace('<script src="narration.js" defer></script>','')
 s=s.replace('<br>Passa sulle parole per ascoltarle.','')
 s=s.replace('♫ ATTIVA L’AUDIO','♫ ATTIVA LA MUSICA')
 s=re.sub(r'[^{}]*\.speaking\{[^{}]*\}','',s)
 s=s.replace('cursor:help','cursor:text')
 p.write_text(s,encoding='utf-8')
for name in ['experience.js','jesus-story.js']:
 p=dist/name;s=p.read_text(encoding='utf-8')
 s=re.sub(r"if\('speechSynthesis' in window\)window\.speechSynthesis\.cancel\(\);?",'',s)
 s=s.replace('♫ AUDIO · PAUSA','♫ MUSICA · PAUSA').replace('♫ ATTIVA L’AUDIO','♫ ATTIVA LA MUSICA')
 p.write_text(s,encoding='utf-8')
p=dist/'jesus-story.css';s=p.read_text(encoding='utf-8')
s=re.sub(r'#narration\{[^}]*\}','',s)
s=re.sub(r'\.speaking\{[^}]*\}','',s)
s=s.replace('cursor:help','cursor:text')
p.write_text(s,encoding='utf-8')
# Il vecchio modulo resta inerte anche se una vecchia pagina lo richiama dalla cache.
(dist/'narration.js').write_text('// Lettura vocale rimossa su richiesta: nessun narratore attivo.\n',encoding='utf-8')
p=root/'verifica-storia.html';s=p.read_text(encoding='utf-8')
s=s.replace('La voce italiana usa la sintesi vocale disponibile nel browser.','La lettura vocale e il comando “Voce attiva” sono stati rimossi su richiesta. Restano musica e battito finale.')
s=s.replace('Controlli della lettura vocale, del battito e della musica superati.','Controlli del battito e della musica superati. Nessun modulo di lettura vocale è caricato dalle pagine.')
s=s.replace('Impaginazione finale, prestazioni reali e qualità delle voci installate restano da controllare sul dispositivo.','Impaginazione finale, prestazioni reali e ascolto della musica restano da controllare sul dispositivo.')
p.write_text(s,encoding='utf-8')
for name in ['index.html','gesu.html','experience.js','jesus-story.js']:
 s=(dist/name).read_text(encoding='utf-8')
 for removed in ['id="narration"','src="narration.js"','speechSynthesis','Passa sulle parole','VOCE · ATTIVA']:
  assert removed not in s,(name,removed)
print('Rimossi comandi, suggerimenti e lettura vocale da entrambe le pagine. Musica mantenuta.')
