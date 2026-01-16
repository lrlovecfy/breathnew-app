import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { X, User, Crown, LogOut, ShieldCheck, CreditCard, Pencil, Save, Moon, Bell } from 'lucide-react';

interface SettingsModalProps {
  user: UserProfile;
  language: Language;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onClose: () => void;
  onReset: () => void;
  onUpgrade: () => void;
  onCancelSubscription: () => void;
  onUpdateProfile: (data: Partial<UserProfile>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    user, 
    language, 
    theme,
    onToggleTheme,
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

  const handleToggleNotifications = async () => {
      const newState = !user.notificationsEnabled;
      
      if (newState) {
          // Request permission
          if (!("Notification" in window)) {
              alert("This browser does not support desktop notifications");
              return;
          }
          
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
              onUpdateProfile({ notificationsEnabled: true });
          } else {
              alert(tSet.permissionDenied);
              onUpdateProfile({ notificationsEnabled: false });
          }
      } else {
          onUpdateProfile({ notificationsEnabled: false });
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar transition-colors duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 sticky top-0 z-10 transition-colors">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <User size={20} className="text-slate-400" />
                {tSet.title}
            </h2>
            <button onClick={onClose} className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition shadow-sm">
                <X size={18} />
            </button>
        </div>

        <div className="p-6 space-y-6">
            
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                 <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                     <Moon size={18} className="text-slate-400 dark:text-slate-300" />
                     <span className="text-sm font-semibold">{tSet.darkMode}</span>
                 </div>
                 <button 
                    onClick={onToggleTheme}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-300'}`}
                 >
                     <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </button>
            </div>

            {/* Notifications Toggle */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
                 <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                         <Bell size={18} className="text-slate-400 dark:text-slate-300" />
                         <span className="text-sm font-semibold">{tSet.notifications}</span>
                     </div>
                     <button 
                        onClick={handleToggleNotifications}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${user.notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                     >
                         <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${user.notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                     </button>
                 </div>
                 
                 {user.notificationsEnabled && (
                     <div className="pt-2 border-t border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 fade-in">
                         <div className="flex justify-between items-center mb-1">
                             <span className="text-xs text-slate-500 dark:text-slate-400">{tSet.frequency}</span>
                             <div className="flex bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600">
                                 <button 
                                    onClick={() => onUpdateProfile({ notificationFrequency: 'daily' })}
                                    className={`px-3 py-1 rounded-md text-xs font-medium transition ${user.notificationFrequency === 'daily' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
                                 >
                                    {tSet.daily}
                                 </button>
                                 <button 
                                    onClick={() => onUpdateProfile({ notificationFrequency: 'weekly' })}
                                    className={`px-3 py-1 rounded-md text-xs font-medium transition ${user.notificationFrequency === 'weekly' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
                                 >
                                    {tSet.weekly}
                                 </button>
                             </div>
                         </div>
                     </div>
                 )}
            </div>

            {/* Profile Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">{tSet.profile}</h3>
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 px-2 py-1 rounded transition"
                        >
                            <Pencil size={12} /> {tSet.edit}
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 transition-colors">
                         <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">{tSet.name}</label>
                            <input 
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full text-sm p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:border-emerald-500 outline-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">{tSet.cigs}</label>
                                <input 
                                    type="number"
                                    value={editCigs}
                                    onChange={(e) => setEditCigs(e.target.value)}
                                    className="w-full text-sm p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">{tSet.cost}</label>
                                <div className="flex">
                                    <select 
                                        value={editCurrency}
                                        onChange={(e) => setEditCurrency(e.target.value)}
                                        className="text-sm p-2 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-slate-100 outline-none w-12"
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
                                        className="w-full text-sm p-2 rounded-r-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                             <button 
                                onClick={handleCancelEdit}
                                className="flex-1 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition"
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
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-2 transition-colors">
                         <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700/50 pb-2 last:border-0 last:pb-0">
                             <span className="text-xs text-slate-500 dark:text-slate-400">{tSet.name}</span>
                             <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.name}</span>
                         </div>
                         <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700/50 pb-2 last:border-0 last:pb-0">
                             <span className="text-xs text-slate-500 dark:text-slate-400">{tSet.cigs}</span>
                             <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.cigarettesPerDay}</span>
                         </div>
                         <div className="flex justify-between items-center pb-0">
                             <span className="text-xs text-slate-500 dark:text-slate-400">{tSet.cost}</span>
                             <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.currency}{user.costPerPack}</span>
                         </div>
                    </div>
                )}
            </div>

            {/* Subscription Status */}
            <div className={`p-4 rounded-2xl border ${user.isPro ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-amber-100 dark:border-amber-900/50' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'} transition-colors`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plan</span>
                    {user.isPro ? (
                        <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                            <Crown size={12} fill="currentColor" /> PRO
                        </span>
                    ) : (
                        <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-md">FREE</span>
                    )}
                </div>
                
                {user.isPro ? (
                    <div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">You have full access to all premium features.</p>
                        <button 
                            onClick={onCancelSubscription}
                            className="text-xs text-red-500 font-medium hover:text-red-600 underline"
                        >
                            Cancel Subscription
                        </button>
                    </div>
                ) : (
                    <div>
                         <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">Upgrade to unlock unlimited AI coaching and health stats.</p>
                         <button 
                            onClick={() => {
                                onClose();
                                onUpgrade();
                            }}
                            className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 dark:hover:bg-emerald-700 transition"
                        >
                            {tPaywall.cta}
                        </button>
                    </div>
                )}
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
                <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-3">
                        <CreditCard size={18} />
                        <span className="text-sm font-medium">Billing</span>
                    </div>
                    <span className="text-xs text-slate-400">Stripe / Apple</span>
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={18} />
                        <span className="text-sm font-medium">Privacy Policy</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 pb-2">
                <button 
                    onClick={onReset}
                    className="w-full flex items-center justify-center gap-2 text-red-500 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition text-sm font-medium"
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