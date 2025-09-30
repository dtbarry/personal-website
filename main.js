/*
 * main.js
 *
 * Handles interactive behaviors for the personal site, including
 * navigation overlay toggling, focus management, smooth anchor scrolling,
 * and reveal animations using IntersectionObserver. Respects reduced
 * motion preferences by disabling animations where appropriate.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation overlay handling ---
  const navToggle = document.querySelector('.nav-toggle');
  const navOverlay = document.getElementById('nav-overlay');
  const navClose = navOverlay.querySelector('.nav-close');
  const navLinks = navOverlay.querySelectorAll('.nav-list a');
  let lastFocusedElement;

  function openNav() {
    lastFocusedElement = document.activeElement;
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    // Focus first link in overlay
    if (navLinks.length) {
      navLinks[0].focus();
    }
    document.addEventListener('keydown', trapFocus);
  }

  function closeNav() {
    navOverlay.classList.remove('open');
    navOverlay.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    // Restore focus
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
    document.removeEventListener('keydown', trapFocus);
  }

  function trapFocus(e) {
    // Close on Escape
    if (e.key === 'Escape') {
      closeNav();
      return;
    }
    // Loop focus inside overlay on Tab
    if (e.key === 'Tab') {
      const focusable = navOverlay.querySelectorAll('a, button');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeNav();
    } else {
      openNav();
    }
  });

  navClose.addEventListener('click', () => {
    closeNav();
  });

  // Close nav overlay when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  // --- Anchor focus management ---
  // Ensure sections are focusable to support smooth scrolling and skip links
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(section => {
    section.setAttribute('tabindex', '-1');
  });

  // On click of internal anchor, shift focus to target after scroll
  const allLinks = document.querySelectorAll('a[href^="#"]');
  allLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      // Skip empty or just '#'
      if (!href || href === '#' || href === '#home') return;
      const id = href.substring(1);
      const target = document.getElementById(id);
      if (target) {
        // Delay focusing until after scroll has likely completed
        setTimeout(() => {
          target.focus({ preventScroll: true });
        }, 600);
      }
    });
  });

  // --- Reveal animations ---
  // Identify elements to reveal when scrolled into view
  const revealTargets = document.querySelectorAll(
    '.skill-card, .experience-group, .portfolio-card, .about-photo, .about-text'
  );
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }
});