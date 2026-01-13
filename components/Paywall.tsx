import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { PAYMENT_CONFIG } from '../constants';
import { X, Check, Star, Crown, ShieldCheck, Loader2, CreditCard } from 'lucide-react';

interface PaywallProps {
  language: Language;
  onClose: () => void;
  onUpgrade: () => void;
}

// Simple Icons for Alipay and WeChat
const AlipayIcon = () => (
  <svg viewBox="0 0 1024 1024" width="20" height="20" fill="#1677FF">
    <path d="M780.46 386.9c-17.2-61-46-116.6-84.4-164H882c16.6 0 30-13.4 30-30s-13.4-30-30-30H593.4c6.6-40.6 11.2-82.6 13.8-125.4 1-16.6-11.4-30.8-28-31.8-16.6-1.2-30.8 11.4-31.8 28-2.6 40.8-7 80.8-13.2 119.8L529 162.8H140c-16.6 0-30 13.4-30 30s13.4 30 30 30h358.8c-23.4 148-93.6 279-196.6 371.6-43.2-34.2-79.6-76-107.4-123.2-8.2-14.4-26.8-19.2-41-11-14.4 8.2-19.2 26.8-11 41 33.4 56.8 77.2 107 129 148-95 62-206.6 98-323 103.4-16.6 0.8-29.4 14.8-28.6 31.4 0.8 16.2 14.2 29 30.6 29h0.8c148.6-6.8 290.2-57.2 405.6-141.8 107.4 78.8 240 126 383.6 128.4 16.6 0.2 30-13 30.2-29.6 0.2-16.6-13-30-29.6-30.2-119.4-2-229.4-35.2-324.6-92.4 97.4-78.2 166.4-188 193.6-311.6l-50.6-18.8zM415 348.4c52 51.6 97.2 111.4 133.4 177.2-66.2 46-140.2 78.6-218 95-4.4-7.4-8.6-14.8-12.8-22.4 28.2-82.2 60.8-166.4 97.4-249.8z" />
  </svg>
);

const WeChatIcon = () => (
  <svg viewBox="0 0 1024 1024" width="20" height="20" fill="#09BB07">
    <path d="M666.2 562.6c-94.8 0-176.6-72-176.6-168.2 0-96.2 81.8-168.2 176.6-168.2 94.8 0 176.6 72 176.6 168.2 0 96.2-81.8 168.2-176.6 168.2z m-356.4 105c-9.2 0-18.2-0.6-27-1.8l-94.4 52.6 23.2-67.6c-48.4-40.4-78-95.2-78-156.4 0-120.6 117.2-211 254.2-211 137 0 254.2 90.4 254.2 211 0.2 120.8-117 211-254.2 211z m538.6 44.8l88.4 46.2-21-63.6c43.6-38.6 70.2-89.8 70.2-145.4 0-112.4-102.2-196-236.4-196-134.2 0-236.4 83.6-236.4 196 0 112.4 102.2 196 236.4 196 8.2 0 16.4-0.4 24.6-1.4l74.2 168.2z" />
  </svg>
);

const Paywall: React.FC<PaywallProps> = ({ language, onClose, onUpgrade }) => {
  const t = TRANSLATIONS[language].paywall;
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'alipay' | 'wechat'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = () => {
      setIsProcessing(true);
      
      const targetUrl = plan === 'monthly' ? PAYMENT_CONFIG.monthlyUrl : PAYMENT_CONFIG.yearlyUrl;

      // PRODUCTION MODE: If user added a link in constants.ts
      if (targetUrl) {
          // Stripe Payment Links automatically handle Alipay/WeChat if enabled in Stripe Dashboard
          // We redirect the user to the secure payment page
          window.location.href = targetUrl;
      } 
      // DEMO MODE: If no link is configured
      else {
          setTimeout(() => {
              // Simulate success
              onUpgrade(); 
              setIsProcessing(false);
          }, 2000);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full text-slate-800 transition z-20 backdrop-blur-md"
        >
          <X size={20} />
        </button>

        {/* Hero Section */}
        <div className="bg-[#10b981] p-8 text-center pt-10 pb-12 relative overflow-hidden">
             {/* Abstract Shapes */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-900 rounded-full blur-2xl"></div>
            </div>

            <div className="relative z-10">
                <div className="bg-white/20 w-14 h-14 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-lg ring-1 ring-white/30">
                    <Crown size={28} className="text-white" fill="currentColor" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{t.title}</h2>
                <div className="flex items-center justify-center gap-1 text-emerald-50 text-sm">
                    <div className="flex">
                        {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" className="text-amber-300" />)}
                    </div>
                    <span>{t.subtitle}</span>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 -mt-6 bg-white rounded-t-3xl relative z-10">
            
            {/* Features */}
            <ul className="space-y-3 mb-6">
                {[t.feature1, t.feature2, t.feature3].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="bg-emerald-100 p-1 rounded-full text-emerald-600 shrink-0">
                            <Check size={14} strokeWidth={4} />
                        </div>
                        <span className="text-slate-700 font-semibold text-sm">{feat}</span>
                    </li>
                ))}
            </ul>

            {/* Plan Selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                    onClick={() => setPlan('monthly')}
                    className={`p-3 rounded-2xl border-2 text-center transition-all relative ${plan === 'monthly' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'}`}
                >
                    <div className="text-xs font-semibold text-slate-500 mb-1">{t.monthly}</div>
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-xs text-slate-400 line-through decoration-slate-400/50">{t.originalPriceMonthly}</span>
                        <span className="text-lg font-bold text-slate-800">{t.priceMonthly}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{t.perMonth}</div>
                </button>

                <button 
                    onClick={() => setPlan('yearly')}
                    className={`p-3 rounded-2xl border-2 text-center transition-all relative ${plan === 'yearly' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'}`}
                >
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                        {t.save}
                    </div>
                    <div className="text-xs font-semibold text-slate-500 mb-1">{t.yearly}</div>
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-xs text-slate-400 line-through decoration-slate-400/50">{t.originalPriceYearly}</span>
                        <span className="text-lg font-bold text-slate-800">{t.priceYearly}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{t.perMonth}</div>
                </button>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-6">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t.selectMethod}</h3>
                 <div className="grid grid-cols-3 gap-2">
                     <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}
                     >
                         <CreditCard size={20} />
                         <span className="text-[10px] font-medium">{t.card}</span>
                     </button>
                     <button 
                        onClick={() => setPaymentMethod('alipay')}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'alipay' ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}
                     >
                         <AlipayIcon />
                         <span className="text-[10px] font-medium">{t.alipay}</span>
                     </button>
                     <button 
                        onClick={() => setPaymentMethod('wechat')}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'wechat' ? 'border-green-400 bg-green-50 text-green-700' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}
                     >
                         <WeChatIcon />
                         <span className="text-[10px] font-medium">{t.wechat}</span>
                     </button>
                 </div>
            </div>

            {/* CTA */}
            <div className="space-y-4">
                <button 
                    onClick={handleSubscribe}
                    disabled={isProcessing}
                    className={`w-full text-white py-4 rounded-xl font-bold text-lg transition shadow-xl transform active:scale-[0.98] duration-200 flex items-center justify-center gap-2 ${
                        paymentMethod === 'alipay' ? 'bg-[#1677FF] hover:bg-blue-600 shadow-blue-100' : 
                        paymentMethod === 'wechat' ? 'bg-[#09BB07] hover:bg-green-600 shadow-green-100' :
                        'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
                    }`}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            {paymentMethod === 'card' ? 'Processing...' : paymentMethod === 'alipay' ? 'Opening Alipay...' : 'Opening WeChat...'}
                        </>
                    ) : (
                        t.cta
                    )}
                </button>
                
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <ShieldCheck size={12} />
                        {t.secure} • {t.cancelAnytime}
                    </div>
                    <div className="flex gap-4 text-[10px] text-slate-400">
                        <button className="hover:underline">{t.restore}</button>
                        <button className="hover:underline">{t.terms}</button>
                        <button className="hover:underline">{t.privacy}</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Paywall;