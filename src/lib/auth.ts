import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { admin, jwt } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { db, client } from './db';

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            accessType: 'offline',
            prompt: 'select_account consent',
        },
    },
    user: { modelName: 'users' },
    plugins: [admin(), jwt(), nextCookies()],
});
