import React, { useState, lazy, Suspense, useCallback, useEffect } from 'react';
import { Header } from './Header';
import type { ModalType } from './Header';
import { Footer } from './Footer';
import { Loader } from './Loader';
import { useAuth } from './AuthContext';
import { CreditPack } from './types';
import { Plan, PLAN_DETAILS } from './types';

// --- Lazy Load Pages for Performance ---
const HomePage = lazy(() => import('./HomePage'));
const StudioPage = lazy(() => import('./StudioPage'));
const PricingPage = lazy(() => import('./PricingPage'));
const FeaturesPage = lazy(() => import('./FeaturesPage'));
const ContactPage = lazy(() => import('./ContactPage'));
const AccountPage = lazy(() => import('./AccountPage'));
const HistoryPage = lazy(() => import('./HistoryPage'));
const TermsPage = lazy(() => import('./TermsPage'));
const PrivacyPage = lazy(() => import('./PrivacyPage'));
const PaymentPage = lazy(() => import('./PaymentPage').then(module => ({ default: module.PaymentPage })));
const PaymentSuccessPage = lazy(() => import('./PaymentPage').then(module => ({ default: module.PaymentSuccessPage })));
const PaymentFailurePage = lazy(() => import('./PaymentPage').then(module => ({ default: module.PaymentFailurePage })));
const DashboardPage = lazy(() => import('./DashboardPage'));
const EmailVerifiedPage = lazy(() => import('./EmailVerifiedPage'));
const EmailVerificationFailedPage = lazy(() => import('./EmailVerificationFailedPage'));

// --- Lazy Load Modals & Banners ---
const LoginModal = lazy(() => import('./LoginModal'));
const SignupModal = lazy(() => import('./SignupModal'));
const ForgotPasswordModal = lazy(() => import('./ForgotPasswordModal'));
const VerificationBanner = lazy(() => import('./VerificationBanner'));

export type Page = 'home' | 'studio' | 'pricing' | 'features' | 'contact' | 'account' | 'history' | 'terms' | 'privacy' | 'payment' | 'payment-success' | 'payment-failure' | 'dashboard' | 'email-verified' | 'email-verification-failed';

export type PaymentDetails = { type: 'plan' | 'credits', details: typeof PLAN_DETAILS[Plan] | CreditPack };

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { user, isLoading } = useAuth();
  
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [redirectToStudioAfterLogin, setRedirectToStudioAfterLogin] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  const openModal = (type: ModalType) => setActiveModal(type);
  const closeModal = () => {
    setActiveModal(null);
    setRedirectToStudioAfterLogin(false);
  }
  
  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.history.pushState(null, '', `/${page}`);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
        const path = window.location.pathname.substring(1) as Page;
        if (path) {
            setCurrentPage(path || 'home');
        }
    };
    const path = window.location.pathname.substring(1) as Page;
    if (path) {
        setCurrentPage(path);
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLaunchStudio = () => {
    if (user) {
      navigate('studio');
    } else {
      setRedirectToStudioAfterLogin(true);
      openModal('login');
    }
  };

  const handleLoginSuccess = () => {
    setActiveModal(null);
    if (redirectToStudioAfterLogin) {
        navigate('studio');
    } else {
        navigate('dashboard');
    }
    setRedirectToStudioAfterLogin(false);
  };

  useEffect(() => {
    // This effect handles the navigation after a successful Firebase login,
    // which is detected by the change in the `user` object from the AuthContext.
    if (user && activeModal) {
      handleLoginSuccess();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeModal]);

  const handleInitiatePurchase = (details: PaymentDetails) => {
    setPaymentDetails(details);
    navigate('payment');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={navigate} />;
      case 'studio':
        return <StudioPage onNavigate={navigate} />;
      case 'pricing':
        return <PricingPage onOpenModal={openModal} onInitiatePurchase={handleInitiatePurchase} onNavigate={navigate} />;
      case 'features':
        return <FeaturesPage onLaunchStudio={handleLaunchStudio} />;
      case 'contact':
        return <ContactPage />;
      case 'account':
        return <AccountPage onNavigateToPricing={() => navigate('pricing')} />;
      case 'history':
        return <HistoryPage />;
      case 'terms':
        return <TermsPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'payment':
        return <PaymentPage paymentDetails={paymentDetails} onNavigate={navigate} />;
      case 'payment-success':
        return <PaymentSuccessPage onNavigate={navigate} />;
      case 'payment-failure':
        return <PaymentFailurePage onNavigate={navigate} />;
      case 'email-verified':
        return <EmailVerifiedPage onNavigate={navigate} />;
      case 'email-verification-failed':
        return <EmailVerificationFailedPage onNavigate={navigate} />;
      case 'home':
      default:
        return <HomePage onLaunchStudio={handleLaunchStudio} onNavigateToPricing={() => navigate('pricing')} />;
    }
  };
  
  const PageLoader: React.FC = () => (
    <div className="flex-grow flex items-center justify-center">
      <Loader />
    </div>
  );

  return (
    <div className="bg-brand-bg text-brand-text-primary font-sans min-h-screen flex flex-col">
      <Header 
        currentPage={currentPage}
        onNavigate={navigate}
        onOpenModal={openModal}
      />
      {!isLoading && user && !user.is_verified && (
        <Suspense fallback={null}>
            <VerificationBanner />
        </Suspense>
      )}
      <Suspense fallback={<PageLoader />}>
        {renderCurrentPage()}
        
        {activeModal === 'login' && (
          <LoginModal
            onClose={closeModal}
            onSwitchToSignup={() => setActiveModal('signup')}
            onForgotPassword={() => setActiveModal('forgot-password')}
          />
        )}
        {activeModal === 'signup' && (
          <SignupModal
            onClose={closeModal}
            onSwitchToLogin={() => setActiveModal('login')}
          />
        )}
        {activeModal === 'forgot-password' && (
          <ForgotPasswordModal
              onClose={closeModal}
              onSwitchToLogin={() => setActiveModal('login')}
          />
        )}
      </Suspense>
      {currentPage !== 'studio' && <Footer onNavigate={navigate} />}
    </div>
  );
};

export default App;
