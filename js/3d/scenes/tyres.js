/* 3D scenes: tyres – markings, pressure, tread depth, age, damage, rotation, TPMS, storage. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  var SIZE = {
    'generic': '205/55 R16 91V',
    'mb-cl500-c216': '255/45 R18 99Y',
    'volvo-xc60-b4': '235/55 R19 105V',
    'skoda-octavia-rs-tdi': '225/45 R17 91W',
    'toyota-gr-yaris': '225/40 R18 92Y',
    'citroen-jumper-22hdi': '215/70 R15C 109/107S'
  };
  /** Drive layout for the rotation diagram. */
  var DRIVE = {
    'generic': 'fwd', 'mb-cl500-c216': 'rwd', 'volvo-xc60-b4': 'awd', 'skoda-octavia-rs-tdi': 'fwd',
    'toyota-gr-yaris': 'awd', 'citroen-jumper-22hdi': 'fwd'
  };
  S.tyreSize = SIZE;

  /** Simple text painter for canvas panels. lines = [[text, sizeFactor, colour]] */
  function textPanel(K, w, h, bg, lines, opts) {
    return K.FX.canvasPanel(w, h, function (c, W, H) {
      if (bg) { c.fillStyle = bg; c.fillRect(0, 0, W, H); }
      var y = H * ((opts && opts.top) || 0.18);
      lines.forEach(function (l) {
        var fs = Math.round(H * (l[1] || 0.2));
        c.font = (l[3] || '700 ') + fs + 'px system-ui, Arial, sans-serif';
        c.fillStyle = l[2] || '#fff';
        c.textAlign = (opts && opts.align) || 'center';
        c.fillText(S.t(l[0]), (opts && opts.align === 'left') ? W * 0.06 : W / 2, y + fs * 0.8);
        y += fs * 1.35;
      });
    }, { px: (opts && opts.px) || 512, transparent: !bg });
  }
  S.textPanel3d = textPanel;

  function wheelFor(K, vid) {
    var s = K.carSpec(vid);
    var w = K.P.wheel({ r: s.wr, w: s.tw, rim: s.wr * (vid === 'citroen-jumper-22hdi' ? 0.64 : 0.7), rimMat: s.rim || 'rimSilver', spokes: vid === 'toyota-gr-yaris' ? 10 : (vid === 'citroen-jumper-22hdi' ? 8 : 5) });
    return { wheel: w, r: s.wr, w: s.tw, rim: s.wr * 0.7 };
  }
  /** Tyre valve stem (rubber + cap) on the rim at angle a, outer face +Z. */
  function valve(K, rr, a, zf) {
    var g = new THREE.Group();
    var stem = K.mesh(K.G.cyl(0.0055, 0.03, 12), 'rubber'); stem.position.y = 0.015; g.add(stem);
    var cap = K.mesh(K.G.cyl(0.006, 0.012, 12), 'blackOxide'); cap.position.y = 0.034; g.add(cap);
    g.position.set(Math.cos(a) * rr, Math.sin(a) * rr, zf);
    g.rotation.z = a - PI / 2; g.rotation.x = 0.5;
    g.userData.cap = cap;
    return g;
  }

  /* --------------------------------------------------------------- markings */
  R('tyres.markings', {
    duration: 8, camera: { pos: [0.55, 0.55, 0.85], target: [0.0, 0.33, 0.06], fov: 34 }, shadow: 1, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var wf = wheelFor(K, ctx.vehicle), w = wf.wheel;
      w.position.y = wf.r; root.add(w);
      root.add(K.FX.contactShadow(0.9, 0.5, 0.5));
      var size = SIZE[ctx.vehicle] || SIZE.generic;
      var mid = (wf.rim + wf.r) / 2;
      var panel = textPanel(K, 0.36, 0.05, null, [[size, 0.5, '#ffffff']], { top: 0.1 });
      panel.position.set(0, wf.r + mid, wf.w * 0.54); root.add(panel);
      var dot = textPanel(K, 0.13, 0.03, null, [['DOT XXXX 2321', 0.62, '#e9edf3']], { top: 0.05 });
      dot.position.set(-mid * 0.62, wf.r - mid * 0.62, wf.w * 0.54); dot.rotation.z = PI / 4 + PI / 2 * 0.0 - PI / 2; root.add(dot);
      var glow = K.mesh(K.G.torus(mid, 0.004, PI * 0.5, 40), K.M.clone('hiAccent'));
      glow.position.set(0, wf.r, wf.w * 0.545); glow.rotation.z = PI / 4; root.add(glow);
      return {
        root: root,
        cameraPath: function (t) {
          var k = T.seg(t, 4, 5);
          return { pos: [0.35 - 0.6 * k, wf.r + 0.55 - 0.3 * k, 1.0], target: [-0.15 * k, wf.r + 0.25 - 0.3 * k, 0.05] };
        },
        update: function (t) { glow.material.emissiveIntensity = 0.3 + 0.5 * T.pulse((t % 2), 0, 2); glow.visible = t < 4.5; },
        labels: [
          { text: V('šířka / profil R ráfek', 'width / profile R rim'), at: [0, wf.r + mid + 0.05, wf.w * 0.55], show: [0.5, 4.5], level: 'accent' },
          { text: V('index nosnosti + rychlosti', 'load + speed index'), at: [0.07, wf.r + mid + 0.02, wf.w * 0.55], show: [2, 4.5] },
          { text: V('DOT: týden + rok výroby', 'DOT: week + year made'), at: [-mid * 0.62, wf.r - mid * 0.62 + 0.03, wf.w * 0.55], show: [4.5, 8], level: 'accent' }
        ],
        captions: [
          { text: { cs: 'Rozměr vašeho vozu (příklad): ' + size, en: 'Your car\'s size (example): ' + size }, show: [0, 4.5] },
          { text: V('Rozměr a indexy ověřte v TP/ORV – jiné indexy = neprojdete STK', 'Verify size and indexes in your registration papers – wrong indexes fail the inspection'), level: 'info', show: [1.5, 8] },
          { text: V('„2321“ = 23. týden roku 2021', '"2321" = week 23 of 2021'), show: [4.5, 8] }
        ]
      };
    }
  });

  /* --------------------------------------------------------------- pressure */
  R('tyres.pressure', {
    duration: 8, camera: { pos: [0.45, 0.5, 0.7], target: [0.05, 0.3, 0.05], fov: 34 }, shadow: 1, thumbT: 5.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var wf = wheelFor(K, ctx.vehicle); wf.wheel.position.y = wf.r; root.add(wf.wheel);
      root.add(K.FX.contactShadow(0.9, 0.5, 0.5));
      var va = -PI / 3.2, vz = wf.w * 0.3;
      var v = valve(K, wf.rim * 0.9, va, vz); wf.wheel.add(v);
      var vWorld = new THREE.Vector3(Math.cos(va) * wf.rim * 0.9, Math.sin(va) * wf.rim * 0.9 + wf.r, vz);
      // gauge
      var gauge = new THREE.Group();
      var body = K.mesh(K.G.rbox(0.06, 0.12, 0.03, 0.01), 'toolBlue'); body.position.y = 0.08; gauge.add(body);
      var chuck = K.mesh(K.G.cyl(0.009, 0.03, 16), 'chrome'); chuck.position.y = 0.01; gauge.add(chuck);
      var dial = K.FX.canvasPanel(0.05, 0.05, function (c, W, H, st) {
        c.fillStyle = '#0d1a24'; c.beginPath(); c.arc(W / 2, H / 2, W / 2 - 2, 0, PI * 2); c.fill();
        c.fillStyle = '#9fe2bf'; c.font = '700 ' + Math.round(H * 0.26) + 'px system-ui'; c.textAlign = 'center';
        c.fillText(st ? st.toFixed(1) : '--', W / 2, H * 0.55); c.font = '600 ' + Math.round(H * 0.14) + 'px system-ui'; c.fillText('bar', W / 2, H * 0.78);
      }, { px: 256, state: 0 });
      dial.position.set(0, 0.095, 0.0155); gauge.add(dial);
      root.add(gauge);
      var dir = new THREE.Vector3(Math.cos(va), Math.sin(va), 0.6).normalize();
      return {
        root: root,
        cameraPath: function () { return { pos: [vWorld.x + 0.45, vWorld.y + 0.25, 0.75], target: [vWorld.x + 0.05, vWorld.y + 0.06, vWorld.z] }; },
        update: function (t) {
          var capOff = T.seg(t, 0.6, 1.6);
          v.userData.cap.visible = capOff < 0.95;
          var press = T.seg(t, 1.8, 3.0) * (1 - T.seg(t, 6.6, 7.4));
          var p = vWorld.clone().addScaledVector(dir, 0.06 + 0.12 * (1 - press));
          gauge.position.copy(p);
          gauge.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.clone().negate());
          var reading = press > 0.95 ? (t < 4.8 ? 2.1 : 2.4) : 0;
          dial.userData.redraw(Math.round(reading * 10) / 10);
          v.userData.cap.visible = t < 1.6 || t > 7.4;
        },
        labels: [
          { text: V('ventilek', 'valve'), at: vWorld.clone().add(new THREE.Vector3(0.02, -0.04, 0.03)), show: [0, 1.8] },
          { text: V('2,1 bar – málo!', '2.1 bar – too low!'), at: function () { return gauge.position.clone().add(new THREE.Vector3(0, 0.16, 0)); }, show: [3.2, 4.8], level: 'danger' },
          { text: V('dohuštěno na předpis ✔', 'inflated to spec ✔'), at: function () { return gauge.position.clone().add(new THREE.Vector3(0, 0.16, 0)); }, show: [4.9, 6.6], level: 'ok' }
        ],
        captions: [
          { text: V('Měřit ZA STUDENA (ujeto < 2 km), všechna 4 kola + rezerva', 'Measure COLD (driven < 2 km), all 4 wheels + spare') },
          { text: V('Hodnota ze štítku vozu, ne z boku pneumatiky (to je maximum!)', 'Use the car\'s sticker value, not the tyre sidewall (that is the maximum!)'), level: 'info', show: [3, 8] }
        ]
      };
    }
  });

  /* ----------------------------------------------------------------- sticker */
  var STICKER_AT = {
    'generic': V('štítek: B-sloupek / víčko nádrže', 'sticker: B-pillar / fuel flap'),
    'mb-cl500-c216': V('štítek: víčko nádrže (ověřit)', 'sticker: fuel filler flap (verify)'),
    'volvo-xc60-b4': V('štítek: B-sloupek řidiče (ověřit)', 'sticker: driver B-pillar (verify)'),
    'skoda-octavia-rs-tdi': V('štítek: víčko nádrže (ověřit)', 'sticker: fuel filler flap (verify)'),
    'toyota-gr-yaris': V('štítek: B-sloupek řidiče (ověřit)', 'sticker: driver B-pillar (verify)'),
    'citroen-jumper-22hdi': V('štítek: rám dveří / příručka (ověřit)', 'sticker: door frame / manual (verify)')
  };
  R('tyres.sticker', {
    duration: 6, camera: { pos: [0.25, 1.05, 0.75], target: [0, 0.95, 0], fov: 34 }, shadow: 1.2, thumbT: 3, ground: true,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var pillar = K.mesh(K.G.rbox(0.12, 0.9, 0.05, 0.01), K.M.carPaint(K.carSpec(ctx.vehicle).paint)); pillar.position.y = 0.95; root.add(pillar);
      var seal = K.mesh(K.G.rbox(0.135, 0.92, 0.02, 0.008), 'rubber'); seal.position.set(0, 0.95, -0.03); root.add(seal);
      var load = ctx.vehicle === 'citroen-jumper-22hdi';
      var panel = K.FX.canvasPanel(0.1, 0.14, function (c, W, H) {
        c.fillStyle = '#f4f1e8'; c.fillRect(0, 0, W, H); c.strokeStyle = '#333'; c.lineWidth = 4; c.strokeRect(4, 4, W - 8, H - 8);
        c.fillStyle = '#111'; c.textAlign = 'center'; c.font = '800 ' + Math.round(H * 0.07) + 'px system-ui';
        c.fillText(S.t(V('TLAK V PNEU', 'TYRE PRESSURE')), W / 2, H * 0.12);
        c.font = '600 ' + Math.round(H * 0.05) + 'px system-ui';
        var rows = load ? [['', 'F', 'R'], ['½', 'x.x', 'x.x'], ['MAX', 'x.x', 'x.x']] : [['', 'F', 'R'], ['🧍', 'x.x', 'x.x'], ['🧍🧍🧍', 'x.x', 'x.x'], ['ECO', 'x.x', 'x.x']];
        rows.forEach(function (r, i) {
          r.forEach(function (cell, j) { c.fillText(cell, W * (0.2 + j * 0.3), H * (0.27 + i * 0.16)); });
          c.fillRect(W * 0.08, H * (0.3 + i * 0.16), W * 0.84, 2);
        });
        c.font = '600 ' + Math.round(H * 0.045) + 'px system-ui'; c.fillText('bar / kPa / psi', W / 2, H * 0.93);
      }, { px: 360 });
      panel.position.set(0, 1.0, 0.0265); root.add(panel);
      var frame = K.mesh(K.G.torus(0.09, 0.004, PI * 2, 40), K.M.clone('hiAccent')); frame.position.set(0, 1.0, 0.03); frame.scale.set(0.7, 0.95, 1); root.add(frame);
      return {
        root: root,
        update: function (t) { frame.material.emissiveIntensity = 0.3 + 0.6 * Math.abs(Math.sin(t * 2)); },
        labels: [{ text: STICKER_AT[ctx.vehicle] || STICKER_AT.generic, at: [0, 1.12, 0.03], level: 'accent' }],
        captions: [
          { text: V('Předepsaný tlak najdete na štítku vozu a v příručce', 'The specified pressure is on the car\'s sticker and in the manual') },
          { text: load ? V('Dodávka: tlak podle zatížení – plně naložená = vyšší tlak (zejména vzadu)', 'Van: pressure depends on load – fully loaded = higher pressure (especially rear)')
            : V('Plně obsazený vůz / dálnice = vyšší tlak dle štítku', 'Fully loaded car / motorway = higher pressure per sticker'), level: 'info', show: [2, 6] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------- tread depth */
  function treadSlab(K, worn) {
    var g = new THREE.Group();
    var base = K.mesh(K.G.box(0.26, 0.012, 0.24), 'tire'); base.position.y = 0.006; g.add(base);
    var depth = worn ? 0.003 : 0.007;
    var ribs = [-0.09, -0.045, 0, 0.045, 0.09];
    ribs.forEach(function (z) {
      for (var i = 0; i < 6; i++) {
        var blk = K.mesh(K.G.rbox(0.036, depth, 0.032, 0.002), 'tire');
        blk.position.set(-0.11 + i * 0.044, 0.012 + depth / 2, z); g.add(blk);
      }
    });
    // tread wear indicator in a groove
    var twi = K.mesh(K.G.box(0.02, 0.0016, 0.012), 'rubber'); twi.position.set(0.0, 0.0128, 0.0225); g.add(twi);
    g.userData.top = 0.012 + depth; g.userData.twi = twi;
    return g;
  }
  R('tyres.tread', {
    duration: 9, camera: { pos: [0.2, 0.24, 0.32], target: [0, 0.03, 0.02], fov: 34 }, shadow: 0.5, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var good = treadSlab(K, false); root.add(good);
      var worn = treadSlab(K, true); worn.visible = false; root.add(worn);
      var gauge = new THREE.Group();
      var bodyG = K.mesh(K.G.rbox(0.03, 0.08, 0.016, 0.004), 'toolYellow'); bodyG.position.y = 0.06; gauge.add(bodyG);
      var probe = K.mesh(K.G.cyl(0.0012, 0.03, 8), 'chrome'); probe.position.y = 0.006; gauge.add(probe);
      var foot = K.mesh(K.G.box(0.05, 0.004, 0.01), 'chrome'); foot.position.y = 0.021; gauge.add(foot);
      var scr = K.FX.canvasPanel(0.024, 0.014, function (c, W, H, st) {
        c.fillStyle = '#c9d6b6'; c.fillRect(0, 0, W, H); c.fillStyle = '#111'; c.font = '800 ' + Math.round(H * 0.6) + 'px monospace'; c.textAlign = 'center';
        c.fillText(st || '-.-', W / 2, H * 0.75);
      }, { px: 200, state: '' });
      scr.position.set(0, 0.075, 0.0085); gauge.add(scr);
      gauge.position.set(0, 0, 0.0225); root.add(gauge);
      return {
        root: root,
        update: function (t) {
          var wornPhase = t > 4.5;
          good.visible = !wornPhase; worn.visible = wornPhase;
          var tt = wornPhase ? t - 4.5 : t;
          var down = T.seg(tt, 0.5, 1.6) * (1 - T.seg(tt, 3.6, 4.3));
          var topY = (wornPhase ? worn : good).userData.top;
          gauge.position.y = topY - 0.006 + (1 - down) * 0.05;
          var val = wornPhase ? '1.5' : '6.8';
          scr.userData.redraw(down > 0.95 ? val : '');
        },
        labels: [
          { text: V('6,8 mm – OK', '6.8 mm – OK'), at: [0, 0.12, 0.03], show: [1.7, 4.3], level: 'ok' },
          { text: V('1,5 mm – pod zákonným minimem!', '1.5 mm – below the legal minimum!'), at: [0, 0.12, 0.03], show: [6.2, 8.8], level: 'danger' },
          { text: V('indikátor opotřebení (TWI)', 'tread wear indicator (TWI)'), at: [0.02, 0.016, 0.0225], show: [4.6, 6.2], level: 'accent' }
        ],
        captions: [
          { text: V('Měřit v hlavních drážkách na 3 místech po šířce i obvodu', 'Measure in the main grooves at 3 places across and around'), show: [0, 4.5] },
          { text: V('Min. 1,6 mm letní · zimní pneu jako zimní ≥ 4 mm (ověřit dle kategorie vozu)', 'Min. 1.6 mm summer · winter tyres count as winter at ≥ 4 mm (verify for your vehicle category)'), level: 'danger', show: [4.5, 9] }
        ]
      };
    }
  });

  /* --------------------------------------------------------------- DOT / age */
  R('tyres.dot', {
    duration: 6, camera: { pos: [0.1, 0.34, 0.45], target: [0, 0.3, 0.1], fov: 30 }, shadow: 0.8, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var wf = wheelFor(K, ctx.vehicle); wf.wheel.position.y = wf.r; root.add(wf.wheel);
      var mid = (wf.rim + wf.r) / 2;
      var oval = K.mesh(K.G.torus(0.035, 0.0025, PI * 2, 32), K.M.clone('hiAccent')); oval.scale.set(1.5, 0.6, 1);
      oval.position.set(0, wf.r + mid, wf.w * 0.545); root.add(oval);
      var code = textPanel(K, 0.12, 0.03, null, [['DOT  ABCD  EFG  2321', 0.6, '#ffffff']], { top: 0.06 });
      code.position.set(0, wf.r + mid, wf.w * 0.548); root.add(code);
      return {
        root: root,
        cameraPath: function () { return { pos: [0.1, wf.r + mid + 0.1, 0.62], target: [0, wf.r + mid - 0.02, wf.w * 0.5] }; },
        update: function (t) { oval.material.emissiveIntensity = 0.3 + 0.5 * Math.abs(Math.sin(t * 2.5)); },
        labels: [
          { text: V('23. týden 2021', 'week 23 of 2021'), at: [0.045, wf.r + mid + 0.03, wf.w * 0.55], level: 'accent' },
          { text: V('> 6 let: pečlivě kontrolovat · > 10 let: vyměnit', '> 6 years: inspect carefully · > 10 years: replace'), at: [0, wf.r + mid - 0.06, wf.w * 0.55], show: [2, 6], level: 'danger' }
        ],
        captions: [{ text: V('Stáří pneu = poslední 4 číslice kódu DOT (týden + rok)', 'Tyre age = last 4 digits of the DOT code (week + year)') }]
      };
    }
  });

  /* ----------------------------------------------------------------- damage */
  R('tyres.damage', {
    duration: 9, camera: { pos: [0.5, 0.48, 0.75], target: [0, 0.32, 0.05], fov: 34 }, shadow: 1, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var wf = wheelFor(K, ctx.vehicle); wf.wheel.position.y = wf.r; root.add(wf.wheel);
      root.add(K.FX.contactShadow(0.9, 0.5, 0.5));
      var mid = (wf.rim + wf.r) / 2;
      var bulge = K.mesh(K.G.sphere(0.03, 20), 'tire'); bulge.scale.set(1, 1.3, 0.45);
      bulge.position.set(Math.cos(PI * 0.25) * mid, wf.r + Math.sin(PI * 0.25) * mid, wf.w * 0.52); root.add(bulge);
      var cracks = new THREE.Group();
      for (var i = 0; i < 7; i++) {
        var cr = K.mesh(K.G.box(0.03, 0.0015, 0.002), 'blackOxide');
        var a = PI * 0.75 + i * 0.05; cr.position.set(Math.cos(a) * (mid - 0.01), wf.r + Math.sin(a) * (mid - 0.01), wf.w * 0.535); cr.rotation.z = a + PI / 2 + (i % 2 ? 0.3 : -0.2);
        cracks.add(cr);
      }
      root.add(cracks);
      var nail = new THREE.Group();
      var head = K.mesh(K.G.cyl(0.006, 0.002, 16), 'steel'); nail.add(head);
      nail.position.set(0.05, wf.r * 2 + 0.001, 0.02); root.add(nail);
      var focus = [
        bulge.position.clone(), cracks.children[3].position.clone(), nail.position.clone()
      ];
      return {
        root: root,
        cameraPath: function () { return { pos: [0.6, wf.r + 0.55, 1.15], target: [0, wf.r + 0.05, 0.05] }; },
        update: function (t) { var k = Math.floor(t / 3); [bulge, cracks, nail].forEach(function (o, i) { o.scale.x = (i === 0 ? 1 : 1) * (k === i ? 1.0 + 0.1 * Math.sin(t * 8) : 1); }); },
        labels: [
          { text: V('boule = poškozená kostra → ihned vyměnit', 'bulge = damaged carcass → replace now'), at: focus[0].clone().add(new THREE.Vector3(0, 0.05, 0)), show: [0, 3], level: 'danger' },
          { text: V('praskliny ve vzorku / boku = stáří', 'cracks in tread / sidewall = age'), at: focus[1].clone().add(new THREE.Vector3(0, 0.04, 0)), show: [3, 6], level: 'accent' },
          { text: V('hřebík: nevytahovat, do pneuservisu', 'nail: do not pull it out, go to a tyre shop'), at: focus[2].clone().add(new THREE.Vector3(0, 0.05, 0)), show: [6, 9], level: 'accent' }
        ],
        captions: [
          { text: V('Prohlédněte celý obvod – kolo protočte nebo popojeďte', 'Inspect the full circumference – turn the wheel or roll the car') },
          { text: V('Poškozený bok se neopravuje – jen výměna', 'A damaged sidewall cannot be repaired – replace only'), level: 'danger', show: [2, 9] }
        ]
      };
    }
  });

  /* --------------------------------------------------------------- rotation */
  R('tyres.rotation', {
    duration: 8, camera: { pos: [0.01, 7.2, 0.5], target: [0, 0, 0], fov: 34 }, shadow: 3.5, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var fade = K.FX.fader(c.body); fade(0.35);
      var d = c.dims, tz = d.track / 2;
      var pos = { FL: [d.xf, tz], FR: [d.xf, -tz], RL: [d.xr, tz], RR: [d.xr, -tz] };
      var drive = DRIVE[ctx.vehicle] || 'fwd';
      var staggered = ctx.vehicle === 'mb-cl500-c216';
      // moves: [from, to]
      var moves;
      if (drive === 'fwd') moves = [['FL', 'RL'], ['FR', 'RR'], ['RL', 'FR'], ['RR', 'FL']];
      else if (drive === 'rwd') moves = staggered ? [['FL', 'FR'], ['FR', 'FL'], ['RL', 'RR'], ['RR', 'RL']] : [['RL', 'FL'], ['RR', 'FR'], ['FL', 'RR'], ['FR', 'RL']];
      else moves = [['FL', 'RR'], ['FR', 'RL'], ['RL', 'FR'], ['RR', 'FL']];
      var arrows = moves.map(function (m, i) {
        var a = pos[m[0]], b = pos[m[1]];
        var off = 0.18 * (i % 2 ? 1 : -1);
        var g = K.FX.arrow([a[0] + off * 0.3, d.H + 0.15, a[1] * 0.85], [b[0] - off * 0.3, d.H + 0.15, b[1] * 0.85], [0xf5a524, 0x3e8ed0, 0x30a46c, 0xe5484d][i], 0.035);
        root.add(g); return g;
      });
      var cap = drive === 'fwd' ? V('Přední pohon: přední dozadu rovně, zadní dopředu křížem', 'FWD: fronts straight back, rears forward crossed')
        : drive === 'rwd' ? (staggered ? V('Rozdílné rozměry vpředu/vzadu? Pak jen vlevo↔vpravo (nesměrové) nebo vůbec – ověřit!', 'Different front/rear sizes? Then only left↔right (non-directional) or not at all – verify!')
          : V('Zadní pohon: zadní dopředu rovně, přední dozadu křížem', 'RWD: rears straight forward, fronts back crossed'))
          : V('4×4: všechna kola stejná a stejně sjetá – výměna do X nebo dle příručky', 'AWD: all tyres identical and evenly worn – X pattern or per manual');
      return {
        root: root,
        cameraPath: function () { return { pos: [0.01, d.L * 1.35 + 1.2, 0.5], target: [0, 0, 0] }; },
        update: function (t) { arrows.forEach(function (a, i) { a.visible = t > 0.5 + i * 0.8; }); },
        labels: [
          { text: V('PŘEDEK', 'FRONT'), at: [d.front + 0.2, 0.3, 0], level: 'accent' }
        ],
        captions: [
          { text: cap, level: staggered ? 'danger' : null },
          { text: V('Směrové pneu (šipka na boku): jen dopředu↔dozadu na stejné straně', 'Directional tyres (arrow on sidewall): only front↔rear on the same side'), level: 'info', show: [3.5, 8] },
          drive === 'awd' ? { text: V('4×4: rozdíl obvodu pneu zatěžuje spojku pohonu – nikdy jen 1–2 nové pneu', 'AWD: tyre circumference differences stress the AWD coupling – never just 1–2 new tyres'), level: 'danger', show: [5, 8] }
            : { text: V('Interval cca každých 10 000 km (ověřit v příručce)', 'Interval approx. every 10,000 km (verify in the manual)'), show: [5, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------- TPMS */
  var TPMS_HOW = {
    'generic': V('menu vozu / tlačítko SET', 'car menu / SET button'),
    'mb-cl500-c216': V('menu přístrojovky – pokud je TPMS (ověřit)', 'cluster menu – if TPMS fitted (verify)'),
    'volvo-xc60-b4': V('centrální displej – kalibrace TPMS (ověřit)', 'centre display – TPMS calibration (verify)'),
    'skoda-octavia-rs-tdi': V('tlačítko SET / menu – pokud je (ověřit)', 'SET button / menu – if fitted (verify)'),
    'toyota-gr-yaris': V('menu MID – inicializace TPMS (ověřit)', 'MID menu – TPMS initialisation (verify)'),
    'citroen-jumper-22hdi': V('pravděpodobně bez TPMS (ověřit)', 'probably no TPMS (verify)')
  };
  R('tyres.tpms', {
    duration: 7, camera: { pos: [0, 0.02, 0.62], target: [0, 0, 0], fov: 32 }, ground: false, shadow: 0.6, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bezel = K.mesh(K.G.rbox(0.5, 0.26, 0.04, 0.03), 'plasticBlack'); bezel.position.z = -0.025; root.add(bezel);
      var scr = K.FX.canvasPanel(0.44, 0.2, function (c, W, H, st) {
        c.fillStyle = '#0b1218'; c.fillRect(0, 0, W, H);
        // tyre warning icon
        c.strokeStyle = st < 2 ? '#f5c518' : '#3b4652'; c.lineWidth = 8; c.beginPath();
        c.moveTo(W * 0.12, H * 0.25); c.quadraticCurveTo(W * 0.08, H * 0.55, W * 0.12, H * 0.8); c.lineTo(W * 0.32, H * 0.8); c.quadraticCurveTo(W * 0.36, H * 0.55, W * 0.32, H * 0.25); c.stroke();
        c.fillStyle = st < 2 ? '#f5c518' : '#3b4652'; c.font = '800 ' + Math.round(H * 0.3) + 'px system-ui'; c.textAlign = 'center'; c.fillText('!', W * 0.22, H * 0.68);
        c.fillStyle = '#e9edf3'; c.textAlign = 'left'; c.font = '700 ' + Math.round(H * 0.11) + 'px system-ui';
        var lines = st === 0 ? [S.t(V('Zkontrolujte tlak v pneu', 'Check tyre pressure'))] : st === 1 ? [S.t(V('Tlak upraven →', 'Pressure adjusted →')), S.t(V('Kalibrovat / uložit?', 'Calibrate / store?'))] : [S.t(V('Kalibrace TPMS…', 'TPMS calibration…')), S.t(V('dokončí se během jízdy', 'completes while driving'))];
        lines.forEach(function (l, i) { c.fillText(l, W * 0.42, H * (0.42 + i * 0.18)); });
        if (st === 2) { c.fillStyle = '#30a46c'; c.fillRect(W * 0.42, H * 0.8, W * 0.45, H * 0.06); }
      }, { px: 600, state: 0 });
      root.add(scr);
      return {
        root: root,
        update: function (t) { scr.userData.redraw(t < 2.3 ? 0 : (t < 4.6 ? 1 : 2)); },
        captions: [
          { text: { cs: 'Reset / kalibrace: ' + S.t(TPMS_HOW[ctx.vehicle] || TPMS_HOW.generic), en: 'Reset / calibration: ' + S.t(TPMS_HOW[ctx.vehicle] || TPMS_HOW.generic) } },
          { text: V('Kalibrujte AŽ po nahuštění všech kol na správný tlak', 'Calibrate ONLY after setting all tyres to the correct pressure'), level: 'danger', show: [2.3, 7] }
        ]
      };
    }
  });

  /* ---------------------------------------------------------------- storage */
  R('tyres.storage', {
    duration: 6, camera: { pos: [1.5, 1.1, 1.9], target: [0.1, 0.35, 0], fov: 34 }, shadow: 1.5, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var s = K.carSpec(ctx.vehicle);
      // on rims: stacked flat
      for (var i = 0; i < 4; i++) {
        var w = K.P.wheel({ r: s.wr, w: s.tw, rim: s.wr * 0.7, rimMat: s.rim || 'rimSilver' });
        w.rotation.x = -PI / 2; w.position.set(-0.45, s.tw / 2 + i * (s.tw + 0.005), 0); root.add(w);
      }
      // without rims: upright on a rack
      for (var j = 0; j < 3; j++) {
        var tyre = K.mesh(K.G.torus(s.wr - 0.06, 0.07, PI * 2, 40), 'tire'); tyre.scale.z = s.tw / 0.14;
        tyre.position.set(0.5, s.wr + 0.02, -0.25 + j * (s.tw + 0.02)); root.add(tyre);
      }
      var rack = K.mesh(K.G.box(0.08, 0.02, 0.9), 'steelDark'); rack.position.set(0.5, 0.01, 0); root.add(rack);
      root.add(K.FX.contactShadow(2, 1.2, 0.4));
      var tag = textPanel(K, 0.12, 0.05, '#f2b705', [[V('LP ↖', 'FL ↖'), 0.6, '#111']], { top: 0.1 });
      tag.position.set(-0.45, 4 * (s.tw + 0.005) + 0.002, 0.1); tag.rotation.x = -PI / 2; root.add(tag);
      return {
        root: root,
        labels: [
          { text: V('s disky: naležato na sobě', 'on rims: stacked flat'), at: [-0.45, 4 * (s.tw + 0.01) + 0.08, 0], level: 'ok' },
          { text: V('bez disků: nastojato, občas pootočit', 'without rims: upright, rotate now and then'), at: [0.5, 2 * s.wr + 0.1, 0], level: 'ok' }
        ],
        captions: [
          { text: V('Suché, tmavé a chladné místo, mimo oleje a rozpouštědla', 'Dry, dark and cool place, away from oils and solvents') },
          { text: V('Označte polohu kola (např. LP = levé přední)', 'Mark each wheel\'s position (e.g. FL = front left)'), level: 'info', show: [2, 6] }
        ]
      };
    }
  });
})(window.STU);
