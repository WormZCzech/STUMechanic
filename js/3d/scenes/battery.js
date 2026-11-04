/* 3D scenes: 12 V battery – test, charge, replace, register.
 * Also defines S.n1 – shared electrical helpers (battery, clamps, multimeter, charger, car "x-ray" locator)
 * used by jumpstart-tow.js, fuses.js, alternator-starter.js and mhev-48v.js (only at build time). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  var N = S.n1 = {};

  /* --------------------------------------------------------------- helpers */
  /** Battery location per vehicle (car coords). All non-generic positions are VERIFY in the tutorial. */
  N.batLoc = function (vid, d) {
    switch (vid) {
      case 'mb-cl500-c216': return { p: [d.rear + 0.5, d.clr + 0.32, -0.45], where: V('kufr vpravo (ověřit)', 'boot, right (verify)'), trunk: true };
      case 'toyota-gr-yaris': return { p: [d.rear + 0.4, d.clr + 0.32, -0.4], where: V('kufr (ověřit)', 'boot (verify)'), trunk: true };
      case 'citroen-jumper-22hdi': return { p: [d.front - 1.7, 0.42, 0.55], where: V('pod podlahou u řidiče (ověřit)', 'under the floor, driver side (verify)'), floor: true };
      case 'volvo-xc60-b4': return { p: [d.front - 0.55, d.hoodF - 0.3, 0.45], where: V('dle příručky / VIDA (ověřit)', 'per manual / VIDA (verify)') };
      case 'skoda-octavia-rs-tdi': return { p: [d.front - 0.5, d.hoodF - 0.28, 0.45], where: V('motorový prostor vlevo pod krytem', 'engine bay left, under a cover') };
      default: return { p: [d.front - 0.5, d.hoodF - 0.28, 0.45], where: V('motorový prostor (typicky)', 'engine bay (typically)') };
    }
  };

  var LEAD = null;
  function leadMat(K) { if (!LEAD) { LEAD = K.M.clone('steelDark', { color: 0x8d9094, metalness: 0.35, roughness: 0.55 }); LEAD.userData.shared = true; } return LEAD; }

  /** 12 V battery. Base at y=0, length along X, width Z. Posts on the -Z edge: + at +X, − at −X.
   *  opts {L,H,W, type:'AGM'|'EFB'|'STD', cut:true (transparent case with plates)} -> group with userData {pos, neg, topY} */
  N.battery = function (K, o) {
    o = o || {};
    var L = o.L || 0.278, H = o.H || 0.175, W = o.W || 0.175;
    var g = new THREE.Group();
    var caseMat = o.cut ? K.M.clone('plasticBlack', { transparent: true, opacity: 0.28, depthWrite: false }) : K.M.clone('plasticBlack', { color: 0x202326, roughness: 0.45 });
    var box = K.mesh(K.G.rbox(L, H, W, 0.008), caseMat); box.position.y = H / 2; g.add(box);
    var lid = K.mesh(K.G.rbox(L + 0.004, 0.02, W + 0.004, 0.006), 'plasticTex'); lid.position.y = H + 0.004; g.add(lid);
    if (o.cut) {
      for (var i = 0; i < 6; i++) {
        var cell = new THREE.Group();
        for (var j = 0; j < 7; j++) {
          var pl = K.mesh(K.G.box(0.002, H * 0.72, W * 0.82), j % 2 ? 'steelDark' : K.M.clone('rust', { color: 0x5a3a22 }));
          pl.position.set(-L / 2 + 0.03 + i * (L - 0.04) / 6 + j * 0.005, H * 0.42, 0); cell.add(pl);
        }
        g.add(cell);
      }
      var acid = K.mesh(K.G.box(L * 0.95, H * 0.75, W * 0.9), K.M.clone('water', { color: 0xbfd9ef, opacity: 0.25 })); acid.position.y = H * 0.4; g.add(acid);
    }
    // label panel
    var label = K.FX.canvasPanel(L * 0.8, H * 0.55, function (x, Wc, Hc) {
      x.fillStyle = '#16314f'; x.fillRect(0, 0, Wc, Hc);
      x.fillStyle = '#f5a524'; x.fillRect(0, Hc * 0.72, Wc, Hc * 0.28);
      x.fillStyle = '#fff'; x.font = 'bold ' + (Hc * 0.26) + 'px ' + FONT; x.fillText('12V ' + (o.ah || 70) + 'Ah', Wc * 0.06, Hc * 0.36);
      x.font = 'bold ' + (Hc * 0.2) + 'px ' + FONT; x.fillText(o.type || 'AGM', Wc * 0.06, Hc * 0.62);
      x.fillStyle = '#111'; x.font = 'bold ' + (Hc * 0.16) + 'px ' + FONT; x.fillText((o.cca || 760) + ' A (EN)', Wc * 0.06, Hc * 0.9);
    }, { px: 360 });
    label.position.set(0, H * 0.5, W / 2 + 0.0015); if (!o.cut) g.add(label);
    var handle = K.mesh(K.G.torus(0.05, 0.005, PI, 24), 'plasticTex'); handle.position.set(0, H + 0.012, -0.04); handle.rotation.y = 0; g.add(handle);
    var vent = K.mesh(K.G.cylX(0.004, 0.02, 10), 'plasticGrey'); vent.position.set(-L / 2 - 0.008, H - 0.01, W / 2 - 0.03); g.add(vent);
    function post(x, plus) {
      var p = K.mesh(K.G.lathe([[0.0105, 0], [0.0098, 0.012], [0.009, 0.022], [0, 0.022]], 20), leadMat(K));
      p.position.set(x, H + 0.014, W / 2 - 0.035); g.add(p);
      var mark = K.FX.canvasPanel(0.026, 0.026, function (c, w, h) { c.fillStyle = plus ? '#c62828' : '#222'; c.beginPath(); c.arc(w / 2, h / 2, w / 2, 0, PI * 2); c.fill(); c.fillStyle = '#fff'; c.font = 'bold ' + (h * 0.8) + 'px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(plus ? '+' : '−', w / 2, h * 0.53); }, { px: 64, transparent: true });
      mark.rotation.x = -PI / 2; mark.position.set(x + (plus ? -0.035 : 0.035), H + 0.0145, W / 2 - 0.035); g.add(mark);
      return new THREE.Vector3(x, H + 0.036, W / 2 - 0.035);
    }
    g.userData = { pos: post(L / 2 - 0.035, true), neg: post(-L / 2 + 0.035, false), topY: H + 0.014, L: L, W: W, H: H };
    return g;
  };

  /** Terminal clamp + cable. Clamp sits on a post at origin; cable leaves towards dir (+X default). */
  N.clamp = function (K, plus, dir) {
    var g = new THREE.Group();
    var body = K.mesh(K.G.rbox(0.032, 0.022, 0.034, 0.005), 'zinc'); body.position.y = 0.006; g.add(body);
    var bolt = K.mesh(K.G.hex(0.006, 0.02), 'steel'); bolt.rotation.z = PI / 2; bolt.position.set(0, 0.008, 0.022); g.add(bolt);
    if (plus) { var cap = K.mesh(K.G.rbox(0.045, 0.032, 0.05, 0.01), 'toolRed'); cap.position.y = 0.012; g.add(cap); }
    var dx = dir || 1;
    var cable = K.mesh(K.G.tube([[0, 0.01, 0], [dx * 0.06, 0.015, 0], [dx * 0.14, 0.0, -0.03], [dx * 0.3, -0.08, -0.08]], 0.008), plus ? K.M.clone('toolRed', { roughness: 0.6 }) : 'rubber');
    g.add(cable);
    return g;
  };

  /** Digital multimeter. Display faces +Z. draw state = { v: '12.6', unit: 'V', note, c } */
  N.meter = function (K, state) {
    var g = new THREE.Group();
    var body = K.mesh(K.G.rbox(0.085, 0.16, 0.035, 0.012), 'toolYellow'); g.add(body);
    var face = K.mesh(K.G.rbox(0.072, 0.14, 0.004, 0.004), 'plasticBlack'); face.position.z = 0.017; g.add(face);
    var disp = K.FX.canvasPanel(0.062, 0.036, function (x, W, H, st) {
      x.fillStyle = '#b7c9a3'; x.fillRect(0, 0, W, H);
      x.fillStyle = st && st.c ? st.c : '#14210f'; x.font = 'bold ' + (H * 0.62) + 'px ui-monospace, Menlo, monospace'; x.textAlign = 'right'; x.textBaseline = 'middle';
      x.fillText((st && st.v) || '0.00', W * 0.8, H * 0.52);
      x.font = 'bold ' + (H * 0.3) + 'px ' + FONT; x.textAlign = 'left'; x.fillText((st && st.unit) || 'V', W * 0.82, H * 0.55);
    }, { px: 300, state: state });
    disp.position.set(0, 0.04, 0.0195); g.add(disp);
    var dial = K.mesh(K.G.cylZ(0.02, 0.008, 28), 'plasticTex'); dial.position.set(0, -0.012, 0.021); g.add(dial);
    var ptr = K.mesh(K.G.box(0.004, 0.018, 0.003), 'plasticWhite'); ptr.position.set(0, -0.004, 0.026); g.add(ptr);
    [-0.022, 0.022].forEach(function (x, i) { var j = K.mesh(K.G.cylZ(0.006, 0.006, 16), i ? 'toolRed' : 'plasticBlack'); j.position.set(x, -0.058, 0.02); g.add(j); });
    g.userData.disp = disp;
    return g;
  };
  /** Probe lead from a meter jack (world) to a tip point (world). */
  N.lead = function (K, from, to, red) {
    var a = K.v3(from), b = K.v3(to);
    var mid = a.clone().lerp(b, 0.5); mid.y = Math.min(a.y, b.y) - 0.08;
    var g = new THREE.Group();
    g.add(K.mesh(K.G.tube([a, a.clone().lerp(mid, 0.5).add(new THREE.Vector3(0, -0.02, 0)), mid, b.clone().add(new THREE.Vector3(0, 0.07, 0))], 0.0028), red ? 'toolRed' : 'plasticBlack'));
    var probe = K.mesh(K.G.cyl(0.0055, 0.06, 14), red ? 'toolRed' : 'plasticBlack'); probe.position.copy(b).add(new THREE.Vector3(0, 0.04, 0)); g.add(probe);
    var tip = K.mesh(K.G.cyl(0.0012, 0.012, 8), 'chrome'); tip.position.copy(b).add(new THREE.Vector3(0, 0.005, 0)); g.add(tip);
    return g;
  };

  /** Smart charger with display; clamps go to given points (world). */
  N.charger = function (K, posPt, negPt, at) {
    var g = new THREE.Group();
    var body = K.mesh(K.G.rbox(0.2, 0.08, 0.13, 0.02), K.M.clone('toolBlue', { color: 0x1d3f6e })); body.position.copy(K.v3(at)); body.position.y += 0.04; g.add(body);
    var disp = K.FX.canvasPanel(0.09, 0.035, function (x, W, H, st) {
      x.fillStyle = '#0b1620'; x.fillRect(0, 0, W, H); x.fillStyle = '#30a46c'; x.font = 'bold ' + (H * 0.45) + 'px ' + FONT; x.textBaseline = 'middle';
      x.fillText((st && st.t) || 'AGM 12V', W * 0.06, H * 0.35);
      x.fillStyle = '#26384a'; x.fillRect(W * 0.06, H * 0.68, W * 0.88, H * 0.16); x.fillStyle = '#30a46c'; x.fillRect(W * 0.06, H * 0.68, W * 0.88 * ((st && st.k) || 0), H * 0.16);
    }, { px: 300, state: { k: 0 } });
    disp.position.copy(body.position).add(new THREE.Vector3(0, 0.0, 0.0655)); g.add(disp);
    [[posPt, true], [negPt, false]].forEach(function (pp) {
      var a = body.position.clone().add(new THREE.Vector3(pp[1] ? 0.05 : -0.05, 0, -0.065)), b = K.v3(pp[0]);
      var mid = a.clone().lerp(b, 0.5); mid.y = Math.max(a.y, b.y) + 0.12;
      g.add(K.mesh(K.G.tube([a, mid, b.clone().add(new THREE.Vector3(0, 0.03, 0))], 0.0045), pp[1] ? 'toolRed' : 'plasticBlack'));
      var jaw = K.mesh(K.G.rbox(0.018, 0.04, 0.012, 0.004), pp[1] ? 'toolRed' : 'plasticBlack'); jaw.position.copy(b).add(new THREE.Vector3(0, 0.02, 0)); g.add(jaw);
    });
    g.userData.disp = disp;
    return g;
  };

  /** "X-ray" car: semi-transparent body so parts inside are visible. returns {root, car, d, fade} */
  N.xray = function (K, vid, opacity) {
    var root = new THREE.Group();
    var c = K.car(vid);
    root.add(c.group);
    var fade = K.FX.fader(c.body); fade(opacity == null ? 0.28 : opacity);
    return { root: root, car: c, d: c.dims };
  };
  /** Glowing marker box (pulsing) */
  N.marker = function (K, size, color) {
    var m = K.mesh(K.G.rbox(size[0], size[1], size[2], 0.01), K.M.clone('hiAccent', { color: color || 0xf5a524, emissive: color || 0xf5a524, transparent: true, opacity: 0.85 }));
    m.userData.noShadow = true;
    return m;
  };

  N.vtype = function (vid) {
    return { 'mb-cl500-c216': 'AGM', 'volvo-xc60-b4': 'AGM', 'skoda-octavia-rs-tdi': 'STD/EFB', 'toyota-gr-yaris': 'STD', 'citroen-jumper-22hdi': 'STD/EFB' }[vid] || 'AGM/EFB';
  };

  /** Bench with a battery in a tray, clamps on posts. returns rig {root, bat, clampP, clampN, set({negOff,posOff,lift})} */
  N.bay = function (K, ctx, o) {
    o = o || {};
    var root = new THREE.Group();
    root.add(S.d3.bench(K, 1.0, 0.7, 0));
    var tray = K.mesh(K.G.rbox(0.33, 0.02, 0.23, 0.006), 'plasticTex'); tray.position.y = 0.01; root.add(tray);
    var bat = N.battery(K, { type: N.vtype(ctx.vehicle), cut: o.cut, ah: ctx.vehicle === 'citroen-jumper-22hdi' ? 95 : (ctx.vehicle === 'toyota-gr-yaris' ? 45 : 70) });
    bat.position.y = 0.02; root.add(bat);
    var hold = K.mesh(K.G.box(0.22, 0.014, 0.03), 'steelDark'); root.add(hold);
    var holdBolt = K.mesh(K.G.hex(0.008, 0.012), 'zinc'); holdBolt.position.set(0, 0.045, 0.115); root.add(holdBolt);
    var cp = N.clamp(K, true, 1), cn = N.clamp(K, false, -1);
    root.add(cp); root.add(cn);
    var bp = bat.userData.pos.clone().add(bat.position), bn = bat.userData.neg.clone().add(bat.position);
    var rig = {
      root: root, bat: bat, clampP: cp, clampN: cn, hold: hold, holdBolt: holdBolt,
      posW: function () { return bat.userData.pos.clone().add(bat.position); },
      negW: function () { return bat.userData.neg.clone().add(bat.position); },
      set: function (s) {
        s = s || {};
        var lift = s.lift || 0;
        bat.position.y = 0.02 + lift * 0.25; bat.position.z = lift * 0.05;
        cn.position.copy(bn).add(new THREE.Vector3(-(s.negOff || 0) * 0.12, -0.016 + (s.negOff || 0) * 0.06, 0)); cn.rotation.z = (s.negOff || 0) * 0.5;
        cp.position.copy(bp).add(new THREE.Vector3((s.posOff || 0) * 0.12, -0.016 + (s.posOff || 0) * 0.06, 0)); cp.rotation.z = -(s.posOff || 0) * 0.5;
        hold.position.set(0, 0.032, 0.105 + (s.holdOff || 0) * 0.12); holdBolt.position.z = 0.115 + (s.holdOff || 0) * 0.12;
        hold.visible = holdBolt.visible = !(s.holdOff > 0.9);
      }
    };
    rig.set({});
    return rig;
  };

  /* ================================================================ scenes */
  var CAM = { pos: [0.45, 0.42, 0.62], target: [0, 0.12, 0], fov: 34 };

  R('battery.overview', {
    duration: 8, camera: { pos: [0.42, 0.34, 0.5], target: [0, 0.1, 0], fov: 34 }, shadow: 0.6, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      root.add(S.d3.bench(K, 0.9, 0.6, 0));
      var b = N.battery(K, { cut: true, type: N.vtype(ctx.vehicle) }); root.add(b);
      return {
        root: root,
        update: function (t) { b.rotation.y = Math.sin(t / 8 * PI * 2) * 0.35; },
        labels: [
          { text: V('+ pól', '+ terminal'), at: function () { return b.localToWorld(b.userData.pos.clone()).add(new THREE.Vector3(0, 0.03, 0)); }, level: 'danger' },
          { text: V('− pól', '− terminal'), at: function () { return b.localToWorld(b.userData.neg.clone()).add(new THREE.Vector3(0, 0.03, 0)); } },
          { text: V('olověné desky + elektrolyt', 'lead plates + electrolyte'), at: function () { return b.localToWorld(new THREE.Vector3(0.06, 0.09, 0.09)); }, show: [2, 8] },
          { text: V('odvětrání (vodík!)', 'vent (hydrogen!)'), at: function () { return b.localToWorld(new THREE.Vector3(-0.15, 0.16, 0.06)); }, show: [4, 8], level: 'accent' }
        ],
        captions: [
          { text: V('12V baterie: 6 článků × 2,1 V = 12,6 V', '12 V battery: 6 cells × 2.1 V = 12.6 V') },
          { text: V('Typ (AGM / EFB / standard) musí odpovídat původní – hlavně u start-stop', 'Type (AGM / EFB / standard) must match the original – especially with start-stop'), show: [3, 8], level: 'info' }
        ]
      };
    }
  });

  R('battery.locate', {
    duration: 6, camera: { pos: [5.2, 2.6, 4.4], target: [0, 0.6, 0], fov: 32 }, shadow: 3.5, thumbT: 2,
    build: function (ctx, K) {
      var x = N.xray(K, ctx.vehicle), loc = N.batLoc(ctx.vehicle, x.d);
      var m = N.marker(K, [0.28, 0.18, 0.18]); m.position.fromArray(loc.p); x.root.add(m);
      var big = x.d.H > 2;
      return {
        root: x.root,
        update: function (t) { var s = 1 + 0.12 * Math.sin(t * 5); m.scale.set(s, s, s); },
        cameraPath: big ? function () { return { pos: [8, 3.6, 6.4], target: [0, 1, 0] }; } : null,
        labels: [{ text: { cs: '12V baterie: ' + loc.where.cs, en: '12 V battery: ' + loc.where.en }, at: m, level: 'accent' }],
        captions: [
          { text: V('Kde je baterie? Řiďte se uživatelskou příručkou', 'Where is the battery? Follow the owner\'s manual') },
          { text: loc.trunk ? V('Baterie v kufru – startovací body jsou v motorovém prostoru', 'Battery in the boot – jump-start points are in the engine bay') : V('Pod krytem bývá i pojistková skříň / snímač baterie', 'Under the cover there is often a fuse holder / battery sensor'), level: 'info', show: [1.5, 6] }
        ]
      };
    }
  });

  function meterScene(o) {
    return {
      duration: o.duration || 8, camera: { pos: [0.5, 0.42, 0.72], target: [0.1, 0.14, 0.05], fov: 34 }, shadow: 0.6, thumbT: o.thumbT || 4,
      build: function (ctx, K) {
        var rig = N.bay(K, ctx);
        var meter = N.meter(K, { v: '0.00' }); meter.position.set(0.3, 0.1, 0.2); meter.rotation.y = -0.35; rig.root.add(meter);
        rig.root.updateMatrixWorld(true);
        var jR = meter.localToWorld(new THREE.Vector3(0.022, -0.058, 0.02)), jB = meter.localToWorld(new THREE.Vector3(-0.022, -0.058, 0.02));
        rig.root.add(N.lead(K, jR, rig.posW(), true));
        rig.root.add(N.lead(K, jB, rig.negW(), false));
        var extra = o.extra ? o.extra(ctx, K, rig) : null;
        return {
          root: rig.root,
          update: function (t) {
            var st = o.reading(t, ctx);
            meter.userData.disp.userData.redraw(st);
            if (extra && extra.update) extra.update(t);
          },
          labels: (o.labels || []).concat([{ text: V('červený hrot na +', 'red probe on +'), at: function () { return rig.posW().add(new THREE.Vector3(0, 0.1, 0)); }, show: [0, 2.5], level: 'danger' }]),
          captions: o.captions
        };
      }
    };
  }

  N.meterScene = meterScene;

  R('battery.test', meterScene({
    duration: 10,
    reading: function (t) {
      var vals = [['12.68', '#14210f'], ['12.45', '#14210f'], ['12.20', '#6a4a00'], ['11.85', '#8a0f0f']];
      var i = Math.min(3, Math.floor(t / 2.5));
      return { v: vals[i][0], c: vals[i][1] };
    },
    captions: [
      { text: V('Motor vypnutý, vůz stál 2+ hodiny (bez povrchového náboje)', 'Engine off, car rested 2+ hours (no surface charge)') },
      { text: V('12,6–12,7 V = nabitá (100 %)', '12.6–12.7 V = charged (100 %)'), show: [0, 2.5], level: 'ok' },
      { text: V('≈ 12,4 V = cca 75 % – dobít', '≈ 12.4 V = approx. 75 % – charge it'), show: [2.5, 5], level: 'info' },
      { text: V('≈ 12,2 V = cca 50 % – nutně nabít', '≈ 12.2 V = approx. 50 % – charge now'), show: [5, 7.5], level: 'accent' },
      { text: V('pod 12,0 V = vybitá / poškozená', 'below 12.0 V = flat / damaged'), show: [7.5, 10], level: 'danger' }
    ]
  }));

  R('battery.crank', meterScene({
    duration: 8,
    reading: function (t) {
      var k = t < 2 ? 0 : (t < 5 ? 1 : 2);
      return [{ v: '12.62' }, { v: (10.2 + 0.3 * Math.sin(t * 20)).toFixed(2), c: '#14210f' }, { v: '14.15' }][k];
    },
    captions: [
      { text: V('Pomocník startuje, vy čtete napětí', 'A helper cranks, you read the voltage') },
      { text: V('Při startování nesmí klesnout pod cca 9,6–10 V', 'While cranking it must not drop below approx. 9.6–10 V'), show: [2, 5], level: 'accent' },
      { text: V('Po nastartování 13,8–14,7 V = alternátor dobíjí', 'After starting 13.8–14.7 V = alternator charging'), show: [5, 8], level: 'ok' }
    ]
  }));

  R('battery.charge', {
    duration: 10, camera: { pos: [0.55, 0.5, 0.85], target: [0.1, 0.1, 0.08], fov: 34 }, shadow: 0.7, thumbT: 6,
    build: function (ctx, K) {
      var rig = N.bay(K, ctx);
      rig.set({ negOff: 1, posOff: 0 });
      rig.root.updateMatrixWorld(true);
      var ch = N.charger(K, rig.posW(), rig.negW(), [0.3, 0, 0.26]); rig.root.add(ch);
      var puff = K.FX.puff(0xdfe6ee, 10, 0.03, 0.12); puff.group.position.set(-0.15, 0.2, 0.06); rig.root.add(puff.group);
      return {
        root: rig.root,
        update: function (t) {
          var k = K.T.seg(t, 2, 9);
          ch.userData.disp.userData.redraw({ t: S.t(V('AGM 12V · nabíjení', 'AGM 12V · charging')), k: Math.round(k * 20) / 20 });
          puff.update(t, t > 3 && t < 9);
        },
        labels: [
          { text: V('1. svorka + (červená)', '1. clamp + (red)'), at: function () { return rig.posW().add(new THREE.Vector3(0, 0.06, 0)); }, level: 'danger' },
          { text: V('2. svorka −', '2. clamp −'), at: function () { return rig.negW().add(new THREE.Vector3(0, 0.06, 0)); } },
          { text: V('3. až pak zapnout do zásuvky', '3. only then plug into the mains'), at: function () { return ch.position.clone().add(new THREE.Vector3(0.32, 0.12, 0.18)); }, level: 'accent' }
        ],
        captions: [
          { text: V('Chytrá nabíječka s režimem pro váš typ baterie (AGM / EFB / standard)', 'Smart charger with a mode for your battery type (AGM / EFB / standard)') },
          { text: V('Větrat! Při nabíjení vzniká výbušný vodík – žádné jiskry, cigarety', 'Ventilate! Charging releases explosive hydrogen – no sparks, no smoking'), level: 'danger', show: [3, 10] }
        ]
      };
    }
  });

  R('battery.memory', {
    duration: 7, camera: { pos: [0.25, 0.12, 0.55], target: [0, 0.02, 0], fov: 34 }, ground: false, shadow: 0.5, thumbT: 4,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var dash = K.mesh(K.G.rbox(0.8, 0.12, 0.35, 0.03), 'plasticTex'); dash.position.set(0, 0.1, -0.12); root.add(dash);
      var port = S.d3.obdPort(K); port.rotation.x = PI / 2; port.position.set(0, 0.04, 0.0); root.add(port);
      var plug = S.d3.obdPlug(K); plug.rotation.x = PI / 2; root.add(plug);
      var bank = K.mesh(K.G.rbox(0.07, 0.14, 0.025, 0.008), 'plasticBlack'); bank.position.set(0.18, -0.15, 0.08); root.add(bank);
      var ledM = K.M.clone('hiOk'); var led = K.mesh(K.G.cylZ(0.004, 0.003, 10), ledM); led.position.set(0.18, -0.1, 0.094); root.add(led);
      root.add(K.mesh(K.G.tube([[0.18, -0.08, 0.08], [0.12, -0.05, 0.06], [0.03, -0.06, 0.03], [0, -0.03, 0.0]], 0.003), 'rubber'));
      return {
        root: root,
        update: function (t) { var k = K.T.seg(t, 0.5, 2.5); plug.position.set(0, 0.04 - (1 - k) * 0.08 - 0.02, 0); ledM.emissiveIntensity = t > 2.5 ? 0.9 : 0.05; },
        labels: [{ text: V('udržovač paměti (OBD)', 'memory saver (OBD)'), at: bank }],
        captions: [
          { text: V('Před odpojením: kód rádia / navigace, zavřená okna, klíč mimo vůz', 'Before disconnecting: radio / nav code, windows closed, key out of the car') },
          { text: V('Udržovač paměti je volitelný – po odpojení počítejte s inicializací oken a nastavením hodin', 'A memory saver is optional – after disconnecting expect window initialisation and clock reset'), show: [2.5, 7], level: 'info' }
        ]
      };
    }
  });

  function bayScene(o) {
    return {
      duration: o.duration || 8, camera: o.camera || CAM, shadow: 0.7, thumbT: o.thumbT || 4,
      build: function (ctx, K) {
        var rig = N.bay(K, ctx);
        var tools = o.tools ? o.tools(ctx, K, rig) : {};
        return {
          root: rig.root,
          update: function (t) { rig.set(o.state(t, K.T)); if (tools.update) tools.update(t, K.T); },
          labels: o.labels ? o.labels(rig) : [],
          captions: o.captions
        };
      }
    };
  }

  function spannerOn(K, rig, which) {
    var holder = new THREE.Group();
    var sp = K.P.spanner(0.16, 0.0062); holder.add(sp);
    rig.root.add(holder);
    return {
      update: function (t, T, k, off) {
        var p = which === 'neg' ? rig.negW() : rig.posW();
        holder.position.set(p.x + 0.0, p.y - 0.01, p.z + 0.022);
        holder.visible = off < 0.05;
        holder.rotation.y = (which === 'neg' ? PI * 0.6 : PI * 0.4) + k * 0.6;
      }
    };
  }

  R('battery.disconnect', bayScene({
    duration: 9,
    state: function (t, T) { return { negOff: T.seg(t, 2.6, 3.6), posOff: T.seg(t, 6, 7) }; },
    tools: function (ctx, K, rig) {
      var a = spannerOn(K, rig, 'neg'), b = spannerOn(K, rig, 'pos');
      return { update: function (t, T) { a.update(t, T, T.seg(t, 0.8, 2.4), T.seg(t, 2.5, 2.6)); b.update(t, T, T.seg(t, 4.4, 5.8), t < 4 ? 1 : T.seg(t, 5.9, 6)); } };
    },
    labels: function (rig) {
      return [
        { text: V('1. MÍNUS (−) první', '1. MINUS (−) first'), at: function () { return rig.negW().add(new THREE.Vector3(0, 0.08, 0)); }, show: [0, 4], level: 'accent' },
        { text: V('2. pak plus (+)', '2. then plus (+)'), at: function () { return rig.posW().add(new THREE.Vector3(0, 0.08, 0)); }, show: [4, 9], level: 'danger' }
      ];
    },
    captions: [
      { text: V('Zapalování vypnuté, klíč mimo dosah, počkat až systémy „usnou“', 'Ignition off, key out of range, wait until systems go to sleep') },
      { text: V('Proč mínus první: klíč na + se dotkne karoserie = zkrat a jiskry', 'Why minus first: a spanner on + touching the body = short circuit and sparks'), show: [2.5, 9], level: 'danger' }
    ]
  }));

  R('battery.remove', bayScene({
    duration: 8, camera: { pos: [0.55, 0.55, 0.78], target: [0, 0.18, 0], fov: 34 },
    state: function (t, T) { return { negOff: 1, posOff: 1, holdOff: T.seg(t, 0.6, 2.2), lift: T.seg(t, 3, 5.5) }; },
    labels: function (rig) { return [{ text: V('držák baterie', 'hold-down clamp'), at: rig.hold, show: [0, 2.4] }, { text: V('15–25 kg!', '15–25 kg!'), at: function () { return rig.bat.position.clone().add(new THREE.Vector3(0, 0.25, 0)); }, show: [3.5, 8], level: 'accent' }]; },
    captions: [
      { text: V('Povolit držák, odpojit odvětrávací hadičku (je-li)', 'Undo the hold-down, disconnect the vent hose (if fitted)') },
      { text: V('Zvedat rovně, z nohou – baterii nenaklánět (kyselina)', 'Lift straight, with your legs – do not tilt the battery (acid)'), show: [3, 8], level: 'warning' }
    ]
  }));

  R('battery.clean', {
    duration: 6, camera: { pos: [0.3, 0.38, 0.5], target: [0.05, 0.18, 0.05], fov: 32 }, shadow: 0.5, thumbT: 3,
    build: function (ctx, K) {
      var rig = N.bay(K, ctx); rig.set({ negOff: 1, posOff: 1 });
      var brush = new THREE.Group();
      var hd = K.mesh(K.G.cyl(0.014, 0.03, 16), 'steelDark'); brush.add(hd);
      for (var i = 0; i < 24; i++) { var b = K.mesh(K.G.box(0.0015, 0.012, 0.0015), 'brass'); var a = i / 24 * PI * 2; b.position.set(Math.cos(a) * 0.011, -0.02, Math.sin(a) * 0.011); brush.add(b); }
      var h = K.mesh(K.G.cyl(0.012, 0.09, 16), 'toolRed'); h.position.y = 0.06; brush.add(h);
      rig.root.add(brush);
      var crust = K.mesh(K.G.torus(0.011, 0.004, PI * 2, 16), K.M.clone('plasticWhite', { color: 0xd8f0d0, roughness: 1 })); crust.rotation.x = PI / 2; rig.root.add(crust);
      return {
        root: rig.root,
        update: function (t) {
          var p = rig.posW(); brush.position.set(p.x, p.y + 0.02 + Math.abs(Math.sin(t * 6)) * 0.004, p.z); brush.rotation.y = t * 6;
          crust.position.set(p.x, p.y - 0.018, p.z); crust.scale.setScalar(Math.max(0.01, 1 - K.T.seg(t, 0.5, 4)));
        },
        labels: [{ text: V('bílý povlak = oxidace', 'white crust = corrosion'), at: crust, show: [0, 3], level: 'accent' }],
        captions: [
          { text: V('Póly a svorky očistit kartáčem do kovového lesku', 'Clean posts and clamps with a brush until shiny') },
          { text: V('Pak tenká vrstva vazelíny na póly – ne do kontaktu', 'Then a thin layer of petroleum jelly on the posts – not between contacts'), show: [4, 6], level: 'info' }
        ]
      };
    }
  });

  R('battery.install', bayScene({
    duration: 9,
    state: function (t, T) { return { lift: 1 - T.seg(t, 0.3, 2.3), holdOff: 1 - T.seg(t, 2.6, 3.4), posOff: 1 - T.seg(t, 4, 5), negOff: 1 - T.seg(t, 6.2, 7.2) }; },
    labels: function (rig) {
      return [
        { text: V('1. PLUS (+) první', '1. PLUS (+) first'), at: function () { return rig.posW().add(new THREE.Vector3(0, 0.08, 0)); }, show: [3.6, 6.2], level: 'danger' },
        { text: V('2. mínus (−) naposledy', '2. minus (−) last'), at: function () { return rig.negW().add(new THREE.Vector3(0, 0.08, 0)); }, show: [6, 9], level: 'accent' }
      ];
    },
    captions: [
      { text: V('Baterie musí být pevně uchycena držákem', 'The battery must be held firmly by the hold-down') },
      { text: V('Svorky dotáhnout s citem – měkké olovo se snadno poškodí', 'Tighten the clamps gently – soft lead is easily damaged'), show: [4, 9], level: 'warning' }
    ]
  }));

  R('battery.register', {
    duration: 8, camera: { pos: [0.12, 0.1, 0.48], target: [0, 0.02, 0], fov: 32 }, shadow: 0.5, ground: false, thumbT: 6,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var tool = S.d3.toolName(ctx.vehicle);
      var sc = S.d3.scanner(K, function (x, W, H, st) {
        var k = st ? st.k : 0;
        S.d3.ui(x, W, H, {
          title: tool, rows: [
            { t: S.t(V('Výměna baterie / BMS', 'Battery replacement / BMS')), bold: true },
            { t: S.t(V('Typ', 'Type')), r: N.vtype(ctx.vehicle) }, { t: S.t(V('Kapacita', 'Capacity')), r: '70 Ah' }
          ], progress: k, big: k >= 1 ? S.t(V('Uloženo ✔', 'Saved ✔')) : null, bigSize: 8
        });
      }, { state: { k: 0 } });
      root.add(sc.group);
      return {
        root: root,
        update: function (t) { sc.screen.userData.redraw({ k: Math.round(K.T.seg(t, 1, 5.5) * 10) / 10 }); },
        captions: [
          { text: V('Vozy se správou energie (BMS) potřebují novou baterii „přihlásit“', 'Cars with energy management (BMS) need the new battery to be registered') },
          { text: V('Bez registrace může alternátor baterii přebíjet a zkrátit jí život', 'Without registration the alternator may overcharge and shorten its life'), show: [3, 8], level: 'warning' }
        ]
      };
    }
  });

  R('battery.check', meterScene({
    duration: 7,
    reading: function (t) { return t < 2 ? { v: '12.71' } : { v: (14.1 + 0.05 * Math.sin(t * 3)).toFixed(2) }; },
    captions: [
      { text: V('Nastartovat a změřit napětí na pólech', 'Start the engine and measure at the posts') },
      { text: V('13,8–14,7 V = dobíjení v pořádku', '13.8–14.7 V = charging OK'), show: [2, 7], level: 'ok' },
      { text: V('Zkontrolujte okna, hodiny, rádio a kontrolky', 'Check windows, clock, radio and warning lights'), show: [4, 7], level: 'info' }
    ]
  }));
})(window.STU);
