/* 3D scenes: headlights (bulbs, xenon HV, units, aiming) and rear lights. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  function lampType(vid) {
    if (vid === 'volvo-xc60-b4' || vid === 'toyota-gr-yaris') return 'led';
    if (vid === 'skoda-octavia-rs-tdi' || vid === 'mb-cl500-c216') return 'xenon';
    return 'halogen';
  }

  /* ------------------------------------------------------------------ parts */
  /** Bulbs, axis +X = glass tip direction, base at x=0. */
  function bulb(K, type) {
    var g = new THREE.Group();
    var fil = K.M.clone('lightWhite', { emissiveIntensity: 0 });
    g.userData.filament = fil;
    if (type === 'd1s') {
      var base = K.mesh(K.G.rbox(0.035, 0.05, 0.05, 0.008), 'plasticBlack'); base.position.x = -0.018; g.add(base);
      var ign = K.mesh(K.G.rbox(0.02, 0.03, 0.035, 0.004), 'plasticTex'); ign.position.set(-0.04, 0, 0); g.add(ign);
      var ring = K.mesh(K.G.cylX(0.022, 0.006, 32), 'steel'); ring.position.x = 0.002; g.add(ring);
      var tube = K.mesh(K.G.cylX(0.006, 0.045, 20), 'glassClear'); tube.position.x = 0.027; g.add(tube);
      var arc = K.mesh(K.G.sphere(0.006, 16), fil); arc.scale.set(1.6, 1, 1); arc.position.x = 0.03; g.add(arc);
      g.userData.base = base;
    } else if (type === 'h7') {
      var flange = K.mesh(K.G.cylX(0.013, 0.003, 24), 'steel'); g.add(flange);
      var tab = K.mesh(K.G.box(0.002, 0.008, 0.02), 'steel'); tab.position.set(0.0, 0.014, 0); g.add(tab);
      var stem = K.mesh(K.G.rbox(0.025, 0.016, 0.012, 0.003), 'plasticBlack'); stem.position.x = -0.014; g.add(stem);
      [-1, 1].forEach(function (s) { var pin = K.mesh(K.G.box(0.012, 0.004, 0.0015), 'brass'); pin.position.set(-0.03, 0, s * 0.003); g.add(pin); });
      var cap = K.mesh(K.G.lathe([[0.0001, 0.036], [0.004, 0.035], [0.0055, 0.03], [0.0055, 0.008], [0.007, 0.003], [0.007, 0]], 24), 'glassClear');
      cap.rotation.z = -PI / 2; g.add(cap);
      var f = K.mesh(K.G.cylX(0.0012, 0.008, 8), fil); f.position.x = 0.02; g.add(f);
      g.userData.base = stem;
    } else { // p21w / py21w / w5w
      var amber = type === 'py21w';
      var b = K.mesh(K.G.cylX(0.0075, 0.014, 20), 'brass'); b.position.x = -0.007; g.add(b);
      var pins = [];
      [-1, 1].forEach(function (s) { var p = K.mesh(K.G.cyl(0.0012, 0.004, 8), 'brass'); p.position.set(-0.004 + (type === 'p21-5w' && s > 0 ? -0.004 : 0), 0, s * 0.0085); p.rotation.x = PI / 2; g.add(p); pins.push(p); });
      var glass = K.mesh(K.G.sphere(type === 'w5w' ? 0.006 : 0.013, 24), amber ? K.M.clone('lightAmber', { emissiveIntensity: 0, transparent: true, opacity: 0.8 }) : 'glassClear');
      glass.position.x = type === 'w5w' ? 0.008 : 0.017; g.add(glass);
      var ff = K.mesh(K.G.sphere(0.0025, 8), fil); ff.position.x = glass.position.x; g.add(ff);
      g.userData.pins = pins; g.userData.glass = glass;
    }
    return g;
  }

  /** Headlamp unit facing +X. type 'halogen' | 'xenon' | 'led' */
  function headlamp(K, type) {
    var g = new THREE.Group();
    // open-fronted shell: C-shaped wall extruded across the width + two side plates
    var outer = [[0.075, 0.085], [-0.06, 0.08], [-0.16, 0.055], [-0.17, 0.0], [-0.16, -0.055], [-0.06, -0.08], [0.075, -0.085]];
    var inner = [[0.075, -0.079], [-0.06, -0.074], [-0.154, -0.05], [-0.164, 0.0], [-0.154, 0.05], [-0.06, 0.074], [0.075, 0.079]];
    var housing = K.mesh(K.G.extrude(outer.concat(inner), 0.4, 0, 4), 'plasticTex'); g.add(housing);
    [-1, 1].forEach(function (sd) { var side = K.mesh(K.G.extrude(outer, 0.008, 0.002, 4), 'plasticTex'); side.position.z = sd * 0.198; g.add(side); });
    var bezel = K.mesh(K.G.box(0.004, 0.15, 0.37), 'plasticBlack'); bezel.position.x = -0.1; g.add(bezel);
    var lensMat = K.M.clone('glassClear', { opacity: 0.12, depthWrite: false });
    var lens = K.mesh(K.G.rbox(0.02, 0.172, 0.402, 0.008), lensMat); lens.position.x = 0.085; g.add(lens);
    var glowMat = K.M.clone('lightWhite', { emissiveIntensity: 0 });
    var parts = { group: g, glowMat: glowMat, lens: lens };
    function bowl(r, depth) {
      var pts = []; for (var i = 0; i <= 10; i++) { var rr = 0.006 + r * i / 10; pts.push([rr, depth * Math.pow(i / 10, 2)]); }
      var geo = K.G.lathe(pts, 40); geo.rotateZ(-PI / 2);
      var m = K.mesh(geo, K.M.clone('reflector', { side: THREE.DoubleSide })); return m;
    }
    if (type === 'led') {
      for (var i = 0; i < 3; i++) {
        var mod = K.mesh(K.G.cylX(0.03, 0.04, 24), 'blackOxide'); mod.position.set(0.03, 0.01, -0.11 + i * 0.11); g.add(mod);
        var lm = K.mesh(K.G.sphere(0.022, 20), K.M.clone('glassClear', { opacity: 0.4 })); lm.scale.x = 0.5; lm.position.set(0.05, 0.01, -0.11 + i * 0.11); g.add(lm);
        var chip = K.mesh(K.G.box(0.004, 0.012, 0.012), glowMat); chip.position.set(0.035, 0.01, -0.11 + i * 0.11); g.add(chip);
      }
      var drl = K.mesh(K.G.box(0.006, 0.008, 0.34), glowMat); drl.position.set(0.07, -0.06, 0); g.add(drl);
      for (var f = 0; f < 9; f++) { var fin = K.mesh(K.G.box(0.06, 0.12, 0.004), 'alu'); fin.position.set(-0.16, 0, -0.12 + f * 0.03); g.add(fin); }
      var ledConn = K.mesh(K.G.rbox(0.03, 0.04, 0.05, 0.006), 'plasticTex'); ledConn.position.set(-0.15, -0.07, 0.15); g.add(ledConn);
      parts.connector = ledConn;
    } else {
      // high-beam reflector (outer) + low beam projector (inner)
      var hb = bowl(0.06, 0.07); hb.position.set(0.0, 0.0, 0.11); g.add(hb);
      var proj = new THREE.Group();
      proj.add(K.mesh(K.G.cylX(0.04, 0.09, 32), 'blackOxide'));
      var pl = K.mesh(K.G.sphere(0.036, 24), K.M.clone('glassClear', { opacity: 0.35 })); pl.scale.x = 0.45; pl.position.x = 0.05; proj.add(pl);
      var pb = bowl(0.045, 0.06); pb.position.x = -0.08; proj.add(pb);
      proj.position.set(0.0, 0.0, -0.09); g.add(proj);
      parts.projector = proj;
      // bulb in projector, inserted from the back
      var bl = bulb(K, type === 'xenon' ? 'd1s' : 'h7');
      bl.position.set(-0.125, 0, -0.09); g.add(bl); parts.bulb = bl;
      // rear cover cap
      var cover = new THREE.Group();
      cover.add(K.mesh(K.G.cylX(0.055, 0.02, 40), 'plasticTex'));
      for (var k = 0; k < 4; k++) { var rib = K.mesh(K.G.box(0.024, 0.012, 0.02), 'plasticTex'); var a = k * PI / 2; rib.position.set(-0.012, Math.cos(a) * 0.05, Math.sin(a) * 0.05); cover.add(rib); }
      cover.position.set(-0.14, 0, -0.09); g.add(cover); parts.cover = cover;
      var conn = new THREE.Group();
      conn.add(K.mesh(K.G.rbox(0.025, 0.03, 0.03, 0.005), 'plasticBlack'));
      var cab = K.mesh(K.G.tube([[-0.012, 0, 0], [-0.06, -0.02, 0], [-0.1, -0.1, 0.05]], 0.004), 'rubber'); conn.add(cab);
      conn.position.set(-0.175, 0, -0.09); g.add(conn); parts.connector = conn;
      if (type === 'xenon') {
        var bal = K.mesh(K.G.rbox(0.1, 0.03, 0.08, 0.006), 'alu'); bal.position.set(-0.05, -0.105, -0.05); g.add(bal);
        for (var q = 0; q < 6; q++) { var bf = K.mesh(K.G.box(0.09, 0.006, 0.003), 'alu'); bf.position.set(-0.05, -0.122, -0.08 + q * 0.012); g.add(bf); }
        var bcab = K.mesh(K.G.tube([[-0.1, -0.1, -0.05], [-0.17, -0.07, -0.08], [-0.185, -0.02, -0.09]], 0.005), 'rubber'); g.add(bcab);
        parts.ballast = bal;
      }
      var hbBulb = bulb(K, 'h7'); hbBulb.position.set(-0.07, 0, 0.11); g.add(hbBulb);
    }
    // aiming adjusters on top
    parts.adj = [];
    [[-0.08, 0.16], [-0.08, -0.16]].forEach(function (p) {
      var a = new THREE.Group();
      a.add(K.mesh(K.G.cyl(0.006, 0.05, 12), 'zinc'));
      var head = K.mesh(K.G.cyl(0.011, 0.012, 6), 'toolBlue'); head.position.y = 0.03; a.add(head);
      a.position.set(p[0], 0.095, p[1]); g.add(a); parts.adj.push(a);
    });
    var tabs = [[-0.01, 0.07, 0.2], [-0.01, 0.07, -0.2], [-0.05, -0.07, 0.2]];
    parts.bolts = tabs.map(function (p) {
      var t = K.mesh(K.G.box(0.04, 0.006, 0.03), 'plasticBlack'); t.position.set(p[0], p[1], p[2] + Math.sign(p[2]) * 0.01); g.add(t);
      var b = K.P.bolt({ r: 0.004, len: 0.02, mat: 'blackOxide' }); b.position.set(p[0], p[1] + 0.004, p[2] + Math.sign(p[2]) * 0.015); g.add(b); return b;
    });
    return parts;
  }

  /** Beam cone from origin along +X (unit length, scale.x = length). */
  function beam(K, color, radius, opacity) {
    var geo = new THREE.ConeGeometry(radius || 0.25, 1, 32, 1, true);
    geo.rotateZ(PI / 2); geo.translate(0.5, 0, 0);
    var m = new THREE.MeshBasicMaterial({ color: color || 0xfff2cc, transparent: true, opacity: opacity == null ? 0.12 : opacity * 1.1, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
    var mesh = new THREE.Mesh(geo, m); mesh.userData.noShadow = true;
    return mesh;
  }

  /** Rear lamp cluster facing +X (lens), carrier at -X. */
  function rearLamp(K) {
    var g = new THREE.Group();
    var body = K.mesh(K.G.rbox(0.08, 0.14, 0.34, 0.02), 'plasticBlack'); body.position.x = -0.03; g.add(body);
    var segs = {};
    [['tail', 0xff1a1a, 0.02, -0.03, 0.2], ['brake', 0xff1a1a, -0.04, -0.03, 0.2], ['ind', 0xff9a00, 0.02, 0.11, 0.1], ['rev', 0xffffff, -0.04, 0.11, 0.1]].forEach(function (d) {
      var mat = d[0] === 'ind' ? K.M.clone('lightAmber', { emissiveIntensity: 0.05 }) : d[0] === 'rev' ? K.M.clone('lens', { opacity: 0.6 }) : K.M.clone('lightRed', { emissiveIntensity: 0.08 });
      var seg = K.mesh(K.G.rbox(0.016, 0.055, d[4], 0.006), mat);
      seg.position.set(0.02, d[2], d[3]); g.add(seg);
      var glow = K.mesh(K.G.box(0.004, 0.05, d[4] * 0.95), new THREE.MeshBasicMaterial({ color: d[1], transparent: true, opacity: 0, toneMapped: false }));
      glow.position.set(0.03, d[2], d[3]); glow.userData.noShadow = true; g.add(glow);
      segs[d[0]] = glow;
    });
    var seal = K.mesh(K.G.torus(0.1, 0.006, PI * 2, 48), K.M.clone('rubber')); seal.scale.set(1, 0.6, 1.5); seal.rotation.y = PI / 2; seal.position.x = -0.072; g.add(seal);
    var carrier = new THREE.Group();
    carrier.add(K.mesh(K.G.rbox(0.012, 0.11, 0.28, 0.004), 'plasticGrey'));
    var bulbs = {};
    [['p21-5w', -0.035, -0.03], ['p21w', 0.02, -0.06], ['py21w', 0.02, 0.1], ['w5w', -0.035, 0.1]].forEach(function (b) {
      var bl = bulb(K, b[0] === 'p21-5w' ? 'p21-5w' : b[0]); bl.position.set(0.008, b[1], b[2]); carrier.add(bl); bulbs[b[0]] = bl;
    });
    [-1, 1].forEach(function (s) { var l = K.mesh(K.G.box(0.02, 0.025, 0.012), 'hiAccent'); l.position.set(-0.01, 0, s * 0.145); carrier.add(l); });
    carrier.position.x = -0.077; g.add(carrier);
    var nuts = [[-0.075, 0.05, -0.12], [-0.075, 0.05, 0.12], [-0.075, -0.05, 0]].map(function (p) {
      var n = new THREE.Group();
      var stud = K.mesh(K.G.cylX(0.003, 0.03, 8), 'steelDark'); stud.position.x = -0.01; n.add(stud);
      var nut = K.mesh(K.G.hex(0.006, 0.006), 'zinc'); nut.rotation.z = PI / 2; nut.position.x = -0.02; n.add(nut);
      n.position.set(p[0], p[1], p[2]); g.add(n); return n;
    });
    var conn = new THREE.Group();
    conn.add(K.mesh(K.G.rbox(0.02, 0.025, 0.035, 0.004), 'plasticBlack'));
    conn.add(K.mesh(K.G.tube([[-0.01, 0, 0], [-0.08, 0.02, 0.03], [-0.15, 0.1, 0.05]], 0.004), 'rubber'));
    conn.position.set(-0.095, 0.0, 0.03); g.add(conn);
    return { group: g, segs: segs, carrier: carrier, bulbs: bulbs, seal: seal, nuts: nuts, connector: conn };
  }

  function benchRoot(K) { var r = new THREE.Group(); r.add(S.d3.bench(K, 1.0, 0.7, 0)); return r; }

  /** Glowing overlay on a car lamp group (world-space), returns material. */
  function lampGlow(K, car, name, color, size, offset) {
    var src = car.body.getObjectByName(name);
    var m = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0, toneMapped: false });
    var p = K.mesh(K.G.rbox(0.02, size[1], size[0], 0.01), m); p.userData.noShadow = true;
    src.add(p); p.position.set(offset || 0.07, 0, 0);
    return m;
  }

  /* ============================================================== HEADLIGHTS */
  R('lights.types', {
    duration: 6, camera: { pos: [0.1, 0.45, 1.15], target: [0, 0.1, 0], fov: 40 }, shadow: 1, thumbT: 3,
    build: function (ctx, K) {
      var root = benchRoot(K);
      var items = [['halogen', -0.46, V('Halogen', 'Halogen')], ['xenon', 0, V('Xenon', 'Xenon')], ['led', 0.46, V('LED – modul / celé světlo', 'LED – module / whole lamp')]];
      var lamps = items.map(function (it) {
        var h = headlamp(K, it[0]); h.group.position.set(it[1], 0.12, 0); h.group.rotation.y = -PI / 2 + 0.45; h.group.scale.setScalar(0.9); root.add(h.group); return h;
      });
      var mine = lampType(ctx.vehicle);
      return {
        root: root,
        update: function (t) { lamps.forEach(function (l, i) { l.glowMat.emissiveIntensity = (items[i][0] === mine ? 0.8 : 0.25) * (0.6 + 0.4 * Math.sin(t * 3 + i)); }); },
        labels: items.map(function (it, i) { return { text: it[2], at: [it[1], 0.27, 0.05], level: it[0] === mine && ctx.vehicle !== 'generic' ? 'accent' : null }; }).concat([
          { text: V('~25 kV zapalovač', '~25 kV ignitor'), at: [-0.05, 0.02, -0.12], level: 'danger' }
        ]),
        captions: [
          { text: V('Nejdřív zjistěte, jaký typ světla máte', 'First find out which lamp type you have') },
          { text: V('Xenon: zapalovač ~25 kV · LED: zpravidla bez žárovek', 'Xenon: ~25 kV ignitor · LED: usually no bulbs'), level: 'info', show: [2, 6] }
        ]
      };
    }
  });

  R('lights.xenonHv', {
    duration: 10, camera: { pos: [-0.55, 0.32, 0.45], target: [-0.1, 0.1, -0.05], fov: 38 }, shadow: 0.8, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, root = benchRoot(K);
      var h = headlamp(K, 'xenon'); h.group.position.y = 0.12; root.add(h.group);
      // electric arc at the ignitor
      var arcMat = new THREE.MeshBasicMaterial({ color: 0xbfd8ff, toneMapped: false });
      var arcs = [];
      for (var a = 0; a < 3; a++) {
        var pts = [], base = new THREE.Vector3(-0.17, 0.155, -0.09);
        for (var i = 0; i <= 6; i++) pts.push(base.clone().add(new THREE.Vector3(-i * 0.012, (Math.random() - 0.5) * 0.02 + i * 0.004, (Math.random() - 0.5) * 0.025)));
        var arc = K.mesh(K.G.tube(pts, 0.0016, false, 24, 5), arcMat); arc.userData.noShadow = true; root.add(arc); arcs.push(arc);
      }
      var flash = new THREE.PointLight(0x9fc2ff, 0, 0.6); flash.position.set(-0.2, 0.17, -0.09); root.add(flash);
      return {
        root: root,
        update: function (t) {
          var on = t < 2.2 && Math.sin(t * 40) > 0.2;
          arcs.forEach(function (a, i) { a.visible = on && ((Math.floor(t * 25) + i) % 3 !== 0); });
          flash.intensity = on ? 2 : 0;
          h.bulb.userData.filament.emissiveIntensity = t < 2.2 ? 2.5 : 0;
          h.connector.position.x = -0.175 - K.T.seg(t, 5, 6) * 0.08;
        },
        labels: [
          { text: V('⚡ ~25 kV při zapálení', '⚡ ~25 kV at ignition'), at: [-0.22, 0.2, -0.09], level: 'danger', show: [0, 3] },
          { text: V('předřadník', 'ballast'), at: h.ballast },
          { text: V('UV záření – nedívat se', 'UV light – do not look'), at: [0.12, 0.15, -0.09], level: 'danger', show: [0, 2.2] },
          { text: V('Výbojka obsahuje rtuť → nebezpečný odpad', 'Bulb contains mercury → hazardous waste'), at: [-0.12, 0.05, -0.09], show: [8, 10] }
        ],
        captions: [
          { text: V('Než sáhnete na xenon:', 'Before touching xenon:'), level: 'danger' },
          { text: V('1. Světla VYP', '1. Lights OFF'), show: [2.2, 10] },
          { text: V('2. Zapalování VYP, klíč pryč', '2. Ignition OFF, key away'), show: [3.5, 10] },
          { text: V('3. Odpojit konektor výbojky', '3. Unplug the bulb connector'), show: [5, 10] },
          { text: V('4. Počkat, výbojka vychladne', '4. Wait, let the bulb cool'), show: [6.5, 10] }
        ]
      };
    }
  });

  R('lights.access', {
    duration: 7, camera: { pos: [-0.75, 1.0, 0.85], target: [-0.08, 0.38, 0.05], fov: 40 }, shadow: 1.2, thumbT: 4.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var paint = K.M.carPaint(K.carSpec(ctx.vehicle).paint);
      var h = headlamp(K, lampType(ctx.vehicle)); h.group.position.set(0.05, 0.42, 0); h.group.rotation.y = -0.05; root.add(h.group);
      var wing = K.mesh(K.G.rbox(0.7, 0.18, 0.03, 0.02), paint); wing.position.set(-0.2, 0.33, 0.27); root.add(wing);
      var support = K.mesh(K.G.box(0.05, 0.35, 0.9), 'plasticBlack'); support.position.set(-0.08, 0.35, -0.35); root.add(support);
      var hinge = new THREE.Group(); hinge.position.set(-0.6, 0.62, 0); root.add(hinge);
      var bonnet = K.mesh(K.G.rbox(0.8, 0.02, 1.2, 0.01), paint); bonnet.position.set(0.4, 0, -0.2); hinge.add(bonnet);
      var stay = K.mesh(K.G.cyl(0.005, 0.5, 8), 'steelDark'); root.add(stay);
      var liner = K.mesh(K.G.box(0.4, 0.22, 0.01), 'plasticTex'); liner.position.set(-0.25, 0.12, 0.3); root.add(liner);
      var flap = K.mesh(K.G.box(0.12, 0.1, 0.012), 'plasticBlack'); flap.position.set(-0.2, 0.16, 0.31); root.add(flap);
      var glowC = h.cover ? K.FX.glow(h.cover) : null;
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 0.5, 2.2);
          hinge.rotation.z = k * 1.1;
          var tip = new THREE.Vector3(0.75, 0, 0.3).applyAxisAngle(new THREE.Vector3(0, 0, 1), hinge.rotation.z).add(hinge.position);
          var base = new THREE.Vector3(0.0, 0.3, 0.3);
          var d = tip.clone().sub(base); stay.visible = k > 0.6;
          stay.scale.y = d.length() / 0.5; stay.position.copy(base).add(d.clone().multiplyScalar(0.5)); stay.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
          if (glowC) glowC(t > 3 ? 0.5 + 0.5 * Math.sin(t * 5) : 0);
          flap.rotation.x = T.seg(t, 4.5, 5.5) * 1.2;
        },
        labels: [
          { text: V('Zadní kryt světla', 'Lamp rear cover'), at: h.cover || h.connector, show: [3, 7], level: 'accent' },
          { text: V('vzpěra kapoty', 'bonnet stay'), at: [0.0, 0.55, 0.3], show: [2.2, 4.5] },
          { text: V('otvor v podběhu', 'wheel-arch flap'), at: flap, show: [5, 7] }
        ],
        captions: [
          { text: V('Kapota nahoru, opřít o vzpěru', 'Open the bonnet, secure the stay') },
          { text: V('Někdy přístup jen přes otvor v podběhu', 'Sometimes access only via the wheel-arch flap'), show: [4.5, 7], level: 'info' }
        ]
      };
    }
  });

  R('lights.bulbSwap', {
    duration: 12, camera: { pos: [-0.62, 0.32, 0.26], target: [-0.16, 0.11, -0.07], fov: 38 }, shadow: 0.8, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = benchRoot(K);
      var type = lampType(ctx.vehicle) === 'xenon' ? 'xenon' : 'halogen';
      var h = headlamp(K, type); h.group.position.y = 0.12; root.add(h.group);
      var cover0 = h.cover.position.clone(), conn0 = h.connector.position.clone(), bulb0 = h.bulb.position.clone();
      var newBulb = bulb(K, type === 'xenon' ? 'd1s' : 'h7'); h.group.add(newBulb);
      var glove = K.P.glove(); glove.scale.setScalar(0.55); root.add(glove);
      var fCover = K.FX.fader(h.cover), fOld = K.FX.fader(h.bulb);
      return {
        root: root,
        update: function (t) {
          var c1 = T.seg(t, 0.5, 1.8), c2 = T.seg(t, 10.8, 11.6);
          h.cover.rotation.x = c1 * 1.2 - c2 * 1.2;
          h.cover.position.copy(cover0).add(new THREE.Vector3(-0.08 * (c1 - c2), 0, 0));
          fCover(1 - T.seg(t, 1.8, 2.2) + T.seg(t, 10.6, 10.9));
          var k2 = T.seg(t, 2.4, 3.4) - T.seg(t, 9.6, 10.4);
          h.connector.position.copy(conn0).add(new THREE.Vector3(-0.08 * k2, 0, 0));
          var out = T.seg(t, 4, 5.4);
          h.bulb.position.copy(bulb0).add(new THREE.Vector3(-0.1 * out, 0.05 * out, 0));
          fOld(1 - T.seg(t, 5.4, 6));
          var inn = T.seg(t, 6.2, 8.8);
          newBulb.visible = t > 6.2 && t < 11.9;
          newBulb.position.copy(bulb0).add(new THREE.Vector3(-0.14 * (1 - inn), 0.07 * (1 - inn), 0));
          glove.visible = t > 6.2 && t < 9;
          glove.position.copy(h.group.localToWorld(newBulb.position.clone())).add(new THREE.Vector3(-0.07, -0.02, 0.0));
          glove.rotation.set(0, PI / 2, PI / 2);
          if (t >= 11.9) { h.bulb.position.copy(bulb0); fOld(1); }
        },
        labels: [
          { text: V('Sklo nechytat prsty!', 'Do not touch the glass!'), at: function () { return h.group.localToWorld(newBulb.position.clone().add(new THREE.Vector3(0.03, 0.03, 0))); }, show: [6.4, 9.6], level: 'danger' },
          { text: V('kryt', 'cover'), at: h.cover, show: [0.4, 1.9] },
          { text: V('konektor', 'connector'), at: h.connector, show: [2.4, 3.6] },
          { text: V('žárovka', 'bulb'), at: h.bulb, show: [4, 5.6] }
        ],
        captions: [
          { text: V('Kryt → konektor → pojistka → žárovka', 'Cover → connector → clip → bulb') },
          { text: V('Novou žárovku držet za patici (rukavice)', 'Hold the new bulb by its base (gloves)'), show: [6, 12], level: 'info' },
          { text: V('Xenon: nejdřív vše vypnout a odpojit (25 kV)', 'Xenon: switch everything off and unplug first (25 kV)'), level: 'danger', show: type === 'xenon' ? [0, 6] : [99, 99] }
        ]
      };
    }
  });

  R('lights.unitOut', {
    duration: 10, camera: { pos: [3.4, 1.15, 1.9], target: [1.9, 0.6, 0.55], fov: 34 }, shadow: 2.5, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var hl = c.body.getObjectByName('headlightL');
      var base = hl.position.clone();
      var bolts = [];
      [[-0.02, 0.06, 0.12], [-0.02, 0.06, -0.12], [-0.06, 0.0, -0.19]].forEach(function (p) {
        var b = K.P.bolt({ r: 0.005, len: 0.03, mat: 'blackOxide' }); b.position.set(p[0], p[1], p[2]); hl.add(b); bolts.push(b);
      });
      var fades = bolts.map(function (b) { return K.FX.fader(b); });
      var cable = K.mesh(K.G.tube([[-0.06, 0, 0], [-0.25, -0.05, 0.05], [-0.4, -0.12, 0.0]], 0.006), 'rubber'); hl.add(cable);
      var camC = new THREE.Vector3();
      return {
        root: root,
        update: function (t) {
          bolts.forEach(function (b, i) {
            var k = T.seg(t, 1 + i * 0.6, 1.6 + i * 0.6);
            b.rotation.y = k * 8; b.position.y = (i === 2 ? 0 : 0.06) + k * 0.05; fades[i](1 - T.seg(t, 1.5 + i * 0.6, 1.8 + i * 0.6));
          });
          var out = T.seg(t, 4.2, 6.5);
          hl.position.copy(base).add(new THREE.Vector3(0.28 * out, 0.05 * out, 0.08 * out));
          cable.visible = t > 4.2 && t < 7.2;
          if (t > 9.4) { var r = T.seg(t, 9.4, 10); hl.position.copy(base); fades.forEach(function (f) { f(r); }); }
        },
        cameraPath: function () {
          hl.parent.updateMatrixWorld(true);
          var p = hl.parent.localToWorld(base.clone(), camC);
          return { pos: p.clone().add(new THREE.Vector3(1.3, 0.55, 1.0)), target: p.clone().add(new THREE.Vector3(0.1, -0.05, 0)) };
        },
        labels: [
          { text: V('skryté šrouby', 'hidden bolts'), at: function () { return bolts[0].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.05, 0)); }, show: [0.8, 3] },
          { text: V('konektor + ostřikovač', 'connector + washer'), at: function () { return hl.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(-0.2, -0.05, 0.05)); }, show: [5.5, 7.5] }
        ],
        captions: [
          { text: V('1. Demontovat nárazník / masku (dle vozu)', '1. Remove bumper / grille (if required)'), show: [0, 1] },
          { text: V('2. Povolit šrouby světla (i ty skryté)', '2. Undo the lamp bolts (incl. hidden ones)'), show: [1, 4.2] },
          { text: V('3. Odpojit konektor(y) a ostřikovač, světlo vyjmout', '3. Unplug connector(s) and washer, pull the lamp out'), show: [4.2, 8] },
          { text: V('4. Montáž v opačném pořadí, kontrola spár', '4. Refit in reverse order, check panel gaps'), show: [8, 10] },
          { text: V('Šrouby si vyfoťte / označte', 'Photograph / label the bolts'), level: 'info' }
        ]
      };
    }
  });

  R('lights.connector', {
    duration: 7, camera: { pos: [0.16, 0.2, 0.22], target: [0, 0.1, 0], fov: 32 }, shadow: 0.5, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = benchRoot(K);
      var socket = new THREE.Group();
      socket.add(K.mesh(K.G.rbox(0.05, 0.035, 0.04, 0.004), 'plasticTex'));
      for (var i = 0; i < 4; i++) { var p = K.mesh(K.G.box(0.02, 0.003, 0.0015), 'brass'); p.position.set(0.03, 0, -0.012 + i * 0.008); socket.add(p); }
      socket.position.set(-0.05, 0.1, 0); root.add(socket);
      var plug = new THREE.Group();
      plug.add(K.mesh(K.G.rbox(0.05, 0.04, 0.045, 0.005), 'plasticBlack'));
      var lock = K.mesh(K.G.box(0.02, 0.006, 0.03), K.M.clone('toolRed')); lock.position.set(0, 0.023, 0); plug.add(lock);
      var latch = K.mesh(K.G.box(0.012, 0.005, 0.02), 'plasticGrey'); latch.position.set(0.012, 0.024, 0); plug.add(latch);
      for (var w = 0; w < 4; w++) plug.add(K.mesh(K.G.tube([[0.025, 0, -0.012 + w * 0.008], [0.08, 0.01 * w - 0.01, -0.012 + w * 0.01], [0.16, -0.03, -0.02 + w * 0.012]], 0.0022), K.M.clone('plasticBlack', { color: [0x111111, 0xc8262b, 0x1e5bb8, 0xf2b705][w] })));
      root.add(plug);
      var glove = K.P.glove(); glove.scale.setScalar(0.4); root.add(glove);
      var no = new THREE.Group();
      [1, -1].forEach(function (s) { var b = K.mesh(K.G.box(0.04, 0.006, 0.006), 'hiDanger'); b.rotation.z = s * PI / 4; no.add(b); });
      no.position.set(0.12, 0.12, 0); root.add(no);
      return {
        root: root,
        update: function (t) {
          var l = T.seg(t, 0.6, 1.5), press = T.pulse(t, 1.8, 3.2), pull = T.seg(t, 3, 4.6);
          lock.position.x = -0.012 * l;
          latch.position.y = 0.024 - 0.003 * press;
          plug.position.set(0.0 + 0.06 * pull, 0.1, 0);
          glove.position.set(0.03 + 0.06 * pull, 0.165 - 0.008 * press, 0.0); glove.rotation.set(PI, 0, 0.2);
          no.visible = t > 4.8;
          if (t > 6.5) { var r = T.seg(t, 6.5, 7); plug.position.x = 0.06 * (1 - r); lock.position.x = -0.012 * (1 - r); }
        },
        labels: [
          { text: V('1. pojistka', '1. lock'), at: lock, show: [0.4, 1.8], level: 'accent' },
          { text: V('2. západka', '2. latch'), at: latch, show: [1.8, 3], level: 'accent' },
          { text: V('Netahat za kabely!', 'Never pull the wires!'), at: no, show: [4.8, 6.5], level: 'danger' }
        ],
        captions: [
          { text: V('1. Odsunout pojistku  2. Zmáčknout západku  3. Vytáhnout', '1. Slide the lock  2. Press the latch  3. Pull') },
          { text: V('Tahat za konektor, nikdy za kabely', 'Pull the connector, never the wires'), show: [4.6, 7], level: 'info' }
        ]
      };
    }
  });

  function frontCar(ctx, K) {
    var c = K.car(ctx.vehicle);
    var beams = {};
    ['headlightL', 'headlightR'].forEach(function (n) {
      var hl = c.body.getObjectByName(n);
      var low = beam(K, 0xfff1cf, 0.6, 0.12); low.scale.x = 6; low.rotation.z = -0.05; hl.add(low); low.position.x = 0.06;
      var high = beam(K, 0xffffff, 0.8, 0.1); high.scale.x = 11; high.rotation.z = 0.0; hl.add(high); high.position.x = 0.06;
      var ind = K.mesh(K.G.box(0.012, 0.02, 0.08), new THREE.MeshBasicMaterial({ color: 0xff9a00, transparent: true, opacity: 0, toneMapped: false }));
      ind.position.set(0.075, -0.035, (n === 'headlightL' ? 1 : -1) * 0.12); hl.add(ind);
      beams[n] = { low: low, high: high, ind: ind, hl: hl };
    });
    return { car: c, beams: beams };
  }

  R('lights.frontTest', {
    duration: 10, camera: { pos: [6.2, 1.5, 3.8], target: [2.6, 0.55, 0], fov: 38 }, shadow: 4, thumbT: 3.2,
    build: function (ctx, K) {
      var root = new THREE.Group(), f = frontCar(ctx, K); root.add(f.car.group);
      var glows = ['headlightL', 'headlightR'].map(function (n) { return lampGlow(K, f.car, n, 0xffffff, [0.32, 0.08]); });
      return {
        root: root,
        update: function (t) {
          var low = t < 2.5 || t >= 7, high = t >= 2.5 && t < 4.5, ind = t >= 4.5 && t < 7 && Math.floor(t * 3) % 2 === 0;
          var swivel = t >= 7 ? Math.sin((t - 7) * 2) * 0.25 : 0;
          Object.keys(f.beams).forEach(function (k) {
            var b = f.beams[k];
            b.low.visible = low; b.high.visible = high;
            b.low.rotation.y = swivel; b.ind.material.opacity = ind ? 1 : 0;
          });
          glows.forEach(function (m) { m.opacity = low || high ? 0.85 : 0.2; });
        },
        captions: [
          { text: V('Potkávací', 'Low beam'), show: [0, 2.5] },
          { text: V('Dálková', 'High beam'), show: [2.5, 4.5] },
          { text: V('Blinkry / výstražná', 'Indicators / hazards'), show: [4.5, 7] },
          { text: V('AFS natáčení (je-li)', 'AFS swivel (if fitted)'), show: [7, 10] },
          { text: V('Bez chyby na přístrojovce', 'No warning on the dashboard'), level: 'ok' }
        ]
      };
    }
  });

  var BASIC = {
    'generic': V('Diagnostika: základní nastavení', 'Scan tool: basic setting'),
    'skoda-octavia-rs-tdi': V('VCDS: základní nastavení (ověřit)', 'VCDS: basic settings (verify)'),
    'mb-cl500-c216': V('XENTRY: kalibrace (ověřit)', 'XENTRY: calibration (verify)'),
    'volvo-xc60-b4': V('VIDA: kalibrace světel (ověřit)', 'VIDA: headlight calibration (verify)'),
    'toyota-gr-yaris': V('Techstream: inicializace (ověřit)', 'Techstream: initialisation (verify)')
  };
  R('lights.basicSetting', {
    duration: 8, camera: { pos: [6.2, 1.5, 3.4], target: [2.2, 0.5, 0.3], fov: 38 }, shadow: 4, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), f = frontCar(ctx, K); root.add(f.car.group);
      var tool = S.t(BASIC[ctx.vehicle] || BASIC.generic);
      var sc = S.d3.scanner(K, function (x, W, H, st) {
        S.d3.ui(x, W, H, { title: tool, rows: [{ t: S.t(V('Regulace sklonu', 'Range control')) }], progress: st.p, big: st.p >= 1 ? S.t(V('Hotovo ✔', 'Done ✔')) : '', bigSize: 10 });
      }, { cable: false, state: { p: 0 } });
      sc.group.scale.setScalar(2.2); sc.group.position.set(f.car.dims.front + 0.4, 0.95, 1.5); sc.group.rotation.y = 0.9; root.add(sc.group);
      return {
        root: root,
        update: function (t) {
          var p = Math.min(1, Math.floor(T.lin(t, 1, 5.5) * 10) / 10);
          sc.screen.userData.redraw({ p: p });
          var pitch = t < 5.5 ? -0.05 + 0.06 * Math.sin(t * 2.5) * (1 - p) : -0.05;
          Object.keys(f.beams).forEach(function (k) { f.beams[k].low.rotation.z = pitch; f.beams[k].high.visible = false; });
        },
        captions: [
          { text: V('Základní nastavení regulace světel', 'Headlight range control basic setting') },
          { text: V('Po výměně světla / senzoru výšky', 'After replacing a lamp / level sensor'), level: 'info', show: [2, 8] }
        ]
      };
    }
  });

  R('lights.aimWall', {
    duration: 9, camera: { pos: [6.8, 3.8, 11.8], target: [6.8, 0.6, 0], fov: 46 }, shadow: 8, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), f = frontCar(ctx, K); root.add(f.car.group);
      var d = f.car.dims, wallX = d.front + 10;
      var hl = f.beams.headlightL.hl; root.updateMatrixWorld(true);
      var H = hl.getWorldPosition(new THREE.Vector3()).y;
      var tr = function (v) { return S.t(v); };
      var wall = K.FX.canvasPanel(4, 2.2, function (x, W, Hh) {
        x.fillStyle = '#d9d5cc'; x.fillRect(0, 0, W, Hh);
        var py = function (y) { return Hh * (1 - y / 2.2); };
        x.strokeStyle = '#1d4f73'; x.lineWidth = 4; x.setLineDash([16, 10]);
        x.beginPath(); x.moveTo(0, py(H)); x.lineTo(W, py(H)); x.stroke(); x.setLineDash([]);
        x.strokeStyle = '#c9282d'; x.lineWidth = 6;
        var cy = py(H - 0.1), kink = W * 0.55;
        x.beginPath(); x.moveTo(W * 0.05, cy); x.lineTo(kink, cy); x.lineTo(kink + W * 0.12, cy - W * 0.12 * Math.tan(PI / 12)); x.lineTo(W * 0.95, cy - W * 0.12 * Math.tan(PI / 12)); x.stroke();
        x.font = 'bold 30px system-ui, sans-serif'; x.fillStyle = '#1d4f73'; x.fillText(tr(V('H = výška středu světla', 'H = lamp centre height')), 20, py(H) - 12);
        x.fillStyle = '#c9282d'; x.fillText(tr(V('hrana světla: H − 1 % (10 cm)', 'cut-off: H − 1 % (10 cm)')), 20, cy + 40);
      }, { px: 1024 });
      wall.rotation.y = -PI / 2; wall.position.set(wallX, 1.1, 0); root.add(wall);
      var wallBack = K.mesh(K.G.box(0.05, 2.3, 4.1), 'concrete'); wallBack.position.set(wallX + 0.03, 1.15, 0); root.add(wallBack);
      var tape = K.mesh(K.G.box(10, 0.004, 0.03), 'toolYellow'); tape.position.set(d.front + 5, 0.003, 1.2); root.add(tape);
      var spots = ['headlightL', 'headlightR'].map(function (n) {
        var p = f.beams[n].hl.getWorldPosition(new THREE.Vector3());
        var sp = K.mesh(new THREE.CircleGeometry(0.55, 40), new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
        sp.scale.y = 0.45; sp.rotation.y = -PI / 2; sp.position.set(wallX - 0.01, H - 0.32, p.z); root.add(sp); return sp;
      });
      Object.keys(f.beams).forEach(function (k) {
        var b = f.beams[k]; b.high.visible = false;
        b.low.scale.x = 10.2; b.low.rotation.z = -0.03;
      });
      return {
        root: root,
        update: function (t) {
          var on = T.seg(t, 1.5, 2.5);
          Object.keys(f.beams).forEach(function (k) { f.beams[k].low.material.opacity = 0.09 * on; });
          spots.forEach(function (s) { s.material.opacity = 0.55 * on; });
        },
        labels: [
          { text: V('stěna 10 m', 'wall at 10 m'), at: [d.front + 5, 0.15, 1.2], level: 'accent' },
          { text: 'H', at: [wallX - 0.05, H + 0.15, -1.6] }
        ],
        captions: [
          { text: V('Rovina · tlaky pneu · ½ nádrže · řidič ve voze', 'Level floor · tyre pressures · ½ tank · driver inside') },
          { text: V('Sklon dle štítku na světle (např. 1,0 %)', 'Drop per the lamp label (e.g. 1.0 %)'), show: [2.5, 9], level: 'info' },
          { text: V('Vzduchový podvozek: normální výška!', 'Air suspension: normal ride height!'), show: ctx.vehicle === 'volvo-xc60-b4' ? [0, 9] : [99, 99], level: 'danger' }
        ]
      };
    }
  });

  R('lights.aimScrews', {
    duration: 8, camera: { pos: [-0.35, 0.6, 0.55], target: [0.15, 0.12, 0], fov: 40 }, shadow: 1, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, root = benchRoot(K);
      var h = headlamp(K, lampType(ctx.vehicle)); h.group.position.y = 0.12; root.add(h.group);
      var bm = beam(K, 0xfff1cf, 0.12, 0.18); bm.scale.x = 1.2; bm.position.set(0.1, 0.12, 0); root.add(bm);
      var sd = K.P.screwdriver(0.22, 'toolBlue'); root.add(sd);
      var arrowV = K.FX.rotArrow(0.03, 'cw', 0xf5a524, 220, 0.004); arrowV.rotation.x = -PI / 2; root.add(arrowV);
      return {
        root: root,
        update: function (t) {
          var vert = t < 4;
          var a = h.adj[vert ? 0 : 1];
          var p = a.getWorldPosition(new THREE.Vector3());
          sd.position.copy(p).add(new THREE.Vector3(0, 0.045, 0)); sd.rotation.set(0, 0, PI / 2);
          var spin = Math.sin(t * 3) * 1.2; sd.rotation.y = spin; a.rotation.y = spin;
          arrowV.position.copy(p).add(new THREE.Vector3(0, 0.05, 0));
          bm.rotation.z = vert ? Math.sin(t * 1.5) * 0.06 : -0.02;
          bm.rotation.y = vert ? 0 : Math.sin(t * 1.5) * 0.08;
        },
        labels: [
          { text: V('výška', 'height'), at: h.adj[0], show: [0, 4], level: 'accent' },
          { text: V('do stran', 'sideways'), at: h.adj[1], show: [4, 8], level: 'accent' }
        ],
        captions: [
          { text: V('Seřizovací šrouby: malými kroky, pak kontrola', 'Adjusters: small turns, then check') },
          { text: V('Polohu šroubů ověřte v příručce', 'Check adjuster locations in the manual'), level: 'info', show: [3, 8] }
        ]
      };
    }
  });

  R('lights.ledUnit', {
    duration: 7, camera: { pos: [0.6, 0.4, 0.75], target: [0, 0.12, 0], fov: 36 }, shadow: 1, thumbT: 3,
    build: function (ctx, K) {
      var root = benchRoot(K);
      var h = headlamp(K, 'led'); h.group.position.y = 0.12; h.group.rotation.y = -0.6; root.add(h.group);
      var no = new THREE.Group();
      [1, -1].forEach(function (s) { var b = K.mesh(K.G.box(0.09, 0.012, 0.012), 'hiDanger'); b.rotation.z = s * PI / 4; no.add(b); });
      no.position.set(-0.2, 0.15, 0.1); no.rotation.y = -0.6; root.add(no);
      return {
        root: root,
        update: function (t) { h.glowMat.emissiveIntensity = 0.8 + 0.3 * Math.sin(t * 4); no.visible = Math.sin(t * 4) > -0.5; },
        labels: [
          { text: V('Žárovka? Není.', 'Bulb? None.'), at: no, level: 'danger' },
          { text: V('Výměna celého světla / LED modulu', 'Replace the whole lamp / LED module'), at: [0.05, 0.3, 0], level: 'accent' }
        ],
        captions: [
          { text: V('LED světla: bez vyměnitelných žárovek', 'LED lamps: no replaceable bulbs') },
          { text: V('Nejdřív diagnostika: pojistka, konektor, chybové kódy', 'Diagnose first: fuse, connector, fault codes'), level: 'info', show: [2.5, 7] }
        ]
      };
    }
  });

  /* ============================================================== REAR LIGHTS */
  R('lights.rearBulbs', {
    duration: 8, camera: { pos: [-0.24, 0.17, 0.14], target: [0, 0.12, 0.0], fov: 40 }, shadow: 0.6, thumbT: 5,
    build: function (ctx, K) {
      var root = benchRoot(K);
      var r = rearLamp(K); r.carrier.position.set(0, 0.12, 0); r.carrier.rotation.y = PI; root.add(r.carrier);
      var pinGlow = r.bulbs['p21-5w'].userData.pins.map(function (p) { return K.FX.glow(p, 0xf5a524); });
      return {
        root: root,
        update: function (t) { pinGlow.forEach(function (g) { g(t > 5 ? 0.5 + 0.5 * Math.sin(t * 6) : 0); }); },
        labels: [
          { text: V('brzda / obrys – P21/5W', 'brake / tail – P21/5W'), at: r.bulbs['p21-5w'] },
          { text: V('couvání – P21W', 'reverse – P21W'), at: r.bulbs.p21w },
          { text: V('blinkr – PY21W (oranžová)', 'indicator – PY21W (amber)'), at: r.bulbs.py21w, level: 'accent' },
          { text: V('obrys / SPZ – W5W', 'tail / plate – W5W'), at: r.bulbs.w5w }
        ],
        captions: [
          { text: V('Typické žárovky zadních světel (příklad)', 'Typical rear lamp bulbs (example)') },
          { text: V('P21/5W má piny v různé výšce – nejde otočit naopak', 'P21/5W has offset pins – only fits one way'), show: [5, 8], level: 'info' },
          { text: V('Přesné typy ověřte v příručce / na staré žárovce', 'Check exact types in the manual / on the old bulb'), show: [2.5, 8] }
        ]
      };
    }
  });

  R('lights.rearCarrier', {
    duration: 9, camera: { pos: [-0.55, 0.3, 0.35], target: [-0.06, 0.12, 0], fov: 38 }, shadow: 0.8, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = benchRoot(K);
      var r = rearLamp(K); r.group.position.y = 0.12; root.add(r.group);
      var trim = new THREE.Group();
      [[0, 0.11, 0, 0.02, 0.44], [0, -0.11, 0, 0.02, 0.44], [0, 0, 0.21, 0.2, 0.02], [0, 0, -0.21, 0.2, 0.02]].forEach(function (b) { var m = K.mesh(K.G.box(0.01, b[3], b[4]), 'fabric'); m.position.set(b[0], b[1], b[2]); trim.add(m); });
      trim.position.set(-0.13, 0.12, 0); root.add(trim);
      var flapH = new THREE.Group(); flapH.position.set(-0.135, 0.2, 0); root.add(flapH);
      var flap = K.mesh(K.G.rbox(0.012, 0.13, 0.3, 0.004), 'plasticTex'); flap.position.set(0, -0.065, 0); flapH.add(flap);
      var c0 = r.carrier.position.clone();
      var tw = r.bulbs.p21w, tw0 = tw.position.clone();
      var latchGlow = [K.FX.glow(r.carrier.children[r.carrier.children.length - 2]), K.FX.glow(r.carrier.children[r.carrier.children.length - 1])];
      return {
        root: root,
        update: function (t) {
          flapH.rotation.z = T.seg(t, 0.4, 1.4) * 1.4;
          trim.visible = true;
          latchGlow.forEach(function (g) { g(T.pulse(t, 1.6, 3)); });
          r.carrier.position.copy(c0).add(new THREE.Vector3(-0.16 * T.seg(t, 2.8, 4.3), 0, 0));
          var tk = T.seg(t, 5, 6), tout = T.seg(t, 6, 7);
          tw.rotation.x = tk * 0.5; tw.position.copy(tw0).add(new THREE.Vector3(-0.0, 0, 0)); tw.position.x = tw0.x + 0.03 * tout;
          if (t > 8.4) { var k = T.seg(t, 8.4, 9); r.carrier.position.copy(c0); tw.position.copy(tw0); tw.rotation.x = 0; flapH.rotation.z = 1.4 * (1 - k); }
        },
        labels: [{ text: V('západky', 'latches'), at: function () { return r.carrier.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.08, 0)); }, show: [1.5, 3], level: 'accent' }],
        captions: [
          { text: V('Kryt v obložení kufru → stisknout západky → vytáhnout držák', 'Boot trim flap → press latches → pull out the carrier') },
          { text: V('Žárovky: zatlačit + pootočit', 'Bulbs: push in + twist'), show: [4.8, 9], level: 'info' },
          { text: V('Octavia liftback: část světla je ve víku kufru', 'Octavia liftback: part of the lamp is in the tailgate'), show: ctx.vehicle === 'skoda-octavia-rs-tdi' ? [0, 9] : [99, 99] }
        ]
      };
    }
  });

  R('lights.bayonet', {
    duration: 6, camera: { pos: [0.07, 0.08, 0.09], target: [0, 0.02, 0], fov: 34 }, ground: false, shadow: 0.2, thumbT: 3.2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var sock = new THREE.Group();
      sock.add(K.mesh(K.G.lathe([[0.0085, -0.02], [0.012, -0.02], [0.012, 0], [0.0085, 0]], 40), K.M.clone('plasticGrey', { side: THREE.DoubleSide })));
      [-1, 1].forEach(function (s) {
        var slotV = K.mesh(K.G.box(0.003, 0.012, 0.004), 'blackOxide'); slotV.position.set(0, -0.006, s * 0.0102); sock.add(slotV);
        var slotH = K.mesh(K.G.box(0.004, 0.003, 0.0045), 'blackOxide'); slotH.position.set(s * 0.003, -0.0115, s * 0.0102); slotH.rotation.y = 0; sock.add(slotH);
      });
      root.add(sock);
      var b = bulb(K, 'p21w'); b.rotation.z = PI / 2; var holder = new THREE.Group(); holder.add(b); root.add(holder);
      return {
        root: root,
        update: function (t) {
          var push = T.seg(t, 0.6, 2), twist = T.seg(t, 2.4, 3.6);
          holder.position.y = 0.035 - push * 0.03;
          holder.rotation.y = twist * 0.4;
          if (t > 5.4) { var k = T.seg(t, 5.4, 6); holder.position.y = 0.005 + k * 0.03; holder.rotation.y = 0.4 * (1 - k); }
        },
        labels: [{ text: V('piny do drážek', 'pins into slots'), at: [0, 0.0, 0.016], level: 'accent' }],
        captions: [
          { text: V('Zatlačit a pootočit cca o 15–30°', 'Push in and twist approx. 15–30°') },
          { text: V('Nejde to? Zkontrolujte typ – nepoužívat sílu', 'Won\'t go? Check the type – no force'), show: [3.6, 6], level: 'danger' }
        ]
      };
    }
  });

  R('lights.rearUnit', {
    duration: 9, camera: { pos: [-0.42, 0.28, 0.3], target: [-0.04, 0.12, 0], fov: 38 }, shadow: 0.8, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = benchRoot(K);
      var r = rearLamp(K); r.group.position.y = 0.12; root.add(r.group);
      var g0 = r.group.position.clone(), cn0 = r.connector.position.clone();
      var fades = r.nuts.map(function (n) { return K.FX.fader(n.children[1]); });
      return {
        root: root,
        update: function (t) {
          r.nuts.forEach(function (n, i) {
            var k = T.seg(t, 0.5 + i * 0.7, 1.1 + i * 0.7);
            n.children[1].position.x = -0.02 - 0.03 * k; n.children[1].rotation.x = k * 6; fades[i](1 - T.seg(t, 1.0 + i * 0.7, 1.3 + i * 0.7));
          });
          r.connector.position.copy(cn0).add(new THREE.Vector3(-0.07 * T.seg(t, 3, 4), 0, 0));
          r.group.position.copy(g0).add(new THREE.Vector3(0.18 * T.seg(t, 4.5, 6), 0, 0));
          if (t > 8.4) { var k = T.seg(t, 8.4, 9); r.group.position.copy(g0); r.connector.position.copy(cn0); r.nuts.forEach(function (n, i) { n.children[1].position.x = -0.02; fades[i](k); }); }
        },
        labels: [
          { text: V('Matice jen lehce – plast praskne', 'Nuts only snug – plastic cracks'), at: r.nuts[0], show: [0.3, 3], level: 'danger' },
          { text: V('konektor', 'connector'), at: r.connector, show: [3, 4.5] }
        ],
        captions: [
          { text: V('Zevnitř kufru: matice → konektor → světlo ven', 'From inside the boot: nuts → connector → lamp out') },
          { text: V('Liftback: druhá část světla ve víku kufru má vlastní upevnění', 'Liftback: the tailgate part has its own fixings'), show: ctx.vehicle === 'skoda-octavia-rs-tdi' ? [4.5, 9] : [99, 99], level: 'info' }
        ]
      };
    }
  });

  R('lights.test', {
    duration: 12, camera: { pos: [-6.5, 1.6, 3.2], target: [-2.0, 0.7, 0], fov: 38 }, shadow: 4, thumbT: 1,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var suv = K.carSpec(ctx.vehicle).style === 'suv';
      var red = ['taillightL', 'taillightR'].map(function (n) { return lampGlow(K, c, n, 0xff2020, suv ? [0.12, 0.3] : [0.28, 0.08], 0.035); });
      var amber = ['taillightL', 'taillightR'].map(function (n) {
        var src = c.body.getObjectByName(n);
        var m = new THREE.MeshBasicMaterial({ color: 0xff9a00, transparent: true, opacity: 0, toneMapped: false });
        var p = K.mesh(K.G.box(0.02, suv ? 0.06 : 0.03, suv ? 0.1 : 0.08), m); p.position.set(0.045, suv ? 0.1 : 0.03, suv ? 0 : (n === 'taillightL' ? 0.08 : -0.08)); src.add(p); return m;
      });
      var white = ['taillightL', 'taillightR'].map(function (n) {
        var src = c.body.getObjectByName(n);
        var m = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, toneMapped: false });
        var p = K.mesh(K.G.box(0.02, suv ? 0.05 : 0.025, suv ? 0.1 : 0.07), m); p.position.set(0.045, suv ? -0.1 : -0.03, suv ? 0 : (n === 'taillightL' ? -0.07 : 0.07)); src.add(p); return m;
      });
      var d = c.dims;
      var third = K.mesh(K.G.box(0.02, 0.025, 0.4), new THREE.MeshBasicMaterial({ color: 0xff2020, transparent: true, opacity: 0, toneMapped: false }));
      third.position.set(d.rear + 0.62, d.H - 0.03, 0); root.add(third);
      var helper = new THREE.Group();
      var bodyM = K.M.clone('toolBlue', { roughness: 0.9 });
      helper.add(K.at(K.mesh(K.G.cyl(0.17, 0.75, 20), bodyM), 0, 1.0, 0));
      helper.add(K.at(K.mesh(K.G.sphere(0.12, 20), K.M.clone('leather', { color: 0xc89b7b })), 0, 1.5, 0));
      [-0.08, 0.08].forEach(function (z) { helper.add(K.at(K.mesh(K.G.cyl(0.06, 0.65, 12), 'fabric'), 0, 0.32, z)); });
      helper.position.set(d.rear - 1.9, 0, -0.6); root.add(helper);
      return {
        root: root,
        update: function (t) {
          var blink = Math.floor(t * 3) % 2 === 0;
          var brake = t < 2, li = t >= 2 && t < 4, ri = t >= 4 && t < 6, rev = t >= 6 && t < 8, fog = t >= 8 && t < 10, haz = t >= 10;
          red.forEach(function (m, i) { m.opacity = brake ? 0.95 : (fog && i === 0 ? 0.9 : 0.35); });
          third.material.opacity = brake ? 1 : 0;
          amber[0].opacity = (li || haz) && blink ? 1 : 0;
          amber[1].opacity = (ri || haz) && blink ? 1 : 0;
          white.forEach(function (m) { m.opacity = rev ? 1 : 0; });
        },
        labels: [{ text: V('Pomocník za vozem', 'Helper behind the car'), at: [d.rear - 1.9, 1.75, -0.6] }],
        captions: [
          { text: V('Brzda (+ 3. brzdové)', 'Brake (+ 3rd brake light)'), show: [0, 2] },
          { text: V('Blinkr vlevo', 'Left indicator'), show: [2, 4] },
          { text: V('Blinkr vpravo', 'Right indicator'), show: [4, 6] },
          { text: V('Couvání', 'Reverse'), show: [6, 8] },
          { text: V('Zadní mlhovka', 'Rear fog'), show: [8, 10] },
          { text: V('Výstražná světla', 'Hazard lights'), show: [10, 12] },
          { text: V('+ obrysová a osvětlení SPZ', '+ tail lights and plate light'), level: 'info' }
        ]
      };
    }
  });

  R('lights.seal', {
    duration: 8, camera: { pos: [-0.35, 0.32, 0.5], target: [0.0, 0.12, 0.12], fov: 40 }, shadow: 0.8, thumbT: 2,
    build: function (ctx, K) {
      var root = benchRoot(K);
      var good = rearLamp(K); good.group.position.set(0, 0.12, -0.08); good.group.rotation.y = PI * 0.85; root.add(good.group);
      var sealGlow = K.FX.glow(good.seal, 0x30a46c);
      var bad = rearLamp(K); bad.group.position.set(0.05, 0.12, 0.33); bad.group.rotation.y = -0.4; root.add(bad.group);
      var drops = [];
      for (var i = 0; i < 18; i++) {
        var dd = K.mesh(K.G.sphere(0.003 + (i % 3) * 0.0015, 10), 'water');
        dd.position.set(0.012, -0.05 + (i * 37 % 100) / 1000, -0.14 + (i * 53 % 280) / 1000); bad.group.add(dd); drops.push(dd);
      }
      var fog = K.mesh(K.G.box(0.004, 0.12, 0.3), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25, depthWrite: false })); fog.position.x = 0.031; bad.group.add(fog);
      return {
        root: root,
        update: function (t) { sealGlow(t < 4 ? 0.4 + 0.4 * Math.sin(t * 5) : 0.2); fog.material.opacity = 0.15 + 0.1 * Math.sin(t * 2); },
        labels: [
          { text: V('Těsnění celé, čisté, nepřekroucené', 'Seal intact, clean, not twisted'), at: good.seal, level: 'ok' },
          { text: V('Voda / mlha uvnitř = netěsnost', 'Water / fog inside = leak'), at: [0.1, 0.25, 0.33], level: 'danger', show: [3, 8] }
        ],
        captions: [
          { text: V('Před montáží zkontrolujte těsnění', 'Check the seal before refitting') },
          { text: V('Vadné těsnění = koroze kontaktů a vlhkost v kufru', 'Bad seal = corroded contacts and a wet boot'), show: [3, 8], level: 'info' }
        ]
      };
    }
  });
})(window.STU);
