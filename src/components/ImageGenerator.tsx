import React, { useState } from 'react';
import { Upload, RefreshCw, Check } from 'lucide-react';
import { generateProductImage } from '../utils/imageGeneration';
import { ImageUploader } from './ImageUploader';
import { GenerateButton } from './GenerateButton';

type ImageGeneratorProps = {
  productName: string;
  category: string;
  description?: string;
  onImageGenerated: (imageUrl: string) => void;
};

const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  productName,
  category,
  description,
  onImageGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!productName || !category) return;
    
    setIsGenerating(true);
    try {
      const imageUrl = await generateProductImage(
        productName,
        category,
        referenceImage || undefined,
        description  || undefined
      );
      onImageGenerated(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <ImageUploader
          referenceImage={referenceImage}
          onImageUpload={setReferenceImage}
        />
        <GenerateButton
          isGenerating={isGenerating}
          disabled={!productName || !category}
          onClick={handleGenerate}
        />
      </div>
    </div>
  );
};

export default ImageGenerator;