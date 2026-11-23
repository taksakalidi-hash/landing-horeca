// node qa_stills.js shots.json outDir [fractions...]  (ENGINE env selects the html)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const jobs=JSON.parse(fs.readFileSync(process.argv[2]));const out=process.argv[3];const fr=(process.argv[4]||'0.5,0.95').split(',').map(Number);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve(__dirname,process.env.ENGINE||'engine.html'));await p.waitForFunction('window.DONE===true');
for(const j of jobs){const d=j.shot.dur;await p.evaluate(s=>setup(s),j.shot);
 for(const f of fr){await p.evaluate(t=>frame(t),d*f);await p.screenshot({path:`${out}/${j.id}_${f}.jpg`,type:'jpeg',quality:70});}}
await b.close();})();
