import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { PencilIcon } from './icons/PencilIcon';
import { InfoIcon } from './icons/InfoIcon';
import { TrashIcon } from './icons/TrashIcon';
import type { ImageFile } from '../types';

interface ImageUploaderProps {
    onFilesSelected: (files: File[]) => void;
    onRemove: (index: number) => void;
    title: string;
    secondaryTitle?: string;
    id: string;
    images: ImageFile[];
    maxFiles: number;
    onEdit?: () => void;
    maskImage?: string | null;
    onClearMask?: () => void;
    tooltipText?: string;
    onRemoveAll?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesSelected, onRemove, title, secondaryTitle, id, images, maxFiles, onEdit, maskImage, onClearMask, tooltipText, onRemoveAll }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (files: FileList | null) => {
        if (files) {
            onFilesSelected(Array.from(files));
        }
    };

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    }, [onFilesSelected]);

    const uploaderClasses = `flex flex-col items-center justify-center w-full p-4 rounded-lg border-2 border-dashed transition-colors duration-300 cursor-pointer ${isDragging ? 'border-brand-accent bg-panel-secondary dark:bg-dark-panel-secondary' : 'border-border dark:border-dark-border bg-background dark:bg-dark-background hover:bg-panel-secondary dark:hover:bg-dark-panel-secondary'}`;
    const canUploadMore = images.length < maxFiles;
    const isSingleFileMode = maxFiles === 1;

    return (
        <div>
            <div className="flex justify-between items-start mb-3">
                <div>
                     <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium text-text-primary dark:text-dark-text-primary">{title}</h3>
                        {tooltipText && (
                            <div className="relative group">
                                <button className="text-sky-500 transition-colors" aria-label="More information">
                                    <InfoIcon className="w-6 h-6" />
                                </button>
                                <div className="absolute bottom-full right-0 mb-2 w-72 bg-sky-500 text-white text-sm rounded-lg p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    {tooltipText}
                                    <div className="absolute right-4 -bottom-1 w-2 h-2 bg-sky-500 transform rotate-45"></div>
                                </div>
                            </div>
                        )}
                    </div>
                     {secondaryTitle ? (
                        <p className="text-sm font-medium text-brand-accent">{secondaryTitle}</p>
                     ) : (
                         <p className="text-sm font-medium text-brand-accent">Upload Up To {maxFiles} Images</p>
                     )}
                </div>
                <div className="flex-shrink-0 ml-4">
                    {isSingleFileMode && onEdit && images.length > 0 && (
                        <button onClick={onEdit} className="flex items-center gap-2 text-sm font-semibold text-brand-accent hover:underline">
                            <PencilIcon className="w-4 h-4" />
                            Edit
                        </button>
                    )}
                    {!isSingleFileMode && onRemoveAll && images.length > 1 && (
                        <button
                            onClick={onRemoveAll}
                            className="text-sm font-semibold text-red-500 hover:text-red-400 transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {images.length > 0 && (
                <div className={`grid gap-2 mb-2 ${isSingleFileMode ? 'grid-cols-1' : 'grid-cols-4'}`}>
                    {images.map((image, index) => (
                        <div key={index} className={`relative group ${isSingleFileMode ? 'aspect-video bg-background dark:bg-dark-background rounded-lg' : 'aspect-square'}`}>
                            <img src={image.preview} alt={`preview ${index}`} className="w-full h-full object-contain rounded-md" />
                            {isSingleFileMode && maskImage && (
                                <img src={maskImage} alt="mask preview" className="absolute inset-0 w-full h-full object-contain opacity-50 pointer-events-none" />
                            )}
                            <div className="absolute top-1 right-1 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => onRemove(index)} 
                                    className="bg-black bg-opacity-60 rounded-full p-1 text-white hover:bg-red-500"
                                    aria-label="Remove image"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {maskImage && isSingleFileMode && onClearMask && (
                 <button onClick={onClearMask} className="w-full text-center text-sm text-red-400 hover:underline mb-2">
                    Clear Mask
                </button>
            )}

            {canUploadMore && (
                <label
                    htmlFor={id}
                    className={uploaderClasses}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        <UploadIcon className="w-8 h-8 mb-2" />
                        <p className="font-semibold text-text-primary dark:text-dark-text-primary text-sm">
                            {isSingleFileMode && images.length === 0 ? 'Upload Image' : 'Add Images'}
                        </p>
                         <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                            Drag & drop or{' '}
                            <span className="font-semibold text-brand-accent">choose files</span>
                        </p>
                    </div>
                    <input
                        id={id}
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => handleFileChange(e.target.files)}
                        multiple={!isSingleFileMode}
                    />
                </label>
            )}
        </div>
    );
};