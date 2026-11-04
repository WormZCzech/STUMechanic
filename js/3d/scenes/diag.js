/* 3D scenes: OBD diagnostics. Also defines S.d3 – shared device/screen helpers used by lights.js and plugs.js. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  /* ================================================================ helpers */
  var FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  var D = S.d3 = {};

  /** Generic dark device UI. spec = { title, rows:[{t, c, r, rc, bg}], progress, big, bigC, foot, footC, check } */
  D.ui = function (x, W, H, spec) {
    spec = spec || {};
    var u = W / 100;
    x.fillStyle = '#0b1620'; x.fillRect(0, 0, W, H);
    var top = 0;
    if (spec.title) {
      x.fillStyle = spec.titleBg || '#1d4f73'; x.fillRect(0, 0, W, u * 11);
      x.fillStyle = '#eaf3fb'; x.font = 'bold ' + (u * 6.2) + 'px ' + FONT; x.textBaseline = 'middle';
      x.fillText(spec.title, u * 3, u * 5.6);
      top = u * 11;
    }
    var y = top + u * 4;
    (spec.rows || []).forEach(function (r) {
      var rh = u * (r.h || 9);
      if (r.bg) { x.fillStyle = r.bg; x.fillRect(u * 2, y, W - u * 4, rh - u * 1.2); }
      x.fillStyle = r.c || '#d7e3ee'; x.font = (r.bold ? 'bold ' : '') + (u * (r.size || 5.4)) + 'px ' + FONT; x.textBaseline = 'middle';
      x.fillText(r.t, u * 4, y + rh / 2 - u * 0.6);
      if (r.r != null) { x.textAlign = 'right'; x.fillStyle = r.rc || '#9fd3f2'; x.fillText(r.r, W - u * 4, y + rh / 2 - u * 0.6); x.textAlign = 'left'; }
      y += rh;
    });
    if (spec.progress != null) {
      x.fillStyle = '#26384a'; x.fillRect(u * 6, y + u * 2, W - u * 12, u * 5);
      x.fillStyle = spec.progressC || '#30a46c'; x.fillRect(u * 6, y + u * 2, (W - u * 12) * spec.progress, u * 5);
      y += u * 10;
    }
    if (spec.big) {
      x.fillStyle = spec.bigC || '#30a46c'; x.font = 'bold ' + (u * (spec.bigSize || 12)) + 'px ' + FONT; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText(spec.big, W / 2, spec.bigY != null ? spec.bigY * H : (y + H) / 2);
      x.textAlign = 'left';
    }
    if (spec.foot) {
      x.fillStyle = spec.footC || '#9aa5b8'; x.font = (u * 4.6) + 'px ' + FONT; x.textBaseline = 'bottom';
      x.fillText(spec.foot, u * 3, H - u * 2.5);
    }
  };

  /** Handheld scan tool. Screen faces +Z, body upright. Returns { group, screen, plugEnd(Vector3 local) } */
  D.scanner = function (K, draw, opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var shell = K.mesh(K.G.rbox(0.11, 0.2, 0.034, 0.012), K.M.clone('toolYellow', { color: opts.color || 0xf2b705 })); g.add(shell);
    var face = K.mesh(K.G.rbox(0.096, 0.17, 0.004, 0.0015), 'plasticBlack'); face.position.z = 0.017; g.add(face);
    var screen = K.FX.canvasPanel(0.086, 0.088, draw, { px: 440, state: opts.state });
    screen.position.set(0, 0.033, 0.0195); g.add(screen);
    [[-0.025, -0.04], [0.025, -0.04], [0, -0.06], [0, -0.02]].forEach(function (p, i) {
      var b = K.mesh(K.G.cylZ(0.008, 0.004, 20), i === 3 ? 'hiOk' : 'plasticGrey'); b.position.set(p[0], p[1] - 0.015, 0.02); g.add(b);
    });
    if (opts.cable !== false) {
      var cable = K.mesh(K.G.tube(opts.cable || [[0, -0.1, 0], [0, -0.16, -0.02], [0.05, -0.24, -0.05]], 0.0045), 'rubber');
      g.add(cable);
    }
    return { group: g, screen: screen };
  };

  /** OBD-II male plug (trapezoid, 16 pins), mating face towards -Z. */
  D.obdPlug = function (K) {
    var g = new THREE.Group();
    var trap = K.G.shape([[-0.021, 0.008], [0.021, 0.008], [0.017, -0.008], [-0.017, -0.008]]);
    var nose = K.mesh(K.G.extrude(trap, 0.014, 0.001), 'plasticBlack'); nose.position.z = -0.007; g.add(nose);
    var body = K.mesh(K.G.rbox(0.05, 0.026, 0.035, 0.006), 'plasticTex'); body.position.z = 0.02; g.add(body);
    var grip = K.mesh(K.G.cylZ(0.006, 0.03, 12), 'rubber'); grip.position.z = 0.05; g.add(grip);
    return g;
  };
  /** OBD-II female port (in dash), opening towards +Z. */
  D.obdPort = function (K) {
    var g = new THREE.Group();
    var trap = K.G.shape([[-0.025, 0.011], [0.025, 0.011], [0.02, -0.011], [-0.02, -0.011]], [[[-0.021, 0.008], [-0.017, -0.008], [0.017, -0.008], [0.021, 0.008]]]);
    var frame = K.mesh(K.G.extrude(trap, 0.02, 0.001), 'plasticBlack'); g.add(frame);
    var back = K.mesh(K.G.extrude(K.G.shape([[-0.021, 0.008], [0.021, 0.008], [0.017, -0.008], [-0.017, -0.008]]), 0.004, 0), 'plasticTex'); back.position.z = -0.008; g.add(back);
    for (var row = 0; row < 2; row++) for (var i = 0; i < 8; i++) {
      var pin = K.mesh(K.G.box(0.0016, 0.003, 0.004), 'brass');
      pin.position.set(-0.0155 + i * 0.0044 + row * 0.0004, row ? -0.0035 : 0.0035, -0.004); g.add(pin);
    }
    return g;
  };

  /** Instrument cluster panel (canvas face). */
  D.cluster = function (K, draw, state) {
    var g = new THREE.Group();
    var hood = K.mesh(K.G.rbox(0.42, 0.18, 0.06, 0.03), 'plasticTex'); hood.position.z = -0.035; g.add(hood);
    var face = K.FX.canvasPanel(0.38, 0.15, draw, { px: 760, state: state }); face.position.z = 0.0; g.add(face);
    var glass = K.mesh(K.G.box(0.39, 0.16, 0.002), 'glassClear'); glass.position.z = 0.006; g.add(glass);
    return { group: g, face: face };
  };

  /** Warning-light icon on a canvas. kind: oil, temp, batt, brake, mil, abs, tpms, airbag, glow, epc */
  D.icon = function (x, kind, cx, cy, s, color) {
    x.save(); x.translate(cx, cy); x.strokeStyle = color; x.fillStyle = color; x.lineWidth = s * 0.08; x.lineJoin = 'round'; x.lineCap = 'round';
    var t = function (txt, sz) { x.font = 'bold ' + (s * (sz || 0.32)) + 'px ' + FONT; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 0, 0); };
    switch (kind) {
      case 'oil':
        x.beginPath(); x.moveTo(-s * 0.45, s * 0.1); x.lineTo(-s * 0.05, s * 0.1); x.lineTo(s * 0.12, -s * 0.08); x.lineTo(s * 0.42, -s * 0.02); x.lineTo(s * 0.12, s * 0.25); x.lineTo(-s * 0.45, s * 0.25); x.closePath(); x.fill();
        x.fillRect(-s * 0.36, -s * 0.06, s * 0.2, s * 0.1); x.beginPath(); x.arc(s * 0.46, s * 0.2, s * 0.05, 0, PI * 2); x.fill(); break;
      case 'temp':
        x.fillRect(-s * 0.04, -s * 0.38, s * 0.08, s * 0.5); x.beginPath(); x.arc(0, s * 0.2, s * 0.1, 0, PI * 2); x.fill();
        for (var i = 0; i < 3; i++) x.fillRect(s * 0.06, -s * 0.3 + i * s * 0.12, s * 0.14, s * 0.04);
        x.beginPath(); x.moveTo(-s * 0.4, s * 0.38); x.quadraticCurveTo(-s * 0.2, s * 0.3, 0, s * 0.38); x.quadraticCurveTo(s * 0.2, s * 0.46, s * 0.4, s * 0.38); x.stroke(); break;
      case 'batt':
        x.strokeRect(-s * 0.4, -s * 0.22, s * 0.8, s * 0.48); x.fillRect(-s * 0.3, -s * 0.32, s * 0.12, s * 0.1); x.fillRect(s * 0.18, -s * 0.32, s * 0.12, s * 0.1);
        x.font = 'bold ' + (s * 0.3) + 'px ' + FONT; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('− +', 0, s * 0.03); break;
      case 'brake':
        x.beginPath(); x.arc(0, 0, s * 0.27, 0, PI * 2); x.stroke(); x.beginPath(); x.arc(0, 0, s * 0.42, PI * 0.7, PI * 1.3); x.stroke(); x.beginPath(); x.arc(0, 0, s * 0.42, -PI * 0.3, PI * 0.3); x.stroke(); t('!', 0.4); break;
      case 'abs':
        x.beginPath(); x.arc(0, 0, s * 0.3, 0, PI * 2); x.stroke(); x.beginPath(); x.arc(0, 0, s * 0.43, PI * 0.7, PI * 1.3); x.stroke(); x.beginPath(); x.arc(0, 0, s * 0.43, -PI * 0.3, PI * 0.3); x.stroke(); t('ABS', 0.2); break;
      case 'mil':
        x.beginPath(); x.moveTo(-s * 0.42, -s * 0.05); x.lineTo(-s * 0.3, -s * 0.05); x.lineTo(-s * 0.3, -s * 0.2); x.lineTo(s * 0.05, -s * 0.2); x.lineTo(s * 0.15, -s * 0.1); x.lineTo(s * 0.3, -s * 0.1); x.lineTo(s * 0.3, -s * 0.2); x.lineTo(s * 0.42, -s * 0.2); x.lineTo(s * 0.42, s * 0.22); x.lineTo(s * 0.3, s * 0.22); x.lineTo(s * 0.3, s * 0.12); x.lineTo(s * 0.12, s * 0.12); x.lineTo(s * 0.02, s * 0.25); x.lineTo(-s * 0.3, s * 0.25); x.lineTo(-s * 0.3, s * 0.1); x.lineTo(-s * 0.42, s * 0.1); x.closePath(); x.stroke();
        x.fillRect(-s * 0.18, -s * 0.32, s * 0.2, s * 0.08); break;
      case 'tpms':
        x.beginPath(); x.moveTo(-s * 0.3, -s * 0.3); x.quadraticCurveTo(-s * 0.45, s * 0.05, -s * 0.28, s * 0.3); x.lineTo(s * 0.28, s * 0.3); x.quadraticCurveTo(s * 0.45, s * 0.05, s * 0.3, -s * 0.3); x.stroke(); t('!', 0.38); break;
      case 'airbag':
        x.beginPath(); x.arc(-s * 0.15, -s * 0.28, s * 0.09, 0, PI * 2); x.fill();
        x.beginPath(); x.moveTo(-s * 0.2, -s * 0.15); x.lineTo(-s * 0.25, s * 0.15); x.lineTo(s * 0.05, s * 0.15); x.lineTo(s * 0.1, s * 0.38); x.stroke();
        x.beginPath(); x.arc(s * 0.22, -s * 0.08, s * 0.17, 0, PI * 2); x.fill(); break;
      case 'glow':
        for (var k = 0; k < 4; k++) { x.beginPath(); x.arc(-s * 0.24 + k * s * 0.16, 0, s * 0.1, PI, 0, k % 2 === 1); x.stroke(); }
        x.beginPath(); x.moveTo(-s * 0.42, s * 0.25); x.lineTo(s * 0.42, s * 0.25); x.stroke(); break;
      default: t(kind, 0.3);
    }
    x.restore();
  };

  /** A bigger simple room floor (bench) for close-up scenes. */
  D.bench = function (K, w, d, y) {
    var b = K.mesh(K.G.rbox(w || 1.2, 0.04, d || 0.7, 0.01), K.M.clone('wood', { color: 0x6b6f75, roughness: 0.8 }));
    b.position.y = (y || 0) - 0.02; return b;
  };

  var TOOL = {
    'generic': 'VCDS · XENTRY · VIDA…', 'mb-cl500-c216': 'XENTRY / DAS', 'volvo-xc60-b4': 'VIDA',
    'skoda-octavia-rs-tdi': 'VCDS / OBDeleven', 'toyota-gr-yaris': 'Techstream / GTS',
    'citroen-jumper-22hdi': 'Diagbox / Lexia (PP2000)'
  };
  D.toolName = function (vid) { return TOOL[vid] || TOOL.generic; };
  var PORT = {
    'generic': V('pod palubní deskou u řidiče', 'under the dash, driver side'),
    'mb-cl500-c216': V('pod palubní deskou vlevo (za krytkou)', 'under the dash, left (behind a cover)'),
    'volvo-xc60-b4': V('pod palubní deskou u řidiče', 'under the dash, driver side'),
    'skoda-octavia-rs-tdi': V('pod palubní deskou vlevo od volantu', 'under the dash, left of the steering column'),
    'toyota-gr-yaris': V('pod palubní deskou u řidiče', 'under the dash, driver side'),
    'citroen-jumper-22hdi': V('pod palubní deskou u řidiče, za krytkou (ověřit)', 'under the dash, driver side, behind a cover (verify)')
  };

  /* ================================================================ scenes */

  /* ---- warning lights */
  var LIGHTS = [['oil', '#ff3b30', V('Tlak oleje', 'Oil pressure')], ['temp', '#ff3b30', V('Teplota', 'Coolant temp')], ['batt', '#ff3b30', V('Dobíjení', 'Charging')], ['brake', '#ff3b30', V('Brzdy', 'Brakes')],
    ['mil', '#ffb000', V('Motor (MIL)', 'Engine (MIL)')], ['abs', '#ffb000', V('ABS', 'ABS')], ['tpms', '#ffb000', V('Tlak pneu', 'Tyre pressure')], ['airbag', '#ff3b30', V('Airbag', 'Airbag')]];
  R('diag.lights', {
    duration: 8, camera: { pos: [0.05, 0.06, 0.62], target: [0, 0, 0], fov: 34 }, ground: false, shadow: 0.6, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var cl = D.cluster(K, function (x, W, H, st) {
        x.fillStyle = '#07090c'; x.fillRect(0, 0, W, H);
        // two dials
        [[W * 0.14, '#7aa7c7', 'km/h'], [W * 0.86, '#7aa7c7', 'rpm']].forEach(function (d) {
          x.strokeStyle = '#2b3846'; x.lineWidth = W * 0.006; x.beginPath(); x.arc(d[0], H * 0.55, H * 0.36, PI * 0.8, PI * 2.2); x.stroke();
          x.fillStyle = '#5c6b7a'; x.font = (W * 0.02) + 'px ' + FONT; x.textAlign = 'center'; x.fillText(d[2], d[0], H * 0.75);
        });
        LIGHTS.forEach(function (l, i) {
          var cx = W * (0.3 + (i % 4) * 0.135), cy = H * (i < 4 ? 0.3 : 0.7);
          var on = st && (st.all || (l[0] === 'mil' && st.mil) || (l[1] === '#ff3b30' && st.red) || (l[1] === '#ffb000' && st.yellow));
          D.icon(x, l[0], cx, cy, H * 0.28, on ? l[1] : '#1b2229');
        });
      }, { all: 1 });
      root.add(cl.group);
      return {
        root: root,
        update: function (t) {
          var st = t < 1.2 ? { all: 1 } : t < 4 ? { red: 1 } : t < 6.5 ? { yellow: 1, mil: Math.floor(t * 3) % 2 } : { mil: Math.floor(t * 3) % 2 };
          cl.face.userData.redraw(st);
        },
        captions: [
          { text: V('Po zapnutí zapalování se rozsvítí všechny (test žárovek)', 'At ignition ON all light up (bulb check)'), show: [0, 1.2] },
          { text: V('ČERVENÁ = zastavit hned, motor vypnout', 'RED = stop now, switch the engine off'), show: [1.2, 4], level: 'danger' },
          { text: V('ŽLUTÁ = brzy do servisu', 'YELLOW = service soon'), show: [4, 8], level: 'accent' },
          { text: V('BLIKÁ kontrolka motoru = vynechávání → zpomalit!', 'FLASHING engine light = misfire → slow down!'), show: [6.5, 8], level: 'danger' }
        ]
      };
    }
  });

  /* ---- battery voltage */
  R('diag.battery', {
    duration: 7, camera: { pos: [0.55, 0.5, 0.75], target: [0.05, 0.12, 0], fov: 36 }, shadow: 0.8, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var bat = new THREE.Group();
      bat.add(K.at(K.mesh(K.G.rbox(0.28, 0.19, 0.175, 0.01), 'plasticBlack'), 0, 0.095, 0));
      var lid = K.mesh(K.G.rbox(0.285, 0.02, 0.18, 0.006), 'plasticTex'); lid.position.y = 0.195; bat.add(lid);
      var posT = K.mesh(K.G.cyl(0.011, 0.025, 20, 0.009), 'brass'); posT.position.set(0.1, 0.215, 0.05); bat.add(posT);
      var negT = K.mesh(K.G.cyl(0.011, 0.025, 20, 0.009), 'steelDark'); negT.position.set(-0.1, 0.215, 0.05); bat.add(negT);
      var pc = K.mesh(K.G.cyl(0.013, 0.01, 20), 'hiDanger'); pc.position.set(0.1, 0.205, 0.05); bat.add(pc);
      var lbl = K.FX.canvasPanel(0.2, 0.08, function (x, W, H) { x.fillStyle = '#1d4f73'; x.fillRect(0, 0, W, H); x.fillStyle = '#fff'; x.font = 'bold ' + H * 0.35 + 'px ' + FONT; x.fillText('12V 70Ah', W * 0.08, H * 0.6); });
      lbl.position.set(0, 0.11, 0.0885); bat.add(lbl);
      root.add(bat);
      // charger / maintainer with clamps
      var ch = new THREE.Group();
      ch.add(K.at(K.mesh(K.G.rbox(0.16, 0.08, 0.1, 0.015), K.M.clone('toolBlue')), 0, 0.04, 0));
      var chScreen = K.FX.canvasPanel(0.07, 0.035, function (x, W, H, st) {
        x.fillStyle = '#062d18'; x.fillRect(0, 0, W, H); x.fillStyle = st ? '#45f08b' : '#225e3a'; x.font = 'bold ' + H * 0.6 + 'px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(st ? '13.6V' : '--.-', W / 2, H / 2);
      }, { state: 0 });
      chScreen.position.set(0, 0.06, 0.051); ch.add(chScreen);
      ch.position.set(-0.32, 0, 0.12); ch.rotation.y = 0.5; root.add(ch);
      function clamp(mat) {
        var c = new THREE.Group();
        var j1 = K.mesh(K.G.rbox(0.07, 0.016, 0.02, 0.005), mat); j1.position.set(0.03, 0.008, 0); c.add(j1);
        var j2 = j1.clone(); j2.position.y = -0.008; j2.rotation.z = -0.25; c.add(j2);
        return c;
      }
      var redC = clamp('toolRed'), blkC = clamp('plasticBlack');
      root.add(redC); root.add(blkC);
      var meter = D.scanner(K, function (x, W, H, st) { D.ui(x, W, H, { title: 'U batt', big: st ? st.v : '', bigC: st && st.low ? '#ff5a5f' : '#45f08b', bigSize: 22, foot: st && st.low ? '< 12 V!' : 'OK' }); }, { cable: false, color: 0x2f3338, state: { v: '11.8 V', low: 1 } });
      meter.group.position.set(0.3, 0.12, 0.15); meter.group.rotation.set(-0.15, 0.45, 0); root.add(meter.group);
      var cableR = null;
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 1.2, 2.6);
          redC.position.set(0.1 + (1 - k) * 0.15, 0.24 + (1 - k) * 0.1, 0.05); redC.rotation.z = -0.4;
          blkC.position.set(-0.1 - (1 - k) * 0.15, 0.24 + (1 - k) * 0.1, 0.05); blkC.rotation.z = PI + 0.4;
          var on = t > 2.8;
          chScreen.userData.redraw(on ? 1 : 0);
          meter.screen.userData.redraw(on ? { v: '13.6 V' } : { v: '11.8 V', low: 1 });
        },
        labels: [
          { text: V('nabíječka / udržovák připojen', 'charger / maintainer connected'), at: ch, show: [2.8, 7], level: 'ok' },
          { text: '+', at: posT, level: 'danger' }, { text: '−', at: negT }
        ],
        captions: [
          { text: V('Nízké napětí = falešné chybové kódy', 'Low voltage = false fault codes'), show: [0, 2.8], level: 'danger' },
          { text: V('Delší diagnostika: připojit udržovací nabíječku', 'Longer sessions: connect a battery maintainer'), show: [2.8, 7] }
        ]
      };
    }
  });

  /* ---- tool types */
  R('diag.tools', {
    duration: 6, camera: { pos: [0, 0.34, 0.72], target: [0, 0.1, 0], fov: 40 }, shadow: 0.9, thumbT: 2,
    build: function (ctx, K) {
      var root = new THREE.Group();
      root.add(D.bench(K, 1.3, 0.6, 0));
      // dongle + phone
      var dongle = D.obdPlug(K); dongle.rotation.x = -PI / 2; dongle.position.set(-0.44, 0.012, 0.1); root.add(dongle);
      var phone = new THREE.Group();
      phone.add(K.mesh(K.G.rbox(0.075, 0.15, 0.009, 0.008), 'blackGloss'));
      var ps = K.FX.canvasPanel(0.066, 0.135, function (x, W, H) { D.ui(x, W, H, { title: 'OBD', rows: [{ t: 'RPM', r: '780' }, { t: 'ECT', r: '88°C' }, { t: 'P0301', c: '#ffb000' }] }); }, { px: 220 });
      ps.position.z = 0.0095; phone.add(ps);
      phone.position.set(-0.32, 0.09, 0); phone.rotation.x = -0.35; root.add(phone);
      // handheld
      var sc = D.scanner(K, function (x, W, H) { D.ui(x, W, H, { title: 'SCAN', rows: [{ t: 'Engine', r: '2' }, { t: 'ABS', r: '0' }, { t: 'Airbag', r: '0' }] }); }, { cable: [[0, -0.1, 0], [0, -0.13, 0.03], [0.04, -0.12, 0.08]] });
      sc.group.position.set(0, 0.12, 0); sc.group.rotation.x = -0.3; root.add(sc.group);
      // laptop
      var lap = new THREE.Group();
      lap.add(K.at(K.mesh(K.G.rbox(0.3, 0.015, 0.21, 0.006), 'plasticGrey'), 0, 0.0075, 0));
      var lid = new THREE.Group(); lid.position.set(0, 0.015, -0.1);
      var lidB = K.mesh(K.G.rbox(0.3, 0.2, 0.01, 0.006), 'plasticGrey'); lidB.position.y = 0.1; lid.add(lidB);
      var tool = D.toolName(ctx.vehicle);
      var ls = K.FX.canvasPanel(0.28, 0.175, function (x, W, H) { D.ui(x, W, H, { title: tool, titleBg: '#2b5d8a', rows: [{ t: 'ECU / ABS / SRS / BCM…' }, { t: 'Service functions', c: '#ffb000' }] }); }, { px: 512 });
      ls.position.set(0, 0.1, 0.0085); lid.add(ls);
      lid.rotation.x = -0.25; lap.add(lid);
      lap.position.set(0.38, 0, 0); lap.rotation.y = -0.3; root.add(lap);
      return {
        root: root,
        labels: [
          { text: V('OBD adaptér + aplikace (jen motor)', 'OBD dongle + app (engine only)'), at: [-0.38, 0.2, 0] },
          { text: V('Ruční tester (motor + ABS + airbag…)', 'Handheld (engine + ABS + airbag…)'), at: [0, 0.25, 0] },
          { text: { cs: 'Značková: ' + tool, en: 'Brand tool: ' + tool }, at: [0.38, 0.27, -0.08], level: 'accent' }
        ],
        captions: [
          { text: V('Vyberte nástroj podle toho, co potřebujete vidět', 'Choose a tool by what you need to see') },
          { text: V('Servisní funkce (EPB, ABC, adaptace) = značkový nástroj', 'Service functions (EPB, ABC, adaptations) = brand tool'), show: [2, 6], level: 'info' }
        ]
      };
    }
  });

  /* ---- plugging into the port */
  R('diag.port', {
    duration: 7, camera: { pos: [0.22, 0.3, 0.42], target: [-0.04, 0.41, 0], fov: 44 }, shadow: 1.2, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var floor = K.mesh(K.G.box(1.4, 0.02, 1), 'fabric'); floor.position.set(0, 0.0, 0.1); root.add(floor);
      var dash = K.mesh(K.G.rbox(1.4, 0.25, 0.4, 0.04), 'plasticTex'); dash.position.set(0, 0.62, -0.2); root.add(dash);
      var knee = K.mesh(K.G.rbox(0.9, 0.1, 0.08, 0.02), 'plasticBlack'); knee.position.set(-0.1, 0.5, -0.06); root.add(knee);
      var col = K.mesh(K.G.cyl(0.045, 0.45, 24), 'plasticBlack'); col.position.set(0.38, 0.62, 0.05); col.rotation.x = 1.0; root.add(col);
      var wheel = K.mesh(K.G.torus(0.18, 0.018, PI * 2, 48), 'leather'); wheel.position.set(0.38, 0.78, 0.25); wheel.rotation.x = -0.55; root.add(wheel);
      // pedals
      [0.15, 0.32].forEach(function (x, i) {
        var arm = K.mesh(K.G.box(0.02, 0.3, 0.02), 'steelDark'); arm.position.set(x, 0.32, -0.12); arm.rotation.x = 0.3; root.add(arm);
        var pad = K.mesh(K.G.rbox(i ? 0.11 : 0.08, 0.07, 0.015, 0.006), 'rubber'); pad.position.set(x, 0.18, -0.07); pad.rotation.x = 0.3; root.add(pad);
      });
      var bracket = K.mesh(K.G.rbox(0.08, 0.03, 0.05, 0.005), 'plasticTex'); bracket.position.set(-0.05, 0.435, -0.04); root.add(bracket);
      var port = D.obdPort(K); port.position.set(-0.05, 0.425, -0.01); port.rotation.x = 0.5; root.add(port);
      var plug = D.obdPlug(K); root.add(plug);
      var cable = K.mesh(K.G.tube([[0, 0, 0.05], [0, -0.05, 0.25], [0.2, -0.38, 0.45]], 0.004), 'rubber'); plug.add(cable);
      var p0 = new THREE.Vector3(-0.05, 0.425, -0.01);
      var dir = new THREE.Vector3(0, -Math.sin(0.5), Math.cos(0.5));
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 1, 3.2);
          plug.position.copy(p0).add(dir.clone().multiplyScalar(0.012 + (1 - k) * 0.15));
          plug.rotation.x = 0.5;
        },
        labels: [
          { text: { cs: 'Zásuvka OBD: ' + (PORT[ctx.vehicle] || PORT.generic).cs, en: 'OBD port: ' + (PORT[ctx.vehicle] || PORT.generic).en }, at: [-0.05, 0.395, 0.03], level: 'accent' },
          { text: V('Kabel pryč od pedálů!', 'Cable away from the pedals!'), at: [0.23, 0.22, -0.05], level: 'danger', show: [3.2, 7] }
        ],
        captions: [
          { text: V('Zapalování ZAP, motor VYP', 'Ignition ON, engine OFF') },
          { text: V('Konektor jde jen jedním směrem – nepoužívat sílu', 'The plug fits only one way – no force'), show: [1, 7], level: 'info' }
        ]
      };
    }
  });

  /* ---- scanner screens */
  function scannerScene(id, dur, stateFn, extra) {
    R(id, {
      duration: dur, camera: { pos: [0.05, 0.22, 0.27], target: [0, 0.15, 0], fov: 34 }, shadow: 0.6, thumbT: dur * 0.7,
      build: function (ctx, K) {
        var root = new THREE.Group();
        root.add(D.bench(K, 0.9, 0.6, 0));
        var sc = D.scanner(K, function (x, W, H, st) { D.ui(x, W, H, st); }, { cable: [[0, -0.1, 0], [0, -0.115, 0.03], [0.12, -0.115, 0.1]] });
        sc.group.position.set(0, 0.12, 0); sc.group.rotation.x = -0.32; root.add(sc.group);
        var e = extra ? extra(ctx, K, root, sc) : {};
        return {
          root: root,
          update: function (t) { sc.screen.userData.redraw(stateFn(t, ctx)); if (e.update) e.update(t); },
          labels: e.labels || [], captions: e.captions || []
        };
      }
    });
  }

  scannerScene('diag.read', 8, function (t, ctx) {
    var tr = function (v) { return S.t(v); };
    if (t < 2.5) return { title: tr(V('Čtení závad…', 'Reading faults…')), progress: Math.min(1, Math.floor(t * 4) / 9), rows: [{ t: tr(V('Motor', 'Engine')) }, { t: 'ABS', c: '#6b7c8c' }] };
    var rows = [{ t: 'P0301', r: tr(V('Vynechávání v1', 'Misfire cyl 1')), bg: '#3a3010', c: '#ffcf4a', rc: '#ffcf4a' }];
    if (t > 3.2) rows.push({ t: 'P0171', r: tr(V('Směs chudá', 'System lean')), bg: '#3a3010', c: '#ffcf4a', rc: '#ffcf4a' });
    if (t > 3.9) rows.push({ t: 'U0121', r: tr(V('Kom. s ABS', 'Lost comm. ABS')), bg: '#3a1517', c: '#ff7a7f', rc: '#ff7a7f' });
    return { title: tr(V('Závady (3)', 'Faults (3)')), rows: rows, foot: tr(V('Všechny moduly ✔', 'All modules ✔')) };
  }, function () {
    return {
      captions: [
        { text: V('Kódy si vyfoťte / zapište – i ostatní moduly', 'Photo / write down the codes – all modules too') },
        { text: V('Kód ≠ vadný díl. Nejdřív zjistit příčinu.', 'Code ≠ faulty part. Find the cause first.'), show: [4.5, 8], level: 'info' }
      ]
    };
  });

  scannerScene('diag.freeze', 7, function (t) {
    var tr = function (v) { return S.t(v); };
    return { title: 'Freeze frame: P0301', rows: [
      { t: tr(V('Otáčky', 'RPM')), r: '2 340 /min' }, { t: tr(V('Rychlost', 'Speed')), r: '62 km/h' }, { t: tr(V('Teplota', 'Coolant')), r: '86 °C' },
      { t: tr(V('Zatížení', 'Load')), r: '71 %' }, { t: tr(V('Krátk. korekce', 'Short trim')), r: '+4 %' }
    ].slice(0, 1 + Math.min(4, Math.floor(t / 0.6))) };
  }, function () {
    return { captions: [
      { text: V('Freeze frame = snímek hodnot v okamžiku vzniku závady', 'Freeze frame = snapshot of values when the fault set') },
      { text: V('Za jakých podmínek chyba vznikla?', 'Under which conditions did the fault occur?'), show: [3.5, 7], level: 'info' }
    ] };
  });

  scannerScene('diag.clear', 8, function (t) {
    var tr = function (v) { return S.t(v); };
    var blink = Math.floor(t * 2) % 2;
    return { title: tr(V('Vymazat závady?', 'Clear codes?')), titleBg: '#5a1a1d', rows: [
      { t: '1. ' + tr(V('Najít příčinu', 'Find the cause')), c: t > 1.5 ? '#45f08b' : '#d7e3ee' },
      { t: '2. ' + tr(V('Opravit', 'Repair')), c: t > 3 ? '#45f08b' : '#d7e3ee' },
      { t: '3. ' + tr(V('Pak vymazat + ověřit', 'Then clear + verify')), c: t > 4.5 ? '#45f08b' : '#d7e3ee' },
      { t: 'SRS / ABS: ' + tr(V('NEMAZAT bez opravy', 'DO NOT clear unrepaired')), c: blink ? '#ff5a5f' : '#ff9a9e', bold: 1 }
    ] };
  }, function () {
    return { captions: [
      { text: V('Vymazání kódu závadu neopraví', 'Clearing a code does not fix the fault') },
      { text: V('Airbag / ABS nikdy jen nemazat!', 'Never just clear airbag / ABS!'), show: [2, 8], level: 'danger' }
    ] };
  });

  /* ---- code anatomy: 5 tiles */
  R('diag.codeAnatomy', {
    duration: 11, camera: { pos: [0, 0.12, 0.62], target: [0, 0.03, 0], fov: 36 }, ground: false, shadow: 0.6, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var chars = ['P', '0', '3', '0', '1'], tiles = [];
      chars.forEach(function (c, i) {
        var g = new THREE.Group();
        g.add(K.mesh(K.G.rbox(0.07, 0.09, 0.025, 0.008), 'plasticGrey'));
        var face = K.FX.canvasPanel(0.06, 0.08, function (x, W, H, on) {
          x.fillStyle = on ? '#f5a524' : '#e7e8ea'; x.fillRect(0, 0, W, H);
          x.fillStyle = '#111'; x.font = 'bold ' + H * 0.75 + 'px ' + FONT; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(c, W / 2, H * 0.55);
        }, { px: 160, state: 0 });
        face.position.z = 0.0131; g.add(face);
        g.position.x = (i - 2) * 0.085;
        root.add(g); tiles.push({ g: g, face: face });
      });
      var groups = [[0], [1], [2], [3], [3, 4]];
      return {
        root: root,
        update: function (t) {
          var step = Math.min(4, Math.floor(t / 2));
          tiles.forEach(function (tl, i) {
            var on = groups[step].indexOf(i) >= 0;
            tl.face.userData.redraw(on ? 1 : 0);
            tl.g.position.y = on ? 0.012 + Math.sin(t * 4) * 0.003 : 0;
            tl.g.rotation.y = on ? Math.sin(t * 2) * 0.12 : 0;
          });
        },
        captions: [
          { text: V('P = pohon · C = podvozek · B = karoserie · U = komunikace', 'P = powertrain · C = chassis · B = body · U = network'), show: [0, 2] },
          { text: V('0 = obecný kód (všechny značky) · 1 = výrobcový', '0 = generic (all brands) · 1 = manufacturer-specific'), show: [2, 4] },
          { text: V('3 = skupina: zapalování / vynechávání', '3 = group: ignition / misfire'), show: [4, 6] },
          { text: V('0 = vynechávání (spolu s další číslicí)', '0 = misfire (with the next digit)'), show: [6, 8] },
          { text: V('01 = válec 1 (P0300 = náhodné, více válců)', '01 = cylinder 1 (P0300 = random, multiple)'), show: [8, 11] },
          { text: V('Kód = kde systém vidí problém, ne který díl koupit', 'Code = where the system sees a problem, not which part to buy'), level: 'info' }
        ]
      };
    }
  });

  /* ---- live data graph */
  R('diag.live', {
    duration: 10, camera: { pos: [0.1, 0.32, 0.62], target: [0, 0.15, -0.05], fov: 36 }, shadow: 0.9, thumbT: 7,
    build: function (ctx, K) {
      var root = new THREE.Group();
      root.add(D.bench(K, 1.0, 0.7, 0));
      var lap = new THREE.Group();
      lap.add(K.at(K.mesh(K.G.rbox(0.34, 0.016, 0.23, 0.006), 'plasticGrey'), 0, 0.008, 0));
      var lid = new THREE.Group(); lid.position.set(0, 0.016, -0.11);
      lid.add(K.at(K.mesh(K.G.rbox(0.34, 0.22, 0.01, 0.006), 'plasticGrey'), 0, 0.11, 0));
      var tr = function (v) { return S.t(v); };
      var scr = K.FX.canvasPanel(0.32, 0.2, function (x, W, H, k) {
        x.fillStyle = '#0b1620'; x.fillRect(0, 0, W, H);
        x.strokeStyle = '#1e2c3a'; x.lineWidth = 1;
        for (var i = 1; i < 5; i++) { x.beginPath(); x.moveTo(0, H * i / 5); x.lineTo(W, H * i / 5); x.stroke(); }
        var n = 120, p0 = k;
        function plot(col, f) { x.strokeStyle = col; x.lineWidth = W * 0.006; x.beginPath(); for (var j = 0; j < n; j++) { var tt = (p0 + j) / 10; var y = f(tt, j); if (j) x.lineTo(W * j / n, y); else x.moveTo(0, y); } x.stroke(); }
        plot('#ff5a5f', function (tt) { return H * (0.85 - 0.6 * (1 - Math.exp(-tt / 6))); });
        plot('#45f08b', function (tt) { return H * (0.5 + 0.04 * Math.sin(tt * 3.1) + 0.02 * Math.sin(tt * 7.3)); });
        plot('#ffb000', function (tt) { return H * (Math.sin(tt * 6) > 0 ? 0.62 : 0.78); });
        x.font = 'bold ' + H * 0.06 + 'px ' + FONT;
        x.fillStyle = '#ff5a5f'; x.fillText(tr(V('teplota chladiva → ~90 °C', 'coolant temp → ~90 °C')), W * 0.02, H * 0.08);
        x.fillStyle = '#45f08b'; x.fillText(tr(V('korekce paliva ~0 %', 'fuel trim ~0 %')), W * 0.02, H * 0.16);
        x.fillStyle = '#ffb000'; x.fillText(tr(V('lambda sonda kmitá', 'O2 sensor switching')), W * 0.02, H * 0.24);
      }, { px: 640, state: 0 });
      scr.position.set(0, 0.11, 0.0085); lid.add(scr);
      lid.rotation.x = -0.2; lap.add(lid); root.add(lap);
      return {
        root: root,
        update: function (t) { scr.userData.redraw(Math.floor(t * 8)); },
        captions: [{ text: V('Živá data: co motor vidí právě teď', 'Live data: what the engine sees right now') },
          { text: V('Porovnejte s hodnotami ze specifikace', 'Compare with the specified values'), show: [4, 10], level: 'info' }]
      };
    }
  });

  /* ---- circuit: sensor – connector – wiring – ECU */
  R('diag.circuit', {
    duration: 8, camera: { pos: [0.1, 0.55, 0.9], target: [0.05, 0.1, 0], fov: 38 }, shadow: 1, thumbT: 5,
    build: function (ctx, K) {
      var root = new THREE.Group();
      root.add(D.bench(K, 1.4, 0.7, 0));
      // coolant sensor in a thermostat housing
      var hous = K.mesh(K.G.rbox(0.12, 0.08, 0.1, 0.02), 'aluCast'); hous.position.set(-0.45, 0.06, 0); root.add(hous);
      var hose = K.mesh(K.G.tube([[-0.51, 0.06, 0], [-0.62, 0.06, 0.02], [-0.66, 0.05, 0.12]], 0.022), 'rubber'); root.add(hose);
      var sensor = new THREE.Group();
      sensor.add(K.at(K.mesh(K.G.hex(0.012, 0.012), 'brass'), 0, 0, 0));
      sensor.add(K.at(K.mesh(K.G.rbox(0.02, 0.025, 0.02, 0.004), 'plasticGrey'), 0, 0.018, 0));
      sensor.position.set(-0.45, 0.105, 0); root.add(sensor);
      var conn = K.mesh(K.G.rbox(0.03, 0.025, 0.025, 0.005), 'plasticBlack'); conn.position.set(-0.45, 0.145, 0); root.add(conn);
      var wirePts = [[-0.45, 0.16, 0], [-0.4, 0.2, 0.05], [-0.1, 0.12, 0.12], [0.2, 0.1, 0.05], [0.33, 0.1, 0]];
      var harness = K.mesh(K.G.tube(wirePts, 0.007), 'plasticBlack'); root.add(harness);
      var ecu = new THREE.Group();
      ecu.add(K.mesh(K.G.rbox(0.22, 0.05, 0.16, 0.008), 'alu'));
      for (var i = 0; i < 8; i++) { var f = K.mesh(K.G.box(0.2, 0.012, 0.004), 'alu'); f.position.set(0, 0.03, -0.07 + i * 0.02); ecu.add(f); }
      var ec = K.mesh(K.G.rbox(0.06, 0.03, 0.05, 0.005), 'plasticBlack'); ec.position.set(-0.13, 0, 0); ecu.add(ec);
      ecu.position.set(0.47, 0.03, 0); root.add(ecu);
      var curve = new THREE.CatmullRomCurve3(wirePts.map(K.v3));
      var pulse = K.mesh(K.G.sphere(0.012, 16), K.M.clone('hiDanger')); pulse.userData.noShadow = true; root.add(pulse);
      var parts = [sensor, conn, harness, ecu];
      var glows = parts.map(function (p) { return K.FX.glow(p, 0xe5484d); });
      return {
        root: root,
        update: function (t) {
          pulse.position.copy(curve.getPoint((t * 0.25) % 1));
          var idx = Math.floor(t / 2) % 4;
          glows.forEach(function (g, i) { g(i === idx ? 0.6 + 0.4 * Math.sin(t * 6) : 0); });
        },
        labels: [
          { text: V('Snímač', 'Sensor'), at: sensor }, { text: V('Konektor', 'Connector'), at: conn },
          { text: V('Kabeláž', 'Wiring'), at: [-0.1, 0.16, 0.12] }, { text: V('Řídicí jednotka', 'Control unit'), at: ecu }
        ],
        captions: [
          { text: V('P0117: teplota chladiva – signál nízký', 'P0117: coolant temp – signal low') },
          { text: V('Závada může být KDEKOLI v obvodu', 'The fault can be ANYWHERE in the circuit'), level: 'danger', show: [2, 8] },
          { text: V('Měřit a ověřit, teprve pak kupovat díly', 'Measure and verify first, then buy parts'), level: 'info', show: [4, 8] }
        ]
      };
    }
  });

  /* ---- readiness monitors after a test drive */
  R('diag.monitors', {
    duration: 10, camera: { pos: [2.8, 1.7, 5.0], target: [0.1, 0.75, 0], fov: 38 }, shadow: 3.2, thumbT: 8,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var road = K.mesh(K.G.box(30, 0.004, 4), K.M.clone('plasticTex', { color: 0x30333a, roughness: 0.9 })); road.position.y = 0.002; root.add(road);
      var stripes = new THREE.Group();
      for (var i = 0; i < 16; i++) { var st = K.mesh(K.G.box(1.2, 0.002, 0.1), 'plasticWhite'); st.position.set(-15 + i * 2.5, 0.005, -1.4); stripes.add(st); }
      root.add(stripes);
      var c = K.car(ctx.vehicle); root.add(c.group);
      var tr = function (v) { return S.t(v); };
      var mons = [V('Katalyzátor', 'Catalyst'), V('Lambda sondy', 'O2 sensors'), V('Vynechávání', 'Misfire'), V('Palivová soustava', 'Fuel system')];
      var tab = new THREE.Group();
      var panel = K.FX.canvasPanel(0.9, 0.62, function (x, W, H, n) {
        D.ui(x, W, H, { title: tr(V('Připravenost (readiness)', 'Readiness monitors')), rows: mons.map(function (m, i) {
          return { t: tr(m), r: i < n ? '✔' : '…', rc: i < n ? '#45f08b' : '#ffb000', size: 6.4, h: 12 };
        }), foot: n >= 4 ? tr(V('Vše ✔ a žádný nový kód = hotovo', 'All ✔ and no new code = done')) : tr(V('zkušební jízda…', 'test drive…')), footC: n >= 4 ? '#45f08b' : '#9aa5b8' });
      }, { px: 600, state: 0 });
      tab.add(panel);
      tab.position.set(0.9, 1.75, 1.3); tab.rotation.y = 0.5; tab.scale.setScalar(1.35); root.add(tab);
      var isVan = ctx.vehicle === 'citroen-jumper-22hdi';
      if (isVan) tab.position.set(0.9, 2.95, 1.5);
      return {
        root: root,
        cameraPath: isVan ? function () { return { pos: [4.4, 2.7, 7.6], target: [0.1, 1.35, 0] }; } : null,
        update: function (t) {
          var drive = t < 8.5;
          stripes.position.x = -((t * 6) % 2.5);
          c.wheels.forEach(function (w) { w.wheel.rotation.z = -t * 18 * w.side * (drive ? 1 : 0); });
          panel.userData.redraw(Math.min(4, Math.floor(t / 1.8)));
          c.group.position.y = drive ? Math.sin(t * 13) * 0.002 : 0;
        },
        captions: [
          { text: V('Po opravě: zkušební jízda podle jízdního cyklu', 'After the repair: test drive per the drive cycle') },
          { text: V('Vše ✔ a žádný nový kód = hotovo', 'All ✔ and no new code = done'), show: [7.2, 10], level: 'ok' }
        ]
      };
    }
  });
})(window.STU);
