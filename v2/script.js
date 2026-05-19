/* ════════════════════════════════════════════════════════════════
   srajit-site v2 :: SAI-ARCHIV
   Progressive enhancement layer over a fully-readable static page.
   Tier 1 (semantic HTML) lives in index.html.
   Tier 2 (boot animation, status bar, cmd-echo).
   Tier 3 (typeable prompt + easter eggs).
   No dependencies. Vanilla.
   ════════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── (a) THEME ────────────────────────────────────────────────── */
  const themeKey = 'sai-archiv:theme';
  const savedTheme = localStorage.getItem(themeKey);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  function bindThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const label = btn.querySelector('.theme-toggle-label');
    const updateLabel = () => {
      const t = document.documentElement.getAttribute('data-theme') || 'light';
      label.textContent = t === 'dark' ? '[ paper ]' : '[ phosphor ]';
    };
    updateLabel();
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(themeKey, next);
      updateLabel();
    });
  }

  /* ── (b) BOOT ANIMATION ─────────────────────────────────────── */

  // Reveal status bar + start uptime clock.
  function showStatusBar() {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    bar.hidden = false;
    bar.removeAttribute('aria-hidden');
    document.body.classList.add('has-status');

    const clock = document.getElementById('status-clock');
    const start = Date.now();
    function tick() {
      const s = Math.floor((Date.now() - start) / 1000);
      const hh = String(Math.floor(s / 3600)).padStart(2, '0');
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      clock.textContent = `${hh}:${mm}:${ss}`;
    }
    tick();
    if (!reducedMotion) setInterval(tick, 1000);
  }

  // Type the boot lines one-by-one. Total target <1.2s.
  function runBoot() {
    const stream = document.getElementById('boot-stream');
    const skipBtn = document.getElementById('boot-skip');
    if (!stream) { showStatusBar(); return; }

    if (reducedMotion) {
      // Static, fully visible.
      showStatusBar();
      return;
    }

    const lines = Array.from(stream.querySelectorAll('.boot-line'));
    if (lines.length === 0) { showStatusBar(); return; }

    // Hide all lines, reveal one at a time.
    lines.forEach(l => l.style.visibility = 'hidden');
    skipBtn.hidden = false;

    let i = 0;
    let timer = null;
    function step() {
      if (i >= lines.length) {
        skipBtn.hidden = true;
        showStatusBar();
        return;
      }
      lines[i].style.visibility = '';
      i++;
      const delay = i === lines.length ? 220 : 110;
      timer = setTimeout(step, delay);
    }
    timer = setTimeout(step, 80);

    skipBtn.addEventListener('click', () => {
      clearTimeout(timer);
      lines.forEach(l => l.style.visibility = '');
      skipBtn.hidden = true;
      showStatusBar();
    });
  }

  /* ── (c) NAV: COMMAND-ECHO ON CLICK ──────────────────────────── */

  function bindNavEcho() {
    const out = document.getElementById('repl-out');
    document.querySelectorAll('.cmd-nav a[data-cmd]').forEach(a => {
      a.addEventListener('click', (e) => {
        const cmd = a.dataset.cmd;
        if (out && cmd) {
          out.innerHTML = `<span class="echo">guest@sai-archiv:~$</span> <span class="hl">${escapeHTML(cmd)}</span>`;
        }
        // anchor scrolling proceeds via the normal browser action
      });
    });
  }

  /* ── (d) VISITOR COUNTER ─────────────────────────────────────── */

  function paintCounter(n) {
    const box = document.getElementById('visitor-counter');
    if (!box) return;
    const digits = String(n).padStart(6, '0').split('');
    box.innerHTML = digits.map(d => `<span class="digit">${d}</span>`).join('');
  }

  function maybeIncrementCounter() {
    // Honest fake: a local increment that only tracks YOUR own visits.
    // No analytics, no network. Per spec §4: "honest about being fake."
    const key = 'sai-archiv:visits';
    const cur = parseInt(localStorage.getItem(key) || '412', 10) + 1;
    localStorage.setItem(key, String(cur));
    paintCounter(cur);
  }

  /* ── (e) REPL (TIER 3) ───────────────────────────────────────── */

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ── EASTER-EGG DRAFTS ───────────────────────────────────────────
  // TODO(srajit): rewrite/replace in your own voice; these are stand-ins.
  // The spec calls for 2–3 in-character commands; all are thematic to
  // labour history, time-discipline, and the archive.
  // ────────────────────────────────────────────────────────────────
  const PAGES = {
    about:     'about',
    research:  'research',
    talks:     'talks',
    writing:   'writing',
    contact:   'contact',
  };

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  const commands = {
    help() {
      return [
        '<span class="dim">commands:</span>',
        '  <span class="acc">about</span>     open the about section',
        '  <span class="acc">research</span>  view dissertation &amp; interests',
        '  <span class="acc">talks</span>     list talks',
        '  <span class="acc">writing</span>   working papers / publications',
        '  <span class="acc">contact</span>   address &amp; links',
        '  <span class="acc">cv</span>        open cv (pdf)',
        '  <span class="acc">whois srajit</span>',
        '  <span class="acc">clear</span>     clear this output',
        '',
        '<span class="dim">also: man time · cat kanpur.txt · whois kapital · ls /1947</span>',
      ].join('\n');
    },

    'whois srajit'() {
      return [
        '<span class="hl">Srajit M. Kumar</span>',
        '  PhD candidate · Dept. of History · South Asia Institute',
        '  Heidelberg University · DAAD scholar',
        '  <span class="dim">labour history · time · political consciousness</span>',
      ].join('\n');
    },

    about()    { scrollTo('about');    return `<span class="echo">→ about</span>`; },
    research() { scrollTo('research'); return `<span class="echo">→ research</span>`; },
    talks()    { scrollTo('talks');    return `<span class="echo">→ talks</span>`; },
    writing()  { scrollTo('writing');  return `<span class="echo">→ writing</span>`; },
    contact()  { scrollTo('contact');  return `<span class="echo">→ contact</span>`; },
    cv()       { setTimeout(() => window.open('../cv.pdf', '_blank'), 280); return `<span class="ok">→ opening cv.pdf …</span>`; },

    ls() { return '<span class="dim">about.txt   research/   talks.log   writing/   contact.txt   cv.pdf</span>'; },
    pwd() { return '<span class="acc">/archive/sai-heidelberg/kumar_s</span>'; },
    whoami() { return '<span class="dim">guest</span>  <span class="dim">(authenticated read-only)</span>'; },

    // ── thematic easter eggs (DRAFT — Srajit to revise) ──────────

    'man time'() {
      return [
        '<span class="hl">TIME(1)</span>                                            <span class="dim">SAI-ARCHIV</span>',
        '',
        '<span class="acc">NAME</span>',
        '       time — a contested social category',
        '',
        '<span class="acc">SYNOPSIS</span>',
        '       time [--linear] [--cyclical] [--imposed]',
        '            [--worked] [--unworked] [--resisted]',
        '',
        '<span class="acc">DESCRIPTION</span>',
        '       In nineteenth- and twentieth-century industrial regimes,',
        '       time was instituted as discipline. In the Kanpur mills',
        '       between 1914 and 1947 it was rarely accepted whole.',
        '       Workers turned the shift, the bell, and the clock into',
        '       objects of negotiation. See <span class="acc">history(7)</span>, <span class="acc">labour(8)</span>.',
        '',
        '<span class="acc">BUGS</span>',
        '       Many. Documented partially. The archive is uneven.',
      ].join('\n');
    },

    'cat kanpur.txt'() {
      return [
        '<span class="dim">// /archive/places/kanpur.txt</span>',
        '',
        'Kanpur (formerly Cawnpore). United Provinces. Cotton and',
        'woollen mills opened in the late nineteenth century along the',
        'Ganges. By the inter-war decades, a labouring population',
        'drawn from agrarian districts — Awadh, Bhojpur, Bundelkhand —',
        'lived between the village and the shift. The site of the',
        'dissertation: how that population learned, and refused, the',
        'clock. <span class="dim">[ 1914–1947 ]</span>',
      ].join('\n');
    },

    'whois kapital'() {
      return [
        '<span class="hl">KAPITAL</span>  <span class="dim">— author: Marx, K. (1867–1894)</span>',
        '  <span class="dim">on the working day, ch. X.</span>',
        '  <span class="dim">see also:</span> <span class="acc">man time</span>',
      ].join('\n');
    },

    'ls /1947'() {
      return '<span class="warn">[ permission denied ]</span>  <span class="dim">consult: partition.txt — pending release</span>';
    },

    'git blame'() { return '<span class="warn">blame is the wrong frame.</span>'; },
    'git log'()   { return '<span class="dim">commits authored 1914–1947, mostly unsigned.</span>'; },

    history()   { return '<span class="dim">[ access restricted ]</span>  <span class="dim">history is read in the reading room.</span>'; },
    uptime()    { return '<span class="dim">archive open since 1914; load average: heavy.</span>'; },
    uname()     { return '<span class="dim">SAI-ARCHIV  v0.2  Heidelberg / Kanpur</span>'; },
    date()      { return `<span class="hl">${new Date().toUTCString()}</span> <span class="dim">— but whose time?</span>`; },
    time()      { return `<span class="hl">${new Date().toLocaleTimeString()}</span> <span class="dim">— see <span class="acc">man time</span>.</span>`; },
    clock()     { return '<span class="dim">tick. tock. the clock is a contested object.</span>'; },
    sudo()      { return '<span class="err">permission denied</span> <span class="dim">— the archive is read-only.</span>'; },
    rm()        { return '<span class="err">rm: refusing to delete the historical record.</span>'; },
    exit()      { return '<span class="dim">the past is not so easily exited.</span>'; },
    cat()       { return '<span class="dim">🐈  meow.  usage: cat &lt;file&gt;</span>'; },

    clear() {
      const out = document.getElementById('repl-out');
      if (out) out.innerHTML = '';
      return null;
    },
  };

  function runREPL() {
    const input = document.getElementById('repl-in');
    const out = document.getElementById('repl-out');
    if (!input || !out) return;

    function exec(raw) {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return;
      // Try the full string first, then two words, then one word.
      let fn = commands[cmd]
            || commands[cmd.split(' ').slice(0, 2).join(' ')]
            || commands[cmd.split(' ')[0]];
      const echo = `<span class="echo">guest@sai-archiv:~$</span> <span class="hl">${escapeHTML(raw)}</span>`;
      if (!fn) {
        out.innerHTML = `${echo}\n<span class="err">command not found:</span> <span class="dim">${escapeHTML(cmd)}</span> — try '<span class="acc">help</span>'`;
        return;
      }
      const res = fn();
      if (res === null) return;        // clear()
      out.innerHTML = `${echo}\n${res}`;
    }

    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const val = input.value;
      input.value = '';
      exec(val);
    });

    // Click anywhere non-interactive → focus the REPL (subtle quality-of-life)
    document.addEventListener('click', (e) => {
      if (e.target.closest('a, button, input, textarea, select')) return;
      if (e.target.closest('.boot, .cmd-echo')) return;
      input.focus();
    });
  }

  /* ── (f) MISC ────────────────────────────────────────────────── */

  function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  function setLastIndexed() {
    // Drive off page-load time. Cheap stand-in for build date.
    const el = document.getElementById('last-indexed');
    if (!el) return;
    const d = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    el.textContent = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  /* ── BOOT ────────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', () => {
    bindThemeToggle();
    setYear();
    setLastIndexed();
    maybeIncrementCounter();
    bindNavEcho();
    runREPL();
    runBoot();
  });
})();
