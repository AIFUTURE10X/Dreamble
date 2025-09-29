
import React from 'react';

interface SelectInputProps {
    label: string;
    options: string[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, options, value, onChange }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">{label}</label>
            <select
                value={value}
                onChange={onChange}
                className="w-full bg-brand-dark border border-brand-light-gray text-brand-text rounded-lg p-3 focus:ring-brand-accent focus:border-brand-accent"
            >
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};
