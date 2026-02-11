require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;

async function generateImage(prompt) {
  if (!REPLICATE_TOKEN) throw new Error('Set REPLICATE_API_TOKEN in your environment');
  console.log(`[Replicate] Generating image for: "${prompt}"`);
  const res = await fetch('https://api.replicate.com/v1/models/google/imagen-4/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${REPLICATE_TOKEN}`,
      'Content-Type': 'application/json',
      'Prefer': 'wait=60'
    },
    body: JSON.stringify({ input: { prompt } })
  });
  const data = await res.json();
  console.log(`[Replicate] Response status: ${res.status}`, data);
  if (!res.ok) throw new Error(`Replicate API error (${res.status}): ${data.detail || data.error || JSON.stringify(data)}`);
  if (data.error) throw new Error(data.error);
  if (data.status !== 'succeeded') throw new Error(`Prediction status: ${data.status}. ${data.error || ''}`);
  const out = data.output;
  return Array.isArray(out) ? out[0] : out;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/generate') {
    let body = '';
    for await (const chunk of req) body += chunk;
    try {
      const { prompt } = JSON.parse(body);
      if (!prompt || typeof prompt !== 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'prompt required' }));
      }
      const url = await generateImage(prompt.trim());
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ url }));
    } catch (e) {
      console.error('[Error]', e.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message || 'Generation failed' }));
    }
    return;
  }

  const file = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(__dirname, file);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const ext = path.extname(filePath);
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ico': 'image/x-icon' };
    res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`Thought Agent: http://localhost:${PORT}\nUsing Replicate Imagen 4. Set REPLICATE_API_TOKEN to generate images.`));
