import React from 'react';

interface StyleModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: string | null;
    substyles: string[];
    onSubstyleSelect: (substyle: string) => void;
}

export const StyleModal: React.FC<StyleModalProps> = ({ isOpen, onClose, category, substyles, onSubstyleSelect }) => {
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
                className="bg-brand-gray rounded-lg shadow-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-brand-text">{category}</h3>
                    <button
                        onClick={onClose}
                        className="text-brand-text-secondary hover:text-brand-text text-2xl font-bold"
                        aria-label="Close style selector"
                    >
                        &times;
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {substyles.map(substyle => (
                        <button
                            key={substyle}
                            onClick={() => onSubstyleSelect(substyle)}
                            className="w-full bg-brand-dark hover:bg-brand-light-gray text-brand-text font-semibold py-3 px-4 rounded-lg transition duration-300 text-center"
                        >
                            {substyle}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
