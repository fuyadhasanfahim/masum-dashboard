import { IOrder } from '@/types/order.type';
import { OrderParams, OrderPagination } from '@/store/order/order.types';

export interface GetOrdersResponse {
    success: boolean;
    data: IOrder[];
    pagination: OrderPagination;
}

export const getOrders = async (
    params: OrderParams = {},
): Promise<GetOrdersResponse> => {
    const { search = '', page = 1, perPage = 10 } = params;

    const searchParams = new URLSearchParams({
        search,
        page: String(page),
        perPage: String(perPage),
    });

    const res = await fetch(`/api/orders/get-orders?${searchParams}`, {
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch orders');

    return res.json();
};
