import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ImageUploader } from './components/ImageUploader';
import { SelectInput } from './components/SelectInput';
import { TextAreaInput } from './components/TextAreaInput';
import { GeneratedImageGrid } from './components/GeneratedImageGrid';
import { PromptDisplay } from './components/PromptSelector';
import { Lightbox } from './components/Lightbox';
import { History } from './components/History';
import { Favorites } from './components/Favorites';
import { StyleSelector } from './components/StyleSelector';
import { StyleModal } from './components/StyleModal';
import { SeedControl } from './components/SeedControl';
import { PreciseReferenceToggle } from './components/PreciseReferenceToggle';
import { MaskingEditor } from './components/MaskingEditor';
import { Tabs } from './components/Tabs';
import { ThemeToggle } from './components/ThemeToggle';
import { LIGHTING_OPTIONS, ASPECT_RATIO_OPTIONS, CAMERA_PERSPECTIVE_OPTIONS, STYLE_TAXONOMY, NUMBER_OF_IMAGES_OPTIONS, IMAGE_SIZE_OPTIONS } from './constants';
import { resizeImageWithPadding, base64ToFile, resizeBase64Image, resizeAndPadMask } from './services/imageService';
import { generateDetailedPrompts, editProductImage, generateImageFromText } from './services/geminiService';
import { getAllHistoryItems, addHistoryItems, deleteHistoryItem, replaceAllHistory, getAllFavorites, getFavoriteIds, addFavorite, removeFavorite } from './services/dbService';
import type { ImageFile, HistoryItem, GeneratedImage } from './types';

interface CreativeConcept {
    creativeConcept: string;
    variations: string[];
}

interface LightboxState {
    item: HistoryItem;
    tweakIndex?: number;
}


const geminiApiKey = process.env.API_KEY;

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.433-.42-2.5-1.72-2.5-3.236V9a4.5 4.5 0 0 1 4.5-4.5h3.75a4.5 4.5 0 0 1 4.5 4.5v5.074c0 1.516-1.067 2.816-2.5 3.236Z" />
    </svg>
);

// Helper function to wrap text on a canvas
const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    if (!text) return [];
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
};

const App: React.FC = () => {
    const [mainTab, setMainTab] = useState<'create' | 'history' | 'favorites'>('create');
    
    const [baseImage, setBaseImage] = useState<ImageFile | null>(null);
    const [referenceImages, setReferenceImages] = useState<ImageFile[]>([]);
    
    const [lighting, setLighting] = useState<string>(LIGHTING_OPTIONS[0]);
    const [aspectRatio, setAspectRatio] = useState<string>(ASPECT_RATIO_OPTIONS[0].options[0].value);
    const [imageSize, setImageSize] = useState<string>('auto');
    const [cameraPerspective, setCameraPerspective] = useState<string>(CAMERA_PERSPECTIVE_OPTIONS[0]);
    const [sceneDescription, setSceneDescription] = useState<string>('');
    const [negativePrompt, setNegativePrompt] = useState<string>('');
    const [numberOfImages, setNumberOfImages] = useState<string>(NUMBER_OF_IMAGES_OPTIONS[0]);
    const [seed, setSeed] = useState<string>('');
    const [isSeedLocked, setIsSeedLocked] = useState<boolean>(false);
    const [isPreciseReference, setIsPreciseReference] = useState<boolean>(true);
    
    const [detailedPrompts, setDetailedPrompts] = useState<CreativeConcept | null>(null);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [lightboxState, setLightboxState] = useState<LightboxState | null>(null);
    const [error, setError] = useState<React.ReactNode | null>(null);
    
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [favorites, setFavorites] = useState<HistoryItem[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

    const [isStyleModalOpen, setIsStyleModalOpen] = useState<boolean>(false);
    const [selectedStyleCategory, setSelectedStyleCategory] = useState<string | null>(null);

    const [isMaskEditorOpen, setIsMaskEditorOpen] = useState<boolean>(false);
    const [imageToEdit, setImageToEdit] = useState<string | null>(null);
    const [maskImage, setMaskImage] = useState<string | null>(null);
    const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);

    const isGeneratingRef = useRef(false);

    // Load history and favorites from IndexedDB on initial render
    useEffect(() => {
        Promise.all([
            getAllHistoryItems(),
            getAllFavorites(),
            getFavoriteIds()
        ]).then(([historyItems, favoriteItems, favIds]) => {
            setHistory(historyItems);
            setFavorites(favoriteItems);
            setFavoriteIds(favIds);
        }).catch(err => {
            console.error('Failed to load data from IndexedDB:', err);
            setError('Could not load generation history or favorites.');
            setHistory([]);
            setFavorites([]);
        });
    }, []);

    if (!geminiApiKey) {
        return (
            <div className="min-h-screen bg-dark-background flex flex-col items-center justify-center p-4 text-center">
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
            setMaskImage(null); // Clear mask when a new base image is uploaded
        }
    };

    const handleRemoveBaseImage = () => {
        if (baseImage) {
            URL.revokeObjectURL(baseImage.preview);
            setBaseImage(null);
        }
        setMaskImage(null);
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

    const getSeed = (): number => {
        if (isSeedLocked) {
            const parsedSeed = parseInt(seed, 10);
            if (!isNaN(parsedSeed)) return parsedSeed;
        }
        // If unlocked, or if the locked seed is invalid, always return a new random seed.
        return Math.floor(Math.random() * 2147483647);
    };
    
    const handleLockToggle = () => {
        const newLockedState = !isSeedLocked;
        setIsSeedLocked(newLockedState);
        
        // If we are locking the seed and the input is empty, generate one.
        if (newLockedState && seed.trim() === '') {
            const randomSeed = Math.floor(Math.random() * 2147483647);
            setSeed(String(randomSeed));
        }
    };

    const handleGeneratePrompts = useCallback(async () => {
        if (isGeneratingRef.current) return;

        isGeneratingRef.current = true;
        setIsLoading(true);
        setLoadingMessage('Generating creative concept...');
        setError(null);
        setDetailedPrompts(null);
        try {
            const seedToUse = getSeed();

            const prompts = await generateDetailedPrompts(ai, {
                sceneDescription,
                negativePrompt,
                baseImage,
                referenceImages,
                lighting,
                aspectRatio,
                cameraPerspective,
                numberOfImages: parseInt(numberOfImages, 10),
                imageSize,
                isPreciseReference,
            }, seedToUse);
            setDetailedPrompts(prompts);
        } catch (err) {
            handleApiError(err);
        } finally {
            setIsLoading(false);
            isGeneratingRef.current = false;
        }
    }, [ai, sceneDescription, negativePrompt, baseImage, referenceImages, lighting, aspectRatio, cameraPerspective, numberOfImages, imageSize, seed, isSeedLocked, isPreciseReference]);
    
    const handleGenerateImages = useCallback(async () => {
        if (isGeneratingRef.current) return;
        
        if (!detailedPrompts && sceneDescription.trim() === '') {
            setError('Please describe a scene or generate a creative concept first.');
            return;
        }

        isGeneratingRef.current = true;
        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const newHistoryItems: HistoryItem[] = [];
            
            const processImage = async (prompt: string, index: number): Promise<GeneratedImage> => {
                const seedToUse = getSeed();
                let newImageBase64: string;
                if (baseImage) {
                    const resizedProduct = await resizeImageWithPadding(baseImage.file, aspectRatio);
                    const resizedMask = maskImage ? await resizeAndPadMask(maskImage, aspectRatio) : null;
                    newImageBase64 = await editProductImage(ai, resizedProduct, prompt, negativePrompt, seedToUse, resizedMask);
                } else {
                    newImageBase64 = await generateImageFromText(ai, prompt, aspectRatio, negativePrompt, seedToUse);
                }
                
                let width: number, height: number;
                let finalImageBase64 = newImageBase64;

                if (imageSize !== 'auto') {
                    [width, height] = imageSize.split('x').map(Number);
                    if (!isNaN(width) && !isNaN(height)) {
                        setLoadingMessage(`Resizing image to ${width}x${height}...`);
                        finalImageBase64 = await resizeBase64Image(newImageBase64, width, height);
                    }
                } else {
                    const ratioParts = aspectRatio.split(' ')[0].split(':').map(Number);
                    const ratio = ratioParts[0] / ratioParts[1];
                    if (ratio >= 1) { // landscape or square
                        width = 1024;
                        height = Math.round(1024 / ratio);
                    } else { // portrait
                        height = 1024;
                        width = Math.round(1024 * ratio);
                    }
                }


                const imageUrl = `data:image/png;base64,${finalImageBase64}`;
                const itemId = `local-${Date.now()}-${index}`;
                newHistoryItems.push({ 
                    id: itemId, 
                    image: imageUrl, 
                    prompt: prompt,
                    negativePrompt: negativePrompt,
                    createdAt: Date.now(),
                    seed: seedToUse
                });
                return { id: itemId, src: imageUrl, width, height, prompt, negativePrompt, seed: seedToUse };
            };
            
            if (detailedPrompts) {
                const variations = detailedPrompts.variations;
                for (const [index, variation] of variations.entries()) {
                    setLoadingMessage(`Generating image ${index + 1} of ${variations.length}...`);
                    const fullPrompt = `${detailedPrompts.creativeConcept}. ${variation}`;
                    const imageObject = await processImage(fullPrompt, index);
                    setGeneratedImages(prev => [...prev, imageObject]);

                    if (index < variations.length - 1) {
                        setLoadingMessage('Waiting for 10s to avoid rate limits...');
                        await new Promise(resolve => setTimeout(resolve, 10000));
                    }
                }
            } else if (sceneDescription.trim() !== '') {
                const numImages = parseInt(numberOfImages, 10);
                for (let i = 0; i < numImages; i++) {
                     setLoadingMessage(`Generating image ${i + 1} of ${numImages}...`);
                     const imageObject = await processImage(sceneDescription, i);
                     setGeneratedImages(prev => [...prev, imageObject]);
                     
                     if (i < numImages - 1) {
                        setLoadingMessage('Waiting for 10s to avoid rate limits...');
                        await new Promise(resolve => setTimeout(resolve, 10000));
                    }
                }
            }

            if (newHistoryItems.length > 0) {
                await addHistoryItems(newHistoryItems);
                const updatedHistory = await getAllHistoryItems();
                setHistory(updatedHistory);
            }
            setMaskImage(null); // Clear mask after successful generation

        } catch (err) {
            handleApiError(err);
        } finally {
            setIsLoading(false);
            isGeneratingRef.current = false;
        }
    }, [ai, baseImage, maskImage, detailedPrompts, aspectRatio, imageSize, sceneDescription, negativePrompt, numberOfImages, seed, isSeedLocked]);

    const handleTweakImage = useCallback(async (indexToTweak: number) => {
        if (isGeneratingRef.current) return;
        
        const imageToTweak = generatedImages[indexToTweak];
        if (!imageToTweak) return;

        isGeneratingRef.current = true;
        setLightboxState(null);
        setIsLoading(true);
        setLoadingMessage(`Tweaking image...`);
        setError(null);

        try {
            const seedToUse = getSeed();
            
            const file = await base64ToFile(imageToTweak.src, 'tweaked.png');
            const resizedProduct = await resizeImageWithPadding(file, aspectRatio);
            
            const promptToUse = imageToTweak.prompt;
            const fullPromptForTweak = `${promptToUse} (new variation, different style)`;

            const newImageBase64 = await editProductImage(ai, resizedProduct, fullPromptForTweak, negativePrompt, seedToUse, null);
            
            let width: number, height: number;
            let finalImageBase64 = newImageBase64;
            if (imageSize !== 'auto') {
                [width, height] = imageSize.split('x').map(Number);
                if (!isNaN(width) && !isNaN(height)) {
                    setLoadingMessage(`Resizing tweaked image to ${width}x${height}...`);
                    finalImageBase64 = await resizeBase64Image(newImageBase64, width, height);
                }
            } else {
                const ratioParts = aspectRatio.split(' ')[0].split(':').map(Number);
                const ratio = ratioParts[0] / ratioParts[1];
                 if (ratio >= 1) {
                    width = 1024;
                    height = Math.round(1024 / ratio);
                } else {
                    height = 1024;
                    width = Math.round(1024 * ratio);
                }
            }

            const imageUrl = `data:image/png;base64,${finalImageBase64}`;
            const newId = `local-${Date.now()}`;
            const newHistoryItem: HistoryItem = { id: newId, image: imageUrl, prompt: fullPromptForTweak, negativePrompt, seed: seedToUse, createdAt: Date.now() };
            const newImageObject: GeneratedImage = { id: newId, src: imageUrl, width, height, prompt: fullPromptForTweak, negativePrompt, seed: seedToUse };

            setGeneratedImages(prev => {
                const newImages = [...prev];
                newImages[indexToTweak] = newImageObject;
                return newImages;
            });
            
            await addHistoryItems([newHistoryItem]);
            const updatedHistory = await getAllHistoryItems();
            setHistory(updatedHistory);

        } catch (err) {
            handleApiError(err);
        } finally {
            setIsLoading(false);
            isGeneratingRef.current = false;
        }
    }, [ai, generatedImages, aspectRatio, imageSize, negativePrompt, seed, isSeedLocked]);

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
    
    const resetAll = () => {
        setGeneratedImages([]);
        setDetailedPrompts(null);
        if (baseImage) URL.revokeObjectURL(baseImage.preview);
        setBaseImage(null);
        setMaskImage(null);
        referenceImages.forEach(img => URL.revokeObjectURL(img.preview));
        setReferenceImages([]);
        setSceneDescription('');
        setNegativePrompt('');
        setSeed('');
        setIsSeedLocked(false);
    }
    
    const handleNumberOfImagesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNumberOfImages(e.target.value);
        setDetailedPrompts(null); // Reset prompts when selection changes
    };

    const handleUseAsBaseImage = async (imageUrl: string) => {
        setError(null);
        setLightboxState(null);
        resetAll(); 
        setMainTab('create');
        try {
            const file = await base64ToFile(imageUrl, `generated-image-${Date.now()}.png`);
            setBaseImage({ file, preview: imageUrl });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
             setError(err instanceof Error ? err.message : 'Could not use this image.');
             console.error(err);
        }
    };

    const handleDownload = (item: GeneratedImage | HistoryItem) => {
        const imageSrc = 'src' in item ? item.src : item.image;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // --- Configuration ---
            const padding = 40;
            const lineSpacing = 8;
            const mainFontSize = 20;
            const smallFontSize = 14;
            const isDarkMode = document.documentElement.classList.contains('dark');
            
            const footerBgColor = isDarkMode ? '#1F1F1F' : '#FFFFFF';
            const textColor = isDarkMode ? '#E0E0E0' : '#111827';
            const secondaryColor = isDarkMode ? '#A0A0A0' : '#6B7280';
            const fontFamily = 'sans-serif';

            // --- Calculate Dynamic Footer Height based on wrapped text ---
            let calculatedFooterHeight = padding * 2;
            
            ctx.font = `600 ${mainFontSize}px ${fontFamily}`;
            const wrappedPromptLines = wrapText(ctx, item.prompt, img.width - padding * 2);
            calculatedFooterHeight += wrappedPromptLines.length * (mainFontSize + lineSpacing);
            calculatedFooterHeight += lineSpacing; // Extra space

            ctx.font = `${smallFontSize}px ${fontFamily}`;
            if (item.negativePrompt) {
                const wrappedNegativeLines = wrapText(ctx, `Negative: ${item.negativePrompt}`, img.width - padding * 2);
                calculatedFooterHeight += wrappedNegativeLines.length * (smallFontSize + lineSpacing);
            }
            if (item.seed !== undefined) {
                 calculatedFooterHeight += smallFontSize + lineSpacing;
            }

            // --- Canvas Setup ---
            canvas.width = img.width;
            canvas.height = img.height + calculatedFooterHeight;

            // --- Drawing ---
            // 1. Fill with a base background color in case the image is transparent
            ctx.fillStyle = footerBgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 2. Draw the main image
            ctx.drawImage(img, 0, 0);

            // 3. Draw the footer background
            ctx.fillStyle = footerBgColor;
            ctx.fillRect(0, img.height, canvas.width, calculatedFooterHeight);

            // --- Draw Text ---
            let currentY = img.height + padding + mainFontSize;

            // Draw Prompt
            ctx.font = `600 ${mainFontSize}px ${fontFamily}`;
            ctx.fillStyle = textColor;
            wrappedPromptLines.forEach(line => {
                ctx.fillText(line, padding, currentY);
                currentY += mainFontSize + lineSpacing;
            });

            currentY += lineSpacing;

            // Draw Negative Prompt
            if (item.negativePrompt) {
                ctx.font = `${smallFontSize}px ${fontFamily}`;
                ctx.fillStyle = secondaryColor;
                const wrappedNegativeLines = wrapText(ctx, `Negative: ${item.negativePrompt}`, img.width - padding * 2);
                wrappedNegativeLines.forEach(line => {
                    ctx.fillText(line, padding, currentY);
                    currentY += smallFontSize + lineSpacing;
                });
            }
            
            // Draw Seed
            if (item.seed !== undefined) {
                ctx.font = `${smallFontSize}px ${fontFamily}`;
                ctx.fillStyle = secondaryColor;
                ctx.fillText(`Seed: ${item.seed}`, padding, currentY);
            }

            // --- Download ---
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `generated-scene-${item.seed || Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        
        img.onerror = () => {
            setError('Could not load image to create download file.');
        }
    };
    
    const handleOpenLightboxFromGrid = (image: GeneratedImage, index: number) => {
        setLightboxState({ 
            item: { 
                id: image.id, 
                image: image.src, 
                prompt: image.prompt, 
                negativePrompt: image.negativePrompt,
                seed: image.seed,
                createdAt: Date.now() 
            },
            tweakIndex: index
        });
    };
    
    const handleOpenLightboxFromHistory = (item: HistoryItem) => {
        setLightboxState({ item });
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
    
    const handleOpenMaskEditor = (imageSrc: string) => {
        setLightboxState(null);
        setImageToEdit(imageSrc);
        setIsMaskEditorOpen(true);
    };

    const handleCloseMaskEditor = () => {
        setIsMaskEditorOpen(false);
        setImageToEdit(null);
    };
    
    const handleSaveMask = (maskDataUrl: string) => {
        setMaskImage(maskDataUrl);
        handleCloseMaskEditor();
    };

    const handleRestoreHistory = async (importedItems: HistoryItem[]) => {
        setError(null);
        try {
            await replaceAllHistory(importedItems);
            // After replacing, fetch all again to ensure correct order and sync state
            const updatedHistory = await getAllHistoryItems();
            setHistory(updatedHistory);
        } catch (error) {
            console.error('Failed to restore history:', error);
            setError('Could not restore history from the provided file.');
        }
    };

    const handleToggleFavorite = useCallback(async (itemToToggle: HistoryItem | GeneratedImage) => {
        const image = 'src' in itemToToggle ? itemToToggle.src : itemToToggle.image;
        const historyItem: HistoryItem = {
            id: itemToToggle.id,
            image: image,
            prompt: itemToToggle.prompt,
            negativePrompt: itemToToggle.negativePrompt,
            seed: itemToToggle.seed,
            createdAt: 'createdAt' in itemToToggle ? itemToToggle.createdAt : Date.now(),
        };

        const isFav = favoriteIds.has(historyItem.id);
        setError(null);
        try {
            if (isFav) {
                await removeFavorite(historyItem.id);
            } else {
                await addFavorite(historyItem);
            }
            const updatedIds = await getFavoriteIds();
            const updatedFavorites = await getAllFavorites();
            setFavoriteIds(updatedIds);
            setFavorites(updatedFavorites);
        } catch (err) {
            const action = isFav ? 'remove favorite' : 'add favorite';
            setError(`Could not ${action}.`);
            console.error(err);
        }
    }, [favoriteIds]);

    const numImagesToGenerate = detailedPrompts ? detailedPrompts.variations.length : parseInt(numberOfImages, 10);
    
    const substylesForModal = selectedStyleCategory 
        ? STYLE_TAXONOMY[selectedStyleCategory as keyof typeof STYLE_TAXONOMY] 
        : [];
    
    const mainTabs = [
        { id: 'create', label: 'Create' },
        { id: 'history', label: 'History' },
        { id: 'favorites', label: 'Favorites' }
    ];

    const controlPanelTabs = [
        {
            id: 'prompt',
            label: <>✍️ <span className="hidden sm:inline">Prompt</span></>,
            content: (
                <div className="space-y-4">
                    <TextAreaInput placeholder="Describe the image you want to create..." value={sceneDescription} onChange={(e) => setSceneDescription(e.target.value)} />
                    <div>
                         <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Negative Prompt (Optional)</label>
                         <TextAreaInput placeholder="e.g., text, watermarks, ugly, deformed, blurry..." value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} />
                    </div>
                </div>
            )
        },
        {
            id: 'settings',
            label: <>⚙️ <span className="hidden sm:inline">Settings</span></>,
            content: (
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <SelectInput isSimple={true} label="Lighting" options={LIGHTING_OPTIONS} value={lighting} onChange={(e) => setLighting(e.target.value)} />
                        <SelectInput isSimple={true} label="Camera Perspective" options={CAMERA_PERSPECTIVE_OPTIONS} value={cameraPerspective} onChange={(e) => setCameraPerspective(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <SelectInput label="Aspect Ratio" options={ASPECT_RATIO_OPTIONS} value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} />
                        <SelectInput label="Image Size" options={IMAGE_SIZE_OPTIONS} value={imageSize} onChange={(e) => setImageSize(e.target.value)} />
                    </div>
                    <div className="bg-panel-secondary dark:bg-dark-panel-secondary rounded-lg border border-border dark:border-dark-border">
                        <button
                            onClick={() => setIsAdvancedSettingsOpen(!isAdvancedSettingsOpen)}
                            className="w-full flex justify-between items-center p-4"
                            aria-expanded={isAdvancedSettingsOpen}
                            aria-controls="advanced-settings-panel"
                        >
                            <h4 className="text-sm font-bold text-text-secondary dark:text-dark-text-secondary tracking-wider">ADVANCED SETTINGS</h4>
                             <svg className={`w-4 h-4 text-text-secondary dark:text-dark-text-secondary transition-transform ${isAdvancedSettingsOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                         {isAdvancedSettingsOpen && (
                            <div id="advanced-settings-panel" className="p-4 border-t border-border dark:border-dark-border space-y-6">
                                <div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <SelectInput isSimple={true} label="Number of Images" options={NUMBER_OF_IMAGES_OPTIONS} value={numberOfImages} onChange={handleNumberOfImagesChange} />
                                        <SeedControl
                                            seed={seed}
                                            onSeedChange={setSeed}
                                            isLocked={isSeedLocked}
                                            onLockToggle={handleLockToggle}
                                        />
                                    </div>
                                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary text-center mt-2 tracking-wide uppercase">
                                        {isSeedLocked ? 'Seed is locked for consistency' : 'Seed is unlocked to give more variety'}
                                    </p>
                                </div>
                                 <PreciseReferenceToggle
                                    isChecked={isPreciseReference}
                                    onChange={setIsPreciseReference}
                                />
                            </div>
                         )}
                    </div>
                </div>
            )
        },
        {
            id: 'style',
            label: <>🎨 <span className="hidden sm:inline">Style</span></>,
            content: (
                <StyleSelector 
                    onCategoryClick={handleCategoryClick} 
                    onSubstyleSelect={applyStyle}
                />
            )
        },
    ];

    return (
        <div className="min-h-screen bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary font-sans">
            <header className="text-center relative pt-4 sm:pt-8 px-4 sm:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold">AI Scene Creator</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-2">Create stunning, batch-generated scenes from an image or just a description</p>
                 <div className="absolute top-4 sm:top-8 right-4 sm:right-8">
                    <ThemeToggle />
                </div>
            </header>

            <div className="border-b border-border dark:border-dark-border">
                <nav className="flex space-x-6 sm:space-x-8 px-4 sm:px-6" aria-label="Main navigation">
                    {mainTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setMainTab(tab.id as any)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-bold text-lg
                                transition-colors duration-200 ease-in-out
                                ${
                                    mainTab === tab.id
                                        ? 'border-brand-accent text-text-primary dark:text-dark-text-primary'
                                        : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:border-border dark:hover:border-dark-border'
                                }
                            `}
                            aria-current={mainTab === tab.id ? 'page' : undefined}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="mt-8">
                {mainTab === 'create' && (
                     <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-6">
                        <div className="lg:col-span-2 flex flex-col gap-8">
                            {generatedImages.length > 0 ? (
                                <GeneratedImageGrid 
                                    images={generatedImages} 
                                    onReset={resetAll}
                                    onImageClick={handleOpenLightboxFromGrid}
                                    onUseAsBase={handleUseAsBaseImage}
                                    onEdit={handleOpenMaskEditor}
                                    onTweak={handleTweakImage}
                                    onDownload={handleDownload}
                                    onToggleFavorite={handleToggleFavorite}
                                    favoriteIds={favoriteIds}
                                />
                            ) : (
                                <div className="flex flex-col flex-grow items-center justify-center bg-panel dark:bg-dark-panel rounded-lg p-8 text-center border-4 border-brand-accent">
                                    <div>
                                        <h2 className="text-2xl font-bold">Your batch of 1-4 images will appear here</h2>
                                        <p className="text-text-secondary dark:text-dark-text-secondary mt-2">Describe a scene or upload an image to get started.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-1 flex flex-col gap-6 bg-panel dark:bg-dark-panel py-6 rounded-lg px-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                                <ImageUploader 
                                    title="1. Upload Base Image (Optional)" 
                                    secondaryTitle="The primary subject for your scene"
                                    id="base-uploader" 
                                    onFilesSelected={handleBaseImageUpload} 
                                    onRemove={handleRemoveBaseImage} 
                                    onEdit={baseImage ? () => handleOpenMaskEditor(baseImage.preview) : undefined}
                                    images={baseImage ? [baseImage] : []} 
                                    maskImage={maskImage}
                                    onClearMask={() => setMaskImage(null)}
                                    maxFiles={1} 
                                />
                                <ImageUploader 
                                    title="2. Add Reference Images (Optional)"
                                    id="ref-uploader" 
                                    onFilesSelected={handleReferenceImageUpload} 
                                    onRemove={handleRemoveReferenceImage} 
                                    images={referenceImages} 
                                    maxFiles={8} 
                                    tooltipText="Guide the AI's style, color, and mood. The AI will draw inspiration from these images to create a scene that matches your desired aesthetic."
                                />
                            </div>
                            
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary text-center -mt-2 max-w-prose mx-auto">
                                Guide the AI's style, color, and mood. The AI will draw inspiration from these images to create a scene that matches your desired aesthetic.
                            </p>

                            <div className="border-t border-border dark:border-dark-border my-2"></div>
                            <h2 className="text-xl font-semibold">3. Describe Your Scene & Options</h2>
                            
                            <Tabs tabs={controlPanelTabs} />

                            <div className="border-t border-border dark:border-dark-border my-2"></div>
                            
                            <div className="text-center mb-3">
                                <h2 className="text-xl font-semibold">4. Generate</h2>
                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1 max-w-md mx-auto">
                                    Use your written prompt to generate images directly. Or, for more creative ideas, generate AI concepts first.
                                </p>
                            </div>

                            {error && <div className="text-red-400 text-sm text-center p-3 rounded-lg mb-4">{error}</div>}

                            <button
                                onClick={handleGenerateImages}
                                disabled={isLoading || (!detailedPrompts && sceneDescription.trim() === '')}
                                className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-4 px-4 rounded-lg transition duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {isLoading && !loadingMessage.includes('concept') ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {loadingMessage}
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="w-6 h-6 text-white" />
                                            <span>Generate {numImagesToGenerate} Image{numImagesToGenerate > 1 ? 's' : ''}</span>
                                        </>
                                    )}
                                </div>
                            </button>
                            
                            <div className="relative flex items-center my-4">
                                <div className="flex-grow border-t border-border dark:border-dark-border"></div>
                                <span className="flex-shrink mx-4 text-text-secondary dark:text-dark-text-secondary text-sm">OR</span>
                                <div className="flex-grow border-t border-border dark:border-dark-border"></div>
                            </div>

                            <button 
                                onClick={handleGeneratePrompts}
                                disabled={isLoading || (!baseImage && !sceneDescription && referenceImages.length === 0)}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg transition duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {isLoading && loadingMessage.includes('concept') ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {loadingMessage}
                                        </>
                                    ) : (
                                        <>
                                            <LightbulbIcon className="w-6 h-6" />
                                            <span>Get AI Creative Concepts (Optional)</span>
                                        </>
                                    )}
                                </div>
                            </button>
                            
                            <PromptDisplay 
                                promptData={detailedPrompts}
                            />
                        </div>
                    </main>
                )}
                {mainTab === 'history' && (
                     <main className="px-4 sm:px-6">
                         <History 
                            items={history} 
                            onImageClick={handleOpenLightboxFromHistory} 
                            onDelete={handleDeleteFromHistory}
                            onUseAsBase={handleUseAsBaseImage}
                            onEdit={handleOpenMaskEditor}
                            onDownload={handleDownload}
                            onRestoreHistory={handleRestoreHistory}
                            onToggleFavorite={handleToggleFavorite}
                            favoriteIds={favoriteIds}
                        />
                    </main>
                )}
                {mainTab === 'favorites' && (
                    <main className="px-4 sm:px-6">
                        <Favorites
                            items={favorites}
                            onImageClick={handleOpenLightboxFromHistory}
                            onUseAsBase={handleUseAsBaseImage}
                            onEdit={handleOpenMaskEditor}
                            onDownload={handleDownload}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    </main>
                )}
            </div>

             {lightboxState && (
                <Lightbox 
                    state={lightboxState}
                    onClose={() => setLightboxState(null)} 
                    onUseAsBase={handleUseAsBaseImage}
                    onEdit={handleOpenMaskEditor}
                    onTweak={handleTweakImage}
                    onDownload={handleDownload}
                    onToggleFavorite={handleToggleFavorite}
                    favoriteIds={favoriteIds}
                />
            )}
            <StyleModal
                isOpen={isStyleModalOpen}
                onClose={handleCloseStyleModal}
                category={selectedStyleCategory}
                substyles={substylesForModal}
                onSubstyleSelect={handleSubstyleSelect}
            />
            {isMaskEditorOpen && imageToEdit && (
                <MaskingEditor
                    imageUrl={imageToEdit}
                    onClose={handleCloseMaskEditor}
                    onSave={handleSaveMask}
                />
            )}
        </div>
    );
};

export default App;