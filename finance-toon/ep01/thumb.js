SC.thumb=(t,b)=>{X.drawImage(BOARD,0,0);
 X.save();X.translate(1380,700);X.scale(1.35,1.35);X.translate(-960,-540);const d=dave(5,[[0,'scared']],{});d.arms();X.restore();
 penny(5,1700,1060,1.3,[[0,'shout']]);
 at(560,250,1,-.04,()=>{X.font='190px Anton';const w=X.measureText('7 MONEY').width+80;rr(-w/2,-120,w,240,20);sh(INK,0);txt('7 MONEY',0,8,190,YEL)});
 at(560,520,1,-.04,()=>{txt('RULES',0,0,230,INK)});
 at(560,800,1,.03,()=>{X.font='86px Anton';const w=X.measureText('NOBODY TAUGHT YOU').width+60;rr(-w/2,-62,w,124,16);sh(RED,0);txt('NOBODY TAUGHT YOU',0,5,86,'#fff')});
 at(1080,180,1,.15,()=>{D.coin()});};
