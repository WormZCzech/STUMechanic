/* 3D scenes: self-check before the Czech roadworthiness test (STK). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  /** Clone + switch emissive for all meshes in a lamp group. Returns fn(on:boolean, colorHex?). */
  function lampSwitch(K, group, colorHex, base) {
    var mats = [];
    if (!group) return function () {};
    group.traverse(function (o) {
      if (!o.isMesh) return;
      o.material = o.material.clone(); o.material.userData = {};
      if (o.material.emissive) { o.material.emissive = new THREE.Color(colorHex); mats.push(o.material); }
    });
    return function (on) { mats.forEach(function (m) { m.emissiveIntensity = on ? 2.2 : (base == null ? 0.15 : base); }); };
  }

  R('stk-check.lights', {
    duration: 12, camera: { pos: [5, 1.6, 3.2], target: [0, 0.7, 0], fov: 34 }, shadow: 3.2, thumbT: 9,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var b = c.body, d = c.dims, s = c.spec;
      var hl = [lampSwitch(K, b.getObjectByName('headlightL'), 0xfff4dd), lampSwitch(K, b.getObjectByName('headlightR'), 0xfff4dd)];
      var tl = [lampSwitch(K, b.getObjectByName('taillightL'), 0xff1a1a, 0.35), lampSwitch(K, b.getObjectByName('taillightR'), 0xff1a1a, 0.35)];
      var beams = [-1, 1].map(function (sd) {
        var cone = K.mesh(new THREE.ConeGeometry(0.5, 2.2, 24, 1, true), K.M.clone('lightWhite', { transparent: true, opacity: 0.12, depthWrite: false }));
        cone.rotation.z = PI / 2; cone.position.set(d.front + 1.1, s.hoodF - 0.15, sd * (d.W / 2 - 0.3)); cone.userData.noShadow = true; root.add(cone); return cone;
      });
      var ind = [-1, 1].map(function (sd) { var m = K.mesh(K.G.sphere(0.035, 12), K.M.clone('lightAmber')); m.position.set(d.rear - 0.02, s.style === 'van' ? 1.15 : s.deckR - 0.13, sd * (d.W / 2 - 0.12)); root.add(m); return m; });
      return {
        root: root,
        cameraPath: function (t) {
          var k = T.seg(t, 4.5, 6.5), sc = Math.max(1, s.H / 1.45);
          var a = -0.6 + k * (PI - 0.1);
          return { pos: [Math.cos(a) * 6 * sc, 1.6 * sc, Math.sin(a) * 4 * sc + 1], target: [0, s.belt * 0.7, 0] };
        },
        update: function (t) {
          var front = t < 5;
          hl.forEach(function (f) { f(front && t > 0.5); });
          beams.forEach(function (bm) { bm.visible = front && t > 2; });
          var brake = t > 7 && t < 8.5, rev = t > 8.5 && t < 9.7, blink = t > 9.7 && Math.floor(t * 3) % 2 === 0;
          tl.forEach(function (f) { f(brake || rev); });
          ind.forEach(function (m, i) { m.material.emissiveIntensity = (blink || (t > 5 && t < 7 && i === 0 && Math.floor(t * 3) % 2 === 0)) ? 2.5 : 0.1; });
        },
        captions: [
          { text: V('Potkávací, dálková, obrysová, mlhová, směrovky (+ výstražná)', 'Low beam, high beam, side lights, fog, indicators (+ hazards)'), show: [0, 5] },
          { text: V('Brzdová (i 3. brzdové), couvací, zadní mlhovka, osvětlení SPZ', 'Brake (incl. 3rd brake light), reverse, rear fog, number plate light'), show: [5, 12] },
          { text: V('Pomocník za vozem nebo odraz ve výloze / garážových vratech', 'A helper behind the car or a reflection in a shop window / garage door'), level: 'info', show: [3, 12] }
        ]
      };
    }
  });

  /* dashboard cluster with warning lamps */
  var LAMPS = [
    { c: '#e5484d', t: '(!)' }, { c: '#e5484d', t: 'AIRBAG' }, { c: '#f5c518', t: 'ABS' }, { c: '#f5c518', t: 'ENG' },
    { c: '#e5484d', t: 'OIL' }, { c: '#e5484d', t: '+ −' }, { c: '#f5c518', t: 'ESP' }, { c: '#e5484d', t: 'BELT' }
  ];
  R('stk-check.cabin', {
    duration: 8, camera: { pos: [0, 0.03, 0.62], target: [0, 0, 0], fov: 32 }, ground: false, shadow: 0.6, thumbT: 1.2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bezel = K.mesh(K.G.rbox(0.56, 0.26, 0.04, 0.03), 'plasticBlack'); bezel.position.z = -0.025; root.add(bezel);
      var scr = K.FX.canvasPanel(0.5, 0.2, function (c, W, H, st) {
        c.fillStyle = '#0b1218'; c.fillRect(0, 0, W, H);
        LAMPS.forEach(function (l, i) {
          var on = st.on[i];
          var x = W * (0.08 + (i % 4) * 0.23), y = H * (0.18 + Math.floor(i / 4) * 0.42);
          c.fillStyle = on ? l.c : '#1d2630'; c.fillRect(x, y, W * 0.18, H * 0.3);
          c.fillStyle = on ? '#111' : '#3b4652'; c.font = '800 ' + Math.round(H * 0.11) + 'px system-ui'; c.textAlign = 'center';
          c.fillText(l.t, x + W * 0.09, y + H * 0.2);
        });
      }, { px: 640, state: { on: [] } });
      root.add(scr);
      return {
        root: root,
        update: function (t) {
          var on = LAMPS.map(function (l, i) {
            if (t < 0.8) return false;
            if (t < 3) return true;               // ignition on: bulb check
            if (i === 1 && t > 5.5) return true;  // demo: airbag lamp stays on = fail
            return t < 3 + 0.25 * i;
          });
          scr.userData.redraw({ on: on });
        },
        captions: [
          { text: V('Zapalování ON: všechny kontrolky se rozsvítí (test žárovek)…', 'Ignition ON: all warning lights light up (bulb check)…'), show: [0, 3] },
          { text: V('…a po nastartování musí zhasnout', '…and must go out after starting'), show: [3, 5.5] },
          { text: V('Svítící kontrolka airbagu / ABS / motoru = neprojdete STK', 'A lit airbag / ABS / engine light = fail at the inspection'), level: 'danger', show: [5.5, 8] }
        ]
      };
    }
  });

  R('stk-check.brakes', {
    duration: 8, camera: { pos: [0.7, 0.55, 0.8], target: [0, 0.25, 0], fov: 36 }, shadow: 1.2, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var floor = K.mesh(K.G.box(0.8, 0.02, 0.8), 'fabric'); floor.position.y = 0.01; root.add(floor);
      var pedal = new THREE.Group();
      var arm = K.mesh(K.G.rbox(0.025, 0.32, 0.02, 0.006), 'steelDark'); arm.position.y = -0.16; pedal.add(arm);
      var padP = K.mesh(K.G.rbox(0.09, 0.07, 0.015, 0.008), 'rubber'); padP.position.y = -0.32; pedal.add(padP);
      pedal.position.set(-0.15, 0.55, -0.15); root.add(pedal);
      var lever = new THREE.Group();
      var lb = K.mesh(K.G.rbox(0.04, 0.03, 0.3, 0.012), 'plasticBlack'); lb.position.z = 0.15; lever.add(lb);
      var grip = K.mesh(K.G.rbox(0.045, 0.035, 0.1, 0.014), 'leather'); grip.position.z = 0.28; lever.add(grip);
      lever.position.set(0.25, 0.12, -0.15); root.add(lever);
      var gauge = K.FX.canvasPanel(0.14, 0.06, function (c, W, H, st) {
        c.fillStyle = '#0d1a24'; c.fillRect(0, 0, W, H); c.fillStyle = st > 0 ? '#30a46c' : '#3b4652'; c.fillRect(W * 0.08, H * 0.35, W * 0.84 * st, H * 0.3);
        c.fillStyle = '#fff'; c.font = '700 ' + Math.round(H * 0.28) + 'px system-ui'; c.textAlign = 'center'; c.fillText(st > 0.9 ? S.t(V('pevný ✔', 'firm ✔')) : '…', W / 2, H * 0.3);
      }, { px: 360, state: 0 });
      gauge.position.set(-0.15, 0.62, 0); root.add(gauge);
      return {
        root: root,
        update: function (t) {
          var p = T.pulse(t % 2.6, 0, 2.6) * (t < 5.2 ? 1 : 0);
          pedal.rotation.x = p * 0.35;
          gauge.userData.redraw(t < 5.2 ? Math.round(p * 10) / 10 : 1);
          lever.rotation.x = -T.seg(t, 5.4, 6.4) * 0.5 * (1 - T.seg(t, 7.3, 8));
        },
        labels: [{ text: V('ruční brzda: 3–6 cvaknutí, vůz drží', 'handbrake: 3–6 clicks, holds the car'), at: [0.25, 0.32, 0.1], show: [5.4, 8], level: 'accent' }],
        captions: [
          { text: V('Pedál: pevný, neklesá při delším stisku, vůz netáhne do strany', 'Pedal: firm, does not sink when held, car does not pull to one side') },
          { text: V('STK měří brzdné účinky na válcích – nerovnoměrnost vlevo/vpravo = závada', 'The inspection measures braking on rollers – left/right imbalance = defect'), level: 'info', show: [3, 8] }
        ]
      };
    }
  });

  R('stk-check.play', {
    duration: 8, camera: { pos: [0.95, 0.65, 1.2], target: [0, 0.45, 0], fov: 34 }, shadow: 1.2, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var s = K.carSpec(ctx.vehicle);
      var wheel = K.P.wheel({ r: s.wr, w: s.tw, rim: s.wr * 0.7, rimMat: s.rim || 'rimSilver' });
      var hold = new THREE.Group(); hold.position.y = s.wr + 0.08; hold.add(wheel); root.add(hold);
      var stand = K.P.axleStand({ h: 0.05 }); stand.position.set(-0.6, 0, -0.4); root.add(stand);
      var hands = [K.P.glove(), K.P.glove()];
      hands.forEach(function (h) { h.rotation.y = PI; hold.add(h); });
      return {
        root: root,
        update: function (t) {
          var horiz = t > 4;
          var rock = Math.sin(t * 9) * 0.012;
          hands[0].position.set(horiz ? s.wr * 0.9 : 0, horiz ? 0 : s.wr * 0.9, s.tw / 2 + 0.06);
          hands[1].position.set(horiz ? -s.wr * 0.9 : 0, horiz ? 0 : -s.wr * 0.9, s.tw / 2 + 0.06);
          hands[0].rotation.z = horiz ? -PI / 2 : 0; hands[1].rotation.z = horiz ? PI / 2 : PI;
          wheel.rotation.x = horiz ? 0 : rock; wheel.rotation.y = horiz ? rock : 0;
        },
        captions: [
          { text: V('Kolo ve vzduchu: zakývejte za 12 a 6 h → vůle = ložisko / čep', 'Wheel off the ground: rock at 12 and 6 o\'clock → play = bearing / ball joint'), show: [0, 4] },
          { text: V('Za 3 a 9 h → vůle = tyč / čep řízení', 'At 3 and 9 o\'clock → play = tie rod / steering joint'), show: [4, 8] },
          { text: V('Vůz zvedejte jen podle návodu na zvedání – na stojany', 'Lift only per the lifting tutorial – on stands'), level: 'danger' }
        ]
      };
    }
  });

  function steeringWheel(K) {
    var g = new THREE.Group();
    var rim = K.mesh(K.G.torus(0.18, 0.017, PI * 2, 48), 'leather'); g.add(rim);
    var hub = K.mesh(K.G.rbox(0.12, 0.1, 0.05, 0.02), 'plasticBlack'); hub.position.z = 0.01; g.add(hub);
    [0, PI * 0.65, PI * 1.35].forEach(function (a) { var sp = K.mesh(K.G.rbox(0.15, 0.03, 0.02, 0.008), 'plasticBlack'); sp.position.set(Math.cos(a - PI / 2) * 0.09, Math.sin(a - PI / 2) * 0.09, 0); sp.rotation.z = a - PI / 2; g.add(sp); });
    var mark = K.mesh(K.G.box(0.012, 0.03, 0.02), K.M.clone('hiAccent')); mark.position.set(0, 0.18, 0.012); g.add(mark);
    return g;
  }
  R('stk-check.steering', {
    duration: 6, camera: { pos: [0, 0.25, 0.75], target: [0, 0.05, 0], fov: 34 }, ground: false, shadow: 0.8, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var sw = steeringWheel(K); root.add(sw);
      var col = K.mesh(K.G.cylZ(0.03, 0.4, 16), 'plasticBlack'); col.position.z = -0.22; root.add(col);
      var arc = K.mesh(K.G.torus(0.21, 0.004, 0.35, 24), K.M.clone('hiOk')); arc.rotation.z = PI / 2 - 0.175; root.add(arc);
      return {
        root: root,
        update: function (t) { sw.rotation.z = Math.sin(t * 2.5) * 0.17; },
        labels: [{ text: V('volný chod (bez pohybu kol)', 'free play (wheels not moving)'), at: [0, 0.25, 0], level: 'accent' }],
        captions: [
          { text: V('Motor běží, kola rovně: pootáčejte, dokud se kola nezačnou hýbat', 'Engine running, wheels straight: turn gently until the wheels start to move') },
          { text: V('Velká vůle, klepání nebo drhnutí = závada řízení – nejezdit a nechat zkontrolovat', 'Large play, clunking or binding = steering defect – do not drive, have it checked'), level: 'danger', show: [2.5, 6] }
        ]
      };
    }
  });

  R('stk-check.leaks', {
    duration: 7, camera: { pos: [3.6, 1.4, 3.2], target: [0.6, 0.15, 0], fov: 34 }, shadow: 3, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var d = c.dims;
      var spots = [
        { x: d.xf - 0.3, z: 0.1, mat: 'oilOld', txt: V('hnědá/černá = olej', 'brown/black = oil') },
        { x: d.xf + 0.25, z: -0.3, mat: 'coolantPink', txt: V('růžová/zelená/modrá = chladicí kapalina', 'pink/green/blue = coolant') },
        { x: d.xf - 0.1, z: 0.6, mat: 'brakeFluid', txt: V('nažloutlá, u kola = brzdová kapalina!', 'yellowish, near a wheel = brake fluid!') }
      ];
      var drops = K.FX.drops(K.M.oilOld, 6, d.clr + 0.05, 0.007);
      drops.group.position.set(spots[0].x, d.clr + 0.05, spots[0].z); root.add(drops.group);
      var puddles = spots.map(function (sp) {
        var p = K.mesh(K.G.cyl(0.12, 0.003, 32), sp.mat); p.position.set(sp.x, 0.003, sp.z); p.scale.set(1, 1, 0.7); root.add(p); return p;
      });
      return {
        root: root,
        cameraPath: function () { var k = Math.max(1, c.spec.H / 1.45); return { pos: [d.front + 1.6 * k, 1.3 * k, 2.6 * k], target: [d.xf, 0.1, 0] }; },
        update: function (t) {
          drops.update(t, true);
          puddles.forEach(function (p, i) { var k = T.seg(t, 0.5 + i * 1.5, 1.5 + i * 1.5); p.scale.set(0.2 + 0.8 * k, 1, (0.2 + 0.8 * k) * 0.7); });
        },
        labels: spots.map(function (sp, i) { return { text: sp.txt, at: [sp.x, 0.08, sp.z], show: [1 + i * 1.5, 7], level: i === 2 ? 'danger' : 'accent' }; }),
        captions: [
          { text: V('Přes noc dejte pod vůz čistý karton – ráno uvidíte barvu a místo úniku', 'Put clean cardboard under the car overnight – in the morning you see the colour and location') },
          { text: V('Úniky oleje a kapalin jsou na STK závada (a brzdová kapalina = nejezdit)', 'Oil and fluid leaks fail the inspection (and brake fluid = do not drive)'), level: 'danger', show: [4, 7] }
        ]
      };
    }
  });

  R('stk-check.exhaust', {
    duration: 7, camera: { pos: [-4, 1.0, 2.6], target: [-1.6, 0.3, 0], fov: 34 }, shadow: 3, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var d = c.dims;
      var diesel = ctx.vehicle === 'skoda-octavia-rs-tdi' || ctx.vehicle === 'citroen-jumper-22hdi';
      var smoke = K.FX.puff(diesel ? 0x2a2a2a : 0xd8dde3, 16, 0.25, 0.6); smoke.group.position.set(d.rear - 0.1, c.spec.clr + 0.1, -0.4); smoke.group.rotation.z = PI / 2.4; root.add(smoke.group);
      var meter = K.FX.canvasPanel(0.5, 0.26, function (cx2, W, H, st) {
        cx2.fillStyle = '#0d1a24'; cx2.fillRect(0, 0, W, H); cx2.fillStyle = '#fff'; cx2.textAlign = 'center';
        cx2.font = '700 ' + Math.round(H * 0.14) + 'px system-ui'; cx2.fillText(S.t(diesel ? V('Opacita kouře (diesel)', 'Smoke opacity (diesel)') : V('Emise CO / λ (benzín)', 'Emissions CO / λ (petrol)')), W / 2, H * 0.22);
        cx2.fillStyle = st === 2 ? '#30a46c' : '#f5c518'; cx2.font = '800 ' + Math.round(H * 0.3) + 'px system-ui'; cx2.fillText(st === 0 ? '…' : (st === 1 ? S.t(V('měří se', 'measuring')) : 'OK'), W / 2, H * 0.68);
      }, { px: 480, state: 0 });
      meter.position.set(d.rear - 0.6, 1.5, 0.8); meter.rotation.y = -PI / 2.6; root.add(meter);
      return {
        root: root,
        update: function (t) { smoke.update(t, t > 1 && t < 5); meter.userData.redraw(t < 1 ? 0 : (t < 5 ? 1 : 2)); },
        captions: [
          { text: diesel ? V('Diesel: měří se kouřivost při volné akceleraci – zanesený motor / DPF = neprojdete', 'Diesel: smoke is measured during free acceleration – a dirty engine / DPF fails') : V('Benzín: CO, HC a lambda při volnoběhu a zvýšených otáčkách', 'Petrol: CO, HC and lambda at idle and raised rpm') },
          { text: V('Výfuk musí být těsný (bez syčení, sazí u spojů) a pevně uchycený', 'The exhaust must be leak-free (no hissing, soot at joints) and securely mounted'), level: 'info', show: [3, 7] },
          diesel ? { text: V('Odstraněný DPF / úprava řídicí jednotky = neprojdete STK a je to nezákonné', 'A removed DPF / tampered ECU = fails the inspection and is illegal'), level: 'danger', show: [4.5, 7] } : { text: V('Před STK projeďte vůz – teplý motor a katalyzátor měří lépe', 'Drive the car before the test – a warm engine and catalyst measure better'), show: [4.5, 7] }
        ]
      };
    }
  });

  R('stk-check.vin', {
    duration: 6, camera: { pos: [0.0, 0.05, 0.6], target: [0, 0, 0], fov: 34 }, ground: false, shadow: 0.6, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var plate = K.FX.canvasPanel(0.3, 0.12, function (c, W, H) {
        c.fillStyle = '#cfd5dc'; c.fillRect(0, 0, W, H); c.strokeStyle = '#555'; c.lineWidth = 6; c.strokeRect(6, 6, W - 12, H - 12);
        c.fillStyle = '#111'; c.font = '800 ' + Math.round(H * 0.16) + 'px monospace'; c.textAlign = 'center';
        c.fillText('VIN  XXXXXXXXXXXXXXXXX', W / 2, H * 0.36); c.font = '600 ' + Math.round(H * 0.12) + 'px monospace';
        c.fillText('kg  ——  ——  ——', W / 2, H * 0.62); c.fillText('1- ——   2- ——', W / 2, H * 0.84);
      }, { px: 600 });
      plate.position.set(-0.12, 0.08, 0); root.add(plate);
      var docs = K.FX.canvasPanel(0.18, 0.24, function (c, W, H) {
        c.fillStyle = '#f2ead3'; c.fillRect(0, 0, W, H); c.fillStyle = '#7a1f1f'; c.fillRect(0, 0, W, H * 0.12);
        c.fillStyle = '#111'; c.font = '700 ' + Math.round(H * 0.06) + 'px system-ui'; c.textAlign = 'left';
        [S.t(V('Osvědčení o registraci', 'Registration certificate')), 'VIN ……', S.t(V('rozměr pneu ……', 'tyre size ……')), S.t(V('STK do: ……', 'inspection due: ……'))].forEach(function (l, i) { c.fillText(l, W * 0.08, H * (0.24 + i * 0.12)); });
      }, { px: 360 });
      docs.position.set(0.17, -0.02, 0.01); docs.rotation.z = -0.08; root.add(docs);
      return {
        root: root,
        update: function (t) { plate.position.z = 0.0 + Math.sin(t) * 0.002; },
        captions: [
          { text: V('VIN na štítku i na karoserii čitelný a shodný s ORV', 'VIN on the plate and on the body legible and matching the papers') },
          { text: V('Doklady: ORV (malý TP), případně TP, protokol z minulé STK', 'Documents: registration certificate, possibly the vehicle passport, last inspection report'), level: 'info', show: [2, 6] }
        ]
      };
    }
  });

  R('stk-check.kit', {
    duration: 6, camera: { pos: [0.7, 0.75, 0.9], target: [0, 0.1, 0], fov: 34 }, shadow: 1, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var box = K.mesh(K.G.rbox(0.24, 0.08, 0.15, 0.02), K.M.clone('caliperRed', { color: 0xd23a3a })); box.position.set(-0.25, 0.04, 0.05); root.add(box);
      var cross = K.mesh(K.G.box(0.07, 0.002, 0.02), 'plasticWhite'); cross.position.set(-0.25, 0.081, 0.05); root.add(cross);
      var cross2 = K.mesh(K.G.box(0.02, 0.002, 0.07), 'plasticWhite'); cross2.position.set(-0.25, 0.081, 0.05); root.add(cross2);
      var tri = new THREE.Group();
      [0, 1, 2].forEach(function (i) { var bar = K.mesh(K.G.box(0.42, 0.04, 0.012), K.M.clone('lightRed', { emissiveIntensity: 0.3 })); var a = i * 2 * PI / 3; bar.position.set(Math.cos(a + PI / 2) * -0.12, Math.sin(a + PI / 2) * -0.12, 0); bar.rotation.z = a; tri.add(bar); });
      tri.position.set(0.15, 0.25, -0.15); root.add(tri);
      var vest = K.mesh(K.G.rbox(0.28, 0.02, 0.32, 0.02), K.M.clone('toolYellow', { emissive: 0xc8e000, emissiveIntensity: 0.2, color: 0xd8f000 })); vest.position.set(0.25, 0.01, 0.2); root.add(vest);
      [0.06, 0.14].forEach(function (z) { var st = K.mesh(K.G.box(0.29, 0.022, 0.025), 'chrome'); st.position.set(0.25, 0.012, 0.2 - 0.16 + z * 2); root.add(st); });
      return {
        root: root,
        update: function (t) { tri.rotation.y = Math.sin(t * 0.8) * 0.2; },
        labels: [
          { text: V('lékárnička (platná)', 'first-aid kit (in date)'), at: [-0.25, 0.14, 0.05], level: 'accent' },
          { text: V('výstražný trojúhelník', 'warning triangle'), at: [0.15, 0.48, -0.15], level: 'accent' },
          { text: V('reflexní vesta na dosah řidiče', 'reflective vest within driver\'s reach'), at: [0.25, 0.08, 0.2], level: 'accent' }
        ],
        captions: [
          { text: V('Povinná výbava v ČR – aktuální seznam ověřte (vyhláška se mění)', 'Mandatory equipment in CZ – verify the current list (the regulation changes)'), level: 'info' },
          { text: V('Rezerva / sada na opravu pneu + hever a klíč dle výbavy vozu', 'Spare wheel / tyre repair kit + jack and wrench per the car\'s equipment'), show: [2.5, 6] }
        ]
      };
    }
  });
})(window.STU);
