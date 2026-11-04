/* 3D scenes: Volvo XC60 air suspension (four-corner). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var XC = 'volvo-xc60-b4';

  function drawScreen(x, W, H, st) {
    x.fillStyle = '#0c151d'; x.fillRect(0, 0, W, H);
    x.fillStyle = st.color || '#1d4f73'; x.fillRect(0, 0, W, H * 0.15);
    x.textBaseline = 'middle'; x.textAlign = 'left';
    x.fillStyle = '#fff'; x.font = 'bold ' + Math.round(H * 0.08) + 'px sans-serif';
    x.fillText(st.title || '', W * 0.05, H * 0.075);
    (st.lines || []).forEach(function (l, i) {
      x.fillStyle = l.c || '#dfe8f0';
      x.font = (l.b ? 'bold ' : '') + Math.round(H * (l.s || 0.068)) + 'px sans-serif';
      x.fillText(l.t, W * 0.06, H * (0.27 + i * 0.105));
      if (l.toggle != null) {
        var tx = W * 0.74, ty = H * (0.27 + i * 0.105) - H * 0.035, tw = W * 0.18, th = H * 0.07;
        x.fillStyle = l.toggle ? '#30a46c' : '#55606c'; x.beginPath(); x.arc(tx + th / 2, ty + th / 2, th / 2, PI / 2, PI * 1.5); x.arc(tx + tw - th / 2, ty + th / 2, th / 2, -PI / 2, PI / 2); x.fill();
        x.fillStyle = '#fff'; x.beginPath(); x.arc(l.toggle ? tx + tw - th / 2 : tx + th / 2, ty + th / 2, th * 0.4, 0, PI * 2); x.fill();
      }
    });
    if (st.prog != null) {
      x.fillStyle = '#2a3a48'; x.fillRect(W * 0.06, H * 0.88, W * 0.88, H * 0.05);
      x.fillStyle = st.prog >= 1 ? '#30a46c' : '#f5a524'; x.fillRect(W * 0.06, H * 0.88, W * 0.88 * Math.min(1, st.prog), H * 0.05);
    }
  }
  function screen(K, w, h, mat) {
    var g = new THREE.Group();
    var shell = K.mesh(K.G.rbox(w + 0.03, h + 0.04, 0.02, 0.008), mat || 'plasticBlack'); g.add(shell);
    var p = K.FX.canvasPanel(w, h, drawScreen, { state: {} });
    p.position.z = 0.0105; g.add(p);
    return { group: g, set: function (st) { p.userData.redraw(st); } };
  }

  /** Air spring (bellows over a piston, with damper inside). Origin at the bottom. setInflate(k 0..1). */
  function airSpring(K) {
    var g = new THREE.Group();
    var piston = K.mesh(K.G.cyl(0.05, 0.12, 32), 'aluCast'); piston.position.y = 0.06; g.add(piston);
    var damper = K.mesh(K.G.cyl(0.028, 0.18, 24), 'blackOxide'); damper.position.y = -0.08; g.add(damper);
    var bell = new THREE.Group(); bell.position.y = 0.1; g.add(bell);
    var b = K.mesh(K.G.lathe([[0.045, 0], [0.075, 0.03], [0.085, 0.07], [0.078, 0.1], [0.086, 0.13], [0.078, 0.16], [0.06, 0.19], [0.045, 0.2]], 40), 'rubber'); bell.add(b);
    var top = K.mesh(K.G.cyl(0.07, 0.02, 32), 'steelDark'); g.add(top);
    var fit = K.mesh(K.G.cyl(0.01, 0.03, 12), 'zinc'); fit.rotation.z = PI / 2; g.add(fit);
    function setInflate(k) {
      bell.scale.set(0.9 + 0.12 * k, 0.72 + 0.28 * k, 0.9 + 0.12 * k);
      top.position.y = 0.1 + 0.2 * (0.72 + 0.28 * k) + 0.01;
      fit.position.set(0.05, top.position.y + 0.012, 0);
    }
    setInflate(1);
    g.userData = { setInflate: setInflate, bellows: b, top: top, fitting: fit };
    return g;
  }

  /** Compressor unit with cooling fins. */
  function compressor(K) {
    var g = new THREE.Group();
    var motor = K.mesh(K.G.cylX(0.045, 0.12, 28), 'plasticBlack'); motor.position.x = -0.07; g.add(motor);
    var cyl = K.mesh(K.G.cylX(0.04, 0.1, 28), 'aluCast'); cyl.position.x = 0.05; g.add(cyl);
    for (var i = 0; i < 6; i++) { var fin = K.mesh(K.G.cylX(0.052, 0.004, 28), 'alu'); fin.position.x = 0.01 + i * 0.016; g.add(fin); }
    var bracket = K.mesh(K.G.box(0.26, 0.012, 0.1), 'steelDark'); bracket.position.y = -0.055; g.add(bracket);
    [-0.1, 0.1].forEach(function (x) { var iso = K.mesh(K.G.cyl(0.012, 0.02, 12), 'rubber'); iso.position.set(x, -0.04, 0); g.add(iso); });
    return g;
  }

  /** XC60 with see-through body and the air-suspension components. */
  function xray(K, opts) {
    opts = opts || {};
    var root = new THREE.Group();
    var c = K.car(XC); root.add(c.group);
    var fade = K.FX.fader(c.body); fade(opts.opacity == null ? 0.22 : opts.opacity);
    var d = c.dims;
    var springs = c.wheels.map(function (w) {
      var s = airSpring(K);
      s.scale.setScalar(1.25);
      s.position.set(w.base.x, d.wr + 0.12, w.side * (d.track / 2 - 0.3));
      K.FX.glow(s, 0x3e8ed0)(0.35);
      root.add(s); return s;
    });
    var comp = compressor(K); comp.scale.setScalar(1.5); comp.position.set(d.xf + 0.45, 0.36, -0.45); root.add(comp);
    var vb = K.mesh(K.G.rbox(0.14, 0.08, 0.1, 0.01), 'alu'); vb.position.set(d.xf + 0.15, 0.3, -0.2); root.add(vb);
    var lines = [], flows = [];
    springs.forEach(function (s) {
      var top = s.position.clone().add(new THREE.Vector3(0.06, 0.4, 0));
      var pts = [vb.position.clone(), new THREE.Vector3((vb.position.x + top.x) / 2, 0.24, (vb.position.z + top.z) / 2), top];
      var tube = K.mesh(K.G.tube(pts, 0.005), 'plasticBlack'); root.add(tube); lines.push(tube);
      var curve = new THREE.CatmullRomCurve3(pts);
      var mat = new THREE.MeshStandardMaterial({ color: 0x3e8ed0, emissive: 0x3e8ed0, emissiveIntensity: 0.9 });
      var dots = [];
      for (var i = 0; i < 3; i++) { var b = K.mesh(K.G.sphere(0.012, 8), mat); b.userData.noShadow = true; root.add(b); dots.push(b); }
      flows.push({ curve: curve, dots: dots });
    });
    var cl = K.mesh(K.G.tube([comp.position.clone().add(new THREE.Vector3(0.1, 0, 0)), vb.position], 0.006), 'plasticBlack'); root.add(cl);
    var sensors = c.wheels.map(function (w) {
      var sn = K.mesh(K.G.rbox(0.04, 0.03, 0.03, 0.006), 'plasticBlack');
      sn.position.set(w.base.x + 0.25, d.wr + 0.1, w.side * (d.track / 2 - 0.25)); root.add(sn); return sn;
    });
    return {
      root: root, car: c, springs: springs, comp: comp, vb: vb, sensors: sensors,
      flow: function (t, on) {
        flows.forEach(function (f) { f.dots.forEach(function (b, i) { b.visible = !!on; b.position.copy(f.curve.getPointAt(((t * 0.5) + i / 3) % 1)); }); });
      }
    };
  }

  /** Sag the body: k 0..1 per corner array [fl, fr, rl, rr] in metres of drop. */
  function sagBody(c, drops) {
    var d = c.dims;
    var front = (drops[0] + drops[1]) / 2, rear = (drops[2] + drops[3]) / 2, left = (drops[0] + drops[2]) / 2, right = (drops[1] + drops[3]) / 2;
    c.body.position.y = -(front + rear) / 2;
    c.body.rotation.z = (rear - front) / d.wb;
    c.body.rotation.x = (left - right) / d.track;
  }

  /* --------------------------------------------------------------- overview */
  R('airsus.overview', {
    duration: 8, camera: { pos: [3.6, 3.4, 4.0], target: [0.3, 0.45, 0], fov: 34 }, shadow: 3.2, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, x = xray(K);
      var gComp = K.FX.glow(x.comp, 0xf5a524);
      return {
        root: x.root,
        update: function (t) {
          var pump = T.between(t, 1, 5);
          x.flow(t, pump);
          gComp(pump ? 0.5 + 0.5 * Math.sin(t * 10) : 0);
          var k = 0.85 + 0.15 * T.seg(t, 1, 4.5) - 0.15 * T.seg(t, 6, 8);
          x.springs.forEach(function (s) { s.userData.setInflate(k); });
          sagBody(x.car, [0.03 * (1 - k) / 0.15, 0.03 * (1 - k) / 0.15, 0.03 * (1 - k) / 0.15, 0.03 * (1 - k) / 0.15]);
        },
        labels: [
          { text: V('Kompresor', 'Compressor'), at: x.comp, level: 'accent' },
          { text: V('Ventilový blok', 'Valve block'), at: x.vb, show: [0.8, 8] },
          { text: V('Vzduchový měch (pružina)', 'Air spring (bellows)'), at: function () { return x.springs[3].position.clone().add(new THREE.Vector3(0, 0.5, 0)); }, show: [1.5, 8] },
          { text: V('Snímač výšky', 'Height sensor'), at: x.sensors[1], show: [2.5, 8] }
        ],
        captions: [
          { text: V('Kompresor plní měchy přes ventilový blok, snímače hlídají výšku každého rohu', 'The compressor fills the springs via the valve block, sensors watch each corner\'s height') },
          { text: V('Řídicí jednotka mění výšku podle rychlosti, zatížení a režimu', 'The control unit adjusts height for speed, load and drive mode'), level: 'info', show: [4, 8] }
        ]
      };
    }
  });

  /* --------------------------------------------------------------- symptoms */
  function drawClock(x, W, H, st) {
    x.fillStyle = st.night ? '#101a2e' : '#e9eef5'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#ffd76a'; x.beginPath(); x.arc(W * 0.18, H * 0.5, H * 0.28, 0, PI * 2); x.fill();
    if (st.night) { x.fillStyle = '#101a2e'; x.beginPath(); x.arc(W * 0.24, H * 0.42, H * 0.26, 0, PI * 2); x.fill(); }
    x.fillStyle = st.night ? '#fff' : '#111'; x.font = 'bold ' + Math.round(H * 0.42) + 'px sans-serif'; x.textBaseline = 'middle';
    x.fillText(st.time, W * 0.38, H * 0.52);
  }
  R('airsus.sag', {
    duration: 9, camera: { pos: [-4.2, 1.6, 4.6], target: [-0.3, 0.6, 0], fov: 32 }, shadow: 3.2, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(XC); root.add(c.group);
      var clock = K.FX.canvasPanel(0.9, 0.33, drawClock, { state: { time: '22:00', night: false } });
      clock.position.set(0.7, 1.95, 1.0); clock.rotation.y = -0.7; root.add(clock);
      var msg = S.t(V('Podvozek: vyžaduje servis', 'Suspension: service required'));
      var disp = screen(K, 0.8, 0.3); disp.group.position.set(-1.1, 1.95, 1.1); disp.group.rotation.y = -0.7; root.add(disp.group);
      return {
        root: root,
        update: function (t) {
          var sag = T.seg(t, 2, 6) * (1 - T.seg(t, 8.4, 9));
          sagBody(c, [0, 0, 0.07 * sag, 0.01 * sag]);
          var hour = t < 2 ? '22:00' : (t < 6.5 ? ['23:00', '01:00', '03:00', '05:00', '06:00'][Math.min(4, Math.floor((t - 2) / 0.9))] : '06:30');
          clock.userData.redraw({ time: hour, night: t > 2 && t < 6.5 });
          disp.set(t > 6.6 ? { title: 'XC60', color: '#c9282d', lines: [{ t: msg, b: true }] } : { title: 'XC60', lines: [] });
        },
        labels: [{ text: V('levý zadní roh klesl', 'left rear corner dropped'), at: function () { return new THREE.Vector3(c.dims.xr, c.dims.wr * 2 + 0.25, c.dims.W / 2); }, level: 'danger', show: [5, 8.4] }],
        captions: [
          { text: V('Příznaky: vůz klesne přes noc, kompresor běží dlouho, hlášení na displeji, nerovná výška', 'Symptoms: car sinks overnight, compressor runs long, message on display, uneven height') },
          { text: V('Nejčastěji netěsný měch nebo spojka vedení', 'Most often a leaking air spring or line connector'), level: 'info', show: [5, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ jacking mode */
  R('airsus.jackMode', {
    duration: 8, camera: { pos: [0.0, 0.05, 0.75], target: [0, 0, 0], fov: 34 }, ground: false, shadow: 0.6, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var dash = K.mesh(K.G.rbox(0.9, 0.5, 0.06, 0.03), 'plasticTex'); dash.position.z = -0.04; root.add(dash);
      var scr = screen(K, 0.22, 0.3, 'blackGloss'); root.add(scr.group);
      var finger = K.P.glove(); finger.scale.setScalar(0.8); finger.rotation.x = -0.3; root.add(finger);
      var t1 = S.t(V('Nastavení › Moje auto › Podvozek', 'Settings › My Car › Suspension'));
      var t2 = S.t(V('Automatická regulace', 'Automatic level control'));
      var t3 = S.t(V('Režim zvedání / servis', 'Jacking / service mode'));
      var t4 = S.t(V('(cestu v menu ověřte v příručce)', '(verify the menu path in the manual)'));
      return {
        root: root,
        update: function (t) {
          var off = t > 3;
          scr.set({ title: 'XC60', lines: [{ t: t1, s: 0.05 }, { t: t2, toggle: !off, s: 0.05 }, { t: t3, toggle: off, s: 0.05 }, { t: t4, s: 0.042, c: '#f5a524' }] });
          var press = T.pulse(t, 2.2, 3.2);
          finger.position.set(0.06, -0.12 + 0.02 * press, 0.12 - press * 0.08);
        },
        captions: [
          { text: V('PŘED zvednutím vypněte regulaci výšky / zapněte režim zvedání', 'BEFORE lifting switch off level control / enable jacking mode'), level: 'danger' },
          { text: V('Jinak se vůz na stojanech může sám zvednout nebo spustit', 'Otherwise the car can raise or lower itself on the stands'), level: 'info', show: [3.5, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ lift */
  R('airsus.lift', {
    duration: 9, camera: { pos: [2.1, 1.2, 5.1], target: [0.25, 0.35, 0.6], fov: 34 }, shadow: 3, thumbT: 6.5,
    build: function (ctx, K) {
      var T = K.T, rig = S.liftRig({ t: ctx.t, vehicle: XC, lang: ctx.lang }, K);
      return {
        root: rig.root,
        update: function (t) {
          var lift = T.seg(t, 0.8, 3.0) - T.seg(t, 4.6, 5.6) * (1 - rig.restA / rig.maxA);
          var standIn = T.seg(t, 3.1, 4.4);
          if (t > 8.4) { var k = T.seg(t, 8.4, 9); lift *= 1 - k; standIn *= 1 - k; }
          rig.set({ lift: lift, standIn: standIn, jackDrop: T.seg(t, 5.6, 6.4) * 0.012 });
        },
        labels: [{ text: V('✔ na stojanu', '✔ on the stand'), at: rig.spM, level: 'ok', show: [6, 8.4] }],
        captions: [
          { text: V('Regulace výšky VYPNUTÁ? Teprve pak zvedat', 'Level control OFF? Only then lift'), level: 'danger' },
          { text: V('Hever + stojany pod pevné body – nikdy pod měch nebo rameno', 'Jack + stands under solid points – never under an air spring or arm'), show: [3, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- spring inspection */
  R('airsus.spring', {
    duration: 8, camera: { pos: [0.55, 0.45, 0.7], target: [0, 0.2, 0], fov: 32 }, shadow: 0.8, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var s = airSpring(K); s.position.y = 0.1; root.add(s);
      var crackM = K.M.clone('hiDanger', { emissiveIntensity: 0.3 });
      var cracks = [];
      for (var i = 0; i < 5; i++) { var cr = K.mesh(K.G.box(0.002, 0.012, 0.03), crackM); var a = 0.3 + i * 0.15; cr.position.set(Math.cos(a) * 0.087, 0.27, Math.sin(a) * 0.087); cr.rotation.y = -a; root.add(cr); cracks.push(cr); }
      var mount = K.mesh(K.G.rbox(0.25, 0.04, 0.2, 0.01), 'castIron'); mount.position.y = 0.06; root.add(mount);
      return {
        root: root,
        update: function (t) {
          s.userData.setInflate(0.8 + 0.2 * Math.sin(t * 1.5));
          cracks.forEach(function (c) { c.visible = t > 3; });
        },
        labels: [
          { text: V('praskliny v ohybu měchu', 'cracks in the bellows fold'), at: [0.06, 0.29, 0.06], level: 'danger', show: [3, 8] },
          { text: V('spojka vedení', 'line connector'), at: s.userData.fitting, show: [0.5, 8] }
        ],
        captions: [
          { text: V('Kontrola: praskliny, odřeniny, zdeformovaný měch, uvolněné spojky', 'Check: cracks, chafing, deformed bellows, loose connectors') },
          { text: V('Prasklý měch = výměna (vždy kontrola i protějšího)', 'Cracked bellows = replace (always check the opposite one too)'), level: 'warning', show: [4, 8] }
        ]
      };
    }
  });

  /* -------------------------------------------------------------- leak test */
  R('airsus.leak', {
    duration: 9, camera: { pos: [0.5, 0.42, 0.62], target: [0, 0.25, 0], fov: 32 }, shadow: 0.8, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var s = airSpring(K); s.position.y = 0.1; root.add(s);
      var bottle = new THREE.Group();
      var bb = K.mesh(K.G.cyl(0.03, 0.14, 24), K.M.clone('glassClear', { opacity: 0.5 })); bb.position.y = 0.07; bottle.add(bb);
      var head = K.mesh(K.G.rbox(0.05, 0.04, 0.03, 0.008), 'toolBlue'); head.position.y = 0.16; bottle.add(head);
      bottle.position.set(-0.26, 0.2, 0.12); bottle.rotation.z = -0.5; root.add(bottle);
      var mist = K.FX.puff(0xe8f4ff, 14, 0.06, 0.15); mist.group.position.set(-0.17, 0.32, 0.1); mist.group.rotation.z = -1.9; root.add(mist.group);
      var bubM = K.M.clone('glassClear', { opacity: 0.55, color: 0xffffff });
      var bubs = [];
      for (var i = 0; i < 9; i++) { var b = K.mesh(K.G.sphere(0.008, 12), bubM); b.userData.ph = i / 9; b.userData.noShadow = true; root.add(b); bubs.push(b); }
      var leakAt = new THREE.Vector3(0.06, 0.23, 0.055);
      return {
        root: root,
        update: function (t) {
          s.userData.setInflate(1);
          mist.update(t, T.between(t, 1, 3));
          bubs.forEach(function (b, i) {
            var on = t > 3.2;
            var k = ((t * 0.5) + b.userData.ph) % 1;
            b.visible = on;
            var a = i * 2.1;
            b.position.copy(leakAt).add(new THREE.Vector3(Math.cos(a) * 0.012 * k, k * 0.012, Math.sin(a) * 0.012 * k));
            b.scale.setScalar(0.4 + k * 1.4);
          });
        },
        labels: [{ text: V('bubliny = netěsnost', 'bubbles = leak'), at: leakAt, level: 'danger', show: [3.5, 9] }],
        captions: [
          { text: V('Vodu se saponátem nastříkat na měch, spojky a ventilový blok (vůz natlakovaný)', 'Spray soapy water on the springs, connectors and valve block (system pressurised)') },
          { text: V('Rostoucí bubliny = únik – místo si označte', 'Growing bubbles = leak – mark the spot'), level: 'info', show: [3.5, 9] }
        ]
      };
    }
  });

  /* -------------------------------------------------- compressor + fuse */
  function drawTemp(x, W, H, v) {
    x.fillStyle = '#0c151d'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#fff'; x.font = 'bold ' + Math.round(H * 0.22) + 'px sans-serif'; x.textBaseline = 'middle'; x.textAlign = 'center';
    x.fillText(v + ' °C', W / 2, H * 0.3);
    x.fillStyle = '#2a3a48'; x.fillRect(W * 0.08, H * 0.62, W * 0.84, H * 0.16);
    x.fillStyle = v > 85 ? '#e5484d' : (v > 60 ? '#f5a524' : '#30a46c'); x.fillRect(W * 0.08, H * 0.62, W * 0.84 * Math.min(1, v / 110), H * 0.16);
  }
  R('airsus.compressor', {
    duration: 10, camera: { pos: [0.55, 0.42, 0.7], target: [0.05, 0.12, 0], fov: 34 }, shadow: 0.9, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var comp = compressor(K); comp.position.set(-0.05, 0.08, 0); root.add(comp);
      var glow = K.FX.glow(comp, 0xe5484d);
      var temp = K.FX.canvasPanel(0.16, 0.08, drawTemp, { state: 20, px: 256 }); temp.position.set(-0.05, 0.26, 0.02); root.add(temp);
      var fb = new THREE.Group();
      var box = K.mesh(K.G.rbox(0.18, 0.12, 0.04, 0.008), 'plasticBlack'); fb.add(box);
      var cols = [0xe5484d, 0x3e8ed0, 0xf5c518, 0x30a46c, 0xe5484d, 0xf5c518];
      cols.forEach(function (c, i) { var f = K.mesh(K.G.box(0.012, 0.03, 0.01), K.M.clone('plasticWhite', { color: c })); f.position.set(-0.07 + i * 0.022, 0.025, 0.024); fb.add(f); });
      var relay = K.mesh(K.G.box(0.04, 0.04, 0.03), 'plasticGrey'); relay.position.set(0.05, -0.025, 0.03); fb.add(relay);
      var rGlow = K.FX.glow(relay, 0xf5a524);
      fb.position.set(0.25, 0.12, -0.05); fb.rotation.y = -0.4; root.add(fb);
      return {
        root: root,
        update: function (t) {
          var run = t < 5.5;
          comp.position.y = 0.08 + (run ? Math.sin(t * 60) * 0.0015 : 0);
          var v = Math.round(t < 5.5 ? 20 + T.lin(t, 0, 5.5) * 80 : 100 - T.lin(t, 5.5, 10) * 60);
          temp.userData.redraw(Math.round(v / 5) * 5);
          glow(T.seg(t, 3, 5.5) * (t < 5.5 ? 1 : 1 - T.seg(t, 5.5, 7)));
          rGlow(T.between(t, 6.5, 10) ? 0.8 : 0);
        },
        labels: [
          { text: V('přehřátí → ochrana vypne', 'overheating → protection cuts out'), at: [-0.05, 0.36, 0], level: 'danger', show: [4.5, 6.5] },
          { text: V('relé + pojistka kompresoru', 'compressor relay + fuse'), at: function () { return fb.position.clone().add(new THREE.Vector3(0, 0.1, 0)); }, level: 'accent', show: [6.5, 10] }
        ],
        captions: [
          { text: V('Kompresor běžící dlouho = netěsnost; tepelná ochrana ho pak vypne', 'A compressor running long = a leak; thermal protection then switches it off') },
          { text: V('Nefunguje vůbec? Zkontrolujte pojistku a relé (umístění dle VIDA – ověřit)', 'Not working at all? Check the fuse and relay (location per VIDA – verify)'), level: 'info', show: [6, 10] }
        ]
      };
    }
  });

  /* ---------------------------------------------------------- depressurise */
  R('airsus.depressurise', {
    duration: 10, camera: { pos: [0.6, 0.45, 0.75], target: [0.1, 0.2, 0], fov: 34 }, shadow: 0.9, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var s = airSpring(K); s.position.set(-0.1, 0.05, 0); root.add(s);
      var lap = screen(K, 0.34, 0.21); lap.group.position.set(0.28, 0.24, -0.08); lap.group.rotation.y = -0.45; root.add(lap.group);
      var hiss = K.FX.puff(0xffffff, 10, 0.03, 0.08); hiss.group.position.set(-0.05, 0.38, 0); root.add(hiss.group);
      var l1 = S.t(V('Vypustit vzduch / odtlakovat', 'Deflate / depressurise')), l2 = S.t(V('Kolo na stojanu, vůz zajištěný', 'Wheel on stand, car secured')), l3 = S.t(V('Tlak v měchu: ', 'Spring pressure: ')), l4 = S.t(V('Hotovo – lze odpojit', 'Done – OK to disconnect'));
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 1.5, 6.5);
          s.userData.setInflate(1 - k);
          var bar = Math.round((1 - k) * 10);
          lap.set({ title: 'VIDA · ' + S.t(V('Podvozek', 'Suspension')), lines: [{ t: l1, b: true }, { t: l2 }, { t: l3 + bar + ' bar', c: bar > 0 ? '#f5a524' : '#30a46c' }].concat(k >= 1 ? [{ t: l4, c: '#30a46c', b: true }] : []), prog: Math.round(k * 20) / 20 });
          hiss.update(t, T.between(t, 1.5, 6.5));
        },
        captions: [
          { text: V('Před odpojením vedení nebo měchu: odtlakovat dle VIDA (ověřit postup)', 'Before disconnecting a line or spring: depressurise per VIDA (verify procedure)'), level: 'danger' },
          { text: V('Měch pod tlakem může vystřelit spojku nebo prasknout – ochranné brýle!', 'A pressurised spring can blow out a connector or burst – safety glasses!'), level: 'warning', show: [3, 10] }
        ]
      };
    }
  });

  /* --------------------------------------------------------------- replace */
  R('airsus.replace', {
    duration: 10, camera: { pos: [0.7, 0.55, 0.85], target: [0, 0.25, 0], fov: 34 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var body = K.mesh(K.G.rbox(0.5, 0.05, 0.4, 0.01), 'blackOxide'); body.position.y = 0.55; root.add(body);
      var arm = K.mesh(K.G.rbox(0.5, 0.05, 0.12, 0.012), 'castIron'); arm.position.set(0, 0.04, 0); root.add(arm);
      var oldS = airSpring(K); root.add(oldS);
      var newS = airSpring(K); root.add(newS);
      var fadeOld = K.FX.fader(oldS);
      var clip = K.mesh(K.G.torus(0.012, 0.003, PI * 1.6, 16), 'steel'); root.add(clip);
      return {
        root: root,
        update: function (t) {
          var clipOff = T.seg(t, 0.8, 2), out = T.seg(t, 2.5, 4.5), inn = T.seg(t, 5.5, 7.5);
          oldS.userData.setInflate(0); newS.userData.setInflate(t > 8.5 ? T.seg(t, 8.5, 9.8) : 0);
          oldS.position.set(0, 0.07 - out * 0.05, out * 0.45); fadeOld(1 - T.seg(t, 4.3, 5));
          newS.visible = t > 5.2; newS.position.set(0, 0.07 - (1 - inn) * 0.05, (1 - inn) * 0.45);
          clip.position.set(0.05 + clipOff * 0.08, 0.37 + clipOff * 0.06, 0); clip.visible = t < 2.2 || t > 7.8;
          if (t > 7.8) clip.position.set(0.05, 0.37, 0);
        },
        labels: [
          { text: V('pojistná spona / matice dle VIDA', 'retaining clip / nut per VIDA'), at: [0.05, 0.42, 0], show: [0.5, 2.5] },
          { text: V('nový měch – nejdřív zajistit, pak plnit', 'new spring – fit first, then inflate'), at: [0, 0.5, 0.1], level: 'ok', show: [7.5, 10] }
        ],
        captions: [
          { text: V('Výměna měchu: jen odtlakovaný, kolo dole, vůz na stojanech', 'Spring replacement: depressurised only, wheel off, car on stands') },
          { text: V('Měch neplnit, dokud není kolo / rameno zatížené dle VIDA (ověřit)', 'Do not inflate until the wheel / arm is loaded as per VIDA (verify)'), level: 'warning', show: [7.5, 10] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ calibration */
  R('airsus.calibrate', {
    duration: 10, camera: { pos: [4.3, 1.5, 4.2], target: [0.6, 0.65, 0.5], fov: 32 }, shadow: 3.2, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(XC); root.add(c.group);
      var lap = screen(K, 0.55, 0.34); lap.group.position.set(-1.0, 1.6, c.dims.W / 2 + 0.3); lap.group.rotation.y = 0.75; root.add(lap.group);
      var tape = new THREE.Group();
      var tb = K.mesh(K.G.rbox(0.07, 0.07, 0.035, 0.01), 'toolYellow'); tape.add(tb);
      var blade = K.mesh(K.G.box(0.016, 1, 0.002), 'toolYellow'); tape.add(blade);
      tape.position.set(c.dims.xf, 0, c.dims.W / 2 + 0.02); root.add(tape);
      var l1 = S.t(V('Kalibrace snímačů výšky', 'Height sensor calibration')), l2 = S.t(V('Zadejte naměřené výšky (VIDA)', 'Enter measured heights (VIDA)')), l3 = S.t(V('Kalibrováno ✔', 'Calibrated ✔'));
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 3, 7);
          var drops = [0.03 * (1 - k), 0.0, 0.02 * (1 - k), 0.01 * (1 - k)];
          sagBody(c, drops);
          var archY = c.dims.wr * 2 + 0.07 - drops[0];
          blade.scale.y = archY; blade.position.y = archY / 2; tb.position.y = archY + 0.04;
          lap.set({ title: 'VIDA', lines: [{ t: l1, b: true }, { t: l2 }].concat(k >= 1 ? [{ t: l3, c: '#30a46c', b: true }] : []), prog: Math.round(k * 20) / 20 });
        },
        labels: [{ text: V('výška: střed kola → lem', 'height: wheel centre → arch'), at: function () { return tape.position.clone().add(new THREE.Vector3(0, c.dims.wr * 2 + 0.2, 0.05)); }, show: [0.5, 10] }],
        captions: [
          { text: V('Po výměně snímače nebo měchu: kalibrace výšky ve VIDA (ověřit postup)', 'After replacing a sensor or spring: height calibration in VIDA (verify procedure)') },
          { text: V('Rovná plocha, správné tlaky pneu, prázdný vůz', 'Level ground, correct tyre pressures, empty car'), level: 'info', show: [2, 10] }
        ]
      };
    }
  });

  /* --------------------------------------------------------------- limp */
  R('airsus.limp', {
    duration: 9, camera: { pos: [4.6, 1.5, 4.4], target: [0.3, 0.55, 0], fov: 32 }, shadow: 3.2, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var road = K.mesh(K.G.box(14, 0.004, 3.4), 'plasticTex'); road.position.y = 0.002; root.add(road);
      var marks = [];
      for (var i = 0; i < 8; i++) { var m = K.mesh(K.G.box(0.8, 0.005, 0.1), 'plasticWhite'); m.position.set(-6 + i * 1.8, 0.004, -1.4); root.add(m); marks.push(m); }
      var c = K.car(XC); root.add(c.group);
      var disp = screen(K, 0.9, 0.34); disp.group.position.set(-0.6, 1.95, 0.9); disp.group.rotation.y = 0.75; root.add(disp.group);
      var m1 = S.t(V('Podvozek: porucha', 'Suspension: fault')), m2 = S.t(V('Jeďte opatrně – omezená rychlost', 'Drive carefully – limited speed'));
      return {
        root: root,
        update: function (t) {
          var drive = t < 4.5;
          var v = drive ? 1 : 1 - T.seg(t, 4.5, 6);
          marks.forEach(function (m, i) { m.position.x = (((-6 + i * 1.8 - t * 3 * (t < 6 ? 1 : 0)) % 14.4) + 14.4) % 14.4 - 7.2; });
          c.wheels.forEach(function (w) { w.wheel.rotation.z = -t * 9 * v; });
          var sag = T.seg(t, 1.5, 3);
          sagBody(c, [0, 0, 0.08 * sag, 0.02 * sag]);
          disp.set({ title: 'XC60', color: '#c9282d', lines: [{ t: m1, b: true }, { t: m2 }] });
        },
        captions: [
          { text: V('Porucha vzduchového podvozku: zpomalit, jet jen nezbytně do servisu', 'Air suspension fault: slow down, drive only as needed to a workshop'), level: 'warning' },
          { text: V('Prasklý měch / vůz na dorazech: NEJEZDIT – odtah', 'Burst spring / car on the bump stops: DO NOT DRIVE – tow'), level: 'danger', show: [3, 9] }
        ]
      };
    }
  });
})(window.STU);
