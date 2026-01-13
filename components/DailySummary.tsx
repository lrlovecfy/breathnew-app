import React from 'react';
import { UserProfile, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { HEALTH_MILESTONES } from '../constants';
import { X, Trophy, Wallet, Wind, Calendar } from 'lucide-react';

interface DailySummaryProps {
    user: UserProfile;
    language: Language;
    onClose: () => void;
}

const DailySummary: React.FC<DailySummaryProps> = ({ user, language, onClose }) => {
    const t = TRANSLATIONS[language].dailySummary;
    const now = new Date();
    const quitDate = new Date(user.quitDate);
    const diffSeconds = (now.getTime() - quitDate.getTime()) / 1000;

    // Daily stats (based on user settings)
    const dailyAvoided = user.cigarettesPerDay;
    const dailySaved = (user.cigarettesPerDay / user.cigarettesPerPack) * user.costPerPack;

    // Find latest completed milestone
    // Filter milestones that are completed, then take the last one (assuming they are ordered by duration)
    const completedMilestones = HEALTH_MILESTONES.filter(m => diffSeconds >= m.durationSeconds);
    const latestMilestone = completedMilestones.length > 0 
        ? completedMilestones[completedMilestones.length - 1] 
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 fade-in">
             <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 transition">
                    <X size={20} />
                </button>
                
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                        <Calendar size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{t.title}</h2>
                </div>
                <p className="text-slate-500 text-sm mb-6 pl-12 -mt-1">{t.subtitle}</p>

                <div className="space-y-4">
                    {/* Avoided */}
                    <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                        <div className="bg-emerald-200 p-3 rounded-full text-emerald-700">
                             <Wind size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">{t.avoided}</p>
                            <p className="text-xl font-bold text-slate-800">{dailyAvoided}</p>
                        </div>
                    </div>

                    {/* Money Saved */}
                    <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <div className="bg-blue-200 p-3 rounded-full text-blue-700">
                             <Wallet size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">{t.saved}</p>
                            <p className="text-xl font-bold text-slate-800">{user.currency}{dailySaved.toFixed(2)}</p>
                        </div>
                    </div>
                    
                    {/* Latest Milestone */}
                    {latestMilestone && (
                        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy size={16} className="text-amber-600" />
                                <p className="text-xs text-amber-800 font-bold uppercase">{t.milestone}</p>
                            </div>
                            <p className="font-semibold text-slate-800 text-sm mb-1">{latestMilestone.title[language]}</p>
                            <p className="text-xs text-slate-600 leading-relaxed">{latestMilestone.description[language]}</p>
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={onClose} 
                    className="w-full mt-6 bg-slate-900 text-white py-3.5 rounded-2xl font-semibold hover:bg-slate-800 transition active:scale-95 duration-200"
                >
                    {t.close}
                </button>
             </div>
        </div>
    );
}
export default DailySummary;