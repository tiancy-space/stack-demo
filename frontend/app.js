// 后端 API 地址（Render 部署后替换为线上地址）
const API_BASE = 'https://stack-demo-api.onrender.com';

const statusEl = document.getElementById('status');
const listEl = document.getElementById('list');
const form = document.getElementById('form');
const input = document.getElementById('content');

function render(messages) {
  listEl.innerHTML = '';
  for (const m of messages) {
    const li = document.createElement('li');
    li.textContent = m.content;
    const t = document.createElement('time');
    t.textContent = new Date(m.created_at).toLocaleString('zh-CN');
    li.appendChild(t);
    listEl.appendChild(li);
  }
}

async function load() {
  try {
    const res = await fetch(`${API_BASE}/api/messages`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    render(data);
    statusEl.textContent = `共 ${data.length} 条留言`;
  } catch (e) {
    statusEl.textContent = `加载失败：${e.message}`;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = input.value.trim();
  if (!content) return;
  statusEl.textContent = '发送中…';
  try {
    const res = await fetch(`${API_BASE}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error((await res.json()).error || `HTTP ${res.status}`);
    input.value = '';
    await load();
  } catch (e) {
    statusEl.textContent = `发送失败：${e.message}`;
  }
});

load();
