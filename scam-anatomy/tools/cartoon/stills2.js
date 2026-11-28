// node stills2.js <scenes.js> <shot.json> <outDir> t1,t2,...  -> PNG stills from puppet2
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const [sc,shotf,out,ts]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('file://'+path.resolve(__dirname,'puppet2.html')+'?ep='+path.resolve(sc));await p.waitForFunction('window.DONE===true');
const shot=JSON.parse(fs.readFileSync(shotf));await p.evaluate(s=>setup(s),{...shot,t0:0});
for(const t of ts.split(',').map(Number)){await p.evaluate(t=>frame(t),t);await p.screenshot({path:path.join(out,'s'+String(t.toFixed(1)).padStart(6,'0')+'.png')})}await b.close()})();
