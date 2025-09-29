import React from 'react';
import { STYLE_TAXONOMY } from '../constants';

interface StyleSelectorProps {
    onCategoryClick: (category: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ onCategoryClick }) => {
    const categories = Object.keys(STYLE_TAXONOMY);

    return (
        <div>
            <p className="block text-sm font-medium text-brand-text-secondary mb-2">Or, select a style:</p>
            <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => onCategoryClick(category)}
                        className="bg-brand-dark hover:bg-brand-light-gray text-brand-text text-sm font-semibold py-2 px-3 rounded-lg transition duration-300 border border-brand-light-gray"
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};
