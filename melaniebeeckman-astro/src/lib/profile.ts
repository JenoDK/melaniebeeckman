// src/lib/profile.ts
import type { Profile } from '@interfaces/profile';
import type { Language } from '@i18n/utils';
import fetchApi from '@lib/strapi';
import { DEFAULT_PROFILE } from '@interfaces/profile';
import ProfilePicture from '@assets/profile_picture.png';

/**
 * Fetches the profile data from Strapi with proper error handling and default values
 */
export async function getProfile(lang: Language): Promise<Profile> {
    try {
        const profile = await fetchApi<Profile>({
            endpoint: 'profile',
            wrappedByKey: 'data',
            query: {
                'populate': 'profilePicture'
            },
            locale: lang
        });

        return profile ?? DEFAULT_PROFILE;
    } catch (error) {
        console.error('Failed to fetch profile:', error);
        return DEFAULT_PROFILE;
    }
}

/**
 * Returns the formatted profile picture URL or default image
 */
export function getProfilePicture(profile: Profile): any {
    return profile.profilePicture?.url
        ? `${import.meta.env.STRAPI_API_URL}${profile.profilePicture.url}`
        : ProfilePicture;
}

/**
 * Returns the full name from profile data
 */
export function getFullName(profile: Profile): string {
    return `${profile.firstname} ${profile.lastname}`;
}

/**
 * Convenience function to get profile data along with derived values
 * Returns an object with profile data and formatted values
 */
export async function getProfileData(lang: Language): Promise<{
    profile: Profile;
    profilePicture: any;
    fullName: string;
}> {
    const profile = await getProfile(lang);
    const profilePicture = getProfilePicture(profile);
    const fullName = getFullName(profile);

    return {
        profile,
        profilePicture,
        fullName
    };
}