import { IClient } from '@/types/client.type';

export interface ClientState {
    clients: IClient[];
    isLoading: boolean;
    isCreating: boolean;
    error: string | null;
}

export interface ClientActions {
    fetchClients: () => Promise<void>;
    createClient: (data: Partial<IClient>) => Promise<boolean>;
    reset: () => void;
}

export type ClientStore = ClientState & ClientActions;
