import json
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
root=Path(__file__).parent
scenes=json.loads((root/'scene-outlines.json').read_text(encoding='utf-8'))
out=root/'verification';out.mkdir(exist_ok=True)
for group in range(4):
 subset=scenes[group*10:(group+1)*10]
 sheet=Image.new('RGB',(1200,((len(subset)+1)//2)*420),'#170d12')
 draw=ImageDraw.Draw(sheet)
 try: font=ImageFont.truetype('C:/Windows/Fonts/georgia.ttf',22)
 except OSError:font=ImageFont.load_default()
 for k,scene in enumerate(subset):
  left=(k%2)*600;top=(k//2)*420
  draw.text((left+25,top+14),f'{group*10+k+1:02d}  '+scene['title'],font=font,fill='#f6ddc6')
  pts=scene['points']; n=1500
  for i in range(n):
   p=pts[min(len(pts)-1,int((i+.5)*len(pts)/n))]
   x=left+20+p['x']*.56;y=top+55+p['y']*.5
   radius=1.35+(i%7)*.13
   draw.ellipse((x-radius*.75,y-radius,x+radius*.75,y+radius),fill=['#d66f75','#e9aa9d','#aa3648'][i%3])
  draw.line((left+15,top+413,left+585,top+413),fill='#53313a')
 sheet.save(out/f'story-scenes-{group+1}.png')
print('Quattro tavole di verifica salvate in verification/.')
