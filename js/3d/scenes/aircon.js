/* 3D scenes: air conditioning – what you may check yourself, and what belongs to a certified workshop. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  function refrigerant(vid) {
    return (vid === 'volvo-xc60-b4' || vid === 'toyota-gr-yaris') ? 'R1234yf' : (vid === 'generic' ? 'R134a / R1234yf' : 'R134a');
  }

  function condenserCore(K, w, h) {
    var g = new THREE.Group();
    var core = K.mesh(K.G.box(w, h, 0.02), 'aluCast'); g.add(core);
    for (var i = 0; i < Math.round(w / 0.02); i++) { var f = K.mesh(K.G.box(0.0015, h * 0.96, 0.022), 'alu'); f.position.x = -w / 2 + 0.01 + i * 0.02; g.add(f); }
    [-1, 1].forEach(function (s) { var tank = K.mesh(K.G.rbox(0.03, h + 0.03, 0.03, 0.008), 'aluCast'); tank.position.x = s * (w / 2 + 0.015); g.add(tank); });
    return g;
  }
  function compressor(K) {
    var g = new THREE.Group();
    var body = K.mesh(K.G.cylZ(0.065, 0.2, 32), 'aluCast'); body.position.z = -0.1; g.add(body);
    var pul = S.n4.pulley(K, 0.058, {}); pul.position.z = 0.016; g.add(pul);
    var plate = new THREE.Group();
    var pd = K.mesh(K.G.cylZ(0.05, 0.008, 32), 'steelDark'); plate.add(pd);
    for (var i = 0; i < 3; i++) { var sp = K.mesh(K.G.box(0.035, 0.008, 0.003), 'steel'); sp.geometry.translate(0.02, 0, 0); sp.rotation.z = i * PI * 2 / 3; sp.position.z = 0.005; plate.add(sp); }
    plate.position.z = 0.04; g.add(plate);
    [[0.04, 0.06], [-0.04, 0.06]].forEach(function (p, i) { var port = K.mesh(K.G.rbox(0.03, 0.025, 0.03, 0.006), 'alu'); port.position.set(p[0], p[1], -0.12); g.add(port); });
    var conn = K.mesh(K.G.rbox(0.02, 0.015, 0.025, 0.004), 'plasticBlack'); conn.position.set(0, -0.07, -0.05); g.add(conn);
    g.userData = { pulley: pul, plate: plate };
    return g;
  }
  function servicePort(K, high) {
    var g = new THREE.Group();
    var valve = K.mesh(K.G.cyl(high ? 0.009 : 0.008, 0.02, 16), 'alu'); valve.position.y = 0.01; g.add(valve);
    var cap = K.mesh(K.G.cyl(high ? 0.012 : 0.011, 0.016, 16), high ? K.M.clone('caliperRed') : K.M.clone('toolBlue')); cap.position.y = 0.028; g.add(cap);
    var tag = K.mesh(K.G.box(0.004, 0.006, 0.004), 'plasticWhite'); tag.position.set(0, 0.038, 0); g.add(tag);
    g.userData.cap = cap;
    return g;
  }

  R('aircon.loop', {
    duration: 10, camera: { pos: [0.15, 1.15, 2.0], target: [0.05, 0.38, 0.1], fov: 36 }, shadow: 1.2, thumbT: 4,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var cond = condenserCore(K, 0.6, 0.36); cond.position.set(0.75, 0.35, 0); cond.rotation.y = PI / 2; root.add(cond);
      var comp = compressor(K); comp.position.set(0.25, 0.15, 0.2); comp.rotation.y = PI / 2; root.add(comp);
      var dryer = K.mesh(K.G.cyl(0.03, 0.18, 24), 'alu'); dryer.position.set(0.7, 0.35, 0.38); root.add(dryer);
      var txv = K.mesh(K.G.rbox(0.05, 0.05, 0.04, 0.008), 'alu'); txv.position.set(-0.35, 0.45, 0.1); root.add(txv);
      var evapBox = K.mesh(K.G.rbox(0.36, 0.26, 0.18, 0.03), K.M.clone('plasticBlack', { transparent: true, opacity: 0.35, depthWrite: false })); evapBox.position.set(-0.62, 0.45, 0); root.add(evapBox);
      var evap = condenserCore(K, 0.26, 0.2); evap.position.set(-0.62, 0.45, 0); evap.scale.setScalar(0.9); root.add(evap);
      var pts = [[0.25, 0.22, 0.32], [0.45, 0.42, 0.3], [0.72, 0.55, 0.22], [0.75, 0.2, 0.2], [0.7, 0.26, 0.38], [0.4, 0.5, 0.3], [-0.1, 0.5, 0.15], [-0.35, 0.45, 0.1], [-0.55, 0.45, 0.05], [-0.55, 0.3, 0.1], [-0.2, 0.25, 0.2], [0.18, 0.16, 0.3]];
      var curve = new THREE.CatmullRomCurve3(pts.map(K.v3), true);
      var pipe = K.mesh(new THREE.TubeGeometry(curve, 160, 0.008, 8, true), 'alu'); root.add(pipe);
      var dots = [], mats = { hot: K.M.clone('hiDanger'), liq: K.M.clone('hiAccent'), cold: K.M.clone('hiInfo') };
      for (var i = 0; i < 40; i++) { var d = K.mesh(K.G.sphere(0.012, 8), mats.cold); d.userData.o = i / 40; d.userData.noShadow = true; root.add(d); dots.push(d); }
      var gH = S.n4.gauge(K, 0.06, 'HP', [[0, 0.6, '#30a46c'], [0.6, 1, '#e5484d']]), gL = S.n4.gauge(K, 0.06, 'LP', [[0, 0.4, '#3e8ed0'], [0.4, 1, '#30a46c']]);
      gH.group.position.set(0.1, 0.75, 0.3); gL.group.position.set(-0.08, 0.75, 0.3); root.add(gH.group); root.add(gL.group);
      return {
        root: root,
        update: function (t) {
          comp.userData.pulley.rotation.z = -t * 20; comp.userData.plate.rotation.z = -t * 20;
          dots.forEach(function (d) {
            var u = (d.userData.o + t * 0.06) % 1;
            d.position.copy(curve.getPointAt(u));
            d.material = u < 0.28 ? mats.hot : (u < 0.6 ? mats.liq : mats.cold);
          });
          gH.setValue(0.55 + Math.sin(t) * 0.03); gL.setValue(0.3 + Math.sin(t * 1.3) * 0.02);
        },
        labels: [
          { text: V('Kompresor', 'Compressor'), at: [0.25, 0.32, 0.3] },
          { text: V('Kondenzátor (před chladičem)', 'Condenser (in front of radiator)'), at: [0.75, 0.6, 0] },
          { text: V('Vysoušeč', 'Dryer'), at: [0.7, 0.48, 0.38] },
          { text: V('Expanzní ventil', 'Expansion valve'), at: [-0.35, 0.52, 0.12] },
          { text: V('Výparník (v palubní desce)', 'Evaporator (in the dashboard)'), at: [-0.62, 0.63, 0] }
        ],
        captions: [
          { text: V('Okruh je uzavřený a pod tlakem – horký plyn → kapalina → studená pára', 'Sealed, pressurised loop – hot gas → liquid → cold vapour') },
          { text: { cs: 'Chladivo vašeho vozu: ' + refrigerant(ctx.vehicle) + ' (ověřit na štítku)', en: 'Your car\'s refrigerant: ' + refrigerant(ctx.vehicle) + ' (check the label)' }, level: 'info', show: [3, 10] }
        ]
      };
    }
  });

  R('aircon.legal', {
    duration: 9, camera: { pos: [0.12, 0.36, 0.6], target: [0, 0.1, 0], fov: 34 }, shadow: 0.6, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var pipeL = K.mesh(K.G.cylX(0.008, 0.4, 16), 'alu'); pipeL.position.set(0, 0.05, -0.05); root.add(pipeL);
      var pipeH = K.mesh(K.G.cylX(0.006, 0.4, 16), 'alu'); pipeH.position.set(0, 0.05, 0.05); root.add(pipeH);
      var pL = servicePort(K, false); pL.position.set(-0.05, 0.05, -0.05); root.add(pL);
      var pH = servicePort(K, true); pH.position.set(0.05, 0.05, 0.05); root.add(pH);
      var card = K.FX.canvasPanel(0.17, 0.1, function (c, W, H) {
        c.fillStyle = '#eef3fb'; c.fillRect(0, 0, W, H); c.fillStyle = '#1e5bb8'; c.fillRect(0, 0, W, H * 0.25);
        c.fillStyle = '#fff'; c.font = 'bold ' + Math.round(H * 0.15) + 'px sans-serif'; c.fillText('F-GAS', W * 0.05, H * 0.18);
        c.fillStyle = '#222'; c.font = Math.round(H * 0.11) + 'px sans-serif'; c.fillText(S.t(V('Certifikát – chladiva', 'Certificate – refrigerants')), W * 0.05, H * 0.45);
        c.fillText('(EU) 2024/573', W * 0.05, H * 0.65);
        c.fillStyle = '#30a46c'; c.beginPath(); c.arc(W * 0.85, H * 0.65, H * 0.16, 0, PI * 2); c.fill();
      }, { px: 400 });
      card.position.set(-0.12, 0.17, 0); card.rotation.x = -0.3; root.add(card);
      var can = new THREE.Group();
      var cb = K.mesh(K.G.cyl(0.035, 0.12, 24), K.M.clone('toolBlue')); can.add(cb);
      var top = K.mesh(K.G.cyl(0.012, 0.03, 12), 'plasticBlack'); top.position.y = 0.075; can.add(top);
      var x1 = K.mesh(K.G.box(0.12, 0.012, 0.012), 'hiDanger'), x2 = x1.clone(); x1.rotation.z = PI / 4; x2.rotation.z = -PI / 4; x1.position.z = x2.position.z = 0.04; can.add(x1); can.add(x2);
      can.position.set(0.14, 0.06, 0.02); root.add(can);
      return {
        root: root,
        update: function (t) { can.rotation.y = t * 0.4; x1.visible = x2.visible = t > 3; },
        labels: [
          { text: V('L – nízkotlaký (modrá)', 'L – low pressure (blue)'), at: [-0.05, 0.11, -0.05] },
          { text: V('H – vysokotlaký (červená)', 'H – high pressure (red)'), at: [0.05, 0.11, 0.05] },
          { text: V('✖ Plnicí sprej s utěsňovačem', '✖ DIY recharge can with sealant'), at: [0.14, 0.17, 0.02], show: [3, 9], level: 'danger' }
        ],
        captions: [
          { text: V('Vypouštění, plnění a otevírání okruhu = jen certifikovaný servis (F-plyny, EU/ČR)', 'Releasing, filling or opening the circuit = certified workshop only (F-gas, EU/CZ)'), level: 'danger' },
          { text: V('Sprej s utěsňovačem ucpe okruh i servisní stanici – nikdy', 'Sealant cans clog the system and the service machine – never'), level: 'warning', show: [3, 9] },
          { text: { cs: 'Váš vůz: ' + refrigerant(ctx.vehicle) + ' (ověřit štítek pod kapotou)', en: 'Your car: ' + refrigerant(ctx.vehicle) + ' (check the bonnet label)' }, level: 'info', show: [5, 9] }
        ]
      };
    }
  });

  R('aircon.vent', {
    duration: 10, camera: { pos: [0.12, 0.08, 0.35], target: [0, 0, 0], fov: 34 }, shadow: 0.4, ground: false, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var dash = K.mesh(K.G.rbox(0.5, 0.2, 0.08, 0.03), 'plasticTex'); dash.position.z = -0.05; root.add(dash);
      var vent = K.mesh(K.G.rbox(0.13, 0.07, 0.03, 0.012), 'blackGloss'); root.add(vent);
      for (var i = 0; i < 5; i++) { var l = K.mesh(K.G.box(0.12, 0.004, 0.02), 'plasticGrey'); l.position.set(0, -0.025 + i * 0.012, 0.012); l.rotation.x = 0.2; root.add(l); }
      var probe = new THREE.Group(); var stem = K.mesh(K.G.cylZ(0.003, 0.12, 12), 'chrome'); stem.position.z = 0.06; probe.add(stem);
      var body = K.mesh(K.G.rbox(0.05, 0.09, 0.02, 0.008), 'toolYellow'); body.position.set(0, 0, 0.14); probe.add(body);
      var disp = K.FX.canvasPanel(0.04, 0.025, function (c, W, H, st) {
        c.fillStyle = '#c8d6b0'; c.fillRect(0, 0, W, H); c.fillStyle = '#111'; c.font = 'bold ' + Math.round(H * 0.6) + 'px monospace'; c.textAlign = 'center';
        c.fillText((st == null ? 24 : st) + '°C', W / 2, H * 0.72);
      }, { px: 200, state: 24 });
      disp.position.set(0, 0.015, 0.1505); probe.add(disp);
      probe.position.set(0.01, 0, 0.0); probe.rotation.x = -0.1; root.add(probe);
      var air = K.FX.puff(0xbfe3ff, 12, 0.03, 0.25); air.group.rotation.x = PI / 2; air.group.position.z = 0.02; root.add(air.group);
      return {
        root: root,
        update: function (t) {
          var temp = Math.round(T.lerp(24, 6, T.seg(t, 1, 7)));
          disp.userData.redraw(temp);
          air.update(t, true);
        },
        captions: [
          { text: V('Motor běží, A/C zapnuté, recirkulace, ventilátor naplno', 'Engine running, A/C on, recirculation, fan at max') },
          { text: V('Teploměr do středové výdechu: po pár minutách ~4–8 °C (dle okolní teploty)', 'Thermometer in the centre vent: after a few minutes ~4–8 °C (depends on ambient)'), level: 'ok', show: [6, 10] },
          { text: V('Teplejší vzduch = málo chladiva / porucha → servis', 'Warmer air = low refrigerant / fault → workshop'), level: 'info', show: [8, 10] }
        ]
      };
    }
  });

  R('aircon.clutch', {
    duration: 9, camera: { pos: [0.25, 0.15, 0.42], target: [0, 0, 0], fov: 34 }, shadow: 0.5, ground: false, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var comp = compressor(K); root.add(comp);
      var gap = K.mesh(K.G.torus(0.051, 0.0015, PI * 2, 40), 'hiAccent'); gap.position.z = 0.034; root.add(gap);
      var clutchless = ctx.vehicle === 'volvo-xc60-b4' || ctx.vehicle === 'toyota-gr-yaris' || ctx.vehicle === 'skoda-octavia-rs-tdi';
      return {
        root: root,
        update: function (t) {
          comp.userData.pulley.rotation.z = -t * 12;
          var on = T.seg(t, 3, 3.3) * (1 - T.seg(t, 7.5, 7.8));
          comp.userData.plate.position.z = 0.04 - on * 0.006;
          comp.userData.plate.rotation.z = on > 0.5 ? -t * 12 : comp.userData.plate.rotation.z;
          gap.visible = on < 0.5;
        },
        labels: [
          { text: V('Vzduchová mezera', 'Air gap'), at: [0.0, 0.07, 0.04], show: [0, 3] },
          { text: V('A/C zapnuto – přítlačný kotouč se přitáhne a točí', 'A/C on – clutch plate pulls in and spins'), at: [0.0, 0.07, 0.05], show: [3.3, 7.5], level: 'ok' }
        ],
        captions: [
          { text: V('Řemenice se točí vždy; spojka kompresoru spíná jen při zapnuté A/C', 'The pulley always spins; the compressor clutch engages only with A/C on') },
          clutchless ? { text: V('Váš vůz má pravděpodobně kompresor bez spojky (řízený ventilem) – ověřit', 'Your car probably has a clutchless (valve-controlled) compressor – verify'), level: 'info', show: [4, 9] }
            : { text: V('Nesepne? Pojistka, relé, tlakový spínač – ne hned kompresor', 'Does not engage? Fuse, relay, pressure switch – not necessarily the compressor'), level: 'info', show: [4, 9] }
        ]
      };
    }
  });

  R('aircon.filter', {
    duration: 9, camera: { pos: [0.3, 0.2, 0.55], target: [0, 0.05, 0], fov: 34 }, shadow: 0.6, ground: false, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var housing = K.mesh(K.G.rbox(0.3, 0.06, 0.25, 0.01), K.M.clone('plasticBlack', { transparent: true, opacity: 0.4, depthWrite: false })); housing.position.y = 0.03; root.add(housing);
      function filterEl(dirty) {
        var g = new THREE.Group();
        var frame = K.mesh(K.G.box(0.28, 0.03, 0.22), 'plasticGrey'); g.add(frame);
        for (var i = 0; i < 26; i++) { var p = K.mesh(K.G.box(0.006, 0.028, 0.2), dirty ? 'paperDirty' : 'paper'); p.position.x = -0.13 + i * 0.0104; p.rotation.z = (i % 2 ? 0.25 : -0.25); g.add(p); }
        if (dirty) for (var j = 0; j < 6; j++) { var leaf = K.mesh(K.G.box(0.03, 0.002, 0.02), K.M.clone('wood', { color: 0x6b4a1f })); leaf.position.set(-0.1 + j * 0.04, 0.016, (j % 3 - 1) * 0.06); leaf.rotation.y = j; g.add(leaf); }
        return g;
      }
      var oldF = filterEl(true), newF = filterEl(false);
      root.add(oldF); root.add(newF);
      var arrow = K.FX.arrow([0, 0.18, 0], [0, 0.06, 0], 0x3e8ed0, 0.008); root.add(arrow);
      return {
        root: root,
        update: function (t) {
          var out = T.seg(t, 0.8, 2.6);
          oldF.position.set(0, 0.03, out * 0.35); oldF.visible = t < 4.4;
          var inn = T.seg(t, 4.6, 6.4);
          newF.position.set(0, 0.03, (1 - inn) * 0.35); newF.visible = t > 4.4;
          arrow.visible = t > 6.4;
        },
        labels: [
          { text: V('Zanesený filtr – listí, prach', 'Clogged filter – leaves, dust'), at: function () { return oldF.position.clone().add(new THREE.Vector3(0, 0.06, 0)); }, show: [2.4, 4.4], level: 'danger' },
          { text: V('Šipka proudění dle značení', 'Airflow arrow as marked'), at: [0.0, 0.2, 0], show: [6.4, 9], level: 'ok' }
        ],
        captions: [
          { text: V('Kabinový filtr: obvykle za přihrádkou spolujezdce (ověřte)', 'Cabin filter: usually behind the passenger glovebox (verify)') },
          { text: V('Ideálně s aktivním uhlím, měnit 1× ročně', 'Ideally activated carbon, change once a year'), level: 'info', show: [4.6, 9] }
        ]
      };
    }
  });

  R('aircon.condenser', {
    duration: 9, camera: { pos: [0.55, 0.45, 0.9], target: [0, 0.25, 0], fov: 34 }, shadow: 0.8, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var cond = condenserCore(K, 0.6, 0.36); cond.position.set(0, 0.3, 0.06); root.add(cond);
      var rad = K.mesh(K.G.box(0.6, 0.38, 0.03), 'alu'); rad.position.set(0, 0.3, -0.04); root.add(rad);
      var debris = [];
      for (var i = 0; i < 18; i++) { var d = K.mesh(K.G.box(0.025, 0.02, 0.002), K.M.clone('wood', { color: i % 3 ? 0x5a4527 : 0x3b5a2a, transparent: true })); d.position.set(-0.26 + (i * 0.37) % 0.52, 0.16 + (i * 0.13) % 0.3, 0.075); d.rotation.z = i; root.add(d); debris.push(d); }
      var nozzle = new THREE.Group(); var nb = K.mesh(K.G.cylZ(0.012, 0.15, 12), 'toolYellow'); nb.position.z = -0.075; nozzle.add(nb);
      root.add(nozzle);
      var spray = K.FX.puff(0xbfe3ff, 18, 0.06, 0.25); spray.group.rotation.x = PI / 2; nozzle.add(spray.group);
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 1.5, 7);
          nozzle.position.set(-0.25 + k * 0.5, 0.3 + Math.sin(t * 3) * 0.1, -0.25);
          spray.update(t, T.between(t, 1.5, 7.2));
          debris.forEach(function (d, i) { var gone = k > (i / 18); d.material.opacity = gone ? 0 : 1; d.visible = !gone; });
        },
        captions: [
          { text: V('Kondenzátor zanesený hmyzem a listím = horší chlazení', 'Condenser clogged with insects and leaves = poorer cooling') },
          { text: V('Jemně vodou zevnitř ven (nízký tlak) – lamely se snadno ohnou', 'Gently with water from the inside out (low pressure) – fins bend easily'), level: 'warning', show: [2, 9] },
          { text: V('Motor vypnutý a studený, ventilátor může sepnout sám', 'Engine off and cold, the fan can start on its own'), level: 'danger', show: [5, 9] }
        ]
      };
    }
  });

  R('aircon.drain', {
    duration: 8, camera: { pos: [0.6, 0.35, 0.9], target: [0, 0.15, 0], fov: 34 }, shadow: 0.8, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var floor = K.mesh(K.G.box(0.9, 0.02, 0.6), 'plasticTex'); floor.position.y = 0.3; root.add(floor);
      var spout = K.mesh(K.G.tube([[0, 0.3, 0], [0, 0.26, 0.02], [0.02, 0.22, 0.05]], 0.012), 'rubber'); root.add(spout);
      var drops = K.FX.drops(K.M.water, 6, 0.22, 0.007); drops.group.position.set(0.02, 0.21, 0.05); root.add(drops.group);
      var puddle = K.mesh(K.G.cyl(0.08, 0.002, 32), 'water'); puddle.position.set(0.02, 0.002, 0.05); root.add(puddle);
      return {
        root: root,
        update: function (t) { drops.update(t, true); puddle.scale.setScalar(0.4 + T.seg(t, 0, 8) * 0.8); },
        labels: [{ text: V('Kapající voda pod vozem = normální', 'Water dripping under the car = normal'), at: [0.02, 0.12, 0.08], level: 'ok' }],
        captions: [
          { text: V('Kondenzát odtéká hadičkou pod vůz – je to jen voda', 'Condensate drains through a tube under the car – it is just water') },
          { text: V('Mokrý koberec u spolujezdce = ucpaná odtoková hadička', 'Wet carpet on the passenger side = blocked drain tube'), level: 'warning', show: [3, 8] }
        ]
      };
    }
  });

  R('aircon.leak', {
    duration: 8, camera: { pos: [0.12, 0.12, 0.3], target: [0, 0.02, 0], fov: 34 }, shadow: 0.4, ground: false, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var p1 = K.mesh(K.G.cylX(0.009, 0.2, 16), 'alu'); p1.position.x = -0.1; root.add(p1);
      var p2 = K.mesh(K.G.cylX(0.009, 0.2, 16), 'alu'); p2.position.x = 0.1; root.add(p2);
      var nut = K.mesh(K.G.hex(0.016, 0.03), 'alu'); nut.rotation.z = PI / 2; root.add(nut);
      var oil = K.mesh(K.G.cylX(0.012, 0.06, 16), K.M.clone('oil', { opacity: 0.55, color: 0x6b5a1a })); root.add(oil);
      var dye = K.mesh(K.G.cylX(0.0125, 0.05, 16), K.M.clone('hiOk', { emissive: 0x7dff3a, emissiveIntensity: 0, transparent: true, opacity: 0.0 })); root.add(dye);
      var torch = new THREE.Group(); var tb = K.mesh(K.G.cylX(0.012, 0.12, 16), 'plasticBlack'); tb.position.x = 0.06; torch.add(tb);
      var lens = K.mesh(K.G.cylX(0.013, 0.004, 16), K.M.clone('lightWhite', { emissive: 0x7b3fe0 })); torch.add(lens);
      torch.position.set(0.1, 0.08, 0.06); torch.rotation.z = -0.6; root.add(torch);
      var uv = new THREE.PointLight(0x8c5bff, 0, 0.5); uv.position.set(0.05, 0.05, 0.04); root.add(uv);
      return {
        root: root,
        update: function (t) {
          var on = T.seg(t, 3, 3.6);
          uv.intensity = on * 1.5; dye.material.opacity = on * 0.8; dye.material.emissiveIntensity = on * 1.8;
          torch.visible = t > 2.6;
        },
        labels: [
          { text: V('Mastná, zaprášená skvrna u spoje', 'Oily, dusty patch at a joint'), at: [0, 0.04, 0.02], show: [0.3, 3] },
          { text: V('UV barvivo svítí = netěsnost', 'UV dye glows = leak'), at: [0, 0.04, 0.02], show: [3.6, 8], level: 'danger' }
        ],
        captions: [
          { text: V('Hledejte mastné skvrny na spojích, kompresoru a kondenzátoru', 'Look for oily patches on joints, compressor and condenser') },
          { text: V('Nalezenou netěsnost opraví servis – okruh sami neotevírejte', 'A workshop fixes the leak – never open the circuit yourself'), level: 'danger', show: [4, 8] }
        ]
      };
    }
  });

  R('aircon.smell', {
    duration: 9, camera: { pos: [0.3, 0.25, 0.55], target: [0, 0.12, 0], fov: 34 }, shadow: 0.6, ground: false, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var box = K.mesh(K.G.rbox(0.36, 0.24, 0.16, 0.03), K.M.clone('plasticBlack', { transparent: true, opacity: 0.35, depthWrite: false })); box.position.y = 0.12; root.add(box);
      var evap = condenserCore(K, 0.26, 0.18); evap.position.y = 0.12; root.add(evap);
      var mould = [];
      for (var i = 0; i < 10; i++) { var m = K.mesh(K.G.sphere(0.012, 8), K.M.clone('epoxy', { color: 0x3d4a2a, transparent: true })); m.position.set(-0.11 + i * 0.024, 0.06 + (i % 4) * 0.035, 0.012); m.scale.z = 0.3; root.add(m); mould.push(m); }
      var foam = K.FX.puff(0xffffff, 18, 0.1, 0.12); foam.group.position.set(0, 0.06, 0.02); root.add(foam.group);
      var smell = K.FX.puff(0x8a9a6a, 10, 0.06, 0.25); smell.group.position.set(0.1, 0.25, 0.06); root.add(smell.group);
      return {
        root: root,
        update: function (t) {
          smell.update(t, t < 3.5);
          foam.update(t, T.between(t, 3.5, 6.5));
          var clean = T.seg(t, 4, 7);
          mould.forEach(function (m) { m.material.opacity = 1 - clean; m.visible = clean < 0.98; });
        },
        captions: [
          { text: V('Zatuchlý zápach = plíseň a bakterie na výparníku', 'Musty smell = mould and bacteria on the evaporator') },
          { text: V('Nový filtr + dezinfekce výparníku (pěna / ultrazvuk) dle návodu přípravku', 'New filter + evaporator disinfection (foam / ultrasonic) per product instructions'), level: 'info', show: [3.5, 9] },
          { text: V('Tip: 2 min před vypnutím motoru vypnout A/C a nechat foukat – výparník vyschne', 'Tip: switch A/C off 2 min before stopping, keep the fan on – the evaporator dries'), level: 'ok', show: [6.5, 9] }
        ]
      };
    }
  });

  R('aircon.workshop', {
    duration: 9, camera: { pos: [0.9, 0.9, 1.5], target: [0.2, 0.5, 0], fov: 34 }, shadow: 1.2, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var st = new THREE.Group();
      var cab = K.mesh(K.G.rbox(0.5, 0.95, 0.45, 0.04), K.M.clone('plasticWhite', { color: 0xdfe4ea })); cab.position.y = 0.55; st.add(cab);
      var gH = S.n4.gauge(K, 0.07, 'HP', [[0, 0.6, '#30a46c'], [0.6, 1, '#e5484d']]), gL = S.n4.gauge(K, 0.07, 'LP', [[0, 0.4, '#3e8ed0'], [0.4, 1, '#30a46c']]);
      gH.group.position.set(0.1, 0.85, 0.23); gL.group.position.set(-0.1, 0.85, 0.23); st.add(gH.group); st.add(gL.group);
      var scr = K.FX.canvasPanel(0.26, 0.14, function (c, W, H, s) {
        c.fillStyle = '#0d1a24'; c.fillRect(0, 0, W, H); c.fillStyle = '#9fd3f2'; c.font = 'bold ' + Math.round(H * 0.16) + 'px sans-serif';
        var steps = [V('1. Odsátí chladiva', '1. Recover refrigerant'), V('2. Vakuum + test těsnosti', '2. Vacuum + leak test'), V('3. Plnění dle hmotnosti', '3. Charge by weight')];
        steps.forEach(function (st2, i) { c.fillStyle = i === s ? '#f5a524' : '#9fd3f2'; c.fillText(S.t(st2), W * 0.05, H * (0.3 + i * 0.25)); });
      }, { px: 420, state: 0 });
      scr.position.set(0, 0.64, 0.226); st.add(scr);
      [-1, 1].forEach(function (sd, i) {
        var hose = K.mesh(K.G.tube([[sd * 0.12, 0.75, 0.24], [sd * 0.2, 0.6, 0.6], [0.6 + sd * 0.05, 0.62, 0.7], [0.95 + sd * 0.05, 0.7, 0.4]], 0.01), i ? K.M.clone('caliperRed') : K.M.clone('toolBlue'));
        st.add(hose);
      });
      st.position.x = -0.2; root.add(st);
      var front = K.mesh(K.G.rbox(0.5, 0.25, 0.6, 0.05), 'plasticTex'); front.position.set(0.9, 0.62, 0.3); root.add(front);
      return {
        root: root,
        update: function (t) {
          var s = t < 3 ? 0 : (t < 6 ? 1 : 2);
          scr.userData.redraw(s);
          gL.setValue(s === 1 ? 0.05 : 0.35); gH.setValue(s === 2 ? 0.6 : 0.3);
        },
        captions: [
          { text: V('Servis A/C: odsátí, vakuum, kontrola těsnosti, plnění přesným množstvím', 'A/C service: recovery, vacuum, leak test, exact charge by weight') },
          { text: V('Množství chladiva je na štítku pod kapotou', 'The refrigerant amount is on the label under the bonnet'), level: 'info', show: [4, 9] }
        ]
      };
    }
  });
})(window.STU);
