
import React, { useState, useRef } from 'react';
import type { Substyle } from '../constants';

interface StyleModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: string | null;
    substyles: Substyle[];
    onSubstyleSelect: (substyle: string) => void;
}

const StylePopover: React.FC<{ substyle: Substyle }> = ({ substyle }) => (
    <div className="flex flex-col text-left">
        <div className="flex items-center mb-2">
            <img src={substyle.imageUrl} alt={substyle.name} className="w-12 h-12 rounded-md object-cover mr-3" />
            <div>
                <h5 className="font-bold text-brand-text">{substyle.name}</h5>
                <p className="text-xs text-brand-text-secondary">{substyle.description}</p>
            </div>
        </div>
        {substyle.tags && substyle.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
                {substyle.tags.map(tag => (
                    <span key={tag} className="text-xs bg-brand-light-gray text-brand-text-secondary px-2 py-1 rounded-full">{tag}</span>
                ))}
            </div>
        )}
        <p className="text-xs text-brand-text-secondary/70 mt-3">Click to select style</p>
    </div>
);

export const StyleModal: React.FC<StyleModalProps> = ({ isOpen, onClose, category, substyles, onSubstyleSelect }) => {
    const [hoveredSubstyle, setHoveredSubstyle] = useState<{ substyle: Substyle; position: { top: number; left: number } } | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, substyle: Substyle) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoveredSubstyle({
            substyle,
            position: { top: rect.top - 10, left: rect.left - rect.width - 20 },
        });
    };

    const handleMouseLeave = () => {
        setHoveredSubstyle(null);
    };
    
    if (!isOpen || !category) {
        return null;
    }

    const popoverStyle = hoveredSubstyle ? {
        top: `${hoveredSubstyle.position.top}px`,
        left: `${hoveredSubstyle.position.left}px`,
        transform: 'translateY(-100%)',
    } : {};


    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={modalRef} 
                className="bg-brand-gray rounded-lg shadow-2xl p-6 w-full max-w-4xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-brand-text flex items-center gap-2">
                        <span className="text-2xl">{category.split(' ')[0]}</span>
                        {category.substring(category.indexOf(' ') + 1)} Styles
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-brand-text-secondary hover:text-brand-text text-2xl font-bold"
                        aria-label="Close style selector"
                    >
                        &times;
                    </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                    {substyles.map(substyle => (
                        <button
                            key={substyle.name}
                            onClick={() => onSubstyleSelect(substyle.name)}
                            onMouseEnter={(e) => handleMouseEnter(e, substyle)}
                            onMouseLeave={handleMouseLeave}
                            className="flex flex-col items-center justify-center gap-2 bg-brand-dark hover:bg-brand-light-gray p-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        >
                            <img src={substyle.imageUrl} alt={substyle.name} className="w-20 h-20 rounded-md object-cover" />
                            <span className="text-sm font-semibold text-brand-text text-center">{substyle.name}</span>
                        </button>
                    ))}
                </div>
                
                 {hoveredSubstyle && (
                    <div
                        style={popoverStyle}
                        className="fixed bg-brand-dark border border-brand-light-gray rounded-lg shadow-2xl p-4 w-64 z-[60] pointer-events-none animate-fade-in"
                    >
                       <StylePopover substyle={hoveredSubstyle.substyle} />
                    </div>
                )}
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-95%); }
                    to { opacity: 1; transform: translateY(-100%); }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
