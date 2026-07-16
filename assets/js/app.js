// ===== FESTA DA PINHEIRA - App JavaScript =====

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

// ===== MOCK PROFILES =====
const MOCK_PROFILES = [
  { id: '1', nick: 'CasalPinheira', nomeDele: 'Rafael', nomeDela: 'Juliana', cidade: 'São Paulo', preferencias: ['trocas', 'mesmo_ambiente'], fotos: ['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&fit=crop'], bio: 'Casal aventureiro procurando novas experiências.', idadeDele: 32, idadeDela: 28, online: true },
  { id: '2', nick: 'NoiteQuente', nomeDele: 'Bruno', nomeDela: 'Carolina', cidade: 'Rio de Janeiro', preferencias: ['trocas', 'curioso'], fotos: ['https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop'], bio: 'Primeira vez em festas. Queremos conhecer pessoas legais.', idadeDele: 29, idadeDela: 26, online: true },
  { id: '3', nick: 'FogoNaMata', nomeDele: 'Fernando', nomeDela: 'Patrícia', cidade: 'Curitiba', preferencias: ['mesmo_ambiente'], fotos: ['https://images.unsplash.com/photo-1621621667797-e06afc217fb0?w=600&h=800&fit=crop'], bio: 'Casal experiente e discreto.', idadeDele: 35, idadeDela: 31, online: false },
  { id: '4', nick: 'LuaDeMel', nomeDele: 'Gustavo', nomeDela: 'Amanda', cidade: 'Belo Horizonte', preferencias: ['solteiras', 'curioso'], fotos: ['https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=800&fit=crop'], bio: 'Sempre em busca de diversão.', idadeDele: 30, idadeDela: 27, online: true },
  { id: '5', nick: 'Pimenta', nomeDele: 'Diego', nomeDela: 'Fernanda', cidade: 'São Paulo', preferencias: ['trocas', 'mesmo_ambiente', 'curioso'], fotos: ['https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&h=800&fit=crop'], bio: 'Adicionando tempero na relação.', idadeDele: 33, idadeDela: 29, online: true },
  { id: '6', nick: 'EstrelaCadente', nomeDele: 'Lucas', nomeDela: 'Mariana', cidade: 'Porto Alegre', preferencias: ['solteiros'], fotos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop'], bio: 'Casal liberal e aberto a novas experiências.', idadeDele: 28, idadeDela: 25, online: false },
];

// ===== INITIALIZE DATA =====
function initData() {
  if (!DB.get('profiles')) DB.set('profiles', MOCK_PROFILES);
  if (!DB.get('messages')) {
    DB.set('messages', [
      { id: '1', senderId: 'system', senderNick: 'Admin', content: 'Bem-vindos à Festa da Pinheira! Respeitem uns aos outros e divirtam-se!', timestamp: Date.now() - 3600000, isPrivate: false },
      { id: '2', senderId: '1', senderNick: 'CasalPinheira', content: 'Oi pessoal! Alguém vai estar na festa sábado?', timestamp: Date.now() - 3000000, isPrivate: false },
      { id: '3', senderId: '2', senderNick: 'NoiteQuente', content: 'Nós vamos! Primeira vez, estamos animados 😊', timestamp: Date.now() - 2400000, isPrivate: false },
      { id: '4', senderId: '3', senderNick: 'FogoNaMata', content: 'Vai ser incrível! A festa da Pinheira é sempre top.', timestamp: Date.now() - 1800000, isPrivate: false },
      { id: '5', senderId: '4', senderNick: 'LuaDeMel', content: 'Alguém de BH indo? Podemos dividir o transporte.', timestamp: Date.now() - 1200000, isPrivate: false },
    ]);
  }
  if (!DB.get('matches')) {
    DB.set('matches', [
      { id: 'm1', coupleId: '1', status: 'interesse', timestamp: Date.now() - 86400000, mutual: true },
      { id: 'm2', coupleId: '2', status: 'interesse', timestamp: Date.now() - 43200000, mutual: true },
      { id: 'm3', coupleId: '4', status: 'talvez', timestamp: Date.now() - 21600000 },
    ]);
  }
  if (!DB.get('users')) {
    DB.set('users', [
      { nick: 'CasalPinheira', senha: '123456', coupleId: '1' },
      { nick: 'NoiteQuente', senha: '123456', coupleId: '2' },
    ]);
  }
}

// ===== AUTH FUNCTIONS =====
function getCurrentUser() { return DB.get('currentUser', null); }

function setCurrentUser(user) { DB.set('currentUser', user); }

function logout() {
  DB.set('currentUser', null);
  window.location.href = '../index.html';
}

function login(nick, senha) {
  const users = DB.get('users', []);
  const found = users.find(u => u.nick.toLowerCase() === nick.toLowerCase() && u.senha === senha);
  if (!found) return false;
  const profiles = DB.get('profiles', []);
  const profile = profiles.find(p => p.id === found.coupleId);
  if (profile) {
    setCurrentUser(profile);
    return true;
  }
  return false;
}

function register(userData, senha) {
  const users = DB.get('users', []);
  if (users.some(u => u.nick.toLowerCase() === userData.nick.toLowerCase())) return false;

  const profiles = DB.get('profiles', []);
  const newId = 'u' + Date.now();
  const newProfile = { ...userData, id: newId, online: true };

  profiles.push(newProfile);
  users.push({ nick: userData.nick, senha, coupleId: newId });

  DB.set('profiles', profiles);
  DB.set('users', users);
  setCurrentUser(newProfile);
  return true;
}

function checkNickExists(nick) {
  const users = DB.get('users', []);
  return users.some(u => u.nick.toLowerCase() === nick.toLowerCase());
}

// ===== MATCH FUNCTIONS =====
function addMatch(coupleId, status) {
  const matches = DB.get('matches', []);
  const newMatch = {
    id: 'm' + Date.now(),
    coupleId,
    status,
    timestamp: Date.now(),
    mutual: status === 'interesse' && Math.random() > 0.3,
  };
  matches.push(newMatch);
  DB.set('matches', matches);
  return newMatch;
}

function getMatches() { return DB.get('matches', []); }

// ===== CHAT FUNCTIONS =====
function sendMessage(content, receiverId) {
  const messages = DB.get('messages', []);
  const user = getCurrentUser();
  const newMsg = {
    id: 'msg' + Date.now(),
    senderId: user ? user.id : 'guest',
    senderNick: user ? user.nick : 'Convidado',
    content,
    timestamp: Date.now(),
    isPrivate: !!receiverId,
    receiverId: receiverId || null,
  };
  messages.push(newMsg);
  DB.set('messages', messages);
  return newMsg;
}

function getMessages() { return DB.get('messages', []); }

// ===== UTILS =====
function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function getPrefLabel(id) {
  const p = PREFERENCES.find(pref => pref.id === id);
  return p ? p.label : id;
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
  initData();
  initSplash();
  initNav();

  // Redirect if not logged in (except login and register pages)
  const page = window.location.pathname.split('/').pop();
  const publicPages = ['', 'index.html', 'cadastro.html'];
  const isPublic = publicPages.includes(page);

  if (!isPublic && !getCurrentUser()) {
    window.location.href = '../index.html';
    return;
  }

  // Show guest badge if not logged in
  const user = getCurrentUser();
  if (!user && document.getElementById('guestBadge')) {
    document.getElementById('guestBadge').classList.remove('hidden');
  }
});
