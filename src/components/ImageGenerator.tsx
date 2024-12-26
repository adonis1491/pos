import React, { useState } from 'react';
import { Upload, RefreshCw, Check } from 'lucide-react';
import { generateProductImage } from '../utils/imageGeneration';

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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);
        onImageGenerated(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!productName || !category) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const imageUrl = await generateProductImage(
        productName, 
        category, 
        description,
        uploadedImage
      );
      onImageGenerated(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex gap-4">
        <label className="flex-1">
          <div className="relative cursor-pointer group">
            <div className="h-40 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
              {uploadedImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={uploadedImage}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">Optional: Click to change reference image</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-white/60" />
                  <p className="text-sm text-white/60">Optional: Upload Reference Image</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </label>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !productName || !category}
          className={`flex-1 h-40 rounded-lg border-2 border-dashed
            ${isGenerating 
              ? 'bg-starbucks-green/20 border-starbucks-green/40' 
              : 'border-white/20 bg-white/5 hover:bg-white/10'
            } 
            transition-colors flex flex-col items-center justify-center gap-2`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-8 w-8 text-starbucks-green animate-spin" />
              <p className="text-sm text-white/60">Generating...</p>
            </>
          ) : (
            <>
              <div className="h-8 w-8 rounded-full bg-starbucks-green/20 flex items-center justify-center">
                <Check className="h-5 w-5 text-starbucks-green" />
              </div>
              <p className="text-sm text-white/60">Generate Product Image</p>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageGenerator;
