/* 3D scenes: gearbox, transfer & differential oils. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var CY = 0.42;           // case centre height
  var FILL_Y = 0.06;       // fill hole height above case centre

  /** Gearbox / diff case with fill plug (+Z face) and drain plug (underside). see = semi-transparent shell. */
  function gearCase(K, o) {
    o = o || {};
    var g = new THREE.Group(); g.position.y = CY;
    var shellMat = o.see ? K.M.clone('aluCast', { transparent: true, opacity: 0.28, depthWrite: false }) : 'aluCast';
    var shell = K.mesh(K.G.rbox(0.46, 0.3, 0.3, 0.05), shellMat); g.add(shell);
    if (o.see) shell.userData.noShadow = true;
    for (var i = 0; i < 5; i++) { var rib = K.mesh(K.G.box(0.012, 0.28, 0.31), shellMat); rib.position.x = -0.18 + i * 0.09; if (!o.see) g.add(rib); }
    var bell = K.mesh(K.G.cylX(0.17, 0.08, 40), shellMat); bell.position.x = -0.26; g.add(bell);
    var flange = K.mesh(K.G.cylX(0.04, 0.04, 24), 'steelDark'); flange.position.set(0.25, -0.04, 0); g.add(flange);
    // oil volume (scale.y = level)
    var oilG = new THREE.Group(); oilG.position.y = -0.14; g.add(oilG);
    var oil = K.mesh(K.G.box(0.42, 0.28, 0.26), K.M.clone('oil', { opacity: o.see ? 0.75 : 0.9 })); oil.position.y = 0.14; oilG.add(oil);
    oilG.visible = !!o.see;
    // gears inside (visible through shell)
    if (o.see) {
      [[-0.08, 0.02, 0.09], [0.1, -0.05, 0.11]].forEach(function (gp) { var gr = K.mesh(K.G.gear(28, gp[2], gp[2] - 0.01, 0.04, 0.02), 'steel'); gr.position.set(gp[0], gp[1], 0); g.add(gr); });
    }
    function plug(r) {
      var p = new THREE.Group();
      var head = K.mesh(K.G.hex(r, 0.014), 'zinc'); head.position.y = 0.007; p.add(head);
      var wash = K.mesh(K.G.cyl(r * 1.15, 0.003, 24), 'copper'); p.add(wash);
      var th = K.mesh(K.G.cyl(r * 0.8, 0.02, 16), 'steelDark'); th.position.y = -0.01; p.add(th);
      return p;
    }
    var fill = plug(0.012); fill.rotation.x = PI / 2; fill.position.set(0.12, FILL_Y, 0.152); g.add(fill);
    var drain = plug(0.012); drain.rotation.x = PI; drain.position.set(0.0, -0.152, 0.05); g.add(drain);
    var fillHole = K.mesh(K.G.cylZ(0.009, 0.004, 16), 'blackOxide'); fillHole.position.set(0.12, FILL_Y, 0.151); g.add(fillHole);
    var drainHole = K.mesh(K.G.cyl(0.009, 0.004, 16), 'blackOxide'); drainHole.position.set(0, -0.151, 0.05); g.add(drainHole);
    // level = 0..1 of internal height; fill hole lower edge sits at levelAtHole
    var levelAtHole = (FILL_Y - 0.009 + 0.14) / 0.28;
    g.userData = { fill: fill, drain: drain, oil: oilG, levelAtHole: levelAtHole, fillPos: new THREE.Vector3(0.12, CY + FILL_Y, 0.16), drainPos: new THREE.Vector3(0, CY - 0.16, 0.05) };
    return g;
  }
  function setLevel(c, k) { c.userData.oil.scale.y = Math.max(0.001, k); c.userData.oil.visible = k > 0.002; }

  var CAM = { pos: [0.55, 0.45, 0.85], target: [0.03, 0.4, 0.05], fov: 36 };

  /* ------------------------------------------------------------------ units per vehicle */
  R('drive.diffs', {
    duration: 8, camera: { pos: [2.9, 3.2, 3.0], target: [0, 0.3, 0], fov: 34 }, shadow: 3, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, v = ctx.vehicle, root = new THREE.Group();
      var c = K.car(v); root.add(c.group);
      K.FX.fader(c.body)(0.22);
      var d = c.dims, units = [];
      function unit(geo, mat, pos, label, rot) {
        var m = K.mesh(geo, mat); m.position.copy(pos); if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
        root.add(m); var u = { m: m, glow: K.FX.glow(m, 0xf5a524), label: label }; units.push(u); return u;
      }
      function shaft(a, b, r) { var m = K.mesh(K.G.tube([a, b], r || 0.025, false, 2, 10), 'steelDark'); root.add(m); return m; }
      var eng = function (x, z, longi) { var m = K.mesh(K.G.rbox(longi ? 0.75 : 0.5, 0.5, longi ? 0.6 : 0.65, 0.04), 'castIron'); m.position.set(x, 0.55, z); root.add(m); return m; };
      var y = d.wr, xf = d.xf, xr = d.xr, tz = d.track / 2 - 0.12;
      var labels = [];
      if (v === 'mb-cl500-c216') {
        eng(xf - 0.15, 0, true);
        var gb = unit(K.G.rbox(0.7, 0.3, 0.3, 0.06), 'aluCast', new THREE.Vector3(xf - 0.85, 0.42, 0), V('7G-Tronic (ATF)', '7G-Tronic (ATF)'));
        shaft([xf - 1.2, 0.38, 0], [xr + 0.15, y, 0], 0.03);
        unit(K.G.sphere(0.16, 24), 'aluCast', new THREE.Vector3(xr, y, 0), V('Zadní diferenciál', 'Rear differential'));
        shaft([xr, y, -tz], [xr, y, tz]);
        labels.push({ text: V('Motor V8', 'V8 engine'), at: [xf - 0.15, 0.9, 0] });
      } else if (v === 'volvo-xc60-b4' || v === 'toyota-gr-yaris') {
        eng(xf + 0.12, -0.05, false);
        unit(K.G.rbox(0.36, 0.34, 0.4, 0.05), 'aluCast', new THREE.Vector3(xf + 0.05, 0.45, 0.45), v === 'volvo-xc60-b4' ? V('Automat 8st.', '8-speed auto') : V('6MT + přední dif.', '6MT + front diff'));
        unit(K.G.rbox(0.18, 0.18, 0.2, 0.04), 'aluCast', new THREE.Vector3(xf - 0.1, y, 0.15), v === 'volvo-xc60-b4' ? V('Úhlový převod (PTU)', 'Angle gear (PTU)') : V('Rozdělovací převodovka', 'Transfer case'));
        shaft([xf - 0.15, y, 0.12], [xr + 0.2, y, 0.02], 0.03);
        unit(K.G.rbox(0.28, 0.24, 0.3, 0.05), 'aluCast', new THREE.Vector3(xr + 0.05, y, 0), v === 'volvo-xc60-b4' ? V('Zadní RDU + spojka', 'Rear RDU + coupling') : V('Zadní dif. + spojka', 'Rear diff + coupling'));
        shaft([xr, y, -tz], [xr, y, tz]); shaft([xf, y, -tz], [xf, y, tz]);
      } else if (v === 'citroen-jumper-22hdi') {
        // transverse 2.2 HDi + 6-speed manual with integrated differential – one oil; rear beam axle has no oil
        eng(xf + 0.2, -0.1, false);
        unit(K.G.rbox(0.4, 0.38, 0.45, 0.05), 'aluCast', new THREE.Vector3(xf + 0.08, 0.55, 0.5), V('6st. manuál + diferenciál (jeden olej)', '6-speed manual + diff (one oil)'));
        shaft([xf, y, -tz], [xf, y, tz]);
        var beam = K.mesh(K.G.box(0.1, 0.1, tz * 2), 'steelDark'); beam.position.set(xr, y, 0); root.add(beam);
        labels.push({ text: V('Motor 2.2 HDi', '2.2 HDi engine'), at: [xf + 0.2, 1.05, -0.1] });
        labels.push({ text: V('Zadní náprava – bez oleje', 'Rear axle – no oil'), at: [xr, y + 0.25, 0] });
      } else {
        eng(xf + 0.12, -0.08, false);
        unit(K.G.rbox(0.36, 0.34, 0.4, 0.05), 'aluCast', new THREE.Vector3(xf + 0.02, 0.45, 0.45), V('Převodovka + diferenciál', 'Gearbox + differential'));
        shaft([xf, y, -tz], [xf, y, tz]);
        labels.push({ text: V('Motor', 'Engine'), at: [xf + 0.12, 0.9, -0.08] });
      }
      units.forEach(function (u) { labels.push({ text: u.label, at: u.m, level: 'accent' }); });
      return {
        root: root,
        cameraPath: v === 'citroen-jumper-22hdi' ? function () { return { pos: [4.6, 5.0, 4.4], target: [0.3, 0.6, 0] }; } : null,
        update: function (t) { units.forEach(function (u, i) { u.glow(0.35 + 0.35 * Math.sin(t * 3 + i)); }); },
        labels: labels,
        captions: [{ text: V('Každá jednotka = vlastní olej, specifikace a množství', 'Each unit = its own oil, spec and capacity') }]
      };
    }
  });

  /* ------------------------------------------------------------------ GL-4 vs GL-5 */
  function bottleLabel(K, txt, col) {
    return K.FX.canvasPanel(0.12, 0.1, function (c, W, H) {
      c.fillStyle = '#f4f4f4'; c.fillRect(0, 0, W, H); c.fillStyle = col; c.fillRect(0, 0, W, H * 0.25);
      c.fillStyle = '#111'; c.font = 'bold ' + Math.round(H * 0.32) + 'px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, W / 2, H * 0.62);
    }, { px: 256 });
  }
  R('drive.gl', {
    duration: 8, camera: { pos: [0.0, 0.55, 1.0], target: [0, 0.2, 0], fov: 36 }, shadow: 1, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      [[-0.38, 'GL-4', '#30a46c', 0x2d7a4f], [0.38, 'GL-5', '#f5c518', 0x7a6a1d]].forEach(function (b) {
        var can = K.P.oilCan(b[3]); can.position.set(b[0], 0, 0); root.add(can);
        var l = bottleLabel(K, b[1], b[2]); l.position.set(b[0], 0.13, 0.063); root.add(l);
      });
      var ring = new THREE.Group(); ring.position.set(0, 0.2, 0); root.add(ring);
      var body = K.mesh(K.G.latheZ([[0.05, -0.012], [0.075, -0.012], [0.075, 0.012], [0.05, 0.012]], 48), 'brass'); ring.add(body);
      for (var i = 0; i < 30; i++) { var tth = K.mesh(K.G.box(0.008, 0.012, 0.014), 'brass'); var a = i / 30 * PI * 2; tth.position.set(Math.cos(a) * 0.08, Math.sin(a) * 0.08, 0.004); tth.rotation.z = a; ring.add(tth); }
      var pits = [];
      for (var j = 0; j < 9; j++) { var pt = K.mesh(K.G.sphere(0.005, 8), K.M.clone('rust', { color: 0x3a2412, transparent: true })); var b2 = j * 0.7; pt.position.set(Math.cos(b2) * 0.063, Math.sin(b2) * 0.063, 0.012); ring.add(pt); pits.push(pt); }
      return {
        root: root,
        update: function (t) {
          ring.rotation.z = t * 0.3; ring.rotation.x = -0.4;
          var k = T.seg(t, 3.5, 5.5);
          pits.forEach(function (p) { p.material.opacity = k; p.visible = k > 0.02; p.scale.setScalar(0.5 + k); });
        },
        labels: [
          { text: V('✔ dle předpisu', '✔ as specified'), at: [-0.38, 0.36, 0], level: 'ok' },
          { text: V('⚠ jen je-li předepsán', '⚠ only if specified'), at: [0.38, 0.36, 0], level: 'danger' },
          { text: V('Synchronní kroužek (barevný kov)', 'Synchro ring (yellow metal)'), at: [0, 0.3, 0] },
          { text: V('koroze synchronu', 'synchro corrosion'), at: [0, 0.1, 0.03], show: [4, 8], level: 'danger' }
        ],
        captions: [
          { text: V('Rozhoduje norma výrobce, ne „lepší“ číslo', 'The maker\'s spec decides, not a "better" number') },
          { text: V('Nevhodný olej může poškodit synchrony a lamely', 'Wrong oil can damage synchros and clutch packs'), level: 'danger', show: [3.5, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ fill plug first */
  R('drive.fillFirst', {
    duration: 8, camera: { pos: [0.4, 0.3, 0.75], target: [0.05, 0.36, 0.05], fov: 36 }, shadow: 0.8, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), c = gearCase(K); root.add(c);
      var r1 = K.P.ratchet(0.22, 0.013); r1.rotation.x = PI / 2; var h1 = new THREE.Group(); h1.add(r1); r1.position.z = 0.02;
      h1.position.copy(c.userData.fillPos); root.add(h1);
      var r2 = K.P.ratchet(0.22, 0.013); r2.rotation.x = PI; var h2 = new THREE.Group(); h2.add(r2); r2.position.y = -0.02;
      h2.position.copy(c.userData.drainPos); root.add(h2);
      return {
        root: root,
        update: function (t) {
          var a = T.seg(t, 0.5, 1.6) - T.seg(t, 1.8, 2.6);
          h1.rotation.z = 0.3 + a * 0.9; h1.visible = t < 3;
          c.userData.fill.rotation.y = a * 0.9;
          var b = T.seg(t, 4.0, 5.2);
          h2.rotation.y = b * 0.9; h2.visible = t > 3.6;
        },
        labels: [
          { text: V('1. plnicí šroub', '1. fill plug'), at: [0.12, CY + FILL_Y + 0.05, 0.17], level: 'accent' },
          { text: V('✔ povolen', '✔ loosened'), at: [0.12, CY + FILL_Y - 0.04, 0.17], show: [2.6, 8], level: 'ok' },
          { text: V('2. vypouštěcí šroub', '2. drain plug'), at: [0, CY - 0.2, 0.08], show: [3.6, 8], level: 'accent' }
        ],
        captions: [
          { text: V('1. NEJDŘÍV povolit plnicí šroub, 2. teprve pak vypouštěcí', '1. FIRST loosen the fill plug, 2. only then the drain plug') },
          { text: V('Plnicí nejde povolit? Nevypouštět!', 'Fill plug stuck? Do not drain!'), level: 'danger' }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ drain */
  R('drive.drain', {
    duration: 8, camera: { pos: [0.55, 0.35, 0.9], target: [0.05, 0.25, 0.05], fov: 38 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), c = gearCase(K, { see: true }); root.add(c);
      var pan = K.P.drainPan(0.18, 0.07); pan.position.set(0.02, 0, 0.05); root.add(pan);
      pan.traverse(function (o) { if (o.isMesh && o.material === K.M.oilOld) o.material = K.M.oil; });
      var dp = c.userData.drainPos;
      var stream = K.FX.stream([dp.x, dp.y - 0.01, dp.z], [dp.x + 0.01, dp.y - 0.12, dp.z], [dp.x + 0.02, 0.03, dp.z], K.M.oil, 0.006); root.add(stream.mesh);
      // magnetic plug close-up (lying on a rag)
      var mag = new THREE.Group(); mag.position.set(-0.32, 0.03, 0.2); root.add(mag);
      var rag = K.mesh(K.G.box(0.16, 0.004, 0.12), K.M.clone('fabric', { color: 0xd9d4c8 })); mag.add(rag);
      var ph = K.mesh(K.G.hex(0.014, 0.014), 'zinc'); ph.rotation.z = PI / 2; ph.position.set(0.02, 0.016, 0); mag.add(ph);
      var tip = K.mesh(K.G.cylX(0.008, 0.02, 16), 'steelDark'); tip.position.set(-0.004, 0.016, 0); mag.add(tip);
      var paste = K.mesh(K.G.sphere(0.0095, 12), K.M.clone('castIron', { roughness: 1, color: 0x2a2a2c })); paste.scale.set(0.7, 1, 1); paste.position.set(-0.014, 0.016, 0); mag.add(paste);
      return {
        root: root,
        update: function (t) {
          var open = T.seg(t, 0.4, 1.0);
          c.userData.drain.position.y = -0.152 - open * 0.04; c.userData.drain.visible = t < 1.4;
          var k = T.lin(t, 1.0, 6.0);
          setLevel(c, 0.75 * (1 - k) + 0.02);
          stream.set(T.between(t, 1.0, 6.2) ? 1 : 0);
          pan.userData.setLevel(k * 0.8 * (1 - T.seg(t, 7.6, 8)));
        },
        labels: [
          { text: V('Magnet: jemná pasta = OK', 'Magnet: fine paste = OK'), at: [-0.32, 0.08, 0.2], show: [2, 8], level: 'ok' },
          { text: V('kousky kovu = problém', 'metal chunks = problem'), at: [-0.32, 0.12, 0.2], show: [3.5, 8], level: 'danger' }
        ],
        captions: [
          { text: V('Teplý olej vypustit do záchytné vany', 'Drain the warm oil into a catch pan') },
          { text: V('Pozor, olej může být horký – rukavice!', 'Careful, the oil can be hot – gloves!'), level: 'danger' }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ new seal + torque */
  R('drive.seal', {
    duration: 7, camera: { pos: [0.2, 0.16, 0.42], target: [0.0, 0.26, 0.05], fov: 34 }, shadow: 0.6, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), c = gearCase(K); root.add(c);
      c.userData.drain.visible = false;
      var plug = new THREE.Group(); root.add(plug);
      var head = K.mesh(K.G.hex(0.013, 0.014), 'zinc'); head.position.y = -0.007; plug.add(head);
      var th = K.mesh(K.G.cyl(0.0095, 0.02, 16), 'steelDark'); th.position.y = 0.01; plug.add(th);
      var washer = K.mesh(K.G.torus(0.012, 0.0022, PI * 2, 24), 'copper'); washer.rotation.x = PI / 2; root.add(washer);
      var wg = K.FX.glow(washer, 0x30a46c);
      var tw = K.P.torqueWrench(0.3); tw.rotation.x = PI; tw.scale.setScalar(0.8); var twH = new THREE.Group(); twH.add(tw); tw.position.y = -0.012; root.add(twH);
      var dp = c.userData.drainPos;
      return {
        root: root,
        update: function (t) {
          var w = T.seg(t, 0.3, 1.4), up = T.seg(t, 1.8, 3.4);
          washer.position.set(dp.x, dp.y - 0.12 + w * 0.06 + up * 0.055, dp.z);
          plug.position.set(dp.x, dp.y - 0.06 + up * 0.055, dp.z); plug.rotation.y = up * 12;
          wg(T.between(t, 0.3, 2) ? 0.7 : 0);
          twH.position.set(dp.x, dp.y - 0.005, dp.z); twH.visible = t > 3.6;
          twH.rotation.y = T.seg(t, 3.9, 5.2) * 0.5;
        },
        labels: [
          { text: V('Nové těsnění', 'New seal'), at: function () { return washer.position.clone().add(new THREE.Vector3(0.03, 0, 0)); }, show: [0.3, 3.4], level: 'ok' },
          { text: V('moment dle příručky', 'torque per manual'), at: [dp.x + 0.08, dp.y - 0.05, dp.z], show: [4.2, 7], level: 'accent' }
        ],
        captions: [
          { text: V('Závit čistý, šroub nejdřív rukou', 'Clean thread, start the plug by hand') },
          { text: V('Hliníkové skříně: snadno strhnete závit!', 'Aluminium cases: threads strip easily!'), level: 'danger' }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ fill with hand pump */
  function pumpBottle(K) {
    var g = K.P.oilCan(0x1d1f22);
    var tube = K.mesh(K.G.cyl(0.012, 0.18, 12), 'plasticWhite'); tube.position.set(0.06, 0.38, 0); g.add(tube);
    var handle = new THREE.Group(); handle.position.set(0.06, 0.48, 0);
    var rod = K.mesh(K.G.cyl(0.005, 0.12, 8), 'chrome'); handle.add(rod);
    var t2 = K.mesh(K.G.rbox(0.09, 0.02, 0.03, 0.008), 'toolYellow'); t2.position.y = 0.06; handle.add(t2);
    g.add(handle); g.userData.handle = handle;
    return g;
  }
  R('drive.pump', {
    duration: 9, camera: { pos: [0.65, 0.55, 1.3], target: [0.2, 0.33, 0.1], fov: 36 }, shadow: 1, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), c = gearCase(K, { see: true }); root.add(c);
      c.userData.fill.visible = false;
      var pb = pumpBottle(K); pb.position.set(0.5, 0, 0.25); root.add(pb);
      var fp = c.userData.fillPos;
      var hose = K.mesh(K.G.tube([[0.56, 0.5, 0.25], [0.5, 0.62, 0.25], [0.3, 0.6, 0.25], [fp.x + 0.02, fp.y + 0.01, fp.z + 0.05], [fp.x, fp.y, fp.z - 0.005]], 0.006), K.M.clone('glassClear', { opacity: 0.5 })); root.add(hose);
      var drops = K.FX.drops(K.M.oil, 6, 0.4, 0.006); drops.group.position.set(fp.x, fp.y - 0.012, fp.z + 0.01); root.add(drops.group);
      return {
        root: root,
        update: function (t) {
          pb.userData.handle.position.y = 0.48 + Math.abs(Math.sin(t * 3)) * 0.05 * (t < 6.4 ? 1 : 0);
          var lvl = c.userData.levelAtHole;
          setLevel(c, 0.08 + (lvl + 0.01 - 0.08) * T.lin(t, 0.3, 6.4));
          drops.update(t, t > 6.2 && t < 8.6);
        },
        labels: [{ text: V('Začne vytékat = plno', 'Starts to overflow = full'), at: [fp.x + 0.05, fp.y - 0.06, fp.z + 0.02], show: [6.3, 9], level: 'ok' }],
        captions: [{ text: V('Plnit ruční pumpou plnicím otvorem', 'Fill through the fill hole with a hand pump') }]
      };
    }
  });

  /* ------------------------------------------------------------------ level at fill hole */
  R('drive.level', {
    duration: 7, camera: { pos: [0.5, 0.5, 0.65], target: [0.06, 0.43, 0.08], fov: 34 }, shadow: 0.8, thumbT: 4.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), c = gearCase(K, { see: true }); root.add(c);
      c.userData.fill.visible = false;
      var line = K.mesh(K.G.box(0.44, 0.002, 0.27), K.M.clone('hiOk', { transparent: true, opacity: 0.5 })); line.position.set(0, CY + FILL_Y - 0.009, 0); line.userData.noShadow = true; root.add(line);
      var hand = new THREE.Group(); var nitrile = K.M.clone('toolBlue', { roughness: 0.85 });
      var finger = K.mesh(K.G.cylZ(0.0075, 0.09, 16), nitrile); finger.position.z = 0.045; hand.add(finger);
      var tipS = K.mesh(K.G.sphere(0.0075, 12), nitrile); hand.add(tipS);
      var palm = K.mesh(K.G.rbox(0.07, 0.03, 0.08, 0.012), nitrile); palm.position.set(0.0, -0.005, 0.12); hand.add(palm);
      root.add(hand);
      var fp = c.userData.fillPos;
      var drops = K.FX.drops(K.M.oil, 4, 0.35, 0.006); drops.group.position.set(fp.x, fp.y - 0.012, fp.z + 0.01); root.add(drops.group);
      return {
        root: root,
        update: function (t) {
          setLevel(c, c.userData.levelAtHole + 0.02 * (1 - T.seg(t, 0.5, 3)));
          drops.update(t, t < 3);
          var k = T.seg(t, 3.4, 4.4) * (1 - T.seg(t, 6.2, 6.8));
          hand.position.set(fp.x, fp.y - 0.003, fp.z + 0.1 - k * 0.11);
        },
        labels: [
          { text: V('Hladina = spodní hrana otvoru', 'Level = lower edge of the hole'), at: [fp.x - 0.2, fp.y - 0.012, fp.z], level: 'ok' },
          { text: V('prst nahmatá olej', 'finger touches the oil'), at: [fp.x, fp.y + 0.04, fp.z + 0.04], show: [4.2, 6.4] }
        ],
        captions: [
          { text: V('Vůz musí stát VODOROVNĚ', 'Car must be LEVEL'), level: 'danger' },
          { text: V('Přebytek nechat odkapat, pak zašroubovat', 'Let the excess drip out, then refit the plug') }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ ATF temperature window */
  R('drive.atfTemp', {
    duration: 8, camera: { pos: [0.12, 0.45, 0.62], target: [0, 0.32, 0], fov: 34 }, shadow: 0.7, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), F3 = S.f3 || {};
      var win = { 'mb-cl500-c216': V('≈ 80 °C (XENTRY)', '≈ 80 °C (XENTRY)'), 'volvo-xc60-b4': V('okno dle VIDA', 'window per VIDA') }[ctx.vehicle] || V('okno dle výrobce', 'maker\'s window');
      var title = S.t(V('Teplota ATF', 'ATF temperature')), winT = S.t(win), inWin = S.t(V('V okně → měřit hladinu', 'In window → check level'));
      var dev = F3.scanTool(K, function (c, W, H, st) {
        st = st || 0;
        F3.screenBase(c, W, H, title);
        var x0 = W * 0.1, w = W * 0.8, y = H * 0.38, h = H * 0.09;
        c.fillStyle = '#3a4250'; c.fillRect(x0, y, w, h);
        c.fillStyle = 'rgba(48,164,108,.55)'; c.fillRect(x0 + w * 0.55, y - h * 0.4, w * 0.15, h * 1.8);
        c.fillStyle = st >= 0.55 && st <= 0.7 ? '#30a46c' : '#e5484d'; c.fillRect(x0, y, w * st, h);
        c.fillStyle = '#fff'; c.font = 'bold ' + Math.round(H * 0.06) + 'px system-ui, Arial'; c.textAlign = 'center';
        c.fillText(Math.round(20 + st * 100) + ' °C', W / 2, H * 0.58);
        c.fillStyle = '#f5a524'; c.fillText(winT, W / 2, H * 0.7);
        if (st >= 0.55) { c.fillStyle = '#30a46c'; c.fillText(inWin, W / 2, H * 0.84); }
      }, 0);
      dev.position.set(0, 0.33, 0); dev.rotation.x = -0.22; root.add(dev);
      return {
        root: root,
        update: function (t) { dev.userData.screen.userData.redraw(Math.round(T.seg(t, 0.4, 5) * 0.62 * 50) / 50); },
        captions: [
          { text: V('Motor běží, P, vůz vodorovně', 'Engine running, P, car level') },
          { text: V('Přepad: přebytek vyteče, když je hladina OK', 'Overflow: excess drips out when level is OK'), show: [4, 8] },
          { text: V('Bez diagnostiky hladinu automatu NEHÁDAT', 'Do NOT guess AT level without a scan tool'), level: 'danger' }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ test drive */
  R('drive.test', {
    duration: 8, camera: { pos: [3.4, 1.6, 5.2], target: [0, 0.5, 0], fov: 34 }, shadow: 3.5, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var road = K.mesh(K.G.box(40, 0.01, 4), K.M.clone('plasticTex', { color: 0x2c2f33 })); road.position.y = 0.002; road.receiveShadow = true; root.add(road);
      var dashes = new THREE.Group(); root.add(dashes);
      for (var i = 0; i < 16; i++) { var dsh = K.mesh(K.G.box(1.2, 0.012, 0.1), 'plasticWhite'); dsh.position.set(-20 + i * 2.6, 0.004, 1.5); dashes.add(dsh); }
      var c = K.car(ctx.vehicle); root.add(c.group);
      return {
        root: root,
        cameraPath: ctx.vehicle === 'citroen-jumper-22hdi' ? function () { return { pos: [5.6, 2.6, 7.4], target: [0, 1.0, 0] }; } : null,
        update: function (t) {
          var dist = t * 6;
          dashes.position.x = -(dist % 2.6);
          c.wheels.forEach(function (w) { w.wheel.rotation.z = -dist / c.dims.wr * (w.side > 0 ? 1 : -1); });
        },
        captions: [
          { text: V('Zkušební jízda 10–20 km', 'Test drive 10–20 km') },
          { text: V('✔ Řazení hladké', '✔ Smooth shifting'), show: [1.5, 8], level: 'ok' },
          { text: V('✔ Bez hluku / vytí', '✔ No noise / whine'), show: [3.0, 8], level: 'ok' },
          { text: V('✔ Zátky suché – kontrola těsnosti', '✔ Plugs dry – leak check'), show: [4.5, 8], level: 'ok' }
        ]
      };
    }
  });
})(window.STU);
