import React from 'react';
import { Upload } from 'lucide-react';

type ImageUploaderProps = {
  referenceImage: string | null;
  onImageUpload: (imageUrl: string) => void;
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  referenceImage,
  onImageUpload
}) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        onImageUpload(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <label className="flex-1">
      <div className="relative cursor-pointer group">
        <div className="h-40 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
          {referenceImage ? (
            <div className="relative w-full h-full">
              <img
                src={referenceImage}
                alt="Reference"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">Click to change reference image</p>
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
  );
};