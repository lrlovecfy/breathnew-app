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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load user and language preference
    const savedUser = localStorage.getItem('breathnew_user');
    const savedLang = localStorage.getItem('breathnew_lang') as Language;
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Ensure new fields exist for backward compatibility
      if (parsedUser.cravingsResisted === undefined) parsedUser.cravingsResisted = 0;
      if (parsedUser.notificationsEnabled === undefined) parsedUser.notificationsEnabled = false;
      if (parsedUser.notificationFrequency === undefined) parsedUser.notificationFrequency = 'daily';
      
      setUser(parsedUser);
      checkAndTriggerNotification(parsedUser, savedLang || 'en');
    }
    if (savedLang) {
      setLanguage(savedLang);
    }

    // Load Theme Preference
    const savedTheme = localStorage.getItem('breathnew_theme') as 'light' | 'dark';
    if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    } else {
        // Optional: Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
    }

    // CHECK FOR PAYMENT SUCCESS
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') === 'true' && savedUser) {
        const currentUser = JSON.parse(savedUser);
        if (!currentUser.isPro) {
            const upgradedUser = { ...currentUser, isPro: true };
            setUser(upgradedUser);
            localStorage.setItem('breathnew_user', JSON.stringify(upgradedUser));
            alert("Payment Successful! You are now a Pro member.");
            // Clean URL
            window.history.replaceState({}, document.title, "/");
        }
    }

  }, []);

  const checkAndTriggerNotification = (currentUser: UserProfile, currentLang: Language) => {
    if (!currentUser.notificationsEnabled) return;
    if (Notification.permission !== 'granted') return;

    const lastNotif = currentUser.lastNotificationDate ? new Date(currentUser.lastNotificationDate).getTime() : 0;
    const now = new Date().getTime();
    
    // Threshold in milliseconds
    const dayMs = 24 * 60 * 60 * 1000;
    const threshold = currentUser.notificationFrequency === 'daily' ? dayMs : dayMs * 7;

    if (now - lastNotif > threshold) {
        // Calculate Streak
        const quitDate = new Date(currentUser.quitDate).getTime();
        const daysSmokeFree = Math.floor((now - quitDate) / dayMs);
        
        const title = currentLang === 'zh' ? "保持坚强！" : "Keep going strong!";
        const body = currentLang === 'zh' 
            ? `您已经戒烟 ${daysSmokeFree} 天了！继续保持！`
            : `You have been smoke-free for ${daysSmokeFree} days! Keep it up!`;

        try {
            new Notification(title, {
                body: body,
                icon: '/icon.svg'
            });

            // Update user profile
            const updatedUser = { ...currentUser, lastNotificationDate: new Date().toISOString() };
            setUser(updatedUser);
            localStorage.setItem('breathnew_user', JSON.stringify(updatedUser));
        } catch (e) {
            console.error("Failed to send notification", e);
        }
    }
  };

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

  const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('breathnew_theme', newTheme);
      if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    const profileWithDefaults = { 
        ...profile, 
        cravingsResisted: 0,
        notificationsEnabled: false,
        notificationFrequency: 'daily' as 'daily'
    };
    setUser(profileWithDefaults);
    localStorage.setItem('breathnew_user', JSON.stringify(profileWithDefaults));
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

  const handleUpdateProfile = (updatedFields: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem('breathnew_user', JSON.stringify(updatedUser));
  };

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900 transition-colors duration-300">
      
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
            theme={theme}
            onToggleTheme={toggleTheme}
            onClose={() => setShowSettings(false)}
            onReset={handleReset}
            onUpgrade={() => {
                setShowSettings(false);
                setShowPaywall(true);
            }}
            onCancelSubscription={handleCancelSubscription}
            onUpdateProfile={handleUpdateProfile}
          />
      )}

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-800 px-4 py-3 transition-colors duration-300">
        <div className="max-w-md mx-auto flex justify-between items-center">
            <h1 className="font-bold text-lg text-emerald-800 dark:text-emerald-400 tracking-tight">{t.app.name}</h1>
            <div className="flex items-center gap-3">
                <button 
                    onClick={toggleLanguage}
                    className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full transition"
                >
                    <Globe size={12} />
                    {language === 'en' ? 'EN' : '中'}
                </button>
                <button 
                    onClick={() => setShowSettings(true)} 
                    className="text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition p-1"
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
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
                {activeTab === 'dashboard' && `${t.dashboard.greeting}, ${user.name}`}
                {activeTab === 'health' && t.timeline.title}
                {activeTab === 'coach' && t.coach.title}
            </h2>
            {activeTab === 'dashboard' && (
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 italic transition-colors">"{motivation}"</p>
            )}
        </div>

        {/* View Routing */}
        <div className="fade-in">
            {activeTab === 'dashboard' && (
                <Dashboard 
                    user={user} 
                    language={language} 
                    onShowPaywall={() => setShowPaywall(true)} 
                    onUpdateProfile={handleUpdateProfile}
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
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-20 transition-colors duration-300">
        <div className="max-w-md mx-auto flex justify-around items-center px-2 py-3">
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition w-20 ${activeTab === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
                <LayoutDashboard size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{t.nav.home}</span>
            </button>

            <button 
                onClick={() => setActiveTab('health')}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition w-20 ${activeTab === 'health' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
                <Activity size={24} strokeWidth={activeTab === 'health' ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{t.nav.health}</span>
            </button>

            <button 
                onClick={() => setActiveTab('coach')}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition w-20 ${activeTab === 'coach' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
                <MessageCircle size={24} strokeWidth={activeTab === 'coach' ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{t.nav.coach}</span>
            </button>
        </div>
      </nav>
      
      {/* Safe area padding for mobile */}
      <div className="h-6 w-full bg-white dark:bg-slate-900 fixed bottom-0 z-10 hidden md:block transition-colors"></div>
    </div>
  );
};

export default App;