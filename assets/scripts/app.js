// ===== Storage helper =====
const STORAGE_KEY = 'one_prof_mvp_v06_final';
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
let DB =
  SafeStore.load(STORAGE_KEY) || JSON.parse(JSON.stringify(DEFAULT_DB));
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
const tasksBox = document.getElementById('tasks');
const sideBox = document.getElementById('side');
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

// ===== Skills =====
const SKILL_NAMES = {
  calc: { zh: '運算能力', en: 'Arithmetic' },
  geom: { zh: '幾何圖形與理解', en: 'Geometry' },
  algebra: { zh: '代數運用', en: 'Algebra' },
  apply: { zh: '解題與應用能力', en: 'Application' },
};
const gradeSkillsKeys = ['calc', 'geom', 'algebra', 'apply'];
function ensureSkills() {
  gradeSkillsKeys.forEach((k) => {
    if (!DB.skills[k])
      DB.skills[k] = {
        name: SKILL_NAMES[k],
        xp: 0,
        lvl: 1,
        unlocked: true,
      };
  });
}

// ===== Render =====
function renderTop() {
  const need = needFor(DB.me.level);
  const pct = Math.round((DB.me.exp / need) * 100);
  chipUser.textContent = `Lv.${DB.me.level} / ${pct}%`;
  chipCoins.textContent = `金幣 ${DB.me.coins}`;
  chipCards.textContent = `刷新卡 x${DB.cards.refresh}`;
  cardCountA.textContent = DB.cards.refresh;
}
function renderMeta() {
  meta.innerHTML = '';
  [['姓名', DB.me.name || '-'],
  ['身分', DB.me.title],
  ['年級', DB.me.cls || '五年級'],
  ['Lv.', DB.me.level]].forEach(([k, v]) => {
    const d = document.createElement('div');
    d.innerHTML = `<span>${k}</span><strong>${v}</strong>`;
    meta.appendChild(d);
  });
}
function renderSkills() {
  skillsBox.innerHTML = '';
  Object.entries(DB.skills).forEach(([key, s]) => {
    const pct = s.xp;
    const row = document.createElement('div');
    row.className = 'stat';
    row.innerHTML = `
      <div class="skillName">
        <span>${s.name.zh}</span><span class="lv">LV${s.lvl}</span>
      </div>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="val xpGold">${pct}%</div>
    `;
    skillsBox.appendChild(row);
  });
}
function renderProfileSkills() {
  profileSkillsList.innerHTML = '';
  Object.entries(DB.skills).forEach(([key, s]) => {
    const pct = s.xp;
    const row = document.createElement('div');
    row.className = 'stat';
    row.innerHTML = `
      <div class="skillName">
        <span>${s.name.zh}</span><span class="lv">LV${s.lvl}</span>
      </div>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="val xpGold">${pct}%</div>
    `;
    profileSkillsList.appendChild(row);
  });
}
function drawRadar() {
  if (!radarCanvas) return;
  const ctx = radarCanvas.getContext('2d');
  const w = radarCanvas.width, h = radarCanvas.height;
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2 + 10;
  const R = Math.min(w, h) / 2 - 32;
  const N = gradeSkillsKeys.length;
  const values = gradeSkillsKeys.map(
    (k) => Math.min(1, (DB.skills[k]?.xp || 0) / 100)
  );
  ctx.strokeStyle = '#62c8ff55';
  ctx.fillStyle = '#62c8ff16';
  for (let ring = 1; ring <= 4; ring++) {
    const r = (R * ring) / 4;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / N;
      const x = cx + r * Math.cos(ang),
        y = cy + r * Math.sin(ang);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  ctx.beginPath();
  values.forEach((v, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / N;
    const r = R * v;
    const x = cx + r * Math.cos(ang),
      y = cy + r * Math.sin(ang);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = '#62c8ff33';
  ctx.fill();
  ctx.strokeStyle = '#62c8ffcc';
  ctx.stroke();
}
function updateAll() {
  renderTop();
  renderMeta();
  renderSkills();
  renderProfileSkills();
  drawRadar();
  save();
}

// ===== Apply / Reset =====
btnApplyBottom &&
  (btnApplyBottom.onclick = () => {
    DB.me.name = (inputName.value || '').trim();
    DB.me.cls = selectRank.value;
    save();
    updateAll();
    alert('已套用');
  });
btnResetBottom &&
  (btnResetBottom.onclick = () => {
    if (confirm('確定重製資料？')) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      DB = JSON.parse(JSON.stringify(DEFAULT_DB));
      save();
      location.reload();
    }
  });

// ===== Views =====
function setActive(btn) {
  document
    .querySelectorAll('.navBtn')
    .forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
}
btnViewDashboard.onclick = () => {
  viewDashboard.classList.remove('hidden');
  viewCharacter.classList.add('hidden');
  viewSettings.classList.add('hidden');
  setActive(btnViewDashboard);
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

// ===== Avatar Upload =====
const avatarInput = document.getElementById('avatarInput');
const btnApplyAvatar = document.getElementById('btnApplyAvatar');
const btnClearAvatar = document.getElementById('btnClearAvatar');
function applyAvatar() {
  if (DB.me.avatarImg) {
    avatarImg.src = DB.me.avatarImg;
    avatarImg.classList.remove('hidden');
    avatarSVG.classList.add('hidden');
  } else {
    avatarImg.src = '';
    avatarImg.classList.add('hidden');
    avatarSVG.classList.remove('hidden');
  }
}
avatarInput &&
  (avatarInput.onchange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      DB.me.avatarImg = ev.target.result;
      save();
      applyAvatar();
    };
    reader.readAsDataURL(file);
  });
btnApplyAvatar &&
  (btnApplyAvatar.onclick = () => {
    applyAvatar();
    alert('角色圖片已套用');
  });
btnClearAvatar &&
  (btnClearAvatar.onclick = () => {
    DB.me.avatarImg = null;
    save();
    applyAvatar();
    alert('已移除自訂圖片');
  });

// ===== Init =====
function ensureInitial() {
  ensureSkills();
  applyAvatar();
}
function start() {
  ensureInitial();
  updateAll();
}
start();
