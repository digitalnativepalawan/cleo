// server/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import pkg from 'pg';

const { Pool } = pkg;

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' })); // allow base64 images in JSON
app.use(morgan('tiny'));

// -------- uploads: persistent disk + static serving --------
const UPLOAD_ROOT = process.env.UPLOAD_ROOT || '/uploads-disk'; // mount this disk in Sevalla
fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

// serve uploaded files at /files/<name>
app.use(
  '/files',
  express.static(UPLOAD_ROOT, { maxAge: '365d', index: false })
);

// if you want absolute URLs, set PUBLIC_BASE_URL to your app URL in Sevalla
function publicFileUrl(filename) {
  const base = (process.env.PUBLIC_BASE_URL || '').replace(/\/+$/, '');
  return base ? `${base}/files/${filename}` : `/files/${filename}`;
}

// -------- DB (unchanged) --------
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: process.env.DB_SSL === 'require' ? { rejectUnauthorized: false } : false,
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      task_name TEXT NOT NULL,
      type TEXT,
      status TEXT,
      owner TEXT,
      due_date DATE,
      cost NUMERIC DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS daily_rollups (
      id SERIAL PRIMARY KEY,
      day DATE UNIQUE,
      tasks_count INTEGER DEFAULT 0,
      labor_cost NUMERIC DEFAULT 0,
      materials_cost NUMERIC DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS materials (
      id SERIAL PRIMARY KEY,
      item_name TEXT NOT NULL,
      image_url TEXT,
      category TEXT,
      unit TEXT,
      quantity NUMERIC DEFAULT 0,
      unit_cost NUMERIC DEFAULT 0,
      total_cost NUMERIC DEFAULT 0,
      supplier TEXT,
      delivery_eta DATE,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}
init().catch(console.error);

// -------- health --------
app.get('/health', (_req, res) => res.json({ ok: true }));

// -------- NEW: base64 upload endpoint --------
app.post('/upload-base64', async (req, res) => {
  try {
    const { dataUrl } = req.body;
    if (!dataUrl || !dataUrl.startsWith('data:')) {
      return res.status(400).json({ error: 'Invalid dataUrl' });
    }

    // data:image/png;base64,AAAA...
    const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
    if (!match) return res.status(400).json({ error: 'Invalid dataUrl format' });

    const mime = match[1];
    const base64 = match[2];
    const buf = Buffer.from(base64, 'base64');

    const ext =
      mime === 'image/png' ? '.png' :
      mime === 'image/webp' ? '.webp' :
      '.jpg';

    const name = `img_${Date.now()}${Math.random().toString(36).slice(2)}${ext}`;
    const dest = path.join(UPLOAD_ROOT, name);

    fs.writeFileSync(dest, buf);
    return res.json({ url: publicFileUrl(name), filename: name, mime });
  } catch (err) {
    console.error('upload-base64 error', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

// -------- tasks (unchanged) --------
app.post('/tasks', async (req, res) => {
  const { task_name, type, status, owner, due_date, cost } = req.body;
  try {
    await pool.query(
      `INSERT INTO tasks (task_name, type, status, owner, due_date, cost)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [task_name, type, status, owner, due_date, cost || 0]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save task' });
  }
});

app.get('/tasks', async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM tasks ORDER BY created_at DESC`
  );
  res.json(rows);
});

// -------- materials (unchanged) --------
app.post('/materials', async (req, res) => {
  const { item_name, image_url, category, unit, quantity, unit_cost, total_cost, supplier, delivery_eta, notes } = req.body;
  try {
    await pool.query(
      `INSERT INTO materials (item_name, image_url, category, unit, quantity, unit_cost, total_cost, supplier, delivery_eta, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [item_name, image_url, category, unit, quantity, unit_cost, total_cost, supplier, delivery_eta, notes]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save material' });
  }
});

app.get('/materials', async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM materials ORDER BY created_at DESC`
  );
  res.json(rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on ${PORT}`));
