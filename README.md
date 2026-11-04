# STUMechanic 🔧

Bilingual (🇨🇿 Czech / 🇬🇧 English) step-by-step **car repair tutorials with animations** and
safety warnings, built for beginners. It's an installable web app (PWA) that works offline in the garage.

> ⚠️ **Disclaimer:** STUMechanic is a learning aid, not a replacement for the manufacturer's workshop
> documentation. Values marked **VERIFY / OVĚŘIT** are not 100 % certain. Always check them in WIS/XENTRY
> (Mercedes), VIDA (Volvo), ELSA/erWin (Škoda) or TIS (Toyota) for your VIN.

## Features

- **15 tutorials by level:**
  - **Basics:** safe lifting & wheel removal, OBD diagnostics, oil & filter change, brake pads & discs, coolant change, spark plugs (glow plugs on diesel), headlights (bulbs, units, xenon, aiming), rear lights
  - **Intermediate:** brake fluid change & bleeding, gearbox & differential oils, exhaust replacement + legal modifications, steering wheel (airbag), timing belt (výměna rozvodů)
  - **Advanced:** clutch + dual-mass flywheel, bodywork – dent & rust repair, filler, primer, paint (klempířské práce)
- **Symptom guide (roadmap):** start from what you notice (a noise, vibration, pedal feel, warning light, smoke, leak…). It lists possible causes from most common, with explanations, how to check, how urgent it is, notes for your car, and links to the right tutorials. Tutorials link back to the symptoms they fix.
- **Search** on the home page, plus a per-vehicle list of all tutorials with difficulty status.
- **Interactive 3D scene for each step** (WebGL, three.js): realistic materials, reflections and shadows. Drag to rotate, scroll or pinch to zoom, labels anchored to parts, plus pause, slow-motion, replay and view reset.
  Your car is shown with its own body shape and proportions when you select it.
  A 2D (SVG) version of every animation remains as an automatic fallback and can be chosen with the 2D/3D toggle.
- **Failsafe warnings** at every step, in five levels: DANGER, WARNING, CAUTION, NOTE and TIP.
- **Vehicle switch:** a generic procedure plus vehicle-specific specs, torques, extra steps, warnings and animation variants for:
  - Mercedes-Benz CL 500 (C216) 2007 – M273 V8, 7G-Tronic, RWD, ABC
  - Volvo XC60 B4 AWD 2024 – 2.0 petrol, 48 V mild hybrid, air suspension
  - Škoda Octavia RS 2.0 TDI 2011 liftback – CR 125 kW, 6-speed manual, bi-xenon AFS
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
js/vendor/three.min.js  three.js r147 (MIT, see js/vendor/THREE_LICENSE) – bundled for offline use
js/3d/engine.js         3D viewer: lighting, environment reflections, shadows, orbit/zoom, labels, timelines, thumbnails
js/3d/parts.js          PBR materials, geometry helpers, mechanical parts (wheel, disc, calipers, jack, stands, tools, engine…)
js/3d/cars.js           procedural body shells per vehicle (real dimensions, no logos)
js/3d/scenes/*.js       3D scenes per topic (same ids as the 2D animations)
js/anim/lib.js          2D SVG building blocks (fallback)
js/anim/*.js            2D animations per topic (fallback)
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
  steps: { <stepId>: { title?, body?, anim?, notes?, specs?, skip? } }, extraSteps: [{ after: <stepId>, step: {...} }],
  title?, intro?, summary?, time?, replaceTools?, replaceFinalChecks?, replaceSafety? }`

Notes are `{ level: 'danger'|'warning'|'caution'|'info'|'tip', text, verify? }`. Specs are `{ label, value, verify? }`.
All texts are `{ cs, en }`. Add the script tag to `index.html` and the file path to `sw.js`.

**3D scene:** `STU.scene3d.register('<topic>.<name>', { duration, camera, build(ctx, K) { return { root, update(t), labels, captions } } })`.
The full API is described at the top of `js/3d/engine.js`, and `js/3d/scenes/lifting.js` is the reference example.

**2D fallback animation:** `STU.anim.register('<file>.<name>', { render(ctx) { return STU.animLib.svg(...) } })`. The conventions are described at the top of `js/anim/lib.js`.

**Vehicle:** add `STU.registerVehicle({...})` in `js/vehicles.js`, then add overrides under `vehicles` in each tutorial.
