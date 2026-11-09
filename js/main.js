/* ============================================================
   LOPEZ GILBERT CORREDORES DE SEGUROS
   main.js — Toda la interactividad de la página
   ============================================================ */

/* ----------------------------------------------------------
   CONFIGURACIÓN — Número y mensaje de WhatsApp
   ---------------------------------------------------------- */
const WA_PHONE   = '+18093609366';
const WA_MESSAGE = 'Hola Wendy! Me interesa cotizar un seguro de vehículo 🚗';

/* ----------------------------------------------------------
   WHATSAPP — Abre la conversación con mensaje predefinido
   ---------------------------------------------------------- */
function openWhatsApp() {
  const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(WA_MESSAGE)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function initWhatsApp() {
  const buttons = ['ctaWaBtn', 'waFloat'];
  buttons.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', e => {
      e.preventDefault();
      openWhatsApp();
    });
  });
}

/* ----------------------------------------------------------
   NAVEGACIÓN — Menú móvil (hamburguesa)
   ---------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Cierra el menú al seleccionar un enlace */
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Cierra el menú al hacer clic fuera */
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ----------------------------------------------------------
   HEADER — Se oscurece al salir del hero
   ---------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  const hero   = document.getElementById('inicio');
  if (!header || !hero) return;

  /* Comprueba la posición al cargar (por si la página abre scrollada) */
  function checkScroll() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    header.classList.toggle('scrolled', heroBottom < 0);
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
}

/* ----------------------------------------------------------
   HERO — Efecto parallax en la imagen de fondo
   ---------------------------------------------------------- */
function initParallax() {
  /* Respeta la preferencia de movimiento reducido del sistema */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroImg = document.querySelector('.hero-bg-img');
  if (!heroImg) return;

  window.addEventListener('scroll', () => {
    /* La imagen se desplaza más lento que el scroll para crear profundidad */
    heroImg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
  }, { passive: true });
}

/* ----------------------------------------------------------
   ESTADÍSTICAS — Contador animado al hacer scroll
   ---------------------------------------------------------- */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    /* Easing out quart — comienza rápido y desacelera al final */
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target); /* solo anima una vez */
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------
   SCROLL REVEAL — Elementos entran al hacer scroll
   ---------------------------------------------------------- */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  /* Sin animaciones si el usuario prefiere movimiento reducido */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------
   SMOOTH SCROLL — Anclas internas (#sección)
   ---------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return; /* ignora href="#" vacío */
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ----------------------------------------------------------
   TESTIMONIOS — Flechas de navegación para el scroll horizontal
   ---------------------------------------------------------- */
function initTestimoniosSlider() {
  const grid    = document.querySelector('.testimonios-grid');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  if (!grid || !prevBtn || !nextBtn) return;

  /* Desplazamiento = ancho de una card + gap (1rem = 16px) */
  function cardWidth() {
    const card = grid.querySelector('.testimonio');
    return card ? card.offsetWidth + 16 : 300;
  }

  /* Muestra/oculta flechas según posición del scroll */
  function syncArrows() {
    const atStart = grid.scrollLeft <= 8;
    const atEnd   = grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 8;
    prevBtn.classList.toggle('hidden', atStart);
    nextBtn.classList.toggle('hidden', atEnd);
  }

  prevBtn.addEventListener('click', () => {
    grid.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    grid.scrollBy({ left: cardWidth(), behavior: 'smooth' });
  });

  grid.addEventListener('scroll', syncArrows, { passive: true });

  /* Las flechas solo aplican en móvil — comprueba antes de iniciar */
  if (window.innerWidth <= 768) syncArrows();
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) syncArrows();
  });
}

/* ----------------------------------------------------------
   INICIO — Ejecuta todo al cargar el DOM
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initWhatsApp();
  initMobileNav();
  initHeaderScroll();
  initParallax();
  initCounters();
  initReveal();
  initSmoothScroll();
  initTestimoniosSlider();
});
