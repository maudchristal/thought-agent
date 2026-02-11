# Thought Agent — AI image generation (brain-style)

Type what you're thinking; the app generates images via the **ITP/IMA Replicate proxy** using **Flux Schnell**. No Replicate account needed. Images appear in random spots, fade when you're not hovering, and hovering one image spawns related "thought" images.

**Runs on GitHub Pages** — the frontend calls the proxy directly from the browser.

---

## 1. View on GitHub Pages

1. Repo → **Settings** → **Pages** → **Deploy from a branch** → **main**, **/ (root)** → Save.
2. Open **https://YOUR_USERNAME.github.io/thought-agent/**

No setup. The app uses the ITP/IMA proxy (`itp-ima-replicate-proxy.web.app`); no API token in the repo.

---

## 2. Optional: higher quotas (NYU auth)

In `index.html`, set `AUTH_TOKEN` to the token from the proxy docs (authenticate with .nyu.edu, copy token). Refresh the token when it expires (e.g. hourly). Leave empty for default limits.

---

## 3. Usage

- Type in the box and press Enter or click **Generate**
- Images stay visible 10 seconds, then fade (unless you hover)
- Hover any image to spawn more related images around it
