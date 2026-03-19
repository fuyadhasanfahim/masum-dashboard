import { IService } from '@/types/service.type';

export interface ServiceState {
    services: IService[];
    isLoading: boolean;
    isCreating: boolean;
    error: string | null;
}

export interface ServiceActions {
    fetchServices: () => Promise<void>;
    createService: (data: Partial<IService>) => Promise<boolean>;
    reset: () => void;
}

export type ServiceStore = ServiceState & ServiceActions;
