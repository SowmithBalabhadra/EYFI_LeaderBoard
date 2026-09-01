const express=require('express');
const fs=require('fs');
const path=require('path');
const app=express();
const PORT=process.env.PORT||3000;
const DATA_PATH=path.join(__dirname,'mock-data.json');
const data=JSON.parse(fs.readFileSync(DATA_PATH,'utf8'));
app.use(express.json());
app.use(express.static(path.join(__dirname,'../frontend')));
function ranked(filter='overall'){
  const pool=data.participants.filter(p=>filter==='overall'?true:filter==='solo'?!p.team:p.team);
  const today=[...pool].sort((a,b)=>b.amt-a.amt), yesterday=[...pool].sort((a,b)=>b.yesterdayAmt-a.yesterdayAmt), prev={};
  yesterday.forEach((p,i)=>prev[p.id]=i+1);
  return today.map((p,i)=>({...p,rank:i+1,prevRank:prev[p.id]||i+1}));
}
app.get('/api/leaderboard',(req,res)=>{const filter=['overall','solo','team'].includes(req.query.filter)?req.query.filter:'overall';res.json({challenge:data.challenge,filter,participants:ranked(filter),updatedAt:new Date().toISOString()});});
app.get('/api/stats',(req,res)=>{const list=ranked();res.json({totalEarned:list.reduce((s,p)=>s+p.amt,0),earners:list.length,currentDay:data.challenge.currentDay,totalDays:data.challenge.totalDays,updatedAt:new Date().toISOString()});});
app.get('/api/participants/:id',(req,res)=>{const p=data.participants.find(x=>String(x.id)===req.params.id);if(!p)return res.status(404).json({error:'Participant not found'});res.json(ranked().find(x=>x.id===p.id));});
app.post('/api/earnings',(req,res)=>{const id=Number(req.body.participantId),amount=Number(req.body.amount);if(!Number.isFinite(amount)||amount<=0)return res.status(400).json({error:'Amount must be greater than zero.'});const p=data.participants.find(x=>x.id===id);if(!p)return res.status(404).json({error:'Participant not found'});const before=ranked().find(x=>x.id===id);p.yesterdayAmt=p.amt;p.amt+=amount;p.streak+=1;const after=ranked().find(x=>x.id===id);fs.writeFileSync(DATA_PATH,JSON.stringify(data,null,2));res.json({participant:after,previousRank:before.rank,newRank:after.rank,overtaken:Math.max(0,before.rank-after.rank),participants:ranked(),updatedAt:new Date().toISOString()});});
app.listen(PORT,()=>console.log(`EYFI Leaderboard running at http://localhost:${PORT}`));
