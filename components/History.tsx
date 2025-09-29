import React from 'react';

interface HistoryProps {
    images: string[];
    onImageClick: (src: string) => void;
    onDelete: (index: number) => void;
    onUseAsBase: (src: string) => void;
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const ReuseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691V5.25a2.25 2.25 0 0 0-2.25-2.25h-4.5a2.25 2.25 0 0 0-2.25 2.25v4.5A2.25 2.25 0 0 0 6.75 12h4.5a2.25 2.25 0 0 0 2.25-2.25v-2.25Z" />
    </svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);


export const History: React.FC<HistoryProps> = ({ images, onImageClick, onDelete, onUseAsBase }) => {
    if (images.length === 0) {
        return null; // Don't render the section if there's no history
    }

    const handleDownload = (e: React.MouseEvent, src: string) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = src;
        link.download = `history-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="max-w-7xl mx-auto mt-12 px-4 sm:px-0">
            <h2 className="text-2xl font-semibold mb-4 text-brand-text text-center">Generation History</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg shadow-lg"
                        onClick={() => onImageClick(src)}
                        role="button"
                        aria-label={`View generated image ${index + 1}`}
                    >
                        <img
                            src={src}
                            alt={`Generated image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-colors duration-300 flex flex-col items-center justify-center p-2 gap-2">
                             <button
                                onClick={(e) => { e.stopPropagation(); onUseAsBase(src); }}
                                className="bg-white/80 backdrop-blur-sm hover:bg-white text-brand-dark font-bold py-2 px-3 rounded-lg transition duration-300 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs"
                                aria-label="Use as base image"
                            >
                                <ReuseIcon className="w-3.5 h-3.5" /> Use as Base
                            </button>
                            <button
                                onClick={(e) => handleDownload(e, src)}
                                className="bg-white/80 backdrop-blur-sm hover:bg-white text-brand-dark font-bold py-2 px-3 rounded-lg transition duration-300 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs"
                                aria-label="Download image"
                            >
                                <DownloadIcon className="w-3.5 h-3.5" /> Download
                            </button>
                             <button
                                onClick={(e) => { e.stopPropagation(); onDelete(index); }}
                                className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                aria-label="Delete image"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};