import { IClient } from '@/types/client.type';
import { model, models, Schema } from 'mongoose';

const clientSchema = new Schema<IClient>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

const ClientModel = models.Client || model<IClient>('Client', clientSchema);
export default ClientModel;
