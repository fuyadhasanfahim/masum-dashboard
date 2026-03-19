import { create } from 'zustand';
import { OrderStore, OrderParams } from './order.types';
import { getOrders } from '@/services/order.service';

const initialState = {
    orders: [],
    selectedOrder: null,
    pagination: null,
    params: {
        search: '',
        page: 1,
        perPage: 10,
    },
    isLoading: false,
    error: null,
};

const useOrderStore = create<OrderStore>()((set, get) => ({
    ...initialState,

    setParams: (params: OrderParams) => {
        set((state) => ({
            params: { ...state.params, ...params },
        }));
        get().fetchOrders();
    },

    fetchOrders: async () => {
        const { params } = get();
        set({ isLoading: true, error: null });
        try {
            const res = await getOrders(params);
            set({
                orders: res.data,
                pagination: res.pagination,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Unknown error',
                isLoading: false,
            });
        }
    },

    setSelectedOrder: (order) => set({ selectedOrder: order }),
    reset: () => set(initialState),
}));

export default useOrderStore;
