import React from 'react';
import { UserProfile, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { X, User, Crown, LogOut, ShieldCheck, CreditCard } from 'lucide-react';

interface SettingsModalProps {
  user: UserProfile;
  language: Language;
  onClose: () => void;
  onReset: () => void;
  onUpgrade: () => void;
  onCancelSubscription: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    user, 
    language, 
    onClose, 
    onReset,
    onUpgrade,
    onCancelSubscription
}) => {
  const t = TRANSLATIONS[language].app;
  const tPaywall = TRANSLATIONS[language].paywall;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <User size={20} className="text-slate-400" />
                {user.name}
            </h2>
            <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 transition shadow-sm">
                <X size={18} />
            </button>
        </div>

        <div className="p-6 space-y-6">
            {/* Subscription Status */}
            <div className={`p-4 rounded-2xl border ${user.isPro ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plan</span>
                    {user.isPro ? (
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                            <Crown size={12} fill="currentColor" /> PRO
                        </span>
                    ) : (
                        <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">FREE</span>
                    )}
                </div>
                
                {user.isPro ? (
                    <div>
                        <p className="text-slate-600 text-sm mb-4">You have full access to all premium features.</p>
                        <button 
                            onClick={onCancelSubscription}
                            className="text-xs text-red-500 font-medium hover:text-red-600 underline"
                        >
                            Cancel Subscription
                        </button>
                    </div>
                ) : (
                    <div>
                         <p className="text-slate-600 text-sm mb-4">Upgrade to unlock unlimited AI coaching and health stats.</p>
                         <button 
                            onClick={() => {
                                onClose();
                                onUpgrade();
                            }}
                            className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition"
                        >
                            {tPaywall.cta}
                        </button>
                    </div>
                )}
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
                <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition cursor-pointer text-slate-600">
                    <div className="flex items-center gap-3">
                        <CreditCard size={18} />
                        <span className="text-sm font-medium">Billing</span>
                    </div>
                    <span className="text-xs text-slate-400">Stripe / Apple</span>
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition cursor-pointer text-slate-600">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={18} />
                        <span className="text-sm font-medium">Privacy Policy</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
                <button 
                    onClick={onReset}
                    className="w-full flex items-center justify-center gap-2 text-red-500 p-3 hover:bg-red-50 rounded-xl transition text-sm font-medium"
                >
                    <LogOut size={18} />
                    {t.reset}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;