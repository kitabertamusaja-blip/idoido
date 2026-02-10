
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { InputSection } from './components/InputSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { AdLoadingScreen } from './components/AdLoadingScreen';
import { analyzeContent } from './services/geminiService';
import { AnalysisInput, AnalysisResult, AppState } from './types';
import { Key, ExternalLink, Zap, ShieldAlert, RefreshCcw } from 'lucide-react';

const ADSENSE_PUB_ID = "3150532418374824"; 
const ADSENSE_SLOT_ID = "8495629460";         

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isAnalyzing: false,
    result: null,
    error: null,
  });
  
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [timerFinished, setTimerFinished] = useState(false);
  const [pendingResult, setPendingResult] = useState<AnalysisResult | null>(null);

  const checkApiKeyAvailability = () => {
    const key = process.env.API_KEY;
    return typeof key === 'string' && key.length > 5 && key !== "undefined";
  };

  useEffect(() => {
    const initKeyCheck = async () => {
      // 1. Cek Environment Variable terlebih dahulu
      if (checkApiKeyAvailability()) {
        setHasKey(true);
        return;
      }

      // 2. Jika tidak ada di env, cek apakah user sudah memilih via AI Studio helper
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        try {
          const selected = await (window as any).aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          setHasKey(false);
        }
      } else {
        setHasKey(false);
      }
    };
    initKeyCheck();
  }, []);

  const handleSelectKey = async () => {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      try {
        await (window as any).aistudio.openSelectKey();
        // Berasumsi sukses sesuai instruksi platform untuk menghindari race condition
        setHasKey(true);
        setState(s => ({ ...s, error: null }));
      } catch (e) {
        console.error("Gagal membuka pemilih kunci:", e);
      }
    } else {
      alert("Fitur pemilihan kunci tidak tersedia. Harap atur API_KEY di Dashboard Netlify (Site Settings > Environment Variables).");
    }
  };

  const handleAnalyze = async (input: AnalysisInput) => {
    // Validasi akhir sebelum memanggil API
    if (!checkApiKeyAvailability()) {
      setHasKey(false);
      setState({ ...state, error: "Koneksi terputus. Harap hubungkan kembali API Key Anda." });
      return;
    }

    setTimerFinished(false);
    setPendingResult(null);
    setState({ ...state, isAnalyzing: true, error: null });

    try {
      const result = await analyzeContent(input);
      setPendingResult(result);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Terjadi kesalahan pada Neural Link.';
      
      // Jika error terkait kunci, paksa user pilih lagi
      if (errMsg.includes("API Key") || errMsg.includes("403") || errMsg.includes("not found")) {
        setHasKey(false);
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

  // UI Fallback jika kunci tidak terdeteksi
  if (hasKey === false) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto mt-20 space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="glass-card rounded-3xl p-10 space-y-6 border-red-500/20 shadow-2xl shadow-red-500/5">
            <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-3xl font-extrabold">Engine Link Missing</h1>
            <p className="text-gray-400">
              Aplikasi tidak dapat menemukan <b>API Key</b> di environment browser Anda. Untuk melanjutkan analisis, Anda harus menghubungkan kunci secara manual.
            </p>
            
            <div className="p-4 bg-white/5 rounded-xl text-left space-y-3 border border-white/5">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Solusi Cepat:</p>
              <ul className="text-xs text-gray-400 space-y-2">
                <li className="flex gap-2">
                  <span className="text-indigo-400 font-bold">A.</span>
                  Klik tombol di bawah untuk memilih API Key (Direkomendasikan).
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-400 font-bold">B.</span>
                  Pastikan Anda sudah menambahkan <code className="bg-white/10 px-1 rounded">API_KEY</code> di <b>Netlify Site Settings</b>.
                </li>
              </ul>
            </div>

            <button
              onClick={handleSelectKey}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Zap className="w-5 h-5 fill-current" />
              Hubungkan Neural Engine
            </button>
            
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-indigo-400 transition-colors flex items-center justify-center gap-1"
            >
              Dapatkan API Key Gratis di Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>
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
        <div className="max-w-md mx-auto mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-center animate-in bounce-in">
          <div className="flex justify-center mb-2">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <p className="font-bold text-lg mb-1">Neural Link Failed</p>
          <p className="text-xs opacity-80 leading-relaxed mb-6">
            {state.error === "An API Key must be set when running in a browser" 
              ? "Sistem gagal mendeteksi kunci otentikasi. Harap hubungkan kembali mesin AI Anda."
              : state.error}
          </p>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setState({ ...state, error: null, isAnalyzing: false })}
              className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-3 h-3" />
              Coba Lagi
            </button>
            <button 
              onClick={handleSelectKey}
              className="w-full py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              Pilih Ulang API Key
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
