
import { Platform } from './types';

export const NICHES = [
  'Tech & Gadgets',
  'Lifestyle & Vlog',
  'Education',
  'Entertainment',
  'Gaming',
  'Business & Finance',
  'Health & Fitness',
  'Beauty & Fashion',
  'Cooking & Food'
];

export const PLATFORMS: Platform[] = ['YouTube', 'TikTok', 'Instagram', 'General'];

export const PLATFORM_WEIGHTS = {
  TikTok: { video: 0.4, hook: 0.3, metadata: 0.1, trend: 0.2 },
  YouTube: { video: 0.2, hook: 0.1, metadata: 0.4, trend: 0.3 },
  Instagram: { video: 0.3, hook: 0.2, metadata: 0.2, trend: 0.3 },
  General: { video: 0.25, hook: 0.25, metadata: 0.25, trend: 0.25 }
};
