/* =====================================================================
   RED NET — Interacciones y animaciones
   Loader · Navbar · Menú móvil · Partículas hero · Reveal on scroll ·
   Marquee · Parallax hero · Formulario -> WhatsApp · Año dinámico
   ===================================================================== */
(function () {
  'use strict';

  /* ---- Configuración del negocio -------------------------------------
     Cuando Red Net confirme su número oficial de WhatsApp, colócalo aquí
     en formato internacional sin signos (ej. "5216181234567").          */
  var WHATSAPP_NUMBER = '';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------- Loader ----------------------------- */
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.body.classList.add('loaded');
    }, 500);
  });
  // Respaldo por si 'load' tarda demasiado
  setTimeout(function () { document.body.classList.add('loaded'); }, 3500);

  /* ----------------------------- Navbar ----------------------------- */
  var navbar = document.getElementById('navbar');
  function onScrollNav() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* --------------------------- Menú móvil --------------------------- */
  var burger = document.getElementById('hamburger');
  var mobMenu = document.getElementById('mob-menu');
  function closeMenu() {
    if (!burger || !mobMenu) return;
    burger.classList.remove('active');
    mobMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && mobMenu) {
    burger.addEventListener('click', function () {
      var open = mobMenu.classList.toggle('open');
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    mobMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ----------------------- Reveal on scroll ------------------------ */
  var reveals = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------- Marquee content ---------------------- */
  var marquee = document.getElementById('marquee');
  if (marquee) {
    var items = [
      'Servicio de internet', 'Instalación de aires acondicionados',
      'Mantenimiento de climatización', 'Paneles solares', 'Energía eficiente',
      'Conectividad para hogares y negocios', 'Soluciones integrales', 'Atención profesional'
    ];
    var html = items.map(function (t) { return '<span>' + t + '</span>'; }).join('');
    marquee.innerHTML = html + html; // duplicado para loop continuo
  }

  /* ---------------------- Parallax del hero ---------------------- */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg && !prefersReduced) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = 'translate3d(0,' + (y * 0.18) + 'px,0) scale(1.06)';
      }
    }, { passive: true });
  }

  /* ------------------- Partículas / orbes del hero -------------- */
  var canvas = document.getElementById('hero-canvas');
  if (canvas && canvas.getContext && !prefersReduced) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var raf = null;

    function resize() {
      var hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function build() {
      particles = [];
      var count = Math.min(70, Math.floor(canvas.width / 22));
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 0.6,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          a: Math.random() * 0.5 + 0.15
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,80,88,' + p.a + ')';
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = dx * dx + dy * dy;
          if (dist < 13000) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(225,29,40,' + (0.12 * (1 - dist / 13000)) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    }

    function start() {
      resize(); build();
      if (raf) cancelAnimationFrame(raf);
      tick();
    }
    start();
    window.addEventListener('resize', start);

    // Pausa cuando el hero no está visible (ahorro de recursos)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { if (!raf) tick(); }
          else if (raf) { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0 }).observe(canvas.parentElement);
    }
  }

  /* ------------------- Formulario -> WhatsApp ------------------- */
  var form = document.getElementById('wa-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('f-name') || {}).value || '';
      var interest = (document.getElementById('f-interest') || {}).value || '';
      var msg = (document.getElementById('f-msg') || {}).value || '';

      if (!name.trim() || !msg.trim()) {
        form.reportValidity ? form.reportValidity() : alert('Completa tu nombre y el detalle del proyecto.');
        return;
      }

      var text =
        'Hola Red Net, me interesa solicitar una cotización.%0A%0A' +
        '*Nombre:* ' + encodeURIComponent(name) + '%0A' +
        '*Servicio:* ' + encodeURIComponent(interest) + '%0A' +
        '*Detalle:* ' + encodeURIComponent(msg);

      var url = WHATSAPP_NUMBER
        ? 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text
        : 'https://wa.me/?text=' + text;

      window.open(url, '_blank', 'noopener');
    });
  }

  /* ------------------------ Año dinámico ---------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* -------------- Cerrar menú móvil al redimensionar --------- */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMenu();
  });
})();
