import { NextResponse } from 'next/server';
import OrderModel from '@/models/order.model';
import ClientModel from '@/models/client.model';
import '@/models/service.model';
import { dbConnect } from '@/lib/db';

export async function GET() {
    try {
        await dbConnect();

        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = thisMonthStart;
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

        // ── Card stats ─────────────────────────────────────────
        const [
            totalClientsCount,
            thisMonthOrders,
            lastMonthOrders,
            recentOrders,
            chartAgg,
        ] = await Promise.all([
            ClientModel.countDocuments(),

            // This month aggregate
            OrderModel.aggregate([
                { $match: { createdAt: { $gte: thisMonthStart } } },
                {
                    $group: {
                        _id: null,
                        revenue: { $sum: '$totalPrice' },
                        images: { $sum: '$images' },
                        count: { $sum: 1 },
                    },
                },
            ]),

            // Last month aggregate
            OrderModel.aggregate([
                { $match: { createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd } } },
                {
                    $group: {
                        _id: null,
                        revenue: { $sum: '$totalPrice' },
                        images: { $sum: '$images' },
                        count: { $sum: 1 },
                    },
                },
            ]),

            // Recent orders for table
            OrderModel.find()
                .populate('client')
                .populate('service')
                .sort({ createdAt: -1 })
                .limit(20)
                .lean(),

            // Daily chart data (last 90 days)
            OrderModel.aggregate([
                { $match: { createdAt: { $gte: ninetyDaysAgo } } },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                        },
                        revenue: { $sum: '$totalPrice' },
                        images: { $sum: '$images' },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
        ]);

        const curr = thisMonthOrders[0] || { revenue: 0, images: 0, count: 0 };
        const prev = lastMonthOrders[0] || { revenue: 0, images: 0, count: 0 };

        const pctChange = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        const cards = {
            totalRevenue: {
                value: curr.revenue,
                change: pctChange(curr.revenue, prev.revenue),
            },
            totalClients: {
                value: totalClientsCount,
            },
            totalOrders: {
                value: curr.count,
                change: pctChange(curr.count, prev.count),
            },
            totalImages: {
                value: curr.images,
                change: pctChange(curr.images, prev.images),
            },
        };

        // Fill missing dates in chart data
        const chartData = chartAgg.map((d: { _id: string; revenue: number; images: number }) => ({
            date: d._id,
            revenue: d.revenue || 0,
            images: d.images || 0,
        }));

        return NextResponse.json({
            success: true,
            cards,
            chartData,
            recentOrders,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch dashboard stats',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
