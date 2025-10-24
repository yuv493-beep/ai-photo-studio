import React from 'react';
import { useAuth } from './AuthContext';
import { Plan, PLAN_DETAILS, CreditPack, CREDIT_PACK_DETAILS } from './types';
import { PaymentDetails, Page } from './App';
import { ModalType } from './Header';

interface PricingPageProps {
  onOpenModal: (type: ModalType) => void;
  onInitiatePurchase: (details: PaymentDetails) => void;
  onNavigate: (page: Page) => void;
}

const CheckIcon = () => (
  <svg className="h-5 w-5 text-brand-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const PricingCard: React.FC<{
  planDetails: typeof PLAN_DETAILS[Plan];
  isCurrentUserPlan: boolean;
  isLoggedIn: boolean;
  onOpenModal: (type: ModalType) => void;
  onInitiatePurchase: (details: PaymentDetails) => void;
  onNavigate: (page: Page) => void;
}> = ({ planDetails, isCurrentUserPlan, isLoggedIn, onOpenModal, onInitiatePurchase, onNavigate }) => {
    const { name, price, features, isFeatured } = planDetails;

    const handleButtonClick = () => {
        if (!isLoggedIn) {
            onOpenModal('login');
        } else if (!isCurrentUserPlan) {
             if (name === Plan.Enterprise) {
                onNavigate('contact');
             } else {
                onInitiatePurchase({ type: 'plan', details: planDetails });
             }
        }
    };
    
    let buttonText = "Get Started";
    if (isLoggedIn) {
        if (isCurrentUserPlan) {
            buttonText = "Current Plan";
        } else {
            buttonText = name === Plan.Enterprise ? "Contact Sales" : "Upgrade Plan";
        }
    }

  return (
    <div className={`relative border rounded-lg p-6 flex flex-col bg-brand-surface ${isFeatured ? 'border-brand-accent/50' : 'border-brand-border'}`}>
    {isFeatured && <div className="absolute top-0 right-6 -mt-3 bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>}
    <h3 className="text-lg font-semibold text-brand-text-primary">{name}</h3>
    <p className="text-sm text-brand-text-secondary mt-1">{`Perfect for ${name === Plan.Starter ? 'getting started' : name === Plan.Pro ? 'professionals' : name === Plan.Business ? 'growing businesses' : 'large-scale needs'}.`}</p>
    <div className="my-6">
      <span className="text-4xl font-bold text-brand-text-primary">{price}</span>
      <span className="text-brand-text-secondary">{price !== 'Free' && price !== 'Custom' && '/ month'}</span>
    </div>
    <ul className="space-y-3 text-sm flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          <CheckIcon />
          <span className="text-brand-text-secondary">{feature}</span>
        </li>
      ))}
    </ul>
    <button 
        onClick={handleButtonClick}
        disabled={isCurrentUserPlan && isLoggedIn}
        className={`mt-8 w-full font-bold py-2.5 px-4 rounded-md transition-all ${
            isFeatured 
            ? 'bg-brand-accent text-white hover:opacity-90 disabled:opacity-50' 
            : 'bg-brand-surface hover:bg-brand-border text-brand-text-primary border border-brand-border disabled:opacity-50'
        }`}
    >
      {buttonText}
    </button>
  </div>
  )
};

const CreditPackCard: React.FC<{
  pack: CreditPack;
  isLoggedIn: boolean;
  onOpenModal: (type: ModalType) => void;
  onInitiatePurchase: (details: PaymentDetails) => void;
}> = ({ pack, isLoggedIn, onOpenModal, onInitiatePurchase }) => {
    const { name, credits, price, pricePerCredit, isFeatured } = pack;

    const handlePurchase = () => {
        if (!isLoggedIn) {
            onOpenModal('login');
        } else {
            onInitiatePurchase({ type: 'credits', details: pack });
        }
    }

    return (
        <div className={`relative border rounded-lg p-6 flex flex-col bg-brand-surface ${isFeatured ? 'border-brand-accent/50' : 'border-brand-border'}`}>
            {isFeatured && <div className="absolute top-0 right-6 -mt-3 bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-full">Best Value</div>}
            <h3 className="text-lg font-semibold text-brand-text-primary">{name}</h3>
            <p className="text-sm text-brand-text-secondary mt-1">{pricePerCredit}</p>
            <div className="my-6">
                <span className="text-4xl font-bold text-brand-text-primary">{credits}</span>
                <span className="text-brand-text-secondary"> credits</span>
            </div>
            <div className="flex-grow"></div>
            <button
                onClick={handlePurchase}
                className={`mt-8 w-full font-bold py-2.5 px-4 rounded-md transition-all ${
                    isFeatured 
                    ? 'bg-brand-accent text-white hover:opacity-90' 
                    : 'bg-brand-surface hover:bg-brand-border text-brand-text-primary border border-brand-border'
                }`}
            >
                Buy for ₹{price}
            </button>
        </div>
    )
};


export const PricingPage = ({ onOpenModal, onInitiatePurchase, onNavigate }: any) => {
  const { user } = useAuth();

  return (
    <main className="flex-grow flex flex-col items-center p-4 animate-fade-in">
      <div className="container mx-auto text-center py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-text-primary max-w-2xl mx-auto leading-tight">
          Find the plan that's right for you
        </h1>
        <p className="text-lg text-brand-text-secondary mt-4 max-w-xl mx-auto">
          Start for free and scale up as you grow. No hidden fees, transparent pricing.
        </p>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-stretch">
          {Object.values(Plan).map(plan => (
             <PricingCard
                key={plan}
                planDetails={PLAN_DETAILS[plan]}
                isCurrentUserPlan={user?.plan_id === plan.toLowerCase()}
                isLoggedIn={!!user}
                onOpenModal={onOpenModal}
                onInitiatePurchase={onInitiatePurchase}
                onNavigate={onNavigate}
             />
          ))}
        </div>
      </div>
      
      {user && (
          <div className="container mx-auto text-center pt-12 pb-16">
            <div className="w-full h-px bg-brand-border max-w-5xl mx-auto mb-12"></div>
            <h2 className="text-3xl font-serif font-bold text-brand-text-primary max-w-2xl mx-auto leading-tight">
              Need more credits?
            </h2>
            <p className="text-lg text-brand-text-secondary mt-4 max-w-xl mx-auto">
              Top up your account with a one-time credit purchase.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch mt-12">
              {CREDIT_PACK_DETAILS.map(pack => (
                  <CreditPackCard
                    key={pack.name}
                    pack={pack}
                    isLoggedIn={!!user}
                    onOpenModal={onOpenModal}
                    onInitiatePurchase={onInitiatePurchase}
                  />
              ))}
            </div>
          </div>
      )}
    </main>
  );
};

export default PricingPage;
