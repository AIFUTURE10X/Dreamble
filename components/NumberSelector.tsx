import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface NumberSelectorProps {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

export const NumberSelector: React.FC<NumberSelectorProps> = ({ label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full bg-white dark:bg-dark-panel border border-gray-300 dark:border-gray-600 rounded-lg h-[56px] flex items-center justify-between px-4 text-left"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <div>
                    <span className="block text-xs font-medium text-text-secondary dark:text-dark-text-secondary">{label}</span>
                    <span className="text-base font-medium text-text-primary dark:text-dark-text-primary">{value}</span>
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-text-secondary dark:text-dark-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-10 top-full mt-1 w-full bg-white dark:bg-dark-panel border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
                    <ul role="listbox">
                        {options.map(option => (
                            <li 
                                key={option} 
                                onClick={() => handleSelect(option)}
                                className={`px-4 py-3 cursor-pointer text-text-primary dark:text-dark-text-primary text-base font-medium ${value === option ? 'bg-panel-secondary dark:bg-dark-panel-secondary' : 'hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary'}`}
                                role="option"
                                aria-selected={value === option}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
