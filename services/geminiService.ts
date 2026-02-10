
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisInput, AnalysisResult, GroundingSource } from "../types";

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER },
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
  required: ['overallScore', 'metadata', 'thumbnail', 'video', 'trend', 'actionPlan', 'timelineData', 'suggestions']
};

export async function analyzeContent(input: AnalysisInput): Promise<AnalysisResult> {
  // Use a new instance per call to ensure it always uses the most up-to-date API key.
  // The environment variable process.env.API_KEY is expected to be present and valid.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  const hasUrl = !!input.url;
  
  const prompt = `
    You are a world-class Viral Content Strategist. 
    
    ${hasUrl ? `The user provided a URL: ${input.url}. Use the Google Search tool to research the actual details of this video (title, channel, typical performance for this type of content).` : ''}
    
    Analyze this content for ${input.platform} in the ${input.niche || 'General'} niche:
    - Title: ${input.title || 'Analyze potential for this niche'}
    - Description: ${input.description || 'Analyze potential for this niche'}
    
    Based on virality patterns, return a detailed readiness score and improvement plan.
  `;

  try {
    const config: any = {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA as any,
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
    if (!text) throw new Error("The AI model returned an empty response.");
    
    const result = JSON.parse(text);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      const sources: GroundingSource[] = groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title || chunk.web.uri,
          uri: chunk.web.uri
        }));
      result.sources = sources;
    }

    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini Engine Error:", error);
    throw error;
  }
}
