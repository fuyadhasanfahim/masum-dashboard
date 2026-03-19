import { IOrder } from '@/types/order.type';

export interface OrderPagination {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

export interface OrderParams {
    search?: string;
    page?: number;
    perPage?: number;
}

export interface OrderState {
    orders: IOrder[];
    selectedOrder: IOrder | null;
    pagination: OrderPagination | null;
    params: OrderParams;
    isLoading: boolean;
    error: string | null;
}

export interface OrderActions {
    fetchOrders: () => Promise<void>;
    setParams: (params: OrderParams) => void;
    setSelectedOrder: (order: IOrder | null) => void;
    reset: () => void;
}

export type OrderStore = OrderState & OrderActions;
