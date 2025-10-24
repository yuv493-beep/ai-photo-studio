import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { GenerationHistoryItem } from './types';
import api from './services/api';
import { Loader } from './Loader';
import { downloadImagesAsZip } from './utils';
import { useNotification } from './NotificationContext';

const DownloadIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const ZippingIcon: React.FC = () => (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [zippingId, setZippingId] = useState<string | null>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const response = await api.get('/history');
          setHistory(response.data.history);
        } catch (error) {
          console.error("Failed to fetch history", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleDownloadAll = async (item: GenerationHistoryItem) => {
    if (zippingId) return;
    setZippingId(item.id);
    try {
        const zipName = `studio-creation-${item.theme.replace(/[\s\W]+/g, '-').toLowerCase()}.zip`;
        await downloadImagesAsZip(item.images, zipName);
    } catch (error) {
        console.error("Failed to create zip file:", error);
        addNotification({ message: 'Failed to create the zip file. Please try again.', type: 'error' });
    } finally {
        setZippingId(null);
    }
  };

  if (!user) {
    return (
      <main className="flex-grow flex flex-col justify-center items-center p-4 animate-fade-in text-center">
        <h1 className="text-2xl font-bold">Please log in</h1>
        <p className="text-brand-text-secondary mt-2">You need to be logged in to view your creations.</p>
      </main>
    );
  }

  return (
    <main className="flex-grow p-4 animate-fade-in">
      <div className="container mx-auto py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-text-primary text-center">
          My Creations
        </h1>
        <p className="text-lg text-brand-text-secondary mt-4 text-center max-w-xl mx-auto">
            A gallery of all the amazing product photoshoots you've generated.
        </p>

        <div className="mt-12">
            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <Loader />
                </div>
            ) : history.length === 0 ? (
                <div className="text-center text-brand-text-secondary border-2 border-dashed border-brand-border rounded-lg py-16">
                    <h3 className="text-xl font-semibold text-brand-text-primary">No creations yet!</h3>
                    <p className="mt-2">Head over to the Studio to generate your first set of images.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {history.map(item => (
                        <div key={item.id} className="bg-brand-surface p-4 rounded-lg border border-brand-border">
                            <div className="flex justify-between items-start mb-4 gap-4">
                                <div>
                                    <h2 className="font-semibold text-brand-text-primary font-serif text-2xl">{item.theme}</h2>
                                    <p className="text-sm text-brand-text-secondary">{new Date(item.timestamp).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <img src={item.originalImageBase64.startsWith('data:') ? item.originalImageBase64 : `data:image/jpeg;base64,${item.originalImageBase64}`} alt="Original" className="w-16 h-16 rounded-md object-cover border border-brand-border" />
                                    <button
                                        onClick={() => handleDownloadAll(item)}
                                        disabled={!!zippingId}
                                        className="flex items-center gap-2 text-sm font-semibold bg-brand-bg hover:bg-brand-border text-brand-text-primary px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait"
                                        title="Download all images in this set as a ZIP file"
                                    >
                                        {zippingId === item.id ? (
                                            <>
                                                <ZippingIcon />
                                                <span>Zipping...</span>
                                            </>
                                        ) : (
                                            <>
                                                <DownloadIcon />
                                                <span>Download All</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {item.images.map((image, index) => (
                                    <div key={index} className="group relative aspect-square rounded-md overflow-hidden border border-brand-border">
                                        <img src={image.src} alt={image.alt} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <a
                                                href={image.src}
                                                download={`creation-${item.theme.replace(/[\s\W]+/g, '-')}-${index + 1}.png`}
                                                className="p-2 bg-white/80 text-black rounded-full hover:bg-white transition-colors"
                                                title="Download this image"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <DownloadIcon className="h-5 w-5" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </main>
  );
};

export default HistoryPage;
