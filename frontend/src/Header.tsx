import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Page } from './App';

export type ModalType = 'login' | 'signup' | 'forgot-password' | 'reset-password' | null;

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenModal: (type: ModalType) => void;
}

const UserIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CreationsIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const BuyCreditsIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /> </svg>;
const LogoutIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;


export const Header = ({ currentPage, onNavigate, onOpenModal }: any) => {
  const { user, logout, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const NavLink: React.FC<{ page: Page, children: React.ReactNode}> = ({ page, children }) => (
      <button 
        onClick={() => onNavigate(page)} 
        className={`text-sm font-medium transition-colors relative ${currentPage === page ? 'text-brand-text-primary' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}
      >
        {children}
        {currentPage === page && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 bg-brand-accent rounded-full"></span>}
      </button>
  );

  const DropdownItem: React.FC<{ page: Page, icon: React.ReactNode, label: string }> = ({ page, icon, label }) => (
    <button 
      onClick={() => { onNavigate(page); setIsDropdownOpen(false); }} 
      className="w-full text-left px-4 py-2 text-sm text-brand-text-primary hover:bg-brand-border flex items-center gap-3"
    >
      {icon} {label}
    </button>
  );

  const DropdownAction: React.FC<{ onClick: () => void, icon: React.ReactNode, label: string, className?: string }> = ({ onClick, icon, label, className = '' }) => (
    <button 
      onClick={onClick} 
      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 ${className}`}
    >
      {icon} {label}
    </button>
  );

  const renderAuthSection = () => {
    if (isLoading) {
      return <div className="h-9 w-32 bg-brand-surface rounded-md animate-pulse"></div>;
    }

    if (user) {
      return (
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-brand-surface transition-colors">
            <div className="w-7 h-7 bg-brand-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-brand-text-primary">{user.name}</p>
              <p className="text-xs text-brand-text-secondary">{user.credits} credits left</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-brand-text-secondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-brand-surface rounded-md shadow-lg border border-brand-border z-20 animate-fade-in py-1">
              <DropdownItem page="account" icon={<UserIcon />} label="My Account" />
              <DropdownItem page="history" icon={<CreationsIcon />} label="My Creations" />
              <DropdownItem page="pricing" icon={<BuyCreditsIcon />} label="Buy Credits" />
              <div className="my-1 h-px bg-brand-border"></div>
              <DropdownAction 
                onClick={async () => { 
                  await logout(); 
                  setIsDropdownOpen(false); 
                  onNavigate('home'); 
                }} 
                icon={<LogoutIcon />} 
                label="Log Out" 
                className="text-red-500 hover:bg-red-500/10"
              />
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onOpenModal('login')}
          className="text-sm font-semibold text-brand-text-primary px-3 py-1.5 rounded-md hover:bg-brand-surface transition-colors"
        >
          Log In
        </button>
        <button
          onClick={() => onOpenModal('signup')}
          className="text-sm font-semibold bg-brand-accent text-white px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
        >
          Sign Up
        </button>
      </div>
    );
  };

  return (
    <header className="flex-shrink-0 bg-brand-bg/80 backdrop-blur-sm border-b border-brand-border sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <button onClick={() => onNavigate(user ? 'dashboard' : 'home')} className="flex items-center gap-1 font-serif cursor-pointer">
            <svg
              viewBox="0 0 28 28"
              className="h-7 w-7 text-brand-text-primary"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text x="0" y="23.5" fontFamily="'Playfair Display', serif" fontSize="26" fontWeight="700">S</text>
            </svg>
            <span className="text-xl font-bold text-brand-text-primary font-serif">Studio</span>
          </button>
          <nav className="hidden md:flex items-center gap-6">
             {!isLoading && (
                user ? (
                  <>
                    <NavLink page="dashboard">Dashboard</NavLink>
                    <NavLink page="studio">Studio</NavLink>
                  </>
                ) : (
                  <>
                    <NavLink page="features">Features</NavLink>
                    <NavLink page="pricing">Pricing</NavLink>
                    <NavLink page="contact">Contact</NavLink>
                  </>
                )
             )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {renderAuthSection()}
        </div>
      </div>
    </header>
  );
};
