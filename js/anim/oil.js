/* Animations: engine oil & filter change. */
(function (S) {
  'use strict';
  var L = S.animLib, A = S.anim;

  var CAP = {
    'generic': { cs: 'dle příručky', en: 'per manual' },
    'mb-cl500-c216': { cs: '≈ 8,0 l', en: '≈ 8.0 L' },
    'volvo-xc60-b4': { cs: '≈ 5,2–5,9 l', en: '≈ 5.2–5.9 L' },
    'skoda-octavia-rs-tdi': { cs: '≈ 4,3 l', en: '≈ 4.3 L' },
    'toyota-gr-yaris': { cs: '≈ 4,5 l', en: '≈ 4.5 L' }
  };
  var PLUG = {
    'generic': { cs: 'dle příručky', en: 'per manual' },
    'mb-cl500-c216': '30 Nm',
    'volvo-xc60-b4': { cs: 'dle VIDA', en: 'per VIDA' },
    'skoda-octavia-rs-tdi': '30 Nm',
    'toyota-gr-yaris': { cs: 'dle TIS', en: 'per TIS' }
  };

  A.css('oil', [
    /* drain 8 s */
    '.oil-wr{animation:oil-wr 8s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes oil-wr{0%,4%{transform:rotate(0);opacity:1}14%{transform:rotate(-60deg);opacity:1}18%{transform:rotate(0);opacity:1}26%{transform:rotate(-60deg);opacity:1}30%,95%{opacity:0}100%{opacity:1;transform:rotate(0)}}',
    '.oil-plugout{animation:oil-plugout 8s ease-in infinite}',
    '@keyframes oil-plugout{0%,26%{transform:translate(0,0);opacity:1}32%{transform:translate(22px,0);opacity:1}40%{transform:translate(40px,40px);opacity:0}96%{transform:translate(0,0);opacity:0}100%{opacity:1}}',
    '.oil-stream{stroke-dasharray:10 8;animation:oil-flow .5s linear infinite,oil-streamvis 8s linear infinite}',
    '@keyframes oil-flow{to{stroke-dashoffset:-18}}',
    '@keyframes oil-streamvis{0%,30%{opacity:0}34%,82%{opacity:1}92%,100%{opacity:0}}',
    '.oil-sump{animation:oil-sump 8s linear infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes oil-sump{0%,32%{transform:scaleY(1)}88%,96%{transform:scaleY(.08)}100%{transform:scaleY(1)}}',
    '.oil-pan{animation:oil-pan 8s linear infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes oil-pan{0%,34%{transform:scaleY(.05)}90%,96%{transform:scaleY(1)}100%{transform:scaleY(.05)}}',
    /* plug refit 6 s */
    '.oil-washer{animation:oil-washer 6s ease-in-out infinite}',
    '@keyframes oil-washer{0%{transform:translateX(90px);opacity:0}15%,100%{transform:translateX(0);opacity:1}}',
    '.oil-plugin{animation:oil-plugin 6s ease-in-out infinite}',
    '@keyframes oil-plugin{0%,20%{transform:translateX(60px)}50%,100%{transform:translateX(0)}}',
    '.oil-tw{animation:oil-tw 6s ease-in-out infinite;opacity:0;transform-origin:0 0}',
    '@keyframes oil-tw{0%,52%{opacity:0;transform:rotate(0)}58%{opacity:1;transform:rotate(0)}74%,86%{opacity:1;transform:rotate(40deg)}100%{opacity:0;transform:rotate(40deg)}}',
    '.oil-click{animation:oil-click 6s linear infinite;opacity:0}',
    '@keyframes oil-click{0%,74%{opacity:0}76%,92%{opacity:1}100%{opacity:0}}',
    /* cartridge filter 9 s */
    '.oil-cap{animation:oil-cap 9s ease-in-out infinite}',
    '@keyframes oil-cap{0%,8%{transform:translateY(0)}24%,80%{transform:translateY(-70px)}94%,100%{transform:translateY(0)}}',
    '.oil-oldcart{animation:oil-oldcart 9s ease-in-out infinite}',
    '@keyframes oil-oldcart{0%,8%{transform:translateY(0);opacity:1}24%{transform:translateY(-70px);opacity:1}36%,100%{transform:translate(160px,-70px);opacity:0}}',
    '.oil-newcart{animation:oil-newcart 9s ease-in-out infinite;opacity:0}',
    '@keyframes oil-newcart{0%,40%{transform:translate(-160px,-70px);opacity:0}52%{transform:translate(0,-70px);opacity:1}62%,80%{transform:translate(0,0);opacity:1}94%{opacity:1}100%{opacity:0}}',
    '.oil-oring{animation:oil-oring 9s linear infinite}',
    '@keyframes oil-oring{0%,40%{fill:var(--a-dark)}46%,80%{fill:var(--a-ok)}100%{fill:var(--a-dark)}}',
    /* spin-on 8 s */
    '.oil-spin{animation:oil-spin 8s ease-in-out infinite}',
    '@keyframes oil-spin{0%,10%{transform:translateY(0)}35%,60%{transform:translateY(60px);opacity:1}62%{opacity:0;transform:translateY(60px)}64%{opacity:1;transform:translateY(60px)}90%,100%{transform:translateY(0)}}',
    '.oil-gasket{animation:oil-gasket 8s linear infinite}',
    '@keyframes oil-gasket{0%,62%{fill:var(--a-dark)}66%,100%{fill:var(--a-oil)}}',
    /* fill 8 s */
    '.oil-bottle{animation:oil-bottle 8s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes oil-bottle{0%,8%{transform:rotate(0)}22%,80%{transform:rotate(-110deg)}94%,100%{transform:rotate(0)}}',
    '.oil-pour{stroke-dasharray:8 6;animation:oil-flow .45s linear infinite,oil-pourvis 8s linear infinite}',
    '@keyframes oil-pourvis{0%,22%{opacity:0}26%,78%{opacity:1}82%,100%{opacity:0}}',
    '.oil-fillsump{animation:oil-fillsump 8s linear infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes oil-fillsump{0%,26%{transform:scaleY(.08)}80%,96%{transform:scaleY(1)}100%{transform:scaleY(.08)}}',
    /* dipstick 6 s */
    '.oil-dip{animation:oil-dip 6s ease-in-out infinite}',
    '@keyframes oil-dip{0%,10%{transform:translateY(-120px);opacity:.3}30%,100%{transform:translateY(0);opacity:1}}',
    '.oil-film{animation:oil-film 6s ease-out infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes oil-film{0%,30%{transform:scaleY(0)}55%,100%{transform:scaleY(1)}}',
    /* warm 6 s */
    '.oil-needle{animation:oil-needle 6s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes oil-needle{0%,8%{transform:rotate(-70deg)}70%,92%{transform:rotate(-15deg)}100%{transform:rotate(-70deg)}}',
    '.oil-heat{animation:oil-heat 6s ease-in-out infinite}',
    '@keyframes oil-heat{0%,10%{opacity:0;transform:translateY(0)}60%{opacity:.8}100%{opacity:0;transform:translateY(-30px)}}',
    /* cap off 5 s */
    '.oil-fcap{animation:oil-fcap 5s ease-in-out infinite}',
    '@keyframes oil-fcap{0%,15%{transform:translate(0,0)}45%,80%{transform:translate(70px,-40px)}100%{transform:translate(0,0)}}',
    /* check 8 s */
    '.oil-lamp{animation:oil-lamp 8s steps(1,end) infinite}',
    '@keyframes oil-lamp{0%,25%{fill:var(--a-danger)}25.1%,100%{fill:var(--a-line)}}', '.oil-lamp path,.oil-lamp rect{fill:inherit}',
    '.oil-ok1{animation:oil-ok 8s linear infinite;opacity:0}',
    '@keyframes oil-ok{0%,30%{opacity:0}36%,96%{opacity:1}100%{opacity:0}}',
    '.oil-scan{animation:oil-scan 8s ease-in-out infinite}',
    '@keyframes oil-scan{0%,35%{transform:translate(0,0)}55%{transform:translate(70px,0)}75%,100%{transform:translate(140px,0)}}',
    '.oil-ok2{animation:oil-ok2 8s linear infinite;opacity:0}',
    '@keyframes oil-ok2{0%,56%{opacity:0}60%,96%{opacity:1}100%{opacity:0}}',
    '.oil-ok3{animation:oil-ok3 8s linear infinite;opacity:0}',
    '@keyframes oil-ok3{0%,76%{opacity:0}80%,96%{opacity:1}100%{opacity:0}}',
    /* reset 6 s */
    '.oil-bar{animation:oil-bar 6s ease-in-out infinite;transform-box:fill-box;transform-origin:0 50%}',
    '@keyframes oil-bar{0%,20%{transform:scaleX(0)}70%,100%{transform:scaleX(1)}}',
    '.oil-done{animation:oil-done 6s linear infinite;opacity:0}',
    '@keyframes oil-done{0%,72%{opacity:0}76%,96%{opacity:1}100%{opacity:0}}'
  ].join('\n'));

  /* ---- engine schematic (side view). sumpCls animates the oil level in the pan ---- */
  function engine(opts) {
    opts = opts || {};
    var s = '<g transform="' + (opts.tf || 'translate(0,22)') + '">';
    // valve cover + filler cap
    s += '<path class="k-dark" d="M168,62 Q168,44 186,44 L296,44 Q312,44 312,62 Z"/>';
    if (!opts.noCap) s += '<g class="' + (opts.capCls || '') + '"><rect class="k-warn s-dark" stroke-width="1.5" x="190" y="30" width="30" height="16" rx="4"/></g>';
    // head + block
    s += '<rect class="k-metal" x="160" y="62" width="160" height="30" rx="4"/>';
    s += '<rect class="k-metal2" x="150" y="92" width="180" height="108" rx="6"/>';
    // cylinders hint
    for (var i = 0; i < 4; i++) s += '<rect class="k-metal" opacity=".55" x="' + (166 + i * 40) + '" y="100" width="30" height="60" rx="4"/>';
    // dipstick tube
    if (!opts.noDip) s += '<line class="s-dark" stroke-width="5" x1="328" y1="150" x2="350" y2="40"/><circle class="k-warn s-dark" stroke-width="1.5" cx="352" cy="32" r="9"/>';
    // oil pan with sump oil
    s += '<path class="k-dark" d="M156,200 L324,200 L314,252 L166,252 Z"/>';
    s += '<g class="' + (opts.sumpCls || '') + '"><path class="k-oil" d="M164,222 L318,222 L313,248 L169,248 Z"/></g>';
    return s + '</g>';
  }

  A.register('oil.warm', {
    render: function (ctx) {
      var s = L.ground(296) + engine() +
        '<g class="oil-heat"><path class="k-none s-danger" stroke-width="3" stroke-linecap="round" d="M250,62 q-8,-10 0,-20 q8,-10 0,-20"/><path class="k-none s-danger" stroke-width="3" stroke-linecap="round" d="M290,62 q-8,-10 0,-20 q8,-10 0,-20"/></g>' +
        '<g transform="translate(410,120)"><circle class="k-dark" r="48"/><circle class="k-metal" r="42"/>' +
        '<path class="k-none s-ok" stroke-width="8" d="M-30,-29 A42,42 0 0 1 10,-41"/><path class="k-none s-danger" stroke-width="8" d="M24,-34 A42,42 0 0 1 40,-12"/>' +
        '<g class="oil-needle"><line class="s-dark" stroke-width="4" stroke-linecap="round" x1="0" y1="0" x2="0" y2="-36"/></g><circle class="k-dark" r="6"/>' +
        '<text y="28" text-anchor="middle" font-size="12" font-weight="700" class="k-dark">°C</text></g>' +
        L.label(410, 186, ctx.t({ cs: '2–5 min volnoběh', en: '2–5 min idle' }), { bg: true }) +
        L.label(16, 24, ctx.t({ cs: 'Teplý olej (ne horký) lépe vyteče', en: 'Warm (not hot) oil drains better' }), { anchor: 'start', bg: true }) +
        L.warnIcon(40, 282) + L.label(64, 286, ctx.t({ cs: 'Výfuk a olej pálí – rukavice!', en: 'Exhaust and oil burn – gloves!' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Zahřátí motoru', en: 'Warming up the engine' }));
    }
  });

  A.register('oil.capOff', {
    render: function (ctx) {
      var s = engine({ capCls: 'oil-fcap' }) +
        L.arrow(205, 38, 205, 58, 'fluid') +
        L.label(16, 286, ctx.t({ cs: 'Víčko povolit → olej vytéká rychleji (vzduch)', en: 'Open the cap → oil drains faster (air in)' }), { anchor: 'start', bg: true }) +
        L.label(16, 24, ctx.t({ cs: 'Víčko odložte na viditelné místo', en: 'Keep the cap somewhere visible' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Otevření víčka plnicího hrdla', en: 'Opening the oil filler cap' }));
    }
  });

  A.register('oil.drain', {
    render: function (ctx) {
      var s = L.ground(298) + engine({ sumpCls: 'oil-sump' }) +
        // drain pan
        '<path class="k-dark" d="M350,274 L462,274 L454,298 L358,298 Z"/>' +
        '<g class="oil-pan"><rect class="k-oil" x="360" y="278" width="94" height="18"/></g>' +
        // stream
        '<path class="k-none s-oil oil-stream" stroke-width="7" stroke-linecap="round" d="M318,262 Q370,258 404,284"/>' +
        // plug + wrench
        '<g transform="translate(318,262)"><g class="oil-plugout">' + L.hex(6, 0, 8, 'k-metal') + '</g></g>' +
        '<g transform="translate(324,262)"><g class="oil-wr">' + '<g transform="rotate(-90)">' + L.wrench(90) + '</g></g></g>' +
        L.label(16, 24, ctx.t({ cs: 'Vypouštěcí šroub: proti směru hod. ručiček', en: 'Drain plug: counter-clockwise' }), { anchor: 'start', bg: true }) +
        L.warnIcon(36, 128) + L.label(16, 160, ctx.t({ cs: 'Horký olej!', en: 'Hot oil!' }), { anchor: 'start', bg: true, cls: 'k-danger' }) +
        L.label(16, 184, ctx.t({ cs: 'Šroub rychle', en: 'Pull plug' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 206, ctx.t({ cs: 'odtáhnout', en: 'away fast' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Vypuštění oleje', en: 'Draining the oil' }));
    }
  });

  A.register('oil.plug', {
    render: function (ctx) {
      var tq = PLUG[ctx.vehicle] || PLUG.generic;
      var s = '<rect class="k-metal2" x="120" y="40" width="80" height="220"/>' +
        '<rect class="k-dark" x="190" y="130" width="10" height="40"/>' +
        '<rect class="k-oil" x="120" y="180" width="70" height="80" opacity=".5"/>' +
        '<g class="oil-plugin"><g transform="translate(202,150)">' +
        '<rect class="k-metal" x="0" y="-14" width="34" height="28" rx="2"/>' +
        '<line class="s-dark" stroke-width="2" x1="4" y1="-14" x2="4" y2="14"/><line class="s-dark" stroke-width="2" x1="10" y1="-14" x2="10" y2="14"/><line class="s-dark" stroke-width="2" x1="16" y1="-14" x2="16" y2="14"/>' +
        '<g class="oil-washer"><rect class="k-accent" x="34" y="-20" width="6" height="40" rx="2"/></g>' +
        '<rect class="k-metal2 s-dark" stroke-width="1.5" x="40" y="-20" width="20" height="40" rx="3"/></g></g>' +
        '<g transform="translate(252,150)"><g class="oil-tw">' + L.torqueWrench(170) + '</g></g>' +
        '<g class="oil-click">' + L.badge(330, 250, ctx.t({ cs: 'klik! ', en: 'click! ' }) + ctx.t(tq), 'accent') + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Vždy nové těsnění (podložka) šroubu', en: 'Always a new plug seal (washer)' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Nejdřív rukou, pak momentovým klíčem', en: 'By hand first, then torque wrench' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Zašroubování vypouštěcího šroubu', en: 'Refitting the drain plug' }));
    }
  });

  A.register('oil.filterCart', {
    render: function (ctx) {
      var pleats = function (cls) {
        var p = '<rect class="' + cls + '" x="-30" y="0" width="60" height="96" rx="4"/>';
        for (var i = -24; i <= 24; i += 8) p += '<line class="s-dark" stroke-width="1.5" opacity=".5" x1="' + i + '" y1="4" x2="' + i + '" y2="92"/>';
        return p + '<rect class="k-dark" x="-8" y="0" width="16" height="96" opacity=".35"/>';
      };
      var s = '<rect class="k-metal2" x="60" y="250" width="420" height="40"/><g transform="translate(70,0)">' +
        // housing
        '<path class="k-metal" d="M180,140 L300,140 L296,250 L184,250 Z"/>' +
        '<rect class="k-dark" x="194" y="146" width="92" height="104" opacity=".55"/>' +
        // old cartridge
        '<g class="oil-oldcart"><g transform="translate(240,150)">' + pleats('k-rust') + '</g></g>' +
        // new cartridge
        '<g class="oil-newcart"><g transform="translate(240,150)">' + pleats('k-filler') + '</g></g>' +
        // cap
        '<g class="oil-cap"><rect class="k-metal s-dark" stroke-width="1.5" x="176" y="112" width="128" height="30" rx="6"/>' +
        L.hex(240, 100, 16, 'k-metal2') + '<rect class="oil-oring" x="182" y="140" width="116" height="6" rx="3"/></g>' +
        L.rotArrow(240, 100, 30, 'ccw', 'accent', 200) + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Víko filtru povolit, vložku vyměnit', en: 'Unscrew the housing cap, swap the element' }), { anchor: 'start', bg: true }) +
        L.label(464, 286, ctx.t({ cs: 'Nové O-kroužky namazat olejem', en: 'Oil the new O-rings' }), { anchor: 'end', bg: true, cls: 'k-ok' });
      return L.svg(s, ctx.t({ cs: 'Výměna vložky olejového filtru', en: 'Replacing the oil filter element' }));
    }
  });

  A.register('oil.filterSpin', {
    render: function (ctx) {
      var s = '<rect class="k-metal2" x="80" y="20" width="320" height="70"/>' +
        '<rect class="k-metal" x="200" y="86" width="80" height="10"/>' +
        '<g class="oil-spin"><rect class="oil-gasket" x="196" y="96" width="88" height="8" rx="3"/>' +
        '<rect class="k-ok" x="194" y="104" width="92" height="120" rx="10"/>' +
        '<g opacity=".35">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<rect class="k-dark" x="' + (198 + i * 15) + '" y="108" width="6" height="18" rx="2"/>'; }).join('') + '</g></g>' +
        L.rotArrow(240, 175, 70, 'ccw', 'accent', 120) +
        L.label(16, 286, ctx.t({ cs: 'Těsnění namazat olejem · rukou + ¾ otáčky', en: 'Oil the gasket · hand tight + ¾ turn' }), { anchor: 'start', bg: true }) +
        L.label(16, 254, ctx.t({ cs: 'Zkontrolujte, že staré těsnění nezůstalo na motoru!', en: 'Make sure the old gasket did not stay on the engine!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Výměna našroubovacího olejového filtru', en: 'Replacing a spin-on oil filter' }));
    }
  });

  A.register('oil.fill', {
    render: function (ctx) {
      var cap = CAP[ctx.vehicle] || CAP.generic;
      var s = engine({ noCap: true, sumpCls: 'oil-fillsump', tf: 'translate(-50,76) scale(.8)' }) +
        // funnel (filler neck at x≈114–126, y≈100)
        '<path class="k-metal s-dark" stroke-width="1.5" d="M100,66 L140,66 L126,100 L114,100 Z"/>' +
        '<path class="k-none s-oil oil-pour" stroke-width="5" stroke-linecap="round" d="M150,52 Q124,52 120,96"/>' +
        // bottle, tilted, neck pointing down-left at (150,52)
        '<g transform="translate(186,28) rotate(-120)"><g class="lib-fade" style="animation:none">' +
        '<rect class="k-accent s-dark" stroke-width="1.5" x="-22" y="-32" width="44" height="64" rx="6"/><rect class="k-dark" x="-7" y="-42" width="14" height="12" rx="2"/>' +
        '<rect class="k-white" opacity=".5" x="-14" y="-12" width="28" height="22" rx="3"/></g></g>' +
        L.badge(360, 120, ctx.t({ cs: 'Objem ', en: 'Capacity ' }) + ctx.t(cap), 'accent') +
        L.label(360, 160, ctx.t({ cs: 'Nalít ~90 %, pak měřit', en: 'Pour ~90 %, then check' }), { bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Pomalu, přes trychtýř', en: 'Slowly, through a funnel' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Doplnění nového oleje', en: 'Filling with new oil' }));
    }
  });

  A.register('oil.level', {
    render: function (ctx) {
      var s;
      if (ctx.vehicle === 'volvo-xc60-b4') {
        s = '<rect class="k-dark" x="120" y="30" width="240" height="220" rx="16"/><rect class="k-ground" x="132" y="42" width="216" height="196" rx="10"/>' +
          L.label(240, 70, ctx.t({ cs: 'Hladina oleje', en: 'Oil level' }), { size: 16 });
        for (var i = 0; i < 5; i++) {
          s += '<rect class="' + (i < 4 ? 'k-ok' : 'k-line') + ' lib-fade" style="animation-delay:' + (i * 0.25) + 's" x="' + (170 + i * 30) + '" y="' + (190 - i * 16) + '" width="22" height="' + (20 + i * 16) + '" rx="3"/>';
        }
        s += L.label(240, 230, ctx.t({ cs: 'Centrální displej (bez měrky)', en: 'Centre display (no dipstick)' }), { size: 12 });
        s += L.label(16, 286, ctx.t({ cs: 'Vůz na rovině, motor vypnutý a teplý – ověřte postup', en: 'Car level, engine off and warm – verify procedure' }), { anchor: 'start', bg: true });
      } else {
        s = '<g class="oil-dip"><rect class="k-metal s-dark" stroke-width="1.5" x="226" y="62" width="28" height="196" rx="4"/>' +
          '<circle class="k-warn s-dark" stroke-width="1.5" cx="240" cy="58" r="14"/>' +
          '<rect class="k-line" x="226" y="170" width="28" height="44" opacity=".5"/>' +
          '<g class="oil-film"><rect class="k-oil" x="226" y="182" width="28" height="76" opacity=".85"/></g>' +
          '<line class="s-dark" stroke-width="3" x1="214" y1="170" x2="266" y2="170"/><line class="s-dark" stroke-width="3" x1="214" y1="214" x2="266" y2="214"/></g>' +
          L.label(280, 174, 'MAX', { anchor: 'start', cls: 'k-ok' }) + L.label(280, 218, 'MIN', { anchor: 'start', cls: 'k-danger' }) +
          L.label(16, 24, ctx.t({ cs: 'Vytáhnout, otřít, zasunout, znovu vytáhnout', en: 'Pull, wipe, re-insert, pull again' }), { anchor: 'start', bg: true }) +
          L.label(16, 286, ctx.t({ cs: 'Hladina mezi MIN a MAX – nikdy nad MAX', en: 'Level between MIN and MAX – never above MAX' }), { anchor: 'start', bg: true });
      }
      return L.svg(s, ctx.t({ cs: 'Kontrola hladiny oleje', en: 'Checking the oil level' }));
    }
  });

  A.register('oil.check', {
    render: function (ctx) {
      var s = '<rect class="k-dark" x="20" y="60" width="150" height="110" rx="14"/>' +
        '<g transform="translate(92,110)"><g class="oil-lamp"><path d="M-30,-4 L-4,-4 L4,-12 L22,-6 L38,-14 L40,-10 L18,10 L-30,10 Z"/><rect x="-24" y="-12" width="14" height="6" rx="2"/><path d="M44,0 Q48,8 44,12 Q40,8 44,0 Z"/></g></g>' +
        L.label(95, 150, ctx.t({ cs: 'Kontrolka zhasne', en: 'Warning light off' }), { size: 12 }) +
        '<g class="oil-ok1">' + L.check(150, 70) + '</g>' +
        // underside: plug and filter
        '<path class="k-dark" d="M220,140 L440,140 L430,190 L230,190 Z"/>' +
        L.hex(420, 180, 9, 'k-metal') + '<rect class="k-ok" x="250" y="96" width="36" height="44" rx="6"/>' +
        '<g class="oil-scan"><g transform="translate(268,230)"><circle class="k-none s-accent" stroke-width="4" r="22"/><line class="s-accent" stroke-width="6" stroke-linecap="round" x1="16" y1="16" x2="32" y2="32"/></g></g>' +
        '<g class="oil-ok2">' + L.check(300, 96) + '</g><g class="oil-ok3">' + L.check(440, 150) + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Nastartovat na 30 s → kontrola těsnosti', en: 'Run for 30 s → check for leaks' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Vypnout, 5 min počkat, změřit hladinu', en: 'Switch off, wait 5 min, check level' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Kontrola po výměně', en: 'Post-change check' }));
    }
  });

  A.register('oil.reset', {
    render: function (ctx) {
      var how = {
        'generic': { cs: 'Menu palubního počítače / diagnostika', en: 'Trip computer menu / scan tool' },
        'mb-cl500-c216': { cs: 'ASSYST PLUS – menu přístrojovky', en: 'ASSYST PLUS – cluster menu' },
        'volvo-xc60-b4': { cs: 'Diagnostika (VIDA / kompatibilní)', en: 'Scan tool (VIDA / compatible)' },
        'skoda-octavia-rs-tdi': { cs: 'Tlačítko 0.0/SET nebo VCDS', en: '0.0/SET button or VCDS' },
        'toyota-gr-yaris': { cs: 'Menu MID – údržba', en: 'MID menu – maintenance' }
      }[ctx.vehicle] || { cs: 'Menu', en: 'Menu' };
      var s = '<rect class="k-dark" x="80" y="50" width="320" height="170" rx="18"/><rect class="k-ground" x="96" y="66" width="288" height="138" rx="10"/>' +
        L.label(240, 96, ctx.t({ cs: 'Servis: výměna oleje', en: 'Service: oil change' }), { size: 16 }) +
        '<rect class="k-line" x="130" y="130" width="220" height="14" rx="7"/><g class="oil-bar"><rect class="k-ok" x="130" y="130" width="220" height="14" rx="7"/></g>' +
        '<g class="oil-done">' + L.label(240, 180, ctx.t({ cs: 'Interval vynulován ✔', en: 'Interval reset ✔' }), { size: 15, cls: 'k-ok' }) + '</g>' +
        L.label(240, 254, ctx.t(how), { bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Starý olej → sběrný dvůr / servis', en: 'Old oil → recycling centre / garage' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Vynulování servisního intervalu', en: 'Resetting the service interval' }));
    }
  });
})(window.STU);
