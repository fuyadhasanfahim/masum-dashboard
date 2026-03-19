import { create } from 'zustand';
import { ServiceStore } from './service.types';
import { getServices } from '@/services/service.service';

const initialState = {
    services: [],
    isLoading: false,
    isCreating: false,
    error: null,
};

const useServiceStore = create<ServiceStore>()((set, get) => ({
    ...initialState,

    fetchServices: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await getServices();
            set({
                services: res.data,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Unknown error',
                isLoading: false,
            });
        }
    },

    createService: async (data) => {
        set({ isCreating: true, error: null });
        try {
            const res = await fetch('/api/services/create-service', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to create service');
            }

            set({ isCreating: false });
            get().fetchServices();
            return true;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Unknown error',
                isCreating: false,
            });
            return false;
        }
    },

    reset: () => set(initialState),
}));

export default useServiceStore;
