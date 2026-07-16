// ===== FESTA DA PINHEIRA - App com Supabase =====

const SUPABASE_URL = 'https://zxmddvkjspbapzifrhqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4bWRkdmtqc3BiYXB6aWZyaHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNzA5MTksImV4cCI6MjA5OTc0NjkxOX0.VYhoyzy_AYHTh5qHTrR7mIsmCb9Tz1cMSJvP7O_sI6o';

let sbClient = null;
let supabaseReady = false;

// Inicializar Supabase com retry
function initSupabase() {
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    try {
      sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      supabaseReady = true;
      console.log('Supabase conectado!');
    } catch (e) {
      console.log('Erro Supabase:', e);
      supabaseReady = false;
    }
  } else {
    console.log('Supabase CDN nao carregou, usando localStorage');
    supabaseReady = false;
  }
}

// Tentar conectar ate 5 vezes (a CDN pode demorar)
let initAttempts = 0;
function tryInitSupabase() {
  initSupabase();
  if (!supabaseReady && initAttempts < 5) {
    initAttempts++;
    setTimeout(tryInitSupabase, 500);
  }
}

// ===== LOCAL STORAGE HELPERS =====
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

// ===== MOCK DATA (fallback offline) =====
const MOCK_PROFILES = [
  { id: '1', nick: 'CasalPinheira', nomeDele: 'Rafael', nomeDela: 'Juliana', cidade: 'São Paulo', preferencias: ['trocas', 'mesmo_ambiente'], fotos: ['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&fit=crop'], bio: 'Casal aventureiro procurando novas experiências.', idadeDele: 32, idadeDela: 28, online: true },
  { id: '2', nick: 'NoiteQuente', nomeDele: 'Bruno', nomeDela: 'Carolina', cidade: 'Rio de Janeiro', preferencias: ['trocas', 'curioso'], fotos: ['https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop'], bio: 'Primeira vez em festas. Queremos conhecer pessoas legais.', idadeDele: 29, idadeDela: 26, online: true },
  { id: '3', nick: 'FogoNaMata', nomeDele: 'Fernando', nomeDela: 'Patrícia', cidade: 'Curitiba', preferencias: ['mesmo_ambiente'], fotos: ['https://images.unsplash.com/photo-1621621667797-e06afc217fb0?w=600&h=800&fit=crop'], bio: 'Casal experiente e discreto.', idadeDele: 35, idadeDela: 31, online: false },
  { id: '4', nick: 'LuaDeMel', nomeDele: 'Gustavo', nomeDela: 'Amanda', cidade: 'Belo Horizonte', preferencias: ['solteiras', 'curioso'], fotos: ['https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=800&fit=crop'], bio: 'Sempre em busca de diversão.', idadeDele: 30, idadeDela: 27, online: true },
  { id: '5', nick: 'Pimenta', nomeDele: 'Diego', nomeDela: 'Fernanda', cidade: 'São Paulo', preferencias: ['trocas', 'mesmo_ambiente', 'curioso'], fotos: ['https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&h=800&fit=crop'], bio: 'Adicionando tempero na relação.', idadeDele: 33, idadeDela: 29, online: true },
];

const MOCK_MESSAGES = [
  { id: '1', senderId: 'system', senderNick: 'Admin', content: 'Bem-vindos à Festa da Pinheira! Respeitem uns aos outros e divirtam-se!', timestamp: Date.now() - 3600000, isPrivate: false },
  { id: '2', senderId: '1', senderNick: 'CasalPinheira', content: 'Oi pessoal! Alguém vai estar na festa sábado?', timestamp: Date.now() - 3000000, isPrivate: false },
  { id: '3', senderId: '2', senderNick: 'NoiteQuente', content: 'Nós vamos! Primeira vez, estamos animados 😊', timestamp: Date.now() - 2400000, isPrivate: false },
  { id: '4', senderId: '3', senderNick: 'FogoNaMata', content: 'Vai ser incrível! A festa da Pinheira é sempre top.', timestamp: Date.now() - 1800000, isPrivate: false },
  { id: '5', senderId: '4', senderNick: 'LuaDeMel', content: 'Alguém de BH indo? Podemos dividir o transporte.', timestamp: Date.now() - 1200000, isPrivate: false },
];

const MOCK_MATCHES = [
  { id: 'm1', from_profile_id: '1', to_profile_id: '2', status: 'interesse', mutual: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'm2', from_profile_id: '2', to_profile_id: '1', status: 'interesse', mutual: true, created_at: new Date(Date.now() - 43200000).toISOString() },
  { id: 'm3', from_profile_id: '1', to_profile_id: '4', status: 'talvez', created_at: new Date(Date.now() - 21600000).toISOString() },
];

// Init data no localStorage se vazio
function initMockData() {
  if (!DB.get('profiles').length) DB.set('profiles', MOCK_PROFILES);
  if (!DB.get('messages').length) DB.set('messages', MOCK_MESSAGES);
  if (!DB.get('matches').length) DB.set('matches', MOCK_MATCHES);
}

// ===== AUTH FUNCTIONS =====
function getCurrentUser() { return DB.get('currentUser', null); }
function setCurrentUser(user) { DB.set('currentUser', user); }

function logout() {
  DB.set('currentUser', null);
  DB.set('swipeIndex', 0);
  window.location.href = '../index.html';
}

// Login
async function loginSupabase(nick, senha) {
  if (sbClient) {
    try {
      const { data, error } = await sbClient
        .from('users')
        .select('*, profiles(*)')
        .eq('nick', nick)
        .eq('senha', senha)
        .single();
      if (!error && data && data.profiles) {
        setCurrentUser({
          id: data.profiles.id,
          nick: data.profiles.nick,
          nomeDele: data.profiles.nome_dele,
          nomeDela: data.profiles.nome_dela,
          cidade: data.profiles.cidade,
          preferencias: data.profiles.preferencias || [],
          fotos: data.profiles.fotos || [],
          bio: data.profiles.bio || '',
          idadeDele: data.profiles.idade_dele || 30,
          idadeDela: data.profiles.idade_dela || 28,
          online: true,
        });
        return true;
      }
    } catch (e) { console.log('Login Supabase falhou, tentando local'); }
  }

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

// Cadastro
async function registerSupabase(userData, senha) {
  if (sbClient) {
    try {
      const { data: existing } = await sbClient.from('profiles').select('nick').eq('nick', userData.nick).single();
      if (existing) return false;

      const { data: profile, error: pErr } = await sbClient.from('profiles').insert([{
        nick: userData.nick, nome_dele: userData.nomeDele, nome_dela: userData.nomeDela,
        cidade: userData.cidade, preferencias: userData.preferencias, fotos: userData.fotos,
        bio: userData.bio || '', idade_dele: userData.idadeDele || 30, idade_dela: userData.idadeDela || 28, online: true,
      }]).select().single();

      if (pErr || !profile) return false;

      const { error: uErr } = await sbClient.from('users').insert([{ nick: userData.nick, senha, profile_id: profile.id }]);
      if (uErr) return false;

      setCurrentUser({ ...userData, id: profile.id, online: true });
      return true;
    } catch (e) { console.log('Cadastro Supabase falhou, usando local'); }
  }

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

// Verificar nick
async function checkNickExistsSupabase(nick) {
  if (sbClient) {
    try {
      const { data } = await sbClient.from('profiles').select('nick').eq('nick', nick).single();
      return !!data;
    } catch (e) { /* offline */ }
  }
  const users = DB.get('users', []);
  return users.some(u => u.nick.toLowerCase() === nick.toLowerCase());
}

// Upload de imagem
async function uploadImage(file) {
  if (sbClient) {
    try {
      const fileName = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const { error } = await sbClient.storage.from('fotos').upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (error) return null;
      const { data: urlData } = sbClient.storage.from('fotos').getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (e) { console.log('Upload falhou'); }
  }
  return null;
}

// ===== PROFILES =====
async function getProfiles() {
  if (sbClient) {
    try {
      const { data, error } = await sbClient.from('profiles').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) { console.log('getProfiles Supabase falhou'); }
  }
  return DB.get('profiles', MOCK_PROFILES);
}

// ===== MATCHES =====
async function addMatchSupabase(fromId, toId, status) {
  if (sbClient) {
    try {
      const { data, error } = await sbClient.from('matches').insert([{ from_profile_id: fromId, to_profile_id: toId, status }]).select();
      if (!error && data && data.length > 0) return data[0];
      if (error) console.log('Match insert error:', error.message);
    } catch (e) { console.log('addMatch Supabase falhou:', e); }
  }
  // Local fallback - sempre funciona
  const matches = DB.get('matches', []);
  const newMatch = { id: 'm' + Date.now(), from_profile_id: fromId, to_profile_id: toId, status, mutual: status === 'interesse' && Math.random() > 0.3, created_at: new Date().toISOString() };
  matches.push(newMatch);
  DB.set('matches', matches);
  return newMatch;
}

async function getMatchesSupabase() {
  if (sbClient) {
    try {
      const { data, error } = await sbClient.from('matches').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) { console.log('getMatches Supabase falhou'); }
  }
  return DB.get('matches', MOCK_MATCHES);
}

// ===== MESSAGES =====
async function sendMessageSupabase(senderId, senderNick, content, isPrivate, receiverId) {
  if (sbClient) {
    try {
      const { data, error } = await sbClient.from('messages').insert([{ sender_id: senderId, sender_nick: senderNick, content, is_private: isPrivate, receiver_id: receiverId || null }]).select().single();
      if (!error && data) return data;
    } catch (e) { console.log('sendMessage Supabase falhou'); }
  }
  // Local fallback
  const messages = DB.get('messages', []);
  const newMsg = { id: 'msg' + Date.now(), senderId, senderNick, content, timestamp: Date.now(), isPrivate, receiverId: receiverId || null };
  messages.push(newMsg);
  DB.set('messages', messages);
  return newMsg;
}

async function getGlobalMessages() {
  if (sbClient) {
    try {
      const { data, error } = await sbClient.from('messages').select('*').eq('is_private', false).order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(m => ({ id: m.id, senderId: m.sender_id, senderNick: m.sender_nick, content: m.content, timestamp: new Date(m.created_at).getTime(), isPrivate: m.is_private, receiverId: m.receiver_id }));
      }
    } catch (e) { console.log('getGlobalMessages Supabase falhou'); }
  }
  return DB.get('messages', MOCK_MESSAGES).filter(m => !m.isPrivate);
}

async function getPrivateMessages(userId, otherId) {
  if (sbClient) {
    try {
      const { data, error } = await sbClient.from('messages').select('*').eq('is_private', true).or(`and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId})`).order('created_at', { ascending: true });
      if (!error && data) {
        return data.map(m => ({ id: m.id, senderId: m.sender_id, content: m.content, timestamp: new Date(m.created_at).getTime() }));
      }
    } catch (e) { console.log('getPrivateMessages Supabase falhou'); }
  }
  return DB.get('messages', []).filter(msg => msg.isPrivate && (msg.senderId === otherId || (msg.senderId === userId && msg.receiverId === otherId)));
}

// ===== SPLASH SCREEN =====
function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => splash.remove(), 500);
  }, 2200);
}

// ===== BOTTOM NAV =====
function initNav() {
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href) {
      const pageName = href.split('/').pop().replace('.html', '');
      if (pageName === currentPage) item.classList.add('active');
    }
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  tryInitSupabase();
  initMockData();
  initSplash();
  initNav();

  const page = window.location.pathname.split('/').pop();
  const publicPages = ['', 'index.html', 'cadastro.html'];
  const isPublic = publicPages.includes(page);

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
