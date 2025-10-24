import React from 'react';

interface FeaturesPageProps {
  onLaunchStudio: () => void;
}

const FeatureDetail: React.FC<{ title: string; children: React.ReactNode; reverse?: boolean }> = ({ title, children, reverse = false }) => (
    <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className="md:w-1/2">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-brand-text-primary mb-4">{title}</h3>
            <p className="text-brand-text-secondary leading-relaxed">{children}</p>
        </div>
        <div className="md:w-1/2 w-full aspect-square bg-brand-surface rounded-lg border border-brand-border flex items-center justify-center">
            <p className="text-brand-text-secondary text-sm">[Feature Visualization]</p>
        </div>
    </div>
);


export const FeaturesPage = ({ onLaunchStudio }: any) => {
  return (
    <main className="flex-grow p-4 animate-fade-in">
        <div className="container mx-auto py-12 md:py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-text-primary max-w-2xl mx-auto leading-tight">
                Everything you need for perfect product shots.
            </h1>
            <p className="text-lg text-brand-text-secondary mt-4 max-w-xl mx-auto">
                Discover how our AI-powered features can revolutionize your creative workflow.
            </p>
        </div>

        <div className="container mx-auto py-12 md:py-16 space-y-20">
            <FeatureDetail title="AI-Powered Scene Generation">
                Simply upload your product and describe your vision. Our AI acts as your creative director, photographer, and set designer all in one, generating photorealistic scenes around your product in seconds.
            </FeatureDetail>

             <FeatureDetail title="Versatile Style Options" reverse>
                Whether you need a clean, white background for your e-commerce store, a stylized lookbook shot, or a viral-ready social media post, our studio has a style for you. Switch between campaign types with a single click.
            </FeatureDetail>

             <FeatureDetail title="Include AI Models">
                Add a human touch to your product shots without hiring models. With a simple toggle, you can include diverse, AI-generated models to showcase your product in a realistic context.
            </FeatureDetail>
        </div>

        <div className="text-center py-20">
            <h2 className="text-3xl font-serif font-bold text-brand-text-primary">Ready to transform your product photography?</h2>
            <button onClick={onLaunchStudio} className="mt-6 bg-brand-accent text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-opacity">
              Get Started for Free
            </button>
        </div>
    </main>
  );
};

export default FeaturesPage;
