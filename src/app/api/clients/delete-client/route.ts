import { NextRequest, NextResponse } from 'next/server';
import ClientModel from '@/models/client.model';
import { dbConnect } from '@/lib/db';
import { getRequiredSession } from '@/lib/auth-helper';

export async function DELETE(req: NextRequest) {
    try {
        const { session, response } = await getRequiredSession();
        if (response) return response;

        await dbConnect();

        const { searchParams } = req.nextUrl;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Client ID is required' },
                { status: 400 },
            );
        }

        const userId = session.user.id;
        const isAdmin = session.user.role === 'admin';

        // Filter by user if not admin
        const queryFilter = isAdmin ? { _id: id } : { _id: id, user: userId };

        const client = await ClientModel.findOneAndDelete(queryFilter);

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
