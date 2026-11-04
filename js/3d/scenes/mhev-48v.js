/* 3D scenes: Volvo XC60 48 V mild hybrid – overview, warning signs, safe disconnection. Uses S.n1 / S.d3 at build time.
 * Component locations are schematic (VERIFY in VIDA). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  var VID = 'volvo-xc60-b4';

  /** Schematic positions (car coords) – illustrative only, VERIFY in VIDA. */
  function comps(d) {
    return {
      isgm: new THREE.Vector3(d.front - 0.5, d.hoodF - 0.35, -0.35),
      dcdc: new THREE.Vector3(d.front - 0.95, d.hoodF - 0.45, 0.35),
      b48: new THREE.Vector3(d.xr + 0.55, d.clr + 0.3, 0.35),
      b12: new THREE.Vector3(d.front - 0.55, d.hoodF - 0.3, 0.45)
    };
  }

  /** 48 V battery pack model (grey housing, warning label, two studs on +Z face). */
  function pack48(K) {
    var g = new THREE.Group();
    var h = K.mesh(K.G.rbox(0.36, 0.14, 0.24, 0.015), K.M.clone('aluCast', { color: 0x7d838c })); h.position.y = 0.07; g.add(h);
    for (var i = 0; i < 6; i++) { var rib = K.mesh(K.G.box(0.004, 0.006, 0.22), 'aluCast'); rib.position.set(-0.15 + i * 0.06, 0.143, 0); g.add(rib); }
    var lab = K.FX.canvasPanel(0.16, 0.07, function (x, W, H) {
      x.fillStyle = '#f2c200'; x.fillRect(0, 0, W, H); x.fillStyle = '#111';
      x.beginPath(); x.moveTo(H * 0.5, H * 0.12); x.lineTo(H * 0.9, H * 0.85); x.lineTo(H * 0.1, H * 0.85); x.closePath(); x.lineWidth = H * 0.06; x.stroke();
      x.font = 'bold ' + (H * 0.42) + 'px ' + FONT; x.fillText('⚡', H * 0.33, H * 0.78);
      x.font = 'bold ' + (H * 0.3) + 'px ' + FONT; x.fillText('48 V', H * 1.05, H * 0.45);
      x.font = (H * 0.17) + 'px ' + FONT; x.fillText('Li-ion · DC', H * 1.05, H * 0.75);
    }, { px: 320 });
    lab.position.set(0.05, 0.08, 0.121); g.add(lab);
    var studs = [];
    [-0.12, -0.07].forEach(function (x, i) {
      var st = K.mesh(K.G.cylZ(0.006, 0.02, 12), 'brass'); st.position.set(x, 0.08, 0.13); g.add(st);
      var bt = K.mesh(K.G.rbox(0.03, 0.03, 0.012, 0.005), i ? 'plasticBlack' : 'toolRed'); bt.position.set(x, 0.08, 0.122); g.add(bt);
      studs.push(st);
    });
    var conn = K.mesh(K.G.rbox(0.06, 0.035, 0.03, 0.008), 'plasticBlack'); conn.position.set(0.12, 0.08, 0.135); g.add(conn);
    var lever = K.mesh(K.G.rbox(0.05, 0.008, 0.035, 0.003), K.M.clone('toolYellow')); lever.position.set(0.12, 0.1, 0.135); g.add(lever);
    g.userData = { studs: studs, conn: conn, lever: lever };
    return g;
  }

  function carScene(ctx, K, opts) {
    var x = S.n1.xray(K, VID, 0.22), c = comps(x.d), root = x.root;
    var mk = {};
    var spec = { isgm: [[0.2, 0.2, 0.2], opts.red], dcdc: [[0.18, 0.08, 0.2], opts.red], b48: [[0.36, 0.14, 0.24], opts.red], b12: [[0.26, 0.17, 0.17], opts.green] };
    Object.keys(spec).forEach(function (k) {
      var m = S.n1.marker(K, spec[k][0], spec[k][1]); m.position.copy(c[k]); root.add(m); mk[k] = m;
    });
    return { root: root, c: c, mk: mk, d: x.d };
  }

  R('mhev-48v.overview', {
    duration: 8, camera: { pos: [5.4, 2.9, 4.6], target: [0, 0.6, 0], fov: 32 }, shadow: 3.5, thumbT: 3,
    build: function (ctx, K) {
      var s = carScene(ctx, K, { red: 0x3e8ed0, green: 0x30a46c });
      var c = s.c;
      var paths = [[c.isgm, c.dcdc], [c.dcdc, c.b48], [c.dcdc, c.b12]];
      var pulses = [];
      paths.forEach(function (p, i) {
        var a = p[0], b = p[1], mid = a.clone().lerp(b, 0.5); mid.y = s.d.clr + 0.1;
        s.root.add(K.mesh(K.G.tube([a, mid, b], 0.012), i < 2 ? K.M.clone('hiInfo') : K.M.clone('hiOk')));
        for (var j = 0; j < 3; j++) { var q = K.mesh(K.G.sphere(0.03, 12), 'lightWhite'); q.userData = { a: a, m: mid, b: b, o: j / 3 }; s.root.add(q); pulses.push(q); }
      });
      return {
        root: s.root,
        update: function (t) {
          pulses.forEach(function (q) {
            var k = (t * 0.35 + q.userData.o) % 1;
            var p = k < 0.5 ? q.userData.a.clone().lerp(q.userData.m, k * 2) : q.userData.m.clone().lerp(q.userData.b, (k - 0.5) * 2);
            q.position.copy(p);
          });
        },
        labels: [
          { text: V('ISGM startér-generátor (48 V)', 'ISGM starter-generator (48 V)'), at: s.mk.isgm, level: 'accent' },
          { text: V('DC/DC měnič 48 → 12 V', 'DC/DC converter 48 → 12 V'), at: s.mk.dcdc },
          { text: V('48V Li-ion baterie', '48 V Li-ion battery'), at: s.mk.b48, level: 'accent' },
          { text: V('12V baterie', '12 V battery'), at: s.mk.b12, level: 'ok' }
        ],
        captions: [
          { text: V('Mild hybrid: ISGM pomáhá motoru, rekuperuje a startuje start-stop', 'Mild hybrid: the ISGM assists the engine, recuperates and restarts start-stop') },
          { text: V('Umístění dílů je schematické – ověřte ve VIDA', 'Component locations are schematic – verify in VIDA'), level: 'info', show: [3, 8] }
        ]
      };
    }
  });

  R('mhev-48v.signs', {
    duration: 8, camera: { pos: [0, 0.02, 0.5], target: [0, 0, 0], fov: 32 }, ground: false, shadow: 0.5, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var frame = K.mesh(K.G.rbox(0.2, 0.28, 0.02, 0.01), 'blackGloss'); frame.position.z = -0.012; root.add(frame);
      var msgs = [
        [V('Hybridní systém', 'Hybrid system'), V('Vyžadován servis', 'Service required'), '#ffb000'],
        [V('Start/Stop', 'Start/Stop'), V('Dočasně nedostupné', 'Temporarily unavailable'), '#9fd3f2'],
        [V('Elektrický systém', 'Electrical system'), V('Snížený výkon – zastavte bezpečně', 'Reduced performance – stop safely'), '#ff3b30']
      ];
      var scr = K.FX.canvasPanel(0.185, 0.26, function (x, W, H, st) {
        x.fillStyle = '#0d1116'; x.fillRect(0, 0, W, H);
        var m = msgs[st ? st.i : 0];
        x.fillStyle = m[2]; x.fillRect(W * 0.08, H * 0.32, W * 0.84, H * 0.006 * 4);
        x.fillStyle = '#eef2f6'; x.font = 'bold ' + (W * 0.08) + 'px ' + FONT; x.fillText(S.t(m[0]), W * 0.08, H * 0.26);
        x.fillStyle = m[2]; x.font = (W * 0.065) + 'px ' + FONT;
        var words = S.t(m[1]).split(' '), line = '', y = H * 0.45;
        words.forEach(function (w) { if (x.measureText(line + w).width > W * 0.84) { x.fillText(line, W * 0.08, y); line = ''; y += W * 0.09; } line += w + ' '; });
        x.fillText(line, W * 0.08, y);
      }, { px: 420, state: { i: 0 } });
      root.add(scr);
      return {
        root: root,
        update: function (t) { scr.userData.redraw({ i: Math.min(2, Math.floor(t / 2.7)) }); },
        captions: [
          { text: V('Příklady hlášení – přesné texty se liší podle softwaru', 'Example messages – exact texts depend on the software') },
          { text: V('Červené hlášení nebo zápach spáleniny = bezpečně zastavit, nejezdit', 'A red message or burning smell = stop safely, do not drive'), level: 'danger', show: [5.4, 8] }
        ]
      };
    }
  });

  R('mhev-48v.zones', {
    duration: 8, camera: { pos: [5.4, 2.9, 4.6], target: [0, 0.6, 0], fov: 32 }, shadow: 3.5, thumbT: 3,
    build: function (ctx, K) {
      var s = carScene(ctx, K, { red: 0xe5484d, green: 0x30a46c });
      return {
        root: s.root,
        update: function (t) { var k = 1 + 0.12 * Math.sin(t * 4); ['isgm', 'dcdc', 'b48'].forEach(function (n) { s.mk[n].scale.setScalar(k); }); },
        labels: [
          { text: V('✖ 48V díly neotevírat', '✖ do not open 48 V parts'), at: s.mk.b48, level: 'danger' },
          { text: V('✖ ISGM / DC/DC', '✖ ISGM / DC/DC'), at: s.mk.isgm, level: 'danger' },
          { text: V('✔ 12V baterie, vizuální kontroly', '✔ 12 V battery, visual checks'), at: s.mk.b12, level: 'ok' }
        ],
        captions: [
          { text: V('DIY: 12V baterie, vizuální kontrola řemene a kabelů, čtení chyb', 'DIY: 12 V battery, visual check of belt and cables, reading codes') },
          { text: V('48V díly (baterie, ISGM, DC/DC): jen s postupem VIDA a kvalifikací', '48 V parts (battery, ISGM, DC/DC): only with the VIDA procedure and qualification'), level: 'danger', show: [3, 8] }
        ]
      };
    }
  });

  R('mhev-48v.ppe', {
    duration: 7, camera: { pos: [0.1, 0.55, 0.7], target: [0, 0.05, 0], fov: 34 }, shadow: 0.7, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group(); root.add(S.d3.bench(K, 1.0, 0.6, 0));
      var gl = K.P.glove(K.M.clone('toolYellow', { roughness: 0.9, color: 0xff8a00 })); gl.rotation.set(-PI / 2, 0, 0.3); gl.position.set(-0.28, 0.02, 0); root.add(gl);
      var gl2 = K.P.glove(K.M.clone('toolYellow', { roughness: 0.9, color: 0xff8a00 })); gl2.rotation.set(-PI / 2, 0, -0.2); gl2.position.set(-0.15, 0.02, 0.05); root.add(gl2);
      var sd = K.P.screwdriver(0.22, K.M.clone('toolRed', { color: 0xf2b705 })); sd.position.set(0.02, 0.015, 0.12); sd.rotation.y = 0.4; root.add(sd);
      var m = S.n1.meter(K, { v: '0.0', unit: 'V' }); m.rotation.x = -PI / 2; m.position.set(0.22, 0.02, 0); root.add(m);
      var tag = K.FX.canvasPanel(0.09, 0.14, function (x, W, H) {
        x.fillStyle = '#c62828'; x.fillRect(0, 0, W, H); x.fillStyle = '#fff'; x.font = 'bold ' + (W * 0.16) + 'px ' + FONT; x.textAlign = 'center';
        x.fillText(S.t(V('NEZAPÍNAT', 'DO NOT')), W / 2, H * 0.35); x.fillText(S.t(V('pracuje se', 'SWITCH ON')), W / 2, H * 0.55); x.fillText('48 V', W / 2, H * 0.8);
      }, { px: 200 });
      tag.rotation.x = -PI / 2; tag.position.set(0.05, 0.002, -0.14); root.add(tag);
      return {
        root: root,
        update: function (t) { root.rotation.y = Math.sin(t / 7 * PI * 2) * 0.15; },
        labels: [
          { text: V('izolační rukavice (třída dle normy)', 'insulating gloves (class per standard)'), at: gl },
          { text: V('izolované nářadí', 'insulated tools'), at: sd },
          { text: V('měřák CAT III', 'CAT III meter'), at: m },
          { text: V('štítek / zámek', 'tag / lockout'), at: tag, level: 'danger' }
        ],
        captions: [
          { text: V('48 V je pod hranicí VN, ale zkrat dodá stovky ampér – oblouk a popáleniny', '48 V is below HV level, but a short delivers hundreds of amps – arc and burns') },
          { text: V('Sundejte prsteny, hodinky, řetízky', 'Remove rings, watches, chains'), level: 'warning', show: [3, 7] }
        ]
      };
    }
  });

  R('mhev-48v.sleep', {
    duration: 8, camera: { pos: [5.4, 2.4, 4.6], target: [0, 0.7, 0], fov: 32 }, shadow: 4, thumbT: 5,
    build: function (ctx, K) {
      var root = new THREE.Group(), c = K.car(VID); root.add(c.group);
      var fob = new THREE.Group(); fob.add(K.mesh(K.G.rbox(0.07, 0.035, 0.02, 0.008), 'plasticBlack'));
      root.add(fob);
      var timer = K.FX.canvasPanel(0.6, 0.3, function (x, W, H, st) {
        x.fillStyle = '#0b1620'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#9fd3f2'; x.font = 'bold ' + (H * 0.42) + 'px ' + FONT; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText(st ? st.s : '', W / 2, H * 0.45);
        x.font = (H * 0.14) + 'px ' + FONT; x.fillStyle = '#c8d3dd'; x.fillText(S.t(V('čekat dle VIDA', 'wait per VIDA')), W / 2, H * 0.85);
      }, { px: 300, state: { s: '' } });
      timer.position.set(0, c.dims.H + 0.55, 0); root.add(timer);
      return {
        root: root,
        update: function (t) {
          var k = K.T.seg(t, 0.5, 3);
          fob.position.set(c.dims.front + 0.6 + k * 3, 1.0, 1.0 + k * 2); fob.visible = k < 0.99;
          var left = Math.max(0, Math.ceil(10 - Math.max(0, t - 3) * 2));
          timer.userData.redraw({ s: left > 0 ? left + ' min' : '✔' });
          timer.lookAt(5.4, 2.4, 4.6);
        },
        captions: [
          { text: V('Zapalování vypnout, klíč daleko od vozu (keyless!)', 'Ignition off, key far from the car (keyless!)') },
          { text: V('Počkat, až řídicí jednotky usnou – doba dle VIDA', 'Wait until the control units sleep – time per VIDA'), level: 'info', show: [3, 8] }
        ]
      };
    }
  });

  R('mhev-48v.disconnect', {
    duration: 9, camera: { pos: [0.35, 0.4, 0.62], target: [0.02, 0.08, 0.05], fov: 34 }, shadow: 0.7, thumbT: 6,
    build: function (ctx, K) {
      var root = new THREE.Group(); root.add(S.d3.bench(K, 1.0, 0.7, 0));
      var p = pack48(K); root.add(p);
      var lev = p.userData.lever, conn = p.userData.conn, base = conn.position.clone(), lbase = lev.position.clone();
      return {
        root: root,
        update: function (t) {
          var flip = K.T.seg(t, 1.5, 3), pull = K.T.seg(t, 3.5, 5.5);
          lev.position.copy(lbase).add(new THREE.Vector3(0, flip * 0.02, pull * 0.12)); lev.rotation.x = -flip * 1.1;
          conn.position.copy(base).add(new THREE.Vector3(0, 0, pull * 0.12));
        },
        labels: [{ text: V('servisní odpojovač (ilustrace)', 'service disconnect (illustration)'), at: conn, level: 'accent' }],
        captions: [
          { text: V('1. 12V mínus odpojit · 2. 48V odpojit přesně dle VIDA (pořadí, díly – OVĚŘIT)', '1. Disconnect 12 V minus · 2. Disconnect 48 V exactly per VIDA (order, parts – VERIFY)') },
          { text: V('Tvar a umístění odpojovače se liší – toto je jen ilustrace', 'Shape and location of the disconnect vary – this is an illustration only'), level: 'info', show: [3, 9] }
        ]
      };
    }
  });

  R('mhev-48v.measure', {
    duration: 9, camera: { pos: [0.4, 0.42, 0.62], target: [0.05, 0.08, 0.08], fov: 34 }, shadow: 0.7, thumbT: 4,
    build: function (ctx, K) {
      var root = new THREE.Group(); root.add(S.d3.bench(K, 1.1, 0.8, 0));
      var p = pack48(K); root.add(p);
      var ref = S.n1.battery(K, { type: 'AGM' }); ref.scale.setScalar(0.7); ref.position.set(0.32, 0, -0.12); root.add(ref);
      var m = S.n1.meter(K, { v: '0.0' }); m.position.set(0.05, 0.1, 0.32); m.rotation.y = -0.2; root.add(m);
      root.updateMatrixWorld(true);
      var probe = K.mesh(K.G.cyl(0.005, 0.07, 12), 'toolRed'); root.add(probe);
      var s0 = p.userData.studs[0].getWorldPosition(new THREE.Vector3()), rp = ref.localToWorld(ref.userData.pos.clone());
      return {
        root: root,
        update: function (t) {
          var phase = Math.min(2, Math.floor(t / 3));
          var tgt = phase === 1 ? s0.clone().add(new THREE.Vector3(0, 0, 0.03)) : rp.clone();
          probe.position.copy(tgt).add(new THREE.Vector3(0, 0.04, 0)); probe.rotation.x = phase === 1 ? PI / 2 : 0;
          m.userData.disp.userData.redraw(phase === 1 ? { v: '0.0' } : { v: '12.6' });
        },
        labels: [{ text: V('1. ověřit měřák na známém zdroji', '1. prove the meter on a known source'), at: function () { return rp.clone().add(new THREE.Vector3(0, 0.1, 0)); }, show: [0, 3] },
          { text: V('2. 48V svorky: 0 V?', '2. 48 V terminals: 0 V?'), at: function () { return s0.clone().add(new THREE.Vector3(0, 0.08, 0.05)); }, show: [3, 6], level: 'accent' },
          { text: V('3. znovu ověřit měřák', '3. prove the meter again'), at: function () { return rp.clone().add(new THREE.Vector3(0, 0.1, 0)); }, show: [6, 9] }],
        captions: [
          { text: V('Ověření beznapěťového stavu: živý – mrtvý – živý', 'Prove dead: live – dead – live') },
          { text: V('Měřicí body a hodnoty dle VIDA (ověřit)', 'Measuring points and values per VIDA (verify)'), level: 'info', show: [3, 9] }
        ]
      };
    }
  });

  R('mhev-48v.cover', {
    duration: 7, camera: { pos: [0.35, 0.4, 0.62], target: [0.02, 0.08, 0.05], fov: 34 }, shadow: 0.7, thumbT: 5,
    build: function (ctx, K) {
      var root = new THREE.Group(); root.add(S.d3.bench(K, 1.0, 0.7, 0));
      var p = pack48(K); root.add(p);
      p.userData.conn.position.z += 0.12; p.userData.lever.visible = false;
      var caps = p.userData.studs.map(function (st) { var c = K.mesh(K.G.cylZ(0.016, 0.03, 16), K.M.clone('toolYellow', { color: 0xff8a00 })); root.add(c); c.userData.st = st.getWorldPosition(new THREE.Vector3()); return c; });
      var tag = K.FX.canvasPanel(0.08, 0.12, function (x, W, H) { x.fillStyle = '#c62828'; x.fillRect(0, 0, W, H); x.fillStyle = '#fff'; x.font = 'bold ' + (W * 0.15) + 'px ' + FONT; x.textAlign = 'center'; x.fillText(S.t(V('NEZAPÍNAT', 'DO NOT')), W / 2, H * 0.4); x.fillText(S.t(V('48 V', 'SWITCH ON')), W / 2, H * 0.65); }, { px: 200 });
      root.add(tag);
      return {
        root: root,
        update: function (t) {
          root.updateMatrixWorld(true);
          caps.forEach(function (c, i) { var k = K.T.seg(t, 0.5 + i, 1.8 + i); c.position.copy(c.userData.st).add(new THREE.Vector3(0, 0.08 * (1 - k), 0.02 + 0.06 * (1 - k))); });
          var k2 = K.T.seg(t, 3.5, 5); tag.position.set(0.12, 0.12 + (1 - k2) * 0.1, 0.21);
        },
        captions: [
          { text: V('Odkryté svorky zaizolovat, odpojený konektor zajistit', 'Insulate exposed terminals, secure the disconnected connector') },
          { text: V('Štítek „Nezapínat“ – nikdo nesmí systém zapojit, dokud pracujete', '"Do not switch on" tag – nobody may reconnect while you work'), level: 'warning', show: [3.5, 7] }
        ]
      };
    }
  });

  R('mhev-48v.reconnect', {
    duration: 8, camera: { pos: [0.12, 0.1, 0.48], target: [0, 0.02, 0], fov: 32 }, shadow: 0.5, ground: false, thumbT: 6,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var sc = S.d3.scanner(K, function (x, W, H, st) {
        var k = st ? st.k : 0;
        S.d3.ui(x, W, H, { title: 'VIDA', rows: [{ t: S.t(V('48V systém – kontrola', '48 V system – check')), bold: true }, { t: S.t(V('Chybové kódy', 'Fault codes')), r: k >= 1 ? '0' : '…' }, { t: S.t(V('Kalibrace', 'Calibration')), r: k >= 1 ? 'OK' : '…' }], progress: k, big: k >= 1 ? S.t(V('Hotovo ✔', 'Done ✔')) : null, bigSize: 8 });
      }, { state: { k: 0 } });
      root.add(sc.group);
      return {
        root: root,
        update: function (t) { sc.screen.userData.redraw({ k: Math.round(K.T.seg(t, 1, 5.5) * 10) / 10 }); },
        captions: [
          { text: V('Zapojit v opačném pořadí dle VIDA, pak kontrola chyb a kalibrace', 'Reconnect in reverse order per VIDA, then fault check and calibration') },
          { text: V('Hlášení na displeji nebo nefunkční start-stop = nejezdit dál, diagnostika', 'Messages on the display or start-stop not working = stop, diagnose'), level: 'warning', show: [4, 8] }
        ]
      };
    }
  });
})(window.STU);
