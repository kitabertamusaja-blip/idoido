
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Zap, 
  TrendingUp, 
  Layout as LayoutIcon, 
  Video, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Download,
  ExternalLink,
  Globe
} from 'lucide-react';
import { AnalysisResult, ScoreDetail, ActionItem } from '../types';

interface DashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ScoreCard: React.FC<{ detail: ScoreDetail; icon: React.ReactNode; color: string }> = ({ detail, icon, color }) => (
  <div className="glass-card rounded-2xl p-6 space-y-4">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
        {icon}
      </div>
      <span className="text-2xl font-black">{detail.score}<span className="text-xs text-gray-500 font-normal">/100</span></span>
    </div>
    <div>
      <h4 className="font-bold text-gray-200">{detail.label}</h4>
      <ul className="mt-2 space-y-1">
        {detail.feedback.slice(0, 3).map((f, i) => (
          <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
            <span className="mt-1 w-1 h-1 rounded-full bg-gray-600 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export const AnalysisDashboard: React.FC<DashboardProps> = ({ result, onReset }) => {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in zoom-in-95 duration-500">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            Analysis Report
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </h2>
          <p className="text-gray-500">Neural analysis of your content completed successfully.</p>
        </div>
        <button
          onClick={onReset}
          className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
        >
          New Analysis
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Readiness Score */}
        <div className="lg:col-span-1 glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-24 h-24 text-indigo-500" />
          </div>
          <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Virality Readiness</p>
          <div className="relative">
             <svg className="w-48 h-48 -rotate-90">
                <circle
                  cx="96" cy="96" r="80"
                  fill="none" stroke="currentColor"
                  strokeWidth="12" className="text-white/5"
                />
                <circle
                  cx="96" cy="96" r="80"
                  fill="none" stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - result.overallScore / 100)}`}
                  strokeLinecap="round"
                  className="text-indigo-500 drop-shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black">{result.overallScore}</span>
                <span className="text-sm text-gray-400">Optimal: 85+</span>
             </div>
          </div>
          <div className="mt-8 space-y-2">
            <h3 className="text-xl font-bold">
              {result.overallScore > 80 ? 'Highly Viral Potential' : result.overallScore > 60 ? 'Growing Momentum' : 'Needs Significant Refinement'}
            </h3>
            <p className="text-gray-500 text-sm">
              Current performance metrics show that your content is {result.overallScore}% optimized for algorithmic discovery.
            </p>
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScoreCard detail={result.metadata} icon={<TrendingUp className="w-5 h-5" />} color="emerald" />
          <ScoreCard detail={result.thumbnail} icon={<LayoutIcon className="w-5 h-5" />} color="blue" />
          <ScoreCard detail={result.video} icon={<Video className="w-5 h-5" />} color="pink" />
          <ScoreCard detail={result.trend} icon={<Zap className="w-5 h-5" />} color="orange" />
        </div>
      </div>

      {/* Retention Timeline */}
      <div className="glass-card rounded-3xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Projected Retention Timeline
          </h3>
          <div className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            Based on Niche Patterns
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.timelineData}>
              <defs>
                <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#818cf8' }}
              />
              <Area 
                type="monotone" 
                dataKey="intensity" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorInt)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Plan & Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Action Plan */}
          <div className="glass-card rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Actionable Improvement Plan
            </h3>
            <div className="space-y-4">
              {result.actionPlan.map((item, idx) => (
                <div key={idx} className="group relative bg-white/5 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex gap-4">
                      {item.timestamp && (
                        <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded h-fit">
                          {item.timestamp}
                        </span>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.category}</span>
                          <div className="w-1 h-1 rounded-full bg-gray-700" />
                          <h4 className="font-bold text-gray-200">{item.action}</h4>
                        </div>
                        <p className="text-sm text-gray-400">{item.impact}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grounding Sources */}
          {result.sources && result.sources.length > 0 && (
            <div className="glass-card rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Research Sources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group"
                  >
                    <span className="text-xs text-gray-400 group-hover:text-white truncate pr-4">{source.title}</span>
                    <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-indigo-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-3xl p-6 space-y-4 border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
            <h3 className="font-bold flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-4 h-4" />
              AI Studio Output
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Optimized Titles</span>
                <ul className="space-y-2">
                  {result.suggestions.titles.map((t, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                      <ArrowRight className="w-3 h-3 text-indigo-500" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Thumbnail Engine Prompt</span>
                <p className="text-[11px] text-gray-400 italic leading-relaxed">
                  "{result.suggestions.thumbnailPrompt}"
                </p>
                <button 
                  onClick={() => navigator.clipboard.writeText(result.suggestions.thumbnailPrompt)}
                  className="w-full mt-2 py-2 rounded-lg bg-indigo-600/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-600/30 transition-colors"
                >
                  Copy Prompt
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Viral Hashtags</span>
                <div className="flex flex-wrap gap-2">
                  {result.suggestions.hashtags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-medium text-gray-400 bg-white/5 px-2 py-1 rounded-md">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <button className="w-full py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 text-sm hover:bg-gray-200 transition-all">
              <Download className="w-4 h-4" />
              Export Full Action Plan
            </button>
          </div>

          <div className="glass-card rounded-3xl p-6 bg-red-500/5 border-red-500/20">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h4 className="font-bold">Critical Warnings</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Ensure you have the rights to use the background track to avoid platform distribution limits. AI detected potential duplication patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
