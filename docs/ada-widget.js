/* Ada Accessibility Widget (drop-in)
   Usage: <script src="/ada-widget.js" defer></script>
   Optional attributes on the script tag:
     data-ada-title="Accessibility"
     data-ada-contact="accessibility@example.com"
     data-ada-statement-url="https://example.com/accessibility"
*/
(function () {
  'use strict';

  var SCRIPT = document.currentScript || (function(){
    var s = document.getElementsByTagName('script');
    return s[s.length - 1];
  })();

  var cfg = {
    title: (SCRIPT && SCRIPT.getAttribute('data-ada-title')) || 'Accessibility',
    contact: (SCRIPT && SCRIPT.getAttribute('data-ada-contact')) || '',
    statementUrl: (SCRIPT && SCRIPT.getAttribute('data-ada-statement-url')) || ''
  };

  var LS_KEY = 'adaWidget:v1';

  function safeParse(json) {
    try { return JSON.parse(json || '{}') || {}; } catch (e) { return {}; }
  }

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function addStyles() {
    if (document.getElementById('ada-widget-style')) return;
    var css = `
:root{
  --ada-font-scale: 1;
  --ada-line-height: 1.4;
  --ada-letter-spacing: 0px;
  --ada-zoom: 1;
}
html{ font-size: calc(16px * var(--ada-font-scale)); }
body{ line-height: var(--ada-line-height); letter-spacing: var(--ada-letter-spacing); }

/* Widget UI (scoped via #ada-widget-root) */
#ada-widget-root{ position: fixed; right: 18px; bottom: 18px; z-index: 2147483647; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
#ada-widget-root *{ box-sizing: border-box; }

.ada-btn{
  width: 56px; height: 56px; border-radius: 999px; border: 2px solid rgba(255,255,255,.7);
  background: #1f2a44; color: #fff; cursor: pointer; box-shadow: 0 10px 24px rgba(0,0,0,.25);
  display: inline-flex; align-items: center; justify-content: center;
}
.ada-btn:focus{ outline: 3px solid #ffd54f; outline-offset: 3px; }
.ada-btn svg{ width: 28px; height: 28px; display:block; }

.ada-backdrop{ position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 2147483646; }

.ada-modal{
  position: fixed; right: 18px; bottom: 86px; width: min(420px, calc(100vw - 24px));
  max-height: min(80vh, 680px); overflow: auto;
  background: #ffffff; color: #111827; border-radius: 16px;
  box-shadow: 0 25px 70px rgba(0,0,0,.35);
  border: 1px solid rgba(17,24,39,.12);
  padding: 14px 14px 16px;
  z-index: 2147483647;
}

.ada-modal h2{ font-size: 18px; margin: 0; }
.ada-top{ display:flex; align-items:center; justify-content: space-between; gap: 10px; padding: 6px 4px 10px; }
.ada-close{
  border: 1px solid rgba(17,24,39,.2); background:#fff; border-radius: 10px;
  padding: 8px 10px; cursor:pointer;
}
.ada-close:focus{ outline: 3px solid #ffd54f; outline-offset: 2px; }

.ada-section{ border-top: 1px solid rgba(17,24,39,.12); padding-top: 12px; margin-top: 12px; }
.ada-section h3{ font-size: 14px; margin: 0 0 8px; color:#374151; }

.ada-controls{ display:grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ada-control{ border: 1px solid rgba(17,24,39,.14); border-radius: 12px; padding: 10px; }
.ada-control label{ display:block; font-size: 12px; color:#374151; margin-bottom: 6px; }

.ada-row{ display:flex; gap: 8px; flex-wrap: wrap; }
.ada-pill{
  border: 1px solid rgba(17,24,39,.18); background:#fff; border-radius: 999px;
  padding: 8px 10px; cursor:pointer; font-size: 13px;
}
.ada-pill[aria-pressed="true"]{ background:#1f2a44; color:#fff; border-color:#1f2a44; }
.ada-pill:focus{ outline: 3px solid #ffd54f; outline-offset: 2px; }

.ada-actions{ display:flex; gap: 10px; margin-top: 10px; }
.ada-reset{ flex: 1; border: 1px solid rgba(17,24,39,.18); background:#fff; border-radius: 12px; padding: 10px; cursor:pointer; }
.ada-reset:focus{ outline: 3px solid #ffd54f; outline-offset: 2px; }

.ada-small{ font-size: 12px; color:#4b5563; line-height: 1.4; }
.ada-small a{ color:#1d4ed8; }

/* Visual modes applied to document */
html.ada-invert{ filter: invert(1) hue-rotate(180deg); }
html.ada-grayscale{ filter: grayscale(1); }

html.ada-high-contrast, html.ada-high-contrast body{ background:#000 !important; color:#fff !important; }
html.ada-high-contrast a{ color:#ffd54f !important; }
html.ada-high-contrast *{ border-color: rgba(255,255,255,.35) !important; }

html.ada-readable-font, html.ada-readable-font body{ font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif !important; }
html.ada-readable-font *{ font-family: inherit !important; }

/* Reduce motion */
html.ada-reduce-motion *{ animation: none !important; transition: none !important; scroll-behavior: auto !important; }
`;

    var style = document.createElement('style');
    style.id = 'ada-widget-style';
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function getState() {
    var st = safeParse(localStorage.getItem(LS_KEY));
    return {
      fontScale: clamp(Number(st.fontScale || 1), 0.9, 1.8),
      lineHeight: clamp(Number(st.lineHeight || 1.4), 1.2, 2.2),
      letterSpacing: clamp(Number(st.letterSpacing || 0), 0, 4),
      zoom: clamp(Number(st.zoom || 1), 0.9, 1.6),
      contrast: st.contrast || 'default', // default|high
      invert: !!st.invert,
      grayscale: !!st.grayscale,
      readableFont: !!st.readableFont,
      reduceMotion: !!st.reduceMotion,
      widgetHidden: !!st.widgetHidden
    };
  }

  function saveState(st) {
    localStorage.setItem(LS_KEY, JSON.stringify(st));
  }

  function applyState(st) {
    var root = document.documentElement;
    root.style.setProperty('--ada-font-scale', String(st.fontScale));
    root.style.setProperty('--ada-line-height', String(st.lineHeight));
    root.style.setProperty('--ada-letter-spacing', String(st.letterSpacing) + 'px');
    root.style.setProperty('--ada-zoom', String(st.zoom));

    root.classList.toggle('ada-high-contrast', st.contrast === 'high');
    root.classList.toggle('ada-invert', st.invert);
    root.classList.toggle('ada-grayscale', st.grayscale);
    root.classList.toggle('ada-readable-font', st.readableFont);
    root.classList.toggle('ada-reduce-motion', st.reduceMotion);

    // Hide widget button (modal can still be opened via keyboard shortcut)
    var widgetRoot = document.getElementById('ada-widget-root');
    if (widgetRoot) widgetRoot.style.display = st.widgetHidden ? 'none' : '';

    // Page zoom (best-effort). Prefer CSS zoom if available, fallback to transform.
    var z = st.zoom;
    if (CSS && CSS.supports && CSS.supports('zoom', '1')) {
      document.body.style.zoom = String(z);
      document.body.style.transform = '';
      document.body.style.transformOrigin = '';
    } else {
      document.body.style.zoom = '';
      document.body.style.transformOrigin = 'top left';
      document.body.style.transform = 'scale(' + z + ')';
      document.body.style.width = (100 / z) + '%';
    }
  }

  function buildUI() {
    addStyles();

    var state = getState();
    applyState(state);

    var root = el('div', { id: 'ada-widget-root' });

    var btn = el('button', {
      class: 'ada-btn',
      type: 'button',
      'aria-label': 'Open accessibility options',
      title: cfg.title
    }, [
      // Universal access / ADA-like icon (inline SVG)
      el('span', { 'aria-hidden': 'true', html:
        '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">'
        + '<path d="M12 2.2a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Z" fill="currentColor"/>'
        + '<path d="M4.6 7.8c0-.6.5-1.1 1.1-1.1h12.6c.6 0 1.1.5 1.1 1.1S18.9 8.9 18.3 8.9H13.1v3.2l3.6 9.3c.2.6-.1 1.2-.7 1.4-.6.2-1.2-.1-1.4-.7l-2.6-6.6-2.6 6.6c-.2.6-.9.9-1.4.7-.6-.2-.9-.9-.7-1.4l3.6-9.3V8.9H5.7c-.6 0-1.1-.5-1.1-1.1Z" fill="currentColor"/>'
        + '</svg>'
      })
    ]);

    var backdrop = el('div', { class: 'ada-backdrop', tabindex: '-1', hidden: '' });

    var modal = el('div', {
      class: 'ada-modal',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': cfg.title,
      hidden: ''
    });

    function pill(label, pressed, onClick) {
      var b = el('button', { class: 'ada-pill', type: 'button', 'aria-pressed': String(pressed) }, [label]);
      b.addEventListener('click', onClick);
      return b;
    }

    var fontControls = el('div', { class: 'ada-control' }, [
      el('label', { text: 'Text size' }),
      el('div', { class: 'ada-row' }, [
        pill('A-', false, function(){ state.fontScale = clamp(state.fontScale - 0.1, 0.9, 1.8); applyAndSync(); }),
        pill('Reset', false, function(){ state.fontScale = 1; applyAndSync(); }),
        pill('A+', false, function(){ state.fontScale = clamp(state.fontScale + 0.1, 0.9, 1.8); applyAndSync(); })
      ])
    ]);

    var zoomControls = el('div', { class: 'ada-control' }, [
      el('label', { text: 'Page zoom' }),
      el('div', { class: 'ada-row' }, [
        pill('90%', false, function(){ state.zoom = 0.9; applyAndSync(); }),
        pill('100%', false, function(){ state.zoom = 1.0; applyAndSync(); }),
        pill('125%', false, function(){ state.zoom = 1.25; applyAndSync(); }),
        pill('150%', false, function(){ state.zoom = 1.5; applyAndSync(); })
      ])
    ]);

    var contrastPills;
    var visualControls = el('div', { class: 'ada-control' }, [
      el('label', { text: 'Contrast & filters' }),
      (contrastPills = el('div', { class: 'ada-row' })),
      el('div', { class: 'ada-row', style: 'margin-top:8px' }, [
        pill('Invert', state.invert, function(){ state.invert = !state.invert; applyAndSync(); syncPressed(); }),
        pill('Grayscale', state.grayscale, function(){ state.grayscale = !state.grayscale; applyAndSync(); syncPressed(); })
      ])
    ]);

    function renderContrastPills() {
      contrastPills.innerHTML = '';
      contrastPills.appendChild(pill('Default', state.contrast === 'default', function(){ state.contrast='default'; applyAndSync(); renderContrastPills(); }));
      contrastPills.appendChild(pill('High', state.contrast === 'high', function(){ state.contrast='high'; applyAndSync(); renderContrastPills(); }));
    }

    var spacingControls = el('div', { class: 'ada-control' }, [
      el('label', { text: 'Spacing' }),
      el('div', { class: 'ada-row' }, [
        pill('Line +', false, function(){ state.lineHeight = clamp(state.lineHeight + 0.1, 1.2, 2.2); applyAndSync(); }),
        pill('Line -', false, function(){ state.lineHeight = clamp(state.lineHeight - 0.1, 1.2, 2.2); applyAndSync(); }),
        pill('Letters +', false, function(){ state.letterSpacing = clamp(state.letterSpacing + 0.5, 0, 4); applyAndSync(); }),
        pill('Letters -', false, function(){ state.letterSpacing = clamp(state.letterSpacing - 0.5, 0, 4); applyAndSync(); })
      ])
    ]);

    var toggles = el('div', { class: 'ada-control' }, [
      el('label', { text: 'Reading aids' }),
      el('div', { class: 'ada-row' }, [
        pill('Readable font', state.readableFont, function(){ state.readableFont = !state.readableFont; applyAndSync(); syncPressed(); }),
        pill('Reduce motion', state.reduceMotion, function(){ state.reduceMotion = !state.reduceMotion; applyAndSync(); syncPressed(); })
      ])
    ]);

    var resetBtn = el('button', { class: 'ada-reset', type: 'button' }, ['Reset all settings']);
    resetBtn.addEventListener('click', function(){
      state = {
        fontScale: 1,
        lineHeight: 1.4,
        letterSpacing: 0,
        zoom: 1,
        contrast: 'default',
        invert: false,
        grayscale: false,
        readableFont: false,
        reduceMotion: false,
        widgetHidden: false
      };
      applyAndSync();
      renderContrastPills();
      syncPressed();
    });

    var hideBtn = el('button', { class: 'ada-reset', type: 'button' }, ['Hide widget']);
    hideBtn.addEventListener('click', function(){
      state.widgetHidden = true;
      applyAndSync();
      close();
    });

    var statementText =
      'We are committed to making our website accessible to the widest possible audience, regardless of ability. ' +
      'If you experience any difficulty accessing content, or if you have accessibility feedback, please contact us.';

    var statement = el('div', { class: 'ada-section' }, [
      el('h3', { text: 'Accessibility statement' }),
      el('p', { class: 'ada-small', text: statementText }),
      cfg.contact ? el('p', { class: 'ada-small', html: '<strong>Contact:</strong> <a href="mailto:' + cfg.contact + '">' + cfg.contact + '</a>' }) : null,
      cfg.statementUrl ? el('p', { class: 'ada-small', html: '<a href="' + cfg.statementUrl + '" target="_blank" rel="noopener">Read the full accessibility statement</a>' }) : null,
      el('p', { class: 'ada-small', text: 'Note: This widget provides best-effort adjustments (contrast, text sizing, spacing, zoom). It does not guarantee full legal compliance for all content, but it helps users customize their experience.' })
    ]);

    modal.appendChild(el('div', { class: 'ada-top' }, [
      el('h2', { text: cfg.title }),
      (function(){
        var c = el('button', { class: 'ada-close', type: 'button', 'aria-label': 'Close accessibility options' }, ['Close']);
        c.addEventListener('click', close);
        return c;
      })()
    ]));

    var controls = el('div', { class: 'ada-controls' }, [fontControls, zoomControls, visualControls, spacingControls, toggles]);

    modal.appendChild(controls);
    modal.appendChild(el('div', { class: 'ada-actions' }, [resetBtn, hideBtn]));
    modal.appendChild(statement);

    root.appendChild(btn);

    // Provide a focusable way to bring the widget back if hidden.
    // This is visually hidden but becomes visible on keyboard focus.
    var unhide = el('button', {
      type: 'button',
      id: 'ada-widget-unhide',
      'aria-label': 'Show accessibility widget',
      style: 'position:fixed;left:10px;top:10px;z-index:2147483647;padding:10px 12px;border-radius:10px;border:1px solid rgba(17,24,39,.2);background:#fff;color:#111827;transform:translateY(-120%);transition:transform .2s;'
    }, ['Show accessibility options']);
    unhide.addEventListener('focus', function(){ unhide.style.transform='translateY(0)'; });
    unhide.addEventListener('blur', function(){ unhide.style.transform='translateY(-120%)'; });
    unhide.addEventListener('click', function(){
      state.widgetHidden = false;
      applyAndSync();
      open();
    });

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
    document.body.appendChild(root);
    document.body.appendChild(unhide);

    renderContrastPills();

    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      backdrop.hidden = false;
      modal.hidden = false;
      // Focus first focusable
      var focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
      document.addEventListener('keydown', onKeyDown);
    }

    function close() {
      backdrop.hidden = true;
      modal.hidden = true;
      document.removeEventListener('keydown', onKeyDown);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') { close(); return; }

      // Global-ish shortcut (when modal open): Alt+Shift+A toggles widget visibility
      if ((e.key === 'A' || e.key === 'a') && e.altKey && e.shiftKey) {
        e.preventDefault();
        state.widgetHidden = !state.widgetHidden;
        applyAndSync();
        if (state.widgetHidden) close();
        else open();
        return;
      }

      if (e.key !== 'Tab') return;
      // rudimentary focus trap
      var focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      focusables = Array.prototype.slice.call(focusables);
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    btn.addEventListener('click', function(){
      if (modal.hidden) open(); else close();
    });

    // Shortcut: Alt+Shift+A toggles widget (works even when button is hidden)
    document.addEventListener('keydown', function(e){
      if ((e.key === 'A' || e.key === 'a') && e.altKey && e.shiftKey) {
        e.preventDefault();
        state.widgetHidden = !state.widgetHidden;
        applyAndSync();
        if (state.widgetHidden) close();
        else open();
      }
    });

    backdrop.addEventListener('click', close);

    function applyAndSync() {
      applyState(state);
      saveState(state);
    }

    function syncPressed() {
      // Update pressed state for toggle pills
      var pills = modal.querySelectorAll('.ada-pill');
      pills.forEach(function(p){
        var txt = (p.textContent || '').trim().toLowerCase();
        if (txt === 'invert') p.setAttribute('aria-pressed', String(state.invert));
        if (txt === 'grayscale') p.setAttribute('aria-pressed', String(state.grayscale));
        if (txt === 'readable font') p.setAttribute('aria-pressed', String(state.readableFont));
        if (txt === 'reduce motion') p.setAttribute('aria-pressed', String(state.reduceMotion));
      });
    }

    return { open: open, close: close };
  }

  function initWhenReady() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', buildUI);
    } else {
      buildUI();
    }
  }

  initWhenReady();
})();
