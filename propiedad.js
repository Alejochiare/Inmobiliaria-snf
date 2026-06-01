'use strict';

const WA_NUMBER    = '543563430290';
const STORAGE_KEY  = 'cc4_props';
const MESSAGES_KEY = 'cc4_messages';
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=700&q=80';

const DEFAULT_PROPS = [
  { id:1, title:'Casa amplia a metros del centro',     price:'$48.000.000',   op:'venta',    loc:'Balnearia, Córdoba',       mapUrl:'', beds:3, baths:2, m2:'180', imgs:['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=80'], desc:'Hermosa propiedad en excelentes condiciones. Cuenta con jardín delantero y trasero, cochera cubierta para 2 autos y amplio patio.', status:'active' },
  { id:2, title:'Departamento luminoso — Primer piso', price:'$85.000 / mes', op:'alquiler', loc:'Centro, Balnearia',          mapUrl:'', beds:2, baths:1, m2:'65',  imgs:['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80'], desc:'Moderno departamento en el corazón de la ciudad. Muy luminoso con orientación norte. Cocina equipada.', status:'active' },
  { id:3, title:'Terreno esquina — Ideal inversión',   price:'$12.000.000',   op:'terreno',  loc:'Balnearia Norte',            mapUrl:'', beds:0, baths:0, m2:'450', imgs:['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80'], desc:'Excelente terreno en esquina ideal para proyecto residencial o comercial. Todos los servicios disponibles.', status:'active' },
  { id:4, title:'Casa familiar con pileta y parque',   price:'$62.000.000',   op:'venta',    loc:'Balnearia, Córdoba',         mapUrl:'', beds:4, baths:2, m2:'220', imgs:['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80'], desc:'Propiedad soñada con amplio parque y pileta climatizada.', status:'active' },
  { id:5, title:'Chalet en barrio residencial',        price:'$35.000.000',   op:'venta',    loc:'Balnearia Sur, Córdoba',     mapUrl:'', beds:3, baths:1, m2:'140', imgs:['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80'], desc:'Encantador chalet en barrio tranquilo. Jardín con plantas frutales y garaje.', status:'active' },
  { id:6, title:'Local comercial en planta baja',      price:'$55.000 / mes', op:'alquiler', loc:'Av. Colón, Balnearia',       mapUrl:'', beds:0, baths:1, m2:'80',  imgs:['https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80'], desc:'Local comercial en excelente ubicación sobre avenida principal.', status:'reserved' },
];

function loadProps() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.length) {
      return saved.map(p => { if (!p.imgs) p.imgs = p.img ? [p.img] : []; return p; });
    }
  } catch {}
  return [...DEFAULT_PROPS];
}

/* ── lightbox state ── */
let lbImages = [], lbCurrent = 0;

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  /* logo */
  const logoSrc = localStorage.getItem('cc4_logo');
  if (logoSrc) {
    const img = document.getElementById('pd-logo-img');
    img.src = logoSrc; img.style.display = 'block';
    document.getElementById('pd-logo-cc').style.display = 'none';
  }

  /* find property */
  const id = parseInt(new URLSearchParams(window.location.search).get('id'));
  const p  = loadProps().find(x => x.id === id);
  if (!p) { window.location.href = 'index.html'; return; }

  document.title = `${p.title} — Cristian Caffer`;
  buildGallery(p);
  buildContent(p);
  buildForm(p);
});

/* ── GALLERY ── */
function buildGallery(p) {
  const imgs = (p.imgs && p.imgs.length) ? p.imgs : [FALLBACK_IMG];
  lbImages = imgs;
  const gallery = document.getElementById('pd-gallery');

  if (imgs.length === 1) {
    gallery.classList.add('single');
    gallery.innerHTML = `
      <div class="pd-gal-main" onclick="openLightbox(0)">
        <img src="${esc(imgs[0])}" alt="${esc(p.title)}" onerror="this.src='${FALLBACK_IMG}'" />
      </div>`;
    return;
  }

  const side  = imgs.slice(1, 3);
  const extra = imgs.length - 3;
  gallery.innerHTML = `
    <div class="pd-gal-main" onclick="openLightbox(0)">
      <img src="${esc(imgs[0])}" alt="${esc(p.title)}" onerror="this.src='${FALLBACK_IMG}'" />
    </div>
    <div class="pd-gal-side">
      ${side.map((src, i) => {
        const showOverlay = i === side.length - 1 && extra > 0;
        return `<div class="pd-gal-thumb" onclick="openLightbox(${i + 1})">
          <img src="${esc(src)}" alt="${esc(p.title)}" onerror="this.src='${FALLBACK_IMG}'" />
          ${showOverlay ? `<div class="pd-gal-more-overlay"><span>+${extra + 1} fotos</span></div>` : ''}
        </div>`;
      }).join('')}
    </div>`;

  /* photo count button */
  gallery.style.position = 'relative';
  const btn = document.createElement('button');
  btn.className = 'pd-photo-count';
  btn.innerHTML = `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="13" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> ${imgs.length} foto${imgs.length !== 1 ? 's' : ''}`;
  btn.addEventListener('click', () => openLightbox(0));
  gallery.appendChild(btn);
}

/* ── CONTENT ── */
function buildContent(p) {
  const badgeText  = p.status === 'reserved' ? 'Reservada' : p.op === 'venta' ? 'En venta' : p.op === 'alquiler' ? 'Alquiler' : 'Terreno';
  const badgeClass = p.status === 'reserved' ? 'reservada' : p.op;

  document.getElementById('pd-badge').className   = `pc-badge ${badgeClass}`;
  document.getElementById('pd-badge').textContent = badgeText;
  document.getElementById('pd-title').textContent = p.title;

  document.getElementById('pd-loc-row').innerHTML = `
    <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>${esc(p.loc)}`;

  /* specs */
  const specs = [];
  if (p.m2)      specs.push({ val: p.m2 + ' m²', lbl: 'Superficie' });
  if (p.beds > 0) specs.push({ val: p.beds, lbl: p.beds === 1 ? 'Dormitorio' : 'Dormitorios' });
  if (p.baths > 0) specs.push({ val: p.baths, lbl: p.baths === 1 ? 'Baño' : 'Baños' });
  specs.push({ val: p.op.charAt(0).toUpperCase() + p.op.slice(1), lbl: 'Operación' });

  document.getElementById('pd-specs-row').innerHTML = specs.map(s =>
    `<div class="pd-spec-box">
       <div class="pd-spec-label">${s.lbl}</div>
       <div class="pd-spec-val">${s.val}</div>
     </div>`
  ).join('');

  /* description */
  if (p.desc) {
    document.getElementById('pd-desc-text').textContent = p.desc;
  } else {
    document.getElementById('pd-desc-section').style.display = 'none';
  }

  /* map */
  const q = encodeURIComponent(p.loc + ', Argentina');
  document.getElementById('pd-map-content').innerHTML = `
    <div class="pd-loc-text">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>${esc(p.loc)}
    </div>
    <div class="pd-map-wrap">
      <iframe src="https://maps.google.com/maps?q=${q}&output=embed&z=14"
              loading="lazy" allowfullscreen title="Ubicación"></iframe>
    </div>
    <a href="https://maps.google.com/?q=${q}" target="_blank" rel="noopener" class="pd-map-ext-link">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>Abrir en Google Maps
    </a>`;

  /* price + whatsapp */
  document.getElementById('pd-price').textContent = p.price;

  const waMsg = encodeURIComponent(
    `Hola! Vi la web y me interesa la siguiente propiedad:\n\n` +
    `🏠 *${p.title}*\n💰 Precio: ${p.price}\n📍 Ubicación: ${p.loc}\n\n¿Me podés dar más información?`
  );
  document.getElementById('pd-wa-btn').href = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

  document.getElementById('pd-codigo').textContent = `Código de aviso: ${p.id}`;
}

/* ── FORM ── */
function buildForm(p) {
  document.getElementById('pd-msg').value =
    `Hola, vi esta propiedad en el sitio web de la inmobiliaria y me gustaría que me contacten. Propiedad: ${p.title}. Gracias.`;

  document.getElementById('pd-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn      = this.querySelector('.pd-btn-submit');
    btn.textContent = 'Enviando…'; btn.disabled = true;

    const nombre   = document.getElementById('pd-nombre').value.trim()   || 'Sin nombre';
    const telefono = document.getElementById('pd-telefono').value.trim()  || 'No indicado';
    const email    = document.getElementById('pd-email').value.trim()     || 'No indicado';
    const mensaje  = document.getElementById('pd-msg').value.trim()       || '';

    /* save to admin */
    const entry = {
      id: Date.now(), name: nombre, phone: telefono, email,
      type: 'Consulta propiedad', budget: '',
      message: mensaje, property: p.title, propertyId: p.id,
      date: new Date().toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'numeric' }),
      read: false
    };
    const msgs = (() => { try { return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || []; } catch { return []; } })();
    msgs.unshift(entry);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));

    setTimeout(() => {
      document.getElementById('pd-form-success').classList.add('show');
      this.reset();
      document.getElementById('pd-msg').value =
        `Hola, vi esta propiedad en el sitio web de la inmobiliaria y me gustaría que me contacten. Propiedad: ${p.title}. Gracias.`;
      btn.textContent = 'Contactar'; btn.disabled = false;
      setTimeout(() => document.getElementById('pd-form-success').classList.remove('show'), 6000);
    }, 600);
  });
}

/* ── LIGHTBOX ── */
window.openLightbox = function(idx) {
  lbCurrent = idx;
  updateLb();
  document.getElementById('pd-lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
};
window.closeLightbox = function() {
  document.getElementById('pd-lightbox').classList.remove('open');
  document.body.style.overflow = '';
};
window.lbNext = function() { lbCurrent = (lbCurrent + 1) % lbImages.length; updateLb(); };
window.lbPrev = function() { lbCurrent = (lbCurrent - 1 + lbImages.length) % lbImages.length; updateLb(); };
function updateLb() {
  document.getElementById('pd-lb-img').src = lbImages[lbCurrent] || FALLBACK_IMG;
  document.getElementById('pd-lb-count').textContent = `${lbCurrent + 1} / ${lbImages.length}`;
}
document.addEventListener('keydown', e => {
  if (!document.getElementById('pd-lightbox').classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  else if (e.key === 'ArrowRight') lbNext();
  else if (e.key === 'ArrowLeft')  lbPrev();
});

/* ── UTIL ── */
function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
