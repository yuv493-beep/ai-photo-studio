import { GeneratedImage } from './types';

// Declare JSZip as it's loaded from a CDN script in index.html
declare const JSZip: any;

export const downloadImagesAsZip = async (images: GeneratedImage[], zipName: string): Promise<void> => {
    if (images.length === 0 || typeof JSZip === 'undefined') {
      if (typeof JSZip === 'undefined') {
        console.error("JSZip library not loaded.");
      }
      return;
    }

    try {
      const zip = new JSZip();

      const fetchAndAdd = async (image: GeneratedImage, index: number) => {
          const response = await fetch(image.src);
          const blob = await response.blob();
          const extension = blob.type.split('/')[1] || 'png';
          zip.file(`image-${index + 1}.${extension}`, blob);
      };

      await Promise.all(images.map(fetchAndAdd));

      const content = await zip.generateAsync({ type: 'blob' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = zipName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error("Failed to create zip file:", error);
      // Re-throw to be caught by the calling component for user notification
      throw new Error("Could not create zip file.");
    }
};
