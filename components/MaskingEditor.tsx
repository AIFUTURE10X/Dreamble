import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TrashIcon } from './icons/TrashIcon';

// Icons
const BrushIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
    </svg>
);

const EraserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
     <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 4.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const UndoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
    </svg>
);

interface MaskingEditorProps {
    imageUrl: string;
    onClose: () => void;
    onSave: (maskDataUrl: string) => void;
}

export const MaskingEditor: React.FC<MaskingEditorProps> = ({ imageUrl, onClose, onSave }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backgroundRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(40);
    const [isErasing, setIsErasing] = useState(false);
    const history = useRef<ImageData[]>([]);

    const setCanvasSize = useCallback(() => {
        const canvas = canvasRef.current;
        const image = backgroundRef.current;
        const container = containerRef.current;
        
        // Guard against running before the image is loaded and has dimensions
        if (canvas && image && container && image.naturalWidth > 0) {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            const imgAspectRatio = image.naturalWidth / image.naturalHeight;
            let canvasWidth = containerWidth;
            let canvasHeight = containerWidth / imgAspectRatio;

            if (canvasHeight > containerHeight) {
                canvasHeight = containerHeight;
                canvasWidth = containerHeight * imgAspectRatio;
            }
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            redrawCanvas();
        }
    }, []);

    // This effect robustly handles image loading and canvas setup
    useEffect(() => {
        const imageElement = backgroundRef.current;
        if (!imageElement) return;

        const handleLoad = () => {
            // This function is now guaranteed to run only after the <img> element
            // has finished loading its source and has correct dimensions.
            setCanvasSize();
            history.current = []; // Clear history for the new image
            saveHistory();      // Save the initial blank state
        };

        // Add event listener for the 'load' event.
        imageElement.addEventListener('load', handleLoad);
        
        // Setting the src triggers the loading process.
        imageElement.crossOrigin = "anonymous";
        imageElement.src = imageUrl;

        // Add resize listener for window.
        window.addEventListener('resize', setCanvasSize);

        // Cleanup function to remove listeners when the component unmounts or imageUrl changes.
        return () => {
            window.removeEventListener('resize', setCanvasSize);
            if (imageElement) {
                imageElement.removeEventListener('load', handleLoad);
            }
        };
    }, [imageUrl, setCanvasSize]);

    
    const saveHistory = () => {
        const canvas = canvasRef.current;
        // Also check if canvas has a valid size before saving history
        if (canvas && canvas.width > 0 && canvas.height > 0) {
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
                history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
                 if (history.current.length > 20) { // Limit history size
                    history.current.shift();
                }
            }
        }
    };
    
    const undo = () => {
        if (history.current.length > 1) {
            history.current.pop(); // Remove current state
            const lastState = history.current[history.current.length - 1]; // Get previous state
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (ctx && lastState) {
                ctx.putImageData(lastState, 0, 0);
            }
        }
    };

    const getMousePos = (e: React.MouseEvent): { x: number; y: number } => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            const ctx = canvasRef.current?.getContext('2d');
            ctx?.beginPath(); // Reset the path
            saveHistory();
        }
    };
    
    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx && history.current.length > 0) {
            ctx.putImageData(history.current[history.current.length - 1], 0, 0);
        }
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const { x, y } = getMousePos(e);

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.strokeStyle = isErasing ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.8)';
        ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };
    
    const handleSave = () => {
        const canvas = canvasRef.current;
        const image = backgroundRef.current;
        if (!canvas || !image) return;

        // Create a new canvas with the original image dimensions
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = image.naturalWidth;
        exportCanvas.height = image.naturalHeight;
        const ctx = exportCanvas.getContext('2d');
        if (!ctx) return;
        
        // Draw the mask from our display canvas onto the export canvas, scaling it up
        ctx.drawImage(canvas, 0, 0, image.naturalWidth, image.naturalHeight);
        
        onSave(exportCanvas.toDataURL('image/png'));
    };
    
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            saveHistory();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div ref={containerRef} className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center">
                <img ref={backgroundRef} className="max-w-full max-h-full object-contain pointer-events-none" alt="Background for masking" />
                <canvas
                    ref={canvasRef}
                    className="absolute cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    onMouseMove={draw}
                />
            </div>
            <div className="absolute bottom-4 bg-panel dark:bg-dark-panel p-3 rounded-lg flex items-center gap-4 shadow-2xl">
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <button 
                            onClick={() => setIsErasing(false)}
                            className={`p-2 rounded-full transition-colors ${!isErasing ? 'bg-brand-accent text-white' : 'bg-panel-secondary dark:bg-dark-panel-secondary hover:bg-border dark:hover:bg-dark-border text-text-primary dark:text-dark-text-primary'}`}
                            aria-label="Brush tool"
                        >
                            <BrushIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-dark-panel text-dark-text-primary text-xs px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Brush
                        </span>
                    </div>
                     <div className="relative group">
                        <button 
                             onClick={() => setIsErasing(true)}
                            className={`p-2 rounded-full transition-colors ${isErasing ? 'bg-brand-accent text-white' : 'bg-panel-secondary dark:bg-dark-panel-secondary hover:bg-border dark:hover:bg-dark-border text-text-primary dark:text-dark-text-primary'}`}
                            aria-label="Eraser tool"
                        >
                            <EraserIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-dark-panel text-dark-text-primary text-xs px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Eraser
                        </span>
                    </div>
                </div>
                 <div className="flex items-center gap-2 text-text-primary dark:text-dark-text-primary">
                    <label htmlFor="brushSize" className="text-sm font-medium">Size:</label>
                    <input
                        id="brushSize"
                        type="range"
                        min="5"
                        max="150"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-32"
                    />
                </div>
                 <div className="flex items-center gap-2">
                     <div className="relative group">
                        <button onClick={undo} className="p-2 rounded-full bg-panel-secondary dark:bg-dark-panel-secondary hover:bg-border dark:hover:bg-dark-border text-text-primary dark:text-dark-text-primary transition-colors" aria-label="Undo">
                            <UndoIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-dark-panel text-dark-text-primary text-xs px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Undo
                        </span>
                    </div>
                    <div className="relative group">
                        <button onClick={clearCanvas} className="p-2 rounded-full bg-panel-secondary dark:bg-dark-panel-secondary hover:bg-border dark:hover:bg-dark-border text-text-primary dark:text-dark-text-primary transition-colors" aria-label="Clear mask">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                         <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-dark-panel text-dark-text-primary text-xs px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Clear
                        </span>
                    </div>
                </div>
                <div className="w-px h-6 bg-border dark:bg-dark-border"></div>
                 <div className="flex items-center gap-2">
                    <button onClick={onClose} className="bg-panel-secondary dark:bg-dark-panel-secondary hover:bg-opacity-80 text-text-primary dark:text-dark-text-primary font-bold py-2 px-4 rounded-lg transition">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition">
                        Save Mask
                    </button>
                </div>
            </div>
             <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full h-8 w-8 flex items-center justify-center text-2xl font-bold hover:bg-opacity-75 transition focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close editor"
            >
                &times;
            </button>
        </div>
    );
};