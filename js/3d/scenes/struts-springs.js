/* 3D scenes: shock absorber / strut & coil spring replacement.
 * Also defines S.n3 – a shared front-suspension "corner" rig (MacPherson strut, control arm, ball joint,
 * tie rod, anti-roll bar + drop link, hub, disc, caliper, wheel) used by suspension-wear, wheel-bearing
 * and alignment scenes. Helpers are only called at build time, so script order does not matter.
 * Corner coordinates: left-front corner, wheel centre at (0, 0.32, 0), outboard = +Z, front = +X.
 */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var n3 = S.n3 = {};

  /** Coil spring (helix tube) along +Y from 0 to h. */
  n3.helix = function (K, r, wire, coils, h, mat) {
    var pts = [], n = Math.round(coils * 28);
    for (var i = 0; i <= n; i++) {
      var a = i / n * coils * PI * 2;
      var y = i / n * h;
      // closed, ground ends: flatter pitch on the first/last quarter turn
      var e = Math.min(1, Math.min(i, n - i) / 7);
      pts.push([Math.cos(a) * r, y * (0.15 + 0.85 * e) + (i > n / 2 ? h * 0.15 * (1 - e) : 0), Math.sin(a) * r]);
    }
    return K.mesh(K.G.tube(pts, wire, false, n * 2, 8), mat || K.M.clone('jackRed', { color: 0x1d1f22, roughness: 0.4 }));
  };

  /** MacPherson strut assembly, origin = bottom of the knuckle bracket, axis +Y.
   *  userData: setCompress(k 0..1), top (group: nut/mount/bearing/upper seat), spring, damper, rod, bracketBolts[] */
  n3.strut = function (K, o) {
    o = o || {};
    var M = K.M, G = K.G, g = new THREE.Group(); g.name = 'strut';
    var damper = new THREE.Group();
    var bracket = K.mesh(K.G.rbox(0.07, 0.1, 0.06, 0.01), 'blackOxide'); bracket.position.y = 0.05; damper.add(bracket);
    var body = K.mesh(G.cyl(0.026, 0.38, 32), o.newPart ? M.clone('blackOxide', { color: 0x1a3e7a }) : 'blackOxide'); body.position.y = 0.27; damper.add(body);
    var seatL = K.mesh(G.lathe([[0.03, 0], [0.092, 0], [0.095, 0.012], [0.088, 0.012], [0.03, 0.008]], 40), 'blackOxide'); seatL.position.y = 0.2; damper.add(seatL);
    var tab = K.mesh(G.box(0.04, 0.03, 0.006), 'blackOxide'); tab.position.set(0.04, 0.32, 0); damper.add(tab);
    if (o.leak) { var oil = K.mesh(G.cyl(0.0265, 0.12, 24), K.M.clone('oilOld', { opacity: 0.8 })); oil.position.y = 0.36; damper.add(oil); }
    g.add(damper);
    var bolts = [];
    [0.025, 0.075].forEach(function (y) {
      var b = K.P.bolt({ r: 0.007, len: 0.09, mat: 'zinc' }); b.rotation.z = PI / 2; b.position.set(0.05, y, 0); g.add(b); bolts.push(b);
    });
    var rod = K.mesh(G.cyl(0.011, 0.24, 20), 'chrome'); rod.position.y = 0.54; g.add(rod);
    var boot = K.mesh(G.lathe((function () { var p = []; for (var i = 0; i <= 10; i++) p.push([0.03 + (i % 2) * 0.007, i * 0.012]); return p; })(), 24), 'rubber');
    boot.position.y = 0.4; g.add(boot);
    var spring = new THREE.Group(); spring.position.y = 0.212;
    spring.add(n3.helix(K, 0.068, 0.0085, 5.5, 0.31, o.springMat));
    g.add(spring);
    var top = new THREE.Group(); top.name = 'top';
    var seatU = K.mesh(G.lathe([[0.03, 0.012], [0.09, 0.012], [0.093, 0], [0.086, 0], [0.03, 0.004]], 40), 'blackOxide'); seatU.position.y = 0.522; top.add(seatU);
    var bearing = K.mesh(G.torus(0.05, 0.008, PI * 2, 32), 'alu'); bearing.rotation.x = PI / 2; bearing.position.y = 0.542; top.add(bearing);
    var mount = K.mesh(G.lathe([[0.012, 0], [0.075, 0], [0.078, 0.02], [0.06, 0.045], [0.012, 0.045]], 40), 'rubber'); mount.position.y = 0.55; top.add(mount);
    var plate = K.mesh(G.cyl(0.07, 0.006, 40), 'steelDark'); plate.position.y = 0.597; top.add(plate);
    [0, 1, 2].forEach(function (i) {
      var a = i / 3 * PI * 2 + 0.3;
      var st = K.mesh(G.cyl(0.005, 0.04, 12), 'zinc'); st.position.set(Math.cos(a) * 0.05, 0.62, Math.sin(a) * 0.05); top.add(st);
    });
    var nut = K.mesh(G.hex(0.013, 0.012), 'zinc'); nut.position.y = 0.612; top.add(nut);
    g.add(top);
    var springBaseH = 0.31;
    g.userData = {
      damper: damper, rod: rod, spring: spring, top: top, nut: nut, bolts: bolts, tab: tab, boot: boot,
      /** k = 0 free length (installed), 1 = compressed by 6 cm */
      setCompress: function (k) { spring.scale.y = (springBaseH - 0.06 * k) / springBaseH; },
      topY: 0.62
    };
    return g;
  };

  /** Spring compressor (2 clamps). userData.set(lowY, highY) hooks positions on the coil, in strut-local Y. */
  n3.compressor = function (K) {
    var g = new THREE.Group(), clamps = [];
    [-1, 1].forEach(function (side) {
      var c = new THREE.Group();
      var rod = K.mesh(K.G.cyl(0.008, 0.42, 16), 'steel'); c.add(rod);
      var hooks = [0, 1].map(function () {
        var h = new THREE.Group();
        var body = K.mesh(K.G.rbox(0.04, 0.03, 0.03, 0.006), 'toolYellow'); h.add(body);
        var claw = K.mesh(K.G.torus(0.014, 0.005, PI, 12), 'blackOxide'); claw.rotation.y = PI / 2; claw.position.set(-0.02 * side, -0.012, 0); h.add(claw);
        c.add(h); return h;
      });
      var nutT = K.mesh(K.G.hex(0.012, 0.016), 'chrome'); c.add(nutT);
      c.position.set(side * 0.084, 0, 0);
      g.add(c); clamps.push({ c: c, rod: rod, hooks: hooks, nut: nutT });
    });
    g.userData.set = function (lo, hi) {
      clamps.forEach(function (cl) {
        cl.rod.position.y = (lo + hi) / 2 + 0.03;
        cl.hooks[0].position.y = lo; cl.hooks[1].position.y = hi;
        cl.nut.position.y = hi + 0.03;
      });
    };
    g.userData.clamps = clamps;
    return g;
  };

  /** Front-left suspension corner. opts { wheel: true, caliper: true, strutOpts, car (vehicle id for disc size) } */
  n3.corner = function (K, ctx, o) {
    o = o || {};
    var G = K.G, M = K.M, root = new THREE.Group();
    var W0 = new THREE.Vector3(0, 0.32, 0);
    // hub + knuckle
    var hubG = new THREE.Group(); hubG.position.copy(W0); root.add(hubG);
    var flange = K.mesh(G.latheZ([[0.032, 0.012], [0.07, 0.012], [0.072, 0.0], [0.05, -0.008], [0.042, -0.035], [0.032, -0.035]], 48), o.rusty ? 'rust' : 'steelDark');
    hubG.add(flange);
    var knuckle = new THREE.Group(); knuckle.position.copy(W0); root.add(knuckle);
    var kb = K.mesh(G.rbox(0.13, 0.2, 0.06, 0.02), 'castIron'); kb.position.z = -0.065; knuckle.add(kb);
    var kTop = K.mesh(G.rbox(0.06, 0.16, 0.05, 0.012), 'castIron'); kTop.position.set(0, 0.16, -0.085); knuckle.add(kTop);
    var kArm = K.mesh(G.rbox(0.14, 0.04, 0.035, 0.01), 'castIron'); kArm.position.set(-0.09, -0.02, -0.08); knuckle.add(kArm);
    var kLow = K.mesh(G.rbox(0.06, 0.12, 0.04, 0.01), 'castIron'); kLow.position.set(0, -0.14, -0.06); knuckle.add(kLow);
    // ABS sensor
    var abs = K.mesh(G.cylZ(0.009, 0.04, 16), 'plasticBlack'); abs.position.set(0.05, -0.06, -0.1); knuckle.add(abs);
    var absWire = K.mesh(G.tube([[0.05, -0.06, -0.12], [0.08, 0.05, -0.16], [0.1, 0.35, -0.18]], 0.004), 'plasticBlack'); knuckle.add(absWire);
    // drive shaft + CV boot
    var cv = K.mesh(G.lathe([[0.034, 0], [0.046, 0.016], [0.034, 0.032], [0.046, 0.048], [0.034, 0.064], [0.042, 0.08], [0.02, 0.11]], 32), 'rubber');
    cv.rotation.x = -PI / 2; cv.position.set(0, 0.32, -0.1); root.add(cv);
    var shaft = K.mesh(G.cylZ(0.014, 0.32, 16), 'steelDark'); shaft.position.set(0, 0.32, -0.36); root.add(shaft);
    // strut on top of the knuckle
    var strut = n3.strut(K, o.strutOpts); strut.position.set(0, 0.44, -0.09); strut.rotation.z = -0.04; root.add(strut);
    // strut tower (body)
    var paint = K.M.carPaint((K.carSpec(ctx.vehicle) || {}).paint || 0x5f7fa6);
    var tower = K.mesh(G.rbox(0.36, 0.035, 0.36, 0.012), paint); tower.position.set(0, 1.085, -0.1); root.add(tower);
    var wing = K.mesh(G.rbox(0.5, 0.36, 0.03, 0.012), paint); wing.position.set(0, 0.92, -0.3); root.add(wing);
    // lower control arm (A-arm) with bushings, ball joint
    var bj = new THREE.Vector3(0, 0.15, -0.04), fb = new THREE.Vector3(0.2, 0.15, -0.42), rb = new THREE.Vector3(-0.16, 0.16, -0.45);
    var arm = new THREE.Group(); root.add(arm);
    arm.add(K.mesh(G.tube([bj, bj.clone().lerp(fb, 0.5).add(new THREE.Vector3(0.02, 0, 0)), fb], 0.016), 'blackOxide'));
    arm.add(K.mesh(G.tube([bj, bj.clone().lerp(rb, 0.5).add(new THREE.Vector3(-0.02, 0, 0)), rb], 0.018), 'blackOxide'));
    var plateA = K.mesh(G.extrude([[bj.x, -bj.z], [fb.x - 0.04, -fb.z + 0.03], [rb.x + 0.04, -rb.z + 0.03]], 0.006, 0), 'blackOxide');
    plateA.rotation.x = -PI / 2; plateA.position.y = 0.15; arm.add(plateA);
    var bushings = [fb, rb].map(function (p, i) {
      var b = new THREE.Group(); b.position.copy(p);
      var outer = K.mesh(G.cylX(0.032, 0.06, 24), 'steelDark'); b.add(outer);
      var rub = K.mesh(G.cylX(0.026, 0.062, 24), 'rubber'); b.add(rub);
      var inner = K.mesh(G.cylX(0.011, 0.08, 16), 'zinc'); b.add(inner);
      if (i === 1) b.rotation.y = PI / 2;
      root.add(b); return b;
    });
    var ball = new THREE.Group(); ball.position.copy(bj); root.add(ball);
    ball.add(K.mesh(G.sphere(0.024, 20), 'blackOxide'));
    var bjBoot = K.mesh(G.lathe([[0.022, 0], [0.026, 0.012], [0.012, 0.03]], 20), 'rubber'); ball.add(bjBoot);
    var bjStud = K.mesh(G.cyl(0.009, 0.06, 16), 'zinc'); bjStud.position.y = 0.04; ball.add(bjStud);
    var subframe = K.mesh(G.rbox(0.7, 0.07, 0.09, 0.015), 'blackOxide'); subframe.position.set(0.02, 0.15, -0.5); root.add(subframe);
    // tie rod: outer end at knuckle steering arm (rear, -X), inner to rack
    var te = new THREE.Vector3(-0.155, 0.3, -0.08), ti = new THREE.Vector3(-0.155, 0.3, -0.46);
    var tieEnd = new THREE.Group(); tieEnd.position.copy(te); root.add(tieEnd);
    tieEnd.add(K.mesh(G.sphere(0.022, 18), 'blackOxide'));
    var teBody = K.mesh(G.cylZ(0.016, 0.07, 16), 'blackOxide'); teBody.position.z = -0.04; tieEnd.add(teBody);
    var teBoot = K.mesh(G.lathe([[0.02, 0], [0.024, 0.01], [0.01, 0.025]], 16), 'rubber'); teBoot.position.y = 0.02; tieEnd.add(teBoot);
    var teNut = K.mesh(G.hex(0.011, 0.01), 'zinc'); teNut.position.y = 0.06; tieEnd.add(teNut);
    var lock = K.mesh(G.hex(0.016, 0.014), 'zinc'); lock.rotation.x = PI / 2; lock.position.set(te.x, te.y, te.z - 0.085); root.add(lock);
    var tieRod = K.mesh(G.cylZ(0.009, 0.3, 16), 'steel'); tieRod.position.set(te.x, te.y, (te.z + ti.z) / 2 - 0.04); root.add(tieRod);
    var rackBoot = K.mesh(G.lathe((function () { var p = []; for (var i = 0; i <= 10; i++) p.push([0.022 + (i % 2) * 0.01, i * 0.012]); return p; })(), 20), 'rubber');
    rackBoot.rotation.x = -PI / 2; rackBoot.position.set(ti.x, ti.y, ti.z); root.add(rackBoot);
    var rack = K.mesh(G.cylZ(0.03, 0.2, 24), 'aluCast'); rack.position.set(ti.x, ti.y, ti.z - 0.2); root.add(rack);
    // anti-roll bar + drop link (to strut tab)
    var barEnd = new THREE.Vector3(0.14, 0.24, -0.2);
    var bar = K.mesh(G.tube([[0.2, 0.22, -0.75], [0.2, 0.22, -0.4], [0.17, 0.235, -0.27], barEnd], 0.013), 'blackOxide'); root.add(bar);
    var linkTop = new THREE.Vector3(0.085, 0.75, -0.09);
    var link = new THREE.Group(); root.add(link);
    var linkRod = K.mesh(G.tube([barEnd.clone().add(new THREE.Vector3(0, 0.03, 0)), linkTop.clone().add(new THREE.Vector3(0, -0.03, 0))], 0.0075, false, 2, 10), 'steelDark'); link.add(linkRod);
    var linkBalls = [barEnd, linkTop].map(function (p) {
      var b = new THREE.Group(); b.position.copy(p);
      b.add(K.mesh(G.sphere(0.017, 16), 'blackOxide'));
      var bt = K.mesh(G.lathe([[0.016, 0], [0.019, 0.008], [0.008, 0.02]], 16), 'rubber'); bt.rotation.x = PI / 2; b.add(bt);
      var nt = K.mesh(G.hex(0.009, 0.008), 'zinc'); nt.rotation.x = PI / 2; nt.position.z = 0.03; b.add(nt);
      link.add(b); return b;
    });
    // brake disc + caliper
    var spec = K.carSpec(ctx.vehicle) || {};
    var discR = Math.min(0.17, (spec.wr || 0.32) * 0.48);
    var brake = new THREE.Group(); brake.position.copy(W0); root.add(brake);
    var disc = K.P.brakeDisc({ r: discR }); disc.position.z = -0.027; brake.add(disc);
    var caliper = null;
    if (o.caliper !== false) { caliper = K.P.caliperFloating({ discR: discR, angle: PI * 0.92 }); caliper.position.z = -0.027; brake.add(caliper); }
    var wheel = null;
    if (o.wheel !== false) {
      wheel = K.P.wheel({ r: 0.32, w: 0.215, rim: 0.225, inner: false, rimMat: (spec.rim || 'rimSilver') });
      wheel.position.set(W0.x, W0.y, -0.038); root.add(wheel);
    }
    var nutAxle = K.mesh(G.hex(0.017, 0.022), 'zinc'); nutAxle.rotation.x = PI / 2; nutAxle.position.set(0, 0.32, 0.035); root.add(nutAxle);
    var floor = K.FX.contactShadow(1.0, 1.2, 0.35); floor.position.z = -0.2; root.add(floor);
    return {
      root: root, strut: strut, knuckle: knuckle, hub: hubG, brake: brake, disc: disc, caliper: caliper, wheel: wheel, arm: arm, ball: ball,
      bushings: bushings, tieEnd: tieEnd, tieRod: tieRod, lock: lock, rack: rack, link: link, linkBalls: linkBalls, bar: bar, tower: tower,
      abs: abs, axleNut: nutAxle, cv: cv, wheelCenter: W0.clone()
    };
  };

  n3.wp = function (obj, off) {
    var v = obj.getWorldPosition(new THREE.Vector3());
    if (off) v.add(new THREE.Vector3(off[0], off[1], off[2]));
    return v;
  };

  /** Car on axle stands with the front-left wheel removed (for "lift & remove wheel" steps). */
  n3.liftedCar = function (K, ctx) {
    var rig = S.liftRig(ctx, K);
    rig.set({ lift: rig.restA / rig.maxA, standIn: 1, jackDrop: 0.012 });
    var fw = rig.car.wheels.filter(function (w) { return w.side > 0 && w.axle === 'f'; })[0];
    fw.wheel.visible = false;
    return { rig: rig, fw: fw };
  };
  n3.liftCam = function (ctx) {
    var big = ctx.vehicle === 'citroen-jumper-22hdi';
    return big ? { pos: [3.6, 1.7, 6.6], target: [0.6, 0.5, 0.6], fov: 34 } : { pos: [2.4, 1.15, 4.6], target: [0.6, 0.35, 0.6], fov: 34 };
  };
  n3.isAbc = function (v) { return v === 'mb-cl500-c216'; };
  n3.isAir = function (v) { return v === 'volvo-xc60-b4'; };

  var CAM_CORNER = { pos: [0.95, 0.85, 1.25], target: [-0.02, 0.55, -0.12], fov: 38 };

  /* =============================================================== scenes */

  R('struts-springs.symptoms', {
    duration: 8, camera: { pos: [3.4, 1.3, 5.2], target: [0.2, 0.55, 0], fov: 34 }, shadow: 3.5, thumbT: 2.2,
    build: function (ctx, K) {
      var c = K.car(ctx.vehicle), root = new THREE.Group(); root.add(c.group);
      var big = ctx.vehicle === 'citroen-jumper-22hdi';
      var st = n3.strut(K, { leak: true });
      st.position.set(c.dims.xf + 0.25, 0, c.dims.W / 2 + 0.6); st.scale.setScalar(1.6); root.add(st);
      return {
        root: root,
        update: function (t) {
          // bump at t=1 (healthy, damped) and t=4.5 (worn, keeps bouncing)
          var y = 0, p = 0;
          if (t > 1 && t < 4) { var a = t - 1; y = 0.035 * Math.exp(-a * 3.2) * Math.sin(a * 11); }
          if (t > 4.5) { var b = t - 4.5; y = 0.045 * Math.exp(-b * 0.7) * Math.sin(b * 9); p = 0.012 * Math.exp(-b * 0.7) * Math.sin(b * 9 + 1); }
          c.body.position.y = y; c.body.rotation.z = p;
        },
        cameraPath: big ? function () { return { pos: [5.2, 1.9, 7.2], target: [0.3, 0.9, 0], fov: 34 }; } : null,
        labels: [
          { text: V('olej na tlumiči = vadný', 'oil on the damper = faulty'), at: function () { return n3.wp(st, [0, 0.62, 0]); }, level: 'danger' }
        ],
        captions: [
          { text: V('Zdravý tlumič: po nerovnosti 1–2 kmity a klid', 'Healthy damper: 1–2 oscillations after a bump, then calm'), show: [0, 4.4], level: 'ok' },
          { text: V('Vadný tlumič: vůz se houpe, „plave“, delší brzdná dráha', 'Worn damper: the car keeps bouncing, floats, longer braking distance'), show: [4.4, 8], level: 'danger' },
          { text: V('Další znaky: klepání, olej na tělese, nerovnoměrně ojetá pneu', 'Other signs: knocking, oil on the body, cupped tyre wear'), show: [2, 8] }
        ]
      };
    }
  });

  R('struts-springs.parts', {
    duration: 8, camera: { pos: [0.75, 0.75, 1.35], target: [0, 0.38, 0], fov: 36 }, shadow: 1.2, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var st = n3.strut(K, { newPart: true }); root.add(st);
      var bench = K.mesh(K.G.rbox(1.2, 0.04, 0.6, 0.01), 'wood'); bench.position.y = -0.02; root.add(bench);
      var ud = st.userData;
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 1, 3) - T.seg(t, 6.5, 7.8);
          ud.top.position.y = k * 0.22;
          ud.spring.position.x = k * -0.22; ud.spring.position.y = 0.212 + k * 0.05;
          ud.boot.position.x = k * 0.18;
          st.rotation.y = t * 0.15;
        },
        labels: [
          { text: V('horní ložisko + uložení', 'top mount + bearing'), at: function () { return n3.wp(ud.top, [0, 0.6, 0]); }, show: [2.5, 6.5] },
          { text: V('vinutá pružina', 'coil spring'), at: function () { return n3.wp(ud.spring, [0, 0.33, 0]); }, show: [2.5, 6.5] },
          { text: V('doraz + prachovka', 'bump stop + dust boot'), at: function () { return n3.wp(ud.boot, [0, 0.14, 0]); }, show: [2.8, 6.5] },
          { text: V('tlumič', 'damper'), at: function () { return n3.wp(st, [0, 0.3, 0.03]); }, show: [2.8, 6.5] }
        ],
        captions: [
          { text: V('Tlumiče VŽDY v páru na nápravě (levý + pravý)', 'Dampers ALWAYS in pairs per axle (left + right)'), level: 'accent' },
          { text: V('Zvažte i nová horní uložení, ložiska, dorazy a prachovky', 'Consider new top mounts, bearings, bump stops and boots too'), show: [3, 8] }
        ]
      };
    }
  });

  R('struts-springs.lift', {
    duration: 6, camera: { pos: [2.4, 1.15, 4.6], target: [0.6, 0.35, 0.6], fov: 34 }, shadow: 3, thumbT: 3,
    build: function (ctx, K) {
      var L = n3.liftedCar(K, ctx);
      var cam = n3.liftCam(ctx);
      return {
        root: L.rig.root,
        cameraPath: function () { return cam; },
        labels: [{ text: V('kolo dole', 'wheel off'), at: function () { return n3.wp(L.fw.pivot, [0, 0, 0.15]); }, level: 'accent' }],
        captions: [
          { text: V('Zvednout podle návodu „Bezpečné zvednutí vozu“ – stojany, test stability', 'Lift per "Safely lifting the car" – stands, stability test') },
          { text: V('Nikdy pod vůz jen na heveru!', 'Never under a car on a jack alone!'), level: 'danger' }
        ]
      };
    }
  });

  function cornerScene(id, dur, captions, labels, anim, opts) {
    opts = opts || {};
    R(id, {
      duration: dur, camera: opts.camera || CAM_CORNER, shadow: 1.6, thumbT: opts.thumbT != null ? opts.thumbT : dur * 0.5,
      build: function (ctx, K) {
        var rig = n3.corner(K, ctx, opts.corner || { wheel: false });
        var extra = opts.extra ? opts.extra(ctx, K, rig) : {};
        return {
          root: rig.root,
          update: function (t) { if (anim) anim(t, rig, K, extra, ctx); },
          labels: typeof labels === 'function' ? labels(rig, extra, ctx) : (labels || []),
          captions: typeof captions === 'function' ? captions(ctx) : captions,
          cameraPath: opts.cameraPath ? function (t) { return opts.cameraPath(t, rig, extra); } : null
        };
      }
    });
  }
  n3.cornerScene = cornerScene;
  n3.CAM_CORNER = CAM_CORNER;

  cornerScene('struts-springs.disconnect', 9, function (ctx) {
    var c = [
      { text: V('1. Držák brzdové hadice a kabel ABS uvolnit ze vzpěry', '1. Release the brake-hose bracket and ABS wire from the strut'), show: [0, 3] },
      { text: V('2. Spojovací tyč stabilizátoru: kontra na čepu, povolit matici', '2. Anti-roll bar link: counter-hold the stud, undo the nut'), show: [3, 6.5] },
      { text: V('Třmen nikdy nevisí na hadici – zavěsit na drát', 'Never let the caliper hang on its hose – hang it on wire'), show: [6.5, 9], level: 'danger' }
    ];
    if (n3.isAbc(ctx.vehicle) || n3.isAir(ctx.vehicle)) c.push({ text: n3.isAbc(ctx.vehicle) ? V('CL 500: vzpěry ABC jsou hydraulické – viz návod ABC', 'CL 500: ABC struts are hydraulic – see the ABC tutorial') : V('XC60: vzduchové vzpěry – viz návod Vzduchový podvozek', 'XC60: air struts – see the air suspension tutorial'), level: 'danger' });
    return c;
  }, function (rig) {
    return [
      { text: V('spojovací tyč', 'drop link'), at: function () { return n3.wp(rig.linkBalls[1], [0, 0.04, 0.02]); }, show: [3, 6.5], level: 'accent' },
      { text: V('kabel ABS', 'ABS wire'), at: function () { return n3.wp(rig.abs, [0.05, 0.25, -0.05]); }, show: [0, 3] }
    ];
  }, function (t, rig, K, ex) {
    var T = K.T;
    var k = T.seg(t, 3.6, 5.6);
    ex.wrench.visible = t > 3 && t < 6.5;
    ex.wrench.rotation.z = -0.4 + Math.sin(t * 6) * 0.35 * (k < 1 ? 1 : 0);
    rig.linkBalls[1].children[2].position.z = 0.03 + k * 0.04;
    rig.link.position.y = -T.seg(t, 5.6, 6.4) * 0.05;
  }, {
    extra: function (ctx, K, rig) {
      var w = K.P.spanner(0.16, 0.009); w.rotation.x = -PI / 2;
      var g = new THREE.Group(); g.add(w); g.position.copy(rig.linkBalls[1].position).add(new THREE.Vector3(0, 0, 0.035)); rig.root.add(g);
      return { wrench: g };
    }
  });

  cornerScene('struts-springs.lowerBolts', 8, [
    { text: V('Spodní šrouby vzpěra–těhlice: nejdřív označit polohu (odklon!)', 'Strut-to-knuckle bolts: mark the position first (camber!)') },
    { text: V('Často jsou to šrouby na jedno použití – nové šrouby a matice', 'Often single-use bolts – fit new bolts and nuts'), show: [3, 8], level: 'accent' }
  ], function (rig) {
    return [{ text: V('šrouby vzpěry', 'strut bolts'), at: function () { return n3.wp(rig.strut, [0.12, 0.05, 0]); }, level: 'accent' }];
  }, function (t, rig, K) {
    var T = K.T;
    rig.strut.userData.bolts.forEach(function (b, i) {
      var k = T.seg(t, 1 + i * 1.6, 2.4 + i * 1.6);
      b.position.x = 0.05 + k * 0.14;
      b.children[0].rotation.y = k * 12;
    });
    rig.knuckle.position.y = 0.32 - T.seg(t, 4.6, 6) * 0.06;
    rig.hub.position.y = rig.knuckle.position.y; rig.brake.position.y = rig.knuckle.position.y;
  }, { corner: { wheel: false } });

  cornerScene('struts-springs.topNuts', 8, [
    { text: V('Horní matice (motorový prostor): vzpěru přidržet – spadne!', 'Top nuts (engine bay): hold the strut – it will drop!') },
    { text: V('Prostřední matici pístnice NEPOVOLOVAT, dokud není pružina stažená', 'Do NOT undo the centre rod nut until the spring is compressed'), level: 'danger', show: [2, 8] }
  ], function (rig) {
    return [{ text: V('3 horní matice', '3 top nuts'), at: function () { return n3.wp(rig.tower, [0, 0.08, 0]); }, level: 'accent' },
      { text: V('✖ středová matice', '✖ centre nut'), at: function () { return n3.wp(rig.strut.userData.nut, [0, 0.16, 0]); }, level: 'danger', show: [2, 8] }];
  }, function (t, rig, K) {
    var T = K.T;
    rig.tower.material = rig.tower.material;
    var drop = T.seg(t, 4.5, 6.5);
    rig.strut.position.y = 0.44 - drop * 0.12;
    rig.strut.position.x = drop * 0.08;
    rig.strut.rotation.z = -0.04 - drop * 0.25;
  }, { corner: { wheel: false }, camera: { pos: [0.75, 1.35, 1.1], target: [0, 0.8, -0.1], fov: 40 } });

  /* ---------------------------------------------------------- bench scenes */
  function benchScene(id, dur, build, opts) {
    opts = opts || {};
    R(id, {
      duration: dur, camera: opts.camera || { pos: [0.8, 0.78, 1.35], target: [0, 0.42, 0], fov: 38 }, shadow: 1.1, thumbT: opts.thumbT != null ? opts.thumbT : dur * 0.5,
      build: function (ctx, K) {
        var root = new THREE.Group();
        var vice = new THREE.Group();
        var jaw = K.mesh(K.G.rbox(0.16, 0.08, 0.12, 0.01), 'toolBlue'); jaw.position.y = 0.04; vice.add(jaw);
        var base = K.mesh(K.G.rbox(0.5, 0.03, 0.4, 0.01), 'steelDark'); base.position.y = -0.015; vice.add(base);
        root.add(vice);
        var st = n3.strut(K, opts.strutOpts); st.position.y = 0.06; root.add(st);
        var res = build(ctx, K, root, st);
        res.root = root;
        return res;
      }
    });
  }
  n3.benchScene = benchScene;

  benchScene('struts-springs.compress', 10, function (ctx, K, root, st) {
    var T = K.T, comp = n3.compressor(K); comp.position.y = 0.06; root.add(comp);
    var ud = st.userData;
    var rat = K.P.ratchet(0.2, 0.012); root.add(rat);
    return {
      update: function (t) {
        var k = T.seg(t, 2, 7.5);
        ud.setCompress(k);
        var hi = 0.212 + (0.31 - 0.06 * k) * 0.88, lo = 0.212 + 0.04;
        comp.userData.set(lo, hi);
        var side = Math.floor(t * 1.2) % 2 ? 1 : -1;
        rat.position.set(side * 0.084, hi + 0.12, 0);
        rat.rotation.y = Math.sin(t * 7) * 0.6 + (side > 0 ? 0 : PI);
        rat.visible = t > 2 && t < 7.5;
      },
      labels: [
        { text: V('mezera = pružina volná', 'gap = spring free'), at: function () { return n3.wp(st, [0.1, 0.53, 0]); }, show: [7.5, 10], level: 'ok' },
        { text: V('háky naproti sobě, min. 3 závity', 'hooks opposite, at least 3 coils'), at: function () { return n3.wp(st, [-0.13, 0.35, 0]); }, show: [0.5, 4], level: 'accent' }
      ],
      captions: [
        { text: V('⚠ PRUŽINA = OBROVSKÁ ENERGIE. Jen certifikovaný stahovák, nikdy improvizace!', '⚠ SPRING = HUGE STORED ENERGY. Certified compressor only, never improvise!'), level: 'danger' },
        { text: V('Stahovat střídavě po malých krocích, ručně – NIKDY rázovým utahovákem', 'Compress alternately in small steps, by hand – NEVER with an impact gun'), show: [2, 10] },
        { text: V('Nestůjte v ose pružiny, brýle a rukavice', 'Do not stand in line with the spring, glasses and gloves'), show: [5, 10], level: 'danger' }
      ]
    };
  }, { thumbT: 6 });

  benchScene('struts-springs.topMount', 9, function (ctx, K, root, st) {
    var T = K.T, comp = n3.compressor(K); comp.position.y = 0.06; root.add(comp);
    var ud = st.userData; ud.setCompress(1);
    comp.userData.set(0.252, 0.212 + 0.25 * 0.88);
    var hexKey = K.mesh(K.G.cyl(0.003, 0.12, 6), 'blackOxide'); root.add(hexKey);
    var ring = K.P.spanner(0.17, 0.013); root.add(ring);
    return {
      update: function (t) {
        var k = T.seg(t, 1, 3.5);
        ring.position.set(0, 0.06 + 0.612 + 0.005, 0); ring.rotation.y = -k * 1.5;
        ring.visible = t < 3.8;
        hexKey.position.set(0, 0.06 + 0.65, 0); hexKey.visible = t < 3.8;
        var up = T.seg(t, 4, 6.5);
        ud.top.position.y = up * 0.2;
        ud.nut.position.y = 0.612 + T.seg(t, 3, 4) * 0.05;
      },
      labels: [{ text: V('kontra imbusem v pístnici', 'counter-hold the rod with a hex key'), at: function () { return n3.wp(st, [0, 0.72, 0]); }, show: [0.5, 3.8], level: 'accent' }],
      captions: [
        { text: V('Matici povolit jen se staženou pružinou', 'Undo the nut only with the spring compressed'), level: 'danger' },
        { text: V('Sundat: matice → uložení → ložisko → horní miska', 'Remove: nut → mount → bearing → upper seat'), show: [3.8, 9] }
      ]
    };
  });

  benchScene('struts-springs.assemble', 9, function (ctx, K, root, st) {
    var T = K.T, ud = st.userData;
    st.visible = false;
    var nw = n3.strut(K, { newPart: true }); nw.position.y = 0.06; root.add(nw);
    var nu = nw.userData; nu.setCompress(1);
    return {
      update: function (t) {
        var sp = T.seg(t, 0.5, 3), tp = T.seg(t, 3.2, 5.5);
        nu.spring.position.y = 0.212 + (1 - sp) * 0.3; nu.spring.rotation.y = (1 - sp) * 1.2;
        nu.top.position.y = (1 - tp) * 0.25;
        nu.boot.position.y = 0.4 + (1 - T.seg(t, 0, 0.6)) * 0.4;
      },
      labels: [
        { text: V('konec závitu do dorazu v misce', 'spring end against the seat stop'), at: function () { return n3.wp(nw, [0.09, 0.23, 0]); }, show: [2.5, 9], level: 'accent' },
        { text: V('šipka/značka uložení dle polohy', 'mount mark aligned'), at: function () { return n3.wp(nu.top, [0, 0.66, 0]); }, show: [5.5, 9] }
      ],
      captions: [
        { text: V('Prachovku a doraz přesunout / vyměnit', 'Move / replace the boot and bump stop') },
        { text: V('Pružina musí sedět konci v dorazech obou misek', 'Both spring ends must sit against the stops in the seats'), show: [2.5, 9], level: 'accent' }
      ]
    };
  });

  benchScene('struts-springs.release', 9, function (ctx, K, root, st) {
    var T = K.T, comp = n3.compressor(K); comp.position.y = 0.06; root.add(comp);
    var ud = st.userData, tw = K.P.torqueWrench(0.3); root.add(tw);
    return {
      update: function (t) {
        var k = 1 - T.seg(t, 1, 5);
        ud.setCompress(k);
        comp.userData.set(0.252, 0.212 + (0.31 - 0.06 * k) * 0.88);
        comp.visible = t < 5.8;
        tw.position.set(0, 0.06 + 0.64, 0); tw.rotation.y = -0.3 - T.seg(t, 6.2, 7.6) * 0.5; tw.visible = t > 6;
      },
      labels: [{ text: V('matice pístnice – moment dle příručky', 'rod nut – torque per manual'), at: function () { return n3.wp(st, [0, 0.74, 0]); }, show: [6, 9], level: 'accent' }],
      captions: [
        { text: V('Povolovat střídavě a pomalu, pružina musí dosednout do misek', 'Release alternately and slowly, the spring must seat in both seats'), level: 'danger', show: [0, 6] },
        { text: V('Matici pístnice dotáhnout momentem (kontra v pístnici)', 'Torque the rod nut (counter-hold the rod)'), show: [6, 9] }
      ]
    };
  });

  cornerScene('struts-springs.refit', 10, [
    { text: V('Vzpěru vložit, horní matice rukou, spodní šrouby dle značek', 'Fit the strut, top nuts by hand, lower bolts to the marks') },
    { text: V('Pryžová uložení dotahovat při zatížení (vůz na kolech / zvednuté rameno)', 'Tighten rubber bushings under load (car on its wheels / arm raised)'), show: [4, 10], level: 'accent' },
    { text: V('Po výměně vzpěr: geometrie!', 'After replacing struts: wheel alignment!'), show: [7, 10], level: 'danger' }
  ], function (rig) {
    return [{ text: V('moment dle příručky', 'torque per manual'), at: function () { return n3.wp(rig.strut, [0.15, 0.06, 0]); }, show: [2, 7], level: 'accent' }];
  }, function (t, rig, K, ex) {
    var T = K.T, up = 1 - T.seg(t, 0.5, 2.8);
    rig.strut.position.y = 0.44 - up * 0.12; rig.strut.position.x = up * 0.08; rig.strut.rotation.z = -0.04 - up * 0.25;
    ex.tw.visible = t > 3 && t < 7;
    ex.tw.rotation.y = -0.3 - T.seg((t - 3) % 2, 0.3, 1.2) * 0.6;
  }, {
    corner: { wheel: false },
    extra: function (ctx, K, rig) {
      var tw = K.P.torqueWrench(0.4); tw.rotation.z = -PI / 2; tw.rotation.order = 'ZYX';
      var g = new THREE.Group(); g.add(tw); g.position.set(0.19, 0.5, -0.09); rig.root.add(g);
      return { tw: g };
    }
  });

  R('struts-springs.align', {
    duration: 7, camera: { pos: [3.2, 2.4, 4.4], target: [0, 0.4, 0], fov: 36 }, shadow: 3.5, thumbT: 3,
    build: function (ctx, K) {
      return (S.n3.alignRig ? S.n3.alignRig(ctx, K, { caption: V('Po výměně tlumičů/pružin: seřízení geometrie v dílně', 'After replacing dampers/springs: wheel alignment in a workshop') }) : { root: new THREE.Group() });
    }
  });

  /* Jumper rear: leaf spring + separate damper */
  R('struts-springs.leaf', {
    duration: 8, camera: { pos: [0.35, 0.95, 1.7], target: [0, 0.38, -0.3], fov: 42 }, shadow: 1.8, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, G = K.G, root = new THREE.Group();
      var axle = K.mesh(G.cylZ(0.04, 1.6, 24), 'blackOxide'); axle.position.set(0, 0.34, -0.7); root.add(axle);
      var leaves = new THREE.Group(); root.add(leaves);
      for (var i = 0; i < 3; i++) {
        var len = 1.3 - i * 0.3, pts = [];
        for (var k = 0; k <= 20; k++) { var x = -len / 2 + len * k / 20; pts.push([x, 0.3 - i * 0.012 + 0.08 * Math.pow(x / 0.7, 2), -0.25]); }
        leaves.add(K.mesh(G.tube(pts, 0.006, false, 40, 4), 'blackOxide'));
        var plate = K.mesh(G.box(len, 0.01, 0.06), 'blackOxide'); plate.position.set(0, 0.29 - i * 0.012, -0.25); plate.visible = false; leaves.add(plate);
      }
      var ub = [-1, 1].map(function (s) { var u = K.mesh(G.torus(0.035, 0.006, PI, 12), 'zinc'); u.position.set(s * 0.06, 0.32, -0.25); u.rotation.y = PI / 2; root.add(u); return u; });
      var damper = new THREE.Group(); root.add(damper);
      var db = K.mesh(G.cyl(0.024, 0.3, 24), 'blackOxide'); db.position.y = 0.2; damper.add(db);
      var dr = K.mesh(G.cyl(0.01, 0.2, 16), 'chrome'); dr.position.y = 0.43; damper.add(dr);
      damper.position.set(0.18, 0.12, -0.12); damper.rotation.z = -0.3;
      var frame = K.mesh(G.rbox(1.6, 0.1, 0.06, 0.01), 'blackOxide'); frame.position.set(0, 0.62, -0.25); root.add(frame);
      [-0.65, 0.65].forEach(function (x) { var h = K.mesh(G.rbox(0.05, 0.25, 0.05, 0.01), 'blackOxide'); h.position.set(x, 0.48, -0.25); root.add(h); });
      return {
        root: root,
        update: function (t) { damper.position.y = 0.12 + Math.sin(t * 2) * 0.02; },
        labels: [
          { text: V('listová pružina', 'leaf spring'), at: [0.35, 0.36, -0.2], level: 'accent' },
          { text: V('tlumič', 'damper'), at: function () { return n3.wp(damper, [0, 0.45, 0]); } },
          { text: V('třmeny (U-šrouby)', 'U-bolts'), at: function () { return n3.wp(ub[1], [0, 0.06, 0]); } }
        ],
        captions: [
          { text: V('Jumper vzadu: listové pera + samostatné tlumiče (ověřit)', 'Jumper rear: leaf springs + separate dampers (verify)') },
          { text: V('Tlumič vyměníte bez stahováku – 2 šrouby', 'The damper changes without a compressor – 2 bolts'), show: [2, 8], level: 'ok' },
          { text: V('Listová pera / třmeny: dílna (velké síly, rez)', 'Leaf springs / U-bolts: workshop (huge forces, rust)'), show: [4.5, 8], level: 'danger' }
        ]
      };
    }
  });

  /* CL 500 / XC60 info scene */
  R('struts-springs.special', {
    duration: 6, camera: { pos: [0.9, 0.8, 1.3], target: [0, 0.55, -0.1], fov: 38 }, shadow: 1.6, thumbT: 2,
    build: function (ctx, K) {
      var rig = n3.corner(K, ctx, { wheel: false });
      var abc = n3.isAbc(ctx.vehicle);
      var line = K.mesh(K.G.tube([[0.03, 0.95, -0.12], [0.12, 1.0, -0.25], [0.25, 1.05, -0.45]], 0.006), abc ? 'steel' : 'plasticBlack');
      rig.root.add(line);
      rig.strut.userData.spring.visible = false;
      var bag = K.mesh(K.G.lathe([[0.03, 0], [0.075, 0.03], [0.085, 0.12], [0.075, 0.2], [0.03, 0.23]], 32), abc ? 'blackOxide' : 'rubber');
      bag.position.set(0, 0.44 + 0.28, -0.09); rig.root.add(bag);
      return {
        root: rig.root,
        update: function (t) { bag.scale.setScalar(1 + Math.sin(t * 3) * 0.02); },
        labels: [{ text: abc ? V('ABC vzpěra – hydraulika 200 bar', 'ABC strut – 200 bar hydraulics') : V('vzduchový měch', 'air spring'), at: function () { return n3.wp(bag, [0, 0.26, 0]); }, level: 'danger' }],
        captions: [
          { text: abc ? V('CL 500: ABC vzpěry nejsou klasické tlumiče – viz návod ABC', 'CL 500: ABC struts are not conventional dampers – see the ABC tutorial')
            : V('XC60: vzduchové vzpěry – viz návod Vzduchový podvozek', 'XC60: air struts – see the air suspension tutorial'), level: 'danger' },
          { text: V('Systém pod tlakem: odtlakovat dle WIS / VIDA, pak teprve povolovat', 'Pressurised system: depressurise per WIS / VIDA before undoing anything') }
        ]
      };
    }
  });
})(window.STU);
