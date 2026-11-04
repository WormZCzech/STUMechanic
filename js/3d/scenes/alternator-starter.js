/* 3D scenes: alternator & starter. Uses S.n1 (battery.js) and S.d3 (diag.js) at build time. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

  /** Engine front with accessory belt drive (XY plane, facing +Z). opts.isgm: label alternator as starter-generator. */
  function frontRig(ctx, K, opts) {
    opts = opts || {};
    var root = new THREE.Group();
    var block = K.mesh(K.G.rbox(0.62, 0.55, 0.32, 0.03), 'castIron'); block.position.set(0, 0.36, -0.37); root.add(block);
    var head = K.mesh(K.G.rbox(0.6, 0.14, 0.3, 0.02), 'aluCast'); head.position.set(0, 0.7, -0.37); root.add(head);
    var cover = K.mesh(K.G.rbox(0.5, 0.5, 0.02, 0.02), 'plasticBlack'); cover.position.set(-0.02, 0.4, -0.2); root.add(cover);
    var C = [
      { n: 'crank', x: 0, y: 0.13, r: 0.075 }, { n: 'tens', x: 0.15, y: 0.31, r: 0.03 }, { n: 'alt', x: 0.19, y: 0.52, r: 0.034 },
      { n: 'wp', x: -0.05, y: 0.47, r: 0.045 }, { n: 'ac', x: -0.19, y: 0.27, r: 0.055 }
    ];
    var path = K.G.beltPath(C), lens = K.G.pathLengths(path);
    var belt = new THREE.Group();
    belt.add(K.mesh(K.G.ribbon(path, 0.005, 0.022), 'rubber'));
    root.add(belt);
    var pulleys = {};
    C.forEach(function (c) {
      var g = new THREE.Group(); g.position.set(c.x, c.y, 0);
      var p = K.mesh(K.G.latheZ([[0.01, -0.014], [c.r, -0.014], [c.r - 0.002, -0.011], [c.r - 0.002, 0.011], [c.r, 0.014], [0.01, 0.014]], 40), c.n === 'tens' ? 'plasticBlack' : 'steelDark');
      g.add(p);
      for (var i = 0; i < 3; i++) { var sp = K.mesh(K.G.box(c.r * 1.4, 0.006, 0.004), 'steel'); sp.rotation.z = i * PI / 3; sp.position.z = 0.012; g.add(sp); }
      var hub = K.mesh(K.G.hex(0.008, 0.01), 'zinc'); hub.rotation.x = PI / 2; hub.position.z = 0.017; g.add(hub);
      root.add(g); pulleys[c.n] = { g: g, r: c.r };
    });
    // tensioner arm
    var arm = new THREE.Group(); arm.position.set(0.21, 0.24, 0.005);
    arm.add(K.mesh(K.G.rbox(0.1, 0.03, 0.012, 0.006), 'aluCast')); arm.children[0].position.x = -0.04; arm.children[0].rotation.z = 0.7;
    root.add(arm);
    // alternator body + B+ terminal
    var alt = new THREE.Group(); alt.position.set(0.19, 0.52, -0.09);
    var body = K.mesh(K.G.cylZ(0.068, 0.13, 40), 'alu'); alt.add(body);
    for (var f = 0; f < 6; f++) { var fin = K.mesh(K.G.torus(0.068, 0.003, PI * 2, 32), 'aluCast'); fin.position.z = -0.05 + f * 0.02; alt.add(fin); }
    var bplus = new THREE.Group();
    var stud = K.mesh(K.G.cylZ(0.004, 0.025, 10), 'brass'); bplus.add(stud);
    var nut = K.mesh(K.G.hex(0.007, 0.007), 'zinc'); nut.rotation.x = PI / 2; nut.position.z = 0.006; bplus.add(nut);
    var cap = K.mesh(K.G.rbox(0.03, 0.03, 0.03, 0.008), K.M.clone('toolRed')); cap.position.z = 0.0; cap.visible = false; bplus.add(cap);
    bplus.position.set(0.035, 0.04, -0.07); bplus.rotation.y = PI; alt.add(bplus);
    var cable = K.mesh(K.G.tube([[0.035, 0.04, -0.09], [0.05, 0.1, -0.15], [0.12, 0.05, -0.25]], 0.006), K.M.clone('toolRed', { roughness: 0.6 })); alt.add(cable);
    var plug = K.mesh(K.G.rbox(0.025, 0.018, 0.02, 0.004), 'plasticBlack'); plug.position.set(-0.04, 0.05, -0.06); alt.add(plug);
    [[0.06, -0.05], [-0.06, 0.05]].forEach(function (b) { var bo = K.mesh(K.G.hex(0.008, 0.012), 'zinc'); bo.rotation.x = PI / 2; bo.position.set(b[0], b[1], 0.07); alt.add(bo); });
    root.add(alt);
    var marks = [];
    for (var m = 0; m < 8; m++) { var mk = K.mesh(K.G.box(0.004, 0.004, 0.024), 'plasticWhite'); root.add(mk); marks.push(mk); }
    var total = lens[lens.length - 1];
    return {
      root: root, belt: belt, alt: alt, arm: arm, bplus: bplus, cap: cap, pulleys: pulleys,
      spin: function (t, speed) {
        var a = t * (speed || 6);
        Object.keys(pulleys).forEach(function (k) { pulleys[k].g.rotation.z = -a * 0.075 / pulleys[k].r; });
        var s0 = a * 0.075;
        marks.forEach(function (mk, i) { var p = K.G.pointAt(path, lens, -s0 + i * total / marks.length); mk.position.set(p.x, p.y, 0); });
      }
    };
  }

  R('alternator-starter.symptoms', {
    duration: 7, camera: { pos: [0.05, 0.05, 0.62], target: [0, 0, 0], fov: 34 }, ground: false, shadow: 0.6, thumbT: 2,
    build: function (ctx, K) {
      var root = new THREE.Group(), D = S.d3;
      var cl = D.cluster(K, function (x, W, H, st) {
        x.fillStyle = '#07090c'; x.fillRect(0, 0, W, H);
        D.icon(x, 'batt', W * 0.3, H * 0.45, H * 0.4, st && st.on ? '#ff3b30' : '#1b2229');
        x.fillStyle = '#c8d3dd'; x.font = 'bold ' + (H * 0.13) + 'px ' + FONT; x.textAlign = 'center';
        x.fillText(st && st.on ? '12.1 V' : '14.2 V', W * 0.68, H * 0.5);
      }, { on: false });
      root.add(cl.group);
      return {
        root: root,
        update: function (t) { cl.face.userData.redraw({ on: t > 1.5 }); },
        captions: [
          { text: V('Alternátor: kontrolka baterie za jízdy, slabá světla, pískání, napětí pod 13,5 V', 'Alternator: battery light while driving, dim lights, whining, voltage below 13.5 V') },
          { text: V('Startér: jen cvaknutí, drnčení, pomalé nebo žádné protočení při dobré baterii', 'Starter: just a click, grinding, slow or no cranking with a good battery'), show: [3.5, 7], level: 'info' }
        ]
      };
    }
  });

  R('alternator-starter.voltage', S.n1.meterScene({
    duration: 8,
    reading: function (t) { var i = Math.min(2, Math.floor(t / 2.7)); return [{ v: '14.25' }, { v: '13.95' }, { v: '12.40', c: '#8a0f0f' }][i]; },
    captions: [
      { text: V('Motor běží, měřte na pólech baterie', 'Engine running, measure at the battery posts') },
      { text: V('13,8–14,7 V = OK; zapněte světla + ventilátor + vyhřívání skla – stále nad 13,5 V', '13.8–14.7 V = OK; switch on lights + blower + rear heater – still above 13.5 V'), show: [2.7, 5.4], level: 'ok' },
      { text: V('Pod 13 V nebo nad 15 V = vadné dobíjení (alternátor / regulátor / řemen)', 'Below 13 V or above 15 V = faulty charging (alternator / regulator / belt)'), show: [5.4, 8], level: 'danger' }
    ]
  }));

  R('alternator-starter.belt', {
    duration: 8, camera: { pos: [0.25, 0.55, 0.85], target: [0, 0.35, 0], fov: 36 }, shadow: 1, thumbT: 3,
    build: function (ctx, K) {
      var r = frontRig(ctx, K);
      return {
        root: r.root,
        update: function (t) { r.spin(t < 4 ? t : 4, 6); },
        labels: [
          { text: ctx.vehicle === 'volvo-xc60-b4' ? V('startér-generátor (ISGM)', 'starter-generator (ISGM)') : V('alternátor', 'alternator'), at: r.alt },
          { text: V('napínák', 'tensioner'), at: r.pulleys.tens.g },
          { text: V('klikový hřídel', 'crankshaft'), at: r.pulleys.crank.g }
        ],
        captions: [
          { text: V('Drážkový řemen pohání alternátor – zkontrolujte trhliny, lesk, napnutí', 'The poly-V belt drives the alternator – check for cracks, glazing, tension') },
          { text: V('Kontrolu dělejte jen s VYPNUTÝM motorem', 'Inspect only with the engine OFF'), level: 'danger', show: [4, 8] }
        ]
      };
    }
  });

  R('alternator-starter.crankTest', S.n1.meterScene({
    duration: 8,
    reading: function (t) { return t < 2 ? { v: '12.62' } : (t < 5 ? { v: (10.4 + 0.2 * Math.sin(t * 25)).toFixed(2) } : { v: '12.55' }); },
    captions: [
      { text: V('Baterie nabitá (12,6 V)? Pak měřte při startování', 'Battery charged (12.6 V)? Then measure while cranking') },
      { text: V('Napětí drží ~10 V, ale motor se netočí = startér / jeho kabel / relé', 'Voltage holds ~10 V but the engine does not turn = starter / its cable / relay'), show: [2, 8], level: 'accent' }
    ]
  }));

  R('alternator-starter.bplus', {
    duration: 6, camera: { pos: [0.62, 0.78, 0.2], target: [0.2, 0.53, -0.12], fov: 34 }, shadow: 1, thumbT: 3,
    build: function (ctx, K) {
      var r = frontRig(ctx, K);
      var glow = K.FX.glow(r.bplus, 0xe5484d);
      return {
        root: r.root,
        update: function (t) { glow(0.5 + 0.5 * Math.sin(t * 5)); },
        labels: [{ text: V('B+ = stále pod napětím!', 'B+ = always live!'), at: r.bplus, level: 'danger' }],
        captions: [
          { text: V('Před prací na alternátoru / startéru: odpojit MÍNUS baterie', 'Before working on the alternator / starter: disconnect the battery MINUS') },
          { text: V('Silový kabel B+ vede přímo z baterie (bez pojistky nebo přes hlavní pojistku) – zkrat = oblouk a požár', 'The B+ cable comes straight from the battery (unfused or via a main fuse) – a short = arc and fire'), level: 'danger', show: [2, 6] }
        ]
      };
    }
  });

  R('alternator-starter.altOut', {
    duration: 10, camera: { pos: [0.6, 0.75, 0.9], target: [0.1, 0.42, 0], fov: 36 }, shadow: 1.2, thumbT: 7,
    build: function (ctx, K) {
      var r = frontRig(ctx, K), fade = K.FX.fader(r.belt);
      var sp = K.P.spanner(0.22, 0.008); sp.rotation.x = PI / 2; var hold = new THREE.Group(); hold.add(sp); hold.position.set(0.15, 0.31, 0.03); r.root.add(hold);
      var base = r.alt.position.clone();
      return {
        root: r.root,
        update: function (t) {
          var tens = K.T.seg(t, 0.5, 1.6) - K.T.seg(t, 2.6, 3.2);
          hold.rotation.z = 0.4 + tens * 0.5; hold.visible = t < 3.3;
          r.arm.rotation.z = tens * 0.3;
          fade(1 - K.T.seg(t, 1.8, 2.6));
          var out = K.T.seg(t, 4, 6), up = K.T.seg(t, 6, 8);
          r.alt.position.copy(base).add(new THREE.Vector3(0.05 * up, up * 0.25, out * 0.28));
        },
        labels: [{ text: V('napínák povolit klíčem', 'release the tensioner with a spanner'), at: hold, show: [0, 3] }, { text: V('konektor + B+ odpojit, šrouby ven', 'unplug connector + B+, bolts out'), at: r.alt, show: [3, 6] }],
        captions: [
          { text: V('Vyfoťte si vedení řemenu před sundáním!', 'Photograph the belt routing before removal!') },
          { text: V('Alternátor váží 5–8 kg – podepřete ho, než vyndáte poslední šroub', 'The alternator weighs 5–8 kg – support it before removing the last bolt'), show: [4, 10], level: 'warning' }
        ]
      };
    }
  });

  R('alternator-starter.starterOut', {
    duration: 9, camera: { pos: [0.55, 0.38, 0.85], target: [0.02, 0.2, 0.1], fov: 36 }, shadow: 1, thumbT: 6,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var block = K.mesh(K.G.rbox(0.5, 0.45, 0.4, 0.03), 'castIron'); block.position.set(-0.35, 0.35, 0); root.add(block);
      var bell = K.mesh(K.G.lathe([[0.12, 0], [0.22, 0.05], [0.24, 0.18], [0.12, 0.3]], 40), 'aluCast'); bell.rotation.z = -PI / 2; bell.position.set(-0.1, 0.3, 0); root.add(bell);
      var gb = K.mesh(K.G.rbox(0.35, 0.3, 0.32, 0.04), 'aluCast'); gb.position.set(0.35, 0.3, 0); root.add(gb);
      var starter = new THREE.Group();
      var motor = K.mesh(K.G.cylX(0.04, 0.14, 32), 'blackOxide'); motor.position.x = 0.08; starter.add(motor);
      var sol = K.mesh(K.G.cylX(0.022, 0.09, 24), 'zinc'); sol.position.set(0.06, 0.055, 0); starter.add(sol);
      var nose = K.mesh(K.G.cylX(0.03, 0.05, 24), 'aluCast'); nose.position.x = -0.02; starter.add(nose);
      var pin = K.mesh(K.G.gear(9, 0.016, 0.012, 0.02, 0.004), 'steel'); pin.rotation.y = PI / 2; pin.position.x = -0.055; starter.add(pin);
      var term = K.mesh(K.G.cyl(0.004, 0.02, 10), 'brass'); term.position.set(0.09, 0.08, 0); starter.add(term);
      var sbase = new THREE.Vector3(0.02, 0.17, 0.2);
      root.add(starter);
      var bolts = [0, 1].map(function (i) { var b = K.P.bolt({ r: 0.006, len: 0.05, mat: 'zinc' }); b.rotation.z = -PI / 2; root.add(b); return b; });
      return {
        root: root,
        update: function (t) {
          var bo = K.T.seg(t, 0.8, 3), out = K.T.seg(t, 3.5, 6.5);
          bolts.forEach(function (b, i) { b.position.set(-0.03 + bo * 0.08, 0.2 + (i ? -0.06 : 0.06), 0.2); b.visible = bo < 0.98; });
          starter.position.copy(sbase).add(new THREE.Vector3(out * 0.12, -out * 0.25, 0));
        },
        labels: [{ text: V('startér (3–5 kg)', 'starter (3–5 kg)'), at: starter }, { text: V('silový kabel = B+', 'main cable = B+'), at: function () { return starter.localToWorld(new THREE.Vector3(0.09, 0.11, 0)); }, level: 'danger', show: [0, 3] }],
        captions: [
          { text: V('Startér bývá na přírubě převodovky, často přístupný zespodu (vůz na stojanech)', 'The starter sits on the gearbox flange, often reached from below (car on stands)') },
          { text: V('Baterie odpojená! Kabel B+ je na startéru bez pojistky', 'Battery disconnected! The B+ cable on the starter is unfused'), level: 'danger', show: [0, 3.5] },
          { text: V('Při povolení posledního šroubu startér přidržte – nesmí spadnout na obličej', 'Hold the starter when removing the last bolt – it must not fall on your face'), level: 'warning', show: [3.5, 9] }
        ]
      };
    }
  });

  R('alternator-starter.fit', {
    duration: 8, camera: { pos: [0.62, 0.8, 0.2], target: [0.2, 0.53, -0.12], fov: 34 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var r = frontRig(ctx, K);
      var tw = K.P.torqueWrench(0.3); var hold = new THREE.Group(); tw.rotation.x = -PI / 2; hold.add(tw); r.root.add(hold);
      r.root.updateMatrixWorld(true);
      var bp = r.bplus.getWorldPosition(new THREE.Vector3());
      hold.position.copy(bp).add(new THREE.Vector3(0, 0, -0.08));
      return {
        root: r.root,
        update: function (t) { var k = K.T.seg(t % 4, 0.5, 2.5); hold.rotation.z = -0.4 + k * 0.4; r.cap.visible = t > 6; },
        labels: [{ text: V('moment dle příručky – měkký závit!', 'torque per manual – soft thread!'), at: r.bplus, level: 'accent' }],
        captions: [
          { text: V('B+ matice: čistý kontakt, předepsaný moment, krytka zpět', 'B+ nut: clean contact, specified torque, cap back on') },
          { text: V('Nový řemen dle fotky, napínák pomalu povolit', 'New belt per your photo, release the tensioner slowly'), show: [4, 8], level: 'info' }
        ]
      };
    }
  });

  R('alternator-starter.verify', S.n1.meterScene({
    duration: 6,
    reading: function (t) { return { v: (14.2 + 0.04 * Math.sin(t * 3)).toFixed(2) }; },
    captions: [
      { text: V('Baterie zpět (plus první), nastartovat, změřit 13,8–14,7 V', 'Battery back (plus first), start, measure 13.8–14.7 V') },
      { text: V('Kontrolka baterie zhasne, řemen běží rovně a bez pískání', 'Battery light off, belt runs straight and quiet'), level: 'ok', show: [2, 6] }
    ]
  }));
})(window.STU);
