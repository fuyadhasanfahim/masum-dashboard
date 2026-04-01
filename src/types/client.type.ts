import { User } from 'better-auth';

type Ref<T> = string | T;

export interface IClient {
    _id: string;
    user: Ref<User>;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    currency?: string;

    createdAt: Date;
    updatedAt: Date;
}

export type IClients = IClient[];
