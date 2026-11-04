/* STUMechanic – core namespace, registries and i18n helpers.
 * Classic script (no ES modules) so the app also works when index.html
 * is opened directly from disk (file://).
 */
window.STU = (function () {
  'use strict';

  var S = {
    lang: 'cs',
    tutorials: [],
    tutorialMap: {},
    vehicles: [],
    vehicleMap: {},
    anims: {},
    strings: {}
  };

  /* ---------- registries ---------- */
  S.registerTutorial = function (t) {
    if (S.tutorialMap[t.id]) throw new Error('Duplicate tutorial id ' + t.id);
    S.tutorials.push(t);
    S.tutorialMap[t.id] = t;
  };

  S.registerVehicle = function (v) {
    S.vehicles.push(v);
    S.vehicleMap[v.id] = v;
  };

  /* ---------- animations ---------- */
  var injectedCss = {};
  S.anim = {
    /** Register an animation. def = { render(ctx) -> svg string } */
    register: function (id, def) {
      if (S.anims[id]) throw new Error('Duplicate animation id ' + id);
      S.anims[id] = def;
    },
    /** Inject a CSS block once (keyframes for an animation file). */
    css: function (key, text) {
      if (injectedCss[key]) return;
      injectedCss[key] = true;
      var st = document.createElement('style');
      st.setAttribute('data-anim', key);
      st.textContent = text;
      document.head.appendChild(st);
    }
  };

  /* ---------- i18n ---------- */
  /** Translate a localized value: string | {cs, en}. */
  S.t = function (v) {
    if (v == null) return '';
    if (typeof v === 'string' || typeof v === 'number') return String(v);
    if (v[S.lang] != null) return v[S.lang];
    return v.cs != null ? v.cs : (v.en != null ? v.en : '');
  };

  /** UI string by key from S.strings. */
  S.ui = function (key) {
    var e = S.strings[key];
    if (!e) return key;
    return S.t(e);
  };

  /* ---------- text helpers ---------- */
  S.esc = function (s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  /** Minimal markup: paragraphs (blank line), "- " lists, "1. " lists, **bold**. */
  S.md = function (src) {
    var text = S.t(src);
    if (!text) return '';
    var blocks = text.split(/\n\s*\n/);
    return blocks.map(function (b) {
      var lines = b.split('\n');
      var inline = function (l) {
        return S.esc(l).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      };
      if (lines.every(function (l) { return /^\s*-\s+/.test(l); })) {
        return '<ul>' + lines.map(function (l) {
          return '<li>' + inline(l.replace(/^\s*-\s+/, '')) + '</li>';
        }).join('') + '</ul>';
      }
      if (lines.every(function (l) { return /^\s*\d+\.\s+/.test(l); })) {
        return '<ol>' + lines.map(function (l) {
          return '<li>' + inline(l.replace(/^\s*\d+\.\s+/, '')) + '</li>';
        }).join('') + '</ol>';
      }
      return '<p>' + lines.map(inline).join('<br>') + '</p>';
    }).join('');
  };

  /* ---------- storage (never throws) ---------- */
  S.store = {
    get: function (k, def) {
      try {
        var v = localStorage.getItem('stu.' + k);
        return v == null ? def : JSON.parse(v);
      } catch (e) { return def; }
    },
    set: function (k, v) {
      try { localStorage.setItem('stu.' + k, JSON.stringify(v)); } catch (e) { /* ignore */ }
    }
  };

  return S;
})();
