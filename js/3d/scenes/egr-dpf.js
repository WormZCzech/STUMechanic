/* 3D scenes: EGR valve & DPF / GPF care. Uses S.n5 helpers from fuel-filter.js. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var PETROL = ['mb-cl500-c216', 'volvo-xc60-b4', 'toyota-gr-yaris'];
  var isPetrol = function (v) { return PETROL.indexOf(v) >= 0; };
  var FILTER = function (v) { return isPetrol(v) ? 'GPF' : 'DPF'; };
  var TOOL = { 'generic': 'OBD', 'mb-cl500-c216': 'XENTRY', 'volvo-xc60-b4': 'VIDA', 'skoda-octavia-rs-tdi': 'VCDS', 'toyota-gr-yaris': 'Techstream', 'citroen-jumper-22hdi': 'Diagbox' };

  /** Particulate filter canister with a cut-away showing the channels. Axis = X, length L. */
  function filterCanister(K, L, r) {
    L = L || 0.5; r = r || 0.12;
    var g = new THREE.Group();
    var shellGeo = new THREE.LatheGeometry([[0.04, -L / 2 - 0.1], [r, -L / 2 + 0.02], [r, L / 2 - 0.02], [0.04, L / 2 + 0.1]].map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 40, 0.7, PI * 2 - 1.4);
    var shell = K.mesh(shellGeo, K.M.clone('steel', { side: THREE.DoubleSide }));
    shell.rotation.z = -PI / 2; g.add(shell);
    // cut-away face: honeycomb block (half) visible on +Z side
    var cut = new THREE.Group();
    var n = 6, cw = (r * 1.5) / n;
    var soot = [], ash = [];
    for (var i = 0; i < n; i++) {
      var y = -r * 0.75 + cw * (i + 0.5);
      var wall = K.mesh(K.G.box(L - 0.02, 0.003, r * 1.4), K.M.clone('plasticWhite', { color: 0xd9d2c3 })); wall.position.set(0, y - cw / 2, 0.0); cut.add(wall);
      if (i % 2 === 0) {
        var sm = K.mesh(K.G.box(L - 0.06, cw * 0.7, r * 1.3), K.M.clone('blackOxide', { color: 0x151515, roughness: 1 })); sm.position.set(0, y, 0); cut.add(sm); soot.push(sm);
        var am = K.mesh(K.G.box(0.04, cw * 0.8, r * 1.3), K.M.clone('concrete', { color: 0xb8b2a6 })); am.position.set(L / 2 - 0.05, y, 0); cut.add(am); ash.push(am);
        var plug = K.mesh(K.G.box(0.01, cw, r * 1.32), 'plasticGrey'); plug.position.set(-L / 2 + 0.01, y + cw, 0); cut.add(plug);
      }
    }
    var top = K.mesh(K.G.box(L - 0.02, 0.003, r * 1.4), K.M.clone('plasticWhite', { color: 0xd9d2c3 })); top.position.y = r * 0.75; cut.add(top);
    g.add(cut);
    g.userData = { soot: soot, ash: ash, cut: cut };
    return g;
  }

  /** EGR valve: aluminium body + actuator + flanges; poppet plate with carbon cake. */
  function egrValve(K) {
    var g = new THREE.Group();
    var body = K.mesh(K.G.rbox(0.11, 0.09, 0.08, 0.012), 'aluCast'); g.add(body);
    var act = K.mesh(K.G.rbox(0.09, 0.08, 0.075, 0.01), 'plasticBlack'); act.position.y = 0.085; g.add(act);
    var plug = K.mesh(K.G.rbox(0.03, 0.022, 0.02, 0.004), 'plasticGrey'); plug.position.set(0.05, 0.1, 0.03); g.add(plug);
    [-1, 1].forEach(function (s) {
      var fl = K.mesh(K.G.cylX(0.04, 0.012, 28), 'aluCast'); fl.position.x = s * 0.062; g.add(fl);
      [[0.03, 0.03], [-0.03, -0.03]].forEach(function (p) {
        var b = K.P.bolt({ r: 0.004, len: 0.02, mat: 'zinc' }); b.rotation.z = s * PI / 2; b.position.set(s * 0.07, p[0], p[1]); g.add(b);
      });
    });
    var valve = new THREE.Group();
    var stem = K.mesh(K.G.cyl(0.004, 0.06, 12), 'steel'); stem.position.y = 0.03; valve.add(stem);
    var disc = K.mesh(K.G.cyl(0.022, 0.006, 28), 'steel'); valve.add(disc);
    var carbon = K.mesh(K.G.sphere(0.03, 16), K.M.clone('blackOxide', { color: 0x111111, roughness: 1 })); carbon.scale.set(1.1, 0.5, 1.1); carbon.position.y = -0.006; valve.add(carbon);
    valve.position.set(0, -0.06, 0); valve.visible = false; g.add(valve);
    var gasket = K.mesh(K.G.torus(0.032, 0.004, PI * 2, 28), 'copper'); gasket.rotation.y = PI / 2; gasket.position.x = 0.072; g.add(gasket);
    g.userData = { valve: valve, carbon: carbon, gasket: gasket, plug: plug };
    return g;
  }

  /** Engine + exhaust line + EGR loop + filter. */
  function system(ctx, K) {
    var H = S.n5, root = new THREE.Group();
    var eng = K.P.engine({ cyl: 4 }); eng.rotation.y = 0; root.add(eng);
    var ex = [[-0.02, 0.38, -0.26], [0.0, 0.36, -0.42], [0.1, 0.18, -0.5], [0.3, 0.12, -0.55], [0.55, 0.12, -0.55]];
    var turbo = K.mesh(K.G.sphere(0.07, 20), 'castIron'); turbo.position.set(0.0, 0.36, -0.42); root.add(turbo);
    root.add(H.pipe(K, ex, 0.03, 'steelDark'));
    var cat = K.mesh(K.G.cylX(0.08, 0.22, 32), 'steel'); cat.position.set(0.5, 0.12, -0.55); root.add(cat);
    var dpf = filterCanister(K, 0.5, 0.11); dpf.position.set(0.95, 0.12, -0.55); root.add(dpf);
    root.add(H.pipe(K, [[1.25, 0.12, -0.55], [1.6, 0.1, -0.55], [1.9, 0.12, -0.5]], 0.028, 'steelDark'));
    var egrPath = [[0.2, 0.46, -0.27], [0.25, 0.62, -0.25], [0.3, 0.78, -0.05], [0.3, 0.75, 0.15], [0.2, 0.66, 0.28]];
    root.add(H.pipe(K, egrPath, 0.016, 'steel'));
    var egr = egrValve(K); egr.position.set(0.3, 0.78, -0.02); egr.rotation.y = PI / 2; egr.scale.setScalar(0.9); root.add(egr);
    var sootMat = K.M.clone('blackOxide', { color: 0x1a1a1a, roughness: 1 });
    var flowEx = H.flow(K, ex.concat([[0.95, 0.12, -0.55], [1.2, 0.12, -0.55]]), sootMat, 22, 0.012);
    var flowEgr = H.flow(K, egrPath, sootMat, 9, 0.01);
    root.add(flowEx.group); root.add(flowEgr.group);
    return { root: root, egr: egr, dpf: dpf, flowEx: flowEx, flowEgr: flowEgr };
  }
  var SYS_CAM = { pos: [1.6, 1.4, 1.5], target: [0.55, 0.35, -0.2], fov: 38 };

  R('egr-dpf.overview', {
    duration: 8, camera: SYS_CAM, shadow: 1.6, thumbT: 3,
    build: function (ctx, K) {
      var s = system(ctx, K), f = FILTER(ctx.vehicle);
      return {
        root: s.root,
        update: function (t) {
          s.flowEx.update(t, true, 0.18); s.flowEgr.update(t, !isPetrol(ctx.vehicle) || true, 0.12);
          s.dpf.userData.soot.forEach(function (m) { m.scale.y = 0.3 + 0.7 * K.T.lin(t % 8, 0, 8); });
        },
        labels: [
          { text: V('EGR ventil – vrací část spalin do sání', 'EGR valve – returns some exhaust to the intake'), at: [0.3, 0.92, -0.02], level: 'accent' },
          { text: V('katalyzátor', 'catalyst'), at: [0.5, 0.25, -0.55] },
          { text: { cs: f + ' – zachytí saze', en: f + ' – traps soot' }, at: [0.95, 0.27, -0.55], level: 'accent' },
          { text: V('turbo', 'turbo'), at: [0, 0.47, -0.42] }
        ],
        captions: [
          { text: V('EGR snižuje NOx, filtr pevných částic zachytí saze a pravidelně je spálí (regenerace)', 'EGR lowers NOx, the particulate filter traps soot and regularly burns it off (regeneration)') }
        ]
      };
    }
  });

  R('egr-dpf.legal', {
    duration: 6, camera: { pos: [0.9, 0.6, 1.1], target: [0.1, 0.18, 0], fov: 34 }, shadow: 1, thumbT: 3,
    build: function (ctx, K) {
      var H = S.n5, root = new THREE.Group();
      var dpf = filterCanister(K, 0.5, 0.11); dpf.position.set(0, 0.16, 0); root.add(dpf);
      var cross = new THREE.Group();
      [1, -1].forEach(function (s) { var b = K.mesh(K.G.box(0.7, 0.04, 0.04), 'hiDanger'); b.rotation.z = s * PI / 5; cross.add(b); });
      cross.position.set(0, 0.16, 0.16); root.add(cross);
      var sign = H.sign(K, 0.4, 0.26, [{ t: 'STK ✖', s: 0.75, c: '#c9282d' }, { t: ctx.t(V('Nevyhoví · pokuta', 'Fail · fine')), s: 0.4 }, { t: ctx.t(V('ztráta homologace', 'loss of type approval')), s: 0.4 }]);
      sign.position.set(0.45, 0.32, -0.05); root.add(sign);
      return {
        root: root,
        update: function (t) { cross.visible = t > 0.6; cross.scale.setScalar(0.9 + 0.1 * Math.sin(t * 5)); },
        captions: [
          { text: V('Odstranění DPF / GPF / EGR nebo jejich vypnutí v softwaru je v ČR i EU NELEGÁLNÍ', 'Removing a DPF / GPF / EGR or disabling it in software is ILLEGAL in CZ and the EU'), level: 'danger' },
          { text: V('Tento návod ukazuje jen legální údržbu a opravy', 'This tutorial shows legal maintenance and repair only'), show: [2, 6], level: 'info' }
        ]
      };
    }
  });

  function scanScene(rowsFn, extra) {
    return {
      duration: 7, camera: { pos: [0.08, 0.32, 0.55], target: [0, 0.18, 0], fov: 32 }, shadow: 0.6, thumbT: 4,
      build: function (ctx, K) {
        var H = S.n5, root = new THREE.Group();
        root.add(H.bench(K, 0.9, 0.6));
        var sc = H.scanner(K, rowsFn(ctx, 0)); sc.group.position.set(0, 0.18, 0); sc.group.rotation.x = -0.35; root.add(sc.group);
        var o = extra ? extra(ctx, K, root) : {};
        return {
          root: root,
          update: function (t) { sc.set(rowsFn(ctx, Math.floor(t * 2) / 2)); if (o.update) o.update(t); },
          captions: o.captions, labels: o.labels
        };
      }
    };
  }

  R('egr-dpf.codes', scanScene(function (ctx, t) {
    var f = FILTER(ctx.vehicle), k = Math.min(1, t / 4);
    return {
      title: TOOL[ctx.vehicle] || 'OBD',
      rows: [
        { t: f + ' ' + ctx.t(V('saze', 'soot')), r: (12 + 18 * k).toFixed(0) + ' g', rc: k > 0.7 ? '#e5484d' : '#f5a524' },
        { t: ctx.t(V('Dif. tlak', 'Diff. pressure')), r: (40 + 140 * k).toFixed(0) + ' mbar', rc: k > 0.7 ? '#e5484d' : '#9fd3f2' },
        { t: ctx.t(V('Km od regenerace', 'km since regen')), r: (180 + 400 * k).toFixed(0) },
        { t: 'EGR ' + ctx.t(V('odchylka', 'deviation')), r: (2 + 8 * k).toFixed(0) + ' %' },
        { t: 'P2002 / P2463 / P0401', c: '#f5a524', bg: '#2a2010' }
      ],
      foot: ctx.t(V('Hodnoty jsou ilustrační – limity dle výrobce', 'Values are illustrative – limits per manufacturer'))
    };
  }, function (ctx) {
    return { captions: [
      { text: V('Nejdřív diagnostika: množství sazí, diferenční tlak, odchylka EGR, chybové kódy', 'Diagnose first: soot load, differential pressure, EGR deviation, fault codes') },
      { text: V('Kód ukazuje okruh, ne vadný díl – nejdřív kontrola hadiček a snímačů', 'A code points to a circuit, not a part – check hoses and sensors first'), show: [3, 7], level: 'info' }
    ] };
  }));

  R('egr-dpf.regen', {
    duration: 9, camera: { pos: [0.9, 0.55, 1.0], target: [0.0, 0.16, 0], fov: 34 }, shadow: 1, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var dpf = filterCanister(K, 0.5, 0.11); dpf.position.set(0, 0.16, 0); root.add(dpf);
      var glowMats = dpf.userData.soot.map(function (m) { return m.material; });
      var heat = K.FX.puff(0xffb070, 12, 0.08, 0.25); heat.group.position.set(0.3, 0.2, 0); root.add(heat.group);
      var gauge = S.n5.sign(K, 0.24, 0.12, ['600 °C'], { border: '#d98500' }); gauge.position.set(-0.1, 0.38, 0); root.add(gauge);
      return {
        root: root,
        update: function (t) {
          var hot = T.seg(t, 1, 3) * (1 - T.seg(t, 7.5, 8.5)), burn = T.seg(t, 3, 7.5);
          glowMats.forEach(function (m) { m.emissive = m.emissive || new THREE.Color(); m.emissive.setRGB(1, 0.35, 0.05); m.emissiveIntensity = hot * 1.4; });
          dpf.userData.soot.forEach(function (m) { m.scale.y = Math.max(0.05, 1 - burn * 0.95); });
          heat.update(t, hot > 0.3);
          gauge.visible = hot > 0.2;
        },
        labels: [{ text: V('saze shoří na CO₂, popel zůstane', 'soot burns to CO₂, ash remains'), at: [0.2, 0.3, 0.06], show: [3, 8], level: 'accent' }],
        captions: [
          { text: V('Regenerace: filtr se ohřeje na ~600 °C a saze vyhoří', 'Regeneration: the filter heats to ~600 °C and the soot burns off') },
          { text: V('Pomáhá: 15–20 min rovnoměrné jízdy mimo město (dálnice, vyšší otáčky)', 'Helps: 15–20 min of steady driving out of town (motorway, higher revs)'), show: [3, 9] },
          { text: V('Neprerušujte probíhající regeneraci vypnutím motoru, pokud to jde', 'Avoid switching off during an active regeneration if you can'), show: [6, 9], level: 'info' }
        ]
      };
    }
  });

  R('egr-dpf.sensor', {
    duration: 8, camera: { pos: [0.85, 0.6, 1.0], target: [0.05, 0.2, 0], fov: 34 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var H = S.n5, T = K.T, root = new THREE.Group();
      var dpf = filterCanister(K, 0.5, 0.11); dpf.position.set(0, 0.16, 0); root.add(dpf);
      var sensor = K.mesh(K.G.rbox(0.07, 0.05, 0.04, 0.008), 'plasticBlack'); sensor.position.set(0, 0.42, -0.05); root.add(sensor);
      var conn = K.mesh(K.G.rbox(0.025, 0.02, 0.02, 0.004), 'plasticGrey'); conn.position.set(0, 0.45, -0.03); root.add(conn);
      var h1 = H.pipe(K, [[-0.2, 0.26, -0.03], [-0.15, 0.36, -0.05], [-0.02, 0.41, -0.05]], 0.006, 'rubber'); root.add(h1);
      var h2 = H.pipe(K, [[0.22, 0.26, -0.03], [0.17, 0.36, -0.05], [0.02, 0.41, -0.05]], 0.006, K.M.clone('rubber')); root.add(h2);
      var crack = K.mesh(K.G.torus(0.008, 0.002, PI * 2, 12), 'hiDanger'); crack.position.set(0.17, 0.36, -0.05); root.add(crack);
      var puff = K.FX.puff(0x777777, 8, 0.03, 0.08); puff.group.position.copy(crack.position); root.add(puff.group);
      var g2 = K.FX.glow(h2, 0xe5484d);
      return {
        root: root,
        update: function (t) { var k = T.seg(t, 2, 3.5); g2(k * (0.6 + 0.4 * Math.sin(t * 6))); crack.visible = k > 0.1; puff.update(t, k > 0.5); },
        labels: [
          { text: V('snímač diferenčního tlaku', 'differential pressure sensor'), at: [0, 0.5, -0.05] },
          { text: V('prasklá / ucpaná hadička = falešné hodnoty', 'cracked / blocked hose = false readings'), at: [0.17, 0.42, -0.05], show: [2.5, 8], level: 'danger' }
        ],
        captions: [
          { text: V('Zkontrolujte hadičky ke snímači: praskliny, ohyby, prohození vstup/výstup', 'Check the sensor hoses: cracks, kinks, inlet/outlet swapped') },
          { text: V('Teprve pak hledejte vadný snímač nebo ucpaný filtr', 'Only then suspect a faulty sensor or a blocked filter'), show: [4, 8], level: 'info' }
        ]
      };
    }
  });

  R('egr-dpf.forced', {
    duration: 10, camera: { pos: [4.8, 2.2, 4.6], target: [-0.4, 0.5, 0], fov: 34 }, shadow: 3.5, thumbT: 6,
    build: function (ctx, K) {
      var H = S.n5, T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var d = c.dims;
      var heat = K.FX.puff(0xbbbbbb, 16, 0.12, 0.6); heat.group.position.set(d.rear - 0.05, 0.25, -0.4); root.add(heat.group);
      var sc = H.scanner(K, null); sc.group.position.set(d.rear - 0.3, 1.0, d.W / 2 + 0.9); sc.group.rotation.y = -0.6; sc.group.scale.setScalar(2.2); root.add(sc.group);
      var ext = new THREE.Group();
      var ebody = K.mesh(K.G.cyl(0.08, 0.45, 24), 'toolRed'); ebody.position.y = 0.225; ext.add(ebody);
      var ehead = K.mesh(K.G.rbox(0.06, 0.05, 0.08, 0.01), 'plasticBlack'); ehead.position.y = 0.48; ext.add(ehead);
      ext.position.set(d.rear - 0.6, 0, d.W / 2 + 0.7); root.add(ext);
      var dist = Math.max(d.L * 1.2, 5.2);
      return {
        root: root,
        update: function (t) {
          var p = T.lin(t, 1.5, 9);
          sc.set({ title: (TOOL[ctx.vehicle] || 'OBD') + ' · ' + FILTER(ctx.vehicle), rows: [
            { t: ctx.t(V('Servisní regenerace', 'Service regeneration')), r: t < 1.5 ? '—' : Math.round(p * 100) + ' %' },
            { t: ctx.t(V('Teplota před filtrem', 'Temp. before filter')), r: Math.round(200 + 400 * Math.min(1, p * 2)) + ' °C', rc: '#f5a524' }
          ], progress: Math.round(p * 20) / 20 });
          heat.update(t, t > 2);
        },
        cameraPath: function () { return { pos: [d.rear - dist * 0.55, d.H * 0.7 + 0.8, dist * 0.75], target: [d.rear + 0.6, 0.6, 0.4] }; },
        labels: [{ text: V('výfuk 600 °C+', 'exhaust 600 °C+'), at: [d.rear - 0.1, 0.45, -0.4], level: 'danger', show: [2, 10] },
          { text: V('hasicí přístroj', 'fire extinguisher'), at: [d.rear - 0.6, 0.6, d.W / 2 + 0.7] }],
        captions: [
          { text: V('Vynucená regenerace diagnostikou: venku, mimo trávu a hořlavé materiály', 'Forced regeneration with a scan tool: outdoors, away from grass and flammables'), level: 'danger' },
          { text: V('Jen při normálním množství sazí – přeplněný filtr se může přehřát (dílna)', 'Only with a normal soot load – an overloaded filter can overheat (workshop)'), show: [3.5, 10], level: 'warning' }
        ]
      };
    }
  });

  R('egr-dpf.ash', {
    duration: 7, camera: { pos: [0.55, 0.45, 0.85], target: [0, 0.16, 0.04], fov: 32 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var dpf = filterCanister(K, 0.5, 0.11); dpf.position.set(0, 0.16, 0); root.add(dpf);
      return {
        root: root,
        update: function (t) {
          var k = T.lin(t, 0.5, 6);
          dpf.userData.soot.forEach(function (m) { m.scale.y = 0.15; });
          dpf.userData.ash.forEach(function (m) { m.scale.x = 1 + k * 4; m.position.x = 0.2 - 0.02 * k * 4; });
        },
        labels: [{ text: V('popel (z oleje) – nespálí se', 'ash (from oil) – does not burn'), at: [0.18, 0.3, 0.08], level: 'accent' }],
        captions: [
          { text: V('Popel z aditiv oleje se hromadí trvale – proto low-SAPS olej', 'Ash from oil additives builds up permanently – hence low-SAPS oil') },
          { text: V('Plný popela = profesionální čištění nebo nový filtr (legálně)', 'Full of ash = professional cleaning or a new filter (legally)'), show: [3, 7], level: 'info' }
        ]
      };
    }
  });

  function egrBench(ctx, K) {
    var H = S.n5, root = new THREE.Group();
    root.add(H.bench(K, 0.9, 0.6));
    var manifold = K.mesh(K.G.rbox(0.3, 0.1, 0.12, 0.02), 'aluCast'); manifold.position.set(-0.19, 0.08, 0); root.add(manifold);
    var port = K.mesh(K.G.cylX(0.03, 0.01, 24), 'blackOxide'); port.position.set(-0.035, 0.1, 0); root.add(port);
    var egr = egrValve(K); egr.position.set(0.035, 0.1, 0); egr.rotation.y = PI; root.add(egr);
    return { root: root, egr: egr };
  }
  var EGR_CAM = { pos: [0.35, 0.35, 0.5], target: [0, 0.1, 0], fov: 34 };

  R('egr-dpf.egrOut', {
    duration: 8, camera: EGR_CAM, shadow: 0.6, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, b = egrBench(ctx, K), u = b.egr.userData;
      var rat = K.P.ratchet(0.2, 0.008); rat.rotation.z = -PI / 2; rat.position.set(0.12, 0.13, 0.03); b.root.add(rat);
      return {
        root: b.root,
        update: function (t) {
          u.plug.position.y = 0.1 + T.seg(t, 0.4, 1.2) * 0.05;
          rat.visible = t > 1.2 && t < 4.2; rat.rotation.x = Math.sin(t * 8) * 0.4;
          var off = T.seg(t, 4.4, 6);
          b.egr.position.set(0.035 + off * 0.12, 0.1 + off * 0.12, 0);
        },
        labels: [{ text: V('konektor odpojit', 'unplug connector'), at: [0.05, 0.2, 0.03], show: [0.3, 2] }],
        captions: [
          { text: V('Studený motor, odpojit konektor, povolit šrouby příruby', 'Cold engine, unplug the connector, undo the flange bolts') },
          { text: V('Starou těsnicí podložku vždy vyhodit', 'Always discard the old gasket'), show: [4, 8], level: 'info' }
        ]
      };
    }
  });

  R('egr-dpf.egrClean', {
    duration: 8, camera: { pos: [0.18, 0.18, 0.32], target: [0.0, 0.06, 0], fov: 34 }, shadow: 0.5, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, H = S.n5, root = new THREE.Group();
      root.add(H.bench(K, 0.7, 0.5));
      var egr = egrValve(K); egr.position.set(0, 0.12, 0); root.add(egr);
      var u = egr.userData; u.valve.visible = true;
      var cMat = u.carbon.material; cMat.transparent = true;
      var brush = new THREE.Group();
      var hd = K.mesh(K.G.rbox(0.05, 0.012, 0.016, 0.004), 'wood'); brush.add(hd);
      var br = K.mesh(K.G.box(0.04, 0.01, 0.014), 'brass'); br.position.y = -0.01; brush.add(br);
      root.add(brush);
      return {
        root: root,
        update: function (t) {
          var k = T.lin(t, 0.8, 6);
          u.carbon.scale.set(1.1 * (1 - k * 0.85), 0.5 * (1 - k * 0.9) + 0.02, 1.1 * (1 - k * 0.85));
          cMat.opacity = 1 - k * 0.8;
          brush.position.set(Math.sin(t * 9) * 0.02, 0.12 - 0.06 - 0.03, 0.01);
          brush.visible = t > 0.6 && t < 6.4;
        },
        labels: [{ text: V('karbon', 'carbon'), at: [0.0, 0.05, 0.03], show: [0, 2.5], level: 'accent' }],
        captions: [
          { text: V('Karbon změkčit čističem sání/EGR, odstranit plastovou nebo mosaznou škrabkou', 'Soften the carbon with intake/EGR cleaner, remove with a plastic or brass scraper') },
          { text: V('Do elektrického aktuátoru čistič nestříkat', 'Do not spray cleaner into the electric actuator'), show: [3, 8], level: 'warning' }
        ]
      };
    }
  });

  R('egr-dpf.egrIn', {
    duration: 8, camera: EGR_CAM, shadow: 0.6, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, b = egrBench(ctx, K), u = b.egr.userData;
      var gl = K.FX.glow(u.gasket, 0x30a46c);
      var tw = K.P.torqueWrench(0.25); tw.rotation.z = -PI / 2; tw.position.set(0.12, 0.13, 0.03); b.root.add(tw);
      return {
        root: b.root,
        update: function (t) {
          var on = T.seg(t, 0.4, 2);
          b.egr.position.set(0.035 + (1 - on) * 0.12, 0.1 + (1 - on) * 0.12, 0);
          gl(T.pulse(t, 0.2, 2.6));
          tw.visible = t > 2.6 && t < 5; tw.rotation.x = Math.sin(t * 6) * 0.25;
          u.plug.position.y = 0.1 + (1 - T.seg(t, 5.2, 6)) * 0.05;
        },
        labels: [{ text: V('nové těsnění', 'new gasket'), at: [0.12, 0.16, 0.03], show: [0.3, 2.6], level: 'ok' }],
        captions: [
          { text: V('Nové těsnění, šrouby momentem dle příručky, konektor zacvaknout', 'New gasket, bolts to the specified torque, click the connector in') },
          { text: V('Poté adaptace EGR / vymazání chyb diagnostikou (dle vozu)', 'Then EGR adaptation / clear faults with a scan tool (per car)'), show: [5, 8], level: 'info' }
        ]
      };
    }
  });

  R('egr-dpf.oil', {
    duration: 6, camera: { pos: [0.35, 0.35, 0.65], target: [0, 0.16, 0], fov: 32 }, shadow: 0.8, thumbT: 3,
    build: function (ctx, K) {
      var H = S.n5, root = new THREE.Group();
      root.add(H.bench(K, 0.9, 0.6));
      var can = K.P.oilCan(0x1f3d6b); can.position.set(-0.05, 0, 0); root.add(can);
      var spec = {
        'generic': 'ACEA C2/C3', 'mb-cl500-c216': 'MB 229.5', 'volvo-xc60-b4': 'VCC RBS0-2AE',
        'skoda-octavia-rs-tdi': 'VW 507.00', 'toyota-gr-yaris': 'API SP / ILSAC', 'citroen-jumper-22hdi': 'PSA B71 2290 (DPF)'
      }[ctx.vehicle] || 'ACEA C';
      var lbl = H.sign(K, 0.15, 0.12, [{ t: 'low-SAPS', s: 0.42, c: '#1f8a56' }, { t: spec, s: 0.26 }], { border: '#1f8a56' });
      lbl.position.set(-0.05, 0.13, 0.062); root.add(lbl);
      return {
        root: root,
        update: function (t) { can.rotation.y = Math.sin(t * 0.8) * 0.25; },
        captions: [
          { text: V('Jen olej s předepsanou normou (low-SAPS = málo popela)', 'Only oil with the specified approval (low-SAPS = little ash)') },
          { text: V('Špatný olej zanáší filtr popelem, který nejde vypálit', 'The wrong oil clogs the filter with ash that cannot be burned off'), show: [2.5, 6], level: 'warning' }
        ]
      };
    }
  });

  R('egr-dpf.test', scanScene(function (ctx, t) {
    var k = Math.min(1, t / 5);
    return {
      title: (TOOL[ctx.vehicle] || 'OBD') + ' · ' + ctx.t(V('živá data', 'live data')),
      rows: [
        { t: FILTER(ctx.vehicle) + ' ' + ctx.t(V('saze', 'soot')), r: (8 + 4 * k).toFixed(0) + ' g', rc: '#30a46c' },
        { t: ctx.t(V('Dif. tlak (3000 ot.)', 'Diff. pressure (3000 rpm)')), r: (35 + 10 * k).toFixed(0) + ' mbar', rc: '#30a46c' },
        { t: 'EGR ' + ctx.t(V('požadováno / skutečnost', 'requested / actual')), r: '42 / ' + (40 + Math.round(k * 2)) + ' %', rc: '#30a46c' },
        { t: ctx.t(V('Chybová paměť', 'Fault memory')), r: '0', rc: '#30a46c' }
      ],
      big: k > 0.9 ? 'OK ✔' : null
    };
  }, function () {
    return { captions: [
      { text: V('Zkušební jízda + živá data: hodnoty v limitech, žádné nové chyby', 'Test drive + live data: values within limits, no new faults') }
    ] };
  }));

  R('egr-dpf.petrol', {
    duration: 7, camera: SYS_CAM, shadow: 1.6, thumbT: 3,
    build: function (ctx, K) {
      var s = system(ctx, K);
      s.egr.visible = false;
      return {
        root: s.root,
        update: function (t) { s.flowEx.update(t, true, 0.22); s.flowEgr.update(t, false); s.dpf.userData.soot.forEach(function (m) { m.scale.y = 0.12; }); },
        labels: [{ text: V('filtr GPF (pokud je osazen)', 'GPF filter (if fitted)'), at: [0.95, 0.27, -0.55], level: 'accent' }],
        captions: [
          { text: V('Benzín: většinou bez externího EGR ventilu; GPF se regeneruje sám při jízdě', 'Petrol: mostly no external EGR valve; a GPF regenerates by itself while driving') },
          { text: V('Údržba = správný olej, občas delší jízda, diagnostika při kontrolce', 'Care = correct oil, an occasional longer drive, diagnosis when a warning light comes on'), show: [2.5, 7], level: 'info' }
        ]
      };
    }
  });
})(window.STU);
