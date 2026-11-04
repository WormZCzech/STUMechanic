/* STUMechanic 3D engine – realistic, interactive tutorial scenes on three.js (r147, global THREE).
 *
 * SCENE AUTHORING (see js/3d/scenes/lifting.js for a full example)
 * ---------------------------------------------------------------
 * STU.scene3d.register('<topic>.<name>', {
 *   duration: 8,                       // loop length in seconds
 *   camera: { pos: [x,y,z], target: [x,y,z], fov: 35 },   // metres, Y up
 *   shadow: 3,                         // half-size of the shadow camera box (m), default 3
 *   ground: true,                      // workshop floor (default true)
 *   thumbT: 4,                         // time used for still thumbnails
 *   build: function (ctx, K) {         // ctx = { t(localized), vehicle, lang }, K = kit (THREE, M, G, P, T, car…)
 *     var root = new THREE.Group();
 *     ...
 *     return {
 *       root: root,
 *       update: function (t, dt) { ... },            // animate by absolute loop time t
 *       labels:   [{ text, at: Object3D | [x,y,z] | fn(t)->Vector3, show: [t0,t1] | fn(t), level: 'danger'|'ok'|'accent' }],
 *       captions: [{ text, show: [t0,t1] (optional), level }],
 *       cameraPath: function (t) { return { pos:[..], target:[..] }; }   // optional animated camera
 *     };
 *   }
 * });
 *
 * Units: metres. Car length along X (front = +X), width along Z, up = +Y. Ground at y = 0.
 * Use materials from K.M (shared, never mutate them – clone if you need a variant: K.M.clone('steel')).
 * Animate ONLY inside update(t) using K.T helpers (seg, pulse, lerp…) so replay/scrub is deterministic.
 */
(function (S) {
  'use strict';
  var E = S.three = {};
  S.scenes = {};
  S.scene3d = {
    register: function (id, def) {
      if (S.scenes[id]) throw new Error('Duplicate 3D scene ' + id);
      S.scenes[id] = def;
    }
  };

  var THREE = window.THREE;
  if (THREE && THREE.ColorManagement) THREE.ColorManagement.legacyMode = false; // treat hex colours as sRGB
  var K = E.kit = { THREE: THREE };

  /* ------------------------------------------------------------------ support */
  var _sup = null;
  E.supported = function () {
    if (_sup !== null) return _sup;
    try {
      var c = document.createElement('canvas');
      _sup = !!(window.THREE && window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { _sup = false; }
    return _sup;
  };
  E.enabled = function () { return E.supported() && S.store.get('mode3d', true) !== false; };

  /* ----------------------------------------------------------------- timeline */
  var T = K.T = {
    clamp: function (x, a, b) { return Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, x)); },
    smooth: function (x) { x = T.clamp(x); return x * x * (3 - 2 * x); },
    /** eased 0→1 progress between times a and b */
    seg: function (t, a, b) { return T.smooth((t - a) / (b - a)); },
    /** linear 0→1 progress between a and b */
    lin: function (t, a, b) { return T.clamp((t - a) / (b - a)); },
    /** 0→1→0 bump between a and b */
    pulse: function (t, a, b) { var k = T.lin(t, a, b); return Math.sin(Math.PI * k); },
    between: function (t, a, b) { return t >= a && t < b; },
    lerp: function (a, b, k) { return a + (b - a) * k; },
    /** piecewise keyframes: keys = [[t, value], ...] (numbers), eased */
    keys: function (t, keys) {
      if (t <= keys[0][0]) return keys[0][1];
      for (var i = 1; i < keys.length; i++) {
        if (t <= keys[i][0]) {
          var k = T.seg(t, keys[i - 1][0], keys[i][0]);
          return keys[i - 1][1] + (keys[i][1] - keys[i - 1][1]) * k;
        }
      }
      return keys[keys.length - 1][1];
    }
  };

  function v3(a) {
    if (!a) return new THREE.Vector3();
    if (a.isVector3) return a.clone();
    return new THREE.Vector3(a[0], a[1], a[2]);
  }
  K.v3 = v3;

  /* ------------------------------------------------------------------- theme */
  function cssVar(name, fallback) {
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    } catch (e) { return fallback; }
  }
  function themeColors() {
    return {
      bg: new THREE.Color(cssVar('--a-bg', '#1b2130')),
      floor: new THREE.Color(cssVar('--a-ground', '#252c3a'))
    };
  }

  /* ------------------------------------------------------------- environment */
  /** Studio environment for realistic reflections (softboxes in a grey room). */
  function makeEnv(renderer) {
    var scene = new THREE.Scene();
    var room = new THREE.Mesh(new THREE.BoxGeometry(20, 10, 20), new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0x5a6068 }));
    room.position.y = 4;
    scene.add(room);
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshBasicMaterial({ color: 0x3a3e44 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -0.9;
    scene.add(floor);
    function box(w, h, x, y, z, ry, intensity) {
      var m = new THREE.MeshBasicMaterial({ color: 0xffffff });
      m.color.setScalar(intensity);
      var b = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
      b.position.set(x, y, z); b.lookAt(0, 1, 0); if (ry) b.rotation.z = ry;
      scene.add(b);
    }
    box(8, 1.2, 0, 8.5, 0, 0, 9);     // long ceiling strip
    box(5, 3, -9, 4, 3, 0, 5);        // left softbox
    box(5, 3, 9, 3.5, -4, 0, 4);      // right softbox
    box(3, 6, 2, 3, 9.5, 0, 3);       // back panel
    var pm = new THREE.PMREMGenerator(renderer);
    var tex = pm.fromScene(scene, 0.04).texture;
    pm.dispose();
    scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    return tex;
  }

  /* -------------------------------------------------------------- renderers */
  function makeRenderer(preserve) {
    var r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: !!preserve, powerPreference: 'high-performance' });
    r.outputEncoding = THREE.sRGBEncoding;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r._env = makeEnv(r);
    return r;
  }
  var liveRenderer = null, snapRenderer = null;
  function getLive() { if (!liveRenderer) liveRenderer = makeRenderer(false); return liveRenderer; }
  function getSnap() { if (!snapRenderer) { snapRenderer = makeRenderer(true); snapRenderer.setPixelRatio(1); } return snapRenderer; }

  /* -------------------------------------------------------------- world */
  function buildWorld(def, ctx, renderer) {
    var col = themeColors();
    var scene = new THREE.Scene();
    scene.background = col.bg;
    scene.environment = renderer._env;
    scene.fog = new THREE.Fog(col.bg, 14, 30);

    var hemi = new THREE.HemisphereLight(0xdfe8ff, 0x3a3a40, 0.22);
    scene.add(hemi);
    var key = new THREE.DirectionalLight(0xfff6ea, 2.1);
    var sz = def.shadow || 3;
    key.position.set(sz * 1.2, sz * 3, sz * 1.6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -sz; key.shadow.camera.right = sz;
    key.shadow.camera.top = sz; key.shadow.camera.bottom = -sz;
    key.shadow.camera.near = 0.1; key.shadow.camera.far = sz * 10;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    var tgt = v3((def.camera && def.camera.target) || [0, 0, 0]);
    key.target.position.copy(tgt);
    key.position.add(tgt);
    scene.add(key); scene.add(key.target);
    var fill = new THREE.DirectionalLight(0xc8d8ff, 0.35);
    fill.position.set(-5, 3, -4);
    scene.add(fill);

    if (def.ground !== false) {
      var g = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: col.floor, roughness: 0.82, metalness: 0.0, envMapIntensity: 0.25 }));
      g.rotation.x = -Math.PI / 2;
      g.receiveShadow = true;
      g.name = 'ground';
      scene.add(g);
    }

    var inst = def.build(ctx, K) || {};
    if (!inst.root) inst.root = new THREE.Group();
    inst.root.traverse(function (o) {
      if (o.isMesh) {
        if (o.userData.noShadow) return;
        o.castShadow = true; o.receiveShadow = true;
      }
    });
    scene.add(inst.root);
    return { scene: scene, inst: inst, key: key };
  }

  function disposeTree(obj) {
    obj.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        var mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(function (m) {
          if (m.userData && m.userData.shared) return;
          if (m.map && !m.userData.keepMap) m.map.dispose();
          m.dispose();
        });
      }
    });
  }

  function makeCtx(vehicle) {
    return { t: S.t, vehicle: vehicle, lang: S.lang };
  }

  /* ---------------------------------------------------------------- viewer */
  var activeViewers = [];

  function Viewer(box, id, opts) {
    this.box = box;
    this.stage = box.querySelector('.stage');
    this.id = id;
    this.def = S.scenes[id];
    this.opts = opts || {};
    this.rate = 1;
    this.paused = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) && !this.opts.forceMotion;
    this.time = this.paused ? (this.def.thumbT != null ? this.def.thumbT : (this.def.duration || 6) * 0.5) : 0;
    this.userCam = false;
    this.visible = true;
  }

  Viewer.prototype.mount = function (vehicle) {
    var self = this, def = this.def;
    // only one live viewer at a time shares the live renderer
    activeViewers.slice().forEach(function (v) { if (v !== self) v.destroy(); });
    activeViewers = [this];

    var renderer = this.renderer = getLive();
    this.stage.innerHTML = '';
    this.stage.classList.add('stage3d');
    this.stage.appendChild(renderer.domElement);
    renderer.domElement.className = 'gl';
    this.overlay = document.createElement('div');
    this.overlay.className = 'ov3d';
    this.stage.appendChild(this.overlay);
    this.capBox = document.createElement('div');
    this.capBox.className = 'cap3d';
    this.overlay.appendChild(this.capBox);
    if (!this.opts.noHint) {
      var hint = document.createElement('div');
      hint.className = 'hint3d';
      hint.textContent = S.ui('drag3d');
      this.overlay.appendChild(hint);
      setTimeout(function () { hint.classList.add('fade'); }, 3500);
    }

    var w = buildWorld(def, makeCtx(vehicle), renderer);
    this.world = w;
    var cam = def.camera || {};
    this.camera = new THREE.PerspectiveCamera(cam.fov || 35, 1.6, 0.03, 120);
    this.home = { pos: v3(cam.pos || [4, 2.5, 5]), target: v3(cam.target || [0, 0.5, 0]) };
    this.target = this.home.target.clone();
    this.setSpherical(this.home.pos, this.home.target);

    // labels
    this.labelEls = (w.inst.labels || []).map(function (l) {
      var el = document.createElement('div');
      el.className = 'l3d' + (l.level ? ' ' + l.level : '');
      el.textContent = S.t(l.text);
      self.overlay.appendChild(el);
      return el;
    });
    this.capEls = (w.inst.captions || []).map(function (c) {
      var el = document.createElement('div');
      el.className = 'c3d' + (c.level ? ' ' + c.level : '');
      el.textContent = S.t(c.text);
      self.capBox.appendChild(el);
      return el;
    });

    this.bindControls();
    this.resize();
    if (window.ResizeObserver) {
      this.ro = new ResizeObserver(function () { self.resize(); });
      this.ro.observe(this.stage);
    }
    if (window.IntersectionObserver) {
      this.io = new IntersectionObserver(function (es) { self.visible = es[0].isIntersecting; });
      this.io.observe(this.stage);
    }
    this.last = performance.now();
    var loop = function (now) {
      if (self.dead) return;
      self.raf = requestAnimationFrame(loop);
      var dt = Math.min(0.1, (now - self.last) / 1000);
      self.last = now;
      if (!self.paused) self.time += dt * self.rate;
      if (self.visible || self.firstFrame !== true) { self.frame(dt); self.firstFrame = true; }
    };
    this.raf = requestAnimationFrame(loop);
  };

  Viewer.prototype.setSpherical = function (pos, target) {
    var off = pos.clone().sub(target);
    this.sph = new THREE.Spherical().setFromVector3(off);
    this.target = target.clone();
  };

  Viewer.prototype.applyCamera = function () {
    var p = new THREE.Vector3().setFromSpherical(this.sph).add(this.target);
    this.camera.position.copy(p);
    this.camera.lookAt(this.target);
  };

  Viewer.prototype.frame = function (dt) {
    var def = this.def, inst = this.world.inst;
    var D = def.duration || 6;
    var t = ((this.time % D) + D) % D;
    if (inst.update) inst.update(t, dt);
    if (!this.userCam && inst.cameraPath) {
      var cp = inst.cameraPath(t);
      if (cp) this.setSpherical(v3(cp.pos), v3(cp.target));
    }
    this.applyCamera();
    this.renderer.render(this.world.scene, this.camera);
    this.updateOverlay(t);
  };

  function visibleAt(show, t) {
    if (!show) return true;
    if (typeof show === 'function') return !!show(t);
    return t >= show[0] && t < show[1];
  }

  Viewer.prototype.updateOverlay = function (t) {
    var self = this, inst = this.world.inst;
    var rect = { w: this.stage.clientWidth, h: this.stage.clientHeight };
    var tmp = new THREE.Vector3();
    (inst.labels || []).forEach(function (l, i) {
      var el = self.labelEls[i];
      var on = visibleAt(l.show, t);
      if (on) {
        if (typeof l.at === 'function') { var a = l.at(t); if (a && a.isVector3) tmp.copy(a); else if (a) tmp.set(a[0], a[1], a[2]); }
        else if (l.at && l.at.isObject3D) l.at.getWorldPosition(tmp);
        else if (l.at && l.at.isVector3) tmp.copy(l.at);
        else tmp.set(l.at[0], l.at[1], l.at[2]);
        tmp.project(self.camera);
        if (tmp.z > 1 || tmp.z < -1) on = false;
        el.style.transform = 'translate(' + ((tmp.x + 1) / 2 * rect.w).toFixed(1) + 'px,' + ((1 - tmp.y) / 2 * rect.h).toFixed(1) + 'px) translate(-50%,-100%)';
      }
      el.classList.toggle('on', on);
    });
    (inst.captions || []).forEach(function (c, i) {
      self.capEls[i].classList.toggle('on', visibleAt(c.show, t));
    });
  };

  Viewer.prototype.resize = function () {
    var w = this.stage.clientWidth || 480, h = this.stage.clientHeight || 300;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.camera.aspect = w / h;
    // keep the framing comparable on narrow screens
    this.camera.fov = (this.def.camera && this.def.camera.fov || 35) * (w / h < 1.3 ? 1.25 : 1);
    this.camera.updateProjectionMatrix();
  };

  Viewer.prototype.bindControls = function () {
    var self = this, el = this.renderer.domElement;
    var pts = {}, lastDist = 0;
    var minR = (this.def.zoom && this.def.zoom[0]) || this.sph.radius * 0.35;
    var maxR = (this.def.zoom && this.def.zoom[1]) || this.sph.radius * 2.2;
    this._down = function (e) {
      pts[e.pointerId] = { x: e.clientX, y: e.clientY, type: e.pointerType };
      if (el.setPointerCapture) try { el.setPointerCapture(e.pointerId); } catch (x) { /* */ }
    };
    this._move = function (e) {
      var p = pts[e.pointerId];
      if (!p) return;
      var ids = Object.keys(pts);
      if (ids.length === 2) {
        var a = pts[ids[0]], b = pts[ids[1]];
        p.x = e.clientX; p.y = e.clientY;
        var d = Math.hypot(a.x - b.x, a.y - b.y);
        if (lastDist) { self.sph.radius = T.clamp(self.sph.radius * lastDist / d, minR, maxR); self.userCam = true; }
        lastDist = d;
        return;
      }
      var dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      self.sph.theta -= dx * 0.008;
      if (p.type === 'mouse' || Math.abs(dy) > Math.abs(dx)) self.sph.phi = T.clamp(self.sph.phi - dy * 0.006, 0.12, 1.52);
      self.userCam = true;
      if (self.paused) self.frame(0);
    };
    this._up = function (e) { delete pts[e.pointerId]; lastDist = 0; };
    this._wheel = function (e) {
      e.preventDefault();
      self.sph.radius = T.clamp(self.sph.radius * (e.deltaY > 0 ? 1.1 : 0.9), minR, maxR);
      self.userCam = true;
      if (self.paused) self.frame(0);
    };
    this._dbl = function () { self.resetView(); };
    el.addEventListener('pointerdown', this._down);
    el.addEventListener('pointermove', this._move);
    el.addEventListener('pointerup', this._up);
    el.addEventListener('pointercancel', this._up);
    el.addEventListener('wheel', this._wheel, { passive: false });
    el.addEventListener('dblclick', this._dbl);
  };

  Viewer.prototype.resetView = function () {
    this.userCam = false;
    this.setSpherical(this.home.pos, this.home.target);
    if (this.paused) this.frame(0);
  };
  Viewer.prototype.togglePause = function () { this.paused = !this.paused; return this.paused; };
  Viewer.prototype.toggleSlow = function () { this.rate = this.rate === 1 ? 0.35 : 1; return this.rate !== 1; };
  Viewer.prototype.replay = function () { this.time = 0; this.paused = false; };

  Viewer.prototype.destroy = function () {
    if (this.dead) return;
    this.dead = true;
    cancelAnimationFrame(this.raf);
    if (this.ro) this.ro.disconnect();
    if (this.io) this.io.disconnect();
    var el = this.renderer && this.renderer.domElement;
    if (el) {
      el.removeEventListener('pointerdown', this._down);
      el.removeEventListener('pointermove', this._move);
      el.removeEventListener('pointerup', this._up);
      el.removeEventListener('pointercancel', this._up);
      el.removeEventListener('wheel', this._wheel);
      el.removeEventListener('dblclick', this._dbl);
      if (el.parentNode) el.parentNode.removeChild(el);
    }
    if (this.world) {
      if (this.world.inst.dispose) try { this.world.inst.dispose(); } catch (e) { /* */ }
      disposeTree(this.world.scene);
    }
    var i = activeViewers.indexOf(this);
    if (i >= 0) activeViewers.splice(i, 1);
  };

  E.Viewer = Viewer;
  E.mount = function (box, id, vehicle, opts) {
    var v = new Viewer(box, id, opts);
    v.mount(vehicle);
    return v;
  };
  E.destroyAll = function () { activeViewers.slice().forEach(function (v) { v.destroy(); }); };

  /* -------------------------------------------------------------- snapshots */
  var snapCache = {};
  var snapQueue = [];
  var snapBusy = false;
  /** Render a still image of a scene (for thumbnails). Returns a data URL. */
  E.snapshot = function (id, vehicle, w, h, t) {
    var def = S.scenes[id];
    var r = getSnap();
    r.setSize(w, h, false);
    var world = buildWorld(def, makeCtx(vehicle), r);
    var cam = def.camera || {};
    var camera = new THREE.PerspectiveCamera(cam.fov || 35, w / h, 0.03, 120);
    var tt = t != null ? t : (def.thumbT != null ? def.thumbT : (def.duration || 6) * 0.5);
    if (world.inst.update) world.inst.update(tt, 0);
    var cp = world.inst.cameraPath ? world.inst.cameraPath(tt) : null;
    camera.position.copy(v3((cp && cp.pos) || cam.pos || [4, 2.5, 5]));
    camera.lookAt(v3((cp && cp.target) || cam.target || [0, 0.5, 0]));
    r.render(world.scene, camera);
    var url = r.domElement.toDataURL('image/jpeg', 0.86);
    if (world.inst.dispose) try { world.inst.dispose(); } catch (e) { /* */ }
    disposeTree(world.scene);
    return url;
  };

  /** Queue a thumbnail into an <img> (rendered one by one so the UI stays responsive). */
  E.thumb = function (img, id, vehicle) {
    var key = id + '|' + vehicle + '|' + cssVar('--a-bg', '') + '|' + S.lang;
    if (snapCache[key]) { img.src = snapCache[key]; return; }
    snapQueue.push({ img: img, id: id, vehicle: vehicle, key: key });
    pump();
  };
  function pump() {
    if (snapBusy || !snapQueue.length) return;
    snapBusy = true;
    setTimeout(function () {
      var job = snapQueue.shift();
      if (!job) { snapBusy = false; return; }
      try {
        if (!snapCache[job.key]) snapCache[job.key] = E.snapshot(job.id, job.vehicle, 480, 270);
        if (job.img.isConnected) job.img.src = snapCache[job.key];
      } catch (e) { console.error('thumbnail ' + job.id, e); }
      snapBusy = false;
      pump();
    }, 16);
  }
  E.clearThumbQueue = function () { snapQueue.length = 0; };
})(window.STU);
