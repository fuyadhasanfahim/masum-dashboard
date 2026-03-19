export interface IService {
    _id: string;
    name: string;
    description?: string;

    createdAt: Date;
    updatedAt: Date;
}

export type IServices = IService[];
