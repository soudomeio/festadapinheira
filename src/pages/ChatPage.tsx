import { useState, useRef, useEffect } from 'react';
import { Send, Globe, Lock, ArrowLeft, Circle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type ChatMode = 'global' | 'private';

interface ChatPageProps {
  onNavigate: (page: string) => void;
}

export default function ChatPage({ onNavigate }: ChatPageProps) {
  const { currentUser, globalMessages, privateMessages, sendGlobalMessage, sendPrivateMessage, matches, profiles } = useAuth();
  const [mode, setMode] = useState<ChatMode>('global');
  const [privateChatId, setPrivateChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [globalMessages, privateMessages, privateChatId]);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    if (mode === 'global') {
      sendGlobalMessage(messageInput.trim());
    } else if (privateChatId) {
      sendPrivateMessage(privateChatId, messageInput.trim());
    }
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  // Get private conversations
  const privateConversations = matches
    .filter(m => m.mutual)
    .map(m => {
      const profile = profiles.find(p => p.id === m.coupleId);
      const messages = privateMessages.filter(
        msg => msg.senderId === m.coupleId || (msg.senderId === currentUser?.id && msg.receiverId === m.coupleId)
      );
      const lastMessage = messages[messages.length - 1];
      return { match: m, profile, lastMessage, unread: messages.filter(m => m.senderId !== currentUser?.id && m.timestamp > Date.now() - 86400000).length };
    })
    .filter(c => c.profile);

  // Get messages for active private chat
  const activePrivateMessages = privateChatId
    ? privateMessages.filter(
        msg => msg.senderId === privateChatId || (msg.senderId === currentUser?.id && msg.receiverId === privateChatId)
      )
    : [];

  const activeProfile = privateChatId ? profiles.find(p => p.id === privateChatId) : null;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (mode === 'private' && privateChatId && activeProfile) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-3 border-b border-[#2d3748]">
          <button onClick={() => setPrivateChatId(null)} className="text-[#a0aec0] hover:text-white">
            <ArrowLeft size={24} />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2d3748]">
            <img src={activeProfile.fotos[0]} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold truncate">{activeProfile.nick}</h3>
            <div className="flex items-center gap-1">
              <Circle size={8} className={activeProfile.online ? 'text-[#48bb78] fill-[#48bb78]' : 'text-[#4a5568]'} />
              <span className="text-[#a0aec0] text-xs">{activeProfile.online ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <div className="text-center py-2">
            <span className="bg-[#48bb78]/20 text-[#48bb78] text-xs px-3 py-1 rounded-full animate-pulse">
              Vocês combinaram! Agora podem conversar.
            </span>
          </div>
          {activePrivateMessages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isMe
                    ? 'bg-[#ecc94b] text-[#1a202c] rounded-br-md'
                    : 'bg-[#2d3748] text-white rounded-bl-md'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? 'text-[#1a202c]/60' : 'text-[#a0aec0]'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-[#2d3748] bg-[#1a202c]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite uma mensagem..."
              className="flex-1 bg-[#2d3748] text-white rounded-xl px-4 py-3 outline-none border border-[#4a5568] focus:border-[#ecc94b] transition-colors placeholder:text-[#4a5568] text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!messageInput.trim()}
              className="w-11 h-11 bg-[#ecc94b] rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-[#d4b43f] transition-colors"
            >
              <Send size={18} className="text-[#1a202c]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-white text-2xl font-bold mb-3">Mensagens</h1>
        <div className="flex bg-[#2d3748] rounded-xl p-1">
          <button
            onClick={() => { setMode('global'); setPrivateChatId(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'global' ? 'bg-[#ecc94b] text-[#1a202c]' : 'text-[#a0aec0] hover:text-white'
            }`}
          >
            <Globe size={16} />
            Global
          </button>
          <button
            onClick={() => { setMode('private'); setPrivateChatId(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'private' ? 'bg-[#ecc94b] text-[#1a202c]' : 'text-[#a0aec0] hover:text-white'
            }`}
          >
            <Lock size={16} />
            Privado
          </button>
        </div>
      </div>

      {/* Content */}
      {mode === 'global' ? (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {globalMessages.map((msg) => {
              const isSystem = msg.senderId === 'system';
              const isMe = msg.senderId === currentUser?.id;

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center py-2">
                    <div className="bg-[#48bb78]/10 border border-[#48bb78]/30 text-[#48bb78] text-xs px-4 py-2 rounded-full max-w-[85%] text-center">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${isMe ? 'order-2' : ''}`}>
                    {!isMe && (
                      <p className="text-[#a0aec0] text-xs mb-0.5 ml-1">{msg.senderNick}</p>
                    )}
                    <div className={`rounded-2xl px-4 py-2.5 ${
                      isMe
                        ? 'bg-[#ecc94b] text-[#1a202c] rounded-br-md'
                        : 'bg-[#2d3748] text-white rounded-bl-md'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-[#1a202c]/60' : 'text-[#a0aec0]'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-[#2d3748] bg-[#1a202c]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mensagem no chat global..."
                className="flex-1 bg-[#2d3748] text-white rounded-xl px-4 py-3 outline-none border border-[#4a5568] focus:border-[#ecc94b] transition-colors placeholder:text-[#4a5568] text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!messageInput.trim()}
                className="w-11 h-11 bg-[#ecc94b] rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-[#d4b43f] transition-colors"
              >
                <Send size={18} className="text-[#1a202c]" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {privateConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <Lock size={48} className="text-[#4a5568] mb-4" />
              <h3 className="text-white font-bold mb-2">Sem conversas privadas</h3>
              <p className="text-[#a0aec0] text-sm">
                Dê match em alguém para começar uma conversa privada.
              </p>
              <button
                onClick={() => onNavigate('home')}
                className="mt-4 bg-[#ecc94b] text-[#1a202c] font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#d4b43f] transition-colors"
              >
                Explorar Perfis
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {privateConversations.map(({ match, profile, lastMessage }) => (
                <button
                  key={match.id}
                  onClick={() => setPrivateChatId(profile!.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#2d3748] transition-colors text-left"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#2d3748]">
                      <img src={profile!.fotos[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    {profile!.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#48bb78] rounded-full border-2 border-[#1a202c]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium truncate">{profile!.nick}</h4>
                      {lastMessage && (
                        <span className="text-[#4a5568] text-xs">{formatTime(lastMessage.timestamp)}</span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="text-[#a0aec0] text-sm truncate">
                        {lastMessage.senderId === currentUser?.id ? 'Você: ' : ''}
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
