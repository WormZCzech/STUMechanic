/* STUMechanic 3D – procedural car bodies per vehicle (shape & proportions only, no logos/badges).
 * K.car(vehicleId, opts) -> { group, body, wheels:[{pivot, wheel, axle:'f'|'r', side:1|-1}], dims, jackPoints:[Vector3] }
 * Car is centred at x=0 (front = +X), z=0, standing on y=0. Left side of the car = +Z.
 */
(function (S) {
  'use strict';
  var THREE = window.THREE;
  if (!THREE) return;
  var K = S.three.kit, M = K.M, G = K.G, P = K.P;
  var PI = Math.PI;

  /* Real-world proportions (metres). Paint colours are placeholders – tell us your real colours. */
  var SPEC = {
    'generic': {
      L: 4.35, W: 1.8, H: 1.46, wb: 2.62, rOH: 0.8, wr: 0.315, tw: 0.215, clr: 0.14, belt: 0.95, hoodF: 0.8, deckR: 0.98,
      ws0: 3.05, rf: 2.3, rr: 0.55, rg0: 0.22, paint: 0x5f7fa6, style: 'hatch'
    },
    'mb-cl500-c216': {
      L: 5.07, W: 1.87, H: 1.42, wb: 2.955, rOH: 1.1, wr: 0.345, tw: 0.255, clr: 0.13, belt: 0.92, hoodF: 0.79, deckR: 0.97,
      ws0: 3.38, rf: 2.62, rr: 1.38, rg0: 0.72, paint: 0xb8bcc2, style: 'coupe', rim: 'rimSilver'
    },
    'volvo-xc60-b4': {
      L: 4.71, W: 1.9, H: 1.66, wb: 2.865, rOH: 0.9, wr: 0.37, tw: 0.235, clr: 0.21, belt: 1.12, hoodF: 1.0, deckR: 1.2,
      ws0: 3.22, rf: 2.48, rr: 0.42, rg0: 0.16, paint: 0x3f5a78, style: 'suv', rim: 'rimDark'
    },
    'skoda-octavia-rs-tdi': {
      L: 4.57, W: 1.77, H: 1.46, wb: 2.58, rOH: 1.03, wr: 0.315, tw: 0.225, clr: 0.13, belt: 0.96, hoodF: 0.8, deckR: 1.0,
      ws0: 3.08, rf: 2.32, rr: 1.0, rg0: 0.42, paint: 0x2f6b3b, style: 'liftback', rim: 'rimSilver'
    },
    'toyota-gr-yaris': {
      L: 3.995, W: 1.805, H: 1.455, wb: 2.56, rOH: 0.63, wr: 0.32, tw: 0.225, clr: 0.13, belt: 0.93, hoodF: 0.82, deckR: 1.02,
      ws0: 2.58, rf: 1.98, rr: 0.62, rg0: 0.16, paint: 0xb5262c, style: 'hothatch', rim: 'rimDark'
    }
  };
  K.carSpec = function (id) { return SPEC[id] || SPEC.generic; };

  function smooth(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }

  /* ---------------------------------------------------------- loft surface
   * The body is a smooth "loft": cross-sections (superellipses) swept along the car length.
   * top(x)/bot(x): section top/bottom heights; half(x, y): half-width at height y. */
  function lineFn(pts) {
    return function (x) {
      if (x <= pts[0][0]) return pts[0][1];
      for (var i = 1; i < pts.length; i++) {
        if (x <= pts[i][0]) { var k = (x - pts[i - 1][0]) / ((pts[i][0] - pts[i - 1][0]) || 1); return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k; }
      }
      return pts[pts.length - 1][1];
    };
  }
  function sgnPow(v, e) { return (v < 0 ? -1 : 1) * Math.pow(Math.abs(v), e); }
  /** Build a lofted surface. o = {x0, x1, nx, nt, top, bot, half, nTop, nBot, t0, t1 (angle range), xs (optional custom samples)} */
  function loft(o) {
    var xs = o.xs || [];
    if (!xs.length) for (var i = 0; i <= o.nx; i++) { var u = i / o.nx; xs.push(o.x0 + (o.x1 - o.x0) * (0.5 - 0.5 * Math.cos(u * PI))); }
    var nt = o.nt || 56, t0 = o.t0 == null ? 0 : o.t0, t1 = o.t1 == null ? PI * 2 : o.t1;
    var pos = [], idx = [];
    xs.forEach(function (x) {
      var top = o.top(x), bot = o.bot(x), mid = (top + bot) / 2, hh = (top - bot) / 2;
      for (var j = 0; j <= nt; j++) {
        var th = t0 + (t1 - t0) * j / nt, c = Math.cos(th), sn = Math.sin(th);
        var e = sn >= 0 ? 2 / (o.nTop || 4) : 2 / (o.nBot || 8);
        var y = mid + hh * sgnPow(sn, e);
        var z = o.half(x, y) * sgnPow(c, 2 / (o.nSide || 4)) * (o.scale || 1);
        pos.push(x, y + (o.lift || 0), z);
      }
    });
    var row = nt + 1;
    for (var a = 0; a < xs.length - 1; a++) {
      for (var b = 0; b < nt; b++) {
        var p0 = a * row + b, p1 = p0 + 1, p2 = p0 + row, p3 = p2 + 1;
        idx.push(p0, p2, p1, p1, p2, p3);
      }
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  K.loft = loft;

  function endRound(x, L, e) {
    var d = Math.min(x, L - x);
    if (d >= e) return 1;
    var k = 1 - d / e;
    return Math.pow(Math.max(0, 1 - Math.pow(k, 3.6)), 1 / 3.6);
  }
  function tumble(y, s, amt) {
    if (y <= s.belt - 0.04) return 1;
    var k = Math.min(1, (y - s.belt + 0.04) / (s.H - s.belt + 0.04));
    return 1 - amt * k * k * (3 - 2 * k) ;
  }

  function lowerTop(s) {
    var p = [[0, s.deckR - 0.16], [0.04, s.deckR - 0.05], [0.14, s.deckR]];
    if (s.style === 'coupe' || s.style === 'liftback') p.push([s.rg0 - 0.12, s.belt + 0.03]);
    p.push([s.rg0, s.belt], [s.ws0, s.belt], [s.ws0 + 0.12, s.belt - 0.015],
      [s.L - 0.45, s.hoodF + 0.03], [s.L - 0.16, s.hoodF - 0.02], [s.L - 0.04, s.hoodF - 0.13], [s.L, s.hoodF - 0.26]);
    return lineFn(p);
  }
  function lowerBot(s) {
    var bot = s.clr + 0.03, suv = s.style === 'suv';
    var base = lineFn([[0, bot + 0.3], [0.08, bot + 0.1], [0.3, bot], [s.L - 0.3, bot], [s.L - 0.08, bot + (suv ? 0.14 : 0.05)], [s.L, bot + 0.22]]);
    var ar = s.wr + 0.045;
    return function (x) {
      var y = base(x);
      [s.rOH, s.rOH + s.wb].forEach(function (ax) {
        var d = x - ax;
        if (Math.abs(d) < ar) y = Math.max(y, s.wr + Math.sqrt(ar * ar - d * d) * 0.98);
      });
      return y;
    };
  }
  function roofTop(s) {
    var H = s.H, p = [[s.rg0, s.belt - 0.005]];
    if (s.style === 'suv') p.push([s.rr - 0.03, H - 0.08], [s.rr + 0.08, H - 0.01]);
    else if (s.style === 'hothatch') p.push([s.rr - 0.1, H - 0.13], [s.rr + 0.12, H - 0.015]);
    else if (s.style === 'hatch') p.push([s.rr - 0.06, H - 0.08], [s.rr + 0.1, H - 0.01]);
    else p.push([s.rr - 0.18, H - 0.13], [s.rr + 0.14, H - 0.015]);
    p.push([(s.rr + s.rf) / 2, H], [s.rf - 0.12, H - 0.005], [s.rf + 0.02, H - 0.04], [s.ws0, s.belt - 0.005]);
    return lineFn(p);
  }
  function xSamples(s, x0, x1, n) {
    var xs = [];
    for (var i = 0; i <= n; i++) { var u = i / n; xs.push(x0 + (x1 - x0) * (0.5 - 0.5 * Math.cos(u * PI))); }
    // densify around wheel arches
    [s.rOH, s.rOH + s.wb].forEach(function (ax) { for (var k = -1; k <= 1; k += 0.08) xs.push(ax + k * (s.wr + 0.05)); });
    xs = xs.filter(function (x) { return x >= x0 && x <= x1; }).sort(function (a, b) { return a - b; });
    return xs.filter(function (x, i) { return i === 0 || x - xs[i - 1] > 0.004; });
  }

  function mesh(geo, mat) { return new THREE.Mesh(geo, typeof mat === 'string' ? M[mat] : mat); }

  K.car = function (vid, opts) {
    opts = opts || {};
    var s = SPEC[vid] || SPEC.generic;
    var paint = M.carPaint(opts.paint || s.paint);
    var root = new THREE.Group(); root.name = 'car';
    var body = new THREE.Group(); body.name = 'body';
    root.add(body);
    var W = s.W, cx = s.L / 2;

    // ---- lower body (lofted shell)
    var topF = lowerTop(s), botF = lowerBot(s);
    var lower = loft({
      xs: xSamples(s, 0, s.L, 90), nt: 64, top: topF, bot: botF, nTop: 5, nBot: 10, nSide: 4.5,
      half: function (x, y) { return W / 2 * endRound(x, s.L, s.style === 'suv' ? 0.3 : 0.42) * tumble(y, s, 0.05) * (y < s.clr + 0.12 ? 0.97 : 1); }
    });
    lower.translate(-cx, 0, 0);
    var lowerM = mesh(lower, paint); body.add(lowerM);

    // ---- greenhouse (glass) + painted roof skin
    var gw = W * (s.style === 'suv' ? 0.9 : 0.87);
    var rt = roofTop(s);
    var ghBot = function () { return s.belt - 0.04; };
    var ghHalf = function (x, y) { return gw / 2 * endRound(x - s.rg0, s.ws0 - s.rg0, 0.12) * tumble(y, s, 0.24); };
    var gh = loft({ x0: s.rg0 + 0.005, x1: s.ws0 - 0.005, nx: 60, nt: 48, top: rt, bot: ghBot, nTop: 3.2, nBot: 8, nSide: 3, half: ghHalf });
    gh.translate(-cx, 0, 0);
    body.add(mesh(gh, 'glass'));
    var roofMat = s.style === 'hothatch' ? M.clone('plasticBlack', { roughness: 0.3, color: 0x141517 }) : paint;
    var roofG = loft({ x0: s.rr + 0.02, x1: s.rf - 0.02, nx: 40, nt: 40, top: rt, bot: ghBot, nTop: 3.2, nBot: 8, nSide: 3,
      t0: PI * 0.2, t1: PI * 0.8, lift: 0.004, scale: 1.01, half: ghHalf });
    roofG.translate(-cx, 0, 0);
    var roofMesh = mesh(roofG, roofMat); roofMesh.material.side = THREE.FrontSide; body.add(roofMesh);

    // ---- surface helpers (so details sit exactly on the shell)
    var endE = s.style === 'suv' ? 0.3 : 0.42;
    function halfAt(x, y) { return W / 2 * endRound(x, s.L, endE) * tumble(y, s, 0.05); }
    /** x (car coords, centred) where the front (+1) or rear (-1) surface is at lateral offset z, height y */
    function endX(z, y, dir) {
      var lo = 0, hi = 0.8;
      for (var it = 0; it < 30; it++) {
        var mid = (lo + hi) / 2, x = dir > 0 ? s.L - mid : mid;
        if (halfAt(x, y) >= Math.abs(z)) hi = mid; else lo = mid;
      }
      return (dir > 0 ? s.L - hi : hi) - cx;
    }
    /** place an object on the front/rear surface, oriented with it */
    function onEnd(obj, z, y, dir, inset) {
      var x1 = endX(z, y, dir), x2 = endX(z + 0.02 * (z >= 0 ? 1 : -1), y, dir);
      var slope = (x2 - x1) / (0.02 * (z >= 0 ? 1 : -1));
      obj.position.set(x1 - dir * (inset || 0), y, z);
      obj.rotation.y = Math.atan(slope) + (dir < 0 ? PI : 0);
      return obj;
    }
    /** point on the greenhouse shell at length x and section angle th (0 = belt side, PI/2 = roof centre) */
    function ghPoint(x, th, side) {
      var top = rt(x), bot = ghBot(), mid = (top + bot) / 2, hh = (top - bot) / 2;
      var y = mid + hh * sgnPow(Math.sin(th), 2 / 3.2);
      var z = ghHalf(x, y) * sgnPow(Math.cos(th), 2 / 3);
      return new THREE.Vector3(x - cx, y, side * z);
    }
    // pillars (A, B, C) as painted / black strips on both sides
    function zHalf(y, x) { return ghHalf(x == null ? (s.rg0 + s.ws0) / 2 : x, y) * 1.0 + 0.006; }
    [-1, 1].forEach(function (side) {
      // A pillar
      var apts = [];
      for (var ai = 0; ai <= 10; ai++) apts.push(ghPoint(s.ws0 - 0.04 - (s.ws0 - s.rf - 0.02) * ai / 10, 0.04 + ai / 10 * 0.42, side));
      body.add(mesh(G.tube(apts, 0.022, false, 30, 8), paint));
      // B pillar (black)
      var bx = (s.rf + s.rr) / 2 + (s.style === 'coupe' ? 0.25 : 0.05);
      if (s.style !== 'coupe') {
        var bpts = [];
        for (var bi = 0; bi <= 8; bi++) bpts.push(ghPoint(bx, 0.02 + bi / 8 * 0.62, side));
        body.add(mesh(G.tube(bpts, 0.03, false, 20, 8), 'blackGloss'));
      }
      // C pillar (painted sail) for coupé / liftback / hatches
      var cpts = [];
      var cx0 = s.rg0 + 0.05, cx1 = s.rr + (s.style === 'suv' ? 0.06 : 0.14);
      for (var ci = 0; ci <= 10; ci++) cpts.push(ghPoint(cx0 + (cx1 - cx0) * ci / 10, 0.04 + ci / 10 * 0.45, side));
      var cR = s.style === 'suv' ? 0.04 : (s.style === 'coupe' ? 0.055 : 0.045);
      body.add(mesh(G.tube(cpts, cR, false, 30, 8), s.style === 'hothatch' ? 'blackGloss' : paint));
      // window line trim
      var tpts = [];
      for (var ti = 0; ti <= 10; ti++) { var tx = s.rg0 + 0.1 + (s.ws0 - s.rg0 - 0.2) * ti / 10; tpts.push(new THREE.Vector3(tx - cx, s.belt - 0.025, side * (W / 2 * endRound(tx, s.L, 0.42) * tumble(s.belt - 0.025, s, 0.05) + 0.002))); }
      var trim = mesh(G.tube(tpts, 0.006, false, 30, 6), s.style === 'suv' || s.style === 'coupe' ? 'chrome' : 'blackGloss');
      body.add(trim);
      // mirror
      var mir = new THREE.Group();
      var mh = mesh(G.rbox(0.09, 0.08, 0.16, 0.025), s.style === 'hothatch' ? 'blackGloss' : paint); mh.position.z = side * 0.08; mir.add(mh);
      var mg = mesh(G.box(0.005, 0.06, 0.13), 'chrome'); mg.position.set(-0.047, 0, side * 0.08); mir.add(mg);
      var mp = ghPoint(s.ws0 - 0.14, 0.12, side); mir.position.set(mp.x, mp.y, mp.z + side * 0.015);
      body.add(mir);
      // door handles + shut lines
      var doorX = s.style === 'coupe' ? [(s.ws0 + s.rf) / 2 - 0.55] : [(s.ws0 + s.rf) / 2 - 0.35, (s.rf + s.rr) / 2 - 0.3];
      doorX.forEach(function (dx) {
        var hdl = mesh(G.rbox(0.13, 0.025, 0.02, 0.008), s.style === 'coupe' ? 'chrome' : paint);
        hdl.position.set(dx - cx, s.belt - 0.08, side * (W / 2 - 0.035)); body.add(hdl);
      });
      // side sill / cladding
      var sillMat = s.style === 'suv' ? 'plasticTex' : (s.style === 'hothatch' ? 'blackGloss' : paint);
      var sill = mesh(G.rbox(s.wb - 2 * (s.wr + 0.06), 0.09, 0.05, 0.02), sillMat);
      sill.position.set(s.rOH + s.wb / 2 - cx, s.clr + 0.07, side * (W / 2 - 0.045)); body.add(sill);
      if (s.style === 'suv') {
        [s.rOH, s.rOH + s.wb].forEach(function (ax) {
          var arch = mesh(G.torus(s.wr + 0.06, 0.03, PI, 32), 'plasticTex');
          arch.position.set(ax - cx, s.wr, side * (W / 2 - 0.05)); body.add(arch);
        });
      }
      if (s.style === 'hothatch') {
        [s.rOH, s.rOH + s.wb].forEach(function (ax) {
          var flare = mesh(G.torus(s.wr + 0.055, 0.035, PI, 32), paint);
          flare.position.set(ax - cx, s.wr + 0.01, side * (W / 2 - 0.04)); body.add(flare);
        });
      }
    });

    // ---- lights, grille, bumpers, plates (all placed on the shell surface)
    var frontX = s.L / 2;
    [-1, 1].forEach(function (side) {
      var hl = new THREE.Group();
      var hlw = s.style === 'suv' ? 0.3 : (s.style === 'hothatch' ? 0.28 : 0.34), hlh = s.style === 'coupe' ? 0.11 : 0.085;
      var housing = mesh(G.rbox(0.12, hlh, hlw, 0.025), 'blackGloss'); hl.add(housing);
      var lens = mesh(G.rbox(0.125, hlh * 0.94, hlw * 0.97, 0.025), 'lens'); hl.add(lens);
      var proj = mesh(G.cylX(0.026, 0.03, 24), 'reflector'); proj.position.set(0.045, 0, -side * hlw * 0.18); hl.add(proj);
      var p2 = proj.clone(); p2.position.z = side * hlw * 0.18; hl.add(p2);
      if (vid === 'volvo-xc60-b4') {
        var t1 = mesh(G.box(0.012, 0.01, hlw * 0.6), 'lightWhite'); t1.position.set(0.058, 0.004, 0); hl.add(t1);
        var t2 = mesh(G.box(0.012, hlh * 0.7, 0.01), 'lightWhite'); t2.position.set(0.058, -0.004, 0); hl.add(t2);
      } else {
        var drl = mesh(G.box(0.012, 0.008, hlw * 0.75), 'lightWhite'); drl.position.set(0.058, -hlh * 0.36, 0); hl.add(drl);
      }
      onEnd(hl, side * (W / 2 - hlw / 2 - 0.09), s.hoodF - 0.1, 1, 0.035);
      hl.name = side > 0 ? 'headlightL' : 'headlightR';
      body.add(hl);
      var tl = new THREE.Group();
      var tlh = s.style === 'suv' ? 0.32 : 0.1, tlw = s.style === 'suv' ? 0.14 : 0.3;
      var tlm = mesh(G.rbox(0.06, tlh, tlw, 0.02), 'lightRed'); tl.add(tlm);
      var tlg = mesh(G.rbox(0.064, tlh * 0.92, tlw * 0.96, 0.02), 'lens'); tl.add(tlg);
      onEnd(tl, side * (W / 2 - tlw / 2 - 0.07), s.style === 'suv' ? s.deckR - 0.2 : s.deckR - 0.13, -1, 0.02);
      tl.name = side > 0 ? 'taillightL' : 'taillightR';
      body.add(tl);
    });
    var grilleW = s.style === 'suv' ? 0.6 : (s.style === 'hothatch' ? 0.66 : 0.5);
    var gH = s.style === 'hothatch' ? 0.18 : 0.15, gY = s.hoodF - (s.style === 'hothatch' ? 0.33 : 0.17);
    var grille = mesh(G.rbox(0.05, gH, grilleW, 0.03), 'blackGloss');
    grille.position.set(endX(grilleW / 2, gY, 1) - 0.012, gY, 0); body.add(grille);
    if (vid === 'mb-cl500-c216') {
      for (var gi = 0; gi < 3; gi++) { var bar = mesh(G.box(0.01, 0.012, grilleW * 0.95), 'chrome'); bar.position.set(grille.position.x + 0.027, gY - 0.04 + gi * 0.04, 0); body.add(bar); }
    }
    var iY = s.clr + 0.16, iW = s.W * 0.5;
    var intake = mesh(G.rbox(0.05, 0.09, iW, 0.03), 'plasticTex'); intake.position.set(endX(iW / 2, iY, 1) - 0.014, iY, 0); body.add(intake);
    var pY = s.clr + 0.29;
    var plateF = mesh(G.box(0.006, 0.11, 0.52), 'plasticWhite'); plateF.position.set(endX(0.26, pY, 1) + 0.001, pY, 0); body.add(plateF);
    var prY = s.deckR - 0.33;
    var plateR = mesh(G.box(0.006, 0.11, 0.52), 'plasticWhite'); plateR.position.set(endX(0.26, prY, -1) - 0.001, prY, 0); body.add(plateR);
    var dY = s.clr + 0.11, dW = s.W * 0.6;
    var diff = mesh(G.rbox(0.06, 0.08, dW, 0.025), 'plasticTex'); diff.position.set(endX(dW / 2, dY, -1) + 0.02, dY, 0); body.add(diff);
    // exhaust tips
    var tips = vid === 'mb-cl500-c216' || vid === 'toyota-gr-yaris' ? [-1, 1] : (vid === 'skoda-octavia-rs-tdi' ? [-1] : []);
    tips.forEach(function (sd) {
      var tz = sd * (vid === 'toyota-gr-yaris' ? 0.18 : 0.55);
      var tip = mesh(G.cylX(0.038, 0.12, 24), 'chrome'); tip.position.set(endX(tz, s.clr + 0.1, -1) + 0.03, s.clr + 0.1, tz); body.add(tip);
      var hole = mesh(G.cylX(0.03, 0.122, 24), 'blackOxide'); hole.position.copy(tip.position); body.add(hole);
    });
    if (s.style === 'hothatch') {
      var spoiler = mesh(G.rbox(0.2, 0.025, gw * 0.85, 0.01), 'blackGloss'); spoiler.position.set(s.rr - 0.02 - cx, rt(s.rr) + 0.01, 0); spoiler.rotation.z = -0.25; body.add(spoiler);
      var hx = s.L - 0.6;
      var scoop = mesh(G.rbox(0.24, 0.035, 0.38, 0.015), 'blackGloss'); scoop.position.set(hx - cx, topF(hx) + 0.012, 0); body.add(scoop);
    }
    if (s.style === 'suv') {
      [-1, 1].forEach(function (sd) {
        var rp = [];
        for (var ri = 0; ri <= 10; ri++) { var q = ghPoint(s.rr + 0.12 + (s.rf - s.rr - 0.3) * ri / 10, 1.2, sd); q.y += 0.03; rp.push(q); }
        body.add(mesh(G.tube(rp, 0.014, false, 30, 8), 'alu'));
        [0, 10].forEach(function (ri) { var f = mesh(G.rbox(0.06, 0.035, 0.03, 0.01), 'plasticBlack'); f.position.copy(rp[ri]); f.position.y -= 0.015; body.add(f); });
      });
      var skidF = mesh(G.rbox(0.04, 0.05, 0.8, 0.015), 'alu'); skidF.position.set(endX(0.4, s.clr + 0.09, 1) - 0.01, s.clr + 0.09, 0); body.add(skidF);
    }
    if (opts.contactShadow !== false) root.add(K.FX.contactShadow(s.L * 1.15, W * 1.25, 0.6));
    // underbody (dark floor so lifting views look right)
    var floor = mesh(G.box(s.L - 1.0, 0.03, W - 0.45), 'plasticTex'); floor.position.set(0, s.clr + 0.015, 0); body.add(floor);

    // ---- wheels
    var wheels = [];
    var tz = W / 2 - s.tw / 2 - 0.035;
    [['r', s.rOH - cx], ['f', s.rOH + s.wb - cx]].forEach(function (ax) {
      [-1, 1].forEach(function (side) {
        var pivot = new THREE.Group();
        pivot.position.set(ax[1], s.wr, side * tz);
        var w = P.wheel({ r: s.wr, w: s.tw, rim: s.wr * (vid === 'volvo-xc60-b4' ? 0.66 : 0.7), rimMat: s.rim || 'rimSilver', spokes: vid === 'toyota-gr-yaris' ? 10 : 5 });
        if (side < 0) w.rotation.y = PI; // outer face always outwards
        pivot.add(w);
        // brake disc + caliper visible through spokes
        var disc = P.brakeDisc({ r: s.wr * 0.5, vented: true });
        disc.position.z = side * -0.02; if (side < 0) disc.rotation.y = PI;
        pivot.add(disc);
        var calMat = vid === 'toyota-gr-yaris' ? 'caliperRed' : (vid === 'skoda-octavia-rs-tdi' ? 'caliperRed' : 'caliperBlack');
        var cal = mesh(G.sector(s.wr * 0.5 - 0.05, s.wr * 0.5 + 0.02, ax[0] === 'f' ? PI * 0.7 : PI * 0.6, ax[0] === 'f' ? PI * 1.15 : PI * 1.0, 0.07, 0.01), calMat);
        cal.position.z = side * -0.02; if (side < 0) cal.rotation.y = PI;
        pivot.add(cal);
        root.add(pivot);
        wheels.push({ pivot: pivot, wheel: w, axle: ax[0], side: side, base: pivot.position.clone() });
      });
    });

    var dims = {
      L: s.L, W: W, H: s.H, wb: s.wb, wr: s.wr, clr: s.clr, belt: s.belt, hoodF: s.hoodF,
      xr: s.rOH - cx, xf: s.rOH + s.wb - cx, track: tz * 2, front: frontX, rear: -frontX
    };
    var jy = s.clr + 0.01, jz = W / 2 - 0.1;
    var jackPoints = [
      new THREE.Vector3(dims.xf - s.wr - 0.28, jy, jz), new THREE.Vector3(dims.xr + s.wr + 0.28, jy, jz),
      new THREE.Vector3(dims.xf - s.wr - 0.28, jy, -jz), new THREE.Vector3(dims.xr + s.wr + 0.28, jy, -jz)
    ];
    root.userData = { body: body, wheels: wheels, dims: dims, jackPoints: jackPoints, spec: s };
    return { group: root, body: body, wheels: wheels, dims: dims, jackPoints: jackPoints, spec: s };
  };
})(window.STU);
