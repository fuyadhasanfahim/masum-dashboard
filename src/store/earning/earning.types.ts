import { IEarningAggregated } from '@/types/earning.type';

export interface EarningState {
    earnings: IEarningAggregated[];
    isLoading: boolean;
    error: string | null;
}

export interface EarningActions {
    fetchEarnings: () => Promise<void>;
    reset: () => void;
}

export type EarningStore = EarningState & EarningActions;
