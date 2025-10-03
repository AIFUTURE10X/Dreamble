
export interface ImageFile {
  file: File;
  preview: string;
  width?: number;
  height?: number;
}

export interface HistoryItem {
  id: string;
  image: string;
  prompt: string;
  negativePrompt?: string;
  createdAt: number;
  seed?: number;
}

export interface GeneratedImage {
  id: string;
  src: string;
  width: number;
  height: number;
  prompt: string;
  negativePrompt?: string;
  seed?: number;
}