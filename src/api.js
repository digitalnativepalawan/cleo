// src/lib/api.js
const API_BASE = "https://portal-backend-84cj.onrender.com"; // backend URL

// Health check
export async function checkHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  return res.json();
}

// Get materials
export async function getMaterials() {
  const res = await fetch(`${API_BASE}/api/materials`);
  return res.json();
}

// Add material (with image support)
export async function addMaterial(material) {
  const res = await fetch(`${API_BASE}/api/materials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(material),
  });
  return res.json();
}
