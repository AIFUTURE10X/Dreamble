
export const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const data = result.split(',')[1];
            resolve({ mimeType: file.type, data });
        };
        reader.onerror = (error) => reject(error);
    });
};

export const resizeImageWithPadding = async (
    file: File, 
    aspectRatioString: string
): Promise<{ mimeType: string; data: string }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;

        img.onload = () => {
            try {
                // Parse aspect ratio string e.g., "9:16 (Tall)" -> 9/16
                const ratioParts = aspectRatioString.split(' ')[0].split(':').map(Number);
                if (ratioParts.length !== 2 || isNaN(ratioParts[0]) || isNaN(ratioParts[1])) {
                    throw new Error(`Invalid aspect ratio string: ${aspectRatioString}`);
                }
                const targetRatio = ratioParts[0] / ratioParts[1];

                const { naturalWidth: imgWidth, naturalHeight: imgHeight } = img;
                const originalRatio = imgWidth / imgHeight;

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    throw new Error('Could not get canvas context');
                }

                let canvasWidth: number;
                let canvasHeight: number;

                // Determine canvas dimensions
                if (originalRatio > targetRatio) {
                    // Original image is wider than target, add padding top/bottom (letterbox)
                    canvasWidth = imgWidth;
                    canvasHeight = imgWidth / targetRatio;
                } else {
                    // Original image is taller than target, add padding left/right (pillarbox)
                    canvasHeight = imgHeight;
                    canvasWidth = imgHeight * targetRatio;
                }

                canvas.width = canvasWidth;
                canvas.height = canvasHeight;

                // Draw image centered on the canvas
                const x = (canvasWidth - imgWidth) / 2;
                const y = (canvasHeight - imgHeight) / 2;
                ctx.drawImage(img, x, y, imgWidth, imgHeight);

                // Export to base64, using PNG to preserve potential transparency in padding
                const dataUrl = canvas.toDataURL('image/png');
                const data = dataUrl.split(',')[1];

                resolve({ mimeType: 'image/png', data });

            } catch (error) {
                reject(error);
            } finally {
                URL.revokeObjectURL(objectUrl);
            }
        };

        img.onerror = (error) => {
            URL.revokeObjectURL(objectUrl);
            reject(error);
        };
    });
};

export const resizeAndPadMask = async (
    maskDataUrl: string,
    aspectRatioString: string
): Promise<{ mimeType: string; data: string }> => {
     return new Promise((resolve, reject) => {
        const maskImg = new Image();
        maskImg.src = maskDataUrl;

        maskImg.onload = () => {
             try {
                const ratioParts = aspectRatioString.split(' ')[0].split(':').map(Number);
                if (ratioParts.length !== 2 || isNaN(ratioParts[0]) || isNaN(ratioParts[1])) {
                    throw new Error(`Invalid aspect ratio string: ${aspectRatioString}`);
                }
                const targetRatio = ratioParts[0] / ratioParts[1];

                const { naturalWidth: imgWidth, naturalHeight: imgHeight } = maskImg;
                const originalRatio = imgWidth / imgHeight;

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                 if (!ctx) throw new Error('Could not get canvas context');

                let canvasWidth: number, canvasHeight: number;

                if (originalRatio > targetRatio) {
                    canvasWidth = imgWidth;
                    canvasHeight = imgWidth / targetRatio;
                } else {
                    canvasHeight = imgHeight;
                    canvasWidth = imgHeight * targetRatio;
                }

                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                
                // Fill with black first, as the model expects black for unmasked areas
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                // Draw the (mostly transparent with white lines) mask centered on the canvas
                const x = (canvasWidth - imgWidth) / 2;
                const y = (canvasHeight - imgHeight) / 2;
                ctx.drawImage(maskImg, x, y, imgWidth, imgHeight);

                const finalMaskDataUrl = canvas.toDataURL('image/png');
                const data = finalMaskDataUrl.split(',')[1];

                resolve({ mimeType: 'image/png', data });

            } catch (error) {
                reject(error);
            }
        };

        maskImg.onerror = (error) => {
            reject(error);
        };
    });
};


export const base64ToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
};

export const resizeBase64Image = (base64Data: string, width: number, height: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `data:image/png;base64,${base64Data}`;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return reject(new Error('Could not get 2D context from canvas'));
            }
            
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            
            const resizedDataUrl = canvas.toDataURL('image/png');
            // Return just the base64 part, without the 'data:image/png;base64,' prefix
            resolve(resizedDataUrl.substring(resizedDataUrl.indexOf(',') + 1));
        };
        img.onerror = () => {
            reject(new Error('Failed to load image for resizing.'));
        };
    });
};
