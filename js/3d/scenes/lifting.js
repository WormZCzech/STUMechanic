/* 3D scenes: safe lifting & wheel removal. Reference implementation for scene authors. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var TORQUE = {
    'generic': V('dle příručky', 'per manual'), 'mb-cl500-c216': '150 Nm', 'volvo-xc60-b4': '140 Nm',
    'skoda-octavia-rs-tdi': '120 Nm', 'toyota-gr-yaris': '103 Nm',
    'citroen-jumper-22hdi': V('160–180 Nm (ověřit)', '160–180 Nm (verify)')
  };

  /** Lifting rig: car that rolls about its far-side wheels, trolley jack under the front-left
   *  jacking point, axle stand next to it. All motion via rig.set({lift, standIn, jackDown}). */
  function liftRig(ctx, K) {
    var root = new THREE.Group();
    var c = K.car(ctx.vehicle, { contactShadow: false });
    var d = c.dims, tz = d.track / 2;
    root.add(K.FX.contactShadow(d.L * 1.15, d.W * 1.25, 0.55));
    var pivot = new THREE.Group(); pivot.position.set(0, 0, -tz); root.add(pivot);
    c.group.position.set(0, 0, tz); pivot.add(c.group);

    var jp = c.jackPoints[0].clone();                           // front-left jacking point (car coords)
    var jpM = new THREE.Object3D(); jpM.position.copy(jp); c.group.add(jpM);
    var sp = jp.clone(); sp.x -= 0.55;                          // stand point on the sill, behind the jack
    var spM = new THREE.Object3D(); spM.position.copy(sp); c.group.add(spM);
    var maxA = Math.asin(0.105 / (2 * tz)), restA = maxA * 0.86;

    var jack = K.P.trolleyJack(); jack.rotation.y = PI / 2; root.add(jack);
    var stand = K.P.axleStand({ h: 0.05 }); root.add(stand);
    // stand height so that its cradle meets the sill at restA
    pivot.rotation.x = -restA; root.updateMatrixWorld(true);
    var spW = spM.getWorldPosition(new THREE.Vector3());
    stand.userData.setH(Math.max(0, spW.y - 0.3 - 0.062));
    var standXZ = spW.clone();
    pivot.rotation.x = 0;
    var tmp = new THREE.Vector3();

    function setJack(yTarget) {
      var lo = 0, hi = 1;
      for (var i = 0; i < 24; i++) { var m = (lo + hi) / 2; if (jack.userData.saddleLocal(m).y < yTarget) lo = m; else hi = m; }
      jack.userData.setLift(lo);
      var sl = jack.userData.saddleLocal(lo);
      jpM.getWorldPosition(tmp);
      jack.position.set(tmp.x, 0, tmp.z + sl.x + 0.02);
    }

    var rig = {
      root: root, car: c, jpM: jpM, spM: spM, jack: jack, stand: stand, maxA: maxA, restA: restA,
      /** lift: 0..1 of maxA; standIn: 0 (outside) .. 1 (in place); jackDrop: metres the saddle sits below the jacking point */
      set: function (o) {
        var a = (o.lift || 0) * maxA;
        pivot.rotation.x = -a;
        // near-side suspension droops as the body rises
        var droop = Math.min(1, a / restA) * 0.05;
        c.wheels.forEach(function (w) { if (w.side > 0) w.pivot.position.y = w.base.y - droop; });
        root.updateMatrixWorld(true);
        jpM.getWorldPosition(tmp);
        setJack(tmp.y + 0.002 - (o.jackDrop || 0));
        var si = o.standIn == null ? 0 : o.standIn;
        stand.position.set(standXZ.x, 0, standXZ.z + (1 - si) * 0.9);
        stand.visible = si > 0.001;
      }
    };
    rig.set({ lift: 0 });
    return rig;
  }
  S.liftRig = liftRig;

  var CAM_SIDE = { pos: [2.1, 1.15, 4.9], target: [0.25, 0.32, 0.6], fov: 34 };

  function standsScene(withText) {
    return {
      duration: 9, camera: CAM_SIDE, shadow: 3, thumbT: 6.5,
      build: function (ctx, K) {
        var T = K.T, rig = liftRig(ctx, K);
        return {
          root: rig.root,
          update: function (t) {
            var lift = T.seg(t, 0.6, 3.0) - T.seg(t, 4.6, 5.6) * (1 - rig.restA / rig.maxA);
            var standIn = T.seg(t, 3.1, 4.4);
            var drop = T.seg(t, 5.6, 6.4) * 0.012;
            if (t > 8.4) { var k = T.seg(t, 8.4, 9); lift *= 1 - k; standIn *= 1 - k; }
            rig.set({ lift: lift, standIn: standIn, jackDrop: drop });
          },
          labels: withText ? [
            { text: V('Zvedací bod', 'Jacking point'), at: rig.jpM, show: [0.2, 3.1] },
            { text: V('Hever', 'Jack'), at: function () { return rig.jack.userData.saddle.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.05, -0.1, 0.25)); }, show: [3.0, 4.4] },
            { text: V('Podpěrný stojan', 'Axle stand'), at: function () { return rig.stand.position.clone().add(new THREE.Vector3(0, 0.2, 0.05)); }, show: [3.2, 8.4] },
            { text: V('✔ Vůz stojí na stojanu', '✔ Car rests on the stand'), at: rig.spM, show: [6.2, 8.4], level: 'ok' }
          ] : [],
          captions: withText ? [
            { text: V('1. Hever přesně pod zvedací bod, pomalu zvedat', '1. Jack exactly under the jacking point, lift slowly'), show: [0, 3.1] },
            { text: V('2. Stojan pod pevný bod prahu, zajistit čep', '2. Stand under a solid sill point, lock the pin'), show: [3.1, 4.6] },
            { text: V('3. Pomalu povolit hever – vůz dosedne na stojan', '3. Slowly release the jack – car settles on the stand'), show: [4.6, 6.2] },
            { text: V('Hever nechte lehce pod vozem jako 2. pojistku', 'Leave the jack lightly in place as a 2nd safeguard'), show: [6.2, 9], level: 'info' }
          ] : []
        };
      }
    };
  }
  R('lift.hero', standsScene(false));
  R('lift.stands', standsScene(true));

  /* ------------------------------------------------------------- park & chock */
  R('lift.park', {
    duration: 7, camera: { pos: [-3.6, 1.25, 3.4], target: [-1.1, 0.3, 0.5], fov: 34 }, shadow: 3, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var d = c.dims, tz = d.track / 2, wr = d.wr;
      var off = Math.sqrt(wr * wr - (wr - 0.12) * (wr - 0.12)) + 0.12;
      var chocks = [];
      [[-1, -1], [1, -1]].forEach(function (cfg, i) {
        var ch = K.P.chock();
        if (cfg[0] < 0) ch.rotation.y = PI;
        root.add(ch); chocks.push({ obj: ch, x: d.xr + cfg[0] * off, from: cfg[0] * 0.9, delay: i * 0.6 });
      });
      var brake = new THREE.Group();
      var plate = K.mesh(K.G.cylZ(0.11, 0.02, 40), 'hiDanger'); brake.add(plate);
      var pText = K.mesh(K.G.box(0.03, 0.12, 0.025), 'plasticWhite'); pText.position.set(-0.02, 0, 0.01); brake.add(pText);
      var pBow = K.mesh(K.G.torus(0.03, 0.013, PI * 1.1, 20), 'plasticWhite'); pBow.position.set(0.0, 0.03, 0.01); pBow.rotation.z = -PI * 0.55; brake.add(pBow);
      brake.position.set(d.xr + 0.6, d.H + 0.35, tz); root.add(brake);
      return {
        root: root,
        update: function (t) {
          chocks.forEach(function (ch) {
            var k = T.seg(t, 1.0 + ch.delay, 2.2 + ch.delay);
            ch.obj.position.set(ch.x + ch.from * (1 - k), 0, tz);
          });
          brake.scale.setScalar(0.85 + 0.15 * Math.abs(Math.sin(t * 3)) * (t < 1 ? 1 : 0.4));
          brake.visible = t > 0.2;
        },
        labels: [
          { text: V('Klín za kolo', 'Chock behind wheel'), at: function () { return chocks[0].obj.position.clone().add(new THREE.Vector3(0, 0.2, 0.1)); }, show: [2.2, 7] },
          { text: V('Klín před kolo', 'Chock in front of wheel'), at: function () { return chocks[1].obj.position.clone().add(new THREE.Vector3(0, 0.2, 0.1)); }, show: [2.8, 7] }
        ],
        captions: [
          { text: V('Parkovací brzda + P / 1. rychlost, motor vypnutý', 'Parking brake + P / 1st gear, engine off') },
          { text: V('Klíny k nápravě, kterou NEzvedáte', 'Chocks on the axle you are NOT lifting'), show: [1, 7], level: 'info' },
          { text: V('Rovný, pevný povrch (beton, dlažba)', 'Level, solid ground (concrete, paving)'), show: [3.5, 7] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ jacking points */
  R('lift.points', {
    duration: 6, camera: { pos: [0.5, 0.2, 3.1], target: [0.2, 0.16, 0.6], fov: 42 }, shadow: 3, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var marks = [];
      c.jackPoints.slice(0, 2).forEach(function (p) {
        var m = new THREE.Group();
        var ring = K.mesh(K.G.cyl(0.05, 0.008, 32), K.M.clone('hiAccent')); m.add(ring);
        var arrow = K.FX.arrow([0, -0.12 + p.y, 0], [0, -0.01, 0], 0xf5a524, 0.01); arrow.position.y = -p.y + 0.02;
        m.add(arrow);
        m.position.set(p.x, p.y - 0.006, p.z + 0.04); root.add(m); marks.push(m);
      });
      var no = new THREE.Group();
      [1, -1].forEach(function (s) { var b = K.mesh(K.G.box(0.16, 0.025, 0.025), 'hiDanger'); b.rotation.z = s * PI / 4; no.add(b); });
      no.position.set(c.dims.front - 0.35, 0.09, 0.25); no.rotation.y = PI / 2; root.add(no);
      var hint = ctx.vehicle === 'toyota-gr-yaris' ? V('Nízký vůz: hever zasouvat z boku', 'Low car: slide the jack in from the side')
        : ctx.vehicle === 'mb-cl500-c216' ? V('Zvedací body pod krytkami v prahu', 'Jacking points under covers in the sill')
          : ctx.vehicle === 'volvo-xc60-b4' ? V('Nejdřív vypnout regulaci vzduchového podvozku!', 'First switch off air suspension level control!')
          : ctx.vehicle === 'citroen-jumper-22hdi' ? V('Těžká dodávka: hever i stojany min. 3 t, vyložit náklad', 'Heavy van: jack and stands min. 3 t, unload cargo')
            : V('Zesílený lem prahu (zářezy / značky)', 'Reinforced sill seam (notches / marks)');
      return {
        root: root,
        update: function (t) {
          var s = 1 + 0.25 * Math.sin(t * 4);
          marks.forEach(function (m) { m.children[0].scale.set(s, 1, s); });
          no.visible = Math.sin(t * 5) > -0.6;
        },
        labels: [
          { text: V('Zvedací bod', 'Jacking point'), at: function () { return marks[0].position.clone().add(new THREE.Vector3(0, -0.05, 0.1)); }, level: 'accent' },
          { text: V('Zvedací bod', 'Jacking point'), at: function () { return marks[1].position.clone().add(new THREE.Vector3(0, -0.05, 0.1)); }, level: 'accent' },
          { text: V('✖ Ne pod nárazník / olejovou vanu', '✖ Not under bumper / oil pan'), at: no, level: 'danger', show: [1.5, 6] }
        ],
        cameraPath: c.dims.H > 2 ? function () { return { pos: [0.4, 0.6, 5.6], target: [0.0, 0.42, 0.6] }; } : null,
        captions: [{ text: hint, level: ctx.vehicle === 'volvo-xc60-b4' || ctx.vehicle === 'citroen-jumper-22hdi' ? 'danger' : null }]
      };
    }
  });

  /* ---------------------------------------------------------------- jack only */
  R('lift.jack', {
    duration: 7, camera: CAM_SIDE, shadow: 3, thumbT: 4.5,
    build: function (ctx, K) {
      var T = K.T, rig = liftRig(ctx, K);
      var fw = rig.car.wheels.filter(function (w) { return w.side > 0 && w.axle === 'f'; })[0];
      return {
        root: rig.root,
        update: function (t) { rig.set({ lift: T.seg(t, 0.8, 4.0) * (1 - T.seg(t, 6.4, 7)) }); },
        labels: [
          { text: V('kolo ~3 cm nad zemí', 'wheel ~3 cm off the ground'), at: function () { return fw.pivot.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -0.28, 0.2)); }, show: [4.0, 6.4], level: 'ok' }
        ],
        captions: [
          { text: V('Pomalu zvedat, sledovat dosednutí misky', 'Lift slowly, watch the saddle seat properly') },
          { text: V('NIKDY nepracovat jen na heveru!', 'NEVER work on a jack alone!'), show: [2, 7], level: 'danger' }
        ]
      };
    }
  });

  /* ------------------------------------------------------------- shake test */
  R('lift.shake', {
    duration: 4, camera: { pos: [-1.6, 1.3, 4.2], target: [0.1, 0.45, 0.4], fov: 36 }, shadow: 3, thumbT: 1,
    build: function (ctx, K) {
      var T = K.T, rig = liftRig(ctx, K);
      rig.set({ lift: rig.restA / rig.maxA, standIn: 1, jackDrop: 0.012 });
      var hand = K.P.glove(); hand.rotation.y = PI; rig.root.add(hand);
      var d = rig.car.dims;
      var base = new THREE.Vector3(d.xr - 0.1, d.belt - 0.15, d.W / 2 + 0.12);
      return {
        root: rig.root,
        update: function (t) {
          var push = Math.max(0, Math.sin(t * PI * 1.5));
          hand.position.copy(base).add(new THREE.Vector3(0, 0, 0.12 - push * 0.08));
          rig.car.group.rotation.x = -push * 0.002;
        },
        labels: [{ text: V('✔ nehýbe se', '✔ does not move'), at: rig.spM, level: 'ok', show: [1.2, 4] }],
        captions: [
          { text: V('Pořádně zatlačte – vůz se nesmí pohnout ani vrzat', 'Push firmly – the car must not move or creak') },
          { text: V('Hýbe se? Znovu zvednout a stojan přestavit', 'Moves? Raise again and reposition the stand'), level: 'danger', show: [2, 4] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ wheel close-ups */
  function wheelCloseup(ctx, K, lifted) {
    var root = new THREE.Group();
    var rig = null, c, fw;
    if (lifted) {
      rig = liftRig(ctx, K); root.add(rig.root);
      rig.set({ lift: rig.restA / rig.maxA, standIn: 1, jackDrop: 0.012 });
      c = rig.car;
    } else {
      c = K.car(ctx.vehicle); root.add(c.group);
    }
    fw = c.wheels.filter(function (w) { return w.side > 0 && w.axle === 'f'; })[0];
    root.updateMatrixWorld(true);
    return { root: root, rig: rig, car: c, fw: fw, center: fw.pivot.getWorldPosition(new THREE.Vector3()) };
  }
  function boltWorld(fw, i) { return fw.wheel.userData.bolts[i].getWorldPosition(new THREE.Vector3()); }

  R('lift.loosen', {
    duration: 4, camera: { pos: [1.55, 0.62, 2.25], target: [1.3, 0.34, 0.6], fov: 30 }, ground: true, shadow: 2.5, thumbT: 1.6,
    build: function (ctx, K) {
      var T = K.T, w = wheelCloseup(ctx, K, false);
      var bolt = w.fw.wheel.userData.bolts[0];
      var holder = new THREE.Group(); bolt.add(holder);
      var bar = K.P.breakerBar(0.42); bar.rotation.x = PI / 2; bar.position.z = 0.06;
      holder.add(bar);
      var arrow = K.FX.rotArrow(0.07, 'ccw', 0xf5a524, 220, 0.006); arrow.position.z = 0.03; bolt.add(arrow);
      var start = -0.5;
      return {
        root: w.root,
        update: function (t) {
          var k = T.seg(t, 0.4, 1.8) - T.seg(t, 2.4, 3.6);
          holder.rotation.z = start + k * 1.1;
          bolt.children[1].rotation.y = k * 1.1; // head turns
        },
        cameraPath: function () {
          var cpos = w.center.clone().add(new THREE.Vector3(0.45, 0.25, 1.35));
          return { pos: cpos, target: w.center.clone().add(new THREE.Vector3(0.05, 0.04, 0)) };
        },
        labels: [{ text: V('↺ proti směru hodin', '↺ counter-clockwise'), at: function () { return boltWorld(w.fw, 0).add(new THREE.Vector3(0, 0.1, 0.05)); }, level: 'accent' }],
        captions: [
          { text: V('Povolit o ½ otáčky – kolo ještě stojí na zemi', 'Loosen ½ turn – wheel still on the ground') },
          { text: V('Nestoupat na klíč celou vahou', 'Do not stand on the bar with full weight'), level: 'info', show: [2, 4] }
        ]
      };
    }
  });

  R('lift.wheeloff', {
    duration: 10, camera: { pos: [1.0, 1.1, 3.4], target: [0.4, 0.25, 0.7], fov: 36 }, shadow: 3, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, w = wheelCloseup(ctx, K, true);
      var bolts = w.fw.wheel.userData.bolts;
      var order = [2, 4, 1, 3, 0]; // top bolt (index 0) last
      var fades = bolts.map(function (b) { return K.FX.fader(b); });
      var basePos = bolts.map(function (b) { return b.position.clone(); });
      var wheel = w.fw.wheel, wheelBase = { p: wheel.position.clone(), r: wheel.rotation.clone() };
      var fwPivotW = w.fw.pivot.getWorldPosition(new THREE.Vector3());
      var d = w.car.dims;
      // where the wheel ends up: lying flat under the sill, in world coords → convert into pivot space each frame
      var restW = new THREE.Vector3(d.xf - d.wr - 1.25, 0.12, d.W / 2 - 0.12);
      return {
        root: w.root,
        update: function (t) {
          order.forEach(function (bi, i) {
            var k = T.seg(t, 0.4 + i * 0.7, 0.9 + i * 0.7);
            bolts[bi].position.copy(basePos[bi]).add(new THREE.Vector3(0, 0, k * 0.08));
            fades[bi](1 - T.seg(t, 0.8 + i * 0.7, 1.1 + i * 0.7));
          });
          var off = T.seg(t, 4.3, 5.5), down = T.seg(t, 5.8, 7.6);
          wheel.position.copy(wheelBase.p);
          wheel.rotation.copy(wheelBase.r);
          wheel.position.z += off * 0.35;
          if (down > 0) {
            var pivotInv = new THREE.Matrix4().copy(w.fw.pivot.matrixWorld).invert();
            var target = restW.clone().applyMatrix4(pivotInv);
            var from = wheelBase.p.clone(); from.z += 0.35;
            wheel.position.copy(from.lerp(target, down));
            wheel.rotation.x = wheelBase.r.x - down * PI / 2;
          }
          if (t > 9.4) { var r = T.seg(t, 9.4, 10); bolts.forEach(function (b, i) { fades[i](r); b.position.copy(basePos[i]); }); wheel.position.copy(wheelBase.p); wheel.rotation.copy(wheelBase.r); }
        },
        labels: [
          { text: V('horní šroub naposledy', 'top bolt last'), at: function () { return boltWorld(w.fw, 0).add(new THREE.Vector3(0, 0.08, 0.05)); }, show: [0.4, 4], level: 'accent' },
          { text: V('kolo naplocho pod práh = pojistka', 'wheel flat under the sill = backup'), at: function () { return restW.clone().add(new THREE.Vector3(0, 0.12, 0.2)); }, show: [7.6, 9.4], level: 'ok' }
        ],
        captions: [
          { text: V('Šrouby do kříže, horní naposledy', 'Bolts in a star pattern, top one last'), show: [0, 4.3] },
          { text: V('Kolo uchopit na 3 a 9 hodinách, stáhnout k sobě', 'Grip at 3 and 9 o\'clock, pull towards you'), show: [4.3, 5.8] },
          { text: V('Kolo položit pod práh – kdyby vůz spadl, dopadne na kolo', 'Put the wheel under the sill – if the car falls, it lands on the wheel'), show: [5.8, 10], level: 'info' }
        ]
      };
    }
  });

  R('lift.lower', {
    duration: 9, camera: CAM_SIDE, shadow: 3, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, rig = liftRig(ctx, K), r = rig.restA / rig.maxA;
      return {
        root: rig.root,
        update: function (t) {
          var up = T.seg(t, 0.8, 2.0), out = T.seg(t, 2.4, 3.8), down = T.seg(t, 4.2, 7.2);
          var lift = (r + (1 - r) * up) * (1 - down);
          var drop = t < 0.8 ? 0.012 * (1 - T.seg(t, 0, 0.8)) : 0;
          if (t > 8.4) { var k = T.seg(t, 8.4, 9); lift = r * k; out = 1 - k; }
          rig.set({ lift: lift, standIn: 1 - out, jackDrop: drop });
        },
        labels: [{ text: V('stojan ven', 'stand out'), at: function () { return rig.stand.position.clone().add(new THREE.Vector3(0, 0.25, 0)); }, show: [2.2, 3.8] }],
        captions: [
          { text: V('1. Heverem nadzvednout', '1. Raise slightly with the jack'), show: [0, 2.2] },
          { text: V('2. Vyndat stojan', '2. Remove the stand'), show: [2.2, 4] },
          { text: V('3. Pomalu spustit – ruce a nohy pryč', '3. Lower slowly – hands and feet clear'), show: [4, 9], level: 'danger' }
        ]
      };
    }
  });

  R('lift.torque', {
    duration: 11, camera: { pos: [1.7, 0.7, 2.3], target: [1.3, 0.34, 0.6], fov: 30 }, shadow: 2.5, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, w = wheelCloseup(ctx, K, false);
      var bolts = w.fw.wheel.userData.bolts;
      var order = [0, 2, 4, 1, 3];
      var tw = K.P.torqueWrench(0.48); tw.rotation.x = PI / 2;
      var holder = new THREE.Group(); holder.add(tw); tw.position.z = 0.06;
      w.fw.wheel.add(holder);
      var torque = S.t(TORQUE[ctx.vehicle] || TORQUE.generic);
      var labels = order.map(function (bi, i) {
        return { text: String(i + 1), at: function () { return boltWorld(w.fw, bi).add(new THREE.Vector3(0, 0.045, 0.03)); }, show: [0.3 + i * 2, 11], level: 'accent' };
      });
      labels.push({ text: { cs: 'klik! ' + torque, en: 'click! ' + torque }, at: function () { return w.center.clone().add(new THREE.Vector3(0.25, -0.15, 0.2)); }, show: function (t) { var k = (t - 0.3) % 2; return t < 10.3 && k > 1.2 && k < 1.9; }, level: 'ok' });
      return {
        root: w.root,
        update: function (t) {
          var i = Math.min(4, Math.floor(Math.max(0, t - 0.3) / 2));
          var b = bolts[order[i]];
          holder.position.copy(b.position);
          var k = T.seg((t - 0.3) % 2, 0.4, 1.2);
          holder.rotation.z = -0.3 - k * 0.5;
        },
        cameraPath: function () {
          return { pos: w.center.clone().add(new THREE.Vector3(0.4, 0.3, 1.45)), target: w.center.clone().add(new THREE.Vector3(0.05, 0.03, 0)) };
        },
        labels: labels,
        captions: [
          { text: V('Do kříže, ve 2 krocích (½ momentu → plný moment)', 'Star pattern, in 2 passes (½ torque → full torque)') },
          { text: { cs: 'Moment: ' + torque, en: 'Torque: ' + torque }, level: 'accent' }
        ]
      };
    }
  });
})(window.STU);
