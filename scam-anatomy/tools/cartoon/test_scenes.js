const {chromium}=require('playwright');const path=require('path');
const shots=[
 {scene:'kitchen',dur:6,ev:{buzz:0.5,bubble:1,reply:2},t:3},
 {scene:'kitchen',dur:6,ev:{spin:0.2,balance:1.5,gone:3},t:4.5},
 {scene:'kitchen',dur:6,p:{phone:'ear',talk:1,zoom:1.3,cx:820,cy:500},ev:{shield:0.5,crack:2},t:3},
 {scene:'anatomy',dur:6,ev:{},t:4},
 {scene:'casefile',dur:6,ev:{stamp:3},t:4},
 {scene:'phone',dur:6,p:{lens:1,msgs:[{who:'in',txt:['FRAUD ALERT: Did you attempt','a purchase of $1,249.99?','Reply YES or NO'],at:0}],checks:[{txt:'No link'},{txt:'No typos'},{txt:'Feels safe',bad:1}]},ev:{c0:1,c1:2,c2:3},t:4},
 {scene:'guard',dur:6,ev:{down:2,nolink:3},t:4},
 {scene:'callcenter',dur:6,p:{smirk:1,talk:0,monitor:[{txt:'NEW REPLY: "NO"',c:'#7a1020'},{txt:'✓ Real person'},{txt:'✓ Worried'},{txt:'✓ Ready to talk'}]},ev:{m0:.2,m1:1,m2:2,m3:3},t:4},
 {scene:'split',dur:6,p:{tag:'"Mark"',tag2:'Fraud Prevention (fake)',cards:[['Full name','Denise R.'],['Card ending','•••• 4417'],['Address','✓ known']]},ev:{k0:1,k1:2,k2:3},t:4},
 {scene:'darkweb',dur:6,ev:{sold:1},t:3},
 {scene:'split',dur:6,p:{dTalk:1,sweat:.9,digits:1},ev:{dTalk:0.5,digits:1},t:2.5},
 {scene:'lock',dur:6,ev:{code:0.3,open:2.5,key:3},t:4},
 {scene:'callcenter',dur:6,p:{smirk:1,access:1,glow:'glowG',monitor:[{txt:'ACCOUNT: DENISE R.',c:'#063',tc:'#3ddc84'}]},ev:{access:1},t:2.5},
 {scene:'split',dur:6,p:{red:1,angry:1,dBrow:1,dWide:1.4,sweat:1},ev:{},t:2},
 {scene:'transfer',dur:6,ev:{type:.3,press:2.4,sent:2.8},t:4},
 {scene:'vault',dur:6,ev:{fall:.5,say:1.5},t:4.5},
 {scene:'flow',dur:6,ev:{n0:.2,n1:1,n2:2,n3:3},t:4.5},
 {scene:'kitchen',dur:6,p:{day:1,phone:'ear',talk:1,smile:-1,brow:1},ev:{},t:3},
 {scene:'verdict',dur:6,ev:{stamp:1,heart:2,crack:3},t:4.5},
 {scene:'ai',dur:6,ev:{voice:.3,write:1,tested:3},t:4.5},
 {scene:'psych',dur:6,ev:{i0:.3,i1:1,i2:2},t:4},
 {scene:'stat',dur:6,ev:{top:3},t:4},
 {scene:'checklist',dur:8,p:{title:'5 RED FLAGS',items:['A "fraud alert" that asks you to reply','Caller ID shows your bank — can be faked','Anyone asking for a code you were texted','Any request to move money "to keep it safe"','Pressure: "do it right now"']},ev:{i0:.2,i1:1,i2:2,i3:3,i4:4},t:3.5},
 {scene:'report',dur:6,ev:{u0:.4,u1:1.5,pw:3},t:4},
 {scene:'share',dur:6,ev:{send:.5},t:4},
 {scene:'next',dur:6,ev:{},t:3},
 {scene:'chapter',dur:2,p:{n:4,title:'THE "SAFE"|ACCOUNT'},t:1.2},
 {scene:'endscreen',dur:6,t:2},
];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve('engine.html'));await p.waitForFunction('window.DONE===true');
for(let i=0;i<shots.length;i++){const s=shots[i];await p.evaluate(s=>{setup(s);frame(s.t)},s);await p.screenshot({path:`${process.argv[2]}/t${String(i).padStart(2,'0')}.png`});}
await b.close();console.log('ok',shots.length)})();
