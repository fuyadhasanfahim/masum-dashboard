import { NextRequest, NextResponse } from 'next/server';
import ServiceModel from '@/models/service.model';
import { dbConnect } from '@/lib/db';

export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = req.nextUrl;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Service ID is required' },
                { status: 400 },
            );
        }

        const service = await ServiceModel.findByIdAndDelete(id);

        if (!service) {
            return NextResponse.json(
                { success: false, message: 'Service not found' },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, message: 'Service deleted' });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to delete service',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
