// ===== FESTA DA PINHEIRA - App com Supabase =====

const SUPABASE_URL = 'https://zxmddvkjspbapzifrhqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4bWRkdmtqc3BiYXB6aWZyaHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNzA5MTksImV4cCI6MjA5OTc0NjkxOX0.VYhoyzy_AYHTh5qHTrR7mIsmCb9Tz1cMSJvP7O_sI6o';

let supabase;

// Inicializar Supabase
function initSupabase() {
  if (window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
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

// ===== AUTH FUNCTIONS =====
function getCurrentUser() { return DB.get('currentUser', null); }
function setCurrentUser(user) { DB.set('currentUser', user); }

function logout() {
  DB.set('currentUser', null);
  DB.set('swipeIndex', 0);
  window.location.href = '../index.html';
}

// Login com Supabase
async function loginSupabase(nick, senha) {
  if (!supabase) return false;
  const { data, error } = await supabase
    .from('users')
    .select('*, profiles(*)')
    .eq('nick', nick)
    .eq('senha', senha)
    .single();

  if (error || !data) return false;

  const profile = data.profiles || {
    id: data.profile_id,
    nick: data.nick,
  };

  setCurrentUser(profile);
  return true;
}

// Cadastro com Supabase
async function registerSupabase(userData, senha) {
  if (!supabase) return false;

  // Verificar se nick existe
  const { data: existing } = await supabase
    .from('profiles')
    .select('nick')
    .eq('nick', userData.nick)
    .single();

  if (existing) return false;

  // Criar profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert([{
      nick: userData.nick,
      nome_dele: userData.nomeDele,
      nome_dela: userData.nomeDela,
      cidade: userData.cidade,
      preferencias: userData.preferencias,
      fotos: userData.fotos,
      bio: userData.bio || '',
      idade_dele: userData.idadeDele || 30,
      idade_dela: userData.idadeDela || 28,
      online: true,
    }])
    .select()
    .single();

  if (profileError || !profile) return false;

  // Criar usuario
  const { error: userError } = await supabase
    .from('users')
    .insert([{
      nick: userData.nick,
      senha: senha,
      profile_id: profile.id,
    }]);

  if (userError) return false;

  setCurrentUser(profile);
  return true;
}

// Verificar se nick existe
async function checkNickExistsSupabase(nick) {
  if (!supabase) return false;
  const { data } = await supabase
    .from('profiles')
    .select('nick')
    .eq('nick', nick)
    .single();
  return !!data;
}

// Upload de imagem para Supabase Storage
async function uploadImage(file) {
  if (!supabase) return null;

  const fileName = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');

  const { data, error } = await supabase.storage
    .from('fotos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) return null;

  // Retornar URL publica
  const { data: urlData } = supabase.storage
    .from('fotos')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

// ===== PROFILES =====
async function getProfiles() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

async function updateProfile(profileId, updates) {
  if (!supabase) return false;
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', profileId);
  return !error;
}

// ===== MATCHES =====
async function addMatchSupabase(fromId, toId, status) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('matches')
    .insert([{
      from_profile_id: fromId,
      to_profile_id: toId,
      status: status,
    }])
    .select()
    .single();

  if (error) return null;
  return data;
}

async function getMatchesSupabase() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

// ===== MESSAGES =====
async function sendMessageSupabase(senderId, senderNick, content, isPrivate, receiverId) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('messages')
    .insert([{
      sender_id: senderId,
      sender_nick: senderNick,
      content: content,
      is_private: isPrivate,
      receiver_id: receiverId || null,
    }])
    .select()
    .single();

  if (error) return null;
  return data;
}

async function getMessagesSupabase() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });
  return data || [];
}

async function getGlobalMessages() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('is_private', false)
    .order('created_at', { ascending: true });
  return data || [];
}

async function getPrivateMessages(userId, otherId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('is_private', true)
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true });
  return data || [];
}

// ===== REALTIME =====
function subscribeToMessages(callback) {
  if (!supabase) return null;
  return supabase
    .channel('messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, callback)
    .subscribe();
}

function subscribeToMatches(callback) {
  if (!supabase) return null;
  return supabase
    .channel('matches')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'matches' }, callback)
    .subscribe();
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
  initSupabase();
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
