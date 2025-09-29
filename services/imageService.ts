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


export const base64ToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
};