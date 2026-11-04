/* 3D scenes: diesel fuel filter (water drain, replacement, priming).
 * Also defines S.n5 – small shared helpers used by the egr-dpf / injectors / turbo / head-gasket scene files
 * (only called while a scene is being built, so script order does not matter). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

  /* ================================================================ helpers */
  var H = S.n5 = S.n5 || {};

  /** Workbench top at y = 0. */
  H.bench = function (K, w, d) {
    var g = new THREE.Group();
    var top = K.mesh(K.G.rbox(w || 1.2, 0.04, d || 0.7, 0.01), K.M.clone('wood', { color: 0x6f6a63, roughness: 0.85 }));
    top.position.y = -0.02; g.add(top);
    return g;
  };

  /** Draw a simple device screen. spec = { title, rows:[{t, r, c, rc, bg}], bars:[{l, v, c}], progress, big, bigC, foot } */
  H.drawScreen = function (x, W, H2, spec) {
    spec = spec || {};
    if (S.d3 && S.d3.ui && !spec.bars) { S.d3.ui(x, W, H2, spec); return; }
    var u = W / 100;
    x.fillStyle = '#0b1620'; x.fillRect(0, 0, W, H2);
    x.fillStyle = '#1d4f73'; x.fillRect(0, 0, W, u * 11);
    x.fillStyle = '#eaf3fb'; x.font = 'bold ' + (u * 6) + 'px ' + FONT; x.textBaseline = 'middle';
    x.fillText(spec.title || '', u * 3, u * 5.6);
    var y = u * 15;
    (spec.rows || []).forEach(function (r) {
      if (r.bg) { x.fillStyle = r.bg; x.fillRect(u * 2, y - u * 4, W - u * 4, u * 8); }
      x.fillStyle = r.c || '#d7e3ee'; x.font = (u * 5) + 'px ' + FONT; x.textAlign = 'left';
      x.fillText(r.t, u * 4, y);
      if (r.r != null) { x.textAlign = 'right'; x.fillStyle = r.rc || '#9fd3f2'; x.fillText(r.r, W - u * 4, y); x.textAlign = 'left'; }
      y += u * 9;
    });
    if (spec.bars) {
      var n = spec.bars.length, bw = (W - u * 16) / n, base = H2 - u * 14, maxH = base - y - u * 2;
      x.strokeStyle = '#30a46c'; x.setLineDash([u, u]); x.beginPath(); x.moveTo(u * 6, base - maxH * 0.5 - maxH * 0.18); x.lineTo(W - u * 6, base - maxH * 0.5 - maxH * 0.18);
      x.moveTo(u * 6, base - maxH * 0.5 + maxH * 0.18); x.lineTo(W - u * 6, base - maxH * 0.5 + maxH * 0.18); x.stroke(); x.setLineDash([]);
      spec.bars.forEach(function (b, i) {
        var hgt = maxH * 0.5 + maxH * 0.5 * Math.max(-1, Math.min(1, b.v));
        x.fillStyle = b.c || '#3e8ed0';
        x.fillRect(u * 8 + i * bw + bw * 0.2, base - hgt, bw * 0.6, hgt);
        x.fillStyle = '#d7e3ee'; x.font = (u * 4.6) + 'px ' + FONT; x.textAlign = 'center';
        x.fillText(b.l, u * 8 + i * bw + bw * 0.5, base + u * 5);
        x.textAlign = 'left';
      });
    }
    if (spec.progress != null) {
      x.fillStyle = '#26384a'; x.fillRect(u * 6, H2 - u * 22, W - u * 12, u * 5);
      x.fillStyle = spec.progressC || '#30a46c'; x.fillRect(u * 6, H2 - u * 22, (W - u * 12) * spec.progress, u * 5);
    }
    if (spec.big) {
      x.fillStyle = spec.bigC || '#30a46c'; x.font = 'bold ' + (u * 11) + 'px ' + FONT; x.textAlign = 'center';
      x.fillText(spec.big, W / 2, H2 * 0.62); x.textAlign = 'left';
    }
    if (spec.foot) { x.fillStyle = '#9aa5b8'; x.font = (u * 4.4) + 'px ' + FONT; x.fillText(spec.foot, u * 3, H2 - u * 4); }
  };

  /** Hand-held scan tool with a screen. Returns { group, set(spec) } – call set only when the content changes. */
  H.scanner = function (K, spec) {
    var g = new THREE.Group();
    var shell = K.mesh(K.G.rbox(0.2, 0.3, 0.04, 0.02), K.M.clone('plasticBlack', { color: 0x23262b })); g.add(shell);
    var bump = K.mesh(K.G.rbox(0.214, 0.314, 0.026, 0.012), K.M.clone('toolYellow', { color: 0xe0a100 })); bump.position.z = -0.01; g.add(bump);
    var bezel = K.mesh(K.G.rbox(0.172, 0.18, 0.006, 0.002), 'blackGloss'); bezel.position.set(0, 0.045, 0.021); g.add(bezel);
    var screen = K.FX.canvasPanel(0.16, 0.168, function (x, W, H2, st) { H.drawScreen(x, W, H2, st); }, { px: 512, state: spec });
    screen.position.set(0, 0.045, 0.025); g.add(screen);
    for (var i = 0; i < 3; i++) { var b = K.mesh(K.G.cylZ(0.012, 0.008, 20), i === 1 ? 'hiOk' : 'plasticGrey'); b.position.set(-0.05 + i * 0.05, -0.1, 0.022); g.add(b); }
    var cable = K.mesh(K.G.tube([[0, -0.15, 0], [0.02, -0.22, -0.03], [0.1, -0.28, -0.08], [0.25, -0.3, -0.12]], 0.006), 'rubber'); g.add(cable);
    return { group: g, set: function (st) { screen.userData.redraw(st); } };
  };

  /** Text sign / info panel. lines: [string] or [{t, c}] */
  H.sign = function (K, w, h, lines, opts) {
    opts = opts || {};
    return K.FX.canvasPanel(w, h, function (x, W, H2, st) {
      x.fillStyle = opts.bg || '#f4f5f7'; x.fillRect(0, 0, W, H2);
      x.strokeStyle = opts.border || '#c9282d'; x.lineWidth = W * 0.03; x.strokeRect(W * 0.015, W * 0.015, W - W * 0.03, H2 - W * 0.03);
      var L = st || lines, lh = H2 / (L.length + 1);
      L.forEach(function (l, i) {
        var o = typeof l === 'string' ? { t: l } : l;
        x.fillStyle = o.c || '#151a22'; x.font = 'bold ' + Math.round(lh * (o.s || 0.55)) + 'px ' + FONT; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText(o.t, W / 2, lh * (i + 1));
      });
    }, { px: opts.px || 512, state: lines });
  };

  /** Glass jar / measuring vessel with two liquid layers. setLevels(bottom, top) in metres of height. */
  H.jar = function (K, r, h, matBottom, matTop) {
    var g = new THREE.Group();
    var glass = K.mesh(K.G.lathe([[r * 0.9, 0], [r, 0.004], [r, h], [r * 0.97, h], [r * 0.97, 0.006], [0, 0.006]], 32), K.M.clone('glassClear', { side: THREE.DoubleSide, opacity: 0.28 }));
    glass.userData.noShadow = true; g.add(glass);
    var lb = K.mesh(K.G.cyl(r * 0.93, 1, 28), matBottom || 'water'); lb.userData.noShadow = true; g.add(lb);
    var lt = K.mesh(K.G.cyl(r * 0.93, 1, 28), matTop || 'oil'); lt.userData.noShadow = true; g.add(lt);
    function setLevels(b, t) {
      b = Math.max(0.0005, b); t = Math.max(0.0005, t);
      lb.scale.y = b; lb.position.y = 0.006 + b / 2; lb.visible = b > 0.001;
      lt.scale.y = t; lt.position.y = 0.006 + b + t / 2; lt.visible = t > 0.001;
    }
    setLevels(0, 0);
    return { group: g, setLevels: setLevels };
  };

  /** Particles flowing along a 3D polyline. Returns { group, update(t, on, speed) } */
  H.flow = function (K, pts, mat, count, r) {
    var curve = new THREE.CatmullRomCurve3(pts.map(K.v3));
    var g = new THREE.Group(), list = [];
    count = count || 14;
    for (var i = 0; i < count; i++) {
      var p = K.mesh(K.G.sphere(r || 0.008, 10), mat);
      p.userData.noShadow = true; p.userData.o = i / count;
      g.add(p); list.push(p);
    }
    return {
      group: g, curve: curve,
      update: function (t, on, speed) {
        list.forEach(function (p) {
          var k = (t * (speed || 0.25) + p.userData.o) % 1;
          p.visible = on !== false;
          p.position.copy(curve.getPointAt(k));
        });
      }
    };
  };

  /** Simple pipe along points. */
  H.pipe = function (K, pts, r, mat) { return K.mesh(K.G.tube(pts, r || 0.02, false, Math.max(24, pts.length * 16), 12), mat || 'steelDark'); };

  /** Car with the body faded (to show where something sits). Returns { root, car, fade(k) } */
  H.ghostCar = function (K, vid, opacity) {
    var c = K.car(vid);
    var f = K.FX.fader(c.body);
    f(opacity == null ? 0.3 : opacity);
    return { root: c.group, car: c, fade: f };
  };

  /** Camera that frames a whole vehicle from a 3/4 front angle (works for the big van too). */
  H.carCam = function (K, vid, side) {
    var sp = K.carSpec(vid), L = sp.L, Hh = sp.H;
    var d = Math.max(L * 1.05, Hh * 2.4);
    return { pos: [d * 0.55, Hh * 0.9 + 0.6, (side || 1) * d * 0.85], target: [0.2, Hh * 0.42, 0], fov: 34 };
  };

  /* ========================================================== filter model */
  /** Diesel filter housing on a bracket: body, lid with in/out connectors + hand primer, water drain screw.
   *  y = 0 is the bottom of the housing. Returns parts in userData. */
  function filterHousing(K, opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var body = K.mesh(K.G.lathe([[0.0, 0], [0.05, 0], [0.058, 0.012], [0.058, 0.17], [0.062, 0.175], [0.062, 0.185], [0, 0.185]], 40), 'aluCast');
    g.add(body);
    // translucent water bowl band at the bottom
    var bowl = K.mesh(K.G.cyl(0.0585, 0.04, 40), K.M.clone('glassClear', { opacity: 0.35 })); bowl.position.y = 0.03; bowl.userData.noShadow = true; g.add(bowl);
    var water = K.mesh(K.G.cyl(0.055, 1, 32), 'water'); water.position.y = 0.03; water.scale.y = 0.02; g.add(water);
    // drain screw + water sensor plug
    var drain = new THREE.Group();
    var dh = K.mesh(K.G.cyl(0.012, 0.016, 20), 'plasticBlack'); dh.position.y = -0.008; drain.add(dh);
    var wing = K.mesh(K.G.box(0.034, 0.012, 0.006), 'plasticBlack'); wing.position.y = -0.02; drain.add(wing);
    g.add(drain);
    var wsens = K.mesh(K.G.rbox(0.02, 0.016, 0.022, 0.004), 'plasticGrey'); wsens.position.set(0.034, -0.006, 0); g.add(wsens);
    // lid
    var lid = new THREE.Group();
    var lb = K.mesh(K.G.lathe([[0, 0], [0.064, 0], [0.064, 0.022], [0.05, 0.03], [0, 0.03]], 40), 'plasticBlack'); lid.add(lb);
    var hex = K.mesh(K.G.hex(0.022, 0.016), 'plasticBlack'); hex.position.y = 0.036; lid.add(hex);
    var ports = [];
    [-1, 1].forEach(function (s) {
      var n = K.mesh(K.G.cylX(0.009, 0.05, 16), 'plasticTex'); n.position.set(s * 0.07, 0.016, 0); lid.add(n);
      var qc = new THREE.Group();
      var qb = K.mesh(K.G.rbox(0.028, 0.024, 0.024, 0.006), s < 0 ? 'toolBlue' : 'plasticGrey'); qc.add(qb);
      var tab = K.mesh(K.G.box(0.008, 0.01, 0.026), 'plasticWhite'); tab.position.y = 0.014; qc.add(tab);
      qc.position.set(s * 0.1, 0.016, 0); lid.add(qc);
      ports.push(qc);
    });
    var primer = null;
    if (opts.primer !== false) {
      primer = new THREE.Group();
      var dome = K.mesh(K.G.sphere(0.024, 20), 'rubber'); dome.scale.y = 0.7; primer.add(dome);
      primer.position.set(0, 0.03, 0.04); lid.add(primer);
    }
    lid.position.y = 0.185; g.add(lid);
    // bracket
    var br = K.mesh(K.G.rbox(0.03, 0.16, 0.08, 0.008), 'blackOxide'); br.position.set(0, 0.1, -0.075); g.add(br);
    var band = K.mesh(K.G.torus(0.06, 0.006, PI * 2, 40), 'blackOxide'); band.rotation.x = PI / 2; band.position.y = 0.11; g.add(band);
    // filter element (inside, shown when the lid is off)
    var el = K.P.filterCartridge(false, 0.14); el.position.y = 0.1; el.visible = false; g.add(el);
    var old = K.P.filterCartridge(true, 0.14); old.position.y = 0.1; old.visible = false; g.add(old);
    var oring = K.mesh(K.G.torus(0.058, 0.004, PI * 2, 40), K.M.clone('rubber')); oring.rotation.x = PI / 2; oring.position.y = 0.186; g.add(oring);
    var fuel = K.mesh(K.G.cyl(0.054, 1, 32), K.M.clone('oil', { color: 0xd8c27a, opacity: 0.7 })); fuel.userData.noShadow = true; fuel.visible = false; g.add(fuel);
    g.userData = { lid: lid, drain: drain, water: water, ports: ports, primer: primer, element: el, oldElement: old, oring: oring, fuel: fuel };
    return g;
  }
  H.filterHousing = filterHousing;

  function rig(ctx, K, y) {
    y = y || 0.06;
    var root = new THREE.Group();
    root.add(H.bench(K, 1.0, 0.6));
    var stand = K.mesh(K.G.rbox(0.12, y, 0.12, 0.01), 'plasticGrey'); stand.position.set(0, y / 2, -0.1); root.add(stand);
    var f = filterHousing(K, { primer: ctx.vehicle !== 'skoda-octavia-rs-tdi' });
    f.position.set(0, y, 0); root.add(f);
    var up = new THREE.Group(); up.position.y = y - 0.06; root.add(up);
    // fuel lines from tank (left) and to the high-pressure pump (right)
    var lineIn = H.pipe(K, [[-0.5, 0.05, 0.1], [-0.3, 0.12, 0.05], [-0.15, 0.27, 0], [-0.1, 0.262, 0]], 0.007, 'rubber');
    var lineOut = H.pipe(K, [[0.1, 0.262, 0], [0.18, 0.28, 0], [0.35, 0.16, 0.05], [0.5, 0.06, 0.1]], 0.007, 'rubber');
    up.add(lineIn); up.add(lineOut);
    return { root: root, f: f, lineIn: lineIn, lineOut: lineOut };
  }

  var CAM = { pos: [0.42, 0.5, 0.62], target: [0, 0.17, 0], fov: 34 };

  R('fuel-filter.overview', {
    duration: 8, camera: CAM, shadow: 0.8, thumbT: 3,
    build: function (ctx, K) {
      var r = rig(ctx, K), u = r.f.userData;
      var flowIn = H.flow(K, [[-0.5, 0.05, 0.1], [-0.3, 0.12, 0.05], [-0.15, 0.27, 0], [-0.1, 0.262, 0]], K.M.clone('oil', { color: 0xd8b25a }), 10, 0.009);
      var flowOut = H.flow(K, [[0.1, 0.262, 0], [0.18, 0.28, 0], [0.35, 0.16, 0.05], [0.5, 0.06, 0.1]], K.M.clone('oil', { color: 0xf0d27a }), 10, 0.009);
      r.root.add(flowIn.group); r.root.add(flowOut.group);
      u.water.scale.y = 0.018;
      var glowW = K.FX.glow(u.drain, 0x3e8ed0);
      return {
        root: r.root,
        update: function (t) { flowIn.update(t, true, 0.22); flowOut.update(t, true, 0.22); glowW(T(t)); }
      };
      function T(t) { return 0.5 + 0.5 * Math.sin(t * 3); }
    },
    labels: null
  });
  // labels/captions for overview (added after definition for readability)
  (function () {
    var def = S.scenes['fuel-filter.overview'], b = def.build;
    def.build = function (ctx, K) {
      var o = b(ctx, K);
      o.labels = [
        { text: V('z nádrže (nízký tlak)', 'from the tank (low pressure)'), at: [-0.36, 0.14, 0.08] },
        { text: V('k vysokotlakému čerpadlu', 'to the high-pressure pump'), at: [0.36, 0.2, 0.05] },
        { text: V('odlučovač vody', 'water separator'), at: [0, 0.1, 0.07], level: 'accent' },
        { text: V('vypouštěcí šroub', 'drain screw'), at: [0, 0.04, 0.03] }
      ];
      if (ctx.vehicle !== 'skoda-octavia-rs-tdi') o.labels.push({ text: V('ruční pumpička', 'hand primer'), at: [0, 0.3, 0.05] });
      o.captions = [
        { text: V('Filtr zachytí nečistoty a vodu dřív, než zničí vstřikovací systém', 'The filter catches dirt and water before they destroy the injection system') },
        { text: V('Za filtrem pracuje systém s tlakem až ~2000 bar', 'After the filter the system runs at up to ~2000 bar'), level: 'danger', show: [3, 8] }
      ];
      return o;
    };
  })();

  R('fuel-filter.prep', {
    duration: 6, camera: { pos: [0.55, 0.55, 0.75], target: [0, 0.1, 0], fov: 36 }, shadow: 0.9, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      root.add(H.bench(K, 1.1, 0.7));
      var tray = K.P.drainPan(0.16, 0.05); tray.position.set(-0.2, 0, 0.05); root.add(tray);
      var rag = K.mesh(K.G.rbox(0.2, 0.012, 0.16, 0.004), K.M.clone('fabric', { color: 0xd9d4c8 })); rag.position.set(0.15, 0.006, 0.12); rag.rotation.y = 0.3; root.add(rag);
      var glove = K.P.glove(); glove.rotation.set(-PI / 2, 0, 0.4); glove.position.set(0.25, 0.02, -0.08); glove.scale.setScalar(0.9); root.add(glove);
      var jar = H.jar(K, 0.04, 0.12); jar.group.position.set(-0.05, 0, -0.15); root.add(jar.group);
      var sign = H.sign(K, 0.26, 0.16, [{ t: '🔥 ✖', s: 0.8, c: '#c9282d' }, { t: ctx.t(V('Žádný oheň, nekouřit', 'No flames, no smoking')), s: 0.42 }]);
      sign.position.set(0.05, 0.16, -0.28); root.add(sign);
      var newF = K.P.filterCartridge(false, 0.14); newF.position.set(0.32, 0.07, 0.0); root.add(newF);
      var box = K.mesh(K.G.rbox(0.1, 0.16, 0.1, 0.004), K.M.clone('plasticWhite', { color: 0xe8e3d6 })); box.position.set(0.32, 0.08, -0.18); root.add(box);
      return {
        root: root,
        update: function (t) { sign.scale.setScalar(1 + 0.04 * Math.sin(t * 4)); newF.rotation.y = t * 0.6; },
        labels: [
          { text: V('záchytná miska', 'drip tray'), at: [-0.2, 0.08, 0.05] },
          { text: V('čisté hadry', 'clean rags'), at: [0.15, 0.04, 0.12] },
          { text: V('nový filtr + těsnění', 'new filter + seals'), at: [0.32, 0.16, 0] }
        ],
        captions: [
          { text: V('Motor studený, čisté prostředí – nečistota v naftě = zničené vstřikovače', 'Engine cold, clean area – dirt in the fuel = ruined injectors') },
          { text: V('Nafta dráždí kůži: nitrilové rukavice, brýle', 'Diesel irritates skin: nitrile gloves, glasses'), level: 'info', show: [2.5, 6] }
        ]
      };
    }
  });

  R('fuel-filter.locate', {
    duration: 6, camera: { pos: [4.4, 2.6, 3.9], target: [0.6, 0.7, 0], fov: 34 }, shadow: 3.5, thumbT: 3,
    build: function (ctx, K) {
      var g = H.ghostCar(K, ctx.vehicle, 0.32), d = g.car.dims;
      var cam = H.carCam(K, ctx.vehicle, 1);
      var marker = K.mesh(K.G.sphere(0.07, 20), K.M.clone('hiAccent', { transparent: true, opacity: 0.9 }));
      marker.position.set(d.front - (ctx.vehicle === 'citroen-jumper-22hdi' ? 0.45 : 0.6), d.hoodF - 0.2, 0.25);
      g.root.add(marker);
      var petrol = ['mb-cl500-c216', 'volvo-xc60-b4', 'toyota-gr-yaris'].indexOf(ctx.vehicle) >= 0;
      if (petrol) marker.position.set(d.xr + 0.25, 0.35, 0);
      return {
        root: g.root,
        update: function (t) { var s = 1 + 0.25 * Math.sin(t * 4); marker.scale.setScalar(s); },
        cameraPath: function () { return { pos: cam.pos, target: cam.target }; },
        labels: [{ text: petrol ? V('filtr v nádrži (modul čerpadla)', 'filter in the tank (pump module)') : V('palivový filtr – přesná poloha dle příručky', 'fuel filter – exact position per manual'), at: marker, level: 'accent' }],
        captions: [{ text: V('Poloha filtru se liší podle motoru – ověřte v dílenské příručce', 'Filter position differs per engine – verify in the workshop manual') }]
      };
    }
  });

  R('fuel-filter.drain', {
    duration: 9, camera: { pos: [0.3, 0.25, 0.55], target: [0, 0.07, 0], fov: 34 }, shadow: 0.8, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, r = rig(ctx, K, 0.16), u = r.f.userData;
      var jar = H.jar(K, 0.045, 0.1, 'water', K.M.clone('oil', { color: 0xd8c27a, opacity: 0.75 }));
      jar.group.position.set(0, 0, 0.02); r.root.add(jar.group);
      var drops = K.FX.drops(K.M.water, 8, 0.12, 0.006); drops.group.position.set(0, 0.13, 0); r.root.add(drops.group);
      return {
        root: r.root,
        update: function (t) {
          var open = T.seg(t, 0.5, 1.8) - T.seg(t, 6.6, 7.6);
          u.drain.rotation.y = -open * PI * 1.5;
          u.drain.position.y = -open * 0.008;
          var flowing = t > 1.8 && t < 6.6;
          drops.update(t, flowing, 1.6);
          var k = T.lin(t, 1.8, 6.6);
          var waterOut = Math.min(k, 0.45) / 0.45, fuelOut = Math.max(0, k - 0.45) / 0.55;
          jar.setLevels(0.025 * waterOut, 0.02 * fuelOut);
          u.water.scale.y = 0.018 * (1 - waterOut) + 0.0005;
        },
        labels: [
          { text: V('voda je těžší – teče první', 'water is heavier – drains first'), at: [0.05, 0.05, 0.03], show: [2, 5], level: 'accent' },
          { text: V('čistá nafta → zavřít', 'clean diesel → close'), at: [0.05, 0.08, 0.03], show: [5.2, 7.6], level: 'ok' }
        ],
        captions: [
          { text: V('Pod šroub nádobku, povolit o 2–3 otáčky (ne úplně vyšroubovat)', 'Container under the screw, open 2–3 turns (do not remove it)') },
          { text: V('Vypouštět, dokud neteče čistá nafta bez vody', 'Drain until clean diesel without water comes out'), show: [3, 9] }
        ]
      };
    }
  });

  R('fuel-filter.lines', {
    duration: 7, camera: CAM, shadow: 0.8, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, r = rig(ctx, K), u = r.f.userData;
      var caps = u.ports.map(function (p, i) {
        var c = K.mesh(K.G.cyl(0.012, 0.02, 16), 'hiAccent'); r.root.add(c); return c;
      });
      return {
        root: r.root,
        update: function (t) {
          u.ports.forEach(function (p, i) {
            var k = T.seg(t, 0.8 + i * 1.2, 1.8 + i * 1.2);
            p.position.y = 0.016 + k * 0.05;
            p.children[1].position.x = -Math.sin(t * 8) * 0.002 * (k > 0 && k < 1 ? 1 : 0);
          });
          caps.forEach(function (c, i) {
            var k = T.seg(t, 3.6 + i * 0.8, 4.4 + i * 0.8);
            c.visible = k > 0.01;
            c.position.set((i === 0 ? -1 : 1) * 0.1, 0.06 + 0.185 + 0.016 + 0.12 * (1 - k), 0);
          });
          r.lineIn.visible = r.lineOut.visible = true;
        },
        labels: [{ text: V('stisknout pojistku a stáhnout', 'press the latch and pull off'), at: [-0.1, 0.32, 0], show: [0.6, 3.4] },
          { text: V('zaslepit čistými krytkami', 'seal with clean caps'), at: [0.1, 0.33, 0], show: [3.6, 7], level: 'accent' }],
        captions: [
          { text: V('Rychlospojky povolit, vedení si označit (vstup / výstup)', 'Release the quick connectors, mark the lines (in / out)') },
          { text: V('Konce vedení ihned zaslepit – žádná nečistota dovnitř!', 'Cap the line ends at once – no dirt inside!'), show: [3.6, 7], level: 'danger' }
        ]
      };
    }
  });

  R('fuel-filter.remove', {
    duration: 8, camera: CAM, shadow: 0.8, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, r = rig(ctx, K), u = r.f.userData;
      var tool = K.P.ratchet(0.22, 0.022); tool.position.set(0, 0.06 + 0.185 + 0.03, 0); r.root.add(tool);
      return {
        root: r.root,
        update: function (t) {
          var unscrew = T.seg(t, 0.4, 2.4), lift = T.seg(t, 2.4, 3.6), out = T.seg(t, 3.8, 6.0);
          tool.visible = t < 2.5; tool.rotation.y = -unscrew * PI * 1.2;
          u.lid.rotation.y = -unscrew * PI * 2.4;
          u.lid.position.set(-lift * 0.18, 0.185 + unscrew * 0.01 + lift * 0.12, 0);
          u.oldElement.visible = t > 2.2;
          u.oldElement.position.set(0, 0.1 + out * 0.32, 0);
          u.oldElement.rotation.z = out * 0.3;
        },
        labels: [{ text: V('starý filtr – plný nečistot', 'old filter – full of dirt'), at: function () { return u.oldElement.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.05, 0.1, 0)); }, show: [4, 8] }],
        captions: [
          { text: V('Víko povolit, filtrační vložku vytáhnout svisle nahoru', 'Unscrew the lid, lift the element straight up') },
          { text: V('Do otevřeného pouzdra nesmí nic spadnout – zakrýt čistým hadrem', 'Nothing may fall into the open housing – cover with a clean rag'), show: [4, 8], level: 'info' }
        ]
      };
    }
  });

  R('fuel-filter.fit', {
    duration: 8, camera: CAM, shadow: 0.8, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, r = rig(ctx, K), u = r.f.userData;
      var gl = K.FX.glow(u.oring, 0x30a46c);
      return {
        root: r.root,
        update: function (t) {
          u.lid.position.set(-0.18, 0.305, 0);
          var down = T.seg(t, 0.4, 2.0), fill = T.seg(t, 2.4, 4.6), close = T.seg(t, 5.0, 7.0);
          u.element.visible = true; u.element.position.y = 0.1 + (1 - down) * 0.3;
          u.fuel.visible = fill > 0.01; u.fuel.scale.y = 0.15 * fill; u.fuel.position.y = 0.012 + 0.075 * fill;
          gl(T.pulse(t, 2.0, 5.0));
          u.lid.position.set(-0.18 * (1 - close), 0.305 - 0.12 * close, 0);
          u.lid.rotation.y = close * PI * 2.4;
        },
        labels: [
          { text: V('nový O-kroužek – navlhčit naftou', 'new O-ring – wet with diesel'), at: [0.06, 0.25, 0.04], show: [2, 5.2], level: 'ok' },
          { text: V('předplnit čistou naftou (je-li to povoleno)', 'pre-fill with clean diesel (if allowed)'), at: [0, 0.2, 0.06], show: [2.4, 5], level: 'accent' }
        ],
        captions: [
          { text: V('Nová vložka, nové těsnění, víko momentem dle příručky', 'New element, new seal, lid torqued per manual') },
          { text: V('Plastové víko nepřetahovat – praskne', 'Do not over-tighten a plastic lid – it cracks'), show: [5, 8], level: 'info' }
        ]
      };
    }
  });

  R('fuel-filter.prime', {
    duration: 8, camera: { pos: [0.32, 0.45, 0.55], target: [0, 0.24, 0], fov: 34 }, shadow: 0.8, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, r = rig(ctx, K), u = r.f.userData;
      var hand = K.P.glove(); hand.rotation.set(PI, 0, 0); hand.scale.setScalar(0.7); r.root.add(hand);
      var electric = !u.primer;
      var panel = H.sign(K, 0.15, 0.1, [{ t: 'ON → OFF', s: 0.5 }, { t: '× 3–5', s: 0.6, c: '#d98500' }], { border: '#2272b8' });
      panel.position.set(0.17, 0.3, -0.12); panel.visible = electric; r.root.add(panel);
      var flowIn = H.flow(K, [[-0.5, 0.05, 0.1], [-0.3, 0.12, 0.05], [-0.15, 0.27, 0], [-0.1, 0.262, 0]], K.M.clone('oil', { color: 0xd8b25a }), 10, 0.009);
      r.root.add(flowIn.group);
      return {
        root: r.root,
        update: function (t) {
          var pump = Math.max(0, Math.sin(t * PI * 2.2)), stiff = T.seg(t, 0, 7);
          if (u.primer) {
            u.primer.scale.y = 1 - pump * 0.55 * (1 - stiff * 0.7);
            hand.visible = true;
            hand.position.set(0, 0.06 + 0.185 + 0.03 + 0.12 - pump * 0.025 * (1 - stiff * 0.7), 0.04);
          } else {
            hand.visible = false;
            panel.scale.setScalar(1 + 0.05 * Math.sin(t * 6));
          }
          flowIn.update(t, true, 0.12 + stiff * 0.05);
        },
        labels: electric ? [] : [{ text: V('pumpovat, dokud neztvrdne', 'pump until it gets firm'), at: [0, 0.38, 0.05], level: 'accent' }],
        captions: [
          { text: electric ? V('Elektrické palivové čerpadlo: zapalování několikrát ZAP/VYP (dle příručky)', 'Electric fuel pump: switch ignition ON/OFF several times (per manual)') : V('Ruční pumpičkou pumpovat, dokud nebude tvrdá', 'Pump the hand primer until it is firm') },
          { text: V('Startér nenechávat točit déle než ~10 s – přehřátí a poškození čerpadla', 'Do not crank longer than ~10 s – overheating and pump damage'), show: [3, 8], level: 'danger' }
        ]
      };
    }
  });

  R('fuel-filter.start', {
    duration: 7, camera: CAM, shadow: 0.8, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, r = rig(ctx, K), u = r.f.userData;
      var lens = new THREE.Group();
      var ring = K.mesh(K.G.torus(0.04, 0.006, PI * 2, 32), 'plasticBlack'); lens.add(ring);
      var gl = K.mesh(K.G.cylZ(0.038, 0.004, 32), K.M.clone('glassClear', { opacity: 0.25 })); lens.add(gl);
      var hdl = K.mesh(K.G.cyl(0.008, 0.1, 12), 'plasticBlack'); hdl.position.set(0.05, -0.06, 0); hdl.rotation.z = 0.6; lens.add(hdl);
      r.root.add(lens);
      var spots = [[-0.1, 0.262, 0.03], [0.1, 0.262, 0.03], [0, 0.245, 0.066], [0, 0.05, 0.05]];
      var checks = spots.map(function (p) { var c = K.mesh(K.G.sphere(0.012, 12), 'hiOk'); c.position.set(p[0], p[1] + 0.03, p[2] + 0.02); c.visible = false; r.root.add(c); return c; });
      var vib = new THREE.Vector3();
      return {
        root: r.root,
        update: function (t) {
          var i = Math.min(3, Math.floor(t / 1.6));
          var a = K.v3(spots[i]), b = K.v3(spots[Math.min(3, i + 1)]);
          lens.position.copy(a.lerp(b, T.seg(t % 1.6, 1.0, 1.6))).add(new THREE.Vector3(0, 0, 0.08));
          checks.forEach(function (c, k) { c.visible = t > 1.2 + k * 1.6; });
          r.f.position.x = Math.sin(t * 60) * 0.0006;
        },
        captions: [
          { text: V('Nastartovat, nechat běžet 1–2 min na volnoběh', 'Start, let it idle for 1–2 min') },
          { text: V('Zkontrolovat těsnost všech spojů – žádná kapka nafty', 'Check every joint for leaks – not a single drop of diesel'), show: [1.2, 7] }
        ],
        labels: [{ text: V('✔ suché', '✔ dry'), at: function () { return lens.position.clone().add(new THREE.Vector3(0, 0.06, 0)); }, level: 'ok', show: [1.2, 7] }]
      };
    }
  });

  R('fuel-filter.petrol', {
    duration: 7, camera: { pos: [1.0, 0.9, 1.3], target: [0, 0.2, 0], fov: 34 }, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var tank = K.mesh(K.G.rbox(0.9, 0.28, 0.6, 0.08), K.M.clone('plasticBlack', { transparent: true, opacity: 0.35, color: 0x2a2c30 }));
      tank.position.y = 0.2; tank.userData.noShadow = true; root.add(tank);
      var fuel = K.mesh(K.G.box(0.82, 0.12, 0.52), K.M.clone('oil', { color: 0xe8c86a, opacity: 0.5 })); fuel.position.y = 0.13; root.add(fuel);
      var module = new THREE.Group();
      var cyl = K.mesh(K.G.cyl(0.07, 0.24, 28), 'plasticWhite'); cyl.position.y = 0.2; module.add(cyl);
      var flange = K.mesh(K.G.cyl(0.11, 0.02, 32), 'plasticGrey'); flange.position.y = 0.345; module.add(flange);
      var sock = K.mesh(K.G.rbox(0.12, 0.03, 0.08, 0.01), K.M.clone('fabric', { color: 0x8a8f96 })); sock.position.y = 0.08; module.add(sock);
      var sc = K.FX.glow(sock, 0xf5a524);
      root.add(module);
      var lineOut = H.pipe(K, [[0.05, 0.35, 0], [0.1, 0.45, 0], [0.6, 0.45, 0]], 0.006, 'rubber'); root.add(lineOut);
      var fl = H.flow(K, [[0.05, 0.35, 0], [0.1, 0.45, 0], [0.6, 0.45, 0]], K.M.clone('oil', { color: 0xf0d27a }), 8, 0.008); root.add(fl.group);
      return {
        root: root,
        update: function (t) { fl.update(t, true, 0.3); sc(0.5 + 0.5 * Math.sin(t * 3)); },
        labels: [
          { text: V('modul čerpadla s filtrem v nádrži', 'pump module with filter in the tank'), at: [0, 0.38, 0.08], level: 'accent' },
          { text: V('sací sítko', 'strainer sock'), at: [0, 0.1, 0.06] }
        ],
        captions: [
          { text: V('Benzín: filtr bývá v nádrži a běžně se nemění (ověřte v servisním plánu)', 'Petrol: the filter is usually in the tank and is not routinely replaced (verify in the service plan)') },
          { text: V('Práce na nádrži = výpary benzínu, výbuch – jen dílna', 'Work on the tank = petrol vapour, explosion – workshop only'), level: 'danger', show: [2.5, 7] }
        ]
      };
    }
  });
})(window.STU);
