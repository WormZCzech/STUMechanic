/* 3D scenes: exhaust replacement and legal modifications. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  function pfLabel(v) {
    return {
      'skoda-octavia-rs-tdi': V('DPF (filtr pevných částic)', 'DPF (particulate filter)'),
      'volvo-xc60-b4': V('GPF (filtr částic benzín)', 'GPF (petrol particulate filter)'),
      'toyota-gr-yaris': V('GPF (filtr částic benzín)', 'GPF (petrol particulate filter)'),
      'mb-cl500-c216': V('katalyzátor 2', 'catalyst 2')
    }[v] || V('DPF / GPF', 'DPF / GPF');
  }

  /** One exhaust line in car coordinates. Returns parts for highlighting / animation. */
  function exhaustLine(K, d, o) {
    var g = new THREE.Group();
    var y0 = d.clr - 0.012, zc = o.z, zr = o.zRear, xf = d.xf, xr = d.xr;
    var steel = K.M.clone('steel', { color: 0xaeb2b6, roughness: 0.45 });
    var hot = K.M.clone('steelDark', { color: 0x6a5a55, roughness: 0.5 });
    var parts = { flanges: [], hangers: [], sensors: [], comps: {} };
    function pipe(pts, mat, r) { var m = K.mesh(K.G.tube(pts, r || 0.025, false, 80, 14), mat || steel); g.add(m); return m; }
    function can(x0, x1, r, y, z, mat, sy) {
      var c = K.mesh(K.G.cylX(r, Math.abs(x1 - x0), 40), mat || steel);
      c.scale.set(1, sy || 0.75, 1); c.position.set((x0 + x1) / 2, y, z); g.add(c);
      [x0, x1].forEach(function (x) { var cap = K.mesh(K.G.cylX(r * 0.98, 0.012, 40), hot); cap.scale.copy(c.scale); cap.position.set(x, y, z); g.add(cap); });
      return c;
    }
    function flange(x, y, z) {
      var f = new THREE.Group();
      var shape = K.G.shape([[-0.032, -0.03], [0.032, -0.03], [0.07, -0.012], [0.07, 0.012], [0.032, 0.03], [-0.032, 0.03], [-0.07, 0.012], [-0.07, -0.012]]);
      [-0.009, 0.009].forEach(function (dx) {
        var p = K.mesh(K.G.extrude(shape, 0.008, 0.0015), hot); p.rotation.y = PI / 2; p.rotation.x = 0.4; p.position.x = dx; f.add(p);
      });
      var nuts = [];
      [-1, 1].forEach(function (sd) {
        var zz = sd * 0.056 * Math.cos(0.4), yy = sd * 0.056 * Math.sin(0.4) * -1;
        var b = K.mesh(K.G.cylX(0.006, 0.07, 10), 'steelDark'); b.position.set(0.012, yy, zz); f.add(b);
        var n = K.mesh(K.G.hex(0.012, 0.012), o.rusty ? 'rust' : 'zinc'); n.rotation.z = PI / 2; n.position.set(0.025, yy, zz); f.add(n); nuts.push(n);
      });
      var gasket = K.mesh(K.G.torus(0.028, 0.006, PI * 2, 24), 'copper'); gasket.rotation.y = PI / 2; f.add(gasket);
      f.position.set(x, y, z); g.add(f);
      f.userData = { nuts: nuts, gasket: gasket };
      parts.flanges.push(f);
      return f;
    }
    function hanger(x, y, z) {
      var h = new THREE.Group();
      var rodA = K.mesh(K.G.cyl(0.006, 0.07, 10), 'steelDark'); rodA.position.set(0, 0.035, 0); h.add(rodA);
      var rub = K.mesh(K.G.rbox(0.025, 0.07, 0.05, 0.01), 'rubber'); rub.position.set(0, 0.075, 0); h.add(rub);
      var rodB = K.mesh(K.G.cyl(0.006, 0.06, 10), 'steelDark'); rodB.position.set(0, 0.12, 0); h.add(rodB);
      h.position.set(x, y, z); g.add(h); parts.hangers.push(h);
      h.userData.rubber = rub; h.userData.rod = rodA;
      return h;
    }
    function sensor(x, y, z) {
      var s = new THREE.Group();
      var boss = K.mesh(K.G.hex(0.013, 0.012), 'zinc'); s.add(boss);
      var body = K.mesh(K.G.cyl(0.009, 0.05, 16), 'steel'); body.position.y = 0.03; s.add(body);
      var cable = K.mesh(K.G.tube([[0, 0.055, 0], [0, 0.1, 0.02], [0.05, 0.14, 0.08], [0.12, 0.15, 0.12]], 0.004), 'plasticBlack'); s.add(cable);
      var conA = K.mesh(K.G.rbox(0.03, 0.018, 0.02, 0.004), 'plasticGrey'); conA.position.set(0.13, 0.15, 0.125); s.add(conA);
      var conB = K.mesh(K.G.rbox(0.03, 0.018, 0.02, 0.004), 'plasticBlack'); conB.position.set(0.16, 0.15, 0.125); s.add(conB);
      var loom = K.mesh(K.G.tube([[0.175, 0.15, 0.125], [0.25, 0.17, 0.1], [0.32, 0.2, 0.05]], 0.005), 'plasticBlack'); s.add(loom);
      s.position.set(x, y, z); s.rotation.x = PI / 2 - 0.5; g.add(s);
      s.userData = { conA: conA, conB: conB, loom: loom };
      parts.sensors.push(s);
      return s;
    }
    var A = [xf + 0.02, d.clr + 0.38, zc], B = [xf - 0.12, d.clr + 0.18, zc];
    var front = pipe([A, B, [xf - 0.24, y0 + 0.01, zc], [xf - 0.3, y0, zc]], hot);
    flange(xf - 0.29, y0, zc);
    // flex section
    for (var i = 0; i < 10; i++) { var rg = K.mesh(K.G.torus(0.027, 0.004, PI * 2, 20), steel); rg.rotation.y = PI / 2; rg.position.set(xf - 0.32 - i * 0.016, y0, zc); g.add(rg); }
    pipe([[xf - 0.31, y0, zc], [xf - 0.47, y0, zc]], steel, 0.024);
    parts.comps.flex = new THREE.Vector3(xf - 0.39, y0, zc);
    var cat = can(xf - 0.47, xf - 0.8, 0.065, y0 - 0.005, zc, steel, 0.8);
    var pf = can(xf - 0.86, xf - 1.24, 0.075, y0 - 0.008, zc, o.pfMat || steel, 0.8);
    pipe([[xf - 0.8, y0, zc], [xf - 0.86, y0, zc]]);
    sensor(xf - 0.2, y0 + 0.05, zc + 0.03);
    sensor(xf - 0.83, y0 - 0.005, zc + 0.028);
    // heat shield above cat & pf
    var shield = K.mesh(K.G.rbox(0.85, 0.008, 0.22, 0.004), 'alu'); shield.position.set(xf - 0.85, y0 + 0.1, zc); g.add(shield);
    flange(xf - 1.27, y0, zc);
    var midX0 = xf - 1.3, cx = xr + (xf - xr) * 0.32;
    pipe([[midX0, y0, zc], [cx + 0.3, y0, zc]]);
    var mid = can(cx + 0.3, cx - 0.2, 0.07, y0, zc, steel, 0.65);
    hanger(cx + 0.05, y0 + 0.02, zc + 0.085);
    var clampX = cx - 0.32;
    pipe([[cx - 0.2, y0, zc], [clampX, y0, zc], [xr + 0.15, y0 + 0.08, (zc + zr) / 2], [xr - 0.15, y0 + 0.06, zr], [xr - 0.32, y0 + 0.03, zr]]);
    var clamp = K.mesh(K.G.torus(0.03, 0.008, PI * 2, 24), 'zinc'); clamp.rotation.y = PI / 2; clamp.position.set(clampX, y0, zc); g.add(clamp);
    parts.comps.clamp = clamp;
    // rear silencer (transverse)
    var rsW = o.rearW || 0.5, rsZ = o.rearZ == null ? zr : o.rearZ;
    var rear = K.mesh(K.G.rbox(0.32, 0.17, rsW, 0.06), steel); rear.position.set(xr - 0.5, y0 + 0.03, rsZ); g.add(rear);
    hanger(xr - 0.5, y0 + 0.03, rsZ + rsW / 2 + 0.02);
    hanger(xr - 0.5, y0 + 0.03, rsZ - rsW / 2 - 0.02);
    var tipEnd = d.rear + (o.hiddenTip ? 0.25 : -0.02);
    (o.tips || [o.tipZ == null ? rsZ : o.tipZ]).forEach(function (tz) {
      var tail = pipe([[xr - 0.66, y0 + 0.03, tz], [tipEnd + 0.12, y0 + 0.04, tz], [tipEnd, y0 + (o.hiddenTip ? -0.02 : 0.05), tz]], steel, 0.024);
      if (!o.hiddenTip) {
        var tip = K.mesh(K.G.cylX(0.038, 0.12, 32), 'chrome'); tip.position.set(tipEnd + 0.02, y0 + 0.05, tz); g.add(tip);
        var hole = K.mesh(K.G.cylX(0.031, 0.122, 32), 'blackOxide'); hole.position.copy(tip.position); g.add(hole);
        parts.comps.tip = tip;
      }
    });
    parts.comps.cat = cat; parts.comps.pf = pf; parts.comps.mid = mid; parts.comps.rear = rear; parts.comps.front = front; parts.comps.shield = shield;
    parts.y0 = y0;
    return { group: g, parts: parts, steel: steel };
  }

  function layoutFor(vid) {
    switch (vid) {
      case 'mb-cl500-c216': return [{ z: 0.2, zRear: 0.42, rearZ: 0.45, rearW: 0.38, tips: [0.55], dual: true }, { z: -0.2, zRear: -0.42, rearZ: -0.45, rearW: 0.38, tips: [-0.55] }];
      case 'toyota-gr-yaris': return [{ z: 0.05, zRear: 0.0, rearZ: 0, rearW: 0.7, tips: [-0.18, 0.18], valve: true }];
      case 'volvo-xc60-b4': return [{ z: 0.05, zRear: -0.25, rearZ: -0.2, rearW: 0.55, tips: [-0.4], hiddenTip: true }];
      case 'skoda-octavia-rs-tdi': return [{ z: 0.05, zRear: -0.3, rearZ: -0.25, rearW: 0.5, tips: [-0.55], pfMat: 'steelDark' }];
      default: return [{ z: 0.05, zRear: -0.25, rearZ: -0.2, rearW: 0.5, tips: [-0.5] }];
    }
  }

  /** Car (optionally on 4 stands, optionally x-ray body) with its exhaust. */
  function exhaustRig(ctx, K, o) {
    o = o || {};
    var root = new THREE.Group();
    var c = K.car(ctx.vehicle, { contactShadow: !o.lift });
    var d = c.dims, H = o.lift || 0;
    root.add(c.group); c.group.position.y = H;
    if (o.lift) {
      root.add(K.FX.contactShadow(d.L * 1.1, d.W * 1.2, 0.35));
      c.jackPoints.forEach(function (jp) {
        var st = K.P.axleStand({ h: 0 }); st.userData.setH(Math.max(0, jp.y + H - 0.3 - 0.062)); st.position.set(jp.x, 0, jp.z); root.add(st);
      });
    }
    if (o.xray) { var fade = K.FX.fader(c.body); fade(o.xray); }
    if (o.lift) {
      // inspection lamps under the car (the key light cannot reach the underside)
      [[d.xf - 0.6, 0.6], [d.xr + 0.2, 0.6], [0, -0.6]].forEach(function (q) {
        var L = new THREE.PointLight(0xfff3e0, 1.4, 4, 1.4); L.position.set(q[0], 0.12, q[1]); root.add(L);
      });
      var lamp = new THREE.Group();
      var lb = K.mesh(K.G.cylX(0.025, 0.35, 16), 'plasticBlack'); lamp.add(lb);
      var ll = K.mesh(K.G.box(0.3, 0.004, 0.03), 'lightWhite'); ll.position.y = 0.024; lamp.add(ll);
      lamp.position.set(d.xr + 0.2, 0.03, 0.6); root.add(lamp);
    }
    var lines = layoutFor(ctx.vehicle).map(function (cfg) { var l = exhaustLine(K, d, Object.assign({ rusty: o.rusty }, cfg)); c.group.add(l.group); return l; });
    root.updateMatrixWorld(true);
    return { root: root, car: c, d: d, lines: lines, p: lines[0].parts, H: H };
  }
  function wpos(obj, off) { var v = obj.getWorldPosition ? obj.getWorldPosition(new THREE.Vector3()) : obj.clone(); return off ? v.add(new THREE.Vector3(off[0], off[1], off[2])) : v; }
  function closeCam(target, off) { return { pos: target.clone().add(new THREE.Vector3(off[0], off[1], off[2])), target: target.clone() }; }

  /* ---------------------------------------------------------------- layout */
  R('exhaust.layout', {
    duration: 10, camera: { pos: [0.6, 0.55, 4.6], target: [0, 0.3, 0], fov: 38 }, shadow: 3.5, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, rig = exhaustRig(ctx, K, { xray: 0.16 });
      var p = rig.p;
      var flow = [];
      var fmat = K.M.clone('hiAccent');
      for (var i = 0; i < 14; i++) { var b = K.mesh(K.G.sphere(0.018, 12), fmat); b.userData.noShadow = true; rig.car.group.add(b); flow.push(b); }
      var y0 = p.y0, d = rig.d;
      var path = new THREE.CatmullRomCurve3([[d.xf + 0.02, d.clr + 0.38, 0.05], [d.xf - 0.2, y0, 0.05], [d.xr + 0.3, y0, 0.05], [d.xr - 0.5, y0 + 0.03, layoutFor(ctx.vehicle)[0].rearZ], [d.rear - 0.02, y0 + 0.05, (layoutFor(ctx.vehicle)[0].tips || [0])[0]]].map(K.v3));
      var glows = ['cat', 'pf', 'mid', 'rear'].map(function (n) { return K.FX.glow(p.comps[n]); });
      return {
        root: rig.root,
        update: function (t) {
          flow.forEach(function (b, i) { b.position.copy(path.getPointAt(((t * 0.18) + i / flow.length) % 1)); });
          glows.forEach(function (gf, i) { gf(T.pulse(t, 1 + i * 2, 2.6 + i * 2)); });
        },
        labels: [
          { text: V('motor', 'engine'), at: function () { return wpos(p.comps.front, [0.05, 0.25, 0]); } },
          { text: V('lambda sondy', 'lambda sensors'), at: function () { return wpos(p.sensors[0], [0, 0.12, 0]); }, level: 'accent' },
          { text: rig.lines.length > 1 ? V('katalyzátor 1', 'catalyst 1') : V('katalyzátor', 'catalyst'), at: function () { return wpos(p.comps.cat, [0, -0.1, 0]); }, show: [0.8, 10] },
          { text: pfLabel(ctx.vehicle), at: function () { return wpos(p.comps.pf, [0, -0.1, 0]); }, show: [2.8, 10] },
          { text: V('střední tlumič', 'centre silencer'), at: function () { return wpos(p.comps.mid, [0, -0.1, 0]); }, show: [4.8, 10] },
          { text: V('zadní tlumič', 'rear silencer'), at: function () { return wpos(p.comps.rear, [0, -0.12, 0]); }, show: [6.8, 10] },
          { text: V('pryžové závěsy', 'rubber hangers'), at: function () { return wpos(p.hangers[0], [0, 0.15, 0]); }, show: [7.5, 10] }
        ],
        captions: [
          { text: V('Směr výfukových plynů: od motoru k zádi', 'Gas flow: from the engine to the tail') },
          { text: ctx.vehicle === 'mb-cl500-c216' ? V('V8: dvě samostatné větve, 4 lambda sondy', 'V8: two separate branches, 4 lambda sensors') : V('Filtr částic a katalyzátor musí zůstat!', 'Particulate filter and catalyst must stay!'), level: ctx.vehicle === 'mb-cl500-c216' ? 'info' : 'danger', show: [3, 10] }
        ]
      };
    }
  });

  /* ----------------------------------------------------------------- legal */
  R('exhaust.legal', {
    duration: 8, camera: { pos: [0.1, 1.25, 1.0], target: [0, 0.88, 0], fov: 36 }, shadow: 1.2, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bench = K.mesh(K.G.rbox(1.3, 0.05, 0.7, 0.01), 'wood'); bench.position.y = 0.8; root.add(bench);
      var muff = K.mesh(K.G.cylX(0.1, 0.45, 40), K.M.clone('steel', { roughness: 0.25 })); muff.scale.set(1, 0.7, 1); muff.position.set(-0.3, 0.9, -0.05); root.add(muff);
      [-1, 1].forEach(function (s) { var pp = K.mesh(K.G.cylX(0.026, 0.14, 20), 'steel'); pp.position.set(-0.3 + s * 0.29, 0.9, -0.05); root.add(pp); });
      var plate = K.FX.canvasPanel(0.12, 0.05, function (c, W, H) {
        c.fillStyle = '#d7dade'; c.fillRect(0, 0, W, H); c.strokeStyle = '#333'; c.lineWidth = 6; c.strokeRect(3, 3, W - 6, H - 6);
        c.fillStyle = '#111'; c.beginPath(); c.arc(H / 2 + 10, H / 2, H * 0.36, 0, PI * 2); c.lineWidth = 8; c.stroke();
        c.font = 'bold ' + Math.round(H * 0.38) + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('e8', H / 2 + 10, H / 2 + 2);
        c.textAlign = 'left'; c.font = 'bold ' + Math.round(H * 0.24) + 'px monospace'; c.fillText('00 1234', H + 30, H * 0.36); c.fillText('R59 / R92', H + 30, H * 0.7);
      });
      plate.position.set(-0.3, 0.9, 0.022); root.add(plate);
      // dB meter
      var meter = new THREE.Group();
      var mb = K.mesh(K.G.rbox(0.09, 0.2, 0.035, 0.012), 'toolYellow'); meter.add(mb);
      var mic = K.mesh(K.G.sphere(0.02, 16), 'fabric'); mic.position.y = 0.12; meter.add(mic);
      var scr = K.FX.canvasPanel(0.07, 0.05, function (c, W, H, st) {
        c.fillStyle = '#0d1a24'; c.fillRect(0, 0, W, H); c.fillStyle = st && st.v > 95 ? '#ff5a5a' : '#6dff9a';
        c.font = 'bold ' + Math.round(H * 0.5) + 'px monospace'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText((st ? st.v : 0).toFixed(0) + ' dB', W / 2, H / 2);
      }, { state: { v: 0 } });
      scr.position.set(0, 0.04, 0.019); meter.add(scr);
      meter.position.set(0.15, 0.93, 0.05); meter.rotation.x = -0.5; root.add(meter);
      // documents with STK stamp
      var doc = K.FX.canvasPanel(0.21, 0.297, function (c, W, H, st) {
        c.fillStyle = '#fbfaf5'; c.fillRect(0, 0, W, H); c.fillStyle = '#555';
        for (var i = 0; i < 14; i++) c.fillRect(W * 0.1, H * 0.12 + i * H * 0.05, W * (0.5 + (i * 37 % 30) / 100), H * 0.012);
        c.fillStyle = '#222'; c.font = 'bold ' + Math.round(W * 0.06) + 'px sans-serif'; c.fillText(S.t(V('Osvědčení / homologace', 'Certificate / approval')), W * 0.1, H * 0.08);
        if (st && st.stamp) { c.strokeStyle = '#1f8a56'; c.lineWidth = W * 0.02; c.beginPath(); c.arc(W * 0.7, H * 0.8, W * 0.14, 0, PI * 2); c.stroke(); c.fillStyle = '#1f8a56'; c.font = 'bold ' + Math.round(W * 0.07) + 'px sans-serif'; c.textAlign = 'center'; c.fillText('STK ✔', W * 0.7, H * 0.82); }
      }, { state: { stamp: false } });
      doc.rotation.x = -PI / 2; doc.rotation.z = 0.15; doc.position.set(0.42, 0.827, 0.0); root.add(doc);
      return {
        root: root,
        update: function (t) {
          scr.userData.redraw({ v: Math.round(T.lerp(40, 88, T.seg(t, 2, 4))) });
          doc.userData.redraw({ stamp: t > 5 });
        },
        labels: [
          { text: V('značka E/e + číslo homologace', 'E/e mark + approval number'), at: [-0.3, 0.97, 0.03], show: [0.5, 8], level: 'accent' },
          { text: V('hluk v limitu', 'noise within limit'), at: [0.15, 1.08, 0.05], show: [4, 8], level: 'ok' },
          { text: V('doklady + zápis (STK)', 'documents + registration (STK)'), at: [0.42, 0.88, 0], show: [5, 8] }
        ],
        captions: [
          { text: V('Jen homologované díly + doklady + limit hluku', 'Homologated parts only + documents + noise limit') },
          { text: V('Nikdy: odstranění DPF/GPF/katalyzátoru/EGR', 'Never: removing DPF/GPF/catalyst/EGR'), level: 'danger', show: [1.5, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ close-ups */
  /** camera low under the car (lit by the inspection lamps), looking up at obj */
  function underCam(rig, obj, off) {
    return function () {
      var tp = wpos(obj);
      var z = Math.min(rig.d.W / 2 - 0.12, tp.z + 0.5 + (off ? off[2] : 0));
      var pos = new THREE.Vector3(tp.x + (off ? off[0] : 0.3), 0.06, z);
      return { pos: pos, target: tp };
    };
  }

  R('exhaust.soak', {
    duration: 7, camera: { pos: [1.2, 0.3, 1.3], target: [1.0, 0.6, 0.05], fov: 34 }, shadow: 3, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, rig = exhaustRig(ctx, K, { lift: 0.45, rusty: true });
      var f = rig.p.flanges[1];
      var can = new THREE.Group();
      var cb = K.mesh(K.G.cyl(0.03, 0.2, 24), 'toolBlue'); can.add(cb);
      var cap = K.mesh(K.G.cyl(0.012, 0.025, 16), 'plasticWhite'); cap.position.y = 0.11; can.add(cap);
      var straw = K.mesh(K.G.cyl(0.002, 0.08, 6), 'toolRed'); straw.rotation.z = PI / 2; straw.position.set(-0.04, 0.115, 0); can.add(straw);
      rig.root.add(can);
      var mistFx = K.FX.puff(0xf3e6c0, 14, 0.03, 0.12); rig.root.add(mistFx.group);
      var drips = K.FX.drops(K.M.brakeFluid, 6, 0.3, 0.004); rig.root.add(drips.group);
      var fp = wpos(f);
      return {
        root: rig.root,
        update: function (t) {
          can.position.copy(fp).add(new THREE.Vector3(0.18, -0.14, 0.05)); can.rotation.z = 0.9;
          mistFx.group.position.copy(fp).add(new THREE.Vector3(0.11, -0.06, 0.04)); mistFx.group.rotation.z = 2.2;
          mistFx.update(t * 2, t > 0.6 && t < 3);
          drips.group.position.copy(fp).add(new THREE.Vector3(0.0, -0.05, 0.03)); drips.update(t, t > 2 && t < 7);
        },
        cameraPath: underCam(rig, f, [-0.38, 0, 0.05]),
        labels: [{ text: V('zrezivělé matice', 'rusty nuts'), at: function () { return wpos(f, [0.03, 0.06, 0.04]); }, level: 'accent' }],
        captions: [
          { text: V('Rezavé spoje nastříkat a nechat působit (i přes noc)', 'Spray rusty joints and let it soak (even overnight)') },
          { text: V('Jen studený výfuk – hořlavé!', 'Cold exhaust only – flammable!'), level: 'danger', show: [2, 7] },
          { text: V('Brýle – rez padá do očí', 'Goggles – rust falls into your eyes'), level: 'info', show: [4, 7] }
        ]
      };
    }
  });

  R('exhaust.sensor', {
    duration: 8, camera: { pos: [1.4, 0.3, 1.2], target: [1.0, 0.65, 0.1], fov: 34 }, shadow: 3, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, rig = exhaustRig(ctx, K, { lift: 0.45 });
      var s = rig.p.sensors[1], conA = s.userData.conA;
      var base = conA.position.clone();
      var sp = K.P.spanner(0.17, 0.011); rig.root.add(sp);
      var sup = K.P.axleStand({ h: 0 }); rig.root.add(sup);
      var rs = wpos(rig.p.comps.mid);
      sup.userData.setH(Math.max(0, rs.y - 0.07 - 0.3 - 0.062)); sup.position.set(rs.x, 0, rs.z);
      var glow = K.FX.glow(conA);
      return {
        root: rig.root,
        update: function (t) {
          var k = T.seg(t, 1, 2.2);
          conA.position.copy(base).add(new THREE.Vector3(-0.04 * k, 0, 0));
          glow(T.pulse(t, 0.2, 2.2));
          var sw = T.seg(t, 3.2, 3.8), turn = T.seg(t, 4, 5.5);
          sp.visible = t > 3.1;
          sp.position.copy(wpos(s)).add(new THREE.Vector3(0, -0.005 + (1 - sw) * -0.1, 0));
          sp.rotation.set(0, 0, 0);
          sp.rotation.y = -turn * 1.2;
          sup.visible = t > 5.8 || t < 0.1 ? true : t > 5.8;
          sup.position.y = (1 - T.seg(t, 5.8, 6.8)) * -0.6;
        },
        cameraPath: function (t) { var a = underCam(rig, s, [0.25, 0, 0])(); if (t > 5.8) { var b = underCam(rig, rig.p.comps.mid, [0.4, 0, 0.3])(); var k = T.seg(t, 5.8, 6.6); a.pos.lerp(b.pos, k); a.target.lerp(b.target, k); } return a; },
        labels: [
          { text: V('konektor', 'connector'), at: function () { return wpos(conA, [0, 0.03, 0]); }, show: [0.3, 3], level: 'accent' },
          { text: V('lambda sonda', 'lambda sensor'), at: function () { return wpos(s, [0, 0.06, 0]); }, show: [3, 5.8] },
          { text: V('výfuk podepřít', 'support the exhaust'), at: function () { return rs.clone().add(new THREE.Vector3(0, -0.12, 0)); }, show: [6.4, 8], level: 'ok' }
        ],
        captions: [
          { text: V('Nejdřív odpojit konektor sondy – kabel nekroutit', 'Unplug the sensor connector first – never twist the wire') },
          { text: V('Za kabel netahat', 'Never pull the wire'), level: 'danger', show: [1.5, 5.8] },
          { text: V('Výfuk podepřít / zavěsit', 'Support / hang the exhaust'), show: [5.8, 8], level: 'info' }
        ]
      };
    }
  });

  R('exhaust.clamp', {
    duration: 8, camera: { pos: [1.2, 0.3, 1.3], target: [1.0, 0.6, 0.05], fov: 34 }, shadow: 3, thumbT: 4.5,
    build: function (ctx, K) {
      var T = K.T, rig = exhaustRig(ctx, K, { lift: 0.45, rusty: true });
      var f = rig.p.flanges[1], nuts = f.userData.nuts, plates = [f.children[0], f.children[1]];
      var nb = nuts.map(function (n) { return n.position.clone(); });
      var rearParts = [rig.p.comps.mid];
      var midBase = rig.p.comps.mid.position.clone();
      var rat = K.P.ratchet(0.22); rig.root.add(rat);
      var gasketGlow = K.FX.glow(f.userData.gasket, 0x30a46c);
      return {
        root: rig.root,
        update: function (t) {
          nuts.forEach(function (n, i) { var k = T.seg(t, 0.8 + i * 1.4, 1.9 + i * 1.4); n.position.copy(nb[i]).add(new THREE.Vector3(k * 0.06, 0, 0)); n.visible = k < 0.98; n.rotation.x = k * 12; });
          var i = t < 2.2 ? 0 : 1, nn = nuts[i];
          rat.visible = t > 0.6 && t < 3.6;
          rat.position.copy(wpos(nn)).add(new THREE.Vector3(0.05, 0, 0)); rat.rotation.set(0, 0, PI / 2); rat.rotateY(Math.sin(t * 6) * 0.4);
          var sep = T.seg(t, 4, 5);
          plates[0].position.x = -0.008 - sep * 0.04;
          rig.p.comps.mid.position.copy(midBase).add(new THREE.Vector3(-sep * 0.04, 0, 0));
          gasketGlow(T.seg(t, 5, 5.6));
        },
        cameraPath: underCam(rig, f, [-0.38, 0, 0.05]),
        labels: [{ text: V('vždy nové těsnění + matice', 'always a new gasket + nuts'), at: function () { return wpos(f.userData.gasket, [0, -0.05, 0.03]); }, show: [5.2, 8], level: 'ok' }],
        captions: [
          { text: V('Matice přírub povolit, spoj rozpojit', 'Undo the flange nuts, separate the joint') },
          { text: V('Zapečené šrouby: raději uříznout než strhnout závit', 'Seized bolts: cut them rather than strip a thread'), level: 'info', show: [2.5, 8] }
        ]
      };
    }
  });

  R('exhaust.hanger', {
    duration: 7, camera: { pos: [1.2, 0.3, 1.3], target: [-1.0, 0.65, 0.2], fov: 34 }, shadow: 3, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, rig = exhaustRig(ctx, K, { lift: 0.45 });
      var h = rig.p.hangers[1], rub = h.userData.rubber, rb = rub.position.clone();
      var sd = K.P.screwdriver(0.25); rig.root.add(sd);
      var lube = K.FX.drops(K.M.water, 6, 0.25, 0.004); rig.root.add(lube.group);
      return {
        root: rig.root,
        update: function (t) {
          lube.group.position.copy(wpos(rub, [0, -0.03, 0])); lube.update(t, t > 0.5 && t < 2.2);
          var k = T.seg(t, 2.8, 4.6);
          rub.position.copy(rb).add(new THREE.Vector3(0, -k * 0.06, 0));
          rub.rotation.z = k * 0.3;
          sd.visible = t > 2.4 && t < 5.5;
          sd.position.copy(wpos(rub, [0.03, 0.02, 0.05])); sd.rotation.set(0, -0.6, -0.9 + k * 0.4);
        },
        cameraPath: underCam(rig, h, [0.45, 0, 0.2]),
        labels: [{ text: V('pryžový závěs', 'rubber hanger'), at: function () { return wpos(rub, [0, 0.06, 0]); }, show: [0, 2.8], level: 'accent' }],
        captions: [
          { text: V('Závěs namazat (mýdlová voda / silikon) a stáhnout', 'Lubricate the hanger (soapy water / silicone) and lever it off') },
          { text: V('Nikdy olej – rozleptá pryž', 'Never oil – it rots rubber'), level: 'danger', show: [1.5, 7] }
        ]
      };
    }
  });

  R('exhaust.fit', {
    duration: 8, camera: { pos: [-0.4, 0.25, 2.5], target: [-1.1, 0.55, 0], fov: 38 }, shadow: 3, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, rig = exhaustRig(ctx, K, { lift: 0.45 });
      var line = rig.lines[0];
      var newMat = K.M.clone('steel', { color: 0xdfe3e7, roughness: 0.18 });
      var rear = rig.p.comps.rear;
      rear.material = newMat;
      var base = rear.position.clone();
      var glow = K.FX.glow(rear, 0x30a46c);
      var hs = rig.p.hangers.slice(1).map(function (h) { return { h: h, b: h.userData.rubber.position.clone() }; });
      return {
        root: rig.root,
        update: function (t) {
          var up = T.seg(t, 0.6, 3.0), slide = T.seg(t, 3.6, 5.2);
          rear.position.copy(base).add(new THREE.Vector3(-0.1 * (1 - slide), -0.35 * (1 - up), 0));
          glow(T.pulse(t, 5.2, 7));
        },
        cameraPath: underCam(rig, rear, [0.6, 0, 0.4]),
        labels: [{ text: V('nový díl', 'new part'), at: function () { return wpos(rear, [0, -0.13, 0]); }, level: 'ok' }],
        captions: [
          { text: V('Nejdřív zavěsit do závěsů, pak spojit', 'Hang it in the hangers first, then join') },
          { text: V('Spoje jen volně – ještě nedotahovat', 'Joints loosely only – do not tighten yet'), level: 'info', show: [3.6, 8] }
        ]
      };
    }
  });

  R('exhaust.align', {
    duration: 7, camera: { pos: [-3.6, 0.7, 1.4], target: [-2.0, 0.3, 0], fov: 34 }, shadow: 3, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, rig = exhaustRig(ctx, K, {});
      var tip = rig.p.comps.tip || rig.p.comps.rear;
      var tb = tip.position.clone();
      var arrows = new THREE.Group();
      var tp = wpos(tip);
      arrows.add(K.FX.arrow([tp.x - 0.05, tp.y + 0.14, tp.z], [tp.x - 0.05, tp.y + 0.06, tp.z], 0x30a46c, 0.006));
      arrows.add(K.FX.arrow([tp.x - 0.05, tp.y - 0.12, tp.z], [tp.x - 0.05, tp.y - 0.05, tp.z], 0x30a46c, 0.006));
      rig.root.add(arrows);
      var flexG = new THREE.Group(); var fl = K.mesh(K.G.sphere(0.06, 16), K.M.clone('hiAccent', { transparent: true, opacity: 0.35 })); flexG.add(fl); flexG.position.copy(rig.p.comps.flex); rig.car.group.add(flexG);
      return {
        root: rig.root,
        update: function (t) {
          var k = T.seg(t, 0.6, 2.4);
          tip.position.copy(tb).add(new THREE.Vector3(0, -0.04 * (1 - k), 0.05 * (1 - k)));
          arrows.visible = t > 2.4;
          flexG.visible = t > 4 && Math.sin(t * 6) > -0.3;
        },
        labels: [
          { text: V('koncovka uprostřed, nikde se nedotýká', 'tip centred, touching nothing'), at: function () { return wpos(tip, [-0.05, 0.2, 0]); }, show: [2.4, 7], level: 'ok' }
        ],
        captions: [
          { text: V('Vyrovnat: mezery k tepelným štítům / karoserii (cca 2 cm)', 'Align: gaps to heat shields / body (approx. 2 cm)') },
          { text: V('Flexi trubka nesmí nést váhu ani být zkroucená', 'The flex pipe must not carry the weight or be twisted'), level: 'info', show: [4, 7] }
        ]
      };
    }
  });

  R('exhaust.tighten', {
    duration: 9, camera: { pos: [0.4, 0.05, 3.2], target: [0, 0.55, 0], fov: 40 }, shadow: 3, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, rig = exhaustRig(ctx, K, { lift: 0.45, xray: 0.25 });
      var joints = [rig.p.flanges[0], rig.p.flanges[1], rig.p.comps.clamp, rig.p.hangers[0]];
      var glows = joints.map(function (j) { return K.FX.glow(j, 0x30a46c); });
      return {
        root: rig.root,
        update: function (t) { glows.forEach(function (g, i) { g(T.seg(t, 0.8 + i * 1.6, 1.4 + i * 1.6)); }); },
        labels: joints.slice(0, 3).map(function (j, i) {
          return { text: String(i + 1), at: function () { return wpos(j, [0, -0.08, 0]); }, show: [0.8 + i * 1.6, 9], level: 'accent' };
        }),
        captions: [
          { text: V('Dotahovat od motoru dozadu', 'Tighten from the engine backwards') },
          { text: V('Moment dle příručky, nové matice', 'Torque per manual, new nuts'), level: 'info', show: [3, 9] }
        ]
      };
    }
  });

  R('exhaust.leak', {
    duration: 8, camera: { pos: [-4.0, 1.1, 2.6], target: [-1.6, 0.5, 0], fov: 34 }, shadow: 3, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, rig = exhaustRig(ctx, K, { lift: 0.45 });
      var d = rig.d, tipZ = (layoutFor(ctx.vehicle)[0].tips || [0])[0];
      var vapor = K.FX.puff(0xe9edf2, 18, 0.18, 0.5); vapor.group.position.set(d.rear - 0.05, rig.p.y0 + 0.05 + rig.H, tipZ); vapor.group.rotation.z = PI / 2 + 0.3; rig.root.add(vapor.group);
      var f = rig.p.flanges[1];
      var leak = K.FX.puff(0x2a2a2a, 10, 0.05, 0.16); rig.car.group.add(leak.group); leak.group.position.copy(f.position);
      var soot = K.mesh(K.G.torus(0.035, 0.012, PI * 2, 20), K.M.clone('plasticBlack', { roughness: 1 })); soot.rotation.y = PI / 2; soot.position.copy(f.position); rig.car.group.add(soot);
      return {
        root: rig.root,
        update: function (t) { vapor.update(t, true); leak.update(t * 1.5, t > 3); soot.visible = t > 3; },
        cameraPath: function (t) {
          var a = { pos: new THREE.Vector3(-4.0, 1.1, 2.6), target: new THREE.Vector3(-1.6, 0.5, 0) };
          if (t > 3) { var b = underCam(rig, f, [-0.38, 0, 0.05])(); var k = T.seg(t, 3, 4); a.pos.lerp(b.pos, k); a.target.lerp(b.target, k); }
          return a;
        },
        labels: [{ text: V('syčení, černé saze u spoje', 'hissing, black soot at the joint'), at: function () { return wpos(f, [0, 0.08, 0.05]); }, show: [3.8, 8], level: 'danger' }],
        captions: [
          { text: V('Kontrola těsnosti: motor běží – VENKU', 'Leak check: engine running – OUTDOORS'), level: 'info' },
          { text: V('CO zabíjí – motor nikdy v zavřené garáži', 'CO kills – never run the engine in a closed garage'), level: 'danger', show: [1, 8] },
          { text: V('Rukou nesahat – trubka se rychle zahřeje', 'Do not touch – the pipe heats up fast'), show: [4.5, 8] }
        ]
      };
    }
  });

  R('exhaust.valve', {
    duration: 8, camera: { pos: [-0.15, 1.08, 1.0], target: [-0.08, 0.84, -0.05], fov: 38 }, shadow: 1.2, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var stand = K.mesh(K.G.rbox(0.5, 0.75, 0.3, 0.01), 'plasticTex'); stand.position.set(0.1, 0.375, -0.05); root.add(stand);
      var muff = K.mesh(K.G.rbox(0.36, 0.17, 0.3, 0.06), K.M.clone('steel', { roughness: 0.25 })); muff.position.set(0.1, 0.84, -0.05); root.add(muff);
      var out = K.mesh(K.G.cylX(0.03, 0.22, 24), 'steel'); out.position.set(-0.17, 0.84, -0.05); root.add(out);
      var tip = K.mesh(K.G.cylX(0.04, 0.1, 32), 'chrome'); tip.position.set(-0.3, 0.84, -0.05); root.add(tip);
      var hole = K.mesh(K.G.cylX(0.032, 0.102, 32), 'blackOxide'); hole.position.copy(tip.position); root.add(hole);
      var flapG = new THREE.Group(); flapG.position.set(-0.2, 0.84, -0.05); root.add(flapG);
      var flap = K.mesh(K.G.cylX(0.027, 0.004, 24), 'steelDark'); flapG.add(flap);
      var axle = K.mesh(K.G.cyl(0.003, 0.08, 8), 'steel'); flapG.add(axle);
      var act = K.mesh(K.G.rbox(0.07, 0.05, 0.06, 0.01), 'plasticBlack'); act.position.set(-0.2, 0.84, 0.04); root.add(act);
      var cable = K.mesh(K.G.tube([[-0.2, 0.84, 0.07], [-0.1, 0.8, 0.15], [0.05, 0.82, 0.2], [0.25, 0.83, 0.18]], 0.004), 'plasticBlack'); root.add(cable);
      var remote = K.FX.canvasPanel(0.09, 0.06, function (c, W, H, st) {
        c.fillStyle = '#16191f'; c.fillRect(0, 0, W, H);
        c.fillStyle = st && st.open ? '#f5a524' : '#3e8ed0'; c.font = 'bold ' + Math.round(H * 0.28) + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(st && st.open ? S.t(V('OTEVŘENO', 'OPEN')) : S.t(V('ZAVŘENO', 'CLOSED')), W / 2, H / 2);
      }, { state: { open: false } });
      var rb = K.mesh(K.G.rbox(0.1, 0.07, 0.02, 0.008), 'plasticBlack'); rb.position.set(0.28, 0.83, 0.18); rb.rotation.y = -0.5; root.add(rb);
      remote.position.set(0.28, 0.83, 0.191); remote.rotation.y = -0.5; root.add(remote);
      var rings = [];
      for (var i = 0; i < 4; i++) { var r = K.mesh(K.G.torus(0.05, 0.003, PI * 2, 32), K.M.clone('hiAccent', { transparent: true, opacity: 0.5 })); r.rotation.y = PI / 2; r.position.set(-0.38, 0.84, -0.05); r.userData.noShadow = true; root.add(r); rings.push(r); }
      return {
        root: root,
        update: function (t) {
          var open = t > 3 && t < 7;
          flapG.rotation.z = 0; flapG.rotation.y = T.seg(t, 3, 3.5) * PI / 2 * (1 - T.seg(t, 7, 7.5));
          remote.userData.redraw({ open: open });
          rings.forEach(function (r, j) {
            var k = ((t * 0.8) + j / 4) % 1, amp = open ? 1 : 0.35;
            r.scale.setScalar(1 + k * 3 * amp); r.position.x = -0.38 - k * 0.25 * amp; r.material.opacity = 0.5 * (1 - k) * amp;
          });
        },
        labels: [
          { text: V('klapka', 'flap'), at: [-0.2, 0.9, -0.05], level: 'accent' },
          { text: V('ovladač', 'controller'), at: [0.28, 0.88, 0.19] }
        ],
        captions: [
          { text: V('Klapka otevřená = hlasitější, zavřená = tišší', 'Flap open = louder, closed = quieter') },
          { text: V('Homologace platí jen v popsaném režimu', 'Approval only valid in the described mode'), level: 'info', show: [2, 8] },
          { text: V('Koncovky nesmí přesahovat obrys vozu ani mít ostré hrany', 'Tips must not stick out past the body or have sharp edges'), show: [5, 8] }
        ]
      };
    }
  });

  R('exhaust.downpipe', {
    duration: 9, camera: { pos: [0.55, 1.2, 1.05], target: [0, 0.9, 0], fov: 36 }, shadow: 1.3, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), v = ctx.vehicle;
      var bench = K.mesh(K.G.rbox(1.4, 0.05, 0.7, 0.01), 'wood'); bench.position.y = 0.78; root.add(bench);
      var na = v === 'mb-cl500-c216';
      var src = new THREE.Group(); src.position.set(-0.4, 0.95, -0.05); root.add(src);
      if (na) {
        for (var i = 0; i < 4; i++) { var r = K.mesh(K.G.tube([[-0.1 + i * 0.06, 0.1, 0], [-0.08 + i * 0.05, 0.02, 0.03], [0.05, -0.04, 0.05]], 0.016), 'steelDark'); src.add(r); }
      } else {
        var snail = K.mesh(K.G.torus(0.06, 0.035, PI * 1.7, 32), 'castIron'); src.add(snail);
        var hub = K.mesh(K.G.cylZ(0.05, 0.08, 32), 'castIron'); src.add(hub);
        var comp = K.mesh(K.G.torus(0.055, 0.03, PI * 1.7, 32), 'aluCast'); comp.position.z = -0.1; src.add(comp);
      }
      var dpMat = K.M.clone('steel', { color: 0xd5d9dd, roughness: 0.2 });
      var dp = K.mesh(K.G.tube([[-0.36, 0.92, 0.0], [-0.22, 0.86, 0.04], [-0.05, 0.84, 0.05], [0.12, 0.84, 0.05]], 0.03, false, 60), dpMat); root.add(dp);
      var cat = K.mesh(K.G.cylX(0.06, 0.22, 32), dpMat); cat.position.set(0.22, 0.84, 0.05); root.add(cat);
      var tag = K.FX.canvasPanel(0.08, 0.025, function (c, W, H) { c.fillStyle = '#e9edf0'; c.fillRect(0, 0, W, H); c.fillStyle = '#111'; c.font = 'bold ' + Math.round(H * 0.6) + 'px monospace'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('e1 · 103R', W / 2, H / 2); });
      tag.position.set(0.22, 0.84, 0.111); root.add(tag);
      // laptop with ECU calibration
      var lap = new THREE.Group(); lap.position.set(0.48, 0.805, -0.12); lap.rotation.y = -0.6; root.add(lap);
      var baseL = K.mesh(K.G.rbox(0.32, 0.015, 0.22, 0.006), 'plasticGrey'); lap.add(baseL);
      var lid = new THREE.Group(); lid.position.set(0, 0.008, -0.11); lid.rotation.x = -0.25; lap.add(lid);
      var lidM = K.mesh(K.G.rbox(0.32, 0.21, 0.01, 0.006), 'plasticGrey'); lidM.position.y = 0.105; lid.add(lidM);
      var scr = K.FX.canvasPanel(0.29, 0.18, function (c, W, H, st) {
        c.fillStyle = '#0d1a24'; c.fillRect(0, 0, W, H); c.fillStyle = '#9fc7e8'; c.font = 'bold ' + Math.round(H * 0.1) + 'px sans-serif';
        c.fillText(S.t(V('Kalibrace ŘJ', 'ECU calibration')), W * 0.06, H * 0.18);
        c.fillStyle = '#2b3a48'; c.fillRect(W * 0.06, H * 0.4, W * 0.88, H * 0.1); c.fillStyle = '#30a46c'; c.fillRect(W * 0.06, H * 0.4, W * 0.88 * (st ? st.k : 0), H * 0.1);
        c.fillStyle = '#e9edf3'; c.font = Math.round(H * 0.08) + 'px sans-serif'; c.fillText(S.t(V('+ měření emisí + zápis do TP', '+ emissions test + registration')), W * 0.06, H * 0.75);
      }, { state: { k: 0 } });
      scr.position.set(0, 0.105, 0.006); lid.add(scr);
      var docs = K.mesh(K.G.box(0.21, 0.004, 0.297), 'plasticWhite'); docs.position.set(-0.05, 0.805, 0.2); docs.rotation.y = 0.2; root.add(docs);
      var glow = K.FX.glow(cat, 0x30a46c);
      var octavia = v === 'skoda-octavia-rs-tdi';
      return {
        root: root,
        update: function (t) { scr.userData.redraw({ k: Math.round(T.seg(t, 2.5, 6) * 20) / 20 }); glow(T.pulse(t, 0.5, 2.5)); },
        labels: [
          { text: na ? V('výfukové svody', 'exhaust manifolds') : V('turbo', 'turbo'), at: [-0.4, 1.05, -0.05] },
          { text: V('sport kat. s homologací', 'homologated sport cat'), at: [0.22, 0.92, 0.06], level: 'ok', show: [0.5, 9] },
          { text: V('kalibrace', 'calibration'), at: [0.48, 1.05, -0.15], show: [2.5, 9] },
          { text: V('doklady', 'documents'), at: [-0.05, 0.84, 0.2], show: [4, 9] }
        ],
        captions: [
          { text: V('Downpipe = díl + kalibrace + homologace + zápis', 'Downpipe = part + calibration + approval + registration') },
          octavia ? { text: V('2.0 TDI: katalyzátor + DPF jsou jeden celek – ponechat originál!', '2.0 TDI: catalyst + DPF are one unit – keep it original!'), level: 'danger', show: [1.5, 9] }
            : v === 'volvo-xc60-b4' ? { text: V('XC60: úprava se nedoporučuje (GPF, záruka)', 'XC60: modification not recommended (GPF, warranty)'), level: 'danger', show: [1.5, 9] }
              : { text: V('Žádné „rovné trubky“ – bez katalyzátoru nelegální', 'No "straight pipes" – illegal without a catalyst'), level: 'danger', show: [1.5, 9] },
          { text: V('Doporučeno pro specializovanou dílnu', 'Recommended for a specialist workshop'), level: 'info', show: [5, 9] }
        ]
      };
    }
  });
})(window.STU);
