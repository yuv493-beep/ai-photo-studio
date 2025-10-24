import React, { useEffect } from 'react';
import { Page, PaymentDetails } from './App';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { Loader } from './Loader';
import api from './services/api';

interface PaymentPageProps {
  paymentDetails: PaymentDetails | null;
  onNavigate: (page: Page) => void;
}

declare global {
  interface Window {
    Paytm: any;
  }
}

const loadPaytmScript = (src: string) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

export const PaymentPage = ({ paymentDetails, onNavigate }: any) => {
  const { addNotification } = useNotification();
  
  useEffect(() => {
    const initiatePayment = async () => {
        if (!paymentDetails) return;
        
        try {
            const { type, details } = paymentDetails;
            const orderPayload = type === 'plan' 
                ? { planId: (details as any).name.toLowerCase(), isYearly: false }
                : { amount: (details as any).price, credits: (details as any).credits };
                
            const { data } = await api.post('/payments/create-order', orderPayload);
            const { orderId, token, amount, mid } = data;

            const scriptLoaded = await loadPaytmScript(`https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/${mid}.js`);
            if (!scriptLoaded) {
                addNotification({ message: 'Could not load payment gateway. Please try again.', type: 'error' });
                return;
            }

            const config = {
                "root": "",
                "flow": "DEFAULT",
                "data": {
                    "orderId": orderId,
                    "token": token,
                    "tokenType": "TXN_TOKEN",
                    "amount": amount
                },
                "merchant": {
                    "mid": mid
                },
                "handler": {
                    "notifyMerchant": (eventName: string, data: object) => {
                        console.log("notifyMerchant handler function called");
                        console.log("eventName => ", eventName);
                        console.log("data => ", data);
                    }
                }
            };
            
            if (window.Paytm && window.Paytm.CheckoutJS) {
                window.Paytm.CheckoutJS.init(config).then(() => {
                    window.Paytm.CheckoutJS.invoke();
                }).catch((error: Error) => {
                    console.error("Error => ", error);
                    addNotification({ message: 'Payment gateway failed to start.', type: 'error' });
                });
            }

        } catch (err: any) {
            addNotification({ message: err.response?.data?.message || 'Failed to create payment order.', type: 'error' });
            onNavigate('pricing');
        }
    };
    
    initiatePayment();
  }, [paymentDetails, onNavigate, addNotification]);
  
  if (!paymentDetails) {
    useEffect(() => {
      onNavigate('pricing');
    }, [onNavigate]);
    return null;
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4 animate-fade-in">
        <Loader />
        <p className="text-lg text-brand-text-secondary mt-4">Redirecting to payment gateway...</p>
        <button onClick={() => onNavigate('pricing')} className="mt-6 text-sm font-semibold text-brand-accent hover:underline">
            Cancel and go back to Pricing
        </button>
    </main>
  );
};

export const PaymentSuccessPage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const { fetchCurrentUser } = useAuth();
    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    return (
        <main className="flex-grow flex flex-col justify-center items-center p-4 animate-fade-in text-center">
            <div className="bg-brand-surface p-8 rounded-lg border border-brand-border max-w-md w-full">
                <div className="text-5xl mb-4">✅</div>
                <h1 className="text-2xl font-serif font-bold text-brand-text-primary">Payment Successful!</h1>
                <p className="text-brand-text-secondary mt-2">Your account has been updated. Thank you for your purchase.</p>
                <button onClick={() => onNavigate('studio')} className="mt-6 w-full bg-brand-accent text-white font-bold py-2.5 px-4 rounded-md hover:opacity-90">
                    Go to Studio
                </button>
            </div>
        </main>
    );
};

export const PaymentFailurePage = ({ onNavigate }: { onNavigate: (page: any) => void }) => {
    return (
        <main className="flex-grow flex flex-col justify-center items-center p-4 animate-fade-in text-center">
            <div className="bg-brand-surface p-8 rounded-lg border border-brand-border max-w-md w-full">
                <div className="text-5xl mb-4">❌</div>
                <h1 className="text-2xl font-serif font-bold text-brand-text-primary">Payment Failed</h1>
                <p className="text-brand-text-secondary mt-2">There was an issue with your payment. Please try again or contact support.</p>
                <button onClick={() => onNavigate('pricing')} className="mt-6 w-full bg-brand-accent/20 text-brand-accent font-bold py-2.5 px-4 rounded-md hover:bg-brand-accent/30">
                    Try Again
                </button>
            </div>
        </main>
    );
};

export default PaymentPage;
