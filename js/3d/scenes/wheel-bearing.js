/* 3D scenes: wheel bearing diagnosis & replacement. Uses S.n3 corner rig (struts-springs.js) at build time. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  function n3() { return S.n3; }
  var NUT = {
    'generic': V('dle příručky', 'per manual'), 'skoda-octavia-rs-tdi': V('dle ELSA (moment + úhel)', 'per ELSA (torque + angle)'),
    'toyota-gr-yaris': V('dle TIS', 'per TIS'), 'volvo-xc60-b4': V('dle VIDA', 'per VIDA'), 'mb-cl500-c216': V('dle WIS (zadní náprava)', 'per WIS (rear axle)'),
    'citroen-jumper-22hdi': V('dle příručky PSA/Fiat', 'per PSA/Fiat manual')
  };

  /** Bearing cut-away: outer race, inner races, balls, seals, ABS encoder ring. Axis Z. */
  function bearing(K, o) {
    o = o || {};
    var G = K.G, g = new THREE.Group();
    var outer = K.mesh(G.latheZ([[0.042, -0.022], [0.06, -0.022], [0.06, 0.022], [0.042, 0.022], [0.044, 0.01], [0.044, -0.01]], 48), 'steel'); g.add(outer);
    var inner = K.mesh(G.latheZ([[0.022, -0.022], [0.034, -0.022], [0.032, -0.01], [0.032, 0.01], [0.034, 0.022], [0.022, 0.022]], 48), 'steel'); g.add(inner);
    var balls = new THREE.Group();
    [-0.011, 0.011].forEach(function (z) {
      for (var i = 0; i < 14; i++) { var a = i / 14 * PI * 2; var b = K.mesh(G.sphere(0.0058, 12), 'chrome'); b.position.set(Math.cos(a) * 0.038, Math.sin(a) * 0.038, z); balls.add(b); }
    });
    g.add(balls);
    var enc = K.mesh(G.latheZ([[0.036, 0.022], [0.05, 0.022], [0.05, 0.026], [0.036, 0.026]], 48), o.dirty ? 'rust' : 'plasticBlack'); g.add(enc);
    var seal = K.mesh(G.latheZ([[0.035, -0.024], [0.043, -0.024], [0.043, -0.022], [0.035, -0.022]], 48), 'rubber'); g.add(seal);
    g.userData = { balls: balls, outer: outer, inner: inner, encoder: enc };
    return g;
  }

  R('wheel-bearing.hum', {
    duration: 8, camera: { pos: [3.4, 1.4, 5.0], target: [0.3, 0.5, 0], fov: 34 }, shadow: 3.5, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var big = ctx.vehicle === 'citroen-jumper-22hdi';
      var fw = c.wheels.filter(function (w) { return w.side > 0 && w.axle === 'f'; })[0];
      var rings = [];
      for (var i = 0; i < 4; i++) {
        var m = K.M.clone('hiAccent', { transparent: true, opacity: 0.6 });
        var r = K.mesh(K.G.torus(0.2, 0.006, PI * 2, 48), m); r.userData.noShadow = true;
        r.position.copy(fw.pivot.position); r.position.z += 0.18; root.add(r); rings.push(r);
      }
      var road = K.mesh(K.G.box(30, 0.002, 4), 'plasticTex'); road.position.y = 0.001; road.receiveShadow = true; root.add(road);
      var marks = [];
      for (var j = 0; j < 10; j++) { var mk = K.mesh(K.G.box(1, 0.003, 0.1), 'plasticWhite'); mk.position.set(-12 + j * 3, 0.003, 1.6); root.add(mk); marks.push(mk); }
      return {
        root: root,
        update: function (t, dt) {
          var speed = 6 + 8 * T.seg(t, 0, 4) - 6 * T.seg(t, 6, 8);
          marks.forEach(function (mk, i) { mk.position.x = ((-12 + i * 3 - t * speed) % 30 + 30) % 30 - 15; });
          c.wheels.forEach(function (w) { w.wheel.rotation.z = -t * speed / c.dims.wr; });
          var turn = T.seg(t, 4, 5) - T.seg(t, 6.5, 7.5);
          c.group.rotation.x = turn * 0.02;
          rings.forEach(function (r, i) {
            var k = ((t * (0.6 + speed / 20)) + i / 4) % 1;
            r.scale.setScalar(0.6 + k * 1.6); r.material.opacity = (1 - k) * (0.35 + turn * 0.5);
          });
        },
        cameraPath: big ? function () { return { pos: [5.4, 2, 7.2], target: [0.3, 0.9, 0], fov: 34 }; } : null,
        labels: [{ text: V('hučení roste s rychlostí', 'hum rises with speed'), at: function () { return fw.pivot.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.5, 0.2)); }, level: 'accent' }],
        captions: [
          { text: V('Hučení / „letadlo“ sílí s rychlostí, ne s otáčkami motoru', 'Humming / "aeroplane" noise grows with road speed, not engine rpm') },
          { text: V('Změní se v zatáčce? Zatížené ložisko je na VNĚJŠÍ straně oblouku', 'Changes in a bend? The loaded bearing is on the OUTSIDE of the bend'), show: [4, 8], level: 'info' }
        ]
      };
    }
  });

  R('wheel-bearing.play', {
    duration: 7, camera: { pos: [0.55, 0.62, 1.35], target: [0, 0.32, 0], fov: 36 }, shadow: 1.6, thumbT: 2,
    build: function (ctx, K) {
      var rig = n3().corner(K, ctx, { wheel: true });
      var h1 = K.P.glove(), h2 = K.P.glove(); rig.root.add(h1); rig.root.add(h2);
      var parts = [rig.hub, rig.brake, rig.wheel], base = parts.map(function (p) { return p.rotation.clone(); });
      return {
        root: rig.root,
        update: function (t) {
          var a = Math.sin(t * 5) * 0.012 * (t < 4.5 ? 1 : 0);
          parts.forEach(function (p, i) { p.rotation.copy(base[i]); p.rotation.x += a; });
          h1.position.set(0, 0.64, 0.13); h1.rotation.set(PI, 0, 0);
          h2.position.set(0, 0.0, 0.13);
          rig.wheel.rotation.z = t > 4.5 ? (t - 4.5) * 3 : 0;
        },
        labels: [
          { text: V('vůle 12/6, která zmizí při brzdě = ložisko', 'play at 12/6 that disappears with the brake on = bearing'), at: [0, 0.75, 0.12], show: [0, 4.5], level: 'accent' },
          { text: V('protočit: drnčení / drhnutí', 'spin: grinding / roughness'), at: [0, 0.75, 0.12], show: [4.5, 7], level: 'accent' }
        ],
        captions: [
          { text: V('Kolo ve visu: kývat na 12/6, pak protočit rukou a poslouchat', 'Wheel hanging: rock at 12/6, then spin by hand and listen') },
          { text: V('Mechanický stetoskop na těhlici pomůže najít vadnou stranu', 'A mechanic\'s stethoscope on the knuckle helps find the bad side'), show: [4.5, 7] }
        ]
      };
    }
  });

  R('wheel-bearing.types', {
    duration: 10, camera: { pos: [0.1, 0.3, 0.55], target: [0, 0.1, 0], fov: 38 }, shadow: 0.6, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, G = K.G, root = new THREE.Group();
      // A) hub unit (flange + bearing + bolts) / B) pressed cartridge bearing
      var hubUnit = new THREE.Group(); hubUnit.position.set(-0.11, 0.1, 0); root.add(hubUnit);
      var flange = K.mesh(G.latheZ([[0.022, 0.03], [0.07, 0.03], [0.072, 0.018], [0.064, 0.012], [0.064, -0.03], [0.022, -0.03]], 48), 'steelDark'); hubUnit.add(flange);
      var bU = bearing(K); bU.position.z = -0.01; hubUnit.add(bU);
      for (var i = 0; i < 4; i++) { var a = i / 4 * PI * 2 + PI / 4; var b = K.P.bolt({ r: 0.006, len: 0.03 }); b.rotation.x = PI / 2; b.position.set(Math.cos(a) * 0.075, Math.sin(a) * 0.075, -0.05); hubUnit.add(b); }
      var pressed = new THREE.Group(); pressed.position.set(0.11, 0.1, 0); root.add(pressed);
      var kn = K.mesh(G.latheZ([[0.06, -0.025], [0.09, -0.025], [0.09, 0.025], [0.06, 0.025]], 48), 'castIron'); pressed.add(kn);
      var bP = bearing(K); pressed.add(bP);
      var circ = K.mesh(G.torus(0.061, 0.0018, PI * 1.8, 32), 'blackOxide'); circ.position.z = 0.026; pressed.add(circ);
      [hubUnit, pressed].forEach(function (g) { g.rotation.y = -0.5; });
      return {
        root: root,
        update: function (t) {
          [bU, bP].forEach(function (b) { b.userData.balls.rotation.z = t * 1.2; b.userData.inner.rotation.z = t * 2.4; });
          var cut = T.seg(t, 1, 3);
          bU.userData.outer.visible = bP.userData.outer.visible = !(t > 3 && t < 8);
        },
        labels: [
          { text: V('A) náboj s ložiskem (šroubovaný)', 'A) hub unit (bolted)'), at: [-0.11, 0.21, 0], level: 'accent' },
          { text: V('B) ložisko lisované do těhlice', 'B) bearing pressed into the knuckle'), at: [0.11, 0.21, 0], level: 'accent' },
          { text: V('magnetický kroužek ABS', 'magnetic ABS ring'), at: [0.11, 0.06, 0.04], show: [3, 8] }
        ],
        captions: [
          { text: V('Typ zjistěte podle VIN – určuje nářadí i postup', 'Find the type by VIN – it decides tools and procedure') },
          { text: V('A: 3–4 šrouby, výměna celé jednotky. B: lis, vytlačovací sada, pojistný kroužek', 'A: 3–4 bolts, swap the whole unit. B: press, puller kit, circlip'), show: [3, 10] }
        ]
      };
    }
  });

  R('wheel-bearing.lift', {
    duration: 6, camera: { pos: [2.4, 1.15, 4.6], target: [0.6, 0.35, 0.6], fov: 34 }, shadow: 3, thumbT: 3,
    build: function (ctx, K) {
      var L = n3().liftedCar(K, ctx), cam = n3().liftCam(ctx);
      return {
        root: L.rig.root,
        cameraPath: function () { return cam; },
        captions: [
          { text: V('Matici hnací hřídele povolit JEŠTĚ NA ZEMI (kolo nasazené, brzda)', 'Loosen the drive-shaft nut WHILE STILL ON THE GROUND (wheel on, brake applied)'), level: 'accent' },
          { text: V('Pak zvednout na stojany a sundat kolo', 'Then lift onto stands and remove the wheel') }
        ]
      };
    }
  });

  R('wheel-bearing.axleNut', {
    duration: 7, camera: { pos: [0.75, 0.55, 1.1], target: [0.05, 0.32, 0.02], fov: 34 }, shadow: 1.6, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, rig = n3().corner(K, ctx, { wheel: false });
      var holder = new THREE.Group(); holder.position.set(0, 0.32, 0.035); rig.root.add(holder);
      var bar = K.P.breakerBar(0.6); bar.rotation.x = PI / 2; bar.position.z = 0.07; holder.add(bar);
      var sock = K.mesh(K.G.cylZ(0.024, 0.06, 24), 'chrome'); sock.position.z = 0.03; holder.add(sock);
      return {
        root: rig.root,
        update: function (t) {
          var k = T.seg(t, 1, 2.6) - T.seg(t, 3.4, 4.6);
          holder.rotation.z = 0.4 + k * 0.7;
          rig.axleNut.rotation.z = k * 0.7;
        },
        labels: [{ text: V('↺ povolit', '↺ loosen'), at: [0.12, 0.5, 0.06], level: 'accent', show: [1, 3.4] }],
        captions: [
          { text: V('Matice hnací hřídele: obrovský moment – dlouhá páka, stabilní postoj', 'Drive-shaft nut: huge torque – long bar, stable stance'), level: 'danger' },
          { text: { cs: 'Matice bývá na jedno použití. Utažení: ' + (NUT[ctx.vehicle] || NUT.generic).cs, en: 'The nut is often single-use. Tightening: ' + (NUT[ctx.vehicle] || NUT.generic).en }, show: [2, 7] },
          { text: V('Nikdy nepovolovat, když je vůz jen na heveru!', 'Never break it loose with the car on a jack only!'), show: [4.5, 7], level: 'danger' }
        ]
      };
    }
  });

  R('wheel-bearing.brakeOff', {
    duration: 8, camera: { pos: [0.85, 0.6, 1.15], target: [0, 0.35, -0.03], fov: 36 }, shadow: 1.6, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, rig = n3().corner(K, ctx, { wheel: false });
      var cal = rig.caliper, disc = rig.disc;
      var hook = K.mesh(K.G.tube([[0.0, 0.85, -0.09], [0.02, 0.75, -0.05], [-0.05, 0.62, -0.02]], 0.0025), 'steel'); rig.root.add(hook);
      return {
        root: rig.root,
        update: function (t) {
          var up = T.seg(t, 1, 3);
          cal.position.set(-up * 0.1, up * 0.25, -0.027 + up * 0.05); cal.rotation.z = up * 0.5;
          hook.visible = t > 2.8;
          var off = T.seg(t, 4, 6);
          disc.position.z = -0.027 + off * 0.25;
        },
        labels: [{ text: V('třmen zavěsit – ne za hadici!', 'hang the caliper – not by the hose!'), at: function () { return n3().wp(cal, [0, 0.12, 0]); }, show: [2.5, 8], level: 'danger' }],
        captions: [
          { text: V('Třmen s držákem dolů (viz návod Brzdy), kotouč sundat', 'Caliper with carrier off (see the Brakes tutorial), remove the disc') },
          { text: V('Brzdová hadice nesmí být napnutá ani zkroucená', 'The brake hose must not be stretched or twisted'), show: [3, 8], level: 'danger' }
        ]
      };
    }
  });

  R('wheel-bearing.abs', {
    duration: 8, camera: { pos: [0.48, 0.52, 0.55], target: [0.03, 0.27, -0.08], fov: 38 }, shadow: 1, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, rig = n3().corner(K, ctx, { wheel: false, caliper: false });
      rig.disc.visible = false;
      var abs = rig.abs, b0 = abs.position.clone();
      var magnet = K.mesh(K.G.box(0.03, 0.02, 0.012), 'hiDanger'); magnet.position.set(-0.05, 0.3, 0.04); rig.root.add(magnet);
      return {
        root: rig.root,
        update: function (t) {
          var out = T.seg(t, 1, 2.6);
          abs.position.copy(b0).add(new THREE.Vector3(0, -out * 0.02, -out * 0.05));
          magnet.visible = t > 4;
          magnet.position.x = -0.05 + Math.sin(t * 3) * 0.01;
        },
        labels: [
          { text: V('snímač ABS – opatrně ven', 'ABS sensor – out carefully'), at: function () { return n3().wp(abs, [0, 0.04, 0]); }, show: [0.5, 4], level: 'accent' },
          { text: V('✖ magnety, nečistoty', '✖ magnets, dirt'), at: function () { return n3().wp(magnet, [0, 0.03, 0]); }, show: [4, 8], level: 'danger' }
        ],
        captions: [
          { text: V('Snímač ABS vyjmout dřív, než se tluče/lisuje – snadno se zlomí', 'Remove the ABS sensor before hammering/pressing – it breaks easily') },
          { text: V('Magnetický kroužek ložiska (kodér) nepoškrábat, nedávat k magnetům', 'Do not scratch the magnetic encoder ring, keep it away from magnets'), show: [3.5, 8] },
          { text: V('Kodér musí směřovat ke snímači – jinak svítí ABS/ESP', 'The encoder must face the sensor – otherwise ABS/ESP lights come on'), show: [5.5, 8], level: 'danger' }
        ]
      };
    }
  });

  R('wheel-bearing.remove', {
    duration: 9, camera: { pos: [0.6, 0.45, 0.85], target: [0, 0.3, -0.06], fov: 38 }, shadow: 1.2, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, rig = n3().corner(K, ctx, { wheel: false, caliper: false });
      rig.disc.visible = false;
      var bolts = [];
      for (var i = 0; i < 4; i++) { var a = i / 4 * PI * 2 + PI / 4; var b = K.P.bolt({ r: 0.006, len: 0.04 }); b.rotation.x = -PI / 2; b.position.set(Math.cos(a) * 0.06, 0.32 + Math.sin(a) * 0.06, -0.11); rig.root.add(b); bolts.push(b); }
      var unit = new THREE.Group(); unit.position.set(0, 0.32, 0); rig.root.add(unit);
      var bU = bearing(K, { dirty: true }); bU.position.z = -0.03; unit.add(bU);
      rig.hub.position.set(0, 0, 0); unit.add(rig.hub);
      return {
        root: rig.root,
        update: function (t) {
          bolts.forEach(function (b, i) { var k = T.seg(t, 0.5 + i * 0.6, 1.2 + i * 0.6); b.position.z = -0.11 - k * 0.07; b.children[0].rotation.y = k * 10; });
          var out = T.seg(t, 3.5, 6);
          unit.position.z = out * 0.18; unit.rotation.y = out * 0.3;
        },
        labels: [
          { text: V('šrouby náboje zezadu', 'hub bolts from behind'), at: function () { return n3().wp(bolts[0], [0, 0.04, 0]); }, show: [0.5, 3.5], level: 'accent' },
          { text: V('rez: penetrace, stahovák – ne kladivo na ložisko', 'rust: penetrant, puller – no hammer on the bearing'), at: function () { return n3().wp(unit, [0, 0.12, 0]); }, show: [3.5, 9], level: 'danger' }
        ],
        captions: [
          { text: V('Šroubovaný náboj: šrouby zezadu, jednotku stáhnout stahovákem', 'Bolted hub unit: bolts from behind, pull the unit off with a puller') },
          { text: V('Lisované ložisko: celou těhlici na lis nebo speciální přípravek', 'Pressed bearing: the knuckle goes on a press or a special tool'), show: [4, 9] }
        ]
      };
    }
  });

  R('wheel-bearing.press', {
    duration: 9, camera: { pos: [0.55, 0.45, 0.8], target: [0, 0.2, 0], fov: 38 }, shadow: 0.8, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, G = K.G, root = new THREE.Group();
      var kn = K.mesh(G.lathe([[0.062, 0], [0.11, 0], [0.11, 0.06], [0.062, 0.06]], 48), 'castIron'); kn.position.y = 0.1; root.add(kn);
      var support = K.mesh(G.lathe([[0.065, 0], [0.13, 0], [0.13, 0.1], [0.065, 0.1]], 40), 'steelDark'); root.add(support);
      var b = bearing(K); b.rotation.x = -PI / 2; root.add(b);
      var tool = K.mesh(G.lathe([[0.0, 0], [0.06, 0], [0.06, 0.012], [0.025, 0.012], [0.025, 0.12], [0, 0.12]], 40), 'steel'); root.add(tool);
      var ram = K.mesh(G.cyl(0.03, 0.4, 24), 'chrome'); root.add(ram);
      var wrong = K.mesh(G.lathe([[0.0, 0], [0.034, 0], [0.034, 0.08], [0, 0.08]], 30), 'hiDanger'); root.add(wrong);
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 1, 4.5);
          var y = 0.24 - k * 0.11;
          b.position.y = y; tool.position.y = y + 0.024; ram.position.y = y + 0.024 + 0.12 + 0.2;
          wrong.visible = t > 5.5; wrong.position.set(0, 0.3, 0.15);
        },
        labels: [
          { text: V('tlačit jen na VNĚJŠÍ kroužek', 'press on the OUTER race only'), at: function () { return b.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.07, 0.03, 0)); }, show: [0.5, 5.5], level: 'ok' },
          { text: V('✖ přes vnitřní kroužek = zničené ložisko', '✖ via the inner race = ruined bearing'), at: [0, 0.4, 0.15], show: [5.5, 9], level: 'danger' }
        ],
        captions: [
          { text: V('Lisovat rovně, plynule, správným trnem až na doraz', 'Press straight, smoothly, with the right driver, fully home') },
          { text: V('Pak pojistný kroužek a náboj (tlačit na vnitřní kroužek s podporou)', 'Then the circlip and the hub (press on the inner race, supported)'), show: [4.5, 9] }
        ]
      };
    }
  });

  R('wheel-bearing.torque', {
    duration: 8, camera: { pos: [0.75, 0.55, 1.1], target: [0.05, 0.32, 0.02], fov: 34 }, shadow: 1.6, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, rig = n3().corner(K, ctx, { wheel: false });
      var holder = new THREE.Group(); holder.position.set(0, 0.32, 0.035); rig.root.add(holder);
      var tw = K.P.torqueWrench(0.55); tw.rotation.x = PI / 2; tw.position.z = 0.07; holder.add(tw);
      var arrow = K.FX.rotArrow(0.07, 'cw', 0x30a46c, 120, 0.006); arrow.position.set(0, 0.32, 0.06); rig.root.add(arrow);
      var txt = NUT[ctx.vehicle] || NUT.generic;
      return {
        root: rig.root,
        update: function (t) {
          var k = T.seg(t, 0.8, 2.6), a = T.seg(t, 3.2, 5);
          holder.rotation.z = 1.2 - k * 0.5 - a * 0.8;
          arrow.visible = t > 3 && t < 5.5;
        },
        labels: [{ text: { cs: 'klik! ' + txt.cs, en: 'click! ' + txt.en }, at: [0.1, 0.5, 0.06], show: [2.4, 3.2], level: 'ok' },
          { text: V('+ úhel', '+ angle'), at: [0.1, 0.45, 0.06], show: [3.2, 5.5], level: 'accent' }],
        captions: [
          { text: V('Nová matice, moment (+ úhel) přesně dle příručky', 'New nut, torque (+ angle) exactly per manual'), level: 'accent' },
          { text: V('Finální dotažení často až s vozem na kolech', 'Final tightening often with the car on its wheels'), show: [4, 8] },
          { text: V('Pojistit (zajišťovací plech / důlek), pokud to výrobce předepisuje', 'Lock it (staking / lock plate) if the maker specifies'), show: [5.5, 8] }
        ]
      };
    }
  });

  R('wheel-bearing.test', {
    duration: 7, camera: { pos: [3.4, 1.4, 5.0], target: [0.3, 0.5, 0], fov: 34 }, shadow: 3.5, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group(), c = K.car(ctx.vehicle); root.add(c.group);
      var big = ctx.vehicle === 'citroen-jumper-22hdi';
      return {
        root: root,
        update: function (t) { c.wheels.forEach(function (w) { w.wheel.rotation.z = -t * 6; }); c.group.position.x = Math.sin(t * 0.8) * 0.3; },
        cameraPath: big ? function () { return { pos: [5.4, 2, 7.2], target: [0.3, 0.9, 0], fov: 34 }; } : null,
        labels: [{ text: V('✔ ticho, žádná kontrolka ABS', '✔ quiet, no ABS light'), at: function () { return c.wheels[2].pivot.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.55, 0.2)); }, level: 'ok' }],
        captions: [
          { text: V('Zkušební jízda: hučení zmizelo, ABS/ESP bez kontrolek', 'Test drive: humming gone, no ABS/ESP lights') },
          { text: V('Po 50 km znovu zkontrolovat matici a šrouby kola', 'Re-check the nut and wheel bolts after 50 km'), show: [3, 7] }
        ]
      };
    }
  });
})(window.STU);
