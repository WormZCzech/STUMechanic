/* Animations: safe lifting, wheel removal and wheel torque. */
(function (S) {
  'use strict';
  var L = S.animLib, A = S.anim;
  var GY = 268;           // ground line
  var CX = 88, CY = 250;  // car rear-bottom origin → wheels at x 148 / 334, bottom on ground
  var JX = 300;           // jacking point (front, behind front wheel)
  var SX = 200;           // axle stand position

  var TORQUE = {
    'generic': { cs: 'dle příručky', en: 'per manual' },
    'mb-cl500-c216': '150 Nm',
    'volvo-xc60-b4': '140 Nm',
    'skoda-octavia-rs-tdi': '120 Nm',
    'toyota-gr-yaris': '103 Nm'
  };
  S.liftTorque = TORQUE;

  A.css('lift', [
    /* lift sequence 8 s: car rises, stand slides in, car settles on stand */
    '.lift-car{animation:lift-car 8s ease-in-out infinite}',
    '@keyframes lift-car{0%,10%{transform:translateY(0)}38%,55%{transform:translateY(-23px)}68%,90%{transform:translateY(-19px)}100%{transform:translateY(0)}}',
    '.lift-arm{animation:lift-arm 8s ease-in-out infinite;transform-origin:-50px -10px}',
    '@keyframes lift-arm{0%,10%{transform:rotate(0)}38%,55%{transform:rotate(-30deg)}68%,90%{transform:rotate(-8deg)}100%{transform:rotate(0)}}',
    '.lift-sad{animation:lift-sad 8s ease-in-out infinite}',
    '@keyframes lift-sad{0%,10%{transform:translate(0,0)}38%,55%{transform:translate(-15px,-23px)}68%,90%{transform:translate(-4px,-6px)}100%{transform:translate(0,0)}}',
    '.lift-stand{animation:lift-stand 8s ease-in-out infinite}',
    '@keyframes lift-stand{0%,40%{transform:translateX(-140px);opacity:0}52%,92%{transform:translateX(0);opacity:1}100%{transform:translateX(0);opacity:0}}',
    '.lift-ok{animation:lift-ok 8s ease-in-out infinite;opacity:0}',
    '@keyframes lift-ok{0%,70%{opacity:0}76%,92%{opacity:1}100%{opacity:0}}',
    /* jack only, 6 s */
    '.liftj-car{animation:liftj-car 6s ease-in-out infinite}',
    '@keyframes liftj-car{0%,12%{transform:translateY(0)}55%,88%{transform:translateY(-23px)}100%{transform:translateY(0)}}',
    '.liftj-arm{animation:liftj-arm 6s ease-in-out infinite;transform-origin:-50px -10px}',
    '@keyframes liftj-arm{0%,12%{transform:rotate(0)}55%,88%{transform:rotate(-30deg)}100%{transform:rotate(0)}}',
    '.liftj-sad{animation:liftj-sad 6s ease-in-out infinite}',
    '@keyframes liftj-sad{0%,12%{transform:translate(0,0)}55%,88%{transform:translate(-15px,-23px)}100%{transform:translate(0,0)}}',
    '.liftj-gap{animation:liftj-gap 6s ease-in-out infinite;opacity:0}',
    '@keyframes liftj-gap{0%,55%{opacity:0}62%,88%{opacity:1}100%{opacity:0}}',
    /* lower sequence 8 s (reverse) */
    '.lowr-car{animation:lowr-car 8s ease-in-out infinite}',
    '@keyframes lowr-car{0%,10%{transform:translateY(-19px)}25%,45%{transform:translateY(-23px)}75%,92%{transform:translateY(0)}100%{transform:translateY(-19px)}}',
    '.lowr-arm{animation:lowr-arm 8s ease-in-out infinite;transform-origin:-50px -10px}',
    '@keyframes lowr-arm{0%,10%{transform:rotate(-8deg)}25%,45%{transform:rotate(-30deg)}75%,92%{transform:rotate(0)}100%{transform:rotate(-8deg)}}',
    '.lowr-sad{animation:lowr-sad 8s ease-in-out infinite}',
    '@keyframes lowr-sad{0%,10%{transform:translate(-4px,-6px)}25%,45%{transform:translate(-15px,-23px)}75%,92%{transform:translate(0,0)}100%{transform:translate(-4px,-6px)}}',
    '.lowr-stand{animation:lowr-stand 8s ease-in-out infinite}',
    '@keyframes lowr-stand{0%,27%{transform:translateX(0);opacity:1}42%,95%{transform:translateX(-140px);opacity:0}100%{transform:translateX(0);opacity:1}}',
    /* chocks */
    '.lift-chockL{animation:lift-chockL 6s ease-out infinite}',
    '@keyframes lift-chockL{0%,15%{transform:translateX(-70px);opacity:0}40%,90%{transform:translateX(0);opacity:1}100%{opacity:0}}',
    '.lift-chockR{animation:lift-chockR 6s ease-out infinite}',
    '@keyframes lift-chockR{0%,30%{transform:translateX(70px);opacity:0}55%,90%{transform:translateX(0);opacity:1}100%{opacity:0}}',
    /* loosen */
    '.lift-wr{animation:lift-wr 3s ease-in-out infinite}',
    '@keyframes lift-wr{0%,10%{transform:rotate(0)}55%,70%{transform:rotate(-70deg)}100%{transform:rotate(0)}}',
    '.lift-shake{animation:lift-shake 2.4s ease-in-out infinite;transform-origin:240px 268px}',
    '@keyframes lift-shake{0%,100%{transform:rotate(0)}20%{transform:rotate(-.6deg)}40%{transform:rotate(.6deg)}60%{transform:rotate(-.4deg)}80%{transform:rotate(0)}}',
    '.lift-push{animation:lift-push 2.4s ease-in-out infinite}',
    '@keyframes lift-push{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(10px)}40%{transform:translateX(-4px)}}',
    /* wheel off */
    '.lift-boltout{animation:lift-boltout 7s ease-in infinite;opacity:1}',
    '@keyframes lift-boltout{0%,10%{opacity:1;transform:scale(1)}18%,100%{opacity:0;transform:scale(1.6)}}',
    '.lift-wheeloff{animation:lift-wheeloff 7s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes lift-wheeloff{0%,62%{transform:scale(1);opacity:1}80%,92%{transform:scale(1.25) translateY(30px);opacity:0}100%{transform:scale(1);opacity:1}}',
    '.lift-hub{animation:lift-hub 7s ease-in-out infinite;opacity:0}',
    '@keyframes lift-hub{0%,66%{opacity:0}78%,92%{opacity:1}100%{opacity:0}}',
    /* torque star sequence 10 s */
    [0, 1, 2, 3, 4].map(function (i) {
      var a = 5 + i * 16;
      return '.lift-n' + i + '{opacity:0;animation:lift-n' + i + ' 10s linear infinite}' +
        '@keyframes lift-n' + i + '{0%,' + a + '%{opacity:0}' + (a + 3) + '%,92%{opacity:1}100%{opacity:0}}';
    }).join('\n')
  ].join('\n'));

  /** Trolley jack with ground origin. Saddle top at y=-28 (lowered). */
  function jack(armCls, sadCls) {
    return '<g>' +
      '<line class="s-dark" stroke-width="5" stroke-linecap="round" x1="-74" y1="-12" x2="-138" y2="-52"/>' +
      '<rect class="k-danger s-dark" stroke-width="1.5" x="-80" y="-18" width="104" height="12" rx="3"/>' +
      '<circle class="k-dark" cx="-68" cy="-5" r="5"/><circle class="k-dark" cx="12" cy="-5" r="5"/>' +
      '<g class="' + armCls + '"><path class="k-danger s-dark" stroke-width="1.5" d="M-54,-6 L-56,-14 L-4,-30 L4,-26 Z"/></g>' +
      '<g class="' + sadCls + '"><rect class="k-metal s-dark" stroke-width="1.5" x="-12" y="-32" width="24" height="7" rx="2"/>' +
      '<rect class="k-dark" x="-3" y="-26" width="6" height="8"/></g>' +
      '</g>';
  }

  function stand(cls) {
    return '<g transform="translate(' + SX + ',' + (GY - 33) + ')"><g class="' + cls + '">' + L.axleStand(33) + '</g></g>';
  }

  function car(cls) {
    return L.car(CX, CY, { cls: cls });
  }

  function jackPointMark(x) {
    return '<g transform="translate(' + x + ',238)"><path class="k-accent" d="M-7,0 L7,0 L0,-6 Z"/></g>';
  }

  /* ---------- hero / stands ---------- */
  function liftScene(ctx, withLabels) {
    var s = L.ground(GY) +
      '<g transform="translate(' + JX + ',' + GY + ')">' + jack('lift-arm', 'lift-sad') + '</g>' + stand('lift-stand') +
      car('lift-car');
    if (withLabels) {
      s += L.label(SX - 30, 292, ctx.t({ cs: 'Podpěrný stojan', en: 'Axle stand' }), { bg: true, anchor: 'middle' });
      s += L.label(JX + 60, 292, ctx.t({ cs: 'Hever', en: 'Jack' }), { bg: true });
    }
    s += '<g class="lift-ok">' + L.check(440, 40) + L.label(420, 44, ctx.t({ cs: 'Vůz stojí na stojanu', en: 'Car rests on stand' }), { anchor: 'end', bg: true }) + '</g>';
    return s;
  }

  A.register('lift.hero', {
    render: function (ctx) { return L.svg(liftScene(ctx, false), ctx.t({ cs: 'Zvedání vozu heverem a podložení stojanem', en: 'Lifting a car with a jack and supporting it on a stand' })); }
  });

  A.register('lift.stands', {
    render: function (ctx) {
      var s = liftScene(ctx, true) +
        L.label(16, 24, ctx.t({ cs: 'Stojan pod pevný bod karoserie, pak spustit hever', en: 'Stand under a solid body point, then lower the jack' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Podložení vozu stojanem', en: 'Supporting the car on an axle stand' }));
    }
  });

  /* ---------- park & chock ---------- */
  A.register('lift.park', {
    render: function (ctx) {
      var s = L.ground(GY) + car('') +
        '<g transform="translate(110,' + GY + ')"><g class="lift-chockL">' + L.chock() + '</g></g>' +
        '<g transform="translate(186,' + GY + ') scale(-1,1)"><g class="lift-chockR">' + L.chock() + '</g></g>' +
        '<g transform="translate(70,60)"><circle class="k-danger" r="22"/><text y="8" text-anchor="middle" font-size="24" font-weight="800" class="k-white">P</text></g>' +
        L.label(100, 64, ctx.t({ cs: 'Parkovací brzda + P / 1. rychlost', en: 'Parking brake + P / 1st gear' }), { anchor: 'start', bg: true }) +
        L.label(148, 292, ctx.t({ cs: 'Klíny k protější nápravě', en: 'Chocks on the opposite axle' }), { bg: true }) +
        L.label(360, 292, ctx.t({ cs: 'Rovný, pevný povrch', en: 'Level, solid ground' }), { bg: true });
      return L.svg(s, ctx.t({ cs: 'Zajištění vozu proti pohybu', en: 'Securing the car against rolling' }));
    }
  });

  /* ---------- jacking points ---------- */
  A.register('lift.points', {
    render: function (ctx) {
      var s = L.ground(GY) + car('');
      [188, JX].forEach(function (x) {
        s += '<circle class="k-accent lib-pulse" cx="' + x + '" cy="238" r="14"/>' + jackPointMark(x) + L.arrow(x, 262, x, 244, 'accent');
      });
      s += L.cross(372, 250) + L.label(372, 222, ctx.t({ cs: 'Ne pod nárazník / olejovou vanu', en: 'Not under bumper / oil pan' }), { bg: true, anchor: 'end' });
      var hint = ctx.vehicle === 'toyota-gr-yaris'
        ? { cs: 'Hever zasouvejte z boku – nízký vůz se spoilery', en: 'Slide the jack in from the side – low car with spoilers' }
        : ctx.vehicle === 'mb-cl500-c216'
          ? { cs: 'Zvedací body pod krytkami v prahu (ABC!)', en: 'Jacking points under covers in the sill (ABC!)' }
          : { cs: 'Zvedací body na prahu (značky / zesílený lem)', en: 'Jacking points on the sill (marks / reinforced seam)' };
      s += L.label(16, 24, ctx.t(hint), { anchor: 'start', bg: true });
      s += L.label(244, 292, ctx.t({ cs: 'Zvedací body', en: 'Jacking points' }), { bg: true });
      return L.svg(s, ctx.t({ cs: 'Zvedací body vozu', en: 'Jacking points of the car' }));
    }
  });

  /* ---------- jack ---------- */
  A.register('lift.jack', {
    render: function (ctx) {
      var s = L.ground(GY) + '<g transform="translate(' + JX + ',' + GY + ')">' + jack('liftj-arm', 'liftj-sad') + '</g>' + car('liftj-car') +
        '<g class="liftj-gap">' + L.arrow(334, 262, 334, 248, 'ok', 3) + L.label(400, 252, ctx.t({ cs: 'kolo ~3 cm nad zemí', en: 'wheel ~3 cm off ground' }), { bg: true }) + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Pomalu zvedat, sledovat dosednutí misky', en: 'Lift slowly, watch the saddle seat properly' }), { anchor: 'start', bg: true }) +
        L.warnIcon(40, 64) + L.label(64, 68, ctx.t({ cs: 'Nikdy nepracovat jen na heveru!', en: 'Never work on a jack alone!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Zvednutí vozu heverem', en: 'Raising the car with a jack' }));
    }
  });

  /* ---------- shake test ---------- */
  A.register('lift.shake', {
    render: function (ctx) {
      var s = L.ground(GY) +
        '<g class="lift-shake">' + '<g transform="translate(' + SX + ',' + (GY - 33) + ')">' + L.axleStand(33) + '</g>' +
        '<g transform="translate(0,-19)">' + car('') + '</g></g>' +
        '<g transform="translate(40,180)"><g class="lift-push">' + L.arrow(0, 0, 36, 0, 'accent', 5) + '</g></g>' +
        L.label(16, 24, ctx.t({ cs: 'Zatlačte do vozu – nesmí se pohnout ani vrzat', en: 'Push the car firmly – it must not move or creak' }), { anchor: 'start', bg: true }) +
        L.check(440, 70) + L.label(420, 74, ctx.t({ cs: 'Stabilní = můžete pod vůz', en: 'Stable = safe to work' }), { anchor: 'end', bg: true });
      return L.svg(s, ctx.t({ cs: 'Kontrola stability vozu na stojanech', en: 'Checking stability of the car on stands' }));
    }
  });

  /* ---------- front view wheel helpers ---------- */
  var WC = [240, 150], BR = 46;
  function boltPos(i) {
    var a = -Math.PI / 2 + i * 2 * Math.PI / 5;
    return [WC[0] + Math.cos(a) * BR, WC[1] + Math.sin(a) * BR];
  }
  function frontWheel(boltCls) {
    var s = '<circle class="k-tire" cx="' + WC[0] + '" cy="' + WC[1] + '" r="128"/>' +
      '<circle class="k-rim" cx="' + WC[0] + '" cy="' + WC[1] + '" r="92"/>';
    for (var i = 0; i < 5; i++) {
      var a = -Math.PI / 2 + Math.PI / 5 + i * 2 * Math.PI / 5;
      s += '<line class="s-metal" stroke-width="20" stroke-linecap="round" x1="' + (WC[0] + Math.cos(a) * 34) + '" y1="' + (WC[1] + Math.sin(a) * 34) + '" x2="' + (WC[0] + Math.cos(a) * 86) + '" y2="' + (WC[1] + Math.sin(a) * 86) + '"/>';
    }
    s += '<circle class="k-metal2" cx="' + WC[0] + '" cy="' + WC[1] + '" r="62"/><circle class="k-dark" cx="' + WC[0] + '" cy="' + WC[1] + '" r="18"/>';
    for (var j = 0; j < 5; j++) {
      var p = boltPos(j);
      s += '<g class="' + (boltCls ? boltCls(j) : '') + '" style="transform-box:fill-box;transform-origin:center' + (boltCls ? ';animation-delay:' + (j * 0.5) + 's' : '') + '">' +
        '<circle class="k-dark" cx="' + p[0] + '" cy="' + p[1] + '" r="12"/>' + L.hex(p[0], p[1], 9, 'k-metal') + '</g>';
    }
    return s;
  }

  A.register('lift.loosen', {
    render: function (ctx) {
      var p = boltPos(0);
      var s = frontWheel() +
        '<g transform="translate(' + p[0] + ',' + p[1] + ')"><g class="lift-wr">' + L.wrench(150) + '</g></g>' +
        L.rotArrow(p[0], p[1], 32, 'ccw', 'accent', 200) +
        L.label(16, 24, ctx.t({ cs: 'Povolit o ½ otáčky – kolo ještě stojí na zemi', en: 'Loosen ½ turn – wheel still on the ground' }), { anchor: 'start', bg: true }) +
        L.label(16, 286, ctx.t({ cs: 'Proti směru hodinových ručiček', en: 'Counter-clockwise' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Povolení šroubů kola', en: 'Loosening wheel bolts' }));
    }
  });

  A.register('lift.wheeloff', {
    render: function (ctx) {
      var s = '<g class="lift-hub"><circle class="k-metal2" cx="240" cy="150" r="70"/><circle class="k-dark" cx="240" cy="150" r="22"/>';
      for (var i = 0; i < 5; i++) { var p = boltPos(i); s += '<circle class="k-dark" cx="' + p[0] + '" cy="' + p[1] + '" r="7"/>'; }
      s += L.label(240, 250, ctx.t({ cs: 'Kolo položte naplocho pod práh jako pojistku', en: 'Lay the wheel flat under the sill as a backup' }), { bg: true }) + '</g>' +
        '<g class="lift-wheeloff">' + frontWheel(function () { return 'lift-boltout'; }) + '</g>' +
        L.label(16, 24, ctx.t({ cs: 'Vyšroubovat šrouby (nejvyšší naposledy)', en: 'Remove bolts (top one last)' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Sundání kola', en: 'Removing the wheel' }));
    }
  });

  A.register('lift.lower', {
    render: function (ctx) {
      var s = L.ground(GY) +
        '<g transform="translate(' + JX + ',' + GY + ')">' + jack('lowr-arm', 'lowr-sad') + '</g>' + stand('lowr-stand') + car('lowr-car') +
        L.label(16, 24, ctx.t({ cs: 'Nadzvednout → vyndat stojan → pomalu spustit', en: 'Raise slightly → remove stand → lower slowly' }), { anchor: 'start', bg: true }) +
        L.warnIcon(40, 64) + L.label(64, 68, ctx.t({ cs: 'Nohy a ruce pryč zpod vozu', en: 'Keep hands and feet clear' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Spuštění vozu', en: 'Lowering the car' }));
    }
  });

  A.register('lift.torque', {
    render: function (ctx) {
      var order = [0, 2, 4, 1, 3];
      var s = frontWheel();
      order.forEach(function (b, i) {
        var p = boltPos(b);
        s += '<g class="lift-n' + i + '">' +
          '<circle class="k-accent" cx="' + p[0] + '" cy="' + p[1] + '" r="15" opacity=".9"/>' +
          '<text x="' + p[0] + '" y="' + (p[1] + 5) + '" text-anchor="middle" font-size="15" font-weight="800" class="k-badgetext">' + (i + 1) + '</text></g>';
      });
      s += L.label(16, 24, ctx.t({ cs: 'Dotahovat do kříže, ve 2 krocích', en: 'Tighten in a star pattern, in 2 passes' }), { anchor: 'start', bg: true });
      s += L.badge(400, 284, ctx.t({ cs: 'Moment: ', en: 'Torque: ' }) + ctx.t(TORQUE[ctx.vehicle] || TORQUE.generic), 'accent');
      s += L.label(16, 286, ctx.t({ cs: 'Momentový klíč – kolo na zemi', en: 'Torque wrench – wheel on ground' }), { anchor: 'start', bg: true });
      return L.svg(s, ctx.t({ cs: 'Dotažení kola momentovým klíčem do kříže', en: 'Torquing wheel bolts in a star pattern' }));
    }
  });
})(window.STU);
