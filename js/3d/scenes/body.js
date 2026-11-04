/* 3D scenes: bodywork – dent & rust repair, filler, primer, paint. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  function isAlu(v) { return v === 'mb-cl500-c216' || v === 'toyota-gr-yaris'; }

  var PY = 1.0;                       // panel centre height
  var CAM = { pos: [0.55, 1.28, 1.35], target: [0.02, 0.98, 0], fov: 34 };

  /** Curved body panel (door skin) on a workshop stand. Height field z = f(x, y) in panel space,
   *  facing +Z. Dent and repair patches follow the same surface. */
  function panelRig(ctx, K, o) {
    o = o || {};
    var W = 0.9, H = 0.56, nx = 90, ny = 56;
    var dent = { x: 0.05, y: 0.0, sx: 0.12, sy: 0.085, depth: o.depth == null ? 0.012 : o.depth };
    var k = { dent: o.dent == null ? 1 : o.dent };
    function f(x, y, dk) {
      var e = Math.exp(-((x - dent.x) * (x - dent.x) / (dent.sx * dent.sx) + (y - dent.y) * (y - dent.y) / (dent.sy * dent.sy)));
      return -0.2 * x * x + 0.04 * y - dk * dent.depth * e;
    }
    var root = new THREE.Group(); root.position.set(0, PY, 0);
    var geo = new THREE.PlaneGeometry(W, H, nx, ny);
    var pos = geo.attributes.position;
    var paint = K.M.carPaint(K.carSpec(ctx.vehicle).paint).clone();
    paint.side = THREE.DoubleSide; paint.userData = {};
    var panel = new THREE.Mesh(geo, paint); root.add(panel);
    // folded edge (hem) around the panel for thickness
    var edge = [];
    for (var i = 0; i <= 40; i++) edge.push([-W / 2 + W * i / 40, H / 2]);
    for (var j = 0; j <= 24; j++) edge.push([W / 2, H / 2 - H * j / 24]);
    for (var i2 = 0; i2 <= 40; i2++) edge.push([W / 2 - W * i2 / 40, -H / 2]);
    for (var j2 = 0; j2 <= 24; j2++) edge.push([-W / 2, -H / 2 + H * j2 / 24]);
    var hem = new THREE.Mesh(K.G.tube(edge.map(function (p) { return [p[0], p[1], f(p[0], p[1], 0) - 0.004]; }), 0.005, true, 300, 6), paint);
    root.add(hem);
    // stand
    var stand = new THREE.Group();
    [-0.32, 0.32].forEach(function (x) {
      var post = K.mesh(K.G.cyl(0.015, PY - 0.2, 16), 'steelDark'); post.position.set(x, -(PY - 0.2) / 2 - 0.08, -0.05); stand.add(post);
      var foot = K.mesh(K.G.box(0.05, 0.02, 0.45), 'steelDark'); foot.position.set(x, -PY + 0.01, -0.05); stand.add(foot);
      var clamp = K.mesh(K.G.rbox(0.05, 0.06, 0.04, 0.01), 'toolRed'); clamp.position.set(x, -H / 2 - 0.02, f(x, -H / 2, 0) - 0.02); stand.add(clamp);
    });
    root.add(stand);
    var patches = [];
    function setDent(dk) {
      if (Math.abs(dk - k.dent) < 1e-4 && k.inited) return;
      k.dent = dk; k.inited = true;
      for (var q = 0; q < pos.count; q++) pos.setZ(q, f(pos.getX(q), pos.getY(q), dk));
      pos.needsUpdate = true; geo.computeVertexNormals();
      patches.forEach(function (p) { p.userData.refresh(); });
    }
    /** Circular patch following the surface. off(d) = offset above surface at radius d (0..r). */
    function patch(r, off, mat, cx, cy, segs) {
      cx = cx == null ? dent.x : cx; cy = cy == null ? dent.y : cy;
      var g = new THREE.RingGeometry(0.0001, r, segs || 64, 18);
      var pp = g.attributes.position;
      var base = [];
      for (var a = 0; a < pp.count; a++) base.push([pp.getX(a), pp.getY(a)]);
      var m = new THREE.Mesh(g, typeof mat === 'string' ? K.M[mat] : mat);
      m.userData.offScale = 1;
      m.userData.refresh = function () {
        for (var b = 0; b < pp.count; b++) {
          var x = base[b][0] + cx, y = base[b][1] + cy, d = Math.hypot(base[b][0], base[b][1]) / r;
          pp.setXYZ(b, x, y, f(x, y, k.dent) + off(d) * m.userData.offScale);
        }
        pp.needsUpdate = true; g.computeVertexNormals();
      };
      m.userData.refresh();
      m.userData.noShadow = true;
      root.add(m); patches.push(m);
      return m;
    }
    function surf(x, y, lift) { return new THREE.Vector3(x, y + PY, f(x, y, k.dent) + (lift || 0)); }
    setDent(k.dent);
    return { root: root, setDent: setDent, patch: patch, f: f, surf: surf, dent: dent, paint: paint, W: W, H: H, k: k };
  }

  /* ----------------------------------------------------------------- tools */
  function sander(K) {
    var g = new THREE.Group();
    var pad = K.mesh(K.G.cylZ(0.075, 0.016, 48), 'plasticBlack'); pad.position.z = 0.008; g.add(pad);
    var disc = K.mesh(K.G.cylZ(0.075, 0.002, 48), K.M.clone('padFriction', { color: 0x8a7650 })); g.add(disc);
    var body = K.mesh(K.G.cylZ(0.045, 0.1, 32), 'toolYellow'); body.position.z = 0.07; g.add(body);
    var head = K.mesh(K.G.sphere(0.05, 24), 'plasticBlack'); head.position.z = 0.12; head.scale.z = 0.7; g.add(head);
    var handle = K.mesh(K.G.rbox(0.035, 0.14, 0.04, 0.012), 'gripRubber'); handle.position.set(0, -0.09, 0.07); g.add(handle);
    var hose = K.mesh(K.G.tube([[0, -0.16, 0.07], [0.02, -0.3, 0.1], [0.1, -0.5, 0.15]], 0.012), 'plasticGrey'); g.add(hose);
    g.userData.pad = pad; g.userData.disc = disc;
    return g;
  }
  function block(K, wet) {
    var g = new THREE.Group();
    var b = K.mesh(K.G.rbox(0.15, 0.07, 0.035, 0.01), wet ? 'toolBlue' : 'plasticTex'); b.position.z = 0.019; g.add(b);
    var p = K.mesh(K.G.box(0.15, 0.07, 0.002), K.M.clone('padFriction', { color: wet ? 0x2b2f3a : 0x9b8659 })); g.add(p);
    return g;
  }
  function sprayGun(K, cupMat) {
    var g = new THREE.Group();
    var body = K.mesh(K.G.rbox(0.05, 0.06, 0.13, 0.012), 'alu'); body.position.z = 0.07; g.add(body);
    var nozzle = K.mesh(K.G.cylZ(0.012, 0.03, 20), 'brass'); nozzle.position.z = 0.0; g.add(nozzle);
    var cap = K.mesh(K.G.cylZ(0.022, 0.012, 24), 'chrome'); cap.position.z = 0.012; g.add(cap);
    var horn1 = K.mesh(K.G.box(0.008, 0.05, 0.012), 'chrome'); horn1.position.set(0, 0, 0.004); g.add(horn1);
    var cup = K.mesh(K.G.lathe([[0.012, 0], [0.045, 0.02], [0.05, 0.12], [0.046, 0.13], [0, 0.13]], 32), cupMat || 'glassClear'); cup.position.set(0, 0.03, 0.06); g.add(cup);
    var lid = K.mesh(K.G.cyl(0.05, 0.01, 32), 'plasticBlack'); lid.position.set(0, 0.165, 0.06); g.add(lid);
    var handle = K.mesh(K.G.rbox(0.035, 0.13, 0.04, 0.012), 'alu'); handle.position.set(0, -0.09, 0.12); handle.rotation.x = 0.25; g.add(handle);
    var trig = K.mesh(K.G.box(0.01, 0.07, 0.008), 'chrome'); trig.position.set(0, -0.06, 0.085); trig.rotation.x = 0.2; g.add(trig);
    var hose = K.mesh(K.G.tube([[0, -0.16, 0.14], [0, -0.35, 0.2], [0.1, -0.6, 0.3]], 0.008), 'plasticBlack'); g.add(hose);
    return g;
  }
  /** Mist cone from the gun nozzle towards -Z. */
  function mist(K, color) {
    var p = K.FX.puff(color, 22, 0.09, 0.26);
    var holder = new THREE.Group(); holder.add(p.group); p.group.rotation.x = -PI / 2;
    return { group: holder, update: p.update };
  }
  function spreader(K) {
    var g = new THREE.Group();
    var b = K.mesh(K.G.rbox(0.11, 0.075, 0.003, 0.0012), K.M.clone('toolYellow', { transparent: true, opacity: 0.92 })); g.add(b);
    return g;
  }
  function faded(K, mesh, start) {
    var mat = mesh.material.clone(); mat.userData = {}; mat.transparent = true; mesh.material = mat;
    var base = mat.opacity;
    var set = function (k) { mesh.visible = k > 0.01; mat.opacity = base * k; mat.depthWrite = k > 0.95; };
    set(start == null ? 0 : start);
    return set;
  }

  /** Common scene wrapper for panel scenes. */
  function sceneOn(ctx, K, o) {
    var p = panelRig(ctx, K, o);
    var root = new THREE.Group(); root.add(p.root);
    return { p: p, root: root };
  }

  /* --------------------------------------------------------------- assess */
  R('body.assess', {
    duration: 9, camera: { pos: [0.75, 1.3, 1.25], target: [0.03, 0.98, 0], fov: 34 }, shadow: 1.5, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, s = sceneOn(ctx, K, { dent: 1, depth: 0.016 });
      // strip lights whose reflections reveal the dent
      var lights = new THREE.Group();
      for (var i = 0; i < 4; i++) {
        var tube = K.mesh(K.G.cylX(0.012, 1.4, 16), 'lightWhite'); tube.position.set(0, 1.5 + i * 0.1, 0.9 + i * 0.05); lights.add(tube);
      }
      s.root.add(lights);
      var lamp = new THREE.Group();
      var lh = K.mesh(K.G.rbox(0.28, 0.05, 0.05, 0.015), 'plasticBlack'); lamp.add(lh);
      var lled = K.mesh(K.G.box(0.24, 0.02, 0.005), 'lightWhite'); lled.position.z = 0.026; lamp.add(lled);
      lamp.rotation.x = -0.4; s.root.add(lamp);
      var alu = isAlu(ctx.vehicle);
      var mag = new THREE.Group();
      var red = K.M.clone('toolRed');
      [-1, 1].forEach(function (sd) { var leg = K.mesh(K.G.box(0.014, 0.05, 0.016), red); leg.position.set(sd * 0.012, 0.025, 0); mag.add(leg); var tip = K.mesh(K.G.box(0.014, 0.012, 0.016), 'steel'); tip.position.set(sd * 0.012, -0.006, 0); mag.add(tip); });
      var arc = K.mesh(K.G.torus(0.012, 0.007, PI, 16), red); arc.position.y = 0.05; mag.add(arc);
      mag.scale.setScalar(2.2); s.root.add(mag);
      var target = s.p.surf(0.32, -0.12, 0.012);
      return {
        root: s.root,
        update: function (t) {
          var sw = T.seg(t, 0.3, 3.5);
          lamp.position.set(-0.45 + 0.9 * sw, 1.32, 0.35);
          var inK = T.seg(t, 4.0, 5.2);
          mag.position.copy(target).add(new THREE.Vector3(0.25 * (1 - inK), 0.05 * (1 - inK), 0.25 * (1 - inK)));
          mag.rotation.set(-PI / 2 + 0.2, 0, 0);
          if (alu) {
            var fall = T.seg(t, 5.6, 6.6);
            mag.position.y -= fall * 0.62; mag.position.z += fall * 0.12; mag.rotation.z = fall * 1.4;
          }
        },
        labels: [
          { text: V('promáčklina', 'dent'), at: s.p.surf(s.p.dent.x, s.p.dent.y + 0.11, 0.01), show: [1.5, 9], level: 'accent' },
          { text: ctx.vehicle === 'generic' ? V('Magnet drží = ocel · nedrží = hliník / plast', 'Magnet sticks = steel · not = aluminium / plastic')
            : alu ? V('Magnet nedrží = hliník!', 'Magnet falls = aluminium!') : V('Magnet drží = ocelový díl', 'Magnet sticks = steel panel'),
            at: function () { return mag.position.clone().add(new THREE.Vector3(0, 0.08, 0)); }, show: [5.4, 9], level: alu ? 'danger' : 'ok' }
        ],
        captions: [
          { text: V('Odraz rovných čar odhalí promáčklinu', 'Reflected straight lines reveal the dent'), show: [0, 4] },
          { text: V('Test magnetem: ocel × hliník / plast', 'Magnet test: steel vs aluminium / plastic'), show: [4, 9] },
          { text: V('Prorezavělé / strukturální díly → karosárna', 'Rust-through / structural parts → body shop'), level: 'info', show: [6, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ ppe */
  R('body.ppe', {
    duration: 8, camera: { pos: [0, 1.25, 1.1], target: [0, 0.92, 0], fov: 34 }, shadow: 1.2, thumbT: 2,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var bench = K.mesh(K.G.rbox(1.2, 0.05, 0.6, 0.01), 'wood'); bench.position.y = 0.8; root.add(bench);
      [-0.55, 0.55].forEach(function (x) { [-0.25, 0.25].forEach(function (z) { var l = K.mesh(K.G.box(0.04, 0.78, 0.04), 'steelDark'); l.position.set(x, 0.39, z); root.add(l); }); });
      var items = new THREE.Group(); items.position.y = 0.83; root.add(items);
      // half-mask respirator with A2P3 cartridges
      var mask = new THREE.Group();
      var face = K.mesh(K.G.sphere(0.07, 32), 'rubber'); face.scale.set(1, 0.9, 0.7); mask.add(face);
      [-1, 1].forEach(function (sd) {
        var cart = K.mesh(K.G.cylZ(0.042, 0.035, 32), K.M.clone('plasticGrey', { color: 0x6b4a2a })); cart.position.set(sd * 0.075, -0.01, 0.025); cart.rotation.y = sd * 0.5; mask.add(cart);
        var band = K.mesh(K.G.cylZ(0.043, 0.008, 32), 'plasticWhite'); band.position.copy(cart.position); band.rotation.copy(cart.rotation); band.position.z += 0.01; mask.add(band);
      });
      var valve = K.mesh(K.G.cylZ(0.022, 0.02, 24), 'plasticBlack'); valve.position.set(0, -0.04, 0.05); mask.add(valve);
      var strap = K.mesh(K.G.torus(0.09, 0.006, PI, 24), 'fabric'); strap.position.set(0, 0.03, -0.05); strap.rotation.x = PI / 2; mask.add(strap);
      mask.position.set(-0.32, 0.07, 0); items.add(mask);
      // goggles
      var gog = new THREE.Group();
      var frame = K.mesh(K.G.rbox(0.18, 0.07, 0.05, 0.02), 'plasticBlack'); gog.add(frame);
      var lens = K.mesh(K.G.rbox(0.17, 0.06, 0.052, 0.018), 'lens'); lens.position.z = 0.004; gog.add(lens);
      var band2 = K.mesh(K.G.torus(0.09, 0.008, PI, 24), 'fabric'); band2.rotation.x = PI / 2; band2.position.z = -0.03; gog.add(band2);
      gog.position.set(0, 0.04, 0.02); items.add(gog);
      // nitrile gloves
      var glove = K.P.glove(K.M.clone('toolBlue', { color: 0x3b7bd8, roughness: 0.7 })); glove.rotation.set(-PI / 2, 0, 0.3); glove.position.set(0.28, 0.02, 0.02); items.add(glove);
      var glove2 = K.P.glove(K.M.clone('toolBlue', { color: 0x3b7bd8, roughness: 0.7 })); glove2.rotation.set(-PI / 2, 0, -0.2); glove2.position.set(0.38, 0.03, -0.06); items.add(glove2);
      // extinguisher
      var ext = new THREE.Group();
      var cyl = K.mesh(K.G.cyl(0.06, 0.38, 32), 'toolRed'); cyl.position.y = 0.19; ext.add(cyl);
      var top = K.mesh(K.G.sphere(0.06, 24), 'toolRed'); top.position.y = 0.38; top.scale.y = 0.6; ext.add(top);
      var valveE = K.mesh(K.G.rbox(0.06, 0.05, 0.03, 0.008), 'plasticBlack'); valveE.position.y = 0.43; ext.add(valveE);
      var hose = K.mesh(K.G.tube([[0.02, 0.42, 0], [0.07, 0.35, 0.02], [0.07, 0.2, 0.03]], 0.008), 'rubber'); ext.add(hose);
      ext.position.set(0.7, 0, 0.1); root.add(ext);
      return {
        root: root,
        update: function (t) {
          var pulse = function (o, a) { var s = 1 + 0.06 * Math.max(0, Math.sin((t - a) * PI)) * (t > a && t < a + 1 ? 1 : 0); o.scale.setScalar(s); };
          pulse(mask, 0.5); pulse(gog, 1.5); pulse(glove, 2.5);
          items.rotation.y = Math.sin(t * PI / 4) * 0.12;
        },
        labels: [
          { text: V('Polomaska A2P3', 'A2P3 half mask'), at: function () { return mask.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.1, 0)); }, show: [0.4, 8] },
          { text: V('Uzavřené brýle', 'Sealed goggles'), at: function () { return gog.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.08, 0)); }, show: [1.4, 8] },
          { text: V('Nitrilové rukavice', 'Nitrile gloves'), at: function () { return glove.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.03, 0.1, 0)); }, show: [2.4, 8] },
          { text: V('Hasicí přístroj', 'Fire extinguisher'), at: [0.7, 0.55, 0.1], show: [3.4, 8] }
        ],
        captions: [
          { text: V('2K laky = isokyanáty → bez masky nestříkat!', '2K paints = isocyanates → never spray without a mask!'), level: 'danger' },
          { text: V('Isokyanáty – jen s maskou s přívodem vzduchu / A2P3', 'Isocyanates – supplied-air / A2P3 mask only'), show: [2, 8] },
          { text: V('Broušení: respirátor P2/P3 · odsávání · hasicí přístroj', 'Sanding: P2/P3 respirator · extraction · extinguisher'), show: [4, 8], level: 'info' }
        ]
      };
    }
  });

  /* ---------------------------------------------------------------- clean */
  R('body.clean', {
    duration: 7, camera: CAM, shadow: 1.5, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, s = sceneOn(ctx, K, { dent: 1 });
      var cloth = K.mesh(K.G.rbox(0.13, 0.11, 0.012, 0.004), K.M.clone('plasticWhite', { roughness: 1 })); s.root.add(cloth);
      var bottle = new THREE.Group();
      var bb = K.mesh(K.G.cyl(0.035, 0.18, 24), K.M.clone('plasticWhite', { color: 0xdfe8f2 })); bottle.add(bb);
      var trig = K.mesh(K.G.rbox(0.04, 0.05, 0.08, 0.01), 'toolRed'); trig.position.set(0, 0.11, 0.02); bottle.add(trig);
      bottle.position.set(0.25, 1.15, 0.32); bottle.rotation.x = -0.6; s.root.add(bottle);
      var spray = mist(K, 0xeaf3ff); spray.group.position.set(0.25, 1.2, 0.26); spray.group.rotation.set(0, -0.6, 0); s.root.add(spray.group);
      var wet = s.p.patch(0.2, function () { return 0.0008; }, K.M.clone('water', { opacity: 0.0 }));
      return {
        root: s.root,
        update: function (t) {
          spray.update(t, t > 0.4 && t < 1.6);
          wet.material.opacity = 0.35 * (T.seg(t, 0.6, 1.4) - T.seg(t, 4.5, 6));
          var k = T.lin(t, 1.8, 6.2), zig = Math.sin(k * PI * 6);
          var x = -0.12 + zig * 0.12, y = 0.12 - k * 0.24;
          var p = s.p.surf(x + s.p.dent.x, y, 0.008);
          cloth.position.copy(p).sub(new THREE.Vector3(0, PY, 0)).add(new THREE.Vector3(0, PY, 0));
          cloth.visible = t > 1.6;
        },
        captions: [
          { text: V('Umýt vodou se saponátem, osušit', 'Wash with water and soap, dry'), show: [0, 1.6] },
          { text: V('Odmašťovač (silikon remover): jedním hadrem nanést, druhým setřít', 'Silicone remover: apply with one cloth, wipe off with another'), show: [1.6, 7] },
          { text: V('Zbytky vosku/silikonu = krátery v laku', 'Wax/silicone residue = craters in the paint'), level: 'info', show: [4, 7] }
        ]
      };
    }
  });

  /* ----------------------------------------------------------------- mask */
  R('body.mask', {
    duration: 8, camera: { pos: [0.4, 1.3, 1.5], target: [0.02, 0.98, 0], fov: 36 }, shadow: 1.5, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, s = sceneOn(ctx, K, { dent: 1 });
      var p = s.p, x0 = p.dent.x - 0.24, x1 = p.dent.x + 0.24, y0 = -0.17, y1 = 0.17;
      function strip(ax, ay, bx, by, w, mat, lift) {
        var pts = [];
        for (var i = 0; i <= 20; i++) { var x = ax + (bx - ax) * i / 20, y = ay + (by - ay) * i / 20; pts.push(new THREE.Vector3(x, y, p.f(x, y, 1) + (lift || 0.0012))); }
        var len = Math.hypot(bx - ax, by - ay);
        var g = new THREE.PlaneGeometry(len, w, 20, 1);
        var pa = g.attributes.position;
        var horiz = Math.abs(by - ay) < 1e-6;
        for (var q = 0; q < pa.count; q++) {
          var u = (pa.getX(q) + len / 2) / len, v = pa.getY(q);
          var x = ax + (bx - ax) * u + (horiz ? 0 : v), y = ay + (by - ay) * u + (horiz ? v : 0);
          pa.setXYZ(q, x, y, p.f(x, y, 1) + (lift || 0.0012));
        }
        g.computeVertexNormals();
        var m = new THREE.Mesh(g, mat); m.userData.noShadow = true; p.root.add(m); return m;
      }
      var tape = K.M.clone('tape', { side: THREE.DoubleSide });
      var strips = [strip(x0, y1, x1, y1, 0.019, tape), strip(x0, y0, x1, y0, 0.019, tape), strip(x0, y0, x0, y1, 0.019, tape), strip(x1, y0, x1, y1, 0.019, tape)];
      var paperMat = K.M.clone('paper', { side: THREE.DoubleSide, color: 0xd9cfb4 });
      var papers = [strip(-0.45, (y1 + 0.28) / 2 + 0.005, 0.45, (y1 + 0.28) / 2 + 0.005, 0.28 - y1, paperMat, 0.003), strip(-0.45, (y0 - 0.28) / 2 - 0.005, 0.45, (y0 - 0.28) / 2 - 0.005, 0.28 + y0, paperMat, 0.003)];
      var sets = strips.concat(papers).map(function (m) { return faded(K, m, 0); });
      return {
        root: s.root,
        update: function (t) {
          sets.forEach(function (set, i) { set(T.seg(t, 0.5 + i * 0.8, 1.1 + i * 0.8)); });
          strips.concat(papers).forEach(function (m, i) { var k = T.seg(t, 0.5 + i * 0.8, 1.1 + i * 0.8); m.scale.set(0.3 + 0.7 * k, 1, 1); m.position.x = (1 - k) * -0.1; });
        },
        labels: [
          { text: V('Páska', 'Tape'), at: p.surf(x1, y1 + 0.01, 0.01), show: [1.4, 8] },
          { text: V('Papír', 'Paper'), at: p.surf(0.3, 0.22, 0.01), show: [4.4, 8] }
        ],
        captions: [
          { text: V('Zakrýt okolí: páska + papír (fólie)', 'Mask the surroundings: tape + paper (film)') },
          { text: V('Okraj pásky přeložit (měkký přechod)', 'Fold the tape edge back (soft edge)'), show: [3, 8], level: 'info' }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ dent pull */
  R('body.dentPull', {
    duration: 9, camera: { pos: [0.85, 1.18, 0.6], target: [0.05, 0.99, 0], fov: 34 }, shadow: 1.5, thumbT: 2.4,
    build: function (ctx, K) {
      var T = K.T, s = sceneOn(ctx, K, { dent: 1, depth: 0.02 });
      var p = s.p;
      var dolly = K.mesh(K.G.rbox(0.07, 0.05, 0.04, 0.012), 'steel'); s.root.add(dolly);
      var ham = new THREE.Group(); var hh = K.P.hammer(); hh.rotation.z = PI / 2; ham.add(hh); s.root.add(ham);
      var hitsAt = [1.0, 1.8, 2.6, 3.4, 4.2, 5.0, 5.8];
      return {
        root: s.root,
        update: function (t) {
          var n = 0, bounce = 0;
          hitsAt.forEach(function (h) { if (t > h) n++; var d = t - h; if (d > -0.4 && d < 0) bounce = Math.max(bounce, 1 - Math.abs(d + 0.2) / 0.2); });
          p.setDent(Math.max(0.05, 1 - n * 0.135));
          var c = p.surf(p.dent.x, p.dent.y);
          dolly.position.set(c.x, c.y, c.z - 0.03);
          var ang = 0.2 + (1 - bounce) * 0.5;
          var hx = c.x + Math.sin(t * 7) * 0.03 * (t < 6 ? 1 : 0);
          ham.position.set(hx + 0.17, c.y, c.z + 0.01 + (1 - bounce) * 0.06);
          ham.rotation.y = ang;
          ham.visible = t < 6.5;
        },
        labels: [
          { text: V('Kladivo', 'Hammer'), at: function () { return ham.position.clone().add(new THREE.Vector3(0.12, 0.06, 0.05)); }, show: [0.3, 6.5] },
          { text: V('Kovadlinka zespodu', 'Dolly from behind'), at: function () { return dolly.position.clone().add(new THREE.Vector3(0, -0.06, -0.02)); }, show: [0.3, 9] }
        ],
        captions: [
          { text: V('Mnoho lehkých úderů – od okrajů ke středu', 'Many light taps – from the edges to the centre') },
          { text: V('Plech nenatahovat silnými ranami!', 'Do not stretch the metal with heavy blows!'), level: 'danger', show: [2.5, 9] },
          { text: V('Hliník: jen hliníkové nářadí, bez ohřevu', 'Aluminium: aluminium tools only, no heat'), level: 'info', show: [5.5, 9] }
        ]
      };
    }
  });

  /* ---------------------------------------------------------------- grind */
  R('body.grind', {
    duration: 9, camera: CAM, shadow: 1.5, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, s = sceneOn(ctx, K, { dent: 0 });
      var p = s.p;
      var feather = [
        p.patch(0.16, function () { return 0.0004; }, K.M.clone('primerGrey', { color: 0x9aa0a6 })),
        p.patch(0.13, function () { return 0.0008; }, K.M.clone('plasticGrey', { color: 0x7c8086 })),
        p.patch(0.1, function () { return 0.0012; }, K.M.clone('steel', { roughness: 0.55 }))
      ];
      var fset = feather.map(function (m) { return faded(K, m, 0); });
      var rust = p.patch(0.075, function (d) { return 0.0016 + 0.0015 * (1 - d); }, K.M.clone('rust'));
      var rset = faded(K, rust, 1);
      var spots = [];
      [[0.06, 0.06, 0.02], [-0.07, -0.03, 0.015], [0.08, -0.06, 0.012], [-0.04, 0.07, 0.01]].forEach(function (q) {
        var m = p.patch(q[2], function () { return 0.0017; }, K.M.clone('rust'), p.dent.x + q[0], p.dent.y + q[1], 20);
        spots.push(faded(K, m, 1));
      });
      var tool = sander(K); s.root.add(tool);
      var dust = K.FX.puff(0x9b7b55, 16, 0.12, 0.18); s.root.add(dust.group);
      return {
        root: s.root,
        update: function (t) {
          var k = T.lin(t, 0.8, 6.8);
          var on = t > 0.8 && t < 6.8;
          var a = k * PI * 8, r = 0.05 + 0.05 * Math.sin(k * PI * 3);
          var c = p.surf(p.dent.x + Math.cos(a) * r, p.dent.y + Math.sin(a) * r * 0.8, 0.002);
          tool.position.copy(c).add(new THREE.Vector3(0, 0, on ? 0 : 0.12));
          tool.userData.pad.rotation.z = t * 40; tool.userData.disc.rotation.z = t * 40;
          rset(1 - T.seg(t, 2.0, 5.5));
          spots.forEach(function (set, i) { set(1 - T.seg(t, 1.5 + i * 0.8, 2.5 + i * 0.8)); });
          fset[2](T.seg(t, 2.0, 4.0)); fset[1](T.seg(t, 4.5, 5.8)); fset[0](T.seg(t, 5.2, 6.6));
          dust.group.position.copy(c).add(new THREE.Vector3(0.05, 0, 0.02));
          dust.update(t, on);
        },
        labels: [
          { text: V('holý kov', 'bare metal'), at: p.surf(p.dent.x, p.dent.y - 0.06, 0.01), show: [5.5, 9], level: 'ok' },
          { text: V('kov → základ → lak: plynulý přechod', 'metal → primer → paint: smooth feather'), at: p.surf(p.dent.x + 0.13, p.dent.y + 0.13, 0.01), show: [6.6, 9] }
        ],
        captions: [
          { text: V('P80 – rez odstranit 100 %, +2–3 cm za její okraj', 'P80 – remove 100 % of the rust, +2–3 cm beyond its edge') },
          { text: V('Respirátor P3 + brýle · jiskry pryč od paliva', 'P3 respirator + goggles · sparks away from fuel'), level: 'danger', show: [1.5, 9] },
          { text: V('Holá ocel začne rezavět během hodin', 'Bare steel starts to rust within hours'), level: 'info', show: [6, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------- spray-type scenes */
  function sprayScene(o) {
    return {
      duration: 9, camera: { pos: [0.6, 1.3, 1.45], target: [0.02, 0.98, 0], fov: 36 }, shadow: 1.5, thumbT: 5.5,
      build: function (ctx, K) {
        var T = K.T, s = sceneOn(ctx, K, { dent: o.dent == null ? 0 : o.dent });
        var p = s.p;
        (o.under || []).forEach(function (u) { p.patch(u.r, function (d) { return u.off * (u.mound ? (1 - d * d) : 1); }, typeof u.mat === 'function' ? u.mat(ctx, K) : K.M.clone(u.mat)); });
        var layer = p.patch(o.r || 0.16, function (d) { return o.off + (o.mound || 0) * (1 - d * d); }, o.mat(ctx, K));
        var set = faded(K, layer, 0);
        var gun = sprayGun(K, o.cup && o.cup(ctx, K)); s.root.add(gun);
        var m = mist(K, o.mist(ctx, K)); s.root.add(m.group);
        var passes = 5;
        return {
          root: s.root,
          update: function (t) {
            var k = T.lin(t, 0.6, 6.6), pass = Math.min(passes - 1, Math.floor(k * passes)), pk = (k * passes) % 1;
            var dir = pass % 2 ? -1 : 1;
            var x = p.dent.x + dir * (-0.28 + 0.56 * pk), y = p.dent.y + 0.12 - pass * 0.06;
            var c = p.surf(x, y, 0.18);
            gun.position.copy(c);
            m.group.position.copy(c).add(new THREE.Vector3(0, 0, -0.01));
            var on = t > 0.6 && t < 6.6 && pk > 0.08 && pk < 0.92;
            m.update(t * 3, on);
            set(T.seg(t, 0.8, 6.8) * (o.coats ? 1 : 1));
            if (o.anim) o.anim(t, layer, T);
          },
          labels: o.labels ? o.labels(V) : [],
          captions: o.captions
        };
      }
    };
  }

  R('body.epoxy', sprayScene({
    r: 0.12, off: 0.0016, under: [{ r: 0.12, off: 0.0011, mat: 'steel' }],
    mat: function (ctx, K) { return K.M.clone('epoxy'); }, mist: function () { return 0x7a8a78; },
    captions: [
      { text: V('Epoxidový základ na holý kov', 'Epoxy primer on bare metal') },
      { text: V('Holý kov ihned chránit epoxidovým základem', 'Protect bare metal immediately with epoxy primer'), level: 'info', show: [2, 9] },
      { text: V('Respirátor A2P3, větrání', 'A2P3 respirator, ventilation'), level: 'danger', show: [4, 9] }
    ]
  }));

  R('body.primer', sprayScene({
    r: 0.19, off: 0.0032, under: [{ r: 0.11, off: 0.0024, mat: 'filler', mound: true }],
    mat: function (ctx, K) { return K.M.clone('primerGrey'); }, mist: function () { return 0xa7abb0; },
    captions: [
      { text: V('Plnič 2K: 15–20 cm od dílu, překrytí 50 %', '2K primer: 15–20 cm from panel, 50 % overlap') },
      { text: V('Isokyanáty – jen s maskou s přívodem vzduchu / A2P3', 'Isocyanates – supplied-air / A2P3 mask only'), level: 'danger', show: [1.5, 9] },
      { text: V('Mezi vrstvami nechat odvětrat (flash-off)', 'Let each coat flash off before the next'), level: 'info', show: [4, 9] }
    ]
  }));

  R('body.base', sprayScene({
    r: 0.24, off: 0.0036, under: [{ r: 0.2, off: 0.003, mat: 'primerGrey' }],
    mat: function (ctx, K) { return K.M.clone(K.M.carPaint(K.carSpec(ctx.vehicle).paint), { roughness: 0.62, clearcoat: 0 }); },
    mist: function (ctx, K) { return K.carSpec(ctx.vehicle).paint; },
    captions: [
      { text: V('Báze: tenké vrstvy do krytí, 50 % překrytí', 'Base coat: thin coats until covered, 50 % overlap') },
      { text: V('Kód barvy ze štítku vozu · nejdřív zkušební plech', 'Colour code from the car label · test panel first'), level: 'info', show: [2, 9] },
      { text: V('Maska A2P3, rukavice, kombinéza', 'A2P3 mask, gloves, coverall'), level: 'danger', show: [4.5, 9] }
    ]
  }));

  R('body.clear', sprayScene({
    r: 0.3, off: 0.0042, under: [{ r: 0.24, off: 0.0036, mat: function (ctx, K) { return K.M.clone(K.M.carPaint(K.carSpec(ctx.vehicle).paint), { roughness: 0.62, clearcoat: 0 }); } }],
    mat: function (ctx, K) { return K.M.clone(K.M.carPaint(K.carSpec(ctx.vehicle).paint), { roughness: 0.18 }); },
    mist: function () { return 0xf2f4f6; },
    captions: [
      { text: V('Bezbarvý 2K lak: 2 mokré vrstvy', '2K clear coat: 2 wet coats') },
      { text: V('Isokyanáty – jen s maskou s přívodem vzduchu / A2P3', 'Isocyanates – supplied-air / A2P3 mask only'), level: 'danger', show: [1, 9] },
      { text: V('Vytvrzení dle technického listu (teplota!)', 'Cure per the data sheet (temperature!)'), level: 'info', show: [5, 9] }
    ]
  }));

  /* ------------------------------------------------------------------ mix */
  R('body.mix', {
    duration: 8, camera: { pos: [0.25, 1.25, 0.55], target: [0, 0.86, 0], fov: 36 }, shadow: 1, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bench = K.mesh(K.G.rbox(1.0, 0.05, 0.6, 0.01), 'wood'); bench.position.y = 0.8; root.add(bench);
      var board = K.mesh(K.G.rbox(0.3, 0.008, 0.24, 0.004), 'plasticWhite'); board.position.y = 0.829; root.add(board);
      var fillMat = K.M.clone('filler');
      var heap = K.mesh(K.G.sphere(0.04, 32), fillMat); heap.scale.set(1, 0.35, 0.8); heap.position.set(-0.02, 0.835, 0); root.add(heap);
      var hard = K.mesh(K.G.cylX(0.004, 0.08, 12), K.M.clone('toolRed', { color: 0xd02a2a })); hard.position.set(-0.02, 0.85, 0.0); root.add(hard);
      var spr = spreader(K); spr.rotation.set(-0.35, 0.4, 0); root.add(spr);
      var can = new THREE.Group();
      var cb = K.mesh(K.G.cyl(0.07, 0.11, 32), 'steel'); cb.position.y = 0.055; can.add(cb);
      var lab = K.mesh(K.G.cyl(0.0705, 0.07, 32), 'toolYellow'); lab.position.y = 0.055; can.add(lab);
      can.position.set(0.3, 0.825, -0.1); root.add(can);
      var tube = K.mesh(K.G.lathe([[0.012, 0], [0.016, 0.01], [0.016, 0.08], [0.003, 0.11]], 20), 'toolRed'); tube.rotation.z = PI / 2; tube.position.set(0.25, 0.842, 0.12); root.add(tube);
      var white = new THREE.Color(0xd8cdb0), pink = new THREE.Color(0xd99a8f);
      return {
        root: root,
        update: function (t) {
          hard.visible = t > 0.8 && t < 2.6; hard.scale.x = T.seg(t, 0.8, 1.6);
          var k = T.seg(t, 2.4, 6.2);
          fillMat.color.copy(white).lerp(pink, Math.min(1, k * 1.1) * 0.6);
          heap.scale.set(1 + k * 0.5, 0.35 - k * 0.12, 0.8 + k * 0.3);
          var a = t * 3;
          spr.position.set(0.07 + Math.sin(a) * 0.05 * (t > 2.4 && t < 6.4 ? 1 : 0), 0.87, 0.07 + Math.cos(a) * 0.015);
        },
        labels: [
          { text: V('Tmel', 'Filler'), at: [-0.02, 0.88, 0], show: [0, 2.4] },
          { text: V('tužidlo 2–3 %', 'hardener 2–3 %'), at: [0.0, 0.87, 0.02], show: [0.9, 2.6], level: 'accent' },
          { text: V('jednotná barva bez pruhů', 'even colour, no streaks'), at: [-0.02, 0.88, 0.02], show: [6.2, 8], level: 'ok' }
        ],
        captions: [
          { text: V('Míchat stíráním, ne šleháním (bez bublin)', 'Mix by folding, not whipping (no bubbles)') },
          { text: V('Zpracovat do ~4–5 min · víc tužidla ≠ lepší', 'Use within ~4–5 min · more hardener ≠ better'), level: 'info', show: [3, 8] },
          { text: V('Rukavice – tužidlo dráždí kůži', 'Gloves – hardener irritates skin'), level: 'danger', show: [5, 8] }
        ]
      };
    }
  });

  /* --------------------------------------------------------------- filler */
  R('body.filler', {
    duration: 9, camera: { pos: [0.75, 1.15, 0.85], target: [0.05, 0.99, 0], fov: 34 }, shadow: 1.5, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, s = sceneOn(ctx, K, { dent: 0.45, depth: 0.012 });
      var p = s.p;
      p.patch(0.13, function () { return 0.001; }, K.M.clone('epoxy'));
      var layers = [0.0018, 0.003, 0.0045].map(function (h, i) {
        var m = p.patch(0.12 - i * 0.012, function (d) { var e = 1 - d * d; return 0.0012 + h * e * e + 0.004 * e; }, K.M.clone('filler', { color: [0xd2c1a6, 0xd8c8ae, 0xdecfb6][i] }));
        return faded(K, m, 0);
      });
      var spr = spreader(K); s.root.add(spr);
      return {
        root: s.root,
        update: function (t) {
          layers.forEach(function (set, i) { set(T.seg(t, 0.8 + i * 2.3, 2.6 + i * 2.3)); });
          var i = Math.min(2, Math.floor(Math.max(0, t - 0.8) / 2.3)), k = ((t - 0.8) % 2.3) / 2.3;
          var c = p.surf(p.dent.x - 0.14 + 0.28 * k, p.dent.y + 0.02 - i * 0.02, 0.02);
          spr.position.copy(c); spr.rotation.set(0.0, -0.7, 0.08);
          spr.visible = t > 0.8 && t < 7.7;
        },
        labels: [{ text: V('max. cca 3 mm celkem', 'max. approx. 3 mm in total'), at: p.surf(p.dent.x, p.dent.y + 0.14, 0.01), show: [5, 9], level: 'accent' }],
        captions: [
          { text: V('Tenké vrstvy: 1. vtlačit, další dorovnat, mírně přeplnit', 'Thin layers: 1st press in, next build up, slightly overfill') },
          { text: V('Tmel jen na základ / holý kov – nikdy na rez', 'Filler only on primer / bare metal – never on rust'), level: 'info', show: [3, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ block sand */
  function sandScene(o) {
    return {
      duration: 9, camera: { pos: [0.7, 1.2, 0.95], target: [0.05, 0.99, 0], fov: 34 }, shadow: 1.5, thumbT: 6,
      build: function (ctx, K) {
        var T = K.T, s = sceneOn(ctx, K, { dent: o.dent == null ? 0.45 : o.dent, depth: 0.012 });
        var p = s.p;
        var mound = p.patch(o.r, function (d) { var e = 1 - d * d; return 0.0012 + 0.005 * e; }, K.M.clone(o.baseMat));
        var guide = p.patch(o.r * 0.95, function (d) { var e = 1 - d * d; return 0.0024 + 0.005 * e; }, K.M.clone('plasticBlack', { roughness: 1, color: o.coatColor || 0x1a1a1a }));
        var gset = faded(K, guide, 0.75);
        var low = p.patch(0.025, function () { return 0.0062 - 0.0035; }, K.M.clone('plasticBlack', { roughness: 1 }), p.dent.x + 0.03, p.dent.y - 0.02, 24);
        var lset = faded(K, low, 0);
        var blk = block(K, o.wet); s.root.add(blk);
        var drops = o.wet ? K.FX.drops(K.M.water, 8, 0.25, 0.006) : null;
        if (drops) s.root.add(drops.group);
        return {
          root: s.root,
          update: function (t) {
            var k = T.lin(t, 0.6, 6.6), on = t > 0.6 && t < 6.6;
            mound.userData.offScale = 1 - 0.55 * T.seg(t, 0.6, 6.6); mound.userData.refresh();
            guide.userData.offScale = mound.userData.offScale; guide.userData.refresh();
            gset(0.75 * (1 - T.seg(t, 1.5, 6.4)));
            lset(o.lowSpot ? T.seg(t, 4.8, 6) : 0);
            var a = k * PI * 10, dx = Math.sin(a) * 0.1, dy = Math.sin(a * 0.5 + (Math.floor(k * 4) % 2) * PI / 2) * 0.08;
            var c = p.surf(p.dent.x + dx, p.dent.y + dy, 0.007);
            blk.position.copy(c).add(new THREE.Vector3(0, 0, on ? 0 : 0.1));
            blk.rotation.z = (Math.floor(k * 4) % 2) ? 0.6 : -0.6;
            if (drops) { drops.group.position.copy(c).add(new THREE.Vector3(0.05, -0.03, 0.02)); drops.update(t, on); }
          },
          labels: o.lowSpot ? [{ text: V('zbylý prášek = důlek', 'remaining coat = low spot'), level: 'accent', at: p.surf(p.dent.x + 0.03, p.dent.y - 0.05, 0.01), show: [5.2, 9] }] : [],
          captions: o.captions
        };
      }
    };
  }
  R('body.blockSand', sandScene({
    r: 0.13, baseMat: 'filler', lowSpot: true,
    captions: [
      { text: V('Kontrolní prášek + brusný blok: P80 → P180 → P240', 'Guide coat + sanding block: P80 → P180 → P240') },
      { text: V('Blok vždy naplocho, křížem – nikdy jen prsty', 'Block always flat, criss-cross – never with fingers only'), level: 'info', show: [2, 9] },
      { text: V('Respirátor P2/P3 – prach z tmelu', 'P2/P3 respirator – filler dust'), level: 'danger', show: [4, 9] }
    ]
  }));
  R('body.wetSand', sandScene({
    r: 0.19, baseMat: 'primerGrey', wet: true, coatColor: 0x2c2c2c,
    captions: [
      { text: V('Plnič za mokra P400 → P600 (pod bázi)', 'Wet sand primer P400 → P600 (for base coat)') },
      { text: V('Neprobrousit na kov – jinak znovu základ', 'Do not sand through to metal – else prime again'), level: 'danger', show: [2.5, 9] }
    ]
  }));

  /* --------------------------------------------------------------- polish */
  R('body.polish', {
    duration: 9, camera: { pos: [0.75, 1.32, 1.2], target: [0.03, 0.98, 0], fov: 34 }, shadow: 1.5, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, s = sceneOn(ctx, K, { dent: 0 });
      var p = s.p;
      var haze = K.M.clone(K.M.carPaint(K.carSpec(ctx.vehicle).paint), { roughness: 0.55, clearcoatRoughness: 0.6 });
      var patch = p.patch(0.26, function () { return 0.0012; }, haze);
      var lights = new THREE.Group();
      for (var i = 0; i < 3; i++) { var tube = K.mesh(K.G.cylX(0.012, 1.4, 16), 'lightWhite'); tube.position.set(0, 1.55 + i * 0.1, 0.9); lights.add(tube); }
      s.root.add(lights);
      var pol = new THREE.Group();
      var pad = K.mesh(K.G.cylZ(0.075, 0.03, 40), K.M.clone('toolRed', { color: 0xf08a24, roughness: 1 })); pad.position.z = 0.015; pol.add(pad);
      var plate = K.mesh(K.G.cylZ(0.06, 0.012, 32), 'plasticBlack'); plate.position.z = 0.036; pol.add(plate);
      var body = K.mesh(K.G.cylX(0.04, 0.26, 32), 'toolYellow'); body.position.set(0.1, 0, 0.08); pol.add(body);
      var head = K.mesh(K.G.rbox(0.07, 0.08, 0.08, 0.02), 'aluCast'); head.position.set(0, 0, 0.07); pol.add(head);
      var side = K.mesh(K.G.cylY ? K.G.cyl(0.015, 0.12, 16) : K.G.cyl(0.015, 0.12, 16), 'gripRubber'); side.position.set(0, 0.09, 0.08); pol.add(side);
      s.root.add(pol);
      return {
        root: s.root,
        update: function (t) {
          var k = T.lin(t, 0.8, 7), on = t > 0.8 && t < 7;
          var a = k * PI * 10, r = 0.1 * (0.5 + 0.5 * Math.sin(k * PI * 2));
          var c = p.surf(p.dent.x + Math.cos(a) * r, p.dent.y + Math.sin(a) * r * 0.7, 0.002);
          pol.position.copy(c).add(new THREE.Vector3(0, 0, on ? 0 : 0.12));
          pad.rotation.z = t * 30;
          var g = T.seg(t, 1, 6.8);
          haze.roughness = 0.55 - 0.5 * g; haze.clearcoatRoughness = 0.6 - 0.56 * g;
        },
        labels: [{ text: V('vysoký lesk', 'high gloss'), at: p.surf(p.dent.x, p.dent.y + 0.17, 0.01), show: [6.8, 9], level: 'ok' }],
        captions: [
          { text: V('Po úplném vytvrzení: P1500 → P3000, pak leštit', 'After full cure: P1500 → P3000, then polish') },
          { text: V('Hrany a lišty nepřeleštit – lak je tam tenký', 'Do not over-polish edges – the paint is thin there'), level: 'info', show: [3, 9] }
        ]
      };
    }
  });

  /* --------------------------------------------------------------- layers */
  R('body.layers', {
    duration: 9, camera: { pos: [0.36, 1.02, 0.5], target: [0.02, 0.95, 0], fov: 34 }, shadow: 1, thumbT: 6.5, ground: true,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var spec = K.carSpec(ctx.vehicle);
      var defs = [
        { n: V('Plech (ocel / hliník)', 'Metal (steel / aluminium)'), h: 0.012, mat: isAlu(ctx.vehicle) ? K.M.clone('alu') : K.M.clone('steel', { roughness: 0.5 }) },
        { n: V('Epoxidový základ', 'Epoxy primer'), h: 0.006, mat: K.M.clone('epoxy') },
        { n: V('Tmel (tence!)', 'Filler (thin!)'), h: 0.014, mat: K.M.clone('filler'), mound: true },
        { n: V('Plnič 2K', '2K primer'), h: 0.007, mat: K.M.clone('primerGrey') },
        { n: V('Báze (barva)', 'Base coat (colour)'), h: 0.005, mat: K.M.clone(K.M.carPaint(spec.paint), { roughness: 0.6, clearcoat: 0 }) },
        { n: V('Bezbarvý lak', 'Clear coat'), h: 0.006, mat: K.M.clone('glassClear', { opacity: 0.55, roughness: 0.05 }) }
      ];
      var y = 0.9, objs = [];
      defs.forEach(function (d, i) {
        var w = 0.34 - i * 0.025;
        var g = d.mound ? K.G.extrude([[-w / 2, 0], [w / 2, 0], [w / 2 - 0.04, d.h], [-w / 2 + 0.04, d.h]], 0.16, 0.001) : K.G.rbox(w, d.h, 0.16, 0.001);
        var m = new THREE.Mesh(g, d.mat);
        if (!d.mound) g.translate(0, d.h / 2, 0);
        root.add(m);
        objs.push({ m: m, y: y, h: d.h, i: i });
        y += d.h;
      });
      var stand = K.mesh(K.G.rbox(0.4, 0.88, 0.22, 0.01), 'plasticTex'); stand.position.y = 0.44; root.add(stand);
      return {
        root: root,
        update: function (t) {
          objs.forEach(function (o) {
            var k = T.seg(t, 0.5 + o.i * 0.7, 1.1 + o.i * 0.7);
            var spread = 1 - T.seg(t, 6.0, 7.4);
            o.m.position.y = o.y + o.i * 0.018 * spread + (1 - k) * 0.12;
            o.m.visible = k > 0.02;
          });
        },
        labels: defs.map(function (d, i) {
          return { text: d.n, at: function () { return objs[i].m.position.clone().add(new THREE.Vector3(0.2, objs[i].h / 2, 0.08)); }, show: [0.9 + i * 0.7, 9] };
        }),
        captions: [
          { text: V('Skladba opravy (řez, přehnaná tloušťka)', 'Repair build-up (cross-section, exaggerated)') },
          { text: V('Každá vrstva jen na správně připravený podklad', 'Each layer only on a correctly prepared base'), level: 'info', show: [5, 9] }
        ]
      };
    }
  });
})(window.STU);
