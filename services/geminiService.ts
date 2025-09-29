import { GoogleGenAI, Modality, Type } from '@google/genai';
import type { ImageFile } from '../types';
import { fileToBase64 } from './imageService';

interface PromptGenerationConfig {
    sceneDescription?: string;
    baseImage: ImageFile | null;
    referenceImages: ImageFile[];
    lighting: string;
    aspectRatio: string;
    cameraPerspective: string;
    numberOfImages: number;
}

interface CreativeConcept {
    creativeConcept: string;
    variations: string[];
}

export const generateDetailedPrompts = async (
    ai: GoogleGenAI,
    config: PromptGenerationConfig
): Promise<CreativeConcept> => {
    const { sceneDescription, baseImage, referenceImages, lighting, aspectRatio, cameraPerspective, numberOfImages } = config;

    const promptParts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [];
    
    let basePrompt: string;

    if (baseImage) {
        basePrompt = `You are a world-class creative director for a high-end product photoshoot. Your task is to generate one cohesive creative concept with ${numberOfImages} distinct variations for a product background scene.

**CRITICAL INSTRUCTION:** The subject from the 'Base Image' is the hero. It must remain **perfectly consistent, unchanged, and photorealistically integrated** across all ${numberOfImages} variations. Do NOT alter the subject. Only change the background scene.

Analyze all provided information:
- Base Image: The primary subject to be placed in each scene.
- Reference Images: These establish the mood, style, texture, and color palette.
- User Scene Description: ${sceneDescription || 'No specific description provided.'}
- Lighting Style: ${lighting}
- Aspect Ratio: ${aspectRatio}
- Camera Perspective: ${cameraPerspective}

Based on this, first write a short, overarching "Creative Concept" that sets the main theme.

Then, generate ${numberOfImages} numbered "Variations". Each variation must be a single, detailed paragraph describing a unique, photorealistic background scene that fits the Creative Concept. Ensure the variations are diverse in context and environment.`;
    } else {
        basePrompt = `You are a world-class creative director. Your task is to generate one cohesive creative concept with ${numberOfImages} distinct variations for an image to be generated from scratch based on a user's description.

Analyze all provided information:
- Reference Images (if any): These establish the mood, style, texture, and color palette.
- User Scene Description: ${sceneDescription || 'Please create a beautiful and interesting image.'}
- Lighting Style: ${lighting}
- Aspect Ratio: ${aspectRatio}
- Camera Perspective: ${cameraPerspective}

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
    prompt: string
): Promise<string> => {
    
    const finalPrompt = `Carefully place the provided product image onto a new background. The background scene should be exactly as described here: "${prompt}". Ensure the product is seamlessly integrated with the new background, matching the lighting, shadows, and perspective described. The final output should be a photorealistic image.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { inlineData: productImage },
                { text: finalPrompt },
            ],
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
         throw new Error(`Image generation failed. Model response: ${textPart}`);
    }

    throw new Error('Image generation failed. No image data was returned.');
};

const mapAspectRatioForImagen = (aspectRatio: string): "1:1" | "3:4" | "4:3" | "9:16" | "16:9" => {
    const supportedRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];
    if (supportedRatios.includes(aspectRatio)) {
        return aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
    }
    console.warn(`Unsupported aspect ratio '${aspectRatio}' for text-to-image generation, defaulting to '1:1'.`);
    return '1:1';
};

export const generateImageFromText = async (
    ai: GoogleGenAI,
    prompt: string,
    aspectRatio: string
): Promise<string> => {
    const mappedAspectRatio = mapAspectRatioForImagen(aspectRatio);
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
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