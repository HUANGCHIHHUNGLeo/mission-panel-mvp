# 任務面板 MVP（可直接部署 GitHub Pages）

這個版本把你的單一 HTML 拆成外部 **CSS** 與 **JS** 檔，UI 與功能完全一致。你可以直接把整個資料夾推上 GitHub，開啟 Pages 就能線上使用。

## 資料夾說明
```
mission-panel-mvp/
├─ index.html                 # 首頁（載入外部 CSS/JS）
├─ assets/
│  ├─ styles/
│  │  └─ main.css            # 原 <style> 內容
│  └─ scripts/
│     └─ app.js              # 原 <script> 內容
├─ future/                    # 預留：未來要接後端與 AI 的位置
│  ├─ ai/
│  │  └─ README.md           # 怎麼對接 AI 的說明（之後可放 SDK/封裝）
│  └─ backend/
│     └─ README.md           # 後端 API 設計草稿（路由/權限/資料格式）
└─ .github/
   └─ workflows/
      └─ deploy.yml          # GitHub Actions：自動部署到 Pages（可選）
```

> 新手最快做法：**不要動** 工作流，直接用 GitHub 的 **Settings → Pages → Build and deployment = GitHub Actions**。每次 push 到 `main`，會自動部署。

## 一步一步部署（超新手）
1. 登入 GitHub → 右上角 **+** → **New repository**。
2. Repository name 輸入 `mission-panel-mvp` → **Create repository**。
3. 在 repo 頁面按 **Add file → Upload files**，把整個資料夾的內容上傳（或使用 Git 指令）。
4. 上傳後到 **Settings → Pages**：
   - **Build and deployment** 選 **GitHub Actions**（我們已附 `deploy.yml`）。
5. 回到 **Actions** 頁籤，看到工作流成功後，**Settings → Pages** 會出現網站 URL。

## 本機預覽
直接雙擊 `index.html` 用瀏覽器開即可；或開啟本機伺服器：
- Python：`python3 -m http.server 5173`
- Node（任意工具）都可。

## 未來要接後端 / AI（預留位置）
- `future/backend/README.md`：先寫 API 規格（GET /api/profile、POST /api/answer …）
- `future/ai/README.md`：紀錄將來選用的 AI 供應商（OpenAI、Azure、Vertex…）與前端呼叫方式。
- 真正接上時，再在 `assets/scripts/app.js` 中引入封裝（例如 `import('./future/ai/sdk.js')` 或在這裡加一個 `fetch()` 呼叫）。
- 因為這個站目前是 **純前端**，請避免在前端放任何機密金鑰。

## 常見問題
- **為什麼重新整理會留下資料？** 因為使用 `localStorage` 存在瀏覽器本機。
- **要換語言？** 右上角 `中 / EN`。語系檔在 `app.js` 的 `I18N`。

祝順利部署！
