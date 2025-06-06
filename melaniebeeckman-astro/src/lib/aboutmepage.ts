import type { Language } from '@i18n/utils';
import fetchApi from '@lib/strapi';
import qs from 'qs';
import type { StrapiMedia } from '@interfaces/strapi-media';

// Define the AboutPage interface
export interface AboutPage {
    id: number;
    title: string;
    pictures?: StrapiMedia[];
    description: string;
    education: string;
    research_and_publications: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    locale?: string;
}

// Default about page value as fallback
export const DEFAULT_ABOUTPAGE: AboutPage = {
    id: 1,
    title: "Over Mij",
    description: "Ik ben Melanie Beeckman, klinisch psycholoog. Met meer dan 10 jaar ervaring in het veld, focus ik me op het bieden van persoonlijke, evidence-based therapie voor volwassenen en jongvolwassenen. Mijn aanpak is warm, empathisch en gericht op jouw individuele behoeften.",
    education: "## Opleiding\n\n- Master in Klinische Psychologie, Universiteit Gent (2012)\n- Postgraduaat Cognitieve Gedragstherapie, UGent (2014)\n- Opleiding Mindfulness-Based Cognitive Therapy, UGent (2016)\n- Yoga Teacher Training, Yoga Alliance (2018)",
    research_and_publications: "## Onderzoek & Publicaties\n\n- Beeckman, M. (2019). \"Mindfulness integreren in psychotherapie: Een praktische gids\". *Tijdschrift voor Psychotherapie*.\n- Beeckman, M. & Janssens, K. (2017). \"Effecten van mindfulness bij burn-out klachten\". *Gedragstherapie*.",
    createdAt: "2025-01-15T12:00:00.000Z",
    updatedAt: "2025-01-15T12:00:00.000Z",
    publishedAt: "2025-01-15T12:00:00.000Z",
    locale: "nl"
};

/**
 * Fetches the about page data from Strapi with proper error handling and default values
 * @param lang The language code to fetch content for
 * @returns Promise with AboutPage
 */
export async function getAboutPage(lang: Language): Promise<AboutPage> {
    try {
        const query = qs.stringify({
            populate: ['pictures'],
        }, {
            encodeValuesOnly: true, // prettify URL
        });

        const aboutPage = await fetchApi<AboutPage>({
            endpoint: 'aboutpage',
            wrappedByKey: 'data',
            query,
            locale: lang
        });

        return aboutPage ?? DEFAULT_ABOUTPAGE;
    } catch (error) {
        console.error('Failed to fetch about page:', error);
        return DEFAULT_ABOUTPAGE;
    }
}