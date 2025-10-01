
import React, { useState, useMemo } from 'react';
import { STYLE_TAXONOMY } from '../constants';

interface StyleSelectorProps {
    onCategoryClick: (category: string) => void;
    onSubstyleSelect: (substyle: string) => void;
}

const styles = Object.keys(STYLE_TAXONOMY);

export const StyleSelector: React.FC<StyleSelectorProps> = ({ onCategoryClick, onSubstyleSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const allSubstylesWithCategory = useMemo(() => {
        return Object.entries(STYLE_TAXONOMY).flatMap(([category, substyles]) => 
            substyles.map(substyle => ({ ...substyle, category }))
        );
    }, []);

    const filteredSubstyles = useMemo(() => {
        if (!searchTerm.trim()) {
            return [];
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return allSubstylesWithCategory.filter(substyle => 
            substyle.name.toLowerCase().includes(lowercasedTerm) ||
            substyle.description.toLowerCase().includes(lowercasedTerm) ||
            (substyle.tags && substyle.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm)))
        );
    }, [allSubstylesWithCategory, searchTerm]);

    const handleSelect = (name: string) => {
        onSubstyleSelect(name);
        setSearchTerm(''); // Clear search after selection
    };

    return (
        <div>
            <div className="mb-2 relative">
                <label htmlFor="style-search" className="block text-sm font-medium text-brand-text-secondary mb-2">
                    Or, select a style (or search all styles below):
                </label>
                <input
                    id="style-search"
                    type="text"
                    placeholder="Search all 100+ styles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light-gray text-brand-text rounded-lg p-3 pl-10 focus:ring-brand-accent focus:border-brand-accent"
                    aria-label="Search all styles"
                />
                <div className="absolute inset-y-0 top-7 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-brand-text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
            </div>
            
            {searchTerm.trim() === '' ? (
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
            ) : (
                <div className="bg-brand-dark p-2 rounded-lg max-h-60 overflow-y-auto">
                    {filteredSubstyles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {filteredSubstyles.map(substyle => (
                                <button
                                    key={substyle.name}
                                    onClick={() => handleSelect(substyle.name)}
                                    className="flex items-center gap-3 bg-brand-dark hover:bg-brand-light-gray p-2 rounded-lg transition-all duration-300 w-full text-left"
                                >
                                    <img src={substyle.imageUrl} alt={substyle.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                                    <div className="flex-grow">
                                        <span className="text-sm font-semibold text-brand-text">{substyle.name}</span>
                                        <p className="text-xs text-brand-text-secondary">{substyle.category}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-brand-text-secondary">
                            <p className="font-semibold">No styles found for "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
