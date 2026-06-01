/* ═══════════════════════════════════════
   CRISTIAN CAFFER — ADMIN.JS
   Standalone admin panel logic
═══════════════════════════════════════ */

'use strict';

/* ─── SHARED DATA ─── */
const DEFAULT_PROPS = [
  { id:1, title:'Casa amplia a metros del centro', price:'$48.000.000', op:'venta', loc:'Balnearia, Córdoba', mapUrl:'', beds:3, baths:2, m2:'180', imgs:['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=80'], desc:'Hermosa propiedad en excelentes condiciones. Cuenta con jardín delantero y trasero, cochera cubierta para 2 autos y amplio patio. Ideal para familia.', status:'active' },
  { id:2, title:'Departamento luminoso — Primer piso', price:'$85.000 / mes', op:'alquiler', loc:'Centro, Balnearia', mapUrl:'', beds:2, baths:1, m2:'65', imgs:['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80'], desc:'Moderno departamento en el corazón de la ciudad. Muy luminoso con orientación norte. Cocina equipada y piso de porcelanato.', status:'active' },
  { id:3, title:'Terreno esquina — Ideal inversión', price:'$12.000.000', op:'terreno', loc:'Balnearia Norte', mapUrl:'', beds:0, baths:0, m2:'450', imgs:['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80'], desc:'Excelente terreno en esquina ideal para proyecto residencial o comercial. Todos los servicios disponibles.', status:'active' },
  { id:4, title:'Casa familiar con pileta y parque', price:'$62.000.000', op:'venta', loc:'Balnearia, Córdoba', mapUrl:'', beds:4, baths:2, m2:'220', imgs:['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80'], desc:'Propiedad soñada con amplio parque y pileta climatizada. Barrio residencial tranquilo con seguridad.', status:'active' },
  { id:5, title:'Chalet en barrio residencial', price:'$35.000.000', op:'venta', loc:'Balnearia Sur, Córdoba', mapUrl:'', beds:3, baths:1, m2:'140', imgs:['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80'], desc:'Encantador chalet en barrio tranquilo. Jardín con plantas frutales, galería cubierta y garaje.', status:'active' },
  { id:6, title:'Local comercial en planta baja', price:'$55.000 / mes', op:'alquiler', loc:'Av. Colón, Balnearia', mapUrl:'', beds:0, baths:1, m2:'80', imgs:['https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80'], desc:'Local comercial en excelente ubicación sobre la avenida principal. Amplio salón, baño y depósito.', status:'reserved' },
];

const STORAGE_KEY  = 'cc4_props';
const ADMIN_PASS   = 'admin123';
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=700&q=80';

let props = loadProps();
let pendingImgs = []; // array of {src: base64orUrl}

function loadProps() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [...DEFAULT_PROPS];
    return saved.map(p => {
      if (!p.imgs) p.imgs = p.img ? [p.img] : [];
      return p;
    });
  } catch { return [...DEFAULT_PROPS]; }
}
function saveProps()    { localStorage.setItem(STORAGE_KEY, JSON.stringify(props)); }
function nextId()       { return props.length ? Math.max(...props.map(p => p.id)) + 1 : 1; }
function statusLabel(s) { return { active:'Activa', reserved:'Reservada', sold:'Vendida' }[s] || s; }
function firstImg(p)    { return (p.imgs && p.imgs[0]) || FALLBACK_IMG; }

/* ─── CLOCK ─── */
function updateClock() {
  const el = document.getElementById('ap-datetime');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString('es-AR', { weekday:'short', day:'2-digit', month:'short' })
    + ' · ' + now.toLocaleTimeString('es-AR', { hour:'2-digit', minute:'2-digit' });
}
setInterval(updateClock, 1000);
updateClock();

/* ─── AUTH ─── */
function doLogin() {
  const pw  = document.getElementById('admin-pw').value;
  const err = document.getElementById('lm-error');
  if (pw === ADMIN_PASS) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-app').classList.remove('hidden');
    refreshAdmin();
    switchTab('dashboard');
    setTimeout(loadSiteImgPreviews, 100);
  } else {
    err.classList.remove('hidden');
    document.getElementById('admin-pw').value = '';
    document.getElementById('admin-pw').focus();
  }
}
function doLogout() {
  document.getElementById('admin-app').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('admin-pw').value = '';
  document.getElementById('lm-error').classList.add('hidden');
}
document.getElementById('admin-pw').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
  document.getElementById('lm-error').classList.add('hidden');
});

/* ─── TAB SWITCHING ─── */
document.querySelectorAll('.ap-nav-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});
function switchTab(name) {
  document.querySelectorAll('.ap-nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.ap-tab').forEach(t => t.classList.toggle('active', t.id === 'tab-' + name));
  const titles = { dashboard:'Dashboard', properties:'Gestión de Propiedades', settings:'Configuración' };
  document.getElementById('ap-page-title').textContent = titles[name] || name;
}

/* ─── REFRESH ─── */
function refreshAdmin() {
  props = loadProps();
  renderDashboard();
  renderPropTable();
}

/* ─── DASHBOARD ─── */
function renderDashboard() {
  const active   = props.filter(p => p.status === 'active').length;
  const venta    = props.filter(p => p.op === 'venta').length;
  const alquiler = props.filter(p => p.op === 'alquiler').length;

  document.getElementById('ap-stats-grid').innerHTML = `
    <div class="ap-stat-card">
      <div class="asc-top"><div></div>
        <svg class="asc-icon" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
      </div>
      <div class="asc-n">${props.length}</div><div class="asc-l">Total propiedades</div>
    </div>
    <div class="ap-stat-card">
      <div class="asc-top"><div></div>
        <svg class="asc-icon" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
      </div>
      <div class="asc-n">${active}</div><div class="asc-l">Propiedades activas</div>
      <div class="asc-delta">● Visible en el sitio</div>
    </div>
    <div class="ap-stat-card">
      <div class="asc-top"><div></div>
        <svg class="asc-icon" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
      </div>
      <div class="asc-n">${venta + alquiler}</div><div class="asc-l">Venta + Alquiler</div>
    </div>
  `;

  const recent = [...props].reverse().slice(0, 5);
  document.getElementById('recent-props').innerHTML = recent.length
    ? recent.map(p => `
        <div class="rp-item">
          <img class="rp-img" src="${firstImg(p)}" onerror="this.src='${FALLBACK_IMG}'" alt="">
          <div style="flex:1"><div class="rp-title">${p.title}</div><div class="rp-price">${p.price}</div></div>
          <span class="ptr-badge ptr-status-${p.status}">${statusLabel(p.status)}</span>
        </div>`).join('')
    : '<div class="msg-empty">Sin propiedades.</div>';
}

/* ─── PROP TABLE ─── */
function renderPropTable() {
  const tbl = document.getElementById('prop-table');
  if (!props.length) {
    tbl.innerHTML = '<div class="msg-empty">Sin propiedades. Agregá una con el botón "Nueva propiedad".</div>';
    return;
  }
  tbl.innerHTML = `
    <div class="prop-table-header">
      <span></span><span>Propiedad</span><span>Precio</span><span>Tipo</span><span>Estado</span><span>Acciones</span>
    </div>
    ${props.map(p => `
      <div class="prop-table-row">
        <img class="ptr-img" src="${firstImg(p)}" onerror="this.src='${FALLBACK_IMG}'" alt="">
        <div><div class="ptr-title">${p.title}</div><div class="ptr-sub">${p.loc}</div></div>
        <div class="ptr-price">${p.price}</div>
        <div><span class="ptr-badge ptr-status-active" style="text-transform:capitalize">${p.op}</span></div>
        <div><span class="ptr-badge ptr-status-${p.status}">${statusLabel(p.status)}</span></div>
        <div class="ptr-btns">
          <button class="ptr-btn" onclick="startEdit(${p.id})" title="Editar">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="ptr-btn del" onclick="deleteProp(${p.id})" title="Eliminar">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </div>`).join('')}
  `;
}

/* ─── MULTI IMAGE HANDLING ─── */
function handleImgUpload(input) {
  if (!input.files || !input.files.length) return;
  const files = Array.from(input.files);
  let loaded = 0;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      pendingImgs.push({ src: e.target.result });
      loaded++;
      if (loaded === files.length) renderThumbsGrid();
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function renderThumbsGrid() {
  const grid = document.getElementById('f-imgs-preview');
  if (!pendingImgs.length) {
    grid.innerHTML = '<span class="img-thumb-empty">Sin imágenes cargadas</span>';
    return;
  }
  grid.innerHTML = pendingImgs.map((img, i) => `
    <div class="img-thumb-item ${i === 0 ? 'is-cover' : ''}">
      <img src="${img.src}" alt="img ${i+1}" />
      <button type="button" class="img-thumb-remove" onclick="removeThumb(${i})">✕</button>
      <button type="button" class="img-thumb-cover-btn" onclick="setCover(${i})">${i === 0 ? '★ Portada' : 'Portada'}</button>
    </div>`).join('');
}

function removeThumb(i) {
  pendingImgs.splice(i, 1);
  renderThumbsGrid();
}

function setCover(i) {
  const [item] = pendingImgs.splice(i, 1);
  pendingImgs.unshift(item);
  renderThumbsGrid();
}

/* ─── ADD / EDIT ─── */
function showAddForm() {
  const card = document.getElementById('prop-form-card');
  card.classList.remove('hidden');
  document.getElementById('pfc-title').textContent = 'Nueva propiedad';
  document.getElementById('pf-submit').textContent = 'Guardar propiedad';
  document.getElementById('edit-id').value = '';
  document.getElementById('prop-form').reset();
  pendingImgs = [];
  renderThumbsGrid();
  card.scrollIntoView({ behavior:'smooth', block:'start' });
}
function hideAddForm() {
  document.getElementById('prop-form-card').classList.add('hidden');
  document.getElementById('prop-form').reset();
  document.getElementById('edit-id').value = '';
  pendingImgs = [];
  renderThumbsGrid();
}

document.getElementById('prop-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const eid = parseInt(document.getElementById('edit-id').value);
  const btn = document.getElementById('pf-submit');
  btn.textContent = 'Guardando...'; btn.disabled = true;

  const imgs = pendingImgs.length > 0
    ? pendingImgs.map(x => x.src)
    : (eid ? (props.find(p => p.id === eid)?.imgs || []) : []);

  const newProp = {
    id:     eid || nextId(),
    title:  document.getElementById('f-title').value.trim(),
    price:  document.getElementById('f-price').value.trim(),
    op:     document.getElementById('f-op').value,
    loc:    document.getElementById('f-loc').value.trim(),
    mapUrl: document.getElementById('f-mapurl').value.trim(),
    beds:   parseInt(document.getElementById('f-beds').value)  || 0,
    baths:  parseInt(document.getElementById('f-baths').value) || 0,
    m2:     document.getElementById('f-m2').value.trim(),
    imgs,
    desc:   document.getElementById('f-desc').value.trim(),
    status: document.getElementById('f-status').value,
  };

  if (eid) {
    const idx = props.findIndex(p => p.id === eid);
    if (idx > -1) props[idx] = newProp;
    showToast('Propiedad actualizada ✓', 'gold');
  } else {
    props.push(newProp);
    showToast('Propiedad agregada ✓', 'success');
  }
  btn.textContent = 'Guardar propiedad'; btn.disabled = false;
  saveProps(); hideAddForm(); refreshAdmin();
});

function startEdit(id) {
  const p = props.find(x => x.id === id);
  if (!p) return;
  document.getElementById('edit-id').value  = p.id;
  document.getElementById('f-title').value  = p.title;
  document.getElementById('f-price').value  = p.price;
  document.getElementById('f-op').value     = p.op;
  document.getElementById('f-loc').value    = p.loc;
  document.getElementById('f-mapurl').value = p.mapUrl || '';
  document.getElementById('f-beds').value   = p.beds;
  document.getElementById('f-baths').value  = p.baths;
  document.getElementById('f-m2').value     = p.m2;
  document.getElementById('f-desc').value   = p.desc || '';
  document.getElementById('f-status').value = p.status;
  pendingImgs = (p.imgs || []).map(src => ({ src }));
  renderThumbsGrid();
  document.getElementById('pfc-title').textContent = 'Editar propiedad';
  document.getElementById('pf-submit').textContent = 'Guardar cambios';
  const card = document.getElementById('prop-form-card');
  card.classList.remove('hidden');
  card.scrollIntoView({ behavior:'smooth', block:'start' });
}

function deleteProp(id) {
  if (!confirm('¿Eliminar esta propiedad? Esta acción no se puede deshacer.')) return;
  props = props.filter(p => p.id !== id);
  saveProps(); refreshAdmin();
  showToast('Propiedad eliminada', 'error');
}

function resetProps() {
  props = [...DEFAULT_PROPS];
  saveProps(); refreshAdmin();
  showToast('Propiedades reseteadas ✓', 'gold');
}

/* ─── SITE IMAGE HELPERS ─── */
function saveSiteImg(input, storageKey, labelId, previewId) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    localStorage.setItem(storageKey, e.target.result);
    const prev = document.getElementById(previewId);
    if (prev) { prev.src = e.target.result; prev.classList.add('show'); }
    const lbl = document.getElementById(labelId);
    if (lbl) lbl.textContent = input.files[0].name + ' ✓';
    showToast('Imagen guardada ✓', 'success');
  };
  reader.readAsDataURL(input.files[0]);
}
function loadSiteImgPreviews() {
  const heroKey = localStorage.getItem('cc4_hero_bg');
  if (heroKey) {
    const p = document.getElementById('hero-img-prev');
    if (p) { p.src = heroKey; p.classList.add('show'); document.getElementById('hero-img-label').textContent = 'Imagen cargada ✓'; }
  }
  const aboutKey = localStorage.getItem('cc4_about_img');
  if (aboutKey) {
    const p = document.getElementById('about-img-prev');
    if (p) { p.src = aboutKey; p.classList.add('show'); document.getElementById('about-img-label').textContent = 'Imagen cargada ✓'; }
  }
}

/* ─── TOAST ─── */
let toastTimer;
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.className = 'toast', 3200);
}