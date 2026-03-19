import { getServerUser } from '@/services/user';
import { Metadata } from 'next';

const user = await getServerUser();

export const config = {
    name: user.name || 'Fuyad Hasan Fahim',
    url: process.env.NEXT_PUBLIC_APP_URL!,
    description:
        'A personal dashboard built with Next.js, TypeScript, and Tailwind CSS. View your profile, manage your account, and explore the features of the dashboard.',
};

export function createMetadata(
    pageTitle: string,
    pageDescription?: string,
): Metadata {
    const title = `${pageTitle} | ${config.name}`;
    const description = pageDescription || config.description;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: config.url,
            type: 'website',
            siteName: config.name,
        },
    };
}
