import { NextRequest, NextResponse } from 'next/server';
import ServiceModel from '@/models/service.model';
import { dbConnect } from '@/lib/db';
import { getRequiredSession } from '@/lib/auth-helper';

export async function PUT(req: NextRequest) {
    try {
        const { session, response } = await getRequiredSession();
        if (response) return response;

        await dbConnect();

        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Service ID is required' },
                { status: 400 },
            );
        }

        const userId = session.user.id;
        const isAdmin = session.user.role === 'admin';

        // Filter by user if not admin
        const queryFilter = isAdmin ? { _id: id } : { _id: id, user: userId };

        const service = await ServiceModel.findOneAndUpdate(queryFilter, updateData, {
            new: true,
        }).lean();

        if (!service) {
            return NextResponse.json(
                { success: false, message: 'Service not found' },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, data: service });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to update service',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
