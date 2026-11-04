/* 3D scenes: brake pads & discs (floating + fixed calipers, wind-back, EPB, drum-in-hat, pedal, bedding). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  /* ------------------------------------------------------------ per-vehicle */
  var DISC = {
    'generic': { r: 0.16, t: 0.026, mat: 'caliperRed' },
    'mb-cl500-c216': { r: 0.18, t: 0.032, mat: 'caliperBlack' },
    'volvo-xc60-b4': { r: 0.172, t: 0.03, mat: 'caliperBlack' },
    'skoda-octavia-rs-tdi': { r: 0.156, t: 0.025, mat: 'caliperRed' },
    'toyota-gr-yaris': { r: 0.178, t: 0.032, mat: 'caliperRed', fixed: true }
  };
  function spec(vid) { return DISC[vid] || DISC.generic; }
  var ANG = PI * 0.97;          // caliper sits at ~9 o'clock (seen from outboard)
  var CY = 0.45;                // hub centre height (car on stands, wheel off)

  /* ----------------------------------------------------------------- helpers */
  /** Capture the base pose of obj; returns fn(k, dist, turns) moving it along `axis` (parent space) while spinning about it. */
  function unscrewer(obj, axis) {
    var p0 = obj.position.clone(), q0 = obj.quaternion.clone(), ax = axis.clone().normalize(), q = new THREE.Quaternion();
    return function (k, dist, turns) {
      obj.position.copy(p0).addScaledVector(ax, (dist || 0.03) * k);
      q.setFromAxisAngle(ax, (turns == null ? 4 : turns) * PI * 2 * k);
      obj.quaternion.copy(q).multiply(q0);
    };
  }
  /** Mount a tool (drive axis = its local Y, opening -Y) so it points into a bolt whose head faces `axis`. */
  function toolHolder(tool, axis) {
    var h = new THREE.Group(), inner = new THREE.Group();
    inner.add(tool);
    h.add(inner);
    h.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis.clone().normalize());
    h.userData.swing = function (a) { inner.rotation.y = a; };
    return h;
  }
  function wp(obj, off) { var v = obj.getWorldPosition(new THREE.Vector3()); if (off) v.add(new THREE.Vector3(off[0], off[1], off[2])); return v; }

  /** Brake corner: hub/knuckle/strut + disc + caliper, centred on the hub at height CY.
   *  o = { rear, fixed, rusty, noCaliper, r } */
  function corner(ctx, K, o) {
    o = o || {};
    var sp = spec(ctx.vehicle), fixed = o.fixed != null ? o.fixed : !!sp.fixed;
    var r = o.r || (o.rear ? 0.145 : sp.r), t = o.rear ? 0.012 : sp.t;
    var root = new THREE.Group(); root.position.y = CY;
    var hub = K.P.hub({ rusty: o.rusty }); root.add(hub);
    var assy = new THREE.Group(); assy.position.z = -0.027; root.add(assy);
    var disc = K.P.brakeDisc({ r: r, t: Math.max(t, 0.012), vented: !o.rear, drilled: false, hatH: o.rear ? 0.06 : 0.045 });
    assy.add(disc);
    var cal = null, ud = null;
    if (!o.noCaliper) {
      cal = fixed ? K.P.caliperFixed({ discR: r, t: t, angle: ANG, mat: sp.mat })
        : K.P.caliperFloating({ discR: r, t: Math.max(t, 0.012), angle: ANG, mat: o.rear ? 'caliperBlack' : sp.mat });
      ud = cal.userData;
      if (!fixed) ud.body.attach(ud.piston);  // piston travels with the caliper body
      assy.add(cal);
    }
    return { root: root, hub: hub, assy: assy, disc: disc, cal: cal, ud: ud, r: r, t: t, fixed: fixed };
  }

  /** Floating caliper body path: k=0 seated, k=1 hanging on a wire above the strut spring. */
  function bodyMover(c) {
    var body = c.ud.body, p0 = body.position.clone(), r0 = body.rotation.clone();
    var dir = new THREE.Vector3(Math.cos(ANG), Math.sin(ANG), 0);
    return function (k) {
      var out = THREE.MathUtils.smoothstep(k, 0, 0.45), up = THREE.MathUtils.smoothstep(k, 0.3, 1);
      body.position.copy(p0).addScaledVector(dir, out * 0.06).add(new THREE.Vector3(0.05 * up, 0.2 * up, -0.05 * up));
      body.rotation.set(r0.x, r0.y + up * 0.5, r0.z - up * 0.35);
    };
  }
  /** Wire hook from the strut spring down to the hung caliper (geometry built for the hung pose). */
  function wireHook(K, c, setBody) {
    setBody(1);
    c.root.updateMatrixWorld(true);
    var a = c.root.worldToLocal(wp(c.ud.body.children[1], [0, 0.03, 0]));
    var top = new THREE.Vector3(-0.02, 0.36, -0.08);
    var g = new THREE.Group();
    g.add(K.mesh(K.G.tube([top, top.clone().lerp(a, 0.5).add(new THREE.Vector3(-0.02, 0, 0)), a], 0.0018, false, 24, 6), 'steel'));
    var hook = K.mesh(K.G.torus(0.012, 0.002, PI * 1.4, 16), 'steel'); hook.position.copy(top); hook.rotation.y = PI / 2; g.add(hook);
    setBody(0);
    c.root.add(g);
    return g;
  }

  function camCorner(side) {
    // outboard (+Z) or inboard (-Z) 3/4 views of the caliper at 9 o'clock
    return side < 0 ? { pos: [-0.62, CY + 0.32, -0.42], target: [-0.12, CY + 0.03, -0.04], fov: 34 }
      : { pos: [-0.5, CY + 0.3, 0.52], target: [-0.11, CY + 0.02, 0], fov: 34 };
  }

  /* =================================================================== OVERVIEW */
  R('brake.overview', {
    duration: 9, camera: { pos: [-0.42, CY + 0.36, 0.5], target: [-0.1, CY + 0.02, -0.02], fov: 36 }, shadow: 0.8, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, c = corner(ctx, K);
      var fade = K.FX.fader(c.ud.body);
      var gPads = [K.FX.glow(c.ud.padIn, 0xf5a524), K.FX.glow(c.ud.padOut, 0xf5a524)];
      var pistons = c.fixed ? c.ud.pistons : [c.ud.piston];
      var gPist = pistons.map(function (p) { return K.FX.glow(p, 0x3e8ed0); });
      var hose = c.fixed ? null : c.ud.hose;
      var gHose = hose ? K.FX.glow(hose, 0xd8b25a) : null;
      var dirFixed = c.fixed;
      return {
        root: c.root,
        update: function (t) {
          c.disc.rotation.z = -t * 2.2;
          fade(1 - 0.75 * T.seg(t, 1.0, 2.2));
          var p = T.pulse(t, 2.6, 4.6), q = T.pulse(t, 4.4, 6.4), h = T.pulse(t, 6.2, 8.2);
          gPads.forEach(function (f) { f(p); });
          gPist.forEach(function (f) { f(q); });
          if (gHose) gHose(h);
        },
        labels: [
          { text: V('Kotouč', 'Disc'), at: function () { return wp(c.disc, [0.13, -0.12, 0.02]); } },
          { text: V('Destičky', 'Pads'), at: function () { return wp(c.ud.padOut, [-c.r - 0.01, 0.03, 0.03]); }, show: [2.4, 9], level: 'accent' },
          { text: V('Píst', 'Piston'), at: function () { return wp(pistons[0], [0, 0.04, 0]); }, show: [4.3, 9] },
          { text: dirFixed ? V('Pevný třmen (4 písty)', 'Fixed caliper (4 pistons)') : V('Plovoucí třmen', 'Floating caliper'), at: function () { return wp(c.cal, [-c.r - 0.04, 0.12, 0]); }, show: [0, 2.4] },
          { text: V('Brzdová kapalina', 'Brake fluid'), at: function () { return hose ? wp(hose, [-c.r - 0.06, 0.16, -0.12]) : wp(c.cal, [-c.r - 0.03, 0.08, -0.06]); }, show: [6.1, 9] }
        ],
        captions: [
          { text: V('Princip kotoučové brzdy', 'How a disc brake works') },
          { text: dirFixed ? V('Písty z obou stran tlačí destičky na kotouč', 'Pistons on both sides press the pads onto the disc')
            : V('Píst tlačí vnitřní destičku, třmen se posune a přitlačí vnější', 'Piston pushes the inner pad, the caliper slides and clamps the outer one'), show: [2.4, 9], level: 'info' }
        ]
      };
    }
  });

  /* ================================================================= RESERVOIR */
  R('brake.reservoir', {
    duration: 9, camera: { pos: [0.38, 0.52, 0.5], target: [0.02, 0.3, 0], fov: 34 }, shadow: 0.7, thumbT: 3.5, ground: true,
    build: function (ctx, K) {
      var T = K.T, G = K.G, root = new THREE.Group();
      var booster = K.mesh(G.cylX(0.13, 0.14, 48), 'blackOxide'); booster.position.set(-0.17, 0.2, 0); root.add(booster);
      var ring = K.mesh(G.torus(0.13, 0.008, PI * 2, 48), 'steelDark'); ring.rotation.y = PI / 2; ring.position.set(-0.1, 0.2, 0); root.add(ring);
      var mc = K.mesh(G.cylX(0.028, 0.2, 32), 'aluCast'); mc.position.set(0.0, 0.2, 0); root.add(mc);
      [0.04, -0.04].forEach(function (x) {
        var line = K.mesh(G.tube([[x, 0.2, 0.03], [x, 0.19, 0.08], [x + 0.06, 0.12, 0.12]], 0.003), 'copper'); root.add(line);
        var nut = K.mesh(G.hex(0.006, 0.01), 'zinc'); nut.position.set(x, 0.2, 0.03); nut.rotation.x = PI / 2; root.add(nut);
      });
      var resv = new THREE.Group(); resv.position.set(0.0, 0.29, 0); root.add(resv);
      var shell = K.mesh(G.rbox(0.16, 0.1, 0.08, 0.015), K.M.clone('plasticWhite', { transparent: true, opacity: 0.42, roughness: 0.25 })); resv.add(shell);
      var fluid = K.mesh(G.box(0.15, 0.09, 0.07), K.M.clone('brakeFluid')); resv.add(fluid);
      var neck = K.mesh(G.cyl(0.02, 0.025, 24), K.M.clone('plasticWhite', { transparent: true, opacity: 0.6 })); neck.position.set(0.03, 0.06, 0); resv.add(neck);
      var cap = new THREE.Group(); cap.position.set(0.03, 0.08, 0); resv.add(cap);
      var capB = K.mesh(G.cyl(0.026, 0.02, 32), 'plasticBlack'); cap.add(capB);
      for (var i = 0; i < 12; i++) { var rib = K.mesh(G.box(0.004, 0.018, 0.006), 'plasticBlack'); var a = i / 12 * PI * 2; rib.position.set(Math.cos(a) * 0.026, 0, Math.sin(a) * 0.026); rib.rotation.y = -a; cap.add(rib); }
      var sensor = K.mesh(G.box(0.02, 0.012, 0.015), 'plasticBlack'); sensor.position.set(-0.06, 0.055, 0); resv.add(sensor);
      var marks = [['MAX', 0.03], ['MIN', -0.025]].map(function (m) {
        var b = K.mesh(G.box(0.05, 0.003, 0.002), 'plasticBlack'); b.position.set(-0.03, m[1], 0.041); resv.add(b); return b;
      });
      // syringe
      var syr = new THREE.Group();
      var barrel = K.mesh(G.cyl(0.012, 0.16, 20), K.M.clone('plasticWhite', { transparent: true, opacity: 0.45 })); barrel.position.y = 0.08; syr.add(barrel);
      var tip = K.mesh(G.cyl(0.003, 0.06, 10, 0.006), K.M.clone('plasticWhite', { transparent: true, opacity: 0.5 })); tip.position.y = -0.03; syr.add(tip);
      var plunger = new THREE.Group(); var rod = K.mesh(G.cyl(0.003, 0.18, 8), 'plasticWhite'); rod.position.y = 0.09; plunger.add(rod);
      var thumb = K.mesh(G.cyl(0.016, 0.005, 20), 'plasticWhite'); thumb.position.y = 0.18; plunger.add(thumb); syr.add(plunger);
      var sFluid = K.mesh(G.cyl(0.011, 0.001, 20), K.M.clone('brakeFluid')); sFluid.position.y = 0.0; syr.add(sFluid);
      root.add(syr);
      var level0 = 0.95, level1 = 0.78;
      function setLevel(k) { fluid.scale.y = k; fluid.position.y = -0.045 + 0.045 * k; }
      return {
        root: root,
        update: function (t) {
          var open = T.seg(t, 0.6, 1.8), close = T.seg(t, 7.6, 8.6);
          var o = open * (1 - close);
          cap.position.set(0.03 + o * 0.07, 0.08 + o * 0.05, 0); cap.rotation.y = -o * 4; cap.rotation.z = -o * 0.4;
          var dip = T.seg(t, 2.2, 3.0) * (1 - T.seg(t, 5.6, 6.4));
          var suck = T.seg(t, 3.3, 5.2);
          syr.position.set(0.03, 0.35 - dip * 0.07, 0); syr.visible = t > 2.0 && t < 6.6;
          plunger.position.y = suck * 0.08;
          sFluid.scale.y = 1 + suck * 70; sFluid.position.y = suck * 0.035;
          setLevel(level0 - (level0 - level1) * suck);
        },
        labels: [
          { text: 'MAX', at: function () { return wp(marks[0], [-0.04, 0.008, 0]); }, level: 'ok' },
          { text: 'MIN', at: function () { return wp(marks[1], [-0.04, 0.008, 0]); }, level: 'danger' },
          { text: V('víčko', 'cap'), at: function () { return wp(cap, [0, 0.035, 0]); }, show: [0.3, 2.2] }
        ],
        captions: [
          { text: V('Hladina u MAX? Odsajte trochu kapaliny', 'Level at MAX? Remove a little fluid') },
          { text: V('Při zatlačení pístů se kapalina vrací do nádržky', 'Pushing the pistons back returns fluid to the reservoir'), level: 'info', show: [2.2, 9] },
          { text: V('Kapalina leptá lak a oči – ihned omýt vodou', 'Fluid attacks paint and eyes – rinse with water at once'), level: 'danger', show: [4.5, 9] }
        ]
      };
    }
  });

  /* ============================================================ CALIPER OFF/ON */
  function caliperScene(on) {
    return {
      duration: on ? 10 : 9, camera: camCorner(-1), shadow: 0.9, thumbT: on ? 6 : 7,
      build: function (ctx, K) {
        var T = K.T, c = corner(ctx, K, { fixed: false });
        var setBody = bodyMover(c);
        var wire = wireHook(K, c, setBody);
        var wireFade = K.FX.fader(wire);
        var ax = new THREE.Vector3(0, 0, -1);
        var screws = c.ud.guides.map(function (g) { return unscrewer(g, ax); });
        var tool = toolHolder(on ? K.P.torqueWrench(0.32) : K.P.ratchet(0.22, 0.011), ax);
        c.ud.body.add(tool);
        var gpos = c.ud.guides.map(function (g) { return g.position.clone(); });
        function bolts(k0, k1) { return [k0, k1]; }
        return {
          root: c.root,
          update: function (t) {
            var kb, kU, kL, toolOn = false, which = 0, swing = 0;
            if (!on) {
              kU = T.seg(t, 0.9, 2.5); kL = T.seg(t, 2.7, 4.1);
              screws[0](kU, 0.035, 5); screws[1](kL, 0.035, 5);
              which = t < 2.6 ? 0 : 1; toolOn = t > 0.5 && t < 4.2;
              swing = (which ? kL : kU) * 30;
              kb = T.seg(t, 4.3, 6.3);
              wireFade(T.seg(t, 5.4, 6.2));
            } else {
              kb = 1 - T.seg(t, 0.4, 2.6);
              wireFade(1 - T.seg(t, 2.0, 2.6));
              kU = 1 - T.seg(t, 2.9, 4.2); kL = 1 - T.seg(t, 4.4, 5.7);
              screws[0](kU, 0.035, 5); screws[1](kL, 0.035, 5);
              which = t < 6.9 ? 0 : 1; toolOn = t > 5.8 && t < 9.4;
              swing = which === 0 ? T.seg(t, 6.0, 6.7) * 0.5 : T.seg(t, 7.6, 8.3) * 0.5;
            }
            setBody(kb);
            tool.visible = toolOn;
            tool.position.copy(gpos[which]).add(new THREE.Vector3(0, 0, -0.018));
            if (!on) tool.position.z -= (which ? kL : kU) * 0.035;
            tool.userData.swing(-swing);
          },
          cameraPath: function (t) {
            var k = on ? 1 - T.seg(t, 0.4, 2.4) : T.seg(t, 4.3, 6.0);
            var a = camCorner(-1);
            return { pos: [a.pos[0] - 0.05 * k, a.pos[1] + 0.12 * k, a.pos[2] - 0.12 * k], target: [a.target[0], a.target[1] + 0.12 * k, a.target[2]] };
          },
          labels: on ? [
            { text: V('klik!', 'click!'), at: function () { return wp(c.ud.guides[0], [0, 0.05, -0.04]); }, show: [6.6, 7.4], level: 'ok' },
            { text: V('klik!', 'click!'), at: function () { return wp(c.ud.guides[1], [0, 0.05, -0.04]); }, show: [8.2, 9.0], level: 'ok' }
          ] : [
            { text: V('Vodicí šrouby', 'Guide bolts'), at: function () { return wp(c.ud.guides[0], [0, 0.05, -0.03]); }, show: [0.2, 4.2], level: 'accent' },
            { text: V('Drát / háček', 'Wire / hook'), at: function () { return wp(c.ud.body, [-c.r + 0.02, 0.07, 0]); }, show: [6.0, 9], level: 'ok' },
            { text: V('✖ Nikdy nevěšet za brzdovou hadici!', '✖ Never hang it by the brake hose!'), at: function () { return wp(c.ud.hose, [-c.r - 0.08, 0.14, -0.1]); }, show: [6.4, 9], level: 'danger' }
          ],
          captions: on ? [
            { text: V('Nasadit třmen, vodicí šrouby momentem', 'Fit caliper, torque the guide bolts') },
            { text: V('Hadice nesmí být přetočená ani napnutá', 'The hose must not be twisted or stretched'), level: 'info', show: [2.6, 10] }
          ] : [
            { text: V('Povolit 2 vodicí šrouby (vnitřní strana)', 'Undo the 2 guide bolts (inner side)'), show: [0, 4.3] },
            { text: V('Třmen zavěsit na drát – hadice volně', 'Hang the caliper on a wire – hose slack'), show: [4.3, 9] },
            { text: V('Nikdy nevěšet za brzdovou hadici!', 'Never hang it by the brake hose!'), level: 'danger', show: [5.5, 9] }
          ]
        };
      }
    };
  }
  R('brake.caliperOff', caliperScene(false));
  R('brake.caliperOn', caliperScene(true));

  /* =================================================================== PADS */
  function padsScene(inn) {
    return {
      duration: 8, camera: { pos: [-0.5, CY + 0.36, 0.28], target: [-0.16, CY + 0.04, -0.01], fov: 34 }, shadow: 0.9, thumbT: inn ? 4.5 : 3,
      build: function (ctx, K) {
        var T = K.T, c = corner(ctx, K, { fixed: false });
        var setBody = bodyMover(c); var wire = wireHook(K, c, setBody); setBody(1);
        var dir = new THREE.Vector3(Math.cos(ANG), Math.sin(ANG), 0);
        var pads = [c.ud.padOut, c.ud.padIn];
        var base = pads.map(function (p) { return p.position.clone(); });
        var fades = pads.map(function (p) { return K.FX.fader(p); });
        // abutment clips
        var clips = new THREE.Group();
        [-1, 1].forEach(function (s) {
          var a = ANG + s * 0.38;
          var clip = K.mesh(K.G.box(0.004, 0.03, c.t + 0.05), K.M.clone('steel', { color: 0xdfe3e8 }));
          clip.position.set(Math.cos(a) * (c.r - 0.025), Math.sin(a) * (c.r - 0.025), -0.004); clip.rotation.z = a;
          clips.add(clip);
        });
        c.assy.add(clips);
        var gClips = K.FX.glow(clips, 0x30a46c);
        // wear sensor on the outer pad (cars with sensors)
        var sensor = null;
        if (ctx.vehicle !== 'skoda-octavia-rs-tdi' && ctx.vehicle !== 'toyota-gr-yaris') {
          sensor = new THREE.Group();
          var sp0 = new THREE.Vector3(Math.cos(ANG) * (c.r - 0.03), Math.sin(ANG) * (c.r - 0.03), 0.016);
          var plug = K.mesh(K.G.box(0.012, 0.012, 0.008), 'plasticBlack'); plug.position.copy(sp0); sensor.add(plug);
          sensor.add(K.mesh(K.G.tube([sp0, sp0.clone().add(new THREE.Vector3(-0.04, 0.03, 0.01)), sp0.clone().add(new THREE.Vector3(-0.06, 0.1, -0.03))], 0.002), 'rubber'));
          c.ud.padOut.add(sensor); sensor.position.sub(c.ud.padOut.position);
        }
        // copper paste dabs on pad ears (padsIn)
        var paste = new THREE.Group();
        if (inn) pads.forEach(function (p) {
          [-1, 1].forEach(function (s) {
            var a = ANG + s * 0.33, d = K.mesh(K.G.sphere(0.005, 10), 'copper');
            d.position.set(Math.cos(a) * (c.r - 0.01), Math.sin(a) * (c.r - 0.01), 0.009); d.scale.set(1.4, 1, 0.6); p.add(d);
          });
        });
        return {
          root: c.root,
          update: function (t) {
            pads.forEach(function (p, i) {
              var k = inn ? 1 - T.seg(t, 2.0 + i * 1.6, 3.2 + i * 1.6) : T.seg(t, 1.0 + i * 1.7, 2.3 + i * 1.7);
              p.position.copy(base[i]).addScaledVector(dir, k * 0.12);
              fades[i](inn ? T.seg(t, 1.4 + i * 1.6, 2.0 + i * 1.6) : 1 - T.seg(t, 2.1 + i * 1.7, 2.6 + i * 1.7));
            });
            gClips(inn ? T.pulse(t, 0.3, 1.9) : T.pulse(t, 5.2, 7.2) * 0.6);
          },
          labels: (inn ? [
            { text: V('Spony (nové ze sady)', 'Clips (new from kit)'), at: function () { return wp(clips, [-0.05, 0.12, 0]); }, show: [0.2, 2.0], level: 'ok' },
            { text: V('pasta jen na uši', 'paste on the ears only'), at: function () { return wp(c.ud.padOut, [-c.r + 0.02, 0.11, 0.02]); }, show: [2.0, 5.2], level: 'accent' }
          ] : []).concat(sensor ? [{ text: V('Senzor opotřebení', 'Wear sensor'), at: function () { return wp(sensor.children[0]); }, show: inn ? [5.5, 8] : [0.2, 1.8] }] : []),
          captions: inn ? [
            { text: V('Nové spony, pasta jen na uši destiček', 'New clips, paste only on the pad ears') },
            { text: V('Žádný tuk na třecí plochy!', 'No grease on friction surfaces!'), level: 'danger', show: [2, 8] }
          ] : [
            { text: V('Vytáhnout vnější i vnitřní destičku', 'Pull out the outer and inner pad') },
            { text: V('Brzdový prach nevyfoukávat – čistič brzd + respirátor', 'Do not blow brake dust – brake cleaner + mask'), level: 'danger', show: [4.6, 8] }
          ]
        };
      }
    };
  }
  R('brake.padsOut', padsScene(false));
  R('brake.padsIn', padsScene(true));

  /* ======================================================= CARRIER + DISC OFF */
  R('brake.carrierDisc', {
    duration: 11, camera: camCorner(-1), shadow: 0.9, thumbT: 7.5,
    build: function (ctx, K) {
      var T = K.T, c = corner(ctx, K);
      var dir = new THREE.Vector3(Math.cos(ANG), Math.sin(ANG), 0);
      var carrier, boltObjs;
      if (c.fixed) { carrier = c.cal; boltObjs = c.ud.mounts; }
      else {
        carrier = c.ud.carrier; boltObjs = carrier.children.filter(function (o) { return o.children && o.children.length && o.userData.head; });
        c.ud.body.visible = false; c.ud.padIn.visible = false; c.ud.padOut.visible = false;
      }
      var cBase = carrier.position.clone(), cFade = K.FX.fader(carrier);
      var ax = new THREE.Vector3(0, 0, -1);
      var screws = boltObjs.map(function (b) { return unscrewer(b, ax); });
      var bar = toolHolder(K.P.breakerBar(0.36), ax); carrier.add(bar);
      // retaining screw on the hat
      var ret = new THREE.Group();
      var head = K.mesh(K.G.cylZ(0.0065, 0.003, 20), 'zinc'); ret.add(head);
      [0, PI / 2].forEach(function (a) { var x = K.mesh(K.G.box(0.008, 0.0015, 0.002), 'blackOxide'); x.rotation.z = a; x.position.z = 0.0018; ret.add(x); });
      ret.position.set(0.07 * Math.cos(PI / 5), 0.07 * Math.sin(PI / 5), 0.0475); c.disc.add(ret);
      var retU = unscrewer(ret, new THREE.Vector3(0, 0, 1)), retF = K.FX.fader(ret);
      var dFade = K.FX.fader(c.disc), dBase = c.disc.position.clone();
      var mallet = new THREE.Group(); var mh = K.mesh(K.G.cylX(0.03, 0.09, 24), 'rubber'); mallet.add(mh);
      var mhandle = K.mesh(K.G.cyl(0.01, 0.25, 12), 'wood'); mhandle.position.y = -0.13; mallet.add(mhandle);
      c.root.add(mallet);
      return {
        root: c.root,
        update: function (t) {
          var k1 = T.seg(t, 0.7, 2.0), k2 = T.seg(t, 2.2, 3.5);
          screws.forEach(function (s, i) { s(i ? k2 : k1, 0.045, 6); });
          var which = t < 2.1 ? 0 : 1;
          bar.visible = t > 0.4 && t < 3.6;
          bar.position.copy(boltObjs[which].position).add(new THREE.Vector3(0, 0, -0.012));
          bar.userData.swing(-(which ? k2 : k1) * 30);
          var off = T.seg(t, 3.7, 4.6);
          carrier.position.copy(cBase).addScaledVector(dir, off * 0.15);
          cFade(1 - T.seg(t, 4.2, 4.8));
          var kr = T.seg(t, 5.2, 6.4); retU(kr, 0.02, 4); retF(1 - T.seg(t, 6.3, 6.7));
          var tap = t > 6.8 && t < 8.0 ? Math.abs(Math.sin((t - 6.8) * PI * 3)) : 0;
          mallet.visible = t > 6.7 && t < 8.1;
          mallet.position.set(0.06, 0.07 + tap * 0.04, 0.11);
          mallet.rotation.z = -0.5 + tap * 0.4;
          var ds = T.seg(t, 8.2, 9.6);
          c.disc.position.copy(dBase).add(new THREE.Vector3(0, 0, ds * 0.22));
          dFade(1 - T.seg(t, 9.6, 10.3));
          if (t > 10.5) { var z = T.seg(t, 10.5, 11); dFade(z); cFade(z); retF(z); c.disc.position.copy(dBase); carrier.position.copy(cBase); screws.forEach(function (s) { s(0); }); retU(0); }
        },
        cameraPath: function (t) {
          var k = T.seg(t, 4.4, 5.2);
          var a = camCorner(-1), b = { pos: [-0.35, CY + 0.32, 0.62], target: [-0.02, CY + 0.02, 0.02] };
          return { pos: a.pos.map(function (v, i) { return v + (b.pos[i] - v) * k; }), target: a.target.map(function (v, i) { return v + (b.target[i] - v) * k; }) };
        },
        labels: [
          { text: c.fixed ? V('Šrouby třmenu', 'Caliper bolts') : V('Šrouby držáku', 'Carrier bolts'), at: function () { return wp(boltObjs[0], [0, 0.05, -0.02]); }, show: [0.2, 3.6], level: 'accent' },
          { text: V('Pojistný šroubek', 'Retaining screw'), at: function () { return wp(ret, [0, 0.03, 0.01]); }, show: [5, 6.5], level: 'accent' },
          { text: V('Přikipělý? Gumová palice mezi šrouby', 'Stuck? Rubber mallet between the studs'), at: function () { return wp(c.disc, [0.08, 0.15, 0.08]); }, show: [6.8, 8.1] }
        ],
        captions: [
          { text: c.fixed ? V('1. Povolit 2 šrouby třmenu (zezadu), třmen zavěsit', '1. Undo the 2 caliper bolts (from behind), hang the caliper') : V('1. Povolit šrouby držáku třmenu (zezadu)', '1. Undo the caliper carrier bolts (from behind)'), show: [0, 4.9] },
          { text: V('2. Vyšroubovat pojistný šroubek kotouče', '2. Remove the disc retaining screw'), show: [4.9, 6.7] },
          { text: V('3. Stáhnout kotouč z náboje', '3. Pull the disc off the hub'), show: [6.7, 11] },
          { text: V('Šrouby držáku bývají na jedno použití – viz příručka', 'Carrier bolts are often single-use – see manual'), level: 'info', show: [0.5, 4.9] }
        ]
      };
    }
  });

  /* ================================================================ HUB CLEAN */
  R('brake.hubClean', {
    duration: 8, camera: { pos: [-0.2, CY + 0.26, 0.58], target: [0, CY + 0.02, 0], fov: 36 }, shadow: 0.7, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, c = corner(ctx, K, { noCaliper: true });
      c.assy.visible = false;
      var rust = new THREE.Group();
      [[0.2, 0.9], [1.6, 2.5], [3.3, 4.1], [4.8, 5.6]].forEach(function (a) {
        var m = K.mesh(K.G.sector(0.034, 0.07, a[0], a[1], 0.0012, 0), K.M.clone('rust')); m.position.z = 0.0125; rust.add(m);
      });
      c.root.add(rust);
      var rustFade = K.FX.fader(rust);
      var brush = new THREE.Group();
      var handle = K.mesh(K.G.rbox(0.16, 0.018, 0.022, 0.007), 'wood'); handle.position.set(0.1, 0, 0.02); handle.rotation.y = -0.4; brush.add(handle);
      var block = K.mesh(K.G.rbox(0.06, 0.022, 0.035, 0.005), 'wood'); brush.add(block);
      for (var i = 0; i < 18; i++) { var b = K.mesh(K.G.box(0.002, 0.002, 0.016), 'steel'); b.position.set(-0.025 + (i % 6) * 0.01, -0.008 + Math.floor(i / 6) * 0.008, -0.022); brush.add(b); }
      c.root.add(brush);
      return {
        root: c.root,
        update: function (t) {
          var on = t > 0.9 && t < 6.2;
          brush.visible = on;
          var a = t * 5, rr = 0.052;
          brush.position.set(Math.cos(a) * rr, Math.sin(a) * rr, 0.038 + Math.sin(t * 40) * 0.0015);
          brush.rotation.z = a + PI / 2;
          rustFade(1 - T.seg(t, 1.4, 5.8));
          if (t > 7.6) rustFade(T.seg(t, 7.6, 8));
        },
        labels: [{ text: V('Čistý kov', 'Bare metal'), at: function () { return wp(c.hub, [0.05, 0.08, 0.02]); }, show: [5.9, 7.6], level: 'ok' }],
        captions: [
          { text: V('Náboj je zrezivělý → očistit!', 'Hub is rusty → clean it!'), show: [0, 1.4] },
          { text: V('Dosedací plochu náboje očistit do kovu', 'Clean the hub contact face to bare metal'), show: [1.4, 8] },
          { text: V('Rez pod kotoučem = házení a vibrace', 'Rust under the disc = runout and vibration'), level: 'info', show: [3, 8] }
        ]
      };
    }
  });

  /* ================================================================= DISC FIT */
  R('brake.discFit', {
    duration: 10, camera: { pos: [-0.38, CY + 0.3, 0.6], target: [-0.04, CY + 0.02, 0.04], fov: 36 }, shadow: 0.9, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, c = corner(ctx, K);
      var dir = new THREE.Vector3(Math.cos(ANG), Math.sin(ANG), 0);
      var carrier = c.fixed ? c.cal : c.ud.carrier;
      var boltObjs = c.fixed ? c.ud.mounts : carrier.children.filter(function (o) { return o.userData.head; });
      if (!c.fixed) { c.ud.body.visible = false; c.ud.padIn.visible = false; c.ud.padOut.visible = false; }
      var cBase = carrier.position.clone(), cFade = K.FX.fader(carrier);
      var screws = boltObjs.map(function (b) { return unscrewer(b, new THREE.Vector3(0, 0, -1)); });
      var dBase = c.disc.position.clone();
      var can = new THREE.Group();
      var cb = K.mesh(K.G.cyl(0.03, 0.18, 24), K.M.clone('toolRed')); can.add(cb);
      var cn = K.mesh(K.G.cyl(0.006, 0.02, 12), 'plasticBlack'); cn.position.y = 0.1; can.add(cn);
      can.rotation.set(-0.9, 0, 0.5); can.position.set(0.02, 0.2, 0.42); c.root.add(can);
      var puff = K.FX.puff(0xe8eef4, 16, 0.07, 0.18); puff.group.position.set(0.0, 0.12, 0.33); puff.group.rotation.x = -2.2; c.root.add(puff.group);
      var tw = toolHolder(K.P.torqueWrench(0.34), new THREE.Vector3(0, 0, -1)); carrier.add(tw);
      return {
        root: c.root,
        update: function (t) {
          var slide = 1 - T.seg(t, 2.2, 3.8);
          c.disc.position.copy(dBase).add(new THREE.Vector3(0, 0, slide * 0.22));
          c.disc.rotation.z = slide * 0.4;
          can.visible = t < 2.1; puff.update(t, t > 0.3 && t < 1.9);
          var cin = 1 - T.seg(t, 4.2, 5.4);
          carrier.position.copy(cBase).addScaledVector(dir, cin * 0.15);
          cFade(T.seg(t, 3.9, 4.3));
          var k1 = 1 - T.seg(t, 5.6, 6.6), k2 = 1 - T.seg(t, 6.7, 7.7);
          screws.forEach(function (s, i) { s(i ? k2 : k1, 0.045, 6); });
          var which = t < 8.85 ? 0 : 1;
          tw.visible = t > 7.9 && t < 9.9;
          tw.position.copy(boltObjs[which].position).add(new THREE.Vector3(0, 0, -0.012));
          tw.userData.swing(-(which ? T.seg(t, 9.0, 9.5) : T.seg(t, 8.0, 8.5)) * 0.5);
        },
        labels: [
          { text: V('Čistič brzd – obě strany', 'Brake cleaner – both sides'), at: function () { return wp(c.disc, [0.0, 0.18, 0.2]); }, show: [0.3, 2.1], level: 'accent' },
          { text: V('klik!', 'click!'), at: function () { return wp(boltObjs[0], [0, 0.05, -0.03]); }, show: [8.4, 8.9], level: 'ok' },
          { text: V('klik!', 'click!'), at: function () { return wp(boltObjs[1], [0, 0.05, -0.03]); }, show: [9.4, 9.9], level: 'ok' }
        ],
        captions: [
          { text: V('Nový kotouč odmastit čističem brzd (obě strany)', 'Degrease the new disc with brake cleaner (both sides)'), show: [0, 4] },
          { text: c.fixed ? V('Třmen: šrouby momentovým klíčem', 'Caliper: torque the bolts') : V('Držák třmenu: šrouby momentovým klíčem', 'Caliper carrier: torque the bolts'), show: [4, 10] },
          { text: V('Moment viz krok', 'Torque: see step'), level: 'accent', show: [7.8, 10] }
        ]
      };
    }
  });

  /* ======================================================= PISTON PUSH / WIND */
  function pistonScene(wind) {
    return {
      duration: 8, camera: { pos: [0.34, 0.62, 0.26], target: [0, 0.5, -0.02], fov: 34 }, shadow: 0.7, thumbT: 4,
      build: function (ctx, K) {
        var T = K.T, sp = spec(ctx.vehicle), r = wind ? 0.145 : sp.r, t = wind ? 0.012 : sp.t;
        var holder = new THREE.Group(); holder.position.y = 0.5;
        var cal = K.P.caliperFloating({ discR: r, t: t, angle: ANG, mat: wind ? 'caliperBlack' : sp.mat });
        var ud = cal.userData;
        ud.carrier.visible = false; ud.padIn.visible = false; ud.padOut.visible = false;
        var pc = new THREE.Vector3(Math.cos(ANG) * (r - 0.026), Math.sin(ANG) * (r - 0.026), 0);
        cal.position.set(-pc.x, -pc.y, 0);
        holder.add(cal);
        var piston = ud.piston, p0 = piston.position.clone();
        var travel = 0.02;
        var parts = new THREE.Group(); parts.position.copy(p0); cal.add(parts);
        if (wind) {
          [0, PI].forEach(function (a) { var n = K.mesh(K.G.box(0.008, 0.004, 0.003), 'blackOxide'); n.position.set(Math.cos(a) * 0.016, Math.sin(a) * 0.016, 0.0155); piston.add(n); });
        }
        var tool = new THREE.Group(); parts.add(tool);
        var screwG = new THREE.Group(); tool.add(screwG);
        if (wind) {
          var plate = K.mesh(K.G.cylZ(0.024, 0.008, 32), 'steelDark'); plate.position.z = 0.02; screwG.add(plate);
          [0, PI].forEach(function (a) { var pin = K.mesh(K.G.cylZ(0.003, 0.006, 8), 'steel'); pin.position.set(Math.cos(a) * 0.016, Math.sin(a) * 0.016, 0.014); screwG.add(pin); });
          var spindle = K.mesh(K.G.cylZ(0.006, 0.14, 16), 'steel'); spindle.position.z = 0.09; screwG.add(spindle);
          var tbar = K.mesh(K.G.cylX(0.005, 0.12, 12), 'steel'); tbar.position.z = 0.16; screwG.add(tbar);
          [-1, 1].forEach(function (s) { var g = K.mesh(K.G.cylX(0.008, 0.035, 12), 'gripRubber'); g.position.set(s * 0.045, 0, 0.16); screwG.add(g); });
          var frame = K.mesh(K.G.rbox(0.09, 0.02, 0.02, 0.005), 'toolBlue'); frame.position.z = 0.06; tool.add(frame);
        } else {
          var pad = K.P.pad({ discR: r, span: 0.62, angle: ANG, worn: true });
          pad.position.set(-p0.x, -p0.y, 0.0155);
          screwG.add(pad);
          var swivel = K.mesh(K.G.cylZ(0.012, 0.008, 20), 'steel'); swivel.position.z = 0.032; screwG.add(swivel);
          var screw = K.mesh(K.G.cylZ(0.006, 0.12, 16), 'chrome'); screw.position.z = 0.09; screwG.add(screw);
          var th = K.mesh(K.G.cylX(0.004, 0.09, 12), 'chrome'); th.position.z = 0.15; screwG.add(th);
          // C-clamp frame
          var cf = new THREE.Group();
          var top = K.mesh(K.G.box(0.02, 0.012, 0.2), 'toolBlue'); top.position.set(0, 0.07, 0.0); cf.add(top);
          var back = K.mesh(K.G.box(0.02, 0.08, 0.012), 'toolBlue'); back.position.set(0, 0.035, -0.088); cf.add(back);
          var front = K.mesh(K.G.box(0.02, 0.08, 0.014), 'toolBlue'); front.position.set(0, 0.035, 0.1); cf.add(front);
          var anvil = K.mesh(K.G.cylZ(0.012, 0.006, 16), 'steelDark'); anvil.position.set(0, 0, -0.082); cf.add(anvil);
          tool.add(cf);
        }
        var arrow = K.FX.rotArrow(0.03, 'cw', 0xf5a524, 230, 0.003); arrow.position.z = wind ? 0.17 : 0.15; parts.add(arrow);
        return {
          root: holder,
          update: function (tt) {
            var k = T.seg(tt, 1.0, 6.0);
            piston.position.copy(p0).add(new THREE.Vector3(0, 0, -travel * k));
            screwG.position.z = -travel * k;
            screwG.rotation.z = -k * PI * (wind ? 6 : 8);
            if (wind) piston.rotation.z = -k * PI * 6;
            arrow.visible = tt > 0.8 && tt < 6.2;
            arrow.rotation.z = -tt * 2;
          },
          labels: wind ? [
            { text: V('↻ ve směru hod. ručiček (ověřit)', '↻ clockwise (verify)'), at: function () { return wp(arrow, [0, 0.06, 0]); }, level: 'accent', show: [0.8, 6.2] },
            { text: V('drážky pístu', 'piston notches'), at: function () { return wp(piston, [0, 0.03, 0]); }, show: [0, 1.2] }
          ] : [
            { text: V('Stará destička chrání píst', 'Old pad protects the piston'), at: function () { return wp(piston, [0.02, -0.06, 0]); }, level: 'accent' }
          ],
          captions: wind ? [
            { text: V('Píst točit a zároveň tlačit (zašroubovat)', 'Turn and push the piston at the same time (wind in)') },
            { text: V('Parkovací brzda uvolněná · hladina stoupá – hlídat MAX', 'Parking brake released · level rises – watch MAX'), level: 'info', show: [2, 8] },
            { text: V('Nikdy píst jen tlačit – zničíte mechanismus ruční brzdy', 'Never just push – it destroys the handbrake mechanism'), level: 'danger', show: [4, 8] }
          ] : [
            { text: V('Píst pomalu zatlačit (lis / svěrka)', 'Push the piston back slowly (press / clamp)') },
            { text: V('Pomalu, hlídat hladinu kapaliny', 'Slowly, watch the fluid level'), level: 'info', show: [2, 8] }
          ]
        };
      }
    };
  }
  R('brake.pistonPush', pistonScene(false));
  R('brake.pistonWind', pistonScene(true));

  /* ============================================================ FIXED CALIPER */
  function fixedPadScene(inn) {
    return {
      duration: 10, camera: { pos: [-0.6, CY + 0.42, 0.36], target: [-0.16, CY + 0.06, 0], fov: 34 }, shadow: 0.9, thumbT: inn ? 3 : 7,
      build: function (ctx, K) {
        var T = K.T, c = corner(ctx, K, { fixed: true, r: spec(ctx.vehicle).fixed ? null : 0.178 });
        var ud = c.ud, dir = new THREE.Vector3(Math.cos(ANG), Math.sin(ANG), 0);
        var spr = ud.spring, s0 = spr.position.clone(), sF = K.FX.fader(spr);
        var pins = ud.pins, pin0 = pins.map(function (p) { return p.position.clone(); }), pinF = pins.map(function (p) { return K.FX.fader(p); });
        var pads = [ud.padOut, ud.padIn], pad0 = pads.map(function (p) { return p.position.clone(); }), padF = pads.map(function (p) { return K.FX.fader(p); });
        var punch = new THREE.Group(); var pb = K.mesh(K.G.cylZ(0.004, 0.12, 12), 'chrome'); pb.position.z = 0.06; punch.add(pb); c.assy.add(punch);
        var ham = K.P.hammer(); ham.scale.setScalar(0.7); c.assy.add(ham);
        function stage(t) {
          // returns 0..1 progress of the three removal phases (spring, pins, pads)
          if (!inn) return [T.seg(t, 0.6, 1.8), T.seg(t, 2.2, 5.0), T.seg(t, 5.4, 8.0)];
          return [1 - T.seg(t, 7.0, 8.4), 1 - T.seg(t, 4.0, 6.6), 1 - T.seg(t, 0.6, 3.6)];
        }
        return {
          root: c.root,
          update: function (t) {
            var st = stage(t);
            spr.position.copy(s0).addScaledVector(dir, st[0] * 0.08); sF(1 - THREE.MathUtils.smoothstep(st[0], 0.6, 1));
            pins.forEach(function (p, i) {
              var k = THREE.MathUtils.clamp(st[1] * 2 - i, 0, 1);
              p.position.copy(pin0[i]).add(new THREE.Vector3(0, 0, -k * 0.14)); pinF[i](1 - THREE.MathUtils.smoothstep(k, 0.75, 1));
            });
            pads.forEach(function (p, i) {
              var k = THREE.MathUtils.clamp(st[2] * 2 - i, 0, 1);
              p.position.copy(pad0[i]).addScaledVector(dir, k * 0.13); padF[i](1 - THREE.MathUtils.smoothstep(k, 0.7, 1));
            });
            // drift + hammer while pins move
            var active = st[1] > 0.02 && st[1] < 0.98;
            var pi = st[1] < 0.5 ? 0 : 1, tap = Math.abs(Math.sin(t * PI * 4));
            punch.visible = active && !inn; ham.visible = active && !inn;
            punch.position.copy(pins[pi].position);
            punch.position.z = pins[pi].position.z + (c.t + 0.1) / 2;
            ham.position.copy(punch.position).add(new THREE.Vector3(0, 0.12 + tap * 0.04, 0.14));
            ham.rotation.set(0, PI / 2, 0.3 - tap * 0.5);
          },
          labels: [
            { text: V('Třmen zůstává na voze', 'Caliper stays on the car'), at: function () { return wp(c.cal, [-c.r - 0.05, -0.08, 0.04]); }, show: inn ? [0, 2] : [7.5, 10], level: 'ok' },
            { text: V('pojistná pružina', 'anti-rattle spring'), at: function () { return wp(spr, [0, 0.03, 0]); }, show: inn ? [7, 9] : [0.2, 1.8], level: 'accent' },
            { text: V('kolíky', 'pins'), at: function () { return wp(pins[0], [0, 0.03, 0.06]); }, show: inn ? [4, 6.6] : [2.2, 5], level: 'accent' }
          ],
          captions: inn ? [
            { text: V('Destičky dolů → kolíky → pojistná pružina', 'Pads in → pins → anti-rattle spring') },
            { text: V('Žádný tuk na třecí plochy!', 'No grease on friction surfaces!'), level: 'danger', show: [1, 10] }
          ] : [
            { text: V('1. Sundat pojistnou pružinu', '1. Remove the anti-rattle spring'), show: [0, 2.1] },
            { text: V('2. Vyrazit / vytáhnout kolíky', '2. Drift out / pull the pins'), show: [2.1, 5.3] },
            { text: V('3. Destičky vytáhnout nahoru z třmenu', '3. Lift the pads out of the caliper'), show: [5.3, 10] }
          ]
        };
      }
    };
  }
  R('brake.fixedPins', fixedPadScene(false));
  R('brake.fixedPadsIn', fixedPadScene(true));

  R('brake.fixedPistons', {
    duration: 8, camera: { pos: [-0.62, CY + 0.38, 0.12], target: [-0.17, CY + 0.04, 0], fov: 32 }, shadow: 0.9, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, c = corner(ctx, K, { fixed: true, r: spec(ctx.vehicle).fixed ? null : 0.178 });
      var ud = c.ud; ud.padIn.visible = false; ud.padOut.visible = false;
      ud.pins.forEach(function (p) { p.visible = false; }); ud.spring.visible = false;
      var p0 = ud.pistons.map(function (p) { return p.position.clone(); });
      var lever = new THREE.Group();
      var blade = K.mesh(K.G.box(0.004, 0.16, 0.03), 'steel'); blade.position.y = 0.06; lever.add(blade);
      var grip = K.mesh(K.G.rbox(0.03, 0.09, 0.035, 0.008), 'toolRed'); grip.position.y = 0.17; lever.add(grip);
      lever.rotation.z = ANG - PI / 2;
      c.assy.add(lever);
      var gl = ud.pistons.map(function (p) { return K.FX.glow(p, 0x3e8ed0); });
      return {
        root: c.root,
        update: function (t) {
          var kO = T.seg(t, 1.0, 3.2), kI = T.seg(t, 3.8, 6.0);
          ud.pistons.forEach(function (p, i) {
            var k = p.userData.side > 0 ? kO : kI;
            p.position.copy(p0[i]); p.position.z += p.userData.side * 0.011 * k;
          });
          var side = t < 3.5 ? 1 : -1, k2 = side > 0 ? kO : kI;
          lever.visible = t > 0.6 && t < 6.3;
          lever.position.set(Math.cos(ANG) * (c.r - 0.03), Math.sin(ANG) * (c.r - 0.03), side * (c.t / 2 + 0.004));
          lever.rotation.x = -side * (0.05 + k2 * 0.25);
          gl.forEach(function (f, i) { f(ud.pistons[i].userData.side === side && lever.visible ? 0.6 : 0); });
          if (t > 7.4) { var z = 1 - T.seg(t, 7.4, 8); ud.pistons.forEach(function (p, i) { p.position.z = p0[i].z + p.userData.side * 0.011 * z; }); }
        },
        labels: [{ text: V('rovnoměrně', 'evenly'), at: function () { return wp(lever, [0, 0.2, 0]); }, show: [1, 6], level: 'accent' }],
        captions: [
          { text: V('Písty zatlačit rovnoměrně – nejdřív jedna strana, pak druhá', 'Push pistons back evenly – one side, then the other') },
          { text: V('Pomalu, hlídat hladinu kapaliny', 'Slowly, watch the fluid level'), level: 'info', show: [2, 8] },
          { text: V('Nepáčit o kotouč ani o hranu pístu', 'Never lever against the disc or piston edge'), level: 'danger', show: [4, 8] }
        ]
      };
    }
  });

  /* ======================================================================= EPB */
  R('brake.epb', {
    duration: 11, camera: { pos: [-0.62, CY + 0.36, -0.55], target: [-0.2, CY - 0.02, -0.05], fov: 36 }, shadow: 1, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, c = corner(ctx, K, { rear: true, fixed: false });
      var ud = c.ud;
      ud.padIn.visible = true;
      // EPB motor unit on the piston housing (inboard)
      var pc = new THREE.Vector3(Math.cos(ANG) * (c.r - 0.026), Math.sin(ANG) * (c.r - 0.026), 0);
      var motor = new THREE.Group(); motor.position.set(pc.x, pc.y, -(c.t / 2 + 0.11));
      var mh = K.mesh(K.G.rbox(0.07, 0.12, 0.06, 0.015), 'plasticBlack'); mh.position.y = -0.03; motor.add(mh);
      var conn = K.mesh(K.G.rbox(0.025, 0.02, 0.03, 0.005), 'plasticGrey'); conn.position.set(0, -0.1, 0); motor.add(conn);
      var gear = K.mesh(K.G.gear(14, 0.022, 0.018, 0.008, 0.004), 'brass'); gear.position.set(0, 0.0, -0.034); motor.add(gear);
      var win = K.mesh(K.G.cylZ(0.026, 0.002, 32), K.M.clone('glassClear', { opacity: 0.3 })); win.position.z = -0.039; motor.add(win);
      ud.body.add(motor);
      var gMotor = K.FX.glow(mh, 0x3e8ed0);
      var piston = ud.piston, p0 = piston.position.clone();
      // scan tool
      var tool = new THREE.Group();
      var shell = K.mesh(K.G.rbox(0.13, 0.22, 0.035, 0.015), 'toolYellow'); tool.add(shell);
      var bezel = K.mesh(K.G.rbox(0.11, 0.12, 0.004, 0.0015), 'plasticBlack'); bezel.position.set(0, 0.035, 0.018); tool.add(bezel);
      var panel = K.FX.canvasPanel(0.1, 0.11, function (g, W, H, st) {
        g.fillStyle = '#0d1a24'; g.fillRect(0, 0, W, H);
        g.fillStyle = '#7cc4ff'; g.font = 'bold ' + Math.round(W * 0.1) + 'px sans-serif'; g.fillText('EPB', W * 0.08, H * 0.16);
        g.fillStyle = '#fff'; g.font = Math.round(W * 0.075) + 'px sans-serif';
        g.fillText(st.line, W * 0.08, H * 0.36);
        g.fillStyle = '#2b3a48'; g.fillRect(W * 0.08, H * 0.48, W * 0.84, H * 0.07);
        g.fillStyle = st.done ? '#30a46c' : '#f5a524'; g.fillRect(W * 0.08, H * 0.48, W * 0.84 * st.p, H * 0.07);
        if (st.done) { g.fillStyle = '#30a46c'; g.font = 'bold ' + Math.round(W * 0.11) + 'px sans-serif'; g.fillText(st.ok, W * 0.08, H * 0.8); }
      }, { px: 360, state: { line: '', p: 0, done: false, ok: '' } });
      panel.position.set(0, 0.035, 0.0215); tool.add(panel);
      [[-0.03, -0.06], [0.03, -0.06], [0, -0.085]].forEach(function (b) { var btn = K.mesh(K.G.cylZ(0.009, 0.004, 16), 'plasticGrey'); btn.position.set(b[0], b[1], 0.018); tool.add(btn); });
      var cable = K.mesh(K.G.tube([[0, -0.11, 0], [0.02, -0.2, 0.04], [0.15, -0.3, 0.2]], 0.004), 'plasticBlack'); tool.add(cable);
      tool.position.set(-0.36, 0.0, -0.26);
      tool.rotation.set(-0.35, PI + 0.62, 0);
      c.root.add(tool);
      var mode = V('Servisní režim…', 'Service mode…'), active = V('AKTIVNÍ', 'ACTIVE');
      return {
        root: c.root,
        update: function (t) {
          var p = T.lin(t, 1.8, 4.6), done = t >= 4.6;
          panel.userData.redraw({ line: t < 1.2 ? 'Menu ▸ EPB ▸ Servis' : S.t(mode), p: Math.round(p * 20) / 20, done: done, ok: S.t(active) });
          gear.rotation.z = -T.lin(t, 1.8, 4.6) * PI * 14;
          gMotor(t > 1.8 && t < 4.6 ? 0.5 + 0.3 * Math.sin(t * 20) : 0);
          var push = T.seg(t, 5.8, 8.2);
          piston.position.copy(p0).add(new THREE.Vector3(0, 0, -0.012 * push));
          if (t > 10.4) piston.position.copy(p0);
        },
        labels: [
          { text: V('Motor EPB', 'EPB motor'), at: function () { return wp(motor, [0, 0.07, -0.02]); }, show: [1.6, 5.4], level: 'accent' },
          { text: V('Píst – teď zatlačit', 'Piston – push now'), at: function () { return wp(piston, [0, 0.05, 0]); }, show: [5.8, 9], level: 'ok' }
        ],
        captions: [
          { text: V('1. Tester: EPB → servisní režim', '1. Scan tool: EPB → service mode'), show: [0, 1.8] },
          { text: V('2. Motor stáhne vřeteno zpět', '2. Motor winds the spindle back'), show: [1.8, 5.6] },
          { text: V('3. Teprve teď lze píst zatlačit', '3. Only now can the piston be pushed'), show: [5.6, 11] },
          { text: V('Bez servisního režimu se motor třmenu zničí', 'Without service mode the caliper motor is destroyed'), level: 'danger', show: [3, 11] },
          { text: V('Po práci: servisní režim ukončit a EPB kalibrovat', 'Afterwards: exit service mode and calibrate the EPB'), level: 'info', show: [8.5, 11] }
        ]
      };
    }
  });

  /* ===================================================================== PEDAL */
  R('brake.pedal', {
    duration: 9, ground: false, camera: { pos: [0.38, 0.64, 1.18], target: [-0.12, 0.45, 0], fov: 40 }, shadow: 1, thumbT: 1.2,
    build: function (ctx, K) {
      var T = K.T, G = K.G, root = new THREE.Group();
      var carpet = K.M.clone('plasticGrey', { color: 0x4a4e55, roughness: 1 });
      var floor = K.mesh(G.box(1.0, 0.02, 0.5), carpet); floor.position.set(0.25, 0.0, 0); root.add(floor);
      var toe = K.mesh(G.box(0.02, 0.42, 0.5), carpet); toe.position.set(-0.36, 0.17, 0); toe.rotation.z = -0.6; root.add(toe);
      var wall = K.mesh(G.box(0.02, 0.5, 0.5), K.M.clone('plasticGrey', { color: 0x6a6f77 })); wall.position.set(-0.48, 0.6, 0); root.add(wall);
      var bracket = K.mesh(G.rbox(0.18, 0.08, 0.08, 0.01), 'blackOxide'); bracket.position.set(-0.38, 0.77, 0); root.add(bracket);
      var pivotP = new THREE.Vector3(-0.3, 0.76, 0);
      var pedal = new THREE.Group(); pedal.position.copy(pivotP); root.add(pedal);
      var arm = K.mesh(G.tube([[0, 0, 0], [0.1, -0.2, 0], [0.17, -0.42, 0]], 0.009), 'steelDark'); pedal.add(arm);
      var axle = K.mesh(G.cylZ(0.012, 0.06, 16), 'steel'); pedal.add(axle);
      var pad = K.mesh(G.rbox(0.03, 0.085, 0.095, 0.01), 'rubber'); pad.position.set(0.18, -0.44, 0); pad.rotation.z = 0.3; pedal.add(pad);
      var acc = K.mesh(G.rbox(0.02, 0.2, 0.06, 0.01), 'rubber'); acc.position.set(-0.08, 0.2, -0.17); acc.rotation.z = -0.55; root.add(acc);
      var shoe = new THREE.Group();
      var sole = K.mesh(G.rbox(0.27, 0.024, 0.1, 0.012), 'rubber'); sole.position.x = 0.12; shoe.add(sole);
      var upper = K.mesh(G.rbox(0.2, 0.075, 0.094, 0.034), K.M.clone('leather', { color: 0x5b3a22 })); upper.position.set(0.15, 0.045, 0); shoe.add(upper);
      var ankle = K.mesh(G.cyl(0.042, 0.12, 20), 'fabric'); ankle.position.set(0.23, 0.12, 0); shoe.add(ankle);
      root.add(shoe);
      // travel scale next to the pedal
      var scale = new THREE.Group();
      var bar = K.mesh(G.box(0.008, 0.2, 0.004), 'plasticWhite'); scale.add(bar);
      var mk = K.mesh(G.box(0.03, 0.006, 0.006), 'hiAccent'); scale.add(mk);
      scale.position.set(-0.02, 0.32, 0.09); root.add(scale);
      var depths = [1.0, 0.82, 0.55, 0.36, 0.3];
      function strokeAt(t) {
        if (t < 0.4) return 0;
        var i = Math.min(4, Math.floor((t - 0.4) / 1.6)), lt = (t - 0.4) - i * 1.6;
        return depths[i] * T.pulse(lt, 0.05, 1.45);
      }
      return {
        root: root,
        update: function (t) {
          var k = strokeAt(t);
          pedal.rotation.z = k * 0.42;
          pedal.updateMatrixWorld(true);
          var pp = pad.getWorldPosition(new THREE.Vector3());
          shoe.position.set(pp.x + 0.02, pp.y - 0.02, pp.z);
          shoe.rotation.z = -0.95 + k * 0.4;
          mk.position.y = 0.1 - k * 0.2;
          mk.material = k > 0.7 ? K.M.hiDanger : (k > 0.01 && k < 0.4 ? K.M.hiOk : K.M.hiAccent);
        },
        labels: [
          { text: V('1. nejdřív propadá', '1. first sinks'), at: function () { return mk.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.06, 0.02, 0)); }, show: [0.4, 3.6], level: 'danger' },
          { text: V('2. pak je vysoko a tvrdý', '2. then high and firm'), at: function () { return mk.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.06, 0.02, 0)); }, show: [5.2, 9], level: 'ok' }
        ],
        captions: [
          { text: V('Sešlapávat, dokud pedál není vysoko a tvrdý', 'Pump until the pedal is high and firm') },
          { text: V('PŘED prvním rozjezdem!', 'BEFORE moving the car!'), level: 'danger' },
          { text: V('Pak zkontrolovat hladinu kapaliny', 'Then check the fluid level'), level: 'info', show: [6, 9] }
        ]
      };
    }
  });

  /* =================================================================== BEDDING */
  R('brake.bedding', {
    duration: 10, camera: { pos: [3.6, 1.7, 5.4], target: [0.2, 0.55, 0], fov: 34 }, shadow: 3.2, thumbT: 4.5,
    build: function (ctx, K) {
      var T = K.T, G = K.G, root = new THREE.Group();
      var road = K.mesh(G.box(80, 0.01, 6), K.M.clone('concrete', { color: 0x2f3236, roughness: 0.9 })); road.position.y = 0.004; road.receiveShadow = true; root.add(road);
      var dashes = new THREE.Group(); root.add(dashes);
      for (var i = 0; i < 16; i++) { var d = K.mesh(G.box(1.5, 0.012, 0.12), 'plasticWhite'); d.position.set(-24 + i * 3, 0.006, -1.6); dashes.add(d); }
      var edges = [2.8, -2.8].map(function (z) { var e = K.mesh(G.box(80, 0.012, 0.12), 'plasticWhite'); e.position.set(0, 0.006, z); root.add(e); return e; });
      var c = K.car(ctx.vehicle); root.add(c.group);
      var tl = [];
      c.body.traverse(function (o) { if (o.name === 'taillightL' || o.name === 'taillightR') tl.push(o.children[0]); });
      var tlMat = K.M.clone('lightRed'); tl.forEach(function (m) { m.material = tlMat; });
      var panel = K.FX.canvasPanel(0.9, 0.42, function (g, W, H, st) {
        g.fillStyle = 'rgba(14,17,23,0.88)'; g.fillRect(0, 0, W, H);
        g.fillStyle = st.brake ? '#ff5a5f' : '#ffffff';
        g.font = 'bold ' + Math.round(H * 0.5) + 'px sans-serif'; g.textAlign = 'right';
        g.fillText(String(st.v), W * 0.62, H * 0.6);
        g.font = 'bold ' + Math.round(H * 0.16) + 'px sans-serif'; g.textAlign = 'left'; g.fillStyle = '#9aa5b8';
        g.fillText('km/h', W * 0.66, H * 0.6);
        g.fillStyle = st.brake ? '#ff5a5f' : '#30a46c'; g.font = 'bold ' + Math.round(H * 0.15) + 'px sans-serif'; g.textAlign = 'center';
        g.fillText(st.msg, W / 2, H * 0.88);
      }, { px: 420, state: { v: 0, brake: false, msg: '' } });
      panel.position.set(0.2, c.dims.H + 0.55, 0);
      panel.lookAt(new THREE.Vector3(3.6, 1.7 + 0.4, 5.4));
      root.add(panel);
      var dist = 0;
      var wr = c.dims.wr;
      function speedAt(t) {
        // 2 bedding stops per loop: 80 → 30, short re-acceleration, then cool-down cruise
        return T.keys(t, [[0, 40], [1.4, 80], [3.0, 30], [3.8, 80], [5.4, 30], [6.4, 50], [10, 50]]);
      }
      var msgs = { brake: V('BRZDIT – nezastavit', 'BRAKE – do not stop'), go: V('zrychlit', 'accelerate'), cool: V('jet bez brzdění', 'drive without braking') };
      return {
        root: root,
        update: function (t) {
          // integrate distance deterministically (sample speed curve)
          var s = 0, n = 60;
          for (var i = 0; i < n; i++) s += speedAt(t * i / n) / 3.6 * (t / n);
          dist = s;
          var v = speedAt(t), braking = (t > 1.4 && t < 3.0) || (t > 3.8 && t < 5.4);
          dashes.position.x = -(dist % 3);
          c.wheels.forEach(function (w) { w.wheel.rotation.z = -dist / wr * (w.side > 0 ? 1 : -1); });
          tlMat.emissiveIntensity = braking ? 3.2 : 0.5;
          c.body.rotation.z = braking ? -0.012 : 0;
          c.body.position.y = braking ? -0.01 : 0;
          panel.userData.redraw({ v: Math.round(v / 2) * 2, brake: braking, msg: S.t(braking ? msgs.brake : (t < 6.4 ? msgs.go : msgs.cool)) });
        },
        captions: [
          { text: V('8–10× brzdit z ~80 na ~30 km/h, nezastavit', 'Brake 8–10× from ~80 to ~30 km/h, do not stop') },
          { text: V('Pak jet bez brzdění – vychladnout', 'Then drive without braking – cool down'), level: 'info', show: [5.6, 10] },
          { text: V('Jen na bezpečné, prázdné silnici · nezastavovat s horkými brzdami na ruční', 'Only on a safe, empty road · do not park hot brakes on the handbrake'), level: 'danger', show: [6.5, 10] }
        ]
      };
    }
  });

  /* =============================================================== DRUM IN HAT */
  R('brake.drumInHat', {
    duration: 10, camera: { pos: [-0.3, CY + 0.25, 0.5], target: [0, CY, 0.02], fov: 36 }, shadow: 0.8, thumbT: 3.5,
    build: function (ctx, K) {
      var T = K.T, c = corner(ctx, K, { rear: true, r: 0.16, noCaliper: true });
      // backing plate + shoes inside the hat (hat inner radius ≈ 0.079, between z≈0.01 and 0.05 in disc space)
      var shoesG = new THREE.Group(); shoesG.position.z = c.assy.position.z; c.root.add(shoesG);
      var back = K.mesh(K.G.cylZ(0.13, 0.003, 48), 'steelDark'); back.position.z = -0.012; c.root.add(back);
      var shoes = [];
      [[0.25, PI - 0.25], [PI + 0.25, 2 * PI - 0.25]].forEach(function (a) {
        var s = new THREE.Group();
        var web = K.mesh(K.G.sector(0.058, 0.07, a[0], a[1], 0.004, 0), 'steelDark'); web.position.z = 0.03; s.add(web);
        var rim = K.mesh(K.G.sector(0.068, 0.072, a[0], a[1], 0.022, 0), 'steelDark'); rim.position.z = 0.03; s.add(rim);
        var lin = K.mesh(K.G.sector(0.072, 0.077, a[0] + 0.1, a[1] - 0.1, 0.02, 0), 'padFriction'); lin.position.z = 0.03; s.add(lin);
        s.userData.dir = new THREE.Vector3(Math.cos((a[0] + a[1]) / 2), Math.sin((a[0] + a[1]) / 2), 0);
        shoesG.add(s); shoes.push(s);
      });
      var springs = [];
      [0.5, -0.5].forEach(function (x) {
        var pts = [];
        for (var i = 0; i <= 40; i++) { var a = i / 40 * PI * 2 * 7; pts.push([x * 0.08 + Math.cos(a) * 0.004, -0.055 + i / 40 * 0.11, 0.03 + Math.sin(a) * 0.004]); }
        var sp = K.mesh(K.G.tube(pts, 0.0012, false, 120, 5), 'steel'); sp.rotation.z = PI / 2; sp.position.set(0, 0, 0); shoesG.add(sp); springs.push(sp);
      });
      var star = K.mesh(K.G.gear(12, 0.011, 0.008, 0.008, 0.002), 'zinc'); star.rotation.y = PI / 2; star.position.set(0, -0.062, 0.03); shoesG.add(star);
      var sdH = new THREE.Group(); sdH.position.set(0.0, -0.062, 0.045); shoesG.add(sdH); var sd = K.P.screwdriver(0.22); sd.rotation.y = -PI / 2; sdH.add(sd);
      var dFade = K.FX.fader(c.disc), dBase = c.disc.position.clone();
      return {
        root: c.root,
        update: function (t) {
          var reveal = T.seg(t, 0.6, 1.6) * (1 - T.seg(t, 5.2, 5.9));
          dFade(1 - reveal * 0.78);
          var adj = T.seg(t, 2.2, 4.6);
          star.rotation.x = adj * PI * 4;
          sdH.visible = t > 1.9 && t < 4.9;
          sdH.rotation.z = Math.sin(adj * PI * 8) * 0.25;
          shoes.forEach(function (s) { s.position.copy(s.userData.dir).multiplyScalar(-adj * 0.004); });
          var off = T.seg(t, 6.1, 7.6);
          c.disc.position.copy(dBase).add(new THREE.Vector3(0, 0, off * 0.2));
          if (t > 7.6) dFade(1 - T.seg(t, 7.6, 8.2));
          if (t > 9.5) { dFade(T.seg(t, 9.5, 10)); c.disc.position.copy(dBase); }
        },
        labels: [
          { text: V('Čelisti parkovací brzdy', 'Parking brake shoes'), at: function () { return wp(shoes[0], [0, 0.1, 0.03]); }, show: [1.4, 5], level: 'accent' },
          { text: V('Seřizovač (hvězdička)', 'Adjuster (star wheel)'), at: function () { return wp(star, [0, -0.03, 0.03]); }, show: [2.2, 5] }
        ],
        captions: [
          { text: V('Bubnová parkovací brzda v kotouči', 'Drum-in-hat parking brake') },
          { text: V('Kotouč nejde dolů? Čelisti stáhnout seřizovačem', 'Disc stuck? Back off the shoes with the adjuster'), level: 'info', show: [2, 10] },
          { text: V('Parkovací brzda musí být uvolněná', 'Parking brake must be released'), level: 'danger' }
        ]
      };
    }
  });
})(window.STU);
