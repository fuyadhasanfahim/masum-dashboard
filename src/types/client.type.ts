export interface IClient {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    currency?: string;

    createdAt: Date;
    updatedAt: Date;
}

export type IClients = IClient[];
