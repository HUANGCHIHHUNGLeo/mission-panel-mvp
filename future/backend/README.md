# 後端 API 規劃（預留）
建議先用伺服器（或 Serverless）提供這些路由：
- `GET /api/profile` → 取得/同步使用者資料
- `POST /api/answer` → 回傳是否正確、給分數與解析
- `POST /api/ai/chat` → 與 AI 對話代理（由後端代簽名呼叫供應商）

安全性：
- 任何金鑰都放後端，前端僅拿 token。
- CORS 與速率限制（Rate Limit）。
- 依租戶/學校加入 `tenantId` 命名空間。
