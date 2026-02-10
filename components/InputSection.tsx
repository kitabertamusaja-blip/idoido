
import React, { useState } from 'react';
import { Upload, Link as LinkIcon, ChevronRight, X } from 'lucide-react';
import { AnalysisInput, Platform } from '../types';
import { NICHES, PLATFORMS } from '../constants';

interface InputSectionProps {
  onAnalyze: (input: AnalysisInput) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [sourceType, setSourceType] = useState<'url' | 'upload'>('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [niche, setNiche] = useState(NICHES[0]);
  const [platform, setPlatform] = useState<Platform>('YouTube');
  const [showMetadata, setShowMetadata] = useState(false);
  const [metadata, setMetadata] = useState({ title: '', description: '', tags: '' });

  const handleAnalyze = () => {
    onAnalyze({
      url: sourceType === 'url' ? url : undefined,
      file: sourceType === 'upload' ? (file || undefined) : undefined,
      niche,
      platform,
      title: metadata.title,
      description: metadata.description,
      hashtags: metadata.tags.split(',').map(t => t.trim()).filter(t => t),
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Unlock Your <span className="gradient-text">Virality</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          One Input → One Insight. Let AI dissect your content and tell you exactly what to fix to go viral.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl shadow-indigo-500/5">
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
          <button
            onClick={() => setSourceType('url')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              sourceType === 'url' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            URL
          </button>
          <button
            onClick={() => setSourceType('upload')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              sourceType === 'upload' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Upload
          </button>
        </div>

        {sourceType === 'url' ? (
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Paste YouTube / TikTok / IG Link..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
            />
          </div>
        ) : (
          <div className="relative group cursor-pointer">
            <input
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 transition-all ${
              file ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 group-hover:border-white/20'
            }`}>
              <Upload className={`w-8 h-8 ${file ? 'text-indigo-500' : 'text-gray-500'}`} />
              <div className="text-center">
                <p className="font-semibold text-gray-200">
                  {file ? file.name : 'Click or drag to upload video'}
                </p>
                <p className="text-xs text-gray-500">MP4 or MOV preferred (Max 100MB)</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Niche</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              {NICHES.map(n => <option key={n} value={n} className="bg-neutral-900">{n}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              {PLATFORMS.map(p => <option key={p} value={p} className="bg-neutral-900">{p}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          {showMetadata ? 'Hide Advanced Settings' : 'Add Content Metadata (Recommended)'}
        </button>

        {showMetadata && (
          <div className="space-y-4 pt-4 border-t border-white/5 animate-in fade-in duration-300">
            <input
              type="text"
              placeholder="Content Title"
              value={metadata.title}
              onChange={(e) => setMetadata({...metadata, title: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600"
            />
            <textarea
              placeholder="Content Description"
              rows={3}
              value={metadata.description}
              onChange={(e) => setMetadata({...metadata, description: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600"
            />
            <input
              type="text"
              placeholder="Hashtags (comma separated)"
              value={metadata.tags}
              onChange={(e) => setMetadata({...metadata, tags: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600"
            />
          </div>
        )}

        <button
          disabled={isLoading || (!url && !file)}
          onClick={handleAnalyze}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Running Neural Analysis...
            </>
          ) : (
            <>
              Analyze Content
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
