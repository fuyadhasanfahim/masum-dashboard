import { User } from 'better-auth';
import { IClient } from './client.type';

type Ref<T> = string | T;

export interface IEarning {
    _id: string;
    user: Ref<User>;

    client: Ref<IClient>;
    month: number;
    year: number;
    status: 'unpaid' | 'partial' | 'paid';

    createdAt: Date;
    updatedAt: Date;
}

export interface IEarningAggregated {
    _id: string;
    client: IClient;
    month: number;
    year: number;
    totalImages: number;
    totalPrice: number;
    orderCount: number;
    status: 'unpaid' | 'partial' | 'paid';
}

export type IEarnings = IEarningAggregated[];
