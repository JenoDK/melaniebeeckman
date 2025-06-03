import { languages, defaultLang as defaultLanguage } from './languages.ts';
import { en } from '@i18n/translations/en.ts';
import { nl } from '@i18n/translations/nl.ts';
import { fr } from '@i18n/translations/fr.ts';

export type Language = keyof typeof languages;
const translationsMap = { en, nl, fr };

export function getAsLanguage(lang?: string, defaultLang: string = defaultLanguage) {
    return (lang && Object.keys(languages).includes(lang) ? lang : defaultLang) as Language;
}

export function getLanguagePaths() {
    return Object.keys(languages).map((lang) => ({ params: { lang } }));
}

export function translate(lang: Language, key: string): string | undefined {
    const translations = translationsMap[lang];

    // Helper function to resolve nested keys
    const resolveKey = (obj: any, path: string): any => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    return resolveKey(translations, key) || key;
}