/**
 * Gruppiertes Dropdown-Menueband — Port von nav_html() und dem Nav-JS aus work/quiz.py.
 * Tastaturverhalten, Scrollspy und Ausklapplogik bleiben unveraendert, nur der
 * DOM-Zugriff wird durch React-State ersetzt.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';

export const NAV_GROUPS = [
  ['grundlagen', 'Grundlagen', [['intro', 'Einleitung'], ['layer', 'Layer-Modell'],
    ['matrix', 'Matrix Schweiz']]],
  ['kriterien', 'Kriterien', [['kriterien', 'Fünf Kriterien'], ['preise', 'Preise']]],
  ['plattformen', 'Plattformen', [['steckbriefe', 'Steckbriefe'],
    ['konstellationen', 'Konstellationen']]],
  ['anhang', 'Anhang', [['regulatorik', 'Regulatorik'], ['markt', 'Markt'],
    ['pruefauftraege', 'Prüfaufträge'], ['transparenz', 'Transparenz'],
    ['quellen', 'Quellen']]],
];

const ALL_SECS = NAV_GROUPS.flatMap(([, , items]) => items.map(([sid]) => sid));

function Chevron() {
  return (
    <svg
      className="nav-chev" width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(null);       // offene Gruppen-ID oder null
  const [panelOpen, setPanelOpen] = useState(false);  // Burger-Panel unter 900 px
  const [current, setCurrent] = useState(null);      // aktive Abschnitts-ID
  const navRef = useRef(null);
  const topRefs = useRef({});
  const linkRefs = useRef({});

  const closeAll = useCallback(() => setOpen(null), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  const isMobile = () => window.matchMedia('(max-width:899px)').matches;

  /* ---- Klick ausserhalb, Escape, Resize schliessen alles ---- */
  useEffect(() => {
    function onDocClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        closeAll();
        closePanel();
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') { closeAll(); closePanel(); }
    }
    function onResize() { closeAll(); closePanel(); }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [closeAll, closePanel]);

  /* ---- Scrollspy ueber die gruppierte Navigation ---- */
  useEffect(() => {
    let raf = false;
    function spy() {
      const y = window.scrollY + 120;
      let active = null;
      let best = -1;
      let firstTop = Infinity;
      let firstSec = null;
      ALL_SECS.forEach((sid) => {
        const el = document.getElementById(sid);
        if (!el) return;
        const t = el.offsetTop;
        if (t < firstTop) { firstTop = t; firstSec = sid; }
        if (t <= y && t > best) { best = t; active = sid; }
      });
      const quiz = document.getElementById('quiz');
      if (quiz && quiz.offsetTop <= y && quiz.offsetTop > best) active = 'quiz';
      if (!active) active = firstSec;
      setCurrent(active);
    }
    function onScroll() {
      if (raf) return;
      raf = true;
      window.requestAnimationFrame(() => { spy(); raf = false; });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    spy();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toggleGroup(gid, focusFirst) {
    if (open === gid) { closeAll(); return; }
    setOpen(gid);
    if (focusFirst) {
      window.requestAnimationFrame(() => {
        const first = (linkRefs.current[gid] || [])[0];
        if (first) first.focus();
      });
    }
  }

  function topKeyDown(e, gid, gi) {
    const k = e.key;
    if (k === 'Enter' || k === ' ' || k === 'Spacebar') {
      e.preventDefault();
      toggleGroup(gid, true);
    } else if (k === 'ArrowDown') {
      e.preventDefault();
      setOpen(gid);
      window.requestAnimationFrame(() => {
        const first = (linkRefs.current[gid] || [])[0];
        if (first) first.focus();
      });
    } else if (k === 'Escape') {
      closeAll();
    } else if (k === 'ArrowRight' && !isMobile()) {
      e.preventDefault();
      const next = NAV_GROUPS[(gi + 1) % NAV_GROUPS.length][0];
      if (topRefs.current[next]) topRefs.current[next].focus();
    } else if (k === 'ArrowLeft' && !isMobile()) {
      e.preventDefault();
      const prev = NAV_GROUPS[(gi - 1 + NAV_GROUPS.length) % NAV_GROUPS.length][0];
      if (topRefs.current[prev]) topRefs.current[prev].focus();
    }
  }

  function linkKeyDown(e, gid, i, count) {
    const k = e.key;
    const links = linkRefs.current[gid] || [];
    if (k === 'ArrowDown') {
      e.preventDefault();
      const n = links[(i + 1) % count];
      if (n) n.focus();
    } else if (k === 'ArrowUp') {
      e.preventDefault();
      if (i === 0) { if (topRefs.current[gid]) topRefs.current[gid].focus(); }
      else if (links[i - 1]) links[i - 1].focus();
    } else if (k === 'Escape') {
      e.preventDefault();
      closeAll();
      if (topRefs.current[gid]) topRefs.current[gid].focus();
    } else if (k === 'Tab' && !e.shiftKey && i === count - 1) {
      closeAll();
    }
  }

  return (
    <nav className="mainnav" aria-label="Abschnitte" ref={navRef}>
      <button
        type="button" className="navburger" id="navBurger"
        aria-expanded={panelOpen ? 'true' : 'false'} aria-controls="navGroups"
        onClick={() => {
          setPanelOpen((o) => {
            if (o) closeAll();
            return !o;
          });
        }}
      >
        <span className="burger-bars" aria-hidden="true"><i /><i /><i /></span>
        <span>Menü</span>
      </button>
      <div className={panelOpen ? 'navgroups is-open' : 'navgroups'} id="navGroups">
        <ul className="navgroup-list">
          {NAV_GROUPS.map(([gid, label, items], gi) => {
            const groupCurrent = items.some(([sid]) => sid === current);
            linkRefs.current[gid] = linkRefs.current[gid] || [];
            return (
              <li className="navgroup" data-group={gid} key={gid}
                data-current={groupCurrent ? 'true' : 'false'}
              >
                <button
                  type="button" className="navtop" id={`navtop-${gid}`}
                  aria-expanded={open === gid ? 'true' : 'false'}
                  aria-haspopup="true" aria-controls={`navmenu-${gid}`}
                  ref={(el) => { topRefs.current[gid] = el; }}
                  onClick={(e) => { e.preventDefault(); toggleGroup(gid, false); }}
                  onKeyDown={(e) => topKeyDown(e, gid, gi)}
                >
                  <span>{label}</span>
                  <Chevron />
                </button>
                <ul
                  className="navmenu" id={`navmenu-${gid}`} role="group"
                  aria-labelledby={`navtop-${gid}`} hidden={open !== gid}
                >
                  {items.map(([sid, t], i) => (
                    <li key={sid}>
                      <a
                        href={`#${sid}`} data-sec={sid}
                        aria-current={current === sid ? 'true' : undefined}
                        ref={(el) => { linkRefs.current[gid][i] = el; }}
                        onKeyDown={(e) => linkKeyDown(e, gid, i, items.length)}
                        onClick={() => { closeAll(); closePanel(); }}
                      >
                        {t}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <a
          className="btn-quiz btn-quiz-inmenu" href="#quiz" data-sec="quiz"
          aria-current={current === 'quiz' ? 'true' : undefined}
          onClick={() => { closeAll(); closePanel(); }}
        >
          Entscheidungs-Quiz
        </a>
      </div>
    </nav>
  );
}
