/* 3D scenes: steering wheel removal / refit with airbag safety. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var WAIT = {
    'generic': V('čekat dle příručky (raději ≥ 10 min)', 'wait per manual (ideally ≥ 10 min)'),
    'mb-cl500-c216': V('čekat dle WIS (raději ≥ 10 min)', 'wait per WIS (ideally ≥ 10 min)'),
    'volvo-xc60-b4': V('čekat dle VIDA (raději ≥ 10 min)', 'wait per VIDA (ideally ≥ 10 min)'),
    'skoda-octavia-rs-tdi': V('čekat dle ELSA (raději ≥ 10 min)', 'wait per ELSA (ideally ≥ 10 min)'),
    'toyota-gr-yaris': V('min. 90 s dle TIS (raději ≥ 10 min)', 'min. 90 s per TIS (ideally ≥ 10 min)')
  };
  var TORQ = {
    'skoda-octavia-rs-tdi': V('nový šroub · 30 Nm + 90°', 'new bolt · 30 Nm + 90°'),
    'mb-cl500-c216': V('moment dle WIS', 'torque per WIS'),
    'volvo-xc60-b4': V('moment dle VIDA', 'torque per VIDA'),
    'toyota-gr-yaris': V('moment dle TIS', 'torque per TIS')
  };
  var TOOL = { 'skoda-octavia-rs-tdi': 'VCDS / ODIS', 'mb-cl500-c216': 'XENTRY', 'volvo-xc60-b4': 'VIDA', 'toyota-gr-yaris': 'Techstream' };
  var TORX = { 'mb-cl500-c216': 1, 'toyota-gr-yaris': 1 };

  var C = new THREE.Vector3(0, 1.0, 0);     // wheel centre
  var TILT = -0.38;                          // column tilt

  /** Steering column + clock spring + steering wheel with airbag. Wheel axis = local Z (face +Z). */
  function steeringRig(ctx, K, o) {
    o = o || {};
    var root = new THREE.Group();
    var colG = new THREE.Group(); colG.position.copy(C); colG.rotation.x = TILT; root.add(colG);
    // dashboard + column shroud
    var dash = K.mesh(K.G.rbox(1.3, 0.32, 0.5, 0.06), 'plasticTex'); dash.position.set(0, 0.12, -0.45); colG.add(dash);
    var cluster = K.mesh(K.G.rbox(0.36, 0.13, 0.06, 0.03), 'blackGloss'); cluster.position.set(0, 0.2, -0.2); colG.add(cluster);
    var shroud = K.mesh(K.G.rbox(0.12, 0.11, 0.3, 0.04), 'plasticTex'); shroud.position.set(0, -0.01, -0.25); colG.add(shroud);
    var stalkL = K.mesh(K.G.cylX(0.008, 0.16, 12), 'plasticBlack'); stalkL.position.set(-0.12, 0.0, -0.12); colG.add(stalkL);
    var stalkR = stalkL.clone(); stalkR.position.x = 0.12; colG.add(stalkR);
    // shaft with splines
    var shaft = K.mesh(K.G.cylZ(0.011, 0.2, 20), 'steel'); shaft.position.z = -0.1; colG.add(shaft);
    for (var i = 0; i < 18; i++) {
      var a = i / 18 * PI * 2, sp = K.mesh(K.G.box(0.003, 0.003, 0.03), 'steelDark');
      sp.position.set(Math.cos(a) * 0.0115, Math.sin(a) * 0.0115, -0.012); sp.rotation.z = a; colG.add(sp);
    }
    var shaftMark = K.mesh(K.G.box(0.004, 0.012, 0.04), K.M.clone('hiAccent')); shaftMark.position.set(0, 0.016, -0.03); shaftMark.visible = false; colG.add(shaftMark);
    // clock spring
    var clock = new THREE.Group(); clock.position.z = -0.05; colG.add(clock);
    var ch = K.mesh(K.G.latheZ([[0.03, -0.015], [0.075, -0.015], [0.075, 0.015], [0.03, 0.015]], 48), 'plasticBlack'); clock.add(ch);
    var rotor = K.mesh(K.G.latheZ([[0.022, 0.0], [0.05, 0.0], [0.05, 0.02], [0.022, 0.02]], 40), 'plasticGrey'); clock.add(rotor);
    var ccon = K.mesh(K.G.rbox(0.022, 0.015, 0.02, 0.004), K.M.clone('toolYellow', { color: 0xf6cf1a })); ccon.position.set(0.035, 0.03, 0.025); clock.add(ccon);
    // steering wheel (rotates and slides on the column)
    var wheel = new THREE.Group(); colG.add(wheel);
    var leather = o.track ? K.M.clone('fabric', { color: 0x222326 }) : K.M.leather;
    var rimR = o.track ? 0.17 : 0.185;
    var rim = K.mesh(K.G.torus(rimR, o.track ? 0.019 : 0.017, PI * 2, 72), leather); rim.position.z = o.track ? 0.07 : 0.02; wheel.add(rim);
    if (!o.track) { var top = K.mesh(K.G.torus(rimR, 0.0175, 0.3, 12), 'plasticGrey'); top.rotation.z = PI / 2 - 0.15; top.position.z = 0.02; wheel.add(top); }
    var spokes = o.track ? [[-1, 0], [1, 0], [0, -1]] : [[-1, -0.05], [1, -0.05], [0, -1]];
    spokes.forEach(function (sd) {
      var len = rimR - 0.06, w = sd[1] === -1 ? 0.035 : 0.05;
      var spk = K.mesh(K.G.rbox(sd[0] ? len : w, sd[0] ? w : len, 0.016, 0.006), o.track ? 'alu' : 'plasticBlack');
      spk.position.set(sd[0] * (0.06 + len / 2), sd[1] === -1 ? -(0.06 + len / 2) : sd[1] * 0.2, o.track ? 0.04 : 0.0);
      wheel.add(spk);
      if (!o.track && sd[0]) { for (var b = 0; b < 3; b++) { var btn = K.mesh(K.G.rbox(0.016, 0.012, 0.008, 0.003), 'plasticGrey'); btn.position.set(sd[0] * (0.09 + b * 0.022), -0.01, 0.01); wheel.add(btn); } }
    });
    var hub = K.mesh(K.G.latheZ([[0.03, -0.04], [0.07, -0.035], [0.075, 0.0], [0.03, 0.0]], 40), 'plasticBlack'); wheel.add(hub);
    var bolt = new THREE.Group(); wheel.add(bolt);
    var bh = K.mesh(K.G.cylZ(0.012, 0.012, 12), 'chrome'); bh.position.z = 0.006; bolt.add(bh);
    var bhx = K.mesh(K.G.cylZ(0.006, 0.013, 6), 'blackOxide'); bhx.position.z = 0.007; bolt.add(bhx);
    var wheelMark = K.mesh(K.G.box(0.004, 0.014, 0.012), K.M.clone('hiAccent')); wheelMark.position.set(0, 0.03, 0.002); wheelMark.visible = false; wheel.add(wheelMark);
    // back cover with release holes
    var holes = [];
    [[-1, 0], [1, 0], [0, -1]].forEach(function (q) {
      var h = K.mesh(K.G.cylZ(0.006, 0.004, 16), 'blackOxide'); h.position.set(q[0] * 0.065, q[1] * 0.065, -0.042); wheel.add(h); holes.push(h);
    });
    // airbag module
    var airbag = new THREE.Group();
    if (!o.track) {
      var ab = K.mesh(K.G.rbox(0.14, 0.11, 0.05, 0.03), 'plasticBlack'); ab.position.z = 0.0; airbag.add(ab);
      var cover = K.mesh(K.G.rbox(0.135, 0.105, 0.012, 0.03), 'leather'); cover.position.z = 0.028; airbag.add(cover);
      var seam = K.mesh(K.G.box(0.11, 0.002, 0.002), 'plasticGrey'); seam.position.set(0, 0.0, 0.035); airbag.add(seam);
      var acon = K.mesh(K.G.rbox(0.024, 0.016, 0.02, 0.004), K.M.clone('toolYellow', { color: 0xf6cf1a })); acon.position.set(0.02, 0.0, -0.035); airbag.add(acon);
      var lock = K.mesh(K.G.box(0.02, 0.004, 0.012), 'toolRed'); lock.position.set(0.02, 0.01, -0.035); airbag.add(lock);
      airbag.userData = { con: acon, lock: lock, cover: cover };
      airbag.position.z = 0.03; wheel.add(airbag);
    }
    var cable = K.mesh(K.G.tube([[0.035, 0.03, -0.025], [0.04, 0.03, 0.0], [0.03, 0.01, 0.03]], 0.003), 'plasticBlack'); colG.add(cable);
    return { root: root, col: colG, wheel: wheel, airbag: airbag, bolt: bolt, clock: clock, rotor: rotor, holes: holes, shaftMark: shaftMark, wheelMark: wheelMark, rim: rim, cable: cable };
  }
  function toWorld(rig, local) { return rig.col.localToWorld(K3(local)); }
  function K3(a) { return new THREE.Vector3(a[0], a[1], a[2]); }
  var CAM_F = { pos: [0.25, 1.32, 0.72], target: [0, 0.98, 0], fov: 32 };

  /* ---------------------------------------------------------------- centre */
  R('steer.center', {
    duration: 9, camera: { pos: [4.0, 2.6, 2.2], target: [1.2, 0.3, 0], fov: 34 }, shadow: 3, thumbT: 7,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var car = K.car(ctx.vehicle); root.add(car.group);
      var fw = car.wheels.filter(function (w) { return w.axle === 'f'; });
      var rig = steeringRig(ctx, K); rig.root.position.set(8, 0, 0); root.add(rig.root);
      var lock = K.FX.canvasPanel(0.08, 0.08, function (c, W, H) {
        c.fillStyle = '#f5a524'; c.beginPath(); c.arc(W / 2, H / 2, W / 2 - 2, 0, PI * 2); c.fill();
        c.fillStyle = '#1a1200'; c.fillRect(W * 0.3, H * 0.45, W * 0.4, H * 0.3); c.strokeStyle = '#1a1200'; c.lineWidth = W * 0.07; c.beginPath(); c.arc(W / 2, H * 0.45, W * 0.14, PI, 0); c.stroke();
      });
      lock.position.set(8.24, 1.1, 0.05); root.add(lock);
      return {
        root: root,
        update: function (t) {
          var a = 0.42 * (1 - T.seg(t, 0.6, 2.8));
          fw.forEach(function (w) { w.pivot.rotation.y = a; });
          rig.wheel.rotation.z = -1.1 * (1 - T.seg(t, 4.2, 5.6));
          var m = t > 6.2; rig.wheelMark.visible = m; rig.shaftMark.visible = m;
          lock.visible = t > 5.6;
        },
        cameraPath: function (t) {
          var a = { pos: new THREE.Vector3(4.0, 2.6, 2.2), target: new THREE.Vector3(1.2, 0.3, 0) };
          var b = { pos: new THREE.Vector3(8.25, 1.32, 0.7), target: new THREE.Vector3(8, 0.98, 0) };
          var k = T.seg(t, 3.2, 4.2);
          return { pos: a.pos.lerp(b.pos, k), target: a.target.lerp(b.target, k) };
        },
        labels: [
          { text: V('Přední kola rovně', 'Front wheels straight'), at: function () { return fw[1].pivot.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.45, 0)); }, show: [2.8, 3.4], level: 'ok' },
          { text: V('Značka volant ↔ sloupek', 'Mark wheel ↔ column'), at: [8, 1.12, 0.1], show: [6.3, 9], level: 'accent' }
        ],
        captions: [
          { text: V('Kola rovně, volant v rovině – zámek řízení', 'Wheels straight, wheel level – steering lock on') },
          { text: V('Značky na hřídeli i volantu ulehčí montáž', 'Marks on shaft and wheel make refitting easy'), level: 'info', show: [6, 9] }
        ]
      };
    }
  });

  /* --------------------------------------------------------------- battery */
  R('steer.battery', {
    duration: 10, camera: { pos: [0.35, 0.62, 0.62], target: [0.05, 0.38, 0], fov: 34 }, shadow: 1, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var tray = K.mesh(K.G.rbox(0.36, 0.18, 0.26, 0.01), 'plasticTex'); tray.position.y = 0.09; root.add(tray);
      var bat = new THREE.Group(); bat.position.y = 0.18; root.add(bat);
      var bc = K.mesh(K.G.rbox(0.28, 0.17, 0.18, 0.01), 'plasticBlack'); bc.position.y = 0.085; bat.add(bc);
      var lid = K.mesh(K.G.rbox(0.28, 0.02, 0.18, 0.006), 'plasticGrey'); lid.position.y = 0.175; bat.add(lid);
      var lab = K.mesh(K.G.box(0.2, 0.08, 0.002), 'toolBlue'); lab.position.set(0, 0.09, 0.091); bat.add(lab);
      var posT = K.mesh(K.G.cyl(0.009, 0.02, 16), 'aluCast'); posT.position.set(0.1, 0.195, 0.05); bat.add(posT);
      var posCov = K.mesh(K.G.rbox(0.04, 0.03, 0.04, 0.01), 'toolRed'); posCov.position.set(0.1, 0.2, 0.05); bat.add(posCov);
      var negT = K.mesh(K.G.cyl(0.009, 0.02, 16), 'aluCast'); negT.position.set(-0.1, 0.195, 0.05); bat.add(negT);
      var clamp = new THREE.Group(); clamp.position.set(-0.1, 0.205, 0.05); bat.add(clamp);
      var cl = K.mesh(K.G.rbox(0.035, 0.02, 0.03, 0.006), 'zinc'); clamp.add(cl);
      var nut = K.mesh(K.G.hex(0.006, 0.006), 'zinc'); nut.position.set(0, 0.013, 0.014); clamp.add(nut);
      var negCable = K.mesh(K.G.tube([[-0.02, 0, 0], [-0.08, 0.0, 0.0], [-0.16, -0.05, 0.03], [-0.25, -0.12, 0.06]], 0.008), 'plasticBlack'); clamp.add(negCable);
      var posCable = K.mesh(K.G.tube([[0.12, 0.205, 0.05], [0.2, 0.2, 0.06], [0.28, 0.15, 0.08]], 0.008), K.M.clone('toolRed')); bat.add(posCable);
      var cap = K.mesh(K.G.cyl(0.02, 0.03, 16), K.M.clone('plasticBlack', { color: 0x2d2d32, roughness: 1 })); root.add(cap);
      var sp = K.P.spanner(0.14, 0.006); sp.scale.setScalar(0.8); root.add(sp);
      var timer = K.FX.canvasPanel(0.16, 0.16, function (c, W, H, st) {
        var k = st ? st.k : 0;
        c.fillStyle = '#16191f'; c.beginPath(); c.arc(W / 2, H / 2, W / 2 - 2, 0, PI * 2); c.fill();
        c.strokeStyle = '#30343c'; c.lineWidth = W * 0.08; c.beginPath(); c.arc(W / 2, H / 2, W * 0.38, 0, PI * 2); c.stroke();
        c.strokeStyle = k >= 1 ? '#30a46c' : '#f5a524'; c.beginPath(); c.arc(W / 2, H / 2, W * 0.38, -PI / 2, -PI / 2 + PI * 2 * (1 - k)); c.stroke();
        var sec = Math.round(600 * (1 - k)), mm = Math.floor(sec / 60), ss = sec % 60;
        c.fillStyle = '#fff'; c.font = 'bold ' + Math.round(W * 0.17) + 'px monospace'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(mm + ':' + (ss < 10 ? '0' : '') + ss, W / 2, H / 2);
      }, { state: { k: 0 } });
      timer.position.set(0.28, 0.42, -0.05); timer.rotation.y = -0.3; root.add(timer);
      var cb = clamp.position.clone();
      return {
        root: root,
        update: function (t) {
          sp.visible = t > 0.4 && t < 2.0;
          sp.position.set(-0.1, 0.4, 0.064); sp.rotation.set(0, Math.sin(t * 5) * 0.4, 0);
          var off = T.seg(t, 2.0, 3.2);
          clamp.position.copy(cb).add(new THREE.Vector3(-off * 0.08, off * 0.06, off * 0.04));
          var ins = T.seg(t, 3.4, 4.0);
          cap.visible = ins > 0.02;
          var cw = clamp.getWorldPosition(new THREE.Vector3());
          cap.position.copy(cw).add(new THREE.Vector3(0, 0.05 * (1 - ins), 0));
          timer.userData.redraw({ k: Math.round(T.lin(t, 4.2, 9.4) * 60) / 60 });
        },
        labels: [
          { text: V('minus (−) pól', 'negative (−) terminal'), at: function () { return clamp.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.05, 0)); }, show: [0, 3.4], level: 'accent' },
          { text: V('zaizolovat', 'insulate'), at: function () { return cap.position.clone().add(new THREE.Vector3(0, 0.04, 0)); }, show: [3.8, 10] },
          { text: WAIT[ctx.vehicle] || WAIT.generic, at: [0.28, 0.53, -0.05], show: [4.2, 10], level: 'info' }
        ],
        captions: [
          { text: V('1. Odpojit minus (−) pól baterie a zaizolovat', '1. Disconnect the negative (−) terminal and insulate it') },
          { text: V('2. Počkat – kondenzátor airbagu se vybije', '2. Wait – the airbag capacitor discharges'), show: [4, 10] },
          { text: V('Nespěchat! Airbag může vystřelit.', 'Do not rush! The airbag can deploy.'), level: 'danger', show: [5, 10] },
          ctx.vehicle === 'mb-cl500-c216' ? { text: V('CL 500: sloupek nejdřív elektricky nastavit · baterie v kufru', 'CL 500: set the electric column first · battery in the boot'), level: 'info', show: [0, 4] }
            : ctx.vehicle === 'volvo-xc60-b4' ? { text: V('XC60: 12V dle VIDA (48V se netýká – nezkratovat)', 'XC60: 12 V per VIDA (48 V not involved – no shorts)'), level: 'info', show: [0, 4] } : { text: V('Vypnout zapalování, klíč mimo vůz', 'Ignition off, key out of the car'), level: 'info', show: [0, 4] }
        ]
      };
    }
  });

  /* ------------------------------------------------------- airbag release */
  R('steer.airbagRelease', {
    duration: 10, camera: { pos: [0.42, 0.8, 0.3], target: [0, 1.0, -0.03], fov: 36 }, shadow: 1, thumbT: 1.5,
    build: function (ctx, K) {
      var T = K.T, rig = steeringRig(ctx, K);
      var torx = !!TORX[ctx.vehicle];
      var tool = K.P.screwdriver(0.22, torx ? 'toolBlue' : 'toolRed'); rig.wheel.add(tool);
      var ab = rig.airbag, abz = ab.position.z;
      return {
        root: rig.root,
        update: function (t) {
          var hole, k;
          if (torx) {
            hole = t < 4.5 ? rig.holes[0] : rig.holes[1];
            k = T.seg(t % 4.5, 0.6, 1.4);
            tool.position.copy(hole.position).add(new THREE.Vector3(0, 0, -0.01 - (1 - k) * 0.08));
            tool.rotation.set(0, PI / 2, 0); tool.rotateX(T.seg(t % 4.5, 1.6, 3.6) * 8);
            rig.wheel.rotation.z = 0;
          } else {
            var phase = t < 4.5 ? 0 : 1;
            hole = phase ? rig.holes[2] : rig.holes[0];
            k = T.seg(t % 4.5, 0.6, 1.6);
            tool.position.copy(hole.position).add(new THREE.Vector3(0, 0, -0.01 - (1 - k) * 0.08));
            tool.rotation.set(0, PI / 2, 0); tool.rotateZ(T.seg(t % 4.5, 1.8, 2.6) * 0.35);
            rig.wheel.rotation.z = -PI / 2 * T.seg(t, 3.8, 4.6);
          }
          tool.visible = t < 8.4;
          ab.position.z = abz + T.seg(t, 8.4, 9.2) * 0.035;
        },
        labels: [
          { text: torx ? V('Torx šroub', 'Torx screw') : V('otvor se sponou', 'hole with spring clip'), at: function () { return rig.holes[0].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.03, 0)); }, show: [0.3, 4], level: 'accent' },
          { text: V('pohled zespodu na zadní kryt', 'view from below on the rear cover'), at: [0, 0.9, 0.0], show: [0, 2] }
        ],
        captions: [
          { text: torx ? V('Torx šrouby zezadu volantu vyšroubovat', 'Undo the Torx screws on the back of the wheel') : V('Šroubovákem otvory vzadu uvolnit pružinové spony', 'Release the spring clips with a screwdriver through the rear holes') },
          { text: torx ? V('Šrouby bývají zajištěné v pouzdře – nevypadnou', 'Screws are often captive – they stay in the housing') : V('Pootáčet volantem o 90° k dalšímu otvoru', 'Turn the wheel 90° to reach the next hole'), level: 'info', show: [2.5, 10] },
          { text: V('Baterie odpojená a čekací doba uplynula?', 'Battery disconnected and wait time over?'), level: 'danger', show: [6, 10] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------- connector */
  R('steer.connector', {
    duration: 8, camera: { pos: [0.35, 1.18, 0.42], target: [0.02, 1.0, 0.05], fov: 34 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, rig = steeringRig(ctx, K);
      var ab = rig.airbag, con = ab.userData.con, lock = ab.userData.lock;
      var cb = con.position.clone();
      var glow = K.FX.glow(con, 0xf5a524);
      return {
        root: rig.root,
        update: function (t) {
          var out = T.seg(t, 0.4, 1.6);
          ab.position.set(0, -0.02 * out, 0.03 + out * 0.12); ab.rotation.x = -out * 0.9;
          lock.rotation.x = -T.seg(t, 2.4, 3.0) * 0.8;
          var pull = T.seg(t, 3.4, 4.6);
          con.position.copy(cb).add(new THREE.Vector3(0, 0, -pull * 0.04));
          glow(T.pulse(t, 1.6, 3.4));
        },
        labels: [
          { text: V('žlutý = airbag', 'yellow = airbag'), at: function () { return con.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.03, 0)); }, show: [1.6, 8], level: 'accent' }
        ],
        captions: [
          { text: V('Zajišťovací páčku zvednout, konektor vytáhnout rovně', 'Lift the locking tab, pull the connector straight out') },
          { text: V('Za kabel netahat · kontakty nesahat', 'Never pull the wire · do not touch the contacts'), level: 'danger', show: [3, 8] },
          { text: V('Montáž: konektor zacvaknout a zajistit páčkou', 'Refitting: click the connector in and close the lock'), level: 'info', show: [5.5, 8] }
        ]
      };
    }
  });

  /* ----------------------------------------------------------- carry/store */
  R('steer.airbagCarry', {
    duration: 9, camera: { pos: [1.7, 1.35, 2.4], target: [0.4, 0.9, 0], fov: 34 }, shadow: 2, thumbT: 2.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var skin = K.M.clone('plasticGrey', { color: 0x8a95a5 });
      var man = new THREE.Group(); root.add(man);
      var torso = K.mesh(K.G.rbox(0.36, 0.55, 0.22, 0.09), K.M.clone('toolBlue', { color: 0x2f4d7a })); torso.position.y = 1.2; man.add(torso);
      var head = K.mesh(K.G.sphere(0.11, 24), skin); head.position.y = 1.62; man.add(head);
      [-1, 1].forEach(function (s) {
        var leg = K.mesh(K.G.cyl(0.07, 0.9, 16), K.M.clone('fabric', { color: 0x30343a })); leg.position.set(0, 0.45, s * 0.1); man.add(leg);
        var arm = K.mesh(K.G.tube([[0.02, 1.42, s * 0.2], [0.18, 1.18, s * 0.17], [0.38, 1.15, s * 0.08]], 0.04), K.M.clone('toolBlue', { color: 0x2f4d7a })); man.add(arm);
      });
      var abG = new THREE.Group();
      var ab = K.mesh(K.G.rbox(0.05, 0.11, 0.14, 0.02), 'plasticBlack'); abG.add(ab);
      var cover = K.mesh(K.G.rbox(0.012, 0.105, 0.135, 0.02), 'leather'); cover.position.x = 0.03; abG.add(cover);
      root.add(abG);
      var bench = K.mesh(K.G.rbox(0.8, 0.05, 0.5, 0.01), 'wood'); bench.position.set(1.4, 0.8, 0); root.add(bench);
      var good = abG.clone(); good.rotation.z = PI / 2; good.position.set(1.25, 0.85, 0); root.add(good);
      var bad = abG.clone(); bad.rotation.z = -PI / 2; bad.position.set(1.6, 0.85, 0); root.add(bad);
      var no = new THREE.Group();
      [1, -1].forEach(function (s) { var b = K.mesh(K.G.box(0.16, 0.02, 0.02), 'hiDanger'); b.rotation.z = s * PI / 4; no.add(b); });
      no.position.set(1.6, 1.0, 0.0); root.add(no);
      return {
        root: root,
        update: function (t) {
          var walk = T.seg(t, 0.5, 3.0);
          man.position.set(walk * 0.4 - 0.2, 0, 0);
          abG.position.set(man.position.x + 0.42, 1.15, 0); abG.rotation.set(0, 0, 0);
          var place = t > 4.5;
          abG.visible = !place;
          good.visible = place; bad.visible = t > 6; no.visible = t > 6 && Math.sin(t * 6) > -0.5;
        },
        cameraPath: function (t) {
          var a = { pos: new THREE.Vector3(1.7, 1.35, 2.4), target: new THREE.Vector3(0.4, 1.0, 0) };
          var b = { pos: new THREE.Vector3(1.45, 1.35, 0.9), target: new THREE.Vector3(1.4, 0.85, 0) };
          var k = T.seg(t, 3.8, 4.6);
          return { pos: a.pos.lerp(b.pos, k), target: a.target.lerp(b.target, k) };
        },
        labels: [
          { text: V('Kryt airbagu od těla', 'Airbag cover away from body'), at: function () { return abG.position.clone().add(new THREE.Vector3(0.05, 0.12, 0)); }, show: [0.3, 4.4], level: 'accent' },
          { text: V('✔ krytem NAHORU', '✔ cover facing UP'), at: [1.25, 0.95, 0], show: [4.8, 9], level: 'ok' },
          { text: V('✖ nikdy krytem dolů', '✖ never cover down'), at: [1.6, 1.08, 0], show: [6, 9], level: 'danger' }
        ],
        captions: [
          { text: V('Nést krytem od těla – při vystřelení nezraní', 'Carry with the cover away from you – safe if it deploys') },
          { text: V('Nic na něj nepokládat, mimo teplo a děti', 'Put nothing on it, away from heat and children'), level: 'danger', show: [4.5, 9] },
          { text: V('Upuštěný / poškozený airbag nepoužívat', 'Never reuse a dropped / damaged airbag'), level: 'info', show: [6.5, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ bolt */
  R('steer.bolt', {
    duration: 8, camera: CAM_F, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, rig = steeringRig(ctx, K);
      rig.airbag.visible = false;
      rig.wheelMark.visible = true; rig.shaftMark.visible = true;
      var tool = K.P.breakerBar(0.3); tool.rotation.x = PI / 2; var holder = new THREE.Group(); holder.add(tool); tool.position.z = 0.05; rig.bolt.add(holder);
      var arrow = K.FX.rotArrow(0.035, 'ccw', 0xf5a524, 220, 0.003); arrow.position.z = 0.025; rig.bolt.add(arrow);
      return {
        root: rig.root,
        update: function (t) {
          var k = T.seg(t, 1.5, 4.5);
          holder.rotation.z = -0.3 + k * 2.4;
          rig.bolt.position.z = k * 0.012;
          holder.visible = t > 1.2 && t < 5.5;
          arrow.visible = holder.visible;
        },
        labels: [
          { text: V('značky', 'marks'), at: function () { return rig.wheelMark.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.02, 0)); }, show: [0, 1.5], level: 'accent' },
          { text: V('pár závitů nechat!', 'leave a few threads!'), at: function () { return rig.bolt.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.04, 0)); }, show: [5, 8], level: 'danger' }
        ],
        captions: [
          { text: V('Značka na hřídeli a volantu, pak povolit šroub', 'Mark shaft and wheel, then loosen the bolt') },
          { text: V('Šroub nechat pár závitů – volant nespadne', 'Leave the bolt in a few threads – the wheel cannot fly off'), level: 'info', show: [4.5, 8] },
          { text: V('Pružný šroub = vždy nový', 'Stretch bolt = always new'), level: 'danger', show: [6, 8] }
        ]
      };
    }
  });

  /* ---------------------------------------------------------------- puller */
  R('steer.puller', {
    duration: 8, camera: { pos: [0.55, 1.25, 0.6], target: [0, 1.0, 0], fov: 34 }, shadow: 1, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, rig = steeringRig(ctx, K);
      rig.airbag.visible = false;
      rig.bolt.position.z = 0.012;
      var gl = [-1, 1].map(function (s) { var g = K.P.glove(); g.scale.setScalar(0.9); g.rotation.set(0, 0, s * PI / 2); g.position.set(s * 0.19, 0, 0.03); rig.wheel.add(g); return g; });
      return {
        root: rig.root,
        update: function (t) {
          var rock = Math.sin(t * 7) * 0.05 * (t > 0.8 && t < 5.5 ? 1 : 0);
          rig.wheel.rotation.z = rock;
          rig.wheel.position.z = T.seg(t, 1.0, 5.5) * 0.011;
        },
        labels: [{ text: V('šroub drží volant', 'bolt still holds the wheel'), at: function () { return rig.bolt.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.04, 0)); }, show: [3, 8], level: 'ok' }],
        captions: [
          { text: V('Kolébat a táhnout oběma rukama k sobě', 'Rock and pull towards you with both hands') },
          { text: V('Netlouct kladivem – poškodí deformační sloupek', 'Never hammer – it damages the collapsible column'), level: 'danger', show: [2, 8] },
          { text: V('Pak šroub vyšroubovat, volant sundat, kabely provléct', 'Then remove the bolt, lift the wheel off, feed the wires through'), level: 'info', show: [5.5, 8] }
        ]
      };
    }
  });

  /* ----------------------------------------------------------- clock spring */
  R('steer.clockspring', {
    duration: 8, camera: { pos: [0.22, 1.2, 0.42], target: [0, 1.0, -0.02], fov: 32 }, shadow: 1, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, rig = steeringRig(ctx, K);
      rig.wheel.visible = false;
      var tapes = [];
      [0.4, -0.5].forEach(function (a) {
        var tp = K.mesh(K.G.box(0.11, 0.018, 0.002), K.M.clone('tape')); tp.rotation.z = a; tp.position.set(0, 0, 0.012); rig.clock.add(tp); tapes.push(tp);
      });
      var ghost = K.FX.rotArrow(0.09, 'cw', 0xe5484d, 200, 0.004); ghost.position.z = 0.03; rig.clock.add(ghost);
      var no = new THREE.Group();
      [1, -1].forEach(function (s) { var b = K.mesh(K.G.box(0.05, 0.008, 0.008), 'hiDanger'); b.rotation.z = s * PI / 4; no.add(b); });
      no.position.set(0.09, 0.07, 0.04); rig.clock.add(no);
      return {
        root: rig.root,
        update: function (t) {
          tapes.forEach(function (tp, i) { var k = T.seg(t, 0.6 + i * 1.0, 1.4 + i * 1.0); tp.scale.x = Math.max(0.01, k); tp.visible = k > 0.01; });
          var try_ = t > 3.5 && t < 6.5; ghost.visible = try_; no.visible = try_ && Math.sin(t * 6) > -0.4;
          rig.rotor.rotation.z = try_ ? Math.sin(t * 8) * 0.03 : 0;
        },
        labels: [{ text: V('spirální kabel (clock spring)', 'clock spring (spiral cable)'), at: function () { return rig.clock.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.1, 0)); }, show: [0, 3.5] }],
        captions: [
          { text: V('Spirální kabel (clock spring) přelepit páskou', 'Tape the clock spring (spiral cable) in place') },
          { text: V('Neotáčet! Jinak se kabel přetrhne → airbag nefunguje', 'Do not rotate! Otherwise the cable breaks → airbag fails'), level: 'danger', show: [3, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------ refit */
  R('steer.refit', {
    duration: 9, camera: { pos: [0.5, 1.22, 0.65], target: [0, 1.0, 0], fov: 34 }, shadow: 1, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, rig = steeringRig(ctx, K);
      rig.airbag.visible = false; rig.wheelMark.visible = true; rig.shaftMark.visible = true;
      var gw = K.FX.glow(rig.wheelMark, 0x30a46c), gs = K.FX.glow(rig.shaftMark, 0x30a46c);
      var tw = K.P.torqueWrench(0.36); tw.rotation.x = PI / 2; var holder = new THREE.Group(); holder.add(tw); tw.position.z = 0.05; rig.bolt.add(holder);
      var tq = TORQ[ctx.vehicle] || V('moment dle příručky', 'torque per manual');
      return {
        root: rig.root,
        update: function (t) {
          var on = T.seg(t, 0.5, 3.0);
          rig.wheel.position.z = (1 - on) * 0.18;
          var al = T.seg(t, 3.0, 3.6); gw(al); gs(al);
          rig.bolt.position.z = (1 - T.seg(t, 4.0, 5.0)) * 0.03;
          holder.visible = t > 5.2 && t < 8.6;
          holder.rotation.z = -0.3 - T.seg(t, 5.6, 7.2) * 0.7;
        },
        labels: [
          { text: V('značky zarovnat', 'align the marks'), at: function () { return rig.wheelMark.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.025, 0)); }, show: [2.6, 5], level: 'ok' },
          { text: tq, at: function () { return rig.bolt.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.12, 0.05, 0)); }, show: [6.8, 9], level: 'accent' }
        ],
        captions: [
          { text: V('Značky zarovnat, volant nasadit, kola rovně', 'Align the marks, fit the wheel, wheels straight') },
          { text: V('Kabely protáhnout – nic nesmí být přiskřípnuté', 'Route the wires – nothing may get pinched'), level: 'info', show: [2, 9] },
          { text: V('Pružný šroub = vždy nový', 'Stretch bolt = always new'), level: 'danger', show: [5, 9] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------------- test */
  function lampIcon(c, W, H, on) {
    c.fillStyle = '#0b0d11'; c.fillRect(0, 0, W, H);
    var col = on ? '#ff3b30' : '#2a2e36';
    c.fillStyle = col; c.strokeStyle = col; c.lineWidth = W * 0.03;
    c.beginPath(); c.arc(W * 0.4, H * 0.28, W * 0.07, 0, PI * 2); c.fill();
    c.beginPath(); c.moveTo(W * 0.32, H * 0.4); c.lineTo(W * 0.46, H * 0.4); c.lineTo(W * 0.5, H * 0.62); c.lineTo(W * 0.42, H * 0.62); c.lineTo(W * 0.4, H * 0.82); c.lineTo(W * 0.3, H * 0.82); c.closePath(); c.fill();
    c.beginPath(); c.arc(W * 0.66, H * 0.5, W * 0.13, 0, PI * 2); c.fill();
  }
  R('steer.test', {
    duration: 8, camera: { pos: [0.06, 1.33, 0.36], target: [0.04, 1.12, -0.26], fov: 34 }, shadow: 1, thumbT: 2,
    build: function (ctx, K) {
      var T = K.T, rig = steeringRig(ctx, K);
      var lamp = K.FX.canvasPanel(0.06, 0.05, function (c, W, H, st) { lampIcon(c, W, H, st && st.on); }, { state: { on: true } });
      lamp.position.set(0.07, 0.2, -0.168); rig.col.add(lamp);
      var check = K.mesh(K.G.sphere(0.014, 16), 'hiOk'); check.position.set(0.12, 0.2, -0.165); rig.col.add(check);
      return {
        root: rig.root,
        update: function (t) { var on = t > 0.6 && t < 3.6; lamp.userData.redraw({ on: on }); check.visible = t > 3.8; },
        labels: [
          { text: V('kontrolka airbagu', 'airbag warning light'), at: function () { return lamp.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.035, 0)); }, show: [0.6, 3.6], level: 'danger' },
          { text: V('✔ kontrolka zhasla', '✔ light went out'), at: function () { return lamp.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.035, 0)); }, show: [3.8, 8], level: 'ok' }
        ],
        captions: [
          { text: V('Nikdo ve voze, baterii připojit, zapalování ZAP', 'Nobody in the car, connect battery, ignition ON') },
          { text: V('Kontrolka airbagu musí po pár s zhasnout', 'The airbag light must go out after a few seconds'), show: [2, 8] },
          { text: V('Svítí dál? Nejezdit – načíst chyby', 'Stays on? Do not drive – read fault codes'), level: 'danger', show: [4.5, 8] },
          { text: V('Vyzkoušet klakson, tlačítka, vyhřívání, pádla', 'Test horn, buttons, heating, paddles'), level: 'info', show: [6, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------- calibrate */
  R('steer.calibrate', {
    duration: 8, camera: { pos: [0.45, 1.22, 0.8], target: [0.18, 0.98, 0.15], fov: 34 }, shadow: 1, thumbT: 6.5,
    build: function (ctx, K) {
      var T = K.T, rig = steeringRig(ctx, K);
      var dev = new THREE.Group(); dev.position.set(0.32, 0.95, 0.3); dev.rotation.set(-0.5, -0.4, 0); rig.root.add(dev);
      var body = K.mesh(K.G.rbox(0.2, 0.14, 0.03, 0.015), 'toolYellow'); dev.add(body);
      var tool = TOOL[ctx.vehicle] || S.t(V('Diagnostika', 'Scan tool'));
      var scr = K.FX.canvasPanel(0.17, 0.11, function (c, W, H, st) {
        var k = st ? st.k : 0;
        c.fillStyle = '#0d1a24'; c.fillRect(0, 0, W, H);
        c.fillStyle = '#9fc7e8'; c.font = 'bold ' + Math.round(H * 0.13) + 'px sans-serif'; c.fillText(tool, W * 0.06, H * 0.18);
        c.fillStyle = '#e9edf3'; c.font = Math.round(H * 0.11) + 'px sans-serif'; c.fillText(S.t(V('Snímač úhlu natočení', 'Steering angle sensor')), W * 0.06, H * 0.36);
        c.fillStyle = '#2b3a48'; c.fillRect(W * 0.06, H * 0.48, W * 0.88, H * 0.1); c.fillStyle = '#30a46c'; c.fillRect(W * 0.06, H * 0.48, W * 0.88 * k, H * 0.1);
        if (k >= 1) { c.fillStyle = '#6dff9a'; c.font = 'bold ' + Math.round(H * 0.15) + 'px sans-serif'; c.fillText(S.t(V('0,0° · kalibrováno ✔', '0.0° · calibrated ✔')), W * 0.06, H * 0.82); }
      }, { state: { k: 0 } });
      scr.position.z = 0.016; dev.add(scr);
      var cbl = K.mesh(K.G.tube([[0.32, 0.88, 0.3], [0.3, 0.7, 0.25], [0.15, 0.6, 0.0], [0.05, 0.62, -0.2]], 0.006), 'plasticBlack'); rig.root.add(cbl);
      return {
        root: rig.root,
        update: function (t) { scr.userData.redraw({ k: Math.round(T.seg(t, 1.0, 5.5) * 20) / 20 }); },
        captions: [
          { text: V('Kola rovně, vůz stojí', 'Wheels straight, car stationary') },
          { text: V('Bez kalibrace: chyba ESP, asistenty nefungují', 'Without calibration: ESP fault, assists do not work'), level: 'danger', show: [2, 8] },
          ctx.vehicle === 'volvo-xc60-b4' ? { text: V('XC60: VIDA – také snímač držení volantu (Pilot Assist)', 'XC60: VIDA – also the hands-on sensor (Pilot Assist)'), level: 'info', show: [4, 8] } : { text: V('Pak zkušební jízda: volant rovně při jízdě rovně', 'Then a test drive: wheel straight when driving straight'), level: 'info', show: [5.5, 8] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ track only */
  R('steer.trackOnly', {
    duration: 8, camera: { pos: [0.55, 1.25, 0.85], target: [0.15, 1.0, 0], fov: 36 }, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, rig = steeringRig(ctx, K, { track: true });
      var qr = K.mesh(K.G.cylZ(0.035, 0.05, 32), 'alu'); qr.position.z = 0.0; rig.wheel.add(qr);
      var ring = K.mesh(K.G.torus(0.035, 0.006, PI * 2, 32), K.M.clone('toolBlue')); ring.position.z = 0.02; rig.wheel.add(ring);
      // checkered flag
      var fg = new THREE.PlaneGeometry(0.3, 0.2, 20, 12);
      var fp = fg.attributes.position, fx = [];
      for (var i = 0; i < fp.count; i++) fx.push(fp.getX(i));
      var cnv = document.createElement('canvas'); cnv.width = 120; cnv.height = 80;
      var c2 = cnv.getContext('2d');
      for (var a = 0; a < 6; a++) for (var b = 0; b < 4; b++) { c2.fillStyle = (a + b) % 2 ? '#111' : '#f4f4f4'; c2.fillRect(a * 20, b * 20, 20, 20); }
      var ft = new THREE.CanvasTexture(cnv); ft.encoding = THREE.sRGBEncoding;
      var flag = new THREE.Mesh(fg, new THREE.MeshStandardMaterial({ map: ft, side: THREE.DoubleSide, roughness: 0.8 }));
      flag.position.set(0.45, 1.25, -0.1); rig.root.add(flag);
      var pole = K.mesh(K.G.cyl(0.006, 0.6, 12), 'steel'); pole.position.set(0.3, 1.05, -0.1); rig.root.add(pole);
      var sign = K.FX.canvasPanel(0.3, 0.12, function (c, W, H) {
        c.fillStyle = '#16191f'; c.fillRect(0, 0, W, H);
        c.font = 'bold ' + Math.round(H * 0.3) + 'px sans-serif'; c.textBaseline = 'middle';
        c.fillStyle = '#30a46c'; c.fillText('✔ ' + S.t(V('Okruh: OK', 'Track: OK')), W * 0.05, H * 0.3);
        c.fillStyle = '#ff5a5a'; c.fillText('✖ ' + S.t(V('Silnice: NE', 'Road: NO')), W * 0.05, H * 0.72);
      });
      sign.position.set(-0.36, 1.12, -0.05); sign.rotation.y = 0.35; rig.root.add(sign);
      return {
        root: rig.root,
        update: function (t) {
          for (var q = 0; q < fp.count; q++) { var x = fx[q] + 0.15; fp.setZ(q, Math.sin(x * 18 - t * 6) * 0.015 * x * 4); }
          fp.needsUpdate = true; fg.computeVertexNormals();
          rig.wheel.position.z = T.pulse(t, 2, 4) * 0.05;
        },
        labels: [{ text: V('rychloupínák', 'quick release'), at: function () { return qr.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.05, 0)); }, show: [1.5, 5], level: 'accent' }],
        captions: [
          { text: V('Volant bez airbagu = jen okruh, ne provoz', 'Wheel without airbag = track only, not public roads'), level: 'danger' },
          { text: V('Náboj / rychloupínák jen certifikovaný pro váš vůz', 'Hub / quick release only certified for your car'), level: 'info', show: [2, 8] },
          { text: V('Odpor místo airbagu ≠ legální – airbag pak nechrání', 'A resistor instead of the airbag ≠ legal – no airbag protection'), show: [4, 8] }
        ]
      };
    }
  });
})(window.STU);
