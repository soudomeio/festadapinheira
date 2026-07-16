import { useState, useRef, useCallback } from 'react';
import { MapPin, X, Star, Heart, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PREFERENCES } from '@/data/mockData';

export default function HomePage() {
  const { profiles, currentUser, addMatch } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const touchStart = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const availableProfiles = profiles.filter(p => p.id !== currentUser?.id);
  const currentProfile = availableProfiles[currentIndex];

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
    if (!currentProfile) return;
    setSwipeDirection(direction);

    const statusMap = {
      right: 'interesse',
      up: 'talvez',
      left: 'nao',
    } as const;

    addMatch(currentProfile.id, statusMap[direction]);

    if (direction === 'right') {
      setShowMatchAnimation(true);
      setTimeout(() => setShowMatchAnimation(false), 2000);
    }

    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex(prev => prev + 1);
      setShowInfo(false);
    }, 400);
  }, [currentProfile, addMatch]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStart.current = { x: clientX, y: clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    const diffX = clientX - touchStart.current.x;
    const diffY = clientY - touchStart.current.y;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 80) {
      handleSwipe(diffX > 0 ? 'right' : 'left');
    } else if (diffY < -80 && Math.abs(diffY) > Math.abs(diffX)) {
      handleSwipe('up');
    }
  };

  const getCardStyle = () => {
    if (!swipeDirection) return {};
    const transforms = {
      left: 'translateX(-120%) rotate(-20deg)',
      right: 'translateX(120%) rotate(20deg)',
      up: 'translateY(-120%)',
    };
    return {
      transform: transforms[swipeDirection],
      opacity: 0,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    };
  };

  if (currentIndex >= availableProfiles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-20 h-20 bg-[#2d3748] rounded-full flex items-center justify-center mb-4">
          <Heart size={36} className="text-[#4a5568]" />
        </div>
        <h2 className="text-white text-xl font-bold mb-2">Sem perfis por enquanto</h2>
        <p className="text-[#a0aec0] text-sm">Volte mais tarde para ver novos casais!</p>
        <button
          onClick={() => setCurrentIndex(0)}
          className="mt-6 bg-[#ecc94b] text-[#1a202c] font-bold px-6 py-3 rounded-xl hover:bg-[#d4b43f] transition-colors"
        >
          Ver Novamente
        </button>
      </div>
    );
  }

  if (!currentProfile) return null;

  const prefLabels = currentProfile.preferencias
    .map(p => PREFERENCES.find(pref => pref.id === p)?.label)
    .filter(Boolean);

  return (
    <div className="flex flex-col h-full relative">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-0 h-0" style={{
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '12px solid #ecc94b',
          }} />
          <span className="text-[#ecc94b] font-bold text-sm tracking-wide">FESTA DA PINHEIRA</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${currentUser?.online ? 'bg-[#48bb78]' : 'bg-[#4a5568]'}`} />
          <div className="w-8 h-8 rounded-full bg-[#2d3748] overflow-hidden">
            {currentUser?.fotos[0] ? (
              <img src={currentUser.fotos[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#4a5568]" />
            )}
          </div>
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 px-4 pb-4 flex flex-col">
        <div
          ref={cardRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          className="flex-1 rounded-2xl overflow-hidden relative cursor-grab active:cursor-grabbing shadow-soft"
          style={getCardStyle()}
        >
          {/* Photo */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentProfile.fotos[0]})` }}
            onClick={() => {
              setGalleryIndex(0);
              setShowPhotoGallery(true);
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a202c] via-transparent to-transparent" />

          {/* Info Button */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
            className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <Info size={16} className="text-white" />
          </button>

          {/* Swipe Labels */}
          {swipeDirection === 'right' && (
            <div className="absolute top-8 left-8 border-2 border-[#48bb78] text-[#48bb78] font-bold text-xl px-4 py-1 rounded-lg rotate-[-12deg]">
              INTERESSE
            </div>
          )}
          {swipeDirection === 'left' && (
            <div className="absolute top-8 right-8 border-2 border-[#f56565] text-[#f56565] font-bold text-xl px-4 py-1 rounded-lg rotate-[12deg]">
              AINDA NÃO
            </div>
          )}
          {swipeDirection === 'up' && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 border-2 border-[#ecc94b] text-[#ecc94b] font-bold text-lg px-4 py-1 rounded-lg">
              TALVEZ ROLE
            </div>
          )}

          {/* Profile Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-white text-2xl font-bold">{currentProfile.nick}</h2>
            <div className="flex items-center gap-1 text-[#a0aec0] text-sm mt-1">
              <MapPin size={14} />
              <span>{currentProfile.cidade}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {prefLabels.slice(0, 3).map((label, i) => (
                <span key={i} className="bg-[#ecc94b]/20 text-[#ecc94b] text-xs font-medium px-2.5 py-1 rounded-full">
                  {label}
                </span>
              ))}
              {prefLabels.length > 3 && (
                <span className="text-[#a0aec0] text-xs">+{prefLabels.length - 3}</span>
              )}
            </div>

            {/* Names & Ages */}
            {showInfo && (
              <div className="mt-3 bg-black/40 backdrop-blur-sm rounded-xl p-3 space-y-1">
                <p className="text-white text-sm">
                  <span className="text-[#a0aec0]">Ele:</span> {currentProfile.nomeDele}, {currentProfile.idadeDele} anos
                </p>
                <p className="text-white text-sm">
                  <span className="text-[#a0aec0]">Ela:</span> {currentProfile.nomeDela}, {currentProfile.idadeDela} anos
                </p>
                {currentProfile.bio && (
                  <p className="text-[#a0aec0] text-sm mt-2 italic">{currentProfile.bio}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => handleSwipe('left')}
            className="w-14 h-14 rounded-full bg-[#2d3748] border border-[#f56565] flex items-center justify-center hover:bg-[#f56565]/20 transition-colors active:scale-95"
          >
            <X size={24} className="text-[#f56565]" />
          </button>
          <button
            onClick={() => handleSwipe('up')}
            className="w-12 h-12 rounded-full bg-[#2d3748] border border-[#ecc94b] flex items-center justify-center hover:bg-[#ecc94b]/20 transition-colors active:scale-95"
          >
            <Star size={20} className="text-[#ecc94b]" />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="w-14 h-14 rounded-full bg-[#2d3748] border border-[#48bb78] flex items-center justify-center hover:bg-[#48bb78]/20 transition-colors active:scale-95"
          >
            <Heart size={24} className="text-[#48bb78]" />
          </button>
        </div>

        <p className="text-center text-[#4a5568] text-xs mt-2">
          Deslize para os lados ou use os botões
        </p>
      </div>

      {/* Match Animation */}
      {showMatchAnimation && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex flex-col items-center justify-center animate-fade-in">
          <div className="text-center space-y-4">
            <div className="relative">
              <Heart size={80} className="text-[#f56565] animate-pulse" fill="#f56565" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart size={60} className="text-[#ecc94b]" fill="#ecc94b" />
              </div>
            </div>
            <h2 className="text-white text-3xl font-bold">É um Match!</h2>
            <p className="text-[#a0aec0]">Vocês se interessaram!</p>
            <button
              onClick={() => setShowMatchAnimation(false)}
              className="bg-[#ecc94b] text-[#1a202c] font-bold px-8 py-3 rounded-xl hover:bg-[#d4b43f] transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Photo Gallery */}
      {showPhotoGallery && (
        <div className="fixed inset-0 z-[70] bg-black flex flex-col">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setShowPhotoGallery(false)} className="text-white">
              <ChevronLeft size={28} />
            </button>
            <span className="text-white text-sm">{galleryIndex + 1} / {currentProfile.fotos.length}</span>
            <div className="w-7" />
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <img
              src={currentProfile.fotos[galleryIndex]}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
            {currentProfile.fotos.length > 1 && (
              <>
                <button
                  onClick={() => setGalleryIndex(prev => Math.max(0, prev - 1))}
                  className="absolute left-2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center"
                  disabled={galleryIndex === 0}
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
                <button
                  onClick={() => setGalleryIndex(prev => Math.min(currentProfile.fotos.length - 1, prev + 1))}
                  className="absolute right-2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center"
                  disabled={galleryIndex === currentProfile.fotos.length - 1}
                >
                  <ChevronRight size={24} className="text-white" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease;
        }
      `}</style>
    </div>
  );
}
