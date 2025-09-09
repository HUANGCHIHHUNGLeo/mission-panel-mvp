// ===== Storage helper =====
const STORAGE_KEY = 'one_prof_mvp_step1';
const SafeStore = (function () {
  let ok = true;
  try {
    const t = '__t' + Math.random();
    localStorage.setItem(t, '1');
    localStorage.removeItem(t);
  } catch (e) {
    ok = false;
  }
  let mem = null;
  return {
    load(k) {
      try {
        return ok
          ? JSON.parse(localStorage.getItem(k) || 'null')
          : mem
          ? JSON.parse(mem)
          : null;
      } catch (e) {
        return null;
      }
    },
    save(k, v) {
      try {
        ok
          ? localStorage.setItem(k, JSON.stringify(v))
          : (mem = JSON.stringify(v));
      } catch (e) {}
    },
  };
})();

// ===== Level curve =====
function needFor(level) {
  return 100 + (Math.max(1, level) - 1) * 20;
}

// ===== DB =====
const DEFAULT_DB = {
  lang: 'zh',
  me: {
    name: '',
    title: '學生',
    cls: '五年級',
    level: 1,
    exp: 0,
    coins: 200,
    avatarImg: null,
  },
  cards: { refresh: 2 },
  login: { streak: 0, last: 0 },
  notifs: ['歡迎來到學習任務面板！'],
  skills: {},
  tasks: [],
  side: [],
  history: [],
  ui: { skillPct: {} },
  currentQ: null,
};
let DB = SafeStore.load(STORAGE_KEY) || JSON.parse(JSON.stringify(DEFAULT_DB));
function save() {
  SafeStore.save(STORAGE_KEY, DB);
}

// ===== Elements =====
const viewDashboard = document.getElementById('viewDashboard');
const viewCharacter = document.getElementById('viewCharacter');
const viewSettings = document.getElementById('viewSettings');
const btnViewDashboard = document.getElementById('btnViewDashboard');
const btnViewCharacter = document.getElementById('btnViewCharacter');
const btnViewSettings = document.getElementById('btnViewSettings');

const chipUser = document.getElementById('chipUser');
const chipCoins = document.getElementById('chipCoins');
const chipCards = document.getElementById('chipCards');
const notifMain = document.getElementById('notifMain');
const meta = document.getElementById('meta');
const charXP = document.getElementById('charXP');
const charXPNum = document.getElementById('charXPNum');
const skillsBox = document.getElementById('skills');
const btnLang = document.getElementById('btnLang');
const cardCountA = document.getElementById('cardCountA');
const avatarImg = document.getElementById('avatarImg');
const avatarSVG = document.getElementById('avatarSVG');

// 個人資料
const btnApplyBottom = document.getElementById('btnApplyBottom');
const btnResetBottom = document.getElementById('btnResetBottom');
const inputName = document.getElementById('inputName');
const selectRank = document.getElementById('selectRank');
const radarCanvas = document.getElementById('radar');
const profileSkillsList = document.getElementById('profileSkillsList');

// ===== i18n =====
const I18N = {
  zh: {
    navDash: '任務面板',
    navChar: '角色介面',
    navProfile: '個人資料',
    notif: '通知',
    character: '角色概況',
    apply: '套用',
    resetAll: '重置所有資料',
    xp: '角色經驗',
    skills: '技能與經驗',
    problems: '作題區',
    startHint: '請從右側任務選擇一題開始作答',
    daily: '核心任務',
    dailySub: '（每日 20:00 刷新）',
    side: '日常任務',
    update: '更新',
    shop: '卡片 / 商城',
    shopDesc: '刷新卡可用於重新抽核心任務。升級與連續登入可獲得卡片。',
    profile: '個人資料',
    name: '姓名',
    grade: '年級',
    radar: '能力雷達圖',
    skillPanel: '技能一覽',
    applied: '已套用',
    confirmReset: '確定重製資料？',
    coins: '金幣',
    cards: '刷新卡',
  },
  en: {
    navDash: 'Dashboard',
    navChar: 'Character',
    navProfile: 'Profile',
    notif: 'Notifications',
    character: 'Overview',
    apply: 'Apply',
    resetAll: 'Reset All Data',
    xp: 'Character EXP',
    skills: 'Skills & EXP',
    problems: 'Problem Area',
    startHint: 'Pick a task on the right to start.',
    daily: 'Daily Core',
    dailySub: '(refresh 20:00)',
    side: 'Side Quests',
    update: 'Reroll',
    shop: 'Cards / Shop',
    shopDesc:
      'Use refresh cards to reroll core tasks. Earn by leveling and login streaks.',
    profile: 'Profile',
    name: 'Name',
    grade: 'Grade',
    radar: 'Ability Radar',
    skillPanel: 'Skills',
    applied: 'Applied',
    confirmReset: 'Reset all data?',
    coins: 'Coins',
    cards: 'Refresh Cards',
  },
};
function t(key) {
  return I18N[DB.lang][key] || key;
}

function renderI18n() {
  btnViewDashboard.textContent = t('navDash');
  btnViewCharacter.textContent = t('navChar');
  btnViewSettings.textContent = t('navProfile');
  document.getElementById('ttlNotif').textContent = t('notif');
  document.getElementById('hCharacter').textContent = t('character');
  btnApplyBottom.textContent = t('apply');
  btnResetBottom.textContent = t('resetAll');
  document.getElementById('lblXP').textContent = t('xp');
  document.getElementById('hSkills').textContent = t('skills');
  document.getElementById('hProblems').textContent = t('problems');
  document.getElementById('hDailySub').textContent = t('dailySub');
  document.getElementById('hShop').textContent = t('shop');
  document.getElementById('shopDesc').textContent = t('shopDesc');
  document.getElementById('hProfile').textContent = t('profile');
  document.getElementById('lblName').textContent = t('name');
  document.getElementById('lblGrade').textContent = t('grade');
  document.getElementById('lblRadar').textContent = t('radar');
  document.getElementById('lblSkillPanel').textContent = t('skillPanel');
}

// ===== Skills =====
const SKILL_NAMES = {
  calc: { zh: '運算能力', en: 'Arithmetic' },
  geom: { zh: '幾何圖形與理解', en: 'Geometry' },
  algebra: { zh: '代數運用', en: 'Algebra' },
  apply: { zh: '解題與應用能力', en: 'Problem Solving' },
};
const gradeSkillsKeys = ['calc', 'geom', 'algebra', 'apply'];

function ensureSkills() {
  gradeSkillsKeys.forEach((k) => {
    if (!DB.skills[k])
      DB.skills[k] = { name: SKILL_NAMES[k], xp: 0, lvl: 1, unlocked: true };
  });
}

// ===== Renders =====
function renderTop() {
  chipUser.textContent = `Lv.${DB.me.level} / ${Math.floor(
    (DB.me.exp / needFor(DB.me.level)) * 100
  )}%`;
  chipCoins.textContent = `${t('coins')} ${DB.me.coins}`;
  chipCards.textContent = `${t('cards')} x${DB.cards.refresh}`;
}

function renderMeta() {
  meta.innerHTML = `
    <div><span>${t('name')}</span><strong>${DB.me.name || '-'}</strong></div>
    <div><span>身分</span><strong>${DB.me.title}</strong></div>
    <div><span>${t('grade')}</span><strong>${DB.me.cls}</strong></div>
    <div><span>Lv.</span><strong>${DB.me.level}</strong></div>
  `;
  const pct = Math.floor((DB.me.exp / needFor(DB.me.level)) * 100);
  charXP.style.width = pct + '%';
  charXPNum.textContent = pct + '%';
}

function renderSkills() {
  skillsBox.innerHTML = '';
  gradeSkillsKeys.forEach((k) => {
    const s = DB.skills[k];
    const pct = Math.floor((s.xp / needFor(s.lvl)) * 100);
    const div = document.createElement('div');
    div.className = 'stat';
    div.innerHTML = `
      <span class="skillName">${s.name[DB.lang]} <span class="lv">Lv${s.lvl}</span></span>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <span class="val">${pct}%</span>
    `;
    skillsBox.appendChild(div);
  });
}

function renderProfileSkills() {
  profileSkillsList.innerHTML = '';
  gradeSkillsKeys.forEach((k) => {
    const s = DB.skills[k];
    const pct = Math.floor((s.xp / needFor(s.lvl)) * 100);
    const div = document.createElement('div');
    div.className = 'stat';
    div.innerHTML = `
      <span class="skillName">${s.name[DB.lang]} Lv${s.lvl}</span>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <span class="val">${pct}%</span>
    `;
    profileSkillsList.appendChild(div);
  });
}

function drawRadar() {
  const ctx = radarCanvas.getContext('2d');
  ctx.clearRect(0, 0, radarCanvas.width, radarCanvas.height);
  const centerX = radarCanvas.width / 2;
  const centerY = radarCanvas.height / 2;
  const maxR = 80;
  const values = gradeSkillsKeys.map(
    (k) => DB.skills[k].xp / needFor(DB.skills[k].lvl)
  );
  ctx.strokeStyle = '#62c8ff';
  ctx.beginPath();
  values.forEach((v, i) => {
    const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
    const r = maxR * v;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.stroke();
}

function updateAll() {
  renderTop();
  renderMeta();
  renderSkills();
  renderProfileSkills();
  drawRadar();
  renderI18n();
}

// ===== Buttons =====
btnApplyBottom.onclick = () => {
  DB.me.name = (inputName.value || '').trim();
  DB.me.cls = selectRank.value;
  save();
  updateAll();
  inputName.blur();
  alert(t('applied'));
};

btnResetBottom.onclick = () => {
  if (confirm(t('confirmReset'))) {
    localStorage.removeItem(STORAGE_KEY);
    DB = JSON.parse(JSON.stringify(DEFAULT_DB));
    save();
    location.reload();
  }
};

btnLang.onclick = () => {
  DB.lang = DB.lang === 'zh' ? 'en' : 'zh';
  save();
  updateAll();
};

// ===== Views =====
function setActive(btn) {
  document.querySelectorAll('.navBtn').forEach((b) =>
    b.classList.remove('active')
  );
  btn.classList.add('active');
}
btnViewDashboard.onclick = () => {
  viewDashboard.classList.remove('hidden');
  viewCharacter.classList.add('hidden');
  viewSettings.classList.add('hidden');
  setActive(btnViewDashboard);
  updateAll();
};
btnViewCharacter.onclick = () => {
  viewDashboard.classList.add('hidden');
  viewCharacter.classList.remove('hidden');
  viewSettings.classList.add('hidden');
  setActive(btnViewCharacter);
};
btnViewSettings.onclick = () => {
  viewDashboard.classList.add('hidden');
  viewCharacter.classList.add('hidden');
  viewSettings.classList.remove('hidden');
  setActive(btnViewSettings);
  updateAll();
};

// ===== Init =====
function ensureInitial() {
  ensureSkills();
}
function start() {
  ensureInitial();
  updateAll();
}
start();
