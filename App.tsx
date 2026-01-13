import React, { useState, useEffect } from 'react';
import { LayoutDashboard, MessageCircle, Activity, Globe, Settings, UserCircle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import HealthTimeline from './components/HealthTimeline';
import AICoach from './components/AICoach';
import Onboarding from './components/Onboarding';
import Paywall from './components/Paywall';
import SettingsModal from './components/SettingsModal';
import { UserProfile, Language } from './types';
import { generateMotivation } from './services/geminiService';
import { TRANSLATIONS } from './translations';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'coach' | 'health'>('dashboard');
  const [motivation, setMotivation] = useState<string>('');
  const [language, setLanguage] = useState<Language>('en');
  const [showPaywall, setShowPaywall] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Load user and language preference
    const savedUser = localStorage.getItem('breathnew_user');
    const savedLang = localStorage.getItem('breathnew_lang') as Language;
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    // Fetch motivation when user is loaded or language changes
    if (user) {
        generateMotivation(user, language).then(setMotivation);
    }
  }, [user, language]); 

  const toggleLanguage = () => {
      const newLang = language === 'en' ? 'zh' : 'en';
      setLanguage(newLang);
      localStorage.setItem('breathnew_lang', newLang);
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('breathnew_user', JSON.stringify(profile));
  };

  const handleReset = () => {
      if(confirm(TRANSLATIONS[language].app.resetConfirm)) {
          localStorage.removeItem('breathnew_user');
          setUser(null);
          setShowSettings(false);
      }
  }

  const handleUpgrade = () => {
      if (!user) return;
      
      const upgradedUser = { ...user, isPro: true };
      setUser(upgradedUser);
      localStorage.setItem('breathnew_user', JSON.stringify(upgradedUser));
      setShowPaywall(false);
      alert(language === 'zh' ? "升级成功！感谢您的支持。" : "Upgrade successful! Thank you for your support.");
  }

  const handleCancelSubscription = () => {
      if (!user) return;
      if(confirm(language === 'zh' ? "确定要取消订阅吗？" : "Are you sure you want to cancel subscription?")) {
          const downgradedUser = { ...user, isPro: false };
          setUser(downgradedUser);
          localStorage.setItem('breathnew_user', JSON.stringify(downgradedUser));
          setShowSettings(false);
      }
  }

  if (!user) {
    return (
        <Onboarding 
            onComplete={handleOnboardingComplete} 
            language={language}
            onToggleLanguage={toggleLanguage}
        />
    );
  }

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      
      {/* Paywall Overlay */}
      {showPaywall && (
        <Paywall 
            language={language} 
            onClose={() => setShowPaywall(false)} 
            onUpgrade={handleUpgrade}
        />
      )}

      {/* Settings Overlay */}
      {showSettings && (
          <SettingsModal 
            user={user}
            language={language}
            onClose={() => setShowSettings(false)}
            onReset={handleReset}
            onUpgrade={() => {
                setShowSettings(false);
                setShowPaywall(true);
            }}
            onCancelSubscription={handleCancelSubscription}
          />
      )}

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-100 px-4 py-3">
        <div className="max-w-md mx-auto flex justify-between items-center">
            <h1 className="font-bold text-lg text-emerald-800 tracking-tight">{t.app.name}</h1>
            <div className="flex items-center gap-3">
                <button 
                    onClick={toggleLanguage}
                    className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-emerald-600 bg-slate-100 px-2 py-1 rounded-full transition"
                >
                    <Globe size={12} />
                    {language === 'en' ? 'EN' : '中'}
                </button>
                <button 
                    onClick={() => setShowSettings(true)} 
                    className="text-slate-400 hover:text-emerald-600 transition p-1"
                >
                    <UserCircle size={24} />
                </button>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-20 pb-28 px-4 max-w-md mx-auto min-h-screen">
        
        {/* Dynamic Greeting */}
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
                {activeTab === 'dashboard' && `${t.dashboard.greeting}, ${user.name}`}
                {activeTab === 'health' && t.timeline.title}
                {activeTab === 'coach' && t.coach.title}
            </h2>
            {activeTab === 'dashboard' && (
                <p className="text-slate-500 text-sm mt-1 italic">"{motivation}"</p>
            )}
        </div>

        {/* View Routing */}
        <div className="fade-in">
            {activeTab === 'dashboard' && (
                <Dashboard 
                    user={user} 
                    language={language} 
                    onShowPaywall={() => setShowPaywall(true)} 
                />
            )}
            {activeTab === 'health' && (
                <HealthTimeline 
                    user={user} 
                    language={language} 
                    onShowPaywall={() => setShowPaywall(true)} 
                />
            )}
            {activeTab === 'coach' && (
                <AICoach 
                    user={user} 
                    language={language} 
                    onShowPaywall={() => setShowPaywall(true)}
                />
            )}
        </div>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-20">
        <div className="max-w-md mx-auto flex justify-around items-center px-2 py-3">
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition w-20 ${activeTab === 'dashboard' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <LayoutDashboard size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{t.nav.home}</span>
            </button>

            <button 
                onClick={() => setActiveTab('health')}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition w-20 ${activeTab === 'health' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <Activity size={24} strokeWidth={activeTab === 'health' ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{t.nav.health}</span>
            </button>

            <button 
                onClick={() => setActiveTab('coach')}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition w-20 ${activeTab === 'coach' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <MessageCircle size={24} strokeWidth={activeTab === 'coach' ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{t.nav.coach}</span>
            </button>
        </div>
      </nav>
      
      {/* Safe area padding for mobile */}
      <div className="h-6 w-full bg-white fixed bottom-0 z-10 hidden md:block"></div>
    </div>
  );
};

export default App;