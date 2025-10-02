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
        <div className="bg-panel-secondary dark:bg-dark-panel-secondary p-4 rounded-lg flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">Creative Direction</h4>
            <div className="border-2 border-border dark:border-dark-border p-3 rounded-lg">
                <span className="font-bold text-text-primary dark:text-dark-text-primary">Creative Concept</span>
                 <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
                    {creativeConcept}
                </p>
            </div>
            <div>
                 <span className="font-bold text-text-primary dark:text-dark-text-primary">{variations.length} Variation{variations.length > 1 ? 's' : ''}</span>
                 <ol className="list-decimal list-inside space-y-3 mt-2">
                    {variations.map((variation, index) => (
                        <li key={index} className="text-sm text-text-secondary dark:text-dark-text-secondary bg-panel dark:bg-dark-panel p-3 rounded-lg">
                           <span className="font-semibold text-text-primary dark:text-dark-text-primary">Variation #{index + 1}:</span> {variation}
                        </li>
                    ))}
                 </ol>
            </div>
        </div>
    );
};