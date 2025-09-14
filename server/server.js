// server/server.js
import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: process.env.DB_SSL === "require" ? { rejectUnauthorized: false } : false,
});

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Auto-create tables if missing
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
  `);
}
init().catch(console.error);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/tasks", async (req, res) => {
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
    res.status(500).json({ error: "Failed to save task" });
  }
});

app.get("/tasks", async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM tasks ORDER BY created_at DESC`
  );
  res.json(rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on ${PORT}`));
