/* 3D scenes: MIG welding basics for rust repair (non-structural panels).
 * Also defines small shared helpers S.n7 (sparks, panel, tools) used by plastic-pdr.js and track-prep.js
 * at build time (scripts are all loaded before any scene is built). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  /* ----------------------------------------------------------------- helpers */
  function rnd(i, k) { var x = Math.sin(i * 127.1 + (k || 0) * 311.7) * 43758.5453; return x - Math.floor(x); }

  /** Spark shower: emissive streaks on ballistic paths. update(t, on, origin(Vector3), dir(Vector3)) */
  function sparks(K, n, opts) {
    opts = opts || {};
    var g = new THREE.Group(), list = [];
    var mat = new THREE.MeshStandardMaterial({ color: 0xffb347, emissive: 0xffa020, emissiveIntensity: 2.2, roughness: 0.5 });
    var geo = new THREE.BoxGeometry(0.0025, 0.0025, 0.022);
    for (var i = 0; i < (n || 40); i++) {
      var m = new THREE.Mesh(geo, mat); m.userData.noShadow = true; g.add(m); list.push(m);
    }
    var tmpV = new THREE.Vector3();
    return {
      group: g,
      update: function (t, on, origin, dir) {
        g.visible = !!on;
        if (!on) return;
        list.forEach(function (m, i) {
          var life = 0.35 + rnd(i, 1) * 0.35;
          var tau = ((t * 1.7 + rnd(i, 2)) % 1) * life;
          var spread = opts.spread || 0.55;
          var v = new THREE.Vector3(dir.x + (rnd(i, 3) - 0.5) * spread, dir.y + (rnd(i, 4) - 0.5) * spread, dir.z + (rnd(i, 5) - 0.5) * spread).normalize().multiplyScalar(1.2 + rnd(i, 6) * 1.6);
          tmpV.copy(v).multiplyScalar(tau);
          tmpV.y -= 4.9 * tau * tau;
          m.position.copy(origin).add(tmpV);
          var vel = v.clone(); vel.y -= 9.8 * tau;
          m.lookAt(m.position.clone().add(vel));
          var s = 1 - tau / life; m.scale.set(1, 1, 0.4 + s);
        });
      }
    };
  }

  /** Flat-ish steel panel (door bottom / wing) on a stand. Panel centre at (0, PY, 0), facing +Z. */
  var PY = 0.95;
  function panel(ctx, K, opts) {
    opts = opts || {};
    var root = new THREE.Group();
    var w = opts.w || 0.8, h = opts.h || 0.5;
    var mat = opts.mat || K.M.carPaint(K.carSpec(ctx.vehicle).paint);
    var p = K.mesh(K.G.rbox(w, h, 0.012, 0.004), mat); p.position.set(0, PY, 0); root.add(p);
    // stand
    [-w * 0.38, w * 0.38].forEach(function (x) {
      var post = K.mesh(K.G.cyl(0.014, PY - h / 2, 16), 'steelDark'); post.position.set(x, (PY - h / 2) / 2, -0.04); root.add(post);
      var foot = K.mesh(K.G.box(0.04, 0.02, 0.4), 'steelDark'); foot.position.set(x, 0.01, -0.04); root.add(foot);
      var clamp = K.mesh(K.G.box(0.05, 0.04, 0.05), 'toolRed'); clamp.position.set(x, PY - h / 2 + 0.01, -0.02); root.add(clamp);
    });
    root.add(K.FX.contactShadow(w * 1.4, 0.6, 0.35));
    return { root: root, panel: p, w: w, h: h, front: 0.0065 };
  }

  /** Irregular rust spot (flat, on the panel face at local z). */
  function rustSpot(K, r, z) {
    var shape = new THREE.Shape();
    for (var i = 0; i <= 40; i++) {
      var a = i / 40 * PI * 2, rr = r * (0.75 + 0.25 * Math.sin(a * 3 + 1) * Math.cos(a * 5));
      if (i === 0) shape.moveTo(Math.cos(a) * rr, Math.sin(a) * rr * 0.7); else shape.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * 0.7);
    }
    var g = new THREE.Group();
    var m = new THREE.Mesh(new THREE.ShapeGeometry(shape), K.M.rust); m.position.z = z; g.add(m);
    for (var j = 0; j < 7; j++) {
      var hole = K.mesh(K.G.cylZ(r * (0.06 + rnd(j, 9) * 0.07), 0.002, 12), 'blackOxide');
      hole.position.set((rnd(j, 1) - 0.5) * r * 1.1, (rnd(j, 2) - 0.5) * r * 0.6, z + 0.001); g.add(hole);
    }
    var bub = K.mesh(K.G.torus(r * 1.05, 0.004, PI * 2, 48), 'rust'); bub.scale.y = 0.7; bub.position.z = z; g.add(bub);
    return g;
  }

  /** Rounded-rect outline points (for weld seams). */
  function rectLoop(w, h, n) {
    var pts = [], per = 2 * (w + h);
    for (var i = 0; i < n; i++) {
      var d = i / n * per, x, y;
      if (d < w) { x = -w / 2 + d; y = h / 2; }
      else if (d < w + h) { x = w / 2; y = h / 2 - (d - w); }
      else if (d < 2 * w + h) { x = w / 2 - (d - w - h); y = -h / 2; }
      else { x = -w / 2; y = -h / 2 + (d - 2 * w - h); }
      pts.push(new THREE.Vector2(x, y));
    }
    return pts;
  }

  /** MIG torch: tip at origin pointing -Z (towards the work), handle back along +Z / +Y. */
  function migTorch(K) {
    var g = new THREE.Group();
    var nozzle = K.mesh(K.G.lathe([[0.008, 0], [0.011, 0.004], [0.012, 0.045], [0.009, 0.05]], 24), 'copper'); nozzle.rotation.x = -PI / 2; nozzle.position.z = 0.008; g.add(nozzle);
    var tip = K.mesh(K.G.cyl(0.003, 0.012, 10), 'brass'); tip.rotation.x = PI / 2; tip.position.z = 0.006; g.add(tip);
    var wire = K.mesh(K.G.cyl(0.0006, 0.012, 6), 'copper'); wire.rotation.x = PI / 2; wire.position.z = -0.002; g.add(wire);
    var neck = K.mesh(K.G.tube([[0, 0, 0.055], [0, 0.01, 0.1], [0, 0.05, 0.14], [0, 0.09, 0.16]], 0.008, false, 30, 10), 'blackOxide'); g.add(neck);
    var handle = K.mesh(K.G.cyl(0.018, 0.14, 20), 'plasticBlack'); handle.position.set(0, 0.15, 0.17); handle.rotation.x = 0.35; g.add(handle);
    var trig = K.mesh(K.G.box(0.008, 0.03, 0.012), 'toolRed'); trig.position.set(0, 0.12, 0.155); g.add(trig);
    var hose = K.mesh(K.G.tube([[0, 0.22, 0.2], [0, 0.32, 0.3], [0.1, 0.3, 0.5], [0.3, 0.1, 0.6]], 0.012, false, 40, 10), 'rubber'); g.add(hose);
    var arc = new THREE.Mesh(K.G.sphere(0.006, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xbfe0ff, emissiveIntensity: 4 }));
    arc.position.z = -0.009; arc.userData.noShadow = true; g.add(arc);
    var light = new THREE.PointLight(0x9fd0ff, 0, 1.4, 2); light.position.z = -0.02; g.add(light);
    g.userData = { arc: arc, light: light };
    return g;
  }
  function setArc(torch, on, t) {
    var f = on ? 0.6 + 0.4 * Math.abs(Math.sin(t * 61) * Math.cos(t * 37)) : 0;
    torch.userData.arc.visible = on;
    torch.userData.arc.scale.setScalar(0.7 + f);
    torch.userData.light.intensity = f * 3.2;
  }

  /** Angle grinder: disc centre at origin, disc in the XY plane facing +Z, body along +X. */
  function grinder(K, flap) {
    var g = new THREE.Group();
    var disc = new THREE.Group();
    var d = K.mesh(K.G.cylZ(0.058, 0.004, 40), flap ? 'paperDirty' : 'castIron'); disc.add(d);
    for (var i = 0; i < 6; i++) { var mark = K.mesh(K.G.box(0.045, 0.004, 0.0045), 'plasticGrey'); mark.rotation.z = i / 6 * PI * 2; mark.position.set(Math.cos(i / 6 * PI * 2) * 0.03, Math.sin(i / 6 * PI * 2) * 0.03, 0); disc.add(mark); }
    var nut = K.mesh(K.G.cylZ(0.012, 0.008, 16), 'steel'); nut.position.z = 0.005; disc.add(nut);
    g.add(disc);
    var guard = K.mesh(K.G.sector(0.0, 0.066, PI * 0.15, PI * 1.05, 0.03, 0.002), 'steelDark'); guard.position.z = 0.02; g.add(guard);
    var head = K.mesh(K.G.cylZ(0.03, 0.05, 20), 'aluCast'); head.position.z = 0.05; g.add(head);
    var body = K.mesh(K.G.cylX(0.032, 0.22, 24), 'toolYellow'); body.position.set(0.12, 0, 0.06); g.add(body);
    var grip = K.mesh(K.G.cylX(0.028, 0.08, 20), 'gripRubber'); grip.position.set(0.25, 0, 0.06); g.add(grip);
    var side = K.mesh(K.G.cyl(0.012, 0.1, 12), 'plasticBlack'); side.position.set(0.02, 0.07, 0.06); g.add(side);
    g.userData.disc = disc;
    return g;
  }

  function extinguisher(K) {
    var g = new THREE.Group();
    var body = K.mesh(K.G.lathe([[0, 0], [0.07, 0], [0.075, 0.02], [0.075, 0.42], [0.06, 0.47], [0.02, 0.5], [0, 0.5]], 32), 'toolRed'); g.add(body);
    var label = K.mesh(K.G.cyl(0.0755, 0.12, 32), 'plasticWhite'); label.position.y = 0.2; g.add(label);
    var valve = K.mesh(K.G.box(0.05, 0.05, 0.03), 'plasticBlack'); valve.position.y = 0.53; g.add(valve);
    var lever = K.mesh(K.G.box(0.11, 0.008, 0.025), 'steel'); lever.position.set(0.03, 0.56, 0); lever.rotation.z = 0.15; g.add(lever);
    var hose = K.mesh(K.G.tube([[-0.02, 0.53, 0], [-0.09, 0.45, 0.02], [-0.1, 0.25, 0.05], [-0.08, 0.15, 0.08]], 0.008), 'rubber'); g.add(hose);
    return g;
  }

  function helmet(K) {
    var g = new THREE.Group();
    var shell = K.mesh(new THREE.SphereGeometry(0.13, 28, 18, 0, PI * 2, 0, PI * 0.62), 'plasticBlack'); shell.scale.set(1, 1.15, 1.1); g.add(shell);
    var visor = K.mesh(K.G.rbox(0.12, 0.07, 0.01, 0.006), K.M.clone('glass', { color: 0x1a3a22, opacity: 0.85 })); visor.position.set(0, 0.0, 0.135); g.add(visor);
    var sticker = K.mesh(K.G.box(0.06, 0.012, 0.005), 'toolYellow'); sticker.position.set(0, -0.06, 0.13); g.add(sticker);
    return g;
  }

  function glove(K) { var g = K.P.glove(K.M.clone('leather', { color: 0x8b5a2b, roughness: 0.9 })); return g; }

  /** Welder (MIG machine) with display. */
  function welder(K, ctx, state) {
    var g = new THREE.Group();
    var box = K.mesh(K.G.rbox(0.28, 0.36, 0.5, 0.02), 'toolBlue'); box.position.y = 0.18 + 0.06; g.add(box);
    var wheels = [[-0.16, 0.2], [0.16, 0.2], [-0.16, -0.2], [0.16, -0.2]].map(function (p) { var w = K.mesh(K.G.cylX(0.04, 0.03, 16), 'rubber'); w.position.set(p[0] * 0.9, 0.04, p[1]); g.add(w); return w; });
    var panelM = K.FX.canvasPanel(0.2, 0.12, function (c, W, H, st) {
      c.fillStyle = '#0d1a24'; c.fillRect(0, 0, W, H);
      c.fillStyle = '#7cd0ff'; c.font = 'bold ' + Math.round(H * 0.14) + 'px sans-serif';
      var L = st || {};
      c.fillText(ctx.t(V('Drát', 'Wire')) + ': ' + (L.wire || '0,8 mm'), W * 0.06, H * 0.22);
      c.fillText(ctx.t(V('Napětí', 'Voltage')) + ': ' + (L.v || '17 V'), W * 0.06, H * 0.44);
      c.fillText(ctx.t(V('Posuv drátu', 'Wire speed')) + ': ' + (L.ws || '4,5 m/min'), W * 0.06, H * 0.66);
      c.fillText(ctx.t(V('Plyn', 'Gas')) + ': ' + (L.gas || 'Ar/CO₂ 8–10 l/min'), W * 0.06, H * 0.88);
    }, { px: 512, state: state });
    panelM.position.set(0.141, 0.36, 0.05); panelM.rotation.y = PI / 2; g.add(panelM);
    [0.0, -0.1].forEach(function (z, i) { var k = K.mesh(K.G.cylX(0.018, 0.02, 20), 'plasticBlack'); k.position.set(0.15, 0.22, z - 0.08 + i * 0.02); g.add(k); });
    var bottle = new THREE.Group();
    var b = K.mesh(K.G.lathe([[0, 0], [0.09, 0], [0.095, 0.03], [0.095, 0.7], [0.07, 0.78], [0.03, 0.8], [0, 0.8]], 32), K.M.clone('caliperRed', { color: 0x4a6b4a })); bottle.add(b);
    var reg = K.mesh(K.G.cyl(0.03, 0.06, 20), 'brass'); reg.position.y = 0.84; bottle.add(reg);
    var gauge = K.mesh(K.G.cylZ(0.025, 0.015, 20), 'chrome'); gauge.position.set(0, 0.86, 0.035); bottle.add(gauge);
    bottle.position.set(-0.05, 0, -0.38); g.add(bottle);
    g.userData = { panel: panelM };
    return g;
  }

  /** Simple workbench. */
  function bench(K, w, d, h) {
    var g = new THREE.Group();
    var top = K.mesh(K.G.box(w, 0.04, d), 'wood'); top.position.y = h; g.add(top);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) { var l = K.mesh(K.G.box(0.05, h, 0.05), 'steelDark'); l.position.set(s[0] * (w / 2 - 0.05), h / 2, s[1] * (d / 2 - 0.05)); g.add(l); });
    return g;
  }

  S.n7 = { sparks: sparks, panel: panel, rustSpot: rustSpot, grinder: grinder, extinguisher: extinguisher, helmet: helmet, bench: bench, rnd: rnd, PY: PY };

  function isAlu(v) { return v === 'mb-cl500-c216' || v === 'toyota-gr-yaris'; }
  var CAM = { pos: [0.5, 1.15, 1.05], target: [0, 0.93, 0], fov: 34 };
  var HOLE = { w: 0.22, h: 0.13 };

  /* --------------------------------------------------------------- safety */
  R('welding.safety', {
    duration: 8, camera: { pos: [1.35, 1.35, 1.75], target: [0.2, 0.55, 0.1], fov: 38 }, shadow: 1.6, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var b = bench(K, 1.2, 0.6, 0.8); root.add(b);
      var hm = helmet(K); hm.position.set(-0.3, 0.92, 0); hm.rotation.y = 0.4; root.add(hm);
      var gl = glove(K); gl.position.set(0.1, 0.84, 0.05); gl.rotation.set(-PI / 2, 0, 0.4); root.add(gl);
      var gl2 = glove(K); gl2.position.set(0.25, 0.84, -0.05); gl2.rotation.set(-PI / 2, 0, -0.3); root.add(gl2);
      var ex = extinguisher(K); ex.position.set(0.72, 0, 0.42); root.add(ex);
      var blanket = K.mesh(K.G.box(0.5, 0.01, 0.35), K.M.clone('fabric', { color: 0xd8c27a })); blanket.position.set(0.0, 0.825, -0.12); blanket.rotation.y = 0.1; root.add(blanket);
      var resp = K.mesh(K.G.sphere(0.06, 16), 'plasticGrey'); resp.scale.set(1.2, 0.8, 0.8); resp.position.set(0.42, 0.86, 0.12); root.add(resp);
      [-1, 1].forEach(function (s) { var f = K.mesh(K.G.cylZ(0.03, 0.03, 16), 'toolRed'); f.position.set(0.42 + s * 0.06, 0.85, 0.17); root.add(f); });
      var items = [hm, gl, ex, resp, blanket];
      var glows = items.map(function (o) { return K.FX.glow(o, 0xf5a524); });
      return {
        root: root,
        update: function (t) { glows.forEach(function (g, i) { g(T.pulse(t, 0.3 + i * 1.4, 1.7 + i * 1.4)); }); },
        labels: [
          { text: V('Samostmívací kukla', 'Auto-darkening helmet'), at: [-0.3, 1.1, 0], show: [0.3, 8] },
          { text: V('Kožené rukavice', 'Leather gloves'), at: [0.15, 0.92, 0.05], show: [1.6, 8] },
          { text: V('Hasicí přístroj na dosah', 'Extinguisher within reach'), at: [0.72, 0.62, 0.42], show: [3, 8], level: 'danger' },
          { text: V('Respirátor (zinek!)', 'Respirator (zinc!)'), at: [0.42, 0.95, 0.12], show: [4.3, 8] },
          { text: V('Svářečská deka', 'Welding blanket'), at: [0, 0.86, -0.12], show: [5.6, 8] }
        ],
        captions: [
          { text: V('Bavlněné / nehořlavé oblečení – žádné syntetické', 'Cotton / flame-resistant clothes – no synthetics') },
          { text: V('Po svařování hlídejte 30 min (žhnutí v dutinách)', 'Fire watch for 30 min after welding (smouldering in cavities)'), level: 'danger', show: [3, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ car prep */
  R('welding.prep', {
    duration: 8, camera: { pos: [-0.5, 0.14, 4.4], target: [-0.5, 0.2, 0], fov: 46 }, shadow: 3.2, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var d = c.dims;
      // danger zones: fuel tank, fuel/brake lines, battery
      var tank = K.mesh(K.G.rbox(0.7, 0.2, 0.9, 0.05), K.M.clone('hiDanger', { transparent: true, opacity: 0.55 })); tank.position.set(d.xr + 0.55, d.clr + 0.12, 0); tank.userData.noShadow = true; root.add(tank);
      var line = K.mesh(K.G.tube([[d.xr + 0.3, d.clr + 0.06, -0.35], [0, d.clr + 0.05, -0.38], [d.xf - 0.4, d.clr + 0.08, -0.35]], 0.012), K.M.clone('hiDanger', { transparent: true, opacity: 0.8 })); root.add(line);
      var bx = d.xf + 0.15, bz = d.W / 2 + 0.45;
      var batt = K.mesh(K.G.rbox(0.28, 0.2, 0.18, 0.02), 'plasticBlack'); batt.position.set(bx, 0.1, bz); root.add(batt);
      var term = K.mesh(K.G.cyl(0.012, 0.02, 12), 'lead' in K.M ? 'lead' : 'steelDark'); term.position.set(bx - 0.08, 0.21, bz); root.add(term);
      var clamp = new THREE.Group(); var cl = K.mesh(K.G.box(0.04, 0.02, 0.03), 'plasticBlack'); clamp.add(cl);
      var cab = K.mesh(K.G.tube([[0, 0, 0], [0.05, 0.05, 0], [0.12, 0.06, 0.05]], 0.008), 'plasticBlack'); clamp.add(cab);
      root.add(clamp);
      var ex = extinguisher(K); ex.position.set(d.xr - 0.2, 0, d.W / 2 + 0.5); root.add(ex);
      var tg = K.FX.glow(tank, 0xe5484d), lg = K.FX.glow(line, 0xe5484d);
      return {
        root: root,
        update: function (t) {
          var p = 0.4 + 0.6 * Math.abs(Math.sin(t * 2.5));
          tg(p); lg(p);
          var up = T.seg(t, 4.5, 5.5);
          clamp.position.set(bx - 0.08, 0.235 + up * 0.12, bz);
        },
        labels: [
          { text: V('Palivová nádrž / vedení – žádné jiskry!', 'Fuel tank / lines – no sparks!'), at: [d.xr + 0.55, d.clr + 0.05, 0.45], level: 'danger' },
          { text: V('Odpojit baterii (−)', 'Disconnect battery (−)'), at: [bx - 0.08, 0.42, bz], show: [4.5, 8] },
          { text: V('Hasicí přístroj', 'Extinguisher'), at: [d.xr - 0.2, 0.65, d.W / 2 + 0.5] }
        ],
        captions: [
          { text: V('Odstraňte koberce, čalounění a ochranný vosk v okolí 30 cm', 'Remove carpet, trim and underbody wax within 30 cm') },
          { text: V('Řídicí jednotky chraňte: baterii odpojit, kostru klemy co nejblíž svaru', 'Protect the ECUs: disconnect the battery, earth clamp as close to the weld as possible'), show: [3.5, 8], level: 'info' }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ assess */
  R('welding.assess', {
    duration: 7, camera: CAM, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, pn = panel(ctx, K), root = pn.root;
      var rust = rustSpot(K, 0.09, pn.front + 0.0005); rust.position.set(0, PY, 0); root.add(rust);
      var sd = K.P.screwdriver(0.2); sd.rotation.y = -PI / 2 - 0.3; root.add(sd);
      var mag = new THREE.Group(); var mb = K.mesh(K.G.rbox(0.04, 0.04, 0.02, 0.006), 'toolRed'); mag.add(mb); root.add(mag);
      var alu = isAlu(ctx.vehicle);
      return {
        root: root,
        update: function (t) {
          var poke = T.pulse(t, 0.6, 2.2);
          sd.position.set(0.03, PY + 0.01, 0.006 + 0.03 - poke * 0.035);
          var m = T.seg(t, 3.0, 3.8), fall = alu ? T.seg(t, 4.2, 5.0) : 0;
          mag.position.set(0.25, PY + 0.1 - fall * 0.5, 0.2 - m * 0.19 + fall * 0.05);
          mag.rotation.z = fall * 1.5;
        },
        labels: [
          { text: V('Šroubovák projde = prorezlé', 'Screwdriver goes through = rotten'), at: [0.03, PY + 0.08, 0.02], show: [1.2, 3], level: 'danger' },
          { text: alu ? V('Magnet nedrží = hliník → NESVAŘOVAT MIG ocelí', 'Magnet does not stick = aluminium → do NOT MIG with steel wire') : V('Magnet drží = ocel', 'Magnet sticks = steel'), at: [0.25, PY + 0.17, 0.05], show: [3.8, 7], level: alu ? 'danger' : 'ok' }
        ],
        captions: [
          { text: V('Rez skrz plech: vyříznout a zavařit záplatu', 'Rust through the metal: cut out and weld in a patch') },
          { text: V('Nosné díly (prahy, sloupky, podélníky) = karosárna!', 'Structural parts (sills, pillars, rails) = body shop!'), level: 'danger', show: [2.5, 7] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ cut out */
  R('welding.cut', {
    duration: 8, camera: CAM, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, pn = panel(ctx, K), root = pn.root;
      var rust = rustSpot(K, 0.09, pn.front + 0.0005); rust.position.set(0, PY, 0); root.add(rust);
      var rustF = K.FX.fader(rust);
      var hole = K.mesh(new THREE.PlaneGeometry(HOLE.w, HOLE.h), K.M.clone('blackOxide', { color: 0x070708 })); hole.position.set(0, PY, pn.front + 0.0012); root.add(hole);
      var edge = new THREE.Group();
      var pts = rectLoop(HOLE.w, HOLE.h, 4);
      [[0, HOLE.h / 2, HOLE.w, 0.006], [0, -HOLE.h / 2, HOLE.w, 0.006], [HOLE.w / 2, 0, 0.006, HOLE.h], [-HOLE.w / 2, 0, 0.006, HOLE.h]].forEach(function (e) {
        var m = K.mesh(K.G.box(e[2], e[3], 0.002), 'steel'); m.position.set(e[0], PY + e[1], pn.front + 0.0015); edge.add(m);
      });
      root.add(edge);
      var gr = grinder(K, false); gr.scale.setScalar(0.9); root.add(gr);
      var sp = sparks(K, 36); root.add(sp.group);
      var path = rectLoop(HOLE.w, HOLE.h, 120);
      return {
        root: root,
        update: function (t) {
          var k = T.lin(t, 0.8, 5.6);
          var on = t > 0.8 && t < 5.6;
          var p = path[Math.min(path.length - 1, Math.floor(k * path.length))];
          gr.position.set(p.x, PY + p.y + 0.02, 0.07);
          gr.rotation.set(0, 0, 0.2);
          gr.userData.disc.rotation.z = t * 80;
          sp.update(t, on, new THREE.Vector3(p.x, PY + p.y - 0.03, 0.02), new THREE.Vector3(0.2, -0.5, 1));
          var cut = T.seg(t, 5.6, 6.3);
          rustF(1 - cut); hole.visible = cut > 0.02; hole.scale.setScalar(Math.max(0.01, cut));
          edge.visible = t > 0.8;
          gr.visible = t < 6.4;
        },
        labels: [{ text: V('Řezat 2–3 cm do zdravého plechu', 'Cut 2–3 cm into sound metal'), at: [HOLE.w / 2 + 0.03, PY + HOLE.h / 2 + 0.05, 0.02], show: [1, 6], level: 'accent' }],
        captions: [
          { text: V('Rovný obdélník s rádiusy v rozích – snáz se dělá záplata', 'Straight rectangle with rounded corners – easier patch') },
          { text: V('Brýle + štít: kotouč může prasknout', 'Glasses + face shield: discs can shatter'), level: 'danger', show: [2, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ patch */
  R('welding.patch', {
    duration: 7, camera: CAM, shadow: 1.2, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, pn = panel(ctx, K), root = pn.root;
      var hole = K.mesh(new THREE.PlaneGeometry(HOLE.w, HOLE.h), K.M.clone('blackOxide', { color: 0x070708 })); hole.position.set(0, PY, pn.front + 0.0012); root.add(hole);
      var patch = K.mesh(K.G.rbox(HOLE.w - 0.002, HOLE.h - 0.002, 0.008, 0.002), 'steel'); root.add(patch);
      var mags = [[-1, 1], [1, 1], [-1, -1], [1, -1]].map(function (s) {
        var m = new THREE.Group(); var b = K.mesh(K.G.box(0.035, 0.035, 0.012), 'toolRed'); m.add(b);
        root.add(m); m.userData.s = s; return m;
      });
      var gap = new THREE.Group();
      return {
        root: root,
        update: function (t) {
          var inK = T.seg(t, 0.6, 2.6);
          patch.position.set(0.3 * (1 - inK), PY + 0.15 * (1 - inK), pn.front + 0.004 + 0.12 * (1 - inK));
          patch.rotation.y = (1 - inK) * 0.6;
          mags.forEach(function (m, i) {
            var k = T.seg(t, 3 + i * 0.4, 3.4 + i * 0.4);
            m.position.set(m.userData.s[0] * (HOLE.w / 2 - 0.005), PY + m.userData.s[1] * (HOLE.h / 2 - 0.005), pn.front + 0.01 + (1 - k) * 0.1);
            m.visible = k > 0.01;
          });
        },
        labels: [
          { text: V('Stejná tloušťka plechu (měřit)', 'Same metal thickness (measure)'), at: [0, PY + HOLE.h / 2 + 0.05, 0.02], show: [0.6, 3] },
          { text: V('Mezera ~1 mm (tloušťka drátu)', 'Gap ~1 mm (wire diameter)'), at: [HOLE.w / 2, PY, 0.02], show: [2.7, 7], level: 'accent' }
        ],
        captions: [
          { text: V('Záplatu přiložit natupo, zajistit magnety / svorkami', 'Fit the patch butt-to-butt, hold with magnets / clamps') },
          { text: V('Okraje očistit na lesklý kov (i zinek z rubu) – jinak póry', 'Clean edges to bright metal (zinc on the back too) – otherwise porosity'), show: [3.2, 7], level: 'info' }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ settings */
  R('welding.settings', {
    duration: 8, camera: { pos: [0.95, 0.75, 0.9], target: [0.05, 0.38, 0], fov: 36 }, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var w = welder(K, ctx, { step: 0 }); root.add(w);
      var spool = K.mesh(K.G.cylX(0.07, 0.05, 32), 'copper'); spool.position.set(0.0, 0.3, 0.12); root.add(spool);
      var test = K.mesh(K.G.box(0.3, 0.004, 0.2), 'steelDark'); test.position.set(0.45, 0.002, 0.25); root.add(test);
      return {
        root: root,
        update: function (t) {
          var st = t < 2 ? { wire: '0,6 mm' } : t < 4 ? { wire: '0,8 mm', v: '17 V' } : t < 6 ? { wire: '0,8 mm', v: '17 V', ws: '4,5 m/min' } : { wire: '0,8 mm', v: '17 V', ws: '4,5 m/min', gas: 'Ar/CO₂ 8–10 l/min' };
          w.userData.panel.userData.redraw(st);
          spool.rotation.x = t * 0.5;
        },
        labels: [
          { text: V('Drát 0,6 (tenký plech) / 0,8 mm', 'Wire 0.6 (thin sheet) / 0.8 mm'), at: [0.15, 0.48, 0.05], level: 'accent' },
          { text: V('Plyn Ar/CO₂ (ne čisté CO₂ pro tenký plech)', 'Ar/CO₂ gas (not pure CO₂ for thin sheet)'), at: [-0.05, 0.95, -0.38], show: [5, 8] },
          { text: V('Zkušební svár na odřezku', 'Test weld on scrap'), at: [0.45, 0.06, 0.25], show: [6, 8] }
        ],
        captions: [
          { text: V('Hodnoty jsou orientační – řiďte se tabulkou na svářečce', 'Values are indicative – follow the chart on the welder'), level: 'info' }
        ]
      };
    }
  });

  /* ------------------------------------------------- tack + stitch welds */
  function weldScene(stitch) {
    return {
      duration: stitch ? 11 : 8, camera: { pos: [0.42, 1.08, 0.75], target: [0, 0.95, 0], fov: 32 }, shadow: 1.2, thumbT: stitch ? 6 : 4,
      build: function (ctx, K) {
        var T = K.T, pn = panel(ctx, K), root = pn.root;
        var patch = K.mesh(K.G.rbox(HOLE.w - 0.002, HOLE.h - 0.002, 0.008, 0.002), 'steel'); patch.position.set(0, PY, pn.front + 0.004); root.add(patch);
        var hot = new THREE.MeshStandardMaterial({ color: 0xff8a2a, emissive: 0xff5a00, emissiveIntensity: 2.2, roughness: 0.4 });
        var warm = new THREE.MeshStandardMaterial({ color: 0x7a4a3a, emissive: 0x6a1a00, emissiveIntensity: 0.6, roughness: 0.5 });
        var cold = K.M.clone('blackOxide', { color: 0x4a4a4e, metalness: 0.6, roughness: 0.5 });
        var loop = rectLoop(HOLE.w, HOLE.h, stitch ? 64 : 16);
        // tack order: spread around the patch (opposite sides) to avoid warping
        var order = [];
        var n = loop.length;
        if (!stitch) { for (var i = 0; i < n / 2; i++) { order.push(i * 2 % n); order.push((i * 2 + n / 2) % n); } }
        else { for (var j = 0; j < n; j++) order.push((j * 9) % n); }
        var seen = {}; order = order.filter(function (x) { if (seen[x]) return false; seen[x] = 1; return true; });
        var beads = order.map(function (idx) {
          var p = loop[idx];
          var b = new THREE.Mesh(K.G.sphere(0.0065, 10), cold); b.scale.set(1, 1, 0.45);
          b.position.set(p.x, PY + p.y, pn.front + 0.008); root.add(b); return b;
        });
        var torch = migTorch(K); torch.scale.setScalar(1.2); root.add(torch);
        var sp = sparks(K, 18, { spread: 1.2 }); root.add(sp.group);
        var dur = stitch ? 8.5 : 6.4, step = dur / beads.length;
        return {
          root: root,
          update: function (t) {
            var cur = Math.floor((t - 0.5) / step);
            beads.forEach(function (b, i) {
              var age = t - 0.5 - i * step - step * 0.6;
              b.visible = t - 0.5 > i * step + step * 0.3;
              b.material = age < 0.4 ? hot : age < 1.4 ? warm : cold;
            });
            var active = cur >= 0 && cur < beads.length;
            var tgt = active ? beads[cur].position : beads[beads.length - 1].position;
            var inArc = active && ((t - 0.5) % step) > step * 0.25 && ((t - 0.5) % step) < step * 0.8;
            torch.position.set(tgt.x, tgt.y, tgt.z + 0.018);
            torch.rotation.set(-0.35, 0.25, 0);
            setArc(torch, inArc, t);
            sp.update(t, inArc, tgt.clone().add(new THREE.Vector3(0, 0, 0.01)), new THREE.Vector3(0, 0.4, 1));
          },
          labels: stitch ? [
            { text: V('Body střídat po obvodu, nechat vychladnout', 'Alternate spots around, let them cool'), at: [0, PY + HOLE.h / 2 + 0.05, 0.02], level: 'accent' }
          ] : [
            { text: V('1. stehy naproti sobě', '1. tacks on opposite sides'), at: [0, PY + HOLE.h / 2 + 0.05, 0.02], level: 'accent' }
          ],
          captions: stitch ? [
            { text: V('Krátké body 1–2 cm, žádný souvislý šev – plech se nezkroutí', 'Short 1–2 cm spots, no continuous seam – the panel will not warp') },
            { text: V('Nikdy se nedívat do oblouku bez kukly – popálení sítnice', 'Never look at the arc without a helmet – retina burns'), level: 'danger', show: [2, 11] }
          ] : [
            { text: V('Stehovat křížem – teplo rozložit, plech se nekroutí', 'Tack in a cross pattern – spread the heat, no warping') },
            { text: V('Kukla dolů před každým zapálením oblouku', 'Helmet down before every arc'), level: 'danger', show: [2, 8] }
          ]
        };
      }
    };
  }
  R('welding.tack', weldScene(false));
  R('welding.stitch', weldScene(true));

  /* ------------------------------------------------------------ grind */
  R('welding.grind', {
    duration: 8, camera: { pos: [0.5, 1.12, 0.95], target: [0, 0.94, 0], fov: 33 }, shadow: 1.2, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, pn = panel(ctx, K), root = pn.root;
      var patch = K.mesh(K.G.rbox(HOLE.w - 0.002, HOLE.h - 0.002, 0.008, 0.002), 'steel'); patch.position.set(0, PY, pn.front + 0.004); root.add(patch);
      var loop = rectLoop(HOLE.w, HOLE.h, 48);
      var beadMat = K.M.clone('blackOxide', { color: 0x55555a, metalness: 0.6 });
      var beads = loop.map(function (p) { var b = new THREE.Mesh(K.G.sphere(0.0065, 10), beadMat); b.scale.set(1.3, 1.3, 0.45); b.position.set(p.x, PY + p.y, pn.front + 0.008); root.add(b); return b; });
      var gr = grinder(K, true); gr.scale.setScalar(0.85); root.add(gr);
      var sp = sparks(K, 30); root.add(sp.group);
      return {
        root: root,
        update: function (t) {
          var k = T.lin(t, 0.6, 6.4), idx = Math.min(beads.length - 1, Math.floor(k * beads.length));
          beads.forEach(function (b, i) { var done = i < idx ? 1 : 0; b.scale.set(1.3, 1.3, 0.45 - done * 0.4); b.material = beadMat; });
          var p = beads[idx].position;
          var on = t > 0.6 && t < 6.4;
          gr.position.set(p.x - 0.01, p.y + 0.03, p.z + 0.06); gr.rotation.set(-0.2, 0.3, 0.2);
          gr.userData.disc.rotation.z = t * 80;
          sp.update(t, on, p.clone(), new THREE.Vector3(0.6, -0.6, 0.6));
        },
        labels: [{ text: V('Nebrousit do plechu – jen svar', 'Do not grind into the panel – only the weld'), at: [HOLE.w / 2, PY + HOLE.h / 2 + 0.04, 0.02], show: [1, 8], level: 'accent' }],
        captions: [
          { text: V('Lamelový kotouč P60–P80, zarovnat svary', 'Flap disc P60–P80, level the welds') },
          { text: V('Jiskry daleko od paliva, oleje a čalounění', 'Sparks away from fuel, oil and upholstery'), level: 'danger', show: [2, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ seam sealer + primer */
  R('welding.seal', {
    duration: 8, camera: { pos: [0.5, 1.12, 0.95], target: [0, 0.94, 0], fov: 33 }, shadow: 1.2, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, pn = panel(ctx, K), root = pn.root;
      var patch = K.mesh(K.G.rbox(HOLE.w - 0.002, HOLE.h - 0.002, 0.008, 0.002), 'steel'); patch.position.set(0, PY, pn.front + 0.004); root.add(patch);
      var epoxy = K.mesh(K.G.rbox(HOLE.w + 0.06, HOLE.h + 0.06, 0.003, 0.001), K.M.clone('epoxy', { transparent: true, opacity: 0 })); epoxy.position.set(0, PY, pn.front + 0.008); root.add(epoxy);
      var loop = rectLoop(HOLE.w, HOLE.h, 80);
      var sealMat = K.M.clone('plasticWhite', { color: 0xd9d6cf, roughness: 0.8 });
      var seal = loop.map(function (p) { var s = new THREE.Mesh(K.G.sphere(0.005, 8), sealMat); s.scale.set(1.4, 1.4, 0.5); s.position.set(p.x, PY + p.y, pn.front + 0.011); root.add(s); return s; });
      var gun = new THREE.Group();
      var tube = K.mesh(K.G.cylZ(0.022, 0.2, 20), 'plasticWhite'); tube.position.z = 0.13; gun.add(tube);
      var noz = K.mesh(K.G.lathe([[0.002, 0], [0.008, 0.05], [0.01, 0.05]], 16), 'plasticWhite'); noz.rotation.x = -PI / 2; noz.position.z = 0.03; gun.add(noz);
      var frame = K.mesh(K.G.box(0.01, 0.03, 0.26), 'steel'); frame.position.set(0, -0.03, 0.15); gun.add(frame);
      var hand = K.mesh(K.G.box(0.02, 0.12, 0.03), 'toolRed'); hand.position.set(0, -0.09, 0.25); gun.add(hand);
      root.add(gun);
      return {
        root: root,
        update: function (t) {
          var k = T.lin(t, 0.6, 4.6), idx = Math.floor(k * seal.length);
          seal.forEach(function (s, i) { s.visible = i < idx; });
          var p = seal[Math.min(seal.length - 1, idx)].position;
          gun.position.set(p.x, p.y, p.z + 0.005); gun.rotation.set(-0.4, 0.3, 0);
          gun.visible = t < 4.9;
          epoxy.material.opacity = 0.85 * T.seg(t, 5.2, 6.4);
        },
        labels: [{ text: V('Epoxidový základ přes holý kov', 'Epoxy primer over bare metal'), at: [0, PY - HOLE.h / 2 - 0.05, 0.02], show: [5.3, 8], level: 'ok' }],
        captions: [
          { text: V('Těsnicí tmel na spoje (i z rubu), pak epoxid', 'Seam sealer on the joints (back side too), then epoxy') },
          { text: V('Dál pokračujte návodem Klempířské práce (tmel, plnič, lak)', 'Continue with the Bodywork tutorial (filler, primer, paint)'), level: 'info', show: [5, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ cavity wax */
  R('welding.wax', {
    duration: 7, camera: { pos: [0.75, 0.75, 0.95], target: [0, 0.45, 0], fov: 36 }, shadow: 1.2, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var paint = K.M.carPaint(K.carSpec(ctx.vehicle).paint);
      // cut-away sill box section
      var sill = new THREE.Group();
      var outer = K.mesh(K.G.box(1.0, 0.16, 0.008), paint); outer.position.set(0, 0.4, 0.07); sill.add(outer);
      var inner = K.mesh(K.G.box(1.0, 0.16, 0.008), 'primerGrey'); inner.position.set(0, 0.4, -0.07); sill.add(inner);
      var top = K.mesh(K.G.box(1.0, 0.008, 0.14), 'primerGrey'); top.position.set(0, 0.48, 0); sill.add(top);
      var bottom = K.mesh(K.G.box(1.0, 0.008, 0.14), 'primerGrey'); bottom.position.set(0, 0.32, 0); sill.add(bottom);
      var plug = K.mesh(K.G.cylZ(0.012, 0.01, 16), 'rubber'); plug.position.set(-0.45, 0.4, -0.078); sill.add(plug);
      outer.material = K.M.clone(paint, { transparent: true, opacity: 0.25 });
      root.add(sill);
      var waxMat = K.M.clone('oil', { color: 0xb8913a, opacity: 0.0 });
      var wax = K.mesh(K.G.box(0.98, 0.15, 0.13), waxMat); wax.position.set(0, 0.4, 0); wax.scale.set(0.001, 1, 1); root.add(wax);
      var wand = K.mesh(K.G.tube([[-0.6, 0.4, -0.25], [-0.5, 0.4, -0.12], [-0.45, 0.4, -0.06], [0.0, 0.4, 0.0]], 0.004, false, 40, 8), 'plasticWhite'); root.add(wand);
      var puff = K.FX.puff(0xc9a24a, 18, 0.06, 0.1); root.add(puff.group);
      var stands = [[-0.4], [0.4]].map(function (x) { var p = K.mesh(K.G.box(0.04, 0.32, 0.04), 'steelDark'); p.position.set(x[0], 0.16, 0); root.add(p); return p; });
      return {
        root: root,
        update: function (t) {
          var k = T.lin(t, 0.8, 5.5);
          var tip = -0.45 + k * 0.85;
          wand.position.x = k * 0.85 - 0.45 + 0.45;
          wand.position.x = tip;
          puff.group.position.set(tip, 0.4, 0);
          puff.update(t, t > 0.8 && t < 5.5);
          wax.scale.x = Math.max(0.001, k); wax.position.x = -0.49 + k * 0.49;
          waxMat.opacity = 0.45 * Math.min(1, k * 3);
        },
        labels: [{ text: V('Dutinový vosk do celé dutiny', 'Cavity wax into the whole cavity'), at: [0, 0.55, 0], level: 'ok' }],
        captions: [
          { text: V('Teprve po lakování: vosk přes otvory / zátky prahu', 'Only after painting: wax through the sill holes / plugs') },
          { text: V('Vosk je hořlavý – nikdy před svařováním v okolí', 'Wax is flammable – never before welding nearby'), level: 'danger', show: [2.5, 7] }
        ]
      };
    }
  });
})(window.STU);
