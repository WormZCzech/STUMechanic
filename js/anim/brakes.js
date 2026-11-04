/* Animations: brake pads & discs (floating caliper, screw-in rear piston, fixed 4-piston caliper, EPB). */
(function (S) {
  'use strict';
  var L = S.animLib, A = S.anim;

  /* ---------------------------------------------------------- helpers */
  function pt(cx, cy, r, a) {
    var t = a * Math.PI / 180;
    return [cx + r * Math.cos(t), cy + r * Math.sin(t)];
  }
  function f(n) { return n.toFixed(1); }
  /** Annular segment path (angles in degrees, 0 = 3 o'clock, -90 = 12 o'clock). */
  function seg(cx, cy, r1, r2, a1, a2) {
    var p1 = pt(cx, cy, r2, a1), p2 = pt(cx, cy, r2, a2), p3 = pt(cx, cy, r1, a2), p4 = pt(cx, cy, r1, a1);
    var large = (a2 - a1) > 180 ? 1 : 0;
    return 'M' + f(p1[0]) + ',' + f(p1[1]) + ' A' + r2 + ',' + r2 + ' 0 ' + large + ' 1 ' + f(p2[0]) + ',' + f(p2[1]) +
      ' L' + f(p3[0]) + ',' + f(p3[1]) + ' A' + r1 + ',' + r1 + ' 0 ' + large + ' 0 ' + f(p4[0]) + ',' + f(p4[1]) + ' Z';
  }
  /** Brake disc seen from the wheel side. */
  function discFront(cx, cy, r, opts) {
    opts = opts || {};
    var s = '<circle class="k-metal s-line" stroke-width="2" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>' +
      '<circle class="k-none s-line" stroke-width="1.5" cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.62) + '"/>' +
      '<circle class="k-metal2 s-line" stroke-width="1.5" cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.5) + '"/>' +
      '<circle class="k-dark" cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.17) + '"/>';
    for (var i = 0; i < 5; i++) {
      var p = pt(cx, cy, r * 0.32, -90 + i * 72);
      s += '<circle class="k-dark" cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="' + f(r * 0.05) + '"/>';
    }
    if (opts.screw !== false) {
      var q = pt(cx, cy, r * 0.32, -54);
      s += '<g class="' + (opts.screwCls || '') + '" style="transform-box:fill-box;transform-origin:center">' +
        '<circle class="k-accent s-dark" stroke-width="1" cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="' + f(r * 0.045) + '"/>' +
        '<line class="s-dark" stroke-width="1.5" x1="' + f(q[0] - r * 0.03) + '" y1="' + f(q[1]) + '" x2="' + f(q[0] + r * 0.03) + '" y2="' + f(q[1]) + '"/></g>';
    }
    return s;
  }
  function boltAt(x, y, r, cls, delay) {
    return '<g class="' + (cls || '') + '" style="transform-box:fill-box;transform-origin:center' + (delay ? ';animation-delay:' + delay + 's' : '') + '">' +
      '<circle class="k-dark" cx="' + f(x) + '" cy="' + f(y) + '" r="' + (r + 3) + '"/>' + L.hex(x, y, r, 'k-metal') +
      '<line class="s-dark" stroke-width="1.5" x1="' + f(x - r * 0.5) + '" y1="' + f(y) + '" x2="' + f(x + r * 0.5) + '" y2="' + f(y) + '"/></g>';
  }
  /** Timed caption: visible between a% and b% of a loop of dur seconds. */
  var capId = 0;
  function timed(inner, dur, a, b) {
    var n = 'brake-cap' + (++capId);
    var css = '.' + n + '{opacity:0;animation:' + n + ' ' + dur + 's linear infinite}' +
      '@keyframes ' + n + '{0%,' + a + '%{opacity:0}' + (a + 2) + '%,' + b + '%{opacity:1}' + Math.min(100, b + 2) + '%,100%{opacity:0}}';
    return '<style>' + css + '</style><g class="' + n + '">' + inner + '</g>';
  }
  function title(ctx, cs, en, y) {
    return L.label(16, y || 24, ctx.t({ cs: cs, en: en }), { anchor: 'start', bg: true });
  }

  /* front-view geometry (disc + floating caliper at 3 o'clock) */
  var DC = [200, 160], DR = 115;
  function carrierFront(boltCls) {
    var b1 = pt(DC[0], DC[1], 92, -47), b2 = pt(DC[0], DC[1], 92, 47);
    return '<path class="k-metal2 s-dark" stroke-width="1.5" d="' + seg(DC[0], DC[1], 80, 150, -44, 44) + '"/>' +
      boltAt(b1[0], b1[1], 8, boltCls) + boltAt(b2[0], b2[1], 8, boltCls, boltCls ? 0.3 : 0);
  }
  function padFront(cls) {
    return '<g class="' + (cls || '') + '"><path class="k-dark s-line" stroke-width="1" d="' + seg(DC[0], DC[1], 90, 134, -26, 26) + '"/>' +
      '<path class="k-filler" d="' + seg(DC[0], DC[1], 94, 130, -22, 22) + '" opacity=".35"/></g>';
  }
  function caliperFront(withHose) {
    var g1 = pt(DC[0], DC[1], 134, -27), g2 = pt(DC[0], DC[1], 134, 27);
    var h0 = pt(DC[0], DC[1], 140, -12);
    var s = '<path class="k-paint s-dark" stroke-width="2" d="' + seg(DC[0], DC[1], 88, 146, -32, 32) + '"/>' +
      '<path class="k-none s-dark" stroke-width="1" opacity=".5" d="' + seg(DC[0], DC[1], 100, 136, -24, 24) + '"/>';
    if (withHose) {
      s += '<path class="k-none s-dark" stroke-width="7" stroke-linecap="round" d="M' + f(h0[0]) + ',' + f(h0[1]) + ' C380,120 410,70 470,52"/>' +
        '<path class="k-none s-muted" stroke-width="2" stroke-linecap="round" d="M' + f(h0[0]) + ',' + f(h0[1]) + ' C380,120 410,70 470,52"/>';
    }
    // guide bolt caps
    s += '<circle class="k-dark" cx="' + f(g1[0]) + '" cy="' + f(g1[1]) + '" r="6"/><circle class="k-dark" cx="' + f(g2[0]) + '" cy="' + f(g2[1]) + '" r="6"/>';
    return s;
  }

  A.css('brake', [
    '.brake-rev, .brake-rev *{animation-direction:reverse !important}',
    /* overview: floating caliper squeeze, 4 s */
    '.brake-push{animation:brake-push 4s ease-in-out infinite}',
    '@keyframes brake-push{0%,20%{transform:translateX(0)}45%,70%{transform:translateX(5px)}90%,100%{transform:translateX(0)}}',
    '.brake-pushR{animation:brake-pushR 4s ease-in-out infinite}',
    '@keyframes brake-pushR{0%,20%{transform:translateX(0)}45%,70%{transform:translateX(-5px)}90%,100%{transform:translateX(0)}}',
    '.brake-fluid{animation:brake-fluid 4s ease-in-out infinite}',
    '@keyframes brake-fluid{0%,20%{opacity:.25}45%,70%{opacity:1}90%,100%{opacity:.25}}',
    '.brake-flow{stroke-dasharray:6 10;animation:brake-flow 1s linear infinite}',
    '@keyframes brake-flow{to{stroke-dashoffset:-16}}',
    '.brake-flowrev{stroke-dasharray:6 10;animation:brake-flowrev 1s linear infinite}',
    '@keyframes brake-flowrev{to{stroke-dashoffset:16}}',
    /* caliper off, 8 s */
    '.brake-boltout{animation:brake-boltout 8s ease-in infinite}',
    '@keyframes brake-boltout{0%,8%{transform:rotate(0) scale(1);opacity:1}26%{transform:rotate(-540deg) scale(1.5);opacity:0}26.1%,92%{opacity:0}100%{opacity:1;transform:rotate(0) scale(1)}}',
    '.brake-cal{animation:brake-cal 8s ease-in-out infinite}',
    '@keyframes brake-cal{0%,30%{transform:translate(0,0)}55%,90%{transform:translate(55px,-55px)}100%{transform:translate(0,0)}}',
    '.brake-hook{animation:brake-hook 8s linear infinite;opacity:0}',
    '@keyframes brake-hook{0%,56%{opacity:0}62%,90%{opacity:1}94%,100%{opacity:0}}',
    /* pads out, 7 s */
    '.brake-padout{animation:brake-padout 7s ease-in-out infinite}',
    '@keyframes brake-padout{0%,18%{transform:translateX(0);opacity:1}45%,88%{transform:translateX(110px);opacity:0}100%{transform:translateX(0);opacity:1}}',
    '.brake-padout2{animation:brake-padout2 7s ease-in-out infinite}',
    '@keyframes brake-padout2{0%,40%{transform:translateX(0);opacity:1}65%,88%{transform:translateX(110px);opacity:0}100%{transform:translateX(0);opacity:1}}',
    /* carrier + disc, 10 s */
    '.brake-carbolt{animation:brake-carbolt 10s ease-in infinite}',
    '@keyframes brake-carbolt{0%,4%{transform:rotate(0) scale(1);opacity:1}16%{transform:rotate(-540deg) scale(1.5);opacity:0}16.1%,93%{opacity:0}100%{opacity:1;transform:none}}',
    '.brake-carout{animation:brake-carout 10s ease-in-out infinite}',
    '@keyframes brake-carout{0%,18%{transform:translateX(0);opacity:1}34%,93%{transform:translateX(140px);opacity:0}100%{transform:translateX(0);opacity:1}}',
    '.brake-screw{animation:brake-screw 10s ease-in infinite}',
    '@keyframes brake-screw{0%,38%{transform:rotate(0) scale(1);opacity:1}50%{transform:rotate(-720deg) scale(1.8);opacity:0}50.1%,93%{opacity:0}100%{opacity:1;transform:none}}',
    '.brake-discoff{animation:brake-discoff 10s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes brake-discoff{0%,54%{transform:scale(1);opacity:1}72%,93%{transform:scale(1.2) translateY(30px);opacity:0}100%{transform:scale(1);opacity:1}}',
    /* hub clean, 7 s */
    '.brake-brush{animation:brake-brush 7s ease-in-out infinite}',
    '@keyframes brake-brush{0%{transform:translate(0,-72px)}10%{transform:translate(20px,-70px)}20%{transform:translate(62px,-36px)}30%{transform:translate(72px,0)}40%{transform:translate(55px,45px)}50%{transform:translate(0,72px)}60%{transform:translate(-50px,50px)}70%{transform:translate(-72px,0)}80%{transform:translate(-50px,-50px)}90%,100%{transform:translate(0,-72px)}}',
    '.brake-scrub{animation:brake-scrub .25s ease-in-out infinite alternate}',
    '@keyframes brake-scrub{from{transform:translateX(-4px)}to{transform:translateX(4px)}}',
    /* disc fit, 7 s */
    '.brake-mist{animation:brake-mist 1.2s ease-out infinite;opacity:0;transform-box:fill-box;transform-origin:center}',
    '@keyframes brake-mist{0%{opacity:.8;transform:translate(0,0) scale(.5)}100%{opacity:0;transform:translate(-90px,40px) scale(2)}}',
    '.brake-spray{animation:brake-spray 7s linear infinite}',
    '@keyframes brake-spray{0%,5%{opacity:0}8%,45%{opacity:1}50%,100%{opacity:0}}',
    '.brake-carin{animation:brake-carin 7s ease-in-out infinite}',
    '@keyframes brake-carin{0%,50%{transform:translateX(140px);opacity:0}68%,95%{transform:translateX(0);opacity:1}100%{transform:translateX(140px);opacity:0}}',
    /* piston push / wind, 7 s */
    '.brake-pst{animation:brake-pst 7s ease-in-out infinite}',
    '@keyframes brake-pst{0%,12%{transform:translateX(0)}75%,92%{transform:translateX(-26px)}100%{transform:translateX(0)}}',
    '.brake-level{animation:brake-level 7s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes brake-level{0%,12%{transform:scaleY(.55)}75%,92%{transform:scaleY(.92)}100%{transform:scaleY(.55)}}',
    '.brake-wind{animation:brake-wind 7s linear infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes brake-wind{0%,12%{transform:rotate(0)}75%,100%{transform:rotate(900deg)}}',
    /* reservoir syringe, 7 s */
    '.brake-syr{animation:brake-syr 7s ease-in-out infinite}',
    '@keyframes brake-syr{0%,8%{transform:translate(90px,-70px);opacity:0}22%{transform:translate(0,0);opacity:1}62%{transform:translate(0,0);opacity:1}80%,100%{transform:translate(90px,-70px);opacity:0}}',
    '.brake-plunger{animation:brake-plunger 7s ease-in-out infinite}',
    '@keyframes brake-plunger{0%,25%{transform:translateY(0)}60%,100%{transform:translateY(-34px)}}',
    '.brake-resdrop{animation:brake-resdrop 7s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes brake-resdrop{0%,25%{transform:scaleY(1)}60%,95%{transform:scaleY(.82)}100%{transform:scaleY(1)}}',
    /* fixed caliper, 9 s */
    '.brake-clipout{animation:brake-clipout 9s ease-in-out infinite}',
    '@keyframes brake-clipout{0%,8%{transform:translateY(0);opacity:1}22%,92%{transform:translateY(-60px);opacity:0}100%{transform:none;opacity:1}}',
    '.brake-pinout{animation:brake-pinout 9s ease-in infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes brake-pinout{0%,26%{transform:scale(1);opacity:1}42%,92%{transform:scale(2.2);opacity:0}100%{transform:scale(1);opacity:1}}',
    '.brake-fxpad{animation:brake-fxpad 9s ease-in-out infinite}',
    '@keyframes brake-fxpad{0%,48%{transform:translateY(0);opacity:1}72%,92%{transform:translateY(-130px);opacity:0}100%{transform:none;opacity:1}}',
    '.brake-punch{animation:brake-punch 9s ease-in-out infinite;opacity:0}',
    '@keyframes brake-punch{0%,24%{opacity:0;transform:translate(-30px,30px)}28%,40%{opacity:1;transform:translate(0,0)}44%,100%{opacity:0}}',
    /* fixed caliper pistons, 8 s */
    '.brake-fxL{animation:brake-fxL 8s ease-in-out infinite}',
    '@keyframes brake-fxL{0%,10%{transform:translateX(0)}38%,92%{transform:translateX(-14px)}100%{transform:translateX(0)}}',
    '.brake-fxR{animation:brake-fxR 8s ease-in-out infinite}',
    '@keyframes brake-fxR{0%,50%{transform:translateX(0)}78%,92%{transform:translateX(14px)}100%{transform:translateX(0)}}',
    '.brake-levL{animation:brake-levL 8s ease-in-out infinite}',
    '@keyframes brake-levL{0%,8%{opacity:0}12%,40%{opacity:1}46%,100%{opacity:0}}',
    '.brake-levR{animation:brake-levR 8s ease-in-out infinite}',
    '@keyframes brake-levR{0%,48%{opacity:0}52%,80%{opacity:1}86%,100%{opacity:0}}',
    /* EPB, 10 s */
    '.brake-gear{animation:brake-gear 10s linear infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes brake-gear{0%,30%{transform:rotate(0)}60%,100%{transform:rotate(-1080deg)}}',
    '.brake-spindle{animation:brake-spindle 10s ease-in-out infinite}',
    '@keyframes brake-spindle{0%,30%{transform:translateX(0)}60%,95%{transform:translateX(28px)}100%{transform:translateX(0)}}',
    '.brake-epbpiston{animation:brake-epbpiston 10s ease-in-out infinite}',
    '@keyframes brake-epbpiston{0%,64%{transform:translateX(0)}82%,95%{transform:translateX(26px)}100%{transform:translateX(0)}}',
    /* pedal, 7 s */
    '.brake-pedal{animation:brake-pedal 7s ease-in-out infinite;transform-origin:250px 40px}',
    '@keyframes brake-pedal{0%{transform:rotate(0)}9%{transform:rotate(24deg)}17%{transform:rotate(0)}29%{transform:rotate(17deg)}37%{transform:rotate(0)}49%{transform:rotate(11deg)}57%{transform:rotate(0)}68%{transform:rotate(6deg)}76%{transform:rotate(0)}85%,95%{transform:rotate(5deg)}100%{transform:rotate(0)}}',
    /* bedding, 8 s */
    '.brake-road{animation:brake-road .5s linear infinite}',
    '@keyframes brake-road{to{transform:translateX(-60px)}}',
    '.brake-speedbar{animation:brake-speedbar 4s ease-in-out infinite;transform-box:fill-box;transform-origin:0 50%}',
    '@keyframes brake-speedbar{0%{transform:scaleX(1)}15%{transform:scaleX(1)}60%{transform:scaleX(.38)}100%{transform:scaleX(1)}}',
    '.brake-hot{animation:brake-hot 4s ease-in-out infinite;opacity:0}',
    '@keyframes brake-hot{0%,15%{opacity:0}30%,60%{opacity:.85}75%,100%{opacity:0}}',
    /* drum-in-hat, 6 s */
    '.brake-adj{animation:brake-adj 6s linear infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes brake-adj{0%,20%{transform:rotate(0)}70%,100%{transform:rotate(-540deg)}}',
    '.brake-shoeL{animation:brake-shoeL 6s ease-in-out infinite}',
    '@keyframes brake-shoeL{0%,20%{transform:translateX(0)}70%,92%{transform:translateX(7px)}100%{transform:translateX(0)}}',
    '.brake-shoeR{animation:brake-shoeR 6s ease-in-out infinite}',
    '@keyframes brake-shoeR{0%,20%{transform:translateX(0)}70%,92%{transform:translateX(-7px)}100%{transform:translateX(0)}}'
  ].join('\n'));

  /* ---------------------------------------------------- 1. overview */
  A.register('brake.overview', {
    render: function (ctx) {
      var fixed = ctx.vehicle === 'toyota-gr-yaris';
      var s = '';
      // fluid line
      s += '<path class="k-none s-fluid brake-fluid" stroke-width="7" stroke-linecap="round" d="M30,175 L150,175"/>' +
        '<path class="k-none s-white brake-flow" stroke-width="2" d="M30,175 L150,175" opacity=".8"/>';
      if (fixed) {
        s += '<path class="k-none s-fluid" stroke-width="4" d="M150,175 L150,256 L330,256 L330,230" opacity=".7"/>';
      }
      // disc
      s += '<rect class="k-metal s-line" stroke-width="1.5" x="232" y="118" width="16" height="182"/>' +
        '<rect class="k-metal2" x="226" y="250" width="28" height="50"/>';
      // caliper (floating group for floating type)
      var cal = '<path class="k-paint s-dark" stroke-width="2" d="M150,70 H312 V232 H274 V104 H196 V232 H150 Z"/>' +
        '<rect class="k-dark" x="160" y="140" width="36" height="70"/>';
      if (fixed) cal += '<rect class="k-dark" x="274" y="140" width="28" height="70"/>';
      // right pad (outer)
      var rpad = '<rect class="k-filler s-dark" stroke-width="1" x="252" y="128" width="12" height="96"/><rect class="k-dark" x="264" y="124" width="8" height="104"/>';
      if (fixed) {
        s += cal + '<g class="brake-push"><rect class="k-fluid brake-fluid" x="160" y="146" width="10" height="58"/>' +
          '<rect class="k-metal s-dark" stroke-width="1" x="170" y="146" width="38" height="58" rx="3"/>' +
          '<rect class="k-dark" x="208" y="124" width="8" height="104"/><rect class="k-filler s-dark" stroke-width="1" x="216" y="128" width="12" height="96"/></g>' +
          '<g class="brake-pushR"><rect class="k-metal s-dark" stroke-width="1" x="272" y="146" width="20" height="58" rx="3"/>' + rpad + '</g>';
      } else {
        s += '<g class="brake-pushR">' + cal + rpad + '</g>' +
          '<g class="brake-push"><rect class="k-fluid brake-fluid" x="160" y="146" width="10" height="58"/>' +
          '<rect class="k-metal s-dark" stroke-width="1" x="170" y="146" width="38" height="58" rx="3"/>' +
          '<rect class="k-dark" x="208" y="124" width="8" height="104"/><rect class="k-filler s-dark" stroke-width="1" x="216" y="128" width="12" height="96"/></g>';
      }
      // labels
      s += L.label(231, 58, ctx.t(fixed ? { cs: 'Pevný třmen (4 písty)', en: 'Fixed caliper (4 pistons)' } : { cs: 'Plovoucí třmen', en: 'Floating caliper' }), { bg: true });
      s += L.label(90, 160, ctx.t({ cs: 'Brzdová kapalina', en: 'Brake fluid' }), { bg: true, size: 12 });
      s += L.label(100, 236, ctx.t({ cs: 'Píst', en: 'Piston' }), { bg: true, size: 12 }) + L.arrow(118, 230, 182, 200, 'accent', 2);
      s += L.label(330, 140, ctx.t({ cs: 'Destičky', en: 'Pads' }), { bg: true, size: 12, anchor: 'start' });
      s += L.arrow(326, 140, 272, 150, 'accent', 2);
      s += L.label(330, 280, ctx.t({ cs: 'Kotouč', en: 'Disc' }), { bg: true, size: 12, anchor: 'start' });
      s += L.arrow(326, 280, 250, 272, 'accent', 2);
      s += L.label(16, 24, ctx.t(fixed
        ? { cs: 'Písty z obou stran tlačí destičky na kotouč', en: 'Pistons on both sides press the pads onto the disc' }
        : { cs: 'Píst tlačí vnitřní destičku, třmen se posune a přitlačí vnější', en: 'Piston pushes the inner pad, caliper slides and pulls the outer pad in' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Princip kotoučové brzdy', en: 'How a disc brake works' }));
    }
  });

  /* ---------------------------------------------------- 2. reservoir */
  A.register('brake.reservoir', {
    render: function (ctx) {
      var s = '<rect class="k-ground" x="0" y="250" width="480" height="50"/>' +
        // reservoir
        '<rect class="k-glass s-dark" stroke-width="2" x="160" y="90" width="160" height="150" rx="12" opacity=".55"/>' +
        '<g class="brake-resdrop"><rect class="k-oil" x="164" y="112" width="152" height="124" rx="8" opacity=".85"/></g>' +
        '<rect class="k-glass s-dark" stroke-width="2" x="214" y="72" width="52" height="20" opacity=".55"/>' +
        '<g transform="translate(400,230)"><rect class="k-dark" x="-30" y="-12" width="60" height="22" rx="4"/></g>' + L.label(400, 206, ctx.t({ cs: 'víčko', en: 'cap' }), { size: 11 }) +
        '<line class="s-dark" stroke-width="2" x1="320" y1="112" x2="340" y2="112"/><line class="s-dark" stroke-width="2" x1="320" y1="200" x2="340" y2="200"/>' +
        L.label(346, 112, 'MAX', { anchor: 'start', size: 13 }) + L.label(346, 200, 'MIN', { anchor: 'start', size: 13 }) +
        // syringe
        '<g transform="translate(240,40)"><g class="brake-syr">' +
        '<rect class="k-glass s-dark" stroke-width="1.5" x="-12" y="0" width="24" height="90" rx="3" opacity=".9"/>' +
        '<line class="s-dark" stroke-width="3" x1="0" y1="90" x2="0" y2="110"/>' +
        '<g class="brake-plunger"><rect class="k-dark" x="-10" y="50" width="20" height="8"/><line class="s-dark" stroke-width="4" x1="0" y1="-30" x2="0" y2="50"/><rect class="k-dark" x="-16" y="-34" width="32" height="6" rx="2"/></g>' +
        '</g></g>' +
        title(ctx, 'Hladina u MAX? Odsajte trochu kapaliny', 'Level at MAX? Remove a little fluid') +
        L.warnIcon(30, 276) + L.label(52, 280, ctx.t({ cs: 'Kapalina leptá lak a oči – ihned omýt vodou', en: 'Fluid attacks paint and eyes – rinse with water at once' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Kontrola nádržky brzdové kapaliny', en: 'Checking the brake fluid reservoir' }));
    }
  });

  /* ---------------------------------------------------- 3. caliper off / on */
  function caliperScene(ctx, on) {
    var g1 = pt(DC[0], DC[1], 134, -27), g2 = pt(DC[0], DC[1], 134, 27);
    var s = discFront(DC[0], DC[1], DR) + carrierFront() + padFront() +
      '<g class="brake-cal">' + caliperFront(true) + '</g>' +
      boltAt(g1[0], g1[1], 7, 'brake-boltout') + boltAt(g2[0], g2[1], 7, 'brake-boltout') +
      '<g class="brake-hook"><path class="k-none s-text" stroke-width="3" stroke-linecap="round" d="M392,0 L392,22 Q392,34 382,34 Q374,34 374,26"/>' +
      L.check(440, 120) + L.label(410, 165, ctx.t({ cs: 'Drát / háček', en: 'Wire / hook' }), { bg: true, size: 12 }) + '</g>';
    var wrap = '<g class="' + (on ? 'brake-rev' : '') + '">' + s + '</g>';
    wrap += on
      ? title(ctx, 'Nasadit třmen, vodicí šrouby momentem', 'Fit caliper, torque the guide bolts')
      : title(ctx, 'Povolit 2 vodicí šrouby (vnitřní strana)', 'Undo the 2 guide bolts (inner side)');
    wrap += L.cross(30, 268) + L.label(52, 272, ctx.t({ cs: 'Nikdy nevěšet za brzdovou hadici!', en: 'Never hang it by the brake hose!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
    return L.svg(wrap, ctx.t(on ? { cs: 'Montáž třmenu', en: 'Refitting the caliper' } : { cs: 'Demontáž a zavěšení třmenu', en: 'Removing and hanging the caliper' }));
  }
  A.register('brake.caliperOff', { render: function (ctx) { return caliperScene(ctx, false); } });
  A.register('brake.caliperOn', { render: function (ctx) { return caliperScene(ctx, true); } });

  /* ---------------------------------------------------- 4. pads out / in */
  function padsScene(ctx, inn) {
    var c1 = pt(DC[0], DC[1], 112, -40), c2 = pt(DC[0], DC[1], 112, 40);
    var s = '<g class="' + (inn ? 'brake-rev' : '') + '">' + discFront(DC[0], DC[1], DR) + carrierFront() +
      // inner pad (behind disc, dashed outline)
      '<g class="brake-padout2"><path class="k-none s-muted" stroke-width="2" stroke-dasharray="5 4" d="' + seg(DC[0], DC[1], 90, 134, -26, 26) + '"/></g>' +
      '<g class="brake-padout">' + padFront() +
      '<path class="k-none s-warn" stroke-width="2.5" d="M' + f(pt(DC[0], DC[1], 120, 10)[0]) + ',' + f(pt(DC[0], DC[1], 120, 10)[1]) + ' C330,200 360,230 390,236"/></g>' +
      '</g>' +
      // clips
      '<circle class="k-accent lib-pulse" cx="' + f(c1[0]) + '" cy="' + f(c1[1]) + '" r="10"/><circle class="k-accent lib-pulse" cx="' + f(c2[0]) + '" cy="' + f(c2[1]) + '" r="10"/>' +
      '<rect class="k-ok s-dark" stroke-width="1" x="' + f(c1[0] - 4) + '" y="' + f(c1[1] - 7) + '" width="8" height="14" rx="2"/>' +
      '<rect class="k-ok s-dark" stroke-width="1" x="' + f(c2[0] - 4) + '" y="' + f(c2[1] - 7) + '" width="8" height="14" rx="2"/>';
    s += inn
      ? title(ctx, 'Nové spony, pasta jen na uši destiček', 'New clips, paste only on the pad ears')
      : title(ctx, 'Vytáhnout vnější i vnitřní destičku', 'Pull out the outer and inner pad');
    s += L.label(390, 60, ctx.t({ cs: 'Spony (nové ze sady)', en: 'Clips (new from kit)' }), { bg: true, size: 12 });
    s += L.label(400, 256, ctx.t({ cs: 'Senzor opotřebení', en: 'Wear sensor' }), { bg: true, size: 12 });
    s += L.warnIcon(30, 276) + L.label(52, 280, ctx.t({ cs: 'Žádný tuk na třecí plochy!', en: 'No grease on friction surfaces!' }), { anchor: 'start', bg: true, size: 12 });
    return L.svg(s, ctx.t(inn ? { cs: 'Vložení nových destiček', en: 'Fitting new pads' } : { cs: 'Vyjmutí starých destiček', en: 'Removing the old pads' }));
  }
  A.register('brake.padsOut', { render: function (ctx) { return padsScene(ctx, false); } });
  A.register('brake.padsIn', { render: function (ctx) { return padsScene(ctx, true); } });

  /* ---------------------------------------------------- 5. carrier + disc */
  function hubFace(cx, cy, r, rustCls) {
    var s = '<circle class="k-metal2 s-dark" stroke-width="1.5" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>' +
      '<circle class="k-metal" cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.45) + '"/><circle class="k-dark" cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.25) + '"/>';
    for (var i = 0; i < 5; i++) {
      var p = pt(cx, cy, r * 0.68, -90 + i * 72);
      s += '<circle class="k-dark" cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="' + f(r * 0.09) + '"/>';
    }
    // rust patches
    for (var j = 0; j < 6; j++) {
      var a0 = -80 + j * 60;
      s += '<path class="k-rust ' + (rustCls ? rustCls + ' brake-r' + j : '') + '" opacity=".9" d="' + seg(cx, cy, r * 0.5, r * 0.98, a0, a0 + 34) + '"/>';
    }
    return s;
  }

  A.register('brake.carrierDisc', {
    render: function (ctx) {
      var s = hubFace(DC[0], DC[1], 62) +
        '<g class="brake-discoff">' + discFront(DC[0], DC[1], DR, { screwCls: 'brake-screw' }) + '</g>' +
        '<g class="brake-carout">' + carrierFront('brake-carbolt') + '</g>';
      s += timed(title(ctx, '1. Povolit šrouby držáku třmenu (zezadu)', '1. Undo the caliper carrier bolts (from behind)'), 10, 0, 34);
      s += timed(title(ctx, '2. Vyšroubovat pojistný šroubek kotouče', '2. Remove the disc retaining screw'), 10, 36, 52);
      s += timed(title(ctx, '3. Stáhnout kotouč z náboje', '3. Pull the disc off the hub'), 10, 54, 76);
      s += timed(title(ctx, 'Náboj je zrezivělý → očistit!', 'Hub is rusty → clean it!'), 10, 76, 93);
      s += L.label(472, 288, ctx.t({ cs: 'Přikipělý? Gumová palice mezi šrouby', en: 'Stuck? Rubber mallet between the studs' }), { bg: true, size: 11, anchor: 'end' });
      return L.svg(s, ctx.t({ cs: 'Demontáž držáku třmenu a kotouče', en: 'Removing the caliper carrier and disc' }));
    }
  });

  /* ---------------------------------------------------- 6. hub clean */
  A.register('brake.hubClean', {
    render: function (ctx) {
      var css = '';
      for (var j = 0; j < 6; j++) {
        var a = 6 + j * 10, b = a + 8;
        css += '.brake-r' + j + '{animation:brake-r' + j + ' 7s linear infinite}@keyframes brake-r' + j + '{0%,' + a + '%{opacity:.9}' + b + '%,92%{opacity:0}100%{opacity:.9}}';
      }
      var s = '<style>' + css + '</style>' + hubFace(220, 160, 110, 'x') +
        '<g transform="translate(220,160)"><g class="brake-brush"><g class="brake-scrub">' +
        '<rect class="k-oil s-dark" stroke-width="1.5" x="-28" y="-12" width="56" height="18" rx="4"/>' +
        '<path class="k-none s-muted" stroke-width="1.5" d="M-24,6 v8 M-16,6 v8 M-8,6 v8 M0,6 v8 M8,6 v8 M16,6 v8 M24,6 v8"/>' +
        '<rect class="k-dark" x="20" y="-8" width="90" height="10" rx="5" transform="rotate(-20 20 -3)"/></g></g></g>' +
        timed(L.check(420, 70) + L.label(400, 74, ctx.t({ cs: 'Čistý kov', en: 'Bare metal' }), { anchor: 'end', bg: true }), 7, 72, 92) +
        title(ctx, 'Dosedací plochu náboje očistit do kovu', 'Clean the hub contact face to bare metal') +
        L.label(16, 286, ctx.t({ cs: 'Rez pod kotoučem = házení a vibrace', en: 'Rust under the disc = runout and vibration' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Čištění náboje drátěným kartáčem', en: 'Cleaning the hub with a wire brush' }));
    }
  });

  /* ---------------------------------------------------- 7. new disc + carrier */
  A.register('brake.discFit', {
    render: function (ctx) {
      var mist = '';
      for (var i = 0; i < 6; i++) {
        mist += '<circle class="k-glass brake-mist" cx="392" cy="70" r="8" style="animation-delay:' + (i * 0.2).toFixed(1) + 's"/>';
      }
      var s = discFront(DC[0], DC[1], DR) +
        '<g class="brake-spray">' + mist +
        '<g transform="translate(400,40) rotate(30)"><rect class="k-ok s-dark" stroke-width="1.5" x="0" y="0" width="34" height="80" rx="6"/><rect class="k-dark" x="10" y="-12" width="14" height="12"/><rect class="k-white" x="5" y="22" width="24" height="20" rx="2" opacity=".8"/></g></g>' +
        '<g class="brake-carin">' + carrierFront() + '</g>' +
        timed(title(ctx, 'Nový kotouč odmastit čističem brzd (obě strany)', 'Degrease the new disc with brake cleaner (both sides)'), 7, 0, 48) +
        timed(title(ctx, 'Držák třmenu: šrouby momentovým klíčem', 'Caliper carrier: torque the bolts') + L.badge(400, 284, ctx.t({ cs: 'Moment viz krok', en: 'Torque: see step' }), 'accent'), 7, 50, 97);
      return L.svg(s, ctx.t({ cs: 'Montáž nového kotouče a držáku', en: 'Fitting the new disc and carrier' }));
    }
  });

  /* ---------------------------------------------------- 8. piston push / wind */
  function pistonScene(ctx, wind) {
    var s = '';
    // reservoir + line
    s += '<rect class="k-glass s-dark" stroke-width="1.5" x="30" y="50" width="70" height="80" rx="8" opacity=".6"/>' +
      '<g class="brake-level"><rect class="k-oil" x="34" y="60" width="62" height="66" rx="5" opacity=".85"/></g>' +
      '<line class="s-danger" stroke-width="2" x1="26" y1="62" x2="104" y2="62" stroke-dasharray="4 3"/>' +
      L.label(108, 62, 'MAX', { anchor: 'start', size: 11, cls: 'k-danger' }) +
      '<path class="k-none s-fluid" stroke-width="6" d="M65,130 L65,175 L200,175"/>' +
      '<path class="k-none s-white brake-flowrev" stroke-width="2" d="M65,130 L65,175 L200,175" opacity=".8"/>';
    // caliper body cross-section
    s += '<rect class="k-paint s-dark" stroke-width="2" x="200" y="115" width="130" height="110" rx="8"/>' +
      '<rect class="k-dark" x="226" y="138" width="104" height="64"/>' +
      '<rect class="k-fluid" x="226" y="140" width="40" height="60" opacity=".7"/>';
    if (wind) {
      // spindle thread inside bore
      s += '<path class="k-none s-metal" stroke-width="2" d="M232,160 l6,20 l6,-20 l6,20 l6,-20 l6,20 l6,-20 l6,20 l6,-20"/>';
    }
    // moving group: piston + old pad + tool plate
    var g = '<rect class="k-metal s-dark" stroke-width="1.5" x="262" y="142" width="88" height="56" rx="4"/>';
    if (wind) g += '<line class="s-dark" stroke-width="2" x1="350" y1="152" x2="350" y2="188"/>';
    g += '<rect class="k-dark" x="350" y="126" width="8" height="88"/><rect class="k-filler s-dark" stroke-width="1" x="358" y="130" width="12" height="80"/>';
    if (!wind) {
      g += '<rect class="k-metal2 s-dark" stroke-width="1.5" x="370" y="140" width="10" height="60" rx="2"/>' +
        '<rect class="k-metal s-dark" stroke-width="1" x="380" y="164" width="96" height="12"/>' +
        '<path class="k-none s-dark" stroke-width="1" d="M384,164 l4,12 M392,164 l4,12 M400,164 l4,12 M408,164 l4,12 M416,164 l4,12 M424,164 l4,12 M432,164 l4,12"/>';
    } else {
      g += '<rect class="k-metal2 s-dark" stroke-width="1.5" x="370" y="136" width="14" height="68" rx="3"/>' +
        '<rect class="k-metal s-dark" stroke-width="1" x="384" y="163" width="70" height="14"/>';
    }
    s += '<g class="brake-pst">' + g + '</g>';
    if (!wind) {
      // C-clamp frame
      s += '<path class="k-none s-warn" stroke-width="8" stroke-linejoin="round" d="M196,150 L186,150 L186,100 L452,100 L452,170"/>' +
        '<rect class="k-warn s-dark" stroke-width="1.5" x="440" y="160" width="24" height="22" rx="3"/>' +
        title(ctx, 'Píst pomalu zatlačit (lis / svěrka)', 'Push the piston back slowly (press / clamp)');
      s += L.arrow(420, 236, 360, 236, 'accent', 3);
    } else {
      s += '<path class="k-none s-warn" stroke-width="8" stroke-linejoin="round" d="M196,150 L186,150 L186,100 L462,100 L462,160"/>' +
        '<rect class="k-warn s-dark" stroke-width="1.5" x="450" y="156" width="24" height="28" rx="3"/>' +
        // inset face view rotating
        '<g transform="translate(410,250)"><circle class="k-labelbg s-line" stroke-width="1.5" r="36"/>' +
        '<g class="brake-wind"><circle class="k-metal s-dark" stroke-width="1.5" r="26"/>' +
        '<rect class="k-dark" x="-3" y="-24" width="6" height="12"/><rect class="k-dark" x="-3" y="12" width="6" height="12"/>' +
        '<circle class="k-metal2 s-dark" r="8"/></g></g>' +
        L.rotArrow(410, 250, 44, 'cw', 'accent', 120) +
        L.label(348, 256, ctx.t({ cs: 'Ve směru hod. ručiček', en: 'Clockwise' }), { anchor: 'end', bg: true, size: 12 }) +
        title(ctx, 'Píst točit a zároveň tlačit (zašroubovat)', 'Turn and push the piston at the same time (wind in)');
    }
    s += L.label(140, 270, ctx.t({ cs: 'Hladina stoupá – hlídat MAX', en: 'Level rises – watch MAX' }), { bg: true, size: 12 });
    if (!wind) s += L.label(390, 252, ctx.t({ cs: 'Stará destička chrání píst', en: 'Old pad protects the piston' }), { bg: true, size: 12 });
    return L.svg(s, ctx.t(wind ? { cs: 'Zašroubování pístu zadního třmenu', en: 'Winding back a rear caliper piston' } : { cs: 'Zatlačení pístu brzdy', en: 'Pushing back the brake piston' }));
  }
  A.register('brake.pistonPush', { render: function (ctx) { return pistonScene(ctx, false); } });
  A.register('brake.pistonWind', { render: function (ctx) { return pistonScene(ctx, true); } });

  /* ---------------------------------------------------- 9. fixed caliper (axial view, caliper on top) */
  var FC = [240, 235], FR = 135;
  function fixedScene(ctx, inn) {
    var p1 = pt(FC[0], FC[1], 158, -98), p2 = pt(FC[0], FC[1], 158, -82);
    var s = '<g class="' + (inn ? 'brake-rev' : '') + '">' +
      discFront(FC[0], FC[1], FR, { screw: false }) +
      // pads (move up)
      '<g class="brake-fxpad"><path class="k-dark s-line" stroke-width="1" d="' + seg(FC[0], FC[1], 104, 168, -104, -76) + '"/>' +
      '<path class="k-filler" opacity=".4" d="' + seg(FC[0], FC[1], 108, 150, -100, -80) + '"/></g>' +
      // caliper body with window
      '<path class="k-paint s-dark" stroke-width="2" d="' + seg(FC[0], FC[1], 100, 180, -122, -106) + '"/>' +
      '<path class="k-paint s-dark" stroke-width="2" d="' + seg(FC[0], FC[1], 100, 180, -74, -58) + '"/>' +
      '<path class="k-paint s-dark" stroke-width="2" d="' + seg(FC[0], FC[1], 165, 180, -106, -74) + '"/>' +
      '<path class="k-paint s-dark" stroke-width="2" d="' + seg(FC[0], FC[1], 100, 112, -106, -74) + '" opacity=".9"/>' +
      // pins
      '<g class="brake-pinout"><circle class="k-metal s-dark" stroke-width="1.5" cx="' + f(p1[0]) + '" cy="' + f(p1[1]) + '" r="6"/></g>' +
      '<g class="brake-pinout"><circle class="k-metal s-dark" stroke-width="1.5" cx="' + f(p2[0]) + '" cy="' + f(p2[1]) + '" r="6"/></g>' +
      // anti-rattle spring
      '<g class="brake-clipout"><path class="k-none s-accent" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" d="M' + f(p1[0]) + ',' + f(p1[1] - 4) + ' L' + f(FC[0] - 8) + ',' + f(p1[1] + 12) + ' L' + f(FC[0] + 8) + ',' + f(p1[1] + 12) + ' L' + f(p2[0]) + ',' + f(p2[1] - 4) + '"/></g>' +
      // punch
      '<g transform="translate(' + f(p1[0]) + ',' + f(p1[1]) + ')"><g class="brake-punch"><rect class="k-metal2 s-dark" stroke-width="1" x="-46" y="-4" width="44" height="8" rx="2" transform="rotate(-35)"/></g></g>' +
      '</g>';
    if (inn) {
      s += title(ctx, 'Destičky dolů → kolíky → pojistná pružina', 'Pads in → pins → anti-rattle spring');
    } else {
      s += timed(title(ctx, '1. Sundat pojistnou pružinu', '1. Remove the anti-rattle spring'), 9, 0, 24);
      s += timed(title(ctx, '2. Vyrazit / vytáhnout kolíky', '2. Drift out / pull the pins'), 9, 25, 46);
      s += timed(title(ctx, '3. Destičky vytáhnout nahoru z třmenu', '3. Lift the pads out of the caliper'), 9, 47, 96);
    }
    s += L.label(400, 140, ctx.t({ cs: 'Třmen zůstává na voze', en: 'Caliper stays on the car' }), { bg: true, size: 12 });
    return L.svg(s, ctx.t(inn ? { cs: 'Vložení destiček do pevného třmenu', en: 'Fitting pads into a fixed caliper' } : { cs: 'Vyjmutí destiček z pevného třmenu', en: 'Removing pads from a fixed caliper' }));
  }
  A.register('brake.fixedPins', { render: function (ctx) { return fixedScene(ctx, false); } });
  A.register('brake.fixedPadsIn', { render: function (ctx) { return fixedScene(ctx, true); } });

  /* top-view fixed caliper: pistons pushed back evenly, one side at a time */
  A.register('brake.fixedPistons', {
    render: function (ctx) {
      var s = '<rect class="k-metal s-line" stroke-width="1.5" x="232" y="100" width="16" height="200"/>' +
        '<path class="k-paint s-dark" stroke-width="2" d="M120,60 H360 V250 H300 V110 H180 V250 H120 Z"/>' +
        '<rect class="k-dark" x="134" y="118" width="46" height="120"/><rect class="k-dark" x="300" y="118" width="46" height="120"/>';
      var left = '<rect class="k-metal s-dark" stroke-width="1" x="150" y="124" width="56" height="48" rx="4"/><rect class="k-metal s-dark" stroke-width="1" x="150" y="184" width="56" height="48" rx="4"/>' +
        '<rect class="k-dark" x="206" y="114" width="8" height="128"/><rect class="k-filler s-dark" stroke-width="1" x="214" y="118" width="14" height="120"/>';
      var right = '<rect class="k-metal s-dark" stroke-width="1" x="274" y="124" width="56" height="48" rx="4"/><rect class="k-metal s-dark" stroke-width="1" x="274" y="184" width="56" height="48" rx="4"/>' +
        '<rect class="k-dark" x="266" y="114" width="8" height="128"/><rect class="k-filler s-dark" stroke-width="1" x="252" y="118" width="14" height="120"/>';
      s += '<g class="brake-fxL">' + left + '</g><g class="brake-fxR">' + right + '</g>';
      // lever (flat bar) between pad and disc
      s += '<g class="brake-levL"><rect class="k-warn s-dark" stroke-width="1" x="226" y="20" width="8" height="120" rx="2" transform="rotate(8 230 140)"/>' + L.arrow(200, 270, 160, 270, 'accent', 3) + '</g>';
      s += '<g class="brake-levR"><rect class="k-warn s-dark" stroke-width="1" x="246" y="20" width="8" height="120" rx="2" transform="rotate(-8 250 140)"/>' + L.arrow(280, 270, 320, 270, 'accent', 3) + '</g>';
      s += title(ctx, 'Písty zatlačit rovnoměrně – nejdřív jedna strana, pak druhá', 'Push pistons back evenly – one side, then the other');
      s += L.label(240, 292, ctx.t({ cs: 'Pomalu, hlídat hladinu kapaliny', en: 'Slowly, watch the fluid level' }), { bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Zatlačení pístů pevného třmenu', en: 'Pushing back fixed-caliper pistons' }));
    }
  });

  /* ---------------------------------------------------- 10. EPB service mode */
  A.register('brake.epb', {
    render: function (ctx) {
      var s = '<rect class="k-dark" x="20" y="50" width="170" height="200" rx="14"/>' +
        '<rect class="k-glass" x="32" y="64" width="146" height="110" rx="6"/>' +
        '<text x="105" y="88" text-anchor="middle" font-size="14" font-weight="800" class="k-badgetext">EPB</text>' +
        timed('<text x="105" y="120" text-anchor="middle" font-size="12" font-weight="700" class="k-badgetext">' + S.esc(ctx.t({ cs: 'Servisní režim…', en: 'Service mode…' })) + '</text>' +
          '<rect class="k-accent" x="50" y="134" width="110" height="8" rx="4"/>', 10, 0, 30) +
        timed('<text x="105" y="120" text-anchor="middle" font-size="13" font-weight="800" class="k-badgetext">' + S.esc(ctx.t({ cs: 'AKTIVNÍ', en: 'ACTIVE' })) + '</text>' + L.check(105, 150), 10, 31, 97) +
        '<circle class="k-metal2" cx="70" cy="210" r="14"/><circle class="k-metal2" cx="140" cy="210" r="14"/>' +
        '<path class="k-none s-dark" stroke-width="6" d="M105,250 Q105,285 160,290 L240,290"/>';
      // caliper (bore opens to the left)
      s += '<rect class="k-metal s-line" stroke-width="1.5" x="226" y="96" width="14" height="170"/>' +
        '<rect class="k-dark" x="242" y="122" width="8" height="118"/><rect class="k-filler" x="240" y="126" width="2" height="110"/>' +
        '<rect class="k-paint s-dark" stroke-width="2" x="270" y="110" width="130" height="140" rx="8"/>' +
        '<rect class="k-dark" x="270" y="146" width="104" height="68"/>' +
        '<g class="brake-epbpiston"><rect class="k-metal s-dark" stroke-width="1.5" x="252" y="150" width="70" height="60" rx="4"/></g>' +
        '<g class="brake-spindle"><path class="k-none s-warn" stroke-width="3" d="M326,172 l6,16 l6,-16 l6,16 l6,-16 l6,16 l6,-16"/></g>' +
        '<rect class="k-dark s-line" stroke-width="1.5" x="400" y="130" width="64" height="100" rx="8"/>' +
        '<g class="brake-gear"><circle class="k-metal2 s-dark" stroke-width="1.5" cx="432" cy="180" r="20"/>' +
        '<path class="k-none s-dark" stroke-width="5" d="M432,156 v8 M432,196 v8 M408,180 h8 M448,180 h8"/></g>' +
        L.label(432, 252, ctx.t({ cs: 'Motor EPB', en: 'EPB motor' }), { bg: true, size: 12 });
      s += timed(title(ctx, '1. Tester: EPB → servisní režim', '1. Scan tool: EPB → service mode'), 10, 0, 30);
      s += timed(title(ctx, '2. Motor stáhne vřeteno zpět', '2. Motor winds the spindle back'), 10, 31, 62);
      s += timed(title(ctx, '3. Teprve teď lze píst zatlačit', '3. Only now can the piston be pushed'), 10, 63, 97);
      return L.svg(s, ctx.t({ cs: 'Servisní režim elektrické parkovací brzdy', en: 'Electric parking brake service mode' }));
    }
  });

  /* ---------------------------------------------------- 11. pedal */
  A.register('brake.pedal', {
    render: function (ctx) {
      var s = '<rect class="k-ground" x="0" y="262" width="480" height="38"/>' +
        '<path class="k-dark" d="M120,262 L170,140 L190,140 L150,262 Z" opacity=".5"/>' +
        '<g class="brake-pedal">' +
        '<path class="k-none s-dark" stroke-width="10" stroke-linecap="round" d="M250,40 Q250,150 214,210"/>' +
        '<rect class="k-metal2 s-dark" stroke-width="2" x="186" y="200" width="56" height="22" rx="5" transform="rotate(-30 214 211)"/>' +
        L.arrow(330, 178, 244, 214, 'accent', 6) +
        '</g>' +
        '<circle class="k-dark" cx="250" cy="40" r="10"/>' +
        title(ctx, 'Sešlapávat, dokud pedál není vysoko a tvrdý', 'Pump until the pedal is high and firm') +
        L.label(380, 120, ctx.t({ cs: '1. nejdřív propadá', en: '1. first sinks' }), { bg: true, size: 12 }) +
        L.label(380, 148, ctx.t({ cs: '2. pak je vysoko a tvrdý', en: '2. then high and firm' }), { bg: true, size: 12 }) +
        L.warnIcon(30, 276) + L.label(52, 280, ctx.t({ cs: 'PŘED prvním rozjezdem!', en: 'BEFORE moving the car!' }), { anchor: 'start', bg: true, cls: 'k-danger' });
      return L.svg(s, ctx.t({ cs: 'Napumpování brzdového pedálu', en: 'Pumping up the brake pedal' }));
    }
  });

  /* ---------------------------------------------------- 12. bedding */
  A.register('brake.bedding', {
    render: function (ctx) {
      var dashes = '';
      for (var i = 0; i < 10; i++) dashes += '<rect class="k-white" x="' + (i * 60) + '" y="282" width="30" height="4" opacity=".7"/>';
      var s = '<rect class="k-dark" x="0" y="259" width="480" height="41" opacity=".85"/>' +
        '<g class="brake-road">' + dashes + '</g>' +
        '<g transform="translate(70,24) scale(.95)">' + L.car(0, 230, { spinCls: 'spin-cw' }) + '</g>' +
        '<circle class="k-danger brake-hot" cx="304" cy="231" r="22"/><circle class="k-danger brake-hot" cx="127" cy="231" r="22"/>' +
        // speed bar
        '<rect class="k-labelbg s-line" stroke-width="1" x="300" y="56" width="164" height="54" rx="8"/>' +
        '<rect class="k-ok brake-speedbar" x="312" y="86" width="140" height="12" rx="6"/>' +
        '<text x="312" y="78" font-size="13" font-weight="800" class="k-text">80 → 30 km/h</text>' +
        title(ctx, '8–10× brzdit z ~80 na ~30 km/h, nezastavit', 'Brake 8–10× from ~80 to ~30 km/h, do not stop') +
        L.label(16, 50, ctx.t({ cs: 'Pak jet bez brzdění – vychladnout', en: 'Then drive without braking – cool down' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Zajetí nových brzd', en: 'Bedding in new brakes' }));
    }
  });

  /* ---------------------------------------------------- 13. drum-in-hat parking brake */
  A.register('brake.drumInHat', {
    render: function (ctx) {
      var cx = 230, cy = 160;
      var s = '<circle class="k-metal2 s-line" stroke-width="2" cx="' + cx + '" cy="' + cy + '" r="118"/>' +
        '<circle class="k-dark" cx="' + cx + '" cy="' + cy + '" r="96" opacity=".25"/>' +
        '<circle class="k-metal" cx="' + cx + '" cy="' + cy + '" r="40"/><circle class="k-dark" cx="' + cx + '" cy="' + cy + '" r="14"/>' +
        '<g class="brake-shoeL"><path class="k-metal s-dark" stroke-width="1.5" d="' + seg(cx, cy, 78, 92, 110, 250) + '"/><path class="k-filler" d="' + seg(cx, cy, 88, 94, 115, 245) + '"/></g>' +
        '<g class="brake-shoeR"><path class="k-metal s-dark" stroke-width="1.5" d="' + seg(cx, cy, 78, 92, -70, 70) + '"/><path class="k-filler" d="' + seg(cx, cy, 88, 94, -65, 65) + '"/></g>' +
        '<rect class="k-dark" x="' + (cx - 40) + '" y="' + (cy + 80) + '" width="80" height="8" rx="3"/>' +
        '<g transform="translate(' + cx + ',' + (cy + 84) + ')"><g class="brake-adj"><circle class="k-accent s-dark" stroke-width="1" r="11"/>' +
        '<path class="k-none s-dark" stroke-width="2" d="M0,-11 v22 M-11,0 h22 M-8,-8 l16,16 M8,-8 l-16,16"/></g></g>' +
        L.rotArrow(cx, cy + 84, 20, 'ccw', 'accent', 200) +
        title(ctx, 'Kotouč nejde dolů? Čelisti stáhnout seřizovačem', 'Disc stuck? Back off the shoes with the adjuster') +
        L.label(16, 286, ctx.t({ cs: 'Parkovací brzda musí být uvolněná', en: 'Parking brake must be released' }), { anchor: 'start', bg: true, size: 12 });
      return L.svg(s, ctx.t({ cs: 'Bubnová parkovací brzda v kotouči', en: 'Drum-in-hat parking brake' }));
    }
  });
})(window.STU);
