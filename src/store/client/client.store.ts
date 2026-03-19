import { create } from 'zustand';
import { ClientStore } from './client.types';
import { getClients } from '@/services/client.service';

const initialState = {
    clients: [],
    isLoading: false,
    isCreating: false,
    error: null,
};

const useClientStore = create<ClientStore>()((set, get) => ({
    ...initialState,

    fetchClients: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await getClients();
            set({
                clients: res.data,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Unknown error',
                isLoading: false,
            });
        }
    },

    createClient: async (data) => {
        set({ isCreating: true, error: null });
        try {
            const res = await fetch('/api/clients/create-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to create client');
            }

            set({ isCreating: false });
            get().fetchClients();
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

export default useClientStore;
