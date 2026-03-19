import { NextRequest, NextResponse } from 'next/server';
import OrderModel from '@/models/order.model';
import { dbConnect } from '@/lib/db';

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Order ID is required' },
                { status: 400 },
            );
        }

        const order = await OrderModel.findByIdAndUpdate(id, updateData, {
            new: true,
        })
            .populate('client')
            .populate('service')
            .lean();

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to update order',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
