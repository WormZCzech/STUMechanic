/* Animation library – reusable SVG building blocks.
 *
 * CONVENTIONS for animation authors
 * ---------------------------------
 * - Every animation is registered with STU.anim.register('<file>.<name>', { render(ctx) }).
 *   ctx = { t(localized) -> string, vehicle: '<vehicle id>', uid: '<unique prefix>' }
 *   render() returns a full <svg> string – use L.svg(inner, ariaLabel).
 * - Canvas is viewBox 0 0 480 300.
 * - Colours come ONLY from k-* classes (theme aware, see css/styles.css):
 *   k-body, k-body2, k-metal, k-metal2, k-dark, k-tire, k-rim, k-oil, k-fluid, k-line,
 *   k-accent, k-danger, k-ok, k-warn, k-text, k-muted, k-glass, k-ground, k-paint, k-filler,
 *   k-rust, k-belt, k-none (fill none) and stroke variants s-line, s-accent, s-danger,
 *   s-ok, s-dark, s-metal, s-belt, s-text, s-warn.
 * - A CSS animation that sets `transform` REPLACES the element's transform attribute.
 *   Therefore position with an outer <g transform="..."> and animate an inner <g class="...">.
 *   For rotations use class "spin" helpers below (transform-box: fill-box; origin center).
 * - Keyframes for a file are injected once with STU.anim.css('<file>', `...css...`).
 *   Prefix keyframe and class names with the file name (e.g. oil-drip) to avoid clashes.
 * - Keep loops 4–10 s, `infinite`, so the viewer can watch repeatedly.
 */
(function (S) {
  'use strict';
  var L = S.animLib = {};
  var esc = S.esc;

  L.W = 480;
  L.H = 300;

  L.svg = function (inner, aria) {
    return '<svg class="anim-svg" viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' +
      esc(aria || '') + '">' + inner + '</svg>';
  };

  /** Text label. opts: {anchor:'start'|'middle'|'end', cls, size, bg:true, weight} */
  L.label = function (x, y, text, opts) {
    opts = opts || {};
    var anchor = opts.anchor || 'middle';
    var size = opts.size || 13;
    var cls = opts.cls || 'k-text';
    var out = '';
    if (opts.bg) {
      var w = String(text).length * size * 0.56 + 12;
      var bx = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w + 6 : x - 6;
      out += '<rect class="' + (opts.bgCls || 'k-labelbg') + '" x="' + bx.toFixed(1) + '" y="' + (y - size + 1) +
        '" width="' + w.toFixed(1) + '" height="' + (size + 8) + '" rx="5"/>';
    }
    out += '<text x="' + x + '" y="' + (y + 3) + '" text-anchor="' + anchor + '" font-size="' + size +
      '" font-weight="' + (opts.weight || 600) + '" class="' + cls + '">' + esc(text) + '</text>';
    return out;
  };

  /** Coloured pill, e.g. torque value. level: ok|warn|danger|accent */
  L.badge = function (x, y, text, level) {
    var size = 13;
    var w = String(text).length * size * 0.6 + 16;
    var c = { ok: 'k-ok', warn: 'k-warn', danger: 'k-danger', accent: 'k-accent' }[level || 'accent'];
    return '<g><rect class="' + c + '" x="' + (x - w / 2).toFixed(1) + '" y="' + (y - 13) + '" width="' + w.toFixed(1) +
      '" height="22" rx="11"/><text x="' + x + '" y="' + (y + 3) + '" text-anchor="middle" font-size="' + size +
      '" font-weight="700" class="k-badgetext">' + esc(text) + '</text></g>';
  };

  L.ground = function (y) {
    y = y == null ? 262 : y;
    return '<rect class="k-ground" x="0" y="' + y + '" width="480" height="' + (300 - y) + '"/>' +
      '<line class="s-line" x1="0" y1="' + y + '" x2="480" y2="' + y + '" stroke-width="2"/>';
  };

  /** Hex bolt head seen from the front. */
  L.hex = function (cx, cy, r, cls) {
    var pts = [];
    for (var i = 0; i < 6; i++) {
      var a = Math.PI / 6 + i * Math.PI / 3;
      pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1));
    }
    return '<polygon class="' + (cls || 'k-metal2') + ' s-dark" stroke-width="1" points="' + pts.join(' ') + '"/>';
  };

  /** Wheel seen from the side of the car. opts: {bolts:5, spinCls} */
  L.wheel = function (cx, cy, r, opts) {
    opts = opts || {};
    var n = opts.bolts || 5;
    var s = '<g transform="translate(' + cx + ',' + cy + ')"><g class="' + (opts.spinCls || '') + '">';
    s += '<circle class="k-tire" r="' + r + '"/>';
    s += '<circle class="k-rim" r="' + (r * 0.68) + '"/>';
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / n;
      s += '<line class="s-metal" stroke-width="' + (r * 0.12).toFixed(1) + '" x1="0" y1="0" x2="' +
        (Math.cos(a + Math.PI / n) * r * 0.62).toFixed(1) + '" y2="' + (Math.sin(a + Math.PI / n) * r * 0.62).toFixed(1) + '"/>';
    }
    s += '<circle class="k-metal" r="' + (r * 0.3) + '"/>';
    for (var j = 0; j < n; j++) {
      var b = -Math.PI / 2 + j * 2 * Math.PI / n;
      s += L.hex(Math.cos(b) * r * 0.2, Math.sin(b) * r * 0.2, r * 0.055, 'k-dark');
    }
    s += '</g></g>';
    return s;
  };

  /** Generic car side silhouette, front pointing right. x,y = rear-bottom of body. Length 300.
   *  opts: {wheels:true, cls:'' (class on group), r: wheel radius, spinCls} */
  L.car = function (x, y, opts) {
    opts = opts || {};
    var r = opts.r || 30;
    var s = '<g transform="translate(' + x + ',' + y + ')"><g class="' + (opts.cls || '') + '">';
    // body
    s += '<path class="k-body s-dark" stroke-width="2" d="M0,-18 L4,-58 Q8,-66 22,-68 L78,-72 L118,-108 Q126,-114 140,-114 L210,-114 Q224,-114 234,-104 L262,-74 L292,-66 Q304,-62 304,-48 L304,-20 Q304,-12 296,-12 L0,-12 Z"/>';
    // windows
    s += '<path class="k-glass" d="M92,-74 L124,-104 Q128,-108 136,-108 L168,-108 L168,-74 Z"/>';
    s += '<path class="k-glass" d="M176,-74 L176,-108 L206,-108 Q216,-108 224,-100 L248,-74 Z"/>';
    // door line, handle, lights
    s += '<line class="s-dark" stroke-width="1.5" x1="172" y1="-74" x2="172" y2="-14"/>';
    s += '<rect class="k-dark" x="150" y="-66" width="14" height="4" rx="2"/>';
    s += '<rect class="k-warn" x="292" y="-60" width="10" height="8" rx="2"/>';
    s += '<rect class="k-danger" x="2" y="-58" width="8" height="10" rx="2"/>';
    // sill + jacking point marks
    s += '<rect class="k-body2" x="56" y="-20" width="200" height="8" rx="3"/>';
    s += '</g>';
    if (opts.wheels !== false) {
      s += '<g class="' + (opts.cls || '') + '">';
      s += '<circle class="k-dark" cx="60" cy="-12" r="' + (r + 4) + '"/>';
      s += '<circle class="k-dark" cx="246" cy="-12" r="' + (r + 4) + '"/>';
      s += '</g>';
      s += '<g class="' + (opts.wheelCls || opts.cls || '') + '">' + L.wheel(60, -12 + (opts.wheelDrop || 0), r, { spinCls: opts.spinCls }) +
        L.wheel(246, -12 + (opts.wheelDrop || 0), r, { spinCls: opts.spinCls }) + '</g>';
    }
    s += '</g>';
    return s;
  };

  /** Curved rotation arrow around (cx,cy). dir 'cw' | 'ccw'. */
  L.rotArrow = function (cx, cy, r, dir, cls, sweepDeg) {
    var sweep = (sweepDeg || 240) * Math.PI / 180;
    var a0 = -Math.PI / 2 - sweep / 2;
    var a1 = a0 + sweep;
    var ccw = dir === 'ccw';
    var start = ccw ? a1 : a0, end = ccw ? a0 : a1;
    var p = function (a, rr) { return [cx + Math.cos(a) * (rr || r), cy + Math.sin(a) * (rr || r)]; };
    var ps = p(start), pe = p(end);
    var large = sweep > Math.PI ? 1 : 0;
    var d = 'M' + ps[0].toFixed(1) + ',' + ps[1].toFixed(1) + ' A' + r + ',' + r + ' 0 ' + large + ' ' + (ccw ? 0 : 1) + ' ' +
      pe[0].toFixed(1) + ',' + pe[1].toFixed(1);
    // arrow head: tangent direction at end
    var tang = ccw ? end - Math.PI / 2 : end + Math.PI / 2;
    var hx = pe[0], hy = pe[1], hl = 10;
    var h1 = [hx - Math.cos(tang - 0.45) * hl, hy - Math.sin(tang - 0.45) * hl];
    var h2 = [hx - Math.cos(tang + 0.45) * hl, hy - Math.sin(tang + 0.45) * hl];
    var c = cls || 'accent';
    return '<g><path class="k-none s-' + c + '" stroke-width="3.5" stroke-linecap="round" d="' + d + '"/>' +
      '<polygon class="k-' + c + '" points="' + hx.toFixed(1) + ',' + hy.toFixed(1) + ' ' + h1[0].toFixed(1) + ',' + h1[1].toFixed(1) + ' ' +
      h2[0].toFixed(1) + ',' + h2[1].toFixed(1) + '"/></g>';
  };

  /** Straight arrow from (x1,y1) to (x2,y2). */
  L.arrow = function (x1, y1, x2, y2, cls, width) {
    var c = cls || 'accent';
    var a = Math.atan2(y2 - y1, x2 - x1), hl = 11;
    var h1 = [x2 - Math.cos(a - 0.45) * hl, y2 - Math.sin(a - 0.45) * hl];
    var h2 = [x2 - Math.cos(a + 0.45) * hl, y2 - Math.sin(a + 0.45) * hl];
    var ex = x2 - Math.cos(a) * 6, ey = y2 - Math.sin(a) * 6;
    return '<g><line class="s-' + c + '" stroke-width="' + (width || 3.5) + '" stroke-linecap="round" x1="' + x1 + '" y1="' + y1 +
      '" x2="' + ex.toFixed(1) + '" y2="' + ey.toFixed(1) + '"/><polygon class="k-' + c + '" points="' + x2 + ',' + y2 + ' ' +
      h1[0].toFixed(1) + ',' + h1[1].toFixed(1) + ' ' + h2[0].toFixed(1) + ',' + h2[1].toFixed(1) + '"/></g>';
  };

  /** Combination wrench, horizontal, ring end at (0,0) local. Place with outer transform. */
  L.wrench = function (len) {
    len = len || 120;
    return '<g><rect class="k-metal s-dark" stroke-width="1" x="8" y="-6" width="' + (len - 16) + '" height="12" rx="5"/>' +
      '<circle class="k-metal s-dark" stroke-width="1" cx="0" cy="0" r="14"/><circle class="k-dark" cx="0" cy="0" r="7"/>' +
      '<path class="k-metal s-dark" stroke-width="1" d="M' + (len - 10) + ',-13 L' + (len + 12) + ',-13 L' + (len + 12) + ',-5 L' + (len + 2) + ',-5 L' +
      (len + 2) + ',5 L' + (len + 12) + ',5 L' + (len + 12) + ',13 L' + (len - 10) + ',13 Z"/></g>';
  };

  /** Torque wrench, head at (0,0) local, handle to the right. */
  L.torqueWrench = function (len) {
    len = len || 170;
    return '<g><rect class="k-metal2 s-dark" stroke-width="1" x="0" y="-7" width="' + (len * 0.65) + '" height="14" rx="4"/>' +
      '<rect class="k-dark" x="' + (len * 0.62) + '" y="-10" width="' + (len * 0.38) + '" height="20" rx="8"/>' +
      '<rect class="k-accent" x="' + (len * 0.45) + '" y="-8" width="16" height="16" rx="2"/>' +
      '<circle class="k-metal s-dark" stroke-width="1" cx="0" cy="0" r="13"/><rect class="k-dark" x="-5" y="-5" width="10" height="10"/></g>';
  };

  /** Floor (trolley) jack, side view. Saddle top at (0,0) local when fully raised; liftCls animates arm group. */
  L.floorJack = function (liftCls) {
    return '<g>' +
      '<rect class="k-danger s-dark" stroke-width="1.5" x="-70" y="40" width="110" height="18" rx="4"/>' +
      '<circle class="k-dark" cx="-58" cy="62" r="7"/><circle class="k-dark" cx="28" cy="62" r="7"/>' +
      '<line class="s-dark" stroke-width="5" stroke-linecap="round" x1="-68" y1="44" x2="-130" y2="10"/>' +
      '<g class="' + (liftCls || '') + '"><path class="k-danger s-dark" stroke-width="1.5" d="M-40,44 L-6,4 L6,4 L10,10 L-26,48 Z"/>' +
      '<rect class="k-metal s-dark" stroke-width="1.5" x="-14" y="-6" width="28" height="10" rx="2"/></g>' +
      '</g>';
  };

  /** Axle stand, top saddle at (0,0) local, standing on ground at y=h. */
  L.axleStand = function (h) {
    h = h || 80;
    return '<g><path class="k-warn s-dark" stroke-width="1.5" d="M-30,' + h + ' L-8,0 L8,0 L30,' + h + ' L20,' + h + ' L0,' + (h * 0.35) + ' L-20,' + h + ' Z"/>' +
      '<rect class="k-metal s-dark" stroke-width="1.5" x="-6" y="-14" width="12" height="20"/>' +
      '<path class="k-metal s-dark" stroke-width="1.5" d="M-16,-22 L-12,-12 L12,-12 L16,-22 L8,-22 L6,-16 L-6,-16 L-8,-22 Z"/>' +
      '<circle class="k-dark" cx="0" cy="' + (h * 0.15) + '" r="3"/></g>';
  };

  /** Wheel chock. */
  L.chock = function () {
    return '<path class="k-warn s-dark" stroke-width="1.5" d="M-22,0 L22,0 L22,-6 Q4,-8 -14,-30 L-22,-30 Z"/>';
  };

  /** Check mark and cross icons (circle badge). */
  L.check = function (x, y, cls) {
    return '<g transform="translate(' + x + ',' + y + ')" class="' + (cls || '') + '"><circle class="k-ok" r="14"/>' +
      '<path class="k-none s-white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" d="M-6,0 L-1,5 L7,-5"/></g>';
  };
  L.cross = function (x, y, cls) {
    return '<g transform="translate(' + x + ',' + y + ')" class="' + (cls || '') + '"><circle class="k-danger" r="14"/>' +
      '<path class="k-none s-white" stroke-width="3.5" stroke-linecap="round" d="M-5,-5 L5,5 M5,-5 L-5,5"/></g>';
  };
  /** Warning triangle icon. */
  L.warnIcon = function (x, y, cls) {
    return '<g transform="translate(' + x + ',' + y + ')" class="' + (cls || '') + '"><path class="k-warn s-dark" stroke-width="1.5" d="M0,-15 L16,12 L-16,12 Z"/>' +
      '<rect class="k-dark" x="-1.6" y="-6" width="3.2" height="10" rx="1"/><circle class="k-dark" cx="0" cy="7.5" r="1.8"/></g>';
  };

  /** Falling drops from (x,y), n drops, class for colour. Animation 'lib-drop'. */
  L.drops = function (x, y, n, fall, cls) {
    var s = '';
    n = n || 4;
    for (var i = 0; i < n; i++) {
      s += '<g transform="translate(' + x + ',' + y + ')"><path class="' + (cls || 'k-oil') + ' lib-drop" style="--fall:' + (fall || 80) +
        'px;animation-delay:' + (i * 0.35).toFixed(2) + 's" d="M0,-6 Q5,2 0,5 Q-5,2 0,-6 Z"/></g>';
    }
    return s;
  };

  /** Engine / work light glow. */
  L.glow = function (x, y, r, cls) {
    return '<circle class="' + (cls || 'k-accent') + ' lib-pulse" cx="' + x + '" cy="' + y + '" r="' + r + '" opacity="0.25"/>';
  };

  S.anim.css('lib', [
    '.spin-cw{animation:lib-spin-cw 3s linear infinite;transform-box:fill-box;transform-origin:center}',
    '.spin-ccw{animation:lib-spin-ccw 3s linear infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes lib-spin-cw{to{transform:rotate(360deg)}}',
    '@keyframes lib-spin-ccw{to{transform:rotate(-360deg)}}',
    '.lib-drop{animation:lib-drop 1.4s ease-in infinite;opacity:0}',
    '@keyframes lib-drop{0%{transform:translateY(0);opacity:0}10%{opacity:1}85%{opacity:1}100%{transform:translateY(var(--fall));opacity:0}}',
    '.lib-pulse{animation:lib-pulse 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes lib-pulse{0%,100%{opacity:.15;transform:scale(.9)}50%{opacity:.45;transform:scale(1.1)}}',
    '.lib-blink{animation:lib-blink 1.2s steps(2,start) infinite}',
    '@keyframes lib-blink{to{visibility:hidden}}',
    '.lib-fade{animation:lib-fade 2s ease-in-out infinite}',
    '@keyframes lib-fade{0%,100%{opacity:.25}50%{opacity:1}}'
  ].join('\n'));
})(window.STU);
