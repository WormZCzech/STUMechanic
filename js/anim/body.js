/* Animations: bodywork – dent & rust repair, filler, primer, paint, polish. */
(function (S) {
  'use strict';
  var L = S.animLib, A = S.anim;

  /* deterministic pseudo-random for guide coat dots / dirt */
  function rng(seed) {
    var x = seed || 7;
    return function () { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; };
  }

  /* spray gun pass keyframes: 5 rows, gun sweeps left→right on each */
  var ROWS = [98, 126, 154, 182, 210];
  function sprayCss() {
    var gun = [], out = [];
    ROWS.forEach(function (y, i) {
      var a = 4 + i * 18, b = a + 15;
      gun.push(a + '%{transform:translate(110px,' + (y - 30) + 'px)}');
      gun.push(b + '%{transform:translate(370px,' + (y - 30) + 'px)}');
      out.push('.body-st' + i + '{transform-box:fill-box;transform-origin:left center;animation:body-st' + i + ' 10s linear infinite}' +
        '@keyframes body-st' + i + '{0%,' + a + '%{transform:scaleX(0)}' + b + '%,96%{transform:scaleX(1)}100%{transform:scaleX(0)}}');
    });
    out.push('.body-gun{animation:body-gun 10s linear infinite}@keyframes body-gun{0%{transform:translate(110px,' + (ROWS[0] - 30) + 'px)}' +
      gun.join('') + '96%,100%{transform:translate(370px,' + (ROWS[4] - 30) + 'px)}}');
    return out.join('\n');
  }

  A.css('body', [
    /* assess */
    '.body-lamp{animation:body-lamp 6s ease-in-out infinite}',
    '@keyframes body-lamp{0%,100%{transform:translateX(0)}50%{transform:translateX(300px)}}',
    '.body-magS{animation:body-magS 6s ease-in-out infinite}',
    '@keyframes body-magS{0%,10%{transform:translate(50px,-120px);opacity:0}15%{opacity:1}35%,92%{transform:translate(0,0);opacity:1}100%{transform:translate(0,0);opacity:0}}',
    '.body-magA{animation:body-magA 6s ease-in-out infinite}',
    '@keyframes body-magA{0%,10%{transform:translate(50px,-120px);opacity:0}15%{opacity:1}35%,45%{transform:translate(0,0);opacity:1}70%,100%{transform:translate(0,90px);opacity:0}}',
    '.body-res{animation:body-res 6s ease-in-out infinite;opacity:0}',
    '@keyframes body-res{0%,40%{opacity:0}48%,92%{opacity:1}100%{opacity:0}}',
    /* ppe */
    '.body-pop{animation:body-pop 4.5s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes body-pop{0%,100%{transform:scale(1)}12%{transform:scale(1.15)}24%{transform:scale(1)}}',
    /* clean */
    '.body-wipe{animation:body-wipe 2.4s ease-in-out infinite}',
    '@keyframes body-wipe{0%,100%{transform:translateX(-120px)}50%{transform:translateX(120px)}}',
    '.body-dirt{animation:body-dirt 7s ease-in infinite}',
    '@keyframes body-dirt{0%,10%{opacity:1}70%,95%{opacity:0}100%{opacity:1}}',
    /* mask */
    '.body-tape{stroke-dasharray:1000;animation:body-tape 7s ease-in-out infinite}',
    '@keyframes body-tape{0%,5%{stroke-dashoffset:1000}45%,95%{stroke-dashoffset:0}100%{stroke-dashoffset:1000}}',
    '.body-paper{animation:body-paper 7s ease-in-out infinite;opacity:0}',
    '@keyframes body-paper{0%,45%{opacity:0}60%,95%{opacity:.85}100%{opacity:0}}',
    /* dent pull */
    '.body-d0{animation:body-d0 6s steps(1,end) infinite}@keyframes body-d0{0%{opacity:1}33%,100%{opacity:0}}',
    '.body-d1{animation:body-d1 6s steps(1,end) infinite;opacity:0}@keyframes body-d1{0%{opacity:0}33%{opacity:1}66%,100%{opacity:0}}',
    '.body-d2{animation:body-d2 6s steps(1,end) infinite;opacity:0}@keyframes body-d2{0%,33%{opacity:0}66%{opacity:1}100%{opacity:1}}',
    '.body-dolly{animation:body-dolly 6s steps(1,end) infinite}',
    '@keyframes body-dolly{0%{transform:translateY(172px)}33%{transform:translateY(158px)}66%,100%{transform:translateY(146px)}}',
    '.body-ham{animation:body-ham .75s ease-in infinite;transform-origin:110px 0px}',
    '@keyframes body-ham{0%{transform:rotate(28deg)}80%{transform:rotate(0)}100%{transform:rotate(28deg)}}',
    /* grind */
    '.body-disc{animation:body-disc 8s ease-in-out infinite}',
    '@keyframes body-disc{0%,5%{transform:translate(420px,40px);opacity:0}12%{transform:translate(240px,150px);opacity:1}25%{transform:translate(190px,130px)}38%{transform:translate(290px,170px)}50%{transform:translate(200px,170px)}62%{transform:translate(285px,128px)}72%{transform:translate(240px,150px);opacity:1}80%,100%{transform:translate(420px,40px);opacity:0}}',
    '.body-rustoff{animation:body-rustoff 8s ease-in infinite}',
    '@keyframes body-rustoff{0%,12%{opacity:1}70%,96%{opacity:0}100%{opacity:1}}',
    '.body-ringon{animation:body-ringon 8s ease-in infinite;opacity:0}',
    '@keyframes body-ringon{0%,20%{opacity:0}70%,96%{opacity:1}100%{opacity:0}}',
    '.body-late{animation:body-late 8s ease-in infinite;opacity:0}',
    '@keyframes body-late{0%,74%{opacity:0}80%,96%{opacity:1}100%{opacity:0}}',
    /* mix */
    '.body-spat{animation:body-spat 3s ease-in-out infinite;transform-origin:150px 170px}',
    '@keyframes body-spat{0%,100%{transform:rotate(-35deg)}50%{transform:rotate(35deg)}}',
    '.body-stripe{animation:body-stripe 9s ease-in infinite}',
    '@keyframes body-stripe{0%,15%{opacity:1}75%,95%{opacity:0}100%{opacity:1}}',
    '.body-mixed{animation:body-mixed 9s ease-in infinite;opacity:0}',
    '@keyframes body-mixed{0%,15%{opacity:0}75%,95%{opacity:.45}100%{opacity:0}}',
    /* filler apply – 3 passes */
    '.body-spr{animation:body-spr 9s linear infinite}',
    '@keyframes body-spr{0%{transform:translate(120px,0);opacity:1}28%{transform:translate(360px,0);opacity:1}30%{opacity:0;transform:translate(360px,0)}31%{transform:translate(120px,-6px);opacity:0}33%{opacity:1;transform:translate(120px,-6px)}61%{transform:translate(360px,-6px);opacity:1}63%{opacity:0;transform:translate(360px,-6px)}64%{transform:translate(120px,-14px);opacity:0}66%{opacity:1;transform:translate(120px,-14px)}94%{transform:translate(360px,-14px);opacity:1}96%,100%{transform:translate(360px,-14px);opacity:0}}',
    '.body-f0{animation:body-f0 9s linear infinite;opacity:0}@keyframes body-f0{0%,4%{opacity:0}26%,97%{opacity:1}100%{opacity:0}}',
    '.body-f1{animation:body-f1 9s linear infinite;opacity:0}@keyframes body-f1{0%,37%{opacity:0}59%,97%{opacity:1}100%{opacity:0}}',
    '.body-f2{animation:body-f2 9s linear infinite;opacity:0}@keyframes body-f2{0%,70%{opacity:0}92%,97%{opacity:1}100%{opacity:0}}',
    /* block sanding */
    '.body-block{animation:body-block 2.6s ease-in-out infinite}',
    '@keyframes body-block{0%,100%{transform:translate(-70px,-25px)}25%{transform:translate(70px,25px)}50%{transform:translate(-70px,25px)}75%{transform:translate(70px,-25px)}}',
    [0, 1, 2, 3].map(function (i) {
      var a = 12 + i * 14;
      return '.body-gc' + i + '{animation:body-gc' + i + ' 8s linear infinite}@keyframes body-gc' + i + '{0%,' + a + '%{opacity:1}' + (a + 10) + '%,95%{opacity:0}100%{opacity:1}}';
    }).join('\n'),
    /* spray */
    sprayCss(),
    /* layers */
    [0, 1, 2, 3, 4, 5].map(function (i) {
      var a = 2 + i * 13;
      return '.body-ly' + i + '{animation:body-ly' + i + ' 9s ease-out infinite;opacity:0}@keyframes body-ly' + i + '{0%,' + a + '%{opacity:0;transform:translateY(-14px)}' + (a + 7) + '%,95%{opacity:1;transform:translateY(0)}100%{opacity:0}}';
    }).join('\n'),
    /* polish */
    '.body-orbit{animation:body-orbit 3s linear infinite;transform-origin:240px 150px}',
    '@keyframes body-orbit{to{transform:rotate(360deg)}}',
    '.body-haze{animation:body-haze 8s ease-in infinite}',
    '@keyframes body-haze{0%,10%{opacity:1}75%,95%{opacity:0}100%{opacity:1}}',
    '.body-shine{animation:body-shine 8s ease-in infinite;opacity:0}',
    '@keyframes body-shine{0%,60%{opacity:0}78%,95%{opacity:1}100%{opacity:0}}'
  ].join('\n'));

  /* ------------------------------------------------------------ helpers */
  function panel(cls) {
    return '<rect class="' + (cls || 'k-body') + ' s-dark" stroke-width="2" x="30" y="50" width="420" height="200" rx="18"/>' +
      '<path class="k-none s-white" opacity=".22" stroke-width="6" stroke-linecap="round" d="M56,68 L424,68"/>';
  }
  function top(ctx, cs, en) { return L.label(16, 24, ctx.t({ cs: cs, en: en }), { anchor: 'start', bg: true }); }
  function bottom(ctx, cs, en, x, anchor) { return L.label(x == null ? 16 : x, 284, ctx.t({ cs: cs, en: en }), { anchor: anchor || 'start', bg: true }); }
  function isAlu(v) { return v === 'mb-cl500-c216' || v === 'toyota-gr-yaris'; }
  function magnet() {
    return '<path class="k-danger s-dark" stroke-width="1.5" d="M-16,-26 L-16,4 A16,16 0 0 0 16,4 L16,-26 L7,-26 L7,4 A7,7 0 0 1 -7,4 L-7,-26 Z"/>' +
      '<rect class="k-metal" x="-16" y="-34" width="9" height="9"/><rect class="k-metal" x="7" y="-34" width="9" height="9"/>';
  }

  /* ------------------------------------------------------------ assess */
  A.register('body.assess', {
    render: function (ctx) {
      var s = panel();
      // dent shading
      s += '<ellipse class="k-body2" cx="230" cy="150" rx="70" ry="42"/><ellipse class="k-dark" opacity=".18" cx="238" cy="156" rx="44" ry="24"/>';
      // reflection lines bending over the dent
      [90, 120, 150, 180, 210].forEach(function (y) {
        var d = 26 * Math.exp(-Math.pow((y - 150) / 45, 2));
        s += '<path class="k-none s-white" opacity=".75" stroke-width="3.5" d="M40,' + y + ' L160,' + y + ' Q230,' + (y + 2 * d).toFixed(1) + ' 300,' + y + ' L440,' + y + '"/>';
      });
      s += '<ellipse class="k-none s-accent lib-fade" stroke-width="2.5" stroke-dasharray="6 5" cx="230" cy="150" rx="80" ry="50"/>';
      // lamp sweeping
      s += '<g transform="translate(70,44)"><g class="body-lamp"><rect class="k-dark" x="-18" y="-14" width="36" height="12" rx="3"/>' +
        '<rect class="k-warn" x="-14" y="-4" width="28" height="5" rx="2"/></g></g>';
      // magnet test
      var alu = isAlu(ctx.vehicle);
      s += '<g transform="translate(395,200)"><g class="' + (alu ? 'body-magA' : 'body-magS') + '">' + magnet() + '</g></g>';
      var res = ctx.vehicle === 'generic'
        ? { cs: 'Magnet drží = ocel · nedrží = hliník / plast', en: 'Magnet sticks = steel · not = aluminium / plastic' }
        : alu ? { cs: 'Magnet nedrží = hliník!', en: 'Magnet falls = aluminium!' }
          : { cs: 'Magnet drží = ocelový díl', en: 'Magnet sticks = steel panel' };
      s += '<g class="body-res">' + L.label(464, 284, ctx.t(res), { anchor: 'end', bg: true, cls: alu ? 'k-danger' : 'k-text' }) + '</g>';
      s += top(ctx, 'Odraz rovných čar odhalí promáčklinu', 'Reflected straight lines reveal the dent');
      return L.svg(s, ctx.t({ cs: 'Posouzení poškození a test magnetem', en: 'Assessing damage and magnet test' }));
    }
  });

  /* ------------------------------------------------------------ ppe */
  A.register('body.ppe', {
    render: function (ctx) {
      var s = '';
      // respirator
      s += '<g transform="translate(95,140)"><g class="body-pop">' +
        '<path class="k-metal2 s-dark" stroke-width="2" d="M-38,-30 Q0,-58 38,-30 L30,22 Q0,40 -30,22 Z"/>' +
        '<circle class="k-accent s-dark" stroke-width="2" cx="-40" cy="8" r="20"/><circle class="k-accent s-dark" stroke-width="2" cx="40" cy="8" r="20"/>' +
        '<circle class="k-dark" cx="-40" cy="8" r="9"/><circle class="k-dark" cx="40" cy="8" r="9"/>' +
        '<rect class="k-dark" x="-10" y="10" width="20" height="16" rx="4"/></g></g>';
      // glasses
      s += '<g transform="translate(240,140)"><g class="body-pop" style="animation-delay:1.5s">' +
        '<rect class="k-glass s-dark" stroke-width="3" x="-62" y="-22" width="52" height="40" rx="12"/>' +
        '<rect class="k-glass s-dark" stroke-width="3" x="10" y="-22" width="52" height="40" rx="12"/>' +
        '<path class="k-none s-dark" stroke-width="4" d="M-10,-6 Q0,-14 10,-6"/>' +
        '<path class="k-none s-white" opacity=".6" stroke-width="3" d="M-52,-10 L-36,-16 M20,-10 L36,-16"/></g></g>';
      // nitrile glove
      s += '<g transform="translate(385,150)"><g class="body-pop" style="animation-delay:3s">' +
        '<rect class="k-fluid s-dark" stroke-width="2" x="-26" y="-14" width="52" height="56" rx="12"/>' +
        [-20, -7, 6, 19].map(function (x, i) { return '<rect class="k-fluid s-dark" stroke-width="2" x="' + (x - 5) + '" y="' + (-50 + Math.abs(i - 1.5) * 6) + '" width="12" height="44" rx="6"/>'; }).join('') +
        '<rect class="k-fluid s-dark" stroke-width="2" x="-46" y="-6" width="30" height="13" rx="6" transform="rotate(-30 -30 0)"/>' +
        '<rect class="k-fluid" x="-24" y="-10" width="48" height="20"/></g></g>';
      s += L.label(95, 214, ctx.t({ cs: 'Polomaska A2P3', en: 'A2P3 half mask' }), { bg: true, size: 12 });
      s += L.label(240, 214, ctx.t({ cs: 'Uzavřené brýle', en: 'Sealed goggles' }), { bg: true, size: 12 });
      s += L.label(385, 214, ctx.t({ cs: 'Nitrilové rukavice', en: 'Nitrile gloves' }), { bg: true, size: 12 });
      s += L.warnIcon(30, 28) + L.label(54, 32, ctx.t({ cs: '2K laky = isokyanáty → bez masky nestříkat!', en: '2K paints = isocyanates → never spray without a mask!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      s += bottom(ctx, 'Broušení: respirátor P2/P3 · odsávání · hasicí přístroj', 'Sanding: P2/P3 respirator · extraction · fire extinguisher');
      return L.svg(s, ctx.t({ cs: 'Osobní ochranné pomůcky', en: 'Personal protective equipment' }));
    }
  });

  /* ------------------------------------------------------------ clean */
  A.register('body.clean', {
    render: function (ctx) {
      var r = rng(11), s = panel();
      var dirt = '';
      for (var i = 0; i < 40; i++) {
        dirt += '<circle class="k-dark" opacity=".55" cx="' + (70 + r() * 340).toFixed(0) + '" cy="' + (85 + r() * 140).toFixed(0) + '" r="' + (2 + r() * 4).toFixed(1) + '"/>';
      }
      s += '<g class="body-dirt">' + dirt + '</g>';
      s += '<g transform="translate(240,150)"><g class="body-wipe"><rect class="k-fluid s-dark" stroke-width="1.5" x="-38" y="-28" width="76" height="56" rx="10"/>' +
        '<path class="k-none s-white" opacity=".5" stroke-width="2" d="M-28,-14 L28,-14 M-28,0 L28,0 M-28,14 L28,14"/></g></g>';
      s += top(ctx, 'Umýt → odmašťovač silikonů (antisilikon)', 'Wash → silicone & wax remover');
      s += bottom(ctx, 'Jeden hadr mokrý, druhý hned suchý – vždy jedním směrem', 'One cloth wet, the other dry right after – wipe one way');
      return L.svg(s, ctx.t({ cs: 'Mytí a odmaštění', en: 'Washing and degreasing' }));
    }
  });

  /* ------------------------------------------------------------ mask */
  A.register('body.mask', {
    render: function (ctx) {
      var s = panel() + '<line class="s-dark" stroke-width="3" x1="330" y1="50" x2="330" y2="250"/>';
      s += '<ellipse class="k-filler" cx="200" cy="150" rx="70" ry="44"/>';
      s += '<rect class="k-none s-warn body-tape" stroke-width="8" x="80" y="78" width="236" height="144" rx="6"/>';
      s += '<rect class="k-filler body-paper s-dark" stroke-width="1" x="336" y="56" width="110" height="188" rx="4"/>';
      s += '<g class="body-paper">' + L.label(391, 150, ctx.t({ cs: 'Papír', en: 'Paper' }), { bg: true }) + '</g>';
      s += top(ctx, 'Krycí páska + papír na okolní díly', 'Masking tape + paper on adjacent panels');
      s += bottom(ctx, 'Zakrýt sklo, gumy, světla, lišty a spáry', 'Cover glass, rubbers, lights, trims and gaps');
      return L.svg(s, ctx.t({ cs: 'Zakrytí okolí', en: 'Masking the surroundings' }));
    }
  });

  /* ------------------------------------------------------------ dent pull (cross-section) */
  function plate(dip, cls) {
    var y = 140, d = dip;
    var top = 'M40,' + y + ' L160,' + y + ' Q240,' + (y + 2 * d) + ' 320,' + y + ' L440,' + y;
    var bot = 'L440,' + (y + 8) + ' L320,' + (y + 8) + ' Q240,' + (y + 8 + 2 * d) + ' 160,' + (y + 8) + ' L40,' + (y + 8) + ' Z';
    return '<path class="k-metal s-dark ' + cls + '" stroke-width="1.5" d="' + top + ' ' + bot + '"/>';
  }
  A.register('body.dentPull', {
    render: function (ctx) {
      var s = '<line class="s-line" stroke-width="1.5" stroke-dasharray="6 6" x1="40" y1="140" x2="440" y2="140"/>';
      s += plate(28, 'body-d0') + plate(14, 'body-d1') + plate(2, 'body-d2');
      // dolly from below
      s += '<g transform="translate(240,0)"><g class="body-dolly"><path class="k-metal2 s-dark" stroke-width="1.5" d="M-30,10 Q0,-2 30,10 L30,58 L-30,58 Z"/></g></g>';
      // hammer from above
      s += '<g transform="translate(240,104)"><g class="body-ham">' +
        '<rect class="k-dark" x="0" y="-5" width="110" height="10" rx="4"/>' +
        '<rect class="k-metal s-dark" stroke-width="1.5" x="-12" y="-26" width="24" height="54" rx="4"/></g></g>';
      s += L.label(110, 100, ctx.t({ cs: 'Kladivo', en: 'Hammer' }), { bg: true });
      s += L.label(320, 232, ctx.t({ cs: 'Kovadlinka zespodu', en: 'Dolly from behind' }), { bg: true, anchor: 'start' });
      s += top(ctx, 'Mnoho lehkých úderů – od okrajů ke středu', 'Many light taps – from the edges to the centre');
      s += L.warnIcon(28, 280) + L.label(50, 284, ctx.t({ cs: 'Plech nenatahovat silnými ranami!', en: 'Do not stretch the metal with heavy blows!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Vyrovnání promáčkliny kladivem a kovadlinkou (řez)', en: 'Hammer-and-dolly dent repair (cross-section)' }));
    }
  });

  /* ------------------------------------------------------------ grind rust */
  A.register('body.grind', {
    render: function (ctx) {
      var s = panel();
      s += '<g class="body-ringon"><ellipse class="k-muted" cx="240" cy="150" rx="118" ry="76"/>' +
        '<ellipse class="k-metal2" cx="240" cy="150" rx="98" ry="62"/><ellipse class="k-metal" cx="240" cy="150" rx="76" ry="46"/></g>';
      s += '<g class="body-rustoff"><path class="k-rust" d="M190,130 Q200,108 228,116 Q250,100 270,120 Q300,118 292,146 Q306,170 280,176 Q262,196 236,182 Q206,190 198,170 Q176,156 190,130 Z"/>' +
        '<circle class="k-rust" cx="306" cy="126" r="7"/><circle class="k-rust" cx="176" cy="178" r="5"/><circle class="k-dark" opacity=".3" cx="240" cy="150" r="14"/></g>';
      s += '<g class="body-disc"><g transform="translate(0,0)"><circle class="k-dark" r="40" opacity=".92"/><g class="spin-cw" style="animation-duration:.4s">' +
        '<circle class="k-warn" r="36" opacity=".85"/><path class="k-none s-dark" stroke-width="2" d="M-30,0 L30,0 M0,-30 L0,30"/></g><circle class="k-metal" r="8"/></g></g>';
      s += '<g class="body-late">' + L.label(240, 238, ctx.t({ cs: 'kov → základ → lak: plynulý přechod', en: 'metal → primer → paint: smooth feather' }), { bg: true }) + '</g>';
      s += top(ctx, 'P80 – rez odstranit 100 %, +2–3 cm za její okraj', 'P80 – remove 100 % of rust, +2–3 cm beyond its edge');
      s += bottom(ctx, 'Respirátor P3 + brýle · jiskry pryč od paliva', 'P3 respirator + goggles · sparks away from fuel');
      return L.svg(s, ctx.t({ cs: 'Obroušení koroze na holý kov', en: 'Grinding rust back to bare metal' }));
    }
  });

  /* ------------------------------------------------------------ layers (cross-section) */
  var LAYERS = [
    { cls: 'k-metal', h: 30, cs: 'Holý kov', en: 'Bare metal' },
    { cls: 'k-metal2', h: 12, cs: 'Epoxidový základ', en: 'Epoxy primer' },
    { cls: 'k-filler', h: 26, cs: 'Tmel (tence!)', en: 'Body filler (thin!)' },
    { cls: 'k-muted', h: 16, cs: 'Plnič 2K', en: '2K primer filler' },
    { cls: 'k-paint', h: 12, cs: 'Báze (barva)', en: 'Base coat (colour)' },
    { cls: 'k-glass', h: 12, cs: 'Bezbarvý lak 2K', en: '2K clear coat' }
  ];
  function layers(ctx, n, title, note) {
    var y = 250, s = '', ly0 = 999;
    for (var i = 0; i < n; i++) {
      var ly = LAYERS[i];
      y -= ly.h;
      var w = i === 2 ? 170 : 250;
      var x = i === 2 ? 80 : 40;
      var lyc = Math.min(y + ly.h / 2, ly0 - 21);
      ly0 = lyc;
      s += '<g class="body-ly' + i + '"><rect class="' + ly.cls + ' s-dark" stroke-width="1" x="' + x + '" y="' + y + '" width="' + w + '" height="' + ly.h + '" rx="' + (i === 2 ? 8 : 2) + '"' + (i === 5 ? ' opacity=".8"' : '') + '/>' +
        '<path class="k-none s-line" stroke-width="1" d="M' + (x + w) + ',' + (y + ly.h / 2) + ' L290,' + (y + ly.h / 2) + ' L304,' + lyc + '"/>' +
        L.label(312, lyc, ctx.t({ cs: ly.cs, en: ly.en }), { anchor: 'start', size: 12, bg: true }) + '</g>';
    }
    s += top(ctx, title.cs, title.en);
    if (note) s += bottom(ctx, note.cs, note.en);
    return s;
  }
  A.register('body.layers', {
    render: function (ctx) {
      return L.svg(layers(ctx, 6, { cs: 'Skladba opravy (řez, přehnaná tloušťka)', en: 'Repair build-up (cross-section, exaggerated)' },
        { cs: 'Každá vrstva jen na správně připravený podklad', en: 'Each layer only on a correctly prepared base' }), ctx.t({ cs: 'Skladba vrstev opravy', en: 'Repair layer build-up' }));
    }
  });
  A.register('body.epoxy', {
    render: function (ctx) {
      return L.svg(layers(ctx, 2, { cs: 'Holý kov ihned chránit epoxidovým základem', en: 'Protect bare metal immediately with epoxy primer' },
        { cs: 'Holá ocel začne rezavět během hodin', en: 'Bare steel starts to rust within hours' }), ctx.t({ cs: 'Epoxidový základ na holý kov', en: 'Epoxy primer on bare metal' }));
    }
  });

  /* ------------------------------------------------------------ mix filler */
  A.register('body.mix', {
    render: function (ctx) {
      var s = '<rect class="k-metal s-dark" stroke-width="2" x="40" y="80" width="230" height="170" rx="10"/>';
      s += '<ellipse class="k-filler s-dark" stroke-width="1" cx="150" cy="170" rx="80" ry="46"/>';
      s += '<ellipse class="k-paint body-mixed" cx="150" cy="170" rx="80" ry="46"/>';
      s += '<g class="body-stripe"><path class="k-none s-danger" stroke-width="5" stroke-linecap="round" d="M88,168 Q150,158 212,170"/></g>';
      s += '<g class="body-spat"><rect class="k-dark" x="146" y="88" width="8" height="70" rx="3"/><rect class="k-metal2 s-dark" stroke-width="1" x="132" y="150" width="36" height="22" rx="3"/></g>';
      // tubes
      s += '<g transform="translate(340,120)"><rect class="k-filler s-dark" stroke-width="1.5" x="-40" y="-30" width="80" height="70" rx="8"/>' +
        L.label(0, 8, ctx.t({ cs: 'Tmel', en: 'Filler' }), { size: 12 }) + '</g>';
      s += '<g transform="translate(340,206)"><rect class="k-danger s-dark" stroke-width="1.5" x="-12" y="-28" width="24" height="44" rx="6"/><rect class="k-dark" x="-6" y="-36" width="12" height="9" rx="2"/></g>';
      s += L.badge(410, 206, ctx.t({ cs: 'tužidlo 2–3 %', en: 'hardener 2–3 %' }), 'warn');
      s += top(ctx, 'Míchat stíráním, ne šleháním (bez bublin)', 'Mix by folding, not whipping (no bubbles)');
      s += bottom(ctx, 'Jednotná barva bez pruhů · zpracovat do ~4–5 min', 'Even colour, no streaks · use within ~4–5 min');
      return L.svg(s, ctx.t({ cs: 'Míchání tmelu s tužidlem', en: 'Mixing body filler with hardener' }));
    }
  });

  /* ------------------------------------------------------------ apply filler (cross-section) */
  A.register('body.filler', {
    render: function (ctx) {
      var s = '<line class="s-line" stroke-width="1.5" stroke-dasharray="6 6" x1="40" y1="150" x2="440" y2="150"/>';
      s += '<path class="k-metal s-dark" stroke-width="1.5" d="M40,150 L150,150 Q240,186 330,150 L440,150 L440,160 L330,160 Q240,196 150,160 L40,160 Z"/>';
      s += '<path class="k-metal2" d="M150,150 Q240,186 330,150 Q240,182 150,150 Z"/>';
      s += '<path class="k-filler s-dark body-f0" stroke-width=".8" d="M150,150 Q240,182 330,150 Q240,174 150,150 Z"/>';
      s += '<path class="k-filler s-dark body-f1" stroke-width=".8" d="M150,150 Q240,174 330,150 Q240,160 150,150 Z"/>';
      s += '<path class="k-filler s-dark body-f2" stroke-width=".8" d="M138,150 Q240,160 342,150 Q240,136 138,150 Z"/>';
      s += '<g transform="translate(0,138)"><g class="body-spr"><path class="k-warn s-dark" stroke-width="1.5" d="M-6,10 L14,-40 L40,-40 L20,10 Z"/></g></g>';
      s += top(ctx, 'Tenké vrstvy: 1. vtlačit, další dorovnat, mírně přeplnit', 'Thin layers: press 1st in, build up, slightly overfill');
      s += bottom(ctx, 'Celková tloušťka tmelu max. cca 3 mm', 'Total filler thickness max. approx. 3 mm');
      return L.svg(s, ctx.t({ cs: 'Nanášení tmelu v tenkých vrstvách', en: 'Applying filler in thin layers' }));
    }
  });

  /* ------------------------------------------------------------ block sanding */
  function sandScene(ctx, areaCls, wet, title, note) {
    var r = rng(wet ? 5 : 3), s = panel();
    s += '<ellipse class="' + areaCls + '" cx="240" cy="150" rx="120" ry="72"/>';
    var dots = ['', '', '', ''];
    for (var i = 0; i < 160; i++) {
      var a = r() * Math.PI * 2, rr = Math.sqrt(r());
      var x = 240 + Math.cos(a) * rr * 112, y = 150 + Math.sin(a) * rr * 64;
      var inLow = Math.pow((x - 280) / 26, 2) + Math.pow((y - 168) / 16, 2) < 1;
      var dot = '<circle class="k-dark" cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="2.2" opacity=".7"/>';
      if (inLow) s += dot; else dots[i % 4] += dot;
    }
    for (var j = 0; j < 12; j++) {
      var la = r() * Math.PI * 2, lr = Math.sqrt(r());
      s += '<circle class="k-dark" cx="' + (280 + Math.cos(la) * lr * 24).toFixed(0) + '" cy="' + (168 + Math.sin(la) * lr * 14).toFixed(0) + '" r="2.2" opacity=".8"/>';
    }
    s += dots.map(function (d, k) { return '<g class="body-gc' + k + '">' + d + '</g>'; }).join('');
    if (wet) s += L.drops(150, 70, 3, 60, 'k-fluid') + L.drops(330, 72, 3, 60, 'k-fluid');
    s += '<g transform="translate(240,150)"><g class="body-block"><rect class="k-dark" x="-60" y="-16" width="120" height="30" rx="5"/>' +
      '<rect class="' + (wet ? 'k-fluid' : 'k-warn') + '" x="-60" y="10" width="120" height="6" rx="2"/></g></g>';
    s += '<g class="body-late" style="animation-duration:8s">' + L.arrow(380, 218, 298, 178, 'danger', 3) +
      L.label(462, 232, ctx.t({ cs: 'zbylý prášek = důlek', en: 'remaining coat = low spot' }), { anchor: 'end', bg: true, size: 12 }) + '</g>';
    s += top(ctx, title.cs, title.en);
    s += bottom(ctx, note.cs, note.en);
    return s;
  }
  A.register('body.blockSand', {
    render: function (ctx) {
      return L.svg(sandScene(ctx, 'k-filler', false,
        { cs: 'Kontrolní prášek + brusný blok: P80 → P180 → P240', en: 'Guide coat + sanding block: P80 → P180 → P240' },
        { cs: 'Blok vždy naplocho, křížem – nikdy jen prsty', en: 'Block always flat, criss-cross – never with fingers only' }),
        ctx.t({ cs: 'Broušení tmelu blokem s kontrolním práškem', en: 'Block sanding filler with guide coat' }));
    }
  });
  A.register('body.wetSand', {
    render: function (ctx) {
      return L.svg(sandScene(ctx, 'k-muted', true,
        { cs: 'Plnič za mokra P400 → P600 (pod bázi)', en: 'Wet sand primer P400 → P600 (for base coat)' },
        { cs: 'Neprobrousit na kov – jinak znovu základ', en: 'Do not sand through to metal – else prime again' }),
        ctx.t({ cs: 'Broušení plniče za mokra', en: 'Wet sanding the primer' }));
    }
  });

  /* ------------------------------------------------------------ spray passes */
  function sprayScene(ctx, base, stripeCls, stripeOpacity, title, note) {
    var s = panel(base);
    s += '<rect class="k-none s-warn" stroke-width="6" x="56" y="70" width="368" height="168" rx="6"/>';
    ROWS.forEach(function (y, i) {
      s += '<rect class="' + stripeCls + ' body-st' + i + '" opacity="' + stripeOpacity + '" x="80" y="' + (y - 22) + '" width="320" height="44" rx="10"/>';
    });
    // gun: nozzle at local (0,0), mist cone down to stripe centre (30px)
    s += '<g class="body-gun"><path class="k-white" opacity=".45" d="M-4,4 L4,4 L20,30 L-20,30 Z"/>' +
      '<rect class="k-metal2 s-dark" stroke-width="1.5" x="-30" y="-24" width="60" height="22" rx="6"/>' +
      '<rect class="k-dark" x="-5" y="-4" width="10" height="8" rx="2"/>' +
      '<path class="k-metal s-dark" stroke-width="1.5" d="M-14,-24 L-18,-38 L18,-38 L14,-24 Z"/>' +
      '<rect class="k-dark" x="20" y="-18" width="44" height="10" rx="4"/></g>';
    s += top(ctx, title.cs, title.en);
    s += bottom(ctx, note.cs, note.en);
    return s;
  }
  A.register('body.primer', {
    render: function (ctx) {
      return L.svg(sprayScene(ctx, 'k-filler', 'k-muted', '.9',
        { cs: 'Plnič 2K: 15–20 cm od dílu, překrytí 50 %', en: '2K primer: 15–20 cm from panel, 50 % overlap' },
        { cs: 'Mezi vrstvami nechat odvětrat (flash-off)', en: 'Let each coat flash off before the next' }),
        ctx.t({ cs: 'Stříkání plniče', en: 'Spraying primer filler' }));
    }
  });
  A.register('body.base', {
    render: function (ctx) {
      return L.svg(sprayScene(ctx, 'k-muted', 'k-paint', '.92',
        { cs: 'Báze: tenké vrstvy do krytí, 50 % překrytí', en: 'Base coat: thin coats until covered, 50 % overlap' },
        { cs: 'Kód barvy ze štítku vozu · nejdřív zkušební plech', en: 'Colour code from the car label · test panel first' }),
        ctx.t({ cs: 'Stříkání báze', en: 'Spraying base coat' }));
    }
  });
  A.register('body.clear', {
    render: function (ctx) {
      return L.svg(sprayScene(ctx, 'k-paint', 'k-white', '.35',
        { cs: 'Bezbarvý 2K lak: 2 mokré vrstvy', en: '2K clear coat: 2 wet coats' },
        { cs: 'Isokyanáty – jen s maskou s přívodem vzduchu / A2P3', en: 'Isocyanates – supplied-air / A2P3 mask only' }),
        ctx.t({ cs: 'Stříkání bezbarvého laku', en: 'Spraying clear coat' }));
    }
  });

  /* ------------------------------------------------------------ polish */
  A.register('body.polish', {
    render: function (ctx) {
      var s = panel('k-paint');
      var haze = '';
      var r = rng(9);
      for (var i = 0; i < 26; i++) {
        var x = 70 + r() * 330, y = 80 + r() * 140;
        haze += '<path class="k-none s-white" stroke-width="1.2" opacity=".5" d="M' + x.toFixed(0) + ',' + y.toFixed(0) + ' q8,-3 16,0"/>';
      }
      s += '<g class="body-haze"><rect class="k-white" opacity=".22" x="30" y="50" width="420" height="200" rx="18"/>' + haze + '</g>';
      s += '<g class="body-shine"><path class="k-none s-white" stroke-width="10" stroke-linecap="round" opacity=".55" d="M90,220 L170,80"/>' +
        '<path class="k-none s-white" stroke-width="5" stroke-linecap="round" opacity=".45" d="M130,220 L200,96"/></g>';
      s += '<g class="body-orbit"><g transform="translate(290,150)"><circle class="k-dark" r="44"/><g class="spin-cw" style="animation-duration:.5s">' +
        '<circle class="k-white" opacity=".9" r="38"/><path class="k-none s-muted" stroke-width="3" d="M-30,0 L30,0 M0,-30 L0,30"/></g><circle class="k-metal" r="7"/></g></g>';
      s += top(ctx, 'Až po úplném vytvrzení: P1500–P3000 → pasta → leštěnka', 'After full cure only: P1500–P3000 → compound → polish');
      s += bottom(ctx, 'Nízké otáčky, stálý pohyb – na hranách lak nepropálit', 'Low speed, keep moving – do not burn through edges');
      return L.svg(s, ctx.t({ cs: 'Leštění opraveného místa', en: 'Polishing the repaired area' }));
    }
  });
})(window.STU);
