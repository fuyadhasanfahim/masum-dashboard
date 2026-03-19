import { NextRequest, NextResponse } from 'next/server';
import EarningModel from '@/models/earning.model';
import OrderModel from '@/models/order.model';
import { dbConnect } from '@/lib/db';

export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = req.nextUrl;
        const clientId = searchParams.get('clientId');
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        if (!clientId || !month || !year) {
            return NextResponse.json(
                { success: false, message: 'clientId, month, and year are required' },
                { status: 400 },
            );
        }

        const m = parseInt(month);
        const y = parseInt(year);
        const start = new Date(y, m - 1, 1);
        const end = new Date(y, m, 1);

        // Delete the earning status record
        await EarningModel.deleteOne({
            client: clientId,
            month: m,
            year: y,
        });

        // Delete all associated orders
        await OrderModel.deleteMany({
            client: clientId,
            createdAt: { $gte: start, $lt: end },
        });

        return NextResponse.json({ success: true, message: 'Earning and associated orders deleted' });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to delete earning',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
