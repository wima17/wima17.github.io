
// ── DARK MODE ──
function toggleDark() {
  var html = document.documentElement;
  var isDark = html.getAttribute('data-theme') === 'dark';
  var newTheme = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('licey-theme', newTheme);
  updateDarkIcon(newTheme);
}

function updateDarkIcon(theme) {
  var icon = document.getElementById('darkIcon');
  if (!icon) return;
  icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
}

// Cargar tema guardado
(function initTheme() {
  var saved = localStorage.getItem('licey-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateDarkIcon(saved);
})();

// ── TOAST ALERT ──
function showAlert(message, type) {
  type = type || 'info';
  document.querySelectorAll('.envoltorio-toast').forEach(function(el) { el.remove(); });

  var colors = { success: '#003087', info: '#004BB4', warning: '#C9A800', danger: '#CC0000' };
  var icons  = { success: 'bi-check-circle-fill', info: 'bi-info-circle-fill', warning: 'bi-exclamation-triangle-fill', danger: 'bi-x-circle-fill' };

  var wrapper = document.createElement('div');
  wrapper.className = 'position-fixed top-0 end-0 p-3 envoltorio-toast';
  wrapper.style.zIndex = '9999';
  wrapper.innerHTML =
    '<div class="toast toast-licey show align-items-center text-white border-0" role="alert" ' +
    'style="background:' + (colors[type] || colors.info) + ';min-width:290px;border-radius:10px;">' +
    '<div class="d-flex align-items-center gap-2 p-3">' +
    '<i class="bi ' + (icons[type] || icons.info) + ' fs-5"></i>' +
    '<div class="flex-grow-1 fw-semibold">' + message + '</div>' +
    '<button type="button" class="btn-close btn-close-white ms-2" ' +
    'onclick="this.closest(\'.envoltorio-toast\').remove()"></button>' +
    '</div></div>';
  document.body.appendChild(wrapper);
  setTimeout(function() { wrapper.remove(); }, 4500);
}

// ── MODAL HISTORIA ──
function showHistoria() {
  var el = document.getElementById('historiaModal');
  if (el) { new bootstrap.Modal(el).show(); }
}

// ── VALIDACION FORMULARIO CONTACTO ──
function submitForm() {
  var nombre   = (document.getElementById('nombre') || {}).value || '';
  var apellido = (document.getElementById('apellido') || {}).value || '';
  var email    = (document.getElementById('email') || {}).value || '';
  var asunto   = (document.getElementById('asunto') || {}).value || '';
  var mensaje  = (document.getElementById('mensaje') || {}).value || '';

  if (!nombre.trim() || !apellido.trim()) {
    showAlert('Por favor ingresa tu nombre y apellido.', 'warning');
    return;
  }
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showAlert('Por favor ingresa un correo electronico valido.', 'warning');
    return;
  }
  if (!asunto) {
    showAlert('Por favor selecciona un asunto.', 'warning');
    return;
  }
  if (!mensaje.trim() || mensaje.trim().length < 10) {
    showAlert('Por favor escribe un mensaje de al menos 10 caracteres.', 'warning');
    return;
  }

  var successEl = document.getElementById('successModal');
  if (successEl) {
    new bootstrap.Modal(successEl).show();
    ['nombre','apellido','email','telefono','asunto','mensaje'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
  } else {
    showAlert('Mensaje enviado con exito! Arriba Licey!', 'success');
  }
}

// ── NAVBAR SCROLL ──
window.addEventListener('scroll', function() {
  var nav = document.getElementById('mainNav');
  if (!nav) return;
  nav.style.boxShadow = window.scrollY > 60
    ? '0 4px 30px rgba(0,0,0,0.5)'
    : '0 2px 20px rgba(0,0,0,0.3)';
});

// ── FADE IN ON SCROLL ──
function observeFadeIn() {
  var els = document.querySelectorAll('.tarjeta-estadistica, .tarjeta-jugador, .tarjeta-noticia, .tarjeta-lista, .tarjeta-media, .elemento-contacto, .tarjeta-enlace');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function(el) { el.classList.add('aparecer-arriba'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function() { entry.target.classList.add('aparecer-arriba'); }, i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(function(el) { obs.observe(el); });
}

// ── COOKIE BANNER ──
function showCookieBanner() {
  if (localStorage.getItem('licey-cookies-accepted')) return;
  var banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.style.cssText = [
    'position:fixed;bottom:0;left:0;right:0;',
    'background:#001850;color:#fff;padding:1rem 2rem;',
    'display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;',
    'z-index:9999;box-shadow:0 -4px 20px rgba(0,0,0,0.3);',
    'font-family:"Source Sans 3",sans-serif;font-size:0.9rem;'
  ].join('');
  banner.innerHTML =
    '<div style="display:flex;align-items:center;gap:0.6rem;">' +
    '<i class="bi bi-shield-lock-fill" style="color:#FFD700;font-size:1.2rem;"></i>' +
    '<span>Usamos cookies para mejorar tu experiencia. ' +
    '<a href="#" data-bs-toggle="modal" data-bs-target="#privacyModal" style="color:#FFD700;text-decoration:underline;">Ver politicas</a></span></div>' +
    '<button onclick="acceptCookies()" style="background:linear-gradient(135deg,#C9A800,#FFD700);color:#1A1A2E;' +
    'border:none;border-radius:8px;padding:0.5rem 1.6rem;font-family:Oswald,sans-serif;font-weight:600;cursor:pointer;">Aceptar</button>';
  document.body.appendChild(banner);
}

function acceptCookies() {
  localStorage.setItem('licey-cookies-accepted', 'true');
  var banner = document.getElementById('cookieBanner');
  if (banner) banner.remove();
  showAlert('Cookies aceptadas! Gracias por visitarnos!', 'success');
}

// ── HOVER EFFECTS JS ──
function applyHoverEffects() {
  // Player cards: azul al hover
  document.querySelectorAll('.tarjeta-jugador').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      card.style.background = '#003087';
      card.querySelectorAll('h5').forEach(function(el) { el.style.color = '#FFD700'; });
      card.querySelectorAll('p').forEach(function(el) { el.style.color = 'rgba(255,255,255,0.8)'; });
    });
    card.addEventListener('mouseleave', function() {
      card.style.background = '';
      card.querySelectorAll('h5').forEach(function(el) { el.style.color = ''; });
      card.querySelectorAll('p').forEach(function(el) { el.style.color = ''; });
    });
  });

  // Stat cards: fondo azul al hover
  document.querySelectorAll('.tarjeta-estadistica').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      card.style.background = '#003087';
      card.querySelectorAll('.numero-estadistica').forEach(function(el) { el.style.color = '#FFD700'; });
      card.querySelectorAll('.etiqueta-estadistica').forEach(function(el) { el.style.color = 'rgba(255,255,255,0.7)'; });
      card.querySelectorAll('.icono-estadistica').forEach(function(el) { el.style.color = '#fff'; });
    });
    card.addEventListener('mouseleave', function() {
      card.style.background = '';
      card.querySelectorAll('.numero-estadistica, .etiqueta-estadistica, .icono-estadistica').forEach(function(el) { el.style.color = ''; });
    });
  });
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', function() {
  observeFadeIn();
  applyHoverEffects();
  setTimeout(showCookieBanner, 2000);
});
