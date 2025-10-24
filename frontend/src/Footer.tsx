import React from 'react';
import { Page } from './App';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer = ({ onNavigate }: any) => {
  return (
    <footer className="bg-brand-surface border-t border-brand-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm text-brand-text-secondary">
            &copy; {new Date().getFullYear()} AI Product Photo Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button onClick={() => onNavigate('terms')} className="text-sm text-brand-text-secondary hover:text-brand-text-primary">Terms</button>
            <button onClick={() => onNavigate('privacy')} className="text-sm text-brand-text-secondary hover:text-brand-text-primary">Privacy</button>
            <button onClick={() => onNavigate('contact')} className="text-sm text-brand-text-secondary hover:text-brand-text-primary">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
