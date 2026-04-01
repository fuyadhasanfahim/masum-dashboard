import { NextResponse } from 'next/server';
import ServiceModel from '@/models/service.model';
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

        const services = await ServiceModel.find(queryFilter).sort({ name: 1 }).lean();

        return NextResponse.json({
            success: true,
            data: services,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch services',
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
