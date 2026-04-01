import { NextResponse } from 'next/server';
import ClientModel from '@/models/client.model';
import { dbConnect } from '@/lib/db';
import { getRequiredSession } from '@/lib/auth-helper';

export async function GET() {
    try {
        const { session, response } = await getRequiredSession();
        if (response) return response;

        await dbConnect();

        const userId = session.user.id;
        const isAdmin = session.user.role === 'admin';
        const queryFilter = isAdmin ? {} : { user: userId };

        const clients = await ClientModel.find(queryFilter).sort({ name: 1 }).lean();

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
