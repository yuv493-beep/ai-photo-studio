import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { FirebaseError } from 'firebase/app';

const VerificationBanner: React.FC = () => {
    const { resendVerificationEmail } = useAuth();
    const { addNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);

    const handleResend = async () => {
        setIsLoading(true);
        try {
            await resendVerificationEmail();
            addNotification({ message: 'A new verification email has been sent.', type: 'success' });
        } catch (error: any) {
            let message = 'Failed to send email.';
            if (error instanceof FirebaseError && error.code === 'auth/too-many-requests') {
                message = 'Too many requests. Please try again later.';
            }
            addNotification({ message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-yellow-500/20 text-yellow-800 dark:text-yellow-200 p-3 text-center text-sm border-b border-yellow-500/30">
            Your email address is not verified. Please check your inbox for the verification link.
            <button
                onClick={handleResend}
                disabled={isLoading}
                className="font-bold underline ml-2 hover:text-yellow-900 dark:hover:text-yellow-100 disabled:opacity-50"
            >
                {isLoading ? 'Sending...' : 'Resend email'}
            </button>
        </div>
    );
};

export default VerificationBanner;
