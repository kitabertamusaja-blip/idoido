
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
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.length < 5) {
    throw new Error("API Key tidak valid atau belum dikonfigurasi. Silakan hubungkan kembali Neural Engine.");
  }

  // Buat instance baru setiap kali fungsi dipanggil untuk memastikan menggunakan kunci terbaru
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-pro-preview';
  const hasUrl = !!input.url;
  
  const prompt = `
    You are a world-class Viral Content Strategist. 
    
    ${hasUrl ? `IMPORTANT: A URL was provided: ${input.url}. Use Google Search to find the ACTUAL details of this content.` : ''}
    
    Analyze the following content for ${input.platform} in the ${input.niche || 'General'} niche:
    - Title: ${input.title || 'Search for it'}
    - Description: ${input.description || 'Search for it'}
    - Source: ${input.url ? 'URL: ' + input.url : 'Direct Upload'}
    
    Evaluate CTR potential, metadata relevance, and provide an actionable improvement plan in JSON format.
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
    if (!text) throw new Error("Neural Engine gagal memberikan data analisis.");
    
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
    console.error("Gemini Analysis Error:", error);
    if (error instanceof Error && error.message.includes("API Key")) {
        throw new Error("Kunci API Anda ditolak oleh server Google. Silakan periksa status billing atau pilih kunci lain.");
    }
    throw error;
  }
}
