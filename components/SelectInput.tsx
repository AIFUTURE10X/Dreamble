import React from 'react';

type OptionObject = { value: string; label: string };
type Option = string | OptionObject;

interface SelectInputProps {
    label: string;
    options: Option[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    isSimple?: boolean; // Flag to handle simple string arrays
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, options, value, onChange, isSimple = false }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">{label}</label>
            <select
                value={value}
                onChange={onChange}
                className="w-full bg-brand-dark border border-brand-light-gray text-brand-text rounded-lg p-3 focus:ring-brand-accent focus:border-brand-accent"
            >
                {options.map((option) => {
                    if (isSimple || typeof option === 'string') {
                        return <option key={option as string} value={option as string}>{option as string}</option>;
                    }
                    const opt = option as OptionObject;
                    return <option key={opt.value} value={opt.value}>{opt.label}</option>;
                })}
            </select>
        </div>
    );
};
