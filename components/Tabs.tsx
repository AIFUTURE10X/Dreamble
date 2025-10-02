import React, { useState } from 'react';

interface Tab {
    id: string;
    label: React.ReactNode;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

    return (
        <div>
            <div className="border-b border-border dark:border-dark-border mb-6">
                <nav className="-mb-px flex space-x-4 sm:space-x-6" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm sm:text-base
                                transition-colors duration-200 ease-in-out flex items-center gap-2
                                ${
                                    activeTab === tab.id
                                        ? 'border-brand-accent text-text-primary dark:text-dark-text-primary'
                                        : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:border-border dark:hover:border-dark-border'
                                }
                            `}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div>
                {activeContent}
            </div>
        </div>
    );
};