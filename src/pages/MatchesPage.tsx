import { Heart, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface MatchesPageProps {
  onNavigate: (page: string) => void;
}

export default function MatchesPage({ onNavigate }: MatchesPageProps) {
  const { matches, profiles } = useAuth();

  const mutualMatches = matches
    .filter(m => m.mutual)
    .map(m => ({
      ...m,
      profile: profiles.find(p => p.id === m.coupleId),
    }))
    .filter(m => m.profile);

  const interestedByMe = matches
    .filter(m => m.status === 'interesse' && !m.mutual)
    .map(m => ({
      ...m,
      profile: profiles.find(p => p.id === m.coupleId),
    }))
    .filter(m => m.profile);

  const maybeMatches = matches
    .filter(m => m.status === 'talvez')
    .map(m => ({
      ...m,
      profile: profiles.find(p => p.id === m.coupleId),
    }))
    .filter(m => m.profile);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-white text-2xl font-bold">Meus Matches</h1>
      </div>

      {/* Mutual Matches */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Heart size={18} className="text-[#f56565]" fill="#f56565" />
          <h2 className="text-white font-bold">Matches Mútuos</h2>
          <span className="bg-[#f56565] text-white text-xs px-2 py-0.5 rounded-full">{mutualMatches.length}</span>
        </div>

        {mutualMatches.length === 0 ? (
          <div className="bg-[#2d3748] rounded-xl p-6 text-center">
            <Heart size={32} className="text-[#4a5568] mx-auto mb-2" />
            <p className="text-[#a0aec0] text-sm">Nenhum match mútuo ainda.</p>
            <p className="text-[#4a5568] text-xs mt-1">Continue explorando!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {mutualMatches.map(({ id, profile }) => (
              <div key={id} className="bg-[#2d3748] rounded-xl p-3 flex items-center gap-3">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden">
                    <img src={profile!.fotos[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#f56565] rounded-full flex items-center justify-center">
                    <Heart size={10} className="text-white" fill="white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold">{profile!.nick}</h3>
                  <div className="flex items-center gap-1 text-[#a0aec0] text-xs">
                    <MapPin size={12} />
                    <span>{profile!.cidade}</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('chat')}
                  className="w-10 h-10 bg-[#ecc94b] rounded-full flex items-center justify-center hover:bg-[#d4b43f] transition-colors"
                >
                  <ArrowRight size={18} className="text-[#1a202c]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interested */}
      {interestedByMe.length > 0 && (
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={18} className="text-[#48bb78]" />
            <h2 className="text-white font-bold">Meus Interesses</h2>
            <span className="bg-[#48bb78] text-white text-xs px-2 py-0.5 rounded-full">{interestedByMe.length}</span>
          </div>
          <div className="space-y-2">
            {interestedByMe.map(({ id, profile }) => (
              <div key={id} className="bg-[#2d3748] rounded-xl p-3 flex items-center gap-3 opacity-80">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={profile!.fotos[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium">{profile!.nick}</h3>
                  <p className="text-[#a0aec0] text-xs">Aguardando match...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maybe */}
      {maybeMatches.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={18} className="text-[#ecc94b]" />
            <h2 className="text-white font-bold">Talvez Role</h2>
            <span className="bg-[#ecc94b] text-[#1a202c] text-xs px-2 py-0.5 rounded-full">{maybeMatches.length}</span>
          </div>
          <div className="space-y-2">
            {maybeMatches.map(({ id, profile }) => (
              <div key={id} className="bg-[#2d3748] rounded-xl p-3 flex items-center gap-3 opacity-60">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={profile!.fotos[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium">{profile!.nick}</h3>
                  <p className="text-[#a0aec0] text-xs">Interesse moderado</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
