/* 3D scenes: manual gearbox & clutch noise diagnosis. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  /** Expanding "sound" rings around a point (in the YZ plane, facing the camera roughly). */
  function waves(K, color, n) {
    var g = new THREE.Group(), list = [];
    var mat = new THREE.MeshBasicMaterial({ color: color || 0xe5484d, transparent: true, opacity: 0.7, depthWrite: false });
    for (var i = 0; i < (n || 3); i++) { var r = new THREE.Mesh(K.G.torus(0.04, 0.0025, PI * 2, 40), mat.clone()); r.userData.noShadow = true; g.add(r); list.push(r); }
    return {
      group: g,
      update: function (t, on) {
        list.forEach(function (r, i) {
          var k = ((t * 1.3) + i / list.length) % 1;
          r.visible = !!on; r.scale.setScalar(0.5 + k * 2.2); r.material.opacity = (1 - k) * 0.75;
        });
      }
    };
  }

  /** HUD panel: pedal / gear / engine state. */
  function hud(K, st) {
    var p = K.FX.canvasPanel(0.34, 0.1, function (x, W, H, s) {
      s = s || {};
      x.fillStyle = 'rgba(14,17,23,0.88)'; x.fillRect(0, 0, W, H);
      x.font = 'bold ' + Math.round(H * 0.3) + 'px system-ui, Arial'; x.textBaseline = 'middle';
      var cells = [
        [S.t(V('Spojka', 'Clutch')), s.clutch ? S.t(V('SEŠLÁPNUTÁ', 'PRESSED')) : S.t(V('puštěná', 'released')), s.clutch ? '#f5a524' : '#9aa5b8'],
        [S.t(V('Převod', 'Gear')), s.gear || 'N', '#ffffff'],
        [S.t(V('Motor', 'Engine')), s.engine === false ? S.t(V('VYP', 'OFF')) : S.t(V('volnoběh', 'idle')), s.engine === false ? '#e5484d' : '#30a46c']
      ];
      cells.forEach(function (c, i) {
        var cx = W * (0.17 + i * 0.33);
        x.textAlign = 'center'; x.fillStyle = '#9aa5b8'; x.font = Math.round(H * 0.22) + 'px system-ui, Arial'; x.fillText(c[0], cx, H * 0.3);
        x.fillStyle = c[2]; x.font = 'bold ' + Math.round(H * 0.3) + 'px system-ui, Arial'; x.fillText(c[1], cx, H * 0.68);
      });
    }, { state: st || {}, px: 512 });
    return p;
  }

  /** Gearbox cut-away: input shaft (top) and output shaft (bottom) along X with 5 gear pairs,
   *  bearings, a synchro between 3rd/4th, clutch pack + DMF on the left. */
  function gearbox(K) {
    var root = new THREE.Group(); root.position.y = 0.42;
    var caseM = K.mesh(K.G.rbox(0.48, 0.32, 0.26, 0.05), K.M.clone('glassClear', { opacity: 0.16, depthWrite: false }));
    caseM.userData.noShadow = true; root.add(caseM);
    var bell = K.mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.12, 40, 1, true), K.M.clone('aluCast', { transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false }));
    bell.rotation.z = PI / 2; bell.position.x = -0.3; bell.userData.noShadow = true; root.add(bell);
    var inS = new THREE.Group(); inS.position.y = 0.065; root.add(inS);
    var outS = new THREE.Group(); outS.position.y = -0.065; root.add(outS);
    inS.add(K.mesh(K.G.cylX(0.012, 0.62, 16), 'steel')); inS.children[0].position.x = -0.08;
    outS.add(K.mesh(K.G.cylX(0.014, 0.5, 16), 'steel'));
    var xs = [-0.16, -0.09, -0.02, 0.06, 0.13], rin = [0.026, 0.033, 0.04, 0.047, 0.054];
    var pairs = [];
    xs.forEach(function (x, i) {
      var ri = rin[i], ro = 0.127 - ri;
      var gi = K.G.gear(Math.round(ri * 560), ri, ri - 0.005, 0.022, 0.012); gi.rotateY(PI / 2);
      var go = K.G.gear(Math.round(ro * 560), ro, ro - 0.005, 0.022, 0.014); go.rotateY(PI / 2);
      var mi = K.mesh(gi, 'steel'); mi.position.x = x; inS.add(mi);
      var mo = K.mesh(go, 'steelDark'); mo.position.x = x; outS.add(mo);
      pairs.push({ i: mi, o: mo, ratio: ri / ro });
    });
    var bearings = [];
    [[inS, -0.23], [inS, 0.2], [outS, -0.22], [outS, 0.2]].forEach(function (b) {
      var g = new THREE.Group(); g.position.x = b[1];
      var race = K.mesh(K.G.torus(0.028, 0.006, PI * 2, 28), 'chrome'); race.rotation.y = PI / 2; g.add(race);
      for (var k = 0; k < 8; k++) { var bl = K.mesh(K.G.sphere(0.006, 8), 'chrome'); var a = k / 8 * PI * 2; bl.position.set(0, Math.cos(a) * 0.022, Math.sin(a) * 0.022); g.add(bl); }
      b[0].parent.add(g); g.position.y = b[0].position.y; bearings.push(g);
    });
    var syn = new THREE.Group(); syn.position.set(0.02, -0.065, 0); root.add(syn);
    var sleeve = K.mesh(K.G.cylX(0.04, 0.02, 32), 'zinc'); syn.add(sleeve);
    var groove = K.mesh(K.G.torus(0.04, 0.003, PI * 2, 32), 'steelDark'); groove.rotation.y = PI / 2; syn.add(groove);
    var ring = K.mesh(K.G.torus(0.034, 0.004, PI * 2, 32), 'brass'); ring.rotation.y = PI / 2; ring.position.x = 0.018; root.add(ring); ring.position.y = -0.065;
    var clutch = new THREE.Group(); clutch.position.set(-0.3, 0.065, 0); root.add(clutch);
    var dmf = new THREE.Group(); dmf.position.x = -0.1; clutch.add(dmf);
    dmf.add(K.mesh(K.G.cylX(0.13, 0.025, 48), 'castIron'));
    var ringGear = K.G.gear(120, 0.14, 0.133, 0.02, 0.12); ringGear.rotateY(PI / 2); dmf.add(K.mesh(ringGear, 'steelDark'));
    var springs = [];
    for (var s = 0; s < 2; s++) {
      var pts = []; for (var q = 0; q <= 40; q++) { var aa = s * PI + q / 40 * PI * 0.8, rr = 0.09; pts.push([0.016 + Math.sin(q * 1.6) * 0.006, Math.cos(aa) * rr + Math.cos(q * 1.6) * 0.006, Math.sin(aa) * rr]); }
      var sp = K.mesh(K.G.tube(pts, 0.003, false, 120, 6), 'steel'); dmf.add(sp); springs.push(sp);
    }
    var disc = K.mesh(K.G.latheZ([[0.06, -0.004], [0.11, -0.004], [0.11, 0.004], [0.06, 0.004]], 48), 'padFriction'); disc.rotation.y = PI / 2; disc.position.x = -0.07; clutch.add(disc);
    var plate = K.mesh(K.G.cylX(0.12, 0.03, 48), 'steel'); plate.position.x = -0.04; clutch.add(plate);
    var fingers = new THREE.Group(); fingers.position.x = -0.02; clutch.add(fingers);
    for (var f = 0; f < 12; f++) { var fg = K.mesh(K.G.box(0.004, 0.07, 0.012), 'steelDark'); var fa = f / 12 * PI * 2; fg.position.set(0, Math.cos(fa) * 0.06, Math.sin(fa) * 0.06); fg.rotation.x = -fa; fingers.add(fg); }
    var release = new THREE.Group(); release.position.x = 0.03; clutch.add(release);
    release.add(K.mesh(K.G.cylX(0.035, 0.03, 32), 'steelDark'));
    var rb = K.mesh(K.G.torus(0.03, 0.006, PI * 2, 28), 'chrome'); rb.rotation.y = PI / 2; rb.position.x = -0.016; release.add(rb);
    var crank = K.mesh(K.G.cylX(0.03, 0.08, 20), 'castIron'); crank.position.x = -0.16; clutch.add(crank);
    var engine = K.mesh(K.G.rbox(0.08, 0.36, 0.34, 0.04), K.M.clone('castIron', { transparent: true, opacity: 0.35, depthWrite: false })); engine.position.set(-0.52, 0.065, 0); engine.userData.noShadow = true; root.add(engine);
    var stand = K.mesh(K.G.rbox(0.5, 0.06, 0.26, 0.02), 'plasticGrey'); stand.position.set(0, -0.2, 0); root.add(stand);
    var legs = K.mesh(K.G.box(0.04, 0.2, 0.04), 'plasticGrey'); legs.position.set(0, -0.32, 0); root.add(legs);
    var st = { inA: 0, outA: 0 };
    return {
      root: root, inS: inS, outS: outS, pairs: pairs, bearings: bearings, syn: syn, ring: ring, clutch: clutch, dmf: dmf, disc: disc,
      plate: plate, release: release, springs: springs,
      /** advance rotation: inW = input shaft speed (rad/s), engW = engine speed, gear index (0..4) or -1 for neutral */
      spin: function (dt, engW, inW, gear) {
        st.inA += inW * dt; st.eA = (st.eA || 0) + engW * dt;
        pairs.forEach(function (p) { p.i.rotation.x = st.inA; });
        var outW = gear >= 0 ? -inW * pairs[gear].ratio : 0;
        st.outA += outW * dt;
        pairs.forEach(function (p) { p.o.rotation.x = gear >= 0 ? st.outA : -st.inA * p.ratio; });
        dmf.rotation.x = st.eA; plate.rotation.x = st.inA; disc.rotation.x = st.inA; fingers.rotation.x = st.inA;
      },
      fingers: fingers
    };
  }

  function gbScene(def) {
    return {
      duration: def.duration || 8, camera: def.camera || { pos: [0.25, 0.75, 0.95], target: [-0.08, 0.42, 0], fov: 36 }, shadow: 0.9, thumbT: def.thumbT || 3,
      build: function (ctx, K) {
        var gb = gearbox(K);
        var root = new THREE.Group(); root.add(gb.root);
        var inst = def.make(ctx, K, gb, root);
        var last = 0;
        var up = inst.update;
        inst.root = root;
        inst.update = function (t, dt) {
          var d = t < last ? 0.016 : (t - last); last = t;
          up(t, d, gb);
        };
        return inst;
      }
    };
  }

  /* ------------------------------------------------------------- overview */
  R('gearbox-noise.overview', gbScene({
    duration: 10,
    make: function (ctx, K, gb) {
      var T = K.T;
      var gB = K.FX.glow(gb.bearings[0], 0xf5a524), gP = K.FX.glow(gb.pairs[3].i, 0xf5a524), gS = K.FX.glow(gb.ring, 0xf5a524), gR = K.FX.glow(gb.release, 0xf5a524), gD = K.FX.glow(gb.dmf, 0xf5a524);
      return {
        update: function (t, dt) {
          gb.spin(dt, 8, 8, 3);
          var ph = Math.floor(t / 2);
          gB(ph === 0 ? 1 : 0); gP(ph === 1 ? 1 : 0); gS(ph === 2 ? 1 : 0); gR(ph === 3 ? 1 : 0); gD(ph === 4 ? 1 : 0);
        },
        labels: [
          { text: V('ložisko hřídele – vytí / hučení', 'shaft bearing – whine / hum'), at: function () { return gb.bearings[0].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.06, 0)); }, show: [0, 2], level: 'accent' },
          { text: V('ozubená kola – vytí v převodu', 'gears – whine in a gear'), at: function () { return gb.pairs[3].i.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.08, 0)); }, show: [2, 4], level: 'accent' },
          { text: V('synchron – skřípání při řazení', 'synchro – crunch when shifting'), at: function () { return gb.ring.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -0.06, 0.03)); }, show: [4, 6], level: 'accent' },
          { text: V('vypínací ložisko – zvuk se spojkou', 'release bearing – noise with clutch'), at: function () { return gb.release.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.06, 0)); }, show: [6, 8], level: 'accent' },
          { text: V('dvouhmot – chrastění na volnoběh', 'dual-mass – rattle at idle'), at: function () { return gb.dmf.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.17, 0)); }, show: [8, 10], level: 'accent' }
        ],
        captions: [{ text: V('Řez převodovkou – co může dělat hluk', 'Gearbox cut-away – what can make noise') }]
      };
    }
  }));

  /* ------------------------------------------------------------------ oil */
  R('gearbox-noise.oil', {
    duration: 9, camera: { pos: [0.75, 0.55, 0.85], target: [0.15, 0.3, 0], fov: 36 }, shadow: 0.8, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var box = K.mesh(K.G.rbox(0.5, 0.32, 0.26, 0.05), 'aluCast'); box.position.y = 0.36; root.add(box);
      var cut = K.mesh(K.G.box(0.3, 0.12, 0.004), K.M.clone('glassClear', { opacity: 0.3 })); cut.position.set(0.05, 0.28, 0.131); root.add(cut);
      var oil = K.mesh(K.G.box(0.29, 0.08, 0.002), 'oil'); oil.position.set(0.05, 0.255, 0.132); root.add(oil);
      var fill = K.mesh(K.G.hex(0.014, 0.012), 'zinc'); fill.rotation.x = PI / 2; fill.position.set(0.15, 0.3, 0.14); root.add(fill);
      var glove = K.P.glove(); glove.scale.setScalar(0.7); root.add(glove);
      var drain = new THREE.Group(); root.add(drain);
      drain.add(K.mesh(K.G.hex(0.014, 0.012), 'zinc'));
      var mag = K.mesh(K.G.cyl(0.008, 0.016, 16), 'steelDark'); mag.position.y = 0.014; drain.add(mag);
      var chips = new THREE.Group(); drain.add(chips);
      for (var i = 0; i < 14; i++) { var c = K.mesh(K.G.box(0.003, 0.001, 0.002), 'steel'); var a = i * 1.7; c.position.set(Math.cos(a) * 0.008, 0.015 + (i % 4) * 0.003, Math.sin(a) * 0.008); c.rotation.set(a, a * 2, 0); chips.add(c); }
      var gChips = K.FX.glow(chips, 0xe5484d);
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 0.4, 1.4);
          fill.position.z = 0.14 + k * 0.05; fill.visible = t < 4;
          glove.visible = t > 1.4 && t < 4;
          glove.position.set(0.15, 0.33 - T.seg(t, 1.6, 2.6) * 0.03, 0.2); glove.rotation.set(-PI / 2, 0, 0);
          drain.visible = t > 4.4;
          drain.position.set(0.45, 0.3, 0.1); drain.rotation.set(PI, t * 0.5, 0);
          gChips(t > 5.5 ? 0.6 + 0.4 * Math.sin(t * 5) : 0);
        },
        labels: [
          { text: V('hladina u spodní hrany otvoru', 'level at the lower edge of the hole'), at: [0.15, 0.38, 0.17], show: [1.4, 4], level: 'ok' },
          { text: V('kovové třísky = vnitřní opotřebení', 'metal chips = internal wear'), at: [0.45, 0.36, 0.1], show: [5.5, 9], level: 'danger' }
        ],
        captions: [
          { text: V('Nejdřív olej: hladina a stav (viz Oleje převodovky)', 'Oil first: level and condition (see Drivetrain oils)') },
          { text: V('Jen olej se správnou specifikací (GL-4 vs GL-5!)', 'Only oil with the right spec (GL-4 vs GL-5!)'), level: 'info', show: [4, 9] }
        ]
      };
    }
  });

  /* --------------------------------------------------------------- matrix */
  R('gearbox-noise.matrix', {
    duration: 10, camera: { pos: [0, 0.48, 1.25], target: [0, 0.45, 0], fov: 34 }, shadow: 0.6, thumbT: 2, ground: true,
    build: function (ctx, K) {
      var rows = [
        [V('neutrál, spojka puštěná', 'neutral, clutch released'), V('vstupní ložisko', 'input bearing')],
        [V('jen se sešlápnutou spojkou', 'only with clutch pressed'), V('vypínací ložisko', 'release bearing')],
        [V('chrastí na volnoběh / ťuk při vypnutí', 'idle rattle / knock on switch-off'), V('dvouhmot', 'dual-mass flywheel')],
        [V('vytí v jednom převodu', 'whine in one gear'), V('kolo / ložisko převodu', 'gear / bearing of that gear')],
        [V('skřípe při řazení', 'crunches when shifting'), V('synchron / spojka nevypíná', 'synchro / clutch drag')],
        [V('vyskakuje rychlost', 'jumps out of gear'), V('aretace / vidlice / uložení', 'detent / fork / mounts')]
      ];
      var root = new THREE.Group();
      var board = K.FX.canvasPanel(0.9, 0.56, function (x, W, H, st) {
        x.fillStyle = '#0f1b26'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#1d4f73'; x.fillRect(0, 0, W, H * 0.13);
        x.fillStyle = '#fff'; x.font = 'bold ' + Math.round(H * 0.06) + 'px system-ui'; x.textBaseline = 'middle'; x.textAlign = 'left';
        x.fillText(S.t(V('Kdy to dělá hluk?', 'When does it make noise?')), W * 0.04, H * 0.065);
        x.textAlign = 'right'; x.fillText(S.t(V('Podezřelý díl', 'Suspect part')), W * 0.96, H * 0.065);
        rows.forEach(function (r, i) {
          var y = H * (0.2 + i * 0.135);
          if (st && st.hi === i) { x.fillStyle = 'rgba(245,165,36,0.25)'; x.fillRect(0, y - H * 0.06, W, H * 0.12); }
          x.font = Math.round(H * 0.048) + 'px system-ui'; x.fillStyle = '#e9edf3'; x.textAlign = 'left'; x.fillText(S.t(r[0]), W * 0.04, y);
          x.font = 'bold ' + Math.round(H * 0.048) + 'px system-ui'; x.fillStyle = '#f5a524'; x.textAlign = 'right'; x.fillText('→ ' + S.t(r[1]), W * 0.96, y);
        });
      }, { state: { hi: 0 }, px: 1024 });
      board.position.set(0, 0.45, 0); root.add(board);
      var frame = K.mesh(K.G.rbox(0.94, 0.6, 0.02, 0.01), 'plasticBlack'); frame.position.set(0, 0.45, -0.012); root.add(frame);
      return {
        root: root,
        update: function (t) { board.userData.redraw({ hi: Math.floor(t / (10 / 6)) % 6 }); },
        captions: [{ text: V('Zapište si přesně, KDY zvuk vzniká', 'Note exactly WHEN the noise happens') }]
      };
    }
  });

  /* ------------------------------------------------------- input bearing */
  R('gearbox-noise.input', gbScene({
    duration: 8,
    make: function (ctx, K, gb, root) {
      var T = K.T;
      var w = waves(K, 0xe5484d); w.group.position.copy(gb.bearings[0].position).add(gb.root.position); w.group.rotation.y = PI / 2; root.add(w.group);
      var gl = K.FX.glow(gb.bearings[0], 0xe5484d);
      var h = hud(K, {}); h.position.set(-0.05, 0.82, 0); root.add(h);
      return {
        update: function (t, dt) {
          var pressed = t > 4 && t < 7.5;
          gb.spin(dt, 8, pressed ? 0 : 8, -1);
          gb.release.position.x = 0.03 - (pressed ? 0.012 : 0);
          w.update(t, !pressed); gl(pressed ? 0 : 0.8);
          h.userData.redraw({ clutch: pressed, gear: 'N' });
        },
        labels: [{ text: V('vstupní ložisko', 'input bearing'), at: function () { return gb.bearings[0].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.07, 0)); }, level: 'danger' }],
        captions: [
          { text: V('Neutrál, volnoběh: hučí…', 'Neutral, idle: humming…'), show: [0, 4] },
          { text: V('…spojka sešlápnutá → vstupní hřídel stojí → ticho', '…clutch pressed → input shaft stops → silence'), show: [4, 8], level: 'ok' }
        ]
      };
    }
  }));

  /* ------------------------------------------------------ release bearing */
  R('gearbox-noise.release', gbScene({
    duration: 8,
    make: function (ctx, K, gb, root) {
      var w = waves(K, 0xf5a524); w.group.rotation.y = PI / 2; root.add(w.group);
      var gl = K.FX.glow(gb.release, 0xf5a524);
      var h = hud(K, {}); h.position.set(-0.05, 0.82, 0); root.add(h);
      return {
        update: function (t, dt) {
          var pressed = t > 3 && t < 7;
          gb.spin(dt, 8, pressed ? 0 : 8, -1);
          gb.release.position.x = 0.03 - (pressed ? 0.014 : 0);
          gb.release.rotation.x += pressed ? dt * 9 : 0;
          w.group.position.copy(gb.release.getWorldPosition(new THREE.Vector3()));
          w.update(t, pressed); gl(pressed ? 0.9 : 0);
          h.userData.redraw({ clutch: pressed, gear: 'N' });
        },
        labels: [{ text: V('vypínací ložisko', 'release bearing'), at: function () { return gb.release.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.07, 0)); }, level: 'accent' }],
        captions: [
          { text: V('Spojka puštěná: ticho', 'Clutch released: quiet'), show: [0, 3] },
          { text: V('Sešlápnutá: pískání / cvrlikání = vypínací ložisko', 'Pressed: squeal / chirp = release bearing'), show: [3, 8], level: 'danger' }
        ]
      };
    }
  }));

  /* ------------------------------------------------------------------ DMF */
  R('gearbox-noise.dmf', gbScene({
    duration: 9, camera: { pos: [-0.05, 0.68, 0.62], target: [-0.36, 0.48, 0], fov: 34 },
    make: function (ctx, K, gb, root) {
      var w = waves(K, 0xe5484d); w.group.rotation.y = PI / 2; root.add(w.group);
      var gl = K.FX.glow(gb.dmf, 0xe5484d);
      var flash = K.mesh(K.G.sphere(0.05, 16), new THREE.MeshBasicMaterial({ color: 0xffcc66, transparent: true, opacity: 0.6 })); root.add(flash);
      var h = hud(K, {}); h.position.set(-0.3, 0.84, 0.05); root.add(h);
      return {
        update: function (t, dt) {
          var off = t > 5.5;
          var eng = off ? Math.max(0, 8 - (t - 5.5) * 6) : 8;
          gb.spin(dt, eng, eng, -1);
          gb.dmf.position.y = Math.sin(t * 45) * (off ? 0 : 0.0015);
          w.group.position.copy(gb.dmf.getWorldPosition(new THREE.Vector3()));
          w.update(t, !off); gl(off ? 0 : 0.5 + 0.3 * Math.sin(t * 20));
          var fk = K.T.pulse(t, 6.6, 7.0);
          flash.visible = fk > 0.05; flash.position.copy(gb.dmf.getWorldPosition(new THREE.Vector3())); flash.scale.setScalar(0.5 + fk * 1.5);
          h.userData.redraw({ clutch: false, gear: 'N', engine: !off });
        },
        labels: [{ text: V('ťuk při vypnutí', 'clunk on switch-off'), at: function () { return gb.dmf.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.18, 0)); }, show: [6.4, 9], level: 'danger' }],
        captions: [
          { text: V('Chrastění na volnoběh = dvouhmotový setrvačník', 'Rattle at idle = dual-mass flywheel'), show: [0, 5.5] },
          { text: V('Ťuknutí při vypínání motoru', 'Clunk when switching the engine off'), show: [5.5, 9] },
          { text: V('Rozpadlý dvouhmot zničí startér i převodovku – neodkládat', 'A failing DMF destroys the starter and gearbox – do not postpone'), level: 'danger', show: [7, 9] }
        ]
      };
    }
  }));

  /* ---------------------------------------------------------------- whine */
  R('gearbox-noise.whine', gbScene({
    duration: 12,
    make: function (ctx, K, gb, root) {
      var w = waves(K, 0xe5484d); w.group.rotation.y = PI / 2; root.add(w.group);
      var glows = gb.pairs.map(function (p) { return K.FX.glow(p.i, 0xe5484d); });
      var h = hud(K, {}); h.position.set(-0.05, 0.82, 0); root.add(h);
      return {
        update: function (t, dt) {
          var g = Math.min(4, Math.floor(t / 2.4));
          gb.spin(dt, 10, 10, g);
          gb.syn.position.x = 0.02 + (g === 2 ? -0.012 : (g === 3 ? 0.012 : 0));
          var bad = g === 3;
          w.group.position.copy(gb.pairs[3].i.getWorldPosition(new THREE.Vector3()));
          w.update(t, bad);
          glows.forEach(function (gl, i) { gl(i === g ? (bad ? 0.9 : 0.25) : 0); });
          h.userData.redraw({ clutch: false, gear: String(g + 1) });
        },
        labels: [{ text: V('vytí jen ve 4. převodu', 'whine only in 4th gear'), at: function () { return gb.pairs[3].i.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.09, 0)); }, show: [7.2, 9.6], level: 'danger' }],
        captions: [
          { text: V('Projeďte všechny převody stejnou rychlostí – pod plynem i brzděním motorem', 'Drive through all gears at the same speed – on power and on overrun') },
          { text: V('Ve všech převodech, mění se s rychlostí = ložisko diferenciálu – nebo kola!', 'In all gears, changing with speed = diff bearing – or a wheel bearing!'), level: 'info', show: [9.6, 12] }
        ]
      };
    }
  }));

  /* -------------------------------------------------------------- synchro */
  R('gearbox-noise.synchro', gbScene({
    duration: 8, camera: { pos: [0.2, 0.5, 0.45], target: [0.02, 0.36, 0], fov: 32 },
    make: function (ctx, K, gb, root) {
      var T = K.T;
      var sparks = [];
      for (var i = 0; i < 14; i++) { var sp = K.mesh(K.G.sphere(0.003, 6), new THREE.MeshBasicMaterial({ color: 0xffb030 })); root.add(sp); sparks.push(sp); }
      var gl = K.FX.glow(gb.ring, 0xe5484d);
      return {
        update: function (t, dt) {
          var k = T.seg(t % 4, 0.6, 1.6) - T.seg(t % 4, 3, 3.8);
          gb.spin(dt, 9, 9, -1);
          gb.syn.position.x = 0.02 + k * 0.012;
          var crunch = (t % 4) > 1.2 && (t % 4) < 1.8;
          gl(crunch ? 1 : 0);
          var c = gb.ring.getWorldPosition(new THREE.Vector3());
          sparks.forEach(function (s, i) {
            var a = i / 14 * PI * 2 + t * 3, r = 0.035 + ((t * 2 + i * 0.13) % 0.04);
            s.visible = crunch; s.position.set(c.x + 0.01, c.y + Math.cos(a) * r, c.z + Math.sin(a) * r);
          });
        },
        labels: [{ text: V('synchronizační kroužek', 'synchro ring'), at: function () { return gb.ring.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -0.06, 0.03)); }, level: 'accent' }],
        captions: [
          { text: V('Skřípe jeden převod při rychlém řazení = opotřebený synchron', 'One gear crunches on quick shifts = worn synchro') },
          { text: V('Skřípe zpátečka i 1. na stojícím voze = spojka nevypíná', 'Reverse and 1st crunch when stationary = clutch drag'), level: 'info', show: [4, 8] }
        ]
      };
    }
  }));

  /* -------------------------------------------------------------- jump out */
  R('gearbox-noise.jumpout', gbScene({
    duration: 8, camera: { pos: [0.3, 0.6, 0.65], target: [-0.05, 0.38, 0], fov: 36 },
    make: function (ctx, K, gb, root) {
      var T = K.T;
      var mount = K.mesh(K.G.rbox(0.08, 0.06, 0.08, 0.015), 'rubber'); mount.position.set(-0.52, 0.66, 0.12); root.add(mount);
      var gm = K.FX.glow(mount, 0xf5a524);
      var h = hud(K, {}); h.position.set(-0.05, 0.84, 0); root.add(h);
      return {
        update: function (t, dt) {
          var engaged = !(t > 3.2 && t < 7.4);
          var pop = T.seg(t, 3.0, 3.3);
          gb.spin(dt, 9, 9, engaged ? 3 : -1);
          gb.syn.position.x = 0.032 - pop * 0.012 + T.seg(t, 7.4, 7.8) * 0.012;
          gb.root.rotation.x = engaged && t > 1.5 ? Math.sin(t * 18) * 0.01 : 0;
          gm(t > 4 ? 0.7 : 0);
          h.userData.redraw({ clutch: false, gear: engaged ? '4' : 'N' });
        },
        labels: [
          { text: V('řadicí objímka vyskočila', 'shift sleeve popped out'), at: function () { return gb.syn.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -0.07, 0.03)); }, show: [3.2, 7.4], level: 'danger' },
          { text: V('nejdřív zkontrolovat uložení motoru', 'check the engine mounts first'), at: function () { return mount.position.clone().add(new THREE.Vector3(0, 0.07, 0)); }, show: [4, 8], level: 'accent' }
        ],
        captions: [
          { text: V('Rychlost vyskočí do neutrálu: aretace / vidlice – nebo uložení motoru', 'Gear pops into neutral: detent / fork – or engine mounts') },
          { text: V('Nebezpečné – jezděte jen nezbytně', 'Dangerous – drive only when necessary'), level: 'danger', show: [3.2, 8] }
        ]
      };
    }
  }));

  /* -------------------------------------------------------------- rule out */
  R('gearbox-noise.ruleout', {
    duration: 9, camera: { pos: [3.6, 2.0, 4.4], target: [0.3, 0.5, 0.3], fov: 34 }, shadow: 3, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var d = c.dims;
      var spots = [
        { p: new THREE.Vector3(d.xf, d.wr, d.W / 2 + 0.05), ok: false, txt: V('ložisko kola? (mění se v zatáčce)', 'wheel bearing? (changes in corners)') },
        { p: new THREE.Vector3(d.xf - 0.45, d.hoodF - 0.25, 0.1), ok: true, txt: V('převodovka (stetoskop na skříni)', 'gearbox (stethoscope on the case)') },
        { p: new THREE.Vector3(d.xf - 0.2, d.wr * 0.9, d.W / 2 - 0.25), ok: false, txt: V('kloub poloosy? (cvakání v rejdu)', 'CV joint? (clicks on lock)') },
        { p: new THREE.Vector3(d.xf - 0.1, d.hoodF - 0.1, -0.35), ok: false, txt: V('uložení motoru? (ťuk při změně plynu)', 'engine mount? (clunk on throttle change)') }
      ];
      var marks = spots.map(function (s) {
        var m = K.mesh(K.G.sphere(0.07, 16), K.M.clone(s.ok ? 'hiAccent' : 'hiInfo', { transparent: true, opacity: 0.85, depthTest: false }));
        m.position.copy(s.p); m.userData.noShadow = true; m.renderOrder = 10; root.add(m); return m;
      });
      var steth = new THREE.Group(); root.add(steth);
      steth.add(K.mesh(K.G.cyl(0.004, 0.4, 8), 'chrome')); steth.children[0].position.y = 0.2;
      var bell = K.mesh(K.G.cyl(0.02, 0.01, 16), 'chrome'); steth.add(bell);
      return {
        root: root,
        update: function (t) {
          var i = Math.min(3, Math.floor(t / 2.25));
          marks.forEach(function (m, j) { m.scale.setScalar(j === i ? 1 + 0.25 * Math.sin(t * 6) : 0.7); });
          steth.position.copy(spots[i].p).add(new THREE.Vector3(0.05, 0.05, 0.05));
        },
        labels: spots.map(function (s, j) { return { text: s.txt, at: function () { return s.p.clone().add(new THREE.Vector3(0, 0.15, 0)); }, show: [j * 2.25, 9], level: s.ok ? 'accent' : null }; }),
        captions: [
          { text: V('Vylučte jiné zdroje: kola, klouby, uložení', 'Rule out other sources: wheels, joints, mounts') },
          { text: V('Stetoskop u běžícího motoru jen na stojícím voze, mimo řemeny', 'Stethoscope at a running engine only when stationary, clear of belts'), level: 'danger', show: [4, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ next */
  R('gearbox-noise.next', {
    duration: 8, camera: { pos: [0.1, 0.5, 0.55], target: [0, 0.38, 0], fov: 34 }, shadow: 0.6, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var desk = K.mesh(K.G.rbox(0.9, 0.04, 0.5, 0.01), 'wood'); desk.position.y = 0.3; root.add(desk);
      var phone = new THREE.Group(); phone.position.set(-0.12, 0.33, 0.02); phone.rotation.x = -PI / 2 + 0.4; root.add(phone);
      phone.add(K.mesh(K.G.rbox(0.08, 0.16, 0.01, 0.008), 'plasticBlack'));
      var scr = K.FX.canvasPanel(0.07, 0.145, function (x, W, H, st) {
        x.fillStyle = '#0d1117'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#e5484d'; x.beginPath(); x.arc(W / 2, H * 0.85, W * 0.09, 0, PI * 2); x.fill();
        x.strokeStyle = '#30a46c'; x.lineWidth = 3; x.beginPath();
        for (var i = 0; i < 60; i++) { var xx = W * 0.05 + i * W * 0.015, a = Math.sin(i * 0.7 + (st ? st.p : 0)) * Math.sin(i * 0.13) * H * 0.12; if (i) x.lineTo(xx, H * 0.45 + a); else x.moveTo(xx, H * 0.45 + a); }
        x.stroke();
        x.fillStyle = '#fff'; x.font = 'bold ' + Math.round(H * 0.06) + 'px system-ui'; x.textAlign = 'center'; x.fillText('REC 00:' + String(st ? st.s : 0).padStart(2, '0'), W / 2, H * 0.12);
      }, { state: { p: 0, s: 0 }, px: 256 });
      scr.position.z = 0.006; phone.add(scr);
      var pad = K.FX.canvasPanel(0.2, 0.26, function (x, W, H) {
        x.fillStyle = '#fbf8ef'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#1a1a1a'; x.font = 'bold ' + Math.round(H * 0.05) + 'px system-ui'; x.textAlign = 'left';
        var lines = [V('Kdy: neutrál / spojka / převod', 'When: neutral / clutch / gear'), V('Rychlost, otáčky', 'Speed, rpm'), V('Studený / teplý', 'Cold / warm'), V('Olej zkontrolován ✔', 'Oil checked ✔'), V('Nahrávka ✔', 'Recording ✔')];
        lines.forEach(function (l, i) { x.fillText('• ' + S.t(l), W * 0.06, H * (0.15 + i * 0.16)); });
      }, { px: 512 });
      pad.rotation.x = -PI / 2; pad.position.set(0.12, 0.322, 0.02); root.add(pad);
      return {
        root: root,
        update: function (t) { scr.userData.redraw({ p: Math.floor(t * 6), s: Math.floor(t) }); },
        captions: [
          { text: V('Poznámky + nahrávka → specializovaná dílna na převodovky', 'Notes + recording → gearbox specialist') },
          { text: V('Spojku, vypínací ložisko a dvouhmot měnit společně', 'Replace clutch, release bearing and DMF together'), level: 'info', show: [3, 8] }
        ]
      };
    }
  });
})(window.STU);
