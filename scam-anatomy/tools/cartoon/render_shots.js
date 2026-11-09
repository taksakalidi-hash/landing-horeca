// node render_shots.js jobs.json outDir  -> renders each job {id,shot,frames} to outDir/<id>.mp4
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const {spawn}=require('child_process');
(async()=>{const jobs=JSON.parse(fs.readFileSync(process.argv[2]));const out=process.argv[3];
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve(__dirname,'engine.html'));await p.waitForFunction('window.DONE===true');
for(const j of jobs){const dst=path.join(out,j.id+'.mp4');if(fs.existsSync(dst)){continue;}
 const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','png','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r','30',dst+'.tmp.mp4']);
 await p.evaluate(s=>setup(s),j.shot);
 for(let i=0;i<j.frames;i++){await p.evaluate(t=>frame(t),i/30);const buf=await p.screenshot({type:'png'});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));fs.renameSync(dst+'.tmp.mp4',dst);console.log('seg',j.id,j.frames);}
await b.close();console.log('worker done');})();
