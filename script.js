// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const targetId = href.slice(1);

    if (typeof closeMobileNav === 'function') {
      closeMobileNav();
    }

    if (targetId === 'top') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const header = document.querySelector('.site-header');
      const headerHeight = header ? header.offsetHeight : 75;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });
      if (link.closest('nav')) {
        document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    } else if (targetId === 'certifications') {
      e.preventDefault();
      window.location.href = 'certifications/index.html';
    }
  });
});

/* ==========================================================================
   SCROLL REVEAL & INTERACTIVE SCROLL ANIMATION ENGINE
   ========================================================================== */

(function initScrollAnimations() {
  // 1. Floating "Back to Top" Button
  let backToTopBtn = document.querySelector('.scroll-to-top-btn');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'scroll-to-top-btn';
    backToTopBtn.setAttribute('aria-label', 'Back to top of page');
    backToTopBtn.innerHTML = '↑';
    document.body.appendChild(backToTopBtn);
  }

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 3. Register Elements for Scroll Reveal
  function setupRevealItem(el, effectClass = 'reveal-item', delayMs = 0) {
    if (!el) return;
    if (!el.classList.contains('reveal-item') &&
        !el.classList.contains('reveal-item-scale') &&
        !el.classList.contains('reveal-item-left') &&
        !el.classList.contains('reveal-item-right') &&
        !el.classList.contains('reveal-item-fade')) {
      el.classList.add(effectClass);
    }
    if (delayMs > 0 && !el.style.getPropertyValue('--reveal-delay')) {
      el.style.setProperty('--reveal-delay', `${delayMs}ms`);
    }
  }

  // Hero Section items
  const heroEyebrow = document.querySelector('.hero .eyebrow');
  const heroTitle = document.querySelector('.hero h1, .hero .hero-title');
  const heroSubtitle = document.querySelector('.hero h2, .hero .hero-subtitle');
  const heroCopy = document.querySelector('.hero .hero-copy');
  const heroActions = document.querySelector('.hero .hero-actions');
  const homeTicker = document.querySelector('.home-ticker');

  setupRevealItem(heroEyebrow, 'reveal-item', 80);
  setupRevealItem(heroTitle, 'reveal-item', 180);
  setupRevealItem(heroSubtitle, 'reveal-item', 280);
  setupRevealItem(heroCopy, 'reveal-item', 380);
  setupRevealItem(heroActions, 'reveal-item', 480);
  setupRevealItem(homeTicker, 'reveal-item-fade', 580);

  // Section Headers
  document.querySelectorAll('.section-label').forEach(label => {
    setupRevealItem(label, 'reveal-item', 0);
  });

  // About Section paragraphs (staggered)
  document.querySelectorAll('.about-copy p').forEach((p, idx) => {
    setupRevealItem(p, 'reveal-item', idx * 100);
  });

  // Experience Rows
  document.querySelectorAll('.experience-row').forEach(row => {
    setupRevealItem(row, 'reveal-item', 0);
  });

  // Project Rows & Items
  document.querySelectorAll('.project-row').forEach(row => {
    setupRevealItem(row, 'reveal-item', 0);
  });

  // Archive Link
  const archiveLink = document.querySelector('.archive-link');
  if (archiveLink) {
    setupRevealItem(archiveLink, 'reveal-item', 100);
  }

  // Skills Grid Groups (staggered cascade)
  document.querySelectorAll('.skills-grid .skill-group').forEach((card, idx) => {
    setupRevealItem(card, 'reveal-item', idx * 90);
  });

  // Contact Section elements (choreographed cascade)
  const contactSection = document.querySelector('.contact');
  if (contactSection) {
    setupRevealItem(contactSection.querySelector('.eyebrow'), 'reveal-item', 0);
    setupRevealItem(contactSection.querySelector('h2'), 'reveal-item', 100);
    setupRevealItem(contactSection.querySelector('p:not(.eyebrow)'), 'reveal-item', 200);
    setupRevealItem(contactSection.querySelector('.primary-btn'), 'reveal-item-scale', 300);
    setupRevealItem(contactSection.querySelector('.mobile-social-pill'), 'reveal-item', 380);
  }

  // Detail Pages: Headers, Showcases, Details Blocks, Sidebars
  document.querySelectorAll('.cert-header, .project-header').forEach(header => {
    setupRevealItem(header, 'reveal-item', 50);
  });

  document.querySelectorAll('.cert-showcase, .project-showcase').forEach(showcase => {
    setupRevealItem(showcase, 'reveal-item-scale', 120);
  });

  document.querySelectorAll('.cert-details-block, .project-details-block').forEach(block => {
    setupRevealItem(block, 'reveal-item', 0);
  });

  document.querySelectorAll('.cert-details-block li, .project-details-block li').forEach((li, idx) => {
    setupRevealItem(li, 'reveal-item', Math.min(idx * 70, 400));
  });

  document.querySelectorAll('.cert-sidebar-item, .project-sidebar-item').forEach((item, idx) => {
    setupRevealItem(item, 'reveal-item', idx * 100);
  });

  document.querySelectorAll('.project-pagination').forEach(pagination => {
    setupRevealItem(pagination, 'reveal-item', 100);
  });

  document.querySelectorAll('footer').forEach(footer => {
    setupRevealItem(footer, 'reveal-item-fade', 50);
  });

  // Sidebars fade in on load
  const sideLeft = document.querySelector('.side-left');
  const sideRight = document.querySelector('.side-right');
  if (sideLeft) setupRevealItem(sideLeft, 'reveal-item-fade', 500);
  if (sideRight) setupRevealItem(sideRight, 'reveal-item-fade', 600);

  // 4. IntersectionObserver for Fluid Scroll Triggering
  const revealTargets = document.querySelectorAll(
    '.reveal-item, .reveal-item-scale, .reveal-item-left, .reveal-item-right, .reveal-item-fade, [data-reveal]'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealTargets.forEach(el => el.classList.add('is-revealed'));
  }

  // 5. Scroll Handler for Back to Top Button (Mobile screens only)
  function onScrollUpdates() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const isMobile = window.innerWidth <= 760;

    // Toggle Back to Top Button (only active on mobile)
    if (backToTopBtn) {
      if (scrollY > 350 && isMobile) {
        backToTopBtn.classList.add('is-active');
      } else {
        backToTopBtn.classList.remove('is-active');
      }
    }
  }

  window.addEventListener('scroll', onScrollUpdates, { passive: true });
  window.addEventListener('resize', onScrollUpdates, { passive: true });
  onScrollUpdates();
})();

// Smart Auto-Hiding Navbar & Active Link Highlighting
let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
const header = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const navSections = Array.from(navLinks)
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function updateActiveNav() {
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  const headerHeight = header ? header.offsetHeight : 80;
  const offsetTolerance = headerHeight + 120;

  // Near the bottom of the page: activate the last section (Contact)
  if ((window.innerHeight + scrollPosition) >= (document.documentElement.scrollHeight - 60)) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#contact');
    });
    return;
  }

  // At the top / hero section before the first section
  if (navSections.length > 0 && scrollPosition < navSections[0].offsetTop - offsetTolerance) {
    navLinks.forEach(link => link.classList.remove('active'));
    return;
  }

  let activeId = '';
  for (let i = 0; i < navSections.length; i++) {
    const section = navSections[i];
    const nextSection = navSections[i + 1];
    const sectionTop = section.offsetTop - offsetTolerance;
    const sectionBottom = nextSection ? (nextSection.offsetTop - offsetTolerance) : (section.offsetTop + section.offsetHeight);

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      activeId = section.getAttribute('id');
      break;
    }
  }

  navLinks.forEach(link => {
    const targetId = link.getAttribute('href').slice(1);
    link.classList.toggle('active', targetId === activeId);
  });
}

// Initial state
updateActiveNav();

if (header) {
  window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Completely at the top of the page: remove shadow and glass effect
    if (currentScrollY <= 15) {
      header.classList.remove('nav-scrolled');
      header.classList.remove('nav-hidden');
    } else {
      // Away from top: add shadow and glass background
      header.classList.add('nav-scrolled');

      // Do not hide header if mobile nav is currently open
      const isMobileNavOpen = siteNav && siteNav.classList.contains('nav-open');

      // Scrolling down -> hide navbar
      if (currentScrollY > lastScrollY && currentScrollY > 80 && !isMobileNavOpen) {
        header.classList.add('nav-hidden');
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> reveal navbar
        header.classList.remove('nav-hidden');
      }
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    updateActiveNav();
  }, { passive: true });
}

// Mobile Hamburger Navigation Drawer
const menuToggle = document.getElementById('menu-toggle');
const siteNav = document.getElementById('site-nav');

function closeMobileNav() {
  if (!menuToggle || !siteNav) return;
  menuToggle.classList.remove('is-active');
  menuToggle.setAttribute('aria-expanded', 'false');
  siteNav.classList.remove('nav-open');
  if (header) header.classList.remove('nav-open-header');
}

function openMobileNav() {
  if (!menuToggle || !siteNav) return;
  menuToggle.classList.add('is-active');
  menuToggle.setAttribute('aria-expanded', 'true');
  siteNav.classList.add('nav-open');
  if (header) header.classList.add('nav-open-header');
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = siteNav.classList.contains('nav-open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  // Clicking outside the sidebar closes it
  document.addEventListener('click', (e) => {
    if (siteNav.classList.contains('nav-open')) {
      if (!siteNav.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMobileNav();
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteNav.classList.contains('nav-open')) {
      closeMobileNav();
    }
  });

  // Close if window resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760 && siteNav.classList.contains('nav-open')) {
      closeMobileNav();
    }
  });
}
