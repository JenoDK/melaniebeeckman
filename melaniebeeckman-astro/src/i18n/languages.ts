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
    nav: {
        home: string;
        research: string;
        papers: string;
        cv: string;
        contact: string;
    };
    home: {
        welcome: string;
    }
    services: {
        title: string;
        moreInfo: string;
        allServices: string;
        servicePrices: string;
        appointment: string;
    }
    faqs: {
        title: string;
    }
}