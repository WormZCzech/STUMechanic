/* STUMechanic 3D – shared materials (K.M), geometry helpers (K.G), parts (K.P) and FX (K.FX).
 * All parts are built in metres. Conventions per part are documented above each builder.
 */
(function (S) {
  'use strict';
  var THREE = window.THREE;
  if (!THREE) return;
  var K = S.three.kit;
  var M = K.M = {}, G = K.G = {}, P = K.P = {}, FX = K.FX = {};
  var PI = Math.PI;

  /* =============================================================== MATERIALS */
  function def(name, params, physical) {
    var m = physical ? new THREE.MeshPhysicalMaterial(params) : new THREE.MeshStandardMaterial(params);
    m.name = name;
    m.userData.shared = true;
    M[name] = m;
    return m;
  }
  def('steel', { color: 0xbfc5cc, metalness: 0.8, roughness: 0.3 });
  def('steelDark', { color: 0x777d86, metalness: 0.75, roughness: 0.42 });
  def('chrome', { color: 0xeef1f4, metalness: 1, roughness: 0.06 });
  def('zinc', { color: 0xd4cba2, metalness: 0.8, roughness: 0.38 });
  def('blackOxide', { color: 0x2a2c30, metalness: 0.8, roughness: 0.45 });
  def('castIron', { color: 0x6c7077, metalness: 0.6, roughness: 0.74 });
  def('discFace', { color: 0xb6bbc1, metalness: 0.55, roughness: 0.34 });
  def('alu', { color: 0xcdd2d8, metalness: 0.8, roughness: 0.32 });
  def('aluCast', { color: 0xa7abb1, metalness: 0.85, roughness: 0.58 });
  def('rimSilver', { color: 0xc3c8cf, metalness: 0.9, roughness: 0.22 }, true);
  def('rimDark', { color: 0x2c2f34, metalness: 0.7, roughness: 0.3 }, true);
  def('rubber', { color: 0x17181b, metalness: 0, roughness: 0.92 });
  def('tire', { color: 0x1c1d20, metalness: 0, roughness: 0.82 });
  def('plasticBlack', { color: 0x1d1f22, metalness: 0, roughness: 0.55 });
  def('plasticTex', { color: 0x26282c, metalness: 0, roughness: 0.85 });
  def('plasticGrey', { color: 0x5d636b, metalness: 0, roughness: 0.6 });
  def('plasticWhite', { color: 0xe7e8ea, metalness: 0, roughness: 0.45 });
  def('blackGloss', { color: 0x0b0c0e, metalness: 0.3, roughness: 0.12 }, true);
  def('caliperRed', { color: 0xc4191c, metalness: 0.1, roughness: 0.35, clearcoat: 0.7, clearcoatRoughness: 0.15 }, true);
  def('caliperBlack', { color: 0x1c1d20, metalness: 0.2, roughness: 0.4, clearcoat: 0.5 }, true);
  def('padFriction', { color: 0x3b322c, metalness: 0.1, roughness: 1 });
  def('rust', { color: 0x7a3a17, metalness: 0.2, roughness: 1 });
  def('jackRed', { color: 0xb3191b, metalness: 0.3, roughness: 0.38 });
  def('toolYellow', { color: 0xf2b705, metalness: 0.1, roughness: 0.45 });
  def('toolBlue', { color: 0x1e5bb8, metalness: 0.1, roughness: 0.45 });
  def('toolRed', { color: 0xc8262b, metalness: 0.1, roughness: 0.45 });
  def('gripRubber', { color: 0x202124, metalness: 0, roughness: 0.95 });
  def('copper', { color: 0xc07850, metalness: 1, roughness: 0.32 });
  def('brass', { color: 0xc9a227, metalness: 1, roughness: 0.3 });
  def('paper', { color: 0xe4d6a8, metalness: 0, roughness: 1 });
  def('paperDirty', { color: 0x5a4527, metalness: 0, roughness: 1 });
  def('glass', { color: 0x10181f, metalness: 0, roughness: 0.04, transparent: true, opacity: 0.72, clearcoat: 1 }, true);
  def('glassClear', { color: 0xffffff, metalness: 0, roughness: 0.02, transparent: true, opacity: 0.22 }, true);
  def('lens', { color: 0xf4f7fb, metalness: 0, roughness: 0.03, transparent: true, opacity: 0.35, clearcoat: 1 }, true);
  def('reflector', { color: 0xe6e9ee, metalness: 1, roughness: 0.12 });
  def('oil', { color: 0xc98a12, metalness: 0, roughness: 0.06, transparent: true, opacity: 0.9 }, true);
  def('oilOld', { color: 0x2b1d0c, metalness: 0, roughness: 0.08, transparent: true, opacity: 0.95 }, true);
  def('brakeFluid', { color: 0xd8b25a, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.65 }, true);
  def('coolantPink', { color: 0xe0487a, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.75 }, true);
  def('coolantViolet', { color: 0x9b4fd1, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.75 }, true);
  def('coolantBlue', { color: 0x3fa6e0, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.75 }, true);
  def('water', { color: 0x9fd3f2, metalness: 0, roughness: 0.02, transparent: true, opacity: 0.45 }, true);
  def('lightWhite', { color: 0xffffff, emissive: 0xfff4dd, emissiveIntensity: 1.6, roughness: 0.3 });
  def('lightRed', { color: 0x8e0b0b, emissive: 0xff1a1a, emissiveIntensity: 1.1, roughness: 0.3 });
  def('lightAmber', { color: 0x9a5a00, emissive: 0xff9a00, emissiveIntensity: 1.2, roughness: 0.3 });
  def('lightOff', { color: 0x3a1010, metalness: 0.1, roughness: 0.2 });
  def('xenon', { color: 0xdfe9ff, emissive: 0xcfe0ff, emissiveIntensity: 3, roughness: 0.2 });
  def('hiAccent', { color: 0xf5a524, emissive: 0xf5a524, emissiveIntensity: 0.6, roughness: 0.4 });
  def('hiOk', { color: 0x30a46c, emissive: 0x30a46c, emissiveIntensity: 0.6, roughness: 0.4 });
  def('hiDanger', { color: 0xe5484d, emissive: 0xe5484d, emissiveIntensity: 0.7, roughness: 0.4 });
  def('hiInfo', { color: 0x3e8ed0, emissive: 0x3e8ed0, emissiveIntensity: 0.6, roughness: 0.4 });
  def('screen', { color: 0x0d1a24, emissive: 0x1d4f73, emissiveIntensity: 0.6, roughness: 0.2 });
  def('fabric', { color: 0x2b2d31, metalness: 0, roughness: 1 });
  def('leather', { color: 0x1f1f21, metalness: 0, roughness: 0.62 });
  def('concrete', { color: 0x8d8f92, metalness: 0, roughness: 0.95 });
  def('wood', { color: 0x9a6b3c, metalness: 0, roughness: 0.85 });
  def('filler', { color: 0xd8cdb0, metalness: 0, roughness: 0.9 });
  def('primerGrey', { color: 0x8c9096, metalness: 0, roughness: 0.75 });
  def('epoxy', { color: 0x6a7a68, metalness: 0, roughness: 0.6 });
  def('tape', { color: 0xe9d8a6, metalness: 0, roughness: 0.9 });

  var paintCache = {};
  /** Metallic car paint with clear coat. */
  M.carPaint = function (hex, opts) {
    var key = hex + JSON.stringify(opts || {});
    if (paintCache[key]) return paintCache[key];
    var m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: hex, metalness: 0.3, roughness: 0.4, clearcoat: 1, clearcoatRoughness: 0.04
    }, opts || {}));
    m.userData.shared = true;
    paintCache[key] = m;
    return m;
  };
  /** Non-shared copy of a material (safe to animate opacity / emissive). */
  M.clone = function (name, overrides) {
    var src = typeof name === 'string' ? M[name] : name;
    var m = src.clone();
    m.userData = {};
    if (overrides) Object.keys(overrides).forEach(function (k) {
      if (k === 'color' || k === 'emissive') m[k] = new THREE.Color(overrides[k]); else m[k] = overrides[k];
    });
    return m;
  };

  /* ================================================================ GEOMETRY */
  /** Lathe around Y. pts = [[radius, y], ...] */
  G.lathe = function (pts, seg) {
    return new THREE.LatheGeometry(pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), seg || 48);
  };
  /** Lathe whose axis is Z (good for wheels, discs, pulleys facing the viewer). */
  G.latheZ = function (pts, seg) { var g = G.lathe(pts, seg); g.rotateX(PI / 2); return g; };
  G.cyl = function (r, h, seg, r2) { return new THREE.CylinderGeometry(r2 == null ? r : r2, r, h, seg || 32); };
  G.cylZ = function (r, h, seg) { var g = G.cyl(r, h, seg); g.rotateX(PI / 2); return g; };
  G.cylX = function (r, h, seg) { var g = G.cyl(r, h, seg); g.rotateZ(PI / 2); return g; };
  G.hex = function (r, h) { var g = new THREE.CylinderGeometry(r, r, h, 6); g.rotateY(PI / 6); return g; };
  G.box = function (w, h, d) { return new THREE.BoxGeometry(w, h, d); };
  G.sphere = function (r, seg) { return new THREE.SphereGeometry(r, seg || 24, Math.max(8, (seg || 24) / 2)); };
  G.torus = function (R, r, arc, seg) { return new THREE.TorusGeometry(R, r, 12, seg || 48, arc == null ? PI * 2 : arc); };

  /** Shape from [[x,y],...] */
  G.shape = function (pts, holes) {
    var s = new THREE.Shape(pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); }));
    (holes || []).forEach(function (h) {
      if (h.isPath) s.holes.push(h);
      else s.holes.push(new THREE.Path(h.map(function (p) { return new THREE.Vector2(p[0], p[1]); })));
    });
    return s;
  };
  /** Extrude a 2D outline (XY) along Z by depth, centred on z = 0. bevel in metres (0 = sharp). */
  G.extrude = function (shapeOrPts, depth, bevel, curveSeg) {
    var shape = Array.isArray(shapeOrPts) ? G.shape(shapeOrPts) : shapeOrPts;
    bevel = bevel || 0;
    var g = new THREE.ExtrudeGeometry(shape, {
      depth: Math.max(0.0001, depth - 2 * bevel), bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * 0.9,
      bevelSegments: bevel > 0 ? 3 : 0, curveSegments: curveSeg || 24
    });
    g.translate(0, 0, -(depth - 2 * bevel) / 2);
    g.computeVertexNormals();
    return g;
  };
  /** Rounded rectangle path (centered). */
  G.rrect = function (w, h, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    r = Math.min(r, w / 2, h / 2);
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  };
  /** Rounded box w×h×d with edge radius r. */
  G.rbox = function (w, h, d, r) {
    r = r == null ? Math.min(w, h, d) * 0.12 : r;
    r = Math.min(r, d * 0.45, w * 0.45, h * 0.45); // bevel adds to the size – keep the box at w×h×d
    return G.extrude(G.rrect(w - 2 * r * 0.9, h - 2 * r * 0.9, r * 0.5), d, r);
  };
  /** Annular sector (in XY plane) from radius r1 to r2, angles a0..a1, extruded depth along Z. */
  G.sector = function (r1, r2, a0, a1, depth, bevel) {
    var s = new THREE.Shape();
    s.absarc(0, 0, r2, a0, a1, false);
    s.absarc(0, 0, r1, a1, a0, true);
    return G.extrude(s, depth, bevel || 0, 32);
  };
  /** Gear / sprocket with n teeth, axis Z. */
  G.gear = function (n, rOut, rRoot, depth, holeR) {
    var s = new THREE.Shape();
    for (var i = 0; i < n; i++) {
      var a = i / n * PI * 2, w = PI * 2 / n;
      var pts = [[rRoot, a], [rRoot, a + w * 0.2], [rOut, a + w * 0.35], [rOut, a + w * 0.65], [rRoot, a + w * 0.8]];
      pts.forEach(function (p, j) {
        var x = Math.cos(p[1]) * p[0], y = Math.sin(p[1]) * p[0];
        if (i === 0 && j === 0) s.moveTo(x, y); else s.lineTo(x, y);
      });
    }
    s.closePath();
    if (holeR) { var h = new THREE.Path(); h.absarc(0, 0, holeR, 0, PI * 2, true); s.holes.push(h); }
    return G.extrude(s, depth, 0, 8);
  };
  /** Tube through 3D points. */
  G.tube = function (points, r, closed, seg, radial) {
    var curve = new THREE.CatmullRomCurve3(points.map(K.v3), !!closed, 'catmullrom', 0.5);
    return new THREE.TubeGeometry(curve, seg || Math.max(16, points.length * 12), r, radial || 12, !!closed);
  };

  /** Closed belt / chain path around circles (convex order, counter-clockwise). circles = [{x,y,r}] in XY.
   *  Returns dense array of THREE.Vector2 along the outer contact line. */
  G.beltPath = function (circles, stepLen) {
    stepLen = stepLen || 0.004;
    var n = circles.length, out = [];
    function tangent(a, b) {
      // outer tangent for CCW traversal (belt on the outside), returns [angleOnA, angleOnB]
      var dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
      var base = Math.atan2(dy, dx);
      var phi = Math.acos(T_clamp((a.r - b.r) / d, -1, 1));
      var ang = base - phi;
      return ang;
    }
    var angs = [];
    for (var i = 0; i < n; i++) angs.push(tangent(circles[i], circles[(i + 1) % n]));
    for (var j = 0; j < n; j++) {
      var c = circles[j];
      var aIn = angs[(j - 1 + n) % n], aOut = angs[j];
      while (aOut < aIn) aOut += PI * 2;
      while (aOut - aIn > PI * 2) aOut -= PI * 2;
      var steps = Math.max(2, Math.ceil((aOut - aIn) * c.r / stepLen));
      for (var k = 0; k <= steps; k++) {
        var a = aIn + (aOut - aIn) * k / steps;
        out.push(new THREE.Vector2(c.x + Math.cos(a) * c.r, c.y + Math.sin(a) * c.r));
      }
      var nx = circles[(j + 1) % n];
      var p0 = out[out.length - 1];
      var p1 = new THREE.Vector2(nx.x + Math.cos(aOut) * nx.r, nx.y + Math.sin(aOut) * nx.r);
      var segs = Math.max(1, Math.ceil(p0.distanceTo(p1) / stepLen));
      for (var q = 1; q < segs; q++) out.push(p0.clone().lerp(p1, q / segs));
    }
    return out;
  };
  function T_clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  /** Ribbon (belt) geometry from a closed 2D path: thickness outward, width along Z. */
  G.ribbon = function (path, thick, width) {
    var outer = [], inner = [], n = path.length;
    for (var i = 0; i < n; i++) {
      var a = path[(i - 1 + n) % n], b = path[(i + 1) % n];
      var tx = b.x - a.x, ty = b.y - a.y, l = Math.hypot(tx, ty) || 1;
      var nx = ty / l, ny = -tx / l; // outward normal for CCW path
      outer.push(new THREE.Vector2(path[i].x + nx * thick, path[i].y + ny * thick));
      inner.push(path[i].clone());
    }
    var s = new THREE.Shape(outer);
    s.holes.push(new THREE.Path(inner.reverse()));
    return G.extrude(s, width, 0, 1);
  };

  /** Arc length position on a path (for moving markers along a belt). */
  G.pathLengths = function (path) {
    var L = [0];
    for (var i = 1; i <= path.length; i++) L.push(L[i - 1] + path[i % path.length].distanceTo(path[i - 1]));
    return L;
  };
  G.pointAt = function (path, lengths, s) {
    var total = lengths[lengths.length - 1];
    s = ((s % total) + total) % total;
    var lo = 0, hi = lengths.length - 1;
    while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (lengths[mid] <= s) lo = mid; else hi = mid; }
    var k = (s - lengths[lo]) / ((lengths[hi] - lengths[lo]) || 1);
    return path[lo % path.length].clone().lerp(path[hi % path.length], k);
  };

  /* =================================================================== HELPERS */
  function mesh(geo, mat, name) {
    var m = new THREE.Mesh(geo, typeof mat === 'string' ? M[mat] : mat);
    if (name) m.name = name;
    return m;
  }
  K.mesh = mesh;
  function at(obj, x, y, z) { obj.position.set(x || 0, y || 0, z || 0); return obj; }
  K.at = at;
  K.group = function (name) { var g = new THREE.Group(); if (name) g.name = name; return g; };

  /* ======================================================================= FX */
  /** Make a mesh (or all meshes in a group) highlightable. Returns fn(k 0..1, colorHex?) */
  FX.glow = function (obj, color) {
    var mats = [];
    obj.traverse(function (o) {
      if (!o.isMesh) return;
      o.material = o.material.clone();
      o.material.userData = {};
      o.material.emissive = new THREE.Color(color || 0xf5a524);
      o.material.emissiveIntensity = 0;
      mats.push(o.material);
    });
    return function (k) { mats.forEach(function (m) { m.emissiveIntensity = k * 0.9; }); };
  };
  /** Fade a group (clones materials once). Returns fn(opacity 0..1). */
  FX.fader = function (obj) {
    var mats = [];
    obj.traverse(function (o) {
      if (!o.isMesh) return;
      o.material = o.material.clone();
      o.material.userData = {};
      o.material.transparent = true;
      o.material._baseOpacity = o.material.opacity;
      mats.push(o.material);
    });
    return function (k) {
      obj.visible = k > 0.01;
      mats.forEach(function (m) { m.opacity = m._baseOpacity * k; m.depthWrite = k > 0.98; });
    };
  };
  /** Soft contact shadow (blurred dark ellipse) lying on the ground. size in metres (x by z). */
  var shadowTex = null;
  FX.contactShadow = function (sx, sz, opacity) {
    if (!shadowTex) {
      var c = document.createElement('canvas'); c.width = c.height = 128;
      var x = c.getContext('2d');
      var gr = x.createRadialGradient(64, 64, 4, 64, 64, 64);
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.55, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
      shadowTex = new THREE.CanvasTexture(c);
    }
    var m = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: opacity == null ? 0.55 : opacity, depthWrite: false });
    m.userData.keepMap = true;
    var p = new THREE.Mesh(new THREE.PlaneGeometry(sx, sz), m);
    p.rotation.x = -PI / 2; p.position.y = 0.002; p.userData.noShadow = true; p.castShadow = false; p.receiveShadow = false;
    p.renderOrder = -1;
    return p;
  };

  /** Flat panel with a canvas texture (screens, labels on parts, gauges). Unlit so it stays readable.
   *  draw(ctx2d, W, H, state) paints the canvas; call panel.userData.redraw(state) when the content changes
   *  (only when it changes – never every frame). Plane faces +Z, size wM × hM metres. */
  FX.canvasPanel = function (wM, hM, draw, opts) {
    opts = opts || {};
    var px = opts.px || 512, W = px, H = Math.round(px * hM / wM);
    var c = document.createElement('canvas'); c.width = W; c.height = H;
    var x2 = c.getContext('2d');
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    var m = new THREE.MeshBasicMaterial({ map: tex, transparent: !!opts.transparent, toneMapped: false });
    var p = new THREE.Mesh(new THREE.PlaneGeometry(wM, hM), m);
    p.userData.noShadow = true;
    var last = null;
    p.userData.redraw = function (state) {
      var key = JSON.stringify(state == null ? null : state);
      if (key === last) return;
      last = key;
      x2.clearRect(0, 0, W, H);
      draw(x2, W, H, state);
      tex.needsUpdate = true;
    };
    p.userData.redraw(opts.state == null ? null : opts.state);
    return p;
  };

  /** Straight 3D arrow from a to b (glowing). */
  FX.arrow = function (a, b, color, r) {
    a = K.v3(a); b = K.v3(b); r = r || 0.012;
    var g = new THREE.Group();
    var mat = new THREE.MeshStandardMaterial({ color: color || 0xf5a524, emissive: color || 0xf5a524, emissiveIntensity: 0.55, roughness: 0.4 });
    var dir = b.clone().sub(a), len = dir.length();
    var head = Math.min(len * 0.35, r * 5);
    var shaft = mesh(G.cyl(r, len - head, 12), mat); shaft.position.y = (len - head) / 2;
    var cone = mesh(new THREE.ConeGeometry(r * 2.6, head, 16), mat); cone.position.y = len - head / 2;
    g.add(shaft); g.add(cone);
    g.position.copy(a);
    g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    g.traverse(function (o) { o.userData.noShadow = true; o.castShadow = false; });
    return g;
  };
  /** Rotation arrow (arc with head) around local Z axis. dir 'cw' | 'ccw' as seen from +Z. */
  FX.rotArrow = function (R, dir, color, arcDeg, r) {
    var arc = (arcDeg || 240) * PI / 180; r = r || R * 0.06;
    var g = new THREE.Group();
    var mat = new THREE.MeshStandardMaterial({ color: color || 0xf5a524, emissive: color || 0xf5a524, emissiveIntensity: 0.55, roughness: 0.4 });
    var t = mesh(G.torus(R, r, arc, 48), mat);
    t.rotation.z = PI / 2 - arc / 2;
    g.add(t);
    var endA = dir === 'ccw' ? PI / 2 + arc / 2 : PI / 2 - arc / 2;
    var cone = mesh(new THREE.ConeGeometry(r * 2.6, r * 6, 16), mat);
    cone.position.set(Math.cos(endA) * R, Math.sin(endA) * R, 0);
    cone.rotation.z = endA + (dir === 'ccw' ? 0 : PI);
    g.add(cone);
    g.traverse(function (o) { o.castShadow = false; o.userData.noShadow = true; });
    return g;
  };
  /** Particle drops (e.g. oil, coolant): returns {group, update(t, active)} falling from origin along -Y. */
  FX.drops = function (mat, count, fall, size) {
    var g = new THREE.Group(), list = [];
    for (var i = 0; i < (count || 10); i++) {
      var d = mesh(G.sphere(size || 0.008, 10), mat);
      d.scale.y = 1.6; d.userData.off = i / (count || 10);
      g.add(d); list.push(d);
    }
    return {
      group: g,
      update: function (t, on, speed) {
        list.forEach(function (d) {
          var k = ((t * (speed || 1.4)) + d.userData.off) % 1;
          d.visible = !!on;
          d.position.set(Math.sin(d.userData.off * 40) * 0.004, -k * (fall || 0.4), Math.cos(d.userData.off * 30) * 0.004);
        });
      }
    };
  };
  /** Liquid stream: a tube along a quadratic curve that "flows" via scale. returns {mesh, set(k)} */
  FX.stream = function (a, c, b, mat, r) {
    var curve = new THREE.QuadraticBezierCurve3(K.v3(a), K.v3(c), K.v3(b));
    var geo = new THREE.TubeGeometry(curve, 40, r || 0.008, 10, false);
    var m = mesh(geo, mat);
    m.userData.noShadow = true;
    return { mesh: m, set: function (k) { m.visible = k > 0.01; geo.setDrawRange(0, Math.floor(geo.index.count * T_clamp(k, 0, 1) / 6) * 6); } };
  };
  /** Particle puff / spray cone (dust, mist, steam). returns {group, update(t, on)} */
  FX.puff = function (color, count, spread, rise) {
    var g = new THREE.Group(), list = [];
    var mat = new THREE.MeshStandardMaterial({ color: color || 0xdddddd, transparent: true, opacity: 0.35, roughness: 1, depthWrite: false });
    for (var i = 0; i < (count || 14); i++) {
      var p = mesh(G.sphere(0.02, 10), mat);
      p.userData.o = i / (count || 14);
      p.userData.noShadow = true;
      g.add(p); list.push(p);
    }
    return {
      group: g,
      update: function (t, on) {
        list.forEach(function (p) {
          var k = (t * 0.6 + p.userData.o) % 1;
          p.visible = !!on;
          var a = p.userData.o * 37;
          p.position.set(Math.cos(a) * (spread || 0.08) * k, k * (rise || 0.3), Math.sin(a) * (spread || 0.08) * k);
          var s = 0.4 + k * 1.6; p.scale.set(s, s, s);
        });
        mat.opacity = on ? 0.32 : 0;
      }
    };
  };

  /* ===================================================================== PARTS */

  /** Hex bolt. Head at y=0 (on top), shank down along -Y. opts {r, len, headH, mat, flange} */
  P.bolt = function (o) {
    o = o || {};
    var r = o.r || 0.007, len = o.len || 0.035, hh = o.headH || r * 0.9;
    var g = new THREE.Group();
    var head = mesh(G.hex(r * 1.6, hh), o.mat || 'zinc'); head.position.y = hh / 2;
    g.add(head);
    if (o.flange !== false) { var f = mesh(G.cyl(r * 1.85, hh * 0.25, 24), o.mat || 'zinc'); g.add(f); }
    var sh = mesh(G.cyl(r, len, 16), o.shankMat || 'steelDark'); sh.position.y = -len / 2;
    g.add(sh);
    // thread rings
    for (var i = 0; i < Math.floor(len / (r * 0.9)); i++) {
      var ring = mesh(G.torus(r * 0.98, r * 0.12, PI * 2, 16), 'steelDark');
      ring.rotation.x = PI / 2; ring.position.y = -len + r * 0.6 + i * r * 0.9;
      g.add(ring);
    }
    g.userData.head = head;
    return g;
  };

  /** Road wheel (tyre + alloy rim + bolts). Axis = Z, outer face towards +Z, centre at origin.
   *  opts {r: tyre radius, w: tyre width, rim: rim radius, spokes, bolts, rimMat, inner: true (dark backing)} */
  P.wheel = function (o) {
    o = o || {};
    var r = o.r || 0.32, w = o.w || 0.225, rr = o.rim || r * 0.7, ns = o.spokes || 5, nb = o.bolts || 5;
    var g = new THREE.Group(); g.name = 'wheel';
    var mid = (rr + r) / 2;
    var tyre = mesh(G.latheZ([
      [rr, -w * 0.42], [rr + 0.012, -w * 0.5], [mid, -w * 0.53], [r - 0.028, -w * 0.5], [r - 0.006, -w * 0.44], [r, -w * 0.32],
      [r, w * 0.32], [r - 0.006, w * 0.44], [r - 0.028, w * 0.5], [mid, w * 0.53], [rr + 0.012, w * 0.5], [rr, w * 0.42]
    ], 72), 'tire');
    g.add(tyre);
    var rimMat = o.rimMat || 'rimSilver';
    // barrel
    var barrel = mesh(G.latheZ([[rr - 0.004, -w * 0.43], [rr - 0.012, -w * 0.38], [rr - 0.012, w * 0.34], [rr - 0.004, w * 0.4]], 64), 'aluCast');
    barrel.material = M.clone('aluCast', { side: THREE.DoubleSide });
    g.add(barrel);
    var lip = mesh(G.torus(rr - 0.002, 0.009, PI * 2, 64), rimMat); lip.position.z = w * 0.41; g.add(lip);
    if (o.inner !== false) {
      var back = mesh(G.cylZ(rr - 0.012, 0.01, 48), 'plasticTex'); back.position.z = -w * 0.15; g.add(back);
    }
    // spokes (split-spoke design)
    var hubR = 0.075, depthZ = w * 0.34;
    for (var i = 0; i < ns; i++) {
      var a = i / ns * PI * 2 + PI / 2;
      [-0.12, 0.12].forEach(function (off) {
        var s = G.shape([[hubR * 0.85, -0.018], [rr - 0.02, -0.012], [rr - 0.012, 0.012], [hubR * 0.85, 0.018]]);
        var sp = mesh(G.extrude(s, 0.026, 0.004, 4), rimMat);
        sp.rotation.z = a + off;
        sp.position.z = depthZ;
        g.add(sp);
      });
    }
    var hub = mesh(G.latheZ([[0, 0.02], [hubR, 0.018], [hubR + 0.006, 0], [hubR, -0.02], [0, -0.02]], 48), rimMat);
    hub.position.z = depthZ; g.add(hub);
    var cap = mesh(G.cylZ(0.03, 0.01, 32), 'blackGloss'); cap.position.z = depthZ + 0.022; g.add(cap);
    g.userData.bolts = [];
    for (var j = 0; j < nb; j++) {
      var b = j / nb * PI * 2 + PI / 2;
      var bolt = new THREE.Group();
      var head = mesh(G.hex(0.0115, 0.016), o.boltMat || 'chrome'); head.rotation.x = PI / 2;
      var seat = mesh(G.cyl(0.012, 0.006, 20), o.boltMat || 'chrome'); seat.rotation.x = PI / 2; seat.position.z = -0.009;
      bolt.add(seat); bolt.add(head);
      bolt.position.set(Math.cos(b) * 0.056, Math.sin(b) * 0.056, depthZ + 0.02);
      g.add(bolt);
      g.userData.bolts.push(bolt);
    }
    g.userData.tyre = tyre;
    return g;
  };

  /** Brake disc, axis Z, friction face centred at z=0, hat towards +Z (outboard). opts {r, t, vented, drilled, hatR, hatH} */
  P.brakeDisc = function (o) {
    o = o || {};
    var r = o.r || 0.16, t = o.t || 0.026, hr = o.hatR || 0.085, hh = o.hatH || 0.045;
    var g = new THREE.Group(); g.name = 'disc';
    var ri = hr + 0.012;
    var rotor = mesh(G.latheZ([[ri, -t / 2], [r, -t / 2], [r, t / 2], [ri, t / 2]], 96), 'discFace');
    rotor.material = M.discFace; g.add(rotor);
    if (o.vented !== false) {
      var band = mesh(G.latheZ([[r + 0.0005, -t * 0.22], [r + 0.0005, t * 0.22]], 96), 'castIron');
      g.add(band);
      for (var i = 0; i < 36; i++) {
        var v = mesh(G.box(0.03, 0.004, t * 0.46), 'castIron');
        var a = i / 36 * PI * 2;
        v.position.set(Math.cos(a) * (r - 0.012), Math.sin(a) * (r - 0.012), 0);
        v.rotation.z = a;
        g.add(v);
      }
    }
    if (o.drilled) {
      for (var j = 0; j < 24; j++) {
        var h = mesh(G.cylZ(0.004, t + 0.002, 10), 'blackOxide');
        var b = j / 24 * PI * 2, rr = ri + 0.02 + (j % 3) * ((r - ri - 0.035) / 2);
        h.position.set(Math.cos(b) * rr, Math.sin(b) * rr, 0); g.add(h);
      }
    }
    // hat
    var hat = mesh(G.latheZ([[ri, t / 2], [hr, t / 2 + 0.004], [hr, hh], [0.035, hh], [0.035, hh - 0.006], [hr - 0.006, hh - 0.006], [hr - 0.006, t / 2]], 64), 'castIron');
    g.add(hat);
    for (var k = 0; k < 5; k++) {
      var c = k / 5 * PI * 2 + PI / 2;
      var hole = mesh(G.cylZ(0.0075, 0.004, 16), 'blackOxide'); hole.position.set(Math.cos(c) * 0.056, Math.sin(c) * 0.056, hh + 0.001); g.add(hole);
    }
    var ret = mesh(G.cylZ(0.004, 0.003, 12), 'zinc'); ret.position.set(0.07 * Math.cos(PI / 5), 0.07 * Math.sin(PI / 5), hh + 0.002); g.add(ret);
    g.userData.rotor = rotor;
    return g;
  };

  /** Brake pad (backing plate + friction) as an arc segment in XY, thickness along Z. Friction faces -Z (towards disc) when outboard. */
  P.pad = function (o) {
    o = o || {};
    var r = o.discR || 0.16, span = o.span || 0.55, a0 = (o.angle || 0) - span / 2, a1 = a0 + span;
    var g = new THREE.Group(); g.name = 'pad';
    var back = mesh(G.sector(r - 0.058, r + 0.004, a0 - 0.05, a1 + 0.05, 0.005, 0.0008), 'steelDark'); back.position.z = 0.009;
    var fr = mesh(G.sector(r - 0.054, r - 0.003, a0, a1, 0.011, 0.0015), o.worn ? 'rust' : 'padFriction'); fr.position.z = 0.0005;
    g.add(back); g.add(fr);
    // wear indicator groove
    var gro = mesh(G.box(0.002, 0.04, 0.011), 'plasticBlack');
    gro.position.set(Math.cos(o.angle || 0) * (r - 0.03), Math.sin(o.angle || 0) * (r - 0.03), 0.0005);
    gro.rotation.z = (o.angle || 0);
    g.add(gro);
    return g;
  };

  /** Floating (sliding) caliper on a carrier, around a disc in the XY plane (axis Z, outboard +Z).
   *  Returns group with userData { body, carrier, padIn, padOut, piston, guides[], hose } (all children of group).
   *  opts {discR, t, angle (rad, centre of caliper on disc), mat} */
  P.caliperFloating = function (o) {
    o = o || {};
    var r = o.discR || 0.16, t = o.t || 0.026, ang = o.angle == null ? PI : o.angle, span = 0.7;
    var g = new THREE.Group(); g.name = 'caliper';
    var a0 = ang - span / 2, a1 = ang + span / 2;
    // carrier (bracket) – inboard, straddling the disc edge
    var carrier = new THREE.Group(); carrier.name = 'carrier';
    var cb = mesh(G.sector(r - 0.07, r + 0.018, a0 - 0.12, a1 + 0.12, 0.016, 0.003), 'castIron'); cb.position.z = -(t / 2 + 0.03);
    carrier.add(cb);
    [a0 - 0.08, a1 + 0.08].forEach(function (a) {
      var arm = mesh(G.box(0.03, 0.022, t + 0.07), 'castIron');
      arm.position.set(Math.cos(a) * (r + 0.008), Math.sin(a) * (r + 0.008), -0.008); arm.rotation.z = a;
      carrier.add(arm);
      var mb = P.bolt({ r: 0.0075, len: 0.03, mat: 'blackOxide' }); mb.rotation.x = -PI / 2;
      mb.position.set(Math.cos(a) * (r - 0.045), Math.sin(a) * (r - 0.045), -(t / 2 + 0.04));
      carrier.add(mb);
    });
    g.add(carrier);
    // pads
    var padIn = P.pad({ discR: r, span: span - 0.08, angle: ang }); padIn.rotation.y = PI; padIn.position.z = -(t / 2 + 0.0005);
    var padOut = P.pad({ discR: r, span: span - 0.08, angle: ang }); padOut.position.z = t / 2 + 0.0005;
    // pad mirrored for inboard (rotation.y = PI flips x); correct angle by mirroring geometry
    padIn.scale.x = -1; padIn.rotation.y = 0; padIn.scale.z = -1;
    g.add(padIn); g.add(padOut);
    // caliper body (floating) – piston housing inboard, bridge, fingers outboard
    var body = new THREE.Group(); body.name = 'body';
    var mat = o.mat || 'caliperRed';
    var housing = mesh(G.sector(r - 0.066, r + 0.03, a0 + 0.04, a1 - 0.04, 0.05, 0.008), mat); housing.position.z = -(t / 2 + 0.042);
    var bridge = mesh(G.sector(r + 0.006, r + 0.032, a0 + 0.06, a1 - 0.06, t + 0.07, 0.006), mat); bridge.position.z = -0.005;
    var fingers = mesh(G.sector(r - 0.05, r + 0.03, a0 + 0.08, a1 - 0.08, 0.016, 0.004), mat); fingers.position.z = t / 2 + 0.02;
    body.add(housing); body.add(bridge); body.add(fingers);
    var pc = new THREE.Vector2(Math.cos(ang) * (r - 0.026), Math.sin(ang) * (r - 0.026));
    var bulge = mesh(G.cylZ(0.032, 0.028, 40), mat); bulge.position.set(pc.x, pc.y, -(t / 2 + 0.07)); body.add(bulge);
    var piston = mesh(G.cylZ(0.026, 0.03, 40), 'chrome'); piston.position.set(pc.x, pc.y, -(t / 2 + 0.024)); piston.name = 'piston';
    g.add(piston);
    // guide bolts with dust boots
    var guides = [];
    [a0 + 0.02, a1 - 0.02].forEach(function (a) {
      var gb = new THREE.Group();
      var boot = mesh(G.latheZ([[0.009, 0], [0.012, 0.006], [0.009, 0.012], [0.012, 0.018], [0.009, 0.024]], 20), 'rubber');
      gb.add(boot);
      var bh = mesh(G.hex(0.011, 0.012), 'zinc'); bh.rotation.x = PI / 2; bh.position.z = -0.008; gb.add(bh);
      var cap = mesh(G.cylZ(0.0045, 0.006, 12), 'plasticBlack'); cap.position.z = -0.016; gb.add(cap);
      gb.position.set(Math.cos(a) * (r - 0.06), Math.sin(a) * (r - 0.06), -(t / 2 + 0.07));
      body.add(gb); guides.push(gb);
    });
    // brake hose + banjo
    var hp = new THREE.Vector3(Math.cos(ang) * (r + 0.03), Math.sin(ang) * (r + 0.03), -(t / 2 + 0.06));
    var banjo = mesh(G.hex(0.009, 0.014), 'zinc'); banjo.position.copy(hp); body.add(banjo);
    var hose = mesh(G.tube([hp, hp.clone().add(new THREE.Vector3(Math.cos(ang) * 0.06, Math.sin(ang) * 0.05 + 0.04, -0.05)), hp.clone().add(new THREE.Vector3(Math.cos(ang) * 0.08, 0.16, -0.12))], 0.0055), 'rubber');
    body.add(hose);
    // bleed nipple
    var nip = mesh(G.cyl(0.004, 0.018, 12), 'zinc'); nip.position.set(Math.cos(ang + 0.2) * (r + 0.03), Math.sin(ang + 0.2) * (r + 0.03) + 0.008, -(t / 2 + 0.05)); body.add(nip);
    var nipCap = mesh(G.cyl(0.005, 0.008, 12), 'rubber'); nipCap.position.copy(nip.position); nipCap.position.y += 0.012; body.add(nipCap);
    g.add(body);
    g.userData = { body: body, carrier: carrier, padIn: padIn, padOut: padOut, piston: piston, guides: guides, hose: hose, angle: ang, nipple: nip };
    return g;
  };

  /** Fixed multi-piston caliper (monoblock) around disc, axis Z. opts {discR, t, angle, pistons:4, mat} */
  P.caliperFixed = function (o) {
    o = o || {};
    var r = o.discR || 0.178, t = o.t || 0.032, ang = o.angle == null ? PI : o.angle, span = 0.78;
    var a0 = ang - span / 2, a1 = ang + span / 2, mat = o.mat || 'caliperRed';
    var g = new THREE.Group(); g.name = 'caliperFixed';
    var body = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var half = mesh(G.sector(r - 0.07, r + 0.03, a0, a1, 0.042, 0.009), mat); half.position.z = side * (t / 2 + 0.024);
      body.add(half);
    });
    [a0 + 0.02, a1 - 0.02].forEach(function (a) {
      var br = mesh(G.sector(r + 0.004, r + 0.03, a - 0.07, a + 0.07, t + 0.06, 0.006), mat); body.add(br);
    });
    // window bridge piece in the middle
    var mid = mesh(G.sector(r + 0.018, r + 0.03, ang - 0.08, ang + 0.08, t + 0.06, 0.004), mat); body.add(mid);
    g.add(body);
    var pistons = [];
    var np = (o.pistons || 4) / 2;
    [-1, 1].forEach(function (side) {
      for (var i = 0; i < np; i++) {
        var a = ang + (i - (np - 1) / 2) * (span / (np + 0.4));
        var p = mesh(G.cylZ(0.019, 0.02, 32), 'chrome');
        p.position.set(Math.cos(a) * (r - 0.03), Math.sin(a) * (r - 0.03), side * (t / 2 + 0.012));
        p.userData.side = side; pistons.push(p); g.add(p);
      }
    });
    var padIn = P.pad({ discR: r, span: span - 0.12, angle: ang }); padIn.scale.z = -1; padIn.position.z = -(t / 2 + 0.0005);
    var padOut = P.pad({ discR: r, span: span - 0.12, angle: ang }); padOut.position.z = t / 2 + 0.0005;
    g.add(padIn); g.add(padOut);
    // retaining pins across the window + anti-rattle spring
    var pins = [];
    [-0.09, 0.09].forEach(function (da) {
      var a = ang + da;
      var pin = mesh(G.cylZ(0.0035, t + 0.1, 12), 'steel');
      pin.position.set(Math.cos(a) * (r + 0.012), Math.sin(a) * (r + 0.012), 0);
      g.add(pin); pins.push(pin);
    });
    var spring = mesh(G.box(0.05, 0.003, t + 0.04), 'steel');
    spring.position.set(Math.cos(ang) * (r + 0.016), Math.sin(ang) * (r + 0.016), 0); spring.rotation.z = ang + PI / 2;
    g.add(spring);
    var mounts = [];
    [a0 + 0.05, a1 - 0.05].forEach(function (a) {
      var mb = P.bolt({ r: 0.008, len: 0.035, mat: 'blackOxide' }); mb.rotation.x = -PI / 2;
      mb.position.set(Math.cos(a) * (r - 0.05), Math.sin(a) * (r - 0.05), -(t / 2 + 0.05));
      g.add(mb); mounts.push(mb);
    });
    g.userData = { body: body, pistons: pistons, padIn: padIn, padOut: padOut, pins: pins, spring: spring, mounts: mounts, angle: ang };
    return g;
  };

  /** Wheel hub with knuckle, CV boot and strut stub. Axis Z, flange face at z=0 facing +Z. */
  P.hub = function (o) {
    o = o || {};
    var g = new THREE.Group(); g.name = 'hub';
    var flange = mesh(G.latheZ([[0.032, 0.012], [0.07, 0.012], [0.072, 0.0], [0.05, -0.008], [0.04, -0.03], [0.032, -0.03]], 64), o.rusty ? 'rust' : 'steelDark');
    g.add(flange);
    var pilot = mesh(G.latheZ([[0.03, 0.03], [0.033, 0.012], [0.02, 0.012], [0.02, 0.03]], 48), 'steel'); g.add(pilot);
    for (var i = 0; i < 5; i++) {
      var a = i / 5 * PI * 2 + PI / 2;
      var h = mesh(G.cylZ(0.0075, 0.004, 16), 'blackOxide'); h.position.set(Math.cos(a) * 0.056, Math.sin(a) * 0.056, 0.0125); g.add(h);
    }
    var knuckle = mesh(G.rbox(0.13, 0.2, 0.06, 0.02), 'castIron'); knuckle.position.set(0, 0, -0.06); g.add(knuckle);
    var arm = mesh(G.rbox(0.05, 0.16, 0.04, 0.012), 'castIron'); arm.position.set(0.0, -0.15, -0.07); g.add(arm);
    var strut = mesh(G.cyl(0.032, 0.34, 32), 'blackOxide'); strut.position.set(0, 0.28, -0.08); strut.rotation.z = 0.06; g.add(strut);
    var spring = mesh(G.tube((function () { var p = []; for (var k = 0; k <= 60; k++) { var a = k / 60 * PI * 2 * 4; p.push([Math.cos(a) * 0.07, 0.3 + k / 60 * 0.25, -0.08 + Math.sin(a) * 0.07]); } return p; })(), 0.008, false, 240, 8), 'toolYellow');
    spring.material = M.jackRed; g.add(spring);
    var boot = mesh(G.lathe([[0.03, 0], [0.042, 0.015], [0.03, 0.03], [0.042, 0.045], [0.03, 0.06], [0.04, 0.075], [0.022, 0.1]], 32), 'rubber');
    boot.rotation.x = -PI / 2; boot.position.z = -0.09; g.add(boot);
    var shaft = mesh(G.cylZ(0.014, 0.25, 16), 'steelDark'); shaft.position.z = -0.29; g.add(shaft);
    return g;
  };

  /** Trolley jack. Handle towards -X, saddle towards +X. Ground at y=0.
   *  userData.setLift(k 0..1); userData.saddleLocal(k) -> Vector3 (top of saddle). */
  P.trolleyJack = function () {
    var g = new THREE.Group(); g.name = 'jack';
    var len = 0.7, wid = 0.26;
    [-1, 1].forEach(function (s) {
      var plate = mesh(G.extrude([[-0.35, 0.03], [0.32, 0.03], [0.34, 0.1], [-0.2, 0.15], [-0.35, 0.14]], 0.008, 0.002), 'jackRed');
      plate.position.z = s * wid / 2; g.add(plate);
    });
    var cross = mesh(G.box(0.08, 0.04, wid), 'jackRed'); cross.position.set(-0.3, 0.08, 0); g.add(cross);
    var cross2 = mesh(G.box(0.04, 0.03, wid), 'jackRed'); cross2.position.set(0.3, 0.05, 0); g.add(cross2);
    // wheels
    [[0.28, 0.03, 0.04], [-0.3, 0.035, 0.05]].forEach(function (w) {
      [-1, 1].forEach(function (s) {
        var wh = mesh(G.cylZ(w[1], 0.03, 24), 'steel'); wh.position.set(w[0], w[1], s * (wid / 2 + 0.02)); g.add(wh);
        var tr = mesh(G.torus(w[1] - 0.003, 0.006, PI * 2, 24), 'rubber'); tr.position.copy(wh.position); g.add(tr);
      });
    });
    // pump + handle
    var pump = mesh(G.cyl(0.03, 0.13, 24), 'jackRed'); pump.position.set(-0.27, 0.15, 0); g.add(pump);
    var handle = new THREE.Group();
    var tube = mesh(G.cyl(0.016, 0.8, 16), 'steelDark'); tube.position.y = 0.4; handle.add(tube);
    var grip = mesh(G.cyl(0.021, 0.14, 16), 'gripRubber'); grip.position.y = 0.76; handle.add(grip);
    handle.position.set(-0.33, 0.17, 0); handle.rotation.z = 0.8;
    g.add(handle);
    // lift arm pivoting at rear
    var pivot = new THREE.Vector3(-0.2, 0.075, 0), armLen = 0.5;
    var arm = new THREE.Group(); arm.position.copy(pivot);
    [-1, 1].forEach(function (s) {
      var side = mesh(G.extrude([[0, -0.03], [armLen, -0.015], [armLen, 0.025], [0, 0.04]], 0.01, 0.002), 'jackRed');
      side.position.z = s * 0.06; arm.add(side);
    });
    var ramPivot = mesh(G.cylZ(0.012, 0.14, 12), 'steel'); arm.add(ramPivot);
    g.add(arm);
    var saddle = new THREE.Group();
    var cup = mesh(G.lathe([[0, 0], [0.055, 0], [0.06, 0.025], [0.052, 0.028], [0.045, 0.01], [0, 0.01]], 32), 'steelDark');
    var pad = mesh(G.cyl(0.045, 0.012, 32), 'rubber'); pad.position.y = 0.017;
    var post = mesh(G.cyl(0.018, 0.05, 16), 'steel'); post.position.y = -0.025;
    saddle.add(cup); saddle.add(pad); saddle.add(post);
    g.add(saddle);
    var ram = mesh(G.cyl(0.016, 1, 16), 'chrome'); g.add(ram);
    var a0 = -0.075, a1 = 0.6;
    function setLift(k) {
      var a = a0 + (a1 - a0) * k;
      arm.rotation.z = a;
      var tip = new THREE.Vector3(Math.cos(a) * armLen, Math.sin(a) * armLen, 0).add(pivot);
      saddle.position.set(tip.x, tip.y + 0.05, 0);
      // hydraulic ram from pump to mid-arm
      var base = new THREE.Vector3(-0.22, 0.09, 0), mid = new THREE.Vector3(Math.cos(a) * 0.22, Math.sin(a) * 0.22, 0).add(pivot);
      var d = mid.clone().sub(base);
      ram.scale.y = d.length();
      ram.position.copy(base).add(d.clone().multiplyScalar(0.5));
      ram.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    }
    function saddleLocal(k) {
      var a = a0 + (a1 - a0) * k;
      return new THREE.Vector3(Math.cos(a) * armLen + pivot.x, Math.sin(a) * armLen + pivot.y + 0.078, 0);
    }
    setLift(0);
    g.userData = { setLift: setLift, saddleLocal: saddleLocal, saddle: saddle, arm: arm, handle: handle };
    return g;
  };

  /** Axle stand. Ground at y=0, saddle top at userData.topY. opts {h: column extension 0..} */
  P.axleStand = function (o) {
    o = o || {};
    var base = o.base || 0.3;
    var g = new THREE.Group(); g.name = 'stand';
    for (var i = 0; i < 4; i++) {
      var a = i / 4 * PI * 2 + PI / 4;
      var foot = new THREE.Vector3(Math.cos(a) * 0.15, 0.01, Math.sin(a) * 0.15);
      var top = new THREE.Vector3(Math.cos(a) * 0.035, base, Math.sin(a) * 0.035);
      var d = top.clone().sub(foot);
      var leg = mesh(G.box(0.025, d.length(), 0.025), 'toolRed');
      leg.position.copy(foot).add(d.clone().multiplyScalar(0.5));
      leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
      g.add(leg);
      var pad = mesh(G.box(0.05, 0.008, 0.05), 'toolRed'); pad.position.copy(foot); pad.position.y = 0.004; g.add(pad);
    }
    var sleeve = mesh(G.box(0.06, 0.1, 0.06), 'toolRed'); sleeve.position.y = base - 0.03; g.add(sleeve);
    var col = new THREE.Group();
    var post = mesh(G.box(0.036, 0.3, 0.036), 'steel'); post.position.y = -0.1; col.add(post);
    for (var k = 0; k < 8; k++) { var tooth = mesh(G.box(0.006, 0.01, 0.034), 'steelDark'); tooth.position.set(0.02, -0.2 + k * 0.025, 0); col.add(tooth); }
    var cradle = mesh(G.extrude([[-0.06, 0.05], [-0.045, 0.05], [-0.02, 0.012], [0.02, 0.012], [0.045, 0.05], [0.06, 0.05], [0.04, 0], [-0.04, 0]], 0.05, 0.004), 'steel');
    cradle.position.y = 0.05; col.add(cradle);
    g.add(col);
    var pin = mesh(G.cylX(0.006, 0.1, 12), 'chrome'); pin.position.set(0, base - 0.02, 0); g.add(pin);
    var ring = mesh(G.torus(0.018, 0.003, PI * 2, 16), 'chrome'); ring.position.set(0.055, base - 0.02, 0); ring.rotation.y = PI / 2; g.add(ring);
    function setH(h) { col.position.y = base + h; g.userData.topY = base + h + 0.062; }
    setH(o.h || 0.05);
    g.userData.setH = setH;
    g.userData.col = col;
    return g;
  };

  /** Wheel chock (wedge), long side along X, ground at y=0. */
  P.chock = function () {
    var g = new THREE.Group();
    var w = mesh(G.extrude([[-0.12, 0], [0.12, 0], [0.12, 0.012], [-0.06, 0.12], [-0.12, 0.12]], 0.13, 0.008), 'toolYellow');
    g.add(w);
    for (var i = 0; i < 4; i++) { var rib = mesh(G.box(0.012, 0.01, 0.13), 'rubber'); rib.position.set(-0.1 + i * 0.05, 0.004, 0); g.add(rib); }
    return g;
  };

  /* ------------------------------------------------------------------ tools
   * All hand tools: working head at the origin, drive/bolt axis = Y (socket opening towards -Y),
   * handle along +X, lying in the XZ plane. Rotate the returned group about Y to swing the handle. */
  P.socket = function (r, len) {
    r = r || 0.012; len = len || 0.045;
    var g = new THREE.Group();
    var body = mesh(G.lathe([[r * 1.05, -len / 2], [r * 1.25, -len / 2 + 0.003], [r * 1.25, len * 0.1], [r * 0.95, len * 0.25], [r * 0.95, len / 2], [r * 0.6, len / 2], [r * 0.6, -len / 2]], 32), 'chrome');
    g.add(body);
    return g;
  };
  P.ratchet = function (len, socketR) {
    len = len || 0.26;
    var g = new THREE.Group();
    var sock = P.socket(socketR || 0.012, 0.045); sock.position.y = 0.022; g.add(sock);
    var head = mesh(G.cyl(0.022, 0.022, 32), 'chrome'); head.position.y = 0.055; g.add(head);
    var arm = mesh(G.box(len, 0.012, 0.022), 'chrome'); arm.position.set(len / 2, 0.055, 0); g.add(arm);
    var grip = mesh(G.rbox(len * 0.45, 0.022, 0.03, 0.009), 'gripRubber'); grip.position.set(len * 0.75, 0.055, 0); g.add(grip);
    var lever = mesh(G.box(0.012, 0.006, 0.01), 'chrome'); lever.position.set(0, 0.068, 0); g.add(lever);
    return g;
  };
  P.breakerBar = function (len) {
    len = len || 0.45;
    var g = new THREE.Group();
    var sock = P.socket(0.013, 0.05); sock.position.y = 0.025; g.add(sock);
    var knuckle = mesh(G.cyl(0.016, 0.03, 20), 'chrome'); knuckle.position.y = 0.062; g.add(knuckle);
    var bar = mesh(G.cylX(0.011, len, 20), 'chrome'); bar.position.set(len / 2, 0.062, 0); g.add(bar);
    var grip = mesh(G.cylX(0.016, 0.12, 20), 'gripRubber'); grip.position.set(len - 0.06, 0.062, 0); g.add(grip);
    return g;
  };
  P.torqueWrench = function (len) {
    len = len || 0.45;
    var g = new THREE.Group();
    var sock = P.socket(0.012, 0.045); sock.position.y = 0.022; g.add(sock);
    var head = mesh(G.cyl(0.02, 0.02, 32), 'chrome'); head.position.y = 0.053; g.add(head);
    var tube = mesh(G.cylX(0.014, len * 0.7, 24), 'chrome'); tube.position.set(len * 0.35, 0.053, 0); g.add(tube);
    var scale = mesh(G.cylX(0.0145, len * 0.18, 24), 'toolYellow'); scale.position.set(len * 0.5, 0.053, 0); g.add(scale);
    var grip = mesh(G.cylX(0.019, len * 0.3, 24), 'gripRubber'); grip.position.set(len * 0.85, 0.053, 0); g.add(grip);
    var knob = mesh(G.cylX(0.016, 0.02, 24), 'chrome'); knob.position.set(len + 0.01, 0.053, 0); g.add(knob);
    return g;
  };
  /** Combination spanner (ring end at origin). */
  P.spanner = function (len, ringR) {
    len = len || 0.18; ringR = ringR || 0.013;
    var g = new THREE.Group();
    var s = new THREE.Shape();
    s.absarc(0, 0, ringR * 1.7, PI * 0.25, PI * 1.75, false);
    s.lineTo(len, -ringR * 0.75); s.lineTo(len, ringR * 0.75); s.closePath();
    var hole = new THREE.Path(); hole.absarc(0, 0, ringR, 0, PI * 2, true); s.holes.push(hole);
    var body = mesh(G.extrude(s, 0.007, 0.0015), 'chrome'); body.rotation.x = PI / 2; g.add(body);
    var open = mesh(G.extrude([[len - 0.005, -ringR * 1.5], [len + 0.035, -ringR * 1.5], [len + 0.035, -ringR * 0.8], [len + 0.012, -ringR * 0.8], [len + 0.012, ringR * 0.8], [len + 0.035, ringR * 0.8], [len + 0.035, ringR * 1.5], [len - 0.005, ringR * 1.5]], 0.007, 0.0015), 'chrome');
    open.rotation.x = PI / 2; g.add(open);
    return g;
  };
  P.screwdriver = function (len, matHandle) {
    len = len || 0.2;
    var g = new THREE.Group();
    var shaft = mesh(G.cylX(0.003, len * 0.55, 12), 'chrome'); shaft.position.x = len * 0.275; g.add(shaft);
    var tip = mesh(G.box(0.012, 0.0015, 0.006), 'chrome'); tip.position.x = 0.004; g.add(tip);
    var handle = mesh(G.latheZ([[0.006, 0], [0.013, 0.01], [0.014, 0.08], [0.011, 0.095], [0, 0.097]], 20), matHandle || 'toolRed');
    handle.rotation.y = PI / 2; handle.position.x = len * 0.55; g.add(handle);
    return g;
  };
  P.hammer = function () {
    var g = new THREE.Group();
    var head = mesh(G.rbox(0.11, 0.03, 0.03, 0.006), 'steelDark'); g.add(head);
    var handle = mesh(G.cyl(0.012, 0.3, 16), 'wood'); handle.position.set(0, -0.16, 0); g.add(handle);
    return g;
  };
  /** Hand (simplified glove) – for push / press cues. Palm faces -Z. */
  P.glove = function (mat) {
    var g = new THREE.Group();
    var m = mat || M.clone('toolBlue', { roughness: 0.9 });
    var palm = mesh(G.rbox(0.085, 0.1, 0.03, 0.012), m); g.add(palm);
    for (var i = 0; i < 4; i++) { var f = mesh(G.cyl(0.0095, 0.075, 12), m); f.position.set(-0.03 + i * 0.02, 0.085, 0); g.add(f); }
    var th = mesh(G.cyl(0.011, 0.06, 12), m); th.position.set(0.05, 0.02, 0.005); th.rotation.z = -0.8; g.add(th);
    var cuff = mesh(G.cyl(0.05, 0.06, 20), 'plasticBlack'); cuff.scale.z = 0.5; cuff.position.y = -0.08; g.add(cuff);
    return g;
  };

  /* -------------------------------------------------------------- workshop */
  /** Oil drain pan (open tub), rim top at y = h. */
  P.drainPan = function (r, h) {
    r = r || 0.22; h = h || 0.08;
    var g = new THREE.Group();
    var tub = mesh(G.lathe([[0, 0.002], [r * 0.8, 0.002], [r, h], [r + 0.012, h + 0.004], [r + 0.012, h - 0.004], [r * 0.82, -0.002], [0, -0.002]], 48), 'plasticBlack');
    tub.material = M.plasticBlack; g.add(tub);
    var spout = mesh(G.box(0.05, 0.02, 0.04), 'plasticBlack'); spout.position.set(r + 0.01, h - 0.005, 0); g.add(spout);
    var liquid = mesh(G.cyl(r * 0.8, 0.002, 48, r * 0.8), 'oilOld'); liquid.position.y = 0.004; g.add(liquid);
    g.userData.setLevel = function (k) {
      var y = 0.004 + k * (h - 0.012), rr = r * 0.8 + (r * 0.2) * (y / h);
      liquid.position.y = y; liquid.scale.set(rr / (r * 0.8), 1, rr / (r * 0.8)); liquid.visible = k > 0.02;
    };
    g.userData.setLevel(0);
    return g;
  };
  /** 5 L oil can (jerrycan style). Bottom at y=0, spout at top-front (+X). */
  P.oilCan = function (color) {
    var g = new THREE.Group();
    var m = M.clone('plasticBlack', { color: color || 0x1d1f22, roughness: 0.4 });
    var body = mesh(G.rbox(0.19, 0.27, 0.12, 0.03), m); body.position.y = 0.135; g.add(body);
    var label = mesh(G.box(0.15, 0.13, 0.002), 'toolYellow'); label.position.set(0, 0.12, 0.061); g.add(label);
    var label2 = label.clone(); label2.position.z = -0.061; g.add(label2);
    var handle = mesh(G.rbox(0.06, 0.03, 0.03, 0.01), m); handle.position.set(-0.04, 0.29, 0); g.add(handle);
    var neck = mesh(G.cyl(0.02, 0.04, 24), m); neck.position.set(0.06, 0.285, 0); g.add(neck);
    var cap = mesh(G.cyl(0.022, 0.018, 24), 'toolYellow'); cap.position.set(0.06, 0.31, 0); g.add(cap);
    g.userData.spout = new THREE.Vector3(0.06, 0.31, 0);
    g.userData.cap = cap;
    return g;
  };
  P.funnel = function () {
    var g = new THREE.Group();
    var f = mesh(G.lathe([[0.012, -0.12], [0.014, -0.12], [0.014, -0.04], [0.08, 0.04], [0.082, 0.045], [0.078, 0.045], [0.012, -0.035], [0.01, -0.12]], 40), 'plasticWhite');
    f.material = M.clone('plasticWhite', { side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    g.add(f);
    return g;
  };
  /** Spin-on oil filter, axis Y, base (gasket) at y=0, can downwards. */
  P.filterCan = function (color) {
    var g = new THREE.Group();
    var m = M.clone('caliperRed', { color: color || 0x1f4fa8 });
    var can = mesh(G.lathe([[0.034, 0], [0.038, -0.004], [0.04, -0.012], [0.04, -0.1], [0.036, -0.108], [0, -0.11]], 40), m); g.add(can);
    var base = mesh(G.cyl(0.038, 0.006, 40), 'steel'); base.position.y = -0.002; g.add(base);
    var gasket = mesh(G.torus(0.03, 0.0035, PI * 2, 32), 'rubber'); gasket.rotation.x = PI / 2; gasket.position.y = 0.002; g.add(gasket);
    for (var i = 0; i < 24; i++) {
      var flute = mesh(G.box(0.004, 0.012, 0.004), 'steelDark');
      var a = i / 24 * PI * 2; flute.position.set(Math.cos(a) * 0.038, -0.1, Math.sin(a) * 0.038); g.add(flute);
    }
    g.userData.gasket = gasket;
    return g;
  };
  /** Cartridge (paper element) filter, axis Y, centred, height h. */
  P.filterCartridge = function (dirty, h) {
    h = h || 0.11;
    var g = new THREE.Group();
    var pleats = 40;
    for (var i = 0; i < pleats; i++) {
      var a = i / pleats * PI * 2;
      var p = mesh(G.box(0.022, h, 0.0035), dirty ? 'paperDirty' : 'paper');
      p.position.set(Math.cos(a) * 0.026, 0, Math.sin(a) * 0.026); p.rotation.y = -a;
      g.add(p);
    }
    [-1, 1].forEach(function (s) {
      var cap = mesh(G.latheZ([[0.012, -0.002], [0.039, -0.002], [0.039, 0.002], [0.012, 0.002]], 40), 'plasticBlack');
      cap.rotation.x = PI / 2; cap.position.y = s * h / 2; g.add(cap);
    });
    var core = mesh(G.cyl(0.012, h, 20), 'plasticGrey'); g.add(core);
    return g;
  };

  /** Inline engine (transverse look): block, head, cam cover, oil pan, filler cap, dipstick, filter housing.
   *  Crank axis along X, front of engine (pulleys) at -X. Bottom of sump at y=0.
   *  opts {cyl: 3|4, diesel, filter: 'cartridge'|'spin'}; returns group with userData parts. */
  P.engine = function (o) {
    o = o || {};
    var n = o.cyl || 4, len = 0.12 * n + 0.14;
    var g = new THREE.Group(); g.name = 'engine';
    var sump = mesh(G.extrude([[-len / 2, 0.02], [len / 2 - 0.05, 0.02], [len / 2, 0.08], [len / 2, 0.17], [-len / 2, 0.17]], 0.26, 0.012), 'aluCast');
    sump.rotation.y = 0; g.add(sump);
    var block = mesh(G.rbox(len, 0.3, 0.32, 0.02), 'castIron'); block.position.y = 0.32; g.add(block);
    var head = mesh(G.rbox(len - 0.02, 0.12, 0.3, 0.015), 'aluCast'); head.position.y = 0.53; g.add(head);
    var cover = mesh(G.extrude([[-len / 2 + 0.02, 0], [len / 2 - 0.02, 0], [len / 2 - 0.04, 0.06], [-len / 2 + 0.04, 0.06]], 0.24, 0.015), 'plasticBlack');
    cover.position.y = 0.59; g.add(cover);
    for (var i = 0; i < n; i++) {
      var coil = mesh(G.rbox(0.045, 0.05, 0.07, 0.01), 'plasticTex'); coil.position.set(-len / 2 + 0.13 + i * 0.12, 0.665, 0); g.add(coil);
    }
    var cap = new THREE.Group();
    var capBody = mesh(G.cyl(0.032, 0.022, 32), 'toolYellow'); cap.add(capBody);
    var capRib = mesh(G.box(0.05, 0.012, 0.012), 'toolYellow'); capRib.position.y = 0.014; cap.add(capRib);
    cap.position.set(len / 2 - 0.12, 0.665, 0.06); g.add(cap);
    var neck = mesh(G.cyl(0.026, 0.02, 24), 'plasticBlack'); neck.position.set(len / 2 - 0.12, 0.652, 0.06); g.add(neck);
    // intake & exhaust manifolds
    for (var j = 0; j < n; j++) {
      var runner = mesh(G.tube([[-len / 2 + 0.13 + j * 0.12, 0.52, 0.15], [-len / 2 + 0.13 + j * 0.12, 0.55, 0.24], [-len / 2 + 0.13 + j * 0.1, 0.62, 0.3]], 0.022), 'plasticBlack');
      g.add(runner);
      var ex = mesh(G.tube([[-len / 2 + 0.13 + j * 0.12, 0.5, -0.15], [-len / 2 + 0.13 + j * 0.12, 0.47, -0.22], [-0.02, 0.38, -0.26]], 0.02), 'steelDark');
      g.add(ex);
    }
    var plenum = mesh(G.cylX(0.05, len * 0.8, 24), 'plasticBlack'); plenum.position.set(0, 0.63, 0.3); g.add(plenum);
    var heat = mesh(G.rbox(len * 0.6, 0.15, 0.02, 0.005), 'alu'); heat.position.set(0, 0.45, -0.25); g.add(heat);
    // front: pulleys + belt
    var crankP = mesh(G.cylX(0.075, 0.035, 48), 'steelDark'); crankP.position.set(-len / 2 - 0.03, 0.2, 0); g.add(crankP);
    var altP = mesh(G.cylX(0.03, 0.03, 32), 'steelDark'); altP.position.set(-len / 2 - 0.03, 0.42, 0.2); g.add(altP);
    var alt = mesh(G.cylX(0.07, 0.12, 32), 'alu'); alt.position.set(-len / 2 + 0.04, 0.42, 0.2); g.add(alt);
    var tcover = mesh(G.rbox(0.03, 0.5, 0.28, 0.02), 'plasticBlack'); tcover.position.set(-len / 2 - 0.005, 0.4, -0.02); g.add(tcover);
    // dipstick
    var dip = new THREE.Group();
    var tubeD = mesh(G.tube([[len / 2 - 0.06, 0.22, 0.14], [len / 2 - 0.04, 0.45, 0.2], [len / 2 - 0.05, 0.66, 0.2]], 0.006), 'steelDark'); g.add(tubeD);
    var loop = mesh(G.torus(0.018, 0.005, PI * 2, 24), 'toolYellow'); loop.position.set(len / 2 - 0.05, 0.69, 0.2); dip.add(loop);
    g.add(dip);
    // oil filter
    var filter = new THREE.Group(); filter.name = 'filter';
    if (o.filter === 'spin') {
      var fc = P.filterCan(); fc.rotation.z = PI * 0.75; filter.add(fc);
      filter.position.set(len / 2 - 0.1, 0.22, 0.18);
    } else {
      var housing = mesh(G.lathe([[0.04, 0], [0.045, 0.01], [0.045, 0.12], [0.04, 0.125]], 40), 'plasticBlack'); filter.add(housing);
      var fcap = new THREE.Group(); fcap.name = 'filterCap';
      var fcb = mesh(G.cyl(0.048, 0.03, 40), 'plasticBlack'); fcap.add(fcb);
      var fhex = mesh(G.hex(0.019, 0.016), 'plasticBlack'); fhex.position.y = 0.022; fcap.add(fhex);
      fcap.position.y = 0.14; filter.add(fcap);
      filter.userData.cap = fcap;
      filter.position.set(-len / 2 + 0.06, 0.62, 0.2);
    }
    g.add(filter);
    // drain plug on the rear-low side of the sump
    var plug = new THREE.Group(); plug.name = 'drainPlug';
    var ph = mesh(G.hex(0.011, 0.012), 'zinc'); ph.rotation.z = PI / 2; plug.add(ph);
    var pw = mesh(G.cylX(0.014, 0.003, 24), 'copper'); pw.position.x = -0.007; plug.add(pw);
    plug.position.set(len / 2 + 0.004, 0.05, 0); g.add(plug);
    // engine mounts
    g.userData = { len: len, cap: cap, dipstick: dip, filter: filter, drainPlug: plug, sumpTopY: 0.17, sump: sump };
    return g;
  };
})(window.STU);
