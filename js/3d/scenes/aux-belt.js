/* 3D scenes: auxiliary (poly-V) belt, tensioner and pulleys. Also defines S.n4 helpers used by
 * thermostat-pump.js, aircon.js and engine-mounts.js (only called at build time, so load order is irrelevant). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  var N4 = S.n4 = S.n4 || {};

  /* ------------------------------------------------------------ shared helpers */
  /** Ribbed (poly-V) or smooth pulley, axis Z, face towards +Z. */
  N4.pulley = function (K, r, opts) {
    opts = opts || {};
    var w = opts.w || 0.026, g = new THREE.Group();
    var pts = [];
    if (opts.smooth) {
      pts = [[r * 0.35, -w / 2], [r + 0.003, -w / 2], [r + 0.003, -w / 2 + 0.003], [r, -w / 2 + 0.004], [r, w / 2 - 0.004], [r + 0.003, w / 2 - 0.003], [r + 0.003, w / 2], [r * 0.35, w / 2]];
    } else {
      pts.push([r * 0.35, -w / 2], [r + 0.004, -w / 2]);
      var ribs = 6, step = (w - 0.006) / ribs;
      for (var i = 0; i <= ribs; i++) {
        var z = -w / 2 + 0.003 + i * step;
        pts.push([r, z]);
        if (i < ribs) pts.push([r - 0.0025, z + step / 2]);
      }
      pts.push([r + 0.004, w / 2], [r * 0.35, w / 2]);
    }
    var body = K.mesh(K.G.latheZ(pts, 48), opts.mat || (opts.smooth ? 'steel' : 'steelDark'));
    g.add(body);
    var hub = K.mesh(K.G.cylZ(r * 0.35, w + 0.004, 24), 'blackOxide'); g.add(hub);
    var bolt = K.mesh(K.G.hex(Math.min(0.009, r * 0.25), 0.01), 'zinc'); bolt.rotation.x = PI / 2; bolt.position.z = w / 2 + 0.006; g.add(bolt);
    // marks so rotation is visible
    for (var k = 0; k < 3; k++) {
      var m = K.mesh(K.G.box(r * 0.5, 0.004, 0.002), 'plasticWhite');
      m.geometry.translate(r * 0.55, 0, 0); m.rotation.z = k * PI * 2 / 3; m.position.z = w / 2 + 0.0015; g.add(m);
    }
    return g;
  };

  /** Coolant material per vehicle. */
  N4.coolant = function (K, vid) {
    if (vid === 'skoda-octavia-rs-tdi') return K.M.coolantViolet;
    if (vid === 'toyota-gr-yaris') return K.M.coolantPink;
    return K.M.coolantBlue;
  };

  /** Round dial gauge (temperature / pressure) facing +Z. draw(ctx,W,H) via canvasPanel; returns {group, needle, setValue(k 0..1)} */
  N4.gauge = function (K, r, label, zones) {
    var g = new THREE.Group();
    var rim = K.mesh(K.G.cylZ(r * 1.08, 0.02, 48), 'chrome'); g.add(rim);
    var face = K.FX.canvasPanel(r * 2, r * 2, function (c, W, H) {
      c.fillStyle = '#f4f4f0'; c.beginPath(); c.arc(W / 2, H / 2, W / 2, 0, PI * 2); c.fill();
      (zones || [[0, 0.25, '#3e8ed0'], [0.25, 0.75, '#30a46c'], [0.75, 1, '#e5484d']]).forEach(function (z) {
        c.strokeStyle = z[2]; c.lineWidth = W * 0.06; c.beginPath();
        c.arc(W / 2, H / 2, W * 0.38, PI * 0.75 + z[0] * PI * 1.5, PI * 0.75 + z[1] * PI * 1.5); c.stroke();
      });
      c.fillStyle = '#222'; c.font = 'bold ' + Math.round(W * 0.1) + 'px system-ui, sans-serif'; c.textAlign = 'center';
      c.fillText(label || '', W / 2, H * 0.78);
    }, { px: 256, transparent: true });
    face.position.z = 0.0105; g.add(face);
    var needle = new THREE.Group();
    var n = K.mesh(K.G.box(0.004, r * 0.8, 0.003), 'hiDanger'); n.position.y = r * 0.4; needle.add(n);
    var hubN = K.mesh(K.G.cylZ(r * 0.08, 0.006, 16), 'blackOxide'); needle.add(hubN);
    needle.position.z = 0.014; g.add(needle);
    var glass = K.mesh(K.G.cylZ(r * 1.02, 0.002, 48), 'glassClear'); glass.position.z = 0.02; g.add(glass);
    return { group: g, setValue: function (k) { needle.rotation.z = PI * 0.75 - Math.max(0, Math.min(1, k)) * PI * 1.5; } };
  };

  /** Simple engine front cover block (for belt drives). Plate in the XY plane at z=0, facing +Z. */
  N4.frontBlock = function (K, w, h) {
    var g = new THREE.Group();
    var plate = K.mesh(K.G.rbox(w, h, 0.06, 0.03), 'aluCast'); plate.position.z = -0.05; g.add(plate);
    var block = K.mesh(K.G.rbox(w * 0.9, h * 0.9, 0.5, 0.03), 'castIron'); block.position.z = -0.33; g.add(block);
    for (var i = 0; i < 10; i++) {
      var b = K.mesh(K.G.hex(0.006, 0.006), 'zinc'); b.rotation.x = PI / 2;
      b.position.set(-w / 2 + 0.03 + (i % 5) * (w - 0.06) / 4, i < 5 ? h / 2 - 0.03 : -h / 2 + 0.03, -0.017); g.add(b);
    }
    return g;
  };

  /* Belt drive layouts per vehicle (metres, engine front view, CCW order around the drive).
   * type: r = ribbed pulley (belt rib side), s = smooth idler/tensioner. Layouts are schematic – verify in the manual. */
  var LAYOUT = {
    generic: [
      { id: 'crank', x: 0, y: 0, r: 0.078, t: 'r', l: V('Klikový hřídel', 'Crankshaft') },
      { id: 'ac', x: 0.24, y: 0.06, r: 0.058, t: 'r', l: V('Kompresor klimatizace', 'A/C compressor') },
      { id: 'idler', x: 0.2, y: 0.27, r: 0.035, t: 's', l: V('Vodicí kladka', 'Idler') },
      { id: 'alt', x: 0.06, y: 0.4, r: 0.03, t: 'r', l: V('Alternátor', 'Alternator'), decoupler: true },
      { id: 'tens', x: -0.1, y: 0.24, r: 0.036, t: 's', l: V('Napínák', 'Tensioner'), tens: true }
    ],
    'mb-cl500-c216': [
      { id: 'crank', x: 0, y: 0, r: 0.1, t: 'r', l: V('Klikový hřídel', 'Crankshaft') },
      { id: 'ac', x: 0.3, y: 0.08, r: 0.06, t: 'r', l: V('Kompresor klimatizace', 'A/C compressor') },
      { id: 'tandem', x: 0.32, y: 0.34, r: 0.06, t: 'r', l: V('Tandemové čerpadlo (řízení + ABC)', 'Tandem pump (steering + ABC)') },
      { id: 'wp', x: 0.06, y: 0.36, r: 0.07, t: 's', l: V('Vodní pumpa', 'Water pump') },
      { id: 'alt', x: -0.24, y: 0.42, r: 0.032, t: 'r', l: V('Alternátor', 'Alternator'), decoupler: true },
      { id: 'tens', x: -0.26, y: 0.14, r: 0.04, t: 's', l: V('Napínák', 'Tensioner'), tens: true }
    ],
    'volvo-xc60-b4': [
      { id: 'crank', x: 0, y: 0, r: 0.08, t: 'r', l: V('Klikový hřídel', 'Crankshaft') },
      { id: 'ac', x: 0.25, y: 0.05, r: 0.058, t: 'r', l: V('Kompresor klimatizace', 'A/C compressor') },
      { id: 'tens2', x: 0.2, y: 0.25, r: 0.035, t: 's', l: V('Napínák (dvojitý)', 'Tensioner (dual)'), tens: true },
      { id: 'isg', x: 0.04, y: 0.42, r: 0.045, t: 'r', l: V('48V startér-generátor (ISGM)', '48V starter-generator (ISGM)'), danger: true },
      { id: 'idler', x: -0.12, y: 0.22, r: 0.035, t: 's', l: V('Vodicí kladka', 'Idler') }
    ],
    'skoda-octavia-rs-tdi': [
      { id: 'crank', x: 0, y: 0, r: 0.078, t: 'r', l: V('Klikový hřídel (tlumič)', 'Crankshaft (damper)') },
      { id: 'ac', x: 0.24, y: 0.04, r: 0.058, t: 'r', l: V('Kompresor klimatizace', 'A/C compressor') },
      { id: 'alt', x: 0.14, y: 0.36, r: 0.03, t: 'r', l: V('Alternátor (volnoběžka)', 'Alternator (freewheel)'), decoupler: true },
      { id: 'tens', x: -0.08, y: 0.24, r: 0.036, t: 's', l: V('Napínák', 'Tensioner'), tens: true }
    ],
    'toyota-gr-yaris': [
      { id: 'crank', x: 0, y: 0, r: 0.072, t: 'r', l: V('Klikový hřídel', 'Crankshaft') },
      { id: 'ac', x: 0.22, y: 0.05, r: 0.055, t: 'r', l: V('Kompresor klimatizace', 'A/C compressor') },
      { id: 'alt', x: 0.12, y: 0.36, r: 0.03, t: 'r', l: V('Alternátor', 'Alternator'), decoupler: true },
      { id: 'tens', x: -0.08, y: 0.22, r: 0.034, t: 's', l: V('Napínák', 'Tensioner'), tens: true }
    ],
    'citroen-jumper-22hdi': [
      { id: 'crank', x: 0, y: 0, r: 0.08, t: 'r', l: V('Klikový hřídel', 'Crankshaft') },
      { id: 'ac', x: 0.26, y: 0.06, r: 0.058, t: 'r', l: V('Kompresor klimatizace (je-li)', 'A/C compressor (if fitted)') },
      { id: 'idler', x: 0.24, y: 0.3, r: 0.035, t: 's', l: V('Vodicí kladka', 'Idler') },
      { id: 'alt', x: 0.06, y: 0.44, r: 0.032, t: 'r', l: V('Alternátor', 'Alternator'), decoupler: true },
      { id: 'tens', x: -0.12, y: 0.24, r: 0.038, t: 's', l: V('Napínák', 'Tensioner'), tens: true }
    ]
  };

  /** Build an accessory drive rig. returns { root, pulleys{id:{group,def}}, setTension(k 0..1 released), setBelt(opacity), beltT(t) (animate), center } */
  N4.auxRig = function (K, vid, opts) {
    opts = opts || {};
    var lay = (LAYOUT[vid] || LAYOUT.generic).map(function (p) { return Object.assign({}, p); });
    var root = new THREE.Group();
    var xs = lay.map(function (p) { return p.x; }), ys = lay.map(function (p) { return p.y; });
    var cx = (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2, cy = (Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2;
    var w = Math.max.apply(null, xs) - Math.min.apply(null, xs) + 0.32, h = Math.max.apply(null, ys) - Math.min.apply(null, ys) + 0.3;
    var fb = N4.frontBlock(K, w, h); fb.position.set(cx, cy, -0.03); root.add(fb);
    var tens = lay.filter(function (p) { return p.tens; })[0];
    var pivot = new THREE.Vector2(tens.x + (tens.x < cx ? -0.02 : 0.02), tens.y - 0.09);
    var armLen = Math.hypot(tens.x - pivot.x, tens.y - pivot.y), arm0 = Math.atan2(tens.y - pivot.y, tens.x - pivot.x);
    var releaseA = (tens.x < cx ? -1 : 1) * 0.42;

    var pulleys = {};
    lay.forEach(function (p) {
      var pg = N4.pulley(K, p.r, { smooth: p.t === 's', mat: p.id === 'isg' ? 'alu' : null });
      pg.position.set(p.x, p.y, 0);
      root.add(pg);
      pulleys[p.id] = { group: pg, def: p };
      if (p.id === 'alt' || p.id === 'isg') {
        var body = K.mesh(K.G.cylZ(p.id === 'isg' ? 0.09 : 0.075, 0.14, 32), 'alu'); body.position.set(p.x, p.y, -0.1); root.add(body);
        for (var f = 0; f < 12; f++) { var fin = K.mesh(K.G.box(0.004, 0.02, 0.1), 'aluCast'); var a = f / 12 * PI * 2; fin.position.set(p.x + Math.cos(a) * (p.id === 'isg' ? 0.09 : 0.075), p.y + Math.sin(a) * (p.id === 'isg' ? 0.09 : 0.075), -0.1); fin.rotation.z = a; root.add(fin); }
        if (p.id === 'isg') { var hv = K.mesh(K.G.tube([[p.x + 0.08, p.y - 0.02, -0.12], [p.x + 0.2, p.y - 0.05, -0.12], [p.x + 0.3, p.y + 0.05, -0.2]], 0.012), K.M.clone('toolBlue', { color: 0x1e5bb8 })); root.add(hv); }
      }
      if (p.id === 'ac') { var comp = K.mesh(K.G.cylZ(0.065, 0.18, 32), 'aluCast'); comp.position.set(p.x, p.y, -0.12); root.add(comp); }
      if (p.id === 'tandem') { var pump = K.mesh(K.G.cylZ(0.06, 0.14, 32), 'aluCast'); pump.position.set(p.x, p.y, -0.1); root.add(pump); }
    });
    // tensioner arm + body
    var armG = new THREE.Group(); armG.position.set(pivot.x, pivot.y, 0.0);
    var armM = K.mesh(K.G.rbox(armLen + 0.04, 0.03, 0.014, 0.006), 'aluCast'); armM.position.set(armLen / 2, 0, -0.022); armG.add(armM);
    var hexT = K.mesh(K.G.hex(0.009, 0.012), 'zinc'); hexT.rotation.x = PI / 2; hexT.position.set(armLen * 0.45, 0, -0.008); armG.add(hexT);
    var pin = K.mesh(K.G.cylZ(0.0025, 0.03, 8), 'chrome'); pin.position.set(armLen * 0.2, 0.012, -0.01); armG.add(pin);
    root.add(armG);
    var tBody = K.mesh(K.G.cylZ(0.04, 0.05, 32), 'aluCast'); tBody.position.set(pivot.x, pivot.y, -0.045); root.add(tBody);
    var windowM = K.mesh(K.G.box(0.02, 0.008, 0.002), 'hiOk'); windowM.position.set(pivot.x + 0.03, pivot.y - 0.035, -0.019); root.add(windowM);
    armG.rotation.z = arm0;

    // belt geometries for several tensioner positions (prebuilt – no allocation during animation)
    var STEPS = 8, belts = [], beltMat = K.M.clone('rubber', { color: 0x1a1b1e, roughness: 0.75, transparent: true });
    function circlesFor(k) {
      return lay.map(function (p) {
        if (!p.tens) return { x: p.x, y: p.y, r: p.r + 0.0005 };
        var a = arm0 + releaseA * k;
        return { x: pivot.x + Math.cos(a) * armLen, y: pivot.y + Math.sin(a) * armLen, r: p.r + 0.0005 };
      });
    }
    var paths = [], lens = [];
    for (var i = 0; i <= STEPS; i++) {
      var path = K.G.beltPath(circlesFor(i / STEPS), 0.006);
      paths.push(path); lens.push(K.G.pathLengths(path));
      var bm = K.mesh(K.G.ribbon(path, 0.0055, 0.022), beltMat); bm.visible = i === 0; root.add(bm); belts.push(bm);
    }
    // printed marks travelling with the belt
    var lengths = K.G.pathLengths(paths[0]), marks = [];
    for (var m = 0; m < 8; m++) { var mk = K.mesh(K.G.box(0.01, 0.006, 0.016), 'plasticWhite'); mk.userData.noShadow = true; root.add(mk); marks.push(mk); }
    var total = lengths[lengths.length - 1];
    var cur = 0, beltOpacity = 1;

    var rig = {
      root: root, pulleys: pulleys, lay: lay, center: new THREE.Vector3(cx, cy, 0), size: Math.max(w, h),
      tensPivot: pivot, armG: armG, pin: pin, hexT: hexT,
      setTension: function (k) {
        var a = arm0 + releaseA * k;
        armG.rotation.z = a;
        var tp = pulleys[tens.id].group;
        tp.position.set(pivot.x + Math.cos(a) * armLen, pivot.y + Math.sin(a) * armLen, 0);
        cur = Math.round(k * STEPS);
        belts.forEach(function (b, bi) { b.visible = bi === cur && beltOpacity > 0.02; });
      },
      setBelt: function (op, offsetZ) {
        beltOpacity = op;
        beltMat.opacity = op; beltMat.depthWrite = op > 0.98;
        belts.forEach(function (b, bi) { b.visible = bi === cur && op > 0.02; b.position.z = offsetZ || 0; });
        marks.forEach(function (mk) { mk.visible = op > 0.6; mk.position.z = (offsetZ || 0) + 0.002; });
      },
      /** run the drive: s = belt travel distance (m) */
      run: function (s) {
        lay.forEach(function (p) { pulleys[p.id].group.rotation.z = -s / p.r; });
        var path = paths[cur], L = lens[cur];
        var tot = L[L.length - 1];
        marks.forEach(function (mk, i) {
          var pnt = K.G.pointAt(path, L, -s + i * tot / marks.length);
          var nxt = K.G.pointAt(path, L, -s + i * tot / marks.length + 0.005);
          mk.position.x = pnt.x; mk.position.y = pnt.y;
          mk.rotation.z = Math.atan2(nxt.y - pnt.y, nxt.x - pnt.x);
        });
      }
    };
    rig.setTension(0);
    rig.setBelt(1);
    return rig;
  };
  N4.LAYOUT = LAYOUT;

  function camFor(rig, dist, dx, dy) {
    var c = rig.center;
    return { pos: [c.x + (dx || 0.25), c.y + (dy || 0.12), (dist || 1.0) * Math.max(0.9, rig.size * 1.7)], target: [c.x, c.y, 0], fov: 32 };
  }
  function pW(rig, id, off) { var v = rig.pulleys[id].group.getWorldPosition(new THREE.Vector3()); if (off) v.add(new THREE.Vector3(off[0], off[1], off[2])); return v; }

  /* ------------------------------------------------------------------ scenes */
  R('aux-belt.overview', {
    duration: 8, camera: { pos: [0.3, 0.3, 1.1], target: [0.08, 0.2, 0], fov: 32 }, shadow: 1, ground: false, thumbT: 2,
    build: function (ctx, K) {
      var rig = N4.auxRig(K, ctx.vehicle);
      var labels = rig.lay.map(function (p) {
        return { text: p.l, at: function () { return pW(rig, p.id, [0, p.r + 0.03, 0.02]); }, level: p.danger ? 'danger' : (p.tens ? 'accent' : null), show: [0.5, 8] };
      });
      return {
        root: rig.root,
        update: function (t) { rig.run(t * 0.9); },
        cameraPath: function () { return camFor(rig, 1.05); },
        labels: labels,
        captions: [
          { text: V('Drážkový řemen pohání příslušenství – alternátor, klimatizaci, čerpadla', 'The poly-V belt drives the accessories – alternator, A/C, pumps') },
          { text: ctx.vehicle === 'volvo-xc60-b4' ? V('XC60: řemen startuje motor přes 48V startér-generátor!', 'XC60: the belt starts the engine via the 48V starter-generator!') : V('Uspořádání je schematické – ověřte štítek / příručku', 'Layout is schematic – check the label / manual'), level: ctx.vehicle === 'volvo-xc60-b4' ? 'danger' : 'info', show: [2.5, 8] }
        ]
      };
    }
  });

  R('aux-belt.prep', {
    duration: 7, camera: { pos: [0.55, 0.45, 0.75], target: [0, 0.12, 0], fov: 34 }, shadow: 0.8, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bat = new THREE.Group();
      var case_ = K.mesh(K.G.rbox(0.28, 0.19, 0.17, 0.012), 'plasticBlack'); case_.position.y = 0.095; bat.add(case_);
      var lid = K.mesh(K.G.rbox(0.285, 0.02, 0.175, 0.006), 'plasticGrey'); lid.position.y = 0.2; bat.add(lid);
      var posT = K.mesh(K.G.cyl(0.011, 0.022, 20), 'brass'); posT.position.set(0.09, 0.22, 0.04); bat.add(posT);
      var negT = K.mesh(K.G.cyl(0.011, 0.022, 20), 'brass'); negT.position.set(-0.09, 0.22, 0.04); bat.add(negT);
      var pc = K.mesh(K.G.cyl(0.016, 0.01, 16), 'hiDanger'); pc.position.set(0.09, 0.236, 0.04); bat.add(pc);
      root.add(bat);
      var clamp = new THREE.Group();
      var cl = K.mesh(K.G.rbox(0.04, 0.025, 0.03, 0.006), 'steel'); clamp.add(cl);
      var cable = K.mesh(K.G.tube([[0, 0, 0], [-0.05, 0.02, 0.05], [-0.18, -0.08, 0.12]], 0.008), 'rubber'); clamp.add(cable);
      root.add(clamp);
      var key = new THREE.Group();
      var kb = K.mesh(K.G.rbox(0.035, 0.06, 0.012, 0.008), 'plasticBlack'); key.add(kb);
      var kb2 = K.mesh(K.G.cyl(0.006, 0.01, 12), 'hiDanger'); kb2.rotation.x = PI / 2; kb2.position.set(0, 0.012, 0.007); key.add(kb2);
      root.add(key);
      var vol = ctx.vehicle === 'volvo-xc60-b4';
      return {
        root: root,
        update: function (t) {
          var up = T.seg(t, 1.2, 2.4);
          clamp.position.set(-0.09, 0.245 + up * 0.08, 0.04 + up * 0.05);
          clamp.rotation.z = up * 0.4;
          var away = T.seg(t, 3.4, 5);
          key.position.set(0.25 + away * 0.4, 0.05, 0.15 + away * 0.3);
          key.visible = away < 0.99;
        },
        labels: [{ text: V('− pól', '− terminal'), at: [-0.09, 0.3, 0.06], show: [0, 3] }],
        captions: [
          { text: V('Motor studený, klíč pryč, odpojit minus pól baterie', 'Engine cold, key away, disconnect the battery negative') },
          vol ? { text: V('XC60: odpojit 12V i 48V systém dle VIDA – jinak hrozí start motoru!', 'XC60: disconnect both 12V and 48V per VIDA – otherwise the engine may start!'), level: 'danger' }
            : { text: V('Ruce pryč od řemene, když může motor naskočit', 'Hands off the belt whenever the engine could start'), level: 'danger', show: [2.5, 7] }
        ]
      };
    }
  });

  R('aux-belt.inspect', {
    duration: 8, camera: { pos: [0.05, 0.14, 0.2], target: [0, 0.015, 0], fov: 34 }, shadow: 0.4, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      // a flat piece of belt seen from the rib side, twisted to show the ribs
      var piece = new THREE.Group();
      var back = K.mesh(K.G.box(0.36, 0.004, 0.022), K.M.clone('rubber', { color: 0x1c1d20 })); piece.add(back);
      for (var r = 0; r < 6; r++) {
        var rib = K.mesh(K.G.extrude([[-0.0017, 0], [0.0017, 0], [0.0007, -0.003], [-0.0007, -0.003]], 0.36, 0.0003), 'rubber');
        rib.rotation.y = PI / 2; rib.position.set(0, -0.002, -0.009 + r * 0.0036); piece.add(rib);
      }
      var cracks = [];
      for (var c = 0; c < 9; c++) {
        var cr = K.mesh(K.G.box(0.0012, 0.0012, 0.022), 'plasticWhite'); cr.position.set(-0.12 + c * 0.012, -0.005, 0); piece.add(cr); cracks.push(cr);
      }
      var glaze = K.mesh(K.G.box(0.06, 0.0006, 0.021), K.M.clone('chrome', { roughness: 0.05, color: 0x444444 })); glaze.position.set(0.06, -0.0055, 0); piece.add(glaze);
      var chunk = K.mesh(K.G.box(0.012, 0.0035, 0.004), 'hiDanger'); chunk.position.set(0.13, -0.004, 0.006); piece.add(chunk);
      piece.rotation.x = PI; piece.position.y = 0.02; piece.scale.set(1, 1.6, 1.6);
      root.add(piece);
      var torch = new THREE.Group();
      var tb = K.mesh(K.G.cylX(0.012, 0.12, 20), 'plasticBlack'); tb.position.x = 0.06; torch.add(tb);
      var lens = K.mesh(K.G.cylX(0.014, 0.005, 20), 'lightWhite'); torch.add(lens);
      torch.position.set(0.18, 0.09, 0.06); torch.rotation.z = -0.5; root.add(torch);
      var spot = new THREE.SpotLight(0xffffff, 1.2, 1, 0.5, 0.6); spot.position.copy(torch.position); spot.target = piece; root.add(spot);
      return {
        root: root,
        update: function (t) { piece.position.x = Math.sin(t * PI / 4) * 0.06; cracks.forEach(function (cr, i) { cr.visible = t > 1 + i * 0.12; }); },
        labels: [
          { text: V('Příčné trhliny', 'Cross cracks'), at: function () { return piece.position.clone().add(new THREE.Vector3(-0.07, 0.03, 0.01)); }, show: [1.5, 8], level: 'danger' },
          { text: V('Lesklé (sklovité) žebro = prokluz', 'Shiny (glazed) ribs = slipping'), at: function () { return piece.position.clone().add(new THREE.Vector3(0.06, 0.03, 0.01)); }, show: [3, 8], level: 'accent' },
          { text: V('Vylomené žebro', 'Missing rib chunk'), at: function () { return piece.position.clone().add(new THREE.Vector3(0.13, 0.03, 0.01)); }, show: [4.5, 8], level: 'danger' }
        ],
        captions: [
          { text: V('Řemen prohlédněte po celé délce – motor otáčejte klíčem, ne startérem', 'Inspect the whole length – turn the engine with a wrench, not the starter') },
          { text: V('Trhliny, lesk, vylomená žebra, roztřepené okraje = vyměnit', 'Cracks, glazing, missing ribs, frayed edges = replace'), level: 'danger', show: [5, 8] }
        ]
      };
    }
  });

  R('aux-belt.decoupler', {
    duration: 8, camera: { pos: [0.22, 0.15, 0.42], target: [0, 0, 0], fov: 32 }, shadow: 0.5, ground: false, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var alt = K.mesh(K.G.cylZ(0.075, 0.14, 40), 'alu'); alt.position.z = -0.09; root.add(alt);
      for (var f = 0; f < 14; f++) { var fin = K.mesh(K.G.box(0.004, 0.018, 0.1), 'aluCast'); var a = f / 14 * PI * 2; fin.position.set(Math.cos(a) * 0.075, Math.sin(a) * 0.075, -0.09); fin.rotation.z = a; root.add(fin); }
      var pul = N4.pulley(K, 0.03, {}); root.add(pul);
      var shaftMark = K.mesh(K.G.box(0.004, 0.025, 0.002), 'hiAccent'); shaftMark.geometry.translate(0, 0.0125, 0); var shaft = new THREE.Group(); shaft.add(shaftMark); shaft.position.z = 0.021; root.add(shaft);
      var cap = K.mesh(K.G.cylZ(0.012, 0.004, 20), 'plasticGrey'); cap.position.z = 0.02; root.add(cap);
      var arrow1 = K.FX.rotArrow(0.05, 'ccw', 0x30a46c, 200, 0.004); arrow1.position.z = 0.02; root.add(arrow1);
      var arrow2 = K.FX.rotArrow(0.05, 'cw', 0xe5484d, 200, 0.004); arrow2.position.z = 0.02; root.add(arrow2);
      return {
        root: root,
        update: function (t) {
          var a, b;
          if (t < 4) { a = T.seg(t, 0.4, 3.4) * 2.2; b = a; arrow1.visible = true; arrow2.visible = false; }      // locks – shaft turns along
          else { a = 2.2 - T.seg(t, 4.4, 7.4) * 2.2; b = 2.2; arrow1.visible = false; arrow2.visible = true; }    // freewheels – shaft stays
          pul.rotation.z = a; shaft.rotation.z = b;
        },
        labels: [
          { text: V('Jedním směrem drží', 'Locks in one direction'), at: [0, 0.07, 0.03], show: [0.5, 4], level: 'ok' },
          { text: V('Druhým se volně protáčí', 'Freewheels the other way'), at: [0, 0.07, 0.03], show: [4.4, 8], level: 'ok' }
        ],
        captions: [
          { text: V('Volnoběžka alternátoru (OAP/OAD): po sundání řemene otočte řemenicí rukou', 'Alternator decoupler (OAP/OAD): with the belt off, turn the pulley by hand') },
          { text: V('Drží v obou směrech nebo drhne = vadná → chvění a hluk řemene', 'Locks both ways or feels rough = faulty → belt flutter and noise'), level: 'danger', show: [5, 8] }
        ]
      };
    }
  });

  R('aux-belt.photo', {
    duration: 6, camera: { pos: [0.35, 0.35, 1.1], target: [0.08, 0.2, 0], fov: 34 }, shadow: 1, ground: false, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, rig = N4.auxRig(K, ctx.vehicle);
      var phone = new THREE.Group();
      var pb = K.mesh(K.G.rbox(0.075, 0.15, 0.009, 0.01), 'plasticBlack'); phone.add(pb);
      var scr = K.FX.canvasPanel(0.066, 0.138, function (c, W, H) {
        c.fillStyle = '#0d1a24'; c.fillRect(0, 0, W, H);
        c.strokeStyle = '#ddd'; c.lineWidth = 6; c.beginPath(); c.ellipse(W * 0.5, H * 0.55, W * 0.3, H * 0.2, 0, 0, PI * 2); c.stroke();
        c.fillStyle = '#f5a524'; c.font = 'bold ' + Math.round(W * 0.12) + 'px sans-serif'; c.textAlign = 'center'; c.fillText('📷', W / 2, H * 0.2);
      }, { px: 256 });
      scr.position.z = 0.0048; phone.add(scr);
      rig.root.add(phone);
      var flash = K.mesh(K.G.sphere(0.4, 16), K.M.clone('plasticWhite', { transparent: true, opacity: 0, emissive: 0xffffff, emissiveIntensity: 1 }));
      flash.position.copy(rig.center); flash.position.z = 0.2; rig.root.add(flash);
      return {
        root: rig.root,
        update: function (t) {
          rig.run(0);
          var k = T.seg(t, 0.4, 2);
          phone.position.set(rig.center.x + 0.1, rig.center.y + 0.05, 0.45 - k * 0.1);
          phone.rotation.set(0, 0, 0);
          flash.material.opacity = T.pulse(t, 2.6, 3.0) * 0.35;
        },
        cameraPath: function () { return camFor(rig, 1.15, 0.35, 0.2); },
        captions: [
          { text: V('NEŽ cokoli sundáte: vyfoťte vedení řemene', 'BEFORE removing anything: photograph the belt routing') },
          { text: V('Hledejte i štítek se schématem pod kapotou', 'Also look for the routing label under the bonnet'), level: 'info', show: [3, 6] }
        ]
      };
    }
  });

  R('aux-belt.release', {
    duration: 8, camera: { pos: [0.3, 0.3, 1.0], target: [0.05, 0.2, 0], fov: 34 }, shadow: 1, ground: false, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, rig = N4.auxRig(K, ctx.vehicle);
      var bar = K.P.breakerBar(0.38); bar.rotation.x = PI / 2;
      var holder = new THREE.Group(); holder.add(bar); bar.position.z = 0.03;
      rig.armG.add(holder); holder.position.copy(rig.hexT.position); holder.position.z = 0.0;
      var isg = ctx.vehicle === 'volvo-xc60-b4';
      return {
        root: rig.root,
        update: function (t) {
          var k = T.seg(t, 1.0, 3.2);
          rig.setTension(k);
          holder.rotation.z = 0.6;
          rig.pin.position.z = -0.01 + (t > 3.4 ? 0 : 0.0) ; rig.pin.visible = t > 3.6;
          rig.run(0);
        },
        cameraPath: function () { return camFor(rig, 1.0, 0.3, 0.18); },
        labels: [
          { text: V('Napínák', 'Tensioner'), at: function () { return rig.armG.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.07, 0.03)); }, show: [0, 1.2], level: 'accent' },
          { text: V('Zajistit kolíkem / vrtákem', 'Lock with a pin / drill bit'), at: function () { return rig.armG.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -0.04, 0.03)); }, show: [3.6, 8], level: 'ok' }
        ],
        captions: [
          { text: V('Klíčem na napínák – pomalu a plynule ve směru povolení', 'Wrench on the tensioner – slowly and smoothly in the release direction') },
          isg ? { text: V('XC60: speciální napínák s vysokou silou – nářadí dle VIDA', 'XC60: high-force tensioner – tool per VIDA'), level: 'danger', show: [2, 8] }
            : { text: V('Pozor na prsty – napínák má silnou pružinu', 'Watch your fingers – the tensioner spring is strong'), level: 'danger', show: [2, 8] }
        ]
      };
    }
  });

  R('aux-belt.remove', {
    duration: 7, camera: { pos: [0.4, 0.3, 1.0], target: [0.05, 0.2, 0], fov: 34 }, shadow: 1, ground: false, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, rig = N4.auxRig(K, ctx.vehicle);
      var smooth = rig.lay.filter(function (p) { return p.t === 's' && !p.tens; })[0] || rig.lay.filter(function (p) { return p.tens; })[0];
      return {
        root: rig.root,
        update: function (t) {
          rig.setTension(1);
          var off = T.seg(t, 1.2, 3.5);
          rig.setBelt(1 - T.seg(t, 4, 5.5), off * 0.05);
          rig.run(0);
          if (t > 6.6) rig.setBelt(1, 0);
        },
        cameraPath: function () { return camFor(rig, 1.05, 0.4, 0.15); },
        labels: [{ text: V('Sundat nejdřív z hladké kladky', 'Slip it off a smooth idler first'), at: function () { return pW(rig, smooth.id, [0, smooth.r + 0.03, 0.03]); }, show: [0.4, 4], level: 'accent' }],
        captions: [
          { text: V('Řemen stáhnout z hladké (snadno dostupné) kladky, pak z ostatních', 'Pull the belt off a smooth (easy to reach) idler, then off the rest') },
          { text: V('Napínák pomalu vrátit – nenechat ho „cvaknout“ volně', 'Let the tensioner back slowly – never let it snap back'), level: 'danger', show: [4.5, 7] }
        ]
      };
    }
  });

  R('aux-belt.pulleys', {
    duration: 8, camera: { pos: [0.3, 0.3, 0.9], target: [0.05, 0.2, 0], fov: 34 }, shadow: 1, ground: false, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, rig = N4.auxRig(K, ctx.vehicle);
      rig.setTension(1); rig.setBelt(0);
      var idlers = rig.lay.filter(function (p) { return p.t === 's'; });
      var glows = idlers.map(function (p) { return K.FX.glow(rig.pulleys[p.id].group, 0xf5a524); });
      var hand = K.P.glove(); hand.scale.setScalar(0.8); rig.root.add(hand);
      return {
        root: rig.root,
        update: function (t) {
          var i = Math.min(idlers.length - 1, Math.floor(t / (8 / idlers.length)));
          var p = idlers[i], g = rig.pulleys[p.id].group;
          glows.forEach(function (fn, j) { fn(j === i ? 0.5 + 0.5 * Math.sin(t * 6) : 0); });
          g.rotation.z = -t * 6;
          g.position.z = Math.sin(t * 13) * 0.002 * (i === 0 ? 1 : 0);
          hand.position.set(g.position.x + 0.06, g.position.y + 0.02, 0.07);
          hand.rotation.set(-0.3, 0.3, -0.4);
          rig.run(0);
        },
        cameraPath: function () { return camFor(rig, 0.95, 0.3, 0.18); },
        captions: [
          { text: V('Protočte rukou každou kladku i napínák', 'Spin every idler and the tensioner by hand') },
          { text: V('Hrubý chod, hluk, vůle nebo viklání = vyměnit spolu s řemenem', 'Rough, noisy, play or wobble = replace together with the belt'), level: 'danger', show: [3, 8] }
        ]
      };
    }
  });

  R('aux-belt.fit', {
    duration: 9, camera: { pos: [0.3, 0.3, 1.0], target: [0.05, 0.2, 0], fov: 34 }, shadow: 1, ground: false, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, rig = N4.auxRig(K, ctx.vehicle);
      // zoomed rib alignment inset (big pulley segment with belt offset by one rib)
      var inset = new THREE.Group();
      var pul = N4.pulley(K, 0.1, { w: 0.05 }); inset.add(pul);
      var beltSeg = K.mesh(K.G.sector(0.1, 0.107, PI * 0.3, PI * 0.7, 0.04, 0.001), K.M.clone('rubber', { color: 0x222326 })); inset.add(beltSeg);
      inset.position.set(rig.center.x + 0.38, rig.center.y + 0.15, 0.1); inset.scale.setScalar(0.9); rig.root.add(inset);
      return {
        root: rig.root,
        update: function (t) {
          var on = T.seg(t, 0.5, 2.5);
          rig.setTension(1); rig.setBelt(on, (1 - on) * 0.06);
          var wrong = T.between(t, 3, 5.5);
          beltSeg.position.z = wrong ? 0.012 : 0;
          beltSeg.material.color.setHex(wrong ? 0x8e1b1b : 0x222326);
          rig.run(0);
        },
        cameraPath: function () { return camFor(rig, 1.12, 0.45, 0.2); },
        labels: [
          { text: V('✖ o žebro vedle', '✖ one rib off'), at: function () { return inset.position.clone().add(new THREE.Vector3(0, 0.13, 0)); }, show: [3, 5.5], level: 'danger' },
          { text: V('✔ žebra přesně v drážkách', '✔ ribs exactly in the grooves'), at: function () { return inset.position.clone().add(new THREE.Vector3(0, 0.13, 0)); }, show: [5.5, 9], level: 'ok' }
        ],
        captions: [
          { text: V('Nový řemen nasadit podle fotky, napínák držet povolený', 'Fit the new belt per your photo, keep the tensioner released') },
          { text: V('Na každé řemenici zkontrolujte, že žebra sedí v drážkách', 'Check the ribs sit in the grooves on every pulley'), level: 'info', show: [3, 9] }
        ]
      };
    }
  });

  R('aux-belt.tension', {
    duration: 7, camera: { pos: [0.3, 0.3, 1.0], target: [0.05, 0.2, 0], fov: 34 }, shadow: 1, ground: false, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, rig = N4.auxRig(K, ctx.vehicle);
      return {
        root: rig.root,
        update: function (t) {
          var k = 1 - T.seg(t, 1.2, 3.6);
          rig.setTension(k);
          rig.pin.visible = t < 1.2;
          rig.run(t > 4.5 ? (t - 4.5) * 0.6 : 0);
        },
        cameraPath: function () { return camFor(rig, 1.0, 0.3, 0.18); },
        labels: [{ text: V('Ukazatel v okénku', 'Pointer within the window'), at: function () { return new THREE.Vector3(rig.tensPivot.x + 0.03, rig.tensPivot.y - 0.06, 0.02); }, show: [3.6, 7], level: 'ok' }],
        captions: [
          { text: V('Vyndat kolík, napínák pomalu přiložit na řemen', 'Remove the pin, let the tensioner onto the belt slowly') },
          { text: V('Ukazatel napínáku musí být v toleranci (dle příručky)', 'The tensioner pointer must be within tolerance (per manual)'), level: 'info', show: [3.6, 7] }
        ]
      };
    }
  });

  R('aux-belt.test', {
    duration: 8, camera: { pos: [0.3, 0.3, 1.0], target: [0.05, 0.2, 0], fov: 34 }, shadow: 1, ground: false, thumbT: 4,
    build: function (ctx, K) {
      var rig = N4.auxRig(K, ctx.vehicle);
      return {
        root: rig.root,
        update: function (t) { rig.run(t * 2.4); rig.armG.rotation.z += Math.sin(t * 40) * 0.002; },
        cameraPath: function () { return camFor(rig, 1.1, 0.35, 0.18); },
        captions: [
          { text: V('Nářadí pryč, baterii připojit, nastartovat – ruce a vlasy dál od řemene', 'Tools away, reconnect battery, start – hands and hair clear of the belt'), level: 'danger' },
          { text: V('Řemen běží rovně, nepíská, napínák se jen mírně chvěje', 'Belt runs straight, no squeal, tensioner only flutters slightly'), level: 'ok', show: [3, 8] }
        ]
      };
    }
  });

  R('aux-belt.isg', {
    duration: 8, camera: { pos: [0.3, 0.35, 1.0], target: [0.05, 0.2, 0], fov: 34 }, shadow: 1, ground: false, thumbT: 3,
    build: function (ctx, K) {
      var rig = N4.auxRig(K, 'volvo-xc60-b4');
      var g = K.FX.glow(rig.pulleys.isg.group, 0xe5484d);
      return {
        root: rig.root,
        update: function (t) { g(0.5 + 0.5 * Math.sin(t * 4)); rig.run(t < 4 ? t * 3 : 12); },
        cameraPath: function () { return camFor(rig, 1.05, 0.3, 0.2); },
        labels: [{ text: V('48V ISGM – roztáčí motor řemenem', '48V ISGM – cranks the engine through the belt'), at: function () { return pW(rig, 'isg', [0.2, -0.03, 0.03]); }, level: 'danger', show: [1, 8] }],
        captions: [
          { text: V('Start-stop může motor kdykoli roztočit přes řemen', 'Start-stop can spin the engine via the belt at any moment'), level: 'danger' },
          { text: V('Před prací: 12V i 48V odpojit dle VIDA, klíč mimo dosah', 'Before work: disconnect 12V and 48V per VIDA, key out of range'), level: 'danger', show: [3, 8] }
        ]
      };
    }
  });
})(window.STU);
