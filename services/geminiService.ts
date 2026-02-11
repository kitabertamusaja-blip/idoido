
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisInput, AnalysisResult, GroundingSource } from "../types.ts";

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER },
    hookScore: { type: Type.NUMBER },
    retentionScore: { type: Type.NUMBER },
    seoScore: { type: Type.NUMBER },
    trendScore: { type: Type.NUMBER },
    metadata: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        label: { type: Type.STRING },
        feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['score', 'label', 'feedback']
    },
    thumbnail: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        label: { type: Type.STRING },
        feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['score', 'label', 'feedback']
    },
    video: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        label: { type: Type.STRING },
        feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['score', 'label', 'feedback']
    },
    trend: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        label: { type: Type.STRING },
        feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['score', 'label', 'feedback']
    },
    actionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timestamp: { type: Type.STRING },
          category: { type: Type.STRING },
          action: { type: Type.STRING },
          impact: { type: Type.STRING }
        },
        required: ['category', 'action', 'impact']
      }
    },
    timelineData: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.NUMBER },
          intensity: { type: Type.NUMBER },
          label: { type: Type.STRING }
        },
        required: ['time', 'intensity', 'label']
      }
    },
    suggestions: {
      type: Type.OBJECT,
      properties: {
        titles: { type: Type.ARRAY, items: { type: Type.STRING } },
        thumbnailPrompt: { type: Type.STRING },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['titles', 'thumbnailPrompt', 'hashtags']
    }
  },
  required: [
    'overallScore', 'hookScore', 'retentionScore', 'seoScore', 'trendScore',
    'metadata', 'thumbnail', 'video', 'trend', 'actionPlan', 'timelineData', 'suggestions'
  ]
};

export async function analyzeContent(input: AnalysisInput): Promise<AnalysisResult> {
  /**
   * IMPORTANT: The API key must be obtained from process.env.API_KEY.
   * In a Vite/Vercel setup, ensure 'process.env.API_KEY' is mapped to your 
   * VITE_API_KEY environment variable in the vite.config.ts 'define' section.
   */
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
<<<<<<< HEAD
  // Switching to gemini-3-flash-preview for better quota availability in Free Tier.
  const model = 'gemini-3-flash-preview';
=======
  // Using gemini-3-pro-preview as the permitted superior version of gemini-1.5-pro.
  const model = 'gemini-3-pro-preview';
>>>>>>> 1b13fef7622e0d506f821c788358fdd0a0323008
  const hasUrl = !!input.url;
  
  const prompt = `
    You are a world-class Viral Content Strategist for ${input.platform}.
    Your goal is to provide a "Virality Readiness Score" for content in the ${input.niche || 'General'} niche.
    
<<<<<<< HEAD
    ${hasUrl ? `Analyze the following URL using Google Search to find its real-world context: ${input.url}` : ''}
=======
    ${hasUrl ? `Analyze the following URL using Google Search to find its real-world context and current performance: ${input.url}` : ''}
>>>>>>> 1b13fef7622e0d506f821c788358fdd0a0323008
    
    Current Metadata provided by user:
    - Title: ${input.title || 'Untitled'}
    - Description: ${input.description || 'No description'}
    - Hashtags: ${input.hashtags?.join(', ') || 'None'}

<<<<<<< HEAD
    Perform a deep neural audit of:
    1. Hook Strength: Psychology of the first 3 seconds.
    2. Retention Potential: Narrative and visual pacing.
    3. SEO Score: Metadata and discoverability.
    4. Trend Alignment: Relevance to current niche dynamics.
=======
    Perform a high-level strategic audit of:
    1. Hook Strength: Psychological analysis of the first 3-5 seconds.
    2. Retention Potential: Pacing and narrative arc effectiveness.
    3. SEO Score: Discoverability and metadata relevance.
    4. Trend Alignment: How this fits into current viral content cycles.
>>>>>>> 1b13fef7622e0d506f821c788358fdd0a0323008
    
    Return the response strictly following the provided JSON schema.
  `;

  try {
    const config: any = {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA as any,
<<<<<<< HEAD
      // Lowering thinking budget for Flash model to be "lighter" and faster.
      thinkingConfig: { thinkingBudget: 1000 }
=======
      // Enabling thinking for the Pro model to ensure high-quality reasoning.
      thinkingConfig: { thinkingBudget: 2000 }
>>>>>>> 1b13fef7622e0d506f821c788358fdd0a0323008
    };

    if (hasUrl) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config,
    });

    const text = response.text;
    if (!text) throw new Error("AI returned empty content.");
    
    const result = JSON.parse(text);

    // Extract grounding sources if Google Search tool was used.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      result.sources = groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title || chunk.web.uri,
          uri: chunk.web.uri
        }));
    }

    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini Pro Engine Error:", error);
    throw error;
  }
}
