import React, { useEffect, useState } from 'react';
import { UserProfile, Language } from '../types';
import { Leaf, DollarSign, Activity, Wind, Crown, ArrowRight, Calendar, Timer, Trophy } from 'lucide-react';
import { TRANSLATIONS } from '../translations';
import DailySummary from './DailySummary';
import CravingTimer from './CravingTimer';
import AchievementsModal from './AchievementsModal';

interface DashboardProps {
  user: UserProfile;
  language: Language;
  onShowPaywall: () => void;
  onUpdateProfile: (data: Partial<UserProfile>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, language, onShowPaywall, onUpdateProfile }) => {
  const [now, setNow] = useState(new Date());
  const [showDailySummary, setShowDailySummary] = useState(false);
  const [showCravingTimer, setShowCravingTimer] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const t = TRANSLATIONS[language].dashboard;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quitDate = new Date(user.quitDate);
  const diffMs = now.getTime() - quitDate.getTime();
  
  // Time calculations
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  // Stats calculations
  const cigarettesAvoided = Math.floor((diffMs / (1000 * 60 * 60 * 24)) * user.cigarettesPerDay);
  const moneySaved = ((cigarettesAvoided / user.cigarettesPerPack) * user.costPerPack).toFixed(2);
  const lifeRegainedMinutes = cigarettesAvoided * 11; // Approx 11 mins gained per cigarette not smoked
  const lifeRegainedHours = (lifeRegainedMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Time Counter */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200 dark:shadow-none relative overflow-hidden">
        {user.isPro && (
             <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                <Crown size={12} className="text-amber-300" fill="currentColor" />
                <span className="text-[10px] font-bold tracking-wide text-white">{t.proBadge}</span>
             </div>
        )}

        <h2 className="text-emerald-100 text-sm font-medium uppercase tracking-wider mb-2">{t.smokeFree}</h2>
        <div className="flex items-baseline space-x-2">
            <span className="text-6xl font-bold">{days}</span>
            <span className="text-xl opacity-80">{t.days}</span>
        </div>
        <div className="flex space-x-4 mt-2 text-emerald-100 font-medium">
            <span>{hours} {t.hours}</span>
            <span>{minutes} {t.mins}</span>
            <span className="animate-pulse">●</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button 
            onClick={() => setShowCravingTimer(true)}
            className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 py-3 rounded-2xl text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition flex flex-col items-center justify-center gap-1 shadow-sm"
        >
            <Timer size={18} />
            {t.cravingTimerBtn}
        </button>
        <button 
            onClick={() => setShowDailySummary(true)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 py-3 rounded-2xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-emerald-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition flex flex-col items-center justify-center gap-1 shadow-sm"
        >
            <Calendar size={18} />
            {t.dailySummaryBtn}
        </button>
        <button 
            onClick={() => setShowAchievements(true)}
            className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 text-amber-700 dark:text-amber-500 py-3 rounded-2xl text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition flex flex-col items-center justify-center gap-1 shadow-sm"
        >
            <Trophy size={18} />
            {t.achievementsBtn}
        </button>
      </div>

      {/* Upgrade Banner (Only if not Pro) */}
      {!user.isPro && (
        <div 
            onClick={onShowPaywall}
            className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-2xl p-4 flex items-center justify-between cursor-pointer border border-amber-200 dark:border-amber-800 shadow-sm"
        >
            <div className="flex items-center gap-3">
                <div className="bg-amber-400 dark:bg-amber-600 p-2 rounded-full text-white">
                    <Crown size={20} fill="currentColor" />
                </div>
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 leading-tight max-w-[180px]">
                    {t.upgradeBanner}
                </p>
            </div>
            <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-600 dark:text-amber-400 shadow-sm whitespace-nowrap">
                {t.upgradeButton}
            </div>
        </div>
      )}

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4">
        {/* Money Saved */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center transition-colors">
            <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full mb-3 text-green-600 dark:text-green-400">
                <DollarSign size={24} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">{t.moneySaved}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{user.currency}{moneySaved}</p>
        </div>

        {/* Cigarettes Avoided */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center transition-colors">
            <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full mb-3 text-red-500 dark:text-red-400">
                <Wind size={24} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">{t.notSmoked}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{cigarettesAvoided}</p>
        </div>

         {/* Life Regained */}
         <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center col-span-2 transition-colors">
            <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full text-blue-600 dark:text-blue-400">
                    <Activity size={20} />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">{t.lifeRegained}</p>
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{lifeRegainedHours} <span className="text-lg font-normal text-slate-400 dark:text-slate-500">{t.lifeRegainedUnit}</span></p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{t.lifeRegainedNote}</p>
        </div>
      </div>

      {/* Motivational Card */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-xl p-4 flex items-start gap-3 transition-colors">
        <Leaf className="text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-1" size={20} />
        <div>
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 text-sm">{t.healingTitle}</h4>
            <p className="text-emerald-700 dark:text-emerald-400 text-xs mt-1 leading-relaxed">
                {t.healingBody}
            </p>
        </div>
      </div>
      
      {/* Modals */}
      {showDailySummary && (
        <DailySummary user={user} language={language} onClose={() => setShowDailySummary(false)} />
      )}
      {showCravingTimer && (
        <CravingTimer 
            language={language} 
            onClose={() => setShowCravingTimer(false)}
            onUpdateProfile={onUpdateProfile}
            currentCravingsResisted={user.cravingsResisted || 0}
        />
      )}
      {showAchievements && (
        <AchievementsModal user={user} language={language} onClose={() => setShowAchievements(false)} />
      )}
    </div>
  );
};

export default Dashboard;