import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import PineLogo from '@/components/PineLogo';
import BottomNav, { type TabType } from '@/components/BottomNav';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import HomePage from '@/pages/HomePage';
import ChatPage from '@/pages/ChatPage';
import MatchesPage from '@/pages/MatchesPage';
import ProfilePage from '@/pages/ProfilePage';
import './App.css';

type PageType = 'login' | 'register' | 'home' | 'chat' | 'matches' | 'profile';

function AppContent() {
  const { isLoggedIn, logout } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [page, setPage] = useState<PageType>('login');
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Show splash screen on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // When login state changes, navigate appropriately
  useEffect(() => {
    if (isLoggedIn) {
      setPage('home');
      setActiveTab('home');
    } else {
      setPage('login');
    }
  }, [isLoggedIn]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(tab as PageType);
  };

  const handleNavigate = (targetPage: string) => {
    setPage(targetPage as PageType);
    if (['home', 'chat', 'matches', 'profile'].includes(targetPage)) {
      setActiveTab(targetPage as TabType);
    }
  };

  const handleLogout = () => {
    logout();
    setPage('login');
  };

  const renderPage = () => {
    switch (page) {
      case 'login':
        return <LoginPage onGoToRegister={() => setPage('register')} />;
      case 'register':
        return <RegisterPage onGoToLogin={() => setPage('login')} />;
      case 'home':
        return <HomePage />;
      case 'chat':
        return <ChatPage onNavigate={handleNavigate} />;
      case 'matches':
        return <MatchesPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onLogout={handleLogout} />;
      default:
        return <HomePage />;
    }
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-[#1a202c] flex items-center justify-center">
        <PineLogo onComplete={() => setShowSplash(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] flex justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-[480px] bg-[#1a202c] min-h-screen relative shadow-2xl">
        {/* Main Content */}
        <main className={`${isLoggedIn ? 'h-[calc(100vh-64px)] overflow-hidden' : 'min-h-screen'}`}>
          {renderPage()}
        </main>

        {/* Bottom Navigation */}
        {isLoggedIn && (
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
