# Chrome DevTools Playground

A fully offline, installable Chrome DevTools emulator — built as a single HTML file with no build tools or dependencies.

**Live:** https://naveedeme.github.io/dev-tools/

---

## Panels

| Panel | What it does |
|---|---|
| **Console** | Full JS executor — `const`/`let`/`var` persist across runs, `await` works, all `console.*` methods |
| **Sources** | Multi-snippet playground with JS and React (JSX) modes, split output pane, resizable |
| **Network** | Intercepts `fetch()` calls — shows status, size, timing, response headers & body |
| **Performance** | Real Web Vitals (LCP, FCP, TTFB, CLS), JS heap memory, navigation timing, flame chart |
| **Elements** | Live DOM tree with collapsible nodes, computed styles pane |
| **Application** | LocalStorage / SessionStorage viewer+editor, Cookies, Manifest info, Service Workers |

---

## Install as offline app

Open https://naveedeme.github.io/dev-tools/ in Chrome, then:

- **Desktop:** click the install icon (⊕) in the address bar → *Install*
- **Android:** tap the browser menu → *Add to Home screen*
- **iOS Safari:** tap Share → *Add to Home Screen*

Once installed it works completely offline — all code runs locally in the browser.

---

## Run locally

No build step needed:

```bash
git clone https://github.com/naveedeme/dev-tools.git
cd dev-tools
# Any static file server works:
npx serve .
# or
python3 -m http.server 8080
```

Then open http://localhost:8080

> **Note:** Open via a server (not `file://`) so the Service Worker registers correctly.

---

## Deploy your own copy

1. Fork this repo
2. Go to **Settings → Pages**
3. Under *Source*, select **GitHub Actions**
4. Push any change to `main` — the workflow deploys automatically

---

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Run code (Console) |
| `Shift+Enter` | New line in Console input |
| `↑` / `↓` | Navigate command history |
| `Ctrl+L` | Clear console |
| `Ctrl+Enter` | Run snippet (Sources) |
| `Tab` | Insert 2 spaces (Sources editor) |

---

## Tech

- Single HTML file — no framework, no build tool, no CDN required at runtime
- Persistent JS sandbox via hidden iframe + `AsyncFunction` + `postMessage`
- React playground uses Babel Standalone (loaded from CDN on demand)
- PWA: `manifest.json` + `sw.js` with cache-first strategy for full offline use
- Snippets saved to `localStorage` — survive page reloads
