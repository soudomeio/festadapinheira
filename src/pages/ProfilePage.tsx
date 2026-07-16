import { useState } from 'react';
import { MapPin, Camera, LogOut, ChevronRight, Heart, MessageCircle, Shield, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PREFERENCES } from '@/data/mockData';

interface ProfilePageProps {
  onLogout: () => void;
}

export default function ProfilePage({ onLogout }: ProfilePageProps) {
  const { currentUser, matches } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  if (!currentUser) return null;

  const mutualCount = matches.filter(m => m.mutual).length;
  const interestCount = matches.filter(m => m.status === 'interesse').length;

  const prefLabels = currentUser.preferencias
    .map(p => PREFERENCES.find(pref => pref.id === p)?.label)
    .filter(Boolean);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header Image */}
      <div className="relative h-48">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentUser.fotos[0]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a202c] via-[#1a202c]/40 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="px-4 -mt-16 relative z-10">
        <div className="flex items-end gap-4 mb-4">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#1a202c] bg-[#2d3748]">
            <img src={currentUser.fotos[0]} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="pb-1">
            <h1 className="text-white text-2xl font-bold">{currentUser.nick}</h1>
            <div className="flex items-center gap-1 text-[#a0aec0] text-sm">
              <MapPin size={14} />
              <span>{currentUser.cidade}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-[#2d3748] rounded-xl p-3 text-center">
            <Heart size={18} className="text-[#f56565] mx-auto mb-1" />
            <p className="text-white font-bold">{mutualCount}</p>
            <p className="text-[#a0aec0] text-xs">Matches</p>
          </div>
          <div className="flex-1 bg-[#2d3748] rounded-xl p-3 text-center">
            <Heart size={18} className="text-[#48bb78] mx-auto mb-1" />
            <p className="text-white font-bold">{interestCount}</p>
            <p className="text-[#a0aec0] text-xs">Interesses</p>
          </div>
          <div className="flex-1 bg-[#2d3748] rounded-xl p-3 text-center">
            <MessageCircle size={18} className="text-[#ecc94b] mx-auto mb-1" />
            <p className="text-white font-bold">Online</p>
            <p className="text-[#a0aec0] text-xs">Status</p>
          </div>
        </div>

        {/* Couple Info */}
        <div className="bg-[#2d3748] rounded-xl p-4 mb-4">
          <h3 className="text-white font-bold mb-3">O Casal</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[#a0aec0] text-xs">Ele</p>
              <p className="text-white font-medium">{currentUser.nomeDele}, {currentUser.idadeDele} anos</p>
            </div>
            <div>
              <p className="text-[#a0aec0] text-xs">Ela</p>
              <p className="text-white font-medium">{currentUser.nomeDela}, {currentUser.idadeDela} anos</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#2d3748] rounded-xl p-4 mb-4">
          <h3 className="text-white font-bold mb-3">Preferências</h3>
          <div className="flex flex-wrap gap-2">
            {prefLabels.map((label, i) => (
              <span key={i} className="bg-[#ecc94b]/20 text-[#ecc94b] text-sm font-medium px-3 py-1.5 rounded-full">
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="bg-[#2d3748] rounded-xl p-4 mb-4">
          <h3 className="text-white font-bold mb-3">Fotos</h3>
          <div className="grid grid-cols-3 gap-2">
            {currentUser.fotos.map((foto, idx) => (
              <div key={idx} className="aspect-square rounded-xl overflow-hidden">
                <img src={foto} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <button className="aspect-square rounded-xl border-2 border-dashed border-[#4a5568] flex flex-col items-center justify-center gap-1 hover:border-[#ecc94b] transition-colors">
              <Camera size={20} className="text-[#4a5568]" />
              <span className="text-[#4a5568] text-xs">Adicionar</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        {currentUser.bio && (
          <div className="bg-[#2d3748] rounded-xl p-4 mb-4">
            <h3 className="text-white font-bold mb-2">Sobre</h3>
            <p className="text-[#a0aec0] text-sm">{currentUser.bio}</p>
          </div>
        )}

        {/* Menu */}
        <div className="space-y-2 mb-6">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full bg-[#2d3748] rounded-xl p-4 flex items-center gap-3 text-left hover:bg-[#4a5568]/50 transition-colors"
          >
            <Settings size={20} className="text-[#a0aec0]" />
            <span className="text-white flex-1">Configurações</span>
            <ChevronRight size={18} className="text-[#4a5568]" />
          </button>

          <button className="w-full bg-[#2d3748] rounded-xl p-4 flex items-center gap-3 text-left hover:bg-[#4a5568]/50 transition-colors">
            <Shield size={20} className="text-[#a0aec0]" />
            <span className="text-white flex-1">Privacidade e Segurança</span>
            <ChevronRight size={18} className="text-[#4a5568]" />
          </button>

          <button
            onClick={onLogout}
            className="w-full bg-[#f56565]/10 rounded-xl p-4 flex items-center gap-3 text-left hover:bg-[#f56565]/20 transition-colors"
          >
            <LogOut size={20} className="text-[#f56565]" />
            <span className="text-[#f56565] font-medium flex-1">Sair da Conta</span>
          </button>
        </div>

        <p className="text-center text-[#4a5568] text-xs pb-4">
          Festa da Pinheira v1.0
        </p>
      </div>
    </div>
  );
}
