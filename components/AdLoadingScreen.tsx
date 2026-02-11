
import { useState, useEffect, useRef } from 'react';
import { Sparkles, ShieldCheck, Zap, Database, Search, Info } from 'lucide-react';

interface AdLoadingScreenProps {
  onTimerEnd: () => void;
  pubId: string;
  slotId: string;
}

const STATUS_MESSAGES = [
  "Initializing Neural Processing...",
  "Decoding Video Metadata...",
  "Analyzing Hook Dynamics...",
  "Benchmarking Against Viral Trends...",
  "Scanning Audio Frequencies...",
  "Evaluating CTR Potential...",
  "Generating Action Plan...",
  "Finalizing Creator Intelligence Report..."
];

export const AdLoadingScreen: React.FC<AdLoadingScreenProps> = ({ onTimerEnd, pubId, slotId }) => {
  const [currentMessage, setCurrentMessage] = useState(STATUS_MESSAGES[0]);
  const [progress, setProgress] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const adInitialized = useRef(false);

  useEffect(() => {
    // Timer Logic: 8 seconds
    const duration = 8000;
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(calculatedProgress);
      
      const messageIndex = Math.floor((elapsed / duration) * STATUS_MESSAGES.length);
      if (messageIndex < STATUS_MESSAGES.length) {
        setCurrentMessage(STATUS_MESSAGES[messageIndex]);
      }

      if (elapsed >= duration) {
        clearInterval(timer);
        onTimerEnd();
      }
    }, 50);

    // Audio Logic: Tech "Scanning" Sound
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 8);
        
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 8);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        setTimeout(() => {
          try { osc.stop(); } catch(e) {}
          if (ctx.state !== 'closed') ctx.close();
        }, 8000);
      }
    } catch (e) {}

    // Initialize AdSense safely exactly once
    const initAd = () => {
      if (adInitialized.current) return;
      try {
        if ((window as any).adsbygoogle) {
          (window as any).adsbygoogle.push({});
          adInitialized.current = true;
          console.log("AdSense unit initialized successfully.");
        }
      } catch (e) {
        console.warn("AdSense push failed:", e);
      }
    };

    const timeout = setTimeout(initAd, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [onTimerEnd]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-xl w-full space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-indigo-400">
            <span className="flex items-center gap-2">
              <Zap className="w-3 h-3 animate-pulse" />
              AI Neural Analysis
            </span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm font-medium text-gray-400 animate-pulse h-5">
            {currentMessage}
          </p>
        </div>

        {/* Ad Container with robust fallback for 403 cases */}
        <div className="glass-card rounded-3xl p-1 overflow-hidden shadow-2xl shadow-indigo-500/10 border border-white/10 relative">
          <div className="bg-[#0a0a0a] rounded-2xl flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            <div className="absolute top-3 left-0 right-0 text-[10px] font-bold text-gray-500 uppercase tracking-widest z-20">
              Sponsored Context
            </div>
            
            {/* The Actual Ad Unit */}
            <div className="w-full flex justify-center items-center z-10 min-h-[250px]">
              <ins className="adsbygoogle"
                   style={{ display: 'block', width: '300px', height: '250px' }}
                   data-ad-client={`ca-pub-${pubId}`}
                   data-ad-slot={slotId}
                   data-ad-format="rectangle"
                   data-full-width-responsive="true"></ins>
            </div>
            
            {/* Fallback View (Shown if ad is 403 or blocked) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] -z-0">
                <div className="p-4 bg-indigo-500/5 rounded-2xl mb-4 border border-white/5">
                  <ShieldCheck className="w-12 h-12 text-gray-800" />
                </div>
                <div className="space-y-1 text-center px-8">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-tighter">Premium Creator Space</span>
                  <p className="text-[10px] text-gray-600 max-w-[240px] leading-relaxed">
                    Analyzing millions of viral data points to optimize your growth. Sponsored by ViralScope Creators Economy.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[9px] text-gray-700 font-medium">
                  <Info className="w-3 h-3" />
                  Free version supported by partners
                </div>
            </div>
          </div>
        </div>

        {/* Technical Visualization */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: <Database className="w-4 h-4" />, label: "BigData" },
            { icon: <Search className="w-4 h-4" />, label: "Grounding" },
            { icon: <Sparkles className="w-4 h-4" />, label: "Gemini-3" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1 opacity-40">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-gray-600">
          Your free analysis is supported by our sponsors. <br />
          Full report will unlock automatically in {8 - Math.floor(progress/12.5)} seconds.
        </p>
      </div>
    </div>
  );
};
