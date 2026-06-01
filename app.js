/* ═══════════════════════════════════════
   CRISTIAN CAFFER — APP.JS
═══════════════════════════════════════ */

'use strict';

const DEFAULT_PROPS = [
  { id:1, title:'Casa amplia a metros del centro', price:'$48.000.000', op:'venta', loc:'Balnearia, Córdoba', beds:3, baths:2, m2:'180', img:'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=80', desc:'Hermosa propiedad en excelentes condiciones. Cuenta con jardín delantero y trasero, cochera cubierta para 2 autos y amplio patio.', status:'active' },
  { id:2, title:'Departamento luminoso — Primer piso', price:'$85.000 / mes', op:'alquiler', loc:'Centro, Balnearia', beds:2, baths:1, m2:'65', img:'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80', desc:'Moderno departamento en el corazón de la ciudad. Muy luminoso con orientación norte. Cocina equipada.', status:'active' },
  { id:3, title:'Terreno esquina — Ideal inversión', price:'$12.000.000', op:'terreno', loc:'Balnearia Norte', beds:0, baths:0, m2:'450', img:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80', desc:'Excelente terreno en esquina ideal para proyecto residencial o comercial.', status:'active' },
  { id:4, title:'Casa familiar con pileta y parque', price:'$62.000.000', op:'venta', loc:'Balnearia, Córdoba', beds:4, baths:2, m2:'220', img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80', desc:'Propiedad soñada con amplio parque y pileta climatizada.', status:'active' },
  { id:5, title:'Chalet en barrio residencial', price:'$35.000.000', op:'venta', loc:'Balnearia Sur, Córdoba', beds:3, baths:1, m2:'140', img:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80', desc:'Encantador chalet en barrio tranquilo. Jardín con plantas frutales y garaje.', status:'active' },
  { id:6, title:'Local comercial en planta baja', price:'$55.000 / mes', op:'alquiler', loc:'Av. Colón, Balnearia', beds:0, baths:1, m2:'80', img:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80', desc:'Local comercial en excelente ubicación sobre avenida principal.', status:'reserved' },
];

const STORAGE_KEY  = 'cc4_props';
const MESSAGES_KEY = 'cc4_messages';
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=700&q=80';
const WA_NUMBER    = '543563430290';

function loadProps() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [...DEFAULT_PROPS]; } catch { return [...DEFAULT_PROPS]; } }

let props = loadProps();
let activeFilter = 'all';
let activeSearchType = 'all';

/* ═══ LOGO UPLOAD ═══ */
function handleLogoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const src = ev.target.result;
    localStorage.setItem('cc4_logo', src);
    applyLogo(src);
    showToast('Logo actualizado correctamente ✓', 'gold');
  };
  reader.readAsDataURL(file);
}

function applyLogo(src) {
  const navImg = document.getElementById('logo-img');
  const navCC  = document.getElementById('logo-cc');
  const ftImg  = document.getElementById('footer-logo-img');
  const ftCC   = document.getElementById('footer-logo-cc');
  if (navImg) { navImg.src = src; navImg.style.display = 'inline-block'; if (navCC) navCC.style.display = 'none'; }
  if (ftImg)  { ftImg.src  = src; ftImg.style.display  = 'inline-block'; if (ftCC) ftCC.style.display  = 'none'; }
}

(function loadSavedLogo() {
  const saved = localStorage.getItem('cc4_logo');
  if (saved) applyLogo(saved);
})();

/* ═══ CURSOR ═══ */
const dot = document.getElementById('cursor-dot'), ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
(function ar() { rx += (mx - rx) * .12; ry += (my - ry) * .12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(ar); })();
function addHover(s) { document.querySelectorAll(s).forEach(el => { el.addEventListener('mouseenter', () => ring.classList.add('hover')); el.addEventListener('mouseleave', () => ring.classList.remove('hover')); }); }

/* ═══ LOADER ═══ */
window.addEventListener('load', () => { setTimeout(() => { document.getElementById('loader').classList.add('done'); triggerReveal(); animateCounters(); }, 1600); });

/* ═══ REVEAL ═══ */
const rvObs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); rvObs.unobserve(e.target); } }), { threshold: .1 });
function triggerReveal() { document.querySelectorAll('.reveal-up').forEach(el => rvObs.observe(el)); }
function reObserve() { document.querySelectorAll('.reveal-up:not(.visible)').forEach(el => rvObs.observe(el)); }

/* ═══ NAVBAR ═══ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
  const wa = document.getElementById('wa-float'); if (wa) wa.style.opacity = window.scrollY > 200 ? '1' : '0';
}, { passive: true });

/* ═══ MOBILE MENU ═══ */
const hb = document.getElementById('hamburger'), mm = document.getElementById('mobile-menu');
hb.addEventListener('click', () => { hb.classList.toggle('open'); mm.classList.toggle('open'); });
mm.querySelectorAll('.mm-link').forEach(l => l.addEventListener('click', () => { hb.classList.remove('open'); mm.classList.remove('open'); }));

/* ═══ HERO SEARCH ═══ */
document.querySelectorAll('.hs-tab').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.hs-tab').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeSearchType = btn.dataset.type; }); });
function runSearch() { activeFilter = activeSearchType; document.querySelectorAll('.pf-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === activeFilter)); renderProps(); document.getElementById('propiedades').scrollIntoView({ behavior: 'smooth' }); }

/* ═══ COUNTERS ═══ */
function animateCounters() {
  document.querySelectorAll('.hs-n[data-count]').forEach(el => { const t = parseInt(el.dataset.count); let n = 0; const s = Math.ceil(t / 60); const iv = setInterval(() => { n = Math.min(n + s, t); el.textContent = n; if (n >= t) clearInterval(iv); }, 25); });
  const sp = document.getElementById('stat-props'); if (sp) { let n = 0, t = props.filter(p => p.status === 'active').length; const iv = setInterval(() => { n = Math.min(n + 1, t); sp.textContent = n; if (n >= t) clearInterval(iv); }, 80); }
}

/* ═══ RENDER PROPS ═══ */
function filteredProps() { return props.filter(p => activeFilter === 'all' || p.op === activeFilter); }
function renderProps() {
  props = loadProps();
  const grid = document.getElementById('props-grid'), empty = document.getElementById('props-empty'), count = document.getElementById('pf-count');
  const list = filteredProps();
  count.textContent = list.length + ' propiedad' + (list.length !== 1 ? 'es' : '');
  if (!list.length) { grid.innerHTML = ''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  grid.innerHTML = list.map(p => `
    <div class="prop-card reveal-up" style="--d:${(Math.random() * .1).toFixed(2)}s" onclick="openPropModal(${p.id})">
      <div class="pc-img">
        <img src="${p.img || FALLBACK_IMG}" alt="${p.title}" loading="lazy" onerror="this.src='${FALLBACK_IMG}'" />
        <span class="pc-badge ${p.status === 'reserved' ? 'reservada' : p.op}">${p.status === 'reserved' ? 'Reservada' : p.op === 'venta' ? 'En venta' : p.op === 'alquiler' ? 'Alquiler' : 'Terreno'}</span>
        <button class="pc-fav" onclick="event.stopPropagation();toggleFav(this)"><svg width="14" height="14" fill="none" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg></button>
      </div>
      <div class="pc-body">
        <div class="pc-price">${p.price}</div>
        <div class="pc-title">${p.title}</div>
        <div class="pc-loc"><svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>${p.loc}</div>
        <div class="pc-features">
          ${p.beds > 0 ? `<span class="pc-feat"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M2 4v16M22 4v16M2 8h20M2 16h20"/></svg>${p.beds} dorm.</span>` : ''}
          ${p.baths > 0 ? `<span class="pc-feat"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z"/></svg>${p.baths} baño${p.baths > 1 ? 's' : ''}</span>` : ''}
          ${p.m2 ? `<span class="pc-feat"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>${p.m2} m²</span>` : ''}
        </div>
        <button class="pc-cta">Ver detalles</button>
      </div>
    </div>`).join('');
  reObserve(); addHover('.prop-card');
}

/* ═══ PROP MODAL — con WhatsApp ═══ */
function openPropModal(id) {
  const p = props.find(x => x.id === id); if (!p) return;

  const waMsg = encodeURIComponent(
    `Hola! Vi la web y me interesa la siguiente propiedad:\n\n` +
    `🏠 *${p.title}*\n` +
    `💰 Precio: ${p.price}\n` +
    `📍 Ubicación: ${p.loc}\n\n` +
    `¿Me podés dar más información?`
  );
  const waLink = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

  const opLabel = p.status === 'reserved' ? 'Reservada' : p.op === 'venta' ? 'En venta' : p.op === 'alquiler' ? 'Alquiler' : 'Terreno';
  const opClass = p.status === 'reserved' ? 'reservada' : p.op;

  document.getElementById('pm-content').innerHTML = `
    <div class="pm-layout">
      <div class="pm-img-panel">
        <img src="${p.img || FALLBACK_IMG}" alt="${p.title}" onerror="this.src='${FALLBACK_IMG}'" />
        <div class="pm-img-overlay">
          <span class="pc-badge pm-badge ${opClass}">${opLabel}</span>
        </div>
      </div>
      <div class="pm-info-panel">
        <div class="pm-info-top">
          <div class="pm-price">${p.price}</div>
          <div class="pm-title">${p.title}</div>
          <div class="pm-loc">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${p.loc}
          </div>
        </div>
        <div class="pm-stats-row">
          ${p.beds > 0 ? `
          <div class="pm-stat-box">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2 4v16M22 4v16M2 8h20M2 16h20"/></svg>
            <span class="pm-stat-n">${p.beds}</span>
            <span class="pm-stat-l">Dorm.</span>
          </div>` : ''}
          ${p.baths > 0 ? `
          <div class="pm-stat-box">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z"/><path d="M6 12V5a2 2 0 012-2h0a2 2 0 012 2v1"/></svg>
            <span class="pm-stat-n">${p.baths}</span>
            <span class="pm-stat-l">Baños</span>
          </div>` : ''}
          ${p.m2 ? `
          <div class="pm-stat-box">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            <span class="pm-stat-n">${p.m2}</span>
            <span class="pm-stat-l">m²</span>
          </div>` : ''}
          <div class="pm-stat-box">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            <span class="pm-stat-n" style="font-size:11px;font-weight:600">${opLabel}</span>
            <span class="pm-stat-l">Tipo</span>
          </div>
        </div>
        ${p.desc ? `<div class="pm-desc">${p.desc}</div>` : ''}
        <a href="${waLink}" target="_blank" class="pm-wa-btn">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Consultar por WhatsApp
        </a>
      </div>
    </div>`;
  document.getElementById('prop-modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePropModal() { document.getElementById('prop-modal-overlay').classList.remove('open'); document.body.style.overflow = ''; }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePropModal(); });

/* ═══ FILTERS ═══ */
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', () => { document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeFilter = btn.dataset.filter; renderProps(); });
});
window.setFilter = function (f) { activeFilter = f; document.querySelectorAll('.pf-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === f)); renderProps(); };

/* ═══ FAV ═══ */
function toggleFav(btn) { const svg = btn.querySelector('svg'); const isFav = svg.style.fill === 'rgb(201, 169, 110)'; svg.style.fill = isFav ? 'none' : 'rgb(201, 169, 110)'; svg.style.stroke = isFav ? '' : 'rgb(201, 169, 110)'; showToast(isFav ? 'Eliminado de favoritos' : 'Guardado en favoritos ♥', isFav ? '' : 'gold'); }

/* ═══ CONTACT FORM — redirige a WhatsApp ═══ */
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const btn = this.querySelector('.cf-submit');
  btn.textContent = 'Redirigiendo...';
  btn.disabled = true;

  const inp = this.querySelectorAll('input, select, textarea');
  const nombre   = inp[0].value.trim() || 'Sin nombre';
  const telefono = inp[1].value.trim() || 'No indicado';
  const email    = inp[2].value.trim() || 'No indicado';
  const motivo   = inp[3].value       || 'No indicado';
  const presup   = inp[4].value       || 'No indicado';
  const mensaje  = inp[5].value.trim() || '';

  // Guardar en localStorage
  const msg = {
    id: Date.now(),
    name: nombre, phone: telefono, email, type: motivo, budget: presup, message: mensaje,
    date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    read: false
  };
  const existing = (() => { try { return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || []; } catch { return []; } })();
  existing.unshift(msg);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(existing));

  // Armar mensaje WhatsApp
  let texto = `🏠 *Nueva consulta — Cristian Caffer Inmobiliaria*\n\n`;
  texto += `👤 *Nombre:* ${nombre}\n`;
  texto += `📞 *Teléfono:* ${telefono}\n`;
  texto += `📧 *Email:* ${email}\n`;
  texto += `📋 *Motivo:* ${motivo}\n`;
  texto += `💰 *Presupuesto:* ${presup}\n`;
  if (mensaje) texto += `\n💬 *Mensaje:*\n${mensaje}`;

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`;

  setTimeout(() => {
    document.getElementById('cf-success').classList.remove('hidden');
    this.reset();
    btn.innerHTML = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Enviar por WhatsApp`;
    btn.disabled = false;
    setTimeout(() => document.getElementById('cf-success').classList.add('hidden'), 6000);
    window.open(url, '_blank');
  }, 800);
});

/* ═══ FOOTER LINKS ═══ */
document.querySelectorAll('.footer-links a').forEach(a => { a.addEventListener('click', function(e) { const s = this.getAttribute('href'); if (s && s.startsWith('#')) { e.preventDefault(); document.querySelector(s)?.scrollIntoView({ behavior: 'smooth' }); } }); });

/* ═══ TOAST ═══ */
let toastTimer;
function showToast(msg, type = '') { const t = document.getElementById('toast'); t.textContent = msg; t.className = 'toast show' + (type ? ' ' + type : ''); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.className = 'toast', 3200); }

/* ═══ SITE IMAGES FROM ADMIN ═══ */
function loadSiteImages() {
  const heroBg = localStorage.getItem('cc4_hero_bg');
  if (heroBg) { const img = document.querySelector('.hero-bg-img'); if (img) img.src = heroBg; }
  const aboutImg = localStorage.getItem('cc4_about_img');
  if (aboutImg) { const img = document.querySelector('.about-img-main img'); if (img) img.src = aboutImg; }
}

/* ═══ INIT ═══ */
(function() {
  renderProps();
  loadSiteImages();
  const wa = document.getElementById('wa-float'); if (wa) wa.style.cssText += ';opacity:0;transition:opacity .3s';
  addHover('a,button,.prop-card,.testi-card,.about-feature,.cd-item,.pt-step');
})();