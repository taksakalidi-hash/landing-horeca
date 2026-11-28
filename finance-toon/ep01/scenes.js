// Broke by Friday ep01 — scenes. Each SC[name](t, b): b.t0/t1 block window, b.T(word,n) cue time, b.lines.
const bd=()=>X.drawImage(BOARD,0,0);
const L=(b,i)=>b.lines[i]||b.end;

SC.hook=(t,b)=>{const t40=b.T('forty'),tm=b.T('million'),tn=b.T('nothing'),tw=L(b,1).start;
 X.save();camera(t,[[b.t0,1.0,960,540],[tm,1.08,960,520,.6],[tw-.1,1.3,1000,440,.25]]);
 const d=office(t,b,[[b.t0,'type'],[tm,'happy',.4],[tn,'confused',.3],[tw-.1,'scared',.2]],{desk:()=>{
  // money leaks from a wallet on the desk
  doodle(t,'coin',560,700,.01,1e9);const wk=pop(t,tm-.2);if(wk>0)at(560,735,wk,0,()=>{rr(-80,-45,160,90,14);sh('#6b4a2e',7);rr(-80,-20,160,26,6);sh('#5a3d25',5)});
  for(let i=0;i<7;i++){const k=t-(tn-.3+i*.18);if(k<0||k>3)continue;bill(560+k*(500+i*90),735-Math.sin(Math.min(k,1)*Math.PI)*220-k*40,.9,t+i,k>.4)}}});
 X.restore();
 burst(t,t40,430,260,140,YEL,'40 YEARS','OF WORK',-.12,INK);
 if(t>tm-.3){X.save();X.translate(1660,46);rr(0,0,230,110,18);sh(NAVY,6);txt('EARNED',22,30,20,YEL,'InterB','left');X.restore();
  const v=t<tn?1000000*eout((t-tm+.2)/1.2):Math.max(0,1000000*(1-eout((t-tn)/1.6)));txt('$'+Math.round(v).toLocaleString('en-US'),1680,122,v>=1e6?44:48,v<5e4?'#ff6b6b':'#fff','Anton','left')}
 bubble(t,tw,null,1430,250,500,200,'WHERE DOES IT\nALL GO?!',-210,120,52);};
function bill(x,y,s,t,legs){X.save();X.translate(x,y);X.scale(s,s);
 if(legs){const k=Math.sin(t*28);X.beginPath();X.moveTo(-18,28);X.lineTo(-18+k*14,58);X.lineTo(-4+k*14,60);X.moveTo(18,28);X.lineTo(18-k*14,58);X.lineTo(32-k*14,60);sh(null,6)}
 rr(-62,-32,124,64,6);sh('#8fc77a',6);rr(-50,-22,100,44,4);sh(null,3,'#4e8a3d');ell(0,0,18,18);sh('#cfe8c0',3);txt('$',0,2,26,'#2f6a2a');
 ell(-30,-4,8,9);sh('#fff',3);ell(30,-4,8,9);sh('#fff',3);ell(-27,-3,3.5,4);sh(INK,0);ell(33,-3,3.5,4);sh(INK,0);X.restore()}

SC.hook2=(t,b)=>{bd();const t7=b.T('seven'),tf=b.T('four');
 label(t,b.t0+.2,960,190,1,72,INK,'#fff');txt('',0,0,1);
 if(t>b.t0+.2){}
 const k0=pop(t,t7);if(k0>0)at(960,190,k0,-.02,()=>{});
 label(t,t7-.05,960,180,1,84,INK,YEL,-.02);
 for(let i=0;i<7;i++){const x=300+i*220,y=520,t0=t7+.15+i*.12;const hi=t>tf&&i===3;const k=pop(t,t0);if(k<=0)continue;const[bx,by]=boil(t);
  at(x+bx,y+by+(hi?-30*eout((t-tf)/.3):0),k*(hi?1+.35*eout((t-tf)/.3):1),0,()=>{ell(0,0,80,80);sh(hi?RED:'#fff',8);txt(String(i+1),0,6,90,hi?'#fff':INK)})}
 // overwrite label text (simple approach: draw text on top)
 if(t>t7-.05){const k=pop(t,t7-.05,.4);at(960,180,k,-.02,()=>txt('7 SIMPLE RULES',0,3,84,YEL))}
 burst(t,tf+.2,960,800,150,GRN,'THOUSANDS','SAVED',.08);
 if(t<t7){const k=pop(t,b.t0+.2);at(960,520,k,0,()=>{txt('NOBODY TAUGHT YOU THIS',0,0,110,INK)})}};

SC.rule=(t,b)=>{X.drawImage(NAVYBG,0,0);const r=b.l0.r,k=pop(t,b.l0.start-.1,.5),k2=pop(t,b.l0.start+.45,.45);
 for(let i=0;i<10;i++){const a=t*.4+i*.63;doodle(t,'coin',960+Math.cos(a)*(620+i*20),540+Math.sin(a)*(330+i*10),.7,b.t0+i*.05)}
 at(960,430,k,-.03,()=>{txt('RULE',0,-120,110,'#fff');txt('#'+r,0,60,300,YEL)});
 label(t,b.l0.start+.45,960,800,1,78,RED,'#fff',.02);if(k2>0)at(960,800,k2,.02,()=>txt(b.l0.title,0,3,78,'#fff'))};
// note: label() draws an empty box sized for '' — we draw a proper sized box instead:
function tlabel(t,t0,x,y,s,size,bg,col,r){const k=pop(t,t0,.4);if(k<=0)return;X.save();X.translate(x,y);X.rotate(r||-.02);X.scale(k,k);X.font=size+'px Anton';const w=X.measureText(s).width+size*.9,h=size*1.45;
 X.shadowColor='rgba(0,0,0,.25)';X.shadowOffsetY=6;X.shadowBlur=8;rr(-w/2,-h/2,w,h,12);sh(bg||INK,0);X.shadowColor='transparent';txt(s,0,3,size,col||'#fff');X.restore()}
SC.rule=(t,b)=>{X.drawImage(NAVYBG,0,0);const r=b.l0.r,k=pop(t,b.l0.start-.1,.5);
 for(let i=0;i<10;i++){const a=t*.4+i*.63;doodle(t,'coin',960+Math.cos(a)*(640+i*18),540+Math.sin(a)*(360+i*8),.7,b.t0+i*.05)}
 at(960,430,k,-.03,()=>{txt('RULE',0,-130,110,'#fff');txt('#'+r,0,60,300,YEL)});
 tlabel(t,b.l0.start+.45,960,810,1,78,RED,'#fff',.02)};
SC.rule=((f)=>(t,b)=>{f(t,b);const k=pop(t,b.l0.start+.45,.4);if(k>0){X.save();X.translate(960,810);X.rotate(.02);X.scale(k,k);X.font='78px Anton';const w=X.measureText(b.l0.title).width+70;rr(-w/2,-57,w,114,12);sh(RED,0);txt(b.l0.title,0,3,78,'#fff');X.restore()}})((t,b)=>{X.drawImage(NAVYBG,0,0);const r=b.l0.r,k=pop(t,b.l0.start-.1,.5);
 for(let i=0;i<10;i++){const a=t*.4+i*.63;doodle(t,'coin',960+Math.cos(a)*(640+i*18),540+Math.sin(a)*(360+i*8),.7,b.t0+i*.05)}
 at(960,430,k,-.03,()=>{txt('RULE',0,-130,110,'#fff');txt('#'+r,0,60,300,YEL)})});

SC.hook2=(t,b)=>{bd();const t7=b.T('seven'),tf=b.T('four');
 if(t<t7){const k=pop(t,b.t0+.2);at(960,500,k,-.02,()=>{txt('NOBODY TAUGHT',0,-70,120,INK);txt('YOU THIS',0,70,120,RED)})}
 else{
  for(let i=0;i<7;i++){const x=300+i*220,y=520,t0=t7+.15+i*.12;const hi=t>tf&&i===3;const k=pop(t,t0);if(k<=0)continue;const[bx,by]=boil(t);
   at(x+bx,y+by+(hi?-30*eout((t-tf)/.3):0),k*(hi?1+.35*eout((t-tf)/.3):1),0,()=>{ell(0,0,80,80);sh(hi?RED:'#fff',8);txt(String(i+1),0,6,90,hi?'#fff':INK)})}
  burst(t,tf+.2,960,820,150,GRN,'THOUSANDS','SAVED',.08)}};
SC.hook2=((f)=>(t,b)=>{f(t,b);if(t>=b.T('seven')-.05){const k=pop(t,b.T('seven')-.05,.4);if(k>0){X.save();X.translate(960,180);X.rotate(-.02);X.scale(k,k);X.font='84px Anton';const w=X.measureText('7 SIMPLE RULES').width+76;rr(-w/2,-61,w,122,12);sh(INK,0);txt('7 SIMPLE RULES',0,3,84,YEL);X.restore()}}})(SC.hook2);

SC.big3=(t,b)=>{bd();const th=b.T('housing'),tc=b.T('car',0,b.lines[1].start),tfd=b.T('food'),tco=b.T('coffee'),tl=b.T('leak');
 if(t>b.t0+.15){const k=pop(t,b.t0+.15,.4);X.save();X.translate(960,140);X.rotate(-.02);X.scale(k,k);X.font='70px Anton';const s=t<b.lines[1].start?'YOU GUESS YOUR SPENDING':'THE BIG THREE';const w=X.measureText(s).width+64;rr(-w/2,-51,w,102,12);sh(INK,0);txt(s,0,3,70,'#fff');X.restore()}
 if(t<b.lines[1].start){doodle(t,'phone',960,560,1.4,b.t0+.3);const k=t-b.T('guess');if(k>0){txt('YOU THINK:',760,470,44,INK,'Anton','right');counter(t,b.T('guess'),760,540,0,1800,90,GRN,'$','',.8,'right');}
  if(t>b.T('miss')){txt('REALITY:',1160,470,44,INK,'Anton','left');counter(t,b.T('miss'),1160,540,1800,2450,90,RED,'$','',.8,'left');burst(t,b.T('hundreds'),1400,800,120,RED,'-$650','/MONTH',.1)}
  doodle(t,'coin',960,560,.01,1e9);return}
 doodle(t,'mosquito',330,540,1.8,tco-.1);cross(t,tco+.4,330,540,1.6);txt('NOT THIS',330,720,48,INK);
 doodle(t,'house',780,520,1.6,th);tlabelBox(t,th+.1,780,800,'HOUSING',48,INK,'#fff');
 doodle(t,'car',1200,560,1.45,tc);tlabelBox(t,tc+.1,1200,800,'CAR',48,INK,'#fff');
 doodle(t,'bag',1600,520,1.45,tfd);tlabelBox(t,tfd+.1,1600,800,'FOOD',48,INK,'#fff');
 if(t>b.T('delivery'))burst(t,b.T('delivery'),1640,400,95,RED,'DELIVERY!','',.15)};

SC.bear=(t,b)=>{const tm=b.T('mosquito'),tb=b.T('bear'),tdv=L(b,1).start;
 X.save();camera(t,[[b.t0,1.05,1050,560],[tb,1.0,960,540,.3],[tdv,1.2,1000,470,.25]]);
 office(t,b,[[b.t0,'lookR'],[tb,'scared',.2]],{penny:[[b.t0,'smug'],[tb,'roll',.3]],behind:()=>{const k=eout((t-tb+.1)/.5);if(k>0){const[bx,by]=boil(t);at(1560+bx,820-360*k+by,1.25,0,()=>D.bear(t))}},
  front:()=>{if(t>tm-.2&&t<tb+.3){const a=t*3;at(980+Math.cos(a)*240,330+Math.sin(a*1.7)*60,1,Math.sin(a*2)*.2,()=>D.mosquito(t))}}});
 X.restore();
 if(t>tm-.1&&t<tb){const k=pop(t,tm,.4);at(560,180,k,-.02,()=>{X.font='54px Anton';const w=X.measureText('LATTE = MOSQUITO').width+50;rr(-w/2,-40,w,80,12);sh(INK,0);txt('LATTE = MOSQUITO',0,3,54,'#fff')})}
 if(t>tb){const k=pop(t,tb,.4);at(560,180,k,-.02,()=>{X.font='60px Anton';const w=X.measureText('DELIVERY = BEAR').width+56;rr(-w/2,-44,w,88,12);sh(RED,0);txt('DELIVERY = BEAR',0,3,60,'#fff')})}
 bubble(t,tdv,null,600,380,330,170,'A BEAR?!',140,110,60)};

SC.sort=(t,b)=>{bd();const tn=b.T('needs'),tw=b.T('wants'),ty=b.T('why'),tb=b.T('banking'),t10=b.T('ten'),tf=b.T('finds');
 tlabelBox(t,b.t0+.15,960,110,'DO THIS TODAY',64,RED,'#fff');doodle(t,'phone',300,560,1.25,b.t0+.3);if(t>b.t0+.5){txt('LAST MONTH',300,420,26,INK,'InterB');for(let i=0;i<6;i++){X.fillStyle=i%2?'#c9d8e2':'#9fb8c9';X.fillRect(235,450+i*42,130,24)}}
 const cols=[[tn,'NEEDS',GRN,['RENT','GROCERIES','BUS PASS']],[tw,'WANTS','#3d7fb0',['MOVIES','DINNER OUT','NEW HOODIE']],[ty,'WHY DID I BUY THAT?!',RED,['3AM ORDER','GOLD PHONE CASE','4TH STREAMING']]];
 cols.forEach(([t0,name,c,items],i)=>{const x=760+i*420;const k=pop(t,t0);if(k<=0)return;at(x,230,k,i===2?.03:-.02,()=>{X.font=(i===2?40:58)+'px Anton';const w=Math.max(300,X.measureText(name).width+40);rr(-w/2,-45,w,90,12);sh(c,0);txt(name,0,3,i===2?40:58,'#fff')});
  items.forEach((it,j)=>{const s=t0+.35+j*.3;const e=eout((t-s)/.45);if(e<=0)return;const x0=300,y0=560,x1=x,y1=380+j*110;const xx=lerp(x0,x1,e),yy=lerp(y0,y1,e)-Math.sin(e*Math.PI)*120;at(xx,yy,.6+.4*e,0,()=>{rr(-170,-38,340,76,14);sh('#fff',6);txt(it,0,3,40,INK)})})});
 if(t>t10-.1&&t<tf){X.fillStyle='rgba(242,184,28,.85)';X.fillRect(0,0,W,H);doodle(t,'clock',620,560,1.3,t10-.05,0,(t-t10)*2);burst(t,t10+.1,620,330,105,INK,'10 MIN','',-.1,'#fff');doodle(t,'sheet',1240,560,1.3,b.T('notes'))}
 if(t>=tf){X.fillStyle='rgba(242,184,28,.9)';X.fillRect(0,0,W,H);for(let i=0;i<14;i++){const k=t-tf-i*.05;if(k<0)continue;doodle(t,'coin',960+Math.cos(i*2.4)*360*eout(k*1.5),560+Math.sin(i*2.4)*240*eout(k*1.5),1,tf+i*.05)}burst(t,tf+.2,960,560,190,GRN,'FOUND MONEY','',-.06)}};

SC.flip=(t,b)=>{bd();const tl=b.T('left'),tn=b.T('nothing'),tf=b.T('flip');
 const row=(y,a,bb,c,t0,good)=>{tlabelBox(t,t0,520,y,a,64,INK,'#fff');arrow(t,t0+.3,760,y,1060,y,0);tlabelBox(t,t0+.6,1330,y,bb,64,c,'#fff')};
 row(330,'SPEND','SAVE LEFTOVERS',RED,b.t0+.2);if(t>tn){txt('= $0',1700,330,90,RED);cross(t,tn+.2,1330,330,1.6)}
 if(t>tf-.1){row(700,'SAVE FIRST','SPEND THE REST',GRN,tf-.1);check(t,tf+.8,1700,700,2)}};
function tlabelBox(t,t0,x,y,s,size,bg,col,r=-.02){const k=pop(t,t0,.4);if(k<=0)return;X.save();X.translate(x,y);X.rotate(r);X.scale(k,k);X.font=size+'px Anton';const w=X.measureText(s).width+size*.9;rr(-w/2,-size*.72,w,size*1.45,12);X.shadowColor='rgba(0,0,0,.25)';X.shadowOffsetY=6;X.shadowBlur=8;sh(bg,0);X.shadowColor='transparent';txt(s,0,3,size,col);X.restore()}

SC.vault=(t,b)=>{const tp=b.T('payday'),tc=L(b,1).start;
 X.save();camera(t,[[b.t0,1,960,540],[tc-.1,1.15,1100,500,.25]]);
 office(t,b,[[b.t0,'type'],[tp,'look',.25],[tc-.15,'reach',.2]],{penny:[[b.t0,'idle'],[tc,'smug',.3]],desk:()=>{
  const dk=cl((t-(tc-.05))/.15);doodle(t,'vault',1640,610,1.05,b.T('savings')-.4);if(t>b.T('savings')-.3){at(1640+Math.cos(-dk*1.6)*0,610,1.05,0,()=>{X.save();X.beginPath();X.rect(-130,-130,260*(1-dk*.0),260);X.restore()})}
  for(let i=0;i<6;i++){const s=tp+.1+i*.22,k=(t-s)/.7;if(k<0||k>1)continue;const x=lerp(560,1640,eout(k)),y=lerp(760,610,k)-Math.sin(k*Math.PI)*260;bill(x,y,.8,t+i,false)}
  if(dk>0){at(1640,610,1.05,0,()=>{X.save();X.scale(1-0*dk,1);rr(-120,-120,240*dk,240,18);sh('#7d8894',8);X.restore()})}}});
 X.restore();
 if(t>tp-.1&&t<tc)burst(t,tp,560,420,110,GRN,'PAYDAY','',-.1);
 tlabelBox(t,b.T('automatic')-.1,700,170,'AUTOMATIC TRANSFER',58,INK,'#fff');
 bubble(t,tc,null,620,330,420,170,'HEY! COME BACK!',180,110,52)};

SC.count=(t,b)=>{bd();const t10=b.T('ten'),t3=b.T('three'),t36=b.T('six'),ta=b.T('action'),t50=b.T('fifty');
 if(t<ta-.1){const k=pop(t,t10);if(k>0)at(330,520,k,-.05,()=>{ell(0,0,170,170);sh('#fff',9);txt('10%',0,8,140,RED)});
  arrow(t,t3,520,520,760,520,-40);tlabelBox(t,t3+.4,1020,420,'$300',120,GRN,'#fff');txt('PER MONTH',1020,560,48,INK);
  arrow(t,t36-.3,1220,520,1440,520,-40);if(t>t36-.1){counter(t,t36-.1,1650,450,300,3600,120,INK,'$','',1.0);txt('PER YEAR',1650,560,48,INK)}
  txt('ON A $3,000 PAYCHECK',960,820,52,INK)}
 else{doodle(t,'calendar',480,520,1.4,ta);check(t,ta+.6,480,540,2.2);tlabelBox(t,ta+.3,1200,380,'SET UP 1 AUTO-TRANSFER',62,INK,'#fff');burst(t,t50,1200,640,140,GRN,'$50','COUNTS',.08);tlabelBox(t,b.T('habit'),1200,880,'HABIT > AMOUNT',62,RED,'#fff')}};

SC.car=(t,b)=>{bd();tlabelBox(t,b.t0+.15,960,110,'LIFE THROWS ROCKS',66,INK,'#fff');const tc=b.T('broken'),tde=b.T('dentist'),tj=b.T('lost'),tcc=b.T('credit'),tp=L(b,1).start;
 const items=[[tc,'car',400,'$1,400'],[tde,'tooth',960,'$800'],[tj,'box',1520,'NO JOB']];
 items.forEach(([t0,nm,x,pr],i)=>{const k=pop(t,t0);if(k<=0)return;const[bx,by]=boil(t);at(x+bx,440+by,k*1.45,0,()=>{if(nm==='car')D.car();else if(nm==='tooth'){X.beginPath();X.moveTo(-60,-70);X.quadraticCurveTo(0,-100,60,-70);X.quadraticCurveTo(80,0,50,90);X.lineTo(20,20);X.lineTo(-20,20);X.lineTo(-50,90);X.quadraticCurveTo(-80,0,-60,-70);sh('#fff',7)}else{rr(-100,-70,200,140,8);sh('#d9a066',7);X.beginPath();X.moveTo(-100,-30);X.lineTo(100,-30);sh(null,5)}});
  burst(t,t0+.25,x+130,250,90,RED,pr,'',.15);if(nm==='car'&&t>t0+.3){for(let j=0;j<5;j++){const k2=((t*1.3+j*.2)%1);X.globalAlpha=1-k2;ell(x-150-k2*60,470-k2*120,30+k2*40,24+k2*30);sh('#ddd',5);X.globalAlpha=1}}});
 if(t>tcc-.1&&t<tp){const k=pop(t,tcc);at(960,800,k,.05,()=>{rr(-150,-90,300,180,16);sh(RED,7);X.fillStyle=YEL;X.fillRect(-120,-50,60,40);txt('CREDIT CARD',0,50,36,'#fff')})}
 if(t>=tp){penny(t,650,900,1.3,[[tp,'smug']]);const k=pop(t,tp+.2);doodle(t,'pillow',1200,780,1.4,tp+.2);if(t>tp+.3)cross(t,tp+.3,960,800,0)}};

SC.fund=(t,b)=>{bd();const t3=b.T('three'),t75=b.T('seventy'),t15=b.T('fifteen'),tm=b.T('milestone'),ts=b.T('separate');
 if(t<tm-.3){tlabelBox(t,b.t0+.2,960,140,'3–6 MONTHS OF BASIC EXPENSES',64,INK,'#fff');
  for(let i=0;i<6;i++){const s=t3+.2+i*.25,k=eout((t-s)/.5);if(k<=0)continue;const x=430+i*215,hh=300*k;X.beginPath();X.rect(x-70,820-hh,140,hh);sh(i<3?GRN:'#7fc796',6);txt('M'+(i+1),x,850,34);if(k>.9)txt('$2,500',x,820-hh-30,30)}
  if(t>t75-.1){X.beginPath();X.moveTo(360,440);X.lineTo(360,420);X.lineTo(1000,420);X.lineTo(1000,440);sh(null,7);tlabelBox(t,t75-.1,680,360,'$7,500',60,GRN,'#fff')}
  if(t>t15-.1){X.beginPath();X.moveTo(360,330);X.lineTo(360,300);X.lineTo(1650,300);X.lineTo(1650,330);sh(null,7);tlabelBox(t,t15-.1,1300,240,'$15,000',60,'#1d5a33','#fff')}}
 else{const k=pop(t,tm-.2);if(k>0)at(560,560,k,0,()=>{X.beginPath();X.moveTo(-10,250);X.lineTo(-10,-200);sh(null,12);X.beginPath();X.moveTo(-10,-200);X.lineTo(200,-150);X.lineTo(-10,-90);X.closePath();sh(RED,7);txt('$1,000',90,-140,40,'#fff')});
  tlabelBox(t,tm,560,880,'FIRST MILESTONE',56,INK,'#fff');doodle(t,'vault',1350,500,1.2,ts);tlabelBox(t,ts+.3,1350,760,'SEPARATE ACCOUNT',56,GRN,'#fff');cross(t,b.T('everyday')+.2,1350,920,.6);if(t>b.T('everyday'))txt('NOT YOUR DAILY CARD',1350,990,38,INK)}};

SC.dragon=(t,b)=>{const t20=b.T('twenty'),td=L(b,1).start,tp=L(b,2).start;
 X.save();camera(t,[[b.t0,1,960,540],[td-.1,1.12,1000,500,.3]]);
 office(t,b,[[b.t0,'idle'],[td-.1,'scared',.2]],{penny:[[b.t0,'look'],[tp,'shout',.2]],desk:()=>{const g=.6+.12*Math.floor(Math.max(0,t-b.t0)/1.2)+.08*Math.sin(t*3);const k=pop(t,b.t0+.3);if(k>0){const[bx,by]=boil(t);at(560+bx,620+by,k*Math.min(g,1.35),0,()=>D.dragon(t))}}});
 X.restore();burst(t,t20,560,250,110,YEL,'20%+','A YEAR',-.12,INK);
 bubble(t,td,tp+.1,1350,260,520,190,'WHY IS IT\nGETTING BIGGER?!',-200,120,48);
 bubble(t,tp,null,1400,420,520,170,'YOU ONLY PAY\nTHE MINIMUM.',-130,140,46)};

SC.debt=(t,b)=>{bd();const t1=b.T('hundred'),t44=b.T('forty-four'),t14=b.T('fourteen'),t2=b.T('two',0,b.lines[1].start),t18=b.T('eighteen'),t54=b.T('forty',0,b.lines[1].start),ts=b.T('saved');
 tlabelBox(t,b.t0+.2,960,130,'$3,000 DEBT AT 22%',66,INK,'#fff');
 const row=(y,t0,lab,months,mx,col,interest,ti)=>{if(t<t0)return;tlabelBox(t,t0,260,y,lab,54,col,'#fff');const k=eout((t-t0-.3)/1.4);X.beginPath();X.rect(420,y-40,1100*mx*k,80);sh(col,6);
  if(k>.05)txt(Math.round(months*k)+' MONTHS',420+1100*mx*k-20,y+2,44,'#fff','Anton','right');if(t>ti)counter(t,ti,1560,y,0,interest,60,RED,'$','',.8,'left');if(t>ti)txt('INTEREST',1560,y+50,26,INK,'InterB','left')};
 row(380,t1,'$100/MO',44,1,RED,1395,t14);row(620,t2,'$200/MO',18,18/44,GRN,540,t54);
 burst(t,ts,960,880,140,GRN,'~$900','SAVED',.06)};

SC.aval=(t,b)=>{bd();const tm=b.T('minimum'),te=b.T('extra'),th=b.T('highest');
 const debts=[['CAR LOAN','6%','#5aa9e6'],['STORE CARD','15%','#f2994a'],['CREDIT CARD','22%',RED]];
 debts.forEach(([n,r,c],i)=>{const k=pop(t,b.t0+.2+i*.15);if(k<=0)return;const sorted=t>th;const y=sorted?300+(2-i)*200:300+i*200;const yy=lerp(300+i*200,y,eout((t-th)/.6));at(700,yy,k,0,()=>{rr(-260,-70,520,140,16);sh(c,7);txt(n,-90,4,52,'#fff');txt(r,170,4,64,'#fff')})});
 if(t>tm)txt('MINIMUM ON ALL',700,960,44,INK);
 if(t>te){const k=pop(t,te);for(let i=0;i<5;i++)doodle(t,'coin',1500+Math.cos(t*2+i)*30,300+i*70,.9,te+i*.08);arrow(t,te+.3,1400,300,980,300,40,GRN,12);tlabelBox(t,th,1500,820,'HIGHEST RATE FIRST',58,GRN,'#fff')}};

SC.hours=(t,b)=>{bd();const tp=b.T('price'),t20=b.T('twenty'),t2=b.T('two'),t10=b.T('ten'),td=L(b,1).start;
 doodle(t,'sneaker',560,520,1.6,b.t0+.2);if(t>t2-.1)at(700,330,pop(t,t2-.1),.2,()=>{X.beginPath();X.moveTo(-90,-40);X.lineTo(60,-40);X.lineTo(100,0);X.lineTo(60,40);X.lineTo(-90,40);X.closePath();sh('#fff',6);txt('$200',-10,3,52,INK)});
 if(t>t20-.1)tlabelBox(t,t20-.1,560,820,'YOU EARN $20/HOUR',56,INK,'#fff');
 arrow(t,t10-.6,850,520,1150,520,-50);doodle(t,'clock',1450,500,1.4,t10-.3,0,(t-t10)*3);if(t>t10)tlabelBox(t,t10,1450,760,'10 HOURS OF WORK',62,RED,'#fff');
 inset(t,td-.05,null,1650,220,150,()=>{X.drawImage(OFFICE,0,0);const d=dave(t,[[b.t0,'idle'],[td,'flinch',.2]]);X.drawImage(DESK,0,0);d.arms()});
 if(t>td)bubble(t,td,null,1200,170,380,150,'FOR SHOES?!',290,40,52)};

SC.subs=(t,b)=>{bd();const tw=b.T('wait'),ts=b.T('subscriptions');
 if(t<Math.min(ts-.3,L(b,1).start)){doodle(t,'calendar',700,520,1.6,b.t0+.2);for(let i=0;i<20;i++){const s=tw+.1+i*.06;if(t<s)continue;const r=Math.floor(i/5),c=i%5;X.beginPath();X.moveTo(700+(-90+c*38)*1.6-4,520+(-40+r*36)*1.6);X.lineTo(700+(-90+c*38+26)*1.6,520+(-40+r*36+24)*1.6);sh(null,6,RED)}
  tlabelBox(t,tw,1300,420,'WAIT 30 DAYS',80,INK,'#fff');tlabelBox(t,b.T('remember'),1300,640,'STILL WANT IT?',64,GRN,'#fff')}
 else{tlabelBox(t,Math.min(ts-.2,L(b,1).start),960,150,'FORGOTTEN SUBSCRIPTIONS',66,INK,'#fff');
  const it=[['STREAMFLIX',15.99],['MUSICLY',10.99],['CLOUD+',9.99],['FITAPP (NEVER OPENED)',14.99],['NEWS PLUS',12.99]];let sum=0;
  it.forEach(([n,p],i)=>{const s=Math.min(ts,L(b,1).start+.5)+.2+i*.35,y=300+i*110;if(t<s)return;at(960,y,pop(t,s),0,()=>{rr(-430,-42,860,84,12);sh('#fff',6);txt(n,-400,3,44,INK,'Anton','left');txt('$'+p+'/mo',400,3,44,RED,'Anton','right')});
   const sc=b.T('forgot')+i*.25;strike(t,sc,560,y,1360);if(t>sc)sum+=p});
  if(sum>0){txt('SAVED: $'+Math.round(sum*12)+' / YEAR',960,900,70,GRN)}}};

SC.stairs=(t,b)=>{bd();const tr=b.T('raise'),tl=b.T('lifestyle'),tin=b.T('income'),tsp=b.T('spending'),tsn=b.lines.find(l=>l.who==='penny').start;
 for(let i=0;i<6;i++){const k=pop(t,b.t0+.1+i*.06);if(k<=0)continue;X.beginPath();X.rect(360+i*200,860-i*110,200,110*(i+1));sh('#fff',6)}
 const climb=cl((t-tin)/6);const step=Math.min(5,climb*6);const sx=460+step*200,sy=810-Math.floor(step)*110;
 const split=t>tsn;
 if(t>tin){at(sx-40,sy-60-(split?0:0),1,0,()=>{ell(0,0,46,46);sh(GRN,6);txt('$',0,3,50,'#fff');txt('INCOME',0,-80,34,INK)})}
 if(t>tsp){const lag=split?Math.max(0,step-1.5*cl((t-tsn)/.5)):step;const s2x=460+lag*200-110,s2y=810-Math.floor(lag)*110+(split?60*cl((t-tsn)/.5):0);at(s2x,s2y-60,1,0,()=>{ell(0,0,46,46);sh(RED,6);txt('$',0,3,50,'#fff');txt('SPENDING',0,-80,34,INK)});
  if(!split){X.beginPath();X.moveTo(s2x+40,s2y-60);X.lineTo(sx-80,sy-60);sh(null,6)}}
 if(t>tsn-.3&&t<tsn+1.5){const o=Math.abs(Math.sin((t-tsn)*12));doodle(t,'scissors',sx-120,sy-150,1,tsn-.3,.4,o)}
 tlabelBox(t,tl,520,160,'LIFESTYLE CREEP',72,RED,'#fff');penny(t,1700,1040,1.1,[[b.t0,'look'],[tsn,'smug',.2]])};

SC.stairs2=(t,b)=>{bd();const t3=b.T('three'),t1=b.T('one'),t2=b.T('one',1),th=b.T('half');
 tlabelBox(t,th-.2,960,150,'SAVE HALF OF EVERY RAISE',72,INK,'#fff');
 const k=pop(t,t3);if(k>0&&t<t1)at(960,540,k,0,()=>{ell(0,0,170,170);sh(YEL,8);txt('+$300',0,6,90,INK)});
 if(t>=t1){const e=eout((t-t1)/.5);at(960-300*e,540,1,0,()=>{ell(0,0,140,140);sh(YEL,8);txt('$150',0,6,76,INK)});txt('FOR YOU',960-300*e,720,52,INK);
  if(t>t2){at(960+300*e,540,1,0,()=>{ell(0,0,140,140);sh(GRN,8);txt('$150',0,6,76,'#fff')});txt('FOR YOUR FUTURE',960+300*e,720,52,GRN)}}};

SC.melt=(t,b)=>{bd();const t3=b.T('three'),t10=b.T('ten'),ty=b.T('years'),tp=L(b,1).start;
 const m=cl((t-t10)/5.5);const[bx,by]=boil(t);at(760+bx,520+by,pop(t,b.t0+.2)*2.0,0,()=>D.cone(m));
 if(t>t10-.2){const v=10000-2559*m;txt('$'+Math.round(v).toLocaleString('en-US'),760,170,110,m>.5?RED:INK);txt('YEAR '+Math.round(m*10),760,90,44,INK)}
 tlabelBox(t,t3,1420,330,'3% INFLATION',64,RED,'#fff');if(t>ty+.6)tlabelBox(t,ty+.6,1420,520,'-26% IN 10 YEARS',64,INK,'#fff');
 if(t>tp){penny(t,1450,950,1.2,[[tp,'smug']])}};

SC.snow=(t,b)=>{bd();const t2=b.T('two'),t30=b.T('thirty'),t72=b.T('seventy'),tc=b.T('compound'),tg=b.T('guaranteed');
 tlabelBox(t,b.t0+.2,620,150,'$200/MONTH · ~7%/YEAR',60,INK,'#fff');
 const items=[];for(let y=0;y<=30;y+=5){const c=200*12*y,fv=y?200*((Math.pow(1+.07/12,y*12)-1)/(.07/12)):0;items.push({parts:[[c,'#3d7fb0'],[Math.max(0,fv-c),YEL]],label:y+'Y',top:y===30?'$244K':''})}
 bars(t,Math.min(t2,b.t0+1.5),170,900,items,250000,600,120,55);
 if(t>t72-.1){tlabelBox(t,t72-.1,1610,420,'YOU PUT IN $72K',52,'#3d7fb0','#fff');tlabelBox(t,tc,1610,560,'GROWTH ~$172K',52,'#c08a00','#fff')}
 if(t>tg-.2)txt('ILLUSTRATION ONLY · NOT A GUARANTEE',1610,690,26,INK,'InterB')};

SC.check=(t,b)=>{bd();const rules=[['track','TRACK WHERE MONEY GOES'],['pay','PAY YOURSELF FIRST'],['build','BUILD AN EMERGENCY FUND'],['kill','KILL EXPENSIVE DEBT'],['convert','CONVERT PRICES INTO HOURS'],['save','SAVE HALF OF EVERY RAISE'],['let','LET YOUR MONEY GROW']];
 tlabelBox(t,b.t0+.15,960,110,'YOUR CHECKLIST',70,INK,YEL);
 rules.forEach(([k,s],i)=>{const t0=b.T(k);const y=230+i*112;if(t<Math.min(t0-.2,b.t0+.4+i*.15))return;at(560,y,pop(t,Math.min(t0-.2,b.t0+.4+i*.15)),0,()=>{rr(-20,-46,920,92,14);sh('#fff',6);txt((i+1)+'. '+s,20,4,48,INK,'Anton','left')});check(t,t0+.3,1580,y,1.1)})};

SC.check2=(t,b)=>{bd();const tp=b.T('pick'),tt=b.T('template'),tc=b.T('pinned');
 tlabelBox(t,b.t0+.2,960,200,'PICK ONE. DO IT TODAY.',90,RED,'#fff');doodle(t,'sheet',760,620,1.6,tt-.2);burst(t,tt,1260,520,150,GRN,'FREE','TEMPLATE',.1);
 if(t>tc){tlabelBox(t,tc,1260,820,'PINNED COMMENT ↓',64,INK,'#fff')}};

SC.end=(t,b)=>{X.drawImage(NAVYBG,0,0);const k=pop(t,b.t0+.2);
 at(960,250,k,-.02,()=>{txt('NEXT TIME',0,0,60,YEL)});tlabelBox(t,b.T('scammers')-.2,960,420,'HOW SCAMMERS ROB SMART PEOPLE',80,RED,'#fff');
 tlabelBox(t,b.T('question'),960,580,'+ THE ONE QUESTION THAT STOPS THEM',50,'#fff',INK);
 const k2=pop(t,b.end.start+b.end.dur-.6);if(k2>0)at(960,800,k2,0,()=>{rr(-230,-55,460,110,20);sh(RED,6);txt('SUBSCRIBE',0,4,64,'#fff')});
 txt('MONEY WITH PENNY',960,980,44,'#fff');penny(t,1620,900,1.0,[[b.t0,'happy']])};
