
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
  // Ambil kunci secara dinamis dari environment
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "null") {
    // Error ini akan ditangkap oleh UI App.tsx untuk memicu layar "Connect Key"
    throw new Error("An API Key must be set when running in a browser");
  }

  // Buat instance baru untuk memastikan menggunakan kunci terbaru dari dialog pemilih
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-pro-preview';
  const hasUrl = !!input.url;
  
  const prompt = `
    You are a world-class Viral Content Strategist. 
    
    ${hasUrl ? `IMPORTANT: The user provided a URL: ${input.url}. Use Google Search tool to find the ACTUAL details of this specific video (Title, description, engagement metrics). Do not guess.` : ''}
    
    Analyze the following for ${input.platform} (${input.niche || 'General'}):
    - Title: ${input.title || 'Search for it'}
    - Description: ${input.description || 'Search for it'}
    - Source: ${input.url ? 'URL: ' + input.url : 'Direct Upload'}
    
    Provide a Virality Readiness Score (0-100) and an actionable improvement plan in JSON format.
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
    if (!text) throw new Error("Neural Link tidak mengembalikan data.");
    
    const result = JSON.parse(text);

    // Extract grounding sources jika ada
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
