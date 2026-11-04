/* Animations: spark plugs (petrol) and glow plugs (diesel). */
(function (S) {
  'use strict';
  var L = S.animLib, A = S.anim;

  var TQ = {
    'generic': { cs: 'dle příručky', en: 'per manual' },
    'mb-cl500-c216': '≈ 25 Nm',
    'volvo-xc60-b4': { cs: 'dle VIDA', en: 'per VIDA' },
    'skoda-octavia-rs-tdi': '≈ 15 Nm',
    'toyota-gr-yaris': { cs: 'dle TIS', en: 'per TIS' },
    'citroen-jumper-22hdi': { cs: 'dle příručky (ověřit)', en: 'per manual (verify)' }
  };
  var GAP = {
    'generic': { cs: 'dle příručky', en: 'per manual' },
    'mb-cl500-c216': { cs: 'z výroby – neupravovat', en: 'pre-gapped – do not adjust' },
    'volvo-xc60-b4': { cs: 'dle VIDA', en: 'per VIDA' },
    'toyota-gr-yaris': { cs: 'z výroby – neupravovat', en: 'pre-gapped – do not adjust' }
  };
  function isGlow(ctx) { return ctx.vehicle === 'skoda-octavia-rs-tdi' || ctx.vehicle === 'citroen-jumper-22hdi'; }

  A.css('plugs', [
    /* cover off 6 s */
    '.plugs-cover{animation:plugs-cover 6s ease-in-out infinite}',
    '@keyframes plugs-cover{0%,15%{transform:translateY(0);opacity:1}45%,80%{transform:translateY(-90px);opacity:.25}100%{transform:translateY(0);opacity:1}}',
    '.plugs-clip{animation:plugs-clip 6s ease-in-out infinite}',
    '@keyframes plugs-clip{0%,10%{opacity:0}18%,40%{opacity:1}50%,100%{opacity:0}}',
    /* coil out 7 s */
    '.plugs-press{animation:plugs-press 7s ease-in-out infinite;opacity:0}',
    '@keyframes plugs-press{0%,5%{opacity:0;transform:translateY(-12px)}15%,28%{opacity:1;transform:translateY(0)}35%,100%{opacity:0}}',
    '.plugs-conn{animation:plugs-conn 7s ease-in-out infinite}',
    '@keyframes plugs-conn{0%,28%{transform:translateX(0)}40%,88%{transform:translateX(70px)}100%{transform:translateX(0)}}',
    '.plugs-coilup{animation:plugs-coilup 7s ease-in-out infinite}',
    '@keyframes plugs-coilup{0%,42%{transform:translateY(0)}72%,88%{transform:translateY(-110px)}100%{transform:translateY(0)}}',
    '.plugs-coildn{animation:plugs-coildn 7s ease-in-out infinite}',
    '@keyframes plugs-coildn{0%,12%{transform:translateY(-110px)}42%,100%{transform:translateY(0)}}',
    '.plugs-connin{animation:plugs-connin 7s ease-in-out infinite}',
    '@keyframes plugs-connin{0%,45%{transform:translateX(70px)}62%,100%{transform:translateX(0)}}',
    '.plugs-clickin{animation:plugs-clickin 7s linear infinite;opacity:0}',
    '@keyframes plugs-clickin{0%,62%{opacity:0}66%,92%{opacity:1}100%{opacity:0}}',
    /* blow out 4 s */
    '.plugs-debris{animation:plugs-debris 1.6s ease-out infinite;opacity:0}',
    '@keyframes plugs-debris{0%{transform:translate(0,0);opacity:0}15%{opacity:1}100%{transform:translate(var(--dx),-130px);opacity:0}}',
    '.plugs-air{stroke-dasharray:8 8;animation:plugs-air .5s linear infinite}',
    '@keyframes plugs-air{to{stroke-dashoffset:-16}}',
    /* socket remove 8 s */
    '.plugs-sockdn{animation:plugs-sockdn 8s ease-in-out infinite}',
    '@keyframes plugs-sockdn{0%,5%{transform:translateY(-110px)}25%,60%{transform:translateY(0)}85%,100%{transform:translateY(-110px)}}',
    '.plugs-plugup{animation:plugs-plugup 8s ease-in-out infinite}',
    '@keyframes plugs-plugup{0%,32%{transform:translateY(0)}60%{transform:translateY(-24px)}85%,100%{transform:translateY(-134px)}}',
    '.plugs-rot{animation:plugs-rot 8s linear infinite;opacity:0}',
    '@keyframes plugs-rot{0%,27%{opacity:0}30%,60%{opacity:1}64%,100%{opacity:0}}',
    /* gap gauge 6 s */
    '.plugs-gauge{animation:plugs-gauge 6s ease-in-out infinite}',
    '@keyframes plugs-gauge{0%,10%{transform:translateX(-170px)}45%,80%{transform:translateX(0)}100%{transform:translateX(-170px)}}',
    '.plugs-gapok{animation:plugs-gapok 6s linear infinite;opacity:0}',
    '@keyframes plugs-gapok{0%,48%{opacity:0}52%,80%{opacity:1}90%,100%{opacity:0}}',
    /* thread by hand 8 s */
    '.plugs-hose{animation:plugs-hose 8s ease-in-out infinite}',
    '@keyframes plugs-hose{0%,8%{transform:translateY(-70px)}50%,100%{transform:translateY(0)}}',
    '.plugs-badtilt{animation:plugs-badtilt 4s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes plugs-badtilt{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(-9deg)}}',
    /* torque 6 s */
    '.plugs-tw{animation:plugs-tw 6s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes plugs-tw{0%,15%{transform:rotate(0)}60%,85%{transform:rotate(28deg)}100%{transform:rotate(0)}}',
    '.plugs-click{animation:plugs-click 6s linear infinite;opacity:0}',
    '@keyframes plugs-click{0%,58%{opacity:0}62%,88%{opacity:1}100%{opacity:0}}',
    /* twin spark sequence 8 s: one keyframe per cylinder */
    [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) {
      var a = 4 + i * 11;
      return '.plugs-cyl' + i + '{animation:plugs-cyl' + i + ' 8s linear infinite}' +
        '@keyframes plugs-cyl' + i + '{0%,' + a + '%{fill:var(--a-line)}' + (a + 3) + '%,95%{fill:var(--a-accent)}100%{fill:var(--a-line)}}';
    }).join('\n'),
    /* glow loosen 8 s */
    '.plugs-gneedle{animation:plugs-gneedle 8s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes plugs-gneedle{0%,10%{transform:rotate(-80deg)}45%{transform:rotate(-20deg)}55%,75%{transform:rotate(55deg)}100%{transform:rotate(-80deg)}}',
    '.plugs-stop{animation:plugs-stop 8s linear infinite;opacity:0}',
    '@keyframes plugs-stop{0%,55%{opacity:0}58%,62%{opacity:1}64%{opacity:.3}66%,90%{opacity:1}100%{opacity:0}}',
    '.plugs-gsock{animation:plugs-gsock 8s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes plugs-gsock{0%,10%{transform:rotate(0)}45%{transform:rotate(-25deg)}55%,90%{transform:rotate(-30deg)}100%{transform:rotate(0)}}',
    /* glow snap 6 s */
    '.plugs-snaptop{animation:plugs-snaptop 6s ease-in infinite}',
    '@keyframes plugs-snaptop{0%,35%{transform:translate(0,0) rotate(0)}55%,90%{transform:translate(18px,-40px) rotate(14deg)}100%{transform:translate(0,0)}}',
    '.plugs-flash{animation:plugs-flash 6s linear infinite;opacity:0}',
    '@keyframes plugs-flash{0%,34%{opacity:0}37%{opacity:1}44%,100%{opacity:0}}',
    '.plugs-snapx{animation:plugs-snapx 6s linear infinite;opacity:0}',
    '@keyframes plugs-snapx{0%,50%{opacity:0}55%,92%{opacity:1}100%{opacity:0}}',
    /* multimeter 6 s */
    '.plugs-probe{animation:plugs-probe 6s ease-in-out infinite}',
    '@keyframes plugs-probe{0%,10%{transform:translate(-40px,-40px)}35%,85%{transform:translate(0,0)}100%{transform:translate(-40px,-40px)}}',
    '.plugs-reading{animation:plugs-reading 6s linear infinite;opacity:0}',
    '@keyframes plugs-reading{0%,38%{opacity:0}42%,85%{opacity:1}100%{opacity:0}}',
    /* penetrating oil */
    '.plugs-spray{animation:plugs-spray 3s ease-in-out infinite;opacity:0}',
    '@keyframes plugs-spray{0%,20%{opacity:0}30%,70%{opacity:.85}85%,100%{opacity:0}}',
    /* glow light */
    '.plugs-glowlamp{animation:plugs-glowlamp 1s steps(1,end) infinite}',
    '@keyframes plugs-glowlamp{0%{fill:var(--a-warn)}50%{fill:var(--a-line)}}',
    '.plugs-smoke{animation:plugs-smoke 3s ease-out infinite;opacity:0;transform-box:fill-box;transform-origin:center}',
    '@keyframes plugs-smoke{0%{opacity:0;transform:translate(0,0) scale(.5)}20%{opacity:.7}100%{opacity:0;transform:translate(-50px,-40px) scale(1.6)}}',
    /* test run */
    '.plugs-vib{animation:plugs-vib .25s linear infinite}',
    '@keyframes plugs-vib{0%,100%{transform:translate(0,0)}50%{transform:translate(0,1px)}}',
    '.plugs-mil{animation:plugs-mil 6s steps(1,end) infinite}',
    '@keyframes plugs-mil{0%,20%{fill:var(--a-warn)}20.1%,100%{fill:var(--a-line)}}',
    '.plugs-ok{animation:plugs-ok 6s linear infinite;opacity:0}',
    '@keyframes plugs-ok{0%,25%{opacity:0}30%,95%{opacity:1}100%{opacity:0}}'
  ].join('\n'));

  /* ---------- drawing helpers ---------- */

  /** Spark plug standing upright; origin = seat (top of thread). */
  function sparkPlug(opts) {
    opts = opts || {};
    var s = '<g>';
    s += '<rect class="k-metal2 s-dark" stroke-width="1" x="-5" y="-92" width="10" height="12" rx="2"/>';
    s += '<path class="k-white s-dark" stroke-width="1" d="M-9,-80 L9,-80 L11,-26 L-11,-26 Z"/>';
    for (var i = 0; i < 4; i++) s += '<rect class="k-metal" opacity=".5" x="-10" y="' + (-74 + i * 10) + '" width="20" height="3"/>';
    s += L.hex(0, -14, 15, 'k-metal');
    s += '<rect class="k-metal s-dark" stroke-width="1" x="-15" y="-16" width="30" height="16" rx="2"/>';
    s += '<rect class="k-metal2 s-dark" stroke-width="1" x="-9" y="0" width="18" height="26"/>';
    for (var j = 0; j < 6; j++) s += '<line class="s-dark" stroke-width="1.2" x1="-9" y1="' + (3 + j * 4) + '" x2="9" y2="' + (5 + j * 4) + '"/>';
    s += '<rect class="' + (opts.tipCls || 'k-white') + '" x="-3" y="26" width="6" height="7"/>';
    s += '<path class="k-none s-metal" stroke-width="3" d="M7,26 L7,38 L-1,38"/>';
    s += '</g>';
    return s;
  }

  /** Diesel glow plug: long thin, origin = seat. */
  function glowPlug() {
    return '<g><rect class="k-metal2 s-dark" stroke-width="1" x="-3" y="-108" width="6" height="18"/>' +
      L.hex(0, -84, 9, 'k-metal') +
      '<rect class="k-metal s-dark" stroke-width="1" x="-6" y="-78" width="12" height="60"/>' +
      '<rect class="k-metal2 s-dark" stroke-width="1" x="-6" y="-18" width="12" height="18"/>' +
      '<rect class="k-metal2 s-dark" stroke-width="1" x="-4" y="0" width="8" height="40" rx="3"/>' +
      '<rect class="k-danger" opacity=".75" x="-4" y="28" width="8" height="12" rx="3"/></g>';
  }

  /** Cylinder-head cross-section. Plug well centre x=240, seat y=196. */
  function head(opts) {
    opts = opts || {};
    var s = '';
    s += '<rect class="k-metal2" x="110" y="60" width="260" height="190" rx="6"/>';
    s += '<rect class="k-dark" opacity=".65" x="216" y="60" width="48" height="136"/>';
    s += '<rect class="k-metal2" x="226" y="196" width="28" height="32"/>';
    for (var i = 0; i < 7; i++) s += '<line class="s-dark" stroke-width="1" opacity=".5" x1="226" y1="' + (198 + i * 4) + '" x2="254" y2="' + (200 + i * 4) + '"/>';
    s += '<path class="k-dark" d="M150,250 Q240,218 330,250 Z"/>';
    s += '<rect class="k-metal" x="110" y="250" width="260" height="14"/>';
    if (!opts.noLabels) s += L.label(400, 240, opts.headLabel || '', { size: 11, cls: 'k-muted' });
    return s;
  }

  /** Ignition coil (pencil type), origin = bottom of boot. */
  function coil(connCls) {
    return '<g><rect class="k-dark" x="-14" y="-132" width="28" height="102" rx="5"/>' +
      '<rect class="k-danger" opacity=".85" x="-10" y="-30" width="20" height="30" rx="4"/>' +
      '<rect class="k-dark s-line" stroke-width="1" x="-30" y="-152" width="60" height="24" rx="5"/>' +
      '<g class="' + (connCls || '') + '"><rect class="k-body2 s-dark" stroke-width="1" x="30" y="-150" width="34" height="20" rx="3"/>' +
      '<path class="k-none s-dark" stroke-width="3" d="M64,-140 Q90,-140 96,-112"/></g></g>';
  }

  /* ---------- registrations ---------- */

  A.register('plugs.overview', {
    render: function (ctx) {
      var glow = isGlow(ctx);
      var s = head() +
        '<g transform="translate(240,196)">' + (glow ? glowPlug() : sparkPlug()) + '</g>' +
        (glow ? '' : '<g transform="translate(240,196)">' + coil() + '</g>');
      s += L.arrow(330, 90, 258, glow ? 112 : 90, 'accent') + L.label(398, 86, glow ? ctx.t({ cs: 'Konektor', en: 'Connector' }) : ctx.t({ cs: 'Zapalovací cívka', en: 'Ignition coil' }), { bg: true });
      s += L.arrow(330, 150, 254, 150, 'accent') + L.label(398, 146, ctx.t({ cs: glow ? 'Žhavicí svíčka' : 'Svíčka (izolátor)', en: glow ? 'Glow plug' : 'Spark plug (insulator)' }), { bg: true });
      s += L.arrow(330, 206, 256, 206, 'accent') + L.label(400, 202, ctx.t({ cs: 'Závit v hlavě (Al!)', en: 'Thread in head (Al!)' }), { bg: true });
      s += L.arrow(150, 230, 234, 232, 'danger') + L.label(80, 226, ctx.t({ cs: 'Spalovací prostor', en: 'Combustion chamber' }), { bg: true });
      s += L.label(16, 24, ctx.t(glow ? { cs: 'Diesel: žhavicí svíčka předehřívá spalovací prostor', en: 'Diesel: the glow plug preheats the combustion chamber' } : { cs: 'Každý válec: cívka → svíčka → jiskra', en: 'Each cylinder: coil → plug → spark' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Řez hlavou válců se svíčkou', en: 'Cylinder head section with plug' }));
    }
  });

  A.register('plugs.cover', {
    render: function (ctx) {
      var s = '<rect class="k-metal2" x="90" y="150" width="300" height="110" rx="8"/>';
      for (var i = 0; i < 4; i++) s += '<rect class="k-dark" x="' + (128 + i * 64) + '" y="126" width="30" height="34" rx="4"/>';
      s += '<g class="plugs-cover"><path class="k-dark s-line" stroke-width="2" d="M80,130 Q80,100 110,96 L370,96 Q400,100 400,130 L400,150 L80,150 Z"/>' +
        '<text x="240" y="132" text-anchor="middle" font-size="18" font-weight="800" class="k-muted">ENGINE</text></g>';
      s += '<g class="plugs-clip">' + [100, 380].map(function (x) { return L.arrow(x, 180, x, 156, 'accent'); }).join('') + '</g>';
      s += L.label(16, 24, ctx.t({ cs: 'Kryt motoru: nahoru rovně, je na pryžových čepech', en: 'Engine cover: pull straight up, it sits on rubber studs' }), { anchor: 'start', bg: true });
      s += L.label(16, 286, ctx.t({ cs: 'Motor studený – hliníková hlava je pak bezpečnější', en: 'Engine cold – safer for the aluminium head' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Sundání krytu motoru', en: 'Removing the engine cover' }));
    }
  });

  A.register('plugs.coilOut', {
    render: function (ctx) {
      var s = head({ noLabels: true }) + '<g transform="translate(240,196)">' + sparkPlug() + '</g>' +
        '<g class="plugs-coilup"><g transform="translate(240,196)">' + coil('plugs-conn') + '</g></g>' +
        '<g transform="translate(290,36)"><g class="plugs-press">' + L.arrow(0, -2, 0, 18, 'accent') + '</g></g>' +
        L.label(16, 24, ctx.t({ cs: '1. Zámek konektoru stisknout, konektor stáhnout', en: '1. Press the connector lock, pull the connector' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: '2. Cívku vytáhnout ROVNĚ nahoru (ne za kabel)', en: '2. Pull the coil STRAIGHT up (not by the wire)' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Vyjmutí zapalovací cívky', en: 'Removing the ignition coil' }));
    }
  });

  A.register('plugs.coilIn', {
    render: function (ctx) {
      var s = head({ noLabels: true }) + '<g transform="translate(240,196)">' + sparkPlug() + '</g>' +
        '<g class="plugs-coildn"><g transform="translate(240,196)">' + coil('plugs-connin') + '</g></g>' +
        '<g class="plugs-clickin">' + L.badge(390, 62, ctx.t({ cs: 'cvak! zajištěno', en: 'click! locked' }), 'ok') + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Cívku zatlačit až dosedne, konektor až cvakne', en: 'Push the coil fully home, connector until it clicks' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Každý konektor zkontrolovat tahem', en: 'Tug-test every connector' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Nasazení cívky a konektoru', en: 'Refitting the coil and connector' }));
    }
  });

  A.register('plugs.blowOut', {
    render: function (ctx) {
      var s = head({ noLabels: true }) + '<g transform="translate(240,196)">' + sparkPlug() + '</g>';
      var dx = [-40, 30, -10, 50, -55, 15];
      dx.forEach(function (d, i) {
        s += '<g transform="translate(' + (230 + (i % 3) * 10) + ',100)"><circle class="k-rust plugs-debris" r="' + (3 + (i % 2)) + '" style="--dx:' + d + 'px;animation-delay:' + (i * 0.27).toFixed(2) + 's"/></g>';
      });
      s += '<g transform="translate(372,62) rotate(35)"><rect class="k-danger s-dark" stroke-width="1" x="-8" y="-40" width="16" height="50" rx="4"/><rect class="k-metal s-dark" stroke-width="1" x="-3" y="10" width="6" height="40"/></g>';
      s += '<path class="k-none s-fluid plugs-air" stroke-width="3" d="M340,106 L258,122"/>';
      s += L.label(16, 24, ctx.t({ cs: 'Šachtu vyfoukat PŘED povolením svíčky', en: 'Blow out the well BEFORE loosening the plug' }), { anchor: 'start', bg: true });
      s += L.warnIcon(36, 268) + L.label(60, 272, ctx.t({ cs: 'Písek ve válci = poškrábaný válec. Brýle!', en: 'Grit in the cylinder = scored bore. Glasses!' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Vyfoukání šachty svíčky', en: 'Blowing out the plug well' }));
    }
  });

  A.register('plugs.socket', {
    render: function (ctx) {
      var s = head({ noLabels: true }) +
        '<g class="plugs-plugup"><g transform="translate(240,196)">' + sparkPlug() + '</g></g>' +
        '<g class="plugs-sockdn"><g transform="translate(240,196)">' +
        '<rect class="k-metal s-dark" stroke-width="1.5" x="-18" y="-100" width="36" height="86" rx="3" opacity=".9"/>' +
        '<rect class="k-dark" x="-10" y="-96" width="20" height="18" rx="3"/>' +
        '<rect class="k-metal2 s-dark" stroke-width="1" x="-6" y="-240" width="12" height="140"/></g></g>' +
        '<g class="plugs-rot">' + L.rotArrow(240, 100, 34, 'ccw', 'accent', 220) + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Hlavice na svíčky s gumou + prodloužení', en: 'Spark plug socket with rubber insert + extension' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Povolit proti směru hod. ručiček, plynule', en: 'Loosen counter-clockwise, smoothly' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Vyšroubování svíčky', en: 'Unscrewing the spark plug' }));
    }
  });

  A.register('plugs.read', {
    render: function (ctx) {
      var tips = [
        { cls: 'k-oil', cs: 'Normální', en: 'Normal', ok: true },
        { cls: 'k-dark', cs: 'Saze', en: 'Sooty', ok: false },
        { cls: 'k-belt', cs: 'Olejová', en: 'Oily', ok: false },
        { cls: 'k-white', cs: 'Přehřátá', en: 'Overheated', ok: false }
      ];
      var s = '';
      tips.forEach(function (tp, i) {
        var x = 75 + i * 110;
        s += '<g transform="translate(' + x + ',150) scale(1.3)">' + sparkPlug({ tipCls: tp.cls }) + '</g>';
        s += '<circle class="k-none s-' + (tp.ok ? 'ok' : 'danger') + ' lib-fade" style="animation-delay:' + (i * 0.4) + 's" stroke-width="3" cx="' + x + '" cy="191" r="18"/>';
        s += L.label(x, 236, ctx.t(tp), { bg: true, cls: tp.ok ? 'k-ok' : 'k-danger', size: 12 });
      });
      s += L.label(16, 24, ctx.t({ cs: 'Stará svíčka vypráví o stavu motoru', en: 'An old plug tells you about the engine' }), { anchor: 'start', bg: true });
      s += L.label(16, 286, ctx.t({ cs: 'Mokrá od oleje / bílá a natavená → do servisu', en: 'Oil-wet / white & blistered → see a workshop' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Čtení starých svíček', en: 'Reading old spark plugs' }));
    }
  });

  A.register('plugs.gap', {
    render: function (ctx) {
      var gap = GAP[ctx.vehicle] || GAP.generic;
      var s = '<g transform="translate(240,40) scale(2.6)">' +
        '<rect class="k-metal2 s-dark" stroke-width=".5" x="-9" y="0" width="18" height="26"/>' +
        '<rect class="k-white" x="-3" y="26" width="6" height="8"/>' +
        '<path class="k-none s-metal" stroke-width="3.2" d="M7,26 L7,44 L-2,44"/></g>' +
        '<g class="plugs-gauge"><rect class="k-warn s-dark" stroke-width="1" x="120" y="136" width="130" height="6" rx="2"/>' +
        '<text x="140" y="130" font-size="11" font-weight="700" class="k-text">0.8</text></g>' +
        '<g class="plugs-gapok">' + L.check(380, 140) + '</g>' +
        L.badge(240, 216, ctx.t({ cs: 'Mezera: ', en: 'Gap: ' }) + ctx.t(gap), 'accent') +
        L.label(16, 24, ctx.t({ cs: 'Spárová měrka mezi elektrody – jen kontrola', en: 'Feeler gauge between electrodes – check only' }), { anchor: 'start', bg: true }) +
        L.warnIcon(36, 262) + L.label(60, 266, ctx.t({ cs: 'Iridium/platina: tenkou elektrodu NEOHÝBAT', en: 'Iridium/platinum: do NOT bend the fine tip' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Kontrola mezery elektrod', en: 'Checking the electrode gap' }));
    }
  });

  A.register('plugs.thread', {
    render: function (ctx) {
      var glow = isGlow(ctx);
      var p = glow ? glowPlug() : sparkPlug();
      var s = head({ noLabels: true }) +
        '<g class="plugs-hose"><g transform="translate(240,196)">' + p +
        (glow ? '' : '<rect class="k-dark" opacity=".85" x="-7" y="-150" width="14" height="70" rx="5"/>') + '</g></g>' +
        L.rotArrow(240, 52, 26, 'cw', 'ok', 220) +
        // bad example
        '<g transform="translate(420,190)"><g class="plugs-badtilt"><g transform="scale(.55)">' + (glow ? glowPlug() : sparkPlug()) + '</g></g></g>' +
        L.cross(420, 236) + L.label(470, 266, ctx.t({ cs: 'šikmo = stržený závit', en: 'crooked = stripped thread' }), { bg: true, size: 11, anchor: 'end' }) +
        L.label(16, 24, ctx.t(glow ? { cs: 'Zašroubovat RUKOU až na doraz', en: 'Thread in BY HAND until it seats' } : { cs: 'Zašroubovat RUKOU – trik s hadičkou', en: 'Thread in BY HAND – rubber hose trick' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Drhne? Zastavit, vyndat, zkusit znovu rovně', en: 'Binding? Stop, remove, try again straight' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Zašroubování rukou', en: 'Threading in by hand' }));
    }
  });

  A.register('plugs.torque', {
    render: function (ctx) {
      var glow = isGlow(ctx);
      var tq = TQ[ctx.vehicle] || TQ.generic;
      var s = head({ noLabels: true }) + '<g transform="translate(240,196)">' + (glow ? glowPlug() : sparkPlug()) + '</g>' +
        '<g transform="translate(240,' + (glow ? 104 : 96) + ')"><g class="plugs-tw">' + L.torqueWrench(190) + '</g></g>' +
        '<g class="plugs-click">' + L.badge(380, 40, ctx.t({ cs: 'klik! ', en: 'click! ' }) + ctx.t(tq), 'accent') + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Momentovým klíčem – hlava je z hliníku', en: 'With a torque wrench – the head is aluminium' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Po cvaknutí už nepřitahovat', en: 'Stop pulling once it clicks' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Dotažení momentem', en: 'Tightening to torque' }));
    }
  });

  A.register('plugs.twinSpark', {
    render: function (ctx) {
      var s = '<rect class="k-metal2" x="40" y="60" width="400" height="190" rx="10"/>' +
        '<rect class="k-dark" x="40" y="146" width="400" height="18"/>';
      for (var bank = 0; bank < 2; bank++) {
        for (var c = 0; c < 4; c++) {
          var idx = bank * 4 + c;
          var x = 90 + c * 96, y = bank ? 210 : 100;
          s += '<circle class="k-dark" cx="' + x + '" cy="' + y + '" r="34"/>';
          s += '<circle class="plugs-cyl' + idx + '" cx="' + (x - 14) + '" cy="' + y + '" r="10"/><circle class="plugs-cyl' + idx + '" cx="' + (x + 14) + '" cy="' + y + '" r="10"/>';
        }
      }
      s += L.label(240, 34, ctx.t({ cs: 'M273 V8: 2 svíčky na válec = 16 svíček', en: 'M273 V8: 2 plugs per cylinder = 16 plugs' }), { bg: true });
      s += L.label(240, 286, ctx.t({ cs: 'Jeden válec po druhém – nic nepřehodit', en: 'One cylinder at a time – mix nothing up' }), { bg: true });
      return L.svg(s, ctx.t({ cs: 'Twin-spark: dvě svíčky na válec', en: 'Twin spark: two plugs per cylinder' }));
    }
  });

  A.register('plugs.test', {
    render: function (ctx) {
      var glow = isGlow(ctx);
      var s = '<rect class="k-dark" x="30" y="60" width="200" height="140" rx="16"/>' +
        '<g transform="translate(130,124)">' + (glow
          ? '<path class="plugs-mil" d="M-30,-6 q10,-14 20,0 q10,14 20,0 q10,-14 20,0 L30,6 q-10,14 -20,0 q-10,-14 -20,0 q-10,14 -20,0 Z"/>'
          : '<path class="plugs-mil" d="M-34,-14 L18,-14 L18,-22 L30,-22 L30,-6 L38,-6 L38,10 L30,10 L30,18 L-26,18 L-34,8 Z"/>') + '</g>' +
        L.label(130, 176, ctx.t(glow ? { cs: 'Kontrolka žhavení zhasne', en: 'Glow light goes out' } : { cs: 'Kontrolka motoru nesvítí', en: 'Engine light stays off' }), { size: 12 }) +
        '<g class="plugs-ok">' + L.check(214, 70) + '</g>' +
        '<rect class="k-ground s-line" stroke-width="2" x="260" y="60" width="190" height="140" rx="12"/>' +
        L.label(355, 86, ctx.t(glow ? { cs: 'Paměť závad', en: 'Fault memory' } : { cs: 'Počítadlo vynechávání', en: 'Misfire counter' }), { size: 12 });
      for (var i = 0; i < 4; i++) {
        s += L.label(300, 114 + i * 22, ctx.t(glow ? { cs: 'Svíčka ', en: 'Plug ' } : { cs: 'Válec ', en: 'Cyl ' }) + (i + 1), { anchor: 'start', size: 12 }) + '<g class="plugs-ok">' + L.label(420, 114 + i * 22, glow ? 'OK' : '0', { size: 13, cls: 'k-ok' }) + '</g>';
      }
      s += L.label(16, 24, ctx.t(glow ? { cs: 'Studený start druhý den ráno = skutečný test', en: 'Cold start next morning = the real test' } : { cs: 'Nastartovat: klidný volnoběh, bez cukání', en: 'Start: smooth idle, no stumbling' }), { anchor: 'start', bg: true });
      s += L.label(16, 286, ctx.t(glow ? { cs: 'Kontrolka žhavení bliká za jízdy → diagnostika', en: 'Glow light flashing while driving → diagnose' } : { cs: 'Bliká kontrolka motoru = vynechávání → vypnout!', en: 'Flashing engine light = misfire → switch off!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Zkouška po výměně', en: 'Test after replacement' }));
    }
  });

  /* ---------- diesel glow plugs ---------- */

  A.register('plugs.glowLight', {
    render: function (ctx) {
      var s = '<rect class="k-dark" x="30" y="44" width="170" height="110" rx="16"/>' +
        '<g transform="translate(115,92)"><path class="plugs-glowlamp" d="M-36,-8 q12,-16 24,0 q12,16 24,0 q12,-16 24,0 L36,8 q-12,16 -24,0 q-12,-16 -24,0 q-12,16 -24,0 Z"/></g>' +
        L.label(115, 136, ctx.t({ cs: 'Bliká = závada', en: 'Flashing = fault' }), { size: 12 }) +
        L.car(150, 268, { r: 22 }) +
        '<g transform="translate(146,250)">' + [0, 1, 2].map(function (i) { return '<circle class="k-muted plugs-smoke" style="animation-delay:' + i + 's" cx="0" cy="0" r="10"/>'; }).join('') + '</g>' +
        L.label(240, 66, ctx.t({ cs: 'Příznaky:', en: 'Symptoms:' }), { anchor: 'start', size: 13 }) +
        L.label(240, 92, ctx.t({ cs: '• těžký studený start', en: '• hard cold start' }), { anchor: 'start', size: 12 }) +
        L.label(240, 114, ctx.t({ cs: '• bílý kouř po startu', en: '• white smoke at start' }), { anchor: 'start', size: 12 }) +
        L.label(240, 136, ctx.t({ cs: '• kódy P0670–P0684', en: '• codes P0670–P0684' }), { anchor: 'start', size: 12 }) +
        L.label(16, 24, ctx.t({ cs: 'Žhavení pomáhá jen při studeném startu', en: 'Glow plugs only help on cold starts' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Příznaky vadných žhavicích svíček', en: 'Symptoms of faulty glow plugs' }));
    }
  });

  A.register('plugs.glowTest', {
    render: function (ctx) {
      var s = head({ noLabels: true }) + '<g transform="translate(240,196)">' + glowPlug() + '</g>' +
        '<rect class="k-warn s-dark" stroke-width="2" x="330" y="40" width="120" height="170" rx="12"/>' +
        '<rect class="k-ground" x="344" y="56" width="92" height="40" rx="4"/>' +
        '<g class="plugs-reading"><text x="390" y="84" text-anchor="middle" font-size="18" font-weight="800" class="k-text">0.8 Ω</text></g>' +
        '<circle class="k-dark" cx="390" cy="140" r="22"/>' +
        '<g class="plugs-probe"><path class="k-none s-danger" stroke-width="3" d="M370,200 Q300,120 246,92"/></g>' +
        '<path class="k-none s-dark" stroke-width="3" d="M410,200 Q420,260 330,262 L120,262"/>' +
        L.label(16, 24, ctx.t({ cs: 'Odpor: hrot na svorku, druhý na kostru', en: 'Resistance: probe on terminal, other to ground' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Typicky < 2 Ω; ∞ / velmi vysoký = vadná', en: 'Typically < 2 Ω; ∞ / very high = faulty' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Měření žhavicí svíčky', en: 'Testing a glow plug' }));
    }
  });

  A.register('plugs.penetrate', {
    render: function (ctx) {
      var s = head({ noLabels: true }) + '<g transform="translate(240,196)">' + glowPlug() + '</g>' +
        '<g transform="translate(320,40) rotate(30)"><rect class="k-accent s-dark" stroke-width="1" x="-12" y="-40" width="24" height="60" rx="5"/><rect class="k-dark" x="-3" y="-52" width="6" height="14"/></g>' +
        '<path class="k-oil plugs-spray" d="M294,30 L248,90 L262,92 Z"/>' +
        L.drops(244, 120, 3, 70, 'k-oil') +
        L.label(16, 24, ctx.t({ cs: 'Den předem: uvolňovač ke svíčkám', en: 'The day before: penetrating oil on the plugs' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Konektory stahovat za koncovku, ne za kabel', en: 'Pull connectors by the plug, not the wire' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Příprava žhavicích svíček', en: 'Preparing the glow plugs' }));
    }
  });

  A.register('plugs.glow', {
    render: function (ctx) {
      var s = head({ noLabels: true }) + '<g transform="translate(240,196)">' + glowPlug() + '</g>' +
        '<g transform="translate(240,112)"><g class="plugs-gsock"><rect class="k-metal s-dark" stroke-width="1" x="-10" y="-14" width="20" height="28" rx="3"/>' +
        '<rect class="k-metal2 s-dark" stroke-width="1" x="0" y="-5" width="150" height="10" rx="4"/></g></g>' +
        // force gauge
        '<g transform="translate(400,250)"><path class="k-none s-ok" stroke-width="10" d="M-44,0 A44,44 0 0 1 0,-44"/><path class="k-none s-danger" stroke-width="10" d="M8,-43 A44,44 0 0 1 44,0"/>' +
        '<g class="plugs-gneedle"><line class="s-text" stroke-width="3" x1="0" y1="0" x2="0" y2="-38"/></g><circle class="k-dark" r="5"/></g>' +
        L.label(400, 286, ctx.t({ cs: 'síla povolování', en: 'loosening force' }), { size: 11 }) +
        '<g class="plugs-stop"><rect class="k-danger" x="30" y="110" width="150" height="56" rx="10"/><text x="105" y="146" text-anchor="middle" font-size="26" font-weight="900" class="k-white">STOP!</text></g>' +
        L.label(16, 24, ctx.t({ cs: 'Citlivě, krátkou rukojetí – cítit odpor', en: 'Gently, short handle – feel the resistance' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Nejde? Nepřidávat sílu!', en: 'Stuck? Do not add force!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Povolování žhavicí svíčky', en: 'Loosening a glow plug' }));
    }
  });

  A.register('plugs.glowSnap', {
    render: function (ctx) {
      var s = head({ noLabels: true }) +
        '<g transform="translate(240,196)"><rect class="k-metal2 s-dark" stroke-width="1" x="-6" y="-18" width="12" height="18"/><rect class="k-metal2 s-dark" stroke-width="1" x="-4" y="0" width="8" height="40" rx="3"/></g>' +
        '<g class="plugs-snaptop"><g transform="translate(240,178)"><rect class="k-metal s-dark" stroke-width="1" x="-6" y="-60" width="12" height="58"/>' + L.hex(0, -66, 9, 'k-metal') + '</g></g>' +
        '<g class="plugs-flash"><circle class="k-danger" cx="240" cy="176" r="22" opacity=".6"/></g>' +
        '<g class="plugs-snapx">' + L.cross(330, 170) + L.label(390, 130, ctx.t({ cs: 'Ulomená svíčka', en: 'Snapped plug' }), { bg: true, cls: 'k-danger' }) +
        L.label(390, 210, ctx.t({ cs: '= specialista', en: '= specialist' }), { bg: true }) + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Přetažením se svíčka ulomí v hlavě', en: 'Forcing it snaps the plug inside the head' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Vyvrtání / demontáž hlavy = drahá oprava', en: 'Drilling out / head removal = expensive repair' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Ulomená žhavicí svíčka', en: 'Snapped glow plug' }));
    }
  });
})(window.STU);
