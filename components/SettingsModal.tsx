import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { X, User, Crown, LogOut, ShieldCheck, CreditCard, Pencil, Save, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  user: UserProfile;
  language: Language;
  onClose: () => void;
  onReset: () => void;
  onUpgrade: () => void;
  onCancelSubscription: () => void;
  onUpdateProfile: (data: Partial<UserProfile>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    user, 
    language, 
    onClose, 
    onReset,
    onUpgrade,
    onCancelSubscription,
    onUpdateProfile
}) => {
  const t = TRANSLATIONS[language].app;
  const tSet = TRANSLATIONS[language].settings;
  const tPaywall = TRANSLATIONS[language].paywall;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editCigs, setEditCigs] = useState(user.cigarettesPerDay.toString());
  const [editCost, setEditCost] = useState(user.costPerPack.toString());
  const [editCurrency, setEditCurrency] = useState(user.currency);

  const handleSave = () => {
    onUpdateProfile({
        name: editName,
        cigarettesPerDay: parseInt(editCigs) || 0,
        costPerPack: parseFloat(editCost) || 0,
        currency: editCurrency
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(user.name);
    setEditCigs(user.cigarettesPerDay.toString());
    setEditCost(user.costPerPack.toString());
    setEditCurrency(user.currency);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <User size={20} className="text-slate-400" />
                {tSet.title}
            </h2>
            <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 transition shadow-sm">
                <X size={18} />
            </button>
        </div>

        <div className="p-6 space-y-6">
            
            {/* Profile Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700">{tSet.profile}</h3>
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="text-emerald-600 text-xs font-medium flex items-center gap-1 hover:bg-emerald-50 px-2 py-1 rounded transition"
                        >
                            <Pencil size={12} /> {tSet.edit}
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                         <div>
                            <label className="text-xs text-slate-500 font-medium block mb-1">{tSet.name}</label>
                            <input 
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full text-sm p-2 rounded-lg border border-slate-300 focus:border-emerald-500 outline-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-xs text-slate-500 font-medium block mb-1">{tSet.cigs}</label>
                                <input 
                                    type="number"
                                    value={editCigs}
                                    onChange={(e) => setEditCigs(e.target.value)}
                                    className="w-full text-sm p-2 rounded-lg border border-slate-300 focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-slate-500 font-medium block mb-1">{tSet.cost}</label>
                                <div className="flex">
                                    <select 
                                        value={editCurrency}
                                        onChange={(e) => setEditCurrency(e.target.value)}
                                        className="text-sm p-2 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 outline-none w-12"
                                    >
                                        <option value="$">$</option>
                                        <option value="€">€</option>
                                        <option value="£">£</option>
                                        <option value="¥">¥</option>
                                    </select>
                                    <input 
                                        type="number"
                                        value={editCost}
                                        onChange={(e) => setEditCost(e.target.value)}
                                        className="w-full text-sm p-2 rounded-r-lg border border-slate-300 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                             <button 
                                onClick={handleCancelEdit}
                                className="flex-1 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
                             >
                                {tSet.cancel}
                             </button>
                             <button 
                                onClick={handleSave}
                                className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-1.5"
                             >
                                <Save size={14} /> {tSet.save}
                             </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                         <div className="flex justify-between items-center border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                             <span className="text-xs text-slate-500">{tSet.name}</span>
                             <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                         </div>
                         <div className="flex justify-between items-center border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                             <span className="text-xs text-slate-500">{tSet.cigs}</span>
                             <span className="text-sm font-semibold text-slate-700">{user.cigarettesPerDay}</span>
                         </div>
                         <div className="flex justify-between items-center pb-0">
                             <span className="text-xs text-slate-500">{tSet.cost}</span>
                             <span className="text-sm font-semibold text-slate-700">{user.currency}{user.costPerPack}</span>
                         </div>
                    </div>
                )}
            </div>

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

            <div className="border-t border-slate-100 pt-4 pb-2">
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