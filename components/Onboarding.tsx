import React, { useState, useEffect } from 'react';
import { UserProfile, Language } from '../types';
import { ArrowRight, Cigarette, Wallet, Globe, Crown, Check, TrendingUp, Sparkles, ChevronLeft } from 'lucide-react';
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
  
  // Calculations for Step 3
  const dailyCost = (parseInt(cigsPerDay || '0') / 20) * (parseFloat(cost || '0'));
  const yearlyWaste = dailyCost * 365;

  const handleComplete = (isPro: boolean = false) => {
    const profile: UserProfile = {
      name,
      quitDate: new Date().toISOString(),
      cigarettesPerDay: parseInt(cigsPerDay) || 10,
      costPerPack: parseFloat(cost) || 10,
      cigarettesPerPack: 20,
      currency,
      isPro: isPro,
      cravingsResisted: 0
    };
    onComplete(profile);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-full h-64 bg-emerald-100/50 dark:bg-emerald-900/20 blur-3xl -z-10 rounded-b-[50%]"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-100/50 dark:bg-amber-900/20 blur-3xl -z-10 rounded-full"></div>

      {/* Language Toggle for Onboarding */}
      <button 
        onClick={onToggleLanguage}
        className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 shadow-sm rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition z-20 border border-slate-100 dark:border-slate-700"
      >
        <Globe size={14} />
        {language === 'en' ? 'EN' : '中'}
      </button>

      <div className="w-full max-w-md">
        
        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map(i => (
                <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200 dark:bg-slate-700'}`}
                />
            ))}
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden transition-colors">
          
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="slide-up">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 shadow-emerald-100 dark:shadow-none shadow-lg">
                <Sparkles size={28} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.step1Title}</h1>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">{t.subtitle}</p>
              
              <label className="block mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t.nameLabel}</span>
                <input 
                  type="text" 
                  className="block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-4 text-lg font-medium text-slate-800 dark:text-slate-100 focus:border-emerald-500 outline-none border transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </label>
              
              <button 
                onClick={() => name && nextStep()}
                disabled={!name.trim()}
                className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
              >
                {t.next} <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* Step 2: Habits */}
          {step === 2 && (
            <div className="slide-up">
               <button onClick={prevStep} className="mb-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"><ChevronLeft size={24} /></button>
               
               <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                 {t.step2Title.replace('{name}', name)}
               </h2>
               <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">We need this to calculate your health and savings recovery.</p>

               <div className="space-y-4 mb-8">
                   <label className="block group">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-focus-within:bg-emerald-100 dark:group-focus-within:bg-emerald-900/50 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors">
                            <Cigarette size={16} className="text-slate-500 dark:text-slate-400 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.cigsLabel}</span>
                    </div>
                    <input 
                      type="number" 
                      className="block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 focus:border-emerald-500 outline-none border transition-all"
                      placeholder={t.cigsPlaceholder}
                      value={cigsPerDay}
                      onChange={(e) => setCigsPerDay(e.target.value)}
                      autoFocus
                    />
                  </label>
                   <label className="block group">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-focus-within:bg-emerald-100 dark:group-focus-within:bg-emerald-900/50 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors">
                            <Wallet size={16} className="text-slate-500 dark:text-slate-400 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.costLabel}</span>
                    </div>
                    <div className="flex gap-2">
                        <select 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)}
                            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-3 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 transition-all font-medium"
                        >
                            <option value="$">$</option>
                            <option value="€">€</option>
                            <option value="£">£</option>
                            <option value="¥">¥</option>
                        </select>
                        <input 
                        type="number" 
                        className="flex-1 block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 focus:border-emerald-500 outline-none border transition-all"
                        placeholder={t.costPlaceholder}
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        />
                    </div>
                  </label>
              </div>

              <button 
                  onClick={() => {
                      if (cigsPerDay && cost) nextStep();
                  }}
                  disabled={!cigsPerDay || !cost}
                  className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                  {t.next} <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* Step 3: The Reveal / Paywall */}
          {step === 3 && (
            <div className="slide-up text-center">
                 <button onClick={prevStep} className="absolute top-8 left-8 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"><ChevronLeft size={24} /></button>
                
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-orange-200 dark:shadow-none mb-4 scale-in">
                    <TrendingUp size={32} className="text-white" />
                </div>
                
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{t.step3Title}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 px-4">{t.step3Subtitle}</p>
                
                {/* Savings Comparison Card */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 mb-6 text-left relative overflow-hidden transition-colors">
                     {/* Decorative background stripe */}
                    <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-red-50 to-transparent dark:from-red-900/20"></div>

                    <div className="mb-4 relative z-10">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">{t.yearlyWaste}</p>
                        <div className="flex items-baseline gap-1 text-red-500 dark:text-red-400">
                             <span className="text-lg font-medium">{currency}</span>
                             <span className="text-3xl font-bold tracking-tight">{yearlyWaste.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>
                    
                    <div className="h-px bg-slate-200 dark:bg-slate-700 w-full mb-4"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">{t.yearlyCost}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{t.investment}</p>
                            </div>
                             <div className="flex items-baseline gap-1 text-emerald-600 dark:text-emerald-400">
                                 <span className="text-sm font-medium">{currency}</span>
                                 <span className="text-2xl font-bold tracking-tight">29.99</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={() => handleComplete(true)}
                        className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Crown size={18} fill="currentColor" className="text-emerald-200"/>
                        {tPaywall.cta}
                    </button>
                    <button 
                        onClick={() => handleComplete(false)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-medium py-2"
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