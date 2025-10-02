import React from 'react';

// SVG Icons
const LockClosedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

const LockOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 10.5V6.75a1.5 1.5 0 0 1 3 0v3.75" />
    </svg>
);


interface SeedControlProps {
    seed: string;
    onSeedChange: (value: string) => void;
    isLocked: boolean;
    onLockToggle: () => void;
}

export const SeedControl: React.FC<SeedControlProps> = ({ seed, onSeedChange, isLocked, onLockToggle }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Allow only numbers or an empty string
        if (val === '' || /^\d+$/.test(val)) {
            onSeedChange(val);
        }
    };

    return (
        <div className="relative h-full">
             <label htmlFor="seed-input" className="absolute top-2 left-3 text-xs text-brand-accent font-semibold pointer-events-none">Seed</label>
             <input
                id="seed-input"
                type="text"
                pattern="\d*"
                value={isLocked ? seed : ''}
                onChange={handleChange}
                placeholder="Random"
                disabled={!isLocked}
                className="w-full h-full bg-panel dark:bg-dark-panel border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary rounded-lg pt-5 pb-2 px-3 focus:ring-brand-accent focus:border-brand-accent appearance-none text-base disabled:text-text-secondary dark:disabled:text-dark-text-secondary"
            />
            <button
                onClick={onLockToggle}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
                aria-label={isLocked ? "Unlock seed" : "Lock seed"}
                title={isLocked ? "Unlock seed" : "Lock seed"}
            >
                {isLocked ? <LockClosedIcon className="w-5 h-5" /> : <LockOpenIcon className="w-5 h-5" />}
            </button>
        </div>
    );
};
