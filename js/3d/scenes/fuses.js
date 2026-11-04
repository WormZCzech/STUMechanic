/* 3D scenes: fuses & relays. Uses S.n1 (battery.js) and S.d3 (diag.js) at build time. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  var COL = { 5: 0xd2b48c, 7.5: 0x7a4a2a, 10: 0xd02a2a, 15: 0x2a62d0, 20: 0xf0c419, 25: 0xe8e8e8, 30: 0x2fa84f };
  var AMPS = [5, 7.5, 10, 15, 20, 25, 30];

  /** Mini blade fuse (ATM). Origin at bottom of the blades, blades down, top up. amps, blown. */
  function fuse(K, amps, blown) {
    var g = new THREE.Group();
    var body = K.mesh(K.G.rbox(0.0109, 0.0085, 0.0038, 0.0008), K.M.clone('glassClear', { color: COL[amps] || 0xd02a2a, opacity: 0.85, transparent: true }));
    body.position.y = 0.0105; g.add(body);
    [-1, 1].forEach(function (s) {
      var blade = K.mesh(K.G.box(0.0028, 0.0085, 0.0006), 'zinc'); blade.position.set(s * 0.0035, 0.004, 0); g.add(blade);
      var tp = K.mesh(K.G.box(0.0016, 0.0012, 0.0012), 'zinc'); tp.position.set(s * 0.0035, 0.0152, 0); g.add(tp);
    });
    // filament
    var pts = blown ? [[[-0.0035, 0.009, 0], [-0.0012, 0.0115, 0]], [[0.0012, 0.0118, 0], [0.0035, 0.009, 0]]] : [[[-0.0035, 0.009, 0], [-0.001, 0.0125, 0], [0.001, 0.0125, 0], [0.0035, 0.009, 0]]];
    pts.forEach(function (p) { g.add(K.mesh(K.G.tube(p, 0.0003, false, 12, 6), 'zinc')); });
    if (blown) { var soot = K.mesh(K.G.sphere(0.0012, 8), 'blackOxide'); soot.position.set(0, 0.0117, 0); g.add(soot); }
    g.userData.amps = amps;
    return g;
  }
  function relay(K) {
    var g = new THREE.Group();
    var b = K.mesh(K.G.rbox(0.028, 0.025, 0.028, 0.002), 'plasticBlack'); b.position.y = 0.0125; g.add(b);
    var lbl = K.FX.canvasPanel(0.022, 0.012, function (x, W, H) { x.fillStyle = '#1c1c1c'; x.fillRect(0, 0, W, H); x.fillStyle = '#ddd'; x.font = 'bold ' + (H * 0.45) + 'px ' + FONT; x.fillText('12V 40A', W * 0.08, H * 0.6); }, { px: 128 });
    lbl.position.set(0, 0.016, 0.0141); g.add(lbl);
    return g;
  }
  /** Fuse box: grid of fuses + relays, top face at y = 0. returns {group, slots:[{fuse, pos}], relays} */
  function fusebox(K, blownIndex) {
    var g = new THREE.Group();
    var base = K.mesh(K.G.rbox(0.16, 0.03, 0.11, 0.006), 'plasticTex'); base.position.y = -0.015; g.add(base);
    var slots = [];
    for (var r = 0; r < 3; r++) for (var c = 0; c < 8; c++) {
      var i = r * 8 + c, amps = AMPS[(i * 3) % AMPS.length];
      var f = fuse(K, amps, i === blownIndex);
      f.position.set(-0.063 + c * 0.0145, -0.008, -0.03 + r * 0.022); g.add(f);
      var num = K.FX.canvasPanel(0.008, 0.005, (function (n) { return function (x, W, H) { x.fillStyle = '#ddd'; x.font = 'bold ' + (H * 0.8) + 'px ' + FONT; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(n), W / 2, H / 2); }; })(i + 1), { px: 64, transparent: true });
      num.rotation.x = -PI / 2; num.position.set(f.position.x, 0.0005, f.position.z + 0.0085); g.add(num);
      slots.push({ fuse: f, pos: f.position.clone() });
    }
    var relays = [];
    [0, 1].forEach(function (k) { var rl = relay(K); rl.position.set(-0.04 + k * 0.035, -0.008, 0.042); g.add(rl); relays.push(rl); });
    return { group: g, slots: slots, relays: relays };
  }

  var CAMB = { pos: [0.1, 0.2, 0.2], target: [0, 0.0, 0.0], fov: 32 };

  R('fuses.overview', {
    duration: 6, camera: CAMB, ground: false, shadow: 0.25, thumbT: 2,
    build: function (ctx, K) {
      var root = new THREE.Group(), fb = fusebox(K, 10); root.add(fb.group);
      var glow = K.mesh(K.G.torus(0.009, 0.0012, PI * 2, 24), K.M.clone('hiDanger')); glow.rotation.x = PI / 2; glow.position.copy(fb.slots[10].pos).add(new THREE.Vector3(0, 0.02, 0)); root.add(glow);
      return {
        root: root,
        update: function (t) { glow.scale.setScalar(1 + 0.25 * Math.sin(t * 5)); fb.group.rotation.y = Math.sin(t / 6 * PI * 2) * 0.25; },
        labels: [
          { text: V('přepálená pojistka', 'blown fuse'), at: glow, level: 'danger' },
          { text: V('relé', 'relays'), at: function () { return fb.relays[0].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.015, 0.03, 0)); } }
        ],
        captions: [
          { text: V('Jedna funkce nefunguje (zásuvka, stěrače, světlo)? Nejdřív pojistka', 'One function dead (socket, wipers, a light)? Check the fuse first') },
          { text: V('Pojistka chrání kabel před požárem – sama nic „neopraví“', 'A fuse protects the wire from fire – it does not fix anything itself'), show: [2.5, 6], level: 'info' }
        ]
      };
    }
  });

  var BOXES = {
    'generic': [[V('palubní deska / pod volantem', 'dashboard / under the steering wheel'), 'dash'], [V('motorový prostor', 'engine bay'), 'bay']],
    'mb-cl500-c216': [[V('motorový prostor (SAM)', 'engine bay (SAM)'), 'bay'], [V('kufr (zadní SAM)', 'boot (rear SAM)'), 'trunk'], [V('bok palubní desky', 'dashboard side'), 'dash']],
    'volvo-xc60-b4': [[V('motorový prostor', 'engine bay'), 'bay'], [V('pod přihrádkou', 'under the glovebox'), 'glove'], [V('kufr', 'boot'), 'trunk']],
    'skoda-octavia-rs-tdi': [[V('bok palubní desky vlevo', 'left end of the dashboard'), 'dash'], [V('na baterii / motorový prostor', 'on the battery / engine bay'), 'bay']],
    'toyota-gr-yaris': [[V('motorový prostor', 'engine bay'), 'bay'], [V('pod palubní deskou u řidiče', 'under the dash, driver side'), 'dash']],
    'citroen-jumper-22hdi': [[V('pod palubní deskou u řidiče', 'under the dash, driver side'), 'dash'], [V('motorový prostor u baterie', 'engine bay near battery'), 'bay']]
  };
  function boxPos(kind, d, s) {
    var gw = d.W / 2;
    switch (kind) {
      case 'bay': return [d.front - 0.55, d.hoodF - 0.2, -0.45];
      case 'trunk': return [d.rear + 0.35, d.clr + 0.45, -gw + 0.25];
      case 'glove': return [s.ws0 - d.L / 2 - 0.45, d.belt - 0.25, -0.45];
      default: return [s.ws0 - d.L / 2 - 0.45, d.belt - 0.2, gw - 0.2];
    }
  }

  R('fuses.locate', {
    duration: 6, camera: { pos: [5.2, 2.8, 4.4], target: [0, 0.6, 0], fov: 32 }, shadow: 3.5, thumbT: 2,
    build: function (ctx, K) {
      var x = S.n1.xray(K, ctx.vehicle), sp = K.carSpec(ctx.vehicle), list = BOXES[ctx.vehicle] || BOXES.generic;
      var marks = list.map(function (b) { var m = S.n1.marker(K, [0.28, 0.14, 0.22], 0xf5a524); m.position.fromArray(boxPos(b[1], x.d, sp)); x.root.add(m); return m; });
      var big = x.d.H > 2;
      return {
        root: x.root,
        update: function (t) { marks.forEach(function (m, i) { m.scale.setScalar(1 + 0.15 * Math.sin(t * 5 + i)); }); },
        cameraPath: big ? function () { return { pos: [8, 3.8, 6.4], target: [0, 1, 0] }; } : null,
        labels: list.map(function (b, i) { return { text: b[0], at: marks[i], level: 'accent' }; }),
        captions: [
          { text: V('Pojistkových skříní bývá víc – přesná místa a schéma v uživatelské příručce', 'There are usually several fuse boxes – exact locations and the diagram are in the owner\'s manual') },
          { text: V('Umístění pro váš vůz je orientační – ověřte', 'Locations for your car are approximate – verify'), show: [2, 6], level: 'info' }
        ]
      };
    }
  });

  R('fuses.diagram', {
    duration: 6, camera: { pos: [0, 0.02, 0.42], target: [0, 0, 0], fov: 32 }, ground: false, shadow: 0.4, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var lid = K.mesh(K.G.rbox(0.27, 0.19, 0.01, 0.01), 'plasticTex'); lid.position.z = -0.006; root.add(lid);
      var rows = [[1, 10, V('Rádio', 'Radio')], [2, 15, V('Zásuvka 12 V', '12 V socket')], [3, 20, V('Stěrače', 'Wipers')], [4, 7.5, V('Osvětlení SPZ', 'Plate light')], [5, 10, V('Brzdová světla', 'Brake lights')], [6, 30, V('Ventilátor', 'Blower')]];
      var panel = K.FX.canvasPanel(0.25, 0.17, function (x, W, H, st) {
        x.fillStyle = '#f2f2ee'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#222'; x.font = 'bold ' + (H * 0.08) + 'px ' + FONT; x.fillText(S.t(V('Č.  A   Funkce', 'No. A   Function')), W * 0.05, H * 0.1);
        rows.forEach(function (r, i) {
          var y = H * (0.2 + i * 0.13);
          if (st && st.hi === i) { x.fillStyle = '#ffd36b'; x.fillRect(W * 0.03, y - H * 0.06, W * 0.94, H * 0.12); }
          x.fillStyle = '#' + (COL[r[1]] || 0).toString(16).padStart(6, '0'); x.fillRect(W * 0.17, y - H * 0.04, W * 0.05, H * 0.08);
          x.fillStyle = '#222'; x.font = (H * 0.075) + 'px ' + FONT;
          x.fillText(String(r[0]), W * 0.05, y + H * 0.025); x.fillText(String(r[1]), W * 0.25, y + H * 0.025); x.fillText(S.t(r[2]), W * 0.38, y + H * 0.025);
        });
      }, { px: 700, state: { hi: -1 } });
      root.add(panel);
      return {
        root: root,
        update: function (t) { panel.userData.redraw({ hi: t > 1.5 ? 2 : -1 }); },
        captions: [
          { text: V('Schéma bývá na víku skříně nebo v příručce: číslo, proud, funkce', 'The diagram is on the box lid or in the manual: number, current, function') },
          { text: V('Příklad: stěrače = pojistka č. 3, 20 A (žlutá)', 'Example: wipers = fuse no. 3, 20 A (yellow)'), show: [1.5, 6], level: 'accent' }
        ]
      };
    }
  });

  R('fuses.pull', {
    duration: 7, camera: CAMB, ground: false, shadow: 0.25, thumbT: 4,
    build: function (ctx, K) {
      var root = new THREE.Group(), fb = fusebox(K, 10); root.add(fb.group);
      var f = fb.slots[10].fuse, base = fb.slots[10].pos.clone();
      var puller = new THREE.Group();
      [-1, 1].forEach(function (s) { var j = K.mesh(K.G.box(0.002, 0.03, 0.006), 'plasticWhite'); j.position.set(s * 0.0072, 0.016, 0); puller.add(j); });
      var top = K.mesh(K.G.rbox(0.02, 0.008, 0.008, 0.002), 'plasticWhite'); top.position.y = 0.032; puller.add(top);
      root.add(puller);
      return {
        root: root,
        update: function (t) {
          var down = K.T.seg(t, 0.5, 1.8), up = K.T.seg(t, 2.4, 4);
          puller.position.copy(base).add(new THREE.Vector3(0, 0.03 - down * 0.024 + up * 0.03, 0));
          f.position.copy(base).add(new THREE.Vector3(0, up * 0.03, 0));
        },
        labels: [{ text: V('vytahovák pojistek', 'fuse puller'), at: puller, show: [0, 2.4] }],
        captions: [
          { text: V('Zapalování a spotřebič VYPNUTÉ, pak pojistku vytáhnout rovně', 'Ignition and the consumer OFF, then pull the fuse straight out') },
          { text: V('Vytahovák bývá ve víku skříně', 'The puller is usually clipped in the box lid'), show: [3, 7], level: 'info' }
        ]
      };
    }
  });

  R('fuses.inspect', {
    duration: 6, camera: { pos: [0, 0.012, 0.075], target: [0, 0.011, 0], fov: 30 }, ground: false, shadow: 0.1, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var a = fuse(K, 15, false), b = fuse(K, 15, true);
      a.position.x = -0.009; b.position.x = 0.009; root.add(a); root.add(b);
      return {
        root: root,
        update: function (t) { root.rotation.y = Math.sin(t / 6 * PI * 2) * 0.3; },
        labels: [{ text: V('✔ celý drátek', '✔ intact link'), at: function () { return a.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.02, 0)); }, level: 'ok' },
          { text: V('✖ přerušený / začernalý', '✖ broken / blackened'), at: function () { return b.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.02, 0)); }, level: 'danger' }],
        captions: [{ text: V('Prohlédněte proti světlu: přerušený drátek = přepálená', 'Look against the light: broken link = blown') }]
      };
    }
  });

  R('fuses.test', {
    duration: 8, camera: { pos: [0.08, 0.13, 0.16], target: [0, 0.0, 0.0], fov: 32 }, ground: false, shadow: 0.25, thumbT: 5,
    build: function (ctx, K) {
      var root = new THREE.Group(), fb = fusebox(K, 10); root.add(fb.group);
      var probe = new THREE.Group();
      var body = K.mesh(K.G.cyl(0.006, 0.08, 16), K.M.clone('glassClear', { opacity: 0.6 })); body.position.y = 0.05; probe.add(body);
      var bulbM = K.M.clone('lightOff'); var bulb = K.mesh(K.G.sphere(0.004, 12), bulbM); bulb.position.y = 0.03; probe.add(bulb);
      var tip = K.mesh(K.G.cyl(0.0008, 0.012, 8), 'chrome'); tip.position.y = 0.004; probe.add(tip);
      root.add(probe);
      var slotsTo = [[3, -1], [3, 1], [10, -1], [10, 1]];
      return {
        root: root,
        update: function (t) {
          var i = Math.min(3, Math.floor(t / 2)), sl = slotsTo[i], p = fb.slots[sl[0]].pos;
          probe.position.set(p.x + sl[1] * 0.0035, p.y + 0.016, p.z);
          var lit = !(sl[0] === 10 && sl[1] > 0);
          bulbM.emissive = new THREE.Color(lit ? 0xffd36b : 0x000000); bulbM.emissiveIntensity = lit ? 2 : 0;
        },
        labels: [
          { text: V('svítí na obou stranách = OK', 'lights on both sides = OK'), at: function () { return fb.slots[3].pos.clone().add(new THREE.Vector3(0, 0.035, 0)); }, show: [0, 4], level: 'ok' },
          { text: V('jedna strana nesvítí = přepálená', 'one side dark = blown'), at: function () { return fb.slots[10].pos.clone().add(new THREE.Vector3(0, 0.035, 0)); }, show: [4, 8], level: 'danger' }
        ],
        captions: [
          { text: V('Zkoušečka: krokosvorka na kostru, hrotem na testovací body pojistky', 'Test light: clip to ground, touch the fuse test points') },
          { text: V('Měří se se zapnutým zapalováním / spotřebičem', 'Test with the ignition / consumer switched ON'), show: [2, 8], level: 'info' }
        ]
      };
    }
  });

  R('fuses.colors', {
    duration: 6, camera: { pos: [0, 0.03, 0.16], target: [0, 0.012, 0], fov: 30 }, ground: false, shadow: 0.2, thumbT: 2,
    build: function (ctx, K) {
      var root = new THREE.Group(), fs = AMPS.map(function (a, i) { var f = fuse(K, a, false); f.position.x = -0.06 + i * 0.02; root.add(f); return f; });
      return {
        root: root,
        labels: fs.map(function (f, i) { return { text: AMPS[i] + ' A', at: function () { return f.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.022, 0)); } }; }),
        captions: [
          { text: V('Nová pojistka = STEJNÝ proud (stejná barva)', 'New fuse = SAME rating (same colour)') },
          { text: V('Barvy: 5 béžová · 7,5 hnědá · 10 červená · 15 modrá · 20 žlutá · 25 bílá · 30 zelená', 'Colours: 5 tan · 7.5 brown · 10 red · 15 blue · 20 yellow · 25 white · 30 green'), level: 'info' }
        ]
      };
    }
  });

  R('fuses.blow', {
    duration: 8, camera: { pos: [0.05, 0.06, 0.2], target: [0, 0.01, 0], fov: 34 }, ground: false, shadow: 0.3, thumbT: 5,
    build: function (ctx, K) {
      var root = new THREE.Group();
      var f = fuse(K, 30, false); root.add(f);
      var wireM = K.M.clone('toolRed', { emissive: 0xff6a00, emissiveIntensity: 0 });
      var wire = K.mesh(K.G.tube([[-0.0035, 0, 0], [-0.03, -0.02, 0.01], [-0.09, -0.02, 0.02]], 0.0018), wireM); root.add(wire);
      var smoke = K.FX.puff(0x777777, 14, 0.08, 0.25); smoke.group.scale.setScalar(0.2); smoke.group.position.set(-0.05, -0.015, 0.015); root.add(smoke.group);
      var no = new THREE.Group();
      [1, -1].forEach(function (s) { var b = K.mesh(K.G.box(0.05, 0.006, 0.004), 'hiDanger'); b.rotation.z = s * PI / 4; no.add(b); });
      no.position.set(0, 0.012, 0.012); root.add(no);
      return {
        root: root,
        update: function (t) { var k = K.T.seg(t, 1.5, 4.5); wireM.emissiveIntensity = k * 1.4; smoke.update(t, t > 4); no.visible = t > 5 && Math.sin(t * 6) > -0.5; },
        captions: [
          { text: V('Pojistka se pálí znovu? Někde je zkrat – hledejte příčinu', 'Fuse keeps blowing? There is a short somewhere – find the cause') },
          { text: V('NIKDY nedávejte silnější pojistku ani drát – kabel shoří dřív než pojistka = POŽÁR', 'NEVER fit a bigger fuse or a wire – the cable burns before the fuse = FIRE'), level: 'danger', show: [2, 8] }
        ]
      };
    }
  });

  R('fuses.relay', {
    duration: 8, camera: { pos: [0.06, 0.16, 0.2], target: [-0.02, 0.0, 0.03], fov: 32 }, ground: false, shadow: 0.25, thumbT: 4,
    build: function (ctx, K) {
      var root = new THREE.Group(), fb = fusebox(K, -1); root.add(fb.group);
      var r0 = fb.relays[0], r1 = fb.relays[1], p0 = r0.position.clone(), p1 = r1.position.clone();
      return {
        root: root,
        update: function (t) {
          var up = K.T.seg(t, 0.5, 2), sw = K.T.seg(t, 2.2, 4.2), dn = K.T.seg(t, 4.4, 5.8);
          var h = (up - dn) * 0.05;
          r0.position.copy(p0.clone().lerp(p1, sw)).add(new THREE.Vector3(0, h, 0));
          r1.position.copy(p1.clone().lerp(p0, sw)).add(new THREE.Vector3(0, h + 0.005, 0));
        },
        captions: [
          { text: V('Podezřelé relé zaměňte se stejným relé (stejné číslo) z jiné funkce', 'Swap a suspect relay with an identical one (same part number) from another function') },
          { text: V('Závada se přestěhovala? Vadné je relé', 'Did the fault move? The relay is faulty'), level: 'info', show: [5, 8] }
        ]
      };
    }
  });

  R('fuses.check', {
    duration: 6, camera: CAMB, ground: false, shadow: 0.25, thumbT: 3,
    build: function (ctx, K) {
      var root = new THREE.Group(), fb = fusebox(K, -1); root.add(fb.group);
      var lid = K.mesh(K.G.rbox(0.165, 0.012, 0.115, 0.005), 'plasticTex'); root.add(lid);
      return {
        root: root,
        update: function (t) { var k = K.T.seg(t, 2, 4); lid.position.set(0, 0.008 + (1 - k) * 0.06, (1 - k) * 0.04); lid.rotation.x = -(1 - k) * 0.6; },
        captions: [
          { text: V('Vyzkoušejte funkci (zásuvka, stěrače…), pak zavřete víko', 'Test the function (socket, wipers…), then close the lid') },
          { text: V('Víko musí dosednout – chrání před vlhkostí', 'The lid must seat properly – it keeps moisture out'), level: 'info', show: [2, 6] }
        ]
      };
    }
  });
})(window.STU);
