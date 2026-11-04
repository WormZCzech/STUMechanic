/* 3D scenes: engine oil & filter change. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  var CAP = {
    'generic': V('dle příručky', 'per manual'), 'mb-cl500-c216': V('≈ 8,0 l', '≈ 8.0 L'), 'volvo-xc60-b4': V('≈ 5,2–5,9 l', '≈ 5.2–5.9 L'),
    'skoda-octavia-rs-tdi': V('≈ 4,3 l', '≈ 4.3 L'), 'toyota-gr-yaris': V('≈ 4,5 l', '≈ 4.5 L'),
    'citroen-jumper-22hdi': V('≈ 5,5–6 l (ověřit)', '≈ 5.5–6 L (verify)')
  };
  var PLUG = {
    'generic': V('dle příručky', 'per manual'), 'mb-cl500-c216': '30 Nm', 'volvo-xc60-b4': V('dle VIDA', 'per VIDA'),
    'skoda-octavia-rs-tdi': '30 Nm', 'toyota-gr-yaris': V('dle TIS', 'per TIS'),
    'citroen-jumper-22hdi': V('dle příručky', 'per manual')
  };
  var RESET = {
    'generic': V('Menu palubního počítače / diagnostika', 'Trip computer menu / scan tool'),
    'mb-cl500-c216': V('ASSYST PLUS – menu přístrojovky', 'ASSYST PLUS – cluster menu'),
    'volvo-xc60-b4': V('Diagnostika (VIDA / kompatibilní)', 'Scan tool (VIDA / compatible)'),
    'skoda-octavia-rs-tdi': V('Tlačítko 0.0/SET nebo VCDS', '0.0/SET button or VCDS'),
    'toyota-gr-yaris': V('Menu MID – údržba', 'MID menu – maintenance'),
    'citroen-jumper-22hdi': V('Přístrojovka / Diagbox (ověřit)', 'Cluster menu / Diagbox (verify)')
  };
  var E = 0.36; // engine height on the trestles (≈ installed height, car on stands)

  /* ------------------------------------------------------------- helpers */
  /** Box whose base sits at y=0 so scale.y works as a fill level. */
  function levelBox(K, w, h, d, mat) {
    var g = K.G.box(w, h, d); g.translate(0, h / 2, 0);
    return K.mesh(g, mat);
  }

  /** Engine on two trestles. Sump is shown as a cut-away with an oil level inside. */
  function engineRig(ctx, K, o) {
    o = o || {};
    var root = new THREE.Group();
    var yaris = ctx.vehicle === 'toyota-gr-yaris';
    var eng = K.P.engine({ cyl: yaris ? 3 : 4, filter: yaris ? 'spin' : 'cartridge' });
    var ud = eng.userData, len = ud.len;
    eng.position.y = E;
    root.add(eng);
    [-1, 1].forEach(function (s) {
      var leg = K.mesh(K.G.box(0.08, E, 0.36), 'steelDark'); leg.position.set(s * len * 0.28, E / 2, 0); root.add(leg);
      var foot = K.mesh(K.G.box(0.14, 0.02, 0.46), 'steelDark'); foot.position.set(s * len * 0.28, 0.01, 0); root.add(foot);
      var pad = K.mesh(K.G.box(0.1, 0.02, 0.3), 'rubber'); pad.position.set(s * len * 0.28, E + 0.01, 0); root.add(pad);
    });
    root.add(K.FX.contactShadow(len * 1.6, 0.9, 0.45));
    var oil = null;
    if (o.cutaway) {
      K.FX.fader(ud.sump)(0.32);
      oil = levelBox(K, len - 0.07, 0.12, 0.22, o.oilMat || 'oil');
      oil.position.set(-0.01, 0.025, 0); eng.add(oil);
    }
    root.userData = { eng: eng, ud: ud, len: len, oil: oil };
    return root;
  }
  function wp(obj, off) { var v = obj.getWorldPosition(new THREE.Vector3()); if (off) v.add(new THREE.Vector3(off[0], off[1], off[2])); return v; }

  /** Round gauge drawn on a canvas. st = {v:0..1, txt, zones:[[a,b,color]], unit} */
  function gaugeDraw(x, W, H, st) {
    st = st || {};
    var cx = W / 2, cy = H * 0.58, r = Math.min(W, H) * 0.4;
    x.fillStyle = '#11151c'; x.beginPath(); x.arc(cx, cy, r * 1.18, 0, PI * 2); x.fill();
    x.lineWidth = r * 0.12;
    (st.zones || []).forEach(function (z) {
      x.strokeStyle = z[2]; x.beginPath(); x.arc(cx, cy, r * 0.9, PI * 0.75 + z[0] * PI * 1.5, PI * 0.75 + z[1] * PI * 1.5); x.stroke();
    });
    x.strokeStyle = '#d5dbe3'; x.lineWidth = 3;
    for (var i = 0; i <= 10; i++) {
      var a = PI * 0.75 + i / 10 * PI * 1.5;
      x.beginPath(); x.moveTo(cx + Math.cos(a) * r * 0.72, cy + Math.sin(a) * r * 0.72); x.lineTo(cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82); x.stroke();
    }
    var na = PI * 0.75 + (st.v || 0) * PI * 1.5;
    x.strokeStyle = '#ff5a3c'; x.lineWidth = 6; x.lineCap = 'round';
    x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(na) * r * 0.78, cy + Math.sin(na) * r * 0.78); x.stroke();
    x.fillStyle = '#d5dbe3'; x.beginPath(); x.arc(cx, cy, r * 0.08, 0, PI * 2); x.fill();
    x.font = 'bold ' + Math.round(r * 0.22) + 'px system-ui, sans-serif'; x.textAlign = 'center';
    x.fillText(st.txt || '', cx, cy + r * 0.55);
    if (st.unit) { x.font = Math.round(r * 0.17) + 'px system-ui, sans-serif'; x.fillText(st.unit, cx, cy - r * 0.3); }
  }
  /** Gauge in a round bezel. returns {group, set(v, txt)} */
  function gauge(K, size, zones, unit) {
    var g = new THREE.Group();
    var bezel = K.mesh(K.G.cylZ(size * 0.56, 0.03, 48), 'blackGloss'); g.add(bezel);
    var ring = K.mesh(K.G.torus(size * 0.56, 0.008, PI * 2, 48), 'chrome'); ring.position.z = 0.015; g.add(ring);
    var p = K.FX.canvasPanel(size, size, gaugeDraw, { px: 256, state: { v: 0, zones: zones, unit: unit } });
    p.position.z = 0.0155; g.add(p);
    return { group: g, set: function (v, txt) { p.userData.redraw({ v: Math.round(v * 60) / 60, txt: txt || '', zones: zones, unit: unit }); } };
  }
  function screenDraw(lines) {
    return function (x, W, H, st) {
      x.fillStyle = '#0d1a24'; x.fillRect(0, 0, W, H);
      x.fillStyle = '#e9f2fb'; x.textAlign = 'center';
      lines(x, W, H, st || {});
    };
  }

  /* ------------------------------------------------------------- oil.warm */
  R('oil.warm', {
    duration: 7, camera: { pos: [1.7, 1.25, 1.75], target: [0.3, 0.6, 0.15], fov: 36 }, shadow: 1.6, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = engineRig(ctx, K);
      var g = gauge(K, 0.32, [[0, 0.35, '#3e8ed0'], [0.35, 0.75, '#30a46c'], [0.85, 1, '#e5484d']], '°C');
      g.group.position.set(0.85, 0.85, 0.45); g.group.rotation.y = 0.75; root.add(g.group);
      var post = K.mesh(K.G.cyl(0.012, 0.72, 12), 'steelDark'); post.position.set(0.85, 0.36, 0.42); root.add(post);
      var heat = K.FX.puff(0xffc9a8, 16, 0.12, 0.35); heat.group.position.set(-0.05, E + 0.45, -0.3); root.add(heat.group);
      return {
        root: root,
        update: function (t) {
          var k = T.seg(t, 0.4, 5.2) * (1 - T.seg(t, 6.5, 7));
          g.set(0.12 + k * 0.42, Math.round(20 + k * 55) + ' °C');
          heat.update(t, k > 0.3);
        },
        labels: [{ text: V('2–5 min volnoběh', '2–5 min idle'), at: function () { return wp(g.group, [0, -0.24, 0]); }, level: 'accent' }],
        captions: [
          { text: V('Teplý olej (ne horký) lépe vyteče', 'Warm (not hot) oil drains better') },
          { text: V('Výfuk a olej pálí – rukavice!', 'Exhaust and oil burn – gloves!'), level: 'danger', show: [2.5, 7] },
          { text: V('Nikdy nenechat běžet v zavřené garáži (CO)', 'Never run it in a closed garage (CO)'), level: 'danger', show: [4.5, 7] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ oil.capOff */
  R('oil.capOff', {
    duration: 6, camera: { pos: [0.5, 1.32, 0.62], target: [0.17, 1.03, 0.06], fov: 30 }, shadow: 1.2, thumbT: 3.5,
    build: function (ctx, K) {
      var T = K.T, root = engineRig(ctx, K), ud = root.userData.ud;
      var cap = ud.cap, base = cap.position.clone();
      var arrow = K.FX.arrow([0, 0.12, 0], [0, 0.0, 0], 0x3fa6e0, 0.008); arrow.position.copy(base).add(new THREE.Vector3(0, E + 0.01, 0));
      root.add(arrow);
      return {
        root: root,
        update: function (t) {
          var turn = T.seg(t, 0.4, 1.6), lift = T.seg(t, 1.6, 2.4), away = T.seg(t, 2.4, 3.2), back = T.seg(t, 5.2, 6);
          cap.rotation.y = turn * PI * 1.5 * (1 - back);
          cap.position.copy(base).add(new THREE.Vector3(-away * 0.18 * (1 - back), (lift * 0.06 + away * 0.02) * (1 - back), away * 0.12 * (1 - back)));
          arrow.visible = t > 3.2 && t < 5.2;
          arrow.position.y = base.y + E + 0.02 + 0.03 * Math.sin(t * 6);
        },
        labels: [
          { text: V('↺ povolit', '↺ unscrew'), at: function () { return wp(cap, [0, 0.06, 0]); }, show: [0.3, 2.4], level: 'accent' },
          { text: V('vzduch dovnitř', 'air in'), at: function () { return wp(arrow, [0, 0.15, 0]); }, show: [3.2, 5.2] }
        ],
        captions: [
          { text: V('Víčko povolit → olej vytéká rychleji (vzduch)', 'Open the cap → oil drains faster (air in)') },
          { text: V('Víčko odložte na viditelné místo, hrdlo zakryjte hadříkem', 'Keep the cap visible, cover the neck with a rag'), level: 'info', show: [3, 6] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ oil.drain */
  R('oil.drain', {
    duration: 10, camera: { pos: [1.35, 0.8, 1.5], target: [0.32, 0.42, 0], fov: 36 }, shadow: 1.6, thumbT: 5.5,
    build: function (ctx, K) {
      var T = K.T, root = engineRig(ctx, K, { cutaway: true, oilMat: 'oilOld' }), ud = root.userData.ud, len = root.userData.len;
      var plug = ud.drainPlug, pBase = plug.position.clone();
      var pan = K.P.drainPan(0.2, 0.08); pan.position.set(len / 2 + 0.3, 0, 0); root.add(pan);
      var hole = new THREE.Vector3(len / 2 + 0.012, E + 0.05, 0);
      var st = K.FX.stream(hole, [len / 2 + 0.24, E + 0.07, 0], [len / 2 + 0.3, 0.07, 0], K.M.oilOld, 0.009); root.add(st.mesh);
      var holder = new THREE.Group(); holder.position.copy(hole).add(new THREE.Vector3(0.008, 0, 0)); root.add(holder);
      var rat = K.P.ratchet(0.25, 0.011); rat.rotation.z = -PI / 2; holder.add(rat);
      var glove = K.P.glove(); glove.scale.setScalar(0.9); root.add(glove);
      var oil = root.userData.oil;
      return {
        root: root,
        update: function (t) {
          var swing = (T.seg(t, 0.3, 1.0) - T.seg(t, 1.0, 1.2)) + (T.seg(t, 1.2, 1.9) - T.seg(t, 1.9, 2.1));
          holder.rotation.x = swing * 0.9;
          holder.visible = t < 2.2;
          var out = T.seg(t, 2.3, 2.9), drop = T.seg(t, 2.9, 3.4);
          plug.position.copy(pBase).add(new THREE.Vector3(out * 0.06 + drop * 0.08, -drop * 0.25, 0));
          plug.rotation.x = T.seg(t, 2.2, 2.9) * PI * 3;
          plug.visible = t < 3.4 || t > 9.7;
          glove.visible = t > 2.1 && t < 3.3;
          glove.position.copy(hole).add(new THREE.Vector3(0.08 + out * 0.08, 0, 0.02));
          glove.rotation.set(0, -PI / 2, PI / 2);
          var flow = T.seg(t, 2.9, 3.4) * (1 - T.seg(t, 8.4, 9.2));
          st.set(flow);
          var drained = T.lin(t, 3.0, 9.0);
          oil.scale.y = Math.max(0.04, 1 - drained * 0.96);
          pan.userData.setLevel(drained * 0.85);
          if (t > 9.6) { oil.scale.y = 1; pan.userData.setLevel(0); plug.position.copy(pBase); }
        },
        labels: [
          { text: V('vypouštěcí šroub', 'drain plug'), at: function () { return hole.clone().add(new THREE.Vector3(0.02, 0.09, 0)); }, show: [0, 2.3], level: 'accent' },
          { text: V('↺ proti směru hodin', '↺ counter-clockwise'), at: function () { return hole.clone().add(new THREE.Vector3(0.05, -0.12, 0.05)); }, show: [0.3, 2.2] },
          { text: V('vana trochu stranou – proud stříká šikmo', 'pan slightly off to the side – oil shoots out at an angle'), at: function () { return wp(pan, [0, 0.12, 0]); }, show: [3.6, 9.2] }
        ],
        captions: [
          { text: V('Vypouštěcí šroub: proti směru hodinových ručiček', 'Drain plug: counter-clockwise'), show: [0, 3.4] },
          { text: V('Horký olej! Poslední závity rychle odtáhnout', 'Hot oil! Pull the plug away quickly at the end'), level: 'danger' },
          { text: V('Nechat vytékat 10–15 minut', 'Let it drain for 10–15 minutes'), show: [4, 10], level: 'info' }
        ]
      };
    }
  });

  /* ------------------------------------------------------------- oil.plug */
  R('oil.plug', {
    duration: 7, camera: { pos: [0.34, 0.16, 0.36], target: [0.05, 0.0, 0], fov: 34 }, shadow: 0.5, ground: false, thumbT: 5.2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var wall = K.mesh(K.G.rbox(0.06, 0.24, 0.3, 0.01), 'aluCast'); wall.position.set(-0.03, 0, 0); root.add(wall);
      var boss = K.mesh(K.G.cylX(0.03, 0.02, 32), 'aluCast'); boss.position.set(0.008, 0, 0); root.add(boss);
      var hole = K.mesh(K.G.cylX(0.0085, 0.022, 20), 'blackOxide'); hole.position.set(0.009, 0, 0); root.add(hole);
      var plug = new THREE.Group();
      var head = K.mesh(K.G.hex(0.012, 0.012), 'zinc'); head.rotation.z = PI / 2; head.position.x = 0.03; plug.add(head);
      var flange = K.mesh(K.G.cylX(0.014, 0.003, 24), 'zinc'); flange.position.x = 0.0225; plug.add(flange);
      var shank = K.mesh(K.G.cylX(0.008, 0.022, 20), 'steelDark'); shank.position.x = 0.01; plug.add(shank);
      for (var i = 0; i < 6; i++) { var th = K.mesh(K.G.torus(0.0079, 0.0011, PI * 2, 14), 'steelDark'); th.rotation.y = PI / 2; th.position.x = 0.002 + i * 0.0032; plug.add(th); }
      root.add(plug);
      var washer = K.mesh(K.G.latheZ([[0.0085, -0.0015], [0.0145, -0.0015], [0.0145, 0.0015], [0.0085, 0.0015]], 32), 'copper');
      washer.rotation.y = PI / 2; root.add(washer);
      var wGlow = K.FX.glow(washer, 0x30a46c);
      var holder = new THREE.Group(); holder.position.set(0.036, 0, 0); root.add(holder);
      var tw = K.P.torqueWrench(0.32); tw.rotation.z = -PI / 2; tw.position.x = 0.0; holder.add(tw);
      var tq = PLUG[ctx.vehicle] || PLUG.generic;
      return {
        root: root,
        update: function (t) {
          var wIn = T.seg(t, 0.3, 1.3), pIn = T.seg(t, 1.6, 3.4);
          var px = 0.09 - pIn * 0.07;
          plug.position.x = px + (1 - wIn) * 0.0;
          washer.position.x = px + 0.021 + (1 - wIn) * 0.08;
          washer.visible = true;
          wGlow(T.pulse(t, 0.3, 1.6));
          plug.rotation.x = pIn * PI * 6;
          holder.visible = t > 3.6 && t < 6.6;
          holder.position.x = px + 0.03;
          holder.rotation.x = -0.4 + T.seg(t, 3.9, 4.9) * 0.6;
          if (t > 6.6) { plug.position.x = 0.09; }
        },
        labels: [
          { text: V('nové těsnění', 'new seal'), at: function () { return washer.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.03, 0)); }, show: [0.3, 3.4], level: 'ok' },
          { text: { cs: 'klik! ' + S.t(tq), en: 'click! ' + S.t(tq) }, at: [0.05, -0.08, 0.04], show: [4.9, 6.6], level: 'accent' }
        ],
        captions: [
          { text: V('Vždy nové těsnění (podložka) šroubu', 'Always a new plug seal (washer)') },
          { text: V('Nejdřív rukou, pak momentovým klíčem', 'By hand first, then a torque wrench'), show: [1.6, 7] },
          { text: V('Nepřetahovat – strhnete závit ve vaně!', 'Do not over-tighten – you will strip the pan thread!'), level: 'danger', show: [3.6, 7] }
        ]
      };
    }
  });

  /* ------------------------------------------------------ oil.filterCart */
  R('oil.filterCart', {
    duration: 9, camera: { pos: [0.5, 0.5, 0.62], target: [0.05, 0.21, 0], fov: 36 }, shadow: 0.6, thumbT: 3.2,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var block = K.mesh(K.G.rbox(0.5, 0.06, 0.32, 0.01), 'castIron'); block.position.y = 0.03; root.add(block);
      var housing = K.mesh(K.G.lathe([[0.045, 0], [0.05, 0.01], [0.05, 0.13], [0.046, 0.135], [0.041, 0.135], [0.041, 0.02], [0, 0.02]], 48), 'plasticBlack');
      housing.position.y = 0.06; root.add(housing);
      var outlet = K.mesh(K.G.cylX(0.016, 0.08, 20), 'plasticBlack'); outlet.position.set(0.07, 0.11, 0); root.add(outlet);
      var cap = new THREE.Group();
      var cb = K.mesh(K.G.lathe([[0, 0.03], [0.052, 0.03], [0.054, 0.0], [0.04, 0.0]], 48), 'plasticBlack'); cap.add(cb);
      for (var i = 0; i < 12; i++) { var rib = K.mesh(K.G.box(0.006, 0.026, 0.008), 'plasticBlack'); var a = i / 12 * PI * 2; rib.position.set(Math.cos(a) * 0.054, 0.015, Math.sin(a) * 0.054); rib.rotation.y = -a; cap.add(rib); }
      var hex = K.mesh(K.G.hex(0.019, 0.016), 'plasticBlack'); hex.position.y = 0.038; cap.add(hex);
      var oring = K.mesh(K.G.torus(0.046, 0.0035, PI * 2, 40), 'rubber'); oring.rotation.x = PI / 2; oring.position.y = 0.002; cap.add(oring);
      var oGlow = K.FX.glow(oring, 0x30a46c);
      cap.position.y = 0.195; root.add(cap);
      var oldC = K.P.filterCartridge(true, 0.11); root.add(oldC);
      var newC = K.P.filterCartridge(false, 0.11); root.add(newC);
      var fadeOld = K.FX.fader(oldC), fadeNew = K.FX.fader(newC);
      var ccw = K.FX.rotArrow(0.075, 'ccw', 0xf5a524, 220, 0.005); ccw.rotation.x = -PI / 2; ccw.position.y = 0.26; root.add(ccw);
      return {
        root: root,
        update: function (t) {
          var un = T.seg(t, 0.3, 1.5), up = T.seg(t, 1.5, 2.4), side = T.seg(t, 2.5, 3.3), nIn = T.seg(t, 4.6, 5.6), down = T.seg(t, 5.8, 6.6), tight = T.seg(t, 6.6, 7.6);
          var capUp = (up - down) * 0.16;
          cap.position.y = 0.195 + capUp + un * 0.01 - tight * 0.01;
          cap.rotation.y = un * PI * 2 - tight * PI * 2;
          oldC.position.set(side * 0.22, 0.13 + up * 0.16, 0);
          fadeOld(1 - T.seg(t, 2.8, 3.4));
          newC.position.set(-0.22 * (1 - nIn), 0.13 + 0.16 * (1 - down), 0);
          fadeNew(T.seg(t, 4.4, 4.8));
          oGlow(T.pulse(t, 3.6, 4.6) + T.pulse(t, 4.6, 5.6) * 0.5);
          ccw.visible = t < 1.6;
          if (t > 8.6) { fadeNew(0); fadeOld(1); oldC.position.set(0, 0.13, 0); }
        },
        labels: [
          { text: V('stará vložka', 'old element'), at: function () { return oldC.position.clone().add(new THREE.Vector3(0, 0.09, 0)); }, show: [1.5, 3.2] },
          { text: V('nový O-kroužek namazat olejem', 'oil the new O-ring'), at: function () { return cap.position.clone().add(new THREE.Vector3(0.0, -0.02, 0.05)); }, show: [3.5, 5.6], level: 'ok' },
          { text: V('↻ momentem', '↻ to torque'), at: function () { return cap.position.clone().add(new THREE.Vector3(0, 0.07, 0)); }, show: [6.6, 8.4], level: 'accent' }
        ],
        captions: [
          { text: V('Víko filtru povolit, vložku vyměnit', 'Unscrew the housing cap, swap the element') },
          { text: V('Plastové víko nepřetahovat – praskne', 'Do not over-tighten the plastic cap – it cracks'), level: 'danger', show: [6.2, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- oil.filterSpin */
  R('oil.filterSpin', {
    duration: 9, camera: { pos: [0.34, 0.4, 0.42], target: [0.0, 0.4, 0], fov: 38 }, shadow: 0.7, thumbT: 6.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var block = K.mesh(K.G.rbox(0.5, 0.12, 0.34, 0.015), 'aluCast'); block.position.y = 0.56; root.add(block);
      var boss = K.mesh(K.G.cyl(0.045, 0.012, 40), 'aluCast'); boss.position.y = 0.494; root.add(boss);
      var nip = K.mesh(K.G.cyl(0.011, 0.02, 20), 'steel'); nip.position.y = 0.48; root.add(nip);
      var oldF = K.P.filterCan(0x1f4fa8); var newF = K.P.filterCan(0xc8262b);
      root.add(oldF); root.add(newF);
      var fadeOld = K.FX.fader(oldF), fadeNew = K.FX.fader(newF);
      var gGlow = K.FX.glow(newF.userData.gasket, 0xf5a524);
      var stuck = K.mesh(K.G.torus(0.03, 0.0035, PI * 2, 32), 'rubber'); stuck.rotation.x = PI / 2; stuck.position.y = 0.486; root.add(stuck);
      var stuckGlow = K.FX.glow(stuck, 0xe5484d);
      var ccw = K.FX.rotArrow(0.07, 'ccw', 0xf5a524, 220, 0.005); ccw.rotation.x = PI / 2; ccw.position.y = 0.36; root.add(ccw);
      var pan = K.P.drainPan(0.16, 0.06); pan.position.y = 0; root.add(pan);
      return {
        root: root,
        update: function (t) {
          var un = T.seg(t, 0.3, 1.8), away = T.seg(t, 1.8, 2.6), nIn = T.seg(t, 4.2, 5.0), on = T.seg(t, 5.2, 6.8);
          oldF.position.set(away * 0.25, 0.488 - un * 0.04 - away * 0.05, 0); oldF.rotation.y = -un * PI * 3;
          fadeOld(1 - T.seg(t, 2.2, 2.7));
          stuck.visible = t > 2.4 && t < 3.6;
          stuckGlow(stuck.visible ? 0.5 + 0.5 * Math.sin(t * 9) : 0);
          newF.position.set(-0.25 * (1 - nIn), 0.448 + on * 0.04, 0); newF.rotation.y = on * PI * 3;
          fadeNew(T.seg(t, 3.8, 4.2));
          gGlow(T.pulse(t, 3.7, 5.0));
          ccw.visible = t < 1.8;
          if (t > 8.6) { fadeOld(1); fadeNew(0); oldF.position.set(0, 0.488, 0); oldF.rotation.y = 0; }
        },
        labels: [
          { text: V('staré těsnění nesmí zůstat na motoru!', 'old gasket must not stay on the engine!'), at: [0, 0.5, 0.06], show: [2.4, 3.6], level: 'danger' },
          { text: V('těsnění namazat olejem', 'oil the gasket'), at: function () { return newF.position.clone().add(new THREE.Vector3(0, 0.02, 0.05)); }, show: [3.7, 5.1], level: 'ok' },
          { text: V('rukou + ¾ otáčky', 'hand tight + ¾ turn'), at: function () { return newF.position.clone().add(new THREE.Vector3(0, -0.13, 0)); }, show: [5.2, 8.4], level: 'accent' }
        ],
        captions: [
          { text: V('Našroubovací filtr: povolit klíčem na filtr, pod něj misku', 'Spin-on filter: loosen with a filter wrench, tray underneath') },
          { text: V('Zkontrolujte, že staré těsnění nezůstalo na motoru!', 'Make sure the old gasket did not stay on the engine!'), level: 'danger', show: [2.4, 9] }
        ]
      };
    }
  });

  /* -------------------------------------------------------------- oil.fill */
  R('oil.fill', {
    duration: 9, camera: { pos: [1.45, 1.5, 1.75], target: [0.15, 0.85, 0], fov: 36 }, shadow: 1.6, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = engineRig(ctx, K, { cutaway: true }), ud = root.userData.ud;
      ud.cap.visible = false;
      var neck = ud.cap.position.clone().add(new THREE.Vector3(0, E, 0));
      var funnel = K.P.funnel(); funnel.position.copy(neck).add(new THREE.Vector3(0, 0.1, 0)); root.add(funnel);
      var top = funnel.position.clone().add(new THREE.Vector3(0, 0.04, 0));
      var can = K.P.oilCan(0x1d1f22);
      var tilt = 2.0;
      var sx = 0.06 * Math.cos(tilt) - 0.31 * Math.sin(tilt), sy = 0.06 * Math.sin(tilt) + 0.31 * Math.cos(tilt);
      var canOrigin = new THREE.Vector3(top.x - sx + 0.02, top.y + 0.12 - sy, 0);
      can.position.copy(canOrigin); root.add(can);
      var spout = new THREE.Vector3(canOrigin.x + sx, canOrigin.y + sy, 0);
      var st = K.FX.stream(spout, [spout.x - 0.01, spout.y + 0.01, 0], top, K.M.oil, 0.007); root.add(st.mesh);
      var oil = root.userData.oil;
      var cap = ud.cap.clone(); cap.visible = true; cap.position.copy(neck).add(new THREE.Vector3(-0.18, 0.02, 0.0)); root.add(cap);
      var capTxt = CAP[ctx.vehicle] || CAP.generic;
      return {
        root: root,
        update: function (t) {
          var tl = T.seg(t, 0.3, 1.2) * (1 - T.seg(t, 7.6, 8.4));
          can.rotation.z = tl * tilt;
          can.position.copy(canOrigin).add(new THREE.Vector3(0, (1 - tl) * 0.05, 0));
          st.set(T.seg(t, 1.1, 1.5) * (1 - T.seg(t, 7.2, 7.7)));
          oil.scale.y = 0.06 + T.lin(t, 1.4, 7.4) * 0.84;
          if (t > 8.6) oil.scale.y = 0.06;
        },
        labels: [
          { text: { cs: 'Objem ' + S.t(capTxt), en: 'Capacity ' + S.t(capTxt) }, at: function () { return wp(oil, [0, 0.14, 0.15]); }, level: 'accent' },
          { text: V('víčko – na viditelném místě', 'cap – somewhere visible'), at: function () { return cap.position.clone().add(new THREE.Vector3(0, 0.05, 0)); }, show: [0, 9] }
        ],
        captions: [
          { text: V('Pomalu přes trychtýř, cca 90 % objemu', 'Slowly through a funnel, about 90 % of the capacity') },
          { text: V('Pak počkat 2–3 min a měřit – nikdy nad MAX', 'Then wait 2–3 min and check – never above MAX'), level: 'info', show: [4, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------- oil.level */
  R('oil.level', {
    duration: 7, camera: { pos: [0.1, 0.24, 0.3], target: [0, 0.2, 0], fov: 34 }, shadow: 0.6, ground: false, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      if (ctx.vehicle === 'volvo-xc60-b4') {
        var dash = K.mesh(K.G.rbox(0.42, 0.3, 0.04, 0.02), 'plasticTex'); dash.position.set(0, 0.2, -0.33); root.add(dash);
        var title = S.t(V('Hladina oleje', 'Oil level'));
        var sub = S.t(V('Centrální displej (bez měrky)', 'Centre display (no dipstick)'));
        var scr = K.FX.canvasPanel(0.36, 0.25, screenDraw(function (x, W, H, st) {
          x.font = 'bold 34px system-ui'; x.fillText(title, W / 2, 56);
          for (var i = 0; i < 5; i++) {
            x.fillStyle = i < (st.n || 0) ? '#30a46c' : '#2c3a48';
            var h = 30 + i * 24; x.fillRect(W / 2 - 130 + i * 56, 250 - h, 40, h);
          }
          x.fillStyle = '#9fb3c8'; x.font = '22px system-ui'; x.fillText(sub, W / 2, 300);
        }), { px: 512, state: { n: 0 } });
        scr.position.set(0, 0.2, -0.3); root.add(scr);
        return {
          root: root,
          update: function (t) { scr.userData.redraw({ n: Math.min(4, Math.floor(T.lin(t, 0.5, 3) * 5)) }); },
          cameraPath: function () { return { pos: [0.08, 0.24, 0.32], target: [0, 0.2, -0.3] }; },
          captions: [
            { text: V('Volvo: hladina se měří elektronicky', 'Volvo: the level is measured electronically') },
            { text: V('Vůz na rovině, motor teplý, po vypnutí vyčkat – ověřte postup', 'Car level, engine warm, wait after switch-off – verify procedure'), level: 'info', show: [2, 7] }
          ]
        };
      }
      var dip = new THREE.Group();
      var strip = K.mesh(K.G.box(0.012, 0.42, 0.003), 'steel'); strip.position.y = 0.21; dip.add(strip);
      var loop = K.mesh(K.G.torus(0.028, 0.007, PI * 2, 24), 'toolYellow'); loop.position.y = 0.45; dip.add(loop);
      var grip = K.mesh(K.G.cyl(0.01, 0.05, 16), 'toolYellow'); grip.position.y = 0.41; dip.add(grip);
      var zone = K.mesh(K.G.box(0.0125, 0.05, 0.0034), 'steelDark'); zone.position.y = 0.075; dip.add(zone);
      [0.05, 0.1].forEach(function (y) { var n = K.mesh(K.G.box(0.02, 0.003, 0.004), 'blackOxide'); n.position.y = y; dip.add(n); });
      var film = levelBox(K, 0.0128, 0.09, 0.0036, K.M.oil); film.position.y = 0.0; dip.add(film);
      root.add(dip);
      var tube = K.mesh(K.G.cyl(0.012, 0.25, 16), 'steelDark'); tube.position.y = 0.0; root.add(tube);
      var rag = K.mesh(K.G.rbox(0.08, 0.05, 0.02, 0.01), 'fabric'); root.add(rag);
      return {
        root: root,
        update: function (t) {
          var out1 = T.seg(t, 0.2, 1.0), wipe = T.between(t, 1.0, 2.0), back = T.seg(t, 2.0, 2.6), out2 = T.seg(t, 3.0, 3.8);
          var up = out1 - back + out2;
          dip.position.y = 0.06 + up * 0.13;
          film.visible = !(t > 1.6 && t < 3.6);
          film.scale.y = t < 1.6 ? 0.85 : 0.85 * T.seg(t, 3.6, 4.2) + 0.001;
          rag.visible = wipe;
          rag.position.set(0, 0.2 - (t - 1) * 0.12, 0.01);
        },
        labels: [
          { text: 'MAX', at: function () { return dip.localToWorld(new THREE.Vector3(0.012, 0.1, 0)); }, level: 'ok' },
          { text: 'MIN', at: function () { return dip.localToWorld(new THREE.Vector3(0.012, 0.05, 0)); }, level: 'danger' }
        ],
        captions: [
          { text: V('Vytáhnout, otřít, zasunout, znovu vytáhnout', 'Pull, wipe, re-insert, pull again') },
          { text: V('Hladina mezi MIN a MAX – nikdy nad MAX', 'Level between MIN and MAX – never above MAX'), level: 'info', show: [3.8, 7] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------- oil.check */
  R('oil.check', {
    duration: 9, camera: { pos: [1.3, 0.9, 1.5], target: [0.05, 0.5, 0], fov: 38 }, shadow: 1.6, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = engineRig(ctx, K), ud = root.userData.ud;
      var cluster = new THREE.Group();
      var body = K.mesh(K.G.rbox(0.36, 0.2, 0.06, 0.03), 'plasticTex'); cluster.add(body);
      var lampTxt = S.t(V('tlak oleje', 'oil pressure'));
      var scr = K.FX.canvasPanel(0.32, 0.16, function (x, W, H, st) {
        x.fillStyle = '#0b0e12'; x.fillRect(0, 0, W, H);
        x.fillStyle = st && st.on ? '#ff2b2b' : '#2b2f36';
        x.beginPath(); x.moveTo(W * 0.3, H * 0.6); x.lineTo(W * 0.5, H * 0.6); x.lineTo(W * 0.56, H * 0.48); x.lineTo(W * 0.68, H * 0.52); x.lineTo(W * 0.72, H * 0.44);
        x.lineTo(W * 0.74, H * 0.5); x.lineTo(W * 0.58, H * 0.7); x.lineTo(W * 0.3, H * 0.7); x.closePath(); x.fill();
        x.fillRect(W * 0.33, H * 0.5, W * 0.08, H * 0.05);
        x.beginPath(); x.arc(W * 0.77, H * 0.62, 8, 0, PI * 2); x.fill();
        x.fillStyle = '#9fb3c8'; x.font = '26px system-ui'; x.textAlign = 'center'; x.fillText(lampTxt, W / 2, H * 0.9);
      }, { px: 512, state: { on: true } });
      scr.position.z = 0.031; cluster.add(scr);
      cluster.position.set(-0.55, 1.05, 0.35); cluster.rotation.y = 0.5; root.add(cluster);
      var mag = new THREE.Group();
      var ring = K.mesh(K.G.torus(0.05, 0.007, PI * 2, 32), 'plasticBlack'); mag.add(ring);
      var lens = K.mesh(K.G.cylZ(0.048, 0.004, 32), 'glassClear'); mag.add(lens);
      var hdl = K.mesh(K.G.cyl(0.009, 0.12, 12), 'plasticBlack'); hdl.position.set(0.05, -0.08, 0); hdl.rotation.z = 0.6; mag.add(hdl);
      root.add(mag);
      var plugW = wp(ud.drainPlug, [0.06, 0, 0.06]), filtW = wp(ud.filter, [0.04, 0.06, 0.08]);
      return {
        root: root,
        update: function (t) {
          scr.userData.redraw({ on: t < 1.8 });
          var a = T.seg(t, 2.5, 3.5), b = T.seg(t, 4.8, 5.8);
          mag.position.copy(plugW).lerp(filtW, b);
          mag.position.z += 0.08;
          mag.visible = t > 2.4;
          mag.rotation.y = 0.4;
          mag.scale.setScalar(0.6 + a * 0.4);
        },
        labels: [
          { text: V('✔ zhasla do 3 s', '✔ off within 3 s'), at: function () { return wp(cluster, [0, 0.14, 0]); }, show: [1.8, 9], level: 'ok' },
          { text: V('✔ nekape', '✔ no drip'), at: function () { return plugW.clone().add(new THREE.Vector3(0, 0.1, 0)); }, show: [3.6, 9], level: 'ok' },
          { text: V('✔ filtr suchý', '✔ filter dry'), at: function () { return filtW.clone().add(new THREE.Vector3(0, 0.1, 0)); }, show: [5.9, 9], level: 'ok' }
        ],
        captions: [
          { text: V('Víčko zašroubované? Nastartovat na 30–60 s', 'Cap on? Start and run for 30–60 s') },
          { text: V('Kontrolka nezhasne do 3 s → IHNED vypnout!', 'Light stays on after 3 s → switch off AT ONCE!'), level: 'danger' },
          { text: V('Vypnout, 5 min počkat, změřit hladinu', 'Switch off, wait 5 min, check the level'), level: 'info', show: [6.5, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------- oil.reset */
  R('oil.reset', {
    duration: 7, camera: { pos: [0.25, 0.42, 0.85], target: [0, 0.32, 0], fov: 34 }, shadow: 1, thumbT: 5.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var hood = K.mesh(K.G.rbox(0.62, 0.3, 0.12, 0.05), 'plasticTex'); hood.position.set(0, 0.34, -0.05); root.add(hood);
      var title = S.t(V('Servis: výměna oleje', 'Service: oil change')), done = S.t(V('Interval vynulován ✔', 'Interval reset ✔'));
      var scr = K.FX.canvasPanel(0.5, 0.22, screenDraw(function (x, W, H, st) {
        x.font = 'bold 40px system-ui'; x.fillText(title, W / 2, 70);
        x.fillStyle = '#2c3a48'; x.fillRect(60, 110, W - 120, 26);
        x.fillStyle = '#30a46c'; x.fillRect(60, 110, (W - 120) * (st.p || 0), 26);
        if (st.done) { x.fillStyle = '#5be09a'; x.font = 'bold 36px system-ui'; x.fillText(done, W / 2, 190); }
      }), { px: 512, state: { p: 0 } });
      scr.position.set(0, 0.35, 0.012); root.add(scr);
      var pan = K.P.drainPan(0.18, 0.07); pan.position.set(-0.45, 0, 0.35); pan.userData.setLevel(0.8); root.add(pan);
      var can = K.P.oilCan(0x1d1f22); can.position.set(-0.15, 0, 0.42); can.rotation.y = 0.4; root.add(can);
      return {
        root: root,
        update: function (t) { var p = T.lin(t, 0.8, 4); scr.userData.redraw({ p: Math.round(p * 20) / 20, done: t > 4.2 }); },
        labels: [{ text: RESET[ctx.vehicle] || RESET.generic, at: [0, 0.16, 0.05], level: 'accent' }],
        captions: [
          { text: V('Vynulovat servisní interval, zapsat km a olej', 'Reset the service interval, note mileage and oil') },
          { text: V('Starý olej → sběrný dvůr / servis', 'Old oil → recycling centre / garage'), level: 'info', show: [3, 7] }
        ]
      };
    }
  });
})(window.STU);
