import { IEarning } from '@/types/earning.type';
import { model, models, Schema } from 'mongoose';

const earningSchema = new Schema<IEarning>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        month: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['unpaid', 'partial', 'paid'],
            default: 'unpaid',
        },
    },
    {
        timestamps: true,
    },
);

earningSchema.index({ client: 1, month: 1, year: 1 }, { unique: true });

const EarningModel =
    models.Earning || model<IEarning>('Earning', earningSchema);
export default EarningModel;
