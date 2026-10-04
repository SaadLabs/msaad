document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      if (link.closest('nav')) {
        document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .08 });

document.querySelectorAll('.section,.contact').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity .7s ease, transform .7s ease';
  observer.observe(el);
});

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

      // Scrolling down -> hide navbar
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
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
