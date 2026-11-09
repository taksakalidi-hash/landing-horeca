const {chromium}=require('playwright');const fs=require('fs');const {execSync}=require('child_process');
(async()=>{const [,,mode,dur,out]=process.argv;const fps=30,n=Math.round(dur*fps);const dir='/tmp/claude-0/-workspace-landing-horeca/e92eea85-b565-5666-b9ab-222243bdc2f7/scratchpad/frames-'+mode;
fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir,{recursive:true});
const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://127.0.0.1:8766/scene3d.html?mode='+mode);await p.waitForFunction('window.DONE===true',null,{timeout:120000});
for(let i=0;i<n;i++){await p.evaluate(t=>window.frame(t),i/fps);await p.screenshot({path:`${dir}/f${String(i).padStart(4,'0')}.png`,clip:{x:0,y:0,width:1920,height:1080}});}
await b.close();
execSync(`ffmpeg -y -loglevel error -framerate ${fps} -i ${dir}/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 ${out}`);console.log(mode,n,'frames ->',out);})();
