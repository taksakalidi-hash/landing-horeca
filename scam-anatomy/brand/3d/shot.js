const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
for(const [mode,w,h] of [['avatar',1024,1024],['banner',2560,1440]]){
 const p=await b.newPage({viewport:{width:w,height:h}});p.on('console',m=>console.log(mode,m.type(),m.text()));p.on('pageerror',e=>console.log(mode,'ERR',e.message));
 await p.goto('http://127.0.0.1:8765/scene.html?mode='+mode);await p.waitForFunction('window.DONE===true',null,{timeout:120000});await p.waitForTimeout(800);
 await p.screenshot({path:process.argv[2]+'/'+mode+'-3d.png',clip:{x:0,y:0,width:w,height:h}});}
await b.close();})();
