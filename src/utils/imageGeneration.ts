import { GoogleGenerativeAI } from "@google/generative-ai";
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
  referenceImage?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" }); // Changed to vision model
    
    const prompt = buildImagePrompt(name, category, !!referenceImage);
    let parts = [{ text: prompt }];

    if (referenceImage) {
      const imagePart = await base64ToImagePart(referenceImage);
      if (imagePart) {
        parts.push(imagePart);
      }
    }

    const result = await model.generateContent([{ parts }]);
    const response = await result.response;
    
    if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    const generatedImageUrl = response.candidates[0].content.parts[0].text;
    return generatedImageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    return getFallbackImage(category);
  }
}