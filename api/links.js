const crypto = require('crypto');
const h256 = s => crypto.createHash('sha256').update(String(s)).digest();
const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metode tidak diizinkan' });

  const { ADMIN_PASSWORD, GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const path = process.env.GITHUB_PATH || 'links.json';
  if (!ADMIN_PASSWORD || !GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return res.status(500).json({ error: 'Environment Variables di Vercel belum lengkap' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const { password, links } = body || {};

  if (!password || !crypto.timingSafeEqual(h256(password), h256(ADMIN_PASSWORD))) {
    await sleep(800);
    return res.status(401).json({ error: 'Password salah' });
  }
  if (!Array.isArray(links) || links.length > 500) return res.status(400).json({ error: 'Data tidak valid' });

  const data = [];
  for (const l of links) {
    if (!l || typeof l.url !== 'string' || !/^https?:\/\//i.test(l.url)) continue;
    data.push({ name: String(l.name || '').slice(0, 120), url: l.url.slice(0, 2000) });
  }

  const api = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const headers = {
    Authorization: 'Bearer ' + GITHUB_TOKEN,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'daftar-tautan'
  };
  try {
    let sha;
    const g = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers });
    if (g.ok) sha = (await g.json()).sha;
    else if (g.status !== 404) return res.status(502).json({ error: 'Gagal membaca repo (kode ' + g.status + ')' });

    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const p = await fetch(api, {
      method: 'PUT', headers,
      body: JSON.stringify({ message: 'Update daftar tautan', content, branch, sha })
    });
    if (!p.ok) return res.status(502).json({ error: 'Gagal menyimpan ke GitHub (kode ' + p.status + ')' });
    return res.status(200).json({ ok: true, links: data });
  } catch (e) {
    return res.status(502).json({ error: 'Tidak bisa terhubung ke GitHub' });
  }
};
