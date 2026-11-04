/* 3D scenes: suspension wear – finding play, drop links, tie-rod ends, ball joints, bushings.
 * Uses the corner rig S.n3 from struts-springs.js (build-time only). */
(function (S) {
  'use strict';
  if (!window.THREE || !S.scene3d) return;
  var THREE = window.THREE, R = S.scene3d.register, PI = Math.PI;
  var V = function (cs, en) { return { cs: cs, en: en }; };
  function n3() { return S.n3; }

  function hands(K, rig, a, b) {
    var h1 = K.P.glove(), h2 = K.P.glove();
    h1.scale.setScalar(1.1); h2.scale.setScalar(1.1);
    rig.root.add(h1); rig.root.add(h2);
    return [h1, h2];
  }

  function register() {
    var W = new THREE.Vector3(0, 0.32, 0);

    R('suspension-wear.overview', {
      duration: 12, camera: { pos: [0.95, 0.7, 1.15], target: [-0.03, 0.38, -0.2], fov: 40 }, shadow: 1.6, thumbT: 4,
      build: function (ctx, K) {
        var rig = n3().corner(K, ctx, { wheel: false, caliper: true });
        var parts = [rig.link, rig.bushings[0], rig.bushings[1], rig.ball, rig.tieEnd, rig.strut.userData.top];
        var glows = parts.map(function (p) { return K.FX.glow(p); });
        return {
          root: rig.root,
          update: function (t) {
            var i = Math.floor(t / 2) % 6;
            glows.forEach(function (g, j) { g(j === i ? 0.6 + 0.4 * Math.sin(t * 6) : 0); });
          },
          labels: [
            { text: V('spojovací tyč stabilizátoru', 'anti-roll bar drop link'), at: function () { return n3().wp(rig.linkBalls[1], [0, 0.05, 0.03]); }, show: [0, 2], level: 'accent' },
            { text: V('silentbloky ramene', 'control arm bushings'), at: function () { return n3().wp(rig.bushings[0], [0, 0.06, 0]); }, show: [2, 6], level: 'accent' },
            { text: V('kulový čep', 'ball joint'), at: function () { return n3().wp(rig.ball, [0, -0.05, 0.04]); }, show: [6, 8], level: 'accent' },
            { text: V('čep řízení (konec spojovací tyče)', 'tie-rod end'), at: function () { return n3().wp(rig.tieEnd, [0, 0.06, 0]); }, show: [8, 10], level: 'accent' },
            { text: V('horní uložení vzpěry', 'strut top mount'), at: function () { return n3().wp(rig.strut, [0, 0.66, 0]); }, show: [10, 12], level: 'accent' }
          ],
          captions: [
            { text: V('Klepání přes nerovnosti: nejčastěji spojovací tyč stabilizátoru', 'Knocking over bumps: most often the anti-roll bar drop link'), show: [0, 2] },
            { text: V('Silentbloky: bouchání při rozjezdu/brzdění, nepřesné řízení', 'Bushings: clunk when pulling away/braking, vague steering'), show: [2, 6] },
            { text: V('Kulový čep: klepání + vůle – vypadnutí = ztráta řízení!', 'Ball joint: knock + play – separation = loss of steering!'), show: [6, 8], level: 'danger' },
            { text: V('Čep řízení: vůle ve volantu, ťukání při zatáčení', 'Tie-rod end: play in the steering, tapping when turning'), show: [8, 10] },
            { text: V('Horní uložení: ťukání / vrzání při točení volantem na místě', 'Top mount: knocking / creaking when steering at standstill'), show: [10, 12] }
          ]
        };
      }
    });

    R('suspension-wear.lift', {
      duration: 6, camera: { pos: [2.4, 1.15, 4.6], target: [0.6, 0.35, 0.6], fov: 34 }, shadow: 3, thumbT: 3,
      build: function (ctx, K) {
        var rig = S.liftRig(ctx, K);
        rig.set({ lift: rig.restA / rig.maxA, standIn: 1, jackDrop: 0.012 });
        var cam = n3().liftCam(ctx);
        var fw = rig.car.wheels.filter(function (w) { return w.side > 0 && w.axle === 'f'; })[0];
        return {
          root: rig.root,
          cameraPath: function () { return cam; },
          labels: [{ text: V('kolo visí volně', 'wheel hangs free'), at: function () { return n3().wp(fw.pivot, [0, -0.2, 0.15]); }, level: 'ok' }],
          captions: [
            { text: V('Kontrola vůle: kolo musí viset (vůz na stojanech pod karoserií)', 'Play check: the wheel must hang free (car on stands under the body)') },
            { text: V('Nikdy nepracujte pod vozem jen na heveru', 'Never work under a car on a jack alone'), level: 'danger' }
          ]
        };
      }
    });

    function rockScene(id, axis) {
      R(id, {
        duration: 6, camera: { pos: [0.55, 0.62, 1.35], target: [0, 0.32, 0], fov: 36 }, shadow: 1.6, thumbT: 2,
        build: function (ctx, K) {
          var rig = n3().corner(K, ctx, { wheel: true });
          var hs = hands(K, rig);
          var wheel = rig.wheel, knuckleParts = [rig.knuckle, rig.hub, rig.brake, wheel];
          var base = knuckleParts.map(function (p) { return { p: p.position.clone(), r: p.rotation.clone() }; });
          return {
            root: rig.root,
            update: function (t) {
              var a = Math.sin(t * 5) * 0.012;
              knuckleParts.forEach(function (p, i) {
                p.position.copy(base[i].p); p.rotation.copy(base[i].r);
                if (axis === 'v') { p.rotation.x = base[i].r.x + a; }
                else { p.rotation.y = base[i].r.y + a; }
              });
              if (axis === 'v') {
                hs[0].position.set(0, 0.32 + 0.31, 0.12); hs[0].rotation.set(PI, 0, 0);
                hs[1].position.set(0, 0.32 - 0.31, 0.12); hs[1].rotation.set(0, 0, 0);
              } else {
                hs[0].position.set(0.31, 0.32, 0.12); hs[0].rotation.set(0, 0, -PI / 2);
                hs[1].position.set(-0.31, 0.32, 0.12); hs[1].rotation.set(0, 0, PI / 2);
              }
              hs.forEach(function (h) { h.position.z = 0.12 + Math.sin(t * 5) * 0.01; });
            },
            labels: axis === 'v'
              ? [{ text: V('vůle 12/6 = ložisko nebo kulový čep', 'play at 12/6 = bearing or ball joint'), at: [0, 0.72, 0.1], level: 'accent' }]
              : [{ text: V('vůle 3/9 = čep řízení / spojovací tyč', 'play at 3/9 = tie-rod end / inner joint'), at: [0, 0.72, 0.1], level: 'accent' }],
            captions: axis === 'v'
              ? [{ text: V('Ruce na 12 a 6 hodin, střídavě tlačit a táhnout', 'Hands at 12 and 6 o\'clock, push and pull alternately') },
                { text: V('Pomocník šlápne na brzdu: vůle zmizí = ložisko, zůstane = kulový čep', 'Helper presses the brake: play gone = bearing, still there = ball joint'), show: [2.5, 6], level: 'info' }]
              : [{ text: V('Ruce na 3 a 9 hodin, kývat kolem do stran', 'Hands at 3 and 9 o\'clock, rock the wheel side to side') },
                { text: V('Sledujte čep řízení a vnitřní kloub (u manžety řízení)', 'Watch the tie-rod end and the inner joint (at the rack boot)'), show: [2.5, 6] }]
          };
        }
      });
    }
    rockScene('suspension-wear.rock126', 'v');
    rockScene('suspension-wear.rock39', 'h');

    R('suspension-wear.pry', {
      duration: 7, camera: { pos: [0.75, 0.42, 0.75], target: [0.05, 0.15, -0.35], fov: 40 }, shadow: 1.4, thumbT: 3,
      build: function (ctx, K) {
        var rig = n3().corner(K, ctx, { wheel: false });
        var bar = new THREE.Group();
        var shaft = K.mesh(K.G.cylX(0.01, 0.6, 12), 'steel'); shaft.position.x = 0.3; bar.add(shaft);
        var grip = K.mesh(K.G.cylX(0.016, 0.14, 12), 'toolRed'); grip.position.x = 0.55; bar.add(grip);
        bar.position.copy(rig.bushings[0].position).add(new THREE.Vector3(0.02, -0.03, 0.04)); bar.rotation.z = 0.35; rig.root.add(bar);
        var light = K.mesh(K.G.cylX(0.02, 0.14, 16), 'toolYellow'); light.position.set(0.35, 0.05, -0.15); rig.root.add(light);
        return {
          root: rig.root,
          update: function (t) {
            var k = Math.max(0, Math.sin(t * 2.5));
            bar.rotation.z = 0.35 - k * 0.12;
            rig.arm.position.x = k * 0.006 * (t > 3.5 ? 1 : 0.2);
            rig.ball.position.x = rig.arm.position.x;
          },
          labels: [{ text: V('silentblok – pohyb > pár mm = vadný', 'bushing – movement > a few mm = worn'), at: function () { return n3().wp(rig.bushings[0], [0, 0.06, 0]); }, level: 'accent' }],
          captions: [
            { text: V('Montážní pákou opatrně páčit mezi rameno a rám', 'Carefully lever between the arm and the subframe with a pry bar') },
            { text: V('Rameno se znatelně hýbe / guma praská = výměna', 'Arm moves noticeably / rubber cracked = replace'), show: [3.5, 7], level: 'accent' },
            { text: V('Nepáčit přes manžety, kabely ani brzdové trubky', 'Do not lever on boots, wires or brake pipes'), level: 'danger', show: [5, 7] }
          ]
        };
      }
    });

    R('suspension-wear.bushing', {
      duration: 8, camera: { pos: [0.22, 0.24, 0.28], target: [0, 0.15, 0], fov: 36 }, shadow: 0.6, ground: true, thumbT: 5,
      build: function (ctx, K) {
        var G = K.G, root = new THREE.Group(), T = K.T;
        function bush(x, bad) {
          var b = new THREE.Group(); b.position.set(x, 0.15, 0);
          b.add(K.mesh(G.cylX(0.05, 0.08, 40), 'steelDark'));
          var rub = K.mesh(G.cylX(0.043, 0.082, 40), 'rubber'); b.add(rub);
          var inner = K.mesh(G.cylX(0.016, 0.1, 20), 'zinc'); b.add(inner);
          if (bad) {
            for (var i = 0; i < 5; i++) {
              var cr = K.mesh(G.box(0.084, 0.0025, 0.012 + (i % 2) * 0.006), 'blackOxide');
              var a = i * 1.2; cr.position.set(0, Math.sin(a) * 0.03, Math.cos(a) * 0.03); cr.rotation.x = a; b.add(cr);
            }
            inner.position.y = -0.008;
          }
          root.add(b); return b;
        }
        var good = bush(-0.07, false), bad = bush(0.07, true);
        return {
          root: root,
          update: function (t) { var k = T.seg(t, 0, 8); good.rotation.x = k * 0.6; bad.rotation.x = k * 0.6; },
          labels: [
            { text: V('✔ celistvá pryž', '✔ intact rubber'), at: [-0.07, 0.22, 0], level: 'ok' },
            { text: V('✖ praskliny, posunuté jádro', '✖ cracks, offset centre'), at: [0.07, 0.22, 0], level: 'danger' }
          ],
          captions: [{ text: V('Vizuální kontrola: praskliny, vytlačená guma, olejem nabobtnalá pryž', 'Visual check: cracks, pushed-out rubber, oil-swollen rubber') }]
        };
      }
    });

    R('suspension-wear.dropLink', {
      duration: 11, camera: { pos: [0.55, 0.75, 0.75], target: [0.1, 0.5, -0.12], fov: 40 }, shadow: 1.4, thumbT: 4,
      build: function (ctx, K) {
        var T = K.T, rig = n3().corner(K, ctx, { wheel: false });
        var top = rig.linkBalls[1], bot = rig.linkBalls[0];
        var sp = new THREE.Group(); var spanner = K.P.spanner(0.18, 0.009); spanner.rotation.x = -PI / 2; sp.add(spanner); rig.root.add(sp);
        var key = K.mesh(K.G.cylZ(0.003, 0.08, 6), 'blackOxide'); rig.root.add(key);
        var newLink = rig.link.clone(); newLink.traverse(function (o) { if (o.isMesh) { o.material = K.M.clone('blackOxide', { color: 0x1a3e7a }); } });
        rig.root.add(newLink);
        return {
          root: rig.root,
          update: function (t) {
            var stage = t < 4.5 ? 0 : (t < 7 ? 1 : 2);
            var cur = t < 2.5 ? top : bot;
            sp.position.copy(cur.position).add(new THREE.Vector3(0, 0, 0.04));
            sp.rotation.z = Math.sin(t * 6) * 0.4; sp.visible = t < 4.5 || t > 8.5;
            key.position.copy(cur.position).add(new THREE.Vector3(0, 0, 0.07)); key.visible = sp.visible;
            var out = T.seg(t, 4.5, 6.2);
            rig.link.position.set(out * 0.15, -out * 0.05, out * 0.25);
            rig.link.visible = out < 0.99;
            var inn = T.seg(t, 6.6, 8.3);
            newLink.position.set((1 - inn) * 0.15, (1 - inn) * -0.05, (1 - inn) * 0.25);
            newLink.visible = t > 6.5;
            if (t > 8.5) sp.position.copy(top.position).add(new THREE.Vector3(0, 0, 0.04));
            key.visible = sp.visible;
          },
          labels: [
            { text: V('kontra imbus / Torx v čepu', 'counter-hold hex / Torx in the stud'), at: function () { return n3().wp(top, [0, 0.06, 0.06]); }, show: [0, 4.5], level: 'accent' },
            { text: V('nové matice (samojistné)', 'new (self-locking) nuts'), at: function () { return n3().wp(top, [0, 0.06, 0.06]); }, show: [8.5, 11], level: 'ok' }
          ],
          captions: [
            { text: V('Čep se protáčí? Kontrovat imbusem/Torxem, nebo zatížit rameno (zvedák pod ramenem)', 'Stud spins? Counter-hold with hex/Torx, or load the arm (jack under the arm)') },
            { text: V('Na stabilizátor působí síla – oba konce povolit, když je rameno v jízdní výšce', 'The anti-roll bar is under tension – undo with the arm at ride height'), show: [3, 7], level: 'accent' },
            { text: V('Nové tyče vždy v páru na nápravě je dobrý zvyk (vyrovnané chování)', 'Replacing both links on the axle is good practice'), show: [7, 11] },
            { text: V('Momenty matic dle příručky', 'Nut torques per manual'), show: [8.5, 11], level: 'accent' }
          ]
        };
      }
    });

    R('suspension-wear.tieRod', {
      duration: 12, camera: { pos: [0.35, 0.62, 0.55], target: [-0.15, 0.3, -0.2], fov: 40 }, shadow: 1.4, thumbT: 5,
      build: function (ctx, K) {
        var T = K.T, rig = n3().corner(K, ctx, { wheel: false });
        var tape = new THREE.Group(); var tb = K.mesh(K.G.rbox(0.05, 0.05, 0.02, 0.008), 'toolYellow'); tape.add(tb);
        var blade = K.mesh(K.G.box(0.012, 0.001, 0.3), 'toolYellow'); blade.position.z = -0.15; tape.add(blade);
        tape.position.set(-0.155, 0.33, -0.08); rig.root.add(tape);
        var puller = new THREE.Group();
        var pb = K.mesh(K.G.rbox(0.03, 0.12, 0.04, 0.006), 'toolBlue'); pb.position.y = 0.03; puller.add(pb);
        var ps = K.mesh(K.G.cyl(0.008, 0.08, 12), 'chrome'); ps.position.y = 0.1; puller.add(ps);
        puller.position.copy(rig.tieEnd.position).add(new THREE.Vector3(0, 0, 0)); rig.root.add(puller);
        var base = rig.tieEnd.position.clone(), baseNut = rig.lock.position.clone();
        return {
          root: rig.root,
          update: function (t) {
            tape.visible = t < 2.5;
            rig.lock.position.copy(baseNut).add(new THREE.Vector3(0, 0, -T.seg(t, 2.5, 3.5) * 0.02 + T.seg(t, 9.5, 10.5) * 0.02));
            puller.visible = t > 3.5 && t < 6;
            var pop = T.seg(t, 4.8, 5.4);
            var unscrew = T.seg(t, 6, 8), back = T.seg(t, 8.2, 9.5);
            rig.tieEnd.position.copy(base).add(new THREE.Vector3(0, pop * 0.04 * (1 - back), (unscrew - back) * 0.06));
            rig.tieEnd.rotation.z = (unscrew - back) * 14;
          },
          labels: [
            { text: V('změřit / spočítat otáčky', 'measure / count the turns'), at: function () { return n3().wp(tape, [0, 0.04, -0.12]); }, show: [0, 2.5], level: 'accent' },
            { text: V('stahovák čepu – ne kladivem na závit!', 'joint splitter – no hammer on the thread!'), at: function () { return n3().wp(puller, [0, 0.16, 0]); }, show: [3.5, 6], level: 'danger' },
            { text: V('kontramatice', 'lock nut'), at: function () { return n3().wp(rig.lock, [0, 0.04, 0]); }, show: [9.5, 12], level: 'ok' }
          ],
          captions: [
            { text: V('1. Změřit délku / spočítat otáčky – nový čep na stejnou délku', '1. Measure the length / count turns – fit the new end to the same length'), show: [0, 3.5] },
            { text: V('2. Matice čepu dolů, čep vytlačit stahovákem', '2. Undo the joint nut, press the joint out with a splitter'), show: [3.5, 6] },
            { text: V('3. Vyšroubovat, nový našroubovat na stejný počet otáček', '3. Unscrew, screw the new one on by the same number of turns'), show: [6, 9.5] },
            { text: V('4. Kontramatice + nová matice čepu, momenty dle příručky → GEOMETRIE!', '4. Lock nut + new joint nut, torques per manual → ALIGNMENT!'), show: [9.5, 12], level: 'danger' }
          ]
        };
      }
    });

    R('suspension-wear.ballJoint', {
      duration: 10, camera: { pos: [0.55, 0.38, 0.7], target: [0, 0.18, -0.08], fov: 40 }, shadow: 1.2, thumbT: 5,
      build: function (ctx, K) {
        var T = K.T, rig = n3().corner(K, ctx, { wheel: false });
        var pinch = K.P.bolt({ r: 0.007, len: 0.07, mat: 'zinc' }); pinch.rotation.z = PI / 2; pinch.position.set(0.05, 0.19, -0.06); rig.root.add(pinch);
        var lever = K.mesh(K.G.cylX(0.012, 0.7, 12), 'steel'); lever.position.set(0.15, 0.12, -0.25); lever.rotation.y = -0.6; rig.root.add(lever);
        var kParts = [rig.knuckle, rig.hub, rig.brake];
        var kb = kParts.map(function (p) { return p.position.clone(); });
        return {
          root: rig.root,
          update: function (t) {
            var out = T.seg(t, 0.5, 2.5);
            pinch.position.x = 0.05 + out * 0.15; pinch.children[0].rotation.y = out * 10;
            var down = T.seg(t, 3, 5.5);
            lever.visible = t > 2.6 && t < 6;
            lever.rotation.z = -down * 0.15;
            rig.arm.position.y = -down * 0.06; rig.ball.position.y = 0.15 - down * 0.06;
            rig.bushings.forEach(function (b) { b.rotation.z = 0; });
            var swap = T.seg(t, 6, 8.5);
            kParts.forEach(function (p, i) { p.position.copy(kb[i]); });
          },
          labels: [
            { text: V('svěrný šroub (často nový)', 'pinch bolt (often new)'), at: function () { return n3().wp(pinch, [0, 0.05, 0]); }, show: [0, 3], level: 'accent' },
            { text: V('kulový čep', 'ball joint'), at: function () { return n3().wp(rig.ball, [0, -0.04, 0.05]); }, show: [3, 10], level: 'accent' }
          ],
          captions: [
            { text: V('Kulový čep drží kolo – chyba = ztráta řízení. Pokud si nejste jistí: dílna', 'The ball joint holds the wheel – a mistake = loss of steering. If unsure: workshop'), level: 'danger' },
            { text: V('Čep bývá nýtovaný/zalisovaný do ramene → často se mění celé rameno', 'Often riveted/pressed into the arm → the whole arm is usually replaced'), show: [3, 10] },
            { text: V('Nové šrouby a matice, momenty dle příručky, pak geometrie', 'New bolts and nuts, torques per manual, then alignment'), show: [6, 10], level: 'accent' }
          ]
        };
      }
    });

    R('suspension-wear.rideHeight', {
      duration: 8, camera: { pos: [0.9, 0.5, 0.9], target: [0, 0.2, -0.3], fov: 40 }, shadow: 1.6, thumbT: 4,
      build: function (ctx, K) {
        var T = K.T, rig = n3().corner(K, ctx, { wheel: false });
        var jack = K.mesh(K.G.cyl(0.04, 0.12, 20), 'jackRed'); rig.root.add(jack);
        var ram = K.mesh(K.G.cyl(0.018, 0.12, 16), 'chrome'); rig.root.add(ram);
        var tw = new THREE.Group(); var tws = K.P.torqueWrench(0.35); tws.rotation.z = -PI / 2; tw.add(tws); rig.root.add(tw);
        var kParts = [rig.knuckle, rig.hub, rig.brake, rig.ball], kb = kParts.map(function (p) { return p.position.clone(); });
        return {
          root: rig.root,
          update: function (t) {
            var up = T.seg(t, 0.8, 3.5);
            var drop = 0.07 * (1 - up);
            kParts.forEach(function (p, i) { p.position.copy(kb[i]); p.position.y -= drop; });
            rig.arm.position.y = -drop; rig.arm.rotation.z = 0;
            jack.position.set(0, 0.06, -0.04); ram.position.set(0, 0.12 + 0.0 - drop * 0.5, -0.04);
            tw.position.copy(rig.bushings[0].position).add(new THREE.Vector3(0, 0, 0.08)); tw.visible = t > 4;
            tw.rotation.z = -T.seg((t - 4) % 2, 0.3, 1.1) * 0.5;
          },
          labels: [{ text: V('dotáhnout až v jízdní výšce', 'tighten only at ride height'), at: function () { return n3().wp(rig.bushings[0], [0, 0.07, 0]); }, show: [3.5, 8], level: 'accent' }],
          captions: [
            { text: V('Silentbloky se dotahují v jízdní poloze (zatížené kolo / zvedák pod ramenem)', 'Bushings are torqued at ride height (wheel loaded / jack under the arm)') },
            { text: V('Dotažené ve visu = zkroucená pryž → rychle praskne', 'Torqued while hanging = twisted rubber → fails quickly'), show: [3.5, 8], level: 'danger' }
          ]
        };
      }
    });

    R('suspension-wear.align', {
      duration: 7, camera: { pos: [3.2, 2.4, 4.4], target: [0, 0.4, 0], fov: 36 }, shadow: 3.5, thumbT: 3,
      build: function (ctx, K) {
        return S.n3.alignRig ? S.n3.alignRig(ctx, K, { caption: V('Po výměně čepů řízení / ramen: vždy geometrie', 'After tie-rod ends / arms: always an alignment') }) : { root: new THREE.Group() };
      }
    });
  }
  // the corner helpers live in struts-springs.js which loads earlier; register now (they are only used at build time)
  register();
})(window.STU);
