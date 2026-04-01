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

export interface CreateOrderData {
    title?: string;
    images?: number;
    downloadLink?: string;
    localFileLocation?: string;
    perImagePrice?: number;
    totalPrice?: number;
    client?: string;
    service?: string;
    date?: string | Date;
}

export interface OrderState {
    orders: IOrder[];
    selectedOrder: IOrder | null;
    pagination: OrderPagination | null;
    params: OrderParams;
    isLoading: boolean;
    isCreating: boolean;
    error: string | null;
}

export interface OrderActions {
    fetchOrders: () => Promise<void>;
    createOrder: (data: CreateOrderData) => Promise<boolean>;
    setParams: (params: OrderParams) => void;
    setSelectedOrder: (order: IOrder | null) => void;
    reset: () => void;
}

export type OrderStore = OrderState & OrderActions;
