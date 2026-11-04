/* 3D scenes: timing belt / chain (výměna rozvodů). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var CHAIN = { 'mb-cl500-c216': true, 'toyota-gr-yaris': true };
  var SC = 0.0016, Y0 = 0.12;           // layout px → metres
  var CRANK_T = 2.4;                    // s per crank revolution when running

  /* ------------------------------------------------------- shared helpers (also used by clutch / drivetrain) */
  var F3 = S.f3 = S.f3 || {};

  /** Hand-held scan tool with a canvas screen. draw(c2d, W, H, state). Returns group with userData.screen. */
  F3.scanTool = function (K, draw, state) {
    var g = new THREE.Group();
    var body = K.mesh(K.G.rbox(0.2, 0.3, 0.04, 0.02), K.M.clone('plasticBlack', { color: 0x23262b }));
    g.add(body);
    var bump = K.mesh(K.G.rbox(0.214, 0.314, 0.03, 0.02), K.M.clone('toolYellow', { color: 0xe0a100 })); bump.position.z = -0.008; g.add(bump);
    var bezel = K.mesh(K.G.rbox(0.17, 0.18, 0.008, 0.003), 'blackGloss'); bezel.position.set(0, 0.04, 0.022); g.add(bezel);
    var screen = K.FX.canvasPanel(0.158, 0.168, draw, { state: state, px: 512 }); screen.position.set(0, 0.04, 0.0275); g.add(screen);
    for (var i = 0; i < 3; i++) {
      var b = K.mesh(K.G.cylZ(0.012, 0.008, 20), i === 1 ? 'hiOk' : 'plasticGrey'); b.position.set(-0.05 + i * 0.05, -0.1, 0.022); g.add(b);
    }
    var cable = K.mesh(K.G.tube([[0, -0.15, 0], [0, -0.22, -0.02], [0.08, -0.3, -0.06], [0.2, -0.32, -0.1]], 0.006), 'rubber'); g.add(cable);
    g.userData.screen = screen;
    return g;
  };
  /** Screen background + title helper for canvas drawing. */
  F3.screenBase = function (c, W, H, title) {
    c.fillStyle = '#0f1b26'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#1d4f73'; c.fillRect(0, 0, W, H * 0.16);
    c.fillStyle = '#ffffff'; c.font = 'bold ' + Math.round(H * 0.075) + 'px system-ui, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(title, W / 2, H * 0.08);
  };
  F3.coolantMat = function (K, vid) {
    return { 'skoda-octavia-rs-tdi': 'coolantViolet', 'toyota-gr-yaris': 'coolantPink', 'volvo-xc60-b4': 'coolantBlue', 'mb-cl500-c216': 'coolantBlue' }[vid] || 'coolantBlue';
  };
  /** Find a mesh in a drain pan and give it another liquid material. */
  F3.panLiquid = function (pan, K, matName) {
    pan.traverse(function (o) { if (o.isMesh && o.material === K.M.oilOld) o.material = K.M[matName]; });
  };

  /* ------------------------------------------------------- layouts (same as 2D, px coords y-down) */
  var TXT = {
    crank: V('Klikový hřídel', 'Crankshaft'), cam: V('Vačkový hřídel', 'Camshaft'), camIn: V('Vačka sání', 'Intake cam'),
    camEx: V('Vačka výfuk', 'Exhaust cam'), pump: V('Vodní pumpa', 'Water pump'), tens: V('Napínák', 'Tensioner'),
    idler: V('Vodicí kladka', 'Idler'), hp: V('VT čerpadlo', 'HP pump')
  };
  function layout(v) {
    if (v === 'skoda-octavia-rs-tdi') return [
      { id: 'crank', x: 220, y: 248, r: 20, kind: 's' }, { id: 'tens', x: 150, y: 198, r: 14, kind: 'p' },
      { id: 'pump', x: 142, y: 114, r: 22, kind: 's' }, { id: 'cam', x: 290, y: 68, r: 40, kind: 's' },
      { id: 'hp', x: 395, y: 150, r: 26, kind: 's' }, { id: 'idler', x: 335, y: 228, r: 12, kind: 'p' }];
    if (v === 'volvo-xc60-b4') return [
      { id: 'crank', x: 225, y: 248, r: 19, kind: 's' }, { id: 'tens', x: 150, y: 205, r: 14, kind: 'p' },
      { id: 'pump', x: 140, y: 128, r: 22, kind: 's' }, { id: 'camIn', x: 245, y: 66, r: 38, kind: 's' },
      { id: 'camEx', x: 355, y: 66, r: 38, kind: 's' }, { id: 'idler', x: 350, y: 212, r: 12, kind: 'p' }];
    return [
      { id: 'crank', x: 220, y: 246, r: 20, kind: 's' }, { id: 'tens', x: 148, y: 196, r: 14, kind: 'p' },
      { id: 'pump', x: 145, y: 112, r: 22, kind: 's' }, { id: 'cam', x: 305, y: 70, r: 40, kind: 's' },
      { id: 'idler', x: 335, y: 222, r: 12, kind: 'p' }];
  }
  function isCam(id) { return id.indexOf('cam') === 0 || id === 'hp'; }

  /* ------------------------------------------------------- 3D parts */
  function sprocket(K, r, opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var n = opts.teeth || Math.max(14, Math.round(2 * PI * r / 0.0095));
    var gear = K.mesh(K.G.gear(n, r + 0.002, r - 0.0035, 0.024, 0), opts.mat || 'steel'); g.add(gear);
    [-1, 1].forEach(function (s) { var fl = K.mesh(K.G.cylZ(r + 0.004, 0.0015, 48), 'steelDark'); fl.position.z = s * 0.0128; if (opts.flanges !== false) g.add(fl); });
    var web = K.mesh(K.G.cylZ(r * 0.72, 0.026, 40), 'steelDark'); g.add(web);
    var hub = K.mesh(K.G.cylZ(r * 0.32, 0.036, 32), 'steel'); hub.position.z = 0.006; g.add(hub);
    var bolt = K.mesh(K.G.hex(Math.max(0.009, r * 0.16), 0.012), 'zinc'); bolt.rotation.x = PI / 2; bolt.position.z = 0.03; g.add(bolt);
    var nh = r > 0.04 ? 4 : 3;
    for (var i = 0; i < nh; i++) {
      var a = PI / 4 + i * 2 * PI / nh;
      var h = K.mesh(K.G.cylZ(r * 0.12, 0.028, 20), 'blackOxide'); h.position.set(Math.cos(a) * r * 0.52, Math.sin(a) * r * 0.52, 0.0005); g.add(h);
    }
    if (opts.mark !== false) {
      var mk = K.mesh(K.G.box(0.006, 0.012, 0.004), 'hiDanger'); mk.position.set(0, (opts.markDown ? -1 : 1) * (r - 0.009), 0.0135); g.add(mk);
    }
    // locking hole (aligned with block hole at TDC)
    var lh = K.mesh(K.G.cylZ(0.0055, 0.0275, 16), 'blackOxide'); lh.position.set(r * 0.45, -r * 0.2, 0.0005); g.add(lh);
    g.userData.lockHole = lh.position.clone();
    return g;
  }
  function smoothPulley(K, r, opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var p = K.mesh(K.G.latheZ([[r * 0.35, -0.013], [r + 0.002, -0.013], [r, -0.011], [r, 0.011], [r + 0.002, 0.013], [r * 0.35, 0.013]], 48), opts.mat || 'steel'); g.add(p);
    var face = K.mesh(K.G.cylZ(r * 0.8, 0.02, 40), opts.faceMat || 'plasticBlack'); g.add(face);
    var brg = K.mesh(K.G.cylZ(r * 0.32, 0.03, 24), 'steel'); g.add(brg);
    var nut = K.mesh(K.G.hex(r * 0.18, 0.01), 'zinc'); nut.rotation.x = PI / 2; nut.position.z = 0.018; g.add(nut);
    var dot = K.mesh(K.G.cylZ(r * 0.08, 0.004, 12), 'plasticWhite'); dot.position.set(0, r * 0.55, 0.011); g.add(dot);
    return g;
  }

  /** Belt as instanced back strip + teeth running along a closed path. */
  function makeBelt(K, path, opts) {
    opts = opts || {};
    var lengths = K.G.pathLengths(path), total = lengths[lengths.length - 1];
    var step = opts.step || 0.0095, n = Math.floor(total / step);
    step = total / n;
    var mat = K.M.clone('rubber', { color: opts.color || 0x1a1b1e, roughness: 0.7 });
    var back = new THREE.InstancedMesh(new THREE.BoxGeometry(step * 1.02, 0.0022, opts.width || 0.025), mat, n);
    var teeth = new THREE.InstancedMesh(new THREE.BoxGeometry(step * 0.5, 0.0032, opts.width || 0.025), mat, n);
    var g = new THREE.Group(); g.add(back); g.add(teeth);
    var m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(1, 1, 1), ax = new THREE.Vector3(0, 0, 1);
    function set(offset, count) {
      var cnt = count == null ? n : Math.max(0, Math.min(n, count));
      back.count = cnt; teeth.count = cnt;
      for (var i = 0; i < cnt; i++) {
        var s = i * step + (offset || 0);
        var p = K.G.pointAt(path, lengths, s), a = K.G.pointAt(path, lengths, s - 0.002), b = K.G.pointAt(path, lengths, s + 0.002);
        var ang = Math.atan2(b.y - a.y, b.x - a.x);
        var nx = Math.sin(ang), ny = -Math.cos(ang); // outward normal (CCW path)
        q.setFromAxisAngle(ax, ang);
        m4.compose(new THREE.Vector3(p.x + nx * 0.0042, p.y + ny * 0.0042, 0), q, sc); back.setMatrixAt(i, m4);
        m4.compose(new THREE.Vector3(p.x + nx * 0.0016, p.y + ny * 0.0016, 0), q, sc); teeth.setMatrixAt(i, m4);
      }
      back.instanceMatrix.needsUpdate = true; teeth.instanceMatrix.needsUpdate = true;
    }
    set(0);
    g.userData = { set: set, n: n, step: step, total: total, mat: mat };
    return g;
  }

  /** Front-of-engine timing rig. returns { root, items[{id, obj, r, x, y, spin}], belt, setCrank(angle), path, lay, order } */
  function timingRig(ctx, K, opts) {
    opts = opts || {};
    var root = new THREE.Group();
    var lay = layout(ctx.vehicle);
    var items = lay.map(function (it) {
      return { id: it.id, kind: it.kind, r: it.r * SC, x: (it.x - 270) * SC, y: (300 - it.y) * SC + Y0 };
    });
    // engine block (front face) behind the drive
    var plate = K.mesh(K.G.extrude(K.G.rrect(0.6, 0.5, 0.06), 0.03, 0.006), 'castIron'); plate.position.set(0.005, 0.37, -0.045); root.add(plate);
    var block = K.mesh(K.G.rbox(0.62, 0.55, 0.42, 0.03), 'castIron'); block.position.set(0.005, 0.35, -0.27); root.add(block);
    var head = K.mesh(K.G.rbox(0.56, 0.14, 0.42, 0.02), 'aluCast'); head.position.set(0.02, 0.62, -0.27); root.add(head);
    var cover = K.mesh(K.G.rbox(0.54, 0.07, 0.38, 0.03), 'plasticBlack'); cover.position.set(0.02, 0.72, -0.27); root.add(cover);
    var foot = K.mesh(K.G.rbox(0.5, 0.1, 0.3, 0.02), 'steelDark'); foot.position.set(0.0, 0.05, -0.27); root.add(foot);
    for (var b = 0; b < 10; b++) {
      var bb = K.mesh(K.G.hex(0.006, 0.006), 'zinc'); bb.rotation.x = PI / 2;
      bb.position.set(-0.28 + (b % 5) * 0.14, b < 5 ? 0.14 : 0.6, -0.028); root.add(bb);
    }
    items.forEach(function (it) {
      var pivot = new THREE.Group(); pivot.position.set(it.x, it.y, 0); root.add(pivot);
      var shaft = K.mesh(K.G.cylZ(Math.min(0.012, it.r * 0.3), 0.05, 16), 'steelDark'); shaft.position.z = -0.025; pivot.add(shaft);
      var spin = new THREE.Group(); pivot.add(spin);
      var obj = it.kind === 's' ? sprocket(K, it.r, { mark: it.id !== 'pump', markDown: it.id === 'crank' }) : smoothPulley(K, it.r);
      spin.add(obj);
      if (it.id === 'tens') {
        var basePlate = K.mesh(K.G.extrude([[-0.03, -0.02], [0.03, -0.02], [0.035, 0.04], [-0.035, 0.04]], 0.006, 0.001), 'steelDark');
        basePlate.position.z = -0.016; pivot.add(basePlate);
      }
      it.pivot = pivot; it.spin = spin; it.obj = obj;
    });
    // fixed TDC pointers on the block
    items.forEach(function (it) {
      if (it.kind !== 's' || it.id === 'pump') return;
      var down = it.id === 'crank';
      var ptr = K.mesh(new THREE.ConeGeometry(0.006, 0.014, 3), 'toolYellow');
      ptr.rotation.z = down ? 0 : PI;
      ptr.position.set(it.x, it.y + (down ? -1 : 1) * (it.r + 0.016), -0.02);
      root.add(ptr);
      it.pointer = ptr;
    });
    // belt (path CCW in y-up = reversed CW layout, starting at crank → install order)
    var order = [items[0]].concat(items.slice(1).reverse());
    var path = K.G.beltPath(order.map(function (it) { return { x: it.x, y: it.y, r: it.r }; }), 0.002);
    var belt = null;
    if (opts.belt !== false) { belt = makeBelt(K, path); root.add(belt); }
    var crank = items[0];
    function setCrank(a, beltCount) {
      items.forEach(function (it) { it.spin.rotation.z = -a * crank.r / it.r; });
      if (belt) belt.userData.set(-a * crank.r, beltCount);
    }
    setCrank(0);
    function find(id) { for (var i = 0; i < items.length; i++) if (items[i].id === id) return items[i]; return null; }
    return { root: root, items: items, belt: belt, setCrank: setCrank, path: path, order: order, find: find, crank: crank };
  }
  F3.timingRig = timingRig;

  function itemLabels(rig, show) {
    return rig.items.map(function (it) {
      var off = it.x < -0.05 ? [-0.02, 0, 0] : [0.02, 0, 0];
      return { text: TXT[it.id], at: [it.x + off[0], it.y + it.r + 0.035, 0.03], show: show };
    });
  }
  var CAM_FRONT = { pos: [0.18, 0.5, 1.05], target: [0.0, 0.36, 0], fov: 36 };

  /* ------------------------------------------------------- chain drive (CL 500 / GR Yaris) */
  function chainScene(ctx, K, opts) {
    opts = opts || {};
    var root = new THREE.Group();
    var cs = [{ x: 0, y: 0.18, r: 0.024 }, { x: 0.12, y: 0.52, r: 0.048 }, { x: -0.12, y: 0.52, r: 0.048 }]; // CCW: crank, right cam, left cam
    var plate = K.mesh(K.G.extrude(K.G.rrect(0.46, 0.52, 0.06), 0.03, 0.006), 'castIron'); plate.position.set(0, 0.37, -0.045); root.add(plate);
    var block = K.mesh(K.G.rbox(0.48, 0.56, 0.4, 0.03), 'castIron'); block.position.set(0, 0.36, -0.26); root.add(block);
    var spins = cs.map(function (c, i) {
      var p = new THREE.Group(); p.position.set(c.x, c.y, 0); root.add(p);
      var sp = new THREE.Group(); p.add(sp);
      sp.add(sprocket(K, c.r, { flanges: false, teeth: i === 0 ? 18 : 36, markDown: i === 0 }));
      if (i > 0) { var ptr = K.mesh(new THREE.ConeGeometry(0.006, 0.014, 3), 'toolYellow'); ptr.rotation.z = PI; ptr.position.set(c.x, c.y + c.r + 0.018, -0.02); root.add(ptr); }
      return sp;
    });
    var path = K.G.beltPath(cs, 0.002);
    var lengths = K.G.pathLengths(path), total = lengths[lengths.length - 1];
    var pitch = 0.008, n = Math.floor(total / pitch); pitch = total / n;
    var linkMat = K.M.clone('steel', { roughness: 0.35 });
    var plates = new THREE.InstancedMesh(K.G.rbox(pitch * 1.25, 0.0075, 0.0016, 0.003), linkMat, n * 2);
    var rollers = new THREE.InstancedMesh(K.G.cylZ(0.0026, 0.012, 10), K.M.steelDark, n);
    root.add(plates); root.add(rollers);
    // guide rail (tight side: crank → right cam) and tensioner rail (slack side: left cam → crank)
    function railAlong(a, b, off) {
      var d = new THREE.Vector2(b.x - a.x, b.y - a.y), L = d.length(), ang = Math.atan2(d.y, d.x);
      var m = K.mesh(K.G.rbox(L * 0.7, 0.012, 0.022, 0.004), K.M.clone('plasticBlack', { color: 0x2c2f33 }));
      var nx = Math.sin(ang), ny = -Math.cos(ang);
      m.position.set((a.x + b.x) / 2 + nx * off, (a.y + b.y) / 2 + ny * off, 0); m.rotation.z = ang;
      return m;
    }
    function tangentPts(i) { // straight run leaving circle i
      var a = cs[i], b = cs[(i + 1) % 3];
      var d = Math.hypot(b.x - a.x, b.y - a.y), base = Math.atan2(b.y - a.y, b.x - a.x), phi = Math.acos((a.r - b.r) / d), ang = base - phi;
      return [new THREE.Vector2(a.x + Math.cos(ang) * a.r, a.y + Math.sin(ang) * a.r), new THREE.Vector2(b.x + Math.cos(ang) * b.r, b.y + Math.sin(ang) * b.r)];
    }
    var tight = tangentPts(0), slack = tangentPts(2);
    var guide = railAlong(tight[0], tight[1], 0.012); root.add(guide);
    var trail = railAlong(slack[0], slack[1], 0.012); root.add(trail);
    var trailBase = trail.position.clone();
    var sd = new THREE.Vector2(slack[1].x - slack[0].x, slack[1].y - slack[0].y).normalize();
    var sn = new THREE.Vector2(sd.y, -sd.x);
    var tensBody = K.mesh(K.G.rbox(0.05, 0.032, 0.03, 0.006), 'aluCast');
    var tmid = new THREE.Vector2((slack[0].x + slack[1].x) / 2, (slack[0].y + slack[1].y) / 2);
    tensBody.position.set(tmid.x + sn.x * 0.06, tmid.y + sn.y * 0.06, 0); tensBody.rotation.z = Math.atan2(sn.y, sn.x); root.add(tensBody);
    var plunger = K.mesh(K.G.cylX(0.007, 0.04, 16), 'chrome'); root.add(plunger);
    var m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1), zAx = new THREE.Vector3(0, 0, 1);
    function setChain(offset, jitter, t) {
      for (var i = 0; i < n; i++) {
        var s = i * pitch + offset;
        var p = K.G.pointAt(path, lengths, s), a = K.G.pointAt(path, lengths, s - 0.002), b = K.G.pointAt(path, lengths, s + 0.002);
        var ang = Math.atan2(b.y - a.y, b.x - a.x);
        var j = jitter ? Math.sin(i * 1.7 + t * 40) * jitter : 0;
        var nx = Math.sin(ang), ny = -Math.cos(ang);
        q.setFromAxisAngle(zAx, ang);
        var px = p.x + nx * (0.0035 + j), py = p.y + ny * (0.0035 + j);
        m4.compose(new THREE.Vector3(px, py, (i % 2 ? 0.0055 : 0.0045)), q, one); plates.setMatrixAt(i * 2, m4);
        m4.compose(new THREE.Vector3(px, py, -(i % 2 ? 0.0055 : 0.0045)), q, one); plates.setMatrixAt(i * 2 + 1, m4);
        m4.compose(new THREE.Vector3(p.x + nx * (0.0035 + j) + Math.cos(ang) * pitch / 2, p.y + ny * (0.0035 + j) + Math.sin(ang) * pitch / 2, 0), q, one); rollers.setMatrixAt(i, m4);
      }
      plates.instanceMatrix.needsUpdate = true; rollers.instanceMatrix.needsUpdate = true;
    }
    var codes = ctx.vehicle === 'mb-cl500-c216' ? 'P0016–P0019' : 'P0016 / P0017';
    if (opts.locks) {
      var pins = [1, 2].map(function (i) {
        var p = new THREE.Group();
        var rod = K.mesh(K.G.cylZ(0.005, 0.07, 16), 'chrome'); rod.position.z = 0.035; p.add(rod);
        var grip = K.mesh(K.G.cylZ(0.011, 0.03, 20), 'toolYellow'); grip.position.z = 0.08; p.add(grip);
        var lh = spins[i].children[0].userData.lockHole;
        p.position.set(cs[i].x + lh.x, cs[i].y + lh.y, 0); root.add(p); return p;
      });
      setChain(0, 0, 0);
      return {
        root: root,
        update: function (t) { pins.forEach(function (p, i) { var k = K.T.seg(t, 0.5 + i * 0.6, 1.8 + i * 0.6); p.position.z = (1 - k) * 0.12 - k * 0.012; }); },
        labels: [{ text: V('Aretace vaček', 'Camshaft locking tools'), at: [0, 0.6, 0.06], show: [1.5, 6], level: 'accent' }],
        captions: [
          { text: V('Řetěz: výměna = dílna (aretace, nýtovačka článků, diagnostika)', 'Chain: replacement = workshop (locking tools, link riveter, diagnostics)') },
          { text: V('Zajistit nářadím – ne jen značky barvou!', 'Lock with tools – not just paint marks!'), level: 'danger' }
        ]
      };
    }
    return {
      root: root,
      update: function (t) {
        var a = t / CRANK_T * 2 * PI;
        var bad = K.T.seg(t, 4.0, 5.0) * (1 - K.T.seg(t, 7.6, 8));
        spins[0].rotation.z = -a;
        var lag = bad * 0.28;
        spins[1].rotation.z = -a / 2 + lag; spins[2].rotation.z = -a / 2 + lag;
        setChain(-a * cs[0].r, bad * 0.0012, t);
        trail.position.set(trailBase.x - sn.x * 0.006 * bad, trailBase.y - sn.y * 0.006 * bad, 0);
        plunger.position.set(tensBody.position.x - sn.x * (0.02 + 0.012 * bad), tensBody.position.y - sn.y * (0.02 + 0.012 * bad), 0);
        plunger.rotation.z = Math.atan2(sn.y, sn.x);
      },
      labels: [
        { text: V('Vodicí lišta', 'Guide rail'), at: [guide.position.x + 0.05, guide.position.y, 0.02] },
        { text: V('Napínák', 'Tensioner'), at: [tensBody.position.x, tensBody.position.y - 0.03, 0.02] },
        { text: V('značky se rozcházejí', 'marks drift apart'), at: [0, 0.6, 0.02], show: [5, 7.6], level: 'danger' }
      ],
      captions: [
        { text: V('Zdravý řetěz: napínák má rezervu, značky sedí', 'Healthy chain: tensioner has reserve, marks align'), show: [0, 4], level: 'ok' },
        { text: V('Natažený řetěz: napínák na dorazu, vačky se zpožďují', 'Stretched chain: tensioner maxed, cams run late'), show: [4, 8], level: 'danger' },
        { text: { cs: 'Příznaky: chrastění při studeném startu · chyby ' + codes, en: 'Symptoms: rattle on cold start · codes ' + codes }, show: [4.6, 8] }
      ]
    };
  }

  /* ------------------------------------------------------- overview */
  R('timing.overview', {
    duration: 9.6, camera: CAM_FRONT, shadow: 1.2, thumbT: 1,
    build: function (ctx, K) {
      if (CHAIN[ctx.vehicle]) return chainScene(ctx, K);
      var rig = timingRig(ctx, K);
      var arrow = K.FX.rotArrow(0.055, 'cw', 0xf5a524, 230, 0.004);
      arrow.position.set(rig.crank.x, rig.crank.y, 0.04); rig.root.add(arrow);
      return {
        root: rig.root,
        update: function (t) { rig.setCrank(t / CRANK_T * 2 * PI); },
        labels: itemLabels(rig),
        captions: [
          { text: V('Směr chodu motoru: po směru hodinových ručiček', 'Engine rotation: clockwise') },
          { text: V('Vačka se točí poloviční rychlostí kliky', 'The cam turns at half crank speed'), level: 'info' }
        ]
      };
    }
  });
  R('timing.chain', { duration: 8, camera: { pos: [0.15, 0.48, 0.95], target: [0, 0.37, 0], fov: 36 }, shadow: 1.2, thumbT: 6, build: chainScene });

  /* ------------------------------------------------------- interference (cut-away) */
  R('timing.interference', {
    duration: 8, camera: { pos: [0.07, 0.3, 0.5], target: [0, 0.255, 0], fov: 34 }, shadow: 0.6, ground: false, thumbT: 6.2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bore = 0.041, yh = 0.3;   // cylinder head lower face
      var cut = K.M.clone('aluCast', { color: 0xc9ccd1, roughness: 0.5 });
      var back = K.mesh(new THREE.LatheGeometry([new THREE.Vector2(bore, 0.12), new THREE.Vector2(bore, yh)], 40, PI / 2, PI), K.M.clone('castIron', { side: THREE.DoubleSide }));
      root.add(back);
      [-1, 1].forEach(function (s) {
        var wall = K.mesh(K.G.box(0.022, yh - 0.1, 0.012), cut); wall.position.set(s * (bore + 0.011), (yh + 0.1) / 2, 0); root.add(wall);
        var water = K.mesh(K.G.box(0.008, yh - 0.14, 0.013), K.M.coolantBlue); water.position.set(s * (bore + 0.03), (yh + 0.12) / 2, 0); root.add(water);
        var outer = K.mesh(K.G.box(0.012, yh - 0.1, 0.012), cut); outer.position.set(s * (bore + 0.04), (yh + 0.1) / 2, 0); root.add(outer);
      });
      var head = K.mesh(K.G.box(0.2, 0.06, 0.012), cut); head.position.set(0, yh + 0.03, 0); root.add(head);
      var headBack = K.mesh(K.G.box(0.2, 0.06, 0.08), 'aluCast'); headBack.position.set(0, yh + 0.03, -0.046); root.add(headBack);
      // ports (dark) in the cut face
      [-1, 1].forEach(function (s) { var port = K.mesh(K.G.box(0.024, 0.06, 0.013), 'blackOxide'); port.position.set(s * 0.028, yh + 0.035, 0.0005); port.rotation.z = s * 0.35; root.add(port); });
      // piston (half lathe + cut face) + rod
      var piston = new THREE.Group(); root.add(piston);
      var pBack = K.mesh(new THREE.LatheGeometry([new THREE.Vector2(0, 0), new THREE.Vector2(bore - 0.0005, 0), new THREE.Vector2(bore - 0.0005, -0.055), new THREE.Vector2(bore - 0.004, -0.06)], 40, PI / 2, PI), K.M.clone('alu', { side: THREE.DoubleSide }));
      piston.add(pBack);
      var pCut = K.mesh(K.G.extrude([[-bore + 0.0005, 0], [bore - 0.0005, 0], [bore - 0.0005, -0.055], [0.012, -0.055], [0.012, -0.02], [-0.012, -0.02], [-0.012, -0.055], [-bore + 0.0005, -0.055]], 0.002, 0), K.M.clone('alu', { color: 0xdfe3e8 }));
      piston.add(pCut);
      for (var r = 0; r < 3; r++) { var ring = K.mesh(K.G.box(bore * 2 + 0.001, 0.0018, 0.003), 'blackOxide'); ring.position.y = -0.006 - r * 0.0055; piston.add(ring); }
      var pin = K.mesh(K.G.cylZ(0.009, 0.004, 20), 'steel'); pin.position.set(0, -0.035, 0.002); piston.add(pin);
      var rod = K.mesh(K.G.box(0.018, 0.14, 0.004), 'steelDark'); root.add(rod);
      // valves
      function valve(x, mat) {
        var v = new THREE.Group();
        var stem = K.mesh(K.G.cyl(0.0035, 0.1, 12), mat); stem.position.y = 0.05; v.add(stem);
        var hd = K.mesh(K.G.lathe([[0, 0], [0.016, 0], [0.016, 0.002], [0.004, 0.014], [0, 0.014]], 32), mat); v.add(hd);
        var spr = K.mesh(K.G.tube((function () { var p = []; for (var k = 0; k <= 50; k++) { var a = k / 50 * PI * 2 * 6; p.push([Math.cos(a) * 0.011, 0.07 + k / 50 * 0.03, Math.sin(a) * 0.011]); } return p; })(), 0.0015, false, 200, 6), 'toolYellow');
        v.add(spr);
        v.position.set(x, yh, 0.003);
        root.add(v);
        return v;
      }
      var vIn = valve(-0.022, 'steel'), vEx = valve(0.022, 'steelDark');
      vIn.rotation.z = -0.12; vEx.rotation.z = 0.12;
      var flash = K.mesh(K.G.sphere(0.02, 16), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0 }));
      flash.position.set(-0.022, yh - 0.012, 0.01); flash.userData.noShadow = true; root.add(flash);
      function depth(p) { return 0.0225 * (1 - Math.cos(2 * PI * p)); }
      function lift(p) { return Math.max(0, 0.009 * Math.sin(2 * PI * (p - 0.08)) * (p > 0.08 && p < 0.58 ? 1 : 0)); }
      // phase 2: belt snaps at t=4.3, valve stays at full lift; find collision time while rising
      var tSnap = 4.3, tHit = 6;
      for (var tt = tSnap; tt < 8; tt += 0.005) { var pp = (tt % 2) / 2; if (pp > 0.5 && depth(pp) + 0.004 <= 0.0105) { tHit = tt; break; } }
      return {
        root: root,
        update: function (t) {
          var p = (t % 2) / 2, d = depth(p), l = lift(p), bent = 0;
          if (t >= tSnap) { l = Math.max(l, Math.min(0.009, lift((tSnap % 2) / 2) + (t - tSnap) * 0.05)); l = 0.009; }
          if (t >= tHit) { d = depth(((tHit % 2) / 2)); bent = T.seg(t, tHit, tHit + 0.25); }
          var crownY = yh - 0.004 - d;
          piston.position.y = crownY;
          rod.position.set(Math.sin(2 * PI * p) * 0.01 * (t < tHit ? 1 : 0), crownY - 0.035 - 0.07, 0.002);
          rod.rotation.z = Math.sin(2 * PI * (t < tHit ? p : (tHit % 2) / 2)) * 0.12;
          vIn.position.y = yh - l;
          vIn.rotation.z = -0.12 - bent * 0.18;
          vEx.position.y = yh - (t < tSnap ? Math.max(0, 0.008 * Math.sin(2 * PI * (p - 0.55)) * (p > 0.55 ? 1 : 0)) : 0);
          var fk = T.pulse(t, tHit - 0.05, tHit + 0.5);
          flash.material.opacity = fk * 0.9; flash.scale.setScalar(0.5 + fk);
        },
        labels: [
          { text: V('Ventil', 'Valve'), at: [-0.05, yh + 0.08, 0.01] },
          { text: V('Píst', 'Piston'), at: function () { return new THREE.Vector3(0.0, piston.position.y - 0.065, 0.01); } },
          { text: V('NÁRAZ!', 'IMPACT!'), at: [-0.022, yh + 0.02, 0.01], show: [tHit, 8], level: 'danger' }
        ],
        captions: [
          { text: V('Řemen v pořádku: ventil a píst se nikdy nepotkají', 'Belt intact: valve and piston never meet'), show: [0, tSnap], level: 'ok' },
          { text: V('Řemen praskl! Ventil zůstal otevřený → píst do něj narazí', 'Belt snapped! Valve stays open → piston hits it'), show: [tSnap, 8], level: 'danger' },
          { text: V('Ohnuté ventily = drahá oprava motoru', 'Bent valves = costly engine repair'), show: [tHit + 0.3, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- TDC */
  R('timing.tdc', {
    duration: 6, camera: CAM_FRONT, shadow: 1.2, thumbT: 4.5,
    build: function (ctx, K) {
      var T = K.T, rig = timingRig(ctx, K);
      var bar = K.P.breakerBar(0.35); bar.rotation.x = PI / 2; bar.position.z = 0.07;
      var holder = new THREE.Group(); holder.add(bar); holder.position.set(rig.crank.x, rig.crank.y, 0); rig.root.add(holder);
      var arrow = K.FX.rotArrow(0.06, 'cw', 0xf5a524, 200, 0.004); arrow.position.set(rig.crank.x, rig.crank.y, 0.05); rig.root.add(arrow);
      return {
        root: rig.root,
        update: function (t) {
          var k = T.seg(t, 0.3, 3.6), a = (1 - k) * (-250 * PI / 180);
          rig.setCrank(a);
          holder.rotation.z = -a - 0.6;
          arrow.visible = t < 3.8;
        },
        labels: [
          { text: V('Značka vačky', 'Cam mark'), at: (function () { var c = rig.items.filter(function (i) { return isCam(i.id); })[0]; return [c.x, c.y + c.r + 0.04, 0.02]; })() },
          { text: V('Značka kliky', 'Crank mark'), at: [rig.crank.x, rig.crank.y - rig.crank.r - 0.04, 0.02] },
          { text: V('✔ OT válce 1', '✔ TDC cyl. 1'), at: [rig.crank.x + 0.09, rig.crank.y, 0.03], show: [3.7, 6], level: 'ok' }
        ],
        captions: [
          { text: V('Klikou otáčet jen PO směru hod. ručiček (směr motoru)', 'Turn the crank CLOCKWISE only (engine direction)') },
          { text: V('Nikdy neotáčet motorem pozpátku ani za vačku', 'Never turn the engine backwards or by the cam'), level: 'danger', show: [1.5, 6] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- locking tools */
  function lockPin(K) {
    var g = new THREE.Group();
    var rod = K.mesh(K.G.cylZ(0.005, 0.07, 16), 'chrome'); rod.position.z = 0.035; g.add(rod);
    var grip = K.mesh(K.G.cylZ(0.011, 0.03, 20), 'toolYellow'); grip.position.z = 0.08; g.add(grip);
    return g;
  }
  function addLocks(ctx, K, rig) {
    var pins = [];
    rig.items.forEach(function (it) {
      if (!(isCam(it.id))) return;
      if (ctx.vehicle === 'volvo-xc60-b4' && it.id === 'camEx') { /* Volvo: one tool for both cams */ }
      var p = lockPin(K); var lh = it.obj.userData.lockHole;
      p.position.set(it.x + lh.x, it.y + lh.y, 0); rig.root.add(p); pins.push({ obj: p, it: it });
    });
    var tool = new THREE.Group();
    var plate = K.mesh(K.G.rbox(0.07, 0.03, 0.012, 0.004), 'toolYellow'); tool.add(plate);
    var tooth = K.mesh(K.G.box(0.008, 0.016, 0.03), 'steelDark'); tooth.position.set(0, 0.018, -0.012); tool.add(tooth);
    var bolt = K.mesh(K.G.hex(0.007, 0.01), 'zinc'); bolt.rotation.x = PI / 2; bolt.position.set(0.025, 0, 0.008); tool.add(bolt);
    var c = rig.crank; tool.userData.home = new THREE.Vector3(c.x, c.y - c.r - 0.02, 0.022);
    rig.root.add(tool);
    return { pins: pins, tool: tool };
  }

  R('timing.lock', {
    duration: 6, camera: { pos: [0.35, 0.55, 0.85], target: [0.02, 0.36, 0], fov: 38 }, shadow: 1.2, thumbT: 4.5,
    build: function (ctx, K) {
      if (CHAIN[ctx.vehicle]) return chainScene(ctx, K, { locks: true });
      var T = K.T, rig = timingRig(ctx, K), L = addLocks(ctx, K, rig);
      var labels = L.pins.map(function (p) {
        return { text: p.it.id === 'hp' ? V('Kolík VT čerpadla', 'HP pump pin') : V('Kolík vačky', 'Cam locking pin'), at: p.obj, show: [1.2, 6] };
      });
      labels.push({ text: V('Aretace kliky', 'Crank locking tool'), at: L.tool, show: [3.3, 6] });
      return {
        root: rig.root,
        update: function (t) {
          L.pins.forEach(function (p, i) { var k = T.seg(t, 0.4 + i * 0.5, 1.6 + i * 0.5); p.obj.position.z = (1 - k) * 0.12 - k * 0.012; });
          var k2 = T.seg(t, 2.4, 3.4);
          L.tool.position.copy(L.tool.userData.home).add(new THREE.Vector3(0, -(1 - k2) * 0.08, (1 - k2) * 0.05));
        },
        labels: labels,
        captions: [
          { text: V('Zajistit nářadím – ne jen značky barvou!', 'Lock with tools – not just paint marks!'), level: 'danger' },
          { text: V('Kolíky musí jít volně – nikdy netlouct', 'Pins must slide in freely – never hammer them'), show: [2, 6] },
          { text: V('✔ Klika i vačky zajištěné', '✔ Crank and cams locked'), show: [3.8, 6], level: 'ok' }
        ]
      };
    }
  });

  /* ------------------------------------------------------- release & remove */
  R('timing.release', {
    duration: 7, camera: CAM_FRONT, shadow: 1.2, thumbT: 2.5,
    build: function (ctx, K) {
      var T = K.T, rig = timingRig(ctx, K), L = addLocks(ctx, K, rig);
      L.pins.forEach(function (p) { p.obj.position.z = -0.012; }); L.tool.position.copy(L.tool.userData.home);
      var fade = K.FX.fader(rig.belt);
      var mark = K.FX.arrow([-0.03, 0, 0], [0.03, 0, 0], 0xffffff, 0.003);
      var cam = rig.items.filter(function (i) { return isCam(i.id); })[0];
      mark.position.set(cam.x - 0.02, cam.y + cam.r + 0.008, 0.016); rig.root.add(mark);
      var tens = rig.find('tens');
      var key = new THREE.Group();
      var kshaft = K.mesh(K.G.cylZ(0.003, 0.06, 6), 'blackOxide'); kshaft.position.z = 0.03; key.add(kshaft);
      var karm = K.mesh(K.G.cylX(0.003, 0.07, 6), 'blackOxide'); karm.position.set(0.035, 0, 0.06); key.add(karm);
      key.position.set(tens.x, tens.y, 0); rig.root.add(key);
      return {
        root: rig.root,
        update: function (t) {
          mark.visible = t > 0.4 && t < 6.6;
          mark.scale.setScalar(T.seg(t, 0.4, 1.2) || 0.001);
          var r = T.seg(t, 1.6, 2.8);
          key.rotation.z = r * 0.9; tens.spin.rotation.z = r * 0.9;
          tens.pivot.position.x = tens.x - r * 0.006;
          var off = T.seg(t, 3.2, 5.0);
          rig.belt.position.set(0, 0, off * 0.14);
          fade(1 - T.seg(t, 4.2, 5.0));
          if (t > 6.6) { var b = T.seg(t, 6.6, 7); rig.belt.position.z = 0; fade(b); }
        },
        labels: [
          { text: V('Šipka směru chodu', 'Direction arrow'), at: mark, show: [0.8, 3] },
          { text: V('Aretace zůstávají!', 'Locks stay in!'), at: [rig.crank.x, rig.crank.y - rig.crank.r - 0.05, 0.03], level: 'danger', show: [3, 7] }
        ],
        captions: [
          { text: V('1. Šipkou označit směr chodu (pokud budete řemen znovu používat)', '1. Mark running direction (if the belt is to be reused)'), show: [0, 1.6] },
          { text: V('2. Povolit napínák (imbus / excentr)', '2. Release the tensioner (Allen key / eccentric)'), show: [1.6, 3.2] },
          { text: V('3. Sundat řemen – klika a vačky se nesmí pohnout', '3. Remove the belt – crank and cams must not move'), show: [3.2, 7] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- replace kit parts */
  R('timing.replace', {
    duration: 7, camera: CAM_FRONT, shadow: 1.2, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, rig = timingRig(ctx, K, { belt: false });
      var parts = rig.items.filter(function (i) { return i.id === 'tens' || i.id === 'idler' || i.id === 'pump'; });
      parts.forEach(function (p) {
        p.oldFade = K.FX.fader(p.obj);
        var nw = p.kind === 's' ? sprocket(K, p.r, { mark: false }) : smoothPulley(K, p.r, { faceMat: 'plasticGrey' });
        p.spin.add(nw); p.newObj = nw; p.newFade = K.FX.fader(nw); p.glow = K.FX.glow(nw, 0x30a46c);
        if (p.id === 'pump') { var imp = K.mesh(K.G.cylZ(p.r * 0.9, 0.012, 24), 'plasticBlack'); imp.position.z = -0.03; nw.add(imp); }
      });
      return {
        root: rig.root,
        update: function (t) {
          parts.forEach(function (p, i) {
            var out = T.seg(t, 0.5 + i * 0.3, 1.8 + i * 0.3), inn = T.seg(t, 2.6 + i * 0.3, 3.9 + i * 0.3);
            p.obj.position.z = out * 0.18; p.oldFade(1 - T.seg(t, 1.2 + i * 0.3, 1.8 + i * 0.3));
            p.newObj.position.z = (1 - inn) * 0.18; p.newFade(T.seg(t, 2.6 + i * 0.3, 3.0 + i * 0.3) * (1 - T.seg(t, 6.7, 7)));
            p.glow(T.between(t, 4, 6.7) ? 0.4 + 0.3 * Math.sin(t * 6) : 0);
          });
        },
        labels: parts.map(function (p) { return { text: { cs: 'NOVÉ: ' + TXT[p.id].cs, en: 'NEW: ' + TXT[p.id].en }, at: [p.x, p.y + p.r + 0.03, 0.04], show: [4, 7], level: 'ok' }; }),
        captions: [
          { text: V('Vyměnit: napínák, kladky, vodní pumpu (+ nové šrouby)', 'Replace: tensioner, idlers, water pump (+ new bolts)') },
          { text: V('Vždy celá sada – starý napínák zničí nový řemen', 'Always the full kit – an old tensioner kills a new belt'), level: 'info', show: [2, 7] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- fit new belt in order */
  R('timing.beltOn', {
    duration: 10, camera: CAM_FRONT, shadow: 1.2, thumbT: 8,
    build: function (ctx, K) {
      var T = K.T, rig = timingRig(ctx, K), n = rig.belt.userData.n, step = rig.belt.userData.step;
      // segment index where the belt reaches each item (in path order = install order)
      var lengths = K.G.pathLengths(rig.path);
      var arrive = rig.order.map(function (it) {
        for (var i = 0; i < rig.path.length; i++) { var p = rig.path[i]; if (Math.abs(Math.hypot(p.x - it.x, p.y - it.y) - it.r) < 0.0008) return Math.floor(lengths[i] / step); }
        return 0;
      });
      arrive[0] = 0;
      var labels = rig.order.map(function (it, i) {
        var at = 0.3 + 7 * arrive[i] / n;
        return { text: String(i + 1), at: [it.x, it.y, 0.045], show: [at, 10], level: 'accent' };
      });
      return {
        root: rig.root,
        update: function (t) { rig.setCrank(0, Math.floor(T.lin(t, 0.3, 7.3) * n)); rig.belt.visible = t > 0.3; },
        labels: labels,
        captions: [
          { text: { cs: 'Nasazovat v pořadí 1 → ' + rig.order.length + ' (klika první)', en: 'Fit in order 1 → ' + rig.order.length + ' (crank first)' } },
          { text: V('Tažná strana napnutá, vůle jen u napínáku', 'Tight side taut, slack only at the tensioner'), show: [3, 10], level: 'info' },
          { text: V('Šipka na řemenu = směr chodu motoru', 'Arrow on the belt = engine running direction'), show: [6, 10] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- tensioner close-up */
  R('timing.tensioner', {
    duration: 7, camera: { pos: [0.06, 0.06, 0.32], target: [0, 0.01, 0], fov: 34 }, ground: false, shadow: 0.4, thumbT: 4.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var back = K.mesh(K.G.extrude(K.G.rrect(0.22, 0.2, 0.02), 0.02, 0.004), 'aluCast'); back.position.z = -0.035; root.add(back);
      var base = K.mesh(K.G.cylZ(0.045, 0.006, 40), 'steelDark'); base.position.z = -0.022; root.add(base);
      // window (two marks) at the top of the base plate
      [-1, 1].forEach(function (s) { var m = K.mesh(K.G.box(0.002, 0.012, 0.003), 'hiOk'); m.position.set(s * 0.005, 0.052, -0.018); root.add(m); });
      var ecc = new THREE.Group(); root.add(ecc);
      var pul = smoothPulley(K, 0.032); pul.position.set(0.009, 0, 0); ecc.add(pul);
      var hub = K.mesh(K.G.cylZ(0.012, 0.03, 24), 'steel'); hub.position.z = 0.005; ecc.add(hub);
      var hexHole = K.mesh(K.G.hex(0.004, 0.032), 'blackOxide'); hexHole.rotation.x = PI / 2; hexHole.position.z = 0.006; ecc.add(hexHole);
      var pointer = K.mesh(K.G.box(0.003, 0.05, 0.002), 'hiDanger'); pointer.position.set(0, 0.03, -0.016); ecc.add(pointer);
      var tip = K.mesh(new THREE.ConeGeometry(0.004, 0.008, 3), 'hiDanger'); tip.position.set(0, 0.058, -0.016); ecc.add(tip);
      var belt = K.mesh(K.G.box(0.004, 0.24, 0.025), K.M.clone('rubber', { color: 0x1a1b1e }));
      root.add(belt);
      var key = new THREE.Group();
      var ks = K.mesh(K.G.cylZ(0.0035, 0.05, 6), 'blackOxide'); ks.position.z = 0.03; key.add(ks);
      var ka = K.mesh(K.G.cylX(0.0035, 0.08, 6), 'blackOxide'); ka.position.set(0.04, 0, 0.055); key.add(ka);
      root.add(key);
      var nut = K.mesh(K.G.hex(0.009, 0.008), 'zinc'); nut.rotation.x = PI / 2; nut.position.z = 0.024; root.add(nut);
      var tw = K.P.torqueWrench(0.22); tw.rotation.x = PI / 2; tw.scale.setScalar(0.7); var twH = new THREE.Group(); twH.add(tw); tw.position.z = 0.03; root.add(twH);
      var ok = K.FX.glow(pointer, 0x30a46c);
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 0.5, 3.2), a = (1 - k) * 0.95;
          ecc.rotation.z = a; key.rotation.z = a - 0.4;
          var cx = 0.009 * Math.cos(a) + 0.032;
          belt.position.set(cx + 0.002, 0, 0);
          key.visible = t < 4; twH.visible = t >= 4 && t < 6.8;
          twH.rotation.z = -0.4 - T.seg(t, 4.3, 5.4) * 0.5;
          ok(t > 3.2 ? 0.8 : 0);
        },
        labels: [
          { text: V('Okénko', 'Window'), at: [0, 0.075, -0.01] },
          { text: V('✔ ukazatel v okénku', '✔ pointer in window'), at: [0.04, 0.07, 0], show: [3.3, 7], level: 'ok' },
          { text: V('matice: moment (+ úhel) dle příručky', 'nut: torque (+ angle) per manual'), at: [0, -0.03, 0.03], show: [4.2, 6.8], level: 'accent' }
        ],
        captions: [
          { text: V('1. Excentr otočte imbusem proti napínání', '1. Turn the eccentric with an Allen key'), show: [0, 3.2] },
          { text: V('2. Ukazatel přesně do okénka', '2. Pointer exactly into the window'), show: [3.2, 4.2], level: 'ok' },
          { text: V('3. Matici utáhnout momentem (+ úhel) – excentr přidržet', '3. Torque the nut (+ angle) – hold the eccentric'), show: [4.2, 7] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- two full crank turns */
  R('timing.rotate2', {
    duration: 8, camera: CAM_FRONT, shadow: 1.2, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, rig = timingRig(ctx, K);
      var bar = K.P.breakerBar(0.35); bar.rotation.x = PI / 2; bar.position.z = 0.07;
      var holder = new THREE.Group(); holder.add(bar); holder.position.set(rig.crank.x, rig.crank.y, 0); rig.root.add(holder);
      var cam = rig.items.filter(function (i) { return isCam(i.id); })[0];
      return {
        root: rig.root,
        update: function (t) { var a = T.lin(t, 0.2, 6.4) * 4 * PI; rig.setCrank(a); holder.rotation.z = -a - 0.6; },
        labels: [
          { text: V('Klika: 1 otáčka', 'Crank: 1 turn'), at: [rig.crank.x + 0.1, rig.crank.y, 0.03], show: [3.3, 6.4], level: 'accent' },
          { text: V('Klika: 2 otáčky ✔', 'Crank: 2 turns ✔'), at: [rig.crank.x + 0.1, rig.crank.y, 0.03], show: [6.4, 8], level: 'ok' },
          { text: V('Vačka: 1 otáčka', 'Cam: 1 turn'), at: [cam.x, cam.y + cam.r + 0.04, 0.02], show: [6.4, 8], level: 'ok' },
          { text: V('Značky opět souhlasí', 'Marks align again'), at: [rig.crank.x, rig.crank.y - rig.crank.r - 0.05, 0.02], show: [6.6, 8], level: 'ok' }
        ],
        captions: [
          { text: V('Aretace pryč → 2 otáčky klikou ručně (po směru)', 'Locks out → turn the crank 2 turns by hand (clockwise)') },
          { text: V('Ztuha? Okamžitě STOP – ventil naráží!', 'Any resistance? STOP at once – a valve is hitting!'), level: 'danger' }
        ]
      };
    }
  });

  /* ------------------------------------------------------- coolant: drain */
  function radiator(K, mat) {
    var g = new THREE.Group();
    var core = K.mesh(K.G.box(0.62, 0.42, 0.03), 'aluCast'); g.add(core);
    for (var i = 0; i < 34; i++) { var fin = K.mesh(K.G.box(0.003, 0.42, 0.032), 'alu'); fin.position.x = -0.3 + i * 0.0182; g.add(fin); }
    [-1, 1].forEach(function (s) { var tank = K.mesh(K.G.rbox(0.05, 0.48, 0.05, 0.01), 'plasticBlack'); tank.position.x = s * 0.335; g.add(tank); });
    var level = new THREE.Group(); var liq = K.mesh(K.G.box(0.03, 0.44, 0.03), K.M[mat]); liq.position.y = 0.22; level.add(liq);
    level.position.set(0.335, -0.22, 0.03); g.add(level);
    var win = K.mesh(K.G.box(0.034, 0.46, 0.002), K.M.glassClear); win.position.set(0.335, 0, 0.026); g.add(win);
    var hose = K.mesh(K.G.tube([[0.335, 0.2, 0], [0.42, 0.24, 0], [0.5, 0.3, -0.05]], 0.018), 'rubber'); g.add(hose);
    var plug = K.mesh(K.G.cyl(0.009, 0.02, 16), K.M.clone('plasticWhite', { color: 0x3a6fd8 })); plug.position.set(0.335, -0.255, 0.02); g.add(plug);
    g.userData = { level: level, plug: plug };
    return g;
  }
  R('timing.drain', {
    duration: 7, camera: { pos: [0.75, 0.55, 1.2], target: [0.25, 0.3, 0], fov: 36 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), mat = F3.coolantMat(K, ctx.vehicle);
      var rad = radiator(K, mat); rad.position.set(0, 0.5, 0); root.add(rad);
      var pan = K.P.drainPan(0.2, 0.08); pan.position.set(0.37, 0, 0.05); F3.panLiquid(pan, K, mat); root.add(pan);
      var stream = K.FX.stream([0.335, 0.235, 0.02], [0.35, 0.15, 0.04], [0.37, 0.05, 0.05], K.M[mat], 0.006); root.add(stream.mesh);
      return {
        root: root,
        update: function (t) {
          var open = T.seg(t, 0.6, 1.2);
          rad.userData.plug.position.y = -0.255 - open * 0.03;
          var flow = T.between(t, 1.2, 6.0);
          stream.set(flow ? 1 : 0);
          var k = T.lin(t, 1.2, 6.0);
          rad.userData.level.scale.y = Math.max(0.03, 1 - k);
          pan.userData.setLevel(k * 0.85 * (1 - T.seg(t, 6.7, 7)));
        },
        labels: [
          { text: V('Vypouštěcí šroub', 'Drain plug'), at: [0.335, 0.2, 0.05] },
          { text: V('Jedovatá! Sladká chuť láká zvířata', 'Toxic! Sweet taste attracts pets'), at: [0.37, 0.12, 0.1], level: 'danger', show: [2, 7] }
        ],
        captions: [
          { text: V('Jen studený motor, víčko nádržky povolit', 'Cold engine only, loosen the expansion tank cap') },
          { text: V('Vše zachytit, nádobu zakrýt, odevzdat ve sběrném dvoře', 'Catch it all, cover it, take it to a recycling centre'), level: 'info', show: [3, 7] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- coolant: refill & bleed */
  R('timing.coolant', {
    duration: 8, camera: { pos: [0.25, 0.42, 0.75], target: [0.05, 0.28, 0], fov: 36 }, shadow: 0.8, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), mat = F3.coolantMat(K, ctx.vehicle);
      var tank = K.mesh(K.G.rbox(0.16, 0.2, 0.1, 0.03), K.M.clone('plasticWhite', { transparent: true, opacity: 0.45 })); tank.position.set(0.14, 0.32, 0); root.add(tank);
      var liq = new THREE.Group(); var lm = K.mesh(K.G.box(0.14, 0.17, 0.08), K.M[mat]); lm.position.y = 0.085; liq.add(lm); liq.position.set(0.14, 0.235, 0); root.add(liq);
      [[0.28, 'MAX'], [0.25, 'MIN']].forEach(function (m) { var l = K.mesh(K.G.box(0.05, 0.003, 0.002), 'plasticBlack'); l.position.set(0.17, m[0], 0.051); root.add(l); });
      var cap = K.mesh(K.G.cyl(0.03, 0.025, 32), 'plasticBlack'); cap.position.set(0.14, 0.44, 0); root.add(cap);
      var hose = K.mesh(K.G.tube([[-0.25, 0.22, 0], [-0.1, 0.2, 0], [0.05, 0.24, 0], [0.12, 0.23, 0]], 0.018), 'rubber'); root.add(hose);
      var housing = K.mesh(K.G.rbox(0.07, 0.05, 0.06, 0.01), 'aluCast'); housing.position.set(-0.12, 0.22, 0); root.add(housing);
      var screw = K.mesh(K.G.hex(0.008, 0.012), 'plasticGrey'); screw.position.set(-0.12, 0.255, 0); root.add(screw);
      var bubbles = [];
      for (var i = 0; i < 8; i++) { var b = K.mesh(K.G.sphere(0.004, 8), K.M.clone('glassClear', { opacity: 0.7 })); b.userData.o = i / 8; root.add(b); bubbles.push(b); }
      var bottle = K.P.oilCan(0x3a6fd8); bottle.position.set(0.27, 0.5, 0.0); bottle.rotation.z = 2.0; bottle.scale.setScalar(0.45); root.add(bottle);
      var pour = K.FX.stream([0.132, 0.466, 0], [0.138, 0.45, 0], [0.14, 0.4, 0], K.M[mat], 0.004); root.add(pour.mesh);
      return {
        root: root,
        update: function (t) {
          var fill = T.seg(t, 0.4, 4.5);
          liq.scale.y = 0.2 + 0.8 * fill;
          bottle.visible = t < 4.6; pour.set(T.between(t, 0.6, 4.5) ? 1 : 0);
          cap.position.y = t < 4.8 ? 0.6 : 0.44;
          var open = T.between(t, 1.5, 6.0);
          screw.position.y = 0.255 + (open ? 0.006 : 0);
          bubbles.forEach(function (b) {
            var k = (t * 0.9 + b.userData.o) % 1;
            b.visible = open && t < 5.0;
            b.position.set(-0.12 + Math.sin(b.userData.o * 20) * 0.004, 0.27 + k * 0.08, 0);
          });
        },
        labels: [
          { text: V('Odvzdušňovací šroub', 'Bleed screw'), at: [-0.12, 0.25, 0.03] },
          { text: V('Vzduch uniká…', 'Air escaping…'), at: [-0.12, 0.36, 0], show: [1.5, 5] },
          { text: V('✔ bez bublin → zavřít', '✔ no bubbles → close'), at: [-0.12, 0.33, 0], show: [5, 6.2], level: 'ok' },
          { text: V('Hladina mezi MIN–MAX', 'Level between MIN–MAX'), at: [0.14, 0.43, 0.06], show: [4.5, 8] }
        ],
        captions: [
          { text: V('Víčko otevírat jen za studena!', 'Open the cap only when cold!'), level: 'danger' },
          { text: V('Topení naplno, motor na volnoběh, odvzdušnit dle příručky', 'Heater on max, engine idling, bleed per manual'), show: [2, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- engine support + mount removal */
  R('timing.support', {
    duration: 7, camera: { pos: [1.5, 1.45, 1.3], target: [0, 0.75, 0], fov: 38 }, shadow: 1.6, thumbT: 5.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var paint = K.M.carPaint(K.carSpec(ctx.vehicle).paint);
      [-1, 1].forEach(function (s) {
        var wing = K.mesh(K.G.rbox(1.0, 0.08, 0.22, 0.03), paint); wing.position.set(0, 0.95, s * 0.75); root.add(wing);
        var inner = K.mesh(K.G.box(1.0, 0.5, 0.02), 'blackOxide'); inner.position.set(0, 0.68, s * 0.64); root.add(inner);
      });
      var eng = K.P.engine({ cyl: 4 }); eng.rotation.y = PI / 2; eng.position.set(0, 0.28, 0); root.add(eng);
      var bar = new THREE.Group();
      var beam = K.mesh(K.G.box(0.08, 0.08, 1.75), 'toolYellow'); bar.add(beam);
      [-1, 1].forEach(function (s) { var foot = K.mesh(K.G.rbox(0.16, 0.06, 0.12, 0.01), 'rubber'); foot.position.set(0, -0.07, s * 0.75); bar.add(foot); });
      var spindle = K.mesh(K.G.cyl(0.012, 0.25, 16), 'chrome'); spindle.position.set(0, -0.12, 0.25); bar.add(spindle);
      var hook = K.mesh(K.G.torus(0.025, 0.006, PI * 1.5, 16), 'steelDark'); hook.position.set(0, -0.26, 0.25); bar.add(hook);
      var chain = K.mesh(K.G.cyl(0.004, 0.08, 6), 'steel'); chain.position.set(0, -0.3, 0.25); bar.add(chain);
      root.add(bar);
      var mount = new THREE.Group();
      var br = K.mesh(K.G.rbox(0.2, 0.08, 0.16, 0.015), 'aluCast'); mount.add(br);
      var rub = K.mesh(K.G.cyl(0.05, 0.06, 24), 'rubber'); rub.position.set(-0.05, -0.02, 0); mount.add(rub);
      var bolts = [];
      [[-0.06, 0.04], [0.04, 0.05], [0.07, -0.04]].forEach(function (p) {
        var b = K.P.bolt({ r: 0.006, len: 0.03, mat: 'blackOxide' }); b.position.set(p[0], 0.042, p[1]); mount.add(b); bolts.push(b);
      });
      mount.position.set(0.0, 0.88, 0.5); root.add(mount);
      var mf = K.FX.fader(mount);
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 0.3, 1.6);
          bar.position.set(0, 1.07 + (1 - k) * 0.4, 0);
          bolts.forEach(function (b, i) { var u = T.seg(t, 2.2 + i * 0.4, 2.8 + i * 0.4); b.position.y = 0.042 + u * 0.05; b.rotation.y = u * 6; });
          var off = T.seg(t, 4.0, 5.2);
          mount.position.set(off * 0.15, 0.88 + off * 0.35, 0.5 + off * 0.2);
          mf(1 - T.seg(t, 4.6, 5.2) * (1 - T.seg(t, 6.7, 7)));
          if (t > 6.7) mount.position.set(0, 0.88, 0.5);
        },
        labels: [
          { text: V('Podpěra motoru (traverza)', 'Engine support bar'), at: [0, 1.15, -0.4], show: [0.8, 7] },
          { text: V('Držák motoru', 'Engine mount'), at: function () { return mount.position.clone().add(new THREE.Vector3(0, 0.09, 0)); }, show: [1.6, 4.6] }
        ],
        captions: [
          { text: V('Podpěra přes blatníky – zavěsit za ucho motoru', 'Support bar across the wings – hook onto the engine eye') },
          { text: V('Nejdřív podepřít, pak povolit držák!', 'Support first, then remove the mount!'), level: 'danger', show: [1.6, 7] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- diagnostics (chain stretch) */
  R('timing.diag', {
    duration: 8, camera: { pos: [0.15, 0.45, 0.6], target: [0, 0.3, 0], fov: 34 }, shadow: 0.7, thumbT: 6.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var title = S.t(V('Vačka vs. klika (°)', 'Cam vs. crank (°)'));
      var okT = S.t(V('V toleranci – OK', 'Within limits – OK')), badT = S.t(V('Mimo toleranci → servis', 'Out of limits → workshop'));
      var tool = ctx.vehicle === 'mb-cl500-c216' ? 'XENTRY' : ctx.vehicle === 'toyota-gr-yaris' ? 'Techstream' : S.t(V('Diagnostika', 'Scan tool'));
      var dev = F3.scanTool(K, function (c, W, H, st) {
        st = st || { v: 0 };
        F3.screenBase(c, W, H, tool);
        c.fillStyle = '#cfe3f2'; c.font = 'bold ' + Math.round(H * 0.06) + 'px system-ui, Arial'; c.textAlign = 'center';
        c.fillText(title, W / 2, H * 0.27);
        var x0 = W * 0.1, x1 = W * 0.9, y = H * 0.45, h = H * 0.08;
        c.fillStyle = '#c9282d'; c.fillRect(x0, y, x1 - x0, h);
        c.fillStyle = '#1f8a56'; c.fillRect(W * 0.35, y, W * 0.3, h);
        var nx = W / 2 + st.v * W * 0.04;
        c.fillStyle = '#ffffff'; c.fillRect(nx - 4, y - h * 0.5, 8, h * 2);
        c.font = 'bold ' + Math.round(H * 0.05) + 'px system-ui, Arial'; c.fillText(st.v.toFixed(1) + '°', nx, y + h * 2.2);
        var ok = Math.abs(st.v) < 3.6;
        c.fillStyle = ok ? '#30a46c' : '#e5484d'; c.font = 'bold ' + Math.round(H * 0.07) + 'px system-ui, Arial';
        c.fillText(ok ? okT : badT, W / 2, H * 0.83);
      }, { v: 0 });
      dev.position.set(0, 0.32, 0); dev.rotation.x = -0.25; root.add(dev);
      var stand = K.mesh(K.G.rbox(0.24, 0.02, 0.16, 0.006), 'plasticGrey'); stand.position.set(0, 0.17, -0.03); root.add(stand);
      return {
        root: root,
        update: function (t) {
          var v = t < 4.2 ? Math.sin(t * 2.3) * 1.6 : -1.6 + T.seg(t, 4.2, 5.2) * -8.4 + Math.sin(t * 7) * 0.4;
          dev.userData.screen.userData.redraw({ v: Math.round(v * 5) / 5 });
        },
        captions: [
          { text: V('Diagnostika natažení řetězu: skutečné hodnoty vs. limity dle příručky', 'Diagnosing chain stretch: live data vs. limits per manual') },
          { text: V('Odchylka mimo toleranci = natažený řetěz → servis', 'Deviation out of limits = stretched chain → workshop'), level: 'danger', show: [5, 8] }
        ]
      };
    }
  });
})(window.STU);
