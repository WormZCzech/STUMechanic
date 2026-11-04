# STUMechanic 🔧

Bilingual (🇨🇿 Czech / 🇬🇧 English) step-by-step **car repair tutorials with animations** and
safety warnings, built for beginners. It's an installable web app (PWA) that works offline in the garage.

> ⚠️ **Disclaimer:** STUMechanic is a learning aid, not a replacement for the manufacturer's workshop
> documentation. Values marked **VERIFY / OVĚŘIT** are not 100 % certain. Always check them in WIS/XENTRY
> (Mercedes), VIDA (Volvo), ELSA/erWin (Škoda) or TIS (Toyota) for your VIN.

## Features

- **Tutorials by level:** Basics → Intermediate → Advanced
  - Basics: safe lifting & wheel removal, oil & filter change, brake pads & discs
  - Intermediate: timing belt replacement (výměna rozvodů)
  - Advanced: bodywork – dent & rust repair, filler, primer, paint (klempířské práce)
- **Animated SVG illustration for each step** with pause, slow-motion and replay.
- **Failsafe warnings** at every step, in five levels: DANGER, WARNING, CAUTION, NOTE and TIP.
- **Vehicle switch:** a generic procedure plus vehicle-specific specs, torques, extra steps, warnings and animation variants for:
  - Mercedes-Benz CL 500 (C216) 2007 – M273 V8, 7G-Tronic, RWD, ABC
  - Volvo XC60 B4 AWD 2024 – 2.0 petrol, 48 V mild hybrid
  - Škoda Octavia RS 2.0 TDI 2011 – CR 125 kW, 6-speed manual
  - Toyota GR Yaris 2024 – G16E-GTS, 6-speed manual, GR-FOUR
- Checklists for tools and parts, plus step progress (saved on the device).
- Nothing is locked. Demanding jobs are only labelled "workshop recommended".

## Running it

**Easiest:** open `index.html` in a browser (works straight from disk).

**On a phone, installable and offline:** host the folder on any static server, e.g. GitHub Pages
(Settings → Pages → deploy from branch, root folder). Then open the URL on your phone and choose
"Add to Home screen".

Local server for development:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

No build step and no dependencies – plain HTML, CSS and JavaScript.

## Project structure

```
index.html              app shell, script order
css/styles.css          theme (dark/light), layout, callouts, animation colours (k-*/s-* classes)
js/core.js              STU namespace, registries, i18n helpers, markdown-lite, storage
js/i18n.js              UI strings (cs/en)
js/vehicles.js          vehicle definitions (facts + quirks, verify flags)
js/app.js               router, views, vehicle-specific merging (resolveTutorial)
js/anim/lib.js          SVG building blocks (car, wheel, jack, stand, arrows, labels…)
js/anim/*.js            animations per topic
js/tutorials/*.js       tutorial content per topic
sw.js                   offline cache (bump VERSION when files change)
```

## Adding content

**Tutorial:** create `js/tutorials/<name>.js` and call `STU.registerTutorial({...})`. Use
`js/tutorials/lifting.js` as the template. The key fields are:

- `level` (1–3), `title`, `summary`, `intro`, `time`, `thumb`
- `safety[]`, `tools[]`, `parts[]`, `finalChecks[]`
- `steps[]`: `{ id, title, body, anim, notes[], specs[] }`
- `vehicles[<vehicleId>]`: `{ status: 'ok'|'caution'|'pro', specs[], notes[], tools[], parts[], safety[], finalChecks[],
  steps: { <stepId>: { title?, body?, anim?, notes?, specs?, skip? } }, extraSteps: [{ after: <stepId>, step: {...} }] }`

Notes are `{ level: 'danger'|'warning'|'caution'|'info'|'tip', text, verify? }`. Specs are `{ label, value, verify? }`.
All texts are `{ cs, en }`. Add the script tag to `index.html` and the file path to `sw.js`.

**Animation:** `STU.anim.register('<file>.<name>', { render(ctx) { return STU.animLib.svg(...) } })`. The conventions are described at the top of `js/anim/lib.js`.

**Vehicle:** add `STU.registerVehicle({...})` in `js/vehicles.js`, then add overrides under `vehicles` in each tutorial.
