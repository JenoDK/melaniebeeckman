import type { Language } from '@i18n/utils.ts';

interface Props {
    endpoint: string;
    query?: Record<string, string>;
    wrappedByKey?: string;
    wrappedByList?: boolean;
    locale?: Language;
}

const STRAPI_URL = import.meta.env.STRAPI_API_URL;
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN;

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @param locale - the locale to fetch from
 * @returns
 */
export default async function fetchApi<T>({
                                              endpoint,
                                              query,
                                              wrappedByKey,
                                              wrappedByList,
                                              locale,
                                          }: Props): Promise<T> {
    if (endpoint.startsWith('/')) {
        endpoint = endpoint.slice(1);
    }

    const url = new URL(`${STRAPI_URL}/api/${endpoint}`);

    if (locale) {
        url.searchParams.append('locale', locale);
    }

    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }
    const res = await fetch(url.toString(), {
        headers: {
            'Authorization': `Bearer ${STRAPI_TOKEN}`
        }
    });
    let data = await res.json();
    console.debug(`Response for ${url.toString()}: ${res.status} ${res.statusText}: ${JSON.stringify(data)}`);

    if (wrappedByKey) {
        data = data[wrappedByKey];
    }

    if (wrappedByList) {
        data = data[0];
    }

    return data as T;
}