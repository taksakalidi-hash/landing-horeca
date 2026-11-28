SC.banner=(t,b)=>{X.drawImage(BOARD,0,0);
 for(let i=0;i<60;i++){const h=Math.sin(i*91.7)*43758.5,h2=Math.sin(i*12.9)*24634.6;const x=(h-Math.floor(h))*1920,y=(h2-Math.floor(h2))*1080;if(x>280&&x<1640&&y>320&&y<770)continue;at(x,y,.8+(i%3)*.25,(i%5)*.3,()=>i%3?D.coin():bill(0,0,1,i))}
 penny(5,460,660,1.0,[[0,'smug']]);
 X.save();X.translate(1470,540);ell(0,0,118,118);sh('#fff',8);ell(0,0,108,108);X.clip();X.scale(.37,.37);X.translate(-960,-470);X.fillStyle='#cfe3d8';X.fillRect(0,0,1920,1080);const d=dave(5,[[0,'happy']],{});d.arms();X.restore();ell(1470,540,108,108);sh(null,8);
 at(960,480,1,-.02,()=>{X.font='100px Anton';const w=X.measureText('MONEY WITH PENNY').width+70;rr(-w/2,-70,w,140,18);sh(INK,0);txt('MONEY WITH PENNY',0,6,100,YEL)});
 txt('MONEY RULES EXPLAINED WITH CARTOONS',960,600,40,INK);txt('NEW EPISODE EVERY WEEK',960,668,34,RED);};
function bill(x,y,s,t){X.save();X.translate(x,y);X.scale(s,s);rr(-62,-32,124,64,6);sh('#8fc77a',6);rr(-50,-22,100,44,4);sh(null,3,'#4e8a3d');ell(0,0,18,18);sh('#cfe8c0',3);txt('$',0,2,26,'#2f6a2a');X.restore()}
SC.avatar=(t,b)=>{X.fillStyle=YEL;X.fillRect(0,0,1920,1080);const g=X.createRadialGradient(960,540,100,960,540,560);g.addColorStop(0,'#ffe27a');g.addColorStop(1,'#f2b81c');X.fillStyle=g;X.fillRect(420,0,1080,1080);
 for(let i=0;i<8;i++){const a=i*Math.PI/4+.3;at(960+Math.cos(a)*400,540+Math.sin(a)*400,.9,a,()=>D.coin())}
 penny(5,975,800,3.1,[[0,'smug']]);};
