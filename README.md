# Thought Agent — AI image generation (brain-style)

Type what you're thinking; the app generates an image with **Replicate's Google Imagen 4**. Images appear in random spots, fade when you're not hovering, and hovering one image slowly spawns related "thought" images around it.

**Files:** `index.html` (frontend) + `server.js` (calls Replicate; API token stays on server).

---

## 1. Set up Replicate

1. Go to **[replicate.com](https://replicate.com)** and sign up
2. **Add a payment method** at [replicate.com/account/billing](https://replicate.com/account/billing)
3. Get your API token at **[replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)**
4. **NEVER put your token in code or commit it to GitHub** — use environment variables only

---

## 2. Run locally

```bash
cd thought-agent
export REPLICATE_API_TOKEN="your_token_here"
node server.js
```

Then open **http://localhost:3000**

- **Windows:** `set REPLICATE_API_TOKEN=your_token_here` then `node server.js`

---

## 3. Deploy to Vercel (for public link)

1. Go to [vercel.com](https://vercel.com) and connect your GitHub repo
2. Add **Environment Variable:** `REPLICATE_API_TOKEN` = your token (Vercel keeps it secret)
3. Deploy — you get a public URL like `thought-agent.vercel.app`

---

## 4. Usage

- Type in the box and press Enter or click **Generate**
- Images stay visible 10 seconds, then fade (unless you hover)
- Hover any image to spawn more related images around it
