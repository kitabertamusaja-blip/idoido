
export type Platform = 'YouTube' | 'TikTok' | 'Instagram' | 'General';

export interface AnalysisInput {
  url?: string;
  file?: File;
  title?: string;
  description?: string;
  hashtags?: string[];
  niche?: string;
  platform: Platform;
}

export interface ScoreDetail {
  score: number;
  label: string;
  feedback: string[];
}

export interface ActionItem {
  timestamp?: string; // e.g. "0:12"
  category: 'Metadata' | 'Visual' | 'Audio' | 'Pacing' | 'Thumbnail';
  action: string;
  impact: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  overallScore: number;
  metadata: ScoreDetail;
  thumbnail: ScoreDetail;
  video: ScoreDetail;
  trend: ScoreDetail;
  actionPlan: ActionItem[];
  timelineData: { time: number; intensity: number; label: string }[];
  suggestions: {
    titles: string[];
    thumbnailPrompt: string;
    hashtags: string[];
  };
  sources?: GroundingSource[];
}

export interface AppState {
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
