/* 3D scenes: wipers & washers – service position, lifting arms, blade change, fluid, nozzles, test. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  /** Wiper arms fitted to the windscreen of K.car c. Pivots at the cowl, arms rest towards +Z (left).
   *  set(i, sweep 0..1, lift 0..1). Local frame of each pivot: Y = up the glass, X = glass normal, Z = lateral. */
  function wiperRig(K, c) {
    var s = c.spec, cx = s.L / 2, W = s.W;
    var x0 = s.ws0 - cx - 0.02, y0 = s.belt + 0.01, x1 = s.rf - cx, y1 = s.H;
    var u = new THREE.Vector2(x1 - x0, y1 - y0).normalize();
    var theta = Math.atan2(-u.x, u.y);
    var van = s.style === 'van';
    var cfg = [{ z: -W * 0.05, len: W * (van ? 0.36 : 0.33), blade: van ? 0.65 : 0.6 }, { z: -W * 0.43, len: W * (van ? 0.33 : 0.3), blade: van ? 0.6 : 0.48 }];
    var arms = cfg.map(function (cf) {
      var p = new THREE.Group();
      p.position.set(x0 + u.x * 0.05, y0 + u.y * 0.05, cf.z);
      p.rotation.z = theta;
      var cap = K.mesh(K.G.cyl(0.02, 0.025, 16), 'plasticBlack'); cap.rotation.z = PI / 2; cap.position.x = 0.012; p.add(cap);
      var sweep = new THREE.Group(); p.add(sweep);
      var lift = new THREE.Group(); sweep.add(lift);
      var arm = K.mesh(K.G.rbox(0.012, 0.022, cf.len, 0.004), 'blackGloss'); arm.position.set(0.022, 0, cf.len / 2); lift.add(arm);
      var spring = K.mesh(K.G.rbox(0.02, 0.03, 0.09, 0.006), 'blackGloss'); spring.position.set(0.026, 0, 0.05); lift.add(spring);
      var blade = new THREE.Group();
      var frame = K.mesh(K.G.rbox(0.016, 0.022, cf.blade, 0.006), 'plasticBlack'); frame.position.x = 0.014; blade.add(frame);
      var rubber = K.mesh(K.G.box(0.008, 0.006, cf.blade * 0.98), 'rubber'); rubber.position.x = 0.003; blade.add(rubber);
      var adapter = K.mesh(K.G.rbox(0.024, 0.026, 0.04, 0.005), 'plasticGrey'); adapter.position.x = 0.022; blade.add(adapter);
      blade.position.set(0.0, 0, cf.len);
      lift.add(blade);
      c.group.add(p);
      return { pivot: p, sweep: sweep, lift: lift, blade: blade, len: cf.len };
    });
    return {
      arms: arms, u: u, x0: x0, y0: y0,
      set: function (i, sw, lf) {
        var a = arms[i];
        a.sweep.rotation.x = -sw * 1.55;
        a.lift.rotation.y = (lf || 0) * 1.15;
      },
      tipWorld: function (i) { return arms[i].blade.getWorldPosition(new THREE.Vector3()); }
    };
  }
  S.wiperRig = wiperRig;

  function frontCam(c, back) {
    var d = c.dims, s = c.spec;
    back = (back || 1) * Math.max(1, s.H / 1.4);
    return { pos: [d.front + 2.2 * back, s.H + 1.0 * back, 1.8 * back], target: [s.ws0 - s.L / 2 + 0.1, s.belt + 0.2 * back, -0.2] };
  }

  var SERVICE = {
    'generic': V('Servisní poloha: dle příručky (u mnoha vozů vypnout zapalování a do 10 s stisknout páčku stěračů dolů)', 'Service position: per manual (on many cars switch the ignition off and within 10 s push the wiper stalk down)'),
    'mb-cl500-c216': V('Servisní poloha dle příručky Mercedes – ověřit', 'Service position per Mercedes manual – verify'),
    'volvo-xc60-b4': V('Servisní poloha: centrální displej → nastavení stěračů (ověřit)', 'Service position: centre display → wiper settings (verify)'),
    'skoda-octavia-rs-tdi': V('Servisní poloha: vypnout zapalování, do 10 s páčku stěračů dolů (ověřit)', 'Service position: ignition off, within 10 s push the wiper stalk down (verify)'),
    'toyota-gr-yaris': V('Ramena lze zvednout přímo (ověřit v příručce)', 'Arms can be lifted directly (verify in the manual)'),
    'citroen-jumper-22hdi': V('Ramena lze zvednout přímo (ověřit v příručce)', 'Arms can be lifted directly (verify in the manual)')
  };

  R('wipers.service', {
    duration: 6, camera: { pos: [4.4, 2.4, 1.8], target: [1, 1, -0.2], fov: 34 }, shadow: 3, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var w = wiperRig(K, c);
      return {
        root: root,
        cameraPath: function () { return frontCam(c); },
        update: function (t) { var k = T.seg(t, 1, 2.6) * (1 - T.seg(t, 5.4, 6)); w.set(0, k * 0.22); w.set(1, k * 0.22); },
        labels: [{ text: V('servisní poloha', 'service position'), at: function () { return w.tipWorld(0).add(new THREE.Vector3(0.05, 0.12, 0)); }, show: [2.6, 5.4], level: 'accent' }],
        captions: [
          { text: SERVICE[ctx.vehicle] || SERVICE.generic },
          { text: V('Ramena v klidové poloze zvedat nejdou – narazí do kapoty!', 'Arms in the park position cannot be lifted – they hit the bonnet!'), level: 'danger', show: [2.6, 6] }
        ]
      };
    }
  });

  R('wipers.lift', {
    duration: 7, camera: { pos: [4.4, 2.4, 1.8], target: [1, 1, -0.2], fov: 34 }, shadow: 3, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var w = wiperRig(K, c);
      var towel = K.mesh(K.G.box(0.004, 0.25, 0.35), K.M.clone('plasticWhite', { roughness: 1 }));
      towel.position.set(w.x0 + w.u.x * 0.25 + 0.01, w.y0 + w.u.y * 0.25 + 0.02, 0.1);
      towel.rotation.z = Math.atan2(-w.u.x, w.u.y);
      root.add(towel);
      return {
        root: root,
        cameraPath: function () { return frontCam(c); },
        update: function (t) {
          w.set(0, 0.22, T.seg(t, 0.8, 2.0) * (1 - T.seg(t, 5.8, 6.8) * 0.0));
          w.set(1, 0.22, T.seg(t, 2.2, 3.4));
          towel.visible = t > 3.6;
          if (t > 5.8) { var k = T.seg(t, 5.8, 6.8); w.set(0, 0.22, 1 - k); w.set(1, 0.22, 1 - k); }
        },
        labels: [{ text: V('ručník na sklo', 'towel on the glass'), at: function () { return towel.position.clone().add(new THREE.Vector3(0, 0.15, 0)); }, show: [3.6, 6.8], level: 'ok' }],
        captions: [
          { text: V('Rameno zvedejte za konec, kolmo od skla, dokud nezaskočí', 'Lift the arm by its end, straight away from the glass, until it latches') },
          { text: V('Rameno bez lišty může prudce udeřit do skla a prasknout ho – dejte na sklo ručník', 'An arm without a blade can snap onto the glass and crack it – put a towel on the glass'), level: 'danger', show: [3, 7] }
        ]
      };
    }
  });

  /* Close-up: J-hook adapter. Arm along +X, hook at x=0. */
  function hookRig(K) {
    var g = new THREE.Group();
    var arm = K.mesh(K.G.rbox(0.5, 0.02, 0.012, 0.004), 'blackGloss'); arm.position.set(-0.25, 0, 0); g.add(arm);
    var hook = K.mesh(K.G.torus(0.012, 0.004, PI, 20), 'blackGloss'); hook.position.set(0.0, -0.012, 0); hook.rotation.z = -PI / 2; g.add(hook);
    var tail = K.mesh(K.G.box(0.04, 0.008, 0.012), 'blackGloss'); tail.position.set(-0.02, -0.024, 0); g.add(tail);
    return g;
  }
  function bladeObj(K, old) {
    var b = new THREE.Group();
    var frame = K.mesh(K.G.rbox(0.55, 0.018, 0.022, 0.006), 'plasticBlack'); b.add(frame);
    var rubber = K.mesh(K.G.box(0.54, 0.008, 0.007), old ? 'rust' : 'rubber'); rubber.position.y = -0.012; b.add(rubber);
    var adapter = new THREE.Group();
    var ad = K.mesh(K.G.rbox(0.045, 0.02, 0.026, 0.005), 'plasticGrey'); adapter.add(ad);
    var tab = K.mesh(K.G.box(0.012, 0.006, 0.02), K.M.clone('hiAccent')); tab.position.set(0.012, 0.012, 0); adapter.add(tab);
    adapter.position.y = 0.018; b.add(adapter);
    b.userData.tab = tab;
    return b;
  }

  R('wipers.hook', {
    duration: 10, camera: { pos: [0.18, 0.22, 0.42], target: [-0.02, -0.02, 0], fov: 34 }, ground: false, shadow: 0.6, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bench = K.mesh(K.G.box(1.2, 0.02, 0.5), 'wood'); bench.position.y = -0.09; root.add(bench);
      root.add(hookRig(K));
      var oldB = bladeObj(K, true), newB = bladeObj(K, false);
      root.add(oldB); root.add(newB);
      return {
        root: root,
        update: function (t) {
          // 0-1 press tab, 1-2.5 slide old blade down the arm, 2.5-4 take away, 5-7 new blade in, 7-8 click
          var press = T.pulse(t, 0.6, 1.6);
          oldB.userData.tab.position.y = 0.012 - press * 0.004;
          var slide = T.seg(t, 1.2, 2.5), away = T.seg(t, 2.6, 4);
          oldB.position.set(-slide * 0.06, -0.035 - away * 0.12, away * 0.15);
          oldB.visible = t < 4.2;
          var inK = T.seg(t, 5, 6.6), seat = T.seg(t, 6.6, 7.4);
          newB.visible = t > 4.8;
          newB.position.set(-0.06 * (1 - seat), -0.035 - (1 - inK) * 0.12, (1 - inK) * 0.15);
        },
        labels: [
          { text: V('stiskněte pojistku', 'press the release tab'), at: [0.012, 0.0, 0.02], show: [0.3, 1.8], level: 'accent' },
          { text: V('cvak – zajištěno', 'click – locked'), at: [0, 0.02, 0.02], show: [7.4, 10], level: 'ok' },
          { text: V('stará lišta: roztřepená guma', 'old blade: frayed rubber'), at: [-0.1, -0.08, 0.1], show: [2.5, 4], level: 'danger' }
        ],
        captions: [
          { text: V('Háčkový (J) adaptér: pojistka → lištu posunout k ose ramena → vyvléknout', 'J-hook adapter: release tab → slide the blade towards the arm pivot → unhook'), show: [0, 4.5] },
          { text: V('Novou lištu nasunout opačně, dokud nezacvakne. Zkontrolujte, že drží.', 'Fit the new blade the opposite way until it clicks. Check it is secure.'), show: [4.5, 10] },
          { text: V('Jiný typ uchycení (pin, boční) – adaptér je v balení nové lišty', 'Other mounting types (pin, side) – the adapter comes with the new blade'), level: 'info', show: [7.4, 10] }
        ]
      };
    }
  });

  R('wipers.lower', {
    duration: 5, camera: { pos: [4.4, 2.4, 1.8], target: [1, 1, -0.2], fov: 34 }, shadow: 3, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var w = wiperRig(K, c);
      var hand = K.P.glove(); root.add(hand);
      return {
        root: root,
        cameraPath: function () { return frontCam(c); },
        update: function (t) {
          var k = T.seg(t, 0.8, 3.2);
          w.set(0, 0.22, 1 - k); w.set(1, 0.22, 1);
          hand.position.copy(w.tipWorld(0)).add(new THREE.Vector3(0.12, 0.06, 0));
          hand.rotation.z = -PI / 2;
        },
        captions: [
          { text: V('Rameno spouštějte pomalu a držte ho rukou až ke sklu', 'Lower the arm slowly and hold it until it touches the glass') },
          { text: V('Pak zapněte zapalování a stěrače vraťte do klidové polohy (1× setřít)', 'Then switch on the ignition and return the wipers to park (one wipe)'), level: 'info', show: [3, 5] }
        ]
      };
    }
  });

  R('wipers.inspect', {
    duration: 6, camera: { pos: [0.0, 0.35, 0.55], target: [0, 0, 0], fov: 34 }, ground: false, shadow: 0.6, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bench = K.mesh(K.G.box(1.2, 0.02, 0.6), 'wood'); bench.position.y = -0.03; root.add(bench);
      var oldB = bladeObj(K, true); oldB.rotation.z = PI; oldB.position.set(0, 0.0, -0.08); root.add(oldB);
      var newB = bladeObj(K, false); newB.rotation.z = PI; newB.position.set(0, 0.0, 0.08); root.add(newB);
      var nicks = [];
      for (var i = 0; i < 6; i++) { var n = K.mesh(K.G.box(0.006, 0.006, 0.009), 'wood'); n.position.set(-0.22 + i * 0.08, 0.012, -0.08); root.add(n); nicks.push(n); }
      return {
        root: root,
        update: function (t) { oldB.rotation.x = Math.sin(t) * 0.05; },
        labels: [
          { text: V('stará: tvrdá, popraskaná, natržená', 'old: hard, cracked, torn'), at: [0, 0.05, -0.08], level: 'danger' },
          { text: V('nová: ostrá rovná hrana', 'new: sharp straight edge'), at: [0, 0.05, 0.08], level: 'ok' }
        ],
        captions: [
          { text: V('Šmouhy, drnčení, nestírané pruhy = vyměnit (obvykle 1× ročně)', 'Smears, chattering, unwiped streaks = replace (usually once a year)') },
          { text: V('Délka lišt se vpředu často liší – ověřte podle vozu', 'Front blade lengths often differ – check for your car'), level: 'info', show: [2.5, 6] }
        ]
      };
    }
  });

  R('wipers.fluid', {
    duration: 8, camera: { pos: [0.55, 0.55, 0.65], target: [0, 0.2, 0], fov: 34 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var tank = K.mesh(K.G.rbox(0.22, 0.24, 0.14, 0.03), K.M.clone('plasticWhite', { transparent: true, opacity: 0.45 })); tank.position.y = 0.12; root.add(tank);
      var liquid = K.mesh(K.G.box(0.2, 1, 0.12), K.M.clone('coolantBlue')); root.add(liquid);
      var neck = K.mesh(K.G.cyl(0.025, 0.06, 20), 'plasticWhite'); neck.position.set(0.06, 0.27, 0); root.add(neck);
      var cap = K.mesh(K.G.cyl(0.03, 0.02, 20), 'toolBlue'); root.add(cap);
      var can = K.P.oilCan(0x2f7ed8); can.scale.setScalar(0.8); root.add(can);
      var stream = K.FX.stream([0.06, 0.4, 0], [0.06, 0.38, 0], [0.06, 0.29, 0], K.M.coolantBlue, 0.006);
      root.add(stream.mesh);
      var temp = S.textPanel3d(K, 0.14, 0.06, '#1e5bb8', [[V('ZIMNÍ −20 °C', 'WINTER −20 °C'), 0.42, '#fff']], { top: 0.18 });
      temp.position.set(-0.17, 0.28, 0.07); root.add(temp);
      return {
        root: root,
        update: function (t) {
          var open = T.seg(t, 0.4, 1.2);
          cap.position.set(0.06 + open * 0.08, 0.31 + open * 0.05, 0);
          var pour = T.seg(t, 1.6, 2.4) * (1 - T.seg(t, 6.4, 7));
          can.position.set(0.06 + 0.18, 0.4, 0); can.rotation.z = pour * 1.9;
          can.visible = t > 1.2 && t < 7.2;
          stream.set(pour > 0.9 ? 1 : 0);
          var lvl = 0.03 + 0.16 * T.seg(t, 2.4, 6.4);
          liquid.scale.y = lvl; liquid.position.y = 0.012 + lvl / 2;
          if (t > 7.2) cap.position.set(0.06, 0.31, 0);
        },
        captions: [
          { text: V('Celoročně používejte kapalinu s nemrznoucí přísadou, v zimě −20 °C a méně', 'Use washer fluid with antifreeze; in winter rated −20 °C or lower') },
          { text: V('Nikdy jen čistou vodu v zimě – zamrzne a roztrhne nádržku i čerpadlo', 'Never plain water in winter – it freezes and splits the tank and pump'), level: 'danger', show: [3, 8] },
          { text: V('Nezaměňte s chladicí nebo brzdovou kapalinou – víčko se symbolem ostřikovače!', 'Do not confuse with coolant or brake fluid – the cap has the washer symbol!'), level: 'info', show: [5, 8] }
        ]
      };
    }
  });

  R('wipers.nozzle', {
    duration: 7, camera: { pos: [0.45, 0.32, 0.55], target: [-0.12, 0.12, 0], fov: 36 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var hood = K.mesh(K.G.box(0.6, 0.02, 0.6), K.M.carPaint(K.carSpec(ctx.vehicle).paint)); hood.position.set(0, 0.0, 0); root.add(hood);
      var glass = K.mesh(K.G.box(0.01, 0.5, 0.7), 'glass'); glass.position.set(-0.42, 0.2, 0); glass.rotation.z = 0.95; root.add(glass);
      var noz = new THREE.Group();
      var nb = K.mesh(K.G.rbox(0.03, 0.016, 0.02, 0.006), 'plasticBlack'); noz.add(nb);
      var ball = K.mesh(K.G.sphere(0.005, 12), 'chrome'); ball.position.set(-0.016, 0.004, 0); noz.add(ball);
      noz.position.set(0.0, 0.018, 0); root.add(noz);
      var needle = K.mesh(K.G.cylX(0.0008, 0.12, 6), 'chrome'); root.add(needle);
      var drops = [];
      for (var i = 0; i < 18; i++) { var d = K.mesh(K.G.sphere(0.004, 8), K.M.water); d.userData.o = i / 18; root.add(d); drops.push(d); }
      var target = K.mesh(K.G.torus(0.05, 0.004, PI * 2, 32), K.M.clone('hiOk')); target.position.set(-0.35, 0.33, 0); target.rotation.y = PI / 2; target.rotation.x = 0.9; root.add(target);
      return {
        root: root,
        update: function (t) {
          var adj = T.seg(t, 0.6, 2.6);
          needle.position.set(0.04, 0.026, 0); needle.visible = t < 3;
          var aim = -0.25 + 0.25 * adj; // jet climbs onto the target
          drops.forEach(function (d) {
            var k = (t * 1.3 + d.userData.o) % 1;
            d.visible = t > 3.2;
            d.position.set(-0.02 - k * 0.33, 0.025 + k * (0.42 + aim) - k * k * 0.12, Math.sin(d.userData.o * 30) * 0.01);
          });
        },
        captions: [
          { text: V('Tryska se seřizuje jehlou (kulová) nebo je pevná – ověřte typ', 'The nozzle is adjusted with a needle (ball type) or is fixed – check the type') },
          { text: V('Paprsek má mířit do horní třetiny stíraného pole', 'The jet should hit the upper third of the wiped area'), level: 'info', show: [3, 7] }
        ]
      };
    }
  });

  R('wipers.test', {
    duration: 6, camera: { pos: [4.4, 2.4, 1.8], target: [1, 1, -0.2], fov: 34 }, shadow: 3, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var w = wiperRig(K, c);
      return {
        root: root,
        cameraPath: function () { return frontCam(c); },
        update: function (t) {
          var ph = (t % 1.6) / 1.6, k = Math.sin(ph * PI);
          w.set(0, k * 0.95); w.set(1, k * 0.95);
        },
        captions: [
          { text: V('Test: ostřikovače + všechny rychlosti stěračů, bez drnčení a šmouh', 'Test: washers + all wiper speeds, no chattering or smearing') },
          { text: V('Nikdy nestírejte suché nebo zamrzlé sklo – zničíte lišty i motorek', 'Never wipe a dry or frozen windscreen – it ruins the blades and the motor'), level: 'danger', show: [2, 6] }
        ]
      };
    }
  });
})(window.STU);
