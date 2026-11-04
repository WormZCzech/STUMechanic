/* 3D scenes: brake fluid change & bleeding. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  function levelBox(K, w, h, d, mat) { var g = K.G.box(w, h, d); g.translate(0, h / 2, 0); return K.mesh(g, mat); }
  function wp(obj, off) { var v = obj.getWorldPosition(new THREE.Vector3()); if (off) v.add(new THREE.Vector3(off[0], off[1], off[2])); return v; }
  function oldFluid(K) { return K.M.clone('brakeFluid', { color: 0x4a2c10, opacity: 0.85 }); }

  /** Brake fluid reservoir (translucent, MIN/MAX, cap). Origin = bottom centre. */
  function reservoir(K, mat, o) {
    o = o || {};
    var w = 0.13, h = 0.1, d = 0.07;
    var g = new THREE.Group();
    var shell = K.mesh(K.G.rbox(w, h, d, 0.015), K.M.clone('plasticWhite', { transparent: true, opacity: 0.3, roughness: 0.25, depthWrite: false }));
    shell.position.y = h / 2; shell.renderOrder = 2; g.add(shell);
    var liq = levelBox(K, w - 0.014, h - 0.014, d - 0.014, mat); liq.position.y = 0.007; liq.renderOrder = 1; g.add(liq);
    var liq2 = null;
    if (o.second) { liq2 = levelBox(K, w - 0.0141, h - 0.014, d - 0.0141, o.second); liq2.position.y = 0.007; liq2.renderOrder = 1; g.add(liq2); }
    var minY = h * 0.35, maxY = h * 0.75;
    [minY, maxY].forEach(function (y) { var l = K.mesh(K.G.box(w * 0.35, 0.003, 0.002), 'plasticBlack'); l.position.set(-w * 0.2, y, d / 2 + 0.001); g.add(l); });
    var neck = K.mesh(K.G.cyl(0.022, 0.02, 28), K.M.clone('plasticWhite', { transparent: true, opacity: 0.5 })); neck.position.y = h + 0.008; g.add(neck);
    var cap = new THREE.Group();
    var cb = K.mesh(K.G.cyl(0.027, 0.02, 28), 'plasticBlack'); cap.add(cb);
    var sensor = K.mesh(K.G.rbox(0.02, 0.012, 0.02, 0.004), 'plasticGrey'); sensor.position.y = 0.014; cap.add(sensor);
    var wire = K.mesh(K.G.tube([[0, 0.02, 0], [0.04, 0.03, 0], [0.09, 0.0, 0.02]], 0.003), 'plasticBlack'); cap.add(wire);
    cap.position.y = h + 0.026; g.add(cap);
    var mc = K.mesh(K.G.cylX(0.024, 0.16, 28), 'aluCast'); mc.position.set(0.02, -0.03, 0); g.add(mc);
    g.userData = {
      cap: cap, h: h, minY: minY, maxY: maxY, neckTop: h + 0.018,
      lv: function (y) { return (y - 0.007) / (h - 0.014); },
      setLevel: function (k) { liq.scale.y = Math.max(0.001, k); liq.visible = k > 0.003; },
      setLevel2: function (k) { if (liq2) { liq2.scale.y = Math.max(0.001, k); liq2.visible = k > 0.003; } }
    };
    return g;
  }

  /** Disc + floating caliper at hub height. Inboard side (bleed nipple) faces +Z after the flip. */
  function brakeCorner(K, o) {
    o = o || {};
    var g = new THREE.Group();
    var disc = K.P.brakeDisc({ r: 0.15 }); g.add(disc);
    var cal = K.P.caliperFloating({ discR: 0.15, angle: PI * 0.9 }); g.add(cal);
    var hub = K.P.hub(); hub.position.z = 0.045; hub.rotation.y = PI; g.add(hub);
    g.rotation.y = PI;
    g.position.y = o.y == null ? 0.42 : o.y;
    return { group: g, cal: cal, nipple: cal.userData.nipple };
  }
  /** Clear tube from point a to bottle, returns {mesh, curve} */
  function bleedTube(K, a, b, mid) {
    var curve = new THREE.CatmullRomCurve3([a, a.clone().add(new THREE.Vector3(0, 0.05, 0.02)), mid, b]);
    var geo = new THREE.TubeGeometry(curve, 80, 0.006, 10, false);
    var m = K.mesh(geo, K.M.clone('glassClear', { opacity: 0.35, color: 0xdfe8ee }));
    m.userData.noShadow = true;
    return { mesh: m, curve: curve };
  }
  function bottle(K, mat) {
    var g = new THREE.Group();
    var shell = K.mesh(K.G.lathe([[0.04, 0], [0.045, 0.02], [0.045, 0.13], [0.02, 0.16], [0.018, 0.18], [0.016, 0.18], [0.016, 0.16], [0.042, 0.13], [0.042, 0.02], [0.037, 0.003], [0, 0.003]], 32), K.M.clone('plasticWhite', { transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide }));
    shell.renderOrder = 2; g.add(shell);
    var liq = K.mesh(K.G.cyl(0.04, 0.05, 32), mat); liq.geometry.translate(0, 0.025, 0); liq.position.y = 0.004; g.add(liq);
    g.userData.liq = liq;
    return g;
  }
  function spannerOn(K) { var s = K.P.spanner(0.13, 0.0055); return s; }

  /* ------------------------------------------------------------- bleed.why */
  R('bleed.why', {
    duration: 8, camera: { pos: [0.1, 0.32, 0.75], target: [0.05, 0.22, 0], fov: 36 }, shadow: 0.7, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var res = reservoir(K, K.M.brakeFluid); res.position.set(-0.18, 0.12, 0); res.userData.setLevel(0.6); root.add(res);
      var stand = K.mesh(K.G.box(0.3, 0.1, 0.16), 'plasticTex'); stand.position.set(-0.2, 0.05, 0); root.add(stand);
      var drops = []; var wm = K.M.water;
      for (var i = 0; i < 6; i++) { var d = K.mesh(K.G.sphere(0.006, 12), wm); d.userData.o = i / 6; root.add(d); drops.push(d); }
      var t1 = S.t(V('Bod varu kapaliny', 'Fluid boiling point')), t2 = S.t(V('roky', 'years')), t3 = S.t(V('nová', 'new'));
      var chart = K.FX.canvasPanel(0.34, 0.24, function (x, W, H, st) {
        x.fillStyle = '#f7f8fa'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#1b1d22'; x.font = 'bold 26px system-ui'; x.textAlign = 'left'; x.fillText(t1, 20, 34);
        x.strokeStyle = '#8a94a6'; x.lineWidth = 2; x.beginPath(); x.moveTo(60, 50); x.lineTo(60, H - 40); x.lineTo(W - 20, H - 40); x.stroke();
        x.font = '18px system-ui'; x.fillText('260 °C', 4, 70); x.fillText('150 °C', 4, H - 50); x.fillText(t2 + ' 0  1  2  3', 70, H - 12);
        var p = st.p || 0, x0 = 60, y0 = 62, x1 = W - 30, y1 = H - 60;
        x.strokeStyle = '#e5484d'; x.lineWidth = 5; x.beginPath(); x.moveTo(x0, y0);
        for (var k = 0; k <= p * 20; k++) { var u = k / 20; x.lineTo(x0 + (x1 - x0) * u, y0 + (y1 - y0) * (1 - Math.pow(1 - u, 1.6))); }
        x.stroke();
        x.fillStyle = '#30a46c'; x.fillText(t3, x0 + 8, y0 + 20);
        if (p > 0.6) { x.fillStyle = '#e5484d'; x.font = 'bold 20px system-ui'; x.fillText('~155 °C / 2 ' + t2, W * 0.45, H * 0.6); }
      }, { px: 512, state: { p: 0 } });
      chart.position.set(0.17, 0.25, 0); chart.rotation.y = -0.25; root.add(chart);
      var easel = K.mesh(K.G.box(0.02, 0.2, 0.02), 'steelDark'); easel.position.set(0.17, 0.08, -0.02); root.add(easel);
      return {
        root: root,
        update: function (t) {
          drops.forEach(function (d) { var k = (t * 0.4 + d.userData.o) % 1; d.position.set(-0.18 + Math.sin(d.userData.o * 9) * 0.05, 0.42 - k * 0.15, 0.02); d.visible = k < 0.95; });
          chart.userData.redraw({ p: Math.round(T.lin(t, 0.8, 6.0) * 20) / 20 });
        },
        labels: [{ text: V('kapalina saje vlhkost', 'fluid absorbs moisture'), at: [-0.18, 0.46, 0.02], level: 'accent' }],
        captions: [
          { text: V('Voda v kapalině → páry → měkký pedál', 'Water in the fluid → vapour → soft pedal'), level: 'danger' },
          { text: V('Měnit cca každé 2 roky', 'Change approx. every 2 years'), level: 'info', show: [3, 8] }
        ]
      };
    }
  });

  /* ----------------------------------------------------------- bleed.order */
  R('bleed.order', {
    duration: 9, camera: { pos: [-0.5, 6.2, 1.3], target: [0, 0, 0], fov: 40 }, shadow: 3.5, thumbT: 7.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var order = [['r', -1], ['r', 1], ['f', -1], ['f', 1]];
      var names = [V('PZ', 'RR'), V('LZ', 'LR'), V('PP', 'RF'), V('LP', 'LF')];
      var rings = order.map(function (o) {
        var w = c.wheels.filter(function (x) { return x.axle === o[0] && x.side === o[1]; })[0];
        var r = K.mesh(K.G.torus(c.dims.wr + 0.1, 0.045, PI * 2, 48), K.M.clone('hiAccent', { emissiveIntensity: 1.3 }));
        r.rotation.x = PI / 2; r.position.set(w.pivot.position.x, 0.03, w.pivot.position.z + o[1] * 0.25); root.add(r);
        return { ring: r, wheel: w };
      });
      var mc = new THREE.Vector3(c.dims.front - 1.05, c.dims.hoodF + 0.06, 0.45);
      var mark = K.mesh(K.G.sphere(0.06, 20), K.M.clone('hiInfo')); mark.position.copy(mc); root.add(mark);
      var labels = rings.map(function (r, i) {
        return { text: { cs: (i + 1) + '. ' + names[i].cs, en: (i + 1) + '. ' + names[i].en }, at: function () { return r.ring.position.clone().add(new THREE.Vector3(0, 0.2, 0)); }, show: [0.6 + i * 1.8, 9], level: 'accent' };
      });
      labels.push({ text: V('hlavní válec', 'master cylinder'), at: function () { return mc.clone().add(new THREE.Vector3(0, 0.12, 0)); }, level: 'ok' });
      var big = Math.max(1, c.dims.L / 4.6, c.dims.H / 1.6 * 0.85);   // pull back for vans / large vehicles
      return {
        root: root,
        cameraPath: big > 1.01 ? function () { return { pos: [-0.5 * big, 6.2 * big, 1.3 * big], target: [0, c.dims.H * 0.25, 0] }; } : null,
        update: function (t) {
          rings.forEach(function (r, i) {
            var on = t > 0.6 + i * 1.8;
            var cur = on && t < 0.6 + (i + 1) * 1.8;
            r.ring.visible = on;
            r.ring.scale.setScalar(cur ? 1 + 0.08 * Math.sin(t * 8) : 1);
          });
        },
        labels: labels,
        captions: [
          { text: V('Od kola nejdál od hlavního válce k nejbližšímu', 'From the wheel furthest from the master cylinder to the nearest') },
          { text: V('Pořadí ověřte v příručce (ABS/ESP může mít jiné)', 'Verify the order in the manual (ABS/ESP may differ)'), level: 'info', show: [2, 9] }
        ]
      };
    }
  });

  /* ---------------------------------------------------------- bleed.nipple */
  R('bleed.nipple', {
    duration: 9, camera: { pos: [0.02, 0.72, 0.72], target: [0.16, 0.42, 0.06], fov: 38 }, shadow: 1, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bc = brakeCorner(K); root.add(bc.group); root.updateMatrixWorld(true);
      var np = wp(bc.nipple, [0, 0.012, 0]);
      bc.cal.userData.body.children.forEach(function (ch) { if (ch.position.equals && bc.nipple.position && ch !== bc.nipple && ch.position.distanceTo(bc.nipple.position.clone().add(new THREE.Vector3(0, 0.012, 0))) < 0.001) ch.visible = false; });
      var bot = bottle(K, oldFluid(K)); bot.position.set(np.x + 0.25, 0, np.z + 0.15); root.add(bot);
      var tube = bleedTube(K, np, new THREE.Vector3(bot.position.x, 0.03, bot.position.z), new THREE.Vector3(np.x + 0.2, np.y + 0.02, np.z + 0.12));
      root.add(tube.mesh);
      var sp = spannerOn(K); sp.position.copy(np).add(new THREE.Vector3(0, -0.006, 0)); root.add(sp);
      var bubbles = [];
      var bm = K.M.clone('glassClear', { opacity: 0.8, color: 0xffffff });
      for (var i = 0; i < 6; i++) { var b = K.mesh(K.G.sphere(0.004, 10), bm); b.userData.o = i / 6; root.add(b); bubbles.push(b); }
      return {
        root: root,
        update: function (t) {
          var open = T.seg(t, 0.6, 1.4) * (1 - T.seg(t, 7.0, 7.8));
          sp.rotation.y = 0.6 - open * PI / 2;
          bubbles.forEach(function (b) {
            var k = (t * 0.25 + b.userData.o) % 1;
            b.visible = open > 0.9 && t < 6;
            b.position.copy(tube.curve.getPointAt(k));
          });
          bot.userData.liq.scale.y = 0.4 + T.lin(t, 1.5, 7) * 1.0;
        },
        labels: [
          { text: V('¼ otáčky', '¼ turn'), at: function () { return np.clone().add(new THREE.Vector3(0, 0.05, 0)); }, show: [0.5, 2.5], level: 'accent' },
          { text: V('konec hadičky pod hladinou', 'tube end under the fluid'), at: function () { return wp(bot, [0, 0.22, 0]); }, level: 'ok' },
          { text: V('bubliny = vzduch', 'bubbles = air'), at: function () { return tube.curve.getPointAt(0.45).add(new THREE.Vector3(0, 0.04, 0)); }, show: [1.6, 6] }
        ],
        captions: [
          { text: V('Očko klíče, průhledná hadička, láhev', 'Ring spanner, clear tube, bottle') },
          { text: V('Brzdová kapalina leptá lak a oči – brýle!', 'Brake fluid attacks paint and eyes – glasses!'), level: 'danger', show: [3, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------ bleed.pedalCycle */
  R('bleed.pedalCycle', {
    duration: 10, camera: { pos: [0.35, 0.8, 1.5], target: [0.1, 0.3, 0.05], fov: 38 }, shadow: 1.2, thumbT: 3.2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      // pedal box (left)
      var floor = K.mesh(K.G.box(0.4, 0.02, 0.4), 'fabric'); floor.position.set(-0.3, 0.01, 0); root.add(floor);
      var bulk = K.mesh(K.G.box(0.4, 0.5, 0.03), 'plasticTex'); bulk.position.set(-0.3, 0.27, -0.2); root.add(bulk);
      var pedal = new THREE.Group(); pedal.position.set(-0.3, 0.5, -0.17);
      var arm = K.mesh(K.G.box(0.025, 0.4, 0.012), 'steelDark'); arm.position.set(0, -0.2, 0.05); arm.rotation.x = 0.25; pedal.add(arm);
      var pad = K.mesh(K.G.rbox(0.09, 0.06, 0.02, 0.008), 'rubber'); pad.position.set(0, -0.39, 0.12); pad.rotation.x = 0.4; pedal.add(pad);
      root.add(pedal);
      var foot = K.mesh(K.G.rbox(0.1, 0.07, 0.26, 0.03), 'fabric'); root.add(foot);
      // nipple (right)
      var bc = brakeCorner(K, { y: 0.42 }); bc.group.position.x = 0.35; bc.group.scale.setScalar(0.85); root.add(bc.group); root.updateMatrixWorld(true);
      var np = wp(bc.nipple, [0, 0.01, 0]);
      var bot = bottle(K, oldFluid(K)); bot.position.set(np.x + 0.18, 0, np.z + 0.1); root.add(bot);
      var tube = bleedTube(K, np, new THREE.Vector3(bot.position.x, 0.03, bot.position.z), new THREE.Vector3(np.x + 0.15, np.y, np.z + 0.08)); root.add(tube.mesh);
      var sp = spannerOn(K); sp.position.copy(np).add(new THREE.Vector3(0, -0.006, 0)); root.add(sp);
      var flow = []; var fm = K.M.brakeFluid;
      for (var i = 0; i < 8; i++) { var f = K.mesh(K.G.sphere(0.005, 10), fm); f.userData.o = i / 8; root.add(f); flow.push(f); }
      function phase(t) { return t % 5; }
      return {
        root: root,
        update: function (t) {
          var p = phase(t);
          var press = T.seg(p, 0.2, 0.9) * (1 - T.seg(p, 3.6, 4.3));
          var floorK = T.seg(p, 1.4, 2.0) * (1 - T.seg(p, 3.6, 4.3));
          pedal.rotation.x = -(press * 0.25 + floorK * 0.12);
          var pp = new THREE.Vector3(0, -0.39, 0.12).applyEuler(pedal.rotation).add(pedal.position);
          foot.position.copy(pp).add(new THREE.Vector3(0, 0.02, 0.15)); foot.rotation.x = 0.3;
          var open = T.seg(p, 1.1, 1.5) * (1 - T.seg(p, 2.4, 2.8));
          sp.rotation.y = 0.6 - open * PI / 2;
          flow.forEach(function (f) { var k = (t * 0.8 + f.userData.o) % 1; f.visible = open > 0.5; f.position.copy(tube.curve.getPointAt(k)); });
        },
        labels: [
          { text: V('šroubek', 'nipple'), at: function () { return np.clone().add(new THREE.Vector3(0, 0.05, 0)); }, level: 'accent' }
        ],
        captions: [
          { text: V('1. „Sešlápnout a držet!“', '1. "Press and hold!"'), show: function (t) { var p = t % 5; return p < 1.1; }, level: 'accent' },
          { text: V('2. Povolit šroubek ¼ ot. – pedál jde k podlaze', '2. Open the nipple ¼ turn – pedal sinks to the floor'), show: function (t) { var p = t % 5; return p >= 1.1 && p < 2.4; }, level: 'accent' },
          { text: V('3. Šroubek zavřít', '3. Close the nipple'), show: function (t) { var p = t % 5; return p >= 2.4 && p < 3.5; }, level: 'accent' },
          { text: V('4. Teprve pak pustit pedál', '4. Only then release the pedal'), show: function (t) { var p = t % 5; return p >= 3.5; }, level: 'accent' },
          { text: V('Nikdy nepouštět pedál s otevřeným šroubkem!', 'Never release the pedal with the nipple open!'), level: 'danger' }
        ]
      };
    }
  });

  /* -------------------------------------------------------- bleed.pressure */
  R('bleed.pressure', {
    duration: 9, camera: { pos: [0.2, 0.5, 0.95], target: [0.08, 0.25, 0], fov: 38 }, shadow: 0.9, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var res = reservoir(K, K.M.brakeFluid); res.position.set(-0.18, 0.2, 0); res.userData.setLevel(0.7); root.add(res);
      res.userData.cap.visible = false;
      var adapter = K.mesh(K.G.cyl(0.04, 0.025, 32), 'plasticBlack'); adapter.position.set(-0.18, 0.2 + res.userData.neckTop + 0.012, 0); root.add(adapter);
      var shelf = K.mesh(K.G.box(0.35, 0.14, 0.18), 'plasticTex'); shelf.position.set(-0.2, 0.07, 0); root.add(shelf);
      var tank = new THREE.Group();
      var body = K.mesh(K.G.lathe([[0, 0], [0.09, 0], [0.095, 0.02], [0.095, 0.28], [0.06, 0.32], [0, 0.32]], 40), 'toolYellow'); tank.add(body);
      var pumpRod = new THREE.Group();
      var rod = K.mesh(K.G.cyl(0.008, 0.18, 12), 'chrome'); rod.position.y = 0.09; pumpRod.add(rod);
      var tee = K.mesh(K.G.cylX(0.014, 0.14, 16), 'plasticBlack'); tee.position.y = 0.18; pumpRod.add(tee);
      pumpRod.position.y = 0.32; tank.add(pumpRod);
      var gg = new THREE.Group();
      gg.add(K.mesh(K.G.cylZ(0.04, 0.02, 32), 'blackGloss'));
      var gp = K.FX.canvasPanel(0.07, 0.07, function (x, W, H, st) {
        x.fillStyle = '#fff'; x.beginPath(); x.arc(W / 2, H / 2, W * 0.48, 0, PI * 2); x.fill();
        x.strokeStyle = '#30a46c'; x.lineWidth = 14; x.beginPath(); x.arc(W / 2, H / 2, W * 0.38, PI * 0.75 + 0.3 * PI * 1.5, PI * 0.75 + 0.55 * PI * 1.5); x.stroke();
        var a = PI * 0.75 + (st.v || 0) * PI * 1.5; x.strokeStyle = '#d11'; x.lineWidth = 6; x.beginPath(); x.moveTo(W / 2, H / 2); x.lineTo(W / 2 + Math.cos(a) * W * 0.38, H / 2 + Math.sin(a) * W * 0.38); x.stroke();
        x.fillStyle = '#111'; x.font = 'bold 26px system-ui'; x.textAlign = 'center'; x.fillText('bar', W / 2, H * 0.8);
      }, { px: 256, state: { v: 0 } });
      gp.position.z = 0.0105; gg.add(gp);
      gg.position.set(0.0, 0.26, 0.095); tank.add(gg);
      tank.position.set(0.22, 0, 0.05); root.add(tank);
      var hose = K.mesh(K.G.tube([[0.16, 0.25, 0.06], [0.05, 0.38, 0.05], [-0.12, 0.4, 0.02], [-0.18, adapter.position.y + 0.012, 0]], 0.008), 'rubber'); root.add(hose);
      return {
        root: root,
        update: function (t) {
          var pump = t < 4 ? Math.abs(Math.sin(t * PI * 1.2)) : 0;
          pumpRod.position.y = 0.32 + pump * 0.08;
          var v = T.seg(t, 0.3, 4.0) * 0.42;
          gp.userData.redraw({ v: Math.round(v * 50) / 50 });
          res.userData.setLevel(0.7 - 0.02 * Math.sin(t));
        },
        labels: [
          { text: V('adaptér víčka', 'cap adapter'), at: function () { return adapter.position.clone().add(new THREE.Vector3(0, 0.04, 0)); } },
          { text: V('tlak dle výrobce (cca 1–2 bar)', 'pressure per maker (approx. 1–2 bar)'), at: function () { return wp(gg, [0, 0.07, 0]); }, level: 'accent', show: [3, 9] }
        ],
        captions: [
          { text: V('Tlakové odvzdušňovací zařízení – doporučeno', 'Pressure bleeder – recommended') },
          { text: V('Nádobka nikdy nevyschne, stačí 1 člověk', 'Reservoir never runs dry, one person is enough'), level: 'ok', show: [3, 9] },
          { text: V('Nepřekračovat povolený tlak!', 'Never exceed the allowed pressure!'), level: 'danger', show: [5, 9] }
        ]
      };
    }
  });

  /* --------------------------------------------------------- bleed.syringe */
  R('bleed.syringe', {
    duration: 10, camera: { pos: [0.15, 0.38, 0.6], target: [0.0, 0.25, 0], fov: 36 }, shadow: 0.8, thumbT: 3.2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var old = oldFluid(K);
      var res = reservoir(K, old, { second: K.M.brakeFluid }); res.position.set(0, 0.15, 0); root.add(res);
      res.userData.cap.visible = false;
      var shelf = K.mesh(K.G.box(0.35, 0.15, 0.18), 'plasticTex'); shelf.position.set(-0.05, 0.075, 0); root.add(shelf);
      var syr = new THREE.Group();
      var barrel = K.mesh(K.G.cyl(0.016, 0.16, 24), K.M.clone('glassClear', { opacity: 0.35 })); barrel.position.y = 0.1; syr.add(barrel);
      var fill = K.mesh(K.G.cyl(0.014, 0.15, 24), old); fill.geometry.translate(0, 0.075, 0); fill.position.y = 0.025; syr.add(fill);
      var tip = K.mesh(K.G.cyl(0.004, 0.06, 12), 'plasticWhite'); tip.position.y = -0.0; syr.add(tip);
      var plunger = new THREE.Group();
      var pr = K.mesh(K.G.cyl(0.005, 0.18, 12), 'plasticWhite'); pr.position.y = 0.09; plunger.add(pr);
      var thumb = K.mesh(K.G.cyl(0.022, 0.006, 24), 'plasticWhite'); thumb.position.y = 0.18; plunger.add(thumb);
      plunger.position.y = 0.03; syr.add(plunger);
      root.add(syr);
      var bot = new THREE.Group(); var bb = K.mesh(K.G.rbox(0.07, 0.15, 0.05, 0.012), 'plasticWhite'); bb.position.y = 0.075; bot.add(bb);
      var lab = K.FX.canvasPanel(0.05, 0.06, function (x, W, H) { x.fillStyle = '#1f4fa8'; x.fillRect(0, 0, W, H); x.fillStyle = '#fff'; x.font = 'bold 60px system-ui'; x.textAlign = 'center'; x.fillText('DOT', W / 2, H * 0.45); x.fillText('4', W / 2, H * 0.85); }, { px: 128 });
      lab.position.set(0, 0.08, 0.026); bot.add(lab);
      var neck = K.mesh(K.G.cyl(0.012, 0.03, 16), 'plasticWhite'); neck.position.set(0.025, 0.16, 0); bot.add(neck);
      root.add(bot);
      var st = K.FX.stream([0, 0, 0], [0, 0.0, 0], [0, -0.1, 0], K.M.brakeFluid, 0.004); root.add(st.mesh);
      var minLv = res.userData.lv(res.userData.minY + 0.008), maxLv = res.userData.lv(res.userData.maxY);
      return {
        root: root,
        update: function (t) {
          var dip = T.seg(t, 0.3, 1.0) * (1 - T.seg(t, 3.4, 4.0)), suck = T.seg(t, 1.0, 3.2);
          syr.position.set(0.0, 0.31 - dip * 0.11 + T.seg(t, 3.4, 4.0) * 0.0, 0); syr.visible = t < 4.4;
          syr.position.x = T.seg(t, 4.0, 4.4) * 0.3;
          plunger.position.y = 0.03 + suck * 0.12;
          fill.scale.y = Math.max(0.001, suck * 0.8);
          res.userData.setLevel(0.75 - suck * (0.75 - minLv));
          var tl = T.seg(t, 4.6, 5.3) * (1 - T.seg(t, 8.4, 9.0));
          bot.position.set(0.13 - tl * 0.06, 0.32 - tl * 0.0, 0); bot.rotation.z = tl * 1.9;
          bot.visible = t > 4.4;
          var spout = new THREE.Vector3(0.025, 0.175, 0).applyEuler(bot.rotation).add(bot.position);
          st.mesh.position.copy(spout);
          st.set(T.seg(t, 5.2, 5.5) * (1 - T.seg(t, 8.0, 8.4)));
          var newK = T.lin(t, 5.4, 8.2);
          res.userData.setLevel2(minLv + newK * (maxLv - minLv));
          if (t < 4.6) res.userData.setLevel2(0);
          if (t > 5.4) res.userData.setLevel(Math.max(0.001, minLv * (1 - T.seg(t, 5.4, 6.4) * 0.999)));
        },
        labels: [
          { text: V('nikdy pod MIN!', 'never below MIN!'), at: function () { return wp(res, [-0.03, res.userData.minY, 0.05]); }, level: 'danger', show: [2, 4.5] },
          { text: 'MAX', at: function () { return wp(res, [-0.03, res.userData.maxY, 0.05]); }, level: 'ok', show: [6, 10] }
        ],
        captions: [
          { text: V('Starou kapalinu odsát, doplnit novou', 'Suck out the old fluid, top up with new') },
          { text: V('Nikdy nenechat klesnout pod MIN – vzduch do ABS!', 'Never let it drop below MIN – air gets into the ABS!'), level: 'danger' }
        ]
      };
    }
  });

  /* ----------------------------------------------------------- bleed.color */
  R('bleed.color', {
    duration: 9, camera: { pos: [0.0, 0.36, 0.9], target: [0.0, 0.21, 0], fov: 36 }, shadow: 0.8, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var a = new THREE.Vector3(-0.28, 0.4, 0), b = new THREE.Vector3(0.25, 0.04, 0.05);
      var curve = new THREE.CatmullRomCurve3([a, new THREE.Vector3(-0.1, 0.43, 0.02), new THREE.Vector3(0.12, 0.38, 0.04), new THREE.Vector3(0.24, 0.25, 0.05), b]);
      var shell = K.mesh(new THREE.TubeGeometry(curve, 100, 0.012, 12, false), K.M.clone('glassClear', { opacity: 0.25 })); shell.renderOrder = 2; root.add(shell);
      var darkGeo = new THREE.TubeGeometry(curve, 100, 0.009, 10, false), cleanGeo = new THREE.TubeGeometry(curve, 100, 0.0092, 10, false);
      var dark = K.mesh(darkGeo, oldFluid(K)); root.add(dark);
      var clean = K.mesh(cleanGeo, K.M.brakeFluid); root.add(clean);
      var nip = K.mesh(K.G.cylX(0.008, 0.04, 16), 'zinc'); nip.position.copy(a).add(new THREE.Vector3(-0.02, 0, 0)); root.add(nip);
      var bot = bottle(K, oldFluid(K)); bot.position.set(b.x, 0, b.z); root.add(bot);
      var bubbles = [], bm = K.M.clone('glassClear', { opacity: 0.85, color: 0xffffff });
      for (var i = 0; i < 9; i++) { var s = K.mesh(K.G.sphere(0.006, 10), bm); s.userData.o = i / 9; root.add(s); bubbles.push(s); }
      return {
        root: root,
        update: function (t) {
          var k = T.lin(t, 3.2, 6.0);
          var n = cleanGeo.index.count;
          cleanGeo.setDrawRange(0, Math.floor(n * k / 6) * 6); clean.visible = k > 0.01;
          bubbles.forEach(function (s) { var u = (t * 0.22 + s.userData.o) % 1; s.visible = t < 3.6 && u > k; s.position.copy(curve.getPointAt(u)); });
        },
        labels: [
          { text: V('tmavá + bubliny', 'dark + bubbles'), at: function () { return curve.getPointAt(0.7).add(new THREE.Vector3(0, 0.05, 0)); }, show: [0, 3.4], level: 'danger' },
          { text: V('čistá, bez bublin ✔', 'clear, no bubbles ✔'), at: function () { return curve.getPointAt(0.3).add(new THREE.Vector3(0, 0.05, 0)); }, show: [5, 9], level: 'ok' }
        ],
        captions: [
          { text: V('Odvzdušňovat, dokud nejde čistá kapalina bez bublin', 'Bleed until clean fluid without bubbles comes out') },
          { text: V('Po každém kole zkontrolovat nádobku!', 'Check the reservoir after every wheel!'), level: 'danger', show: [4, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------- bleed.abs */
  R('bleed.abs', {
    duration: 9, camera: { pos: [0.35, 0.42, 0.75], target: [0.05, 0.2, 0], fov: 36 }, shadow: 0.8, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var hcu = new THREE.Group();
      var block = K.mesh(K.G.rbox(0.13, 0.1, 0.1, 0.008), 'alu'); hcu.add(block);
      var motor = K.mesh(K.G.cylX(0.035, 0.07, 28), 'blackOxide'); motor.position.set(-0.1, 0, 0); hcu.add(motor);
      var ecu = K.mesh(K.G.rbox(0.13, 0.1, 0.04, 0.01), 'plasticBlack'); ecu.position.set(0, 0, 0.07); hcu.add(ecu);
      var conn = K.mesh(K.G.rbox(0.05, 0.03, 0.03, 0.006), 'plasticGrey'); conn.position.set(0.04, 0.06, 0.07); hcu.add(conn);
      var pipes = [];
      for (var i = 0; i < 6; i++) {
        var x = -0.05 + i * 0.02;
        var p = K.mesh(K.G.tube([[x, 0.05, -0.02], [x, 0.1, -0.03], [x + (i - 2.5) * 0.04, 0.16, -0.12], [x + (i - 2.5) * 0.08, 0.2, -0.3]], 0.0025), 'steel'); hcu.add(p);
        var nut = K.mesh(K.G.hex(0.006, 0.008), 'zinc'); nut.position.set(x, 0.054, -0.02); hcu.add(nut); pipes.push(nut);
      }
      var valveGlow = K.FX.glow(block, 0x3e8ed0);
      hcu.position.set(-0.05, 0.2, 0); root.add(hcu);
      var shelf = K.mesh(K.G.box(0.3, 0.15, 0.2), 'plasticTex'); shelf.position.set(-0.05, 0.075, 0); root.add(shelf);
      var tester = new THREE.Group();
      var tb = K.mesh(K.G.rbox(0.13, 0.2, 0.03, 0.015), 'toolBlue'); tester.add(tb);
      var title = S.t(V('ABS/ESP – odvzdušnění', 'ABS/ESP – bleeding'));
      var tx = [S.t(V('Sešlápnout pedál…', 'Press the pedal…')), S.t(V('Ventily cyklují…', 'Valves cycling…')), S.t(V('Hotovo ✔', 'Done ✔'))];
      var scr = K.FX.canvasPanel(0.105, 0.12, function (x, W, H, st) {
        x.fillStyle = '#0d1a24'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#e9f2fb'; x.font = 'bold 26px system-ui'; x.textAlign = 'center'; x.fillText(title, W / 2, 40);
        x.fillStyle = '#2c3a48'; x.fillRect(20, 120, W - 40, 22); x.fillStyle = '#30a46c'; x.fillRect(20, 120, (W - 40) * (st.p || 0), 22);
        x.fillStyle = st.s === 2 ? '#5be09a' : '#f5c518'; x.font = 'bold 26px system-ui'; x.fillText(tx[st.s || 0], W / 2, 200);
      }, { px: 256, state: { p: 0, s: 0 } });
      scr.position.set(0, 0.025, 0.016); tester.add(scr);
      tester.position.set(0.25, 0.3, 0.1); tester.rotation.set(-0.2, -0.35, 0); root.add(tester);
      var cable = K.mesh(K.G.tube([[0.25, 0.2, 0.1], [0.24, 0.1, 0.18], [0.1, 0.06, 0.25], [-0.1, 0.12, 0.25], [-0.01, 0.26, 0.07]], 0.005), 'plasticBlack'); root.add(cable);
      return {
        root: root,
        update: function (t) {
          var p = T.lin(t, 1.0, 7.0);
          scr.userData.redraw({ p: Math.round(p * 20) / 20, s: t < 2 ? 0 : (t < 7 ? 1 : 2) });
          valveGlow(t > 2 && t < 7 ? 0.5 + 0.5 * Math.sin(t * 14) : 0);
          hcu.position.x = -0.05 + (t > 2 && t < 7 ? Math.sin(t * 40) * 0.0008 : 0);
        },
        labels: [
          { text: V('hydraulická jednotka ABS', 'ABS hydraulic unit'), at: function () { return wp(hcu, [0, 0.1, 0]); }, level: 'accent' },
          { text: V('diagnostika', 'scan tool'), at: function () { return wp(tester, [0, 0.13, 0]); } }
        ],
        captions: [
          { text: V('Vzduch v ABS? Odvzdušnit diagnostikou (VCDS / VIDA / XENTRY / Techstream)', 'Air in the ABS? Bleed it with a scan tool (VCDS / VIDA / XENTRY / Techstream)') },
          { text: V('Bez toho může zůstat měkký pedál', 'Without it the pedal can stay soft'), level: 'danger', show: [3, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ bleed.test */
  R('bleed.test', {
    duration: 9, camera: { pos: [0.6, 1.6, 8.0], target: [0.2, 0.5, 0], fov: 34 }, shadow: 6, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var road = K.mesh(K.G.box(16, 0.004, 3.2), 'concrete'); road.position.y = 0.002; road.receiveShadow = true; root.add(road);
      for (var i = 0; i < 8; i++) { var dash = K.mesh(K.G.box(0.9, 0.006, 0.1), 'plasticWhite'); dash.position.set(-7 + i * 2, 0.004, 1.3); root.add(dash); }
      var car = K.car(ctx.vehicle); root.add(car.group);
      var brakeLights = [];
      car.body.traverse(function (o) { if (o.name === 'taillightL' || o.name === 'taillightR') brakeLights.push(o); });
      var lit = brakeLights.map(function (o) { return K.FX.glow(o, 0xff2020); });
      // position x(t): accelerate 0-3, cruise, brake 4.5-7.5, stop
      function xAt(t) {
        var v = 1.6;
        if (t < 3) return -7 + 0.5 * (v / 3) * t * t;
        var x3 = -7 + 0.5 * v * 3;
        if (t < 4.5) return x3 + v * (t - 3);
        var x45 = x3 + v * 1.5;
        var tb = Math.min(t, 7.5) - 4.5, a = v / 3;
        return x45 + v * tb - 0.5 * a * tb * tb;
      }
      var big = Math.max(1, car.dims.H / 1.6 * 0.9);   // vans: pull back and follow the vehicle
      return {
        root: root,
        cameraPath: big > 1.01 ? function (t) { var x = xAt(Math.min(t, 8.6)); return { pos: [x + 0.6, 1.6 * big, 8.0 * big], target: [x + 0.2, 0.5 * big, 0] }; } : null,
        update: function (t) {
          var x = xAt(Math.min(t, 8.6));
          car.group.position.x = x;
          var braking = t > 4.5 && t < 7.6;
          car.group.rotation.z = braking ? -0.008 * Math.sin(Math.min(1, (t - 4.5) / 0.5) * PI / 2) * (1 - T.seg(t, 7.3, 7.7)) : 0;
          car.wheels.forEach(function (w) { w.wheel.rotation.z = -(x + 7) / car.dims.wr * (w.side > 0 ? 1 : -1); });
          lit.forEach(function (f) { f(braking ? 1 : 0); });
        },
        labels: [
          { text: V('brzdí rovně a jistě ✔', 'brakes straight and firm ✔'), at: function () { return car.group.position.clone().add(new THREE.Vector3(0, car.dims.H + 0.3, 0)); }, show: [6.5, 9], level: 'ok' }
        ],
        captions: [
          { text: V('Nejdřív pumpovat pedál, pak zkouška na prázdném místě', 'Pump the pedal first, then test in an empty area') },
          { text: V('Pedál měkký nebo dlouhý? Nejezdit!', 'Pedal soft or long? Do not drive!'), level: 'danger' }
        ]
      };
    }
  });
})(window.STU);
