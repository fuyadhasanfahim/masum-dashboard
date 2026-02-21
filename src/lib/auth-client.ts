import { createAuthClient } from 'better-auth/react';
import { adminClient, jwtClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
    plugins: [adminClient(), jwtClient()],
});

export const {
    signIn,
    signOut,
    signUp,
    useSession,
    sendVerificationEmail,
    updateUser,
} = authClient;
