import React from 'react';

interface HomePageProps {
  onLaunchStudio: () => void;
  onNavigateToPricing: () => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-brand-surface p-6 rounded-lg border border-brand-border">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="font-semibold text-brand-text-primary mb-2">{title}</h3>
        <p className="text-sm text-brand-text-secondary">{children}</p>
    </div>
);


export const HomePage = ({ onLaunchStudio, onNavigateToPricing }: any) => {
  return (
    <main className="flex-grow animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-20 md:py-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-text-primary max-w-3xl mx-auto leading-tight">
            Create Stunning Product Photos with AI
          </h1>
          <p className="text-lg text-brand-text-secondary mt-6 max-w-2xl mx-auto">
            Upload your product image, describe a scene, and let our AI generate countless professional-grade photoshoots in seconds.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button onClick={onLaunchStudio} className="bg-brand-accent text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-opacity">
              Launch Studio &rarr;
            </button>
             <button onClick={onNavigateToPricing} className="bg-brand-surface hover:bg-brand-border text-brand-text-primary font-bold py-3 px-6 rounded-md border border-brand-border transition-colors">
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-brand-surface">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-text-primary">Why Choose Our Studio?</h2>
                <p className="text-lg text-brand-text-secondary mt-4 max-w-2xl mx-auto">
                    Go from a single photo to a full campaign, faster and more affordably than ever before.
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <FeatureCard icon="📸" title="Infinite Styles">
                    Generate images for e-commerce, social media, ad campaigns, and more. If you can imagine it, our AI can create it.
                </FeatureCard>
                 <FeatureCard icon="⚡️" title="Lightning Fast">
                    Get dozens of unique, high-quality images in the time it takes to set up a single traditional photoshoot.
                </FeatureCard>
                 <FeatureCard icon="💰" title="Cost-Effective">
                    Slash your photography budget. No need for expensive photographers, locations, or models.
                </FeatureCard>
            </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
