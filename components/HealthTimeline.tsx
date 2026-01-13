import React, { useEffect, useState } from 'react';
import { UserProfile, Language } from '../types';
import { HEALTH_MILESTONES } from '../constants';
import { TRANSLATIONS } from '../translations';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

interface HealthTimelineProps {
  user: UserProfile;
  language: Language;
  onShowPaywall: () => void;
}

const HealthTimeline: React.FC<HealthTimelineProps> = ({ user, language, onShowPaywall }) => {
  const [now, setNow] = useState(new Date());
  const t = TRANSLATIONS[language].timeline;

  useEffect(() => {
    // Update every minute to refresh progress bars
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const quitDate = new Date(user.quitDate);
  const secondsSinceQuit = (now.getTime() - quitDate.getTime()) / 1000;

  return (
    <div className="space-y-6 pb-24 px-1">
      <h2 className="text-xl font-bold text-slate-800 mb-4">{t.title}</h2>
      
      <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
        {HEALTH_MILESTONES.map((milestone, index) => {
          // Monetization Logic: Lock items after index 2 if not Pro
          const isLocked = !user.isPro && index > 2;
          
          const progress = Math.min(100, Math.max(0, (secondsSinceQuit / milestone.durationSeconds) * 100));
          const isCompleted = progress >= 100;
          const isStarted = progress > 0;

          if (isLocked) {
              return (
                <div key={milestone.id} className="relative pl-8" onClick={onShowPaywall}>
                    <div className="absolute -left-[9px] top-1 w-5 h-5 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center text-slate-300">
                        <Lock size={12} />
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative overflow-hidden group cursor-pointer">
                         {/* Blur Effect */}
                        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40 flex items-center justify-center z-10 transition group-hover:bg-white/20">
                            <div className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                <Lock size={12} />
                                {t.unlock}
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-start mb-2 opacity-50 blur-[1px]">
                             <h3 className="font-semibold text-slate-700">{milestone.title[language]}</h3>
                        </div>
                        <p className="text-sm text-slate-500 mb-3 opacity-50 blur-[1px]">
                             {milestone.description[language]}
                        </p>
                    </div>
                </div>
              )
          }

          return (
            <div key={milestone.id} className="relative pl-8">
              {/* Timeline Dot */}
              <div className={`absolute -left-[9px] top-1 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center
                ${isCompleted ? 'border-emerald-500 text-emerald-500' : isStarted ? 'border-blue-500 text-blue-500' : 'border-slate-300 text-slate-300'}`}>
                {isCompleted ? <CheckCircle2 size={16} fill="currentColor" className="text-white" /> : 
                 isStarted ? <div className="w-2 h-2 rounded-full bg-blue-500" /> :
                 <Lock size={12} />}
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-semibold ${isCompleted ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {milestone.title[language]}
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                
                <p className="text-sm text-slate-500 mb-3 leading-relaxed">
                  {milestone.description[language]}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HealthTimeline;