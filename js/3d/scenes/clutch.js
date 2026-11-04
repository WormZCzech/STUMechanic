/* 3D scenes: clutch + dual-mass flywheel (and automatic-gearbox variant). Rotation axis = X (engine at -X, gearbox at +X). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var AXY = 0.42; // crank axis height

  function latheX(K, pts, seg) { var g = K.G.lathe(pts, seg || 48); g.rotateZ(-PI / 2); return g; }

  /* ------------------------------------------------------------------ parts */
  function flywheel(K, o) {
    o = o || {};
    var g = new THREE.Group(), r = 0.14;
    var prim = new THREE.Group(); g.add(prim);
    var ring = K.mesh(K.G.gear(120, r + 0.006, r - 0.002, 0.016, 0), 'steelDark'); ring.rotation.y = PI / 2; prim.add(ring);
    var body = K.mesh(latheX(K, [[0.03, -0.012], [r - 0.002, -0.012], [r - 0.002, 0.012], [0.03, 0.012]], 64), 'castIron'); prim.add(body);
    var sec = new THREE.Group(); g.add(sec);
    var face = K.mesh(latheX(K, [[0.06, 0.012], [r - 0.012, 0.012], [r - 0.012, 0.03], [0.06, 0.03]], 64), o.blue ? K.M.clone('discFace', { color: 0x9aa6c4 }) : 'discFace');
    sec.add(face);
    var hub = K.mesh(latheX(K, [[0.02, 0.0], [0.058, 0.0], [0.058, 0.032], [0.02, 0.032]], 40), 'steel'); sec.add(hub);
    var bolts = [];
    for (var i = 0; i < 8; i++) {
      var a = i / 8 * PI * 2 + PI / 8;
      var b = K.mesh(K.G.hex(0.0075, 0.01), o.newBolts ? 'zinc' : 'blackOxide'); b.rotation.z = PI / 2;
      b.position.set(0.037, Math.sin(a) * 0.04, Math.cos(a) * 0.04); sec.add(b); bolts.push(b);
    }
    for (var j = 0; j < 6; j++) {
      var a2 = j / 6 * PI * 2;
      var h = K.mesh(K.G.cylX(0.006, 0.004, 12), 'blackOxide'); h.position.set(0.0305, Math.sin(a2) * (r - 0.02), Math.cos(a2) * (r - 0.02)); sec.add(h);
    }
    g.userData = { prim: prim, sec: sec, bolts: bolts, face: face };
    return g;
  }
  function clutchDisc(K) {
    var g = new THREE.Group(), r = 0.115;
    var carrier = K.mesh(latheX(K, [[0.045, -0.0015], [r - 0.004, -0.0015], [r - 0.004, 0.0015], [0.045, 0.0015]], 64), 'steel'); g.add(carrier);
    [-1, 1].forEach(function (s) { var f = K.mesh(latheX(K, [[0.072, 0], [r, 0], [r, 0.0035], [0.072, 0.0035]], 64), 'padFriction'); f.position.x = s > 0 ? 0.0015 : -0.005; g.add(f); });
    for (var i = 0; i < 18; i++) { var gr = K.mesh(K.G.box(0.0075, 0.04, 0.0025), 'castIron'); var a = i / 18 * PI * 2; gr.position.set(0.0055, Math.sin(a) * 0.094, Math.cos(a) * 0.094); gr.rotation.x = -a; g.add(gr); }
    var hubPlate = K.mesh(latheX(K, [[0.016, -0.006], [0.06, -0.006], [0.06, 0.006], [0.016, 0.006]], 48), 'steelDark'); g.add(hubPlate);
    for (var k = 0; k < 6; k++) { var a3 = k / 6 * PI * 2; var sp = K.mesh(K.G.cyl(0.0085, 0.032, 12), 'toolYellow'); sp.material = K.M.steel; sp.position.set(0, Math.sin(a3) * 0.045, Math.cos(a3) * 0.045); sp.rotation.x = -a3 + PI / 2; g.add(sp); }
    var spline = K.mesh(K.G.gear(20, 0.022, 0.019, 0.04, 0.012), 'steel'); spline.rotation.y = PI / 2; g.add(spline);
    return g;
  }
  function pressurePlate(K) {
    var g = new THREE.Group(), r = 0.125;
    var cover = K.mesh(latheX(K, [[0.07, 0.04], [0.1, 0.04], [r, 0.02], [r, 0.0], [r + 0.012, 0.0], [r + 0.012, 0.004], [r + 0.003, 0.004], [r + 0.003, 0.022], [0.1, 0.044], [0.07, 0.044]], 64), K.M.clone('steel', { side: THREE.DoubleSide, roughness: 0.45 }));
    g.add(cover);
    var plate = K.mesh(latheX(K, [[0.075, 0.0], [r - 0.006, 0.0], [r - 0.006, 0.012], [0.075, 0.012]], 64), 'castIron'); plate.position.x = -0.0; g.add(plate);
    var fingers = new THREE.Group(); g.add(fingers);
    for (var i = 0; i < 18; i++) {
      var a = i / 18 * PI * 2;
      var f = K.mesh(K.G.extrude([[0.024, -0.006], [0.085, -0.011], [0.085, 0.011], [0.024, 0.006]], 0.0025, 0), 'steel');
      f.rotation.y = PI / 2; f.rotation.x = 0;
      var hold = new THREE.Group(); hold.add(f); hold.rotation.x = a; hold.position.x = 0.036; fingers.add(hold);
    }
    var bolts = [];
    for (var j = 0; j < 6; j++) {
      var b = j / 6 * PI * 2 + PI / 6;
      var bolt = K.mesh(K.G.hex(0.007, 0.008), 'zinc'); bolt.rotation.z = PI / 2;
      bolt.position.set(0.009, Math.sin(b) * (r + 0.006), Math.cos(b) * (r + 0.006)); g.add(bolt); bolts.push(bolt);
    }
    g.userData = { fingers: fingers, bolts: bolts };
    return g;
  }
  function releaseBearing(K) {
    var g = new THREE.Group();
    var csc = K.mesh(latheX(K, [[0.024, -0.04], [0.045, -0.04], [0.045, 0.0], [0.024, 0.0]], 40), 'aluCast'); g.add(csc);
    var brg = K.mesh(latheX(K, [[0.026, 0.0], [0.038, 0.0], [0.038, 0.012], [0.026, 0.012]], 40), 'steel'); g.add(brg);
    var pipe = K.mesh(K.G.tube([[-0.03, 0.04, 0.0], [-0.03, 0.08, 0.02], [0.02, 0.14, 0.05]], 0.004), 'steelDark'); g.add(pipe);
    var nip = K.mesh(K.G.cyl(0.003, 0.016, 10), 'zinc'); nip.position.set(-0.025, 0.05, -0.03); g.add(nip);
    return g;
  }
  function gearbox(K) {
    var g = new THREE.Group();
    var bell = K.mesh(latheX(K, [[0.035, 0.24], [0.17, 0.2], [0.2, 0.08], [0.2, 0.0], [0.212, 0.0], [0.212, 0.012], [0.21, 0.09], [0.18, 0.21], [0.035, 0.25]], 48), K.M.clone('aluCast', { side: THREE.DoubleSide }));
    g.add(bell);
    var case1 = K.mesh(K.G.rbox(0.36, 0.26, 0.26, 0.04), 'aluCast'); case1.position.set(0.4, -0.04, 0.02); g.add(case1);
    var diffH = K.mesh(K.G.cylZ(0.11, 0.2, 32), 'aluCast'); diffH.position.set(0.22, -0.16, 0.08); g.add(diffH);
    for (var i = 0; i < 10; i++) { var a = i / 10 * PI * 2; var b = K.mesh(K.G.hex(0.007, 0.01), 'zinc'); b.rotation.z = PI / 2; b.position.set(0.004, Math.sin(a) * 0.205, Math.cos(a) * 0.205); g.add(b); }
    var shaft = K.mesh(K.G.cylX(0.012, 0.17, 16), 'steel'); shaft.position.x = 0.07; g.add(shaft);
    var spl = K.mesh(K.G.gear(20, 0.0135, 0.011, 0.06, 0), 'steel'); spl.rotation.y = PI / 2; spl.position.x = 0.02; g.add(spl);
    var shift = K.mesh(K.G.cyl(0.012, 0.12, 12), 'steelDark'); shift.position.set(0.45, 0.14, 0.05); g.add(shift);
    return g;
  }
  function engineBlock(K) {
    var g = new THREE.Group();
    var block = K.mesh(K.G.rbox(0.5, 0.42, 0.38, 0.03), 'castIron'); block.position.set(-0.27, 0.02, 0); g.add(block);
    var head = K.mesh(K.G.rbox(0.48, 0.13, 0.36, 0.02), 'aluCast'); head.position.set(-0.27, 0.29, 0); g.add(head);
    var cover = K.mesh(K.G.rbox(0.46, 0.07, 0.3, 0.03), 'plasticBlack'); cover.position.set(-0.27, 0.39, 0); g.add(cover);
    var sump = K.mesh(K.G.rbox(0.44, 0.12, 0.3, 0.02), 'aluCast'); sump.position.set(-0.27, -0.24, 0); g.add(sump);
    var flange = K.mesh(K.G.cylX(0.04, 0.02, 32), 'steel'); flange.position.x = -0.01; g.add(flange);
    var seal = K.mesh(K.G.torus(0.05, 0.006, PI * 2, 32), 'rubber'); seal.rotation.y = PI / 2; seal.position.x = -0.018; g.add(seal);
    g.userData.seal = seal;
    return g;
  }
  function gearboxJack(K) {
    var g = new THREE.Group();
    var base = K.mesh(K.G.rbox(0.5, 0.06, 0.5, 0.02), 'jackRed'); base.position.y = 0.05; g.add(base);
    [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]].forEach(function (p) { var w = K.mesh(K.G.cylZ(0.025, 0.02, 16), 'rubber'); w.position.set(p[0], 0.025, p[1]); g.add(w); });
    var tube = K.mesh(K.G.cyl(0.045, 0.3, 24), 'jackRed'); tube.position.y = 0.23; g.add(tube);
    var ram = new THREE.Group(); g.add(ram);
    var post = K.mesh(K.G.cyl(0.03, 0.3, 24), 'chrome'); post.position.y = 0.15; ram.add(post);
    var cradle = K.mesh(K.G.rbox(0.36, 0.025, 0.28, 0.008), 'jackRed'); cradle.position.y = 0.31; ram.add(cradle);
    [-1, 1].forEach(function (s) { var arm = K.mesh(K.G.box(0.025, 0.08, 0.25), 'jackRed'); arm.position.set(s * 0.17, 0.35, 0); ram.add(arm); });
    var chain = K.mesh(K.G.tube([[-0.17, 0.39, -0.12], [0, 0.5, -0.14], [0.17, 0.39, -0.12]], 0.005), 'steel'); ram.add(chain);
    g.userData.ram = ram;
    return g;
  }

  function assembly(K, opts) {
    opts = opts || {};
    var root = new THREE.Group(), axis = new THREE.Group(); axis.position.y = AXY; root.add(axis);
    var eng = engineBlock(K); axis.add(eng);
    var fw = flywheel(K, opts); axis.add(fw);
    var disc = clutchDisc(K); disc.position.x = 0.045; axis.add(disc);
    var pp = pressurePlate(K); pp.position.x = 0.05; axis.add(pp);
    var rb = releaseBearing(K); rb.position.x = 0.15; axis.add(rb);
    var gb = gearbox(K); gb.position.x = 0.13; axis.add(gb);
    return { root: root, axis: axis, eng: eng, fw: fw, disc: disc, pp: pp, rb: rb, gb: gb };
  }

  var CAM_SIDE = { pos: [0.3, 0.8, 1.35], target: [0.05, 0.42, 0], fov: 36 };

  /* ------------------------------------------------------------------ layout (exploded) */
  R('clutch.layout', {
    duration: 9, camera: { pos: [0.45, 0.8, 1.85], target: [0.25, 0.42, 0], fov: 38 }, shadow: 1.5, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, A = assembly(K);
      var gbf = K.FX.fader(A.gb);
      var parts = [[A.fw, 0, 0.0], [A.disc, 0.045, 0.14], [A.pp, 0.05, 0.27], [A.rb, 0.15, 0.42], [A.gb, 0.13, 0.62]];
      return {
        root: A.root,
        update: function (t) {
          var k = T.seg(t, 0.6, 2.6) * (1 - T.seg(t, 7.4, 8.8));
          parts.forEach(function (p) { p[0].position.x = p[1] + p[2] * k; });
          A.axis.rotation.y = Math.sin(t * 0.7) * 0.15;
          gbf(1 - 0.75 * k);
        },
        labels: [
          { text: V('Motor', 'Engine'), at: [-0.27, AXY + 0.48, 0] },
          { text: V('Setrvačník (DMF)', 'Flywheel (DMF)'), at: function () { return A.fw.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.17, 0)); }, show: [2.4, 7.4] },
          { text: V('Lamela', 'Clutch disc'), at: function () { return A.disc.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.14, 0)); }, show: [2.4, 7.4] },
          { text: V('Přítlačný talíř', 'Pressure plate'), at: function () { return A.pp.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.16, 0)); }, show: [2.4, 7.4] },
          { text: V('Vypínací ložisko', 'Release bearing'), at: function () { return A.rb.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -0.07, 0)); }, show: [2.4, 7.4] },
          { text: V('Převodovka', 'Gearbox'), at: function () { return A.gb.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.35, 0.18, 0)); }, show: [2.4, 7.4] }
        ],
        captions: [{ text: V('Rozložená spojka: motor, setrvačník, lamela, přítlačný talíř, ložisko, převodovka', 'Exploded clutch: engine, flywheel, disc, pressure plate, bearing, gearbox') }]
      };
    }
  });

  /* ------------------------------------------------------------------ symptoms (instrument cluster) */
  R('clutch.symptoms', {
    duration: 8, camera: { pos: [0, 0.42, 0.62], target: [0, 0.35, 0], fov: 34 }, ground: false, shadow: 0.6, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var hood = K.mesh(K.G.rbox(0.6, 0.26, 0.12, 0.05), 'plasticTex'); hood.position.set(0, 0.36, -0.06); root.add(hood);
      var rpmT = S.t(V('otáčky ×1000', 'rpm ×1000')), kmh = 'km/h';
      function gauge(c, x, y, rad, val, max, label, red) {
        c.strokeStyle = '#3a4250'; c.lineWidth = rad * 0.08; c.beginPath(); c.arc(x, y, rad, PI * 0.75, PI * 2.25); c.stroke();
        if (red) { c.strokeStyle = '#c9282d'; c.beginPath(); c.arc(x, y, rad, PI * 1.95, PI * 2.25); c.stroke(); }
        c.fillStyle = '#e9edf3'; c.font = 'bold ' + Math.round(rad * 0.16) + 'px system-ui, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
        for (var i = 0; i <= 8; i++) { var a = PI * 0.75 + i / 8 * PI * 1.5; c.fillText(String(Math.round(i / 8 * max)), x + Math.cos(a) * rad * 0.78, y + Math.sin(a) * rad * 0.78); }
        var a2 = PI * 0.75 + Math.min(1, val / max) * PI * 1.5;
        c.strokeStyle = '#f5a524'; c.lineWidth = rad * 0.05; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a2) * rad * 0.9, y + Math.sin(a2) * rad * 0.9); c.stroke();
        c.fillStyle = '#9aa5b8'; c.font = Math.round(rad * 0.13) + 'px system-ui, Arial'; c.fillText(label, x, y + rad * 0.45);
      }
      var panel = K.FX.canvasPanel(0.52, 0.2, function (c, W, H, st) {
        st = st || { r: 2, v: 60 };
        c.fillStyle = '#0b0e13'; c.fillRect(0, 0, W, H);
        gauge(c, W * 0.27, H * 0.55, H * 0.4, st.r, 8, rpmT, true);
        gauge(c, W * 0.73, H * 0.55, H * 0.4, st.v, 240, kmh, false);
      }, { px: 768 });
      panel.position.set(0, 0.36, 0.002); root.add(panel);
      return {
        root: root,
        update: function (t) {
          var r = 2 + T.seg(t, 1, 3.5) * 3.8 - T.seg(t, 6.5, 7.8) * 3.8 + (t > 3.5 && t < 6.5 ? Math.sin(t * 9) * 0.1 : 0);
          var v = 60 + T.seg(t, 1, 3.5) * 6 - T.seg(t, 6.5, 7.8) * 6;
          panel.userData.redraw({ r: Math.round(r * 10) / 10, v: Math.round(v) });
        },
        captions: [
          { text: V('Otáčky rostou, auto nezrychluje = prokluz spojky', 'Revs rise, car does not accelerate = clutch slip'), show: [1, 8], level: 'danger' },
          { text: V('Další: cukání při rozjezdu, klepání na volnoběh (DMF)', 'Also: judder on take-off, knocking at idle (DMF)'), show: [3.5, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ DMF check */
  R('clutch.dmfCheck', {
    duration: 9, camera: { pos: [0.55, 0.55, 0.45], target: [0.02, 0.42, 0], fov: 36 }, shadow: 0.8, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, A = assembly(K);
      A.gb.visible = false; A.disc.visible = false; A.pp.visible = false; A.rb.visible = false;
      var hands = [K.P.glove(), K.P.glove()];
      hands.forEach(function (h, i) { h.scale.setScalar(0.9); h.rotation.y = PI / 2; h.position.set(0.075, 0, i ? -0.115 : 0.115); A.fw.userData.sec.add(h); });
      var arrow = K.FX.rotArrow(0.17, 'cw', 0xf5a524, 50, 0.005); arrow.rotation.y = PI / 2; arrow.position.x = 0.05; A.axis.add(arrow);
      return {
        root: A.root,
        update: function (t) {
          var rot = t < 4 ? Math.sin(t * 3) * 0.1 * T.seg(t, 0.3, 0.8) : 0;
          var tilt = t >= 4 && t < 7 ? Math.sin(t * 4) * 0.03 : 0;
          A.fw.userData.sec.rotation.x = rot;
          A.fw.userData.sec.rotation.z = tilt;
          arrow.visible = t < 4;
        },
        labels: [{ text: V('Limity vůle: tabulka výrobce DMF (LuK / Sachs)', 'Play limits: DMF maker table (LuK / Sachs)'), at: [0.05, AXY - 0.2, 0.1], show: [6.5, 9], level: 'accent' }],
        captions: [
          { text: V('1. Volné protočení (sekundární hmota proti primární)', '1. Free rotation (secondary vs. primary mass)'), show: [0, 4] },
          { text: V('2. Naklopení (axiální vůle)', '2. Rocking (axial play)'), show: [4, 7] },
          { text: V('3. Olej, modré skvrny, praskliny = vyměnit', '3. Oil, blue spots, cracks = replace'), show: [7, 9], level: 'danger' }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ ancillaries */
  R('clutch.ancillary', {
    duration: 9, camera: { pos: [0.9, 1.25, 1.45], target: [0.15, 0.45, 0], fov: 38 }, shadow: 1.4, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, A = assembly(K);
      var items = [];
      function add(obj, name) { A.root.add(obj); items.push({ obj: obj, f: K.FX.fader(obj), name: name }); }
      var bat = new THREE.Group(); var bb = K.mesh(K.G.rbox(0.27, 0.19, 0.17, 0.01), 'plasticBlack'); bat.add(bb);
      [-1, 1].forEach(function (s) { var tp = K.mesh(K.G.cyl(0.012, 0.02, 12), s > 0 ? 'hiDanger' : 'plasticGrey'); tp.position.set(s * 0.09, 0.1, 0.05); bat.add(tp); });
      bat.position.set(0.35, 0.95, 0.05); add(bat, V('Baterie + držák', 'Battery + tray'));
      var air = K.mesh(K.G.rbox(0.3, 0.12, 0.22, 0.03), 'plasticTex'); air.position.set(0.0, 0.98, 0.0); add(air, V('Vzduchový filtr / sání', 'Airbox / intake'));
      var cab = K.mesh(K.G.tube([[0.5, 0.62, 0.05], [0.6, 0.8, 0.2], [0.4, 1.0, 0.4]], 0.006), 'plasticBlack'); add(cab, V('Lanka řazení, konektory', 'Shift cables, connectors'));
      var st = new THREE.Group(); var sm = K.mesh(K.G.cylX(0.045, 0.16, 24), 'steelDark'); st.add(sm); var ss = K.mesh(K.G.cylX(0.03, 0.08, 20), 'steel'); ss.position.x = 0.11; st.add(ss);
      st.position.set(0.12, AXY - 0.2, 0.18); add(st, V('Startér', 'Starter motor'));
      var line = K.mesh(K.G.tube([[0.15, AXY + 0.14, 0.05], [0.3, AXY + 0.3, 0.1], [0.3, AXY + 0.55, 0.3]], 0.004), 'steel'); add(line, V('Vedení spojky (zaškrtit)', 'Clutch line (clamp it)'));
      var ds = new THREE.Group();
      [-1, 1].forEach(function (s) { var sh = K.mesh(K.G.cylZ(0.016, 0.6, 16), 'steelDark'); sh.position.set(0.35, AXY - 0.16, s * 0.42); ds.add(sh); var bt = K.mesh(K.G.lathe([[0.02, 0], [0.04, 0.02], [0.028, 0.04], [0.04, 0.06], [0.02, 0.09]], 20), 'rubber'); bt.rotation.x = s * PI / 2; bt.position.set(0.35, AXY - 0.16, s * 0.15); ds.add(bt); });
      add(ds, V('Poloosy', 'Driveshafts'));
      var labels = items.map(function (it, i) { return { text: it.name, at: function () { return it.obj.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.12, 0)); }, show: [0.2, 1.2 + i * 1.1] }; });
      return {
        root: A.root,
        update: function (t) {
          items.forEach(function (it, i) { var k = T.seg(t, 1.0 + i * 1.1, 1.6 + i * 1.1) * (1 - T.seg(t, 8.5, 9)); it.f(1 - k); it.obj.position.y += 0; });
        },
        labels: labels,
        captions: [{ text: V('Postupně demontovat – fotit, značit, šrouby do sáčků', 'Remove step by step – photograph, label, bag the bolts') }]
      };
    }
  });

  /* ------------------------------------------------------------------ support + gearbox jack */
  function supportBar(K) {
    var bar = new THREE.Group();
    var beam = K.mesh(K.G.box(0.08, 0.08, 1.6), 'toolYellow'); bar.add(beam);
    [-1, 1].forEach(function (s) { var foot = K.mesh(K.G.rbox(0.16, 0.06, 0.12, 0.01), 'rubber'); foot.position.set(0, -0.07, s * 0.72); bar.add(foot); });
    var spindle = K.mesh(K.G.cyl(0.012, 0.32, 16), 'chrome'); spindle.position.set(0, -0.2, 0); bar.add(spindle);
    return bar;
  }
  R('clutch.support', {
    duration: 7, camera: { pos: [1.3, 1.1, 1.7], target: [0.15, 0.45, 0], fov: 38 }, shadow: 1.6, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, A = assembly(K);
      var paint = K.M.carPaint(K.carSpec(ctx.vehicle).paint);
      [-1, 1].forEach(function (s) { var w = K.mesh(K.G.rbox(1.3, 0.08, 0.22, 0.03), paint); w.position.set(0.1, 1.05, s * 0.72); A.root.add(w); });
      var bar = supportBar(K); A.root.add(bar);
      var jack = gearboxJack(K); jack.position.set(0.5, 0, 0.02); A.root.add(jack);
      return {
        root: A.root,
        update: function (t) {
          bar.position.set(-0.2, 1.17 + (1 - T.seg(t, 0.3, 1.6)) * 0.35, 0);
          var k = T.seg(t, 2.2, 4.0);
          jack.userData.ram.position.y = -0.18 + k * 0.18;
        },
        labels: [
          { text: V('Převodovka', 'Gearbox'), at: [0.55, AXY + 0.2, 0.15] },
          { text: V('Zvedák převodovky', 'Gearbox jack'), at: [0.5, 0.3, 0.3], show: [2, 7] }
        ],
        captions: [
          { text: V('Podpěra motoru přes blatníky + zvedák převodovky', 'Engine support bar over the wings + gearbox jack') },
          { text: V('Nikdy pod nezajištěnou převodovkou!', 'Never under an unsupported gearbox!'), level: 'danger', show: [2, 7] }
        ]
      };
    }
  });

  function gbMove(rev) {
    return {
      duration: 8, camera: { pos: [1.2, 0.85, 1.8], target: [0.3, 0.38, 0], fov: 38 }, shadow: 1.6, thumbT: rev ? 2 : 5,
      build: function (ctx, K) {
        var T = K.T, A = assembly(K);
        var jack = gearboxJack(K); jack.position.set(0.5, 0, 0.02); A.root.add(jack);
        var base = A.gb.position.clone();
        return {
          root: A.root,
          update: function (t) {
            var slide = T.seg(t, 0.8, 3.0), drop = T.seg(t, 3.4, 5.2);
            if (rev) { var u = t; slide = 1 - T.seg(u, 3.4, 5.6); drop = 1 - T.seg(u, 0.8, 3.0); }
            A.gb.position.set(base.x + slide * 0.25, base.y - drop * 0.25, base.z);
            A.rb.position.x = 0.15 + slide * 0.25; A.rb.position.y = -drop * 0.25;
            jack.position.x = 0.5 + slide * 0.25; jack.userData.ram.position.y = -drop * 0.25;
          },
          labels: [{ text: '~40–50 kg', at: function () { return A.gb.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.4, 0.2, 0.15)); }, level: 'accent' }],
          captions: rev ? [
            { text: V('Nasadit rovně v ose – drážky hřídele do lamely', 'Slide in straight – shaft splines into the disc') },
            { text: V('Nikdy nedotahovat převodovku šrouby „k motoru“!', 'Never pull the gearbox in with the bolts!'), level: 'danger' }
          ] : [
            { text: V('Odtáhnout rovně v ose, pak spustit', 'Pull straight back along the axis, then lower') },
            { text: V('Převodovka nesmí viset na hřídeli', 'The gearbox must not hang on its input shaft'), level: 'danger' }
          ]
        };
      }
    };
  }
  R('clutch.gearboxOut', gbMove(false));
  R('clutch.gearboxIn', gbMove(true));

  /* ------------------------------------------------------------------ inspect */
  R('clutch.inspect', {
    duration: 8, camera: { pos: [0.55, 0.72, 1.25], target: [0.38, 0.42, 0], fov: 38 }, shadow: 1.4, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, A = assembly(K, { blue: true });
      A.disc.visible = false; A.pp.visible = false;
      A.gb.position.x = 0.85; A.rb.position.x = 0.87;
      var g1 = K.FX.glow(A.eng.userData.seal, 0xe5484d), g2 = K.FX.glow(A.fw.userData.face, 0x3e8ed0);
      var spl = new THREE.Group(); A.gb.children.forEach(function (c) { if (c.geometry && c.geometry.type === 'ExtrudeGeometry' && c.position.x === 0.02) spl = c; });
      var g3 = K.FX.glow(spl, 0xf5a524);
      var crack = K.mesh(K.G.box(0.002, 0.03, 0.002), 'blackOxide'); crack.position.set(0.031, 0.09, 0.05); crack.rotation.x = 0.4; A.axis.add(crack);
      return {
        root: A.root,
        update: function (t) {
          g1(T.between(t, 0.5, 3) ? 0.6 + 0.3 * Math.sin(t * 6) : 0);
          g2(T.between(t, 3, 5.5) ? 0.5 + 0.3 * Math.sin(t * 6) : 0);
          g3(T.between(t, 5.5, 8) ? 0.6 + 0.3 * Math.sin(t * 6) : 0);
        },
        labels: [
          { text: V('Gufero kliky teče? → vyměnit', 'Crank seal leaking? → replace'), at: [0.0, AXY + 0.08, 0.06], show: [0.5, 3], level: 'danger' },
          { text: V('Modré skvrny, praskliny', 'Blue spots, cracks'), at: [0.04, AXY + 0.13, 0.04], show: [3, 5.5], level: 'accent' },
          { text: V('Drážky hřídele, vodítko ložiska', 'Shaft splines, bearing guide'), at: [0.9, AXY + 0.06, 0.03], show: [5.5, 8], level: 'accent' }
        ],
        captions: [{ text: V('Než namontujete nové díly: kontrola okolí', 'Before fitting new parts: inspect the surroundings') }]
      };
    }
  });

  /* ------------------------------------------------------------------ bolts in star pattern */
  function starScene(kind) {
    return {
      duration: 10, camera: { pos: [0.55, 0.55, 0.35], target: [0.03, 0.42, 0], fov: 36 }, shadow: 0.8, thumbT: 4,
      build: function (ctx, K) {
        var T = K.T, A = assembly(K, { newBolts: true });
        A.gb.visible = false; A.rb.visible = false;
        if (kind === 'dmf') { A.disc.visible = false; A.pp.visible = false; }
        var bolts = kind === 'dmf' ? A.fw.userData.bolts : A.pp.userData.bolts;
        var parent = kind === 'dmf' ? A.fw.userData.sec : A.pp;
        var order = kind === 'dmf' ? [0, 4, 2, 6, 1, 5, 3, 7] : [0, 3, 1, 4, 2, 5];
        var base = bolts.map(function (b) { return b.position.clone(); });
        var tw = K.P.torqueWrench(0.32); tw.rotation.z = -PI / 2; tw.position.x = 0.03; tw.scale.setScalar(0.8);
        var holder = new THREE.Group(); holder.add(tw); parent.add(holder);
        var per = 8.5 / order.length;
        var labels = order.map(function (bi, i) {
          return { text: String(i + 1), at: function () { return bolts[bi].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.02, 0.02, 0)); }, show: [0.4 + i * per, 10], level: 'accent' };
        });
        return {
          root: A.root,
          update: function (t) {
            var cur = Math.min(order.length - 1, Math.floor(Math.max(0, t - 0.4) / per));
            order.forEach(function (bi, i) {
              var k = kind === 'plate' ? T.lin(t, 0.4, 9) : T.seg(t, 0.4 + i * per, 0.4 + i * per + per * 0.6);
              bolts[bi].position.copy(base[bi]); bolts[bi].position.x += (1 - k) * 0.02;
            });
            holder.position.copy(bolts[order[cur]].position);
            holder.rotation.x = T.seg((t - 0.4) % per, per * 0.2, per * 0.7) * 0.6;
            if (kind === 'plate') A.pp.position.x = 0.05 + (1 - T.lin(t, 0.4, 9)) * 0.012;
          },
          labels: labels,
          captions: kind === 'dmf' ? [
            { text: V('NOVÉ šrouby, do kříže, moment + úhel', 'NEW bolts, star pattern, torque + angle') },
            { text: V('Závity odmastit, zajištění dle návodu výrobce', 'Degrease threads, thread lock per maker\'s instructions'), level: 'info' }
          ] : [
            { text: V('Postupně do kříže, po 1–2 otáčkách', 'Gradually in a star pattern, 1–2 turns at a time') },
            { text: V('Talíř se stáhne rovnoměrně, lamela zůstane vystředěná', 'Plate pulls down evenly, disc stays centred'), level: 'info' }
          ]
        };
      }
    };
  }
  R('clutch.dmfBolts', starScene('dmf'));
  R('clutch.plateBolts', starScene('plate'));

  /* ------------------------------------------------------------------ alignment tool */
  R('clutch.align', {
    duration: 7, camera: { pos: [0.5, 0.6, 0.6], target: [0.06, 0.42, 0], fov: 36 }, shadow: 0.9, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, A = assembly(K);
      A.gb.visible = false; A.rb.visible = false;
      var tool = new THREE.Group();
      var shaft = K.mesh(K.G.cylX(0.011, 0.16, 20), 'plasticBlack'); shaft.position.x = 0.04; tool.add(shaft);
      var cone = K.mesh(latheX(K, [[0.011, 0], [0.024, 0.03], [0.024, 0.06], [0.011, 0.07]], 24), 'toolYellow'); cone.position.x = 0.02; tool.add(cone);
      var handle = K.mesh(K.G.cylX(0.02, 0.06, 20), 'toolYellow'); handle.position.x = 0.15; tool.add(handle);
      A.axis.add(tool);
      var sticker = K.FX.canvasPanel(0.06, 0.018, function (c, W, H) { c.fillStyle = '#f2f2f2'; c.fillRect(0, 0, W, H); c.fillStyle = '#111'; c.font = 'bold ' + Math.round(H * 0.55) + 'px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('Getriebeseite', W / 2, H / 2); }, { px: 256 });
      sticker.rotation.y = PI / 2; sticker.position.set(0.012, 0.03, -0.02); A.disc.add(sticker);
      return {
        root: A.root,
        update: function (t) {
          var k = T.seg(t, 0.4, 2.2), p = T.seg(t, 2.6, 4.2);
          A.disc.position.x = 0.045 + (1 - k) * 0.12;
          A.pp.position.x = 0.05 + (1 - p) * 0.15;
          tool.position.x = (1 - k) * 0.2 - 0.02;
          tool.visible = t < 6.2;
        },
        labels: [{ text: V('Středicí trn', 'Alignment tool'), at: function () { return tool.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.15, 0.04, 0)); }, show: [0.4, 6] }],
        captions: [
          { text: V('Středicí trn vystředí lamelu k ložisku v klice', 'The alignment tool centres the disc on the crank pilot') },
          { text: V('Nápis „Getriebeseite / Gearbox side“ k převodovce!', '"Getriebeseite / Gearbox side" faces the gearbox!'), level: 'danger' }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ SAC */
  R('clutch.sac', {
    duration: 8, camera: { pos: [0.45, 0.6, 0.35], target: [0.05, 0.42, 0], fov: 36 }, shadow: 0.8, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, A = assembly(K);
      A.gb.visible = false; A.rb.visible = false; A.eng.visible = false; A.fw.visible = false; A.disc.visible = false;
      var tool = new THREE.Group();
      var bridge = K.mesh(K.G.box(0.03, 0.03, 0.3), 'toolYellow'); bridge.position.x = 0.16; tool.add(bridge);
      var screw = K.mesh(K.G.cylX(0.008, 0.12, 12), 'chrome'); screw.position.x = 0.12; tool.add(screw);
      var press = K.mesh(K.G.cylX(0.03, 0.01, 24), 'steelDark'); press.position.x = 0.065; tool.add(press);
      A.axis.add(tool);
      var ring = K.mesh(K.G.torus(0.108, 0.005, PI * 2, 48), 'toolBlue'); ring.rotation.y = PI / 2; ring.position.x = 0.09; A.axis.add(ring);
      var tick = K.mesh(K.G.box(0.006, 0.014, 0.006), 'hiDanger'); tick.position.set(0, 0.108, 0); ring.add(tick);
      return {
        root: A.root,
        update: function (t) {
          var c = T.seg(t, 0.5, 2.5) * (1 - T.seg(t, 7, 7.8));
          tool.position.x = A.pp.position.x - c * 0.012;
          A.pp.userData.fingers.scale.x = 1 - c * 0.5;
          ring.rotation.z = T.seg(t, 3, 5) * 0.8 * (1 - T.seg(t, 7, 7.8));
        },
        captions: [
          { text: V('1. stlačit pera přípravkem', '1. compress fingers with the tool'), show: [0, 3] },
          { text: V('2. stavěcí kroužek vrátit zpět', '2. turn back the adjuster ring'), show: [3, 5.2] },
          { text: V('3. zajistit / montovat', '3. lock / fit'), show: [5.2, 8] },
          { text: V('SAC bez přípravku = zničený talíř', 'SAC without the tool = ruined plate'), level: 'danger' }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ bleed */
  R('clutch.bleed', {
    duration: 8, camera: { pos: [0.25, 0.9, 1.25], target: [0.0, 0.68, 0], fov: 38 }, shadow: 1, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var pedalBox = K.mesh(K.G.rbox(0.12, 0.08, 0.1, 0.01), 'plasticBlack'); pedalBox.position.set(-0.35, 0.82, 0); root.add(pedalBox);
      var pedal = new THREE.Group(); pedal.position.set(-0.35, 0.8, 0); root.add(pedal);
      var arm = K.mesh(K.G.box(0.02, 0.32, 0.015), 'steelDark'); arm.position.y = -0.16; pedal.add(arm);
      var pad = K.mesh(K.G.rbox(0.08, 0.05, 0.02, 0.006), 'rubber'); pad.position.set(0.01, -0.32, 0); pedal.add(pad);
      var slave = K.mesh(K.G.rbox(0.14, 0.07, 0.07, 0.015), 'aluCast'); slave.position.set(0.15, 0.55, 0); root.add(slave);
      var nip = K.mesh(K.G.hex(0.007, 0.014), 'zinc'); nip.position.set(0.24, 0.57, 0); nip.rotation.z = -PI / 2; root.add(nip);
      var hose = K.mesh(K.G.tube([[0.25, 0.57, 0], [0.33, 0.57, 0], [0.36, 0.52, 0], [0.36, 0.4, 0]], 0.005), K.M.clone('glassClear', { opacity: 0.45 })); root.add(hose);
      var bottle = K.mesh(K.G.lathe([[0, 0], [0.05, 0], [0.05, 0.14], [0.045, 0.15], [0.0, 0.15]], 32), K.M.clone('glassClear', { opacity: 0.3 })); bottle.position.set(0.36, 0.3, 0); root.add(bottle);
      var fluid = K.mesh(K.G.cyl(0.046, 0.05, 32), K.M.brakeFluid); fluid.position.set(0.36, 0.33, 0); root.add(fluid);
      var bubbles = [];
      for (var i = 0; i < 7; i++) { var b = K.mesh(K.G.sphere(0.004, 8), 'plasticWhite'); b.userData.o = i / 7; root.add(b); bubbles.push(b); }
      var res = K.mesh(K.G.rbox(0.08, 0.1, 0.06, 0.01), K.M.clone('plasticWhite', { transparent: true, opacity: 0.5 })); res.position.set(-0.2, 1.0, 0); root.add(res);
      var rl = new THREE.Group(); var rlm = K.mesh(K.G.box(0.07, 0.08, 0.05), K.M.brakeFluid); rlm.position.y = 0.04; rl.add(rlm); rl.position.set(-0.2, 0.955, 0); root.add(rl);
      var minL = K.mesh(K.G.box(0.04, 0.003, 0.002), 'hiDanger'); minL.position.set(-0.2, 0.985, 0.031); root.add(minL);
      return {
        root: root,
        update: function (t) {
          var cyc = t % 2.6, press = T.seg(cyc, 0.1, 0.6) * (1 - T.seg(cyc, 1.8, 2.3));
          pedal.rotation.z = -press * 0.5;
          var open = cyc > 0.7 && cyc < 1.5;
          nip.rotation.x = open ? 0.6 : 0;
          var clear = t > 5.4;
          bubbles.forEach(function (b) {
            var k = (t * 1.2 + b.userData.o) % 1;
            b.visible = open && !clear;
            b.position.set(0.36, 0.53 - k * 0.17, 0);
          });
          rl.scale.y = 1 - T.lin(t, 0, 8) * 0.35;
        },
        labels: [
          { text: V('Pedál sešlápnout a držet', 'Press and hold the pedal'), at: [-0.33, 0.42, 0.05] },
          { text: V('Povolit odvzdušňovák', 'Open bleed nipple'), at: [0.24, 0.62, 0.03] },
          { text: V('✔ bez bublin', '✔ no bubbles'), at: [0.36, 0.5, 0.05], show: [5.4, 8], level: 'ok' },
          { text: 'MIN', at: [-0.2, 0.99, 0.04], level: 'danger' }
        ],
        captions: [{ text: V('Nádržka nesmí klesnout pod MIN – doplňovat!', 'Reservoir must not drop below MIN – keep topping up!'), level: 'danger' }]
      };
    }
  });

  /* ------------------------------------------------------------------ shift test */
  R('clutch.test', {
    duration: 9, camera: { pos: [0.32, 0.62, 0.48], target: [0, 0.4, 0], fov: 36 }, shadow: 0.6, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var con = K.mesh(K.G.rbox(0.36, 0.08, 0.4, 0.04), 'plasticTex'); con.position.set(0, 0.3, 0); root.add(con);
      var boot = K.mesh(K.G.lathe([[0.06, 0], [0.05, 0.02], [0.03, 0.06], [0.015, 0.1]], 24), 'leather'); boot.position.set(0, 0.34, 0); root.add(boot);
      var lever = new THREE.Group(); lever.position.set(0, 0.34, 0); root.add(lever);
      var rod = K.mesh(K.G.cyl(0.008, 0.16, 12), 'chrome'); rod.position.y = 0.08; lever.add(rod);
      var knob = K.mesh(K.G.sphere(0.028, 24), 'leather'); knob.position.y = 0.17; lever.add(knob);
      var gates = [[-1, -1], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 1]];
      var path = [], seq = [0, 1, 2, 3, 4, 5];
      var times = seq.map(function (g, i) { return 0.4 + i * 1.3; });
      return {
        root: root,
        update: function (t) {
          var i = Math.min(5, Math.floor(Math.max(0, t - 0.4) / 1.3)), k = T.seg((t - 0.4) % 1.3, 0.1, 0.6);
          var g = gates[i];
          var pos = t < 0.4 || t > 8.2 ? [0, 0] : [g[0] * k, g[1] * k];
          lever.rotation.z = -pos[0] * 0.22; lever.rotation.x = pos[1] * 0.3;
        },
        labels: gates.map(function (g, i) { return { text: (i + 1) + ' ✔', at: [g[0] * 0.05, 0.36, -g[1] * 0.07], show: [times[i] + 0.7, 9], level: 'ok' }; }),
        captions: [
          { text: V('Všechny rychlosti: bez drhnutí a hluku', 'All gears: no grinding, no noise') },
          { text: V('Záběr cca v polovině zdvihu pedálu', 'Bite point roughly mid-travel'), level: 'info' },
          { text: V('Prvních ~500 km šetrně – bez prudkých rozjezdů', 'First ~500 km gently – no hard launches'), show: [4, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ automatic */
  R('clutch.auto', {
    duration: 8, camera: { pos: [0.1, 0.55, 0.75], target: [0.05, 0.32, 0], fov: 36 }, shadow: 0.8, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), F3 = S.f3 || {};
      var con = K.mesh(K.G.rbox(0.22, 0.06, 0.3, 0.03), 'plasticTex'); con.position.set(-0.2, 0.2, 0); root.add(con);
      var sel = K.mesh(K.G.rbox(0.05, 0.1, 0.07, 0.02), 'leather'); sel.position.set(-0.2, 0.28, 0); root.add(sel);
      var gearTxt = K.FX.canvasPanel(0.04, 0.12, function (c, W, H, st) {
        c.fillStyle = '#111'; c.fillRect(0, 0, W, H);
        ['P', 'R', 'N', 'D'].forEach(function (g, i) { c.fillStyle = st === g ? '#f5a524' : '#666'; c.font = 'bold ' + Math.round(H * 0.18) + 'px Arial'; c.textAlign = 'center'; c.fillText(g, W / 2, H * (0.2 + i * 0.22)); });
      }, { px: 128, state: 'P' });
      gearTxt.rotation.x = -PI / 2; gearTxt.position.set(-0.13, 0.232, 0); root.add(gearTxt);
      var tool = ctx.vehicle === 'mb-cl500-c216' ? 'XENTRY' : ctx.vehicle === 'volvo-xc60-b4' ? 'VIDA' : S.t(V('Diagnostika', 'Scan tool'));
      var adapt = S.t(V('Adaptace převodovky', 'Transmission adaptation')), sub = S.t(V('kódy · teplota ATF · adaptace', 'codes · ATF temp · adaptation'));
      var dev = F3.scanTool ? F3.scanTool(K, function (c, W, H, st) {
        F3.screenBase(c, W, H, tool);
        c.fillStyle = '#cfe3f2'; c.font = 'bold ' + Math.round(H * 0.065) + 'px system-ui, Arial'; c.textAlign = 'center'; c.fillText(adapt, W / 2, H * 0.32);
        c.fillStyle = '#3a4250'; c.fillRect(W * 0.1, H * 0.5, W * 0.8, H * 0.07);
        c.fillStyle = '#30a46c'; c.fillRect(W * 0.1, H * 0.5, W * 0.8 * (st || 0), H * 0.07);
        c.fillStyle = '#9aa5b8'; c.font = Math.round(H * 0.05) + 'px system-ui, Arial'; c.fillText(sub, W / 2, H * 0.72);
        if (st >= 1) { c.fillStyle = '#30a46c'; c.font = 'bold ' + Math.round(H * 0.07) + 'px system-ui, Arial'; c.fillText('OK ✔', W / 2, H * 0.87); }
      }, 0) : new THREE.Group();
      dev.position.set(0.12, 0.33, 0); dev.rotation.x = -0.2; root.add(dev);
      return {
        root: root,
        update: function (t) {
          gearTxt.userData.redraw(t < 2 ? 'P' : t < 3 ? 'R' : t < 4 ? 'N' : 'D');
          if (dev.userData.screen) dev.userData.screen.userData.redraw(Math.round(T.lin(t, 1, 6.5) * 20) / 20);
        },
        captions: [
          { text: V('Automat: žádná spojka s pedálem', 'Automatic: no pedal-operated clutch') },
          { text: V('Diagnostika + stav ATF = první krok', 'Diagnostics + ATF condition = first step'), level: 'info' }
        ]
      };
    }
  });
})(window.STU);
