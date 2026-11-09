const {chromium}=require('playwright');
(async()=>{const [,,mode,out]=process.argv;const SZ={avatar:[1024,1024],banner:[2560,1440],thumb:[1280,720]};const [w,h]=SZ[mode];
const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://127.0.0.1:8766/scene3d.html?mode='+mode);await p.waitForFunction('window.DONE===true',null,{timeout:120000});await p.waitForTimeout(500);
await p.screenshot({path:out,clip:{x:0,y:0,width:w,height:h}});await b.close();})();
