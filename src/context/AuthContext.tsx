import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CoupleProfile, ChatMessage, Match } from '@/data/mockData';
import { MOCK_PROFILES, MOCK_GLOBAL_MESSAGES, MOCK_PRIVATE_MESSAGES, MOCK_MATCHES, REGISTERED_USERS } from '@/data/mockData';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: CoupleProfile | null;
  registeredUsers: typeof REGISTERED_USERS;
  profiles: CoupleProfile[];
  globalMessages: ChatMessage[];
  privateMessages: ChatMessage[];
  matches: Match[];
  login: (nick: string, senha: string) => boolean;
  logout: () => void;
  register: (user: CoupleProfile, senha: string) => boolean;
  sendGlobalMessage: (content: string) => void;
  sendPrivateMessage: (receiverId: string, content: string) => void;
  addMatch: (coupleId: string, status: 'interesse' | 'talvez' | 'nao') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<CoupleProfile | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState(REGISTERED_USERS);
  const [profiles] = useState<CoupleProfile[]>(MOCK_PROFILES);
  const [globalMessages, setGlobalMessages] = useState<ChatMessage[]>(MOCK_GLOBAL_MESSAGES);
  const [privateMessages, setPrivateMessages] = useState<ChatMessage[]>(MOCK_PRIVATE_MESSAGES);
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);

  const login = useCallback((nick: string, senha: string): boolean => {
    const user = registeredUsers.find(u => u.nick === nick && u.senha === senha);
    if (user) {
      const profile = profiles.find(p => p.nick === nick);
      if (profile) {
        setCurrentUser(profile);
        setIsLoggedIn(true);
        return true;
      }
    }
    return false;
  }, [registeredUsers, profiles]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  }, []);

  const register = useCallback((user: CoupleProfile, senha: string): boolean => {
    if (registeredUsers.some(u => u.nick === user.nick)) {
      return false;
    }
    setRegisteredUsers(prev => [...prev, { nick: user.nick, senha }]);
    setCurrentUser(user);
    setIsLoggedIn(true);
    return true;
  }, [registeredUsers]);

  const sendGlobalMessage = useCallback((content: string) => {
    if (!currentUser) return;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderNick: currentUser.nick,
      content,
      timestamp: Date.now(),
      isPrivate: false,
    };
    setGlobalMessages(prev => [...prev, newMsg]);
  }, [currentUser]);

  const sendPrivateMessage = useCallback((receiverId: string, content: string) => {
    if (!currentUser) return;
    const newMsg: ChatMessage = {
      id: `pmsg_${Date.now()}`,
      senderId: currentUser.id,
      senderNick: currentUser.nick,
      content,
      timestamp: Date.now(),
      isPrivate: true,
      receiverId,
    };
    setPrivateMessages(prev => [...prev, newMsg]);
  }, [currentUser]);

  const addMatch = useCallback((coupleId: string, status: 'interesse' | 'talvez' | 'nao') => {
    const newMatch: Match = {
      id: `match_${Date.now()}`,
      coupleId,
      status,
      timestamp: Date.now(),
      mutual: status === 'interesse' && Math.random() > 0.3,
    };
    setMatches(prev => [...prev, newMatch]);
  }, []);

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      currentUser,
      registeredUsers,
      profiles,
      globalMessages,
      privateMessages,
      matches,
      login,
      logout,
      register,
      sendGlobalMessage,
      sendPrivateMessage,
      addMatch,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
