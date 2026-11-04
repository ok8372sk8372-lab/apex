(function(){
"use strict";
const bad=new Set((document.body.dataset.wrong||"").split(",").map(Number).filter(Boolean));
const grid=document.getElementById("questionsGrid");
const details=document.getElementById("questionDetails");
const plan=document.getElementById("plans");
const rows=document.getElementById("printRows");
const notice=document.getElementById("dataError");
const groups=["고전시가·시어 해석","고전시가·표현 비교","현대시·농무 분석","작품 간 비교·서술"];
function add(p,tag,cls,t){const e=document.createElement(tag);if(cls)e.className=cls;if(t!==undefined)e.textContent=t;p.appendChild(e);return e;}
function show(q){
 const [n,g,title,point,evidence,practice]=q;
 grid.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(Number(b.dataset.n)===n)));
 details.replaceChildren();
 const tags=add(details,"div","detail-top");
 add(tags,"span","tag"+(bad.has(n)?" bad":""),n+"번");
 add(tags,"span","tag"+(bad.has(n)?" bad":""),bad.has(n)?"오답":"정답");
 add(tags,"span","tag",groups[g]);
 add(details,"h3","",title);
 add(details,"div","detail-label","① 출제 포인트");
 add(details,"p","detail-text",point);
 add(details,"div","detail-label","② 핵심 판단 근거");
 add(details,"p","detail-text",evidence);
 add(details,"div","detail-label",bad.has(n)?"③ 보완 학습 제안":"③ 심화·유지 학습");
 add(details,"p","detail-text",practice);
 if(bad.has(n)){
  const l=add(details,"button","assignment-detail-link","이 문항의 보완 학습 계획 보기");
  l.type="button";
  l.addEventListener("click",()=>{const p=document.getElementById("plan-"+n);if(p)p.scrollIntoView({behavior:"smooth",block:"center"});});
 }
 add(details,"div","detail-foot",bad.has(n)?"오답으로 기록된 문항입니다. 선택 답안이나 서술 응답이 제공되지 않아 실제 오답 원인을 단정하지 않았습니다.":"정답으로 기록된 문항입니다. 정답 여부만으로 실제 풀이 근거까지 확인된 것은 아닙니다.");
 details.hidden=false;
 if(window.matchMedia("(max-width:760px)").matches)details.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function render(Q){
 if(Q.length!==33||Q.some((x,i)=>x[0]!==i+1))throw Error("문항 수 또는 번호 오류");
 grid.replaceChildren();details.replaceChildren();details.hidden=true;plan.replaceChildren();rows.replaceChildren();
 for(const q of Q){
  const n=q[0],w=bad.has(n);
  const b=add(grid,"button","q"+(w?" wrong":""),String(n).padStart(2,"0"));
  b.type="button";b.dataset.n=String(n);b.setAttribute("aria-pressed","false");
  b.setAttribute("aria-label",n+"번 "+(w?"오답":"정답")+" 상세 분석");
  b.addEventListener("click",()=>show(q));
  const tr=add(rows,"tr");add(tr,"td","",String(n));add(tr,"td","",q[2]);add(tr,"td","",w?"오답":"정답");
 }
 let i=0;
 for(const q of Q.filter(x=>bad.has(x[0]))){
  const c=add(plan,"article","card plan-card");c.id="plan-"+q[0];
  add(c,"span","rank","보완 "+(++i)+" · "+q[0]+"번 문항");
  add(c,"h3","",q[2]);add(c,"p","",q[5]);
 }
 notice.hidden=true;
}
Promise.all(["./apex-whimoon-20261104-a.json","./apex-whimoon-20261104-b.json"].map(url=>fetch(url,{cache:"no-cache"}).then(r=>{if(!r.ok)throw Error("자료 응답 오류");return r.json();})))
 .then(parts=>render(parts.flat()))
 .catch(()=>{notice.textContent="문항별 분석을 표시하지 못했습니다. 페이지를 새로고침해 주세요.";notice.hidden=false;});
})();