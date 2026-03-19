import { NextRequest, NextResponse } from 'next/server';
import ClientModel from '@/models/client.model';
import { dbConnect } from '@/lib/db';

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Client ID is required' },
                { status: 400 },
            );
        }

        const client = await ClientModel.findByIdAndUpdate(id, updateData, {
            returnDocument: 'after',
        }).lean();

        if (!client) {
            return NextResponse.json(
                { success: false, message: 'Client not found' },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, data: client });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to update client',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
