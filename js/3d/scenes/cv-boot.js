/* 3D scenes: CV boot & CV joint replacement. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var RWD = { 'mb-cl500-c216': true };

  /** lathe along +X (profile [r, x]) */
  function latheX(K, pts, seg) { var g = K.G.lathe(pts, seg || 32); g.rotateZ(-PI / 2); return g; }
  function bellows(K, r0, r1, len, folds) {
    var pts = [];
    for (var i = 0; i <= folds * 2; i++) {
      var u = i / (folds * 2), r = r0 + (r1 - r0) * u;
      pts.push([r * (i % 2 ? 0.86 : 1), u * len]);
    }
    pts.push([r1, len + 0.012]);
    return latheX(K, pts, 28);
  }
  /** Driveshaft along X: outer joint at +X end (wheel side), inner joint at -X. */
  function driveshaft(K, o) {
    o = o || {};
    var g = new THREE.Group();
    var shaft = K.mesh(K.G.cylX(0.012, 0.36, 16), 'steelDark'); g.add(shaft);
    var outer = new THREE.Group(); outer.position.x = 0.24; g.add(outer);
    var bell = K.mesh(latheX(K, [[0.012, -0.05], [0.04, -0.05], [0.046, -0.03], [0.046, 0.0], [0.03, 0.02], [0.016, 0.03], [0.014, 0.09], [0, 0.09]], 32), 'steel');
    outer.add(bell);
    for (var i = 0; i < 18; i++) { var sp = K.mesh(K.G.box(0.05, 0.002, 0.002), 'steelDark'); var a = i / 18 * PI * 2; sp.position.set(0.065, Math.cos(a) * 0.014, Math.sin(a) * 0.014); outer.add(sp); }
    var thread = K.mesh(K.G.cylX(0.011, 0.02, 12), 'zinc'); thread.position.x = 0.1; outer.add(thread);
    var boot = new THREE.Group(); g.add(boot);
    var bootM = K.mesh(bellows(K, 0.044, 0.016, 0.1, 5), o.bootMat || 'rubber'); bootM.position.x = 0.19; bootM.rotation.y = PI; boot.add(bootM);
    var bandBig = K.mesh(K.G.torus(0.045, 0.003, PI * 2, 32), 'steel'); bandBig.rotation.y = PI / 2; bandBig.position.x = 0.188; g.add(bandBig);
    var bandSmall = K.mesh(K.G.torus(0.017, 0.0025, PI * 2, 24), 'steel'); bandSmall.rotation.y = PI / 2; bandSmall.position.x = 0.079; g.add(bandSmall);
    var inner = new THREE.Group(); inner.position.x = -0.24; g.add(inner);
    var house = K.mesh(latheX(K, [[0.016, 0.03], [0.042, 0.03], [0.048, 0.0], [0.048, -0.05], [0.035, -0.06], [0.03, -0.1], [0, -0.1]], 32), 'aluCast');
    house.material = K.M.steelDark; inner.add(house);
    var ib = K.mesh(bellows(K, 0.042, 0.016, 0.09, 4), 'rubber'); ib.position.x = -0.205; boot.add(ib);
    g.userData = { shaft: shaft, outer: outer, boot: boot, bootOuter: bootM, inner: inner, bands: [bandBig, bandSmall], thread: thread };
    return g;
  }
  /** Hub + knuckle (from parts) with its own shaft/boot hidden, plus our driveshaft going inboard (-Z). */
  function hubAssembly(K, o) {
    var g = new THREE.Group();
    var hub = K.P.hub(); g.add(hub);
    var n = hub.children.length;
    hub.children[n - 1].visible = false; hub.children[n - 2].visible = false;
    var ds = driveshaft(K, o); ds.rotation.y = -PI / 2; ds.position.z = -0.32; g.add(ds);
    var nut = K.mesh(K.G.hex(0.016, 0.014), 'zinc'); nut.rotation.x = PI / 2; nut.position.z = 0.03; g.add(nut);
    var arm = K.mesh(K.G.rbox(0.36, 0.035, 0.07, 0.012), 'blackOxide'); arm.position.set(0.02, -0.25, -0.26); arm.rotation.y = 0.15; g.add(arm);
    var ball = new THREE.Group(); ball.position.set(0.0, -0.22, -0.08); g.add(ball);
    ball.add(K.mesh(K.G.sphere(0.022, 16), 'steelDark'));
    var stud = K.mesh(K.G.cyl(0.008, 0.06, 12), 'zinc'); stud.position.y = 0.03; ball.add(stud);
    var bnut = K.mesh(K.G.hex(0.011, 0.01), 'zinc'); bnut.position.y = 0.06; ball.add(bnut);
    g.position.y = 0.42;
    return { group: g, hub: hub, ds: ds, nut: nut, ball: ball, arm: arm };
  }

  /* -------------------------------------------------------------- symptoms */
  function circleScene(withClicks) {
    return {
      duration: 8, camera: { pos: [0, 10, 11.5], target: [0, 0, 0], fov: 40 }, shadow: 8, thumbT: 2,
      build: function (ctx, K) {
        var root = new THREE.Group();
        var c = K.car(ctx.vehicle); var d = c.dims;
        var Rr = d.wb * 1.9 + 0.5;
        var arm = new THREE.Group(); root.add(arm);
        c.group.position.set(0, 0, Rr); c.group.rotation.y = 0; arm.add(c.group);
        var front = c.wheels.filter(function (w) { return w.axle === 'f'; });
        front.forEach(function (w) { w.pivot.rotation.y = 0.55; });
        var rwd = RWD[ctx.vehicle];
        var target = c.wheels.filter(function (w) { return w.side < 0 && w.axle === (rwd ? 'r' : 'f'); })[0];
        var rings = [];
        for (var i = 0; i < 3; i++) {
          var rg = K.mesh(K.G.torus(0.3, 0.02, PI * 2, 32), K.M.clone(withClicks ? 'hiDanger' : 'hiOk', { transparent: true }));
          rg.rotation.x = PI / 2; root.add(rg); rings.push(rg);
        }
        return {
          root: root,
          cameraPath: function (t) {
            var a = -t * 0.5, cp = new THREE.Vector3(Math.sin(a) * Rr, 0, Math.cos(a) * Rr);
            var out = cp.clone().normalize();
            return { pos: cp.clone().add(out.multiplyScalar(d.L * 1.1)).add(new THREE.Vector3(0, d.H * 2.2, 0)), target: cp.clone().add(new THREE.Vector3(0, d.H * 0.3, 0)) };
          },
          update: function (t) {
            arm.rotation.y = -t * 0.5;
            c.wheels.forEach(function (w) { w.wheel.rotation.z = -t * 6; });
            var p = target.pivot.getWorldPosition(new THREE.Vector3());
            rings.forEach(function (rg, i) {
              var k = ((t * 1.6) + i / 3) % 1;
              rg.position.set(p.x, 0.35, p.z);
              rg.scale.setScalar(0.6 + k * 2.2);
              rg.material.opacity = withClicks ? (1 - k) * 0.8 : 0;
              rg.visible = withClicks;
            });
          },
          labels: withClicks
            ? [{ text: rwd ? V('cvak-cvak při rozjezdu (zadní kloub)', 'click-click when pulling away (rear joint)') : V('cvak-cvak v plném rejdu', 'click-click on full lock'), at: function () { return target.pivot.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 1.1, 0)); }, level: 'danger' }]
            : [{ text: V('✔ ticho v obou směrech', '✔ quiet both ways'), at: function () { return c.group.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 2.2, 0)); }, level: 'ok' }],
          captions: withClicks
            ? [{ text: rwd ? V('Zadní pohon: cvakání při rozjezdu a změně plynu', 'RWD: clicking when pulling away and on throttle changes') : V('Pomalé kroužení v plném rejdu, okno dolů', 'Slow circles on full lock, window down') },
              { text: V('Vibrace při zrychlování = vnitřní kloub', 'Vibration under acceleration = inner joint'), level: 'info', show: [3, 8] }]
            : [{ text: V('Zkouška: plný rejd doleva i doprava, pomalu', 'Test: full lock left and right, slowly') },
              { text: V('Po 50 km zkontrolovat utažení', 'Re-check torques after 50 km'), level: 'info', show: [3, 8] }]
        };
      }
    };
  }
  R('cv-boot.symptoms', circleScene(true));
  R('cv-boot.test', circleScene(false));

  /* --------------------------------------------------------------- inspect */
  R('cv-boot.inspect', {
    duration: 7, camera: { pos: [0.48, 0.52, 0.08], target: [0.0, 0.37, -0.2], fov: 38 }, shadow: 0.8, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var a = hubAssembly(K); root.add(a.group);
      var boot = a.ds.userData.bootOuter;
      var glow = K.FX.glow(boot, 0xe5484d);
      var crack = K.mesh(K.G.box(0.002, 0.03, 0.006), 'blackOxide'); crack.position.set(0.04, 0.015, -0.13); a.group.add(crack);
      var gm = K.M.clone('blackGloss', { color: 0x2a2620 });
      for (var i = 0; i < 16; i++) {
        var sp = K.mesh(K.G.sphere(0.006 + (i % 3) * 0.002, 8), gm); sp.scale.y = 0.35;
        var an = i * 2.4; sp.position.set(Math.cos(an) * 0.1, Math.sin(an) * 0.12, -0.05 - (i % 4) * 0.02); a.group.add(sp);
      }
      return {
        root: root,
        update: function (t) { glow(t > 1 ? 0.4 + 0.4 * Math.sin(t * 4) : 0); a.ds.rotation.x = Math.sin(t * 0.8) * 0.05; },
        labels: [
          { text: V('prasklina v záhybu', 'crack in a fold'), at: function () { return crack.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.02, 0.03, 0)); }, show: [1, 7], level: 'danger' },
          { text: V('rozstříknutý tuk', 'flung-out grease'), at: [0.1, 0.54, -0.08], show: [2.5, 7] }
        ],
        captions: [
          { text: V('Kola do rejdu, prohlédnout manžety ze všech stran', 'Wheels on full lock, inspect the boots all round') },
          { text: V('Prasklá manžeta = vyměnit HNED, dokud kloub necvaká', 'Split boot = replace NOW, before the joint clicks'), level: 'info', show: [3, 7] }
        ]
      };
    }
  });

  /* -------------------------------------------------------------- axle nut */
  R('cv-boot.axlenut', {
    duration: 6, camera: { pos: [0.35, 0.6, 1.15], target: [0.05, 0.32, 0.1], fov: 34 }, shadow: 1.2, thumbT: 2.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var s = K.carSpec(ctx.vehicle);
      var w = K.P.wheel({ r: s.wr, w: s.tw, rimMat: s.rim || 'rimSilver' }); w.position.y = s.wr; root.add(w);
      root.add(K.FX.contactShadow(0.8, 0.5, 0.5));
      var nut = K.mesh(K.G.hex(0.017, 0.016), 'zinc'); nut.rotation.x = PI / 2; nut.position.set(0, s.wr, s.tw * 0.34 + 0.035); root.add(nut);
      var holder = new THREE.Group(); holder.position.copy(nut.position); root.add(holder);
      var bar = K.P.breakerBar(0.7); bar.rotation.x = PI / 2; bar.position.z = 0.05; holder.add(bar);
      var arrow = K.FX.rotArrow(0.06, 'ccw', 0xf5a524, 220, 0.005); arrow.position.copy(nut.position).add(new THREE.Vector3(0, 0, 0.02)); root.add(arrow);
      return {
        root: root,
        update: function (t) { var k = T.seg(t, 0.8, 2.6) - T.seg(t, 4.4, 5.6); holder.rotation.z = -0.2 + k * 0.9; nut.rotation.y = k * 0.9; },
        labels: [{ text: V('kolo na ZEMI, pomocník brzdí', 'wheel ON THE GROUND, helper brakes'), at: function () { return nut.position.clone().add(new THREE.Vector3(0, 0.12, 0)); }, level: 'accent' }],
        captions: [
          { text: V('Matici poloosy povolit ještě na zemi – dlouhá páka', 'Break the axle nut loose on the ground – long bar') },
          { text: V('Nikdy na stojanech – vůz můžete strhnout!', 'Never on stands – you can pull the car off!'), level: 'danger', show: [2.5, 6] }
        ]
      };
    }
  });

  /* -------------------------------------------------------------- separate */
  R('cv-boot.separate', {
    duration: 9, camera: { pos: [0.6, 0.6, 0.6], target: [0, 0.34, -0.15], fov: 38 }, shadow: 0.9, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var a = hubAssembly(K); root.add(a.group);
      var pivot = new THREE.Group(); a.group.add(pivot);
      a.group.remove(a.hub); pivot.add(a.hub); a.group.remove(a.nut); pivot.add(a.nut);
      var split = new THREE.Group(); split.position.set(0.0, -0.2, -0.08); a.group.add(split);
      var fork = K.mesh(K.G.extrude([[-0.03, 0], [0.03, 0], [0.03, 0.012], [0.008, 0.012], [0.008, 0.05], [-0.008, 0.05], [-0.008, 0.012], [-0.03, 0.012]], 0.04, 0.002), 'toolRed');
      fork.rotation.x = -PI / 2; split.add(fork);
      var screw = K.mesh(K.G.cyl(0.006, 0.08, 12), 'chrome'); screw.position.set(0.02, 0.05, 0); split.add(screw);
      var hammer = K.P.hammer(); hammer.scale.setScalar(0.8); a.group.add(hammer);
      return {
        root: root,
        update: function (t) {
          a.nut.visible = t < 1.2;
          a.nut.position.z = 0.03 + T.seg(t, 0.2, 1.1) * 0.05;
          split.visible = t > 1.4 && t < 4.4;
          var pop = T.seg(t, 3.2, 3.6);
          a.ball.position.y = -0.22 - pop * 0.03;
          var sw = T.seg(t, 4.6, 6.4);
          pivot.rotation.y = sw * 0.45;
          pivot.position.x = sw * 0.06;
          a.ds.position.z = -0.32 - T.seg(t, 6.6, 8.2) * 0.05;
          hammer.visible = t > 1.6 && t < 3.4;
          hammer.position.set(0.09, -0.12 + Math.abs(Math.sin(t * 9)) * 0.05, -0.08); hammer.rotation.z = 0.4;
        },
        labels: [
          { text: V('kulový čep – stahovák', 'ball joint – splitter'), at: function () { return a.ball.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.05, -0.04, 0)); }, show: [1.4, 4.4], level: 'accent' },
          { text: V('pozor na kabel ABS a hadici', 'mind the ABS cable and hose'), at: [0.08, 0.57, -0.05], show: [4.6, 9], level: 'info' }
        ],
        captions: [
          { text: V('Matice poloosy pryč, rozpojit kulový čep', 'Axle nut off, separate the ball joint'), show: [0, 4.6] },
          { text: V('Těhlici vyklopit ven, poloosu vysunout z náboje', 'Swing the knuckle out, push the shaft out of the hub'), show: [4.6, 9] },
          { text: V('Netlouct přímo na závit poloosy', 'Do not hammer directly on the shaft thread'), level: 'danger', show: [6, 9] }
        ]
      };
    }
  });

  /* -------------------------------------------------------------- shaft out */
  R('cv-boot.shaftout', {
    duration: 8, camera: { pos: [0.6, 0.65, -0.12], target: [0, 0.38, -0.42], fov: 38 }, shadow: 0.9, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      root.position.y = 0.4;
      var gb = K.mesh(K.G.rbox(0.36, 0.3, 0.22, 0.04), 'aluCast'); gb.position.set(-0.05, 0, -0.72); root.add(gb);
      var seal = K.mesh(K.G.torus(0.035, 0.005, PI * 2, 24), 'rubber'); seal.position.set(0, 0, -0.61); root.add(seal);
      var ds = driveshaft(K); ds.rotation.y = -PI / 2; root.add(ds);
      var pry = K.mesh(K.G.cyl(0.008, 0.35, 10), 'chrome'); root.add(pry);
      var drops = K.FX.drops(K.M.oil, 8, 0.25, 0.006); drops.group.position.set(0, -0.03, -0.6); root.add(drops.group);
      var tray = K.P.drainPan(0.14, 0.05); tray.position.set(0, -0.3, -0.58); root.add(tray);
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 1.5, 3.5);
          ds.position.set(0, 0, -0.32 + k * 0.12);
          pry.position.set(0.05, 0.02, -0.58); pry.rotation.set(0.2, 0, -0.6 - (t < 1.5 ? Math.sin(t * 6) * 0.05 : 0));
          pry.visible = t < 3.6;
          drops.update(t, t > 3, 1.2);
          tray.userData.setLevel(T.seg(t, 3.2, 7.8) * 0.4);
        },
        labels: [{ text: V('páčit jen za kloub', 'lever on the joint only'), at: [0.06, 0.48, -0.55], show: [0.5, 3.6], level: 'accent' }],
        captions: [
          { text: V('Vnitřní kloub vypáčit z převodovky (pojistný kroužek)', 'Lever the inner joint out of the gearbox (circlip)') },
          { text: V('Netahat za poloosu – vnitřní kloub se rozebere', 'Do not pull on the shaft – the inner joint comes apart'), level: 'danger', show: [1.5, 5] },
          { text: V('Olej zachytit, nový těsnicí kroužek', 'Catch the oil, new oil seal'), show: [5, 8] }
        ]
      };
    }
  });

  /* -------------------------------------------------------------- joint off */
  R('cv-boot.jointoff', {
    duration: 9, camera: { pos: [0.3, 0.32, 0.42], target: [0.18, 0.08, 0], fov: 34 }, shadow: 0.7, thumbT: 5.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bench = K.mesh(K.G.rbox(1.0, 0.04, 0.4, 0.008), 'wood'); bench.position.y = -0.06; root.add(bench);
      var vice = K.mesh(K.G.rbox(0.1, 0.06, 0.12, 0.01), 'toolBlue'); vice.position.set(0, 0.0, 0); root.add(vice);
      [-1, 1].forEach(function (s) { var j = K.mesh(K.G.box(0.08, 0.04, 0.012), 'aluCast'); j.position.set(0, 0.05, s * 0.018); root.add(j); });
      var ds = driveshaft(K); ds.position.y = 0.05; root.add(ds);
      ds.userData.inner.visible = false;
      var bf = K.FX.fader(ds.userData.bootOuter);
      var bandF = ds.userData.bands.map(function (b) { return K.FX.fader(b); });
      var mallet = new THREE.Group(); root.add(mallet);
      var head = K.mesh(K.G.cylX(0.025, 0.07, 20), 'copper'); mallet.add(head);
      var hnd = K.mesh(K.G.cyl(0.01, 0.25, 12), 'wood'); hnd.position.y = 0.13; mallet.add(hnd);
      var cutter = K.mesh(K.G.box(0.05, 0.004, 0.01), 'chrome'); root.add(cutter);
      return {
        root: root,
        update: function (t) {
          bandF.forEach(function (f) { f(1 - T.seg(t, 0.5, 1.2)); });
          cutter.visible = t > 1.2 && t < 2.6; cutter.position.set(0.16 - T.seg(t, 1.3, 2.4) * 0.08, 0.1, 0.03);
          bf(1 - T.seg(t, 2.4, 3));
          var taps = Math.min(4, Math.floor(Math.max(0, t - 3.4) / 0.9));
          var frac = T.seg((t - 3.4) % 0.9, 0.35, 0.5);
          var off = (taps + (t > 3.4 && t < 7 ? frac : 0)) * 0.012;
          ds.userData.outer.position.x = 0.24 + Math.min(off, 0.06) + T.seg(t, 7, 8) * 0.08;
          mallet.visible = t > 3.2 && t < 7;
          var sw = Math.max(0, Math.sin(((t - 3.4) % 0.9) / 0.9 * PI * 2));
          mallet.position.set(ds.userData.outer.position.x - 0.03 - 0.06 * sw, 0.05 + 0.02 * sw, 0.06);
          mallet.rotation.z = 0.2 + sw * 0.5;
        },
        labels: [{ text: V('palicí na vnitřní kroužek', 'mallet on the inner race'), at: [0.25, 0.14, 0.05], show: [3.4, 7], level: 'accent' }],
        captions: [
          { text: V('Pásky přestřihnout, manžetu rozříznout', 'Cut the bands, slit the boot'), show: [0, 3.2] },
          { text: V('Kloub sklepnout z drážkování – ne na klec ani kuličky', 'Knock the joint off the splines – not on the cage or balls'), show: [3.2, 9] }
        ]
      };
    }
  });

  /* --------------------------------------------------------------- cutaway */
  R('cv-boot.cutaway', {
    duration: 8, camera: { pos: [0.12, 0.1, 0.22], target: [0, 0.0, 0], fov: 34 }, shadow: 0.3, ground: false, thumbT: 2,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var bellPts = [[0.012, -0.05], [0.04, -0.05], [0.046, -0.03], [0.046, 0.0], [0.03, 0.02], [0.016, 0.03], [0.014, 0.08], [0, 0.08]];
      var bell = new THREE.Mesh(new THREE.LatheGeometry(bellPts.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 40, 0, PI), K.M.clone('steel', { side: THREE.DoubleSide }));
      bell.rotation.z = -PI / 2; bell.rotation.x = PI / 2; root.add(bell);
      var art = new THREE.Group(); root.add(art);
      var innerRace = K.mesh(K.G.sphere(0.022, 24), 'steelDark'); innerRace.scale.set(0.8, 1, 1); art.add(innerRace);
      var cage = K.mesh(K.G.torus(0.03, 0.004, PI * 2, 40), K.M.clone('brass')); cage.rotation.y = PI / 2; art.add(cage);
      var balls = [];
      for (var i = 0; i < 6; i++) { var b = K.mesh(K.G.sphere(0.0075, 16), 'chrome'); art.add(b); balls.push(b); }
      var shaft = K.mesh(K.G.cylX(0.012, 0.15, 16), 'steelDark'); shaft.position.x = -0.09; art.add(shaft);
      var pits = [];
      for (var j = 0; j < 5; j++) { var pt = K.mesh(K.G.sphere(0.0025, 6), 'rust'); pt.position.set(-0.01 + j * 0.006, 0.036, 0.012); root.add(pt); pits.push(pt); }
      return {
        root: root,
        update: function (t) {
          var ang = Math.sin(t * 0.9) * 0.45;
          art.rotation.z = ang;
          var spin = t * 1.2;
          balls.forEach(function (b, i) { var a = spin + i / 6 * PI * 2; b.position.set(0, Math.cos(a) * 0.03, Math.sin(a) * 0.03); });
          pits.forEach(function (p) { p.visible = t > 4; });
        },
        labels: [
          { text: V('klec', 'cage'), at: [0, 0.045, 0.02] },
          { text: V('kuličky v drahách', 'balls in the tracks'), at: [0.0, -0.04, 0.03] },
          { text: V('důlky / vůle = nový kloub', 'pitting / play = new joint'), at: [0, 0.055, 0.01], show: [4, 8], level: 'danger' }
        ],
        captions: [
          { text: V('Řez homokinetickým kloubem – kloub přenáší moment i v rejdu', 'CV joint cut-away – it transmits torque even on lock') },
          { text: V('Hladké dráhy a žádná vůle = stačí manžeta', 'Smooth tracks and no play = a boot is enough'), level: 'ok', show: [0, 4] }
        ]
      };
    }
  });

  /* ---------------------------------------------------------------- grease */
  R('cv-boot.grease', {
    duration: 8, camera: { pos: [0.28, 0.24, 0.32], target: [0.2, 0.05, 0], fov: 34 }, shadow: 0.6, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bench = K.mesh(K.G.rbox(1, 0.04, 0.4, 0.008), 'wood'); bench.position.y = -0.06; root.add(bench);
      var ds = driveshaft(K); ds.position.y = 0.05; root.add(ds);
      ds.userData.inner.visible = false;
      var gMat = K.M.clone('blackGloss', { color: 0x25262a, roughness: 0.25 });
      var blobIn = K.mesh(K.G.sphere(0.03, 16), gMat); blobIn.position.set(0.215, 0.05, 0); root.add(blobIn);
      var blobBoot = K.mesh(K.G.sphere(0.02, 14), gMat); blobBoot.position.set(0.15, 0.05, 0); root.add(blobBoot);
      var sachet = K.mesh(K.G.rbox(0.07, 0.012, 0.05, 0.005), K.M.clone('plasticWhite', { color: 0xd8d8d8 })); root.add(sachet);
      return {
        root: root,
        update: function (t) {
          var a = T.seg(t, 0.8, 3.6), b = T.seg(t, 4, 6.4);
          blobIn.scale.setScalar(0.2 + a * 0.8); blobIn.visible = t > 0.8;
          blobBoot.scale.setScalar(0.2 + b * 0.8); blobBoot.visible = t > 4;
          var tgt = t < 3.8 ? new THREE.Vector3(0.27, 0.11, 0) : new THREE.Vector3(0.15, 0.11, 0.04);
          sachet.position.copy(tgt); sachet.rotation.z = -0.5;
          sachet.scale.set(1, 1 - 0.5 * (a + b) / 2, 1 - 0.4 * (a + b) / 2);
        },
        labels: [
          { text: V('½ tuku do kloubu', '½ the grease into the joint'), at: [0.22, 0.1, 0], show: [0.8, 4], level: 'accent' },
          { text: V('½ do manžety', '½ into the boot'), at: [0.15, 0.09, 0], show: [4, 8], level: 'accent' }
        ],
        captions: [
          { text: V('CELÉ balení tuku ze sady – žádný jiný tuk', 'ALL of the kit grease – no other grease') },
          { text: V('Kloub dorazit, až zacvakne pojistný kroužek', 'Tap the joint home until the circlip snaps in'), show: [6.4, 8] }
        ]
      };
    }
  });

  /* ----------------------------------------------------------------- bands */
  R('cv-boot.bands', {
    duration: 8, camera: { pos: [0.24, 0.2, 0.26], target: [0.17, 0.05, 0], fov: 32 }, shadow: 0.5, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bench = K.mesh(K.G.rbox(1, 0.04, 0.4, 0.008), 'wood'); bench.position.y = -0.06; root.add(bench);
      var ds = driveshaft(K); ds.position.y = 0.05; root.add(ds);
      ds.userData.inner.visible = false;
      var boot = ds.userData.bootOuter, bootBase = boot.position.x;
      var big = ds.userData.bands[0];
      var ear = K.mesh(K.G.box(0.012, 0.008, 0.006), 'steel'); root.add(ear);
      var pl = new THREE.Group(); root.add(pl);
      [-1, 1].forEach(function (s) { var j = K.mesh(K.G.rbox(0.012, 0.11, 0.008, 0.003), 'toolRed'); j.position.set(0, 0.06, s * 0.006); j.rotation.x = s * 0.15; j.userData.s = s; pl.add(j); });
      return {
        root: root,
        update: function (t) {
          var slide = T.seg(t, 0.4, 2);
          boot.position.x = bootBase - 0.05 * (1 - slide);
          big.visible = t > 2.4;
          ear.position.set(0.188, 0.05 + 0.048, 0); ear.visible = t > 2.4;
          var crimp = T.seg(t, 4, 5.4);
          ear.scale.set(1 - crimp * 0.7, 1 - crimp * 0.6, 1);
          pl.visible = t > 3.2 && t < 6.6;
          pl.position.set(0.188, 0.105, 0);
          pl.children.forEach(function (j) { j.rotation.x = j.userData.s * (0.15 - crimp * 0.12); });
        },
        labels: [
          { text: V('manžeta v drážkách, nezkroucená', 'boot in the grooves, not twisted'), at: [0.14, 0.12, 0], show: [1.5, 3.6] },
          { text: V('ucho pásky pevně zmáčknout', 'squeeze the band ear firmly'), at: [0.19, 0.2, 0], show: [3.6, 8], level: 'accent' }
        ],
        captions: [
          { text: V('Usadit manžetu, odvzdušnit šroubovákem', 'Seat the boot, let air out with a screwdriver') },
          { text: V('Volná páska = manžeta se protočí, tuk vyletí', 'Loose band = the boot spins, grease flies out'), level: 'info', show: [5.5, 8] }
        ]
      };
    }
  });

  /* ---------------------------------------------------------------- refit */
  R('cv-boot.refit', {
    duration: 9, camera: { pos: [0.55, 0.6, 0.6], target: [0, 0.4, -0.12], fov: 38 }, shadow: 0.9, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var a = hubAssembly(K); root.add(a.group);
      var tw = K.P.torqueWrench(0.5); var holder = new THREE.Group(); holder.add(tw); tw.rotation.x = PI / 2; tw.position.z = 0.05;
      holder.position.copy(a.nut.position); a.group.add(holder);
      return {
        root: root,
        update: function (t) {
          a.ds.position.z = -0.32 - (1 - T.seg(t, 0.4, 2.2)) * 0.08;
          a.nut.visible = t > 2.6;
          a.nut.position.z = 0.03 + (1 - T.seg(t, 2.6, 4.2)) * 0.05;
          a.nut.rotation.y = T.seg(t, 2.6, 4.2) * PI * 6;
          holder.visible = t > 4.8;
          holder.rotation.z = -0.3 - T.seg(t, 5.4, 6.8) * 0.5;
        },
        labels: [
          { text: V('nová matice', 'new nut'), at: function () { return a.nut.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.05, 0.02)); }, show: [2.6, 4.8], level: 'accent' },
          { text: V('moment dle příručky – kolo na zemi', 'torque per manual – wheel on the ground'), at: function () { return a.nut.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.05, 0.09, 0.02)); }, show: [5.4, 9], level: 'ok' }
        ],
        captions: [
          { text: V('Poloosu do náboje, kulový čep s novou maticí', 'Shaft into the hub, ball joint with a new nut'), show: [0, 4.8] },
          { text: V('Matici poloosy dotáhnout až na zemi předepsaným momentem', 'Torque the axle nut to spec with the car on the ground'), show: [4.8, 9] },
          { text: V('Nedotažená matice zničí ložisko – hrozí odpadnutí kola', 'An untorqued nut destroys the bearing – the wheel can come off'), level: 'danger', show: [6.8, 9] }
        ]
      };
    }
  });
})(window.STU);
