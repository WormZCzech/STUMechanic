/* 3D scenes: jump-starting & towing. Uses S.n1 helpers from battery.js and S.d3 from diag.js (build time only). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

  /** Two cars nose to nose: dead = user's car (front +X), donor = generic car facing it. Bodies semi-transparent. */
  function twoCars(ctx, K, gap) {
    var N = S.n1, root = new THREE.Group();
    var dead = N.xray(K, ctx.vehicle, 0.35), d = dead.d;
    root.add(dead.root);
    var donor = N.xray(K, 'generic', 0.35), dd = donor.d;
    var dx = d.front + (gap == null ? 0.9 : gap) + dd.front;
    donor.root.position.set(dx, 0, 0.35); donor.root.rotation.y = PI;
    root.add(donor.root);
    var loc = N.batLoc(ctx.vehicle, d);
    // dead car: battery or jump point in the engine bay
    var deadPlus = loc.trunk || loc.floor ? new THREE.Vector3(d.front - 0.45, d.hoodF - 0.12, 0.35) : new THREE.Vector3(loc.p[0] + 0.05, loc.p[1] + 0.12, loc.p[2]);
    var deadGround = new THREE.Vector3(d.front - 0.75, d.hoodF - 0.2, 0.0);
    var donorLoc = N.batLoc('generic', dd);
    var bl = new THREE.Vector3(donorLoc.p[0], donorLoc.p[1], donorLoc.p[2]);
    function toDonor(v) { return new THREE.Vector3(dx - v.x, v.y, 0.35 - v.z); }
    var donorPlus = toDonor(bl.clone().add(new THREE.Vector3(0.08, 0.12, 0))), donorMinus = toDonor(bl.clone().add(new THREE.Vector3(-0.08, 0.12, 0)));
    // small batteries visible through the bodies
    var b1 = N.battery(K, { type: S.n1.vtype(ctx.vehicle) }); b1.scale.setScalar(0.9);
    b1.position.set(loc.p[0], loc.p[1] - 0.08, loc.p[2]); root.add(b1);
    var b2 = N.battery(K, {}); b2.scale.setScalar(0.9); b2.position.copy(toDonor(bl)).add(new THREE.Vector3(0, -0.08, 0)); b2.rotation.y = PI; root.add(b2);
    var engine = K.mesh(K.G.rbox(0.5, 0.35, 0.55, 0.04), 'castIron'); engine.position.set(d.front - 0.75, d.hoodF - 0.45, 0); root.add(engine);
    return { root: root, dead: dead, donor: donor, d: d, dd: dd, dx: dx, loc: loc, deadPlus: deadPlus, deadGround: deadGround, donorPlus: donorPlus, donorMinus: donorMinus };
  }
  function cable(K, a, b, red) {
    var mid = a.clone().lerp(b, 0.5); mid.y = Math.max(a.y, b.y) + 0.25;
    var g = new THREE.Group();
    g.add(K.mesh(K.G.tube([a.clone().add(new THREE.Vector3(0, 0.03, 0)), mid, b.clone().add(new THREE.Vector3(0, 0.03, 0))], 0.009), red ? 'toolRed' : 'plasticBlack'));
    [a, b].forEach(function (p) { var j = K.mesh(K.G.rbox(0.03, 0.06, 0.02, 0.006), red ? 'toolRed' : 'plasticBlack'); j.position.copy(p).add(new THREE.Vector3(0, 0.03, 0)); g.add(j); });
    return g;
  }
  function numDot(K, p) { var m = K.mesh(K.G.sphere(0.03, 16), K.M.clone('hiAccent')); m.position.copy(p).add(new THREE.Vector3(0, 0.1, 0)); m.userData.noShadow = true; return m; }

  var CAM2 = { pos: [3.2, 2.6, 4.2], target: [2.3, 0.6, 0.2], fov: 36 };
  function cam2(r) { var cx = r.d.front + 0.35; return { pos: [cx + 0.9, 1.6 + r.d.H * 0.45, 2.9 + r.d.H * 0.3], target: [cx, r.d.hoodF - 0.1, 0.2] }; }

  R('jumpstart-tow.check', {
    duration: 6, camera: { pos: [0.05, 0.05, 0.62], target: [0, 0, 0], fov: 34 }, ground: false, shadow: 0.6, thumbT: 2,
    build: function (ctx, K) {
      var root = new THREE.Group(), D = S.d3;
      var cl = D.cluster(K, function (x, W, H, st) {
        x.fillStyle = '#07090c'; x.fillRect(0, 0, W, H);
        var dim = st && st.dim ? 0.35 : 1;
        x.globalAlpha = dim;
        ['batt', 'oil', 'mil', 'glow'].forEach(function (k, i) { D.icon(x, k, W * (0.22 + i * 0.19), H * 0.45, H * 0.36, i < 2 ? '#ff3b30' : '#ffb000'); });
        x.globalAlpha = 1;
        x.fillStyle = '#c8d3dd'; x.font = 'bold ' + (H * 0.12) + 'px ' + FONT; x.textAlign = 'center';
        x.fillText(st && st.dim ? S.t(V('… cvak … cvak …', '… click … click …')) : '12.1 V', W / 2, H * 0.88);
      }, { dim: false });
      root.add(cl.group);
      return {
        root: root,
        update: function (t) { cl.face.userData.redraw({ dim: t > 2 && Math.sin(t * 12) > 0 }); },
        captions: [
          { text: V('Je to baterie? Cvakání, pohasínající kontrolky, pomalé protáčení', 'Is it the battery? Clicking, dimming lights, slow cranking') },
          { text: V('Nestartujte zamrzlou, nafouknutou nebo vytékající baterii!', 'Never jump a frozen, swollen or leaking battery!'), level: 'danger', show: [2.5, 6] }
        ]
      };
    }
  });

  R('jumpstart-tow.position', {
    duration: 6, camera: CAM2, shadow: 6, thumbT: 5,
    build: function (ctx, K) {
      var r = twoCars(ctx, K), from = r.donor.root.position.x;
      return {
        root: r.root,
        update: function (t) { r.donor.root.position.x = from + (1 - K.T.seg(t, 0.3, 3)) * 2.5; },
        cameraPath: function () { return cam2(r); },
        labels: [{ text: V('vozy se nesmí dotýkat', 'cars must not touch'), at: function () { return new THREE.Vector3(r.d.front + 0.45, 0.6, 0.9); }, show: [3, 6], level: 'accent' }],
        captions: [
          { text: V('Dárcovský vůz blízko, ale vozy se nesmí dotýkat', 'Donor car close, but the cars must not touch') },
          { text: V('Oba motory vypnuté, parkovací brzda, spotřebiče vypnuté', 'Both engines off, parking brakes on, all consumers off'), show: [3, 6], level: 'info' }
        ]
      };
    }
  });

  function connectScene(reverse) {
    return {
      duration: 11, camera: CAM2, shadow: 6, thumbT: 9.5,
      build: function (ctx, K) {
        var r = twoCars(ctx, K, 0.6);
        var pts = [r.deadPlus, r.donorPlus, r.donorMinus, r.deadGround];
        var dots = pts.map(function (p) { var m = numDot(K, p); r.root.add(m); return m; });
        var red = cable(K, r.deadPlus, r.donorPlus, true), blk = cable(K, r.donorMinus, r.deadGround, false);
        r.root.add(red); r.root.add(blk);
        function on(i, t) { return reverse ? t < 1.5 + (3 - i) * 2.2 : t > 1 + i * 2.2; }
        return {
          root: r.root,
          update: function (t) {
            dots.forEach(function (d, i) { d.visible = on(i, t); d.scale.setScalar(1 + 0.2 * Math.sin(t * 6)); });
            red.visible = on(0, t) && on(1, t); blk.visible = on(2, t) && on(3, t);
          },
          cameraPath: function () { return cam2(r); },
          labels: [
            { text: reverse ? V('4.', '4.') : V('1. + vybitý vůz', '1. + dead car'), at: function () { return r.deadPlus.clone().add(new THREE.Vector3(0, 0.2, 0)); }, show: function (t) { return on(0, t); }, level: 'danger' },
            { text: reverse ? V('3.', '3.') : V('2. + dárce', '2. + donor'), at: function () { return r.donorPlus.clone().add(new THREE.Vector3(0, 0.2, 0)); }, show: function (t) { return on(1, t); }, level: 'danger' },
            { text: reverse ? V('2.', '2.') : V('3. − dárce', '3. − donor'), at: function () { return r.donorMinus.clone().add(new THREE.Vector3(0, 0.2, 0)); }, show: function (t) { return on(2, t); } },
            { text: reverse ? V('1. kostra pryč první', '1. ground off first') : V('4. kostra / blok motoru', '4. ground / engine block'), at: function () { return r.deadGround.clone().add(new THREE.Vector3(0, 0.2, 0)); }, show: function (t) { return on(3, t); }, level: 'accent' }
          ],
          captions: reverse ? [
            { text: V('Odpojit v OPAČNÉM pořadí: kostra → − dárce → + dárce → + vybitý', 'Disconnect in REVERSE order: ground → donor − → donor + → dead +') },
            { text: V('Svorky se nesmí dotknout navzájem ani karoserie', 'Clamps must not touch each other or the body'), level: 'danger' }
          ] : [
            { text: V('Pořadí: + vybitý → + dárce → − dárce → kostra vybitého vozu', 'Order: dead + → donor + → donor − → dead car ground') },
            { text: V('Poslední svorku na kostru/startovací bod, NE na − baterie (jiskra u baterie)', 'Last clamp on ground / jump point, NOT on the battery − (spark near the battery)'), level: 'danger', show: [6, 11] }
          ]
        };
      }
    };
  }
  R('jumpstart-tow.connect', connectScene(false));
  R('jumpstart-tow.disconnect', connectScene(true));

  R('jumpstart-tow.start', {
    duration: 9, camera: CAM2, shadow: 6, thumbT: 7,
    build: function (ctx, K) {
      var r = twoCars(ctx, K, 0.6);
      r.root.add(cable(K, r.deadPlus, r.donorPlus, true)); r.root.add(cable(K, r.donorMinus, r.deadGround, false));
      var puffD = K.FX.puff(0xcfd5db, 12, 0.08, 0.5); puffD.group.position.set(r.dx + r.dd.front + 0.1, 0.25, 0.35 + 0.5); r.root.add(puffD.group);
      var puffU = K.FX.puff(0xcfd5db, 12, 0.08, 0.5); puffU.group.position.set(r.d.rear - 0.1, 0.25, -0.5); r.root.add(puffU.group);
      var glowM = K.M.clone('lightWhite'); var glows = [-1, 1].map(function (s) { var g = K.mesh(K.G.sphere(0.07, 16), glowM); g.position.set(r.d.front - 0.05, r.d.hoodF - 0.1, s * (r.d.W / 2 - 0.25)); r.root.add(g); return g; });
      return {
        root: r.root,
        update: function (t) {
          puffD.update(t, t > 0.5); puffU.update(t, t > 5.5);
          glows.forEach(function (g) { g.visible = t > 5.5; });
        },
        cameraPath: function () { return cam2(r); },
        captions: [
          { text: V('1. Nastartovat dárce, nechat 2–5 min běžet', '1. Start the donor, let it run 2–5 min') },
          { text: V('2. Startovat vybitý vůz max. 10–15 s, pak pauza 1 min', '2. Crank the dead car max. 10–15 s, then pause 1 min'), show: [3, 9], level: 'info' },
          { text: V('Nestartuje po 3 pokusech? Problém není jen baterie', 'Not starting after 3 tries? It is not just the battery'), show: [6, 9], level: 'accent' }
        ]
      };
    }
  });

  R('jumpstart-tow.booster', {
    duration: 7, camera: { pos: [0.55, 0.5, 0.85], target: [0.1, 0.1, 0.08], fov: 34 }, shadow: 0.7, thumbT: 5,
    build: function (ctx, K) {
      var N = S.n1, rig = N.bay(K, ctx);
      rig.root.updateMatrixWorld(true);
      var pack = new THREE.Group();
      var body = K.mesh(K.G.rbox(0.16, 0.06, 0.09, 0.015), 'toolYellow'); body.position.y = 0.03; pack.add(body);
      var led = K.mesh(K.G.box(0.05, 0.012, 0.002), K.M.clone('hiOk')); led.position.set(0, 0.04, 0.046); pack.add(led);
      pack.position.set(0.32, 0, 0.24); rig.root.add(pack);
      [[rig.posW(), true], [rig.negW(), false]].forEach(function (pp) {
        var a = pack.position.clone().add(new THREE.Vector3(pp[1] ? 0.04 : -0.04, 0.05, -0.04)), b = pp[0];
        var mid = a.clone().lerp(b, 0.5); mid.y = Math.max(a.y, b.y) + 0.1;
        rig.root.add(K.mesh(K.G.tube([a, mid, b.clone().add(new THREE.Vector3(0, 0.03, 0))], 0.006), pp[1] ? 'toolRed' : 'plasticBlack'));
        var j = K.mesh(K.G.rbox(0.02, 0.045, 0.014, 0.004), pp[1] ? 'toolRed' : 'plasticBlack'); j.position.copy(b).add(new THREE.Vector3(0, 0.025, 0)); rig.root.add(j);
      });
      return {
        root: rig.root,
        captions: [
          { text: V('Startovací zdroj (booster): nejdřív svorky, pak zapnout', 'Jump starter pack: clamps first, then switch on') },
          { text: V('Bezpečnější než kabely – nemůže poškodit elektroniku druhého vozu', 'Safer than cables – cannot damage another car\'s electronics'), level: 'ok', show: [2, 7] }
        ]
      };
    }
  });

  R('jumpstart-tow.towEye', {
    duration: 7, camera: { pos: [3.1, 0.75, 1.4], target: [2.0, 0.35, 0.35], fov: 32 }, shadow: 3, thumbT: 5,
    build: function (ctx, K) {
      var root = new THREE.Group(), c = K.car(ctx.vehicle); root.add(c.group);
      var d = c.dims, lh = ctx.vehicle === 'skoda-octavia-rs-tdi';
      var eye = new THREE.Group();
      var ring = K.mesh(K.G.torus(0.035, 0.009, PI * 2, 24), 'chrome'); ring.position.x = 0.14; ring.rotation.y = PI / 2; eye.add(ring);
      var shank = K.mesh(K.G.cylX(0.01, 0.12, 16), 'chrome'); shank.position.x = 0.06; eye.add(shank);
      for (var i = 0; i < 6; i++) { var th = K.mesh(K.G.torus(0.01, 0.0015, PI * 2, 12), 'steelDark'); th.rotation.y = PI / 2; th.position.x = 0.005 + i * 0.006; eye.add(th); }
      var py = d.clr + 0.28, pz = 0.4;
      root.add(eye);
      var arrow = K.FX.rotArrow(0.06, lh ? 'ccw' : 'cw', 0xf5a524, 230, 0.005); arrow.rotation.y = PI / 2; root.add(arrow);
      var cap = K.mesh(K.G.rbox(0.01, 0.06, 0.08, 0.008), 'plasticTex'); root.add(cap);
      return {
        root: root,
        update: function (t) {
          var k = K.T.seg(t, 1.5, 5);
          eye.position.set(d.front + 0.02 + (1 - k) * 0.08, py, pz); eye.rotation.x = (lh ? 1 : -1) * k * PI * 6;
          arrow.position.set(d.front + 0.2, py, pz);
          cap.position.set(d.front + 0.02 + K.T.seg(t, 0, 1.2) * 0.15, py - K.T.seg(t, 0, 1.2) * 0.2, pz);
        },
        cameraPath: function () { return { pos: [d.front + 0.75, py + 0.25, pz + 0.85], target: [d.front + 0.05, py, pz] }; },
        labels: [{ text: lh ? V('LEVOTOČIVÝ závit (ověřit)', 'LEFT-hand thread (verify)') : V('závit dle příručky', 'thread per manual'), at: function () { return new THREE.Vector3(d.front + 0.15, py + 0.12, pz); }, level: lh ? 'danger' : 'accent' }],
        captions: [
          { text: V('Ok na vlečení bývá v sadě nářadí; krytka v nárazníku', 'The towing eye is in the tool kit; cover in the bumper') },
          { text: V('Zašroubovat až na doraz – jinak se může vytrhnout', 'Screw it in fully – otherwise it can tear out'), level: 'warning', show: [3, 7] }
        ]
      };
    }
  });

  R('jumpstart-tow.towRules', {
    duration: 8, camera: { pos: [5, 3.2, 8], target: [0, 0.5, 0], fov: 36 }, shadow: 8, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var a = K.car(ctx.vehicle), b = K.car('generic');
      root.add(a.group); root.add(b.group);
      var gap = 4;
      b.group.position.x = a.dims.front + gap + b.dims.front;
      var rope = K.mesh(K.G.tube([[a.dims.front + 0.05, a.dims.clr + 0.28, 0.4], [a.dims.front + gap / 2, a.dims.clr + 0.15, 0.4], [a.dims.front + gap - 0.05, 0.3, 0.4]], 0.012), 'toolYellow');
      root.add(rope);
      var flag = K.mesh(K.G.box(0.3, 0.3, 0.01), K.M.clone('hiDanger')); flag.position.set(a.dims.front + gap / 2, a.dims.clr + 0.3, 0.4); root.add(flag);
      var amber = K.M.clone('lightAmber');
      var hz = [];
      [[a, 1], [b, -1]].forEach(function (cp) {
        [-1, 1].forEach(function (s) {
          [cp[0].dims.front, cp[0].dims.rear].forEach(function (x) {
            var l = K.mesh(K.G.sphere(0.05, 12), amber); l.position.set(cp[0].group.position.x + x, cp[0].dims.hoodF - 0.05, s * (cp[0].dims.W / 2 - 0.08)); root.add(l); hz.push(l);
          });
        });
      });
      var group = new THREE.Group(); group.add(root);
      return {
        root: group,
        update: function (t) { root.position.x = t * 0.6; hz.forEach(function (l) { l.visible = Math.sin(t * 8) > 0; }); },
        cameraPath: function (t) { var mx = t * 0.6 + a.dims.front + gap / 2; return { pos: [mx + 2.5, 3.2, 9.5], target: [mx, 0.6, 0] }; },
        labels: [{ text: V('vzdálenost dle předpisů (cca 2,5–6 m, ověřit)', 'distance per regulations (approx. 2.5–6 m, verify)'), at: function () { return flag.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.4, 0)); }, level: 'accent' }],
        captions: [
          { text: V('Vlečený vůz: zapalování ZAPNUTO (odemčené řízení), výstražná světla', 'Towed car: ignition ON (steering unlocked), hazard lights on') },
          { text: V('Bez motoru: těžké řízení i brzdy (posilovače nefungují)', 'Engine off: heavy steering and brakes (no power assistance)'), level: 'warning', show: [2.5, 8] },
          { text: V('Pomalu, plynule, lano stále napnuté', 'Slowly, smoothly, keep the rope taut'), level: 'info', show: [5, 8] }
        ]
      };
    }
  });

  R('jumpstart-tow.flatbed', {
    duration: 8, camera: { pos: [7.5, 3.6, 7.5], target: [0, 1.2, 0], fov: 34 }, shadow: 7, thumbT: 6,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var c = K.car(ctx.vehicle, { contactShadow: false }), d = c.dims;
      var bedL = Math.max(6, d.L + 1.2), bedY = 1.05;
      var truck = new THREE.Group();
      var bed = K.mesh(K.G.rbox(bedL, 0.12, 2.3, 0.02), 'steelDark'); bed.position.set(0, bedY, 0); truck.add(bed);
      var chassis = K.mesh(K.G.box(bedL + 1.6, 0.25, 1.0), 'blackOxide'); chassis.position.set(0.6, 0.75, 0); truck.add(chassis);
      var cab = K.mesh(K.G.rbox(1.7, 2.1, 2.3, 0.12), K.M.carPaint(0xe8e8e8)); cab.position.set(bedL / 2 + 1.0, 1.75, 0); truck.add(cab);
      var glass = K.mesh(K.G.box(0.05, 0.8, 2.0), 'glass'); glass.position.set(bedL / 2 + 1.86, 2.3, 0); truck.add(glass);
      [-bedL / 2 + 0.8, bedL / 2 - 0.6, bedL / 2 + 1.2].forEach(function (x) {
        [-1, 1].forEach(function (s) { var w = K.P.wheel({ r: 0.5, w: 0.3, rim: 0.32 }); w.position.set(x, 0.5, s * 1.05); if (s < 0) w.rotation.y = PI; truck.add(w); });
      });
      root.add(truck);
      c.group.position.set(-0.3, bedY + 0.06, 0); root.add(c.group);
      var strapM = K.M.clone('toolYellow');
      c.wheels.forEach(function (w) {
        var p = w.pivot.position.clone().add(c.group.position);
        var s = K.mesh(K.G.tube([[p.x - 0.35, bedY + 0.07, p.z], [p.x - 0.1, p.y + d.wr * 0.9, p.z], [p.x + 0.1, p.y + d.wr * 0.9, p.z], [p.x + 0.35, bedY + 0.07, p.z]], 0.012), strapM); root.add(s);
      });
      return {
        root: root,
        captions: [
          { text: V('Automat a 4×4: přednostně odtah na plošině', 'Automatics and AWD: preferably transport on a flatbed') },
          { text: V('Vlečení s koly na zemi může zničit převodovku / spojku 4×4 – dle příručky', 'Towing with wheels on the ground can destroy the gearbox / AWD coupling – per manual'), level: 'danger', show: [2, 8] }
        ]
      };
    }
  });

  R('jumpstart-tow.after', S.n1.meterScene({
    duration: 7,
    reading: function (t) { return { v: (t < 2 ? 13.2 : 14.2 + 0.05 * Math.sin(t * 3)).toFixed(2) }; },
    captions: [
      { text: V('Po nastartování: napětí 13,8–14,7 V = alternátor dobíjí', 'After starting: 13.8–14.7 V = alternator charging') },
      { text: V('Jeďte 30+ minut nebo dobijte nabíječkou; pak baterii otestujte', 'Drive 30+ minutes or charge with a charger; then test the battery'), level: 'info', show: [2, 7] }
    ]
  }));
})(window.STU);
