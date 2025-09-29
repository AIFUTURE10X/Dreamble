import React from 'react';

interface LightboxProps {
    src: string;
    onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ src, onClose }) => {
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

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
                <img src={src} alt="Generated scene in full resolution" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
                <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 bg-white text-black rounded-full h-8 w-8 flex items-center justify-center text-2xl font-bold hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Close lightbox"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};