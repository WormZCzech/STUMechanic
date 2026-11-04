/* 3D scenes: brake hoses & steel brake lines. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  /** Points of a tube offset sideways (stripe on a hose). twist = number of full turns along the length. */
  function stripePoints(curve, r, twist, n) {
    var pts = [], up = new THREE.Vector3(0, 0, 1);
    for (var i = 0; i <= n; i++) {
      var u = i / n, p = curve.getPoint(u), tg = curve.getTangent(u).normalize();
      var nrm = new THREE.Vector3().crossVectors(tg, up);
      if (nrm.lengthSq() < 1e-6) nrm.set(1, 0, 0);
      nrm.normalize().applyAxisAngle(tg, twist * PI * 2 * u);
      pts.push(p.clone().add(nrm.multiplyScalar(r)));
    }
    return pts;
  }

  /** Brake hose with crimped ends, hex fitting and a lay-line stripe. Returns {group, curve}. */
  function hose(K, pts, twist) {
    var g = new THREE.Group();
    var curve = new THREE.CatmullRomCurve3(pts.map(K.v3));
    g.add(K.mesh(new THREE.TubeGeometry(curve, 60, 0.0062, 12, false), 'rubber'));
    var stripe = K.mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(stripePoints(curve, 0.0062, twist || 0, 40)), 60, 0.0012, 6, false),
      K.M.clone('plasticWhite', { color: twist ? 0xe5484d : 0xf2f2f2 }));
    g.add(stripe);
    [0, 1].forEach(function (u) {
      var p = curve.getPoint(u), tg = curve.getTangent(u).normalize();
      var crimp = K.mesh(K.G.cyl(0.0085, 0.026, 16), 'zinc');
      crimp.position.copy(p).add(tg.clone().multiplyScalar(u ? -0.01 : 0.01));
      crimp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tg);
      g.add(crimp);
    });
    g.userData.curve = curve;
    return g;
  }

  /** Corner: hub/strut, disc, floating caliper (own hose hidden), bracket on the strut. */
  function corner(K, o) {
    o = o || {};
    var g = new THREE.Group();
    var hub = K.P.hub({ rusty: !!o.rusty }); g.add(hub);
    var dg = new THREE.Group(); dg.position.z = -0.032; g.add(dg);
    var disc = K.P.brakeDisc({ r: 0.15 }); dg.add(disc);
    var cal = K.P.caliperFloating({ discR: 0.15, angle: PI * 0.9, mat: o.calMat || 'caliperBlack' }); dg.add(cal);
    cal.userData.hose.visible = false;
    var bracket = K.mesh(K.G.rbox(0.05, 0.03, 0.012, 0.004), 'steelDark');
    bracket.position.set(-0.17, 0.285, -0.09); g.add(bracket);
    var banjo = new THREE.Vector3(Math.cos(PI * 0.9) * 0.18, Math.sin(PI * 0.9) * 0.18, -0.032 - 0.073);
    var top = new THREE.Vector3(-0.17, 0.27, -0.09);
    return { group: g, cal: cal, disc: disc, bracket: bracket, banjo: banjo, top: top };
  }
  function hosePts(c) {
    var b = c.banjo, t = c.top;
    return [b.clone().add(new THREE.Vector3(0, 0.012, 0)), b.clone().add(new THREE.Vector3(-0.02, 0.06, -0.01)), b.clone().lerp(t, 0.6).add(new THREE.Vector3(-0.04, 0, -0.02)), t];
  }
  /** Steel line from the bracket up into the arch. */
  function steelLine(K, c, rusty) {
    var t = c.top;
    var pts = [t.clone().add(new THREE.Vector3(0, 0.03, 0)), t.clone().add(new THREE.Vector3(-0.01, 0.1, -0.01)), t.clone().add(new THREE.Vector3(-0.07, 0.17, -0.07)), t.clone().add(new THREE.Vector3(-0.28, 0.23, -0.12))];
    var g = new THREE.Group();
    var curve = new THREE.CatmullRomCurve3(pts);
    g.add(K.mesh(new THREE.TubeGeometry(curve, 40, 0.0025, 8, false), rusty ? 'rust' : 'steelDark'));
    var nut = K.mesh(K.G.hex(0.0065, 0.012), 'zinc'); nut.position.copy(pts[0]).add(new THREE.Vector3(0, -0.01, 0)); g.add(nut);
    var hexH = K.mesh(K.G.hex(0.0085, 0.01), 'zinc'); hexH.position.copy(t).add(new THREE.Vector3(0, 0.012, 0)); g.add(hexH);
    if (rusty) {
      for (var i = 0; i < 7; i++) {
        var b = K.mesh(K.G.sphere(0.0045, 8), 'rust'); b.scale.set(1, 0.5, 1); b.position.copy(curve.getPoint(0.2 + i * 0.1)); g.add(b);
      }
    }
    g.userData = { nut: nut, hex: hexH, curve: curve };
    return g;
  }

  /** Flare-nut wrench (ring with slot), head at origin, axis Y, handle +X. */
  function flareWrench(K) {
    var g = new THREE.Group();
    var s = new THREE.Shape();
    s.absarc(0, 0, 0.017, 0.5, PI * 2 - 0.5, false);
    s.lineTo(0.12, -0.006); s.lineTo(0.12, 0.006); s.closePath();
    var hole = new THREE.Path(); hole.absarc(0, 0, 0.0085, 0.6, PI * 2 - 0.6, false); hole.closePath(); s.holes.push(hole);
    var m = K.mesh(K.G.extrude(s, 0.009, 0.0015), 'chrome'); m.rotation.x = PI / 2; g.add(m);
    return g;
  }

  /* ---------------------------------------------------------------- inspect */
  R('brake-lines.inspect', {
    duration: 8, camera: { pos: [-0.62, 0.42, -0.52], target: [-0.15, 0.2, -0.08], fov: 34 }, shadow: 0.9, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = corner(K, { rusty: true }); root.add(c.group);
      var h = hose(K, hosePts(c), 0); c.group.add(h);
      var line = steelLine(K, c, true); c.group.add(line);
      var bulge = K.mesh(K.G.sphere(0.011, 16), K.M.clone('rubber'));
      bulge.position.copy(h.userData.curve.getPoint(0.45)); bulge.scale.set(1, 1.6, 1); c.group.add(bulge);
      var glowB = K.FX.glow(bulge, 0xe5484d), glowL = K.FX.glow(line.children[0], 0xf5a524);
      var torch = new THREE.Group();
      var tb = K.mesh(K.G.cylX(0.016, 0.16, 20), 'plasticBlack'); tb.position.x = 0.08; torch.add(tb);
      var lens = K.mesh(K.G.cylX(0.02, 0.012, 20), 'lightWhite'); torch.add(lens);
      root.add(torch);
      var beam = K.mesh(new THREE.ConeGeometry(0.06, 0.3, 24, 1, true), K.M.clone('lightWhite', { transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide }));
      beam.rotation.z = PI / 2; beam.position.x = -0.15; beam.userData.noShadow = true; torch.add(beam);
      return {
        root: root,
        update: function (t) {
          var p1 = h.userData.curve.getPoint(0.45).clone().add(new THREE.Vector3(0.3, 0.02, 0.05));
          var p2 = line.userData.curve.getPoint(0.5).clone().add(new THREE.Vector3(0.3, 0.02, 0.08));
          var k = T.seg(t, 3.5, 4.5);
          torch.position.copy(p1.lerp(p2, k));
          var press = t < 3.5 ? Math.max(0, Math.sin(t * PI)) : 0;
          bulge.scale.set(1 + press * 0.35, 1.6 + press * 0.4, 1 + press * 0.35);
          glowB(t < 3.5 ? 0.3 + press * 0.7 : 0);
          glowL(t > 4.3 ? 0.5 + 0.5 * Math.sin(t * 5) : 0);
        },
        labels: [
          { text: V('nafouknutí při sešlápnutí = výměna', 'bulges when pressed = replace'), at: function () { return h.userData.curve.getPoint(0.45).add(new THREE.Vector3(0.02, 0.05, 0.02)); }, show: [0.6, 3.6], level: 'danger' },
          { text: V('rez se šupinami / důlky = výměna', 'flaking rust / pitting = replace'), at: function () { return line.userData.curve.getPoint(0.55).add(new THREE.Vector3(0, 0.04, 0)); }, show: [4.4, 8], level: 'danger' }
        ],
        captions: [
          { text: V('Pomocník sešlápne pedál – sledujte hadici', 'Helper presses the pedal – watch the hose'), show: [0, 3.6] },
          { text: V('Trubky po celé délce: rez, prodření, vlhko na spojích', 'Lines along their full length: rust, chafing, wet joints'), show: [3.6, 8] },
          { text: V('Vlhko nebo nafouknutí = nejezdit!', 'Wet or bulging = do not drive!'), level: 'danger', show: [5, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ flares */
  R('brake-lines.flares', {
    duration: 8, camera: { pos: [0.02, 0.07, 0.26], target: [0, 0.035, 0], fov: 34 }, shadow: 0.25, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      function cutaway(type) {
        var g = new THREE.Group();
        var half = PI; // half section so the profile is visible
        var tube = new THREE.Mesh(new THREE.CylinderGeometry(0.0024, 0.0024, 0.05, 24, 1, true, 0, half), K.M.clone('copper', { side: THREE.DoubleSide }));
        tube.position.y = -0.025; g.add(tube);
        var prof = type === 'din'
          ? [[0.0017, 0], [0.0024, 0], [0.0036, 0.0018], [0.0036, 0.0032], [0.0024, 0.0048], [0.0017, 0.0048]]
          : [[0.0017, 0], [0.0024, 0], [0.0046, 0.0026], [0.0046, 0.0036], [0.003, 0.0036], [0.0017, 0.0022]];
        var fl = new THREE.Mesh(new THREE.LatheGeometry(prof.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 24, 0, half), K.M.clone('copper', { side: THREE.DoubleSide }));
        g.add(fl);
        var nut = new THREE.Mesh(new THREE.LatheGeometry([[0.0026, -0.012], [0.0055, -0.012], [0.0055, -0.001], [0.0038, -0.001], [0.0038, 0.0005]].map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 6, 0, half), K.M.clone('zinc', { side: THREE.DoubleSide }));
        g.add(nut);
        var seat = new THREE.Mesh(new THREE.LatheGeometry((type === 'din'
          ? [[0.0016, 0.012], [0.0016, 0.0049], [0.0024, 0.0049], [0.0037, 0.0033], [0.0062, 0.0033], [0.0062, 0.012]]
          : [[0.0016, 0.012], [0.0016, 0.0037], [0.0031, 0.0037], [0.0047, 0.0037], [0.0062, 0.0037], [0.0062, 0.012]]).map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 24, 0, half), K.M.clone('steelDark', { side: THREE.DoubleSide }));
        g.add(seat);
        g.userData.seat = seat;
        return g;
      }
      var a = cutaway('din'); a.position.set(-0.035, 0.03, 0); a.scale.setScalar(4); a.rotation.y = PI / 2; root.add(a);
      var b = cutaway('sae'); b.position.set(0.035, 0.03, 0); b.scale.setScalar(4); b.rotation.y = PI / 2; root.add(b);
      var base = K.mesh(K.G.rbox(0.14, 0.006, 0.06, 0.002), 'plasticGrey'); base.position.y = -0.075 + 0.03; root.add(base);
      return {
        root: root,
        update: function (t) {
          var k = K.T.seg(t, 0.5, 2.5) - K.T.seg(t, 6.5, 7.6);
          a.userData.seat.position.y = 0.02 * (1 - k); b.userData.seat.position.y = 0.02 * (1 - k);
          root.rotation.y = Math.sin(t * 0.8) * 0.35;
        },
        labels: [
          { text: V('DIN/ISO „bubble“', 'DIN/ISO "bubble"'), at: [-0.035, 0.085, 0], level: 'accent' },
          { text: V('SAE dvojitý lem', 'SAE double flare'), at: [0.035, 0.085, 0], level: 'accent' }
        ],
        captions: [
          { text: V('Řez lemem: tvar musí odpovídat dosedací ploše šroubení', 'Flare cut-away: the shape must match the fitting seat') },
          { text: V('Lemy NIKDY nekombinovat – pod tlakem povolí', 'NEVER mix flare types – they let go under pressure'), level: 'danger', show: [3, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------- hose clamp */
  R('brake-lines.clamp', {
    duration: 7, camera: { pos: [-0.62, 0.46, -0.48], target: [-0.2, 0.28, -0.12], fov: 36 }, shadow: 0.9, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = corner(K); root.add(c.group);
      var h = hose(K, hosePts(c), 0); c.group.add(h);
      c.group.add(steelLine(K, c, false));
      var cp = h.userData.curve.getPoint(0.55), tg = h.userData.curve.getTangent(0.55).normalize();
      var pl = new THREE.Group(); pl.position.copy(cp); pl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tg); c.group.add(pl);
      var jaws = [];
      [-1, 1].forEach(function (s) {
        var j = new THREE.Group();
        var jaw = K.mesh(K.G.rbox(0.008, 0.03, 0.012, 0.002), 'plasticBlack'); jaw.position.set(s * 0.012, 0, 0); j.add(jaw);
        var arm = K.mesh(K.G.rbox(0.008, 0.008, 0.11, 0.003), 'toolBlue'); arm.position.set(s * 0.012, 0, 0.06); j.add(arm);
        pl.add(j); jaws.push({ g: j, s: s });
      });
      var res = new THREE.Group(); res.position.set(-0.36, 0.5, -0.05); res.rotation.y = -2.2; root.add(res);
      var tank = K.mesh(K.G.rbox(0.1, 0.07, 0.07, 0.015), K.M.clone('plasticWhite', { transparent: true, opacity: 0.55 })); res.add(tank);
      var fluid = K.mesh(K.G.box(0.09, 0.045, 0.06), 'brakeFluid'); fluid.position.y = -0.008; res.add(fluid);
      var film = K.mesh(K.G.cyl(0.03, 0.001, 24), K.M.clone('glassClear', { opacity: 0.5 })); film.position.y = 0.04; res.add(film);
      var cap = K.mesh(K.G.cyl(0.024, 0.02, 24), 'plasticBlack'); res.add(cap);
      return {
        root: root,
        update: function (t) {
          var fk = T.seg(t, 0.4, 1.4), ck = T.seg(t, 1.6, 2.4);
          film.position.y = 0.06 - fk * 0.02; film.visible = t > 0.3;
          cap.position.y = 0.08 - ck * 0.035;
          var k = T.seg(t, 3, 4.2);
          jaws.forEach(function (j) { j.g.position.x = -j.s * 0.008 * k; });
        },
        labels: [
          { text: V('fólie pod víčko', 'film under the cap'), at: function () { return res.position.clone().add(new THREE.Vector3(0, 0.1, 0)); }, show: [0.4, 3] },
          { text: V('svorka jen na gumovou hadici', 'clamp on the rubber hose only'), at: function () { return cp.clone().add(new THREE.Vector3(0.02, 0.05, 0)); }, show: [3, 7], level: 'accent' }
        ],
        captions: [
          { text: V('Omezte únik: fólie pod víčko + kleště na hadice', 'Limit loss: film under the cap + hose clamp pliers') },
          { text: V('Nikdy kombinačky ani zuby – poškodí hadici!', 'Never pliers or toothed clamps – they damage the hose!'), level: 'danger', show: [3, 7] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------- flare nut */
  R('brake-lines.flarenut', {
    duration: 6, camera: { pos: [-0.38, 0.4, -0.32], target: [-0.17, 0.29, -0.09], fov: 32 }, shadow: 0.6, thumbT: 2.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = corner(K); root.add(c.group);
      c.group.add(hose(K, hosePts(c), 0));
      var line = steelLine(K, c, false); c.group.add(line);
      var nut = line.userData.nut, hx = line.userData.hex;
      var fw = flareWrench(K); var fwh = new THREE.Group(); fwh.position.copy(nut.position); fwh.add(fw); c.group.add(fwh);
      var sp = K.P.spanner(0.13, 0.0085); var sph = new THREE.Group(); sph.position.copy(hx.position); sph.add(sp); sph.rotation.y = PI * 0.8; c.group.add(sph);
      var arrow = K.FX.rotArrow(0.03, 'ccw', 0xf5a524, 220, 0.003); arrow.rotation.x = -PI / 2; arrow.position.copy(nut.position).add(new THREE.Vector3(0, 0.012, 0)); c.group.add(arrow);
      var spray = K.FX.drops(K.M.clone('oil', { opacity: 0.6 }), 6, 0.05, 0.003); spray.group.position.copy(nut.position).add(new THREE.Vector3(0.02, 0.05, 0.02)); c.group.add(spray.group);
      return {
        root: root,
        update: function (t) {
          spray.update(t, t < 1.6, 2);
          var k = T.seg(t, 2, 3.4) - T.seg(t, 4.6, 5.6);
          fwh.rotation.y = 0.4 + k * 0.9;
          nut.rotation.y = k * 0.9;
          arrow.visible = t > 1.8;
        },
        labels: [
          { text: V('klíč na převlečné matice', 'flare-nut wrench'), at: function () { return nut.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(-0.04, 0.04, -0.03)); }, show: [1.8, 6], level: 'accent' },
          { text: V('kontra na šestihran hadice', 'counter-hold the hose hex'), at: function () { return hx.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(-0.03, -0.03, -0.02)); }, show: [2, 6] }
        ],
        captions: [
          { text: V('Penetrační olej, nechat působit', 'Penetrating oil, let it soak'), show: [0, 1.8] },
          { text: V('Povolit klíčem na trubky + držet kontru – trubka se nezkroutí', 'Loosen with a flare-nut wrench + counter-hold – the line will not twist'), show: [1.8, 6] },
          { text: V('Zakulacená matice = trubku vyměnit', 'Rounded nut = replace the line'), level: 'info', show: [4, 6] }
        ]
      };
    }
  });

  /* ---------------------------------------------------------------- hose */
  R('brake-lines.hose', {
    duration: 10, camera: { pos: [-0.62, 0.42, -0.52], target: [-0.15, 0.2, -0.08], fov: 34 }, shadow: 0.9, thumbT: 7.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = corner(K); root.add(c.group);
      c.group.add(steelLine(K, c, false));
      var oldH = hose(K, hosePts(c), 0); c.group.add(oldH);
      var bad = hose(K, hosePts(c), 1.2); c.group.add(bad);
      var good = hose(K, hosePts(c), 0); c.group.add(good);
      var fOld = K.FX.fader(oldH), fBad = K.FX.fader(bad), fGood = K.FX.fader(good);
      var banjo = new THREE.Group(); banjo.position.copy(c.banjo); c.group.add(banjo);
      var bh = K.mesh(K.G.hex(0.009, 0.01), 'zinc'); bh.rotation.x = PI / 2; bh.position.z = -0.012; banjo.add(bh);
      var bs = K.mesh(K.G.cylZ(0.005, 0.03, 12), 'zinc'); banjo.add(bs);
      var wash = [];
      [-0.006, 0.006].forEach(function (z) { var w = K.mesh(K.G.torus(0.0075, 0.0015, PI * 2, 20), 'copper'); w.position.z = z - 0.006; banjo.add(w); wash.push(w); });
      var cross = new THREE.Group();
      [1, -1].forEach(function (s) { var b = K.mesh(K.G.box(0.05, 0.008, 0.008), 'hiDanger'); b.rotation.z = s * PI / 4; cross.add(b); });
      cross.position.copy(c.top).add(new THREE.Vector3(0.12, -0.12, 0.06)); c.group.add(cross);
      return {
        root: root,
        update: function (t) {
          var out = T.seg(t, 0.6, 2.0);
          bh.position.z = -0.012 - out * 0.05; bs.position.z = -out * 0.05;
          wash.forEach(function (w, i) { w.position.z = -0.006 + (i ? 0.006 : -0.006) - out * (0.03 + i * 0.02); });
          fOld(1 - T.seg(t, 2.2, 3));
          fBad(T.seg(t, 3.2, 3.8) * (1 - T.seg(t, 5.6, 6.2)));
          cross.visible = t > 3.8 && t < 5.6;
          fGood(T.seg(t, 6.2, 6.8));
          var back = T.seg(t, 7, 8.2);
          if (t > 6.2) { bh.position.z = -0.012 - (1 - back) * 0.05; bs.position.z = -(1 - back) * 0.05; wash.forEach(function (w, i) { w.position.z = -0.006 + (i ? 0.006 : -0.006) - (1 - back) * (0.03 + i * 0.02); }); }
        },
        labels: [
          { text: V('staré měděné podložky vyhodit', 'discard old copper washers'), at: function () { return wash[1].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.03, 0.02, 0)); }, show: [1.2, 2.6] },
          { text: V('✖ zkroucená hadice (proužek ve spirále)', '✖ twisted hose (spiral stripe)'), at: function () { return cross.position.clone().add(new THREE.Vector3(0, 0.04, 0)); }, show: [3.8, 5.6], level: 'danger' },
          { text: V('✔ proužek rovně, nové podložky', '✔ stripe straight, new washers'), at: function () { return good.userData.curve.getPoint(0.5).add(new THREE.Vector3(0.03, 0.03, 0.02)); }, show: [7, 10], level: 'ok' }
        ],
        captions: [
          { text: V('Dutý šroub ven, podložky vyhodit', 'Banjo bolt out, washers in the bin'), show: [0, 3] },
          { text: V('Hadice se NESMÍ zkroutit – rychle praskne', 'The hose must NOT be twisted – it bursts quickly'), level: 'danger', show: [3, 6.2] },
          { text: V('Nejdřív na třmen, pak do držáku – proužek rovně', 'Caliper end first, then the bracket – stripe straight'), show: [6.2, 10] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------- flaring */
  R('brake-lines.flaring', {
    duration: 10, camera: { pos: [0.24, 0.2, 0.3], target: [0, 0.07, 0], fov: 32 }, shadow: 0.4, thumbT: 6.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bench = K.mesh(K.G.rbox(0.5, 0.03, 0.25, 0.006), 'wood'); bench.position.y = -0.015; root.add(bench);
      var vice = K.mesh(K.G.rbox(0.09, 0.06, 0.06, 0.006), 'toolBlue'); vice.position.set(0, 0.03, 0); root.add(vice);
      var bar = K.mesh(K.G.rbox(0.16, 0.022, 0.03, 0.004), 'steel'); bar.position.set(0, 0.07, 0); root.add(bar);
      var tube = K.mesh(K.G.cyl(0.0024, 0.3, 16), 'copper'); tube.rotation.z = PI / 2; tube.position.set(-0.12, 0.095, 0); root.add(tube);
      var tubeV = new THREE.Group(); tubeV.position.set(0, 0.07, 0); root.add(tubeV);
      var stub = K.mesh(K.G.cyl(0.0024, 0.03, 16), 'copper'); stub.position.y = 0.015; tubeV.add(stub);
      var flare = K.mesh(K.G.lathe([[0.0017, 0], [0.0024, 0], [0.0036, 0.0018], [0.0036, 0.0032], [0.0024, 0.0048], [0.0017, 0.0048]], 24), 'copper');
      flare.position.y = 0.03; tubeV.add(flare);
      var nuts = [];
      [0.0, 0.025].forEach(function (y) { var n = K.mesh(K.G.hex(0.0055, 0.011), 'zinc'); n.position.set(0, -0.02 - y, 0); tubeV.add(n); nuts.push(n); });
      var yoke = new THREE.Group(); yoke.position.set(0, 0.07, 0); root.add(yoke);
      var arch = K.mesh(K.G.rbox(0.07, 0.012, 0.02, 0.003), 'steel'); arch.position.y = 0.08; yoke.add(arch);
      [-1, 1].forEach(function (s) { var leg = K.mesh(K.G.box(0.008, 0.08, 0.016), 'steel'); leg.position.set(s * 0.03, 0.04, 0); yoke.add(leg); });
      var screw = new THREE.Group(); yoke.add(screw);
      var sc = K.mesh(K.G.cyl(0.005, 0.07, 16), 'chrome'); sc.position.y = 0.09; screw.add(sc);
      var die = K.mesh(K.G.cyl(0.006, 0.01, 16, 0.003), 'chrome'); die.position.y = 0.05; screw.add(die);
      var handle = K.mesh(K.G.cylX(0.003, 0.08, 10), 'chrome'); handle.position.y = 0.122; screw.add(handle);
      yoke.visible = false;
      return {
        root: root,
        update: function (t) {
          var cut = T.seg(t, 0.2, 1.2);
          tube.visible = t < 1.4; tubeV.visible = t >= 1.4;
          nuts.forEach(function (n, i) { n.position.y = -0.02 - i * 0.025 - (1 - T.seg(t, 2 + i * 0.5, 2.6 + i * 0.5)) * 0.06; n.visible = t > 2; });
          yoke.visible = t > 3.6;
          var press = T.seg(t, 4.4, 6.4);
          screw.position.y = 0.012 - press * 0.012;
          screw.rotation.y = press * PI * 6;
          flare.visible = t > 5.2 && t < 9.4;
          var s = 0.4 + 0.6 * T.seg(t, 5.2, 6.4);
          flare.scale.set(s, 1, s);
          if (t > 7.2) yoke.visible = false;
          tubeV.rotation.y = t > 7.2 ? (t - 7.2) * 1.2 : 0;
          tube.scale.y = 1 - 0.3 * cut;
        },
        labels: [
          { text: V('1. řez řezákem + odhrotovat', '1. cut with a tube cutter + deburr'), at: [-0.03, 0.12, 0], show: [0, 2] },
          { text: V('2. matice navléknout PŘED lemováním!', '2. nuts on BEFORE flaring!'), at: [0.03, 0.04, 0.02], show: [2, 3.6], level: 'danger' },
          { text: V('3. lemovačka tvaruje lem', '3. the tool forms the flare'), at: [0, 0.17, 0], show: [3.8, 7] },
          { text: V('lem souměrný, bez trhlin', 'flare symmetrical, no cracks'), at: [0, 0.12, 0], show: [7.2, 10], level: 'ok' }
        ],
        captions: [
          { text: V('Trubka: řez → matice → lem → kontrola', 'Line: cut → nuts → flare → check') },
          { text: V('Prasklý lem = uříznout a znovu', 'Cracked flare = cut off and redo'), level: 'danger', show: [7.2, 10] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ bend */
  R('brake-lines.bend', {
    duration: 7, camera: { pos: [0.02, 0.3, 0.22], target: [0.02, 0, 0.02], fov: 34 }, shadow: 0.4, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bench = K.mesh(K.G.rbox(0.5, 0.03, 0.3, 0.006), 'wood'); bench.position.y = -0.03; root.add(bench);
      var R0 = 0.04;
      var wheel = K.mesh(K.G.cyl(R0 - 0.003, 0.02, 40), 'steel'); wheel.position.y = 0; root.add(wheel);
      var groove = K.mesh(K.G.torus(R0, 0.0032, PI * 2, 48), 'steelDark'); groove.rotation.x = PI / 2; root.add(groove);
      var straight = K.mesh(K.G.cylX(0.0025, 0.2, 12), 'copper'); straight.position.set(-0.1, 0, R0 + 0.0045); root.add(straight);
      var pieces = [], N = 12;
      for (var i = 0; i < N; i++) {
        var p = K.mesh(K.G.torus(R0 + 0.0045, 0.0025, PI / 2 / N + 0.002, 4), 'copper');
        p.rotation.x = PI / 2; p.rotation.z = PI / 2 - (i + 1) * (PI / 2 / N);
        p.position.y = 0; root.add(p); pieces.push(p);
      }
      var tail = new THREE.Group(); root.add(tail);
      var tailM = K.mesh(K.G.cylX(0.0025, 0.12, 12), 'copper'); tailM.position.x = 0.06; tail.add(tailM);
      var lever = new THREE.Group(); root.add(lever);
      var lv = K.mesh(K.G.rbox(0.16, 0.012, 0.02, 0.004), 'toolRed'); lv.position.x = 0.08; lever.add(lv);
      var shoe = K.mesh(K.G.rbox(0.03, 0.02, 0.014, 0.004), 'steelDark'); shoe.position.set(0.0, 0, 0); lever.add(shoe);
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 1, 4.5) * (1 - T.seg(t, 6.4, 7));
          var ang = k * PI / 2;
          pieces.forEach(function (p, i) { p.visible = (i + 1) / N <= k + 1e-6; });
          var px = Math.sin(ang) * (R0 + 0.0045), pz = Math.cos(ang) * (R0 + 0.0045);
          tail.position.set(px, 0, pz); tail.rotation.y = -ang;
          lever.position.set(px, 0.012, pz + 0.008 * Math.cos(ang)); lever.rotation.y = -ang;
        },
        labels: [{ text: V('plynulý ohyb, žádné zalomení', 'smooth bend, no kink'), at: [0.04, 0.05, 0.04], show: [2, 7], level: 'ok' }],
        captions: [
          { text: V('Ohýbat ohýbačkou nebo přes trn', 'Bend with a bender or over a mandrel') },
          { text: V('Vést přesně jako originál – do spon, mimo výfuk a hrany', 'Route exactly like the original – into clips, away from exhaust and edges'), show: [3, 7] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------- fit */
  R('brake-lines.fit', {
    duration: 7, camera: { pos: [-0.38, 0.4, -0.32], target: [-0.17, 0.29, -0.09], fov: 32 }, shadow: 0.6, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = corner(K); root.add(c.group);
      c.group.add(hose(K, hosePts(c), 0));
      var line = steelLine(K, c, false); c.group.add(line);
      var nut = line.userData.nut, base = nut.position.clone();
      var tw = K.P.torqueWrench(0.3); var holder = new THREE.Group(); holder.add(tw); c.group.add(holder);
      tw.scale.setScalar(0.7);
      var glove = K.P.glove(); glove.scale.setScalar(0.6); c.group.add(glove);
      return {
        root: root,
        update: function (t) {
          var hand = T.seg(t, 0.4, 2.6);
          nut.position.copy(base).add(new THREE.Vector3(0, 0.02 * (1 - hand), 0));
          nut.rotation.y = hand * PI * 4;
          glove.visible = t < 2.8;
          glove.position.copy(nut.position).add(new THREE.Vector3(0.03, 0.03, 0.04)); glove.rotation.z = -hand * 1.5;
          holder.visible = t > 3;
          holder.position.copy(base).add(new THREE.Vector3(0, 0.01, 0));
          holder.rotation.y = 0.3 + T.seg(t, 3.6, 5) * 0.5;
        },
        labels: [
          { text: V('rukou – nesmí drhnout', 'by hand – must not bind'), at: function () { return nut.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.04, 0.03, 0.03)); }, show: [0.4, 3], level: 'accent' },
          { text: V('cca 14–16 Nm (ověřit)', 'approx. 14–16 Nm (verify)'), at: function () { return nut.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.08, 0.04, 0.03)); }, show: [5, 7], level: 'ok' }
        ],
        captions: [
          { text: V('Matici nejdřív rukou, pak dotáhnout', 'Nut by hand first, then tighten') },
          { text: V('Přetažení zdeformuje lem', 'Over-tightening deforms the flare'), level: 'info', show: [4, 7] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ leak */
  R('brake-lines.leak', {
    duration: 8, camera: { pos: [-0.7, 0.48, -0.6], target: [-0.15, 0.2, -0.08], fov: 36 }, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = corner(K); root.add(c.group);
      var h = hose(K, hosePts(c), 0); c.group.add(h);
      var line = steelLine(K, c, false); c.group.add(line);
      var gauge = K.FX.canvasPanel(0.12, 0.12, function (x, W, H, st) {
        var bar = st ? st.b : 0;
        x.fillStyle = '#0f1b26'; x.beginPath(); x.arc(W / 2, H / 2, W * 0.48, 0, PI * 2); x.fill();
        x.strokeStyle = '#2a3a4a'; x.lineWidth = W * 0.05; x.beginPath(); x.arc(W / 2, H / 2, W * 0.36, PI * 0.75, PI * 2.25); x.stroke();
        x.strokeStyle = '#30a46c'; x.beginPath(); x.arc(W / 2, H / 2, W * 0.36, PI * 0.75, PI * 0.75 + PI * 1.5 * bar / 120); x.stroke();
        x.fillStyle = '#fff'; x.font = 'bold ' + Math.round(H * 0.16) + 'px system-ui'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText(bar + ' bar', W / 2, H / 2);
      }, { state: { b: 0 }, px: 256 });
      gauge.position.set(-0.42, 0.42, -0.02); gauge.rotation.y = -2.3; root.add(gauge);
      var towel = K.mesh(K.G.box(0.05, 0.002, 0.05), 'plasticWhite'); root.add(towel);
      var checks = [];
      return {
        root: root,
        update: function (t) {
          var p = Math.round(T.seg(t, 0.5, 1.8) * 110 * (1 - T.seg(t, 7.2, 7.8)));
          gauge.userData.redraw({ b: Math.round(p / 10) * 10 });
          var tA = line.userData.nut.getWorldPosition(new THREE.Vector3()), tB = c.banjo.clone().add(c.group.position);
          var k = T.seg(t, 2.2, 3.8), k2 = T.seg(t, 4.4, 6);
          towel.position.copy(tA.clone().lerp(tB, k2)).add(new THREE.Vector3(0.02, 0.02 + Math.sin(t * 8) * 0.003 * k, 0.02));
          towel.rotation.z = 0.6;
        },
        labels: [
          { text: V('✔ suchý spoj', '✔ joint dry'), at: function () { return line.userData.nut.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.03, 0.05, 0)); }, show: [3.6, 8], level: 'ok' },
          { text: V('✔ suchý spoj', '✔ joint dry'), at: function () { return c.banjo.clone().add(new THREE.Vector3(0.03, 0.04, 0)); }, show: [6, 8], level: 'ok' }
        ],
        captions: [
          { text: V('Pomocník drží pedál silou 30 s', 'Helper holds the pedal hard for 30 s') },
          { text: V('Každý spoj otřít ubrouskem – musí zůstat suchý', 'Wipe every joint with a towel – it must stay dry'), show: [2, 8] },
          { text: V('Kapka = předělat a znovu odvzdušnit', 'A drop = redo and bleed again'), level: 'danger', show: [5, 8] }
        ]
      };
    }
  });
})(window.STU);
