import React, { useState } from 'react';
import { GeneratedImage } from './types';
import { downloadImagesAsZip } from './utils';
import { useNotification } from './NotificationContext';

interface ImageGalleryProps {
  images: GeneratedImage[];
  selectedImage: GeneratedImage | null;
  onSelectImage: (image: GeneratedImage) => void;
}

export const ImageGallery = ({ images, selectedImage, onSelectImage }: any) => {
  const [isZipping, setIsZipping] = useState(false);
  const { addNotification } = useNotification();
  const currentImage = selectedImage || images[0];

  const handleDownloadAll = async () => {
    if (isZipping) return;
    setIsZipping(true);
    try {
      await downloadImagesAsZip(images, 'studio-generated-images.zip');
    } catch (error) {
      console.error("Failed to create zip file:", error);
      addNotification({ message: 'Failed to create the zip file. Please try again.', type: 'error' });
    } finally {
      setIsZipping(false);
    }
  };

  if (!currentImage) {
    return null; // Should not happen if images exist
  }

  return (
    <div className="w-full animate-fade-in p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-brand-text-primary">Generated Results</h3>
        <button
          onClick={handleDownloadAll}
          disabled={isZipping}
          className="flex items-center gap-2 text-sm font-semibold bg-brand-surface hover:bg-brand-border text-brand-text-primary px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          {isZipping ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Zipping...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download All</span>
            </>
          )}
        </button>
      </div>

      {/* Main Preview */}
      <div className="w-full relative mb-4 rounded-lg bg-brand-bg border border-brand-border flex items-center justify-center flex-grow min-h-0">
         <img 
            key={currentImage.src}
            src={currentImage.src} 
            alt={currentImage.alt} 
            className="max-w-full max-h-full object-contain animate-fade-in" 
        />
         <a
            href={currentImage.src}
            download={`selected-image.png`}
            className="absolute top-2 right-2 bg-brand-text-primary/80 text-brand-bg p-1.5 rounded-full transition-all duration-300 hover:bg-brand-text-primary"
            aria-label="Download image"
            title="Download selected image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
      </div>
      
      {/* Thumbnails */}
      <div className="flex-shrink-0">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {images.map((image, index) => (
                <button 
                    key={index} 
                    onClick={() => onSelectImage(image)}
                    className={`w-full aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                        currentImage.src === image.src ? 'border-brand-accent' : 'border-transparent hover:border-brand-border'
                    }`}
                >
                    <img 
                        src={image.src} 
                        alt={image.alt} 
                        className="w-full h-full object-cover" 
                    />
                </button>
            ))}
          </div>
      </div>
    </div>
  );
};
