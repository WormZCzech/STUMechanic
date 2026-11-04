/* 3D scenes: Mercedes 7G-Tronic (722.9). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  function latheX(K, pts, seg, phiLen) {
    var g = new THREE.LatheGeometry(pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), seg || 40, 0, phiLen || PI * 2);
    g.rotateZ(-PI / 2); return g;
  }

  /** 7G-Tronic cut-away along X (converter at -X). Centre at y = 0.5. */
  function trans(K, o) {
    o = o || {};
    var root = new THREE.Group(); root.position.y = 0.5;
    var caseMat = K.M.clone('aluCast', { transparent: true, opacity: o.opaque ? 1 : 0.18, depthWrite: !!o.opaque, side: THREE.DoubleSide });
    var caseM = K.mesh(latheX(K, [[0.2, -0.46], [0.21, -0.4], [0.2, -0.24], [0.15, -0.2], [0.15, 0.3], [0.09, 0.36], [0.06, 0.48], [0.04, 0.5]], 48), caseMat);
    caseM.userData.noShadow = !o.opaque; root.add(caseM);
    var conv = new THREE.Group(); conv.position.x = -0.34; root.add(conv);
    var tor = K.mesh(K.G.torus(0.12, 0.055, PI * 2, 48, 20), 'steel'); tor.rotation.y = PI / 2; conv.add(tor);
    var lock = K.mesh(K.G.cylX(0.1, 0.012, 48), 'padFriction'); lock.position.x = -0.06; conv.add(lock);
    var shaft = K.mesh(K.G.cylX(0.018, 0.85, 16), 'steelDark'); shaft.position.x = 0.04; root.add(shaft);
    var sets = [];
    [-0.12, 0.03, 0.17].forEach(function (x) {
      var g = new THREE.Group(); g.position.x = x; root.add(g);
      var ring = K.mesh(new THREE.TorusGeometry(0.105, 0.012, 10, 48), 'steelDark'); ring.rotation.y = PI / 2; g.add(ring);
      var sunG = K.G.gear(18, 0.032, 0.026, 0.035, 0.012); sunG.rotateY(PI / 2);
      var sun = K.mesh(sunG, 'steel'); g.add(sun);
      var carrier = new THREE.Group(); g.add(carrier);
      var plG = K.G.gear(16, 0.034, 0.028, 0.035, 0.006); plG.rotateY(PI / 2);
      var planets = [];
      for (var i = 0; i < 4; i++) { var p = K.mesh(plG, 'zinc'); var a = i / 4 * PI * 2; p.position.set(0, Math.cos(a) * 0.066, Math.sin(a) * 0.066); carrier.add(p); planets.push(p); }
      sets.push({ g: g, sun: sun, carrier: carrier, planets: planets });
    });
    var packs = [];
    [-0.2, -0.05, 0.1, 0.24].forEach(function (x) {
      var pk = new THREE.Group(); pk.position.x = x; root.add(pk);
      for (var i = 0; i < 6; i++) { var d = K.mesh(K.G.cylX(0.12 - (i % 2) * 0.01, 0.004, 40), i % 2 ? 'padFriction' : 'steel'); d.position.x = i * 0.007; pk.add(d); }
      packs.push(pk);
    });
    var vb = new THREE.Group(); vb.position.set(0.0, -0.21, 0); root.add(vb);
    var body = K.mesh(K.G.rbox(0.4, 0.07, 0.22, 0.01), 'aluCast'); vb.add(body);
    for (var s = 0; s < 6; s++) { var sol = K.mesh(K.G.cylZ(0.012, 0.05, 16), 'blackOxide'); sol.position.set(-0.15 + s * 0.06, -0.01, 0.12); vb.add(sol); }
    var plate = new THREE.Group(); plate.position.y = -0.045; vb.add(plate);
    var pcb = K.mesh(K.G.box(0.36, 0.006, 0.2), K.M.clone('epoxy', { color: 0x1f6b3a, roughness: 0.5 })); plate.add(pcb);
    for (var c = 0; c < 5; c++) { var chip = K.mesh(K.G.box(0.03, 0.006, 0.03), 'plasticBlack'); chip.position.set(-0.12 + c * 0.06, -0.005, -0.04); plate.add(chip); }
    var sensors = [];
    for (var n = 0; n < 3; n++) { var sn = K.mesh(K.G.cyl(0.01, 0.03, 12), 'plasticBlack'); sn.position.set(-0.1 + n * 0.1, 0.02, 0.06); plate.add(sn); sensors.push(sn); }
    var plug = K.mesh(K.G.cyl(0.018, 0.04, 20), 'plasticBlack'); plug.rotation.x = PI / 2; plug.position.set(0.12, 0, 0.12); plate.add(plug);
    var pan = new THREE.Group(); pan.position.y = -0.31; root.add(pan);
    var panM = K.mesh(K.G.rbox(0.44, 0.06, 0.26, 0.015), o.panOpaque === false ? K.M.clone('steelDark', { transparent: true, opacity: 0.25, depthWrite: false }) : 'steelDark'); pan.add(panM);
    var filter = K.mesh(K.G.rbox(0.3, 0.025, 0.16, 0.006), 'plasticBlack'); filter.position.y = 0.06; pan.add(filter);
    var snork = K.mesh(K.G.cyl(0.012, 0.03, 12), 'plasticBlack'); snork.position.set(0.05, 0.085, 0); pan.add(snork);
    var tube = K.mesh(K.G.tube([[0.2, -0.28, 0.1], [0.24, -0.1, 0.16], [0.26, 0.15, 0.18], [0.26, 0.3, 0.18]], 0.012), 'blackOxide'); root.add(tube);
    var tubeCap = K.mesh(K.G.cyl(0.018, 0.02, 16), 'toolRed'); tubeCap.position.set(0.26, 0.31, 0.18); root.add(tubeCap);
    var stand = K.mesh(K.G.rbox(0.5, 0.05, 0.3, 0.02), 'plasticGrey'); stand.position.set(0, -0.48, 0); root.add(stand);
    var leg = K.mesh(K.G.box(0.05, 0.02, 0.05), 'plasticGrey'); leg.position.set(0, -0.49, 0); root.add(leg);
    var st = { a: 0 };
    return {
      root: root, conv: conv, lock: lock, sets: sets, packs: packs, vb: vb, plate: plate, sensors: sensors, pan: pan, filter: filter, tubeCap: tubeCap, tube: tube,
      spin: function (dt, w) {
        st.a += w * dt;
        conv.rotation.x = st.a; shaft.rotation.x = st.a;
        sets.forEach(function (s, i) { s.sun.rotation.x = st.a; s.carrier.rotation.x = st.a * (0.3 + i * 0.12); s.planets.forEach(function (p) { p.rotation.x = -st.a * 1.6; }); });
      }
    };
  }

  /** Dashboard cluster panel for symptoms / shudder. */
  function cluster(K, draw, st) {
    var g = new THREE.Group();
    g.add(K.mesh(K.G.rbox(0.62, 0.26, 0.05, 0.03), 'plasticBlack'));
    var p = K.FX.canvasPanel(0.58, 0.22, draw, { state: st, px: 1024 }); p.position.z = 0.027; g.add(p);
    g.userData.panel = p;
    return g;
  }
  function gauge(x, cx, cy, r, v, max, label, col) {
    x.strokeStyle = '#2a3442'; x.lineWidth = r * 0.12; x.beginPath(); x.arc(cx, cy, r, PI * 0.75, PI * 2.25); x.stroke();
    x.strokeStyle = col || '#f5a524'; x.beginPath(); x.arc(cx, cy, r, PI * 0.75, PI * 0.75 + PI * 1.5 * Math.min(1, v / max)); x.stroke();
    var a = PI * 0.75 + PI * 1.5 * Math.min(1, v / max);
    x.strokeStyle = '#ffffff'; x.lineWidth = r * 0.05; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * r * 0.85, cy + Math.sin(a) * r * 0.85); x.stroke();
    x.fillStyle = '#9aa5b8'; x.font = Math.round(r * 0.25) + 'px system-ui'; x.textAlign = 'center'; x.fillText(label, cx, cy + r * 0.55);
  }

  var CAM = { pos: [0.75, 0.95, 1.15], target: [0, 0.42, 0], fov: 34 };

  /* --------------------------------------------------------------- overview */
  R('gearbox-7g.overview', {
    duration: 10, camera: CAM, shadow: 1, thumbT: 5,
    build: function (ctx, K) {
      var tr = trans(K); var root = new THREE.Group(); root.add(tr.root);
      var gC = K.FX.glow(tr.conv, 0xf5a524), gS = K.FX.glow(tr.sets[1].g, 0xf5a524), gP = K.FX.glow(tr.packs[1], 0xf5a524), gV = K.FX.glow(tr.vb.children[0], 0xf5a524), gK = K.FX.glow(tr.plate, 0xf5a524);
      var last = 0;
      return {
        root: root,
        update: function (t) { var dt = t < last ? 0.016 : t - last; last = t; tr.spin(dt, 6); var ph = Math.floor(t / 2); gC(ph === 0 ? 1 : 0); gS(ph === 1 ? 1 : 0); gP(ph === 2 ? 1 : 0); gV(ph === 3 ? 1 : 0); gK(ph === 4 ? 1 : 0); },
        labels: [
          { text: V('měnič s blokovací spojkou', 'torque converter with lock-up'), at: function () { return tr.conv.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.22, 0)); }, show: [0, 2], level: 'accent' },
          { text: V('planetová soukolí', 'planetary gear sets'), at: function () { return tr.sets[1].g.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.15, 0)); }, show: [2, 4], level: 'accent' },
          { text: V('lamelové spojky / brzdy', 'multi-plate clutches / brakes'), at: function () { return tr.packs[1].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.15, 0)); }, show: [4, 6], level: 'accent' },
          { text: V('ventilový blok se solenoidy', 'valve body with solenoids'), at: function () { return tr.vb.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -0.02, 0.15)); }, show: [6, 8], level: 'accent' },
          { text: V('vodicí deska (řídicí jednotka + snímače)', 'conductor plate (control unit + sensors)'), at: function () { return tr.plate.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -0.03, 0.14)); }, show: [8, 10], level: 'accent' }
        ],
        captions: [{ text: V('7G-Tronic 722.9 – řez', '7G-Tronic 722.9 – cut-away') }]
      };
    }
  });

  /* --------------------------------------------------------------- symptoms */
  R('gearbox-7g.symptoms', {
    duration: 12, camera: { pos: [0, 0.62, 0.9], target: [0, 0.5, 0], fov: 34 }, shadow: 0.8, thumbT: 5,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var cl = cluster(K, function (x, W, H, s) {
        s = s || {};
        x.fillStyle = '#0b0f14'; x.fillRect(0, 0, W, H);
        gauge(x, W * 0.2, H * 0.5, H * 0.36, s.rpm || 0, 7, 'rpm ×1000', s.slip ? '#e5484d' : '#f5a524');
        gauge(x, W * 0.8, H * 0.5, H * 0.36, s.kmh || 0, 220, 'km/h', '#3e8ed0');
        x.fillStyle = s.limp ? '#e5484d' : '#ffffff'; x.font = 'bold ' + Math.round(H * 0.3) + 'px system-ui'; x.textAlign = 'center';
        x.fillText('D ' + (s.gear || 1), W / 2, H * 0.45);
        if (s.msg) { x.font = 'bold ' + Math.round(H * 0.085) + 'px system-ui'; x.fillStyle = s.limp ? '#e5484d' : '#f5a524'; x.fillText(s.msg, W / 2, H * 0.78); }
      }, {});
      cl.position.y = 0.5; root.add(cl);
      return {
        root: root,
        update: function (t) {
          var s = {};
          if (t < 4) { var g = t < 2 ? 3 : 2; s = { gear: g, rpm: t < 2 ? 1.6 : 2.6, kmh: 30 - t * 4, msg: t > 1.8 && t < 2.6 ? S.t(V('ŠKUB! tvrdé podřazení', 'JOLT! harsh downshift')) : '' }; cl.position.x = t > 1.9 && t < 2.2 ? Math.sin(t * 90) * 0.01 : 0; }
          else if (t < 8) { s = { gear: 2, rpm: 3.8, kmh: 75, limp: true, msg: S.t(V('Nouzový režim – převodovka ve 2.', 'Limp mode – gearbox in 2nd')) }; cl.position.x = 0; }
          else { var k = K.T.seg(t, 8.5, 10.5); s = { gear: 4, rpm: 2.2 + k * 2.6, kmh: 90, slip: true, msg: k > 0.3 ? S.t(V('Otáčky rostou, vůz nezrychluje = prokluz', 'Revs rise, no acceleration = slipping')) : '' }; }
          s.rpm = Math.round(s.rpm * 10) / 10; s.kmh = Math.round(s.kmh);
          cl.userData.panel.userData.redraw(s);
        },
        captions: [
          { text: V('Tvrdé / škubavé řazení', 'Harsh / jerky shifts'), show: [0, 4] },
          { text: V('Nouzový režim: zůstane ve 2. nebo 3. převodu', 'Limp mode: stuck in 2nd or 3rd'), show: [4, 8], level: 'info' },
          { text: V('Prokluz = nejezdit!', 'Slipping = do not drive!'), show: [8, 12], level: 'danger' }
        ]
      };
    }
  });

  function scanScene(id, lines, title, caps, dur) {
    R(id, {
      duration: dur || 8, camera: { pos: [0.05, 0.62, 0.55], target: [0, 0.5, 0], fov: 34 }, shadow: 0.6, thumbT: (dur || 8) * 0.7,
      build: function (ctx, K) {
        var root = new THREE.Group();
        var bench = K.mesh(K.G.rbox(0.8, 0.04, 0.5, 0.01), 'wood'); bench.position.y = 0.3; root.add(bench);
        var dev = S.f3.scanTool(K, function (c, W, H, st) {
          st = st || { n: 0, p: 0 };
          S.f3.screenBase(c, W, H, title);
          c.textAlign = 'left'; c.textBaseline = 'middle';
          lines.forEach(function (l, i) {
            if (i >= st.n) return;
            var y = H * (0.27 + i * 0.11);
            c.fillStyle = l.c || '#e9edf3'; c.font = (l.b ? 'bold ' : '') + Math.round(H * 0.048) + 'px system-ui, Arial';
            c.fillText(S.t(l.t), W * 0.06, y);
          });
          if (st.p > 0) {
            c.fillStyle = '#2a3442'; c.fillRect(W * 0.08, H * 0.86, W * 0.84, H * 0.04);
            c.fillStyle = '#30a46c'; c.fillRect(W * 0.08, H * 0.86, W * 0.84 * st.p, H * 0.04);
          }
        }, { n: 0, p: 0 });
        dev.position.set(0, 0.5, 0); dev.rotation.x = -0.35; root.add(dev);
        return {
          root: root,
          update: function (t) {
            var n = Math.min(lines.length, Math.floor(t / 0.9) + 1);
            var p = lines.progress ? Math.round(K.T.seg(t, lines.progress[0], lines.progress[1]) * 20) / 20 : 0;
            dev.userData.screen.userData.redraw({ n: n, p: p });
          },
          captions: caps
        };
      }
    });
  }

  scanScene('gearbox-7g.codes', [
    { t: V('Řídicí jednotka převodovky (VGS)', 'Transmission control unit (VGS)'), b: true },
    { t: V('Y3/8n1 – snímač otáček turbíny', 'Y3/8n1 – turbine speed sensor'), c: '#f5a524' },
    { t: V('Y3/8n2 – snímač otáček vnitřní', 'Y3/8n2 – internal speed sensor'), c: '#f5a524' },
    { t: V('Napájení snímačů – zkrat / přerušení', 'Sensor supply – short / open'), c: '#e5484d' },
    { t: V('→ podezření: vodicí deska (ověřit)', '→ suspect: conductor plate (verify)'), c: '#e5484d', b: true },
    { t: V('Zapsat / vyfotit PŘED smazáním', 'Note / photograph BEFORE clearing'), c: '#30a46c' }
  ], 'XENTRY', [
    { text: V('Přečtěte paměť závad převodovky (VGS / TCU)', 'Read the gearbox fault memory (VGS / TCU)') },
    { text: V('Kódy a označení snímačů ověřte v XENTRY pro váš VIN', 'Verify codes and sensor names in XENTRY for your VIN'), level: 'info', show: [4, 8] }
  ]);

  var adaptLines = [
    { t: V('Převodovka 722.9 – adaptace', 'Transmission 722.9 – adaptation'), b: true },
    { t: V('Teplota ATF: 62 °C ✔', 'ATF temperature: 62 °C ✔') },
    { t: V('Reset adaptačních hodnot…', 'Resetting adaptation values…') },
    { t: V('Hotovo ✔ – proveďte učicí jízdu', 'Done ✔ – do a learning drive'), c: '#30a46c', b: true },
    { t: V('Jemné rozjezdy přes všechny převody', 'Gentle pull-aways through all gears') },
    { t: V('Zastavení, couvání, opakovat', 'Stop, reverse, repeat') }
  ];
  adaptLines.progress = [2.4, 4.4];
  scanScene('gearbox-7g.adapt', adaptLines, 'XENTRY', [
    { text: V('Reset adaptací + učicí jízda', 'Adaptation reset + learning drive') },
    { text: V('Bez učicí jízdy může řazení dočasně zhoršit', 'Without a learning drive shifting can temporarily get worse'), level: 'info', show: [4, 8] }
  ]);

  /* --------------------------------------------------------------- ATF level */
  R('gearbox-7g.atflevel', {
    duration: 10, camera: { pos: [0.95, 0.85, 0.95], target: [0.15, 0.55, 0.1], fov: 34 }, shadow: 1, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var tr = trans(K, { opaque: true }); root.add(tr.root);
      var dip = new THREE.Group(); root.add(dip);
      dip.add(K.mesh(K.G.cyl(0.003, 0.7, 8), 'steel')); dip.children[0].position.y = -0.35;
      var handle = K.mesh(K.G.torus(0.02, 0.004, PI * 2, 20), 'toolRed'); dip.add(handle);
      var mark = K.mesh(K.G.cyl(0.0045, 0.04, 8), 'oil'); mark.position.y = -0.62; dip.add(mark);
      var dev = S.f3.scanTool(K, function (c, W, H, st) {
        S.f3.screenBase(c, W, H, 'XENTRY');
        c.textAlign = 'center'; c.fillStyle = '#9aa5b8'; c.font = Math.round(H * 0.06) + 'px system-ui'; c.fillText(S.t(V('Teplota ATF', 'ATF temperature')), W / 2, H * 0.32);
        var v = st ? st.v : 40, ok = v >= 78 && v <= 82;
        c.fillStyle = ok ? '#30a46c' : '#f5a524'; c.font = 'bold ' + Math.round(H * 0.16) + 'px system-ui'; c.fillText(v + ' °C', W / 2, H * 0.55);
        c.font = 'bold ' + Math.round(H * 0.055) + 'px system-ui'; c.fillText(ok ? S.t(V('MĚŘIT TEĎ', 'MEASURE NOW')) : S.t(V('ohřívá se…', 'warming up…')), W / 2, H * 0.78);
      }, { v: 40 });
      dev.position.set(-0.55, 0.75, 0.25); dev.rotation.y = 0.5; root.add(dev);
      return {
        root: root,
        update: function (t) {
          var temp = Math.round(40 + T.seg(t, 0.5, 4.5) * 40);
          dev.userData.screen.userData.redraw({ v: temp });
          tr.tubeCap.visible = t < 4.8;
          var ins = T.seg(t, 5, 6.4) - T.seg(t, 7.6, 8.6);
          dip.position.set(0.26, 0.83 + 0.35 * (1 - ins) + 0.0, 0.18);
          dip.visible = t > 4.8;
          mark.visible = t > 8;
        },
        labels: [
          { text: V('vůz vodorovně, motor běží, P', 'car level, engine running, P'), at: [0, 1.0, 0], show: [0, 4.8] },
          { text: V('speciální měrka – hodnota dle tabulky pro 80 °C', 'special dipstick – reading per the 80 °C table'), at: function () { return dip.position.clone().add(new THREE.Vector3(0, -0.1, 0.05)); }, show: [5, 10], level: 'accent' }
        ],
        captions: [
          { text: V('Teplotu ATF čtěte v XENTRY – měřit při cca 80 °C (ověřit)', 'Read the ATF temperature in XENTRY – measure at approx. 80 °C (verify)') },
          { text: V('Pod vozem s běžícím motorem: ruce mimo hřídel a výfuk!', 'Under the car with the engine running: hands clear of shaft and exhaust!'), level: 'danger', show: [3, 10] }
        ]
      };
    }
  });

  /* --------------------------------------------------------------- ATF colour */
  R('gearbox-7g.atfcolor', {
    duration: 8, camera: { pos: [0, 0.75, 0.45], target: [0, 0.4, 0], fov: 34 }, shadow: 0.6, thumbT: 6,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var bench = K.mesh(K.G.rbox(0.8, 0.04, 0.5, 0.01), 'wood'); bench.position.y = 0.36; root.add(bench);
      var paper = K.mesh(K.G.box(0.42, 0.002, 0.3), 'plasticWhite'); paper.position.y = 0.382; root.add(paper);
      var drops = [[0xc0242c, V('čirá červená – OK', 'clear red – OK'), 'ok'], [0x4a2a15, V('tmavá + spálená – opotřebení', 'dark + burnt – wear'), null], [0xe8b4c0, V('mléčná – voda / chladicí kap.!', 'milky – water / coolant!'), 'danger']];
      var meshes = drops.map(function (d, i) {
        var m = K.mesh(K.G.cyl(0.04, 0.003, 32), K.M.clone('oil', { color: d[0], opacity: i === 2 ? 0.95 : 0.8, roughness: i === 2 ? 0.5 : 0.05 }));
        m.position.set(-0.13 + i * 0.13, 0.385, 0); m.scale.set(1, 1, 0.8); root.add(m); return m;
      });
      return {
        root: root,
        update: function (t) { meshes.forEach(function (m, i) { var k = K.T.seg(t, 0.4 + i * 1.6, 1.2 + i * 1.6); m.visible = k > 0.01; m.scale.set(0.3 + k * 0.7, 1, (0.3 + k * 0.7) * 0.8); }); },
        labels: drops.map(function (d, i) { return { text: d[1], at: [-0.13 + i * 0.13, 0.43, 0.02], show: [1.2 + i * 1.6, 8], level: d[2] }; }),
        captions: [
          { text: V('Kapka ATF na bílý papír', 'A drop of ATF on white paper') },
          { text: V('Mléčná ATF = nejezdit, ihned do servisu', 'Milky ATF = do not drive, workshop immediately'), level: 'danger', show: [4.6, 8] }
        ]
      };
    }
  });

  /* --------------------------------------------------------------------- pan */
  R('gearbox-7g.pan', {
    duration: 10, camera: { pos: [0.85, 0.35, 0.95], target: [0, 0.25, 0], fov: 36 }, shadow: 1, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var tr = trans(K, { opaque: true }); root.add(tr.root);
      var drops = K.FX.drops(K.M.clone('oil', { color: 0xa8202a }), 8, 0.12, 0.006); drops.group.position.set(0, 0.17, 0); root.add(drops.group);
      var oldF = tr.filter, newF = oldF.clone(); newF.material = K.M.clone('plasticBlack', { color: 0x30343a }); tr.pan.add(newF);
      return {
        root: root,
        update: function (t) {
          var down = T.seg(t, 0.6, 2.4) - T.seg(t, 7.6, 9);
          tr.pan.position.y = -0.31 - down * 0.18;
          drops.update(t, t > 1.2 && t < 3.6, 1.6);
          oldF.visible = t < 4.4; oldF.position.x = T.seg(t, 3.4, 4.4) * 0.5;
          newF.visible = t > 4.6; newF.position.x = -0.5 * (1 - T.seg(t, 4.6, 5.8)); newF.position.y = 0.06;
        },
        labels: [
          { text: V('nový filtr + těsnění vany', 'new filter + pan gasket'), at: function () { return tr.pan.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.12, 0.15)); }, show: [5, 9], level: 'ok' }
        ],
        captions: [
          { text: V('Výměna ATF a filtru – postup v návodu Oleje převodovky', 'ATF & filter change – procedure in the Drivetrain oils tutorial') },
          { text: V('Horká ATF pálí – rukavice, brýle', 'Hot ATF burns – gloves, glasses'), level: 'danger', show: [1, 4] },
          { text: V('Doplnit a zkontrolovat při 80 °C', 'Refill and check at 80 °C'), level: 'info', show: [6, 10] }
        ]
      };
    }
  });

  /* ---------------------------------------------------------------- shudder */
  R('gearbox-7g.shudder', {
    duration: 9, camera: { pos: [-5.2, 1.9, 4.4], target: [0, 0.6, 0], fov: 34 }, shadow: 4, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var road = K.mesh(K.G.box(40, 0.004, 5), 'plasticTex'); road.position.y = 0.002; root.add(road);
      var marks = [];
      for (var i = 0; i < 12; i++) { var m = K.mesh(K.G.box(1.2, 0.006, 0.12), 'plasticWhite'); m.position.set(-12 + i * 3, 0.005, -1.1); root.add(m); marks.push(m); }
      var c = K.car(ctx.vehicle); root.add(c.group);
      var panel = K.FX.canvasPanel(1.4, 0.45, function (x, W, H, s) {
        s = s || { v: 50 };
        x.fillStyle = 'rgba(11,15,20,0.9)'; x.fillRect(0, 0, W, H);
        x.fillStyle = s.sh ? '#e5484d' : '#ffffff'; x.font = 'bold ' + Math.round(H * 0.42) + 'px system-ui'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText(s.v + ' km/h', W / 2, H * 0.42);
        x.font = 'bold ' + Math.round(H * 0.16) + 'px system-ui'; x.fillStyle = s.sh ? '#e5484d' : '#9aa5b8';
        x.fillText(s.sh ? S.t(V('chvění – blokace měniče', 'shudder – converter lock-up')) : S.t(V('lehký plyn', 'light throttle')), W / 2, H * 0.82);
      }, { state: { v: 50 }, px: 512 });
      panel.position.set(0, c.dims.H + 0.7, 0); root.add(panel);
      return {
        root: root,
        update: function (t) {
          var v = Math.round(50 + T.seg(t, 0, 8) * 60);
          var sh = v >= 60 && v <= 100;
          panel.userData.redraw({ v: Math.round(v / 2) * 2, sh: sh });
          c.body.position.y = sh ? Math.sin(t * 60) * 0.008 : 0;
          c.wheels.forEach(function (w) { w.wheel.rotation.z = -t * v * 0.15; });
          marks.forEach(function (m, i) { m.position.x = ((-12 + i * 3 - t * v * 0.12) % 36 + 36) % 36 - 18; });
        },
        captions: [
          { text: V('Chvění kolem 60–100 km/h při lehkém plynu', 'Shudder around 60–100 km/h on light throttle') },
          { text: V('Často pomůže čerstvá ATF + adaptace', 'Fresh ATF + adaptation often helps'), level: 'info', show: [4, 9] }
        ]
      };
    }
  });

  /* -------------------------------------------------------------- conductor */
  R('gearbox-7g.conductor', {
    duration: 12, camera: { pos: [0.85, 0.42, 1.0], target: [0, 0.2, 0], fov: 36 }, shadow: 1, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var tr = trans(K, { opaque: true }); root.add(tr.root);
      var newPlate = tr.plate.clone(true); newPlate.traverse(function (o) { if (o.isMesh && o.material && o.material.color && o.geometry.parameters && o.geometry.parameters.width === 0.36) { o.material = K.M.clone('epoxy', { color: 0x2c8a4c }); } });
      tr.vb.add(newPlate);
      var fOld = K.FX.fader(tr.plate), fNew = K.FX.fader(newPlate);
      var gS = K.FX.glow(tr.sensors[0], 0xe5484d);
      var dev = S.f3.scanTool(K, function (c, W, H, st) {
        S.f3.screenBase(c, W, H, 'XENTRY');
        c.textAlign = 'center'; c.fillStyle = '#e9edf3'; c.font = 'bold ' + Math.round(H * 0.06) + 'px system-ui';
        c.fillText(S.t(V('Kódování VGS / SCN', 'VGS / SCN coding')), W / 2, H * 0.32);
        var p = st ? st.p : 0;
        c.fillStyle = '#2a3442'; c.fillRect(W * 0.1, H * 0.5, W * 0.8, H * 0.06);
        c.fillStyle = '#30a46c'; c.fillRect(W * 0.1, H * 0.5, W * 0.8 * p, H * 0.06);
        c.fillStyle = p >= 1 ? '#30a46c' : '#9aa5b8'; c.font = Math.round(H * 0.055) + 'px system-ui';
        c.fillText(p >= 1 ? S.t(V('Nakódováno ✔', 'Coded ✔')) : Math.round(p * 100) + ' %', W / 2, H * 0.72);
      }, { p: 0 });
      dev.position.set(-0.7, 0.55, 0.3); dev.rotation.y = 0.6; root.add(dev);
      return {
        root: root,
        update: function (t) {
          tr.pan.position.y = -0.31 - T.seg(t, 0.3, 1.5) * 0.25;
          tr.vb.position.y = -0.21 - T.seg(t, 1.8, 3.2) * 0.2;
          gS(t > 1.5 && t < 4.5 ? 0.8 : 0);
          fOld(1 - T.seg(t, 4.5, 5.3)); tr.plate.position.x = T.seg(t, 4.5, 5.3) * 0.4;
          fNew(T.seg(t, 5.6, 6.6)); newPlate.position.x = -0.4 * (1 - T.seg(t, 5.6, 6.6));
          dev.visible = t > 7;
          dev.userData.screen.userData.redraw({ p: Math.round(T.seg(t, 8, 11) * 20) / 20 });
        },
        labels: [
          { text: V('vadný snímač otáček na desce', 'failed speed sensor on the plate'), at: function () { return tr.sensors[0].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -0.04, 0.05)); }, show: [1.5, 4.5], level: 'danger' },
          { text: V('nová vodicí deska', 'new conductor plate'), at: function () { return newPlate.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -0.04, 0.12)); }, show: [6.4, 8], level: 'ok' }
        ],
        captions: [
          { text: V('Vypustit ATF, vana dolů, ventilový blok ven', 'Drain ATF, pan off, valve body out'), show: [0, 4.5] },
          { text: V('Elektronika je citlivá na statiku – uzemnit se', 'Electronics are static-sensitive – ground yourself'), level: 'info', show: [4.5, 7] },
          { text: V('Novou desku NUTNÉ nakódovat (XENTRY / SCN) – jinak nefunguje', 'The new plate MUST be coded (XENTRY / SCN) – otherwise it will not work'), level: 'danger', show: [7, 12] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------- next */
  R('gearbox-7g.next', {
    duration: 8, camera: { pos: [0, 0.55, 0.85], target: [0, 0.5, 0], fov: 34 }, shadow: 0.6, thumbT: 5,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var items = [V('Prokluz nebo spálená ATF', 'Slipping or burnt ATF'), V('Kovové částice / mléčná ATF', 'Metal particles / milky ATF'), V('Chyby i po ATF + adaptaci', 'Faults persist after ATF + adaptation'), V('Výměna vodicí desky s kódováním', 'Conductor plate replacement with coding')];
      var board = K.FX.canvasPanel(0.8, 0.46, function (x, W, H, st) {
        x.fillStyle = '#0f1b26'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#c9282d'; x.fillRect(0, 0, W, H * 0.16);
        x.fillStyle = '#fff'; x.font = 'bold ' + Math.round(H * 0.075) + 'px system-ui'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText(S.t(V('→ specialista na automatické převodovky', '→ automatic gearbox specialist')), W / 2, H * 0.08);
        x.textAlign = 'left';
        items.forEach(function (it, i) {
          if (i >= (st ? st.n : 0)) return;
          x.fillStyle = '#f5a524'; x.font = 'bold ' + Math.round(H * 0.07) + 'px system-ui'; x.fillText('⚠', W * 0.05, H * (0.3 + i * 0.17));
          x.fillStyle = '#e9edf3'; x.font = Math.round(H * 0.065) + 'px system-ui'; x.fillText(S.t(it), W * 0.13, H * (0.3 + i * 0.17));
        });
      }, { state: { n: 0 }, px: 1024 });
      board.position.y = 0.5; root.add(board);
      return {
        root: root,
        update: function (t) { board.userData.redraw({ n: Math.min(4, Math.floor(t / 1.2) + 1) }); },
        captions: [{ text: V('Repase u specialisty bývá levnější než nová převodovka', 'A rebuild by a specialist is often cheaper than a new gearbox') }]
      };
    }
  });
})(window.STU);
