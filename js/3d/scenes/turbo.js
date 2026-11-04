/* 3D scenes: turbocharger diagnosis and replacement. Uses S.n5 helpers. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var TOOL = { 'generic': 'OBD', 'mb-cl500-c216': 'XENTRY', 'volvo-xc60-b4': 'VIDA', 'skoda-octavia-rs-tdi': 'VCDS', 'toyota-gr-yaris': 'Techstream', 'citroen-jumper-22hdi': 'Diagbox' };

  /** Turbo wheel (compressor or turbine) with n blades, axis X. */
  function wheel(K, r, n, mat, damaged) {
    var g = new THREE.Group();
    var hub = K.mesh(K.G.lathe([[0.004, -0.02], [r * 0.45, -0.018], [r * 0.3, 0.01], [0.006, 0.022]], 24), mat); hub.rotation.z = -PI / 2; g.add(hub);
    for (var i = 0; i < n; i++) {
      var b = K.mesh(K.G.box(0.034, r * 0.6, 0.0025), mat);
      var a = i / n * PI * 2;
      var pivot = new THREE.Group(); pivot.rotation.x = a;
      b.position.set(0, r * 0.62, 0); b.rotation.y = 0.45;
      if (damaged && i === 2) { b.scale.y = 0.6; b.position.y = r * 0.48; }
      pivot.add(b); g.add(pivot);
    }
    return g;
  }

  /** Turbocharger, shaft axis = X (compressor at +X, turbine at -X). Housings semi-transparent so wheels show. */
  function turbo(K, opts) {
    opts = opts || {};
    var H = S.n5, g = new THREE.Group();
    var chra = K.mesh(K.G.cylX(0.04, 0.07, 28), 'castIron'); g.add(chra);
    var comp = K.mesh(K.G.torus(0.055, 0.032, PI * 2, 40), K.M.clone('aluCast', { transparent: true, opacity: opts.solid ? 1 : 0.35 })); comp.rotation.y = PI / 2; comp.position.x = 0.07; g.add(comp);
    var compIn = K.mesh(K.G.cylX(0.035, 0.05, 28), K.M.clone('aluCast', { transparent: true, opacity: opts.solid ? 1 : 0.35, side: THREE.DoubleSide })); compIn.position.x = 0.11; g.add(compIn);
    var compOut = H.pipe(K, [[0.07, 0.055, 0.03], [0.07, 0.09, 0.08], [0.07, 0.1, 0.13]], 0.022, K.M.clone('aluCast', { transparent: true, opacity: opts.solid ? 1 : 0.6 })); g.add(compOut);
    var turb = K.mesh(K.G.torus(0.05, 0.03, PI * 2, 40), K.M.clone('castIron', { transparent: true, opacity: opts.solid ? 1 : 0.4, color: 0x7a5a48 })); turb.rotation.y = PI / 2; turb.position.x = -0.07; g.add(turb);
    var flange = K.mesh(K.G.rbox(0.02, 0.08, 0.1, 0.008), 'castIron'); flange.position.set(-0.07, -0.06, 0.03); g.add(flange);
    var cw = wheel(K, 0.045, 10, 'alu', opts.damaged); cw.position.x = 0.075; g.add(cw);
    var tw = wheel(K, 0.04, 11, K.M.clone('steelDark', { color: 0x5a4b42 })); tw.position.x = -0.07; g.add(tw);
    var shaft = K.mesh(K.G.cylX(0.005, 0.16, 12), 'steel'); g.add(shaft);
    var nut = K.mesh(K.G.hex(0.006, 0.01), 'steel'); nut.rotation.z = PI / 2; nut.position.x = 0.105; g.add(nut);
    // oil feed (top) and drain (bottom)
    var feed = H.pipe(K, [[0, 0.04, 0], [0, 0.1, 0], [0.05, 0.18, -0.05], [0.15, 0.22, -0.1]], 0.004, 'steel'); g.add(feed);
    var banjo = K.mesh(K.G.cyl(0.009, 0.014, 16), 'zinc'); banjo.position.set(0, 0.046, 0); g.add(banjo);
    var drain = H.pipe(K, [[0, -0.04, 0], [0, -0.1, 0], [0.02, -0.2, 0.02]], 0.01, 'rubber'); g.add(drain);
    var vgt = null;
    if (opts.vgt) { vgt = K.mesh(K.G.rbox(0.05, 0.04, 0.05, 0.008), 'plasticBlack'); vgt.position.set(-0.03, 0.06, 0.06); g.add(vgt); }
    g.userData = { cw: cw, tw: tw, feed: feed, drain: drain, banjo: banjo, nut: nut, vgt: vgt };
    return g;
  }
  var VGT = function (v) { return v === 'skoda-octavia-rs-tdi' || v === 'citroen-jumper-22hdi' || v === 'generic'; };
  var CAM = { pos: [0.28, 0.22, 0.38], target: [0, 0.02, 0], fov: 34 };

  function onStand(ctx, K, opts) {
    var root = new THREE.Group();
    root.add(S.n5.bench(K, 0.8, 0.5));
    var t = turbo(K, Object.assign({ vgt: VGT(ctx.vehicle) }, opts || {})); t.position.y = 0.22; root.add(t);
    var stand = K.mesh(K.G.cyl(0.02, 0.17, 12), 'blackOxide'); stand.position.set(0, 0.085, -0.06); root.add(stand);
    return { root: root, t: t, u: t.userData };
  }
  var CAM2 = { pos: [0.32, 0.36, 0.45], target: [0, 0.22, 0], fov: 34 };

  R('turbo.overview', {
    duration: 8, camera: CAM2, shadow: 0.6, thumbT: 2,
    build: function (ctx, K) {
      var H = S.n5, s = onStand(ctx, K);
      var oil = H.flow(K, [[0.15, 0.44, -0.1], [0.05, 0.4, -0.05], [0, 0.32, 0], [0, 0.26, 0]], 'oil', 10, 0.005); s.root.add(oil.group);
      var air = H.flow(K, [[0.25, 0.22, 0], [0.12, 0.22, 0], [0.07, 0.27, 0.03], [0.07, 0.32, 0.13]], K.M.clone('hiInfo', { transparent: true, opacity: 0.6 }), 10, 0.006); s.root.add(air.group);
      return {
        root: s.root,
        update: function (t) { s.u.cw.rotation.x = t * 40; s.u.tw.rotation.x = t * 40; oil.update(t, true, 0.35); air.update(t, true, 0.6); },
        labels: [
          { text: V('kompresor (studená strana)', 'compressor (cold side)'), at: [0.1, 0.3, 0], level: 'accent' },
          { text: V('turbína (horká strana)', 'turbine (hot side)'), at: [-0.08, 0.3, 0] },
          { text: V('přívod oleje', 'oil feed'), at: [0.05, 0.42, -0.05] },
          { text: V('zpětný odvod oleje', 'oil drain'), at: [0.02, 0.06, 0.02] }
        ],
        captions: [
          { text: V('Spaliny roztočí turbínu, ta na hřídeli pohání kompresor (až ~200 000 ot/min)', 'Exhaust spins the turbine, which drives the compressor on one shaft (up to ~200,000 rpm)') },
          { text: V('Ložiska mazána jen tlakovým olejem – bez oleje zničená za sekundy', 'Bearings live on pressurised oil only – without oil they die in seconds'), show: [3, 8], level: 'warning' }
        ]
      };
    }
  });

  R('turbo.causes', {
    duration: 9, camera: CAM2, shadow: 0.6, thumbT: 2,
    build: function (ctx, K) {
      var s = onStand(ctx, K, { damaged: true });
      var gFeed = K.FX.glow(s.u.feed, 0xe5484d), gDrain = K.FX.glow(s.u.drain, 0xe5484d), gW = K.FX.glow(s.u.cw, 0xe5484d);
      return {
        root: s.root,
        update: function (t) {
          s.u.cw.rotation.x = t * 3; s.u.tw.rotation.x = t * 3;
          var ph = Math.floor(t / 3);
          gFeed(ph === 0 ? 0.8 : 0); gDrain(ph === 1 ? 0.8 : 0); gW(ph === 2 ? 0.8 : 0);
        },
        captions: [
          { text: V('1) Nedostatek / špína v oleji: ucpaný přívod, starý olej, olejový kal', '1) Oil starvation / dirty oil: blocked feed, old oil, sludge'), show: [0, 3], level: 'danger' },
          { text: V('2) Ucpaný odvod nebo odvětrání klikové skříně → olej tlačen do sání/výfuku', '2) Blocked drain or crankcase breather → oil pushed into intake/exhaust'), show: [3, 6], level: 'danger' },
          { text: V('3) Cizí těleso (úlomek, matka, kousek filtru) → poškozené lopatky', '3) Foreign object (debris, nut, filter piece) → damaged blades'), show: [6, 9], level: 'danger' }
        ]
      };
    }
  });

  R('turbo.play', {
    duration: 7, camera: { pos: [0.34, 0.34, 0.42], target: [0.07, 0.22, 0], fov: 34 }, shadow: 0.5, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, s = onStand(ctx, K, { solid: true });
      var hand = K.P.glove(); hand.scale.setScalar(0.55); hand.rotation.set(0, -PI / 2, -PI / 2); s.root.add(hand);
      var ax = K.FX.arrow([0.15, 0.27, 0.05], [0.12, 0.27, 0.05], 0xf5a524, 0.004); s.root.add(ax);
      var rad = K.FX.arrow([0.13, 0.25, 0.06], [0.13, 0.28, 0.06], 0x3e8ed0, 0.004); s.root.add(rad);
      return {
        root: s.root,
        update: function (t) {
          var w = Math.sin(t * 6) * (t < 3.5 ? 1 : 0), r = Math.sin(t * 6) * (t >= 3.5 ? 1 : 0);
          s.u.cw.position.set(0.075 + w * 0.0015, 0.0 + r * 0.0012, 0);
          hand.position.set(0.17 + w * 0.004, 0.24 + r * 0.003, 0.03);
          ax.visible = t < 3.5; rad.visible = t >= 3.5;
        },
        labels: [{ text: V('lopatky nesmí drhnout o skříň', 'blades must not touch the housing'), at: [0.08, 0.3, 0.04], level: 'danger', show: [3.5, 7] }],
        captions: [
          { text: V('Studený motor, sací hadice dolů: axiální vůle (tam-zpět) téměř nulová', 'Cold engine, intake hose off: axial play (in-out) almost zero'), show: [0, 3.5] },
          { text: V('Malá radiální vůle je normální – kontakt lopatek se skříní NE', 'A little radial play is normal – blades touching the housing is NOT'), show: [3.5, 7] }
        ]
      };
    }
  });

  R('turbo.oil', {
    duration: 7, camera: { pos: [0.35, 0.32, 0.4], target: [0.12, 0.2, 0], fov: 34 }, shadow: 0.6, thumbT: 3,
    build: function (ctx, K) {
      var H = S.n5, s = onStand(ctx, K, { solid: true });
      var hose = H.pipe(K, [[0.2, 0.22, 0], [0.28, 0.22, 0], [0.33, 0.25, 0]], 0.035, K.M.clone('rubber', { side: THREE.DoubleSide })); s.root.add(hose);
      var film = K.mesh(K.G.cylX(0.032, 0.09, 24), K.M.clone('oil', { color: 0x6b4a10, opacity: 0.85 })); film.position.set(0.24, 0.205, 0); film.scale.set(1, 0.3, 1); s.root.add(film);
      var smoke = K.FX.puff(0x9fb6d8, 14, 0.06, 0.25); smoke.group.position.set(-0.12, 0.2, 0.06); s.root.add(smoke.group);
      return {
        root: s.root,
        update: function (t) { smoke.update(t, t > 3); },
        labels: [{ text: V('olej v sání / intercooleru', 'oil in the intake / intercooler'), at: [0.24, 0.27, 0.02], level: 'accent' }],
        captions: [
          { text: V('Trocha olejové mlhy v sání je normální (odvětrání), louže oleje NE', 'A light oil mist in the intake is normal (breather), puddles of oil are NOT') },
          { text: V('Modrý kouř, rostoucí spotřeba oleje = podezření na turbo nebo odvětrání', 'Blue smoke, rising oil use = suspect the turbo or the breather'), show: [3, 7], level: 'warning' }
        ]
      };
    }
  });

  R('turbo.boostLeak', {
    duration: 8, camera: { pos: [0.6, 0.5, 0.75], target: [0.15, 0.2, 0], fov: 34 }, shadow: 0.9, thumbT: 5,
    build: function (ctx, K) {
      var H = S.n5, T = K.T, root = new THREE.Group();
      root.add(H.bench(K, 1.1, 0.6));
      var pipe = H.pipe(K, [[-0.4, 0.15, 0], [-0.1, 0.15, 0.05], [0.1, 0.22, 0.05], [0.4, 0.22, 0]], 0.03, 'plasticBlack'); root.add(pipe);
      var ic = K.mesh(K.G.rbox(0.25, 0.16, 0.05, 0.01), 'alu'); ic.position.set(-0.05, 0.15, -0.12); root.add(ic);
      var clamp = K.mesh(K.G.torus(0.033, 0.005, PI * 2, 24), 'steel'); clamp.position.set(0.1, 0.22, 0.05); clamp.rotation.y = PI / 2; root.add(clamp);
      var machine = K.mesh(K.G.rbox(0.18, 0.12, 0.14, 0.015), 'toolYellow'); machine.position.set(-0.42, 0.06, 0.15); root.add(machine);
      var gauge = H.sign(K, 0.12, 0.06, ['1.0 bar'], { border: '#2272b8' }); gauge.position.set(-0.42, 0.15, 0.225); root.add(gauge);
      var smoke = K.FX.puff(0xcccccc, 16, 0.05, 0.18); smoke.group.position.copy(clamp.position); root.add(smoke.group);
      return {
        root: root,
        update: function (t) { smoke.update(t, t > 2.5); },
        labels: [{ text: V('únik u spony!', 'leak at the clamp!'), at: [0.1, 0.32, 0.05], level: 'danger', show: [2.5, 8] }],
        captions: [
          { text: V('Test těsnosti plnicího potrubí: kouřový generátor nebo tlak ~1 bar (dle návodu přístroje)', 'Boost leak test: smoke machine or ~1 bar of pressure (per tester instructions)') },
          { text: V('Prasklá hadice nebo povolená spona = slabý výkon, „pískání“, chyby přeplňování', 'A cracked hose or loose clamp = low power, whistling, boost faults'), show: [3, 8], level: 'info' }
        ]
      };
    }
  });

  R('turbo.rootCause', {
    duration: 8, camera: { pos: [0, 0.3, 0.75], target: [0, 0.25, 0], fov: 32 }, shadow: 0.6, thumbT: 7,
    build: function (ctx, K) {
      var H = S.n5, root = new THREE.Group();
      root.add(H.bench(K, 0.9, 0.5));
      var items = [V('☐ Přívod oleje – průchodný?', '☐ Oil feed – clear?'), V('☐ Odvod oleje – neucpaný, bez ohybu?', '☐ Oil drain – not blocked or kinked?'),
        V('☐ Odvětrání klikové skříně funkční?', '☐ Crankcase breather working?'), V('☐ Vzduchový filtr / sání bez cizích těles?', '☐ Air filter / intake free of debris?'),
        V('☐ DPF / katalyzátor neucpaný?', '☐ DPF / catalyst not blocked?'), V('☐ Olej správný a čerstvý?', '☐ Oil correct and fresh?')];
      var board = K.FX.canvasPanel(0.5, 0.38, function (x, W, Hh, st) {
        x.fillStyle = '#f4f5f7'; x.fillRect(0, 0, W, Hh);
        x.fillStyle = '#1d4f73'; x.fillRect(0, 0, W, Hh * 0.14);
        x.fillStyle = '#fff'; x.font = 'bold ' + Math.round(Hh * 0.075) + 'px system-ui, Arial'; x.textBaseline = 'middle';
        x.fillText(ctx.t(V('Před novým turbem zkontrolujte:', 'Before fitting a new turbo check:')), W * 0.03, Hh * 0.07);
        items.forEach(function (it, i) {
          var txt = ctx.t(it); if (i < st) txt = txt.replace('☐', '☑');
          x.fillStyle = i < st ? '#1f8a56' : '#151a22'; x.font = Math.round(Hh * 0.062) + 'px system-ui, Arial';
          x.fillText(txt, W * 0.04, Hh * (0.24 + i * 0.125));
        });
      }, { px: 768, state: 0 });
      board.position.set(0, 0.26, 0); root.add(board);
      return {
        root: root,
        update: function (t) { board.userData.redraw(Math.min(6, Math.floor(t / 1.1))); },
        captions: [{ text: V('Nové turbo na nevyřešenou příčinu odejde znovu – často do pár set km', 'A new turbo on an unfixed cause fails again – often within a few hundred km'), level: 'danger' }]
      };
    }
  });

  R('turbo.remove', {
    duration: 8, camera: CAM2, shadow: 0.6, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, s = onStand(ctx, K, { solid: true });
      var rat = K.P.ratchet(0.2, 0.007); rat.position.set(0, 0.29, 0); s.root.add(rat);
      return {
        root: s.root,
        update: function (t) {
          var b = T.seg(t, 0.5, 2.5);
          rat.visible = t < 2.6; rat.rotation.y = -b * PI;
          s.u.banjo.position.y = 0.046 + b * 0.05;
          s.u.feed.position.y = b * 0.05; s.u.feed.position.x = b * 0.03;
          var lift = T.seg(t, 3.5, 6.5);
          s.t.position.set(lift * 0.15, 0.22 + lift * 0.12, 0); s.t.rotation.z = lift * 0.3;
        },
        captions: [
          { text: V('Studený motor! Odpojit přívod/odvod oleje, potrubí, snímače, VGT aktuátor', 'Cold engine! Disconnect oil feed/drain, ducts, sensors, VGT actuator') },
          { text: V('Otevřené otvory hned zaslepit – nic nesmí spadnout do motoru', 'Cap open ports at once – nothing may fall into the engine'), show: [3, 8], level: 'danger' }
        ]
      };
    }
  });

  R('turbo.oilLines', {
    duration: 7, camera: { pos: [0.22, 0.42, 0.32], target: [0.02, 0.28, 0], fov: 34 }, shadow: 0.5, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, s = onStand(ctx, K, { solid: true });
      var w1 = K.mesh(K.G.torus(0.008, 0.002, PI * 2, 20), 'copper'); w1.rotation.x = PI / 2; s.root.add(w1);
      var w2 = w1.clone(); s.root.add(w2);
      var g1 = K.FX.glow(w1, 0x30a46c), g2 = K.FX.glow(w2, 0x30a46c), gf = K.FX.glow(s.u.feed, 0x30a46c);
      return {
        root: s.root,
        update: function (t) {
          var k = T.seg(t, 0.5, 2.5);
          w1.position.set(0, 0.22 + 0.04 + (1 - k) * 0.06, 0); w2.position.set(0, 0.22 + 0.054 + (1 - k) * 0.08, 0);
          g1(T.pulse(t, 0.3, 4)); g2(T.pulse(t, 0.3, 4)); gf(T.pulse(t, 3.5, 7));
        },
        labels: [{ text: V('nové měděné podložky', 'new copper washers'), at: [0.0, 0.33, 0.02], show: [0.5, 4], level: 'ok' },
          { text: V('nové / vyčištěné olejové vedení', 'new / cleaned oil line'), at: [0.08, 0.42, -0.06], show: [3.5, 7], level: 'ok' }],
        captions: [
          { text: V('Vždy nové podložky, těsnění a ideálně nové olejové vedení (sítka v banjo šroubech!)', 'Always new washers, gaskets and ideally a new oil line (strainers in banjo bolts!)') },
          { text: V('Nepoužívat silikon na olejové spoje – kousky ucpou přívod', 'No silicone sealant on oil joints – bits block the feed'), show: [3.5, 7], level: 'warning' }
        ]
      };
    }
  });

  R('turbo.prime', {
    duration: 8, camera: { pos: [0.25, 0.42, 0.38], target: [0.02, 0.26, 0], fov: 34 }, shadow: 0.5, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, s = onStand(ctx, K, { solid: true });
      s.u.feed.visible = false;
      var can = K.P.oilCan(0x1f3d6b); can.scale.setScalar(0.5); s.root.add(can);
      var stream = K.FX.stream([0.06, 0.38, 0], [0.02, 0.36, 0], [0, 0.27, 0], 'oil', 0.003); s.root.add(stream.mesh);
      return {
        root: s.root,
        update: function (t) {
          can.position.set(0.04, 0.33, -0.02); can.rotation.z = 1.9;
          stream.set(T.seg(t, 0.5, 1.2) * (1 - T.seg(t, 5, 5.5)));
          s.u.cw.rotation.x = t * 2.5;
        },
        captions: [
          { text: V('Před montáží přívodu nalít čistý olej do otvoru přívodu a rukou protočit hřídel', 'Before fitting the feed pour clean oil into the feed port and turn the shaft by hand') },
          { text: V('První sekundy bez oleje = zadřená ložiska nového turba', 'The first seconds without oil = seized bearings in the new turbo'), show: [3, 8], level: 'danger' }
        ]
      };
    }
  });

  R('turbo.firstStart', {
    duration: 8, camera: { pos: [0.08, 0.32, 0.55], target: [0, 0.18, 0], fov: 32 }, shadow: 0.6, thumbT: 5,
    build: function (ctx, K) {
      var H = S.n5, root = new THREE.Group();
      root.add(H.bench(K, 0.9, 0.6));
      var sc = H.scanner(K, null); sc.group.position.set(0, 0.18, 0); sc.group.rotation.x = -0.35; root.add(sc.group);
      return {
        root: root,
        update: function (t) {
          var ph = t < 4 ? 0 : 1;
          sc.set({ title: ctx.t(V('První start', 'First start')), rows: [
            { t: ctx.t(V('1. Protáčet bez startu (dle příručky)', '1. Crank without starting (per manual)')), r: ph ? '✔' : '…', rc: ph ? '#30a46c' : '#f5a524' },
            { t: ctx.t(V('2. Kontrolka tlaku oleje zhasne', '2. Oil pressure light goes out')), r: ph ? '✔' : '', rc: '#30a46c' },
            { t: ctx.t(V('3. Volnoběh 1–2 min, bez plynu', '3. Idle 1–2 min, no throttle')), r: ph ? '…' : '', rc: '#f5a524' },
            { t: ctx.t(V('4. Kontrola úniků oleje', '4. Check for oil leaks')), r: '' }
          ] });
        },
        captions: [
          { text: V('Natlakovat olej: protáčet startérem bez nastartování (např. bez pojistky čerpadla / vstřiku) – postup dle výrobce', 'Build oil pressure: crank without starting (e.g. fuel pump / injection fuse out) – per manufacturer'), level: 'info' },
          { text: V('Nikdy hned nevytáčet – nejdřív klidný volnoběh', 'Never rev it straight away – idle gently first'), show: [4, 8], level: 'warning' }
        ]
      };
    }
  });

  R('turbo.test', {
    duration: 8, camera: { pos: [0.08, 0.32, 0.55], target: [0, 0.18, 0], fov: 32 }, shadow: 0.6, thumbT: 5,
    build: function (ctx, K) {
      var H = S.n5, root = new THREE.Group();
      root.add(H.bench(K, 0.9, 0.6));
      var sc = H.scanner(K, null); sc.group.position.set(0, 0.18, 0); sc.group.rotation.x = -0.35; root.add(sc.group);
      return {
        root: root,
        update: function (t) {
          var k = Math.min(1, Math.floor(t * 2) / 10);
          sc.set({ title: (TOOL[ctx.vehicle] || 'OBD') + ' · ' + ctx.t(V('plnicí tlak', 'boost')), rows: [
            { t: ctx.t(V('Požadovaný', 'Requested')), r: (1.0 + k).toFixed(2) + ' bar' },
            { t: ctx.t(V('Skutečný', 'Actual')), r: (0.98 + k * 0.99).toFixed(2) + ' bar', rc: '#30a46c' },
            { t: ctx.t(V('Chyby přeplňování', 'Boost faults')), r: '0', rc: '#30a46c' }
          ], big: t > 6 ? 'OK ✔' : null });
        },
        captions: [
          { text: V('Zkušební jízda: požadovaný vs. skutečný plnicí tlak se musí shodovat', 'Test drive: requested vs actual boost must match') },
          { text: V('Prvních ~500 km šetrně, olej zkontrolovat', 'Drive gently for the first ~500 km, check the oil'), show: [4, 8], level: 'info' }
        ]
      };
    }
  });

  R('turbo.na', {
    duration: 7, camera: { pos: [1.1, 1.0, 1.1], target: [0, 0.4, 0], fov: 34 }, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var H = S.n5, root = new THREE.Group();
      var eng = K.P.engine({ cyl: 4 }); root.add(eng);
      var box = K.mesh(K.G.rbox(0.3, 0.12, 0.25, 0.03), 'plasticBlack'); box.position.set(0.1, 0.8, 0.35); root.add(box);
      root.add(H.pipe(K, [[0.1, 0.8, 0.22], [0.0, 0.72, 0.3], [-0.1, 0.66, 0.3]], 0.04, 'plasticBlack'));
      var air = H.flow(K, [[0.3, 0.8, 0.35], [0.1, 0.8, 0.3], [0.0, 0.72, 0.3], [-0.2, 0.64, 0.3]], K.M.clone('hiInfo', { transparent: true, opacity: 0.6 }), 10, 0.01); root.add(air.group);
      return {
        root: root,
        update: function (t) { air.update(t, true, 0.4); },
        labels: [{ text: V('vzduch nasáván přímo – bez turba', 'air drawn in directly – no turbo'), at: [0.1, 0.92, 0.35], level: 'accent' }],
        captions: [
          { text: V('Atmosférický motor: žádné turbo – diagnostika výkonu = sání, snímač hmotnosti vzduchu, netěsnosti', 'Naturally aspirated: no turbo – power diagnosis = intake, mass air flow sensor, vacuum leaks') }
        ]
      };
    }
  });

  // naturally aspirated engines: vacuum (intake) leak test re-uses the smoke-test scene with its own captions
  (function () {
    var base = S.scenes['turbo.boostLeak'];
    R('turbo.naCheck', {
      duration: base.duration, camera: base.camera, shadow: base.shadow, thumbT: base.thumbT,
      build: function (ctx, K) {
        var o = base.build(ctx, K);
        o.labels = [{ text: V('falešný vzduch!', 'false air!'), at: [0.1, 0.32, 0.05], level: 'danger', show: [2.5, 8] }];
        o.captions = [
          { text: V('Kouřový test sání: netěsnost za snímačem hmotnosti vzduchu = „falešný vzduch“', 'Intake smoke test: a leak after the mass air flow sensor = "false air"') },
          { text: V('Projeví se kladnými palivovými korekcemi, nerovným volnoběhem a ztrátou výkonu', 'Shows up as positive fuel trims, rough idle and loss of power'), show: [3, 8], level: 'info' }
        ];
        return o;
      }
    });
  })();
})(window.STU);
