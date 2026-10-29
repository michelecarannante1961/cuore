// Disegni originali: tutti i contorni sono campionati in piccoli chicchi.
(() => {
const E=(id,title,part,verse,book,chapter,text)=>({id,title,part,verse,url:`https://www.bibbiaedu.it/CEI2008/nt/${book}/${chapter}/`,text});
const scenes=[
E('deposizione','La cura dell’ultimo abbraccio','La Passione','Giovanni 19,38–40','Gv',19,'Giuseppe d’Arimatea chiede il corpo di Gesù. Con Nicodemo lo prepara per la sepoltura: anche nell’ora più buia, la pietà diventa un gesto di fraternità.'),
E('sepolcro','Il silenzio del sepolcro','Il silenzio','Matteo 27,57–61','Mt',27,'Una pietra chiude l’ingresso della tomba. Come un chicco nascosto nel buio della terra, tutto sembra fermarsi nell’attesa.'),
E('risurrezione','Il terzo giorno','La Pasqua','Luca 24,1–12','Lc',24,'La morte non chiude il racconto: il terzo giorno il sepolcro si apre come una scorza matura che lascia uscire la luce. La vita rinasce.'),
E('emmaus','Lo riconobbero nel pane','L’incontro','Luca 24,13–35','Lc',24,'Due viandanti camminano smarriti; un compagno di strada si affianca al loro passo. Quando spezza e condivide il pane, i loro occhi si aprono.'),
E('ascensione','Una promessa che continua','Il futuro','Luca 24,50–53','Lc',24,'Una benedizione silenziosa viene affidata alle mani dell’umanità: il cammino prosegue sulla terra, in ogni gesto che unisce.')
];
class Sketch{
 constructor(){this.points=[]}
 line(p){for(let i=1;i<p.length;i++){const a=p[i-1],b=p[i],n=Math.max(2,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/3));for(let j=0;j<n;j++)this.points.push({x:a[0]+(b[0]-a[0])*j/n,y:a[1]+(b[1]-a[1])*j/n})}}
 oval(x,y,rx,ry,angle=0,start=0,end=Math.PI*2){const p=[];for(let i=0;i<=70;i++){const t=start+(end-start)*i/70,a=Math.cos(t)*rx,b=Math.sin(t)*ry;p.push([x+a*Math.cos(angle)-b*Math.sin(angle),y+a*Math.sin(angle)+b*Math.cos(angle)])}this.line(p)}
 curve(a,b,c,d){const p=[];for(let i=0;i<=45;i++){const t=i/45,u=1-t;p.push([u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]])}this.line(p)}
}
function sceneDrawing(id){const s=new Sketch();
 const person=(x,y,h=260,kind='man',pose='rest')=>{const sc=h/260;const p=points=>points.map(([a,b])=>[x+a*sc,y+b*sc]);const line=pts=>s.line(p(pts));const oval=(a,b,c,d,angle=0,start=0,end=Math.PI*2)=>s.oval(x+a*sc,y+b*sc,c*sc,d*sc,angle,start,end);const female=kind==='mary',child=kind==='child',holy=kind==='jesus';
 oval(0,-225,21,28);line([[-7,-231],[-3,-231]]);line([[6,-231],[10,-231]]);line([[1,-229],[-1,-219],[4,-219]]);line([[-5,-211],[6,-211]]);
 if(female){s.curve(...p([[-28,-191],[-56,-286],[48,-294],[33,-179]]));line([[-27,-192],[-57,-8],[53,-8],[29,-192]]);line([[-20,-181],[-35,-55],[-18,-15]]);line([[16,-178],[30,-18]])}
 else{line([[-21,-231],[-28,-249],[-13,-263],[12,-262],[29,-247],[24,-212]]);if(!child)line([[-17,-210],[-12,-198],[2,-193],[17,-210]]);line([[-12,-195],[-38,-184],[-51,-9],[49,-9],[35,-184],[12,-195]]);line([[-14,-174],[-22,-17]]);line([[14,-160],[23,-16]]);if(holy){line([[-26,-246],[-34,-201],[-24,-190]]);oval(0,-231,39,43,0,Math.PI*1.05,Math.PI*1.95)}}
 let left=[[-35,-181],[-62,-130],[-42,-94]],right=[[35,-181],[61,-129],[43,-92]];
 if(pose==='open'){left=[[-35,-180],[-75,-164],[-112,-172]];right=[[35,-180],[75,-164],[112,-172]]}
 if(pose==='bless')right=[[35,-181],[66,-200],[76,-238]];
 if(pose==='kneel'){left=[[-35,-180],[-60,-139],[-4,-133]];right=[[35,-181],[54,-145],[5,-133]]}
 if(pose==='carry'){left=[[-35,-180],[-51,-136],[10,-144]];right=[[35,-181],[56,-145],[-5,-139]]}
 line(left);line(right);for(const hand of [left.at(-1),right.at(-1)])oval(hand[0],hand[1],6,8);
 line([[-29,-8],[-33,0],[-11,0]]);line([[16,-8],[17,0],[38,0]]);
 if(kind==='joseph')line([[71,-9],[70,-243],[75,-256]]);
 };
 const baby=(x,y)=>{s.oval(x,y,39,17,-.1);s.oval(x-29,y-1,11,12);s.line([[x-17,y-12],[x-5,y+12],[x+4,y-14],[x+17,y+11],[x+24,y-10]])};
 const manger=()=>{s.line([[365,476],[480,476],[464,513],[383,513],[365,476]]);s.line([[386,513],[463,555]]);s.line([[460,513],[386,555]]);baby(422,458)};
 const star=(x,y,r=25)=>{const pts=[];for(let i=0;i<=10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.42:r;pts.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr])}s.line(pts)};
 const house=()=>{s.line([[165,560],[165,242],[400,145],[642,240],[642,560]]);s.line([[255,560],[255,313],[335,313],[335,560]]);s.line([[494,319],[562,319],[562,393],[494,393],[494,319]])};
 const arch=(x=170,y=125,width=650)=>{s.line([[x,y+425],[x,y+100]]);s.curve([x,y+100],[x,y-85],[x+width,y-85],[x+width,y+100]);s.line([[x+width,y+100],[x+width,y+425]])};
 const palm=(x,y)=>{s.line([[x,y],[x+10,y-180]]);for(let i=-2;i<=2;i++)s.curve([x+10,y-180],[x+i*35,y-250],[x+i*65,y-225],[x+i*68,y-173])};
 const hill=()=>s.curve([70,560],[325,280],[650,300],[925,560]);
 const water=()=>{for(let j=0;j<4;j++){const pts=[];for(let x=90;x<=910;x+=12)pts.push([x,535+j*22+Math.sin(x*.025+j)*7]);s.line(pts)}};
 const boat=()=>{s.line([[155,430],[790,430],[700,520],[265,520],[155,430]]);s.line([[475,430],[475,165],[650,395],[475,395]])};
 const table=()=>{s.line([[183,441],[818,441],[818,475],[183,475],[183,441]]);s.line([[221,475],[221,560]]);s.line([[776,475],[776,560]])};
 const bread=(x,y)=>{s.oval(x,y,27,12);s.line([[x-13,y-4],[x-8,y+3]]);s.line([[x+2,y-6],[x+7,y+2]])};
 const fish=(x,y)=>{s.oval(x,y,28,11);s.line([[x+25,y],[x+45,y-15],[x+45,y+15],[x+25,y]])};
 const jar=(x,y)=>{s.curve([x-14,y-70],[x-6,y-37],[x-47,y-25],[x-29,y]);s.line([[x-29,y],[x+29,y]]);s.curve([x+29,y],[x+47,y-25],[x+6,y-37],[x+14,y-70]);s.line([[x-14,y-70],[x+14,y-70]])};
 const cross=(x,y,h=330)=>{const a=h/330;s.line([[x-12*a,y],[x-12*a,y-h],[x+12*a,y-h],[x+12*a,y],[x-12*a,y]]);s.line([[x-12*a,y-h*.72],[x-105*a,y-h*.72],[x-105*a,y-h*.79],[x+105*a,y-h*.79],[x+105*a,y-h*.72],[x+12*a,y-h*.72]])};
 const tomb=(open=false)=>{s.curve([300,566],[140,60],[850,30],[860,566]);s.line([[300,566],[860,566]]);s.oval(560,432,87,124);s.oval(open?770:560,455,98,111)};
 const angel=(x,y)=>{person(x,y,230,'man','open');s.curve([x-25,y-160],[x-175,y-330],[x-190,y-100],[x-37,y-87]);s.curve([x+25,y-160],[x+175,y-330],[x+190,y-100],[x+37,y-87])};
 const crowd=(n=5,y=555)=>{for(let i=0;i<n;i++)person(170+i*(660/Math.max(1,n-1)),y,135+(i%2)*15,'man',i%2?'open':'rest')};
 const embrace=()=>{person(435,550,280,'man','carry');person(515,550,225,'man','carry')};
 switch(id){
 case 'annunciazione':arch();person(615,552,280,'mary','kneel');angel(360,485);star(530,150,18);break;
 case 'sogno':s.line([[220,510],[740,510],[740,554],[220,554],[220,510]]);s.oval(362,476,30,24);s.curve([392,475],[520,438],[625,470],[686,510]);angel(620,330);break;
 case 'nativita':arch(150,145,680);person(310,554,260,'mary','carry');person(590,554,290,'joseph');manger();star(430,130);break;
 case 'pastori':person(270,555,240,'mary','carry');person(570,555,265,'joseph');manger();person(755,556,240,'man','kneel');s.line([[805,550],[805,303],[824,286],[840,303]]);s.oval(170,552,39,22);s.oval(137,536,14,16);star(445,145);break;
 case 'magi':person(240,555,270,'mary','carry');baby(245,418);for(let i=0;i<3;i++){person(470+i*147,555,245+i*12,'man',i===0?'kneel':'carry');s.line([[445+i*147,299-i*12],[452+i*147,278-i*12],[470+i*147,292-i*12],[490+i*147,275-i*12],[496+i*147,300-i*12]]);s.line([[455+i*147,452],[485+i*147,452],[485+i*147,475],[455+i*147,475],[455+i*147,452]])}star(565,135);break;
 case 'egitto':person(375,550,270,'mary','carry');baby(378,409);person(580,550,285,'joseph');palm(800,550);s.curve([60,576],[250,530],[650,590],[930,544]);star(210,145,14);break;
 case 'nazaret':house();person(420,553,270,'mary');person(565,553,285,'joseph');person(495,555,145,'child','open');break;
 case 'tempio':arch();for(let x of [170,275,725,830])s.line([[x,230],[x,555]]);person(490,550,185,'child','open');person(345,550,255,'man');person(650,550,265,'man');s.line([[450,331],[480,322],[510,331],[540,322],[540,356],[510,364],[480,356],[450,365],[450,331]]);break;
 case 'bottega':house();person(385,550,285,'joseph');person(610,550,190,'child','carry');s.line([[305,431],[720,431],[720,456],[305,456],[305,431]]);s.line([[350,456],[350,553]]);s.line([[680,456],[680,553]]);s.line([[440,414],[495,382],[540,395]]);break;
 case 'battesimo':water();person(430,528,280,'jesus','kneel');person(640,505,280,'man','bless');s.curve([470,135],[500,80],[540,115],[515,140]);s.curve([515,140],[565,105],[595,120],[560,153]);s.line([[512,145],[523,159],[538,147]]);break;
 case 'deserto':hill();person(500,535,295,'jesus','kneel');s.oval(230,527,42,20);s.oval(760,535,48,25);s.oval(725,200,48,48);break;
 case 'discepoli':water();s.line([[160,505],[360,505],[320,540],[200,540],[160,505]]);person(650,515,295,'jesus','open');person(360,509,240);person(245,498,230);for(let j=0;j<5;j++)s.line([[160+j*35,530],[200+j*35,590]]);break;
 case 'cana':arch();person(375,510,290,'jesus','bless');person(210,510,265,'mary');for(let i=0;i<6;i++)jar(390+i*80,565);break;
 case 'monte':hill();person(500,400,285,'jesus','open');crowd(5,615);break;
 case 'samaritano':s.curve([90,590],[320,540],[480,550],[900,570]);s.oval(480,520,92,24);s.oval(386,503,23,24);person(560,510,235,'man','kneel');s.line([[330,440],[354,490],[385,510]]);palm(800,540);break;
 case 'padre':arch();embrace();person(755,550,250,'man');break;
 case 'lebbroso':person(400,550,290,'jesus','open');person(660,550,245,'man','kneel');s.line([[515,360],[620,390]]);hill();break;
 case 'cieco':person(390,545,285,'jesus','bless');person(620,545,260,'man');s.line([[460,310],[595,325]]);s.oval(620,352,28,7);s.line([[720,470],[850,470],[875,555],[700,555],[720,470]]);break;
 case 'tempesta':boat();water();person(350,430,210,'jesus','open');person(605,430,185,'man','kneel');s.line([[210,112],[350,96],[320,153],[395,139]]);s.line([[665,96],[775,123],[730,160]]);break;
 case 'pani':person(490,480,290,'jesus','open');person(280,485,145,'child','carry');for(let i=0;i<5;i++)bread(270+i*85,550);fish(680,535);fish(720,570);for(let i=0;i<4;i++)s.line([[270+i*150,588],[290+i*150,630],[335+i*150,630],[355+i*150,588],[270+i*150,588]]);break;
 case 'bambini':person(500,545,285,'jesus','open');[240,365,625,760].forEach((x,i)=>person(x,552,120+i%2*30,'child','open'));break;
 case 'lazzaro':tomb(true);person(310,550,285,'jesus','bless');person(555,546,250,'man','open');for(let j=0;j<5;j++)s.line([[525,370+j*29],[580,380+j*29]]);person(810,560,225,'mary');break;
 case 'zaccheo':s.line([[620,555],[628,330],[585,220]]);s.line([[635,550],[655,330],[730,215]]);s.oval(630,240,170,105);person(660,350,160,'man');person(350,552,285,'jesus','bless');break;
 case 'trasfigurazione':hill();person(490,430,285,'jesus','open');person(250,455,250,'man');person(740,455,250,'man');for(let i=0;i<12;i++){const a=i*Math.PI/6;s.line([[490+Math.cos(a)*145,300+Math.sin(a)*150],[490+Math.cos(a)*185,300+Math.sin(a)*190]])}break;
 case 'gerusalemme':arch(620,140,270);s.oval(490,480,110,45);s.oval(610,430,28,38);s.line([[412,510],[395,565]]);s.line([[550,510],[567,565]]);person(485,450,240,'jesus','bless');person(210,560,240,'man','open');person(790,560,220,'man','open');palm(130,530);break;
 case 'cena':arch(105,140,800);for(let i=0;i<13;i++)person(200+i*50,441,i===6?185:150,i===6?'jesus':'man',i===6?'open':'rest');table();bread(490,438);s.oval(605,428,14,6);s.line([[591,428],[597,451],[613,451],[619,428]]);s.line([[605,451],[605,466]]);break;
 case 'lavanda':person(620,530,265,'man');person(390,548,240,'jesus','kneel');s.oval(525,550,70,19);s.line([[457,550],[477,576],[573,576],[595,550]]);s.line([[603,517],[548,543]]);break;
 case 'getsemani':person(485,545,285,'jesus','kneel');palm(230,550);palm(790,545);s.oval(685,170,36,36);s.oval(770,575,58,20);break;
 case 'arresto':person(455,550,285,'jesus');person(520,550,268,'man','carry');person(245,550,270,'man');person(755,550,275,'man');s.line([[190,550],[190,200]]);s.line([[810,550],[810,185]]);star(810,160,14);break;
 case 'pilato':arch();person(360,550,285,'jesus');person(650,475,270,'man','open');s.line([[575,490],[740,490],[740,560],[575,560],[575,490]]);s.line([[565,375],[565,490]]);s.line([[750,375],[750,490]]);break;
 case 'via':hill();person(480,555,260,'jesus','carry');s.line([[370,560],[635,220],[653,233],[389,574],[370,560]]);s.line([[490,310],[615,415],[630,397],[507,294]]);person(290,558,245,'man','carry');break;
 case 'croce':cross(500,555,380);s.oval(500,240,20,26);s.line([[477,274],[398,270],[387,278]]);s.line([[523,274],[601,270],[614,278]]);s.line([[480,275],[482,363],[518,363],[520,275]]);s.line([[484,363],[493,442],[505,447],[514,363]]);person(290,570,235,'mary','kneel');person(720,570,245,'man','kneel');cross(115,530,220);cross(895,530,220);break;
 case 'deposizione':person(330,555,265,'man','carry');person(675,555,265,'man','carry');person(500,555,250,'mary','kneel');s.oval(420,434,22,25);s.curve([440,428],[510,412],[560,442],[610,450]);s.line([[440,451],[570,472],[623,451]]);break;
 case 'sepolcro':tomb();person(175,560,245,'mary','kneel');person(855,560,235,'mary','kneel');break;
 case 'risurrezione':tomb(true);person(475,457,280,'jesus','open');person(210,570,215,'mary','kneel');for(let i=0;i<13;i++){const a=Math.PI+i*Math.PI/12;s.line([[480+Math.cos(a)*125,280+Math.sin(a)*125],[480+Math.cos(a)*170,280+Math.sin(a)*170]])}break;
 case 'emmaus':person(485,445,255,'jesus','open');person(270,445,230,'man');person(710,445,230,'man');table();bread(480,435);break;
 case 'tommaso':person(430,550,295,'jesus','open');person(650,550,265,'man','carry');s.line([[600,405],[459,365]]);s.oval(449,365,7,10);break;
 case 'lago':water();person(500,515,285,'jesus','open');person(290,520,245,'man');person(735,520,240,'man');bread(450,563);fish(570,563);star(510,600,16);break;
 case 'ascensione':person(500,380,285,'jesus','open');crowd(5,615);s.curve([240,410],[400,360],[600,445],[780,390]);for(let i=0;i<7;i++)star(230+i*95,130+(i%2)*35,6);break;
 default:throw new Error('Scena sconosciuta: '+id);
 }
 return s.points;
}
window.JesusStory={scenes,sceneDrawing};
})();
