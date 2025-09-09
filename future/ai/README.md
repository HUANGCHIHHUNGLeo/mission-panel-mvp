# AI 介面設計（預留）
此資料夾先放規劃與封裝構想：
- 選擇供應商（OpenAI/Azure/Vertex/...）
- 前端不要存 API Key，請走你自己的後端簽名/代理。
- 介面建議：
  - `POST /api/ai/chat`  { messages: [...], sessionId }
  - `POST /api/ai/grade` { answer, questionId } → { correct, explain }
未來接上時，在 `assets/scripts/app.js` 中引用你的 SDK 或 fetch 後端即可。
