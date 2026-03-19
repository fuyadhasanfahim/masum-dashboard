import { NextRequest, NextResponse } from 'next/server';
import OrderModel from '@/models/order.model';
import { dbConnect } from '@/lib/db';

export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = req.nextUrl;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Order ID is required' },
                { status: 400 },
            );
        }

        const order = await OrderModel.findByIdAndDelete(id);

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, message: 'Order deleted' });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to delete order',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
