import React from 'react';
import { Page } from './App';

const EmailVerificationFailedPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    return (
        <main className="flex-grow flex flex-col justify-center items-center p-4 animate-fade-in text-center">
            <div className="bg-brand-surface p-8 rounded-lg border border-brand-border max-w-md w-full">
                <div className="text-5xl mb-4">❌</div>
                <h1 className="text-2xl font-serif font-bold text-brand-text-primary">Verification Failed</h1>
                <p className="text-brand-text-secondary mt-2">The verification link is invalid or has expired. Please try resending the verification email from your dashboard.</p>
                <button onClick={() => onNavigate('home')} className="mt-6 w-full bg-brand-accent text-white font-bold py-2.5 px-4 rounded-md hover:opacity-90">
                    Go to Home
                </button>
            </div>
        </main>
    );
};

export default EmailVerificationFailedPage;
