export const base64ToImagePart = async (base64: string) => {
  try {
    const base64Data = base64.split(',')[1];
    return {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg"
      }
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
};