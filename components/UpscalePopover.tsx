import React, { useState, useRef } from 'react';
import { UPSCALE_OPTIONS } from '../constants';

interface UpscalePopoverProps {
    children: React.ReactNode;
    onSelect: (level: string) => void;
    isUpscaling: boolean;
    popoverDirection?: 'top' | 'bottom';
}

export const UpscalePopover: React.FC<UpscalePopoverProps> = ({ children, onSelect, isUpscaling, popoverDirection = 'top' }) => {
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const leaveTimeout = useRef<number | null>(null);

    const handleMouseEnter = () => {
        if (leaveTimeout.current) {
            clearTimeout(leaveTimeout.current);
            leaveTimeout.current = null;
        }
        setIsPopoverVisible(true);
    };

    const handleMouseLeave = () => {
        leaveTimeout.current = window.setTimeout(() => {
            setIsPopoverVisible(false);
        }, 200); // Delay to allow moving mouse to popover
    };

    const handleOptionClick = (level: string) => {
        onSelect(level);
        setIsPopoverVisible(false); // Close after selection
    };

    const popoverClasses = popoverDirection === 'top'
        ? 'bottom-full mb-2'
        : 'top-full mt-2';

    return (
        <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {isPopoverVisible && (
                <div 
                    className={`absolute left-1/2 -translate-x-1/2 z-10 w-max bg-panel dark:bg-dark-panel p-2 rounded-lg shadow-lg border border-border dark:border-dark-border flex items-center gap-2 ${popoverClasses}`}
                    role="menu"
                    onClick={(e) => e.stopPropagation()}
                >
                    {isUpscaling ? (
                         <div className="flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 text-text-primary dark:text-dark-text-primary">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Upscaling...
                        </div>
                    ) : (
                        UPSCALE_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                onClick={() => handleOptionClick(option.value)}
                                className="text-sm font-semibold py-2 px-3 rounded-md bg-panel-secondary dark:bg-dark-panel-secondary hover:bg-border dark:hover:bg-dark-border text-text-primary dark:text-dark-text-primary transition-colors"
                                role="menuitem"
                            >
                                {option.label}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
