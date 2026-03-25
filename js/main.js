/* =========================================================
   EMERALD NOTARY SERVICES — Main JavaScript
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Dynamic year in footer ----
  const yr = new Date().getFullYear();
  document.querySelectorAll('#year, .year').forEach(el => el.textContent = yr);

  // ---- Mobile nav toggle ----
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close nav when a link is clicked
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- Sticky header shadow ----
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 16px rgba(0,0,0,.25)'
        : '0 2px 12px rgba(0,0,0,.18)';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Scroll-in animations ----
  const animTargets = document.querySelectorAll(
    '.service-card, .contact-card, .about-copy, .about-visual, .trust-item'
  );

  if ('IntersectionObserver' in window && animTargets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    animTargets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
      observer.observe(el);
    });

    // Add class toggle in CSS via JS
    document.head.insertAdjacentHTML('beforeend', `
      <style>
        .is-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      </style>
    `);
  }

});
