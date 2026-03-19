import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function getServerUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error('User not authenticated');
    }

    return session.user;
}
