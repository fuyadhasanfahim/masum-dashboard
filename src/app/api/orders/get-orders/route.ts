import { NextRequest, NextResponse } from 'next/server';
import OrderModel from '@/models/order.model';
import '@/models/client.model';
import '@/models/service.model';
import { dbConnect } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = req.nextUrl;

        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '10');
        const skip = (page - 1) * perPage;
        const clientId = searchParams.get('clientId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter: Record<string, any> = {};

        if (search) {
            filter.$or = [{ title: { $regex: search, $options: 'i' } }];
        }

        if (clientId) {
            filter.client = clientId;
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lt = new Date(endDate);
        }

        const [orders, total] = await Promise.all([
            OrderModel.find(filter)
                .populate('client')
                .populate('service')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(perPage)
                .lean(),
            OrderModel.countDocuments(filter),
        ]);

        return NextResponse.json({
            success: true,
            data: orders,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage),
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch orders',
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
