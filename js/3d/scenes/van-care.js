/* 3D scenes: commercial van care (Citroën Jumper X250). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var VAN = 'citroen-jumper-22hdi';

  function box(K, w, h, d, mat) { return K.mesh(K.G.rbox(w, h, d, 0.01), mat); }

  R('van-care.payload', {
    duration: 9, camera: { pos: [-6, 3.2, 5.2], target: [-0.6, 1.0, 0], fov: 34 }, shadow: 4.2, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle === 'generic' ? VAN : ctx.vehicle); root.add(c.group);
      var fade = K.FX.fader(c.body); fade(0.3);
      var d = c.dims, s = c.spec;
      var cardboard = K.M.clone('wood', { color: 0xb08a5a });
      var boxes = [];
      for (var i = 0; i < 12; i++) {
        var b = box(K, 0.55, 0.45, 0.6, cardboard);
        var col = i % 3, row = Math.floor(i / 3) % 2, lay = Math.floor(i / 6);
        b.userData.home = new THREE.Vector3(d.rear + 0.45 + row * 0.6 + lay * 1.25, s.clr + 0.5 + 0.225, -0.62 + col * 0.62);
        b.userData.t0 = 0.5 + i * 0.35;
        root.add(b); boxes.push(b);
      }
      var scale = K.FX.canvasPanel(0.7, 0.32, function (cx2, W, H, st) {
        cx2.fillStyle = '#0d1a24'; cx2.fillRect(0, 0, W, H); cx2.fillStyle = '#fff'; cx2.textAlign = 'center';
        cx2.font = '700 ' + Math.round(H * 0.13) + 'px system-ui'; cx2.fillText(S.t(V('Náklad / užitečná hmotnost', 'Load / payload')), W / 2, H * 0.2);
        cx2.fillStyle = '#3b4652'; cx2.fillRect(W * 0.08, H * 0.42, W * 0.84, H * 0.18);
        cx2.fillStyle = st > 0.92 ? '#e5484d' : '#30a46c'; cx2.fillRect(W * 0.08, H * 0.42, W * 0.84 * Math.min(1, st), H * 0.18);
        cx2.fillStyle = '#fff'; cx2.font = '800 ' + Math.round(H * 0.16) + 'px system-ui'; cx2.fillText(Math.round(st * 100) + ' %', W / 2, H * 0.85);
      }, { px: 520, state: 0 });
      scale.position.set(d.rear + 0.6, s.H + 0.3, 1.2); scale.rotation.y = -0.85; root.add(scale);
      return {
        root: root,
        update: function (t) {
          var n = 0;
          boxes.forEach(function (b) { var k = T.seg(t, b.userData.t0, b.userData.t0 + 0.4); b.visible = k > 0; b.position.copy(b.userData.home).add(new THREE.Vector3(-1.2 * (1 - k), 0.3 * (1 - k), 0)); if (k > 0.99) n++; });
          var load = n / boxes.length;
          scale.userData.redraw(Math.round(load * 104) / 100);
          c.group.position.y = -0.04 * load; c.group.rotation.z = 0.012 * load;
        },
        labels: [{ text: V('těžké věci dole a nad nápravou', 'heavy items low and over the axle'), at: [d.rear + 1.0, s.clr + 1.3, 0], show: [3, 9], level: 'accent' }],
        captions: [
          { text: V('Užitečnou hmotnost a max. zatížení náprav najdete v ORV a na štítku ve dveřích', 'Payload and maximum axle loads are in the papers and on the door-pillar plate') },
          { text: V('Přetížení = delší brzdná dráha, přehřáté pneu, prasklé pružiny – a pokuta', 'Overloading = longer braking, overheated tyres, broken springs – and a fine'), level: 'danger', show: [5, 9] }
        ]
      };
    }
  });

  R('van-care.springs', {
    duration: 8, camera: { pos: [0.35, 0.55, 1.75], target: [0, 0.33, 0.5], fov: 36 }, shadow: 1.4, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var axle = K.mesh(K.G.cylZ(0.045, 1.6, 24), 'blackOxide'); axle.position.set(0, 0.33, 0); root.add(axle);
      var hub = K.mesh(K.G.cylZ(0.09, 0.08, 32), 'castIron'); hub.position.set(0, 0.33, 0.8); root.add(hub);
      var leaves = new THREE.Group();
      var crackLeaf = null;
      for (var i = 0; i < 3; i++) {
        var len = 1.2 - i * 0.28;
        var pts = [];
        for (var k = 0; k <= 16; k++) { var x = -len / 2 + len * k / 16; pts.push([x, 0.4 - i * 0.016 - 0.12 * (1 - Math.pow(2 * x / 1.2, 2))]); }
        var shape = []; pts.forEach(function (p) { shape.push([p[0], p[1]]); }); pts.slice().reverse().forEach(function (p) { shape.push([p[0], p[1] - 0.012]); });
        var leaf = K.mesh(K.G.extrude(shape, 0.06, 0.002), 'blackOxide');
        leaf.position.z = 0.55; leaves.add(leaf);
        if (i === 1) crackLeaf = leaf;
      }
      root.add(leaves);
      [-0.6, 0.6].forEach(function (x) { var eye = K.mesh(K.G.torus(0.025, 0.012, PI * 2, 20), 'blackOxide'); eye.position.set(x, 0.42, 0.55); root.add(eye); var bush = K.mesh(K.G.cylZ(0.016, 0.07, 16), 'rubber'); bush.position.copy(eye.position); root.add(bush); });
      var shackle = K.mesh(K.G.box(0.02, 0.1, 0.075), 'steelDark'); shackle.position.set(0.62, 0.48, 0.55); shackle.rotation.z = 0.25; root.add(shackle);
      [-0.05, 0.05].forEach(function (x) { var ub = K.mesh(K.G.tube([[x, 0.42, 0.51], [x, 0.24, 0.51], [x, 0.24, 0.59], [x, 0.42, 0.59]], 0.007), 'zinc'); root.add(ub); });
      var crack = K.mesh(K.G.box(0.004, 0.016, 0.064), K.M.clone('hiDanger')); crack.position.set(-0.25, 0.4 - 0.016 - 0.12 * (1 - Math.pow(2 * -0.25 / 1.2, 2)) - 0.006, 0.55); root.add(crack);
      return {
        root: root,
        update: function (t) { crack.material.emissiveIntensity = t > 2 ? 0.5 + 0.5 * Math.sin(t * 6) : 0; leaves.position.y = Math.sin(t * 1.4) * 0.004; },
        labels: [
          { text: V('prasklý list = vyměnit (vždy v páru)', 'cracked leaf = replace (always in pairs)'), at: [-0.25, 0.32, 0.6], show: [2, 8], level: 'danger' },
          { text: V('silentbloky ok? (praskliny, vůle)', 'bushes ok? (cracks, play)'), at: [0.6, 0.5, 0.6], show: [4, 8], level: 'accent' },
          { text: V('třmeny (U-šrouby) dotažené', 'U-bolts tight'), at: [0, 0.2, 0.6], show: [5.5, 8], level: 'accent' }
        ],
        captions: [
          { text: V('Zadní náprava X250: listová pera – ověřte provedení u vašeho vozu', 'X250 rear axle: leaf springs – verify the version on your van'), level: 'info' },
          { text: V('Prasklé pero nebo uvolněné třmeny = nejezdit naložený', 'A broken leaf or loose U-bolts = do not drive loaded'), level: 'danger', show: [3, 8] }
        ]
      };
    }
  });

  R('van-care.slider', {
    duration: 8, camera: { pos: [0.6, 0.35, 0.9], target: [0, 0.05, 0], fov: 36 }, shadow: 1, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var panel = K.mesh(K.G.box(1.4, 0.4, 0.02), K.M.carPaint(K.carSpec(VAN).paint)); panel.position.set(0, 0.1, -0.05); root.add(panel);
      var rail = K.mesh(K.G.extrude([[-0.02, -0.02], [0.02, -0.02], [0.02, 0.02], [0.01, 0.02], [0.01, -0.01], [-0.01, -0.01], [-0.01, 0.02], [-0.02, 0.02]], 1.2, 0), 'steelDark');
      rail.rotation.y = PI / 2; rail.position.set(0, 0.05, -0.02); root.add(rail);
      var carriage = new THREE.Group();
      var arm = K.mesh(K.G.rbox(0.06, 0.03, 0.12, 0.008), 'blackOxide'); arm.position.z = 0.06; carriage.add(arm);
      [-0.025, 0.025].forEach(function (x) { var roller = K.mesh(K.G.cylZ(0.012, 0.016, 16), 'plasticWhite'); roller.position.set(x, 0.0, 0.0); carriage.add(roller); });
      carriage.position.set(-0.4, 0.05, -0.02); root.add(carriage);
      var spray = K.FX.puff(0xf0e6c8, 10, 0.03, 0.08); spray.group.rotation.x = -PI / 2; root.add(spray.group);
      var can = K.mesh(K.G.cyl(0.025, 0.14, 20), 'toolRed'); root.add(can);
      return {
        root: root,
        update: function (t) {
          var sx = -0.5 + T.seg(t, 0.5, 3.5) * 1.0;
          can.position.set(sx, 0.12, 0.18); can.rotation.x = 0.8; can.visible = t < 3.8;
          spray.group.position.set(sx, 0.07, 0.08); spray.update(t, t > 0.5 && t < 3.5);
          carriage.position.x = -0.45 + 0.9 * Math.abs(Math.sin((t - 4) * 0.8)) * (t > 4 ? 1 : 0);
          carriage.children.slice(1).forEach(function (r) { r.rotation.z = t * 6; });
        },
        captions: [
          { text: V('Vyčistěte všechny 3 kolejnice posuvných dveří (horní, střední, spodní)', 'Clean all 3 sliding door rails (upper, centre, lower)') },
          { text: V('Tenká vrstva maziva na kolejnici a válečky – ne na těsnění', 'A thin film of grease on the rail and rollers – not on the seals'), level: 'info', show: [2, 8] },
          { text: V('Dveře nezavírejte násilím – drhnoucí dveře = seřídit / vyměnit vozík', 'Do not force the door – a dragging door = adjust / replace the carriage'), level: 'warning', show: [5, 8] }
        ]
      };
    }
  });

  R('van-care.rust', {
    duration: 8, camera: { pos: [0.9, -0.25, 1.1], target: [0, 0.25, 0], fov: 36 }, shadow: 1.2, thumbT: 5, ground: false,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var floor = K.mesh(K.G.box(1.6, 0.02, 1.0), 'steelDark'); floor.position.y = 0.4; root.add(floor);
      [-0.5, 0, 0.5].forEach(function (x) { var rib = K.mesh(K.G.box(0.05, 0.06, 1.0), 'steelDark'); rib.position.set(x, 0.36, 0); root.add(rib); });
      var rusts = [[-0.3, 0.2], [0.2, -0.25], [0.55, 0.3], [-0.6, -0.3]].map(function (p) { var r = K.mesh(K.G.cyl(0.07 + Math.random() * 0.0, 0.004, 20), 'rust'); r.position.set(p[0], 0.388, p[1]); root.add(r); return r; });
      var waxMat = K.M.clone('blackOxide', { transparent: true, opacity: 0, roughness: 0.4, color: 0x3a2c1c });
      var wax = K.mesh(K.G.box(1.58, 0.004, 0.98), waxMat); wax.position.y = 0.386; root.add(wax);
      var gun = K.mesh(K.G.cyl(0.012, 0.3, 12), 'steel'); root.add(gun);
      var mist = K.FX.puff(0x6b5a40, 14, 0.12, 0.2); mist.group.rotation.x = PI; root.add(mist.group);
      return {
        root: root,
        update: function (t) {
          rusts.forEach(function (r, i) { r.material = K.M.rust; r.scale.setScalar(t < 3 ? 1 : 0.4); r.visible = t < 3 || t > 3 + i * 0; });
          var spray = T.seg(t, 3.5, 7);
          waxMat.opacity = 0.85 * spray;
          var gx = -0.7 + spray * 1.4;
          gun.position.set(gx, 0.15, 0.3); gun.rotation.x = 0.5;
          mist.group.position.set(gx, 0.3, 0.2); mist.update(t, t > 3.5 && t < 7);
        },
        labels: [{ text: V('povrchová rez: drátěný kartáč + konvertor', 'surface rust: wire brush + converter'), at: [-0.3, 0.32, 0.2], show: [0.5, 3.4], level: 'accent' }],
        captions: [
          { text: V('Podvozek umyjte, vysušte a ošetřete rezavá místa', 'Wash and dry the underbody and treat rusty spots') },
          { text: V('Ochranný vosk ne na výfuk, brzdy, pružiny tlumičů a řemeny!', 'No protective wax on the exhaust, brakes, shock rods or belts!'), level: 'danger', show: [3.5, 8] },
          { text: V('Pracujte s respirátorem a brýlemi, dobře větrat', 'Wear a respirator and goggles, ventilate well'), level: 'warning', show: [5.5, 8] }
        ]
      };
    }
  });

  R('van-care.cavity', {
    duration: 7, camera: { pos: [0.7, 0.4, 0.9], target: [0, 0.15, 0], fov: 36 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var paint = K.M.carPaint(K.carSpec(VAN).paint);
      var outer = K.mesh(K.G.box(1.2, 0.18, 0.012), paint); outer.position.set(0, 0.15, 0.08); root.add(outer);
      var inner = K.mesh(K.G.box(1.2, 0.18, 0.012), 'steelDark'); inner.position.set(0, 0.15, -0.08); root.add(inner);
      var bottom = K.mesh(K.G.box(1.2, 0.012, 0.17), 'steelDark'); bottom.position.set(0, 0.06, 0); root.add(bottom);
      var drain = K.mesh(K.G.cyl(0.012, 0.014, 16), 'blackOxide'); drain.position.set(0.3, 0.06, 0); root.add(drain);
      var wand = K.mesh(K.G.tube([[0.3, -0.25, 0], [0.3, 0.02, 0], [0.3, 0.1, 0], [0.0, 0.12, 0]], 0.004), 'plasticWhite'); root.add(wand);
      var mist = K.FX.puff(0x8a7048, 18, 0.08, 0.12); mist.group.rotation.z = PI / 2; root.add(mist.group);
      var fade = K.FX.fader(outer); fade(0.25);
      return {
        root: root,
        update: function (t) { var k = T.seg(t, 1, 5); mist.group.position.set(0.3 - k * 0.6, 0.13, 0); mist.update(t, t > 1 && t < 5.5); wand.position.x = -k * 0.3; },
        labels: [{ text: V('odtokový otvor: nesmí se ucpat!', 'drain hole: must stay open!'), at: [0.3, 0.02, 0.05], show: [4.5, 7], level: 'danger' }],
        captions: [
          { text: V('Dutinový vosk sondou s 360° tryskou přes otvory v prazích a rámech', 'Cavity wax with a 360° nozzle wand through the holes in sills and frames') },
          { text: V('Nejdřív pročistit odtoky – voda uvnitř = rez zevnitř', 'Clear the drain holes first – water inside = rust from the inside'), level: 'info', show: [3, 7] }
        ]
      };
    }
  });

  R('van-care.load', {
    duration: 8, camera: { pos: [1.6, 1.6, 2.2], target: [0, 0.35, 0], fov: 36 }, shadow: 2, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var floor = K.mesh(K.G.box(2.4, 0.02, 1.7), 'wood'); floor.position.y = 0.01; root.add(floor);
      var wallB = K.mesh(K.G.box(0.03, 1.4, 1.7), 'steelDark'); wallB.position.set(1.2, 0.7, 0); root.add(wallB);
      var crates = [[0.85, 0, 0.6], [0.3, 0, 0.5], [0.85, 0.45, 0.4]].map(function (p) { var b = box(K, 0.5, 0.45, 0.8, K.M.clone('wood', { color: 0xb08a5a })); b.position.set(p[0], 0.235 + p[1], 0); root.add(b); return b; });
      var rings = [[-0.1, -0.75], [-0.1, 0.75], [1.1, -0.75], [1.1, 0.75]].map(function (p) { var r = K.mesh(K.G.torus(0.025, 0.006, PI * 2, 16), 'zinc'); r.position.set(p[0], 0.03, p[1]); r.rotation.x = PI / 2; root.add(r); return r; });
      var strapMat = K.M.clone('toolYellow', { color: 0xe08a00 });
      var straps = [0.55, 0.95].map(function (x) { var st = K.mesh(K.G.tube([[x, 0.03, -0.75], [x, 0.72, -0.42], [x, 0.72, 0.42], [x, 0.03, 0.75]], 0.012), strapMat); root.add(st); return st; });
      return {
        root: root,
        update: function (t) { straps.forEach(function (st, i) { st.visible = t > 1.5 + i * 1.2; st.scale.y = 1 - 0.03 * T.seg(t, 4.5 + i * 0.5, 5.5 + i * 0.5); }); },
        labels: [
          { text: V('až k přepážce', 'up against the bulkhead'), at: [1.0, 1.1, 0], level: 'accent' },
          { text: V('kotevní oka', 'lashing points'), at: [-0.1, 0.12, 0.75], show: [1, 8], level: 'accent' }
        ],
        captions: [
          { text: V('Náklad dejte k přepážce, těžké dolů, a zajistěte popruhy do kotevních ok', 'Put the load against the bulkhead, heavy items at the bottom, and strap it to the lashing points') },
          { text: V('Nezajištěný náklad se při brzdění stane střelou – ohrožuje vás i ostatní', 'An unsecured load becomes a projectile when braking – it endangers you and others'), level: 'danger', show: [3, 8] }
        ]
      };
    }
  });

  var CHECKS = [
    V('Olej a chladicí kapalina', 'Oil and coolant'), V('Tlak a stav pneu (dle zatížení)', 'Tyre pressure and condition (for the load)'),
    V('Světla a stěrače', 'Lights and wipers'), V('Pera a úniky pod vozem', 'Springs and leaks under the van'),
    V('Dveře, zámky, kolejnice', 'Doors, locks, rails'), V('Upevnění nákladu', 'Load securing')
  ];
  R('van-care.checks', {
    duration: 8, camera: { pos: [0, 0.02, 0.85], target: [0, 0, 0], fov: 34 }, ground: false, shadow: 0.6, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var board = K.mesh(K.G.rbox(0.62, 0.48, 0.02, 0.02), 'wood'); board.position.z = -0.015; root.add(board);
      var list = K.FX.canvasPanel(0.56, 0.42, function (c, W, H, st) {
        c.fillStyle = '#f4f1e8'; c.fillRect(0, 0, W, H);
        c.fillStyle = '#111'; c.font = '800 ' + Math.round(H * 0.07) + 'px system-ui'; c.textAlign = 'left';
        c.fillText(S.t(V('Týdenní kontrola dodávky', 'Weekly van check')), W * 0.06, H * 0.11);
        CHECKS.forEach(function (ch, i) {
          var y = H * (0.25 + i * 0.125);
          c.strokeStyle = '#333'; c.lineWidth = 3; c.strokeRect(W * 0.06, y - H * 0.05, H * 0.06, H * 0.06);
          if (i < st) { c.fillStyle = '#1f8a56'; c.font = '800 ' + Math.round(H * 0.07) + 'px system-ui'; c.fillText('✔', W * 0.06, y); }
          c.fillStyle = '#111'; c.font = '600 ' + Math.round(H * 0.055) + 'px system-ui'; c.fillText(S.t(ch), W * 0.16, y);
        });
      }, { px: 640, state: 0 });
      root.add(list);
      return {
        root: root,
        update: function (t) { list.userData.redraw(Math.min(CHECKS.length, Math.floor(T.clamp((t - 0.5) / 1.1, 0, 6)))); },
        captions: [{ text: V('Dodávky najezdí hodně km – krátká pravidelná kontrola předejde drahým opravám', 'Vans cover high mileage – a short regular check prevents expensive repairs') }]
      };
    }
  });
})(window.STU);
