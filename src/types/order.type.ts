import { User } from 'better-auth';
import { IService } from './service.type';
import { IClient } from './client.type';

type Ref<T> = string | T;

export interface IOrder {
    _id: string;

    user: Ref<User>;
    client?: Ref<IClient>;
    service?: Ref<IService>;

    title?: string;
    images?: number;
    downloadLink?: string;
    localFileLocation?: string;

    perImagePrice?: number;
    totalPrice?: number;

    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';

    createdAt: Date;
    updatedAt: Date;
}

export type IOrders = IOrder[];
