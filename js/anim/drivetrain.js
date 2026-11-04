/* Animations: gearbox, transfer case & differential oils. */
(function (S) {
  'use strict';
  var L = S.animLib, A = S.anim;

  A.css('drive', [
    /* fill-first sequence 8 s */
    '.drive-w1{animation:drive-w1 8s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes drive-w1{0%,6%{transform:rotate(0);opacity:1}20%{transform:rotate(-60deg)}26%{transform:rotate(0)}38%{transform:rotate(-60deg);opacity:1}44%,100%{opacity:0}}',
    '.drive-w2{animation:drive-w2 8s ease-in-out infinite;transform-origin:0 0;opacity:0}',
    '@keyframes drive-w2{0%,48%{opacity:0;transform:rotate(0)}52%{opacity:1;transform:rotate(0)}64%{transform:rotate(-60deg)}70%{transform:rotate(0)}82%,92%{transform:rotate(-60deg);opacity:1}100%{opacity:0}}',
    '.drive-c1{opacity:0;animation:drive-c1 8s linear infinite}@keyframes drive-c1{0%,40%{opacity:0}44%,96%{opacity:1}100%{opacity:0}}',
    '.drive-c2{opacity:0;animation:drive-c2 8s linear infinite}@keyframes drive-c2{0%,86%{opacity:0}90%,96%{opacity:1}100%{opacity:0}}',
    /* drain 8 s */
    '.drive-lvl{animation:drive-lvl 8s linear infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes drive-lvl{0%,15%{transform:scaleY(1)}85%,96%{transform:scaleY(.05)}100%{transform:scaleY(1)}}',
    '.drive-pan{animation:drive-pan 8s linear infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes drive-pan{0%,18%{transform:scaleY(.05)}88%,96%{transform:scaleY(1)}100%{transform:scaleY(.05)}}',
    '.drive-stream{stroke-dasharray:10 8;animation:drive-flow .5s linear infinite,drive-sv 8s linear infinite}',
    '@keyframes drive-flow{to{stroke-dashoffset:-18}}',
    '@keyframes drive-sv{0%,12%{opacity:0}16%,84%{opacity:1}90%,100%{opacity:0}}',
    /* pump fill 8 s */
    '.drive-fill{animation:drive-fill 8s linear infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes drive-fill{0%,10%{transform:scaleY(.08)}75%,96%{transform:scaleY(1)}100%{transform:scaleY(.08)}}',
    '.drive-handle{animation:drive-handle .8s ease-in-out infinite}',
    '@keyframes drive-handle{0%,100%{transform:translateY(0)}50%{transform:translateY(22px)}}',
    '.drive-hose{stroke-dasharray:8 6;animation:drive-flow .45s linear infinite,drive-hv 8s linear infinite}',
    '@keyframes drive-hv{0%,8%{opacity:0}12%,74%{opacity:1}80%,100%{opacity:.15}}',
    '.drive-over{opacity:0;animation:drive-over 8s linear infinite}',
    '@keyframes drive-over{0%,76%{opacity:0}80%,96%{opacity:1}100%{opacity:0}}',
    /* level close-up 6 s */
    '.drive-rise{animation:drive-rise 6s ease-out infinite}',
    '@keyframes drive-rise{0%,10%{transform:translateY(60px)}60%,100%{transform:translateY(0)}}',
    '.drive-finger{animation:drive-finger 6s ease-in-out infinite}',
    '@keyframes drive-finger{0%,55%{transform:translateX(120px);opacity:0}70%,95%{transform:translateX(0);opacity:1}100%{opacity:0}}',
    /* ATF temperature 8 s */
    '.drive-temp{animation:drive-temp 8s ease-in-out infinite;transform-box:fill-box;transform-origin:0 50%}',
    '@keyframes drive-temp{0%,8%{transform:scaleX(.15)}60%,94%{transform:scaleX(.62)}100%{transform:scaleX(.15)}}',
    '.drive-inwin{opacity:0;animation:drive-inwin 8s linear infinite}',
    '@keyframes drive-inwin{0%,56%{opacity:0}60%,94%{opacity:1}100%{opacity:0}}',
    /* GL rings 6 s */
    '.drive-pit{opacity:0;animation:drive-pit 6s linear infinite}',
    '@keyframes drive-pit{0%,30%{opacity:0}60%,95%{opacity:1}100%{opacity:0}}',
    /* test 9 s */
    '.drive-car{animation:drive-car 9s ease-in-out infinite}',
    '@keyframes drive-car{0%{transform:translateX(-60px)}60%,100%{transform:translateX(120px)}}',
    [0, 1, 2].map(function (i) {
      var a = 20 + i * 22;
      return '.drive-t' + i + '{opacity:0;animation:drive-t' + i + ' 9s linear infinite}@keyframes drive-t' + i + '{0%,' + a + '%{opacity:0}' + (a + 4) + '%,94%{opacity:1}100%{opacity:0}}';
    }).join('\n')
  ].join('\n'));

  /* ---------- housing (side view) used in several scenes ---------- */
  function housing(levelCls, levelTop, uid) {
    var top = levelTop || 120, cid = 'drive-clip-' + (uid || 'x');
    return '<path class="k-metal2 s-dark" stroke-width="2" d="M120,70 Q120,50 140,50 L340,50 Q370,50 372,80 L380,200 Q380,240 340,244 L150,244 Q120,240 120,210 Z"/>' +
      '<clipPath id="' + cid + '"><path d="M124,74 Q124,54 142,54 L338,54 Q366,54 368,82 L376,200 Q376,236 338,240 L152,240 Q124,236 124,208 Z"/></clipPath>' +
      '<g clip-path="url(#' + cid + ')"><g class="' + (levelCls || '') + '"><rect class="k-oil" opacity=".85" x="120" y="' + top + '" width="262" height="' + (246 - top) + '"/></g></g>' +
      '<circle class="k-none s-dark" stroke-width="2" opacity=".35" cx="200" cy="150" r="46"/><circle class="k-none s-dark" stroke-width="2" opacity=".35" cx="300" cy="160" r="34"/>';
  }

  function plug(x, y, cls) { return '<g transform="translate(' + x + ',' + y + ')"><g class="' + (cls || '') + '">' + L.hex(0, 0, 10, 'k-metal') + '</g></g>'; }

  /* ---------- drive.diffs: top view per vehicle ---------- */
  A.register('drive.diffs', {
    render: function (ctx) {
      var v = ctx.vehicle;
      var s = '<rect class="k-body" opacity=".35" x="40" y="70" width="400" height="160" rx="50"/>' +
        '<rect class="k-dark" x="70" y="58" width="50" height="16" rx="5"/><rect class="k-dark" x="70" y="226" width="50" height="16" rx="5"/>' +
        '<rect class="k-dark" x="350" y="58" width="50" height="16" rx="5"/><rect class="k-dark" x="350" y="226" width="50" height="16" rx="5"/>' +
        L.label(452, 150, ctx.t({ cs: 'předek →', en: 'front →' }), { size: 11, anchor: 'end', cls: 'k-muted' });
      var unit = function (x, y, w, h, cls) { return '<rect class="' + (cls || 'k-metal2') + ' s-dark" stroke-width="1.5" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="5"/>'; };
      var hl = function (x, y, r) { return '<circle class="k-accent lib-pulse" cx="' + x + '" cy="' + y + '" r="' + r + '"/>'; };
      var labels = [];
      if (v === 'mb-cl500-c216') {
        s += unit(320, 120, 80, 60, 'k-metal') + unit(240, 132, 80, 36) + '<line class="s-dark" stroke-width="6" x1="120" y1="150" x2="240" y2="150"/>' + unit(90, 126, 32, 48) +
          '<line class="s-dark" stroke-width="5" x1="106" y1="78" x2="106" y2="222"/>' + hl(280, 150, 34) + hl(106, 150, 30);
        labels = [[280, 112, { cs: '7G-Tronic (ATF)', en: '7G-Tronic (ATF)' }], [106, 196, { cs: 'Zadní dif.', en: 'Rear diff' }], [360, 196, { cs: 'Motor V8', en: 'V8 engine' }]];
      } else if (v === 'volvo-xc60-b4') {
        s += unit(330, 100, 50, 80, 'k-metal') + unit(290, 112, 40, 70) + unit(266, 150, 26, 34) + '<line class="s-dark" stroke-width="6" x1="122" y1="166" x2="266" y2="166"/>' + unit(90, 140, 32, 50) +
          '<line class="s-dark" stroke-width="5" x1="106" y1="78" x2="106" y2="222"/><line class="s-dark" stroke-width="5" x1="370" y1="78" x2="370" y2="100"/><line class="s-dark" stroke-width="5" x1="310" y1="182" x2="310" y2="222"/>' +
          hl(310, 140, 26) + hl(279, 168, 20) + hl(106, 165, 28);
        labels = [[310, 96, { cs: 'Automat 8st.', en: '8-speed auto' }], [250, 208, { cs: 'Úhlový převod (PTU)', en: 'Angle gear (PTU)' }], [106, 210, { cs: 'Zadní RDU + spojka', en: 'Rear RDU + coupling' }]];
      } else if (v === 'toyota-gr-yaris') {
        s += unit(334, 104, 46, 76, 'k-metal') + unit(294, 110, 40, 72) + unit(270, 150, 26, 34) + '<line class="s-dark" stroke-width="6" x1="122" y1="166" x2="270" y2="166"/>' + unit(90, 140, 32, 50) +
          '<line class="s-dark" stroke-width="5" x1="106" y1="78" x2="106" y2="222"/>' +
          hl(314, 140, 26) + hl(283, 168, 20) + hl(106, 165, 28);
        labels = [[314, 96, { cs: '6MT + přední dif.', en: '6MT + front diff' }], [254, 208, { cs: 'Rozdělovací převodovka', en: 'Transfer case' }], [106, 210, { cs: 'Zadní dif. + spojka', en: 'Rear diff + coupling' }]];
      } else {
        s += unit(330, 104, 50, 80, 'k-metal') + unit(290, 112, 40, 70) + '<line class="s-dark" stroke-width="5" x1="310" y1="78" x2="310" y2="222"/>' + hl(310, 147, 32);
        labels = [[300, 208, { cs: 'Převodovka + diferenciál', en: 'Gearbox + differential' }], [355, 96, { cs: 'Motor', en: 'Engine' }]];
      }
      labels.forEach(function (l) { s += L.label(l[0], l[1], ctx.t(l[2]), { bg: true, size: 11 }); });
      s += L.label(16, 24, ctx.t({ cs: 'Každá jednotka = vlastní olej, specifikace a množství', en: 'Each unit = its own oil, spec and capacity' }), { anchor: 'start', bg: true, size: 12 });
      s += L.label(16, 286, ctx.t({ cs: 'Pohled shora (schéma)', en: 'Top view (schematic)' }), { anchor: 'start', bg: true, size: 11 });
      return L.svg(s, ctx.t({ cs: 'Jednotky pohonu s vlastním olejem', en: 'Drivetrain units with their own oil' }));
    }
  });

  /* ---------- drive.gl ---------- */
  A.register('drive.gl', {
    render: function (ctx) {
      var bottle = function (x, txt, cls) {
        return '<g transform="translate(' + x + ',70)"><rect class="' + cls + ' s-dark" stroke-width="1.5" x="0" y="20" width="70" height="110" rx="10"/><rect class="k-dark" x="22" y="4" width="26" height="18" rx="3"/>' +
          '<rect class="k-white" opacity=".85" x="8" y="52" width="54" height="40" rx="4"/><text x="35" y="78" text-anchor="middle" font-size="15" font-weight="800" class="k-badgetext">' + txt + '</text></g>';
      };
      var s = bottle(40, 'GL-4', 'k-ok') + bottle(370, 'GL-5', 'k-warn') +
        '<circle class="k-rust" cx="240" cy="130" r="60"/><circle class="k-ground" cx="240" cy="130" r="38"/>' +
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(function (i) { var a = i * Math.PI / 8; return '<rect class="k-rust" x="' + (240 + Math.cos(a) * 62 - 4).toFixed(1) + '" y="' + (130 + Math.sin(a) * 62 - 4).toFixed(1) + '" width="8" height="8"/>'; }).join('') +
        '<g class="drive-pit">' + [[214, 92], [270, 100], [282, 156], [204, 168], [246, 186]].map(function (p) { return '<circle class="k-dark" cx="' + p[0] + '" cy="' + p[1] + '" r="5"/>'; }).join('') + '</g>' +
        L.label(240, 216, ctx.t({ cs: 'Synchronní kroužek (barevný kov)', en: 'Synchro ring (yellow metal)' }), { bg: true, size: 11 }) +
        L.check(75, 222) + L.label(75, 250, ctx.t({ cs: 'dle předpisu', en: 'as specified' }), { bg: true, size: 11 }) +
        L.warnIcon(405, 222) + L.label(405, 250, ctx.t({ cs: 'jen je-li předepsán', en: 'only if specified' }), { bg: true, size: 11 }) +
        L.label(16, 24, ctx.t({ cs: 'Rozhoduje norma výrobce, ne „lepší“ číslo', en: 'The maker\'s spec decides, not a "better" number' }), { anchor: 'start', bg: true }) +
        L.label(16, 290, ctx.t({ cs: 'Nevhodný olej může poškodit synchrony a lamely', en: 'Wrong oil can damage synchros and clutch packs' }), { anchor: 'start', bg: true, size: 12, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Správná specifikace převodového oleje', en: 'Correct gear oil specification' }));
    }
  });

  /* ---------- drive.fillFirst ---------- */
  A.register('drive.fillFirst', {
    render: function (ctx) {
      var s = housing('', 130, ctx.uid) +
        plug(374, 130) + plug(250, 248) +
        '<g transform="translate(386,130)"><g class="drive-w1"><g transform="rotate(-90)">' + L.wrench(80) + '</g></g></g>' +
        '<g transform="translate(250,258)"><g class="drive-w2"><g transform="rotate(180)">' + L.wrench(70) + '</g></g></g>' +
        L.badge(420, 172, '1', 'accent') + L.badge(200, 270, '2', 'accent') +
        '<g class="drive-c1">' + L.check(450, 130) + '</g><g class="drive-c2">' + L.check(290, 280) + '</g>' +
        L.label(16, 20, ctx.t({ cs: '1. NEJDŘÍV povolit plnicí šroub', en: '1. FIRST loosen the fill plug' }), { anchor: 'start', bg: true }) +
        L.label(16, 44, ctx.t({ cs: '2. teprve pak vypouštěcí', en: '2. only then the drain plug' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Plnicí nejde povolit? Nevypouštět!', en: 'Fill plug stuck? Do not drain!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Nejdřív plnicí, potom vypouštěcí šroub', en: 'Fill plug first, then drain plug' }));
    }
  });

  /* ---------- drive.drain ---------- */
  A.register('drive.drain', {
    render: function (ctx) {
      var s = '<g transform="translate(-60,-30)">' + housing('drive-lvl', 120, ctx.uid) + '</g>' +
        plug(312, 140, '') +
        '<path class="k-none s-oil drive-stream" stroke-width="7" stroke-linecap="round" d="M190,214 Q200,240 220,262"/>' +
        '<path class="k-dark" d="M170,262 L292,262 L284,292 L178,292 Z"/><g class="drive-pan"><rect class="k-oil" x="182" y="266" width="98" height="24"/></g>' +
        '<g transform="translate(330,180)"><circle class="k-metal" r="22"/><circle class="k-dark" r="10"/><circle class="k-none s-muted" stroke-width="5" stroke-dasharray="2 3" r="16"/></g>' +
        L.label(330, 222, ctx.t({ cs: 'Magnet: jemná pasta = OK', en: 'Magnet: fine paste = OK' }), { bg: true, size: 11 }) +
        L.label(330, 246, ctx.t({ cs: 'kousky kovu = problém', en: 'metal chunks = problem' }), { bg: true, size: 11, cls: 'k-danger' }) +
        L.label(16, 286, ctx.t({ cs: 'Teplý olej', en: 'Warm oil' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(470, 24, ctx.t({ cs: 'Vypustit do záchytné vany', en: 'Drain into a catch pan' }), { anchor: 'end', bg: true });
      return L.svg(s, ctx.t({ cs: 'Vypuštění převodového oleje', en: 'Draining the gear oil' }));
    }
  });

  /* ---------- drive.seal ---------- */
  A.register('drive.seal', {
    render: function (ctx) {
      var tq = ctx.t({ cs: 'moment dle příručky', en: 'torque per manual' });
      var s = '<g transform="translate(120,150)">' +
        '<rect class="k-metal" x="0" y="-18" width="70" height="36" rx="3"/>' +
        [8, 18, 28, 38, 48, 58].map(function (x) { return '<line class="s-dark" stroke-width="2" x1="' + x + '" y1="-18" x2="' + x + '" y2="18"/>'; }).join('') +
        '<rect class="k-accent lib-fade" x="70" y="-28" width="8" height="56" rx="2"/>' +
        '<rect class="k-metal2 s-dark" stroke-width="1.5" x="78" y="-28" width="30" height="56" rx="4"/>' + L.hex(93, 0, 12, 'k-metal') + '</g>' +
        L.label(194, 100, ctx.t({ cs: 'Nové těsnění (podložka / O-kroužek)', en: 'New seal (washer / O-ring)' }), { anchor: 'start', bg: true, size: 12 }) +
        L.badge(300, 230, tq, 'accent') +
        L.label(16, 24, ctx.t({ cs: 'Závit čistý, šroub nejdřív rukou', en: 'Clean thread, start the plug by hand' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Hliníkové skříně: snadno strhnete závit!', en: 'Aluminium cases: threads strip easily!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Vypouštěcí šroub s novým těsněním', en: 'Drain plug with a new seal' }));
    }
  });

  /* ---------- drive.pump ---------- */
  A.register('drive.pump', {
    render: function (ctx) {
      var s = '<g transform="translate(-80,0)">' + housing('drive-fill', 128, ctx.uid) + '</g>' +
        plug(296, 128) +
        '<g class="drive-over">' + L.drops(298, 140, 3, 60, 'k-oil') + '</g>' +
        // pump bottle
        '<rect class="k-accent s-dark" stroke-width="1.5" x="380" y="150" width="70" height="120" rx="10"/>' +
        '<g class="drive-handle"><rect class="k-dark" x="410" y="60" width="10" height="92"/><rect class="k-dark" x="392" y="54" width="46" height="12" rx="5"/></g>' +
        '<path class="k-none s-dark" stroke-width="6" d="M416,150 Q400,110 340,118 L304,124"/>' +
        '<path class="k-none s-oil drive-hose" stroke-width="3" d="M416,150 Q400,110 340,118 L304,124"/>' +
        L.label(16, 24, ctx.t({ cs: 'Plnit ruční pumpou plnicím otvorem', en: 'Fill through the fill hole with a hand pump' }), { anchor: 'start', bg: true }) +
        '<g class="drive-over">' + L.label(300, 286, ctx.t({ cs: 'Začne vytékat = plno', en: 'Starts to overflow = full' }), { bg: true, cls: 'k-ok' }) + '</g>';
      return L.svg(s, ctx.t({ cs: 'Plnění převodového oleje pumpou', en: 'Filling gear oil with a pump' }));
    }
  });

  /* ---------- drive.level ---------- */
  A.register('drive.level', {
    render: function (ctx) {
      var s = '<rect class="k-metal2" x="250" y="30" width="40" height="240"/>' +
        '<rect class="k-ground" x="250" y="120" width="40" height="34"/>' +
        '<clipPath id="drive-lv-' + ctx.uid + '"><rect x="40" y="40" width="210" height="220"/></clipPath>' +
        '<g clip-path="url(#drive-lv-' + ctx.uid + ')"><g class="drive-rise"><rect class="k-oil" opacity=".85" x="40" y="154" width="210" height="120"/></g></g>' +
        '<line class="s-ok" stroke-width="3" stroke-dasharray="6 4" x1="40" y1="154" x2="300" y2="154"/>' +
        '<g class="drive-finger"><path class="k-filler s-dark" stroke-width="1.5" d="M440,130 L290,130 Q262,130 262,150 L262,160 Q262,168 270,168 Q278,168 278,160 L278,148 L440,148 Z"/></g>' +
        L.label(310, 190, ctx.t({ cs: 'Hladina = spodní hrana otvoru', en: 'Level = lower edge of the hole' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 24, ctx.t({ cs: 'Vůz musí stát VODOROVNĚ', en: 'Car must be LEVEL' }), { anchor: 'start', bg: true, cls: 'k-danger' }) +
        L.label(16, 286, ctx.t({ cs: 'Přebytek nechat odkapat, pak zašroubovat', en: 'Let the excess drip out, then refit the plug' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Kontrola hladiny u plnicího otvoru', en: 'Checking the level at the fill hole' }));
    }
  });

  /* ---------- drive.atfTemp ---------- */
  A.register('drive.atfTemp', {
    render: function (ctx) {
      var win = {
        'mb-cl500-c216': { cs: '≈ 80 °C (XENTRY)', en: '≈ 80 °C (XENTRY)' },
        'volvo-xc60-b4': { cs: 'okno dle VIDA', en: 'window per VIDA' }
      }[ctx.vehicle] || { cs: 'okno dle výrobce', en: 'maker\'s window' };
      var s = '<rect class="k-dark" x="40" y="40" width="400" height="150" rx="16"/><rect class="k-ground" x="54" y="54" width="372" height="122" rx="8"/>' +
        L.label(240, 80, ctx.t({ cs: 'Teplota ATF', en: 'ATF temperature' }), { size: 15 }) +
        '<rect class="k-line" x="80" y="108" width="320" height="18" rx="9"/>' +
        '<rect class="k-ok" opacity=".45" x="252" y="102" width="56" height="30" rx="4"/>' +
        '<g class="drive-temp"><rect class="k-danger" x="80" y="108" width="320" height="18" rx="9"/></g>' +
        '<g class="drive-inwin">' + L.label(240, 156, ctx.t({ cs: 'V okně → měřit hladinu', en: 'In window → check level' }), { size: 13, cls: 'k-ok' }) + '</g>' +
        L.badge(240, 214, ctx.t(win), 'accent') +
        L.label(16, 24, ctx.t({ cs: 'Motor běží, P, vůz vodorovně', en: 'Engine running, P, car level' }), { anchor: 'start', bg: true }) +
        L.label(16, 254, ctx.t({ cs: 'Přepad: přebytek vyteče, když je hladina OK', en: 'Overflow: excess drips out when level is OK' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 282, ctx.t({ cs: 'Bez diagnostiky hladinu automatu NEHÁDAT', en: 'Do NOT guess AT level without a scan tool' }), { anchor: 'start', bg: true, size: 12, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Kontrola hladiny ATF při teplotě', en: 'Checking ATF level at temperature' }));
    }
  });

  /* ---------- drive.test ---------- */
  A.register('drive.test', {
    render: function (ctx) {
      var items = [
        { cs: 'Řazení hladké', en: 'Smooth shifting' },
        { cs: 'Bez hluku / vytí', en: 'No noise / whine' },
        { cs: 'Zátky suché', en: 'Plugs dry' }
      ];
      var s = '<rect class="k-dark" x="0" y="262" width="480" height="38"/>' +
        '<g class="drive-car">' + L.car(40, 262, {}) + '</g>';
      items.forEach(function (it, i) {
        s += '<g class="drive-t' + i + '">' + L.check(36, 40 + i * 38) + L.label(58, 44 + i * 38, ctx.t(it), { anchor: 'start', bg: true }) + '</g>';
      });
      s += L.label(470, 24, ctx.t({ cs: 'Zkušební jízda 10–20 km', en: 'Test drive 10–20 km' }), { anchor: 'end', bg: true });
      return L.svg(s, ctx.t({ cs: 'Zkušební jízda a kontrola těsnosti', en: 'Test drive and leak check' }));
    }
  });
})(window.STU);
