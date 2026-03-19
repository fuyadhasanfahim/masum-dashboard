import { NextRequest, NextResponse } from 'next/server';
import EarningModel from '@/models/earning.model';
import { dbConnect } from '@/lib/db';

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const { clientId, month, year, status } = body;

        if (!clientId || !month || !year || !status) {
            return NextResponse.json(
                { success: false, message: 'clientId, month, year, and status are required' },
                { status: 400 },
            );
        }

        const earning = await EarningModel.findOneAndUpdate(
            { client: clientId, month, year },
            { status },
            { upsert: true, returnDocument: 'after' },
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
