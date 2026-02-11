
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
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
  Globe,
  BarChart3,
  Flame,
  MousePointer2
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
  const radarData = [
    { subject: 'Hook', A: result.hookScore, fullMark: 100 },
    { subject: 'Retention', A: result.retentionScore, fullMark: 100 },
    { subject: 'SEO', A: result.seoScore, fullMark: 100 },
    { subject: 'Trend', A: result.trendScore, fullMark: 100 },
    { subject: 'Quality', A: result.video.score, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in zoom-in-95 duration-500">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            Creator Intelligence Report
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </h2>
          <p className="text-gray-500">Deep neural audit of your content strategy completed.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
          >
            Reset
          </button>
          <button
            className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold shadow-lg shadow-indigo-600/20"
          >
            Save Report
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Readiness Core */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-32 h-32 text-indigo-500" />
          </div>
          <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Virality Readiness</p>
          <div className="relative">
             <svg className="w-56 h-56 -rotate-90">
                <circle
                  cx="112" cy="112" r="95"
                  fill="none" stroke="currentColor"
                  strokeWidth="15" className="text-white/5"
                />
                <circle
                  cx="112" cy="112" r="95"
                  fill="none" stroke="currentColor"
                  strokeWidth="15"
                  strokeDasharray={`${2 * Math.PI * 95}`}
                  strokeDashoffset={`${2 * Math.PI * 95 * (1 - result.overallScore / 100)}`}
                  strokeLinecap="round"
                  className="text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.6)] transition-all duration-1000 ease-out"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-7xl font-black tracking-tighter">{result.overallScore}</span>
                <span className="text-xs text-gray-400 font-bold uppercase">Ready for Alg</span>
             </div>
          </div>
          <div className="mt-8 space-y-2">
            <h3 className="text-2xl font-bold">
              {result.overallScore > 80 ? 'Viral Candidate' : result.overallScore > 60 ? 'Strong Base' : 'Optimization Required'}
            </h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Based on {result.trend.label.toLowerCase()} metrics, your content has a {result.overallScore}% probability of high organic reach.
            </p>
          </div>
        </div>

        {/* Growth Radar */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 flex flex-col items-center justify-center">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Growth Radar</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} />
                <Radar name="Virality" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Highlight Metrics */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Hook Strength</p>
              <h4 className="text-2xl font-black">{result.hookScore}%</h4>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500">
              <MousePointer2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Retention Index</p>
              <h4 className="text-2xl font-black">{result.retentionScore}%</h4>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">SEO Optimization</p>
              <h4 className="text-2xl font-black">{result.seoScore}%</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Retention Visualization */}
      <div className="glass-card rounded-3xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Audience Retention Forecast
            </h3>
            <p className="text-xs text-gray-500">Projected engagement decay based on your niche dynamics.</p>
          </div>
          <div className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            Model: RetentionAI v2.4
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
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#818cf8' }}
              />
              <Area 
                type="monotone" 
                dataKey="intensity" 
                stroke="#6366f1" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorInt)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Actionable Optimization Plan
              </h3>
              <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">PRIORITY ORDER</span>
            </div>
            <div className="space-y-4">
              {result.actionPlan.map((item, idx) => (
                <div key={idx} className="group relative bg-white/5 rounded-2xl p-5 border border-white/5 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      {item.timestamp ? (
                        <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">
                          {item.timestamp}
                        </span>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{item.category}</span>
                        <div className="w-1 h-1 rounded-full bg-gray-800" />
                        <h4 className="font-bold text-gray-200">{item.action}</h4>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.impact}</p>
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
                Real-Time Benchmark Sources
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
              AI Studio Deliverables
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
              Export Full PDF Report
            </button>
          </div>

          <div className="glass-card rounded-3xl p-6 bg-red-500/5 border-red-500/20">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h4 className="font-bold text-sm">Compliance Alerts</h4>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              AI detected potential music copyright patterns. Ensure you are using royalty-free tracks to avoid shadow-banning on ${result.trendScore < 50 ? 'Low Reach' : 'this platform'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
