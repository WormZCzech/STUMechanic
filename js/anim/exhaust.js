/* Animations: exhaust replacement and legal modifications. */
(function (S) {
  'use strict';
  var L = S.animLib, A = S.anim;

  A.css('exhaust', [
    /* gas flow along the pipe */
    '.exhaust-flow{stroke-dasharray:6 14;animation:exhaust-flow 1.2s linear infinite}',
    '@keyframes exhaust-flow{to{stroke-dashoffset:20}}',
    /* sensor highlight */
    '.exhaust-pulse{animation:exhaust-pulse 1.4s ease-in-out infinite}',
    '@keyframes exhaust-pulse{0%,100%{opacity:.35}50%{opacity:1}}',
    /* penetrating oil spray 6 s */
    '.exhaust-can{animation:exhaust-can 6s ease-in-out infinite}',
    '@keyframes exhaust-can{0%,8%{transform:translate(40px,-20px);opacity:0}18%,60%{transform:translate(0,0);opacity:1}72%,100%{transform:translate(40px,-20px);opacity:0}}',
    '.exhaust-mist{animation:exhaust-mist 6s linear infinite;opacity:0}',
    '@keyframes exhaust-mist{0%,20%{opacity:0}24%,58%{opacity:.7}64%,100%{opacity:0}}',
    '.exhaust-wet{animation:exhaust-wet 6s linear infinite;opacity:0}',
    '@keyframes exhaust-wet{0%,30%{opacity:0}60%,96%{opacity:.85}100%{opacity:0}}',
    '.exhaust-timer{animation:exhaust-timer 6s linear infinite;transform-origin:0 0}',
    '@keyframes exhaust-timer{0%,60%{transform:rotate(0)}100%{transform:rotate(360deg)}}',
    /* nut unscrewing 6 s */
    '.exhaust-nut{animation:exhaust-nut 6s ease-in-out infinite}',
    '@keyframes exhaust-nut{0%,10%{transform:translateY(0);opacity:1}45%{transform:translateY(-34px);opacity:1}55%,90%{transform:translateY(-60px);opacity:0}100%{transform:translateY(0);opacity:1}}',
    '.exhaust-split{animation:exhaust-split 6s ease-in-out infinite}',
    '@keyframes exhaust-split{0%,55%{transform:translateX(0)}75%,90%{transform:translateX(-36px)}100%{transform:translateX(0)}}',
    '.exhaust-gasket{animation:exhaust-gasket 6s linear infinite;opacity:0}',
    '@keyframes exhaust-gasket{0%,72%{opacity:0}78%,94%{opacity:1}100%{opacity:0}}',
    /* sensor unplug 6 s */
    '.exhaust-plug{animation:exhaust-plug 6s ease-in-out infinite}',
    '@keyframes exhaust-plug{0%,15%{transform:translateX(0)}35%,85%{transform:translateX(46px)}100%{transform:translateX(0)}}',
    '.exhaust-strap{animation:exhaust-strap 6s ease-in-out infinite;opacity:0}',
    '@keyframes exhaust-strap{0%,45%{opacity:0;transform:translateY(30px)}60%,92%{opacity:1;transform:translateY(0)}100%{opacity:0}}',
    /* hanger 6 s */
    '.exhaust-hang{animation:exhaust-hang 6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0}',
    '@keyframes exhaust-hang{0%,15%{transform:scaleY(1)}40%{transform:scaleY(1.35)}55%,100%{transform:scaleY(1.35)}}',
    '.exhaust-hangoff{animation:exhaust-hangoff 6s ease-in-out infinite}',
    '@keyframes exhaust-hangoff{0%,45%{transform:translateX(0);opacity:1}62%,88%{transform:translateX(56px);opacity:1}100%{transform:translateX(0);opacity:1}}',
    '.exhaust-tool{animation:exhaust-tool 6s ease-in-out infinite}',
    '@keyframes exhaust-tool{0%,10%{transform:translate(0,30px);opacity:0}20%,45%{transform:translate(0,0);opacity:1}62%,88%{transform:translate(56px,0);opacity:1}100%{opacity:0}}',
    /* fit new section 7 s */
    '.exhaust-newsec{animation:exhaust-newsec 7s ease-in-out infinite}',
    '@keyframes exhaust-newsec{0%,10%{transform:translate(-120px,50px);opacity:0}25%{opacity:1}55%,92%{transform:translate(0,0);opacity:1}100%{transform:translate(-120px,50px);opacity:0}}',
    '.exhaust-clampin{animation:exhaust-clampin 7s ease-in-out infinite;opacity:0}',
    '@keyframes exhaust-clampin{0%,58%{opacity:0;transform:translateY(-24px)}70%,92%{opacity:1;transform:translateY(0)}100%{opacity:0}}',
    /* align – tip moves into centre 6 s */
    '.exhaust-tipalign{animation:exhaust-tipalign 6s ease-in-out infinite}',
    '@keyframes exhaust-tipalign{0%,15%{transform:translate(-26px,14px)}55%,92%{transform:translate(0,0)}100%{transform:translate(-26px,14px)}}',
    '.exhaust-okfade{animation:exhaust-okfade 6s linear infinite;opacity:0}',
    '@keyframes exhaust-okfade{0%,58%{opacity:0}64%,94%{opacity:1}100%{opacity:0}}',
    /* tighten sequence 9 s */
    '.exhaust-seq0,.exhaust-seq1,.exhaust-seq2,.exhaust-seq3{opacity:0}',
    '.exhaust-seq0{animation:exhaust-seq0 9s linear infinite}',
    '@keyframes exhaust-seq0{0%,6%{opacity:0}10%,94%{opacity:1}100%{opacity:0}}',
    '.exhaust-seq1{animation:exhaust-seq1 9s linear infinite}',
    '@keyframes exhaust-seq1{0%,28%{opacity:0}32%,94%{opacity:1}100%{opacity:0}}',
    '.exhaust-seq2{animation:exhaust-seq2 9s linear infinite}',
    '@keyframes exhaust-seq2{0%,50%{opacity:0}54%,94%{opacity:1}100%{opacity:0}}',
    '.exhaust-seq3{animation:exhaust-seq3 9s linear infinite}',
    '@keyframes exhaust-seq3{0%,72%{opacity:0}76%,94%{opacity:1}100%{opacity:0}}',
    /* leak puffs */
    '.exhaust-puff{animation:exhaust-puff 1.8s ease-out infinite;opacity:0;transform-box:fill-box;transform-origin:center}',
    '@keyframes exhaust-puff{0%{opacity:0;transform:translate(0,0) scale(.4)}20%{opacity:.8}100%{opacity:0;transform:translate(10px,-46px) scale(1.6)}}',
    /* dB needle */
    '.exhaust-needle{animation:exhaust-needle 4s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes exhaust-needle{0%,10%{transform:rotate(-70deg)}50%,70%{transform:rotate(20deg)}100%{transform:rotate(-70deg)}}',
    '.exhaust-stamp{animation:exhaust-stamp 4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes exhaust-stamp{0%,30%{transform:scale(1.8);opacity:0}42%,92%{transform:scale(1);opacity:1}100%{opacity:0}}',
    /* valve flap 6 s */
    '.exhaust-flap{animation:exhaust-flap 6s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes exhaust-flap{0%,15%{transform:rotate(0)}35%,65%{transform:rotate(80deg)}85%,100%{transform:rotate(0)}}',
    '.exhaust-sigon{animation:exhaust-sigon 6s steps(1,end) infinite}',
    '@keyframes exhaust-sigon{0%{opacity:.25}20%{opacity:1}80%{opacity:.25}}',
    '.exhaust-loud{animation:exhaust-loud 6s ease-in-out infinite;opacity:0}',
    '@keyframes exhaust-loud{0%,30%{opacity:0}40%,65%{opacity:1}75%,100%{opacity:0}}',
    /* tip slide 5 s */
    '.exhaust-tipon{animation:exhaust-tipon 5s ease-in-out infinite}',
    '@keyframes exhaust-tipon{0%,10%{transform:translateX(-90px);opacity:0}25%{opacity:1}55%,92%{transform:translateX(0);opacity:1}100%{transform:translateX(-90px);opacity:0}}',
    /* downpipe docs 7 s */
    '.exhaust-doc{animation:exhaust-doc 7s ease-in-out infinite;opacity:0}',
    '@keyframes exhaust-doc{0%,20%{opacity:0;transform:translateY(20px)}30%,94%{opacity:1;transform:translateY(0)}100%{opacity:0}}',
    '.exhaust-chip{animation:exhaust-chip 7s ease-in-out infinite;opacity:0}',
    '@keyframes exhaust-chip{0%,45%{opacity:0;transform:translateY(20px)}55%,94%{opacity:1;transform:translateY(0)}100%{opacity:0}}',
    '.exhaust-stk{animation:exhaust-stk 7s ease-in-out infinite;opacity:0;transform-box:fill-box;transform-origin:center}',
    '@keyframes exhaust-stk{0%,68%{opacity:0;transform:scale(1.6)}76%,94%{opacity:1;transform:scale(1)}100%{opacity:0}}'
  ].join('\n'));

  /* --- what the particulate filter is called for each car --- */
  function pfLabel(v) {
    return {
      'skoda-octavia-rs-tdi': { cs: 'DPF', en: 'DPF' },
      'volvo-xc60-b4': { cs: 'GPF', en: 'GPF' },
      'toyota-gr-yaris': { cs: 'GPF', en: 'GPF' },
      'mb-cl500-c216': { cs: 'kat. 2', en: 'cat 2' },
      'citroen-jumper-22hdi': { cs: 'DPF?', en: 'DPF?' }
    }[v] || { cs: 'DPF/GPF', en: 'DPF/GPF' };
  }

  /** Side view of the full exhaust: engine on the right, tail on the left. */
  A.register('exhaust.layout', {
    render: function (ctx) {
      var s = '';
      // faded underbody
      s += '<path class="k-body" opacity=".25" d="M10,92 L470,92 L470,40 Q470,24 450,24 L30,24 Q10,24 10,40 Z"/>';
      s += L.label(240, 52, ctx.t({ cs: 'podlaha vozu', en: 'car floor' }), { cls: 'k-muted', size: 12 });
      // engine block
      s += '<rect class="k-metal2" x="430" y="96" width="44" height="54" rx="6"/>';
      // hangers
      [250, 150, 70].forEach(function (x) {
        s += '<line class="s-dark" stroke-width="6" stroke-linecap="round" x1="' + x + '" y1="92" x2="' + x + '" y2="138"/>';
      });
      // pipe path
      var path = 'M436,140 Q410,150 400,152 L30,152';
      s += '<path class="k-none s-metal" stroke-width="12" stroke-linecap="round" d="' + path + '"/>';
      s += '<path class="k-none s-muted exhaust-flow" stroke-width="3" d="' + path + '"/>';
      // components
      s += '<rect class="k-metal2 s-dark" stroke-width="1.5" x="356" y="138" width="40" height="28" rx="6"/>';
      s += '<rect class="k-metal2 s-dark" stroke-width="1.5" x="296" y="136" width="48" height="32" rx="8"/>';
      s += '<ellipse class="k-metal2 s-dark" stroke-width="1.5" cx="186" cy="152" rx="32" ry="16"/>';
      s += '<rect class="k-metal2 s-dark" stroke-width="1.5" x="44" y="130" width="76" height="44" rx="18"/>';
      s += '<rect class="k-metal s-dark" stroke-width="1.5" x="8" y="144" width="30" height="16" rx="4"/>';
      // flex pipe pattern
      for (var i = 0; i < 5; i++) s += '<line class="s-dark" stroke-width="1.5" x1="' + (412 + i * 4) + '" y1="143" x2="' + (412 + i * 4) + '" y2="158"/>';
      // sensors (lambda before and after cat)
      [404, 350].forEach(function (x) {
        s += '<g class="exhaust-pulse"><rect class="k-warn s-dark" stroke-width="1" x="' + (x - 4) + '" y="118" width="8" height="24" rx="2"/>' +
          '<path class="k-none s-warn" stroke-width="2" d="M' + x + ',118 Q' + x + ',100 ' + (x + 16) + ',96"/></g>';
      });
      // labels (alternating rows)
      var lb = function (x, y, txt, cls) { return L.label(x, y, ctx.t(txt), { bg: true, size: 12, cls: cls }); };
      s += lb(440, 176, { cs: 'motor', en: 'engine' });
      s += lb(376, 196, { cs: 'katalyzátor', en: 'catalyst' });
      s += lb(320, 222, pfLabel(ctx.vehicle));
      s += lb(186, 196, { cs: 'střední tlumič', en: 'centre silencer' });
      s += lb(82, 222, { cs: 'zadní tlumič', en: 'rear silencer' });
      s += lb(150, 116, { cs: 'pryžové závěsy', en: 'rubber hangers' });
      s += lb(386, 80, { cs: 'lambda sondy', en: 'lambda sensors' }, 'k-warn');
      s += L.label(16, 286, ctx.t({ cs: 'Směr výfukových plynů: zprava doleva (od motoru k zádi)', en: 'Gas flow: right to left (engine to tail)' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Přehled výfukového systému', en: 'Exhaust system overview' }));
    }
  });

  /** Flange with two bolts – penetrating oil and soak time. */
  function flange(cx, cy, cls) {
    return '<g class="' + (cls || '') + '"><rect class="k-metal2 s-dark" stroke-width="1.5" x="' + (cx - 10) + '" y="' + (cy - 46) + '" width="20" height="92" rx="5"/></g>';
  }

  A.register('exhaust.soak', {
    render: function (ctx) {
      var s = '<rect class="k-metal s-dark" stroke-width="1.5" x="40" y="128" width="190" height="44" rx="6"/>' +
        '<rect class="k-metal s-dark" stroke-width="1.5" x="250" y="128" width="190" height="44" rx="6"/>' +
        '<rect class="k-rust" opacity=".6" x="200" y="104" width="80" height="92" rx="6"/>' +
        flange(228, 150) + flange(252, 150);
      [114, 186].forEach(function (y) {
        s += '<rect class="k-metal2 s-dark" stroke-width="1" x="210" y="' + (y - 5) + '" width="60" height="10" rx="2"/>' + L.hex(282, y, 9, 'k-rust');
      });
      s += '<g class="exhaust-wet"><ellipse class="k-oil" opacity=".6" cx="282" cy="114" rx="16" ry="12"/><ellipse class="k-oil" opacity=".6" cx="282" cy="186" rx="16" ry="12"/></g>';
      // spray can
      s += '<g transform="translate(360,56)"><g class="exhaust-can"><rect class="k-danger s-dark" stroke-width="1.5" x="0" y="0" width="34" height="64" rx="6"/>' +
        '<rect class="k-dark" x="6" y="-12" width="14" height="14" rx="3"/><rect class="k-white" opacity=".6" x="5" y="16" width="24" height="18" rx="3"/></g></g>';
      s += '<g class="exhaust-mist"><path class="k-oil" opacity=".45" d="M358,52 L292,100 L300,124 Z"/><path class="k-oil" opacity=".35" d="M358,52 L290,170 L306,184 Z"/></g>';
      // timer
      s += '<g transform="translate(410,230)"><circle class="k-labelbg s-dark" stroke-width="2" r="26"/><g class="exhaust-timer"><line class="s-accent" stroke-width="4" stroke-linecap="round" x1="0" y1="0" x2="0" y2="-20"/></g><circle class="k-dark" r="4"/></g>';
      s += L.label(330, 234, ctx.t({ cs: '10–15 min', en: '10–15 min' }), { anchor: 'end', bg: true });
      s += L.label(16, 24, ctx.t({ cs: 'Rezavé spoje nastříkat a nechat působit', en: 'Spray rusty joints and let it soak' }), { anchor: 'start', bg: true });
      s += L.warnIcon(32, 268) + L.label(52, 272, ctx.t({ cs: 'Jen studený výfuk – hořlavé!', en: 'Cold exhaust only – flammable!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Nastříkání rezavých spojů', en: 'Soaking rusty fasteners' }));
    }
  });

  A.register('exhaust.clamp', {
    render: function (ctx) {
      var s = '<g class="exhaust-split"><rect class="k-metal s-dark" stroke-width="1.5" x="30" y="128" width="200" height="44" rx="6"/>' + flange(228, 150) + '</g>' +
        '<rect class="k-metal s-dark" stroke-width="1.5" x="250" y="128" width="200" height="44" rx="6"/>' + flange(252, 150);
      s += '<g class="exhaust-gasket"><rect class="k-ok" x="236" y="104" width="8" height="92" rx="3"/>' +
        L.label(240, 222, ctx.t({ cs: 'Vždy nové těsnění + matice', en: 'Always a new gasket + nuts' }), { bg: true, cls: 'k-ok' }) + '</g>';
      [114, 186].forEach(function (y) {
        s += '<rect class="k-metal2 s-dark" stroke-width="1" x="210" y="' + (y - 5) + '" width="72" height="10" rx="2"/>';
        s += '<g transform="translate(286,' + y + ')"><g class="exhaust-nut">' + L.hex(0, 0, 9, 'k-metal') + '</g></g>';
      });
      s += L.rotArrow(286, 114, 22, 'ccw', 'accent', 200);
      s += L.label(16, 24, ctx.t({ cs: 'Matice přírub povolit, spoj rozpojit', en: 'Undo the flange nuts, separate the joint' }), { anchor: 'start', bg: true });
      s += L.label(16, 286, ctx.t({ cs: 'Zapečené šrouby: raději uříznout než strhnout závit', en: 'Seized bolts: cut them rather than strip a thread' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Povolení přírubového spoje', en: 'Releasing a flange joint' }));
    }
  });

  A.register('exhaust.sensor', {
    render: function (ctx) {
      var s = '<rect class="k-metal s-dark" stroke-width="1.5" x="20" y="190" width="440" height="44" rx="8"/>' +
        '<rect class="k-metal2" x="150" y="178" width="40" height="16" rx="3"/>' + L.hex(170, 172, 14, 'k-warn') +
        '<rect class="k-warn" x="164" y="150" width="12" height="18"/>' +
        '<path class="k-none s-dark" stroke-width="5" stroke-linecap="round" d="M170,150 Q170,90 240,90 L270,90"/>' +
        '<rect class="k-dark" x="268" y="78" width="36" height="24" rx="4"/>' +
        '<g class="exhaust-plug"><rect class="k-dark" x="304" y="78" width="36" height="24" rx="4"/><rect class="k-ok" x="304" y="82" width="6" height="16"/>' +
        '<path class="k-none s-dark" stroke-width="5" stroke-linecap="round" d="M340,90 L410,90"/></g>';
      // strap supporting exhaust
      s += '<g class="exhaust-strap"><path class="k-none s-accent" stroke-width="6" d="M424,120 L424,186 Q424,240 446,240 Q468,240 468,186 L468,120"/>' +
        L.label(470, 256, ctx.t({ cs: 'Výfuk podepřít / zavěsit', en: 'Support / hang the exhaust' }), { bg: true, anchor: 'end' }) + '</g>';
      s += L.label(16, 24, ctx.t({ cs: 'Nejdřív odpojit konektor sondy – kabel nekroutit', en: 'Unplug the sensor connector first – never twist the wire' }), { anchor: 'start', bg: true });
      s += L.label(170, 140, ctx.t({ cs: 'lambda sonda', en: 'lambda sensor' }), { bg: true, size: 12, anchor: 'end' });
      s += L.label(16, 286, ctx.t({ cs: 'Flexi trubka nesmí nést váhu', en: 'The flex pipe must not carry the weight' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Odpojení sond a podepření výfuku', en: 'Unplugging sensors and supporting the exhaust' }));
    }
  });

  A.register('exhaust.hanger', {
    render: function (ctx) {
      var s = '<rect class="k-body" opacity=".35" x="0" y="0" width="480" height="60"/>' +
        '<rect class="k-metal2" x="150" y="60" width="10" height="40"/><circle class="k-metal2" cx="155" cy="100" r="7"/>' +
        '<g class="exhaust-hangoff"><g class="exhaust-hang"><rect class="k-dark" x="140" y="86" width="30" height="70" rx="12"/>' +
        '<circle class="k-ground" cx="155" cy="100" r="6"/><circle class="k-ground" cx="155" cy="142" r="6"/></g></g>' +
        '<rect class="k-metal2" x="150" y="138" width="10" height="70"/>' +
        '<rect class="k-metal s-dark" stroke-width="1.5" x="40" y="200" width="400" height="40" rx="8"/>' +
        '<g class="exhaust-tool"><g transform="translate(176,120)"><path class="k-danger s-dark" stroke-width="1.5" d="M0,-8 L80,-18 L84,-10 L6,4 Z"/><path class="k-danger s-dark" stroke-width="1.5" d="M0,8 L80,18 L84,10 L6,-4 Z"/></g></g>' +
        L.label(16, 286, ctx.t({ cs: 'Závěs namazat (mýdlová voda / silikon) a stáhnout kleštěmi', en: 'Lubricate the hanger (soapy water / silicone) and lever it off' }), { anchor: 'start', bg: true }) +
        L.label(464, 90, ctx.t({ cs: 'Nikdy olej – rozleptá pryž', en: 'Never oil – it rots rubber' }), { anchor: 'end', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Sundání pryžového závěsu', en: 'Removing a rubber hanger' }));
    }
  });

  A.register('exhaust.fit', {
    render: function (ctx) {
      var s = '<rect class="k-metal s-dark" stroke-width="1.5" x="260" y="128" width="200" height="44" rx="6"/>' +
        '<g class="exhaust-newsec"><rect class="k-ok s-dark" stroke-width="1.5" opacity=".9" x="40" y="132" width="230" height="36" rx="6"/>' +
        '<rect class="k-metal2 s-dark" stroke-width="1.5" x="60" y="120" width="110" height="60" rx="22"/></g>' +
        '<g class="exhaust-clampin"><rect class="k-metal2 s-dark" stroke-width="2" x="248" y="118" width="26" height="64" rx="6"/>' + L.hex(261, 108, 8, 'k-metal') + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Nový díl nasadit, spoje jen volně (ještě nedotahovat)', en: 'Fit the new part, joints loosely only (do not tighten yet)' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Nejdřív zavěsit do závěsů, pak spojit', en: 'Hang it in the hangers first, then join' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Nasazení nového dílu', en: 'Fitting the new part' }));
    }
  });

  A.register('exhaust.align', {
    render: function (ctx) {
      // rear view of the bumper with tailpipe cutout
      var s = '<path class="k-body s-dark" stroke-width="2" d="M20,40 L460,40 L460,190 Q460,220 430,220 L50,220 Q20,220 20,190 Z"/>' +
        '<rect class="k-dark" x="300" y="150" width="110" height="50" rx="20"/>' +
        '<g class="exhaust-tipalign"><circle class="k-metal s-dark" stroke-width="2" cx="355" cy="175" r="20"/><circle class="k-dark" cx="355" cy="175" r="13"/></g>' +
        '<g class="exhaust-okfade">' + L.arrow(305, 175, 331, 175, 'ok', 3) + L.arrow(405, 175, 379, 175, 'ok', 3) + L.check(440, 120) + '</g>' +
        // heat shield clearance
        '<rect class="k-metal2" x="30" y="240" width="140" height="10" rx="3"/><rect class="k-metal s-dark" stroke-width="1.5" x="30" y="262" width="140" height="20" rx="6"/>' +
        L.arrow(188, 246, 188, 266, 'accent', 3) + L.arrow(188, 266, 188, 246, 'accent', 3) +
        L.label(204, 258, ctx.t({ cs: 'mezera k tepelnému štítu / karoserii', en: 'gap to heat shield / body' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 24, ctx.t({ cs: 'Koncovka uprostřed výřezu, nikde se nedotýká', en: 'Tip centred in the cutout, touching nothing' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Vyrovnání výfuku', en: 'Aligning the exhaust' }));
    }
  });

  A.register('exhaust.tighten', {
    render: function (ctx) {
      var s = '<path class="k-none s-metal" stroke-width="12" stroke-linecap="round" d="M450,140 L30,140"/>';
      var joints = [400, 300, 190, 90];
      joints.forEach(function (x, i) {
        s += '<rect class="k-metal2 s-dark" stroke-width="1.5" x="' + (x - 6) + '" y="118" width="12" height="44" rx="3"/>';
        s += '<g class="exhaust-seq' + i + '"><circle class="k-accent" cx="' + x + '" cy="92" r="16"/><text x="' + x + '" y="97" text-anchor="middle" font-size="15" font-weight="800" class="k-badgetext">' + (i + 1) + '</text>' + L.check(x, 196) + '</g>';
      });
      s += '<rect class="k-metal2" x="430" y="110" width="44" height="60" rx="6"/>';
      s += L.arrow(420, 236, 70, 236, 'accent', 4);
      s += L.label(245, 262, ctx.t({ cs: 'Dotahovat od motoru dozadu', en: 'Tighten from the engine backwards' }), { bg: true });
      s += L.label(16, 24, ctx.t({ cs: 'Moment dle příručky, nové matice', en: 'Torque per manual, new nuts' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Pořadí dotahování spojů', en: 'Tightening order of the joints' }));
    }
  });

  A.register('exhaust.leak', {
    render: function (ctx) {
      var s = '<rect class="k-metal s-dark" stroke-width="1.5" x="30" y="150" width="200" height="40" rx="6"/>' +
        '<rect class="k-metal s-dark" stroke-width="1.5" x="250" y="150" width="200" height="40" rx="6"/>' +
        flange(228, 170) + flange(252, 170);
      for (var i = 0; i < 4; i++) {
        s += '<circle class="k-muted exhaust-puff" style="animation-delay:' + (i * 0.45) + 's" cx="' + (236 + (i % 2) * 10) + '" cy="120" r="12"/>';
      }
      s += L.label(16, 24, ctx.t({ cs: 'Netěsnost: syčení, černé saze u spoje', en: 'Leak: hissing, black soot at the joint' }), { anchor: 'start', bg: true });
      s += '<g transform="translate(380,90)"><rect class="k-ok" x="-50" y="-26" width="100" height="40" rx="8"/>' +
        '<text x="0" y="0" text-anchor="middle" font-size="13" font-weight="800" class="k-white">' + S.esc(ctx.t({ cs: 'VENKU', en: 'OUTDOORS' })) + '</text></g>';
      s += L.warnIcon(32, 268) + L.label(52, 272, ctx.t({ cs: 'CO zabíjí – motor nikdy v zavřené garáži', en: 'CO kills – never run the engine in a closed garage' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      s += L.label(16, 238, ctx.t({ cs: 'Rukou nesahat – trubka se rychle zahřeje', en: 'Do not touch – the pipe heats up fast' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Kontrola těsnosti výfuku', en: 'Exhaust leak check' }));
    }
  });

  A.register('exhaust.legal', {
    render: function (ctx) {
      var s = '';
      // E-mark plate
      s += '<g transform="translate(110,110)"><rect class="k-metal s-dark" stroke-width="2" x="-80" y="-52" width="160" height="104" rx="8"/>' +
        '<circle class="k-none s-dark" stroke-width="3" cx="-42" cy="-12" r="24"/><text x="-42" y="-4" text-anchor="middle" font-size="22" font-weight="800" class="k-dark">e8</text>' +
        '<text x="20" y="-18" font-size="12" font-weight="700" class="k-dark">00 1234</text><text x="20" y="0" font-size="12" font-weight="700" class="k-dark">R59 / R92</text>' +
        '<text x="-66" y="38" font-size="11" font-weight="600" class="k-dark">' + S.esc(ctx.t({ cs: 'číslo homologace', en: 'approval number' })) + '</text></g>';
      // dB meter
      s += '<g transform="translate(380,120)"><rect class="k-dark" x="-60" y="-60" width="120" height="110" rx="12"/><circle class="k-metal" cy="0" r="40"/>' +
        '<path class="k-none s-ok" stroke-width="7" d="M-34,-22 A40,40 0 0 1 14,-38"/><path class="k-none s-danger" stroke-width="7" d="M22,-34 A40,40 0 0 1 40,-6"/>' +
        '<g class="exhaust-needle"><line class="s-dark" stroke-width="3" stroke-linecap="round" x1="0" y1="0" x2="0" y2="-34"/></g><circle class="k-dark" r="5"/>' +
        '<text y="36" text-anchor="middle" font-size="14" font-weight="800" class="k-white">dB</text></g>';
      // STK stamp
      s += '<g transform="translate(250,224)"><g class="exhaust-stamp"><circle class="k-none s-ok" stroke-width="4" r="34"/>' +
        '<text y="6" text-anchor="middle" font-size="18" font-weight="900" class="k-ok">STK ✔</text></g></g>';
      s += L.label(16, 24, ctx.t({ cs: 'Jen homologované díly + doklady + limit hluku', en: 'Homologated parts only + documents + noise limit' }), { anchor: 'start', bg: true });
      s += L.label(110, 192, ctx.t({ cs: 'značka E/e na dílu', en: 'E/e mark on the part' }), { bg: true, size: 12 });
      s += L.label(380, 196, ctx.t({ cs: 'hluk v limitu', en: 'noise within limit' }), { bg: true, size: 12 });
      s += L.label(16, 286, ctx.t({ cs: 'Nikdy: odstranění DPF/GPF/katalyzátoru/EGR', en: 'Never: removing DPF/GPF/catalyst/EGR' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Legální úprava výfuku', en: 'Legal exhaust modification' }));
    }
  });

  A.register('exhaust.valve', {
    render: function (ctx) {
      var s = '<rect class="k-metal s-dark" stroke-width="1.5" x="40" y="110" width="300" height="60" rx="8"/>' +
        '<rect class="k-dark" opacity=".25" x="40" y="118" width="300" height="44"/>' +
        '<g transform="translate(200,118)"><g class="exhaust-flap"><rect class="k-danger" x="-3" y="0" width="6" height="44" rx="2"/></g></g>' +
        '<circle class="k-dark" cx="200" cy="118" r="5"/>' +
        // actuator + controller
        '<rect class="k-dark" x="180" y="60" width="40" height="30" rx="5"/><line class="s-dark" stroke-width="3" x1="200" y1="90" x2="200" y2="112"/>' +
        '<path class="k-none s-warn" stroke-width="3" d="M220,74 Q300,74 330,48 L380,48"/>' +
        '<g transform="translate(410,48)"><rect class="k-dark" x="-30" y="-24" width="60" height="48" rx="8"/><circle class="k-accent exhaust-sigon" r="10"/></g>' +
        '<g class="exhaust-loud"><path class="k-none s-accent" stroke-width="3" stroke-linecap="round" d="M28,124 q-10,16 0,32 M16,116 q-16,24 0,48"/></g>' +
        L.label(410, 96, ctx.t({ cs: 'ovladač', en: 'controller' }), { bg: true, size: 12 }) +
        L.label(16, 24, ctx.t({ cs: 'Klapka otevřená = hlasitější, zavřená = tišší', en: 'Flap open = louder, closed = quieter' }), { anchor: 'start', bg: true }) +
        L.label(16, 222, ctx.t({ cs: 'Homologace platí jen v popsaném režimu', en: 'Approval only valid in the described mode' }), { anchor: 'start', bg: true }) +
        L.label(16, 254, ctx.t({ cs: 'Koncovky: stejné značení / žádné ostré hrany', en: 'Tips: no sharp edges, must not protrude' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Výfuk s klapkou', en: 'Valved exhaust' }));
    }
  });

  A.register('exhaust.tips', {
    render: function (ctx) {
      var s = '<rect class="k-metal s-dark" stroke-width="1.5" x="20" y="130" width="250" height="36" rx="6"/>' +
        '<g class="exhaust-tipon"><rect class="k-metal2 s-dark" stroke-width="1.5" x="230" y="118" width="140" height="60" rx="10"/><rect class="k-dark" x="362" y="124" width="10" height="48" rx="4"/>' +
        L.hex(260, 108, 8, 'k-metal') + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Koncovku nasunout a zajistit objímkou', en: 'Slide the tip on and secure the clamp' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Nesmí přesahovat obrys vozu ani mít ostré hrany', en: 'Must not stick out past the body or have sharp edges' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Výměna koncovek', en: 'Fitting exhaust tips' }));
    }
  });

  A.register('exhaust.downpipe', {
    render: function (ctx) {
      var s = '<circle class="k-metal2 s-dark" stroke-width="2" cx="400" cy="70" r="40"/>' +
        '<circle class="k-dark" cx="400" cy="70" r="16"/>' + L.label(400, 130, ctx.t({ cs: 'turbo', en: 'turbo' }), { bg: true, size: 12 }) +
        '<path class="k-none s-metal" stroke-width="16" stroke-linecap="round" d="M380,100 Q350,170 280,180 L60,180"/>' +
        '<rect class="k-ok s-dark" stroke-width="1.5" x="190" y="160" width="70" height="40" rx="8"/>' +
        L.label(225, 222, ctx.t({ cs: 'sport kat. s homologací', en: 'homologated sport cat' }), { bg: true, size: 12 }) +
        '<g class="exhaust-doc"><g transform="translate(60,50)"><rect class="k-metal s-dark" stroke-width="1.5" x="0" y="0" width="60" height="76" rx="4"/>' +
        '<line class="s-dark" stroke-width="2" x1="10" y1="16" x2="50" y2="16"/><line class="s-dark" stroke-width="2" x1="10" y1="28" x2="50" y2="28"/><line class="s-dark" stroke-width="2" x1="10" y1="40" x2="40" y2="40"/></g>' +
        L.label(90, 144, ctx.t({ cs: 'doklady', en: 'documents' }), { bg: true, size: 12 }) + '</g>' +
        '<g class="exhaust-chip"><g transform="translate(170,60)"><rect class="k-dark" x="0" y="0" width="56" height="56" rx="6"/>' +
        [0, 1, 2, 3].map(function (i) { return '<rect class="k-metal" x="' + (8 + i * 12) + '" y="-8" width="4" height="8"/><rect class="k-metal" x="' + (8 + i * 12) + '" y="56" width="4" height="8"/>'; }).join('') +
        '<text x="28" y="34" text-anchor="middle" font-size="13" font-weight="800" class="k-white">ECU</text></g>' +
        L.label(198, 144, ctx.t({ cs: 'kalibrace', en: 'calibration' }), { bg: true, size: 12 }) + '</g>' +
        '<g transform="translate(300,80)"><g class="exhaust-stk"><circle class="k-none s-ok" stroke-width="4" r="30"/><text y="6" text-anchor="middle" font-size="15" font-weight="900" class="k-ok">STK</text></g></g>' +
        L.label(16, 24, ctx.t({ cs: 'Downpipe = díl + kalibrace + homologace + zápis', en: 'Downpipe = part + calibration + approval + registration' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Doporučeno pro specializovanou dílnu', en: 'Recommended for a specialist workshop' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Downpipe se sportovním katalyzátorem', en: 'Downpipe with sport catalyst' }));
    }
  });
})(window.STU);
