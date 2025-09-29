import React from 'react';

const TweakIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const ReuseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691V5.25a2.25 2.25 0 0 0-2.25-2.25h-4.5a2.25 2.25 0 0 0-2.25 2.25v4.5A2.25 2.25 0 0 0 6.75 12h4.5a2.25 2.25 0 0 0 2.25-2.25v-2.25Z" />
    </svg>
);


interface GeneratedImageGridProps {
    srcs: string[];
    onReset: () => void;
    onImageClick: (src: string) => void;
    onTweak: (index: number) => void;
    onUseAsBase: (src: string) => void;
    isLoading: boolean;
}

export const GeneratedImageGrid: React.FC<GeneratedImageGridProps> = ({ srcs, onReset, onImageClick, onTweak, onUseAsBase, isLoading }) => {
    return (
        <div className="flex flex-col gap-4">
             <div className="grid grid-cols-2 gap-4 aspect-video">
                {srcs.map((src, index) => (
                     <div 
                        key={index}
                        className="relative group cursor-pointer bg-brand-gray rounded-lg"
                        onClick={() => onImageClick(src)}
                    >
                        <img src={src} alt={`Generated product scene ${index + 1}`} className="w-full h-full object-contain rounded-lg" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity rounded-lg flex items-center justify-center gap-2">
                             <button
                                onClick={(e) => { e.stopPropagation(); onUseAsBase(src); }}
                                className="bg-white/80 backdrop-blur-sm hover:bg-white text-brand-dark font-bold py-2 px-3 rounded-lg transition duration-300 opacity-0 group-hover:opacity-100 flex items-center gap-2 text-sm"
                                aria-label="Use this image as the base"
                            >
                                <ReuseIcon className="w-4 h-4" /> Use as Base
                            </button>
                             <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isLoading) onTweak(index);
                                }}
                                disabled={isLoading}
                                className="bg-white/80 backdrop-blur-sm hover:bg-white text-brand-dark font-bold py-2 px-3 rounded-lg transition duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-50 flex items-center gap-2 text-sm"
                            >
                                <TweakIcon className="w-4 h-4" /> Tweak
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={onReset}
                className="w-full bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold py-3 px-6 rounded-lg transition duration-300"
            >
                Start Over
            </button>
        </div>
    );
};

// Exporting old component name for compatibility with App.tsx import
export { GeneratedImageGrid as GeneratedImageDisplay };