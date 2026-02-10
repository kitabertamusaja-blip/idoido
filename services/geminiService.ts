
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  const hasUrl = !!input.url;
  
  const prompt = `
    You are a world-class Viral Content Strategist. 
    
    ${hasUrl ? `IMPORTANT: A URL was provided: ${input.url}. You MUST use Google Search to find the ACTUAL title, description, and content details of this specific video. Do not guess or hallucinate based on the URL text alone.` : ''}
    
    Analyze the following content for ${input.platform} in the ${input.niche || 'General'} niche:
    - Title: ${input.title || (hasUrl ? 'Search for it' : 'Not provided')}
    - Description: ${input.description || (hasUrl ? 'Search for it' : 'Not provided')}
    - Hashtags: ${input.hashtags?.join(', ') || 'Not provided'}
    - Source: ${input.url ? 'URL: ' + input.url : 'Direct Upload'}
    
    Tasks:
    1. Evaluate the actual CTR potential based on real platform performance.
    2. Analyze metadata relevance to ${input.niche} niche.
    3. Provide a "Virality Readiness Score" (0-100).
    4. Generate detailed Action Plan for improvements.
    5. Return JSON format.
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
    if (!text) throw new Error("Empty response from AI");
    
    const result = JSON.parse(text);

    // Extract grounding chunks if available
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
    throw new Error("Neural link failed. Please ensure the API Key is valid and the content is public.");
  }
}
