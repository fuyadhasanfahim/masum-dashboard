import { NextRequest, NextResponse } from 'next/server';
import EarningModel from '@/models/earning.model';
import { dbConnect } from '@/lib/db';
import { getRequiredSession } from '@/lib/auth-helper';

export async function PUT(req: NextRequest) {
    try {
        const { session, response } = await getRequiredSession();
        if (response) return response;

        await dbConnect();

        const body = await req.json();
        const { clientId, month, year, status } = body;

        if (!clientId || !month || !year || !status) {
            return NextResponse.json(
                { success: false, message: 'clientId, month, year, and status are required' },
                { status: 400 },
            );
        }

        const userId = session.user.id;
        const isAdmin = session.user.role === 'admin';

        // Filter by user if not admin
        const queryFilter = isAdmin 
            ? { client: clientId, month, year } 
            : { client: clientId, month, year, user: userId };

        const earning = await EarningModel.findOneAndUpdate(
            queryFilter,
            { status, user: userId },
            { upsert: true, new: true },
        ).lean();

        return NextResponse.json({ success: true, data: earning });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to update earning',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
