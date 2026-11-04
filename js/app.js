/* STUMechanic – application: routing, rendering, vehicle-specific merging. */
(function (S) {
  'use strict';
  var t = S.t, ui = S.ui, esc = S.esc, md = S.md;
  var app = document.getElementById('app');
  var uidCounter = 0;

  /* ------------------------------------------------------------------ state */
  S.lang = S.store.get('lang', (navigator.language || 'cs').toLowerCase().indexOf('cs') === 0 || (navigator.language || '').toLowerCase().indexOf('sk') === 0 ? 'cs' : 'en');
  function vehicleId() {
    var v = S.store.get('vehicle', 'generic');
    return S.vehicleMap[v] ? v : 'generic';
  }
  function setVehicle(id) { S.store.set('vehicle', id); render(); }
  function setLang(l) { S.lang = l; S.store.set('lang', l); document.documentElement.lang = l; render(); }

  /* --------------------------------------------------------------- helpers */
  var ICONS = {
    danger: '<svg class="ico" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2 1 21h22L12 2zm0 4.2L19.5 19h-15L12 6.2zM11 10v5h2v-5h-2zm0 6v2h2v-2h-2z"/></svg>',
    warning: '<svg class="ico" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2 1 21h22L12 2zm-1 7h2v6h-2V9zm0 7h2v2h-2v-2z"/></svg>',
    caution: '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path fill="currentColor" d="M11 6h2v8h-2zM11 16h2v2h-2z"/></svg>',
    info: '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path fill="currentColor" d="M11 10h2v8h-2zM11 6h2v2h-2z"/></svg>',
    tip: '<svg class="ico" viewBox="0 0 24 24"><path fill="currentColor" d="M9 21h6v-1H9v1zm3-19a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2zm2.8 11.3-.8.6V16h-4v-2.1l-.8-.6A5 5 0 1 1 14.8 13.3z"/></svg>'
  };
  var NAV_ICONS = {
    home: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/></svg>',
    car: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11a2 2 0 0 1 2 2v4h-2v2h-3v-2H8v2H5v-2H3v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3.4a.9.9 0 0 0-.8-.6H9.1a.9.9 0 0 0-.8.6L7.2 11zM6.5 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>',
    info: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
    pulse: '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M2 12h4l2.5-6 4 13 3-9 1.5 2H22"/></svg>'
  };

  function verifyBadge() {
    return ' <span class="verify" title="' + esc(ui('verifyTitle')) + '">⚠ ' + esc(ui('verify')) + '</span>';
  }

  function vtag(vid) {
    var v = S.vehicleMap[vid];
    if (!v || vid === 'generic') return '';
    return '<span class="vtag" style="--c:' + v.color + '"><span class="dot"></span>' + esc(t(v.short)) + '</span>';
  }

  /** note = { level, text, verify?, vehicle? } */
  function callout(note) {
    var lvl = note.level || 'info';
    return '<div class="callout ' + lvl + '" role="' + (lvl === 'danger' || lvl === 'warning' ? 'alert' : 'note') + '">' +
      '<div style="color:var(--' + lvl + ')">' + (ICONS[lvl] || ICONS.info) + '</div>' +
      '<div><div class="lbl">' + esc(ui(lvl)) + (note.vehicle ? ' ' + vtag(note.vehicle) : '') + (note.verify ? verifyBadge() : '') + '</div>' +
      '<div class="body">' + md(note.text) + '</div></div></div>';
  }

  var ORDER = { danger: 0, warning: 1, caution: 2, info: 3, tip: 4 };
  function sortNotes(notes) {
    return notes.slice().sort(function (a, b) { var oa = a.level in ORDER ? ORDER[a.level] : 9, ob = b.level in ORDER ? ORDER[b.level] : 9; return oa - ob; });
  }

  function specValue(sp) {
    return esc(t(sp.value)) + (sp.verify ? verifyBadge() : '');
  }

  function levelPill(level) {
    return '<span class="pill lvl' + level + '"><span class="wrenches">' + '🔧'.repeat(level) + '</span> ' + esc(ui('level' + level)) + '</span>';
  }

  function statusPill(status) {
    var map = { ok: 'statusOk', caution: 'statusCaution', pro: 'statusPro' };
    return '<span class="pill st-' + status + '" title="' + esc(ui('statusHint')) + '">' +
      (status === 'ok' ? '✔' : status === 'caution' ? '⚠' : '🏭') + ' ' + esc(ui(map[status] || 'statusOk')) + '</span>';
  }

  /* ---------------------------------------- vehicle-specific merging logic */
  function tagNotes(list, vid) {
    return (list || []).map(function (n) { var c = Object.assign({}, n); c.vehicle = vid; return c; });
  }

  /** Merge a tutorial with the overrides for one vehicle. */
  function resolve(tut, vid) {
    var vo = (tut.vehicles && tut.vehicles[vid]) || {};
    var isGeneric = vid === 'generic';
    var steps = [];
    tut.steps.forEach(function (s) {
      var o = (vo.steps && vo.steps[s.id]) || {};
      if (!o.skip) {
        steps.push({
          id: s.id,
          title: o.title || s.title,
          body: s.body,
          vbody: o.body || null,
          anim: o.anim || s.anim,
          notes: sortNotes((s.notes || []).concat(tagNotes(o.notes, vid))),
          specs: o.specs || s.specs || null,
          vehicleOnly: null
        });
      }
    });
    (vo.extraSteps || []).forEach(function (x) {
      var idx = steps.findIndex(function (s) { return s.id === x.after; });
      var st = x.step;
      var ns = {
        id: st.id, title: st.title, body: st.body, vbody: null, anim: st.anim,
        notes: sortNotes(tagNotes(st.notes, vid)), specs: st.specs || null, vehicleOnly: vid
      };
      if (idx < 0) steps.push(ns); else steps.splice(idx + 1, 0, ns);
    });
    return {
      tut: tut,
      vid: vid,
      status: vo.status || tut.status || 'ok',
      specs: vo.specs || [],
      notes: sortNotes(tagNotes(vo.notes, vid)),
      safety: sortNotes((vo.replaceSafety ? [] : (tut.safety || [])).concat(tagNotes(vo.safety, vid))),
      title: vo.title || tut.title,
      time: vo.time || tut.time,
      intro: vo.intro || tut.intro || tut.summary,
      tools: (vo.replaceTools ? [] : (tut.tools || []).map(function (x) { return { text: x }; })).concat((vo.tools || []).map(function (x) { return { text: x, vehicle: vid }; })),
      parts: vo.parts ? vo.parts.map(function (x) { return { text: x, vehicle: vid }; }) : (tut.parts || []).map(function (x) { return { text: x }; }),
      finalChecks: (vo.replaceFinalChecks ? [] : (tut.finalChecks || []).map(function (x) { return { text: x }; })).concat((vo.finalChecks || []).map(function (x) { return { text: x, vehicle: vid }; })),
      steps: steps,
      isGeneric: isGeneric
    };
  }
  S.resolveTutorial = resolve;

  /* -------------------------------------------------------- animation box */
  function animBox(animId, opts) {
    opts = opts || {};
    return '<figure class="anim-box' + (opts.cls ? ' ' + opts.cls : '') + '" data-anim="' + esc(animId || '') + '"' + (opts.controls === false ? ' data-nocontrols="1"' : '') + '>' +
      '<div class="stage"></div>' +
      (opts.controls === false ? '' :
        '<div class="controls"><span class="lbl">▶ ' + esc(ui('animation')) + '</span>' +
        '<button class="btn small" data-act="toggle">⏸ ' + esc(ui('pause')) + '</button>' +
        '<button class="btn small" data-act="slow">🐢 ' + esc(ui('slow')) + '</button>' +
        '<button class="btn small" data-act="replay">↺ ' + esc(ui('replay')) + '</button>' +
        '<button class="btn small only3d" data-act="view">⟲ ' + esc(ui('resetView')) + '</button>' +
        '<button class="btn small" data-act="mode">' + esc(ui('modeSwitch')) + '</button></div>') +
      '</figure>';
  }

  var use3d = function () { return !!(S.three && S.three.enabled && S.three.enabled()); };

  function drawSvg(box, id, stage) {
    var def = S.anims[id];
    if (!def) return false;
    try {
      stage.innerHTML = def.render({ t: t, vehicle: vehicleId(), uid: 'a' + (++uidCounter), lang: S.lang });
      return true;
    } catch (e) {
      console.error('Animation ' + id + ' failed', e);
      return false;
    }
  }

  function drawAnim(box) {
    var id = box.getAttribute('data-anim');
    var stage = box.querySelector('.stage');
    var is3d = use3d() && S.scenes && S.scenes[id];
    if (box._viewer) { box._viewer.destroy(); box._viewer = null; }
    box._paused = false;
    box._slow = false;
    box.classList.toggle('is3d', !!is3d);
    stage.classList.remove('stage3d');
    if (is3d && box.classList.contains('thumbbox')) {
      // still image for cards: show the 2D version instantly, swap to the 3D render when ready
      drawSvg(box, id, stage);
      var img = document.createElement('img');
      img.className = 'thumb3d'; img.alt = '';
      img.onload = function () { img.classList.add('ok'); };
      stage.appendChild(img);
      S.three.thumb(img, id, vehicleId());
      return;
    }
    if (is3d) {
      try {
        box._viewer = S.three.mount(box, id, vehicleId(), { noHint: box.hasAttribute('data-nocontrols') });
        return;
      } catch (e) {
        console.error('3D scene ' + id + ' failed, falling back to 2D', e);
        box.classList.remove('is3d');
      }
    }
    if (!drawSvg(box, id, stage)) {
      stage.innerHTML = '<div class="noanim">' + esc(ui('noAnim')) + '</div>';
      var c = box.querySelector('.controls');
      if (c) c.style.display = 'none';
    }
  }

  function animsOf(box) {
    var svg = box.querySelector('svg');
    if (!svg || !svg.getAnimations) return [];
    try { return svg.getAnimations({ subtree: true }); } catch (e) { return []; }
  }

  function mountAnims(root) {
    root.querySelectorAll('.anim-box').forEach(function (box) {
      drawAnim(box);
      box.addEventListener('click', function (ev) {
        var b = ev.target.closest('button[data-act]');
        if (!b) return;
        var act = b.getAttribute('data-act');
        var v = box._viewer;
        var tb = box.querySelector('[data-act=toggle]'), sb = box.querySelector('[data-act=slow]');
        if (act === 'mode') {
          S.store.set('mode3d', !use3d());
          drawAnim(box);
          tb.innerHTML = '⏸ ' + esc(ui('pause'));
          sb.innerHTML = '🐢 ' + esc(ui('slow'));
          return;
        }
        if (act === 'view') { if (v) v.resetView(); return; }
        if (act === 'replay') {
          if (v) v.replay(); else drawAnim(box);
          box._paused = false; box._slow = false;
          if (v && v.rate !== 1) v.toggleSlow();
          tb.innerHTML = '⏸ ' + esc(ui('pause'));
          sb.innerHTML = '🐢 ' + esc(ui('slow'));
          box.classList.add('force-motion');
        } else if (act === 'toggle') {
          box._paused = v ? v.togglePause() : !box._paused;
          box.classList.add('force-motion');
          if (!v) animsOf(box).forEach(function (a) { if (box._paused) a.pause(); else a.play(); });
          b.innerHTML = box._paused ? '▶ ' + esc(ui('play')) : '⏸ ' + esc(ui('pause'));
        } else if (act === 'slow') {
          box._slow = v ? v.toggleSlow() : !box._slow;
          if (!v) animsOf(box).forEach(function (a) { a.playbackRate = box._slow ? 0.4 : 1; });
          b.innerHTML = box._slow ? '🐇 ' + esc(ui('normalSpeed')) : '🐢 ' + esc(ui('slow'));
        }
      });
    });
  }

  /* --------------------------------------------------------- chrome / nav */
  function header(route) {
    var vid = vehicleId();
    var navItem = function (href, key, icon, active) {
      return '<a href="' + href + '" class="' + (active ? 'active' : '') + '">' + (icon ? NAV_ICONS[icon] : '') + '<span>' + esc(ui(key)) + '</span></a>';
    };
    var top = '<header class="topbar">' +
      '<a class="brand" href="#/"><img src="assets/icon.svg" alt=""><span>STUMechanic</span></a>' +
      '<span class="spacer"></span>' +
      '<nav>' + navItem('#/', 'home', null, route === 'home') + navItem('#/s', 'symptoms', null, route === 'symptoms') + navItem('#/v', 'vehicles', null, route === 'vehicles') + navItem('#/about', 'about', null, route === 'about') + '</nav>' +
      '<div class="lang-toggle" role="group" aria-label="' + esc(ui('language')) + '">' +
      '<button data-lang="cs" class="' + (S.lang === 'cs' ? 'on' : '') + '">CZ</button>' +
      '<button data-lang="en" class="' + (S.lang === 'en' ? 'on' : '') + '">EN</button></div>' +
      '</header>';
    var bar = '<div class="vehicle-bar" role="radiogroup" aria-label="' + esc(ui('chooseVehicle')) + '">' +
      S.vehicles.map(function (v) {
        return '<button class="vchip' + (v.id === vid ? ' on' : '') + '" role="radio" aria-checked="' + (v.id === vid) + '" data-vehicle="' + v.id + '" style="--c:' + v.color + '">' +
          '<span class="dot"></span>' + esc(t(v.id === 'generic' ? v.name : v.short)) + '</button>';
      }).join('') + '</div>';
    var bottom = '<nav class="bottomnav">' + navItem('#/', 'home', 'home', route === 'home') + navItem('#/s', 'symptoms', 'pulse', route === 'symptoms') + navItem('#/v', 'vehicles', 'car', route === 'vehicles') + navItem('#/about', 'about', 'info', route === 'about') + '</nav>';
    return top + bar + bottom;
  }

  /* ---------------------------------------------------------------- views */
  /** Car-specific tutorials (tut.only = [vehicleIds]) are listed only for those cars (all are listed for the generic vehicle). */
  function appliesTo(tut, vid) { return !tut.only || vid === 'generic' || tut.only.indexOf(vid) >= 0; }

  function viewHome() {
    var vid = vehicleId();
    var v = S.vehicleMap[vid];
    var h = '<section class="hero"><div><h1>' + esc(ui('appName')) + '</h1><p class="muted">' + esc(ui('tagline')) + '</p>' +
      '<div class="card"><div class="small muted">' + esc(ui('yourVehicle')) + '</div><h2 style="margin:.2em 0">' + esc(t(v.name)) + '</h2>' +
      '<div class="small muted">' + esc(t(v.sub)) + '</div>' +
      (vid !== 'generic' ? '<div style="margin-top:10px"><a class="btn small" href="#/v/' + vid + '">' + esc(ui('vehicleDetail')) + ' →</a></div>' : '<p class="small muted" style="margin:.6em 0 0">' + esc(ui('vehicleHint')) + '</p>') +
      '</div></div>' + animBox('lift.hero', { controls: false }) + '</section>';

    h += '<a class="card symcta" href="#/s"><span class="symcta-ico">' + NAV_ICONS.pulse + '</span><span><b>' + esc(ui('symptomsTitle')) + '</b><br><span class="muted small">' + esc(ui('symptomsCta')) + '</span></span></a>';
    h += callout({ level: 'warning', text: ui('disclaimer') });
    h += '<div class="search"><input type="search" id="q" placeholder="🔍 ' + esc(ui('search')) + '" aria-label="' + esc(ui('search')) + '" autocomplete="off"></div>';

    [1, 2, 3].forEach(function (lvl) {
      var list = S.tutorials.filter(function (x) { return x.level === lvl && appliesTo(x, vid); });
      h += '<section class="section lvl-section"><div class="section-head"><h2>' + levelPill(lvl) + '</h2><span class="muted small">' + esc(ui('level' + lvl + 'd')) + '</span></div>';
      if (!list.length) {
        h += '<p class="muted">' + esc(ui('comingSoon')) + '</p>';
      } else {
        h += '<div class="grid cols">' + list.map(function (tut) {
          var r = resolve(tut, vid);
          var hay = [t(r.title), t(tut.summary), t(tut.title)].join(' ').toLowerCase();
          return '<a class="card tcard" href="#/t/' + tut.id + '" data-search="' + esc(hay) + '">' +
            '<div class="thumb">' + animBox(tut.thumb || (tut.steps[0] && tut.steps[0].anim), { controls: false, cls: 'thumbbox' }) + '</div>' +
            '<h3>' + esc(t(r.title)) + (tut.only ? ' ' + tut.only.map(vtag).join(' ') : '') + '</h3><p>' + esc(t((tut.vehicles && tut.vehicles[vid] && tut.vehicles[vid].summary) || tut.summary)) + '</p>' +
            '<div class="meta"><span class="pill">⏱ ' + esc(t(r.time)) + '</span><span class="pill">' + r.steps.length + ' ' + esc(ui('steps').toLowerCase()) + '</span>' +
            (vid !== 'generic' ? statusPill(r.status) : '') + '</div></a>';
        }).join('') + '</div>';
      }
      h += '</section>';
    });
    return h;
  }

  function checklist(items, key) {
    var state = S.store.get('chk.' + key, {});
    return '<ul class="checklist" data-key="' + esc(key) + '">' + items.map(function (it, i) {
      var id = 'c' + i + '-' + (it.vehicle || 'g');
      return '<li><label><input type="checkbox" data-id="' + id + '"' + (state[id] ? ' checked' : '') + '><span>' + esc(t(it.text)) +
        (it.vehicle ? vtag(it.vehicle) : '') + '</span></label></li>';
    }).join('') + '</ul>';
  }

  function progressOf(tid, vid) { return S.store.get('prog.' + tid + '.' + vid, {}); }

  function viewTutorial(tid) {
    var tut = S.tutorialMap[tid];
    if (!tut) return viewNotFound();
    var vid = vehicleId();
    var r = resolve(tut, vid);
    var prog = progressOf(tid, vid);
    var doneCount = r.steps.filter(function (s) { return prog[s.id]; }).length;

    var h = '<div class="crumbs"><a href="#/">' + esc(ui('allTutorials')) + '</a> › ' + esc(ui('level' + tut.level)) + '</div>';
    h += '<div class="t-head"><h1>' + esc(t(r.title)) + '</h1>' +
      '<div class="meta">' + levelPill(tut.level) + '<span class="pill">⏱ ' + esc(t(r.time)) + '</span><span class="pill">' + r.steps.length + ' ' + esc(ui('steps').toLowerCase()) + '</span>' +
      (vid !== 'generic' ? statusPill(r.status) + ' ' + vtag(vid) : '') + '</div>' +
      '<div>' + md(r.intro) + '</div></div>';

    if (tut.only && tut.only.indexOf(vid) < 0) {
      h += callout({ level: 'info', text: ui('onlyForNote') + ' ' + tut.only.map(function (id) { return t(S.vehicleMap[id].name); }).join(', ') + '.' });
    }
    h += '<div class="row" style="margin-bottom:18px"><a class="btn primary big" href="#/t/' + tid + '/0">▶ ' + esc(doneCount ? ui('continue') : ui('start')) + '</a>' +
      (doneCount ? '<span class="muted small">' + esc(ui('progress')) + ': ' + doneCount + ' / ' + r.steps.length + '</span> <button class="btn small" data-reset="' + tid + '">' + esc(ui('resetProgress')) + '</button>' : '') + '</div>';

    // vehicle block
    if (r.isGeneric) {
      h += callout({ level: 'info', text: ui('genericSpecsHint') });
    } else if (r.specs.length || r.notes.length) {
      h += '<section class="section card"><h2>' + esc(ui('vehicleSpecs')) + ' – ' + esc(t(S.vehicleMap[vid].name)) + '</h2>';
      if (r.specs.length) {
        h += '<table class="specs"><tbody>' + r.specs.map(function (sp) {
          return '<tr><th>' + esc(t(sp.label)) + '</th><td>' + specValue(sp) + '</td></tr>';
        }).join('') + '</tbody></table>';
      }
      if (r.notes.length) h += '<h3 style="margin-top:14px">' + esc(ui('vehicleNotes')) + '</h3>' + r.notes.map(callout).join('');
      h += '</section>';
    }

    // safety
    h += '<section class="section"><h2>⚠ ' + esc(ui('safetyFirst')) + '</h2>' + r.safety.map(callout).join('') + '</section>';

    // tools + parts
    h += '<section class="section two"><div class="card"><h2>🔧 ' + esc(ui('toolsNeeded')) + '</h2><p class="small muted">' + esc(ui('checklistHint')) + '</p>' +
      checklist(r.tools, 'tools.' + tid + '.' + vid) + '</div>' +
      '<div class="card"><h2>📦 ' + esc(ui('partsNeeded')) + '</h2><p class="small muted">' + esc(ui('checklistHint')) + '</p>' + checklist(r.parts, 'parts.' + tid + '.' + vid) + '</div></section>';

    // symptoms that point to this tutorial (reverse links of the symptom guide)
    var rel = S.symptoms.filter(function (sm) { return (sm.causes || []).some(function (c) { return (c.tutorials || []).indexOf(tid) >= 0; }); });
    if (rel.length) {
      h += '<section class="section card"><h2>🩺 ' + esc(ui('relatedSymptoms')) + '</h2><div class="symchips">' + rel.map(function (sm) {
        return '<a class="symchip sev-b-' + (sm.severity || 'watch') + '" href="#/s/' + encodeURIComponent(sm.id) + '">' + esc(t(sm.title)) + '</a>';
      }).join('') + '</div></section>';
    }

    // steps list
    h += '<section class="section card"><h2>' + esc(ui('stepsList')) + '</h2><p class="small muted">' + esc(ui('clickToJump')) + '</p><ol class="steplist">' +
      r.steps.map(function (s, i) {
        var flags = {};
        s.notes.forEach(function (n) { if (n.level === 'danger' || n.level === 'warning' || n.level === 'caution') flags[n.level] = 1; });
        return '<li class="' + (prog[s.id] ? 'done' : '') + '"><a href="#/t/' + tid + '/' + (i + 1) + '"><span class="num">' + (prog[s.id] ? '✓' : (i + 1)) + '</span>' +
          '<span>' + esc(t(s.title)) + (s.vehicleOnly ? ' ' + vtag(s.vehicleOnly) : '') + '</span><span class="flags">' +
          Object.keys(flags).map(function (f) { return '<i class="flag ' + f + '" title="' + esc(ui(f)) + '"></i>'; }).join('') + '</span></a></li>';
      }).join('') + '</ol></section>';
    return h;
  }

  function viewStep(tid, n) {
    var tut = S.tutorialMap[tid];
    if (!tut) return viewNotFound();
    var vid = vehicleId();
    var r = resolve(tut, vid);
    var total = r.steps.length;
    n = Math.max(0, Math.min(total + 1, n));
    var prog = progressOf(tid, vid);
    var pct = Math.round((n / (total + 1)) * 100);
    var head = '<div class="crumbs"><a href="#/t/' + tid + '">← ' + esc(t(r.title)) + '</a></div>' +
      '<div class="progress" style="margin:10px 0 16px"><i style="width:' + pct + '%"></i></div>';
    var nav = function (prevHref, nextHref, nextLabel) {
      return '<div class="stepnav">' +
        (prevHref ? '<a class="btn big" href="' + prevHref + '">← ' + esc(ui('prev')) + '</a>' : '<a class="btn big" href="#/t/' + tid + '">← ' + esc(ui('overview')) + '</a>') +
        (nextHref ? '<a class="btn primary big" href="' + nextHref + '">' + esc(nextLabel || ui('next')) + ' →</a>' : '') + '</div>';
    };

    if (n === 0) {
      return head + '<div class="stepcount">' + esc(ui('safetyFirst')) + '</div><h1>⚠ ' + esc(ui('safetyFirst')) + '</h1><p>' + esc(ui('safetyIntro')) + '</p>' +
        r.safety.map(callout).join('') + (r.isGeneric ? '' : r.notes.map(callout).join('')) +
        nav(null, '#/t/' + tid + '/1');
    }
    if (n === total + 1) {
      return head + '<h1>✅ ' + esc(ui('finishedTitle')) + '</h1><p>' + esc(ui('finishedText')) + '</p>' +
        '<div class="card"><h2>' + esc(ui('finalChecks')) + '</h2>' + checklist(r.finalChecks, 'final.' + tid + '.' + vid) + '</div>' +
        nav('#/t/' + tid + '/' + total, '#/t/' + tid, ui('finish'));
    }
    var s = r.steps[n - 1];
    var specs = '';
    if (s.specs && s.specs.length) {
      specs = '<div class="stepspecs">' + s.specs.map(function (sp) {
        return '<div class="stepspec">' + esc(t(sp.label)) + ': <b>' + esc(t(sp.value)) + '</b>' + (sp.verify ? verifyBadge() : '') + '</div>';
      }).join('') + '</div>';
    }
    var body = md(s.body) + (s.vbody ? '<div class="callout info"><div style="color:var(--info)">' + ICONS.info + '</div><div><div class="lbl">' +
      esc(ui('forThisCar')) + ' ' + vtag(vid) + '</div><div class="body">' + md(s.vbody) + '</div></div></div>' : '');
    return head +
      '<div class="stepview"><div class="anim-col">' + animBox(s.anim) + '</div><div>' +
      '<div class="stepcount">' + esc(ui('step')) + ' ' + n + ' ' + esc(ui('of')) + ' ' + total + (s.vehicleOnly ? ' · ' + esc(ui('onlyThisCar')) + ' ' + vtag(s.vehicleOnly) : '') + '</div>' +
      '<h1>' + esc(t(s.title)) + '</h1>' + specs + body + s.notes.map(callout).join('') +
      '<label class="donebox"><input type="checkbox" data-done="' + esc(s.id) + '"' + (prog[s.id] ? ' checked' : '') + '> ' + esc(ui('markDone')) + '</label>' +
      nav('#/t/' + tid + '/' + (n - 1), '#/t/' + tid + '/' + (n + 1), n === total ? ui('finalChecks') : null) +
      '</div></div>';
  }

  function viewVehicles() {
    var vid = vehicleId();
    return '<h1>' + esc(ui('vehicles')) + '</h1><p class="muted">' + esc(ui('vehicleHint')) + '</p><div class="grid cols">' +
      S.vehicles.map(function (v) {
        return '<div class="card vcard" style="--c:' + v.color + '"><div class="top"><span class="swatch"></span><div><h3>' + esc(t(v.name)) + '</h3><div class="small muted">' + esc(t(v.sub)) + '</div></div></div>' +
          '<div class="row">' + (v.id === vid ? '<span class="pill st-ok">✔ ' + esc(ui('selected')) + '</span>' : '<button class="btn small" data-vehicle="' + v.id + '">' + esc(ui('selectThis')) + '</button>') +
          (v.id !== 'generic' ? '<a class="btn small" href="#/v/' + v.id + '">' + esc(ui('vehicleDetail')) + ' →</a>' : '') + '</div></div>';
      }).join('') + '</div>';
  }

  function viewVehicle(id) {
    var v = S.vehicleMap[id];
    if (!v) return viewNotFound();
    var h = '<div class="crumbs"><a href="#/v">← ' + esc(ui('vehicles')) + '</a></div><h1>' + esc(t(v.name)) + '</h1><p class="muted">' + esc(t(v.sub)) + '</p>';
    if (vehicleId() !== id) h += '<p><button class="btn primary" data-vehicle="' + id + '">' + esc(ui('selectThis')) + '</button></p>';
    if (v.facts.length) {
      h += '<section class="section card"><h2>' + esc(ui('keyFacts')) + '</h2><table class="specs"><tbody>' + v.facts.map(function (sp) {
        return '<tr><th>' + esc(t(sp.label)) + '</th><td>' + specValue(sp) + '</td></tr>';
      }).join('') + '</tbody></table></section>';
    }
    h += '<section class="section"><h2>' + esc(ui('quirks')) + '</h2>' + sortNotes(v.quirks).map(callout).join('') + '</section>';
    if (id !== 'generic') {
      h += '<section class="section card"><h2>' + esc(ui('allTutorials')) + '</h2><ol class="steplist">' + S.tutorials.filter(function (tut) { return appliesTo(tut, id); }).map(function (tut, i) {
        var r = resolve(tut, id);
        return '<li><a href="#/t/' + tut.id + '" data-vehicle-go="' + id + '"><span class="num">' + tut.level + '</span><span>' + esc(t(r.title)) + '</span>' + statusPill(r.status) + '</a></li>';
      }).join('') + '</ol></section>';
    }
    return h;
  }

  /* ------------------------------------------------------- symptom guide */
  var SEV = { stop: { key: 'sevStop', ico: '🛑' }, soon: { key: 'sevSoon', ico: '⚠️' }, watch: { key: 'sevWatch', ico: '👁' } };
  var LIKE = { common: { key: 'likeCommon', n: 0 }, possible: { key: 'likePossible', n: 1 }, rare: { key: 'likeRare', n: 2 } };
  function sevPill(sev) {
    var d = SEV[sev] || SEV.watch;
    return '<span class="pill sev sev-' + (sev || 'watch') + '" title="' + esc(ui(d.key + 'D')) + '">' + d.ico + ' ' + esc(ui(d.key)) + '</span>';
  }
  /** onlyFor / notFor on a symptom or cause: hide what cannot happen on the selected car (generic shows all). */
  function fits(x, vid) {
    if (vid === 'generic') return true;
    if (x.onlyFor && x.onlyFor.indexOf(vid) < 0) return false;
    if (x.notFor && x.notFor.indexOf(vid) >= 0) return false;
    return true;
  }
  function tutLink(id) {
    var tut = S.tutorialMap[id];
    if (!tut) return '';
    var r = resolve(tut, vehicleId());
    return '<a class="tutlink" href="#/t/' + id + '">' + levelPill(tut.level) + '<span>' + esc(t(r.title)) + '</span><span class="go">→</span></a>';
  }

  function viewSymptoms() {
    var h = '<h1>' + esc(ui('symptomsTitle')) + '</h1><p class="muted">' + esc(ui('symptomsIntro')) + '</p>' +
      callout({ level: 'info', text: ui('symptomDisclaimer') }) +
      '<div class="search"><input type="search" id="qs" placeholder="🔍 ' + esc(ui('symptomsSearch')) + '" autocomplete="off"></div>' +
      '<nav class="symjump">' + S.symptomGroups.map(function (g) { return '<a href="#" data-jump="g-' + g.id + '">' + (g.icon || '') + ' ' + esc(t(g.title)) + '</a>'; }).join('') + '</nav>';
    S.symptomGroups.forEach(function (g) {
      var vidS = vehicleId();
      var list = S.symptoms.filter(function (sm) { return sm.group === g.id && fits(sm, vidS); });
      if (!list.length) return;
      h += '<section class="section sym-section" id="g-' + g.id + '"><div class="section-head"><h2>' + (g.icon || '') + ' ' + esc(t(g.title)) + '</h2>' +
        (g.intro ? '<span class="muted small">' + esc(t(g.intro)) + '</span>' : '') + '</div><div class="grid cols">' +
        list.map(function (sm) {
          var hay = [t(sm.title), t(sm.desc)].concat((sm.causes || []).map(function (c) { return t(c.title); })).join(' ');
          return '<a class="card symcard sev-b-' + (sm.severity || 'watch') + '" href="#/s/' + encodeURIComponent(sm.id) + '" data-search="' + esc(hay.toLowerCase()) + '">' +
            '<div class="row" style="justify-content:space-between"><h3>' + esc(t(sm.title)) + '</h3>' + sevPill(sm.severity) + '</div>' +
            '<p>' + esc(t(sm.desc)) + '</p><div class="small muted">' + (sm.causes || []).length + ' ' + esc(ui('possibleCauses').toLowerCase()) + '</div></a>';
        }).join('') + '</div></section>';
    });
    return h;
  }

  function viewSymptom(id) {
    var sm = S.symptomMap[id];
    if (!sm) return viewNotFound();
    var vid = vehicleId();
    var g = S.symptomGroups.filter(function (x) { return x.id === sm.group; })[0];
    var sev = SEV[sm.severity] || SEV.watch;
    var h = '<div class="crumbs"><a href="#/s">' + esc(ui('symptoms')) + '</a>' + (g ? ' › ' + esc(t(g.title)) : '') + '</div>' +
      '<h1>' + esc(t(sm.title)) + '</h1><div class="meta" style="margin-bottom:10px">' + sevPill(sm.severity) + (vid !== 'generic' ? ' ' + vtag(vid) : '') + '</div>' +
      '<div>' + md(sm.desc) + '</div>' +
      callout({ level: sm.severity === 'stop' ? 'danger' : (sm.severity === 'soon' ? 'warning' : 'info'), text: ui(sev.key + 'D') });
    if (sm.ask && sm.ask.length) {
      h += '<section class="section card"><h2>❓ ' + esc(ui('askYourself')) + '</h2><ul>' + sm.ask.map(function (q) { return '<li>' + esc(t(q)) + '</li>'; }).join('') + '</ul></section>';
    }
    var allCauses = sm.causes || [];
    var causes = allCauses.filter(function (c) { return fits(c, vid); }).sort(function (a, b) { return (LIKE[a.likelihood] || LIKE.possible).n - (LIKE[b.likelihood] || LIKE.possible).n; });
    h += '<section class="section"><h2>' + esc(ui('possibleCauses')) + '</h2><ol class="causes">' + causes.map(function (c) {
      var vnote = c.vehicles && c.vehicles[vid];
      var links = (c.tutorials || []).filter(function (tid) { var tu = S.tutorialMap[tid]; return tu && appliesTo(tu, vid); }).map(tutLink).join('');
      return '<li class="card cause sev-b-' + (c.severity || 'watch') + '"><div class="row" style="justify-content:space-between;align-items:flex-start"><h3>' + esc(t(c.title)) + '</h3>' +
        '<div class="meta"><span class="pill like">' + esc(ui((LIKE[c.likelihood] || LIKE.possible).key)) + '</span>' + sevPill(c.severity) + '</div></div>' +
        '<div>' + md(c.explain) + '</div>' +
        (c.check ? '<div class="checkbox"><b>🔎 ' + esc(ui('howToCheck')) + ':</b>' + md(c.check) + '</div>' : '') +
        (vnote ? callout({ level: 'info', text: vnote, vehicle: vid }) : '') +
        (links ? '<div class="tutlinks"><div class="small muted">' + esc(ui('relatedTutorials')) + '</div>' + links + '</div>' : '') +
        '</li>';
    }).join('') + '</ol>' + (allCauses.length > causes.length ? '<p class="small muted">' + esc(ui('causesHidden')) + ' (' + (allCauses.length - causes.length) + ')</p>' : '') + '</section>' + callout({ level: 'info', text: ui('symptomDisclaimer') });
    return h;
  }

  function viewAbout() {
    var lv = ['danger', 'warning', 'caution', 'info', 'tip'];
    return '<h1>' + esc(ui('about')) + '</h1>' + callout({ level: 'warning', text: ui('disclaimer') }) +
      '<section class="section card"><h2>' + esc(ui('legend')) + '</h2><div class="legend">' +
      lv.map(function (l) { return callout({ level: l, text: ui(l + 'D') }); }).join('') +
      '<div class="row" style="margin-top:6px">' + verifyBadge() + ' <span>' + esc(ui('verifyD')) + '</span></div></div></section>';
  }

  function viewNotFound() {
    return '<h1>404</h1><p>' + esc(ui('notFound')) + '</p><a class="btn" href="#/">' + esc(ui('home')) + '</a>';
  }

  /* --------------------------------------------------------------- router */
  function parse() {
    var p = (location.hash || '#/').replace(/^#\/?/, '').split('/').filter(Boolean);
    if (!p.length) return { name: 'home' };
    if (p[0] === 't' && p[1] && p[2] != null) return { name: 'step', tid: p[1], n: parseInt(p[2], 10) || 0 };
    if (p[0] === 't' && p[1]) return { name: 'tutorial', tid: p[1] };
    if (p[0] === 'v' && p[1]) return { name: 'vehicle', id: p[1] };
    if (p[0] === 'v') return { name: 'vehicles' };
    if (p[0] === 'about') return { name: 'about' };
    if (p[0] === 's' && p[1]) return { name: 'symptom', id: decodeURIComponent(p[1]) };
    if (p[0] === 's') return { name: 'symptoms' };
    return { name: '404' };
  }

  var lastRouteKey = '';
  function render() {
    var r = parse();
    var navKey = r.name === 'vehicle' ? 'vehicles' : (r.name === 'symptom' ? 'symptoms' : r.name);
    var html;
    switch (r.name) {
      case 'home': html = viewHome(); break;
      case 'tutorial': html = viewTutorial(r.tid); break;
      case 'step': html = viewStep(r.tid, r.n); break;
      case 'vehicles': html = viewVehicles(); break;
      case 'vehicle': html = viewVehicle(r.id); break;
      case 'about': html = viewAbout(); break;
      case 'symptoms': html = viewSymptoms(); break;
      case 'symptom': html = viewSymptom(r.id); break;
      default: html = viewNotFound();
    }
    document.getElementById('chrome').innerHTML = header(navKey);
    if (S.three && S.three.destroyAll) { S.three.destroyAll(); S.three.clearThumbQueue(); }
    app.innerHTML = html;
    mountAnims(app);
    var key = location.hash;
    if (key !== lastRouteKey) { window.scrollTo(0, 0); lastRouteKey = key; }
    document.title = 'STUMechanic';
  }

  /* --------------------------------------------------------------- events */
  document.addEventListener('click', function (ev) {
    var jump = ev.target.closest('[data-jump]');
    if (jump) { ev.preventDefault(); var el = document.getElementById(jump.getAttribute('data-jump')); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    var go = ev.target.closest('[data-vehicle-go]');
    if (go) { S.store.set('vehicle', go.getAttribute('data-vehicle-go')); return; }
    var vb = ev.target.closest('[data-vehicle]');
    if (vb) { ev.preventDefault(); setVehicle(vb.getAttribute('data-vehicle')); return; }
    var lb = ev.target.closest('[data-lang]');
    if (lb) { setLang(lb.getAttribute('data-lang')); return; }
    var rb = ev.target.closest('[data-reset]');
    if (rb) { S.store.set('prog.' + rb.getAttribute('data-reset') + '.' + vehicleId(), {}); render(); }
  });

  function norm(x) { return x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  document.addEventListener('input', function (ev) {
    if (ev.target.id === 'qs') {
      var qq = norm(ev.target.value.trim());
      app.querySelectorAll('.sym-section').forEach(function (sec) {
        var any = false;
        sec.querySelectorAll('.symcard').forEach(function (c) {
          var show = !qq || norm(c.getAttribute('data-search')).indexOf(qq) >= 0;
          c.style.display = show ? '' : 'none'; if (show) any = true;
        });
        sec.style.display = any || !qq ? '' : 'none';
      });
      return;
    }
    if (ev.target.id !== 'q') return;
    var q = norm(ev.target.value.trim());
    app.querySelectorAll('.lvl-section').forEach(function (sec) {
      var any = false;
      sec.querySelectorAll('.tcard').forEach(function (c) {
        var show = !q || norm(c.getAttribute('data-search')).indexOf(q) >= 0;
        c.style.display = show ? '' : 'none';
        if (show) any = true;
      });
      sec.style.display = any || !q ? '' : 'none';
    });
  });

  document.addEventListener('change', function (ev) {
    var el = ev.target;
    if (el.matches('.checklist input')) {
      var key = 'chk.' + el.closest('.checklist').getAttribute('data-key');
      var st = S.store.get(key, {});
      st[el.getAttribute('data-id')] = el.checked;
      S.store.set(key, st);
    } else if (el.matches('[data-done]')) {
      var r = parse();
      var pk = 'prog.' + r.tid + '.' + vehicleId();
      var pr = S.store.get(pk, {});
      pr[el.getAttribute('data-done')] = el.checked;
      S.store.set(pk, pr);
    }
  });

  document.addEventListener('keydown', function (ev) {
    var r = parse();
    if (r.name !== 'step' || ev.target.matches('input, textarea')) return;
    if (ev.key === 'ArrowRight') { var nx = app.querySelector('.stepnav .btn.primary'); if (nx) location.hash = nx.getAttribute('href'); }
    if (ev.key === 'ArrowLeft' && r.n > 0) location.hash = '#/t/' + r.tid + '/' + (r.n - 1);
  });

  window.addEventListener('hashchange', render);
  document.documentElement.lang = S.lang;
  render();

  /* ------------------------------------------------------ service worker */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline mode unavailable */ });
    });
  }
})(window.STU);
