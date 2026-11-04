/* 3D scenes: plastic bumper crack repair + paintless dent repair (PDR) basics. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  function rnd(i, k) { var x = Math.sin(i * 127.1 + (k || 0) * 311.7) * 43758.5453; return x - Math.floor(x); }

  /* ------------------------------------------------------- bumper rig */
  var BR = 1.25, BY = 0.62, BH = 0.34, BT = 0.95; // radius, centre height, height, arc (rad)
  function bumper(ctx, K) {
    var root = new THREE.Group();
    var mat = ctx.vehicle === 'citroen-jumper-22hdi' ? K.M.clone('plasticTex', { side: THREE.DoubleSide })
      : K.M.clone(K.M.carPaint(K.carSpec(ctx.vehicle).paint), { side: THREE.DoubleSide });
    var geo = new THREE.CylinderGeometry(BR, BR, BH, 72, 8, true, -BT / 2, BT);
    var shell = new THREE.Mesh(geo, mat); shell.position.set(0, BY, -BR); root.add(shell);
    // top & bottom return lips
    [1, -1].forEach(function (s) {
      var lip = new THREE.Mesh(new THREE.RingGeometry(BR - 0.05, BR, 72, 1, PI / 2 - BT / 2, BT), mat);
      lip.rotation.x = s * PI / 2; lip.position.set(0, BY + s * BH / 2, -BR); root.add(lip);
    });
    var grille = K.mesh(K.G.box(0.5, 0.07, 0.02), 'plasticTex'); grille.position.copy(surf(0, BY - 0.07, 0.003)); root.add(grille);
    // trestles
    [-0.35, 0.35].forEach(function (x) {
      var p = K.mesh(K.G.box(0.05, BY - BH / 2, 0.05), 'wood'); p.position.set(x, (BY - BH / 2) / 2, -0.12); root.add(p);
    });
    root.add(K.FX.contactShadow(1.3, 0.6, 0.35));
    return { root: root, mat: mat };
  }
  /** point on the bumper's outer surface at angle a (rad, 0 = centre) and height y; off = offset along the normal */
  function surf(a, y, off) {
    var r = BR + (off || 0);
    return new THREE.Vector3(Math.sin(a) * r, y, Math.cos(a) * r - BR);
  }
  function normalAt(a) { return new THREE.Vector3(Math.sin(a), 0, Math.cos(a)); }

  var CRACK = [[0.02, 0.72], [0.05, 0.7], [0.075, 0.705], [0.1, 0.685], [0.125, 0.69], [0.15, 0.665]];
  function crackPts(off) { return CRACK.map(function (p) { return surf(p[0], p[1], off); }); }
  function crackLine(K, mat, r, off) { return K.mesh(K.G.tube(crackPts(off || 0.001), r || 0.0016, false, 60, 6), mat || 'blackOxide'); }

  var CAM_F = { pos: [0.4, 0.84, 0.66], target: [0.09, 0.68, 0.0], fov: 32 };
  var CAM_B = { pos: [0.34, 0.86, -0.82], target: [0.07, 0.68, -0.05], fov: 33 };

  R('plastic-pdr.assess', {
    duration: 7, camera: CAM_F, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, b = bumper(ctx, K), root = b.root;
      var crack = crackLine(K); root.add(crack);
      var glow = K.FX.glow(crack, 0xe5484d);
      var ruler = new THREE.Group(); var rb = K.mesh(K.G.box(0.16, 0.012, 0.002), 'toolYellow'); ruler.add(rb);
      for (var i = 0; i < 16; i++) { var tk = K.mesh(K.G.box(0.0008, i % 5 ? 0.004 : 0.008, 0.001), 'plasticBlack'); tk.position.set(-0.08 + i * 0.01, 0.003, 0.0015); ruler.add(tk); }
      root.add(ruler);
      return {
        root: root,
        update: function (t) {
          glow(0.4 + 0.5 * Math.abs(Math.sin(t * 3)));
          var k = T.seg(t, 2, 3);
          var p = surf(0.085, 0.655, 0.004 + (1 - k) * 0.1); ruler.position.copy(p); ruler.rotation.y = 0.085;
        },
        labels: [
          { text: V('Prasklina', 'Crack'), at: surf(0.09, 0.73, 0.01), level: 'danger' },
          { text: V('Do ~10 cm, bez chybějících kusů = DIY', 'Up to ~10 cm, no missing pieces = DIY'), at: surf(0.09, 0.62, 0.01), show: [3, 7], level: 'ok' }
        ],
        captions: [
          { text: V('Utržené úchyty, chybějící kusy, deformace u čidel → nový díl', 'Torn mounting tabs, missing pieces, deformation near sensors → new part') },
          { text: V('Nárazník často skrývá výztuhu a absorbér – po nárazu je zkontrolujte', 'The bumper often hides a reinforcement and absorber – check them after an impact'), level: 'info', show: [3.5, 7] }
        ]
      };
    }
  });

  R('plastic-pdr.identify', {
    duration: 6, camera: CAM_B, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, b = bumper(ctx, K), root = b.root;
      var crack = crackLine(K, 'blackOxide', 0.0016, -0.004); root.add(crack);
      var stamp = K.FX.canvasPanel(0.09, 0.04, function (c, W, H) {
        c.fillStyle = '#26282c'; c.fillRect(0, 0, W, H);
        c.strokeStyle = '#9aa0a8'; c.lineWidth = 6; c.strokeRect(8, 8, W - 16, H - 16);
        c.fillStyle = '#d6dbe2'; c.font = 'bold ' + Math.round(H * 0.42) + 'px monospace'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('>PP-EPDM<', W / 2, H / 2);
      }, { px: 512 });
      var sp = surf(-0.08, 0.6, -0.003); stamp.position.copy(sp); stamp.rotation.y = PI - 0.08; root.add(stamp);
      var lamp = new THREE.PointLight(0xffffff, 0, 0.8); lamp.position.copy(surf(-0.08, 0.6, -0.25)); root.add(lamp);
      return {
        root: root,
        update: function (t) { lamp.intensity = 1.4 * T.seg(t, 0.5, 1.5); },
        labels: [
          { text: V('Značka materiálu (rub dílu)', 'Material code (back side)'), at: surf(-0.08, 0.64, -0.01), show: [1, 6], level: 'accent' },
          { text: V('PP / PP-EPDM / ABS / PC…', 'PP / PP-EPDM / ABS / PC…'), at: surf(-0.08, 0.55, -0.01), show: [2.5, 6] }
        ],
        captions: [
          { text: V('Podle materiálu volíte sponky, lepidlo a promotor přilnavosti', 'The material decides staples, adhesive and adhesion promoter') },
          { text: V('Bez značky? Zeptejte se v prodejně barev – nehádejte', 'No marking? Ask at the paint shop – do not guess'), level: 'info', show: [3, 6] }
        ]
      };
    }
  });

  R('plastic-pdr.sensors', {
    duration: 7, camera: { pos: [0.2, 0.9, 1.25], target: [0, 0.62, 0], fov: 36 }, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var b = bumper(ctx, K), root = b.root;
      var sens = [-0.32, -0.12, 0.12, 0.32].map(function (a) {
        var s = K.mesh(K.G.cylZ(0.013, 0.01, 20), K.M.clone('plasticTex')); var p = surf(a, BY + 0.08, 0.002); s.position.copy(p); s.rotation.y = a; root.add(s); return s;
      });
      var glows = sens.map(function (s) { return K.FX.glow(s, 0x3e8ed0); });
      var volvo = ctx.vehicle === 'volvo-xc60-b4';
      var zone = new THREE.Mesh(new THREE.CylinderGeometry(BR + 0.004, BR + 0.004, 0.16, 24, 1, true, -0.12, 0.24), new THREE.MeshStandardMaterial({ color: 0xe5484d, emissive: 0xe5484d, emissiveIntensity: 0.6, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
      zone.position.set(0, BY - 0.02, -BR); zone.userData.noShadow = true; root.add(zone);
      return {
        root: root,
        update: function (t) {
          glows.forEach(function (g, i) { g(0.4 + 0.5 * Math.max(0, Math.sin(t * 3 - i))); });
          zone.material.opacity = 0.25 + 0.15 * Math.sin(t * 4);
        },
        labels: [
          { text: V('Parkovací senzory', 'Parking sensors'), at: surf(0.32, BY + 0.13, 0.01) },
          { text: volvo ? V('Zóna radaru – žádný tmel ani oprava!', 'Radar zone – no filler, no repair!') : V('Zóna radaru / kamery (je-li) – neopravovat', 'Radar / camera zone (if fitted) – do not repair'), at: surf(0, BY + 0.07, 0.01), level: 'danger' }
        ],
        captions: [
          { text: V('Tmel a silná vrstva laku u senzorů = chybná měření', 'Filler and thick paint near sensors = wrong readings') },
          { text: volvo ? V('XC60: po zásahu do nárazníku kalibrace radaru (VIDA) – ověřit', 'XC60: radar calibration after bumper work (VIDA) – verify') : V('Asistenty (ACC, nouzové brzdění) po opravě zkontrolovat', 'Check driver assists (ACC, emergency braking) after the repair'), level: 'danger', show: [2.5, 7] }
        ]
      };
    }
  });

  R('plastic-pdr.prep', {
    duration: 8, camera: CAM_F, shadow: 1.2, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, b = bumper(ctx, K), root = b.root;
      var crack = crackLine(K); root.add(crack);
      var groove = crackLine(K, K.M.clone('plasticGrey', { color: 0x777a80 }), 0.0045, 0.0005); root.add(groove);
      var holes = [CRACK[0], CRACK[CRACK.length - 1]].map(function (p) { var h = K.mesh(K.G.cylZ(0.003, 0.003, 12), 'blackOxide'); h.position.copy(surf(p[0], p[1], 0.0012)); h.rotation.y = p[0]; root.add(h); return h; });
      var drill = new THREE.Group(); var db = K.mesh(K.G.rbox(0.05, 0.16, 0.18, 0.02), 'toolBlue'); db.position.z = 0.12; drill.add(db);
      var bit = K.mesh(K.G.cylZ(0.0015, 0.05, 8), 'chrome'); bit.position.z = 0.02; drill.add(bit); root.add(drill);
      var sander = new THREE.Group(); var pad = K.mesh(K.G.cylZ(0.025, 0.01, 24), 'paper'); sander.add(pad);
      var sb = K.mesh(K.G.cylZ(0.02, 0.1, 16), 'plasticBlack'); sb.position.z = 0.055; sander.add(sb); root.add(sander);
      return {
        root: root,
        update: function (t) {
          var d1 = T.pulse(t, 0.4, 1.6), d2 = T.pulse(t, 1.8, 3.0);
          holes[0].visible = t > 1.0; holes[1].visible = t > 2.4;
          var dp = t < 1.7 ? CRACK[0] : CRACK[CRACK.length - 1];
          drill.visible = t < 3.1;
          drill.position.copy(surf(dp[0], dp[1], 0.02 - Math.max(d1, d2) * 0.018)); drill.rotation.y = dp[0];
          var g = T.seg(t, 3.4, 6.2);
          groove.visible = t > 3.4; groove.scale.set(1, 1, 1);
          var i = Math.min(CRACK.length - 1, Math.floor(g * CRACK.length));
          sander.visible = t > 3.3 && t < 6.6;
          sander.position.copy(surf(CRACK[i][0], CRACK[i][1], 0.008)); sander.rotation.set(0, CRACK[i][0], t * 30);
        },
        labels: [
          { text: V('Konce praskliny provrtat (Ø 3 mm) – dál nepraskne', 'Drill the crack ends (Ø 3 mm) – stops it spreading'), at: surf(0.15, 0.62, 0.01), show: [0.4, 3.2], level: 'accent' },
          { text: V('Drážka do V', 'V-groove'), at: surf(0.08, 0.74, 0.01), show: [3.4, 8] }
        ],
        captions: [
          { text: V('Odmastit (antisilikon), pak drážkovat a brousit P80', 'Degrease (silicone remover), then groove and sand P80') },
          { text: V('Brusný prach z plastů: respirátor P2/P3', 'Plastic sanding dust: P2/P3 respirator'), level: 'warning', show: [3.4, 8] }
        ]
      };
    }
  });

  R('plastic-pdr.staple', {
    duration: 8, camera: CAM_B, shadow: 1.2, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, b = bumper(ctx, K), root = b.root;
      var crack = crackLine(K, 'blackOxide', 0.0018, -0.004); root.add(crack);
      var hot = new THREE.MeshStandardMaterial({ color: 0xff7a2a, emissive: 0xff4a00, emissiveIntensity: 2, metalness: 0.6, roughness: 0.4 });
      var cold = K.M.clone('steel');
      var staples = [];
      for (var i = 0; i < 6; i++) {
        var k = i / 5, a = 0.02 + k * 0.13, y = 0.72 - k * 0.055;
        var st = new THREE.Group();
        var bar = K.mesh(K.G.box(0.004, 0.028, 0.002), cold); st.add(bar);
        [-1, 1].forEach(function (s) { var leg = K.mesh(K.G.box(0.0025, 0.0025, 0.006), cold); leg.position.set(0, s * 0.013, 0.003); st.add(leg); });
        st.position.copy(surf(a, y, -0.0045)); st.rotation.y = a + PI; st.rotation.z = 0.5 - (i % 2) * 1.0;
        root.add(st); staples.push(st);
      }
      var tool = new THREE.Group(); var body = K.mesh(K.G.rbox(0.05, 0.05, 0.2, 0.015), 'toolRed'); body.position.z = -0.12; tool.add(body);
      var tips = K.mesh(K.G.box(0.004, 0.03, 0.02), 'chrome'); tips.position.z = -0.012; tool.add(tips); root.add(tool);
      return {
        root: root,
        update: function (t) {
          var step = 1.0, cur = Math.floor((t - 0.5) / step);
          staples.forEach(function (st, i) {
            var age = t - 0.5 - i * step;
            st.visible = age > 0.5;
            st.children.forEach(function (c) { c.material = age < 1.6 ? hot : cold; });
          });
          var idx = Math.max(0, Math.min(staples.length - 1, cur));
          var s = staples[idx], push = cur >= 0 && cur < staples.length ? T.pulse((t - 0.5) % step, 0, step) : 0;
          tool.visible = cur < staples.length;
          tool.position.copy(s.position).add(normalAt(CRACK[0][0] + idx * 0.026).multiplyScalar(-0.03 + push * 0.02));
          tool.rotation.set(0, s.rotation.y, s.rotation.z);
        },
        labels: [{ text: V('Rozžhavená sponka se zatlačí do plastu', 'The heated staple melts into the plastic'), at: surf(0.08, 0.76, -0.02), level: 'accent' }],
        captions: [
          { text: V('Z rubu: sponky křížem přes prasklinu, ~1 cm od sebe', 'From the back: staples across the crack, ~1 cm apart') },
          { text: V('Sponky pálí (~400 °C) – nesahat, nechat vychladnout', 'Staples are very hot (~400 °C) – do not touch, let them cool'), level: 'danger', show: [2, 8] }
        ]
      };
    }
  });

  R('plastic-pdr.adhesive', {
    duration: 8, camera: CAM_B, shadow: 1.2, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, b = bumper(ctx, K), root = b.root;
      root.add(crackLine(K, 'blackOxide', 0.0018, -0.004));
      // reinforcement mesh: grid of thin strands on the inner surface
      var mesh = new THREE.Group();
      for (var i = 0; i <= 10; i++) {
        var a = -0.005 + i * 0.018;
        mesh.add(K.mesh(K.G.tube([surf(a, 0.63, -0.006), surf(a, 0.76, -0.006)], 0.0007, false, 4, 4), 'paper'));
      }
      for (var j = 0; j <= 7; j++) {
        var y = 0.63 + j * 0.018, pts = [];
        for (var q = 0; q <= 10; q++) pts.push(surf(-0.005 + q * 0.018, y, -0.006));
        mesh.add(K.mesh(K.G.tube(pts, 0.0007, false, 20, 4), 'paper'));
      }
      root.add(mesh);
      var glue = new THREE.Mesh(new THREE.CylinderGeometry(BR - 0.007, BR - 0.007, 0.15, 30, 1, true, -0.01, 0.2), K.M.clone('plasticGrey', { color: 0x3a3c40, side: THREE.DoubleSide, transparent: true, opacity: 0 }));
      glue.position.set(0, 0.695, -BR); root.add(glue);
      var gun = new THREE.Group();
      [-0.012, 0.012].forEach(function (x) { var c = K.mesh(K.G.cylZ(0.012, 0.13, 16), 'plasticWhite'); c.position.set(x, 0, -0.1); gun.add(c); });
      var mixer = K.mesh(K.G.lathe([[0.002, 0], [0.009, 0.08], [0.012, 0.08]], 12), 'plasticWhite'); mixer.rotation.x = PI / 2; mixer.position.z = -0.0; gun.add(mixer);
      root.add(gun);
      return {
        root: root,
        update: function (t) {
          var m = T.seg(t, 0.4, 1.8);
          mesh.position.set(0, 0, -0.08 * (1 - m)); mesh.visible = m > 0.02;
          var k = T.lin(t, 2.2, 6.2);
          glue.material.opacity = 0.9 * T.seg(t, 2.2, 3.2);
          glue.scale.set(1, Math.max(0.02, k), 1);
          var p = surf(0.08, 0.63 + k * 0.13, -0.03);
          gun.position.copy(p); gun.rotation.y = PI + 0.08; gun.visible = t > 2 && t < 6.4;
        },
        labels: [{ text: V('Výztužná síťka', 'Reinforcement mesh'), at: surf(0.18, 0.78, -0.02), show: [1, 8] }],
        captions: [
          { text: V('Alternativa: 2K lepidlo na plasty + síťka z rubu', 'Alternative: 2K plastic adhesive + mesh from the back') },
          { text: V('Promotor přilnavosti dle materiálu; dodržet dobu tuhnutí', 'Adhesion promoter per material; respect the curing time'), level: 'info', show: [3, 8] }
        ]
      };
    }
  });

  R('plastic-pdr.filler', {
    duration: 9, camera: CAM_F, shadow: 1.2, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, b = bumper(ctx, K), root = b.root;
      var groove = crackLine(K, K.M.clone('plasticGrey', { color: 0x777a80 }), 0.0045, 0.0005); root.add(groove);
      var filler = crackLine(K, K.M.clone('filler', { transparent: true, opacity: 0 }), 0.009, 0.0012); root.add(filler);
      var puff = K.FX.puff(0xe8e8e8, 14, 0.05, 0.05); root.add(puff.group);
      var can = new THREE.Group(); var cb = K.mesh(K.G.cyl(0.03, 0.17, 20), 'plasticWhite'); cb.rotation.x = PI / 2 - 0.4; can.add(cb);
      var capc = K.mesh(K.G.cyl(0.02, 0.03, 16), 'toolRed'); capc.position.set(0, 0.08, -0.03); can.add(capc); root.add(can);
      var spreader = K.mesh(K.G.box(0.07, 0.05, 0.002), 'plasticWhite'); root.add(spreader);
      return {
        root: root,
        update: function (t) {
          var spray = t > 0.6 && t < 2.6;
          var sp = surf(0.08, 0.7, 0.12); can.position.copy(sp); can.visible = t < 2.8;
          puff.group.position.copy(surf(0.08, 0.7, 0.02)); puff.group.rotation.x = PI / 2; puff.update(t, spray);
          var f = T.seg(t, 3.2, 5.2);
          filler.material.opacity = f; filler.scale.set(1, 1, 1);
          var sx = T.lin(t, 3.2, 5.2);
          spreader.visible = t > 3 && t < 5.4;
          spreader.position.copy(surf(0.02 + sx * 0.13, 0.715 - sx * 0.05, 0.012)); spreader.rotation.set(-0.5, 0.1, 0);
          var sm = T.seg(t, 6, 8);
          filler.scale.setScalar(1 - sm * 0.0);
          groove.visible = f < 0.95;
        },
        labels: [
          { text: V('Promotor přilnavosti', 'Adhesion promoter'), at: surf(0.08, 0.78, 0.03), show: [0.6, 2.8] },
          { text: V('Pružný tmel na plasty', 'Flexible plastic filler'), at: surf(0.08, 0.76, 0.02), show: [3.2, 9], level: 'ok' }
        ],
        captions: [
          { text: V('Jen pružný tmel – tvrdý tmel na ocel na nárazníku praská', 'Flexible filler only – hard steel filler cracks on bumpers') },
          { text: V('Brousit P180→P320, plnič s pružnou přísadou, pak lak (viz Klempířské práce)', 'Sand P180→P320, primer with flex additive, then paint (see Bodywork)'), level: 'info', show: [5.5, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- PDR panel rig */
  function pdrRig(ctx, K) {
    var root = new THREE.Group();
    var W = 0.8, H = 0.5, nx = 80, ny = 50, PY = 0.95;
    var dent = { x: 0.02, y: 0.0, s: 0.06, d: 0.006 };
    var state = { depth: 1, high: 0 };
    function f(x, y) {
      var r2 = ((x - dent.x) * (x - dent.x) + (y - dent.y) * (y - dent.y)) / (dent.s * dent.s);
      var dip = -dent.d * state.depth * Math.exp(-r2);
      var crown = 0.0015 * state.high * Math.exp(-Math.pow(Math.sqrt(r2) - 1.4, 2) * 4);
      return -0.25 * x * x + dip + crown;
    }
    var geo = new THREE.PlaneGeometry(W, H, nx, ny);
    var mat = K.M.clone(ctx.vehicle === 'citroen-jumper-22hdi' ? K.M.carPaint(0x24508f) : K.M.carPaint(K.carSpec(ctx.vehicle).paint), { side: THREE.DoubleSide });
    var panel = new THREE.Mesh(geo, mat); panel.position.y = PY; root.add(panel);
    var base = geo.attributes.position.array.slice();
    // reflection lines (as if the striped board reflects in the paint)
    var lines = [];
    for (var i = 0; i < 9; i++) {
      var y0 = -0.16 + i * 0.04, pts = [];
      for (var q = 0; q <= 60; q++) pts.push(new THREE.Vector3(-0.3 + q * 0.01, y0, 0));
      var lineObj = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xffffff }));
      lineObj.userData.y0 = y0; lineObj.position.y = PY; root.add(lineObj); lines.push(lineObj);
    }
    [-0.3, 0.3].forEach(function (x) {
      var post = K.mesh(K.G.cyl(0.014, PY - H / 2, 16), 'steelDark'); post.position.set(x, (PY - H / 2) / 2, -0.06); root.add(post);
    });
    root.add(K.FX.contactShadow(1.1, 0.6, 0.35));
    function apply() {
      var p = geo.attributes.position;
      for (var k = 0; k < p.count; k++) { var x = base[k * 3], y = base[k * 3 + 1]; p.setZ(k, f(x, y)); }
      p.needsUpdate = true; geo.computeVertexNormals();
      lines.forEach(function (l) {
        var lp = l.geometry.attributes.position;
        for (var j = 0; j < lp.count; j++) {
          var x = lp.getX(j), y0 = l.userData.y0;
          // distorted reflection: lines bend near the dent proportional to slope
          var e = Math.exp(-((x - dent.x) * (x - dent.x) + (y0 - dent.y) * (y0 - dent.y)) / (dent.s * dent.s * 1.6));
          lp.setY(j, y0 + (y0 - dent.y) * e * 1.6 * state.depth + 0.004 * state.high * Math.sin(x * 60) * e);
          lp.setZ(j, f(x, lp.getY(j)) + 0.0015);
        }
        lp.needsUpdate = true;
      });
    }
    apply();
    return { root: root, state: state, apply: apply, f: f, PY: PY, dent: dent };
  }
  function board(K) {
    var b = K.FX.canvasPanel(0.5, 0.35, function (c, W, H) {
      for (var i = 0; i < 12; i++) { c.fillStyle = i % 2 ? '#111' : '#f4f4f4'; c.fillRect(0, i * H / 12, W, H / 12); }
    }, { px: 512 });
    var g = new THREE.Group(); g.add(b);
    var stand = K.mesh(K.G.cyl(0.01, 0.8, 12), 'steelDark'); stand.position.y = -0.55; g.add(stand);
    return g;
  }
  var CAM_P = { pos: [0.45, 1.12, 0.95], target: [0.02, 0.95, 0], fov: 33 };

  R('plastic-pdr.pdrBoard', {
    duration: 6, camera: CAM_P, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, rig = pdrRig(ctx, K), root = rig.root;
      var bd = board(K); bd.position.set(-0.55, 1.15, 0.65); bd.lookAt(0, 0.95, 0); root.add(bd);
      return {
        root: root,
        update: function (t) { bd.position.x = -0.55 + 0.1 * Math.sin(t * 0.8); },
        labels: [{ text: V('Zkřivené čáry = promáčklina', 'Bent lines = dent'), at: [0.02, rig.PY + 0.09, 0.02], level: 'accent' }],
        captions: [
          { text: V('Pruhovaná deska / LED lampa zviditelní tvar plechu', 'A striped board / LED lamp reveals the panel shape') },
          { text: V('PDR jen pro hladké promáčkliny bez poškozeného laku', 'PDR only for smooth dents with undamaged paint'), level: 'info', show: [2.5, 6] }
        ]
      };
    }
  });

  R('plastic-pdr.glue', {
    duration: 9, camera: CAM_P, shadow: 1.2, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, rig = pdrRig(ctx, K), root = rig.root;
      var tab = new THREE.Group();
      var cup = K.mesh(K.G.cylZ(0.016, 0.008, 24), 'toolBlue'); tab.add(cup);
      var stem = K.mesh(K.G.cylZ(0.004, 0.03, 12), 'toolBlue'); stem.position.z = 0.018; tab.add(stem);
      var head = K.mesh(K.G.cylZ(0.007, 0.006, 16), 'toolBlue'); head.position.z = 0.035; tab.add(head);
      var glue = K.mesh(K.G.cylZ(0.017, 0.003, 24), K.M.clone('plasticWhite', { color: 0xf2e8b0 })); glue.position.z = -0.004; tab.add(glue);
      root.add(tab);
      var puller = new THREE.Group();
      var jaw = K.mesh(K.G.box(0.06, 0.012, 0.012), 'steel'); jaw.position.z = 0.04; puller.add(jaw);
      var rod = K.mesh(K.G.cylZ(0.006, 0.3, 12), 'chrome'); rod.position.z = 0.19; puller.add(rod);
      var weight = K.mesh(K.G.cylZ(0.022, 0.07, 20), 'steelDark'); puller.add(weight);
      var handle = K.mesh(K.G.cylZ(0.016, 0.07, 16), 'gripRubber'); handle.position.z = 0.33; puller.add(handle);
      root.add(puller);
      var lastD = -1;
      return {
        root: root,
        update: function (t) {
          var placed = T.seg(t, 0.4, 1.4);
          var pulls = [T.seg(t, 2.6, 3.0), T.seg(t, 4.0, 4.4), T.seg(t, 5.4, 5.8)];
          var depth = 1 - (pulls[0] * 0.45 + pulls[1] * 0.35 + pulls[2] * 0.15);
          if (Math.abs(depth - lastD) > 0.01) { rig.state.depth = depth; rig.state.high = pulls[2] * 0.6; rig.apply(); lastD = depth; }
          var z0 = rig.f(rig.dent.x, rig.dent.y);
          tab.position.set(rig.dent.x, rig.PY + rig.dent.y, z0 + 0.006 + (1 - placed) * 0.08);
          tab.visible = t < 7;
          puller.visible = t > 2 && t < 6.6;
          puller.position.set(rig.dent.x, rig.PY + rig.dent.y, z0 + 0.0);
          weight.position.z = 0.12 + (t > 2.2 && t < 6.2 ? (1 - ((t - 2.2) % 1.4) / 1.4) * 0.16 : 0.16);
        },
        labels: [
          { text: V('Lepicí terč + horké lepidlo', 'Glue tab + hot glue'), at: [rig.dent.x, rig.PY + 0.08, 0.03], show: [0.4, 2.4] },
          { text: V('Táhnout po malých krocích', 'Pull in small steps'), at: [rig.dent.x + 0.1, rig.PY + 0.08, 0.05], show: [2.4, 9], level: 'accent' }
        ],
        captions: [
          { text: V('Lepidlo odstranit izopropylalkoholem, ne násilím', 'Release the glue with isopropyl alcohol, not by force') },
          { text: V('Moc silný tah = vytažený vršek a praskající lak', 'Pulling too hard = high spot and cracked paint'), level: 'warning', show: [4.5, 9] }
        ]
      };
    }
  });

  R('plastic-pdr.knock', {
    duration: 7, camera: CAM_P, shadow: 1.2, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, rig = pdrRig(ctx, K), root = rig.root;
      rig.state.depth = 0.08; rig.state.high = 1; rig.apply();
      var tool = new THREE.Group();
      var tip = K.mesh(K.G.lathe([[0, 0], [0.004, 0.003], [0.008, 0.02], [0.008, 0.12], [0, 0.12]], 16), 'plasticWhite'); tip.rotation.x = -PI / 2; tool.add(tip);
      root.add(tool);
      var ham = K.P.hammer(); ham.scale.setScalar(0.5); root.add(ham);
      var lastH = -1;
      return {
        root: root,
        update: function (t) {
          var taps = Math.floor(Math.max(0, t - 0.5) / 0.6);
          var high = Math.max(0, 1 - taps * 0.12);
          if (Math.abs(high - lastH) > 0.01) { rig.state.high = high; rig.apply(); lastH = high; }
          var a = taps * 1.3, r = rig.dent.s * 1.4;
          var x = rig.dent.x + Math.cos(a) * r, y = rig.dent.y + Math.sin(a) * r;
          tool.position.set(x, rig.PY + y, rig.f(x, y) + 0.002);
          tool.rotation.set(-0.15, 0.1, 0);
          var hit = (t - 0.5) % 0.6;
          ham.position.set(x + 0.02, rig.PY + y + 0.06, rig.f(x, y) + 0.14 + (hit < 0.15 ? 0 : 0.05));
          ham.rotation.set(PI / 2, 0, 0.3 + (hit < 0.15 ? 0 : -0.5));
        },
        labels: [{ text: V('Vyrovnat vyvýšená místa kolem', 'Knock down the high spots around'), at: [rig.dent.x, rig.PY + 0.12, 0.03], level: 'accent' }],
        captions: [
          { text: V('Plastový průbojník + lehké údery, kontrola na desce', 'Plastic knockdown + light taps, check on the board') },
          { text: V('Ostré hrany / natažený plech = klempířská oprava, ne PDR', 'Sharp creases / stretched metal = bodywork repair, not PDR'), level: 'info', show: [3, 7] }
        ]
      };
    }
  });
})(window.STU);
