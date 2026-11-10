const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const { SUPABASE_URL, SUPABASE_KEY } = process.env;
const PORT = process.env.PORT || 3000;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/messages', async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('id, content, created_at')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(100);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/messages', async (req, res) => {
  const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';
  if (!content) return res.status(400).json({ error: 'content is required' });
  if (content.length > 500) return res.status(400).json({ error: 'content too long (max 500)' });
  const { data, error } = await supabase
    .from('messages')
    .insert({ content })
    .select('id, content, created_at')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.listen(PORT, () => console.log(`stack-demo backend listening on port ${PORT}`));
