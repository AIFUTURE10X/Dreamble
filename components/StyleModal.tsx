import React, { useState, useEffect } from 'react';

interface Substyle {
    name: string;
    description: string;
    imageUrl: string;
}

interface StyleModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: string | null;
    substyles: Substyle[];
    onSubstyleSelect: (substyle: string) => void;
}

export const StyleModal: React.FC<StyleModalProps> = ({ isOpen, onClose, category, substyles, onSubstyleSelect }) => {
    const [hoveredSubstyle, setHoveredSubstyle] = useState<Substyle | null>(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        // When the modal opens or the category changes, set the initial hovered substyle to the first in the list
        if (isOpen && substyles.length > 0) {
            setHoveredSubstyle(substyles[0]);
            setImageError(false);
        } else {
            setHoveredSubstyle(null);
        }
    }, [isOpen, category, substyles]);
    
    const handleMouseEnter = (substyle: Substyle) => {
        if (hoveredSubstyle?.name !== substyle.name) {
            setHoveredSubstyle(substyle);
            setImageError(false); // Reset error on new hover
        }
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
                className="bg-brand-gray rounded-lg shadow-2xl p-6 w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-brand-text">{category}</h3>
                    <button
                        onClick={onClose}
                        className="text-brand-text-secondary hover:text-brand-text text-2xl font-bold"
                        aria-label="Close style selector"
                    >
                        &times;
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                        {substyles.map(substyle => (
                            <div 
                                key={substyle.name}
                                onMouseEnter={() => handleMouseEnter(substyle)}
                            >
                                <button
                                    onClick={() => onSubstyleSelect(substyle.name)}
                                    className="w-full bg-brand-dark hover:bg-brand-light-gray text-brand-text font-semibold py-3 px-4 rounded-lg transition duration-300 text-center"
                                >
                                    {substyle.name}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:flex flex-col items-center justify-center bg-brand-dark rounded-lg p-4 text-center min-h-[300px]">
                        {hoveredSubstyle ? (
                            <div>
                                {imageError ? (
                                    <div className="w-48 h-48 bg-brand-dark flex items-center justify-center rounded-lg mb-4 mx-auto text-xs text-brand-text-secondary p-2">
                                        Image preview could not be loaded.
                                    </div>
                                ) : (
                                    <img 
                                        src={hoveredSubstyle.imageUrl} 
                                        alt={`${hoveredSubstyle.name} preview`}
                                        className="w-48 h-48 object-cover rounded-lg mb-4 mx-auto" 
                                        onError={() => setImageError(true)}
                                    />
                                )}
                                <h4 className="text-lg font-bold text-brand-text">{hoveredSubstyle.name}</h4>
                                <p className="text-sm text-brand-text-secondary mt-1">{hoveredSubstyle.description}</p>
                            </div>
                        ) : (
                            <div className="text-brand-text-secondary">
                                <p className="text-lg">Hover over a style to see a preview.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};