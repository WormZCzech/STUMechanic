/* 3D scenes: injector diagnostics (diesel Common Rail, petrol notes). Uses S.n5 helpers. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var TOOL = { 'generic': 'OBD', 'mb-cl500-c216': 'XENTRY', 'volvo-xc60-b4': 'VIDA', 'skoda-octavia-rs-tdi': 'VCDS', 'toyota-gr-yaris': 'Techstream', 'citroen-jumper-22hdi': 'Diagbox' };
  var ncyl = function (v) { return v === 'toyota-gr-yaris' ? 3 : 4; };

  /** Diesel injector, axis Y, tip at y = 0, top (connector) at y ≈ 0.17. */
  function injector(K) {
    var g = new THREE.Group();
    var body = K.mesh(K.G.lathe([[0.003, 0], [0.0045, 0.004], [0.0045, 0.025], [0.009, 0.03], [0.009, 0.07], [0.012, 0.075], [0.012, 0.13], [0.01, 0.135], [0.0, 0.135]], 28), 'steel'); g.add(body);
    var head = K.mesh(K.G.rbox(0.03, 0.035, 0.026, 0.006), 'plasticBlack'); head.position.y = 0.152; g.add(head);
    var hp = K.mesh(K.G.cylX(0.006, 0.02, 12), 'zinc'); hp.position.set(0.018, 0.115, 0); g.add(hp);
    var lo = K.mesh(K.G.cyl(0.004, 0.012, 12), 'plasticWhite'); lo.position.set(-0.006, 0.175, 0); g.add(lo);
    var washer = K.mesh(K.G.torus(0.006, 0.0018, PI * 2, 20), 'copper'); washer.rotation.x = PI / 2; washer.position.y = 0.026; g.add(washer);
    g.userData = { washer: washer, lo: lo };
    return g;
  }

  /** Cylinder head block with injectors, rail, HP pipes and leak-off line. */
  function rack(ctx, K, opts) {
    opts = opts || {};
    var H = S.n5, n = ncyl(ctx.vehicle), sp = 0.12;
    var root = new THREE.Group();
    var head = K.mesh(K.G.rbox(sp * n + 0.12, 0.12, 0.22, 0.015), 'aluCast'); head.position.y = 0.06; root.add(head);
    var injs = [];
    for (var i = 0; i < n; i++) {
      var x = -sp * (n - 1) / 2 + i * sp;
      var bore = K.mesh(K.G.cyl(0.013, 0.004, 20), 'blackOxide'); bore.position.set(x, 0.121, 0); root.add(bore);
      var inj = injector(K); inj.position.set(x, 0.095, 0); root.add(inj); injs.push(inj);
      if (opts.hp !== false) root.add(H.pipe(K, [[x + 0.028, 0.21, 0], [x + 0.06, 0.24, -0.04], [x + 0.06, 0.26, -0.12]], 0.004, 'steel'));
    }
    var rail = null;
    if (opts.hp !== false) {
      rail = K.mesh(K.G.cylX(0.016, sp * n + 0.06, 24), 'steel'); rail.position.set(0.04, 0.26, -0.13); root.add(rail);
      var sensor = K.mesh(K.G.rbox(0.03, 0.025, 0.025, 0.005), 'plasticBlack'); sensor.position.set(0.04 + (sp * n + 0.06) / 2 + 0.015, 0.26, -0.13); root.add(sensor);
    }
    if (opts.leakoff !== false) {
      var pts = injs.map(function (j) { return [j.position.x - 0.006, j.position.y + 0.19, 0]; });
      pts.push([pts[pts.length - 1][0] + 0.1, 0.27, 0.05]);
      root.add(H.pipe(K, pts, 0.0035, K.M.clone('plasticBlack', { color: 0x2b2b2b })));
    }
    return { root: root, injs: injs, rail: rail, head: head, n: n };
  }
  var CAM = { pos: [0.45, 0.55, 0.65], target: [0, 0.18, 0], fov: 34 };

  R('injectors.overview', {
    duration: 8, camera: CAM, shadow: 0.8, thumbT: 3,
    build: function (ctx, K) {
      var H = S.n5, r = rack(ctx, K);
      var flow = H.flow(K, [[0.3, 0.26, -0.13], [-0.2, 0.26, -0.13]], K.M.clone('oil', { color: 0xf0d27a }), 14, 0.006);
      r.root.add(flow.group);
      var gauge = H.sign(K, 0.18, 0.09, ['~1800 bar'], { border: '#c9282d' }); gauge.position.set(0.32, 0.36, -0.13); r.root.add(gauge);
      return {
        root: r.root,
        update: function (t) { flow.update(t, true, 0.5); r.injs.forEach(function (j, i) { j.position.y = 0.095 + (Math.floor(t * 4) % r.n === i ? 0.0015 : 0); }); },
        labels: [
          { text: V('rail (vysoký tlak)', 'rail (high pressure)'), at: [0, 0.29, -0.13], level: 'danger' },
          { text: V('vstřikovač', 'injector'), at: function () { return r.injs[0].position.clone().add(new THREE.Vector3(0, 0.2, 0.03)); } },
          { text: V('zpětné vedení (přepad)', 'leak-off (return) line'), at: [0.12, 0.3, 0.04] }
        ],
        captions: [
          { text: V('Common Rail: čerpadlo → rail → vstřikovače; přebytek se vrací přepadem', 'Common Rail: pump → rail → injectors; the excess returns via the leak-off line') },
          { text: V('Tlak až ~2000 bar – vysokotlakou stranu neotevírat', 'Up to ~2000 bar – do not open the high-pressure side'), show: [3, 8], level: 'danger' }
        ]
      };
    }
  });

  R('injectors.hpDanger', {
    duration: 6, camera: { pos: [0.3, 0.3, 0.45], target: [0.05, 0.22, -0.05], fov: 34 }, shadow: 0.6, thumbT: 2.5,
    build: function (ctx, K) {
      var T = K.T, r = rack(ctx, K);
      var jet = K.mesh(new THREE.ConeGeometry(0.004, 0.25, 12, 1, true), K.M.clone('water', { color: 0xf0e2a0, opacity: 0.7 }));
      jet.rotation.z = -PI / 2; jet.position.set(0.17, 0.24, -0.04); r.root.add(jet);
      var hand = K.P.glove(); hand.rotation.set(0, -PI / 2, 0); hand.scale.setScalar(0.8); hand.position.set(0.3, 0.22, -0.04); r.root.add(hand);
      var no = new THREE.Group();
      [1, -1].forEach(function (s) { var b = K.mesh(K.G.box(0.16, 0.02, 0.02), 'hiDanger'); b.rotation.z = s * PI / 4; no.add(b); });
      no.position.set(0.3, 0.3, 0); r.root.add(no);
      return {
        root: r.root,
        update: function (t) { var k = T.pulse(t % 3, 0.2, 2.6); jet.scale.set(1, 0.3 + 0.7 * k, 1); jet.visible = k > 0.05; no.visible = t % 1 > 0.3; },
        captions: [
          { text: V('Paprsek nafty pod vysokým tlakem pronikne kůží – otrava, amputace', 'A high-pressure diesel jet penetrates skin – poisoning, amputation'), level: 'danger' },
          { text: V('Netěsnost nikdy nehledat rukou za chodu. Po vypnutí počkat (dle příručky)', 'Never feel for a leak with your hand while running. Wait after switch-off (per manual)'), show: [2.5, 6], level: 'warning' }
        ]
      };
    }
  });

  R('injectors.symptoms', {
    duration: 7, camera: { pos: [-5.0, 1.8, 3.6], target: [-0.6, 0.6, 0], fov: 34 }, shadow: 3.5, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var smoke = K.FX.puff(0x2b2b2b, 18, 0.18, 0.5); smoke.group.position.set(c.dims.rear - 0.05, 0.25, -0.3); root.add(smoke.group);
      var knock = S.n5.sign(K, 0.4, 0.2, [{ t: '♪ tak-tak-tak', s: 0.55 }], { border: '#d98500' }); knock.position.set(c.dims.front - 0.6, c.dims.H + 0.35, 0); root.add(knock);
      return {
        root: root,
        update: function (t) { smoke.update(t, true); knock.visible = Math.floor(t * 3) % 2 === 0; c.group.position.x = Math.sin(t * 30) * 0.002; },
        labels: [{ text: V('černý / bílý kouř', 'black / white smoke'), at: [c.dims.rear - 0.2, 0.6, -0.3], level: 'accent' }],
        captions: [
          { text: V('Příznaky: nerovnoměrný volnoběh, klepání, kouř, horší start, vyšší spotřeba', 'Symptoms: rough idle, knocking, smoke, poor starting, higher fuel use') },
          { text: V('Stejné příznaky mají i jiné závady – nejdřív diagnostika', 'Other faults show the same symptoms – diagnose first'), show: [3, 7], level: 'info' }
        ]
      };
    }
  });

  function scan(rowsFn, captions) {
    return {
      duration: 7, camera: { pos: [0.08, 0.32, 0.55], target: [0, 0.18, 0], fov: 32 }, shadow: 0.6, thumbT: 4,
      build: function (ctx, K) {
        var H = S.n5, root = new THREE.Group();
        root.add(H.bench(K, 0.9, 0.6));
        var sc = H.scanner(K, rowsFn(ctx, 0)); sc.group.position.set(0, 0.18, 0); sc.group.rotation.x = -0.35; root.add(sc.group);
        return { root: root, update: function (t) { sc.set(rowsFn(ctx, Math.floor(t * 2) / 2)); }, captions: captions };
      }
    };
  }

  R('injectors.balance', scan(function (ctx, t) {
    var n = ncyl(ctx.vehicle), vals = [0.2, -0.35, 0.15, 0.9];
    var bars = [];
    for (var i = 0; i < n; i++) {
      var v = vals[i] * Math.min(1, t / 2 + 0.3);
      bars.push({ l: 'C' + (i + 1), v: v, c: Math.abs(v) > 0.6 ? '#e5484d' : '#30a46c' });
    }
    return { title: (TOOL[ctx.vehicle] || 'OBD') + ' · ' + ctx.t(V('korekce vstřiku', 'injection correction')), bars: bars,
      foot: ctx.t(V('Zelené pásmo = v limitu (dle výrobce)', 'Green band = within limit (per manufacturer)')) };
  }, [
    { text: V('Korekční (balanční) hodnoty: vstřikovač mimo limit = podezřelý', 'Correction (balance) values: an injector outside the limit = suspect') },
    { text: V('Měřit na zahřátém motoru, volnoběh, spotřebiče vypnuté', 'Measure with a warm engine, at idle, consumers off'), show: [3, 7], level: 'info' }
  ]));

  R('injectors.leakoff', {
    duration: 10, camera: { pos: [0.35, 0.5, 0.6], target: [0, 0.27, 0], fov: 34 }, shadow: 0.8, thumbT: 7,
    build: function (ctx, K) {
      var H = S.n5, T = K.T, r = rack(ctx, K, { leakoff: false });
      var rates = [0.45, 0.5, 0.42, 1.0];
      var tubes = r.injs.map(function (j, i) {
        var jar = H.jar(K, 0.012, 0.12, K.M.clone('oil', { color: 0xe8cf86, opacity: 0.85 }), 'oil');
        jar.group.position.set(j.position.x, 0.3, 0.04); r.root.add(jar.group);
        r.root.add(H.pipe(K, [[j.position.x - 0.006, j.position.y + 0.18, 0], [j.position.x - 0.004, 0.33, 0.02], [j.position.x, 0.3 + 0.13, 0.04]], 0.0025, K.M.clone('glassClear', { opacity: 0.5 })));
        return jar;
      });
      return {
        root: r.root,
        update: function (t) {
          var k = T.lin(t, 0.5, 8.5);
          tubes.forEach(function (j, i) { j.setLevels(0.1 * k * (rates[i] || 0.5), 0); });
        },
        labels: [{ text: V('výrazně víc = vadný vstřikovač', 'much more = faulty injector'), at: function () { var p = tubes[tubes.length - 1].group.position; return new THREE.Vector3(p.x, 0.46, p.z); }, show: [6, 10], level: 'danger' }],
        captions: [
          { text: V('Zpětný (přepadový) test: odměrky na přepady, motor běží (dle postupu výrobce)', 'Leak-off test: measuring tubes on the returns, engine running (per manufacturer procedure)') },
          { text: V('Porovnává se množství mezi válci – limity dle příručky', 'Compare the amount between cylinders – limits per manual'), show: [4, 10], level: 'info' }
        ]
      };
    }
  });

  R('injectors.washer', {
    duration: 7, camera: { pos: [0.18, 0.25, 0.3], target: [0, 0.13, 0], fov: 32 }, shadow: 0.5, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, r = rack(ctx, K, { hp: false, leakoff: false });
      var j = r.injs[1];
      var tar = K.mesh(K.G.torus(0.017, 0.006, PI * 2, 24), K.M.clone('blackOxide', { color: 0x0f0c08, roughness: 0.3 }));
      tar.rotation.x = PI / 2; tar.position.set(j.position.x, 0.124, 0); r.root.add(tar);
      var bubbles = K.FX.puff(0x555555, 10, 0.02, 0.08); bubbles.group.position.set(j.position.x, 0.13, 0); r.root.add(bubbles.group);
      return {
        root: r.root,
        update: function (t) { bubbles.update(t, Math.sin(t * 4) > 0); tar.scale.setScalar(0.9 + 0.1 * T.lin(t, 0, 7)); },
        labels: [{ text: V('černý dehet / „chuffing“ = netěsná podložka', 'black tar / "chuffing" = leaking washer'), at: [j.position.x, 0.2, 0.03], level: 'danger' }],
        captions: [
          { text: V('Netěsná měděná podložka: syčení spalin, černý dehet kolem vstřikovače', 'Leaking copper washer: hissing exhaust gas, black tar around the injector') },
          { text: V('Řešit brzy – karbon vstřikovač „zapeče“ a vytažení je pak drahé', 'Fix soon – carbon bakes the injector in and removal gets expensive'), show: [3, 7], level: 'warning' }
        ]
      };
    }
  });

  R('injectors.remove', {
    duration: 9, camera: { pos: [0.3, 0.45, 0.5], target: [0, 0.2, 0], fov: 34 }, shadow: 0.7, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, r = rack(ctx, K, { leakoff: false });
      var j = r.injs[1];
      var clamp = K.mesh(K.G.rbox(0.05, 0.012, 0.03, 0.004), 'blackOxide'); clamp.position.set(j.position.x + 0.03, 0.13, 0.03); r.root.add(clamp);
      var bolt = K.P.bolt({ r: 0.004, len: 0.03 }); bolt.position.set(j.position.x + 0.045, 0.137, 0.03); r.root.add(bolt);
      var puller = new THREE.Group();
      var rod = K.mesh(K.G.cyl(0.005, 0.3, 12), 'steel'); rod.position.y = 0.15; puller.add(rod);
      var weight = K.mesh(K.G.cyl(0.022, 0.06, 20), 'toolRed'); puller.add(weight);
      r.root.add(puller);
      return {
        root: r.root,
        update: function (t) {
          var b = T.seg(t, 0.5, 2.0);
          bolt.position.y = 0.137 + b * 0.04; bolt.rotation.y = -b * PI * 3; clamp.visible = t < 2.4;
          var pull = T.seg(t, 3, 7.5);
          puller.visible = t > 2.6;
          puller.position.set(j.position.x, j.position.y + 0.18 + pull * 0.06, 0);
          weight.position.y = 0.1 + Math.abs(Math.sin(t * 5)) * 0.12 * (t > 3 && t < 7.5 ? 1 : 0);
          j.position.y = 0.095 + pull * 0.06;
        },
        captions: [
          { text: V('Vysokotlaké trubky povolovat jen dle postupu, ihned zaslepit', 'Undo high-pressure pipes only per procedure, cap them at once') },
          { text: V('Zapečený vstřikovač: nepáčit, nebít – speciální vytahovák / dílna', 'Seized injector: no prying or hammering – special puller / workshop'), show: [3, 9], level: 'danger' }
        ]
      };
    }
  });

  R('injectors.seat', {
    duration: 8, camera: { pos: [0.18, 0.28, 0.3], target: [0, 0.12, 0], fov: 32 }, shadow: 0.5, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, r = rack(ctx, K, { hp: false, leakoff: false });
      var j = r.injs[1]; j.visible = false;
      var newInj = injector(K); r.root.add(newInj);
      var gw = K.FX.glow(newInj.userData.washer, 0x30a46c);
      var brush = K.mesh(K.G.cyl(0.011, 0.05, 16), 'brass'); r.root.add(brush);
      return {
        root: r.root,
        update: function (t) {
          var cl = t < 3.2;
          brush.visible = cl; brush.position.set(j.position.x, 0.13 + Math.abs(Math.sin(t * 6)) * 0.02, 0); brush.rotation.y = t * 12;
          var down = T.seg(t, 3.6, 6);
          newInj.visible = t > 3.2; newInj.position.set(j.position.x, 0.095 + (1 - down) * 0.12, 0);
          gw(T.pulse(t, 3.2, 6.5));
        },
        labels: [{ text: V('vždy nová měděná podložka', 'always a new copper washer'), at: function () { return newInj.position.clone().add(new THREE.Vector3(0.03, 0.03, 0.02)); }, show: [3.4, 7], level: 'ok' }],
        captions: [
          { text: V('Sedlo vyčistit (speciální kartáč / fréza), nic nesmí spadnout do válce', 'Clean the seat (special brush / cutter), nothing may drop into the cylinder') },
          { text: V('Nová podložka, nový upínací šroub, moment dle příručky', 'New washer, new clamp bolt, torque per manual'), show: [4, 8], level: 'info' }
        ]
      };
    }
  });

  R('injectors.coding', scan(function (ctx, t) {
    var code = 'A7F3K9P2'.slice(0, Math.min(8, Math.floor(t * 2)));
    var done = t > 5;
    return {
      title: (TOOL[ctx.vehicle] || 'OBD') + ' · ' + ctx.t(V('kódování vstřikovače', 'injector coding')),
      rows: [
        { t: ctx.t(V('Válec', 'Cylinder')), r: '2' },
        { t: ctx.t(V('Kód z vstřikovače', 'Code on injector')), r: code + (done ? '' : '_'), rc: '#f5a524' },
        { t: ctx.t(V('Stav', 'Status')), r: done ? ctx.t(V('uloženo ✔', 'saved ✔')) : '…', rc: done ? '#30a46c' : '#9fd3f2' }
      ],
      foot: 'IMA / C2I / QR'
    };
  }, [
    { text: V('Nový vstřikovač: opsat kód z hlavy a zadat do řídicí jednotky (pokud to motor vyžaduje)', 'New injector: copy the code from its head and enter it into the ECU (if the engine requires it)') },
    { text: V('Bez kódování může motor kouřit, klepat nebo poškodit DPF', 'Without coding the engine may smoke, knock or damage the DPF'), show: [3, 7], level: 'warning' }
  ]));

  R('injectors.test', scan(function (ctx, t) {
    var n = ncyl(ctx.vehicle), k = Math.min(1, t / 4), bars = [];
    var vals = [0.2, -0.3, 0.15, 0.25];
    for (var i = 0; i < n; i++) { var v = vals[i] * (i === 1 ? 1 : 1) * (0.5 + 0.5 * k); bars.push({ l: 'C' + (i + 1), v: v * 0.8, c: '#30a46c' }); }
    return { title: (TOOL[ctx.vehicle] || 'OBD') + ' · ' + ctx.t(V('kontrola', 'check')), bars: bars, foot: ctx.t(V('Vše v limitu, žádné chyby', 'All within limits, no faults')) };
  }, [
    { text: V('Odvzdušnit, nastartovat, zkontrolovat těsnost (pohledem!) a korekce', 'Prime, start, check for leaks (visually!) and corrections') },
    { text: V('Po 50–100 km znovu zkontrolovat těsnost podložek', 'Re-check the washers for leaks after 50–100 km'), show: [3, 7], level: 'info' }
  ]));

  R('injectors.petrol', {
    duration: 7, camera: { pos: [0.3, 0.35, 0.45], target: [0, 0.15, 0], fov: 34 }, shadow: 0.6, thumbT: 3,
    build: function (ctx, K) {
      var H = S.n5, root = new THREE.Group();
      var port = ctx.vehicle === 'mb-cl500-c216';
      var head = K.mesh(K.G.rbox(0.3, 0.14, 0.2, 0.015), K.M.clone('aluCast', { transparent: true, opacity: 0.4 })); head.position.y = 0.08; head.userData.noShadow = true; root.add(head);
      var chamber = K.mesh(K.G.cyl(0.04, 0.06, 28), K.M.clone('blackOxide', { transparent: true, opacity: 0.6 })); chamber.position.y = 0.03; root.add(chamber);
      var runner = H.pipe(K, [[-0.2, 0.2, 0], [-0.08, 0.14, 0], [-0.02, 0.07, 0]], 0.025, K.M.clone('plasticBlack', { transparent: true, opacity: 0.45 })); root.add(runner);
      var inj = injector(K); inj.scale.setScalar(0.8);
      if (port) { inj.position.set(-0.1, 0.17, 0.0); inj.rotation.z = -0.9; } else { inj.position.set(0.03, 0.08, 0.04); inj.rotation.z = 0.5; }
      root.add(inj);
      var spray = K.mesh(new THREE.ConeGeometry(0.02, 0.06, 16, 1, true), K.M.clone('water', { color: 0xf3e3a0, opacity: 0.5 }));
      if (port) { spray.position.set(-0.07, 0.12, 0); spray.rotation.z = 2.3; } else { spray.position.set(0.01, 0.05, 0.015); spray.rotation.z = 3.6; }
      root.add(spray);
      return {
        root: root,
        update: function (t) { spray.visible = (t * 4) % 1 < 0.5; },
        captions: [
          { text: port ? V('Nepřímý vstřik do sání: tlak jen několik barů, vstřikovače bývají velmi odolné', 'Port injection into the intake: only a few bar, injectors are usually very durable') : V('Přímý vstřik benzínu: vysoký tlak (stovky barů), speciální těsnění – dílna', 'Petrol direct injection: high pressure (hundreds of bar), special seals – workshop'), level: port ? null : 'warning' },
          { text: V('Diagnostika: palivové korekce (fuel trims) a počítadla vynechávání', 'Diagnosis: fuel trims and misfire counters'), show: [2.5, 7], level: 'info' }
        ]
      };
    }
  });
})(window.STU);
