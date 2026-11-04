/* Animations: basic OBD-II diagnostics. */
(function (S) {
  'use strict';
  var L = S.animLib, A = S.anim;

  var PORT = {
    'generic': { cs: 'pod palubní deskou u řidiče', en: 'under the dash, driver side' },
    'mb-cl500-c216': { cs: 'pod palubní deskou vlevo (za krytkou)', en: 'under the dash, left (behind a cover)' },
    'volvo-xc60-b4': { cs: 'pod palubní deskou u řidiče', en: 'under the dash, driver side' },
    'skoda-octavia-rs-tdi': { cs: 'pod palubní deskou vlevo od volantu', en: 'under the dash, left of the steering column' },
    'toyota-gr-yaris': { cs: 'pod palubní deskou u řidiče', en: 'under the dash, driver side' },
    'citroen-jumper-22hdi': { cs: 'pod palubní deskou u řidiče, za krytkou (ověřit)', en: 'under the dash, driver side, behind a cover (verify)' }
  };

  A.css('diag', [
    '.diag-on{animation:diag-on 8s linear infinite;opacity:.15}',
    '@keyframes diag-on{0%,8%{opacity:.15}12%,96%{opacity:1}100%{opacity:.15}}',
    '.diag-plug{animation:diag-plug 6s ease-in-out infinite}',
    '@keyframes diag-plug{0%,10%{transform:translate(60px,70px)}45%,100%{transform:translate(0,0)}}',
    '.diag-led{animation:diag-led 6s steps(1,end) infinite}',
    '@keyframes diag-led{0%,48%{fill:var(--a-line)}50%,60%{fill:var(--a-ok)}62%{fill:var(--a-line)}64%,100%{fill:var(--a-ok)}}',
    '.diag-scan{animation:diag-scan 6s ease-in-out infinite;transform-box:fill-box;transform-origin:0 50%}',
    '@keyframes diag-scan{0%,10%{transform:scaleX(0)}45%,100%{transform:scaleX(1)}}',
    '.diag-row{opacity:0}',
    [0, 1, 2].map(function (i) {
      var a = 48 + i * 10;
      return '.diag-row' + i + '{animation:diag-row' + i + ' 6s linear infinite}@keyframes diag-row' + i + '{0%,' + a + '%{opacity:0}' + (a + 3) + '%,96%{opacity:1}100%{opacity:0}}';
    }).join('\n'),
    [0, 1, 2, 3, 4].map(function (i) {
      var a = 6 + i * 17;
      return '.diag-ch' + i + '{animation:diag-ch' + i + ' 10s linear infinite}@keyframes diag-ch' + i + '{0%,' + a + '%{fill:var(--a-text)}' + (a + 2) + '%,' + (a + 15) + '%{fill:var(--a-accent)}' + (a + 17) + '%,100%{fill:var(--a-text)}}' +
        '.diag-ex' + i + '{opacity:0;animation:diag-ex' + i + ' 10s linear infinite}@keyframes diag-ex' + i + '{0%,' + a + '%{opacity:0}' + (a + 2) + '%,' + (a + 15) + '%{opacity:1}' + (a + 17) + '%,100%{opacity:0}}';
    }).join('\n'),
    '.diag-draw{stroke-dasharray:600;stroke-dashoffset:600;animation:diag-draw 8s linear infinite}',
    '@keyframes diag-draw{0%{stroke-dashoffset:600}80%,100%{stroke-dashoffset:0}}',
    '.diag-flash{animation:diag-flash 6s linear infinite;opacity:0}',
    '@keyframes diag-flash{0%,18%{opacity:0}20%{opacity:.9}28%,100%{opacity:0}}',
    '.diag-table{animation:diag-table 6s linear infinite;opacity:0}',
    '@keyframes diag-table{0%,24%{opacity:0}32%,96%{opacity:1}100%{opacity:0}}',
    [0, 1, 2, 3].map(function (i) {
      var a = 8 + i * 18;
      return '.diag-c' + i + '{animation:diag-c' + i + ' 9s linear infinite}@keyframes diag-c' + i + '{0%,' + a + '%{fill:var(--a-line)}' + (a + 3) + '%,96%{fill:var(--a-accent)}100%{fill:var(--a-line)}}';
    }).join('\n'),
    '.diag-x{animation:diag-x 8s linear infinite}',
    '@keyframes diag-x{0%,30%{opacity:1}35%,100%{opacity:.25}}',
    [0, 1, 2].map(function (i) {
      var a = 38 + i * 16;
      return '.diag-f' + i + '{opacity:0;animation:diag-f' + i + ' 8s linear infinite}@keyframes diag-f' + i + '{0%,' + a + '%{opacity:0}' + (a + 4) + '%,96%{opacity:1}100%{opacity:0}}';
    }).join('\n'),
    [0, 1, 2, 3].map(function (i) {
      var a = 10 + i * 18;
      return '.diag-m' + i + '{opacity:0;animation:diag-m' + i + ' 9s linear infinite}@keyframes diag-m' + i + '{0%,' + a + '%{opacity:0}' + (a + 3) + '%,96%{opacity:1}100%{opacity:0}}';
    }).join('\n'),
    '.diag-needle{animation:diag-needle 6s ease-in-out infinite;transform-origin:0 0}',
    '@keyframes diag-needle{0%,15%{transform:rotate(-20deg)}50%,85%{transform:rotate(25deg)}100%{transform:rotate(-20deg)}}',
    '.diag-chg{animation:diag-chg 6s linear infinite;opacity:0}',
    '@keyframes diag-chg{0%,40%{opacity:0}48%,90%{opacity:1}100%{opacity:0}}'
  ].join('\n'));

  /** Handheld scanner frame; screen area x 150–330, y 40–200. */
  function scanner(inner) {
    return '<rect class="k-dark" x="130" y="20" width="220" height="260" rx="20"/>' +
      '<rect class="k-ground" x="146" y="36" width="188" height="170" rx="8"/>' + inner +
      '<circle class="k-metal2" cx="200" cy="244" r="14"/><circle class="k-metal2" cx="280" cy="244" r="14"/><rect class="k-ok" x="226" y="232" width="28" height="24" rx="6"/>';
  }

  /* simple dashboard icons */
  function icon(kind, cls) {
    switch (kind) {
      case 'oil': return '<path class="' + cls + '" d="M-24,-4 L-4,-4 L4,-10 L18,-4 L30,-10 L32,-6 L14,8 L-24,8 Z"/>';
      case 'bat': return '<g class="' + cls + '"><rect x="-20" y="-10" width="40" height="22" rx="3"/><rect x="-14" y="-15" width="7" height="5"/><rect x="7" y="-15" width="7" height="5"/></g>';
      case 'temp': return '<g class="' + cls + '"><rect x="-3" y="-18" width="6" height="22" rx="3"/><circle cx="0" cy="8" r="7"/><rect x="5" y="-14" width="10" height="3"/><rect x="5" y="-6" width="10" height="3"/></g>';
      case 'brake': return '<g><circle class="k-none s-danger" stroke-width="4" r="16"/><text y="7" text-anchor="middle" font-size="20" font-weight="900" class="' + cls + '">!</text></g>';
      case 'engine': return '<path class="' + cls + '" d="M-26,-10 L10,-10 L10,-16 L20,-16 L20,-4 L26,-4 L26,10 L20,10 L20,16 L-20,16 L-26,8 Z"/>';
      case 'abs': return '<g><circle class="k-none s-warn" stroke-width="3.5" r="16"/><text y="5" text-anchor="middle" font-size="11" font-weight="900" class="' + cls + '">ABS</text></g>';
      case 'tpms': return '<g><path class="k-none s-warn" stroke-width="3.5" d="M-14,12 Q-20,-2 -12,-14 L12,-14 Q20,-2 14,12 Z"/><text y="6" text-anchor="middle" font-size="16" font-weight="900" class="' + cls + '">!</text></g>';
      case 'airbag': return '<g class="' + cls + '"><circle cx="-6" cy="-12" r="5"/><path d="M-12,-4 L0,-4 L4,12 L-10,12 Z"/><circle cx="12" cy="0" r="9" opacity=".7"/></g>';
    }
    return '';
  }

  A.register('diag.lights', {
    render: function (ctx) {
      var red = [['oil', { cs: 'Tlak oleje', en: 'Oil pressure' }], ['temp', { cs: 'Teplota', en: 'Coolant temp' }], ['bat', { cs: 'Dobíjení', en: 'Charging' }], ['brake', { cs: 'Brzdy', en: 'Brakes' }]];
      var yel = [['engine', { cs: 'Motor (MIL)', en: 'Engine (MIL)' }], ['abs', { cs: 'ABS', en: 'ABS' }], ['tpms', { cs: 'Tlak pneu', en: 'Tyre pressure' }], ['airbag', { cs: 'Airbag', en: 'Airbag' }]];
      var s = '<rect class="k-dark" x="16" y="40" width="448" height="210" rx="18"/>';
      red.forEach(function (r, i) {
        var x = 76 + i * 110;
        s += '<g transform="translate(' + x + ',90)"><g class="diag-on" style="animation-delay:' + (i * 0.2) + 's">' + icon(r[0], 'k-danger') + '</g></g>' + L.label(x, 128, ctx.t(r[1]), { size: 11, cls: 'k-metal' });
      });
      yel.forEach(function (r, i) {
        var x = 76 + i * 110;
        s += '<g transform="translate(' + x + ',180)"><g class="diag-on" style="animation-delay:' + (1 + i * 0.2) + 's">' + icon(r[0], r[0] === 'airbag' ? 'k-danger' : 'k-warn') + '</g></g>' + L.label(x, 218, ctx.t(r[1]), { size: 11, cls: 'k-metal' });
      });
      s += L.label(16, 20, ctx.t({ cs: 'ČERVENÁ = zastavit hned, motor vypnout', en: 'RED = stop now, switch the engine off' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      s += L.label(16, 278, ctx.t({ cs: 'ŽLUTÁ = brzy do servisu · BLIKÁ motor = zpomalit!', en: 'YELLOW = service soon · FLASHING engine = slow down!' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Význam varovných kontrolek', en: 'Meaning of warning lights' }));
    }
  });

  A.register('diag.battery', {
    render: function (ctx) {
      var s = '<g transform="translate(140,170)"><rect class="k-dark" x="-80" y="-50" width="160" height="100" rx="8"/><rect class="k-metal2" x="-60" y="-62" width="22" height="14"/><rect class="k-metal2" x="38" y="-62" width="22" height="14"/>' +
        '<text x="-49" y="-24" text-anchor="middle" font-size="18" font-weight="800" class="k-danger">+</text><text x="49" y="-24" text-anchor="middle" font-size="18" font-weight="800" class="k-text">−</text>' +
        '<text y="18" text-anchor="middle" font-size="16" font-weight="800" class="k-metal">12 V</text></g>' +
        // voltmeter
        '<g transform="translate(350,170)"><path class="k-none s-danger" stroke-width="12" d="M-70,0 A70,70 0 0 1 -35,-60.6"/><path class="k-none s-warn" stroke-width="12" d="M-33,-61.7 A70,70 0 0 1 10,-69.3"/><path class="k-none s-ok" stroke-width="12" d="M12,-69 A70,70 0 0 1 70,0"/>' +
        '<g class="diag-needle"><line class="s-text" stroke-width="4" stroke-linecap="round" x1="0" y1="0" x2="0" y2="-60"/></g><circle class="k-dark" r="7"/>' +
        '<text x="-70" y="22" text-anchor="middle" font-size="11" class="k-muted">11.8</text><text x="0" y="-80" text-anchor="middle" font-size="11" class="k-muted">12.4</text><text x="70" y="22" text-anchor="middle" font-size="11" class="k-muted">13.8+</text></g>' +
        '<g class="diag-chg">' + L.badge(350, 220, ctx.t({ cs: 'nabíječka / udržovák připojen', en: 'charger / maintainer connected' }), 'ok') + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Nízké napětí = falešné chybové kódy', en: 'Low voltage = false fault codes' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Delší diagnostika: připojit udržovací nabíječku', en: 'Longer sessions: connect a battery maintainer' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Napětí baterie při diagnostice', en: 'Battery voltage during diagnosis' }));
    }
  });

  A.register('diag.tools', {
    render: function (ctx) {
      var s = '';
      // ELM dongle + phone
      s += '<g transform="translate(90,140)"><rect class="k-accent" x="-34" y="-20" width="50" height="40" rx="6"/><rect class="k-dark" x="16" y="-12" width="14" height="24"/>' +
        '<path class="k-none s-fluid lib-fade" stroke-width="3" d="M-40,-30 q-10,-10 0,-20 M-48,-24 q-16,-16 0,-32"/>' +
        '<rect class="k-dark" x="-80" y="-90" width="44" height="76" rx="8"/><rect class="k-glass" x="-76" y="-84" width="36" height="60" rx="4"/></g>';
      s += L.label(80, 200, ctx.t({ cs: 'OBD adaptér + aplikace', en: 'OBD dongle + app' }), { bg: true, size: 12 });
      s += L.label(80, 222, ctx.t({ cs: 'jen základ (motor)', en: 'basics only (engine)' }), { size: 11, cls: 'k-muted' });
      // handheld
      s += '<g transform="translate(240,130)"><rect class="k-dark" x="-36" y="-60" width="72" height="120" rx="12"/><rect class="k-ok" opacity=".6" x="-28" y="-50" width="56" height="50" rx="4"/><circle class="k-metal2" cx="-12" cy="30" r="8"/><circle class="k-metal2" cx="12" cy="30" r="8"/></g>';
      s += L.label(240, 212, ctx.t({ cs: 'Ruční tester', en: 'Handheld scanner' }), { bg: true, size: 12 });
      s += L.label(240, 234, ctx.t({ cs: 'motor + ABS + airbag…', en: 'engine + ABS + airbag…' }), { size: 11, cls: 'k-muted' });
      // laptop
      s += '<g transform="translate(390,130)"><rect class="k-dark" x="-56" y="-50" width="112" height="72" rx="6"/><rect class="k-glass" x="-48" y="-42" width="96" height="56" rx="3"/><path class="k-metal2" d="M-70,24 L70,24 L60,36 L-60,36 Z"/></g>';
      s += L.label(390, 200, ctx.t({ cs: 'Značková diagnostika', en: 'Brand-specific tool' }), { bg: true, size: 12 });
      var brand = {
        'generic': 'VCDS · XENTRY · VIDA…',
        'mb-cl500-c216': 'XENTRY / DAS',
        'volvo-xc60-b4': 'VIDA',
        'skoda-octavia-rs-tdi': 'VCDS / OBDeleven',
        'toyota-gr-yaris': 'Techstream / GTS',
        'citroen-jumper-22hdi': 'Diagbox / Lexia (PP2000)'
      }[ctx.vehicle] || '';
      s += L.label(390, 222, brand, { size: 11, cls: 'k-accent' });
      s += L.label(16, 24, ctx.t({ cs: 'Vyberte nástroj podle toho, co potřebujete vidět', en: 'Choose a tool by what you need to see' }), { anchor: 'start', bg: true });
      s += L.label(16, 286, ctx.t({ cs: 'Servisní funkce (EPB, ABC, adaptace) = značkový nástroj', en: 'Service functions (EPB, ABC, adaptations) = brand tool' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Typy diagnostických nástrojů', en: 'Types of diagnostic tools' }));
    }
  });

  A.register('diag.port', {
    render: function (ctx) {
      var where = PORT[ctx.vehicle] || PORT.generic;
      var s = '<path class="k-dark" d="M0,0 L480,0 L480,110 Q300,140 0,120 Z"/>' +
        '<rect class="k-metal2" x="300" y="80" width="40" height="160" rx="10"/>' + // steering column
        '<g transform="translate(180,150)"><path class="k-dark s-line" stroke-width="2" d="M-46,-18 L46,-18 L38,18 L-38,18 Z"/>';
      for (var i = 0; i < 8; i++) s += '<rect class="k-metal" x="' + (-34 + i * 9) + '" y="-12" width="5" height="8" rx="1"/><rect class="k-metal" x="' + (-30 + i * 8) + '" y="4" width="5" height="8" rx="1"/>';
      s += '</g>' +
        '<g class="diag-plug"><g transform="translate(180,150)"><path class="k-accent s-dark" stroke-width="1.5" d="M-48,16 L48,16 L44,56 L-44,56 Z"/><circle class="diag-led" cx="30" cy="40" r="5"/>' +
        '<path class="k-none s-dark" stroke-width="5" d="M0,56 Q0,110 -100,130"/></g></g>' +
        L.label(16, 286, ctx.t({ cs: 'Zásuvka OBD: ', en: 'OBD port: ' }) + ctx.t(where), { anchor: 'start', bg: true }) +
        L.label(250, 34, ctx.t({ cs: 'Zapalování ZAP, motor VYP', en: 'Ignition ON, engine OFF' }), { bg: true }) +
        L.label(250, 60, ctx.t({ cs: 'Kabel pryč od pedálů!', en: 'Cable away from the pedals!' }), { bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Připojení do OBD zásuvky', en: 'Plugging into the OBD port' }));
    }
  });

  A.register('diag.read', {
    render: function (ctx) {
      var rows = [
        ['P0301', { cs: 'Vynechávání válec 1', en: 'Misfire cylinder 1' }, 'k-warn'],
        ['P0171', { cs: 'Směs příliš chudá', en: 'System too lean' }, 'k-warn'],
        ['U0121', { cs: 'Komunikace s ABS', en: 'Lost comm. with ABS' }, 'k-danger']
      ];
      var inner = '<text x="160" y="58" font-size="13" font-weight="800" class="k-text">' + S.esc(ctx.t({ cs: 'Čtení závad…', en: 'Reading faults…' })) + '</text>' +
        '<rect class="k-line" x="160" y="68" width="160" height="8" rx="4"/><g class="diag-scan"><rect class="k-ok" x="160" y="68" width="160" height="8" rx="4"/></g>';
      rows.forEach(function (r, i) {
        var y = 102 + i * 34;
        inner += '<g class="diag-row diag-row' + i + '"><rect class="' + r[2] + '" opacity=".25" x="156" y="' + (y - 16) + '" width="170" height="28" rx="4"/>' +
          '<text x="164" y="' + (y + 3) + '" font-size="13" font-weight="800" class="k-text">' + r[0] + '</text>' +
          '<text x="214" y="' + (y + 3) + '" font-size="10" class="k-text">' + S.esc(ctx.t(r[1])) + '</text></g>';
      });
      var s = scanner(inner) +
        L.label(16, 24, ctx.t({ cs: 'Kódy si', en: 'Write the' }), { anchor: 'start', bg: true }) +
        L.label(16, 48, ctx.t({ cs: 'vyfoťte /', en: 'codes down /' }), { anchor: 'start', bg: true }) +
        L.label(16, 72, ctx.t({ cs: 'zapište', en: 'photo them' }), { anchor: 'start', bg: true }) +
        L.label(464, 240, ctx.t({ cs: 'Projít', en: 'Check all' }), { anchor: 'end', bg: true }) +
        L.label(464, 264, ctx.t({ cs: 'všechny moduly', en: 'modules' }), { anchor: 'end', bg: true });
      return L.svg(s, ctx.t({ cs: 'Čtení chybových kódů', en: 'Reading fault codes' }));
    }
  });

  A.register('diag.codeAnatomy', {
    render: function (ctx) {
      var chars = ['P', '0', '3', '0', '1'];
      var expl = [
        { cs: 'P = pohon (motor, převodovka) · C podvozek · B karoserie · U komunikace', en: 'P = powertrain · C chassis · B body · U network' },
        { cs: '0 = obecný kód (všechny značky) · 1 = výrobcový', en: '0 = generic (all brands) · 1 = manufacturer-specific' },
        { cs: '3 = skupina: zapalování / vynechávání', en: '3 = group: ignition / misfire' },
        { cs: '0 = vynechávání náhodné nebo… (spolu s další číslicí)', en: '0 = misfire random or… (with the next digit)' },
        { cs: '01 = válec 1 (P0300 = náhodné, více válců)', en: '01 = cylinder 1 (P0300 = random, multiple)' }
      ];
      var s = '';
      chars.forEach(function (c, i) {
        var x = 120 + i * 60;
        s += '<rect class="k-ground s-line" stroke-width="2" x="' + (x - 26) + '" y="60" width="52" height="70" rx="10"/>' +
          '<text x="' + x + '" y="112" text-anchor="middle" font-size="44" font-weight="900" class="diag-ch' + i + '">' + c + '</text>';
        s += '<g class="diag-ex' + i + '">' + L.arrow(x, 170, x, 136, 'accent') + L.label(240, 200, ctx.t(expl[i]), { bg: true, size: 12 }) + '</g>';
      });
      s += L.label(16, 24, ctx.t({ cs: 'Jak číst kód závady', en: 'How to read a fault code' }), { anchor: 'start', bg: true });
      s += L.label(16, 286, ctx.t({ cs: 'Kód = kde systém vidí problém, ne který díl koupit', en: 'Code = where the system sees a problem, not which part to buy' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Struktura kódu závady', en: 'Fault code structure' }));
    }
  });

  A.register('diag.freeze', {
    render: function (ctx) {
      var s = L.car(30, 150, { r: 22 }) +
        '<g class="diag-flash"><rect class="k-white" x="0" y="0" width="480" height="300"/></g>' +
        '<g transform="translate(70,40)"><rect class="k-dark" x="0" y="0" width="56" height="40" rx="6"/><circle class="k-metal" cx="28" cy="20" r="12"/><rect class="k-dark" x="38" y="-8" width="12" height="10" rx="2"/></g>' +
        '<g class="diag-table"><rect class="k-ground s-line" stroke-width="2" x="270" y="40" width="190" height="200" rx="12"/>' +
        L.label(365, 64, ctx.t({ cs: 'Freeze frame: P0301', en: 'Freeze frame: P0301' }), { size: 13 }) +
        [[{ cs: 'Otáčky', en: 'RPM' }, '2 450'], [{ cs: 'Rychlost', en: 'Speed' }, '78 km/h'], [{ cs: 'Teplota', en: 'Coolant' }, '88 °C'], [{ cs: 'Zatížení', en: 'Load' }, '64 %'], [{ cs: 'Krátk. korekce', en: 'Short trim' }, '+4 %']].map(function (r, i) {
          return L.label(286, 98 + i * 28, ctx.t(r[0]), { anchor: 'start', size: 12, cls: 'k-muted' }) + L.label(446, 98 + i * 28, r[1], { anchor: 'end', size: 13 });
        }).join('') + '</g>' +
        L.label(16, 286, ctx.t({ cs: 'Snímek hodnot v okamžiku vzniku závady', en: 'Snapshot of values at the moment the fault set' }), { anchor: 'start', bg: true }) +
        L.label(16, 196, ctx.t({ cs: 'Za jakých podmínek', en: 'Under which conditions' }), { anchor: 'start', bg: true, size: 12 }) +
        L.label(16, 220, ctx.t({ cs: 'chyba vznikla?', en: 'did the fault occur?' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Freeze frame – zmrazený snímek', en: 'Freeze frame data' }));
    }
  });

  A.register('diag.live', {
    render: function (ctx) {
      var s = '<rect class="k-ground s-line" stroke-width="2" x="20" y="40" width="440" height="200" rx="12"/>';
      for (var g = 0; g < 4; g++) s += '<line class="s-line" stroke-width="1" opacity=".5" x1="30" y1="' + (80 + g * 40) + '" x2="450" y2="' + (80 + g * 40) + '"/>';
      // coolant temp rising and flattening
      s += '<path class="k-none s-danger diag-draw" pathLength="600" stroke-width="3" d="M30,220 C120,200 170,110 260,90 S400,86 450,86"/>';
      // fuel trim oscillating around zero line (y=160)
      var d = 'M30,160';
      for (var x = 30; x <= 450; x += 15) d += ' L' + (x + 7.5) + ',' + (160 + Math.sin(x / 9) * 10).toFixed(1) + ' L' + (x + 15) + ',' + (160 - Math.sin(x / 7) * 8).toFixed(1);
      s += '<path class="k-none s-ok diag-draw" pathLength="600" stroke-width="2.5" d="' + d + '"/>';
      // lambda switching
      var dl = 'M30,200';
      for (var xl = 30; xl < 450; xl += 30) dl += ' L' + (xl + 4) + ',186 L' + (xl + 15) + ',186 L' + (xl + 19) + ',214 L' + (xl + 30) + ',214';
      s += '<path class="k-none s-accent diag-draw" pathLength="600" stroke-width="2" d="' + dl + '" style="animation-delay:.6s"/>';
      s += L.label(30, 262, ctx.t({ cs: '— teplota chladiva (→ ~90 °C)', en: '— coolant temp (→ ~90 °C)' }), { anchor: 'start', size: 12, cls: 'k-danger' });
      s += L.label(30, 284, ctx.t({ cs: '— korekce paliva (kolem 0 %)', en: '— fuel trim (around 0 %)' }), { anchor: 'start', size: 12, cls: 'k-ok' });
      s += L.label(290, 284, ctx.t({ cs: '— lambda sonda (kmitá)', en: '— O2 sensor (switching)' }), { anchor: 'start', size: 12, cls: 'k-accent' });
      s += L.label(16, 24, ctx.t({ cs: 'Živá data: co motor vidí právě teď', en: 'Live data: what the engine sees right now' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Živá data motoru', en: 'Engine live data' }));
    }
  });

  A.register('diag.circuit', {
    render: function (ctx) {
      var parts = [
        [70, { cs: 'Snímač', en: 'Sensor' }],
        [180, { cs: 'Konektor', en: 'Connector' }],
        [290, { cs: 'Kabeláž', en: 'Wiring' }],
        [400, { cs: 'Řídicí jednotka', en: 'Control unit' }]
      ];
      var s = '<path class="k-none s-line" stroke-width="6" d="M70,150 L400,150"/>';
      parts.forEach(function (p, i) {
        s += '<g transform="translate(' + p[0] + ',150)"><rect class="diag-c' + i + '" x="-38" y="-30" width="76" height="60" rx="10"/></g>' + L.label(p[0], 205, ctx.t(p[1]), { bg: true, size: 12 });
      });
      s += '<g transform="translate(70,150)"><circle class="k-dark" r="12"/></g><g transform="translate(180,150)"><rect class="k-dark" x="-14" y="-10" width="28" height="20" rx="3"/></g>' +
        '<g transform="translate(290,150)"><path class="k-none s-dark" stroke-width="4" d="M-24,0 q8,-14 16,0 q8,14 16,0 q8,-14 16,0"/></g><g transform="translate(400,150)"><rect class="k-dark" x="-20" y="-14" width="40" height="28" rx="3"/></g>';
      s += L.label(240, 70, ctx.t({ cs: 'P0117: teplota chladiva – signál nízký', en: 'P0117: coolant temp – signal low' }), { bg: true });
      s += L.label(16, 24, ctx.t({ cs: 'Závada může být KDEKOLI v obvodu', en: 'The fault can be ANYWHERE in the circuit' }), { anchor: 'start', bg: true });
      s += L.label(16, 286, ctx.t({ cs: 'Měřit a ověřit, teprve pak kupovat díly', en: 'Measure and verify first, then buy parts' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Kód ukazuje na obvod, ne na díl', en: 'A code points to a circuit, not a part' }));
    }
  });

  A.register('diag.clear', {
    render: function (ctx) {
      var s = '<g class="diag-x"><rect class="k-danger" x="30" y="70" width="170" height="60" rx="12"/><text x="115" y="107" text-anchor="middle" font-size="16" font-weight="800" class="k-white">' + S.esc(ctx.t({ cs: 'Vymazat závady', en: 'Clear codes' })) + '</text>' +
        '<path class="k-none s-text" stroke-width="5" d="M30,70 L200,130 M200,70 L30,130"/></g>';
      var flow = [{ cs: '1. Najít příčinu', en: '1. Find the cause' }, { cs: '2. Opravit', en: '2. Repair' }, { cs: '3. Pak vymazat + ověřit', en: '3. Then clear + verify' }];
      flow.forEach(function (f, i) {
        s += '<g class="diag-f' + i + '"><rect class="k-ok" x="250" y="' + (50 + i * 70) + '" width="200" height="48" rx="10"/><text x="350" y="' + (80 + i * 70) + '" text-anchor="middle" font-size="14" font-weight="800" class="k-white">' + S.esc(ctx.t(f)) + '</text>' +
          (i < 2 ? L.arrow(350, 100 + i * 70, 350, 118 + i * 70, 'ok') : '') + '</g>';
      });
      s += L.label(16, 24, ctx.t({ cs: 'Vymazání kódu závadu neopraví', en: 'Clearing a code does not fix the fault' }), { anchor: 'start', bg: true });
      s += L.warnIcon(36, 268) + L.label(60, 272, ctx.t({ cs: 'Airbag / ABS nikdy jen nemazat!', en: 'Never just clear airbag / ABS!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Nemazat závady před opravou', en: 'Do not clear faults before repair' }));
    }
  });

  A.register('diag.monitors', {
    render: function (ctx) {
      var mons = [{ cs: 'Katalyzátor', en: 'Catalyst' }, { cs: 'Lambda sondy', en: 'O2 sensors' }, { cs: 'Vynechávání', en: 'Misfire' }, { cs: 'Palivová soustava', en: 'Fuel system' }];
      var inner = '<text x="160" y="58" font-size="13" font-weight="800" class="k-text">' + S.esc(ctx.t({ cs: 'Připravenost (readiness)', en: 'Readiness monitors' })) + '</text>';
      mons.forEach(function (m, i) {
        var y = 92 + i * 30;
        inner += '<text x="160" y="' + (y + 4) + '" font-size="12" class="k-text">' + S.esc(ctx.t(m)) + '</text>' +
          '<g class="diag-m' + i + '">' + L.check(312, y, '') + '</g>';
      });
      var s = scanner(inner) +
        L.label(16, 24, ctx.t({ cs: 'Po opravě:', en: 'After the repair:' }), { anchor: 'start', bg: true }) +
        L.label(16, 48, ctx.t({ cs: 'zkušební jízda', en: 'test drive' }), { anchor: 'start', bg: true }) +
        L.label(464, 240, ctx.t({ cs: 'Vše ✔ a žádný', en: 'All ✔ and no' }), { anchor: 'end', bg: true }) +
        L.label(464, 264, ctx.t({ cs: 'nový kód = hotovo', en: 'new code = done' }), { anchor: 'end', bg: true });
      return L.svg(s, ctx.t({ cs: 'Ověření opravy – monitory připravenosti', en: 'Verifying the repair – readiness monitors' }));
    }
  });
})(window.STU);
