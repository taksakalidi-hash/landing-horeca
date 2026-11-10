// ======== environments (varied backgrounds) — injected into engine.html ========
const HW='font-family:Caveat,cursive';
const TH=(x,y,s,o={})=>`<text x="${x}" y="${y}" font-size="${o.fs||48}" fill="${o.c||'#1d2a5a'}" font-weight="${o.w||700}" text-anchor="${o.a||'start'}" style="${HW}" opacity="${o.op??1}">${s}</text>`;
function speckle(n,w,h,cols,seed,rmax=3){SEED=seed;let s='';for(let i=0;i<n;i++)s+=`<circle cx="${rnd()*w}" cy="${rnd()*h}" r="${0.6+rnd()*rmax}" fill="${cols[i%cols.length]}"/>`;return s}
function bgCork(){return `<rect width="1920" height="1080" fill="#5a3a22"/><rect x="40" y="40" width="1840" height="1000" rx="10" fill="#b98a5c"/>${speckle(900,1840,1000,['#a87b4f','#c99b6a','#8f6640'],77)}<rect x="40" y="40" width="1840" height="1000" rx="10" fill="none" stroke="#3e2714" stroke-width="26"/><rect width="1920" height="1080" fill="url(#darkVig)"/>`}
function pin(x,y,c=C.red){return `<circle cx="${x}" cy="${y}" r="13" fill="${c}"/><circle cx="${x-4}" cy="${y-4}" r="4" fill="#fff" opacity=".6"/>`}
function polaroid(x,y,rot,inner,cap,k=1){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${k})" filter="url(#sh)"><rect x="-110" y="-120" width="220" height="250" fill="#fbfaf5"/><rect x="-95" y="-105" width="190" height="170" fill="#2b3550"/><g><defs><clipPath id="pc${Math.round(x)}${Math.round(y)}"><rect x="-95" y="-105" width="190" height="170"/></clipPath></defs><g clip-path="url(#pc${Math.round(x)}${Math.round(y)})">${inner}</g></g>${TH(0,110,cap,{fs:40,a:'middle'})}${pin(0,-118)}</g>`}
function bgWhiteboard(){return `<rect width="1920" height="1080" fill="#cfd5dc"/><rect x="90" y="60" width="1740" height="880" rx="14" fill="#a7afba"/><rect x="110" y="80" width="1700" height="840" rx="6" fill="#f8f9fb"/><path d="M200 140 Q900 120 1700 160" stroke="#e3e7ee" stroke-width="40" fill="none" opacity=".6"/><rect x="300" y="940" width="1320" height="28" rx="8" fill="#8f97a3"/><rect x="420" y="926" width="120" height="18" rx="8" fill="${C.red}"/><rect x="580" y="926" width="120" height="18" rx="8" fill="#1d2a5a"/><rect x="740" y="924" width="90" height="26" rx="6" fill="#444"/>`}
function bgLegalPad(){let s=`<rect width="1920" height="1080" fill="#6b4a32"/>${speckle(120,1920,1080,['#5d3f2a','#7a573c'],5,8)}<g transform="translate(960,560) rotate(-2)" filter="url(#sh)"><rect x="-640" y="-470" width="1280" height="960" fill="#fff6b8"/><rect x="-640" y="-470" width="1280" height="70" fill="#c0392b"/>`;
 for(let i=0;i<16;i++)s+=`<line x1="-640" y1="${-360+i*56}" x2="640" y2="${-360+i*56}" stroke="#9cc3e8" stroke-width="2"/>`;
 return s+`<line x1="-520" y1="-400" x2="-520" y2="490" stroke="#e8908a" stroke-width="3"/></g><g transform="translate(1660,820) rotate(-35)"><rect x="-12" y="-170" width="24" height="300" rx="6" fill="${C.yel}"/><path d="M-12 130 L0 170 L12 130Z" fill="#e8c9a0"/></g>`}
function bgStickyWall(){return `<rect width="1920" height="1080" fill="#e9e4da"/><rect x="0" y="0" width="1920" height="1080" fill="url(#darkVig)" opacity=".35"/><rect x="0" y="960" width="1920" height="120" fill="#cfc7b8"/>`}
function sticky(x,y,rot,col,inner,k=1){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${k})" filter="url(#sh)"><rect x="-230" y="-230" width="460" height="460" fill="${col}"/><path d="M-230 190 L-190 230 L-230 230Z" fill="#000" opacity=".08"/><rect x="-60" y="-250" width="120" height="40" fill="#fff" opacity=".55" transform="rotate(-4)"/>${inner}</g>`}
function bgNews(t,ticker){let s=`<defs><linearGradient id="newsG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1f44"/><stop offset="1" stop-color="#14306a"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#newsG)"/>`;
 for(let i=0;i<9;i++)s+=`<path d="M960 -100 L${-400+i*340} 1080 L${-300+i*340} 1080Z" fill="#fff" opacity=".025"/>`;
 s+=`<rect x="0" y="40" width="560" height="90" fill="${C.red}"/>${T(40,105,'● BREAKING NEWS',{fs:52,cls:'A'})}<rect x="560" y="40" width="300" height="90" fill="#fff"/>${T(710,105,'LIVE',{fs:52,a:'middle',cls:'A',c:C.red})}`;
 s+=`<rect x="0" y="960" width="1920" height="80" fill="#fff"/><rect x="0" y="960" width="260" height="80" fill="${C.red}"/>${T(130,1013,'ALERT',{fs:44,a:'middle',cls:'A'})}`;
 const tk=(ticker||'')+'   •   ';const off=(t*180)%(tk.length*22);s+=`<g clip-path="url(#tick)"><defs><clipPath id="tick"><rect x="260" y="960" width="1660" height="80"/></clipPath></defs>${T(1920-off,1014,tk+tk+tk,{fs:38,c:C.navy,w:800})}</g>`;
 return s}
function bgCourt(){let s=`<rect width="1920" height="1080" fill="#5a381d"/>`;for(let i=0;i<12;i++)s+=`<rect x="${i*160}" y="0" width="150" height="700" fill="${i%2?'#6b4423':'#62401f'}"/><rect x="${i*160+20}" y="60" width="110" height="260" rx="6" fill="none" stroke="#4a2d14" stroke-width="6"/>`;
 s+=`<circle cx="960" cy="200" r="120" fill="#c9a24a" stroke="#8a6a2a" stroke-width="12"/>${T(960,245,'⚖️',{fs:130,a:'middle'})}`;
 s+=`<rect x="0" y="700" width="1920" height="380" fill="#3e2714"/><rect x="260" y="560" width="1400" height="420" rx="10" fill="#7a4f2a"/><rect x="260" y="560" width="1400" height="40" fill="#8f5f34"/>`;
 s+=`<g transform="translate(1560,540) rotate(-25)"><rect x="-90" y="-26" width="180" height="52" rx="14" fill="#5a3a20"/><rect x="-14" y="20" width="28" height="140" rx="8" fill="#6b4423"/></g>`;
 return s}
function bgStage(t){let s=`<rect width="1920" height="1080" fill="#120a0e"/><rect x="0" y="820" width="1920" height="260" fill="#3a2418"/>`;
 for(let i=0;i<14;i++)s+=`<line x1="0" y1="${830+i*18}" x2="1920" y2="${830+i*18}" stroke="#2a1810" stroke-width="3"/>`;
 s+=`<path d="M560 -50 L1360 -50 L1600 840 L320 840Z" fill="#fff4c4" opacity="${.08+.02*Math.sin(t*3)}"/><ellipse cx="960" cy="850" rx="520" ry="70" fill="#fff4c4" opacity=".12"/>`;
 const curtain=(x0,dir)=>{let c='';for(let i=0;i<7;i++){const x=x0+dir*i*55;c+=`<path d="M${x} 0 Q${x+dir*30} 450 ${x+dir*(10+Math.sin(t+i)*6)} 860 L${x+dir*55} 860 Q${x+dir*80} 450 ${x+dir*55} 0Z" fill="${i%2?'#8e1b25':'#a3212c'}"/>`}return c};
 s+=curtain(0,1)+curtain(1920,-1)+`<path d="M0 0 H1920 V120 Q1440 190 960 120 Q480 190 0 120Z" fill="#7a1520"/><path d="M0 110 Q480 180 960 110 Q1440 180 1920 110" stroke="${C.yel}" stroke-width="8" fill="none"/>`;
 return s}
function bgDesk(){return `<rect width="1920" height="1080" fill="#7a5235"/>${speckle(80,1920,1080,['#6b4630','#8a5f3e'],9,10)}${Array.from({length:9},(_,i)=>`<path d="M0 ${60+i*120} Q960 ${40+i*120+(i%2?30:-20)} 1920 ${70+i*120}" stroke="#6a4630" stroke-width="3" fill="none" opacity=".5"/>`).join('')}
 <g transform="translate(1720,180)"><circle r="95" fill="#f4f1de"/><circle r="72" fill="#4a2c1a"/><ellipse cx="-20" cy="-20" rx="26" ry="12" fill="#fff" opacity=".25"/></g><circle cx="1500" cy="900" r="80" fill="none" stroke="#5a3820" stroke-width="10" opacity=".4"/>
 <g transform="translate(220,880) rotate(20)"><rect x="-10" y="-150" width="20" height="300" rx="8" fill="#1d2a5a"/><rect x="-10" y="-150" width="20" height="40" fill="#c9ced8"/></g><g transform="translate(160,240) rotate(-12)"><rect x="-110" y="-70" width="220" height="140" fill="#fff6b8"/>${TH(0,10,'call bank!',{fs:40,a:'middle',c:C.red})}</g>`}
function bgCafe(t){let s=`<defs><radialGradient id="cafeG" cx="50%" cy="40%" r="80%"><stop offset="0" stop-color="#4a2c1d"/><stop offset="1" stop-color="#1a0f0a"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#cafeG)"/>`;
 SEED=21;for(let i=0;i<26;i++){const x=rnd()*1920,y=rnd()*700,r=30+rnd()*80;s+=`<circle cx="${x}" cy="${y+Math.sin(t*.5+i)*6}" r="${r}" fill="${['#ffb35c','#ffd59e','#ff8a4c','#fff0c9'][i%4]}" opacity="${.08+rnd()*.14}"/>`}
 return s+`<rect x="0" y="820" width="1920" height="260" fill="#2a1a12"/><rect x="0" y="820" width="1920" height="14" fill="#3d2618"/><g transform="translate(1500,780)"><path d="M-70 0 h140 l-16 120 h-108z" fill="#f4f1de"/><ellipse cx="0" cy="0" rx="70" ry="16" fill="#5a3418"/></g>`}
function bgBus(t){let s=`<rect width="1920" height="1080" fill="#14161f"/><rect x="0" y="140" width="1920" height="380" fill="#0a0c14"/>`;
 for(let i=0;i<10;i++){const x=((i*260-t*700)%2600+2600)%2600-300;s+=`<rect x="${x}" y="${220+(i%3)*70}" width="${120+(i%4)*60}" height="10" rx="5" fill="${['#ffd166','#ff8a4c','#9cc3ff'][i%3]}" opacity=".7"/>`}
 for(let i=0;i<4;i++)s+=`<rect x="${i*500-20}" y="130" width="40" height="400" fill="#232633"/>`;
 s+=`<rect x="0" y="520" width="1920" height="560" fill="#1d2130"/><rect x="0" y="600" width="1920" height="40" fill="#c0392b" opacity=".5"/>`;
 for(let i=0;i<3;i++)s+=`<rect x="${120+i*620}" y="660" width="420" height="420" rx="40" fill="#2c3247"/>`;
 return s}
function bgMap(){let s=`<rect width="1920" height="1080" fill="#0e1a1e"/>`;SEED=33;
 for(let i=0;i<70;i++){const x=rnd()*1920,y=rnd()*1080;s+=`<rect x="${x}" y="${y}" width="${60+rnd()*120}" height="${40+rnd()*90}" rx="6" fill="#16282d"/>`}
 for(let i=0;i<9;i++)s+=`<line x1="0" y1="${i*130+30}" x2="1920" y2="${i*130-40}" stroke="#25393f" stroke-width="${i%3?10:22}"/>`;
 for(let i=0;i<12;i++)s+=`<line x1="${i*170}" y1="0" x2="${i*170+80}" y2="1080" stroke="#25393f" stroke-width="${i%4?10:20}"/>`;
 return s+`<path d="M-50 900 Q500 760 900 880 T1980 820" stroke="#123a52" stroke-width="70" fill="none"/><rect width="1920" height="1080" fill="url(#darkVig)"/>`}
function bgTVRoom(t){return `${livingroom(t)}<rect width="1920" height="1080" fill="#000" opacity=".35"/>`}
function hand(x,y,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot})"><path d="M-150 260 Q-170 120 -110 60 L-90 -40 Q-80 -70 -60 -40 L-60 40 L120 40 Q160 60 150 120 L140 260Z" fill="#dba57f"/><path d="M120 40 Q170 20 175 -20 Q178 -50 150 -40 Q130 0 100 10Z" fill="#dba57f"/></g>`}
function chapterBg(n,t){const pal=[['#0B1320','#1c3060'],['#2a0c12','#5a1420'],['#1d1233','#3e2a6b'],['#0b2a2a','#145a54'],['#2b1a08','#6b3f12']][(n-1)%5];
 let s=`<rect width="1920" height="1080" fill="${pal[0]}"/>`;for(let i=0;i<12;i++){const x=((i*220+t*120)%2640)-360;s+=`<path d="M${x} 0 L${x+120} 0 L${x-280} 1080 L${x-400} 1080Z" fill="${pal[1]}" opacity=".55"/>`}
 return s+T(1880,1040,'0'+n,{fs:420,a:'end',cls:'A',c:'#fff',op:.05})+`<rect width="1920" height="1080" fill="url(#darkVig)"/>`}
