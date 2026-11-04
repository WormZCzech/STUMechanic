/* 3D scenes: head gasket diagnosis and what a workshop does. Uses S.n5 helpers. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var ncyl = function (v) { return v === 'toyota-gr-yaris' ? 3 : 4; };
  var COOL = function (v) { return { 'skoda-octavia-rs-tdi': 'coolantViolet', 'toyota-gr-yaris': 'coolantPink' }[v] || 'coolantBlue'; };

  /** Block + gasket + head stack (inline). Returns parts. */
  function stack(ctx, K) {
    var n = ncyl(ctx.vehicle), bore = 0.042, sp = 0.1, len = sp * n + 0.08;
    var g = new THREE.Group();
    var shape = K.G.rrect(len, 0.2, 0.01);
    for (var i = 0; i < n; i++) {
      var h = new THREE.Path(); h.absarc(-sp * (n - 1) / 2 + i * sp, 0, bore, 0, PI * 2, true); shape.holes.push(h);
    }
    [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(function (c) { var w = new THREE.Path(); w.absarc(c[0] * (len / 2 - 0.02), c[1] * 0.07, 0.008, 0, PI * 2, true); shape.holes.push(w); });
    var blockGeo = K.G.extrude(shape, 0.22, 0.004); blockGeo.rotateX(PI / 2);
    var block = K.mesh(blockGeo, 'castIron'); block.position.y = 0.11; g.add(block);
    var pistons = [];
    for (var j = 0; j < n; j++) {
      var p = K.mesh(K.G.cyl(bore * 0.97, 0.05, 28), 'alu'); p.position.set(-sp * (n - 1) / 2 + j * sp, 0.18, 0); g.add(p); pistons.push(p);
    }
    var gGeo = K.G.extrude(shape, 0.003, 0); gGeo.rotateX(PI / 2);
    var gasket = K.mesh(gGeo, K.M.clone('steel', { color: 0x9aa0a6, metalness: 0.5, roughness: 0.5 })); gasket.position.y = 0.2215; g.add(gasket);
    var ringMat = K.M.clone('blackOxide', { color: 0x2a2a2a });
    var rings = [];
    for (var k = 0; k < n; k++) { var r = K.mesh(K.G.torus(bore + 0.004, 0.0025, PI * 2, 28), ringMat); r.rotation.x = PI / 2; r.position.set(-sp * (n - 1) / 2 + k * sp, 0.223, 0); g.add(r); rings.push(r); }
    var head = new THREE.Group();
    var hb = K.mesh(K.G.rbox(len, 0.1, 0.2, 0.01), 'aluCast'); hb.position.y = 0.05; head.add(hb);
    var cover = K.mesh(K.G.rbox(len - 0.03, 0.05, 0.16, 0.015), 'plasticBlack'); cover.position.y = 0.125; head.add(cover);
    var bolts = [];
    for (var b = 0; b < (n + 1) * 2; b++) {
      var bx = -len / 2 + 0.02 + (b >> 1) * ((len - 0.04) / n), bz = (b % 2 ? 1 : -1) * 0.085;
      var bh = K.mesh(K.G.hex(0.008, 0.01), 'blackOxide'); bh.position.set(bx, 0.105, bz); head.add(bh); bolts.push(bh);
    }
    head.position.y = 0.223; g.add(head);
    return { group: g, head: head, gasket: gasket, rings: rings, pistons: pistons, bolts: bolts, len: len, n: n, sp: sp };
  }
  var CAM = { pos: [0.55, 0.6, 0.7], target: [0, 0.22, 0], fov: 34 };

  R('head-gasket.overview', {
    duration: 8, camera: CAM, shadow: 0.8, thumbT: 3.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), s = stack(ctx, K); root.add(s.group);
      var gg = K.FX.glow(s.gasket, 0xf5a524);
      return {
        root: root,
        update: function (t) {
          var e = T.seg(t, 0.8, 2.5) * (1 - T.seg(t, 6.5, 7.8));
          s.head.position.y = 0.223 + e * 0.18; s.gasket.position.y = 0.2215 + e * 0.08;
          s.rings.forEach(function (r) { r.position.y = 0.223 + e * 0.08; });
          gg(e * (0.5 + 0.5 * Math.sin(t * 4)));
        },
        labels: [
          { text: V('hlava válců', 'cylinder head'), at: function () { return s.head.position.clone().add(new THREE.Vector3(0.1, 0.15, 0.1)); } },
          { text: V('těsnění pod hlavou', 'head gasket'), at: function () { return s.gasket.position.clone().add(new THREE.Vector3(0.12, 0.01, 0.1)); }, level: 'accent', show: [1.5, 7] },
          { text: V('blok motoru', 'engine block'), at: [0.12, 0.1, 0.11] }
        ],
        captions: [
          { text: V('Těsnění odděluje spalovací prostor, olej a chladicí kapalinu', 'The gasket separates the combustion chamber, oil and coolant') },
          { text: V('Nejčastější příčina poškození: přehřátí motoru', 'Most common cause of failure: engine overheating'), show: [3.5, 8], level: 'warning' }
        ]
      };
    }
  });

  R('head-gasket.symptoms', {
    duration: 9, camera: { pos: [-5.2, 1.9, 3.6], target: [-0.8, 0.6, 0], fov: 34 }, shadow: 3.5, thumbT: 2,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var steam = K.FX.puff(0xf4f4f4, 18, 0.2, 0.7); steam.group.position.set(c.dims.rear - 0.05, 0.25, -0.3); root.add(steam.group);
      var cap = new THREE.Group();
      var cb = K.mesh(K.G.cyl(0.18, 0.06, 32), 'toolYellow'); cap.add(cb);
      var mayo = K.mesh(K.G.cyl(0.15, 0.012, 32), K.M.clone('filler', { color: 0xd8c9a0 })); mayo.position.y = -0.035; cap.add(mayo);
      cap.position.set(c.dims.rear - 0.8, 1.0, 1.4); cap.rotation.x = PI * 0.75; root.add(cap);
      var temp = S.n5.sign(K, 0.5, 0.26, [{ t: '🌡 ↑', s: 0.7, c: '#c9282d' }], { border: '#c9282d' }); temp.position.set(c.dims.rear - 0.2, c.dims.H + 0.45, 0.3); root.add(temp);
      return {
        root: root,
        update: function (t) { steam.update(t, t < 3); cap.visible = t >= 3 && t < 6; temp.visible = t >= 6; },
        captions: [
          { text: V('Bílý nasládlý kouř (pára) i na zahřátém motoru', 'White, sweet-smelling smoke (steam) even when warm'), show: [0, 3], level: 'warning' },
          { text: V('Béžová „majonéza“ pod víčkem oleje (pozor: i krátké jízdy v zimě!)', 'Beige "mayonnaise" under the oil cap (careful: short winter trips cause it too!)'), show: [3, 6], level: 'warning' },
          { text: V('Přehřívání, ztráta chladicí kapaliny bez viditelného úniku', 'Overheating, coolant loss without a visible leak'), show: [6, 9], level: 'danger' }
        ]
      };
    }
  });

  function tank(K, vid, opts) {
    opts = opts || {};
    var H = S.n5, g = new THREE.Group();
    var body = K.mesh(K.G.rbox(0.2, 0.14, 0.12, 0.02), K.M.clone('plasticWhite', { transparent: true, opacity: 0.45 })); body.position.y = 0.07; body.userData.noShadow = true; g.add(body);
    var liquid = K.mesh(K.G.box(0.18, 0.08, 0.1), K.M[COOL(vid)]); liquid.position.y = 0.05; g.add(liquid);
    var neck = K.mesh(K.G.cyl(0.025, 0.03, 20), K.M.clone('plasticWhite', { transparent: true, opacity: 0.5 })); neck.position.set(0.04, 0.155, 0); g.add(neck);
    [['MAX', 0.1], ['MIN', 0.05]].forEach(function (m) { var l = K.mesh(K.G.box(0.05, 0.003, 0.002), m[0] === 'MAX' ? 'hiOk' : 'hiDanger'); l.position.set(-0.05, m[1], 0.061); g.add(l); });
    g.userData = { liquid: liquid, neck: neck };
    return g;
  }
  var TCAM = { pos: [0.25, 0.3, 0.42], target: [0, 0.12, 0], fov: 34 };

  R('head-gasket.ruleOut', {
    duration: 10, camera: { pos: [0.9, 0.9, 1.1], target: [0.05, 0.3, 0], fov: 36 }, shadow: 1.2, thumbT: 2,
    build: function (ctx, K) {
      var H = S.n5, root = new THREE.Group();
      var eng = K.P.engine({ cyl: ncyl(ctx.vehicle) }); root.add(eng);
      var rad = K.mesh(K.G.rbox(0.05, 0.4, 0.6, 0.01), 'alu'); rad.position.set(-0.6, 0.35, 0); root.add(rad);
      var hose1 = H.pipe(K, [[-0.58, 0.5, 0.2], [-0.45, 0.55, 0.2], [-0.35, 0.55, 0.1]], 0.02, 'rubber'); root.add(hose1);
      var hose2 = H.pipe(K, [[-0.58, 0.2, -0.2], [-0.45, 0.18, -0.2], [-0.35, 0.22, -0.1]], 0.02, 'rubber'); root.add(hose2);
      var th = K.mesh(K.G.rbox(0.06, 0.05, 0.06, 0.01), 'plasticBlack'); th.position.set(-0.33, 0.55, 0.1); root.add(th);
      var parts = [rad, hose1, th, hose2];
      var glows = parts.map(function (p) { return K.FX.glow(p, 0xf5a524); });
      return {
        root: root,
        update: function (t) { var i = Math.floor(t / 2.5) % 4; glows.forEach(function (g, k) { g(k === i ? 0.7 + 0.3 * Math.sin(t * 6) : 0); }); },
        labels: [
          { text: V('chladič', 'radiator'), at: [-0.6, 0.6, 0], show: [0, 2.5], level: 'accent' },
          { text: V('hadice', 'hoses'), at: [-0.45, 0.62, 0.2], show: [2.5, 5], level: 'accent' },
          { text: V('termostat', 'thermostat'), at: [-0.33, 0.62, 0.1], show: [5, 7.5], level: 'accent' },
          { text: V('vodní pumpa / spodní hadice', 'water pump / lower hose'), at: [-0.45, 0.26, -0.2], show: [7.5, 10], level: 'accent' }
        ],
        captions: [{ text: V('Nejdřív vylučte levnější příčiny: únik, termostat, chladič, ventilátor, víčko nádržky', 'First rule out cheaper causes: leaks, thermostat, radiator, fan, tank cap') }]
      };
    }
  });

  R('head-gasket.bubbles', {
    duration: 7, camera: TCAM, shadow: 0.5, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      root.add(S.n5.bench(K, 0.6, 0.4));
      var tk = tank(K, ctx.vehicle); root.add(tk);
      var bubbles = [];
      for (var i = 0; i < 10; i++) { var b = K.mesh(K.G.sphere(0.005, 10), K.M.clone('glassClear', { opacity: 0.6 })); b.userData.o = i / 10; root.add(b); bubbles.push(b); }
      return {
        root: root,
        update: function (t) {
          bubbles.forEach(function (b, i) { var k = (t * 0.7 + b.userData.o) % 1; b.position.set(-0.04 + (i % 4) * 0.03, 0.015 + k * 0.075, -0.02 + (i % 3) * 0.02); b.visible = k < 0.95; });
        },
        labels: [{ text: V('bubliny při volnoběhu', 'bubbles at idle'), at: [0, 0.13, 0.06], level: 'accent' }],
        captions: [
          { text: V('Stálé bubliny v nádržce za chodu = spaliny v chladicí soustavě (podezření)', 'Constant bubbles in the tank while running = exhaust gas in the cooling system (suspect)') },
          { text: V('Víčko otevírat JEN za studena!', 'Open the cap ONLY when cold!'), show: [3, 7], level: 'danger' }
        ]
      };
    }
  });

  R('head-gasket.blockTest', {
    duration: 9, camera: { pos: [0.3, 0.38, 0.5], target: [0.03, 0.2, 0], fov: 34 }, shadow: 0.6, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      root.add(S.n5.bench(K, 0.6, 0.4));
      var tk = tank(K, ctx.vehicle); root.add(tk);
      var tester = new THREE.Group();
      var glass = K.mesh(K.G.lathe([[0.022, 0], [0.024, 0.02], [0.024, 0.16], [0.02, 0.17]], 24), K.M.clone('glassClear', { opacity: 0.3, side: THREE.DoubleSide })); tester.add(glass);
      var fluidMat = K.M.clone('water', { color: 0x2a6fe0, opacity: 0.85 });
      var fluid = K.mesh(K.G.cyl(0.02, 0.06, 20), fluidMat); fluid.position.y = 0.06; tester.add(fluid);
      var bulb = K.mesh(K.G.sphere(0.03, 16), 'rubber'); bulb.scale.y = 1.3; bulb.position.set(0.0, 0.22, 0); tester.add(bulb);
      tester.position.set(0.04, 0.17, 0); root.add(tester);
      var blue = new THREE.Color(0x2a6fe0), yellow = new THREE.Color(0xd8c21a);
      return {
        root: root,
        update: function (t) {
          bulb.scale.set(1 - 0.25 * Math.max(0, Math.sin(t * 5)), 1.3, 1 - 0.25 * Math.max(0, Math.sin(t * 5)));
          fluidMat.color.copy(blue).lerp(yellow, T.seg(t, 3, 7));
        },
        labels: [
          { text: V('modrá = OK', 'blue = OK'), at: [0.08, 0.25, 0.03], show: [0, 3], level: 'ok' },
          { text: V('žlutá = spaliny (CO₂) v chlazení', 'yellow = exhaust gas (CO₂) in coolant'), at: [0.08, 0.25, 0.03], show: [6.5, 9], level: 'danger' }
        ],
        captions: [
          { text: V('Test CO₂ („block test“): kapalina mění barvu, když v chlazení jsou spaliny', 'CO₂ test ("block test"): the fluid changes colour if there is exhaust gas in the coolant') },
          { text: V('Chladicí kapalina nesmí nasát do testeru – hladinu mírně snížit', 'Coolant must not be sucked into the tester – lower the level slightly'), show: [4, 9], level: 'info' }
        ]
      };
    }
  });

  R('head-gasket.pressure', {
    duration: 9, camera: { pos: [0.32, 0.38, 0.5], target: [0.03, 0.2, 0], fov: 34 }, shadow: 0.6, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, H = S.n5, root = new THREE.Group();
      root.add(H.bench(K, 0.6, 0.4));
      var tk = tank(K, ctx.vehicle); root.add(tk);
      var pump = new THREE.Group();
      var cyl = K.mesh(K.G.cyl(0.02, 0.16, 20), 'toolRed'); cyl.position.y = 0.08; pump.add(cyl);
      var handle = K.mesh(K.G.cylX(0.008, 0.08, 12), 'plasticBlack'); pump.add(handle);
      pump.position.set(0.04, 0.2, 0); root.add(pump);
      var gauge = K.FX.canvasPanel(0.09, 0.09, function (x, W, Hh, st) {
        x.fillStyle = '#f4f5f7'; x.beginPath(); x.arc(W / 2, Hh / 2, W * 0.48, 0, PI * 2); x.fill();
        x.strokeStyle = '#151a22'; x.lineWidth = W * 0.03; x.stroke();
        var a = PI * 0.8 + (st || 0) * PI * 1.4;
        x.beginPath(); x.moveTo(W / 2, Hh / 2); x.lineTo(W / 2 + Math.cos(a) * W * 0.38, Hh / 2 + Math.sin(a) * W * 0.38); x.strokeStyle = '#c9282d'; x.stroke();
        x.fillStyle = '#151a22'; x.font = 'bold ' + Math.round(W * 0.12) + 'px Arial'; x.textAlign = 'center'; x.fillText('bar', W / 2, Hh * 0.78);
      }, { px: 256, state: 0 });
      gauge.position.set(0.12, 0.32, 0.02); root.add(gauge);
      return {
        root: root,
        update: function (t) {
          var pumpK = T.seg(t, 0.3, 3), drop = T.seg(t, 4, 8.5);
          handle.position.y = 0.17 + Math.abs(Math.sin(t * 5)) * 0.04 * (t < 3 ? 1 : 0) + 0.01;
          gauge.userData.redraw(Math.round((0.6 * pumpK - 0.35 * drop) * 40) / 40);
        },
        labels: [{ text: V('tlak klesá = únik', 'pressure drops = leak'), at: [0.12, 0.38, 0.02], show: [5, 9], level: 'danger' }],
        captions: [
          { text: V('Tlaková zkouška chlazení na studeném motoru, tlak dle víčka nádržky', 'Cooling system pressure test on a cold engine, pressure per the tank cap rating') },
          { text: V('Pokles bez vnějšího úniku → hledat uvnitř (těsnění, chladič oleje, EGR chladič)', 'A drop with no external leak → look inside (gasket, oil cooler, EGR cooler)'), show: [4.5, 9], level: 'info' }
        ]
      };
    }
  });

  function gaugeDial(K, size) {
    return K.FX.canvasPanel(size, size, function (x, W, Hh, st) {
      st = st || { v: 0, max: 20, unit: 'bar' };
      x.fillStyle = '#f4f5f7'; x.beginPath(); x.arc(W / 2, Hh / 2, W * 0.48, 0, PI * 2); x.fill();
      x.strokeStyle = '#151a22'; x.lineWidth = W * 0.03; x.stroke();
      var a = PI * 0.75 + (st.v / st.max) * PI * 1.5;
      x.beginPath(); x.moveTo(W / 2, Hh / 2); x.lineTo(W / 2 + Math.cos(a) * W * 0.38, Hh / 2 + Math.sin(a) * W * 0.38); x.strokeStyle = '#c9282d'; x.stroke();
      x.fillStyle = '#151a22'; x.font = 'bold ' + Math.round(W * 0.14) + 'px Arial'; x.textAlign = 'center';
      x.fillText(st.label || (st.v.toFixed(0) + ' ' + st.unit), W / 2, Hh * 0.8);
    }, { px: 256, state: null });
  }

  R('head-gasket.compression', {
    duration: 10, camera: { pos: [0.4, 0.62, 0.62], target: [0, 0.38, 0], fov: 34 }, shadow: 0.8, thumbT: 7,
    build: function (ctx, K) {
      var H = S.n5, root = new THREE.Group(), s = stack(ctx, K); root.add(s.group);
      var diesel = ['skoda-octavia-rs-tdi', 'citroen-jumper-22hdi'].indexOf(ctx.vehicle) >= 0;
      var max = diesel ? 40 : 20;
      var vals = diesel ? [30, 31, 21, 30] : [13, 13.5, 8, 13];
      var dial = gaugeDial(K, 0.12); dial.position.set(0.0, 0.55, 0.12); root.add(dial);
      var hose = H.pipe(K, [[0, 0.33, 0.0], [0, 0.42, 0.06], [0, 0.5, 0.11]], 0.006, 'rubber'); root.add(hose);
      var table = K.FX.canvasPanel(0.24, 0.12, function (x, W, Hh, st) {
        x.fillStyle = '#0b1620'; x.fillRect(0, 0, W, Hh);
        x.font = 'bold ' + Math.round(Hh * 0.2) + 'px Arial'; x.textBaseline = 'middle';
        for (var i = 0; i < s.n; i++) {
          if (i > st) break;
          var bad = vals[i] < max * 0.6;
          x.fillStyle = bad ? '#e5484d' : '#30a46c';
          x.fillText('C' + (i + 1) + ': ' + vals[i] + ' bar', W * 0.06 + (i % 2) * W * 0.5, Hh * (0.3 + Math.floor(i / 2) * 0.42));
        }
      }, { px: 512, state: -1 });
      table.position.set(0.22, 0.55, 0.08); root.add(table);
      return {
        root: root,
        update: function (t) {
          var i = Math.min(s.n - 1, Math.floor(t / 2.2));
          var x = -s.sp * (s.n - 1) / 2 + i * s.sp;
          hose.position.x = x; dial.position.x = x;
          var k = Math.min(1, (t % 2.2) / 1.4);
          dial.userData.redraw({ v: Math.round(vals[i] * k), max: max, unit: 'bar' });
          table.userData.redraw(t % 2.2 > 1.4 ? i : i - 1);
          s.pistons.forEach(function (p, j) { p.position.y = 0.17 + (j === i ? Math.abs(Math.sin(t * 8)) * 0.02 : 0); });
        },
        captions: [
          { text: diesel ? V('Diesel: speciální kompresiometr do otvoru žhavicí svíčky / vstřikovače (vysoké tlaky)', 'Diesel: special compression gauge in the glow plug / injector hole (high pressures)') : V('Benzín: kompresiometr do otvoru svíčky, plný plyn, všechny svíčky ven', 'Petrol: gauge in the plug hole, throttle wide open, all plugs out') },
          { text: V('Rozhoduje rozdíl mezi válci; nízké hodnoty u dvou sousedních = těsnění mezi nimi', 'The difference between cylinders matters; two low adjacent ones = gasket between them'), show: [4, 10], level: 'info' }
        ]
      };
    }
  });

  R('head-gasket.leakdown', {
    duration: 8, camera: { pos: [0.4, 0.62, 0.62], target: [0, 0.38, 0], fov: 34 }, shadow: 0.8, thumbT: 5,
    build: function (ctx, K) {
      var H = S.n5, T = K.T, root = new THREE.Group(), s = stack(ctx, K); root.add(s.group);
      var g1 = gaugeDial(K, 0.1), g2 = gaugeDial(K, 0.1);
      g1.position.set(-0.07, 0.56, 0.12); g2.position.set(0.07, 0.56, 0.12); root.add(g1); root.add(g2);
      root.add(H.pipe(K, [[0.0, 0.33, 0.0], [0, 0.44, 0.06], [0, 0.52, 0.1]], 0.006, 'rubber'));
      var tk = tank(K, ctx.vehicle); tk.position.set(-0.32, 0.25, 0.05); root.add(tk);
      var bubble = K.FX.puff(0xdddddd, 10, 0.02, 0.1); bubble.group.position.set(-0.28, 0.42, 0.05); root.add(bubble.group);
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 0.5, 2);
          g1.userData.redraw({ v: 6 * k, max: 10, unit: 'bar', label: 'IN 6 bar' });
          g2.userData.redraw({ v: 6 * k * 0.55, max: 10, unit: 'bar', label: Math.round(45 * k) + ' %' });
          bubble.update(t, t > 2.5);
        },
        labels: [{ text: V('bubliny v nádržce = únik do chlazení', 'bubbles in the tank = leak into cooling'), at: [-0.32, 0.45, 0.06], show: [2.5, 8], level: 'danger' }],
        captions: [
          { text: V('Test úniku tlaku: válec v horní úvrati, natlakovat vzduchem, měřit % úniku', 'Leak-down test: cylinder at TDC, pressurise with air, measure % loss') },
          { text: V('Kam syčí? Sání = sací ventil · výfuk = výfukový · olej. hrdlo = kroužky · nádržka = těsnění', 'Where does it hiss? Intake = intake valve · exhaust = exhaust valve · oil filler = rings · tank = gasket'), show: [3, 8], level: 'info' }
        ]
      };
    }
  });

  R('head-gasket.workshop', {
    duration: 9, camera: { pos: [0.5, 0.7, 0.75], target: [0, 0.3, 0], fov: 34 }, shadow: 0.9, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), s = stack(ctx, K); root.add(s.group);
      var edge = K.mesh(K.G.box(s.len + 0.06, 0.006, 0.025), 'steel'); root.add(edge);
      var feeler = K.mesh(K.G.box(0.06, 0.001, 0.012), 'zinc'); root.add(feeler);
      return {
        root: root,
        update: function (t) {
          var up = T.seg(t, 0.5, 2.5);
          s.head.position.set(up * 0.0, 0.223 + up * 0.25, 0); s.head.rotation.x = up * PI;
          s.gasket.visible = t < 2.5;
          var chk = T.seg(t, 3, 4);
          edge.visible = t > 3; edge.position.set(0, 0.223 + 0.25 + 0.003 + 0.0, 0); edge.rotation.y = Math.sin(t * 0.8) * 0.6 * chk;
          edge.position.y = 0.223 + 0.25 + 0.0035;
          feeler.visible = t > 4.5; feeler.position.set(0.1, 0.223 + 0.25 + 0.0005, 0.02 + Math.sin(t * 3) * 0.01);
        },
        labels: [{ text: V('kontrola rovinnosti hlavy (pravítko + spárová měrka)', 'head flatness check (straightedge + feeler gauge)'), at: [0, 0.55, 0.05], show: [3.5, 9], level: 'accent' }],
        captions: [
          { text: V('Dílna: demontáž hlavy, kontrola rovinnosti, případně broušení, tlaková zkouška hlavy', 'Workshop: head removal, flatness check, skimming if needed, head pressure test') },
          { text: V('Hlava pryč = rozvody pryč: nové šrouby, těsnění, často i sada rozvodů', 'Head off = timing off: new bolts, gaskets, often a timing kit too'), show: [4.5, 9], level: 'warning' }
        ]
      };
    }
  });

  R('head-gasket.torque', {
    duration: 12, camera: { pos: [0.0, 0.85, 0.45], target: [0, 0.32, 0], fov: 38 }, shadow: 0.8, thumbT: 11,
    build: function (ctx, K) {
      var root = new THREE.Group(), s = stack(ctx, K); root.add(s.group);
      // classic spiral sequence from the centre outwards
      var order = s.bolts.map(function (b, i) { return { i: i, d: Math.abs(b.position.x) + (b.position.z > 0 ? 0.001 : 0) }; }).sort(function (a, b) { return a.d - b.d; }).map(function (o) { return o.i; });
      var labels = order.map(function (bi, k) {
        return { text: String(k + 1), at: function () { return s.bolts[bi].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.02, 0)); }, show: [0.4 + k * 0.9, 12], level: 'accent' };
      });
      return {
        root: root,
        update: function (t) { var k = Math.min(order.length - 1, Math.floor(Math.max(0, t - 0.4) / 0.9)); s.bolts.forEach(function (b, i) { b.scale.setScalar(i === order[k] ? 1.4 : 1); }); },
        labels: labels,
        captions: [
          { text: V('Šrouby hlavy: pořadí od středu ven, v několika krocích (moment + úhel) dle příručky', 'Head bolts: sequence from the centre outwards, in several stages (torque + angle) per manual') },
          { text: V('Šrouby jsou většinou na jedno použití (protahovací) – vždy nové!', 'Bolts are usually single-use (torque-to-yield) – always new!'), show: [4, 12], level: 'danger' }
        ]
      };
    }
  });

  R('head-gasket.after', {
    duration: 8, camera: TCAM, shadow: 0.5, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      root.add(S.n5.bench(K, 0.6, 0.4));
      var tk = tank(K, ctx.vehicle); root.add(tk);
      var temp = K.FX.canvasPanel(0.12, 0.08, function (x, W, Hh, st) {
        x.fillStyle = '#0b1620'; x.fillRect(0, 0, W, Hh);
        x.fillStyle = st > 0.85 ? '#e5484d' : '#30a46c'; x.fillRect(W * 0.08, Hh * 0.62, (W * 0.84) * st, Hh * 0.18);
        x.fillStyle = '#fff'; x.font = 'bold ' + Math.round(Hh * 0.3) + 'px Arial'; x.fillText(Math.round(40 + st * 60) + ' °C', W * 0.08, Hh * 0.38);
      }, { px: 256, state: 0 });
      temp.position.set(0.0, 0.28, 0.0); root.add(temp);
      return {
        root: root,
        update: function (t) { temp.userData.redraw(Math.round(T.seg(t, 0.5, 5) * 0.75 * 20) / 20); tk.userData.liquid.scale.y = 0.85 + 0.15 * T.seg(t, 0.5, 3); },
        captions: [
          { text: V('Po opravě: doplnit a odvzdušnit chlazení, nový olej (byla-li v něm kapalina)', 'After the repair: refill and bleed the cooling system, fresh oil (if coolant got into it)') },
          { text: V('Teplota stabilní, hladina se nemění, žádné bubliny – kontrolovat několik dní', 'Temperature stable, level constant, no bubbles – check for several days'), show: [4, 8], level: 'info' }
        ]
      };
    }
  });
})(window.STU);
