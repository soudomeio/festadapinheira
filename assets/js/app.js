// ===== FESTA DA PINHEIRA - 100% SUPABASE =====

const SUPABASE_URL = 'https://zxmddvkjspbapzifrhqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4bWRkdmtqc3BiYXB6aWZyaHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNzA5MTksImV4cCI6MjA5OTc0NjkxOX0.VYhoyzy_AYHTh5qHTrR7mIsmCb9Tz1cMSJvP7O_sI6o';
const EDGE_FUNCTION_URL = 'https://zxmddvkjspbapzifrhqh.supabase.co/functions/v1/photos';

// API REST Supabase
async function apiGet(table, query) {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query || ''}`;
  const res = await fetch(url, { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } });
  if (!res.ok) { const err = await res.text(); throw new Error(err); }
  return res.json();
}

async function apiPost(table, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(body),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(err); }
  return res.json();
}

async function apiPatch(table, query, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    method: 'PATCH',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(body),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(err); }
  return res.json();
}

async function apiDelete(table, query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    method: 'DELETE',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) { const err = await res.text(); throw new Error(err); }
  return true;
}

// ===== SESSION =====
const SESSION = {
  getUser() {
    try { return JSON.parse(sessionStorage.getItem('fp_session_user')); } catch { return null; }
  },
  setUser(u) { sessionStorage.setItem('fp_session_user', JSON.stringify(u)); },
  clear() { sessionStorage.removeItem('fp_session_user'); },
};

// ===== LOCAL STORAGE (notificacoes e cache) =====
const DB = {
  get(key, def) {
    try { return JSON.parse(localStorage.getItem('fp_' + key)) || def; }
    catch { return def; }
  },
  set(key, val) { localStorage.setItem('fp_' + key, JSON.stringify(val)); },
};

// ===== PREFERENCES =====
const PREFERENCES = [
  { id: 'trocas', label: 'Trocas de Casais' },
  { id: 'mesmo_ambiente', label: 'Sexo no mesmo ambiente' },
  { id: 'solteiras', label: 'Somente Solteiras' },
  { id: 'solteiros', label: 'Somente Solteiros' },
  { id: 'curioso', label: 'Apenas Curioso' },
];

function getPrefLabel(id) {
  const p = PREFERENCES.find(pref => pref.id === id);
  return p ? p.label : id;
}

// ===== MOCK DATA =====
const MOCK_PROFILES = [
  { id: '1', nick: 'CasalPinheira', nomeDele: 'Rafael', nomeDela: 'Juliana', cidade: 'São Paulo', preferencias: ['trocas', 'mesmo_ambiente'], fotos: ['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&fit=crop'], bio: 'Casal aventureiro procurando novas experiencias.', idadeDele: 32, idadeDela: 28, online: true },
  { id: '2', nick: 'NoiteQuente', nomeDele: 'Bruno', nomeDela: 'Carolina', cidade: 'Rio de Janeiro', preferencias: ['trocas', 'curioso'], fotos: ['https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop'], bio: 'Primeira vez em festas. Queremos conhecer pessoas legais.', idadeDele: 29, idadeDela: 26, online: true },
  { id: '3', nick: 'FogoNaMata', nomeDele: 'Fernando', nomeDela: 'Patricia', cidade: 'Curitiba', preferencias: ['mesmo_ambiente'], fotos: ['https://images.unsplash.com/photo-1621621667797-e06afc217fb0?w=600&h=800&fit=crop'], bio: 'Casal experiente e discreto.', idadeDele: 35, idadeDela: 31, online: false },
  { id: '4', nick: 'LuaDeMel', nomeDele: 'Gustavo', nomeDela: 'Amanda', cidade: 'Belo Horizonte', preferencias: ['solteiras', 'curioso'], fotos: ['https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=800&fit=crop'], bio: 'Sempre em busca de diversao.', idadeDele: 30, idadeDela: 27, online: true },
  { id: '5', nick: 'Pimenta', nomeDele: 'Diego', nomeDela: 'Fernanda', cidade: 'São Paulo', preferencias: ['trocas', 'mesmo_ambiente', 'curioso'], fotos: ['https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&h=800&fit=crop'], bio: 'Adicionando tempero na relacao.', idadeDele: 33, idadeDela: 29, online: true },
  { id: '6', nick: 'EstrelaCadente', nomeDele: 'Lucas', nomeDela: 'Mariana', cidade: 'Porto Alegre', preferencias: ['solteiros'], fotos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop'], bio: 'Casal liberal e aberto a novas experiencias.', idadeDele: 28, idadeDela: 25, online: false },
];

const MOCK_MESSAGES = [];

// ===== AUTH =====
function getCurrentUser() { return SESSION.getUser(); }
function setCurrentUser(user) { SESSION.setUser(user); }

function logout() {
  SESSION.clear();
  window.location.href = '../index.html';
}

async function loginSupabase(nick, senha) {
  try {
    const data = await apiGet('users?select=*,profiles!users_profile_id_fkey(*)&nick=ilike.' + encodeURIComponent(nick) + '&senha=eq.' + encodeURIComponent(senha));
    if (data && data.length > 0 && data[0].profiles) {
      const p = data[0].profiles;
      const user = { id: p.id, nick: p.nick, nomeDele: p.nome_dele, nomeDela: p.nome_dela, cidade: p.cidade, preferencias: p.preferencias || [], fotos: p.fotos || [], bio: p.bio || '', idadeDele: p.idade_dele || 30, idadeDela: p.idade_dela || 28, online: true };
      setCurrentUser(user);
      return true;
    }
  } catch (e) { console.log('Erro login:', e.message); }
  return false;
}

async function registerSupabase(userData, senha) {
  try {
    const existing = await apiGet('profiles?nick=eq.' + encodeURIComponent(userData.nick) + '&select=nick');
    if (existing && existing.length > 0) return false;

    const profiles = await apiPost('profiles', {
      nick: userData.nick, nome_dele: userData.nomeDele, nome_dela: userData.nomeDela,
      cidade: userData.cidade, preferencias: userData.preferencias, fotos: userData.fotos,
      bio: userData.bio || '', idade_dele: userData.idadeDele || 30, idade_dela: userData.idadeDela || 28, online: true,
    });

    if (profiles && profiles.length > 0) {
      await apiPost('users', { nick: userData.nick, senha, profile_id: profiles[0].id });
      setCurrentUser({ ...userData, id: profiles[0].id, online: true });
      return true;
    }
  } catch (e) { console.log('Erro cadastro:', e.message); }
  return false;
}

async function checkNickExistsSupabase(nick) {
  try {
    const data = await apiGet('profiles?nick=eq.' + encodeURIComponent(nick) + '&select=nick');
    return data && data.length > 0;
  } catch (e) { return false; }
}

// ===== UPLOAD DE IMAGEM =====
async function uploadImage(file) {
  const user = getCurrentUser();
  const userId = user ? user.id : 'anon';

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${SUPABASE_KEY}` },
      body: formData,
    });
    const result = await response.json();
    if (result.success && result.url) return result.url;
  } catch (e) { console.log('Edge Function falhou'); }

  try {
    const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${file.name.split('.').pop()}`;
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/fotos/${fileName}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': file.type },
      body: file,
    });
    if (res.ok) return `${SUPABASE_URL}/storage/v1/object/public/fotos/${fileName}`;
  } catch (e) { console.log('Storage direto falhou'); }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

// ===== PROFILES =====
async function getProfiles() {
  try {
    const data = await apiGet('profiles?select=*&order=created_at.desc');
    if (data && data.length > 0) {
      return data.map(p => ({ id: p.id, nick: p.nick, nomeDele: p.nome_dele, nomeDela: p.nome_dela, cidade: p.cidade, preferencias: p.preferencias || [], fotos: p.fotos || [], bio: p.bio || '', idadeDele: p.idade_dele || 30, idadeDela: p.idade_dela || 28, online: p.online || false }));
    }
  } catch (e) { console.log('getProfiles erro:', e.message); }
  return MOCK_PROFILES;
}

// ===== MATCHES =====
function isUUID(id) { return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id); }

async function addMatchSupabase(fromId, toId, status) {
  if (!isUUID(fromId) || !isUUID(toId)) {
    return { id: 'm' + Date.now(), from_profile_id: fromId, to_profile_id: toId, status, mutual: false, created_at: new Date().toISOString() };
  }

  try {
    // 1. Verifica se ja existe um match do fromId para o toId
    const meuMatch = await apiGet(`matches?select=*&from_profile_id=eq.${fromId}&to_profile_id=eq.${toId}`);

    // 2. Verifica se o outro usuario ja deu interesse em mim (match mutuo)
    const matchDele = await apiGet(`matches?select=*&from_profile_id=eq.${toId}&to_profile_id=eq.${fromId}`);
    const deuInteresseEmMim = matchDele && matchDele.length > 0 && matchDele[0].status === 'interesse';

    // 3. Calcula se e mutuo: ambos deram interesse
    const eInteresse = status === 'interesse';
    const mutual = eInteresse && deuInteresseEmMim;

    // 4. Atualiza ou insere o meu match
    let result;
    if (meuMatch && meuMatch.length > 0) {
      result = await apiPatch('matches', `?from_profile_id=eq.${fromId}&to_profile_id=eq.${toId}`, { status, mutual });
    } else {
      result = await apiPost('matches', { from_profile_id: fromId, to_profile_id: toId, status, mutual });
    }

    // 5. Se virou mutuo, atualiza o match do outro usuario tambem
    if (mutual && matchDele && matchDele.length > 0 && !matchDele[0].mutual) {
      await apiPatch('matches', `?from_profile_id=eq.${toId}&to_profile_id=eq.${fromId}`, { mutual: true });
    }

    return result && result.length > 0 ? result[0] : { id: 'm' + Date.now(), from_profile_id: fromId, to_profile_id: toId, status, mutual, created_at: new Date().toISOString() };
  } catch (e) {
    console.log('addMatch erro:', e.message);
    return { id: 'm' + Date.now(), from_profile_id: fromId, to_profile_id: toId, status, mutual: false, created_at: new Date().toISOString() };
  }
}

async function getMatchesSupabase() {
  try {
    const user = getCurrentUser();
    if (!user) return [];
    const data = await apiGet(`matches?select=*&or=(from_profile_id.eq.${user.id},to_profile_id.eq.${user.id})&order=created_at.desc`);
    if (data && data.length > 0) return data;
  } catch (e) { console.log('getMatches erro:', e.message); }
  return [];
}

// ===== MESSAGES =====
async function sendMessageSupabase(senderId, senderNick, content, isPrivate, receiverId) {
  try {
    const data = await apiPost('messages', { sender_id: senderId, sender_nick: senderNick, content, is_private: isPrivate, receiver_id: receiverId || null });
    if (data && data.length > 0) return data[0];
  } catch (e) { console.log('sendMessage erro:', e.message); }
  return null;
}

const MOCK_NICKS = ['CasalPinheira', 'NoiteQuente', 'FogoNaMata', 'LuaDeMel', 'Pimenta', 'EstrelaCadente'];

async function getGlobalMessages() {
  try {
    const data = await apiGet('messages?select=*&is_private=eq.false&order=created_at.asc');
    if (data && data.length > 0) {
      return data
        .filter(m => !MOCK_NICKS.includes(m.sender_nick))
        .map(m => ({ id: m.id, senderId: m.sender_id, senderNick: m.sender_nick, content: m.content, timestamp: new Date(m.created_at).getTime(), isPrivate: m.is_private, receiverId: m.receiver_id }));
    }
  } catch (e) { console.log('getGlobalMessages erro:', e.message); }
  return MOCK_MESSAGES;
}

async function getPrivateMessages(userId, otherId) {
  try {
    const data = await apiGet(`messages?select=*&is_private=eq.true&or=(and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId}))&order=created_at.asc`);
    if (data && data.length > 0) {
      return data.map(m => ({ id: m.id, senderId: m.sender_id, senderNick: m.sender_nick, content: m.content, timestamp: new Date(m.created_at).getTime() }));
    }
  } catch (e) { console.log('getPrivateMessages erro:', e.message); }
  return [];
}

// ===== NOTIFICACOES DE MATCH =====
async function checkNewMatches() {
  const user = getCurrentUser();
  if (!user) return 0;
  try {
    // Busca matches onde eu sou o destinatario (alguem deu match em mim)
    const data = await apiGet(`matches?select=*,from:from_profile_id(nick,fotos)&to_profile_id=eq.${user.id}&mutual=eq.true&order=created_at.desc&limit=20`);
    if (!data || data.length === 0) return 0;

    // Verifica quais ja foram vistos
    const seenMatchIds = DB.get('seenMatches', []);
    const newMatches = data.filter(m => !seenMatchIds.includes(m.id));

    return newMatches.length;
  } catch (e) { return 0; }
}

async function markMatchesAsSeen() {
  const user = getCurrentUser();
  if (!user) return;
  try {
    const data = await apiGet(`matches?select=id&to_profile_id=eq.${user.id}&mutual=eq.true`);
    if (data && data.length > 0) {
      const ids = data.map(m => m.id);
      DB.set('seenMatches', ids);
    }
  } catch (e) { console.log('markSeen erro:', e.message); }
}

// ===== SPLASH SCREEN =====
function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  setTimeout(() => { splash.classList.add('fade-out'); setTimeout(() => splash.remove(), 500); }, 2200);
}

// ===== BOTTOM NAV =====
function initNav() {
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href) { const pageName = href.split('/').pop().replace('.html', ''); if (pageName === currentPage) item.classList.add('active'); }
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  initNav();

  const page = window.location.pathname.split('/').pop();
  const isPublic = ['', 'index.html', 'cadastro.html'].includes(page);

  if (!isPublic && !getCurrentUser()) {
    window.location.href = '../index.html';
  }
});

// ===== UTILS =====
function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
