import React, { useState } from 'react';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';
import { FirebaseError } from 'firebase/app';

interface ForgotPasswordModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const ForgotPasswordModal = ({ onClose, onSwitchToLogin }: any) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotification();
  const { sendPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      addNotification({ message: 'If an account exists for this email, a password reset link has been sent.', type: 'success' });
      onClose();
    } catch (err: any) {
        let message = 'Failed to send reset link.';
        if (err instanceof FirebaseError && err.code === 'auth/invalid-email') {
            message = 'Please enter a valid email address.';
        }
        addNotification({ message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="bg-brand-surface rounded-lg shadow-xl p-6 w-full max-w-sm m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-full hover:bg-brand-border">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-xl font-bold text-center text-brand-text-primary mb-1">Forgot Password?</h2>
        <p className="text-sm text-center text-brand-text-secondary mb-4">Enter your email to get a reset link.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email-forgot" className="block text-sm font-medium text-brand-text-secondary mb-1">Email</label>
            <input 
              type="email" 
              id="email-forgot" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 text-sm rounded-md border border-brand-border focus:ring-1 focus:ring-brand-accent focus:outline-none transition bg-brand-bg"
              placeholder="you@example.com"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-accent text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-all disabled:bg-brand-text-secondary/50"
          >
            {isLoading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="text-center text-sm text-brand-text-secondary mt-4">
          Remembered your password?{' '}
          <button onClick={onSwitchToLogin} className="font-semibold text-brand-accent hover:underline">Log In</button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
