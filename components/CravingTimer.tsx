import React, { useState, useEffect, useRef } from 'react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../translations';
import { generateSpeech } from '../services/geminiService';
import { X, Trophy, Lightbulb, RefreshCw, Plus, Save, Volume2, Loader2, List, Pencil, Trash2 } from 'lucide-react';

interface CravingTimerProps {
  language: Language;
  onClose: () => void;
  onUpdateProfile?: (data: Partial<UserProfile>) => void;
  currentCravingsResisted?: number;
}

const TIPS = {
    en: [
        "Drink a large glass of water slowly.",
        "Take 10 deep breaths.",
        "Call a supportive friend.",
        "Eat a piece of fruit or chewing gum.",
        "Go for a short walk around the block.",
        "Brush your teeth to change the taste in your mouth.",
        "Do 15 jumping jacks.",
        "Listen to your favorite song.",
        "Visualize your lungs healing with every breath.",
        "Write down 3 reasons why you quit."
    ],
    zh: [
        "慢慢喝一大杯水。",
        "做 10 次深呼吸。",
        "给支持你的朋友打个电话。",
        "吃个水果或嚼口香糖。",
        "去周围散个步。",
        "刷刷牙，改变口腔里的味道。",
        "做 15 个开合跳。",
        "听一首你最喜欢的歌。",
        "想象你的肺在每一次呼吸中愈合。",
        "写下 3 个你戒烟的理由。"
    ]
};

const CravingTimer: React.FC<CravingTimerProps> = ({ language, onClose, onUpdateProfile, currentCravingsResisted = 0 }) => {
  const t = TRANSLATIONS[language].cravingTimer;
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(true);
  const [tip, setTip] = useState('');
  
  // Adding/Managing State
  const [isAddingTip, setIsAddingTip] = useState(false);
  const [newTipInput, setNewTipInput] = useState('');
  const [isManagingTips, setIsManagingTips] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTipText, setEditTipText] = useState('');
  
  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const hasIncrementedRef = useRef(false);

  // Load custom tips from local storage
  const [customTips, setCustomTips] = useState<string[]>(() => {
    try {
        const saved = localStorage.getItem('breathnew_custom_tips');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
  });

  const getAllTips = () => [...TIPS[language], ...customTips];

  useEffect(() => {
    // Select a random tip on mount
    const tipsList = getAllTips();
    setTip(tipsList[Math.floor(Math.random() * tipsList.length)]);
  }, [language]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
            if (prev <= 1) {
                setIsActive(false);
                return 0;
            }
            return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Handle success - only once per session
  useEffect(() => {
      if (!isActive && secondsLeft === 0 && !hasIncrementedRef.current) {
          hasIncrementedRef.current = true;
          if (onUpdateProfile) {
              onUpdateProfile({ cravingsResisted: currentCravingsResisted + 1 });
          }
      }
  }, [isActive, secondsLeft, onUpdateProfile, currentCravingsResisted]);

  const handleNewTip = () => {
      const tipsList = getAllTips();
      if (tipsList.length <= 1) return;
      
      let newTip = tip;
      // Ensure we get a different tip
      while (newTip === tip) {
          newTip = tipsList[Math.floor(Math.random() * tipsList.length)];
      }
      setTip(newTip);
      // Reset audio state when tip changes
      setIsPlayingAudio(false);
  };

  const handleSaveCustomTip = () => {
    if (!newTipInput.trim()) return;
    
    const updatedTips = [...customTips, newTipInput.trim()];
    setCustomTips(updatedTips);
    localStorage.setItem('breathnew_custom_tips', JSON.stringify(updatedTips));
    
    // Set the new tip as current
    setTip(newTipInput.trim());
    setNewTipInput('');
    setIsAddingTip(false);
  };

  const handleDeleteTip = (indexToDelete: number) => {
      const tipToDelete = customTips[indexToDelete];
      const updatedTips = customTips.filter((_, i) => i !== indexToDelete);
      setCustomTips(updatedTips);
      localStorage.setItem('breathnew_custom_tips', JSON.stringify(updatedTips));
      
      // If the currently displayed tip was the deleted one, get a new random one
      if (tip === tipToDelete) {
           const allTips = [...TIPS[language], ...updatedTips];
           let newTip = tip;
           if (allTips.length > 0) {
               let attempts = 0;
               // Try to pick a new tip that isn't the deleted one
               do {
                   newTip = allTips[Math.floor(Math.random() * allTips.length)];
                   attempts++;
               } while (newTip === tip && attempts < 5 && allTips.length > 1);
           }
           setTip(newTip);
           setIsPlayingAudio(false);
      }
  };

  const startEditing = (index: number) => {
      setEditingIndex(index);
      setEditTipText(customTips[index]);
  };

  const saveEdit = (index: number) => {
      if (!editTipText.trim()) return;
      const updatedTips = [...customTips];
      updatedTips[index] = editTipText.trim();
      setCustomTips(updatedTips);
      localStorage.setItem('breathnew_custom_tips', JSON.stringify(updatedTips));
      
      // If currently displayed tip was edited, update it
      if (tip === customTips[index]) {
          setTip(editTipText.trim());
      }
      
      setEditingIndex(null);
      setEditTipText('');
  };

  // Helper function to decode base64 string
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const playAudioData = async (base64String: string) => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass({sampleRate: 24000});
        
        const bytes = decode(base64String);
        // The API returns raw PCM 16-bit integers
        const dataInt16 = new Int16Array(bytes.buffer);
        const numChannels = 1;
        const frameCount = dataInt16.length / numChannels;
        
        const buffer = audioContext.createBuffer(numChannels, frameCount, 24000);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < frameCount; i++) {
             // Convert Int16 to Float32 [-1.0, 1.0]
             channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.onended = () => {
            setIsPlayingAudio(false);
            audioContext.close();
        };
        source.start();
      } catch (e) {
          console.error("Audio playback error", e);
          setIsPlayingAudio(false);
      }
  };

  const handlePlayAudio = async () => {
      if (isPlayingAudio || isLoadingAudio) return;
      
      setIsLoadingAudio(true);
      try {
          const base64Audio = await generateSpeech(tip, language);
          if (base64Audio) {
              setIsPlayingAudio(true);
              await playAudioData(base64Audio);
          } else {
              setIsPlayingAudio(false);
          }
      } catch (e) {
          console.error(e);
          setIsPlayingAudio(false);
      } finally {
          setIsLoadingAudio(false);
      }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathText = () => {
      // 0-4s In, 4-8s Out (8 second cycle)
      const cycle = secondsLeft % 8;
      if (cycle > 4) return t.breatheIn;
      return t.breatheOut;
  };

  const isFinished = secondsLeft === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 p-4 fade-in">
      <div className="w-full max-w-sm text-center relative">
        
        {!isFinished && (
             <button 
                onClick={onClose}
                className="absolute -top-12 right-0 text-slate-400 hover:text-white transition flex items-center gap-1 text-sm"
             >
                 {t.giveUp} <X size={20} />
             </button>
        )}

        {isFinished ? (
            isManagingTips ? (
                // Management Screen
                <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-h-[70vh] flex flex-col animate-in zoom-in duration-300">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                         <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                             <List size={20} className="text-emerald-500"/>
                             {t.manageTips}
                         </h3>
                         <button onClick={() => setIsManagingTips(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition">
                            <X size={18} />
                         </button>
                    </div>
                    
                    <div className="overflow-y-auto flex-1 space-y-3 mb-4 pr-1 text-left custom-scrollbar">
                         {customTips.length === 0 && (
                             <div className="text-center py-10 px-4 border-2 border-dashed border-slate-100 rounded-2xl">
                                 <p className="text-slate-400 text-sm">{t.emptyTips}</p>
                             </div>
                         )}
                         {customTips.map((ct, idx) => (
                             <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-2 items-start group">
                                 {editingIndex === idx ? (
                                     <div className="flex-1 flex gap-2 flex-col">
                                         <input 
                                            value={editTipText} 
                                            onChange={e => setEditTipText(e.target.value)}
                                            className="w-full text-sm p-2 rounded-lg border border-emerald-200 ring-2 ring-emerald-50 outline-none" 
                                            autoFocus
                                         />
                                         <div className="flex gap-2 justify-end">
                                             <button onClick={() => setEditingIndex(null)} className="text-xs text-slate-500 font-medium px-2 py-1 hover:bg-slate-200 rounded">{t.cancel}</button>
                                             <button onClick={() => saveEdit(idx)} className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-lg font-medium hover:bg-emerald-700">{t.save}</button>
                                         </div>
                                     </div>
                                 ) : (
                                     <>
                                        <p className="text-sm text-slate-700 flex-1 leading-relaxed">{ct}</p>
                                        <div className="flex gap-1 shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEditing(idx)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"><Pencil size={14} /></button>
                                            <button onClick={() => handleDeleteTip(idx)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14} /></button>
                                        </div>
                                     </>
                                 )}
                             </div>
                         ))}
                    </div>

                    <button 
                        onClick={() => {
                            setIsManagingTips(false);
                            setIsAddingTip(true);
                        }} 
                        className="w-full py-3 bg-emerald-50 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-100 transition flex items-center justify-center gap-2 flex-shrink-0"
                    >
                        <Plus size={18} /> {t.addTip}
                    </button>
                </div>
            ) : (
                // Success Screen
                <div className="bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                        <Trophy size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.successTitle}</h2>
                    <p className="text-slate-500 text-sm mb-6">{t.successSubtitle}</p>
                    
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl mb-4 flex items-start gap-3 text-left relative group">
                        <Lightbulb className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                        <p className="text-emerald-800 font-medium text-sm leading-relaxed flex-1">{tip}</p>
                        <button 
                            onClick={handlePlayAudio}
                            disabled={isLoadingAudio || isPlayingAudio}
                            className="text-emerald-600 hover:text-emerald-700 disabled:opacity-50 p-2 bg-white rounded-full shadow-sm flex-shrink-0 transition-all active:scale-95"
                            title={t.playTip}
                        >
                            {isLoadingAudio ? <Loader2 size={16} className="animate-spin" /> : 
                            isPlayingAudio ? <Volume2 size={16} className="animate-pulse text-emerald-500" /> : 
                            <Volume2 size={16} />}
                        </button>
                    </div>

                    {isAddingTip ? (
                        <div className="mb-6 fade-in">
                            <input 
                                type="text"
                                value={newTipInput}
                                onChange={(e) => setNewTipInput(e.target.value)}
                                placeholder={t.tipPlaceholder}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm mb-2 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsAddingTip(false)}
                                    className="flex-1 py-2 text-slate-500 text-xs font-medium hover:bg-slate-50 rounded-lg transition"
                                >
                                    {t.cancel}
                                </button>
                                <button 
                                    onClick={handleSaveCustomTip}
                                    disabled={!newTipInput.trim()}
                                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                                >
                                    {t.save}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2 justify-center mb-6">
                            <button 
                                onClick={handleNewTip}
                                className="text-emerald-600 text-xs font-bold hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-full transition inline-flex items-center gap-1.5"
                            >
                                <RefreshCw size={12} /> {t.newTip}
                            </button>
                            <button 
                                onClick={() => setIsAddingTip(true)}
                                className="text-slate-400 text-xs font-medium hover:text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-full transition inline-flex items-center gap-1.5"
                            >
                                <Plus size={12} /> {t.addTip}
                            </button>
                            <button 
                                onClick={() => setIsManagingTips(true)}
                                className="text-slate-400 text-xs font-medium hover:text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-full transition inline-flex items-center gap-1.5"
                            >
                                <List size={12} /> {t.manageTips}
                            </button>
                        </div>
                    )}

                    <button 
                        onClick={onClose}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg"
                    >
                        {t.close}
                    </button>
                </div>
            )
        ) : (
            // Timer Screen
            <div className="flex flex-col items-center">
                <h2 className="text-white text-2xl font-bold mb-2">{t.title}</h2>
                <p className="text-slate-400 text-sm mb-12">{t.subtitle}</p>

                {/* Breathing Circle Animation */}
                <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                    {/* Pulsing Ring */}
                    <div 
                        className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl transition-all duration-[4000ms] ease-in-out"
                        style={{ 
                            transform: getBreathText() === t.breatheIn ? 'scale(1.2)' : 'scale(0.8)',
                            opacity: getBreathText() === t.breatheIn ? 0.6 : 0.2
                        }}
                    ></div>
                    
                    {/* Progress Ring Background */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-2xl">
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="8"
                            fill="none"
                        />
                         <circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="#10b981"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 120}
                            strokeDashoffset={2 * Math.PI * 120 * (1 - (300 - secondsLeft) / 300)}
                            className="transition-all duration-1000 linear"
                        />
                    </svg>

                    {/* Timer Text */}
                    <div className="relative z-10 flex flex-col items-center">
                        <span className="text-6xl font-bold text-white font-mono tracking-tighter">
                            {formatTime(secondsLeft)}
                        </span>
                        <span className="text-emerald-300 font-medium mt-2 animate-pulse uppercase tracking-widest text-sm">
                            {getBreathText()}
                        </span>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CravingTimer;