import { create } from 'zustand';
import { EarningStore } from './earning.types';
import { getEarnings } from '@/services/earning.service';

const initialState = {
    earnings: [],
    isLoading: false,
    error: null,
};

const useEarningStore = create<EarningStore>()((set) => ({
    ...initialState,

    fetchEarnings: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await getEarnings();
            set({
                earnings: res.data,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Unknown error',
                isLoading: false,
            });
        }
    },

    reset: () => set(initialState),
}));

export default useEarningStore;
