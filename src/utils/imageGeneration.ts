import { GoogleGenerativeAI, GenerateContentResult, Part } from "@google/generative-ai";
import { getFallbackImage } from './fallbackImages';
import { base64ToImagePart } from './imageProcessing';
import { buildImagePrompt } from './promptBuilder';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('Missing Gemini API key in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateProductImage(
  name: string,
  category: string,
  referenceImage?: string,
  description?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = buildImagePrompt(name, category, !!referenceImage, description);
    const parts: (string | Part)[] = [{ text: prompt }];

    if (referenceImage) {
      const imagePart = await base64ToImagePart(referenceImage);
      if (imagePart) {
        parts.push(imagePart as Part);
      }
    }

    const result: GenerateContentResult = await model.generateContent(parts);
    const response = await result.response;
    
    const generatedImage = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!generatedImage) {
      throw new Error('No image data received from Gemini API');
    }

    return generatedImage; // This will be a base64 encoded image
  } catch (error) {
    console.error('Error generating image:', error);
    return getFallbackImage(category);
  }
}