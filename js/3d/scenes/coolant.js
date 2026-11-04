/* 3D scenes: coolant check & change. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  function coolMat(K, vid) {
    if (vid === 'skoda-octavia-rs-tdi') return K.M.coolantViolet;
    if (vid === 'toyota-gr-yaris') return K.M.coolantPink;
    return K.M.coolantBlue;
  }
  function levelBox(K, w, h, d, mat) { var g = K.G.box(w, h, d); g.translate(0, h / 2, 0); return K.mesh(g, mat); }
  function wp(obj, off) { var v = obj.getWorldPosition(new THREE.Vector3()); if (off) v.add(new THREE.Vector3(off[0], off[1], off[2])); return v; }

  /** Translucent expansion tank with liquid, MIN/MAX marks and cap. Origin = tank bottom centre.
   *  returns group with userData {setLevel(k 0..1 of height), cap, minY, maxY, neckTop} */
  function reservoir(K, mat, o) {
    o = o || {};
    var w = o.w || 0.16, h = o.h || 0.2, d = o.d || 0.12;
    var g = new THREE.Group();
    var shell = K.mesh(K.G.rbox(w, h, d, 0.02), K.M.clone('plasticWhite', { transparent: true, opacity: 0.32, roughness: 0.25, depthWrite: false }));
    shell.position.y = h / 2; shell.renderOrder = 2; g.add(shell);
    var liq = levelBox(K, w - 0.016, h - 0.02, d - 0.016, mat); liq.position.y = 0.008; liq.renderOrder = 1; g.add(liq);
    var minY = h * 0.3, maxY = h * 0.62;
    [[minY, 'MIN'], [maxY, 'MAX']].forEach(function (m) {
      var line = K.mesh(K.G.box(w * 0.4, 0.004, 0.002), 'plasticBlack'); line.position.set(-w * 0.18, m[0], d / 2 + 0.001); g.add(line);
    });
    var neck = K.mesh(K.G.cyl(0.026, 0.03, 32), K.M.clone('plasticWhite', { transparent: true, opacity: 0.5 })); neck.position.y = h + 0.012; g.add(neck);
    var cap = new THREE.Group();
    var cb = K.mesh(K.G.cyl(0.032, 0.026, 32), 'plasticBlack'); cap.add(cb);
    for (var i = 0; i < 10; i++) { var rib = K.mesh(K.G.box(0.006, 0.024, 0.006), 'plasticBlack'); var a = i / 10 * PI * 2; rib.position.set(Math.cos(a) * 0.032, 0, Math.sin(a) * 0.032); cap.add(rib); }
    var warn = K.mesh(K.G.cyl(0.02, 0.002, 24), 'toolYellow'); warn.position.y = 0.014; cap.add(warn);
    cap.position.y = h + 0.038; g.add(cap);
    var hose = K.mesh(K.G.tube([[w / 2 - 0.02, 0.02, 0], [w / 2 + 0.06, 0.0, 0], [w / 2 + 0.12, -0.12, 0]], 0.011), 'rubber'); g.add(hose);
    g.userData = {
      cap: cap, liq: liq, minY: minY, maxY: maxY, h: h, neckTop: h + 0.026,
      setLevel: function (k) { liq.scale.y = Math.max(0.001, Math.min(1, k)); liq.visible = k > 0.005; }
    };
    g.userData.levelFor = function (y) { return (y - 0.008) / (h - 0.02); };
    return g;
  }

  function gaugeDraw(x, W, H, st) {
    st = st || {};
    var cx = W / 2, cy = H * 0.58, r = Math.min(W, H) * 0.4;
    x.fillStyle = '#11151c'; x.beginPath(); x.arc(cx, cy, r * 1.18, 0, PI * 2); x.fill();
    x.lineWidth = r * 0.12;
    (st.zones || []).forEach(function (z) { x.strokeStyle = z[2]; x.beginPath(); x.arc(cx, cy, r * 0.9, PI * 0.75 + z[0] * PI * 1.5, PI * 0.75 + z[1] * PI * 1.5); x.stroke(); });
    x.strokeStyle = '#d5dbe3'; x.lineWidth = 3;
    for (var i = 0; i <= 10; i++) { var a = PI * 0.75 + i / 10 * PI * 1.5; x.beginPath(); x.moveTo(cx + Math.cos(a) * r * 0.72, cy + Math.sin(a) * r * 0.72); x.lineTo(cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82); x.stroke(); }
    var na = PI * 0.75 + (st.v || 0) * PI * 1.5;
    x.strokeStyle = '#ff5a3c'; x.lineWidth = 6; x.lineCap = 'round';
    x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(na) * r * 0.78, cy + Math.sin(na) * r * 0.78); x.stroke();
    x.fillStyle = '#d5dbe3'; x.beginPath(); x.arc(cx, cy, r * 0.08, 0, PI * 2); x.fill();
    x.font = 'bold ' + Math.round(r * 0.22) + 'px system-ui, sans-serif'; x.textAlign = 'center';
    x.fillText(st.txt || '', cx, cy + r * 0.55);
    if (st.unit) { x.font = Math.round(r * 0.17) + 'px system-ui, sans-serif'; x.fillText(st.unit, cx, cy - r * 0.3); }
  }
  function gauge(K, size, zones, unit) {
    var g = new THREE.Group();
    g.add(K.mesh(K.G.cylZ(size * 0.56, 0.03, 48), 'blackGloss'));
    var ring = K.mesh(K.G.torus(size * 0.56, 0.008, PI * 2, 48), 'chrome'); ring.position.z = 0.015; g.add(ring);
    var p = K.FX.canvasPanel(size, size, gaugeDraw, { px: 256, state: { v: 0, zones: zones, unit: unit } });
    p.position.z = 0.0155; g.add(p);
    return { group: g, set: function (v, txt) { p.userData.redraw({ v: Math.round(v * 60) / 60, txt: txt || '', zones: zones, unit: unit }); } };
  }
  /** Coolant jug (concentrate / premix). bottom at y=0, spout towards +X */
  function jug(K, color, label, flip) {
    var f = flip ? -1 : 1;
    var g = new THREE.Group();
    var m = K.M.clone('plasticWhite', { color: color, roughness: 0.4 });
    var b = K.mesh(K.G.rbox(0.16, 0.24, 0.1, 0.025), m); b.position.y = 0.12; g.add(b);
    var neck = K.mesh(K.G.cyl(0.018, 0.035, 20), m); neck.position.set(f * 0.05, 0.255, 0); g.add(neck);
    var cap = K.mesh(K.G.cyl(0.021, 0.018, 20), 'plasticBlack'); cap.position.set(f * 0.05, 0.28, 0); g.add(cap);
    var h = K.mesh(K.G.rbox(0.05, 0.025, 0.025, 0.008), m); h.position.set(-f * 0.04, 0.25, 0); g.add(h);
    if (label) {
      var p = K.FX.canvasPanel(0.12, 0.09, function (x, W, H) {
        x.fillStyle = '#f4f4f2'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#1b1d22'; x.textAlign = 'center'; x.font = 'bold 44px system-ui';
        var lines = label.split('\n'); lines.forEach(function (l, i) { x.fillText(l, W / 2, H / 2 - (lines.length - 1) * 26 + i * 52 + 14); });
      }, { px: 256 });
      p.position.set(0, 0.12, 0.051); g.add(p);
    }
    g.userData.spout = new THREE.Vector3(f * 0.05, 0.28, 0);
    return g;
  }
  /** Cross-flow radiator facing +Z, centred, bottom at y=0. */
  function radiator(K) {
    var g = new THREE.Group();
    var core = K.mesh(K.G.box(0.6, 0.38, 0.03), 'alu'); core.position.y = 0.21; g.add(core);
    for (var i = 0; i < 38; i++) { var f = K.mesh(K.G.box(0.004, 0.37, 0.032), 'steelDark'); f.position.set(-0.29 + i * 0.0157, 0.21, 0.0); g.add(f); }
    [-1, 1].forEach(function (s) { var tank = K.mesh(K.G.rbox(0.05, 0.44, 0.06, 0.012), 'plasticBlack'); tank.position.set(s * 0.325, 0.21, 0); g.add(tank); });
    var hoseUp = K.mesh(K.G.tube([[0.33, 0.38, 0.02], [0.42, 0.42, 0.06], [0.5, 0.44, 0.0]], 0.02), 'rubber'); g.add(hoseUp);
    var hoseLo = K.mesh(K.G.tube([[-0.33, 0.06, 0.02], [-0.42, 0.03, 0.08], [-0.52, 0.05, 0.02]], 0.02), 'rubber'); g.add(hoseLo);
    var cock = new THREE.Group();
    var cb = K.mesh(K.G.cylZ(0.012, 0.03, 20), 'plasticWhite'); cock.add(cb);
    var wing = K.mesh(K.G.box(0.04, 0.012, 0.01), 'plasticWhite'); wing.position.z = 0.018; cock.add(wing);
    cock.position.set(0.31, 0.02, 0.035); g.add(cock);
    g.userData = { cock: cock, drain: new THREE.Vector3(0.31, 0.0, 0.05) };
    return g;
  }
  function bubbles(K, n) {
    var g = new THREE.Group(), list = [];
    var m = K.M.clone('glassClear', { opacity: 0.6 });
    for (var i = 0; i < n; i++) { var b = K.mesh(K.G.sphere(0.0035, 10), m); b.userData.o = i / n; g.add(b); list.push(b); }
    return {
      group: g,
      update: function (t, on, rise) {
        list.forEach(function (b) {
          var k = (t * 0.9 + b.userData.o) % 1;
          b.visible = !!on;
          b.position.set(Math.sin(b.userData.o * 20) * 0.01, k * (rise || 0.15), Math.cos(b.userData.o * 13) * 0.01);
          b.scale.setScalar(0.6 + k);
        });
      }
    };
  }

  /* ------------------------------------------------------------ coolant.hot */
  R('coolant.hot', {
    duration: 7, camera: { pos: [0.95, 0.8, 1.15], target: [0.0, 0.4, 0], fov: 36 }, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var blockG = K.mesh(K.G.rbox(0.5, 0.36, 0.34, 0.03), 'aluCast'); blockG.position.set(-0.25, 0.18, 0); root.add(blockG);
      var res = reservoir(K, coolMat(K, ctx.vehicle)); res.position.set(0.15, 0.25, 0); res.userData.setLevel(0.55); root.add(res);
      var bracket = K.mesh(K.G.box(0.2, 0.25, 0.14), 'plasticTex'); bracket.position.set(0.15, 0.125, 0); root.add(bracket);
      var steam = K.FX.puff(0xe8eef4, 18, 0.06, 0.35); steam.group.position.set(0.15, 0.55, 0); root.add(steam.group);
      var g = gauge(K, 0.22, [[0, 0.3, '#3e8ed0'], [0.3, 0.7, '#30a46c'], [0.75, 1, '#e5484d']], '°C');
      g.group.position.set(-0.25, 0.62, 0.12); g.group.rotation.y = 0.4; root.add(g.group);
      var hand = K.P.glove(); hand.scale.setScalar(0.9); root.add(hand);
      return {
        root: root,
        update: function (t) {
          g.set(0.82, '105 °C');
          steam.update(t, true);
          var reach = T.seg(t, 1.0, 2.2) - T.seg(t, 3.0, 3.8);
          hand.position.set(0.15 + 0.32 * (1 - reach), 0.6 + 0.04 * (1 - reach), 0.05);
          hand.rotation.set(0, -PI / 2, PI / 2);
          hand.visible = t > 0.8 && t < 4;
        },
        labels: [
          { text: V('✖ NIKDY neotvírat za tepla!', '✖ NEVER open when hot!'), at: function () { return wp(res.userData.cap, [0, 0.07, 0]); }, level: 'danger', show: [2, 7] },
          { text: V('pod tlakem ~1,4 bar', 'pressurised ~1.4 bar'), at: function () { return wp(res, [0, 0.12, 0.08]); }, show: [3.5, 7] }
        ],
        captions: [
          { text: V('Horký systém je pod tlakem – NIKDY neotvírat!', 'A hot system is under pressure – NEVER open it!'), level: 'danger' },
          { text: V('Jen za studena, víčko povolit pomalu přes hadr', 'Only when cold, open the cap slowly with a rag'), show: [3.5, 7] }
        ]
      };
    }
  });

  /* ---------------------------------------------------------- coolant.level */
  R('coolant.level', {
    duration: 6, camera: { pos: [0.28, 0.27, 0.52], target: [0, 0.13, 0], fov: 34 }, shadow: 0.5, thumbT: 2,
    build: function (ctx, K) {
      var res = reservoir(K, coolMat(K, ctx.vehicle)); var root = new THREE.Group(); root.add(res);
      var lv = res.userData.levelFor((res.userData.minY + res.userData.maxY) / 2);
      return {
        root: root,
        update: function (t) { res.userData.setLevel(lv + Math.sin(t * 2) * 0.01); },
        labels: [
          { text: 'MAX', at: function () { return wp(res, [-0.05, res.userData.maxY + 0.012, 0.07]); }, level: 'ok' },
          { text: 'MIN', at: function () { return wp(res, [-0.05, res.userData.minY + 0.012, 0.07]); }, level: 'danger' }
        ],
        captions: [
          { text: V('Kontrola za studena, vůz na rovině', 'Check when cold, car on level ground') },
          { text: V('Hladina mezi MIN a MAX', 'Level between MIN and MAX'), level: 'info' }
        ]
      };
    }
  });

  /* ----------------------------------------------------------- coolant.test */
  R('coolant.test', {
    duration: 8, camera: { pos: [0.22, 0.3, 0.5], target: [0.14, 0.15, 0], fov: 38 }, shadow: 0.5, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var refr = new THREE.Group();
      var tube = K.mesh(K.G.cylX(0.016, 0.18, 32), 'alu'); tube.position.x = 0.09; refr.add(tube);
      var grip = K.mesh(K.G.cylX(0.019, 0.06, 32), 'rubber'); grip.position.x = 0.12; refr.add(grip);
      var eye = K.mesh(K.G.cylX(0.014, 0.03, 32), 'plasticBlack'); eye.position.x = 0.195; refr.add(eye);
      var prism = K.mesh(K.G.box(0.04, 0.006, 0.026), K.M.clone('glassClear', { color: 0x9fd3f2, opacity: 0.6 })); prism.position.set(-0.015, 0.012, 0); refr.add(prism);
      var lid = new THREE.Group(); var lp = K.mesh(K.G.box(0.04, 0.004, 0.026), K.M.clone('plasticWhite', { transparent: true, opacity: 0.6 })); lp.position.x = -0.02; lid.add(lp);
      lid.position.set(0.005, 0.017, 0); refr.add(lid);
      refr.position.set(0, 0.1, 0); refr.rotation.z = 0.05; root.add(refr);
      var pip = new THREE.Group();
      var pt = K.mesh(K.G.cyl(0.004, 0.09, 12, 0.0015), K.M.clone('glassClear', { opacity: 0.5 })); pt.position.y = 0.045; pip.add(pt);
      var bulb = K.mesh(K.G.sphere(0.012, 16), 'rubber'); bulb.position.y = 0.1; bulb.scale.y = 1.4; pip.add(bulb);
      root.add(pip);
      var drop = K.mesh(K.G.sphere(0.004, 12), coolMat(K, ctx.vehicle)); root.add(drop);
      var limitTxt = S.t(V('hranice = bod tuhnutí', 'boundary = freezing point'));
      var view = K.FX.canvasPanel(0.12, 0.12, function (x, W, H, st) {
        x.fillStyle = '#0b0e12'; x.fillRect(0, 0, W, H);
        x.save(); x.beginPath(); x.arc(W / 2, H / 2, W * 0.46, 0, PI * 2); x.clip();
        var b = H * (0.25 + 0.4 * (st.k || 0));
        x.fillStyle = '#2f7fd6'; x.fillRect(0, 0, W, b); x.fillStyle = '#f2f6fb'; x.fillRect(0, b, W, H - b);
        x.strokeStyle = '#111'; x.lineWidth = 3; x.font = 'bold 18px system-ui'; x.fillStyle = '#111'; x.textAlign = 'left';
        for (var i = 0; i <= 5; i++) { var y = H * (0.15 + i * 0.14); x.beginPath(); x.moveTo(W * 0.62, y); x.lineTo(W * 0.72, y); x.stroke(); x.fillText((-10 - i * 10) + '°', W * 0.74, y + 6); }
        x.restore();
        x.fillStyle = '#f5a524'; x.font = 'bold 16px system-ui'; x.textAlign = 'center'; x.fillText(limitTxt, W / 2, H - 8);
      }, { px: 256, state: { k: 0 } });
      view.position.set(0.32, 0.2, 0); view.rotation.y = -0.5; root.add(view);
      return {
        root: root,
        update: function (t) {
          var come = T.seg(t, 0.3, 1.2), go = T.seg(t, 2.2, 3.0);
          pip.position.set(-0.015, 0.14 + (1 - come) * 0.08 + go * 0.1, 0);
          pip.visible = t < 3.1;
          var fall = T.seg(t, 1.3, 1.8);
          drop.position.set(-0.015, 0.14 - fall * 0.03, 0); drop.visible = t > 1.2 && t < 1.85;
          lid.rotation.z = 1.0 * (1 - T.seg(t, 2.0, 2.6)) * (t > 0 ? 1 : 0);
          view.visible = t > 3.2;
          view.userData.redraw({ k: Math.round(T.seg(t, 3.4, 5.2) * 20) / 20 });
        },
        labels: [
          { text: V('kapka na hranol', 'drop on the prism'), at: [-0.015, 0.16, 0.02], show: [1.0, 2.6], level: 'accent' },
          { text: V('cíl: −25 až −35 °C', 'target: −25 to −35 °C'), at: function () { return view.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.075, 0)); }, show: [5.2, 8], level: 'ok' }
        ],
        captions: [
          { text: V('Měření mrazuvzdornosti refraktometrem', 'Measuring freeze protection with a refractometer') },
          { text: V('Hranice modré = bod tuhnutí', 'Edge of the blue = freezing point'), level: 'info', show: [3.4, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ coolant.mix */
  R('coolant.mix', {
    duration: 8, camera: { pos: [0.15, 0.38, 0.85], target: [0.05, 0.16, 0], fov: 36 }, shadow: 0.8, thumbT: 5.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), mat = coolMat(K, ctx.vehicle);
      var premixed = ctx.vehicle === 'toyota-gr-yaris';
      if (premixed) {
        var j = jug(K, 0xf0a7c0, 'Toyota\nSLLC 50 %'); j.position.set(-0.12, 0, 0); root.add(j);
        var water = jug(K, 0xdbefff, 'H₂O'); water.position.set(0.16, 0, 0); root.add(water);
        var cross = new THREE.Group();
        [1, -1].forEach(function (s) { var b = K.mesh(K.G.box(0.2, 0.025, 0.02), 'hiDanger'); b.rotation.z = s * PI / 4; cross.add(b); });
        cross.position.set(0.16, 0.13, 0.08); root.add(cross);
        return {
          root: root,
          update: function (t) { cross.visible = t > 1 && Math.sin(t * 5) > -0.7; },
          labels: [{ text: V('NEŘEDIT vodou', 'DO NOT dilute'), at: [0.16, 0.3, 0.05], level: 'danger', show: [1, 8] },
            { text: V('předmíchaná 50 %', 'pre-mixed 50 %'), at: [-0.12, 0.32, 0.05], level: 'ok' }],
          captions: [
            { text: V('Toyota: kapalina je již namíchaná', 'Toyota: the coolant comes pre-mixed') },
            { text: V('Typ ověřte v příručce / u prodejce', 'Verify the type in the manual / with the dealer'), level: 'info', show: [2, 8] }
          ]
        };
      }
      var conc = jug(K, 0xf2f2f2, S.t(V('koncentrát', 'concentrate'))); root.add(conc);
      var water2 = jug(K, 0xdbefff, S.t(V('destil.\nvoda', 'distilled\nwater')), true); root.add(water2);
      var meas = new THREE.Group();
      var shell = K.mesh(K.G.lathe([[0.06, 0], [0.065, 0.22], [0.068, 0.22], [0.063, -0.003], [0, -0.003]], 40), K.M.clone('plasticWhite', { transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide }));
      shell.renderOrder = 2; meas.add(shell);
      var liqA = K.mesh(K.G.cyl(0.058, 0.1, 40), mat); liqA.geometry.translate(0, 0.05, 0); meas.add(liqA);
      var liqB = K.mesh(K.G.cyl(0.058, 0.1, 40), K.M.water); liqB.geometry.translate(0, 0.05, 0); meas.add(liqB);
      var mixed = K.mesh(K.G.cyl(0.058, 0.2, 40), mat); mixed.geometry.translate(0, 0.1, 0); meas.add(mixed);
      meas.position.set(0.05, 0, 0.05); root.add(meas);
      var lip = new THREE.Vector3(0.05, 0.25, 0.05), tilt = 1.9;
      var spx = 0.05 * Math.cos(tilt) + 0.28 * Math.sin(tilt), spy = -0.05 * Math.sin(tilt) + 0.28 * Math.cos(tilt);
      var oL = new THREE.Vector3(lip.x - spx, lip.y + 0.03 - spy, 0.05), oR = new THREE.Vector3(lip.x + spx, lip.y + 0.03 - spy, 0.05);
      var spoutL = new THREE.Vector3(lip.x, lip.y + 0.03, 0.05);
      var st = K.FX.stream(spoutL, spoutL.clone().add(new THREE.Vector3(0, -0.02, 0)), new THREE.Vector3(0.05, 0.02, 0.05), mat, 0.006); root.add(st.mesh);
      var st2 = K.FX.stream(spoutL, spoutL.clone().add(new THREE.Vector3(0, -0.02, 0)), new THREE.Vector3(0.05, 0.02, 0.05), K.M.water, 0.006); root.add(st2.mesh);
      function pourPose(j, k, side, o) {
        var rest = new THREE.Vector3(side > 0 ? -0.24 : 0.34, 0, -0.06);
        j.position.copy(rest).lerp(o, k);
        j.rotation.z = -side * tilt * k;
      }
      return {
        root: root,
        update: function (t) {
          var a = T.seg(t, 0.3, 1.0) * (1 - T.seg(t, 2.6, 3.2)), b = T.seg(t, 3.4, 4.1) * (1 - T.seg(t, 5.6, 6.2));
          pourPose(conc, a, 1, oL); pourPose(water2, b, -1, oR);
          st.set(T.seg(t, 0.9, 1.1) * (1 - T.seg(t, 2.4, 2.6)));
          st2.set(T.seg(t, 4.0, 4.2) * (1 - T.seg(t, 5.4, 5.6)));
          liqA.scale.y = Math.max(0.001, T.lin(t, 1.0, 2.5)); liqA.visible = t < 6.2;
          liqB.position.y = 0.1 * liqA.scale.y; liqB.scale.y = Math.max(0.001, T.lin(t, 4.1, 5.5)); liqB.visible = t > 4.1 && t < 6.2;
          mixed.visible = t >= 6.2;
        },
        labels: [
          { text: '1 : 1 ≈ −35 °C', at: function () { return wp(meas, [0, 0.26, 0]); }, level: 'accent', show: [5.5, 8] }
        ],
        captions: [
          { text: V('Jen předepsaný typ + destilovaná voda', 'Only the specified type + distilled water') },
          { text: V('Typy nemíchat!', 'Never mix coolant types!'), level: 'danger' }
        ]
      };
    }
  });

  /* ---------------------------------------------------------- coolant.drain */
  R('coolant.drain', {
    duration: 9, camera: { pos: [0.85, 0.75, 1.5], target: [0.02, 0.3, 0], fov: 36 }, shadow: 1, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), mat = coolMat(K, ctx.vehicle);
      var rad = radiator(K); rad.position.y = 0.18; root.add(rad);
      [-1, 1].forEach(function (s) { var leg = K.mesh(K.G.box(0.04, 0.18, 0.08), 'steelDark'); leg.position.set(s * 0.25, 0.09, 0); root.add(leg); });
      var res = reservoir(K, mat); res.position.set(-0.45, 0.5, -0.05); root.add(res);
      var pan = K.P.drainPan(0.18, 0.07); pan.position.set(0.31, 0, 0.18); root.add(pan);
      var liq = pan.children.filter(function (c) { return c.material === K.M.oilOld; })[0];
      if (liq) liq.material = mat;
      var drainW = rad.userData.drain.clone().add(new THREE.Vector3(0, 0.18, 0));
      var st = K.FX.stream(drainW, [0.31, 0.16, 0.12], [0.31, 0.04, 0.18], mat, 0.006); root.add(st.mesh);
      var cap = res.userData.cap, capBase = cap.position.clone();
      return {
        root: root,
        update: function (t) {
          var open = T.seg(t, 0.3, 1.2);
          cap.position.copy(capBase).add(new THREE.Vector3(0.08 * open, 0.04 * open, 0)); cap.rotation.y = open * PI;
          rad.userData.cock.rotation.z = T.seg(t, 1.4, 2.2) * PI / 2;
          var flow = T.seg(t, 2.2, 2.6) * (1 - T.seg(t, 7.6, 8.2));
          st.set(flow);
          var d = T.lin(t, 2.4, 8.0);
          res.userData.setLevel(0.55 * (1 - d));
          pan.userData.setLevel(d * 0.8);
          if (t > 8.7) { res.userData.setLevel(0.55); pan.userData.setLevel(0); }
        },
        labels: [
          { text: V('víčko nádobky otevřít', 'open the tank cap'), at: function () { return wp(res, [0, 0.32, 0]); }, show: [0.2, 2.2] },
          { text: V('vypouštěcí kohout', 'drain cock'), at: function () { return wp(rad.userData.cock, [0, 0.05, 0]); }, show: [1.2, 4], level: 'accent' },
          { text: V('zachytit vše!', 'catch it all!'), at: function () { return wp(pan, [0, 0.12, 0]); }, show: [4, 9], level: 'danger' }
        ],
        captions: [
          { text: V('Studený motor · víčko otevřít · vypustit', 'Cold engine · open the cap · drain') },
          { text: V('Chladicí kapalina je jed – sladká chuť láká zvířata!', 'Coolant is poison – its sweet taste attracts animals!'), level: 'danger', show: [2.5, 9] }
        ]
      };
    }
  });

  /* ----------------------------------------------------------- coolant.fill */
  R('coolant.fill', {
    duration: 9, camera: { pos: [0.4, 0.45, 0.7], target: [0.02, 0.24, 0], fov: 36 }, shadow: 0.8, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), mat = coolMat(K, ctx.vehicle);
      var res = reservoir(K, mat); root.add(res);
      res.userData.cap.visible = false;
      var j = jug(K, ctx.vehicle === 'toyota-gr-yaris' ? 0xf0a7c0 : 0xf2f2f2); root.add(j);
      var tilt = 2.0;
      var sp = j.userData.spout, sx = sp.x * Math.cos(tilt) - sp.y * Math.sin(tilt), sy = sp.x * Math.sin(tilt) + sp.y * Math.cos(tilt);
      var neckTop = new THREE.Vector3(0, res.userData.neckTop, 0);
      var origin = new THREE.Vector3(neckTop.x - sx + 0.01, neckTop.y + 0.07 - sy, 0);
      var spoutW = origin.clone().add(new THREE.Vector3(sx, sy, 0));
      var st = K.FX.stream(spoutW, spoutW.clone().add(new THREE.Vector3(-0.005, 0.01, 0)), neckTop, mat, 0.006); root.add(st.mesh);
      var bub = bubbles(K, 10); bub.group.position.set(0.0, 0.05, 0); root.add(bub.group);
      var full = res.userData.levelFor(res.userData.maxY);
      return {
        root: root,
        update: function (t) {
          var tl = T.seg(t, 0.3, 1.1) * (1 - T.seg(t, 7.4, 8.2));
          j.rotation.z = tl * tilt; j.position.copy(origin).add(new THREE.Vector3(0.05 * (1 - tl), 0.04 * (1 - tl), 0));
          st.set(T.seg(t, 1.0, 1.3) * (1 - T.seg(t, 7.0, 7.4)));
          var lvl = T.keys(t, [[1.2, 0.1], [3.4, full * 0.95], [4.4, full * 0.6], [6.8, full], [9, full]]);
          res.userData.setLevel(t < 1.2 ? 0.1 : lvl);
          bub.update(t, t > 3.4 && t < 5.2, 0.12);
        },
        labels: [
          { text: V('hladina klesá = vzduch uniká', 'level drops = air escaping'), at: function () { return wp(res, [0.12, 0.12, 0.06]); }, show: [3.6, 5.4], level: 'accent' },
          { text: 'MAX', at: function () { return wp(res, [-0.05, res.userData.maxY + 0.012, 0.07]); }, show: [6.4, 9], level: 'ok' }
        ],
        captions: [
          { text: V('Pomalu nalévat – vzduch musí unikat', 'Pour slowly – air must escape') },
          { text: V('Doplňovat, dokud hladina neklesá', 'Keep topping up until the level stops dropping'), level: 'info', show: [4.4, 9] }
        ]
      };
    }
  });

  /* -------------------------------------------------------- coolant.vacuum */
  R('coolant.vacuum', {
    duration: 11, camera: { pos: [0.55, 0.62, 0.95], target: [0.12, 0.28, 0], fov: 38 }, shadow: 1, thumbT: 7.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), mat = coolMat(K, ctx.vehicle);
      var res = reservoir(K, mat); res.userData.cap.visible = false; root.add(res);
      var tool = new THREE.Group();
      var adapt = K.mesh(K.G.cyl(0.034, 0.03, 32), 'plasticBlack'); tool.add(adapt);
      var body = K.mesh(K.G.rbox(0.12, 0.05, 0.05, 0.01), 'alu'); body.position.set(0.0, 0.05, 0); tool.add(body);
      var g = gauge(K, 0.1, [[0, 0.65, '#3e8ed0'], [0.65, 1, '#30a46c']], 'bar');
      g.group.position.set(0, 0.13, 0.0); tool.add(g.group);
      var valve = K.mesh(K.G.cylX(0.008, 0.04, 16), 'toolYellow'); valve.position.set(-0.075, 0.05, 0); tool.add(valve);
      tool.position.set(0, res.userData.neckTop + 0.015, 0); root.add(tool);
      var air = K.mesh(K.G.tube([[0.06, res.userData.neckTop + 0.065, 0], [0.2, res.userData.neckTop + 0.1, 0.05], [0.45, 0.25, 0.1], [0.6, 0.02, 0.15]], 0.008), 'toolYellow'); root.add(air);
      var bucket = new THREE.Group();
      var bs = K.mesh(K.G.lathe([[0.1, 0], [0.12, 0.22], [0.123, 0.22], [0.103, -0.003], [0, -0.003]], 40), K.M.clone('plasticWhite', { transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide })); bs.renderOrder = 2; bucket.add(bs);
      var bl = K.mesh(K.G.cyl(0.098, 0.18, 40, 0.115), mat); bl.geometry.translate(0, 0.09, 0); bucket.add(bl);
      bucket.position.set(-0.35, 0, 0.1); root.add(bucket);
      var hose = K.mesh(K.G.tube([[-0.06, res.userData.neckTop + 0.06, 0], [-0.2, res.userData.neckTop + 0.12, 0.05], [-0.33, 0.3, 0.1], [-0.35, 0.03, 0.1]], 0.007), K.M.clone('glassClear', { opacity: 0.5 })); root.add(hose);
      var full = res.userData.levelFor(res.userData.maxY);
      return {
        root: root,
        update: function (t) {
          var vac = T.seg(t, 0.5, 3.0) * (1 - T.seg(t, 6.0, 9.5));
          g.set(vac * 0.82, '−' + (vac * 0.8).toFixed(1) + ' bar');
          var fill = T.seg(t, 6.0, 9.5);
          res.userData.setLevel(0.02 + fill * (full - 0.02));
          bl.scale.y = 1 - fill * 0.7;
          valve.rotation.x = fill > 0 ? PI / 2 : 0;
        },
        captions: [
          { text: V('1. Vakuum (stlačený vzduch)', '1. Pull vacuum (compressed air)'), show: [0, 3.2], level: 'accent' },
          { text: V('2. Držet – test těsnosti (ručička nesmí klesat)', '2. Hold – leak test (needle must not move)'), show: [3.2, 6], level: 'accent' },
          { text: V('3. Otevřít – kapalina se nasaje bez bublin', '3. Open – coolant is sucked in, no air pockets'), show: [6, 11], level: 'accent' }
        ],
        labels: [
          { text: V('vakuový plnič', 'vacuum filler'), at: function () { return wp(tool, [0, 0.22, 0]); }, show: [0, 3] },
          { text: V('nová kapalina', 'new coolant'), at: function () { return wp(bucket, [0, 0.27, 0]); }, show: [5.5, 11] }
        ]
      };
    }
  });

  /* ---------------------------------------------------------- coolant.bleed */
  R('coolant.bleed', {
    duration: 8, camera: { pos: [0.22, 0.24, 0.38], target: [0, 0.12, 0], fov: 34 }, shadow: 0.5, thumbT: 3.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), mat = coolMat(K, ctx.vehicle);
      var pipe = K.mesh(K.G.tube([[-0.3, 0.06, 0], [0, 0.06, 0], [0.3, 0.07, 0]], 0.022), 'rubber'); root.add(pipe);
      var housing = K.mesh(K.G.rbox(0.09, 0.06, 0.06, 0.012), 'aluCast'); housing.position.set(0, 0.07, 0); root.add(housing);
      var boss = K.mesh(K.G.cyl(0.016, 0.02, 24), 'aluCast'); boss.position.set(0, 0.108, 0); root.add(boss);
      var screw = new THREE.Group();
      var sh = K.mesh(K.G.cyl(0.012, 0.012, 24), 'plasticWhite'); screw.add(sh);
      var slot = K.mesh(K.G.box(0.02, 0.004, 0.003), 'plasticGrey'); slot.position.y = 0.0065; screw.add(slot);
      var stem = K.mesh(K.G.cyl(0.006, 0.015, 16), 'plasticWhite'); stem.position.y = -0.012; screw.add(stem);
      screw.position.set(0, 0.124, 0); root.add(screw);
      var sd = K.P.screwdriver(0.18); sd.rotation.z = -PI / 2; root.add(sd);
      var bub = bubbles(K, 8); bub.group.position.set(0, 0.125, 0); root.add(bub.group);
      var drops = K.FX.drops(mat, 6, 0.1, 0.004); drops.group.position.set(0.016, 0.12, 0); root.add(drops.group);
      var rag = K.mesh(K.G.rbox(0.07, 0.015, 0.06, 0.006), 'fabric'); rag.position.set(0.06, 0.03, 0.05); root.add(rag);
      return {
        root: root,
        update: function (t) {
          var open = T.seg(t, 0.4, 1.6) * (1 - T.seg(t, 6.0, 7.0));
          screw.rotation.y = -open * PI * 1.5; screw.position.y = 0.124 + open * 0.004;
          sd.position.set(0, screw.position.y + 0.007, 0); sd.rotation.set(0, screw.rotation.y, -PI / 2);
          sd.visible = t < 1.8 || (t > 5.8 && t < 7.2);
          bub.update(t, t > 1.8 && t < 4.0, 0.08);
          drops.update(t, t > 4.0 && t < 6.0, 1);
        },
        labels: [
          { text: V('bubliny = vzduch', 'bubbles = air'), at: [0, 0.2, 0.0], show: [1.8, 4], level: 'accent' },
          { text: V('teče čistě → zavřít', 'flows clear → close'), at: [0.02, 0.17, 0.02], show: [4, 7], level: 'ok' }
        ],
        captions: [
          { text: V('Odvzdušňovací šroub povolit, až teče bez bublin', 'Open the bleed screw until it flows without bubbles') },
          { text: V('Šroub je plastový – jen jemně!', 'The screw is plastic – gently!'), level: 'danger', show: [1, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ coolant.run */
  R('coolant.run', {
    duration: 10, camera: { pos: [0.4, 0.55, 1.0], target: [-0.08, 0.38, 0], fov: 38 }, shadow: 1, thumbT: 7.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var dash = K.mesh(K.G.rbox(0.5, 0.26, 0.08, 0.03), 'plasticTex'); dash.position.set(-0.3, 0.55, 0); root.add(dash);
      var g = gauge(K, 0.18, [[0, 0.3, '#3e8ed0'], [0.3, 0.75, '#30a46c'], [0.8, 1, '#e5484d']], '°C');
      g.group.position.set(-0.4, 0.56, 0.045); root.add(g.group);
      var heatTxt = S.t(V('TOPENÍ MAX', 'HEATER MAX'));
      var knob = K.FX.canvasPanel(0.14, 0.14, function (x, W, H) {
        x.fillStyle = '#16181c'; x.fillRect(0, 0, W, H);
        var grd = x.createLinearGradient(20, 0, W - 20, 0); grd.addColorStop(0, '#3e8ed0'); grd.addColorStop(1, '#e5484d');
        x.strokeStyle = grd; x.lineWidth = 14; x.beginPath(); x.arc(W / 2, H / 2 + 10, W * 0.32, PI * 0.8, PI * 2.2); x.stroke();
        x.strokeStyle = '#fff'; x.lineWidth = 8; x.beginPath(); x.moveTo(W / 2, H / 2 + 10); x.lineTo(W / 2 + W * 0.25, H / 2 - 8); x.stroke();
        x.fillStyle = '#fff'; x.font = 'bold 22px system-ui'; x.textAlign = 'center'; x.fillText(heatTxt, W / 2, H - 14);
      }, { px: 256 });
      knob.position.set(-0.17, 0.56, 0.045); root.add(knob);
      var rad = radiator(K); rad.position.set(0.25, 0, -0.1); rad.scale.setScalar(0.8); root.add(rad);
      var fan = new THREE.Group();
      var shroud = K.mesh(K.G.torus(0.13, 0.012, PI * 2, 40), 'plasticBlack'); fan.add(shroud);
      var hub = K.mesh(K.G.cylZ(0.035, 0.03, 24), 'plasticBlack'); fan.add(hub);
      var blades = new THREE.Group();
      for (var i = 0; i < 7; i++) { var b = K.mesh(K.G.box(0.1, 0.035, 0.006), 'plasticBlack'); b.position.x = 0.065; var p = new THREE.Group(); p.add(b); p.rotation.z = i / 7 * PI * 2; b.rotation.x = 0.4; blades.add(p); }
      fan.add(blades); fan.position.set(0.25, 0.17, -0.07); root.add(fan);
      var spin = 0;
      return {
        root: root,
        update: function (t, dt) {
          var k = T.seg(t, 0.5, 6.0);
          var v = 0.15 + k * 0.4 + (t > 7.5 ? -0.03 * T.seg(t, 7.5, 8.5) : 0);
          g.set(v, Math.round(20 + v * 110) + ' °C');
          var on = t > 6.5;
          blades.rotation.z = on ? (t - 6.5) * (8 + Math.min(8, (t - 6.5) * 6)) : 0;
          spin += dt || 0;
        },
        labels: [
          { text: V('ručička ~ do středu', 'needle ~ to the middle'), at: function () { return wp(g.group, [0, 0.13, 0]); }, show: [4.5, 10], level: 'accent' },
          { text: V('ventilátor sepne', 'fan switches on'), at: function () { return wp(fan, [0, 0.18, 0]); }, show: [6.6, 10], level: 'ok' }
        ],
        captions: [
          { text: V('Topení naplno, motor zahřát, sledovat teplotu', 'Heater on max, warm the engine, watch the temperature') },
          { text: V('Ručička do červena = ihned vypnout!', 'Needle into the red = switch off at once!'), level: 'danger', show: [2, 10] }
        ]
      };
    }
  });
})(window.STU);
