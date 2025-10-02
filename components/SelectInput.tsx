import React from 'react';

type OptionObject = { value: string; label: string };
type OptionGroup = { group: string; options: OptionObject[] };
type Option = string | OptionObject;
type Options = Option[] | OptionGroup[];

interface SelectInputProps {
    label: string;
    options: Options;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    isSimple?: boolean; // Flag to handle simple string arrays
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, options, value, onChange, isSimple = false }) => {
    const isGrouped = !isSimple && options.length > 0 && typeof options[0] === 'object' && options[0] !== null && 'group' in options[0];
    const id = `select-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div className="relative h-full">
            <label htmlFor={id} className="absolute top-2 left-3 text-xs text-brand-accent font-semibold pointer-events-none">{label}</label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className="w-full h-full bg-panel dark:bg-dark-panel border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary rounded-lg pt-5 pb-2 px-3 focus:ring-brand-accent focus:border-brand-accent appearance-none text-base"
            >
                {isGrouped ? (
                    (options as OptionGroup[]).map(group => (
                        <optgroup key={group.group} label={group.group}>
                            {group.options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </optgroup>
                    ))
                ) : (
                    (options as Option[]).map((option) => {
                        if (isSimple || typeof option === 'string') {
                            return <option key={option as string} value={option as string}>{option as string}</option>;
                        }
                        const opt = option as OptionObject;
                        return <option key={opt.value} value={opt.value}>{opt.label}</option>;
                    })
                )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-4 h-4 text-text-secondary dark:text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};