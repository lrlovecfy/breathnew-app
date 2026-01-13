import React from 'react';
import { UserProfile, Language } from '../types';
import { ACHIEVEMENTS } from '../constants';
import { TRANSLATIONS } from '../translations';
import { X, Lock, Trophy } from 'lucide-react';

interface AchievementsModalProps {
  user: UserProfile;
  language: Language;
  onClose: () => void;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({ user, language, onClose }) => {
  const t = TRANSLATIONS[language].achievements;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
                <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <Trophy size={20} className="text-amber-500" fill="currentColor" />
                    {t.title}
                </h2>
                <p className="text-xs text-slate-500">{t.subtitle}</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 transition shadow-sm">
                <X size={18} />
            </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-4 space-y-3 no-scrollbar">
            {ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = achievement.condition(user);
                
                return (
                    <div 
                        key={achievement.id}
                        className={`relative p-4 rounded-2xl border transition-all ${
                            isUnlocked 
                            ? 'bg-amber-50/50 border-amber-100' 
                            : 'bg-slate-50 border-slate-100 grayscale opacity-80'
                        }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm ${isUnlocked ? 'bg-white' : 'bg-slate-200'}`}>
                                {isUnlocked ? achievement.icon : <Lock size={20} className="text-slate-400" />}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-bold text-sm ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                                    {achievement.title[language]}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    {achievement.description[language]}
                                </p>
                            </div>
                        </div>
                        {isUnlocked && (
                             <div className="absolute top-3 right-3">
                                 <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                                     {t.earnedOn}
                                 </span>
                             </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;