import { IService } from '@/types/service.type';
import { model, models, Schema } from 'mongoose';

const serviceSchema = new Schema<IService>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

const ServiceModel =
    models.Service || model<IService>('Service', serviceSchema);
export default ServiceModel;
