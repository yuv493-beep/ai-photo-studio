import React, { useState } from 'react';
import { useNotification } from './NotificationContext';
import api from './services/api';

interface ResetPasswordModalProps {
  onClose: () => void;
  token: string;
  onSuccess: () => void;
}

export const ResetPasswordModal = ({ onClose, token, onSuccess }: any) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addNotification({ message: 'Passwords do not match.', type: 'error' });
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      addNotification({ message: 'Password reset successfully! Please log in.', type: 'success' });
      onSuccess();
    } catch (err: any) {
      addNotification({ message: err.response?.data?.message || 'Failed to reset password.', type: 'error' });
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
        <h2 className="text-xl font-bold text-center text-brand-text-primary mb-4">Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password-reset" className="block text-sm font-medium text-brand-text-secondary mb-1">New Password</label>
            <input 
              type="password" 
              id="password-reset" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 text-sm rounded-md border border-brand-border focus:ring-1 focus:ring-brand-accent focus:outline-none transition bg-brand-bg"
              placeholder="••••••••"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm-password-reset" className="block text-sm font-medium text-brand-text-secondary mb-1">Confirm New Password</label>
            <input 
              type="password" 
              id="confirm-password-reset" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 text-sm rounded-md border border-brand-border focus:ring-1 focus:ring-brand-accent focus:outline-none transition bg-brand-bg"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-accent text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-all disabled:bg-brand-text-secondary/50"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
