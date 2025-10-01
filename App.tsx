
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ImageUploader } from './components/ImageUploader';
import { SelectInput } from './components/SelectInput';
import { TextAreaInput } from './components/TextAreaInput';
import { GeneratedImageGrid } from './components/GeneratedImageGrid';
import { PromptDisplay } from './components/PromptSelector';
import { Lightbox } from './components/Lightbox';
import { History } from './components/History';
import { StyleSelector } from './components/StyleSelector';
import { StyleModal } from './components/StyleModal';
import { LIGHTING_OPTIONS, ASPECT_RATIO_OPTIONS, CAMERA_PERSPECTIVE_OPTIONS, STYLE_TAXONOMY, NUMBER_OF_IMAGES_OPTIONS } from './constants';
import { resizeImageWithPadding, base64ToFile } from './services/imageService';
import { generateDetailedPrompts, editProductImage, generateImageFromText } from './services/geminiService';
import { getAllHistoryItems, addHistoryItems, deleteHistoryItem } from './services/dbService';
import type { ImageFile, HistoryItem } from './types';

interface CreativeConcept {
    creativeConcept: string;
    variations: string[];
}

const geminiApiKey = process.env.API_KEY;

const App: React.FC = () => {
    const [baseImage, setBaseImage] = useState<ImageFile | null>(null);
    const [referenceImages, setReferenceImages] = useState<ImageFile[]>([]);
    
    const [lighting, setLighting] = useState<string>(LIGHTING_OPTIONS[0]);
    const [aspectRatio, setAspectRatio] = useState<string>(ASPECT_RATIO_OPTIONS[0].value);
    const [cameraPerspective, setCameraPerspective] = useState<string>(CAMERA_PERSPECTIVE_OPTIONS[0]);
    const [sceneDescription, setSceneDescription] = useState<string>('');
    const [numberOfImages, setNumberOfImages] = useState<string>(NUMBER_OF_IMAGES_OPTIONS[3]); // Default to '4'
    
    const [detailedPrompts, setDetailedPrompts] = useState<CreativeConcept | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [lightboxImage, setLightboxImage] = useState<HistoryItem | null>(null);
    const [error, setError] = useState<React.ReactNode | null>(null);
    
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const [isStyleModalOpen, setIsStyleModalOpen] = useState<boolean>(false);
    const [selectedStyleCategory, setSelectedStyleCategory] = useState<string | null>(null);

    const isGeneratingRef = useRef(false);

    // Load history from IndexedDB on initial render
    useEffect(() => {
        getAllHistoryItems()
            .then(items => setHistory(items))
            .catch(err => {
                console.error('Failed to load history from IndexedDB:', err);
                setError('Could not load generation history.');
                setHistory([]);
            });
    }, []);

    if (!geminiApiKey) {
        return (
            <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-red-900/30 border border-red-700 p-8 rounded-lg max-w-2xl shadow-lg">
                    <h1 className="text-3xl font-bold text-white mb-4">Gemini API Key Not Found</h1>
                    <p className="text-red-200 text-lg mb-2">
                        The <code>API_KEY</code> environment variable is not set.
                    </p>
                    <p className="text-red-200">
                        Please ensure you have created a Gemini API key via the Google Cloud Console and have set it in your environment to enable this application.
                    </p>
                </div>
            </div>
        );
    }
    
    const aiRef = useRef(new GoogleGenAI({ apiKey: geminiApiKey }));
    const ai = aiRef.current;

    const handleApiError = (err: unknown) => {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        const lowerCaseError = errorMessage.toLowerCase();

        if (lowerCaseError.includes('429') || lowerCaseError.includes('resource_exhausted') || lowerCaseError.includes('quota')) {
            setError(
                <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg text-left">
                    <h3 className="font-bold text-lg text-white mb-2">API Quota Exceeded: Troubleshooting Guide</h3>
                    <p className="text-red-200 mb-3">
                        You've reached the usage limit for the API. This is almost always due to a configuration issue in your Google Cloud account. Please follow these steps to resolve it:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-red-200">
                        <li>
                            <strong>Verify Billing is Active for Your Project:</strong>
                            <ul className="list-disc list-inside pl-4 mt-1">
                                <li>
                                    Go to the{' '}
                                    <a href="https://console.cloud.google.com/billing/projects" target="_blank" rel="noopener noreferrer" className="underline hover:text-white font-semibold">
                                        Billing &gt; Your Projects
                                    </a>{' '}
                                    page.
                                </li>
                                <li>Find your project and confirm that the "Billing account" column shows an active account, not "Billing is disabled".</li>
                                <li>If disabled, use the (⋮) menu to "Change billing" and link your active billing account.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Generate a New API Key from the Correct Project:</strong>
                            <ul className="list-disc list-inside pl-4 mt-1">
                                <li>Go to the{' '}
                                     <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline hover:text-white font-semibold">
                                        APIs & Services &gt; Credentials
                                    </a>{' '}
                                    page.
                                </li>
                                <li><strong>Crucial:</strong> Use the project selector at the top of the page to choose your correctly billed project.</li>
                                <li>Click "+ CREATE CREDENTIALS" and generate a **brand new API key**.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Update Your Environment Variable:</strong>
                            <ul className="list-disc list-inside pl-4 mt-1">
                                <li>Take this new key and update the <code>API_KEY</code> environment variable where this application is running.</li>
                            </ul>
                        </li>
                    </ol>
                </div>
            );
        } else {
             setError(`An unexpected error occurred: ${errorMessage}`);
        }
        console.error(err);
    };

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
        if (isGeneratingRef.current) return;

        isGeneratingRef.current = true;
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
            handleApiError(err);
        } finally {
            setIsLoading(false);
            isGeneratingRef.current = false;
        }
    }, [ai, sceneDescription, baseImage, referenceImages, lighting, aspectRatio, cameraPerspective, numberOfImages]);
    
    const handleGenerateImages = useCallback(async () => {
        if (isGeneratingRef.current) return;
        
        if (!detailedPrompts) {
            setError('Please generate a creative concept first.');
            return;
        }

        isGeneratingRef.current = true;
        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const newHistoryItems: HistoryItem[] = [];
            const variations = detailedPrompts.variations;
            
            for (const [index, variation] of variations.entries()) {
                setLoadingMessage(`Generating image ${index + 1} of ${variations.length}...`);
                
                const fullPromptForVariation = `${detailedPrompts.creativeConcept}. ${variation}`;
                let newImageBase64: string;

                if (baseImage) {
                    const resizedProduct = await resizeImageWithPadding(baseImage.file, aspectRatio);
                    newImageBase64 = await editProductImage(ai, resizedProduct, fullPromptForVariation);
                } else {
                    newImageBase64 = await generateImageFromText(ai, fullPromptForVariation, aspectRatio);
                }
                
                const imageUrl = `data:image/png;base64,${newImageBase64}`;
                newHistoryItems.push({ 
                    id: `local-${Date.now()}-${index}`, 
                    image: imageUrl, 
                    prompt: fullPromptForVariation,
                    createdAt: Date.now() 
                });

                setGeneratedImages(prev => [...prev, imageUrl]);
                
                if (index < variations.length - 1) {
                    setLoadingMessage('Waiting for 10s to avoid rate limits...');
                    await new Promise(resolve => setTimeout(resolve, 10000));
                }
            }
            
            await addHistoryItems(newHistoryItems);
            const updatedHistory = await getAllHistoryItems();
            setHistory(updatedHistory);

        } catch (err) {
            handleApiError(err);
        } finally {
            setIsLoading(false);
            isGeneratingRef.current = false;
        }
    }, [ai, baseImage, detailedPrompts, aspectRatio]);

    const handleTweakImage = useCallback(async (indexToTweak: number) => {
        if (isGeneratingRef.current) return;
        if (!detailedPrompts) return;

        isGeneratingRef.current = true;
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
            
            const newHistoryItem: HistoryItem = { id: `local-${Date.now()}`, image: imageUrl, prompt: fullPromptForTweak, createdAt: Date.now() };
            await addHistoryItems([newHistoryItem]);
            const updatedHistory = await getAllHistoryItems();
            setHistory(updatedHistory);

        } catch (err) {
            handleApiError(err);
        } finally {
            setIsLoading(false);
            isGeneratingRef.current = false;
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
    
    const applyStyle = (substyle: string) => {
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
    };

    const handleSubstyleSelect = (substyle: string) => {
        applyStyle(substyle);
        handleCloseStyleModal();
    };

    const handleOpenLightbox = (item: HistoryItem) => setLightboxImage(item);
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
        resetAll(); 
        try {
            const file = await base64ToFile(imageUrl, `generated-image-${Date.now()}.png`);
            setBaseImage({ file, preview: imageUrl });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
             setError(err instanceof Error ? err.message : 'Could not use this image.');
             console.error(err);
        }
    };
    
    const handleGeneratedImageClick = (src: string, index: number) => {
        if (!detailedPrompts) return;
        const prompt = `${detailedPrompts.creativeConcept}. ${detailedPrompts.variations[index]}`;
        handleOpenLightbox({ id: `gen-${index}`, image: src, prompt, createdAt: Date.now() });
    };

    const handleDeleteFromHistory = async (idToDelete: string) => {
        setError(null);
        try {
            await deleteHistoryItem(idToDelete);
            setHistory(prev => prev.filter(item => item.id !== idToDelete));
        } catch (error) {
            console.error('Failed to delete history item:', error);
            setError('Could not delete history item.');
        }
    };


    const numImagesToGenerate = detailedPrompts ? detailedPrompts.variations.length : parseInt(numberOfImages, 10);
    const generateButtonText = `✨ Generate ${numImagesToGenerate} Image${numImagesToGenerate > 1 ? 's' : ''}`;
    
    const substylesForModal = selectedStyleCategory 
        ? STYLE_TAXONOMY[selectedStyleCategory as keyof typeof STYLE_TAXONOMY] 
        : [];

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
                             onImageClick={handleGeneratedImageClick}
                             onTweak={handleTweakImage}
                             onUseAsBase={handleUseAsBaseImage}
                             isLoading={isLoading}
                         />
                     ) : (
                         <div className="flex items-center justify-center aspect-video bg-brand-gray rounded-lg p-8 text-center">
                             <div>
                                <h2 className="text-2xl font-bold text-brand-text">Your batch of 1-4 images will appear here</h2>
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
                    
                    <SelectInput isSimple={true} label="Lighting" options={LIGHTING_OPTIONS} value={lighting} onChange={(e) => setLighting(e.target.value)} />
                    <SelectInput label="Aspect Ratio" options={ASPECT_RATIO_OPTIONS} value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} />
                    <SelectInput isSimple={true} label="Camera Perspective" options={CAMERA_PERSPECTIVE_OPTIONS} value={cameraPerspective} onChange={(e) => setCameraPerspective(e.target.value)} />
                    <SelectInput isSimple={true} label="Number of Images" options={NUMBER_OF_IMAGES_OPTIONS} value={numberOfImages} onChange={handleNumberOfImagesChange} />
                    <TextAreaInput placeholder="Describe the image you want to create..." value={sceneDescription} onChange={(e) => setSceneDescription(e.target.value)} />
                    <StyleSelector 
                        onCategoryClick={handleCategoryClick} 
                        onSubstyleSelect={applyStyle}
                    />

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
                    
                    {error && <div className="text-red-400 text-sm text-center p-3 rounded-lg">{error}</div>}
                    
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
                items={history} 
                onImageClick={handleOpenLightbox} 
                onDelete={handleDeleteFromHistory}
                onUseAsBase={handleUseAsBaseImage}
            />
            {lightboxImage && <Lightbox item={lightboxImage} onClose={handleCloseLightbox} />}
            <StyleModal
                isOpen={isStyleModalOpen}
                onClose={handleCloseStyleModal}
                category={selectedStyleCategory}
                substyles={substylesForModal}
                onSubstyleSelect={handleSubstyleSelect}
            />
        </div>
    );
};

export default App;
