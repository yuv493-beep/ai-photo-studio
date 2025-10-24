import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <main className="flex-grow p-4 animate-fade-in">
        <div className="container mx-auto py-12 md:py-16 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-text-primary">
                Privacy Policy
            </h1>
            <div className="prose dark:prose-invert mt-8 space-y-4 text-brand-text-secondary">
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                
                <h2 className="text-2xl font-semibold text-brand-text-primary">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account (e.g., name, email address). We also collect information automatically as you use our services, such as usage data and images you upload and generate.</p>

                <h2 className="text-2xl font-semibold text-brand-text-primary">2. How We Use Your Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services, including to process transactions, manage your account, and personalize your experience. Uploaded images are sent to our AI provider (Google Gemini) for processing and are not used for any other purpose.</p>
                
                <h2 className="text-2xl font-semibold text-brand-text-primary">3. Information Sharing</h2>
                <p>We do not share your personal information with third parties except as necessary to provide our services (e.g., with our AI service provider) or as required by law.</p>
                
                <h2 className="text-2xl font-semibold text-brand-text-primary">4. Data Security</h2>
                <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>

                <p>This is a placeholder document. Please consult with a legal professional to create a complete and compliant Privacy Policy for your application.</p>
            </div>
        </div>
    </main>
  );
};

export default PrivacyPage;
