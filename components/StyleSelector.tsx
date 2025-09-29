import React from 'react';
import { STYLE_TAXONOMY } from '../constants';

interface StyleSelectorProps {
    onCategoryClick: (category: string) => void;
}

const styles = Object.keys(STYLE_TAXONOMY);

export const StyleSelector: React.FC<StyleSelectorProps> = ({ onCategoryClick }) => {
    return (
        <div>
            <p className="block text-sm font-medium text-brand-text-secondary mb-2">Or, select a style:</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {styles.map(style => {
                    const className = "bg-brand-dark hover:bg-brand-light-gray text-brand-text text-sm font-semibold py-2 px-3 rounded-lg transition duration-300 border border-brand-light-gray w-full text-center";

                    return (
                        <button
                            key={style}
                            onClick={() => onCategoryClick(style)}
                            className={className}
                        >
                            {style}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
