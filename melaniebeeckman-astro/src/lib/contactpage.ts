import type { Language } from '@i18n/utils';
import fetchApi from '@lib/strapi';
import qs from 'qs';
import type { Location } from '@interfaces/location';

// Define the ContactPage interface
export interface ContactPage {
    id: number;
    title: string;
    contact_intro: string;
    phone: string;
    email: string;
    locations?: Location[];
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    locale?: string;
}

// Default contact page value as fallback
export const DEFAULT_CONTACTPAGE: ContactPage = {
    id: 1,
    title: "Contact",
    contact_intro: "Neem contact met mij op voor vragen of om een afspraak te maken. Ik sta klaar om te helpen en kijk ernaar uit van je te horen.",
    phone: "+32 123 456 789",
    email: "info@example.com",
    locations: [],
    createdAt: "2025-01-15T12:00:00.000Z",
    updatedAt: "2025-01-15T12:00:00.000Z",
    publishedAt: "2025-01-15T12:00:00.000Z",
    locale: "nl"
};

/**
 * Fetches the contact page data from Strapi with proper error handling and default values
 * @param lang The language code to fetch content for
 * @returns Promise with ContactPage
 */
export async function getContactPage(lang: Language): Promise<ContactPage> {
    try {
        const query = qs.stringify({
            populate: ['locations'],
        }, {
            encodeValuesOnly: true, // prettify URL
        });

        const contactPage = await fetchApi<ContactPage>({
            endpoint: 'contactpage',
            wrappedByKey: 'data',
            query,
            locale: lang
        });

        return contactPage ?? DEFAULT_CONTACTPAGE;
    } catch (error) {
        console.error('Failed to fetch contact page:', error);
        return DEFAULT_CONTACTPAGE;
    }
}