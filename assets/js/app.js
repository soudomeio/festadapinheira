// ===== FESTA DA PINHEIRA - App com Supabase (API REST direta) =====

const SUPABASE_URL = 'https://zxmddvkjspbapzifrhqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4bWRkdmtqc3BiYXB6aWZyaHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNzA5MTksImV4cCI6MjA5OTc0NjkxOX0.VYhoyzy_AYHTh5qHTrR7mIsmCb9Tz1cMSJvP7O_sI6o';
const EDGE_FUNCTION_URL = 'https://zxmddvkjspbapzifrhqh.supabase.co/functions/v1/photos';

// API REST direta (sem cliente Supabase - evita erros 406)
async function apiGet(table, query) {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query || ''}`;
  const res = await fetch(url, { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } });
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

async function apiPost(table, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

// ===== LOCAL STORAGE HELPERS =====
const DB = {
  get(key, def) { try { return JSON.parse(localStorage.getItem('fp_' + key)) || def; } catch { return def; } },
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
  { id: '1', nick: 'CasalPinheira', nomeDele: 'Rafael', nomeDela: 'Juliana', cidade: 'São Paulo', preferencias: ['trocas', 'mesmo_ambiente'], fotos: ['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&fit=crop'], bio: 'Casal aventureiro procurando novas experiências.', idadeDele: 32, idadeDela: 28, online: true },
  { id: '2', nick: 'NoiteQuente', nomeDele: 'Bruno', nomeDela: 'Carolina', cidade: 'Rio de Janeiro', preferencias: ['trocas', 'curioso'], fotos: ['https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop'], bio: 'Primeira vez em festas. Queremos conhecer pessoas legais.', idadeDele: 29, idadeDela: 26, online: true },
  { id: '3', nick: 'FogoNaMata', nomeDele: 'Fernando', nomeDela: 'Patrícia', cidade: 'Curitiba', preferencias: ['mesmo_ambiente'], fotos: ['https://images.unsplash.com/photo-1621621667797-e06afc217fb0?w=600&h=800&fit=crop'], bio: 'Casal experiente e discreto.', idadeDele: 35, idadeDela: 31, online: false },
  { id: '4', nick: 'LuaDeMel', nomeDele: 'Gustavo', nomeDela: 'Amanda', cidade: 'Belo Horizonte', preferencias: ['solteiras', 'curioso'], fotos: ['https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=800&fit=crop'], bio: 'Sempre em busca de diversão.', idadeDele: 30, idadeDela: 27, online: true },
  { id: '5', nick: 'Pimenta', nomeDele: 'Diego', nomeDela: 'Fernanda', cidade: 'São Paulo', preferencias: ['trocas', 'mesmo_ambiente', 'curioso'], fotos: ['https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&h=800&fit=crop'], bio: 'Adicionando tempero na relação.', idadeDele: 33, idadeDela: 29, online: true },
  { id: '6', nick: 'EstrelaCadente', nomeDele: 'Lucas', nomeDela: 'Mariana', cidade: 'Porto Alegre', preferencias: ['solteiros'], fotos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop'], bio: 'Casal liberal e aberto a novas experiências.', idadeDele: 28, idadeDela: 25, online: false },
];

const MOCK_MESSAGES = [
  { id: '1', senderId: 'system', senderNick: 'Admin', content: 'Bem-vindos à Festa da Pinheira! Respeitem uns aos outros e divirtam-se!', timestamp: Date.now() - 3600000, isPrivate: false },
  { id: '2', senderId: '1', senderNick: 'CasalPinheira', content: 'Oi pessoal! Alguém vai estar na festa sábado?', timestamp: Date.now() - 3000000, isPrivate: false },
  { id: '3', senderId: '2', senderNick: 'NoiteQuente', content: 'Nós vamos! Primeira vez, estamos animados 😊', timestamp: Date.now() - 2400000, isPrivate: false },
  { id: '4', senderId: '3', senderNick: 'FogoNaMata', content: 'Vai ser incrível! A festa da Pinheira é sempre top.', timestamp: Date.now() - 1800000, isPrivate: false },
  { id: '5', senderId: '4', senderNick: 'LuaDeMel', content: 'Alguém de BH indo? Podemos dividir o transporte.', timestamp: Date.now() - 1200000, isPrivate: false },
];

function initMockData() {
  if (!DB.get('profiles').length) DB.set('profiles', MOCK_PROFILES);
  if (!DB.get('messages').length) DB.set('messages', MOCK_MESSAGES);
}

// ===== AUTH =====
function getCurrentUser() { return DB.get('currentUser', null); }
function setCurrentUser(user) { DB.set('currentUser', user); }

function logout() {
  DB.set('currentUser', null);
  DB.set('swipeIndex', 0);
  window.location.href = '../index.html';
}

async function loginSupabase(nick, senha) {
  // Tenta API REST
  try {
    const data = await apiGet('users?select=*,profiles(*)&nick=eq.' + encodeURIComponent(nick) + '&senha=eq.' + encodeURIComponent(senha));
    if (data && data.length > 0 && data[0].profiles) {
      const p = data[0].profiles;
      setCurrentUser({ id: p.id, nick: p.nick, nomeDele: p.nome_dele, nomeDela: p.nome_dela, cidade: p.cidade, preferencias: p.preferencias || [], fotos: p.fotos || [], bio: p.bio || '', idadeDele: p.idade_dele || 30, idadeDela: p.idade_dela || 28, online: true });
      return true;
    }
  } catch (e) { console.log('Login API falhou'); }

  // Fallback local
  const users = DB.get('users', []);
  const found = users.find(u => u.nick.toLowerCase() === nick.toLowerCase() && u.senha === senha);
  if (found) {
    const profiles = DB.get('profiles', []);
    const profile = profiles.find(p => p.id === found.coupleId);
    if (profile) { setCurrentUser(profile); return true; }
  }
  return false;
}

async function registerSupabase(userData, senha) {
  // Tenta API REST
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
  } catch (e) { console.log('Cadastro API falhou, usando local'); }

  // Fallback local
  const users = DB.get('users', []);
  if (users.some(u => u.nick.toLowerCase() === userData.nick.toLowerCase())) return false;
  const newId = 'local_' + Date.now();
  const newProfile = { ...userData, id: newId, online: true };
  const profiles = DB.get('profiles', []);
  profiles.push(newProfile);
  users.push({ nick: userData.nick, senha, coupleId: newId });
  DB.set('profiles', profiles);
  DB.set('users', users);
  setCurrentUser(newProfile);
  return true;
}

async function checkNickExistsSupabase(nick) {
  try {
    const data = await apiGet('profiles?nick=eq.' + encodeURIComponent(nick) + '&select=nick');
    return data && data.length > 0;
  } catch (e) {
    const users = DB.get('users', []);
    return users.some(u => u.nick.toLowerCase() === nick.toLowerCase());
  }
}

// ===== UPLOAD DE IMAGEM =====
async function uploadImage(file) {
  const currentUser = getCurrentUser();
  const userId = currentUser ? currentUser.id : 'anonymous';

  // Metodo 1: Edge Function
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

  // Metodo 2: Upload direto Storage
  try {
    const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${file.name.split('.').pop()}`;
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/fotos/${fileName}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': file.type },
      body: file,
    });
    if (res.ok) return `${SUPABASE_URL}/storage/v1/object/public/fotos/${fileName}`;
  } catch (e) { console.log('Storage direto falhou'); }

  // Metodo 3: base64
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
  } catch (e) { console.log('getProfiles API falhou'); }
  return DB.get('profiles', MOCK_PROFILES);
}

// ===== MATCHES =====
function isUUID(id) { return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id); }

async function addMatchSupabase(fromId, toId, status) {
  if (isUUID(fromId) && isUUID(toId)) {
    try {
      const data = await apiPost('matches', { from_profile_id: fromId, to_profile_id: toId, status });
      if (data && data.length > 0) return data[0];
    } catch (e) { console.log('addMatch API falhou'); }
  }
  const matches = DB.get('matches', []);
  const newMatch = { id: 'm' + Date.now(), from_profile_id: fromId, to_profile_id: toId, status, mutual: status === 'interesse' && Math.random() > 0.3, created_at: new Date().toISOString() };
  matches.push(newMatch);
  DB.set('matches', matches);
  return newMatch;
}

async function getMatchesSupabase() {
  try {
    const data = await apiGet('matches?select=*&order=created_at.desc');
    if (data && data.length > 0) return data;
  } catch (e) { console.log('getMatches API falhou'); }
  return DB.get('matches', []);
}

// ===== MESSAGES =====
async function sendMessageSupabase(senderId, senderNick, content, isPrivate, receiverId) {
  try {
    const data = await apiPost('messages', { sender_id: senderId, sender_nick: senderNick, content, is_private: isPrivate, receiver_id: receiverId || null });
    if (data && data.length > 0) return data[0];
  } catch (e) { console.log('sendMessage API falhou'); }
  const messages = DB.get('messages', []);
  const newMsg = { id: 'msg' + Date.now(), senderId, senderNick, content, timestamp: Date.now(), isPrivate, receiverId: receiverId || null };
  messages.push(newMsg);
  DB.set('messages', messages);
  return newMsg;
}

async function getGlobalMessages() {
  try {
    const data = await apiGet('messages?select=*&is_private=eq.false&order=created_at.asc');
    if (data && data.length > 0) {
      return data.map(m => ({ id: m.id, senderId: m.sender_id, senderNick: m.sender_nick, content: m.content, timestamp: new Date(m.created_at).getTime(), isPrivate: m.is_private, receiverId: m.receiver_id }));
    }
  } catch (e) { console.log('getGlobalMessages API falhou'); }
  return DB.get('messages', MOCK_MESSAGES).filter(m => !m.isPrivate);
}

async function getPrivateMessages(userId, otherId) {
  try {
    const data = await apiGet(`messages?select=*&is_private=eq.true&or=(and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId}))&order=created_at.asc`);
    if (data && data.length > 0) {
      return data.map(m => ({ id: m.id, senderId: m.sender_id, content: m.content, timestamp: new Date(m.created_at).getTime() }));
    }
  } catch (e) { console.log('getPrivateMessages API falhou'); }
  return DB.get('messages', []).filter(msg => msg.isPrivate && (msg.senderId === otherId || (msg.senderId === userId && msg.receiverId === otherId)));
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
  initMockData();
  initSplash();
  initNav();

  const page = window.location.pathname.split('/').pop();
  const isPublic = ['', 'index.html', 'cadastro.html'].includes(page);

  if (!isPublic && !getCurrentUser()) {
    window.location.href = '../index.html';
    return;
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
