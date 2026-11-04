/* Animations: steering wheel removal / replacement (airbag safety). */
(function (S) {
  'use strict';
  var L = S.animLib, A = S.anim;

  var WAIT = {
    'generic': { cs: 'čekat dle příručky (raději ≥ 10 min)', en: 'wait per manual (ideally ≥ 10 min)' },
    'mb-cl500-c216': { cs: 'čekat dle WIS (raději ≥ 10 min)', en: 'wait per WIS (ideally ≥ 10 min)' },
    'volvo-xc60-b4': { cs: 'čekat dle VIDA (raději ≥ 10 min)', en: 'wait per VIDA (ideally ≥ 10 min)' },
    'skoda-octavia-rs-tdi': { cs: 'čekat dle ELSA (raději ≥ 10 min)', en: 'wait per ELSA (ideally ≥ 10 min)' },
    'toyota-gr-yaris': { cs: 'min. 90 s dle TIS (raději ≥ 10 min)', en: 'min. 90 s per TIS (ideally ≥ 10 min)' },
    'citroen-jumper-22hdi': { cs: 'čekat dle příručky Citroën (raději ≥ 10 min)', en: 'wait per Citroën manual (ideally ≥ 10 min)' }
  };
  var TORX_CARS = { 'mb-cl500-c216': 1, 'toyota-gr-yaris': 1 };

  A.css('steer', [
    '.steer-clampoff{animation:steer-clampoff 8s ease-in-out infinite}',
    '@keyframes steer-clampoff{0%,10%{transform:translate(0,0)}30%,92%{transform:translate(60px,8px)}100%{transform:translate(0,0)}}',
    '.steer-ring{stroke-dasharray:226;animation:steer-ring 8s linear infinite}',
    '@keyframes steer-ring{0%,30%{stroke-dashoffset:0}92%{stroke-dashoffset:226}100%{stroke-dashoffset:0}}',
    '.steer-turn{animation:steer-turn 6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes steer-turn{0%{transform:rotate(-35deg)}45%,100%{transform:rotate(0)}}',
    '.steer-fw{animation:steer-fw 6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes steer-fw{0%{transform:rotate(-14deg)}45%,100%{transform:rotate(0)}}',
    '.steer-markok{animation:steer-markok 6s linear infinite;opacity:0}',
    '@keyframes steer-markok{0%,50%{opacity:0}56%,94%{opacity:1}100%{opacity:0}}',
    '.steer-driver{animation:steer-driver 6s ease-in-out infinite}',
    '@keyframes steer-driver{0%,10%{transform:translate(70px,-40px);opacity:0}20%{opacity:1}40%,55%{transform:translate(0,0)}62%{transform:translate(-8px,4px)}70%,90%{transform:translate(0,0);opacity:1}100%{opacity:0}}',
    '.steer-torx{animation:steer-torx 6s ease-in-out infinite}',
    '@keyframes steer-torx{0%,15%{transform:translate(0,0);opacity:1}55%{transform:translate(0,-26px);opacity:1}70%,92%{transform:translate(0,-60px);opacity:0}100%{transform:translate(0,0);opacity:1}}',
    '.steer-lock{animation:steer-lock 6s ease-in-out infinite}',
    '@keyframes steer-lock{0%,15%{transform:translateY(0)}30%,90%{transform:translateY(-14px)}100%{transform:translateY(0)}}',
    '.steer-unplug{animation:steer-unplug 6s ease-in-out infinite}',
    '@keyframes steer-unplug{0%,35%{transform:translateY(0)}60%,90%{transform:translateY(60px)}100%{transform:translateY(0)}}',
    '.steer-socket{animation:steer-socket 6s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes steer-socket{0%,40%{transform:rotate(0)}70%,90%{transform:rotate(-120deg)}100%{transform:rotate(0)}}',
    '.steer-marks{animation:steer-marks 6s linear infinite;opacity:0}',
    '@keyframes steer-marks{0%,10%{opacity:0}20%,94%{opacity:1}100%{opacity:0}}',
    '.steer-pull{animation:steer-pull 6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes steer-pull{0%,15%{transform:scale(1) rotate(0);opacity:1}25%{transform:scale(1) rotate(-3deg)}35%{transform:scale(1.02) rotate(3deg)}45%{transform:scale(1.04) rotate(-3deg)}75%,90%{transform:scale(1.3);opacity:0}100%{transform:scale(1);opacity:1}}',
    '.steer-nospin{animation:steer-nospin 3s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes steer-nospin{0%,100%{transform:rotate(0)}50%{transform:rotate(12deg)}}',
    '.steer-wheeldown{animation:steer-wheeldown 7s ease-in-out infinite}',
    '@keyframes steer-wheeldown{0%,10%{transform:translateY(-110px)}45%,92%{transform:translateY(0)}100%{transform:translateY(-110px)}}',
    '.steer-tq{animation:steer-tq 7s linear infinite;opacity:0}',
    '@keyframes steer-tq{0%,55%{opacity:0}62%,94%{opacity:1}100%{opacity:0}}',
    '.steer-lamp{animation:steer-lamp 7s steps(1,end) infinite}',
    '@keyframes steer-lamp{0%,40%{fill:var(--a-danger)}40.1%,100%{fill:var(--a-line)}}',
    '.steer-ok{animation:steer-ok 7s linear infinite;opacity:0}',
    '@keyframes steer-ok{0%,44%{opacity:0}50%,94%{opacity:1}100%{opacity:0}}',
    '.steer-bar{animation:steer-bar 6s ease-in-out infinite;transform-box:fill-box;transform-origin:0 50%}',
    '@keyframes steer-bar{0%,15%{transform:scaleX(0)}65%,100%{transform:scaleX(1)}}',
    '.steer-done{animation:steer-done 6s linear infinite;opacity:0}',
    '@keyframes steer-done{0%,66%{opacity:0}72%,96%{opacity:1}100%{opacity:0}}',
    '.steer-flag{animation:steer-flag 2s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes steer-flag{0%,100%{transform:skewY(0)}50%{transform:skewY(-6deg)}}'
  ].join('\n'));

  /** Front view of a 3-spoke steering wheel centred at (0,0). withBag=false shows the bare hub. */
  function wheel(r, withBag) {
    var s = '<circle class="k-none s-dark" stroke-width="' + (r * 0.16).toFixed(1) + '" r="' + r + '"/>';
    s += '<path class="k-dark" d="M' + (-r) + ',-6 L' + (-r * 0.35) + ',-14 L' + (-r * 0.35) + ',14 L' + (-r) + ',10 Z"/>';
    s += '<path class="k-dark" d="M' + r + ',-6 L' + (r * 0.35) + ',-14 L' + (r * 0.35) + ',14 L' + r + ',10 Z"/>';
    s += '<path class="k-dark" d="M-12,' + (r * 0.3) + ' L12,' + (r * 0.3) + ' L10,' + r + ' L-10,' + r + ' Z"/>';
    if (withBag !== false) {
      s += '<rect class="k-dark s-metal2" stroke-width="2" x="' + (-r * 0.42) + '" y="' + (-r * 0.36) + '" width="' + (r * 0.84) + '" height="' + (r * 0.72) + '" rx="' + (r * 0.18) + '"/>';
      s += '<circle class="k-none s-metal" stroke-width="2" r="' + (r * 0.12) + '"/>';
      s += '<text y="' + (r * 0.28) + '" text-anchor="middle" font-size="' + (r * 0.11).toFixed(0) + '" font-weight="800" class="k-muted">AIRBAG</text>';
    } else {
      s += '<circle class="k-metal2 s-dark" stroke-width="2" r="' + (r * 0.3) + '"/>';
    }
    return s;
  }

  A.register('steer.battery', {
    render: function (ctx) {
      var s = '<rect class="k-dark" x="40" y="110" width="200" height="130" rx="10"/><rect class="k-metal2" x="40" y="110" width="200" height="22" rx="8"/>' +
        '<rect class="k-danger" x="70" y="96" width="30" height="16" rx="3"/><rect class="k-metal" x="180" y="96" width="30" height="16" rx="3"/>' +
        '<text x="85" y="180" text-anchor="middle" font-size="26" font-weight="800" class="k-white">+</text><text x="195" y="180" text-anchor="middle" font-size="26" font-weight="800" class="k-white">−</text>' +
        '<g class="steer-clampoff"><rect class="k-metal2 s-dark" stroke-width="1.5" x="176" y="84" width="38" height="18" rx="4"/>' +
        '<path class="k-none s-dark" stroke-width="8" stroke-linecap="round" d="M214,93 Q260,93 270,60"/></g>' +
        '<g transform="translate(370,150)"><circle class="k-none s-line" stroke-width="10" r="36"/>' +
        '<circle class="k-none s-accent steer-ring" stroke-width="10" r="36" transform="rotate(-90)"/>' +
        '<line class="s-dark" stroke-width="3" x1="0" y1="0" x2="0" y2="-18"/><line class="s-dark" stroke-width="3" x1="0" y1="0" x2="12" y2="0"/></g>' +
        L.label(370, 214, ctx.t(WAIT[ctx.vehicle] || WAIT.generic), { bg: true, size: 12 }) +
        L.label(16, 24, ctx.t({ cs: '1. Odpojit minus (−) pól baterie a zaizolovat', en: '1. Disconnect the negative (−) terminal and insulate it' }), { anchor: 'start', bg: true }) +
        L.label(16, 50, ctx.t({ cs: '2. Počkat – kondenzátor airbagu se vybije', en: '2. Wait – the airbag capacitor discharges' }), { anchor: 'start', bg: true }) +
        L.warnIcon(32, 270) + L.label(52, 274, ctx.t({ cs: 'Nespěchat! Airbag může vystřelit.', en: 'Do not rush! The airbag can deploy.' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Odpojení baterie a čekání', en: 'Disconnecting the battery and waiting' }));
    }
  });

  A.register('steer.center', {
    render: function (ctx) {
      var s = '<g transform="translate(140,165)"><g class="steer-turn">' + wheel(80) +
        '<rect class="k-accent" x="-3" y="-94" width="6" height="22"/></g>' +
        '<rect class="k-accent" x="-3" y="-116" width="6" height="18"/>' +
        '<g class="steer-markok">' + L.check(36, -106) + '</g></g>';
      // top view of the front axle
      s += '<g transform="translate(360,150)"><rect class="k-body" opacity=".35" x="-70" y="-110" width="140" height="220" rx="30"/>' +
        '<g transform="translate(-62,-60)"><g class="steer-fw"><rect class="k-tire" x="-12" y="-28" width="24" height="56" rx="6"/></g></g>' +
        '<g transform="translate(62,-60)"><g class="steer-fw"><rect class="k-tire" x="-12" y="-28" width="24" height="56" rx="6"/></g></g>' +
        '<rect class="k-tire" x="-74" y="40" width="24" height="56" rx="6"/><rect class="k-tire" x="50" y="40" width="24" height="56" rx="6"/>' +
        '<g class="steer-markok">' + L.arrow(0, -20, 0, -100, 'ok', 3) + '</g></g>';
      s += L.label(16, 24, ctx.t({ cs: 'Kola rovně, volant v rovině – zámek řízení', en: 'Wheels straight, wheel level – steering lock on' }), { anchor: 'start', bg: true });
      s += L.label(140, 286, ctx.t({ cs: 'Značka volant ↔ sloupek', en: 'Mark wheel ↔ column' }), { bg: true });
      s += L.label(360, 286, ctx.t({ cs: 'Přední kola rovně', en: 'Front wheels straight' }), { bg: true });
      return L.svg(s, ctx.t({ cs: 'Vyrovnání kol a volantu', en: 'Centring wheels and steering wheel' }));
    }
  });

  A.register('steer.airbagRelease', {
    render: function (ctx) {
      var torx = !!TORX_CARS[ctx.vehicle];
      // rear view of the wheel: rim, back cover with holes
      var s = '<g transform="translate(240,160)"><circle class="k-none s-dark" stroke-width="16" r="110"/>' +
        '<path class="k-metal2 s-dark" stroke-width="2" d="M-70,-40 Q0,-70 70,-40 L80,30 Q0,70 -80,30 Z"/>' +
        '<circle class="k-dark" r="22"/>';
      var pts = torx ? [[-60, -4], [60, -4]] : [[-62, 0], [62, 0], [0, 48]];
      pts.forEach(function (p) {
        s += '<circle class="k-dark" cx="' + p[0] + '" cy="' + p[1] + '" r="9"/>';
        if (torx) s += '<g transform="translate(' + p[0] + ',' + p[1] + ')"><g class="steer-torx">' + L.hex(0, 0, 8, 'k-metal') + '<circle class="k-dark" r="3"/></g></g>';
      });
      s += '</g>';
      if (!torx) {
        s += '<g transform="translate(302,160)"><g class="steer-driver"><rect class="k-metal" x="0" y="-3" width="90" height="6" rx="2"/><rect class="k-danger s-dark" stroke-width="1.5" x="90" y="-10" width="70" height="20" rx="8"/></g></g>';
        s += L.label(16, 24, ctx.t({ cs: 'Šroubovákem otvory vzadu uvolnit pružinové spony', en: 'Release the spring clips with a screwdriver through the rear holes' }), { anchor: 'start', bg: true });
        s += L.label(16, 286, ctx.t({ cs: 'Pootáčet volantem o 90° k dalšímu otvoru', en: 'Turn the wheel 90° to reach the next hole' }), { anchor: 'start', bg: true });
      } else {
        s += L.label(16, 24, ctx.t({ cs: 'Torx šrouby zezadu volantu vyšroubovat', en: 'Undo the Torx screws on the back of the wheel' }), { anchor: 'start', bg: true });
        s += L.label(16, 286, ctx.t({ cs: 'Šrouby bývají zajištěné v pouzdře – nevypadnou', en: 'Screws are often captive – they stay in the housing' }), { anchor: 'start', bg: true });
      }
      s += L.label(464, 54, ctx.t({ cs: 'pohled zezadu', en: 'rear view' }), { anchor: 'end', bg: true, size: 12, cls: 'k-muted' });
      return L.svg(s, ctx.t({ cs: 'Uvolnění airbagu', en: 'Releasing the airbag module' }));
    }
  });

  A.register('steer.connector', {
    render: function (ctx) {
      var s = '<rect class="k-dark s-metal2" stroke-width="2" x="120" y="40" width="240" height="110" rx="24"/>' +
        '<text x="240" y="102" text-anchor="middle" font-size="16" font-weight="800" class="k-muted">AIRBAG</text>' +
        '<rect class="k-metal2" x="200" y="150" width="80" height="22"/>' +
        '<g class="steer-unplug"><rect class="k-warn s-dark" stroke-width="1.5" x="206" y="168" width="68" height="42" rx="5"/>' +
        '<g class="steer-lock"><rect class="k-danger" x="212" y="160" width="56" height="10" rx="3"/></g>' +
        '<path class="k-none s-warn" stroke-width="6" d="M240,210 L240,250 Q240,270 270,270 L460,270"/></g>' +
        L.label(16, 24, ctx.t({ cs: 'Zajišťovací páčku zvednout, konektor vytáhnout rovně', en: 'Lift the locking tab, pull the connector straight out' }), { anchor: 'start', bg: true }) +
        L.label(120, 230, ctx.t({ cs: 'žlutý = airbag', en: 'yellow = airbag' }), { bg: true, cls: 'k-warn', size: 12 }) +
        L.label(464, 236, ctx.t({ cs: 'Za kabel netahat', en: 'Never pull the wire' }), { anchor: 'end', bg: true, cls: 'k-danger', size: 12 });
      return L.svg(s, ctx.t({ cs: 'Odpojení konektoru airbagu', en: 'Unplugging the airbag connector' }));
    }
  });

  A.register('steer.airbagCarry', {
    render: function (ctx) {
      // left: person carrying module, cover away from body
      var s = '<g transform="translate(110,160)"><circle class="k-body" cx="0" cy="-90" r="22"/><rect class="k-body" x="-24" y="-64" width="48" height="110" rx="16"/>' +
        '<rect class="k-body" x="-18" y="46" width="14" height="60" rx="6"/><rect class="k-body" x="4" y="46" width="14" height="60" rx="6"/>' +
        '<rect class="k-body" x="10" y="-40" width="54" height="12" rx="6"/>' +
        '<rect class="k-dark" x="64" y="-62" width="14" height="56" rx="4"/><rect class="k-warn" x="76" y="-62" width="6" height="56" rx="2"/>' +
        L.arrow(92, -34, 130, -34, 'ok', 3) + '</g>';
      s += L.label(110, 286, ctx.t({ cs: 'Kryt airbagu od těla', en: 'Airbag cover away from body' }), { bg: true });
      // right: bench, face up OK / face down X
      s += '<rect class="k-metal2" x="280" y="200" width="180" height="12" rx="3"/><rect class="k-metal2" x="290" y="212" width="10" height="50"/><rect class="k-metal2" x="440" y="212" width="10" height="50"/>' +
        '<rect class="k-dark" x="310" y="180" width="60" height="20" rx="6"/><rect class="k-warn" x="310" y="176" width="60" height="6" rx="2"/>' + L.check(340, 150) +
        '<rect class="k-dark" x="390" y="180" width="60" height="20" rx="6"/><rect class="k-warn" x="390" y="198" width="60" height="6" rx="2"/>' + L.cross(420, 150);
      s += L.label(370, 286, ctx.t({ cs: 'Uložit krytem NAHORU', en: 'Store cover facing UP' }), { bg: true });
      s += L.label(16, 24, ctx.t({ cs: 'Nic na něj nepokládat, mimo teplo a děti', en: 'Put nothing on it, away from heat and children' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Přenášení a uložení airbagu', en: 'Carrying and storing the airbag' }));
    }
  });

  A.register('steer.bolt', {
    render: function (ctx) {
      var s = '<g transform="translate(220,160)">' + wheel(110, false) +
        '<g class="steer-marks"><rect class="k-accent" x="-2" y="-46" width="4" height="16"/><rect class="k-accent" x="-2" y="-30" width="4" height="10"/></g>' +
        '<g class="steer-socket"><rect class="k-metal s-dark" stroke-width="1.5" x="-16" y="-16" width="32" height="32" rx="6"/><rect class="k-metal2 s-dark" stroke-width="1" x="-5" y="16" width="10" height="120" rx="3"/></g>' +
        L.hex(0, 0, 10, 'k-dark') + '</g>' +
        L.rotArrow(220, 160, 40, 'ccw', 'accent', 160) +
        L.label(16, 24, ctx.t({ cs: 'Značka na hřídeli a volantu, pak povolit šroub', en: 'Mark shaft and wheel, then loosen the bolt' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Šroub nechat pár závitů – volant nespadne', en: 'Leave the bolt in a few threads – the wheel cannot fly off' }), { anchor: 'start', bg: true }) +
        L.label(464, 60, ctx.t({ cs: 'Pružný šroub = vždy nový', en: 'Stretch bolt = always new' }), { anchor: 'end', bg: true, cls: 'k-danger', size: 12 });
      return L.svg(s, ctx.t({ cs: 'Povolení šroubu volantu', en: 'Loosening the steering wheel bolt' }));
    }
  });

  A.register('steer.puller', {
    render: function (ctx) {
      var s = '<circle class="k-metal2" cx="240" cy="150" r="24"/>' +
        '<g class="steer-pull"><g transform="translate(240,150)">' + wheel(110, false) +
        '<circle class="k-body" cx="-112" cy="0" r="16"/><circle class="k-body" cx="112" cy="0" r="16"/></g></g>' +
        '<g transform="translate(410,230)"><rect class="k-metal2" x="-6" y="-40" width="12" height="50" rx="3"/><rect class="k-dark" x="-26" y="-56" width="52" height="20" rx="4"/></g>' + L.cross(440, 196) +
        L.label(16, 24, ctx.t({ cs: 'Kolébat a táhnout oběma rukama k sobě', en: 'Rock and pull towards you with both hands' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Netlouct kladivem – poškodí deformační sloupek', en: 'Never hammer – it damages the collapsible column' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Stažení volantu', en: 'Pulling the steering wheel off' }));
    }
  });

  A.register('steer.clockspring', {
    render: function (ctx) {
      var spiral = '';
      for (var i = 0; i < 5; i++) spiral += '<circle class="k-none s-warn" stroke-width="2" r="' + (30 + i * 9) + '" opacity=".7"/>';
      var s = '<g transform="translate(220,160)"><g class="steer-nospin"><circle class="k-dark" r="90"/>' + spiral +
        '<circle class="k-metal2" r="22"/><rect class="k-warn" x="60" y="-8" width="24" height="16" rx="3"/></g>' +
        '<rect class="k-accent" opacity=".85" x="-100" y="-10" width="200" height="20" rx="3" transform="rotate(-25)"/></g>' +
        L.cross(370, 150) + L.rotArrow(220, 160, 104, 'cw', 'danger', 90) +
        L.label(16, 24, ctx.t({ cs: 'Spirální kabel (clock spring) přelepit páskou', en: 'Tape the clock spring (spiral cable) in place' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Neotáčet! Jinak se kabel přetrhne → airbag nefunguje', en: 'Do not rotate! Otherwise the cable breaks → airbag fails' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Zajištění spirálního kabelu', en: 'Securing the clock spring' }));
    }
  });

  A.register('steer.refit', {
    render: function (ctx) {
      var tq = {
        'skoda-octavia-rs-tdi': { cs: 'nový šroub · 30 Nm + 90°', en: 'new bolt · 30 Nm + 90°' },
        'mb-cl500-c216': { cs: 'moment dle WIS', en: 'torque per WIS' },
        'volvo-xc60-b4': { cs: 'moment dle VIDA', en: 'torque per VIDA' },
        'toyota-gr-yaris': { cs: 'moment dle TIS', en: 'torque per TIS' },
        'citroen-jumper-22hdi': { cs: 'moment dle příručky (ověřit)', en: 'torque per manual (verify)' }
      }[ctx.vehicle] || { cs: 'moment dle příručky', en: 'torque per manual' };
      var s = '<rect class="k-metal2" x="226" y="170" width="28" height="120"/>';
      for (var i = 0; i < 6; i++) s += '<line class="s-dark" stroke-width="2" x1="' + (230 + i * 4) + '" y1="170" x2="' + (230 + i * 4) + '" y2="210"/>';
      s += '<rect class="k-accent" x="238" y="212" width="4" height="20"/>';
      s += '<g class="steer-wheeldown"><rect class="k-dark" x="120" y="140" width="240" height="30" rx="10"/><rect class="k-metal2" x="214" y="140" width="52" height="40" rx="6"/>' +
        '<rect class="k-accent" x="238" y="120" width="4" height="22"/></g>';
      s += '<g class="steer-tq">' + L.badge(240, 70, ctx.t(tq), 'accent') + '</g>';
      s += L.label(16, 24, ctx.t({ cs: 'Značky zarovnat, volant nasadit, kola rovně', en: 'Align the marks, fit the wheel, wheels straight' }), { anchor: 'start', bg: true });
      s += L.label(16, 286, ctx.t({ cs: 'Kabely protáhnout – nic nesmí být přiskřípnuté', en: 'Route the wires – nothing may get pinched' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Nasazení volantu', en: 'Refitting the wheel' }));
    }
  });

  A.register('steer.test', {
    render: function (ctx) {
      var s = '<rect class="k-dark" x="60" y="60" width="360" height="150" rx="20"/>' +
        '<g transform="translate(180,135)"><g class="steer-lamp"><circle cx="0" cy="-26" r="9"/><path d="M-10,-14 L10,-14 L14,10 L4,10 L2,26 L-6,26 L-8,10 L-14,10 Z"/><circle cx="24" cy="2" r="18" opacity=".7"/></g></g>' +
        '<g class="steer-ok">' + L.check(300, 120) + L.label(300, 160, ctx.t({ cs: 'kontrolka zhasla', en: 'light went out' }), { size: 12, cls: 'k-white' }) + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Nikdo ve voze, baterii připojit, zapalování ZAP', en: 'Nobody in the car, connect battery, ignition ON' }), { anchor: 'start', bg: true }) +
        L.label(16, 254, ctx.t({ cs: 'Kontrolka airbagu musí po pár s zhasnout', en: 'The airbag light must go out after a few seconds' }), { anchor: 'start', bg: true }) +
        L.label(16, 282, ctx.t({ cs: 'Svítí dál? Nejezdit – načíst chyby', en: 'Stays on? Do not drive – read fault codes' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Kontrola kontrolky airbagu', en: 'Airbag warning light check' }));
    }
  });

  A.register('steer.calibrate', {
    render: function (ctx) {
      var tool = {
        'skoda-octavia-rs-tdi': 'VCDS / ODIS', 'mb-cl500-c216': 'XENTRY', 'volvo-xc60-b4': 'VIDA', 'toyota-gr-yaris': 'Techstream', 'citroen-jumper-22hdi': 'Diagbox'
      }[ctx.vehicle] || ctx.t({ cs: 'Diagnostika', en: 'Scan tool' });
      var s = '<rect class="k-dark" x="100" y="40" width="280" height="190" rx="16"/><rect class="k-ground" x="114" y="54" width="252" height="162" rx="8"/>' +
        L.label(240, 80, tool, { size: 15 }) +
        L.label(240, 112, ctx.t({ cs: 'Snímač úhlu natočení', en: 'Steering angle sensor' }), { size: 13 }) +
        '<rect class="k-line" x="140" y="132" width="200" height="14" rx="7"/><g class="steer-bar"><rect class="k-ok" x="140" y="132" width="200" height="14" rx="7"/></g>' +
        '<g class="steer-done">' + L.label(240, 180, ctx.t({ cs: '0,0° · kalibrováno ✔', en: '0.0° · calibrated ✔' }), { size: 15, cls: 'k-ok' }) + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Kola rovně, vůz stojí', en: 'Wheels straight, car stationary' }), { anchor: 'start', bg: true }) +
        L.label(16, 270, ctx.t({ cs: 'Bez kalibrace: chyba ESP, asistenty nefungují', en: 'Without calibration: ESP fault, assists do not work' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Kalibrace snímače úhlu natočení', en: 'Steering angle sensor calibration' }));
    }
  });

  A.register('steer.trackOnly', {
    render: function (ctx) {
      var flag = '';
      for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) {
        flag += '<rect class="' + ((r + c) % 2 ? 'k-white' : 'k-dark') + '" x="' + (c * 14) + '" y="' + (r * 14) + '" width="14" height="14"/>';
      }
      var s = '<g transform="translate(70,60)"><rect class="k-metal2" x="-6" y="0" width="6" height="170"/><g class="steer-flag">' + flag + '</g></g>' +
        L.label(110, 254, ctx.t({ cs: 'Okruh: OK', en: 'Track: OK' }), { bg: true, cls: 'k-ok' }) +
        // road sign with car crossed
        '<g transform="translate(330,140)"><circle class="k-white s-danger" stroke-width="12" r="70"/>' +
        '<g transform="translate(-48,22) scale(.32)">' + L.car(0, 0, { r: 30 }) + '</g>' +
        '<line class="s-danger" stroke-width="10" x1="-50" y1="-50" x2="50" y2="50"/></g>' +
        L.label(330, 254, ctx.t({ cs: 'Silnice: NE (bez airbagu)', en: 'Road: NO (no airbag)' }), { bg: true, cls: 'k-danger' }) +
        L.label(16, 24, ctx.t({ cs: 'Volant bez airbagu = jen okruh, ne provoz', en: 'Wheel without airbag = track only, not public roads' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Náboj / rychloupínák jen certifikovaný pro váš vůz', en: 'Hub / quick release only certified for your car' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Sportovní volant – jen na okruh', en: 'Aftermarket wheel – track only' }));
    }
  });
})(window.STU);
