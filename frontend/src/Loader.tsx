import React from 'react';
import { ProductCategory } from './types';

interface LoaderProps {
    identifiedCategory?: ProductCategory | null;
    isIdeating?: boolean;
    generationProgress?: number;
    totalImages?: number;
}

export const Loader: React.FC<LoaderProps> = ({ identifiedCategory, isIdeating = false, generationProgress = 0, totalImages = 0 }) => {
  let mainText: string;
  let subText: string;

  const showProgressBar = !isIdeating && totalImages > 0;
  const progress = generationProgress || 0;
  const progressPercentage = showProgressBar ? Math.min((progress / totalImages) * 100, 100) : 0;

  if (isIdeating) {
    if (identifiedCategory) {
        mainText = `Identified: ${identifiedCategory}`;
        subText = 'Now generating a creative concept...';
    } else {
        mainText = 'Identifying product category...';
        subText = 'The AI is analyzing your image.';
    }
  } else if (showProgressBar) {
    mainText = `Generating image ${Math.min(progress + 1, totalImages)} of ${totalImages}...`;
    subText = 'Crafting the perfect shot, this can take a minute.';
  }
  else {
    mainText = 'Processing...';
    subText = 'This may take a moment.';
  }

  return (
    <div className="flex flex-col items-center justify-center text-center text-brand-text-primary animate-fade-in w-full max-w-md px-4">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-brand-accent/50 animate-pulse-ring"></div>
        <div className="absolute inset-0 rounded-full bg-brand-accent/50 animate-pulse-ring" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.672-2.672L11.25 18l1.938-.648a3.375 3.375 0 002.672-2.672L16.25 13.5l.648 1.938a3.375 3.375 0 002.672 2.672L21 18l-1.938.648a3.375 3.375 0 00-2.672 2.672z" />
            </svg>
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold">{mainText}</p>
      <p className="text-sm text-brand-text-secondary">{subText}</p>
      
      {showProgressBar && (
        <div className="w-full bg-brand-border rounded-full h-2 mt-4 overflow-hidden">
          <div
            className="bg-brand-accent h-2 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Generation progress"
          ></div>
        </div>
      )}
    </div>
  );
};
