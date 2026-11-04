/* 3D scenes: Mercedes Active Body Control (ABC) hydraulics – CL 500 (C216). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var CL = 'mb-cl500-c216';

  /* ------------------------------------------------------------ helpers */
  function fluidMat(K, dirty) { return K.M.clone('oil', { color: dirty ? 0x3a3416 : 0x2fae4f, opacity: 0.82 }); }

  function drawScreen(x, W, H, st) {
    x.fillStyle = '#0c151d'; x.fillRect(0, 0, W, H);
    x.fillStyle = st.color || '#1d4f73'; x.fillRect(0, 0, W, H * 0.17);
    x.textBaseline = 'middle';
    x.fillStyle = '#fff'; x.font = 'bold ' + Math.round(H * 0.09) + 'px sans-serif';
    x.fillText(st.title, W * 0.04, H * 0.085);
    (st.lines || []).forEach(function (l, i) {
      x.fillStyle = l.c || '#dfe8f0';
      x.font = (l.b ? 'bold ' : '') + Math.round(H * 0.075) + 'px sans-serif';
      x.fillText(l.t, W * 0.05, H * (0.3 + i * 0.12));
    });
    if (st.prog != null) {
      x.fillStyle = '#2a3a48'; x.fillRect(W * 0.05, H * 0.84, W * 0.9, H * 0.07);
      x.fillStyle = st.prog >= 1 ? '#30a46c' : '#f5a524'; x.fillRect(W * 0.05, H * 0.84, W * 0.9 * Math.min(1, st.prog), H * 0.07);
    }
  }

  /** Diagnostic tablet with a canvas screen. returns {group, set(state)} */
  function tablet(K, w, h) {
    var g = new THREE.Group();
    var shell = K.mesh(K.G.rbox(w + 0.04, h + 0.05, 0.022, 0.01), 'plasticBlack'); g.add(shell);
    var p = K.FX.canvasPanel(w, h, drawScreen, { state: { title: '' } });
    p.position.z = 0.0115; g.add(p);
    return { group: g, set: function (st) { p.userData.redraw(st); } };
  }

  function drawGauge(x, W, H, v) {
    var cx = W / 2, cy = H / 2, r = W * 0.44;
    x.fillStyle = '#101317'; x.beginPath(); x.arc(cx, cy, r + 8, 0, PI * 2); x.fill();
    x.fillStyle = '#f2f3f5'; x.beginPath(); x.arc(cx, cy, r, 0, PI * 2); x.fill();
    var a0 = PI * 0.75, a1 = PI * 2.25;
    x.strokeStyle = '#e5484d'; x.lineWidth = r * 0.1; x.beginPath(); x.arc(cx, cy, r * 0.82, a0 + (a1 - a0) * 0.88, a1); x.stroke();
    x.strokeStyle = '#222'; x.fillStyle = '#222'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold ' + Math.round(r * 0.16) + 'px sans-serif';
    for (var i = 0; i <= 5; i++) {
      var a = a0 + (a1 - a0) * i / 5;
      x.lineWidth = 4; x.beginPath(); x.moveTo(cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.9); x.lineTo(cx + Math.cos(a) * r * 0.75, cy + Math.sin(a) * r * 0.75); x.stroke();
      x.fillText(String(i * 50), cx + Math.cos(a) * r * 0.58, cy + Math.sin(a) * r * 0.58);
    }
    x.font = 'bold ' + Math.round(r * 0.15) + 'px sans-serif'; x.fillText('bar', cx, cy + r * 0.45);
    var av = a0 + (a1 - a0) * Math.min(1, (v || 0) / 250);
    x.strokeStyle = '#c9282d'; x.lineWidth = 6; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(av) * r * 0.78, cy + Math.sin(av) * r * 0.78); x.stroke();
    x.fillStyle = '#333'; x.beginPath(); x.arc(cx, cy, r * 0.07, 0, PI * 2); x.fill();
  }
  function gauge(K, size) {
    var g = new THREE.Group();
    var ring = K.mesh(K.G.cylZ(size * 0.55, 0.03, 40), 'chrome'); g.add(ring);
    var p = K.FX.canvasPanel(size, size, drawGauge, { state: 0, px: 256, transparent: true });
    p.position.z = 0.016; g.add(p);
    return { group: g, set: function (bar) { p.userData.redraw(Math.round(bar / 5) * 5); } };
  }

  /** ABC strut: damper + plunger cylinder + coil spring. Origin at the lower mount. */
  function strut(K) {
    var g = new THREE.Group();
    var damper = K.mesh(K.G.cyl(0.032, 0.38, 28), 'blackOxide'); damper.position.y = 0.19; g.add(damper);
    var rod = K.mesh(K.G.cyl(0.011, 0.16, 16), 'chrome'); rod.position.y = 0.44; g.add(rod);
    var plunger = K.mesh(K.G.cyl(0.058, 0.13, 32), 'aluCast'); plunger.position.y = 0.56; g.add(plunger);
    var cap = K.mesh(K.G.cyl(0.07, 0.025, 32), 'steelDark'); cap.position.y = 0.64; g.add(cap);
    var pts = [];
    for (var k = 0; k <= 70; k++) { var a = k / 70 * PI * 2 * 5.5; pts.push([Math.cos(a) * 0.075, 0.12 + k / 70 * 0.4, Math.sin(a) * 0.075]); }
    var spring = K.mesh(K.G.tube(pts, 0.009, false, 260, 8), 'blackOxide'); g.add(spring);
    var eye = K.mesh(K.G.cylZ(0.022, 0.04, 20), 'steelDark'); g.add(eye);
    var fit = K.mesh(K.G.hex(0.012, 0.02), 'zinc'); fit.rotation.z = PI / 2; fit.position.set(0.066, 0.57, 0); g.add(fit);
    g.userData = { plunger: plunger, fitting: fit, topY: 0.66 };
    return g;
  }

  /** Pulses that run along a tube (fluid flow). */
  function flow(K, pts, color, n) {
    var curve = new THREE.CatmullRomCurve3(pts.map(K.v3));
    var mat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.9, roughness: 0.4 });
    var g = new THREE.Group(), list = [];
    for (var i = 0; i < (n || 6); i++) { var b = K.mesh(K.G.sphere(0.011, 10), mat); b.userData.noShadow = true; g.add(b); list.push(b); }
    return {
      group: g, curve: curve,
      update: function (t, speed, on) {
        list.forEach(function (b, i) { b.visible = on !== false; b.position.copy(curve.getPointAt(((t * (speed || 0.4)) + i / list.length) % 1)); });
      }
    };
  }

  /** Complete ABC circuit laid out like the car (front +X). */
  function circuit(K) {
    var root = new THREE.Group();
    var floor = K.mesh(K.G.box(3.1, 0.02, 1.7), 'plasticTex'); floor.position.y = 0.01; root.add(floor);
    var parts = {};
    var corners = [[1.25, 0.68], [1.25, -0.68], [-1.25, 0.68], [-1.25, -0.68]];
    parts.struts = corners.map(function (c) { var s = strut(K); s.position.set(c[0], 0.03, c[1]); root.add(s); return s; });
    // tandem pump on a stylised engine
    var eng = K.mesh(K.G.rbox(0.55, 0.42, 0.6, 0.03), 'castIron'); eng.position.set(0.85, 0.24, 0); root.add(eng);
    var pump = K.mesh(K.G.cylZ(0.055, 0.15, 32), 'aluCast'); pump.position.set(1.16, 0.38, 0.12); root.add(pump);
    var pulley = K.mesh(K.G.cylZ(0.06, 0.02, 32), 'steelDark'); pulley.position.set(1.16, 0.38, 0.205); root.add(pulley);
    parts.pump = pump; parts.pulley = pulley;
    // reservoir (translucent) with green fluid and cap
    var res = new THREE.Group();
    var shell = K.mesh(K.G.cyl(0.075, 0.18, 32), K.M.clone('glassClear', { opacity: 0.3 })); shell.position.y = 0.09; res.add(shell);
    var fl = K.mesh(K.G.cyl(0.068, 1, 32), fluidMat(K)); fl.position.y = 0.06; fl.scale.y = 0.12; res.add(fl);
    var cap = K.mesh(K.G.cyl(0.04, 0.03, 24), 'plasticBlack'); cap.position.y = 0.195; res.add(cap);
    res.position.set(0.75, 0.46, -0.32); root.add(res);
    parts.res = res; parts.resFluid = fl; parts.resCap = cap;
    // valve blocks + accumulators
    function block(x, z) {
      var b = new THREE.Group();
      var body = K.mesh(K.G.rbox(0.16, 0.1, 0.13, 0.012), 'alu'); b.add(body);
      for (var i = 0; i < 2; i++) { var sol = K.mesh(K.G.cyl(0.022, 0.05, 16), 'plasticBlack'); sol.position.set(-0.04 + i * 0.08, 0.07, 0); b.add(sol); }
      b.position.set(x, 0.12, z); root.add(b); return b;
    }
    parts.blockF = block(0.95, 0.42); parts.blockR = block(-0.95, 0);
    function acc(x, z) { var a = K.mesh(K.G.sphere(0.06, 24), 'blackOxide'); a.position.set(x, 0.19, z); root.add(a); return a; }
    parts.accF = acc(0.7, 0.45); parts.accR = acc(-0.7, 0.05);
    // pressure / return lines
    var press = [
      [[1.16, 0.38, 0.05], [1.1, 0.2, 0.3], [0.95, 0.15, 0.42]],
      [[0.95, 0.12, 0.42], [1.1, 0.25, 0.6], [1.31, 0.6, 0.68]],
      [[0.95, 0.12, 0.42], [1.05, 0.2, -0.2], [1.31, 0.6, -0.68]],
      [[1.1, 0.33, 0.05], [0.4, 0.08, 0.05], [-0.4, 0.08, 0.02], [-0.95, 0.12, 0]],
      [[-0.95, 0.12, 0], [-1.1, 0.25, 0.4], [-1.19, 0.6, 0.68]],
      [[-0.95, 0.12, 0], [-1.1, 0.25, -0.4], [-1.19, 0.6, -0.68]],
      [[0.7, 0.19, 0.45], [0.85, 0.15, 0.44], [0.95, 0.12, 0.42]],
      [[-0.7, 0.19, 0.05], [-0.85, 0.15, 0.02], [-0.95, 0.12, 0]]
    ];
    var ret = [[[0.95, 0.12, 0.38], [0.85, 0.3, -0.1], [0.75, 0.47, -0.32]], [[1.16, 0.38, 0.0], [1.0, 0.55, -0.2], [0.79, 0.62, -0.32]]];
    parts.flows = [];
    press.forEach(function (pp) { root.add(K.mesh(K.G.tube(pp, 0.0055), 'steel')); var f = flow(K, pp, 0xe5484d, 4); root.add(f.group); parts.flows.push(f); });
    ret.forEach(function (pp) { root.add(K.mesh(K.G.tube(pp, 0.008), 'rubber')); var f = flow(K, pp, 0x3e8ed0, 4); root.add(f.group); parts.flows.push(f); });
    var gg = gauge(K, 0.22); gg.group.position.set(1.32, 0.7, 0.25); gg.group.rotation.y = 0.9; root.add(gg.group);
    parts.gauge = gg;
    return { root: root, parts: parts };
  }

  /* ------------------------------------------------------------- overview */
  R('abc.overview', {
    duration: 8, camera: { pos: [2.9, 1.8, 2.6], target: [0, 0.3, 0], fov: 34 }, shadow: 2.2, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, c = circuit(K), p = c.parts;
      var glowF = K.FX.glow(p.blockF, 0xf5a524), glowR = K.FX.glow(p.blockR, 0xf5a524);
      return {
        root: c.root,
        update: function (t) {
          p.pulley.rotation.z = t * 12;
          var on = T.seg(t, 0.3, 1.0);
          p.flows.forEach(function (f) { f.update(t, 0.35, on > 0.5); });
          p.gauge.set(200 * on);
          var lift = Math.sin(t * PI / 2) * 0.012;
          p.struts.forEach(function (s, i) { s.userData.plunger.position.y = 0.56 + (i < 2 ? lift : -lift); });
          glowF(T.pulse(t, 2, 4)); glowR(T.pulse(t, 4, 6));
        },
        labels: [
          { text: V('Tandemové čerpadlo', 'Tandem pump'), at: p.pump },
          { text: V('Nádržka (Pentosin)', 'Reservoir (Pentosin)'), at: function () { return p.res.position.clone().add(new THREE.Vector3(0, 0.25, 0)); } },
          { text: V('Ventilový blok', 'Valve block'), at: p.blockF, show: [1.5, 8] },
          { text: V('Tlakový zásobník', 'Pressure accumulator'), at: p.accR, show: [3, 8] },
          { text: V('Plunžr na vzpěře', 'Plunger cylinder on strut'), at: function () { return p.struts[0].position.clone().add(new THREE.Vector3(0, 0.62, 0)); }, show: [2, 8] },
          { text: V('~200 bar', '~200 bar'), at: p.gauge.group, level: 'danger', show: [1, 8] }
        ],
        captions: [
          { text: V('Čerpadlo tlačí kapalinu přes ventilové bloky do plunžrů na vzpěrách', 'The pump pushes fluid through the valve blocks into the struts\' plunger cylinders') },
          { text: V('Červeně: vysoký tlak (~200 bar)  ·  Modře: zpátečka do nádržky', 'Red: high pressure (~200 bar) · Blue: return to the reservoir'), level: 'info', show: [1, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------- symptoms */
  function drawClock(x, W, H, st) {
    x.fillStyle = st.night ? '#101a2e' : '#e9eef5'; x.fillRect(0, 0, W, H);
    x.fillStyle = st.night ? '#ffd76a' : '#f5a524';
    x.beginPath(); x.arc(W * 0.18, H * 0.5, H * 0.28, 0, PI * 2); x.fill();
    if (st.night) { x.fillStyle = '#101a2e'; x.beginPath(); x.arc(W * 0.24, H * 0.42, H * 0.26, 0, PI * 2); x.fill(); }
    x.fillStyle = st.night ? '#fff' : '#111'; x.font = 'bold ' + Math.round(H * 0.42) + 'px sans-serif'; x.textBaseline = 'middle';
    x.fillText(st.time, W * 0.38, H * 0.52);
  }
  function drawWarn(x, W, H, st) {
    x.fillStyle = '#0b0d10'; x.fillRect(0, 0, W, H);
    if (!st.on) return;
    x.fillStyle = st.red ? '#e5484d' : '#f5c518';
    x.font = 'bold ' + Math.round(H * 0.3) + 'px sans-serif'; x.textBaseline = 'middle'; x.textAlign = 'center';
    x.fillText('ABC', W / 2, H * 0.35);
    x.font = Math.round(H * 0.15) + 'px sans-serif'; x.fillStyle = '#fff';
    x.fillText(st.msg, W / 2, H * 0.72);
  }
  R('abc.symptoms', {
    duration: 9, camera: { pos: [4.6, 1.7, 4.2], target: [0.2, 0.55, 0], fov: 32 }, shadow: 3.2, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(CL); root.add(c.group);
      var clock = K.FX.canvasPanel(0.9, 0.33, drawClock, { state: { time: '22:00', night: false } });
      clock.position.set(-0.9, 1.75, 0.6); clock.rotation.y = 0.75; root.add(clock);
      var warnTxt = S.t(V('Navštivte servis', 'Visit workshop'));
      var stopTxt = S.t(V('Zastavte vůz!', 'Stop vehicle!'));
      var warn = K.FX.canvasPanel(0.8, 0.44, drawWarn, { state: { on: false } });
      warn.position.set(0.9, 1.8, 0.8); warn.rotation.y = 0.75; root.add(warn);
      return {
        root: root,
        update: function (t) {
          var night = t > 2 && t < 6.5;
          var sag = T.seg(t, 2.2, 6) * (1 - T.seg(t, 8.4, 9));
          c.body.rotation.x = sag * 0.025; c.body.rotation.z = -sag * 0.012; c.body.position.y = -sag * 0.025;
          var hour = t < 2 ? '22:00' : (t < 6.5 ? ['23:00', '01:00', '03:00', '05:00', '06:00'][Math.min(4, Math.floor((t - 2) / 0.9))] : '06:30');
          clock.userData.redraw({ time: hour, night: night });
          warn.userData.redraw({ on: t > 6.6, red: t > 7.8, msg: t > 7.8 ? stopTxt : warnTxt });
        },
        labels: [
          { text: V('roh přes noc klesl', 'corner sank overnight'), at: function () { return new THREE.Vector3(c.dims.xf, c.dims.wr + 0.45, c.dims.W / 2); }, show: [5, 8.4], level: 'danger' }
        ],
        captions: [
          { text: V('Typické příznaky: vůz si „sedne“ přes noc, tvrdá jízda, hluk čerpadla, kontrolka ABC', 'Typical symptoms: car sinks overnight, harsh ride, pump noise, ABC warning') },
          { text: V('Žlutá = do servisu  ·  Červená = ZASTAVIT (riziko ztráty odpružení)', 'Yellow = workshop · Red = STOP (risk of losing suspension)'), level: 'danger', show: [6.6, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- injection danger */
  R('abc.injection', {
    duration: 6, camera: { pos: [0.45, 0.32, 0.6], target: [0, 0.12, 0], fov: 32 }, shadow: 0.8, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var blk = K.mesh(K.G.rbox(0.18, 0.1, 0.14, 0.012), 'alu'); blk.position.set(-0.1, 0.1, 0); root.add(blk);
      var line = K.mesh(K.G.tube([[0, 0.11, 0], [0.12, 0.12, 0.02], [0.3, 0.06, 0.05]], 0.006), 'steel'); root.add(line);
      var nut = K.mesh(K.G.hex(0.013, 0.02), 'zinc'); nut.rotation.z = PI / 2; nut.position.set(-0.002, 0.11, 0); root.add(nut);
      var jetMat = K.M.clone('oil', { color: 0x2fae4f, opacity: 0.55 });
      var jet = K.mesh(new THREE.ConeGeometry(0.022, 0.26, 16, 1, true), jetMat); jet.rotation.z = PI / 2; jet.position.set(0.135, 0.11, 0); jet.userData.noShadow = true; root.add(jet);
      var hand = K.P.glove(); hand.scale.setScalar(0.6); hand.rotation.set(0, -PI / 2, PI / 2); root.add(hand);
      var no = new THREE.Group();
      [1, -1].forEach(function (s) { var b = K.mesh(K.G.box(0.12, 0.018, 0.018), 'hiDanger'); b.rotation.z = s * PI / 4; no.add(b); });
      no.position.set(0.18, 0.24, 0); root.add(no);
      return {
        root: root,
        update: function (t) {
          var spray = T.between(t, 1, 5.4);
          jet.visible = spray; jet.scale.set(1, 0.85 + 0.15 * Math.sin(t * 40), 1);
          hand.position.set(0.42 - T.seg(t, 1.5, 3) * 0.08, 0.12, 0.03);
          no.visible = t > 3 && Math.sin(t * 6) > -0.5;
        },
        labels: [{ text: V('jemný paprsek ~200 bar', 'fine jet ~200 bar'), at: [0.2, 0.15, 0.02], level: 'danger', show: [1, 5.4] }],
        captions: [
          { text: V('NIKDY nepovolovat šroubení ABC pod tlakem a nehledat netěsnost rukou!', 'NEVER loosen ABC fittings under pressure or feel for leaks with your hand!'), level: 'danger' },
          { text: V('Paprsek pronikne kůží – vstřik kapaliny do těla = urgentní operace', 'The jet penetrates skin – fluid injection injury = emergency surgery'), level: 'danger', show: [3, 6] }
        ]
      };
    }
  });

  /* ---------------------------------------------------------------- lifting */
  R('abc.lift', {
    duration: 9, camera: { pos: [2.1, 1.15, 4.9], target: [0.25, 0.32, 0.6], fov: 34 }, shadow: 3, thumbT: 6.5,
    build: function (ctx, K) {
      var T = K.T, rig = S.liftRig({ t: ctx.t, vehicle: CL, lang: ctx.lang }, K);
      return {
        root: rig.root,
        update: function (t) {
          var lift = T.seg(t, 0.8, 3.0) - T.seg(t, 4.6, 5.6) * (1 - rig.restA / rig.maxA);
          var standIn = T.seg(t, 3.1, 4.4);
          if (t > 8.4) { var k = T.seg(t, 8.4, 9); lift *= 1 - k; standIn *= 1 - k; }
          rig.set({ lift: lift, standIn: standIn, jackDrop: T.seg(t, 5.6, 6.4) * 0.012 });
        },
        labels: [{ text: V('Stojan pod zvedací bod', 'Stand under the jacking point'), at: rig.spM, show: [4.4, 8.4], level: 'ok' }],
        captions: [
          { text: V('Normální výška → motor VYP → klíč pryč → 1 min počkat', 'Normal ride height → engine OFF → key away → wait 1 min') },
          { text: V('Nikdy pod vůz držený jen hydraulikou ABC – vždy stojany', 'Never under a car held only by ABC hydraulics – always stands'), level: 'danger', show: [2.5, 9] }
        ]
      };
    }
  });

  /* -------------------------------------------------------------- reservoir */
  R('abc.reservoir', {
    duration: 9, camera: { pos: [0.55, 0.55, 0.75], target: [0, 0.2, 0], fov: 32 }, shadow: 0.8, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var res = new THREE.Group();
      var shell = K.mesh(K.G.cyl(0.08, 0.2, 40), K.M.clone('glassClear', { opacity: 0.32 })); shell.position.y = 0.1; res.add(shell);
      var fl = K.mesh(K.G.cyl(0.073, 0.12, 40), fluidMat(K)); fl.position.y = 0.065; res.add(fl);
      [0.07, 0.15].forEach(function (y, i) {
        var mk = K.mesh(K.G.box(0.004, 0.003, 0.05), i ? 'hiOk' : 'hiDanger'); mk.position.set(0.081, y, 0); res.add(mk);
      });
      var cap = new THREE.Group();
      var cb = K.mesh(K.G.cyl(0.045, 0.035, 32), 'plasticBlack'); cap.add(cb);
      var stick = K.mesh(K.G.box(0.012, 0.18, 0.004), 'plasticWhite'); stick.position.y = -0.1; cap.add(stick);
      var wet = K.mesh(K.G.box(0.0125, 0.06, 0.0045), fluidMat(K)); wet.position.y = -0.16; cap.add(wet);
      cap.position.y = 0.22; res.add(cap);
      root.add(res);
      var vials = [];
      [[0.2, false], [0.29, true]].forEach(function (v) {
        var g = new THREE.Group();
        var gl = K.mesh(K.G.cyl(0.018, 0.1, 20), K.M.clone('glassClear', { opacity: 0.3 })); gl.position.y = 0.05; g.add(gl);
        var f = K.mesh(K.G.cyl(0.016, 0.07, 20), fluidMat(K, v[1])); f.position.y = 0.037; g.add(f);
        g.position.set(v[0], 0, 0.05); root.add(g); vials.push(g);
      });
      var bench = K.mesh(K.G.box(0.7, 0.02, 0.4), 'wood'); bench.position.set(0.1, -0.01, 0); root.add(bench);
      return {
        root: root,
        update: function (t) {
          var up = T.seg(t, 0.6, 1.6) - T.seg(t, 3.6, 4.4);
          cap.position.y = 0.22 + up * 0.25; cap.rotation.y = up * PI * 2;
          vials.forEach(function (v) { v.visible = t > 4.5; });
        },
        labels: [
          { text: 'MAX', at: [0.1, 0.15, 0], level: 'ok', show: [0.5, 4.5] },
          { text: 'MIN', at: [0.1, 0.07, 0], level: 'danger', show: [0.5, 4.5] },
          { text: V('správně: zelená, čirá', 'correct: green, clear'), at: [0.2, 0.13, 0.05], level: 'ok', show: [4.6, 9] },
          { text: V('tmavá / kalná = výměna', 'dark / cloudy = change'), at: [0.29, 0.13, 0.05], level: 'danger', show: [4.6, 9] }
        ],
        captions: [
          { text: V('Hladinu měřit dle WIS (stav motoru/výšky – ověřit), mezi MIN a MAX', 'Check level per WIS (engine / ride-height state – verify), between MIN and MAX') },
          { text: V('Jen Pentosin CHF 11S (MB 343.0) – nic jiného nemíchat!', 'Pentosin CHF 11S (MB 343.0) only – never mix anything else!'), level: 'danger', show: [2, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------- leak check */
  R('abc.leakCheck', {
    duration: 8, camera: { pos: [0.7, 0.75, 0.9], target: [0, 0.45, 0], fov: 32 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var s = strut(K); root.add(s);
      var hose = K.mesh(K.G.tube([[0.07, 0.57, 0], [0.2, 0.62, 0.05], [0.35, 0.75, 0.1]], 0.007), 'steel'); root.add(hose);
      var wetM = K.M.clone('oil', { color: 0x2b5a33, opacity: 0.55 });
      var wet = K.mesh(K.G.cyl(0.0335, 0.22, 28), wetM); wet.position.y = 0.25; wet.userData.noShadow = true; root.add(wet);
      var drops = K.FX.drops(fluidMat(K), 6, 0.5, 0.006); drops.group.position.set(0.075, 0.55, 0); root.add(drops.group);
      var torch = new THREE.Group();
      var body = K.mesh(K.G.cylX(0.018, 0.16, 20), 'plasticBlack'); torch.add(body);
      var beam = K.mesh(new THREE.ConeGeometry(0.09, 0.45, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff3c4, transparent: true, opacity: 0.18, depthWrite: false }));
      beam.rotation.z = PI / 2; beam.position.x = -0.3; beam.userData.noShadow = true; torch.add(beam);
      root.add(torch);
      var puddle = K.mesh(K.G.cyl(0.07, 0.002, 24), wetM); puddle.position.set(0.075, 0.002, 0); root.add(puddle);
      return {
        root: root,
        update: function (t) {
          var a = -0.4 + Math.sin(t * 0.9) * 0.35;
          torch.position.set(0.45 * Math.cos(a), 0.45 + 0.1 * Math.sin(t * 0.7), 0.45 * Math.sin(a) + 0.15);
          torch.lookAt(0, 0.45, 0); torch.rotateY(PI / 2);
          drops.update(t, t > 1.5);
          wet.visible = t > 3; puddle.visible = t > 2.5;
        },
        labels: [
          { text: V('mokré šroubení', 'wet fitting'), at: s.userData.fitting, level: 'danger', show: [1.5, 8] },
          { text: V('mokrá vzpěra / plunžr', 'wet strut / plunger'), at: [0, 0.3, 0.05], level: 'danger', show: [3, 8] }
        ],
        captions: [
          { text: V('Prohlídka při VYPNUTÉM motoru: vzpěry, šroubení, vedení, ventilové bloky, čerpadlo', 'Inspect with the engine OFF: struts, fittings, lines, valve blocks, pump') },
          { text: V('Jen očima a baterkou – nikdy rukou po vedení!', 'Eyes and a torch only – never run your hand along the lines!'), level: 'danger', show: [4, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ accumulator */
  R('abc.accumulator', {
    duration: 9, camera: { pos: [0.4, 0.3, 0.5], target: [0, 0.15, 0], fov: 32 }, shadow: 0.6, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var r = 0.1;
      var back = K.mesh(new THREE.SphereGeometry(r, 40, 24, 0, PI), 'blackOxide'); back.rotation.y = PI / 2 + PI; back.position.y = 0.16;
      back.material = K.M.clone('blackOxide', { side: THREE.DoubleSide }); root.add(back);
      var front = K.mesh(new THREE.SphereGeometry(r * 1.002, 40, 24, 0, PI), K.M.clone('blackOxide', { transparent: true, opacity: 0.15, depthWrite: false })); front.rotation.y = PI / 2; front.position.y = 0.16; root.add(front);
      var gas = K.mesh(new THREE.SphereGeometry(r * 0.96, 32, 16, 0, PI * 2, 0, PI / 2), K.M.clone('hiInfo', { transparent: true, opacity: 0.45 })); gas.position.y = 0.16; root.add(gas);
      var fluid = K.mesh(new THREE.SphereGeometry(r * 0.96, 32, 16, 0, PI * 2, PI / 2, PI / 2), fluidMat(K)); fluid.position.y = 0.16; root.add(fluid);
      var diaph = K.mesh(K.G.cyl(r * 0.95, 0.006, 40), 'rubber'); diaph.position.y = 0.16; root.add(diaph);
      var port = K.mesh(K.G.cyl(0.018, 0.06, 20), 'zinc'); port.position.y = 0.04; root.add(port);
      return {
        root: root,
        update: function (t) {
          var worn = t > 5;
          var k = worn ? 0.9 : 0.35 + 0.25 * Math.sin(t * 2.4);
          var y = 0.16 - r * 0.8 + k * r * 1.5;
          diaph.position.y = y;
          var gs = Math.max(0.05, (0.16 + r - y) / r); gas.scale.set(1, Math.min(1, gs), 1); gas.position.y = y;
          fluid.position.y = y; fluid.scale.set(1, Math.max(0.05, (y - (0.16 - r)) / r), 1);
        },
        labels: [
          { text: V('dusík (plyn)', 'nitrogen (gas)'), at: [0, 0.24, 0.02], level: 'accent' },
          { text: V('kapalina', 'fluid'), at: [0, 0.09, 0.02], level: 'ok' },
          { text: V('membrána', 'diaphragm'), at: function () { return diaph.position.clone().add(new THREE.Vector3(0.1, 0, 0)); } },
          { text: V('vadný: bez plynu → tvrdá jízda, „bouchání“', 'worn: gas lost → harsh ride, knocking'), at: [0, 0.3, 0], level: 'danger', show: [5, 9] }
        ],
        captions: [
          { text: V('Zásobník tlumí rázy – plyn za membránou funguje jako pružina', 'The accumulator absorbs shocks – gas behind the diaphragm acts as a spring') },
          { text: V('Výměna jen po odtlakování systému dle WIS (ověřit postup)', 'Replace only after depressurising the system per WIS (verify procedure)'), level: 'danger', show: [5, 9] }
        ]
      };
    }
  });

  /* ---------------------------------------------------------- depressurise */
  R('abc.depressurise', {
    duration: 10, camera: { pos: [0.75, 0.55, 0.8], target: [0.05, 0.22, 0], fov: 32 }, shadow: 0.9, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var blk = K.mesh(K.G.rbox(0.18, 0.1, 0.14, 0.012), 'alu'); blk.position.set(-0.1, 0.1, 0); root.add(blk);
      var line = K.mesh(K.G.tube([[0, 0.11, 0], [0.12, 0.12, 0.02], [0.3, 0.06, 0.05]], 0.006), 'steel'); root.add(line);
      var nut = K.mesh(K.G.hex(0.013, 0.02), 'zinc'); nut.rotation.z = PI / 2; nut.position.set(-0.002, 0.11, 0); root.add(nut);
      var g = gauge(K, 0.16); g.group.position.set(-0.1, 0.28, 0.02); root.add(g.group);
      var tab = tablet(K, 0.26, 0.17); tab.group.position.set(0.32, 0.25, -0.05); tab.group.rotation.y = -0.4; root.add(tab.group);
      var sp = K.P.spanner(0.16, 0.013); var holder = new THREE.Group(); sp.rotation.z = PI / 2; holder.add(sp); holder.position.set(0.02, 0.11, 0); root.add(holder);
      var title = 'XENTRY · ABC', l1 = S.t(V('Odtlakovat systém', 'Depressurise system')), l2 = S.t(V('Motor VYP, klíč dle WIS', 'Engine OFF, key per WIS')), l3 = S.t(V('Tlak: ', 'Pressure: ')), l4 = S.t(V('Hotovo – 0 bar', 'Done – 0 bar'));
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 1.5, 6);
          var bar = 200 * (1 - k);
          g.set(bar);
          tab.set({ title: title, lines: [{ t: l1, b: true }, { t: l2 }, { t: l3 + Math.round(bar / 10) * 10 + ' bar', c: bar > 5 ? '#f5a524' : '#30a46c' }].concat(k >= 1 ? [{ t: l4, c: '#30a46c', b: true }] : []), prog: Math.round(k * 20) / 20 });
          holder.visible = t > 6.5;
          holder.rotation.x = T.seg(t, 7, 8.5) * 0.8;
        },
        labels: [{ text: V('povolit až při 0 bar', 'loosen only at 0 bar'), at: nut, level: 'ok', show: [6.5, 10] }],
        captions: [
          { text: V('Před JAKOUKOLI prací na vedeních ABC: odtlakovat dle WIS / XENTRY (ověřit postup)', 'Before ANY work on ABC lines: depressurise per WIS / XENTRY (verify procedure)'), level: 'danger' },
          { text: V('Pozor: zásobníky drží tlak i po vypnutí motoru', 'Note: accumulators hold pressure even after the engine is off'), level: 'info', show: [2, 10] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- fluid + filter */
  R('abc.flush', {
    duration: 12, camera: { pos: [0.6, 0.6, 0.8], target: [0.05, 0.22, 0], fov: 34 }, shadow: 0.9, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var shell = K.mesh(K.G.cyl(0.08, 0.2, 40), K.M.clone('glassClear', { opacity: 0.3 })); shell.position.y = 0.1; root.add(shell);
      var oldF = K.mesh(K.G.cyl(0.073, 1, 40), fluidMat(K, true)); root.add(oldF);
      var newF = K.mesh(K.G.cyl(0.073, 1, 40), fluidMat(K)); root.add(newF);
      var filt = K.P.filterCartridge(true, 0.1); filt.scale.setScalar(0.85); root.add(filt);
      var newFilt = K.P.filterCartridge(false, 0.1); newFilt.scale.setScalar(0.85); root.add(newFilt);
      var syr = new THREE.Group();
      var barrel = K.mesh(K.G.cyl(0.025, 0.22, 24), K.M.clone('glassClear', { opacity: 0.4 })); barrel.position.y = 0.11; syr.add(barrel);
      var sf = K.mesh(K.G.cyl(0.022, 1, 24), fluidMat(K, true)); syr.add(sf);
      var hose = K.mesh(K.G.cyl(0.004, 0.25, 8), 'rubber'); hose.position.y = -0.12; syr.add(hose);
      root.add(syr);
      var bottle = K.P.oilCan(0x1b6b32); bottle.scale.setScalar(0.55); root.add(bottle);
      var stream = K.FX.stream([0.14, 0.32, 0], [0.08, 0.36, 0], [0.0, 0.2, 0], fluidMat(K), 0.005); root.add(stream.mesh);
      return {
        root: root,
        update: function (t) {
          var suck = T.seg(t, 0.8, 3.5), fOut = T.seg(t, 3.8, 5), fIn = T.seg(t, 5.2, 6.4), fill = T.seg(t, 6.8, 10);
          oldF.visible = suck < 0.99; oldF.scale.y = 0.13 * (1 - suck) + 0.001; oldF.position.y = 0.006 + oldF.scale.y / 2;
          newF.visible = fill > 0.01; newF.scale.y = 0.13 * fill + 0.001; newF.position.y = 0.006 + newF.scale.y / 2;
          syr.visible = t < 4; syr.position.set(0, 0.3 - suck * 0.02, 0.0);
          sf.scale.y = 0.2 * suck + 0.001; sf.position.y = 0.01 + sf.scale.y / 2;
          filt.visible = fOut < 0.99; filt.position.set(fOut * 0.25, 0.08 + fOut * 0.25, 0);
          newFilt.visible = fIn > 0.01; newFilt.position.set(-0.25 * (1 - fIn), 0.08 + (1 - fIn) * 0.25, 0);
          bottle.visible = t > 6.5 && t < 10.5; bottle.position.set(0.16, 0.28, -0.03); bottle.rotation.z = 1.9;
          stream.set(T.between(t, 6.8, 10) ? 1 : 0);
        },
        labels: [
          { text: V('stará kapalina ven', 'old fluid out'), at: [0, 0.4, 0], show: [0.8, 3.8] },
          { text: V('nový filtr (sítko) v nádržce', 'new filter (strainer) in reservoir'), at: [0, 0.25, 0], level: 'ok', show: [5.2, 7] },
          { text: V('jen CHF 11S', 'CHF 11S only'), at: [0.16, 0.42, 0], level: 'accent', show: [6.8, 10.5] }
        ],
        captions: [
          { text: V('Výměna kapaliny = odsátí + výplach dle WIS (ověřit postup a množství)', 'Fluid change = extract + flush per WIS (verify procedure and amount)') },
          { text: V('Nikdy nemíchat s jinou kapalinou – zničí těsnění a ventily', 'Never mix with another fluid – it destroys seals and valves'), level: 'danger', show: [6, 12] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ calibration */
  R('abc.calibrate', {
    duration: 10, camera: { pos: [4.0, 1.4, 3.8], target: [0.6, 0.6, 0.5], fov: 32 }, shadow: 3.2, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(CL); root.add(c.group);
      var tab = tablet(K, 0.5, 0.32); tab.group.position.set(-1.0, 1.55, c.dims.W / 2 + 0.3); tab.group.rotation.y = 0.75; root.add(tab.group);
      var tape = new THREE.Group();
      var tb = K.mesh(K.G.rbox(0.07, 0.07, 0.035, 0.01), 'toolYellow'); tape.add(tb);
      var blade = K.mesh(K.G.box(0.016, 1, 0.002), 'toolYellow'); tape.add(blade);
      tape.position.set(c.dims.xf, 0, c.dims.W / 2 + 0.02); root.add(tape);
      var title = 'XENTRY · ABC', l1 = S.t(V('Kalibrace výšky', 'Level calibration')), l2 = S.t(V('Zadejte naměřené hodnoty (WIS)', 'Enter measured values (WIS)')), l3 = S.t(V('Výška nastavena ✔', 'Level set ✔'));
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 3, 7);
          var low = 0.03 * (1 - k);
          c.body.position.y = -low; c.body.rotation.x = low * 0.6;
          var archY = c.dims.wr + c.dims.wr + 0.06 - low;
          blade.scale.y = archY; blade.position.y = archY / 2;
          tb.position.y = archY + 0.04;
          tab.set({ title: title, lines: [{ t: l1, b: true }, { t: l2 }].concat(k >= 1 ? [{ t: l3, c: '#30a46c', b: true }] : []), prog: Math.round(k * 20) / 20 });
        },
        labels: [{ text: V('měřit střed kola → lem blatníku', 'measure wheel centre → arch lip'), at: function () { return tape.position.clone().add(new THREE.Vector3(0, c.dims.wr * 2 + 0.15, 0.05)); }, show: [0.5, 10] }],
        captions: [
          { text: V('Kalibrace výšky jen diagnostikou XENTRY a dle WIS (ověřit postup)', 'Level calibration only with XENTRY and per WIS (verify procedure)') },
          { text: V('Vůz na rovině, správný tlak pneu, prázdný kufr', 'Car on level ground, correct tyre pressure, empty boot'), level: 'info', show: [2, 10] }
        ]
      };
    }
  });
})(window.STU);
