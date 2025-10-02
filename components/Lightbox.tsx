import React, { useState, useRef, useLayoutEffect } from 'react';
import type { HistoryItem } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TweakIcon } from './icons/TweakIcon';
import { ReuseIcon } from './icons/ReuseIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { CopyIcon } from './icons/CopyIcon';
import { StarIcon } from './icons/StarIcon';
import { UpscaleIcon } from './icons/UpscaleIcon';
import { UpscalePopover } from './UpscalePopover';

interface LightboxProps {
    state: {
        item: HistoryItem;
        tweakIndex?: number;
    };
    onClose: () => void;
    onUseAsBase: (src: string) => void;
    onEdit: (src: string) => void;
    onTweak: (index: number) => void;
    onDownload: (item: HistoryItem) => void;
    onToggleFavorite: (item: HistoryItem) => void;
    favoriteIds: Set<string>;
    onUpscale: (item: HistoryItem, level: string) => void;
    upscalingId: string | null;
}

const ChevronUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
);

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

const ScrollableText: React.FC<{ label: string; text: string; onCopy: () => void; isCopied: boolean; }> = ({ label, text, onCopy, isCopied }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScroll, setCanScroll] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isAtBottom, setIsAtBottom] = useState(false);

    useLayoutEffect(() => {
        const checkScroll = () => {
            const el = scrollRef.current;
            if (el) {
                const hasOverflow = el.scrollHeight > el.clientHeight;
                setCanScroll(hasOverflow);
                setIsAtTop(el.scrollTop === 0);
                setIsAtBottom(el.scrollHeight - el.scrollTop === el.clientHeight);
            }
        };
        checkScroll();
        const resizeObserver = new ResizeObserver(checkScroll);
        if (scrollRef.current) {
            resizeObserver.observe(scrollRef.current);
        }
        return () => resizeObserver.disconnect();
    }, [text]);

    const handleScroll = () => {
        const el = scrollRef.current;
        if (el) {
            setIsAtTop(el.scrollTop === 0);
            setIsAtBottom(Math.ceil(el.scrollHeight - el.scrollTop) >= el.clientHeight - 1); // Added tolerance
        }
    };

    const scroll = (direction: 'up' | 'down') => {
        scrollRef.current?.scrollBy({ top: direction === 'up' ? -50 : 50, behavior: 'smooth' });
    };

    return (
        <div className="flex items-start gap-3 min-w-0 flex-grow">
            <span className="font-semibold text-text-secondary dark:text-dark-text-secondary mt-0.5 flex-shrink-0">{label}:</span>
            <div className="relative flex-grow flex items-center gap-2">
                <div ref={scrollRef} onScroll={handleScroll} className="flex-grow max-h-24 overflow-y-auto text-text-primary dark:text-dark-text-primary pr-2 scrollbar-hide">
                    <p>{text}</p>
                </div>
                {canScroll && (
                    <div className="flex flex-col items-center gap-1">
                        <button onClick={() => scroll('up')} disabled={isAtTop} className="disabled:opacity-20 transition">
                            <ChevronUpIcon className="w-3 h-3" />
                        </button>
                         <div className="w-px h-2 bg-border dark:bg-dark-border"></div>
                        <button onClick={() => scroll('down')} disabled={isAtBottom} className="disabled:opacity-20 transition">
                            <ChevronDownIcon className="w-3 h-3" />
                        </button>
                    </div>
                )}
                <button onClick={onCopy} className="flex items-center gap-1.5 text-xs font-semibold py-1 px-2 rounded-md bg-panel-secondary/80 dark:bg-dark-panel-secondary/80 hover:bg-border dark:hover:bg-dark-border text-text-secondary dark:text-dark-text-secondary transition-colors flex-shrink-0" disabled={isCopied}>
                    <CopyIcon className="w-3 h-3" />
                    {isCopied ? 'Copied' : 'Copy'}
                </button>
            </div>
        </div>
    );
};

export const Lightbox: React.FC<LightboxProps> = ({ state, onClose, onUseAsBase, onEdit, onTweak, onDownload, onToggleFavorite, favoriteIds, onUpscale, upscalingId }) => {
    const { item, tweakIndex } = state;
    const [copied, setCopied] = useState<string | null>(null);
    const [isInfoVisible, setIsInfoVisible] = useState(true);

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    
    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const isFavorite = favoriteIds.has(item.id);
    const isUpscaling = upscalingId === item.id;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <img 
                    src={item.image} 
                    alt="Generated scene in full resolution" 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                />
                
                <div className={`absolute bottom-0 left-0 right-0 transition-transform duration-500 ease-in-out ${isInfoVisible ? 'translate-y-0' : 'translate-y-[calc(100%-2.5rem)]'}`}>
                    <div className="bg-panel/80 dark:bg-dark-panel/80 backdrop-blur-md border-t border-border dark:border-dark-border rounded-t-lg">
                         <button 
                            onClick={() => setIsInfoVisible(!isInfoVisible)}
                            className="w-full h-10 flex items-center justify-center gap-2 cursor-pointer"
                            aria-label={isInfoVisible ? "Collapse details panel" : "Expand details panel"}
                            aria-expanded={isInfoVisible}
                        >
                            <ChevronUpIcon className={`w-5 h-5 text-text-secondary dark:text-dark-text-secondary transition-transform duration-300 ${isInfoVisible ? 'rotate-180' : ''}`} />
                            <span className="text-brand-accent font-semibold text-sm uppercase tracking-wider">
                                {isInfoVisible ? 'Close' : 'Open'}
                            </span>
                        </button>
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row items-start gap-x-8 gap-y-4 text-sm">
                                    <div className="flex flex-col gap-4 w-full">
                                        <ScrollableText label="Prompt" text={item.prompt} onCopy={() => handleCopy(item.prompt, 'prompt')} isCopied={copied === 'prompt'} />
                                        {item.negativePrompt && (
                                            <ScrollableText label="Negative" text={item.negativePrompt} onCopy={() => handleCopy(item.negativePrompt ?? '', 'negative')} isCopied={copied === 'negative'} />
                                        )}
                                    </div>
                                    {item.seed !== undefined && (
                                        <div className="flex items-start gap-3 flex-shrink-0">
                                            <span className="font-semibold text-text-secondary dark:text-dark-text-secondary flex-shrink-0 mt-0.5">Seed:</span>
                                            <p className="text-text-primary dark:text-dark-text-primary mt-0.5">{item.seed}</p>
                                            <button onClick={() => handleCopy(String(item.seed), 'seed')} className="flex items-center gap-1.5 text-xs font-semibold py-1 px-2 rounded-md bg-panel-secondary/80 dark:bg-dark-panel-secondary/80 hover:bg-border dark:hover:bg-dark-border text-text-secondary dark:text-dark-text-secondary transition-colors flex-shrink-0" disabled={copied === 'seed'}>
                                                <CopyIcon className="w-3 h-3" />
                                                {copied === 'seed' ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="border-t border-border/50 dark:border-dark-border/50"></div>

                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <button onClick={() => onToggleFavorite(item)} className={`flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-colors ${isFavorite ? 'bg-yellow-400 text-white' : 'bg-panel dark:bg-dark-panel hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary'}`}>
                                        <StarIcon filled={isFavorite} className="w-4 h-4" /> {isFavorite ? 'Favorited' : 'Favorite'}
                                    </button>
                                    <button onClick={() => onUseAsBase(item.image)} className="flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg bg-panel dark:bg-dark-panel hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors">
                                        <ReuseIcon className="w-4 h-4" /> Use as Base
                                    </button>
                                    <UpscalePopover 
                                        onSelect={(level) => onUpscale(item, level)}
                                        isUpscaling={isUpscaling}
                                        popoverDirection="top"
                                    >
                                        <button 
                                            onClick={(e) => e.stopPropagation()}
                                            disabled={isUpscaling}
                                            className="flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg bg-panel dark:bg-dark-panel hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors disabled:opacity-50 disabled:cursor-wait"
                                        >
                                            {isUpscaling ? (
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <UpscaleIcon className="w-4 h-4" />
                                            )}
                                            {isUpscaling ? 'Upscaling...' : 'Upscale'}
                                        </button>
                                    </UpscalePopover>
                                    <button onClick={() => onEdit(item.image)} className="flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg bg-panel dark:bg-dark-panel hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors">
                                        <PencilIcon className="w-4 h-4" /> Edit
                                    </button>
                                    {tweakIndex !== undefined && (
                                        <button onClick={() => onTweak(tweakIndex)} className="flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg bg-panel dark:bg-dark-panel hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors">
                                            <TweakIcon className="w-4 h-4" /> Tweak
                                        </button>
                                    )}
                                    <button onClick={() => onDownload(item)} className="flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg bg-panel dark:bg-dark-panel hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors">
                                        <DownloadIcon className="w-4 h-4" /> Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-3">
                <button
                    onClick={onClose}
                    className="bg-black bg-opacity-50 text-white rounded-full h-8 w-8 flex items-center justify-center text-2xl font-bold hover:bg-opacity-75 transition focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Close lightbox"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};