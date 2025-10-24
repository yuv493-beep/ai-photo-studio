import React from 'react';
import { EditType, EDIT_TYPE_DETAILS, ImageCountOption, IMAGE_COUNT_DETAILS, Plan } from './types';

interface ControlsPanelProps {
  editType: EditType;
  setEditType: (type: EditType) => void;
  imageCount: ImageCountOption;
  setImageCount: (count: ImageCountOption) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  includeModel: boolean;
  setIncludeModel: (include: boolean) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isImageUploaded: boolean;
  onIdeate: () => void;
  isIdeating: boolean;
  hasConcept: boolean;
  disabled?: boolean;
  creditsNeeded: number;
  hasEnoughCredits: boolean;
  userPlan: Plan | string | undefined;
  onNavigateToPricing: () => void;
  isVerified: boolean;
}

const ControlSection: React.FC<{ step: number; title: string; children: React.ReactNode }> = ({ step, title, children }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-3">
      <span className="bg-brand-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{step}</span>
      <h3 className="text-md font-semibold text-brand-text-primary">{title}</h3>
    </div>
    {children}
  </div>
);

const SegmentedControl = <T extends string>({ options, selected, onSelect, disabled: globalDisabled }: { options: { value: T, label: string, disabled?: boolean }[], selected: T, onSelect: (option: T) => void, disabled?: boolean }) => {
    const selectedIndex = options.findIndex(opt => opt.value === selected);

    return (
        <div className="relative flex w-full bg-brand-bg p-1 rounded-lg border border-brand-border">
            <div
                className="absolute top-1 bottom-1 bg-brand-accent rounded-md shadow-sm transition-transform duration-300 ease-in-out"
                style={{
                    width: `calc(${100 / options.length}% - 4px)`,
                    transform: `translateX(calc(${selectedIndex >= 0 ? selectedIndex * 100 : 0}%))`,
                    left: '2px',
                    opacity: selectedIndex >= 0 ? 1 : 0,
                }}
            ></div>
            
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onSelect(option.value)}
                    disabled={globalDisabled || option.disabled}
                    className={`relative z-10 flex-1 py-1.5 text-xs font-bold transition-colors duration-300 rounded-md ${
                        selected === option.value ? 'text-white' : 'text-brand-text-secondary hover:text-brand-text-primary'
                    } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={option.disabled ? "Upgrade to a paid plan to use this style" : ""}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

const ToggleSwitch: React.FC<{ enabled: boolean, setEnabled: (enabled: boolean) => void, disabled: boolean }> = ({ enabled, setEnabled, disabled }) => {
    return (
        <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-surface disabled:cursor-not-allowed ${
                enabled ? 'bg-brand-accent' : 'bg-brand-border'
            }`}
            role="switch"
            aria-checked={enabled}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
        </button>
    );
};

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  editType,
  setEditType,
  imageCount,
  setImageCount,
  customPrompt,
  setCustomPrompt,
  includeModel,
  setIncludeModel,
  onGenerate,
  isLoading,
  isImageUploaded,
  onIdeate,
  isIdeating,
  hasConcept,
  disabled = false,
  creditsNeeded,
  hasEnoughCredits,
  userPlan,
  onNavigateToPricing,
  isVerified
}) => {
  const isBusy = isLoading || isIdeating;
  const buttonText = hasConcept ? `Generate ${creditsNeeded} Images` : 'Generate Concept';
  const buttonIcon = hasConcept ? '🚀' : '✨';
  const handleClick = hasConcept ? onGenerate : onIdeate;

  const isStarterPlan = userPlan === 'starter' || userPlan === Plan.Starter;

  const editTypeOptions = Object.values(EditType).map(type => ({
    value: type,
    label: EDIT_TYPE_DETAILS[type].title,
    disabled: isStarterPlan && type !== EditType.Ecommerce
  }));

  const imageCountOptions = Object.values(ImageCountOption).map(option => ({
      value: option,
      label: option
  }));

  return (
    <div className={`bg-brand-surface rounded-lg p-4 border border-brand-border flex flex-col gap-4 ${disabled ? 'opacity-50' : ''}`}>
      <ControlSection step={2} title="Choose Image Style">
        <SegmentedControl
            options={editTypeOptions}
            selected={editType}
            onSelect={setEditType}
            disabled={disabled}
        />
        {isStarterPlan ? (
             <p className="text-xs text-brand-text-secondary text-center mt-1 h-8 px-2 flex items-center justify-center">
                <button onClick={onNavigateToPricing} className="text-brand-accent font-semibold hover:underline">Upgrade to Pro</button>&nbsp;to unlock more styles.
            </p>
        ) : (
            <p className="text-xs text-brand-text-secondary text-center mt-1 h-8 px-2">
                {EDIT_TYPE_DETAILS[editType].description}
            </p>
        )}
      </ControlSection>
      
      <ControlSection step={3} title="Select Image Count">
        <SegmentedControl
            options={imageCountOptions}
            selected={imageCount}
            onSelect={setImageCount}
            disabled={disabled}
        />
        <p className="text-xs text-brand-text-secondary text-center mt-1 h-4">
            {IMAGE_COUNT_DETAILS[imageCount].count}
        </p>
      </ControlSection>

      <ControlSection step={4} title="Include a Model?">
        <div className="flex items-center justify-between bg-brand-bg p-2 rounded-lg border border-brand-border">
            <div>
                 <p className="font-semibold text-sm text-brand-text-primary">
                    {includeModel ? "With AI Model" : "Without Model"}
                </p>
                <p className="text-xs text-brand-text-secondary">
                    {includeModel ? "Shows product with a person" : "Product only shots"}
                </p>
            </div>
            <ToggleSwitch enabled={includeModel} setEnabled={setIncludeModel} disabled={disabled} />
        </div>
      </ControlSection>

      <ControlSection step={5} title="Custom Instructions (Optional)">
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="e.g., add a marble podium, summer theme..."
          className="w-full p-2 text-sm rounded-md border border-brand-border focus:ring-1 focus:ring-brand-accent focus:outline-none transition bg-brand-bg"
          rows={2}
          disabled={disabled}
        />
      </ControlSection>

      <div className="mt-2">
        <button
          onClick={handleClick}
          disabled={isBusy || !isImageUploaded || disabled || !isVerified}
          className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-all transform-gpu disabled:bg-brand-text-secondary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-md"
        >
          {isBusy ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isIdeating ? 'Generating Concept...' : 'Generating Images...'}
            </>
          ) : (
            <>
              <span>{buttonIcon}</span>
              <span>{buttonText}</span>
            </>
          )}
        </button>
        {!isImageUploaded && !isBusy && !disabled && <p className="text-center text-xs text-red-500 mt-2">Please upload an image to begin.</p>}
        {isImageUploaded && !isVerified && !disabled && (
             <div className="text-center text-xs text-amber-700 dark:text-amber-400 mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-md">
                <p>
                    Please verify your email to generate images.
                </p>
            </div>
        )}
        {isImageUploaded && isVerified && !hasEnoughCredits && !isBusy && !disabled && (
            <div className="text-center text-xs text-amber-700 dark:text-amber-400 mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-md">
                <p>
                    Not enough credits. Please <button onClick={onNavigateToPricing} className="font-semibold underline hover:text-amber-600 dark:hover:text-amber-300">purchase a credit pack</button> to continue.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};
