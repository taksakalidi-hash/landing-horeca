const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const {execSync}=require('child_process');
(async()=>{const [,,html,dur,out,stills]=process.argv;const fps=30,n=Math.round(dur*fps);
const dir=path.join(path.dirname(out),'.frames-'+path.basename(out));fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve(html));await p.waitForFunction('window.DONE===true');
for(let i=0;i<n;i++){await p.evaluate(t=>window.frame(t),i/fps);await p.screenshot({path:`${dir}/f${String(i).padStart(4,'0')}.png`});}
await b.close();execSync(`ffmpeg -y -loglevel error -framerate ${fps} -i ${dir}/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 ${out}`);
if(stills){for(const t of stills.split(',')){fs.copyFileSync(`${dir}/f${String(Math.round(t*fps)).padStart(4,'0')}.png`,out.replace('.mp4',`-t${t}.png`));}}
fs.rmSync(dir,{recursive:true,force:true});console.log('ok',n);})();
