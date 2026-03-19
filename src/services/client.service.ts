import { IClient } from '@/types/client.type';

export interface GetClientsResponse {
    success: boolean;
    data: IClient[];
}

export const getClients = async (): Promise<GetClientsResponse> => {
    const res = await fetch('/api/clients/get-clients', {
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch clients');

    return res.json();
};
