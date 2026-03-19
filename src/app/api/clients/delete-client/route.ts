import { NextRequest, NextResponse } from 'next/server';
import ClientModel from '@/models/client.model';
import { dbConnect } from '@/lib/db';

export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = req.nextUrl;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Client ID is required' },
                { status: 400 },
            );
        }

        const client = await ClientModel.findByIdAndDelete(id);

        if (!client) {
            return NextResponse.json(
                { success: false, message: 'Client not found' },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, message: 'Client deleted' });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to delete client',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
