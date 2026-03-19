import { NextResponse } from 'next/server';
import ServiceModel from '@/models/service.model';
import { dbConnect } from '@/lib/db';

export async function GET() {
    try {
        await dbConnect();

        const services = await ServiceModel.find().sort({ name: 1 }).lean();

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
