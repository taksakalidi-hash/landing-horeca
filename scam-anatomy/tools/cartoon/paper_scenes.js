// Scenes for the "paper" style (channel colors). Loaded after paper.html core.
// ---------- character presets ----------
const ROSE={hair:'bun',hairC:'#D5D9E0',glasses:1,body:'cardigan',col:K.coral,col2:'#fff'};
const JAKE={hair:'messy',hairC:'#6B4430',body:'hoodie',col:K.gold,col2:K.teal};
const MARK={hair:'neat',hairC:'#232323',body:'suit',col:K.suit,tie:K.coral,mouth:'smirk'};
const COURIER={hair:'cap',capC:K.teal,body:'hoodie',col:'#6C7385',col2:'#3a3f4c'};
const MOM={hair:'bob',hairC:'#8A5A3B',body:'dress',col:K.teal};
const DAD={hair:'neat',hairC:'#4a3626',body:'hoodie',col:K.mint,col2:K.teal};
const TELLER={hair:'bob',hairC:'#2f2f2f',body:'suit',col:K.teal,tie:K.gold};
const who=(base,o)=>guy(Object.assign({},base,o));
const EAR=[95,-520];               // hand position for phone at the ear (right hand)
const phoneMini=(c=K.ink)=>`<rect x="-22" y="-40" width="44" height="80" rx="9" fill="${c}" stroke="${K.ink}" stroke-width="4" transform="rotate(-15)"/><rect x="-15" y="-30" width="30" height="56" rx="4" fill="#9CC3FF" transform="rotate(-15)"/>`;

// ---------- generic props ----------
function phone(x,y,s,o={}){const t=o.t||0;const sh=o.ring?Math.sin(t*50)*3:0;
 let scr=o.screen||'';
 return G(`<rect x="-120" y="-230" width="240" height="460" rx="34" fill="${K.ink}" stroke="${K.ink}" stroke-width="6"/><rect x="-104" y="-206" width="208" height="404" rx="18" fill="${o.bg||'#EAF0FA'}"/><rect x="-36" y="-222" width="72" height="10" rx="5" fill="#333a48"/>${scr}`,`translate(${R(x+sh)},${R(y)}) rotate(${R((o.rot||0)+sh*.6)}) scale(${s})`,o.op??1)}
function ringFx(x,y,t,s=1){let o='';for(let i=0;i<3;i++){const u=((t*1.6)+i/3)%1;o+=`<path d="M${R(-60-u*90)},${R(-50-u*60)} Q${R(-90-u*120)},0 ${R(-60-u*90)},${R(50+u*60)} M${R(60+u*90)},${R(-50-u*60)} Q${R(90+u*120)},0 ${R(60+u*90)},${R(50+u*60)}" fill="none" stroke="${K.coral}" stroke-width="8" stroke-linecap="round" opacity="${R((1-u)*100)/100}"/>`}return G(o,`translate(${R(x)},${R(y)}) scale(${s})`)}
function bubble(x,y,w,lines,t,a,o={}){if(t<a)return'';const k=pop(t,a,.4);const lh=o.lh||58,fs=o.fs||42,h=lines.length*lh+50;w=Math.max(w,Math.max(...lines.map(l=>l.length))*fs*.53+70);
 const tail=o.tail||'bl';const tx=tail==='br'?w-80:tail==='bc'?w/2:70;
 const wob=o.wavy?Math.sin(t*9)*3:0;
 let txt='';lines.forEach((L,i)=>{const at=a+.25+i*(o.dl??.45);if(t<at)return;const n=Math.floor((t-at)*(o.cps||40));txt+=`<text x="34" y="${54+i*lh}" font-size="${fs}" fill="${o.tc||K.ink}">${L.slice(0,n).replace(/&/g,'&amp;')}</text>`});
 return G(`<path d="M18,0 H${w-18} Q${w},0 ${w},18 V${h-18} Q${w},${h} ${w-18},${h} H${tx+40} L${tx+(tail==='bl'?-30:tail==='br'?50:10)},${h+56} L${tx},${h} H18 Q0,${h} 0,${h-18} V18 Q0,0 18,0Z" fill="${o.fill||'#fff'}" stroke="${o.st||K.ink}" stroke-width="${o.sw||7}" stroke-linejoin="round" ${o.dash?'stroke-dasharray="18 10"':''}/>${txt}`,`translate(${R(x)},${R(y+wob)}) ${sc(tx,h+50,k)}`,o.op??1)}
function think(x,y,w,h,inner,t,a){if(t<a)return'';const k=pop(t,a,.5);let o='';
 const bumps=12;let d='';for(let i=0;i<bumps;i++){const a1=i/bumps*Math.PI*2;d+=`<circle cx="${R(w/2+Math.cos(a1)*w*.47)}" cy="${R(h/2+Math.sin(a1)*h*.45)}" r="${R(Math.min(w,h)*.17)}"/>`}
 o+=`<g fill="#fff" stroke="${K.ink}" stroke-width="7">${d}</g><ellipse cx="${w/2}" cy="${h/2}" rx="${w*.47}" ry="${h*.45}" fill="#fff"/><g fill="#fff">${d.replace(/r="(\d+(\.\d+)?)"/g,(m,r)=>`r="${R(r-6)}"`)}</g>`;
 o+=`<circle cx="${R(w*.12)}" cy="${R(h+30)}" r="22" fill="#fff" stroke="${K.ink}" stroke-width="6"/><circle cx="${R(w*.04)}" cy="${R(h+80)}" r="13" fill="#fff" stroke="${K.ink}" stroke-width="5"/>`;
 return G(o+`<g>${inner}</g>`,`translate(${R(x)},${R(y)}) ${sc(w*.1,h+60,k)}`)}
function card(x,y,w,h,inner,t,a,o={}){if(t<a)return'';const k=pop(t,a,.4);
 return G(`<rect x="6" y="10" width="${w}" height="${h}" rx="20" fill="${K.ink}" opacity=".18"/><rect width="${w}" height="${h}" rx="20" fill="${o.fill||'#fff'}" stroke="${K.ink}" stroke-width="7"/>${inner}`,`translate(${R(x)},${R(y)}) rotate(${R(o.rot||0)}) ${sc(w/2,h/2,k)}`,o.op??1)}
function stamp(x,y,txt,t,a,o={}){if(t<a)return'';const u=P(t,a,a+.25);const k=1+(1-E(u))*1.4;const c=o.c||K.coral;const fs=o.fs||64;const w=txt.length*fs*.5+60;
 return G(`<rect x="${-w/2}" y="${-fs*.85}" width="${w}" height="${fs*1.3}" rx="10" fill="none" stroke="${c}" stroke-width="9"/>${TX(0,fs*.28,txt,{fs,c,ls:3})}`,`translate(${R(x)},${R(y)}) rotate(${o.rot??-8}) scale(${R(k*100)/100})`,E(u)*.95)}
function check(x,y,s=1,ok=true){return G(ok?`<circle r="40" fill="${K.green}" stroke="${K.ink}" stroke-width="6"/><path d="M-18,0 L-4,15 L20,-14" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`:`<circle r="40" fill="${K.coral}" stroke="${K.ink}" stroke-width="6"/><path d="M-15,-15 L15,15 M15,-15 L-15,15" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`,`translate(${R(x)},${R(y)}) scale(${s})`)}
function heartIcon(x,y,s,c=K.coral){return G(`<path d="M0,-30 C-24,-80 -100,-64 -92,-8 C-84,42 -24,74 0,100 C24,74 84,42 92,-8 C100,-64 24,-80 0,-30Z" fill="${c}" stroke="${K.ink}" stroke-width="8"/><path d="M-52,-34 Q-62,-8 -44,8" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".6"/>`,`translate(${R(x)},${R(y)}) scale(${s})`)}
function envelope(x,y,s,rot=0){return G(`<rect x="-80" y="-50" width="160" height="100" rx="8" fill="#F5E6C4" stroke="${K.ink}" stroke-width="6"/><path d="M-80,-50 L0,14 L80,-50" fill="none" stroke="${K.ink}" stroke-width="5"/>${TX(0,40,'$',{fs:40,c:K.green})}`,`translate(${R(x)},${R(y)}) rotate(${rot}) scale(${s})`)}
function clockIcon(x,y,s,t,hh=9,mm=14,spin=0){const m=mm+spin*t*60;const h=hh+m/60;return G(`<circle r="80" fill="#fff" stroke="${K.ink}" stroke-width="9"/><g stroke="${K.ink}" stroke-width="6"><line y1="-66" y2="-54"/><line y1="66" y2="54"/><line x1="-66" x2="-54"/><line x1="66" x2="54"/></g><line y2="-38" stroke="${K.ink}" stroke-width="10" stroke-linecap="round" transform="rotate(${R((h%12)*30)})"/><line y2="-58" stroke="${K.coral}" stroke-width="6" stroke-linecap="round" transform="rotate(${R(m*6)})"/><circle r="8" fill="${K.ink}"/>`,`translate(${R(x)},${R(y)}) scale(${s})`)}
function wave(x,y,w,t,o={}){let d='';const n=o.n||36;for(let i=0;i<n;i++){const xx=i*w/n;const a=(o.amp||60)*Math.abs(Math.sin(i*1.7+t*(o.sp??6)))*(.35+.65*Math.abs(Math.sin(i*.37)));d+=`M${R(xx)},${R(-a)} V${R(a)} `}
 return `<path d="${d}" transform="translate(${R(x)},${R(y)})" stroke="${o.c||K.coral}" stroke-width="${o.sw||9}" stroke-linecap="round" opacity="${o.op??1}"/>`}
function desk(x,y,w,c=K.mint){return `<g transform="translate(${x},${y})"><rect x="${-w/2}" y="0" width="${w}" height="36" rx="8" fill="${c}" stroke="${K.ink}" stroke-width="7"/><rect x="${-w/2+30}" y="36" width="${w-60}" height="200" fill="${c}" stroke="${K.ink}" stroke-width="7"/><path d="M${-w/2+30},110 h${w-60}" stroke="${K.ink}" stroke-width="5" opacity=".5"/></g>`}
function windowFrame(x,y,w,h,day=true){return `<g transform="translate(${x},${y})"><rect width="${w}" height="${h}" rx="8" fill="${day?'#BFD6F5':'#22355C'}" stroke="${K.ink}" stroke-width="8"/><circle cx="${w*.72}" cy="${h*.3}" r="${w*.12}" fill="${day?'#FFE7A0':'#F4F1EA'}"/><path d="M0,${h*.75} Q${w*.3},${h*.55} ${w*.55},${h*.72} T${w},${h*.66} V${h} H0Z" fill="${day?'#9CC08A':'#16233F'}"/><path d="M${w/2},0 V${h} M0,${h/2} H${w}" stroke="${K.ink}" stroke-width="7"/><path d="M-30,-10 Q${w*.12},${h*.5} -10,${h+10} L-50,${h+10} L-50,-10Z M${w+30},-10 Q${w*.88},${h*.5} ${w+10},${h+10} L${w+50},${h+10} L${w+50},-10Z" fill="${K.coral}" stroke="${K.ink}" stroke-width="6"/></g>`}
function photoFrame(x,y,inner,rot=0){return G(`<rect x="-70" y="-85" width="140" height="170" rx="6" fill="${K.gold}" stroke="${K.ink}" stroke-width="6"/><rect x="-54" y="-69" width="108" height="138" fill="#D6E2F5" stroke="${K.ink}" stroke-width="4"/>${inner}`,`translate(${x},${y}) rotate(${rot})`)}
function floor(y=910,c='#C9D3E3'){return `<rect x="-200" y="${y}" width="2320" height="500" fill="${c}"/><path d="M-200,${y} H2120" stroke="${K.ink}" stroke-width="6"/>`}
function lampStand(x,y){return `<g transform="translate(${x},${y})"><path d="M0,0 V-330" stroke="${K.ink}" stroke-width="10"/><path d="M-70,-330 L70,-330 L44,-430 L-44,-430Z" fill="${K.gold}" stroke="${K.ink}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="0" cy="-200" rx="160" ry="220" fill="#FFE7A0" opacity=".2"/><ellipse cx="0" cy="0" rx="50" ry="12" fill="${K.ink}"/></g>`}
function table(x,y){return `<g transform="translate(${x},${y})"><rect x="-110" y="-200" width="220" height="26" rx="8" fill="${K.gold}" stroke="${K.ink}" stroke-width="7"/><path d="M-80,-174 L-90,0 M80,-174 L90,0" stroke="${K.ink}" stroke-width="10" stroke-linecap="round"/></g>`}
function livingRoom(t,o={}){return bg('cream')+floor(910,'#E3D9C6')+windowFrame(1250,170,360,330)+photoFrame(520,300,`<circle cx="0" cy="-10" r="28" fill="${K.face}" stroke="${K.ink}" stroke-width="4"/><path d="M-26,-30 Q0,-60 26,-30" fill="#6B4430"/><path d="M-40,60 Q0,10 40,60" fill="${K.gold}" stroke="${K.ink}" stroke-width="4"/>`,-3)+(o.clock!==false?clockIcon(860,230,.8,t,9,14):'')+lampStand(1760,910)}
function chalkboard(x,y,w,h,lines){return `<g transform="translate(${x},${y})"><rect width="${w}" height="${h}" rx="10" fill="#22355C" stroke="${K.ink}" stroke-width="9"/><rect x="-6" y="${h}" width="${w+12}" height="18" fill="${K.gold}" stroke="${K.ink}" stroke-width="6"/>${lines.map((l,i)=>`<text x="40" y="${70+i*64}" font-size="44" fill="#E8EEF8" opacity=".85">${l}</text>`).join('')}</g>`}
function markRoom(t){return bg('navy')+`<rect x="-200" y="860" width="2320" height="500" fill="#16233F"/><path d="M-200,860 H2120" stroke="#0B1320" stroke-width="6"/>`+
 `<g opacity=".35">${[0,1,2,3,4].map(i=>`<rect x="${120+i*360}" y="120" width="250" height="160" rx="10" fill="#2E4675" stroke="#0B1320" stroke-width="6"/>`).join('')}</g>`+
 `<ellipse cx="960" cy="700" rx="700" ry="420" fill="url(#lamp)"/>`}
function bankBg(){return bg('blue')+floor(910,'#B8C6DC')+`<rect x="560" y="120" width="800" height="110" rx="14" fill="${K.teal}" stroke="${K.ink}" stroke-width="8"/>${TX(960,205,'BANK',{fs:84,c:K.gold,ls:16})}`+[300,1620].map(x=>`<rect x="${x-40}" y="250" width="80" height="660" fill="#E8EEF8" stroke="${K.ink}" stroke-width="7"/>`).join('')}
function frontDoor(x,y,open=0,t=0){const w=300;return `<g transform="translate(${x},${y})"><rect x="-170" y="-610" width="340" height="610" fill="#E8EEF8" stroke="${K.ink}" stroke-width="8"/>
 <rect x="-150" y="-590" width="300" height="590" fill="#16233F"/>${G(`<rect x="0" y="-590" width="${w}" height="590" fill="${K.coral}" stroke="${K.ink}" stroke-width="7"/><rect x="40" y="-540" width="220" height="200" rx="8" fill="none" stroke="${K.ink}" stroke-width="6" opacity=".6"/><rect x="40" y="-300" width="220" height="250" rx="8" fill="none" stroke="${K.ink}" stroke-width="6" opacity=".6"/><circle cx="250" cy="-290" r="17" fill="${K.gold}" stroke="${K.ink}" stroke-width="5"/>`,`translate(-150,0) scale(${R((1-open*.82)*1000)/1000},1)`)}
 <rect x="-190" y="0" width="380" height="24" rx="6" fill="${K.gold}" stroke="${K.ink}" stroke-width="5"/></g>`}

// ---------- scenes ----------
// p00a: 9:14, phone rings, Rose answers
S.ring=(t,d,p,ev)=>{let o=livingRoom(t,{clock:false});
 const tPick=AT(ev,'pick',2.2),tCry=AT(ev,'cry');
 o+=table(1430,910);
 const picked=t>tPick;
 if(!picked){o+=G(phoneMini(K.coral),`translate(1430,690) scale(1.4)`)+ringFx(1430,690,t,.9)}
 o+=label(820,250,'9:14 AM',t,AT(ev,'clock',.3),{fs:130,c:K.teal})+label(820,340,'TUESDAY',t,AT(ev,'clock',.3)+.2,{fs:56});
 const walk=!picked&&t>tPick-1.2;
 const rx=picked?1180:900+E(P(t,tPick-1.2,tPick))*280;
 o+=who(ROSE,{x:rx,y:910,t,walk:walk?t*8:null,armR:picked?EAR:(t>tPick-.3?[200,-300]:null),holdR:picked?phoneMini(K.coral):'',mouth:picked?(t>tCry?'o':'smile'):'flat',brow:t>tCry?1:0,look:picked?0:1,wide:t>tCry});
 if(picked)o+=bubble(1300,330,420,['Grandma? It\'s me…'],t,tPick+.3,{wavy:1,fs:44});
 if(t>tCry)o+=G(`<path d="M0,0 q-12,22 0,30 q12,-8 0,-30Z" fill="#8fd0ef" stroke="${K.ink}" stroke-width="3"/>`,`translate(1690,${R(470+((t*1.3)%1)*40)}) scale(1.6)`);
 return o};
// p00b: twenty minutes later — envelope handoff at the door
S.handoff=(t,d,p,ev)=>{let o=bg('yellow')+floor(910,'#D9C79B');
 const tG=AT(ev,'give',1.2),tGone=AT(ev,'gone');
 o+=frontDoor(1180,910,E(P(t,0,.6)));
 if(p.later)o+=label(500,190,p.later,t,.2,{fs:90,c:K.teal,rot:-3});
 const ex=1220,cx=t<tGone?1400:1400+E(P(t,tGone,tGone+1.2))*800;
 const given=t>tG+.4;
 o+=who(ROSE,{x:900,y:910,t,armR:t>tG-.4&&!given?[190+E(P(t,tG-.4,tG))*60,-330]:[112,-205],holdR:(t>tG-.4&&!given)?envelope(0,0,.9):'',mouth:'flat',brow:.4});
 o+=who(COURIER,{x:cx,y:910,t,flip:true,walk:t>tGone?t*10:null,armR:t>tG&&t<tGone?[190,-330]:null,holdR:given&&t<tGone+.6?envelope(0,0,.9,10):'',mouth:'smirk'});
 if(t>tGone)o+=smoke(1450,820,t,tGone+.3,1.1);
 o+=label(560,420,p.amount||'$9,000',t,AT(ev,'amt',tG),{fs:170,c:K.coral,rot:-4});
 if(p.cash)o+=label(560,520,'IN CASH',t,AT(ev,'amt',tG)+.25,{fs:64});
 if(p.secs)o+=label(560,520,p.secs,t,AT(ev,'secs',1e9),{fs:72,c:K.teal});
 return o};
// p01: Jake in class, phone on silent
S.classroom=(t,d,p,ev)=>{let o=bg('yellow')+floor(910,'#D9C79B')+chalkboard(160,120,780,400,['Econ 101','supply → demand','midterm: Fri']);
 o+=windowFrame(1500,160,300,280);
 o+=who(JAKE,{x:1050,y:1000,t,mouth:'flat',look:-1,armL:[-120,-250],armR:[120,-250]});
 o+=desk(1050,760,520,'#E3C98F');
 const tM=AT(ev,'mute',.6);
 o+=G(`<rect x="-36" y="-14" width="72" height="28" rx="6" fill="${K.ink}"/><rect x="-28" y="-9" width="56" height="18" rx="3" fill="#2E4675"/>`,`translate(1200,748)`);
 if(t>tM)o+=G(`<circle r="54" fill="#fff" stroke="${K.ink}" stroke-width="6"/><path d="M-22,14 h44 l-8,-10 v-14 q0,-22 -14,-26 v-6 h-0 q-14,4 -14,26 v14Z" fill="${K.ink}"/><path d="M-30,-30 L30,30" stroke="${K.coral}" stroke-width="9" stroke-linecap="round"/>`,`translate(1210,640) scale(${R(pop(t,tM)*100)/100})`);
 o+=label(520,660,p.l1||'JAKE NEVER CALLED',t,AT(ev,'never',.3),{fs:84,c:K.coral,rot:-3});
 if(t>AT(ev,'miles'))o+=label(520,780,'200 MILES AWAY',t,ev.miles,{fs:72,c:K.teal,rot:-2});
 return o};
// p02 / p24: voice clone machine
S.clone=(t,d,p,ev)=>{let o=bg('blue');
 const tW=AT(ev,'wave',1.2),tC=AT(ev,'copy',3),tS=AT(ev,'sec');
 // phone with Jake's toast video
 const jake=who(JAKE,{x:0,y:250,s:.42,t,mouth:'grin',armR:[150,-560+Math.sin(t*4)*10],holdR:`<path d="M-14,-40 L14,-40 L8,0 L-8,0Z" fill="#FFE7A0" stroke="${K.ink}" stroke-width="4"/><path d="M0,0 V20 M-12,22 H12" stroke="${K.ink}" stroke-width="4"/>`});
 o+=phone(360,520,1,{screen:`<g clip-path="url(#scr1)">${jake}</g><clipPath id="scr1"><rect x="-104" y="-206" width="208" height="404" rx="18"/></clipPath><rect x="-90" y="170" width="180" height="8" rx="4" fill="#fff"/><rect x="-90" y="170" width="${R(180*((t*.15)%1))}" height="8" rx="4" fill="${K.coral}"/>`});
 if(p.pub)o+=label(360,190,p.pub,t,AT(ev,'pub',.4),{fs:60,c:K.teal});
 // machine
 const gear=(x,y,r,sp)=>`<g transform="translate(${x},${y}) rotate(${R(t*sp)})"><circle r="${r}" fill="${K.gold}" stroke="${K.ink}" stroke-width="6"/>${[0,1,2,3,4,5].map(i=>`<rect x="-10" y="${-r-16}" width="20" height="22" fill="${K.gold}" stroke="${K.ink}" stroke-width="5" transform="rotate(${i*60})"/>`).join('')}<circle r="${r*.35}" fill="${K.ink}"/></g>`;
 o+=`<g transform="translate(960,560)"><rect x="-210" y="-200" width="420" height="380" rx="30" fill="${K.teal}" stroke="${K.ink}" stroke-width="9"/>${gear(-80,-60,56,t>tW?120:20)}${gear(70,30,44,t>tW?-150:-25)}<rect x="-160" y="110" width="320" height="44" rx="10" fill="#0B1320"/>${[0,1,2,3,4].map(i=>`<circle cx="${-120+i*60}" cy="132" r="11" fill="${(Math.floor(t*6)+i)%3===0&&t>tW?K.coral:'#334'}"/>`).join('')}</g>`;
 o+=TX(960,320,'AI',{fs:110,c:K.ink,st:K.cream,sw:12});
 // wave travels phone -> machine
 if(t>tW){const u=E(P(t,tW,tW+1));o+=wave(470+u*200,560,180*(1-u*.4),t,{amp:40,c:K.coral,op:1-P(t,tW+1,tW+1.3)})}
 if(t>tC){const u=E(P(t,tC,tC+1));o+=wave(1180,560,260*u,t,{amp:46,c:K.coral});
  o+=G(`<path d="M-60,-40 h40 l50,-40 v160 l-50,-40 h-40Z" fill="${K.ink}"/><path d="M60,-30 Q90,0 60,30 M80,-60 Q130,0 80,60" fill="none" stroke="${K.ink}" stroke-width="9" stroke-linecap="round"/>`,`translate(1620,560) scale(${R(pop(t,tC+.6)*100)/100})`);
  o+=bubble(1300,250,470,[p.says||'Grandma, it\'s me.'],t,tC+.9,{fs:46,tail:'br'});
  o+=label(1480,860,'COPY',t,tC+.5,{fs:80,c:K.coral,rot:-4});}
 if(t>tS)o+=label(960,900,p.sec||'3 SECONDS',t,tS,{fs:120,c:K.coral,rot:-3});
 return o};
// p03: anatomy split (reworked proto) — params: parts, title
S.anat=(t,d,p,ev)=>{let o=bg('red');
 const parts=p.parts||['THE CALL','THE LAWYER','THE COURIER','THE CLONE'];const n=parts.length;const W=300,gap=60;
 const tS=AT(ev,'split',.5);const sp=EIO(P(t,tS,tS+1));
 o+=label(960,170,p.title||'ANATOMY OF A SCAM',t,.15,{fs:96,c:K.teal});
 parts.forEach((lb,i)=>{const cx=960+(i-(n-1)/2)*(W+sp*gap);const lift=Math.sin(t*2+i)*6*sp;
  o+=G(`<rect x="${-W/2}" y="-120" width="${W}" height="240" fill="#fff" stroke="${K.ink}" stroke-width="7"/>${TX(0,24,String(i+1),{fs:110,c:i===n-1?K.coral:K.teal})}`,`translate(${R(cx)},${R(470+lift)}) rotate(${R((i-(n-1)/2)*sp*3)})`);
  if(sp>.3)o+=label(cx,660,lb,t,tS+.7+i*.3,{fs:54,c:i===n-1?K.coral:K.ink});});
 if(t>AT(ev,'q'))o+=card(560,740,360,230,TX(180,175,'?',{fs:190,c:K.coral})+TX(180,215,'ONE QUESTION',{fs:34}),t,ev.q,{rot:-4});
 if(t>AT(ev,'w'))o+=card(1000,740,360,230,`<g transform="translate(180,95)"><rect x="-50" y="-20" width="100" height="80" rx="12" fill="${K.gold}" stroke="${K.ink}" stroke-width="7"/><path d="M-32,-20 V-46 Q-32,-80 0,-80 Q32,-80 32,-46 V-20" fill="none" stroke="${K.ink}" stroke-width="9"/></g>`+TX(180,215,'ONE WORD',{fs:34}),t,ev.w,{rot:4});
 return o};
// p04: case file
S.casefile=(t,d,p,ev)=>{let o=bg('cream')+desk(960,760,1300,'#E3C98F');
 const k=pop(t,.2,.5);
 o+=G(`<path d="M-420,-260 h300 l40,50 h500 v520 h-840Z" fill="${K.gold}" stroke="${K.ink}" stroke-width="9" stroke-linejoin="round"/><rect x="-380" y="-170" width="760" height="440" fill="#fff" stroke="${K.ink}" stroke-width="6"/>${[0,1,2,3,4].map(i=>`<rect x="-330" y="${-110+i*60}" width="${R(560-i*70)}" height="18" rx="9" fill="#C9D3E3"/>`).join('')}${TX(-280,-200,'CASE FILE',{fs:46,a:'start'})}`,`translate(960,470) scale(${R(k*100)/100})`);
 o+=stamp(820,560,'FBI',t,AT(ev,'fbi',1),{c:K.teal,rot:-10,fs:70});
 o+=stamp(1110,520,'FTC',t,AT(ev,'ftc',1.4),{c:K.teal,rot:8,fs:70});
 o+=stamp(960,690,'NAMES CHANGED',t,AT(ev,'names',2.5),{fs:62});
 o+=stamp(960,330,'REAL PLAYBOOK',t,AT(ev,'real',3.5),{fs:58,rot:4});
 return o};
// p05: Rose in the garden
S.garden=(t,d,p,ev)=>{let o=bg('blue')+`<rect x="-200" y="860" width="2320" height="500" fill="#9CC08A"/><path d="M-200,860 H2120" stroke="${K.ink}" stroke-width="6"/>`;
 o+=`<g transform="translate(1500,860)"><rect x="-260" y="-420" width="520" height="420" fill="#fff" stroke="${K.ink}" stroke-width="8"/><path d="M-300,-410 L0,-640 L300,-410Z" fill="${K.coral}" stroke="${K.ink}" stroke-width="8" stroke-linejoin="round"/><rect x="-60" y="-220" width="120" height="220" fill="${K.teal}" stroke="${K.ink}" stroke-width="7"/><rect x="-220" y="-330" width="120" height="100" fill="#BFD6F5" stroke="${K.ink}" stroke-width="7"/><rect x="100" y="-330" width="120" height="100" fill="#BFD6F5" stroke="${K.ink}" stroke-width="7"/></g>`;
 for(let i=0;i<6;i++){const x=260+i*110,h=60+(i%3)*30,sw=Math.sin(t*2+i)*4;o+=G(`<path d="M0,0 V${-h}" stroke="#3E7C59" stroke-width="8"/><circle cx="0" cy="${-h}" r="26" fill="${i%2?K.coral:K.gold}" stroke="${K.ink}" stroke-width="6"/><circle cx="0" cy="${-h}" r="9" fill="${K.ink}"/>`,`translate(${x},880) rotate(${R(sw)})`)}
 const pour=t>.6&&t<AT(ev,'sunday',99);
 const can=`<g transform="rotate(${pour?-30:0})"><rect x="-50" y="-34" width="100" height="70" rx="12" fill="${K.mint}" stroke="${K.ink}" stroke-width="6"/><path d="M50,-20 L110,-50" stroke="${K.ink}" stroke-width="12" stroke-linecap="round"/></g>`;
 o+=who(ROSE,{x:900,y:900,t,flip:true,armR:[170,-300],holdR:can,mouth:'smile',happy:1});
 if(pour)for(let i=0;i<6;i++){const u=((t*2)+i/6)%1;o+=`<circle cx="${R(650-u*30-i*6)}" cy="${R(530+u*240)}" r="7" fill="#8fd0ef" opacity="${R((1-u)*100)/100}"/>`}
 o+=label(900,190,'ROSE',t,AT(ev,'name',.4),{fs:120,c:K.teal,rot:-4})+label(1150,300,'76',t,AT(ev,'age',1),{fs:170,c:K.coral});
 if(t>AT(ev,'sunday'))o+=card(1160,330,420,250,`${TX(210,70,'EVERY SUNDAY',{fs:44,c:K.teal})}<g transform="translate(120,160)">${phoneMini(K.coral)}</g>${heartIcon(300,150,.6)}`,t,ev.sunday,{rot:3});
 if(t>AT(ev,'voice'))o+=label(1370,680,'KNOWS HIS VOICE',t,ev.voice,{fs:60,c:K.ink,rot:-2});
 return o};
// p06/08/09/26/34: Rose on the phone, big voice bubble
S.call=(t,d,p,ev)=>{let o=p.bgk?bg(p.bgk):livingRoom(t,{clock:false});
 const mood=p.mood||'worried';
 o+=who(ROSE,{x:560,y:1180,s:1.3,t,armR:EAR,holdR:phoneMini(K.coral),mouth:p.mouth||(mood==='ok'?'smile':'o'),brow:mood==='ok'?0:1,wide:mood!=='ok',tears:p.tears&&t>AT(ev,'tears',0)});
 (p.lines||[]).forEach((L,i)=>{o+=bubble(L.x??880,L.y??(140+i*0),L.w??900,L.txt,t,AT(ev,'b'+i,.4+i*2),{wavy:L.wavy??1,fs:L.fs||48,fill:L.fill,tc:L.tc,dash:L.dash,tail:'bl',op:L.until&&t>AT(ev,L.until)?1-P(t,ev[L.until],ev[L.until]+.3):1})});
 if(p.heart&&t>AT(ev,'heart')){const b=1+.15*Math.max(0,Math.sin(t*9));o+=G(heartIcon(0,0,.55),`translate(640,700) scale(${R(b*pop(t,ev.heart)*100)/100})`)}
 if(p.match&&t>AT(ev,'m0')){o+=card(900,560,860,300,TX(30,60,'JAKE (REAL)',{fs:34,a:'start'})+wave(320,62,480,t,{amp:22,c:K.teal,sw:7})+TX(30,190,'THE CALL',{fs:34,a:'start'})+(t>AT(ev,'m1')?wave(320,192,480,t,{amp:22,c:K.coral,sw:7}):''),t,ev.m0);
  if(t>AT(ev,'m2'))o+=stamp(1330,880,'SAME VOICE',t,ev.m2,{c:K.coral,fs:60,rot:-6});}
 if(p.promise&&t>AT(ev,'promise'))o+=label(1330,880,'"I PROMISE."',t,ev.promise,{fs:96,c:K.coral,rot:-3});
 if(p.glitch&&t>AT(ev,'glitch')){const g=Math.floor(t*14)%2;o+=G(`<rect x="0" y="0" width="900" height="200" fill="#fff" stroke="${K.coral}" stroke-width="8" rx="18"/>`+TX(450,120,g?'uh… turkey? kzzt—':'uh… t-t-turkey?',{fs:58,c:K.coral,A:false}),`translate(${880+(g?6:-6)},420)`);
  o+=stamp(1330,760,'CLONE CAN\'T ANSWER',t,AT(ev,'fail',ev.glitch+1),{fs:56})}
 return o};
// p07: what Rose imagines
S.imagine=(t,d,p,ev)=>{let o=livingRoom(t,{clock:false});
 o+=who(ROSE,{x:420,y:1180,s:1.3,t,armR:EAR,holdR:phoneMini(K.coral),mouth:'o',brow:1,wide:1,sweat:1});
 const tC=AT(ev,'crash',.6),tA=AT(ev,'arrest',3);
 let inner='';
 // crash scene in cloud coordinates (w=1000,h=640)
 if(t<tA+.3){const u=E(P(t,tC,tC+.5));const car=(x,c,f)=>`<g transform="translate(${x},400) scale(${f},1)"><path d="M-130,0 Q-130,-50 -90,-56 L-50,-110 L60,-110 L100,-56 Q140,-50 140,0Z" fill="${c}" stroke="${K.ink}" stroke-width="7" stroke-linejoin="round"/><rect x="-40" y="-100" width="44" height="40" fill="#BFD6F5" stroke="${K.ink}" stroke-width="5"/><rect x="14" y="-100" width="40" height="40" fill="#BFD6F5" stroke="${K.ink}" stroke-width="5"/><circle cx="-70" cy="4" r="30" fill="${K.ink}"/><circle cx="80" cy="4" r="30" fill="${K.ink}"/></g>`;
  inner+=car(160+u*200,K.gold,1)+car(840-u*200,K.mint,-1);
  if(t>tC+.45){const k=pop(t,tC+.45,.3);inner+=G(`<path d="M0,-90 L22,-30 L84,-40 L40,6 L76,60 L14,36 L0,96 L-14,36 L-76,60 L-40,6 L-84,-40 L-22,-30Z" fill="${K.gold}" stroke="${K.coral}" stroke-width="8" stroke-linejoin="round"/>${TX(0,18,'CRASH',{fs:34,c:K.coral})}`,`translate(500,320) scale(${R(k*100)/100})`)}}
 else{const fl=Math.floor(t*4)%2;inner+=`<rect x="320" y="150" width="360" height="400" fill="#E8EEF8" stroke="${K.ink}" stroke-width="7"/>`+who(JAKE,{x:500,y:560,s:.55,t,mouth:'frown',brow:1,tears:1})+[0,1,2,3,4,5].map(i=>`<rect x="${340+i*64}" y="150" width="14" height="400" fill="#6C7385" stroke="${K.ink}" stroke-width="4"/>`).join('')
   +`<g transform="translate(500,110)"><rect x="-70" y="-24" width="140" height="44" rx="12" fill="${K.ink}"/><circle cx="-36" cy="-2" r="20" fill="${fl?K.coral:'#5a1c22'}"/><circle cx="36" cy="-2" r="20" fill="${fl?'#3a5bd9':'#1b2a5a'}"/></g>`}
 o+=think(720,90,1000,640,inner,t,AT(ev,'cloud',.2));
 if(t>tA)o+=label(1220,880,'ARRESTED?!',t,tA+.2,{fs:90,c:K.coral,rot:-3});
 return o};
// p10: the promise builds a wall
S.wall=(t,d,p,ev)=>{let o=bg('cream')+floor(910,'#E3D9C6');
 const tW=AT(ev,'wall',.8),tC=AT(ev,'cut');
 o+=who(ROSE,{x:420,y:910,t,mouth:'flat',brow:.6,armR:EAR,holdR:phoneMini(K.coral)});
 o+=who(MOM,{x:1450,y:910,t,flip:true,mouth:'smile',bo:1}),o+=who(DAD,{x:1700,y:910,s:1.05,t,flip:true,mouth:'smile',bo:2});
 for(let r=0;r<6;r++)for(let c=0;c<2;c++){const i=r*2+c;const a=tW+i*.12;if(t<a)continue;const k=E(P(t,a,a+.25));const yy=910-(r+1)*90+(1-k)*-300;o+=`<rect x="${(r%2?760:800)+c*120}" y="${R(yy)}" width="120" height="90" fill="${K.coral}" stroke="${K.ink}" stroke-width="6" opacity="${R(k*100)/100}"/>`}
 if(t>tC)o+=label(960,180,'NO SECOND OPINION',t,tC,{fs:100,c:K.coral,rot:-2});
 else if(t>tW)o+=label(960,180,'"DON\'T TELL MOM AND DAD"',t,tW,{fs:74,c:K.teal,rot:-2});
 return o};
// Mark's office — props by params
S.mark=(t,d,p,ev)=>{let o=markRoom(t);
 o+=who(MARK,{x:p.x??960,y:1060,s:1.15,t,headset:1,talk:p.talk!==false,mouth:p.mouth||'smirk',look:p.look||0,armL:[-150,-240],armR:p.armR||[150,-240]});
 o+=desk(p.x??960,820,900,'#2E4675');
 o+=G(`<rect x="-120" y="-150" width="240" height="150" rx="10" fill="#0B1320" stroke="#000" stroke-width="5"/><rect x="-108" y="-138" width="216" height="126" rx="6" fill="#9CC3FF" opacity=".85"/><rect x="-140" y="0" width="280" height="16" rx="6" fill="#0B1320"/>`,`translate(${(p.x??960)+300},820)`);
 if(p.name&&t>AT(ev,'name',.3))o+=card(1200,170,600,170,TX(300,80,p.name,{fs:52})+TX(300,135,p.role||'',{fs:36,c:K.teal}),t,ev.name??.3,{rot:3});
 if(p.fake)o+=stamp(1690,370,'FAKE',t,AT(ev,'fake'),{fs:70});
 if(p.doc){o+=card(140,160,560,(p.doc.length)*86+120,TX(280,80,p.docTitle||'',{fs:50,c:K.coral}),t,AT(ev,'doc',.3),{rot:-3});
  p.doc.forEach((L,i)=>{if(t>AT(ev,'d'+i))o+=G(TX(0,0,L,{fs:46,a:'start'}),`translate(190,${R(320+i*86)}) rotate(-3) ${sc(0,0,pop(t,ev['d'+i]))}`)})}
 if(p.big&&t>AT(ev,'big'))o+=label(p.bigX??1450,p.bigY??470,p.big,t,ev.big,{fs:p.bigFs||150,c:K.gold,st:K.ink,sw:14,rot:-4});
 if(p.big2&&t>AT(ev,'big2'))o+=label(p.bigX??1450,(p.bigY??470)+130,p.big2,t,ev.big2,{fs:80,c:'#fff',st:K.ink,sw:12,rot:-4});
 return o};
// p13: Mark's costumes
S.costumes=(t,d,p,ev)=>{let o=bg('navy');
 o+=who(MARK,{x:960,y:1150,s:.9,t,mouth:'smirk',talk:0,armL:[-150,-260],armR:[150,-260]});
 const roles=[['EPISODE 1','"YOUR BANK"',{headset:1}],['EPISODE 2','"SARAH FROM HR"',{hair:'bob',hairC:'#C9733B'}],['TODAY','"YOUR LAWYER"',{}]];
 roles.forEach(([ep,nm,ex],i)=>{const a=AT(ev,'r'+i,.4+i*.8);if(t<a)return;const k=BK(P(t,a,a+.5));const x=[340,960,1580][i],y=i===1?220:300;
  const mini=who(Object.assign({},MARK,ex),{x:0,y:240,s:.42,t,mouth:'smirk'});
  o+=G(polaroid(0,0,mini,(i-1)*6,1,ep),`translate(${x},${R(y-(1-k)*500)})`)+(t>a+.4?label(x,y+250,nm,t,a+.4,{fs:46,c:K.gold,st:K.ink,sw:10}):'')});
 if(t>AT(ev,'same'))o+=label(960,960,'SAME MAN. SAME PLAYBOOK.',t,ev.same,{fs:84,c:K.coral,st:'#fff',sw:12});
 return o};
// p15: speed timeline
S.speed=(t,d,p,ev)=>{let o=bg('yellow');
 const icons=['CRASH','ARREST','LAWYER','BAIL','CASH','SECRET'];
 o+=`<path d="M160,560 H1760" stroke="${K.ink}" stroke-width="10" stroke-linecap="round"/>`;
 icons.forEach((lb,i)=>{const a=AT(ev,'i'+i,.4+i*.5);if(t<a)return;const x=230+i*290;o+=`<circle cx="${x}" cy="560" r="16" fill="${K.coral}" stroke="${K.ink}" stroke-width="5"/>`+card(x-120,360,240,140,TX(120,90,lb,{fs:46,c:i===5?K.coral:K.ink}),t,a,{rot:(i%2?3:-3)})});
 if(t>AT(ev,'fast')){const k=pop(t,ev.fast);o+=G(clockIcon(0,0,1.1,t,0,0,6),`translate(960,800) scale(${R(k*100)/100})`)+label(960,250,'UNDER 10 MINUTES',t,ev.fast,{fs:100,c:K.teal})}
 if(t>AT(ev,'act'))o+=stamp(1460,820,'ACT, DON\'T THINK',t,ev.act,{fs:56});
 return o};
// generic cards list: p.title, p.items [{txt, ok?:bool|null, icon?}] , ev c0..cN
S.cards=(t,d,p,ev)=>{let o=bg(p.bgk||'cream');
 o+=label(960,170,p.title||'',t,AT(ev,'title',.2),{fs:p.tfs||92,c:p.tc||K.teal});
 const n=p.items.length;const cols=p.cols||1;const w=cols===1?1200:760,h=p.h||118;
 p.items.forEach((it,i)=>{const a=AT(ev,'c'+i,.6+i*.6);const col=i%cols,row=Math.floor(i/cols);const x=cols===1?360:(160+col*840),y=(p.y0||280)+row*(h+34);
  o+=card(x,y,w,h,(it.ok!=null?check(70,h/2,.9,it.ok):'')+TX(it.ok!=null?130:40,h/2+17,it.txt,{fs:it.fs||48,a:'start',A:false,c:it.c||K.ink}),t,a,{rot:(i%2?.8:-.8)})});
 if(p.foot&&t>AT(ev,'foot'))o+=label(960,p.footY||880,p.foot,t,ev.foot,{fs:60,c:K.coral});
 return o};
// p17: at the bank
S.bank=(t,d,p,ev)=>{let o=bankBg();
 o+=who(TELLER,{x:1260,y:960,t,flip:true,mouth:'flat',talk:t>AT(ev,'ask')&&t<AT(ev,'ask')+1.6});
 o+=`<rect x="980" y="640" width="620" height="300" fill="${K.teal}" stroke="${K.ink}" stroke-width="8"/><rect x="960" y="620" width="660" height="30" rx="8" fill="${K.gold}" stroke="${K.ink}" stroke-width="6"/>`;
 o+=who(ROSE,{x:740,y:910,t,mouth:t>AT(ev,'lie')?'smile':'flat',look:1,brow:.3,armR:[190,-310],holdR:envelope(0,0,.7)});
 o+=bubble(1250,150,520,['Why so much cash?'],t,AT(ev,'ask',.6),{fs:46,tail:'bl'});
 if(t>AT(ev,'lie'))o+=bubble(300,190,500,['It\'s for a new roof.'],t,ev.lie,{fs:46,tail:'br'})+G(`<path d="M-110,0 L0,-80 L110,0Z" fill="${K.coral}" stroke="${K.ink}" stroke-width="7" stroke-linejoin="round"/><rect x="-80" y="0" width="160" height="80" fill="#fff" stroke="${K.ink}" stroke-width="7"/>`,`translate(560,520) scale(${R(pop(t,ev.lie+.5)*.8*100)/100})`);
 if(t>AT(ev,'coach'))o+=stamp(560,640,'COACHED LIE',t,ev.coach,{fs:58});
 return o};
// p21: the second hook
S.hook=(t,d,p,ev)=>{let o=livingRoom(t,{clock:false});
 const tH=AT(ev,'hook',.4),tC=AT(ev,'call');
 o+=who(ROSE,{x:700,y:910,t,mouth:t>tC?'flat':'o',brow:1,armR:t>tC?[150,-400]:EAR,holdR:phoneMini(K.coral),look:t>tC?.5:0,wide:t<tC});
 const yy=-200+E(P(t,tH,tH+1.2))*560+Math.sin(t*2.5)*14;
 o+=`<path d="M1300,-20 V${R(yy-70)}" stroke="${K.ink}" stroke-width="5"/>`+G(`<path d="M0,-70 V20 Q0,70 -40,70 Q-80,70 -80,30" fill="none" stroke="#6C7385" stroke-width="12" stroke-linecap="round"/><path d="M-80,30 l-14,24" stroke="#6C7385" stroke-width="12" stroke-linecap="round"/>`+bill(-40,110,1.3,{face:0,rot:8}),`translate(1300,${R(yy)})`);
 if(t>tH+1)o+=label(1300,140,'+$12,000',t,tH+1,{fs:120,c:K.coral,rot:-3});
 if(t>tC){o+=label(1300,860,'CALL THE REAL NUMBER',t,tC+.4,{fs:66,c:K.teal,rot:-2})}
 return o};
// p22: split call — Rose and real Jake
S.split=(t,d,p,ev)=>{let o=`<rect x="-100" y="-100" width="1060" height="1300" fill="${K.cream}"/><rect x="960" y="-100" width="1100" height="1300" fill="#FCEAB4"/><rect x="-200" y="-200" width="2320" height="1480" fill="url(#vig)"/>`;
 o+=chalkboard(1480,40,400,180,['Econ 101']);
 o+=who(ROSE,{x:470,y:1150,s:1.25,t,armR:EAR,holdR:phoneMini(K.coral),mouth:t>AT(ev,'relief')?'relief':'o',brow:t>AT(ev,'relief')?0:1});
 o+=who(JAKE,{x:1450,y:1150,s:1.25,t,flip:true,armR:EAR,holdR:phoneMini(K.ink),mouth:'o',talk:1,brow:.5});
 o+=`<path d="M960,-20 V1100" stroke="${K.ink}" stroke-width="10"/>`;
 o+=draw('M640,420 Q960,250 1280,420',P(t,.2,.9),{c:K.green,w:9})+(t>.9?check(960,330,1):'');
 o+=bubble(1000,110,560,['Grandma? I\'m in class.','What\'s going on?'],t,AT(ev,'b0',.5),{fs:44,tail:'br'});
 return o};
// p23/p25: the puzzle — how they built the family tree
S.puzzle=(t,d,p,ev)=>{let o=bg('blue');
 const pieces=[['JAKE M.','name'],['COLLEGE','school'],['ROSE ☎','number'],['DATA LEAK','leak']];
 if(p.q){o+=who(JAKE,{x:960,y:960,t,mouth:'flat',look:0});const k=pop(t,AT(ev,'q',.3));o+=G(TX(0,0,'?',{fs:300,c:K.coral,st:'#fff',sw:16}),`translate(1340,520) rotate(12) scale(${R(k*100)/100})`)+G(TX(0,0,'?',{fs:200,c:K.teal,st:'#fff',sw:14}),`translate(600,480) rotate(-14) scale(${R(pop(t,AT(ev,'q',.3)+.25)*100)/100})`);
  o+=label(960,170,p.title||'HOW DID THEY GET HIS VOICE?',t,.3,{fs:80,c:K.teal});return o}
 const tT=AT(ev,'tree');const W=330,H=230;
 pieces.forEach(([lb],i)=>{const a=AT(ev,'p'+i,.4+i*.6);if(t<a)return;const u=E(P(t,a,a+.6));const tx=960+(i%2?1:-1)*W/2-(i%2?0:0),ty=430+(i<2?-H/2:H/2);
  const sx=[-200,2100,-200,2100][i],sy=[-200,-200,1300,1300][i];const x=sx+(tx-sx)*u,y=sy+(ty-sy)*u;
  const sel=t>tT?1-P(t,tT,tT+.6)*.3:1;
  o+=G(`<path d="M${-W/2},${-H/2} H${W/2} V${H/2} H${-W/2}Z" fill="${[K.gold,K.mint,K.coral,'#fff'][i]}" stroke="${K.ink}" stroke-width="8"/><circle cx="${i%2?-W/2:W/2}" cy="0" r="30" fill="${[K.gold,K.mint,K.coral,'#fff'][i]}" stroke="${K.ink}" stroke-width="8"/>${TX(0,18,lb,{fs:46,A:true})}`,`translate(${R(x)},${R(y)}) rotate(${R((1-u)*40*(i%2?1:-1))})`,sel)});
 if(t>tT){const node=(x,y,lb,c)=>`<circle cx="${x}" cy="${y}" r="48" fill="${c}" stroke="${K.ink}" stroke-width="7"/>`+TX(x,y+100,lb,{fs:42});
  o+=G(draw('M1500,260 V430 M1500,430 V600',P(t,tT,tT+1),{w:8})+node(1500,240,'ROSE',K.coral)+(t>tT+.4?node(1500,430,'MOM',K.teal):'')+(t>tT+.8?node(1500,620,'JAKE',K.gold):''),'translate(160,0)');
  o+=label(1660,880,'FAMILY TREE',t,tT+.6,{fs:66,c:K.teal})}
 o+=label(960,150,p.title||'THE PUZZLE',t,.2,{fs:86,c:K.teal});
 return o};
// p26: caller ID can be faked
S.callerid=(t,d,p,ev)=>{let o=bg('red');
 const tF=AT(ev,'fake',2);const peel=E(P(t,tF,tF+.8));
 const scr=`<rect x="-104" y="-206" width="208" height="404" rx="18" fill="#16233F"/>${TX(0,-120,'incoming call',{fs:22,c:'#C9D3E3',A:false})}<circle cx="0" cy="-30" r="46" fill="${K.gold}" stroke="#fff" stroke-width="4"/>`+
  G(`<rect x="-96" y="40" width="192" height="64" rx="10" fill="${K.cream}" stroke="${K.ink}" stroke-width="4"/>${TX(0,86,'JAKE ♥',{fs:40,c:K.ink})}`,`rotate(${R(peel*-35)},-96,40) translate(${R(peel*-40)},${R(peel*-60)})`,1-peel*.2)+
  (t>tF+.3?TX(0,90,'+1 555-0147',{fs:28,c:K.coral,A:false}):'')+`<circle cx="-56" cy="160" r="26" fill="${K.coral}"/><circle cx="56" cy="160" r="26" fill="${K.green}"/>`;
 o+=phone(960,560,1.6,{screen:scr,ring:t<tF,t});
 if(t<tF)o+=ringFx(960,560,t,1.6);
 if(t>AT(ev,'panic'))o+=label(420,420,'PANIC HIDES',t,ev.panic,{fs:76,c:K.teal,rot:-4})+label(420,520,'THE MISTAKES',t,ev.panic+.2,{fs:76,c:K.teal,rot:-4});
 if(t>tF)o+=stamp(1480,780,'CALLER ID FAKED',t,tF+.6,{fs:56});
 return o};
// p27: stats
S.stat=(t,d,p,ev)=>{let o=bg('cream');
 o+=card(140,220,600,560,`<rect width="600" height="110" rx="20" fill="${K.coral}"/>${TX(300,75,'CONSUMER ALERT',{fs:50,c:'#fff'})}${[0,1,2,3,4,5].map(i=>`<rect x="50" y="${170+i*60}" width="${R(500-(i%3)*90)}" height="20" rx="10" fill="#C9D3E3"/>`).join('')}${TX(300,520,'"AI voice cloning"',{fs:40,c:K.teal,A:false})}`,t,AT(ev,'ftc',.4),{rot:-3});
 if(t>AT(ev,'fbi')){const n=Math.min(14,Math.floor((t-ev.fbi)*9));for(let i=0;i<n;i++)o+=bill(1300,860-i*30,1.5,{rot:(i%3-1)*3});
  o+=label(1300,250,'BILLIONS',t,ev.fbi+.3,{fs:150,c:K.coral,rot:-3})+label(1300,350,'LOST BY PEOPLE 60+ / YEAR',t,ev.fbi+.6,{fs:54})}
 o+=TX(960,940,'Sources: FTC consumer alert on AI voice cloning; FBI IC3 Elder Fraud Report',{fs:24,c:'#55607a',A:false});
 return o};
// p28: can copy / can't copy
S.goodnews=(t,d,p,ev)=>{let o=bg('blue');
 o+=label(960,170,'GOOD NEWS',t,.2,{fs:100,c:K.green,st:'#fff'});
 o+=card(180,300,700,520,wave(130,250,440,t,{amp:70,c:K.teal})+TX(350,450,'HOW HE SOUNDS',{fs:52}),t,AT(ev,'a',.6),{rot:-2});
 if(t>AT(ev,'a',.6)+.6)o+=check(820,330,1.3,true);
 o+=card(1040,300,700,520,`<g transform="translate(350,240)">${heartIcon(-90,0,.8)}<g transform="translate(110,0)"><path d="M-90,0 L0,-80 L90,0Z" fill="${K.coral}" stroke="${K.ink}" stroke-width="7" stroke-linejoin="round"/><rect x="-66" y="0" width="132" height="100" fill="#fff" stroke="${K.ink}" stroke-width="7"/></g></g>`+TX(350,450,'WHAT FAMILY KNOWS',{fs:52}),t,AT(ev,'b',2),{rot:2});
 if(t>AT(ev,'b',2)+.6)o+=check(1680,330,1.3,false);
 o+=label(530,900,'CAN COPY',t,AT(ev,'a',.6)+.8,{fs:64,c:K.teal})+label(1390,900,'CAN\'T COPY',t,AT(ev,'b',2)+.8,{fs:64,c:K.coral});
 return o};
// p29: quick test
S.quiz=(t,d,p,ev)=>{let o=bg('yellow');
 o+=label(960,150,'QUICK TEST',t,.2,{fs:110,c:K.coral});
 o+=G(phoneMini(K.coral),`translate(360,560) scale(3)`)+ringFx(360,560,t,1.4);
 o+=bubble(620,260,1100,['"Dad, I\'m in trouble. I need money','right now. Don\'t tell Mom."'],t,AT(ev,'b0',.6),{fs:50,wavy:1});
 if(t>AT(ev,'q'))o+=label(1170,640,'WHAT DO YOU DO FIRST?',t,ev.q,{fs:80,c:K.teal});
 if(t>AT(ev,'pause')){const k=pop(t,ev.pause)*(1+.05*Math.sin(t*5));o+=G(`<circle r="110" fill="${K.coral}" stroke="${K.ink}" stroke-width="9"/><rect x="-42" y="-55" width="30" height="110" rx="8" fill="#fff"/><rect x="12" y="-55" width="30" height="110" rx="8" fill="#fff"/>`,`translate(1170,860) scale(${R(k*100)/100})`)}
 return o};
// p30: hang up and call back
S.callback=(t,d,p,ev)=>{let o=bg('cream');
 const tH=AT(ev,'hang',.4),tC=AT(ev,'call',2),tS=AT(ev,'sec'),tO=AT(ev,'over');
 let scr;
 if(t<tC)scr=`<rect x="-104" y="-206" width="208" height="404" rx="18" fill="#16233F"/>${TX(0,-110,'unknown call',{fs:24,c:'#C9D3E3',A:false})}<circle cx="0" cy="130" r="${R(40+(t>tH?pop(t,tH)*10:0))}" fill="${K.coral}"/><path d="M-20,130 h40" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`;
 else scr=`<rect x="-104" y="-206" width="208" height="404" rx="18" fill="#fff"/>${TX(0,-160,'Contacts',{fs:28,A:false})}${['Mom','Son (saved)','Work'].map((n,i)=>`<rect x="-94" y="${-120+i*80}" width="188" height="64" rx="10" fill="${i===1?'#D3F2DF':'#EEF1F6'}" stroke="${i===1?K.green:'#C9D3E3'}" stroke-width="4"/><text x="-80" y="${-78+i*80}" font-size="24" fill="${K.ink}">${n}</text>`).join('')}<circle cx="0" cy="150" r="40" fill="${K.green}"/>`;
 o+=phone(560,560,1.6,{screen:scr});
 o+=label(1300,300,t<tC?'1. HANG UP':'2. CALL BACK',t,t<tC?tH:tC,{fs:110,c:t<tC?K.coral:K.green});
 if(t>tC)o+=label(1300,420,'the number YOU saved',t,tC+.3,{fs:52,c:K.ink});
 if(t>tS){const k=pop(t,tS);o+=G(clockIcon(0,0,1,t,0,0,1),`translate(1150,660) scale(${R(k*100)/100})`)+label(1420,690,'20 SEC',t,tS+.2,{fs:120,c:K.teal})}
 if(t>tO)o+=stamp(1300,900,'SCAM OVER',t,tO,{fs:70,c:K.green,rot:-5});
 return o};
// p31-33: five red flags (persistent grid)
const FLAGS=[['SUDDEN EMERGENCY','siren'],['"DON\'T TELL ANYONE"','shh'],['CASH · GIFT CARDS · CRYPTO','cash'],['A "LAWYER" TAKES OVER','case'],['A COURIER AT YOUR DOOR','door']];
function flagIcon(k,t){if(k==='siren'){const f=Math.floor(t*4)%2;return `<path d="M-40,30 V-10 Q-40,-50 0,-50 Q40,-50 40,-10 V30Z" fill="${f?K.coral:'#ff7a85'}" stroke="${K.ink}" stroke-width="6"/><rect x="-56" y="30" width="112" height="20" rx="6" fill="${K.ink}"/>`}
 if(k==='shh')return `<circle r="46" fill="${K.face}" stroke="${K.ink}" stroke-width="6"/><path d="M-12,20 h24" stroke="${K.ink}" stroke-width="6"/><rect x="-6" y="-10" width="14" height="52" rx="7" fill="${K.face}" stroke="${K.ink}" stroke-width="5"/>`;
 if(k==='cash')return bill(0,0,.75,{});
 if(k==='case')return `<rect x="-50" y="-26" width="100" height="70" rx="10" fill="${K.brown}" stroke="${K.ink}" stroke-width="6"/><path d="M-20,-26 V-42 H20 V-26" fill="none" stroke="${K.ink}" stroke-width="6"/>`;
 return `<rect x="-36" y="-56" width="72" height="112" fill="${K.coral}" stroke="${K.ink}" stroke-width="6"/><circle cx="20" cy="4" r="7" fill="${K.gold}"/>`}
S.flags=(t,d,p,ev)=>{let o=bg('red');
 o+=label(960,140,'5 RED FLAGS',t,-1,{fs:100,c:K.coral,st:'#fff'});
 FLAGS.forEach(([txt,ic],i)=>{const a=i<(p.pre||0)?-1:AT(ev,'f'+i);if(t<a)return;const col=i<3?i:i-3,row=i<3?0:1;const x=row===0?120+col*580:410+col*580,y=row===0?250:640;
  const hl=p.hl===i;
  o+=card(x,y,520,330,`<g transform="translate(260,120) scale(1.4)">${flagIcon(ic,t)}</g><circle cx="48" cy="48" r="34" fill="${K.coral}" stroke="${K.ink}" stroke-width="5"/>${TX(48,64,String(i+1),{fs:46,c:'#fff'})}${TX(260,280,txt,{fs:txt.length>20?34:42})}`,t,a,{rot:(i%2?1.5:-1.5),fill:hl&&t>a?'#FFF6DA':'#fff'})});
 return o};
// p35: family safe word
S.safeword=(t,d,p,ev)=>{let o=bg('yellow')+floor(910,'#D9C79B');
 const fam=[[ROSE,280,0],[MOM,600,1],[DAD,1320,2],[JAKE,1640,3]];
 fam.forEach(([b,x,i])=>{o+=who(b,{x,y:910,t,flip:i>=2,mouth:'smile',happy:t>AT(ev,'word')&&i%2===0,bo:i})});
 const k=pop(t,AT(ev,'word',.5),.5);
 o+=G(`<rect x="-260" y="-150" width="520" height="300" rx="26" fill="#fff" stroke="${K.ink}" stroke-width="9"/>${TX(0,-70,'FAMILY SAFE WORD',{fs:42,c:K.teal})}${TX(0,50,'• • • • •',{fs:96,c:K.coral})}<g transform="translate(200,-130)"><rect x="-40" y="-14" width="80" height="62" rx="10" fill="${K.gold}" stroke="${K.ink}" stroke-width="6"/><path d="M-24,-14 V-34 Q-24,-60 0,-60 Q24,-60 24,-34 V-14" fill="none" stroke="${K.ink}" stroke-width="8"/></g>`,`translate(960,${R(200+Math.sin(t*2)*8)}) scale(${R(k*.75*100)/100})`);
 if(t>AT(ev,'fbi'))o+=stamp(960,560,'FBI RECOMMENDS',t,ev.fbi,{c:K.teal,fs:52});
 if(t>AT(ev,'no'))o+=label(960,820,'NO WORD = NOT FAMILY',t,ev.no,{fs:72,c:K.coral});
 return o};
// p38: Sunday — Rose and Jake
S.ending=(t,d,p,ev)=>{let o=bg('blue')+`<rect x="-200" y="860" width="2320" height="500" fill="#9CC08A"/><path d="M-200,860 H2120" stroke="${K.ink}" stroke-width="6"/>`;
 o+=who(ROSE,{x:820,y:900,t,mouth:'smile',happy:t>AT(ev,'word'),armR:[170,-330]});
 o+=who(JAKE,{x:1100,y:900,t,flip:true,mouth:'grin',armR:[180,-330]});
 o+=label(500,260,'$9,000 LOST',t,AT(ev,'lost',.4),{fs:84,c:K.coral,rot:-3});
 if(t>AT(ev,'saved'))o+=label(1450,260,'$12,000 SAVED',t,ev.saved,{fs:84,c:K.green,rot:3,st:'#fff'});
 if(t>AT(ev,'word'))o+=card(1330,460,460,200,TX(230,80,'SAFE WORD:',{fs:44,c:K.teal})+`<rect x="80" y="110" width="300" height="56" fill="${K.ink}"/>`,t,ev.word,{rot:4});
 return o};
// p39: share
S.share=(t,d,p,ev)=>{let o=bg('cream');
 o+=phone(520,560,1.6,{screen:`<rect x="-104" y="-206" width="208" height="404" rx="18" fill="#fff"/>${TX(0,-160,'Share to…',{fs:28,A:false})}${['Mom','Dad','Grandpa'].map((n,i)=>`<circle cx="${-60+i*60}" cy="-60" r="26" fill="${[K.teal,K.mint,K.coral][i]}" stroke="${K.ink}" stroke-width="4"/><text x="${-60+i*60}" y="-14" font-size="18" text-anchor="middle" fill="${K.ink}">${n}</text>`).join('')}`});
 const tS=AT(ev,'send',.6);
 for(let i=0;i<3;i++){const a=tS+i*.5;if(t<a)continue;const u=E(P(t,a,a+1.3));o+=G(`<path d="M-40,-20 L50,0 L-40,24 L-24,0Z" fill="#fff" stroke="${K.ink}" stroke-width="6" stroke-linejoin="round"/>`,`translate(${R(640+u*900)},${R(520-u*(200-i*140)+Math.sin(u*6)*30)}) rotate(${R(-10+i*12)})`,1-P(t,a+1.2,a+1.5));
  if(t>a+1.2)o+=G(heartIcon(0,0,.5),`translate(1560,${R(320+i*140)}) scale(${R(pop(t,a+1.2)*100)/100})`)}
 o+=label(1250,150,'SEND IT TONIGHT',t,AT(ev,'title',.2),{fs:100,c:K.coral});
 if(t>AT(ev,'call'))o+=label(1150,860,'THEN PICK YOUR WORD',t,ev.call,{fs:76,c:K.teal});
 return o};
// p40: next episode — toll text
S.next=(t,d,p,ev)=>{let o=bg('navy');
 o+=`<rect x="-200" y="760" width="2320" height="600" fill="#2E3440"/>${[0,1,2,3,4,5,6].map(i=>`<rect x="${R(((i*330-t*400)%2310+2310)%2310-200)}" y="900" width="160" height="16" fill="${K.gold}"/>`).join('')}<g transform="translate(1400,760)"><rect x="-500" y="-420" width="30" height="420" fill="#9aa3b2" stroke="${K.ink}" stroke-width="5"/><rect x="470" y="-420" width="30" height="420" fill="#9aa3b2" stroke="${K.ink}" stroke-width="5"/><rect x="-520" y="-460" width="1040" height="90" rx="8" fill="${K.green}" stroke="${K.ink}" stroke-width="6"/>${TX(0,-400,'TOLL',{fs:56,c:'#fff',ls:12})}</g>`;
 o+=phone(520,520,1.5,{screen:`<rect x="-104" y="-206" width="208" height="404" rx="18" fill="#fff"/><rect x="-92" y="-150" width="184" height="150" rx="14" fill="#E9EDF3"/>${['UNPAID TOLL:','$3.95 due.','Pay now to avoid','a fine:'].map((l,i)=>`<text x="-82" y="${-118+i*30}" font-size="21" fill="${K.ink}">${l}</text>`).join('')}<text x="-82" y="2" font-size="18" fill="#2f6fde">toll-pay.example.com</text>`,t,ring:0});
 o+=label(1300,250,'NEXT EPISODE',t,AT(ev,'next',.3),{fs:110,c:K.gold,st:K.ink});
 if(t>AT(ev,'wave'))o+=label(1300,380,'THE TOLL TEXT SCAM',t,ev.wave,{fs:76,c:'#fff',st:K.ink});
 if(t>AT(ev,'sub')){const k=pop(t,ev.sub)*(1+.04*Math.sin(t*6));o+=G(`<rect x="-230" y="-60" width="460" height="120" rx="22" fill="${K.coral}" stroke="${K.ink}" stroke-width="8"/>${TX(0,24,'SUBSCRIBE',{fs:64,c:'#fff'})}`,`translate(1300,560) scale(${R(k*100)/100})`)}
 return o};
// brain: logic -> rescue mode
S.brain=(t,d,p,ev)=>{let o=bg('red');
 const tF=AT(ev,'flip',3);const on=t>tF;
 o+=who(ROSE,{x:520,y:1180,s:1.3,t,mouth:on?'o':'flat',brow:on?1:0,wide:on,armR:EAR,holdR:phoneMini(K.coral)});
 // panel with switch
 o+=card(980,250,760,520,TX(380,90,'BRAIN MODE',{fs:56,c:K.teal})+TX(200,250,'THINK',{fs:70,c:on?'#9aa3b2':K.teal})+TX(560,250,'RESCUE',{fs:70,c:on?K.coral:'#9aa3b2'}),t,AT(ev,'logic',.3));
 if(t>AT(ev,'logic',.3)+.3){const a=on?E(P(t,tF,tF+.25)):0;o+=G(`<rect x="-150" y="-40" width="300" height="80" rx="40" fill="#E8EEF8" stroke="${K.ink}" stroke-width="7"/><circle cx="${R(-100+a*200)}" cy="0" r="52" fill="${on?K.coral:K.teal}" stroke="${K.ink}" stroke-width="7"/>`,'translate(1360,640)')}
 if(t>AT(ev,'love')){const b=1+.12*Math.max(0,Math.sin(t*9));o+=G(heartIcon(0,0,.7),`translate(560,${R(560)}) scale(${R(b*pop(t,ev.love)*100)/100})`)}
 if(t>AT(ev,'stop'))o+=stamp(1360,900,'NO MORE QUESTIONS',t,ev.stop,{fs:56});
 return o};
// who else gets these calls
S.targets=(t,d,p,ev)=>{let o=bg('cream');
 const set=[[ROSE,'GRANDPARENTS','"Grandma, it\'s me"'],[MOM,'PARENTS','"Mom, help me!"'],[DAD,'OFFICE WORKERS','"It\'s your boss. Wire it now."']];
 set.forEach(([b,lb,q],i)=>{const a=i===0?.2:AT(ev,'r'+(i-1),1+i);if(t<a)return;const x=380+i*580;const k=BK(P(t,a,a+.5));
  o+=G(polaroid(0,0,who(b,{x:0,y:250,s:.45,t,mouth:'o',brow:1,armR:EAR,holdR:phoneMini(K.coral)}),(i-1)*5,1.15,lb),`translate(${x},${R(420-(1-k)*600)})`);
  if(t>a+.4)o+=bubble(x-210,660,420,[q],t,a+.4,{fs:30,wavy:1,tail:'bc',cps:60})});
 if(t>AT(ev,'rec'))o+=label(960,880,'VOICE + PANIC + DEADLINE',t,ev.rec,{fs:84,c:K.coral});
 return o};
// don't hang up -> hang up
S.donthang=(t,d,p,ev)=>{let o=bg('blue');
 const tH=AT(ev,'hang',2);
 o+=phone(560,560,1.6,{screen:`<rect x="-104" y="-206" width="208" height="404" rx="18" fill="#16233F"/>${TX(0,-110,'unknown caller',{fs:22,c:'#C9D3E3',A:false})}${TX(0,-50,t>tH?'call ended':'02:47',{fs:34,c:'#fff',A:false})}<circle cx="0" cy="130" r="${R(42+(t>tH?Math.max(0,8-(t-tH)*20):0))}" fill="${K.coral}"/><path d="M-20,130 h40" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`});
 o+=bubble(820,170,820,['"Don\'t hang up!','There\'s no time!"'],t,AT(ev,'b0',.3),{fs:56,wavy:1,op:t>tH?1-P(t,tH,tH+.4):1});
 if(t>tH){o+=G(`<path d="M0,-60 L0,40" stroke="${K.ink}" stroke-width="0"/>`,'');o+=label(1260,560,'HANG UP.',t,tH,{fs:150,c:K.coral,rot:-4})}
 if(t>AT(ev,'sec'))o+=label(1260,760,'REAL EMERGENCIES CAN WAIT 20 SECONDS',t,ev.sec,{fs:46,c:K.teal});
 return o};
// thumbnails (static)
S.thumb=(t,d,p,ev)=>{const v=p.v||'A';let o=bg('navy')+`<circle cx="520" cy="560" r="520" fill="#FFD166" opacity=".18"/><circle cx="520" cy="560" r="380" fill="#FFD166" opacity=".16"/>`;
 const T2=(x,y,s,fs,c,rot=0)=>`<text x="${x}" y="${y}" font-size="${fs}" fill="${c}" class="A" text-anchor="middle" stroke="${K.ink}" stroke-width="22" paint-order="stroke" stroke-linejoin="round" transform="rotate(${rot},${x},${y})">${s}</text>`;
 if(v==='A'){o+=who(ROSE,{x:520,y:1500,s:2.1,t:1,armR:EAR,holdR:phoneMini(K.coral),mouth:'o',brow:1,wide:1,tears:1});
  o+=T2(1390,430,"IT WASN'T",200,'#fff',-3)+T2(1390,690,'HIM.',300,K.coral,-3)+`<g transform="translate(1390,880)"><rect x="-330" y="-60" width="660" height="120" rx="20" fill="${K.gold}" stroke="${K.ink}" stroke-width="10"/>${TX(0,36,'AI VOICE CLONE',{fs:84,c:K.ink})}</g>`;}
 if(v==='B'){o+=phone(560,560,2.0,{screen:`<rect x="-104" y="-206" width="208" height="404" rx="18" fill="#16233F"/>${TX(0,-120,'incoming call',{fs:24,c:'#C9D3E3',A:false})}<circle cx="0" cy="-30" r="50" fill="${K.gold}" stroke="#fff" stroke-width="4"/><rect x="-96" y="40" width="192" height="64" rx="10" fill="${K.cream}"/>${TX(0,86,'GRANDSON',{fs:36})}<circle cx="-56" cy="160" r="26" fill="${K.coral}"/><circle cx="56" cy="160" r="26" fill="${K.green}"/>`})+ringFx(560,560,.3,2);
  o+=T2(1380,420,'NOT',230,'#fff',-3)+T2(1380,690,'HIM.',300,K.coral,-3)+`<g transform="translate(1380,880)"><rect x="-300" y="-60" width="600" height="120" rx="20" fill="${K.gold}" stroke="${K.ink}" stroke-width="10"/>${TX(0,36,'IT\'S AI',{fs:90,c:K.ink})}</g>`;}
 if(v==='C'){o+=who(ROSE,{x:520,y:1500,s:2.1,t:1,armR:EAR,holdR:phoneMini(K.coral),mouth:'o',brow:1,wide:1});
  o+=`<g transform="translate(980,90)"><rect width="860" height="200" rx="30" fill="#fff" stroke="${K.ink}" stroke-width="12"/><path d="M80,200 L30,290 L190,200Z" fill="#fff" stroke="${K.ink}" stroke-width="12" stroke-linejoin="round"/><rect x="40" y="186" width="160" height="24" fill="#fff"/>${TX(430,135,'"GRANDMA, IT\'S ME"',{fs:84,c:K.ink})}</g>`+T2(1410,640,'3 SECONDS',210,K.gold,-3)+T2(1410,860,'TO CLONE',150,'#fff',-3);}
 return o};
