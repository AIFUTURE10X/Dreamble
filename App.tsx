import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ImageUploader } from './components/ImageUploader';
import { SelectInput } from './components/SelectInput';
import { TextAreaInput } from './components/TextAreaInput';
import { GeneratedImageGrid } from './components/GeneratedImageDisplay';
import { PromptDisplay } from './components/PromptSelector';
import { Lightbox } from './components/Lightbox';
import { History } from './components/History';
import { StyleSelector } from './components/StyleSelector';
import { StyleModal } from './components/StyleModal';
import { LIGHTING_OPTIONS, ASPECT_RATIO_OPTIONS, CAMERA_PERSPECTIVE_OPTIONS, STYLE_TAXONOMY, NUMBER_OF_IMAGES_OPTIONS } from './constants';
import { resizeImageWithPadding, base64ToFile } from './services/imageService';
import { generateDetailedPrompts, editProductImage, generateImageFromText } from './services/geminiService';
import type { ImageFile } from './types';

interface CreativeConcept {
    creativeConcept: string;
    variations: string[];
}

const App: React.FC = () => {
    const [baseImage, setBaseImage] = useState<ImageFile | null>(null);
    const [referenceImages, setReferenceImages] = useState<ImageFile[]>([]);
    
    const [lighting, setLighting] = useState<string>(LIGHTING_OPTIONS[0]);
    const [aspectRatio, setAspectRatio] = useState<string>(ASPECT_RATIO_OPTIONS[0]);
    const [cameraPerspective, setCameraPerspective] = useState<string>(CAMERA_PERSPECTIVE_OPTIONS[0]);
    const [sceneDescription, setSceneDescription] = useState<string>('');
    const [numberOfImages, setNumberOfImages] = useState<string>(NUMBER_OF_IMAGES_OPTIONS[3]); // Default to '4'
    
    const [detailedPrompts, setDetailedPrompts] = useState<CreativeConcept | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);

    const [isStyleModalOpen, setIsStyleModalOpen] = useState<boolean>(false);
    const [selectedStyleCategory, setSelectedStyleCategory] = useState<string | null>(null);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const handleBaseImageUpload = (files: File[]) => {
        setError(null);
        if (files.length > 0) {
            const file = files[0];
            if (baseImage) {
                URL.revokeObjectURL(baseImage.preview);
            }
            setBaseImage({ file, preview: URL.createObjectURL(file) });
        }
    };

    const handleRemoveBaseImage = () => {
        if (baseImage) {
            URL.revokeObjectURL(baseImage.preview);
            setBaseImage(null);
        }
    };
    
    const handleReferenceImageUpload = (files: File[]) => {
        setError(null);
        setReferenceImages(prev => {
            const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
            const combined = [...prev, ...newImages];
            if (combined.length > 8) {
                setError(`You can upload a maximum of 8 reference images.`);
            }
            return combined.slice(0, 8);
        });
    };

    const handleRemoveReferenceImage = (index: number) => {
        setReferenceImages(prev => {
            const newArr = prev.filter((_, i) => i !== index);
            const item = prev[index];
            if (item) {
                URL.revokeObjectURL(item.preview);
            }
            return newArr;
        });
    };


    const handleGeneratePrompts = useCallback(async () => {
        setIsLoading(true);
        setLoadingMessage('Generating creative concept...');
        setError(null);
        setDetailedPrompts(null);
        try {
            const prompts = await generateDetailedPrompts(ai, {
                sceneDescription,
                baseImage,
                referenceImages,
                lighting,
                aspectRatio,
                cameraPerspective,
                numberOfImages: parseInt(numberOfImages, 10),
            });
            setDetailedPrompts(prompts);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while generating prompts.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [ai, sceneDescription, baseImage, referenceImages, lighting, aspectRatio, cameraPerspective, numberOfImages]);
    
    const handleGenerateImages = useCallback(async () => {
        if (!detailedPrompts) {
            setError('Please generate a creative concept first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const imageUrls: string[] = [];
            
            for (const [index, variation] of detailedPrompts.variations.entries()) {
                setLoadingMessage(`Generating image ${index + 1} of ${detailedPrompts.variations.length}...`);
                
                const fullPromptForVariation = `${detailedPrompts.creativeConcept}. ${variation}`;
                let newImageBase64: string;

                if (baseImage) {
                    const resizedProduct = await resizeImageWithPadding(baseImage.file, aspectRatio);
                    newImageBase64 = await editProductImage(ai, resizedProduct, fullPromptForVariation);
                } else {
                    newImageBase64 = await generateImageFromText(ai, fullPromptForVariation, aspectRatio);
                }
                
                const imageUrl = `data:image/png;base64,${newImageBase64}`;
                imageUrls.push(imageUrl);
                setGeneratedImages(prev => [...prev, imageUrl]);
            }

            setHistory(prev => [...imageUrls, ...prev].slice(0, 12));

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during image generation.';
             if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
                setError('API quota exceeded. Too many requests sent in a short time. Please wait a minute and try again. If the issue persists, check your API key billing status.');
            } else {
                setError(errorMessage);
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [ai, baseImage, detailedPrompts, aspectRatio]);

    const handleTweakImage = useCallback(async (indexToTweak: number) => {
        if (!detailedPrompts) return;

        setIsLoading(true);
        setLoadingMessage(`Tweaking image ${indexToTweak + 1}...`);
        setError(null);

        try {
            const promptToUse = detailedPrompts.variations[indexToTweak];
            const fullPromptForTweak = `${detailedPrompts.creativeConcept}. ${promptToUse} (new variation, different style)`;
            let newImageBase64: string;

            if (baseImage) {
                const resizedProduct = await resizeImageWithPadding(baseImage.file, aspectRatio);
                newImageBase64 = await editProductImage(ai, resizedProduct, fullPromptForTweak);
            } else {
                 newImageBase64 = await generateImageFromText(ai, fullPromptForTweak, aspectRatio);
            }

            const imageUrl = `data:image/png;base64,${newImageBase64}`;

            setGeneratedImages(prev => {
                const newImages = [...prev];
                newImages[indexToTweak] = imageUrl;
                return newImages;
            });
            // Not adding tweaked images to history to avoid clutter

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred while tweaking the image.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [ai, baseImage, detailedPrompts, aspectRatio]);

    const handleCategoryClick = (category: string) => {
        setSelectedStyleCategory(category);
        setIsStyleModalOpen(true);
    };

    const handleCloseStyleModal = () => {
        setIsStyleModalOpen(false);
        setSelectedStyleCategory(null);
    };

    const handleSubstyleSelect = (substyle: string) => {
        setSceneDescription(prev => {
            const styleText = `, ${substyle} style`;
            if (prev.trim() === '') {
                return `${substyle} style`;
            }
            if (prev.includes(styleText)) {
                return prev;
            }
            return prev + styleText;
        });
        handleCloseStyleModal();
    };


    const handleOpenLightbox = (src: string) => setLightboxImage(src);
    const handleCloseLightbox = () => setLightboxImage(null);
    
    const resetAll = () => {
        setGeneratedImages([]);
        setDetailedPrompts(null);
        if (baseImage) URL.revokeObjectURL(baseImage.preview);
        setBaseImage(null);
        referenceImages.forEach(img => URL.revokeObjectURL(img.preview));
        setReferenceImages([]);
        setSceneDescription('');
    }
    
    const handleNumberOfImagesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNumberOfImages(e.target.value);
        setDetailedPrompts(null); // Reset prompts when selection changes
    };

    const handleUseAsBaseImage = async (imageUrl: string) => {
        setError(null);
        resetAll(); // Clear current state

        try {
            const file = await base64ToFile(imageUrl, `generated-image-${Date.now()}.png`);
            setBaseImage({ file, preview: imageUrl });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
             setError(err instanceof Error ? err.message : 'Could not use this image.');
             console.error(err);
        }
    };

    const handleDeleteFromHistory = (indexToDelete: number) => {
        setHistory(prev => prev.filter((_, index) => index !== indexToDelete));
    };

    const numImagesToGenerate = detailedPrompts ? detailedPrompts.variations.length : parseInt(numberOfImages, 10);
    const generateButtonText = `✨ Generate ${numImagesToGenerate} Image${numImagesToGenerate > 1 ? 's' : ''}`;

    return (
        <div className="min-h-screen bg-brand-dark p-4 sm:p-8 font-sans">
            <header className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">AI Scene Creator</h1>
                <p className="text-brand-text-secondary mt-2">Create stunning, batch-generated scenes from an image or just a description</p>
            </header>
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                <div className="flex flex-col gap-8">
                     {generatedImages.length > 0 ? (
                         <GeneratedImageGrid 
                             srcs={generatedImages} 
                             onReset={resetAll}
                             onImageClick={handleOpenLightbox}
                             onTweak={handleTweakImage}
                             onUseAsBase={handleUseAsBaseImage}
                             isLoading={isLoading}
                         />
                     ) : (
                         <div className="flex items-center justify-center aspect-video bg-brand-gray rounded-lg p-8 text-center">
                             <div>
                                <h2 className="text-2xl font-bold text-brand-text">Your batch of {numberOfImages} {parseInt(numberOfImages, 10) > 1 ? 'images' : 'image'} will appear here</h2>
                                <p className="text-brand-text-secondary mt-2">Describe a scene or upload an image to get started.</p>
                             </div>
                         </div>
                     )}
                </div>

                <div className="flex flex-col gap-6 bg-brand-gray p-6 rounded-lg">
                    <ImageUploader title="1. Upload Base Image (Optional)" id="base-uploader" onFilesSelected={handleBaseImageUpload} onRemove={handleRemoveBaseImage} images={baseImage ? [baseImage] : []} maxFiles={1} />
                    <ImageUploader title="2. Add Reference Images (Optional)" id="ref-uploader" onFilesSelected={handleReferenceImageUpload} onRemove={handleRemoveReferenceImage} images={referenceImages} maxFiles={8} />

                    <div className="border-t border-brand-light-gray my-2"></div>
                    <h2 className="text-xl font-semibold -mb-2 text-brand-text">3. Describe Your Scene & Options</h2>
                    
                    <SelectInput label="Lighting" options={LIGHTING_OPTIONS} value={lighting} onChange={(e) => setLighting(e.target.value)} />
                    <SelectInput label="Aspect Ratio" options={ASPECT_RATIO_OPTIONS} value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} />
                    <SelectInput label="Camera Perspective" options={CAMERA_PERSPECTIVE_OPTIONS} value={cameraPerspective} onChange={(e) => setCameraPerspective(e.target.value)} />
                    <SelectInput label="Number of Images" options={NUMBER_OF_IMAGES_OPTIONS} value={numberOfImages} onChange={handleNumberOfImagesChange} />
                    <TextAreaInput placeholder="Describe the image you want to create..." value={sceneDescription} onChange={(e) => setSceneDescription(e.target.value)} />
                    <StyleSelector onCategoryClick={handleCategoryClick} />

                    <div className="border-t border-brand-light-gray my-2"></div>

                    <button 
                        onClick={handleGeneratePrompts}
                        disabled={isLoading || (!baseImage && !sceneDescription && referenceImages.length === 0)}
                        className="w-full bg-brand-light-gray hover:bg-opacity-80 text-brand-text font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading && loadingMessage.includes('concept') ? loadingMessage : '4. Generate Creative Concept'}
                    </button>
                    
                    <PromptDisplay 
                        promptData={detailedPrompts}
                    />
                    
                    {error && <p className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg">{error}</p>}
                    
                    <button 
                        onClick={handleGenerateImages}
                        disabled={isLoading || !detailedPrompts}
                        className="w-full bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold py-4 px-4 rounded-lg transition duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading && !loadingMessage.includes('concept') ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {loadingMessage}
                            </div>
                        ) : generateButtonText}
                    </button>
                </div>
            </main>
            <History 
                images={history} 
                onImageClick={handleOpenLightbox} 
                onDelete={handleDeleteFromHistory}
                onUseAsBase={handleUseAsBaseImage}
            />
            {lightboxImage && <Lightbox src={lightboxImage} onClose={handleCloseLightbox} />}
            <StyleModal
                isOpen={isStyleModalOpen}
                onClose={handleCloseStyleModal}
                category={selectedStyleCategory}
                substyles={selectedStyleCategory ? STYLE_TAXONOMY[selectedStyleCategory as keyof typeof STYLE_TAXONOMY] : []}
                onSubstyleSelect={handleSubstyleSelect}
            />
        </div>
    );
};

export default App;