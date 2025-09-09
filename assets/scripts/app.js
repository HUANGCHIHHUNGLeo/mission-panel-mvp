// ===== Storage helper =====
const STORAGE_KEY = 'one_prof_mvp_v06_full';
const SafeStore = (function () {
  let ok = true;
  try {
    const t = '__t' + Math.random();
    localStorage.setItem(t, '1'); localStorage.removeItem(t);
  } catch (e) { ok = false; }
  let mem = null;
  return {
    load(k) { try { return ok ? JSON.parse(localStorage.getItem(k) || 'null') : (mem ? JSON.parse(mem) : null); } catch (e) { return null } },
    save(k, v) { try { ok ? localStorage.setItem(k, JSON.stringify(v)) : (mem = JSON.stringify(v)); } catch (e) {} }
  }
})();

// ===== Level curve =====
function needFor(level) { return 100 + (Math.max(1, level) - 1) * 20 }

// ===== DB =====
const DEFAULT_DB = {
  lang: 'zh',
  me: { name: '', title: '學生', cls: '五年級', level: 1, exp: 0, coins: 200, avatarImg: null },
  cards: { refresh: 2 },
  login: { streak: 0, last: 0 },
  notifs: ['歡迎來到學習任務面板！'],
  skills: {},
  tasks: [{title:{zh:"比例：10是20的幾分之幾？",en:"Ratio: 10 is what fraction of 20?"},exp:12}],
  side: [{title:{zh:"心算：8-5=?",en:"Mental: 8-5=?"},exp:8}],
  history: [],
  ui: { skillPct: {} },
  currentQ: null
};
let DB = SafeStore.load(STORAGE_KEY) || JSON.parse(JSON.stringify(DEFAULT_DB));
function save() { SafeStore.save(STORAGE_KEY, DB); }

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
const charXPNum=document.getElementById('charXPNum');
const skillsBox=document.getElementById('skills');
const btnLang=document.getElementById('btnLang');
const cardCountA=document.getElementById('cardCountA');
const avatarImg=document.getElementById('avatarImg');
const avatarSVG=document.getElementById('avatarSVG');
// Profile
const btnApplyBottom=document.getElementById('btnApplyBottom');
const btnResetBottom=document.getElementById('btnResetBottom');
const inputName=document.getElementById('inputName');
const selectRank=document.getElementById('selectRank');
const radarCanvas=document.getElementById('radar');
const profileSkillsList=document.getElementById('profileSkillsList');
// Tasks
const tasksBox=document.getElementById('tasks');
const sideBox=document.getElementById('side');
const btnRefreshDaily=document.getElementById('btnRefreshDaily');
const btnRerollSide=document.getElementById('btnRerollSide');
const btnBuy1=document.getElementById('btnBuy1');
const btnBuy5=document.getElementById('btnBuy5');

// ===== i18n =====
const I18N = {
  zh:{ coins:'金幣', cards:'刷新卡', applied:'已套用', confirmReset:'確定重製資料？' },
  en:{ coins:'Coins', cards:'Refresh Cards', applied:'Applied', confirmReset:'Reset all data?' }
};
function t(key){ return I18N[DB.lang][key]||key }
function getText(v){ if(!v) return ''; if(typeof v==='string') return v; return v[DB.lang]||v.zh||v.en||'' }

// ===== Skills =====
const SKILL_NAMES={ calc:{zh:'運算能力',en:'Arithmetic'}, geom:{zh:'幾何圖形與理解',en:'Geometry'}, algebra:{zh:'代數運用',en:'Algebra'}, apply:{zh:'解題與應用能力',en:'Problem Solving'} };
const gradeSkillsKeys=['calc','geom','algebra','apply'];
function ensureSkills(){ gradeSkillsKeys.forEach(k=>{ if(!DB.skills[k]) DB.skills[k]={name:SKILL_NAMES[k], xp:0, lvl:1, unlocked:true}; }); }

// ===== Renders =====
function renderTop(){
  chipUser.textContent=`Lv.${DB.me.level} / ${Math.floor((DB.me.exp/needFor(DB.me.level))*100)}%`;
  chipCoins.textContent=`${t('coins')} ${DB.me.coins}`;
  chipCards.textContent=`${t('cards')} x${DB.cards.refresh}`;
}
function renderMeta(){
  meta.innerHTML=`
    <div><span>姓名</span><strong>${DB.me.name||'-'}</strong></div>
    <div><span>身分</span><strong>${DB.me.title}</strong></div>
    <div><span>年級</span><strong>${DB.me.cls}</strong></div>
    <div><span>Lv.</span><strong>${DB.me.level}</strong></div>`;
  const pct=Math.floor((DB.me.exp/needFor(DB.me.level))*100);
  charXP.style.width=pct+'%'; charXPNum.textContent=pct+'%';
}
function renderSkills(){
  skillsBox.innerHTML='';
  gradeSkillsKeys.forEach(k=>{
    const s=DB.skills[k]; const pct=Math.floor((s.xp/needFor(s.lvl))*100);
    const div=document.createElement('div');
    div.className='stat';
    div.innerHTML=`<span class="skillName">${s.name[DB.lang]} <span class="lv">Lv${s.lvl}</span></span>
    <div class="bar"><i style="width:${pct}%"></i></div><span class="val">${pct}%</span>`;
    skillsBox.appendChild(div);
  });
}
function renderProfileSkills(){
  profileSkillsList.innerHTML='';
  gradeSkillsKeys.forEach(k=>{
    const s=DB.skills[k]; const pct=Math.floor((s.xp/needFor(s.lvl))*100);
    const div=document.createElement('div');
    div.className='stat';
    div.innerHTML=`<span class="skillName">${s.name[DB.lang]} Lv${s.lvl}</span>
    <div class="bar"><i style="width:${pct}%"></i></div><span class="val">${pct}%</span>`;
    profileSkillsList.appendChild(div);
  });
}
function drawRadar(){
  const ctx=radarCanvas.getContext('2d');
  ctx.clearRect(0,0,radarCanvas.width,radarCanvas.height);
  const cx=radarCanvas.width/2, cy=radarCanvas.height/2, maxR=80;
  const values=gradeSkillsKeys.map(k=>DB.skills[k].xp/needFor(DB.skills[k].lvl));
  ctx.strokeStyle='#62c8ff55';
  // draw axes
  gradeSkillsKeys.forEach((k,i)=>{
    const angle=(Math.PI*2*i)/gradeSkillsKeys.length - Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(angle)*maxR, cy+Math.sin(angle)*maxR); ctx.stroke();
  });
  // draw polygon
  ctx.beginPath();
  values.forEach((v,i)=>{
    const angle=(Math.PI*2*i)/values.length - Math.PI/2;
    const r=maxR*v;
    const x=cx+Math.cos(angle)*r, y=cy+Math.sin(angle)*r;
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.closePath(); ctx.strokeStyle='#62c8ff'; ctx.stroke();
}
function renderTasks(){
  tasksBox.innerHTML='';
  DB.tasks.forEach(tk=>{
    const div=document.createElement('div');
    div.className='taskItem';
    div.innerHTML=`<span>${getText(tk.title)}</span><span>+${tk.exp} EXP</span>
      <button class="btn small">開始</button>`;
    div.querySelector('button').onclick=()=>alert(getText(tk.title));
    tasksBox.appendChild(div);
  });
}
function renderSide(){
  sideBox.innerHTML='';
  DB.side.forEach(tk=>{
    const div=document.createElement('div');
    div.className='taskItem';
    div.innerHTML=`<span>${getText(tk.title)}</span><span>+${tk.exp} EXP</span>
      <button class="btn small">開始</button>`;
    div.querySelector('button').onclick=()=>alert(getText(tk.title));
    sideBox.appendChild(div);
  });
}
function updateAll(){ renderTop(); renderMeta(); renderSkills(); renderProfileSkills(); drawRadar(); renderTasks(); renderSide(); }

// ===== Buttons =====
btnApplyBottom.onclick=()=>{
  DB.me.name=(inputName.value||'').trim(); DB.me.cls=selectRank.value;
  save(); updateAll();
  inputName.blur(); // 移除 focus 白底
  inputName.style.background="#0d2232"; // 強制回底色
  alert(t('applied'));
};
btnResetBottom.onclick=()=>{
  if(confirm(t('confirmReset'))){ localStorage.removeItem(STORAGE_KEY);
    DB=JSON.parse(JSON.stringify(DEFAULT_DB)); save(); location.reload(); }
};
btnLang.onclick=()=>{ DB.lang=DB.lang==='zh'?'en':'zh'; save(); updateAll(); };
btnRefreshDaily.onclick=()=>{ alert('刷新核心任務成功'); };
btnRerollSide.onclick=()=>{ alert('刷新日常任務成功'); };
btnBuy1.onclick=()=>{ if(DB.me.coins>=100){ DB.me.coins-=100; DB.cards.refresh+=1; save(); updateAll(); alert('買卡片x1'); } };
btnBuy5.onclick=()=>{ if(DB.me.coins>=450){ DB.me.coins-=450; DB.cards.refresh+=5; save(); updateAll(); alert('買卡片x5'); } };

// ===== Views =====
function setActive(btn){ document.querySelectorAll('.navBtn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }
btnViewDashboard.onclick=()=>{ viewDashboard.classList.remove('hidden'); viewCharacter.classList.add('hidden'); viewSettings.classList.add('hidden'); setActive(btnViewDashboard); updateAll(); }
btnViewCharacter.onclick=()=>{ viewDashboard.classList.add('hidden'); viewCharacter.classList.remove('hidden'); viewSettings.classList.add('hidden'); setActive(btnViewCharacter); }
btnViewSettings.onclick=()=>{ viewDashboard.classList.add('hidden'); viewCharacter.classList.add('hidden'); viewSettings.classList.remove('hidden'); setActive(btnViewSettings); updateAll(); }

// ===== Init =====
function ensureInitial(){ ensureSkills(); }
function start(){ ensureInitial(); updateAll(); }
start();
