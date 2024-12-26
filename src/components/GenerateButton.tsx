import React from 'react';
import { RefreshCw, Check } from 'lucide-react';

type GenerateButtonProps = {
  isGenerating: boolean;
  disabled: boolean;
  onClick: () => void;
};

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  isGenerating,
  disabled,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isGenerating || disabled}
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
  );
};