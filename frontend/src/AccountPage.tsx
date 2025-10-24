import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Page } from './App';
import { PaymentHistoryItem } from './types';
import { Loader } from './Loader';
import api from './services/api';

interface AccountPageProps {
  onNavigateToPricing: () => void;
}

export const AccountPage = ({ onNavigateToPricing }: any) => {
  const { user } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!user) {
          setIsLoading(false);
          return;
      }
      try {
        const { data } = await api.get('/user/payment-history');
        setPaymentHistory(data.history);
      } catch (error) {
          console.error("Failed to fetch payment history", error);
      } finally {
          setIsLoading(false);
      }
    };
    fetchPaymentHistory();
  }, [user]);

  if (!user) {
    return (
      <main className="flex-grow flex flex-col justify-center items-center p-4 animate-fade-in text-center">
        <h1 className="text-2xl font-bold">Please log in</h1>
        <p className="text-brand-text-secondary mt-2">You need to be logged in to view your account details.</p>
      </main>
    );
  }

  return (
    <main className="flex-grow flex flex-col items-center p-4 animate-fade-in">
       <div className="container mx-auto py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-text-primary text-center">
          My Account
        </h1>
        <div className="mt-8 max-w-2xl mx-auto bg-brand-surface border border-brand-border rounded-lg p-6">
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-brand-text-secondary">Name</label>
                    <p className="text-brand-text-primary font-semibold">{user.name}</p>
                </div>
                <div>
                    <label className="text-sm font-medium text-brand-text-secondary">Email</label>
                    <p className="text-brand-text-primary font-semibold">{user.email}</p>
                </div>
                 <div className="pt-4 mt-4 border-t border-brand-border">
                    <label className="text-sm font-medium text-brand-text-secondary">Current Plan</label>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-brand-text-primary font-semibold capitalize">{user.plan_id}</p>
                            <p className="text-sm text-brand-text-secondary">{user.credits} credits remaining</p>
                        </div>
                        <button onClick={onNavigateToPricing} className="font-semibold bg-brand-accent/10 text-brand-accent px-4 py-1.5 rounded-md hover:bg-brand-accent/20 transition-colors text-sm">
                            Manage Subscription
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-brand-text-primary mb-4 text-center md:text-left">
                Payment History
            </h2>
            <div className="bg-brand-surface border border-brand-border rounded-lg">
                {isLoading ? (
                    <div className="p-6 text-center"><Loader /></div>
                ) : paymentHistory.length > 0 ? (
                <ul className="divide-y divide-brand-border">
                    {paymentHistory.map((item) => (
                    <li key={item.id} className="p-4 flex justify-between items-center">
                        <div>
                        <p className="font-semibold text-brand-text-primary">{item.description}</p>
                        <p className="text-sm text-brand-text-secondary">
                            {new Date(item.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            })}
                        </p>
                        </div>
                        <p className="font-semibold text-brand-text-primary">₹{item.amount}</p>
                    </li>
                    ))}
                </ul>
                ) : (
                <div className="p-6 text-center text-brand-text-secondary">
                    <p>No transactions yet.</p>
                </div>
                )}
            </div>
        </div>

      </div>
    </main>
  );
};

export default AccountPage;
