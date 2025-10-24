import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Page } from './App';
import { GenerationHistoryItem } from './types';
import api from './services/api';
import { Loader } from './Loader';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

const StudioIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}> <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.672-2.672L11.25 18l1.938-.648a3.375 3.375 0 002.672-2.672L16.25 13.5l.648 1.938a3.375 3.375 0 002.672 2.672L21 18l-1.938.648a3.375 3.375 0 00-2.672 2.672z" /> </svg>;
const CreditIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /> </svg>;
const PlanIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> </svg>;

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [recentCreations, setRecentCreations] = useState<GenerationHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        try {
          setIsLoadingHistory(true);
          const response = await api.get('/history');
          setRecentCreations(response.data.history.slice(0, 4)); // Get latest 4 creations
        } catch (error) {
          console.error("Failed to fetch history for dashboard", error);
        } finally {
          setIsLoadingHistory(false);
        }
      } else {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (!user) {
    return (
      <main className="flex-grow flex flex-col justify-center items-center p-4">
        <Loader />
        <p className="mt-4 text-brand-text-secondary">Loading your dashboard...</p>
      </main>
    );
  }

  return (
    <main className="flex-grow p-4 animate-fade-in bg-brand-surface dark:bg-brand-bg">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl lg:text-4xl font-bold font-serif text-brand-text-primary">
          Welcome back, {user.name}!
        </h1>
        <p className="text-brand-text-secondary mt-1">
          Here's a quick look at your studio. Ready to create something amazing?
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Card 1: Go to Studio */}
          <div className="bg-brand-bg dark:bg-brand-surface p-6 rounded-lg border border-brand-border flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="p-4 bg-brand-accent/10 rounded-full mb-4">
                <StudioIcon />
            </div>
            <h2 className="text-xl font-semibold text-brand-text-primary">Quick Start</h2>
            <p className="text-sm text-brand-text-secondary mt-1 mb-4 flex-grow">Jump back into the studio to generate new images.</p>
            <button 
                onClick={() => onNavigate('studio')}
                className="w-full bg-brand-accent text-white font-bold py-2.5 px-4 rounded-md hover:opacity-90 transition-opacity"
            >
                Go to Studio
            </button>
          </div>

          {/* Card 2: Account Status */}
          <div className="bg-brand-bg dark:bg-brand-surface p-6 rounded-lg border border-brand-border flex flex-col hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-brand-text-primary mb-4">Account Status</h2>
            <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-3 bg-brand-surface dark:bg-brand-bg p-3 rounded-md border border-brand-border">
                    <PlanIcon />
                    <div>
                        <p className="text-xs text-brand-text-secondary">Current Plan</p>
                        <p className="font-semibold text-brand-text-primary capitalize">{user.plan_id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-brand-surface dark:bg-brand-bg p-3 rounded-md border border-brand-border">
                    <CreditIcon />
                    <div>
                        <p className="text-xs text-brand-text-secondary">Credits Remaining</p>
                        <p className="font-semibold text-brand-text-primary">{user.credits}</p>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => onNavigate('pricing')}
                className="w-full mt-4 font-semibold bg-brand-accent/10 text-brand-accent px-4 py-2 rounded-md hover:bg-brand-accent/20 transition-colors text-sm"
            >
                Manage Subscription
            </button>
          </div>
        </div>

        {/* Section: Recent Creations */}
        <div className="mt-12">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-serif text-brand-text-primary">Recent Creations</h2>
                <button 
                    onClick={() => onNavigate('history')}
                    className="text-sm font-semibold text-brand-accent hover:underline"
                >
                    View All &rarr;
                </button>
            </div>
            {isLoadingHistory ? (
                 <div className="flex justify-center items-center py-16 bg-brand-bg dark:bg-brand-surface rounded-lg border border-brand-border">
                    <Loader />
                </div>
            ) : recentCreations.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recentCreations.map(item => (
                        <div key={item.id} className="group relative aspect-square bg-brand-bg dark:bg-brand-surface rounded-lg overflow-hidden border border-brand-border">
                            <img 
                                src={item.images[0]?.src || ''}
                                alt={item.theme}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <p className="absolute bottom-2 left-2 text-white text-sm font-semibold p-1">{item.theme}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-brand-text-secondary border-2 border-dashed border-brand-border rounded-lg py-16 bg-brand-bg dark:bg-brand-surface">
                    <h3 className="text-xl font-semibold text-brand-text-primary">No creations yet!</h3>
                    <p className="mt-2">Head over to the Studio to generate your first set of images.</p>
                </div>
            )}
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
