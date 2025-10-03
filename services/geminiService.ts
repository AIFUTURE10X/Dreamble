

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
    config: PromptGenerationConfig
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
    maskImage?: { mimeType: string; data: string } | null
): Promise<string> => {
    
    const combinedNegativePrompt = ['watermarks', 'text', 'logos', negativePrompt.trim()].filter(Boolean).join(', ');
        
    const negativePromptInstruction = combinedNegativePrompt.trim()
        ? `4.  **Negative Prompt (AVOID THESE):** "${combinedNegativePrompt}"`
        : '';
        
    const finalPrompt = `You are an expert AI photo editor specializing in seamless outpainting and in-painting.

**Your Task:**
Modify the provided 'Base Image' according to the 'Mask' and 'User Prompt'.

**Analysis of Inputs:**
1.  **Base Image:** The starting photograph.
2.  **Mask Image:** A black-and-white map.
    *   **BLACK Area:** This is the protected region. You MUST preserve this area perfectly, without any changes.
    *   **WHITE Area:** This is the editing region. You must generate new content here.
3.  **User Prompt:** "${prompt}"
${negativePromptInstruction}

**Critical Instructions:**
-   **Seamless Extension:** Your primary goal is to realistically and seamlessly EXTEND the scene from the Base Image into the WHITE areas of the mask. The transition must be invisible. Match lighting, shadows, perspective, textures, and overall mood.
-   **NO Mirroring or Repeating:** Do NOT simply mirror, repeat, or tile patterns from the edges of the original image. Generate new, coherent content that logically continues the scene.
-   **NO Borders or Frames:** The output must be a single, complete image. Do not add any black bars, white borders, frames, or letterboxing.
-   **Strict Dimension Matching:** The final output image MUST have the exact same dimensions (width and height) as the input Base Image. Do not crop, resize, or change the aspect ratio.

Based on these instructions, generate the final edited image.`;

    if (!maskImage) {
        // This should ideally not be reached if the app logic is correct, as a mask is always generated for outpainting.
        throw new Error("A mask must be provided to edit an image. This indicates a logic error in the calling code.");
    }

    const parts: ({ inlineData: { mimeType: string; data: string; } } | { text: string })[] = [
        { inlineData: productImage },
        { inlineData: maskImage },
        { text: finalPrompt },
    ];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
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
    negativePrompt: string
): Promise<string> => {
    const mappedAspectRatio = mapAspectRatioForImagen(aspectRatio);
    
    const combinedNegativePrompt = ['watermarks', 'text', 'logos', negativePrompt.trim()].filter(Boolean).join(', ');
    
    let finalPrompt = prompt;
    if (combinedNegativePrompt) {
        finalPrompt = `${prompt}. Do not include: ${combinedNegativePrompt}`;
    }

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: finalPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: mappedAspectRatio,
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

Your goal is to make the image look as if it were originally captured with a high-end professional camera. Enhance details, textures, and clarity without introducing artificial artifacts. The final output must be just the upscaled image, with no text, watermarks, logos, or other modifications.`;

// FIX: The function was incomplete and did not call the API or return a value.
// Completed the function to call the Gemini API for image generation,
// process the response, and return the upscaled image data.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                imagePart,
                { text: prompt }
            ]
        },
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