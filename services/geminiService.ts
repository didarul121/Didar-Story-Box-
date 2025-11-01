import { GoogleGenAI } from "@google/genai";
import type { StoryResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateStoryAndImage(prompt: string, genre: string, mood: string, language: string): Promise<StoryResult> {
  try {
    const storyPrompt = `Generate a captivating short story, approximately 500 words long. The story should be in the '${genre}' genre with a '${mood}' mood, based on the following idea: "${prompt}". The story should have a clear beginning, middle, and end. It should be well-written, creative, and engaging for the reader. IMPORTANT: The entire story must be written in ${language}.`;
    
    const imagePrompt = `Create a beautiful, high-quality digital illustration for a storybook. The image should depict the scene: "${prompt}". It needs to have a '${mood}' atmosphere and visually represent the '${genre}' genre. The style should be artistic and evocative, not photorealistic. Aspect ratio 3:4.`;

    const storyPromise = ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: storyPrompt,
      config: {
        temperature: 0.75,
        topP: 0.95,
      }
    });

    const imagePromise = ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: imagePrompt,
      config: {
        numberOfImages: 4,
        aspectRatio: '3:4',
        outputMimeType: 'image/jpeg',
      }
    });

    const [storyResponse, imageResponse] = await Promise.all([storyPromise, imagePromise]);

    const story = storyResponse.text;
    const images = imageResponse.generatedImages;

    if (!story) {
      throw new Error("The model did not return a story.");
    }
    
    if (!images || images.length === 0) {
        throw new Error("The model did not return any images.");
    }

    const imageUrls = images.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
    
    return { story, imageUrl: imageUrls };

  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    throw new Error("Failed to generate story and image.");
  }
}