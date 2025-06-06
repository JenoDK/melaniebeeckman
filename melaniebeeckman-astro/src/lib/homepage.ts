import type { Language } from '@i18n/utils';
import fetchApi from '@lib/strapi';
import type { Service } from '@interfaces/service';
import qs from 'qs';
import ProfilePicture from '@assets/profile_picture.png';
import type { Faq } from '@interfaces/faq.ts';

// Define the Homepage interface
export interface Homepage {
    id: number;
    name: string;
    title: string;
    description: string;
    profilePicture?: any;
    services?: Service[];
    faqs?: Faq[];
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    locale?: string;
}

// Default homepage value as fallback
export const DEFAULT_HOMEPAGE: Homepage = {
    id: 1,
    name: "Dr. Emma De Vries",
    title: "Klinisch Psycholoog in Gent",
    description: "Welkom. Ik ben Emma, klinisch psycholoog. Ik bied een veilige plek waar je terecht kan met je zorgen, van stress en angst tot levensvragen. Samen gaan we op zoek naar inzicht en veerkracht. Mijn aanpak is persoonsgericht, waarbij ik verschillende therapeutische methodes combineer afgestemd op jouw unieke situatie.",
    profilePicture: ProfilePicture,
    services: [
        {
            id: 1,
            title: "Individuele Therapie",
            description: "Individuele psychologische begeleiding voor volwassenen en jongvolwassenen. Samen werken we aan stress, burn-out, angstklachten, depressieve gevoelens, laag zelfbeeld, rouw en andere levensvragen.",
            slug: "individuele-therapie",
            prices: [
                {
                    id: 1,
                    title: "Intake Gesprek",
                    description: "Een eerste kennismakingsgesprek van 60 minuten waarin we je situatie bespreken.",
                    createdAt: "2025-01-15T12:00:00.000Z",
                    updatedAt: "2025-01-15T12:00:00.000Z",
                    publishedAt: "2025-01-15T12:00:00.000Z",
                    priceInEuros: 60,
                    locale: "nl"
                },
                {
                    id: 2,
                    title: "Vervolgsessie",
                    description: "Een therapiesessie van 50 minuten.",
                    createdAt: "2025-01-15T12:00:00.000Z",
                    updatedAt: "2025-01-15T12:00:00.000Z",
                    publishedAt: "2025-01-15T12:00:00.000Z",
                    priceInEuros: 50,
                    locale: "nl"
                }
            ],
            createdAt: "2025-01-15T12:00:00.000Z",
            updatedAt: "2025-01-15T12:00:00.000Z",
            publishedAt: "2025-01-15T12:00:00.000Z",
            locale: "nl"
        },
        {
            id: 2,
            title: "Eerstelijnspsychologische Zorg (ELP)",
            description: "Kortdurende begeleiding voor milde tot matige psychische klachten via de conventie. Een verwijsvoorschrift van je arts is nodig. Kosten: €11 per sessie (€4 bij verhoogde tegemoetkoming).",
            slug: "eerstelijnspsychologische-zorg",
            createdAt: "2025-01-15T12:00:00.000Z",
            updatedAt: "2025-01-15T12:00:00.000Z",
            publishedAt: "2025-01-15T12:00:00.000Z",
            locale: "nl"
        },
        {
            id: 3,
            title: "Mindfulness & Yoga",
            description: "Een combinatie van gesprek, lichaamswerk en aandachtstraining. Ideaal voor wie stress wil verminderen en meer in het moment wil leven.",
            slug: "mindfulness-yoga",
            createdAt: "2025-01-15T12:00:00.000Z",
            updatedAt: "2025-01-15T12:00:00.000Z",
            publishedAt: "2025-01-15T12:00:00.000Z",
            locale: "nl"
        }
    ],
    faqs: [],
    createdAt: "2025-01-15T12:00:00.000Z",
    updatedAt: "2025-01-15T12:00:00.000Z",
    publishedAt: "2025-01-15T12:00:00.000Z",
    locale: "nl"
};


/**
 * Fetches the homepage data from Strapi with proper error handling and default values
 * @param lang The language code to fetch content for
 * @returns Promise with Homepage
 */
export async function getHomepage(lang: Language): Promise<Homepage> {
    try {
        const query = qs.stringify({
            populate: ['services', 'services.icon', 'services.prices', 'profilePicture', 'faqs', 'faqs.faqCategory'],
        }, {
            encodeValuesOnly: true, // prettify URL
        });

        const homepage = await fetchApi<Homepage>({
            endpoint: 'homepage',
            wrappedByKey: 'data',
            query,
            locale: lang
        });

        return homepage ?? DEFAULT_HOMEPAGE;
    } catch (error) {
        console.error('Failed to fetch homepage:', error);
        return DEFAULT_HOMEPAGE;
    }
}

