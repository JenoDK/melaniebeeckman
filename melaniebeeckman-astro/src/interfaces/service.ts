import type { StrapiMedia } from '@interfaces/strapi-media.ts';
import type { Price } from '@interfaces/price.ts';

export interface Service {
    id: number;
    title: string;
    description: string;
    slug: string;
    icon?: StrapiMedia;
    prices?: Price[];
    showPrices?: boolean;
    appointmentLink?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
}