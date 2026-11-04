/* 3D scenes: spark plugs (petrol) and glow plugs (diesel – Octavia RS TDI). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var TQ = {
    'generic': V('dle příručky', 'per manual'), 'mb-cl500-c216': '≈ 25 Nm', 'volvo-xc60-b4': V('dle VIDA', 'per VIDA'),
    'skoda-octavia-rs-tdi': '≈ 15 Nm', 'toyota-gr-yaris': V('dle TIS', 'per TIS')
  };
  var GAP = {
    'generic': V('dle příručky', 'per manual'), 'mb-cl500-c216': V('z výroby – neupravovat', 'pre-gapped – do not adjust'),
    'volvo-xc60-b4': V('dle VIDA', 'per VIDA'), 'toyota-gr-yaris': V('z výroby – neupravovat', 'pre-gapped – do not adjust'),
    'skoda-octavia-rs-tdi': V('dle příručky', 'per manual')
  };
  function isGlow(ctx) { return ctx.vehicle === 'skoda-octavia-rs-tdi'; }
  function nCyl(vid) { return vid === 'toyota-gr-yaris' ? 3 : 4; }
  var B = 0.13; // head deck height above the floor in section scenes

  /* ------------------------------------------------------------------ parts */
  /** Spark plug, axis Y, electrode tip at y=0, terminal up. opts {tip: 'normal'|'sooty'|'oily'|'hot'} */
  function sparkPlug(K, opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var thread = K.mesh(K.G.cyl(0.0068, 0.019, 24), 'steel'); thread.position.y = 0.0095; g.add(thread);
    for (var i = 0; i < 14; i++) { var r = K.mesh(K.G.torus(0.0068, 0.0007, PI * 2, 20), 'steelDark'); r.rotation.x = PI / 2; r.position.y = 0.001 + i * 0.0013; g.add(r); }
    var gasket = K.mesh(K.G.cyl(0.0095, 0.002, 24), 'copper'); gasket.position.y = 0.02; g.add(gasket);
    var shell = K.mesh(K.G.cyl(0.0085, 0.009, 24), 'zinc'); shell.position.y = 0.0255; g.add(shell);
    var hex = K.mesh(K.G.hex(0.0093, 0.013), 'zinc'); hex.position.y = 0.0365; g.add(hex);
    var crimp = K.mesh(K.G.cyl(0.0075, 0.004, 24, 0.0065), 'zinc'); crimp.position.y = 0.045; g.add(crimp);
    var ins = K.mesh(K.G.lathe([[0.0062, 0], [0.0062, 0.004], [0.0056, 0.006], [0.0058, 0.009], [0.0052, 0.011], [0.0054, 0.014], [0.0049, 0.017], [0.0051, 0.02], [0.0045, 0.024], [0.0045, 0.03], [0.0035, 0.031]], 32), 'plasticWhite');
    ins.material = K.M.clone('plasticWhite', { roughness: 0.15, clearcoat: 1 }); ins.position.y = 0.047; g.add(ins);
    var term = K.mesh(K.G.cyl(0.0032, 0.008, 16), 'steel'); term.position.y = 0.082; g.add(term);
    var tipMat = { normal: K.M.clone('padFriction', { color: 0x9b7f5e }), sooty: K.M.clone('blackGloss', { roughness: 0.9 }), oily: K.M.clone('blackGloss', { roughness: 0.05, color: 0x1a1308 }), hot: K.M.clone('plasticWhite', { roughness: 0.5 }) }[opts.tip || 'normal'];
    var nose = K.mesh(K.G.cyl(0.0035, 0.006, 16, 0.002), tipMat); nose.position.y = 0.002; g.add(nose);
    var center = K.mesh(K.G.cyl(0.0008, 0.004, 10), 'steel'); center.position.y = -0.0015; g.add(center);
    var ground = new THREE.Group();
    var gv = K.mesh(K.G.box(0.0024, 0.007, 0.0018), 'steelDark'); gv.position.set(0.0055, -0.0028, 0); ground.add(gv);
    var gh = K.mesh(K.G.box(0.0068, 0.0016, 0.0018), 'steelDark'); gh.position.set(0.0028, -0.0057, 0); ground.add(gh);
    g.add(ground);
    g.userData = { hex: hex, ins: ins, ground: ground, center: center, gasket: gasket, len: 0.086 };
    return g;
  }

  /** Glow plug, axis Y, heater tip at y=0. */
  function glowPlug(K) {
    var g = new THREE.Group();
    var tipMat = K.M.clone('steelDark', { emissive: 0xff5a00, emissiveIntensity: 0 });
    var tip = K.mesh(K.G.cyl(0.0024, 0.02, 16, 0.002), tipMat); tip.position.y = 0.01; g.add(tip);
    var body = K.mesh(K.G.cyl(0.004, 0.04, 20), 'steel'); body.position.y = 0.04; g.add(body);
    var thread = K.mesh(K.G.cyl(0.0048, 0.012, 20), 'steel'); thread.position.y = 0.066; g.add(thread);
    for (var i = 0; i < 9; i++) { var r = K.mesh(K.G.torus(0.0048, 0.0006, PI * 2, 16), 'steelDark'); r.rotation.x = PI / 2; r.position.y = 0.061 + i * 0.0012; g.add(r); }
    var hex = K.mesh(K.G.hex(0.0058, 0.01), 'zinc'); hex.position.y = 0.077; g.add(hex);
    var stem = K.mesh(K.G.cyl(0.002, 0.012, 12), 'steel'); stem.position.y = 0.088; g.add(stem);
    var nut = K.mesh(K.G.hex(0.0035, 0.004), 'brass'); nut.position.y = 0.09; g.add(nut);
    g.userData = { tipMat: tipMat, hex: hex, len: 0.095, lower: [tip, body], upper: [thread, hex, stem, nut] };
    return g;
  }

  /** Coil-on-plug (boot down), boot bottom at y=0. */
  function coil(K) {
    var g = new THREE.Group();
    var boot = K.mesh(K.G.lathe([[0.0062, 0], [0.0095, 0.004], [0.0095, 0.07], [0.011, 0.075], [0.011, 0.09]], 24), 'rubber'); g.add(boot);
    var body = K.mesh(K.G.rbox(0.032, 0.05, 0.05, 0.006), 'plasticBlack'); body.position.y = 0.112; g.add(body);
    var ear = K.mesh(K.G.box(0.025, 0.006, 0.02), 'plasticBlack'); ear.position.set(0.025, 0.093, 0); g.add(ear);
    var bolt = K.mesh(K.G.hex(0.005, 0.005), 'zinc'); bolt.position.set(0.03, 0.098, 0); g.add(bolt);
    var conn = new THREE.Group();
    var cb = K.mesh(K.G.rbox(0.022, 0.02, 0.026, 0.004), 'plasticTex'); conn.add(cb);
    var lock = K.mesh(K.G.box(0.008, 0.005, 0.014), K.M.clone('toolRed')); lock.position.set(0, 0.012, 0); conn.add(lock);
    var wire = K.mesh(K.G.tube([[-0.011, 0, 0], [-0.04, 0.01, 0], [-0.08, 0.03, 0.02]], 0.0035), 'rubber'); conn.add(wire);
    conn.position.set(-0.026, 0.125, 0); g.add(conn);
    g.userData = { connector: conn, lock: lock, len: 0.14 };
    return g;
  }

  /** Cut-away of block + cylinder head (cut plane z=0 facing the camera). opts {diesel} */
  function section(K, opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var cut = K.M.clone('alu', { color: 0xd9dde2, roughness: 0.55 });
    function half(pts, mat) {
      var geo = K.G.extrude(pts, 0.08, 0, 6); geo.translate(0, 0, -0.04);
      var m = new THREE.Mesh(geo, [cut, K.M[mat || 'aluCast']]); g.add(m); return m;
    }
    var wellR = opts.diesel ? 0.009 : 0.014, boreR = opts.diesel ? 0.0049 : 0.0069, top = B + 0.13, seat = B + 0.034;
    var dome = [];
    for (var i = 0; i <= 10; i++) { var a = PI - i / 10 * PI; dome.push([0.04 * Math.cos(a), B + 0.012 * Math.sin(a)]); }
    // left half of head
    var L = [[-0.12, B], [-0.04, B]].concat(dome.filter(function (p) { return p[0] <= -boreR; })).concat([[-boreR, B + 0.011], [-boreR, seat], [-wellR, seat + 0.002], [-wellR, top], [-0.12, top]]);
    var Rr = [[0.12, top], [wellR, top], [wellR, seat + 0.002], [boreR, seat], [boreR, B + 0.011]].concat(dome.filter(function (p) { return p[0] >= boreR; })).concat([[0.04, B], [0.12, B]]);
    half(L); half(Rr);
    // back walls of well and bore (concave half cylinders)
    var inside = K.M.clone('aluCast', { side: THREE.DoubleSide });
    var w = new THREE.Mesh(new THREE.CylinderGeometry(wellR, wellR, top - seat, 24, 1, true, PI / 2, PI), inside); w.position.y = (top + seat) / 2; g.add(w);
    var b = new THREE.Mesh(new THREE.CylinderGeometry(boreR, boreR, seat - B - 0.011, 20, 1, true, PI / 2, PI), inside); b.position.y = (seat + B + 0.011) / 2; g.add(b);
    // block with cylinder bore
    half([[-0.12, 0], [-0.04, 0], [-0.04, B - 0.002], [-0.12, B - 0.002]], 'castIron');
    half([[0.04, 0], [0.12, 0], [0.12, B - 0.002], [0.04, B - 0.002]], 'castIron');
    var bore = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, B, 32, 1, true, PI / 2, PI), K.M.clone('steel', { side: THREE.DoubleSide, roughness: 0.2 })); bore.position.y = B / 2; g.add(bore);
    var gasket = K.mesh(K.G.box(0.24, 0.002, 0.08), 'blackOxide'); gasket.position.set(0, B - 0.001, -0.04); g.add(gasket);
    // piston (back half + cut face)
    var piston = new THREE.Group();
    piston.add(new THREE.Mesh(new THREE.CylinderGeometry(0.0395, 0.0395, 0.045, 32, 1, false, PI / 2, PI), K.M.alu));
    var pf = K.mesh(K.G.box(0.079, 0.045, 0.001), cut); pf.position.z = -0.0005; piston.add(pf);
    [0.012, 0.017, 0.022].forEach(function (y) { var ring = K.mesh(K.G.box(0.08, 0.0015, 0.001), 'blackOxide'); ring.position.set(0, y - 0.0225 + 0.02, 0.0002); piston.add(ring); });
    piston.position.y = B - 0.035; g.add(piston);
    // valves
    [-1, 1].forEach(function (s) {
      var v = new THREE.Group();
      v.add(K.mesh(K.G.cyl(0.0035, 0.1, 12), 'steel'));
      var hd = K.mesh(K.G.cyl(0.004, 0.003, 24, 0.016), 'steelDark'); hd.position.y = -0.05; v.add(hd);
      v.position.set(s * 0.045, B + 0.06, -0.02); v.rotation.z = s * -0.3; g.add(v);
    });
    if (opts.diesel) {
      var inj = new THREE.Group();
      inj.add(K.mesh(K.G.cyl(0.0085, 0.11, 20), 'steel'));
      var ih = K.mesh(K.G.rbox(0.03, 0.03, 0.03, 0.005), 'plasticBlack'); ih.position.y = 0.06; inj.add(ih);
      inj.position.set(0.03, B + 0.06, -0.025); g.add(inj);
    }
    g.userData = { piston: piston, seat: seat, top: top, plugY: seat - 0.02, glowY: seat - 0.07 };
    return g;
  }

  function plugInHead(K, ctx, root) {
    var diesel = isGlow(ctx);
    var sec = section(K, { diesel: diesel }); root.add(sec);
    var plug = diesel ? glowPlug(K) : sparkPlug(K);
    var y0 = diesel ? sec.userData.seat - 0.073 : sec.userData.plugY;
    plug.position.y = y0; root.add(plug);
    return { sec: sec, plug: plug, y0: y0, diesel: diesel };
  }

  var SEC_CAM = { pos: [0.16, 0.28, 0.42], target: [0, 0.19, 0], fov: 38 };

  /** Simple 4/3-cylinder engine top for cover/coil scenes. */
  function engineTop(K, n, root) {
    var e = K.P.engine({ cyl: n }); root.add(e);
    var len = e.userData.len;
    var cover = new THREE.Group();
    var shell = K.mesh(K.G.rbox(len * 0.9, 0.05, 0.3, 0.02), 'plasticTex'); cover.add(shell);
    var logo = K.mesh(K.G.rbox(0.18, 0.012, 0.08, 0.004), 'blackGloss'); logo.position.y = 0.027; cover.add(logo);
    for (var i = 0; i < 6; i++) { var rib = K.mesh(K.G.box(len * 0.8, 0.006, 0.006), 'plasticBlack'); rib.position.set(0, 0.026, -0.12 + i * 0.05); cover.add(rib); }
    cover.position.y = 0.72; root.add(cover);
    var studs = [-1, 1].map(function (s) { var st = K.mesh(K.G.cyl(0.008, 0.04, 12), 'rubber'); st.position.set(s * len * 0.3, 0.68, 0); root.add(st); return st; });
    return { engine: e, cover: cover, len: len, studs: studs };
  }

  /* ================================================================ scenes */
  R('plugs.overview', {
    duration: 6, camera: SEC_CAM, shadow: 0.6, thumbT: 2,
    build: function (ctx, K) {
      var root = new THREE.Group(), p = plugInHead(K, ctx, root);
      var c = null;
      if (!p.diesel) { c = coil(K); c.position.y = p.sec.userData.plugY + 0.08; root.add(c); }
      var spark = K.mesh(K.G.sphere(0.003, 12), new THREE.MeshBasicMaterial({ color: 0x9fd8ff, toneMapped: false })); spark.position.y = p.y0 - 0.003; root.add(spark);
      return {
        root: root,
        update: function (t) {
          var ph = (t % 1.5) / 1.5;
          spark.visible = !p.diesel && ph < 0.12;
          spark.scale.setScalar(1 + ph * 6);
          if (p.diesel) p.plug.userData.tipMat.emissiveIntensity = 0.5 + 0.5 * Math.sin(t * 2);
          p.sec.userData.piston.position.y = B - 0.035 - 0.02 * (1 - Math.cos(t * PI * 2 / 1.5)) * 0.5;
        },
        labels: p.diesel ? [
          { text: V('Žhavicí svíčka', 'Glow plug'), at: [0, p.y0 + 0.08, 0.01] },
          { text: V('Závit v hlavě (Al!)', 'Thread in head (Al!)'), at: [0, p.y0 + 0.065, 0.01], level: 'accent' },
          { text: V('Spalovací prostor', 'Combustion chamber'), at: [0, B + 0.004, 0.01] }
        ] : [
          { text: V('Konektor', 'Connector'), at: c.userData.connector },
          { text: V('Zapalovací cívka', 'Ignition coil'), at: [0.0, c.position.y + 0.14, 0.01] },
          { text: V('Závit v hlavě (Al!)', 'Thread in head (Al!)'), at: [0.01, p.y0 + 0.012, 0.01], level: 'accent' },
          { text: V('Spalovací prostor', 'Combustion chamber'), at: [-0.02, B + 0.004, 0.01] }
        ],
        captions: [{ text: p.diesel ? V('Diesel: žhavicí svíčka předehřívá spalovací prostor', 'Diesel: the glow plug preheats the combustion chamber') : V('Každý válec: cívka → svíčka → jiskra', 'Each cylinder: coil → plug → spark') }]
      };
    }
  });

  R('plugs.cover', {
    duration: 6, camera: { pos: [0.95, 1.3, 1.05], target: [0, 0.66, 0], fov: 38 }, shadow: 1, thumbT: 3.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), e = engineTop(K, nCyl(ctx.vehicle), root);
      return {
        root: root,
        update: function (t) { var k = T.seg(t, 1, 2.6) * (1 - T.seg(t, 5.2, 6)); e.cover.position.y = 0.72 + k * 0.25; e.cover.rotation.z = k * 0.08; },
        labels: [{ text: V('pryžové čepy', 'rubber studs'), at: e.studs[0], show: [2.6, 5.2] }],
        captions: [
          { text: V('Kryt motoru: nahoru rovně, je na pryžových čepech', 'Engine cover: pull straight up, it sits on rubber studs') },
          { text: V('Motor studený – hliníková hlava je pak bezpečnější', 'Engine cold – safer for the aluminium head'), level: 'info' }
        ]
      };
    }
  });

  function coilScene(id, out) {
    R(id, {
      duration: 7, camera: SEC_CAM, shadow: 0.6, thumbT: out ? 4.5 : 3,
      build: function (ctx, K) {
        var T = K.T, root = new THREE.Group(), p = plugInHead(K, ctx, root);
        var c = coil(K), cy = p.sec.userData.plugY + 0.08; root.add(c);
        var conn = c.userData.connector, cx0 = conn.position.clone();
        return {
          root: root,
          update: function (t) {
            var lock, connOff, lift;
            if (out) { lock = T.seg(t, 0.5, 1.2); connOff = T.seg(t, 1.3, 2.4); lift = T.seg(t, 2.8, 4.6); if (t > 6.4) { var r = T.seg(t, 6.4, 7); lock *= 1 - r; connOff *= 1 - r; lift *= 1 - r; } }
            else { lift = 1 - T.seg(t, 0.5, 2.4); connOff = 1 - T.seg(t, 2.8, 3.8); lock = 1 - T.seg(t, 3.9, 4.4); }
            c.position.y = cy + lift * 0.12;
            conn.position.copy(cx0).add(new THREE.Vector3(-0.05 * connOff, 0, 0));
            c.userData.lock.position.y = 0.012 - 0.002 * lock;
          },
          labels: out ? [{ text: V('zámek', 'lock'), at: c.userData.lock, show: [0.3, 1.4], level: 'accent' }]
            : [{ text: V('cvak! zajištěno', 'click! locked'), at: c.userData.lock, show: [4.3, 7], level: 'ok' }],
          captions: out ? [
            { text: V('1. Zámek konektoru stisknout, konektor stáhnout', '1. Press the connector lock, pull the connector'), show: [0, 2.6] },
            { text: V('2. Cívku vytáhnout ROVNĚ nahoru (ne za kabel)', '2. Pull the coil STRAIGHT up (not by the wire)'), show: [2.6, 7] }
          ] : [
            { text: V('Cívku zatlačit až dosedne, konektor až cvakne', 'Push the coil fully home, connector until it clicks') },
            { text: V('Každý konektor zkontrolovat tahem', 'Tug-test every connector'), show: [4.4, 7], level: 'info' }
          ]
        };
      }
    });
  }
  coilScene('plugs.coilOut', true);
  coilScene('plugs.coilIn', false);

  R('plugs.blowOut', {
    duration: 5, camera: { pos: [0.2, 0.36, 0.38], target: [0, 0.22, 0], fov: 38 }, shadow: 0.6, thumbT: 1.5,
    build: function (ctx, K) {
      var root = new THREE.Group(), p = plugInHead(K, ctx, root);
      var grit = [];
      for (var i = 0; i < 14; i++) { var gr = K.mesh(K.G.sphere(0.0018 + (i % 3) * 0.0008, 8), i % 2 ? 'rust' : 'castIron'); root.add(gr); grit.push(gr); }
      var gun = new THREE.Group();
      gun.add(K.at(K.mesh(K.G.cyl(0.003, 0.12, 12), 'chrome'), 0, 0.06, 0));
      var body = K.mesh(K.G.rbox(0.03, 0.05, 0.08, 0.008), 'toolBlue'); body.position.set(0, 0.14, -0.02); gun.add(body);
      var hose = K.mesh(K.G.tube([[0, 0.14, -0.02], [0.03, 0.12, -0.12], [0.12, 0.05, -0.25]], 0.005), K.M.clone('toolYellow')); gun.add(hose);
      gun.position.set(0.004, p.sec.userData.top + 0.01, 0.0); gun.rotation.z = -0.12; root.add(gun);
      var puff = K.FX.puff(0xb9b2a5, 14, 0.04, 0.14); puff.group.position.set(0, p.sec.userData.top, 0); puff.group.scale.setScalar(0.45); root.add(puff.group);
      var seat = p.sec.userData.seat;
      return {
        root: root,
        update: function (t) {
          var blowing = t > 0.8;
          grit.forEach(function (g, i) {
            var k = blowing ? Math.min(1, ((t - 0.8) * 1.2 + i * 0.07) % 1.2) : 0;
            g.position.set(Math.cos(i * 2.3) * 0.009 * (1 + k), seat + 0.006 + k * 0.17, Math.sin(i * 2.3) * 0.006 + 0.004);
            g.visible = !blowing || k < 1;
          });
          puff.update(t, blowing);
        },
        labels: [{ text: V('nečistoty', 'grit'), at: [0, seat + 0.012, 0.01], show: [0, 1.2] }],
        captions: [
          { text: V('Šachtu vyfoukat PŘED povolením svíčky', 'Blow out the well BEFORE loosening the plug') },
          { text: V('Písek ve válci = poškrábaný válec. Brýle!', 'Grit in the cylinder = scored bore. Glasses!'), level: 'danger', show: [1, 5] }
        ]
      };
    }
  });

  /** Plug socket + extension + ratchet assembly, opening at y=0. */
  function plugTool(K, torque) {
    var g = new THREE.Group();
    var sock = K.mesh(K.G.lathe([[0.0105, 0], [0.012, 0.002], [0.012, 0.062], [0.007, 0.066], [0.007, 0.07], [0.0045, 0.07], [0.0045, 0.002], [0.0095, 0]], 32), 'chrome'); g.add(sock);
    var insert = K.mesh(K.G.cyl(0.0058, 0.012, 16), 'rubber'); insert.position.y = 0.05; g.add(insert);
    var ext = K.mesh(K.G.cyl(0.0045, 0.1, 16), 'chrome'); ext.position.y = 0.12; g.add(ext);
    var handle = torque ? K.P.torqueWrench(0.36) : K.P.ratchet(0.22);
    handle.position.y = 0.148; g.add(handle);
    g.userData.handle = handle;
    return g;
  }

  R('plugs.socket', {
    duration: 7, camera: { pos: [0.3, 0.4, 0.5], target: [0.04, 0.25, 0], fov: 40 }, shadow: 0.8, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), p = plugInHead(K, ctx, root);
      var tool = plugTool(K, false); root.add(tool);
      var ar = K.FX.rotArrow(0.035, 'ccw', 0xf5a524, 220, 0.004); ar.rotation.x = -PI / 2; root.add(ar);
      var hexY = p.y0 + (p.diesel ? 0.072 : 0.03);
      return {
        root: root,
        update: function (t) {
          var down = T.seg(t, 0.3, 1.6), turn = T.seg(t, 1.8, 5.2), up = T.seg(t, 5.4, 6.6);
          var rise = turn * 0.018 + up * 0.12;
          tool.position.y = hexY + (1 - down) * 0.15 + rise;
          tool.rotation.y = turn * PI * 2.5;
          p.plug.position.y = p.y0 + rise;
          p.plug.rotation.y = tool.rotation.y;
          ar.position.y = p.sec.userData.top + 0.06; ar.visible = t > 1.8 && t < 5.2;
        },
        captions: [
          { text: V('Hlavice na svíčky s gumou + prodloužení', 'Spark plug socket with rubber insert + extension') },
          { text: V('Povolit proti směru hod. ručiček, plynule', 'Loosen counter-clockwise, smoothly'), show: [1.8, 7], level: 'info' }
        ]
      };
    }
  });

  R('plugs.read', {
    duration: 6, camera: { pos: [0.0, 0.16, 0.2], target: [0, 0.03, 0], fov: 36 }, shadow: 0.3, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var kinds = [['normal', V('Normální', 'Normal'), null], ['sooty', V('Saze', 'Sooty'), 'accent'], ['oily', V('Olejová', 'Oily'), 'danger'], ['hot', V('Přehřátá', 'Overheated'), 'danger']];
      var plugs = kinds.map(function (k, i) {
        var pl = sparkPlug(K, { tip: k[0] }); pl.rotation.x = -PI / 2 + 0.25; pl.position.set(-0.075 + i * 0.05, 0.012, 0.03); root.add(pl); return pl;
      });
      return {
        root: root,
        update: function (t) { plugs.forEach(function (p, i) { p.rotation.y = Math.sin(t + i) * 0.15; }); },
        labels: kinds.map(function (k, i) { return { text: k[1], at: [-0.075 + i * 0.05, 0.03, 0.04], level: k[2] }; }),
        captions: [
          { text: V('Stará svíčka vypráví o stavu motoru', 'An old plug tells you about the engine') },
          { text: V('Mokrá od oleje / bílá a natavená → do servisu', 'Oil-wet / white & blistered → see a workshop'), level: 'danger', show: [2, 6] }
        ]
      };
    }
  });

  R('plugs.gap', {
    duration: 6, camera: { pos: [0.006, 0.007, 0.04], target: [0.002, 0.004, 0], fov: 36 }, ground: false, shadow: 0.2, thumbT: 2.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var pl = sparkPlug(K); pl.rotation.z = PI; pl.position.y = 0.0; root.add(pl);
      var gauge = new THREE.Group();
      var blade = K.mesh(K.G.box(0.05, 0.0009, 0.006), 'steel'); blade.position.x = 0.025; gauge.add(blade);
      var hold = K.mesh(K.G.rbox(0.035, 0.006, 0.014, 0.003), 'toolYellow'); hold.position.x = 0.065; gauge.add(hold);
      root.add(gauge);
      var gap = S.t(GAP[ctx.vehicle] || GAP.generic);
      return {
        root: root,
        update: function (t) { var k = T.seg(t, 0.6, 2) - T.seg(t, 4.5, 5.8); gauge.position.set(-0.002 + (1 - k) * 0.03, 0.0044, 0); },
        labels: [{ text: { cs: 'Mezera: ' + gap, en: 'Gap: ' + gap }, at: [0.002, 0.0075, 0.002], level: 'accent' }],
        captions: [
          { text: V('Spárová měrka mezi elektrody – jen kontrola', 'Feeler gauge between electrodes – check only') },
          { text: V('Iridium/platina: tenkou elektrodu NEOHÝBAT', 'Iridium/platinum: do NOT bend the fine tip'), level: 'danger', show: [2, 6] }
        ]
      };
    }
  });

  R('plugs.thread', {
    duration: 7, camera: { pos: [0.22, 0.3, 0.42], target: [0.02, 0.22, 0], fov: 38 }, shadow: 0.7, thumbT: 3.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), p = plugInHead(K, ctx, root);
      var hose = K.mesh(K.G.cyl(0.006, 0.15, 16), K.M.clone('rubber', { color: 0x2e3a2e })); root.add(hose);
      var bad = p.diesel ? glowPlug(K) : sparkPlug(K); bad.position.set(0.11, 0.0, 0.07); bad.rotation.z = -0.35; root.add(bad);
      var cross = new THREE.Group();
      [1, -1].forEach(function (s) { var b = K.mesh(K.G.box(0.04, 0.006, 0.006), 'hiDanger'); b.rotation.z = s * PI / 4; cross.add(b); });
      cross.position.set(0.13, 0.11, 0.08); root.add(cross);
      var ar = K.FX.rotArrow(0.025, 'cw', 0x30a46c, 220, 0.003); ar.rotation.x = -PI / 2; root.add(ar);
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 0.5, 5);
          p.plug.position.y = p.y0 + (1 - k) * 0.02;
          p.plug.rotation.y = -k * PI * 6;
          hose.position.y = p.plug.position.y + p.plug.userData.len + 0.07;
          ar.position.y = p.sec.userData.top + 0.05;
          cross.rotation.y = t;
        },
        labels: [{ text: V('šikmo = stržený závit', 'crooked = stripped thread'), at: cross, level: 'danger' }],
        captions: [
          { text: p.diesel ? V('Zašroubovat RUKOU až na doraz', 'Thread in BY HAND until it seats') : V('Zašroubovat RUKOU – trik s hadičkou', 'Thread in BY HAND – rubber hose trick') },
          { text: V('Drhne? Zastavit, vyndat, zkusit znovu rovně', 'Binding? Stop, remove, try again straight'), level: 'danger', show: [2.5, 7] }
        ]
      };
    }
  });

  R('plugs.torque', {
    duration: 6, camera: { pos: [0.4, 0.42, 0.5], target: [0.12, 0.28, 0], fov: 40 }, shadow: 0.9, thumbT: 3.6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), p = plugInHead(K, ctx, root);
      var tool = plugTool(K, true); root.add(tool);
      var hexY = p.y0 + (p.diesel ? 0.072 : 0.03);
      var tq = S.t(TQ[ctx.vehicle] || TQ.generic);
      return {
        root: root,
        update: function (t) {
          tool.position.y = hexY;
          tool.rotation.y = -T.seg(t, 0.8, 3.2) * 0.6;
        },
        labels: [{ text: { cs: 'klik! ' + tq, en: 'click! ' + tq }, at: [0.2, 0.33, 0], show: [3.2, 6], level: 'ok' }],
        captions: [
          { text: V('Momentovým klíčem – hlava je z hliníku', 'With a torque wrench – the head is aluminium') },
          { text: V('Po cvaknutí už nepřitahovat', 'Stop pulling once it clicks'), level: 'info', show: [3.2, 6] },
          { text: { cs: 'Moment: ' + tq, en: 'Torque: ' + tq }, level: 'accent' }
        ]
      };
    }
  });

  R('plugs.twinSpark', {
    duration: 10, camera: { pos: [0.75, 1.0, 0.95], target: [0, 0.45, 0], fov: 40 }, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var block = K.mesh(K.G.rbox(0.7, 0.3, 0.36, 0.03), 'aluCast'); block.position.y = 0.2; root.add(block);
      var cyls = [];
      [-1, 1].forEach(function (side) {
        var bank = new THREE.Group(); bank.position.set(0, 0.4, side * 0.14); bank.rotation.x = side * 0.55; root.add(bank);
        bank.add(K.at(K.mesh(K.G.rbox(0.66, 0.1, 0.22, 0.02), 'aluCast'), 0, 0.03, 0));
        bank.add(K.at(K.mesh(K.G.rbox(0.62, 0.05, 0.18, 0.02), 'plasticBlack'), 0, 0.105, 0));
        for (var i = 0; i < 4; i++) {
          var cg = new THREE.Group(); cg.position.set(-0.24 + i * 0.16, 0.13, 0); bank.add(cg);
          [-1, 1].forEach(function (s) {
            var pl = sparkPlug(K); pl.scale.setScalar(1.3); pl.position.set(s * 0.035, -0.06, side * 0.07); cg.add(pl);
          });
          var coilB = K.mesh(K.G.rbox(0.06, 0.04, 0.05, 0.008), 'plasticTex'); coilB.position.set(0, 0.02, -side * 0.02); cg.add(coilB);
          var lead = K.mesh(K.G.tube([[0, 0.02, -side * 0.02], [0.03, 0.04, side * 0.03], [0.035, 0.05, side * 0.07]], 0.004), 'rubber'); cg.add(lead);
          cyls.push({ g: cg, glow: K.FX.glow(cg, 0xf5a524) });
        }
      });
      return {
        root: root,
        update: function (t) { var idx = Math.floor(t / 1.25) % 8; cyls.forEach(function (c, i) { c.glow(i === idx ? 0.8 : 0); }); },
        captions: [
          { text: V('M273 V8: 2 svíčky na válec = 16 svíček', 'M273 V8: 2 plugs per cylinder = 16 plugs') },
          { text: V('Jeden válec po druhém – nic nepřehodit', 'One cylinder at a time – mix nothing up'), level: 'info' }
        ]
      };
    }
  });

  /** dashboard + a cylinder table/misfire counter */
  R('plugs.test', {
    duration: 8, camera: { pos: [0.05, 0.08, 0.6], target: [0, 0.02, 0], fov: 36 }, ground: false, shadow: 0.6, thumbT: 5,
    build: function (ctx, K) {
      var glow = isGlow(ctx), n = ctx.vehicle === 'mb-cl500-c216' ? 8 : nCyl(ctx.vehicle);
      var root = new THREE.Group(), tr = function (v) { return S.t(v); };
      var cl = S.d3.cluster(K, function (x, W, H, st) {
        x.fillStyle = '#07090c'; x.fillRect(0, 0, W, H);
        S.d3.icon(x, glow ? 'glow' : 'mil', W * 0.12, H * 0.32, H * 0.3, st.lamp ? '#ffb000' : '#1b2229');
        x.fillStyle = st.lamp ? '#ffb000' : '#45f08b'; x.font = 'bold ' + H * 0.065 + 'px system-ui, sans-serif';
        x.fillText(st.lamp ? '…' : tr(glow ? V('Kontrolka žhavení zhasne', 'Glow light goes out') : V('Kontrolka motoru nesvítí', 'Engine light stays off')), W * 0.02, H * 0.78, W * 0.37);
        x.fillStyle = '#9aa5b8'; x.fillText(tr(glow ? V('Paměť závad', 'Fault memory') : V('Počítadlo vynechávání', 'Misfire counter')), W * 0.42, H * 0.16);
        for (var i = 0; i < n; i++) {
          var y = H * (0.28 + i * (0.68 / n));
          x.fillStyle = '#d7e3ee'; x.font = H * (n > 4 ? 0.065 : 0.09) + 'px system-ui, sans-serif';
          x.fillText(tr(glow ? V('Svíčka ', 'Plug ') : V('Válec ', 'Cyl ')) + (i + 1), W * 0.42, y + H * 0.04);
          x.fillStyle = '#45f08b'; x.fillText(glow ? 'OK' : '0', W * 0.85, y + H * 0.04);
        }
      }, { lamp: 1 });
      root.add(cl.group);
      return {
        root: root,
        update: function (t) { cl.face.userData.redraw({ lamp: t < (glow ? 2.5 : 1) ? 1 : 0 }); cl.group.position.y = Math.sin(t * 40) * 0.0004; },
        captions: [
          { text: V('Nastartovat: klidný volnoběh, bez cukání', 'Start: smooth idle, no stumbling') },
          { text: glow ? V('Studený start druhý den ráno = skutečný test', 'Cold start next morning = the real test') : V('Bliká kontrolka motoru = vynechávání → vypnout!', 'Flashing engine light = misfire → switch off!'), level: glow ? 'info' : 'danger', show: [3, 8] },
          { text: V('Kontrolka žhavení bliká za jízdy → diagnostika', 'Glow light flashing while driving → diagnose'), level: 'danger', show: glow ? [5.5, 8] : [99, 99] }
        ]
      };
    }
  });

  R('plugs.glowLight', {
    duration: 6, camera: { pos: [0.05, 0.08, 0.6], target: [0, 0.02, 0], fov: 36 }, ground: false, shadow: 0.6, thumbT: 1,
    build: function (ctx, K) {
      var root = new THREE.Group(), tr = function (v) { return S.t(v); };
      var cl = S.d3.cluster(K, function (x, W, H, on) {
        x.fillStyle = '#07090c'; x.fillRect(0, 0, W, H);
        S.d3.icon(x, 'glow', W * 0.14, H * 0.45, H * 0.45, on ? '#ffb000' : '#3a2a00');
        x.fillStyle = '#ffb000'; x.font = 'bold ' + H * 0.1 + 'px system-ui, sans-serif'; x.fillText(tr(V('Bliká = závada', 'Flashing = fault')), W * 0.03, H * 0.9);
        x.fillStyle = '#d7e3ee'; x.font = H * 0.1 + 'px system-ui, sans-serif';
        [V('Příznaky:', 'Symptoms:'), V('• těžký studený start', '• hard cold start'), V('• bílý kouř po startu', '• white smoke at start'), V('• kódy P0670–P0684', '• codes P0670–P0684')].forEach(function (l, i) { x.fillText(tr(l), W * 0.36, H * (0.2 + i * 0.2)); });
      }, 1);
      root.add(cl.group);
      return {
        root: root,
        update: function (t) { cl.face.userData.redraw(Math.floor(t * 2.5) % 2); },
        captions: [{ text: V('Žhavení pomáhá jen při studeném startu', 'Glow plugs only help on cold starts'), level: 'info' }]
      };
    }
  });

  /** multimeter (box with canvas screen) */
  function multimeter(K, value) {
    var g = new THREE.Group();
    g.add(K.mesh(K.G.rbox(0.08, 0.15, 0.035, 0.01), 'toolYellow'));
    var sc = K.FX.canvasPanel(0.06, 0.035, function (x, W, H, v) { x.fillStyle = '#b9c7a3'; x.fillRect(0, 0, W, H); x.fillStyle = '#111'; x.font = 'bold ' + H * 0.6 + 'px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(v, W / 2, H / 2); }, { px: 200, state: value });
    sc.position.set(0, 0.04, 0.0185); g.add(sc);
    var dial = K.mesh(K.G.cylZ(0.022, 0.008, 24), 'plasticBlack'); dial.position.set(0, -0.025, 0.02); g.add(dial);
    g.userData.screen = sc;
    return g;
  }

  R('plugs.glowTest', {
    duration: 6, camera: { pos: [0.3, 0.4, 0.5], target: [0.06, 0.26, 0], fov: 40 }, shadow: 0.8, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var sec = section(K, { diesel: true }); root.add(sec);
      var gp = glowPlug(K); var y0 = sec.userData.seat - 0.073; gp.position.y = y0; root.add(gp);
      var mm = multimeter(K, '---'); mm.position.set(0.24, 0.32, 0.02); mm.rotation.y = -0.4; root.add(mm);
      var termY = y0 + 0.092;
      var red = K.mesh(K.G.cyl(0.002, 0.07, 8), 'toolRed'); root.add(red);
      var redT = K.mesh(K.G.tube([[0.22, 0.25, 0.03], [0.14, 0.3, 0.06], [0.03, termY + 0.06, 0.02]], 0.0025), 'toolRed'); root.add(redT);
      var blk = K.mesh(K.G.tube([[0.25, 0.25, 0.03], [0.2, 0.2, 0.08], [0.1, B + 0.13, 0.02]], 0.0025), 'plasticBlack'); root.add(blk);
      var tip = K.mesh(K.G.sphere(0.003, 8), 'chrome'); tip.position.set(0.1, B + 0.13, 0.02); root.add(tip);
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 0.4, 1.6);
          red.position.set(0.015 * (1 - k) + 0.0, termY + 0.035 + (1 - k) * 0.04, 0.0); red.rotation.z = 0.3;
          mm.userData.screen.userData.redraw(t > 1.8 ? '0.8 Ω' : '---');
        },
        labels: [{ text: V('hrot na svorku', 'probe on terminal'), at: [0, termY + 0.02, 0.01], level: 'accent' }, { text: V('kostra', 'ground'), at: tip }],
        captions: [
          { text: V('Odpor: hrot na svorku, druhý na kostru', 'Resistance: probe on terminal, other to ground') },
          { text: V('Typicky < 2 Ω; ∞ / velmi vysoký = vadná', 'Typically < 2 Ω; ∞ / very high = faulty'), level: 'info', show: [1.8, 6] }
        ]
      };
    }
  });

  R('plugs.penetrate', {
    duration: 7, camera: { pos: [0.55, 1.0, -0.75], target: [0, 0.62, -0.08], fov: 38 }, shadow: 1, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var e = K.P.engine({ cyl: 4, diesel: true }); root.add(e);
      var len = e.userData.len, plugs = [];
      for (var i = 0; i < 4; i++) {
        var gp = glowPlug(K); gp.position.set(-len / 2 + 0.13 + i * 0.12, 0.6, -0.13); root.add(gp);
        var con = K.mesh(K.G.cyl(0.004, 0.012, 10), 'plasticBlack'); con.position.set(gp.position.x, 0.69, -0.13); root.add(con);
        var w = K.mesh(K.G.tube([[gp.position.x, 0.696, -0.13], [gp.position.x + 0.02, 0.72, -0.15], [gp.position.x + 0.06, 0.73, -0.15]], 0.002), 'rubber'); root.add(w);
        plugs.push({ gp: gp, con: con, w: w });
      }
      var can = new THREE.Group();
      can.add(K.mesh(K.G.cyl(0.03, 0.18, 24), K.M.clone('toolRed')));
      var cap = K.mesh(K.G.cyl(0.012, 0.02, 16), 'plasticWhite'); cap.position.y = 0.1; can.add(cap);
      var straw = K.mesh(K.G.cyl(0.0015, 0.08, 6), 'toolRed'); straw.rotation.z = PI / 2; straw.position.set(0.04, 0.105, 0); can.add(straw);
      root.add(can);
      var mist = K.FX.puff(0xfff3c0, 12, 0.03, 0.04); mist.group.scale.setScalar(0.5); root.add(mist.group);
      return {
        root: root,
        update: function (t) {
          var idx = Math.min(3, Math.floor(T.lin(t, 0.5, 4.5) * 4));
          var px = plugs[idx].gp.position.x;
          can.position.set(px - 0.12, 0.74, -0.2); can.rotation.z = -0.5;
          mist.group.position.set(px, 0.69, -0.13); mist.update(t, t > 0.5 && t < 4.5);
          plugs.forEach(function (p, i) { var off = T.seg(t, 4.8 + i * 0.4, 5.2 + i * 0.4) * 0.03; p.con.position.y = 0.69 + off; });
        },
        captions: [
          { text: V('Den předem: uvolňovač ke svíčkám', 'The day before: penetrating oil on the plugs') },
          { text: V('Konektory stahovat za koncovku, ne za kabel', 'Pull connectors by the plug, not the wire'), level: 'info', show: [4.6, 7] }
        ]
      };
    }
  });

  function glowLoosenScene(id, snap) {
    R(id, {
      duration: snap ? 7 : 8, camera: { pos: [0.3, 0.42, 0.5], target: [0.06, 0.27, 0], fov: 40 }, shadow: 0.8, thumbT: snap ? 4.5 : 5,
      build: function (ctx, K) {
        var T = K.T, root = new THREE.Group();
        var sec = section(K, { diesel: true }); root.add(sec);
        var gp = glowPlug(K); var y0 = sec.userData.seat - 0.073; gp.position.y = y0; root.add(gp);
        var upper = new THREE.Group(); gp.userData.upper.forEach(function (m) { upper.add(m); }); gp.add(upper);
        var tool = new THREE.Group();
        var sock = K.mesh(K.G.lathe([[0.0075, 0], [0.009, 0.002], [0.009, 0.05], [0.0045, 0.05], [0.0045, 0.002], [0.0068, 0]], 24), 'chrome'); tool.add(sock);
        var r = K.P.ratchet(0.14); r.position.y = 0.035; tool.add(r);
        root.add(tool);
        var flash = K.mesh(K.G.sphere(0.012, 16), new THREE.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: 0, toneMapped: false })); flash.position.y = y0 + 0.06; root.add(flash);
        var meter = K.FX.canvasPanel(0.16, 0.035, function (x, W, H, k) {
          x.fillStyle = '#1b2229'; x.fillRect(0, 0, W, H);
          var c = k < 0.6 ? '#30a46c' : k < 0.85 ? '#f5a524' : '#e5484d';
          x.fillStyle = c; x.fillRect(4, 4, (W - 8) * k, H - 8);
          x.fillStyle = '#fff'; x.font = 'bold ' + H * 0.5 + 'px system-ui, sans-serif'; x.textBaseline = 'middle'; x.fillText(S.t(V('síla povolování', 'loosening force')), 8, H / 2);
        }, { px: 400, state: 0 });
        meter.position.set(0.12, 0.38, 0.02); root.add(meter);
        var tr = function (v) { return S.t(v); };
        return {
          root: root,
          update: function (t) {
            tool.position.y = y0 + 0.072;
            var force;
            if (!snap) {
              var k = T.seg(t, 0.6, 3.5);
              force = Math.min(1, k * 0.85);
              tool.rotation.y = k * 0.35 + (t > 4 ? T.seg(t, 4, 7) * PI * 2 : 0);
              gp.rotation.y = t > 4 ? T.seg(t, 4, 7) * PI * 2 : 0;
              gp.position.y = y0 + (t > 4 ? T.seg(t, 4, 7) * 0.01 : 0);
            } else {
              var k2 = T.seg(t, 0.4, 3);
              force = Math.min(1, k2 * 1.15);
              tool.rotation.y = k2 * 0.45 + T.seg(t, 3, 3.3) * 1.2;
              upper.rotation.y = T.seg(t, 3, 3.3) * 1.2;
              upper.position.y = T.seg(t, 3.3, 4.5) * 0.04;
              tool.position.y += upper.position.y;
              flash.material.opacity = T.pulse(t, 3, 3.6);
            }
            meter.userData.redraw(Math.round(force * 20) / 20);
          },
          labels: snap ? [{ text: V('Ulomená svíčka = specialista', 'Snapped plug = specialist'), at: [0, y0 + 0.06, 0.01], show: [3.3, 7], level: 'danger' }]
            : [{ text: V('Nejde? Nepřidávat sílu!', 'Stuck? Do not add force!'), at: [0.06, 0.4, 0], show: [2.5, 4], level: 'danger' }],
          captions: snap ? [
            { text: V('Přetažením se svíčka ulomí v hlavě', 'Forcing it snaps the plug inside the head'), level: 'danger' },
            { text: V('Vyvrtání / demontáž hlavy = drahá oprava', 'Drilling out / head removal = expensive repair'), show: [3.5, 7] }
          ] : [
            { text: V('Citlivě, krátkou rukojetí – cítit odpor', 'Gently, short handle – feel the resistance') },
            { text: V('Nejde? Nepřidávat sílu – uvolňovač, zahřát motor, specialista', 'Stuck? No extra force – penetrant, warm engine, specialist'), level: 'danger', show: [3, 8] }
          ]
        };
      }
    });
  }
  glowLoosenScene('plugs.glow', false);
  glowLoosenScene('plugs.glowSnap', true);
})(window.STU);
