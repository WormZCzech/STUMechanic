/* 3D scenes: engine air filter & cabin (pollen) filter. */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };

  /** Panel air filter: rubber seal frame + pleats. Lies flat (XZ), size w × d, height h. */
  function panelFilter(K, w, d, h, dirty, carbon) {
    var g = new THREE.Group();
    var frame = K.mesh(K.G.rbox(w, h * 0.35, d, 0.006), carbon ? 'plasticBlack' : K.M.clone('rubber', { color: 0xd7781f })); frame.position.y = h * 0.15; g.add(frame);
    var n = Math.floor(w / 0.012);
    var mat = carbon ? (dirty ? 'castIron' : 'blackOxide') : (dirty ? 'paperDirty' : 'paper');
    for (var i = 0; i < n; i++) {
      var p = K.mesh(K.G.box(0.004, h, d * 0.94), mat);
      p.position.set(-w / 2 + 0.01 + i * (w - 0.02) / (n - 1), h / 2, 0); p.rotation.z = (i % 2 ? 0.18 : -0.18);
      g.add(p);
    }
    return g;
  }

  /** Air box with lid, clips, intake snorkel and outlet duct with MAF sensor. */
  function airbox(K, w, d) {
    var g = new THREE.Group();
    var base = K.mesh(K.G.rbox(w + 0.04, 0.1, d + 0.04, 0.015), 'plasticBlack'); base.position.y = 0.05; g.add(base);
    var lid = new THREE.Group();
    var lidM = K.mesh(K.G.rbox(w + 0.04, 0.07, d + 0.04, 0.015), 'plasticBlack'); lidM.position.y = 0.035; lid.add(lidM);
    var duct = K.mesh(K.G.tube([[0, 0.07, 0], [0, 0.14, -0.02], [0.05, 0.2, -0.18]], 0.035), 'rubber'); lid.add(duct);
    var maf = K.mesh(K.G.rbox(0.05, 0.035, 0.04, 0.008), 'plasticGrey'); maf.position.set(0.0, 0.12, 0.0); lid.add(maf);
    var conn = K.mesh(K.G.rbox(0.025, 0.02, 0.03, 0.005), K.M.clone('plasticGrey', { color: 0x4a4f57 })); conn.position.set(0.0, 0.145, 0.03); lid.add(conn);
    lid.position.y = 0.1; g.add(lid);
    var snorkel = K.mesh(K.G.tube([[-(w / 2 + 0.02), 0.05, 0], [-(w / 2 + 0.12), 0.06, 0.02], [-(w / 2 + 0.22), 0.1, 0.1]], 0.03), 'plasticBlack'); g.add(snorkel);
    var clips = [];
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c) {
      var clip = new THREE.Group();
      var cm = K.mesh(K.G.box(0.025, 0.05, 0.006), 'steel'); cm.position.y = -0.02; clip.add(cm);
      clip.position.set(c[0] * w * 0.35, 0.11, c[1] * (d / 2 + 0.024));
      g.add(clip); clips.push({ obj: clip, side: c[1] });
    });
    g.userData = { lid: lid, clips: clips, conn: conn };
    return g;
  }

  /* where are the filters (per car) */
  var WHERE = {
    'generic': { air: [[0.6, 0.3]], cabin: V('za přihrádkou spolujezdce / pod stěrači', 'behind the glovebox / under the cowl'), airTxt: V('vzduchový filtr v motorovém prostoru', 'air filter in the engine bay') },
    'mb-cl500-c216': { air: [[0.65, 0.35], [0.65, -0.35]], cabin: V('kombinovaný filtr – umístění dle WIS (ověřit)', 'combination filter – location per WIS (verify)'), airTxt: V('V8: dvě filtrační skříně (ověřit)', 'V8: two air filter boxes (verify)') },
    'volvo-xc60-b4': { air: [[0.55, 0.38]], cabin: V('za přihrádkou spolujezdce (ověřit)', 'behind the passenger glovebox (verify)'), airTxt: V('vzduchový filtr – umístění dle VIDA (ověřit)', 'air filter – location per VIDA (verify)') },
    'skoda-octavia-rs-tdi': { air: [[0.55, 0.3]], cabin: V('za přihrádkou spolujezdce (ověřit)', 'behind the passenger glovebox (verify)'), airTxt: V('filtrační skříň nad motorem (ověřit)', 'air box above the engine (verify)') },
    'toyota-gr-yaris': { air: [[0.5, 0.35]], cabin: V('za přihrádkou spolujezdce (ověřit)', 'behind the passenger glovebox (verify)'), airTxt: V('filtrační skříň v motorovém prostoru (ověřit)', 'air box in the engine bay (verify)') },
    'citroen-jumper-22hdi': { air: [[0.45, 0.4]], cabin: V('pod palubní deskou spolujezdce / pod krytem (ověřit)', 'under the passenger dash / behind a cover (verify)'), airTxt: V('filtrační skříň v motorovém prostoru (ověřit)', 'air box in the engine bay (verify)') }
  };

  R('filters.where', {
    duration: 7, camera: { pos: [4.2, 3.0, 3.6], target: [0.5, 0.6, 0], fov: 34 }, shadow: 3, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var c = K.car(ctx.vehicle); root.add(c.group);
      var fade = K.FX.fader(c.body); fade(0.28);
      var d = c.dims, s = c.spec, w = WHERE[ctx.vehicle] || WHERE.generic;
      var airs = w.air.map(function (a) {
        var b = K.mesh(K.G.rbox(0.32, 0.16, 0.26, 0.02), K.M.clone('hiAccent'));
        b.position.set(d.front - a[0], s.hoodF - 0.15, a[1]); root.add(b); return b;
      });
      var cab = K.mesh(K.G.rbox(0.25, 0.04, 0.22, 0.01), K.M.clone('hiOk'));
      cab.position.set(s.ws0 - s.L / 2 - 0.35, s.belt - 0.28, -0.35); root.add(cab);
      return {
        root: root,
        cameraPath: function () { var k = Math.max(1, s.H / 1.45); return { pos: [d.front + 2.6 * k, s.H + 1.7 * k, 2.6 * k], target: [d.front - 1.2, s.belt * 0.7, 0] }; },
        update: function (t) {
          var p = 0.35 + 0.5 * Math.abs(Math.sin(t * 2.2));
          airs.forEach(function (a) { a.material.emissiveIntensity = t < 3.5 ? p : 0.2; });
          cab.material.emissiveIntensity = t >= 3.5 ? p : 0.15;
        },
        labels: [
          { text: w.airTxt, at: function () { return airs[0].position.clone().add(new THREE.Vector3(0, 0.15, 0)); }, show: [0, 3.5], level: 'accent' },
          { text: { cs: 'kabinový filtr: ' + S.t(w.cabin), en: 'cabin filter: ' + S.t(w.cabin) }, at: function () { return cab.position.clone().add(new THREE.Vector3(0, 0.1, 0)); }, show: [3.5, 7], level: 'ok' }
        ],
        captions: [
          { text: V('Dva různé filtry: vzduchový (motor) a kabinový (pyl, prach, pachy)', 'Two different filters: air (engine) and cabin (pollen, dust, smells)') },
          { text: V('Přesné umístění ověřte v příručce pro váš VIN', 'Verify exact locations in the manual for your VIN'), level: 'info', show: [2, 7] }
        ]
      };
    }
  });

  R('filters.airboxOpen', {
    duration: 6, camera: { pos: [0.55, 0.6, 0.65], target: [0, 0.1, 0], fov: 34 }, shadow: 1, thumbT: 4,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var box = airbox(K, 0.3, 0.22); root.add(box);
      var flt = panelFilter(K, 0.3, 0.22, 0.04, true); flt.position.y = 0.08; root.add(flt);
      var u = box.userData;
      return {
        root: root,
        update: function (t) {
          u.clips.forEach(function (c, i) { c.obj.rotation.x = c.side * T.seg(t, 0.6 + i * 0.3, 1.0 + i * 0.3) * 1.2; });
          var unplug = T.seg(t, 2.2, 2.8);
          u.conn.position.z = 0.03 + unplug * 0.06;
          var open = T.seg(t, 3.0, 4.4);
          u.lid.position.y = 0.1 + open * 0.18; u.lid.rotation.z = open * 0.35;
        },
        labels: [
          { text: V('spony', 'clips'), at: [0.1, 0.12, 0.14], show: [0.4, 2.2], level: 'accent' },
          { text: V('konektor snímače (MAF) odpojit', 'unplug the sensor (MAF) connector'), at: [0, 0.28, 0.06], show: [2.0, 3.2], level: 'accent' }
        ],
        captions: [
          { text: V('Motor vypnutý a studený. Uvolněte spony / šrouby víka', 'Engine off and cold. Release the lid clips / screws') },
          { text: V('Konektory a hadičky odpojte opatrně – plastové západky jsou křehké', 'Disconnect connectors and hoses carefully – plastic latches are brittle'), level: 'info', show: [2, 6] }
        ]
      };
    }
  });

  R('filters.airSwap', {
    duration: 8, camera: { pos: [0.55, 0.6, 0.65], target: [0, 0.1, 0], fov: 34 }, shadow: 1, thumbT: 2.5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var box = airbox(K, 0.3, 0.22); root.add(box);
      box.userData.lid.position.set(0.32, 0.0, -0.1); box.userData.lid.rotation.z = 0.0;
      var oldF = panelFilter(K, 0.3, 0.22, 0.04, true); root.add(oldF);
      var newF = panelFilter(K, 0.3, 0.22, 0.04, false); root.add(newF);
      var arrow = K.FX.arrow([0.2, 0.25, 0], [0.2, 0.12, 0], 0x30a46c, 0.01); root.add(arrow);
      return {
        root: root,
        update: function (t) {
          var out = T.seg(t, 0.4, 1.8), away = T.seg(t, 1.8, 2.8);
          oldF.position.set(-away * 0.45, 0.08 + out * 0.2, away * 0.1); oldF.visible = t < 3;
          var inK = T.seg(t, 4.0, 5.6);
          newF.position.set(-0.45 * (1 - inK), 0.08 + (1 - inK) * 0.25, 0); newF.visible = t > 3.6;
          arrow.visible = t > 5.6;
        },
        labels: [
          { text: V('starý: šedý, ucpaný', 'old: grey, clogged'), at: function () { return oldF.position.clone().add(new THREE.Vector3(0, 0.08, 0)); }, show: [1, 3], level: 'danger' },
          { text: V('těsnění dosedá po celém obvodu', 'seal sits all the way round'), at: [0.15, 0.12, 0.12], show: [5.6, 8], level: 'ok' }
        ],
        captions: [
          { text: V('Vyjměte starý filtr – nic nesmí spadnout do sacího kanálu', 'Remove the old filter – nothing may drop into the intake duct') },
          { text: V('Nový filtr vložte správnou stranou (šipka průtoku / tvar), těsnění bez mezer', 'Fit the new filter the right way round (flow arrow / shape), seal without gaps'), level: 'info', show: [3.6, 8] }
        ]
      };
    }
  });

  R('filters.clean', {
    duration: 6, camera: { pos: [0.55, 0.6, 0.65], target: [0, 0.1, 0], fov: 34 }, shadow: 1, thumbT: 3,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var box = airbox(K, 0.3, 0.22); root.add(box);
      box.userData.lid.position.set(0.32, 0.0, -0.1);
      var nozzle = K.mesh(K.G.tube([[0, 0.02, 0], [0, 0.2, 0], [0.1, 0.4, 0.1]], 0.02), 'plasticGrey'); root.add(nozzle);
      var dust = K.FX.puff(0x9a8a70, 12, 0.05, 0.15); root.add(dust.group);
      var rag = K.mesh(K.G.box(0.08, 0.01, 0.08), K.M.clone('plasticWhite', { roughness: 1 })); rag.position.set(0.38, 0.05, 0.02); root.add(rag);
      return {
        root: root,
        update: function (t) {
          var x = Math.sin(t * 2.4) * 0.1, z = Math.cos(t * 1.7) * 0.06;
          nozzle.position.set(x, 0.06, z);
          dust.group.position.set(x, 0.08, z); dust.update(t, t < 4.5);
        },
        labels: [{ text: V('výstup (čistá strana) zakrýt hadrem', 'cover the outlet (clean side) with a rag'), at: [0.38, 0.1, 0.02], level: 'accent', show: [2, 6] }],
        captions: [
          { text: V('Skříň vysajte vysavačem nebo vytřete vlhkým hadrem', 'Vacuum the box or wipe it with a damp cloth') },
          { text: V('Nefoukejte stlačeným vzduchem – nečistoty skončí za filtrem a v motoru', 'Do not blow with compressed air – dirt ends up behind the filter and in the engine'), level: 'danger', show: [2, 6] }
        ]
      };
    }
  });

  R('filters.airClose', {
    duration: 6, camera: { pos: [0.55, 0.6, 0.65], target: [0, 0.1, 0], fov: 34 }, shadow: 1, thumbT: 5,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var box = airbox(K, 0.3, 0.22); root.add(box);
      var flt = panelFilter(K, 0.3, 0.22, 0.04, false); flt.position.y = 0.08; root.add(flt);
      var u = box.userData;
      var glow = K.FX.glow(u.conn, 0x30a46c);
      return {
        root: root,
        update: function (t) {
          var close = T.seg(t, 0.4, 1.8);
          u.lid.position.y = 0.28 - close * 0.18; u.lid.rotation.z = 0.35 * (1 - close);
          u.clips.forEach(function (c, i) { c.obj.rotation.x = c.side * 1.2 * (1 - T.seg(t, 2.0 + i * 0.3, 2.4 + i * 0.3)); });
          var plug = T.seg(t, 3.6, 4.2); u.conn.position.z = 0.09 - plug * 0.06;
          glow(t > 4.2 ? 0.6 + 0.4 * Math.sin(t * 6) : 0);
        },
        labels: [{ text: V('konektor zapojen ✔', 'connector plugged ✔'), at: [0, 0.3, 0.05], show: [4.2, 6], level: 'ok' }],
        captions: [
          { text: V('Víko nasaďte bez přiskřípnutí filtru, zacvakněte všechny spony', 'Fit the lid without pinching the filter, close all clips') },
          { text: V('Zapojte konektor a hadice – jinak svítí kontrolka motoru', 'Reconnect the connector and hoses – otherwise the engine light comes on'), level: 'warning', show: [3.4, 6] }
        ]
      };
    }
  });

  /* ------------------------------------------------------------ cabin filter */
  function dashRig(K) {
    var g = new THREE.Group();
    var dash = K.mesh(K.G.rbox(0.9, 0.35, 0.55, 0.06), 'plasticTex'); dash.position.set(0, 0.62, -0.1); g.add(dash);
    var foot = K.mesh(K.G.box(0.9, 0.02, 0.7), 'fabric'); foot.position.set(0, 0.01, 0.2); g.add(foot);
    var hous = K.mesh(K.G.rbox(0.36, 0.06, 0.28, 0.01), 'plasticBlack'); hous.position.set(0.05, 0.4, -0.2); g.add(hous);
    var door = new THREE.Group();
    var dm = K.mesh(K.G.rbox(0.5, 0.2, 0.025, 0.02), 'plasticTex'); dm.position.y = 0.1; door.add(dm);
    var handle = K.mesh(K.G.rbox(0.08, 0.02, 0.012, 0.005), 'plasticGrey'); handle.position.set(0, 0.17, 0.018); door.add(handle);
    door.position.set(0, 0.44, 0.17); g.add(door);
    var cover = K.mesh(K.G.rbox(0.3, 0.012, 0.03, 0.004), 'plasticGrey'); cover.position.set(0.05, 0.4, -0.05); g.add(cover);
    g.userData = { door: door, cover: cover, housing: hous };
    return g;
  }

  R('filters.cabinAccess', {
    duration: 7, camera: { pos: [0.45, 0.18, 0.85], target: [0.05, 0.4, -0.05], fov: 38 }, shadow: 1.2, thumbT: 5, ground: false,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var d = dashRig(K); root.add(d);
      var u = d.userData;
      return {
        root: root,
        update: function (t) {
          var open = T.seg(t, 0.6, 1.8), drop = T.seg(t, 2.2, 3.4);
          u.door.rotation.x = open * 0.5 + drop * 0.9;
          var cov = T.seg(t, 4, 5.2);
          u.cover.position.set(0.05, 0.4 - cov * 0.2, -0.05 + cov * 0.25);
        },
        labels: [
          { text: V('zarážky přihrádky stisknout k sobě', 'squeeze the glovebox stops inwards'), at: [0.25, 0.42, 0.18], show: [1.6, 3.6], level: 'accent' },
          { text: V('kryt filtru', 'filter cover'), at: [0.05, 0.44, -0.02], show: [3.6, 7], level: 'accent' }
        ],
        captions: [
          { text: V('Vyprázdněte přihrádku, otevřete ji a uvolněte zarážky – spustí se níž', 'Empty the glovebox, open it and release the stops – it drops lower') },
          { text: V('Postup se liší podle vozu (někdy šrouby nebo kryt pod stěrači) – ověřte', 'The procedure differs per car (sometimes screws or a cover under the cowl) – verify'), level: 'info', show: [3, 7] }
        ]
      };
    }
  });

  R('filters.cabinSwap', {
    duration: 8, camera: { pos: [0.45, 0.12, 0.8], target: [0.05, 0.36, -0.05], fov: 38 }, shadow: 1.2, thumbT: 3, ground: false,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var d = dashRig(K); root.add(d);
      d.userData.door.rotation.x = 1.4; d.userData.cover.visible = false;
      var oldF = panelFilter(K, 0.25, 0.2, 0.03, true, true); oldF.rotation.x = PI / 2; root.add(oldF);
      var newF = panelFilter(K, 0.25, 0.2, 0.03, false, true); newF.rotation.x = PI / 2; root.add(newF);
      var arrow = K.FX.arrow([0.25, 0.42, -0.2], [0.25, 0.3, -0.2], 0x3e8ed0, 0.01); root.add(arrow);
      return {
        root: root,
        update: function (t) {
          var out = T.seg(t, 0.4, 2.0);
          oldF.position.set(0.05, 0.4 - out * 0.12, -0.2 + out * 0.4); oldF.visible = t < 2.6;
          var inK = T.seg(t, 3.4, 5.2);
          newF.position.set(0.05, 0.28 + inK * 0.12, 0.2 - inK * 0.4); newF.visible = t > 3.0;
          arrow.visible = t > 5.2;
        },
        labels: [
          { text: V('šipka „AIR FLOW“ ve směru proudění', '"AIR FLOW" arrow in the flow direction'), at: [0.25, 0.46, -0.2], show: [5.2, 8], level: 'accent' },
          { text: V('starý: listí, prach, zápach', 'old: leaves, dust, smell'), at: function () { return oldF.position.clone().add(new THREE.Vector3(0, 0.08, 0)); }, show: [1, 2.6], level: 'danger' }
        ],
        captions: [
          { text: V('Starý filtr vytahujte pomalu, nečistoty padají – vysajte šachtu', 'Pull the old filter out slowly, debris falls – vacuum the housing') },
          { text: V('Nový filtr správnou stranou (šipka proudění). Uhlíkový filtr lépe zachytí pachy', 'New filter the right way round (flow arrow). An activated-carbon filter also traps smells'), level: 'info', show: [3, 8] }
        ]
      };
    }
  });

  R('filters.test', {
    duration: 6, camera: { pos: [0.0, 0.7, 1.2], target: [0, 0.6, 0], fov: 34 }, shadow: 1.2, thumbT: 3, ground: false,
    build: function (ctx, K) {
      var T = K.T, root = new THREE.Group();
      var dash = K.mesh(K.G.rbox(1.1, 0.3, 0.4, 0.06), 'plasticTex'); dash.position.set(0, 0.6, -0.2); root.add(dash);
      var vents = [-0.35, -0.1, 0.1, 0.35].map(function (x) { var v = K.mesh(K.G.rbox(0.1, 0.05, 0.02, 0.008), 'plasticBlack'); v.position.set(x, 0.65, 0.005); root.add(v); return v; });
      var parts = [];
      for (var i = 0; i < 30; i++) {
        var p = K.mesh(K.G.sphere(0.006, 6), K.M.clone('water', { opacity: 0.5 })); p.userData.o = i / 30; p.userData.v = i % 4; root.add(p); parts.push(p);
      }
      return {
        root: root,
        update: function (t) {
          parts.forEach(function (p) {
            var k = (t * 0.9 + p.userData.o * 3) % 1, v = vents[p.userData.v].position;
            p.position.set(v.x + Math.sin(p.userData.o * 50) * 0.03, v.y + Math.cos(p.userData.o * 40) * 0.02, 0.02 + k * 0.6);
            p.visible = t > 0.6;
          });
        },
        captions: [
          { text: V('Zapněte ventilátor na všechny stupně – proud vzduchu silný, bez pachu a pískání', 'Run the fan on all speeds – strong airflow, no smell or whistling') },
          { text: V('Slabý proud i s novým filtrem? Zkontrolujte nasávání pod stěrači (listí)', 'Weak airflow even with a new filter? Check the cowl intake (leaves)'), level: 'info', show: [3, 6] }
        ]
      };
    }
  });
})(window.STU);
