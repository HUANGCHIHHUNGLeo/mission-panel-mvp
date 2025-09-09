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

// Problem area
const problemTitle=document.getElementById('problemTitle');
const problemBody=document.getElementById('problemBody');
const problemExplain=document.getElementById('problemExplain');
const problemMsg=document.getElementById('problemMsg');
const btnSubmitAns=document.getElementById('btnSubmitAns');
const btnClearAns=document.getElementById('btnClearAns');

// Avatar controls
const avatarInput=document.getElementById('avatarInput');
const btnApplyAvatar=document.getElementById('btnApplyAvatar');
const btnClearAvatar=document.getElementById('btnClearAvatar');

// Settings
const inputName=document.getElementById('inputName');
const selectRank=document.getElementById('selectRank');
const radarCanvas=document.getElementById('radar');
const profileSkillsList=document.getElementById('profileSkillsList');

// Shop & tasks controls
const btnRefreshDaily=document.getElementById('btnRefreshDaily');
const btnRerollSide=document.getElementById('btnRerollSide');
const btnBuy1=document.getElementById('btnBuy1');
const btnBuy5=document.getElementById('btnBuy5');

// ===== i18n =====
const I18N={
  zh:{ navDash:'任務面板', navChar:'角色介面', navProfile:'個人資料',
    notif:'通知', character:'角色概況', apply:'套用', resetAll:'重置所有資料', xp:'角色經驗',
    skills:'技能與經驗', problems:'作題區', startHint:'請從右側任務選擇一題開始作答',
    daily:'核心任務', dailySub:'（每日 20:00 刷新）', side:'日常任務', update:'更新',
    shop:'卡片 / 商城', shopDesc:'刷新卡可用於重新抽核心任務。升級與連續登入可獲得卡片。',
    profile:'個人資料', name:'姓名', grade:'年級', radar:'能力雷達圖',
    skillPanel:'技能一覽', clear:'清除', submit:'提交', applied:'已套用',
    confirmReset:'確定重製資料？', confirmResetEn:'Reset all data?',
    completed:'完成', begin:'開始', wrong:'答錯了，請再試一次', correct:'答對！已發放經驗值',
    coins:'金幣', cards:'刷新卡'
  },
  en:{ navDash:'Dashboard', navChar:'Character', navProfile:'Profile',
    notif:'Notifications', character:'Overview', apply:'Apply', resetAll:'Reset All Data',
    xp:'Character EXP', skills:'Skills & EXP', problems:'Problem Area',
    startHint:'Pick a task on the right to start.', daily:'Daily Core', dailySub:'(refresh 20:00)',
    side:'Side Quests', update:'Reroll', shop:'Cards / Shop',
    shopDesc:'Use refresh cards to reroll core tasks. Earn by leveling and login streaks.',
    profile:'Profile', name:'Name', grade:'Grade', radar:'Ability Radar',
    skillPanel:'Skills', clear:'Clear', submit:'Submit', applied:'Applied',
    confirmReset:'確定重製資料？', confirmResetEn:'Reset all data?',
    completed:'Done', begin:'Start', wrong:'Incorrect, try again.',
    correct:'Correct! EXP granted.', coins:'Coins', cards:'Refresh Cards'
  }
};
function t(key){ return I18N[DB.lang][key]||key }
function getText(v){ if(!v) return ''; if(typeof v==='string') return v; return v[DB.lang]||v.zh||v.en||'' }

function renderI18n(){
  btnViewDashboard.textContent=t('navDash');
  btnViewCharacter.textContent=t('navChar');
  btnViewSettings.textContent=t('navProfile');
  document.getElementById('ttlNotif').textContent=t('notif');
  document.getElementById('hCharacter').textContent=t('character');
  if(btnApplyBottom) btnApplyBottom.textContent=t('apply');
  if(btnResetBottom) btnResetBottom.textContent=t('resetAll');
  document.getElementById('lblXP').textContent=t('xp');
  document.getElementById('hSkills').textContent=t('skills');
  document.getElementById('hProblems').textContent=t('problems');
  problemTitle.textContent=t('startHint');
  document.getElementById('hDaily').firstChild.textContent=t('daily')+' ';
  document.getElementById('hDailySub').textContent=t('dailySub');
  document.getElementById('hSide').firstChild.textContent=t('side')+' ';
  document.getElementById('btnRerollSide').textContent=t('update');
  document.getElementById('hShop').textContent=t('shop');
  document.getElementById('shopDesc').textContent=t('shopDesc');
  document.getElementById('hProfile').textContent=t('profile');
  document.getElementById('lblName').textContent=t('name');
  document.getElementById('lblGrade').textContent=t('grade');
  document.getElementById('lblRadar').textContent=t('radar');
  document.getElementById('lblSkillPanel').textContent=t('skillPanel');
  document.getElementById('btnClearAns').textContent=t('clear');
  document.getElementById('btnSubmitAns').textContent=t('submit');
}

function addNotif(msg){ DB.notifs.push(msg); renderNotifs(); save() }

// === Apply/Reset 在 Profile 頁面 ===
btnApplyBottom && (btnApplyBottom.onclick = () => {
  // 1. 存入 DB
  DB.me.name = (inputName.value || '').trim();
  const old = DB.me.cls;
  DB.me.cls = selectRank.value;

  if (DB.me.cls !== old) {
    addNotif(DB.lang === 'zh' ? `切換年級：${DB.me.cls}` : `Grade -> ${DB.me.cls}`);
  }

  // 2. 儲存 + 更新畫面
  save();
  updateAll();

  // 3. 彈出提示
  alert(DB.lang === 'zh' ? '已套用' : 'Applied');
});

btnResetBottom && (btnResetBottom.onclick=()=>{
  if(confirm(DB.lang==='zh'?t('confirmReset'):t('confirmResetEn'))){
    try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
    DB=JSON.parse(JSON.stringify(DEFAULT_DB)); save(); location.reload();
  }
});

// ===== Skills =====
const SKILL_NAMES={
  calc:{zh:'運算能力',en:'Arithmetic Skills'},
  geom:{zh:'幾何圖形與理解',en:'Geometry & Shapes'},
  algebra:{zh:'代數運用',en:'Algebra'},
  apply:{zh:'解題與應用能力',en:'Problem Application'}
};
const gradeSkillsKeys=['calc','geom','algebra','apply'];
function ensureSkills(){
  gradeSkillsKeys.forEach(k=>{
    if(!DB.skills[k]) DB.skills[k]={name:SKILL_NAMES[k], xp:0, lvl:1, unlocked:true};
  });
}

// ===== Render (略部分代碼保持跟之前一致) =====
// …這裡保持原本 renderTop, renderMeta, renderSkills, renderProfileSkills, renderTasks, renderSide, updateAll

// ===== Views =====
function setActive(btn){ document.querySelectorAll('.navBtn').forEach(b=>b.classList.remove('active')); btn.classList.add('active') }
btnViewDashboard.onclick=()=>{ viewDashboard.classList.remove('hidden'); viewCharacter.classList.add('hidden'); viewSettings.classList.add('hidden'); setActive(btnViewDashboard) }
btnViewCharacter.onclick=()=>{ viewDashboard.classList.add('hidden'); viewCharacter.classList.remove('hidden'); viewSettings.classList.add('hidden'); setActive(btnViewCharacter); applyAvatar() }
btnViewSettings.onclick=()=>{ viewDashboard.classList.add('hidden'); viewCharacter.classList.add('hidden'); viewSettings.classList.remove('hidden'); setActive(btnViewSettings); renderSettings(); drawRadar(); renderProfileSkills(); }

// ===== Avatar Upload =====
avatarInput && (avatarInput.onchange=(e)=>{
  const file=e.target.files&&e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=(ev)=>{ DB.me.avatarImg=ev.target.result; save(); addNotif(DB.lang==='zh'?'已載入角色圖片（尚未套用）':'Image loaded (not applied)') };
  reader.readAsDataURL(file);
});
btnApplyAvatar && (btnApplyAvatar.onclick=()=>{ if(DB.me.avatarImg){ addNotif(DB.lang==='zh'?'角色圖片已套用':'Avatar applied'); applyAvatar(); } else { addNotif(DB.lang==='zh'?'尚未選擇圖片':'No image selected'); } });
btnClearAvatar && (btnClearAvatar.onclick=()=>{ DB.me.avatarImg=null; save(); applyAvatar(); addNotif(DB.lang==='zh'?'已移除自訂圖片':'Custom image removed'); });
function applyAvatar(){ if(DB.me.avatarImg){ avatarImg.src=DB.me.avatarImg; avatarImg.classList.remove('hidden'); avatarSVG.classList.add('hidden'); } else { avatarImg.src=''; avatarImg.classList.add('hidden'); avatarSVG.classList.remove('hidden'); } }

// ===== Init =====
function ensureInitial(){ ensureSkills(); if(DB.tasks.length===0){} if(DB.side.length===0){} applyAvatar(); }
function start(){ ensureInitial(); updateAll(); }
start();
