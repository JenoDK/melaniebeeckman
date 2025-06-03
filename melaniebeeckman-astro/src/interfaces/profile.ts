import type { StrapiMedia } from '@interfaces/strapi-media.ts';

export interface Profile {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    title: string;
    description: string;
    profilePicture?: StrapiMedia;
}

export const DEFAULT_PROFILE: Profile = {
    id: 1,
    email: "marie.curie@research.org",
    firstname: "Marie",
    lastname: "Curie",
    phone: "+33 1 23 45 67 89",
    title: "Professor of Physics & Chemistry",
    description: "Professor of Physics & Chemistry",
};
