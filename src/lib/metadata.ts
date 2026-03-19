import { getServerUser } from '@/services/user';
import { Metadata } from 'next';

const defaultName = 'Dashboard';

export const config = {
    url: process.env.NEXT_PUBLIC_APP_URL!,
    description:
        'A personal dashboard built with Next.js, TypeScript, and Tailwind CSS. View your profile, manage your account, and explore the features of the dashboard.',
};

export async function createMetadata(
    pageTitle: string,
    pageDescription?: string,
): Promise<Metadata> {
    let name = defaultName;
    try {
        const user = await getServerUser();
        name = user.name || defaultName;
    } catch {
        // fallback to default name if not authenticated
    }

    const title = `${pageTitle} | ${name}`;
    const description = pageDescription || config.description;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: config.url,
            type: 'website',
            siteName: name,
        },
    };
}
