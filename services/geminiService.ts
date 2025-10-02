import { GoogleGenAI, Modality, Type } from '@google/genai';
import type { ImageFile } from '../types';
import { fileToBase64 } from './imageService';

interface PromptGenerationConfig {
    sceneDescription?: string;
    negativePrompt?: string;
    baseImage: ImageFile | null;
    referenceImages: ImageFile[];
    lighting: string;
    aspectRatio: string;
    cameraPerspective: string;
    numberOfImages: number;
    imageSize: string;
    isPreciseReference: boolean;
}

interface CreativeConcept {
    creativeConcept: string;
    variations: string[];
}

export const generateDetailedPrompts = async (
    ai: GoogleGenAI,
    config: PromptGenerationConfig,
    seed?: number
): Promise<CreativeConcept> => {
    const { sceneDescription, negativePrompt, baseImage, referenceImages, lighting, aspectRatio, cameraPerspective, numberOfImages, imageSize, isPreciseReference } = config;

    const promptParts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [];
    
    let basePrompt: string;
    const sizeInfo = imageSize === 'auto' 
        ? '' 
        : `The final output will be resized to a specific size: ${imageSize} pixels. Generate a concept that will look good at this resolution (e.g., simpler details for smaller icon sizes, high detail for print sizes).`;
    
    const negativePromptInfo = negativePrompt 
        ? `\n- **Negative Prompt (Things to AVOID):** ${negativePrompt}`
        : '';


    if (baseImage) {
        if (isPreciseReference) {
             basePrompt = `You are a world-class creative director for a high-end product photoshoot. Your task is to generate one cohesive creative concept with ${numberOfImages} distinct variations for a product background scene.

**CRITICAL INSTRUCTION:** The subject from the 'Base Image' is the hero. It must remain **perfectly consistent, unchanged, and photorealistically integrated** across all ${numberOfImages} variations. Do NOT alter the subject. Only change the background scene.

Analyze all provided information:
- Base Image: The primary subject to be placed in each scene.
- Reference Images: These establish the mood, style, texture, and color palette.
- User Scene Description: ${sceneDescription || 'No specific description provided.'}
- Lighting Style: ${lighting}
- Aspect Ratio: ${aspectRatio}
- Camera Perspective: ${cameraPerspective}
- Target Size Information: ${sizeInfo}${negativePromptInfo}

Based on this, first write a short, overarching "Creative Concept" that sets the main theme.

Then, generate ${numberOfImages} numbered "Variations". Each variation must be a single, detailed paragraph describing a unique, photorealistic background scene that fits the Creative Concept. Ensure the variations are diverse in context and environment.`;
        } else {
            basePrompt = `You are a world-class creative director. Your task is to generate a creative concept with ${numberOfImages} variations, inspired by the provided images but **NOT** as a direct copy.

**CRITICAL INSTRUCTION:** Do NOT try to perfectly preserve the subject from the 'Base Image'. Instead, interpret its essence, style, and subject matter. Your goal is **creative interpretation**, not photorealistic integration. You have the freedom to reimagine the subject within a new, cohesive scene.

Analyze all provided information:
- Base Image: A source of inspiration for the main subject's theme and style.
- Reference Images: These further establish the mood, style, texture, and color palette.
- User Scene Description: ${sceneDescription || 'No specific description provided.'}
- Lighting Style: ${lighting}
- Aspect Ratio: ${aspectRatio}
- Camera Perspective: ${cameraPerspective}
- Target Size Information: ${sizeInfo}${negativePromptInfo}

Based on this, first write a short, overarching "Creative Concept" that sets the main theme.

Then, generate ${numberOfImages} numbered "Variations". Each variation must be a single, detailed paragraph describing a unique, imaginative scene that fits the Creative Concept.`;
        }
    } else {
        basePrompt = `You are a world-class creative director. Your task is to generate one cohesive creative concept with ${numberOfImages} distinct variations for an image to be generated from scratch based on a user's description.

Analyze all provided information:
- Reference Images (if any): These establish the mood, style, texture, and color palette.
- User Scene Description: ${sceneDescription || 'Please create a beautiful and interesting image.'}
- Lighting Style: ${lighting}
- Aspect Ratio: ${aspectRatio}
- Camera Perspective: ${cameraPerspective}
- Target Size Information: ${sizeInfo}${negativePromptInfo}

Based on this, first write a short, overarching "Creative Concept" that sets the main theme.

Then, generate ${numberOfImages} numbered "Variations". Each variation must be a single, detailed paragraph describing a unique, photorealistic scene to be generated based on the Creative Concept. Ensure the variations are diverse in context and environment. The prompts should be detailed enough for an AI image generator to create a high-quality image.`;
    }

    promptParts.push({ text: basePrompt });

    const imageFileToPart = async (imageFile: ImageFile, label: string) => {
        const base64 = await fileToBase64(imageFile.file);
        promptParts.push({ text: `\n[${label}: ${imageFile.file.name}]`});
        promptParts.push({ inlineData: base64 });
    };
    
    const imagePromises = [];
    if (baseImage) {
        imagePromises.push(imageFileToPart(baseImage, 'Base Image'));
    }
    referenceImages.forEach(img => imagePromises.push(imageFileToPart(img, 'Reference Image')));
    
    await Promise.all(imagePromises);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: promptParts },
        config: {
            seed,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    creativeConcept: {
                        type: Type.STRING,
                        description: 'A short, overarching theme for the photoshoot.'
                    },
                    variations: {
                        type: Type.ARRAY,
                        items: {
                           type: Type.STRING,
                           description: 'A single, detailed paragraph describing a unique, photorealistic background scene variation.'
                        },
                        minItems: numberOfImages,
                        maxItems: numberOfImages,
                    }
                },
                required: ["creativeConcept", "variations"]
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        if (result.creativeConcept && result.variations && Array.isArray(result.variations) && result.variations.length === numberOfImages) {
            return result;
        }
    } catch (e) {
        console.error("Failed to parse JSON response:", response.text);
        throw new Error("Failed to generate prompts. The AI returned an invalid format.");
    }
    
    throw new Error('Failed to generate prompts. The response was empty or invalid.');
};


export const editProductImage = async (
    ai: GoogleGenAI,
    productImage: { mimeType: string; data: string },
    prompt: string,
    negativePrompt: string,
    seed?: number,
    maskImage?: { mimeType: string; data: string } | null
): Promise<string> => {
    
    const negativePromptInstruction = negativePrompt.trim()
        ? `\n\n**IMPORTANT: AVOID THE FOLLOWING:** Do not include any elements described here: "${negativePrompt}"`
        : '';
        
    let finalPrompt: string;
    // FIX: Explicitly type `parts` to allow both `inlineData` and `text` parts.
    // TypeScript's type inference was too narrow, causing an error when trying to push a `text` part.
    const parts: ({ inlineData: { mimeType: string; data: string; } } | { text: string })[] = [{ inlineData: productImage }];

    if (maskImage) {
        // In-painting mode
        finalPrompt = `You are an expert AI image editor performing an in-painting task. The user has provided a base image, a mask, and a text prompt.
Your task is to generate a new image where ONLY the area indicated by the mask is modified according to the user's prompt. The rest of the image must remain completely unchanged.
Ensure the generated content within the mask blends seamlessly with the surrounding, un-masked area, matching lighting, shadows, textures, and perspective.

The user's prompt for the masked area is: "${prompt}"
${negativePromptInstruction}

Generate only the final, edited image.`;
        parts.push({ inlineData: maskImage }); // Add mask as the second image part
        parts.push({ text: finalPrompt }); // Add text prompt
    } else {
        // Regular editing/background replacement mode
        finalPrompt = `You are an expert AI image editor. A user has provided a base image and a text prompt. Your task is to generate a new image based on their request. Analyze the user's prompt to understand their intent:

1.  **Background Replacement:** If the prompt describes a scene, environment, or background (e.g., "on a wooden table," "in a futuristic city"), your goal is to place the subject from the base image into that new background. Ensure seamless integration, matching lighting, shadows, and perspective. The subject itself should not be altered.

2.  **Direct Image Editing/Recreation:** If the prompt asks to modify the subject itself (e.g., "change the color to red," "make this a cartoon," "recreate this as a logo/icon"), your goal is to apply that modification directly to the base image.

Your primary instruction is to follow the user's prompt precisely.

The user's prompt is: "${prompt}"
${negativePromptInstruction}

Generate only the final image based on this instruction.`;
        parts.push({ text: finalPrompt }); // Add text prompt
    }


    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: {
            seed,
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    
    const textPart = response.text;
    if (textPart) {
         throw new Error(`Image generation failed. Model response: ${textPart}`);
    }

    throw new Error('Image generation failed. No image data was returned.');
};

const mapAspectRatioForImagen = (aspectRatio: string): "1:1" | "3:4" | "4:3" | "9:16" | "16:9" => {
    const supportedRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];
    // Handle simple ratios like "1:1" but also complex ones from the dropdown like "1:1 (Square)"
    const ratioValue = aspectRatio.split(' ')[0];
    if (supportedRatios.includes(ratioValue)) {
        return ratioValue as "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
    }

    // Fallback for custom ratios by finding the closest supported one
    try {
        const parts = ratioValue.split(':').map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            const targetDecimal = parts[0] / parts[1];
            const supported = [
                { name: "1:1", val: 1 },
                { name: "4:3", val: 4/3 },
                { name: "3:4", val: 3/4 },
                { name: "16:9", val: 16/9 },
                { name: "9:16", val: 9/16 },
            ] as const;
            
            const closest = supported.reduce((prev, curr) => 
                Math.abs(curr.val - targetDecimal) < Math.abs(prev.val - targetDecimal) ? curr : prev
            );
            console.warn(`Unsupported aspect ratio '${aspectRatio}' for text-to-image. Falling back to closest supported ratio: '${closest.name}'.`);
            return closest.name;
        }
    } catch (e) {}

    console.warn(`Invalid aspect ratio '${aspectRatio}' for text-to-image generation, defaulting to '1:1'.`);
    return '1:1';
};

export const generateImageFromText = async (
    ai: GoogleGenAI,
    prompt: string,
    aspectRatio: string,
    negativePrompt: string,
    seed?: number
): Promise<string> => {
    const mappedAspectRatio = mapAspectRatioForImagen(aspectRatio);
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-01',
        prompt: prompt,
        config: {
            seed,
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: mappedAspectRatio,
            negativePrompt: negativePrompt,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }
    
    throw new Error('Image generation failed. No image data was returned from the text-to-image model.');
};


export const upscaleImage = async (
    ai: GoogleGenAI,
    base64Image: string,
    upscaleLevel: string,
    mimeType: string = 'image/png'
): Promise<string> => {
    const imagePart = {
        inlineData: {
            mimeType: mimeType,
            data: base64Image,
        },
    };

    const resolutionText = upscaleLevel === '4x'
        ? 'approximately 4K resolution (e.g., 4096x4096)'
        : 'approximately 2K resolution (e.g., 2048x2048)';
    
    const prompt = `You are an expert digital artist specializing in ultra-high-resolution remastering. Your task is to upscale the provided image to ${resolutionText}, making it incredibly sharp and detailed.

Your goal is to make the image look as if it were natively captured at this higher resolution. Intelligently add fine-grained, plausible details where the original is blurry or soft. Sharpen key edges without creating harsh halos, refine textures (like skin, fabric, wood, metal), and enhance the subtle nuances in lighting and shadows.

**Crucially, you must strictly preserve the original art style, composition, subjects, and overall color palette.** Do not add, remove, or change any objects or characters. The final output must be a stunningly crisp and detailed version of the exact same image.`;
    
    const parts = [ imagePart, { text: prompt } ];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    
    const textPart = response.text;
    if (textPart) {
         throw new Error(`Image upscaling failed. Model response: ${textPart}`);
    }

    throw new Error('Image upscaling failed. No image data was returned.');
};
