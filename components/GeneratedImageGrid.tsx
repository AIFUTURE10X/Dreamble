import React from 'react';
import type { GeneratedImage } from '../types';
import { ReuseIcon } from './icons/ReuseIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TweakIcon } from './icons/TweakIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { StarIcon } from './icons/StarIcon';
import { UpscaleIcon } from './icons/UpscaleIcon';
import { UpscalePopover } from './UpscalePopover';
import { DownloadPopover } from './DownloadPopover';


interface GeneratedImageGridProps {
    images: GeneratedImage[];
    onImageClick: (image: GeneratedImage, index: number) => void;
    onUseAsBase: (src: string) => void;
    onEdit: (src: string) => void;
    onTweak: (index: number) => void;
    onDownload: (image: GeneratedImage, type: 'with-details' | 'image-only') => void;
    onToggleFavorite: (item: GeneratedImage) => void;
    favoriteIds: Set<string>;
    onUpscale: (image: GeneratedImage, level: string) => void;
    upscalingId: string | null;
}

export const GeneratedImageGrid: React.FC<GeneratedImageGridProps> = ({ images, onImageClick, onUseAsBase, onEdit, onTweak, onDownload, onToggleFavorite, favoriteIds, onUpscale, upscalingId }) => {
    const isSingleImage = images.length === 1;

    const renderImage = (image: GeneratedImage, index: number) => {
        const isFavorite = favoriteIds.has(image.id);
        const isUpscaling = upscalingId === image.id;
        return (
            <div 
                key={index} 
                className="relative group cursor-pointer flex items-center justify-center bg-background dark:bg-dark-background rounded-lg overflow-hidden" 
                style={{ aspectRatio: `${image.width} / ${image.height}` }}
                onClick={() => onImageClick(image, index)}
            >
                <img 
                    src={image.src} 
                    alt={`Generated scene ${index + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center p-4">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(image); }} className={`flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-md transition-colors ${isFavorite ? 'bg-yellow-400/90 text-white' : 'bg-panel/90 dark:bg-dark-panel/90 backdrop-blur-sm hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary'}`}>
                            <StarIcon filled={isFavorite} className="w-4 h-4" /> Favorite
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onUseAsBase(image.src); }} className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-md bg-panel/90 dark:bg-dark-panel/90 backdrop-blur-sm hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors">
                            <ReuseIcon className="w-4 h-4" /> Use as Base
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onEdit(image.src); }} className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-md bg-panel/90 dark:bg-dark-panel/90 backdrop-blur-sm hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors">
                            <PencilIcon className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onTweak(index); }} className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-md bg-panel/90 dark:bg-dark-panel/90 backdrop-blur-sm hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors">
                            <TweakIcon className="w-4 h-4" /> Tweak
                        </button>
                        <UpscalePopover 
                            onSelect={(level) => onUpscale(image, level)}
                            isUpscaling={isUpscaling}
                        >
                            <button 
                                onClick={(e) => e.stopPropagation()}
                                disabled={isUpscaling}
                                className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-md bg-panel/90 dark:bg-dark-panel/90 backdrop-blur-sm hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors disabled:opacity-50 disabled:cursor-wait"
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
                        <DownloadPopover onSelect={(type) => onDownload(image, type)}>
                            <button 
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-md bg-panel/90 dark:bg-dark-panel/90 backdrop-blur-sm hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary text-text-primary dark:text-dark-text-primary transition-colors"
                            >
                                <DownloadIcon className="w-4 h-4" /> Download
                            </button>
                        </DownloadPopover>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className="flex flex-col gap-4 flex-grow border-4 border-brand-accent rounded-lg">
            <div className={`relative bg-panel dark:bg-dark-panel rounded-lg flex-grow p-4`}>
                {isSingleImage ? (
                    <div className="w-full h-full">
                        {renderImage(images[0], 0)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {images.map(renderImage)}
                    </div>
                )}
            </div>
        </div>
    );
};