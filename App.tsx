
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { InputSection } from './components/InputSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { AdLoadingScreen } from './components/AdLoadingScreen';
import { analyzeContent } from './services/geminiService';
import { AnalysisInput, AnalysisResult, AppState } from './types';
import { Key, ExternalLink, Zap, ShieldAlert, RefreshCcw, Info } from 'lucide-react';

const ADSENSE_PUB_ID = "3150532418374824"; 
const ADSENSE_SLOT_ID = "8495629460";         

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isAnalyzing: false,
    result: null,
    error: null,
  });
  
  const [keySelectionRequired, setKeySelectionRequired] = useState<boolean>(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [pendingResult, setPendingResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const checkKeyStatus = async () => {
      // Check for environment key first
      const envKey = process.env.API_KEY;
      if (envKey && envKey !== "undefined" && envKey !== "null" && envKey.length > 10) {
        setKeySelectionRequired(false);
        return;
      }

      // Check for selected key if in AI Studio
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        try {
          const hasSelected = await (window as any).aistudio.hasSelectedApiKey();
          setKeySelectionRequired(!hasSelected);
        } catch (e) {
          setKeySelectionRequired(true);
        }
      }
    };
    checkKeyStatus();
  }, []);

  const handleSelectKey = async () => {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      try {
        await (window as any).aistudio.openSelectKey();
        // Proceed immediately as per race condition rules
        setKeySelectionRequired(false);
        setState(s => ({ ...s, error: null }));
      } catch (e) {
        console.error("Failed to open key selector:", e);
      }
    } else {
      alert("Please ensure your API_KEY environment variable is set.");
    }
  };

  const handleAnalyze = async (input: AnalysisInput) => {
    setTimerFinished(false);
    setPendingResult(null);
    setState({ ...state, isAnalyzing: true, error: null });

    try {
      const result = await analyzeContent(input);
      setPendingResult(result);
    } catch (err: any) {
      const errMsg = err instanceof Error ? err.message : String(err);
      
      // Handle the specific "Requested entity was not found" error by prompting for a new key
      if (errMsg.includes("Requested entity was not found") || errMsg.includes("403") || errMsg.includes("401")) {
        setKeySelectionRequired(true);
      }
      
      setState({
        isAnalyzing: false,
        result: null,
        error: errMsg,
      });
    }
  };

  useEffect(() => {
    if (timerFinished && pendingResult) {
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        result: pendingResult,
        error: null
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [timerFinished, pendingResult]);

  const resetAnalysis = () => {
    setState({ isAnalyzing: false, result: null, error: null });
    setTimerFinished(false);
    setPendingResult(null);
  };

  if (keySelectionRequired) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto mt-20 space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="glass-card rounded-3xl p-10 space-y-6 border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
            <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
              <Key className="w-10 h-10 text-indigo-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight">Koneksi API Diperlukan</h1>
              <p className="text-gray-400 leading-relaxed text-sm">
                ViralScope menggunakan model <b>Gemini 3 Pro</b> yang membutuhkan API Key aktif dari project yang memiliki billing aktif.
              </p>
            </div>
            
            <div className="p-5 bg-white/5 rounded-2xl text-left space-y-4 border border-white/5">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-400 leading-relaxed">
                  Jika Anda melihat error "Entity not found", pastikan project GCP Anda telah terhubung ke billing. 
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-400 underline ml-1">Pelajari Selengkapnya</a>.
                </p>
              </div>
            </div>

            <button
              onClick={handleSelectKey}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] group"
            >
              <Zap className="w-5 h-5 fill-current group-hover:scale-125 transition-transform" />
              Pilih API Key
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {!state.result && !state.isAnalyzing && (
        <InputSection 
          onAnalyze={handleAnalyze} 
          isLoading={state.isAnalyzing} 
        />
      )}

      {state.result && (
        <AnalysisDashboard 
          result={state.result} 
          onReset={resetAnalysis} 
        />
      )}

      {state.error && (
        <div className="max-w-md mx-auto mt-8 p-8 glass-card border-red-500/20 rounded-3xl text-center animate-in bounce-in">
          <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <p className="font-bold text-xl mb-2 text-white">Analisis Gagal</p>
          <p className="text-sm text-gray-400 leading-relaxed mb-8">
            {state.error}
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => setState({ ...state, error: null, isAnalyzing: false })}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {state.isAnalyzing && (
        <AdLoadingScreen 
          pubId={ADSENSE_PUB_ID}
          slotId={ADSENSE_SLOT_ID}
          onTimerEnd={() => setTimerFinished(true)}
        />
      )}
    </Layout>
  );
};

export default App;
