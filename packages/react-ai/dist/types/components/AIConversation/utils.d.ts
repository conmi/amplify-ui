import { ImageContent } from '../../types';
export declare function formatDate(date: Date): string;
export declare function convertBufferToBase64(buffer: ArrayBuffer, format: ImageContent['format']): string;
export declare function getImageTypeFromMimeType(mimeType: string): 'png' | 'jpeg' | 'gif' | 'webp';