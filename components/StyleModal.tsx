import React, { useState, useRef } from 'react';
import type { Substyle } from '../constants';
import { ImageWithFallback } from './ImageWithFallback';
import { StylePopover } from './StylePopover';

interface StyleModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: string | null;
    substyles: Substyle[];
    onSubstyleSelect: (substyle: string) => void;
}

const TOOLTIP_WIDTH = 288; // Corresponds to w-72 in Tailwind
const TOOLTIP_ESTIMATED_HEIGHT = 180; // An estimation for vertical collision check
const MARGIN = 10; // A small margin from viewport edges

export const StyleModal: React.FC<StyleModalProps> = ({ isOpen, onClose, category, substyles, onSubstyleSelect }) => {
    const [hoveredSubstyle, setHoveredSubstyle] = useState<{
        substyle: Substyle;
        position: { top: number; left: number };
        transform: string;
    } | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const closeTimeoutRef = useRef<number | null>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, substyle: Substyle) => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setIsClosing(false);

        const rect = e.currentTarget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        let top: number;
        let left: number;
        let transform: string;

        // --- HORIZONTAL POSITIONING ---
        // Set the anchor to the horizontal center of the card.
        left = rect.left + rect.width / 2;
        
        // Clamp the anchor point to prevent the tooltip from being pushed off-screen
        // by the translateX transform when near the edges.
        const halfWidth = TOOLTIP_WIDTH / 2;
        if (left - halfWidth < MARGIN) {
            left = MARGIN + halfWidth;
        } else if (left + halfWidth > viewportWidth - MARGIN) {
            left = viewportWidth - MARGIN - halfWidth;
        }
        
        // --- VERTICAL POSITIONING & TRANSFORM ---
        // Check if there is enough space above the card for the tooltip.
        if (rect.top - TOOLTIP_ESTIMATED_HEIGHT - MARGIN > 0) {
            // Position above the card.
            top = rect.top - MARGIN;
            transform = 'translate(-50%, -100%)';
        } else {
            // Not enough space, so position below the card.
            top = rect.bottom + MARGIN;
            transform = 'translateX(-50%)';
        }
        
        setHoveredSubstyle({
            substyle,
            position: { top, left },
            transform,
        });
    };
    
    const handleMouseLeave = () => {
        setIsClosing(true);
        closeTimeoutRef.current = window.setTimeout(() => {
            setHoveredSubstyle(null);
            setIsClosing(false);
        }, 200); // Corresponds to animation duration
    };
    
    if (!isOpen || !category) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-panel dark:bg-dark-panel rounded-lg shadow-2xl p-6 w-full max-w-4xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary flex items-center gap-2">
                        <span className="text-2xl">{category.split(' ')[0]}</span>
                        {category.substring(category.indexOf(' ') + 1)} Styles
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary text-2xl font-bold"
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
                            className="flex flex-col items-center justify-center gap-2 bg-panel-secondary dark:bg-dark-panel-secondary hover:bg-border dark:hover:bg-dark-border p-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-accent group"
                        >
                            <ImageWithFallback 
                                name={substyle.name}
                                className="w-20 h-20 rounded-md object-cover" 
                            />
                            <span className="text-sm font-semibold text-text-primary dark:text-dark-text-primary text-center">{substyle.name}</span>
                        </button>
                    ))}
                </div>
                
                 {hoveredSubstyle && (
                    <div
                        style={{
                            top: `${hoveredSubstyle.position.top}px`,
                            left: `${hoveredSubstyle.position.left}px`,
                            transform: hoveredSubstyle.transform
                        }}
                        className={`fixed bg-panel dark:bg-dark-panel border border-border dark:border-dark-border rounded-lg shadow-2xl p-4 w-72 z-[60] pointer-events-none ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
                    >
                       <StylePopover substyle={hoveredSubstyle.substyle} />
                    </div>
                )}
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; scale: 0.95; }
                    to { opacity: 1; scale: 1; }
                }
                @keyframes fade-out {
                    from { opacity: 1; scale: 1; }
                    to { opacity: 0; scale: 0.95; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
                .animate-fade-out {
                    animation: fade-out 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};