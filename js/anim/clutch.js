/* Animations: clutch kit + dual-mass flywheel, automatic transmission checks. */
(function (S) {
  'use strict';
  var L = S.animLib, A = S.anim;

  A.css('clutch', [
    /* exploded view 8 s – parts slide together then apart (offset in --dx) */
    '.clutch-exp{animation:clutch-exp 8s ease-in-out infinite}',
    '@keyframes clutch-exp{0%,18%{transform:translateX(var(--dx))}45%,85%{transform:translateX(0)}100%{transform:translateX(var(--dx))}}',
    /* gauges */
    '.clutch-rpm{animation:clutch-rpm 6s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes clutch-rpm{0%,10%{transform:rotate(-110deg)}45%,80%{transform:rotate(70deg)}100%{transform:rotate(-110deg)}}',
    '.clutch-spd{animation:clutch-spd 6s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes clutch-spd{0%,10%{transform:rotate(-80deg)}45%,80%{transform:rotate(-62deg)}100%{transform:rotate(-80deg)}}',
    /* DMF play */
    '.clutch-play{animation:clutch-play 3s ease-in-out infinite;transform-origin:200px 150px}',
    '@keyframes clutch-play{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(14deg)}}',
    /* sequential ticks (6 items) */
    [0, 1, 2, 3, 4, 5].map(function (i) {
      var a = 6 + i * 13;
      return '.clutch-t' + i + '{opacity:0;animation:clutch-t' + i + ' 9s linear infinite}' +
        '@keyframes clutch-t' + i + '{0%,' + a + '%{opacity:0}' + (a + 3) + '%,94%{opacity:1}100%{opacity:0}}';
    }).join('\n'),
    /* support: gearbox jack column rises, chain tightens */
    '.clutch-jack{animation:clutch-jack 8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes clutch-jack{0%,10%{transform:scaleY(.55)}40%,92%{transform:scaleY(1)}100%{transform:scaleY(.55)}}',
    '.clutch-chain{animation:clutch-chain 8s linear infinite}',
    '@keyframes clutch-chain{0%,45%{stroke:var(--a-muted)}52%,92%{stroke:var(--a-ok)}100%{stroke:var(--a-muted)}}',
    '.clutch-ok{opacity:0;animation:clutch-ok 8s linear infinite}',
    '@keyframes clutch-ok{0%,55%{opacity:0}60%,92%{opacity:1}100%{opacity:0}}',
    /* gearbox out / in 8 s */
    '.clutch-gbx{animation:clutch-gbx 8s ease-in-out infinite}',
    '@keyframes clutch-gbx{0%,12%{transform:translate(0,0)}42%,52%{transform:translate(70px,0)}80%,92%{transform:translate(70px,40px)}100%{transform:translate(0,0)}}',
    '.clutch-rev .clutch-gbx{animation-direction:reverse}',
    /* inspect magnifier 9 s */
    '.clutch-mag{animation:clutch-mag 9s ease-in-out infinite}',
    '@keyframes clutch-mag{0%,8%{transform:translate(0,0)}14%,36%{transform:translate(0,0)}44%,66%{transform:translate(140px,0)}74%,94%{transform:translate(280px,0)}100%{transform:translate(0,0)}}',
    '.clutch-i0{opacity:0;animation:clutch-i0 9s linear infinite}@keyframes clutch-i0{0%,16%{opacity:0}20%,96%{opacity:1}100%{opacity:0}}',
    '.clutch-i1{opacity:0;animation:clutch-i1 9s linear infinite}@keyframes clutch-i1{0%,46%{opacity:0}50%,96%{opacity:1}100%{opacity:0}}',
    '.clutch-i2{opacity:0;animation:clutch-i2 9s linear infinite}@keyframes clutch-i2{0%,76%{opacity:0}80%,96%{opacity:1}100%{opacity:0}}',
    /* bolt star (up to 9 bolts) 10 s */
    [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
      var a = 4 + i * 9.5;
      return '.clutch-n' + i + '{opacity:0;animation:clutch-n' + i + ' 10s linear infinite}' +
        '@keyframes clutch-n' + i + '{0%,' + a.toFixed(1) + '%{opacity:0}' + (a + 2).toFixed(1) + '%,94%{opacity:1}100%{opacity:0}}';
    }).join('\n'),
    /* alignment tool 6 s */
    '.clutch-tool{animation:clutch-tool 6s ease-in-out infinite}',
    '@keyframes clutch-tool{0%,10%{transform:translateX(150px)}55%,90%{transform:translateX(0)}100%{transform:translateX(150px)}}',
    '.clutch-disc{animation:clutch-disc 6s ease-in-out infinite}',
    '@keyframes clutch-disc{0%,35%{transform:translateY(10px)}55%,90%{transform:translateY(0)}100%{transform:translateY(10px)}}',
    /* SAC 7 s */
    '.clutch-fing{animation:clutch-fing 7s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes clutch-fing{0%,12%{transform:scale(1)}40%,85%{transform:scale(.78)}100%{transform:scale(1)}}',
    '.clutch-ring{animation:clutch-ring 7s ease-in-out infinite;transform-origin:200px 150px}',
    '@keyframes clutch-ring{0%,45%{transform:rotate(0)}70%,88%{transform:rotate(-24deg)}100%{transform:rotate(0)}}',
    '.clutch-press{animation:clutch-press 7s ease-in-out infinite}',
    '@keyframes clutch-press{0%,12%{transform:translateY(-30px)}40%,85%{transform:translateY(0)}100%{transform:translateY(-30px)}}',
    /* pedal pump 2.4 s */
    '.clutch-pedal{animation:clutch-pedal 2.4s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes clutch-pedal{0%,100%{transform:rotate(0)}45%,55%{transform:rotate(26deg)}}',
    '.clutch-bub{animation:clutch-bub 1.6s linear infinite;opacity:0}',
    '@keyframes clutch-bub{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-110px);opacity:0}}',
    '.clutch-bubbles{animation:clutch-bubbles 8s linear infinite}',
    '@keyframes clutch-bubbles{0%,60%{opacity:1}70%,100%{opacity:0}}',
    '.clutch-clear{opacity:0;animation:clutch-clear 8s linear infinite}',
    '@keyframes clutch-clear{0%,66%{opacity:0}72%,96%{opacity:1}100%{opacity:0}}',
    /* gear test 9 s: knob visits 1..6 */
    '.clutch-knob{animation:clutch-knob 9s steps(1,end) infinite}',
    '@keyframes clutch-knob{0%{transform:translate(0,0)}6%{transform:translate(-80px,-70px)}20%{transform:translate(-80px,70px)}34%{transform:translate(0,-70px)}48%{transform:translate(0,70px)}62%{transform:translate(80px,-70px)}76%{transform:translate(80px,70px)}90%,100%{transform:translate(0,0)}}',
    /* adaptation bar */
    '.clutch-bar{animation:clutch-bar 7s ease-in-out infinite;transform-box:fill-box;transform-origin:0 50%}',
    '@keyframes clutch-bar{0%,20%{transform:scaleX(0)}75%,100%{transform:scaleX(1)}}',
    '.clutch-d{animation:clutch-d 7s steps(1,end) infinite}',
    '@keyframes clutch-d{0%,25%{fill:var(--a-line)}25.1%,100%{fill:var(--a-accent)}}'
  ].join('\n'));

  /* ---------- helpers ---------- */
  function gauge(cx, cy, r, needleCls, title, redFrom) {
    var s = '<g transform="translate(' + cx + ',' + cy + ')"><circle class="k-dark" r="' + (r + 6) + '"/><circle class="k-ground" r="' + r + '"/>';
    for (var i = 0; i <= 10; i++) {
      var a = (-200 + i * 22) * Math.PI / 180;
      s += '<line class="' + (redFrom != null && i >= redFrom ? 's-danger' : 's-dark') + '" stroke-width="3" x1="' + (Math.cos(a) * (r - 4)).toFixed(1) + '" y1="' + (Math.sin(a) * (r - 4)).toFixed(1) +
        '" x2="' + (Math.cos(a) * (r - 14)).toFixed(1) + '" y2="' + (Math.sin(a) * (r - 14)).toFixed(1) + '"/>';
    }
    s += '<g class="' + needleCls + '"><line class="s-danger" stroke-width="4" stroke-linecap="round" x1="0" y1="0" x2="0" y2="' + (-(r - 12)) + '"/></g><circle class="k-dark" r="7"/>';
    s += '<text y="' + (r * 0.55) + '" text-anchor="middle" font-size="12" font-weight="700" class="k-text">' + S.esc(title) + '</text></g>';
    return s;
  }

  /** Front-view bolt ring with star order numbers. */
  function boltRing(n, rBolt, order, centerCls) {
    var cx = 200, cy = 150, s = '';
    s += '<circle class="' + (centerCls || 'k-metal') + '" cx="' + cx + '" cy="' + cy + '" r="' + (rBolt + 34) + '"/>';
    s += '<circle class="k-metal2" cx="' + cx + '" cy="' + cy + '" r="' + (rBolt - 18 > 12 ? rBolt - 18 : 14) + '"/>';
    var pos = [];
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / n;
      pos.push([cx + Math.cos(a) * rBolt, cy + Math.sin(a) * rBolt]);
      s += L.hex(pos[i][0], pos[i][1], 9, 'k-metal2');
    }
    order.forEach(function (b, k) {
      var p = pos[b];
      s += '<g class="clutch-n' + k + '"><circle class="k-accent" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="13"/>' +
        '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 5).toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="800" class="k-badgetext">' + (k + 1) + '</text></g>';
    });
    return s;
  }

  function sideLabels(ctx, items) {
    return items.map(function (it) { return L.label(it[0], it[1], ctx.t(it[2]), { bg: true, size: it[3] || 12, anchor: it[4] || 'middle', cls: it[5] }); }).join('');
  }

  /* ---------- clutch.layout ---------- */
  A.register('clutch.layout', {
    render: function (ctx) {
      var part = function (dx, inner) { return '<g class="clutch-exp" style="--dx:' + dx + 'px">' + inner + '</g>'; };
      var dmf = '<rect class="k-metal" x="130" y="60" width="22" height="180" rx="4"/>' +
        '<line class="s-dark" stroke-width="6" stroke-dasharray="3 3" x1="141" y1="60" x2="141" y2="240"/>';
      var disc = '<rect class="k-filler s-dark" stroke-width="1" x="174" y="78" width="10" height="144" rx="2"/><rect class="k-metal2" x="168" y="136" width="22" height="28" rx="3"/>';
      var plate = '<path class="k-metal2 s-dark" stroke-width="1" d="M200,64 L226,70 L226,230 L200,236 Z"/>' +
        '<path class="k-none s-dark" stroke-width="2" d="M210,100 L222,140 M210,200 L222,160 M210,120 L222,146 M210,180 L222,154"/>';
      var bearing = '<rect class="k-accent s-dark" stroke-width="1" x="246" y="126" width="18" height="48" rx="3"/>';
      var gbox = '<path class="k-body2 s-dark" stroke-width="1.5" d="M286,44 L336,44 L462,92 L462,214 L336,256 L286,256 Z"/>' +
        '<rect class="k-metal" x="250" y="146" width="40" height="8"/>';
      var s = L.ground(262) +
        '<rect class="k-metal2" x="20" y="60" width="94" height="180" rx="6"/>' +
        '<rect class="k-metal" opacity=".6" x="30" y="76" width="74" height="60" rx="4"/><rect class="k-metal" x="114" y="142" width="18" height="16"/>' +
        part(-6, dmf) + part(-22, disc) + part(-36, plate) + part(-58, bearing) + part(-72, gbox) +
        sideLabels(ctx, [
          [64, 22, { cs: 'Motor', en: 'Engine' }],
          [222, 22, { cs: 'Přítlačný talíř', en: 'Pressure plate' }],
          [116, 46, { cs: 'Setrvačník DMF', en: 'Dual-mass flywheel' }, 11],
          [176, 282, { cs: 'Lamela', en: 'Clutch disc' }],
          [276, 282, { cs: 'Vypínací ložisko', en: 'Release bearing' }, 11],
          [400, 282, { cs: 'Převodovka', en: 'Gearbox' }]
        ]);
      return L.svg(s, ctx.t({ cs: 'Rozložená spojka: motor, setrvačník, lamela, přítlačný talíř, ložisko, převodovka', en: 'Exploded clutch: engine, flywheel, disc, pressure plate, bearing, gearbox' }));
    }
  });

  /* ---------- clutch.symptoms ---------- */
  A.register('clutch.symptoms', {
    render: function (ctx) {
      var s = gauge(130, 140, 78, 'clutch-rpm', ctx.t({ cs: 'otáčky', en: 'rpm' }), 8) +
        gauge(350, 140, 78, 'clutch-spd', 'km/h') +
        L.arrow(196, 70, 196, 40, 'danger') + L.label(240, 30, ctx.t({ cs: '↑ otáčky', en: '↑ revs' }), { bg: true, cls: 'k-danger' }) +
        L.label(350, 232, ctx.t({ cs: 'rychlost skoro stejná', en: 'speed barely changes' }), { bg: true }) +
        L.label(16, 262, ctx.t({ cs: 'Otáčky rostou, auto nezrychluje = prokluz spojky', en: 'Revs rise, car does not accelerate = clutch slip' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Další: cukání při rozjezdu, klepání na volnoběh (DMF)', en: 'Also: judder on take-off, knocking at idle (DMF)' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Příznaky opotřebené spojky', en: 'Symptoms of a worn clutch' }));
    }
  });

  /* ---------- clutch.dmfCheck ---------- */
  A.register('clutch.dmfCheck', {
    render: function (ctx) {
      var s = '<circle class="k-dark" cx="200" cy="150" r="118"/>' +
        '<circle class="k-none s-metal" stroke-width="8" stroke-dasharray="4 4" cx="200" cy="150" r="112"/>' +
        '<circle class="k-metal2" cx="200" cy="150" r="104"/>' +
        '<line class="s-ok" stroke-width="3" x1="200" y1="46" x2="200" y2="64"/>' +
        '<g class="clutch-play"><circle class="k-metal" cx="200" cy="150" r="76"/><circle class="k-none s-muted" stroke-width="10" opacity=".5" cx="200" cy="150" r="58"/>' +
        '<line class="s-danger" stroke-width="4" x1="200" y1="74" x2="200" y2="96"/>' +
        [0, 1, 2, 3, 4, 5].map(function (i) { var a = i * Math.PI / 3; return '<circle class="k-dark" cx="' + (200 + Math.cos(a) * 30).toFixed(1) + '" cy="' + (150 + Math.sin(a) * 30).toFixed(1) + '" r="6"/>'; }).join('') +
        '<circle class="k-dark" cx="200" cy="150" r="14"/></g>' +
        L.rotArrow(200, 150, 92, 'cw', 'accent', 60) +
        L.label(340, 40, ctx.t({ cs: 'Kontrola DMF:', en: 'DMF check:' }), { anchor: 'start', bg: true }) +
        L.label(340, 76, ctx.t({ cs: '1. volné protočení', en: '1. free rotation' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(340, 100, ctx.t({ cs: '2. naklopení (axiálně)', en: '2. rocking (axial)' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(340, 124, ctx.t({ cs: '3. olej, přehřátí', en: '3. oil, overheating' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 290, ctx.t({ cs: 'Limity vůle dle tabulky výrobce DMF (LuK / Sachs)', en: 'Play limits per the DMF maker\'s table (LuK / Sachs)' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Kontrola vůle dvouhmotového setrvačníku', en: 'Checking dual-mass flywheel play' }));
    }
  });

  /* ---------- clutch.ancillary ---------- */
  A.register('clutch.ancillary', {
    render: function (ctx) {
      var items = [
        { cs: 'Baterie + držák baterie', en: 'Battery + battery tray' },
        { cs: 'Vzduchový filtr / sání', en: 'Airbox / intake' },
        { cs: 'Lanka řazení, konektory', en: 'Shift cables, connectors' },
        { cs: 'Startér', en: 'Starter motor' },
        { cs: 'Vedení spojky (zaškrtit)', en: 'Clutch line (clamp it)' },
        { cs: 'Poloosy / kloubové hřídele', en: 'Driveshafts' }
      ];
      var s = '<path class="k-body2 s-dark" stroke-width="1.5" d="M30,70 L90,70 L200,110 L200,220 L90,250 L30,250 Z"/>' +
        '<circle class="k-dark" cx="140" cy="200" r="16"/><circle class="k-metal" cx="140" cy="200" r="6"/>' +
        '<rect class="k-metal2" x="44" y="110" width="40" height="28" rx="6"/>' +
        '<line class="s-dark" stroke-width="4" x1="120" y1="96" x2="160" y2="60"/><line class="s-dark" stroke-width="4" x1="130" y1="100" x2="176" y2="70"/>';
      items.forEach(function (it, i) {
        var y = 52 + i * 38;
        s += '<rect class="k-labelbg" x="232" y="' + (y - 16) + '" width="236" height="28" rx="6"/>' +
          '<rect class="k-none s-muted" stroke-width="2" x="240" y="' + (y - 9) + '" width="16" height="16" rx="3"/>' +
          '<g class="clutch-t' + i + '"><path class="k-none s-ok" stroke-width="3.5" stroke-linecap="round" d="M242,' + (y) + ' L248,' + (y + 6) + ' L258,' + (y - 8) + '"/></g>' +
          L.label(266, y, ctx.t(it), { anchor: 'start', size: 12 });
      });
      s += L.label(16, 24, ctx.t({ cs: 'Postupně demontovat – fotit, značit, šrouby do sáčků', en: 'Remove step by step – photograph, label, bag the bolts' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Demontáž příslušenství před vyjmutím převodovky', en: 'Removing ancillaries before taking the gearbox out' }));
    }
  });

  /* ---------- clutch.support ---------- */
  A.register('clutch.support', {
    render: function (ctx) {
      var s = L.ground(286) +
        '<rect class="k-body" x="20" y="90" width="44" height="170" rx="6"/><rect class="k-body" x="416" y="90" width="44" height="170" rx="6"/>' +
        '<rect class="k-warn s-dark" stroke-width="1.5" x="14" y="70" width="452" height="14" rx="4"/>' +
        '<rect class="k-dark" x="24" y="84" width="30" height="8"/><rect class="k-dark" x="426" y="84" width="30" height="8"/>' +
        '<line class="clutch-chain" stroke-width="5" stroke-dasharray="6 4" x1="190" y1="84" x2="190" y2="124"/>' +
        '<circle class="k-none s-dark" stroke-width="4" cx="190" cy="128" r="6"/>' +
        '<rect class="k-metal2" x="120" y="132" width="140" height="110" rx="8"/>' +
        '<path class="k-body2 s-dark" stroke-width="1.5" d="M260,146 L340,160 L340,226 L260,236 Z"/>' +
        L.label(190, 192, ctx.t({ cs: 'Motor', en: 'Engine' }), { size: 12 }) + L.label(300, 196, ctx.t({ cs: 'Převodovka', en: 'Gearbox' }), { size: 11 }) +
        // gearbox jack
        '<rect class="k-danger s-dark" stroke-width="1.5" x="270" y="276" width="70" height="10" rx="3"/>' +
        '<g class="clutch-jack"><rect class="k-metal s-dark" stroke-width="1.5" x="298" y="230" width="14" height="46"/>' +
        '<path class="k-danger s-dark" stroke-width="1.5" d="M280,224 L330,224 L330,232 L280,232 Z"/></g>' +
        '<g class="clutch-ok">' + L.check(440, 40) + '</g>' +
        L.label(240, 30, ctx.t({ cs: 'Podpěra motoru přes blatníky + zvedák převodovky', en: 'Engine support bar over the wings + gearbox jack' }), { bg: true, size: 12 }) +
        L.warnIcon(30, 52) + L.label(52, 56, ctx.t({ cs: 'Nikdy pod nezajištěnou převodovkou!', en: 'Never under an unsupported gearbox!' }), { anchor: 'start', bg: true, size: 12, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Podepření motoru a převodovky', en: 'Supporting engine and gearbox' }));
    }
  });

  /* ---------- clutch.gearboxOut / gearboxIn ---------- */
  function gbScene(ctx, rev) {
    var s = '<g class="' + (rev ? 'clutch-rev' : '') + '">' + L.ground(286) +
      '<rect class="k-metal2" x="20" y="70" width="170" height="160" rx="8"/>' +
      '<rect class="k-metal" x="190" y="80" width="16" height="140" rx="3"/><rect class="k-filler" x="208" y="92" width="8" height="116"/>' +
      '<g class="clutch-gbx"><rect class="k-metal" x="180" y="146" width="60" height="8"/>' +
      '<path class="k-body2 s-dark" stroke-width="1.5" d="M226,70 L270,70 L400,110 L400,206 L270,236 L226,236 Z"/>' +
      L.badge(320, 160, ctx.t({ cs: '~40–50 kg', en: '~40–50 kg' }), 'warn') +
      '<rect class="k-danger s-dark" stroke-width="1.5" x="270" y="236" width="80" height="8" rx="2"/><rect class="k-metal s-dark" stroke-width="1.5" x="302" y="244" width="16" height="32"/>' +
      '</g><rect class="k-danger s-dark" stroke-width="1.5" x="260" y="276" width="100" height="10" rx="3"/>' +
      '</g>';
    s += L.label(16, 24, ctx.t(rev
      ? { cs: 'Nasadit rovně v ose – drážky hřídele do lamely', en: 'Slide in straight – shaft splines into the disc' }
      : { cs: 'Odtáhnout rovně v ose, pak spustit', en: 'Pull straight back along the axis, then lower' }), { anchor: 'start', bg: true });
    s += L.label(16, 50, ctx.t(rev
      ? { cs: 'Nikdy nedotahovat převodovku šrouby „k motoru“!', en: 'Never pull the gearbox in with the bolts!' }
      : { cs: 'Převodovka nesmí viset na hřídeli', en: 'The gearbox must not hang on its input shaft' }), { anchor: 'start', bg: true, size: 12, cls: 'k-danger' });
    return s;
  }
  A.register('clutch.gearboxOut', { render: function (ctx) { return L.svg(gbScene(ctx, false), ctx.t({ cs: 'Vyjmutí převodovky', en: 'Removing the gearbox' })); } });
  A.register('clutch.gearboxIn', { render: function (ctx) { return L.svg(gbScene(ctx, true), ctx.t({ cs: 'Montáž převodovky', en: 'Refitting the gearbox' })); } });

  /* ---------- clutch.inspect ---------- */
  A.register('clutch.inspect', {
    render: function (ctx) {
      var s = '<circle class="k-metal2" cx="100" cy="140" r="60"/><circle class="k-dark" cx="100" cy="140" r="22"/><circle class="k-none s-dark" stroke-width="5" cx="100" cy="140" r="30"/>' +
        L.drops(108, 172, 3, 50, 'k-oil') +
        '<rect class="k-metal" x="196" y="126" width="88" height="28" rx="4"/>' +
        [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return '<rect class="k-dark" x="' + (226 + i * 7) + '" y="126" width="3" height="28"/>'; }).join('') +
        '<circle class="k-metal" cx="380" cy="140" r="62"/><circle class="k-dark" cx="380" cy="140" r="18"/>' +
        '<ellipse class="k-fluid" opacity=".7" cx="360" cy="112" rx="14" ry="8"/><ellipse class="k-fluid" opacity=".6" cx="406" cy="160" rx="10" ry="6"/>' +
        '<g class="clutch-mag"><g transform="translate(100,140)"><circle class="k-none s-accent" stroke-width="5" r="38"/><line class="s-accent" stroke-width="8" stroke-linecap="round" x1="28" y1="28" x2="50" y2="50"/></g></g>' +
        '<g class="clutch-i0">' + L.label(100, 236, ctx.t({ cs: 'Gufero kliky teče? → vyměnit', en: 'Crank seal leaking? → replace' }), { bg: true, size: 11 }) + '</g>' +
        '<g class="clutch-i1">' + L.label(240, 266, ctx.t({ cs: 'Drážky hřídele, vodítko ložiska', en: 'Shaft splines, bearing guide' }), { bg: true, size: 11 }) + '</g>' +
        '<g class="clutch-i2">' + L.label(380, 236, ctx.t({ cs: 'Modré skvrny, praskliny', en: 'Blue spots, cracks' }), { bg: true, size: 11 }) + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Než namontujete nové díly: kontrola okolí', en: 'Before fitting new parts: inspect the surroundings' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Kontrola gufera, drážek a setrvačníku', en: 'Inspecting crank seal, splines and flywheel' }));
    }
  });

  /* ---------- bolts ---------- */
  A.register('clutch.dmfBolts', {
    render: function (ctx) {
      var s = '<circle class="k-none s-dark" stroke-width="8" stroke-dasharray="4 4" cx="200" cy="150" r="104"/>' + boltRing(6, 52, [0, 3, 1, 4, 2, 5], 'k-metal') +
        L.label(340, 60, ctx.t({ cs: 'NOVÉ šrouby', en: 'NEW bolts' }), { anchor: 'start', bg: true, cls: 'k-danger' }) +
        L.label(340, 90, ctx.t({ cs: 'do kříže', en: 'star pattern' }), { anchor: 'start', bg: true }) +
        L.label(340, 120, ctx.t({ cs: 'moment + úhel', en: 'torque + angle' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Závity odmastit, zajištění dle návodu výrobce', en: 'Degrease threads, thread lock per maker\'s instructions' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Dotažení šroubů setrvačníku do kříže', en: 'Torquing flywheel bolts in a star pattern' }));
    }
  });

  A.register('clutch.plateBolts', {
    render: function (ctx) {
      var s = boltRing(6, 100, [0, 3, 1, 4, 2, 5], 'k-metal2') +
        '<circle class="k-metal" cx="200" cy="150" r="64"/>' +
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) { var a = i * Math.PI / 6; return '<line class="s-dark" stroke-width="3" x1="' + (200 + Math.cos(a) * 22).toFixed(1) + '" y1="' + (150 + Math.sin(a) * 22).toFixed(1) + '" x2="' + (200 + Math.cos(a) * 60).toFixed(1) + '" y2="' + (150 + Math.sin(a) * 60).toFixed(1) + '"/>'; }).join('') +
        '<circle class="k-dark" cx="200" cy="150" r="16"/>' +
        L.label(330, 40, ctx.t({ cs: 'Postupně do kříže', en: 'Gradually, star pattern' }), { anchor: 'start', bg: true }) +
        L.label(330, 70, ctx.t({ cs: 'po 1–2 otáčkách', en: '1–2 turns at a time' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Talíř se stáhne rovnoměrně, lamela zůstane vystředěná', en: 'Plate pulls down evenly, disc stays centred' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Dotažení přítlačného talíře', en: 'Tightening the pressure plate' }));
    }
  });

  /* ---------- clutch.align ---------- */
  A.register('clutch.align', {
    render: function (ctx) {
      var s = '<rect class="k-metal2" x="20" y="50" width="90" height="200" rx="6"/>' +
        '<rect class="k-metal" x="110" y="50" width="24" height="200" rx="4"/><circle class="k-dark" cx="122" cy="150" r="8"/>' +
        '<g class="clutch-disc"><rect class="k-filler s-dark" stroke-width="1" x="150" y="76" width="10" height="148" rx="2"/>' +
        '<rect class="k-metal2" x="144" y="134" width="24" height="32" rx="3"/></g>' +
        '<g class="clutch-tool"><path class="k-warn s-dark" stroke-width="1.5" d="M118,146 L170,142 L330,140 L330,160 L170,158 L118,154 Z"/>' +
        '<rect class="k-dark" x="300" y="132" width="60" height="36" rx="6"/></g>' +
        L.label(16, 24, ctx.t({ cs: 'Středicí trn vystředí lamelu k ložisku v klice', en: 'The alignment tool centres the disc on the crank pilot' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Nápis „Getriebeseite / Gearbox side“ k převodovce!', en: '"Getriebeseite / Gearbox side" faces the gearbox!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Vystředění lamely trnem', en: 'Centring the clutch disc with the tool' }));
    }
  });

  /* ---------- clutch.sac ---------- */
  A.register('clutch.sac', {
    render: function (ctx) {
      var s = '<g transform="translate(-64,0)"><circle class="k-metal2" cx="200" cy="150" r="118"/>' +
        '<g class="clutch-ring"><circle class="k-none s-accent" stroke-width="10" stroke-dasharray="26 8" cx="200" cy="150" r="100"/></g>' +
        '<g class="clutch-fing"><circle class="k-metal" cx="200" cy="150" r="80"/>' +
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(function (i) { var a = i * Math.PI / 9; return '<line class="s-dark" stroke-width="3" x1="' + (200 + Math.cos(a) * 24).toFixed(1) + '" y1="' + (150 + Math.sin(a) * 24).toFixed(1) + '" x2="' + (200 + Math.cos(a) * 76).toFixed(1) + '" y2="' + (150 + Math.sin(a) * 76).toFixed(1) + '"/>'; }).join('') + '</g>' +
        '<g class="clutch-press"><rect class="k-dark" x="186" y="40" width="28" height="100" rx="4"/><rect class="k-warn s-dark" stroke-width="1.5" x="166" y="130" width="68" height="16" rx="4"/></g></g>' +
        L.label(282, 60, ctx.t({ cs: '1. stlačit pera přípravkem', en: '1. compress fingers with tool' }), { anchor: 'start', bg: true, size: 11 }) +
        L.label(282, 88, ctx.t({ cs: '2. kroužek vrátit zpět', en: '2. turn back adjuster ring' }), { anchor: 'start', bg: true, size: 11 }) +
        L.label(282, 116, ctx.t({ cs: '3. zajistit / montovat', en: '3. lock / fit' }), { anchor: 'start', bg: true, size: 11 }) +
        L.warnIcon(30, 278) + L.label(52, 282, ctx.t({ cs: 'SAC bez přípravku = zničený talíř', en: 'SAC without the tool = ruined plate' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Samostavitelný přítlačný talíř (SAC)', en: 'Self-adjusting clutch pressure plate (SAC)' }));
    }
  });

  /* ---------- clutch.bleed ---------- */
  A.register('clutch.bleed', {
    render: function (ctx) {
      var s = '<rect class="k-metal2" x="40" y="40" width="60" height="16" rx="4"/>' +
        '<g transform="translate(70,48)"><g class="clutch-pedal"><line class="s-dark" stroke-width="10" stroke-linecap="round" x1="0" y1="0" x2="30" y2="170"/>' +
        '<rect class="k-dark" x="12" y="164" width="44" height="18" rx="5" transform="rotate(-10 34 173)"/></g></g>' +
        L.label(80, 270, ctx.t({ cs: 'Pedál sešlápnout a držet', en: 'Press and hold the pedal' }), { bg: true, size: 12 }) +
        // slave + nipple + tube + bottle
        '<rect class="k-metal" x="230" y="60" width="110" height="50" rx="8"/><rect class="k-metal2" x="330" y="74" width="20" height="22"/>' +
        L.hex(358, 85, 8, 'k-metal') +
        '<path class="k-none s-fluid" stroke-width="8" opacity=".55" d="M366,85 Q420,85 420,140 L420,230"/>' +
        '<g class="clutch-bubbles">' + [0, 1, 2, 3].map(function (i) { return '<g transform="translate(420,230)"><circle class="k-white clutch-bub" style="animation-delay:' + (i * 0.4) + 's" r="4"/></g>'; }).join('') + '</g>' +
        '<rect class="k-none s-muted" stroke-width="3" x="390" y="210" width="62" height="70" rx="6"/><rect class="k-fluid" opacity=".6" x="393" y="246" width="56" height="32"/>' +
        '<g class="clutch-clear">' + L.check(440, 40) + L.label(420, 44, ctx.t({ cs: 'bez bublin', en: 'no bubbles' }), { anchor: 'end', bg: true }) + '</g>' +
        L.label(240, 140, ctx.t({ cs: 'Povolit odvzdušňovák', en: 'Open bleed nipple' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 20, ctx.t({ cs: 'Nádržka nesmí klesnout pod MIN', en: 'Reservoir must not drop below MIN' }), { anchor: 'start', bg: true, size: 12, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Odvzdušnění hydrauliky spojky', en: 'Bleeding the clutch hydraulics' }));
    }
  });

  /* ---------- clutch.test ---------- */
  A.register('clutch.test', {
    render: function (ctx) {
      var cx = 200, cy = 150, s = '<path class="k-none s-line" stroke-width="10" stroke-linecap="round" d="M120,80 L120,220 M200,80 L200,220 M280,80 L280,220 M120,150 L280,150"/>';
      [[120, 72, '1'], [120, 236, '2'], [200, 72, '3'], [200, 236, '4'], [280, 72, '5'], [280, 236, '6']].forEach(function (g, i) {
        s += L.label(g[0] - 22, g[1] + 2, g[2], { size: 16, cls: 'k-muted' }) + '<g class="clutch-t' + i + '">' + L.check(g[0] + 22, g[1], '') + '</g>';
      });
      s += '<g transform="translate(' + cx + ',' + cy + ')"><g class="clutch-knob"><circle class="k-dark" r="18"/><circle class="k-accent" r="8"/></g></g>' +
        L.label(330, 120, ctx.t({ cs: 'Všechny rychlosti', en: 'All gears' }), { anchor: 'start', bg: true }) +
        L.label(330, 146, ctx.t({ cs: 'bez drhnutí a hluku', en: 'no grinding, no noise' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 24, ctx.t({ cs: 'Záběr cca v polovině zdvihu pedálu', en: 'Bite point roughly mid-travel' }), { anchor: 'start', bg: true }) +
        L.label(16, 290, ctx.t({ cs: 'Prvních ~500 km šetrně – bez prudkých rozjezdů', en: 'First ~500 km gently – no hard launches' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Zkouška řazení po výměně spojky', en: 'Gear shift test after clutch replacement' }));
    }
  });

  /* ---------- clutch.auto (automatic cars) ---------- */
  A.register('clutch.auto', {
    render: function (ctx) {
      var tool = ctx.vehicle === 'mb-cl500-c216' ? 'XENTRY' : ctx.vehicle === 'volvo-xc60-b4' ? 'VIDA' : ctx.t({ cs: 'Diagnostika', en: 'Scan tool' });
      var s = '<rect class="k-dark" x="40" y="50" width="110" height="200" rx="18"/>';
      ['P', 'R', 'N', 'D'].forEach(function (g, i) {
        s += '<text x="95" y="' + (96 + i * 44) + '" text-anchor="middle" font-size="26" font-weight="800" class="' + (g === 'D' ? 'clutch-d' : 'k-line') + '">' + g + '</text>';
      });
      s += '<rect class="k-dark" x="200" y="60" width="250" height="170" rx="16"/><rect class="k-ground" x="214" y="74" width="222" height="142" rx="8"/>' +
        L.label(325, 100, tool, { size: 15 }) +
        L.label(325, 130, ctx.t({ cs: 'Adaptace převodovky', en: 'Transmission adaptation' }), { size: 12 }) +
        '<rect class="k-line" x="236" y="160" width="178" height="12" rx="6"/><g class="clutch-bar"><rect class="k-ok" x="236" y="160" width="178" height="12" rx="6"/></g>' +
        L.label(325, 196, ctx.t({ cs: 'kódy · teplota ATF · adaptace', en: 'codes · ATF temp · adaptation' }), { size: 11, cls: 'k-muted' }) +
        L.label(16, 24, ctx.t({ cs: 'Automat: žádná spojka s pedálem', en: 'Automatic: no pedal-operated clutch' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Diagnostika + stav ATF = první krok', en: 'Diagnostics + ATF condition = first step' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Automatická převodovka – diagnostika', en: 'Automatic transmission – diagnostics' }));
    }
  });
})(window.STU);
