/* Animations: brake fluid change & bleeding. */
(function (S) {
  'use strict';
  var L = S.animLib, A = S.anim;

  A.css('bleed', [
    /* why: water uptake + boiling point drop, 8 s */
    '.bleed-drop{animation:bleed-drop 2s ease-in infinite;opacity:0}',
    '@keyframes bleed-drop{0%{transform:translateY(0);opacity:0}15%{opacity:1}80%{opacity:1}100%{transform:translateY(60px);opacity:0}}',
    '.bleed-bar{animation:bleed-bar 8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes bleed-bar{0%,15%{transform:scaleY(1)}70%,92%{transform:scaleY(.62)}100%{transform:scaleY(1)}}',
    '.bleed-old{animation:bleed-old 8s linear infinite;opacity:0}',
    '@keyframes bleed-old{0%,66%{opacity:0}72%,94%{opacity:1}100%{opacity:0}}',
    /* order: numbers appear one by one, 10 s */
    [0, 1, 2, 3].map(function (i) {
      var a = 6 + i * 20;
      return '.bleed-n' + i + '{opacity:0;animation:bleed-n' + i + ' 10s linear infinite}' +
        '@keyframes bleed-n' + i + '{0%,' + a + '%{opacity:0}' + (a + 3) + '%,94%{opacity:1}100%{opacity:0}}' +
        '.bleed-w' + i + '{animation:bleed-w' + i + ' 10s linear infinite}' +
        '@keyframes bleed-w' + i + '{0%,' + a + '%{fill:var(--a-tire)}' + (a + 2) + '%,' + (a + 18) + '%{fill:var(--a-accent)}' + (a + 20) + '%,100%{fill:var(--a-ok)}}';
    }).join('\n'),
    /* nipple open / close + bubbles, 8 s */
    '.bleed-spanner{animation:bleed-spanner 8s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes bleed-spanner{0%,8%{transform:rotate(0)}16%,74%{transform:rotate(-40deg)}84%,100%{transform:rotate(0)}}',
    '.bleed-bub{stroke-dasharray:0 22;animation:bleed-flow .9s linear infinite,bleed-vis 8s linear infinite}',
    '.bleed-flu{stroke-dasharray:14 8;animation:bleed-flow .9s linear infinite,bleed-vis 8s linear infinite}',
    '@keyframes bleed-flow{to{stroke-dashoffset:-22}}',
    '@keyframes bleed-vis{0%,16%{opacity:0}20%,74%{opacity:1}80%,100%{opacity:0}}',
    '.bleed-jar{animation:bleed-jar 8s linear infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes bleed-jar{0%,18%{transform:scaleY(.35)}76%,96%{transform:scaleY(.8)}100%{transform:scaleY(.35)}}',
    /* pedal cycle, 8 s */
    '.bleed-pedal{animation:bleed-pedal 8s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes bleed-pedal{0%,4%{transform:rotate(0)}18%,66%{transform:rotate(22deg)}80%,100%{transform:rotate(0)}}',
    [0, 1, 2, 3].map(function (i) {
      var w = [[4, 20], [22, 44], [46, 64], [66, 90]][i];
      return '.bleed-s' + i + '{opacity:.15;animation:bleed-s' + i + ' 8s linear infinite}' +
        '@keyframes bleed-s' + i + '{0%,' + w[0] + '%{opacity:.15}' + (w[0] + 1) + '%,' + w[1] + '%{opacity:1}' + (w[1] + 1) + '%,100%{opacity:.15}}';
    }).join('\n'),
    '.bleed-nip{animation:bleed-nip 8s steps(1,end) infinite}',
    '@keyframes bleed-nip{0%{fill:var(--a-danger)}22%{fill:var(--a-ok)}46%{fill:var(--a-danger)}100%{fill:var(--a-danger)}}',
    /* pressure bleeder, 7 s */
    '.bleed-needle{animation:bleed-needle 7s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes bleed-needle{0%,8%{transform:rotate(-80deg)}40%,92%{transform:rotate(-20deg)}100%{transform:rotate(-80deg)}}',
    '.bleed-pump{animation:bleed-pump 7s ease-in-out infinite}',
    '@keyframes bleed-pump{0%,4%,12%,20%,28%,36%{transform:translateY(0)}8%,16%,24%,32%{transform:translateY(16px)}40%,100%{transform:translateY(0)}}',
    '.bleed-hose{stroke-dasharray:12 8;animation:bleed-flow 1s linear infinite,bleed-hosevis 7s linear infinite}',
    '@keyframes bleed-hosevis{0%,38%{opacity:0}44%,94%{opacity:1}100%{opacity:0}}',
    /* syringe + refill, 9 s */
    '.bleed-plunger{animation:bleed-plunger 9s ease-in-out infinite}',
    '@keyframes bleed-plunger{0%,6%{transform:translateY(0)}34%,100%{transform:translateY(-34px)}}',
    '.bleed-syr{animation:bleed-syr 9s ease-in-out infinite}',
    '@keyframes bleed-syr{0%,38%{transform:translate(0,0);opacity:1}48%,100%{transform:translate(90px,-30px);opacity:0}}',
    '.bleed-lvl{animation:bleed-lvl 9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes bleed-lvl{0%,6%{transform:scaleY(.8);fill:var(--a-rust)}34%,48%{transform:scaleY(.38);fill:var(--a-rust)}52%{fill:var(--a-filler)}80%,96%{transform:scaleY(.86);fill:var(--a-filler)}100%{transform:scaleY(.8);fill:var(--a-rust)}}',
    '.bleed-pour{stroke-dasharray:8 6;animation:bleed-flow .45s linear infinite,bleed-pourvis 9s linear infinite}',
    '@keyframes bleed-pourvis{0%,50%{opacity:0}54%,78%{opacity:1}82%,100%{opacity:0}}',
    '.bleed-bottle{animation:bleed-bottle 9s ease-in-out infinite;opacity:0}',
    '@keyframes bleed-bottle{0%,46%{opacity:0}52%,80%{opacity:1}86%,100%{opacity:0}}',
    /* fluid colour in tube, 8 s */
    '.bleed-col{animation:bleed-flow .8s linear infinite,bleed-col 8s linear infinite;stroke-dasharray:16 6}',
    '@keyframes bleed-col{0%,20%{stroke:var(--a-rust)}70%,100%{stroke:var(--a-filler)}}',
    '.bleed-colbub{stroke-dasharray:0 26;animation:bleed-flow .8s linear infinite,bleed-colbub 8s linear infinite}',
    '@keyframes bleed-colbub{0%,30%{opacity:1}55%,100%{opacity:0}}',
    '.bleed-clear{animation:bleed-clear 8s linear infinite;opacity:0}',
    '@keyframes bleed-clear{0%,68%{opacity:0}74%,96%{opacity:1}100%{opacity:0}}',
    /* abs routine, 7 s */
    '.bleed-prog{animation:bleed-prog 7s linear infinite;transform-box:fill-box;transform-origin:0 50%}',
    '@keyframes bleed-prog{0%,10%{transform:scaleX(0)}80%,100%{transform:scaleX(1)}}',
    '.bleed-hcu{animation:bleed-hcu .35s steps(2,start) infinite}',
    '@keyframes bleed-hcu{to{opacity:.35}}',
    /* test drive, 6 s */
    '.bleed-car{animation:bleed-car 6s ease-out infinite}',
    '@keyframes bleed-car{0%{transform:translateX(-200px)}55%,90%{transform:translateX(0)}100%{transform:translateX(0)}}',
    '.bleed-stop{animation:bleed-stop 6s linear infinite;opacity:0}',
    '@keyframes bleed-stop{0%,55%{opacity:0}60%,92%{opacity:1}100%{opacity:0}}'
  ].join('\n'));

  /* ---------- helpers ---------- */
  function caliper(x, y) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
      '<path class="k-danger s-dark" stroke-width="2" d="M0,10 Q0,0 12,0 L108,0 Q120,0 120,10 L120,90 Q120,100 108,100 L12,100 Q0,100 0,90 Z"/>' +
      '<rect class="k-dark" opacity=".25" x="14" y="16" width="92" height="16" rx="4"/>' +
      '<text x="60" y="68" text-anchor="middle" font-size="13" font-weight="800" class="k-white" opacity=".85">BRAKE</text></g>';
  }
  function nipple(x, y, cls) {
    return '<g transform="translate(' + x + ',' + y + ')"><rect class="k-metal2 s-dark" stroke-width="1.5" x="-7" y="-16" width="14" height="18"/>' +
      L.hex(0, -18, 9, cls || 'k-metal') + '<rect class="k-metal s-dark" stroke-width="1" x="-4" y="-34" width="8" height="10" rx="2"/></g>';
  }
  function reservoir(x, y, lvlCls) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
      '<rect class="k-glass" opacity=".55" x="0" y="0" width="90" height="110" rx="10"/>' +
      '<g class="' + (lvlCls || '') + '"><rect class="k-filler" x="4" y="14" width="82" height="92" rx="6"/></g>' +
      '<rect class="k-none s-dark" stroke-width="2" x="0" y="0" width="90" height="110" rx="10"/>' +
      '<line class="s-ok" stroke-width="2.5" x1="-8" y1="28" x2="98" y2="28"/><line class="s-danger" stroke-width="2.5" x1="-8" y1="70" x2="98" y2="70"/>' +
      '</g>' + L.label(x + 104, y + 31, 'MAX', { anchor: 'start', cls: 'k-ok', size: 12 }) + L.label(x + 104, y + 73, 'MIN', { anchor: 'start', cls: 'k-danger', size: 12 });
  }

  /* ---------- why ---------- */
  A.register('bleed.why', {
    render: function (ctx) {
      var s = '<g transform="translate(70,70)"><rect class="k-glass" opacity=".5" x="0" y="30" width="70" height="120" rx="8"/>' +
        '<rect class="k-filler" x="4" y="60" width="62" height="86" rx="5"/><rect class="k-none s-dark" stroke-width="2" x="0" y="30" width="70" height="120" rx="8"/>' +
        '<rect class="k-dark" x="20" y="18" width="30" height="14" rx="3"/></g>';
      for (var i = 0; i < 3; i++) {
        s += '<g transform="translate(' + (88 + i * 18) + ',52)"><path class="k-fluid bleed-drop" style="animation-delay:' + (i * 0.6) + 's" d="M0,-6 Q5,2 0,5 Q-5,2 0,-6 Z"/></g>';
      }
      s += L.label(105, 248, ctx.t({ cs: 'Kapalina saje vlhkost', en: 'Fluid absorbs moisture' }), { bg: true });
      // boiling point bar
      s += '<rect class="k-line" x="250" y="60" width="60" height="180" rx="6"/>' +
        '<g class="bleed-bar"><rect class="k-danger" x="250" y="60" width="60" height="180" rx="6"/></g>' +
        L.label(280, 48, ctx.t({ cs: 'Bod varu', en: 'Boiling point' }), { size: 13 }) +
        L.label(322, 70, '~230 °C', { anchor: 'start', size: 12, cls: 'k-ok' }) +
        '<g class="bleed-old">' + L.label(322, 136, ctx.t({ cs: '~155 °C po 2 letech', en: '~155 °C after 2 yrs' }), { anchor: 'start', size: 12, bg: true, cls: 'k-danger' }) + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Voda v kapalině → páry → měkký pedál', en: 'Water in fluid → vapour → soft pedal' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Měnit cca každé 2 roky', en: 'Change approx. every 2 years' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Proč měnit brzdovou kapalinu', en: 'Why brake fluid must be changed' }));
    }
  });

  /* ---------- bleeding order (top view) ---------- */
  A.register('bleed.order', {
    render: function (ctx) {
      // car top view, front at top. screen-left = car-left (LHD driver side)
      var s = '<rect class="k-body s-dark" stroke-width="2" x="170" y="34" width="140" height="236" rx="40"/>' +
        '<rect class="k-glass" x="186" y="96" width="108" height="40" rx="10"/><rect class="k-glass" x="190" y="210" width="100" height="26" rx="8"/>' +
        '<rect class="k-body2" x="186" y="140" width="108" height="66" rx="6"/>';
      // master cylinder
      s += '<rect class="k-warn s-dark" stroke-width="1.5" x="196" y="64" width="26" height="18" rx="3"/>' +
        L.label(16, 24, ctx.t({ cs: 'Hlavní válec', en: 'Master cylinder' }), { anchor: 'start', size: 12, bg: true }) + L.arrow(120, 30, 192, 68, 'accent', 2.5);
      // wheels: positions [RR, LR, RF, LF]
      var W = [[322, 216], [158, 216], [322, 74], [158, 74]];
      var lab = [{ cs: 'PZ', en: 'RR' }, { cs: 'LZ', en: 'LR' }, { cs: 'PP', en: 'RF' }, { cs: 'LP', en: 'LF' }];
      W.forEach(function (w, i) {
        s += '<rect class="bleed-w' + i + ' s-dark" stroke-width="1.5" x="' + (w[0] - 12) + '" y="' + (w[1] - 26) + '" width="24" height="52" rx="6"/>';
        s += '<path class="k-none s-fluid" stroke-width="2.5" stroke-dasharray="5 4" d="M209,82 L209,' + (w[1]) + ' L' + w[0] + ',' + w[1] + '"/>';
      });
      W.forEach(function (w, i) {
        var bx = w[0] < 240 ? w[0] - 46 : w[0] + 46;
        s += '<g class="bleed-n' + i + '"><circle class="k-accent" cx="' + bx + '" cy="' + w[1] + '" r="18"/>' +
          '<text x="' + bx + '" y="' + (w[1] + 6) + '" text-anchor="middle" font-size="18" font-weight="800" class="k-badgetext">' + (i + 1) + '</text></g>' +
          L.label(bx, w[1] + 34, ctx.t(lab[i]), { size: 12 });
      });
      s += L.label(16, 286, ctx.t({ cs: 'Od nejvzdálenějšího kola – pořadí ověřte v příručce', en: 'Furthest wheel first – verify order in manual' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Pořadí odvzdušnění kol', en: 'Wheel bleeding order' }));
    }
  });

  /* ---------- nipple + tube + jar ---------- */
  A.register('bleed.nipple', {
    render: function (ctx) {
      var tube = 'M200,72 C200,20 330,20 372,150 L372,252';
      var s = caliper(110, 110) + nipple(200, 110) +
        '<g transform="translate(200,92)"><g class="bleed-spanner"><g transform="rotate(180)">' + L.wrench(110) + '</g></g></g>' +
        // jar
        '<rect class="k-glass" opacity=".5" x="332" y="180" width="80" height="96" rx="6"/>' +
        '<g class="bleed-jar"><rect class="k-rust" x="336" y="196" width="72" height="76" rx="4"/></g>' +
        '<rect class="k-none s-dark" stroke-width="2" x="332" y="180" width="80" height="96" rx="6"/>' +
        // tube
        '<path class="k-none s-muted" stroke-width="12" stroke-linecap="round" opacity=".45" d="' + tube + '"/>' +
        '<path class="k-none s-oil bleed-flu" stroke-width="6" stroke-linecap="round" d="' + tube + '"/>' +
        '<path class="k-none s-white bleed-bub" stroke-width="7" stroke-linecap="round" d="' + tube + '"/>' +
        L.label(16, 24, ctx.t({ cs: 'Očko klíče, hadička, láhev – povolit ¼ otáčky', en: 'Ring spanner, tube, bottle – open ¼ turn' }), { anchor: 'start', bg: true }) +
        L.label(322, 238, ctx.t({ cs: 'Konec hadičky', en: 'Tube end' }), { anchor: 'end', size: 12, bg: true }) +
        L.label(322, 258, ctx.t({ cs: 'pod hladinou', en: 'under fluid' }), { anchor: 'end', size: 12, bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Vzduchové bubliny odcházejí hadičkou', en: 'Air bubbles leave through the tube' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Odvzdušňovací šroubek s hadičkou', en: 'Bleed nipple with tube' }));
    }
  });

  /* ---------- two-person pedal cycle ---------- */
  A.register('bleed.pedalCycle', {
    render: function (ctx) {
      var steps = [
        { cs: '1. „Sešlápnout a držet!“', en: '1. "Press and hold!"' },
        { cs: '2. Povolit šroubek ¼ ot.', en: '2. Open nipple ¼ turn' },
        { cs: '3. Šroubek zavřít', en: '3. Close the nipple' },
        { cs: '4. Teprve pak pustit pedál', en: '4. Only then release pedal' }
      ];
      var s = '<line class="s-dark" stroke-width="6" x1="60" y1="40" x2="210" y2="40"/>' +
        '<g transform="translate(170,40)"><g class="bleed-pedal"><path class="k-none s-dark" stroke-width="9" stroke-linecap="round" d="M0,0 Q-6,80 -30,150"/>' +
        '<rect class="k-dark" x="-58" y="140" width="56" height="20" rx="6" transform="rotate(-20 -30 150)"/></g></g>' +
        '<circle class="k-dark" cx="170" cy="40" r="7"/>' +
        '<g transform="translate(60,250)">' + nipple(0, 0, 'bleed-nip') + '</g>' +
        L.label(60, 278, ctx.t({ cs: 'šroubek', en: 'nipple' }), { size: 12 });
      steps.forEach(function (st, i) {
        s += '<g class="bleed-s' + i + '"><rect class="k-labelbg s-accent" stroke-width="2" x="224" y="' + (60 + i * 46) + '" width="240" height="34" rx="8"/>' +
          L.label(236, 80 + i * 46, ctx.t(st), { anchor: 'start', size: 13 }) + '</g>';
      });
      s += L.label(16, 24, ctx.t({ cs: 'Postup ve dvou – opakovat do čisté kapaliny', en: 'Two-person method – repeat until fluid is clean' }), { anchor: 'start', bg: true }) +
        L.label(464, 286, ctx.t({ cs: 'Nikdy nepouštět pedál s otevřeným šroubkem!', en: 'Never release the pedal with the nipple open!' }), { anchor: 'end', bg: true, cls: 'k-danger', size: 12 });
      return L.svg(s, ctx.t({ cs: 'Odvzdušnění sešlápnutím pedálu', en: 'Pedal bleeding cycle' }));
    }
  });

  /* ---------- pressure bleeder ---------- */
  A.register('bleed.pressure', {
    render: function (ctx) {
      var s = reservoir(70, 120) +
        '<rect class="k-dark" x="80" y="100" width="70" height="24" rx="4"/>' + L.label(115, 92, ctx.t({ cs: 'adaptér víčka', en: 'cap adapter' }), { size: 12, bg: true }) +
        '<path class="k-none s-line" stroke-width="10" stroke-linecap="round" d="M150,110 C220,110 260,200 330,200"/>' +
        '<path class="k-none s-fluid bleed-hose" stroke-width="5" stroke-linecap="round" d="M330,200 C260,200 220,110 150,110"/>' +
        // tank
        '<rect class="k-warn s-dark" stroke-width="2" x="320" y="130" width="90" height="140" rx="18"/>' +
        '<g class="bleed-pump"><rect class="k-dark" x="358" y="70" width="14" height="64"/><rect class="k-dark" x="336" y="62" width="58" height="12" rx="5"/></g>' +
        // gauge
        '<g transform="translate(436,110)"><circle class="k-dark" r="28"/><circle class="k-metal" r="23"/>' +
        '<path class="k-none s-danger" stroke-width="5" d="M12,-20 A23,23 0 0 1 22,4"/>' +
        '<g class="bleed-needle"><line class="s-dark" stroke-width="3" stroke-linecap="round" x1="0" y1="0" x2="0" y2="-19"/></g><circle class="k-dark" r="4"/></g>' +
        L.label(464, 50, ctx.t({ cs: 'tlak dle výrobce', en: 'pressure per maker' }), { anchor: 'end', size: 11, bg: true }) +
        L.label(16, 24, ctx.t({ cs: 'Tlakové odvzdušňovací zařízení – doporučeno', en: 'Pressure bleeder – recommended' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Nádobka nikdy nevyschne, stačí 1 člověk', en: 'Reservoir never runs dry, one person' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Tlakové odvzdušnění', en: 'Pressure bleeding' }));
    }
  });

  /* ---------- reservoir: suck out old fluid, refill ---------- */
  A.register('bleed.syringe', {
    render: function (ctx) {
      var s = reservoir(150, 140, 'bleed-lvl') +
        '<g transform="translate(-20,40)"><g class="bleed-syr"><rect class="k-none s-dark" stroke-width="2" x="186" y="40" width="20" height="110" rx="4"/>' +
        '<line class="s-dark" stroke-width="3" x1="196" y1="150" x2="196" y2="200"/>' +
        '<g class="bleed-plunger"><rect class="k-dark" x="188" y="110" width="16" height="8"/><line class="s-dark" stroke-width="4" x1="196" y1="110" x2="196" y2="20"/><rect class="k-dark" x="182" y="14" width="28" height="8" rx="3"/></g></g></g>' +
        '<g class="bleed-bottle"><g transform="translate(300,70) rotate(-110)"><rect class="k-filler s-dark" stroke-width="1.5" x="-16" y="-26" width="32" height="52" rx="5"/><rect class="k-dark" x="-6" y="-36" width="12" height="12" rx="2"/></g></g>' +
        '<path class="k-none s-warn bleed-pour" stroke-width="4" stroke-linecap="round" d="M266,82 Q226,88 214,160"/>' +
        L.label(16, 24, ctx.t({ cs: 'Starou kapalinu odsát, doplnit novou', en: 'Suck out old fluid, add new' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Nikdy nenechat klesnout pod MIN – vzduch do ABS!', en: 'Never let it drop below MIN – air into the ABS!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Výměna kapaliny v nádobce', en: 'Replacing fluid in the reservoir' }));
    }
  });

  /* ---------- fluid colour change ---------- */
  A.register('bleed.color', {
    render: function (ctx) {
      var tube = 'M40,140 C140,60 220,220 320,140 S420,100 440,150';
      var s = '<path class="k-none s-muted" stroke-width="22" stroke-linecap="round" opacity=".35" d="' + tube + '"/>' +
        '<path class="k-none bleed-col" stroke-width="12" stroke-linecap="round" d="' + tube + '"/>' +
        '<path class="k-none s-white bleed-colbub" stroke-width="11" stroke-linecap="round" d="' + tube + '"/>' +
        L.label(110, 220, ctx.t({ cs: 'tmavá + bubliny', en: 'dark + bubbles' }), { bg: true }) +
        '<g class="bleed-clear">' + L.check(410, 210) + L.label(390, 214, ctx.t({ cs: 'čistá, bez bublin', en: 'clear, no bubbles' }), { anchor: 'end', bg: true, cls: 'k-ok' }) + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Odvzdušňovat, dokud nejde čistá kapalina bez bublin', en: 'Bleed until clean fluid without bubbles comes out' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Po každém kole zkontrolovat nádobku!', en: 'Check the reservoir after every wheel!' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Barva kapaliny v hadičce', en: 'Fluid colour in the tube' }));
    }
  });

  /* ---------- ABS / ESP routine with scan tool ---------- */
  A.register('bleed.abs', {
    render: function (ctx) {
      var s = '<rect class="k-dark" x="40" y="50" width="190" height="200" rx="16"/><rect class="k-glass" x="54" y="64" width="162" height="120" rx="8"/>' +
        L.label(135, 92, ctx.t({ cs: 'ABS/ESP', en: 'ABS/ESP' }), { size: 15 }) +
        L.label(135, 118, ctx.t({ cs: 'Odvzdušnění', en: 'Bleed routine' }), { size: 13 }) +
        '<rect class="k-line" x="70" y="150" width="130" height="12" rx="6"/><g class="bleed-prog"><rect class="k-ok" x="70" y="150" width="130" height="12" rx="6"/></g>' +
        '<circle class="k-metal2" cx="100" cy="216" r="14"/><circle class="k-metal2" cx="170" cy="216" r="14"/>' +
        '<path class="k-none s-dark" stroke-width="5" d="M135,250 Q135,280 210,280 L280,280"/>' +
        // HCU block
        '<rect class="k-metal s-dark" stroke-width="2" x="290" y="110" width="140" height="100" rx="8"/>' +
        '<rect class="k-dark" x="300" y="80" width="40" height="32" rx="4"/>' +
        [0, 1, 2, 3].map(function (i) { return '<circle class="k-accent bleed-hcu" style="animation-delay:' + (i * 0.09) + 's" cx="' + (316 + i * 32) + '" cy="160" r="9"/>'; }).join('') +
        L.label(360, 236, ctx.t({ cs: 'Hydraulická jednotka ABS', en: 'ABS hydraulic unit' }), { size: 12, bg: true }) +
        L.label(16, 24, ctx.t({ cs: 'Vzduch v ABS? Odvzdušnit diagnostikou', en: 'Air in the ABS? Bleed with scan tool' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Odvzdušnění ABS diagnostikou', en: 'ABS bleed routine with scan tool' }));
    }
  });

  /* ---------- low-speed test ---------- */
  A.register('bleed.test', {
    render: function (ctx) {
      var s = L.ground(250) + '<g class="bleed-car">' + L.car(110, 238, { r: 26 }) + '</g>' +
        '<g class="bleed-stop">' + L.check(440, 60) + L.label(420, 64, ctx.t({ cs: 'Brzdí rovně a jistě', en: 'Brakes straight and firm' }), { anchor: 'end', bg: true }) + '</g>' +
        L.badge(90, 60, '5–10 km/h', 'accent') +
        L.label(16, 24, ctx.t({ cs: 'Nejdřív zkouška na prázdném místě', en: 'First test in an empty area' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Pedál měkký nebo dlouhý? Nejezdit!', en: 'Pedal soft or long? Do not drive!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Zkušební jízda nízkou rychlostí', en: 'Low-speed test drive' }));
    }
  });
})(window.STU);
