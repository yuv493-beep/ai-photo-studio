import React, { useState, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
import { ControlsPanel } from './ControlsPanel';
import { ImageGallery } from './ImageGallery';
import { GeneratedImage, EditType, ProductCategory, ImageCountOption, IMAGE_COUNT_DETAILS } from './types';
import api from './services/api'; 
import { Loader } from './Loader';
import { ConceptDisplay } from './ConceptDisplay';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { Page } from './App';

interface StudioPageProps {
  onNavigate: (page: Page) => void;
}

const StudioPage: React.FC<StudioPageProps> = ({ onNavigate }) => {
  const [originalImage, setOriginalImage] = useState<{ file: File; base64: string } | null>(null);
  const [editType, setEditType] = useState<EditType>(EditType.Ecommerce);
  const [imageCount, setImageCount] = useState<ImageCountOption>(ImageCountOption.Basic);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [includeModel, setIncludeModel] = useState<boolean>(true);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [identifiedCategory, setIdentifiedCategory] = useState<ProductCategory | null>(null);
  const [concept, setConcept] = useState<{ theme: string; shots: string[] } | null>(null);
  const [isIdeating, setIsIdeating] = useState<boolean>(false);

  const { user, updateUser } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (!user) {
      // Reset state if user logs out
      setOriginalImage(null);
      setGeneratedImages([]);
      setConcept(null);
      setIsLoading(false);
      setIsIdeating(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.plan_id === 'starter' && editType !== EditType.Ecommerce) {
      setEditType(EditType.Ecommerce);
      addNotification({ message: "E-commerce style is selected for the Starter plan.", type: 'info' });
    }
  }, [user, editType, addNotification]);

  const handleImageUpload = (file: File | null, base64: string | null) => {
    if (file && base64) {
      setOriginalImage({ file, base64 });
    } else {
      setOriginalImage(null);
    }
    setGeneratedImages([]);
    setIdentifiedCategory(null);
    setConcept(null);
  };

  const getMinImageCount = (countOption: ImageCountOption): number => {
    const countString = IMAGE_COUNT_DETAILS[countOption].count;
    const match = countString.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 6;
  };
  
  const numImagesToGenerate = getMinImageCount(imageCount);
  const hasEnoughCredits = user ? user.credits >= numImagesToGenerate : false;
  const isVerified = user?.is_verified ?? false;

  const handleIdeate = async () => {
    if (!user) return;
    if (!isVerified) {
        addNotification({ message: 'Please verify your email to generate concepts.', type: 'error' });
        return;
    }
    if (!originalImage) {
      addNotification({ message: 'Please upload an image first.', type: 'error' });
      return;
    }
    if (!hasEnoughCredits) {
      addNotification({ message: `You need ${numImagesToGenerate} credits. Please purchase more.`, type: 'info' });
      onNavigate('pricing');
      return;
    }

    setIsIdeating(true);
    setConcept(null);
    setGeneratedImages([]);

    try {
      const response = await api.post('/studio/concept', {
        originalImage,
        editType,
        imageCount: numImagesToGenerate.toString(),
        customPrompt,
        includeModel,
      });
      setIdentifiedCategory(response.data.category);
      setConcept(response.data.concept);

    } catch (err: any) {
      console.error(err);
      addNotification({ message: err.response?.data?.message || 'Failed to generate concept.', type: 'error' });
    } finally {
      setIsIdeating(false);
    }
  };

  const handleGenerate = async () => {
    if (!user) return;
    if (!isVerified) {
        addNotification({ message: 'Please verify your email to generate images.', type: 'error' });
        return;
    }
    if (!originalImage || !concept || !identifiedCategory) {
      addNotification({ message: 'Please generate a concept first.', type: 'error' });
      return;
    }
    if (!hasEnoughCredits) {
      addNotification({ message: `You need ${numImagesToGenerate} credits for this generation.`, type: 'error' });
      onNavigate('pricing');
      return;
    }

    setIsLoading(true);
    setGeneratedImages([]);
    setGenerationProgress(0);

    try {
       // This will be a streaming endpoint in a future version. For now, we simulate progress.
       const generationInterval = setInterval(() => {
        setGenerationProgress(prev => prev < numImagesToGenerate ? prev + 1 : prev);
       }, 5000); // Simulate progress every 5s

      const response = await api.post('/studio/generate', {
        originalImage,
        concept,
        category: identifiedCategory,
        editType,
        customPrompt,
        includeModel,
      });
      
      clearInterval(generationInterval);

      const { generatedImages: newImages, newCredits } = response.data;
      
      setGeneratedImages(newImages);
      setSelectedImage(newImages[0] || null);
      
      if (typeof newCredits === 'number') {
        updateUser({ credits: newCredits });
      }

      addNotification({ message: 'Images generated successfully!', type: 'success' });
      setConcept(null);

    } catch (err: any) {
      console.error(err);
      addNotification({ message: err.response?.data?.message || 'Failed to generate images.', type: 'error' });
    } finally {
      setIsLoading(false);
      setGenerationProgress(0);
    }
  };

  const handleNavigateToPricing = () => onNavigate('pricing');
  
  const renderOutputContent = () => {
    if (!user) {
        return (
             <div className="text-center text-brand-text-secondary p-8">
                <h3 className="font-semibold text-brand-text-primary text-lg">Welcome to the Studio</h3>
                <p className="mt-1 text-sm">Please log in or sign up to start creating.</p>
            </div>
        )
    }
    if (isIdeating || isLoading) {
      return <Loader 
        identifiedCategory={identifiedCategory} 
        isIdeating={isIdeating}
        generationProgress={generationProgress}
        totalImages={numImagesToGenerate}
      />;
    }
    if (generatedImages.length > 0) {
      return <ImageGallery images={generatedImages} selectedImage={selectedImage} onSelectImage={setSelectedImage} />;
    }
    if (concept) {
      return <ConceptDisplay concept={concept} onRegenerate={handleIdeate} isRegenerating={isIdeating} />;
    }
    return (
       <div className="text-center text-brand-text-secondary animate-fade-in p-8 flex flex-col justify-center items-center h-full">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-2xl bg-brand-accent/10 transform -rotate-12"></div>
          <div className="absolute inset-0 rounded-2xl bg-brand-accent/20 transform rotate-12"></div>
          <div className="absolute inset-0 rounded-2xl bg-brand-surface border-2 border-dashed border-brand-border flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.672-2.672L11.25 18l1.938-.648a3.375 3.375 0 002.672-2.672L16.25 13.5l.648 1.938a3.375 3.375 0 002.672 2.672L21 18l-1.938.648a3.375 3.375 0 00-2.672 2.672z" />
            </svg>
          </div>
        </div>
        <h3 className="font-semibold text-brand-text-primary text-lg">Your Canvas Awaits</h3>
        <p className="mt-1 text-sm max-w-xs mx-auto">Upload a product image and choose your style to start creating.</p>
      </div>
    );
  };

  return (
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 p-4">
        <div className="flex flex-col gap-4">
            <ImageUploader onImageUpload={handleImageUpload} originalImage={originalImage} disabled={!user}/>
            <ControlsPanel
              editType={editType}
              setEditType={setEditType}
              imageCount={imageCount}
              setImageCount={setImageCount}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              includeModel={includeModel}
              setIncludeModel={setIncludeModel}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              isImageUploaded={!!originalImage}
              onIdeate={handleIdeate}
              isIdeating={isIdeating}
              hasConcept={!!concept}
              disabled={!user}
              creditsNeeded={numImagesToGenerate}
              hasEnoughCredits={hasEnoughCredits}
              userPlan={user?.plan_id}
              onNavigateToPricing={handleNavigateToPricing}
              isVerified={isVerified}
            />
        </div>
        <div className="bg-brand-surface rounded-lg border border-brand-border flex flex-col justify-center items-center min-h-[600px] lg:min-h-0">
            {renderOutputContent()}
        </div>
      </main>
  );
};

export default StudioPage;
