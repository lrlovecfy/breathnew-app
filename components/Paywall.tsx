import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { X, Check, Star, Crown } from 'lucide-react';

interface PaywallProps {
  language: Language;
  onClose: () => void;
  onUpgrade: () => void;
}

const Paywall: React.FC<PaywallProps> = ({ language, onClose, onUpgrade }) => {
  const t = TRANSLATIONS[language].paywall;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition z-10"
        >
          <X size={20} />
        </button>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-amber-300 to-orange-400 p-8 text-center pt-12 pb-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <Star size={200} className="absolute -top-10 -left-10 text-white" />
                <Crown size={150} className="absolute bottom-0 right-0 text-white" />
            </div>
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                <Crown size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 relative z-10">{t.title}</h2>
            <p className="text-amber-50 text-sm relative z-10">{t.subtitle}</p>
        </div>

        {/* Features List */}
        <div className="px-6 py-6 -mt-8 bg-white rounded-t-3xl relative z-10">
            <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                    <div className="bg-green-100 p-1 rounded-full text-green-600">
                        <Check size={16} strokeWidth={3} />
                    </div>
                    <span className="text-slate-700 font-medium text-sm">{t.feature1}</span>
                </li>
                <li className="flex items-center gap-3">
                    <div className="bg-green-100 p-1 rounded-full text-green-600">
                        <Check size={16} strokeWidth={3} />
                    </div>
                    <span className="text-slate-700 font-medium text-sm">{t.feature2}</span>
                </li>
                <li className="flex items-center gap-3">
                    <div className="bg-green-100 p-1 rounded-full text-green-600">
                        <Check size={16} strokeWidth={3} />
                    </div>
                    <span className="text-slate-700 font-medium text-sm">{t.feature3}</span>
                </li>
            </ul>

            {/* Price & CTA */}
            <div className="text-center space-y-3">
                <p className="text-slate-500 text-sm font-medium">{t.price}</p>
                <button 
                    onClick={onUpgrade}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition shadow-lg shadow-slate-200 transform active:scale-95 duration-200"
                >
                    {t.cta}
                </button>
                <button onClick={onClose} className="text-xs text-slate-400 font-medium hover:text-slate-600">
                    {t.restore}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Paywall;