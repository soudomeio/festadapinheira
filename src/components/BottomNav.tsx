import { Home, MessageCircle, Heart, User } from 'lucide-react';

export type TabType = 'home' | 'chat' | 'matches' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs: { id: TabType; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'matches', label: 'Matches', icon: Heart },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a202c]/95 backdrop-blur-md border-t border-[#2d3748]">
      <div className="max-w-[480px] mx-auto flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center gap-1 w-16 h-full relative"
            >
              <Icon
                size={22}
                className={isActive ? 'text-[#ecc94b]' : 'text-[#a0aec0]'}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-[#ecc94b]' : 'text-[#a0aec0]'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#ecc94b] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
