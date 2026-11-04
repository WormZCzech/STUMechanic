/* 3D scenes: engine & gearbox mounts. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  /** Rubber/hydro mount: lower bracket, rubber body, top stud plate. Origin at bottom, axis Y. userData.setSquash(k) */
  function hydroMount(K, opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var base = K.mesh(K.G.rbox(0.13, 0.025, 0.1, 0.008), 'castIron'); base.position.y = 0.0125; g.add(base);
    var cup = K.mesh(K.G.cyl(0.045, 0.05, 32), 'aluCast'); cup.position.y = 0.05; g.add(cup);
    var rubber = new THREE.Group();
    var rb = K.mesh(K.G.lathe([[0.042, 0], [0.046, 0.01], [0.04, 0.03], [0.028, 0.045], [0.02, 0.05], [0, 0.05]], 32), opts.worn ? K.M.clone('rubber', { color: 0x2a2621 }) : 'rubber');
    rubber.add(rb); rubber.position.y = 0.075; g.add(rubber);
    var top = new THREE.Group();
    var plate = K.mesh(K.G.rbox(0.1, 0.012, 0.07, 0.005), 'steelDark'); top.add(plate);
    var stud = K.mesh(K.G.cyl(0.007, 0.03, 12), 'zinc'); stud.position.y = 0.02; top.add(stud);
    var nut = K.mesh(K.G.hex(0.011, 0.01), 'zinc'); nut.position.y = 0.012; top.add(nut);
    top.position.y = 0.13; g.add(top);
    if (opts.worn) {
      for (var i = 0; i < 5; i++) { var c = K.mesh(K.G.box(0.002, 0.012, 0.03), 'plasticWhite'); var a = i * 1.2; c.position.set(Math.cos(a) * 0.043, 0.085, Math.sin(a) * 0.043); c.rotation.y = -a; g.add(c); }
    }
    g.userData = {
      top: top, rubber: rubber, nut: nut,
      setSquash: function (k) { rubber.scale.y = 1 - k * 0.35; top.position.y = 0.13 - k * 0.018; }
    };
    return g;
  }

  /** Torque-reaction rod (dog-bone) between two bushings along X. */
  function dogBone(K, len, worn) {
    var g = new THREE.Group();
    var bar = K.mesh(K.G.rbox(len, 0.03, 0.035, 0.008), 'castIron'); g.add(bar);
    [-1, 1].forEach(function (s, i) {
      var eye = K.mesh(K.G.cylZ(0.032 - i * 0.008, 0.04, 24), 'castIron'); eye.position.x = s * len / 2; g.add(eye);
      var bush = K.mesh(K.G.cylZ(0.024 - i * 0.006, 0.042, 24), worn && i === 0 ? K.M.clone('rubber', { color: 0x2a2621 }) : 'rubber'); bush.position.x = s * len / 2; g.add(bush);
      var sleeve = K.mesh(K.G.cylZ(0.008, 0.05, 16), 'zinc'); sleeve.position.x = s * len / 2; g.add(sleeve);
      if (worn && i === 0) for (var c = 0; c < 4; c++) { var cr = K.mesh(K.G.box(0.002, 0.012, 0.043), 'plasticWhite'); cr.position.set(s * len / 2 + Math.cos(c) * 0.016, Math.sin(c) * 0.016, 0); cr.rotation.z = c; g.add(cr); }
    });
    return g;
  }

  /** Powertrain on mounts. transverse: crank axis along car width (scene X), longitudinal: CL 500.
   *  returns {root, pt (rocking group), mounts:[{obj, ud, kind, at}], setRock(a), dog} */
  function mountRig(K, vid) {
    var root = new THREE.Group();
    var longi = vid === 'mb-cl500-c216';
    var pt = new THREE.Group(); // powertrain pivot at crank height
    var eng = K.P.engine({ cyl: vid === 'toyota-gr-yaris' ? 3 : 4 });
    var len = eng.userData.len;
    eng.position.set(0, -0.2, 0); pt.add(eng);
    var box = new THREE.Group();
    var bell = K.mesh(K.G.cylX(0.17, 0.12, 32, 0.14), 'aluCast'); bell.position.x = 0.06; box.add(bell);
    var gcase = K.mesh(K.G.rbox(0.3, 0.26, 0.24, 0.04), 'aluCast'); gcase.position.set(0.25, -0.02, 0); box.add(gcase);
    box.position.set(len / 2, 0.02, 0); pt.add(box);
    pt.position.set(-0.15, 0.4, 0);
    root.add(pt);
    var sub = K.mesh(K.G.rbox(longi ? 0.2 : 1.3, 0.06, longi ? 0.9 : 0.12, 0.02), 'blackOxide'); sub.position.set(0.1, 0.03, longi ? 0 : -0.35); root.add(sub);
    var mounts = [];
    if (longi) {
      [-1, 1].forEach(function (s) {
        var m = hydroMount(K); m.position.set(-0.05, 0.08, s * 0.24); root.add(m);
        mounts.push({ obj: m, ud: m.userData, kind: 'engine', side: s, l: V(s > 0 ? 'Motor – levý držák' : 'Motor – pravý držák', s > 0 ? 'Engine mount – left' : 'Engine mount – right') });
      });
      var tm = hydroMount(K); tm.scale.setScalar(0.8); tm.position.set(len / 2 + 0.25, 0.1, 0); root.add(tm);
      mounts.push({ obj: tm, ud: tm.userData, kind: 'gearbox', l: V('Držák převodovky', 'Transmission mount') });
    } else {
      var rm = hydroMount(K); rm.position.set(-0.15 - len / 2 + 0.05, 0.42, 0.18); root.add(rm);
      mounts.push({ obj: rm, ud: rm.userData, kind: 'engine', l: V('Pravý (hydro) držák motoru', 'Right (hydro) engine mount') });
      var lm = hydroMount(K); lm.scale.setScalar(0.85); lm.position.set(-0.15 + len / 2 + 0.3, 0.45, 0.16); root.add(lm);
      mounts.push({ obj: lm, ud: lm.userData, kind: 'gearbox', l: V('Levý držák (převodovka)', 'Left mount (gearbox)') });
    }
    var dog = null;
    if (!longi) {
      dog = dogBone(K, 0.22, false); dog.position.set(0.25, 0.12, -0.25); dog.rotation.y = PI / 2; root.add(dog);
      mounts.push({ obj: dog, kind: 'dog', l: V('Spodní reakční vzpěra („kost“)', 'Lower torque rod ("dog-bone")') });
    }
    return {
      root: root, pt: pt, mounts: mounts, dog: dog, longi: longi, len: len,
      setRock: function (a, up) {
        if (longi) { pt.rotation.x = a; } else { pt.rotation.z = 0; pt.rotation.x = a; }
        pt.position.y = 0.4 + (up || 0);
        mounts.forEach(function (m) { if (m.ud) m.ud.setSquash(Math.max(0, -a * 6 * (m.side || 1)) + Math.abs(up || 0) * 3); });
        if (dog) dog.position.y = 0.12 + a * 0.15;
      }
    };
  }
  function at(o, off) { return function () { var v = o.getWorldPosition(new THREE.Vector3()); return v.add(new THREE.Vector3(off[0], off[1], off[2])); }; }

  var CAM = { pos: [1.0, 1.35, 2.4], target: [0.1, 0.45, 0], fov: 36 };

  R('engine-mounts.overview', {
    duration: 8, camera: CAM, shadow: 1.2, thumbT: 2,
    build: function (ctx, K) {
      var rig = mountRig(K, ctx.vehicle);
      var glows = rig.mounts.map(function (m) { return K.FX.glow(m.obj, 0xf5a524); });
      return {
        root: rig.root,
        update: function (t) {
          rig.setRock(Math.sin(t * 50) * 0.002);
          var i = Math.floor(t / (8 / glows.length)) % glows.length;
          glows.forEach(function (g, j) { g(j === i ? 0.6 : 0); });
        },
        labels: rig.mounts.map(function (m) { return { text: m.l, at: at(m.obj, [0, 0.2, 0.02]), level: 'accent' }; }),
        captions: [
          { text: rig.longi ? V('Podélný V8: dva držáky motoru + držák převodovky', 'Longitudinal V8: two engine mounts + transmission mount') : V('Napříč uložený motor: pravý, levý držák a spodní reakční vzpěra', 'Transverse engine: right, left mount and a lower torque rod') },
          { text: V('Pryž tlumí vibrace a drží motor proti kroutícímu momentu', 'Rubber damps vibration and holds the engine against torque'), level: 'info', show: [3, 8] }
        ]
      };
    }
  });

  R('engine-mounts.symptoms', {
    duration: 9, camera: CAM, shadow: 1.2, thumbT: 2.2,
    build: function (ctx, K) {
      var T = K.T, rig = mountRig(K, ctx.vehicle);
      return {
        root: rig.root,
        update: function (t) {
          var a;
          if (t < 4) a = -T.pulse(t, 1, 2.6) * 0.09 + T.pulse(t, 2.6, 3.4) * 0.03;          // take-off: big rock + clunk back
          else a = Math.sin(t * 45) * 0.012 * T.seg(t, 4.5, 5);                               // idle shake
          rig.setRock(a);
        },
        labels: [
          { text: V('„Ťuk!“ při rozjezdu / řazení', '"Clunk!" on take-off / gear change'), at: at(rig.pt, [0, 0.45, 0]), show: [1.5, 3.6], level: 'danger' },
          { text: V('Vibrace na volnoběh', 'Vibration at idle'), at: at(rig.pt, [0, 0.45, 0]), show: [5, 9], level: 'accent' }
        ],
        captions: [
          { text: V('Příznaky: rána při rozjezdu, přeřazení, přechodu plyn/brzda motorem', 'Symptoms: clunk on take-off, gear change, on/off throttle') },
          { text: V('Zvýšené vibrace volantu a karoserie na volnoběh, motor se viditelně kývá', 'More vibration in steering wheel and body at idle, engine visibly rocks'), show: [4.5, 9] }
        ]
      };
    }
  });

  R('engine-mounts.inspect', {
    duration: 8, camera: { pos: [0.22, 0.24, 0.36], target: [0, 0.08, 0], fov: 34 }, shadow: 0.5, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var m = hydroMount(K, { worn: true }); root.add(m);
      m.userData.setSquash(0.5);
      var leak = K.FX.drops(K.M.oilOld, 5, 0.06, 0.004); leak.group.position.set(0.04, 0.06, 0.03); root.add(leak.group);
      var stain = K.mesh(K.G.cyl(0.03, 0.001, 20), K.M.clone('oilOld', { opacity: 0.7 })); stain.position.set(0.04, 0.026, 0.03); root.add(stain);
      var dog = dogBone(K, 0.18, true); dog.position.set(0.0, 0.05, -0.14); root.add(dog);
      return {
        root: root,
        update: function (t) { leak.update(t, true); },
        labels: [
          { text: V('Trhliny v pryži', 'Cracked rubber'), at: [-0.05, 0.11, 0.05], show: [0.5, 8], level: 'danger' },
          { text: V('Únik náplně hydrodržáku', 'Hydro mount fluid leak'), at: [0.05, 0.05, 0.05], show: [2, 8], level: 'danger' },
          { text: V('Roztržené pouzdro vzpěry', 'Torn torque-rod bush'), at: [-0.09, 0.09, -0.14], show: [3.5, 8], level: 'danger' }
        ],
        captions: [
          { text: V('Vizuálně: trhliny, odtržená pryž, olejová skvrna, pokleslý držák', 'Visual: cracks, separated rubber, oily stain, sagging mount') },
          { text: V('Svítilnou a zrcátkem – motor vypnutý a studený', 'With a torch and mirror – engine off and cold'), level: 'info', show: [4, 8] }
        ]
      };
    }
  });

  R('engine-mounts.helper', {
    duration: 10, camera: { pos: [1.2, 1.2, 2.2], target: [0.1, 0.42, 0], fov: 36 }, shadow: 1.2, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, rig = mountRig(K, ctx.vehicle);
      var bar = new THREE.Group(); var bb = K.mesh(K.G.cyl(0.01, 0.6, 12), 'steelDark'); bb.position.y = 0.3; bar.add(bb);
      var grip = K.mesh(K.G.cyl(0.015, 0.12, 12), 'toolRed'); grip.position.y = 0.58; bar.add(grip);
      bar.position.set(0.32, 0.06, -0.1); rig.root.add(bar);
      return {
        root: rig.root,
        update: function (t) {
          if (t < 5) { var k = Math.sin(T.lin(t, 0.8, 4.5) * PI * 4) * T.pulse(t, 0.8, 4.5); bar.rotation.x = k * 0.15; rig.setRock(k * 0.02, k * 0.006); bar.visible = true; }
          else { bar.visible = false; var b = T.pulse(t, 5.6, 6.6) + T.pulse(t, 7.4, 8.4); rig.setRock(-b * 0.06); }
        },
        labels: [
          { text: V('Páčení: motor se nesmí výrazně hnout', 'Levering: the engine must not move much'), at: at(rig.pt, [0.3, 0.3, 0]), show: [0.8, 4.5], level: 'accent' },
          { text: V('Krátké přidání plynu v neutrálu', 'Short throttle blip in neutral'), at: at(rig.pt, [0, 0.45, 0]), show: [5.5, 9], level: 'accent' }
        ],
        captions: [
          { text: V('Motor vypnutý: páčidlem mezi pomocným rámem a převodovkou zkuste pohyb', 'Engine off: try for movement with a bar between subframe and gearbox') },
          { text: V('Pomocník: parkovací brzda, NEUTRÁL, krátké přidání plynu – vy jen sledujete', 'Helper: parking brake, NEUTRAL, short blips – you only watch'), level: 'info', show: [5, 10] },
          { text: V('Nikdo před ani za vozem, ruce pryč od řemenů a ventilátoru!', 'Nobody in front of or behind the car, hands away from belts and fan!'), level: 'danger', show: [5, 10] }
        ]
      };
    }
  });

  R('engine-mounts.support', {
    duration: 9, camera: { pos: [1.4, 1.5, 2.6], target: [0.05, 0.55, 0], fov: 36 }, shadow: 1.2, thumbT: 6,
    build: function (ctx, K) {
      var T = K.T, rig = mountRig(K, ctx.vehicle);
      var beam = new THREE.Group();
      var b = K.mesh(K.G.rbox(0.05, 0.06, 1.5, 0.01), 'jackRed'); beam.add(b);
      [-1, 1].forEach(function (s) { var leg = K.mesh(K.G.rbox(0.12, 0.08, 0.1, 0.02), 'rubber'); leg.position.set(0, -0.06, s * 0.7); beam.add(leg); });
      var hook = K.mesh(K.G.tube([[0, -0.03, 0], [0, -0.15, 0], [0.02, -0.25, 0.02]], 0.006), 'steel'); beam.add(hook);
      var chain = K.mesh(K.G.cyl(0.004, 0.18, 8), 'steelDark'); chain.position.y = -0.12; beam.add(chain);
      beam.position.set(-0.1, 1.15, 0); rig.root.add(beam);
      var jack = K.P.trolleyJack(); jack.position.set(-0.2, 0, 0.62); jack.rotation.y = PI / 2; rig.root.add(jack);
      var wood = K.mesh(K.G.box(0.16, 0.04, 0.12), 'wood'); rig.root.add(wood);
      return {
        root: rig.root,
        update: function (t) {
          var down = T.seg(t, 0.5, 2.5);
          beam.position.y = 1.4 - down * 0.25;
          var jk = T.seg(t, 3, 5);
          jack.userData.setLift(0.15 + jk * 0.35);
          var sl = jack.userData.saddleLocal(0.15 + jk * 0.35);
          wood.position.set(-0.2, sl.y + 0.02, 0.62 - sl.x);
          rig.setRock(0, jk * 0.004);
        },
        captions: [
          { text: V('Před povolením držáku motor podepřít – traverzou shora nebo heverem s dřevem pod vanou', 'Support the engine before undoing a mount – a support bar above or a jack with wood under the sump') },
          { text: V('Jen lehce odlehčit – nezvedat motor, ohnete vanu / natrhnete hadice', 'Just take the weight – do not lift the engine, you would bend the sump / pull hoses'), level: 'warning', show: [3, 9] },
          { text: V('Nikdy nesahat pod motor, který visí jen na heveru', 'Never reach under an engine that hangs on a jack only'), level: 'danger', show: [5.5, 9] }
        ]
      };
    }
  });

  R('engine-mounts.replace', {
    duration: 10, camera: { pos: [0.4, 0.42, 0.7], target: [0, 0.08, 0], fov: 34 }, shadow: 0.6, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var longi = ctx.vehicle === 'mb-cl500-c216';
      var oldM = longi ? hydroMount(K, { worn: true }) : dogBone(K, 0.22, true);
      var newM = longi ? hydroMount(K) : dogBone(K, 0.22, false);
      var sub = K.mesh(K.G.rbox(0.4, 0.05, 0.16, 0.01), 'blackOxide'); sub.position.y = -0.02; root.add(sub);
      root.add(oldM); root.add(newM);
      var bolts = [];
      (longi ? [[0.05, 0.03, 0.035], [-0.05, 0.03, -0.035]] : [[-0.11, 0, 0.03], [0.11, 0, 0.03]]).forEach(function (p) {
        var b = K.P.bolt({ r: 0.006, len: 0.06 }); if (!longi) b.rotation.x = PI / 2; b.position.set(p[0], p[1], p[2]); root.add(b); b.userData.base = b.position.clone(); bolts.push(b);
      });
      var rat = K.P.ratchet(0.25); if (!longi) rat.rotation.x = PI / 2; var hold = new THREE.Group(); hold.add(rat); root.add(hold);
      oldM.position.y = longi ? 0 : 0.06; newM.position.y = oldM.position.y;
      return {
        root: root,
        update: function (t) {
          bolts.forEach(function (b, i) {
            var out = T.seg(t, 0.5 + i * 1.2, 1.5 + i * 1.2), back = T.seg(t, 6.2 + i * 0.8, 7 + i * 0.8);
            var k = out * (1 - back);
            var dir = longi ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1);
            b.position.copy(b.userData.base).add(dir.multiplyScalar(k * 0.08));
            b.visible = !(T.between(t, 3.0, 6.2));
          });
          var bi = t < 1.7 ? 0 : (t < 3 ? 1 : (t < 7 ? 0 : 1));
          hold.position.copy(bolts[bi].position); hold.rotation.set(0, 0, 0);
          hold.rotation[longi ? 'y' : 'z'] = -t * 2;
          hold.visible = !T.between(t, 2.9, 6.1);
          var away = T.seg(t, 3.0, 4.0), inn = T.seg(t, 4.6, 5.8);
          oldM.position.x = away * 0.5; oldM.visible = away < 0.99;
          newM.position.x = -(1 - inn) * 0.5; newM.visible = t > 4.4;
        },
        labels: [
          { text: V('Starý – trhliny v pryži', 'Old – cracked rubber'), at: function () { return oldM.position.clone().add(new THREE.Vector3(0, 0.12, 0)); }, show: [3, 4], level: 'danger' },
          { text: V('Nové šrouby, pokud jsou předepsané', 'New bolts if specified'), at: [0, 0.14, 0], show: [5.8, 10], level: 'ok' }
        ],
        captions: [
          { text: longi ? V('Motor podepřený, matice držáku dolů, držák vyměnit (ověřit postup WIS)', 'Engine supported, undo the mount nuts, swap the mount (verify WIS procedure)') : V('Reakční vzpěra: 2 šrouby, vyměnit – nejčastější vadný držák', 'Torque rod: 2 bolts, swap – the most commonly failed mount') },
          { text: V('Šrouby držáků bývají na jedno použití – vždy dle příručky', 'Mount bolts are often single-use – always per manual'), level: 'warning', show: [5, 10] }
        ]
      };
    }
  });

  R('engine-mounts.torque', {
    duration: 8, camera: { pos: [-0.35, 0.45, 0.6], target: [0, 0.12, 0], fov: 34 }, shadow: 0.6, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var m = hydroMount(K); root.add(m);
      var tw = K.P.torqueWrench(0.35); var hold = new THREE.Group(); hold.add(tw); root.add(hold);
      return {
        root: root,
        update: function (t) {
          hold.position.copy(m.userData.top.position).add(new THREE.Vector3(0, 0.03, 0));
          hold.rotation.y = -0.5 - T.seg(t % 4, 0.5, 2.5) * 0.6;
        },
        labels: [{ text: V('„klik“ – moment dle příručky', '"click" – torque per manual'), at: [0, 0.22, 0], show: [2.5, 4], level: 'ok' }],
        captions: [
          { text: V('Dotahovat až s motorem ve své poloze (často vůz na kolech) – jinak pnutí a vibrace', 'Tighten with the engine in its natural position (often car on its wheels) – otherwise preload and vibration') },
          { text: V('Hodnoty momentu ověřte pro váš motor – neodhadovat', 'Verify the torque values for your engine – never guess'), level: 'warning', show: [4, 8] }
        ]
      };
    }
  });
})(window.STU);
