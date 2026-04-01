import { NextRequest, NextResponse } from 'next/server';
import ServiceModel from '@/models/service.model';
import { dbConnect } from '@/lib/db';
import { getRequiredSession } from '@/lib/auth-helper';

export async function POST(req: NextRequest) {
    try {
        const { session, response } = await getRequiredSession();
        if (response) return response;

        await dbConnect();

        const body = await req.json();

        if (!body.name) {
            return NextResponse.json(
                { success: false, message: 'Name is required' },
                { status: 400 },
            );
        }

        const service = await ServiceModel.create({
            user: session.user.id,
            name: body.name,
            description: body.description || undefined,
        });

        return NextResponse.json({
            success: true,
            data: service,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to create service',
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
