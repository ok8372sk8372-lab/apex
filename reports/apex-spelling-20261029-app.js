
(function(){
"use strict";
const root=document.body;
const target=document.getElementById("questionsGrid");
const details=document.getElementById("questionDetails");
const wrong=new Set((root.dataset.wrong||"").split(",").map(Number).filter(Boolean));
const names=["사이시옷·사잇소리","된소리·발음 표기","형태·원형 표기","총칙·맞춤법 적용"];
function add(parent,tag,cls,value){
 const e=document.createElement(tag); if(cls)e.className=cls;
 if(value!==undefined)e.textContent=value;parent.appendChild(e);return e;
}
function question(q){
 const [n,g,title,focus,basis,practice]=q,bad=wrong.has(n);
 const link=add(target,"a","q"+(bad?" wrong":""),String(n).padStart(2,"0"));
 link.href="#d-"+n;link.setAttribute("aria-label",n+"번 "+(bad?"오답":"정답")+" 상세 분석");
 const panel=add(details,"article","details-panel");panel.id="d-"+n;
 const tags=add(panel,"div","detail-top");
 add(tags,"span","tag"+(bad?" bad":""),n+"번");
 add(tags,"span","tag"+(bad?" bad":""),bad?"오답":"정답");
 add(tags,"span","tag",names[g]);
 add(panel,"h3","",title);
 add(panel,"div","detail-label","① 출제 포인트");
 add(panel,"p","detail-text",focus);
 add(panel,"div","detail-label","② 핵심 판단 근거");
 add(panel,"p","detail-text",basis);
 add(panel,"div","detail-label",bad?"③ 보완 학습 방향":"③ 심화·유지 학습");
 add(panel,"p","detail-text",practice);
 if(bad){
  const follow=add(panel,"a","assignment-detail-link","이 문항의 보완 학습 계획 보기");
  follow.href="#plan-"+n;
 }
 add(panel,"div","detail-foot",bad?"오답으로 기록된 문항입니다. 선택 답안이 없어 구체적인 오답 원인은 단정하지 않았습니다.":"정답으로 기록된 문항입니다. 선택 근거를 설명하는 추가 점검을 권장합니다.");
 const close=add(panel,"a","detail-close","접기 ×");close.href="#questions";
}
function fill(data){
 if(!Array.isArray(data)||data.length!==22)throw Error("문항 데이터 검증 실패");
 data.forEach(question);
 const plans=document.getElementById("plans");
 let order=0;
 data.filter(q=>wrong.has(q[0])).forEach(q=>{
  const [n,g,title,focus,basis,practice]=q;
  const card=add(plans,"article","card plan-card");card.id="plan-"+n;
  add(card,"span","rank","보완 "+(++order)+" · "+n+"번 문항");
  add(card,"h3","",title);add(card,"p","",practice);
 });
 const rows=document.getElementById("printRows");
 data.forEach(q=>{
  const tr=add(rows,"tr");
  add(tr,"td","",q[0]);add(tr,"td","",q[2]);
  add(tr,"td","",wrong.has(q[0])?"오답":"정답");
 });
}
fetch("./apex-spelling-20261029-data.json",{cache:"no-cache"})
 .then(r=>{if(!r.ok)throw Error("학습 데이터 응답 오류");return r.json()})
 .then(fill)
 .catch(()=>{target.textContent="문항별 분석을 불러오지 못했습니다. 페이지를 다시 열어 주세요.";});
})();
