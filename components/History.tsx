import React from 'react';
import type { HistoryItem } from '../types';
import { ReuseIcon } from './icons/ReuseIcon';
import { PencilIcon } from './icons/PencilIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ImportIcon } from './icons/ImportIcon';
import { ExportIcon } from './icons/ExportIcon';
import { StarIcon } from './icons/StarIcon';

interface HistoryProps {
    items: HistoryItem[];
    onImageClick: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
    onUseAsBase: (src: string) => void;
    onEdit: (src: string) => void;
    onDownload: (item: HistoryItem) => void;
    onRestoreHistory: (items: HistoryItem[]) => void;
    onToggleFavorite: (item: HistoryItem) => void;
    favoriteIds: Set<string>;
}

export const History: React.FC<HistoryProps> = ({ items, onImageClick, onDelete, onUseAsBase, onEdit, onDownload, onRestoreHistory, onToggleFavorite, favoriteIds }) => {
    const importInputRef = React.useRef<HTMLInputElement>(null);

    const handleExport = () => {
        if (items.length === 0) return;

        const dataStr = JSON.stringify(items, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `ai-scene-creator-history-${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        importInputRef.current?.click();
    };

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result;
                if (typeof text !== 'string') throw new Error("File is not readable.");
                const importedItems = JSON.parse(text);

                // Basic validation
                if (Array.isArray(importedItems) && importedItems.every(item => 'id' in item && 'image' in item && 'prompt' in item && 'createdAt' in item)) {
                    onRestoreHistory(importedItems);
                } else {
                    throw new Error("Invalid history file format.");
                }
            } catch (error) {
                console.error("Error importing history:", error);
                alert("Failed to import history. Please select a valid history export file.");
            } finally {
                // Reset the input value to allow importing the same file again
                if (e.target) e.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <section>
            <div className="mb-4 flex items-center justify-between gap-4">
                 <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">Generation History</h2>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleImportClick} 
                        className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-md bg-panel-secondary dark:bg-dark-panel-secondary hover:bg-border dark:hover:bg-dark-border text-text-primary dark:text-dark-text-primary transition-colors"
                        title="Import history from a file"
                    >
                        <ImportIcon className="w-4 h-4" /> <span className="hidden sm:inline">Import</span>
                    </button>
                    {items.length > 0 && (
                        <button 
                            onClick={handleExport} 
                            className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-md bg-panel-secondary dark:bg-dark-panel-secondary hover:bg-border dark:hover:bg-dark-border text-text-primary dark:text-dark-text-primary transition-colors"
                            title="Export history to a file"
                        >
                            <ExportIcon className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
                        </button>
                    )}
                    <input 
                        type="file" 
                        ref={importInputRef}
                        accept=".json"
                        onChange={handleFileImport}
                        className="hidden"
                    />
                </div>
            </div>
            {items.length > 0 ? (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {items.map((item, index) => {
                        const isFavorite = favoriteIds.has(item.id);
                        return (
                            <div
                                key={item.id}
                                className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg shadow-lg"
                                onClick={() => onImageClick(item)}
                            >
                                <img
                                    src={item.image}
                                    alt={`Generated image ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center p-2">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(item); }} className={`flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 rounded-md transition-colors w-full ${isFavorite ? 'bg-yellow-400/90 text-white' : 'bg-panel/90 dark:bg-dark-panel/90 backdrop-blur-sm hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary'}`}>
                                            <StarIcon filled={isFavorite} className="w-4 h-4" /> Favorite
                                        </button>
                                        <div className="flex flex-wrap items-center justify-center gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); onUseAsBase(item.image); }} className="p-2 rounded-full bg-panel/90 dark:bg-dark-panel/90 backdrop-blur-sm hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors" title="Use as Base"><ReuseIcon className="w-4 h-4" /></button>
                                            <button onClick={(e) => { e.stopPropagation(); onEdit(item.image); }} className="p-2 rounded-full bg-panel/90 dark:bg-dark-panel/90 backdrop-blur-sm hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                                            <button onClick={(e) => { e.stopPropagation(); onDownload(item); }} className="p-2 rounded-full bg-panel/90 dark:bg-dark-panel/90 backdrop-blur-sm hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors" title="Download"><DownloadIcon className="w-4 h-4" /></button>
                                            <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="p-2 rounded-full bg-red-500/80 backdrop-blur-sm hover:bg-red-600/90 text-white transition-colors" title="Delete"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </div>
                                
                                <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(item); }} className={`absolute top-1 right-1 p-1.5 rounded-full transition-all duration-300 ${isFavorite ? 'bg-yellow-400/80 text-white scale-100' : 'bg-black/50 text-white/70 scale-0 group-hover:scale-100'}`} aria-label={isFavorite ? 'Unfavorite' : 'Favorite'}>
                                    <StarIcon filled={isFavorite} className="w-4 h-4" />
                                </button>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-12 px-6 bg-panel dark:bg-dark-panel rounded-lg border-2 border-dashed border-border dark:border-dark-border">
                    <p className="font-semibold text-text-primary dark:text-dark-text-primary">Your history is empty.</p>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
                        Generated images will appear here.
                    </p>
                </div>
            )}
        </section>
    );
};