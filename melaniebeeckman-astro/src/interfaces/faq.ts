export interface FaqCategory {
    id: number;
    category: string;
}

export interface Faq {
    id: number;
    question: string;
    answer: string;
    faqSlug: string;
    faqCategory: FaqCategory;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
}