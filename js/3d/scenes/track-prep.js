/* 3D scenes: GR Yaris track-day preparation and post-track checks. Always shows the GR Yaris. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var CAR = 'toyota-gr-yaris';

  /** Pit lane: asphalt, lane lines, kerb, cones, pit wall. */
  function pitLane(K) {
    var g = new THREE.Group();
    var asphalt = K.mesh(K.G.box(14, 0.01, 9), K.M.clone('concrete', { color: 0x3a3d42, roughness: 0.95 })); asphalt.position.y = -0.004; asphalt.receiveShadow = true; g.add(asphalt);
    [-2.2, 2.2].forEach(function (z) { var l = K.mesh(K.G.box(14, 0.004, 0.1), 'plasticWhite'); l.position.set(0, 0.003, z); g.add(l); });
    for (var i = 0; i < 14; i++) { var k = K.mesh(K.G.box(1, 0.04, 0.3), i % 2 ? 'plasticWhite' : 'toolRed'); k.position.set(-7 + i + 0.5, 0.02, -3.2); g.add(k); }
    var wall = K.mesh(K.G.box(14, 0.9, 0.25), 'concrete'); wall.position.set(0, 0.45, 3.4); g.add(wall);
    [-3, 3.2].forEach(function (x) {
      var cone = K.mesh(new THREE.ConeGeometry(0.12, 0.38, 20), K.M.clone('toolRed', { color: 0xff6a00 })); cone.position.set(x, 0.19, 2.6); g.add(cone);
      var band = K.mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.06, 20), 'plasticWhite'); band.position.set(x, 0.24, 2.6); g.add(band);
    });
    return g;
  }

  function carOn(K, root) {
    var c = K.car(CAR); root.add(c.group);
    return c;
  }
  function frontLeft(c) { return c.wheels.filter(function (w) { return w.side > 0 && w.axle === 'f'; })[0]; }

  /** Checklist board with ticks driven by a number of done items. */
  function checklist(K, ctx, items, w, h) {
    var p = K.FX.canvasPanel(w || 0.9, h || 0.62, function (c, W, H, done) {
      c.fillStyle = '#10161f'; c.fillRect(0, 0, W, H);
      c.fillStyle = '#f5a524'; c.font = 'bold ' + Math.round(H * 0.08) + 'px sans-serif';
      c.fillText(ctx.t(V('Před tratí', 'Before the track')), W * 0.05, H * 0.11);
      c.font = Math.round(H * 0.062) + 'px sans-serif';
      items.forEach(function (it, i) {
        var y = H * (0.22 + i * 0.095);
        var ok = i < (done || 0);
        c.fillStyle = ok ? '#30a46c' : '#55606f'; c.fillRect(W * 0.05, y - H * 0.05, H * 0.06, H * 0.06);
        if (ok) { c.strokeStyle = '#fff'; c.lineWidth = 5; c.beginPath(); c.moveTo(W * 0.058, y - H * 0.02); c.lineTo(W * 0.072, y - H * 0.002); c.lineTo(W * 0.095, y - H * 0.045); c.stroke(); }
        c.fillStyle = ok ? '#e9edf3' : '#9aa5b8'; c.fillText(ctx.t(it), W * 0.14, y);
      });
    }, { px: 640, state: 0 });
    return p;
  }

  R('track-prep.overview', {
    duration: 10, camera: { pos: [4.6, 1.9, 4.4], target: [0.2, 0.6, 0.3], fov: 38 }, shadow: 3.5, thumbT: 7,
    build: function (ctx, K) {
      var root = new THREE.Group();
      root.add(pitLane(K));
      var c = carOn(K, root);
      var items = [V('Brzdová kapalina (high-temp)', 'Brake fluid (high-temp)'), V('Destičky a kotouče', 'Pads and discs'), V('Hladina oleje', 'Oil level'),
        V('Tlaky v pneumatikách', 'Tyre pressures'), V('Momenty matic kol', 'Wheel nut torque'), V('Prázdný interiér, tažné oko', 'Empty interior, tow eye'), V('Helma, oblečení, záznam', 'Helmet, clothing, logging')];
      var board = checklist(K, ctx, items, 1.1, 0.8); board.position.set(-0.6, 1.25, 2.4); board.rotation.y = 0.35; root.add(board);
      var post = K.mesh(K.G.cyl(0.02, 0.9, 12), 'steelDark'); post.position.set(-0.6, 0.45, 2.38); root.add(post);
      return {
        root: root,
        update: function (t) { board.userData.redraw(Math.min(items.length, Math.floor(t / 1.2))); },
        captions: [
          { text: V('Trať = extrémní zátěž: brzdy, olej, pneumatiky. Připravte vůz den předem.', 'Track = extreme load: brakes, oil, tyres. Prepare the car the day before.') },
          { text: V('Řiďte se pravidly pořadatele (helma, technická přejímka)', 'Follow the organiser\'s rules (helmet, scrutineering)'), level: 'info', show: [4, 10] }
        ]
      };
    }
  });

  R('track-prep.fluid', {
    duration: 9, camera: { pos: [0.7, 0.62, 1.05], target: [0.0, 0.3, 0], fov: 36 }, shadow: 1, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var res = K.mesh(K.G.lathe([[0, 0], [0.05, 0], [0.055, 0.01], [0.055, 0.12], [0.03, 0.14], [0.03, 0.16], [0, 0.16]], 32), K.M.clone('glassClear', { opacity: 0.35 }));
      res.position.set(0, 0.2, 0); root.add(res);
      var fluid = K.mesh(K.G.cyl(0.052, 0.09, 32), 'brakeFluid'); fluid.position.set(0, 0.25, 0); root.add(fluid);
      var cap = K.mesh(K.G.cyl(0.034, 0.025, 24), 'toolYellow'); cap.position.set(0, 0.375, 0); root.add(cap);
      var stand = K.mesh(K.G.box(0.3, 0.2, 0.2), 'castIron'); stand.position.set(0, 0.1, 0); root.add(stand);
      var bottle = new THREE.Group();
      var bb = K.mesh(K.G.lathe([[0, 0], [0.04, 0], [0.042, 0.02], [0.042, 0.16], [0.015, 0.2], [0.015, 0.23], [0, 0.23]], 24), 'plasticWhite'); bottle.add(bb);
      var lbl = K.FX.canvasPanel(0.07, 0.08, function (c, W, H) { c.fillStyle = '#c4191c'; c.fillRect(0, 0, W, H); c.fillStyle = '#fff'; c.font = 'bold ' + Math.round(H * 0.2) + 'px sans-serif'; c.textAlign = 'center'; c.fillText('RACING', W / 2, H * 0.4); c.font = Math.round(H * 0.15) + 'px sans-serif'; c.fillText('DOT 4', W / 2, H * 0.7); }, { px: 256 });
      lbl.position.set(0, 0.09, 0.043); bottle.add(lbl);
      bottle.position.set(0.22, 0, 0.05); root.add(bottle);
      var chart = K.FX.canvasPanel(0.36, 0.22, function (c, W, H) {
        c.fillStyle = '#10161f'; c.fillRect(0, 0, W, H);
        c.fillStyle = '#e9edf3'; c.font = 'bold ' + Math.round(H * 0.1) + 'px sans-serif'; c.fillText(ctx.t(V('Bod varu (suchý, typicky)', 'Boiling point (dry, typical)')), W * 0.05, H * 0.15);
        [['DOT 4', 230, '#9aa5b8'], ['Racing', 310, '#30a46c']].forEach(function (r, i) {
          var y = H * (0.35 + i * 0.3);
          c.fillStyle = r[2]; c.fillRect(W * 0.3, y, W * 0.6 * r[1] / 330, H * 0.18);
          c.fillStyle = '#e9edf3'; c.font = Math.round(H * 0.1) + 'px sans-serif'; c.fillText(r[0], W * 0.04, y + H * 0.13); c.fillText('~' + r[1] + ' °C', W * 0.32, y + H * 0.13);
        });
      }, { px: 512 });
      chart.position.set(-0.28, 0.42, -0.05); chart.rotation.y = 0.3; root.add(chart);
      return {
        root: root,
        update: function (t) {
          var lift = T.seg(t, 2, 3) * (1 - T.seg(t, 7, 8));
          bottle.position.set(0.22 - lift * 0.17, lift * 0.25, 0.05); bottle.rotation.z = lift * 1.7;
          cap.visible = t < 1.8 || t > 8;
        },
        labels: [{ text: V('Odvzdušnit celý systém (viz Odvzdušnění brzd)', 'Bleed the whole system (see Brake bleeding)'), at: [0, 0.45, 0], show: [3, 9], level: 'accent' }],
        captions: [
          { text: V('Vyměnit za kapalinu s vysokým bodem varu – stará kapalina = měkký pedál na trati', 'Replace with high boiling-point fluid – old fluid = soft pedal on track') },
          { text: V('Hodnoty jsou typické – řiďte se výrobcem kapaliny a Toyota (ověřit)', 'Values are typical – follow the fluid maker and Toyota (verify)'), level: 'info', show: [4, 9] }
        ]
      };
    }
  });

  R('track-prep.pads', {
    duration: 8, camera: { pos: [0.55, 0.55, 0.7], target: [0, 0.32, 0], fov: 33 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var corner = new THREE.Group(); corner.position.set(0, 0.34, 0); root.add(corner);
      var hub = K.P.hub(); corner.add(hub);
      var disc = K.P.brakeDisc({ r: 0.178, t: 0.032, drilled: false }); disc.position.z = 0.0; corner.add(disc);
      var cal = K.P.caliperFixed({ discR: 0.178, t: 0.032, angle: PI * 0.85 }); corner.add(cal);
      var pad = cal.userData.padOut;
      var gauge = new THREE.Group(); var gb = K.mesh(K.G.box(0.06, 0.012, 0.003), 'steel'); gauge.add(gb);
      var gt = K.mesh(K.G.box(0.003, 0.02, 0.003), 'steel'); gt.position.set(-0.03, -0.012, 0); gauge.add(gt); root.add(gauge);
      var discGlow = K.FX.glow(disc.userData.rotor, 0xff7a20);
      return {
        root: root,
        update: function (t) {
          var out = T.seg(t, 1, 2.5);
          pad.position.z = 0.0165 + out * 0.05;
          var a = PI * 0.85; pad.position.x = Math.cos(a) * out * 0.03; pad.position.y = Math.sin(a) * out * 0.03 + out * 0.08;
          gauge.visible = t > 2.6 && t < 6;
          gauge.position.set(Math.cos(a) * 0.15, 0.34 + Math.sin(a) * 0.15 + 0.11, 0.07);
          discGlow(t > 6 ? 0.5 * Math.abs(Math.sin(t * 2)) : 0);
        },
        labels: [
          { text: V('Tloušťka destiček: na trať s rezervou (ověřit min.)', 'Pad thickness: go to the track with margin (verify min.)'), at: [-0.15, 0.6, 0.05], show: [2.6, 6], level: 'accent' },
          { text: V('Praskliny kotouče = výměna', 'Cracked disc = replace'), at: [0.15, 0.34, 0.06], show: [6, 8], level: 'danger' }
        ],
        captions: [
          { text: V('Zkontrolujte destičky, kotouče (trhliny, otřep) a hadičky', 'Check pads, discs (cracks, lip) and hoses') },
          { text: V('Okruhové destičky dle doporučení výrobce – nové zabrzdit!', 'Track pads per maker recommendation – bed in new pads!'), level: 'info', show: [3, 8] }
        ]
      };
    }
  });

  R('track-prep.oil', {
    duration: 7, camera: { pos: [0.3, 0.5, 0.55], target: [0, 0.35, 0], fov: 34 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var eng = K.P.engine({ cyl: 3, filter: 'spin' }); eng.scale.setScalar(0.6); eng.position.set(-0.15, 0, -0.35); root.add(eng);
      var stick = new THREE.Group();
      var blade = K.mesh(K.G.box(0.008, 0.3, 0.002), 'steel'); blade.position.y = 0.15; stick.add(blade);
      var loop = K.mesh(K.G.torus(0.02, 0.005, PI * 2, 24), 'toolYellow'); loop.position.y = 0.32; stick.add(loop);
      [0.04, 0.08].forEach(function (y) { var m = K.mesh(K.G.box(0.012, 0.002, 0.004), 'plasticBlack'); m.position.y = y; stick.add(m); });
      var hatch = K.mesh(K.G.box(0.009, 0.04, 0.0025), 'steelDark'); hatch.position.y = 0.06; stick.add(hatch);
      var film = K.mesh(K.G.box(0.0085, 1, 0.0026), 'oil'); stick.add(film);
      stick.position.set(0.08, 0.2, 0.05); root.add(stick);
      return {
        root: root,
        update: function (t) {
          var lvl = 0.07 * T.seg(t, 1, 2.5);
          film.scale.y = Math.max(0.001, lvl); film.position.y = lvl / 2;
          stick.rotation.z = -0.15;
        },
        labels: [
          { text: 'MAX', at: [0.085, 0.29, 0.06], level: 'ok' }, { text: 'MIN', at: [0.075, 0.245, 0.06], level: 'danger' },
          { text: V('Na trať: u horní značky, ne nad', 'For the track: at the upper mark, not above'), at: [0.15, 0.35, 0.05], show: [2.5, 7], level: 'accent' }
        ],
        captions: [
          { text: V('V zatáčkách olej přelévá – málo oleje = hladovění ložisek', 'Oil sloshes in corners – too little oil = bearing starvation') },
          { text: V('Moc oleje = pěnění, únik přes odvětrání. Měřit na rovině, teplý motor', 'Too much oil = foaming, loss via breather. Measure on level ground, warm engine'), level: 'warning', show: [3, 7] }
        ]
      };
    }
  });

  function tyreScene(ctx, K, torque) {
    var root = new THREE.Group(); root.add(pitLane(K));
    var c = carOn(K, root);
    var fl = frontLeft(c);
    root.updateMatrixWorld(true);
    var centre = fl.pivot.getWorldPosition(new THREE.Vector3());
    return { root: root, car: c, fl: fl, centre: centre };
  }

  R('track-prep.tyres', {
    duration: 9, camera: { pos: [2.0, 0.7, 2.2], target: [1.3, 0.3, 0.8], fov: 32 }, shadow: 2.5, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, w = tyreScene(ctx, K), root = w.root;
      var gauge = new THREE.Group();
      var dial = K.mesh(K.G.cylZ(0.04, 0.02, 32), 'chrome'); gauge.add(dial);
      var face = K.FX.canvasPanel(0.07, 0.07, function (c, W, H, st) {
        c.fillStyle = '#f4f4f4'; c.beginPath(); c.arc(W / 2, H / 2, W / 2, 0, PI * 2); c.fill();
        c.fillStyle = '#111'; c.font = 'bold ' + Math.round(H * 0.22) + 'px sans-serif'; c.textAlign = 'center'; c.fillText((st || 2.3).toFixed(1), W / 2, H * 0.58);
        c.font = Math.round(H * 0.12) + 'px sans-serif'; c.fillText('bar', W / 2, H * 0.75);
      }, { px: 256, transparent: true, state: 2.3 });
      face.position.z = 0.011; gauge.add(face);
      var hose = K.mesh(K.G.tube([[0, -0.04, 0], [0, -0.1, 0.02], [-0.03, -0.14, 0.03]], 0.004), 'rubber'); gauge.add(hose);
      root.add(gauge);
      var panel = K.FX.canvasPanel(0.6, 0.3, function (c, W, H, hot) {
        c.fillStyle = '#10161f'; c.fillRect(0, 0, W, H);
        c.fillStyle = '#e9edf3'; c.font = 'bold ' + Math.round(H * 0.13) + 'px sans-serif';
        c.fillText(ctx.t(V('Studené: start dle tabulky', 'Cold: start per placard')), W * 0.05, H * 0.3);
        c.fillStyle = hot ? '#f5a524' : '#55606f';
        c.fillText(ctx.t(V('Teplé: tlak roste o ~0,3–0,5 bar', 'Hot: pressure rises ~0.3–0.5 bar')), W * 0.05, H * 0.6);
        c.fillStyle = '#9aa5b8'; c.font = Math.round(H * 0.1) + 'px sans-serif';
        c.fillText(ctx.t(V('cílové hodnoty dle Toyota / výrobce pneu (ověřit)', 'targets per Toyota / tyre maker (verify)')), W * 0.05, H * 0.85);
      }, { px: 640, state: false });
      panel.position.set(w.centre.x - 0.2, 1.05, w.centre.z + 0.2); panel.rotation.y = 0.5; root.add(panel);
      return {
        root: root,
        update: function (t) {
          var on = T.seg(t, 0.6, 1.6);
          gauge.position.set(w.centre.x + 0.13, w.centre.y - 0.12 + (1 - on) * 0.2, w.centre.z + 0.17 + (1 - on) * 0.15);
          gauge.rotation.y = 0.4;
          var p = t < 4.5 ? 2.3 : 2.3 + 0.4 * T.seg(t, 4.5, 6);
          face.userData.redraw(Math.round(p * 10) / 10);
          panel.userData.redraw(t > 4.5);
        },
        labels: [{ text: V('Měřit hned po sjetí z trati', 'Measure right after coming off track'), at: function () { return gauge.position.clone().add(new THREE.Vector3(0, 0.08, 0)); }, show: [4.5, 9], level: 'accent' }],
        captions: [
          { text: V('Teplé pneumatiky NEupouštět pod výrobcem dané minimum', 'Never bleed hot tyres below the maker\'s minimum') },
          { text: V('Zkontrolovat i opotřebení ramene a dezén', 'Also check shoulder wear and tread'), level: 'info', show: [6, 9] }
        ]
      };
    }
  });

  R('track-prep.torque', {
    duration: 11, camera: { pos: [1.7, 0.7, 2.3], target: [1.3, 0.34, 0.6], fov: 30 }, shadow: 2.5, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, w = tyreScene(ctx, K), root = w.root;
      var bolts = w.fl.wheel.userData.bolts, order = [0, 2, 4, 1, 3];
      var tw = K.P.torqueWrench(0.48); tw.rotation.x = PI / 2; tw.position.z = 0.06;
      var holder = new THREE.Group(); holder.add(tw); w.fl.wheel.add(holder);
      return {
        root: root,
        update: function (t) {
          var i = Math.min(4, Math.floor(Math.max(0, t - 0.3) / 2));
          holder.position.copy(bolts[order[i]].position);
          holder.rotation.z = -0.3 - T.seg((t - 0.3) % 2, 0.4, 1.2) * 0.5;
        },
        cameraPath: function () { return { pos: w.centre.clone().add(new THREE.Vector3(0.4, 0.3, 1.45)), target: w.centre.clone().add(new THREE.Vector3(0.05, 0.03, 0)) }; },
        labels: order.map(function (bi, i) {
          return { text: String(i + 1), at: function () { return bolts[bi].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.045, 0.03)); }, show: [0.3 + i * 2, 11], level: 'accent' };
        }),
        captions: [
          { text: V('Moment: 103 Nm (ověřit) – před tratí a po prvním výjezdu', 'Torque: 103 Nm (verify) – before the track and after the first session'), level: 'accent' },
          { text: V('Dotahovat studené kolo, do kříže', 'Torque a cold wheel, star pattern') }
        ]
      };
    }
  });

  R('track-prep.interior', {
    duration: 9, camera: { pos: [-4.0, 1.6, 3.2], target: [-0.5, 0.6, 0], fov: 38 }, shadow: 3.2, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(); root.add(pitLane(K));
      var c = carOn(K, root), d = c.dims;
      var crate = K.mesh(K.G.box(0.5, 0.25, 0.4), K.M.clone('plasticGrey', { color: 0x2f6b9a })); crate.position.set(d.rear - 0.9, 0.125, 1.5); root.add(crate);
      var items = [];
      for (var i = 0; i < 5; i++) {
        var it = K.mesh(i % 2 ? K.G.cyl(0.035, 0.18, 12) : K.G.box(0.15, 0.08, 0.1), i % 2 ? 'plasticWhite' : 'toolYellow');
        root.add(it); items.push(it);
      }
      var eye = new THREE.Group();
      var ring = K.mesh(K.G.torus(0.035, 0.008, PI * 2, 24), 'chrome'); eye.add(ring);
      var shank = K.mesh(K.G.cylX(0.008, 0.08, 12), 'chrome'); shank.position.x = -0.07; eye.add(shank);
      root.add(eye);
      return {
        root: root,
        update: function (t) {
          items.forEach(function (it, i) {
            var k = T.seg(t, 0.5 + i * 0.6, 1.3 + i * 0.6);
            var from = new THREE.Vector3(d.rear + 0.4 + i * 0.08, 0.7, -0.3 + i * 0.15), to = new THREE.Vector3(d.rear - 0.9 + (i - 2) * 0.08, 0.3, 1.5);
            it.position.copy(from.clone().lerp(to, k)); it.position.y += Math.sin(k * PI) * 0.6;
            it.rotation.set(k * 3, k * 2, 0);
          });
          var e = T.seg(t, 5, 7);
          eye.position.set(d.front + 0.2 - e * 0.12, d.clr + 0.22, 0.3);
          eye.rotation.x = e * PI * 6;
        },
        labels: [
          { text: V('Vše volné ven (i rohož, lékárnička zajistit)', 'Everything loose out (mats too, secure first-aid kit)'), at: [d.rear - 0.9, 0.5, 1.5], show: [0.5, 4.5] },
          { text: V('Tažné oko zašroubovat', 'Screw in the tow eye'), at: [d.front + 0.1, d.clr + 0.35, 0.3], show: [5, 9], level: 'accent' }
        ],
        captions: [{ text: V('Volné předměty se při brzdění stávají projektily', 'Loose items become projectiles under braking') }]
      };
    }
  });

  R('track-prep.logging', {
    duration: 8, camera: { pos: [0.45, 0.62, 0.7], target: [0, 0.44, -0.12], fov: 36 }, shadow: 1, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var dash = K.mesh(K.G.rbox(0.8, 0.12, 0.3, 0.03), 'plasticTex'); dash.position.set(0, 0.4, -0.25); root.add(dash);
      var port = K.mesh(K.G.box(0.05, 0.02, 0.03), 'plasticBlack'); port.position.set(-0.2, 0.33, -0.12); root.add(port);
      var dongle = K.mesh(K.G.rbox(0.05, 0.03, 0.04, 0.008), 'toolBlue'); root.add(dongle);
      var led = K.mesh(K.G.sphere(0.004, 8), 'hiOk'); root.add(led);
      var phone = new THREE.Group();
      var pb = K.mesh(K.G.rbox(0.08, 0.16, 0.009, 0.01), 'blackGloss'); phone.add(pb);
      var scr = K.FX.canvasPanel(0.072, 0.15, function (c, W, H, n) {
        c.fillStyle = '#0d1a24'; c.fillRect(0, 0, W, H);
        c.fillStyle = '#7cd0ff'; c.font = 'bold ' + Math.round(W * 0.09) + 'px sans-serif';
        c.fillText(ctx.t(V('Kolo', 'Lap')) + ' ' + (n || 1), W * 0.08, H * 0.08);
        c.fillStyle = '#e9edf3'; c.font = 'bold ' + Math.round(W * 0.16) + 'px monospace'; c.fillText('2:0' + (7 - Math.min(n || 1, 4)) + '.4', W * 0.08, H * 0.2);
        [['Oil', '#f5a524', 0.42], ['ECT', '#4fb3e8', 0.62], ['Brake', '#e5484d', 0.82]].forEach(function (r) {
          c.strokeStyle = r[1]; c.lineWidth = 4; c.beginPath();
          for (var i = 0; i <= 20; i++) { var x = W * (0.08 + i * 0.042), y = H * r[2] - Math.sin(i * 0.6 + (n || 1)) * H * 0.04 - i * H * 0.002 * (n || 1); if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); }
          c.stroke(); c.fillStyle = r[1]; c.font = Math.round(W * 0.08) + 'px sans-serif'; c.fillText(r[0], W * 0.08, H * r[2] - H * 0.06);
        });
      }, { px: 360, state: 1 });
      scr.position.z = 0.0051; phone.add(scr);
      phone.position.set(0.12, 0.52, -0.12); phone.rotation.x = -0.4; root.add(phone);
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 0.5, 1.5);
          dongle.position.set(-0.2, 0.33 - 0.035 * k, -0.12 + 0.07 * (1 - k));
          led.position.copy(dongle.position).add(new THREE.Vector3(0.02, -0.012, 0.02)); led.visible = t > 1.6 && Math.sin(t * 8) > 0;
          scr.userData.redraw(1 + Math.floor(Math.max(0, t - 2) / 1.5));
        },
        labels: [{ text: V('Teplota oleje a chladiva sledovat', 'Watch oil and coolant temperature'), at: [0.12, 0.62, -0.1], show: [2, 8], level: 'accent' }],
        captions: [
          { text: V('OBD dongle + aplikace: kola, teploty, chyby', 'OBD dongle + app: laps, temperatures, fault codes') },
          { text: V('Telefon pevně uchytit – nikdy volně v kabině', 'Mount the phone securely – never loose in the cabin'), level: 'warning', show: [3, 8] }
        ]
      };
    }
  });

  R('track-prep.driver', {
    duration: 7, camera: { pos: [0.55, 1.2, 0.85], target: [0, 0.95, 0], fov: 34 }, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var bench = S.n7 ? S.n7.bench(K, 1.0, 0.5, 0.8) : new THREE.Group(); root.add(bench);
      var hm = new THREE.Group();
      var shell = K.mesh(new THREE.SphereGeometry(0.13, 32, 20), K.M.clone('caliperRed', { color: 0xf2f2f2 })); shell.scale.set(1, 1.1, 1.15); hm.add(shell);
      var visor = K.mesh(new THREE.SphereGeometry(0.134, 32, 10, PI / 2 - 0.9, 1.8, 1.2, 0.6), K.M.clone('glass', { color: 0x10181f, opacity: 0.92 })); visor.scale.set(1, 1.1, 1.15); hm.add(visor);
      var stripe = K.mesh(K.G.torus(0.131, 0.004, PI, 32), 'toolRed'); stripe.rotation.set(0, PI / 2, 0); stripe.scale.set(1, 1.1, 1.15); hm.add(stripe);
      hm.position.set(-0.2, 0.96, 0); root.add(hm);
      var gl = K.P.glove(K.M.clone('leather', { color: 0x1d1f22 })); gl.position.set(0.15, 0.84, 0.05); gl.rotation.set(-PI / 2, 0, 0.5); root.add(gl);
      var label = K.FX.canvasPanel(0.1, 0.035, function (c, W, H) { c.fillStyle = '#f5a524'; c.fillRect(0, 0, W, H); c.fillStyle = '#111'; c.font = 'bold ' + Math.round(H * 0.55) + 'px sans-serif'; c.textAlign = 'center'; c.fillText('ECE 22.06', W / 2, H * 0.7); }, { px: 256 });
      label.position.set(-0.2, 0.86, 0.13); root.add(label);
      return {
        root: root,
        update: function (t) { hm.rotation.y = 0.4 + Math.sin(t * 0.6) * 0.4; },
        labels: [{ text: V('Homologovaná helma (dle pořadatele)', 'Approved helmet (per organiser)'), at: [-0.2, 1.15, 0], level: 'accent' }],
        captions: [
          { text: V('Dlouhé rukávy a kalhoty z bavlny, pevná obuv s tenkou podrážkou', 'Long cotton sleeves and trousers, sturdy thin-soled shoes') },
          { text: V('Pásy pevně, sedačka a zrcátka seřídit v boxech', 'Belts tight, adjust seat and mirrors in the pits'), level: 'info', show: [3, 7] }
        ]
      };
    }
  });

  R('track-prep.cooldown', {
    duration: 10, camera: { pos: [0, 7.5, 8.2], target: [0, 0, 0], fov: 40 }, shadow: 5, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var ring = K.mesh(new THREE.RingGeometry(2.8, 4.6, 80), K.M.clone('concrete', { color: 0x3a3d42 })); ring.rotation.x = -PI / 2; ring.position.y = 0.003; root.add(ring);
      for (var i = 0; i < 40; i++) { var k = K.mesh(K.G.box(0.5, 0.03, 0.25), i % 2 ? 'plasticWhite' : 'toolRed'); var a = i / 40 * PI * 2; k.position.set(Math.cos(a) * 4.7, 0.015, Math.sin(a) * 4.7); k.rotation.y = -a; root.add(k); }
      var holder = new THREE.Group(); root.add(holder);
      var c = K.car(CAR, { contactShadow: false }); holder.add(c.group);
      var discs = [];
      c.wheels.forEach(function (w) { w.pivot.traverse(function (o) { if (o.name === 'disc' && o.userData.rotor) discs.push(K.FX.glow(o.userData.rotor, 0xff5a00)); }); });
      var shadowP = K.FX.contactShadow(c.dims.L * 1.1, c.dims.W * 1.2, 0.5); root.add(shadowP);
      return {
        root: root,
        update: function (t) {
          var ang = t * 0.35;
          holder.position.set(Math.cos(ang) * 3.7, 0, Math.sin(ang) * 3.7); holder.rotation.y = -ang - PI / 2 + PI;
          shadowP.position.set(holder.position.x, 0.002, holder.position.z); shadowP.rotation.z = -holder.rotation.y;
          var heat = 1 - T.seg(t, 0.5, 8.5);
          discs.forEach(function (g) { g(heat); });
          c.wheels.forEach(function (w) { w.wheel.rotation.z = -t * 6; });
        },
        labels: [{ text: V('Kotouče chladnou za jízdy', 'Discs cool while driving'), at: function () { return holder.position.clone().add(new THREE.Vector3(0, 1.8, 0)); }, level: 'accent' }],
        captions: [
          { text: V('Jedno kolo zvolna bez brzdění – chlazení brzd, oleje, turba', 'One slow lap without braking – cools brakes, oil, turbo') },
          { text: V('V boxech NEZATAHOVAT ruční brzdu s horkými brzdami (přivaří se / zkřiví) – zařadit rychlost / zaklínovat', 'In the pits do NOT apply the handbrake on hot brakes (pads stick / discs warp) – leave in gear / chock'), level: 'danger', show: [3, 10] }
        ]
      };
    }
  });

  R('track-prep.after', {
    duration: 10, camera: { pos: [3.8, 1.3, 3.6], target: [0.2, 0.35, 0.3], fov: 36 }, shadow: 3.2, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group(); root.add(pitLane(K));
      var c = carOn(K, root), d = c.dims;
      var drops = K.FX.drops(K.M.oil, 6, 0.2, 0.006); drops.group.position.set(d.front - 0.6, d.clr, 0); root.add(drops.group);
      var puddle = K.mesh(K.G.cyl(0.08, 0.002, 24), K.M.oilOld); puddle.position.set(d.front - 0.6, 0.004, 0); root.add(puddle);
      var fl = frontLeft(c); root.updateMatrixWorld(true);
      var wc = fl.pivot.getWorldPosition(new THREE.Vector3());
      return {
        root: root,
        update: function (t) { drops.update(t, t > 6.5); puddle.visible = t > 7; },
        labels: [
          { text: V('Brzdy: destičky, kotouče, hadičky', 'Brakes: pads, discs, hoses'), at: wc.clone().add(new THREE.Vector3(0, 0.45, 0.2)), show: [0.5, 10] },
          { text: V('Pneu: tlak, opotřebení, poškození', 'Tyres: pressure, wear, damage'), at: wc.clone().add(new THREE.Vector3(0.35, 0.05, 0.2)), show: [2.5, 10] },
          { text: V('Matice kol dotáhnout', 'Re-torque wheel nuts'), at: wc.clone().add(new THREE.Vector3(-0.1, -0.15, 0.25)), show: [4.5, 10], level: 'accent' },
          { text: V('Úniky pod vozem?', 'Leaks under the car?'), at: [d.front - 0.6, 0.15, 0.3], show: [6.5, 10], level: 'danger' }
        ],
        captions: [
          { text: V('Po trati: kontrola dřív, než vyjedete domů', 'After the track: check before driving home') },
          { text: V('Hladina oleje, chladiva a brzdové kapaliny – doplnit / řešit únik', 'Oil, coolant and brake fluid levels – top up / fix leaks'), level: 'info', show: [5, 10] }
        ]
      };
    }
  });
})(window.STU);
