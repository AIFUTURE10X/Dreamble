import React from 'react';

interface PromptDisplayProps {
    promptData: {
        creativeConcept: string;
        variations: string[];
    } | null;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ promptData }) => {
    if (!promptData) {
        return null;
    }

    const { creativeConcept, variations } = promptData;

    return (
        <div className="bg-brand-dark p-4 rounded-lg flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-brand-text">Creative Direction</h4>
            <div className="border-2 border-brand-light-gray p-3 rounded-lg">
                <span className="font-bold text-brand-text">Creative Concept</span>
                 <p className="text-sm text-brand-text-secondary mt-1">
                    {creativeConcept}
                </p>
            </div>
            <div>
                 <span className="font-bold text-brand-text">{variations.length} Variation{variations.length > 1 ? 's' : ''}</span>
                 <ol className="list-decimal list-inside space-y-3 mt-2">
                    {variations.map((variation, index) => (
                        <li key={index} className="text-sm text-brand-text-secondary bg-brand-light-gray p-3 rounded-lg">
                           <span className="font-semibold text-brand-text">Variation #{index + 1}:</span> {variation}
                        </li>
                    ))}
                 </ol>
            </div>
        </div>
    );
};