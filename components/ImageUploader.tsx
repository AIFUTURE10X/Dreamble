import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import type { ImageFile } from '../types';

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);


interface ImageUploaderProps {
    onFilesSelected: (files: File[]) => void;
    onRemove: (index: number) => void;
    title: string;
    id: string;
    images: ImageFile[];
    maxFiles: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesSelected, onRemove, title, id, images, maxFiles }) => {
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

    const uploaderClasses = `flex flex-col items-center justify-center w-full p-4 rounded-lg border-2 border-dashed transition-colors duration-300 cursor-pointer ${isDragging ? 'border-brand-accent bg-brand-light-gray' : 'border-brand-light-gray bg-brand-dark hover:bg-brand-light-gray'}`;
    const canUploadMore = images.length < maxFiles;
    const isSingleFileMode = maxFiles === 1;

    return (
        <div>
            <h3 className="text-lg font-medium mb-3 text-brand-text">{title} 
                {!isSingleFileMode && <span className="text-sm text-brand-text-secondary"> ({images.length}/{maxFiles})</span>}
            </h3>
            {images.length > 0 && (
                <div className={`grid gap-2 mb-2 ${isSingleFileMode ? 'grid-cols-1' : 'grid-cols-4'}`}>
                    {images.map((image, index) => (
                        <div key={index} className={`relative group ${isSingleFileMode ? 'aspect-video bg-brand-dark rounded-lg' : 'aspect-square'}`}>
                            <img src={image.preview} alt={`preview ${index}`} className="w-full h-full object-contain rounded-md" />
                            <button 
                                onClick={() => onRemove(index)} 
                                className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
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
                        <p className="font-semibold text-brand-text text-sm">
                            {isSingleFileMode && images.length === 0 ? 'Upload Image' : 'Add Images'}
                        </p>
                         <p className="text-xs text-brand-text-secondary">
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
