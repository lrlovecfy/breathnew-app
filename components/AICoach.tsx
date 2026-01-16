import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Loader2, AlertCircle, Lock, Trash2, RotateCcw, Share2, TrendingUp, Mic, MicOff, Check, HeartPulse, Flag, X, RefreshCw } from 'lucide-react';
import { UserProfile, ChatMessage, Language } from '../types';
import { getGeminiChat } from '../services/geminiService';
import { Chat } from "@google/genai";
import { TRANSLATIONS } from '../translations';

interface AICoachProps {
  user: UserProfile;
  language: Language;
  onShowPaywall: () => void;
}

const AICoach: React.FC<AICoachProps> = ({ user, language, onShowPaywall }) => {
  const t = TRANSLATIONS[language].coach;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false); // New state for retry UI
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSosActive, setIsSosActive] = useState(false);
  
  // Reporting logic state
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());
  const [showReportModal, setShowReportModal] = useState(false);
  const [msgToReport, setMsgToReport] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');

  // Monetization: Free limit
  const [msgCount, setMsgCount] = useState(0);
  const FREE_LIMIT = 5; // Increased slightly to be nicer
  const isLimitReached = !user.isPro && msgCount >= FREE_LIMIT;
  
  // Undo Logic
  const [deletedMessage, setDeletedMessage] = useState<{ msg: ChatMessage, index: number } | null>(null);
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const initChat = async () => {
        try {
            setError(null);
            chatSessionRef.current = getGeminiChat(user, language);
            
            // Only reset full history on language change or init
            if (messages.length === 0) {
                setMessages([
                    {
                      id: 'welcome-' + Date.now(),
                      role: 'model',
                      text: t.initialMessage.replace('{name}', user.name),
                      timestamp: Date.now()
                    }
                ]);
            }
        } catch (e: any) {
            console.error("Failed to initialize chat", e);
            // Display the specific error message to help debugging
            handleError(e);
        }
    };
    
    initChat();
  }, [user.name, language]);

  useEffect(() => {
    // Load reported IDs
    const savedReports = localStorage.getItem('breathnew_reports');
    if (savedReports) {
        try {
            const parsed = JSON.parse(savedReports);
            const ids = new Set(parsed.map((r: any) => r.id));
            setReportedIds(ids as Set<string>);
        } catch (e) {
            console.error("Failed to parse reports", e);
        }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isRetrying]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showFeedback = (message: string) => {
      setFeedbackMessage(message);
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = setTimeout(() => {
          setFeedbackMessage(null);
      }, 3000);
  };

  const isQuotaError = (msg: string) => {
      const m = msg.toLowerCase();
      return m.includes("429") || m.includes("resource_exhausted") || m.includes("quota") || m.includes("exhausted");
  };

  const handleError = (err: any) => {
      let errorMessage = err.message || t.error;
      
      // Attempt to clean up Google GenAI raw error JSON
      if (errorMessage.includes('{')) { 
          try {
             const match = errorMessage.match(/(\{.*\})/);
             if (match) {
                 const errorObj = JSON.parse(match[0]);
                 if (errorObj.error?.code === 429 || errorObj.error?.status === 'RESOURCE_EXHAUSTED') {
                      errorMessage = language === 'zh' 
                        ? "API繁忙，请稍等..."
                        : "API is busy, please wait...";
                 } else if (errorObj.error && errorObj.error.message) {
                     errorMessage = errorObj.error.message;
                 }
             }
          } catch (e) {
              // Failed to parse
          }
      }
      
      if (isQuotaError(errorMessage)) {
           errorMessage = language === 'zh' 
             ? "⚠️ 服务器繁忙 (429)。请稍休息几秒再试。"
             : "⚠️ Server busy (429). Please wait a few seconds.";
      }

      setError(errorMessage);
  };

  const playSOSSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();

        // Create a calming major chord arpeggio (C - E - G)
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        const now = ctx.currentTime;

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.value = freq;

            const startTime = now + (i * 0.1);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.0);

            osc.start(startTime);
            osc.stop(startTime + 2.0);
        });
    } catch (e) {
        console.error("Failed to play sound", e);
    }
  };

  const sanitizeInput = (text: string): string => {
    return text.replace(/<[^>]*>?/gm, "").trim();
  };

  const handleSendMessage = async () => {
    const sanitizedText = sanitizeInput(inputText);
    
    if (!sanitizedText) return;
    
    if (!chatSessionRef.current) {
         try {
             chatSessionRef.current = getGeminiChat(user, language);
         } catch (e: any) {
             handleError(e);
             return;
         }
    }
    
    if (isLimitReached) {
        onShowPaywall();
        return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: sanitizedText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setError(null);
    setMsgCount(c => c + 1);

    try {
      let responseText = "";
      let retryCount = 0;
      const maxRetries = 3;

      // --- RETRY LOOP START ---
      while (true) {
        try {
            const result = await chatSessionRef.current!.sendMessage({ message: userMsg.text });
            responseText = result.text;
            break; // Success, exit loop
        } catch (err: any) {
            const errMsg = err.message || "";
            // Check for quota error
            if (isQuotaError(errMsg) && retryCount < maxRetries) {
                retryCount++;
                setIsRetrying(true);
                // Exponential backoff: 1.5s, 3s, 4.5s
                const waitTime = 1500 * retryCount;
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue; // Try again
            } else {
                // Not a quota error or max retries reached
                throw err; 
            }
        }
      }
      // --- RETRY LOOP END ---
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "...",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (err: any) {
      console.error(err);
      handleError(err);
      // Remove the user message if it failed? No, keep it so they can copy/paste.
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  const handleSOS = () => {
    if (isLimitReached) {
        onShowPaywall();
        return;
    }
    
    // Activate Visuals
    setIsSosActive(true);
    setTimeout(() => setIsSosActive(false), 1500); 
    playSOSSound();
    setInputText(t.sosMessage);
  };

  const handleDeleteMessage = (id: string) => {
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) return;
    const msgToDelete = messages[index];
    setMessages(prev => prev.filter(m => m.id !== id));
    setDeletedMessage({ msg: msgToDelete, index });
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = setTimeout(() => {
        setDeletedMessage(null);
    }, 4000);
  };

  const handleUndo = () => {
    if (!deletedMessage) return;
    setMessages(prev => {
        const newMessages = [...prev];
        if (deletedMessage.index >= newMessages.length) {
            newMessages.push(deletedMessage.msg);
        } else {
            newMessages.splice(deletedMessage.index, 0, deletedMessage.msg);
        }
        return newMessages;
    });
    setDeletedMessage(null);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
  };

  const handleReport = (msgId: string) => {
      if (reportedIds.has(msgId)) {
          showFeedback(t.alreadyReported);
          return;
      }
      setMsgToReport(msgId);
      setReportReason('');
      setShowReportModal(true);
  };

  const submitReport = () => {
      if (!msgToReport) return;
      const report = {
          id: msgToReport,
          reason: reportReason,
          timestamp: Date.now(),
          msgContent: messages.find(m => m.id === msgToReport)?.text
      };
      const existingReports = JSON.parse(localStorage.getItem('breathnew_reports') || '[]');
      const newReports = [...existingReports, report];
      localStorage.setItem('breathnew_reports', JSON.stringify(newReports));
      setReportedIds(prev => new Set(prev).add(msgToReport));
      setShowReportModal(false);
      showFeedback(t.reportSuccess);
      setMsgToReport(null);
  };

  const handleShare = async () => {
    const header = `BreathNew Chat - ${new Date().toLocaleDateString()}\n\n`;
    const body = messages.map(m => {
        const role = m.role === 'user' ? 'Me' : 'Coach';
        return `${role}: ${m.text}`;
    }).join('\n\n');
    const fullText = header + body;
    const shareData = { title: 'BreathNew Chat History', text: fullText };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(fullText);
            showFeedback(t.shareSuccess);
        }
    } catch (error) {
        console.log('Sharing failed', error);
    }
  };

  const handleShareProgress = async () => {
    const quitDate = new Date(user.quitDate);
    const now = new Date();
    const diffMs = now.getTime() - quitDate.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    const cigarettesAvoided = Math.floor((diffMs / (1000 * 60 * 60 * 24)) * user.cigarettesPerDay);
    const moneySaved = ((cigarettesAvoided / user.cigarettesPerPack) * user.costPerPack).toFixed(2);

    const shareText = t.shareProgressText
        .replace('{days}', days.toString())
        .replace('{currency}', user.currency)
        .replace('{saved}', moneySaved);

    const shareData = { title: 'My BreathNew Progress', text: shareText };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareText);
            showFeedback(t.shareProgressSuccess);
        }
    } catch (error) {
        console.log('Sharing failed', error);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'zh' ? 'zh-CN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText((prev) => prev + (prev ? ' ' : '') + transcript);
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  // Render error only if no messages or critical
  if (error && messages.length <= 1) {
      return (
          <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
              <AlertCircle className="text-red-500 mb-4" size={48} />
              <p className="text-slate-800 dark:text-slate-200 font-bold mb-2">{t.error}</p>
              <button 
                  onClick={() => setError(null)} 
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm mt-2"
              >
                  Retry
              </button>
              <p className="text-xs text-slate-400 mt-4 max-w-xs break-words">{error}</p>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative transition-colors duration-300">
        {/* Chat Header */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center transition-colors">
            <div className="flex items-center gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-full">
                    <Sparkles size={18} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                     <h3 className="font-semibold text-slate-700 dark:text-slate-200 leading-none">{t.title}</h3>
                     {!user.isPro && (
                         <div className="mt-1">
                             <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-300 ${
                                        msgCount >= FREE_LIMIT ? 'bg-red-500' : 
                                        msgCount >= FREE_LIMIT - 1 ? 'bg-amber-400' : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${Math.min(100, (msgCount / FREE_LIMIT) * 100)}%` }}
                                />
                             </div>
                             <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{msgCount}/{FREE_LIMIT} free msgs</p>
                         </div>
                     )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={handleShareProgress} className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 rounded-full transition"><TrendingUp size={18} /></button>
                <button onClick={handleShare} className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 rounded-full transition"><Share2 size={18} /></button>
                <button onClick={handleSOS} className={`relative overflow-hidden text-xs font-bold px-3 py-1.5 rounded-full border transition-all duration-300 ease-out flex items-center gap-1.5 ${isSosActive ? 'bg-red-500 text-white border-red-500 scale-105 shadow-lg shadow-red-200 ring-4 ring-red-100' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 hover:bg-red-100'}`}>
                    <HeartPulse size={14} className={isSosActive ? 'animate-ping' : ''} />
                    {t.sos}
                </button>
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex group items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[85%] gap-2 items-center ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-emerald-600'}`}>
                            {msg.role === 'user' ? <User size={14} className="text-slate-600 dark:text-slate-300"/> : <Bot size={14} className="text-white"/>}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                            msg.role === 'user' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tr-none' : 'bg-emerald-600 text-white rounded-tl-none'
                        } ${reportedIds.has(msg.id) ? 'opacity-80' : ''}`}>
                            {msg.text}
                            {reportedIds.has(msg.id) && (
                                <div className="absolute -top-2 -right-2 bg-rose-500 text-white p-0.5 rounded-full border border-white shadow-sm"><Flag size={8} fill="currentColor"/></div>
                            )}
                        </div>
                        
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button onClick={() => handleDeleteMessage(msg.id)} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"><Trash2 size={14} /></button>
                            {msg.role === 'model' && (
                                <button onClick={() => handleReport(msg.id)} className={`p-1.5 rounded-full hover:bg-rose-100 ${reportedIds.has(msg.id) ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}>
                                    <Flag size={14} fill={reportedIds.has(msg.id) ? 'currentColor' : 'none'} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Loading / Retry Indicator */}
            {isLoading && (
                 <div className="flex justify-start">
                 <div className="flex max-w-[85%] gap-2 flex-row">
                     <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                         <Bot size={14} className="text-white"/>
                     </div>
                     <div className={`text-emerald-800 dark:text-emerald-200 p-3 rounded-2xl rounded-tl-none flex items-center ${isRetrying ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
                         {isRetrying ? (
                             <>
                                <RefreshCw size={16} className="animate-spin mr-2 text-amber-500" />
                                <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                                    {language === 'zh' ? '服务器繁忙，正在自动重试...' : 'Server busy, retrying...'}
                                </span>
                             </>
                         ) : (
                             <>
                                <Loader2 size={16} className="animate-spin mr-2" />
                                <span className="text-xs font-medium">{t.thinking}</span>
                             </>
                         )}
                     </div>
                 </div>
             </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative transition-colors">
            {feedbackMessage && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 z-30 animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap">
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-xs font-medium">{feedbackMessage}</span>
                </div>
            )}
            {deletedMessage && !feedbackMessage && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-3 z-30 animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap">
                    <span className="text-xs font-medium">{t.messageDeleted}</span>
                    <div className="w-px h-3 bg-slate-600"></div>
                    <button onClick={handleUndo} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"><RotateCcw size={12} strokeWidth={2.5} /> {t.undo}</button>
                </div>
            )}
            {error && <div className="text-xs text-red-500 mb-2 px-2 flex items-center gap-1"><AlertCircle size={12} className="flex-shrink-0"/> <span className="truncate">{error}</span></div>}
            
            {isLimitReached && (
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-4 text-center">
                     <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t.limitReached}</p>
                     <button onClick={onShowPaywall} className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition"><Lock size={12} /> {t.upgradeToChat}</button>
                </div>
            )}

            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={isListening ? t.listening : t.placeholder}
                        className={`w-full bg-slate-50 dark:bg-slate-800 border ${isListening ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 dark:border-slate-700'} text-slate-800 dark:text-slate-100 rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm`}
                        disabled={isLoading || isLimitReached}
                    />
                    <button onClick={toggleListening} disabled={isLoading || isLimitReached} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition ${isListening ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 'text-slate-400 hover:text-slate-600'}`}>
                        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                </div>
                <button onClick={handleSendMessage} disabled={!inputText.trim() || isLoading || isLimitReached} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl w-12 flex items-center justify-center transition shadow-lg shadow-emerald-200 dark:shadow-none">
                    <Send size={18} />
                </button>
            </div>
        </div>

        {/* Report Modal */}
        {showReportModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 fade-in">
                 <div className="bg-white dark:bg-slate-800 w-full max-w-xs rounded-2xl p-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
                     <button onClick={() => setShowReportModal(false)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"><X size={18} /></button>
                     <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4"><Flag size={18} className="text-rose-500" fill="currentColor"/>{t.reportTitle}</h3>
                     <label className="block text-xs font-semibold text-slate-500 mb-2">{t.reportReason}</label>
                     <textarea value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder={t.reportPlaceholder} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:border-rose-500 outline-none resize-none h-24 mb-4"/>
                     <div className="flex gap-2">
                         <button onClick={() => setShowReportModal(false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50">{t.reportCancel}</button>
                         <button onClick={submitReport} className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700">{t.reportSubmit}</button>
                     </div>
                 </div>
            </div>
        )}
    </div>
  );
};

export default AICoach;