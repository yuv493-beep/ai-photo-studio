import React, { useEffect } from 'react';
import { Page } from './App';
import { useAuth } from './AuthContext';

const EmailVerifiedPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const { fetchCurrentUser } = useAuth();
    
    useEffect(() => {
        // Fetch user data to update the is_verified status in the app state
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    return (
        <main className="flex-grow flex flex-col justify-center items-center p-4 animate-fade-in text-center">
            <div className="bg-brand-surface p-8 rounded-lg border border-brand-border max-w-md w-full">
                <div className="text-5xl mb-4">✅</div>
                <h1 className="text-2xl font-serif font-bold text-brand-text-primary">Email Verified!</h1>
                <p className="text-brand-text-secondary mt-2">Thank you for verifying your email address. You now have full access to the studio.</p>
                <button onClick={() => onNavigate('dashboard')} className="mt-6 w-full bg-brand-accent text-white font-bold py-2.5 px-4 rounded-md hover:opacity-90">
                    Go to Dashboard
                </button>
            </div>
        </main>
    );
};

export default EmailVerifiedPage;
