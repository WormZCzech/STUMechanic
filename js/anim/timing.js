/* Animations: timing belt / chain (výměna rozvodů). */
(function (S) {
  'use strict';
  var L = S.animLib, A = S.anim;
  var CHAIN = { 'mb-cl500-c216': true, 'toyota-gr-yaris': true };
  var CRANK_T = 2.4; // seconds per crankshaft revolution in running animations

  function f(n) { return (+n).toFixed(1); }
  function lbl(x, y, text, anchor, cls, size) {
    return L.label(x, y, text, { anchor: anchor || 'middle', bg: true, size: size || 12, cls: cls });
  }

  A.css('timing', [
    '.timing-spin{animation:timing-spin 2.4s linear infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes timing-spin{to{transform:rotate(360deg)}}',
    '.timing-teeth{animation:timing-teeth 2.4s linear infinite}',
    '@keyframes timing-teeth{to{stroke-dashoffset:-126}}',
    /* interference 8 s */
    '.timing-pis{animation:timing-pis 8s ease-in-out infinite}',
    '@keyframes timing-pis{0%{transform:translateY(90px)}12.5%{transform:translateY(0)}25%{transform:translateY(90px)}37.5%{transform:translateY(0)}50%,52%{transform:translateY(90px)}72%,92%{transform:translateY(8px)}100%{transform:translateY(90px)}}',
    '.timing-val{animation:timing-val 8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0}',
    '@keyframes timing-val{0%{transform:translateY(36px) rotate(0)}6%,19%{transform:translateY(0) rotate(0)}25%{transform:translateY(36px) rotate(0)}31%,44%{transform:translateY(0) rotate(0)}50%,72%{transform:translateY(36px) rotate(0)}76%,92%{transform:translateY(36px) rotate(6deg)}100%{transform:translateY(36px) rotate(0)}}',
    '.timing-ph1{animation:timing-ph1 8s linear infinite}',
    '@keyframes timing-ph1{0%,47%{opacity:1}50%,100%{opacity:0}}',
    '.timing-ph2{animation:timing-ph2 8s linear infinite;opacity:0}',
    '@keyframes timing-ph2{0%,49%{opacity:0}52%,97%{opacity:1}100%{opacity:0}}',
    '.timing-ph3{animation:timing-ph3 8s linear infinite;opacity:0}',
    '@keyframes timing-ph3{0%,75%{opacity:0}78%,97%{opacity:1}100%{opacity:0}}',
    '.timing-flash{animation:timing-flash 8s ease-out infinite;opacity:0;transform-box:fill-box;transform-origin:center}',
    '@keyframes timing-flash{0%,71%{opacity:0;transform:scale(.4)}73%{opacity:1;transform:scale(1.25)}82%,100%{opacity:0;transform:scale(1)}}',
    /* TDC 6 s */
    '.timing-tdcc{animation:timing-tdcc 6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes timing-tdcc{0%{transform:rotate(-250deg)}60%,100%{transform:rotate(0)}}',
    '.timing-tdcm{animation:timing-tdcm 6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes timing-tdcm{0%{transform:rotate(-125deg)}60%,100%{transform:rotate(0)}}',
    '.timing-ok6{animation:timing-ok6 6s linear infinite;opacity:0}',
    '@keyframes timing-ok6{0%,60%{opacity:0}64%,96%{opacity:1}100%{opacity:0}}',
    /* lock 6 s */
    '.timing-pin{animation:timing-pin 6s ease-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes timing-pin{0%,8%{transform:scale(2.6);opacity:0}32%,94%{transform:scale(1);opacity:1}100%{transform:scale(1);opacity:0}}',
    '.timing-tool{animation:timing-tool 6s ease-out infinite}',
    '@keyframes timing-tool{0%,30%{transform:translateY(70px);opacity:0}55%,94%{transform:translateY(0);opacity:1}100%{transform:translateY(0);opacity:0}}',
    '.timing-okl{animation:timing-okl 6s linear infinite;opacity:0}',
    '@keyframes timing-okl{0%,58%{opacity:0}62%,94%{opacity:1}100%{opacity:0}}',
    /* tensioner 7 s */
    '.timing-ecc{animation:timing-ecc 7s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes timing-ecc{0%,8%{transform:rotate(55deg)}50%,95%{transform:rotate(0)}100%{transform:rotate(55deg)}}',
    '.timing-okt{animation:timing-okt 7s linear infinite;opacity:0}',
    '@keyframes timing-okt{0%,50%{opacity:0}54%,95%{opacity:1}100%{opacity:0}}',
    /* release 7 s */
    '.timing-relt{animation:timing-relt 7s ease-in-out infinite}',
    '@keyframes timing-relt{0%,12%{transform:translate(0,0)}28%,92%{transform:translate(-12px,8px)}100%{transform:translate(0,0)}}',
    '.timing-relb{animation:timing-relb 7s ease-in-out infinite}',
    '@keyframes timing-relb{0%,30%{opacity:1;transform:translateY(0)}55%,92%{opacity:.08;transform:translateY(-10px)}100%{opacity:1;transform:translateY(0)}}',
    /* rotate 2 turns 8 s */
    '.timing-r2c{animation:timing-r2c 8s linear infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes timing-r2c{0%{transform:rotate(0)}80%,100%{transform:rotate(720deg)}}',
    '.timing-r2m{animation:timing-r2m 8s linear infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes timing-r2m{0%{transform:rotate(0)}80%,100%{transform:rotate(360deg)}}',
    '.timing-r2b{animation:timing-r2b 8s linear infinite}',
    '@keyframes timing-r2b{0%{stroke-dashoffset:0}80%,100%{stroke-dashoffset:-427.2}}',
    '.timing-c1{animation:timing-c1 8s linear infinite;opacity:0}',
    '@keyframes timing-c1{0%,39%{opacity:0}41%,79%{opacity:1}80%,100%{opacity:0}}',
    '.timing-c2{animation:timing-c2 8s linear infinite;opacity:0}',
    '@keyframes timing-c2{0%,79%{opacity:0}81%,98%{opacity:1}100%{opacity:0}}',
    /* coolant 8 s */
    '.timing-lvl{animation:timing-lvl 8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes timing-lvl{0%{transform:scaleY(.2)}50%,95%{transform:scaleY(1)}100%{transform:scaleY(.2)}}',
    '.timing-bub{animation:timing-bub 1.6s ease-out infinite;opacity:0}',
    '@keyframes timing-bub{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-55px);opacity:0}}',
    '.timing-q1{animation:timing-q1 8s linear infinite}',
    '@keyframes timing-q1{0%,50%{opacity:1}53%,100%{opacity:0}}',
    '.timing-q2{animation:timing-q2 8s linear infinite;opacity:0}',
    '@keyframes timing-q2{0%,52%{opacity:0}55%,96%{opacity:1}100%{opacity:0}}',
    /* drain 7 s */
    '.timing-tray{animation:timing-tray 7s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes timing-tray{0%{transform:scaleY(.1)}85%,95%{transform:scaleY(1)}100%{transform:scaleY(.1)}}',
    '.timing-rad{animation:timing-rad 7s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes timing-rad{0%{transform:scaleY(1)}85%,95%{transform:scaleY(.08)}100%{transform:scaleY(1)}}',
    /* support 7 s */
    '.timing-mount{animation:timing-mount 7s ease-in-out infinite}',
    '@keyframes timing-mount{0%,30%{transform:translate(0,0);opacity:1}60%,92%{transform:translate(40px,-60px);opacity:0}100%{transform:translate(0,0);opacity:1}}',
    '.timing-oks{animation:timing-oks 7s linear infinite;opacity:0}',
    '@keyframes timing-oks{0%,10%{opacity:0}16%,95%{opacity:1}100%{opacity:0}}',
    /* chain 8 s */
    '.timing-chq1{animation:timing-ph1 8s linear infinite}',
    '.timing-chq2{animation:timing-ph2 8s linear infinite;opacity:0}',
    '.timing-plg{animation:timing-plg 8s ease-in-out infinite}',
    '@keyframes timing-plg{0%,48%{transform:translateX(0)}60%,95%{transform:translateX(-9px)}100%{transform:translateX(0)}}',
    '.timing-rail{animation:timing-rail 8s ease-in-out infinite}',
    '@keyframes timing-rail{0%,48%{transform:translate(0,0)}60%,95%{transform:translate(7.9px,-4.4px)}100%{transform:translate(0,0)}}',
    '.timing-late{animation:timing-late 8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes timing-late{0%,48%{transform:rotate(0)}60%,95%{transform:rotate(-16deg)}100%{transform:rotate(0)}}',
    '.timing-rattle{animation:timing-rattle 8s linear infinite}',
    '@keyframes timing-rattle{0%,60%{transform:translate(0,0)}62%{transform:translate(1.5px,-1px)}64%{transform:translate(-1.5px,1px)}66%{transform:translate(1.5px,0)}68%{transform:translate(-1px,1px)}70%,100%{transform:translate(0,0)}}',
    /* diag 8 s */
    '.timing-needle{animation:timing-needle 8s ease-in-out infinite}',
    '@keyframes timing-needle{0%{transform:translateX(-4px)}15%{transform:translateX(5px)}30%{transform:translateX(-6px)}45%{transform:translateX(2px)}60%,95%{transform:translateX(-64px)}100%{transform:translateX(-4px)}}'
  ].join('\n'));

  /* ------------------------------------------------------------ geometry */
  /** Belt / chain path around circles {x,y,r}, all inside the loop.
   *  ccw=false → path runs clockwise on screen (engine direction). */
  function beltPath(cs, ccw) {
    var n = cs.length, segs = [], i;
    for (i = 0; i < n; i++) {
      var a = cs[i], b = cs[(i + 1) % n];
      var dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy);
      var th = Math.atan2(dy, dx), ph = Math.acos((a.r - b.r) / d);
      var nn = ccw ? th + ph : th - ph;
      segs.push({
        n: nn,
        p1: [a.x + a.r * Math.cos(nn), a.y + a.r * Math.sin(nn)],
        p2: [b.x + b.r * Math.cos(nn), b.y + b.r * Math.sin(nn)],
        len: Math.sqrt(Math.max(0, d * d - (a.r - b.r) * (a.r - b.r)))
      });
    }
    var path = 'M' + f(segs[0].p1[0]) + ',' + f(segs[0].p1[1]), len = 0, arrive = [0];
    for (i = 0; i < n; i++) {
      var sg = segs[i], ci = (i + 1) % n, c = cs[ci], nx = segs[ci];
      path += ' L' + f(sg.p2[0]) + ',' + f(sg.p2[1]);
      len += sg.len;
      if (ci !== 0) arrive[ci] = len;
      var sw = ccw ? sg.n - nx.n : nx.n - sg.n;
      while (sw < 0) sw += 2 * Math.PI;
      while (sw >= 2 * Math.PI) sw -= 2 * Math.PI;
      path += ' A' + c.r + ',' + c.r + ' 0 ' + (sw > Math.PI ? 1 : 0) + ' ' + (ccw ? 0 : 1) + ' ' + f(nx.p1[0]) + ',' + f(nx.p1[1]);
      len += c.r * sw;
    }
    return { d: path + ' Z', len: len, arrive: arrive, segs: segs };
  }

  /* ------------------------------------------------------------ drawing */
  function sprocketSvg(r, mark) {
    var s = '<circle class="k-metal2 s-dark" stroke-width="2" r="' + r + '"/>' +
      '<circle class="k-none s-dark" stroke-width="4" stroke-dasharray="2.5 2.5" r="' + f(r - 3) + '"/>' +
      '<circle class="k-metal" r="' + f(r * 0.6) + '"/>';
    for (var i = 0; i < 3; i++) {
      var a = Math.PI / 6 + i * 2 * Math.PI / 3;
      s += '<circle class="k-dark" cx="' + f(Math.cos(a) * r * 0.36) + '" cy="' + f(Math.sin(a) * r * 0.36) + '" r="' + f(Math.max(2, r * 0.09)) + '"/>';
    }
    s += L.hex(0, 0, Math.max(4, r * 0.15), 'k-dark');
    if (mark !== false) s += '<polygon class="k-danger" points="0,' + f(-r + 4) + ' -5,' + f(-r + 14) + ' 5,' + f(-r + 14) + '"/>';
    return s;
  }
  function pulleySvg(r) {
    return '<circle class="k-metal s-dark" stroke-width="2" r="' + r + '"/>' +
      '<circle class="k-metal2" r="' + f(r * 0.58) + '"/>' +
      '<circle class="k-dark" r="' + f(r * 0.22) + '"/>' +
      '<circle class="k-metal" cx="0" cy="' + f(-r * 0.4) + '" r="' + f(Math.max(1.5, r * 0.1)) + '"/>';
  }
  /** Place a part. spin: false | 'run' (continuous, speed from radius). cls: extra class for inner group. */
  function part(it, crankR, spin, cls) {
    var inner = it.kind === 'pulley' ? pulleySvg(it.r) : sprocketSvg(it.r, it.mark);
    var c = (cls || '') + (spin ? ' timing-spin' : '');
    var st = spin ? ' style="animation-duration:' + (CRANK_T * it.r / crankR).toFixed(2) + 's"' : '';
    return '<g transform="translate(' + it.x + ',' + it.y + ')"><g class="' + c + '"' + st + '>' + inner + '</g></g>';
  }
  function belt(d, moving, extraCls, extraAttr) {
    return '<g class="' + (extraCls || '') + '"><path class="k-none s-belt" stroke-width="9" stroke-linejoin="round" d="' + d + '"' + (extraAttr || '') + '/>' +
      (moving ? '<path class="k-none s-muted timing-teeth" stroke-width="3" stroke-dasharray="4 5" d="' + d + '"/>' :
        '<path class="k-none s-muted" stroke-width="3" stroke-dasharray="4 5" d="' + d + '"/>') + '</g>';
  }
  function block() {
    return '<rect class="k-line" x="96" y="10" width="352" height="284" rx="26" opacity=".22"/>';
  }

  var T = {
    crank: { cs: 'Klikový hřídel', en: 'Crankshaft' },
    cam: { cs: 'Vačkový hřídel', en: 'Camshaft' },
    camIn: { cs: 'Vačka sání', en: 'Intake cam' },
    camEx: { cs: 'Vačka výfuk', en: 'Exhaust cam' },
    pump: { cs: 'Vodní pumpa', en: 'Water pump' },
    tens: { cs: 'Napínák', en: 'Tensioner' },
    idler: { cs: 'Vodicí kladka', en: 'Idler' },
    hp: { cs: 'VT čerpadlo', en: 'HP pump' }
  };

  /** Pulley layout, listed in CLOCKWISE belt order starting at the crankshaft. */
  function layout(v) {
    if (v === 'skoda-octavia-rs-tdi') {
      return [
        { id: 'crank', x: 220, y: 248, r: 20, kind: 'sprocket', label: T.crank, lx: 220, ly: 288 },
        { id: 'tens', x: 150, y: 198, r: 14, kind: 'pulley', label: T.tens, lx: 128, ly: 228, anchor: 'end' },
        { id: 'pump', x: 142, y: 114, r: 22, kind: 'sprocket', mark: false, label: T.pump, lx: 112, ly: 114, anchor: 'end' },
        { id: 'cam', x: 290, y: 68, r: 40, kind: 'sprocket', label: T.cam, lx: 290, ly: 16 },
        { id: 'hp', x: 395, y: 150, r: 26, kind: 'sprocket', label: T.hp, lx: 410, ly: 194 },
        { id: 'idler', x: 335, y: 228, r: 12, kind: 'pulley', label: T.idler, lx: 356, ly: 256, anchor: 'start' }
      ];
    }
    if (v === 'volvo-xc60-b4') {
      return [
        { id: 'crank', x: 225, y: 248, r: 19, kind: 'sprocket', label: T.crank, lx: 225, ly: 288 },
        { id: 'tens', x: 150, y: 205, r: 14, kind: 'pulley', label: T.tens, lx: 128, ly: 232, anchor: 'end' },
        { id: 'pump', x: 140, y: 128, r: 22, kind: 'sprocket', mark: false, label: T.pump, lx: 110, ly: 128, anchor: 'end' },
        { id: 'camIn', x: 245, y: 66, r: 38, kind: 'sprocket', label: T.camIn, lx: 245, ly: 16 },
        { id: 'camEx', x: 355, y: 66, r: 38, kind: 'sprocket', label: T.camEx, lx: 370, ly: 122 },
        { id: 'idler', x: 350, y: 212, r: 12, kind: 'pulley', label: T.idler, lx: 370, ly: 240, anchor: 'start' }
      ];
    }
    return [
      { id: 'crank', x: 220, y: 246, r: 20, kind: 'sprocket', label: T.crank, lx: 220, ly: 288 },
      { id: 'tens', x: 148, y: 196, r: 14, kind: 'pulley', label: T.tens, lx: 126, ly: 226, anchor: 'end' },
      { id: 'pump', x: 145, y: 112, r: 22, kind: 'sprocket', mark: false, label: T.pump, lx: 115, ly: 112, anchor: 'end' },
      { id: 'cam', x: 305, y: 70, r: 40, kind: 'sprocket', label: T.cam, lx: 305, ly: 16 },
      { id: 'idler', x: 335, y: 222, r: 12, kind: 'pulley', label: T.idler, lx: 356, ly: 250, anchor: 'start' }
    ];
  }
  function labels(ctx, lay) {
    return lay.map(function (it) { return lbl(it.lx, it.ly, ctx.t(it.label), it.anchor); }).join('');
  }
  function installOrder(lay) {
    var o = [lay[0]];
    for (var i = lay.length - 1; i > 0; i--) o.push(lay[i]);
    return o;
  }
  function isCam(it) { return it.id.indexOf('cam') === 0 || it.id === 'hp'; }

  /* ------------------------------------------------------------ overview */
  A.register('timing.overview', {
    render: function (ctx) {
      if (CHAIN[ctx.vehicle]) return chainSvg(ctx);
      var lay = layout(ctx.vehicle), bp = beltPath(lay, false);
      var s = block() + belt(bp.d, true) + lay.map(function (it) { return part(it, lay[0].r, true); }).join('') +
        labels(ctx, lay) +
        L.rotArrow(30, 40, 13, 'cw', 'accent', 270) +
        L.label(52, 44, ctx.t({ cs: 'Směr chodu motoru', en: 'Engine rotation' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 72, ctx.t({ cs: 'Schéma – skutečné vedení dle příručky', en: 'Schematic – real routing per manual' }), { anchor: 'start', bg: true, size: 10, cls: 'k-muted' });
      return L.svg(s, ctx.t({ cs: 'Schéma rozvodového řemene', en: 'Timing belt layout' }));
    }
  });

  /* ------------------------------------------------------------ interference */
  A.register('timing.interference', {
    render: function (ctx) {
      var X = 90; // shift scene right, text on the left
      var s = '<g transform="translate(' + X + ',0)">' +
        // cylinder
        '<rect class="k-dark" x="182" y="82" width="116" height="190" opacity=".25"/>' +
        '<rect class="k-metal2 s-dark" stroke-width="1.5" x="170" y="82" width="12" height="190"/>' +
        '<rect class="k-metal2 s-dark" stroke-width="1.5" x="298" y="82" width="12" height="190"/>' +
        // piston (drawn at TDC)
        '<g class="timing-pis"><rect class="k-metal2" x="231" y="148" width="18" height="160"/>' +
        '<rect class="k-metal s-dark" stroke-width="1.5" x="184" y="110" width="112" height="56" rx="4"/>' +
        '<line class="s-dark" stroke-width="2" x1="184" y1="120" x2="296" y2="120"/><line class="s-dark" stroke-width="2" x1="184" y1="128" x2="296" y2="128"/>' +
        '<circle class="k-dark" cx="240" cy="148" r="8"/></g>' +
        // head
        '<rect class="k-metal2 s-dark" stroke-width="1.5" x="150" y="40" width="180" height="42"/>' +
        '<rect class="k-dark" x="186" y="40" width="48" height="42" opacity=".5"/>' +
        // valve
        '<g class="timing-val"><rect class="k-metal s-dark" stroke-width="1" x="206" y="6" width="8" height="70"/>' +
        '<path class="k-metal s-dark" stroke-width="1.5" d="M186,82 L234,82 L216,74 L204,74 Z"/>' +
        '<polyline class="k-none s-warn" stroke-width="2.5" points="200,22 220,27 200,32 220,37 200,42 220,47 200,52"/></g>' +
        // exhaust valve (closed, static)
        '<rect class="k-metal s-dark" stroke-width="1" x="266" y="6" width="8" height="70"/>' +
        '<path class="k-metal s-dark" stroke-width="1.5" d="M246,82 L294,82 L276,74 L264,74 Z"/>' +
        // flash
        '<g class="timing-flash"><polygon class="k-warn s-danger" stroke-width="2" points="210,96 218,110 234,106 224,118 236,130 218,126 210,142 204,126 186,130 198,118 186,106 202,110"/></g>' +
        '</g>';
      s += L.label(X + 250, 286, ctx.t({ cs: 'Píst', en: 'Piston' }), { bg: true, size: 12 });
      s += L.label(X + 226, 16, ctx.t({ cs: 'Ventil', en: 'Valve' }), { anchor: 'start', bg: true, size: 12 });
      var lines = function (arr, cls, y0) {
        return arr.map(function (t, i) { return L.label(14, y0 + i * 26, ctx.t(t), { anchor: 'start', bg: true, size: 13, cls: cls }); }).join('');
      };
      s += '<g class="timing-ph1">' + L.check(28, 100) + lines([{ cs: 'Řemen v pořádku:', en: 'Belt intact:' }, { cs: 'ventil a píst', en: 'valve and piston' }, { cs: 'se nikdy nepotkají', en: 'never meet' }], 'k-text', 136) + '</g>';
      s += '<g class="timing-ph2">' + L.cross(28, 100) + lines([{ cs: 'Řemen praskl!', en: 'Belt snapped!' }, { cs: 'Ventil zůstal otevřený', en: 'Valve stays open' }, { cs: '→ píst do něj narazí', en: '→ piston hits it' }], 'k-danger', 136) + '</g>';
      s += '<g class="timing-ph3">' + lines([{ cs: 'Ohnuté ventily =', en: 'Bent valves =' }, { cs: 'drahá oprava motoru', en: 'costly engine repair' }], 'k-text', 230) + '</g>';
      return L.svg(s, ctx.t({ cs: 'Proč na rozvodech záleží: srážka ventilu s pístem', en: 'Why timing matters: valve hits piston' }));
    }
  });

  /* ------------------------------------------------------------ TDC */
  A.register('timing.tdc', {
    render: function (ctx) {
      var s = '<rect class="k-line" x="40" y="60" width="420" height="230" rx="24" opacity=".2"/>' +
        '<g transform="translate(160,180)"><g class="timing-tdcc">' + sprocketSvg(82) + '</g></g>' +
        '<g transform="translate(380,118)"><g class="timing-tdcm">' + sprocketSvg(56) + '</g></g>' +
        '<polygon class="k-accent s-dark" stroke-width="1" points="160,96 150,80 170,80"/>' +
        '<polygon class="k-accent s-dark" stroke-width="1" points="380,60 370,44 390,44"/>' +
        L.rotArrow(160, 180, 100, 'cw', 'accent', 100) +
        L.label(16, 22, ctx.t({ cs: 'Klikou otáčet jen PO směru hod. ručiček', en: 'Turn crank CLOCKWISE only (engine direction)' }), { anchor: 'start', bg: true, size: 13 }) +
        L.label(380, 196, ctx.t({ cs: 'Značka vačky', en: 'Cam mark' }), { bg: true, size: 12 }) +
        L.label(160, 284, ctx.t({ cs: 'Značka kliky', en: 'Crank mark' }), { bg: true, size: 12 }) +
        '<g class="timing-ok6">' + L.check(300, 250) + L.badge(390, 252, ctx.t({ cs: 'OT válce 1', en: 'TDC cyl. 1' }), 'ok') + '</g>';
      return L.svg(s, ctx.t({ cs: 'Natočení motoru do horní úvrati', en: 'Turning the engine to top dead centre' }));
    }
  });

  /* ------------------------------------------------------------ lock */
  A.register('timing.lock', {
    render: function (ctx) {
      var v = ctx.vehicle;
      var camTxt = v === 'volvo-xc60-b4' ? { cs: 'Přípravek na obě vačky', en: 'Tool locks both cams' }
        : v === 'skoda-octavia-rs-tdi' ? { cs: 'Kolík vačky (+ VT čerpadla)', en: 'Cam pin (+ HP pump pin)' }
          : { cs: 'Aretace vačky', en: 'Cam locking pin' };
      var s = '<rect class="k-line" x="40" y="40" width="420" height="250" rx="24" opacity=".2"/>' +
        '<g transform="translate(150,130)">' + sprocketSvg(70) + '<circle class="k-dark" cx="0" cy="-36" r="8"/></g>' +
        '<g transform="translate(150,94)"><g class="timing-pin"><circle class="k-accent s-dark" stroke-width="1.5" r="9"/><circle class="k-none s-dark" stroke-width="3" r="15"/></g></g>' +
        '<g transform="translate(350,190)">' + sprocketSvg(36) + '<rect class="k-dark" x="-6" y="24" width="12" height="14"/></g>' +
        '<g class="timing-tool"><rect class="k-accent s-dark" stroke-width="1.5" x="318" y="238" width="64" height="16" rx="3"/>' +
        '<rect class="k-accent s-dark" stroke-width="1.5" x="345" y="216" width="10" height="24"/></g>' +
        '<g class="timing-okl">' + L.check(240, 80) + L.check(420, 180) + '</g>' +
        L.label(150, 226, ctx.t(camTxt), { bg: true, size: 12 }) +
        L.label(350, 278, ctx.t({ cs: 'Aretace kliky', en: 'Crank locking tool' }), { bg: true, size: 12 }) +
        L.warnIcon(28, 22) + L.label(50, 26, ctx.t({ cs: 'Zajistit nářadím – ne jen značky barvou!', en: 'Lock with tools – not just paint marks!' }), { anchor: 'start', bg: true, size: 13 });
      return L.svg(s, ctx.t({ cs: 'Zajištění vačky a kliky aretací', en: 'Locking camshaft and crankshaft' }));
    }
  });

  /* ------------------------------------------------------------ release / remove */
  A.register('timing.release', {
    render: function (ctx) {
      var lay = layout(ctx.vehicle), bp = beltPath(lay, false), cr = lay[0].r;
      var s = block() + belt(bp.d, false, 'timing-relb');
      lay.forEach(function (it) {
        s += it.id === 'tens' ? '<g class="timing-relt">' + part(it, cr, false) + '</g>' : part(it, cr, false);
        if (it.id === 'crank' || isCam(it)) s += '<circle class="k-accent s-dark" stroke-width="1.5" cx="' + it.x + '" cy="' + (it.y - it.r * 0.4) + '" r="5"/>';
      });
      s += '<g class="timing-relb">' + L.arrow(196, 70, 236, 58, 'warn', 3) + '</g>' +
        labels(ctx, lay.filter(function (it) { return it.id === 'tens'; })) +
        L.label(16, 24, ctx.t({ cs: '1. Šipkou označit směr', en: '1. Mark running direction' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 48, ctx.t({ cs: '2. Povolit napínák', en: '2. Release tensioner' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 72, ctx.t({ cs: '3. Sundat řemen', en: '3. Remove belt' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(470, 290, ctx.t({ cs: 'Aretace zůstávají!', en: 'Locks stay in!' }), { anchor: 'end', bg: true, size: 12, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Povolení napínáku a sundání řemene', en: 'Releasing tensioner and removing belt' }));
    }
  });

  /* ------------------------------------------------------------ replace parts */
  A.register('timing.replace', {
    render: function (ctx) {
      var lay = layout(ctx.vehicle), cr = lay[0].r;
      var s = block();
      lay.forEach(function (it) {
        var isNew = it.id === 'tens' || it.id === 'idler' || it.id === 'pump';
        if (isNew) s += '<circle class="k-ok lib-pulse" cx="' + it.x + '" cy="' + it.y + '" r="' + (it.r + 10) + '"/>';
        s += part(it, cr, false);
        if (isNew) s += L.badge(it.x, it.y - it.r - 16, ctx.t({ cs: 'NOVÉ', en: 'NEW' }), 'ok');
      });
      s += L.label(470, 290, ctx.t({ cs: 'Vždy celá sada + vodní pumpa', en: 'Always the full kit + water pump' }), { anchor: 'end', bg: true, size: 12 }) +
        L.label(16, 24, ctx.t({ cs: 'Vyměnit:', en: 'Replace:' }), { anchor: 'start', bg: true, size: 13 }) +
        L.label(16, 48, ctx.t({ cs: 'napínák, kladky, pumpu', en: 'tensioner, idlers, pump' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Výměna napínáku, kladek a vodní pumpy', en: 'Replacing tensioner, idlers and water pump' }));
    }
  });

  /* ------------------------------------------------------------ belt on (install order) */
  A.register('timing.beltOn', {
    render: function (ctx) {
      var lay = layout(ctx.vehicle), cr = lay[0].r;
      var ord = installOrder(lay), bp = beltPath(ord, true);
      var k = 'tbo' + ctx.uid;
      var css = '.' + k + '{stroke-dasharray:100;animation:' + k + ' 10s ease-in-out infinite}' +
        '@keyframes ' + k + '{0%,5%{stroke-dashoffset:100;opacity:1}75%,96%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}';
      var nums = '';
      ord.forEach(function (it, i) {
        var at = 5 + 70 * (bp.arrive[i] / bp.len);
        if (i === 0) at = 3;
        css += '.' + k + 'n' + i + '{opacity:0;animation:' + k + 'n' + i + ' 10s linear infinite}' +
          '@keyframes ' + k + 'n' + i + '{0%,' + at.toFixed(1) + '%{opacity:0}' + (at + 2).toFixed(1) + '%,96%{opacity:1}100%{opacity:0}}';
        nums += '<g class="' + k + 'n' + i + '"><circle class="k-accent s-dark" stroke-width="1.5" cx="' + it.x + '" cy="' + it.y + '" r="12"/>' +
          '<text x="' + it.x + '" y="' + (it.y + 5) + '" text-anchor="middle" font-size="14" font-weight="800" class="k-badgetext">' + (i + 1) + '</text></g>';
      });
      var s = '<style>' + css + '</style>' + block() +
        lay.map(function (it) { return part(it, cr, false); }).join('') +
        '<path class="k-none s-belt ' + k + '" pathLength="100" stroke-width="9" stroke-linejoin="round" d="' + bp.d + '"/>' + nums +
        L.label(16, 24, ctx.t({ cs: 'Nasazovat v pořadí 1 → ' + ord.length, en: 'Fit in order 1 → ' + ord.length }), { anchor: 'start', bg: true, size: 13 }) +
        L.label(16, 50, ctx.t({ cs: 'Tažná strana napnutá,', en: 'Tight side taut,' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 72, ctx.t({ cs: 'vůle jen u napínáku', en: 'slack only at tensioner' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Pořadí nasazení nového řemene', en: 'Order of fitting the new belt' }));
    }
  });

  /* ------------------------------------------------------------ tensioner */
  A.register('timing.tensioner', {
    render: function (ctx) {
      var s = '<rect class="k-line" x="60" y="20" width="220" height="270" rx="20" opacity=".2"/>' +
        '<line class="s-belt" stroke-width="10" x1="281" y1="10" x2="281" y2="292"/>' +
        '<line class="s-muted" stroke-width="3" stroke-dasharray="4 5" x1="281" y1="10" x2="281" y2="292"/>' +
        '<g transform="translate(200,160)"><g class="timing-ecc">' +
        '<circle class="k-none" r="100"/>' +
        '<g transform="translate(16,0)">' + pulleySvg(58) + '</g>' +
        '<circle class="k-metal2 s-dark" stroke-width="1.5" r="22"/>' + L.hex(0, 0, 9, 'k-dark') +
        '<line class="s-dark" stroke-width="7" stroke-linecap="round" x1="0" y1="0" x2="-62" y2="58"/>' +
        '<line class="s-danger" stroke-width="4" x1="0" y1="-22" x2="0" y2="-88"/>' +
        '<polygon class="k-danger" points="0,-98 -6,-86 6,-86"/></g></g>' +
        '<line class="s-ok" stroke-width="3" x1="190" y1="50" x2="190" y2="74"/><line class="s-ok" stroke-width="3" x1="210" y1="50" x2="210" y2="74"/>' +
        L.label(200, 36, ctx.t({ cs: 'Okénko', en: 'Window' }), { bg: true, size: 12 }) +
        L.rotArrow(200, 160, 74, 'ccw', 'accent', 60) +
        '<g class="timing-okt">' + L.check(250, 62) + '</g>';
      [{ cs: '1. Excentr otočte klíčem', en: '1. Turn eccentric with key' },
        { cs: '2. Ukazatel do okénka', en: '2. Pointer into window' },
        { cs: '3. Matici utáhněte', en: '3. Tighten the nut' },
        { cs: '   momentem (+ úhel)', en: '   to torque (+ angle)' }].forEach(function (t, i) {
        s += L.label(298, 120 + i * 26, ctx.t(t), { anchor: 'start', bg: true, size: 12 });
      });
      return L.svg(s, ctx.t({ cs: 'Nastavení napínáku', en: 'Setting the tensioner' }));
    }
  });

  /* ------------------------------------------------------------ rotate 2 turns */
  A.register('timing.rotate2', {
    render: function (ctx) {
      var cs = [{ x: 150, y: 200, r: 34 }, { x: 340, y: 112, r: 68 }];
      var bp = beltPath(cs, false);
      var s = '<rect class="k-line" x="60" y="20" width="400" height="270" rx="24" opacity=".2"/>' +
        '<path class="k-none s-belt" stroke-width="9" d="' + bp.d + '"/>' +
        '<path class="k-none s-muted timing-r2b" stroke-width="3" stroke-dasharray="4.9 4" d="' + bp.d + '"/>' +
        '<g transform="translate(150,200)"><g class="timing-r2c">' + sprocketSvg(34) + '</g></g>' +
        '<g transform="translate(340,112)"><g class="timing-r2m">' + sprocketSvg(68) + '</g></g>' +
        '<polygon class="k-accent s-dark" stroke-width="1" points="150,164 142,150 158,150"/>' +
        '<polygon class="k-accent s-dark" stroke-width="1" points="340,42 332,28 348,28"/>' +
        L.label(16, 22, ctx.t({ cs: 'Aretace pryč → 2 otáčky klikou ručně', en: 'Locks out → turn crank 2 turns by hand' }), { anchor: 'start', bg: true, size: 13 }) +
        L.label(16, 48, ctx.t({ cs: 'Ztuha? Okamžitě STOP!', en: 'Any resistance? STOP at once!' }), { anchor: 'start', bg: true, size: 13, cls: 'k-danger' }) +
        L.label(340, 204, ctx.t({ cs: 'Vačka: 1 otáčka', en: 'Cam: 1 turn' }), { bg: true, size: 12 }) +
        '<g class="timing-c1">' + L.badge(150, 262, ctx.t({ cs: 'Klika: 1 otáčka', en: 'Crank: 1 turn' }), 'accent') + '</g>' +
        '<g class="timing-c2">' + L.badge(150, 262, ctx.t({ cs: 'Klika: 2 otáčky', en: 'Crank: 2 turns' }), 'ok') +
        L.check(300, 262) + L.label(322, 266, ctx.t({ cs: 'Značky opět souhlasí', en: 'Marks align again' }), { anchor: 'start', bg: true, size: 12 }) + '</g>';
      return L.svg(s, ctx.t({ cs: 'Kontrolní protočení motoru o 2 otáčky', en: 'Check rotation: 2 crank revolutions' }));
    }
  });

  /* ------------------------------------------------------------ coolant refill / bleed */
  A.register('timing.coolant', {
    render: function (ctx) {
      var s = '<rect class="k-metal" x="280" y="70" width="120" height="110" rx="12" opacity=".35"/>' +
        '<g class="timing-lvl"><rect class="k-fluid" x="283" y="100" width="114" height="77" rx="8" opacity=".85"/></g>' +
        '<rect class="k-none s-dark" stroke-width="2" x="280" y="70" width="120" height="110" rx="12"/>' +
        '<rect class="k-dark" x="328" y="56" width="24" height="16" rx="3"/>' +
        '<line class="s-dark" stroke-width="2" stroke-dasharray="6 4" x1="284" y1="100" x2="396" y2="100"/>' +
        '<line class="s-dark" stroke-width="2" stroke-dasharray="6 4" x1="284" y1="145" x2="396" y2="145"/>' +
        L.label(408, 104, 'MAX', { anchor: 'start', size: 11 }) + L.label(408, 149, 'MIN', { anchor: 'start', size: 11 }) +
        '<g transform="translate(300,10) rotate(35)"><rect class="k-ok s-dark" stroke-width="1.5" x="0" y="0" width="34" height="52" rx="6"/><rect class="k-dark" x="30" y="40" width="16" height="9" rx="2"/></g>' +
        L.drops(340, 62, 4, 40, 'k-fluid') +
        // hose + bleed screw
        '<rect class="k-dark" x="30" y="226" width="230" height="18" rx="9"/>' +
        '<rect class="k-metal2 s-dark" stroke-width="1" x="132" y="210" width="16" height="16"/>' + L.hex(140, 206, 7, 'k-metal') +
        '<g class="timing-q1">';
      for (var i = 0; i < 4; i++) s += '<circle class="k-none s-fluid timing-bub" stroke-width="2" cx="' + (136 + (i % 2) * 8) + '" cy="196" r="' + (3 + i % 2) + '" style="animation-delay:' + (i * 0.4) + 's"/>';
      s += L.label(140, 140, ctx.t({ cs: 'Vzduch uniká…', en: 'Air escaping…' }), { bg: true, size: 12 }) + '</g>' +
        '<g class="timing-q2">' + L.drops(146, 198, 3, 22, 'k-fluid') + L.check(140, 150) +
        L.label(140, 118, ctx.t({ cs: 'Bez bublin → zavřít', en: 'No bubbles → close' }), { bg: true, size: 12 }) + '</g>' +
        L.label(140, 272, ctx.t({ cs: 'Odvzdušňovací šroub', en: 'Bleed screw' }), { bg: true, size: 12 }) +
        L.label(340, 206, ctx.t({ cs: 'Hladina mezi MIN–MAX', en: 'Level between MIN–MAX' }), { bg: true, size: 12 }) +
        L.warnIcon(28, 22) + L.label(50, 26, ctx.t({ cs: 'Víčko otevírat jen za studena!', en: 'Open cap only when cold!' }), { anchor: 'start', bg: true, size: 13 });
      return L.svg(s, ctx.t({ cs: 'Doplnění a odvzdušnění chladicí soustavy', en: 'Refilling and bleeding the cooling system' }));
    }
  });

  /* ------------------------------------------------------------ coolant drain */
  A.register('timing.drain', {
    render: function (ctx) {
      var s = '<rect class="k-metal2 s-dark" stroke-width="2" x="120" y="40" width="230" height="150" rx="6"/>' +
        '<g class="timing-rad"><rect class="k-fluid" x="124" y="44" width="222" height="142" opacity=".35"/></g>';
      for (var x = 136; x < 340; x += 12) s += '<line class="s-dark" stroke-width="1" opacity=".5" x1="' + x + '" y1="44" x2="' + x + '" y2="186"/>';
      s += '<rect class="k-dark" x="316" y="188" width="14" height="12" rx="2"/>' + L.hex(323, 204, 6, 'k-metal') +
        L.drops(323, 212, 5, 36, 'k-fluid') +
        '<path class="k-metal2 s-dark" stroke-width="2" d="M260,250 L386,250 L376,276 L270,276 Z"/>' +
        '<g class="timing-tray"><rect class="k-fluid" x="272" y="256" width="102" height="18" opacity=".85"/></g>' +
        L.label(360, 210, ctx.t({ cs: 'Vypouštěcí šroub', en: 'Drain plug' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 22, ctx.t({ cs: 'Jen studený motor, víčko nádržky povolit', en: 'Cold engine only, loosen expansion cap' }), { anchor: 'start', bg: true, size: 13 }) +
        L.warnIcon(28, 236) + L.label(50, 240, ctx.t({ cs: 'Jedovatá!', en: 'Toxic!' }), { anchor: 'start', bg: true, size: 13, cls: 'k-danger' }) +
        L.label(16, 266, ctx.t({ cs: 'Sladká chuť láká zvířata', en: 'Sweet taste attracts pets' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Vypuštění chladicí kapaliny', en: 'Draining the coolant' }));
    }
  });

  /* ------------------------------------------------------------ engine support */
  A.register('timing.support', {
    render: function (ctx) {
      var s = '<rect class="k-body" x="10" y="112" width="80" height="18" rx="4"/><rect class="k-body" x="390" y="112" width="80" height="18" rx="4"/>' +
        '<rect class="k-dark" x="36" y="40" width="408" height="14" rx="4"/>' +
        '<rect class="k-dark" x="44" y="54" width="14" height="58"/><rect class="k-dark" x="422" y="54" width="14" height="58"/>' +
        '<line class="s-metal" stroke-width="5" x1="230" y1="54" x2="230" y2="126"/>' +
        '<rect class="k-metal2 s-dark" stroke-width="1" x="218" y="56" width="24" height="10" rx="2"/>' +
        '<circle class="k-none s-metal" stroke-width="5" cx="230" cy="132" r="8"/>' +
        '<rect class="k-metal2 s-dark" stroke-width="2" x="130" y="140" width="200" height="120" rx="12"/>' +
        '<rect class="k-metal s-dark" stroke-width="1" x="150" y="152" width="160" height="26" rx="6"/>' +
        '<circle class="k-dark" cx="170" cy="220" r="14"/><circle class="k-dark" cx="230" cy="220" r="14"/><circle class="k-dark" cx="290" cy="220" r="14"/>' +
        '<rect class="k-body" x="380" y="170" width="100" height="26" rx="4"/>' +
        '<g class="timing-mount"><rect class="k-dark s-dark" stroke-width="1" x="330" y="166" width="52" height="34" rx="6"/>' +
        '<circle class="k-metal" cx="344" cy="183" r="5"/><circle class="k-metal" cx="368" cy="183" r="5"/></g>' +
        '<g class="timing-oks">' + L.check(270, 104) + '</g>' +
        L.label(240, 24, ctx.t({ cs: 'Podpěra motoru (traverza) přes blatníky', en: 'Engine support bar across the wings' }), { bg: true, size: 13 }) +
        L.label(356, 222, ctx.t({ cs: 'Držák motoru', en: 'Engine mount' }), { bg: true, size: 12 }) +
        L.label(230, 284, ctx.t({ cs: 'Nejdřív podepřít, pak povolit držák', en: 'Support first, then remove the mount' }), { bg: true, size: 12, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Podepření motoru a demontáž držáku', en: 'Supporting the engine and removing the mount' }));
    }
  });

  /* ------------------------------------------------------------ timing chain */
  function chainSvg(ctx) {
    var cs = [{ x: 240, y: 248, r: 16 }, { x: 160, y: 74, r: 32 }, { x: 320, y: 74, r: 32 }];
    var bp = beltPath(cs, false);
    var s0 = bp.segs[0], s2 = bp.segs[2];
    var off = function (sg, d, t0, t1) {
      var nx = Math.cos(sg.n) * d, ny = Math.sin(sg.n) * d;
      var ax = sg.p1[0] + (sg.p2[0] - sg.p1[0]) * t0 + nx, ay = sg.p1[1] + (sg.p2[1] - sg.p1[1]) * t0 + ny;
      var bx = sg.p1[0] + (sg.p2[0] - sg.p1[0]) * t1 + nx, by = sg.p1[1] + (sg.p2[1] - sg.p1[1]) * t1 + ny;
      return [ax, ay, bx, by];
    };
    var rail = off(s2, 11, 0.15, 0.85);   // guide rail (tight side, right)
    var trl = off(s0, 11, 0.2, 0.8);      // tensioner rail (slack side, left)
    var mx = (s0.p1[0] + s0.p2[0]) / 2, my = (s0.p1[1] + s0.p2[1]) / 2;
    var hx = mx + Math.cos(s0.n) * 34, hy = my + Math.sin(s0.n) * 34, ang = s0.n * 180 / Math.PI;
    var codes = ctx.vehicle === 'mb-cl500-c216' ? 'P0016–P0019' : 'P0016 / P0017';
    var s = '<rect class="k-line" x="96" y="14" width="300" height="276" rx="26" opacity=".2"/>' +
      '<g class="timing-rattle"><path class="k-none s-dark" stroke-width="11" stroke-linejoin="round" d="' + bp.d + '"/>' +
      '<path class="k-none s-metal" stroke-width="5" stroke-dasharray="6 3" d="' + bp.d + '"/></g>' +
      '<line class="s-line" stroke-width="8" stroke-linecap="round" x1="' + f(rail[0]) + '" y1="' + f(rail[1]) + '" x2="' + f(rail[2]) + '" y2="' + f(rail[3]) + '"/>' +
      '<g class="timing-rail"><line class="s-warn" stroke-width="8" stroke-linecap="round" x1="' + f(trl[0]) + '" y1="' + f(trl[1]) + '" x2="' + f(trl[2]) + '" y2="' + f(trl[3]) + '"/></g>' +
      '<g transform="translate(' + f(hx) + ',' + f(hy) + ') rotate(' + f(ang) + ')">' +
      '<g class="timing-plg"><rect class="k-metal s-dark" stroke-width="1" x="-22" y="-5" width="26" height="10" rx="2"/></g>' +
      '<rect class="k-dark" x="0" y="-10" width="30" height="20" rx="3"/></g>' +
      '<g transform="translate(240,248)">' + sprocketSvg(16) + '</g>' +
      '<g transform="translate(160,74)"><g class="timing-late">' + sprocketSvg(32) + '</g></g>' +
      '<g transform="translate(320,74)"><g class="timing-late">' + sprocketSvg(32) + '</g></g>' +
      '<polygon class="k-accent s-dark" stroke-width="1" points="160,40 153,28 167,28"/>' +
      '<polygon class="k-accent s-dark" stroke-width="1" points="320,40 313,28 327,28"/>' +
      L.label(406, 170, ctx.t({ cs: 'Vodicí lišta', en: 'Guide rail' }), { anchor: 'start', bg: true, size: 12 }) +
      L.label(70, 222, ctx.t({ cs: 'Napínák', en: 'Tensioner' }), { bg: true, size: 12 }) +
      L.label(470, 288, ctx.t({ cs: 'Schéma', en: 'Schematic' }), { anchor: 'end', size: 10, cls: 'k-muted' }) +
      '<g class="timing-chq1">' + L.label(14, 16, ctx.t({ cs: 'Zdravý řetěz: napínák má rezervu, značky sedí', en: 'Healthy chain: tensioner has reserve, marks align' }), { anchor: 'start', bg: true, size: 12 }) + '</g>' +
      '<g class="timing-chq2">' + L.label(14, 16, ctx.t({ cs: 'Natažený řetěz: napínák na dorazu, vačky se zpožďují', en: 'Stretched chain: tensioner maxed, cams run late' }), { anchor: 'start', bg: true, size: 12, cls: 'k-danger' }) +
      L.label(470, 120, ctx.t({ cs: 'chrastění při startu', en: 'rattle on start-up' }), { anchor: 'end', bg: true, size: 12 }) +
      L.label(470, 144, ctx.t({ cs: 'chyby ', en: 'codes ' }) + codes, { anchor: 'end', bg: true, size: 12, cls: 'k-danger' }) + '</g>';
    return L.svg(s, ctx.t({ cs: 'Rozvodový řetěz: zdravý vs. natažený', en: 'Timing chain: healthy vs. stretched' }));
  }
  A.register('timing.chain', { render: chainSvg });

  /* ------------------------------------------------------------ diagnostics */
  A.register('timing.diag', {
    render: function (ctx) {
      var tool = ctx.vehicle === 'mb-cl500-c216' ? 'XENTRY / DAS' : ctx.vehicle === 'toyota-gr-yaris' ? 'Techstream / OBD' : ctx.vehicle === 'volvo-xc60-b4' ? 'VIDA' : ctx.vehicle === 'skoda-octavia-rs-tdi' ? 'VCDS / ODIS' : 'OBD';
      var s = '<rect class="k-dark" x="110" y="34" width="250" height="250" rx="22"/>' +
        '<rect class="k-ground s-line" stroke-width="2" x="128" y="52" width="214" height="160" rx="8"/>' +
        L.label(235, 74, ctx.t({ cs: 'Vačka vs. klika (°)', en: 'Cam vs. crank (°)' }), { size: 12 }) +
        '<rect class="k-danger" x="150" y="118" width="32" height="16"/><rect class="k-warn" x="182" y="118" width="26" height="16"/>' +
        '<rect class="k-ok" x="208" y="118" width="54" height="16"/><rect class="k-warn" x="262" y="118" width="26" height="16"/>' +
        '<rect class="k-danger" x="288" y="118" width="32" height="16"/>' +
        '<g class="timing-needle"><polygon class="k-text" points="235,112 229,100 241,100"/><line class="s-text" stroke-width="3" x1="235" y1="110" x2="235" y2="140"/></g>' +
        '<g class="timing-q1">' + L.label(235, 170, ctx.t({ cs: 'V toleranci – OK', en: 'Within limits – OK' }), { size: 13, cls: 'k-ok' }) + '</g>' +
        '<g class="timing-q2">' + L.label(235, 170, ctx.t({ cs: 'Mimo toleranci → servis', en: 'Out of limits → workshop' }), { size: 13, cls: 'k-danger' }) + '</g>' +
        '<circle class="k-metal2" cx="190" cy="248" r="14"/><circle class="k-metal2" cx="235" cy="248" r="14"/><circle class="k-metal2" cx="280" cy="248" r="14"/>' +
        L.label(372, 60, tool, { anchor: 'start', bg: true, size: 13 }) +
        L.label(372, 88, ctx.t({ cs: 'skutečné hodnoty', en: 'live data' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(372, 112, ctx.t({ cs: 'limity dle příručky', en: 'limits per manual' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 18, ctx.t({ cs: 'Diagnostika natažení řetězu', en: 'Diagnosing chain stretch' }), { anchor: 'start', bg: true, size: 13 });
      return L.svg(s, ctx.t({ cs: 'Diagnostika polohy vačkových hřídelů', en: 'Camshaft position diagnostics' }));
    }
  });
})(window.STU);
