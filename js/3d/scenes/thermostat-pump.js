/* 3D scenes: thermostat & water pump. Uses S.n4 helpers from aux-belt.js (build time only). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  /** Wax-pellet thermostat, axis Y, flange at y=0. userData.setOpen(k 0..1) */
  function thermostat(K) {
    var g = new THREE.Group();
    var flange = K.mesh(K.G.latheZ([[0.012, -0.002], [0.034, -0.002], [0.034, 0.002], [0.012, 0.002]], 40), 'brass'); flange.rotation.x = PI / 2; g.add(flange);
    var ring = K.mesh(K.G.torus(0.033, 0.0028, PI * 2, 32), 'rubber'); ring.rotation.x = PI / 2; ring.position.y = 0.002; g.add(ring);
    [-1, 1].forEach(function (s) { var leg = K.mesh(K.G.box(0.004, 0.05, 0.008), 'steel'); leg.position.set(s * 0.016, -0.025, 0); g.add(leg); });
    var bridge = K.mesh(K.G.box(0.036, 0.004, 0.008), 'steel'); bridge.position.y = -0.05; g.add(bridge);
    var valve = new THREE.Group();
    var disc = K.mesh(K.G.cyl(0.022, 0.003, 32), 'brass'); valve.add(disc);
    var pellet = K.mesh(K.G.lathe([[0, -0.004], [0.008, -0.004], [0.009, -0.03], [0.006, -0.036], [0, -0.036]], 24), 'copper'); valve.add(pellet);
    g.add(valve);
    var springPts = [];
    for (var i = 0; i <= 50; i++) { var a = i / 50 * PI * 2 * 5; springPts.push([Math.cos(a) * 0.012, -0.004 - i / 50 * 0.042, Math.sin(a) * 0.012]); }
    var spring = K.mesh(K.G.tube(springPts, 0.0012, false, 200, 6), 'steel'); g.add(spring);
    var pin = K.mesh(K.G.cyl(0.002, 0.03, 8), 'chrome'); pin.position.y = 0.014; g.add(pin);
    g.userData.setOpen = function (k) { valve.position.y = -k * 0.01; spring.scale.y = 1 - k * 0.2; };
    g.userData.valve = valve;
    return g;
  }

  /** Water pump: body with flange (facing +Z), impeller behind (-Z), pulley in front. */
  function waterPump(K, opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var body = K.mesh(K.G.latheZ([[0.012, 0.0], [0.05, 0.0], [0.05, 0.01], [0.03, 0.02], [0.022, 0.07], [0.012, 0.07]], 40), 'aluCast'); g.add(body);
    var flange = K.mesh(K.G.rbox(0.15, 0.13, 0.01, 0.02), 'aluCast'); flange.position.z = -0.002; g.add(flange);
    var weep = K.mesh(K.G.cylZ(0.003, 0.004, 8), 'blackOxide'); weep.position.set(0, -0.028, 0.045); weep.rotation.x = PI / 2; g.add(weep);
    var imp = new THREE.Group();
    var plate = K.mesh(K.G.cylZ(0.04, 0.004, 32), 'steelDark'); imp.add(plate);
    for (var i = 0; i < 7; i++) { var v = K.mesh(K.G.box(0.034, 0.012, 0.003), 'steelDark'); v.geometry.translate(0.02, 0, 0); v.rotation.set(PI / 2, 0, i / 7 * PI * 2); v.position.z = -0.008; imp.add(v); }
    imp.position.z = -0.012; g.add(imp);
    var gasket = K.mesh(K.G.torus(0.052, 0.003, PI * 2, 40), K.M.clone('hiOk')); gasket.position.z = -0.009; gasket.visible = false; g.add(gasket);
    var pulley = S.n4.pulley(K, opts.r || 0.055, { smooth: true }); pulley.position.z = 0.085; g.add(pulley);
    var bolts = [];
    [[-0.06, 0.05], [0.06, 0.05], [-0.06, -0.05], [0.06, -0.05], [0, 0.058]].forEach(function (p) {
      var b = K.P.bolt({ r: 0.0045, len: 0.03 }); b.rotation.x = PI / 2; b.position.set(p[0], p[1], 0.006); g.add(b); bolts.push(b);
    });
    g.userData = { impeller: imp, pulley: pulley, gasket: gasket, bolts: bolts, weep: weep };
    return g;
  }

  /** Cut-away thermostat housing with coolant flow. */
  function housingCut(K, vid) {
    var g = new THREE.Group();
    var cm = S.n4.coolant(K, vid);
    var hm = K.M.clone('aluCast', { transparent: true, opacity: 0.35, depthWrite: false });
    var house = K.mesh(K.G.lathe([[0.04, -0.07], [0.045, -0.07], [0.045, 0.04], [0.04, 0.045], [0.02, 0.06], [0.02, 0.1], [0.016, 0.1], [0.016, 0.06], [0.036, 0.04], [0.04, 0.04]], 40), hm);
    house.renderOrder = 3; g.add(house);
    var therm = thermostat(K); g.add(therm);
    var flowHot = [], flowCold = [];
    var hot = K.M.clone('hiDanger', { transparent: true, opacity: 0.9 }), cold = K.M.clone(cm, { opacity: 0.95 });
    for (var i = 0; i < 14; i++) {
      var p = K.mesh(K.G.sphere(0.005, 8), i % 2 ? hot : cold); p.userData.o = i / 14; g.add(p); (i % 2 ? flowHot : flowCold).push(p);
    }
    g.userData = { therm: therm, parts: flowHot.concat(flowCold), hotMat: hot, coldMat: cold };
    return g;
  }

  /* ---------------------------------------------------------------- scenes */
  R('thermostat-pump.symptoms', {
    duration: 10, camera: { pos: [0, 0.02, 0.42], target: [0, 0, 0], fov: 32 }, shadow: 0.5, ground: false, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var gg = S.n4.gauge(K, 0.09, '°C'); root.add(gg.group);
      var dash = K.mesh(K.G.rbox(0.5, 0.3, 0.04, 0.03), 'plasticTex'); dash.position.z = -0.03; root.add(dash);
      var steam = K.FX.puff(0xffffff, 16, 0.08, 0.2); steam.group.position.set(0.15, -0.1, 0.05); root.add(steam.group);
      return {
        root: root,
        update: function (t) {
          var v;
          if (t < 5) v = T.lerp(0, 0.3, T.seg(t, 0.2, 3)); // stuck open – never reaches normal
          else v = T.lerp(0.3, 0.97, T.seg(t, 5.3, 8.5));  // stuck closed / pump – overheats
          gg.setValue(v);
          steam.update(t, t > 8.2);
        },
        captions: [
          { text: V('Teplota zůstává nízko, topení slabé → termostat zaseknutý otevřený', 'Temperature stays low, weak heating → thermostat stuck open'), show: [0, 5], level: 'info' },
          { text: V('Teplota letí nahoru → zaseknutý zavřený / pumpa / únik – IHNED zastavit!', 'Temperature shoots up → stuck closed / pump / leak – STOP AT ONCE!'), show: [5, 10], level: 'danger' }
        ]
      };
    }
  });

  R('thermostat-pump.cutaway', {
    duration: 10, camera: { pos: [0.12, 0.05, 0.26], target: [0, 0.0, 0], fov: 34 }, shadow: 0.4, ground: false, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, h = housingCut(K, ctx.vehicle), ud = h.userData;
      var gg = S.n4.gauge(K, 0.035, '°C'); gg.group.position.set(-0.1, 0.06, 0); h.add(gg.group);
      return {
        root: h,
        update: function (t) {
          var heat = T.seg(t, 1, 5);
          gg.setValue(0.2 + heat * 0.35);
          var open = T.seg(t, 4, 6.5);
          ud.therm.userData.setOpen(open);
          ud.parts.forEach(function (p) {
            var k = (t * 0.4 + p.userData.o) % 1;
            var through = open > 0.3;
            if (through) p.position.set(Math.sin(k * 40) * 0.01, -0.06 + k * 0.16, Math.cos(k * 37) * 0.01);
            else p.position.set(Math.sin(k * 40) * 0.025, -0.065 + (k % 0.5) * 0.03, Math.cos(k * 37) * 0.025);
          });
          ud.coldMat.opacity = 0.95 - heat * 0.6;
        },
        labels: [
          { text: V('Voskové tělísko', 'Wax pellet'), at: [0.02, -0.04, 0.04], show: [0.5, 4] },
          { text: V('Ventil se otevírá (~ 87–105 °C dle motoru)', 'Valve opens (~87–105 °C depending on engine)'), at: [0.0, 0.01, 0.045], show: [4.5, 10], level: 'ok' }
        ],
        captions: [
          { text: V('Studený motor: termostat zavřený, kapalina obíhá jen motorem', 'Cold engine: thermostat closed, coolant circulates in the engine only') },
          { text: V('Zahřátý: vosk se roztáhne, ventil pustí kapalinu do chladiče', 'Warm: the wax expands, the valve lets coolant to the radiator'), show: [4.5, 10], level: 'ok' }
        ]
      };
    }
  });

  R('thermostat-pump.drain', {
    duration: 8, camera: { pos: [0.85, 0.6, 1.25], target: [0.08, 0.28, 0], fov: 34 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), cm = S.n4.coolant(K, ctx.vehicle);
      var rad = new THREE.Group();
      var core = K.mesh(K.G.box(0.6, 0.38, 0.03), 'alu'); rad.add(core);
      for (var i = 0; i < 30; i++) { var fin = K.mesh(K.G.box(0.002, 0.36, 0.032), 'aluCast'); fin.position.x = -0.29 + i * 0.02; rad.add(fin); }
      [-1, 1].forEach(function (s) { var tank = K.mesh(K.G.rbox(0.05, 0.42, 0.06, 0.012), 'plasticBlack'); tank.position.x = s * 0.325; rad.add(tank); });
      rad.position.y = 0.38; root.add(rad);
      var plug = new THREE.Group(); var pw = K.mesh(K.G.cyl(0.012, 0.02, 16), 'plasticWhite'); plug.add(pw); var tab = K.mesh(K.G.box(0.024, 0.008, 0.004), 'plasticWhite'); tab.position.y = -0.012; plug.add(tab);
      root.add(plug);
      var pan = K.P.drainPan(0.2, 0.08); pan.position.set(0.32, 0, 0.05); root.add(pan);
      pan.traverse(function (o) { if (o.isMesh && o.material === K.M.oilOld) o.material = cm; });
      var stream = K.FX.stream([0.325, 0.16, 0.02], [0.33, 0.12, 0.04], [0.32, 0.06, 0.05], cm, 0.006); root.add(stream.mesh);
      return {
        root: root,
        update: function (t) {
          var out = T.seg(t, 1.2, 2.2);
          plug.position.set(0.325 + 0 * out, 0.15 - out * 0.05, 0.02 + out * 0.03); plug.rotation.z = out * 2;
          var flow = T.between(t, 2.2, 7.5) ? 1 : 0;
          stream.set(flow ? Math.min(1, (t - 2.2) * 2) : 0);
          pan.userData.setLevel(T.seg(t, 2.3, 7.5) * 0.7);
        },
        captions: [
          { text: V('Jen STUDENÝ motor! Víčko expanzní nádoby povolit pomalu', 'COLD engine only! Open the expansion tank cap slowly'), level: 'danger' },
          { text: V('Kapalinu zachyťte celou – je jedovatá, sladká a láká zvířata', 'Catch all the coolant – it is poisonous, sweet and attracts animals'), level: 'warning', show: [2.5, 8] },
          { text: V('Postup vypouštění viz návod „Výměna chladicí kapaliny“', 'Draining procedure: see the "Coolant change" tutorial'), level: 'info', show: [5, 8] }
        ]
      };
    }
  });

  function locLabel(vid) {
    return {
      'mb-cl500-c216': V('Termostat a pumpa vpředu na V8 (pumpa poháněná řemenem) – ověřit', 'Thermostat & pump at the V8 front (belt-driven pump) – verify'),
      'volvo-xc60-b4': V('Elektronicky řízený termostat, pumpa a pomocná el. čerpadla – dle VIDA', 'Electronically controlled thermostat, pump and auxiliary electric pumps – per VIDA'),
      'skoda-octavia-rs-tdi': V('Pumpa je poháněná rozvodovým řemenem – viz návod Rozvody', 'The pump is driven by the timing belt – see the Timing tutorial'),
      'toyota-gr-yaris': V('Umístění termostatu a pohon pumpy ověřte v TIS', 'Check thermostat location and pump drive in TIS'),
      'citroen-jumper-22hdi': V('Umístění a pohon pumpy ověřte v dokumentaci PSA/Fiat', 'Check pump location and drive in PSA/Fiat documentation')
    }[vid] || V('Termostat bývá u výstupu z hlavy, pumpa vpředu na motoru', 'The thermostat is usually at the head outlet, the pump at the engine front');
  }

  R('thermostat-pump.locate', {
    duration: 8, camera: { pos: [-0.9, 0.95, 1.0], target: [0, 0.4, 0], fov: 34 }, shadow: 1, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var eng = K.P.engine({ cyl: ctx.vehicle === 'toyota-gr-yaris' ? 3 : 4 }); root.add(eng);
      var len = eng.userData.len;
      var th = new THREE.Group(); var thb = K.mesh(K.G.rbox(0.07, 0.06, 0.07, 0.012), 'aluCast'); th.add(thb);
      var hose = K.mesh(K.G.tube([[0, 0.02, 0.03], [0.02, 0.06, 0.12], [-0.02, 0.05, 0.3]], 0.016), 'rubber'); th.add(hose);
      th.position.set(-len / 2 + 0.05, 0.6, 0.12); root.add(th);
      var wp = waterPump(K, { r: 0.05 }); wp.rotation.y = -PI / 2; wp.position.set(-len / 2 - 0.02, 0.32, 0.08); wp.scale.setScalar(0.9); root.add(wp);
      var g1 = K.FX.glow(th, 0xf5a524), g2 = K.FX.glow(wp, 0x3e8ed0);
      var oct = ctx.vehicle === 'skoda-octavia-rs-tdi';
      return {
        root: root,
        update: function (t) { g1(0.5 + 0.5 * Math.sin(t * 4)); g2(0.5 + 0.5 * Math.sin(t * 4 + 2)); },
        labels: [
          { text: V('Termostat', 'Thermostat'), at: function () { return th.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.08, 0)); }, level: 'accent' },
          { text: oct ? V('Vodní pumpa (za krytem rozvodů)', 'Water pump (behind timing cover)') : V('Vodní pumpa', 'Water pump'), at: function () { return wp.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.1, 0)); }, level: oct ? 'danger' : 'accent' }
        ],
        captions: [{ text: locLabel(ctx.vehicle), level: oct ? 'danger' : 'info' }]
      };
    }
  });

  R('thermostat-pump.thermoOut', {
    duration: 9, camera: { pos: [0.26, 0.28, 0.38], target: [0, 0.06, 0], fov: 34 }, shadow: 0.5, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var head = K.mesh(K.G.rbox(0.3, 0.05, 0.2, 0.01), 'aluCast'); head.position.y = -0.025; root.add(head);
      var therm = thermostat(K); therm.position.y = 0.0; root.add(therm);
      var gasket = K.mesh(K.G.torus(0.036, 0.003, PI * 2, 32), K.M.clone('rubber')); gasket.rotation.x = PI / 2; gasket.position.y = 0.003; root.add(gasket);
      var cover = new THREE.Group();
      var cb = K.mesh(K.G.lathe([[0.044, 0], [0.046, 0.005], [0.03, 0.04], [0.018, 0.045], [0.018, 0.09], [0.012, 0.09], [0.012, 0.045], [0.0, 0.045]], 32), 'aluCast'); cover.add(cb);
      var ears = K.mesh(K.G.rbox(0.13, 0.008, 0.03, 0.006), 'aluCast'); ears.position.y = 0.004; cover.add(ears);
      var hose = K.mesh(K.G.tube([[0, 0.085, 0], [0, 0.12, 0.03], [0.02, 0.14, 0.12]], 0.018), 'rubber'); cover.add(hose);
      root.add(cover);
      var bolts = [-0.055, 0.055].map(function (x) { var b = K.P.bolt({ r: 0.004, len: 0.03 }); root.add(b); b.userData.x = x; return b; });
      var fader = K.FX.fader(therm);
      return {
        root: root,
        update: function (t) {
          bolts.forEach(function (b, i) { var k = T.seg(t, 0.4 + i * 0.6, 1.2 + i * 0.6); b.position.set(b.userData.x, 0.012 + k * 0.05, 0); b.rotation.y = k * 8; b.visible = t < 2.4; });
          var up = T.seg(t, 2.4, 3.6);
          cover.position.set(up * 0.05, up * 0.12, 0);
          var tout = T.seg(t, 4.2, 5.4);
          therm.position.set(-tout * 0.12, tout * 0.08, 0);
          gasket.material.color.setHex(t > 6 ? 0x30a46c : 0x17181b);
          gasket.position.y = 0.003 + (t > 6 ? (1 - T.seg(t, 6, 7)) * 0.04 : 0);
          fader(1);
        },
        labels: [
          { text: V('Nové těsnění / O-kroužek', 'New gasket / O-ring'), at: [0.0, 0.06, 0.05], show: [6, 9], level: 'ok' },
          { text: V('Šipka / odvzdušňovací kolík nahoru', 'Arrow / jiggle pin facing up'), at: [-0.1, 0.12, 0.02], show: [4.5, 6], level: 'accent' }
        ],
        captions: [
          { text: V('Hadice, šrouby víka, víko, termostat – všímejte si orientace', 'Hose, cover bolts, cover, thermostat – note the orientation') },
          { text: V('Dosedací plochu očistit plastovou škrabkou, ne do motoru!', 'Clean the face with a plastic scraper, nothing into the engine!'), level: 'warning', show: [5, 9] }
        ]
      };
    }
  });

  R('thermostat-pump.thermoTest', {
    duration: 10, camera: { pos: [0.16, 0.46, 0.32], target: [0, 0.1, 0], fov: 34 }, shadow: 0.6, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var hob = K.mesh(K.G.rbox(0.3, 0.03, 0.3, 0.01), 'plasticBlack'); hob.position.y = 0.015; root.add(hob);
      var ring = K.mesh(K.G.torus(0.08, 0.006, PI * 2, 40), K.M.clone('hiDanger')); ring.rotation.x = PI / 2; ring.position.y = 0.032; root.add(ring);
      var pot = K.mesh(K.G.lathe([[0, 0.035], [0.1, 0.035], [0.1, 0.2], [0.104, 0.2], [0.104, 0.031], [0, 0.031]], 40), K.M.clone('steel', { side: THREE.DoubleSide })); root.add(pot);
      var water = K.mesh(K.G.cyl(0.098, 0.12, 40), 'water'); water.position.y = 0.1; root.add(water);
      var th = thermostat(K); th.position.set(0, 0.12, 0); th.rotation.x = PI; root.add(th);
      var therm = new THREE.Group(); var stem = K.mesh(K.G.cyl(0.003, 0.2, 12), 'chrome'); stem.position.y = 0.1; therm.add(stem);
      var dial = S.n4.gauge(K, 0.03, '°C'); dial.group.position.y = 0.21; therm.add(dial.group);
      therm.position.set(0.06, 0.07, 0.03); therm.rotation.z = -0.25; root.add(therm);
      var bubbles = K.FX.puff(0xffffff, 12, 0.08, 0.08); bubbles.group.position.y = 0.06; root.add(bubbles.group);
      return {
        root: root,
        update: function (t) {
          var h = T.seg(t, 0.5, 7);
          dial.setValue(0.15 + h * 0.75);
          th.userData.setOpen(T.seg(t, 4.5, 7));
          bubbles.update(t, h > 0.8);
          ring.material.emissiveIntensity = 0.4 + 0.3 * Math.sin(t * 5);
        },
        labels: [{ text: V('Otevírá se při jmenovité teplotě (vyraženo na termostatu)', 'Opens at the rated temperature (stamped on it)'), at: [0, 0.24, 0.05], show: [5, 10], level: 'ok' }],
        captions: [
          { text: V('Test (volitelný): termostat do vody, ohřívat, sledovat teploměr', 'Test (optional): thermostat in water, heat, watch the thermometer') },
          { text: V('Horká voda a pára = popáleniny. Raději rovnou nový termostat.', 'Hot water and steam = burns. Fitting a new thermostat is simpler.'), level: 'warning', show: [3, 10] }
        ]
      };
    }
  });

  R('thermostat-pump.pumpOut', {
    duration: 10, camera: { pos: [0.42, 0.24, 0.62], target: [0.03, 0, 0.05], fov: 34 }, shadow: 0.6, ground: false, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var block = K.mesh(K.G.rbox(0.36, 0.3, 0.06, 0.02), 'castIron'); block.position.z = -0.04; root.add(block);
      var cav = K.mesh(K.G.cylZ(0.045, 0.002, 32), 'blackOxide'); cav.position.z = -0.009; root.add(cav);
      var wp = waterPump(K); root.add(wp);
      var drip = K.FX.drops(S.n4.coolant(K, ctx.vehicle), 5, 0.12, 0.004); drip.group.position.set(0, -0.032, 0.05); root.add(drip.group);
      var crust = K.mesh(K.G.box(0.012, 0.03, 0.004), K.M.clone('plasticWhite', { color: 0xc9b98a })); crust.position.set(0, -0.045, 0.048); root.add(crust);
      return {
        root: root,
        update: function (t) {
          drip.update(t, t < 3);
          wp.userData.bolts.forEach(function (b, i) { var k = T.seg(t, 3 + i * 0.3, 3.5 + i * 0.3); b.position.z = 0.006 + k * 0.06; b.visible = t < 5.6; });
          var out = T.seg(t, 5.8, 7.5);
          wp.position.set(out * 0.08, out * 0.02, out * 0.12);
          wp.rotation.y = out * 0.8;
          wp.userData.impeller.rotation.z = t * 2;
        },
        labels: [
          { text: V('Odtokový (kontrolní) otvor – stopy = vadné těsnění pumpy', 'Weep hole – traces = failed pump seal'), at: [0, -0.05, 0.07], show: [0.3, 3.5], level: 'danger' },
          { text: V('Oběžné kolo', 'Impeller'), at: function () { return wp.userData.impeller.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.0, 0.06, 0)); }, show: [7.5, 10] }
        ],
        captions: [
          { text: V('Netěsná pumpa: krusty / kapky pod odtokovým otvorem, vůle řemenice', 'Leaking pump: crust / drops under the weep hole, pulley play') },
          { text: V('Řemen dolů, šrouby do kříže povolit, pumpu sundat', 'Belt off, loosen bolts in a cross pattern, remove the pump'), show: [3, 10] }
        ]
      };
    }
  });

  R('thermostat-pump.fit', {
    duration: 9, camera: { pos: [0.42, 0.24, 0.62], target: [0.03, 0, 0.05], fov: 34 }, shadow: 0.6, ground: false, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var block = K.mesh(K.G.rbox(0.36, 0.3, 0.06, 0.02), 'castIron'); block.position.z = -0.04; root.add(block);
      var wp = waterPump(K); root.add(wp);
      var tw = K.P.torqueWrench(0.3); tw.rotation.x = PI / 2; var holder = new THREE.Group(); holder.add(tw); tw.position.z = 0.03; root.add(holder);
      var order = [0, 3, 1, 2, 4];
      return {
        root: root,
        update: function (t) {
          var inn = T.seg(t, 0.4, 2.2);
          wp.position.set(0, 0, (1 - inn) * 0.14);
          wp.userData.gasket.visible = t < 2.6;
          wp.userData.gasket.position.z = -0.009;
          var i = Math.min(4, Math.max(0, Math.floor((t - 3) / 1.1)));
          var b = wp.userData.bolts[order[i]];
          holder.visible = t > 3;
          holder.position.set(b.position.x, b.position.y, b.position.z + 0.0);
          holder.rotation.z = -0.4 - T.seg((t - 3) % 1.1, 0.2, 0.8) * 0.5;
        },
        labels: [{ text: V('Nové těsnění (bez silikonu, pokud není předepsán)', 'New gasket (no sealant unless specified)'), at: [0.0, 0.08, 0.06], show: [0.4, 3], level: 'ok' }],
        captions: [
          { text: V('Plochy čisté a suché, nové těsnění, šrouby do kříže', 'Clean, dry faces, new gasket, bolts in a cross pattern') },
          { text: V('Moment dle příručky – hliník se snadno strhne', 'Torque per manual – aluminium strips easily'), level: 'warning', show: [3, 9] }
        ]
      };
    }
  });

  R('thermostat-pump.bleed', {
    duration: 9, camera: { pos: [0.55, 0.42, 0.75], target: [0.12, 0.12, 0], fov: 34 }, shadow: 0.8, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(), cm = S.n4.coolant(K, ctx.vehicle);
      var shell = K.mesh(K.G.rbox(0.18, 0.2, 0.12, 0.02), K.M.clone('plasticWhite', { transparent: true, opacity: 0.32, depthWrite: false })); shell.position.y = 0.1; shell.renderOrder = 2; root.add(shell);
      var liq = K.mesh(K.G.box(0.16, 0.18, 0.1), cm); liq.geometry.translate(0, 0.09, 0); liq.position.y = 0.01; root.add(liq);
      var maxL = K.mesh(K.G.box(0.07, 0.004, 0.002), 'plasticBlack'); maxL.position.set(-0.04, 0.13, 0.061); root.add(maxL);
      var minL = maxL.clone(); minL.position.y = 0.07; root.add(minL);
      var jug = K.P.oilCan(0x3a6ea5); jug.scale.setScalar(0.8); root.add(jug);
      var pour = K.FX.stream([0.05, 0.36, 0], [0.02, 0.3, 0], [0, 0.2, 0], cm, 0.006); root.add(pour.mesh);
      var bleed = new THREE.Group(); var hose = K.mesh(K.G.tube([[0.25, 0.05, -0.1], [0.3, 0.12, 0], [0.4, 0.1, 0.05]], 0.016), 'rubber'); bleed.add(hose);
      var screw = K.mesh(K.G.cyl(0.008, 0.02, 16), 'plasticWhite'); screw.position.set(0.3, 0.14, 0); bleed.add(screw);
      root.add(bleed);
      var bub = K.FX.puff(0xffffff, 10, 0.02, 0.08); bub.group.position.set(0.3, 0.15, 0); root.add(bub.group);
      return {
        root: root,
        update: function (t) {
          var fill = T.seg(t, 0.5, 3.5);
          jug.position.set(0.12, 0.3, 0); jug.rotation.z = fill > 0 && fill < 1 ? 2.0 : 0.4; jug.visible = t < 4;
          pour.set(T.between(t, 0.6, 3.5) ? 1 : 0);
          liq.scale.y = 0.2 + fill * 0.55 - T.seg(t, 4.5, 6) * 0.15 + T.seg(t, 7, 8) * 0.15;
          screw.position.y = 0.14 + (T.between(t, 4, 6.5) ? 0.012 : 0);
          bub.update(t, T.between(t, 4.2, 6.2));
        },
        labels: [{ text: V('Odvzdušňovací šroub – povolit, až teče bez bublin', 'Bleed screw – open until it runs bubble-free'), at: [0.3, 0.2, 0.02], show: [4, 7], level: 'accent' }],
        captions: [
          { text: V('Plnit správnou kapalinou (typ dle příručky, nemíchat)', 'Fill with the correct coolant (type per manual, do not mix)') },
          { text: V('Odvzdušnit dle postupu výrobce – vzduch = přehřátí', 'Bleed per the manufacturer procedure – air = overheating'), level: 'warning', show: [4, 9] }
        ]
      };
    }
  });

  R('thermostat-pump.test', {
    duration: 10, camera: { pos: [0, 0.02, 0.42], target: [0, 0, 0], fov: 32 }, shadow: 0.5, ground: false, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var gg = S.n4.gauge(K, 0.09, '°C'); root.add(gg.group);
      var dash = K.mesh(K.G.rbox(0.5, 0.3, 0.04, 0.03), 'plasticTex'); dash.position.z = -0.03; root.add(dash);
      var fan = new THREE.Group(); for (var i = 0; i < 5; i++) { var bl = K.mesh(K.G.box(0.05, 0.016, 0.004), 'plasticBlack'); bl.geometry.translate(0.03, 0, 0); bl.rotation.z = i / 5 * PI * 2; fan.add(bl); }
      var hub = K.mesh(K.G.cylZ(0.012, 0.01, 16), 'plasticBlack'); fan.add(hub); fan.position.set(0.17, -0.07, 0.01); root.add(fan);
      return {
        root: root,
        update: function (t) {
          gg.setValue(T.lerp(0.1, 0.5, T.seg(t, 0.5, 6)) + (t > 7 ? Math.sin(t * 2) * 0.01 : 0));
          fan.rotation.z = t > 6.5 ? -(t - 6.5) * 30 : 0;
        },
        captions: [
          { text: V('Zahřát na provozní teplotu, ručička v polovině a drží', 'Warm up to operating temperature, needle in the middle and steady') },
          { text: V('Ventilátor sepne, horní i dolní hadice chladiče teplé (opatrně!)', 'Fan switches on, upper and lower radiator hoses warm (careful!)'), level: 'ok', show: [6, 10] },
          { text: V('Po vychladnutí dolít na MAX, zkontrolovat těsnost', 'After cooling, top up to MAX, check for leaks'), level: 'info', show: [8, 10] }
        ]
      };
    }
  });

  R('thermostat-pump.timing', {
    duration: 8, camera: { pos: [0.2, 0.25, 0.9], target: [0.05, 0.15, 0], fov: 34 }, shadow: 0.8, ground: false, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var plate = K.mesh(K.G.rbox(0.62, 0.62, 0.05, 0.03), 'aluCast'); plate.position.set(0.05, 0.16, -0.05); root.add(plate);
      var circles = [{ x: 0, y: -0.05, r: 0.05 }, { x: 0.22, y: 0.02, r: 0.035 }, { x: 0.18, y: 0.38, r: 0.075 }, { x: -0.1, y: 0.2, r: 0.04 }];
      var path = K.G.beltPath(circles, 0.006);
      var belt = K.mesh(K.G.ribbon(path, 0.006, 0.026), K.M.clone('rubber', { color: 0x222326 })); root.add(belt);
      var gears = circles.map(function (c, i) { var g = K.mesh(K.G.gear(Math.round(c.r * 420), c.r, c.r - 0.004, 0.03, c.r * 0.3), i === 3 ? 'steel' : 'steelDark'); g.position.set(c.x, c.y, 0); root.add(g); return g; });
      var wpG = K.FX.glow(gears[3], 0xe5484d);
      return {
        root: root,
        update: function (t) { gears.forEach(function (g, i) { g.rotation.z = -t * 0.3 / circles[i].r; }); wpG(0.5 + 0.5 * Math.sin(t * 4)); },
        labels: [{ text: V('Vodní pumpa – poháněná rozvodovým řemenem', 'Water pump – driven by the timing belt'), at: [-0.1, 0.28, 0.03], level: 'danger' }],
        captions: [
          { text: V('U tohoto motoru se pumpa mění při výměně rozvodů', 'On this engine the pump is replaced together with the timing belt'), level: 'danger' },
          { text: V('Postup: návod „Výměna rozvodů“ (interferenční motor!)', 'Procedure: the "Timing belt replacement" tutorial (interference engine!)'), level: 'info', show: [3, 8] }
        ]
      };
    }
  });
})(window.STU);
