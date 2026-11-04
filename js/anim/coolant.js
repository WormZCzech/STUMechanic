/* Animations: coolant check, change and bleeding. */
(function (S) {
  'use strict';
  var L = S.animLib, A = S.anim;

  A.css('coolant', [
    /* hot: steam */
    '.coolant-steam{animation:coolant-steam 2.4s ease-out infinite;opacity:0}',
    '@keyframes coolant-steam{0%{transform:translateY(0);opacity:0}20%{opacity:.9}100%{transform:translateY(-50px);opacity:0}}',
    '.coolant-x{animation:coolant-x 1.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes coolant-x{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}',
    /* level into range, 6 s */
    '.coolant-lvl{animation:coolant-lvl 6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes coolant-lvl{0%,10%{transform:scaleY(.25)}55%,92%{transform:scaleY(.62)}100%{transform:scaleY(.25)}}',
    '.coolant-okk{animation:coolant-okk 6s linear infinite;opacity:0}',
    '@keyframes coolant-okk{0%,56%{opacity:0}62%,92%{opacity:1}100%{opacity:0}}',
    /* refractometer boundary, 6 s */
    '.coolant-ref{animation:coolant-ref 6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0}',
    '@keyframes coolant-ref{0%,10%{transform:scaleY(.15)}60%,92%{transform:scaleY(.62)}100%{transform:scaleY(.15)}}',
    /* mix, 8 s */
    '.coolant-pourA{stroke-dasharray:8 6;animation:coolant-flow .45s linear infinite,coolant-pa 8s linear infinite}',
    '.coolant-pourB{stroke-dasharray:8 6;animation:coolant-flow .45s linear infinite,coolant-pb 8s linear infinite}',
    '@keyframes coolant-flow{to{stroke-dashoffset:-14}}',
    '@keyframes coolant-pa{0%,8%{opacity:0}12%,40%{opacity:1}44%,100%{opacity:0}}',
    '@keyframes coolant-pb{0%,46%{opacity:0}50%,80%{opacity:1}84%,100%{opacity:0}}',
    '.coolant-la{animation:coolant-la 8s linear infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes coolant-la{0%,10%{transform:scaleY(0)}42%,96%{transform:scaleY(1)}100%{transform:scaleY(0)}}',
    '.coolant-lb{animation:coolant-lb 8s linear infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes coolant-lb{0%,48%{transform:scaleY(0)}82%,96%{transform:scaleY(1)}100%{transform:scaleY(0)}}',
    '.coolant-ratio{animation:coolant-okk 8s linear infinite;opacity:0}',
    /* drain, 8 s */
    '.coolant-rad{animation:coolant-rad 8s linear infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes coolant-rad{0%,14%{transform:scaleY(1)}85%,95%{transform:scaleY(.05)}100%{transform:scaleY(1)}}',
    '.coolant-stream{stroke-dasharray:10 8;animation:coolant-flow2 .5s linear infinite,coolant-sv 8s linear infinite}',
    '@keyframes coolant-flow2{to{stroke-dashoffset:-18}}',
    '@keyframes coolant-sv{0%,14%{opacity:0}18%,84%{opacity:1}90%,100%{opacity:0}}',
    '.coolant-pan{animation:coolant-pan 8s linear infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes coolant-pan{0%,16%{transform:scaleY(.05)}88%,96%{transform:scaleY(1)}100%{transform:scaleY(.05)}}',
    '.coolant-plug{animation:coolant-plug 8s ease-in-out infinite}',
    '@keyframes coolant-plug{0%,6%{transform:translateY(0)}14%,92%{transform:translateY(14px)}100%{transform:translateY(0)}}',
    /* fill, 7 s */
    '.coolant-pour{stroke-dasharray:8 6;animation:coolant-flow .45s linear infinite,coolant-pv 7s linear infinite}',
    '@keyframes coolant-pv{0%,10%{opacity:0}14%,74%{opacity:1}78%,100%{opacity:0}}',
    '.coolant-fl{animation:coolant-fl 7s linear infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes coolant-fl{0%,12%{transform:scaleY(.1)}74%,94%{transform:scaleY(.62)}100%{transform:scaleY(.1)}}',
    /* vacuum, 10 s */
    '.coolant-vneedle{animation:coolant-vn 10s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes coolant-vn{0%,6%{transform:rotate(0)}30%,56%{transform:rotate(-70deg)}84%,100%{transform:rotate(0)}}',
    '.coolant-vstep{opacity:.15}',
    '.coolant-v0{animation:coolant-v0 10s linear infinite}@keyframes coolant-v0{0%,4%{opacity:.15}5%,30%{opacity:1}31%,100%{opacity:.15}}',
    '.coolant-v1{animation:coolant-v1 10s linear infinite}@keyframes coolant-v1{0%,31%{opacity:.15}32%,56%{opacity:1}57%,100%{opacity:.15}}',
    '.coolant-v2{animation:coolant-v2 10s linear infinite}@keyframes coolant-v2{0%,57%{opacity:.15}58%,92%{opacity:1}93%,100%{opacity:.15}}',
    '.coolant-vhose{stroke-dasharray:12 8;animation:coolant-flow2 .6s linear infinite,coolant-vh 10s linear infinite}',
    '@keyframes coolant-vh{0%,58%{opacity:0}62%,88%{opacity:1}92%,100%{opacity:0}}',
    '.coolant-vlvl{animation:coolant-vlvl 10s linear infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes coolant-vlvl{0%,60%{transform:scaleY(.05)}88%,96%{transform:scaleY(.6)}100%{transform:scaleY(.05)}}',
    /* bleed screw, 7 s */
    '.coolant-scr{animation:coolant-scr 7s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes coolant-scr{0%,6%{transform:rotate(0)}16%,72%{transform:rotate(-90deg)}82%,100%{transform:rotate(0)}}',
    '.coolant-bub{animation:coolant-bub 1.1s ease-out infinite;opacity:0}',
    '@keyframes coolant-bub{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-60px);opacity:0}}',
    '.coolant-bubw{animation:coolant-bubw 7s linear infinite}',
    '@keyframes coolant-bubw{0%,16%{opacity:0}20%,50%{opacity:1}54%,100%{opacity:0}}',
    '.coolant-dripw{animation:coolant-dripw 7s linear infinite;opacity:0}',
    '@keyframes coolant-dripw{0%,52%{opacity:0}56%,72%{opacity:1}76%,100%{opacity:0}}',
    /* run, 10 s */
    '.coolant-knob{animation:coolant-knob 10s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes coolant-knob{0%,4%{transform:rotate(-100deg)}16%,94%{transform:rotate(100deg)}100%{transform:rotate(-100deg)}}',
    '.coolant-temp{animation:coolant-temp 10s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes coolant-temp{0%,16%{transform:rotate(-70deg)}70%,94%{transform:rotate(0deg)}100%{transform:rotate(-70deg)}}',
    '.coolant-fan{animation:lib-spin-cw .5s linear infinite,coolant-fanv 10s linear infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes coolant-fanv{0%,72%{opacity:.2}74%,94%{opacity:1}100%{opacity:.2}}'
  ].join('\n'));

  /* ---------- helpers ---------- */
  /** Expansion tank at x,y (120×120). lvlCls animates the coolant column. */
  function tank(x, y, lvlCls, opts) {
    opts = opts || {};
    var s = '<g transform="translate(' + x + ',' + y + ')">' +
      '<rect class="k-glass" opacity=".55" x="0" y="0" width="120" height="120" rx="14"/>' +
      '<g class="' + (lvlCls || '') + '"><rect class="k-fluid" x="5" y="20" width="110" height="96" rx="9"/></g>' +
      '<rect class="k-none s-dark" stroke-width="2" x="0" y="0" width="120" height="120" rx="14"/>' +
      '<line class="s-ok" stroke-width="2.5" x1="-8" y1="44" x2="128" y2="44"/><line class="s-danger" stroke-width="2.5" x1="-8" y1="78" x2="128" y2="78"/>';
    if (!opts.noCap) s += '<g class="' + (opts.capCls || '') + '"><rect class="k-dark" x="38" y="-20" width="44" height="22" rx="5"/><rect class="k-metal2" x="44" y="-14" width="32" height="6" rx="2"/></g>';
    s += '</g>';
    if (!opts.noLabels) s += L.label(x + 136, y + 47, 'MAX', { anchor: 'start', cls: 'k-ok', size: 12 }) + L.label(x + 136, y + 81, 'MIN', { anchor: 'start', cls: 'k-danger', size: 12 });
    return s;
  }

  /* ---------- do not open hot ---------- */
  A.register('coolant.hot', {
    render: function (ctx) {
      var s = tank(140, 120);
      [0, 1, 2].forEach(function (i) {
        s += '<g transform="translate(' + (184 + i * 16) + ',96)"><path class="k-none s-muted coolant-steam" style="animation-delay:' + (i * 0.6) + 's" stroke-width="4" stroke-linecap="round" d="M0,0 q-7,-9 0,-18 q7,-9 0,-18"/></g>';
      });
      s += '<g transform="translate(300,90)">' + '<g class="coolant-x">' + L.cross(0, 0) + '</g></g>' +
        '<g transform="translate(400,140)"><rect class="k-dark" x="-12" y="-80" width="24" height="140" rx="12"/><rect class="k-line" x="-6" y="-72" width="12" height="122" rx="6"/>' +
        '<rect class="k-danger" x="-6" y="-56" width="12" height="106" rx="6"/><circle class="k-danger" cx="0" cy="62" r="16"/></g>' +
        L.label(400, 236, '> 90 °C', { bg: true, cls: 'k-danger' }) +
        L.label(16, 24, ctx.t({ cs: 'Horký systém je pod tlakem – NIKDY neotvírat!', en: 'Hot system is pressurised – NEVER open!' }), { anchor: 'start', bg: true, cls: 'k-danger' }) +
        L.label(16, 286, ctx.t({ cs: 'Jen za studena, víčko povolit pomalu přes hadr', en: 'Only when cold, open the cap slowly with a rag' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Neotvírat horký chladicí systém', en: 'Do not open a hot cooling system' }));
    }
  });

  /* ---------- level check ---------- */
  A.register('coolant.level', {
    render: function (ctx) {
      var s = tank(170, 110, 'coolant-lvl') +
        '<g class="coolant-okk">' + L.check(380, 160) + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Kontrola za studena, vůz na rovině', en: 'Check cold, car on level ground' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Hladina mezi MIN a MAX', en: 'Level between MIN and MAX' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Kontrola hladiny chladicí kapaliny', en: 'Checking the coolant level' }));
    }
  });

  /* ---------- refractometer test ---------- */
  A.register('coolant.test', {
    render: function (ctx) {
      var cid = ctx.uid + '-refclip';
      var s = '<defs><clipPath id="' + cid + '"><circle r="100"/></clipPath></defs>' +
        '<g transform="translate(150,150)"><circle class="k-dark" r="112"/><circle class="k-white" r="100"/>' +
        '<g clip-path="url(#' + cid + ')"><g class="coolant-ref"><rect class="k-fluid" x="-100" y="-100" width="200" height="200" opacity=".8"/></g></g>' +
        '<circle class="k-none s-dark" stroke-width="6" r="100"/>';
      var marks = [0, -10, -20, -30, -40];
      marks.forEach(function (m, i) {
        var y = -80 + i * 36;
        s += '<line class="s-dark" stroke-width="2" x1="-20" y1="' + y + '" x2="20" y2="' + y + '"/>' +
          '<text x="26" y="' + (y + 5) + '" font-size="13" font-weight="700" class="k-dark">' + m + ' °C</text>';
      });
      s += '</g>' +
        L.label(372, 100, ctx.t({ cs: 'Refraktometr', en: 'Refractometer' }), { bg: true }) +
        L.label(372, 140, ctx.t({ cs: 'Hranice modré', en: 'Blue boundary' }), { size: 12, bg: true }) +
        L.label(372, 160, ctx.t({ cs: '= bod tuhnutí', en: '= freezing point' }), { size: 12, bg: true }) +
        L.badge(372, 210, ctx.t({ cs: 'cíl: −25 až −35 °C', en: 'target: −25 to −35 °C' }), 'accent') +
        L.label(16, 24, ctx.t({ cs: 'Zkouška mrazuvzdornosti', en: 'Freeze protection test' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Měření mrazuvzdornosti refraktometrem', en: 'Measuring freeze protection with a refractometer' }));
    }
  });

  /* ---------- mixing ---------- */
  A.register('coolant.mix', {
    render: function (ctx) {
      var premixed = ctx.vehicle === 'toyota-gr-yaris';
      var s;
      if (premixed) {
        s = '<rect class="k-paint s-dark" stroke-width="2" x="170" y="60" width="140" height="190" rx="14" opacity=".9"/>' +
          '<rect class="k-dark" x="220" y="40" width="40" height="24" rx="4"/>' +
          L.label(240, 140, 'Toyota SLLC', { size: 16, cls: 'k-white' }) + L.label(240, 166, ctx.t({ cs: 'předmíchaná 50 %', en: 'pre-mixed 50 %' }), { size: 13, cls: 'k-white' }) +
          '<g class="coolant-x" transform="translate(0,0)">' + L.cross(360, 100) + '</g>' + L.label(380, 140, ctx.t({ cs: 'NEŘEDIT vodou', en: 'DO NOT dilute' }), { bg: true, cls: 'k-danger' }) +
          L.label(16, 24, ctx.t({ cs: 'Toyota: kapalina je již namíchaná', en: 'Toyota: coolant comes pre-mixed' }), { anchor: 'start', bg: true }) +
          L.label(16, 286, ctx.t({ cs: 'Typ ověřte v příručce / u prodejce', en: 'Verify the type in manual / at dealer' }), { anchor: 'start', bg: true });
        return L.svg(s, ctx.t({ cs: 'Předmíchaná chladicí kapalina', en: 'Pre-mixed coolant' }));
      }
      s = // concentrate bottle (left) tilted
        '<g transform="translate(110,92) rotate(120)"><rect class="k-fluid s-dark" stroke-width="1.5" x="-24" y="-36" width="48" height="72" rx="6"/><rect class="k-dark" x="-8" y="-48" width="16" height="14" rx="2"/></g>' +
        L.label(90, 162, ctx.t({ cs: 'koncentrát', en: 'concentrate' }), { size: 12, bg: true }) +
        // distilled water (right)
        '<g transform="translate(370,92) rotate(-120)"><rect class="k-glass s-dark" stroke-width="1.5" x="-24" y="-36" width="48" height="72" rx="6"/><rect class="k-dark" x="-8" y="-48" width="16" height="14" rx="2"/></g>' +
        L.label(390, 162, ctx.t({ cs: 'destilovaná voda', en: 'distilled water' }), { size: 12, bg: true }) +
        '<path class="k-none s-fluid coolant-pourA" stroke-width="5" stroke-linecap="round" d="M152,114 Q220,118 226,168"/>' +
        '<path class="k-none s-muted coolant-pourB" stroke-width="5" stroke-linecap="round" d="M328,114 Q260,118 254,168"/>' +
        // jug
        '<rect class="k-glass" opacity=".45" x="190" y="160" width="100" height="110" rx="8"/>' +
        '<g class="coolant-la"><rect class="k-fluid" x="194" y="218" width="92" height="48"/></g>' +
        '<g class="coolant-lb"><rect class="k-fluid" opacity=".55" x="194" y="170" width="92" height="48"/></g>' +
        '<rect class="k-none s-dark" stroke-width="2" x="190" y="160" width="100" height="110" rx="8"/>' +
        '<line class="s-dark" stroke-width="2" stroke-dasharray="4 3" x1="190" y1="218" x2="290" y2="218"/>' +
        '<g class="coolant-ratio">' + L.badge(240, 146, ctx.t({ cs: '1 : 1 ≈ −35 °C', en: '1 : 1 ≈ −35 °C' }), 'accent') + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Jen předepsaný typ + destilovaná voda', en: 'Only the specified type + distilled water' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Typy nemíchat!', en: 'Do not mix types!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Míchání chladicí kapaliny', en: 'Mixing coolant' }));
    }
  });

  /* ---------- drain from radiator ---------- */
  A.register('coolant.drain', {
    render: function (ctx) {
      var s = '<rect class="k-dark" x="96" y="50" width="22" height="190" rx="5"/><rect class="k-dark" x="352" y="50" width="22" height="190" rx="5"/>' +
        '<rect class="k-metal2" x="118" y="56" width="234" height="178"/>' +
        '<g class="coolant-rad"><rect class="k-fluid" opacity=".55" x="118" y="56" width="234" height="178"/></g>';
      for (var i = 0; i < 24; i++) s += '<line class="s-dark" stroke-width="1" opacity=".45" x1="' + (124 + i * 9.6) + '" y1="56" x2="' + (124 + i * 9.6) + '" y2="234"/>';
      s += '<g transform="translate(363,240)"><g class="coolant-plug"><rect class="k-warn s-dark" stroke-width="1.5" x="-8" y="0" width="16" height="12" rx="2"/></g></g>' +
        '<path class="k-none s-fluid coolant-stream" stroke-width="6" stroke-linecap="round" d="M363,246 Q366,262 380,276"/>' +
        '<path class="k-dark" d="M330,272 L460,272 L452,298 L338,298 Z"/>' +
        '<g class="coolant-pan"><rect class="k-fluid" x="342" y="276" width="106" height="20"/></g>' +
        L.label(16, 24, ctx.t({ cs: 'Studený motor · víčko nádobky otevřít · vypustit', en: 'Cold engine · open tank cap · drain' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Zachytit vše – jed pro zvířata!', en: 'Catch it all – poison for pets!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Vypuštění chladicí kapaliny', en: 'Draining the coolant' }));
    }
  });

  /* ---------- fill ---------- */
  A.register('coolant.fill', {
    render: function (ctx) {
      var s = tank(150, 130, 'coolant-fl', { noCap: true }) +
        '<g transform="translate(300,60) rotate(-115)"><rect class="k-fluid s-dark" stroke-width="1.5" x="-22" y="-34" width="44" height="68" rx="6"/><rect class="k-dark" x="-7" y="-46" width="14" height="14" rx="2"/></g>' +
        '<path class="k-none s-fluid coolant-pour" stroke-width="5" stroke-linecap="round" d="M262,76 Q220,80 212,150"/>' +
        L.label(16, 24, ctx.t({ cs: 'Pomalu nalévat – vzduch musí unikat', en: 'Pour slowly – air must escape' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Doplňovat, dokud hladina neklesá', en: 'Top up until the level stops dropping' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Doplnění chladicí kapaliny', en: 'Filling the coolant' }));
    }
  });

  /* ---------- vacuum filler ---------- */
  A.register('coolant.vacuum', {
    render: function (ctx) {
      var s = tank(60, 140, 'coolant-vlvl', { noCap: true, noLabels: true }) +
        '<rect class="k-dark" x="88" y="100" width="64" height="40" rx="6"/>' +
        '<g transform="translate(120,72)"><circle class="k-dark" r="30"/><circle class="k-metal" r="25"/>' +
        '<path class="k-none s-fluid" stroke-width="5" d="M-24,-6 A25,25 0 0 1 -6,-24"/>' +
        '<g class="coolant-vneedle"><line class="s-dark" stroke-width="3" stroke-linecap="round" x1="0" y1="0" x2="0" y2="-21"/></g><circle class="k-dark" r="4"/></g>' +
        // hose to bucket
        '<path class="k-none s-line" stroke-width="10" stroke-linecap="round" d="M152,128 C210,128 230,240 270,250"/>' +
        '<path class="k-none s-fluid coolant-vhose" stroke-width="5" stroke-linecap="round" d="M270,250 C230,240 210,128 152,128"/>' +
        '<path class="k-glass s-dark" stroke-width="2" d="M250,210 L330,210 L322,290 L258,290 Z" opacity=".9"/><rect class="k-fluid" x="258" y="236" width="64" height="50"/>';
      var st = [
        { cs: '1. Vakuum (stlačený vzduch)', en: '1. Pull vacuum (compressed air)' },
        { cs: '2. Držet – test těsnosti', en: '2. Hold – leak test' },
        { cs: '3. Otevřít – kapalina se nasaje', en: '3. Open – coolant is sucked in' }
      ];
      st.forEach(function (x, i) {
        s += '<g class="coolant-vstep coolant-v' + i + '"><rect class="k-labelbg s-accent" stroke-width="2" x="226" y="' + (50 + i * 44) + '" width="240" height="32" rx="8"/>' +
          L.label(236, 69 + i * 44, ctx.t(x), { anchor: 'start', size: 12 }) + '</g>';
      });
      s += L.label(16, 24, ctx.t({ cs: 'Vakuové plnění – bez vzduchových bublin', en: 'Vacuum filling – no air pockets' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Vakuové plnění chladicí soustavy', en: 'Vacuum filling the cooling system' }));
    }
  });

  /* ---------- bleed screw ---------- */
  A.register('coolant.bleed', {
    render: function (ctx) {
      var s = '<rect class="k-line" x="40" y="170" width="400" height="56" rx="28"/>' +
        '<rect class="k-metal2 s-dark" stroke-width="1.5" x="218" y="134" width="44" height="40" rx="4"/>' +
        '<g transform="translate(240,130)"><g class="coolant-scr">' + L.hex(0, 0, 14, 'k-metal') + '<rect class="k-dark" x="-10" y="-2" width="20" height="4"/></g></g>';
      s += '<g class="coolant-bubw">';
      for (var i = 0; i < 4; i++) s += '<g transform="translate(' + (234 + (i % 2) * 12) + ',112)"><circle class="k-none s-fluid coolant-bub" style="animation-delay:' + (i * 0.27) + 's" stroke-width="2.5" r="5"/></g>';
      s += '</g><g class="coolant-dripw">' + L.drops(252, 118, 3, 60, 'k-fluid') + L.check(330, 90) + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Odvzdušňovací šroub povolit, až teče bez bublin', en: 'Open bleed screw until no bubbles' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Šroub je plastový – jen jemně!', en: 'Screw is often plastic – gently!' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Odvzdušnění chladicí soustavy', en: 'Bleeding the cooling system' }));
    }
  });

  /* ---------- run: heater max, temperature, fan ---------- */
  A.register('coolant.run', {
    render: function (ctx) {
      var s = // heater knob
        '<g transform="translate(110,140)"><circle class="k-dark" r="62"/><circle class="k-metal2" r="52"/>' +
        '<path class="k-none s-fluid" stroke-width="8" d="M-46,24 A52,52 0 0 1 -24,-46"/><path class="k-none s-danger" stroke-width="8" d="M24,-46 A52,52 0 0 1 46,24"/>' +
        '<g class="coolant-knob"><rect class="k-dark" x="-5" y="-46" width="10" height="40" rx="4"/></g><circle class="k-dark" r="14"/></g>' +
        L.label(110, 228, ctx.t({ cs: 'Topení naplno', en: 'Heater to max' }), { bg: true }) +
        // temp gauge
        '<g transform="translate(300,150)"><path class="k-none s-line" stroke-width="10" d="M-56,0 A56,56 0 0 1 56,0"/><path class="k-none s-danger" stroke-width="10" d="M40,-40 A56,56 0 0 1 56,0"/>' +
        '<g class="coolant-temp"><line class="s-dark" stroke-width="4" stroke-linecap="round" x1="0" y1="0" x2="0" y2="-50"/></g><circle class="k-dark" r="7"/>' +
        '<text x="-56" y="22" font-size="12" font-weight="700" class="k-text">C</text><text x="50" y="22" font-size="12" font-weight="700" class="k-danger">H</text></g>' +
        L.label(300, 196, ctx.t({ cs: 'ručička ~ do středu', en: 'needle ~ to middle' }), { bg: true, size: 12 }) +
        // fan
        '<g transform="translate(420,90)"><circle class="k-dark" r="34"/><g class="coolant-fan">' +
        [0, 1, 2, 3].map(function (i) { return '<ellipse class="k-metal" rx="8" ry="24" transform="rotate(' + (i * 90) + ') translate(0,-14)"/>'; }).join('') +
        '</g><circle class="k-dark" r="6"/></g>' +
        L.label(420, 140, ctx.t({ cs: 'ventilátor sepne', en: 'fan switches on' }), { bg: true, size: 12 }) +
        L.label(16, 24, ctx.t({ cs: 'Motor zahřát, zvýšit otáčky, sledovat teplotu', en: 'Warm up, raise revs, watch temperature' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Ručička do červena = ihned vypnout!', en: 'Needle into red = switch off at once!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Zahřátí a odvzdušnění za chodu', en: 'Warm-up and bleeding while running' }));
    }
  });
})(window.STU);
