import React from 'react';
import { RefreshIcon } from './icons/RefreshIcon';
import { InfoIcon } from './icons/InfoIcon';

interface PreciseReferenceToggleProps {
    isChecked: boolean;
    onChange: (checked: boolean) => void;
}

export const PreciseReferenceToggle: React.FC<PreciseReferenceToggleProps> = ({ isChecked, onChange }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-2xl">🍌</span>
                <span className="font-bold text-sm text-text-primary dark:text-dark-text-primary tracking-wider">PRECISE REFERENCE</span>
                <button className="text-emerald-500 hover:text-emerald-400 transition-colors" title="Randomize (Not implemented)">
                    <RefreshIcon className="w-5 h-5" />
                </button>
                <div className="relative group">
                    <button className="text-sky-500 hover:text-sky-400 transition-colors" aria-label="More information">
                        <InfoIcon className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-sky-500 text-white text-sm rounded-lg p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <strong>Precise Mode (On):</strong> The subject from your uploaded image is kept consistent. Good for changing backgrounds.
                        <br/><br/>
                        <strong>Creative Mode (Off):</strong> The AI is inspired by your image but has more freedom to alter the subject. Good for new ideas.
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-sky-500 transform rotate-45"></div>
                    </div>
                </div>
            </div>
            
            <button
                id="precise-toggle"
                onClick={() => onChange(!isChecked)}
                className={`relative inline-flex items-center h-8 rounded-full w-14 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-settings-bg dark:focus:ring-offset-dark-settings-bg focus:ring-brand-yellow ${isChecked ? 'bg-brand-yellow' : 'bg-gray-400 dark:bg-gray-600'}`}
                role="switch"
                aria-checked={isChecked}
            >
                <span
                    className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform ${isChecked ? 'translate-x-7' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );
};
