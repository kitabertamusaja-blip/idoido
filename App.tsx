
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout.tsx';
import { InputSection } from './components/InputSection.tsx';
import { AnalysisDashboard } from './components/AnalysisDashboard.tsx';
import { AdLoadingScreen } from './components/AdLoadingScreen.tsx';
import { analyzeContent } from './services/geminiService.ts';
import { AnalysisInput, AnalysisResult, AppState } from './types.ts';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

const ADSENSE_PUB_ID = "3150532418374824"; 
const ADSENSE_SLOT_ID = "8495629460";         

export default function App() {
  const [state, setState] = useState<AppState>({
    isAnalyzing: false,
    result: null,
    error: null,
  });
  
  const [timerFinished, setTimerFinished] = useState(false);
  const [pendingResult, setPendingResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (input: AnalysisInput) => {
    setTimerFinished(false);
    setPendingResult(null);
    setState({ ...state, isAnalyzing: true, error: null });

    try {
      const result = await analyzeContent(input);
      setPendingResult(result);
    } catch (err: any) {
      const errMsg = err instanceof Error ? err.message : String(err);
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
}
