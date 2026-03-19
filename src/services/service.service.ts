import { IService } from '@/types/service.type';

export interface GetServicesResponse {
    success: boolean;
    data: IService[];
}

export const getServices = async (): Promise<GetServicesResponse> => {
    const res = await fetch('/api/services/get-services', {
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch services');

    return res.json();
};
