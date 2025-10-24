import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File, base64: string) => void;
  originalImage: { file: File; base64: string } | null;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, originalImage, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(file, (reader.result as string).split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [disabled]);
  
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  return (
    <div className={`bg-brand-surface rounded-lg p-4 border border-brand-border ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="bg-brand-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">1</span>
        <h3 className="text-md font-semibold text-brand-text-primary">Upload Product Image</h3>
      </div>
      
      <div 
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative aspect-[4/3] rounded-lg border-2 border-dashed transition-colors ${
          isDragging ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border'
        } ${disabled ? 'pointer-events-none' : ''}`}
      >
        {originalImage ? (
          <>
            <img src={`data:${originalImage.file.type};base64,${originalImage.base64}`} alt="Uploaded product" className="w-full h-full object-contain rounded-lg" />
            <button
              onClick={() => handleFileChange(null)}
              className="absolute top-2 right-2 bg-brand-text-primary/80 text-brand-bg p-1.5 rounded-full transition-all duration-300 hover:bg-brand-text-primary"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-brand-text-secondary p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="text-sm font-semibold text-brand-text-primary">Drag & drop your image</p>
            <p className="text-xs">or</p>
            <label htmlFor="file-upload" className="font-semibold text-brand-accent text-sm cursor-pointer hover:underline">
              Browse files
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileInputChange} accept="image/*" disabled={disabled} />
          </div>
        )}
      </div>
    </div>
  );
};
