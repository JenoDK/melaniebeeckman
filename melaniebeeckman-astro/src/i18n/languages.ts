export const languages = {
    nl: 'Nederlands',
    en: 'English',
    fr: 'Français',
};

export const defaultLang = 'nl';

export type Translations = {
    default_title: string;
    default_description: string;
    404: {
        title: string;
        description: string;
        goHome: string;
    };
}