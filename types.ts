
export interface ImageFile {
  file: File;
  preview: string;
}

export interface HistoryItem {
  id: string;
  image: string;
  prompt: string;
  createdAt: number;
}
