import type { ImageMetadata } from 'astro';
import ProfilePicture from '@assets/profile_picture.png';

export interface StrapiMedia {
    id: number;
    name: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: {
        thumbnail?: {
            url: string;
            width: number;
            height: number;
        };
        small?: {
            url: string;
            width: number;
            height: number;
        };
        medium?: {
            url: string;
            width: number;
            height: number;
        };
        large?: {
            url: string;
            width: number;
            height: number;
        };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: any;
    createdAt: string;
    updatedAt: string;
}

/**
 * Type guard to check if the provided media is a StrapiMedia
 */
export function isStrapiMedia(media: any): media is StrapiMedia {
    return media && typeof media.url === 'string';
}

/**
 * Gets the appropriate URL for profile picture, handling both Strapi media and local images
 * @param media - The profile picture that can be either StrapiMedia or ImageMetadata
 * @returns The URL to the image or the default profile picture
 */
export function getMediaUrl(media: StrapiMedia | ImageMetadata | undefined): any {
    if (!media) {
        return ProfilePicture;
    }

    // If it's a Strapi media object with a URL
    if (isStrapiMedia(media)) {
        // Check if the URL is already absolute
        if (media.url.startsWith('http')) {
            return media.url;
        }
        // Otherwise prepend the Strapi API URL
        return `${import.meta.env.STRAPI_API_URL}${media.url}`;
    }

    // If it's an ImageMetadata (local image), return as is
    return media;
}


