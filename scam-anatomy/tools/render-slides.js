const {chromium}=require('playwright');const path=require('path');
(async()=>{const [,,html,out]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.goto('file://'+path.resolve(html)+'?s=01-hook-text');const ids=await p.evaluate('window.IDS');
for(const id of ids){await p.goto('file://'+path.resolve(html)+'?s='+id);await p.evaluate('document.fonts.ready');await p.waitForTimeout(150);
 await p.screenshot({path:out+'/'+id+'.png',clip:{x:0,y:0,width:1920,height:1080}});}
await b.close();console.log(ids.length,'slides');})();
