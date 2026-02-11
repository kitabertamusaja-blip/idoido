
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

/**
 * Helper to convert a File object to a base64 string
 */
async function fileToGenerativePart(file: File) {
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64Data,
      mimeType: file.type,
    },
  };
}

export async function analyzeContent(input: AnalysisInput): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-flash-preview';
  const hasUrl = !!input.url;
  const hasFile = !!input.file;
  
  // Construct a detailed prompt based on whether video data is present
  const prompt = `
    You are a world-class Viral Content Strategist. 
    Analyze the ${hasFile ? 'attached video file' : 'provided metadata'} for a ${input.platform} post in the ${input.niche || 'General'} niche.
    
    ${hasUrl ? `Context URL for benchmarking: ${input.url}` : ''}
    
    Metadata:
    - Title: ${input.title || 'Untitled'}
    - Description: ${input.description || 'No description'}
    - Hashtags: ${input.hashtags?.join(', ') || 'None'}

    Your mission is to perform a deep neural audit:
    1. Visual & Audio Quality: Analyze lighting, framing, audio clarity, and production value.
    2. Hook Psychology: Audit the first 3-5 seconds. Is there a visual or verbal "pattern interrupt"?
    3. Retention Mapping: Identify points where viewers might drop off.
    4. Trend Alignment: How well does this match current viral aesthetics for ${input.platform}?
    
    IMPORTANT: If a video is provided, your feedback MUST be specific to the visual content seen in the frames. 
    Map the 'timelineData' to specific moments in the video duration.
    
    Return the response strictly following the provided JSON schema.
  `;

  try {
    const config: any = {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA as any,
      thinkingConfig: { thinkingBudget: 1000 }
    };

    if (hasUrl) {
      config.tools = [{ googleSearch: {} }];
    }

    const parts: any[] = [{ text: prompt }];

    // If a file is uploaded, add it to the parts for multimodal analysis
    if (hasFile && input.file) {
      const videoPart = await fileToGenerativePart(input.file);
      parts.unshift(videoPart); // Put video first
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts }],
      config,
    });

    const text = response.text;
    if (!text) throw new Error("AI returned empty content.");
    
    const result = JSON.parse(text);

    // Grounding data
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
    console.error("Gemini Multimodal Engine Error:", error);
    throw error;
  }
}
