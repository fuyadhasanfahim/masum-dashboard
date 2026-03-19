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
            required: true,
        },
        service: {
            type: Schema.Types.ObjectId,
            ref: 'Service',
            required: true,
        },

        title: {
            type: String,
        },
        description: {
            type: String,
        },

        quantity: {
            type: Number,
            required: true,
        },
        perUnitPrice: {
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },

        downloadLink: {
            type: String,
            required: true,
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
