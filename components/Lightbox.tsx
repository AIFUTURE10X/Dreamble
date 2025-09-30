import React, { useState } from 'react';
import type { HistoryItem } from '../types';

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);


interface LightboxProps {
    item: HistoryItem;
    onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ item, onClose }) => {
    const [isCopied, setIsCopied] = useState(false);

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleCopyPrompt = () => {
        if (item.prompt) {
            navigator.clipboard.writeText(item.prompt).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div className="relative max-w-full max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                <div className="flex-shrink-0">
                    <img src={item.image} alt="Generated scene in full resolution" className="max-w-full max-h-[80vh] object-contain rounded-t-lg shadow-2xl" />
                </div>
                
                {item.prompt && (
                    <div className="bg-brand-dark p-3 rounded-b-lg w-full">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-semibold text-brand-text">Prompt:</p>
                            <button 
                                onClick={handleCopyPrompt} 
                                className="flex items-center gap-2 text-xs bg-brand-light-gray hover:bg-opacity-80 text-brand-text-secondary font-semibold py-1 px-2 rounded-md transition duration-300"
                            >
                                {isCopied ? (
                                    <>
                                        <CheckIcon className="w-3 h-3 text-green-400" /> Copied!
                                    </>
                                ) : (
                                    <>
                                        <CopyIcon className="w-3 h-3" /> Copy
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-brand-text-secondary max-h-24 overflow-y-auto pr-2">
                            {item.prompt}
                        </p>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full h-8 w-8 flex items-center justify-center text-2xl font-bold hover:bg-opacity-75 transition focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Close lightbox"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};