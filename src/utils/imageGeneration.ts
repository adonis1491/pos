import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFallbackImage } from './fallbackImages';
import { base64ToBytes } from './imageUtils';

const genAI = new GoogleGenerativeAI("AIzaSyAixb271NokTTgX9B80iaLr0Bgsir-PyrM");

export async function generateProductImage(
  name: string,
  category: string,
  description?: string,
  referenceImage?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = [
      `Create a professional product photo of ${name}`,
      `Category: ${category}`,
      description && `Description: ${description}`,
      'Style: Clean, well-lit commercial product photography',
      'Similar to: Starbucks marketing images',
      referenceImage && 'Use the provided reference image for style inspiration'
    ].filter(Boolean).join('. ');

    const parts = [{ text: prompt }];

    if (referenceImage) {
      try {
        const imageBytes = base64ToBytes(referenceImage);
        parts.push({
          inlineData: {
            data: Array.from(imageBytes),
            mimeType: "image/jpeg"
          }
        });
      } catch (error) {
        console.warn('Failed to process reference image:', error);
      }
    }

    const result = await model.generateContent({
      contents: [{ parts }]
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating image:', error);
    return getFallbackImage(category);
  }
}