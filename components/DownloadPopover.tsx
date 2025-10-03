import React, { useState, useRef } from 'react';

interface DownloadPopoverProps {
    children: React.ReactNode;
    onSelect: (type: 'with-details' | 'image-only') => void;
    popoverDirection?: 'top' | 'bottom';
}

export const DownloadPopover: React.FC<DownloadPopoverProps> = ({ children, onSelect, popoverDirection = 'top' }) => {
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

    const handleOptionClick = (type: 'with-details' | 'image-only') => {
        onSelect(type);
        setIsPopoverVisible(false); // Close after selection
    };

    const popoverClasses = popoverDirection === 'top'
        ? 'bottom-full mb-2'
        : 'top-full mt-2';
    
    const downloadOptions = [
        { type: 'with-details' as const, label: 'Save with Details' },
        { type: 'image-only' as const, label: 'Save Image Only' }
    ];

    return (
        <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {isPopoverVisible && (
                <div 
                    className={`absolute left-1/2 -translate-x-1/2 z-10 w-max bg-panel dark:bg-dark-panel p-2 rounded-lg shadow-lg border border-border dark:border-dark-border flex flex-col items-stretch gap-2 ${popoverClasses}`}
                    role="menu"
                    onClick={(e) => e.stopPropagation()}
                >
                   {downloadOptions.map(option => (
                        <button
                            key={option.type}
                            onClick={() => handleOptionClick(option.type)}
                            className="text-sm font-semibold py-2 px-3 rounded-md bg-panel-secondary dark:bg-dark-panel-secondary hover:bg-border dark:hover:bg-dark-border text-text-primary dark:text-dark-text-primary transition-colors text-left"
                            role="menuitem"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
