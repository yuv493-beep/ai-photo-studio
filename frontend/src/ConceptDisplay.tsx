import React from 'react';

interface ConceptDisplayProps {
  concept: {
    theme: string;
    shots: string[];
  };
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const ConceptDisplay = ({ concept, onRegenerate, isRegenerating }: any) => {
  return (
    <div className="w-full max-w-3xl animate-fade-in p-6 text-center">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-accent">Creative Concept</h3>
      <p className="font-serif text-3xl md:text-4xl font-bold text-brand-text-primary mt-2">"{concept.theme}"</p>

      <div className="mt-6 text-left border border-brand-border rounded-lg bg-brand-bg">
        <div className="p-4 border-b border-brand-border">
            <h4 className="font-semibold text-brand-text-primary">Proposed Shot List:</h4>
        </div>
        <ul className="divide-y divide-brand-border max-h-64 overflow-y-auto">
          {concept.shots.map((shot, index) => (
            <li key={index} className="p-4 text-sm text-brand-text-secondary">
              <span className="font-semibold text-brand-text-primary mr-2">{index + 1}.</span>
              {shot}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
        <button 
            onClick={onRegenerate} 
            disabled={isRegenerating}
            className="flex items-center justify-center gap-2 text-sm font-semibold bg-brand-surface hover:bg-brand-border text-brand-text-primary px-4 py-2 rounded-md transition-colors disabled:opacity-50"
        >
             {isRegenerating ? 'Ideating...' : 'Regenerate Concept'}
        </button>
        <p className="text-xs text-brand-text-secondary sm:hidden py-1">or</p>
        <p className="text-sm font-bold text-brand-text-primary flex items-center justify-center">
            Looks good? Now click "Generate Images" in the panel.
        </p>
      </div>
    </div>
  );
};
