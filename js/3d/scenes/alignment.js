/* 3D scenes: wheel alignment basics (toe / camber / caster, string-line toe check, shop alignment, ADAS).
 * Defines S.n3.alignRig (used by struts-springs.align and suspension-wear.align). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  S.n3 = S.n3 || {};
  function big(ctx) { return ctx.vehicle === 'citroen-jumper-22hdi'; }
  function carCam(ctx, near) {
    if (big(ctx)) return near ? { pos: [4.6, 3.0, 6.0], target: [0, 0.6, 0] } : { pos: [5.6, 3.6, 7.2], target: [0, 0.8, 0] };
    return near ? { pos: [3.4, 2.3, 4.6], target: [0, 0.4, 0] } : { pos: [4.2, 2.8, 5.4], target: [0, 0.5, 0] };
  }

  /** Shop alignment: car on an alignment lift with turntables, clamp heads and laser beams. */
  S.n3.alignRig = function (ctx, K, o) {
    o = o || {};
    var T = K.T, G = K.G, root = new THREE.Group();
    var c = K.car(ctx.vehicle, { contactShadow: false }); root.add(c.group);
    var d = c.dims, lift = 0.08, tz = d.track / 2;
    c.group.position.y = lift;
    [-1, 1].forEach(function (s) {
      var rail = K.mesh(G.rbox(d.L + 0.6, lift - 0.01, 0.42, 0.02), 'steelDark'); rail.position.set(0, (lift - 0.01) / 2, s * tz); root.add(rail);
    });
    var heads = [], beams = [];
    c.wheels.forEach(function (w) {
      var tt = K.mesh(G.cyl(0.25, 0.012, 32), 'alu'); tt.position.set(w.base.x, lift - 0.004, w.base.z); if (w.axle === 'f') root.add(tt);
      var h = new THREE.Group();
      var arm = K.mesh(G.box(0.02, 0.5, 0.02), 'steel'); h.add(arm);
      var arm2 = arm.clone(); arm2.rotation.z = PI / 2; h.add(arm2);
      var cam = K.mesh(G.rbox(0.18, 0.1, 0.08, 0.02), 'toolYellow'); cam.position.set(0, 0, 0.06); h.add(cam);
      var lens = K.mesh(G.cylX(0.022, 0.02, 20), 'blackGloss'); lens.position.set(w.axle === 'f' ? -0.1 : 0.1, 0, 0.06); h.add(lens);
      h.position.set(w.base.x, w.base.y + lift, w.side * (tz + d.W * 0.05 + 0.12));
      if (w.side < 0) h.rotation.y = PI;
      root.add(h); heads.push(h);
    });
    [-1, 1].forEach(function (s) {
      var m = K.M.clone('hiDanger', { transparent: true, opacity: 0.8 });
      var b = K.mesh(G.cylX(0.004, d.wb - 0.25, 8), m); b.userData.noShadow = true;
      b.position.set((d.xf + d.xr) / 2, d.wr + lift, s * (tz + d.W * 0.05 + 0.18)); root.add(b); beams.push(b);
    });
    var screen = K.FX.canvasPanel(0.7, 0.45, function (x, W, H) {
      x.fillStyle = '#0d1a24'; x.fillRect(0, 0, W, H);
      x.fillStyle = '#7fd1ff'; x.font = 'bold 30px sans-serif'; x.fillText(S.t(V('Geometrie', 'Alignment')), 20, 44);
      x.font = '24px sans-serif';
      [['L', '+0°05\'', true], ['R', '+0°22\'', false]].forEach(function (r, i) {
        x.fillStyle = r[2] ? '#30a46c' : '#e5484d'; x.fillRect(20, 80 + i * 70, W - 40, 50);
        x.fillStyle = '#fff'; x.fillText(S.t(V('Sbíhavost ', 'Toe ')) + r[0] + ': ' + r[1], 34, 115 + i * 70);
      });
    });
    var stand = K.mesh(G.box(0.05, 1.2, 0.05), 'steelDark'); stand.position.set(d.front + 0.9, 0.6, d.W / 2 + 0.6); root.add(stand);
    screen.position.set(d.front + 0.9, 1.35, d.W / 2 + 0.62); screen.rotation.y = PI * 0.15; root.add(screen);
    root.add(K.FX.contactShadow(d.L * 1.2, d.W * 1.4, 0.4));
    var cam = carCam(ctx, false);
    return {
      root: root,
      update: function (t) { beams.forEach(function (b) { b.material.opacity = 0.4 + 0.4 * Math.abs(Math.sin(t * 4)); }); },
      cameraPath: function () { return cam; },
      labels: [{ text: V('měřicí hlavy na kolech', 'measuring heads on the wheels'), at: function () { return heads[3].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.15, 0)); }, level: 'accent' }],
      captions: [
        o.caption || { text: V('Profesionální měření geometrie', 'Professional wheel alignment') },
        { text: V('Nastavuje se na vodorovném zvedáku, v jízdní výšce, se správným tlakem pneu', 'Done on a level lift, at ride height, with correct tyre pressures'), show: [2.5, 99] }
      ].map(function (c0) { return c0.text ? c0 : { text: c0 }; })
    };
  };

  /* ------------------------------------------------------------ angles */
  R('alignment.angles', {
    duration: 15, camera: { pos: [0, 2.6, 0.01], target: [0, 0.3, 0], fov: 38 }, shadow: 2, thumbT: 2.5,
    build: function (ctx, K) {
      var T = K.T, G = K.G, root = new THREE.Group();
      var wheels = [-1, 1].map(function (s) {
        var piv = new THREE.Group(); piv.position.set(0, 0.32, s * 0.78); root.add(piv);
        var w = K.P.wheel({ r: 0.32, w: 0.215 }); if (s < 0) w.rotation.y = PI; piv.add(w);
        var dir = K.FX.arrow([0, 0, 0], [0.7, 0, 0], 0xf5a524, 0.012); dir.position.set(0, 0.34, 0); piv.add(dir);
        return piv;
      });
      var axle = K.mesh(G.cylZ(0.02, 1.4, 12), 'steelDark'); axle.position.y = 0.32; root.add(axle);
      var fwd = K.FX.arrow([-0.7, 0.05, 0], [0.9, 0.05, 0], 0x3e8ed0, 0.015); root.add(fwd);
      // caster axis
      var axis = K.mesh(G.cyl(0.008, 1.0, 10), K.M.clone('hiOk')); axis.position.set(0, 0.32, 0.78); root.add(axis);
      return {
        root: root,
        update: function (t) {
          var toe = 0, camber = 0;
          if (t < 5) toe = Math.sin(t * 1.4) * 0.12;
          else if (t < 10) camber = Math.sin((t - 5) * 1.4) * 0.12;
          wheels.forEach(function (w, i) {
            var s = i ? 1 : -1;
            w.rotation.set(0, 0, 0);
            w.rotation.y = -s * toe;
            w.rotation.x = s * camber;
          });
          axis.visible = t >= 10;
          axis.rotation.z = t >= 10 ? -0.12 - 0.06 * Math.sin((t - 10) * 1.4) : 0;
        },
        cameraPath: function (t) {
          if (t < 5) return { pos: [0, 3.5, 0.01], target: [0, 0.3, 0] };
          if (t < 10) return { pos: [2.6, 0.45, 0], target: [0, 0.35, 0] };
          return { pos: [0.01, 0.55, 2.8], target: [0, 0.4, 0.4] };
        },
        labels: [],
        captions: [
          { text: V('SBÍHAVOST (toe): kola při pohledu shora mírně k sobě / od sebe', 'TOE: wheels seen from above point slightly in / out'), show: [0, 5], level: 'accent' },
          { text: V('Špatná sbíhavost = ojíždění hran pneu, auto „táhne“', 'Wrong toe = edge wear on the tyres, car pulls'), show: [2.5, 5] },
          { text: V('ODKLON (camber): naklonění kola zepředu', 'CAMBER: wheel tilt seen from the front'), show: [5, 10], level: 'accent' },
          { text: V('Velký odklon = ojetí vnitřní / vnější hrany', 'Large camber = wear on the inner / outer edge'), show: [7.5, 10] },
          { text: V('ZÁKLON (caster): sklon osy řízení ze strany – vrací volant rovně', 'CASTER: steering axis tilt from the side – returns the wheel to centre'), show: [10, 15], level: 'accent' }
        ]
      };
    }
  });

  R('alignment.symptoms', {
    duration: 10, camera: { pos: [0.55, 0.45, 0.75], target: [0, 0.32, 0], fov: 36 }, shadow: 1.2, thumbT: 2.5,
    build: function (ctx, K) {
      var T = K.T, G = K.G, root = new THREE.Group();
      var w = K.P.wheel({ r: 0.32, w: 0.215 }); w.position.y = 0.32; w.rotation.y = 0.9; root.add(w);
      var worn = K.mesh(G.latheZ([[0.3215, -0.1], [0.3215, -0.045]], 72), K.M.clone('plasticGrey', { color: 0x4a4c50, roughness: 0.5 }));
      w.add(worn);
      for (var i = 0; i < 24; i++) {
        var f = K.mesh(G.box(0.012, 0.004, 0.05), 'rubber');
        var a = i / 24 * PI * 2; f.position.set(Math.cos(a) * 0.322, Math.sin(a) * 0.322, -0.075); f.rotation.z = a; w.add(f);
      }
      return {
        root: root,
        update: function (t) { w.rotation.z = -t * 0.25; },
        labels: [{ text: V('ojetá vnitřní hrana', 'worn inner edge'), at: function () { return w.localToWorld(new THREE.Vector3(0, 0.33, -0.08)); }, level: 'danger' }],
        captions: [
          { text: V('Příznaky: ojetá hrana pneu, auto táhne do strany, křivý volant', 'Symptoms: worn tyre edge, car pulls to one side, steering wheel off-centre') },
          { text: V('Táhne jen při brzdění? To je spíš brzda než geometrie', 'Pulls only when braking? More likely brakes than alignment'), show: [4, 10], level: 'info' },
          { text: V('Nejdřív vyloučit tlak v pneu a vůle v podvozku', 'First rule out tyre pressure and suspension play'), show: [6.5, 10] }
        ]
      };
    }
  });

  R('alignment.shop', {
    duration: 8, camera: { pos: [4.2, 2.8, 5.4], target: [0, 0.5, 0], fov: 36 }, shadow: 3.5, thumbT: 3,
    build: function (ctx, K) {
      return S.n3.alignRig(ctx, K, { caption: { text: V('Dílna je NUTNÁ po: čepech řízení, ramenech, vzpěrách, nehodě', 'A workshop is REQUIRED after: tie-rod ends, arms, struts, an accident'), level: 'danger' } });
    }
  });

  R('alignment.prep', {
    duration: 9, camera: { pos: [3.4, 1.6, 4.6], target: [0, 0.35, 0], fov: 34 }, shadow: 3.5, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, G = K.G, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var fw = c.wheels.filter(function (w) { return w.side > 0 && w.axle === 'f'; })[0];
      var gauge = new THREE.Group();
      var gb = K.mesh(G.cylZ(0.035, 0.025, 24), 'chrome'); gauge.add(gb);
      var face = K.mesh(G.cylZ(0.03, 0.026, 24), 'plasticWhite'); gauge.add(face);
      var hose = K.mesh(G.tube([[0, -0.03, 0], [0, -0.12, 0.05], [0, -0.2, 0]], 0.005), 'rubber'); gauge.add(hose);
      root.add(gauge);
      var level = K.mesh(G.rbox(0.6, 0.04, 0.05, 0.01), 'toolYellow'); level.position.set(c.dims.xf, 0.02, c.dims.W / 2 + 0.5); root.add(level);
      var bubble = K.mesh(G.sphere(0.012, 12), K.M.clone('hiOk')); bubble.position.set(c.dims.xf, 0.045, c.dims.W / 2 + 0.5); root.add(bubble);
      var note = ctx.vehicle === 'volvo-xc60-b4' ? V('XC60: vzduchový podvozek v normální výšce, regulace ZAPNUTÁ při měření (dle VIDA)', 'XC60: air suspension at normal height, level control ON while measuring (per VIDA)')
        : ctx.vehicle === 'mb-cl500-c216' ? V('CL 500: ABC v normální výšce, vůz chvíli „usadit“ (dle WIS)', 'CL 500: ABC at normal level, let the car settle (per WIS)')
          : ctx.vehicle === 'citroen-jumper-22hdi' ? V('Jumper: prázdný nákladový prostor, plná nádrž dle postupu', 'Jumper: empty cargo area, fuel per procedure')
            : V('Plná nádrž / řidič dle postupu výrobce', 'Fuel / driver weight per the maker\'s procedure');
      return {
        root: root,
        update: function (t) {
          gauge.position.copy(fw.pivot.position).add(new THREE.Vector3(0.18, 0.12, 0.16));
          gauge.visible = t < 4.5;
          bubble.position.x = c.dims.xf + Math.sin(t * 2) * 0.01;
        },
        cameraPath: big(ctx) ? function () { return { pos: [5.2, 2.2, 6.6], target: [0, 0.7, 0] }; } : null,
        labels: [
          { text: V('tlak pneu dle štítku', 'tyre pressure per placard'), at: function () { return gauge.position.clone().add(new THREE.Vector3(0, 0.08, 0)); }, show: [0, 4.5], level: 'accent' },
          { text: V('rovná podlaha', 'level floor'), at: function () { return level.position.clone().add(new THREE.Vector3(0, 0.08, 0)); }, show: [4.5, 9], level: 'ok' }
        ],
        captions: [
          { text: V('Rovný povrch, správné tlaky, kola rovně, volant na střed', 'Level surface, correct pressures, wheels straight, steering centred') },
          { text: note, show: [3, 9], level: ctx.vehicle === 'volvo-xc60-b4' || ctx.vehicle === 'mb-cl500-c216' ? 'danger' : null }
        ]
      };
    }
  });

  function stringRig(ctx, K) {
    var G = K.G, root = new THREE.Group();
    var c = K.car(ctx.vehicle); root.add(c.group);
    var d = c.dims, h = d.wr, off = d.W / 2 + 0.18;
    var poles = [], strings = [];
    [-1, 1].forEach(function (s) {
      [d.front + 0.5, d.rear - 0.5].forEach(function (x) {
        var p = new THREE.Group();
        var base = K.mesh(G.cyl(0.12, 0.02, 20), 'concrete'); base.position.y = 0.01; p.add(base);
        var post = K.mesh(G.cyl(0.012, h + 0.1, 12), 'steelDark'); post.position.y = (h + 0.1) / 2; p.add(post);
        p.position.set(x, 0, s * off); root.add(p); poles.push(p);
      });
      var mat = K.M.clone('hiAccent');
      var str = K.mesh(G.cylX(0.003, d.L + 1.0, 6), mat); str.userData.noShadow = true;
      str.position.set((d.front + d.rear) / 2, h, s * off); root.add(str); strings.push(str);
    });
    return { root: root, car: c, d: d, off: off, strings: strings, poles: poles, h: h };
  }

  R('alignment.strings', {
    duration: 8, camera: { pos: [3.4, 2.4, 4.6], target: [0, 0.3, 0], fov: 36 }, shadow: 3.5, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, sr = stringRig(ctx, K), cam = carCam(ctx, true);
      return {
        root: sr.root,
        update: function (t) {
          var k = T.seg(t, 0.5, 3.5);
          sr.strings.forEach(function (s) { s.scale.x = Math.max(0.001, k); });
        },
        cameraPath: function () { return cam; },
        labels: [{ text: V('provázek ve výšce středu kola', 'string at hub-centre height'), at: function () { return sr.strings[1].position.clone().add(new THREE.Vector3(0, 0.05, 0)); }, show: [3.5, 8], level: 'accent' }],
        captions: [
          { text: V('Napnout provázky po obou stranách, rovnoběžně s vozem', 'Run strings along both sides, parallel to the car') },
          { text: V('Stejná vzdálenost od středů nábojů vpředu i vzadu (střed vozu)', 'Same distance to the hub centres front and rear (car centred)'), show: [3.5, 8] }
        ]
      };
    }
  });

  R('alignment.measure', {
    duration: 9, camera: { pos: [0.7, 0.7, 1.4], target: [0, 0.32, 0.05], fov: 34 }, shadow: 1.5, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, G = K.G, sr = stringRig(ctx, K);
      var fw = sr.car.wheels.filter(function (w) { return w.side > 0 && w.axle === 'f'; })[0];
      var c0 = fw.pivot.position.clone();
      var rimR = sr.d.wr * 0.7 - 0.01;
      var tape = new THREE.Group();
      var blade = K.mesh(G.box(0.012, 0.002, 1), 'toolYellow'); tape.add(blade);
      var body = K.mesh(G.rbox(0.06, 0.06, 0.03, 0.01), 'toolYellow'); tape.add(body);
      sr.root.add(tape);
      var A = c0.clone().add(new THREE.Vector3(rimR, 0, 0.1)), B = c0.clone().add(new THREE.Vector3(-rimR, 0, 0.1));
      return {
        root: sr.root,
        update: function (t) {
          var p = t < 4.5 ? A : B;
          var len = sr.off - p.z;
          blade.scale.z = len; blade.position.set(0, 0, len / 2);
          body.position.set(0, 0, len);
          tape.position.copy(p);
        },
        cameraPath: function () { return { pos: c0.clone().add(new THREE.Vector3(0.35, 0.55, 1.2)), target: c0.clone().add(new THREE.Vector3(0, -0.05, 0.25)) }; },
        labels: [
          { text: V('A (přední hrana ráfku)', 'A (front rim edge)'), at: function () { return A.clone().add(new THREE.Vector3(0, 0.05, 0)); }, show: [0.5, 9], level: 'accent' },
          { text: V('B (zadní hrana ráfku)', 'B (rear rim edge)'), at: function () { return B.clone().add(new THREE.Vector3(0, 0.05, 0)); }, show: [4.5, 9], level: 'accent' }
        ],
        captions: [
          { text: V('Změřit od provázku k přední (A) a zadní (B) hraně ráfku ve výšce středu', 'Measure from the string to the front (A) and rear (B) rim edge at hub height') },
          { text: V('Měřit na ráfku, ne na pneu (boule bočnice zkreslí)', 'Measure on the rim, not the tyre (sidewall bulge distorts)'), show: [4.5, 9] }
        ]
      };
    }
  });

  R('alignment.calc', {
    duration: 8, camera: { pos: [0, 0.75, 1.5], target: [0, 0.6, 0], fov: 36 }, shadow: 1, ground: true, thumbT: 4,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var board = K.FX.canvasPanel(1.2, 0.75, function (x, W, H, st) {
        x.fillStyle = '#f4f1e8'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#1b1f27'; x.font = 'bold 34px sans-serif';
        x.fillText(S.t(V('Sbíhavost jednoho kola', 'Toe of one wheel')), 30, 54);
        x.font = '30px sans-serif';
        x.fillText('A = 152 mm   B = 154 mm', 30, 120);
        x.fillText(S.t(V('B − A = +2 mm  → sbíhavost (toe-in)', 'B − A = +2 mm  → toe-in')), 30, 175);
        x.fillText(S.t(V('A > B → rozbíhavost (toe-out)', 'A > B → toe-out')), 30, 230);
        if (st) {
          x.fillStyle = '#c9282d'; x.font = 'bold 28px sans-serif';
          x.fillText(S.t(V('Porovnejte s tabulkou výrobce (ověřit)', 'Compare with the maker\'s table (verify)')), 30, 300);
        }
        // top view diagram
        x.strokeStyle = '#1b1f27'; x.lineWidth = 4;
        x.save(); x.translate(W - 170, 230); x.rotate(-0.12); x.strokeRect(-25, -70, 50, 140); x.restore();
        x.save(); x.translate(W - 70, 230); x.rotate(0.12); x.strokeRect(-25, -70, 50, 140); x.restore();
      }, { px: 900 });
      board.position.set(0, 0.62, 0); root.add(board);
      var easel = K.mesh(K.G.box(1.3, 0.04, 0.04), 'wood'); easel.position.set(0, 0.22, 0); root.add(easel);
      [-0.55, 0.55].forEach(function (x) { var l = K.mesh(K.G.box(0.04, 1.1, 0.04), 'wood'); l.position.set(x, 0.55, -0.03); root.add(l); });
      return {
        root: root,
        update: function (t) { board.userData.redraw(t > 3.5); },
        captions: [
          { text: V('Výsledek porovnat s tabulkou – malé hodnoty, typicky desetiny mm až pár mm', 'Compare with the spec – small values, typically fractions of a mm to a few mm'), level: 'accent' },
          { text: V('Domácí měření je jen orientační kontrola', 'Home measurement is only a rough check'), show: [4, 8], level: 'info' }
        ]
      };
    }
  });

  R('alignment.adjust', {
    duration: 10, camera: { pos: [0.35, 0.6, 0.55], target: [-0.15, 0.3, -0.22], fov: 40 }, shadow: 1.4, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, rig = S.n3.corner(K, ctx, { wheel: false });
      var sp = new THREE.Group(); var spanner = K.P.spanner(0.16, 0.016); spanner.rotation.x = PI / 2; spanner.rotation.z = PI / 2; sp.add(spanner); rig.root.add(sp);
      var arrow = K.FX.rotArrow(0.04, 'cw', 0x30a46c, 200, 0.004); arrow.position.copy(rig.tieRod.position); arrow.position.z -= 0.05; rig.root.add(arrow);
      var lock0 = rig.lock.position.clone();
      return {
        root: rig.root,
        update: function (t) {
          rig.lock.position.copy(lock0).add(new THREE.Vector3(0, 0, -T.seg(t, 0.5, 1.6) * 0.015 + T.seg(t, 7, 8) * 0.015));
          var turn = T.seg(t, 2, 6);
          rig.tieRod.rotation.z = turn * PI;
          sp.position.copy(rig.tieRod.position).add(new THREE.Vector3(0, 0, -0.06));
          sp.rotation.z = turn * PI;
          sp.visible = t > 1.8 && t < 6.5;
          arrow.visible = sp.visible;
        },
        labels: [
          { text: V('kontramatice povolit', 'loosen the lock nut'), at: function () { return n3w(rig.lock, [0, 0.04, 0]); }, show: [0, 2], level: 'accent' },
          { text: V('otáčet tyčí řízení po malých krocích', 'turn the tie rod in small steps'), at: function () { return n3w(rig.tieRod, [0, 0.05, 0]); }, show: [2, 6.5], level: 'accent' },
          { text: V('kontramatice dotáhnout, manžeta nezkroucená', 'tighten the lock nut, boot not twisted'), at: function () { return n3w(rig.lock, [0, 0.04, 0]); }, show: [7, 10], level: 'ok' }
        ],
        captions: [
          { text: V('Seřízení sbíhavosti = otáčení tyčí řízení (stejně vlevo i vpravo)', 'Toe adjustment = turning the tie rods (equally left and right)') },
          { text: V('Jen pro dojetí do dílny – přesné seřízení patří na měřicí stav', 'Only to get to a workshop – precise setting needs an alignment rig'), show: [4, 10], level: 'danger' }
        ]
      };
    }
  });
  function n3w(o, off) { return S.n3.wp(o, off); }

  R('alignment.test', {
    duration: 8, camera: { pos: [0.01, 6, 3], target: [0, 0, 0], fov: 40 }, shadow: 4, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var road = K.mesh(K.G.box(40, 0.002, 4), 'plasticTex'); road.position.y = 0.001; root.add(road);
      var lane = []; for (var i = 0; i < 12; i++) { var m = K.mesh(K.G.box(1, 0.003, 0.1), 'plasticWhite'); m.position.set(-18 + i * 3.5, 0.003, 0); root.add(m); lane.push(m); }
      c.group.position.z = -1;
      return {
        root: root,
        update: function (t) {
          lane.forEach(function (m, i) { m.position.x = ((-18 + i * 3.5 - t * 8) % 42 + 42) % 42 - 21; });
          c.wheels.forEach(function (w) { w.wheel.rotation.z = -t * 20; });
          c.group.position.z = -1 + (t > 4 ? 0 : Math.sin(t) * 0.0);
        },
        cameraPath: function () { return big(ctx) ? { pos: [0.01, 9, 4.5], target: [0, 0, -1] } : { pos: [0.01, 6.5, 3.2], target: [0, 0, -1] }; },
        labels: [{ text: V('✔ jede rovně, volant rovně', '✔ drives straight, wheel centred'), at: function () { return c.group.position.clone().add(new THREE.Vector3(0, c.dims.H + 0.3, 0)); }, level: 'ok' }],
        captions: [
          { text: V('Zkušební jízda na rovné silnici: vůz netáhne, volant je rovně', 'Test drive on a flat road: no pull, steering wheel centred') },
          { text: V('Po 2–3 týdnech zkontrolovat pneumatiky (nerovnoměrné ojetí)', 'Check the tyres after 2–3 weeks (uneven wear)'), show: [4, 8] }
        ]
      };
    }
  });

  R('alignment.adas', {
    duration: 8, camera: { pos: [-1.2, 2.2, 4.6], target: [2.4, 0.7, 0], fov: 40 }, shadow: 4, thumbT: 4,
    build: function (ctx, K) {
      var root = new THREE.Group(), c = K.car(ctx.vehicle); root.add(c.group);
      var board = K.FX.canvasPanel(1.2, 0.8, function (x, W, H) {
        x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
        var n = 8, s = W / n;
        for (var i = 0; i < n; i++) for (var j = 0; j < Math.ceil(H / s); j++) if ((i + j) % 2) { x.fillStyle = '#111'; x.fillRect(i * s, j * s, s, s); }
      }, { px: 512 });
      board.position.set(c.dims.front + 2.2, 1.2, 0); board.rotation.y = -PI / 2; root.add(board);
      var frame = K.mesh(K.G.box(0.06, 1.6, 0.06), 'steelDark'); frame.position.set(c.dims.front + 2.25, 0.8, 0); root.add(frame);
      var refl = K.mesh(K.G.rbox(0.05, 0.4, 0.4, 0.02), 'chrome'); refl.position.set(c.dims.front + 1.2, 0.5, 0); root.add(refl);
      return {
        root: root,
        update: function (t) { refl.rotation.y = Math.sin(t) * 0.05; },
        labels: [
          { text: V('kalibrační terč kamery', 'camera calibration target'), at: [c.dims.front + 2.2, 1.7, 0], level: 'accent' },
          { text: V('reflektor radaru', 'radar reflector'), at: [c.dims.front + 1.2, 0.8, 0] }
        ],
        captions: [
          { text: V('XC60: po geometrii kalibrace kamery a radaru (VIDA)', 'XC60: camera and radar calibration after alignment (VIDA)'), level: 'danger' },
          { text: V('Bez kalibrace nemusí správně fungovat asistent jízdy v pruhu a nouzové brzdění', 'Without calibration lane assist and emergency braking may not work correctly'), show: [3, 8] }
        ]
      };
    }
  });
})(window.STU);
