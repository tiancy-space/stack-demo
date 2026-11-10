# stack-demo

最小端到端全栈 demo：Supabase（数据库）+ Render（后端）+ Cloudflare（前端），全部使用免费档。

## 结构

- `backend/`：Node 18+ / Express，读写 Supabase 的 `public.messages` 表
  - `GET /api/health` 健康检查
  - `GET /api/messages` 列出留言
  - `POST /api/messages` 新增留言，body：`{ "content": "..." }`
- `frontend/`：纯静态页面（`index.html` + `app.js`），后端地址写在 `app.js` 的 `API_BASE` 常量里

## 本地运行后端

```bash
cd backend
npm install
SUPABASE_URL=https://<ref>.supabase.co SUPABASE_KEY=<publishable-key> PORT=3000 node index.js
```

## 部署

- **Render**：Web Service，Root Directory `backend`，Build `npm install`，Start `node index.js`，免费规格；在 Render 环境变量中设置 `SUPABASE_URL`、`SUPABASE_KEY`。
- **Cloudflare**：把 `frontend/` 作为 Workers 静态资源 / Pages 部署。

密钥只放在环境变量里，不要提交进仓库（见 `.gitignore`）。

## 数据表

```sql
create table public.messages (
  id bigint generated always as identity primary key,
  content text not null,
  created_at timestamptz default now()
);
-- 已开启 RLS，demo 允许 anon select / insert
```

> 注意：Render 免费实例闲置 15 分钟后休眠，首次访问约需 30 秒唤醒。
