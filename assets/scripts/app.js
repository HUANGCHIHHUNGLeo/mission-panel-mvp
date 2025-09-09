// ===== Storage helper =====
const STORAGE_KEY='one_prof_mvp_v04_math_fix';
const SafeStore=(function(){
  let ok=true;
  try{
    const t='__t'+Math.random();
    localStorage.setItem(t,'1'); localStorage.removeItem(t);
  }catch(e){ ok=false }
  let mem=null;
  return{
    load(k){ try{return ok?JSON.parse(localStorage.getItem(k)||'null'):(mem?JSON.parse(mem):null)}catch(e){return null}},
    save(k,v){ try{ ok?localStorage.setItem(k,JSON.stringify(v)):(mem=JSON.stringify(v)) }catch(e){} }
  }
})();

// ===== Level curve =====
function needFor(level){ return 100 + (Math.max(1, level)-1)*20 }

// ===== DB =====
const DEFAULT_DB={
  lang:'zh',
  me:{name:'',title:'學生',cls:'五年級',level:1,exp:0,coins:200,avatarImg:null},
  cards:{refresh:2},
  login:{streak:0,last:0},
  notifs:['歡迎來到學習任務面板！'],
  skills:{},
  tasks:[],
  side:[],
  history:[],
  ui:{skillPct:{}},
  currentQ:null
};
let DB=SafeStore.load(STORAGE_KEY)||JSON.parse(JSON.stringify(DEFAULT_DB));
function save(){ SafeStore.save(STORAGE_KEY,DB) }

// ===== Elements =====
const viewDashboard=document.getElementById('viewDashboard');
const viewCharacter=document.getElementById('viewCharacter');
const viewSettings=document.getElementById('viewSettings');
const btnViewDashboard=document.getElementById('btnViewDashboard');
const btnViewCharacter=document.getElementById('btnViewCharacter');
const btnViewSettings=document.getElementById('btnViewSettings');

const chipUser=document.getElementById('chipUser');
const chipCoins=document.getElementById('chipCoins');
const chipCards=document.getElementById('chipCards');
const notifMain=document.getElementById('notifMain');
const meta=document.getElementById('meta');
const charXP=document.getElementById('charXP');
const charXPWrap=document.getElementById('charXPWrap');
const charXPNum=document.getElementById('charXPNum');
const skillsBox=document.getElementById('skills');
const tasksBox=document.getElementById('tasks');
const sideBox=document.getElementById('side');
const btnLang=document.getElementById('btnLang');
const cardCountA=document.getElementById('cardCountA');
const avatarImg=document.getElementById('avatarImg');
const avatarSVG=document.getElementById('avatarSVG');

// 個人資料按鈕
const btnApplyBottom=document.getElementById('btnApplyBottom');
const btnResetBottom=document.getElementById('btnResetBottom');

// Settings
const inputName=document.getElementById('inputName');
const selectRank=document.getElementById('selectRank');
const radarCanvas=document.getElementById('radar');
const profileSkillsList=document.getElementById('profileSkillsList');

// ===== i18n =====
const I18N={ zh:{ apply:'套用', resetAll:'重置所有資料', applied:'已套用', confirmReset:'確定重製資料？', coins:'金幣', cards:'刷新卡' },
              en:{ apply:'Apply', resetAll:'Reset All Data', applied:'Applied', confirmReset:'Reset all data?', coins:'Coins', cards:'Cards' } };
function t(key){ return I18N[DB.lang][key]||key }
function addNotif(msg){ DB.notifs.push(msg); renderNotifs(); save() }

// ===== Skills =====
const SKILL_NAMES={
  calc:{zh:'運算能力',en:'Arithmetic'},
  geom:{zh:'幾何圖形與理解',en:'Geometry'},
  algebra:{zh:'代數運用',en:'Algebra'},
  apply:{zh:'解題與應用能力',en:'Problem Solving'}
};
const gradeSkillsKeys=['calc','geom','algebra','apply'];
function ensureSkills(){
  gradeSkillsKeys.forEach(k=>{
    if(!DB.skills[k]) DB.skills[k]={name:SKILL_NAMES[k], xp:0, lvl:1, unlocked:true};
  });
}

// ===== Render =====
function renderTop(){
  const need=needFor(DB.me.level);
  const pct=Math.round((DB.me.exp/need)*100);
  chipUser.textContent=`Lv.${DB.me.level} / ${pct}%`;
  chipCoins.textContent=`${t('coins')} ${DB.me.coins}`;
  chipCards.textContent=`${t('cards')} x${DB.cards.refresh}`;
  cardCountA.textContent=DB.cards.refresh;
}
function renderMeta(){
  meta.innerHTML='';
  [['姓名',DB.me.name||'-'],['身分',DB.me.title],['年級',DB.me.cls||'-'],['Lv.',DB.me.level]].forEach(([k,v])=>{
    const d=document.createElement('div'); d.innerHTML=`<span>${k}</span><strong>${v}</strong>`; meta.appendChild(d);
  });
  const need=needFor(DB.me.level);
  const pct=Math.round((DB.me.exp/need)*100);
  charXP.dataset.w=pct; charXPNum.textContent=pct+'%';
}
function renderNotifs(){ notifMain.innerHTML=''; DB.notifs.slice(-3).forEach(n=>{const li=document.createElement('li'); li.textContent=n; notifMain.appendChild(li)}) }
function renderSkills(){
  skillsBox.innerHTML='';
  Object.entries(DB.skills).forEach(([k,s])=>{
    const row=document.createElement('div'); row.className='stat';
    row.innerHTML=`<div class="skillName">${s.name.zh} <span class="lv">Lv${s.lvl}</span></div><div class="val xpGold">${s.xp}%</div>`;
    skillsBox.appendChild(row);
  });
}
function renderProfileSkills(){
  profileSkillsList.innerHTML='';
  Object.entries(DB.skills).forEach(([k,s])=>{
    const div=document.createElement('div');
    div.textContent=`${s.name.zh} Lv${s.lvl} (${s.xp}%)`;
    profileSkillsList.appendChild(div);
  });
}
function drawRadar(){
  const c=radarCanvas; if(!c) return;
  const ctx=c.getContext('2d'); const w=c.width,h=c.height;
  ctx.clearRect(0,0,w,h);
  const cx=w/2,cy=h/2; const R=Math.min(w,h)/2-30;
  const N=gradeSkillsKeys.length;
  const values=gradeSkillsKeys.map(k=>Math.min(1,(DB.skills[k]?.lvl||1)/5));
  ctx.strokeStyle='#62c8ff55'; ctx.fillStyle='#62c8ff22'; ctx.lineWidth=1;
  for(let ring=1;ring<=4;ring++){
    const r=R*ring/4; ctx.beginPath();
    for(let i=0;i<N;i++){const ang=-Math.PI/2+i*2*Math.PI/N; const x=cx+r*Math.cos(ang),y=cy+r*Math.sin(ang); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);}
    ctx.closePath(); ctx.stroke();
  }
  ctx.beginPath();
  values.forEach((v,i)=>{const ang=-Math.PI/2+i*2*Math.PI/N; const r=R*v; const x=cx+r*Math.cos(ang),y=cy+r*Math.sin(ang); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);});
  ctx.closePath(); ctx.fill(); ctx.stroke();
}
function renderSettings(){
  inputName.value=DB.me.name||''; selectRank.value=DB.me.cls||'五年級';
  const metaS=document.getElementById('metaSettings'); metaS.innerHTML='';
  [['金幣',DB.me.coins],['刷新卡',DB.cards.refresh],['登入連續天數',DB.login.streak]].forEach(([k,v])=>{
    const d=document.createElement('div'); d.className='chip'; d.textContent=`${k}: ${v}`; metaS.appendChild(d);
  });
}
function updateAll(){ renderTop(); renderMeta(); renderSkills(); renderNotifs(); renderProfileSkills(); drawRadar(); save(); }

// ===== Apply/Reset =====
btnApplyBottom && (btnApplyBottom.onclick=()=>{
  DB.me.name=(inputName.value||'').trim();
  DB.me.cls=selectRank.value;
  save(); updateAll(); renderSettings();
  addNotif(t('applied'));
});
btnResetBottom && (btnResetBottom.onclick=()=>{
  if(confirm(t('confirmReset'))){
    try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
    DB=JSON.parse(JSON.stringify(DEFAULT_DB)); save(); location.reload();
  }
});

// ===== Views =====
function setActive(btn){ document.querySelectorAll('.navBtn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }
btnViewDashboard.onclick=()=>{ viewDashboard.classList.remove('hidden'); viewCharacter.classList.add('hidden'); viewSettings.classList.add('hidden'); setActive(btnViewDashboard) }
btnViewCharacter.onclick=()=>{ viewDashboard.classList.add('hidden'); viewCharacter.classList.remove('hidden'); viewSettings.classList.add('hidden'); setActive(btnViewCharacter) }
btnViewSettings.onclick=()=>{ viewDashboard.classList.add('hidden'); viewCharacter.classList.add('hidden'); viewSettings.classList.remove('hidden'); setActive(btnViewSettings); renderSettings(); drawRadar(); renderProfileSkills(); }

// ===== Init =====
function ensureInitial(){ ensureSkills(); }
function start(){ ensureInitial(); updateAll(); renderSettings(); }
start();
