import { NextRequest, NextResponse } from 'next/server';
import ServiceModel from '@/models/service.model';
import { dbConnect } from '@/lib/db';

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Service ID is required' },
                { status: 400 },
            );
        }

        const service = await ServiceModel.findByIdAndUpdate(id, updateData, {
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
