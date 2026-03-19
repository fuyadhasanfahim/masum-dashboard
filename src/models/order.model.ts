import { IOrder } from '@/types/order.type';
import { model, models, Schema } from 'mongoose';

const orderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
        },
        service: {
            type: Schema.Types.ObjectId,
            ref: 'Service',
        },

        title: {
            type: String,
        },
        images: {
            type: Number,
        },
        downloadLink: {
            type: String,
        },
        localFileLocation: {
            type: String,
        },

        perImagePrice: {
            type: Number,
        },
        totalPrice: {
            type: Number,
        },

        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed', 'cancelled'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    },
);

const OrderModel = models.Order || model<IOrder>('Order', orderSchema);
export default OrderModel;
