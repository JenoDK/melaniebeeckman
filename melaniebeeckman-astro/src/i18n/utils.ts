import { defaultLang, languages } from './languages.ts';
import { en } from '@i18n/translations/en.ts';
import { nl } from '@i18n/translations/nl.ts';
import { fr } from '@i18n/translations/fr.ts';

export type Language = keyof typeof languages;
const translationsMap = { en, nl, fr };

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in languages) return lang as Language;
    return defaultLang;
}

export function translate(lang: Language, key: string): string | undefined {
    const translations = translationsMap[lang];

    // Helper function to resolve nested keys
    const resolveKey = (obj: any, path: string): any => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    return resolveKey(translations, key) || key;
}