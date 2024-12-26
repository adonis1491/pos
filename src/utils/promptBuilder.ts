export const buildImagePrompt = (
  name: string,
  category: string,
  hasReferenceImage: boolean
): string => {
  const promptParts = [
    `Create a professional product photo of ${name}`,
    `Category: ${category}`,
    'Style: Clean, well-lit commercial product photography',
    'Similar to: Starbucks marketing images'
  ];

  if (hasReferenceImage) {
    promptParts.push('Use the provided reference image for style and composition inspiration');
  }

  return promptParts.join('. ');
};