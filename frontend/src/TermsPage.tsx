import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <main className="flex-grow p-4 animate-fade-in">
        <div className="container mx-auto py-12 md:py-16 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-text-primary">
                Terms of Service
            </h1>
            <div className="prose dark:prose-invert mt-8 space-y-4 text-brand-text-secondary">
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                
                <h2 className="text-2xl font-semibold text-brand-text-primary">1. Acceptance of Terms</h2>
                <p>By accessing or using our service, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our service.</p>

                <h2 className="text-2xl font-semibold text-brand-text-primary">2. Use of Service</h2>
                <p>You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use the service in any way that violates any applicable federal, state, local, or international law or regulation.</p>
                
                <h2 className="text-2xl font-semibold text-brand-text-primary">3. User Accounts</h2>
                <p>To access some features of the service, you may be required to create an account. You are responsible for safeguarding your account information and for any activities or actions under your account.</p>

                <h2 className="text-2xl font-semibold text-brand-text-primary">4. Intellectual Property</h2>
                <p>The service and its original content, features, and functionality are and will remain the exclusive property of Studio and its licensors. You own the rights to the images you generate using the service, subject to the terms of your subscription plan.</p>

                <h2 className="text-2xl font-semibold text-brand-text-primary">5. Termination</h2>
                <p>We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                
                <p>This is a placeholder document. Please consult with a legal professional to create a complete and compliant Terms of Service for your application.</p>
            </div>
        </div>
    </main>
  );
};

export default TermsPage;
