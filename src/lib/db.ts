import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI!;

if (!uri) {
    throw new Error('MONGO_URI not provided.');
}

declare global {
    var _mongoClient: MongoClient | undefined;
}

const client = globalThis._mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV === 'development') {
    globalThis._mongoClient = client;
}

export { client };
export const db = client.db();
