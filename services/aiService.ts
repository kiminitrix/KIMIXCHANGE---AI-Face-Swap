
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

export class AIService {
  private static instance: AIService;
  private ai: GoogleGenAI;

  private constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Performs the face swap using Gemini's image editing capabilities.
   * This acts as a high-level proxy for the complex pipeline described in the requirements.
   */
  public async performFaceSwap(
    sourceFaceBase64: string,
    targetImageBase64: string,
    config: { quality: string; enhance: boolean }
  ): Promise<string> {
    try {
      // Create a fresh instance to ensure up-to-date key
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      
      const prompt = `
        Task: High-fidelity face swap.
        Action: Take the face from the first provided image (source) and seamlessly blend it onto the main character's face in the second provided image (target).
        Requirements:
        1. Maintain the identity and features of the source face perfectly.
        2. Match the lighting, skin tone, and resolution of the target image.
        3. Use advanced edge blending for natural results.
        4. Preserve facial expressions and orientation from the target.
        5. ${config.enhance ? 'Apply facial enhancement (GFPGAN-style) to sharpen the final result.' : ''}
        
        Final output must be only the result image.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: sourceFaceBase64.split(',')[1],
                mimeType: 'image/png',
              },
            },
            {
              inlineData: {
                data: targetImageBase64.split(',')[1],
                mimeType: 'image/png',
              },
            },
            { text: prompt },
          ],
        }
      });

      let resultImageUrl = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          resultImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!resultImageUrl) {
        throw new Error("Failed to generate swap result image from model.");
      }

      return resultImageUrl;
    } catch (error) {
      console.error("AI Face Swap Error:", error);
      throw error;
    }
  }
}
