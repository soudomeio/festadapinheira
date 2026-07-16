export interface CoupleProfile {
  id: string;
  nick: string;
  nomeDele: string;
  nomeDela: string;
  cidade: string;
  preferencias: string[];
  fotos: string[];
  bio: string;
  idadeDele: number;
  idadeDela: number;
  online: boolean;
}

export interface Match {
  id: string;
  coupleId: string;
  status: 'interesse' | 'talvez' | 'nao';
  timestamp: number;
  mutual?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderNick: string;
  content: string;
  timestamp: number;
  isPrivate: boolean;
  receiverId?: string;
}

export const PREFERENCES = [
  { id: 'trocas', label: 'Trocas de Casais' },
  { id: 'mesmo_ambiente', label: 'Sexo no mesmo ambiente' },
  { id: 'solteiras', label: 'Somente Solteiras' },
  { id: 'solteiros', label: 'Somente Solteiros' },
  { id: 'curioso', label: 'Apenas Curioso' },
];

export const MOCK_PROFILES: CoupleProfile[] = [
  {
    id: '1',
    nick: 'CasalPinheira',
    nomeDele: 'Rafael',
    nomeDela: 'Juliana',
    cidade: 'São Paulo',
    preferencias: ['trocas', 'mesmo_ambiente'],
    fotos: ['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&fit=crop'],
    bio: 'Casal aventureiro procurando novas experiências.',
    idadeDele: 32,
    idadeDela: 28,
    online: true,
  },
  {
    id: '2',
    nick: 'NoiteQuente',
    nomeDele: 'Bruno',
    nomeDela: 'Carolina',
    cidade: 'Rio de Janeiro',
    preferencias: ['trocas', 'curioso'],
    fotos: ['https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop'],
    bio: 'Primeira vez em festas. Queremos conhecer pessoas legais.',
    idadeDele: 29,
    idadeDela: 26,
    online: true,
  },
  {
    id: '3',
    nick: 'FogoNaMata',
    nomeDele: 'Fernando',
    nomeDela: 'Patrícia',
    cidade: 'Curitiba',
    preferencias: ['mesmo_ambiente'],
    fotos: ['https://images.unsplash.com/photo-1621621667797-e06afc217fb0?w=600&h=800&fit=crop'],
    bio: 'Casal experiente e discreto.',
    idadeDele: 35,
    idadeDela: 31,
    online: false,
  },
  {
    id: '4',
    nick: 'LuaDeMel',
    nomeDele: 'Gustavo',
    nomeDela: 'Amanda',
    cidade: 'Belo Horizonte',
    preferencias: ['solteiras', 'curioso'],
    fotos: ['https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=800&fit=crop'],
    bio: 'Sempre em busca de diversão.',
    idadeDele: 30,
    idadeDela: 27,
    online: true,
  },
  {
    id: '5',
    nick: 'Pimenta',
    nomeDele: 'Diego',
    nomeDela: 'Fernanda',
    cidade: 'São Paulo',
    preferencias: ['trocas', 'mesmo_ambiente', 'curioso'],
    fotos: ['https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&h=800&fit=crop'],
    bio: 'Adicionando tempero na relação.',
    idadeDele: 33,
    idadeDela: 29,
    online: true,
  },
  {
    id: '6',
    nick: 'EstrelaCadente',
    nomeDele: 'Lucas',
    nomeDela: 'Mariana',
    cidade: 'Porto Alegre',
    preferencias: ['solteiros'],
    fotos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop'],
    bio: 'Casal liberal e aberto a novas experiências.',
    idadeDele: 28,
    idadeDela: 25,
    online: false,
  },
];

export const MOCK_GLOBAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    senderId: 'system',
    senderNick: 'Admin',
    content: 'Bem-vindos à Festa da Pinheira! Respeitem uns aos outros e divirtam-se!',
    timestamp: Date.now() - 3600000,
    isPrivate: false,
  },
  {
    id: '2',
    senderId: '1',
    senderNick: 'CasalPinheira',
    content: 'Oi pessoal! Alguém vai estar na festa sábado?',
    timestamp: Date.now() - 3000000,
    isPrivate: false,
  },
  {
    id: '3',
    senderId: '2',
    senderNick: 'NoiteQuente',
    content: 'Nós vamos! Primeira vez, estamos animados 😊',
    timestamp: Date.now() - 2400000,
    isPrivate: false,
  },
  {
    id: '4',
    senderId: '3',
    senderNick: 'FogoNaMata',
    content: 'Vai ser incrível! A festa da Pinheira é sempre top.',
    timestamp: Date.now() - 1800000,
    isPrivate: false,
  },
  {
    id: '5',
    senderId: '4',
    senderNick: 'LuaDeMel',
    content: 'Alguém de BH indo? Podemos dividir o transporte.',
    timestamp: Date.now() - 1200000,
    isPrivate: false,
  },
];

export const MOCK_PRIVATE_MESSAGES: ChatMessage[] = [
  {
    id: 'p1',
    senderId: '1',
    senderNick: 'CasalPinheira',
    content: 'Oi! Vimos que deram match. Querem conversar?',
    timestamp: Date.now() - 86400000,
    isPrivate: true,
    receiverId: 'current',
  },
  {
    id: 'p2',
    senderId: 'current',
    senderNick: 'MeuCasal',
    content: 'Oi! Claro, estamos animados para a festa!',
    timestamp: Date.now() - 85000000,
    isPrivate: true,
    receiverId: '1',
  },
  {
    id: 'p3',
    senderId: '1',
    senderNick: 'CasalPinheira',
    content: 'Nós também! Vocês já foram em festas assim antes?',
    timestamp: Date.now() - 82000000,
    isPrivate: true,
    receiverId: 'current',
  },
];

export const MOCK_MATCHES: Match[] = [
  { id: 'm1', coupleId: '1', status: 'interesse', timestamp: Date.now() - 86400000, mutual: true },
  { id: 'm2', coupleId: '2', status: 'interesse', timestamp: Date.now() - 43200000, mutual: true },
  { id: 'm3', coupleId: '4', status: 'talvez', timestamp: Date.now() - 21600000 },
];

// Simulated registered users for login validation
export const REGISTERED_USERS = [
  { nick: 'CasalPinheira', senha: '123456' },
  { nick: 'NoiteQuente', senha: '123456' },
];
