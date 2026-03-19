import { NextResponse } from 'next/server';
import ClientModel from '@/models/client.model';
import { dbConnect } from '@/lib/db';

export async function GET() {
    try {
        await dbConnect();

        const clients = await ClientModel.find().sort({ name: 1 }).lean();

        return NextResponse.json({
            success: true,
            data: clients,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch clients',
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
