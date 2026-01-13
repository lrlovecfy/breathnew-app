import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { ArrowRight, Cigarette, Wallet, Globe, Crown, Check, X } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  language: Language;
  onToggleLanguage: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, language, onToggleLanguage }) => {
  const t = TRANSLATIONS[language].onboarding;
  const tPaywall = TRANSLATIONS[language].paywall;
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [cigsPerDay, setCigsPerDay] = useState('');
  const [cost, setCost] = useState('');
  const [currency, setCurrency] = useState('$');

  const handleComplete = (isPro: boolean = false) => {
    const profile: UserProfile = {
      name,
      quitDate: new Date().toISOString(),
      cigarettesPerDay: parseInt(cigsPerDay) || 10,
      costPerPack: parseFloat(cost) || 10,
      cigarettesPerPack: 20,
      currency,
      isPro: isPro
    };
    onComplete(profile);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white relative">
      {/* Language Toggle for Onboarding */}
      <button 
        onClick={onToggleLanguage}
        className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-200 transition z-10"
      >
        <Globe size={14} />
        {language === 'en' ? 'EN' : '中'}
      </button>

      <div className="w-full max-w-md space-y-8">
        {step < 3 && (
            <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌿</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">{t.welcome}</h1>
            <p className="text-slate-500">{t.subtitle}</p>
            </div>
        )}

        <div className={`bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm ${step === 3 ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100' : ''}`}>
          {step === 1 && (
            <div className="space-y-4 fade-in">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">{t.nameLabel}</span>
                <input 
                  type="text" 
                  className="mt-1 block w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-slate-800 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 outline-none border"
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <button 
                onClick={() => name && setStep(2)}
                className="w-full bg-slate-800 text-white py-3 rounded-xl font-medium hover:bg-slate-900 transition flex items-center justify-center gap-2"
              >
                {t.next} <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 fade-in">
               <label className="block">
                <div className="flex items-center gap-2 mb-1">
                    <Cigarette size={16} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{t.cigsLabel}</span>
                </div>
                <input 
                  type="number" 
                  className="mt-1 block w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-slate-800 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 outline-none border"
                  placeholder={t.cigsPlaceholder}
                  value={cigsPerDay}
                  onChange={(e) => setCigsPerDay(e.target.value)}
                />
              </label>
               <label className="block">
                <div className="flex items-center gap-2 mb-1">
                    <Wallet size={16} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{t.costLabel}</span>
                </div>
                <div className="flex gap-2">
                    <select 
                        value={currency} 
                        onChange={(e) => setCurrency(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-800 outline-none"
                    >
                        <option value="$">$</option>
                        <option value="€">€</option>
                        <option value="£">£</option>
                        <option value="¥">¥</option>
                    </select>
                    <input 
                    type="number" 
                    className="flex-1 block w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-slate-800 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 outline-none border"
                    placeholder={t.costPlaceholder}
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    />
                </div>
              </label>
              <div className="flex gap-3 pt-2">
                <button 
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 transition"
                >
                    {t.back}
                </button>
                <button 
                    onClick={() => {
                        if (cigsPerDay && cost) setStep(3);
                    }}
                    disabled={!cigsPerDay || !cost}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50"
                >
                    {t.next} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 fade-in text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-orange-200">
                    <Crown size={32} className="text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{tPaywall.title}</h2>
                    <p className="text-slate-500 text-sm">{tPaywall.subtitle}</p>
                </div>
                
                <ul className="space-y-3 text-left bg-white/50 p-4 rounded-xl border border-amber-100">
                    <li className="flex items-center gap-3">
                        <div className="bg-amber-100 p-1 rounded-full text-amber-600">
                            <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="text-slate-700 text-sm font-medium">{tPaywall.feature1}</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="bg-amber-100 p-1 rounded-full text-amber-600">
                            <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="text-slate-700 text-sm font-medium">{tPaywall.feature2}</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="bg-amber-100 p-1 rounded-full text-amber-600">
                            <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="text-slate-700 text-sm font-medium">{tPaywall.feature3}</span>
                    </li>
                </ul>

                <div className="space-y-3 pt-2">
                    <button 
                        onClick={() => handleComplete(true)}
                        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition transform active:scale-95"
                    >
                        {tPaywall.cta} <span className="text-amber-300 font-normal text-sm ml-1">({tPaywall.price})</span>
                    </button>
                    <button 
                        onClick={() => handleComplete(false)}
                        className="text-slate-400 text-xs font-medium hover:text-slate-600 py-2"
                    >
                        {tPaywall.cancel}
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;