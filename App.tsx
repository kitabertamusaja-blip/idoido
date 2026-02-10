
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from './components/Layout';
import { InputSection } from './components/InputSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { AdLoadingScreen } from './components/AdLoadingScreen';
import { analyzeContent } from './services/geminiService';
import { AnalysisInput, AnalysisResult, AppState } from './types';

/**
 * PENTING: Gunakan HANYA ID angka saja.
 * Contoh ADSENSE_PUB_ID: "3150532418374824"
 * Contoh ADSENSE_SLOT_ID: "8495629460"
 */
const ADSENSE_PUB_ID = "3150532418374824"; 
const ADSENSE_SLOT_ID = "8495629460";         

const App: React.FC = () => {
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
      const analysisPromise = analyzeContent(input);
      
      analysisPromise.then((res) => {
        setPendingResult(res);
      }).catch((err) => {
        setState({
          isAnalyzing: false,
          result: null,
          error: err instanceof Error ? err.message : 'An unexpected error occurred during AI processing.',
        });
      });

    } catch (err) {
      setState({
        isAnalyzing: false,
        result: null,
        error: err instanceof Error ? err.message : 'An unexpected error occurred.',
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
        <div className="max-w-md mx-auto mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-center animate-in bounce-in">
          <p className="font-bold">Neural Link Failed</p>
          <p className="text-sm opacity-80">{state.error}</p>
          <button 
            onClick={() => setState({ ...state, error: null, isAnalyzing: false })}
            className="mt-4 text-xs font-bold underline"
          >
            Reset System
          </button>
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
