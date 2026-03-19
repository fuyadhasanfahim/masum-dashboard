import { IEarningAggregated } from '@/types/earning.type';

export interface GetEarningsResponse {
    success: boolean;
    data: IEarningAggregated[];
}

export const getEarnings = async (): Promise<GetEarningsResponse> => {
    const res = await fetch('/api/earnings/get-earnings', {
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch earnings');

    return res.json();
};
