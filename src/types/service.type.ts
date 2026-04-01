import { User } from 'better-auth';

type Ref<T> = string | T;

export interface IService {
    _id: string;
    user: Ref<User>;
    name: string;
    description?: string;

    createdAt: Date;
    updatedAt: Date;
}

export type IServices = IService[];
