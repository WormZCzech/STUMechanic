/* Animations: headlights & rear lights (bulbs, units, aiming, testing). */
(function (S) {
  'use strict';
  var L = S.animLib, A = S.anim;

  A.css('lights', [
    /* generic glow pulse */
    '.lights-glow{animation:lights-glow 2s ease-in-out infinite}',
    '@keyframes lights-glow{0%,100%{opacity:.25}50%{opacity:.85}}',
    /* xenon arc flicker */
    '.lights-arc{animation:lights-arc 1.6s steps(1,end) infinite}',
    '@keyframes lights-arc{0%{opacity:0}10%{opacity:1}14%{opacity:0}20%{opacity:1}26%{opacity:0}100%{opacity:0}}',
    /* bonnet open 6 s */
    '.lights-bonnet{animation:lights-bonnet 6s ease-in-out infinite;transform-origin:120px 120px}',
    '@keyframes lights-bonnet{0%,10%{transform:rotate(0)}35%,85%{transform:rotate(-28deg)}100%{transform:rotate(0)}}',
    '.lights-show1{animation:lights-show1 6s ease-in-out infinite;opacity:0}',
    '@keyframes lights-show1{0%,35%{opacity:0}42%,85%{opacity:1}95%,100%{opacity:0}}',
    /* bulb swap 10 s */
    '.lights-cap{animation:lights-cap 10s ease-in-out infinite}',
    '@keyframes lights-cap{0%,6%{transform:translateX(0);opacity:1}16%,86%{transform:translateX(-70px);opacity:0}96%,100%{transform:translateX(0);opacity:1}}',
    '.lights-plug{animation:lights-plug 10s ease-in-out infinite}',
    '@keyframes lights-plug{0%,16%{transform:translateX(0)}24%,78%{transform:translateX(-60px)}86%,100%{transform:translateX(0)}}',
    '.lights-oldb{animation:lights-oldb 10s ease-in-out infinite}',
    '@keyframes lights-oldb{0%,26%{transform:translateX(0);opacity:1}38%{transform:translateX(-120px);opacity:1}42%,100%{transform:translateX(-120px);opacity:0}}',
    '.lights-newb{animation:lights-newb 10s ease-in-out infinite;opacity:0}',
    '@keyframes lights-newb{0%,44%{transform:translateX(-120px);opacity:0}48%{transform:translateX(-120px);opacity:1}62%,98%{transform:translateX(0);opacity:1}100%{opacity:0}}',
    '.lights-nofinger{animation:lights-nofinger 10s linear infinite;opacity:0}',
    '@keyframes lights-nofinger{0%,40%{opacity:0}44%,62%{opacity:1}66%,100%{opacity:0}}',
    /* unit out 10 s (front view) */
    '.lights-bumper{animation:lights-bumper 10s ease-in-out infinite}',
    '@keyframes lights-bumper{0%,8%{transform:translateY(0);opacity:1}22%,84%{transform:translateY(60px);opacity:0}96%,100%{transform:translateY(0);opacity:1}}',
    '.lights-bolt{animation:lights-bolt 10s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes lights-bolt{0%,24%{opacity:1;transform:scale(1)}28%{opacity:1;transform:scale(1.5)}36%,78%{opacity:0;transform:scale(1.5)}84%,100%{opacity:1;transform:scale(1)}}',
    '.lights-lamp{animation:lights-lamp 10s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes lights-lamp{0%,40%{transform:scale(1);opacity:1}54%,70%{transform:scale(1.35) translateY(-10px);opacity:.15}80%,100%{transform:scale(1);opacity:1}}',
    '.lights-ph1{animation:lights-ph1 10s linear infinite;opacity:0}',
    '@keyframes lights-ph1{0%,4%{opacity:0}8%,22%{opacity:1}26%,100%{opacity:0}}',
    '.lights-ph2{animation:lights-ph2 10s linear infinite;opacity:0}',
    '@keyframes lights-ph2{0%,24%{opacity:0}28%,40%{opacity:1}44%,100%{opacity:0}}',
    '.lights-ph3{animation:lights-ph3 10s linear infinite;opacity:0}',
    '@keyframes lights-ph3{0%,42%{opacity:0}46%,72%{opacity:1}76%,100%{opacity:0}}',
    '.lights-ph4{animation:lights-ph4 10s linear infinite;opacity:0}',
    '@keyframes lights-ph4{0%,76%{opacity:0}80%,96%{opacity:1}100%{opacity:0}}',
    /* connector 6 s */
    '.lights-lock{animation:lights-lock 6s ease-in-out infinite}',
    '@keyframes lights-lock{0%,8%{transform:translateY(0)}20%,84%{transform:translateY(-16px)}94%,100%{transform:translateY(0)}}',
    '.lights-conn{animation:lights-conn 6s ease-in-out infinite}',
    '@keyframes lights-conn{0%,28%{transform:translateX(0)}46%,66%{transform:translateX(90px)}80%,100%{transform:translateX(0)}}',
    '.lights-press{animation:lights-press 6s linear infinite;opacity:0}',
    '@keyframes lights-press{0%,20%{opacity:0}22%,30%{opacity:1}32%,100%{opacity:0}}',
    /* front test 8 s: 4 phases */
    '.lights-f1{animation:lights-f1 8s steps(1,end) infinite;opacity:0}',
    '@keyframes lights-f1{0%{opacity:.75}25%,100%{opacity:0}}',
    '.lights-f2{animation:lights-f2 8s steps(1,end) infinite;opacity:0}',
    '@keyframes lights-f2{0%{opacity:0}25%{opacity:.9}50%,100%{opacity:0}}',
    '.lights-f3{animation:lights-f3 8s steps(1,end) infinite;opacity:0}',
    '@keyframes lights-f3{0%{opacity:0}50%{opacity:1}54%{opacity:0}58%{opacity:1}62%{opacity:0}66%{opacity:1}70%{opacity:0}75%,100%{opacity:0}}',
    '.lights-f4{animation:lights-f4 8s steps(1,end) infinite;opacity:0}',
    '@keyframes lights-f4{0%{opacity:0}75%{opacity:.75}100%{opacity:0}}',
    '.lights-swivel{animation:lights-swivel 8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}',
    '@keyframes lights-swivel{0%,75%{transform:rotate(0)}84%{transform:rotate(-18deg)}93%{transform:rotate(18deg)}100%{transform:rotate(0)}}',
    /* basic setting 7 s */
    '.lights-beam{animation:lights-beam 7s ease-in-out infinite;transform-origin:150px 180px}',
    '@keyframes lights-beam{0%,15%{transform:rotate(0)}30%{transform:rotate(-8deg)}45%{transform:rotate(6deg)}60%,100%{transform:rotate(1.5deg)}}',
    '.lights-bar{animation:lights-bar 7s ease-in-out infinite;transform-box:fill-box;transform-origin:0 50%}',
    '@keyframes lights-bar{0%,10%{transform:scaleX(0)}62%,100%{transform:scaleX(1)}}',
    '.lights-done{animation:lights-done 7s linear infinite;opacity:0}',
    '@keyframes lights-done{0%,64%{opacity:0}68%,96%{opacity:1}100%{opacity:0}}',
    /* aim wall 8 s */
    '.lights-beamon{animation:lights-beamon 8s ease-in-out infinite}',
    '@keyframes lights-beamon{0%,10%{opacity:0}25%,92%{opacity:.55}100%{opacity:0}}',
    '.lights-mark{animation:lights-mark 8s ease-in-out infinite;opacity:0}',
    '@keyframes lights-mark{0%,30%{opacity:0}38%,92%{opacity:1}100%{opacity:0}}',
    '.lights-mark2{animation:lights-mark2 8s ease-in-out infinite;opacity:0}',
    '@keyframes lights-mark2{0%,48%{opacity:0}56%,92%{opacity:1}100%{opacity:0}}',
    /* aim screws 7 s */
    '.lights-screw{animation:lights-screw 7s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes lights-screw{0%,10%{transform:rotate(0)}45%{transform:rotate(270deg)}55%{transform:rotate(270deg)}90%,100%{transform:rotate(0)}}',
    '.lights-cut{animation:lights-cut 7s ease-in-out infinite}',
    '@keyframes lights-cut{0%,10%{transform:translateY(-22px)}45%,55%{transform:translateY(0)}90%,100%{transform:translateY(-22px)}}',
    /* rear carrier 8 s */
    '.lights-flap{animation:lights-flap 8s ease-in-out infinite;transform-origin:70px 250px}',
    '@keyframes lights-flap{0%,8%{transform:rotate(0)}22%,86%{transform:rotate(-80deg)}98%,100%{transform:rotate(0)}}',
    '.lights-carrier{animation:lights-carrier 8s ease-in-out infinite}',
    '@keyframes lights-carrier{0%,30%{transform:translateX(0)}48%,70%{transform:translateX(-150px)}84%,100%{transform:translateX(0)}}',
    '.lights-clip{animation:lights-clip 8s linear infinite;opacity:0}',
    '@keyframes lights-clip{0%,22%{opacity:0}25%,34%{opacity:1}38%,100%{opacity:0}}',
    /* bayonet 6 s */
    '.lights-bin{animation:lights-bin 6s ease-in-out infinite}',
    '@keyframes lights-bin{0%,10%{transform:translateY(-70px)}40%,90%{transform:translateY(0)}100%{transform:translateY(-70px)}}',
    '.lights-twist{animation:lights-twist 6s linear infinite;opacity:0}',
    '@keyframes lights-twist{0%,42%{opacity:0}46%,80%{opacity:1}84%,100%{opacity:0}}',
    '.lights-pinturn{animation:lights-pinturn 6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes lights-pinturn{0%,46%{transform:rotate(0)}64%,90%{transform:rotate(28deg)}100%{transform:rotate(0)}}',
    /* rear unit 9 s */
    '.lights-nut{animation:lights-nut 9s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes lights-nut{0%,6%{opacity:1;transform:rotate(0) scale(1)}16%{opacity:1;transform:rotate(-180deg) scale(1.3)}22%,84%{opacity:0;transform:rotate(-180deg) scale(1.3)}92%,100%{opacity:1;transform:rotate(0) scale(1)}}',
    '.lights-runit{animation:lights-runit 9s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes lights-runit{0%,40%{transform:scale(1);opacity:1}54%,68%{transform:scale(.8);opacity:.15}80%,100%{transform:scale(1);opacity:1}}',
    '.lights-rplug{animation:lights-rplug 9s ease-in-out infinite}',
    '@keyframes lights-rplug{0%,28%{transform:translateX(0)}36%,80%{transform:translateX(-60px)}88%,100%{transform:translateX(0)}}',
    /* rear test 10 s: 6 phases */
    '.lights-r1{animation:lights-r1 10s steps(1,end) infinite;opacity:0}',
    '@keyframes lights-r1{0%{opacity:1}18%,100%{opacity:0}}',
    '.lights-r2{animation:lights-r2 10s steps(1,end) infinite;opacity:0}',
    '@keyframes lights-r2{0%{opacity:0}18%{opacity:1}22%{opacity:0}26%{opacity:1}30%{opacity:0}34%,100%{opacity:0}}',
    '.lights-r3{animation:lights-r3 10s steps(1,end) infinite;opacity:0}',
    '@keyframes lights-r3{0%{opacity:0}36%{opacity:1}40%{opacity:0}44%{opacity:1}48%{opacity:0}52%,100%{opacity:0}}',
    '.lights-r4{animation:lights-r4 10s steps(1,end) infinite;opacity:0}',
    '@keyframes lights-r4{0%{opacity:0}54%{opacity:1}70%,100%{opacity:0}}',
    '.lights-r5{animation:lights-r5 10s steps(1,end) infinite;opacity:0}',
    '@keyframes lights-r5{0%{opacity:0}70%{opacity:1}84%,100%{opacity:0}}',
    '.lights-r6{animation:lights-r6 10s steps(1,end) infinite;opacity:0}',
    '@keyframes lights-r6{0%{opacity:0}84%{opacity:1}88%{opacity:0}92%{opacity:1}96%{opacity:0}100%{opacity:0}}',
    /* seal 6 s */
    '.lights-drop{animation:lights-drop 2s ease-in infinite}',
    '@keyframes lights-drop{0%{transform:translateY(-40px);opacity:0}20%{opacity:1}80%{transform:translateY(30px);opacity:1}100%{transform:translateY(30px);opacity:0}}'
  ].join('\n'));

  /* ---------- helpers ---------- */
  /** Front view of a car (x 56–424, ground 280). */
  function frontCar(o) {
    o = o || {};
    var s = '<rect class="k-ground" x="0" y="280" width="480" height="20"/>' +
      '<rect class="k-tire" x="74" y="246" width="40" height="36" rx="6"/><rect class="k-tire" x="366" y="246" width="40" height="36" rx="6"/>' +
      '<path class="k-glass" d="M128,86 L156,36 L324,36 L352,86 Z"/>' +
      '<path class="k-body s-dark" stroke-width="2" d="M60,250 L60,150 Q62,98 110,86 L370,86 Q418,98 420,150 L420,250 Z"/>' +
      '<line class="s-dark" stroke-width="1.5" x1="110" y1="106" x2="370" y2="106" opacity=".5"/>' +
      '<rect class="k-dark" x="200" y="128" width="80" height="40" rx="8"/>';
    if (o.hiddenBolt) s += o.hiddenBolt;
    s += '<g class="' + (o.lampCls || '') + '">' +
      '<path class="k-glass s-dark" stroke-width="1.5" d="M402,118 L290,126 L294,156 L396,150 Z"/><circle class="k-metal" cx="366" cy="138" r="11"/><circle class="k-metal2" cx="326" cy="140" r="7"/></g>' +
      '<path class="k-glass s-dark" stroke-width="1.5" d="M78,118 L190,126 L186,156 L84,150 Z"/><circle class="k-metal" cx="114" cy="138" r="11"/><circle class="k-metal2" cx="154" cy="140" r="7"/>';
    s += '<g class="' + (o.bumperCls || '') + '"><path class="k-body2 s-dark" stroke-width="2" d="M56,170 L424,170 L424,250 Q424,262 410,262 L70,262 Q56,262 56,250 Z"/>' +
      '<rect class="k-dark" x="170" y="206" width="140" height="32" rx="10"/><rect class="k-dark" x="80" y="214" width="50" height="16" rx="6"/><rect class="k-dark" x="350" y="214" width="50" height="16" rx="6"/></g>';
    return s;
  }

  /** Rear view of a car (lamps at x 70–150 and 330–410). */
  function rearCar() {
    return '<rect class="k-ground" x="0" y="280" width="480" height="20"/>' +
      '<rect class="k-tire" x="80" y="246" width="40" height="36" rx="6"/><rect class="k-tire" x="360" y="246" width="40" height="36" rx="6"/>' +
      '<path class="k-glass" d="M128,96 L158,44 L322,44 L352,96 Z"/>' +
      '<rect class="k-dark" x="210" y="48" width="60" height="6" rx="3"/>' +
      '<path class="k-body s-dark" stroke-width="2" d="M60,250 L60,140 Q62,100 110,96 L370,96 Q418,100 420,140 L420,250 Z"/>' +
      '<rect class="k-body2" x="56" y="200" width="368" height="56" rx="10"/>' +
      '<rect class="k-white s-dark" stroke-width="1" x="200" y="176" width="80" height="20" rx="3"/>' +
      lampShape(70) + lampShape(330);
  }
  function lampShape(x) {
    return '<rect class="k-dark" x="' + x + '" y="120" width="80" height="44" rx="10"/>' +
      '<rect class="k-paint" opacity=".55" x="' + (x + 4) + '" y="124" width="72" height="16" rx="6"/>' +
      '<rect class="k-warn" opacity=".45" x="' + (x + 4) + '" y="142" width="34" height="18" rx="5"/>' +
      '<rect class="k-white" opacity=".35" x="' + (x + 42) + '" y="142" width="34" height="18" rx="5"/>';
  }

  /** Simple screwdriver, tip at (0,0) pointing down. */
  function screwdriver() {
    return '<g><rect class="k-metal s-dark" stroke-width="1" x="-3" y="-60" width="6" height="60"/>' +
      '<rect class="k-danger s-dark" stroke-width="1.5" x="-10" y="-110" width="20" height="52" rx="8"/></g>';
  }

  /* ---------- lights.types ---------- */
  A.register('lights.types', {
    render: function (ctx) {
      var s = '';
      // halogen
      s += '<g transform="translate(90,120)"><circle class="k-warn lights-glow" r="46"/>' +
        '<rect class="k-metal2" x="-14" y="30" width="28" height="30" rx="3"/><rect class="k-dark" x="-20" y="26" width="40" height="8" rx="2"/>' +
        '<ellipse class="k-glass s-dark" stroke-width="1.5" cx="0" cy="0" rx="14" ry="30"/>' +
        '<path class="k-none s-danger" stroke-width="2" d="M0,-16 l4,4 l-8,4 l8,4 l-8,4 l4,4"/></g>';
      // xenon
      s += '<g transform="translate(240,120)"><circle class="k-fluid lights-glow" r="46" style="animation-delay:.6s"/>' +
        '<rect class="k-dark" x="-22" y="24" width="44" height="40" rx="5"/><text x="0" y="50" text-anchor="middle" font-size="16" font-weight="800" class="k-warn">⚡</text>' +
        '<rect class="k-glass s-dark" stroke-width="1.5" x="-5" y="-34" width="10" height="58" rx="5"/>' +
        '<ellipse class="k-white" cx="0" cy="-8" rx="4" ry="7"/></g>';
      // LED
      s += '<g transform="translate(390,120)"><circle class="k-white lights-glow" r="46" style="animation-delay:1.2s"/>' +
        '<rect class="k-metal" x="-30" y="10" width="60" height="44" rx="3"/>';
      for (var i = 0; i < 6; i++) s += '<rect class="k-metal2" x="' + (-28 + i * 10) + '" y="24" width="6" height="30"/>';
      s += '<rect class="k-dark" x="-30" y="-14" width="60" height="26" rx="3"/>';
      for (var j = 0; j < 3; j++) s += '<rect class="k-white" x="' + (-22 + j * 18) + '" y="-8" width="10" height="10" rx="2"/>';
      s += '</g>';
      s += L.label(90, 210, ctx.t({ cs: 'Halogen', en: 'Halogen' }), { size: 15 }) + L.label(90, 232, 'H7 · H1 · H4', { size: 12, cls: 'k-muted' }) +
        L.label(240, 210, ctx.t({ cs: 'Xenon', en: 'Xenon' }), { size: 15 }) + L.label(240, 232, 'D1S · D3S · …', { size: 12, cls: 'k-muted' }) +
        L.label(390, 210, 'LED', { size: 15 }) + L.label(390, 232, ctx.t({ cs: 'modul / celé světlo', en: 'module / whole lamp' }), { size: 12, cls: 'k-muted' }) +
        L.label(240, 262, ctx.t({ cs: 'Xenon: zapalovač ~25 kV · LED: zpravidla bez žárovek', en: 'Xenon: ~25 kV ignitor · LED: usually no bulbs' }), { bg: true, cls: 'k-danger', size: 12 }) +
        L.label(16, 24, ctx.t({ cs: 'Nejdřív zjistěte, jaký typ světla máte', en: 'First find out which lamp type you have' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Typy světlometů', en: 'Headlight types' }));
    }
  });

  /* ---------- lights.xenonHv ---------- */
  A.register('lights.xenonHv', {
    render: function (ctx) {
      var s = '<path class="k-dark" d="M250,60 L440,60 Q456,60 456,76 L456,206 Q456,222 440,222 L250,222 Z"/>' +
        '<circle class="k-metal2" cx="352" cy="140" r="54"/><circle class="k-dark" cx="352" cy="140" r="30"/>' +
        // ballast
        '<rect class="k-metal s-dark" stroke-width="1.5" x="300" y="232" width="110" height="40" rx="5"/>' +
        '<text x="355" y="257" text-anchor="middle" font-size="12" font-weight="800" class="k-dark">' + S.esc(ctx.t({ cs: 'předřadník', en: 'ballast' })) + '</text>' +
        '<path class="k-none s-dark" stroke-width="5" d="M330,232 Q330,200 340,170"/>' +
        // arc
        '<g class="lights-arc"><path class="k-none s-warn" stroke-width="4" stroke-linejoin="round" d="M352,112 L340,128 L360,136 L344,154 L364,162"/>' +
        '<circle class="k-fluid" cx="352" cy="140" r="42" opacity=".35"/></g>' +
        L.badge(352, 46, '~25 kV', 'danger') +
        L.label(16, 30, ctx.t({ cs: 'Než sáhnete na xenon:', en: 'Before touching xenon:' }), { anchor: 'start', size: 15 }) +
        L.label(16, 72, ctx.t({ cs: '1. Světla VYP', en: '1. Lights OFF' }), { anchor: 'start', bg: true }) +
        L.label(16, 102, ctx.t({ cs: '2. Zapalování VYP, klíč pryč', en: '2. Ignition OFF, key away' }), { anchor: 'start', bg: true }) +
        L.label(16, 132, ctx.t({ cs: '3. Odpojit konektor výbojky', en: '3. Unplug the bulb connector' }), { anchor: 'start', bg: true }) +
        L.label(16, 162, ctx.t({ cs: '4. Počkat, výbojka vychladne', en: '4. Wait, let the bulb cool' }), { anchor: 'start', bg: true }) +
        L.warnIcon(36, 214) + L.label(60, 218, ctx.t({ cs: 'UV záření – nedívat se', en: 'UV light – don\'t look in' }), { anchor: 'start', bg: true, cls: 'k-danger' }) +
        L.label(16, 286, ctx.t({ cs: 'Výbojka obsahuje rtuť → nebezpečný odpad', en: 'Bulb contains mercury → hazardous waste' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Vysoké napětí u xenonových světel', en: 'High voltage in xenon headlights' }));
    }
  });

  /* ---------- lights.access ---------- */
  A.register('lights.access', {
    render: function (ctx) {
      var s = L.ground(262) +
        '<rect class="k-tire" x="240" y="200" width="76" height="62" rx="30"/>' +
        '<path class="k-body s-dark" stroke-width="2" d="M30,130 L360,130 Q420,134 440,170 L446,226 Q446,236 436,236 L330,236 Q320,200 278,198 Q236,200 226,236 L30,236 Z"/>' +
        '<path class="k-glass s-dark" stroke-width="1.5" d="M376,142 L428,152 L434,172 L380,168 Z"/>' +
        // engine bay hint + lamp rear
        '<rect class="k-dark" x="200" y="106" width="150" height="26" opacity=".7"/>' +
        '<g class="lights-show1"><circle class="k-accent" cx="372" cy="146" r="12" opacity=".9"/>' + L.arrow(410, 110, 378, 138, 'accent') +
        L.label(456, 98, ctx.t({ cs: 'Zadní kryt světla', en: 'Lamp rear cover' }), { bg: true, anchor: 'end' }) + '</g>' +
        // bonnet hinged at 120,120 (left end)
        '<g class="lights-bonnet"><path class="k-body2 s-dark" stroke-width="2" d="M120,122 L440,128 Q446,130 440,136 L120,134 Z"/></g>' +
        L.label(16, 24, ctx.t({ cs: 'Kapota nahoru, opřít o vzpěru', en: 'Open the bonnet, secure the stay' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Někdy přístup jen přes otvor v podběhu', en: 'Sometimes access only via the wheel-arch flap' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Přístup k zadní části světlometu', en: 'Access to the back of the headlight' }));
    }
  });

  /* ---------- lights.bulbSwap (side cut-away) ---------- */
  A.register('lights.bulbSwap', {
    render: function (ctx) {
      var bulb = function (glassCls) {
        return '<rect class="k-metal2" x="200" y="140" width="40" height="20" rx="2"/>' +
          '<rect class="k-metal s-dark" stroke-width="1" x="236" y="128" width="8" height="44" rx="2"/>' +
          '<ellipse class="' + glassCls + ' s-dark" stroke-width="1.5" cx="276" cy="150" rx="32" ry="13"/>' +
          '<path class="k-none s-danger" stroke-width="2" d="M262,150 l4,-4 l4,8 l4,-8 l4,8 l4,-4"/>';
      };
      var s = '<path class="k-dark" opacity=".55" d="M170,70 L392,70 Q420,150 392,230 L170,230 Z"/>' +
        '<path class="k-metal" opacity=".8" d="M392,76 Q236,150 392,224 L392,210 Q262,150 392,90 Z"/>' +
        '<path class="k-glass" d="M392,70 Q426,150 392,230 L404,230 Q440,150 404,70 Z"/>' +
        '<rect class="k-dark" x="166" y="70" width="8" height="160"/>' +
        '<g class="lights-oldb">' + bulb('k-muted') + '</g>' +
        '<g class="lights-newb">' + bulb('k-glass') + '</g>' +
        '<g class="lights-plug"><rect class="k-dark s-line" stroke-width="1" x="172" y="138" width="30" height="24" rx="3"/>' +
        '<path class="k-none s-dark" stroke-width="4" d="M172,146 Q140,146 120,120 M172,154 Q140,156 120,180"/></g>' +
        '<g class="lights-cap"><rect class="k-dark s-line" stroke-width="1.5" x="136" y="104" width="34" height="92" rx="8"/>' +
        '<line class="s-line" stroke-width="2" x1="146" y1="114" x2="146" y2="186"/><line class="s-line" stroke-width="2" x1="156" y1="114" x2="156" y2="186"/></g>' +
        '<g class="lights-nofinger">' + L.cross(276, 112) + L.label(276, 92, ctx.t({ cs: 'Sklo nechytat prsty!', en: 'Don\'t touch the glass!' }), { bg: true, cls: 'k-danger' }) + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Kryt → konektor → pojistka → žárovka', en: 'Cover → connector → clip → bulb' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Novou žárovku držet za patici (rukavice)', en: 'Hold the new bulb by its base (gloves)' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Výměna žárovky světlometu', en: 'Replacing a headlight bulb' }));
    }
  });

  /* ---------- lights.unitOut (front view) ---------- */
  A.register('lights.unitOut', {
    render: function (ctx) {
      var bolts = [[296, 120], [398, 114]];
      var s = frontCar({
        lampCls: 'lights-lamp', bumperCls: 'lights-bumper',
        hiddenBolt: '<g class="lights-bolt">' + L.hex(392, 162, 7, 'k-accent') + '</g>'
      });
      bolts.forEach(function (b) { s += '<g class="lights-bolt">' + L.hex(b[0], b[1], 7, 'k-accent') + '</g>'; });
      s += '<g class="lights-ph1">' + L.label(16, 24, ctx.t({ cs: '1. Demontovat nárazník / masku (dle vozu)', en: '1. Remove bumper / grille (if required)' }), { anchor: 'start', bg: true }) + '</g>' +
        '<g class="lights-ph2">' + L.label(16, 24, ctx.t({ cs: '2. Povolit šrouby světla (i ty skryté)', en: '2. Undo the lamp bolts (incl. hidden ones)' }), { anchor: 'start', bg: true }) + '</g>' +
        '<g class="lights-ph3">' + L.label(16, 24, ctx.t({ cs: '3. Odpojit konektor(y) a ostřikovač, světlo vyjmout', en: '3. Unplug connector(s) and washer, pull the lamp out' }), { anchor: 'start', bg: true }) + '</g>' +
        '<g class="lights-ph4">' + L.label(16, 24, ctx.t({ cs: '4. Montáž v opačném pořadí, kontrola spár', en: '4. Refit in reverse order, check panel gaps' }), { anchor: 'start', bg: true }) + '</g>' +
        L.label(464, 292, ctx.t({ cs: 'Šrouby si vyfoťte / označte', en: 'Photograph / label the bolts' }), { anchor: 'end', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Demontáž celého světlometu', en: 'Removing the complete headlight' }));
    }
  });

  /* ---------- lights.connector ---------- */
  A.register('lights.connector', {
    render: function (ctx) {
      var s = '<rect class="k-dark" x="60" y="80" width="150" height="150" rx="8"/>' +
        '<rect class="k-metal2 s-dark" stroke-width="1.5" x="170" y="120" width="60" height="70" rx="4"/>' +
        '<g class="lights-conn"><rect class="k-line s-dark" stroke-width="1.5" x="228" y="114" width="90" height="82" rx="6"/>' +
        '<g class="lights-lock"><rect class="k-danger s-dark" stroke-width="1" x="252" y="104" width="40" height="14" rx="3"/></g>' +
        '<rect class="k-dark" x="300" y="140" width="10" height="30" rx="3"/>' +
        '<path class="k-none s-dark" stroke-width="5" d="M318,140 Q380,140 440,110 M318,155 Q380,156 440,155 M318,170 Q380,172 440,200"/></g>' +
        '<g class="lights-press">' + L.arrow(305, 80, 305, 136, 'accent') + '</g>' +
        L.label(16, 24, ctx.t({ cs: '1. Odsunout pojistku  2. Zmáčknout západku  3. Vytáhnout', en: '1. Slide the lock  2. Press the latch  3. Pull' }), { anchor: 'start', bg: true }) +
        L.warnIcon(36, 264) + L.label(60, 268, ctx.t({ cs: 'Tahat za konektor, nikdy za kabely', en: 'Pull the connector, never the wires' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Odpojení konektoru', en: 'Unplugging the connector' }));
    }
  });

  /* ---------- lights.frontTest ---------- */
  A.register('lights.frontTest', {
    render: function (ctx) {
      var glow = function (cx, cls, r) {
        return '<ellipse class="' + cls + '" cx="' + cx + '" cy="138" rx="' + r + '" ry="' + (r * 0.55) + '"/>';
      };
      var s = frontCar() +
        '<g class="lights-f1">' + glow(130, 'k-white', 52) + glow(350, 'k-white', 52) + '</g>' +
        '<g class="lights-f2">' + glow(130, 'k-warn', 70) + glow(350, 'k-warn', 70) + '</g>' +
        '<g class="lights-f3"><circle class="k-accent" cx="88" cy="134" r="14"/><circle class="k-accent" cx="392" cy="134" r="14"/></g>' +
        '<g class="lights-f4"><g class="lights-swivel"><path class="k-white" opacity=".7" d="M110,138 L60,20 L170,20 Z"/></g>' +
        '<g class="lights-swivel"><path class="k-white" opacity=".7" d="M370,138 L310,20 L420,20 Z"/></g></g>' +
        '<g class="lights-f1">' + L.label(16, 24, ctx.t({ cs: 'Potkávací', en: 'Low beam' }), { anchor: 'start', bg: true }) + '</g>' +
        '<g class="lights-f2">' + L.label(16, 24, ctx.t({ cs: 'Dálková', en: 'High beam' }), { anchor: 'start', bg: true }) + '</g>' +
        '<g class="lights-f3">' + L.label(16, 24, ctx.t({ cs: 'Blinkry / výstražná', en: 'Indicators / hazards' }), { anchor: 'start', bg: true }) + '</g>' +
        '<g class="lights-f4">' + L.label(16, 24, ctx.t({ cs: 'AFS natáčení (je-li)', en: 'AFS swivel (if fitted)' }), { anchor: 'start', bg: true }) + '</g>' +
        L.label(464, 292, ctx.t({ cs: 'Bez chyby na přístrojovce', en: 'No warning on the dashboard' }), { anchor: 'end', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Funkční test předních světel', en: 'Front lights function test' }));
    }
  });

  /* ---------- lights.basicSetting ---------- */
  A.register('lights.basicSetting', {
    render: function (ctx) {
      var tool = {
        'generic': { cs: 'Diagnostika: základní nastavení', en: 'Scan tool: basic setting' },
        'skoda-octavia-rs-tdi': { cs: 'VCDS: základní nastavení (ověřit)', en: 'VCDS: basic settings (verify)' },
        'mb-cl500-c216': { cs: 'XENTRY: kalibrace (ověřit)', en: 'XENTRY: calibration (verify)' },
        'volvo-xc60-b4': { cs: 'VIDA: kalibrace světel (ověřit)', en: 'VIDA: headlight calibration (verify)' },
        'toyota-gr-yaris': { cs: 'Techstream: inicializace (ověřit)', en: 'Techstream: initialisation (verify)' },
        'citroen-jumper-22hdi': { cs: 'Jumper: ruční kolečko sklonu (ověřit)', en: 'Jumper: manual range wheel (verify)' }
      }[ctx.vehicle] || { cs: 'Diagnostika', en: 'Scan tool' };
      var s = L.ground(262) +
        '<path class="k-glass s-dark" stroke-width="1.5" d="M110,160 L170,166 L172,196 L112,192 Z"/>' +
        '<g class="lights-beam"><path class="k-warn" opacity=".45" d="M150,180 L470,150 L470,236 Z"/>' +
        '<line class="s-warn" stroke-width="3" x1="150" y1="180" x2="470" y2="150"/></g>' +
        '<rect class="k-dark" x="250" y="30" width="200" height="110" rx="12"/><rect class="k-ground" x="262" y="42" width="176" height="86" rx="6"/>' +
        L.label(350, 62, ctx.t({ cs: 'Regulace sklonu', en: 'Range control' }), { size: 13 }) +
        '<rect class="k-line" x="276" y="80" width="148" height="10" rx="5"/><g class="lights-bar"><rect class="k-ok" x="276" y="80" width="148" height="10" rx="5"/></g>' +
        '<g class="lights-done">' + L.label(350, 112, ctx.t({ cs: 'Hotovo ✔', en: 'Done ✔' }), { size: 13, cls: 'k-ok' }) + '</g>' +
        L.label(16, 24, ctx.t(tool), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Po výměně světla / senzoru výšky', en: 'After replacing a lamp / level sensor' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Základní nastavení regulace světel', en: 'Headlight range control basic setting' }));
    }
  });

  /* ---------- lights.aimWall ---------- */
  A.register('lights.aimWall', {
    render: function (ctx) {
      var s = L.ground(250) +
        '<g transform="translate(16,241) scale(.5)">' + L.car(0, 0) + '</g>' +
        '<rect class="k-metal2" x="440" y="50" width="16" height="200"/>' +
        '<path class="k-warn lights-beamon" d="M164,212 L440,222 L440,250 L164,218 Z"/>' +
        '<g class="lights-mark"><line class="s-text" stroke-width="2" stroke-dasharray="6 4" x1="172" y1="212" x2="456" y2="212"/>' +
        L.label(432, 196, ctx.t({ cs: 'H = výška středu světla', en: 'H = lamp centre height' }), { anchor: 'end', bg: true, size: 12 }) + '</g>' +
        '<g class="lights-mark2"><line class="s-danger" stroke-width="3" x1="380" y1="224" x2="456" y2="224"/>' +
        L.label(374, 236, ctx.t({ cs: 'hrana světla: H − 1 % (10 cm)', en: 'cut-off: H − 1 % (10 cm)' }), { anchor: 'end', bg: true, size: 12, cls: 'k-danger' }) + '</g>' +
        L.arrow(250, 272, 168, 272, 'muted', 2) + L.arrow(360, 272, 440, 272, 'muted', 2) + L.label(305, 276, '10 m', { size: 14 }) +
        L.label(16, 24, ctx.t({ cs: 'Rovina · tlaky pneu · ½ nádrže · řidič ve voze', en: 'Level floor · tyre pressures · ½ tank · driver inside' }), { anchor: 'start', bg: true }) +
        L.label(16, 52, ctx.t({ cs: 'Sklon dle štítku na světle (např. 1,0 %)', en: 'Drop per the lamp label (e.g. 1.0 %)' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Seřízení světel podle stěny', en: 'Aiming headlights against a wall' }));
    }
  });

  /* ---------- lights.aimScrews ---------- */
  A.register('lights.aimScrews', {
    render: function (ctx) {
      var s = '<g transform="translate(0,40)"><path class="k-dark" d="M40,90 L280,90 Q300,90 300,110 L300,230 L40,230 Z"/>' +
        '<circle class="k-metal2" cx="170" cy="168" r="48"/>' +
        '<g transform="translate(90,90)"><circle class="k-metal s-dark" stroke-width="1.5" r="14"/><g class="lights-screw"><rect class="k-dark" x="-2" y="-10" width="4" height="20"/><rect class="k-dark" x="-10" y="-2" width="20" height="4"/></g></g>' +
        '<g transform="translate(250,90)"><circle class="k-metal s-dark" stroke-width="1.5" r="14"/><rect class="k-dark" x="-2" y="-10" width="4" height="20"/><rect class="k-dark" x="-10" y="-2" width="20" height="4"/></g>' +
        '<g transform="translate(90,80)">' + screwdriver() + '</g>' +
        L.label(90, 126, ctx.t({ cs: 'výška', en: 'height' }), { bg: true, size: 12 }) + L.label(250, 126, ctx.t({ cs: 'do stran', en: 'sideways' }), { bg: true, size: 12 }) + '</g>' +
        // wall inset
        '<rect class="k-ground s-line" stroke-width="1.5" x="330" y="70" width="130" height="150" rx="8"/>' +
        '<line class="s-text" stroke-width="2" stroke-dasharray="6 4" x1="338" y1="140" x2="452" y2="140"/>' +
        '<g class="lights-cut"><path class="k-warn" opacity=".6" d="M338,150 L400,150 L420,136 L452,136 L452,212 L338,212 Z"/>' +
        '<path class="k-none s-danger" stroke-width="3" d="M338,150 L400,150 L420,136 L452,136"/></g>' +
        L.label(395, 236, ctx.t({ cs: 'stěna 10 m', en: 'wall at 10 m' }), { size: 12 }) +
        L.label(464, 24, ctx.t({ cs: 'Seřizovací šrouby: malými kroky, pak kontrola', en: 'Adjusters: small turns, then check' }), { anchor: 'end', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Polohu šroubů ověřte v příručce', en: 'Check adjuster locations in the manual' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Seřizovací šrouby světlometu', en: 'Headlight adjuster screws' }));
    }
  });

  /* ---------- lights.ledUnit ---------- */
  A.register('lights.ledUnit', {
    render: function (ctx) {
      var s = '<g transform="translate(120,130)"><ellipse class="k-glass s-dark" stroke-width="1.5" cx="0" cy="0" rx="18" ry="36"/><rect class="k-metal2" x="-14" y="34" width="28" height="30" rx="3"/></g>' +
        L.cross(150, 90) + L.label(120, 230, ctx.t({ cs: 'Žárovka? Není.', en: 'Bulb? None.' }), { size: 14 }) +
        '<g transform="translate(330,140)"><path class="k-glass s-dark" stroke-width="1.5" d="M-90,-40 L80,-30 L86,30 L-84,40 Z"/>' +
        '<rect class="k-dark" x="-60" y="-14" width="110" height="20" rx="4"/>';
      for (var i = 0; i < 6; i++) s += '<rect class="k-white lights-glow" style="animation-delay:' + (i * 0.15) + 's" x="' + (-54 + i * 18) + '" y="-10" width="10" height="12" rx="2"/>';
      s += '</g>' + L.check(420, 90) + L.label(330, 230, ctx.t({ cs: 'Výměna celého světla / LED modulu', en: 'Replace the whole lamp / LED module' }), { size: 14 }) +
        L.label(16, 24, ctx.t({ cs: 'LED světla: bez vyměnitelných žárovek', en: 'LED lamps: no replaceable bulbs' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Nejdřív diagnostika: pojistka, konektor, chybové kódy', en: 'Diagnose first: fuse, connector, fault codes' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'LED světla bez žárovek', en: 'LED lamps without bulbs' }));
    }
  });

  /* ---------- rear: bulbs ---------- */
  A.register('lights.rearBulbs', {
    render: function (ctx) {
      var bulb = function (x, glass, dual, wedge) {
        var g = '<g transform="translate(' + x + ',130)"><circle class="' + glass + ' lights-glow" r="34" style="animation-delay:' + (x / 300).toFixed(2) + 's"/>';
        if (wedge) {
          g += '<rect class="k-glass s-dark" stroke-width="1.5" x="-8" y="-24" width="16" height="30" rx="7"/><rect class="k-line" x="-9" y="6" width="18" height="16" rx="2"/>';
        } else {
          g += '<circle class="k-glass s-dark" stroke-width="1.5" cx="0" cy="-8" r="18"/><rect class="k-metal2" x="-11" y="8" width="22" height="22" rx="2"/>' +
            '<rect class="k-dark" x="-15" y="' + (dual ? 12 : 18) + '" width="5" height="5"/><rect class="k-dark" x="10" y="18" width="5" height="5"/>';
          if (glass === 'k-accent') g += '<circle class="k-accent" cx="0" cy="-8" r="16" opacity=".7"/>';
        }
        return g + '</g>';
      };
      var s = bulb(70, 'k-paint', false) + bulb(185, 'k-paint', true) + bulb(300, 'k-accent', false) + bulb(410, 'k-white', false, true) +
        L.label(70, 196, 'P21W', { size: 14 }) + L.label(70, 216, ctx.t({ cs: 'brzda / couvání', en: 'brake / reverse' }), { size: 11, cls: 'k-muted' }) +
        L.label(185, 196, 'P21/5W', { size: 14 }) + L.label(185, 216, ctx.t({ cs: 'obrys + brzda', en: 'tail + brake' }), { size: 11, cls: 'k-muted' }) +
        L.label(300, 196, 'PY21W', { size: 14 }) + L.label(300, 216, ctx.t({ cs: 'blinkr (oranžová)', en: 'indicator (amber)' }), { size: 11, cls: 'k-muted' }) +
        L.label(410, 196, 'W5W', { size: 14 }) + L.label(410, 216, ctx.t({ cs: 'obrys / SPZ', en: 'tail / plate' }), { size: 11, cls: 'k-muted' }) +
        L.label(16, 24, ctx.t({ cs: 'Typické žárovky zadních světel (příklad)', en: 'Typical rear lamp bulbs (example)' }), { anchor: 'start', bg: true }) +
        L.label(16, 258, ctx.t({ cs: 'P21/5W má piny v různé výšce – nejde otočit naopak', en: 'P21/5W has offset pins – only fits one way' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 286, ctx.t({ cs: 'Přesné typy ověřte v příručce / na staré žárovce', en: 'Check exact types in the manual / on the old bulb' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Žárovky zadních světel', en: 'Rear lamp bulbs' }));
    }
  });

  /* ---------- rear: carrier ---------- */
  A.register('lights.rearCarrier', {
    render: function (ctx) {
      var s = '<rect class="k-body2" x="20" y="40" width="170" height="230" rx="10"/>' +
        '<g class="lights-flap"><rect class="k-line s-dark" stroke-width="1.5" x="70" y="110" width="110" height="140" rx="8"/></g>' +
        '<rect class="k-dark" opacity=".5" x="200" y="60" width="240" height="190" rx="12"/>' +
        '<rect class="k-metal2" x="220" y="80" width="200" height="150" rx="10"/>' +
        '<g class="lights-carrier"><rect class="k-dark s-line" stroke-width="1.5" x="240" y="96" width="160" height="118" rx="8"/>' +
        '<circle class="k-paint" cx="280" cy="130" r="16"/><circle class="k-accent" cx="360" cy="130" r="16"/><circle class="k-white" cx="280" cy="180" r="14"/><circle class="k-paint" cx="360" cy="180" r="14" opacity=".7"/>' +
        '<rect class="k-warn" x="232" y="146" width="10" height="20" rx="3"/><rect class="k-warn" x="398" y="146" width="10" height="20" rx="3"/></g>' +
        '<g class="lights-clip">' + L.arrow(212, 156, 236, 156, 'accent') + L.arrow(430, 156, 406, 156, 'accent') + '</g>' +

        L.label(16, 24, ctx.t({ cs: 'Kryt v obložení kufru → stisknout západky → vytáhnout držák', en: 'Boot trim flap → press latches → pull out the carrier' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 290, ctx.t({ cs: 'Žárovky: zatlačit + pootočit', en: 'Bulbs: push in + twist' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Držák žárovek zadního světla', en: 'Rear lamp bulb carrier' }));
    }
  });

  /* ---------- rear: bayonet ---------- */
  A.register('lights.bayonet', {
    render: function (ctx) {
      var s = '<rect class="k-dark" x="120" y="150" width="120" height="100" rx="8"/><rect class="k-metal2" x="156" y="146" width="48" height="60" rx="4"/>' +
        '<rect class="k-dark" x="160" y="150" width="40" height="56"/>' +
        '<g class="lights-bin"><g transform="translate(180,120)"><circle class="k-glass s-dark" stroke-width="1.5" cx="0" cy="-20" r="24"/>' +
        '<rect class="k-metal" x="-17" y="0" width="34" height="50" rx="2"/><rect class="k-dark" x="-22" y="16" width="6" height="6"/><rect class="k-dark" x="16" y="26" width="6" height="6"/></g></g>' +
        '<g class="lights-twist">' + L.rotArrow(180, 100, 40, 'cw', 'accent', 120) + '</g>' +
        // top-view inset
        '<g transform="translate(360,150)"><circle class="k-metal2" r="58"/><circle class="k-dark" r="36"/>' +
        '<g class="lights-pinturn"><circle class="k-metal" r="30"/><rect class="k-dark" x="-40" y="-5" width="12" height="10"/><rect class="k-dark" x="28" y="-5" width="12" height="10"/></g></g>' +
        L.label(360, 230, ctx.t({ cs: 'Pohled shora: piny do drážek', en: 'Top view: pins into slots' }), { size: 12 }) +
        L.label(16, 24, ctx.t({ cs: 'Zatlačit a pootočit cca o 15–30°', en: 'Push in and twist approx. 15–30°' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Nejde to? Zkontrolujte typ – nepoužívat sílu', en: 'Won\'t go? Check the type – never force it' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Bajonetová patice žárovky', en: 'Bayonet bulb socket' }));
    }
  });

  /* ---------- rear: unit ---------- */
  A.register('lights.rearUnit', {
    render: function (ctx) {
      var nuts = [[170, 90], [330, 96], [250, 220]];
      var s = '<rect class="k-body2" x="40" y="40" width="400" height="230" rx="12"/>' +
        '<g class="lights-runit"><path class="k-dark s-line" stroke-width="1.5" d="M130,70 L370,80 Q392,82 390,104 L380,210 Q378,236 354,236 L150,236 Q126,236 124,212 Z"/>' +
        '<rect class="k-metal2" x="200" y="120" width="100" height="60" rx="6"/></g>' +
        '<g class="lights-rplug"><rect class="k-line s-dark" stroke-width="1.5" x="214" y="134" width="40" height="32" rx="4"/><path class="k-none s-dark" stroke-width="4" d="M214,150 Q160,150 120,180"/></g>';
      nuts.forEach(function (n, i) {
        s += '<g class="lights-nut" style="animation-delay:' + (i * 0.35) + 's">' + L.hex(n[0], n[1], 12, 'k-accent') + '</g>';
      });
      s += L.label(16, 24, ctx.t({ cs: 'Zevnitř kufru: matice → konektor → světlo ven', en: 'From inside the boot: nuts → connector → lamp out' }), { anchor: 'start', bg: true }) +
        L.warnIcon(36, 268) + L.label(60, 272, ctx.t({ cs: 'Matice jen lehce – plast praskne', en: 'Nuts only snug – plastic cracks' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Demontáž zadního světla', en: 'Removing the rear lamp' }));
    }
  });

  /* ---------- rear: function test ---------- */
  A.register('lights.test', {
    render: function (ctx) {
      var s = rearCar() +
        '<g class="lights-r1"><rect class="k-danger" x="74" y="124" width="72" height="16" rx="6"/><rect class="k-danger" x="334" y="124" width="72" height="16" rx="6"/><rect class="k-danger" x="210" y="46" width="60" height="10" rx="4"/></g>' +
        '<g class="lights-r2"><rect class="k-accent" x="74" y="142" width="34" height="18" rx="5"/></g>' +
        '<g class="lights-r3"><rect class="k-accent" x="372" y="142" width="34" height="18" rx="5"/></g>' +
        '<g class="lights-r4"><rect class="k-white" x="116" y="142" width="30" height="18" rx="5"/><rect class="k-white" x="334" y="142" width="30" height="18" rx="5"/><circle class="k-white lights-glow" cx="240" cy="200" r="70" opacity=".2"/></g>' +
        '<g class="lights-r5"><rect class="k-danger" x="74" y="124" width="72" height="16" rx="6"/><circle class="k-danger" cx="110" cy="132" r="26" opacity=".35"/></g>' +
        '<g class="lights-r6"><rect class="k-accent" x="74" y="142" width="34" height="18" rx="5"/><rect class="k-accent" x="372" y="142" width="34" height="18" rx="5"/></g>' +
        '<g class="lights-r1">' + L.label(16, 24, ctx.t({ cs: 'Brzda (+ 3. brzdové)', en: 'Brake (+ 3rd brake light)' }), { anchor: 'start', bg: true }) + '</g>' +
        '<g class="lights-r2">' + L.label(16, 24, ctx.t({ cs: 'Blinkr vlevo', en: 'Left indicator' }), { anchor: 'start', bg: true }) + '</g>' +
        '<g class="lights-r3">' + L.label(16, 24, ctx.t({ cs: 'Blinkr vpravo', en: 'Right indicator' }), { anchor: 'start', bg: true }) + '</g>' +
        '<g class="lights-r4">' + L.label(16, 24, ctx.t({ cs: 'Couvání', en: 'Reverse' }), { anchor: 'start', bg: true }) + '</g>' +
        '<g class="lights-r5">' + L.label(16, 24, ctx.t({ cs: 'Zadní mlhovka', en: 'Rear fog' }), { anchor: 'start', bg: true }) + '</g>' +
        '<g class="lights-r6">' + L.label(16, 24, ctx.t({ cs: 'Výstražná světla', en: 'Hazard lights' }), { anchor: 'start', bg: true }) + '</g>' +
        L.label(464, 24, ctx.t({ cs: 'Pomocník za vozem', en: 'Helper behind the car' }), { anchor: 'end', bg: true, size: 12 }) +
        L.label(464, 292, ctx.t({ cs: '+ obrysová a osvětlení SPZ', en: '+ tail lights and plate light' }), { anchor: 'end', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Test všech zadních světel', en: 'Testing all rear lights' }));
    }
  });

  /* ---------- seal ---------- */
  A.register('lights.seal', {
    render: function (ctx) {
      var s = '<rect class="k-body" x="40" y="150" width="200" height="30"/>' +
        '<rect class="k-dark" x="40" y="180" width="200" height="70" rx="4" opacity=".6"/>' +
        '<rect class="k-ok lib-pulse" x="150" y="138" width="60" height="14" rx="6"/>' +
        '<path class="k-paint" opacity=".7" d="M120,138 L240,138 L240,60 Q180,60 120,90 Z"/>' +
        '<g transform="translate(100,40)">' + [0, 1, 2].map(function (i) { return '<g transform="translate(' + (i * 14) + ',0)"><path class="k-fluid lights-drop" style="animation-delay:' + (i * 0.6) + 's" d="M0,0 Q5,8 0,12 Q-5,8 0,0 Z"/></g>'; }).join('') + '</g>' +
        L.check(250, 140) + L.label(140, 210, ctx.t({ cs: 'Těsnění celé, čisté, nepřekroucené', en: 'Seal intact, clean, not twisted' }), { bg: true, size: 12 }) +
        // fogged lamp inset
        '<g transform="translate(300,70)"><rect class="k-paint" opacity=".6" x="0" y="0" width="150" height="90" rx="12"/>';
      for (var i = 0; i < 14; i++) s += '<circle class="k-white" opacity=".7" cx="' + (12 + (i * 37) % 130) + '" cy="' + (14 + (i * 23) % 64) + '" r="' + (3 + i % 3) + '"/>';
      s += '</g>' + L.cross(440, 70) + L.label(375, 184, ctx.t({ cs: 'Voda / mlha uvnitř = netěsnost', en: 'Water / fog inside = leak' }), { bg: true, size: 12, cls: 'k-danger' }) +
        L.label(16, 24, ctx.t({ cs: 'Před montáží zkontrolujte těsnění', en: 'Check the seal before refitting' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Vadné těsnění = koroze kontaktů a vlhkost v kufru', en: 'Bad seal = corroded contacts and a wet boot' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Kontrola těsnění světla', en: 'Checking the lamp seal' }));
    }
  });
})(window.STU);
