import React from 'react';

interface TextAreaInputProps {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({ placeholder, value, onChange }) => {
    return (
        <textarea
            rows={3}
            className="w-full bg-panel dark:bg-dark-panel border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary rounded-lg p-3 focus:ring-brand-accent focus:border-brand-accent resize-none"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        ></textarea>
    );
};