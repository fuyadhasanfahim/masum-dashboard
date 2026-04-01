import { NextRequest, NextResponse } from 'next/server';
import OrderModel from '@/models/order.model';
import EarningModel from '@/models/earning.model';
import { dbConnect } from '@/lib/db';
import mongoose from 'mongoose';
import { getRequiredSession } from '@/lib/auth-helper';

export async function GET(req: NextRequest) {
    try {
        const { session, response } = await getRequiredSession();
        if (response) return response;

        await dbConnect();

        const userId = session.user.id;
        const isAdmin = session.user.role === 'admin';
        const queryFilter = isAdmin ? {} : { user: userId };

        const { searchParams } = req.nextUrl;
        const month = searchParams.get('month')
            ? parseInt(searchParams.get('month')!)
            : undefined;
        const year = searchParams.get('year')
            ? parseInt(searchParams.get('year')!)
            : undefined;

        const matchStage: Record<string, unknown> = { ...queryFilter };
        if (month && year) {
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 1);
            matchStage.createdAt = { $gte: start, $lt: end };
        }

        const pipeline: mongoose.PipelineStage[] = [
            ...(Object.keys(matchStage).length > 0
                ? [{ $match: matchStage }]
                : []),
            {
                $group: {
                    _id: {
                        client: '$client',
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' },
                    },
                    totalImages: { $sum: { $ifNull: ['$images', 0] } },
                    totalPrice: { $sum: { $ifNull: ['$totalPrice', 0] } },
                    orderCount: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: '_id.client',
                    foreignField: '_id',
                    as: 'clientInfo',
                },
            },
            { $unwind: { path: '$clientInfo', preserveNullAndEmptyArrays: true } },
            {
                $sort: { '_id.year': -1 as const, '_id.month': -1 as const, 'clientInfo.name': 1 as const },
            },
            {
                $project: {
                    _id: {
                        $concat: [
                            { $toString: '$_id.client' },
                            '-',
                            { $toString: '$_id.month' },
                            '-',
                            { $toString: '$_id.year' },
                        ],
                    },
                    client: '$clientInfo',
                    month: '$_id.month',
                    year: '$_id.year',
                    totalImages: 1,
                    totalPrice: 1,
                    orderCount: 1,
                },
            },
        ];

        const aggregated = await OrderModel.aggregate(pipeline);

        // Fetch earning statuses for all client+month+year combos
        const earningStatuses = await EarningModel.find(queryFilter).lean();
        const statusMap = new Map<string, string>();
        for (const e of earningStatuses) {
            const key = `${e.client}-${e.month}-${e.year}`;
            statusMap.set(key, e.status);
        }

        // Merge status into aggregated data
        const result = aggregated.map((item) => {
            const clientId = item.client?._id?.toString() || '';
            const key = `${clientId}-${item.month}-${item.year}`;
            return {
                ...item,
                status: statusMap.get(key) || 'unpaid',
            };
        });

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch earnings',
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
