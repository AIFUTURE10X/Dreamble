import React, { useState } from 'react';

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

interface PreciseReferenceToggleProps {
    isChecked: boolean;
    onChange: (checked: boolean) => void;
}

export const PreciseReferenceToggle: React.FC<PreciseReferenceToggleProps> = ({ isChecked, onChange }) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    return (
        <div className="pt-4 border-t border-border dark:border-dark-border">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChange(!isChecked)}>
                    <span className="text-xl">🍌</span>
                    <span className="font-semibold text-sm text-text-primary dark:text-dark-text-primary tracking-wider">PRECISE REFERENCE</span>
                </div>
                <div className="flex items-center gap-3">
                     <div className="relative">
                        <button 
                            onMouseEnter={() => setIsTooltipVisible(true)}
                            onMouseLeave={() => setIsTooltipVisible(false)}
                            className="p-1 rounded-full border border-brand-accent text-brand-accent transition-colors"
                            aria-label="More information about Precise Reference"
                        >
                            <InfoIcon className="w-5 h-5" />
                        </button>
                        {isTooltipVisible && (
                            <div className="absolute bottom-full right-0 mb-2 w-72 bg-sky-500 p-4 rounded-lg shadow-lg z-10">
                                <p className="text-base text-white">
                                    <strong>Precise mode (On)</strong> uses your uploaded image directly for photorealistic integration.
                                </p>
                                <p className="text-base text-white mt-2">
                                    <strong>Creative mode (Off)</strong> interprets your image's style for more imaginative outputs.
                                </p>
                                <div className="absolute right-4 -bottom-2 w-4 h-4 bg-sky-500 transform rotate-45"></div>
                            </div>
                        )}
                    </div>
                    <button
                        id="precise-toggle"
                        onClick={() => onChange(!isChecked)}
                        className={`relative inline-flex items-center h-7 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-panel dark:focus:ring-offset-dark-panel focus:ring-brand-accent ${isChecked ? 'bg-brand-accent' : 'bg-panel-secondary dark:bg-dark-panel-secondary'}`}
                        role="switch"
                        aria-checked={isChecked}
                    >
                        <span
                            className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform ${isChecked ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};