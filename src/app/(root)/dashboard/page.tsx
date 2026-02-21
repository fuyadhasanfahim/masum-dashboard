'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authClient } from '@/lib/auth-client';

export default function UserProfile() {
    const { data: session, isPending, error } = authClient.useSession();

    if (isPending) return <div> Loading... </div>;
    if (error) return <div> Error: {error.message} </div>;
    if (!session) return <div> Not signed in </div>;

    return (
        <div>
            <div>
                <Avatar>
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p> Name: {session.user.name} </p>{' '}
                    <p> Email: {session.user.email} </p>{' '}
                </div>
            </div>
        </div>
    );
}
