import React from 'react';
import type { HistoryItem } from '../types';
import { ReuseIcon } from './icons/ReuseIcon';
import { PencilIcon } from './icons/PencilIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { StarIcon } from './icons/StarIcon';
import { UpscaleIcon } from './icons/UpscaleIcon';
import { UpscalePopover } from './UpscalePopover';
import { DownloadPopover } from './DownloadPopover';

interface FavoritesProps {
    items: HistoryItem[];
    onImageClick: (item: HistoryItem) => void;
    onUseAsBase: (src: string) => void;
    onEdit: (src: string) => void;
    onDownload: (item: HistoryItem, type: 'with-details' | 'image-only') => void;
    onToggleFavorite: (item: HistoryItem) => void;
    onUpscale: (item: HistoryItem, level: string) => void;
    upscalingId: string | null;
}

export const Favorites: React.FC<FavoritesProps> = ({ items, onImageClick, onUseAsBase, onEdit, onDownload, onToggleFavorite, onUpscale, upscalingId }) => {
    return (
        <section>
             <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4">Favorited Images</h2>
            {items.length > 0 ? (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {items.map((item, index) => {
                        const isUpscaling = upscalingId === item.id;
                        return (
                            <div
                                key={item.id}
                                className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg shadow-lg"
                                onClick={() => onImageClick(item)}
                            >
                                <img
                                    src={item.image}
                                    alt={`Favorite image ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center p-2">
                                   <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(item); }} className="flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 rounded-md bg-yellow-400/90 text-white transition-colors w-full">
                                            <StarIcon filled={true} className="w-4 h-4" /> Unfavorite
                                        </button>
                                        <div className="flex flex-wrap items-center justify-center gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); onUseAsBase(item.image); }} className="p-2 rounded-full bg-panel/90 dark:bg-dark-panel/90 backdrop-blur-sm hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors" title="Use as Base"><ReuseIcon className="w-4 h-4" /></button>
                                            <UpscalePopover
                                                onSelect={(level) => onUpscale(item, level)}
                                                isUpscaling={isUpscaling}
                                            >
                                                <button onClick={(e) => { e.stopPropagation(); }} disabled={isUpscaling} className="p-2 rounded-full bg-panel/90 dark:bg-dark-panel/90 backdrop-blur-sm hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors disabled:opacity-50 disabled:cursor-wait" title={isUpscaling ? "Upscaling..." : "Upscale"}>
                                                    {isUpscaling ? (
                                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <UpscaleIcon className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </UpscalePopover>
                                            <button onClick={(e) => { e.stopPropagation(); onEdit(item.image); }} className="p-2 rounded-full bg-panel/90 dark:bg-dark-panel/90 backdrop-blur-sm hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                                            <DownloadPopover onSelect={(type) => onDownload(item, type)}>
                                                <button onClick={(e) => { e.stopPropagation(); }} className="p-2 rounded-full bg-panel/90 dark:bg-dark-panel/90 backdrop-blur-sm hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors" title="Download">
                                                    <DownloadIcon className="w-4 h-4" />
                                                </button>
                                            </DownloadPopover>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-1 right-1 p-1.5 rounded-full bg-yellow-400/80 text-white" aria-label="Favorite">
                                    <StarIcon filled={true} className="w-4 h-4" />
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-12 px-6 bg-panel dark:bg-dark-panel rounded-lg border-2 border-dashed border-border dark:border-dark-border">
                    <p className="font-semibold text-text-primary dark:text-dark-text-primary">No favorites yet.</p>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
                        Click the star icon on an image to save it here.
                    </p>
                </div>
            )}
        </section>
    );
};