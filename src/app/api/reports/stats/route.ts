import { NextResponse } from 'next/server';
import OrderModel from '@/models/order.model';
import ClientModel from '@/models/client.model';
import '@/models/service.model';
import { dbConnect } from '@/lib/db';

export async function GET() {
    try {
        await dbConnect();

        const now = new Date();
        const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

        const [
            monthlyRevenueAgg,
            topClientsAgg,
            orderStatusAgg
        ] = await Promise.all([
            // 1. Monthly Revenue (Last 12 Months)
            OrderModel.aggregate([
                { $match: { createdAt: { $gte: twelveMonthsAgo } } },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                        },
                        revenue: { $sum: '$totalPrice' },
                        images: { $sum: '$images' },
                    },
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
            ]),

            // 2. Top Clients by Revenue
            OrderModel.aggregate([
                { $match: { client: { $exists: true, $ne: null } } },
                {
                    $group: {
                        _id: '$client',
                        totalRevenue: { $sum: '$totalPrice' },
                        totalOrders: { $sum: 1 },
                    },
                },
                { $sort: { totalRevenue: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'clients',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'clientDoc',
                    },
                },
                { $unwind: '$clientDoc' },
                {
                    $project: {
                        name: '$clientDoc.name',
                        revenue: '$totalRevenue',
                        orders: '$totalOrders',
                    },
                },
            ]),

            // 3. Order Status Breakdown
            OrderModel.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ]),
        ]);

        // Format Monthly Data
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyRevenue = [];

        // Generate the last 12 months sequence
        let currentYear = twelveMonthsAgo.getFullYear();
        let currentMonth = twelveMonthsAgo.getMonth() + 1; // 1-12

        for (let i = 0; i < 12; i++) {
            const found = monthlyRevenueAgg.find(
                (m: any) => m._id.year === currentYear && m._id.month === currentMonth
            );

            monthlyRevenue.push({
                month: `${monthNames[currentMonth - 1]}`,
                revenue: found ? found.revenue : 0,
                images: found ? found.images : 0,
            });

            currentMonth++;
            if (currentMonth > 12) {
                currentMonth = 1;
                currentYear++;
            }
        }

        // Format Order Status
        const orderStatus = orderStatusAgg.map((s: any) => ({
            status: s._id,
            count: s.count,
        }));

        return NextResponse.json({
            success: true,
            monthlyRevenue,
            topClients: topClientsAgg,
            orderStatus,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch report stats',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
