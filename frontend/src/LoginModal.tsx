import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { FirebaseError } from 'firebase/app';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const getFirebaseErrorMessage = (error: FirebaseError): string => {
    switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        default:
            return 'An unknown error occurred during login.';
    }
}

export const LoginModal = ({ onClose, onSwitchToSignup, onForgotPassword }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const { addNotification } = useNotification();

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
        await loginWithGoogle();
        // onSuccess is handled by AuthContext listener
    } catch (err: any) {
        addNotification({ message: 'Failed to sign in with Google.', type: 'error' });
    } finally {
        setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      // onSuccess is handled by AuthContext listener
    } catch (err: any) {
        let message = 'Failed to log in.';
        if (err instanceof FirebaseError) {
            message = getFirebaseErrorMessage(err);
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
        <h2 className="text-xl font-bold text-center text-brand-text-primary mb-4">Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email-login" className="block text-sm font-medium text-brand-text-secondary mb-1">Email</label>
            <input 
              type="email" 
              id="email-login" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 text-sm rounded-md border border-brand-border focus:ring-1 focus:ring-brand-accent focus:outline-none transition bg-brand-bg"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password-login" className="block text-sm font-medium text-brand-text-secondary mb-1">Password</label>
            <input 
              type="password" 
              id="password-login" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 text-sm rounded-md border border-brand-border focus:ring-1 focus:ring-brand-accent focus:outline-none transition bg-brand-bg"
              placeholder="••••••••"
            />
          </div>
          <div className="text-right text-xs mb-4">
             <button type="button" onClick={onForgotPassword} className="font-medium text-brand-accent hover:underline">Forgot password?</button>
          </div>
          <button 
            type="submit" 
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-brand-accent text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-all disabled:bg-brand-text-secondary/50"
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        
        <div className="flex items-center my-4">
            <div className="flex-grow border-t border-brand-border"></div>
            <span className="flex-shrink mx-4 text-xs text-brand-text-secondary">OR</span>
            <div className="flex-grow border-t border-brand-border"></div>
        </div>

        <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="w-full flex items-center justify-center gap-2 bg-brand-bg text-brand-text-primary font-bold py-2 px-4 rounded-md hover:bg-brand-border transition-all border border-brand-border disabled:opacity-50"
        >
            {isGoogleLoading ? (
                'Signing in...'
            ) : (
                <>
                    <GoogleIcon />
                    Continue with Google
                </>
            )}
        </button>

        <p className="text-center text-sm text-brand-text-secondary mt-4">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="font-semibold text-brand-accent hover:underline">Sign Up</button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
